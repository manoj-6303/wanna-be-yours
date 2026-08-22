import os
import shutil
from PIL import Image

img_path = r"d:\lakshya Demo\ExamPro\frontend\public\images\aromatic easy\aromatic_easy_q1.png"
if not os.path.exists(img_path):
    print("Image not found:", img_path)
else:
    # Backup original
    shutil.copy(img_path, img_path.replace(".png", "_original.png"))
    
    img = Image.open(img_path)
    print("Original size:", img.size)
    
    width, height = img.size
    # Let's crop the top part. Based on the screenshot, the molecules are in the top 30-40%.
    # 312 height -> top 120 pixels should be enough to capture the diagram without the text below it.
    box = (0, 0, width, int(height * 0.40)) 
    cropped_img = img.crop(box)
    
    cropped_img.save(img_path)
    
    print("Cropped image saved. New size:", cropped_img.size)
