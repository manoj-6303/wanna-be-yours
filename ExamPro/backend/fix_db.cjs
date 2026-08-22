require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  const docs = await Q.find({});
  let optionsFixedCount = 0;
  let textRemovedCount = 0;
  let tableFixedCount = 0;

  for (let d of docs) {
    let updateDoc = {};
    let changed = false;

    if (d.question) {
      let qText = d.question;
      const jeeRegex = /Q?(?:_\{?\d+\}?|\d*)\s*JEE Main[^\n]*\n?/gi;
      if (jeeRegex.test(qText)) {
        qText = qText.replace(jeeRegex, '');
        changed = true;
        textRemovedCount++;
      }
      
      if (qText.includes('|\n\n|') || /\|\s*\n+\s*\|/g.test(qText)) {
        qText = qText.replace(/\|\s*\n+\s*\|/g, '|\n|');
        changed = true;
        tableFixedCount++;
      }
      
      if (changed) {
        updateDoc.question = qText;
      }
    }

    if (!d.options || d.options.length < 2) {
      let newOptions = ["Option A", "Option B", "Option C", "Option D"];
      let newCorrect = 'A';

      if (['A', 'B', 'C', 'D'].includes(d.correctAnswer)) {
        newCorrect = d.correctAnswer;
      } else if (!isNaN(parseFloat(d.correctAnswer))) {
        const num = parseFloat(d.correctAnswer);
        const diff = num === 0 ? 1 : Math.round(Math.abs(num * 0.1) * 100) / 100 || 1;
        
        newOptions = [
          String(Math.round((num - diff) * 100) / 100),
          String(Math.round((num) * 100) / 100),
          String(Math.round((num + diff) * 100) / 100),
          String(Math.round((num + 2 * diff) * 100) / 100)
        ];
        newCorrect = 'B';
      } else {
        if (d.correctAnswer) {
          newOptions[0] = String(d.correctAnswer);
        }
      }

      updateDoc.options = newOptions;
      updateDoc.correctAnswer = newCorrect;
      changed = true;
      optionsFixedCount++;
    }

    if (changed) {
      await Q.updateOne({ _id: d._id }, { $set: updateDoc });
    }
  }

  console.log(`Removed 'JEE Main' from ${textRemovedCount} questions.`);
  console.log(`Generated fallback options for ${optionsFixedCount} questions.`);
  console.log(`Fixed table spacing in ${tableFixedCount} questions.`);
  process.exit();
});
