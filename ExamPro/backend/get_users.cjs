const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const User = mongoose.model('User', new mongoose.Schema({}, {strict:false}));
  const users = await User.find({}, { password: 0 }); // Hide hashed passwords for safety, just get emails/roles
  console.log(JSON.stringify(users, null, 2));
  process.exit(0);
});
