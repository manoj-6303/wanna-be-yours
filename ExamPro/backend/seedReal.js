import mongoose from 'mongoose';
import Question from './models/Question.js';
import dotenv from 'dotenv';
dotenv.config();

const realQuestions = [
  // Physics
  { question: "A particle is moving in a circular path of radius r. The displacement after half a circle would be:", options: ["Zero", "πr", "2r", "2πr"], correct: "2r" },
  { question: "If the momentum of a body is increased by 50%, then its kinetic energy will increase by:", options: ["50%", "100%", "125%", "200%"], correct: "125%" },
  { question: "The dimensions of universal gravitational constant are:", options: ["[M^-1 L^3 T^-2]", "[M^1 L^2 T^-2]", "[M^2 L^3 T^-2]", "[M^-1 L^2 T^-2]"], correct: "[M^-1 L^3 T^-2]" },
  { question: "Which of the following is a conservative force?", options: ["Friction", "Viscous drag", "Electrostatic force", "Air resistance"], correct: "Electrostatic force" },
  { question: "The escape velocity from the Earth's surface is v. The escape velocity from the surface of another planet having a radius, four times that of Earth and same mass density is:", options: ["v", "2v", "4v", "v/2"], correct: "4v" },
  { question: "Two resistors of 4 ohms and 6 ohms are connected in parallel. Their equivalent resistance is:", options: ["10 ohms", "2.4 ohms", "24 ohms", "5 ohms"], correct: "2.4 ohms" },
  { question: "The fundamental frequency of a closed organ pipe of length L is:", options: ["v / (4L)", "v / (2L)", "v / L", "2v / L"], correct: "v / (4L)" },
  { question: "In a Young's double-slit experiment, if the slit width ratio is 1:9, the ratio of maximum to minimum intensity will be:", options: ["9:1", "4:1", "3:1", "16:1"], correct: "4:1" },
  { question: "De Broglie wavelength of an electron accelerated through a potential difference V is proportional to:", options: ["V", "sqrt(V)", "1 / sqrt(V)", "1 / V"], correct: "1 / sqrt(V)" },
  { question: "The half-life of a radioactive substance is 10 days. The fraction decayed after 20 days is:", options: ["1/4", "1/2", "3/4", "7/8"], correct: "3/4" },

  // Chemistry
  { question: "Which of the following molecules has a zero dipole moment?", options: ["NH3", "H2O", "CO2", "SO2"], correct: "CO2" },
  { question: "The hybridization of carbon in graphite is:", options: ["sp", "sp2", "sp3", "sp3d"], correct: "sp2" },
  { question: "Which element has the highest electronegativity?", options: ["Oxygen", "Fluorine", "Chlorine", "Nitrogen"], correct: "Fluorine" },
  { question: "The oxidation state of Oxygen in H2O2 is:", options: ["-2", "-1", "+1", "+2"], correct: "-1" },
  { question: "Which of the following is an electrophile?", options: ["NH3", "H2O", "AlCl3", "CH3OH"], correct: "AlCl3" },
  { question: "The geometry of SF6 molecule is:", options: ["Tetrahedral", "Trigonal bipyramidal", "Octahedral", "Square planar"], correct: "Octahedral" },
  { question: "Which of the following is an intensive property?", options: ["Volume", "Mass", "Temperature", "Internal Energy"], correct: "Temperature" },
  { question: "An SN2 reaction at an asymmetric carbon of a compound always gives:", options: ["An enantiomer", "A mixture of diastereomers", "Complete inversion of configuration", "Complete racemization"], correct: "Complete inversion of configuration" },
  { question: "The common oxidation states of Titanium are:", options: ["+2 and +3", "+3 and +4", "+2, +3, and +4", "+1, +2, and +3"], correct: "+2, +3, and +4" },
  { question: "Which block of elements contains the most reactive metals?", options: ["s-block", "p-block", "d-block", "f-block"], correct: "s-block" },

  // Math
  { question: "The value of limit x->0 (sin x)/x is:", options: ["0", "1", "Infinity", "Undefined"], correct: "1" },
  { question: "The derivative of ln(cos x) with respect to x is:", options: ["tan x", "-tan x", "cot x", "-cot x"], correct: "-tan x" },
  { question: "If the roots of the equation x^2 - 5x + 6 = 0 are alpha and beta, then alpha + beta is:", options: ["-5", "5", "6", "-6"], correct: "5" },
  { question: "The sum of the infinite geometric series 1 + 1/2 + 1/4 + ... is:", options: ["1", "2", "Infinity", "0.5"], correct: "2" },
  { question: "The maximum value of 3 sin x + 4 cos x is:", options: ["5", "7", "1", "12"], correct: "5" },
  { question: "Integration of e^x(f(x) + f'(x)) dx is:", options: ["e^x f'(x) + C", "e^x f(x) + C", "e^x / f(x) + C", "f(x) / e^x + C"], correct: "e^x f(x) + C" },
  { question: "What is the probability of getting a sum of 9 from two throws of a dice?", options: ["1/9", "1/6", "1/12", "1/18"], correct: "1/9" },
  { question: "The distance between the parallel lines 3x + 4y = 9 and 3x + 4y = 15 is:", options: ["6/5", "3/5", "6", "5"], correct: "6/5" },
  { question: "In a triangle ABC, if a=3, b=4, c=5, then the triangle is:", options: ["Equilateral", "Isosceles", "Right-angled", "Obtuse-angled"], correct: "Right-angled" },
  { question: "The determinant of a 3x3 identity matrix is:", options: ["0", "1", "3", "9"], correct: "1" }
];

const seedReal = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/exampro');
        const allQuestions = await Question.find();
        
        let index = 0;
        for (let q of allQuestions) {
            // Find a question from realQuestions that matches the subject roughly if possible
            // Otherwise just pick sequentially
            let templates = realQuestions;
            if(q.subject === 'Physics') templates = realQuestions.slice(0, 10);
            else if(q.subject === 'Chemistry') templates = realQuestions.slice(10, 20);
            else if(q.subject === 'Mathematics') templates = realQuestions.slice(20, 30);

            const template = templates[index % templates.length];
            q.question = template.question;
            q.correctAnswer = template.correct;
            
            // Clone options and shuffle them
            let ops = [...template.options];
            for (let i = ops.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [ops[i], ops[j]] = [ops[j], ops[i]];
            }
            q.options = ops;

            await q.save();
            index++;
        }
        
        console.log("Real questions successfully seeded!");
        process.exit();
    } catch(err) {
        console.error(err);
        process.exit(1);
    }
}

seedReal();
