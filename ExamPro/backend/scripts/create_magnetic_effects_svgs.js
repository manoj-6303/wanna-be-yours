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

// 1. Magnetic Field Loop (question diagram)
createSvg(`
  <!-- Axis Line -->
  <line x1="80" y1="200" x2="520" y2="200" stroke="#94a3b8" stroke-dasharray="6 4" stroke-width="2"/>
  
  <!-- Loop (Ellipse) -->
  <ellipse cx="200" cy="200" rx="30" ry="100" fill="none" stroke="#2563eb" stroke-width="5"/>
  
  <!-- Current arrow on the loop -->
  <path d="M 230 180 L 230 220" stroke="#ef4444" stroke-width="4"/>
  <path d="M 225 210 L 230 220 L 235 210" stroke="#ef4444" stroke-width="4" fill="none"/>
  <text x="245" y="205" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ef4444">I</text>

  <!-- Points and dimensions -->
  <circle cx="200" cy="200" r="5" fill="#0f172a"/>
  <text x="180" y="190" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">O</text>
  
  <line x1="200" y1="200" x2="200" y2="100" stroke="#059669" stroke-width="2"/>
  <text x="180" y="150" font-family="sans-serif" font-size="14" font-weight="bold" fill="#059669">R</text>

  <circle cx="400" cy="200" r="6" fill="#7c3aed"/>
  <text x="395" y="185" font-family="sans-serif" font-size="14" font-weight="bold" fill="#7c3aed">P</text>

  <!-- Distance x -->
  <line x1="200" y1="220" x2="400" y2="220" stroke="#475569" stroke-width="2"/>
  <line x1="200" y1="215" x2="200" y2="225" stroke="#475569" stroke-width="2"/>
  <line x1="400" y1="215" x2="400" y2="225" stroke="#475569" stroke-width="2"/>
  <text x="295" y="245" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569">x</text>
`, 'magnetic_field_loop');

// 2. Magnetic Field Loop Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="120" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Magnetic Field on the Axis of a Circular Loop</text>
  <text x="60" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Field Formula: B = (μ₀ I R²) / (2 (R² + x²)^(3/2))</text>
  <text x="60" y="170" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">At Center (x = 0): B_center = μ₀ I / (2 R)</text>
  <text x="60" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">At large distance (x &gt;&gt; R): B ≈ (μ₀ M) / (2 π x³)</text>
  <rect x="50" y="250" width="500" height="90" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="280" font-family="sans-serif" font-size="14" fill="#1e3a8a">Magnetic Dipole Moment of Loop: M = N I A = N I (π R²)</text>
  <text x="70" y="310" font-family="sans-serif" font-size="14" fill="#1e3a8a">Biot-Savart Law: dB = (μ₀ / 4π) * (I dl x r) / r³</text>
`, 'magnetic_field_loop_solution');

// 3. Moving Charge in Magnetic Field (question diagram)
createSvg(`
  <!-- Uniform Magnetic Field (Crosses represent field into page) -->
  <g stroke="#94a3b8" stroke-width="2">
    <!-- Row 1 -->
    <path d="M 80 80 L 100 100 M 100 80 L 80 100"/>
    <path d="M 180 80 L 200 100 M 200 80 L 180 100"/>
    <path d="M 280 80 L 300 100 M 300 80 L 280 100"/>
    <path d="M 380 80 L 400 100 M 400 80 L 380 100"/>
    <path d="M 480 80 L 500 100 M 500 80 L 480 100"/>
    <!-- Row 2 -->
    <path d="M 80 180 L 100 200 M 100 180 L 80 200"/>
    <path d="M 180 180 L 200 200 M 200 180 L 180 200"/>
    <path d="M 280 180 L 300 200 M 300 180 L 280 200"/>
    <path d="M 380 180 L 400 200 M 400 180 L 380 200"/>
    <path d="M 480 180 L 500 200 M 500 180 L 480 200"/>
    <!-- Row 3 -->
    <path d="M 80 280 L 100 300 M 100 280 L 80 300"/>
    <path d="M 180 280 L 200 300 M 200 280 L 180 300"/>
    <path d="M 280 280 L 300 300 M 300 280 L 280 300"/>
    <path d="M 380 280 L 400 300 M 400 280 L 380 300"/>
    <path d="M 480 280 L 500 300 M 500 280 L 480 300"/>
  </g>
  <text x="520" y="90" font-family="sans-serif" font-size="16" font-weight="bold" fill="#94a3b8">B (inwards)</text>

  <!-- Circular path of charge -->
  <circle cx="290" cy="190" r="80" fill="none" stroke="#2563eb" stroke-dasharray="6 4" stroke-width="3"/>
  
  <!-- Charge particle -->
  <circle cx="290" cy="110" r="10" fill="#ef4444"/>
  <text x="285" y="115" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ffffff">+q</text>
  
  <!-- Velocity Vector -->
  <path d="M 290 110 L 360 110 L 350 105 M 360 110 L 350 115" stroke="#ef4444" stroke-width="3" fill="none"/>
  <text x="370" y="115" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">v</text>

  <!-- Force Vector pointing towards center -->
  <path d="M 290 110 L 290 150 L 285 140 M 290 150 L 295 140" stroke="#059669" stroke-width="3" fill="none"/>
  <text x="300" y="145" font-family="sans-serif" font-size="14" font-weight="bold" fill="#059669">F_m</text>
`, 'moving_charge_field');

// 4. Moving Charge Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="160" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Lorentz Force &amp; Circular Motion</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Magnetic Force: F = q (v x B) | Magnitude: F = q v B sin θ</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Radius of Path (θ = 90°): r = m v / (q B) = √(2 m K) / (q B)</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Time Period &amp; Frequency: T = 2 π m / (q B) | f = q B / (2 π m)</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="14" fill="#78350f">Helical Path (θ ≠ 90°): Pitch p = v_parallel * T = (v cos θ) * T</text>
  <text x="70" y="305" font-family="sans-serif" font-size="14" fill="#78350f">Work done by magnetic force is zero (F ⊥ v), so kinetic energy is constant.</text>
`, 'moving_charge_solution');

// 5. Solenoid & Toroid (question diagram)
createSvg(`
  <!-- Solenoid Tube -->
  <rect x="100" y="150" width="400" height="100" rx="10" fill="none" stroke="#475569" stroke-width="3"/>
  
  <!-- Winding turns -->
  <path d="M 120 150 Q 130 100 140 150 L 140 250 Q 150 300 160 250 L 160 150" fill="none" stroke="#2563eb" stroke-width="4"/>
  <path d="M 180 150 Q 190 100 200 150 L 200 250 Q 210 300 220 250 L 220 150" fill="none" stroke="#2563eb" stroke-width="4"/>
  <path d="M 240 150 Q 250 100 260 150 L 260 250 Q 270 300 280 250 L 280 150" fill="none" stroke="#2563eb" stroke-width="4"/>
  <path d="M 300 150 Q 310 100 320 150 L 320 250 Q 330 300 340 250 L 340 150" fill="none" stroke="#2563eb" stroke-width="4"/>
  <path d="M 360 150 Q 370 100 380 150 L 380 250 Q 390 300 400 250 L 400 150" fill="none" stroke="#2563eb" stroke-width="4"/>
  <path d="M 420 150 Q 430 100 440 150 L 440 250 Q 450 300 460 250 L 460 150" fill="none" stroke="#2563eb" stroke-width="4"/>

  <!-- Core Magnetic Field vector arrow -->
  <path d="M 80 200 L 520 200 M 500 190 L 520 200 L 500 210" stroke="#059669" stroke-width="4" fill="none"/>
  <text x="530" y="205" font-family="sans-serif" font-size="16" font-weight="bold" fill="#059669">B</text>

  <!-- Labels -->
  <text x="110" y="230" font-family="sans-serif" font-size="14" fill="#475569">Solenoid: n turns/length</text>
  <text x="250" y="280" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">Current I</text>
`, 'solenoid_toroid');

// 6. Solenoid & Toroid Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Solenoid &amp; Toroid Fields</text>
  <text x="60" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Field inside long Solenoid: B = μ₀ n I = μ₀ (N / L) I</text>
  <text x="60" y="170" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">At Ends of Solenoid: B_end = ½ μ₀ n I</text>
  <text x="60" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Field inside Toroid: B = μ₀ n I = μ₀ (N / (2 π r)) I</text>
  <rect x="50" y="250" width="500" height="90" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="280" font-family="sans-serif" font-size="14" fill="#1e3a8a">Ampere's Circuital Law: ∮ B · dl = μ₀ I_enclosed</text>
  <text x="70" y="310" font-family="sans-serif" font-size="14" fill="#1e3a8a">Ideal Solenoid: Field outside is completely zero.</text>
`, 'solenoid_toroid_solution');
