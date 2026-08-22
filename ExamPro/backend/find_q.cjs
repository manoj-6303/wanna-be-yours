require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  const docs = await Q.find({ question: /Match the thermodynamic processes in List-I/ });
  for (const doc of docs) {
    console.log('ID:', doc._id);
    console.log('Subject:', doc.subject);
    console.log('Question:', doc.question);
    console.log('Image:', doc.questionImage);
    console.log('ExplanationImage:', doc.explanationImage);
  }
  process.exit();
});
