require('dotenv').config();
const mongoose = require('mongoose');

async function findBlankChapter() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;
  
  const blankQuestions = await Q.find({ subject: "Chemistry", chapter: { $in: ["", " ", null, undefined] } });
  console.log(`Found ${blankQuestions.length} Chemistry questions with blank chapter.`);
  
  if (blankQuestions.length > 0) {
    const sample = blankQuestions[0];
    console.log("Sample question topic/chapter info:");
    console.log(`Topic: "${sample.topic}"`);
    console.log(`Chapter: "${sample.chapter}"`);
    console.log(`Source File: "${sample.sourceFile}"`);
    console.log(`Tags:`, sample.tags);
  }
  
  process.exit(0);
}

findBlankChapter();
