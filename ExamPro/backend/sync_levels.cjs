const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const WeeklyTest = mongoose.connection.db.collection('weeklytests');
  const Level = mongoose.connection.db.collection('levels');
  
  const tests = await WeeklyTest.find({status: 'Published'}).toArray();
  for(let t of tests) {
    await Level.updateOne(
      {levelNumber: t.level}, 
      {$set: {
        levelNumber: t.level, 
        title: 'Level ' + t.level + ' ' + t.subject, 
        examType: t.examType, 
        subject: t.subject, 
        difficulty: t.difficulty, 
        fee: t.fee || 20, 
        passingPercentage: t.passingPercentage, 
        duration: t.duration, 
        questionCount: t.questionCount
      }}, 
      {upsert: true}
    );
  }
  console.log('Synced ' + tests.length + ' tests');
  process.exit(0);
});
