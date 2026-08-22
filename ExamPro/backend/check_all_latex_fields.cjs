const mongoose = require('mongoose');
const katex = require('katex');

mongoose.connect('mongodb://localhost:27017/exampro');
const qSchema = new mongoose.Schema({}, {strict: false});
const Q = mongoose.model('Question', qSchema, 'questions');

function checkText(textStr) {
  if (!textStr || typeof textStr !== 'string') return false;
  
  if ((textStr.includes('\\') || textStr.includes('^{') || textStr.includes('_{') || textStr.includes('^')) && !textStr.includes('$') && !textStr.includes('\\[') && !textStr.includes('\\(')) {
    if (/[a-zA-Z]/.test(textStr)) {
      textStr = `\\(${textStr}\\)`;
    }
  }
  const parts = textStr.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g);
  
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
          return true; // Has error
        }
      } catch (e) {
        return true;
      }
    }
  }
  return false;
}

async function run() {
  const qs = await Q.find({});
  let errorCount = 0;
  
  for (let q of qs) {
    let hasError = false;
    let errFields = [];
    
    // Check question text
    if (q.question && typeof q.question === 'string' && checkText(q.question)) {
      hasError = true;
      errFields.push('question');
    } else if (q.question && q.question.text && checkText(q.question.text)) {
      hasError = true;
      errFields.push('question.text');
    }
    
    // Check options
    if (Array.isArray(q.options)) {
      for (let i=0; i<q.options.length; i++) {
        let opt = q.options[i];
        if (typeof opt === 'string' && checkText(opt)) {
          hasError = true;
          errFields.push(`options[${i}]`);
        } else if (opt && opt.text && checkText(opt.text)) {
          hasError = true;
          errFields.push(`options[${i}].text`);
        }
      }
    }
    
    // Check explanation
    if (q.explanation && checkText(q.explanation)) {
      hasError = true;
      errFields.push('explanation');
    }
    
    if (hasError) {
      errorCount++;
    }
  }
  
  console.log(`Found ${errorCount} questions with KaTeX errors in some fields.`);
  process.exit(0);
}
run();
