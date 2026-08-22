import os
import json
from pymongo import MongoClient

def gen_qs(diff, count):
    qs = []
    for i in range(count):
        a2 = (i+2)**2
        b2 = (i+1)**2
        q = {
            'exam': 'JEE Mains', 'year': 2024, 'session': 'January', 'subject': 'Mathematics',
            'part': '1A', 'topic': 'Ellipse', 'chapter': 'Ellipse', 'difficulty': diff,
            'question': f'Find the eccentricity of the ellipse $\\frac{{x^2}}{{{a2}}} + \\frac{{y^2}}{{{b2}}} = 1$.',
            'questionImage': None,
            'options': [
                {'id': 'A', 'text': f'$\\frac{{\\sqrt{{{a2} - {b2}}}}}{{{i+2}}}$', 'image': None},
                {'id': 'B', 'text': f'$\\frac{{\\sqrt{{{a2} + {b2}}}}}{{{i+2}}}$', 'image': None},
                {'id': 'C', 'text': '1', 'image': None},
                {'id': 'D', 'text': '0', 'image': None}
            ],
            'correctAnswer': 'A',
            'solutionImage': None,
            'explanation': f'For an ellipse, $e = \\sqrt{{1 - \\frac{{b^2}}{{a^2}}}}$. Here $a^2 = {a2}$ and $b^2 = {b2}$, so $e = \\sqrt{{\\frac{{{a2} - {b2}}}{{{a2}}}}} = \\frac{{\\sqrt{{{a2} - {b2}}}}}{{{i+2}}}$.',
            'marks': 4,
            'negativeMarks': 1
        }
        qs.append(q)
    return qs

# 1. Generate Files
d = r'd:\lakshya Demo\ExamPro\QuestionBank\JeeMains\Maths\Ellipse'
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
col.delete_many({'topic': 'Ellipse'})

all_qs = []
for file in ['easy.json', 'medium.json', 'hard.json']:
    with open(os.path.join(d, file), 'r', encoding='utf-8') as f:
        all_qs.extend(json.load(f))

res = col.insert_many(all_qs)
print(f'Successfully inserted {len(res.inserted_ids)} Ellipse questions!')
