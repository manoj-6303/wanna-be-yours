import mongoose from 'mongoose';

const resultSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  level: { type: Number },
  isCustomTest: { type: Boolean, default: false },
  totalQuestions: { type: Number, required: true },
  correctAnswers: { type: Number, required: true },
  wrongAnswers: { type: Number, required: true },
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  qualified: { type: Boolean, required: true },
  timeTaken: { type: Number, required: true },
  answers: [{
    questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question' },
    selectedAnswer: { type: String },
    correct: { type: Boolean },
    questionText: { type: String },
    correctAnswer: { type: String },
    explanation: { type: String },
    chapter: { type: String }
  }],
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Result', resultSchema);
