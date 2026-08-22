require('dotenv').config();
const mongoose = require('mongoose');

async function fixLatex() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  // Need to use dynamic import for ES modules or just require if it works (it worked before because mongoose model is registered)
  const Q = require('./models/Question.js').default;

  const physicsQuestions = await Q.find({ subject: 'Physics' });

  let fixed = 0;
  for (const doc of physicsQuestions) {
    let updated = false;

    // Check options
    if (doc.options && Array.isArray(doc.options)) {
      for (let i = 0; i < doc.options.length; i++) {
        let opt = doc.options[i];
        
        if (typeof opt === 'string') {
          if (opt.includes('\\') && !opt.includes('$')) {
            doc.options[i] = '$' + opt + '$';
            updated = true;
          }
        } else if (typeof opt === 'object' && opt !== null && opt.text) {
          if (opt.text.includes('\\') && !opt.text.includes('$')) {
            opt.text = '$' + opt.text + '$';
            doc.options[i] = opt;
            updated = true;
          }
        }
      }
    }

    // Check question
    if (doc.question && doc.question.includes('\\') && !doc.question.includes('$')) {
      doc.question = '$' + doc.question + '$';
      updated = true;
    }

    if (updated) {
      await Q.collection.updateOne(
        { _id: doc._id },
        { $set: { options: doc.options, question: doc.question } }
      );
      fixed++;
    }
  }

  console.log(`Fixed latex formatting in ${fixed} physics questions.`);
  process.exit(0);
}

fixLatex();
