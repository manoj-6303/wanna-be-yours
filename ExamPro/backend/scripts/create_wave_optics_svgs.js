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

// 1. YDSE Setup (question diagram)
createSvg(`
  <!-- Source -->
  <circle cx="60" cy="200" r="12" fill="#fbbf24" stroke="#d97706" stroke-width="2"/>
  <text x="35" y="230" font-family="sans-serif" font-size="13" font-weight="bold" fill="#d97706">S</text>

  <!-- Single slit -->
  <rect x="120" y="30" width="8" height="155" fill="#1e293b"/>
  <rect x="120" y="215" width="8" height="155" fill="#1e293b"/>
  <text x="108" y="25" font-family="sans-serif" font-size="12" fill="#475569">Slit</text>

  <!-- Double slit -->
  <rect x="260" y="30" width="8" height="155" fill="#1e293b"/>
  <rect x="260" y="215" width="8" height="155" fill="#1e293b"/>
  <!-- Gap labels -->
  <circle cx="264" cy="175" r="4" fill="#2563eb"/>
  <text x="272" y="179" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">S₁</text>
  <circle cx="264" cy="225" r="4" fill="#2563eb"/>
  <text x="272" y="229" font-family="sans-serif" font-size="12" font-weight="bold" fill="#2563eb">S₂</text>

  <!-- Double arrow for d -->
  <line x1="290" y1="175" x2="290" y2="225" stroke="#dc2626" stroke-width="2" marker-end="url(#arr)" marker-start="url(#arr)"/>
  <text x="296" y="204" font-family="sans-serif" font-size="13" font-weight="bold" fill="#dc2626">d</text>

  <!-- Screen -->
  <rect x="500" y="30" width="10" height="340" fill="#94a3b8"/>
  <text x="490" y="25" font-family="sans-serif" font-size="12" fill="#475569">Screen</text>

  <!-- Fringe pattern on screen -->
  <rect x="510" y="90" width="16" height="8" fill="#fbbf24" opacity="0.6"/>
  <rect x="510" y="140" width="16" height="8" fill="#fbbf24" opacity="0.8"/>
  <rect x="510" y="190" width="16" height="12" fill="#fbbf24"/>
  <rect x="510" y="210" width="16" height="12" fill="#fbbf24"/>
  <rect x="510" y="258" width="16" height="8" fill="#fbbf24" opacity="0.8"/>
  <rect x="510" y="308" width="16" height="8" fill="#fbbf24" opacity="0.6"/>

  <!-- Central bright fringe label -->
  <line x1="526" y1="200" x2="560" y2="200" stroke="#059669" stroke-width="1.5" stroke-dasharray="3"/>
  <text x="528" y="196" font-family="sans-serif" font-size="11" fill="#059669">Central</text>

  <!-- D arrow -->
  <line x1="120" y1="370" x2="500" y2="370" stroke="#475569" stroke-width="1.5"/>
  <text x="290" y="388" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">D (Screen distance)</text>

  <!-- Rays from S1 and S2 -->
  <line x1="268" y1="175" x2="500" y2="200" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="5" opacity="0.7"/>
  <line x1="268" y1="225" x2="500" y2="200" stroke="#2563eb" stroke-width="1.5" stroke-dasharray="5" opacity="0.7"/>

  <!-- Title -->
  <text x="140" y="18" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Young's Double Slit Experiment (YDSE)</text>
`, 'ydse_setup');

// 2. YDSE Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="130" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">YDSE Key Formulae</text>
  <text x="60" y="115" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Fringe Width: β = λD / d</text>
  <text x="60" y="150" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Bright Fringe position: y_n = nλD / d  (n = 0, ±1, ±2,...)</text>
  <text x="60" y="185" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Dark Fringe position: y_n = (2n−1)λD / 2d</text>
  <text x="60" y="220" font-family="sans-serif" font-size="15" font-weight="bold" fill="#7c3aed">Intensity: I = I_max cos²(φ/2);  φ = 2πΔ/λ</text>
  <rect x="50" y="248" width="500" height="100" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="70" y="278" font-family="sans-serif" font-size="13" fill="#14532d">Fringe shift due to slab (μ, t): Δn = (μ−1)t / λ</text>
  <text x="70" y="308" font-family="sans-serif" font-size="13" fill="#14532d">In medium (refractive index μ): β' = β / μ  (wavelength shrinks)</text>
  <text x="70" y="338" font-family="sans-serif" font-size="13" fill="#14532d">I_max / I_min = (a₁ + a₂)² / (a₁ − a₂)²</text>
`, 'ydse_solution');

// 3. Single Slit Diffraction (question diagram)
createSvg(`
  <!-- Slit -->
  <rect x="220" y="30" width="10" height="155" fill="#1e293b"/>
  <rect x="220" y="235" width="10" height="135" fill="#1e293b"/>
  <!-- Slit width arrow -->
  <line x1="205" y1="185" x2="205" y2="235" stroke="#dc2626" stroke-width="2"/>
  <text x="170" y="214" font-family="sans-serif" font-size="13" font-weight="bold" fill="#dc2626">a</text>
  <text x="215" y="185" font-family="sans-serif" font-size="11" fill="#dc2626">⟵a⟶</text>

  <!-- Screen -->
  <rect x="480" y="30" width="10" height="340" fill="#94a3b8"/>
  <text x="470" y="25" font-family="sans-serif" font-size="12" fill="#475569">Screen</text>

  <!-- Diffraction pattern on screen (intensity profile) -->
  <!-- Central max (brightest) -->
  <rect x="490" y="175" width="40" height="50" fill="#fbbf24" opacity="1.0"/>
  <!-- 1st secondary max left -->
  <rect x="490" y="110" width="22" height="30" fill="#fbbf24" opacity="0.35"/>
  <!-- 1st secondary max right -->
  <rect x="490" y="260" width="22" height="30" fill="#fbbf24" opacity="0.35"/>
  <!-- 2nd secondary max left -->
  <rect x="490" y="60" width="14" height="20" fill="#fbbf24" opacity="0.15"/>
  <!-- 2nd secondary max right -->
  <rect x="490" y="320" width="14" height="20" fill="#fbbf24" opacity="0.15"/>

  <!-- Minima labels -->
  <line x1="480" y1="140" x2="465" y2="140" stroke="#475569" stroke-width="1.5"/>
  <text x="370" y="144" font-family="sans-serif" font-size="12" fill="#475569">1st min: a sinθ = λ</text>
  <line x1="480" y1="260" x2="465" y2="260" stroke="#475569" stroke-width="1.5"/>
  <text x="370" y="264" font-family="sans-serif" font-size="12" fill="#475569">1st min: a sinθ = λ</text>

  <!-- Central max label -->
  <line x1="530" y1="200" x2="560" y2="200" stroke="#059669" stroke-width="1.5"/>
  <text x="532" y="197" font-family="sans-serif" font-size="11" fill="#059669">Central</text>
  <text x="532" y="211" font-family="sans-serif" font-size="11" fill="#059669">Max</text>

  <!-- Incoming waves -->
  <line x1="50" y1="185" x2="220" y2="185" stroke="#2563eb" stroke-width="2" stroke-dasharray="6"/>
  <line x1="50" y1="200" x2="220" y2="200" stroke="#2563eb" stroke-width="2" stroke-dasharray="6"/>
  <line x1="50" y1="215" x2="220" y2="215" stroke="#2563eb" stroke-width="2" stroke-dasharray="6"/>
  <text x="50" y="170" font-family="sans-serif" font-size="13" font-weight="bold" fill="#2563eb">Plane waves (λ)</text>

  <!-- Title -->
  <text x="100" y="18" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Single Slit Diffraction Pattern</text>

  <!-- D arrow -->
  <line x1="230" y1="370" x2="480" y2="370" stroke="#475569" stroke-width="1.5"/>
  <text x="320" y="388" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">D</text>
`, 'single_slit_diffraction');

// 4. Single Slit Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="130" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Single Slit Diffraction Formulae</text>
  <text x="60" y="115" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Minima: a sinθ = mλ  (m = ±1, ±2, ...)</text>
  <text x="60" y="150" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Width of central max: W = 2λD / a</text>
  <text x="60" y="185" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Angular half-width: θ = λ / a  (for small angles)</text>
  <text x="60" y="220" font-family="sans-serif" font-size="15" font-weight="bold" fill="#7c3aed">Intensity: I = I₀ (sinα/α)²  where α = πa sinθ / λ</text>
  <rect x="50" y="248" width="500" height="100" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="70" y="278" font-family="sans-serif" font-size="13" fill="#78350f">1st secondary max: α = 3π/2  →  I₁/I₀ ≈ 4/(9π²) ≈ 1/22</text>
  <text x="70" y="308" font-family="sans-serif" font-size="13" fill="#78350f">2nd secondary max: α = 5π/2  →  I₂/I₀ ≈ 4/(25π²) ≈ 1/61</text>
  <text x="70" y="338" font-family="sans-serif" font-size="13" fill="#78350f">Central max is 2× wider than secondary maxima</text>
`, 'single_slit_solution');

// 5. Interference Pattern
createSvg(`
  <!-- y-axis label -->
  <text x="35" y="30" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Intensity</text>
  <line x1="80" y1="20" x2="80" y2="360" stroke="#0f172a" stroke-width="2.5"/>

  <!-- Intensity pattern: central max at y=200, fringes equally spaced -->
  <!-- Dark fringes at regular intervals, bright peaks between them -->
  <!-- Horizontal axis (position) -->
  <line x1="80" y1="360" x2="560" y2="360" stroke="#0f172a" stroke-width="2.5"/>
  <text x="490" y="385" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Position on screen (y)</text>

  <!-- Bright fringes (sinusoidal peaks) -->
  <!-- Using bell-curves approximating bright fringes -->
  <path d="M 80 360 Q 105 160 130 360 Q 155 160 180 360 Q 205 100 230 360 Q 255 60 280 360 Q 305 60 330 360 Q 355 100 380 360 Q 405 160 430 360 Q 455 160 480 360 Q 505 200 530 360" fill="none" stroke="#2563eb" stroke-width="3"/>

  <!-- Labels for bright fringes -->
  <text x="270" y="55" font-family="sans-serif" font-size="12" font-weight="bold" fill="#dc2626">n=0 (Central)</text>
  <line x1="280" y1="60" x2="280" y2="360" stroke="#dc2626" stroke-width="1" stroke-dasharray="4"/>

  <text x="220" y="95" font-family="sans-serif" font-size="11" fill="#059669">n=−1</text>
  <text x="325" y="95" font-family="sans-serif" font-size="11" fill="#059669">n=+1</text>

  <!-- Fringe width arrow -->
  <line x1="205" y1="340" x2="255" y2="340" stroke="#7c3aed" stroke-width="2"/>
  <text x="210" y="335" font-family="sans-serif" font-size="12" font-weight="bold" fill="#7c3aed">β</text>
  <line x1="205" y1="333" x2="205" y2="347" stroke="#7c3aed" stroke-width="2"/>
  <line x1="255" y1="333" x2="255" y2="347" stroke="#7c3aed" stroke-width="2"/>

  <!-- I_max label -->
  <text x="30" y="65" font-family="sans-serif" font-size="13" fill="#dc2626">I_max</text>
  <line x1="78" y1="62" x2="86" y2="62" stroke="#dc2626" stroke-width="1.5"/>

  <!-- Title -->
  <text x="150" y="18" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">YDSE Interference Pattern</text>
`, 'interference_pattern');

// 6. Huygens' Wavefront Diagram
createSvg(`
  <!-- Incident wavefront -->
  <text x="30" y="25" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Huygens' Principle &amp; Snell's Law Derivation</text>

  <!-- Interface line -->
  <line x1="200" y1="50" x2="200" y2="370" stroke="#475569" stroke-width="3" stroke-dasharray="8"/>
  <text x="205" y="50" font-family="sans-serif" font-size="13" font-weight="bold" fill="#475569">Interface</text>

  <!-- Medium labels -->
  <text x="60" y="200" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Medium 1</text>
  <text x="60" y="220" font-family="sans-serif" font-size="13" fill="#2563eb">(v₁, μ₁)</text>
  <text x="340" y="200" font-family="sans-serif" font-size="16" font-weight="bold" fill="#dc2626">Medium 2</text>
  <text x="340" y="220" font-family="sans-serif" font-size="13" fill="#dc2626">(v₂, μ₂)</text>

  <!-- Incident ray -->
  <line x1="80" y1="80" x2="200" y2="200" stroke="#2563eb" stroke-width="3"/>
  <text x="80" y="75" font-family="sans-serif" font-size="13" font-weight="bold" fill="#2563eb">Incident ray</text>

  <!-- Normal -->
  <line x1="200" y1="80" x2="200" y2="320" stroke="#475569" stroke-width="1.5" stroke-dasharray="5"/>

  <!-- Angle of incidence -->
  <path d="M 200 200 A 50 50 0 0 0 165 160" fill="none" stroke="#2563eb" stroke-width="1.5"/>
  <text x="155" y="178" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">i</text>

  <!-- Refracted ray -->
  <line x1="200" y1="200" x2="400" y2="340" stroke="#dc2626" stroke-width="3"/>
  <text x="400" y="355" font-family="sans-serif" font-size="13" font-weight="bold" fill="#dc2626">Refracted ray</text>

  <!-- Angle of refraction -->
  <path d="M 200 200 A 60 60 0 0 1 248 238" fill="none" stroke="#dc2626" stroke-width="1.5"/>
  <text x="232" y="225" font-family="sans-serif" font-size="14" font-weight="bold" fill="#dc2626">r</text>

  <!-- Snell's law box -->
  <rect x="300" y="50" width="270" height="90" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="320" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#14532d">Snell's Law:</text>
  <text x="320" y="105" font-family="sans-serif" font-size="14" fill="#14532d">μ₁ sin i = μ₂ sin r</text>
  <text x="320" y="130" font-family="sans-serif" font-size="13" fill="#14532d">sin i / sin r = v₁/v₂ = μ₂/μ₁</text>

  <!-- Huygens secondary wavelets -->
  <circle cx="200" cy="200" r="30" fill="none" stroke="#7c3aed" stroke-width="1.5" stroke-dasharray="3" opacity="0.7"/>
  <circle cx="200" cy="200" r="55" fill="none" stroke="#7c3aed" stroke-width="1" stroke-dasharray="3" opacity="0.4"/>
  <text x="130" y="300" font-family="sans-serif" font-size="12" fill="#7c3aed">Secondary wavelets</text>
`, 'huygens_wavefront');

// 7. Huygens Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="130" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Huygens' Principle Summary</text>
  <text x="60" y="115" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Every point on wavefront → secondary spherical wavelets</text>
  <text x="60" y="150" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">New wavefront = forward envelope of secondary wavelets</text>
  <text x="60" y="185" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Explains: Reflection, Refraction, Diffraction</text>
  <text x="60" y="220" font-family="sans-serif" font-size="15" font-weight="bold" fill="#7c3aed">Speed in medium: v = c/μ  →  λ_medium = λ_vacuum/μ</text>
  <rect x="50" y="248" width="500" height="100" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="70" y="278" font-family="sans-serif" font-size="13" fill="#78350f">Plane wavefront → Plane wavefront (after refraction)</text>
  <text x="70" y="308" font-family="sans-serif" font-size="13" fill="#78350f">Spherical wavefront → Spherical wavefront</text>
  <text x="70" y="338" font-family="sans-serif" font-size="13" fill="#78350f">Wavefront ⊥ rays at every point (in isotropic media)</text>
`, 'huygens_solution');

console.log('\nAll Wave Optics SVGs created successfully!');
