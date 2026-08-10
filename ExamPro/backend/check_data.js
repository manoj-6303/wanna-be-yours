import mongoose from 'mongoose';
import Level from './models/Level.js';
import Result from './models/Result.js';
import Payment from './models/Payment.js';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
        const levelsCount = await Level.countDocuments();
        const resultsCount = await Result.countDocuments();
        const paymentsCount = await Payment.countDocuments();
        console.log(`Levels: ${levelsCount}`);
        console.log(`Results: ${resultsCount}`);
        console.log(`Payments: ${paymentsCount}`);
        process.exit();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}
run();
