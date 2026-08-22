require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const replacements = [
  { from: /\x0c/g, to: '\\f' }, // form feed (\f)
  { from: /\x08/g, to: '\\b' }, // backspace (\b)
  { from: /\t/g, to: '\\t' },   // tab (\t)
  { from: /\r/g, to: '\\r' },   // carriage return (\r)
  { from: /\nabla/g, to: '\\nabla' }, // newline + abla
  { from: /\nu\b/g, to: '\\nu' },     // newline + u
  { from: /\neq\b/g, to: '\\neq' },
  { from: /\ne\b/g, to: '\\ne' },
  { from: /\nRightarrow/g, to: '\\nRightarrow' }
];

function sanitizeStr(str) {
  if (typeof str !== 'string') return str;
  let newStr = str;
  for (const r of replacements) {
    newStr = newStr.replace(r.from, r.to);
  }
  return newStr;
}

function sanitizeDoc(doc) {
  let changed = false;
  if (doc.question) {
    const s = sanitizeStr(doc.question);
    if (s !== doc.question) { doc.question = s; changed = true; }
  }
  if (doc.explanation) {
    const s = sanitizeStr(doc.explanation);
    if (s !== doc.explanation) { doc.explanation = s; changed = true; }
  }
  if (doc.options) {
    for (let i = 0; i < doc.options.length; i++) {
      if (doc.options[i].text) {
        const s = sanitizeStr(doc.options[i].text);
        if (s !== doc.options[i].text) { doc.options[i].text = s; changed = true; }
      }
      if (doc.options[i].value) {
        const s = sanitizeStr(doc.options[i].value);
        if (s !== doc.options[i].value) { doc.options[i].value = s; changed = true; }
      }
    }
  }
  return changed;
}

async function fixDB() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;
  const docs = await Q.find({});
  let fixedCount = 0;
  for (const doc of docs) {
    if (sanitizeDoc(doc)) {
      await Q.collection.updateOne({ _id: doc._id }, {
        $set: {
          question: doc.question,
          explanation: doc.explanation,
          options: doc.options
        }
      });
      fixedCount++;
    }
  }
  console.log(`Fixed ${fixedCount} documents in MongoDB.`);
}

function processDir(dir) {
  const files = fs.readdirSync(dir);
  let fixedCount = 0;
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixedCount += processDir(fullPath);
    } else if (fullPath.endsWith('.json')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        let data = JSON.parse(content);
        let isArr = true;
        if (!Array.isArray(data)) {
          data = [data];
          isArr = false;
        }
        
        let fileChanged = false;
        for (const q of data) {
          if (sanitizeDoc(q)) {
            fileChanged = true;
          }
        }
        
        if (fileChanged) {
          fs.writeFileSync(fullPath, JSON.stringify(isArr ? data : data[0], null, 2));
          fixedCount++;
        }
      } catch (e) {
        console.error(`Error processing ${fullPath}`, e.message);
      }
    }
  }
  return fixedCount;
}

async function main() {
  await fixDB();
  const fixedFiles = processDir('d:\\lakshya Demo\\ExamPro\\QuestionBank');
  console.log(`Fixed ${fixedFiles} JSON files.`);
  process.exit(0);
}

main();
