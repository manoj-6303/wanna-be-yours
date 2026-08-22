require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  const docs = await Q.find({ question: { $regex: '\b' } });
  console.log(`Found ${docs.length} questions with backspace`);
  if (docs.length > 0) {
    console.log(docs[0].question);
  }
  process.exit(0);
});
