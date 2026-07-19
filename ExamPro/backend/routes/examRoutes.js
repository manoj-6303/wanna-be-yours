import express from 'express';
import { getQuestionsByLevel, generateExam } from '../controllers/examController.js';
import { startAttempt, logSecurityEvent, getSecurityLogs } from '../controllers/securityController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/security-logs', protect, admin, getSecurityLogs);
router.post('/start-attempt', protect, startAttempt);
router.post('/security-log', protect, logSecurityEvent);
router.post('/generate', protect, generateExam);
router.get('/:level', protect, getQuestionsByLevel);

export default router;
