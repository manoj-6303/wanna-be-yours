import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function CustomTestBuilder() {
  const [filters, setFilters] = useState({
    examType: 'JEE',
    subject: 'Physics',
    chapter: '',
    difficulty: 'Medium',
    count: 10,
    timeLimit: 15
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleGenerate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('token');
      const res = await axios.post('/api/v1/exams/generate', filters, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Navigate to Exam with the generated questions
      navigate('/exam', { 
        state: { 
          isCustomTest: true, 
          customQuestions: res.data,
          timeLimit: filters.timeLimit,
          filters // Pass filters so we can retry the same test
        } 
      });
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to generate custom test.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white shadow px-6 py-4 flex justify-between items-center sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900">Custom Test Builder</h1>
        <button onClick={() => navigate('/dashboard')} className="text-indigo-600 hover:text-indigo-800 font-bold">Back to Dashboard</button>
      </header>

      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 lg:p-8 mt-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Configure Your Custom Test</h2>
          
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 font-medium">
              {error}
            </div>
          )}

          <form onSubmit={handleGenerate} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Exam Type</label>
                <select 
                  value={filters.examType} 
                  onChange={e => setFilters({...filters, examType: e.target.value})} 
                  className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="JEE">JEE Main</option>
                  <option value="EAMCET">EAMCET</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Subject</label>
                <select 
                  value={filters.subject} 
                  onChange={e => {
                    const newSubject = e.target.value;
                    const newFilters = {...filters, subject: newSubject};
                    if ((newSubject === 'Mathematics A' || newSubject === 'Mathematics B') && filters.difficulty === 'Easy') {
                      newFilters.difficulty = 'Medium';
                    }
                    setFilters(newFilters);
                  }} 
                  className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics A">Mathematics A</option>
                  <option value="Mathematics B">Mathematics B</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Chapter (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Leave empty for all chapters or specify one"
                  value={filters.chapter} 
                  onChange={e => setFilters({...filters, chapter: e.target.value})} 
                  className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Difficulty</label>
                <select 
                  value={filters.difficulty} 
                  onChange={e => setFilters({...filters, difficulty: e.target.value})} 
                  className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value="">Mixed</option>
                  {!(filters.subject === 'Mathematics A' || filters.subject === 'Mathematics B') && <option value="Easy">Basic (Easy)</option>}
                  <option value="Medium">Medium</option>
                  <option value="Hard">Advanced (Hard)</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Number of Questions</label>
                <select 
                  value={filters.count} 
                  onChange={e => setFilters({...filters, count: parseInt(e.target.value)})} 
                  className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={30}>30</option>
                  <option value={50}>50</option>
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-gray-700 mb-2">Time Limit (Minutes)</label>
                <select 
                  value={filters.timeLimit} 
                  onChange={e => setFilters({...filters, timeLimit: parseInt(e.target.value)})} 
                  className="w-full border-gray-300 rounded-lg shadow-sm p-3 border focus:ring-indigo-500 focus:border-indigo-500"
                >
                  <option value={15}>15 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={60}>60 Minutes</option>
                  <option value={90}>90 Minutes</option>
                </select>
              </div>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-indigo-600 text-white font-bold py-4 rounded-xl hover:bg-indigo-700 transition disabled:opacity-50 mt-8 shadow-lg text-lg"
            >
              {loading ? 'Generating Custom Test...' : 'Generate Test & Start'}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}
