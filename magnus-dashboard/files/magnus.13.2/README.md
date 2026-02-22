
# Magnus 13.2 — Hermetic Edition

[![CI](https://github.com/fullmeo/Magnus_Universe/actions/workflows/ci.yml/badge.svg)](https://github.com/fullmeo/Magnus_Universe/actions/workflows/ci.yml)

This folder contains a minimal, self-contained demonstration of the Magnus 13.2 orchestrator with the Convergence (8th) principle.

Quick start
-----------

Prerequisites:
- Node.js 18+ (ESM support)

Run the example test harness:

```bash
npm test
```

PowerShell quick runs (Windows)

```powershell
# Run a short verification load
$env:CONCURRENCY=4; $env:TOTAL=40; $env:MIN_CLARITY=40; node magnus-13-2-load-sim.js

# Run a longer soak (beware CPU/IO usage)
$env:CONCURRENCY=100; $env:TOTAL=5000; $env:MIN_CLARITY=40; node magnus-13-2-load-sim.js

# Tail logs while running
Get-Content ./.logs/load-soak.log -Wait
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
- Replace `<OWNER>` and `<REPO>` in the badge URL at the top of this file with your GitHub owner and repository to enable the Actions badge.
