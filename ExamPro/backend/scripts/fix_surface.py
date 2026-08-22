import json

f = r'../QuestionBank/JeeMains/Chemistry/Surface Chemistry/hard.json'
try:
    with open(f, encoding='utf-8') as file:
        data = json.load(file)

    for q in data:
        q['questionImage'] = None

    with open(f, 'w', encoding='utf-8') as file:
        json.dump(data, file, indent=2)
except Exception as e:
    print(e)
