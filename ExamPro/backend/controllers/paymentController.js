import Payment from '../models/Payment.js';
import User from '../models/User.js';

export const processPayment = async (req, res) => {
  try {
    const { level, amount, paymentMethod } = req.body;

    const payment = await Payment.create({
      userId: req.user._id,
      level,
      amount,
      paymentMethod,
      transactionId: `TXN${Date.now()}${Math.floor(Math.random() * 1000)}`,
      status: 'SUCCESS'
    });

    const user = await User.findById(req.user._id);
    if (user && !user.paidLevels.includes(level)) {
      user.paidLevels.push(level);
      await user.save();
    }

    res.status(201).json({ message: 'Payment successful', payment });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
