import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["student", "admin"],
    default: "student"
  },
  examType: {
    type: String,
    enum: ["EAMCET", "JEE"]
  },
  coins: {
    type: Number,
    default: 0
  },
  currentLevel: {
    type: Number,
    default: 1
  },
  completedLevels: [
    {
      level: Number,
      completedAt: Date,
      score: Number
    }
  ],
  paidLevels: {
    type: [Number],
    default: []
  },
  isBlocked: {
    type: Boolean,
    default: false
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('User', userSchema);
