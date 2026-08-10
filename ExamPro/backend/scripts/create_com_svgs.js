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

// 1. Center of Mass system (clean question diagram)
createSvg(`
  <line x1="80" y1="340" x2="520" y2="340" stroke="#0f172a" stroke-width="3"/>
  <line x1="80" y1="340" x2="80" y2="60" stroke="#0f172a" stroke-width="3"/>
  <circle cx="160" cy="260" r="16" fill="#2563eb"/>
  <circle cx="440" cy="140" r="28" fill="#ef4444"/>
  <line x1="160" y1="260" x2="440" y2="140" stroke="#64748b" stroke-width="3" stroke-dasharray="6 4"/>
  <circle cx="360" cy="174" r="6" fill="#10b981"/>
`, 'com_particles');

// 2. Center of Mass solution diagram (detailed solution)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Center of Mass (COM)</text>
  <text x="80" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">X_cm = (m₁ x₁ + m₂ x₂) / (m₁ + m₂)</text>
  <text x="80" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#b91c1c">Y_cm = (m₁ y₁ + m₂ y₂) / (m₁ + m₂)</text>
  <text x="80" y="230" font-family="sans-serif" font-size="16" font-weight="bold" fill="#059669">V_cm = (m₁ v₁ + m₂ v₂) / (m₁ + m₂)</text>
  <rect x="70" y="270" width="460" height="70" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="90" y="300" font-family="sans-serif" font-size="14" fill="#1e3a8a">If F_ext = 0  ⇒  V_cm = Constant</text>
  <text x="90" y="325" font-family="sans-serif" font-size="14" fill="#1e3a8a">Internal forces cannot move Center of Mass</text>
`, 'com_solution');

// 3. Collision diagram (clean question diagram)
createSvg(`
  <line x1="60" y1="200" x2="540" y2="200" stroke="#0f172a" stroke-width="3"/>
  <circle cx="150" cy="200" r="25" fill="#3b82f6"/>
  <path d="M185 200 L235 200 L225 190 M235 200 L225 210" stroke="#2563eb" stroke-width="4" fill="none"/>
  <circle cx="380" cy="200" r="35" fill="#f43f5e"/>
  <path d="M425 200 L465 200 L455 190 M465 200 L455 210" stroke="#e11d48" stroke-width="4" fill="none"/>
`, 'collision_diagram');

// 4. Collision solution diagram (detailed solution)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="170" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Collision &amp; Momentum</text>
  <text x="70" y="130" font-family="sans-serif" font-size="16" font-weight="bold" fill="#2563eb">Momentum Conservation: m₁ u₁ + m₂ u₂ = m₁ v₁ + m₂ v₂</text>
  <text x="70" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#c2410c">Coefficient of Restitution: e = (v₂ - v₁) / (u₁ - u₂)</text>
  <text x="70" y="230" font-family="sans-serif" font-size="15" fill="#1e293b">Elastic (e = 1): KE conserved | Inelastic (0 &lt; e &lt; 1) | Perfectly Inelastic (e = 0)</text>
  <rect x="60" y="270" width="480" height="70" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="80" y="300" font-family="sans-serif" font-size="14" font-weight="bold" fill="#92400e">KE Loss in Perfectly Inelastic Collision (e = 0):</text>
  <text x="80" y="325" font-family="sans-serif" font-size="14" fill="#92400e">ΔK = ½ [ (m₁ m₂) / (m₁ + m₂) ] (u₁ - u₂)²</text>
`, 'collision_solution');
