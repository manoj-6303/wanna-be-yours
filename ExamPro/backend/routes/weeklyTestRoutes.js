import express from 'express';
import {
  createWeeklyTest,
  getWeeklyTests,
  getWeeklyTestById,
  updateWeeklyTest,
  deleteWeeklyTest,
  publishWeeklyTest
} from '../controllers/weeklyTestController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, admin, createWeeklyTest);
router.get('/', protect, admin, getWeeklyTests);
router.get('/:id', protect, admin, getWeeklyTestById);
router.put('/:id', protect, admin, updateWeeklyTest);
router.delete('/:id', protect, admin, deleteWeeklyTest);
router.put('/:id/publish', protect, admin, publishWeeklyTest);

export default router;
