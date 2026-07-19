import User from '../models/User.js';

export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    if (user) {
      res.json(user);
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (user) {
      user.isBlocked = true;
      await user.save();
      res.json({ message: 'User blocked due to suspicious activity' });
    } else {
      res.status(404).json({ message: 'User not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const getMyCertificates = async (req, res) => {
  try {
    const { default: Certificate } = await import('../models/Certificate.js');
    const certificates = await Certificate.find({ studentId: req.user._id });
    res.status(200).json(certificates);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch certificates', error: error.message });
  }
};

export const getMySecurityReports = async (req, res) => {
  try {
    const { default: ExamSecurityReport } = await import('../models/ExamSecurityReport.js');
    const reports = await ExamSecurityReport.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json(reports);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch security reports', error: error.message });
  }
};
