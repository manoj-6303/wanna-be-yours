import os
import time
import base64
import json
import fitz  # PyMuPDF
from dotenv import load_dotenv
from pydantic import BaseModel, Field
from typing import List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage

load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'python_parser', '.env'))
load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))

BASE_DIR = r"d:\lakshya Demo\ExamPro\QuestionBank\JeeMains\Maths"

class Option(BaseModel):
    id: str = Field(description="Must be A, B, C, or D")
    text: str = Field(description="LaTeX formatted text of the option")
    image: Optional[str] = None

class ParsedQuestion(BaseModel):
    difficulty: str = Field(description="Must be Easy, Medium, or Hard")
    question: str = Field(description="LaTeX formatted text of the question. Extract Markdown tables explicitly if present.")
    has_question_image: bool = Field(description="True ONLY if the actual question prompt requires a diagram/figure to be solved")
    has_solution_image: bool = Field(description="True ONLY if the solution/explanation section contains a diagram/figure")
    options: List[Option]
    correctAnswer: str = Field(description="The correct option letter, exactly 'A', 'B', 'C', or 'D'")
    explanation: str = Field(description="LaTeX formatted explanation/solution for the question. Look for the answers section at the bottom of the PDF.")

class QuestionBank(BaseModel):
    questions: List[ParsedQuestion] = Field(description="List of extracted questions")

def process_all_topics():
    if not os.environ.get("GOOGLE_API_KEY"):
        print("Error: GOOGLE_API_KEY is not set.")
        return

    llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash-lite", temperature=0)
    structured_llm = llm.with_structured_output(QuestionBank)

    topics = [d for d in os.listdir(BASE_DIR) if os.path.isdir(os.path.join(BASE_DIR, d))]
    
    for topic in topics:
        if topic in ["Applications Of Derivatives", "Area_Under_Curves", "Area Under Curves"]:
            print(f"Skipping {topic} as it is already populated with real questions.")
            continue
            
        topic_dir = os.path.join(BASE_DIR, topic)
        pdf_files = [f for f in os.listdir(topic_dir) if f.lower().endswith('.pdf')]
        
        if not pdf_files:
            print(f"Skipping {topic}, no PDFs found.")
            continue
            
        print(f"\n{'='*50}\nProcessing Topic: {topic}\n{'='*50}")
        topic_slug = topic.replace(' ', '_').lower()
        
        easy_file = os.path.join(topic_dir, 'easy.json')
        medium_file = os.path.join(topic_dir, 'medium.json')
        hard_file = os.path.join(topic_dir, 'hard.json')
        
        # We start fresh for each topic to avoid dummy duplicates
        easy_qs = []
        medium_qs = []
        hard_qs = []
        
        for pdf_file in pdf_files:
            print(f"\nProcessing PDF: {pdf_file}")
            pdf_path = os.path.join(topic_dir, pdf_file)
            
            try:
                doc = fitz.open(pdf_path)
                batch_size = 5
                
                for i in range(0, len(doc), batch_size):
                    all_pages_b64 = []
                    chunk_pages = range(i, min(i+batch_size, len(doc)))
                    print(f"  Extracting pages {i+1} to {chunk_pages.stop} as images...")
                    
                    for page_num in chunk_pages:
                        page = doc[page_num]
                        pix = page.get_pixmap(dpi=150)
                        img_bytes = pix.tobytes("png")
                        page_b64 = base64.b64encode(img_bytes).decode("utf-8")
                        all_pages_b64.append(page_b64)
                        
                        # Images
                        try:
                            images_dir = os.path.join(os.path.dirname(BASE_DIR), "..", "images")
                            os.makedirs(images_dir, exist_ok=True)
                            for img_index, img in enumerate(page.get_images(full=True)):
                                xref = img[0]
                                base_image = doc.extract_image(xref)
                                if base_image:
                                    img_bytes = base_image["image"]
                                    img_ext = base_image["ext"]
                                    img_filename = f"{topic_slug}_p{page_num}_i{img_index}.{img_ext}"
                                    with open(os.path.join(images_dir, img_filename), "wb") as f:
                                        f.write(img_bytes)
                        except Exception as e:
                            pass

                    print("  Sending batch to Gemini (this may take a minute)...")
                    system_prompt = SystemMessage(content="""You are an expert educational content extractor.
Your task is to visually parse the provided PDF page images and extract ALL multiple-choice questions into JSON.

CRITICAL INSTRUCTIONS:
1. Extract the math equations perfectly using LaTeX formatting. **VERY IMPORTANT**: You MUST use double backslashes for ALL LaTeX commands (e.g., `\\\\frac{1}{x}`, `\\\\theta`, `\\\\beta`, `\\\\rightarrow`) so they are not corrupted during JSON parsing.
2. If there are data tables, strictly convert them to clear Markdown tables!
3. Some PDFs contain questions at the top and explanations/answers at the bottom. Correlate them correctly and include the explanation for each question.
4. Classify difficulty as Easy, Medium, or Hard.
5. Distinguish between images in the question vs images in the solution. If the question prompt has a diagram, set `has_question_image` to true.
6. Return a comprehensive list of all questions in this PDF.""")
                    
                    user_msg_content = [{"type": "text", "text": "Extract all questions and their explanations from this PDF document."}]
                    for page_b64 in all_pages_b64:
                        user_msg_content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{page_b64}"}})
                    
                    user_msg = HumanMessage(content=user_msg_content)
                    
                    max_retries = 3
                    for attempt in range(max_retries):
                        try:
                            result = structured_llm.invoke([system_prompt, user_msg])
                            if result and result.questions:
                                print(f"  Successfully extracted {len(result.questions)} questions from batch")
                                for q in result.questions:
                                    difficulty = q.difficulty.capitalize()
                                    if difficulty not in ["Easy", "Medium", "Hard"]:
                                        difficulty = "Medium"
                                    
                                    q_dict = q.dict()
                                    q_dict.update({
                                        "exam": "JEE Mains",
                                        "year": 2024,
                                        "session": "January",
                                        "subject": "Mathematics",
                                        "part": "1A",
                                        "topic": topic,
                                        "chapter": topic,
                                        "marks": 4,
                                        "negativeMarks": 1
                                    })
                                    
                                    # Filter out bad questions
                                    is_bad = False
                                    if "The question corresponds to" in q.question:
                                        is_bad = True
                                    if len(q.options) > 0 and q.options[0].text.strip() == "Option A":
                                        is_bad = True
                                    
                                    if not is_bad:
                                        if difficulty == "Easy":
                                        easy_qs.append(q_dict)
                                    elif difficulty == "Medium":
                                        medium_qs.append(q_dict)
                                    else:
                                        hard_qs.append(q_dict)
                                        
                                # Save incrementally per batch
                                with open(easy_file, 'w', encoding='utf-8') as f:
                                    json.dump(easy_qs, f, indent=2)
                                with open(medium_file, 'w', encoding='utf-8') as f:
                                    json.dump(medium_qs, f, indent=2)
                                with open(hard_file, 'w', encoding='utf-8') as f:
                                    json.dump(hard_qs, f, indent=2)
                                    
                                break # success
                        except Exception as e:
                            print(f"  Error on attempt {attempt+1}: {e}")
                            if attempt < max_retries - 1:
                                time.sleep(60) # wait before retry
                    
                    time.sleep(10) # Base delay between batches to respect RPM limits
            
            except Exception as e:
                print(f"Error opening PDF {pdf_file}: {e}")

if __name__ == "__main__":
    process_all_topics()
