import Question from '../models/Question.js';
import Result from '../models/Result.js';
import AttemptHistory from '../models/AttemptHistory.js';
import Level from '../models/Level.js';
import mongoose from 'mongoose';

export const getQuestionsByLevel = async (req, res) => {
  try {
    const level = parseInt(req.params.level);
    const userId = req.user._id;

    // Get previous results for this user at this level
    const previousResults = await Result.find({ userId, level });

    // Limit attempts to 3
    // if (previousResults.length >= 3) {
    //   return res.status(403).json({ message: 'Maximum of 3 attempts reached for this level.' });
    // }

    // Check if user already passed this level
    const hasPassed = previousResults.some(r => r.qualified === true);
    if (hasPassed) {
      return res.status(403).json({ message: 'You have already passed this level and cannot retake it.' });
    }
    
    // Extract question IDs they have already answered
    let answeredQuestionIds = [];
    previousResults.forEach(result => {
      if (result.answers) {
        result.answers.forEach(ans => {
          if (ans.questionId) {
            answeredQuestionIds.push(ans.questionId.toString());
          }
        });
      }
    });

    // Fetch the Level configuration
    const levelConfig = await Level.findOne({ levelNumber: level });
    if (!levelConfig) {
      return res.status(404).json({ message: 'Level configuration not found' });
    }

    // Check if there is an active published WeeklyTest for this level
    const WeeklyTest = (await import('../models/WeeklyTest.js')).default;
    const activeTest = await WeeklyTest.findOne({ level, status: 'Published' }).sort({ createdAt: -1 });

    let questions = [];

    if (activeTest && activeTest.questionIds && activeTest.questionIds.length > 0) {
      const neededCount = levelConfig.questionCount || 10;
      
      // Filter out questions they've already seen
      let poolIds = activeTest.questionIds.filter(id => !answeredQuestionIds.includes(id.toString()));
      
      // If we don't have enough fresh questions, fallback to using some seen ones
      if (poolIds.length < neededCount) {
        const seenInPool = activeTest.questionIds.filter(id => answeredQuestionIds.includes(id.toString()));
        poolIds = [...poolIds.sort(() => 0.5 - Math.random()), ...seenInPool.sort(() => 0.5 - Math.random())];
      } else {
        poolIds = poolIds.sort(() => 0.5 - Math.random());
      }
      
      const selectedIds = poolIds.slice(0, neededCount);
      questions = await Question.find({ _id: { $in: selectedIds } });
      
    } else {
      // Fallback: Dynamic Random Generation (if no WeeklyTest is published for this level)
      const { subject, difficulty, questionCount, chapter, examType } = levelConfig;
      const matchQuery = { status: 'Published', subject, difficulty };
      if (chapter) matchQuery.chapter = chapter;
      if (examType && examType !== 'General') matchQuery.examType = examType;

      questions = await Question.aggregate([
        { $match: { ...matchQuery, _id: { $nin: answeredQuestionIds.map(id => new mongoose.Types.ObjectId(id)) } } },
        { $sample: { size: questionCount } }
      ]);

      if (questions.length < questionCount) {
        const remaining = questionCount - questions.length;
        const excludeIds = questions.map(q => q._id);
        
        const fallbackQuestions = await Question.aggregate([
          { $match: { ...matchQuery, _id: { $nin: excludeIds } } },
          { $sample: { size: remaining } }
        ]);
        questions = [...questions, ...fallbackQuestions];
      }
    }
    
    // Remove sensitive fields
    questions = questions.map(q => {
      delete q.correctAnswer;
      delete q.explanation;
      return q;
    });
    
    if (questions.length > 0) {
      res.json(questions);
    } else {
      res.status(404).json({ message: 'No questions found for this level' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const generateExam = async (req, res) => {
  try {
    const { examType, subject, chapter, difficulty, count } = req.body;
    
    // Build match query
    const matchQuery = { status: 'Published' };
    if (examType) matchQuery.examType = examType;
    if (subject) matchQuery.subject = subject;
    if (chapter) matchQuery.chapter = chapter;
    if (difficulty) matchQuery.difficulty = difficulty;

    const needed = parseInt(count, 10) || 10;
    const userId = req.user._id;

    // Fetch previous attempt history to avoid repeating questions
    const history = await AttemptHistory.find({ userId, examType }).sort({ createdAt: -1 }).limit(10);
    const attemptedIds = [];
    history.forEach(h => {
      if (h.questionIds) {
        h.questionIds.forEach(id => attemptedIds.push(new mongoose.Types.ObjectId(id)));
      }
    });

    let questions = await Question.aggregate([
      { $match: { ...matchQuery, _id: { $nin: attemptedIds } } },
      { $sample: { size: needed } }
    ]);

    // If insufficient unattempted questions, fetch remaining from attempted questions
    if (questions.length < needed) {
      const remaining = needed - questions.length;
      const excludeIds = questions.map(q => q._id);
      
      const fallbackQuestions = await Question.aggregate([
        { $match: { ...matchQuery, _id: { $in: attemptedIds, $nin: excludeIds } } },
        { $sample: { size: remaining } }
      ]);
      questions = [...questions, ...fallbackQuestions];
    }

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found matching your criteria.' });
    }

    // Record this attempt
    await AttemptHistory.create({
      userId,
      examType: examType || 'General',
      filters: { subject, chapter, difficulty, count },
      questionIds: questions.map(q => q._id)
    });

    res.status(200).json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error generating exam', error: error.message });
  }
};
