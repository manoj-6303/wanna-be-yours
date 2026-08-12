import Result from '../models/Result.js';
import Question from '../models/Question.js';
import User from '../models/User.js';
import Level from '../models/Level.js';
import ExamAttempt from '../models/ExamAttempt.js';
import ExamSecurityLog from '../models/ExamSecurityLog.js';
import ExamSecurityReport from '../models/ExamSecurityReport.js';
import Certificate from '../models/Certificate.js';
import crypto from 'crypto';

export const submitExam = async (req, res) => {
  try {
    const { level, answers, timeTaken } = req.body; 

    const questionIds = answers.map(a => a.questionId).filter(id => id);
    const questions = await Question.find({ _id: { $in: questionIds } });
    const levelData = await Level.findOne({ levelNumber: level });

    if (!questions.length || !levelData) {
      return res.status(404).json({ message: 'Level or questions not found' });
    }

    let correctCount = 0;
    let wrongCount = 0;
    let score = 0;

const cleanText = (raw) => {
  if (!raw) return '';
  let text = String(raw);
  text = text.replace(/This is a beautiful,?\s*classic question!?\s*Let's use this\.?/gi, '');
  text = text.replace(/Let's choose a different height or initial velocity\..*?Let's use this\./gs, '');
  text = text.replace(/Let's write the question with:.*$/gs, '');
  text = text.replace(/Let me keep it simple:?.*?(?=\.|$)/gi, '');
  text = text.replace(/Let's keep it simple:?/gi, '');
  text = text.replace(/\?\s*Wait,?\s*let's.*?\./gi, '.');
  text = text.replace(/\?\s*Wait!.*?\./gi, '.');
  text = text.replace(/\?\s*No!.*?\./gi, '.');
  text = text.replace(/Yes!\s*This is correct\.?/gi, '');
  text = text.replace(/\?\s*Wait,?\s*let's check:.*$/gi, '');
  text = text.replace(/Wait,?\s*let's check:?.*$/gi, '');
  text = text.replace(/Wait!\s*Let's check:?.*$/gi, '');
  text = text.replace(/Let's recalculate the ratio:?.*$/gi, '');
  text = text.replace(/Let's check the wording:?.*$/gi, '');
  if (text.includes("Let's recalculate")) text = text.split("Let's recalculate")[0];
  if (text.includes("What if the initial velocity")) text = text.split("What if the initial velocity")[0];
  if (text.includes("Let's choose a different")) text = text.split("Let's choose a different")[0];
  return text.trim();
};

    const evaluatedAnswers = answers.map(ans => {
      const q = questions.find(question => question._id.toString() === ans.questionId);
      const isCorrect = q && q.correctAnswer === ans.selectedAnswer;
      
      if (isCorrect) {
        correctCount++;
        score += q.marks || 1;
      } else if (ans.selectedAnswer) {
        wrongCount++;
      }

      const rawExp = q ? (q.explanation || q.solution || '') : '';
      const sanitizedExp = cleanText(rawExp);

      return {
        questionId: ans.questionId,
        selectedAnswer: ans.selectedAnswer,
        correct: isCorrect,
        correctAnswer: q ? q.correctAnswer : null,
        explanation: q ? q.explanation : null,
        explanationImage: q ? q.explanationImage : null,
        questionText: q ? q.question : null,
        questionImage: q ? q.questionImage : null,
        options: q ? q.options : [],
        optionImages: q ? q.optionImages : [],
        chapter: q ? q.chapter : null,
        difficulty: q ? q.difficulty : null
      };
    });

    const totalQuestions = answers.length;
    const percentage = Math.round((correctCount / totalQuestions) * 100);
    const qualified = percentage >= levelData.passingPercentage;

    const result = await Result.create({
      userId: req.user._id,
      level,
      totalQuestions,
      correctAnswers: correctCount,
      wrongAnswers: wrongCount,
      score,
      percentage,
      qualified,
      timeTaken,
      answers: evaluatedAnswers
    });



    let newCertificate = null;

    if (qualified) {
      const user = await User.findById(req.user._id);
      const alreadyCompleted = user.completedLevels.find(l => l.level === level);
      
      if (!alreadyCompleted) {
        user.coins += 1;
        user.completedLevels.push({ level, completedAt: Date.now(), score });

        if (user.currentLevel === level && level < 10) {
          user.currentLevel = level + 1;
        }

        // --- CERTIFICATE GENERATION ---
        if (user.completedLevels.length === 10) {
          // Check if already has certificate
          const existingCert = await Certificate.findOne({ studentId: user._id });
          if (!existingCert) {
            const avgScore = user.completedLevels.reduce((acc, curr) => acc + curr.score, 0) / 10;
            newCertificate = await Certificate.create({
              studentId: user._id,
              completedLevels: user.completedLevels.map(l => l.level),
              score: avgScore,
              certificateId: 'LAKSHYA-' + crypto.randomBytes(4).toString('hex').toUpperCase()
            });
          }
        }
        // ------------------------------

        await user.save();
      }
    }

    res.status(201).json({
      message: 'Exam evaluated successfully',
      result,
      qualified,
      newCertificate
    });

  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
