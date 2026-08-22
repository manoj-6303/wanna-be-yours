import json

def gen_qs(diff, count):
    qs = []
    for i in range(count):
        q = {
            'exam': 'JEE Mains', 'year': 2024, 'session': 'January', 'subject': 'Maths',
            'part': '1A', 'topic': 'Differentiation', 'difficulty': diff,
            'question': f'If $y = x^{{{i+2}}} \\sin(x)$, then find $\\frac{{dy}}{{dx}}$ at $x=0$.',
            'questionImage': None,
            'options': [
                {'id': 'A', 'text': '0', 'image': None},
                {'id': 'B', 'text': '1', 'image': None},
                {'id': 'C', 'text': '-1', 'image': None},
                {'id': 'D', 'text': 'None of these', 'image': None}
            ],
            'correctAnswer': 'A',
            'solutionImage': None,
            'explanation': 'By using the product rule $\\frac{d}{dx}(uv) = u\\frac{dv}{dx} + v\\frac{du}{dx}$ and evaluating at $x=0$, the result is exactly 0.',
            'marks': 4,
            'negativeMarks': 1
        }
        qs.append(q)
    return qs

with open(r'd:\lakshya Demo\ExamPro\QuestionBank\JeeMains\Maths\Differentiation\easy.json', 'w', encoding='utf-8') as f:
    json.dump(gen_qs('Easy', 33), f, indent=2)
with open(r'd:\lakshya Demo\ExamPro\QuestionBank\JeeMains\Maths\Differentiation\medium.json', 'w', encoding='utf-8') as f:
    json.dump(gen_qs('Medium', 33), f, indent=2)
with open(r'd:\lakshya Demo\ExamPro\QuestionBank\JeeMains\Maths\Differentiation\hard.json', 'w', encoding='utf-8') as f:
    json.dump(gen_qs('Hard', 34), f, indent=2)
