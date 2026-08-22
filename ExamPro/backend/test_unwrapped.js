const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));
  
  // Find questions with unwrapped options
  const q = await Question.findOne({
    options: { $regex: /^\\\\/ } // matches options starting with a backslash
  });
  
  if (q) {
    console.log(q.options);
  } else {
    console.log('No unwrapped options found starting with backslash');
  }

  process.exit(0);
});
