const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));
  await Question.updateMany(
    { topic: 'Complex Numbers', chapter: { $exists: false } },
    { $set: { chapter: 'Complex Numbers', status: 'Published' } }
  );
  console.log('Updated db');
  process.exit(0);
});
