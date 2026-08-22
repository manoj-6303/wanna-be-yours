require('dotenv').config();
const mongoose = require('mongoose');

async function removeHindiQuestions() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;

  // Regex for Devanagari script (Hindi)
  const hindiRegex = /[\u0900-\u097F]/;

  const allQuestions = await Q.find({});
  let removedCount = 0;

  for (const doc of allQuestions) {
    let hasHindi = false;

    // Check question text
    if (doc.question && hindiRegex.test(doc.question)) {
      hasHindi = true;
    }

    // Check options
    if (!hasHindi && doc.options && doc.options.length > 0) {
      for (const opt of doc.options) {
        if (hindiRegex.test(opt)) {
          hasHindi = true;
          break;
        }
      }
    }

    // Check explanation
    if (!hasHindi && doc.explanation && hindiRegex.test(doc.explanation)) {
      hasHindi = true;
    }
    
    // Check solution
    if (!hasHindi && doc.solution && hindiRegex.test(doc.solution)) {
      hasHindi = true;
    }

    if (hasHindi) {
      await Q.findByIdAndDelete(doc._id);
      removedCount++;
    }
  }

  console.log(`Removed ${removedCount} questions containing Hindi text.`);
  process.exit(0);
}

removeHindiQuestions();
