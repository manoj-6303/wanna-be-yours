const axios = require('axios');
(async () => {
  try {
    const mongoose = require('mongoose');
    await mongoose.connect('mongodb://localhost:27017/exampro');
    const Q = require('./models/Question.js').default;
    
    // Simulate the exact query
    const chapters = await Q.aggregate([
      { $match: {} },
      { $group: {
          _id: { subject: "$subject", chapter: "$chapter" },
          totalQuestions: { $sum: 1 },
          questions: { $push: "$$ROOT" }
      }},
      { $sort: { "_id.subject": 1, "_id.chapter": 1 } }
    ]);
    console.log('Chapters extracted:', chapters.length);
    let totalSize = JSON.stringify(chapters).length;
    console.log('Total JSON length:', totalSize / 1024 / 1024, 'MB');
  } catch(e) {
    console.error('Error in query:', e.message);
  }
  process.exit(0);
})();
