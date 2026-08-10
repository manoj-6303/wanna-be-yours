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

// 1. Transverse Wave (question diagram)
createSvg(`
  <!-- Zero line reference -->
  <line x1="50" y1="200" x2="550" y2="200" stroke="#94a3b8" stroke-dasharray="4 4" stroke-width="1.5"/>

  <!-- Sinusoidal Wave -->
  <path d="M 50 200 C 100 80, 150 80, 200 200 C 250 320, 300 320, 350 200 C 400 80, 450 80, 500 200" fill="none" stroke="#2563eb" stroke-width="4"/>

  <!-- Wave propagation arrow -->
  <path d="M 500 200 L 530 200 M 520 195 L 530 200 L 520 205" stroke="#ef4444" stroke-width="3" fill="none"/>
  <text x="520" y="185" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">v</text>

  <!-- Wavelength lambda indicator -->
  <line x1="200" y1="200" x2="500" y2="200" stroke="#0f172a" stroke-width="2"/>
  <line x1="200" y1="190" x2="200" y2="210" stroke="#0f172a" stroke-width="2"/>
  <line x1="500" y1="190" x2="500" y2="210" stroke="#0f172a" stroke-width="2"/>
  <text x="340" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">λ</text>

  <!-- Amplitude A indicator -->
  <line x1="125" y1="200" x2="125" y2="105" stroke="#059669" stroke-width="2"/>
  <line x1="120" y1="105" x2="130" y2="105" stroke="#059669" stroke-width="2"/>
  <text x="135" y="150" font-family="sans-serif" font-size="16" font-weight="bold" fill="#059669">A</text>
`, 'transverse_wave');

// 2. Transverse Wave Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Wave Propagation Mechanics</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Wave Function: y(x,t) = A sin(k x - ω t + φ)</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Wave Parameters: k = 2π/λ | ω = 2π f | v = f λ = ω/k</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Stretched String Wave Speed: v = √(T / μ)</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#1e3a8a">Particle velocity: v_p = dy/dt = - v · (dy/dx)  (Slope connection)</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#1e3a8a">Wave intensity: I = 2 π² f² A² ρ v</text>
`, 'transverse_wave_solution');

// 3. Organ Pipes (question diagram)
createSvg(`
  <!-- Closed Organ Pipe (left) -->
  <g transform="translate(80, 50)">
    <!-- Pipe body -->
    <line x1="50" y1="50" x2="50" y2="250" stroke="#0f172a" stroke-width="3"/>
    <line x1="120" y1="50" x2="120" y2="250" stroke="#0f172a" stroke-width="3"/>
    <line x1="50" y1="250" x2="120" y2="250" stroke="#0f172a" stroke-width="3"/> <!-- Closed bottom -->
    <text x="45" y="290" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Closed Pipe</text>

    <!-- Fundamental node/antinode wave -->
    <path d="M 50 250 Q 85 150 120 50 M 120 250 Q 85 150 50 50" fill="none" stroke="#2563eb" stroke-width="2" stroke-dasharray="4 2"/>
    <text x="80" y="240" font-family="sans-serif" font-size="12" fill="#2563eb">Node</text>
    <text x="70" y="70" font-family="sans-serif" font-size="12" fill="#2563eb">Antinode</text>
  </g>

  <!-- Open Organ Pipe (right) -->
  <g transform="translate(320, 50)">
    <!-- Pipe body -->
    <line x1="50" y1="50" x2="50" y2="250" stroke="#0f172a" stroke-width="3"/>
    <line x1="120" y1="50" x2="120" y2="250" stroke="#0f172a" stroke-width="3"/>
    <!-- Open bottom -->
    <text x="50" y="290" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Open Pipe</text>

    <!-- Fundamental node/antinode wave -->
    <path d="M 50 50 Q 85 150 50 250 M 120 50 Q 85 150 120 250" fill="none" stroke="#10b981" stroke-width="2" stroke-dasharray="4 2"/>
    <text x="75" y="155" font-family="sans-serif" font-size="12" fill="#10b981">Node</text>
    <text x="70" y="70" font-family="sans-serif" font-size="12" fill="#10b981">Antinode</text>
    <text x="70" y="235" font-family="sans-serif" font-size="12" fill="#10b981">Antinode</text>
  </g>
`, 'organ_pipes');

// 4. Organ Pipes Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Organ Pipes Resonance</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Open Pipe (both ends open): f_n = n (v / 2L)  [n = 1, 2, 3...]</text>
  <text x="80" y="155" font-family="sans-serif" font-size="14" fill="#334155">Fundamental: f_1 = v / 2L | All harmonics are present.</text>
  
  <text x="60" y="195" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Closed Pipe (one end closed): f_n = (2n - 1) (v / 4L)  [n = 1, 2...]</text>
  <text x="80" y="225" font-family="sans-serif" font-size="14" fill="#334155">Fundamental: f_1 = v / 4L | Only odd harmonics are present.</text>

  <rect x="50" y="255" width="500" height="85" rx="8" fill="#fcf6e8" stroke="#fde68a" stroke-width="2"/>
  <text x="70" y="285" font-family="sans-serif" font-size="13" fill="#78350f">End Correction: L_effective = L + 0.6 R (Closed) | L + 1.2 R (Open)</text>
  <text x="70" y="310" font-family="sans-serif" font-size="13" fill="#78350f">Speed of sound in gases (Laplace): v = √(γ P / ρ) = √(γ R T / M)</text>
`, 'organ_pipes_solution');

// 5. Doppler Effect (question diagram)
createSvg(`
  <!-- Moving Source emitting wave-fronts -->
  <circle cx="260" cy="200" r="120" fill="none" stroke="#cbd5e1" stroke-dasharray="4 2"/>
  <circle cx="280" cy="200" r="90" fill="none" stroke="#94a3b8" stroke-dasharray="4 2"/>
  <circle cx="300" cy="200" r="60" fill="none" stroke="#475569"/>
  <circle cx="320" cy="200" r="30" fill="none" stroke="#0f172a" stroke-width="2"/>
  
  <!-- Source point -->
  <circle cx="330" cy="200" r="6" fill="#ef4444"/>
  <text x="325" y="185" font-family="sans-serif" font-size="13" font-weight="bold" fill="#ef4444">Source (v_s)</text>

  <!-- Source velocity arrow -->
  <path d="M 330 200 L 370 200 M 360 195 L 370 200 L 360 205" stroke="#ef4444" stroke-width="2" fill="none"/>

  <!-- Observer (stationary on right) -->
  <g transform="translate(480, 200)">
    <circle cx="0" cy="0" r="10" fill="#2563eb"/>
    <text x="-25" y="-18" font-family="sans-serif" font-size="13" font-weight="bold" fill="#2563eb">Observer (v_o)</text>
  </g>
`, 'doppler_effect');

// 6. Doppler Effect Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="210" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Doppler Effect Laws</text>
  <text x="60" y="125" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Apparent Frequency: f' = f [ (v ± v_o) / (v ∓ v_s) ]</text>
  <text x="60" y="170" font-family="sans-serif" font-size="15" fill="#334155">v = speed of sound in medium | v_s = speed of source | v_o = speed of observer</text>
  <text x="60" y="200" font-family="sans-serif" font-size="15" fill="#334155">Upper signs (+ in numerator, - in denominator) for moving towards.</text>
  <text x="60" y="225" font-family="sans-serif" font-size="15" fill="#334155">Lower signs (- in numerator, + in denominator) for moving away.</text>
  <rect x="50" y="255" width="500" height="85" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="70" y="285" font-family="sans-serif" font-size="13" fill="#14532d">Beats: Beat Frequency f_beat = |f_1 - f_2|</text>
  <text x="70" y="310" font-family="sans-serif" font-size="13" fill="#14532d">Speed of sound relation to temp: v ∝ √T</text>
`, 'doppler_effect_solution');
