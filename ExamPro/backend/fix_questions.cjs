const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));
  await Question.updateMany({ subject: 'Maths' }, { $set: { subject: 'Mathematics' } });
  console.log('Updated DB Questions');
  process.exit(0);
});
