import { useState, useEffect, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Exam() {
  const location = useLocation();
  const navigate = useNavigate();
  const levelNumber = location.state?.levelNumber || 1;
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState({}); // { questionId: selectedOption }
  const [markedForReview, setMarkedForReview] = useState({}); // { index: boolean }
  const [timeLeft, setTimeLeft] = useState(15 * 60);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [showSummaryModal, setShowSummaryModal] = useState(false);

  // Initialize Exam Attempt and Restore Answers on Load
  useEffect(() => {
    
    const initAttempt = async () => {
      const token = localStorage.getItem('token');
      try {
        await axios.post('/api/v1/exams/start-attempt', { level: parseInt(levelNumber) }, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } catch (err) {
        console.error("Failed to init attempt", err);
      }
    };
    initAttempt();

    const savedAnswers = localStorage.getItem(`exam_answers_${levelNumber}`);
    if (savedAnswers) {
      try { setAnswers(JSON.parse(savedAnswers)); } catch(e){}
    }
  }, [levelNumber]);



  const handleSubmit = useCallback(async () => {
    if (submitting) return;
    setSubmitting(true);
    
    const token = localStorage.getItem('token');
    
    const payload = {
      level: parseInt(levelNumber) || 0,
      answers: questions.map(q => ({
        questionId: q._id,
        selectedAnswer: answers[q._id] || null
      })),
      timeTaken: (15 * 60) - timeLeft
    };

    try {
      const res = await axios.post('/api/v1/results', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      localStorage.removeItem(`exam_answers_${levelNumber}`);
      navigate('/result', { state: { resultData: res.data } });
    } catch (error) {
      console.error(error);
      alert('Failed to submit exam');
      setSubmitting(false);
    }
  }, [submitting, levelNumber, questions, answers, timeLeft, navigate]);




  useEffect(() => {
    const fetchQuestions = async () => {
      const token = localStorage.getItem('token');
      try {
        const res = await axios.get(`/api/v1/exams/${levelNumber}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setQuestions(res.data);
        setLoading(false);
      } catch (error) {
        console.error(error);
        alert('Failed to load exam');
        navigate('/dashboard');
      }
    };
    fetchQuestions();
  }, [levelNumber, navigate]);

  useEffect(() => {
    if (loading || submitting) return;

    if (timeLeft <= 0) {
      handleSubmit(); // Auto-submit when time is up
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, loading, submitting, handleSubmit]);

  const handleOptionSelect = (questionId, option) => {
    setAnswers(prev => {
      const newAnswers = { ...prev, [questionId]: option };
      if (!isCustomTest) {
        localStorage.setItem(`exam_answers_${levelNumber}`, JSON.stringify(newAnswers));
      }
      return newAnswers;
    });
  };

  const toggleMarkForReview = () => {
    setMarkedForReview(prev => ({ ...prev, [currentQuestionIndex]: !prev[currentQuestionIndex] }));
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };



  if (loading) return <div className="text-center py-20 text-gray-500 font-bold text-xl">Loading Exam...</div>;
  if (!questions.length) return <div className="text-center py-20">No questions found.</div>;



  const currentQ = questions[currentQuestionIndex];

  const answeredCount = Object.keys(answers).length;
  const markedCount = Object.values(markedForReview).filter(Boolean).length;
  const notAnsweredCount = questions.length - answeredCount;

  if (showSummaryModal) {
    return (
      <div className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full p-8 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-3 bg-indigo-600"></div>
          <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Exam Summary</h2>
          
          <div className="space-y-4 mb-8">
            <div className="flex justify-between items-center p-4 bg-green-50 rounded-xl border border-green-100">
              <span className="text-green-800 font-bold flex items-center"><div className="w-3 h-3 bg-green-600 rounded-full mr-2"></div> Answered</span>
              <span className="text-2xl font-black text-green-700">{answeredCount}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-orange-50 rounded-xl border border-orange-100">
              <span className="text-orange-800 font-bold flex items-center"><div className="w-3 h-3 bg-orange-500 rounded-full mr-2"></div> Marked For Review</span>
              <span className="text-2xl font-black text-orange-700">{markedCount}</span>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
              <span className="text-gray-600 font-bold flex items-center"><div className="w-3 h-3 bg-gray-400 rounded-full mr-2"></div> Not Answered</span>
              <span className="text-2xl font-black text-gray-700">{notAnsweredCount}</span>
            </div>
          </div>

          <div className="flex flex-col space-y-3">
            <button 
              onClick={() => {
                setShowSummaryModal(false);
              }}
              className="w-full bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-xl hover:bg-gray-200 transition"
            >
              Back to Exam
            </button>
            <button 
              onClick={() => {
                setShowSummaryModal(false);
                handleSubmit();
              }}
              className="w-full bg-indigo-600 text-white font-extrabold py-4 px-4 rounded-xl hover:bg-indigo-700 transition shadow-lg"
            >
              Confirm Final Submit
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col select-none">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <div className="flex items-center space-x-4">
          <h1 className="text-2xl font-bold text-gray-900">{isCustomTest ? 'Custom Practice Test' : `Level ${levelNumber} Test`}</h1>
        </div>
        <div className="flex items-center space-x-6">
          <div className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-bold text-xl flex items-center shadow-sm">
            <svg className="w-6 h-6 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            {formatTime(timeLeft)}
          </div>
          <button 
            onClick={() => setShowSummaryModal(true)} 
            disabled={submitting}
            className="bg-red-600 text-white font-bold px-6 py-2 rounded-lg hover:bg-red-700 transition shadow"
          >
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        
        {/* Main Question Area */}
        <div className="lg:col-span-3 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 flex flex-col">
          <div className="flex justify-between items-center mb-6 border-b pb-4">
            <span className="text-sm font-bold text-indigo-600 uppercase tracking-wider">{currentQ.subject}</span>
            <span className="text-sm font-medium text-gray-500">Difficulty: {currentQ.difficulty}</span>
          </div>

          <div className="flex-1">
            <h2 className="text-2xl font-medium text-gray-900 mb-8 leading-relaxed">
              <span className="text-gray-400 mr-2">Question {currentQuestionIndex + 1}/{questions.length}.</span> 
              {currentQ.question}
            </h2>

            <div className="space-y-4">
              {currentQ.options.map((opt, idx) => {
                const isSelected = answers[currentQ._id] === opt;
                return (
                  <label 
                    key={idx} 
                    className={`block w-full p-4 border rounded-xl cursor-pointer transition-all duration-200 ${isSelected ? 'bg-indigo-50 border-indigo-500 shadow-sm' : 'border-gray-200 hover:bg-gray-50 hover:border-indigo-300'}`}
                  >
                    <div className="flex items-center">
                      <input 
                        type="radio" 
                        name={`question-${currentQ._id}`} 
                        value={opt}
                        checked={isSelected}
                        onChange={() => handleOptionSelect(currentQ._id, opt)}
                        className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                      />
                      <span className="ml-4 text-lg text-gray-700">{opt}</span>
                    </div>
                  </label>
                );
              })}
            </div>
          </div>

          <div className="flex justify-between mt-10 pt-6 border-t border-gray-100">
            <button 
              onClick={() => setCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
              disabled={currentQuestionIndex === 0}
              className="px-6 py-3 rounded-lg font-bold border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 transition"
            >
              Previous
            </button>
            <button
              onClick={toggleMarkForReview}
              className={`px-6 py-3 rounded-lg font-bold border transition ${markedForReview[currentQuestionIndex] ? 'bg-orange-100 border-orange-300 text-orange-700 hover:bg-orange-200' : 'border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              {markedForReview[currentQuestionIndex] ? 'Unmark Review' : 'Mark for Review'}
            </button>
            <button 
              onClick={() => setCurrentQuestionIndex(prev => Math.min(questions.length - 1, prev + 1))}
              disabled={currentQuestionIndex === questions.length - 1}
              className="px-6 py-3 rounded-lg font-bold bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              Next Question
            </button>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <h3 className="text-lg font-bold text-gray-900 mb-4">Question Navigator</h3>
          <div className="grid grid-cols-5 gap-3">
            {questions.map((q, idx) => {
              const isAnswered = !!answers[q._id];
              const isCurrent = idx === currentQuestionIndex;
              const isMarked = markedForReview[idx];
              
              let btnClass = 'bg-gray-100 text-gray-600 hover:bg-gray-200';
              if (isMarked) {
                btnClass = 'bg-orange-400 text-white';
              } else if (isAnswered) {
                btnClass = 'bg-indigo-600 text-white';
              }

              return (
                <button
                  key={idx}
                  onClick={() => setCurrentQuestionIndex(idx)}
                  className={`w-10 h-10 rounded-full font-bold text-sm flex items-center justify-center transition-all duration-200
                    ${isCurrent ? 'ring-2 ring-indigo-600 ring-offset-2' : ''}
                    ${btnClass}
                  `}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          <div className="mt-8 space-y-3 text-sm text-gray-600">
            <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-indigo-600 mr-3"></div> Answered</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-orange-400 mr-3"></div> Marked for Review</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-gray-100 mr-3 border border-gray-200"></div> Unanswered</div>
            <div className="flex items-center"><div className="w-4 h-4 rounded-full bg-white ring-2 ring-indigo-600 mr-3"></div> Current</div>
          </div>
        </div>

      </main>
    </div>
  );
}
