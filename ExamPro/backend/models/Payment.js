import mongoose from 'mongoose';

const paymentSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  level: { type: Number, required: true },
  amount: { type: Number, required: true },
  paymentMethod: { type: String },
  transactionId: { type: String },
  status: {
    type: String,
    enum: ["SUCCESS", "FAILED", "PENDING"],
    default: "PENDING"
  },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Payment', paymentSchema);
