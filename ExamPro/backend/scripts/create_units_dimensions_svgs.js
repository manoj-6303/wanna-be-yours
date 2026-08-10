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

// 1. Vernier Caliper (question diagram)
createSvg(`
  <!-- Main Scale (top) -->
  <rect x="50" y="80" width="500" height="40" fill="#f1f5f9" stroke="#0f172a" stroke-width="2"/>
  
  <!-- Main Scale Markings (every 10 units is 1 cm) -->
  <line x1="100" y1="80" x2="100" y2="105" stroke="#0f172a" stroke-width="2"/>
  <text x="95" y="70" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">0</text>
  
  <line x1="200" y1="80" x2="200" y2="105" stroke="#0f172a" stroke-width="2"/>
  <text x="195" y="70" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">1 cm</text>

  <line x1="300" y1="80" x2="300" y2="105" stroke="#0f172a" stroke-width="2"/>
  <text x="295" y="70" font-family="sans-serif" font-size="12" font-weight="bold" fill="#0f172a">2 cm</text>

  <!-- Sub-divisions (mm) -->
  <line x1="110" y1="80" x2="110" y2="95" stroke="#475569" stroke-width="1"/>
  <line x1="120" y1="80" x2="120" y2="95" stroke="#475569" stroke-width="1"/>
  <line x1="130" y1="80" x2="130" y2="95" stroke="#475569" stroke-width="1"/>
  <line x1="140" y1="80" x2="140" y2="95" stroke="#475569" stroke-width="1"/>
  <line x1="150" y1="80" x2="150" y2="100" stroke="#475569" stroke-width="1.5"/>
  <line x1="160" y1="80" x2="160" y2="95" stroke="#475569" stroke-width="1"/>
  <line x1="170" y1="80" x2="170" y2="95" stroke="#475569" stroke-width="1"/>
  <line x1="180" y1="80" x2="180" y2="95" stroke="#475569" stroke-width="1"/>
  <line x1="190" y1="80" x2="190" y2="95" stroke="#475569" stroke-width="1"/>

  <!-- Vernier Scale (bottom sliding scale) -->
  <rect x="180" y="120" width="180" height="40" fill="#fee2e2" stroke="#ef4444" stroke-width="2"/>
  <text x="190" y="155" font-family="sans-serif" font-size="12" font-weight="bold" fill="#ef4444">Vernier Scale</text>

  <!-- Vernier divisions: 10 divisions spanning 9 mm -->
  <line x1="180" y1="120" x2="180" y2="135" stroke="#ef4444" stroke-width="2"/>
  <text x="175" y="175" font-family="sans-serif" font-size="11" fill="#ef4444">0</text>
  
  <line x1="189" y1="120" x2="189" y2="132" stroke="#ef4444" stroke-width="1"/>
  <line x1="198" y1="120" x2="198" y2="132" stroke="#ef4444" stroke-width="1"/>
  <line x1="207" y1="120" x2="207" y2="132" stroke="#ef4444" stroke-width="1"/>
  <line x1="216" y1="120" x2="216" y2="132" stroke="#ef4444" stroke-width="1"/>
  <line x1="225" y1="120" x2="225" y2="135" stroke="#ef4444" stroke-width="1.5"/>
  
  <!-- Division matching Main scale division (7th vernier matches 24.3 mm or similar) -->
  <line x1="234" y1="120" x2="234" y2="132" stroke="#ef4444" stroke-width="1"/>
  <line x1="243" y1="120" x2="243" y2="132" stroke="#ef4444" stroke-width="1"/>
  <line x1="252" y1="120" x2="252" y2="132" stroke="#ef4444" stroke-width="1"/>
  <line x1="261" y1="120" x2="261" y2="132" stroke="#ef4444" stroke-width="1"/>
  <line x1="270" y1="120" x2="270" y2="135" stroke="#ef4444" stroke-width="2"/>
  <text x="265" y="175" font-family="sans-serif" font-size="11" fill="#ef4444">10</text>
`, 'vernier_caliper');

// 2. Vernier Caliper Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Vernier Caliper reading</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Least Count: LC = 1 MSD - 1 VSD</text>
  <text x="80" y="155" font-family="sans-serif" font-size="14" fill="#334155">If N Vernier divisions match (N-1) Main scale divisions:</text>
  <text x="80" y="180" font-family="sans-serif" font-size="14" fill="#334155">LC = 1 MSD / N  (Typically 0.1 mm for 10 divisions matching 9 mm)</text>
  
  <text x="60" y="220" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Total Reading = MSR + (VSR * LC)</text>
  <rect x="50" y="255" width="500" height="85" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="285" font-family="sans-serif" font-size="13" fill="#1e3a8a">Zero Error: Corrected Reading = Measured Reading - Zero Error</text>
  <text x="70" y="310" font-family="sans-serif" font-size="13" fill="#1e3a8a">Positive zero error: subtract | Negative zero error: add</text>
`, 'vernier_caliper_solution');

// 3. Screw Gauge (question diagram)
createSvg(`
  <!-- Main/Pitch Scale (horizontal sleeve) -->
  <rect x="50" y="150" width="250" height="60" fill="#f1f5f9" stroke="#0f172a" stroke-width="2"/>
  <line x1="50" y1="180" x2="300" y2="180" stroke="#0f172a" stroke-width="2"/>
  <text x="60" y="140" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Pitch/Main Scale</text>

  <!-- Pitch markings (mm) -->
  <line x1="100" y1="170" x2="100" y2="180" stroke="#0f172a" stroke-width="2"/>
  <text x="95" y="165" font-family="sans-serif" font-size="11" fill="#0f172a">0</text>
  
  <line x1="150" y1="170" x2="150" y2="180" stroke="#0f172a" stroke-width="2"/>
  <text x="142" y="165" font-family="sans-serif" font-size="11" fill="#0f172a">5 mm</text>

  <!-- Circular Scale (thimble) -->
  <rect x="300" y="110" width="80" height="140" fill="#fee2e2" stroke="#ef4444" stroke-width="3"/>
  <text x="310" y="100" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">Circular Scale</text>

  <!-- Circular scale markings -->
  <line x1="300" y1="140" x2="315" y2="140" stroke="#ef4444" stroke-width="2"/>
  <text x="325" y="145" font-family="sans-serif" font-size="12" fill="#ef4444">30</text>

  <line x1="300" y1="180" x2="320" y2="180" stroke="#dc2626" stroke-width="2.5"/>
  <text x="325" y="185" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">25 (Coinciding line)</text>

  <line x1="300" y1="220" x2="315" y2="220" stroke="#ef4444" stroke-width="2"/>
  <text x="325" y="225" font-family="sans-serif" font-size="12" fill="#ef4444">20</text>
`, 'screw_gauge');

// 4. Screw Gauge Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="200" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Screw Gauge Reading</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Least Count: LC = Pitch / Number of Circular Divisions</text>
  <text x="80" y="155" font-family="sans-serif" font-size="14" fill="#334155">Pitch = Distance moved in one full rotation (typically 1 mm or 0.5 mm)</text>
  
  <text x="60" y="195" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Total Reading = PSR + (CSR * LC)</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#14532d">PSR: Pitch Scale Reading | CSR: Coinciding Circular Scale Reading</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#14532d">Zero Error correction is identical to vernier calipers.</text>
`, 'screw_gauge_solution');

// 5. Dimensional Analysis (question diagram)
createSvg(`
  <!-- Base Units -->
  <rect x="50" y="120" width="100" height="60" rx="8" fill="#eff6ff" stroke="#3b82f6" stroke-width="2"/>
  <text x="70" y="155" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e3a8a">Base: M, L, T</text>

  <!-- Arrow -->
  <path d="M 150 150 L 250 150 M 235 145 L 250 150 L 235 155" stroke="#475569" stroke-width="2.5" fill="none"/>

  <!-- Derived Quantities -->
  <rect x="250" y="120" width="300" height="180" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="270" y="160" font-family="sans-serif" font-size="15" font-weight="bold" fill="#0f172a">Derived Variables dimensions:</text>
  <text x="270" y="200" font-family="sans-serif" font-size="14" fill="#ef4444">Viscosity [η] = [M L^-1 T^-1]</text>
  <text x="270" y="240" font-family="sans-serif" font-size="14" fill="#059669">Permittivity [ε_0] = [M^-1 L^-3 T^4 I^2]</text>
  <text x="270" y="280" font-family="sans-serif" font-size="14" fill="#2563eb">Permeability [μ_0] = [M L T^-2 I^-2]</text>
`, 'dimensional_analysis');

// 6. Dimensional Analysis Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Dimensions of Key Physical Quantities</text>
  <text x="60" y="125" font-family="sans-serif" font-size="14" fill="#0f172a">Gravitational Constant [G] = [M⁻¹ L³ T⁻²]   (from F = G m_1 m_2 / r²)</text>
  <text x="60" y="160" font-family="sans-serif" font-size="14" fill="#0f172a">Planck's Constant [h] = [M L² T⁻¹]   (from E = h ν)</text>
  <text x="60" y="195" font-family="sans-serif" font-size="14" fill="#0f172a">Stefan-Boltzmann [σ] = [M T⁻³ K⁻⁴]   (from E = σ A T⁴)</text>
  <text x="60" y="230" font-family="sans-serif" font-size="14" fill="#0f172a">Boltzmann Constant [k_B] = [M L² T⁻² K⁻¹]   (from E = 3/2 k_B T)</text>
  <rect x="50" y="260" width="500" height="80" rx="8" fill="#fff5f5" stroke="#feb2b2" stroke-width="2"/>
  <text x="70" y="285" font-family="sans-serif" font-size="13" fill="#742a2a">Error analysis: if Y = A^a B^b / C^c</text>
  <text x="70" y="310" font-family="sans-serif" font-size="13" fill="#742a2a">Maximum relative error: ΔY/Y = a ΔA/A + b ΔB/B + c ΔC/C</text>
`, 'dimensional_analysis_solution');
