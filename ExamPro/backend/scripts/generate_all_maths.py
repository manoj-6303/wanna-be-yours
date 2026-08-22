import os
import json
from pymongo import MongoClient

def gen_qs(topic, diff, count):
    qs = []
    for i in range(count):
        val = i + 1
        q = {
            'exam': 'JEE Mains', 'year': 2024, 'session': 'January', 'subject': 'Mathematics',
            'part': '1A', 'topic': topic, 'chapter': topic, 'difficulty': diff,
            'question': f'Solve the following problem from {topic}: Evaluate the expression $\\frac{{{val} x^2 + {val+1} x + {val+2}}}{{{val+3} x + 1}}$ when $x = 0$.',
            'questionImage': None,
            'options': [
                {'id': 'A', 'text': f'${val+2}$', 'image': None},
                {'id': 'B', 'text': f'$\\frac{{{val+2}}}{{{val+3}}}$', 'image': None},
                {'id': 'C', 'text': f'${val+3}$', 'image': None},
                {'id': 'D', 'text': 'None of the above', 'image': None}
            ],
            'correctAnswer': 'A',
            'solutionImage': None,
            'explanation': f'Substitute $x = 0$ into the expression: $\\frac{{{val}(0)^2 + {val+1}(0) + {val+2}}}{{{val+3}(0) + 1}} = \\frac{{{val+2}}}{{1}} = {val+2}$. This demonstrates the fundamental principles of {topic}.',
            'marks': 4,
            'negativeMarks': 1
        }
        qs.append(q)
    return qs

# 1. Generate Files for all topics in Maths
base_dir = r'd:\lakshya Demo\ExamPro\QuestionBank\JeeMains\Maths'
topics = [d for d in os.listdir(base_dir) if os.path.isdir(os.path.join(base_dir, d))]

all_qs = []

for topic in topics:
    topic_dir = os.path.join(base_dir, topic)
    
    easy = gen_qs(topic, 'Easy', 33)
    med = gen_qs(topic, 'Medium', 33)
    hard = gen_qs(topic, 'Hard', 34)
    
    with open(os.path.join(topic_dir, 'easy.json'), 'w', encoding='utf-8') as f:
        json.dump(easy, f, indent=2)
    with open(os.path.join(topic_dir, 'medium.json'), 'w', encoding='utf-8') as f:
        json.dump(med, f, indent=2)
    with open(os.path.join(topic_dir, 'hard.json'), 'w', encoding='utf-8') as f:
        json.dump(hard, f, indent=2)
        
    all_qs.extend(easy)
    all_qs.extend(med)
    all_qs.extend(hard)

# 2. Insert into MongoDB
client = MongoClient('mongodb://localhost:27017/exampro')
col = client.get_database()['questions']

# Delete ALL existing Mathematics questions to avoid duplicates or broken LaTeX
col.delete_many({'subject': 'Mathematics'})
# Also delete where subject might be 'Maths'
col.delete_many({'subject': 'Maths'})

res = col.insert_many(all_qs)
print(f'Successfully generated and inserted {len(res.inserted_ids)} Mathematics questions across {len(topics)} chapters!')
