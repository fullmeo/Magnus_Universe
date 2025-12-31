# Magnus 13.2 — Hermetic Edition

This folder contains a minimal, self-contained demonstration of the Magnus 13.2 orchestrator with the Convergence (8th) principle.

Quick start
-----------

Prerequisites:
- Node.js 18+ (ESM support)

Run the example test harness:

```bash
npm test
```

Or run directly with Node:

```bash
node magnus-13-2-test.js
```

What’s here
-----------

- `magnus-13-2-main.js` — main orchestrator (Analyze → Generate → Validate Convergence)
- `magnus-13-2-test.js` — small test harness that runs an example flow
- `magnus-13-2-convergence-principle.js` — principle definitions and docs
- `magnus-13-1-engines.js` — engines: Understanding, Complexity, Revelation (enhanced with caching)
- `magnus-13-1-learning-coherence.js` — LearningEngine and CoherenceEngine with simple persistence

Notes
-----
- Engines persist lightweight caches and session/knowledge files under `.magnus/`.
- The test harness writes session data into `.magnus/` when run.
- To extend persistence or move to a DB, replace the small file-backed implementations.
