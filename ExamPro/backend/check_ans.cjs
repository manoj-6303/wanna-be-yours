const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  const docs = await Q.find({ $or: [{options: {$exists: false}}, {options: {$size: 0}}] }).limit(10);
  docs.forEach(d => console.log('CorrectAnswer:', d.correctAnswer));
  process.exit();
});
