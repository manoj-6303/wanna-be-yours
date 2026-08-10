import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from '../models/Question.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const QUESTION_BANK_DIR = path.join(__dirname, '..', '..', 'QuestionBank');
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/exampro';

function findJsonFiles(dir) {
  let results = [];
  if (!fs.existsSync(dir)) return results;

  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findJsonFiles(fullPath));
    } else if (file.endsWith('.json')) {
      results.push(fullPath);
    }
  });
  return results;
}

async function importQuestionBank() {
  console.log(`Starting import from ${QUESTION_BANK_DIR}...`);

  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB.');

    const jsonFiles = findJsonFiles(QUESTION_BANK_DIR);
    console.log(`Found ${jsonFiles.length} JSON file(s).`);

    let totalInserted = 0;

    for (const filePath of jsonFiles) {
      const relativePath = path.relative(QUESTION_BANK_DIR, filePath);
      const parts = relativePath.split(path.sep);

      // Example path: JeeMains/Physics/Altenate Current/easy.json
      if (parts.length < 4) continue;

      const examRaw = parts[0];
      const subjectRaw = parts[1];
      const topicRaw = parts[2];
      const difficultyFileName = parts[parts.length - 1].replace('.json', '');

      const exam = examRaw === 'JeeMains' || examRaw === 'jee_mains' ? 'JEE Mains' : examRaw;
      const subject = subjectRaw;
      const topic = topicRaw;
      const difficulty = difficultyFileName.charAt(0).toUpperCase() + difficultyFileName.slice(1).toLowerCase();

      const rawContent = fs.readFileSync(filePath, 'utf-8');
      let data = JSON.parse(rawContent);

      if (!Array.isArray(data)) {
        data = [data];
      }

      const formattedQuestions = data.map((q, idx) => {
        return {
          level: q.level || (difficulty === 'Easy' ? 1 : difficulty === 'Medium' ? 2 : 3),
          examType: q.examType || exam,
          subject: q.subject || subject,
          chapter: q.chapter || topic,
          difficulty: ['Easy', 'Medium', 'Hard'].includes(q.difficulty) ? q.difficulty : difficulty,
          questionType: q.questionType || 'MCQ',
          question: q.question,
          questionImage: q.questionImage || q.image || '',
          options: q.options || [q.optionA, q.optionB, q.optionC, q.optionD].filter(Boolean),
          correctAnswer: q.correctAnswer,
          explanation: q.explanation || '',
          explanationImage: q.explanationImage || q.solutionImage || '',
          previousYear: q.previousYear || '',
          marks: q.marks || 4,
          negativeMarks: q.negativeMarks || 1,
          status: q.status || 'Published'
        };
      });

      if (formattedQuestions.length > 0) {
        for (const q of formattedQuestions) {
          await Question.updateOne(
            { question: q.question, chapter: q.chapter, subject: q.subject },
            { $set: q },
            { upsert: true }
          );
        }
        console.log(`Successfully imported/updated ${formattedQuestions.length} questions from ${relativePath}`);
        totalInserted += formattedQuestions.length;
      }
    }

    console.log(`\nImport complete! Processed ${totalInserted} questions.`);
    process.exit(0);
  } catch (error) {
    console.error('Error importing question bank:', error);
    process.exit(1);
  }
}

importQuestionBank();
