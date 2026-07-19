import mongoose from 'mongoose';

const certificateSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  completedLevels: [{ type: Number }],
  score: { type: Number, required: true },
  certificateId: { type: String, required: true, unique: true },
  issuedDate: { type: Date, default: Date.now }
});

export default mongoose.model('Certificate', certificateSchema);
