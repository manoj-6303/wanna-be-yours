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

// 1. Projectile Trajectory (question diagram)
createSvg(`
  <!-- Ground level -->
  <line x1="80" y1="320" x2="520" y2="320" stroke="#0f172a" stroke-width="3"/>
  
  <!-- Trajectory Path -->
  <path d="M 100 320 Q 280 80 460 320" fill="none" stroke="#2563eb" stroke-width="4"/>
  
  <!-- Launch velocity vector -->
  <path d="M 100 320 L 170 215 M 154 228 L 170 215 L 165 236" stroke="#ef4444" stroke-width="3" fill="none"/>
  <text x="180" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ef4444">u</text>

  <!-- Launch Angle theta -->
  <path d="M 140 320 A 40 40 0 0 0 133 273" fill="none" stroke="#0f172a" stroke-width="2"/>
  <text x="150" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">θ</text>

  <!-- Maximum height annotation -->
  <line x1="280" y1="140" x2="280" y2="320" stroke="#059669" stroke-width="2" stroke-dasharray="4"/>
  <line x1="275" y1="140" x2="285" y2="140" stroke="#059669" stroke-width="2"/>
  <text x="255" y="220" font-family="sans-serif" font-size="15" font-weight="bold" fill="#059669">H</text>

  <!-- Range annotation -->
  <line x1="100" y1="340" x2="460" y2="340" stroke="#475569" stroke-width="2"/>
  <line x1="100" y1="335" x2="100" y2="345" stroke="#475569" stroke-width="2"/>
  <line x1="460" y1="335" x2="460" y2="345" stroke="#475569" stroke-width="2"/>
  <text x="275" y="365" font-family="sans-serif" font-size="16" font-weight="bold" fill="#475569">Range (R)</text>
`, 'projectile_trajectory');

// 2. Projectile Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Projectile Motion Equations</text>
  <text x="60" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Time of Flight: T = (2 u sin θ) / g</text>
  <text x="60" y="170" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Maximum Height: H = (u² sin² θ) / 2g</text>
  <text x="60" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Horizontal Range: R = (u² sin 2θ) / g</text>
  <rect x="50" y="250" width="500" height="90" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="280" font-family="sans-serif" font-size="14" fill="#1e3a8a">Trajectory Equation: y = x tan θ - g x² / (2 u² cos² θ)</text>
  <text x="70" y="310" font-family="sans-serif" font-size="14" fill="#1e3a8a">Velocity at highest point: v_x = u cos θ | v_y = 0</text>
`, 'projectile_solution');

// 3. River Crossing (question diagram)
createSvg(`
  <!-- River banks -->
  <line x1="80" y1="100" x2="520" y2="100" stroke="#0284c7" stroke-width="4"/>
  <line x1="80" y1="300" x2="520" y2="300" stroke="#0284c7" stroke-width="4"/>
  <text x="450" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0284c7">Bank B</text>
  <text x="450" y="325" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0284c7">Bank A</text>

  <!-- River Flow -->
  <path d="M 120 180 L 200 180 M 185 175 L 200 180 L 185 185" stroke="#94a3b8" stroke-width="3" fill="none"/>
  <path d="M 320 180 L 400 180 M 385 175 L 400 180 L 385 185" stroke="#94a3b8" stroke-width="3" fill="none"/>
  <text x="350" y="165" font-family="sans-serif" font-size="14" font-weight="bold" fill="#94a3b8">v_river = u</text>

  <!-- Boat vector at angle alpha with bank normal -->
  <path d="M 250 300 L 250 100" stroke="#475569" stroke-width="1.5" stroke-dasharray="4"/>
  <path d="M 250 300 L 180 140 L 194 148 M 180 140 L 182 156" stroke="#ef4444" stroke-width="3.5" fill="none"/>
  <text x="145" y="160" font-family="sans-serif" font-size="15" font-weight="bold" fill="#ef4444">v_boat = v</text>
  
  <path d="M 250 250 A 50 50 0 0 0 228 250" fill="none" stroke="#0f172a" stroke-width="2"/>
  <text x="215" y="235" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">θ</text>

  <!-- Width w -->
  <line x1="60" y1="100" x2="60" y2="300" stroke="#0f172a" stroke-width="2"/>
  <line x1="55" y1="100" x2="65" y2="100" stroke="#0f172a" stroke-width="2"/>
  <line x1="55" y1="300" x2="65" y2="300" stroke="#0f172a" stroke-width="2"/>
  <text x="35" y="205" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">w</text>
`, 'river_crossing');

// 4. River Crossing Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">River Crossing Kinematics</text>
  <text x="60" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Time to cross river: t = w / (v cos θ)</text>
  <text x="60" y="170" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Minimum Time (θ = 0°): t_min = w / v</text>
  <text x="60" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Drift of boat: x = (u - v sin θ) × t</text>
  <rect x="50" y="250" width="500" height="90" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="280" font-family="sans-serif" font-size="14" fill="#1e3a8a">Zero Drift Crossing (v &gt; u): sin θ = u / v</text>
  <text x="70" y="310" font-family="sans-serif" font-size="14" fill="#1e3a8a">Resultant velocity (zero drift): v_res = √(v² - u²)</text>
`, 'river_crossing_solution');

// 5. Circular Kinematics (question diagram)
createSvg(`
  <!-- Circle path -->
  <circle cx="300" cy="200" r="100" fill="none" stroke="#94a3b8" stroke-dasharray="6 4" stroke-width="2"/>
  
  <!-- Center O -->
  <circle cx="300" cy="200" r="5" fill="#0f172a"/>
  <text x="280" y="195" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">O</text>

  <!-- Radius R -->
  <line x1="300" y1="200" x2="386" y2="150" stroke="#475569" stroke-width="2"/>
  <text x="350" y="190" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569">R</text>

  <!-- Particle P -->
  <circle cx="386" cy="150" r="10" fill="#2563eb"/>
  <text x="400" y="145" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">P</text>

  <!-- Centripetal Acceleration (towards center) -->
  <path d="M 386 150 L 325 185 L 340 188 M 325 185 L 333 173" stroke="#059669" stroke-width="3" fill="none"/>
  <text x="315" y="170" font-family="sans-serif" font-size="14" font-weight="bold" fill="#059669">a_c</text>

  <!-- Tangential Velocity -->
  <path d="M 386 150 L 436 236 L 418 226 M 436 236 L 431 217" stroke="#ef4444" stroke-width="3" fill="none"/>
  <text x="445" y="230" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">v</text>
`, 'circular_kinematics');

// 6. Circular Kinematics Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Circular Motion Kinematics</text>
  <text x="60" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Centripetal Acceleration: a_c = v² / R = ω² R</text>
  <text x="60" y="170" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Tangential Acceleration: a_t = dv / dt = α R</text>
  <text x="60" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Net Acceleration: a_net = √(a_c² + a_t²)</text>
  <rect x="50" y="250" width="500" height="90" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="280" font-family="sans-serif" font-size="14" fill="#1e3a8a">Uniform Circular Motion: a_t = 0 | a_net = a_c</text>
  <text x="70" y="310" font-family="sans-serif" font-size="14" fill="#1e3a8a">Angular velocity: ω = v / R | Angular acceleration: α = dω / dt</text>
`, 'circular_kinematics_solution');
