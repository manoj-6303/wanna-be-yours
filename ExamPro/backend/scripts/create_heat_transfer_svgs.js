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

// 1. Thermal Conduction (clean question diagram)
createSvg(`
  <rect x="50" y="120" width="100" height="160" fill="#ef4444" stroke="#dc2626" stroke-width="2"/>
  <rect x="450" y="120" width="100" height="160" fill="#3b82f6" stroke="#2563eb" stroke-width="2"/>
  <rect x="150" y="160" width="300" height="80" fill="#94a3b8" stroke="#475569" stroke-width="3"/>
  <path d="M180 200 L420 200 L405 190 M420 200 L405 210" stroke="#0f172a" stroke-width="4" fill="none"/>
`, 'thermal_conduction');

// 2. Thermal Conduction solution (detailed solution diagram)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="170" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Thermal Conduction &amp; Resistance</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Heat Current: H = dQ/dt = K * A * (T1 - T2) / L</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Thermal Resistance: R_th = L / (K * A)</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Series Conductors: R_eq = R1 + R2</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" fill="#1e3a8a">Junction Temperature (Series): T_j = (K1 L2 T1 + K2 L1 T2) / (K1 L2 + K2 L1)</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#1e3a8a">Parallel Conductors: 1 / R_eq = 1 / R1 + 1 / R2</text>
`, 'thermal_conduction_solution');

// 3. Blackbody Radiation (clean question diagram)
createSvg(`
  <line x1="80" y1="320" x2="520" y2="320" stroke="#0f172a" stroke-width="3"/>
  <line x1="80" y1="320" x2="80" y2="60" stroke="#0f172a" stroke-width="3"/>
  <path d="M80 320 Q 150 80 220 200 T 500 320" fill="none" stroke="#ef4444" stroke-width="4"/>
  <path d="M80 320 Q 180 140 260 240 T 500 320" fill="none" stroke="#f59e0b" stroke-width="4"/>
  <path d="M80 320 Q 220 200 300 270 T 500 320" fill="none" stroke="#3b82f6" stroke-width="4"/>
`, 'blackbody_radiation');

// 4. Blackbody Radiation solution (detailed solution diagram)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="160" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Thermal Radiation Laws</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Stefan-Boltzmann Law: P = σ * e * A * T⁴</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Net Power Loss: P_net = σ * e * A * (T⁴ - T₀⁴)</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Wien's Displacement Law: λ_m * T = b = 2.898 x 10⁻³ m K</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#92400e">Newton's Law of Cooling:</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#92400e">dT/dt = -K * (T_avg - T₀) | Valid for small temperature difference (T - T₀ &lt;&lt; T₀)</text>
`, 'blackbody_solution');
