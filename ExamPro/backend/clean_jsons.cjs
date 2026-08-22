const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  let removedCount = 0;
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      removedCount += processDir(fullPath);
    } else if (fullPath.endsWith('.json')) {
      try {
        const content = fs.readFileSync(fullPath, 'utf8');
        let data = JSON.parse(content);
        if (!Array.isArray(data)) data = [data];
        
        const originalLength = data.length;
        data = data.filter(q => {
          if (q.question && q.question.includes('The question corresponds to Q')) return false;
          if (q.options && q.options.length > 0 && q.options[0].text === 'Option A') return false;
          return true;
        });
        
        if (data.length !== originalLength) {
          fs.writeFileSync(fullPath, JSON.stringify(data, null, 2));
          removedCount += (originalLength - data.length);
          console.log(`Cleaned ${originalLength - data.length} questions from ${fullPath}`);
        }
      } catch (e) {
        console.error(`Error processing ${fullPath}`, e.message);
      }
    }
  }
  return removedCount;
}

const totalRemoved = processDir('d:\\lakshya Demo\\ExamPro\\QuestionBank');
console.log(`Total questions removed from JSONs: ${totalRemoved}`);
