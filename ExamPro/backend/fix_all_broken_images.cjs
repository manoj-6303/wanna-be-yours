require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function fixImages() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;

  const imagesPath = path.join(__dirname, '../QuestionBank/images');
  
  // Find questions with images OR with "(see diagram)" text
  const questions = await Q.find({
    $or: [
      { questionImage: { $ne: null } },
      { explanationImage: { $ne: null } },
      { image: { $ne: null } },
      { question: { $regex: /\(see diagram\)/i } },
      { question: { $regex: /\[see diagram\]/i } },
      { question: { $regex: /see diagram/i } }
    ]
  });

  let fixed = 0;
  for (const doc of questions) {
    let updated = false;

    const checkImage = (imgField) => {
      if (doc[imgField]) {
        let p = doc[imgField];
        // some are "aromatic medium/..." some are just "filename.png"
        let filename = path.basename(p);
        let fullPath = path.join(imagesPath, p);
        if (p.includes('/')) fullPath = path.join(imagesPath, p); // if it has folders
        else fullPath = path.join(imagesPath, filename);
        
        if (!fs.existsSync(fullPath)) {
          // also check base name just in case
          if (!fs.existsSync(path.join(imagesPath, filename))) {
            doc[imgField] = null;
            updated = true;
          } else {
            doc[imgField] = filename;
            updated = true;
          }
        }
      }
    };

    checkImage('questionImage');
    checkImage('explanationImage');
    checkImage('image');
    
    if (doc.question) {
      if (doc.questionImage === null || doc.image === null || (!doc.questionImage && !doc.image)) {
        // if image is broken or missing, remove " (see diagram)" from text
        const originalText = doc.question;
        doc.question = doc.question.replace(/\s*\(\s*see diagram\s*\)/gi, '');
        doc.question = doc.question.replace(/\s*\[\s*see diagram\s*\]/gi, '');
        doc.question = doc.question.replace(/\s*see diagram\s*/gi, '');
        if (doc.question !== originalText) {
          updated = true;
        }
      }
    }

    if (updated) {
      await Q.collection.updateOne(
        { _id: doc._id },
        { $set: { 
          questionImage: doc.questionImage, 
          explanationImage: doc.explanationImage, 
          image: doc.image,
          question: doc.question
        }}
      );
      fixed++;
    }
  }

  console.log(`Fixed broken images or text in ${fixed} questions.`);
  process.exit(0);
}

fixImages();
