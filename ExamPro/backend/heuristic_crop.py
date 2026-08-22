import os
import glob
from PIL import Image

IMAGES_DIR = r"d:\lakshya Demo\ExamPro\frontend\public\images"

def auto_crop_options(img_path):
    target_path = img_path.replace("_original.png", ".png")
    try:
        img = Image.open(img_path).convert('L') # Convert to grayscale
        width, height = img.size
        
        # We only care about cropping the bottom half
        if height < 150:
            img.save(target_path)
            return
            
        pixels = img.load()
        
        # Calculate horizontal projection profile (sum of darkness in each row)
        # 255 is white, 0 is black. Darkness = 255 - pixel
        row_darkness = []
        for y in range(height):
            darkness = 0
            for x in range(width):
                darkness += (255 - pixels[x, y])
            row_darkness.append(darkness)
            
        # Find gaps (rows with very little darkness)
        # Let's say a row is "blank" if average darkness per pixel < threshold
        # Threshold: if average pixel is > 250 (i.e. darkness < 5)
        # width * 5
        blank_threshold = width * 10
        
        is_blank = [d < blank_threshold for d in row_darkness]
        
        # Find continuous blank segments
        blank_segments = [] # list of (start_y, end_y, length)
        current_start = -1
        for y in range(height):
            if is_blank[y]:
                if current_start == -1:
                    current_start = y
            else:
                if current_start != -1:
                    blank_segments.append((current_start, y, y - current_start))
                    current_start = -1
                    
        if current_start != -1:
            blank_segments.append((current_start, height, height - current_start))
            
        # We want to find the largest blank segment that is in the bottom 60% of the image
        # i.e., y > height * 0.4
        valid_segments = [seg for seg in blank_segments if seg[0] > height * 0.4]
        
        if valid_segments:
            # Sort by length of the gap, descending
            valid_segments.sort(key=lambda x: x[2], reverse=True)
            best_gap = valid_segments[0]
            
            # We crop at the middle of this best gap
            crop_y = best_gap[0] + (best_gap[2] // 2)
            
            # To be safe, don't crop if the crop_y is too high (e.g., above 30%)
            if crop_y > height * 0.3:
                orig_img = Image.open(img_path)
                cropped = orig_img.crop((0, 0, width, crop_y))
                cropped.save(target_path)
                print(f"Cropped {os.path.basename(target_path)} at {crop_y}/{height} ({int(crop_y/height*100)}%)")
                return
                
        # Fallback if no good gap found
        orig_img = Image.open(img_path)
        orig_img.save(target_path)
        print(f"Skipped {os.path.basename(target_path)} (No gap found)")

    except Exception as e:
        print(f"Error processing {img_path}: {e}")

def main():
    search_pattern = os.path.join(IMAGES_DIR, "**", "*_original.png")
    original_images = glob.glob(search_pattern, recursive=True)
    print(f"Processing {len(original_images)} images...")
    
    for path in original_images:
        auto_crop_options(path)

if __name__ == "__main__":
    main()
