import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';

dotenv.config();

// The structure requested by the user
interface RawQuestion {
  question: string;
  examType: string;
  subject: string;
  chapter: string;
  difficulty: "Easy" | "Medium" | "Hard";
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctAnswer: string;
  explanation: string;
}

// Add your questions here based on your format
const myQuestions: RawQuestion[] = [
  {
    question: "What is the capital of France?",
    examType: "General",
    subject: "Geography",
    chapter: "Europe",
    difficulty: "Easy",
    optionA: "Berlin",
    optionB: "Madrid",
    optionC: "Paris",
    optionD: "Rome",
    correctAnswer: "Paris",
    explanation: "Paris is the capital and most populous city of France."
  },
  {
    question: "Which planet is known as the Red Planet?",
    examType: "General",
    subject: "Science",
    chapter: "Solar System",
    difficulty: "Easy",
    optionA: "Earth",
    optionB: "Mars",
    optionC: "Jupiter",
    optionD: "Venus",
    correctAnswer: "Mars",
    explanation: "Mars is known as the Red Planet due to the iron oxide on its surface."
  }
];

const importQuestions = async () => {
  try {
    if (!process.env.MONGO_URI) {
      throw new Error("MONGO_URI is not defined in .env");
    }

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to Database');

    // Transform RawQuestion to the schema format expected by the application
    const transformedQuestions = myQuestions.map(q => ({
      question: q.question,
      examType: q.examType,
      subject: q.subject,
      chapter: q.chapter,
      difficulty: q.difficulty,
      options: [q.optionA, q.optionB, q.optionC, q.optionD],
      correctAnswer: q.correctAnswer,
      explanation: q.explanation,
      questionType: "MCQ",
      level: 1, // Defaulting to level 1, can be changed
      status: "Published",
      marks: 1
    }));

    const result = await Question.insertMany(transformedQuestions);
    console.log(`${result.length} questions imported successfully!`);

    process.exit(0);
  } catch (error) {
    console.error('Error importing questions:', error);
    process.exit(1);
  }
};

importQuestions();
