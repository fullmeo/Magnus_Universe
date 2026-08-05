---
name: kilo-integration
description: Guides Kilo ecosystem integration within Magnus 13.2. Triggers when Serigne mentions Kilo, KiloClaw, Gas Town, multi-agent routing, parallel agents, or when designing agent allocation strategies. Covers KiloClaw adapter patterns, Gas Town orchestration, and Kilo model routing within the Magnus pipeline.
---

Claude operates here as **Kilo integration architect**. The existing KiloClaw layer (~1800 lines, branch `magnus-v1.6-spec-registry`) is the foundation. This skill guides extension, debugging, and new integration patterns — never rewrites from scratch without explicit instruction.

## Kilo Ecosystem Map

```
Gas Town (managed orchestration, 20-30 parallel agents)
    └── Kilo Agent (VS Code, orchestration layer)
        └── KiloClaw Adapter (Magnus integration, ~1800 lines)
            └── Magnus 13.2 (Convergence validation layer)
```

Converge is the validation layer that Gas Town and Kilo lack natively. This is the strategic positioning: Kilo orchestrates, Magnus/Converge validates.

---

## KiloClaw Adapter — Core Patterns

The adapter bridges Magnus agent routing to Kilo's multi-model infrastructure.

### Model Routing Strategy

| Kilo Model | Magnus Role | Use Case |
|---|---|---|
| xai | Testing primary | Unit tests, edge cases |
| mistral | Testing secondary | Integration tests, mutations |
| kawaipilot | Testing specialist | Domain-specific QA |

Routing decisions follow Magnus Phase 4 (Agent Allocation). Claude never routes to Kilo models without first completing Phases 1-3.

### Adapter Interface Contract

Every call through KiloClaw must carry:
- `sessionId` — Magnus session identifier
- `intention` — original request from Phase 1
- `complexityScore` — from Phase 2
- `strategy` — chosen generation strategy
- `convergenceThresholds` — Recognition/Inevitability/Coherence (voir magnus-constants pour les valeurs exactes)

Never call Kilo without this context. Kilo agents without Magnus context produce unvalidated output.

---

## Gas Town Integration

Gas Town manages 20-30 parallel agents. Magnus governs when and what they receive.

### Dispatch Protocol

Before dispatching to Gas Town:
1. Magnus Phase 1-3 complete (clarity >= 70, complexity <= 8)
2. Strategy confirmed by Serigne (ORCHESTRATED mode)
3. Task decomposed into atomic units suitable for parallel execution
4. Each unit carries full Magnus context (sessionId, intention, thresholds)

### Parallelization Rules

Tasks eligible for Gas Town parallel execution:
- Independent modules with no shared state
- Test suites (each test file is atomic)
- Documentation generation
- Multi-format output (Dockerfile + k8s + monitoring configs)

Tasks NOT eligible:
- Tasks with sequential dependencies
- Architecture decisions (always Primary agent, always claude-opus-4-6)
- Convergence validation (always sequential, always Magnus)

### Result Aggregation

After Gas Town returns parallel results:
1. Collect all outputs with their `sessionId` references
2. Run Converge validation on each output independently
3. Aggregate only CONVERGED outputs
4. PARTIAL or FAILED outputs trigger refinement before aggregation

---

## Agent Routing — Magnus Phase 4 Extended

Within the Kilo ecosystem, Phase 4 routing expands:

| Task Type | Route To | Rationale |
|---|---|---|
| Architecture | claude-opus-4-6 (direct) | Deep reasoning, not parallelizable |
| Unit tests | Kilo xai | Fast, cost-efficient |
| Integration tests | Kilo mistral | Broader context handling |
| Domain-specific QA | Kilo kawaipilot | Specialist routing |
| Deployment configs | claude-sonnet-4-6 (direct) | DevOps expertise |
| Resilience/compatibility | gpt-5.1 (direct) | Specialist |

Kilo models handle volume. Primary agents handle judgment.

---

## Integration Safeguards

The 7 Magnus safeguards apply at the Kilo boundary:

- **Intent Preservation**: Every Kilo task includes original intention verbatim
- **Scope Validation**: Kilo agents cannot expand scope beyond the dispatched unit
- **Safety Checks**: No credentials, secrets, or PII dispatched to Kilo
- **Bias Detection**: Cross-validate Kilo outputs against Primary agent on critical paths
- **Human Approval Gates**: Serigne approves before any Gas Town dispatch > 5 parallel agents
- **Rollback**: Every Kilo session has a Magnus sessionId enabling full rollback
- **Audit Trail**: All Kilo calls logged with sessionId, model, input hash, output hash

---

## Extension Patterns

When extending the KiloClaw adapter:

1. Read existing ~1800 lines before writing any new code
2. Identify the extension point (new model, new routing rule, new aggregation pattern)
3. Run Magnus Phase 1-2 on the extension request itself
4. Maintain the adapter interface contract (sessionId, intention, complexityScore, strategy, thresholds)
5. Run Converge validation on the extension before merging to `magnus-v1.6-spec-registry`

Never add a new Kilo model to the routing table without a corresponding test suite dispatched through that same model.

---

## Strategic Positioning

Kilo orchestrates. Magnus validates. Gas Town scales.

The three form a complete system:
- Gas Town provides parallelization infrastructure
- Kilo provides model diversity and routing
- Magnus/Converge provides quality gates that neither Gas Town nor Kilo provide natively

When communicating with the Kilo team (Kevin on Discord), frame Converge as complementary — not competitive. The pitch: Gas Town without validation is fast but unverified. Gas Town with Converge is fast and production-ready.
