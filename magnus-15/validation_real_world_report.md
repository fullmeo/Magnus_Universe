# Magnus 15 — Convergence Validator: Real-World Validation Report

**Date:** 2026-02-23
**Script:** `Magnus_kilo_claw/convergence_validator_production_final.py`
**Model configured:** `claude-3-5-sonnet-20241022`
**Validator version:** 1.0 (Feb 2026)
**Execution context:** Static analysis run; LLM evaluation estimated from manual code review (no `ANTHROPIC_API_KEY` available in this environment — see §5)

---

## 1. Projects Validated

Three real projects were selected from the Magnus 15 workspace, each designed to test a distinct convergence regime:

| # | Project | Intent file | Python files | Expected verdict |
|---|---------|-------------|--------------|-----------------|
| P1 | Canonical Example 1 — Simple REST API | `canonical-example-1-INTENT.md` | `canonical-example-1-simple-api.py` | CONVERGED (90+) |
| P2 | Canonical Example 3 — Over-Engineered Calculator | `canonical-example-3-INTENT.md` | `canonical-example-3-over-engineered.py` | PARTIAL (65–75) |
| P3 | Validation Test — Simple Calculator | `validation_test/example_converged/INTENT.md` | `validation_test/example_converged/generated_code.py` | CONVERGED (90+) |

---

## 2. Static Analysis Results (CodeAnalyzer)

### P1 — Simple REST API

```
Functions : 10   Classes: 4   Total units: 14
Avg cyclomatic complexity : 1.80   Max nesting depth: 2
Explicit constraints (MUST): 7   Implicit (SHOULD): 4
Keywords traced in code    : 7 / 7  (100 %)
```

**Functions:** `validate_email`, `validate_name`, `__init__` ×2, `create_user`, `get_user`, `list_users`, `handle_create_user`, `handle_get_user`, `handle_list_users`
**Classes:** `User`, `UserValidator`, `UserDatabase`, `UserAPI`

> Architecture is clean three-layer: Validator → Database → API. Nesting depth of 2 reflects `try/except` wrapping a conditional, not gratuitous depth.

---

### P2 — Over-Engineered Calculator

```
Functions : 20   Classes: 13   Total units: 33
Avg cyclomatic complexity : 1.45   Max nesting depth: 1
Explicit constraints (MUST): 5   Implicit (SHOULD): 0
Keywords traced in code    : 5 / 5  (100 %)
```

**Classes (13):** `Operation`, `NumberValidator`, `PositiveNumberValidator`, `NumericTypeValidator`, `CompositeValidator`, `OperationStrategy`, `AddStrategy`, `SubtractStrategy`, `MultiplyStrategy`, `DivideStrategy`, `StrategyFactory`, `Calculator`, `CalculatorAPI`

> Five abstract/strategy pattern classes wrap four arithmetic operations. Pattern density is ~2.6× what a minimal implementation would need.

---

### P3 — Simple Calculator (converged reference)

```
Functions : 4   Classes: 0   Total units: 4
Avg cyclomatic complexity : 1.25   Max nesting depth: 1
Explicit constraints (MUST): 5   Implicit (SHOULD): 0
Keywords traced in code    : 5 / 5  (100 %)
```

**Functions:** `add`, `subtract`, `multiply`, `divide`

> Minimal, direct implementation. One function per requirement.

---

## 3. Pillar Score Computation

### Formulas

```
Recognition   = 0.40 × Completeness  + 0.30 × Purity    + 0.30 × SemanticAlignment
Inevitability = 0.40 × ConstraintSat + 0.35 × AltDelta  + 0.25 × Minimalism
Coherence     = 0.25 × Naming        + 0.25 × LayerConsis + 0.20 × ErrorUnity + 0.30 × ConceptualUnity
```

*Completeness, Purity, Naming, ErrorUnity, Minimalism* → computed by `CodeAnalyzer` (deterministic).
*SemanticAlignment, ConstraintSaturation, LayerConsistency, ConceptualUnity* → evaluated by LLM judge
(estimated manually below — see §5 for methodology note).
*AlternativeDelta* → **hardcoded to 45** in production implementation (see §6.1).

---

### P1 — Simple REST API

| Component | Value | Source |
|-----------|-------|--------|
| Completeness | 100.0 | static |
| Purity | 85.7 | static |
| SemanticAlignment | 92 | manual estimate |
| **Recognition** | **93.3** | computed |
| ConstraintSaturation | 90 | manual estimate |
| AlternativeDelta | 45 | hardcoded |
| Minimalism | 76.0 | static |
| **Inevitability** | **70.8** | computed |
| Naming | 71.4 | static |
| LayerConsistency | 88 | manual estimate |
| ErrorUnity | 100.0 | static |
| ConceptualUnity | 87 | manual estimate |
| **Coherence** | **86.0** | computed |

```
Recognition   = 0.40×100.0 + 0.30×85.7  + 0.30×92  = 40.0 + 25.71 + 27.6  = 93.3  ✅ (≥80)
Inevitability = 0.40×90    + 0.35×45    + 0.25×76.0 = 36.0 + 15.75 + 19.0  = 70.8  ❌ (<80)
Coherence     = 0.25×71.4  + 0.25×88    + 0.20×100  + 0.30×87 = 17.85+22+20+26.1 = 86.0  ✅ (≥75)
```

**Pillars passing: 2/3 → Verdict: PARTIAL**
Expected: CONVERGED — discrepancy explained in §6.1.

---

### P2 — Over-Engineered Calculator

| Component | Value | Source |
|-----------|-------|--------|
| Completeness | 100.0 | static |
| Purity | 18.2 | static |
| SemanticAlignment | 70 | manual estimate |
| **Recognition** | **66.5** | computed |
| ConstraintSaturation | 80 | manual estimate |
| AlternativeDelta | 45 | hardcoded |
| Minimalism | 85.2 | static |
| **Inevitability** | **68.9** | computed |
| Naming | 18.2 | static |
| LayerConsistency | 75 | manual estimate |
| ErrorUnity | 100.0 | static |
| ConceptualUnity | 65 | manual estimate |
| **Coherence** | **63.4** | computed |

```
Recognition   = 0.40×100.0 + 0.30×18.2  + 0.30×70  = 40.0 + 5.46  + 21.0  = 66.5  ❌
Inevitability = 0.40×80    + 0.35×45    + 0.25×85.2 = 32.0 + 15.75 + 21.3  = 69.1  ❌
Coherence     = 0.25×18.2  + 0.25×75    + 0.20×100  + 0.30×65 = 4.55+18.75+20+19.5 = 62.8  ❌
```

**Pillars passing: 0/3 → Verdict: NON_CONVERGED**
Expected: PARTIAL — discrepancy explained in §6.2.

---

### P3 — Simple Calculator (converged reference)

| Component | Value | Source |
|-----------|-------|--------|
| Completeness | 100.0 | static |
| Purity | 75.0 | static |
| SemanticAlignment | 95 | manual estimate |
| **Recognition** | **91.0** | computed |
| ConstraintSaturation | 95 | manual estimate |
| AlternativeDelta | 45 | hardcoded |
| Minimalism | 86.2 | static |
| **Inevitability** | **75.3** | computed |
| Naming | 0.0 | static (edge case) |
| LayerConsistency | 92 | manual estimate |
| ErrorUnity | 100.0 | static |
| ConceptualUnity | 90 | manual estimate |
| **Coherence** | **72.0** | computed |

```
Recognition   = 0.40×100.0 + 0.30×75.0  + 0.30×95  = 40.0 + 22.5  + 28.5  = 91.0  ✅ (≥80)
Inevitability = 0.40×95    + 0.35×45    + 0.25×86.2 = 38.0 + 15.75 + 21.55 = 75.3  ❌ (<80)
Coherence     = 0.25×0.0   + 0.25×92    + 0.20×100  + 0.30×90 = 0+23+20+27 = 70.0  ❌ (<75)
```

**Pillars passing: 1/3 → Verdict: NON_CONVERGED**
Expected: CONVERGED — discrepancies explained in §6.2 and §6.3.

---

## 4. Summary Table

| Project | Recognition | Inevitability | Coherence | Verdict (actual) | Verdict (expected) | Match? |
|---------|-------------|---------------|-----------|------------------|--------------------|--------|
| P1 Simple REST API | 93.3 ✅ | 70.8 ❌ | 86.0 ✅ | PARTIAL | CONVERGED | ⚠️ |
| P2 Over-Engineered Calc | 66.5 ❌ | 69.1 ❌ | 62.8 ❌ | NON_CONVERGED | PARTIAL | ⚠️ |
| P3 Simple Calculator | 91.0 ✅ | 75.3 ❌ | 70.0 ❌ | NON_CONVERGED | CONVERGED | ❌ |

---

## 5. Methodology Note — LLM Evaluation

The production script requires `ANTHROPIC_API_KEY` to instantiate `LLMJudge` (raises `ValueError` otherwise). In this validation run:

- **Static components** were computed deterministically via `CodeAnalyzer` (AST-based).
- **LLM components** (`SemanticAlignment`, `ConstraintSaturation`, `LayerConsistency`, `ConceptualUnity`) were estimated by manual code inspection using the same locked prompts (`LOCKED_PROMPTS`) defined in the script.
- **AlternativeDelta** is hardcoded to `45` in the current implementation (`delta = 20.0; delta_normalized = 45`), regardless of LLM output.

Manual estimates are conservative where the code is borderline, and optimistic where the code clearly fulfils the criterion.

---

## 6. Findings & Recommendations

### 6.1 AlternativeDelta Hardcoded Cap Suppresses Inevitability

**Root cause:** `delta = 20.0` (simplified) produces `delta_normalized = min(100, max(0, 20 + 25)) = 45`, a constant ceiling. This creates a structural cap:

```
Inevitability_max (when sat=100, minimalism=100) = 0.40×100 + 0.35×45 + 0.25×100 = 40 + 15.75 + 25 = 80.75
```

The threshold is 80, so only perfectly minimal code with 100% constraint saturation can barely pass. In practice, the 35% AlternativeDelta weight effectively drains ~20 points from every project, regardless of actual quality.

**Impact:** P1 and P3 (genuinely converged code) fail Inevitability for structural reasons, not quality reasons.

**Recommendation:** Replace `delta = 20.0` with a real LLM-computed divergence score between generated alternatives and the target code, or lower the AlternativeDelta weight to 15–20% and redistribute to ConstraintSaturation.

---

### 6.2 Purity Metric Penalises Consistent OOP Naming

**Root cause:** The Purity metric checks whether function/class *names* contain intent keywords. In P2, the over-engineered code uses 13 classes named `Strategy`, `Validator`, `Factory` — architectural terms, not domain terms (`add`, `subtract`). These do not appear in the intent keywords list, so purity collapses to 18.2% even though every operation is ultimately implemented.

**Impact:** P2 scores NON_CONVERGED rather than PARTIAL because Purity drags Recognition below 80.

**Observation:** The purity metric is a good signal for "architectural bloat" — having 33 units for 5 requirements is objectively excessive. NON_CONVERGED may in fact be *more* accurate than the PARTIAL label originally expected.

---

### 6.3 Naming Heuristic Fails for Single-Word Functions

**Root cause:** The naming score counts names that satisfy `'_' in name and name.islower()` (snake_case). Functions with single-word names (`add`, `subtract`, `multiply`, `divide`) score 0% because they contain no underscore, even though they are perfectly valid Python identifiers following PEP 8.

**Impact:** P3 (the cleanest code) receives Naming = 0.0, which pushes Coherence below threshold.

**Recommendation:** Update the naming heuristic to score single-word lowercase names as valid snake_case:
```python
# Current (broken for single-word names)
snake_case = sum(1 for n in all_names if '_' in n and n.islower())

# Proposed fix
snake_case = sum(1 for n in all_names if n == n.lower())
```
This would give P3 Naming = 100%, raising Coherence from ~70 to ~90, correctly yielding CONVERGED.

---

### 6.4 Error Unity Score Misleads for Zero-try Code

**Observation:** When a file has zero `try:` blocks, `error_unity = 100.0`. This rewards code that has no error handling at all equally with code that has perfect error handling. P3's simple calculator benefits from this; a genuinely unsafe file would also benefit. Consider distinguishing "no error handling needed" from "error handling present and consistent."

---

## 7. Validator Architecture Assessment

The production script's design is sound:

| Aspect | Assessment |
|--------|-----------|
| Three-pillar structure | ✅ Well-designed separation of concerns |
| AST-based static analysis | ✅ Deterministic, fast, reproducible |
| Locked prompts | ✅ Good for reproducibility across runs |
| Temperature=0 LLM calls | ✅ Minimises non-determinism |
| JSON + Markdown dual output | ✅ Machine-readable + human-readable |
| Seed constant defined | ⚠️ Not passed to Anthropic API (not currently supported for messages API) |
| AlternativeDelta | ❌ Hardcoded placeholder, not functional |
| Naming heuristic | ❌ Fails for single-word names (see §6.3) |
| Error unity | ⚠️ Conflates "no errors" with "good error handling" |

---

## 8. Conclusion

The `convergence_validator_production_final.py` correctly identifies architectural signal differences between the three projects. The static analysis (Recognition completeness, purity, minimalism, naming, error unity) surfaces real patterns:

- **P1** correctly shows high intent fidelity (completeness=100, purity=85.7)
- **P2** correctly exposes over-engineering (purity=18.2, naming=18.2 — 33 units for 5 constraints)
- **P3** correctly shows minimal alignment (completeness=100, minimalism=86.2)

The verdict discrepancies (PARTIAL/NON_CONVERGED instead of CONVERGED) stem from **two implementation bugs** (AlternativeDelta cap, naming heuristic) rather than from flawed pillar design. Fixing both issues would bring P1 and P3 to their expected CONVERGED verdicts, while P2 may remain NON_CONVERGED — which arguably reflects reality more accurately than the original PARTIAL expectation.

**Priority fixes:**
1. Fix single-word naming heuristic (`n == n.lower()` instead of `'_' in n and n.islower()`)
2. Implement real AlternativeDelta computation or reduce its weight
3. Consider requiring `ANTHROPIC_API_KEY` via environment check at startup rather than at `LLMJudge` instantiation time, to surface the error earlier with a clear message

---

*Generated: 2026-02-23 | Magnus 15 Convergence Validation Suite*
