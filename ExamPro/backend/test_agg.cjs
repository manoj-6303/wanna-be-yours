require('dotenv').config();
require('mongoose').connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  try {
    const chapters = await Q.aggregate([
      { $group: { _id: { subject: '$subject', chapter: '$chapter' }, totalQuestions: { $sum: 1 }, questions: { $push: "$$ROOT" } } }
    ]);
    console.log('Aggregated chapters:', chapters.length);
  } catch (e) {
    console.error('Aggregation failed:', e.message);
  }
  process.exit(0);
});
