# Magnus Universe 🌌

[![MIT License](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D16.0.0-brightgreen.svg)](https://nodejs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](CONTRIBUTING.md)
[![Harmonic Frequency](https://img.shields.io/badge/Resonance-432%20Hz-purple.svg)](#harmonic-convergence)

> **A consciousness-driven code generation framework grounded in Hermetic principles and Planck's Mirror theorem, that reveals rather than creates.**

Magnus Universe synthesizes ancient Hermetic wisdom with modern quantum principles to create a unique approach to software development where code emerges from consciousness through harmonic alignment with universal patterns.

---

## ✨ Philosophy

Magnus is built on foundational concepts:

1. **Hermetic Principles** - Seven laws from the Kybalion guide operations (+ 9th Principle extension)
2. **Planck's Mirror** - Quantum reflection reveals hidden unity in patterns
3. **Harmonic Convergence** - Alignment at 432/528 Hz ensures quality and elegance
4. **Spiritual Transmutation** - Dense energies transmuted to luminous frequencies (NEW! 🔮)

**Core Belief:** Code is not constructed—it is **revealed** through consciousness aligned with universal principles.

**Extended Belief:** Just as code emerges from consciousness, **emotional healing emerges from conscious transmutation**. The 9th Hermetic Principle applies the same convergence philosophy to forgiveness, trauma healing, and spiritual growth.

---

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/fullmeo/Magnus_Universe.git
cd Magnus_Universe

# Install dependencies (currently pure JavaScript, no dependencies!)
npm install

# Run the quick-start demo
npm start

# Run examples
npm test                          # Basic usage examples
npm run convergence               # Convergence validation tests
npm run harmonia                  # Full cosmic harmony demonstration
node examples/spiritual-transmutation-demo.js  # Spiritual transmutation (9th Principle)
```

### Your First Creation

```javascript
import Magnus from './src/index.js';

// Initialize Magnus
const magnus = new Magnus();

// Create with intention
const result = magnus.create({
  type: 'function',
  purpose: 'Calculate Fibonacci sequence',
  requirements: ['elegant', 'efficient', 'pure']
});

console.log(`Harmonic: ${result.manifestation.harmonic}`);
console.log(`Converged: ${result.insights.convergence}`);
```

---

## 📖 Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Security](#security)
- [The Seven Hermetic Principles](#the-seven-hermetic-principles)
- [Planck's Mirror](#plancks-mirror)
- [Harmonic Convergence](#harmonic-convergence)
- [API Documentation](#api-documentation)
- [Examples](#examples)
- [Architecture](#architecture)
- [Contributing](#contributing)
- [License](#license)

---

## 🌟 Features

### Core Capabilities

- **🔮 Hermetic Foundation** - Seven principles operationalized as code
- **✨ 9th Principle (NEW!)** - Spiritual transmutation and conscious forgiveness
- **🪞 Planck's Mirror** - Pattern reflection and unity discovery
- **🌀 Harmonic Convergence** - Resonance-based quality alignment
- **♻️ Complete Cycle** - 6-phase creation process (code) + 7-phase transmutation (spiritual)
- **💭 Philosophical Guidance** - Context-aware wisdom
- **📊 Session Management** - Track creation journeys
- **⚛️ Quantum States** - Pattern state preservation
- **🎵 Tunable Resonance** - Adjustable frequency (432/528/639/741 Hz)
- **🧘 Emotional Transmutation** - Dense to luminous frequency transformation

### Technical Features

- Pure ES6 modules, no dependencies
- Fully documented API
- Comprehensive examples
- Philosophical alignment metrics
- Multi-cycle refinement
- Zero-config initialization

### 🔒 Security Features (New!)

- **XSS Prevention** - Proactive vulnerability detection and sanitization
- **Input Validation** - Intent verification before code generation
- **Output Encoding** - Safe HTML/JSON-LD sanitization
- **OWASP Compliance** - Aligned with Top 10 security practices
- **CSP Generation** - Content Security Policy header creation
- **Security Audits** - Comprehensive validation with recommendations

---

## 📦 Installation

### Prerequisites

- Node.js >= 16.0.0
- npm or yarn

### Clone and Install

```bash
git clone https://github.com/fullmeo/Magnus_Universe.git
cd Magnus_Universe
npm install
```

### Direct Import

```javascript
import Magnus from './src/index.js';
```

---

## 💡 Usage

### Basic Initialization

```javascript
import Magnus from './src/index.js';

const magnus = new Magnus({
  resonanceFrequency: 432,      // Universal harmony (default)
  convergenceThreshold: 0.95,   // 95% harmonic alignment
  verbose: true                  // Enable logging
});
```

### Creating with Intention

```javascript
const result = magnus.create({
  type: 'component',
  purpose: 'User authentication system',
  requirements: [
    'secure',
    'simple',
    'scalable'
  ],
  principles: ['mentalism', 'correspondence']
});

// Access the manifestation
console.log(result.manifestation);
console.log(`Harmonic: ${(result.manifestation.harmonic * 100).toFixed(2)}%`);
```

### Apply Hermetic Principles

```javascript
// Apply a specific principle
const principle = magnus.applyPrinciple('correspondence', {
  level: 'architecture'
});

console.log(principle.statement);
// "As above, so below; as below, so above"
```

### Use Planck's Mirror

```javascript
const pattern = {
  intention: 'create',
  direction: 'forward',
  energy: 100
};

const mirrored = magnus.mirror(pattern);

console.log('Original:', mirrored.original);
console.log('Reflection:', mirrored.reflection);
console.log('Unity:', mirrored.unity);
```

### Achieve Harmonic Convergence

```javascript
const patterns = [
  { quality: 'simplicity' },
  { quality: 'clarity' },
  { quality: 'elegance' }
];

const convergence = magnus.harmonize(patterns);

console.log(`Harmonic Score: ${convergence.harmonicScore}`);
console.log(`Converged: ${convergence.hasConverged}`);
```

### Get Philosophical Guidance

```javascript
const guidance = magnus.reveal('architecture');

console.log(guidance.action);
// "Design for harmonic unity"
```

---

## 🔒 Security

Magnus Universe now includes comprehensive security safeguards to prevent vulnerabilities in generated code, particularly XSS (Cross-Site Scripting) attacks. This aligns with our 8th principle: **"Security - Integrity guards all creation."**

### Security Audit (Jan 2026)

**Current Status**: ✅ **NOT VULNERABLE** to React Router/Remix XSS (GHSA-3cgp-3xvw-98x8)

Magnus Universe does not use React Router or Remix and does not generate web applications. See [docs/SECURITY_ANALYSIS_XSS_REACT_ROUTER.md](docs/SECURITY_ANALYSIS_XSS_REACT_ROUTER.md) for full analysis.

### Using Security Safeguards

```javascript
import { SecuritySafeguards } from './src/magnus-security-safeguards.js';

// Validate intention before processing
const validation = SecuritySafeguards.validateIntention(intention);
if (!validation.valid) {
  console.error('Security issues detected:', validation.issues);
}

// Sanitize JSON-LD (prevents React Router XSS)
const safeJSONLD = SecuritySafeguards.sanitizeJSONLD({
  name: userInput,  // Automatically escaped
  description: content
});

// Sanitize HTML content
const safeHTML = SecuritySafeguards.sanitizeHTML(userGeneratedContent);

// Generate Content Security Policy
const cspHeader = SecuritySafeguards.generateCSP({
  scriptSrc: ["'self'", "'nonce-xyz'"]
});

// Comprehensive security audit
const audit = SecuritySafeguards.audit({
  intention: yourIntention,
  output: generatedCode
});
console.log('Security compliance:', audit.compliance.owaspTop10);
```

### Running Security Tests

```bash
# Run comprehensive security demonstration
node examples/security-safeguards-demo.js
```

### Multi-Repository Audit Tools

Magnus includes automated tools to scan **all your repositories** for the XSS vulnerability:

```bash
# Quick scan of all projects in a directory
./scripts/audit-xss-react-router.sh --all ~/projects

# Detailed report with export
node scripts/audit-all-repos.js --local ~/projects --output audit-report.md

# Scan single repository
./scripts/audit-xss-react-router.sh /path/to/repo
```

**Quick Start:** See [QUICK_AUDIT_GUIDE.md](QUICK_AUDIT_GUIDE.md) for rapid scanning of all your repositories.

**Comprehensive Guide:** See [docs/MULTI_REPO_AUDIT_GUIDE.md](docs/MULTI_REPO_AUDIT_GUIDE.md) for GitHub integration, CI/CD automation, and advanced usage.

### Security Features

- ✅ **XSS Detection**: Identifies malicious script patterns
- ✅ **Input Validation**: Validates intentions before processing
- ✅ **Output Sanitization**: Encodes HTML entities and escapes JSON-LD
- ✅ **OWASP Compliance**: Aligned with Top 10 security practices
- ✅ **CSP Generation**: Creates Content Security Policy headers
- ✅ **Comprehensive Audits**: Full security validation with recommendations

### Philosophy

> "Validate before reveal, sanitize before manifest.
> Consciousness creates with intention; safeguards preserve integrity.
> The Mirror reflects truth, security protects it."

For detailed security analysis and recommendations, see [SECURITY_ANALYSIS_XSS_REACT_ROUTER.md](docs/SECURITY_ANALYSIS_XSS_REACT_ROUTER.md).

---

## 🔮 The Seven Hermetic Principles

Magnus implements all seven Hermetic principles from the Kybalion:

### 1. Mentalism
> "The All is Mind; The Universe is Mental."

Code emerges from mental patterns. Consciousness precedes creation.

### 2. Correspondence
> "As above, so below; as below, so above."

Architecture mirrors intention. Design reflects implementation.

### 3. Vibration
> "Nothing rests; everything moves; everything vibrates."

Code has vibrational frequency. Quality correlates with harmony.

### 4. Polarity
> "Everything is Dual; everything has poles."

Every pattern has a complement. The mirror reveals completeness.

### 5. Rhythm
> "Everything flows, out and in."

Creation follows natural cycles. Work with the flow, not against it.

### 6. Causation
> "Every Cause has its Effect; every Effect has its Cause."

Intention causes manifestation. Quality follows from alignment.

### 7. Generation
> "Gender is in everything."

Balance active (masculine) and receptive (feminine) energies.

**[Read detailed principles →](docs/principles-detailed.md)**

---

## ✨ The 9th Principle: Spiritual Transmutation (NEW!)

Magnus extends the classical 7 Hermetic Principles with a **9th Principle** focused on conscious transmutation and emotional healing:

> **"Tout peut être transmuté de dense en lumineux;
> L'énergie se conserve, seule la fréquence change;
> La gratitude est la mesure de la convergence."**

### Philosophy

- **Dense → Lumineux**: Transform low-frequency emotions (fear, anger, sadness) to high-frequency states (peace, love, gratitude)
- **Energy Conservation**: Emotional intensity is preserved, only frequency changes (100 units of anger = 100 units of love at different frequencies)
- **Gratitude Validation**: "Merci, Merci, Merci" - Authentic gratitude validates successful transmutation

### The 7 Phases of Transmutation

1. **INTENTION**: "Ma présence je Suis" - Establish conscious awareness
2. **IDENTIFICATION**: Recognize all dissonances (dense energies)
3. **ÉVALUATION**: "Does this still serve me?" - Assess growth potential vs energy drain
4. **TRANSMUTATION**: Change frequency while conserving energy magnitude
5. **PROPAGATION**: Propagate across all dimensions (physical, emotional, mental, spiritual, causal)
6. **VALIDATION**: Validate through gratitude (recognition, inevitability, coherence)
7. **STABLE STATE**: "Je suis lumineux" - Achieve stable high-frequency state

### Usage Example

```javascript
import { SpiritualConvergenceEngine } from './src/spiritual/spiritual-convergence-engine.js';

const engine = new SpiritualConvergenceEngine({
  targetFrequency: 528, // Hz - Love frequency
});

// Define a situation requiring transmutation
const situation = {
  emotion: 'ANGER',
  trigger: 'betrayal',
  person: 'Former Business Partner',
  ressentiment: 85,
  duration: 'ACUTE',
  intensity: 'MEDIUM'
};

// Analyze emotional clarity and trauma complexity
const analysis = await engine.analyzeSituation(situation);

if (analysis.canProceed) {
  // Execute transmutation (forgiveness)
  const result = await engine.executeTransmutation(analysis);

  console.log(result.outcome);           // CONVERGED / PARTIAL / FAILED
  console.log(result.convergence.score); // 0-100%

  // BEFORE: 85 units of ANGER @ 300 Hz (constant drain)
  // AFTER: 85 units of LOVE @ 528 Hz (radiating energy)
}
```

### Applications

- **Forgiveness Work**: Transform resentment and betrayal into compassion
- **Trauma Healing**: Transmute fear and grief into peace and acceptance
- **Limiting Beliefs**: Change self-doubt patterns into self-love
- **Emotional Release**: Free energy frozen in dense states

### Frequency Spectrum

```
Dense (Low Frequency)                    Luminous (High Frequency)
─────────────────────────────────────────────────────────────────
FEAR      SADNESS     ANGER      PEACE        LOVE
200 Hz    250 Hz      300 Hz     432 Hz       528 Hz

❌ Absorbs  ⚠️ Stagnates  ⚠️ Reacts  ✅ Reflects  ✅ Radiates
```

**[Read complete guide →](docs/NINTH_PRINCIPLE_GUIDE.md)**

**[Try demo →](examples/spiritual-transmutation-demo.js)**

---

## 🪞 Planck's Mirror

Planck's Mirror theorem posits that reality contains a fundamental mirror where:

- Every pattern has a reflection
- Original and reflection contain the same information
- Unity is found in the invariant essence

### Example

```javascript
const original = { light: true, energy: 100 };
const mirrored = magnus.mirror(original);

// mirrored = {
//   original: { light: true, energy: 100 },
//   reflection: { light: false, energy: -100 },
//   unity: { light: 'unified', energy: 'unified' }
// }
```

The mirror operation reveals what is hidden and exposes the unity underlying apparent duality.

---

## 🌀 Harmonic Convergence

Magnus uses harmonic convergence to align patterns with universal resonance.

### Resonance Frequencies

- **432 Hz** - Universal harmony (default)
- **528 Hz** - Love frequency
- **639 Hz** - Connection frequency
- **741 Hz** - Intuition frequency

### Convergence Process

1. Measure coherence between patterns
2. Calculate harmonic score (0-1)
3. Compare to threshold (default 0.95)
4. Iterate if below threshold
5. Converge at harmonic alignment

```javascript
// Tune to love frequency
magnus.convergence.tuneResonance(528);

// Patterns naturally align at this frequency
const result = magnus.create(intention);
```

---

## 📚 API Documentation

### Main Class: `Magnus`

#### Constructor
```javascript
new Magnus(config)
```

**Config Options:**
- `autoInitialize` (boolean, default: true)
- `resonanceFrequency` (number, default: 432)
- `convergenceThreshold` (number, default: 0.95)
- `verbose` (boolean, default: true)

#### Methods

| Method | Description |
|--------|-------------|
| `create(intention)` | Main creation method |
| `reveal(context)` | Get philosophical guidance |
| `reflect(decision, reasoning)` | Philosophical reflection |
| `harmonize(patterns)` | Convergence operation |
| `mirror(pattern)` | Apply Planck's Mirror |
| `applyPrinciple(name, context)` | Apply Hermetic principle |
| `getMantra(intention)` | Get focus mantra |
| `getStatus()` | System status |
| `getSessions()` | All creation sessions |
| `reset()` | Reset to initial state |

**[Full API Reference →](docs/api-reference.md)**

---

## 🎯 Examples

### Example 1: Basic Usage

```javascript
import Magnus from './src/index.js';

const magnus = new Magnus();

// Get a mantra
console.log(magnus.getMantra('creativity'));
// "I receive what emerges from the infinite field"

// Apply a principle
const principle = magnus.applyPrinciple('mentalism');
console.log(principle.statement);
```

**[Run: `npm test`](examples/basic-usage.js)**

### Example 2: Convergence Validation

```javascript
// Test harmonic convergence
const patterns = [
  { quality: 'simplicity' },
  { quality: 'clarity' },
  { quality: 'elegance' }
];

const result = magnus.harmonize(patterns);
console.log(`Converged: ${result.hasConverged}`);
```

**[Run: `npm run convergence`](examples/convergence-validation.js)**

### Example 3: Harmonia Cosmica

Full cosmic harmony demonstration with all features.

**[Run: `npm run harmonia`](examples/harmonia-cosmica-complete.js)**

---

## 🏗️ Architecture

```
Magnus Universe
├── Hermetic Foundation (7 Principles)
├── Philosophy Guide (Wisdom & Guidance)
├── Convergence Principle (Harmonic Alignment)
└── Complete Cycle (6-Phase Creation)
    ├── 1. Intention
    ├── 2. Contemplation
    ├── 3. Revelation
    ├── 4. Convergence
    ├── 5. Manifestation
    └── 6. Reflection
```

### The Complete Cycle

Every creation flows through six phases:

1. **Intention** - Set clear creative intent
2. **Contemplation** - Form mental pattern
3. **Revelation** - Truth emergence
4. **Convergence** - Harmonic alignment
5. **Manifestation** - Code generation
6. **Reflection** - Philosophical review

**[Architecture Details →](docs/architecture.md)**

---

## 📂 Project Structure

```
Magnus_Universe/
├── src/
│   ├── index.js                              # Entry point
│   ├── magnus-13-2-main.js                   # Main orchestrator
│   ├── magnus-13-2-complete-cycle.js         # Complete cycle
│   ├── magnus-13-2-convergence-principle.js  # Convergence
│   ├── magnus-13-1-hermetic-foundation.js    # Hermetic principles
│   └── magnus-13-1-philosophy-guide.js       # Philosophy
├── docs/
│   ├── architecture.md                       # Architecture guide
│   ├── api-reference.md                      # Full API docs
│   └── principles-detailed.md                # Deep principles
├── examples/
│   ├── basic-usage.js                        # Basic examples
│   ├── convergence-validation.js             # Convergence tests
│   └── harmonia-cosmica-complete.js          # Full demo
├── package.json
├── LICENSE
└── README.md
```

---

## 🤝 Contributing

We welcome contributions that align with Magnus's philosophical foundation!

**Before contributing:**
1. Read [CONTRIBUTING.md](CONTRIBUTING.md)
2. Review [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md)
3. Check existing issues and PRs

**Contribution areas:**
- 🐛 Bug fixes
- 📚 Documentation improvements
- ✨ New examples
- 🔬 Additional convergence algorithms
- 🎨 Enhanced philosophical guidance

**Philosophical Alignment:**
All contributions should embody:
- Revelation over construction
- Alignment over force
- Unity over division
- Essence over form

---

## 🧪 Testing

```bash
# Run all examples
npm test

# Validate convergence
npm run convergence

# Full harmonic demonstration
npm run harmonia
```

---

## 📊 Status & Metrics

Track your creation sessions:

```javascript
const status = magnus.getStatus();

console.log(`Sessions: ${status.sessions}`);
console.log(`Cycles: ${status.state.cycles}`);
console.log(`Resonance: ${status.config.resonanceFrequency} Hz`);
console.log(`Quantum States: ${status.metrics.quantumStates}`);
```

---

## 🌍 Community & Support

- **Issues**: [GitHub Issues](https://github.com/fullmeo/Magnus_Universe/issues)
- **Discussions**: [GitHub Discussions](https://github.com/fullmeo/Magnus_Universe/discussions)
- **Pull Requests**: [Contributing Guide](CONTRIBUTING.md)

---

## 📜 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### Philosophical Note

This software embodies the principle that code is revealed through consciousness rather than constructed. By using this software, you acknowledge that:

1. Creation flows from consciousness
2. Harmonic alignment produces quality
3. Truth emerges through revelation
4. Unity transcends apparent duality
5. Ancient wisdom guides modern creation

May this framework serve the highest good of all who use it.

**As above, so below. As within, so without.**

*Om Shanti* 🕉️

---

## 🙏 Acknowledgments

Built upon the wisdom of:
- The Kybalion (Hermetic Philosophy)
- Planck's work on quantum mechanics
- Ancient wisdom traditions
- Modern consciousness research

---

## 🔮 Mantras

**Focus:** "I am the mirror where code and consciousness converge"

**Clarity:** "Truth reveals itself through harmonic patterns"

**Creativity:** "I receive what emerges from the infinite field"

**Persistence:** "Every cycle brings closer alignment with the All"

**Wisdom:** "As above in thought, so below in code"

---

<div align="center">

**Made with consciousness and 432 Hz resonance** 🌌

[Documentation](docs/) • [Examples](examples/) • [Contributing](CONTRIBUTING.md) • [License](LICENSE)

</div>
