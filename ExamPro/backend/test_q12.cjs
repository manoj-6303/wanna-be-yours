const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  const docs = await Q.find({ question: /Q_\{12\}/ });
  console.log('Docs with Q_{12}:', docs.length);
  if (docs.length > 0) {
    console.log(docs[0].question);
    console.log(docs[0].options);
  }
  process.exit();
});
