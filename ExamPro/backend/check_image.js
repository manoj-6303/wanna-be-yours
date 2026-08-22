import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Question from './models/Question.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const qs = await Question.find({ questionImage: { $ne: null, $ne: '' } }).limit(2);
  console.log(JSON.stringify(qs.map(q => q.questionImage), null, 2));
  process.exit(0);
});
