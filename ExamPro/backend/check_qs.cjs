const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const WeeklyTest = mongoose.connection.db.collection('weeklytests');
  const test = await WeeklyTest.findOne({level: 1, status: 'Published'});
  const Question = mongoose.connection.db.collection('questions');
  const qs = await Question.find({_id: {$in: test.questionIds}}).toArray();
  console.log(JSON.stringify(qs.slice(0, 1), null, 2));
  process.exit(0);
});
