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

// 1. Coulomb law (clean question diagram)
createSvg(`
  <line x1="150" y1="200" x2="450" y2="200" stroke="#94a3b8" stroke-dasharray="6 4" stroke-width="3"/>
  <circle cx="150" cy="200" r="30" fill="#2563eb"/>
  <circle cx="450" cy="200" r="30" fill="#dc2626"/>
  <path d="M120 200 L50 200 L65 190 M50 200 L65 210" stroke="#1e293b" stroke-width="4" fill="none"/>
  <path d="M480 200 L550 200 L535 190 M550 200 L535 210" stroke="#1e293b" stroke-width="4" fill="none"/>
`, 'coulomb_law');

// 2. Coulomb solution diagram (detailed solution)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="170" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Coulomb's Law &amp; Electric Field</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Force: F = (1 / 4πε₀) * (q1 * q2 / r²)</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Electric Field: E = (1 / 4πε₀) * (q / r²)</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Electric Potential: V = (1 / 4πε₀) * (q / r)</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" fill="#1e3a8a">Gauss's Law: ∮ E · dA = Q_enclosed / ε₀</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#1e3a8a">Potential Energy: U = q V = (1 / 4πε₀) * (q1 q2 / r)</text>
`, 'coulomb_solution');

// 3. Electric dipole (clean question diagram)
createSvg(`
  <line x1="200" y1="200" x2="400" y2="200" stroke="#0f172a" stroke-width="4"/>
  <circle cx="200" cy="200" r="25" fill="#2563eb"/>
  <text x="193" y="208" font-family="sans-serif" font-size="24" font-weight="bold" fill="#ffffff">-</text>
  <circle cx="400" cy="200" r="25" fill="#dc2626"/>
  <text x="393" y="208" font-family="sans-serif" font-size="24" font-weight="bold" fill="#ffffff">+</text>
  <path d="M200 130 L400 130 L385 120 M400 130 L385 140" stroke="#16a34a" stroke-width="4" fill="none"/>
`, 'electric_dipole');

// 4. Electric dipole solution diagram (detailed solution)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Electric Dipole Properties</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Dipole Moment: p = q * (2a) (from -q to +q)</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Axial Field: E_axial = (1 / 4πε₀) * (2 p / r³)</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Equatorial Field: E_eq = (1 / 4πε₀) * (p / r³)</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#92400e">Torque in Uniform Field E:</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#92400e">τ = p x E = p E sin θ | Potential Energy U = -p · E</text>
`, 'electric_dipole_solution');
