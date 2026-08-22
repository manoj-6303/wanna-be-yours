const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro');
const qSchema = new mongoose.Schema({}, {strict: false});
const Q = mongoose.model('Question', qSchema, 'questions');

async function run() {
  const q = await Q.findById('6a804e060a6e1ca59cf63828').lean();
  console.log(q.chapter);
  console.log(q.question);
  process.exit(0);
}
run();
