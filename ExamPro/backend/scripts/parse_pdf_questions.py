import os
import re
import json
import fitz  # PyMuPDF
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/exampro")
client = MongoClient(MONGO_URI)
db = client.get_database()
questions_collection = db['questions']

# Paths
WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__)))) # Points to D:\lakshya Demo
PDF_DIR = os.path.join(WORKSPACE_ROOT, "pdf_Questions")
IMAGES_DIR = os.path.join(WORKSPACE_ROOT, "ExamPro", "QuestionBank", "images")

# Ensure images directory exists
os.makedirs(IMAGES_DIR, exist_ok=True)

def is_hindi(text):
    # Basic check for Devanagari Unicode range
    for char in text:
        if '\u0900' <= char <= '\u097F':
            return True
    return False

def parse_pdf_and_import():
    if not os.path.exists(PDF_DIR):
        print(f"Directory not found: {PDF_DIR}")
        return

    pdf_files = [f for f in os.listdir(PDF_DIR) if f.lower().endswith('.pdf')]
    if not pdf_files:
        print("No PDF files found in pdf_Questions directory.")
        return

    for pdf_file in pdf_files:
        pdf_path = os.path.join(PDF_DIR, pdf_file)
        print(f"\nProcessing PDF: {pdf_file}")
        
        # Determine topic from filename (e.g. Binomial_all_Questions.pdf -> Binomial)
        topic = pdf_file.replace('.pdf', '').split('_')[0]
        
        doc = fitz.open(pdf_path)
        
        questions_to_insert = []
        current_question = None
        
        # Example naive parsing state
        # In a robust system, this requires an LLM Vision API for mathematical accuracy.
        for page_num in range(len(doc)):
            page = doc[page_num]
            blocks = page.get_text("blocks")
            
            # Extract Images for this page
            image_list = page.get_images(full=True)
            for image_index, img in enumerate(image_list, start=1):
                xref = img[0]
                base_image = doc.extract_image(xref)
                image_bytes = base_image["image"]
                image_ext = base_image["ext"]
                image_filename = f"{topic}_page{page_num+1}_img{image_index}.{image_ext}"
                image_filepath = os.path.join(IMAGES_DIR, image_filename)
                
                with open(image_filepath, "wb") as f:
                    f.write(image_bytes)
                print(f"Saved image: {image_filename}")
            
            # Extract Text blocks
            for block in blocks:
                text = block[4].strip()
                
                # 1. Ignore Hindi blocks completely
                if is_hindi(text):
                    continue
                
                # 2. Look for Question Number (e.g., "Q1", "01.", "1.")
                q_match = re.match(r'^(?:Q)?(\d+)[.)\s]+', text)
                
                if q_match:
                    # Save previous question if exists
                    if current_question and current_question.get("question"):
                        questions_to_insert.append(current_question)
                    
                    q_num = q_match.group(1)
                    question_text = text[q_match.end():].strip()
                    
                    current_question = {
                        "exam": "JEE Mains",
                        "year": 2024,
                        "session": "Unknown",
                        "subject": "Maths",
                        "part": "1A",
                        "topic": topic,
                        "difficulty": "Medium", # Default
                        "question": f"Q{q_num}. {question_text}",
                        "questionImage": None, # Could link to image_filename if heuristic matches
                        "options": [
                            { "id": "A", "text": "Option A", "image": None },
                            { "id": "B", "text": "Option B", "image": None },
                            { "id": "C", "text": "Option C", "image": None },
                            { "id": "D", "text": "Option D", "image": None }
                        ],
                        "correctAnswer": "A",
                        "explanation": "",
                        "marks": 4,
                        "negativeMarks": 1
                    }
                elif current_question:
                    # Append to current question body if it's not an option block
                    if re.match(r'^\(\d\)', text):
                        pass # Handle options here in a real robust parser
                    else:
                        current_question["question"] += "\n" + text

        # Add the last question
        if current_question and current_question.get("question"):
            questions_to_insert.append(current_question)

        doc.close()
        
        # 3. Push to MongoDB
        if questions_to_insert:
            print(f"Inserting {len(questions_to_insert)} questions from {pdf_file} into MongoDB...")
            result = questions_collection.insert_many(questions_to_insert)
            print(f"Successfully inserted {len(result.inserted_ids)} questions.")
        else:
            print("No English questions found to insert.")

if __name__ == "__main__":
    parse_pdf_and_import()
