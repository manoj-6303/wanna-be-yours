import os
import json
import glob
import re
from collections import defaultdict

# --- Configuration ---
BASE_DIR = os.path.dirname(os.path.dirname(__file__))
QUESTION_BANK_DIR = os.path.join(BASE_DIR, "..", "QuestionBank")
IMAGES_DIR = os.path.join(BASE_DIR, "..", "frontend", "public", "images")
REPORTS_DIR = os.path.join(QUESTION_BANK_DIR, "audit_reports")

if not os.path.exists(REPORTS_DIR):
    os.makedirs(REPORTS_DIR)

# --- Global State ---
total_files_scanned = 0
total_questions_scanned = 0
valid_questions_count = 0
invalid_questions_count = 0

errors = []
warnings = []
valid_questions = []
invalid_questions = []
duplicate_questions = []
missing_images = []
broken_latex = []

global_questions_pool = []
all_referenced_images = set()

# Cache physical image existence for fast lookup
print("Scanning image directory...")
physical_images = set()
if os.path.exists(IMAGES_DIR):
    for root, _, files in os.walk(IMAGES_DIR):
        for file in files:
            physical_images.add(file)
else:
    print("WARNING: Image directory not found at", IMAGES_DIR)

def add_error(q, msg, category="OTHER"):
    errors.append({
        "type": "ERROR",
        "category": category,
        "file": q.get('_file_path', 'Unknown'),
        "index": q.get('_index', -1),
        "message": msg,
        "questionId": q.get('_internal_id', '')
    })
    q['_is_valid'] = False

def add_critical(q, msg, category="CRITICAL"):
    errors.append({
        "type": "CRITICAL",
        "category": category,
        "file": q.get('_file_path', 'Unknown'),
        "index": q.get('_index', -1),
        "message": msg,
        "questionId": q.get('_internal_id', '')
    })
    q['_is_valid'] = False

def add_warning(q, msg, category="WARNING"):
    warnings.append({
        "type": "WARNING",
        "category": category,
        "file": q.get('_file_path', 'Unknown'),
        "index": q.get('_index', -1),
        "message": msg,
        "questionId": q.get('_internal_id', '')
    })

def normalize_string(s):
    if not s: return ""
    # Remove all whitespace and make lowercase for aggressive deduplication check
    return re.sub(r'\s+', '', str(s)).lower()

def check_latex(text, q, context_field):
    if not text: return
    # Basic LaTeX sanity checks
    # Count dollar signs (should be even, unless escaped)
    # This is a rudimentary check, as \$ exists, but for general math it catches unclosed tags
    dollars = re.findall(r'(?<!\\)\$', text)
    if len(dollars) % 2 != 0:
        add_error(q, f"Unbalanced $ in {context_field}", "LATEX")
        broken_latex.append(q)
        return
    
    # Check for broken frac or sqrt
    if "\\frac{" in text and "}" not in text.split("\\frac{", 1)[1]:
        add_error(q, f"Broken \\frac in {context_field}", "LATEX")
        broken_latex.append(q)
        return

    # Suspicious truncation
    if text.endswith("\\") or text.endswith("\\frac{") or text.endswith("_{"):
        add_error(q, f"Malformed LaTeX ending in {context_field}", "LATEX")
        broken_latex.append(q)

def validate_image_ref(img_filename, q, context_field):
    if not img_filename: return
    all_referenced_images.add(img_filename)
    
    img_path = os.path.join(IMAGES_DIR, img_filename)
    if not os.path.exists(img_path):
        add_error(q, f"Image not found in {context_field}: '{img_filename}'", "IMAGE")
        missing_images.append({
            "file": q.get('_file_path'),
            "questionId": q.get('_internal_id'),
            "image": img_filename,
            "field": context_field
        })

def validate_question(q, expected_metadata):
    q['_is_valid'] = True
    
    # 1. Structure & Required Fields
    required_fields = ['exam', 'year', 'session', 'subject', 'topic', 'difficulty', 'question', 'options', 'correctAnswer', 'marks', 'negativeMarks']
    for field in required_fields:
        if field not in q:
            add_critical(q, f"Missing required field: {field}", "STRUCTURE")
            return # Cannot proceed if structure is broken
    
    # 2. Metadata Path Validation
    def norm_meta(s):
        return str(s).lower().replace(' ', '').replace('_', '')
        
    if norm_meta(q.get('exam')) != norm_meta(expected_metadata['exam']) and q.get('exam') != 'EAMCET' and expected_metadata['exam'] != 'emcet':
        if not (expected_metadata['exam'] == 'emcet' and q.get('exam') == 'EAMCET'):
            add_error(q, f"Path/Metadata mismatch for 'exam'. Expected ~{expected_metadata['exam']}, got {q.get('exam')}", "METADATA_MISMATCH")
            
    if norm_meta(q.get('subject')) != norm_meta(expected_metadata['subject']):
        add_error(q, f"Path/Metadata mismatch for 'subject'. Expected {expected_metadata['subject']}, got {q.get('subject')}", "METADATA_MISMATCH")
        
    if norm_meta(q.get('topic')) != norm_meta(expected_metadata['topic']):
        add_error(q, f"Path/Metadata mismatch for 'topic'. Expected {expected_metadata['topic']}, got {q.get('topic')}", "METADATA_MISMATCH")
        
    if norm_meta(q.get('difficulty')) != norm_meta(expected_metadata['difficulty']):
        add_error(q, f"Path/Metadata mismatch for 'difficulty'. Expected {expected_metadata['difficulty']}, got {q.get('difficulty')}", "METADATA_MISMATCH")

    # 3. Field Content Validation
    if str(q.get('difficulty')).title() not in ["Easy", "Medium", "Hard"]:
        add_critical(q, f"Invalid difficulty: {q.get('difficulty')}", "FIELD_VALUE")

    if not str(q.get('question', '')).strip():
        add_critical(q, "Question text is empty", "FIELD_VALUE")
        
    # Options Validation
    options = q.get('options', [])
    if not isinstance(options, list) or len(options) != 4:
        add_critical(q, f"Must have exactly 4 options. Found {len(options) if isinstance(options, list) else 'invalid'}", "OPTIONS")
    else:
        ids = [opt.get('id') for opt in options]
        if set(ids) != {'A', 'B', 'C', 'D'}:
            add_critical(q, f"Option IDs must be exactly A, B, C, D. Found: {ids}", "OPTIONS")
        for opt in options:
            if not str(opt.get('text', '')).strip() and not opt.get('image'):
                add_critical(q, f"Option {opt.get('id')} has no text and no image", "OPTIONS")
            validate_image_ref(opt.get('image'), q, f"Option {opt.get('id')} image")
            check_latex(opt.get('text'), q, f"Option {opt.get('id')} text")

    # Correct Answer
    ans = q.get('correctAnswer')
    if ans not in ['A', 'B', 'C', 'D']:
        add_critical(q, f"Invalid correctAnswer: {ans}", "ANSWER")

    # Numbers
    try:
        float(q.get('marks', 0))
    except ValueError:
        add_critical(q, f"Invalid marks: {q.get('marks')}", "FIELD_VALUE")
        
    try:
        float(q.get('negativeMarks', 0))
    except ValueError:
        add_critical(q, f"Invalid negativeMarks: {q.get('negativeMarks')}", "FIELD_VALUE")

    # Explanation Validation
    expl = str(q.get('explanation', '')).strip()
    if not expl or "Please see the solution in the MathonGo PDF" in expl:
        add_error(q, "Missing or placeholder explanation", "EXPLANATION")
    elif len(expl) < 10:
        add_warning(q, "Very short explanation", "EXPLANATION")

    # Image Validation
    validate_image_ref(q.get('image'), q, "image")
    validate_image_ref(q.get('solutionImage'), q, "solutionImage")
    validate_image_ref(q.get('questionImage'), q, "questionImage")
    
    # LaTeX & Quality
    check_latex(q.get('question'), q, "question")
    check_latex(q.get('explanation'), q, "explanation")


def main():
    global total_files_scanned, total_questions_scanned
    global valid_questions_count, invalid_questions_count
    
    print(f"Scanning JSON files in {QUESTION_BANK_DIR}...")
    
    search_pattern = os.path.join(QUESTION_BANK_DIR, "*", "*", "*", "*.json")
    json_files = glob.glob(search_pattern)
    
    for file_path in json_files:
        # Ignore audit_reports dir if it got caught
        if "audit_reports" in file_path: continue
        
        total_files_scanned += 1
        
        parts = os.path.normpath(file_path).split(os.sep)
        try:
            expected_metadata = {
                'exam': parts[-4],
                'subject': parts[-3],
                'topic': parts[-2],
                'difficulty': parts[-1].replace('.json', '')
            }
        except IndexError:
            expected_metadata = {}
            
        try:
            with open(file_path, 'r', encoding='utf-8') as f:
                data = json.load(f)
        except json.JSONDecodeError as e:
            errors.append({
                "type": "CRITICAL",
                "category": "JSON_SYNTAX",
                "file": file_path,
                "message": f"JSON Decode Error: {e}"
            })
            continue
            
        if isinstance(data, dict):
            data = [data]
            
        for i, q in enumerate(data):
            if not isinstance(q, dict):
                continue
            
            total_questions_scanned += 1
            
            # Setup internal tracking fields (removed before output)
            q['_file_path'] = file_path
            q['_index'] = i
            q['_internal_id'] = f"{file_path}_{i}"
            
            validate_question(q, expected_metadata)
            global_questions_pool.append(q)

    # Cross-file deduplication
    print("Running cross-file deduplication checks...")
    seen_questions = {}
    for q in global_questions_pool:
        norm_q = normalize_string(q.get('question', ''))
        if norm_q:
            if norm_q in seen_questions:
                add_error(q, f"Duplicate question detected. Matches {seen_questions[norm_q]['_internal_id']}", "DUPLICATE")
                duplicate_questions.append({
                    "q1": seen_questions[norm_q]['_internal_id'],
                    "q2": q['_internal_id'],
                    "text": q.get('question')
                })
            else:
                seen_questions[norm_q] = q

    # Determine unused images
    print("Calculating unused images...")
    unused_images_list = list(physical_images - all_referenced_images)
    
    # Sort into Valid/Invalid and clean internal fields
    for q in global_questions_pool:
        # Remove internal tracking keys
        is_valid = q.pop('_is_valid', False)
        q.pop('_file_path', None)
        q.pop('_index', None)
        q.pop('_internal_id', None)
        
        if is_valid:
            valid_questions.append(q)
            valid_questions_count += 1
        else:
            invalid_questions.append(q)
            invalid_questions_count += 1

    print("Generating reports...")
    
    # Save outputs
    def save_json(filename, data):
        with open(os.path.join(REPORTS_DIR, filename), 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2, ensure_ascii=False)

    save_json("errors.json", errors)
    save_json("warnings.json", warnings)
    save_json("valid-questions.json", valid_questions)
    save_json("invalid-questions.json", invalid_questions)
    save_json("duplicate-questions.json", duplicate_questions)
    save_json("missing-images.json", missing_images)
    save_json("unused-images.json", unused_images_list)
    
    # Group errors for summary
    error_summary = defaultdict(int)
    for err in errors:
        error_summary[err['category']] += 1

    summary_report = {
        "total_files_scanned": total_files_scanned,
        "total_questions_scanned": total_questions_scanned,
        "valid_questions": valid_questions_count,
        "invalid_questions": invalid_questions_count,
        "error_summary": dict(error_summary),
        "total_warnings": len(warnings),
        "total_missing_images": len(missing_images),
        "total_unused_images": len(unused_images_list)
    }
    save_json("validation-report.json", summary_report)
    
    # Generate simple HTML Report
    html_content = f"""
    <html>
    <head>
        <title>Question Bank Audit Report</title>
        <style>
            body {{ font-family: Arial, sans-serif; margin: 40px; }}
            .metric {{ font-size: 20px; font-weight: bold; margin-bottom: 10px; }}
            .valid {{ color: green; }}
            .invalid {{ color: red; }}
            table {{ border-collapse: collapse; width: 100%; margin-top: 20px; }}
            th, td {{ border: 1px solid #ddd; padding: 8px; text-align: left; }}
            th {{ background-color: #f2f2f2; }}
        </style>
    </head>
    <body>
        <h1>Question Bank Audit Report</h1>
        <div class="metric">Total Files Scanned: {total_files_scanned}</div>
        <div class="metric">Total Questions Scanned: {total_questions_scanned}</div>
        <div class="metric valid">Valid Questions: {valid_questions_count}</div>
        <div class="metric invalid">Invalid Questions: {invalid_questions_count}</div>
        
        <h2>Error Breakdown</h2>
        <ul>
    """
    for cat, count in error_summary.items():
        html_content += f"<li><b>{cat}:</b> {count} issues</li>"
        
    html_content += """
        </ul>
        <h2>Top Errors</h2>
        <table>
            <tr><th>Type</th><th>Category</th><th>File</th><th>Message</th></tr>
    """
    for err in errors[:100]: # Show first 100
        html_content += f"<tr><td>{err['type']}</td><td>{err['category']}</td><td>{err['file']}</td><td>{err['message']}</td></tr>"
        
    html_content += """
        </table>
        <p><i>See JSON reports for full details.</i></p>
    </body>
    </html>
    """
    with open(os.path.join(REPORTS_DIR, "validation-report.html"), 'w', encoding='utf-8') as f:
        f.write(html_content)

    print("\n==================================================")
    print("VALIDATION COMPLETE")
    print(f"Total Questions: {total_questions_scanned}")
    print(f"Valid: {valid_questions_count}")
    print(f"Invalid: {invalid_questions_count}")
    print(f"Reports saved to: {REPORTS_DIR}")
    print("==================================================")

if __name__ == "__main__":
    main()
