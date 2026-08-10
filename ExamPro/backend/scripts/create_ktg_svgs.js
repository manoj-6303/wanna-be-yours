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

// 1. Maxwell Speed Distribution (clean question diagram)
createSvg(`
  <line x1="80" y1="320" x2="520" y2="320" stroke="#0f172a" stroke-width="3"/>
  <line x1="80" y1="320" x2="80" y2="60" stroke="#0f172a" stroke-width="3"/>
  <path d="M80 320 Q 200 80 280 220 T 500 320" fill="none" stroke="#2563eb" stroke-width="4"/>
  <line x1="200" y1="320" x2="200" y2="105" stroke="#dc2626" stroke-dasharray="4 4" stroke-width="2"/>
  <line x1="225" y1="320" x2="225" y2="125" stroke="#16a34a" stroke-dasharray="4 4" stroke-width="2"/>
  <line x1="245" y1="320" x2="245" y2="155" stroke="#ca8a04" stroke-dasharray="4 4" stroke-width="2"/>
`, 'maxwell_speed_distribution');

// 2. Maxwell Speed solution (detailed solution diagram)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="160" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Maxwell-Boltzmann Speeds</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Most Probable Speed: v_mp = √(2 R T / M)</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Average Speed: v_avg = √(8 R T / (π M))</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Root Mean Square Speed: v_rms = √(3 R T / M)</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a">Speed Order: v_mp &lt; v_avg &lt; v_rms</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#1e3a8a">Speed Ratio: v_mp : v_avg : v_rms = 1 : 1.128 : 1.225</text>
`, 'maxwell_speed_solution');

// 3. PV Diagram (clean question diagram)
createSvg(`
  <line x1="80" y1="320" x2="520" y2="320" stroke="#0f172a" stroke-width="3"/>
  <line x1="80" y1="320" x2="80" y2="60" stroke="#0f172a" stroke-width="3"/>
  <path d="M140 100 Q 220 220 450 280" fill="none" stroke="#2563eb" stroke-width="4"/>
  <path d="M140 100 Q 180 250 450 300" fill="none" stroke="#dc2626" stroke-width="4"/>
  <circle cx="140" cy="100" r="6" fill="#0f172a"/>
  <circle cx="450" cy="280" r="6" fill="#0f172a"/>
`, 'pv_diagram');

// 4. PV Diagram solution (detailed solution diagram)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="160" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Kinetic Theory &amp; Gas Laws</text>
  <text x="70" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Internal Energy: U = (f / 2) n R T</text>
  <text x="70" y="160" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Molar Heat Capacities: C_v = (f/2) R | C_p = ((f+2)/2) R</text>
  <text x="70" y="195" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Adiabatic Exponent: γ = C_p / C_v = 1 + 2/f</text>
  <text x="70" y="230" font-family="sans-serif" font-size="15" font-weight="bold" fill="#ca8a04">Mean Free Path: λ = 1 / (√2 n π d²)</text>
  <rect x="60" y="260" width="480" height="80" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="80" y="285" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a">Degrees of Freedom f:</text>
  <text x="80" y="310" font-family="sans-serif" font-size="14" fill="#1e3a8a">Monatomic (He, Ar): f=3 | Diatomic (N₂, O₂): f=5 | Triatomic: f=6</text>
`, 'pv_diagram_solution');
