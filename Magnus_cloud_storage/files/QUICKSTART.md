# Magnus 13 - Quick Start Guide

## 🚀 Installation

```bash
# Clone or download the files
# No npm dependencies needed - pure Node.js!

# Make sure you have Node.js 18+ installed
node --version
```

## 📋 Files Overview

```
magnus-13/
├── magnus-13.js                    # Main orchestrator (import this)
├── magnus-13-core.js               # Understanding & Complexity engines
├── magnus-13-learning-coherence.js # Learning & Coherence engines
├── magnus-13-examples.js           # Usage examples
├── package.json                    # Package configuration
├── README.md                       # Full documentation
├── COMPARISON.md                   # Magnus 12 vs 13
└── QUICKSTART.md                   # This file
```

## ⚡ 30-Second Start

```javascript
import Magnus13 from './magnus-13.js';

const magnus = new Magnus13();
await magnus.initialize();

const analysis = await magnus.analyze('Create a React todo app');

if (analysis.canProceed) {
  console.log('Ready to generate!');
  console.log('Strategy:', analysis.recommendation.strategy.name);
} else {
  console.log('Need clarification:', analysis.questions);
}
```

## 🎮 Run Examples

```bash
# Run all examples
npm start

# Or run specific examples
npm run example:simple       # Simple, clear request
npm run example:ambiguous    # Ambiguous request (triggers clarification)
npm run example:complex      # Complex request (triggers decomposition)
npm run example:learning     # Learning engine demo
npm run example:multisession # Multi-session coherence demo
npm run example:report       # Comprehensive analysis report
```

## 📖 Basic Usage Patterns

### 1. Simple Analysis

```javascript
import Magnus13 from './magnus-13.js';

const magnus = new Magnus13();
await magnus.initialize();

const request = `
  Create a React component for a user profile card
  with avatar, name, and bio
`;

const analysis = await magnus.analyze(request);

console.log('Clarity:', analysis.understanding.clarityScore);
console.log('Complexity:', analysis.complexity.overall.score);
console.log('Can proceed?', analysis.canProceed);
```

### 2. Handle Clarification

```javascript
const analysis = await magnus.analyze('Build a user system');

if (analysis.clarificationNeeded) {
  console.log('\nQuestions:');
  analysis.questions.forEach(q => {
    console.log(`[${q.priority}] ${q.question}`);
  });
  
  // In real app: ask user, get answers, re-analyze
}
```

### 3. Handle Decomposition

```javascript
const analysis = await magnus.analyze('Build Slack clone');

if (analysis.recommendation.recommendation === 'DECOMPOSE') {
  console.log('Too complex! Suggested phases:');
  analysis.recommendation.decomposition.phases.forEach(phase => {
    console.log(`- ${phase}`);
  });
}
```

### 4. Start Generation Session

```javascript
const analysis = await magnus.analyze(request);

if (analysis.canProceed) {
  const session = await magnus.startGeneration(analysis);
  
  console.log('Session ID:', session.sessionId);
  console.log('Estimated tokens:', session.estimate.tokensEstimated);
  console.log('Strategy:', session.strategy.name);
  
  // ... generate code ...
  
  // Record outcome
  await magnus.recordOutcome(session.sessionId, {
    outcome: 'SUCCESS',
    tokensUsed: 3500,
    iterations: 2,
    linesOfCode: 300,
    filesGenerated: 3,
    quality: 'GOOD'
  });
}
```

### 5. Multi-Session Development

```javascript
// Session 1: Build core
const analysis1 = await magnus.analyze('Build REST API');
const session1 = await magnus.startGeneration(analysis1);

// Record architectural decisions
await magnus.recordArchitecturalDecision({
  decision: 'Express with PostgreSQL',
  rationale: 'Proven stack, ACID guarantees',
  alternatives: ['Fastify + MongoDB'],
  consequences: ['SQL queries', 'Migrations required']
});

await magnus.recordOutcome(session1.sessionId, { ... });

// Session 2: Resume with full context
const context = await magnus.resumeSession(session1.sessionId);

console.log('Decisions from Session 1:', context.decisions);
console.log('Existing artifacts:', context.existingArtifacts);
console.log('Continuity guidance:', context.continuityGuidance);
```

## 🎯 Configuration Options

```javascript
const magnus = new Magnus13({
  autoLearn: true,              // Learn from outcomes (default: true)
  requireClarification: true,   // Block on high ambiguity (default: true)
  minClarityScore: 70,          // Minimum clarity to proceed (default: 70)
  maxComplexityScore: 8,        // Maximum complexity for single session (default: 8)
  storageDir: './.magnus'       // Where to store knowledge/sessions (default: ./.magnus)
});
```

## 📊 Understanding the Output

### Clarity Score (0-100)
- **80-100**: Crystal clear, ready to generate
- **60-79**: Some ambiguity, assumptions needed
- **40-59**: Significant ambiguity, clarification recommended
- **0-39**: Very ambiguous, MUST clarify

### Complexity Score (1-10)
- **1-3**: Simple - Single-pass generation
- **4-5**: Moderate - Iterative refinement
- **6-7**: Complex - Modular construction
- **8-10**: Expert - Requires decomposition or expert input

### Recommendations
- **GENERATE**: Ready to proceed
- **CLARIFY**: Need answers to questions first
- **DECOMPOSE**: Too complex, break it down
- **EXPERT_REQUIRED**: Beyond AI generation capability

## 🔍 Inspecting Results

### View Complexity Breakdown
```javascript
const analysis = await magnus.analyze(request);

Object.entries(analysis.complexity.dimensions).forEach(([dim, data]) => {
  console.log(`${dim}: ${data.score}/10 (${data.level})`);
});

console.log('Bottleneck:', analysis.complexity.bottleneck.dimension);
```

### View Ambiguities
```javascript
analysis.understanding.ambiguities.forEach(amb => {
  console.log(`[${amb.severity}] ${amb.type}`);
  console.log(`Question: ${amb.question}`);
  console.log(`Impact: ${amb.impact}`);
});
```

### View Learned Patterns
```javascript
if (analysis.learned?.available) {
  console.log('Success rate:', analysis.learned.stats.successRate);
  analysis.learned.recommendations.forEach(rec => {
    console.log(`[${rec.type}] ${rec.recommendation}`);
  });
}
```

### Generate Full Report
```javascript
const report = magnus.generateReport(analysis);
console.log(JSON.stringify(report, null, 2));
```

## 🧹 Cleanup

```bash
# Remove all stored knowledge and sessions
npm run clean

# Or manually
rm -rf .magnus
```

## 💡 Pro Tips

### 1. Start Simple
Begin with simple requests to build confidence and knowledge base:
```javascript
// Good first requests
"Create a React button component"
"Build a simple Express server"
"Make a utility function for date formatting"
```

### 2. Build Knowledge Over Time
Magnus 13 learns, so early estimates will be rough but improve:
```javascript
// First generation: estimate may be off
// 5th generation of similar pattern: estimate is accurate
```

### 3. Use Multi-Session for Large Projects
Don't try to build everything in one session:
```javascript
// Session 1: Core architecture
// Session 2: Feature A
// Session 3: Feature B
// Each session has full context from previous
```

### 4. Record Decisions Explicitly
The more you document, the better continuity:
```javascript
await magnus.recordArchitecturalDecision({
  decision: 'What you chose',
  rationale: 'Why you chose it',
  alternatives: ['What you considered'],
  consequences: ['What this implies']
});
```

### 5. Trust the Blocking
If Magnus 13 blocks, there's a reason:
```javascript
// Magnus blocks → something is genuinely unclear/complex
// Don't force it → clarify or decompose
```

## 🐛 Troubleshooting

### "Module not found"
Make sure you're using Node.js 18+ with ES modules support:
```bash
node --version  # Should be >= 18.0.0
```

### "Cannot write to .magnus"
Check directory permissions:
```bash
mkdir -p .magnus/knowledge .magnus/sessions
chmod -R u+w .magnus
```

### Learning not working
Ensure you're recording outcomes:
```javascript
// After generation
await magnus.recordOutcome(sessionId, {
  outcome: 'SUCCESS',  // or 'PARTIAL', 'FAILURE'
  tokensUsed: 3500,
  iterations: 2,
  // ... other metrics
});
```

### Sessions not resuming
Check that session files exist:
```bash
ls -la .magnus/sessions/
```

## 📚 Next Steps

1. **Read README.md** for full documentation
2. **Read COMPARISON.md** to understand Magnus 12 vs 13
3. **Run examples** to see Magnus 13 in action
4. **Start using** Magnus 13 in your projects
5. **Watch it learn** as you use it more

## 🎯 Remember

Magnus 13 is about **understanding first, generating second**.

If it asks questions → answer them  
If it suggests decomposition → follow it  
If it blocks → there's a good reason  
If it learns → trust the adjustments  

**The bottleneck is not tokens — it's understanding.**

---

Ready to start? Run:
```bash
npm start
```
