require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  const doc = await Q.findOne({ question: { $regex: 'S_1' } });
  if (doc) {
    console.log(doc.question);
  }
  process.exit(0);
});
