const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro');
const qSchema = new mongoose.Schema({}, {strict: false});
const Q = mongoose.model('Question', qSchema, 'questions');

async function run() {
  const qs = await Q.aggregate([
    { $group: { _id: { subject: '$subject', chapter: '$chapter' }, count: { $sum: 1 } } },
    { $sort: { '_id.subject': 1, '_id.chapter': 1 } }
  ]);
  console.log(qs);
  process.exit(0);
}
run();
