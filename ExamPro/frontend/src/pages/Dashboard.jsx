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
    
    // Temporarily bypassing payment as requested
    navigate('/exam', { state: { levelNumber } });
  };

  if (!profile) return <div className="text-center py-20 text-gray-500">Loading Dashboard...</div>;



  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Student Dashboard</h1>
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

        <div className="mb-12">
          <div className="flex flex-col items-center justify-center mb-10">
            <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Learning Path</h2>
            <p className="mt-2 text-gray-500">Conquer all 10 levels to complete the challenge!</p>
          </div>

          <div className="relative max-w-4xl mx-auto pb-10">
            {/* The vertical track line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1.5 h-full bg-gray-200 rounded-full z-0"></div>
            
            {Array.from({ length: 10 }, (_, i) => i + 1).map((levelNum, index) => {
              // Find the level data from backend if it exists
              const levelData = levels.find(l => l.levelNumber === levelNum);
              
              // Hardcoded subjects as requested
              let defaultSubject = "Mathematics";
              let colorTheme = "bg-orange-500";
              let lightColorTheme = "bg-orange-50 border-orange-200 text-orange-800";
              let btnColorTheme = "bg-orange-600 hover:bg-orange-700";
              let shadowTheme = "shadow-orange-200";

              if (levelNum <= 3) {
                defaultSubject = "Physics";
                colorTheme = "bg-blue-500";
                lightColorTheme = "bg-blue-50 border-blue-200 text-blue-800";
                btnColorTheme = "bg-blue-600 hover:bg-blue-700";
                shadowTheme = "shadow-blue-200";
              } else if (levelNum <= 6) {
                defaultSubject = "Chemistry";
                colorTheme = "bg-green-500";
                lightColorTheme = "bg-green-50 border-green-200 text-green-800";
                btnColorTheme = "bg-green-600 hover:bg-green-700";
                shadowTheme = "shadow-green-200";
              }

              const actualSubject = levelData ? levelData.subject : defaultSubject;
              const isCompleted = profile.completedLevels && profile.completedLevels.find(l => l.level === levelNum);
              const attemptsCount = (profile.attemptsMap && profile.attemptsMap[levelNum]) || 0;
              // Temporarily unlocking all levels per user request
              // const isUnlocked = levelNum <= profile.currentLevel;
              const isUnlocked = true;
              const isPaid = profile.paidLevels && profile.paidLevels.includes(levelNum);
              
              const isEven = index % 2 === 0;

              return (
                <div key={levelNum} className={`relative z-10 flex items-center justify-between w-full mb-8 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                  {/* The card side */}
                  <div className={`w-5/12 ${isEven ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
                    <div className={`bg-white rounded-2xl p-5 shadow-lg border-2 transition-transform transform hover:-translate-y-1 ${isUnlocked ? 'border-gray-200' : 'border-gray-200 opacity-60 grayscale-[50%]'}`}>
                      <h3 className="text-xl font-black text-gray-900 mb-1">Level {levelNum}</h3>
                      {levelData && levelData.chapter && (
                        <p className="text-sm font-bold text-indigo-600 mb-2 truncate" title={levelData.chapter}>
                          {levelData.chapter}
                        </p>
                      )}
                      <div className="flex items-center justify-center space-x-2 mb-3">
                        <span className={`px-3 py-1 text-xs font-bold rounded-full ${lightColorTheme} uppercase tracking-wider`}>
                          {actualSubject}
                        </span>
                        {levelData && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs font-bold rounded-full">
                            {levelData.difficulty}
                          </span>
                        )}
                      </div>
                      
                      {levelData ? (
                        <>
                          <p className="text-gray-500 text-xs font-medium mb-4">
                            {levelData.questionCount} Qs • {levelData.duration} Mins • {levelData.passingPercentage}% to pass
                          </p>
                          
                          {isCompleted ? (
                            <div className="bg-green-50 text-green-700 font-bold py-2 rounded-xl border border-green-200 text-center">
                              Passed (Score: {isCompleted.score})
                            </div>
                          ) : isUnlocked ? (
                            <button 
                              onClick={() => handleLevelAction(levelNum, isPaid)}
                              disabled={profile.isBlocked}
                              className={`w-full font-bold py-2.5 rounded-xl text-white transition ${profile.isBlocked ? 'bg-red-400 cursor-not-allowed' : btnColorTheme} shadow-md`}
                            >
                              Start Challenge {attemptsCount > 0 ? `(Attempt ${attemptsCount + 1})` : ''}
                            </button>
                          ) : (
                            <button disabled className="w-full bg-gray-100 text-gray-400 font-bold py-2.5 rounded-xl cursor-not-allowed">
                              Locked
                            </button>
                          )}
                        </>
                      ) : (
                        <div className="py-4 text-gray-400 text-sm font-medium italic">
                          Test not created by Admin yet
                        </div>
                      )}
                    </div>
                  </div>

                  {/* The central node */}
                  <div className="w-2/12 flex justify-center relative">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center border-4 border-white shadow-xl ${isCompleted ? 'bg-green-500' : (isUnlocked ? colorTheme : 'bg-gray-300')} text-white font-black text-xl z-20 transition-all ${isUnlocked && !isCompleted ? 'animate-pulse scale-110 shadow-lg ' + shadowTheme : ''}`}>
                      {isCompleted ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                      ) : !isUnlocked ? (
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                      ) : (
                        levelNum
                      )}
                    </div>
                  </div>

                  {/* Empty side for layout balancing */}
                  <div className="w-5/12"></div>
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
