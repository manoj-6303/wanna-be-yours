import mongoose from 'mongoose';

const weeklyTestSchema = new mongoose.Schema({
  subject: { type: String, required: true },
  chapter: { type: String, required: true },
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], required: true },
  questionCount: { type: Number, required: true },
  examType: { type: String, enum: ['JEE', 'EAMCET', 'General'], required: true },
  level: { type: Number, required: true },
  passingPercentage: { type: Number, required: true },
  duration: { type: Number, required: true }, // in minutes
  fee: { type: Number, default: 20 },
  status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' },
  questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }]
}, { timestamps: true });

export default mongoose.model('WeeklyTest', weeklyTestSchema);
