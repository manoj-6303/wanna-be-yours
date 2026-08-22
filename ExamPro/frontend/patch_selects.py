import re

with open('src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace the Subject input
subject_start = code.find('<label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>')
subject_end = code.find('</div>', subject_start)
old_subject = code[subject_start:subject_end]

new_subject = """<label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
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
                    """

if old_subject:
    code = code.replace(old_subject, new_subject)
else:
    print("Subject block not found")

# Replace the Chapter input
chapter_start = code.find('<label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>')
chapter_end = code.find('</div>', chapter_start)
old_chapter = code[chapter_start:chapter_end]

new_chapter = """<label className="block text-sm font-medium text-gray-700 mb-1">Chapter</label>
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
                    """

if old_chapter:
    code = code.replace(old_chapter, new_chapter)
else:
    print("Chapter block not found")

with open('src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Applied select dropdowns for Custom Test form!")
