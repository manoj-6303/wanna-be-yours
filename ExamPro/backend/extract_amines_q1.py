import os
import fitz

pdf_path = r"d:\lakshya Demo\ExamPro\QuestionBank\JeeMains\Chemistry\Amines\Amines - JEE Main 2026 (Jan) - MathonGo.pdf"
dest_dir = r"d:\lakshya Demo\ExamPro\frontend\public\images\amines easy"

os.makedirs(dest_dir, exist_ok=True)

print(f"Opening PDF: {pdf_path}")
doc = fitz.open(pdf_path)

# Look for images on the first few pages
found = False
for page_num in range(min(5, len(doc))):
    page = doc[page_num]
    image_list = page.get_images(full=True)
    if image_list:
        print(f"Found {len(image_list)} images on page {page_num + 1}")
        # Take the first image and assume it's the one for Q1
        xref = image_list[0][0]
        base_image = doc.extract_image(xref)
        image_bytes = base_image["image"]
        
        # We save it as amines_easy_q1.png
        out_path = os.path.join(dest_dir, "amines_easy_q1.png")
        with open(out_path, "wb") as f:
            f.write(image_bytes)
        print(f"Saved image to {out_path}")
        found = True
        break

if not found:
    print("No images found on the first 5 pages.")
