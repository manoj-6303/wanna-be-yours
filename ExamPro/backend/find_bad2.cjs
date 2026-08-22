require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  
  const badQs = await Q.find({
    $or: [
      { question: { $regex: 'The question corresponds to', $options: 'i' } },
      { 'options.value': { $regex: '^Option A$', $options: 'i' } },
      { 'options.text': { $regex: '^Option A$', $options: 'i' } }
    ]
  });
  console.log('Found bad questions:', badQs.length);
  for (let q of badQs) {
    console.log(q.question);
  }
  
  const junkRes = await Q.deleteMany({
    $or: [
      { question: { $regex: 'The question corresponds to', $options: 'i' } },
      { 'options.value': { $regex: '^Option A$', $options: 'i' } },
      { 'options.text': { $regex: '^Option A$', $options: 'i' } }
    ]
  });
  console.log(`Deleted ${junkRes.deletedCount} junk questions from database.`);
  process.exit(0);
});
