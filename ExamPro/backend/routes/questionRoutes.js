import express from 'express';
import { getQuestions, createQuestion, updateQuestion, deleteQuestion, updateQuestionStatus, parseUploadFile, finalizeImport, getImportJobStatus, handleImportWebhook } from '../controllers/questionController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
import multer from 'multer';

const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.post('/import/parse', protect, admin, upload.single('file'), parseUploadFile);
router.get('/import/status/:jobId', protect, admin, getImportJobStatus);
router.post('/import/webhook/:jobId', handleImportWebhook);
router.post('/import/finalize', protect, admin, finalizeImport);

router.route('/')
  .get(protect, admin, getQuestions)
  .post(protect, admin, createQuestion);

router.route('/:id')
  .put(protect, admin, updateQuestion)
  .delete(protect, admin, deleteQuestion);

router.put('/:id/status', protect, admin, updateQuestionStatus);

export default router;
