const mongoose = require('mongoose');

// Helper to determine if a string is a math expression that needs $ wrapping
function needsMathWrap(str) {
    if (!str || typeof str !== 'string') return false;
    if (str.includes('$') || str.includes('\\(') || str.includes('\\[')) return false; // Already has math wrappers
    
    // Check for math symbols: ^, =, \sqrt, \frac, etc.
    const hasMathSymbols = /[\^\=\+\-\\\/]|(\b(sin|cos|tan|log|ln|lim)\b)/.test(str);
    
    // Check if it's mostly plain text (words). If it has long English words, it might be a sentence.
    // Allow short variables like x, y, r, a, b, c. 
    // If it has multiple words with 4+ letters, it's probably not a pure math expression.
    const hasLongWords = /[a-zA-Z]{4,}/.test(str.replace(/\\(text|frac|sqrt|sin|cos|tan|log|ln|pi|theta|alpha|beta|gamma)/g, ''));
    
    return hasMathSymbols && !hasLongWords;
}

mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));
  const questions = await Question.find({});
  let updatedCount = 0;

  for (let q of questions) {
    let modified = false;
    
    if (q.options && Array.isArray(q.options)) {
        for (let i = 0; i < q.options.length; i++) {
            let opt = q.options[i];
            
            // Handle Object options
            if (opt && typeof opt === 'object' && opt.text) {
                if (needsMathWrap(opt.text)) {
                    q.options[i].text = `$${opt.text}$`;
                    modified = true;
                }
            } 
            // Handle String options
            else if (typeof opt === 'string') {
                if (needsMathWrap(opt)) {
                    q.options[i] = `$${opt}$`;
                    modified = true;
                }
            }
        }
    }
    
    if (modified) {
        await Question.updateOne({ _id: q._id }, { $set: { options: q.options } });
        updatedCount++;
    }
  }
  
  console.log(`Successfully fixed missing math tags in ${updatedCount} questions!`);
  process.exit(0);
});
