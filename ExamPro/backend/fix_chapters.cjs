const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const tests = await mongoose.connection.db.collection('weeklytests').find({}).toArray();
  for (const test of tests) {
    if (test.chapter && test.level) {
      await mongoose.connection.db.collection('levels').updateOne(
        { levelNumber: test.level },
        { $set: { chapter: test.chapter } }
      );
    }
  }
  console.log('Updated chapters in DB');
  process.exit(0);
});
