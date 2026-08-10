import mongoose from 'mongoose';
import Question from './models/Question.js';
import dotenv from 'dotenv';
dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
        const total = await Question.countDocuments();
        const physicsCount = await Question.countDocuments({ subject: { $regex: /physics/i } });
        const physicsChapters = await Question.distinct('chapter', { subject: { $regex: /physics/i } });
        const samplePhysics = await Question.find({ subject: { $regex: /physics/i } }).limit(3);
        
        console.log("DATABASE_SUMMARY:", JSON.stringify({
            totalQuestions: total,
            physicsQuestions: physicsCount,
            physicsChaptersCount: physicsChapters.length,
            physicsChapters: physicsChapters,
            samplePhysics: samplePhysics
        }, null, 2));
        
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

run();
