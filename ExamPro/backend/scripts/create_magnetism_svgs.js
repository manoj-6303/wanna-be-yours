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

// 1. Bar Magnet Field (question diagram)
createSvg(`
  <!-- Magnetic field lines (loops around the magnet) -->
  <path d="M 200 200 C 200 120, 400 120, 400 200" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <path d="M 200 200 C 180 80, 420 80, 400 200" fill="none" stroke="#94a3b8" stroke-width="2"/>
  
  <path d="M 200 200 C 200 280, 400 280, 400 200" fill="none" stroke="#94a3b8" stroke-width="2"/>
  <path d="M 200 200 C 180 320, 420 320, 400 200" fill="none" stroke="#94a3b8" stroke-width="2"/>

  <!-- Field arrows -->
  <path d="M 300 150 L 305 150 M 295 145 L 305 150 L 295 155" stroke="#94a3b8" stroke-width="2" fill="none"/>
  <path d="M 300 250 L 305 250 M 295 245 L 305 250 L 295 255" stroke="#94a3b8" stroke-width="2" fill="none"/>

  <!-- Bar Magnet -->
  <rect x="200" y="170" width="100" height="60" fill="#dc2626" stroke="#b91c1c"/>
  <rect x="300" y="170" width="100" height="60" fill="#2563eb" stroke="#1d4ed8"/>
  <text x="240" y="208" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff">S</text>
  <text x="340" y="208" font-family="sans-serif" font-size="20" font-weight="bold" fill="#ffffff">N</text>
  
  <!-- Axis and equatorial lines -->
  <line x1="80" y1="200" x2="520" y2="200" stroke="#475569" stroke-width="1.5" stroke-dasharray="4"/>
  <line x1="300" y1="60" x2="300" y2="340" stroke="#475569" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="500" y="225" font-family="sans-serif" font-size="14" fill="#475569">Axial</text>
  <text x="315" y="80" font-family="sans-serif" font-size="14" fill="#475569">Equatorial</text>
`, 'bar_magnet_field');

// 2. Bar Magnet Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Bar Magnet Properties</text>
  <text x="60" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Axial Field (Short Magnet): B_axial = (μ₀ / 4π) * (2 M / r³)</text>
  <text x="60" y="170" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Equatorial Field (Short Magnet): B_eq = (μ₀ / 4π) * (M / r³)</text>
  <text x="60" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Torque &amp; Potential Energy: τ = M x B | U = - M · B</text>
  <rect x="50" y="250" width="500" height="90" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="280" font-family="sans-serif" font-size="14" fill="#1e3a8a">Magnetic Pole Strength (m): Magnetic Moment M = m * L_eff</text>
  <text x="70" y="310" font-family="sans-serif" font-size="14" fill="#1e3a8a">Oscillating Magnetometer: T = 2 π √(I / (M B))</text>
`, 'bar_magnet_solution');

// 3. Earth Magnetism (question diagram)
createSvg(`
  <!-- Earth globe representation -->
  <circle cx="300" cy="200" r="120" fill="none" stroke="#2563eb" stroke-width="3"/>
  
  <!-- Geographic Axis -->
  <line x1="300" y1="50" x2="300" y2="350" stroke="#475569" stroke-dasharray="6 4" stroke-width="2"/>
  <text x="280" y="45" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569">Geographic N</text>
  
  <!-- Magnetic Axis (declined at ~11.3 degrees) -->
  <line x1="260" y1="55" x2="340" y2="345" stroke="#ef4444" stroke-dasharray="6 4" stroke-width="2"/>
  <text x="200" y="65" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">Magnetic S</text>

  <!-- Angle of Dip Representation -->
  <g transform="translate(480, 200)">
    <line x1="-80" y1="0" x2="80" y2="0" stroke="#0f172a" stroke-width="2"/>
    <text x="40" y="-10" font-family="sans-serif" font-size="12" fill="#0f172a">B_H</text>
    
    <line x1="0" y1="0" x2="0" y2="80" stroke="#0f172a" stroke-width="2"/>
    <text x="-25" y="60" font-family="sans-serif" font-size="12" fill="#0f172a">B_V</text>
    
    <line x1="0" y1="0" x2="60" y2="60" stroke="#ef4444" stroke-width="3"/>
    <text x="65" y="55" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ef4444">B_total</text>
    
    <path d="M 30 0 A 30 30 0 0 1 21 21" fill="none" stroke="#ef4444" stroke-width="2"/>
    <text x="35" y="20" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">θ</text>
  </g>
  <text x="430" y="160" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Magnetic Meridian</text>
`, 'earth_magnetism');

// 4. Earth Magnetism Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Earth's Magnetic Elements</text>
  <text x="60" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Horizontal Component: B_H = B_total × cos θ</text>
  <text x="60" y="170" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Vertical Component: B_V = B_total × sin θ</text>
  <text x="60" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Angle of Dip (θ): tan θ = B_V / B_H | B_total = √(B_H² + B_V²)</text>
  <rect x="50" y="250" width="500" height="90" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="280" font-family="sans-serif" font-size="14" fill="#1e3a8a">Magnetic Declination (α): Angle between geographic &amp; magnetic meridian</text>
  <text x="70" y="310" font-family="sans-serif" font-size="14" fill="#1e3a8a">At Magnetic Poles: θ = 90° (B_H = 0) | At Equator: θ = 0° (B_V = 0)</text>
`, 'earth_magnetism_solution');

// 5. Hysteresis Loop (question diagram)
createSvg(`
  <!-- Axes -->
  <line x1="80" y1="200" x2="520" y2="200" stroke="#0f172a" stroke-width="2"/>
  <line x1="300" y1="60" x2="300" y2="340" stroke="#0f172a" stroke-width="2"/>
  <text x="500" y="225" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">H (A/m)</text>
  <text x="250" y="75" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">B (T)</text>

  <!-- Hysteresis Loop Path -->
  <path d="M 300 200 C 350 140, 420 100, 450 100 C 380 100, 300 130, 300 150 C 300 170, 220 200, 150 300 C 220 300, 300 270, 300 250 C 300 230, 380 200, 450 100" fill="none" stroke="#2563eb" stroke-width="3.5"/>

  <!-- Key Points -->
  <circle cx="300" cy="150" r="5" fill="#dc2626"/>
  <text x="310" y="150" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">Retentivity (a)</text>

  <circle cx="240" cy="200" r="5" fill="#16a34a"/>
  <text x="180" y="190" font-family="sans-serif" font-size="12" font-weight="bold" fill="#16a34a">Coercivity (b)</text>

  <circle cx="450" cy="100" r="5" fill="#d97706"/>
  <text x="420" y="85" font-family="sans-serif" font-size="12" font-weight="bold" fill="#d97706">Saturation (s)</text>
`, 'hysteresis_loop');

// 6. Hysteresis Loop Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="160" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Hysteresis Curve &amp; Magnetic Loss</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Retentivity: Residual magnetism remaining when magnetizing field H = 0</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Coercivity: Demagnetizing field H required to reduce B to zero</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Energy Loss Density: E_loss = ∫ B dH = Area of Hysteresis Loop</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#78350f">Soft Iron: High permeability, low coercivity, low hysteresis loss (for transformer core)</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#78350f">Steel: Low permeability, high coercivity, high retentivity (for permanent magnets)</text>
`, 'hysteresis_loop_solution');
