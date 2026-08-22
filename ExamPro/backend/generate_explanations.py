import os
import time
import pymongo
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import SystemMessage, HumanMessage

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))

MONGO_URI = os.getenv('MONGO_URI', 'mongodb://localhost:27017/exampro')
client = pymongo.MongoClient(MONGO_URI)
db = client.get_default_database()

llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-flash",
    temperature=0.2,
    max_tokens=1000,
    api_key=os.getenv("GEMINI_API_KEY")
)

def generate_explanation():
    # Find all questions with the hallucinated dummy explanations
    query = {
        "subject": "Chemistry",
        "explanation": { "$regex": "Verified textbook chemistry theory|Fundamental concept check" }
    }
    
    questions = list(db.questions.find(query))
    print(f"Found {len(questions)} questions needing new explanations.")

    for i, q in enumerate(questions):
        try:
            print(f"Processing {i+1}/{len(questions)}: {q['_id']}")
            
            prompt = f"""
You are an expert Chemistry professor for the JEE Main exam.
Please provide a step-by-step, point-wise explanation for the following chemistry question.
Ensure the explanation is clear, educational, and formatted with LaTeX where necessary (use $...$ for inline math and $$...$$ for block math).
Do not output anything other than the explanation text.

Question:
{q.get('question')}

Options:
"""
            if q.get('options'):
                for opt in q.get('options'):
                    prompt += f"- {opt.get('text', opt)}\n"
                    
            prompt += f"\nCorrect Answer: {q.get('correctAnswer')}"

            messages = [
                SystemMessage(content="You are an expert Chemistry tutor. Provide step-by-step, pointwise explanations."),
                HumanMessage(content=prompt)
            ]
            
            res = llm.invoke(messages)
            new_explanation = res.content.strip()
            
            db.questions.update_one(
                {"_id": q["_id"]},
                {"$set": {"explanation": new_explanation}}
            )
            
            time.sleep(2)  # Rate limiting
        except Exception as e:
            print(f"Error on {q['_id']}: {e}")
            time.sleep(10)

if __name__ == "__main__":
    generate_explanation()
