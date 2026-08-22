import re

with open('src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

start_idx = code.find('{availableQuestions.map(q => (')
end_idx = code.find('                  </div>\n                </div>\n              )}', start_idx)

if start_idx != -1 and end_idx != -1:
    old_ui = code[start_idx:end_idx]
    
    new_ui = """{availableQuestions.map(q => (
                      <div key={q._id} className="flex items-start space-x-3 p-3 border border-gray-200 rounded hover:bg-gray-50">
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
                          className="mt-1.5 h-4 w-4 text-indigo-600 rounded"
                        />
                        <div className="flex-1 overflow-hidden pr-2">
                          <div className="text-sm font-medium text-gray-900 mb-1 max-w-full overflow-hidden">
                            <span className="font-bold mr-2 text-indigo-600">Q:</span>
                            <MathRenderer text={q.question} />
                          </div>
                          
                          {q.questionImage && (
                            <div className="mt-2 mb-2">
                              <img 
                                src={`/images/${encodeURI(q.questionImage)}`} 
                                alt="Question figure" 
                                className="w-full max-w-3xl object-contain rounded border border-gray-200" 
                                onError={(e) => { e.target.parentNode.style.display = 'none'; }}
                              />
                            </div>
                          )}

                          {q.options && q.options.length > 0 && (
                            <div className="mt-2 pl-2 border-l-2 border-indigo-200">
                              {q.options.map((opt, idx) => (
                                <div key={idx} className="text-sm text-gray-700 flex items-start mt-1">
                                  <span className="font-bold mr-2 w-4 text-gray-500">{String.fromCharCode(65 + idx)}.</span>
                                  <div className="flex-1"><MathRenderer text={opt.value || opt.text || opt} /></div>
                                </div>
                              ))}
                            </div>
                          )}

                          {q.correctAnswer && (
                            <div className="mt-2 text-xs flex items-start bg-green-50 p-1.5 rounded border border-green-100 inline-block">
                              <span className="font-bold text-green-700 mr-1">Correct Answer:</span>
                              <span className="text-gray-800 font-medium">{q.correctAnswer}</span>
                            </div>
                          )}

                          {q.explanation && (
                            <div className="mt-2 text-xs">
                              <div className="text-gray-700 bg-gray-50 border border-gray-200 p-2 rounded text-xs overflow-hidden">
                                <span className="font-bold text-gray-600 block mb-1">Explanation:</span>
                                <MathRenderer text={q.explanation} />
                              </div>
                            </div>
                          )}
                          
                          {q.solutionImage && (
                            <div className="mt-2">
                              <img 
                                src={`/images/${encodeURI(q.solutionImage)}`} 
                                alt="Solution figure" 
                                className="w-full max-w-3xl object-contain rounded border border-gray-200" 
                                onError={(e) => { e.target.parentNode.style.display = 'none'; }}
                              />
                            </div>
                          )}
                          
                          <div className="flex space-x-2 mt-2">
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">{q.subject} - {q.chapter}</span>
                            <span className="text-xs text-gray-500 bg-gray-200 px-2 py-0.5 rounded">{q.difficulty}</span>
                          </div>
                        </div>
                      </div>
                    ))}
"""
    code = code.replace(old_ui, new_ui)

with open('src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied Custom Tests UI!")
