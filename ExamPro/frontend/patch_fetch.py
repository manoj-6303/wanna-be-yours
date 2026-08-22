import re

with open('src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

start_idx = code.find('      const fetchQuestions = async () => {')
end_idx = code.find('      fetchQuestions();\n    }', start_idx)

if start_idx != -1 and end_idx != -1:
    old_fetch = code[start_idx:end_idx]
    new_fetch = """      const fetchQuestions = async () => {
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
"""
    code = code.replace(old_fetch, new_fetch)
    with open('src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
        f.write(code)
    print("Fetch patched!")
else:
    print("Could not find fetch block")
