const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro');
const qSchema = new mongoose.Schema({}, {strict: false});
const Q = mongoose.model('Question', qSchema, 'questions');

function fixText(str) {
  if (typeof str !== 'string') return str;
  return str
    .replace(/\\\\barray/g, 'array')
    .replace(/\\\\left/g, '\\left')
    .replace(/\\\\right/g, '\\right')
    .replace(/\\\\bf/g, '\\bf');
}

async function run() {
  const qs = await Q.find({}).lean();
  let updatedCount = 0;
  
  for (let q of qs) {
    let changed = false;
    let updateDoc = {};
    
    // Check question text
    if (q.question && typeof q.question === 'string') {
      const fixed = fixText(q.question);
      if (fixed !== q.question) { updateDoc['question'] = fixed; changed = true; }
    } else if (q.question && q.question.text) {
      const fixed = fixText(q.question.text);
      if (fixed !== q.question.text) { updateDoc['question.text'] = fixed; changed = true; }
    }
    
    // Check options
    if (Array.isArray(q.options)) {
      let optsChanged = false;
      let newOptions = [...q.options];
      for (let i=0; i<newOptions.length; i++) {
        let opt = newOptions[i];
        if (typeof opt === 'string') {
          const fixed = fixText(opt);
          if (fixed !== opt) { newOptions[i] = fixed; optsChanged = true; }
        } else if (opt && opt.text) {
          const fixed = fixText(opt.text);
          if (fixed !== opt.text) { newOptions[i].text = fixed; optsChanged = true; }
        }
      }
      if (optsChanged) {
        updateDoc['options'] = newOptions;
        changed = true;
      }
    }
    
    // Check explanation
    if (q.explanation) {
      const fixed = fixText(q.explanation);
      if (fixed !== q.explanation) { updateDoc['explanation'] = fixed; changed = true; }
    }
    
    if (changed) {
      await Q.updateOne({_id: q._id}, {$set: updateDoc});
      updatedCount++;
    }
  }
  
  console.log(`Fixed LaTeX formatting issues in ${updatedCount} questions.`);
  process.exit(0);
}
run();
