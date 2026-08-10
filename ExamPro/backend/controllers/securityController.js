import ExamAttempt from '../models/ExamAttempt.js';
import ExamSecurityLog from '../models/ExamSecurityLog.js';

// Initialize a new exam attempt
export const startAttempt = async (req, res) => {
  try {
    const { level } = req.body;
    
    // Check if an active attempt exists
    let attempt = await ExamAttempt.findOne({ userId: req.user._id, examLevel: level, endTime: null });
    if (!attempt) {
      attempt = await ExamAttempt.create({
        userId: req.user._id,
        examLevel: level
      });
    }
    
    res.status(200).json(attempt);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Log a security event and increment violations
export const logSecurityEvent = async (req, res) => {
  try {
    const { level, eventType } = req.body;
    
    let attempt = await ExamAttempt.findOne({ userId: req.user._id, examLevel: level, endTime: null });
    
    if (!attempt) {
      return res.status(404).json({ message: 'Active attempt not found' });
    }

    const newViolations = attempt.violations + 1;
    let actionTaken = 'Warning issued';
    let securityStatus = newViolations > 3 ? 'Violated' : 'Warning';

    if (newViolations > 3) {
      actionTaken = 'Auto-submitted exam';
    }

    await ExamSecurityLog.create({
      userId: req.user._id,
      examLevel: level,
      eventType,
      actionTaken
    });

    attempt.violations = newViolations;
    attempt.securityStatus = securityStatus;
    await attempt.save();

    res.status(200).json({ 
      violations: attempt.violations, 
      actionTaken,
      forceSubmit: newViolations > 3 
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get logs for admin dashboard
export const getSecurityLogs = async (req, res) => {
  try {
    const attempts = await ExamAttempt.find().populate('userId', 'name email examType');
    const logs = await ExamSecurityLog.find().sort({ timestamp: -1 });
    res.status(200).json({ attempts, logs });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
