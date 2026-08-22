const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Question = mongoose.model('Question', new mongoose.Schema({}, {strict:false}));
  const qs = await Question.find({ question: { $regex: /\(see diagram\)/i } });
  
  let updated = 0;
  for (let q of qs) {
    if (q.questionImage) {
      const p = path.join('d:\\lakshya Demo\\ExamPro\\frontend\\public\\images', q.questionImage);
      if (fs.existsSync(p)) {
        // Image exists, remove "(see diagram)" from the text
        const newText = q.question.replace(/\s*\(see diagram\)/gi, '');
        if (newText !== q.question) {
          await Question.updateOne({ _id: q._id }, { $set: { question: newText } });
          updated++;
        }
      }
    }
  }
  console.log(`Removed "(see diagram)" from ${updated} questions where the image exists.`);
  process.exit(0);
});
