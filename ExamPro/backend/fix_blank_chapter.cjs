require('dotenv').config();
const mongoose = require('mongoose');

const chapters = [
  'Alcohols , Phenols and Ethers', 'Aldehydes and Ketones', 'Amines', 'Aromatic Compounds', 
  'Atomic Structure', 'Biomolecules', 'Carboxylic Acid Derivatives', 'Chemical Bonding and Molecular Structure', 
  'Chemical Equilibrium', 'Chemical Kinetics', 'Chemical Thermodynamics', 'Chemistry in Everyday Life', 
  'Coordination Compounds', 'Electrochemistry', 'Environmental Chemistry', 'Gaseous State', 
  'General Organic Chemistry', 'Haloalkanes and Haloarenes', 'Hydrocarbons', 'Hydrogen', 
  'Ionic equilibrium', 'Isomerism of Organic Compounds', 'Metallurgy', 'Mole Concept', 
  'P-block elements', 'Periodic Table and Periodicity', 'Qualitative analysis', 'Redox Reactions', 
  'Solid State', 'Solutions', 'Solutions and colligative solutions', 'Some concepts of chemistry', 
  'Surface Chemistry', 'd and f Block Elements', 'purification and charectarization of organic compounds', 
  's-block elements'
];

function guessChapter(sourceFile) {
  if (!sourceFile) return null;
  const s = sourceFile.toLowerCase();
  
  if (s.includes('states of matter') || s.includes('gaseous state')) return 'Gaseous State';
  if (s.includes('thermodynamics')) return 'Chemical Thermodynamics';
  if (s.includes('coodination') || s.includes('coordination')) return 'Coordination Compounds';
  if (s.includes('purification of organic')) return 'purification and charectarization of organic compounds';
  if (s.includes('structure of atom')) return 'Atomic Structure';
  if (s.includes('alcohols phenols and ethers')) return 'Alcohols , Phenols and Ethers';

  // Sort by length descending to match longest first
  const sorted = [...chapters].sort((a, b) => b.length - a.length);
  for (const c of sorted) {
    if (s.includes(c.toLowerCase())) return c;
  }
  
  return null;
}

async function fixChapters() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;
  
  const badDocs = await Q.find({ subject: "Chemistry", $or: [{chapter: null}, {chapter: 'undefined'}, {chapter: 'null'}, {chapter: undefined}, {chapter: ''}] });
  
  let fixed = 0;
  for (const doc of badDocs) {
    const matched = guessChapter(doc.sourceFile);
    if (matched) {
      await Q.collection.updateOne({ _id: doc._id }, { $set: { chapter: matched, topic: matched } });
      fixed++;
    } else {
      console.log('Could not match:', doc.sourceFile);
    }
  }
  
  console.log(`Fixed ${fixed} out of ${badDocs.length} questions.`);
  process.exit(0);
}

fixChapters();
