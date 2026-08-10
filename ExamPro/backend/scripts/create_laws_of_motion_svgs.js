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

// 1. Pulley Block System (question diagram)
createSvg(`
  <!-- Support ceiling -->
  <line x1="200" y1="50" x2="400" y2="50" stroke="#0f172a" stroke-width="4"/>
  <line x1="300" y1="50" x2="300" y2="100" stroke="#475569" stroke-width="3"/>
  
  <!-- Pulley wheel -->
  <circle cx="300" cy="120" r="30" fill="#94a3b8" stroke="#0f172a" stroke-width="3"/>
  <circle cx="300" cy="120" r="6" fill="#0f172a"/>

  <!-- Left block m1 -->
  <line x1="270" y1="120" x2="270" y2="220" stroke="#0f172a" stroke-width="2"/>
  <rect x="240" y="220" width="60" height="60" rx="4" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
  <text x="260" y="255" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff">m_1</text>
  <text x="220" y="180" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569">T</text>
  
  <!-- Right block m2 -->
  <line x1="330" y1="120" x2="330" y2="180" stroke="#0f172a" stroke-width="2"/>
  <rect x="300" y="180" width="60" height="60" rx="4" fill="#dc2626" stroke="#b91c1c" stroke-width="2"/>
  <text x="320" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff">m_2</text>
  <text x="345" y="150" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569">T</text>
`, 'pulley_block_system');

// 2. Pulley Block Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Atwood Machine Mechanics</text>
  <text x="60" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Assume m₁ &gt; m₂</text>
  <text x="60" y="170" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Acceleration: a = (m₁ - m₂) g / (m₁ + m₂)</text>
  <text x="60" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Tension: T = 2 m₁ m₂ g / (m₁ + m₂)</text>
  <rect x="50" y="250" width="500" height="90" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="280" font-family="sans-serif" font-size="14" fill="#1e3a8a">Support Force on Pulley: F_support = 2 T = 4 m₁ m₂ g / (m₁ + m₂)</text>
  <text x="70" y="310" font-family="sans-serif" font-size="14" fill="#1e3a8a">For massless, frictionless pulley and inextensible string.</text>
`, 'pulley_block_solution');

// 3. Inclined Plane Friction (question diagram)
createSvg(`
  <!-- Inclined wedge -->
  <path d="M 100 320 L 450 320 L 450 140 Z" fill="#f1f5f9" stroke="#0f172a" stroke-width="3"/>
  <text x="140" y="310" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">θ</text>

  <!-- Block on incline -->
  <g transform="translate(250, 243) rotate(-27)">
    <rect x="-35" y="-35" width="70" height="70" rx="4" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
    <text x="-12" y="5" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ffffff">m</text>

    <!-- Normal Force -->
    <path d="M 0 -35 L 0 -105 M -6 -90 L 0 -105 L 6 -90" stroke="#059669" stroke-width="3" fill="none"/>
    <text x="12" y="-90" font-family="sans-serif" font-size="15" font-weight="bold" fill="#059669">N</text>

    <!-- Friction Force -->
    <path d="M -35 35 L -105 35 M -90 29 L -105 35 L -90 41" stroke="#dc2626" stroke-width="3" fill="none"/>
    <text x="-100" y="15" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">f_s</text>
  </g>

  <!-- Gravity vector mg -->
  <path d="M 265 200 L 265 300 M 260 285 L 265 300 L 270 285" stroke="#7c3aed" stroke-width="3" fill="none"/>
  <text x="275" y="280" font-family="sans-serif" font-size="15" font-weight="bold" fill="#7c3aed">mg</text>
`, 'inclined_plane_friction');

// 4. Inclined Plane Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Inclined Plane Dynamics</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Normal Force: N = m g cos θ</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Gravity along incline: F_g = m g sin θ</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Limiting Friction: f_max = μ_s N = μ_s m g cos θ</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#fdf2f8" stroke="#fbcfe8" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#9d174d">Angle of Repose (sliding starts): tan θ_c = μ_s</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#9d174d">Acceleration down plane: a = g (sin θ - μ_k cos θ) if θ &gt; θ_c</text>
`, 'inclined_plane_solution');

// 5. Banked Road (question diagram)
createSvg(`
  <!-- Inclined banked surface -->
  <path d="M 80 320 L 480 320 L 480 180 Z" fill="#e2e8f0" stroke="#0f172a" stroke-width="3"/>
  <text x="130" y="310" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">θ</text>

  <!-- Car represented as block -->
  <g transform="translate(280, 250) rotate(-19)">
    <rect x="-40" y="-20" width="80" height="40" rx="4" fill="#0f172a" stroke="#475569" stroke-width="2"/>
    
    <!-- Wheels -->
    <circle cx="-25" cy="20" r="10" fill="#dc2626"/>
    <circle cx="25" cy="20" r="10" fill="#dc2626"/>

    <!-- Normal Force -->
    <path d="M 0 -20 L 0 -85 M -5 -70 L 0 -85 L 5 -70" stroke="#059669" stroke-width="2.5" fill="none"/>
    <text x="10" y="-70" font-family="sans-serif" font-size="14" font-weight="bold" fill="#059669">N</text>
  </g>

  <!-- Centripetal Arrow -->
  <path d="M 280 230 L 180 230 M 195 225 L 180 230 L 195 235" stroke="#ef4444" stroke-width="3" fill="none"/>
  <text x="190" y="215" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">F_c = mv²/R</text>
`, 'banked_road');

// 6. Banked Road Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Banking of Roads Equations</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Optimum speed (no friction): v_0 = √(R g tan θ)</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Maximum safe speed: v_max = √[ R g (μ + tan θ) / (1 - μ tan θ) ]</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Minimum safe speed: v_min = √[ R g (tan θ - μ) / (1 + μ tan θ) ]</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#78350f">N cos θ = mg + f sin θ | N sin θ + f cos θ = mv²/R</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#78350f">Bending of cyclist: tan θ = v² / (R g)</text>
`, 'banked_road_solution');
