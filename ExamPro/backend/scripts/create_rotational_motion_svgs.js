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

// 1. Moment of Inertia (question diagram)
createSvg(`
  <!-- Axis of rotation -->
  <line x1="300" y1="50" x2="300" y2="350" stroke="#0f172a" stroke-width="2.5" stroke-dasharray="8 4"/>
  <text x="280" y="70" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Axis</text>

  <!-- Rotating Disc -->
  <ellipse cx="300" cy="200" rx="150" ry="40" fill="#f1f5f9" stroke="#334155" stroke-width="4"/>
  
  <!-- Radius R -->
  <line x1="300" y1="200" x2="450" y2="200" stroke="#475569" stroke-width="2"/>
  <text x="375" y="190" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569">R</text>

  <!-- Mass M -->
  <text x="350" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">Mass = M</text>
  
  <!-- Rotation arrow -->
  <path d="M 460 190 A 20 20 0 0 0 460 210" fill="none" stroke="#2563eb" stroke-width="3"/>
  <text x="480" y="205" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">ω</text>
`, 'moment_of_inertia');

// 2. Moment of Inertia Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Moment of Inertia Theorems</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Parallel Axes Theorem: I = I_cm + M d²</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Perpendicular Axes Theorem (2D): I_z = I_x + I_y</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Radius of Gyration: K = √(I / M)</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#14532d">Disc center perp: I = ½ MR² | Ring center perp: I = MR²</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#14532d">Solid Sphere center: I = ⅖ MR² | Hollow Sphere center: I = ⅔ MR²</text>
`, 'moment_of_inertia_solution');

// 3. Torque & Angular Acceleration (question diagram)
createSvg(`
  <!-- Fixed Pulley/Flywheel -->
  <circle cx="300" cy="200" r="100" fill="#f8fafc" stroke="#0f172a" stroke-width="4"/>
  <circle cx="300" cy="200" r="10" fill="#0f172a"/>
  
  <!-- Wrapped String pulling down -->
  <line x1="400" y1="200" x2="400" y2="350" stroke="#475569" stroke-width="3"/>
  <path d="M 400 350 L 400 365 M 395 353 L 400 365 L 405 353" stroke="#ef4444" stroke-width="3" fill="none"/>
  <text x="415" y="330" font-family="sans-serif" font-size="16" font-weight="bold" fill="#ef4444">Force = F</text>
  
  <!-- Radius R -->
  <line x1="300" y1="200" x2="400" y2="200" stroke="#0f172a" stroke-width="2" stroke-dasharray="4"/>
  <text x="340" y="190" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">R</text>

  <!-- Flywheel label -->
  <text x="210" y="150" font-family="sans-serif" font-size="14" font-weight="bold" fill="#475569">Flywheel (I)</text>
`, 'torque_angular_acceleration');

// 4. Torque & Angular Acceleration Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Torque &amp; Rotational Dynamics</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Torque: τ = r × F = r F sin φ = I α</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Angular Momentum: L = r × p = I ω</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Rotational Kinetic Energy: K_rot = ½ I ω²</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#fff1f2" stroke="#fecdd3" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#9f1239">Conservation of Angular Momentum: L_i = L_f if τ_ext = 0</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#9f1239">Power delivered: P = τ · ω | Work done: W = ∫ τ dθ</text>
`, 'torque_angular_acceleration_solution');

// 5. Rolling Motion (question diagram)
createSvg(`
  <!-- Inclined Plane wedge -->
  <path d="M 80 320 L 480 320 L 480 160 Z" fill="#f1f5f9" stroke="#0f172a" stroke-width="3"/>
  <text x="130" y="310" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">θ</text>

  <!-- Rolling body (sphere/disc) -->
  <g transform="translate(260, 230) rotate(-22)">
    <circle cx="0" cy="0" r="50" fill="#f8fafc" stroke="#2563eb" stroke-width="4"/>
    <circle cx="0" cy="0" r="5" fill="#2563eb"/>
    <line x1="0" y1="0" x2="50" y2="0" stroke="#2563eb" stroke-width="2"/>
    <text x="20" y="-10" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">R</text>

    <!-- Velocity vector -->
    <path d="M 0 0 L 80 0 M 65 -5 L 80 0 L 65 5" stroke="#ef4444" stroke-width="2.5" fill="none"/>
    <text x="60" y="-15" font-family="sans-serif" font-size="14" font-weight="bold" fill="#ef4444">v_cm</text>
  </g>
`, 'rolling_motion');

// 6. Rolling Motion Solution
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Pure Rolling Motion Laws</text>
  <text x="60" y="125" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Condition for Pure Rolling: v_cm = ω R | a_cm = α R</text>
  <text x="60" y="165" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Total Kinetic Energy: K_total = ½ M v_cm² + ½ I_cm ω²</text>
  <text x="60" y="205" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Fraction of Rotational KE: K_rot/K_tot = k² / (R² + k²)</text>
  <rect x="50" y="245" width="500" height="95" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="70" y="275" font-family="sans-serif" font-size="13" fill="#14532d">Acceleration down incline: a = (g sin θ) / (1 + I_cm / MR²)</text>
  <text x="70" y="305" font-family="sans-serif" font-size="13" fill="#14532d">Velocity at bottom of incline: v = √[ 2 g h / (1 + I_cm / MR²) ]</text>
`, 'rolling_motion_solution');
