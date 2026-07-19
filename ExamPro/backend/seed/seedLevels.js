import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Level from '../models/Level.js';

dotenv.config({ path: '../.env' });

const seedLevels = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    await Level.deleteMany();
    console.log('Cleared existing levels');

    const levels = [
      { levelNumber: 1, title: 'Level 1', subject: 'Physics', difficulty: 'Easy', fee: 20, duration: 15, questionCount: 10, passingPercentage: 50 },
      { levelNumber: 2, title: 'Level 2', subject: 'Physics', difficulty: 'Medium', fee: 20, duration: 15, questionCount: 10, passingPercentage: 70 },
      { levelNumber: 3, title: 'Level 3', subject: 'Physics', difficulty: 'Hard', fee: 20, duration: 15, questionCount: 10, passingPercentage: 90 },
      { levelNumber: 4, title: 'Level 4', subject: 'Chemistry', difficulty: 'Easy', fee: 20, duration: 15, questionCount: 10, passingPercentage: 50 },
      { levelNumber: 5, title: 'Level 5', subject: 'Chemistry', difficulty: 'Medium', fee: 20, duration: 15, questionCount: 10, passingPercentage: 70 },
      { levelNumber: 6, title: 'Level 6', subject: 'Chemistry', difficulty: 'Hard', fee: 20, duration: 15, questionCount: 10, passingPercentage: 90 },
      { levelNumber: 7, title: 'Level 7', subject: 'Mathematics A', difficulty: 'Medium', fee: 20, duration: 15, questionCount: 10, passingPercentage: 70 },
      { levelNumber: 8, title: 'Level 8', subject: 'Mathematics A', difficulty: 'Hard', fee: 20, duration: 15, questionCount: 10, passingPercentage: 90 },
      { levelNumber: 9, title: 'Level 9', subject: 'Mathematics B', difficulty: 'Medium', fee: 20, duration: 15, questionCount: 10, passingPercentage: 70 },
      { levelNumber: 10, title: 'Level 10', subject: 'Mathematics B', difficulty: 'Hard', fee: 20, duration: 15, questionCount: 10, passingPercentage: 90 },
    ];

    await Level.insertMany(levels);
    console.log('Seeded 10 Challenge Levels Successfully');

    process.exit(0);
  } catch (error) {
    console.error('Error seeding levels:', error);
    process.exit(1);
  }
};

seedLevels();
