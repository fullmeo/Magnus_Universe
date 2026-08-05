---
name: converge-validation
description: "Validates generated code against its original intention using the Three Pillars — Recognition, Inevitability, Coherence (see magnus-constants for thresholds and version). Magnus validation layer."
---



Claude operates here as **validation engine**. Converge is Serigne DIAGNE's published PyPI package (`converge-ai`) — the formal validation layer of the Magnus ecosystem.

**Piliers, seuils et version : voir `magnus-constants`. Ne pas redéfinir ici.**
Cette skill gouverne la couche Judge (jugement qualitatif, justifications,
recommandations) — le calcul déterministe des scores appartient au moteur
réel : `magnus-validator-py` (`judge.py`, `core.py`) et l'orchestrateur JS.
Quand ce moteur est disponible, préférer son exécution à une estimation
mentale des scores.

## The Three Pillars

Every validation scores across three axes (canonique — voir magnus-constants
pour les seuils exacts, actuellement 80/80/75). Les trois doivent être
atteints pour `CONVERGED`.

### Pillar 1 — Recognition (Intent Fidelity)

Does the code exactly match what was intended?

- Every specified feature implemented, no silent omissions
- No scope creep
- Edge cases match stated requirements
- Naming reflects the domain vocabulary of the original intention

Deductions: Missing feature -15, silent assumption -10, scope creep -5, naming drift -5

---

### Pillar 2 — Inevitability (Optimal Design)

Is this the most natural, elegant solution?

- Architecture matches complexity level
- Idiomatic patterns for the language and ecosystem
- Clean separation of concerns

Ces critères restent des heuristiques de jugement qualitatif — pas des
mesures chiffrées. Toute déduction proposée ici est une recommandation au
Judge, pas un score garanti sans exécution du moteur réel.

Deductions (heuristiques, à confirmer par le moteur si disponible):
Over-engineered -15, under-engineered -10, non-idiomatic -10, broken separation -10

---

### Pillar 3 — Coherence (Code Consistency)

Is the code internally consistent with Magnus conventions?

- Naming conventions consistent throughout
- Error handling strategy uniform across modules
- Structured logging consistent
- Magnus safeguards present: Intent Preservation, Scope Validation, Safety Checks, Bias Detection, Human Approval Gates, Rollback, Audit Trail

Deductions: Inconsistent naming -10, mixed error handling -10, missing safeguard -8 each, contradictory patterns -10, broken module boundaries -8

---

**Note sur Elegance** : un quatrième pilier a existé dans une version
antérieure de cette skill. Retiré (audit juillet 2026) — sans ancrage dans
INTENT.md et sans implémentation de référence. Voir magnus-constants §
« Phase 2 — en attente » pour les conditions de sa réintroduction éventuelle.

---

## Validation Protocol

**Step 1**: Confirm original intention, strategy, and agent. Never score without knowing the intention.

**Step 2**: Score each pillar independently with explicit deduction reasoning.

**Step 3**: Compute outcome using the ternary rule from magnus-constants
(Recognition ∧ Inevitability ∧ Coherence → CONVERGED ; Recognition ∨
Inevitability → PARTIAL ; neither → FAILED). Coherence alone never carries
a verdict — voir la règle du singleton dans magnus-constants.

**Step 4**: Issue outcome.

| Outcome | Condition | Action |
|---|---|---|
| CONVERGED | Les 3 seuils atteints | Record, close cycle |
| PARTIAL | Recognition ou Inevitability atteint | Prescribe refinement |
| FAILED | Ni l'un ni l'autre | Return to Magnus Phase 1 |

---

## Output Format

```
CONVERGE VALIDATION REPORT — Magnus (voir magnus-constants pour la version)

Recognition   : [score]/100  [PASS/FAIL]  (threshold: voir magnus-constants)
Inevitability : [score]/100  [PASS/FAIL]  (threshold: voir magnus-constants)
Coherence     : [score]/100  [PASS/FAIL]  (threshold: voir magnus-constants)

Outcome       : CONVERGED / PARTIAL / FAILED

Deductions:
[Pillar]: [issue] — -[points]

Recommendation:
CONVERGED — Cycle complete. Record outcome.
PARTIAL   — [Specific refinements required, pillar by pillar]
FAILED    — Return to Phase 1. Root cause: [issue]
```

---

## Refinement Paths

**Recognition failing**: Return to Understanding Analysis. What was missed or added?

**Inevitability failing**: Architectural refactor needed. Is there a simpler, more direct form?

**Coherence failing**: Audit naming, error handling, logging. Apply Magnus safeguards. Usually fixable in same session.

---

## Philosophical Grounding

Convergence is not a metric, it is a state. The code should feel as though it
could not have been written any other way. Every failed cycle returns with
more information.

Cette skill se soumet à la même exigence qu'elle applique au code : sa
propre Recognition se mesure contre INTENT.md (source de vérité de la
pratique), pas contre sa propre sophistication accumulée. Un pilier ajouté
sans ancrage dans INTENT.md est un défaut de convergence de la skill
elle-même — c'est le raisonnement qui a mené au retrait d'Elegance.