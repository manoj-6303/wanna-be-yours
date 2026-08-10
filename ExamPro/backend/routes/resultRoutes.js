import express from 'express';
import { submitExam } from '../controllers/resultController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, submitExam);

export default router;
