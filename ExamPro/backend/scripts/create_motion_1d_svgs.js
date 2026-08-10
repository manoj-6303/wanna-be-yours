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

// 1. Position Time Graph (question diagram)
createSvg(`
  <!-- Axes -->
  <line x1="80" y1="320" x2="520" y2="320" stroke="#0f172a" stroke-width="3"/>
  <line x1="80" y1="320" x2="80" y2="60" stroke="#0f172a" stroke-width="3"/>
  <text x="500" y="350" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">time (t)</text>
  <text x="35" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">position (x)</text>

  <!-- Curve: O -> A -> B -> C -->
  <path d="M 80 320 L 220 160 L 380 160 L 480 320" fill="none" stroke="#2563eb" stroke-width="4"/>
  
  <!-- Points -->
  <circle cx="220" cy="160" r="5" fill="#dc2626"/>
  <text x="215" y="145" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">A</text>
  
  <circle cx="380" cy="160" r="5" fill="#16a34a"/>
  <text x="375" y="145" font-family="sans-serif" font-size="12" font-weight="bold" fill="#16a34a">B</text>
  
  <circle cx="480" cy="320" r="5" fill="#7c3aed"/>
  <text x="485" y="305" font-family="sans-serif" font-size="12" font-weight="bold" fill="#7c3aed">C</text>

  <!-- Labels -->
  <line x1="220" y1="160" x2="220" y2="320" stroke="#94a3b8" stroke-dasharray="4"/>
  <line x1="380" y1="160" x2="380" y2="320" stroke="#94a3b8" stroke-dasharray="4"/>
  
  <text x="130" y="230" font-family="sans-serif" font-size="14" fill="#2563eb">Region OA</text>
  <text x="280" y="190" font-family="sans-serif" font-size="14" fill="#1e293b">Region AB</text>
  <text x="410" y="230" font-family="sans-serif" font-size="14" fill="#7c3aed">Region BC</text>
`, 'position_time_graph');

// 2. Position Time Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Position-Time (x-t) Graph Analysis</text>
  <text x="60" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Slope of x-t curve = Velocity (v = dx/dt)</text>
  <text x="60" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Region OA: Positive constant slope → Constant positive velocity</text>
  <text x="60" y="220" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Region AB: Zero slope (horizontal line) → Zero velocity (At rest)</text>
  <text x="60" y="260" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Region BC: Negative constant slope → Constant negative velocity</text>
  <rect x="50" y="290" width="500" height="55" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="320" font-family="sans-serif" font-size="14" fill="#1e3a8a">Average Velocity = Total Displacement / Total Time</text>
`, 'position_time_solution');

// 3. Velocity Time Graph (question diagram)
createSvg(`
  <!-- Axes -->
  <line x1="80" y1="320" x2="520" y2="320" stroke="#0f172a" stroke-width="3"/>
  <line x1="80" y1="320" x2="80" y2="60" stroke="#0f172a" stroke-width="3"/>
  <text x="500" y="350" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">time (t)</text>
  <text x="35" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">velocity (v)</text>

  <!-- Curve: O -> A -> B -> C -->
  <path d="M 80 320 L 200 120 L 360 120 L 460 320" fill="none" stroke="#dc2626" stroke-width="4"/>
  
  <!-- Points -->
  <circle cx="200" cy="120" r="5" fill="#2563eb"/>
  <circle cx="360" cy="120" r="5" fill="#2563eb"/>
  
  <line x1="200" y1="120" x2="200" y2="320" stroke="#94a3b8" stroke-dasharray="4"/>
  <line x1="360" y1="120" x2="360" y2="320" stroke="#94a3b8" stroke-dasharray="4"/>

  <!-- Shaded Area for displacement -->
  <path d="M 80 320 L 200 120 L 360 120 L 460 320 Z" fill="#fef2f2" opacity="0.6"/>
  <text x="250" y="220" font-family="sans-serif" font-size="16" font-weight="bold" fill="#b91c1c">Area = Displacement</text>
`, 'velocity_time_graph');

// 4. Velocity Time Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Velocity-Time (v-t) Graph Analysis</text>
  <text x="60" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Slope of v-t curve = Acceleration (a = dv/dt)</text>
  <text x="60" y="175" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Area under v-t curve = Displacement (s = ∫ v dt)</text>
  <text x="60" y="220" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Total Distance = Sum of absolute areas (ignoring sign)</text>
  <rect x="50" y="250" width="500" height="90" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="70" y="280" font-family="sans-serif" font-size="13" fill="#14532d">Straight lines in v-t represent constant acceleration.</text>
  <text x="70" y="310" font-family="sans-serif" font-size="13" fill="#14532d">Horizontal line in v-t represents uniform motion (a = 0).</text>
`, 'velocity_time_solution');

// 5. Vertical Motion under Gravity (question diagram)
createSvg(`
  <!-- Ground level -->
  <line x1="100" y1="350" x2="500" y2="350" stroke="#475569" stroke-width="3"/>

  <!-- Ball thrown up -->
  <circle cx="200" cy="335" r="12" fill="#2563eb"/>
  <path d="M 200 315 L 200 240 M 195 255 L 200 240 L 205 255" stroke="#2563eb" stroke-width="3" fill="none"/>
  <text x="175" y="280" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">u</text>

  <!-- Maximum Height path -->
  <path d="M 220 335 C 260 200, 260 100, 300 100 C 340 100, 340 200, 380 335" fill="none" stroke="#94a3b8" stroke-dasharray="4" stroke-width="2"/>

  <!-- Ball at peak -->
  <circle cx="300" cy="100" r="12" fill="#ef4444"/>
  <text x="293" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">v = 0</text>

  <!-- Acceleration g -->
  <path d="M 420 150 L 420 210 M 415 195 L 420 210 L 425 195" stroke="#ef4444" stroke-width="3" fill="none"/>
  <text x="435" y="185" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ef4444">g</text>

  <!-- Height H label -->
  <line x1="280" y1="100" x2="280" y2="350" stroke="#059669" stroke-width="2"/>
  <line x1="275" y1="100" x2="285" y2="100" stroke="#059669" stroke-width="2"/>
  <line x1="275" y1="350" x2="285" y2="350" stroke="#059669" stroke-width="2"/>
  <text x="250" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#059669">H_max</text>
`, 'vertical_motion');

// 6. Vertical Motion Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Motion Under Gravity Equations</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Maximum Height: H_max = u² / 2g</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Time to reach peak (Ascent): t_a = u / g</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Total Time of Flight: T = 2 u / g = t_ascent + t_descent</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#78350f">Speed at any height h during ascent/descent: v = √(u² - 2gh)</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#78350f">Symmetry: Time of ascent equals time of descent to the same level.</text>
`, 'vertical_motion_solution');
