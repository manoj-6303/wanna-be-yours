import os
import json
import base64
import fitz
import sys
from pydantic import BaseModel, Field
from typing import List, Optional
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage, SystemMessage
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '..', '.env'))
load_dotenv(os.path.join(os.path.dirname(__file__), '..', 'python_parser', '.env'))

WORKSPACE_ROOT = os.path.dirname(os.path.dirname(os.path.dirname(__file__)))
FRONTEND_IMAGES_DIR = os.path.join(WORKSPACE_ROOT, "frontend", "public", "images")

class ParsedExplanation(BaseModel):
    difficulty: str = Field(description="The difficulty of the question (Easy, Medium, Hard)")
    id: int = Field(description="The ID of the question in the JSON")
    explanation: str = Field(description="The extracted step-by-step explanation with LaTeX")
    explanationImage: Optional[str] = Field(description="The filename of the image belonging to the explanation, if any. Leave empty if none.", default="")

class ExplanationList(BaseModel):
    explanations: List[ParsedExplanation] = Field(description="List of explanations corresponding to the questions")

def extract_explanations(chapter_path: str):
    print(f"Processing chapter: {chapter_path}")
    
    pdfs = [f for f in os.listdir(chapter_path) if f == 'Amines - JEE Main 2026 (Jan) - MathonGo.pdf']
    if not pdfs:
        print("No valid PDF found.")
        return
    pdf_path = os.path.join(chapter_path, pdfs[0])
    topic_name = os.path.basename(chapter_path).lower().replace(' ', '_')
    
    # Load JSON files
    questions_info = []
    json_paths = {}
    for diff in ['easy', 'medium', 'hard']:
        j_path = os.path.join(chapter_path, f"{diff}.json")
        if os.path.exists(j_path):
            json_paths[diff] = j_path
            with open(j_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
                for q in data:
                    if 'MathonGo' in str(q.get('explanation', '')):
                        questions_info.append({
                        "difficulty": diff.capitalize(),
                        "id": q.get("id"),
                        "question_snippet": q.get("question", "")[:200]
                    })
    
    if not questions_info:
        print("No JSON questions found.")
        return

    print(f"Found {len(questions_info)} questions. Processing PDF {pdf_path}...")
    doc = fitz.open(pdf_path)
    
    # We will extract images from the whole PDF
    images_extracted = []
    dest_image_dir = os.path.join(FRONTEND_IMAGES_DIR, topic_name + "_solutions")
    os.makedirs(dest_image_dir, exist_ok=True)
    
    print("Extracting images from PDF...")
    for page_num in range(len(doc)):
        page = doc[page_num]
        image_list = page.get_images(full=True)
        for img_index, img_info in enumerate(image_list, start=1):
            xref = img_info[0]
            base_image = doc.extract_image(xref)
            image_ext = base_image["ext"]
            image_filename = f"{topic_name}_sol_p{page_num+1}_i{img_index}.{image_ext}"
            image_filepath = os.path.join(dest_image_dir, image_filename)
            with open(image_filepath, "wb") as f:
                f.write(base_image["image"])
            images_extracted.append(f"{topic_name}_solutions/{image_filename}")
            
    print(f"Extracted {len(images_extracted)} images.")

    # Render pages as base64
    page_b64s = []
    print("Converting pages to images for Gemini...")
    # Only process the last few pages where solutions usually are, or all pages if short.
    # MathonGo typically puts solutions in the second half.
    # To be safe and save tokens, we pass the whole document if it's small (< 20 pages).
    for page_num in range(len(doc)):
        pix = doc[page_num].get_pixmap(dpi=150)
        img_bytes = pix.tobytes("png")
        page_b64s.append(base64.b64encode(img_bytes).decode("utf-8"))
        
    doc.close()
    
    llm = ChatGoogleGenerativeAI(model="gemini-3.5-flash", temperature=0)
    structured_llm = llm.with_structured_output(ExplanationList)

    system_prompt = SystemMessage(content=f'''You are an expert educational data extractor.
Your task is to find and extract the step-by-step explanations (solutions) from the provided PDF pages for a specific list of questions.

CRITICAL INSTRUCTIONS:
1. Extract math equations perfectly using LaTeX (e.g. $e^x$, \\frac{{1}}{{x}}).
2. Match the explanation to the correct question using the provided JSON list of questions. The JSON list gives the difficulty and ID of each question, along with a snippet of the question text to help you locate the corresponding solution in the PDF.
3. If an explanation contains a diagram, select the correct image filename from this list: {images_extracted}.
4. Return a structured JSON list of the matched explanations. Do NOT include Hindi.
''')

    # Chunk the questions to avoid output token limits
    chunk_size = 20
    results_map = {}
    
    for i in range(0, len(questions_info), chunk_size):
        chunk = questions_info[i:i+chunk_size]
        print(f"Processing chunk {i//chunk_size + 1}...")
        
        user_content = [{"type": "text", "text": f"Here is the list of questions to find explanations for:\n{json.dumps(chunk, indent=2)}\n\nHere are the pages of the PDF:"}]
        for b64 in page_b64s:
            user_content.append({"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}})
            
        user_msg = HumanMessage(content=user_content)
        
        try:
            result = structured_llm.invoke([system_prompt, user_msg])
            if result and result.explanations:
                for exp in result.explanations:
                    key = f"{exp.difficulty.lower()}_{exp.id}"
                    results_map[key] = exp.model_dump()
                print(f"  Successfully extracted {len(result.explanations)} explanations.")
        except Exception as e:
            print(f"  Error invoking Gemini: {e}")

    # Update JSON files
    for diff, j_path in json_paths.items():
        with open(j_path, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        updated = False
        for q in data:
            key = f"{diff}_{q.get('id')}"
            if key in results_map:
                exp = results_map[key]
                if exp["explanation"]:
                    q["explanation"] = exp["explanation"]
                    if exp.get("explanationImage"):
                        q["explanationImage"] = exp["explanationImage"]
                    updated = True
        
        if updated:
            with open(j_path, 'w', encoding='utf-8') as f:
                json.dump(data, f, indent=2)
            print(f"Updated {j_path}")
            
    print("Done! You can now run import_question_bank.py to update MongoDB.")

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("Usage: python extract_explanations_gemini.py <path_to_chapter_folder>")
    else:
        extract_explanations(sys.argv[1])
