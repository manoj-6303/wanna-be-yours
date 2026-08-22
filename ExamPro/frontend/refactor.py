import re

with open('src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the map starts
new_map_start = '''{Object.entries(groupedChapters.reduce((acc, curr) => {
                  const subject = curr._id.subject || 'Unknown Subject';
                  if (!acc[subject]) acc[subject] = [];
                  acc[subject].push(curr);
                  return acc;
                }, {})).map(([subject, chapters]) => (
                  <div key={subject} className="mb-10">
                    <h2 className="text-2xl font-bold text-indigo-900 mb-4 px-2 border-b-2 border-indigo-100 pb-2">{subject}</h2>
                    <div className="space-y-4">
                      {chapters.map((chapterGroup) => {'''

code = code.replace('{groupedChapters.map((chapterGroup) => {', new_map_start)

# Replace the map ends
# We need to replace the exact sequence of:
#                   );
#                 })}
code = re.sub(r'[ \t]*\);\n[ \t]*\}\)}\n', '''                  );
                      })}
                    </div>
                  </div>
                ))}
''', code)

# Replace the heading text
old_heading = '{chapterGroup._id.subject} - {chapterGroup._id.chapter}'
new_heading = '{chapterGroup._id.chapter}'
code = code.replace(old_heading, new_heading)

with open('src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print('Done')
