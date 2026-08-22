const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));
  const result = await Question.updateMany(
    { subject: 'Maths' },
    { $set: { subject: 'Mathematics' } }
  );
  console.log(`Matched ${result.matchedCount} questions. Modified ${result.modifiedCount} questions.`);
  mongoose.disconnect();
}).catch(console.error);
