import re

with open('src/pages/Admin.jsx', 'r', encoding='utf-8') as f:
    code = f.read()

import_statement = "import MathRenderer from '../components/MathRenderer.jsx';\n"
if "MathRenderer from" not in code:
    code = code.replace("import axios from 'axios';", "import axios from 'axios';\n" + import_statement)

with open('src/pages/Admin.jsx', 'w', encoding='utf-8') as f:
    f.write(code)

print("Import added!")
