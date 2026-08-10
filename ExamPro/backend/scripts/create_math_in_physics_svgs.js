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

// 1. Vector Addition (question diagram)
createSvg(`
  <!-- Vector A -->
  <path d="M 150 300 L 350 300 L 335 295 M 350 300 L 335 305" stroke="#2563eb" stroke-width="4" fill="none"/>
  <text x="240" y="325" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">A</text>

  <!-- Vector B (at angle 60 degrees) -->
  <path d="M 350 300 L 450 127 L 435 137 M 450 127 L 448 143" stroke="#dc2626" stroke-width="4" fill="none"/>
  <text x="415" y="210" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">B</text>

  <!-- Angle theta between A and B -->
  <path d="M 390 300 A 40 40 0 0 0 370 265" fill="none" stroke="#dc2626" stroke-width="2"/>
  <text x="395" y="280" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">θ</text>
  <line x1="350" y1="300" x2="420" y2="300" stroke="#475569" stroke-width="1.5" stroke-dasharray="4"/>

  <!-- Resultant Vector R -->
  <path d="M 150 300 L 450 127 L 433 138 M 450 127 L 441 146" stroke="#059669" stroke-width="4" stroke-dasharray="6 2" fill="none"/>
  <text x="280" y="200" font-family="sans-serif" font-size="18" font-weight="bold" fill="#059669">R = A + B</text>
`, 'vector_addition');

// 2. Vector Addition Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="200" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Vector Addition Laws</text>
  <text x="60" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Resultant Magnitude: R = √(A² + B² + 2 A B cos θ)</text>
  <text x="60" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#059669">Angle of Resultant with A (α): tan α = (B sin θ) / (A + B cos θ)</text>
  <text x="60" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Subtraction: |A - B| = √(A² + B² - 2 A B cos θ)</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" fill="#1e3a8a">Dot Product: A · B = A B cos θ (Scalar)</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#1e3a8a">Cross Product: |A x B| = A B sin θ (Vector perpendicular to both)</text>
`, 'vector_addition_solution');

// 3. Vector Components (question diagram)
createSvg(`
  <!-- Coordinate Axes -->
  <line x1="100" y1="300" x2="480" y2="300" stroke="#0f172a" stroke-width="2"/>
  <line x1="100" y1="300" x2="100" y2="80" stroke="#0f172a" stroke-width="2"/>
  <text x="460" y="325" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">X</text>
  <text x="75" y="90" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Y</text>

  <!-- Vector V -->
  <path d="M 100 300 L 380 120 L 364 123 M 380 120 L 372 136" stroke="#2563eb" stroke-width="4" fill="none"/>
  <text x="240" y="180" font-family="sans-serif" font-size="18" font-weight="bold" fill="#2563eb">A</text>

  <!-- Components -->
  <line x1="380" y1="120" x2="380" y2="300" stroke="#94a3b8" stroke-dasharray="4"/>
  <line x1="100" y1="120" x2="380" y2="120" stroke="#94a3b8" stroke-dasharray="4"/>
  
  <text x="220" y="325" font-family="sans-serif" font-size="15" font-weight="bold" fill="#059669">A_x = A cos θ</text>
  <text x="110" y="200" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">A_y = A sin θ</text>

  <!-- Angle theta -->
  <path d="M 150 300 A 50 50 0 0 0 142 273" fill="none" stroke="#0f172a" stroke-width="2"/>
  <text x="160" y="285" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">θ</text>
`, 'vector_components');

// 4. Vector Components Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Vector Components &amp; Unit Vectors</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Vector Representation: A = A_x î + A_y ĵ + A_z k̂</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Magnitude: |A| = √(A_x² + A_y² + A_z²)</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Unit Vector (Direction): â = A / |A|</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="14" fill="#78350f">Direction Cosines: cos α = A_x/|A|, cos β = A_y/|A|, cos γ = A_z/|A|</text>
  <text x="70" y="305" font-family="sans-serif" font-size="14" fill="#78350f">Sum of squares of direction cosines: cos² α + cos² β + cos² γ = 1</text>
`, 'vector_components_solution');

// 5. Integration Area (question diagram)
createSvg(`
  <!-- Curve -->
  <path d="M 120 280 Q 250 100 450 180" fill="none" stroke="#2563eb" stroke-width="4"/>

  <!-- Shaded Area Under Curve -->
  <path d="M 200 215 L 200 300 L 380 300 L 380 152 Q 250 100 200 215 Z" fill="#eff6ff" stroke="none"/>
  
  <!-- Boundary lines -->
  <line x1="200" y1="215" x2="200" y2="300" stroke="#475569" stroke-width="1.5" stroke-dasharray="4"/>
  <line x1="380" y1="152" x2="380" y2="300" stroke="#475569" stroke-width="1.5" stroke-dasharray="4"/>
  
  <!-- Axes -->
  <line x1="80" y1="300" x2="500" y2="300" stroke="#0f172a" stroke-width="2"/>
  <line x1="80" y1="300" x2="80" y2="60" stroke="#0f172a" stroke-width="2"/>
  <text x="480" y="325" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">x</text>
  <text x="55" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">y = f(x)</text>

  <text x="195" y="325" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">a</text>
  <text x="375" y="325" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">b</text>
  
  <text x="270" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e3a8a">Area = ∫ y dx</text>
`, 'integration_area');

// 6. Integration Area Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="160" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Calculus in Physics: Derivatives &amp; Integrals</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Derivative (Rate of change): dy/dx = tan θ (Slope of tangent)</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Velocity: v = dx/dt | Acceleration: a = dv/dt = d²x/dt²</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Integration (Summation): Area under y-x curve = ∫ y dx</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#14532d">Work done by variable force: W = ∫ F dx</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#14532d">Displacement from velocity: x = ∫ v dt | Velocity from acc: v = ∫ a dt</text>
`, 'integration_area_solution');
