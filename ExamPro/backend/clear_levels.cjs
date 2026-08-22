const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  await mongoose.connection.db.collection('weeklytests').deleteMany({});
  await mongoose.connection.db.collection('levels').deleteMany({});
  await mongoose.connection.db.collection('users').updateMany({}, { 
    $set: { completedLevels: [], currentLevel: 1, paidLevels: [], coins: 0, isBlocked: false }
  });
  await mongoose.connection.db.collection('examattempts').deleteMany({});
  await mongoose.connection.db.collection('examsecuritylogs').deleteMany({});
  await mongoose.connection.db.collection('examsecurityreports').deleteMany({});
  console.log('Successfully cleared all levels, custom tests, and user progress.');
  process.exit(0);
});
