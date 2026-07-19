const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const run = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
    // Load User model
    const User = require('./models/User.js').default || require('./models/User.js');
    const adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('No admin user found');
      process.exit(1);
    }
    
    const token = jwt.sign({ id: adminUser._id }, process.env.JWT_SECRET || 'lakshya_secret_key');
    console.log(`export TOKEN="${token}"`);
    process.exit(0);
  } catch(e) {
    console.error(e);
    process.exit(1);
  }
};
run();
