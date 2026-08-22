import re

with open('src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Insert the expandedSubjects state
if 'expandedSubjects' not in code:
    code = code.replace(
        'const [expandedChapter, setExpandedChapter] = useState(null);',
        'const [expandedChapter, setExpandedChapter] = useState(null);\n  const [expandedSubjects, setExpandedSubjects] = useState({});'
    )

old_map_start = '''{Object.entries(groupedChapters.reduce((acc, curr) => {
                  const subject = curr._id.subject || 'Unknown Subject';
                  if (!acc[subject]) acc[subject] = [];
                  acc[subject].push(curr);
                  return acc;
                }, {})).map(([subject, chapters]) => (
                  <div key={subject} className="mb-10">
                    <h2 className="text-2xl font-bold text-indigo-900 mb-4 px-2 border-b-2 border-indigo-100 pb-2">{subject}</h2>
                    <div className="space-y-4">
                      {chapters.map((chapterGroup) => {'''

new_map_start = '''{Object.entries(groupedChapters.reduce((acc, curr) => {
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
                      {chapters.map((chapterGroup) => {'''

code = code.replace(old_map_start, new_map_start)

# End tags replacement
old_map_end = '''                  );
                })}
                    </div>
                  </div>
                ))}'''

new_map_end = '''                  );
                      })}
                    </div>
                    )}
                  </div>
                );
                })}'''

code = code.replace(old_map_end, new_map_end)

with open('src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('Done')
