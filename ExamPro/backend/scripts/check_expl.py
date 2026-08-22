import glob
import json

no_expl = 0
ph_expl = 0
other = 0

files = glob.glob('../QuestionBank/*/*/*/*.json')
print(f"Total files: {len(files)}")

for f in files:
    try:
        with open(f, encoding='utf-8') as file:
            data = json.load(file)
            if isinstance(data, dict):
                data = [data]
            for q in data:
                e = q.get('explanation', '')
                if not e:
                    no_expl += 1
                elif 'MathonGo' in e:
                    ph_expl += 1
                else:
                    other += 1
    except Exception as e:
        print(f"Error in {f}: {e}")

print(f'No expl: {no_expl}, MathonGo placeholder: {ph_expl}, Other: {other}')
