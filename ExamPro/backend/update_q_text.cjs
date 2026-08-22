require('dotenv').config();
require('mongoose').connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  await Q.collection.updateOne({ _id: require('mongoose').Types.ObjectId.createFromHexString('6a80514353fa713321277ad3') }, { $set: { question: 'Compound(s) which will liberate carbon dioxide with sodium bicarbonate solution is/are:\n(A) Phenol\n(B) Benzoic acid\n(C) Picric acid' } });
  console.log('Updated question text.');
  process.exit(0);
});
