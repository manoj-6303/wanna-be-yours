import os
import json
import glob
# pyrefly: ignore [missing-import]
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/exampro")
client = MongoClient(MONGO_URI)
db = client.get_database()
questions_collection = db['questions'] # You might want to change this if your collection name is different

QUESTION_BANK_DIR = os.path.join(os.path.dirname(os.path.dirname(__file__)), "..", "QuestionBank")

def import_question_bank():
    print(f"Starting import from {QUESTION_BANK_DIR}...")
    
    if not os.path.exists(QUESTION_BANK_DIR):
        print(f"Directory {QUESTION_BANK_DIR} does not exist. Please ensure the QuestionBank folder is created.")
        return

    # Path pattern: QuestionBank/exam/subject/topic/difficulty.json
    search_pattern = os.path.join(QUESTION_BANK_DIR, "*", "*", "*", "*.json")
    json_files = glob.glob(search_pattern)
    
    total_inserted = 0

    for file_path in json_files:
        # Extract metadata from the folder structure
        # Example: ['..', 'QuestionBank', 'jee_mains', 'physics', 'kinematics', 'easy.json']
        parts = os.path.normpath(file_path).split(os.sep)
        
        try:
            exam = parts[-4]
            subject = parts[-3]
            topic = parts[-2]
            difficulty = parts[-1].replace('.json', '').capitalize()
            
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                
            # If the json contains a single object instead of a list, wrap it in a list
            if isinstance(data, dict):
                data = [data]
                
            # Inject path metadata into each question
            for q in data:
                q['exam'] = q.get('exam', exam)
                q['subject'] = q.get('subject', subject)
                q['topic'] = q.get('topic', topic)
                q['difficulty'] = q.get('difficulty', difficulty)
                
                # Optional: format exam name for consistency
                if q['exam'] == 'jee_mains':
                    q['exam'] = 'JEE Mains'
                elif q['exam'] == 'emcet':
                    q['exam'] = 'EAMCET'

            # Insert into MongoDB
            if data:
                # Remove _id if it's there so MongoDB generates a new ObjectId, 
                # or leave it if you want to use the explicit one from JSON
                for q in data:
                    if '_id' in q and isinstance(q['_id'], dict) and '$oid' in q['_id']:
                        from bson import ObjectId
                        q['_id'] = ObjectId(q['_id']['$oid'])

                result = questions_collection.insert_many(data)
                print(f"Inserted {len(result.inserted_ids)} questions from {file_path}")
                total_inserted += len(result.inserted_ids)
                
        except Exception as e:
            print(f"Error processing file {file_path}: {e}")

    print(f"\nImport completed! Total questions inserted: {total_inserted}")

if __name__ == "__main__":
    import_question_bank()
