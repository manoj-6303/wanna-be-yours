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

// 1. Modulation wave (clean question diagram)
createSvg(`
  <path d="M50 100 Q 100 50 150 100 T 250 100 T 350 100 T 450 100 T 550 100" fill="none" stroke="#2563eb" stroke-width="3"/>
  <path d="M50 220 Q 100 170 150 220 T 250 220 T 350 220 T 450 220 T 550 220" fill="none" stroke="#dc2626" stroke-width="2"/>
  <line x1="50" y1="100" x2="550" y2="100" stroke="#94a3b8" stroke-dasharray="4 4"/>
  <line x1="50" y1="220" x2="550" y2="220" stroke="#94a3b8" stroke-dasharray="4 4"/>
  <path d="M50 330 C 100 270 200 390 300 330 C 400 270 500 390 550 330" fill="none" stroke="#16a34a" stroke-width="4"/>
`, 'modulation_waveform');

// 2. Modulation solution diagram (detailed solution)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="160" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Amplitude Modulation (AM)</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Modulation Index: μ = A_m / A_c</text>
  <text x="70" y="170" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">μ = (A_max - A_min) / (A_max + A_min)</text>
  <text x="70" y="220" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Bandwidth = 2 f_m</text>
  <text x="70" y="260" font-family="sans-serif" font-size="15" fill="#1e293b">Sideband Frequencies: USB = f_c + f_m , LSB = f_c - f_m</text>
  <rect x="60" y="285" width="480" height="60" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="80" y="320" font-family="sans-serif" font-size="14" fill="#1e3a8a">Total AM Power: P_total = P_carrier * (1 + μ² / 2)</text>
`, 'modulation_solution');

// 3. Antenna coverage (clean question diagram)
createSvg(`
  <path d="M50 380 A 400 400 0 0 1 550 380" fill="#e2e8f0" stroke="#475569" stroke-width="4"/>
  <line x1="300" y1="260" x2="300" y2="140" stroke="#0f172a" stroke-width="4"/>
  <polygon points="300,140 285,170 315,170" fill="#dc2626"/>
  <line x1="300" y1="140" x2="110" y2="340" stroke="#2563eb" stroke-dasharray="6 4" stroke-width="3"/>
  <line x1="300" y1="140" x2="490" y2="340" stroke="#2563eb" stroke-dasharray="6 4" stroke-width="3"/>
`, 'antenna_coverage');

// 4. Antenna solution diagram (detailed solution)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="150" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Antenna Transmission Range</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Single Antenna Range: d = √(2 R h_T)</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">LOS Range (2 Antennas): d_max = √(2 R h_T) + √(2 R h_R)</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Covered Surface Area: A = π d² = 2 π R h_T</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#92400e">Population Covered:</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#92400e">N = (Population Density) * Area = ρ * (2 π R h_T)</text>
`, 'antenna_solution');
