import os
import glob
import shutil

IMAGES_DIR = r"d:\lakshya Demo\ExamPro\frontend\public\images"

def restore_all_images():
    search_pattern = os.path.join(IMAGES_DIR, "**", "*_original.png")
    original_images = glob.glob(search_pattern, recursive=True)
    
    count = 0
    for orig_path in original_images:
        target_path = orig_path.replace("_original.png", ".png")
        try:
            shutil.copy(orig_path, target_path)
            count += 1
            print(f"Restored {os.path.basename(target_path)}")
        except Exception as e:
            print(f"Error restoring {orig_path}: {e}")
            
    print(f"Successfully restored {count} images.")

if __name__ == "__main__":
    restore_all_images()
