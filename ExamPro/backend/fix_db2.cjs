const mongoose = require('mongoose');

async function run() {
  await mongoose.connect('mongodb://localhost:27017/exampro');
  const col = mongoose.connection.db.collection('questions');
  
  const qBare = await col.countDocuments({
    $or: [
      { question: /\\bare/ },
      { 'options.text': /\\bare/ }
    ]
  });
  
  console.log('Questions with \\bare:', qBare);
  
  // also let's fix them right now just in case
  if (qBare > 0) {
     const docs = await col.find({
       $or: [
         { question: /\\bare/ },
         { 'options.text': /\\bare/ }
       ]
     }).toArray();
     
     let updated = 0;
     for (let doc of docs) {
         let changed = false;
         if (doc.question && doc.question.includes('\\bare')) {
             doc.question = doc.question.replace(/\\bare/g, ' are');
             changed = true;
         }
         if (doc.options) {
             for (let opt of doc.options) {
                 if (opt.text && opt.text.includes('\\bare')) {
                     opt.text = opt.text.replace(/\\bare/g, ' are');
                     changed = true;
                 }
             }
         }
         if (changed) {
             await col.updateOne({_id: doc._id}, {$set: {question: doc.question, options: doc.options}});
             updated++;
         }
     }
     console.log('Fixed', updated, 'documents containing \\bare.');
  }

  // Check for the explanation issue
  const qExp = await col.countDocuments({
    explanation: /Verified text-only question/
  });
  console.log('Questions with dummy explanation:', qExp);

  await mongoose.disconnect();
}
run();
