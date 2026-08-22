require('dotenv').config();
const mongoose = require('mongoose');

async function fixChapters() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;
  
  const badDocs = await Q.find({ subject: "Chemistry", $or: [{chapter: null}, {chapter: 'undefined'}, {chapter: 'null'}, {chapter: undefined}] });
  
  const counts = {};
  for (const doc of badDocs) {
    if (doc.sourceFile) {
      if (!counts[doc.sourceFile]) counts[doc.sourceFile] = 0;
      counts[doc.sourceFile]++;
    }
  }
  console.log(counts);
  process.exit(0);
}

fixChapters();
