const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Q = require('./models/Question.js').default;
  const docs = await Q.find({
    $or: [
      { options: { $exists: false } },
      { options: { $size: 0 } },
      { options: { $size: 1 } }
    ]
  });
  console.log('Docs with missing options:', docs.length);
  process.exit();
});
