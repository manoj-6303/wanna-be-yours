require('dotenv').config();
const mongoose = require('mongoose');

async function fixMath() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;
  
  const docs = await Q.find({});
  let fixedCount = 0;
  for (const doc of docs) {
    if (doc.question) {
      if (doc.question.includes('and \\delta_2$')) {
        doc.question = doc.question.replace('and \\delta_2$', 'and $\\delta_2$');
        await Q.collection.updateOne({ _id: doc._id }, { $set: { question: doc.question } });
        fixedCount++;
      }
      if (doc.question.includes('= 2^{25}k \\text{ find } k = ?') && !doc.question.endsWith('$')) {
        doc.question = doc.question.replace('= 2^{25}k \\text{ find } k = ?', '= 2^{25}k \\text{ find } k = ?$');
        await Q.collection.updateOne({ _id: doc._id }, { $set: { question: doc.question } });
        fixedCount++;
      }
      if (doc.question.includes('\\text{Then find } \\frac{A}{B}.') && !doc.question.includes('\\frac{A}{B}.$')) {
        doc.question = doc.question.replace('\\text{Then find } \\frac{A}{B}.', '\\text{Then find } \\frac{A}{B}.$');
        await Q.collection.updateOne({ _id: doc._id }, { $set: { question: doc.question } });
        fixedCount++;
      }
    }
  }
  
  console.log(`Fixed ${fixedCount} unmatched math issues.`);
  process.exit(0);
}

fixMath();
