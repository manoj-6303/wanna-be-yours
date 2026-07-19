import express from 'express';
import { getUserProfile, blockUser, getMyCertificates, getMySecurityReports } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', protect, getUserProfile);
router.post('/block', protect, blockUser);
router.get('/certificates', protect, getMyCertificates);
router.get('/security-reports', protect, getMySecurityReports);

export default router;
