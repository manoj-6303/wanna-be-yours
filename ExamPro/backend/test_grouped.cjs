const mongoose = require('mongoose');
const { getGroupedQuestions } = require('./controllers/questionController.js');

mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const req = { query: {} };
  const res = {
    json: (data) => console.log(JSON.stringify(data, null, 2).slice(0, 500) + '...'),
    status: (s) => ({ json: (d) => console.log('Status', s, d) })
  };
  await getGroupedQuestions(req, res);
  mongoose.disconnect();
}).catch(console.error);
