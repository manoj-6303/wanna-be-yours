require('dotenv').config();
const mongoose = require('mongoose');

async function checkHealth() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;
  const docs = await Q.find({});
  
  let emptyQuestionText = 0;
  let emptyOptions = 0;
  let missingCorrectAnswer = 0;
  let unmatchedMathDelimiters = 0;
  let otherControlChars = 0;
  let invalidOptionsLength = 0;
  
  const controlCharRegex = /[\x00-\x08\x0b\x0e-\x1f]/; // exclude \t (09), \n (0a), \r (0d), \f (0c)

  for (const doc of docs) {
    if (!doc.question || doc.question.trim() === '') {
      emptyQuestionText++;
    }
    
    if (!doc.options || doc.options.length < 2) {
      invalidOptionsLength++;
    } else {
      let hasEmpty = false;
      for (const opt of doc.options) {
        if (!opt.text || opt.text.trim() === '') hasEmpty = true;
      }
      if (hasEmpty) emptyOptions++;
    }
    
    if (doc.correctAnswer === undefined || doc.correctAnswer === null || doc.correctAnswer.trim() === '') {
      missingCorrectAnswer++;
    }
    
    // Check unmatched $ (naively count $ characters)
    // Escaped \$ shouldn't count, but typically we just count raw $
    const qStr = doc.question || '';
    const dollarCount = (qStr.match(/(?<!\\)\$/g) || []).length;
    if (dollarCount % 2 !== 0) {
      unmatchedMathDelimiters++;
    }
    
    if (controlCharRegex.test(qStr)) {
      otherControlChars++;
    }
  }
  
  console.log(`Total questions scanned: ${docs.length}`);
  console.log(`Empty question text: ${emptyQuestionText}`);
  console.log(`Empty or missing options: ${emptyOptions}`);
  console.log(`Invalid options length (<2): ${invalidOptionsLength}`);
  console.log(`Missing correct answer: ${missingCorrectAnswer}`);
  console.log(`Unmatched math delimiters ($): ${unmatchedMathDelimiters}`);
  console.log(`Other control characters: ${otherControlChars}`);
  
  process.exit(0);
}

checkHealth();
