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

// 1. Work-Energy Theorem Diagram (question diagram)
createSvg(`
  <!-- Title -->
  <text x="130" y="25" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Work-Energy Theorem: F-x Graph</text>

  <!-- Axes -->
  <line x1="80" y1="330" x2="530" y2="330" stroke="#0f172a" stroke-width="2.5"/>
  <line x1="80" y1="330" x2="80" y2="50" stroke="#0f172a" stroke-width="2.5"/>
  <text x="520" y="348" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">x (m)</text>
  <text x="30" y="55" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">F (N)</text>

  <!-- Grid lines -->
  <line x1="80" y1="270" x2="530" y2="270" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="80" y1="210" x2="530" y2="210" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="80" y1="150" x2="530" y2="150" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="80" y1="90" x2="530" y2="90" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="230" y1="50" x2="230" y2="330" stroke="#e2e8f0" stroke-width="1"/>
  <line x1="380" y1="50" x2="380" y2="330" stroke="#e2e8f0" stroke-width="1"/>

  <!-- Axis labels -->
  <text x="73" y="335" font-family="sans-serif" font-size="12" fill="#475569">0</text>
  <text x="224" y="348" font-family="sans-serif" font-size="12" fill="#475569">1</text>
  <text x="374" y="348" font-family="sans-serif" font-size="12" fill="#475569">2</text>
  <text x="490" y="348" font-family="sans-serif" font-size="12" fill="#475569">3</text>
  <text x="60" y="275" font-family="sans-serif" font-size="12" fill="#475569">2</text>
  <text x="60" y="215" font-family="sans-serif" font-size="12" fill="#475569">4</text>
  <text x="60" y="155" font-family="sans-serif" font-size="12" fill="#475569">6</text>
  <text x="60" y="95" font-family="sans-serif" font-size="12" fill="#475569">8</text>

  <!-- F = 4x line (variable force example) -->
  <line x1="80" y1="330" x2="490" y2="90" stroke="#2563eb" stroke-width="3"/>
  <text x="470" y="85" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">F = 4x</text>

  <!-- Shaded area under curve (work done) -->
  <polygon points="80,330 490,90 490,330" fill="#2563eb" opacity="0.15"/>

  <!-- Area label -->
  <text x="260" y="290" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">W = Area</text>
  <text x="255" y="310" font-family="sans-serif" font-size="13" fill="#2563eb">= ½ × base × height</text>

  <!-- Arrow showing work = area -->
  <line x1="350" y1="270" x2="400" y2="240" stroke="#dc2626" stroke-width="1.5" stroke-dasharray="4"/>

  <!-- Constant force example line -->
  <line x1="80" y1="210" x2="490" y2="210" stroke="#059669" stroke-width="2" stroke-dasharray="6"/>
  <text x="390" y="205" font-family="sans-serif" font-size="12" font-weight="bold" fill="#059669">F = const</text>
`, 'work_energy_theorem');

// 2. Work-Energy Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="130" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Work-Energy Key Formulae</text>
  <text x="60" y="115" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Work: W = Fd cosθ = F⃗ · d⃗  (Joules)</text>
  <text x="60" y="150" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Kinetic Energy: KE = ½mv²  = p²/2m</text>
  <text x="60" y="185" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Work-Energy Theorem: W_net = ΔKE</text>
  <text x="60" y="220" font-family="sans-serif" font-size="15" font-weight="bold" fill="#7c3aed">Power: P = W/t = F·v = Fv cosθ  (Watts)</text>
  <rect x="50" y="248" width="500" height="100" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="70" y="278" font-family="sans-serif" font-size="13" fill="#14532d">Variable force: W = ∫F dx  (area under F-x graph)</text>
  <text x="70" y="308" font-family="sans-serif" font-size="13" fill="#14532d">Spring PE: U = ½kx²   |   Gravitational PE: U = mgh</text>
  <text x="70" y="338" font-family="sans-serif" font-size="13" fill="#14532d">Conservative force: F = -dU/dx  (negative gradient of PE)</text>
`, 'work_energy_solution');

// 3. Potential Energy Curve (question diagram)
createSvg(`
  <!-- Title -->
  <text x="130" y="25" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Potential Energy (U) vs Position (x)</text>

  <!-- Axes -->
  <line x1="60" y1="320" x2="560" y2="320" stroke="#0f172a" stroke-width="2.5"/>
  <line x1="60" y1="320" x2="60" y2="40" stroke="#0f172a" stroke-width="2.5"/>
  <text x="545" y="338" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">x</text>
  <text x="20" y="45" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">U(x)</text>

  <!-- PE curve: well shape (double hump) -->
  <path d="M 60 80 Q 120 340 200 200 Q 280 60 360 200 Q 440 340 520 100" fill="none" stroke="#2563eb" stroke-width="3.5"/>

  <!-- Total energy line -->
  <line x1="60" y1="170" x2="560" y2="170" stroke="#dc2626" stroke-width="2.5" stroke-dasharray="8"/>
  <text x="430" y="162" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">E (Total energy)</text>

  <!-- Turning points where E = U -->
  <circle cx="145" cy="170" r="6" fill="#dc2626"/>
  <circle cx="455" cy="170" r="6" fill="#dc2626"/>
  <text x="108" y="163" font-family="sans-serif" font-size="11" fill="#dc2626">TP₁</text>
  <text x="460" y="163" font-family="sans-serif" font-size="11" fill="#dc2626">TP₂</text>

  <!-- Min PE marker -->
  <circle cx="200" cy="200" r="6" fill="#059669"/>
  <line x1="200" y1="200" x2="200" y2="320" stroke="#059669" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="170" y="345" font-family="sans-serif" font-size="12" font-weight="bold" fill="#059669">x₁ (stable eq.)</text>

  <!-- Max PE marker (local max) -->
  <circle cx="280" cy="60" r="6" fill="#f59e0b"/>
  <line x1="280" y1="60" x2="280" y2="320" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="4"/>
  <text x="253" y="345" font-family="sans-serif" font-size="12" font-weight="bold" fill="#f59e0b">x₂ (unstable eq.)</text>

  <!-- KE region indicator -->
  <line x1="200" y1="200" x2="200" y2="170" stroke="#7c3aed" stroke-width="2"/>
  <text x="205" y="190" font-family="sans-serif" font-size="12" font-weight="bold" fill="#7c3aed">KE = E − U</text>

  <!-- Bound region bracket -->
  <path d="M 145 355 L 145 365 L 455 365 L 455 355" fill="none" stroke="#475569" stroke-width="1.5"/>
  <text x="240" y="385" font-family="sans-serif" font-size="12" fill="#475569">Bound (oscillating) region</text>
`, 'potential_energy_curve');

// 4. Potential Energy Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="110" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Potential Energy & Equilibrium</text>
  <text x="60" y="115" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">F = −dU/dx  (force is negative slope of U-x curve)</text>
  <text x="60" y="150" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Stable equilibrium: d²U/dx² &gt; 0  (U is minimum)</text>
  <text x="60" y="185" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Unstable equilibrium: d²U/dx² &lt; 0  (U is maximum)</text>
  <text x="60" y="220" font-family="sans-serif" font-size="15" font-weight="bold" fill="#7c3aed">Neutral equilibrium: d²U/dx² = 0  (U is constant)</text>
  <rect x="50" y="248" width="500" height="100" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="70" y="278" font-family="sans-serif" font-size="13" fill="#78350f">Turning points: where KE = 0  →  U(x) = E_total</text>
  <text x="70" y="308" font-family="sans-serif" font-size="13" fill="#78350f">Max KE at equilibrium (bottom of potential well)</text>
  <text x="70" y="338" font-family="sans-serif" font-size="13" fill="#78350f">Particle bound if E &lt; U_max (cannot escape well)</text>
`, 'potential_energy_solution');

// 5. Energy Conversion Diagram
createSvg(`
  <!-- Title -->
  <text x="150" y="25" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Energy Conversion Examples</text>

  <!-- Hydroelectric: GPE → KE → Electrical -->
  <rect x="30" y="50" width="130" height="55" rx="10" fill="#dbeafe" stroke="#2563eb" stroke-width="2"/>
  <text x="55" y="73" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af">Gravitational</text>
  <text x="65" y="91" font-family="sans-serif" font-size="12" font-weight="bold" fill="#1e40af">PE (water)</text>
  <line x1="160" y1="78" x2="205" y2="78" stroke="#475569" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="163" y="70" font-family="sans-serif" font-size="10" fill="#475569">falls</text>
  <rect x="205" y="50" width="120" height="55" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="230" y="73" font-family="sans-serif" font-size="12" font-weight="bold" fill="#166534">Kinetic</text>
  <text x="222" y="91" font-family="sans-serif" font-size="12" font-weight="bold" fill="#166534">Energy (KE)</text>
  <line x1="325" y1="78" x2="370" y2="78" stroke="#475569" stroke-width="2" marker-end="url(#arr2)"/>
  <text x="330" y="70" font-family="sans-serif" font-size="10" fill="#475569">turbine</text>
  <rect x="370" y="50" width="120" height="55" rx="10" fill="#fef9c3" stroke="#ca8a04" stroke-width="2"/>
  <text x="390" y="73" font-family="sans-serif" font-size="12" font-weight="bold" fill="#713f12">Electrical</text>
  <text x="393" y="91" font-family="sans-serif" font-size="12" font-weight="bold" fill="#713f12">Energy</text>
  <text x="140" y="130" font-family="sans-serif" font-size="11" fill="#475569" font-style="italic">Hydroelectric Power</text>

  <!-- Spring system: EPE → KE -->
  <rect x="30" y="170" width="130" height="55" rx="10" fill="#fce7f3" stroke="#db2777" stroke-width="2"/>
  <text x="48" y="193" font-family="sans-serif" font-size="12" font-weight="bold" fill="#9d174d">Elastic PE</text>
  <text x="42" y="211" font-family="sans-serif" font-size="12" font-weight="bold" fill="#9d174d">(Spring, EPE)</text>
  <line x1="160" y1="198" x2="205" y2="198" stroke="#475569" stroke-width="2"/>
  <text x="162" y="190" font-family="sans-serif" font-size="10" fill="#475569">release</text>
  <rect x="205" y="170" width="120" height="55" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="230" y="193" font-family="sans-serif" font-size="12" font-weight="bold" fill="#166534">Kinetic</text>
  <text x="222" y="211" font-family="sans-serif" font-size="12" font-weight="bold" fill="#166534">Energy (KE)</text>
  <text x="120" y="250" font-family="sans-serif" font-size="11" fill="#475569" font-style="italic">Spring-Block system</text>

  <!-- Friction: KE → Heat -->
  <rect x="30" y="290" width="130" height="55" rx="10" fill="#dcfce7" stroke="#16a34a" stroke-width="2"/>
  <text x="50" y="313" font-family="sans-serif" font-size="12" font-weight="bold" fill="#166534">Kinetic</text>
  <text x="43" y="331" font-family="sans-serif" font-size="12" font-weight="bold" fill="#166534">Energy (KE)</text>
  <line x1="160" y1="318" x2="205" y2="318" stroke="#475569" stroke-width="2"/>
  <text x="157" y="310" font-family="sans-serif" font-size="10" fill="#475569">friction</text>
  <rect x="205" y="290" width="120" height="55" rx="10" fill="#fee2e2" stroke="#dc2626" stroke-width="2"/>
  <text x="230" y="313" font-family="sans-serif" font-size="12" font-weight="bold" fill="#991b1b">Thermal</text>
  <text x="228" y="331" font-family="sans-serif" font-size="12" font-weight="bold" fill="#991b1b">Energy (Heat)</text>
  <text x="120" y="370" font-family="sans-serif" font-size="11" fill="#475569" font-style="italic">Friction dissipation</text>

  <!-- Energy conservation box on right -->
  <rect x="370" y="155" width="200" height="210" rx="12" fill="#f8fafc" stroke="#94a3b8" stroke-width="2"/>
  <text x="400" y="183" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Conservation of</text>
  <text x="415" y="200" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Mechanical Energy</text>
  <text x="385" y="228" font-family="sans-serif" font-size="13" fill="#2563eb">KE + PE = Constant</text>
  <text x="390" y="250" font-family="sans-serif" font-size="12" fill="#475569">(No friction, no</text>
  <text x="385" y="268" font-family="sans-serif" font-size="12" fill="#475569">non-conservative forces)</text>
  <text x="390" y="295" font-family="sans-serif" font-size="13" fill="#dc2626">With friction:</text>
  <text x="385" y="315" font-family="sans-serif" font-size="12" fill="#dc2626">ΔKE + ΔPE = -W_friction</text>
  <text x="390" y="340" font-family="sans-serif" font-size="12" fill="#475569">(Total energy still</text>
  <text x="400" y="355" font-family="sans-serif" font-size="12" fill="#475569">conserved as heat)</text>
`, 'energy_conversion');

console.log('\nAll Work, Power & Energy SVGs created successfully!');
