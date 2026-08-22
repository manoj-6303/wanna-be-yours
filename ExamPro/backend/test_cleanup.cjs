const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));
  
  const questions = await Question.find({});
  let optionsFixed = 0;
  let notesRemoved = 0;

  for (let q of questions) {
    let changed = false;

    // Fix unwrapped options
    if (q.options && Array.isArray(q.options)) {
      const newOptions = q.options.map(opt => {
        let text = typeof opt === 'string' ? opt : (opt.text || opt.value || '');
        // If the option has LaTeX commands like \frac, \log, \sqrt but NO $ sign
        if (text && text.includes('\\') && !text.includes('$')) {
          text = `$${text}$`;
          changed = true;
        }
        
        if (typeof opt === 'string') return text;
        return { ...opt, text, value: text };
      });
      q.options = newOptions;
    }

    // Remove *(Note: ...)*
    if (q.question && typeof q.question === 'string') {
      const noteRegex = /\*\s*\(?Note:.*?\)?\s*\*/gi;
      if (noteRegex.test(q.question)) {
        q.question = q.question.replace(noteRegex, '').trim();
        changed = true;
        notesRemoved++;
      }
    }

    if (changed) {
      optionsFixed++;
      // await q.save(); // Not saving yet, just counting
    }
  }

  console.log(`Would fix options/notes in ${optionsFixed} questions. Notes removed: ${notesRemoved}`);
  process.exit(0);
});
