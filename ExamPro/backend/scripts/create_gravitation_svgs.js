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

// 1. Planetary Orbit (clean question diagram)
createSvg(`
  <ellipse cx="300" cy="200" rx="220" ry="140" fill="none" stroke="#64748b" stroke-width="3" stroke-dasharray="6 4"/>
  <circle cx="200" cy="200" r="30" fill="#eab308" stroke="#ca8a04" stroke-width="2"/>
  <circle cx="480" cy="140" r="16" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
  <line x1="200" y1="200" x2="480" y2="140" stroke="#94a3b8" stroke-width="2"/>
  <path d="M480 140 L520 100 L505 100 M520 100 L520 115" stroke="#dc2626" stroke-width="3" fill="none"/>
`, 'planetary_orbit');

// 2. Planetary Orbit solution (detailed solution diagram)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="170" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Gravitation &amp; Kepler's Laws</text>
  <text x="70" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Kepler's 3rd Law: T² = (4π² / GM) * a³  (T² ∝ a³)</text>
  <text x="70" y="160" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Gravity at Height h: g(h) = g₀ / (1 + h/R)² ≈ g₀ (1 - 2h/R)</text>
  <text x="70" y="195" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Gravity at Depth d: g(d) = g₀ (1 - d/R)</text>
  <text x="70" y="230" font-family="sans-serif" font-size="15" font-weight="bold" fill="#ca8a04">Escape Velocity: v_e = √(2 G M / R) = √(2 g R)</text>
  <rect x="60" y="260" width="480" height="80" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="80" y="285" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a">Orbital Speed: v_o = √(G M / r) = v_e / √2</text>
  <text x="80" y="310" font-family="sans-serif" font-size="14" fill="#1e3a8a">Geostationary Orbit Height: h ≈ 36,000 km | Period T = 24 hours</text>
`, 'planetary_orbit_solution');

// 3. Satellite Orbit (clean question diagram)
createSvg(`
  <circle cx="300" cy="200" r="90" fill="#3b82f6" stroke="#1d4ed8" stroke-width="3"/>
  <circle cx="300" cy="200" r="180" fill="none" stroke="#94a3b8" stroke-width="3" stroke-dasharray="8 6"/>
  <circle cx="480" cy="200" r="14" fill="#ef4444" stroke="#b91c1c" stroke-width="2"/>
  <line x1="300" y1="200" x2="480" y2="200" stroke="#0f172a" stroke-width="2" stroke-dasharray="4 4"/>
  <path d="M480 200 L480 130 L470 145 M480 130 L490 145" stroke="#16a34a" stroke-width="3" fill="none"/>
`, 'satellite_orbit');

// 4. Satellite Orbit solution (detailed solution diagram)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="170" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Satellite Orbital Energies</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Kinetic Energy: K = (1/2) m v_o² = G M m / (2r)</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Potential Energy: U = -G M m / r</text>
  <text x="70" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Total Energy: E = K + U = -G M m / (2r)</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#92400e">Binding Energy: E_b = -E = G M m / (2r)</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#92400e">Relations: U = -2 K | E = -K = U / 2</text>
`, 'satellite_orbit_solution');
