const mongoose = require('mongoose');
require('dotenv').config();

// Ensure API key is provided
if (!process.env.GEMINI_API_KEY) {
  console.error("❌ Error: GEMINI_API_KEY is not set in your .env file!");
  console.error("Please add it to the backend/.env file and try again.");
  process.exit(1);
}

async function generateExplanation(questionText, options, correctAnswer, subject, chapter, difficulty) {
  const prompt = `You are an expert tutor in ${subject} for JEE Mains. 
A student has asked for an explanation for the following question.

**Chapter:** ${chapter}
**Difficulty:** ${difficulty}
**Question:** 
${questionText}

**Options:**
${options.map((opt, i) => `${String.fromCharCode(65 + i)}. ${opt}`).join('\n')}

**Correct Answer:** 
${correctAnswer}

**Task:**
Write a detailed, step-by-step academic explanation that strictly arrives at the correct answer provided above. 
- You MUST format your explanation as a bulleted or numbered step-by-step list (point-wise format). Do not write a single large paragraph.
- Use LaTeX formatting for all mathematical or chemical equations by wrapping them in \`$$\` or \`$\`. 
- Be clear, logical, and educational.
- Do NOT output anything other than the explanation text itself.`;

  try {
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${process.env.GEMINI_API_KEY}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }]
        })
    });
    
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error.message);
    }
    
    return data.candidates[0].content.parts[0].text.trim();
  } catch (error) {
    console.error("API Error:", error.message);
    return null;
  }
}

async function main() {
  await mongoose.connect('mongodb://localhost:27017/exampro');
  const Question = mongoose.model('Question', new mongoose.Schema({}, { strict: false }));
  
  // Dry run: Get 20 questions from "Amines" chapter that have short or missing explanations
  console.log("Fetching all questions with missing or short explanations across all chapters...");
  const questions = await Question.find({ 
    $or: [
      { explanation: { $exists: false } },
      { explanation: { $regex: /Verified text-only/i } },
      { explanation: { $regex: /Please see the solution/i } },
      { explanation: { $regex: /Directly based on fundamental/i } },
      { explanation: { $size: 1 } }, // some might be arrays or strings
      { explanation: "" }
    ]
  });

  // If the query above misses some due to string length, we filter in JS
  let targetQuestions = questions;
  if (targetQuestions.length === 0) {
     const allQuestions = await Question.find({});
     targetQuestions = allQuestions.filter(q => !q.explanation || q.explanation.length < 150);
  }

  console.log(`Found ${targetQuestions.length} questions to process.`);

  let successCount = 0;
  for (let i = 0; i < targetQuestions.length; i++) {
    const q = targetQuestions[i];
    console.log(`\n[${i+1}/${targetQuestions.length}] Processing Question ID: ${q._id}`);
    
    // Format options safely
    let opts = q.options || [];
    if (typeof opts[0] === 'object') {
        opts = opts.map(o => o.text || o.value);
    }
    
    // Ensure we have a valid correct answer string to feed the AI
    let correct = q.correctAnswer;
    if (typeof correct === 'object') correct = correct.text || correct.value;
    if (!correct) correct = "Unknown (derive it logically)";

    let retries = 3;
    let explanation = null;
    while (retries > 0 && !explanation) {
       console.log("Generating explanation via Gemini API...");
       explanation = await generateExplanation(q.question, opts, correct, q.subject, q.chapter, q.difficulty);
       if (!explanation) {
          console.log(`❌ Failed. API Quota hit. Waiting 65s for quota reset... (${retries - 1} left)`);
          await new Promise(r => setTimeout(r, 65000));
          retries--;
       }
    }
    
    if (explanation) {
      console.log("✅ Generated explanation:");
      console.log(explanation.substring(0, 100) + "...");
      
      // Update DB
      await Question.updateOne({ _id: q._id }, { $set: { explanation: explanation } });
      successCount++;
    } else {
      console.log("❌ Exhausted retries for this question. Skipping.");
    }
    
    // Rate limiting: wait 5 seconds between requests to stay safely under 15 RPM
    await new Promise(r => setTimeout(r, 5000));
  }
  
  console.log(`\n🎉 Run complete! Successfully updated ${successCount} questions in Amines chapter.`);
  process.exit(0);
}

main().catch(err => {
  console.error("Fatal Error:", err);
  process.exit(1);
});
