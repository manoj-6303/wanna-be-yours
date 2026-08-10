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

// 1. Fluid Pressure / U-Tube Manometer
createSvg(`
  <path d="M 200 80 L 200 300 A 100 100 0 0 0 400 300 L 400 80" fill="none" stroke="#334155" stroke-width="20" stroke-linecap="round"/>
  <path d="M 200 160 L 200 300 A 100 100 0 0 0 400 300 L 400 220" fill="none" stroke="#3b82f6" stroke-width="14" stroke-linecap="round"/>
  <line x1="170" y1="160" x2="430" y2="160" stroke="#94a3b8" stroke-dasharray="4" stroke-width="2"/>
  <line x1="170" y1="220" x2="430" y2="220" stroke="#94a3b8" stroke-dasharray="4" stroke-width="2"/>
  <text x="420" y="195" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0f172a">h</text>
  <path d="M 412 160 L 412 220" stroke="#0f172a" stroke-width="2"/>
`, 'fluid_pressure');

// 2. Fluid Pressure Solution Diagram
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="140" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Hydrostatics &amp; Pressure Principles</text>
  <text x="60" y="120" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Pressure at depth h: P = P₀ + ρgh</text>
  <text x="60" y="160" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Pascal's Law: F₁/A₁ = F₂/A₂ (Hydraulic Lift)</text>
  <text x="60" y="200" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Archimedes' Buoyant Force: F_b = ρ_fluid * V_submerged * g</text>
  <rect x="50" y="240" width="500" height="100" rx="8" fill="#eff6ff" stroke="#bfdbfe" stroke-width="2"/>
  <text x="70" y="270" font-family="sans-serif" font-size="14" fill="#1e3a8a">U-Tube Manometer Condition: P₁ + ρ₁ g h₁ = P₂ + ρ₂ g h₂</text>
  <text x="70" y="300" font-family="sans-serif" font-size="14" fill="#1e3a8a">Apparent Weight in Fluid: W_app = W_real - F_b = V (ρ_body - ρ_fluid) g</text>
`, 'fluid_pressure_solution');

// 3. Bernoulli Flow / Venturimeter
createSvg(`
  <path d="M 50 120 L 220 160 L 380 160 L 550 120 L 550 280 L 380 240 L 220 240 L 50 280 Z" fill="#e0f2fe" stroke="#0284c7" stroke-width="3"/>
  <line x1="140" y1="140" x2="140" y2="70" stroke="#0284c7" stroke-width="4"/>
  <line x1="300" y1="160" x2="300" y2="100" stroke="#0284c7" stroke-width="4"/>
  <path d="M 70 200 L 150 200 M 140 195 L 150 200 L 140 205" stroke="#2563eb" stroke-width="3" fill="none"/>
  <path d="M 260 200 L 340 200 M 330 195 L 340 200 L 330 205" stroke="#2563eb" stroke-width="4" fill="none"/>
  <text x="80" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0369a1">A₁, v₁</text>
  <text x="280" y="180" font-family="sans-serif" font-size="16" font-weight="bold" fill="#0369a1">A₂, v₂</text>
`, 'bernoulli_flow');

// 4. Bernoulli Solution Diagram
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="140" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Fluid Dynamics &amp; Flow Laws</text>
  <text x="60" y="120" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Equation of Continuity: A₁ v₁ = A₂ v₂ (Incompressible Flow)</text>
  <text x="60" y="160" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Bernoulli's Equation: P + ½ ρ v² + ρ g h = Constant</text>
  <text x="60" y="200" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Torricelli's Law of Efflux: v = √(2 g h)</text>
  <rect x="50" y="240" width="500" height="100" rx="8" fill="#f0fdf4" stroke="#bbf7d0" stroke-width="2"/>
  <text x="70" y="270" font-family="sans-serif" font-size="14" fill="#14532d">Venturimeter Speed: v₁ = √[ (2 g Δh) / ( (A₁/A²)² - 1 ) ]</text>
  <text x="70" y="300" font-family="sans-serif" font-size="14" fill="#14532d">Viscous Force (Stokes' Law): F_v = 6 π η r v | Terminal Speed: v_t = 2 r² (ρ - σ) g / (9 η)</text>
`, 'bernoulli_solution');

// 5. Surface Tension &amp; Capillary Tube
createSvg(`
  <rect x="100" y="180" width="400" height="160" fill="#dbeafe" stroke="#3b82f6" stroke-width="2"/>
  <rect x="270" y="60" width="60" height="240" fill="#eff6ff" stroke="#1e40af" stroke-width="3"/>
  <path d="M 270 120 Q 300 135 330 120" fill="#93c5fd" stroke="#1d4ed8" stroke-width="3"/>
  <line x1="250" y1="180" x2="350" y2="180" stroke="#94a3b8" stroke-dasharray="4"/>
  <line x1="250" y1="120" x2="350" y2="120" stroke="#94a3b8" stroke-dasharray="4"/>
  <text x="345" y="155" font-family="sans-serif" font-size="16" font-weight="bold" fill="#1e40af">h</text>
`, 'surface_tension');

// 6. Surface Tension Solution Diagram
createSvg(`
  <rect x="30" y="30" width="540" height="340" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="2"/>
  <text x="150" y="70" font-family="sans-serif" font-size="20" font-weight="bold" fill="#0f172a">Surface Tension &amp; Capillarity</text>
  <text x="60" y="120" font-family="sans-serif" font-size="15" font-weight="bold" fill="#2563eb">Excess Pressure in Liquid Drop: ΔP = 2 S / R</text>
  <text x="60" y="160" font-family="sans-serif" font-size="15" font-weight="bold" fill="#dc2626">Excess Pressure in Soap Bubble: ΔP = 4 S / R</text>
  <text x="60" y="200" font-family="sans-serif" font-size="15" font-weight="bold" fill="#16a34a">Capillary Rise Equation: h = (2 S cos θ) / (r ρ g)</text>
  <rect x="50" y="240" width="500" height="100" rx="8" fill="#fef3c7" stroke="#fde68a" stroke-width="2"/>
  <text x="70" y="270" font-family="sans-serif" font-size="14" fill="#78350f">Work done in blowing bubble: W = 8 π R² S</text>
  <text x="70" y="300" font-family="sans-serif" font-size="14" fill="#78350f">Reynolds Number: Re = (ρ v d) / η | (Re &lt; 1000: Streamline, Re &gt; 2000: Turbulent)</text>
`, 'surface_tension_solution');
