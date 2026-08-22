const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Level = mongoose.model('Level', new mongoose.Schema({}, { strict: false }));
  await Level.updateMany({ subject: 'Mathematics A' }, { $set: { subject: 'Mathematics' } });
  await Level.updateMany({ subject: 'Mathematics B' }, { $set: { subject: 'Mathematics' } });
  console.log('Updated DB');
  process.exit(0);
});
