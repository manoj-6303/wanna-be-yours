require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  
  const badMatch = {
    $or: [
      { question: { $regex: 'temporary placeholder question', $options: 'i' } },
      { 'options.0.text': { $regex: 'Placeholder Option', $options: 'i' } },
      { 'options.0.value': { $regex: 'Placeholder Option', $options: 'i' } }
    ]
  };
  
  const junkRes = await Q.deleteMany(badMatch);
  console.log(`Deleted ${junkRes.deletedCount} placeholder questions from database.`);

  const finalCount = await Q.countDocuments();
  console.log(`Total questions remaining: ${finalCount}`);
  
  process.exit(0);
});
