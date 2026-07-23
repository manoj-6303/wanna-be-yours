import os
import base64
import json
import fitz  # PyMuPDF
from bson import ObjectId
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

# Load env variables (for GOOGLE_API_KEY)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'python_parser', '.env'))
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# Paths
TOPIC_DIR = r"D:\lakshya Demo\ExamPro\QuestionBank\JeeMains\Maths\Applications Of Derivatives"
TOPIC_NAME = "Applications Of Derivatives"
TOPIC_SLUG = "applications_of_derivatives"

class Option(BaseModel):
    id: str = Field(description="Must be A, B, C, or D")
    text: str = Field(description="LaTeX formatted text of the option")
    image: Optional[str] = None

class ParsedQuestion(BaseModel):
    difficulty: str = Field(description="Must be Easy, Medium, or Hard")
    question: str = Field(description="LaTeX formatted text of the question")
    has_image: bool = Field(description="True if the question requires an image/diagram to be solved")
    options: List[Option]
    correctAnswer: str = Field(description="The correct option letter, exactly 'A', 'B', 'C', or 'D'")
    explanation: str = Field(description="LaTeX formatted explanation/solution for the question. Look for the answers section at the bottom of the PDF.")

class QuestionBank(BaseModel):
    questions: List[ParsedQuestion] = Field(description="List of extracted questions")

def process_topic_pdfs():
    if not os.path.exists(TOPIC_DIR):
        print(f"Directory not found: {TOPIC_DIR}")
        return

    pdf_files = [f for f in os.listdir(TOPIC_DIR) if f.lower().endswith('.pdf')]
    if not pdf_files:
        print(f"No PDF files found in {TOPIC_DIR}")
        return

    if not os.environ.get("GOOGLE_API_KEY"):
        print("Error: GOOGLE_API_KEY is not set.")
        return

    llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash", temperature=0)
    structured_llm = llm.with_structured_output(QuestionBank)

    easy_file = os.path.join(TOPIC_DIR, 'easy.json')
    medium_file = os.path.join(TOPIC_DIR, 'medium.json')
    hard_file = os.path.join(TOPIC_DIR, 'hard.json')

    image_counters = {"easy": 1, "medium": 1, "hard": 1}

    # Load existing data to append
    def load_json(filepath):
        if os.path.exists(filepath):
            with open(filepath, 'r', encoding='utf-8') as f:
                try:
                    return json.load(f)
                except:
                    return []
        return []

    easy_qs = load_json(easy_file)
    medium_qs = load_json(medium_file)
    hard_qs = load_json(hard_file)

    for pdf_file in pdf_files:
        print(f"\nProcessing PDF: {pdf_file}")
        pdf_path = os.path.join(TOPIC_DIR, pdf_file)
        
        try:
            doc = fitz.open(pdf_path)
            all_pages_b64 = []
            print(f"  Extracting {len(doc)} pages as images...")
            for page_num in range(len(doc)):
                page = doc[page_num]
                pix = page.get_pixmap(dpi=150)
                img_bytes = pix.tobytes("png")
                page_b64 = base64.b64encode(img_bytes).decode("utf-8")
                all_pages_b64.append(page_b64)
            doc.close()

            print("  Sending to Gemini (this may take a minute)...")
            system_prompt = SystemMessage(content="""You are an expert educational content extractor.
Your task is to visually parse the provided PDF page images and extract ALL multiple-choice questions into JSON.

CRITICAL INSTRUCTIONS:
1. Extract the math equations perfectly using LaTeX formatting (e.g. $e^x$, \\frac{1}{x}).
2. Some PDFs contain questions at the top and explanations/answers at the bottom. Correlate them correctly and include the explanation for each question.
3. Classify difficulty as Easy, Medium, or Hard.
4. If a question has an associated diagram/figure, set `has_image` to true.
5. Maintain the correct original question number if present.
6. Return a comprehensive list of all questions in this PDF.
""")
            
            user_msg_content = [{"type": "text", "text": "Extract all questions and their explanations from this PDF document."}]
            for page_b64 in all_pages_b64:
                user_msg_content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{page_b64}"}})
            
            user_msg = HumanMessage(content=user_msg_content)
            
            result = structured_llm.invoke([system_prompt, user_msg])
            if result and result.questions:
                print(f"  Successfully extracted {len(result.questions)} questions from {pdf_file}")
                
                for q in result.questions:
                    difficulty = q.difficulty.capitalize()
                    if difficulty not in ["Easy", "Medium", "Hard"]:
                        difficulty = "Medium"
                    
                    diff_lower = difficulty.lower()
                    image_filename = None
                    if q.has_image:
                        image_filename = f"{TOPIC_SLUG}_{diff_lower}_{image_counters[diff_lower]}.png"
                        image_counters[diff_lower] += 1
                        
                    mongo_doc = {
                        "_id": { "$oid": str(ObjectId()) },
                        "exam": "JEE Mains",
                        "year": 2024,
                        "session": "January",
                        "subject": "Maths",
                        "part": "1A",
                        "topic": TOPIC_NAME,
                        "difficulty": difficulty,
                        "question": q.question,
                        "questionImage": image_filename,
                        "options": [opt.model_dump() for opt in q.options],
                        "correctAnswer": q.correctAnswer,
                        "explanation": q.explanation,
                        "marks": 4,
                        "negativeMarks": 1
                    }
                    
                    if diff_lower == "easy":
                        easy_qs.append(mongo_doc)
                    elif diff_lower == "medium":
                        medium_qs.append(mongo_doc)
                    else:
                        hard_qs.append(mongo_doc)
                        
                # Save after each PDF to avoid data loss
                with open(easy_file, 'w', encoding='utf-8') as f:
                    json.dump(easy_qs, f, indent=2, ensure_ascii=False)
                with open(medium_file, 'w', encoding='utf-8') as f:
                    json.dump(medium_qs, f, indent=2, ensure_ascii=False)
                with open(hard_file, 'w', encoding='utf-8') as f:
                    json.dump(hard_qs, f, indent=2, ensure_ascii=False)
                    
            else:
                print(f"  No questions extracted from {pdf_file}")
                
        except Exception as e:
            print(f"  Error processing {pdf_file}: {e}")
            
        import time
        print("  Waiting 5 seconds to avoid rate limits...")
        time.sleep(5)

if __name__ == "__main__":
    process_topic_pdfs()
