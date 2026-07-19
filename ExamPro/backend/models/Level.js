import mongoose from 'mongoose';

const levelSchema = new mongoose.Schema({
  levelNumber: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  examType: {
    type: String,
    enum: ["JEE", "EAMCET", "General"],
    default: "General"
  },
  subject: {
    type: String,
    enum: ["Physics", "Chemistry", "Mathematics A", "Mathematics B", "Biology"]
  },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"]
  },
  fee: { type: Number, default: 0 },
  duration: { type: Number, required: true },
  questionCount: { type: Number, required: true },
  passingPercentage: { type: Number, required: true },
  status: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Level', levelSchema);
