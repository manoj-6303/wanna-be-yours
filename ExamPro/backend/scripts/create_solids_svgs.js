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

// 1. Stress-Strain Curve (question diagram)
createSvg(`
  <line x1="80" y1="340" x2="540" y2="340" stroke="#0f172a" stroke-width="3"/>
  <line x1="80" y1="340" x2="80" y2="50" stroke="#0f172a" stroke-width="3"/>
  <text x="500" y="375" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Strain (ε)</text>
  <text x="25" y="45" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Stress (σ)</text>

  <!-- Curve: O -> A -> B -> C -> D -> E -->
  <path d="M 80 340 L 220 160 Q 250 140 280 150 Q 380 100 450 90 Q 490 100 510 140" fill="none" stroke="#2563eb" stroke-width="4"/>
  
  <circle cx="220" cy="160" r="5" fill="#dc2626"/>
  <text x="200" y="145" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">Proportional Limit (A)</text>
  
  <circle cx="250" cy="140" r="5" fill="#16a34a"/>
  <text x="250" y="125" font-family="sans-serif" font-size="12" font-weight="bold" fill="#16a34a">Yield Point (B)</text>
  
  <circle cx="450" cy="90" r="5" fill="#d97706"/>
  <text x="420" y="75" font-family="sans-serif" font-size="12" font-weight="bold" fill="#d97706">Ultimate Strength (D)</text>
  
  <circle cx="510" cy="140" r="5" fill="#7c3aed"/>
  <text x="490" y="160" font-family="sans-serif" font-size="12" font-weight="bold" fill="#7c3aed">Fracture Point (E)</text>

  <line x1="220" y1="160" x2="220" y2="340" stroke="#94a3b8" stroke-dasharray="4"/>
  <line x1="80" y1="160" x2="220" y2="160" stroke="#94a3b8" stroke-dasharray="4"/>
`, 'stress_strain_curve');

// 2. Stress-Strain Solution Diagram
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="150" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Stress-Strain &amp; Hooke's Law</text>
  <text x="60" y="120" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Hooke's Law: Stress = Young's Modulus × Strain (σ = Y × ε)</text>
  <text x="60" y="160" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Slope of Linear Region OA = Young's Modulus (Y = tan θ)</text>
  <text x="60" y="200" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Elastic Strain Energy Density: u = ½ × Stress × Strain = ½ Y ε²</text>
  <rect x="50" y="240" width="500" height="100" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="270" font-family="sans-serif" font-size="14" fill="#1e3a8a">Ductile Material: Large plastic deformation region (B to E)</text>
  <text x="70" y="300" font-family="sans-serif" font-size="14" fill="#1e3a8a">Brittle Material: Fracture point E is close to elastic limit B</text>
`, 'stress_strain_solution');

// 3. Wire Stretching Diagram (question diagram)
createSvg(`
  <rect x="200" y="40" width="200" height="20" fill="#475569" stroke="#1e293b"/>
  <!-- Rigid support lines -->
  <line x1="220" y1="40" x2="200" y2="20" stroke="#475569" stroke-width="2"/>
  <line x1="260" y1="40" x2="240" y2="20" stroke="#475569" stroke-width="2"/>
  <line x1="300" y1="40" x2="280" y2="20" stroke="#475569" stroke-width="2"/>
  <line x1="340" y1="40" x2="320" y2="20" stroke="#475569" stroke-width="2"/>

  <!-- Hanging Wire -->
  <line x1="300" y1="60" x2="300" y2="260" stroke="#2563eb" stroke-width="6"/>
  <line x1="300" y1="260" x2="300" y2="300" stroke="#ef4444" stroke-width="6" stroke-dasharray="4"/>

  <!-- Mass Block -->
  <rect x="260" y="300" width="80" height="50" rx="6" fill="#059669" stroke="#047857" stroke-width="2"/>
  <text x="290" y="330" font-family="sans-serif" font-size="18" font-weight="bold" fill="#ffffff">M</text>

  <!-- Dimension Labels -->
  <line x1="360" y1="60" x2="360" y2="260" stroke="#0f172a" stroke-width="2"/>
  <text x="375" y="165" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">L</text>
  <line x1="360" y1="260" x2="360" y2="300" stroke="#ef4444" stroke-width="2"/>
  <text x="375" y="285" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ef4444">ΔL</text>
`, 'wire_stretching');

// 4. Wire Stretching Solution Diagram
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="150" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Longitudinal Strain &amp; Wire Elongation</text>
  <text x="60" y="120" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Elongation Formula: ΔL = (F × L) / (A × Y) = (M × g × L) / (π r² Y)</text>
  <text x="60" y="160" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Elastic Potential Energy: U = ½ × F × ΔL = (F² L) / (2 A Y)</text>
  <text x="60" y="200" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Thermal Stress (Fixed Rod): σ = Y × α × ΔT</text>
  <rect x="50" y="240" width="500" height="100" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="70" y="270" font-family="sans-serif" font-size="14" fill="#14532d">Work done by gravity = M g ΔL</text>
  <text x="70" y="300" font-family="sans-serif" font-size="14" fill="#14532d">Stored Elastic Energy U = ½ M g ΔL (Half converted to Heat U_heat = ½ M g ΔL)</text>
`, 'wire_stretching_solution');

// 5. Bulk &amp; Shear Modulus Diagram (question diagram)
createSvg(`
  <!-- Cube for Shear Strain -->
  <rect x="100" y="180" width="160" height="140" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>
  <path d="M 100 180 L 140 180 L 300 320 L 260 320 Z" fill="none" stroke="#2563eb" stroke-width="3" stroke-dasharray="4"/>
  <path d="M 180 180 L 260 180 M 245 175 L 260 180 L 245 185" stroke="#dc2626" stroke-width="4" fill="none"/>
  <text x="210" y="165" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">F_tangential</text>
  <text x="110" y="210" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0284c7">θ</text>

  <!-- Sphere for Bulk Hydrostatic Compression -->
  <circle cx="440" cy="230" r="70" fill="#fef3c7" stroke="#d97706" stroke-width="3"/>
  <circle cx="440" cy="230" r="50" fill="none" stroke="#b45309" stroke-width="2" stroke-dasharray="4"/>
  <path d="M 440 140 L 440 165 M 435 155 L 440 165 L 445 155" stroke="#d97706" stroke-width="3" fill="none"/>
  <path d="M 440 320 L 440 295 M 435 305 L 440 295 L 445 305" stroke="#d97706" stroke-width="3" fill="none"/>
  <path d="M 350 230 L 375 230 M 365 225 L 375 230 L 365 235" stroke="#d97706" stroke-width="3" fill="none"/>
  <path d="M 530 230 L 505 230 M 515 225 L 505 230 L 515 235" stroke="#d97706" stroke-width="3" fill="none"/>
  <text x="425" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="#d97706">ΔP</text>
`, 'bulk_shear_modulus');

// 6. Bulk &amp; Shear Solution Diagram
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="140" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Bulk Modulus &amp; Shear Modulus</text>
  <text x="60" y="120" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Bulk Modulus: B = -V (ΔP / ΔV) | Compressibility K = 1 / B</text>
  <text x="60" y="160" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Shear Modulus (Rigidity): η = (F / A) / θ = (F / A) / (x / h)</text>
  <text x="60" y="200" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Poisson's Ratio: σ = - Lateral Strain / Longitudinal Strain = - (Δr/r) / (ΔL/L)</text>
  <rect x="50" y="240" width="500" height="100" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="70" y="270" font-family="sans-serif" font-size="14" fill="#78350f">Theoretical range of Poisson's ratio: -1 ≤ σ ≤ 0.5 (For most solids 0.2 to 0.4)</text>
  <text x="70" y="300" font-family="sans-serif" font-size="14" fill="#78350f">Relation between Y, B, η, σ: Y = 3 B (1 - 2σ) = 2 η (1 + σ)</text>
`, 'bulk_shear_solution');
