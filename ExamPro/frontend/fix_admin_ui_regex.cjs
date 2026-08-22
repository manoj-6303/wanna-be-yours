const fs = require('fs');
let content = fs.readFileSync('src/pages/Admin.jsx', 'utf8');

const regexHeader = /<h2 className="text-2xl font-bold text-indigo-900 mb-4 px-2 border-b-2 border-indigo-100 pb-2">\{subject\}<\/h2>\s*<div className="space-y-4">/g;

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

content = content.replace(regexHeader, newHeader);

const regexFooter = /                  \}\)\}\s*<\/div>\s*<\/div>\s*\}\)\}\s*\{groupedChapters\.length === 0/g;

const newFooter = `                  })}
                    </div>
                    )}
                  </div>
                ))}
                {groupedChapters.length === 0`;

content = content.replace(regexFooter, newFooter);

fs.writeFileSync('src/pages/Admin.jsx', content);
console.log('Done with regex!');
