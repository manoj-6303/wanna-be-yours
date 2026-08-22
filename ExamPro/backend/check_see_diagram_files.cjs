const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Question = mongoose.model('Question', new mongoose.Schema({}, {strict:false}));
  const qs = await Question.find({ question: { $regex: /\(see diagram\)/i } });
  
  let missing = [];
  let exists = [];
  for (let q of qs) {
    if (q.questionImage) {
      const p = path.join('d:\\lakshya Demo\\ExamPro\\frontend\\public\\images', q.questionImage);
      if (fs.existsSync(p)) {
        exists.push(q);
      } else {
        missing.push(q);
      }
    } else {
      missing.push(q);
    }
  }
  console.log('Exists: ' + exists.length + ', Missing: ' + missing.length);
  process.exit(0);
});
