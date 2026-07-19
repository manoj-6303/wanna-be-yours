import mongoose from 'mongoose';

const attemptHistorySchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  examType: { type: String, required: true },
  filters: { type: Object }, // Store filters used to generate the test
  questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
  attemptNumber: { type: Number, default: 1 },
}, { timestamps: true });

export default mongoose.model('AttemptHistory', attemptHistorySchema);
