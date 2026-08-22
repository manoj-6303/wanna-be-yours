import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import axios from 'axios';
import User from './models/User.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const adminUser = await User.findOne({ role: 'admin' });
  if (!adminUser) return console.log('no admin');
  
  const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  console.log('Generated token');
  
  try {
    const res = await axios.post('http://localhost:5000/api/v1/weekly-tests', { 
      title: 'Test', 
      level: 1, 
      subject: 'Physics', 
      chapter: 'Calorimetry', 
      difficulty: 'Easy', 
      fee: 0, 
      duration: 15, 
      questionCount: 10, 
      passingPercentage: 60, 
      questionIds: [], 
      status: 'Published' 
    }, { 
      headers: { Authorization: `Bearer ${token}` } 
    });
    console.log('Success:', res.data);
  } catch (error) {
    console.error('Status:', error.response?.status);
    console.error('Data:', error.response?.data);
  }
  process.exit(0);
});
