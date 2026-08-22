import dotenv from 'dotenv';
dotenv.config();
import mongoose from 'mongoose';
import Question from './models/Question.js';
import fs from 'fs';
import path from 'path';

const qbDir = path.join(process.cwd(), '../QuestionBank');

function getPrefix(text) {
  if (!text) return '';
  return text.replace(/[^a-zA-Z0-9]/g, '').substring(0, 40);
}

async function processDirectory(dirPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      await processDirectory(fullPath);
    } else if (entry.name.endsWith('.json')) {
      await processFile(fullPath);
    }
  }
}

async function processFile(filePath) {
  try {
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    for (const q of data) {
      if (!q.questionImage && !q.explanationImage && !(q.options && q.options.some(o => o.image))) {
        continue;
      }
      
      const qPrefix = getPrefix(q.question);
      if (!qPrefix) continue;

      // Find any question in DB that has the exact same alphanumeric prefix
      const allDBQs = await Question.find({ chapter: q.chapter });
      const dbQ = allDBQs.find(dbq => getPrefix(dbq.question) === qPrefix);
      
      if (dbQ) {
        let changed = false;
        if (q.questionImage && dbQ.questionImage !== q.questionImage) {
          dbQ.questionImage = q.questionImage;
          changed = true;
        }
        if (q.explanationImage && dbQ.explanationImage !== q.explanationImage) {
          dbQ.explanationImage = q.explanationImage;
          changed = true;
        }
        if (q.options && dbQ.options) {
          q.options.forEach((opt, idx) => {
            if (opt.image && dbQ.options[idx] && dbQ.options[idx].image !== opt.image) {
              dbQ.options[idx].image = opt.image;
              changed = true;
            }
          });
        }
        
        if (changed) {
          await Question.updateOne({ _id: dbQ._id }, {
            $set: {
              questionImage: dbQ.questionImage,
              explanationImage: dbQ.explanationImage,
              options: dbQ.options
            }
          });
          console.log(`Restored images for question: ${q.question.substring(0, 30)}...`);
        }
      }
    }
  } catch (error) {
    console.error(`Error processing ${filePath}:`, error.message);
  }
}

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro').then(async () => {
  console.log('Connected to DB. Restoring images via fuzzy match...');
  await processDirectory(qbDir);
  console.log('Finished restoring images.');
  process.exit(0);
});
