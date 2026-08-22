const fs = require('fs');

const path = 'd:\\lakshya Demo\\ExamPro\\frontend\\src\\pages\\Admin.jsx';
let content = fs.readFileSync(path, 'utf8');

// Replace conditions
content = content.replace(/\(newSubject === 'Mathematics A' \|\| newSubject === 'Mathematics B'\)/g, "(newSubject === 'Mathematics')");
content = content.replace(/\(pdfSubject === 'Mathematics A' \|\| pdfSubject === 'Mathematics B'\)/g, "(pdfSubject === 'Mathematics')");
content = content.replace(/\(qFilters\.subject === 'Mathematics A' \|\| qFilters\.subject === 'Mathematics B'\)/g, "(qFilters.subject === 'Mathematics')");
content = content.replace(/\(bulkSubject === 'Mathematics A' \|\| bulkSubject === 'Mathematics B'\)/g, "(bulkSubject === 'Mathematics')");
content = content.replace(/\(e\.target\.value === 'Mathematics A' \|\| e\.target\.value === 'Mathematics B'\)/g, "(e.target.value === 'Mathematics')");

// Replace option lists
// Usually they are:
// <option value="Mathematics A">Mathematics A</option>
// <option value="Mathematics B">Mathematics B</option>
content = content.replace(/<option value="Mathematics A">Mathematics A<\/option>\s*<option value="Mathematics B">Mathematics B<\/option>/g, '<option value="Mathematics">Mathematics</option>');

fs.writeFileSync(path, content);
console.log('Fixed Admin.jsx');
