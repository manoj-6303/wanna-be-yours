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

// 1. Spherical Mirror (question diagram)
createSvg(`
  <!-- Principal Axis -->
  <line x1="50" y1="200" x2="550" y2="200" stroke="#0f172a" stroke-width="2"/>
  <text x="530" y="225" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">X</text>

  <!-- Concave Mirror surface -->
  <path d="M 450 80 Q 480 200 450 320" fill="none" stroke="#475569" stroke-width="6"/>
  <!-- Mirror backing shading -->
  <path d="M 453 85 L 458 90 M 456 125 L 461 130 M 458 165 L 463 170 M 458 205 L 463 210 M 458 245 L 463 250 M 456 285 L 461 290 M 453 315 L 458 320" stroke="#94a3b8" stroke-width="2"/>

  <!-- Center of Curvature C, Focus F -->
  <circle cx="150" cy="200" r="4" fill="#0f172a"/>
  <text x="145" y="225" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">C</text>

  <circle cx="300" cy="200" r="4" fill="#0f172a"/>
  <text x="295" y="225" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">F</text>
  
  <circle cx="450" cy="200" r="4" fill="#0f172a"/>
  <text x="440" y="225" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">P</text>

  <!-- Object at C -->
  <path d="M 150 200 L 150 120" stroke="#2563eb" stroke-width="4"/>
  <path d="M 145 135 L 150 120 L 155 135" stroke="#2563eb" stroke-width="3" fill="none"/>
  <text x="135" y="110" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">Object</text>
`, 'spherical_mirror');

// 2. Spherical Mirror Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="190" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Spherical Mirror Formulas</text>
  <text x="60" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Mirror Equation: 1/v + 1/u = 1/f</text>
  <text x="60" y="170" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Focal Length: f = R / 2</text>
  <text x="60" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Linear Magnification: m = h_i / h_o = - v / u</text>
  <rect x="50" y="250" width="500" height="90" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="280" font-family="sans-serif" font-size="13" fill="#1e3a8a">Sign Convention: Light direction is positive (+).</text>
  <text x="70" y="310" font-family="sans-serif" font-size="13" fill="#1e3a8a">Concave mirror: f &lt; 0 | Convex mirror: f &gt; 0</text>
`, 'spherical_mirror_solution');

// 3. Refraction and Snell's Law (question diagram)
createSvg(`
  <!-- Interface -->
  <line x1="50" y1="200" x2="550" y2="200" stroke="#475569" stroke-width="3"/>
  <line x1="300" y1="50" x2="300" y2="350" stroke="#0f172a" stroke-width="1.5" stroke-dasharray="6 4"/>
  <text x="280" y="75" font-family="sans-serif" font-size="13" fill="#0f172a">Normal</text>

  <!-- Incident Ray -->
  <path d="M 120 70 L 300 200" fill="none" stroke="#2563eb" stroke-width="3"/>
  <path d="M 210 135 L 225 145 M 225 145 L 212 155" stroke="#2563eb" stroke-width="3" fill="none"/>
  
  <!-- Refracted Ray (bending towards normal, moving to denser) -->
  <path d="M 300 200 L 380 340" fill="none" stroke="#dc2626" stroke-width="3"/>
  <path d="M 340 270 L 350 287 M 350 287 L 333 285" stroke="#dc2626" stroke-width="3" fill="none"/>

  <!-- Angles -->
  <path d="M 300 140 A 60 60 0 0 0 250 164" fill="none" stroke="#2563eb" stroke-width="2"/>
  <text x="270" y="130" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">i</text>
  
  <path d="M 300 250 A 50 50 0 0 0 329 249" fill="none" stroke="#dc2626" stroke-width="2"/>
  <text x="315" y="275" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">r</text>

  <!-- Medium labels -->
  <text x="70" y="120" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e293b">Medium 1 (n_1)</text>
  <text x="70" y="280" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e293b">Medium 2 (n_2)</text>
`, 'refraction_snell');

// 4. Refraction and Snell's Law Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Refraction &amp; Snell's Law</text>
  <text x="60" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Snell's Law: n_1 sin i = n_2 sin r</text>
  <text x="60" y="170" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Refractive Index: n = c / v = λ_vacuum / λ_medium</text>
  <text x="60" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Critical Angle (TIR): sin θ_c = n_2 / n_1  (for n_1 &gt; n_2)</text>
  <rect x="50" y="250" width="500" height="90" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="280" font-family="sans-serif" font-size="14" fill="#1e3a8a">Apparent Depth (normal view): h_apparent = h_actual / n</text>
  <text x="70" y="310" font-family="sans-serif" font-size="14" fill="#1e3a8a">Lateral Shift: d = t sin(i - r) / cos r</text>
`, 'refraction_snell_solution');

// 5. Prism Deviation (question diagram)
createSvg(`
  <!-- Triangular Prism -->
  <path d="M 150 320 L 450 320 L 300 100 Z" fill="#eff6ff" stroke="#0f172a" stroke-width="3"/>
  <text x="290" y="130" font-family="sans-serif" font-size="18" font-weight="bold" fill="#0f172a">A</text>

  <!-- Incident Ray -->
  <path d="M 70 280 L 225 212" fill="none" stroke="#2563eb" stroke-width="3"/>
  
  <!-- Ray inside prism -->
  <path d="M 225 212 L 375 212" fill="none" stroke="#059669" stroke-width="3"/>

  <!-- Emergent Ray -->
  <path d="M 375 212 L 530 280" fill="none" stroke="#dc2626" stroke-width="3"/>

  <!-- Angle labels -->
  <text x="135" y="235" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">i</text>
  <text x="445" y="235" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">e</text>
  
  <!-- Normals -->
  <line x1="225" y1="212" x2="280" y2="300" stroke="#475569" stroke-dasharray="3"/>
  <line x1="375" y1="212" x2="320" y2="300" stroke="#475569" stroke-dasharray="3"/>
`, 'prism_deviation');

// 6. Prism Deviation Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Prism Deviation Equations</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Deviation Angle: δ = i + e - A</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Prism Geometry: r_1 + r_2 = A</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Minimum Deviation (i = e): r = A/2 | δ_m = 2i - A</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#78350f">Refractive Index: μ = sin[ (A + δ_m)/2 ] / sin(A/2)</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#78350f">Thin Prism (A &lt;&lt; 10°): δ ≈ (μ - 1) A</text>
`, 'prism_deviation_solution');
