import os
import glob
import base64
import concurrent.futures
from PIL import Image
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_core.messages import HumanMessage
from dotenv import load_dotenv

load_dotenv(os.path.join(os.path.dirname(__file__), '.env'))
load_dotenv(os.path.join(os.path.dirname(__file__), 'python_parser', '.env'))

IMAGES_DIR = r"d:\lakshya Demo\ExamPro\frontend\public\images"

llm = ChatGoogleGenerativeAI(model="gemini-1.5-flash", temperature=0)

def process_image(orig_path):
    target_path = orig_path.replace("_original.png", ".png")
    try:
        with open(orig_path, "rb") as f:
            image_bytes = f.read()
        
        base64_image = base64.b64encode(image_bytes).decode("utf-8")
        
        prompt = (
            "Analyze this image. It contains a question diagram at the top and multiple-choice options "
            "(like A, B, C, D or (1), (2), (3), (4)) at the bottom. "
            "Determine the exact vertical percentage (0-100) where the diagram ends and the options begin. "
            "For example, if the diagram ends halfway down, return 50. "
            "Return ONLY the integer percentage. If there are no options, return 100."
        )
        
        message = HumanMessage(
            content=[
                {"type": "text", "text": prompt},
                {
                    "type": "image_url",
                    "image_url": {"url": f"data:image/png;base64,{base64_image}"},
                },
            ]
        )
        
        response = llm.invoke([message])
        content = response.content.strip()
        
        # Parse the percentage
        try:
            # Extract just the digits
            pct_str = ''.join(c for c in content if c.isdigit())
            pct = int(pct_str)
            if pct < 10 or pct > 100:
                pct = 100 # Default fallback if unreasonable
        except Exception:
            pct = 100
            
        if pct < 100:
            img = Image.open(orig_path)
            width, height = img.size
            crop_height = int(height * (pct / 100.0))
            
            # Additional heuristic: Add a small buffer (e.g. +2%) to ensure we don't chop the bottom 
            # of the diagram, but not too much that we hit the options.
            crop_height = min(height, crop_height + int(height * 0.02))
            
            box = (0, 0, width, crop_height)
            cropped = img.crop(box)
            cropped.save(target_path)
            print(f"[{pct}%] Cropped {os.path.basename(target_path)}")
        else:
            # No crop needed
            img = Image.open(orig_path)
            img.save(target_path)
            print(f"[{pct}%] Skipped crop for {os.path.basename(target_path)}")
            
    except Exception as e:
        print(f"Error processing {orig_path}: {e}")

def main():
    search_pattern = os.path.join(IMAGES_DIR, "**", "*_original.png")
    original_images = glob.glob(search_pattern, recursive=True)
    
    print(f"Found {len(original_images)} images to process.")
    
    with concurrent.futures.ThreadPoolExecutor(max_workers=5) as executor:
        executor.map(process_image, original_images)
        
    print("All images processed!")

if __name__ == "__main__":
    main()
