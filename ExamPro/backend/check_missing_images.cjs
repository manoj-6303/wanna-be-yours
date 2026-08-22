const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const FRONTEND_IMAGES_DIR = path.join(__dirname, '../frontend/public/images');

mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));
  
  const allQuestions = await Question.find({ questionImage: { $exists: true, $ne: null, $ne: '' } });
  
  let missing = [];
  for (let q of allQuestions) {
    if (!q.questionImage) continue;
    const imgPath = path.join(FRONTEND_IMAGES_DIR, q.questionImage);
    if (!fs.existsSync(imgPath)) {
      missing.push({
        id: q._id,
        subject: q.subject,
        chapter: q.chapter,
        difficulty: q.difficulty,
        questionImage: q.questionImage,
        question: q.question.substring(0, 100) + '...'
      });
    }
  }
  
  console.log(`Found ${missing.length} missing question images out of ${allQuestions.length} questions with questionImage.`);
  if (missing.length > 0) {
      console.log(JSON.stringify(missing, null, 2));
  }
  process.exit(0);
});
