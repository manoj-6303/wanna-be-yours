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

// 1. Calorimeter setup (clean question diagram)
createSvg(`
  <rect x="200" y="90" width="200" height="240" rx="12" fill="#ffffff" stroke="#1e293b" stroke-width="4"/>
  <rect x="220" y="110" width="160" height="200" rx="6" fill="#f1f5f9" stroke="#475569" stroke-width="3"/>
  <rect x="225" y="190" width="150" height="115" rx="4" fill="#60a5fa" opacity="0.4"/>
  <line x1="250" y1="130" x2="250" y2="280" stroke="#ef4444" stroke-width="4" stroke-linecap="round"/>
  <line x1="330" y1="60" x2="330" y2="270" stroke="#475569" stroke-width="6" stroke-linecap="round"/>
  <circle cx="330" cy="275" r="12" fill="#ef4444"/>
`, 'calorimeter_setup');

// 2. Calorimeter solution diagram (detailed solution)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="180" y="75" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Principle of Calorimetry</text>
  <rect x="120" y="105" width="360" height="45" rx="8" fill="#fee2e2" stroke="#fca5a5" stroke-width="2"/>
  <text x="170" y="134" font-family="sans-serif" font-size="18" font-weight="bold" fill="#b91c1c">Heat Lost = Heat Gained</text>
  <text x="60" y="200" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e293b">m₁ s₁ (T₁ - T) = m₂ s₂ (T - T₂) + C_cal (T - T₂)</text>
  <path d="M120 260 L480 260" stroke="#2563eb" stroke-width="4" stroke-dasharray="8 4"/>
  <path d="M470 250 L485 260 L470 270" fill="#2563eb"/>
  <text x="190" y="295" font-family="sans-serif" font-size="14" font-weight="bold" fill="#2563eb">Heat Flows Hot → Cold Body</text>
`, 'calorimeter_solution');

// 3. Heating curve (clean question diagram)
createSvg(`
  <line x1="80" y1="340" x2="520" y2="340" stroke="#0f172a" stroke-width="3"/>
  <line x1="80" y1="340" x2="80" y2="60" stroke="#0f172a" stroke-width="3"/>
  <path d="M80 320 L160 260 L280 260 L360 140 L480 140 L520 80" fill="none" stroke="#2563eb" stroke-width="4"/>
  <text x="460" y="375" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Heat Added (Q)</text>
  <text x="20" y="80" font-family="sans-serif" font-size="14" font-weight="bold" fill="#0f172a">Temp (T)</text>
`, 'heating_curve');

// 4. Heating curve solution diagram (detailed solution)
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <line x1="80" y1="330" x2="520" y2="330" stroke="#0f172a" stroke-width="3"/>
  <line x1="80" y1="330" x2="80" y2="60" stroke="#0f172a" stroke-width="3"/>
  <path d="M80 310 L160 250 L280 250 L360 130 L480 130 L520 70" fill="none" stroke="#dc2626" stroke-width="4"/>
  <text x="180" y="240" font-family="sans-serif" font-size="13" font-weight="bold" fill="#2563eb">Melting (Q = m L_f)</text>
  <text x="380" y="120" font-family="sans-serif" font-size="13" font-weight="bold" fill="#2563eb">Vaporization (Q = m L_v)</text>
  <text x="90" y="295" font-family="sans-serif" font-size="12" fill="#475569">Solid: Q = m c_s ΔT</text>
  <text x="290" y="180" font-family="sans-serif" font-size="12" fill="#475569">Liquid: Q = m c_w ΔT</text>
`, 'heating_curve_solution');
