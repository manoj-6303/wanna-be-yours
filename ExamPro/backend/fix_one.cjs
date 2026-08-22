require('dotenv').config();
require('mongoose').connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const fs = require('fs');
  const Q = require('./models/Question.js').default;
  const data = JSON.parse(fs.readFileSync('../QuestionBank/JeeMains/Chemistry/Aromatic Compounds/medium.json'));
  for (const q of data) {
    if (q.question.includes('liberate carbon dioxide')) {
      const dbQ = await Q.findOne({ chapter: 'Aromatic Compounds', question: /liberate/ });
      console.log('DB found:', !!dbQ);
      if(dbQ) {
        await Q.collection.updateOne({_id: dbQ._id}, {$set: {questionImage: q.questionImage}});
        console.log('Fixed:', q.questionImage);
      }
    }
  }
  process.exit(0);
});
