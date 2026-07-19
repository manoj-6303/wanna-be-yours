import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Level from './models/Level.js';
import Question from './models/Question.js';
import User from './models/User.js';
import Result from './models/Result.js';
import ExamAttempt from './models/ExamAttempt.js';
import Certificate from './models/Certificate.js';
import ExamSecurityLog from './models/ExamSecurityLog.js';
import ExamSecurityReport from './models/ExamSecurityReport.js';
import bcrypt from 'bcrypt';

dotenv.config();

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');

const syllabus = {
  Physics: {
    Easy: ['Units and Measurements', 'Motion', 'Newton Laws', 'Work Energy Power'],
    Medium: ['Rotational Motion', 'Gravitation', 'Oscillations', 'Waves', 'Thermodynamics', 'Current Electricity', 'Magnetism'],
    Hard: ['Electromagnetic Induction', 'Alternating Current', 'Ray Optics', 'Wave Optics', 'Modern Physics', 'Semiconductor']
  },
  Chemistry: {
    Easy: ['Atomic Structure', 'Mole Concept', 'Chemical Bonding', 'Periodic Table', 'Classification', 'Coordination Basics', 'Basic Organic Chemistry', 'Hydrocarbons'],
    Medium: ['Thermodynamics', 'Chemical Equilibrium', 'Ionic Equilibrium', 'Electrochemistry', 'Chemical Kinetics', 'Alcohols', 'Aldehydes', 'Ketones', 'Amines'],
    Hard: ['Advanced Organic Reaction', 'Biomolecules', 'Polymers', 'Surface Chemistry', 'Coordination Chemistry', 'p-block', 'd-block']
  },
  "Mathematics A": {
    Easy: [],
    Medium: ['Quadratic Equations', 'Complex Numbers', 'Sequences', 'Matrices', 'Determinants', 'Straight Lines', 'Circles', 'Conic Sections', 'Limits', 'Differentiation'],
    Hard: ['Integration', 'Differential Equations', 'Probability', 'Vectors', '3D Geometry']
  },
  "Mathematics B": {
    Easy: [],
    Medium: ['Trigonometry', 'Statistics', 'Probability', 'Vectors'],
    Hard: ['Advanced Calculus', 'Advanced Probability', '3D Problems', 'Application Based Questions']
  }
};

const levelsConfig = [
  { levelNumber: 1, title: 'Physics Basic Level', fee: 20, passingPercentage: 50, duration: 60, subject: 'Physics', questionCount: 10 },
  { levelNumber: 2, title: 'Physics Medium Level', fee: 20, passingPercentage: 70, duration: 90, subject: 'Physics', questionCount: 10 },
  { levelNumber: 3, title: 'Physics Advanced Level', fee: 20, passingPercentage: 90, duration: 120, subject: 'Physics', questionCount: 10 },
  
  { levelNumber: 4, title: 'Chemistry Basic Level', fee: 20, passingPercentage: 50, duration: 60, subject: 'Chemistry', questionCount: 10 },
  { levelNumber: 5, title: 'Chemistry Medium Level', fee: 20, passingPercentage: 70, duration: 90, subject: 'Chemistry', questionCount: 10 },
  { levelNumber: 6, title: 'Chemistry Advanced Level', fee: 20, passingPercentage: 90, duration: 120, subject: 'Chemistry', questionCount: 10 },
  
  { levelNumber: 7, title: 'Mathematics A Medium', fee: 20, passingPercentage: 70, duration: 90, subject: 'Mathematics A', questionCount: 10 },
  { levelNumber: 8, title: 'Mathematics A Advanced', fee: 20, passingPercentage: 90, duration: 120, subject: 'Mathematics A', questionCount: 10 },
  
  { levelNumber: 9, title: 'Mathematics B Medium', fee: 20, passingPercentage: 70, duration: 90, subject: 'Mathematics B', questionCount: 10 },
  { levelNumber: 10, title: 'Mathematics B Advanced', fee: 20, passingPercentage: 90, duration: 120, subject: 'Mathematics B', questionCount: 10 }
];

function getDifficultyForLevel(levelNumber) {
  if ([1, 4].includes(levelNumber)) return 'Easy';
  if ([2, 5, 7, 9].includes(levelNumber)) return 'Medium';
  if ([3, 6, 8, 10].includes(levelNumber)) return 'Hard';
  return 'Medium';
}

function generateQuestion(levelNumber, subject, difficulty, chapter, index) {
  let qText, options, correctAnswer, explanation;
  const examType = index % 2 === 0 ? "JEE" : "EAMCET";

  // Simple procedural generation using the index as a seed variable
  const v1 = (index * 3 % 15) + 2;
  const v2 = (index * 7 % 20) + 1;
  const v3 = v1 * v2;

  if (subject === 'Physics') {
    if (difficulty === 'Easy') {
      qText = `A body of mass ${v1} kg is moving with an acceleration of ${v2} m/s². What is the force? (Chapter: ${chapter})`;
      correctAnswer = `${v3} N`;
      options = [`${v3} N`, `${v3 + 5} N`, `${v1 + v2} N`, `${v3 * 2} N`];
      explanation = `Force = mass * acceleration = ${v1} * ${v2} = ${v3} N.`;
    } else if (difficulty === 'Medium') {
      qText = `Find the kinetic energy of an object of mass ${v1} kg moving at velocity ${v2} m/s. (Chapter: ${chapter})`;
      const ans = 0.5 * v1 * v2 * v2;
      correctAnswer = `${ans} J`;
      options = [`${ans} J`, `${ans * 2} J`, `${v1 * v2} J`, `${ans / 2} J`];
      explanation = `KE = 1/2 * m * v² = 1/2 * ${v1} * ${v2}² = ${ans} J.`;
    } else {
      qText = `In an AC circuit, the peak voltage is ${v3} V. Find the RMS voltage. (Chapter: ${chapter})`;
      const ans = (v3 / Math.sqrt(2)).toFixed(2);
      correctAnswer = `${ans} V`;
      options = [`${ans} V`, `${v3} V`, `${(v3 / 2).toFixed(2)} V`, `${(v3 * Math.sqrt(2)).toFixed(2)} V`];
      explanation = `V_rms = V_peak / sqrt(2) = ${v3} / 1.414 = ${ans} V.`;
    }
  } else if (subject === 'Chemistry') {
    if (difficulty === 'Easy') {
      qText = `Calculate the number of moles in ${v3} g of a substance with molar mass ${v1} g/mol. (Chapter: ${chapter})`;
      const ans = (v3 / v1).toFixed(2);
      correctAnswer = `${ans} mol`;
      options = [`${ans} mol`, `${v3 * v1} mol`, `${(v3/v1 + 1).toFixed(2)} mol`, `${(v3/v1 - 0.5).toFixed(2)} mol`];
      explanation = `Moles = Mass / Molar Mass = ${v3} / ${v1} = ${ans} mol.`;
    } else if (difficulty === 'Medium') {
      qText = `If the rate constant is ${v2} s⁻¹, what is the half-life of a first order reaction? (Chapter: ${chapter})`;
      const ans = (0.693 / v2).toFixed(3);
      correctAnswer = `${ans} s`;
      options = [`${ans} s`, `${(0.693 * v2).toFixed(3)} s`, `${v2} s`, `${(v2 / 2).toFixed(3)} s`];
      explanation = `t_1/2 = 0.693 / k = 0.693 / ${v2} = ${ans} s.`;
    } else {
      qText = `Predict the major product when ${v1} moles of reactant A reacts with ${v2} moles of B in a complex organic synthesis. (Chapter: ${chapter})`;
      correctAnswer = `Product P-${v3}`;
      options = [`Product P-${v3}`, `Product P-${v1}`, `Product P-${v2}`, `No reaction`];
      explanation = `Based on advanced organic mechanisms, ${v1} moles of A and ${v2} moles of B form Product P-${v3}.`;
    }
  } else {
    // Math
    if (difficulty === 'Medium') {
      qText = `Evaluate the integral of ${v1}x from 0 to ${v2}. (Chapter: ${chapter})`;
      const ans = 0.5 * v1 * v2 * v2;
      correctAnswer = `${ans}`;
      options = [`${ans}`, `${ans * 2}`, `${v1 * v2}`, `${ans / 2}`];
      explanation = `Integral of ${v1}x is ${v1}x²/2. Evaluated from 0 to ${v2} is ${ans}.`;
    } else {
      qText = `Find the magnitude of vector A = ${v1}i + ${v2}j. (Chapter: ${chapter})`;
      const ans = Math.sqrt(v1*v1 + v2*v2).toFixed(2);
      correctAnswer = `${ans}`;
      options = [`${ans}`, `${v1+v2}`, `${Math.abs(v1-v2)}`, `${v3}`];
      explanation = `Magnitude = sqrt(${v1}² + ${v2}²) = ${ans}.`;
    }
  }

  // Shuffle options
  options = options.sort(() => Math.random() - 0.5);
  // Ensure correct answer is in options
  if (!options.includes(correctAnswer)) options[0] = correctAnswer;

  return {
    level: levelNumber,
    subject,
    chapter,
    examType,
    difficulty,
    questionType: "Numerical",
    question: qText,
    options,
    correctAnswer,
    explanation,
    marks: 1
  };
}

const seedDatabase = async () => {
  try {
    console.log('Clearing existing data...');
    await Level.deleteMany();
    await Question.deleteMany();
    await User.deleteMany();
    await Result.deleteMany();
    await ExamAttempt.deleteMany();
    await Certificate.deleteMany();
    await ExamSecurityLog.deleteMany();
    await ExamSecurityReport.deleteMany();

    console.log('Seeding 10 Levels...');
    await Level.insertMany(levelsConfig);

    console.log('Generating procedural question bank (50 questions per chapter)...');
    
    let allQuestions = [];
    
    for (const config of levelsConfig) {
      const { levelNumber, subject } = config;
      const difficulty = getDifficultyForLevel(levelNumber);
      const chapters = syllabus[subject][difficulty] || [];
      
      for (const chapter of chapters) {
        for (let i = 0; i < 50; i++) {
          allQuestions.push(generateQuestion(levelNumber, subject, difficulty, chapter, i));
        }
      }
    }

    console.log(`Inserting ${allQuestions.length} questions in batches...`);
    
    const BATCH_SIZE = 500;
    for (let i = 0; i < allQuestions.length; i += BATCH_SIZE) {
      const batch = allQuestions.slice(i, i + BATCH_SIZE);
      await Question.insertMany(batch);
      console.log(`Inserted batch ${i / BATCH_SIZE + 1} of ${Math.ceil(allQuestions.length / BATCH_SIZE)}...`);
    }

    console.log('Question bank generation complete!');

    console.log('Creating demo users...');
    
    const salt = await bcrypt.genSalt(10);
    const studentPassword = await bcrypt.hash('123456', salt);
    const adminPassword = await bcrypt.hash('admin', salt);

    const users = [
      {
        name: 'Student User',
        email: 'student@test.com',
        password: studentPassword,
        role: 'student',
        examType: 'JEE',
        coins: 0,
        currentLevel: 1,
        completedLevels: []
      },
      {
        name: 'Admin User',
        email: 'admin@test.com',
        password: adminPassword, 
        role: 'admin',
      }
    ];

    for (let u of users) {
      await User.create(u);
    }

    console.log('Data Successfully Seeded!');
    process.exit();
  } catch (error) {
    console.error('Seeding Error:', error);
    process.exit(1);
  }
};

seedDatabase();
