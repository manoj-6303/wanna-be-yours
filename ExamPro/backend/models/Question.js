import mongoose from 'mongoose';

const questionSchema = new mongoose.Schema({
  level: { type: Number, required: true, index: true },
  examType: { type: String, required: true },
  subject: { type: String, required: true, index: true },
  chapter: { type: String, required: true },
  difficulty: {
    type: String,
    enum: ["Easy", "Medium", "Hard"],
    required: true
  },
  questionType: {
    type: String,
    enum: ["MCQ", "Numerical", "Assertion Reason"],
    required: true
  },
  question: { type: String, required: true },
  options: [{ type: String }],
  correctAnswer: { type: String, required: true },
  explanation: { type: String },
  solution: { type: String },
  previousYear: { type: String },
  tags: [{ type: String }],
  status: {
    type: String,
    enum: ["Published", "Archived", "Draft"],
    default: "Published"
  },
  marks: { type: Number, default: 1 },
  sourceFile: { type: String },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  questionHash: { type: String, unique: true, sparse: true }
}, { timestamps: true });

questionSchema.index({ subject: 1 });
questionSchema.index({ chapter: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ examType: 1 });
questionSchema.index({ status: 1 });
questionSchema.index({ level: 1 });
questionSchema.index({ questionType: 1 });
questionSchema.index({ questionHash: 1 });
questionSchema.index({ status: 1, examType: 1, subject: 1, chapter: 1, difficulty: 1 });

export default mongoose.model('Question', questionSchema);
