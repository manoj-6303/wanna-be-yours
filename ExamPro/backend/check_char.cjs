require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  const doc = await Q.findOne({ question: { $regex: 'x\\^2 \\+ y\\^2 - 4y' } });
  if (doc) {
    const qStr = doc.question;
    const index = qStr.indexOf('rac{');
    if (index !== -1) {
      console.log('Character before rac{ is code point:', qStr.charCodeAt(index - 1));
      console.log('Character before that is code point:', qStr.charCodeAt(index - 2));
    } else {
      console.log('rac{ not found');
    }
  } else {
    console.log('Not found');
  }
  process.exit(0);
});
