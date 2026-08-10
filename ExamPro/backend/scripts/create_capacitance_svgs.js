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

// 1. Parallel plate capacitor circuit (clean question diagram)
createSvg(`
  <rect x="150" y="80" width="300" height="240" fill="none" stroke="#0f172a" stroke-width="4"/>
  <line x1="280" y1="80" x2="280" y2="130" stroke="#2563eb" stroke-width="6"/>
  <line x1="320" y1="80" x2="320" y2="130" stroke="#2563eb" stroke-width="6"/>
  <line x1="250" y1="320" x2="250" y2="350" stroke="#0f172a" stroke-width="4"/>
  <line x1="270" y1="310" x2="270" y2="360" stroke="#0f172a" stroke-width="6"/>
  <line x1="290" y1="325" x2="290" y2="345" stroke="#0f172a" stroke-width="4"/>
  <line x1="310" y1="315" x2="310" y2="355" stroke="#0f172a" stroke-width="6"/>
  <line x1="450" y1="170" x2="450" y2="230" stroke="#ef4444" stroke-width="4"/>
  <circle cx="450" cy="170" r="5" fill="#ef4444"/>
  <circle cx="450" cy="230" r="5" fill="#ef4444"/>
`, 'capacitor_circuit');

// 2. Parallel plate capacitor solution diagram (detailed solution)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Capacitor Fundamentals</text>
  <text x="80" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Capacitance: C = (ε₀ A) / d</text>
  <text x="80" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#b91c1c">Charge Stored: Q = C V</text>
  <text x="80" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#059669">Stored Energy: U = ½ C V² = Q² / (2C)</text>
  <rect x="70" y="270" width="460" height="70" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="90" y="300" font-family="sans-serif" font-size="14" fill="#1e3a8a">Series: 1/C_eq = 1/C₁ + 1/C₂</text>
  <text x="90" y="325" font-family="sans-serif" font-size="14" fill="#1e3a8a">Parallel: C_eq = C₁ + C₂</text>
`, 'capacitor_solution');

// 3. Dielectric capacitor (clean question diagram)
createSvg(`
  <line x1="200" y1="100" x2="200" y2="300" stroke="#2563eb" stroke-width="8"/>
  <line x1="400" y1="100" x2="400" y2="300" stroke="#2563eb" stroke-width="8"/>
  <rect x="250" y="110" width="100" height="180" fill="#fed7aa" stroke="#f97316" stroke-width="3" rx="4"/>
  <line x1="100" y1="200" x2="200" y2="200" stroke="#0f172a" stroke-width="4"/>
  <line x1="400" y1="200" x2="500" y2="200" stroke="#0f172a" stroke-width="4"/>
`, 'dielectric_capacitor');

// 4. Dielectric capacitor solution (detailed solution)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="160" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Dielectric Effect (Constant K)</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#c2410c">New Capacitance: C' = K C₀</text>
  <text x="70" y="180" font-family="sans-serif" font-size="15" fill="#1e293b">Battery Connected (V const): Q' = K Q₀,  U' = K U₀</text>
  <text x="70" y="230" font-family="sans-serif" font-size="15" fill="#1e293b">Battery Disconnected (Q const): V' = V₀/K,  U' = U₀/K</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#92400e">Partial Dielectric Slab of thickness t:</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#92400e">C = (ε₀ A) / [ d - t + (t/K) ]</text>
`, 'dielectric_solution');
