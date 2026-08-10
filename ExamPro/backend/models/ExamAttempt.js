import mongoose from 'mongoose';

const examAttemptSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examLevel: { type: Number },
  isCustomTest: { type: Boolean, default: false },
  startTime: { type: Date, default: Date.now },
  endTime: { type: Date },
  violations: { type: Number, default: 0 },
  securityStatus: { type: String, enum: ['Safe', 'Warning', 'Violated'], default: 'Safe' },
  autoSubmitted: { type: Boolean, default: false }
});

export default mongoose.model('ExamAttempt', examAttemptSchema);
