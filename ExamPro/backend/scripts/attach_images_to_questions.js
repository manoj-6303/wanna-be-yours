import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const physicsDir = path.join(__dirname, '..', '..', 'QuestionBank', 'JeeMains', 'Physics');

// Mapping of Chapter Name -> Image Pairs [questionImage, explanationImage]
const chapterImageMap = {
  "Motion in One-Dimension": [
    ["/images/position_time_graph.svg", "/images/position_time_solution.svg"],
    ["/images/velocity_time_graph.svg", "/images/velocity_time_solution.svg"],
    ["/images/vertical_motion.svg", "/images/vertical_motion_solution.svg"]
  ],
  "Motion in Two-Dimension": [
    ["/images/projectile_trajectory.svg", "/images/projectile_solution.svg"],
    ["/images/river_crossing.svg", "/images/river_crossing_solution.svg"],
    ["/images/circular_kinematics.svg", "/images/circular_kinematics_solution.svg"]
  ],
  "Newtons Law of Motion": [
    ["/images/pulley_block_system.svg", "/images/pulley_block_solution.svg"],
    ["/images/inclined_plane_friction.svg", "/images/inclined_plane_solution.svg"],
    ["/images/banked_road.svg", "/images/banked_road_solution.svg"]
  ],
  "Work, Power ,Energy": [
    ["/images/work_energy_theorem.svg", "/images/work_energy_solution.svg"],
    ["/images/potential_energy_curve.svg", "/images/potential_energy_solution.svg"],
    ["/images/energy_conversion.svg", "/images/work_energy_solution.svg"]
  ],
  "Center of Mass Momentum and Collision": [
    ["/images/collision_diagram.svg", "/images/collision_solution.svg"],
    ["/images/com_particles.svg", "/images/com_solution.svg"]
  ],
  "Rotational Motion": [
    ["/images/moment_of_inertia.svg", "/images/moment_of_inertia_solution.svg"],
    ["/images/rolling_motion.svg", "/images/rolling_motion_solution.svg"],
    ["/images/torque_angular_acceleration.svg", "/images/torque_angular_acceleration_solution.svg"]
  ],
  "Circular Motion": [
    ["/images/banked_road.svg", "/images/banked_road_solution.svg"],
    ["/images/circular_motion_vectors.svg", "/images/circular_motion_solution.svg"]
  ],
  "Gravitation": [
    ["/images/kepler_laws.svg", "/images/kepler_solution.svg"],
    ["/images/planetary_orbit.svg", "/images/planetary_orbit_solution.svg"],
    ["/images/satellite_orbit.svg", "/images/satellite_orbit_solution.svg"],
    ["/images/gravitational_field.svg", "/images/gravitational_field_solution.svg"]
  ],
  "Machanical Properties of Solids": [
    ["/images/stress_strain_curve.svg", "/images/stress_strain_solution.svg"],
    ["/images/bulk_shear_modulus.svg", "/images/bulk_shear_solution.svg"],
    ["/images/wire_stretching.svg", "/images/wire_stretching_solution.svg"]
  ],
  "Machanical Properties of Fluids": [
    ["/images/bernoulli_flow.svg", "/images/bernoulli_solution.svg"],
    ["/images/fluid_pressure.svg", "/images/fluid_pressure_solution.svg"],
    ["/images/surface_tension.svg", "/images/surface_tension_solution.svg"]
  ],
  "Thermal Properties of Matter": [
    ["/images/heating_curve.svg", "/images/heating_curve_solution.svg"],
    ["/images/thermal_expansion.svg", "/images/thermal_expansion_solution.svg"],
    ["/images/thermometer_scales.svg", "/images/thermometer_scales_solution.svg"]
  ],
  "Calorimetry": [
    ["/images/calorimeter_setup.svg", "/images/calorimeter_solution.svg"],
    ["/images/heating_curve.svg", "/images/heating_curve_solution.svg"]
  ],
  "Kinetic Theory of Gases": [
    ["/images/maxwell_speed_distribution.svg", "/images/maxwell_speed_solution.svg"],
    ["/images/pv_diagram.svg", "/images/pv_diagram_solution.svg"]
  ],
  "Heat Transfer": [
    ["/images/thermal_conduction.svg", "/images/thermal_conduction_solution.svg"],
    ["/images/blackbody_radiation.svg", "/images/blackbody_solution.svg"]
  ],
  "Electrostatics": [
    ["/images/coulomb_law.svg", "/images/coulomb_solution.svg"],
    ["/images/electric_dipole.svg", "/images/electric_dipole_solution.svg"]
  ],
  "Capacitance": [
    ["/images/capacitor_circuit.svg", "/images/capacitor_solution.svg"],
    ["/images/dielectric_capacitor.svg", "/images/dielectric_solution.svg"]
  ],
  "Current Electricity": [
    ["/images/wheatstone_bridge.svg", "/images/wheatstone_solution.svg"],
    ["/images/potentiometer_circuit.svg", "/images/potentiometer_solution.svg"]
  ],
  "Magnetic effects and matters": [
    ["/images/moving_charge_field.svg", "/images/moving_charge_solution.svg"],
    ["/images/magnetic_field_loop.svg", "/images/magnetic_field_loop_solution.svg"]
  ],
  "Magnetisum": [
    ["/images/bar_magnet_field.svg", "/images/bar_magnet_solution.svg"],
    ["/images/earth_magnetism.svg", "/images/earth_magnetism_solution.svg"],
    ["/images/hysteresis_loop.svg", "/images/hysteresis_loop_solution.svg"],
    ["/images/solenoid_toroid.svg", "/images/solenoid_toroid_solution.svg"]
  ],
  "Electro Magnetic Induction": [
    ["/images/faraday_lenz.svg", "/images/faraday_lenz_solution.svg"],
    ["/images/motional_emf.svg", "/images/motional_emf_solution.svg"]
  ],
  "Alternating Current": [
    ["/images/lcr_circuit.png", "/images/lcr_solution.png"],
    ["/images/resonance_curve.png", "/images/resonance_solution.png"],
    ["/images/transformer.png", "/images/transformer_solution.png"]
  ],
  "Electro Magnetic Waves": [
    ["/images/em_wave_propagation.svg", "/images/em_wave_solution.svg"],
    ["/images/em_spectrum.svg", "/images/em_spectrum_solution.svg"]
  ],
  "Simple Harmonic Motion -SHM": [
    ["/images/shm_spring_mass.svg", "/images/shm_spring_mass_solution.svg"],
    ["/images/shm_pendulum.svg", "/images/shm_pendulum_solution.svg"],
    ["/images/shm_phasor.svg", "/images/shm_phasor_solution.svg"]
  ],
  "Wave and Sound": [
    ["/images/transverse_wave.svg", "/images/transverse_wave_solution.svg"],
    ["/images/organ_pipes.svg", "/images/organ_pipes_solution.svg"],
    ["/images/doppler_effect.svg", "/images/doppler_effect_solution.svg"]
  ],
  "Ray Optics": [
    ["/images/spherical_mirror.svg", "/images/spherical_mirror_solution.svg"],
    ["/images/refraction_snell.svg", "/images/refraction_snell_solution.svg"],
    ["/images/prism_deviation.svg", "/images/prism_deviation_solution.svg"]
  ],
  "Wave Optics": [
    ["/images/huygens_wavefront.svg", "/images/huygens_solution.svg"],
    ["/images/ydse_setup.svg", "/images/ydse_solution.svg"],
    ["/images/single_slit_diffraction.svg", "/images/single_slit_solution.svg"]
  ],
  "Atomic Physics": [
    ["/images/bohr_orbits.png", "/images/bohr_levels_solution.png"],
    ["/images/bohr_levels.png", "/images/bohr_levels_solution.png"]
  ],
  "Nuclear Physics": [
    ["/images/radioactive_decay.svg", "/images/radioactive_decay_solution.svg"],
    ["/images/binding_energy_curve.svg", "/images/binding_energy_solution.svg"],
    ["/images/nuclear_fission_fusion.svg", "/images/nuclear_fission_fusion_solution.svg"]
  ],
  "Semi Conductor": [
    ["/images/energy_bands.svg", "/images/energy_bands_solution.svg"],
    ["/images/diode_circuits.svg", "/images/diode_circuits_solution.svg"],
    ["/images/logic_gates.svg", "/images/logic_gates_solution.svg"]
  ],
  "Communication System": [
    ["/images/antenna_coverage.svg", "/images/antenna_solution.svg"],
    ["/images/modulation_waveform.svg", "/images/modulation_solution.svg"]
  ],
  "Experimental Physics": [
    ["/images/vernier_caliper.svg", "/images/vernier_caliper_solution.svg"],
    ["/images/screw_gauge.svg", "/images/screw_gauge_solution.svg"]
  ],
  "Units and Dimensions": [
    ["/images/dimensional_analysis.svg", "/images/dimensional_analysis_solution.svg"]
  ],
  "Mathematics in physics": [
    ["/images/vector_addition.svg", "/images/vector_addition_solution.svg"],
    ["/images/vector_components.svg", "/images/vector_components_solution.svg"],
    ["/images/integration_area.svg", "/images/integration_area_solution.svg"]
  ]
};

let totalUpdated = 0;

function processDirectory(dir) {
  const list = fs.readdirSync(dir);
  for (const item of list) {
    const fullPath = path.join(dir, item);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      const chapterName = item;
      const jsonFiles = fs.readdirSync(fullPath).filter(f => f.endsWith('.json'));
      const pairs = chapterImageMap[chapterName] || [];

      jsonFiles.forEach(jsonFile => {
        const filePath = path.join(fullPath, jsonFile);
        const content = fs.readFileSync(filePath, 'utf8');
        try {
          const questions = JSON.parse(content);
          if (Array.isArray(questions) && questions.length > 0) {
            // Assign 6 diagram questions (30%) per file, remaining 14 text-only
            const diagramQuota = 6;
            questions.forEach((q, idx) => {
              if (idx < diagramQuota && pairs.length > 0) {
                const pair = pairs[idx % pairs.length];
                q.questionImage = pair[0];
                q.explanationImage = pair[1];
                q.solutionImage = pair[1];
              } else {
                delete q.questionImage;
                delete q.image;
                delete q.explanationImage;
                delete q.solutionImage;
              }
            });

            fs.writeFileSync(filePath, JSON.stringify(questions, null, 2));
            totalUpdated += Math.min(diagramQuota, questions.length);
            console.log(`Configured balanced diagram questions for ${chapterName}/${jsonFile}`);
          }
        } catch (e) {
          console.error(`Error processing ${filePath}:`, e.message);
        }
      });
    }
  }
}

processDirectory(physicsDir);
console.log(`Successfully attached reference and solution images to ${totalUpdated} physics questions!`);
