const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro');
const qSchema = new mongoose.Schema({}, {strict: false});
const Q = mongoose.model('Question', qSchema, 'questions');

async function run() {
  const qs = await Q.find({}).lean();
  let badCount = 0;
  
  for (let q of qs) {
    let qText = typeof q.question === 'string' ? q.question : (q.question && q.question.text ? q.question.text : '');
    
    if (qText.includes('Solve the following problem from')) {
      console.log(`ID: ${q._id}, Chapter: ${q.chapter}`);
      console.log(qText.substring(0, 150));
      console.log('---');
      badCount++;
    }
  }
  
  console.log(`Found ${badCount} bad questions.`);
  process.exit(0);
}
run();
