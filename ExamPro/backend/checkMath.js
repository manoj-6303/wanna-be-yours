import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const questionSchema = new mongoose.Schema({}, { strict: false });
const Question = mongoose.model('Question', questionSchema);

const check = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
    
    const q = await Question.findOne({ question: { $regex: /sphere of/i } });
    console.log("Raw question from DB:");
    console.log(q.question);
    console.log(JSON.stringify(q.question));
    
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

check();
