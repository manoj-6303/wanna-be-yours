require('dotenv').config();
const mongoose = require('mongoose');

async function checkMath() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;
  const docs = await Q.find({});
  
  for (const doc of docs) {
    const qStr = doc.question || '';
    const dollarCount = (qStr.match(/(?<!\\)\$/g) || []).length;
    if (dollarCount % 2 !== 0) {
      console.log('--- Unmatched Math ---');
      console.log(qStr);
    }
  }
  process.exit(0);
}

checkMath();
