import User from '../models/User.js';
import Payment from '../models/Payment.js';
import Result from '../models/Result.js';
import Question from '../models/Question.js';
import fs from 'fs';
import csvParser from 'csv-parser';
import xlsx from 'xlsx';

export const getUsers = async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: 'student' });
    const totalPayments = await Payment.countDocuments({ status: 'SUCCESS' });
    
    // Calculate total revenue
    const payments = await Payment.find({ status: 'SUCCESS' });
    const revenue = payments.reduce((acc, curr) => acc + curr.amount, 0);

    const totalTests = await Result.countDocuments();
    const passedTests = await Result.countDocuments({ qualified: true });

    res.json({
      totalUsers,
      totalPayments,
      revenue,
      totalTests,
      passedTests
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (user) {
      user.isBlocked = false;
      await user.save();
      res.json({ message: 'User unblocked successfully' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getCertificates = async (req, res) => {
  try {
    const { default: Certificate } = await import('../models/Certificate.js');
    const certificates = await Certificate.find({}).populate('studentId', 'name email');
    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch certificates', error: error.message });
  }
};

export const getAnalytics = async (req, res) => {
  try {
    const results = await Result.find({});
    
    let wrongQuestionsMap = {};
    let topicsMap = {};
    let difficultyMap = {};
    let attemptedQuestionsMap = {};
    let totalScore = 0;
    let highestScore = 0;
    let lowestScore = Infinity;
    
    // Distinct students appeared
    const uniqueStudents = new Set(results.map(r => r.userId.toString())).size;

    results.forEach(result => {
      totalScore += result.score;
      if (result.score > highestScore) highestScore = result.score;
      if (result.score < lowestScore) lowestScore = result.score;

      result.answers.forEach(ans => {
        // Track attempted questions
        if (!attemptedQuestionsMap[ans.questionId]) {
          attemptedQuestionsMap[ans.questionId] = {
             questionId: ans.questionId,
             text: ans.questionText || 'Unknown Question',
             attempts: 0
          };
        }
        attemptedQuestionsMap[ans.questionId].attempts++;

        // Track difficulty performance
        const diff = ans.difficulty || 'Unknown';
        if (!difficultyMap[diff]) difficultyMap[diff] = { total: 0, wrong: 0 };
        difficultyMap[diff].total++;

        if (!ans.correct && ans.selectedAnswer) {
          difficultyMap[diff].wrong++;

          // Track wrong questions
          if (!wrongQuestionsMap[ans.questionId]) {
            wrongQuestionsMap[ans.questionId] = {
              questionId: ans.questionId,
              text: ans.questionText || 'Unknown Question',
              chapter: ans.chapter || 'Unknown Topic',
              wrongCount: 0
            };
          }
          wrongQuestionsMap[ans.questionId].wrongCount++;

          // Track difficult topics
          const topic = ans.chapter || 'Unknown Topic';
          if (!topicsMap[topic]) {
            topicsMap[topic] = { wrong: 0, total: 0 };
          }
          topicsMap[topic].wrong++;
        }
        
        const topic = ans.chapter || 'Unknown Topic';
        if (!topicsMap[topic]) {
          topicsMap[topic] = { wrong: 0, total: 0 };
        }
        topicsMap[topic].total++;
      });
    });

    const averageScore = results.length > 0 ? (totalScore / results.length).toFixed(2) : 0;
    if (lowestScore === Infinity) lowestScore = 0;

    const mostWrongQuestions = Object.values(wrongQuestionsMap)
      .sort((a, b) => b.wrongCount - a.wrongCount)
      .slice(0, 10);

    const mostAttemptedQuestions = Object.values(attemptedQuestionsMap)
      .sort((a, b) => b.attempts - a.attempts)
      .slice(0, 10);

    const difficultTopics = Object.entries(topicsMap)
      .map(([topic, data]) => ({ topic, count: data.wrong, wrong: data.wrong, total: data.total, errorRate: ((data.wrong / data.total) * 100).toFixed(2) }))
      .sort((a, b) => b.errorRate - a.errorRate)
      .slice(0, 10);

    const difficultyPerformance = Object.entries(difficultyMap)
      .map(([difficulty, data]) => ({ difficulty, total: data.total, wrong: data.wrong, errorRate: ((data.wrong / data.total) * 100).toFixed(2) }));

    res.status(200).json({ 
      testsConducted: results.length,
      studentsAppeared: uniqueStudents,
      averageScore: parseFloat(averageScore),
      highestScore,
      lowestScore,
      mostWrongQuestions, 
      mostAttemptedQuestions,
      difficultTopics,
      difficultyPerformance
    });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch analytics', error: error.message });
  }
};

export const uploadBank = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileExt = req.file.originalname.split('.').pop().toLowerCase();
    const questionsToInsert = [];

    if (fileExt === 'csv') {
      const results = [];
      await new Promise((resolve, reject) => {
        fs.createReadStream(req.file.path)
          .pipe(csvParser())
          .on('data', (data) => results.push(data))
          .on('end', () => resolve())
          .on('error', (err) => reject(err));
      });
      
      results.forEach(row => {
        questionsToInsert.push(formatQuestionRow(row));
      });
    } else if (fileExt === 'xlsx') {
      const workbook = xlsx.readFile(req.file.path);
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const results = xlsx.utils.sheet_to_json(worksheet);
      
      results.forEach(row => {
        questionsToInsert.push(formatQuestionRow(row));
      });
    } else {
      fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Unsupported file format. Please upload CSV or Excel.' });
    }

    // Clean up valid questions
    const validQuestions = questionsToInsert.filter(q => q && q.question && q.options && q.correctAnswer);
    
    if (validQuestions.length > 0) {
      await Question.insertMany(validQuestions);
    }
    
    fs.unlinkSync(req.file.path);
    res.status(200).json({ message: `Successfully imported ${validQuestions.length} questions.` });
  } catch (error) {
    if (req.file && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
    res.status(500).json({ message: 'Failed to process file', error: error.message });
  }
};

function formatQuestionRow(row) {
  try {
    return {
      level: row.level || 0,
      examType: row.examType || 'JEE',
      subject: row.subject,
      chapter: row.chapter,
      difficulty: row.difficulty || 'Medium',
      questionType: row.questionType || 'MCQ',
      question: row.question,
      options: [row.optionA, row.optionB, row.optionC, row.optionD].filter(Boolean),
      correctAnswer: row.correctAnswer,
      explanation: row.explanation || '',
      solution: row.solution || '',
      previousYear: row.previousYear || '',
      tags: row.tags ? String(row.tags).split(',').map(t => t.trim()) : [],
      status: 'Published'
    };
  } catch (e) {
    return null;
  }
}
