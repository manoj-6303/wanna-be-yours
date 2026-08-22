require('dotenv').config();
require('mongoose').connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  const badQs = await Q.find({
    $or: [
      { question: { $regex: 'corresponds to', $options: 'i' } },
      { 'options.value': { $regex: '^Option [A-D]$', $options: 'i' } },
      { 'options.text': { $regex: '^Option [A-D]$', $options: 'i' } }
    ]
  });
  console.log('Found bad questions:', badQs.length);
  for (let i=0; i<Math.min(3, badQs.length); i++) {
    console.log(badQs[i].question);
  }
  
  // Actually delete them
  const result = await Q.deleteMany({
    $or: [
      { question: { $regex: 'corresponds to', $options: 'i' } },
      { 'options.value': { $regex: '^Option [A-D]$', $options: 'i' } },
      { 'options.text': { $regex: '^Option [A-D]$', $options: 'i' } }
    ]
  });
  console.log('Deleted bad questions:', result.deletedCount);
  
  process.exit(0);
});
