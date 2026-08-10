import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import csv from 'csv-parser';
import xlsx from 'xlsx';
import { exec } from 'child_process';
import util from 'util';
import Question from '../models/Question.js';
import ImportJob from '../models/ImportJob.js';

const execPromise = util.promisify(exec);
const BATCH_SIZE = 1000;

const generateHash = (text) => {
  return crypto.createHash('sha256').update(text.toLowerCase().replace(/\s+/g, '')).digest('hex');
};

const validateRow = (row, rowIndex) => {
  const errors = [];
  if (!row.question) errors.push('Missing question text');
  if (!row.examType) errors.push('Missing examType');
  if (!row.subject) errors.push('Missing subject');
  if (!row.chapter) errors.push('Missing chapter');
  if (!row.difficulty) errors.push('Missing difficulty');
  
  if (row.questionType === 'MCQ' || !row.questionType) {
    const options = [row.optionA, row.optionB, row.optionC, row.optionD].filter(Boolean);
    if (options.length !== 4) {
      errors.push('MCQ must have 4 options (optionA, optionB, optionC, optionD)');
    }
  }

  if (!row.correctAnswer) errors.push('Missing correctAnswer');

  return { isValid: errors.length === 0, errors };
};

const processBatch = async (batch, jobId, userId, sourceFile) => {
  const job = await ImportJob.findById(jobId);
  if (!job) return;

  const validQuestions = [];
  const rowErrors = [];

  for (let i = 0; i < batch.length; i++) {
    const row = batch[i];
    const validation = validateRow(row, job.totalParsed + i + 1);

    if (!validation.isValid) {
      rowErrors.push({
        row: job.totalParsed + i + 1,
        question: row.question ? row.question.substring(0, 50) + '...' : 'N/A',
        reason: validation.errors.join(', ')
      });
      job.totalFailed += 1;
      continue;
    }

    const options = [row.optionA, row.optionB, row.optionC, row.optionD].filter(Boolean);
    
    validQuestions.push({
      level: row.level || 1,
      examType: row.examType,
      subject: row.subject,
      chapter: row.chapter,
      difficulty: row.difficulty,
      questionType: row.questionType || 'MCQ',
      question: row.question,
      options: options,
      correctAnswer: row.correctAnswer,
      explanation: row.explanation || '',
      solution: row.solution || '',
      previousYear: row.previousYear || '',
      tags: row.tags ? row.tags.split(',').map(t => t.trim()) : [],
      status: 'Published',
      marks: row.marks || 1,
      sourceFile: sourceFile,
      createdBy: userId,
      questionHash: generateHash(row.question)
    });
  }

  job.totalParsed += batch.length;

  if (validQuestions.length > 0) {
    try {
      const result = await Question.insertMany(validQuestions, { ordered: false });
      job.totalSaved += result.length;
    } catch (error) {
      if (error.code === 11000) {
        // Duplicate key error
        job.totalSaved += error.insertedDocs ? error.insertedDocs.length : 0;
        job.totalFailed += validQuestions.length - (error.insertedDocs ? error.insertedDocs.length : 0);
        rowErrors.push({
          row: null,
          question: 'Multiple',
          reason: 'Duplicate questions found and skipped'
        });
      } else {
        console.error('Error inserting batch:', error);
      }
    }
  }

  if (rowErrors.length > 0) {
    job.validationErrors.push(...rowErrors);
  }

  job.progress = Math.min(99, Math.floor((job.totalParsed / Math.max(job.totalFound, 1)) * 100));
  await job.save();
};

export const processImport = async (jobId, filePath, fileType, userId, originalName) => {
  try {
    const job = await ImportJob.findById(jobId);
    if (!job) return;

    job.status = 'PROCESSING';
    job.message = 'Started processing file...';
    await job.save();

    if (fileType === 'csv') {
      let batch = [];
      let totalRows = 0;
      
      // First pass to count rows
      await new Promise((resolve) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', () => totalRows++)
          .on('end', resolve);
      });
      
      job.totalFound = totalRows;
      await job.save();

      await new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
          .pipe(csv())
          .on('data', async (row) => {
            batch.push(row);
            if (batch.length >= BATCH_SIZE) {
              const currentBatch = [...batch];
              batch = [];
              await processBatch(currentBatch, jobId, userId, originalName);
            }
          })
          .on('end', async () => {
            if (batch.length > 0) {
              await processBatch(batch, jobId, userId, originalName);
            }
            resolve();
          })
          .on('error', reject);
      });

    } else if (fileType === 'xlsx' || fileType === 'xls') {
      const workbook = xlsx.readFile(filePath);
      const sheetName = workbook.SheetNames[0];
      const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);
      
      job.totalFound = data.length;
      await job.save();

      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        await processBatch(batch, jobId, userId, originalName);
      }

    } else if (fileType === 'json') {
      const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      job.totalFound = data.length;
      await job.save();

      for (let i = 0; i < data.length; i += BATCH_SIZE) {
        const batch = data.slice(i, i + BATCH_SIZE);
        await processBatch(batch, jobId, userId, originalName);
      }
    } else if (fileType === 'pdf') {
      job.message = 'Processing PDF via Python LayoutParser...';
      await job.save();
      
      // Check if Python parser exists, otherwise fallback to basic parsing or throw
      const pyScript = path.join(process.cwd(), 'python_parser', 'parse_pdf.py');
      if (fs.existsSync(pyScript)) {
        const outputJsonPath = `${filePath}.json`;
        try {
          await execPromise(`python "${pyScript}" "${filePath}" "${outputJsonPath}"`);
          if (fs.existsSync(outputJsonPath)) {
            const data = JSON.parse(fs.readFileSync(outputJsonPath, 'utf-8'));
            job.totalFound = data.length;
            await job.save();

            for (let i = 0; i < data.length; i += BATCH_SIZE) {
              const batch = data.slice(i, i + BATCH_SIZE);
              await processBatch(batch, jobId, userId, originalName);
            }
            if (fs.existsSync(outputJsonPath)) fs.unlinkSync(outputJsonPath);
          }
        } catch (err) {
          throw new Error('PDF parsing failed: ' + err.message);
        }
      } else {
        throw new Error('PDF parser script not found. Please implement python_parser/parse_pdf.py');
      }
    } else {
      throw new Error('Unsupported file type');
    }

    const finalJob = await ImportJob.findById(jobId);
    finalJob.status = 'COMPLETED';
    finalJob.progress = 100;
    finalJob.message = `Import finished. Saved: ${finalJob.totalSaved}, Failed: ${finalJob.totalFailed}`;
    await finalJob.save();

  } catch (error) {
    console.error('Import processing error:', error);
    const job = await ImportJob.findById(jobId);
    if (job) {
      job.status = 'FAILED';
      job.error = error.message;
      await job.save();
    }
  } finally {
    // Cleanup file
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};