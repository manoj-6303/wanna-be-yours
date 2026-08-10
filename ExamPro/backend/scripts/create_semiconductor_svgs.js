import fs from 'fs';
import path from 'url';
import { fileURLToPath } from 'url';

// Wait, the import path is a typo, let's fix it:
import fs2 from 'fs';
import path2 from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path2.dirname(__filename);

const pubDir = path2.join(__dirname, '..', '..', 'frontend', 'public', 'images');
const qbDir = path2.join(__dirname, '..', '..', 'QuestionBank', 'images');

[pubDir, qbDir].forEach(d => {
  if (!fs2.existsSync(d)) fs2.mkdirSync(d, { recursive: true });
});

function createSvg(content, name) {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="400" viewBox="0 0 600 400" style="background:#ffffff">${content}</svg>`;
  fs2.writeFileSync(path2.join(pubDir, `${name}.svg`), svg);
  fs2.writeFileSync(path2.join(qbDir, `${name}.svg`), svg);
  console.log('Created SVG:', name);
}

// 1. Energy Bands (question diagram)
createSvg(`
  <!-- Conduction Band -->
  <rect x="100" y="80" width="160" height="60" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
  <text x="120" y="115" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">Conduction Band</text>
  
  <!-- Valence Band -->
  <rect x="100" y="240" width="160" height="60" fill="#dcfce7" stroke="#22c55e" stroke-width="2"/>
  <text x="130" y="275" font-family="sans-serif" font-size="14" font-weight="bold" fill="#22c55e">Valence Band</text>

  <!-- Energy Gap Eg -->
  <line x1="180" y1="140" x2="180" y2="240" stroke="#0f172a" stroke-width="2"/>
  <line x1="175" y1="140" x2="185" y2="140" stroke="#0f172a" stroke-width="2"/>
  <line x1="175" y1="240" x2="185" y2="240" stroke="#0f172a" stroke-width="2"/>
  <text x="195" y="195" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">Band Gap E_g</text>

  <!-- Insulator vs Semiconductor vs Conductor -->
  <g transform="translate(240, 0)">
    <!-- Conductor (Overlapping) -->
    <rect x="150" y="140" width="160" height="80" fill="#eff6ff" stroke="#3b82f6" stroke-width="2" opacity="0.8"/>
    <text x="190" y="185" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a">Overlapping Bands</text>
    <text x="190" y="245" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a">(Conductors)</text>
  </g>
`, 'energy_bands');

// 2. Energy Bands Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Energy Band Theory</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Insulators: E_g &gt; 3 eV (no conduction at room temp)</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Semiconductors: E_g ≈ 1 eV (Si = 1.1 eV, Ge = 0.7 eV)</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Conductors: E_g = 0 (bands overlap, high conductivity)</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#1e3a8a">n-type Doping: Donor energy level lies just below Conduction Band.</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#1e3a8a">p-type Doping: Acceptor energy level lies just above Valence Band.</text>
`, 'energy_bands_solution');

// 3. Diode Circuits (question diagram)
createSvg(`
  <!-- Diode Symbol P-N -->
  <g transform="translate(180, 200)">
    <line x1="-50" y1="0" x2="50" y2="0" stroke="#0f172a" stroke-width="3"/>
    <polygon points="-15,-20 -15,20 15,0" fill="#2563eb" stroke="#1d4ed8" stroke-width="2"/>
    <line x1="15" y1="-20" x2="15" y2="20" stroke="#0f172a" stroke-width="4"/>
    <text x="-35" y="-30" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">p</text>
    <text x="25" y="-30" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">n</text>
  </g>

  <!-- External battery (Forward Bias) -->
  <line x1="130" y1="200" x2="130" y2="300" stroke="#0f172a" stroke-width="2"/>
  <line x1="230" y1="200" x2="230" y2="300" stroke="#0f172a" stroke-width="2"/>
  
  <line x1="130" y1="300" x2="170" y2="300" stroke="#0f172a" stroke-width="2"/>
  <line x1="190" y1="300" x2="230" y2="300" stroke="#0f172a" stroke-width="2"/>

  <!-- Battery cells (+ / -) -->
  <line x1="170" y1="280" x2="170" y2="320" stroke="#059669" stroke-width="4"/>
  <line x1="175" y1="290" x2="175" y2="310" stroke="#0f172a" stroke-width="2"/>
  <line x1="180" y1="280" x2="180" y2="320" stroke="#0f172a" stroke-width="4"/>
  <line x1="185" y1="290" x2="185" y2="310" stroke="#dc2626" stroke-width="2"/>

  <text x="155" y="270" font-family="sans-serif" font-size="14" font-weight="bold" fill="#059669">+</text>
  <text x="190" y="270" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">-</text>

  <!-- Text label -->
  <text x="120" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">P-N Junction Biasing Circuit</text>
`, 'diode_circuits');

// 4. Diode Circuits Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Diode Biasing Characteristics</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Forward Bias: p connected to (+), n connected to (-)</text>
  <text x="80" y="155" font-family="sans-serif" font-size="14" fill="#334155">Depletion layer width decreases. Resistance is very low.</text>
  
  <text x="60" y="195" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Reverse Bias: p connected to (-), n connected to (+)</text>
  <text x="80" y="225" font-family="sans-serif" font-size="14" fill="#334155">Depletion layer width increases. Resistance is extremely high.</text>

  <rect x="50" y="255" width="500" height="85" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="70" y="285" font-family="sans-serif" font-size="13" fill="#78350f">Ideal Diode: Forward bias = short circuit (zero resistance).</text>
  <text x="70" y="310" font-family="sans-serif" font-size="13" fill="#78350f">Ideal Diode: Reverse bias = open circuit (infinite resistance).</text>
`, 'diode_circuits_solution');

// 5. Logic Gates (question diagram)
createSvg(`
  <!-- AND Gate -->
  <g transform="translate(100, 120)">
    <path d="M -30 -20 L 0 -20 A 20 20 0 0 1 20 0 A 20 20 0 0 1 0 20 L -30 20 Z" fill="#eff6ff" stroke="#3b82f6" stroke-width="3"/>
    <line x1="-50" y1="-10" x2="-30" y2="-10" stroke="#0f172a" stroke-width="2"/>
    <line x1="-50" y1="10" x2="-30" y2="10" stroke="#0f172a" stroke-width="2"/>
    <line x1="20" y1="0" x2="40" y2="0" stroke="#0f172a" stroke-width="2"/>
    <text x="-15" y="5" font-family="sans-serif" font-size="14" font-weight="bold" fill="#1e3a8a">AND</text>
  </g>

  <!-- OR Gate -->
  <g transform="translate(320, 120)">
    <path d="M -30 -20 Q -10 -20 0 -20 Q 15 -10 25 0 Q 15 10 0 20 Q -10 20 -30 20 Q -20 0 -30 -20 Z" fill="#ecfdf5" stroke="#10b981" stroke-width="3"/>
    <line x1="-50" y1="-10" x2="-23" y2="-10" stroke="#0f172a" stroke-width="2"/>
    <line x1="-50" y1="10" x2="-23" y2="10" stroke="#0f172a" stroke-width="2"/>
    <line x1="25" y1="0" x2="45" y2="0" stroke="#0f172a" stroke-width="2"/>
    <text x="-10" y="5" font-family="sans-serif" font-size="14" font-weight="bold" fill="#064e3b">OR</text>
  </g>

  <!-- NAND Gate -->
  <g transform="translate(100, 260)">
    <path d="M -30 -20 L 0 -20 A 20 20 0 0 1 20 0 A 20 20 0 0 1 0 20 L -30 20 Z" fill="#fff5f5" stroke="#f87171" stroke-width="3"/>
    <circle cx="25" cy="0" r="5" fill="#ffffff" stroke="#f87171" stroke-width="2"/>
    <line x1="-50" y1="-10" x2="-30" y2="-10" stroke="#0f172a" stroke-width="2"/>
    <line x1="-50" y1="10" x2="-30" y2="10" stroke="#0f172a" stroke-width="2"/>
    <line x1="30" y1="0" x2="50" y2="0" stroke="#0f172a" stroke-width="2"/>
    <text x="-18" y="5" font-family="sans-serif" font-size="12" font-weight="bold" fill="#7f1d1d">NAND</text>
  </g>

  <!-- NOR Gate -->
  <g transform="translate(320, 260)">
    <path d="M -30 -20 Q -10 -20 0 -20 Q 15 -10 25 0 Q 15 10 0 20 Q -10 20 -30 20 Q -20 0 -30 -20 Z" fill="#fdf2f8" stroke="#ec4899" stroke-width="3"/>
    <circle cx="30" cy="0" r="5" fill="#ffffff" stroke="#ec4899" stroke-width="2"/>
    <line x1="-50" y1="-10" x2="-23" y2="-10" stroke="#0f172a" stroke-width="2"/>
    <line x1="-50" y1="10" x2="-23" y2="10" stroke="#0f172a" stroke-width="2"/>
    <line x1="35" y1="0" x2="55" y2="0" stroke="#0f172a" stroke-width="2"/>
    <text x="-15" y="5" font-family="sans-serif" font-size="12" font-weight="bold" fill="#9d174d">NOR</text>
  </g>
`, 'logic_gates');

// 6. Logic Gates Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="210" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Boolean Operations</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">AND: Y = A · B (1 only if both are 1)</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">OR: Y = A + B (1 if at least one is 1)</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">NAND: Y = A · B (inverted AND, universal gate)</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#f5f3ff" stroke="#ddd6fe" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#5b21b6">NOR: Y = A + B (inverted OR, universal gate)</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#5b21b6">De Morgan's Laws: A · B = A + B   |   A + B = A · B</text>
`, 'logic_gates_solution');
