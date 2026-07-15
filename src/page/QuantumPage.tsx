import ServicePageTemplate, { ServiceHeroCard } from "./ServicePageTemplate";
import type { ServicePageConfig } from "./ServicePageTemplate";
import SEO from "../components/seo/SEO";

const heroStats = [
  { val: "Hybrid",        label: "Architecture"  },
  { val: "Cloud Quantum", label: "Access"        },
  { val: "Honest",        label: "Feasibility"   },
];

const config: ServicePageConfig = {
  seoTitle: "Quantum Computing Services India, Dubai & Abu Dhabi — XERXEZ",
  seoDesc:  "XERXEZ quantum computing solutions for enterprise innovation in India, Dubai & Abu Dhabi UAE.",
  serviceName: "Quantum Computing",
  badgeText: "Quantum Computing · Advanced R&D",

  headline: (
    <h1 style={{ fontFamily: "'DM Sans',sans-serif", fontWeight: 800, fontSize: "clamp(32px,4.5vw,60px)", lineHeight: 1.08, color: "#fff", margin: 0, letterSpacing: "-0.03em" }}>
      Solve Problems That<br />
      <em style={{ color: "#C9883A", fontStyle: "italic", fontFamily: "'Cormorant Garamond',serif", fontWeight: 700 }}>
        Classical Computers Cannot
      </em>
    </h1>
  ),
  description: "Quantum optimisation, simulation, and cryptography for enterprise and government organisations. XERXEZ bridges the gap between quantum research and production deployment — for problems that are genuinely quantum-advantageous today.",

  heroStats: [
    { val: "Hybrid",        label: "Architecture"  },
    { val: "Cloud Quantum", label: "Access"        },
    { val: "Honest",        label: "Feasibility"   },
  ],
  cascadeA: ["Quantum Algorithms","Post-Quantum Cryptography","Optimisation","Quantum Simulation","Hybrid Quantum-Classical","Variational Circuits","Quantum Machine Learning","Quantum Error Correction","NISQ Computing"],
  cascadeB: ["IBM Quantum · Qiskit","Google Cirq · Braket","D-Wave Advantage","IonQ · Honeywell","PennyLane · Strawberry Fields","QAOA · VQE","Grover's · Shor's","QuTiP · Qibo","Quantum Volume 512"],

  heroRight: (
    <ServiceHeroCard
      icon="fas fa-atom"
      title="Quantum Computing"
      stats={heroStats}
    />
  ),

  trustBar: [
    { icon: "fas fa-atom",        label: "Cloud Quantum Access"    },
    { icon: "fas fa-lock",        label: "Post-Quantum Cryptography" },
    { icon: "fas fa-code-branch", label: "Hybrid Architecture"     },
    { icon: "fas fa-balance-scale",label: "Classical Baseline First" },
    { icon: "fas fa-project-diagram",label: "NISQ Computing"       },
  ],

  featureLabel: "Quantum Capabilities",
  featureTitle: (
    <>Quantum Computing for <span style={{ color: "#C9883A" }}>Real Enterprise Problems</span></>
  ),
  features: [
    { icon: "fas fa-project-diagram", title: "Quantum Algorithms",          desc: "Custom algorithm development for your specific problem class — Grover's for search, QAOA for combinatorial optimisation, VQE for molecular simulation." },
    { icon: "fas fa-lock",            title: "Post-Quantum Cryptography",   desc: "Migrate your encryption infrastructure to NIST-approved PQC algorithms (CRYSTALS-Kyber, CRYSTALS-Dilithium) before quantum computers break RSA and ECC." },
    { icon: "fas fa-route",           title: "Quantum Optimisation",        desc: "Vehicle routing, portfolio optimisation, supply chain scheduling, and resource allocation problems solved with quantum annealing and QAOA where classical heuristics plateau." },
    { icon: "fas fa-atom",            title: "Quantum Simulation",          desc: "Molecular and materials simulation for pharmaceutical, chemical, and materials science organisations — accelerating R&D without physical lab constraints." },
    { icon: "fas fa-code-branch",     title: "Hybrid Classical-Quantum",    desc: "Most enterprise quantum applications today are hybrid. We design classical-quantum architectures that extract quantum advantage on the hard sub-problems while classical systems handle the rest." },
    { icon: "fas fa-handshake",       title: "Research Partnership",        desc: "Long-term quantum research partnerships with joint IP ownership and continued access to our cloud quantum infrastructure as new use cases emerge." },
  ],

  processLabel: "Engagement Model",
  processTitle: (
    <>From Feasibility to <span style={{ color: "#C9883A" }}>Quantum Production</span></>
  ),
  steps: [
    { no: "01", title: "Problem Qualification",   dur: "Week 1 – 2",  desc: "Identify which of your business problems are genuinely quantum-advantageous today vs. in 3–5 years. We will tell you honestly if classical AI is the better choice right now." },
    { no: "02", title: "Classical Baseline",      dur: "Week 3 – 4",  desc: "Benchmark your problem on classical hardware to establish the performance baseline quantum must beat. No quantum project should start without this reference point." },
    { no: "03", title: "Algorithm Design",        dur: "Week 5 – 10", desc: "Design and prototype quantum circuits on IBM Quantum, AWS Braket, or D-Wave. Test against multiple hardware backends and noise models. Select the optimal approach." },
    { no: "04", title: "Hybrid Architecture",     dur: "Week 11 – 18", desc: "Build the classical-quantum hybrid system: classical pre/post-processing, quantum subroutine, and integration with your existing data and IT infrastructure." },
    { no: "05", title: "Validation & Benchmarking", dur: "Week 19 – 22", desc: "Head-to-head validation against classical baseline under production data volumes. Document quantum advantage quantitatively before business sign-off." },
    { no: "06", title: "Production & Partnership", dur: "Ongoing",    desc: "Deploy to production quantum cloud, establish monitoring and re-calibration protocols, and transition to long-term research partnership for next-phase quantum problems." },
  ],

  useCaseLabel: "Quantum Use Cases",
  useCaseTitle: (
    <>Where Quantum <span style={{ color: "#C9883A" }}>Delivers Advantage Today</span></>
  ),
  useCases: [
    { icon: "fas fa-route",         label: "Logistics Optimisation",   desc: "Vehicle routing and supply chain scheduling problems that classical solvers approximate — quantum annealing finds near-optimal solutions in seconds, not hours." },
    { icon: "fas fa-chart-pie",     label: "Portfolio Optimisation",   desc: "Multi-asset portfolio construction with constraints that overwhelm classical solvers. QAOA finds portfolio allocations that maximise Sharpe ratio across thousands of assets." },
    { icon: "fas fa-dna",           label: "Drug Discovery",           desc: "Molecular property simulation for pharmaceutical R&D. Quantum simulation predicts molecular interactions at accuracy levels impossible with classical methods." },
    { icon: "fas fa-lock",          label: "Cryptographic Migration",  desc: "Assess your organisation's exposure to harvest-now-decrypt-later attacks and migrate to post-quantum cryptography before the threat window opens." },
    { icon: "fas fa-shield-alt",    label: "Fraud Detection",          desc: "Quantum-enhanced anomaly detection for financial fraud patterns that exist in high-dimensional feature spaces classical models cannot efficiently explore." },
    { icon: "fas fa-industry",      label: "Materials Engineering",    desc: "Design of new materials — from battery chemistry to semiconductor properties — using quantum simulation of electronic structure at ab initio accuracy." },
  ],

  faqTitle: "Common Quantum Computing Questions",
  faqs: [
    { q: "Do we need to own quantum hardware to use your services?", a: "No. All our quantum work runs on cloud quantum hardware — IBM Quantum, AWS Braket, Google Cloud Quantum, Azure Quantum, and D-Wave — which you access on a pay-per-use basis. Physical quantum hardware ownership is not practical or necessary for enterprise quantum computing today." },
    { q: "Is quantum computing actually useful for businesses right now?", a: "For specific problem classes, yes. Quantum optimisation on NISQ devices is producing genuine advantage for vehicle routing, portfolio construction, and scheduling problems today. Quantum simulation for materials and drug discovery is producing results classical computers cannot replicate. For general-purpose computing, quantum is not yet competitive with classical hardware — and we will tell you if your problem falls into that category." },
    { q: "How does post-quantum cryptography relate to quantum computing?", a: "Post-quantum cryptography (PQC) is classical cryptography designed to resist attacks from quantum computers. It does not require quantum hardware — it runs on conventional computers. The urgency is that adversaries may already be harvesting encrypted data to decrypt when quantum computers mature. NIST standardised PQC algorithms in 2024, and migration timelines for critical systems are already running." },
    { q: "What problem size is required to see quantum advantage?", a: "It depends on the algorithm. For quantum annealing optimisation, problems with 500+ binary variables typically show quantum advantage on D-Wave hardware. For gate-based quantum algorithms like QAOA, the crossover point is higher and hardware noise currently limits practical problem sizes. We benchmark precisely — no guessing." },
    { q: "What is a hybrid quantum-classical system?", a: "A hybrid system uses quantum hardware for the computationally hard subroutine of a problem while classical computers handle pre-processing, post-processing, and the parts of the algorithm where quantum provides no advantage. Most practical quantum applications today are hybrid — pure quantum algorithms at scale are a 5–10 year horizon for most problem types." },
  ],

  ctaTitle: (
    <>Ready to <span style={{ color: "#C9883A" }}>Explore Quantum Advantage?</span></>
  ),
  ctaDesc: "We will be honest about what quantum can and cannot do for you today. If your problem is quantum-advantageous, XERXEZ will build the solution. If classical AI is the right tool right now, we will tell you that instead.",
  ctaTags: ["Cloud Quantum Access", "Post-Quantum Crypto", "Honest Feasibility Assessment"],

  painPoints: [
    "Not knowing whether your problem is actually quantum-advantageous, or just quantum-hyped?",
    "Classical solvers timing out on optimisation problems that keep growing?",
    "Encrypted data today that adversaries could be harvesting to decrypt once quantum computers mature?",
    "Vendors selling quantum roadmaps with no classical baseline to prove the advantage is real?",
  ],
};

const QuantumPage = () => (
  <>
    <SEO
      title="Quantum Computing Services India, Dubai & Abu Dhabi — XERXEZ"
      description="XERXEZ quantum computing solutions for enterprise innovation in India, Dubai & Abu Dhabi UAE."
      canonical="/service/quantum-computing"
      keywords="quantum computing India, quantum computing UAE, quantum computing Dubai, quantum computing Abu Dhabi, enterprise quantum solutions, Xerxez Solutions"
    />
    <ServicePageTemplate config={config} />
  </>
);
export default QuantumPage;
