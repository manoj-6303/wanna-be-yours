require('dotenv').config();
const mongoose = require('mongoose');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  
  const badFF = await Q.countDocuments({ $or: [{question: /\x0c/}, {'options.text': /\x0c/}, {explanation: /\x0c/}] });
  const badBS = await Q.countDocuments({ $or: [{question: /\x08/}, {'options.text': /\x08/}, {explanation: /\x08/}] });
  const badTab = await Q.countDocuments({ $or: [{question: /\t/}, {'options.text': /\t/}, {explanation: /\t/}] });
  const badCR = await Q.countDocuments({ $or: [{question: /\r/}, {'options.text': /\r/}, {explanation: /\r/}] });
  // For newline, maybe we can search for \n followed by specific LaTeX things?
  // Like \nabla (abla), \nu (u), \neq (eq), \Rightarrow (Rightarrow)
  const badNL = await Q.countDocuments({ $or: [{question: /\n(abla|u|eq|Rightarrow)/}, {'options.text': /\n(abla|u|eq|Rightarrow)/}, {explanation: /\n(abla|u|eq|Rightarrow)/}] });

  console.log('Form feeds:', badFF);
  console.log('Backspaces:', badBS);
  console.log('Tabs:', badTab);
  console.log('Carriage Returns:', badCR);
  console.log('Newlines that look like swallowed escapes:', badNL);
  
  process.exit(0);
});