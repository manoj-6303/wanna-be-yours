import os
import cv2
import numpy as np

# Path to the images folder
IMAGES_DIR = r"D:\lakshya Demo\ExamPro\QuestionBank\images"

def remove_watermarks():
    if not os.path.exists(IMAGES_DIR):
        print(f"Directory not found: {IMAGES_DIR}")
        return

    # Find all PNG/JPG images
    image_files = [f for f in os.listdir(IMAGES_DIR) if f.lower().endswith(('.png', '.jpg', '.jpeg'))]
    
    if not image_files:
        print(f"No images found in {IMAGES_DIR}")
        return

    print(f"Found {len(image_files)} images. Processing to remove watermarks...")
    
    success_count = 0
    for file in image_files:
        filepath = os.path.join(IMAGES_DIR, file)
        
        try:
            # Read the image
            img = cv2.imread(filepath)
            if img is None:
                continue

            # Convert to grayscale to easily detect brightness
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
            
            # The MathonGo watermark is very light (usually > 200 brightness).
            # The actual diagram lines and text are much darker.
            # So, we find all pixels lighter than 180 and turn them perfectly white.
            img[gray > 180] = 255
            
            # Save the cleaned image back to the exact same file
            cv2.imwrite(filepath, img)
            print(f"  [Cleaned] {file}")
            success_count += 1
            
        except Exception as e:
            print(f"  [Error] Failed to process {file}: {e}")
            
    print(f"\nDone! Successfully removed watermarks from {success_count} images.")

if __name__ == "__main__":
    remove_watermarks()
