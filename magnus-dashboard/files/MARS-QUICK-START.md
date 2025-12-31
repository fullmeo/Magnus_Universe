# MARS Quick Start Guide

**Get MARS operational in 10 minutes**

---

## Step 1: Verify Installation (1 minute)

Check that all files exist:

```bash
cd Magnus_13_universe/magnus-dashboard/files

# Core files
ls magnus-autonomous-research-system.js
ls magnus-13-with-mars.js
ls test-mars-system.js

# Data directory
ls -la .mars/
```

Expected structure:
```
.mars/
├── learnings/
│   ├── project-1-tserouf-v4.1.json
│   └── project-2-magnus-13-v2.json
├── patterns/
├── models/
├── suggestions/
└── research/
```

---

## Step 2: Run Tests (2 minutes)

```bash
node test-mars-system.js
```

You should see:
```
================================================================================
🧪 MARS TEST SUITE
================================================================================

TEST 1: Initialize MARS
✅ Test 1 PASSED

TEST 2: Load Existing Learnings
✅ Test 2 PASSED

...

================================================================================
✅ ALL TESTS PASSED
================================================================================
```

If all tests pass → MARS is operational ✅

---

## Step 3: First Usage (5 minutes)

### Option A: Interactive Node Session

```bash
node
```

```javascript
// Import MARS
import Magnus13WithMARS from './magnus-13-with-mars.js';

// Initialize
const system = new Magnus13WithMARS();
await system.initialize();

// Display current status
await system.displayStatus();
```

You'll see:
```
================================================================================
📊 MAGNUS 13 + MARS STATUS
================================================================================

Projects completed: 2

Estimation Accuracy:
  - Average: 96.92%
  - Latest: 97.33%
  - Trend: ↑ Improving

Decision Success:
  - Average: 100.00%
  - Trend: → Stable

Next Research Suggestions:
  1. Sacred Geometry in Code (score: 2.67)
  2. Language Domain Bottleneck Library (score: 2.50)
  3. Pythagorean Harmony in System Design (score: 2.00)
```

### Option B: Get Research Proposals

```javascript
// Get next research suggestion
const proposal = await system.proposeNextResearch();
console.log(proposal.message);
```

Claude will say:
```
Based on your last 2 projects, I've identified emerging patterns.

Here are the 3 most impactful research directions:

1. Sacred Geometry in Code Architecture
   Impact: High | Effort: 3-4 weeks | Fit: Excellent

2. Language Domain Bottleneck Library
   Impact: Medium | Effort: 2 weeks | Fit: Perfect

3. Pythagorean Harmony in System Design
   Impact: High | Effort: 4-6 weeks | Fit: Excellent

Which direction shall we explore?
Or would you like me to propose something different?
```

### Option C: Conduct Research

```javascript
// Choose top suggestion
const direction = proposal.suggestions[0];

// Let MARS research autonomously
const research = await system.conductAutonomousResearch(direction);

// View insights
console.log('Insights:', research.phase3_synthesis.insights);
console.log('Recommendations:', research.phase3_synthesis.recommendations);
```

---

## Step 4: Execute Your Next Project (5 minutes)

```javascript
// Execute a new project
const result = await system.executeProject(
  'Build a gematria calculator with voice input',
  {
    domain: 'hebrew_language',
    projectType: 'calculator_app',
    predictedComplexity: 6.5,
    predictedEffort: 45,
    predictedTimeline: 42
  }
);

// View results
console.log('Project complete!');
console.log('Estimation accuracy:', result.mars.learnings.estimationLearnings.accuracy + '%');
console.log('Decision success:', result.mars.learnings.decisionLearnings.successRate + '%');
console.log('Next suggestion:', result.nextSteps.suggestions[0]);
```

MARS will:
1. Execute Magnus 13 phases 1-9
2. Capture learnings automatically
3. Discover new patterns
4. Update predictive models
5. Suggest next research direction

---

## Common Operations

### View Improvement Metrics

```javascript
const metrics = await system.getImprovementMetrics();

console.log('Projects:', metrics.projectCount);
console.log('Avg accuracy:', metrics.estimationAccuracy.average);
console.log('Latest accuracy:', metrics.estimationAccuracy.latest);
console.log('Golden ratio projects:', metrics.sacredGeometry.goldenRatioProjects);
```

### Load All Learnings

```javascript
const learnings = await system.mars.learningCapture.loadAllLearnings();

console.log('Total learnings:', learnings.length);
learnings.forEach(l => {
  console.log(`${l.projectId}: ${l.estimationLearnings.accuracy}% accurate`);
});
```

### Discover Patterns

```javascript
const learnings = await system.mars.learningCapture.loadAllLearnings();
const patterns = await system.mars.patternDiscovery.discoverPatterns(learnings);

console.log('Patterns discovered:', patterns.rankedByConfidence.length);
patterns.rankedByConfidence.slice(0, 3).forEach(p => {
  console.log(`- ${p.type}: ${p.insight} (${(p.confidence * 100).toFixed(0)}% confidence)`);
});
```

---

## Troubleshooting

### Tests Fail

**Problem:** `Cannot find module`

**Solution:**
```bash
# Check Node.js version (need 18+)
node --version

# Verify file paths
ls magnus-autonomous-research-system.js
ls magnus-13-with-mars.js
```

### No Learnings Found

**Problem:** `.mars/learnings/` is empty

**Solution:**
```bash
# Learnings exist?
ls .mars/learnings/

# If empty, run test to populate
node test-mars-system.js
```

### Import Errors

**Problem:** `SyntaxError: Cannot use import statement outside a module`

**Solution:**
Add to `package.json`:
```json
{
  "type": "module"
}
```

Or rename files to `.mjs`:
```bash
mv magnus-autonomous-research-system.js magnus-autonomous-research-system.mjs
mv magnus-13-with-mars.js magnus-13-with-mars.mjs
```

---

## Next Steps

### Immediate
1. ✅ Run tests
2. ✅ View current status
3. ✅ Get research proposals

### Short Term
1. Execute next project with MARS active
2. Review learning insights
3. Choose a research direction
4. Conduct autonomous research

### Long Term
1. Integrate research findings
2. Watch accuracy improve
3. Build unique IP
4. Become META-DEVELOPER

---

## Key Files Reference

| File | Purpose |
|------|---------|
| `magnus-autonomous-research-system.js` | Core MARS (5 classes + orchestrator) |
| `magnus-13-with-mars.js` | Integration layer |
| `test-mars-system.js` | Test suite |
| `MARS-README.md` | Full documentation |
| `MARS-QUICK-START.md` | This file |
| `.mars/learnings/` | Project learnings |
| `.mars/patterns/` | Discovered patterns |
| `.mars/models/` | Predictive models |
| `.mars/suggestions/` | Research suggestions |
| `.mars/research/` | Research findings |

---

## Example Session

```javascript
// Full example session
import Magnus13WithMARS from './magnus-13-with-mars.js';

async function exampleSession() {
  // 1. Initialize
  const system = new Magnus13WithMARS();
  await system.initialize();

  // 2. Check status
  await system.displayStatus();

  // 3. Get research proposal
  const proposal = await system.proposeNextResearch();
  console.log(proposal.message);

  // 4. Choose direction
  const direction = proposal.suggestions[0];
  console.log('Researching:', direction.area);

  // 5. Conduct research
  const research = await system.conductAutonomousResearch(direction);
  console.log('Insights:', research.phase3_synthesis.insights.length);

  // 6. Execute next project
  const result = await system.executeProject(
    'Next project description',
    { domain: 'your_domain' }
  );

  console.log('Complete! Accuracy:', result.mars.learnings.estimationLearnings.accuracy);
}

exampleSession();
```

---

## Support

- **Full docs:** See `MARS-README.md`
- **Concept:** See `THE-GAME-CHANGER-MARS.md`
- **Tests:** Run `test-mars-system.js`
- **Issues:** Check test output for debugging

---

**🎯 MARS is ready. Start using it NOW.**

10 minutes to operational. Lifetime of improvement.
