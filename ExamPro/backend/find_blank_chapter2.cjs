require('dotenv').config();
const mongoose = require('mongoose');

async function findBlankChapter() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;
  
  const docs = await Q.aggregate([
    { $match: { subject: 'Chemistry' } },
    { $group: { _id: '$chapter', count: { $sum: 1 } } }
  ]);
  
  docs.sort((a,b) => b.count - a.count);
  for (const d of docs) {
    if (d._id === undefined || d._id === null || typeof d._id !== 'string' || d._id.trim() === '' || d._id === 'undefined') {
      console.log(`[WEIRD CHAPTER] "${d._id}" - Count: ${d.count}`);
    }
  }
  
  process.exit(0);
}

findBlankChapter();
