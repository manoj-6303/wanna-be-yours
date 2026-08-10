import express from 'express';
import { generateCustomTest } from '../controllers/customTestController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/generate', protect, generateCustomTest);

export default router;
