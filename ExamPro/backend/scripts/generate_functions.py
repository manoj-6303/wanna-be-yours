import os
import json
from pymongo import MongoClient

def gen_qs(diff, count):
    qs = []
    for i in range(count):
        val = i + 1
        q = {
            'exam': 'JEE Mains', 'year': 2024, 'session': 'January', 'subject': 'Mathematics',
            'part': '1A', 'topic': 'Functions', 'chapter': 'Functions', 'difficulty': diff,
            'question': f'Find the domain of the function $f(x) = \\sqrt{{x - {val}}}$.',
            'questionImage': None,
            'options': [
                {'id': 'A', 'text': f'$[{val}, \\infty)$', 'image': None},
                {'id': 'B', 'text': f'$({val}, \\infty)$', 'image': None},
                {'id': 'C', 'text': f'$[0, \\infty)$', 'image': None},
                {'id': 'D', 'text': f'$(-\\infty, {val}]$', 'image': None}
            ],
            'correctAnswer': 'A',
            'solutionImage': None,
            'explanation': f'For the square root to be defined as a real number, the argument must be non-negative. Therefore, we require $x - {val} \\ge 0$, which yields $x \\ge {val}$. Hence, the domain is $[{val}, \\infty)$.',
            'marks': 4,
            'negativeMarks': 1
        }
        qs.append(q)
    return qs

# 1. Generate Files
d = r'd:\lakshya Demo\ExamPro\QuestionBank\JeeMains\Maths\Functions'
os.makedirs(d, exist_ok=True)
with open(os.path.join(d, 'easy.json'), 'w', encoding='utf-8') as f:
    json.dump(gen_qs('Easy', 33), f, indent=2)
with open(os.path.join(d, 'medium.json'), 'w', encoding='utf-8') as f:
    json.dump(gen_qs('Medium', 33), f, indent=2)
with open(os.path.join(d, 'hard.json'), 'w', encoding='utf-8') as f:
    json.dump(gen_qs('Hard', 34), f, indent=2)

# 2. Insert into MongoDB
client = MongoClient('mongodb://localhost:27017/exampro')
col = client.get_database()['questions']
col.delete_many({'topic': 'Functions'})

all_qs = []
for file in ['easy.json', 'medium.json', 'hard.json']:
    with open(os.path.join(d, file), 'r', encoding='utf-8') as f:
        all_qs.extend(json.load(f))

res = col.insert_many(all_qs)
print(f'Successfully inserted {len(res.inserted_ids)} Functions questions!')
