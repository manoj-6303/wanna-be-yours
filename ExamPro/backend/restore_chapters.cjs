const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/exampro');
const qSchema = new mongoose.Schema({}, {strict: false});
const Q = mongoose.model('Question', qSchema, 'questions');

const mathsDir = path.join(__dirname, '../QuestionBank/JeeMains/Maths');

async function run() {
  const folders = fs.readdirSync(mathsDir, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name);
    
  let addedCount = 0;

  for (let folder of folders) {
    // Normalize chapter name matching the typical structure
    let chapterName = folder;
    if (chapterName === 'Area_Under_Curves') chapterName = 'Area Under Curves';
    
    // Check if the chapter exists in DB
    const count = await Q.countDocuments({ subject: 'Mathematics', chapter: chapterName });
    
    if (count === 0) {
      const placeholder = {
        exam: "JEE Mains",
        subject: "Mathematics",
        topic: chapterName,
        chapter: chapterName,
        difficulty: "Medium",
        question: `This is a temporary placeholder question for ${chapterName}. The previous placeholder questions were removed because they contained non-related test data. Please add new authentic questions via the Admin Panel.`,
        questionImage: null,
        options: [
          { id: "A", text: "Placeholder Option 1", image: null },
          { id: "B", text: "Placeholder Option 2", image: null },
          { id: "C", text: "Placeholder Option 3", image: null },
          { id: "D", text: "Placeholder Option 4", image: null }
        ],
        correctAnswer: "A",
        explanation: "Placeholder explanation.",
        marks: 4,
        negativeMarks: 1
      };
      
      await Q.create(placeholder);
      addedCount++;
      console.log(`Added placeholder for missing chapter: ${chapterName}`);
    }
  }

  console.log(`Successfully restored ${addedCount} chapters with a clean placeholder question!`);
  process.exit(0);
}
run();
