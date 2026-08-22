const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));
  const files = ['easy.json', 'medium.json', 'hard.json'];
  let updated = 0;
  
  const chemDir = path.join(__dirname, '../QuestionBank/JeeMains/Chemistry');
  const chapters = fs.readdirSync(chemDir);
  
  for (const chapter of chapters) {
    const chapterDir = path.join(chemDir, chapter);
    if (!fs.statSync(chapterDir).isDirectory()) continue;
    
    for (const file of files) {
      const fPath = path.join(chapterDir, file);
      if (fs.existsSync(fPath)) {
        const data = JSON.parse(fs.readFileSync(fPath, 'utf8'));
        for (const q of data) {
          if (q.explanation && !q.explanation.includes('MathonGo')) {
            await Question.updateOne(
              { subject: 'Chemistry', chapter: chapter, question: q.question },
              { $set: { explanation: q.explanation, solutionImage: q.explanationImage || q.solutionImage || '' } }
            );
            updated++;
          }
        }
      }
    }
  }
  console.log('Updated ' + updated + ' questions across all Chemistry chapters in DB');
  process.exit(0);
});
