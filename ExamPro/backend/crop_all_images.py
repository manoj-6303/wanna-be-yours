import os
import glob
from PIL import Image
import shutil

IMAGES_DIR = r"d:\lakshya Demo\ExamPro\frontend\public\images"

def crop_all_images():
    # Find all PNG files in subdirectories
    search_pattern = os.path.join(IMAGES_DIR, "**", "*.png")
    all_images = glob.glob(search_pattern, recursive=True)
    
    count = 0
    for img_path in all_images:
        if "_original" in img_path or "_cropped" in img_path:
            continue
            
        try:
            img = Image.open(img_path)
            width, height = img.size
            
            # Heuristic: if it's a very wide image (width > 600) and height is relatively large (> 150)
            # Or just crop the top 40% for all of them if the user requested it.
            # Let's crop the top 45% for all wide images.
            
            if width > 400 and height > 150:
                # Backup if not already backed up
                backup_path = img_path.replace(".png", "_original.png")
                if not os.path.exists(backup_path):
                    shutil.copy(img_path, backup_path)
                    
                # Crop top 40%
                box = (0, 0, width, int(height * 0.40))
                cropped = img.crop(box)
                cropped.save(img_path)
                count += 1
                print(f"Cropped {os.path.basename(img_path)} (Old: {height}px, New: {int(height * 0.40)}px)")
        except Exception as e:
            print(f"Error processing {img_path}: {e}")
            
    print(f"Successfully cropped {count} images.")

if __name__ == "__main__":
    crop_all_images()
