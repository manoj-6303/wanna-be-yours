import mongoose from 'mongoose';

const examSecurityReportSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examLevel: { type: Number, required: true },
  securityScore: { type: Number, default: 100 },
  tabWarnings: { type: Number, default: 0 },
  copyAttempts: { type: Number, default: 0 },
  pasteAttempts: { type: Number, default: 0 },
  fullscreenExit: { type: Number, default: 0 },
  status: { type: String, default: 'Excellent Exam Integrity' }
}, { timestamps: true });

export default mongoose.model('ExamSecurityReport', examSecurityReportSchema);
