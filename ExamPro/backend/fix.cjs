const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  await mongoose.connection.db.collection('weeklytests').updateMany({}, { $set: { questionCount: 10 } });
  await mongoose.connection.db.collection('levels').updateMany({}, { $set: { questionCount: 10 } });
  console.log('Updated DB');
  process.exit(0);
});
