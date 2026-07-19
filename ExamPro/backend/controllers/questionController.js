import Question from '../models/Question.js';
import ImportLog from '../models/ImportLog.js';
import ImportJob from '../models/ImportJob.js';
import fs from 'fs';
import csvParser from 'csv-parser';
import axios from 'axios';
import FormData from 'form-data';

export const getQuestions = async (req, res) => {
  try {
    const { subject, chapter, difficulty, examType, status, search, page = 1, limit = 50 } = req.query;

    let query = {};
    if (subject) query.subject = subject;
    if (chapter) query.chapter = chapter;
    if (difficulty) query.difficulty = difficulty;
    if (examType) query.examType = examType;
    if (status) query.status = status;
    
    if (search) {
      query.question = { $regex: search, $options: 'i' };
    }

    const pageNumber = parseInt(page, 10) || 1;
    const limitNumber = parseInt(limit, 10) || 50;
    const skip = (pageNumber - 1) * limitNumber;

    const questions = await Question.find(query)
      .sort({ level: 1 })
      .skip(skip)
      .limit(limitNumber)
      .lean();
    
    const total = await Question.countDocuments(query);

    res.json({
      questions,
      page: pageNumber,
      pages: Math.ceil(total / limitNumber),
      total
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const createQuestion = async (req, res) => {
  try {
    const question = await Question.create(req.body);
    res.status(201).json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

export const updateQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (question) {
      res.json(question);
    } else {
      res.status(404).json({ message: 'Question not found' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteQuestion = async (req, res) => {
  try {
    const question = await Question.findByIdAndDelete(req.params.id);
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json({ message: 'Question deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateQuestionStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['Published', 'Archived', 'Draft'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }
    const question = await Question.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!question) return res.status(404).json({ message: 'Question not found' });
    res.json(question);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

import { processImport } from '../services/importService.js';

export const parseUploadFile = async (req, res) => {
  if (!req.file) return res.status(400).json({ success: false, message: 'No file uploaded' });

  const ext = req.file.originalname.split('.').pop().toLowerCase();
  
  try {
    const job = await ImportJob.create({
      filename: req.file.filename,
      originalName: req.file.originalname,
      status: 'PENDING'
    });

    // Start background processing
    processImport(job._id, req.file.path, ext, req.user._id, req.file.originalname);

    return res.json({ success: true, async: true, jobId: job._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error processing file', error: error.message });
  }
};

export const getImportJobStatus = async (req, res) => {
  try {
    const job = await ImportJob.findById(req.params.jobId);
    if (!job) return res.status(404).json({ success: false, message: 'Job not found' });
    res.json({ success: true, job });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error fetching job status' });
  }
};

export const handleImportWebhook = async (req, res) => {
  try {
    const { status, results, error, totalParsed, totalFound, aiConfidence, ocrConfidence } = req.body;
    await ImportJob.findByIdAndUpdate(req.params.jobId, {
      status,
      results,
      error,
      totalParsed,
      totalFound,
      aiConfidence,
      ocrConfidence,
      progress: status === 'COMPLETED' ? 100 : status === 'FAILED' ? 0 : 50
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Webhook error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const finalizeImport = async (req, res) => {
  const { questions, fileName } = req.body;
  if (!questions || !Array.isArray(questions)) {
    return res.status(400).json({ success: false, message: 'Invalid payload' });
  }

  let imported = 0;
  let duplicates = 0;
  let failed = 0;
  const errors = [];
  const questionsToInsert = [];

  for (const [index, row] of questions.entries()) {
    try {
      // Validate required fields
      const missingFields = [];
      if (!row.level) missingFields.push('level');
      if (!row.examType) missingFields.push('examType');
      if (!row.subject) missingFields.push('subject');
      if (!row.chapter) missingFields.push('chapter');
      if (!row.difficulty) missingFields.push('difficulty');
      if (!row.questionType) missingFields.push('questionType');
      if (!row.question) missingFields.push('question');
      if (!row.correctAnswer) missingFields.push('correctAnswer');

      if (missingFields.length > 0) {
        failed++;
        errors.push(`Row ${index + 1}: Missing required fields: ${missingFields.join(', ')}`);
        continue;
      }

      // Difficulty validation
      if (!['Easy', 'Medium', 'Hard'].includes(row.difficulty)) {
        failed++;
        errors.push(`Row ${index + 1}: Invalid difficulty`);
        continue;
      }

      // Duplicate check
      const isDuplicate = await Question.exists({
        subject: row.subject,
        chapter: row.chapter,
        question: row.question,
        examType: row.examType,
        difficulty: row.difficulty
      });

      if (isDuplicate) {
        duplicates++;
        continue;
      }

      questionsToInsert.push({
        level: parseInt(row.level) || 1,
        examType: row.examType,
        subject: row.subject,
        chapter: row.chapter,
        difficulty: row.difficulty,
        questionType: row.questionType,
        question: row.question,
        options: [row.optionA, row.optionB, row.optionC, row.optionD].filter(Boolean),
        correctAnswer: row.correctAnswer,
        explanation: row.explanation || '',
        solution: row.solution || '',
        previousYear: row.previousYear || '',
        tags: row.tags ? String(row.tags).split(',').map(t => t.trim()) : [],
        marks: parseInt(row.marks) || 1,
        status: 'Published'
      });
    } catch (err) {
      failed++;
      errors.push(`Row ${index + 1}: ${err.message}`);
    }
  }

  try {
    if (questionsToInsert.length > 0) {
      await Question.insertMany(questionsToInsert);
      imported = questionsToInsert.length;
    }

    const log = await ImportLog.create({
      fileName: fileName || 'Manual Classification Import',
      importedBy: req.user._id,
      rowsImported: imported,
      rowsFailed: failed,
      duplicateCount: duplicates,
      errors
    });

    res.json({
      success: true,
      totalRows: questions.length,
      imported,
      duplicates,
      failed,
      errors
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: 'Server error saving questions', error: error.message });
  }
};
