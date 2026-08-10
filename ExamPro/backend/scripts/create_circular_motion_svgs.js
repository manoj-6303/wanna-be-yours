import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pubDir = path.join(__dirname, '..', '..', 'frontend', 'public', 'images');
const qbDir = path.join(__dirname, '..', '..', 'QuestionBank', 'images');

[pubDir, qbDir].forEach(d => {
  if (!fs.existsSync(d)) fs.mkdirSync(d, { recursive: true });
});

function createSvg(content, name) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" style="background:#ffffff">${content}</svg>`;
  fs.writeFileSync(path.join(pubDir, `${name}.svg`), svg);
  fs.writeFileSync(path.join(qbDir, `${name}.svg`), svg);
  console.log('Created SVG:', name);
}

// 1. Circular motion vectors (clean question diagram)
createSvg(`
  <circle cx="300" cy="200" r="120" fill="none" stroke="#64748b" stroke-width="3" stroke-dasharray="6 4"/>
  <circle cx="300" cy="200" r="6" fill="#0f172a"/>
  <circle cx="420" cy="200" r="16" fill="#2563eb"/>
  <path d="M420 200 L420 100 L410 115 M420 100 L430 115" stroke="#16a34a" stroke-width="4" fill="none"/>
  <path d="M420 200 L320 200 L335 190 M320 200 L335 210" stroke="#dc2626" stroke-width="4" fill="none"/>
`, 'circular_motion_vectors');

// 2. Circular motion solution diagram (detailed solution)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Circular Motion Dynamics</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Centripetal Acceleration: a_c = v² / R = ω² R</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Tangential Acceleration: a_t = dv / dt = α R</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Total Acceleration: a_net = √(a_c² + a_t²)</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" fill="#1e3a8a">Vertical Circle: Min speed at top v_top = √(g R)</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#1e3a8a">Min speed at bottom v_bot = √(5 g R)</text>
`, 'circular_motion_solution');

// 3. Banked road (clean question diagram)
createSvg(`
  <polygon points="100,320 500,320 500,200" fill="#e2e8f0" stroke="#475569" stroke-width="4"/>
  <rect x="320" y="220" width="60" height="35" rx="6" fill="#2563eb" transform="rotate(-16 320 220)"/>
  <path d="M300 320 A 80 80 0 0 0 350 295" fill="none" stroke="#0f172a" stroke-width="2"/>
`, 'banked_road');

// 4. Banked road solution diagram (detailed solution)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="170" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Banking of Curved Roads</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Optimum Banking Speed (no friction): v = √(g R tan θ)</text>
  <text x="70" y="180" font-family="sans-serif" font-size="15" fill="#1e293b">Vertical Balance: N cos θ = m g</text>
  <text x="70" y="230" font-family="sans-serif" font-size="15" fill="#1e293b">Centripetal Balance: N sin θ = m v² / R</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#92400e">Max Safe Speed with Friction μ:</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#92400e">v_max = √[ g R (tan θ + μ) / (1 - μ tan θ) ]</text>
`, 'banked_road_solution');
