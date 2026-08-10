import React from 'react';
import MathText from './MathText';

function sanitizeExplanation(raw) {
  if (!raw) return '';
  let text = String(raw);

  // Remove AI inner monologue phrases
  text = text.replace(/This is a beautiful,?\s*classic question!?\s*Let's use this\.?/gi, '');
  text = text.replace(/Let's choose a different height or initial velocity\..*?Let's use this\./gs, '');
  text = text.replace(/Let's write the question with:.*$/gs, '');
  text = text.replace(/Let me keep it simple:?.*?(?=\.|$)/gi, '');
  text = text.replace(/Let's keep it simple:?/gi, '');
  text = text.replace(/\?\s*Wait,?\s*let's.*?\./gi, '.');
  text = text.replace(/\?\s*Wait!.*?\./gi, '.');
  text = text.replace(/\?\s*No!.*?\./gi, '.');
  text = text.replace(/Yes!\s*This is correct\.?/gi, '');
  text = text.replace(/\?\s*Wait,?\s*let's check:.*$/gi, '');
  text = text.replace(/Wait,?\s*let's check:?.*$/gi, '');
  text = text.replace(/Wait!\s*Let's check:?.*$/gi, '');
  text = text.replace(/Let's recalculate the ratio:?.*$/gi, '');
  text = text.replace(/Let's check the wording:?.*$/gi, '');

  if (text.includes("Let's recalculate")) text = text.split("Let's recalculate")[0];
  if (text.includes("What if the initial velocity")) text = text.split("What if the initial velocity")[0];
  if (text.includes("Let's choose a different")) text = text.split("Let's choose a different")[0];

  return text.trim();
}

export default function SolutionFormatter({ explanation, solution, correctAnswer }) {
  const rawText = explanation || solution || '';
  const cleanedText = sanitizeExplanation(rawText);

  if (!cleanedText) {
    return (
      <div className="text-gray-500 italic text-sm p-3 bg-gray-50 rounded-lg">
        Step-by-step solution provided in diagram above.
      </div>
    );
  }

  // Split text into logical steps if possible (e.g. by implies symbol, period, or existing step markers)
  // If the string contains multiple mathematical steps (separated by \implies or .), let's format cleanly
  const rawSentences = cleanedText.split(/(?<=\.)\s+(?=[A-Z\$\\])|(?<=\\implies)\s+/).filter(s => s.trim().length > 0);

  const steps = [];
  let tempStep = [];

  rawSentences.forEach((sentence) => {
    tempStep.push(sentence.trim());
    if (tempStep.join(' ').length > 80 || sentence.includes('\\implies') || sentence.includes('=')) {
      steps.push(tempStep.join(' '));
      tempStep = [];
    }
  });

  if (tempStep.length > 0) {
    steps.push(tempStep.join(' '));
  }

  // If splitting produced 1 single block, fall back to simple view
  const displaySteps = steps.length > 1 ? steps : [cleanedText];

  return (
    <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-xs space-y-4">
      <div className="flex items-center justify-between border-b border-indigo-50 pb-3">
        <span className="font-extrabold text-indigo-900 text-base flex items-center gap-2">
          <span className="p-1 bg-indigo-100 rounded-lg text-indigo-700 text-sm">💡</span>
          Detailed Step-by-Step Solution
        </span>
        {correctAnswer && (
          <span className="text-xs font-bold text-green-800 bg-green-50 px-3 py-1.5 rounded-lg border border-green-200 shadow-2xs flex items-center gap-1">
            <span className="text-green-600 font-extrabold">✔ Correct:</span> <MathText text={correctAnswer} />
          </span>
        )}
      </div>

      <div className="space-y-3">
        {displaySteps.map((stepText, idx) => (
          <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50/70 border border-slate-100">
            {displaySteps.length > 1 && (
              <span className="shrink-0 bg-indigo-600 text-white font-extrabold text-xs px-2 py-1 rounded-md mt-0.5">
                Step {idx + 1}
              </span>
            )}
            <div className="text-gray-800 text-base leading-relaxed flex-1">
              <MathText text={stepText} />
            </div>
          </div>
        ))}
      </div>

      {correctAnswer && (
        <div className="mt-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl flex items-center justify-between">
          <span className="text-xs font-bold text-green-900 uppercase tracking-wider">Final Answer</span>
          <span className="text-base font-extrabold text-green-700 bg-white px-3 py-1 rounded-lg border border-green-200 shadow-2xs">
            <MathText text={correctAnswer} />
          </span>
        </div>
      )}
    </div>
  );
}

