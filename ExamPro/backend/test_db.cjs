const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const db = mongoose.connection.db;
  const q = await db.collection('questions').findOne({ _id: new mongoose.Types.ObjectId("6a7d6de4247144f38d40be51") });
  console.log('Sample question fields:', Object.keys(q));
  const optionsQuery = await db.collection('questions').findOne({ options: { $exists: true } });
  console.log('Found any question with "options"?', optionsQuery ? 'Yes' : 'No');
  
  if (q.optionA) {
    console.log('It seems options are stored as optionA, optionB, etc.');
  } else {
    console.log(q);
  }
  process.exit(0);
});
