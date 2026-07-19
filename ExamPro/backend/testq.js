const mongoose = require('mongoose');
const Question = require('./models/Question.js').default || require('./models/Question.js');

mongoose.connect('mongodb://localhost:27017/exampro', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(async () => {
    try {
      const q = await Question.aggregate([ { $match: { level: 1 } }, { $sample: { size: 10 } } ]);
      console.log('Query length:', q.length);
      const q2 = await Question.find({ level: 1 });
      console.log('Total level 1 questions:', q2.length);
    } catch(err) { console.error(err); }
    mongoose.disconnect();
  });
