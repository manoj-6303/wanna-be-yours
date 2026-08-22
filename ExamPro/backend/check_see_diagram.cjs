const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));
  
  const allQuestions = await Question.find({ question: { $regex: /\(see diagram\)/i } });
  
  console.log(`Found ${allQuestions.length} questions containing "(see diagram)".`);
  for (let q of allQuestions) {
    console.log(`ID: ${q._id} | Subject: ${q.subject} | Chapter: ${q.chapter} | Image: ${q.questionImage}`);
    console.log(`Source: ${q.sourceFile}`);
  }
  process.exit(0);
});
