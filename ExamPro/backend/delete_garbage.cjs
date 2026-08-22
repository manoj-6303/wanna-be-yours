const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro');
const qSchema = new mongoose.Schema({}, {strict: false});
const Q = mongoose.model('Question', qSchema, 'questions');

async function run() {
  const qs = await Q.find({}).lean();
  let idsToDelete = [];
  
  for (let q of qs) {
    let qText = typeof q.question === 'string' ? q.question : (q.question && q.question.text ? q.question.text : '');
    if (qText.includes('Solve the following problem from')) {
      idsToDelete.push(q._id);
    }
  }
  
  console.log(`Found ${idsToDelete.length} garbage template questions.`);
  
  if (idsToDelete.length > 0) {
    const res = await Q.deleteMany({ _id: { $in: idsToDelete } });
    console.log(`Successfully deleted ${res.deletedCount} questions.`);
  }
  
  process.exit(0);
}
run();
