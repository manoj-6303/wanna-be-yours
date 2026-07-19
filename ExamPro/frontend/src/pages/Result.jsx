import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Result() {
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state?.resultData;
  const [filterType, setFilterType] = useState('All');

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">No Result Found</h2>
          <button onClick={() => navigate('/dashboard')} className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold">Return to Dashboard</button>
        </div>
      </div>
    );
  }

  const { result, qualified, newCertificate } = data;

  const weakTopicsMap = {};
  result.answers.forEach(ans => {
    if (!ans.correct && ans.selectedAnswer && ans.chapter) {
      weakTopicsMap[ans.chapter] = (weakTopicsMap[ans.chapter] || 0) + 1;
    }
  });
  const weakTopics = Object.keys(weakTopicsMap).sort((a, b) => weakTopicsMap[b] - weakTopicsMap[a]);

  const filteredAnswers = result.answers.filter(ans => {
    if (filterType === 'All') return true;
    if (filterType === 'Correct') return ans.correct;
    if (filterType === 'Not Attempted') return !ans.selectedAnswer;
    if (filterType === 'Wrong') return !ans.correct && ans.selectedAnswer;
    if (filterType === 'Wrong') return !ans.correct && ans.selectedAnswer;
    return true;
  });


  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Score Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100 text-center">
          <div className={`p-8 ${qualified ? 'bg-green-600' : 'bg-red-600'} text-white`}>
            <h1 className="text-4xl font-extrabold mb-2">
              {qualified ? 'Qualified! 🎉' : 'Not Qualified ❌'}
            </h1>
            <p className="text-lg opacity-90 mb-4">
              {qualified ? "You've successfully passed this level." : "You didn't meet the passing criteria for this level."}
            </p>
            {qualified && (
              <div className="inline-block bg-yellow-400 text-yellow-900 font-bold px-4 py-2 rounded-full text-sm shadow-md">
                Coin Earned: +1
              </div>
            )}
          </div>
          
          <div className="p-10">
            <div className="flex justify-center items-end space-x-2 mb-8">
              <span className="text-7xl font-black text-gray-900">{result.percentage.toFixed(0)}%</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-500 font-medium text-sm">Total Score</p>
                <p className="text-2xl font-bold text-indigo-600">{result.score}</p>
              </div>
              <div className="p-4 bg-green-50 rounded-xl border border-green-200">
                <p className="text-green-700 font-medium text-sm">Correct</p>
                <p className="text-2xl font-bold text-green-600">{result.correctAnswers}</p>
              </div>
              <div className="p-4 bg-red-50 rounded-xl border border-red-200">
                <p className="text-red-700 font-medium text-sm">Wrong</p>
                <p className="text-2xl font-bold text-red-600">{result.wrongAnswers}</p>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-gray-500 font-medium text-sm">Time Taken</p>
                <p className="text-2xl font-bold text-indigo-600">{Math.floor(result.timeTaken / 60)}m {result.timeTaken % 60}s</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
              <button onClick={() => navigate('/dashboard')} className="flex-1 bg-indigo-600 text-white font-bold py-4 rounded-xl text-lg hover:bg-indigo-700 transition shadow-lg shadow-indigo-200">
                Return to Dashboard
              </button>
              {!qualified && (
                <button onClick={() => {
                  if (window.confirm("Review your mistakes before attempting again. A new set of questions will be generated. Are you sure you want to retry now?")) {
                    navigate('/exam', { state: { levelNumber: result.level } });
                  }
                }} className="flex-1 bg-gray-900 text-white font-bold py-4 rounded-xl text-lg hover:bg-gray-800 transition shadow-lg">
                  Re-Attempt Level
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Certificate Notification */}
        {newCertificate && (
          <div className="bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-3xl shadow-xl overflow-hidden text-center p-8 text-white relative">
            <div className="absolute top-0 right-0 p-4 opacity-20">
              <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
            <h2 className="text-3xl font-extrabold mb-2 relative z-10">Congratulations! 🏆</h2>
            <p className="text-lg mb-6 relative z-10">You have completed 10 Challenge Levels and earned a Certificate of Achievement!</p>
            <button 
              onClick={() => navigate('/certificate', { state: { certificate: newCertificate } })}
              className="relative z-10 bg-white text-yellow-700 font-extrabold py-3 px-8 rounded-full shadow-lg hover:bg-gray-50 transition"
            >
              View Certificate
            </button>
          </div>
        )}



        {/* Weak Topic Analysis */}
        {weakTopics.length > 0 && (
          <div className="bg-red-50 rounded-3xl shadow-sm border border-red-100 p-8">
            <h2 className="text-2xl font-bold text-red-900 mb-4">Areas To Improve</h2>
            <div className="mb-6">
              <p className="text-red-700 font-medium mb-3">Weak Topics:</p>
              <div className="flex flex-wrap gap-2">
                {weakTopics.map(topic => (
                  <span key={topic} className="px-3 py-1 bg-white text-red-800 border border-red-200 rounded-full font-bold text-sm shadow-sm flex items-center">
                    ❌ {topic}
                  </span>
                ))}
              </div>
            </div>
            <div className="bg-white p-4 rounded-xl border border-red-200 inline-block">
              <p className="text-red-800 font-bold">Recommendation: <span className="font-normal">Practice 20 more questions on these topics before retrying.</span></p>
            </div>
          </div>
        )}

        {/* Detailed Analysis */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 p-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 border-b pb-4 gap-4">
            <h2 className="text-2xl font-bold text-gray-900">Question Wise Analysis</h2>
            <div className="flex flex-wrap gap-2">
              {['All', 'Correct', 'Wrong', 'Not Attempted'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg font-bold text-sm transition ${filterType === type ? 'bg-indigo-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'}`}
                >
                  {type === 'Correct' ? '✓ Correct' : type === 'Wrong' ? '❌ Wrong' : type === 'Not Attempted' ? '⚠ Not Attempted' : 'All Questions'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-8">
            {filteredAnswers.map((ans, index) => {
              const isUnanswered = !ans.selectedAnswer;
              const cardBg = ans.correct ? 'border-green-200 bg-green-50/30' : (isUnanswered ? 'border-gray-200 bg-gray-50/30' : 'border-red-200 bg-red-50/30');
              const iconBg = ans.correct ? 'bg-green-100 text-green-600' : (isUnanswered ? 'bg-gray-200 text-gray-500' : 'bg-red-100 text-red-600');
              
              return (
              <div key={ans.questionId} className={`p-6 rounded-2xl border ${cardBg}`}>
                <div className="flex items-start">
                  <div className={`mt-1 mr-4 rounded-full p-1 ${iconBg}`}>
                    {ans.correct ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                    ) : isUnanswered ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M20 12H4" /></svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center mb-4">
                      <span className="text-gray-400 mr-2 font-bold">Q{index + 1}.</span>
                      {ans.correct ? (
                        <span className="text-green-600 font-bold text-sm bg-green-100 px-2 py-1 rounded">✔ Correct Answer</span>
                      ) : isUnanswered ? (
                        <span className="text-gray-600 font-bold text-sm bg-gray-200 px-2 py-1 rounded">⚪ Unanswered</span>
                      ) : (
                        <span className="text-red-600 font-bold text-sm bg-red-100 px-2 py-1 rounded">❌ Wrong Answer</span>
                      )}
                      {(ans.chapter || ans.difficulty) && (
                        <div className="ml-auto flex gap-2">
                          {ans.chapter && <span className="text-xs font-bold text-indigo-700 bg-indigo-100 px-2 py-1 rounded-full">{ans.chapter}</span>}
                          {ans.difficulty && <span className="text-xs font-bold text-purple-700 bg-purple-100 px-2 py-1 rounded-full">{ans.difficulty}</span>}
                        </div>
                      )}
                    </div>
                    <p className="text-lg font-medium text-gray-900 mb-4">{ans.questionText}</p>
                    
                    <div className="space-y-2 mb-4">
                      {ans.options?.map((opt, i) => {
                        const isUserChoice = opt === ans.selectedAnswer;
                        const isCorrectAnswer = opt === ans.correctAnswer;
                        
                        let optStyle = "border-gray-200 text-gray-600";
                        let optBg = "bg-white";
                        
                        if (isCorrectAnswer) {
                          optStyle = "border-green-500 text-green-800 font-bold";
                          optBg = "bg-green-100";
                        } else if (isUserChoice && !ans.correct) {
                          optStyle = "border-red-500 text-red-800";
                          optBg = "bg-red-100";
                        }

                        return (
                          <div key={i} className={`p-3 rounded-lg border ${optStyle} ${optBg} flex justify-between`}>
                            <span>{opt}</span>
                            {isUserChoice && <span className="text-xs uppercase tracking-wider font-bold opacity-70 flex items-center">Your Answer</span>}
                            {isCorrectAnswer && !isUserChoice && <span className="text-xs uppercase tracking-wider font-bold opacity-70 flex items-center text-green-700">Correct Answer</span>}
                          </div>
                        );
                      })}
                    </div>
                    

                  </div>
                </div>
              </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
