require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  const docs = await Q.find({ question: { $regex: 'x\\\\^2 \\\\+ y\\\\^2 - 4y' } }).limit(5);
  for (let doc of docs) {
    console.log(JSON.stringify(doc.question));
  }
  process.exit(0);
});
