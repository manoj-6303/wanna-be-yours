import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import MathRenderer from '../components/MathRenderer.jsx';


export default function Admin() {
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('adminActiveTab') || 'dashboard');
  
  useEffect(() => {
    localStorage.setItem('adminActiveTab', activeTab);
  }, [activeTab]);

  const [stats, setStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [levels, setLevels] = useState([]);
  const [securityData, setSecurityData] = useState({ attempts: [], logs: [] });
  const [certificates, setCertificates] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [totalQPages, setTotalQPages] = useState(1);
  const [totalQuestionsCount, setTotalQuestionsCount] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [uploadFile, setUploadFile] = useState(null);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [isQuestionModalOpen, setIsQuestionModalOpen] = useState(false);
  
  // Custom Test UI State
  const [weeklyTests, setWeeklyTests] = useState([]);
  const [customTestForm, setCustomTestForm] = useState({
    subject: 'Physics', chapter: 'Kinematics', difficulty: 'Medium', examType: 'General', level: 1, passingPercentage: 40, duration: 60, fee: 20, displayCount: 10
  });
  const [availableQuestions, setAvailableQuestions] = useState([]);
  const [selectedQuestionIds, setSelectedQuestionIds] = useState([]);

  // Question Bank UI State
  const [groupedChapters, setGroupedChapters] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [visibleCount, setVisibleCount] = useState(10);
  const [importSummary, setImportSummary] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [previewFileName, setPreviewFileName] = useState('');
  const [bulkSubject, setBulkSubject] = useState('');
  const [bulkDifficulty, setBulkDifficulty] = useState('');
  const [bulkExamType, setBulkExamType] = useState('');
  const [qSearch, setQSearch] = useState('');
  const [qFilters, setQFilters] = useState({ subject: '', chapter: '', difficulty: '', status: '', examType: '' });
  const [qPage, setQPage] = useState(1);
  const [uploadPDFFile, setUploadPDFFile] = useState(null);
  const [pdfSubject, setPdfSubject] = useState('Physics');
  const [pdfDifficulty, setPdfDifficulty] = useState('Medium');
  const [questionFormData, setQuestionFormData] = useState({
    level: 1, subject: 'Physics', chapter: '', question: '', options: ['', '', '', ''], correctAnswer: '', explanation: ''
  });

  const itemsPerPage = 20;
  const navigate = useNavigate();

  const token = localStorage.getItem('token');

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchData();
  }, [token, navigate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const [statsRes, usersRes, questionsRes, levelsRes, securityRes, certsRes, analyticsRes, weeklyTestsRes] = await Promise.all([
        axios.get('/api/v1/admin/stats', config),
        axios.get('/api/v1/admin/users', config),
        axios.get('/api/v1/questions', config),
        axios.get('/api/v1/levels', config),
        axios.get('/api/v1/exams/security-logs', config),
        axios.get('/api/v1/admin/certificates', config).catch(() => ({ data: [] })),
        axios.get('/api/v1/admin/analytics', config).catch(() => ({ data: { mostWrongQuestions: [], difficultTopics: [] } })),
        axios.get('/api/v1/weekly-tests', config).catch(() => ({ data: [] }))
      ]);

      setStats(statsRes.data);
      setUsers(usersRes.data);
      setQuestions(questionsRes.data.questions || questionsRes.data);
      if (questionsRes.data.pages) setTotalQPages(questionsRes.data.pages);
      if (questionsRes.data.total) setTotalQuestionsCount(questionsRes.data.total);
      setLevels(levelsRes.data);
      setSecurityData(securityRes.data);
      setCertificates(certsRes.data);
      setAnalytics(analyticsRes.data);
      setWeeklyTests(weeklyTestsRes.data);
    } catch (error) {
      console.error('Failed to fetch admin data', error);
      if (error.response?.status === 401) {
        navigate('/dashboard'); // Not an admin
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if ((activeTab === 'questions' || activeTab === 'custom-tests') && !loading) {
      const fetchQuestions = async () => {
        try {
          const params = new URLSearchParams({
            search: qSearch,
            ...qFilters
          });
          // Remove empty filters
          Object.keys(qFilters).forEach(key => {
            if (!qFilters[key]) params.delete(key);
          });
          if (!qSearch) params.delete('search');

          const res = await axios.get(`/api/v1/questions/grouped?${params.toString()}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          const chapters = res.data.chapters || [];
          setGroupedChapters(chapters);
          
          const total = chapters.reduce((sum, ch) => sum + ch.totalQuestions, 0);
          setTotalQuestionsCount(total);
        } catch (error) {
          console.error('Failed to fetch questions', error);
        }
      };
      fetchQuestions();
    }
  }, [qPage, qSearch, qFilters, activeTab]);

  const handleUpdateLevel = async (id, fee, duration) => {
    try {
      await axios.put(`/api/v1/levels/${id}`, { fee, duration }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Level updated successfully!');
      fetchData();
    } catch (error) {
      alert('Failed to update level');
    }
  };

  const handleUnblockUser = async (id) => {
    if (!window.confirm('Are you sure you want to unblock this user?')) return;
    try {
      await axios.put(`/api/v1/admin/users/${id}/unblock`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      alert('Failed to unblock user');
    }
  };

  const handleDeleteQuestion = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question?')) return;
    try {
      await axios.delete(`/api/v1/questions/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      alert('Failed to delete question');
    }
  };

  const fetchAvailableQuestions = async () => {
    try {
      const res = await axios.get('/api/v1/questions', {
        params: { 
          subject: customTestForm.subject, 
          chapter: customTestForm.chapter,
          limit: 100 // fetch a good chunk for selection
        },
        headers: { Authorization: `Bearer ${token}` }
      });
      setAvailableQuestions(res.data.questions || res.data);
      setSelectedQuestionIds([]);
    } catch (error) {
      alert('Failed to fetch available questions');
    }
  };

  const handleCreateCustomTest = async (e) => {
    e.preventDefault();
    if (selectedQuestionIds.length === 0) {
      return alert('Please select at least one question.');
    }
    
    const payload = {
      ...customTestForm,
      questionCount: customTestForm.displayCount || 10,
      questionIds: selectedQuestionIds,
      status: 'Published' // publish immediately for simplicity
    };
    
    try {
      await axios.post('/api/v1/weekly-tests', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Custom test created and published successfully!');
      setCustomTestForm({ ...customTestForm, chapter: '' });
      setSelectedQuestionIds([]);
      setAvailableQuestions([]);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to create test');
    }
  };

  const toggleQuestionSelection = (id) => {
    setSelectedQuestionIds(prev => 
      prev.includes(id) ? prev.filter(qId => qId !== id) : [...prev, id]
    );
  };

  const handleUpdateStatus = async (id, status) => {
    try {
      await axios.put(`/api/v1/questions/${id}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (error) {
      alert('Failed to update status');
    }
  };

  const handleParseFile = async (e, file, isPdf = false) => {
    e.preventDefault();
    if (!file) return alert('Please select a file to upload');
    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    if (isPdf) {
      formData.append('subject', pdfSubject);
      formData.append('difficulty', pdfDifficulty);
    }

    try {
      const res = await axios.post('/api/v1/questions/import/parse', formData, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.async) {
        // Poll for completion
        const jobId = res.data.jobId;
        const interval = setInterval(async () => {
          try {
            const statusRes = await axios.get(`/api/v1/questions/import/status/${jobId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            const job = statusRes.data.job;
            if (job.status === 'COMPLETED') {
              clearInterval(interval);
              setPreviewData(job.results);
              setPreviewFileName(file.name);
              setUploadFile(null);
              setUploadPDFFile(null);
              setUploading(false);
            } else if (job.status === 'FAILED') {
              clearInterval(interval);
              alert(job.error || 'AI Parsing failed');
              setUploading(false);
            }
          } catch (e) {
            console.error('Polling error', e);
          }
        }, 2000);
      } else {
        setPreviewData(res.data.previewData);
        setPreviewFileName(file.name);
        setUploadFile(null);
        setUploadPDFFile(null);
        setUploading(false);
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to parse file');
      setUploading(false);
    }
  };

  const handleFinalizeImport = async () => {
    setUploading(true);
    try {
      const res = await axios.post('/api/v1/questions/import/finalize', { questions: previewData, fileName: previewFileName }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setImportSummary(res.data);
      setPreviewData(null);
      fetchData();
    } catch (error) {
      alert(error.response?.data?.message || 'Failed to finalize import');
    } finally {
      setUploading(false);
    }
  };

  const applyBulkChanges = () => {
    if (!previewData) return;
    const newData = previewData.map(q => ({
      ...q,
      subject: bulkSubject || q.subject,
      difficulty: bulkDifficulty || q.difficulty,
      examType: bulkExamType || q.examType
    }));
    setPreviewData(newData);
    alert('Bulk changes applied to preview table!');
  };

  const paginatedQuestions = questions;
  const totalPages = totalQPages;

  const handleSaveQuestion = async (e) => {
    e.preventDefault();
    try {
      if (editingQuestion) {
        await axios.put(`/api/v1/questions/${editingQuestion._id}`, questionFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.post('/api/v1/questions', questionFormData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      setIsQuestionModalOpen(false);
      fetchData();
    } catch (error) {
      alert('Failed to save question');
    }
  };

  const openAddModal = () => {
    setEditingQuestion(null);
    setQuestionFormData({ level: 1, subject: 'Physics', chapter: '', question: '', options: ['', '', '', ''], correctAnswer: '', explanation: '' });
    setIsQuestionModalOpen(true);
  };

  const openEditModal = (q) => {
    setEditingQuestion(q);
    setQuestionFormData(q);
    setIsQuestionModalOpen(true);
  };

  if (loading) return <div className="min-h-screen flex items-center justify-center text-gray-500 font-bold text-xl">Loading Admin Portal...</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-gray-900 text-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-wider">ExamPro <span className="text-indigo-400">Admin</span></h1>
          <button onClick={() => { localStorage.clear(); navigate('/login'); }} className="text-gray-300 hover:text-white font-medium">Logout</button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col md:flex-row mt-8 px-4 sm:px-6 lg:px-8 gap-8">
        
        {/* Sidebar Navigation */}
        <div className="md:w-64 flex-shrink-0">
          <nav className="space-y-2 bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            {['dashboard', 'analytics', 'users', 'questions', 'custom-tests', 'levels', 'security', 'certificates'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`w-full text-left px-4 py-3 rounded-xl font-bold capitalize transition-colors ${activeTab === tab ? 'bg-indigo-50 text-indigo-700' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                {tab}
              </button>
            ))}
          </nav>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 p-8 mb-8">
          
          {/* Dashboard Tab */}
          {activeTab === 'dashboard' && stats && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Platform Overview</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="p-6 bg-indigo-50 rounded-xl border border-indigo-100">
                  <p className="text-indigo-600 font-medium text-sm">Total Revenue</p>
                  <p className="text-3xl font-bold text-indigo-900 mt-2">₹{stats.revenue}</p>
                </div>
                <div className="p-6 bg-green-50 rounded-xl border border-green-100">
                  <p className="text-green-600 font-medium text-sm">Active Students</p>
                  <p className="text-3xl font-bold text-green-900 mt-2">{stats.totalUsers}</p>
                </div>
                <div className="p-6 bg-blue-50 rounded-xl border border-blue-100">
                  <p className="text-blue-600 font-medium text-sm">Total Tests Taken</p>
                  <p className="text-3xl font-bold text-blue-900 mt-2">{stats.totalTests}</p>
                </div>
                <div className="p-6 bg-purple-50 rounded-xl border border-purple-100">
                  <p className="text-purple-600 font-medium text-sm">Tests Passed</p>
                  <p className="text-3xl font-bold text-purple-900 mt-2">{stats.passedTests}</p>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && analytics && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Learning Analytics</h2>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Most Wrong Questions */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Most Missed Questions</h3>
                  <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
                    {analytics.mostWrongQuestions.map((q, index) => (
                      <div key={q.questionId} className="bg-red-50 p-4 rounded-xl border border-red-100">
                        <div className="flex justify-between items-start mb-2">
                          <span className="bg-red-100 text-red-800 text-xs font-bold px-2 py-1 rounded">Missed {q.wrongCount} times</span>
                          <span className="bg-gray-200 text-gray-700 text-xs font-bold px-2 py-1 rounded">{q.chapter}</span>
                        </div>
                        <p className="text-sm font-medium text-gray-900">{q.text}</p>
                      </div>
                    ))}
                    {analytics.mostWrongQuestions.length === 0 && <p className="text-gray-500">No data available yet.</p>}
                  </div>
                </div>

                {/* Difficult Topics */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <h3 className="text-lg font-bold text-gray-900 mb-4 border-b pb-2">Most Difficult Topics</h3>
                  <div className="space-y-4">
                    {analytics.difficultTopics.map((topic, index) => (
                      <div key={topic.topic} className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border border-orange-100">
                        <div className="flex items-center">
                          <span className="w-8 h-8 rounded-full bg-orange-200 text-orange-800 flex items-center justify-center font-bold mr-3">{index + 1}</span>
                          <span className="font-bold text-gray-900">{topic.topic}</span>
                        </div>
                        <span className="text-orange-800 font-bold bg-orange-200 px-3 py-1 rounded-full">{topic.count} Mistakes</span>
                      </div>
                    ))}
                    {analytics.difficultTopics.length === 0 && <p className="text-gray-500">No data available yet.</p>}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Registered Students</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Target Exam</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Coins</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Current Level</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.filter(u => u.role === 'student').map((user) => (
                      <tr key={user._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{user.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">{user.examType}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">{user.coins}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Level {user.currentLevel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {user.isBlocked ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Blocked</span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Active</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.isBlocked && (
                            <button 
                              onClick={() => handleUnblockUser(user._id)}
                              className="text-indigo-600 hover:text-indigo-900 font-bold"
                            >
                              Unblock
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Questions Tab */}
          {activeTab === 'questions' && (
            <div>
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                <h2 className="text-2xl font-bold text-gray-900">Question Bank ({totalQuestionsCount})</h2>
                <div className="flex flex-wrap gap-2 items-center">
                  <form onSubmit={(e) => handleParseFile(e, uploadFile)} className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
                    <input type="file" accept=".csv, .xlsx" onChange={(e) => setUploadFile(e.target.files[0])} className="text-sm w-48" />
                    <button type="submit" disabled={uploading} className="bg-green-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-green-700 transition disabled:opacity-50 text-sm">
                      {uploading ? 'Parsing...' : 'Import CSV/Excel'}
                    </button>
                  </form>
                  <form onSubmit={(e) => handleParseFile(e, uploadPDFFile, true)} className="flex items-center space-x-2 bg-gray-100 p-2 rounded-lg">
                    <select value={pdfSubject} onChange={e => {
                      setPdfSubject(e.target.value);
                      if ((e.target.value === 'Mathematics') && pdfDifficulty === 'Easy') {
                        setPdfDifficulty('Medium');
                      }
                    }} className="text-sm border rounded p-1">
                      <option value="Physics">Physics</option>
                      <option value="Chemistry">Chemistry</option>
                      <option value="Mathematics">Mathematics</option>
                      <option value="Biology">Biology</option>
                    </select>
                    <select value={pdfDifficulty} onChange={e => setPdfDifficulty(e.target.value)} className="text-sm border rounded p-1">
                      {!(pdfSubject === 'Mathematics') && <option value="Easy">Easy</option>}
                      <option value="Medium">Medium</option>
                      <option value="Hard">Hard</option>
                    </select>
                    <input type="file" accept=".pdf" onChange={(e) => setUploadPDFFile(e.target.files[0])} className="text-sm w-48" />
                    <button type="submit" disabled={uploading} className="bg-red-600 text-white px-3 py-1.5 rounded-lg font-medium hover:bg-red-700 transition disabled:opacity-50 text-sm">
                      Import PDF
                    </button>
                  </form>
                  <button onClick={openAddModal} className="bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-indigo-700 transition text-sm h-full">
                    + Add Question
                  </button>
                </div>
              </div>

              {/* Filters */}
              <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm mb-6 flex flex-wrap gap-4 items-center">
                <input 
                  type="text" 
                  placeholder="Search questions..." 
                  value={qSearch} 
                  onChange={e => { setQSearch(e.target.value); setQPage(1); }} 
                  className="flex-1 min-w-[200px] border border-gray-300 rounded-md p-2 text-sm"
                />
                <select value={qFilters.subject} onChange={e => {
                  const newSubject = e.target.value;
                  const newFilters = {...qFilters, subject: newSubject};
                  if ((newSubject === 'Mathematics') && qFilters.difficulty === 'Easy') {
                    newFilters.difficulty = 'Medium';
                  }
                  setQFilters(newFilters);
                  setQPage(1);
                }} className="border border-gray-300 rounded-md p-2 text-sm">
                  <option value="">All Subjects</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                </select>
                <select value={qFilters.difficulty} onChange={e => { setQFilters({...qFilters, difficulty: e.target.value}); setQPage(1); }} className="border border-gray-300 rounded-md p-2 text-sm">
                  <option value="">All Difficulties</option>
                  {!(qFilters.subject === 'Mathematics') && <option value="Easy">Easy</option>}
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
                <select value={qFilters.status} onChange={e => { setQFilters({...qFilters, status: e.target.value}); setQPage(1); }} className="border border-gray-300 rounded-md p-2 text-sm">
                  <option value="">All Statuses</option>
                  <option value="Published">Published</option>
                  <option value="Draft">Draft</option>
                  <option value="Archived">Archived</option>
                </select>
              </div>

              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {Object.entries(groupedChapters.reduce((acc, curr) => {
                  const subject = curr._id.subject || 'Unknown Subject';
                  if (!acc[subject]) acc[subject] = [];
                  acc[subject].push(curr);
                  return acc;
                }, {})).map(([subject, chapters]) => {
                  const isSubjectExpanded = expandedSubjects[subject] !== false;
                  return (
                  <div key={subject} className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <button 
                      type="button"
                      className="w-full px-6 py-4 flex justify-between items-center bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer border-b border-indigo-100 focus:outline-none"
                      onClick={() => setExpandedSubjects(prev => ({ ...prev, [subject]: !isSubjectExpanded }))}
                    >
                      <h2 className="text-2xl font-bold text-indigo-900">{subject}</h2>
                      <div className="flex items-center space-x-4">
                        <span className="bg-indigo-200 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">
                          {chapters.length} Chapters
                        </span>
                        <span className="text-indigo-900 font-bold text-xl">{isSubjectExpanded ? '▼' : '▶'}</span>
                      </div>
                    </button>
                    {isSubjectExpanded && (
                    <div className="space-y-4 p-4 max-h-[500px] overflow-y-auto">
                      {chapters.map((chapterGroup) => {
                  const chapterId = `${chapterGroup._id.subject}-${chapterGroup._id.chapter}`;
                  const isExpanded = expandedChapter === chapterId;
                  return (
                    <div key={chapterId} className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                      <div 
                        className="px-6 py-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                        onClick={() => { setExpandedChapter(isExpanded ? null : chapterId); setVisibleCount(10); }}
                      >
                        <h3 className="font-bold text-gray-900 text-lg">
                          {chapterGroup._id.chapter}
                        </h3>
                        <div className="flex items-center space-x-4">
                          <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">
                            {chapterGroup.totalQuestions} Questions
                          </span>
                          <span className="text-gray-500 font-bold">{isExpanded ? '▼' : '▶'}</span>
                        </div>
                      </div>
                      
                      {isExpanded && (
                        <div className="p-4 bg-white border-t border-gray-100 space-y-3">
                          {['Easy', 'Medium', 'Hard'].map(diff => {
                            const qs = chapterGroup.questions.filter(q => (q.difficulty || 'Medium') === diff);
                            if (qs.length === 0) return null;
                            return (
                              <details key={diff} className="border border-gray-200 rounded-lg group mb-4">
                                <summary className="p-3 bg-gray-50 font-bold cursor-pointer hover:bg-gray-100 flex justify-between items-center rounded-lg">
                                  <span>{diff} ({chapterGroup._id.chapter})</span>
                                  <span className="text-gray-500 text-sm bg-gray-200 px-2 py-1 rounded-full">{qs.length} Questions</span>
                                </summary>
                                <div className="p-3 space-y-3 bg-white mt-2 border-t border-gray-100">
                                  {qs.slice(0, visibleCount).map(q => (
                            <div key={q._id} className={`p-4 rounded-xl border flex justify-between items-start ${q.status === 'Archived' ? 'bg-gray-100 border-gray-300 opacity-60' : 'bg-gray-50 border-gray-200'}`}>
                              <div className="flex-1 pr-6">
                                <div className="flex space-x-2 mb-2">
                                  <span className="px-2 py-1 bg-indigo-100 text-indigo-800 text-xs font-bold rounded">Level {q.level || 0}</span>
                                  <span className={`px-2 py-1 text-xs font-bold rounded ${
                                    q.difficulty === 'Easy' ? 'bg-green-100 text-green-800' :
                                    q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                    'bg-red-100 text-red-800'
                                  }`}>{q.difficulty}</span>
                                  <span className={`px-2 py-1 text-xs font-bold rounded ${q.status === 'Published' ? 'bg-green-100 text-green-800' : q.status === 'Archived' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{q.status || 'Published'}</span>
                                </div>
                                <div className="text-gray-900 font-medium text-sm mt-1 mb-2 max-w-full overflow-hidden">
                                  <span className="font-bold mr-2 text-indigo-600">Q:</span>
                                  <MathRenderer text={q.question} />
                                </div>
                                
                                {q.questionImage && (
                                  <div className="mt-3 mb-3 text-sm">
                                    <span className="font-bold text-gray-600 block mb-1 text-xs uppercase tracking-wider">Question Image</span>
                                    <img 
                                      src={`/images/${encodeURI(q.questionImage)}`} 
                                      alt="Question figure" 
                                      className="mt-2 w-full max-w-3xl object-contain rounded border border-gray-200" 
                                      
                                    />
                                  </div>
                                )}
                                
                                {q.options && q.options.length > 0 && (
                                  <div className="mt-3 pl-4 border-l-2 border-indigo-200">
                                    {q.options.map((opt, idx) => (
                                      <div key={idx} className="text-sm text-gray-700 flex items-start mt-1.5">
                                        <span className="font-bold mr-2 w-5 text-gray-500">{String.fromCharCode(65 + idx)}.</span>
                                        <div className="flex-1"><MathRenderer text={opt.value || opt.text || opt} /></div>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {q.correctAnswer && (() => {
                                  const correctIndex = q.options ? q.options.findIndex(opt => {
                                    const val = opt.value || opt.text || opt;
                                    return val === q.correctAnswer;
                                  }) : -1;
                                  const letterStr = correctIndex >= 0 ? `Option ${String.fromCharCode(65 + correctIndex)}: ` : '';
                                  return (
                                    <div className="mt-3 text-sm flex items-start bg-green-50 p-2 rounded border border-green-100 inline-block">
                                      <span className="font-bold text-green-700 mr-2">Correct Answer:</span>
                                      {letterStr && <span className="font-bold text-indigo-700 mr-2">{letterStr}</span>}
                                      <span className="text-gray-800 font-medium"><MathRenderer text={q.correctAnswer} /></span>
                                    </div>
                                  );
                                })()}

                                {q.explanation && (
                                  <div className="mt-3 text-sm">
                                    <span className="font-bold text-gray-600 block mb-1 text-xs uppercase tracking-wider">Explanation</span>
                                    <div className="text-gray-700 bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm overflow-hidden">
                                      <MathRenderer text={q.explanation} />
                                    </div>
                                  </div>
                                )}
                                
                                {q.solutionImage && q.solutionImage !== q.questionImage && (
                                  <div className="mt-3 text-sm">
                                    <span className="font-bold text-gray-600 block mb-1 text-xs uppercase tracking-wider">Solution Image</span>
                                    <img 
                                      src={`/images/${encodeURI(q.solutionImage)}`} 
                                      alt="Solution" 
                                      className="mt-2 w-full max-w-3xl object-contain rounded border border-gray-200" 
                                      
                                    />
                                  </div>
                                )}
                                
                                {q.explanationImage && q.explanationImage !== q.questionImage && q.explanationImage !== q.solutionImage && (
                                  <div className="mt-3 text-sm">
                                    <span className="font-bold text-gray-600 block mb-1 text-xs uppercase tracking-wider">Explanation Image</span>
                                    <img 
                                      src={`/images/${encodeURI(q.explanationImage)}`} 
                                      alt="Explanation figure" 
                                      className="mt-2 w-full max-w-3xl object-contain rounded border border-gray-200" 
                                      
                                    />
                                  </div>
                                )}
                              </div>
                              <div className="flex flex-col space-y-2 items-end">
                                <button onClick={() => handleUpdateStatus(q._id, q.status === 'Published' ? 'Archived' : 'Published')} className="text-orange-600 hover:text-orange-800 font-medium text-sm">
                                  {q.status === 'Published' ? 'Archive' : 'Publish'}
                                </button>
                                <button onClick={() => openEditModal(q)} className="text-blue-600 hover:text-blue-800 font-medium text-sm">Edit</button>
                                <button onClick={() => handleDeleteQuestion(q._id)} className="text-red-600 hover:text-red-800 font-medium text-sm">Delete</button>
                              </div>
                            </div>
                          ))}
                          {qs.length > visibleCount && (
                            <div className="text-center pt-2">
                              <button 
                                onClick={() => setVisibleCount(v => v + 10)}
                                className="text-indigo-600 font-bold hover:text-indigo-800 text-sm bg-indigo-50 px-4 py-2 rounded-full transition-colors"
                              >
                                Load More Questions ({qs.length - visibleCount} remaining)
                              </button>
                            </div>
                          )}
                                </div>
                              </details>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                    </div>
                    )}
                  </div>
                );
                })}
                {groupedChapters.length === 0 && <p className="text-gray-500 text-center py-4">No questions match your criteria.</p>}
              </div>

              {totalPages > 1 && (
                <div className="flex justify-center mt-6 space-x-2">
                  <button disabled={qPage === 1} onClick={() => setQPage(p => p - 1)} className="px-3 py-1 border rounded disabled:opacity-50">Previous</button>
                  <span className="px-3 py-1">Page {qPage} of {totalPages}</span>
                  <button disabled={qPage === totalPages} onClick={() => setQPage(p => p + 1)} className="px-3 py-1 border rounded disabled:opacity-50">Next</button>
                </div>
              )}
            </div>
          )}

          {/* Custom Tests Tab */}
          {activeTab === 'custom-tests' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Create Custom Test</h2>
              <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
                <form onSubmit={handleCreateCustomTest} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
                      <select 
                        required 
                        value={customTestForm.subject} 
                        onChange={e => setCustomTestForm({...customTestForm, subject: e.target.value, chapter: ''})} 
                        className="w-full border-gray-300 rounded-md p-2 border"
                      >
                        <option value="">Select Subject...</option>
                        {[...new Set(groupedChapters.map(g => g._id.subject))].map(sub => (
                          <option key={sub} value={sub}>{sub}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
                      <select 
                        required 
                        value={customTestForm.chapter} 
                        onChange={e => setCustomTestForm({...customTestForm, chapter: e.target.value})} 
                        className="w-full border-gray-300 rounded-md p-2 border"
                        disabled={!customTestForm.subject}
                      >
                        <option value="">Select Chapter...</option>
                        {groupedChapters
                          .filter(g => g._id.subject === customTestForm.subject)
                          .map(g => g._id.chapter)
                          .sort()
                          .map(chap => (
                            <option key={chap} value={chap}>{chap}</option>
                          ))
                        }
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Level Number</label>
                      <input required type="number" min="1" value={customTestForm.level} onChange={e => setCustomTestForm({...customTestForm, level: Number(e.target.value)})} className="w-full border-gray-300 rounded-md p-2 border" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Difficulty</label>
                      <select value={customTestForm.difficulty} onChange={e => setCustomTestForm({...customTestForm, difficulty: e.target.value})} className="w-full border-gray-300 rounded-md p-2 border">
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Passing %</label>
                      <input required type="number" min="1" max="100" value={customTestForm.passingPercentage} onChange={e => setCustomTestForm({...customTestForm, passingPercentage: Number(e.target.value)})} className="w-full border-gray-300 rounded-md p-2 border" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Duration (mins)</label>
                      <input required type="number" min="1" value={customTestForm.duration} onChange={e => setCustomTestForm({...customTestForm, duration: Number(e.target.value)})} className="w-full border-gray-300 rounded-md p-2 border" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Questions to Display</label>
                      <input required type="number" min="1" value={customTestForm.displayCount} onChange={e => setCustomTestForm({...customTestForm, displayCount: Number(e.target.value)})} className="w-full border-gray-300 rounded-md p-2 border" />
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    
                    <button type="submit" className="bg-indigo-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-indigo-700">
                      Create Test ({selectedQuestionIds.length} Qs)
                    </button>
                  </div>
                </form>
              </div>

              {groupedChapters.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
                  <div className="flex justify-between items-center mb-4 sticky top-0 bg-white z-10 py-2 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-900">Select Questions for Test</h3>
                    <div className="bg-indigo-600 text-white px-4 py-2 rounded-full font-bold shadow-sm">
                      {selectedQuestionIds.length} Questions Selected
                    </div>
                  </div>
                  <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                    {Object.entries(groupedChapters.reduce((acc, curr) => {
                      const subject = curr._id.subject || 'Unknown Subject';
                      if (!acc[subject]) acc[subject] = [];
                      acc[subject].push(curr);
                      return acc;
                    }, {})).map(([subject, chapters]) => {
                      const isSubjectExpanded = expandedSubjects[subject] !== false;
                      return (
                      <div key={subject} className="mb-8 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                        <button 
                          type="button"
                          className="w-full px-6 py-4 flex justify-between items-center bg-indigo-50 hover:bg-indigo-100 transition-colors cursor-pointer border-b border-indigo-100 focus:outline-none"
                          onClick={() => setExpandedSubjects(prev => ({ ...prev, [subject]: !isSubjectExpanded }))}
                        >
                          <h2 className="text-2xl font-bold text-indigo-900">{subject}</h2>
                          <div className="flex items-center space-x-4">
                            <span className="bg-indigo-200 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">
                              {chapters.length} Chapters
                            </span>
                            <span className="text-indigo-900 font-bold text-xl">{isSubjectExpanded ? '▼' : '▶'}</span>
                          </div>
                        </button>
                        {isSubjectExpanded && (
                        <div className="space-y-4 p-4 max-h-[500px] overflow-y-auto">
                          {chapters.map((chapterGroup) => {
                      const chapterId = `${chapterGroup._id.subject}-${chapterGroup._id.chapter}`;
                      const isExpanded = expandedChapter === chapterId;
                      return (
                        <div key={chapterId} className="border border-gray-200 rounded-xl bg-white shadow-sm overflow-hidden">
                          <div 
                            className="px-6 py-4 bg-gray-50 flex justify-between items-center cursor-pointer hover:bg-gray-100 transition-colors"
                            onClick={() => { setExpandedChapter(isExpanded ? null : chapterId); setVisibleCount(10); }}
                          >
                            <h3 className="font-bold text-gray-900 text-lg">
                              {chapterGroup._id.chapter}
                            </h3>
                            <div className="flex items-center space-x-4">
                              <span className="bg-indigo-100 text-indigo-800 text-sm font-bold px-3 py-1 rounded-full">
                                {chapterGroup.totalQuestions} Questions
                              </span>
                              <span className="text-gray-500 font-bold">{isExpanded ? '▼' : '▶'}</span>
                            </div>
                          </div>
                          {isExpanded && (
                            <div className="p-4 space-y-4">
                              {['Easy', 'Medium', 'Hard'].map(diff => {
                                const qs = chapterGroup.questions.filter(q => (q.difficulty || 'Medium') === diff);
                                if (qs.length === 0) return null;
                                return (
                                  <details key={diff} className="border border-gray-200 rounded-lg group mb-4">
                                    <summary className="p-3 bg-gray-50 font-bold cursor-pointer hover:bg-gray-100 flex justify-between items-center rounded-lg">
                                      <div className="flex items-center space-x-3">
                                        <span>{diff} ({chapterGroup._id.chapter})</span>
                                        <button
                                          type="button"
                                          onClick={(e) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            const newIds = qs.map(q => q._id);
                                            const allSelected = newIds.every(id => selectedQuestionIds.includes(id));
                                            if (allSelected) {
                                              setSelectedQuestionIds(prev => prev.filter(id => !newIds.includes(id)));
                                            } else {
                                              setSelectedQuestionIds(prev => [...new Set([...prev, ...newIds])]);
                                            }
                                          }}
                                          className="text-xs bg-indigo-100 text-indigo-700 px-2 py-1 rounded hover:bg-indigo-200 shadow-sm"
                                        >
                                          {qs.every(q => selectedQuestionIds.includes(q._id)) ? 'Deselect All' : 'Select All'}
                                        </button>
                                      </div>
                                      <span className="text-gray-500 text-sm bg-gray-200 px-2 py-1 rounded-full">{qs.length} Questions</span>
                                    </summary>
                                    <div className="p-3 space-y-4 bg-white mt-2 border-t border-gray-100">
                                      {qs.slice(0, visibleCount).map((q) => (
                                <div key={q._id} className="flex flex-col border border-gray-200 rounded-lg bg-white overflow-hidden shadow-sm hover:shadow transition-shadow">
                                  <div className="flex justify-between items-center px-4 py-2 bg-gray-50 border-b border-gray-200">
                                    <div className="flex items-center space-x-2">
                                      <input 
                                        type="checkbox" 
                                        checked={selectedQuestionIds.includes(q._id)}
                                        onChange={() => {
                                          if (selectedQuestionIds.includes(q._id)) {
                                            setSelectedQuestionIds(selectedQuestionIds.filter(id => id !== q._id));
                                          } else {
                                            setSelectedQuestionIds([...selectedQuestionIds, q._id]);
                                          }
                                        }}
                                        className="h-5 w-5 text-indigo-600 rounded cursor-pointer"
                                      />
                                      <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                                        ID: {q._id.substring(0, 8)}...
                                      </span>
                                    </div>
                                    <span className={`px-2 py-1 text-xs font-bold rounded-full ${q.difficulty === 'Hard' ? 'bg-red-100 text-red-800' : q.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                                      {q.difficulty || 'Medium'}
                                    </span>
                                  </div>
                                  
                                  <div className="p-4">
                                    <div className="text-sm font-medium text-gray-900 mb-4">
                                      <span className="font-bold mr-2 text-indigo-600 text-lg">Q:</span>
                                      <div className="inline-block"><MathRenderer text={q.question} /></div>
                                    </div>
                                    
                                    {q.questionImage && (
                                      <div className="mt-3 mb-4 rounded-lg overflow-hidden border border-gray-200 bg-gray-50 p-2 max-w-2xl">
                                        <img 
                                          src={`/images/${encodeURI(q.questionImage)}`} 
                                          alt="Question figure" 
                                          className="w-full h-auto object-contain max-h-[400px]" 
                                          
                                        />
                                      </div>
                                    )}

                                    {q.options && q.options.length > 0 && (
                                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 border-l-2 border-indigo-200">
                                        {q.options.map((opt, idx) => (
                                          <div key={idx} className="text-sm flex items-start p-2 rounded-md bg-gray-50 border border-gray-100 text-gray-700">
                                            <span className="font-bold mr-2 w-5 text-indigo-500">{String.fromCharCode(65 + idx)}.</span>
                                            <div className="flex-1"><MathRenderer text={opt.value || opt.text || opt} /></div>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {q.correctAnswer && (() => {
                                      const correctIndex = q.options ? q.options.findIndex(opt => {
                                        const val = opt.value || opt.text || opt;
                                        return val === q.correctAnswer;
                                      }) : -1;
                                      const letterStr = correctIndex >= 0 ? `Option ${String.fromCharCode(65 + correctIndex)}: ` : '';
                                      return (
                                        <div className="mt-4 flex items-center bg-green-50 px-3 py-2 rounded-md border border-green-100 inline-block">
                                          <span className="font-bold text-green-700 mr-2">Correct Answer:</span>
                                          {letterStr && <span className="font-bold text-indigo-700 mr-2">{letterStr}</span>}
                                          <span className="text-gray-900 font-medium"><MathRenderer text={q.correctAnswer} /></span>
                                        </div>
                                      );
                                    })()}

                                    {q.explanation && (
                                      <div className="mt-4">
                                        <div className="text-gray-700 bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm">
                                          <span className="font-bold text-blue-800 flex items-center mb-1">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            Explanation:
                                          </span>
                                          <MathRenderer text={q.explanation} />
                                          {q.explanationImage && q.explanationImage !== q.questionImage && (
                                            <div className="mt-3 rounded-lg overflow-hidden border border-blue-200 bg-white p-2 max-w-2xl">
                                              <img 
                                                src={`/images/${encodeURI(q.explanationImage)}`} 
                                                alt="Solution figure" 
                                                className="w-full h-auto object-contain max-h-[400px]" 
                                                
                                              />
                                            </div>
                                          )}
                                          {q.solutionImage && q.solutionImage !== q.questionImage && q.solutionImage !== q.explanationImage && (
                                            <div className="mt-3 rounded-lg overflow-hidden border border-blue-200 bg-white p-2 max-w-2xl">
                                              <img 
                                                src={`/images/${encodeURI(q.solutionImage)}`} 
                                                alt="Solution figure" 
                                                className="w-full h-auto object-contain max-h-[400px]" 
                                                
                                              />
                                            </div>
                                          )}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {visibleCount < qs.length && (
                                <button 
                                  onClick={() => setVisibleCount(prev => prev + 10)}
                                  className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm border border-indigo-100"
                                >
                                  Load More Questions...
                                </button>
                              )}
                                    </div>
                                  </details>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      );
                    })}
                        </div>
                        )}
                      </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Levels Tab */}
          {activeTab === 'levels' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Manage Levels</h2>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
                {levels.map(level => (
                  <div key={level._id} className="p-6 border border-gray-200 rounded-xl bg-gray-50 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-lg text-gray-900 mb-1">Level {level.levelNumber}: {level.title}</h3>
                      <p className="text-sm text-gray-500 mb-4">{level.passingPercentage}% to pass • {level.questionCount} Questions</p>
                    </div>
                    
                    <form 
                      onSubmit={(e) => {
                        e.preventDefault();
                        const formData = new FormData(e.target);
                        handleUpdateLevel(level._id, formData.get('fee'), formData.get('duration'));
                      }}
                      className="flex space-x-4 items-end"
                    >
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Fee (₹)</label>
                        <input name="fee" type="number" defaultValue={level.fee} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border" />
                      </div>
                      <div className="flex-1">
                        <label className="block text-xs font-medium text-gray-700 mb-1">Duration (Mins)</label>
                        <input name="duration" type="number" defaultValue={level.duration} className="w-full border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm p-2 border" />
                      </div>
                      <button type="submit" className="bg-gray-900 text-white px-4 py-2 rounded-md font-medium hover:bg-gray-800 h-[38px]">
                        Save
                      </button>
                    </form>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Exam Security Dashboard</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Exam</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Violations</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Auto-Submitted</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {securityData.attempts.map((attempt) => (
                      <tr key={attempt._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{attempt.userId?.name || 'Unknown'}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">Level {attempt.examLevel}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold text-center">{Math.min(attempt.violations, 3)}/3</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {attempt.securityStatus === 'Violated' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">Violated</span>
                          ) : attempt.securityStatus === 'Warning' ? (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-orange-100 text-orange-800">Warning</span>
                          ) : (
                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Safe</span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {attempt.violations > 3 ? <span className="text-red-600 font-bold">Yes</span> : 'No'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <h3 className="text-xl font-bold text-gray-900 mt-10 mb-4">Recent Security Logs</h3>
              <div className="bg-gray-50 rounded-lg border border-gray-200 max-h-64 overflow-y-auto">
                <table className="min-w-full divide-y divide-gray-200 text-sm">
                  <thead className="bg-gray-100 sticky top-0">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Time</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Event</th>
                      <th className="px-4 py-2 text-left font-medium text-gray-600">Action Taken</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 bg-white">
                    {securityData.logs.map((log) => (
                      <tr key={log._id}>
                        <td className="px-4 py-2 text-gray-500">{new Date(log.timestamp).toLocaleString()}</td>
                        <td className="px-4 py-2 text-gray-900 font-medium">{log.eventType}</td>
                        <td className="px-4 py-2 text-gray-600">{log.actionTaken}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Certificates Tab */}
          {activeTab === 'certificates' && (
            <div>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Issued Certificates</h2>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issued Date</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Certificate ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {certificates.map((cert) => (
                      <tr key={cert._id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">{cert.studentName}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{cert.score.toFixed(2)}%</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(cert.issuedDate).toLocaleDateString()}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 font-mono">{cert.certificateId}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <button onClick={() => navigate('/certificate', { state: { certificate: cert } })} className="text-indigo-600 hover:text-indigo-900 font-bold">
                            View
                          </button>
                        </td>
                      </tr>
                    ))}
                    {certificates.length === 0 && (
                      <tr>
                        <td colSpan="5" className="px-6 py-4 text-center text-gray-500">No certificates issued yet.</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Question Modal */}
          {isQuestionModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl overflow-hidden max-h-[90vh] flex flex-col">
                <div className="p-6 border-b flex justify-between items-center">
                  <h3 className="text-xl font-bold">{editingQuestion ? 'Edit Question' : 'Add New Question'}</h3>
                  <button onClick={() => setIsQuestionModalOpen(false)} className="text-gray-500 hover:text-gray-700 font-bold text-xl">&times;</button>
                </div>
                <div className="p-6 overflow-y-auto flex-1">
                  <form id="questionForm" onSubmit={handleSaveQuestion} className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Level</label>
                        <input type="number" required value={questionFormData.level} onChange={(e) => setQuestionFormData({...questionFormData, level: e.target.value})} className="w-full border rounded p-2"/>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Subject</label>
                        <input type="text" required value={questionFormData.subject} onChange={(e) => setQuestionFormData({...questionFormData, subject: e.target.value})} className="w-full border rounded p-2"/>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Question Text</label>
                      <textarea required value={questionFormData.question} onChange={(e) => setQuestionFormData({...questionFormData, question: e.target.value})} className="w-full border rounded p-2" rows="3"></textarea>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Options (Comma separated)</label>
                      <input type="text" required value={questionFormData.options?.join(', ')} onChange={(e) => setQuestionFormData({...questionFormData, options: e.target.value.split(',').map(s=>s.trim())})} className="w-full border rounded p-2"/>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">Correct Answer (Must exactly match an option)</label>
                      <input type="text" required value={questionFormData.correctAnswer} onChange={(e) => setQuestionFormData({...questionFormData, correctAnswer: e.target.value})} className="w-full border rounded p-2"/>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium mb-1">Explanation</label>
                        <textarea value={questionFormData.explanation || ''} onChange={(e) => setQuestionFormData({...questionFormData, explanation: e.target.value})} className="w-full border rounded p-2" rows="2"></textarea>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-1">Solution</label>
                        <textarea value={questionFormData.solution || ''} onChange={(e) => setQuestionFormData({...questionFormData, solution: e.target.value})} className="w-full border rounded p-2" rows="2"></textarea>
                      </div>
                    </div>
                  </form>
                </div>
                <div className="p-6 border-t bg-gray-50 flex justify-end">
                  <button type="button" onClick={() => setIsQuestionModalOpen(false)} className="px-4 py-2 text-gray-600 font-medium mr-4">Cancel</button>
                  <button type="submit" form="questionForm" className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Save Question</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>

      {/* Import Summary Modal */}
      {importSummary && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-6 border-b flex justify-between items-center">
              <h3 className="text-xl font-bold">Import Summary</h3>
              <button onClick={() => setImportSummary(null)} className="text-gray-500 hover:text-gray-700 font-bold text-xl">&times;</button>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 gap-4 mb-6 text-center">
                <div className="bg-green-50 p-6 rounded-xl border border-green-200">
                  <p className="text-2xl font-bold text-green-800 mb-2">Imported Questions : {importSummary.imported}</p>
                  <p className="text-2xl font-bold text-green-800 mb-4">Imported Answers : {importSummary.imported}</p>
                  <p className="text-lg font-bold text-gray-700">Ready for Test.</p>
                </div>
              </div>
              
              {importSummary.errors && importSummary.errors.length > 0 && (
                <div>
                  <h4 className="font-bold text-red-700 mb-2">Errors</h4>
                  <div className="max-h-40 overflow-y-auto text-sm bg-red-50 p-3 rounded text-red-800 border border-red-100">
                    {importSummary.errors.map((err, i) => (
                      <div key={i} className="mb-1">{err}</div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="p-4 border-t bg-gray-50 flex justify-end">
              <button onClick={() => setImportSummary(null)} className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700">Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Preview Modal */}
      {previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-6xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-6 border-b flex justify-between items-center bg-gray-50">
              <div>
                <h3 className="text-xl font-bold">Import Preview - {previewFileName}</h3>
                <p className="text-sm text-gray-500">{previewData.length} questions parsed. Review and finalize before saving to database.</p>
              </div>
              <button onClick={() => setPreviewData(null)} className="text-gray-500 hover:text-gray-700 font-bold text-xl">&times;</button>
            </div>
            
            <div className="p-4 border-b bg-indigo-50 flex flex-wrap gap-4 items-end">
              <div>
                <label className="block text-xs font-bold text-indigo-900 mb-1">Bulk Set Subject</label>
                <select value={bulkSubject} onChange={e=>{
                  const newSubject = e.target.value;
                  setBulkSubject(newSubject);
                  if ((newSubject === 'Mathematics') && bulkDifficulty === 'Easy') {
                    setBulkDifficulty('Medium');
                  }
                }} className="border p-2 rounded text-sm min-w-[150px]">
                  <option value="">-- No Change --</option>
                  <option value="Physics">Physics</option>
                  <option value="Chemistry">Chemistry</option>
                  <option value="Mathematics">Mathematics</option>
                  <option value="Biology">Biology</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-900 mb-1">Bulk Set Exam Type</label>
                <select value={bulkExamType} onChange={e=>setBulkExamType(e.target.value)} className="border p-2 rounded text-sm min-w-[150px]">
                  <option value="">-- No Change --</option>
                  <option value="JEE">JEE Main</option>
                  <option value="EAMCET">EAMCET</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-indigo-900 mb-1">Bulk Set Difficulty</label>
                <select value={bulkDifficulty} onChange={e=>setBulkDifficulty(e.target.value)} className="border p-2 rounded text-sm min-w-[150px]">
                  <option value="">-- No Change --</option>
                  {!(bulkSubject === 'Mathematics') && <option value="Easy">Easy</option>}
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>
              </div>
              <button onClick={applyBulkChanges} className="bg-indigo-600 text-white px-4 py-2 rounded text-sm font-bold hover:bg-indigo-700">Apply to All</button>
            </div>

            <div className="flex-1 overflow-auto p-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="p-2 border font-bold text-sm">#</th>
                    <th className="p-2 border font-bold text-sm">Subject/Chapter</th>
                    <th className="p-2 border font-bold text-sm">Difficulty/Exam</th>
                    <th className="p-2 border font-bold text-sm w-1/3">Question</th>
                    <th className="p-2 border font-bold text-sm">Options & Answer</th>
                  </tr>
                </thead>
                <tbody>
                  {previewData.map((q, i) => (
                    <tr key={i} className="border-b">
                      <td className="p-2 border text-sm">{i + 1}</td>
                      <td className="p-2 border text-sm">
                        <input type="text" value={q.subject} onChange={e => { const newD = [...previewData]; newD[i].subject = e.target.value; setPreviewData(newD); }} className="w-full border p-1 mb-1" placeholder="Subject"/>
                        <input type="text" value={q.chapter} onChange={e => { const newD = [...previewData]; newD[i].chapter = e.target.value; setPreviewData(newD); }} className="w-full border p-1" placeholder="Chapter"/>
                      </td>
                      <td className="p-2 border text-sm">
                        <select value={q.difficulty} onChange={e => { const newD = [...previewData]; newD[i].difficulty = e.target.value; setPreviewData(newD); }} className="w-full border p-1 mb-1">
                          <option value="Easy">Easy</option>
                          <option value="Medium">Medium</option>
                          <option value="Hard">Hard</option>
                        </select>
                        <input type="text" value={q.examType} onChange={e => { const newD = [...previewData]; newD[i].examType = e.target.value; setPreviewData(newD); }} className="w-full border p-1" placeholder="Exam Type"/>
                      </td>
                      <td className="p-2 border text-sm">
                        <textarea value={q.question} onChange={e => { const newD = [...previewData]; newD[i].question = e.target.value; setPreviewData(newD); }} className="w-full border p-1" rows="3" placeholder="Question Text"></textarea>
                      </td>
                      <td className="p-2 border text-sm space-y-1">
                        <input type="text" value={q.optionA} onChange={e => { const newD = [...previewData]; newD[i].optionA = e.target.value; setPreviewData(newD); }} className="w-full border p-1" placeholder="Option A"/>
                        <input type="text" value={q.optionB} onChange={e => { const newD = [...previewData]; newD[i].optionB = e.target.value; setPreviewData(newD); }} className="w-full border p-1" placeholder="Option B"/>
                        <input type="text" value={q.optionC} onChange={e => { const newD = [...previewData]; newD[i].optionC = e.target.value; setPreviewData(newD); }} className="w-full border p-1" placeholder="Option C"/>
                        <input type="text" value={q.optionD} onChange={e => { const newD = [...previewData]; newD[i].optionD = e.target.value; setPreviewData(newD); }} className="w-full border p-1" placeholder="Option D"/>
                        <input type="text" value={q.correctAnswer} onChange={e => { const newD = [...previewData]; newD[i].correctAnswer = e.target.value; setPreviewData(newD); }} className="w-full border p-1 border-green-500 bg-green-50" placeholder="Exact Correct Answer"/>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-4 border-t bg-gray-50 flex justify-end space-x-4">
              <button onClick={() => setPreviewData(null)} className="px-6 py-2 bg-gray-300 text-gray-800 rounded-lg font-bold hover:bg-gray-400">Cancel</button>
              <button onClick={handleFinalizeImport} disabled={uploading} className="px-6 py-2 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 disabled:opacity-50">
                {uploading ? 'Saving to Database...' : `Save ${previewData.length} Questions`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
