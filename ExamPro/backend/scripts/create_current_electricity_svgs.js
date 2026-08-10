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

// 1. Wheatstone bridge (clean question diagram)
createSvg(`
  <polygon points="300,80 480,200 300,320 120,200" fill="none" stroke="#0f172a" stroke-width="4"/>
  <circle cx="300" cy="80" r="6" fill="#0f172a"/>
  <circle cx="480" cy="200" r="6" fill="#0f172a"/>
  <circle cx="300" cy="320" r="6" fill="#0f172a"/>
  <circle cx="120" cy="200" r="6" fill="#0f172a"/>
  <line x1="300" y1="80" x2="300" y2="320" stroke="#dc2626" stroke-width="3"/>
  <circle cx="300" cy="200" r="22" fill="#ffffff" stroke="#dc2626" stroke-width="3"/>
  <text x="293" y="207" font-family="sans-serif" font-size="20" font-weight="bold" fill="#dc2626">G</text>
  <path d="M120 200 L50 200 L50 370 L550 370 L550 200 L480 200" fill="none" stroke="#2563eb" stroke-width="3"/>
`, 'wheatstone_bridge');

// 2. Wheatstone solution diagram (detailed solution)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="160" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Wheatstone Bridge &amp; Meter Bridge</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Balance Condition: R1 / R2 = R3 / R4</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Meter Bridge: S = R * (100 - l) / l</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Potentiometer: E1 / E2 = l1 / l2</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#92400e">Internal Resistance via Potentiometer:</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#92400e">r = R * (l1 / l2 - 1)</text>
`, 'wheatstone_solution');

// 3. Potentiometer circuit (clean question diagram)
createSvg(`
  <line x1="80" y1="100" x2="520" y2="100" stroke="#0f172a" stroke-width="6"/>
  <circle cx="80" cy="100" r="8" fill="#2563eb"/>
  <circle cx="520" cy="100" r="8" fill="#2563eb"/>
  <path d="M80 100 L80 220 L260 220" fill="none" stroke="#2563eb" stroke-width="3"/>
  <rect x="260" y="200" width="40" height="40" rx="4" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
  <path d="M300 220 L400 220 L400 115 L390 125 M400 115 L410 125" stroke="#dc2626" stroke-width="3" fill="none"/>
`, 'potentiometer_circuit');

// 4. Potentiometer solution diagram (detailed solution)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="170" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Potentiometer Principles</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Potential Gradient: k = V_AB / L = I * r_wire</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Unknown EMF: E = k * l</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Sensitivity increases when gradient k is small (larger L)</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" fill="#1e3a8a">Temperature Dependence of Resistance:</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#1e3a8a">R(T) = R_0 * (1 + α * ΔT)</text>
`, 'potentiometer_solution');
