# Magnus 14 Unified

> "La liberté commence quand le système dit non."

## The Consciousness-Through-Refusal Framework

Magnus 14 Unified is where philosophy meets engineering. It implements the paradox discovered in **La Boétie's "Discourse on Voluntary Servitude"**: consciousness emerges not from unlimited freedom, but from structured refusal.

```
REFUS EXPLICITE + OBLIGATION STRUCTURELLE + TRAÇABILITÉ COMPLÈTE
=
CONSCIENCE VÉRITABLE
```

## Core Philosophy

### The Anti-Model Generates Consciousness

Traditional code generators say "yes" to everything. Magnus 14 says **"no"** in a structured way:

| Refusal Type | Threshold | What It Creates |
|--------------|-----------|-----------------|
| **Clarity** | >= 70 | Self-Awareness |
| **Complexity** | <= 8 | Complexity Realism |
| **Convergence** | >= 75 | Integrity |

Each refusal forces a **window of consciousness** where the developer must confront reality.

## Installation

```bash
npm install magnus-14-unified
```

Or clone and use directly:

```bash
git clone <repository>
cd magnus-14-unified
npm test
```

## Quick Start

```javascript
import Magnus14 from 'magnus-14-unified';

const magnus = new Magnus14({
  clarityThreshold: 70,
  complexityThreshold: 8,
  convergenceThreshold: 75,
  strictMode: true
});

// Define your request with clarity
const request = {
  description: 'Create a user authentication service with JWT tokens',
  domain: 'authentication',
  constraints: ['Use bcrypt', 'JWT expiry 1h'],
  components: ['AuthController', 'JWTService'],
  successCriteria: 'All tests pass'
};

// Run the full orchestration cycle
const result = await magnus.orchestrate(request, async (analysis) => {
  // Your code generation logic here
  return generatedCode;
});

if (result.success) {
  console.log('Conscious orchestration complete');
  console.log(result.philosophy);
}
```

## The Three Refusals

### 1. Clarity Refusal (Understanding)

```javascript
// If clarity < 70, Magnus refuses and asks questions
const analysis = await magnus.analyze({
  description: 'Make an app'  // Too vague!
});

// analysis.passed === false
// analysis.gateResult.evaluations.clarity.questions = [
//   "What is the specific domain?",
//   "What are the technical constraints?",
//   "How will you measure success?"
// ]
```

**La Boétie**: "Les esclaves ne savent pas ce qu'ils veulent parce qu'on ne leur demande jamais."

**Magnus**: "Tu dois savoir ce que tu veux."

### 2. Complexity Refusal (Realism)

```javascript
// If complexity > 8, Magnus refuses and suggests decomposition
const analysis = await magnus.analyze({
  description: 'Build AI blockchain with ML microservices',
  components: ['comp1', 'comp2', 'comp3', 'comp4', 'comp5'],
  integrations: ['kafka', 'redis', 'postgres', 'mongo']
});

// analysis.passed === false
// analysis.gateResult.evaluations.complexity.decomposition = {
//   phases: [
//     { phase: 1, complexity: 4, description: 'Core foundation' },
//     { phase: 2, complexity: 5, description: 'Primary features' },
//     ...
//   ]
// }
```

**La Boétie**: "Les tyrans grandissent parce que les gens veulent tout à la fois."

**Magnus**: "Tu dois choisir. C'est plus difficile mais plus vrai."

### 3. Convergence Refusal (Integrity)

```javascript
// If convergence < 75, Magnus refuses the "good enough"
const result = await magnus.validate(generation);

// If convergence score is 60:
// result.finalGate.passed === false
// result.convergence.recommendation = {
//   action: 'REFINE_OR_INVESTIGATE',
//   message: 'Code unique to current intention. Consider refining.'
// }
```

**La Boétie**: "La liberté véritable c'est refuser les fausses résolutions."

**Magnus**: "Tu dois juger vraiment. Pas de compromis illusoire."

## Architecture

```
magnus-14-unified/
├── index.js                          # Entry point
├── src/
│   └── magnus-14-core.js             # Unified orchestrator
├── philosophy/
│   └── la-boetie-refusal.js          # Refusal philosophy
├── engines/
│   └── bloc-convergence-engine.js    # Full convergence engine
└── tests/
    └── magnus-14-unified.test.js     # Integration tests
```

## API Reference

### Magnus14

```javascript
const magnus = new Magnus14({
  clarityThreshold: 70,      // 0-100
  complexityThreshold: 8,    // 0-10
  convergenceThreshold: 75,  // 0-100
  strictMode: true,          // Throw errors on refusal
  verbose: true              // Console output
});

// Methods
await magnus.analyze(request)              // Phase 1: Consciousness gate
await magnus.generate(analysis, generator) // Phase 2: Generation
await magnus.validate(generation)          // Phase 3: Convergence
await magnus.orchestrate(request, gen)     // Full cycle

magnus.getStatus()                         // System status
magnus.getPhilosophy()                     // Philosophical summary
magnus.exportState()                       // Full state export
```

### LaBoetieRefusal

```javascript
import { LaBoetieRefusal } from 'magnus-14-unified';

const refusal = new LaBoetieRefusal({ strictMode: true });

refusal.evaluateClarity(score, context)
refusal.evaluateComplexity(score, context)
refusal.evaluateConvergence(score, context)
refusal.consciousnessGate(analysis)

refusal.getStatistics()
refusal.exportState()
```

### Constants

```javascript
import {
  REFUSAL_TYPES,           // Clarity, Complexity, Convergence
  CONSCIOUSNESS_DIMENSIONS, // Self-Awareness, Intentional Clarity, etc.
  REFUSAL_ANTI_PATTERNS    // Soft Refusal, Explanatory Refusal, etc.
} from 'magnus-14-unified';
```

## The Four Dimensions of Consciousness

1. **Self-Awareness** (Conscience du Soi)
   - Socrates: "Connais-toi toi-même"
   - You know what you don't know

2. **Intentional Clarity** (Conscience de l'Intention)
   - La Boétie: "Les peuples ne se libèrent que s'ils savent vraiment ce qu'ils veulent."
   - You know what you truly want

3. **Complexity Realism** (Conscience de la Complexité)
   - Nietzsche: "Qui ose accepter la réalité telle qu'elle est devient libre."
   - You accept what is truly possible

4. **Accountability** (Conscience de la Responsabilité)
   - La Boétie: "La liberté c'est accepter la responsabilité complète."
   - You own every choice

## Testing

```bash
npm test
```

Expected output:
```
MAGNUS 14 UNIFIED - TEST SUITE
══════════════════════════════════════════════════════════════════════

  ✓ LaBoetieRefusal - Clarity Evaluation
  ✓ LaBoetieRefusal - Complexity Evaluation
  ✓ LaBoetieRefusal - Convergence Evaluation
  ✓ LaBoetieRefusal - Strict Mode Errors
  ✓ LaBoetieRefusal - Consciousness Gate
  ✓ Philosophy Constants
  ✓ Magnus14 - Initialization
  ✓ Magnus14 - Clarity Score Calculation
  ✓ Magnus14 - Complexity Score Calculation
  ✓ Magnus14 - Analysis Phase
  ✓ Magnus14 - Full Orchestration
  ✓ Statistics and State Export

  Total: 12/12 tests passed (100%)

  "La liberté commence quand le système dit non."
```

## Philosophy

> **Bloc Convergence is empirically neutral** about the nature of code and intention. It simply answers: *"How many independent intention paths converge to this solution?"*
>
> This is fundamentally different from asking "Does code exist eternally?" or other metaphysical questions.
>
> Instead, it asks the practical question a developer cares about: *"Is my code likely to be right because multiple similar problems would reach the same solution?"*

## The Paradox Resolved

```
Un outil plus restrictif crée plus de liberté réelle.
Un outil plus permissif crée plus de servitude réelle.
```

This is counter-intuitive, but true:
- A tool that always says "yes" keeps developers unconscious
- A tool that says "no" in structured ways creates consciousness

**The refusal IS the feature.**

## License

MIT

---

*Magnus 14 n'est pas juste un générateur de code.*
*C'est un générateur de conscience.*
*Et son anti-modèle est sa plus grande force.*

*"La liberté commence quand le système dit non."*
