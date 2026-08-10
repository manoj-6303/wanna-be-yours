import express from 'express';
import { getUsers, getStats, unblockUser, getCertificates, getAnalytics, uploadBank } from '../controllers/adminController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

import multer from 'multer';

const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.get('/users', protect, admin, getUsers);
router.get('/stats', protect, admin, getStats);
router.put('/users/:id/unblock', protect, admin, unblockUser);
router.get('/certificates', protect, admin, getCertificates);
router.get('/analytics', protect, admin, getAnalytics);
router.post('/upload-bank', protect, admin, upload.single('file'), uploadBank);

export default router;
