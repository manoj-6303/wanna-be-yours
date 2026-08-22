import os
import time
import json
import pymongo
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/exampro')
client = pymongo.MongoClient(MONGO_URI)
db = client.get_default_database()

llm = ChatGoogleGenerativeAI(
    model="gemini-3.5-flash-lite",
    temperature=0.2,
    max_tokens=200,
    api_key=os.getenv("GEMINI_API_KEY")
)

import time

def generate_options():
    query = {
        "options.0": "Option A"
    }
    
    questions = list(db.questions.find(query))
    print(f"Found {len(questions)} questions needing real options.")

    for i, q in enumerate(questions):
        success = False
        while not success:
            try:
                print(f"Processing {i+1}/{len(questions)}: {q['_id']}")
                
                prompt = f"""
You are an expert exam content creator.
I have a question, its explanation, and its correct answer key.
I need you to generate 4 realistic multiple-choice options (A, B, C, D) for this question.
The options must be plausible distractors, and the correct option MUST match the provided Correct Answer Key based on the Explanation.
Format the output as a valid JSON array of 4 strings ONLY. Do not include any other text or markdown formatting.
Example: ["2", "4", "6", "8"]

Question:
{q.get('question')}

Explanation:
{q.get('explanation', 'No explanation provided.')}

Correct Answer Key: {q.get('correctAnswer')}
"""
                messages = [
                    SystemMessage(content="You generate JSON arrays of 4 realistic multiple choice options."),
                    HumanMessage(content=prompt)
                ]
                
                res = llm.invoke(messages)
                content = res.content
                if isinstance(content, list):
                    content = content[0]
                    if isinstance(content, dict):
                        content = content.get('text', str(content))
                
                content = str(content).strip()
                
                if content.startswith('```json'):
                    content = content[7:]
                if content.startswith('```'):
                    content = content[3:]
                if content.endswith('```'):
                    content = content[:-3]
                    
                content = content.strip()
                options = json.loads(content)
                
                if len(options) == 4:
                    db.questions.update_one(
                        {"_id": q["_id"]},
                        {"$set": {"options": options}}
                    )
                    print(f"  Success {i+1}: {options}")
                    success = True
                else:
                    print(f"  Failed to parse 4 options {i+1}: {options}")
                    success = True
                
                time.sleep(4.2) # Avoid 15 RPM rate limit
                
            except Exception as e:
                error_str = str(e)
                if '429' in error_str or 'RESOURCE_EXHAUSTED' in error_str:
                    print(f"Rate limited. Waiting 20 seconds...")
                    time.sleep(20)
                else:
                    print(f"Error on {q['_id']}: {e}")
                    success = True # skip this one
                    time.sleep(4.2)

if __name__ == "__main__":
    generate_options()
