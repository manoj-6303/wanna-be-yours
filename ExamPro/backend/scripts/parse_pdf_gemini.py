import os
import base64
import json
import fitz  # PyMuPDF
from pymongo import MongoClient
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
from typing import List, Optional
from langchain_core.messages import HumanMessage, SystemMessage

# Load env variables (look in python_parser for Google API key if not here)
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'python_parser', '.env'))
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

# MongoDB Configuration
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/exampro")
client = MongoClient(MONGO_URI)
db = client.get_database()
questions_collection = db['questions']

# Paths
WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.dirname(__file__))))
PDF_DIR = os.path.join(WORKSPACE_ROOT, "pdf_Questions")
UPLOADS_DIR = os.path.join(os.path.dirname(__file__), '..', 'uploads')
os.makedirs(UPLOADS_DIR, exist_ok=True)

# Define the Pydantic schema for structured output from Gemini
class Question(BaseModel):
    question: str = Field(description="The full text of the question with LaTeX math formulas")
    optionA: str = Field(description="Option A text")
    optionB: str = Field(description="Option B text")
    optionC: str = Field(description="Option C text")
    optionD: str = Field(description="Option D text")
    correctAnswer: str = Field(description="The correct option letter, must be exactly 'A', 'B', 'C', or 'D'")
    subject: Optional[str] = Field(description="The academic subject", default="")
    difficulty: Optional[str] = Field(description="Difficulty level", default="Medium")
    chapter: Optional[str] = Field(description="The topic or chapter", default="")
    explanation: Optional[str] = Field(description="Explanation or solution steps if present", default="")
    questionImage: Optional[str] = Field(description="Filename of the extracted diagram/image belonging to the question, if any. Must match exactly one of the provided filenames.", default="")

class QuestionBank(BaseModel):
    questions: List[Question] = Field(description="List of extracted questions")

def parse_pdfs_with_gemini():
    if not os.path.exists(PDF_DIR):
        print(f"Directory not found: {PDF_DIR}")
        return

    pdf_files = [f for f in os.listdir(PDF_DIR) if f.lower().endswith('.pdf')]
    if not pdf_files:
        print("No PDF files found in pdf_Questions directory.")
        return

    if not os.environ.get("GOOGLE_API_KEY"):
        print("Error: GOOGLE_API_KEY is not set. Ensure it is in backend/python_parser/.env")
        return

    llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
    structured_llm = llm.with_structured_output(QuestionBank)

    for pdf_file in pdf_files:
        pdf_path = os.path.join(PDF_DIR, pdf_file)
        topic = pdf_file.replace('.pdf', '').split('_')[0]
        print(f"\nProcessing PDF with Gemini Vision: {pdf_file}")
        
        doc = fitz.open(pdf_path)
        all_questions = []
        
        for page_num in range(len(doc)):
            print(f"  Parsing page {page_num + 1} / {len(doc)}...")
            page = doc[page_num]
            
            # Extract high-res image of the page for Gemini to read
            pix = page.get_pixmap(dpi=150)
            img_bytes = pix.tobytes("png")
            page_b64 = base64.b64encode(img_bytes).decode("utf-8")
            
            # Extract individual figures/diagrams using PyMuPDF to save locally
            image_list = page.get_images(full=True)
            extracted_image_filenames = []
            
            for img_index, img_info in enumerate(image_list, start=1):
                xref = img_info[0]
                base_image = doc.extract_image(xref)
                image_ext = base_image["ext"]
                image_filename = f"{topic}_page{page_num+1}_img{img_index}.{image_ext}"
                image_filepath = os.path.join(UPLOADS_DIR, image_filename)
                
                with open(image_filepath, "wb") as f:
                    f.write(base_image["image"])
                extracted_image_filenames.append(image_filename)
            
            # Send prompt to Gemini for this page
            system_prompt = SystemMessage(content=f"""You are an expert educational content extractor.
Your task is to visually parse the provided PDF page image and extract all multiple-choice questions into JSON.

CRITICAL INSTRUCTIONS:
1. Extract the math equations perfectly using LaTeX formatting (e.g. $e^x$, \\frac{{1}}{{x}}).
2. COMPLETELY IGNORE all Hindi text. Do not include any Hindi in the output.
3. If a question has an associated diagram/figure, look at the provided extracted image filenames: {extracted_image_filenames}. Match the correct filename to the `questionImage` field for that question. If there is no diagram, leave it empty.
4. Maintain the correct original question number in the question text (e.g., 'Q1. What is...').
""")
            
            user_msg = HumanMessage(content=[
                {"type": "text", "text": f"Extract questions from this page for topic: {topic}"},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{page_b64}"}}
            ])
            
            try:
                result = structured_llm.invoke([system_prompt, user_msg])
                if result and result.questions:
                    parsed_qs = [q.model_dump() for q in result.questions]
                    
                    # Convert to DB schema
                    for q in parsed_qs:
                        q['exam'] = "JEE Mains"
                        q['year'] = 2024
                        q['subject'] = "Maths"
                        q['topic'] = topic
                        q['marks'] = 4
                        q['negativeMarks'] = 1
                    
                    all_questions.extend(parsed_qs)
                    print(f"    Found {len(parsed_qs)} questions on page {page_num + 1}.")
            except Exception as e:
                print(f"    Error on page {page_num + 1}: {e}")
                
        doc.close()
        
        # Insert to MongoDB
        if all_questions:
            print(f"Inserting {len(all_questions)} questions from {pdf_file} into MongoDB...")
            questions_collection.insert_many(all_questions)
            print("Done!")
        else:
            print("No questions found.")

if __name__ == "__main__":
    parse_pdfs_with_gemini()
