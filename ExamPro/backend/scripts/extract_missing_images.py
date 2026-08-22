import os
import fitz
from pymongo import MongoClient

FRONTEND_IMAGES_DIR = r"d:\lakshya Demo\ExamPro\frontend\public\images"
QUESTION_BANK_DIR = r"d:\lakshya Demo\ExamPro\QuestionBank"

def find_pdf_in_dir(filename, search_dir):
    for root, _, files in os.walk(search_dir):
        if filename in files:
            return os.path.join(root, filename)
    return None

def extract_missing_images():
    client = MongoClient('mongodb://localhost:27017/')
    db = client['exampro']
    questions = db['questions']
    
    qs = list(questions.find({"question": {"$regex": r"\(see diagram\)", "$options": "i"}}))
    print(f"Found {len(qs)} questions with '(see diagram)'.")
    
    for q in qs:
        q_img = q.get("questionImage")
        if not q_img:
            continue
            
        full_img_path = os.path.join(FRONTEND_IMAGES_DIR, q_img.replace('/', '\\'))
        if os.path.exists(full_img_path):
            continue # already exists
            
        print(f"Missing image: {q_img} for Question ID: {q['_id']}")
        
        source_file = q.get("sourceFile")
        if not source_file:
            print("  No sourceFile found.")
            continue
            
        pdf_path = find_pdf_in_dir(source_file, QUESTION_BANK_DIR)
        if not pdf_path:
            print(f"  Cannot find PDF: {source_file}")
            continue
            
        print(f"  Found PDF: {pdf_path}")
        
        # Open PDF
        doc = fitz.open(pdf_path)
        
        # Search for a snippet of the question to find the page
        snippet = q["question"][:50].replace('\n', ' ')
        found_page = -1
        for page_num in range(len(doc)):
            text = doc[page_num].get_text()
            # Very basic search
            if snippet[:20] in text or q.get("id", -1) != -1 and f"Q{q.get('id')}" in text:
                 found_page = page_num
                 break
                 
        if found_page == -1:
             print("  Could not find question text on any page.")
             # fallback to first 5 pages if it's question 1
             if q.get("id") == 1:
                 found_page = 0
             else:
                 continue
                 
        print(f"  Likely on page {found_page+1}")
        
        # Extract images from that page
        page = doc[found_page]
        image_list = page.get_images(full=True)
        
        if image_list:
            xref = image_list[0][0]
            base_image = doc.extract_image(xref)
            image_bytes = base_image["image"]
            
            os.makedirs(os.path.dirname(full_img_path), exist_ok=True)
            with open(full_img_path, "wb") as f:
                f.write(image_bytes)
            print(f"  Saved image to {full_img_path}")
            
            # Remove '(see diagram)' from question text
            new_text = q["question"].replace("(see diagram)", "").replace("(See diagram)", "").strip()
            questions.update_one({"_id": q["_id"]}, {"$set": {"question": new_text}})
            print("  Removed '(see diagram)' from question text.")
        else:
            print("  No images found on that page.")

if __name__ == "__main__":
    extract_missing_images()
