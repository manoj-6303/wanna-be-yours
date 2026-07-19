import express from 'express';
import Level from '../models/Level.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const levels = await Level.find().sort({ levelNumber: 1 });
    res.json(levels);
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

// Update level (Admin only)
import { protect, admin } from '../middleware/authMiddleware.js';

router.put('/:id', protect, admin, async (req, res) => {
  try {
    const { fee, duration } = req.body;
    const level = await Level.findById(req.params.id);
    
    if (level) {
      level.fee = fee !== undefined ? fee : level.fee;
      level.duration = duration !== undefined ? duration : level.duration;
      const updatedLevel = await level.save();
      res.json(updatedLevel);
    } else {
      res.status(404).json({ message: 'Level not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server Error' });
  }
});

export default router;
