import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const physicsDir = path.join(__dirname, '..', '..', 'QuestionBank', 'JeeMains', 'Physics');

function fixAllJsonInDir(dir) {
  const items = fs.readdirSync(dir);
  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      fixAllJsonInDir(fullPath);
    } else if (item.endsWith('.json')) {
      try {
        let content = fs.readFileSync(fullPath, 'utf-8');
        // Test parsing
        JSON.parse(content);
        console.log(`VALID: ${path.relative(physicsDir, fullPath)}`);
      } catch (err) {
        console.log(`FIXING: ${path.relative(physicsDir, fullPath)} - Error was: ${err.message}`);
        let content = fs.readFileSync(fullPath, 'utf-8');
        content = content.replace(/\\+/g, '\\');
        content = content.replace(/\\/g, '\\\\');
        fs.writeFileSync(fullPath, content, 'utf-8');
        try {
          JSON.parse(fs.readFileSync(fullPath, 'utf-8'));
          console.log(`FIXED SUCCESS: ${path.relative(physicsDir, fullPath)}`);
        } catch (err2) {
          console.error(`FAILED FIXING ${path.relative(physicsDir, fullPath)}:`, err2.message);
        }
      }
    }
  }
}

fixAllJsonInDir(physicsDir);
