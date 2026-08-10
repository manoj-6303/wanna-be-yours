import mongoose from 'mongoose';

const importJobSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  originalName: { type: String, required: true },
  status: { type: String, enum: ['PENDING', 'PROCESSING', 'COMPLETED', 'FAILED'], default: 'PENDING' },
  progress: { type: Number, default: 0 },
  message: { type: String, default: 'Waiting to start...' },
  results: { type: Array, default: [] },
  error: { type: String },
  ocrConfidence: { type: Number },
  aiConfidence: { type: Number },
  totalFound: { type: Number, default: 0 },
  totalParsed: { type: Number, default: 0 },
  totalSaved: { type: Number, default: 0 },
  totalFailed: { type: Number, default: 0 },
  validationErrors: [{
    row: Number,
    question: String,
    reason: String
  }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const ImportJob = mongoose.model('ImportJob', importJobSchema);

export default ImportJob;
