import mongoose from 'mongoose';

async function shuffleOptions() {
  await mongoose.connect('mongodb://localhost:27017/exampro');
  const Question = mongoose.connection.db.collection('questions');
  
  const cursor = Question.find({});
  let updatedCount = 0;
  
  while (await cursor.hasNext()) {
    const q = await cursor.next();
    if (!q.options || q.options.length === 0) continue;
    
    // Find the currently correct option object
    // Note: q.correctAnswer might be the text value in some questions! Let's check for both.
    let correctOptionOrigIndex = q.options.findIndex(opt => opt.id === q.correctAnswer);
    if (correctOptionOrigIndex === -1) {
      // Try by text matching if correctAnswer isn't an ID
      correctOptionOrigIndex = q.options.findIndex(opt => {
        const val = opt.value || opt.text || opt;
        return val === q.correctAnswer;
      });
    }
    
    if (correctOptionOrigIndex === -1) {
      console.log(`Could not find correct answer for question ${q._id}, correctAnswer: ${q.correctAnswer}`);
      continue;
    }
    
    const correctOptionObject = q.options[correctOptionOrigIndex];
    
    // Shuffle the options array using Fisher-Yates
    const shuffledOptions = [...q.options];
    for (let i = shuffledOptions.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffledOptions[i], shuffledOptions[j]] = [shuffledOptions[j], shuffledOptions[i]];
    }
    
    // Re-assign IDs and find new correct answer
    let newCorrectAnswer = q.correctAnswer;
    let newCorrectIndex = -1;
    
    for (let i = 0; i < shuffledOptions.length; i++) {
      const newLetter = String.fromCharCode(65 + i); // A, B, C, D...
      
      // If this option is the one that was correct
      if (shuffledOptions[i] === correctOptionObject) {
        // If the original correctAnswer was a letter (e.g. 'A', 'B'), update it to the new letter
        if (['A', 'B', 'C', 'D'].includes(q.correctAnswer)) {
          newCorrectAnswer = newLetter;
        }
        newCorrectIndex = i;
      }
      
      // We must make sure if it's an object with an 'id' field, we update it
      if (typeof shuffledOptions[i] === 'object' && shuffledOptions[i] !== null) {
        shuffledOptions[i].id = newLetter;
      }
    }
    
    await Question.updateOne(
      { _id: q._id },
      { $set: { options: shuffledOptions, correctAnswer: newCorrectAnswer } }
    );
    
    updatedCount++;
    if (updatedCount % 1000 === 0) {
      console.log(`Updated ${updatedCount} questions...`);
    }
  }
  
  console.log(`Finished shuffling options for ${updatedCount} questions.`);
  process.exit(0);
}

shuffleOptions().catch(console.error);
