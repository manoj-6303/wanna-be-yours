const mongoose = require('mongoose');
const katex = require('katex'); // We need to install katex in backend or use a simple regex

mongoose.connect('mongodb://localhost:27017/exampro');
const qSchema = new mongoose.Schema({explanation: String}, {strict: false});
const Q = mongoose.model('Question', qSchema, 'questions');

async function run() {
  const qs = await Q.find({explanation: {$exists: true, $ne: ''}});
  let errorCount = 0;
  
  for (let q of qs) {
    if (!q.explanation) continue;
    
    // Simulate the MathRenderer.jsx logic
    let textStr = q.explanation;
    if ((textStr.includes('\\') || textStr.includes('^{') || textStr.includes('_{') || textStr.includes('^')) && !textStr.includes('$') && !textStr.includes('\\[') && !textStr.includes('\\(')) {
      if (/[a-zA-Z]/.test(textStr)) {
        textStr = `\\(${textStr}\\)`;
      }
    }
    const parts = textStr.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g);
    
    let hasError = false;
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 1) {
        let mathStr = '';
        if (parts[i].startsWith('$$') && parts[i].endsWith('$$')) {
          mathStr = parts[i].slice(2, -2);
        } else if (parts[i].startsWith('\\[') && parts[i].endsWith('\\]')) {
          mathStr = parts[i].slice(2, -2);
        } else if (parts[i].startsWith('$') && parts[i].endsWith('$')) {
          mathStr = parts[i].slice(1, -1);
        } else if (parts[i].startsWith('\\(') && parts[i].endsWith('\\)')) {
          mathStr = parts[i].slice(2, -2);
        }
        
        try {
          const html = katex.renderToString(mathStr, { throwOnError: false });
          if (html.includes('katex-error')) {
            hasError = true;
            break;
          }
        } catch (e) {
          hasError = true;
          break;
        }
      }
    }
    
    if (hasError) {
      errorCount++;
      // console.log(`Question ID: ${q._id}`);
      // Clear the explanation so it gets regenerated
      await Q.updateOne({_id: q._id}, {$set: {explanation: ''}});
    }
  }
  
  console.log(`Found and cleared ${errorCount} questions with LaTeX errors.`);
  process.exit(0);
}
run();
