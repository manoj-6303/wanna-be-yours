require('dotenv').config();
const mongoose = require('mongoose');

async function fixChapters() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;
  
  const badDocs = await Q.find({ subject: "Chemistry", $or: [{chapter: null}, {chapter: 'undefined'}, {chapter: 'null'}, {chapter: undefined}, {chapter: ''}] });
  
  for (const doc of badDocs) {
    let matched = null;
    const s = doc.sourceFile.toLowerCase();
    if (s.includes('gaseous state')) matched = 'Gaseous State';
    else if (s.includes('periodic table')) matched = 'Periodic Table and Periodicity';
    else if (s.includes('redox')) matched = 'Redox Reactions';
    
    if (matched) {
      await Q.collection.updateOne({ _id: doc._id }, { $set: { chapter: matched, topic: matched } });
      console.log(`Fixed ${doc.sourceFile} -> ${matched}`);
    }
  }
  
  process.exit(0);
}

fixChapters();
