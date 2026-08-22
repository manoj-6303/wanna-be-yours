const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro');
const qSchema = new mongoose.Schema({explanation: String, chapter: String}, {strict: false});
const Q = mongoose.model('Question', qSchema, 'questions');
async function run() {
  const result = await Q.updateMany({chapter: {$regex: /amines/i}}, {$set: {explanation: ''}});
  console.log(result);
  process.exit(0);
}
run();
