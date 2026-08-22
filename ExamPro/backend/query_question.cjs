const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));
  const q = await Question.findOne({ question: { $regex: /Consider the sequence of reactions/i } });
  console.log(JSON.stringify(q, null, 2));
  process.exit(0);
});
