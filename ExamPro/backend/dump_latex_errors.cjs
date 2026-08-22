const mongoose = require('mongoose');
const katex = require('katex');
const fs = require('fs');

mongoose.connect('mongodb://localhost:27017/exampro');
const qSchema = new mongoose.Schema({}, {strict: false});
const Q = mongoose.model('Question', qSchema, 'questions');

function getErrors(textStr) {
  if (!textStr || typeof textStr !== 'string') return null;
  
  let modifiedText = textStr;
  if ((modifiedText.includes('\\') || modifiedText.includes('^{') || modifiedText.includes('_{') || modifiedText.includes('^')) && !modifiedText.includes('$') && !modifiedText.includes('\\[') && !modifiedText.includes('\\(')) {
    if (/[a-zA-Z]/.test(modifiedText)) {
      modifiedText = `\\(${modifiedText}\\)`;
    }
  }
  const parts = modifiedText.split(/(\$\$[\s\S]+?\$\$|\$[\s\S]+?\$|\\\[[\s\S]+?\\\]|\\\([\s\S]+?\\\))/g);
  
  let errors = [];
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
          const match = html.match(/title="([^"]+)"/);
          let errStr = match ? match[1] : 'Unknown error';
          errors.push({
            original: parts[i],
            math: mathStr,
            error: errStr
          });
        }
      } catch (e) {
        errors.push({
          original: parts[i],
          math: mathStr,
          error: e.message
        });
      }
    }
  }
  return errors.length > 0 ? errors : null;
}

async function run() {
  const qs = await Q.find({});
  let errorList = [];
  
  for (let q of qs) {
    let qErrs = { _id: q._id, errors: [] };
    
    // Check question text
    let qTextErr = getErrors(q.question && q.question.text ? q.question.text : q.question);
    if (qTextErr) qErrs.errors.push({ field: 'question', issues: qTextErr });
    
    // Check options
    if (Array.isArray(q.options)) {
      for (let i=0; i<q.options.length; i++) {
        let opt = q.options[i];
        let oErr = getErrors(opt && opt.text ? opt.text : opt);
        if (oErr) qErrs.errors.push({ field: `options[${i}]`, issues: oErr });
      }
    }
    
    // Check explanation
    let expErr = getErrors(q.explanation);
    if (expErr) qErrs.errors.push({ field: 'explanation', issues: expErr });
    
    if (qErrs.errors.length > 0) {
      errorList.push(qErrs);
    }
  }
  
  fs.writeFileSync('latex_errors_dump.json', JSON.stringify(errorList, null, 2));
  console.log(`Found ${errorList.length} questions with KaTeX errors. Dumped to latex_errors_dump.json`);
  process.exit(0);
}
run();
