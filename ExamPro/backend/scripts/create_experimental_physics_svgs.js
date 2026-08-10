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

// 1. Vernier Caliper (clean question diagram)
createSvg(`
  <rect x="50" y="160" width="500" height="40" fill="#e2e8f0" stroke="#475569" stroke-width="2"/>
  <rect x="180" y="190" width="160" height="50" fill="#cbd5e1" stroke="#334155" stroke-width="2"/>
  <!-- Main scale ticks -->
  <line x1="100" y1="160" x2="100" y2="180" stroke="#0f172a" stroke-width="2"/>
  <line x1="120" y1="160" x2="120" y2="175" stroke="#0f172a" stroke-width="2"/>
  <line x1="140" y1="160" x2="140" y2="175" stroke="#0f172a" stroke-width="2"/>
  <line x1="160" y1="160" x2="160" y2="175" stroke="#0f172a" stroke-width="2"/>
  <line x1="180" y1="160" x2="180" y2="175" stroke="#0f172a" stroke-width="2"/>
  <line x1="200" y1="160" x2="200" y2="180" stroke="#0f172a" stroke-width="2"/>
  <!-- Vernier scale ticks -->
  <line x1="200" y1="190" x2="200" y2="205" stroke="#dc2626" stroke-width="2"/>
  <line x1="218" y1="190" x2="218" y2="205" stroke="#dc2626" stroke-width="2"/>
  <line x1="236" y1="190" x2="236" y2="205" stroke="#dc2626" stroke-width="2"/>
  <line x1="254" y1="190" x2="254" y2="205" stroke="#dc2626" stroke-width="2"/>
  <line x1="272" y1="190" x2="272" y2="205" stroke="#dc2626" stroke-width="2"/>
`, 'vernier_caliper');

// 2. Vernier Caliper solution (detailed solution diagram)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="170" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Vernier Caliper Measurement</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Least Count: LC = 1 MSD - 1 VSD = (1 MSD) / N</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Observed Reading = MSR + (VSR * LC)</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">True Reading = Observed Reading - (Zero Error)</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" fill="#1e3a8a">Positive Error: Vernier 0 is to the right of Main 0</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#1e3a8a">Negative Error: Vernier 0 is to the left of Main 0</text>
`, 'vernier_caliper_solution');

// 3. Screw Gauge (clean question diagram)
createSvg(`
  <rect x="60" y="180" width="200" height="40" fill="#94a3b8" stroke="#334155" stroke-width="2"/>
  <circle cx="340" cy="200" r="50" fill="#cbd5e1" stroke="#1e293b" stroke-width="3"/>
  <line x1="100" y1="200" x2="260" y2="200" stroke="#0f172a" stroke-width="2"/>
  <line x1="150" y1="190" x2="150" y2="210" stroke="#0f172a" stroke-width="2"/>
  <line x1="200" y1="190" x2="200" y2="210" stroke="#0f172a" stroke-width="2"/>
  <path d="M340 150 L340 250" stroke="#dc2626" stroke-width="3"/>
`, 'screw_gauge');

// 4. Screw Gauge solution (detailed solution diagram)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Screw Gauge Measurement</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Least Count: LC = Pitch / (Total Circular Scale Divisions)</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Observed Reading = PSR + (CSR * LC)</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Corrected Reading = Observed Reading - (Zero Error)</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#92400e">Pitch = Distance moved in one full rotation</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#92400e">Zero Error Correction: Add when negative, subtract when positive</text>
`, 'screw_gauge_solution');
