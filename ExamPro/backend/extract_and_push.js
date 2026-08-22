import { execSync } from 'child_process';
import fs from 'fs';
import mongoose from 'mongoose';

console.log('Starting extraction...');
try { 
  execSync('python scripts/process_topic_pdfs.py', { stdio: 'inherit' }); 
} catch(e) { 
  console.log('Extraction encountered an error, but proceeding to push what we have...'); 
} 

mongoose.connect('mongodb://localhost:27017/exampro').then(async () => { 
  await mongoose.connection.db.collection('questions').deleteMany({ chapter: 'Complex Numbers' }); 
  const files = ['easy.json', 'medium.json', 'hard.json']; 
  let total = 0; 
  for(const f of files) { 
    if(!fs.existsSync('../QuestionBank/JeeMains/Maths/Complex Numbers/' + f)) continue; 
    const d = JSON.parse(fs.readFileSync('../QuestionBank/JeeMains/Maths/Complex Numbers/' + f)); 
    for(const q of d) { 
      delete q._id; 
      q.exam='JEE Mains'; 
      q.subject='Maths'; 
      q.topic='Complex Numbers'; 
      q.chapter='Complex Numbers'; 
      q.difficulty=f.replace('.json', '').charAt(0).toUpperCase() + f.replace('.json', '').slice(1); 
    } 
    await mongoose.connection.db.collection('questions').insertMany(d); 
    total += d.length; 
  } 
  console.log('Inserted ' + total + ' questions into DB!'); 
  process.exit(0); 
});
