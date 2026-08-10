import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/Question.js';

dotenv.config();

const questions = [
  {
    examType: "General",
    subject: "Physics",
    chapter: "Kinematics",
    difficulty: "Easy",
    questionType: "MCQ",
    question: "What is the unit of velocity?",
    options: ["m/s", "m/s^2", "kg", "Newton"],
    correctAnswer: "m/s",
    explanation: "Velocity is displacement per unit time, so the unit is meters per second (m/s).",
    level: 1,
    marks: 1,
    status: "Published"
  },
  {
    examType: "General",
    subject: "Physics",
    chapter: "Kinematics",
    difficulty: "Medium",
    questionType: "MCQ",
    question: "A car accelerates from rest at a constant rate of 2 m/s^2 for 5 seconds. What is its final velocity?",
    options: ["5 m/s", "10 m/s", "20 m/s", "25 m/s"],
    correctAnswer: "10 m/s",
    explanation: "Using v = u + at, where u=0, a=2, t=5. v = 0 + (2)(5) = 10 m/s.",
    level: 1,
    marks: 1,
    status: "Published"
  },
  {
    examType: "General",
    subject: "Physics",
    chapter: "Dynamics",
    difficulty: "Medium",
    questionType: "MCQ",
    question: "What is the force required to accelerate a 5 kg mass at 2 m/s^2?",
    options: ["5 N", "10 N", "7 N", "3 N"],
    correctAnswer: "10 N",
    explanation: "Force = mass x acceleration. F = 5 * 2 = 10 N.",
    level: 1,
    marks: 1,
    status: "Published"
  },
  {
    examType: "General",
    subject: "Math",
    chapter: "Algebra",
    difficulty: "Easy",
    questionType: "MCQ",
    question: "Solve for x: 3x - 5 = 10",
    options: ["3", "5", "10", "15"],
    correctAnswer: "5",
    explanation: "3x = 10 + 5 => 3x = 15 => x = 5.",
    level: 1,
    marks: 1,
    status: "Published"
  },
  {
    examType: "General",
    subject: "Math",
    chapter: "Geometry",
    difficulty: "Hard",
    questionType: "MCQ",
    question: "What is the area of a circle with radius 5?",
    options: ["10pi", "20pi", "25pi", "50pi"],
    correctAnswer: "25pi",
    explanation: "Area = pi * r^2. r=5, so Area = 25pi.",
    level: 1,
    marks: 1,
    status: "Published"
  }
];

const seedQuestions = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    console.log('Connected to Database');
    
    const result = await Question.insertMany(questions);
    console.log(`${result.length} questions inserted successfully.`);
    
    process.exit(0);
  } catch (error) {
    console.error('Error inserting questions:', error);
    process.exit(1);
  }
};

seedQuestions();
