import sys
import re

with open('src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the "Fetch Questions" button and the availableQuestions list
# First, remove the Fetch Questions button.
fetch_btn = """<button type="button" onClick={fetchAvailableQuestions} className="bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg font-bold hover:bg-indigo-200">
                      Fetch Questions
                    </button>"""
code = code.replace(fetch_btn, "")

# Now replace the availableQuestions rendering block.
# We will render the groupedChapters accordion instead.
start = code.find('{availableQuestions.length > 0 && (')
end = code.find('</div>\n            </div>\n          )}', start)

if start == -1 or end == -1:
    print("Could not find availableQuestions block.")
    sys.exit(1)

old_block = code[start:end]

# We need a new state variable for the custom test accordion if needed, or we can reuse `expandedSubjects` and `expandedChapter`.
# Let's just use local component state or just reuse `expandedSubjects` and `expandedChapter`.
# Actually, since it's in a different tab, reusing is fine.

new_block = """{groupedChapters.length > 0 && (
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm mb-8">
                  <h3 className="text-lg font-bold text-gray-900 mb-4">Select Questions for Test</h3>
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
                              {chapterGroup.questions.slice(0, visibleCount).map((q) => (
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
                                          onError={(e) => { e.target.parentNode.style.display = 'none'; }}
                                        />
                                      </div>
                                    )}

                                    {q.options && q.options.length > 0 && (
                                      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 pl-2 border-l-2 border-indigo-200">
                                        {q.options.map((opt, idx) => (
                                          <div key={idx} className={`text-sm flex items-start p-2 rounded-md ${q.correctAnswer && (q.correctAnswer === opt.value || q.correctAnswer === opt.text || q.correctAnswer === opt) ? 'bg-green-50 border border-green-200 text-green-900' : 'bg-gray-50 border border-gray-100 text-gray-700'}`}>
                                            <span className="font-bold mr-2 w-5 text-indigo-500">{String.fromCharCode(65 + idx)}.</span>
                                            <div className="flex-1"><MathRenderer text={opt.value || opt.text || opt} /></div>
                                          </div>
                                        ))}
                                      </div>
                                    )}

                                    {q.explanation && (
                                      <div className="mt-4">
                                        <div className="text-gray-700 bg-blue-50 border border-blue-100 p-3 rounded-lg text-sm">
                                          <span className="font-bold text-blue-800 flex items-center mb-1">
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                            Explanation:
                                          </span>
                                          <MathRenderer text={q.explanation} />
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                              {visibleCount < chapterGroup.questions.length && (
                                <button 
                                  onClick={() => setVisibleCount(prev => prev + 10)}
                                  className="w-full py-2 bg-indigo-50 text-indigo-600 rounded-lg hover:bg-indigo-100 transition-colors font-medium text-sm border border-indigo-100"
                                >
                                  Load More Questions...
                                </button>
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
                  </div>
                </div>
              )}"""

code = code.replace(old_block, new_block)

with open('src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied accordion to Custom Tests tab.")
