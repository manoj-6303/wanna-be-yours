import re

with open('src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# 1. Insert state for expandedSubjects
code = code.replace(
    'const [expandedChapter, setExpandedChapter] = useState(null);',
    'const [expandedChapter, setExpandedChapter] = useState(null);\n  const [expandedSubjects, setExpandedSubjects] = useState({});'
)

# 2. Replace the start of the mapping
old_start = '{groupedChapters.map((chapterGroup) => {'
new_start = '''{Object.entries(groupedChapters.reduce((acc, curr) => {
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

code = code.replace(old_start, new_start)

# 3. Replace the end of the mapping
# We can use regex to match the end of the chapter map reliably.
# In the original, the chapter map ends with:
#                   );
#                 })}
# We want to replace it with:
#                   );
#                 })}
#                 </div>
#                 )}
#               </div>
#             );
#             })}
#
# Let's do this safely.
pattern_end = r'([ \t]*\);\n[ \t]*\}\)\})'
new_end = r'\1\n                    </div>\n                    )}\n                  </div>\n                );\n                })}'

code = re.sub(pattern_end, new_end, code)

# 4. Remove the `{chapterGroup._id.subject} - ` prefix from chapter boxes
old_heading = '{chapterGroup._id.subject} - {chapterGroup._id.chapter}'
new_heading = '{chapterGroup._id.chapter}'
code = code.replace(old_heading, new_heading)

with open('src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('Done')
