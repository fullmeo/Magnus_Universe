# Magnus Universe - API Reference

## Main Class: Magnus

### Constructor

```javascript
new Magnus(config)
```

**Parameters:**
- `config` (Object, optional)
  - `autoInitialize` (boolean, default: true) - Initialize on creation
  - `resonanceFrequency` (number, default: 432) - Harmonic frequency in Hz
  - `convergenceThreshold` (number, default: 0.95) - Required harmonic alignment (0-1)
  - `verbose` (boolean, default: true) - Enable logging

**Example:**
```javascript
import Magnus from './src/index.js';

const magnus = new Magnus({
  resonanceFrequency: 528,  // Love frequency
  convergenceThreshold: 0.98,
  verbose: true
});
```

---

### Methods

#### `initialize()`

Initializes all Magnus subsystems.

**Returns:** `this` (for chaining)

**Example:**
```javascript
magnus.initialize();
```

---

#### `create(intention)`

Main creation method. Executes complete cycle from intention to manifestation.

**Parameters:**
- `intention` (Object) - Creation intent and requirements

**Returns:** Object
```javascript
{
  session: Session,           // Session information
  manifestation: Object,      // Generated manifestation
  insights: Object            // Creation insights
}
```

**Example:**
```javascript
const result = magnus.create({
  type: 'function',
  purpose: 'Calculate Fibonacci sequence',
  requirements: ['recursive', 'elegant', 'efficient']
});

console.log(result.manifestation);
console.log(`Harmonic: ${result.manifestation.harmonic}`);
```

---

#### `reveal(context)`

Get philosophical guidance for a specific context.

**Parameters:**
- `context` (string) - Context type: 'creation', 'problem-solving', 'architecture', 'debugging', or 'general'

**Returns:** Object
```javascript
{
  context: string,
  approach: string,
  mindset: string,
  action: string,
  principle: string
}
```

**Example:**
```javascript
const guidance = magnus.reveal('architecture');
console.log(guidance.action); // "Design for harmonic unity"
```

---

#### `reflect(decision, reasoning)`

Perform philosophical reflection on a decision.

**Parameters:**
- `decision` (string) - The decision made
- `reasoning` (string) - Reasoning behind the decision

**Returns:** Object
```javascript
{
  decision: string,
  reasoning: string,
  philosophicalAlignment: Object,
  suggestion: Array<string>
}
```

**Example:**
```javascript
const reflection = magnus.reflect(
  'Use composition over inheritance',
  'Composition provides more flexibility and reveals emergent patterns'
);

console.log(reflection.philosophicalAlignment);
console.log(reflection.suggestion);
```

---

#### `harmonize(patterns)`

Apply convergence principle to achieve harmonic alignment.

**Parameters:**
- `patterns` (Array) - Patterns to harmonize

**Returns:** Object
```javascript
{
  cycle: number,
  harmonicScore: number,
  hasConverged: boolean,
  patterns: Array
}
```

**Example:**
```javascript
const result = magnus.harmonize([
  { intent: 'clarity' },
  { intent: 'simplicity' },
  { intent: 'elegance' }
]);

console.log(`Harmonic Score: ${result.harmonicScore}`);
console.log(`Converged: ${result.hasConverged}`);
```

---

#### `mirror(pattern)`

Apply Planck's Mirror theorem to a pattern.

**Parameters:**
- `pattern` (any) - Pattern to mirror

**Returns:** Object
```javascript
{
  original: any,
  reflection: any,
  unity: any
}
```

**Example:**
```javascript
const mirrored = magnus.mirror({
  energy: 'positive',
  direction: 'forward',
  value: 100
});

console.log('Original:', mirrored.original);
console.log('Reflection:', mirrored.reflection);
console.log('Unity:', mirrored.unity);
```

---

#### `applyPrinciple(principleName, context)`

Apply a specific Hermetic principle.

**Parameters:**
- `principleName` (string) - One of: 'mentalism', 'correspondence', 'vibration', 'polarity', 'rhythm', 'causation', 'generation'
- `context` (Object, optional) - Application context

**Returns:** Object
```javascript
{
  principle: string,
  statement: string,
  context: Object,
  resonance: number
}
```

**Example:**
```javascript
const principle = magnus.applyPrinciple('correspondence', {
  level: 'architecture'
});

console.log(principle.statement);
// "As above, so below; as below, so above"
```

---

#### `getMantra(intention)`

Get a philosophical mantra for focus.

**Parameters:**
- `intention` (string) - One of: 'focus', 'clarity', 'creativity', 'persistence', 'wisdom'

**Returns:** string - The mantra

**Example:**
```javascript
const mantra = magnus.getMantra('creativity');
console.log(mantra);
// "I receive what emerges from the infinite field"
```

---

#### `getStatus()`

Get current system status.

**Returns:** Object
```javascript
{
  initialized: boolean,
  config: Object,
  sessions: number,
  state: Object,
  metrics: Object
}
```

**Example:**
```javascript
const status = magnus.getStatus();
console.log(`Sessions: ${status.sessions}`);
console.log(`Resonance: ${status.config.resonanceFrequency} Hz`);
```

---

#### `getSessions()`

Get all creation sessions.

**Returns:** Array<Session>

**Example:**
```javascript
const sessions = magnus.getSessions();
sessions.forEach(session => {
  console.log(`${session.id}: ${session.cycles.length} cycles`);
});
```

---

#### `reset()`

Reset Magnus Universe to initial state.

**Returns:** `this` (for chaining)

**Example:**
```javascript
magnus.reset();
```

---

## Component Classes

### HermeticFoundation

```javascript
import { HermeticFoundation } from './src/index.js';

const hermetic = new HermeticFoundation();
hermetic.initialize();

// Apply principle
const result = hermetic.applyPrinciple('mentalism', { focus: 'code' });

// Check correspondence
const correspondence = hermetic.checkCorrespondence(
  { design: 'pattern' },
  { implementation: 'code' }
);

// Get all principles
const principles = hermetic.getAllPrinciples();
```

---

### PhilosophyGuide

```javascript
import { PhilosophyGuide } from './src/index.js';

const guide = new PhilosophyGuide();

// Get guidance
const guidance = guide.getGuidance('creation');

// Reflect on decision
const reflection = guide.reflect('decision', 'reasoning');

// Get mantra
const mantra = guide.generateMantra('focus');

// Get pillars
const pillars = guide.getPillars();
```

---

### ConvergencePrinciple

```javascript
import { ConvergencePrinciple } from './src/index.js';

const convergence = new ConvergencePrinciple();
convergence.initialize();

// Converge patterns
const result = convergence.converge([pattern1, pattern2, pattern3]);

// Apply Planck's Mirror
const mirrored = convergence.planckMirror(pattern);

// Tune resonance
convergence.tuneResonance(528); // Love frequency

// Get metrics
const metrics = convergence.getMetrics();

// Reset
convergence.reset();
```

---

### CompleteCycle

```javascript
import { CompleteCycle } from './src/index.js';

const cycle = new CompleteCycle();
cycle.initialize();

// Execute cycle
const result = cycle.executeCycle({
  type: 'component',
  purpose: 'User authentication'
});

// Get state
const state = cycle.getState();

// Get manifestations
const manifestations = cycle.getManifestations();
```

---

## Type Definitions

### Session
```javascript
{
  id: string,
  intention: Object,
  startTime: number,
  endTime: number,
  duration: number,
  cycles: Array<CycleResult>
}
```

### CycleResult
```javascript
{
  iteration: number,
  intention: Object,
  phases: {
    intention: Object,
    contemplation: Object,
    revelation: Object,
    convergence: Object,
    reflection: Object
  },
  manifestation: Manifestation
}
```

### Manifestation
```javascript
{
  code: Object,
  structure: Object,
  harmonic: number,
  timestamp: string
}
```

---

## Events & Logging

Magnus provides verbose logging by default. Set `verbose: false` in config to disable.

**Log Levels:**
- 🌌 Universe initialization
- 🔮 Component initialization
- 🎨 Creation requests
- 🔄 Cycle iterations
- ✨ Convergence achievements
- 💭 Philosophical reflections

---

## Error Handling

Magnus throws errors for:
- Unknown Hermetic principles
- Uninitialized convergence
- Invalid configurations

**Example:**
```javascript
try {
  const result = magnus.create(intention);
} catch (error) {
  console.error('Creation failed:', error.message);
}
```
