import mongoose from 'mongoose';
import User from '../models/User.js';
import Level from '../models/Level.js';
import Question from '../models/Question.js';
import bcrypt from 'bcrypt';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const autoSeed = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      console.log('Seeding initial demo users and levels...');
      const salt = await bcrypt.genSalt(10);
      const studentPassword = await bcrypt.hash('123456', salt);
      const adminPassword = await bcrypt.hash('admin', salt);

      await User.create([
        {
          name: 'Student User',
          email: 'student@test.com',
          password: studentPassword,
          role: 'student',
          examType: 'JEE',
          coins: 100,
          currentLevel: 1,
          completedLevels: []
        },
        {
          name: 'Admin User',
          email: 'admin@test.com',
          password: adminPassword,
          role: 'admin',
        }
      ]);
      console.log('Demo users created: student@test.com / 123456 and admin@test.com / admin');

      await Level.deleteMany({});
      await Level.insertMany([
        { levelNumber: 1, title: 'Physics Level 1: Kinematics & 1D/2D Motion', fee: 0, passingPercentage: 50, duration: 15, subject: 'Physics', difficulty: 'Easy', questionCount: 10 },
        { levelNumber: 2, title: 'Physics Level 2: Dynamics & Newton Laws', fee: 0, passingPercentage: 55, duration: 15, subject: 'Physics', difficulty: 'Easy', questionCount: 10 },
        { levelNumber: 3, title: 'Physics Level 3: Work, Energy & Collision', fee: 0, passingPercentage: 60, duration: 15, subject: 'Physics', difficulty: 'Easy', questionCount: 10 },
        { levelNumber: 4, title: 'Physics Level 4: Rotational Motion & Gravitation', fee: 0, passingPercentage: 65, duration: 20, subject: 'Physics', difficulty: 'Medium', questionCount: 10 },
        { levelNumber: 5, title: 'Physics Level 5: Properties of Matter & Heat', fee: 0, passingPercentage: 70, duration: 20, subject: 'Physics', difficulty: 'Medium', questionCount: 10 },
        { levelNumber: 6, title: 'Physics Level 6: Electrostatics & Capacitance', fee: 0, passingPercentage: 75, duration: 20, subject: 'Physics', difficulty: 'Medium', questionCount: 10 },
        { levelNumber: 7, title: 'Physics Level 7: Current Electricity & Magnetism', fee: 0, passingPercentage: 80, duration: 25, subject: 'Physics', difficulty: 'Hard', questionCount: 10 },
        { levelNumber: 8, title: 'Physics Level 8: EMI, AC & Electromagnetic Waves', fee: 0, passingPercentage: 85, duration: 25, subject: 'Physics', difficulty: 'Hard', questionCount: 10 },
        { levelNumber: 9, title: 'Physics Level 9: SHM, Sound & Optics', fee: 0, passingPercentage: 90, duration: 30, subject: 'Physics', difficulty: 'Hard', questionCount: 10 },
        { levelNumber: 10, title: 'Physics Level 10: Modern Physics & Grand Mock', fee: 0, passingPercentage: 90, duration: 30, subject: 'Physics', difficulty: 'Hard', questionCount: 10 }
      ]);
      console.log('10 Physics Challenge Levels created successfully.');
    }

    const qCount = await Question.countDocuments();
    if (qCount < 50) {
      console.log('Loading rich question bank from QuestionBank directory...');
      await Question.deleteMany({});
      
      const qBankDir = path.join(__dirname, '../../QuestionBank');
      const loadedQuestions = [];

      function loadDir(dir) {
        if (!fs.existsSync(dir)) return;
        const list = fs.readdirSync(dir);
        for (const file of list) {
          const fullPath = path.join(dir, file);
          const stat = fs.statSync(fullPath);
          if (stat && stat.isDirectory()) {
            loadDir(fullPath);
          } else if (file.endsWith('.json')) {
            try {
              const content = fs.readFileSync(fullPath, 'utf8');
              const data = JSON.parse(content);
              const items = Array.isArray(data) ? data : [data];
              items.forEach(q => {
                if (q.question) {
                  loadedQuestions.push({
                    level: q.level || (q.difficulty === 'Easy' ? 1 : q.difficulty === 'Medium' ? 2 : 3),
                    examType: q.examType || 'JEE Mains',
                    subject: q.subject || 'Physics',
                    chapter: q.chapter || 'General',
                    difficulty: ['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : 'Medium',
                    questionType: q.questionType || 'MCQ',
                    question: q.question,
                    questionImage: q.questionImage || q.image || '',
                    options: q.options || [],
                    correctAnswer: q.correctAnswer || (q.options ? q.options[0] : ''),
                    explanation: q.explanation || q.solution || '',
                    explanationImage: q.explanationImage || q.solutionImage || '',
                    solution: q.solution || q.explanation || '',
                    solutionImage: q.solutionImage || q.explanationImage || '',
                    previousYear: q.previousYear || '',
                    marks: q.marks || 4,
                    status: 'Published'
                  });
                }
              });
            } catch (err) {}
          }
        }
      }

      loadDir(qBankDir);

      if (loadedQuestions.length > 0) {
        await Question.insertMany(loadedQuestions);
        console.log(`Successfully loaded ${loadedQuestions.length} rich questions into database from QuestionBank.`);
      }
    }
  } catch (err) {
    console.error('Auto-seed error:', err.message);
  }
};

const connectDB = async () => {
  try {
    let mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      try {
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        const mongod = await MongoMemoryServer.create();
        mongoUri = mongod.getUri();
        console.log(`Using In-Memory MongoDB Server at: ${mongoUri}`);
      } catch (e) {
        mongoUri = 'mongodb://localhost:27017/exampro';
      }
    }
    const conn = await mongoose.connect(mongoUri);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    await autoSeed();
  } catch (error) {
    console.error(`Database Connection Error: ${error.message}`);
    // If connection failed (e.g. ECONNREFUSED), attempt MongoMemoryServer
    try {
      console.log('Attempting fallback to In-Memory MongoDB Server...');
      const { MongoMemoryServer } = await import('mongodb-memory-server');
      const mongod = await MongoMemoryServer.create();
      const mongoUri = mongod.getUri();
      const conn = await mongoose.connect(mongoUri);
      console.log(`MongoDB Connected (In-Memory Fallback): ${conn.connection.host}`);
      await autoSeed();
    } catch (fallbackErr) {
      console.error(`Fallback failed: ${fallbackErr.message}`);
      process.exit(1);
    }
  }
};

export default connectDB;

