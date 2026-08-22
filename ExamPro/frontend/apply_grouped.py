import re

with open('src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Add state variables
state_pattern = r"  // Question Bank UI State\n  const \[importSummary, setImportSummary\] = useState\(null\);"
state_replacement = """  // Question Bank UI State
  const [groupedChapters, setGroupedChapters] = useState([]);
  const [expandedChapter, setExpandedChapter] = useState(null);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [visibleCount, setVisibleCount] = useState(10);
  const [importSummary, setImportSummary] = useState(null);"""

code = re.sub(state_pattern, state_replacement, code)

# 2. Update fetchQuestions
fetch_pattern = r"const params = new URLSearchParams\(\{\n            page: qPage,\n            limit: itemsPerPage,\n            search: qSearch,\n            \.\.\.qFilters\n          \}\);\n          // Remove empty filters\n          Object\.keys\(qFilters\)\.forEach\(key => \{\n            if \(!qFilters\[key\]\) params\.delete\(key\);\n          \}\);\n          if \(!qSearch\) params\.delete\('search'\);\n\n          const res = await axios\.get\(`/api/v1/questions\?\$\{params\.toString\(\)\}`, \{\n            headers: \{ Authorization: `Bearer \$\{token\}` \}\n          \}\);\n\n          setPaginatedQuestions\(res\.data\.questions\);\n          setTotalPages\(res\.data\.pages\);\n          setTotalQuestionsCount\(res\.data\.total\);"

fetch_replacement = """const params = new URLSearchParams({
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
          setTotalQuestionsCount(total);"""

code = re.sub(fetch_pattern, fetch_replacement, code)

# 3. Replace the UI mapping
start_idx = code.find('{paginatedQuestions.map((q) => (')
mid_idx = code.find('{paginatedQuestions.length === 0', start_idx)
end_idx = code.find('</p>}', mid_idx) + 5

if start_idx != -1 and end_idx != -1:
    old_ui = code[start_idx:end_idx]
    
    new_ui = """{Object.entries(groupedChapters.reduce((acc, curr) => {
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
                          {chapterGroup.questions.slice(0, visibleCount).map(q => (
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
                                      onError={(e) => { e.target.parentNode.style.display = 'none'; }}
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

                                {q.correctAnswer && (
                                  <div className="mt-3 text-sm flex items-start bg-green-50 p-2 rounded border border-green-100 inline-block">
                                    <span className="font-bold text-green-700 mr-2">Correct Answer:</span>
                                    <span className="text-gray-800 font-medium">{q.correctAnswer}</span>
                                  </div>
                                )}

                                {q.explanation && (
                                  <div className="mt-3 text-sm">
                                    <span className="font-bold text-gray-600 block mb-1 text-xs uppercase tracking-wider">Explanation</span>
                                    <div className="text-gray-700 bg-gray-50 border border-gray-200 p-3 rounded-lg text-sm overflow-hidden">
                                      <MathRenderer text={q.explanation} />
                                    </div>
                                  </div>
                                )}
                                
                                {q.solutionImage && (
                                  <div className="mt-3 text-sm">
                                    <span className="font-bold text-gray-600 block mb-1 text-xs uppercase tracking-wider">Solution Image</span>
                                    <img 
                                      src={`/images/${encodeURI(q.solutionImage)}`} 
                                      alt="Solution" 
                                      className="mt-2 w-full max-w-3xl object-contain rounded border border-gray-200" 
                                      onError={(e) => { e.target.parentNode.style.display = 'none'; }}
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
                          {chapterGroup.questions.length > visibleCount && (
                            <div className="text-center pt-2">
                              <button 
                                onClick={() => setVisibleCount(v => v + 10)}
                                className="text-indigo-600 font-bold hover:text-indigo-800 text-sm bg-indigo-50 px-4 py-2 rounded-full transition-colors"
                              >
                                Load More Questions ({chapterGroup.questions.length - visibleCount} remaining)
                              </button>
                            </div>
                          )}
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
                {groupedChapters.length === 0 && <p className="text-gray-500 text-center py-4">No questions match your criteria.</p>}"""
    code = code.replace(old_ui, new_ui)

with open('src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied!")
