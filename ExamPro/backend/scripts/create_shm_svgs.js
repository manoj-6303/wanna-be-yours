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

// 1. Spring-Mass (question diagram)
createSvg(`
  <!-- Rigid Wall -->
  <line x1="80" y1="100" x2="80" y2="300" stroke="#0f172a" stroke-width="4"/>
  <!-- Wall shading -->
  <path d="M 80 110 L 70 120 M 80 150 L 70 160 M 80 190 L 70 200 M 80 230 L 70 240 M 80 270 L 70 280" stroke="#94a3b8" stroke-width="2"/>

  <!-- Horizontal Ground -->
  <line x1="80" y1="260" x2="520" y2="260" stroke="#0f172a" stroke-width="3"/>
  <path d="M 100 260 L 90 270 M 150 260 L 140 270 M 200 260 L 190 270 M 250 260 L 240 270 M 300 260 L 290 270 M 350 260 L 340 270 M 400 260 L 390 270 M 450 260 L 440 270" stroke="#94a3b8" stroke-width="1.5"/>

  <!-- Spring (zigzag line) -->
  <path d="M 80 200 L 120 200 L 135 180 L 150 220 L 165 180 L 180 220 L 195 180 L 210 220 L 225 180 L 240 220 L 255 180 L 270 200 L 310 200" fill="none" stroke="#2563eb" stroke-width="3"/>
  <text x="175" y="150" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">k</text>

  <!-- Mass Block -->
  <rect x="310" y="150" width="100" height="110" fill="#f8fafc" stroke="#334155" stroke-width="4"/>
  <text x="345" y="210" font-family="sans-serif" font-size="20" font-weight="bold" fill="#334155">m</text>

  <!-- Equilibrium and Extension indicators -->
  <line x1="280" y1="260" x2="280" y2="100" stroke="#dc2626" stroke-dasharray="4 4" stroke-width="1.5"/>
  <text x="235" y="90" font-family="sans-serif" font-size="12" fill="#dc2626">Equilibrium (x = 0)</text>

  <!-- Displacement x -->
  <path d="M 280 120 L 360 120" stroke="#059669" stroke-width="2"/>
  <path d="M 350 115 L 360 120 L 350 125" stroke="#059669" stroke-width="2" fill="none"/>
  <text x="315" y="140" font-family="sans-serif" font-size="14" font-weight="bold" fill="#059669">x</text>
`, 'shm_spring_mass');

// 2. Spring-Mass Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="190" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Spring-Mass System Dynamics</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Restoring Force: F = -k x = m a</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Angular Frequency: ω = √(k / m) | T = 2π √(m / k)</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Total Energy: E = ½ k A² = ½ m v_max²</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#14532d">Springs in Series: 1/k_eq = 1/k_1 + 1/k_2</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#14532d">Springs in Parallel: k_eq = k_1 + k_2</text>
`, 'shm_spring_mass_solution');

// 3. Phasor Representation (question diagram)
createSvg(`
  <!-- Reference Circle -->
  <circle cx="300" cy="200" r="120" fill="none" stroke="#475569" stroke-width="2.5"/>
  <line x1="150" y1="200" x2="450" y2="200" stroke="#0f172a" stroke-width="1.5"/>
  <line x1="300" y1="50" x2="300" y2="350" stroke="#0f172a" stroke-width="1.5"/>

  <!-- Rotating Vector -->
  <line x1="300" y1="200" x2="385" y2="115" stroke="#2563eb" stroke-width="3"/>
  <circle cx="385" cy="115" r="5" fill="#2563eb"/>
  <text x="395" y="110" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">P (t)</text>
  
  <!-- Phase Angle -->
  <path d="M 350 200 A 50 50 0 0 0 335 165" fill="none" stroke="#2563eb" stroke-width="2"/>
  <text x="350" y="180" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">ωt + φ</text>

  <!-- Projection on X-axis -->
  <line x1="385" y1="115" x2="385" y2="200" stroke="#dc2626" stroke-dasharray="4 4" stroke-width="1.5"/>
  <circle cx="385" cy="200" r="4" fill="#dc2626"/>
  <text x="380" y="225" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">x</text>

  <!-- Radius A -->
  <text x="325" y="145" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">A</text>
`, 'shm_phasor');

// 4. Phasor Representation Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">SHM Kinematics Equations</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Displacement: x = A sin(ω t + φ)   [or A cos(ω t + φ)]</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Velocity: v = dx/dt = A ω cos(ω t + φ) = ± ω √(A² - x²)</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Acceleration: a = dv/dt = - A ω² sin(ω t + φ) = - ω² x</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#1e3a8a">Phase difference between x and v is π/2.</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#1e3a8a">Phase difference between x and a is π (completely out of phase).</text>
`, 'shm_phasor_solution');

// 5. Simple Pendulum (question diagram)
createSvg(`
  <!-- Ceiling Support -->
  <line x1="200" y1="80" x2="400" y2="80" stroke="#0f172a" stroke-width="4"/>
  <path d="M 220 80 L 210 70 M 270 80 L 260 70 M 320 80 L 310 70 M 370 80 L 360 70" stroke="#94a3b8" stroke-width="2"/>

  <!-- Vertical reference line -->
  <line x1="300" y1="80" x2="300" y2="320" stroke="#64748b" stroke-dasharray="6 4" stroke-width="1.5"/>

  <!-- String of length L -->
  <line x1="300" y1="80" x2="220" y2="280" stroke="#475569" stroke-width="2"/>
  <text x="240" y="170" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569">L</text>

  <!-- Deflection angle θ -->
  <path d="M 300 130 A 50 50 0 0 0 280 128" fill="none" stroke="#2563eb" stroke-width="2"/>
  <text x="285" y="150" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">θ</text>

  <!-- Bob of mass m -->
  <circle cx="220" cy="280" r="18" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/>
  <text x="212" y="286" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">m</text>

  <!-- Force vector (Gravity mg) -->
  <path d="M 220 280 L 220 350 M 215 340 L 220 350 L 225 340" stroke="#dc2626" stroke-width="2" fill="none"/>
  <text x="230" y="340" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">mg</text>
`, 'shm_pendulum');

// 6. Simple Pendulum Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Pendulum Systems Equations</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Simple Pendulum: T = 2π √(L / g) (for small θ &lt;&lt; 10°)</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Seconds Pendulum: Time Period T = 2 seconds (Length ≈ 1 m)</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Physical Pendulum: T = 2π √(I / m g d)</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#fffaf0" stroke="#ffeb3b" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#856404">Torsional Pendulum: T = 2π √(I / C)   [where C is torsional constant]</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#856404">Effective gravity in lift accelerating up: g_eff = g + a</text>
`, 'shm_pendulum_solution');
