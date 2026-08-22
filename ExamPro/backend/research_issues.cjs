require('dotenv').config();
const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

async function research() {
  await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
  const Q = require('./models/Question.js').default;

  // 1. Text formatting issue in options (missing $)
  const missingDollar = await Q.find({ 'options.text': { $regex: /\\text\{/ }, 'options.text': { $not: /\$/ } }).limit(2);
  console.log("=== Missing Dollar in options ===");
  if (missingDollar.length > 0) console.log(missingDollar[0].options);

  // 2. Duplicate explanations
  const dupeExpl = await Q.aggregate([
    { $match: { explanation: { $ne: null, $ne: "" } } },
    { $group: { _id: "$explanation", count: { $sum: 1 }, subjects: { $addToSet: "$subject" } } },
    { $match: { count: { $gt: 5 } } },
    { $sort: { count: -1 } },
    { $limit: 3 }
  ]);
  console.log("\n=== Duplicate Explanations ===");
  console.log(dupeExpl);

  // 3. Question Types and Options
  const numericalCount = await Q.countDocuments({ options: { $size: 0 } });
  console.log(`\n=== Questions with 0 options: ${numericalCount} ===`);

  // 4. Image links in Physics
  const physicsImages = await Q.find({ subject: "Physics", $or: [{ questionImage: { $ne: null } }, { explanationImage: { $ne: null } }, { has_question_image: true }] }).limit(3);
  console.log("\n=== Physics Image paths in DB ===");
  physicsImages.forEach(q => {
    console.log(`ID: ${q._id}, QImg: ${q.questionImage}, ExplImg: ${q.explanationImage}, has_q_img: ${q.has_question_image}`);
  });

  process.exit(0);
}

research();
