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

// 1. Faraday Lenz (clean question diagram)
createSvg(`
  <rect x="350" y="160" width="160" height="80" fill="#dc2626" stroke="#991b1b" stroke-width="2"/>
  <rect x="430" y="160" width="80" height="80" fill="#2563eb" stroke="#1e40af" stroke-width="2"/>
  <text x="380" y="210" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff">N</text>
  <text x="460" y="210" font-family="sans-serif" font-size="28" font-weight="bold" fill="#ffffff">S</text>
  <path d="M330 200 L250 200 L270 185 M250 200 L270 215" stroke="#0f172a" stroke-width="4" fill="none"/>
  <path d="M100 140 C 120 100 180 100 200 140 C 220 180 220 220 200 260 C 180 300 120 300 100 260" fill="none" stroke="#64748b" stroke-width="6"/>
`, 'faraday_lenz');

// 2. Faraday Lenz solution (detailed solution diagram)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="140" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Electromagnetic Induction Laws</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Faraday's Law: E = -N * (dΦ_B / dt)</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Motional EMF: E = B * v * L</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Self Inductance: L = μ₀ * N² * A / l</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" fill="#1e3a8a">Stored Magnetic Energy: U = (1/2) * L * I²</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#1e3a8a">Mutual Inductance: M = k * √(L1 * L2)</text>
`, 'faraday_lenz_solution');

// 3. Motional EMF (clean question diagram)
createSvg(`
  <path d="M100 120 L450 120 M100 280 L450 280 M100 120 L100 280" fill="none" stroke="#475569" stroke-width="5"/>
  <line x1="300" y1="90" x2="300" y2="310" stroke="#dc2626" stroke-width="8"/>
  <path d="M300 200 L380 200 L365 190 M380 200 L365 210" stroke="#2563eb" stroke-width="4" fill="none"/>
  <circle cx="200" cy="160" r="4" fill="#0f172a"/><circle cx="200" cy="240" r="4" fill="#0f172a"/>
  <circle cx="380" cy="160" r="4" fill="#0f172a"/><circle cx="380" cy="240" r="4" fill="#0f172a"/>
`, 'motional_emf');

// 4. Motional EMF solution (detailed solution diagram)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="160" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Motional EMF &amp; Power</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Induced EMF: E = B v L</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Induced Current: I = B v L / R</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">External Pulling Force: F = B² L² v / R</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#92400e">Mechanical Power = Electrical Power:</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#92400e">P = F * v = B² L² v² / R</text>
`, 'motional_emf_solution');

// 5. EM wave propagation (clean question diagram)
createSvg(`
  <line x1="50" y1="200" x2="550" y2="200" stroke="#0f172a" stroke-width="3"/>
  <line x1="100" y1="350" x2="100" y2="50" stroke="#0f172a" stroke-width="3"/>
  <path d="M100 200 Q 175 100 250 200 T 400 200 T 550 200" fill="none" stroke="#2563eb" stroke-width="4"/>
  <path d="M100 200 Q 175 260 250 200 T 400 200 T 550 200" fill="none" stroke="#dc2626" stroke-width="4"/>
`, 'em_wave_propagation');

// 6. EM wave solution (detailed solution diagram)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="160" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Electromagnetic Waves Relations</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Speed of Light: c = 1 / √(μ₀ ε₀) = E₀ / B₀</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Poynting Vector (Energy Flux): S = (1 / μ₀) * (E x B)</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Average Intensity: I = (1/2) * c * ε₀ * E₀²</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" fill="#1e3a8a">Radiation Pressure for Complete Absorption: P = I / c</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#1e3a8a">Radiation Pressure for Total Reflection: P = 2 I / c</text>
`, 'em_wave_solution');

// 7. EM spectrum (clean question diagram)
createSvg(`
  <rect x="50" y="160" width="70" height="80" fill="#eff6ff" stroke="#3b82f6"/><text x="65" y="205" font-family="sans-serif" font-size="12" font-weight="bold">Radio</text>
  <rect x="120" y="160" width="70" height="80" fill="#e0e7ff" stroke="#6366f1"/><text x="130" y="205" font-family="sans-serif" font-size="12" font-weight="bold">Micro</text>
  <rect x="190" y="160" width="70" height="80" fill="#fee2e2" stroke="#ef4444"/><text x="210" y="205" font-family="sans-serif" font-size="12" font-weight="bold">IR</text>
  <rect x="260" y="160" width="70" height="80" fill="#fef3c7" stroke="#f59e0b"/><text x="270" y="205" font-family="sans-serif" font-size="12" font-weight="bold">Visible</text>
  <rect x="330" y="160" width="70" height="80" fill="#f3e8ff" stroke="#a855f7"/><text x="350" y="205" font-family="sans-serif" font-size="12" font-weight="bold">UV</text>
  <rect x="400" y="160" width="70" height="80" fill="#ecfdf5" stroke="#10b981"/><text x="415" y="205" font-family="sans-serif" font-size="12" font-weight="bold">X-Ray</text>
  <rect x="470" y="160" width="70" height="80" fill="#fae8ff" stroke="#d946ef"/><text x="480" y="205" font-family="sans-serif" font-size="12" font-weight="bold">Gamma</text>
`, 'em_spectrum');

// 8. EM spectrum solution (detailed solution diagram)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="170" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">EM Spectrum Classification</text>
  <text x="70" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#3b82f6">Radio Waves: λ &gt; 0.1 m (Broadcasting)</text>
  <text x="70" y="160" font-family="sans-serif" font-size="15" font-weight="bold" fill="#6366f1">Microwaves: 1 mm - 0.1 m (Radar &amp; Ovens)</text>
  <text x="70" y="195" font-family="sans-serif" font-size="15" font-weight="bold" fill="#ef4444">Infrared (IR): 700 nm - 1 mm (Heat sensors)</text>
  <text x="70" y="230" font-family="sans-serif" font-size="15" font-weight="bold" fill="#f59e0b">Visible Light: 400 nm - 700 nm (Human vision)</text>
  <rect x="60" y="260" width="480" height="80" rx="8" fill="#f3e8ff" stroke="#d8b4fe" stroke-width="2"/>
  <text x="80" y="285" font-family="sans-serif" font-size="14" font-weight="bold" fill="#6b21a8">Ultraviolet (UV): 1 nm - 400 nm (Water sterilization)</text>
  <text x="80" y="310" font-family="sans-serif" font-size="14" font-weight="bold" fill="#047857">X-Rays (0.01 nm - 1 nm) | Gamma Rays (&lt; 0.01 nm)</text>
`, 'em_spectrum_solution');
