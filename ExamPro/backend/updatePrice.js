import mongoose from 'mongoose';
import Level from './models/Level.js';
import dotenv from 'dotenv';
dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
    await Level.updateOne({ levelNumber: 1 }, { $set: { fee: 20 } });
    console.log('Successfully updated Level 1 fee to 20');
    process.exit(0);
}).catch(err => {
    console.error(err);
    process.exit(1);
});
