import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Dashboard() {
  const [profile, setProfile] = useState(null);
  const [levels, setLevels] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [securityReports, setSecurityReports] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDashboardData = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        navigate('/login');
        return;
      }
      try {
        const config = { headers: { Authorization: `Bearer ${token}` } };
        const [profileRes, levelsRes, certsRes, secRes] = await Promise.all([
          axios.get('/api/v1/users/profile', config),
          axios.get('/api/v1/levels', config),
          axios.get('/api/v1/users/certificates', config).catch(() => ({ data: [] })),
          axios.get('/api/v1/users/security-reports', config).catch(() => ({ data: [] }))
        ]);
        setProfile(profileRes.data);
        setLevels(levelsRes.data);
        setCertificates(certsRes.data);
        setSecurityReports(secRes.data);
      } catch (error) {
        console.error(error);
        localStorage.removeItem('token');
        navigate('/login');
      }
    };
    fetchDashboardData();
  }, [navigate]);

  const handleLevelAction = (levelNumber, isPaid) => {
    if (profile.isBlocked) {
      alert("Access Denied: Your account has been blocked due to suspicious activity. Please contact the administrator.");
      return;
    }
    
    // If the user has reached this level and paid, they can directly take the exam.
    // Otherwise, they must pay.
    if (isPaid) {
      navigate('/exam', { state: { levelNumber } });
    } else {
      navigate('/payment', { state: { levelNumber } });
    }
  };

  if (!profile) return <div className="text-center py-20 text-gray-500">Loading Dashboard...</div>;



  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Lakshya Academy — Student Dashboard</h1>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-red-500 hover:text-red-700 font-medium">Logout</button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {profile.isBlocked && (
          <div className="mb-8 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">Account Blocked</h3>
                <div className="mt-2 text-sm text-red-700">
                  <p>Your account has been temporarily blocked due to suspicious activity during an exam. You cannot start or unlock any new levels until an administrator unblocks your account.</p>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center cursor-pointer hover:bg-yellow-50" onClick={() => { if(certificates.length > 0) navigate('/certificate', { state: { certificate: certificates[0] } }); }}>
            <div className="bg-yellow-100 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-yellow-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Certificates</p>
              <p className="text-xl font-bold text-gray-900">{certificates.length} Earned</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="bg-purple-100 p-3 rounded-full mr-4">
              <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Exam Progress</p>
              <p className="text-xl font-bold text-gray-900">{profile.completedLevels.length} Levels Completed</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Name</p>
              <p className="text-xl font-bold text-gray-900">{profile.name}</p>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center">
            <div className="bg-indigo-100 p-3 rounded-full mr-4">
              <svg className="w-8 h-8 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            </div>
            <div>
              <p className="text-sm text-gray-500 font-medium">Student Wallet</p>
              <div className="mt-2 space-y-1">
                <p className="text-sm font-bold text-gray-900">Coins Earned: {profile.coins}</p>
                <p className="text-sm font-bold text-gray-900">Remaining Coins: {10 - profile.coins}</p>
              </div>
            </div>
          </div>
        </div>

        {['Completed', 'Current', 'Locked'].map(section => {
          const sectionLevels = levels.filter(level => {
            const isCompleted = profile.completedLevels.find(l => l.level === level.levelNumber);
            const isUnlocked = level.levelNumber <= profile.currentLevel;
            
            if (section === 'Completed') return isCompleted;
            if (section === 'Current') return !isCompleted && isUnlocked;
            return !isUnlocked;
          });

          if (sectionLevels.length === 0) return null;

          return (
            <div key={section} className="mb-10">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">{section} Levels</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sectionLevels.map(level => {
                  const isCompleted = profile.completedLevels.find(l => l.level === level.levelNumber);
                  const isUnlocked = level.levelNumber <= profile.currentLevel;
                  const isPaid = profile.paidLevels && profile.paidLevels.includes(level.levelNumber);

                  return (
                    <div key={level._id} className={`bg-white rounded-2xl shadow-sm border ${isCompleted ? 'border-green-200' : (isUnlocked ? 'border-indigo-200 shadow-md' : 'border-gray-200 opacity-70')} overflow-hidden flex flex-col justify-between`}>
                      <div>
                        <div className={`p-4 text-white ${isCompleted ? 'bg-green-600' : (isUnlocked ? 'bg-indigo-600' : 'bg-gray-400')} flex justify-between items-center`}>
                          <h3 className="font-bold text-lg">Level {level.levelNumber}</h3>
                          {isCompleted && <span className="bg-white text-green-700 text-xs font-extrabold px-2.5 py-1 rounded-full shadow-xs">✔ Passed</span>}
                          {!isCompleted && isUnlocked && <span className="bg-indigo-500 text-white text-xs font-bold px-2.5 py-1 rounded-full border border-indigo-400">⚡ 3 Attempts Allowed</span>}
                          {!isCompleted && !isUnlocked && <span className="text-xs font-bold px-2 py-1 rounded bg-gray-500">🔒 Locked</span>}
                        </div>
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-lg font-bold text-gray-900 leading-snug">{level.title || `${level.subject} Level ${level.levelNumber}`}</h4>
                          </div>
                          <div className="flex items-center space-x-2 my-2">
                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-full ${
                              level.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                              level.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}>
                              {level.difficulty}
                            </span>
                            <span className="text-xs font-semibold text-gray-500">
                              {level.questionCount} Qs • {level.duration} Mins • {level.passingPercentage}% Pass
                            </span>
                          </div>
                          <p className="text-xs text-indigo-600 font-medium my-2 flex items-center">
                            🔄 Retries generate fresh, non-repeating backup questions on the same topics.
                          </p>
                        </div>
                      </div>
                      
                      <div className="p-6 pt-0">
                        {isCompleted ? (
                          <div className="text-green-700 font-bold text-center bg-green-50 py-2.5 rounded-xl border border-green-200">
                            Score: {isCompleted.score} Marks (Qualified)
                          </div>
                        ) : isUnlocked ? (
                          <button 
                            type="button"
                            onClick={() => alert("Interactive test launching is disabled. Focus is strictly on Question Bank JSON formats and SVG Image Generation.")}
                            className="w-full bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-extrabold py-3 rounded-xl transition border border-indigo-200"
                          >
                            Level {level.levelNumber} — Questions Ready
                          </button>
                        ) : (
                          <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-3 rounded-xl cursor-not-allowed">
                            Pass Level {level.levelNumber - 1} to Unlock
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </main>
    </div>
  );
}
