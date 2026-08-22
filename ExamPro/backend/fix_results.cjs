const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const results = await mongoose.connection.db.collection('results').find({}).toArray();
  for (const res of results) {
    if (res.answers && res.answers.length > 0) {
      const updatedAnswers = [];
      for (const ans of res.answers) {
        if (ans.questionId) {
          const q = await mongoose.connection.db.collection('questions').findOne({ _id: ans.questionId });
          if (q) {
            ans.options = q.options;
            ans.image = q.image;
            ans.difficulty = q.difficulty;
            ans.solution = q.solution;
          }
        }
        updatedAnswers.push(ans);
      }
      await mongoose.connection.db.collection('results').updateOne(
        { _id: res._id },
        { $set: { answers: updatedAnswers } }
      );
    }
  }
  console.log('Fixed missing options in Results');
  process.exit(0);
});
