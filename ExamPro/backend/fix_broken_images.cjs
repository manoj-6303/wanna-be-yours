require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function fixImages() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;

  const imagesPath = path.join(__dirname, '../QuestionBank/images');
  
  const physicsQuestions = await Q.find({
    subject: 'Physics',
    $or: [{ questionImage: { $ne: null } }, { explanationImage: { $ne: null } }]
  });

  let fixed = 0;
  for (const doc of physicsQuestions) {
    let updated = false;

    if (doc.questionImage) {
      const filename = path.basename(doc.questionImage);
      if (!fs.existsSync(path.join(imagesPath, filename))) {
        doc.questionImage = null;
        updated = true;
      }
    }

    if (doc.explanationImage) {
      const filename = path.basename(doc.explanationImage);
      if (!fs.existsSync(path.join(imagesPath, filename))) {
        doc.explanationImage = null;
        updated = true;
      }
    }

    if (updated) {
      await Q.collection.updateOne(
        { _id: doc._id },
        { $set: { questionImage: doc.questionImage, explanationImage: doc.explanationImage } }
      );
      fixed++;
    }
  }

  console.log(`Fixed broken images in ${fixed} questions.`);
  process.exit(0);
}

fixImages();
