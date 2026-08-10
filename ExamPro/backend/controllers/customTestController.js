import Question from '../models/Question.js';
import Result from '../models/Result.js';

export const generateCustomTest = async (req, res) => {
  try {
    const { examType, subject, chapter, difficulty, count } = req.body;
    
    // Build query
    const query = { status: 'Published' };
    if (examType) query.examType = examType;
    if (subject) query.subject = subject;
    if (chapter) query.chapter = chapter;
    if (difficulty) query.difficulty = difficulty;

    // Fetch all matching questions
    const matchingQuestions = await Question.find(query);
    
    if (matchingQuestions.length === 0) {
      return res.status(404).json({ message: 'No questions found matching your criteria.' });
    }

    // Try to avoid recently answered questions
    const userResults = await Result.find({ userId: req.user._id }).sort({ createdAt: -1 }).limit(10);
    const previouslyAttemptedQuestionIds = new Set();
    
    userResults.forEach(result => {
      result.answers.forEach(ans => {
        if (ans.questionId) {
          previouslyAttemptedQuestionIds.add(ans.questionId.toString());
        }
      });
    });

    // Split matching questions into unattempted and attempted
    const unattempted = [];
    const attempted = [];
    
    matchingQuestions.forEach(q => {
      if (previouslyAttemptedQuestionIds.has(q._id.toString())) {
        attempted.push(q);
      } else {
        unattempted.push(q);
      }
    });

    // Shuffle both arrays
    unattempted.sort(() => Math.random() - 0.5);
    attempted.sort(() => Math.random() - 0.5);

    // Pick 'count' questions, prioritizing unattempted
    let selectedQuestions = [];
    const needed = parseInt(count, 10);
    
    if (unattempted.length >= needed) {
      selectedQuestions = unattempted.slice(0, needed);
    } else {
      selectedQuestions = [...unattempted];
      const remaining = needed - selectedQuestions.length;
      selectedQuestions = [...selectedQuestions, ...attempted.slice(0, remaining)];
    }

    // Final shuffle to mix unattempted and attempted
    selectedQuestions.sort(() => Math.random() - 0.5);

    res.status(200).json(selectedQuestions);
  } catch (error) {
    console.error('Error generating custom test:', error);
    res.status(500).json({ message: 'Server error generating custom test' });
  }
};
