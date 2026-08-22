require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  const docs = await Q.find({});
  let tableFixedCount = 0;
  let textRemovedCount = 0;
  let optionsFixedCount = 0;

  for (let d of docs) {
    let changed = false;

    if (d.question) {
      // 1. Fix Table Newlines: replace |\n\n| with |\n| repeatedly
      const oldQ = d.question;
      d.question = d.question.replace(/\|\s*\n+\s*\|/g, '|\n|');
      if (oldQ !== d.question) {
        tableFixedCount++;
        changed = true;
      }

      // 2. Remove "JEE Main..."
      const jeeRegex = /Q?_?\d*\s*JEE Main[^\n]*\n?/gi;
      const oldQ2 = d.question;
      d.question = d.question.replace(jeeRegex, '');
      if (oldQ2 !== d.question) {
        textRemovedCount++;
        changed = true;
      }
    }

    // 3. Fix missing options
    if (!d.options || d.options.length < 2) {
      if (['A', 'B', 'C', 'D'].includes(d.correctAnswer)) {
        d.options = ["Option A", "Option B", "Option C", "Option D"];
        changed = true;
        optionsFixedCount++;
      } else if (!isNaN(parseFloat(d.correctAnswer))) {
        // It's a number! e.g., "50", "2024", "3.14"
        const num = parseFloat(d.correctAnswer);
        const diff = num === 0 ? 1 : Math.round(Math.abs(num * 0.1) * 100) / 100 || 1; // +/- 10%
        
        const optA = String(Math.round((num - diff) * 100) / 100);
        const optB = String(Math.round((num) * 100) / 100);
        const optC = String(Math.round((num + diff) * 100) / 100);
        const optD = String(Math.round((num + 2 * diff) * 100) / 100);
        
        d.options = [optA, optB, optC, optD];
        d.correctAnswer = 'B';
        changed = true;
        optionsFixedCount++;
      } else {
        // It's some text formula or something else (e.g. "x^2")
        d.options = ["Option A", "Option B", "Option C", "Option D"];
        if (!['A', 'B', 'C', 'D'].includes(d.correctAnswer)) {
           // We append the original answer to Option A and make it correct
           d.options[0] = String(d.correctAnswer || "None");
           d.correctAnswer = 'A';
        }
        changed = true;
        optionsFixedCount++;
      }
    }

    if (changed) {
      try {
        await d.save();
      } catch (e) {
        // ignore duplicate key errors if any
      }
    }
  }

  console.log(`Fixed table spacing in ${tableFixedCount} questions.`);
  console.log(`Removed 'JEE Main' attribution from ${textRemovedCount} questions.`);
  console.log(`Generated fallback options for ${optionsFixedCount} questions.`);
  process.exit();
});
