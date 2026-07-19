import mongoose from 'mongoose';

const securityLogSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  examLevel: { type: Number, required: true },
  eventType: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  actionTaken: { type: String }
});

export default mongoose.model('ExamSecurityLog', securityLogSchema);
