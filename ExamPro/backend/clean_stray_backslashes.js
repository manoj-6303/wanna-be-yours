import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Question from './models/Question.js';

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const qs = await Question.find({ 
    $or: [
      { question: / \\ / },
      { 'options.text': / \\ / }
    ]
  });
  console.log('Questions with stray backslash space:', qs.length);
  
  if (qs.length > 0) {
    let updated = 0;
    for (let q of qs) {
      let qText = q.question;
      if (typeof qText === 'string') {
        qText = qText.replace(/ \\ /g, ' ');
      }
      
      let opts = q.options;
      if (opts && Array.isArray(opts)) {
        opts.forEach(opt => {
          if (typeof opt.text === 'string') {
            opt.text = opt.text.replace(/ \\ /g, ' ');
          }
        });
      }
      
      // Use updateOne to bypass Mongoose validation for old incomplete docs
      await Question.updateOne({ _id: q._id }, {
        $set: {
          question: qText,
          options: opts
        }
      });
      updated++;
    }
    console.log(`Cleaned up ${updated} questions in MongoDB.`);
  }

  process.exit(0);
});
