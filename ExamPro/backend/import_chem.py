import os, json, glob
from pymongo import MongoClient
client = MongoClient('mongodb://localhost:27017/exampro')
db = client.get_database()
coll = db['questions']
pattern = os.path.join('../QuestionBank', 'JeeMains', 'Chemistry', '*', '*.json')
files = glob.glob(pattern)
inserted = 0
for f in files:
  parts = os.path.normpath(f).split(os.sep)
  exam=parts[-4]; subject=parts[-3]; topic=parts[-2]; diff=parts[-1].replace('.json', '').capitalize()
  data = json.load(open(f, encoding='utf-8'))
  if isinstance(data, dict): data=[data]
  for q in data:
    q['exam'] = q.get('exam', exam)
    q['subject'] = 'Chemistry'
    q['topic'] = q.get('topic', topic)
    q['difficulty'] = q.get('difficulty', diff)
    if '_id' in q: del q['_id']
  if data:
    res = coll.insert_many(data)
    inserted += len(res.inserted_ids)
print('Inserted', inserted, 'Chemistry questions')