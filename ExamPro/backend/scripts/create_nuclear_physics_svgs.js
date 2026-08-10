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

// 1. Binding Energy Curve (question diagram)
createSvg(`
  <!-- Axes -->
  <line x1="80" y1="320" x2="520" y2="320" stroke="#0f172a" stroke-width="3"/>
  <line x1="80" y1="320" x2="80" y2="60" stroke="#0f172a" stroke-width="3"/>
  <text x="450" y="350" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Mass Number (A)</text>
  <text x="35" y="50" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">BE / Nucleon (MeV)</text>

  <!-- Curve: rising rapidly, peaks at Fe-56 (around A=56, y=8.8), then drops slowly -->
  <path d="M 85 300 Q 100 120 150 100 T 250 110 T 380 130 T 480 160" fill="none" stroke="#2563eb" stroke-width="4"/>

  <!-- Peak label for Fe-56 -->
  <circle cx="170" cy="101" r="5" fill="#dc2626"/>
  <text x="180" y="95" font-family="sans-serif" font-size="13" font-weight="bold" fill="#dc2626">⁵⁶Fe (8.8 MeV)</text>

  <!-- Fission / Fusion zones -->
  <text x="90" y="240" font-family="sans-serif" font-size="14" fill="#059669" font-weight="bold">Fusion Zone</text>
  <path d="M 90 250 Q 110 250 130 200" fill="none" stroke="#059669" stroke-dasharray="3" stroke-width="2"/>
  
  <text x="380" y="200" font-family="sans-serif" font-size="14" fill="#7c3aed" font-weight="bold">Fission Zone</text>
  <path d="M 400 210 Q 420 210 440 180" fill="none" stroke="#7c3aed" stroke-dasharray="3" stroke-width="2"/>

  <!-- Labels on axes -->
  <text x="75" y="325" font-family="sans-serif" font-size="12">0</text>
  <text x="170" y="335" font-family="sans-serif" font-size="12">56</text>
  <text x="475" y="335" font-family="sans-serif" font-size="12">240</text>

  <text x="50" y="105" font-family="sans-serif" font-size="12">8.8</text>
  <line x1="75" y1="101" x2="85" y2="101" stroke="#0f172a" stroke-width="1.5"/>
`, 'binding_energy_curve');

// 2. Binding Energy Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Binding Energy &amp; Stability</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Mass Defect: Δm = [ Z m_p + (A - Z) m_n ] - M_nucleus</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Binding Energy: E_b = Δm × c² = Δm(in amu) × 931.5 MeV</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Nuclear Stability ∝ Binding Energy per Nucleon (E_b / A)</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#14532d">Light nuclei (A &lt; 30) undergo fusion to gain stability.</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#14532d">Heavy nuclei (A &gt; 170) undergo fission to split into stable fragments.</text>
`, 'binding_energy_solution');

// 3. Radioactive Decay (question diagram)
createSvg(`
  <!-- Axes -->
  <line x1="80" y1="320" x2="520" y2="320" stroke="#0f172a" stroke-width="3"/>
  <line x1="80" y1="320" x2="80" y2="60" stroke="#0f172a" stroke-width="3"/>
  <text x="460" y="350" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Time (t)</text>
  <text x="35" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Nuclei (N)</text>

  <!-- Curve: N_0 at t=0, decays exponentially -->
  <path d="M 80 100 Q 150 250 480 305" fill="none" stroke="#dc2626" stroke-width="4"/>

  <!-- N0 label -->
  <circle cx="80" cy="100" r="5" fill="#2563eb"/>
  <text x="50" y="105" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">N_0</text>

  <!-- N0/2 (half life) -->
  <line x1="80" y1="200" x2="200" y2="200" stroke="#475569" stroke-width="1.5" stroke-dasharray="4"/>
  <line x1="200" y1="200" x2="200" y2="320" stroke="#475569" stroke-width="1.5" stroke-dasharray="4"/>
  <circle cx="200" cy="200" r="5" fill="#16a34a"/>
  
  <text x="40" y="205" font-family="sans-serif" font-size="13" fill="#475569">N_0/2</text>
  <text x="185" y="340" font-family="sans-serif" font-size="13" font-weight="bold" fill="#16a34a">T_1/2</text>
`, 'radioactive_decay');

// 4. Radioactive Decay Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Radioactive Decay Laws</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Decay Equation: N(t) = N_0 e^(-λ t)</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Half-life: T_1/2 = ln(2) / λ ≈ 0.693 / λ</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Mean life: τ = 1 / λ ≈ 1.44 T_1/2</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#fff1f2" stroke="#fecdd3" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#9f1239">Activity: A(t) = -dN/dt = λ N(t) = A_0 e^(-λ t)</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#9f1239">Fraction remaining after n half-lives: N / N_0 = (1/2)^n</text>
`, 'radioactive_decay_solution');

// 5. Nuclear Fission and Fusion (question diagram)
createSvg(`
  <!-- Fission schematic -->
  <g transform="translate(150, 200)">
    <circle cx="0" cy="0" r="30" fill="#f87171" stroke="#dc2626" stroke-width="2"/>
    <text x="-25" y="5" font-family="sans-serif" font-size="12" font-weight="bold" fill="#7f1d1d">Heavy (U)</text>
    
    <!-- Arrows splitting -->
    <path d="M 35 0 L 85 -35 M 72 -33 L 85 -35 L 80 -21" stroke="#475569" stroke-width="2" fill="none"/>
    <path d="M 35 0 L 85 35 M 80 21 L 85 35 L 72 33" stroke="#475569" stroke-width="2" fill="none"/>
    
    <!-- Products -->
    <circle cx="105" cy="-45" r="18" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
    <circle cx="105" cy="45" r="18" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
    <text x="95" y="-70" font-family="sans-serif" font-size="11" fill="#475569">Fragment 1</text>
    <text x="95" y="80" font-family="sans-serif" font-size="11" fill="#475569">Fragment 2</text>
  </g>

  <!-- Fusion schematic -->
  <g transform="translate(420, 200)">
    <!-- Reactants -->
    <circle cx="-50" cy="-35" r="12" fill="#60a5fa" stroke="#2563eb" stroke-width="2"/>
    <circle cx="-50" cy="35" r="12" fill="#60a5fa" stroke="#2563eb" stroke-width="2"/>
    <text x="-80" y="-55" font-family="sans-serif" font-size="11" fill="#475569">Light (H-2)</text>
    <text x="-80" y="60" font-family="sans-serif" font-size="11" fill="#475569">Light (H-3)</text>

    <!-- Arrows merging -->
    <path d="M -35 -25 L 10 -5 M -2 -14 L 10 -5 M 5 -18 L 10 -5" stroke="#475569" stroke-width="2" fill="none"/>
    <path d="M -35 25 L 10 5 M 5 18 L 10 5 M -2 14 L 10 5" stroke="#475569" stroke-width="2" fill="none"/>

    <!-- Product -->
    <circle cx="45" cy="0" r="22" fill="#34d399" stroke="#059669" stroke-width="2"/>
    <text x="30" y="5" font-family="sans-serif" font-size="12" font-weight="bold" fill="#064e3b">He-4</text>
  </g>

  <text x="110" y="70" font-family="sans-serif" font-size="18" font-weight="bold" fill="#dc2626">Nuclear Fission</text>
  <text x="380" y="70" font-family="sans-serif" font-size="18" font-weight="bold" fill="#059669">Nuclear Fusion</text>
`, 'nuclear_fission_fusion');

// 6. Nuclear Fission and Fusion Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="160" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Fission vs Fusion Energy Release</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Q-Value: Q = [ mass_reactants - mass_products ] × 931.5 MeV</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Fission energy release: ~200 MeV per U-235 nucleus</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Fusion energy release: ~24 MeV per He-4 nucleus formed</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#14532d">Fusion has higher energy per unit mass than fission.</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#14532d">Fission proceeds via neutron capture chain reaction (critical mass).</text>
`, 'nuclear_fission_fusion_solution');
