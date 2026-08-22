require('dotenv').config();
const mongoose = require('mongoose');

async function fixLatex() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;

  // We are looking for questions that have options containing '\text{' but no '$'
  // Or questions that have '\text{' but no '$'
  
  const badQuestions = await Q.find({
    $or: [
      { 'options.text': { $regex: /\\text\{/ }, 'options.text': { $not: /\$/ } },
      { 'question': { $regex: /\\text\{/ }, 'question': { $not: /\$/ } }
    ]
  });

  let fixed = 0;
  for (const doc of badQuestions) {
    let updated = false;

    // Fix options
    if (doc.options && doc.options.length > 0) {
      doc.options.forEach(opt => {
        if (opt.text && opt.text.includes('\\text{') && !opt.text.includes('$')) {
          // If the entire text doesn't have a $, we wrap the whole thing.
          // Wait, just wrapping the whole thing is safest.
          opt.text = '$' + opt.text + '$';
          updated = true;
        }
      });
    }

    // Fix question text
    if (doc.question && doc.question.includes('\\text{') && !doc.question.includes('$')) {
      doc.question = '$' + doc.question + '$';
      updated = true;
    }

    if (updated) {
      // Using updateOne to avoid schema validation errors from legacy docs
      await Q.collection.updateOne(
        { _id: doc._id },
        { $set: { options: doc.options, question: doc.question } }
      );
      fixed++;
    }
  }

  console.log(`Fixed latex formatting in ${fixed} questions.`);
  process.exit(0);
}

fixLatex();
