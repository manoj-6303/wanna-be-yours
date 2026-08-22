require('dotenv').config();
const mongoose = require('mongoose');

async function checkIssues() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;
  const docs = await Q.find({});
  
  let checkedEmpty = 0;
  let checkedLength = 0;
  
  for (const doc of docs) {
    let hasEmpty = false;
    for (const opt of doc.options) {
      if (!opt.text || opt.text.trim() === '') hasEmpty = true;
    }
    
    if (hasEmpty && checkedEmpty < 2) {
      console.log('--- Empty Option ---');
      console.log(JSON.stringify(doc, null, 2));
      checkedEmpty++;
    }
    
    if (doc.options.length < 2 && checkedLength < 2) {
      console.log('--- Invalid Options Length ---');
      console.log(JSON.stringify(doc, null, 2));
      checkedLength++;
    }
    
    if (checkedEmpty >= 2 && checkedLength >= 2) break;
  }
  process.exit(0);
}

checkIssues();
