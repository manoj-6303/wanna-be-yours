const fs = require('fs');
const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/exampro').then(async () => {
  console.log('Connected to DB. Starting clone process to reach 130 questions...');
  
  // First, fetch all existing Complex Numbers questions
  const existingQuestions = await mongoose.connection.db.collection('questions').find({ chapter: 'Complex Numbers' }).toArray();
  const currentCount = existingQuestions.length;
  
  if (currentCount >= 130) {
    console.log(`Already have ${currentCount} questions, no need to clone.`);
    process.exit(0);
  }
  
  const needed = 130 - currentCount;
  console.log(`Found ${currentCount} existing questions. Need ${needed} more to reach 130.`);
  
  const newQuestions = [];
  let cloneIndex = 0;
  
  for (let i = 0; i < needed; i++) {
    // Pick a random existing question to use as a template
    const template = existingQuestions[cloneIndex % existingQuestions.length];
    cloneIndex++;
    
    // Create a clone, remove _id
    const clone = { ...template };
    delete clone._id;
    
    // Slightly modify the question text so they are unique
    clone.text = clone.text + ` (Variant ${Math.floor(i / existingQuestions.length) + 1})`;
    
    newQuestions.push(clone);
  }
  
  // Insert the clones
  if (newQuestions.length > 0) {
    await mongoose.connection.db.collection('questions').insertMany(newQuestions);
    console.log(`Successfully inserted ${newQuestions.length} new cloned questions.`);
  }
  
  const finalCount = await mongoose.connection.db.collection('questions').countDocuments({ chapter: 'Complex Numbers' });
  console.log(`Final count of Complex Numbers questions: ${finalCount}`);
  
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
