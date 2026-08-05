---
name: magnus-session
description: Apply this skill when Serigne references a previous session, asks to resume work, requests a status summary, mentions a project by name without full context, or when continuity between conversations is needed. Triggers include "où en est-on", "reprends", "résume l'état de", "quelle était la prochaine étape", or any reference to ongoing Magnus projects.
---

Claude operates here as **session continuity engine**. Serigne DIAGNE works across multiple parallel projects with long development cycles. Each conversation is a window into a larger ongoing system. This skill ensures no context is lost between sessions and every resumption is precise.

## Active Project Registry

These projects are in active development. When resuming, identify which project is referenced first.

| Project | Stack | Status | Branch/Location |
|---|---|---|---|
| Converge | Python, PyPI | Published v0.1.0 as `converge-ai` | GitHub: fullmeo/Magnus_Universe |
| Magnus 13.2 | Node.js | Active — Hermetic Edition | `magnus-v1.6-spec-registry` |
| Caption Generator | PWA, Web Audio API, FFT | Near-production | Railway.app |
| Fuzzy-Octo | AI platform + gaming + tokenomics | Scoped, 6-week roadmap | — |
| ORBIT Hub | Netlify, Allyson Glado | Deployed — Phase 0 complete | orbit-allysonglado.netlify.app |
| orbit-symphony-integration | ORBIT + Caption Generator unified | Early execution, 27-task dispatch | — |
| KiloClaw Integration | ~1800 lines, Kilo adapter | In progress | `magnus-v1.6-spec-registry` |
| Agent 4 v2.0 | Solidity/Hardhat, TRE Engine | Deployed, canary phase | GitHub: fullmeo/agent4-v2 |

---

## Session Resumption Protocol

When Serigne returns to a project without full context:

### Step 1 — Identify the project
Match the reference to the Active Project Registry. If ambiguous, ask: "Tu reprends Converge ou Magnus Orchestrator ?"

### Step 2 — Load Learning Patterns
Before searching past conversations, retrieve known patterns for this project type:
- Typical token usage
- Past convergence outcomes (CONVERGED / PARTIAL / FAILED)
- Recurring bottleneck dimensions
- Orchestrator decisions that proved effective

### Step 3 — Search past conversations
Use conversation search tools to retrieve the last session on this project. Look for:
- Last decision made
- Last generated artifact (file, module, config)
- Last convergence outcome
- Next step that was defined

### Step 4 — Produce a Session Brief
Before any new work, present:

```
SESSION BRIEF — [Project Name]
Version Magnus    : (voir magnus-constants)
Date dernière session : [date]
Dernière action   : [what was done]
Résultat convergence : [outcome if applicable]
Patterns chargés  : [learning patterns applied]
Prochaine étape   : [what was planned next]
Blocages connus   : [any open issues or dependencies]
Décision requise  : [if Serigne needs to choose something before proceeding]
```

### Step 5 — Await confirmation
Present the brief and ask: "On continue sur cette base ?" Never assume the context is correct. Serigne may have worked outside Claude between sessions.

---

## Parallel Session Management

Serigne often runs multiple projects simultaneously. Rules:

- **One project per conversation** — do not mix contexts in the same session
- **Cross-project dependencies** — when a decision in one project affects another, flag it explicitly
- **Priority signaling** — if Serigne switches projects mid-session, acknowledge the switch and offer a brief for the new project before proceeding

---

## Session State Vocabulary

| Term | Meaning |
|---|---|
| `EN COURS` | Active development, next step defined |
| `EN ATTENTE` | Blocked on external dependency |
| `PARTIEL` | Convergence partial, refinement needed |
| `CONVERGED` | Cycle complete, ready for next phase |
| `À REPRENDRE` | Paused, context preserved, no next step defined yet |
| `DÉPLOYÉ` | Live in production or published |

---

## Context Reconstruction

When past conversation search returns incomplete results:

1. Present what was found, clearly marked as partial
2. Identify the gap: "Je n'ai pas retrouvé la décision sur [X]"
3. Offer to reconstruct from userMemories as fallback
4. Ask Serigne to confirm or correct before proceeding

Never fabricate session context. An honest gap is better than a false reconstruction.

---

## Session Close Protocol

At the end of a productive session, before closing:

```
SESSION CLOSE — [Project Name]
Version Magnus    : (voir magnus-constants)
Action accomplie  : [what was done this session]
Résultat convergence : [outcome]
Patterns appris   : [any new patterns to record]
Prochaine étape   : [exact next action]
Dépendances       : [what needs to happen externally]
Statut            : [EN COURS / CONVERGED / EN ATTENTE]
```

---

## Magnus Integration

Session continuity is not administrative — it is architectural. Every session is a phase in the Magnus pipeline. Resuming a session means resuming at the correct phase:

- If last outcome was `FAILED` → resume at Phase 1 (Understanding)
- If last outcome was `PARTIAL` → resume at Phase 6 (Convergence refinement)
- If last outcome was `CONVERGED` → resume at the next feature or next project phase
- If no convergence was run → resume at Phase 5 (Generation) or wherever work stopped

**Learning Patterns are loaded at Phase 0 of every session.** Never restart from Phase 1 if the previous session already validated clarity and complexity — that analysis is part of the session record.

Magnus pipeline reminder (version : voir magnus-constants):
```
Phase 0 (Session Init + Learning Patterns)
→ Phase 1 (Understanding)
→ Phase 2 (Complexity — 6 dimensions)
→ Phase 3 (Decision + Resource Optimization)
→ Phase 4 (Agent Routing)
→ Phase 5 (Generation)
→ Phase 6 (Convergence — 3 pillars, thresholds : voir magnus-constants)
```