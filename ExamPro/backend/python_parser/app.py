from fastapi import FastAPI, UploadFile, File, Form, BackgroundTasks
import pymupdf
import os
import json
import requests
from dotenv import load_dotenv
from langchain_google_genai import ChatGoogleGenerativeAI
from pydantic import BaseModel, Field
from typing import List, Optional
import typing

load_dotenv(override=True)

app = FastAPI()

NODE_API_URL = "http://localhost:5000/api/v1/questions/import/webhook"

# Define the Pydantic schema for structured output
class Question(BaseModel):
    question: str = Field(description="The full text of the question")
    optionA: str = Field(description="Option A text")
    optionB: str = Field(description="Option B text")
    optionC: str = Field(description="Option C text")
    optionD: str = Field(description="Option D text")
    correctAnswer: str = Field(description="The correct option letter, must be exactly 'A', 'B', 'C', or 'D'")
    subject: Optional[str] = Field(description="The academic subject (e.g. Physics, Chemistry, Math)", default="")
    difficulty: Optional[str] = Field(description="Difficulty level: Easy, Medium, or Hard", default="")
    chapter: Optional[str] = Field(description="The topic or chapter", default="")
    explanation: Optional[str] = Field(description="Explanation or solution steps if present", default="")
    questionImage: Optional[str] = Field(description="Filename of the extracted diagram/image belonging to the question, if any", default="")

class QuestionBank(BaseModel):
    questions: List[Question] = Field(description="List of extracted questions")

import base64
from langchain_core.messages import HumanMessage, SystemMessage

def process_pdf(job_id: str, file_path: str):
    try:
        if not os.environ.get("GOOGLE_API_KEY") or os.environ.get("GOOGLE_API_KEY") == "paste_your_google_api_key_here":
            raise Exception("Google API Key is missing or invalid. Please update the .env file in the python_parser directory.")
            
        doc = pymupdf.open(file_path)
        all_questions = []
        
        llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)
        structured_llm = llm.with_structured_output(QuestionBank)
        
        # We will save extracted images in the backend uploads folder
        uploads_dir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "uploads"))
        os.makedirs(uploads_dir, exist_ok=True)
        
        for page_num in range(len(doc)):
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
                image_filename = f"{job_id}_page{page_num+1}_img{img_index}.{image_ext}"
                image_filepath = os.path.join(uploads_dir, image_filename)
                
                with open(image_filepath, "wb") as f:
                    f.write(base_image["image"])
                extracted_image_filenames.append(image_filename)
            
            # Send prompt to Gemini for this page
            system_prompt = SystemMessage(content=f"""You are an expert educational content extractor.
Your task is to visually parse the provided PDF page image and extract all multiple-choice questions into JSON.

CRITICAL INSTRUCTIONS:
1. Extract the math equations perfectly using LaTeX formatting (e.g. $e^x$, $\\frac{{1}}{{x}}$).
2. COMPLETELY IGNORE all Hindi text. Do not include any Hindi in the output.
3. If a question has an associated diagram/figure, look at the provided extracted image filenames: {extracted_image_filenames}. Match the correct filename to the `questionImage` field for that question. If there is no diagram, leave it empty.
4. Maintain the correct original question number in the question text.
""")
            
            user_msg = HumanMessage(content=[
                {"type": "text", "text": "Please extract the questions from this page."},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{page_b64}"}}
            ])
            
            result = structured_llm.invoke([system_prompt, user_msg])
            if result and result.questions:
                all_questions.extend([q.model_dump() for q in result.questions])
                
        # Send webhook back to Node
        requests.post(f"{NODE_API_URL}/{job_id}", json={
            "status": "COMPLETED",
            "results": all_questions,
            "totalParsed": len(all_questions)
        })
    except Exception as e:
        requests.post(f"{NODE_API_URL}/{job_id}", json={
            "status": "FAILED",
            "error": str(e)
        })

@app.post("/parse")
async def parse_pdf(job_id: str = Form(...), file: UploadFile = File(...), background_tasks: BackgroundTasks = BackgroundTasks()):
    file_path = f"temp_{job_id}.pdf"
    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())
        
    background_tasks.add_task(process_pdf, job_id, file_path)
    
    return {"message": "Job started", "jobId": job_id}
