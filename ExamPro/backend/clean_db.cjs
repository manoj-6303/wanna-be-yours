require('dotenv').config();
const crypto = require('crypto');
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  
  // 1. Delete Gemini junk questions
  const junkMatch = {
    $or: [
      { question: { $regex: 'The question corresponds to Q[0-9]+ based on the solutions', $options: 'i' } },
      { 'options.0.text': { $regex: '^Option A$', $options: 'i' } }
    ]
  };
  
  const junkRes = await Q.deleteMany(junkMatch);
  console.log(`Deleted ${junkRes.deletedCount} junk questions from database.`);

  // 2. Deduplicate
  const allQs = await Q.find({});
  let duplicates = 0;
  const seenHashes = new Set();
  const toDelete = [];

  for (let q of allQs) {
    const hash = crypto.createHash('sha256').update(q.question.trim().toLowerCase()).digest('hex');
    if (seenHashes.has(hash)) {
      toDelete.push(q._id);
      duplicates++;
    } else {
      seenHashes.add(hash);
      // Optional: update hash in DB if it's missing (though it might fail on unique index if we aren't careful, but since we deduplicate here it's fine)
    }
  }

  if (toDelete.length > 0) {
    const dedupRes = await Q.deleteMany({ _id: { $in: toDelete } });
    console.log(`Deleted ${dedupRes.deletedCount} duplicate questions from database.`);
  } else {
    console.log('No duplicates found.');
  }

  const finalCount = await Q.countDocuments();
  console.log(`Total questions remaining: ${finalCount}`);
  
  process.exit(0);
});
