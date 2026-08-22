const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

const oldHeader = `<h2 className="text-2xl font-bold text-indigo-900 mb-4 px-2 border-b-2 border-indigo-100 pb-2">{subject}</h2>
                    <div className="space-y-4">`;

const newHeader = `<div 
                      className="bg-indigo-50 px-6 py-4 rounded-xl flex justify-between items-center cursor-pointer mb-4"
                      onClick={() => setExpandedSubject(expandedSubject === subject ? null : subject)}
                    >
                      <h2 className="text-xl font-bold text-indigo-900">{subject}</h2>
                      <div className="flex items-center space-x-4">
                        <span className="bg-indigo-200 text-indigo-900 text-sm font-bold px-3 py-1 rounded-full">{chapters.length} Chapters</span>
                        <span className="text-indigo-900 font-bold text-lg">{expandedSubject === subject ? '▲' : '▼'}</span>
                      </div>
                    </div>
                    {expandedSubject === subject && (
                      <div className="space-y-4">`;

content = content.split(oldHeader).join(newHeader);

const oldFooter = `                  </div>
                ))}
                {groupedChapters.length === 0 && <p className="text-gray-500 text-center py-4">No questions match your criteria.</p>}`;

const newFooter = `                      </div>
                    )}
                  </div>
                ))}
                {groupedChapters.length === 0 && <p className="text-gray-500 text-center py-4">No questions match your criteria.</p>}`;

content = content.split(oldFooter).join(newFooter);

fs.writeFileSync('src/pages/Admin.jsx', content);
console.log('Done!');
