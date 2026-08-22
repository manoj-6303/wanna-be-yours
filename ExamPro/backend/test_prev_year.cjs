const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  const docs = await Q.find({ previousYear: /JEE Main/i }).limit(2);
  console.log('Docs with previousYear JEE Main:', docs.length);
  if (docs.length > 0) {
    console.log(docs[0].previousYear);
  }
  process.exit();
});
