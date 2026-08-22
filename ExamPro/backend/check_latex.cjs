require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  const docs = await Q.find({ question: { $regex: /200/ } });
  for (const doc of docs) {
    if (doc.question.includes('200') && doc.question.includes('300 rad/s')) {
      console.log('Question:', doc.question);
      console.log('Options:', doc.options);
    }
  }
  process.exit();
});