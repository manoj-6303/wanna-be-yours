import Question from '../models/Question.js';
import Result from '../models/Result.js';
import AttemptHistory from '../models/AttemptHistory.js';
import Level from '../models/Level.js';
import mongoose from 'mongoose';

const LEVEL_CHAPTER_MAPPING = {
  1: ["Motion in One-Dimension", "Motion in Two-Dimension", "Units and Dimensions", "Mathematics in physics"],
  2: ["Newtons Law of Motion", "Work, Power ,Energy", "Circular Motion"],
  3: ["Center of Mass Momentum and Collision", "Rotational Motion", "Gravitation"],
  4: ["Machanical Properties of Solids", "Machanical Properties of Fluids", "Thermal Properties of Matter"],
  5: ["Calorimetry", "Kinetic Theory of Gases", "Heat Transfer"],
  6: ["Electrostatics", "Capacitance", "Current Electricity"],
  7: ["Magnetic effects and matters", "Magnetisum", "Electro Magnetic Induction"],
  8: ["Alternating Current", "Electro Magnetic Waves", "Simple Harmonic Motion -SHM"],
  9: ["Wave and Sound", "Ray Optics", "Wave Optics"],
  10: ["Atomic Physics", "Nuclear Physics", "Semi Conductor", "Communication System", "Experimental Physics"]
};

export const getQuestionsByLevel = async (req, res) => {
  try {
    const level = parseInt(req.params.level);
    const userId = req.user._id;

    // Get previous results for this user at this level
    const previousResults = await Result.find({ userId, level });
    const isPassed = previousResults.some(r => r.qualified);
    const attemptCount = previousResults.length;

    // Limit to 3 attempts if not qualified
    if (attemptCount >= 3 && !isPassed) {
      return res.status(403).json({ 
        message: 'Maximum 3 attempts reached for this level. Please review your weak topics.',
        attemptLimitReached: true,
        attemptCount
      });
    }

    // Extract ALL question IDs user has already answered across ALL past exams (Zero Repetition)
    const allUserResults = await Result.find({ userId });
    let answeredQuestionIds = [];
    allUserResults.forEach(result => {
      if (result.answers) {
        result.answers.forEach(ans => {
          if (ans.questionId) {
            answeredQuestionIds.push(ans.questionId.toString());
          }
        });
      }
    });

    const levelConfig = await Level.findOne({ levelNumber: level });
    if (!levelConfig) {
      return res.status(404).json({ message: 'Level configuration not found' });
    }

    const targetChapters = LEVEL_CHAPTER_MAPPING[level] || [];
    const { difficulty, questionCount } = levelConfig;
    const neededCount = questionCount || 10;

    // Primary Match: Same Level Topics + Exclude Answered Questions
    const primaryMatch = { status: 'Published' };
    if (targetChapters.length > 0) {
      primaryMatch.chapter = { $in: targetChapters };
    } else if (levelConfig.subject) {
      primaryMatch.subject = levelConfig.subject;
    }

    const targetDiagramCount = Math.min(3, Math.floor(neededCount * 0.3));
    const targetTextCount = neededCount - targetDiagramCount;
    const excludeObjectIds = answeredQuestionIds.map(id => new mongoose.Types.ObjectId(id));

    // 1. Sample Diagram-Based Questions (30% ratio)
    let diagramQuestions = await Question.aggregate([
      { 
        $match: { 
          ...primaryMatch, 
          questionImage: { $exists: true, $nin: ['', null] },
          _id: { $nin: excludeObjectIds } 
        } 
      },
      { $sample: { size: targetDiagramCount } }
    ]);

    const selectedDiagramIds = diagramQuestions.map(q => q._id);

    // 2. Sample Text-Based Questions (70% ratio)
    let textQuestions = await Question.aggregate([
      { 
        $match: { 
          ...primaryMatch, 
          $or: [
            { questionImage: { $exists: false } },
            { questionImage: '' },
            { questionImage: null }
          ],
          _id: { $nin: [...excludeObjectIds, ...selectedDiagramIds] } 
        } 
      },
      { $sample: { size: targetTextCount } }
    ]);

    let questions = [...diagramQuestions, ...textQuestions];

    // Fallback: If total fetched < neededCount, pull remaining from general pool
    if (questions.length < neededCount) {
      const currentIds = questions.map(q => q._id);
      const remainingCount = neededCount - questions.length;
      const fallbackQuestions = await Question.aggregate([
        { 
          $match: { 
            status: 'Published',
            _id: { $nin: [...excludeObjectIds, ...currentIds] } 
          } 
        },
        { $sample: { size: remainingCount } }
      ]);
      questions = [...questions, ...fallbackQuestions];
    }

    // Shuffle questions so diagram and text questions are intermixed
    questions = questions.sort(() => Math.random() - 0.5);

    // Sanitize response
    questions = questions.map(q => {
      const sanitized = { ...q };
      delete sanitized.correctAnswer;
      delete sanitized.explanation;
      delete sanitized.solution;
      return sanitized;
    });

    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const generateExam = async (req, res) => {
  try {
    const { examType, subject, chapter, difficulty, count } = req.body;
    
    // Build match query
    const matchQuery = { status: 'Published' };
    if (examType) {
      if (examType.toUpperCase().includes('JEE')) {
        matchQuery.examType = { $in: ['JEE', 'JEE Mains', 'JEE Main', 'JEE Advanced'] };
      } else {
        matchQuery.examType = new RegExp(examType, 'i');
      }
    }
    if (subject) matchQuery.subject = new RegExp(subject, 'i');
    if (chapter && chapter.trim()) matchQuery.chapter = new RegExp(chapter.trim(), 'i');
    if (difficulty && difficulty.trim()) matchQuery.difficulty = new RegExp(`^${difficulty.trim()}$`, 'i');

    const needed = parseInt(count, 10) || 10;
    const userId = req.user._id;

    // Fetch previous attempt history to avoid repeating questions
    const history = await AttemptHistory.find({ userId }).sort({ createdAt: -1 }).limit(10);
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

    // Fallback 1: If insufficient unattempted questions matching exact filters, allow attempted
    if (questions.length < needed) {
      const remaining = needed - questions.length;
      const excludeIds = questions.map(q => q._id);
      
      const fallbackQuestions = await Question.aggregate([
        { $match: { status: 'Published', _id: { $nin: excludeIds } } },
        { $sample: { size: remaining } }
      ]);
      questions = [...questions, ...fallbackQuestions];
    }

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found matching your criteria.' });
    }

    // Shuffle
    questions = questions.sort(() => Math.random() - 0.5);

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
