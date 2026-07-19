import mongoose from 'mongoose';

const importLogSchema = new mongoose.Schema({
  fileName: { type: String, required: true },
  importedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rowsImported: { type: Number, default: 0 },
  rowsFailed: { type: Number, default: 0 },
  duplicateCount: { type: Number, default: 0 },
  errors: [{ type: String }],
}, { timestamps: true });

export default mongoose.model('ImportLog', importLogSchema);
