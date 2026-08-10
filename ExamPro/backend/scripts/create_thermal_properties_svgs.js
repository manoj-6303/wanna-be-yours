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

// 1. Thermometer Scales (question diagram)
createSvg(`
  <!-- Celsius Thermometer -->
  <g transform="translate(100, 50)">
    <rect x="20" y="20" width="20" height="220" rx="10" fill="#f1f5f9" stroke="#0f172a" stroke-width="2"/>
    <circle cx="30" cy="250" r="20" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>
    <rect x="25" y="100" width="10" height="140" fill="#ef4444"/>
    
    <!-- Scale Markings -->
    <line x1="40" y1="50" x2="48" y2="50" stroke="#0f172a" stroke-width="1.5"/>
    <text x="55" y="55" font-family="sans-serif" font-size="12" fill="#0f172a">100°C</text>
    
    <line x1="40" y1="220" x2="48" y2="220" stroke="#0f172a" stroke-width="1.5"/>
    <text x="55" y="225" font-family="sans-serif" font-size="12" fill="#0f172a">0°C</text>
    
    <text x="15" y="295" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Celsius</text>
  </g>

  <!-- Fahrenheit Thermometer -->
  <g transform="translate(250, 50)">
    <rect x="20" y="20" width="20" height="220" rx="10" fill="#f1f5f9" stroke="#0f172a" stroke-width="2"/>
    <circle cx="30" cy="250" r="20" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>
    <rect x="25" y="80" width="10" height="160" fill="#ef4444"/>

    <!-- Scale Markings -->
    <line x1="40" y1="50" x2="48" y2="50" stroke="#0f172a" stroke-width="1.5"/>
    <text x="55" y="55" font-family="sans-serif" font-size="12" fill="#0f172a">212°F</text>
    
    <line x1="40" y1="220" x2="48" y2="220" stroke="#0f172a" stroke-width="1.5"/>
    <text x="55" y="225" font-family="sans-serif" font-size="12" fill="#0f172a">32°F</text>

    <text x="5" y="295" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Fahrenheit</text>
  </g>

  <!-- Kelvin Thermometer -->
  <g transform="translate(400, 50)">
    <rect x="20" y="20" width="20" height="220" rx="10" fill="#f1f5f9" stroke="#0f172a" stroke-width="2"/>
    <circle cx="30" cy="250" r="20" fill="#ef4444" stroke="#0f172a" stroke-width="2"/>
    <rect x="25" y="120" width="10" height="120" fill="#ef4444"/>

    <!-- Scale Markings -->
    <line x1="40" y1="50" x2="48" y2="50" stroke="#0f172a" stroke-width="1.5"/>
    <text x="55" y="55" font-family="sans-serif" font-size="12" fill="#0f172a">373 K</text>
    
    <line x1="40" y1="220" x2="48" y2="220" stroke="#0f172a" stroke-width="1.5"/>
    <text x="55" y="225" font-family="sans-serif" font-size="12" fill="#0f172a">273 K</text>

    <text x="15" y="295" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Kelvin</text>
  </g>
`, 'thermometer_scales');

// 2. Thermometer Scales Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="190" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Temperature Scales Conversion</text>
  <text x="60" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Scale Relation: C/5 = (F - 32)/9 = (K - 273.15)/5</text>
  <text x="60" y="170" font-family="sans-serif" font-size="16" font-weight="bold" fill="#16a34a">Change in temp: ΔT_Celsius = ΔT_Kelvin = 5/9 ΔT_Fahrenheit</text>
  <text x="60" y="215" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">General conversion: (Temp - LFP) / (UFP - LFP) = Constant</text>
  <rect x="50" y="250" width="500" height="90" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="280" font-family="sans-serif" font-size="13" fill="#1e3a8a">LFP: Lower Fixed Point (Ice point) | UFP: Upper Fixed Point (Steam point)</text>
  <text x="70" y="310" font-family="sans-serif" font-size="13" fill="#1e3a8a">Celsius: LFP = 0, UFP = 100 | Fahrenheit: LFP = 32, UFP = 212</text>
`, 'thermometer_scales_solution');

// 3. Thermal Expansion (question diagram)
createSvg(`
  <!-- Original Rod -->
  <rect x="100" y="120" width="300" height="30" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
  <text x="210" y="140" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Length L_0 (at T_0)</text>

  <!-- Expanded Rod -->
  <rect x="100" y="220" width="300" height="30" fill="#cbd5e1" stroke="#475569" stroke-width="2"/>
  <rect x="400" y="220" width="80" height="30" fill="#fee2e2" stroke="#ef4444" stroke-width="2" stroke-dasharray="4 2"/>
  <text x="210" y="240" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Length L_0</text>
  <text x="420" y="240" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ef4444">ΔL</text>

  <!-- Indicators -->
  <line x1="400" y1="210" x2="400" y2="270" stroke="#ef4444" stroke-dasharray="4 2"/>
  <line x1="480" y1="210" x2="480" y2="270" stroke="#ef4444" stroke-dasharray="4 2"/>
  
  <text x="200" y="310" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">At temperature T_0 + ΔT</text>
`, 'thermal_expansion');

// 4. Thermal Expansion Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Thermal Expansion Formulas</text>
  <text x="60" y="120" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Linear Expansion: ΔL = α L_0 ΔT  (L = L_0 (1 + α ΔT))</text>
  <text x="60" y="155" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Area/Areal Expansion: ΔA = β A_0 ΔT  (β ≈ 2α)</text>
  <text x="60" y="190" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Volume Expansion: ΔV = γ V_0 ΔT  (γ ≈ 3α)</text>
  <text x="60" y="225" font-family="sans-serif" font-size="15" font-weight="bold" fill="#7c3aed">Thermal Stress: Stress = Y α ΔT | Force = Y A α ΔT</text>
  <rect x="50" y="255" width="500" height="85" rx="8" fill="#fef2f2" stroke="#fecaca" stroke-width="2"/>
  <text x="70" y="280" font-family="sans-serif" font-size="13" fill="#991b1b">Ratio: α : β : γ = 1 : 2 : 3 (for isotropic solids)</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#991b1b">Volume expansion of liquids: γ_apparent = γ_liquid - γ_vessel</text>
`, 'thermal_expansion_solution');

// 5. Blackbody Radiation (question diagram)
createSvg(`
  <!-- Axis -->
  <line x1="80" y1="50" x2="80" y2="330" stroke="#0f172a" stroke-width="2"/>
  <line x1="80" y1="330" x2="520" y2="330" stroke="#0f172a" stroke-width="2"/>
  <text x="50" y="60" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">E_λ</text>
  <text x="500" y="350" font-family="sans-serif" font-size="13" font-weight="bold" fill="#0f172a">λ</text>

  <!-- Curve 1 (T_1 = 3000 K) -->
  <path d="M 80 330 Q 180 180 240 260 T 480 325" fill="none" stroke="#2563eb" stroke-width="2.5"/>
  <text x="250" y="240" font-family="sans-serif" font-size="12" fill="#2563eb">T_1 = 3000 K</text>

  <!-- Curve 2 (T_2 = 4000 K) -->
  <path d="M 80 330 Q 150 100 210 200 T 480 322" fill="none" stroke="#059669" stroke-width="2.5"/>
  <text x="220" y="170" font-family="sans-serif" font-size="12" fill="#059669">T_2 = 4000 K</text>

  <!-- Curve 3 (T_3 = 5000 K) -->
  <path d="M 80 330 Q 120 40 180 140 T 480 320" fill="none" stroke="#dc2626" stroke-width="2.5"/>
  <text x="190" y="90" font-family="sans-serif" font-size="12" fill="#dc2626">T_3 = 5000 K</text>

  <!-- Dotted lines showing peak shifting -->
  <line x1="140" y1="85" x2="140" y2="330" stroke="#94a3b8" stroke-dasharray="3"/>
  <text x="130" y="345" font-family="sans-serif" font-size="11" fill="#94a3b8">λ_m3</text>
  
  <line x1="165" y1="135" x2="165" y2="330" stroke="#94a3b8" stroke-dasharray="3"/>
  <text x="158" y="345" font-family="sans-serif" font-size="11" fill="#94a3b8">λ_m2</text>

  <line x1="200" y1="210" x2="200" y2="330" stroke="#94a3b8" stroke-dasharray="3"/>
  <text x="192" y="345" font-family="sans-serif" font-size="11" fill="#94a3b8">λ_m1</text>
`, 'blackbody_radiation');

// 6. Blackbody Radiation Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="160" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Blackbody Radiation &amp; Cooling Laws</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Wien's Displacement Law: λ_m T = b  (b ≈ 2.898 * 10^-3 m·K)</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Stefan-Boltzmann Law: E = e σ A T^4  (Net Loss: E_net = e σ A [T^4 - T_s^4])</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Newton's Law of Cooling: dT/dt = - K (T - T_s)</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#fffbef" stroke="#fef3c7" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#78350f">Newton's law approximation: (T_1 - T_2)/t = K [ (T_1 + T_2)/2 - T_s ]</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#78350f">Wien's law explains why peak wavelength decreases as temperature increases.</text>
`, 'blackbody_radiation_solution');
