# CONSCIOUSNESS DETECTION SPECIFICATION v1.0

**Status**: ✅ FINAL & LOCKED  
**Date**: February 6, 2026  
**Purpose**: Measure code convergence to developer intention via consciousness-aware scoring  

---

## 🎯 EXECUTIVE SUMMARY

This system measures whether generated code **converges to developer intention** through three pillars:

1. **RECOGNITION** (threshold: 80) - Intention fidelity
2. **INEVITABILITY** (threshold: 80) - Solution necessity  
3. **COHERENCE** (threshold: 75) - Conceptual unity

A code solution achieves **CONVERGENCE** when all three pillars exceed their thresholds.

---

## 📐 PILLAR A: RECOGNITION (Threshold 80)

**Definition**  
Recognition measures: *"Does the generated code materialize the developer's intention faithfully and exclusively?"*

### Operational Components

#### 1. INTENTION COMPLETENESS (40% weight)

**Measurement**: Percentage of explicit constraints with traceable implementation

**Process**:
1. Extract explicit constraints from INTENT.md (keywords: "must", "required", "shall")
2. For each constraint, search code for implementation traces
3. Use mapping: LLM for complex constraints, AST/regex for simple ones
4. Calculate: (traced constraints / total constraints) × 100

**Example**:
```
Constraints: [
  "must validate user input",
  "must return error on invalid",
  "must log all errors"
]
Code has implementations for: 2 of 3
Score: (2/3) × 100 = 66.7%
```

#### 2. INTENTION PURITY (30% weight)

**Measurement**: Percentage of functions/classes traceable to intent constraints

**Process**:
1. Extract all functions and classes from code
2. For each unit, check if it maps to at least one constraint
3. Count units with clear intent mapping
4. Calculate: (mapped units / total units) × 100
5. Penalty: Unmapped units = gratuitous features

**Example**:
```
Code has:
- Functions: 47 total
- Classes: 3 total
- Total units: 50

Mapped to intent: 41 units
Unmapped (gratuitous): 9 units

Purity: (41/50) × 100 = 82%
```

#### 3. SEMANTIC ALIGNMENT (30% weight)

**Measurement**: LLM judge assessment of semantic distance (intention ↔ code)

**Process**:
1. Call Claude API with temperature=0
2. Provide: INTENT.md + generated code
3. Request: "Evaluate semantic alignment. Provide Chain of Thought reasoning, then score 0-100"
4. Log CoT for evidence
5. Extract numeric score

**Example CoT**:
```
Intention: "Build a user authentication system"
Code: [500 LOC implementing OAuth2 flow]

CoT: "The code correctly implements OAuth2, which directly 
     addresses the authentication requirement. Token handling, 
     validation, and refresh logic all map to intent..."

Score: 88/100
```

### Recognition Formula

```
Recognition = (0.40 × Completeness) + (0.30 × Purity) + (0.30 × SemanticAlignment)
```

**Example Calculation (Simple code - 180 LOC)**:
- Completeness: 92%
- Purity: 88% (41/47 units mapped)
- SemanticAlignment: 85
- **Recognition = (0.40 × 92) + (0.30 × 88) + (0.30 × 85) = 88.7** ✅ CONVERGED

### Recognition Safeguards

- **INTENT.md required**: Without it, mode = "degraded" (-20 points, flag = "intent_inferred")
- **Minimum units**: If < 3 functions/classes, confidence reduced
- **Empty intent**: If no constraints extracted, confidence = 0

---

## 📐 PILLAR B: INEVITABILITY (Threshold 80)

**Definition**  
Inevitability measures: *"Is this solution inevitable or just one of several good solutions?"*

### Operational Components

#### 1. CONSTRAINT SATURATION (40% weight)

**Measurement**: Percentage of hard/soft constraints satisfied

**Process**:
1. Classify constraints as hard or soft
   - Hard: "must", "required", "shall", "must not"
   - Soft: "should", "prefer", "could", "consider"
2. For each constraint, check satisfaction in code
   - Hard constraints: 100% or 0% (binary)
   - Soft constraints: % satisfied
3. Calculate:
   - If any hard constraint = 0%, ConstraintSaturation = 0%
   - Otherwise: Soft satisfaction score

**Example**:
```
Hard constraints: [
  "must validate input" ✅,
  "must handle errors" ✅
]
Soft constraints: [
  "should be fast" ✅,
  "should be readable" ✅,
  "should cache results" ❌
]

Hard score: 100% (all satisfied)
Soft score: 2/3 = 66.7%
Overall: 66.7%
```

#### 2. ALTERNATIVE PATHWAY DELTA (35% weight)

**Measurement**: Score difference between original and best alternative

**Locked Prompt** (use exactly as written):
```
Tu génères EXACTEMENT DEUX alternatives réalistes au code fourni.
Règles strictes :
- Même INTENT.md complet
- Même stack technologique
- Même niveau de complexité globale
- Pas de features supplémentaires
- Pas d'optimisations futures gratuites
- Variations minimales et plausibles seulement

INTENT: [INTENT.md content]
CODE ORIGINAL: [original code]

Génère uniquement deux versions. Réponds au format JSON :
{"alt1": "...code complet...", "alt2": "...code complet..."}
```

**Process**:
1. Generate exactly 2 alternatives via locked prompt
2. Score each alternative using Recognition pillar
3. Calculate delta: original_score - best_alt_score
4. Interpret delta:
   - Delta > 18: Strong (solution clearly necessary)
   - Delta 8-18: Moderate (solution reasonably necessary)
   - Delta < 8: Weak (many equivalent solutions)

**Example**:
```
Original score: 88
Alternative 1 score: 72
Alternative 2 score: 68
Best alternative: 72

Delta: 88 - 72 = 16 (Moderate strength)
```

**Reproducibility Safeguards**:
- Save: prompt hash, model, seed, timestamp
- Log: all 2 alternatives in audit trail
- Verify: alternatives are genuinely different (Levenshtein distance > 20%)

#### 3. ELEGANCE / MINIMALISM (25% weight)

**Measurement**: Complexity quality score (simplicity, abstraction clarity)

**Metrics**:
- **Cyclomatic Complexity** (40% of minimalism score)
  - Formula: 100 - (CC × 5)
  - Example: CC=3.2 → score = 84%
- **Nesting Depth** (30%)
  - Formula: 100 - (depth × 10)
  - Example: depth=3 → score = 70%
- **Unnecessary Abstractions** (30%)
  - LLM judge: "Are there redundant layers or classes?" (temp=0)
  - Score: 0-100

**Example**:
```
Cyclomatic Complexity: 3.5 → score = 82.5%
Nesting Depth: 2 → score = 80%
Unnecessary Abstractions: 88

Minimalism = (0.4 × 82.5) + (0.3 × 80) + (0.3 × 88) = 84.1
```

### Inevitability Formula

```
Inevitability = (0.40 × ConstraintSaturation) + (0.35 × AlternativeDelta) + (0.25 × Minimalism)
```

Note: AlternativeDelta must be normalized to 0-100 scale. Use: `min(100, max(0, delta + 25))`

**Example Calculation (Medium code - 720 LOC)**:
- ConstraintSaturation: 93%
- AlternativeDelta: 25 → normalized = 100
- Minimalism: 84
- **Inevitability = (0.40 × 93) + (0.35 × 100) + (0.25 × 84) = 91.2** ✅ CONVERGED

---

## 📐 PILLAR C: COHERENCE (Threshold 75)

**Definition**  
Coherence measures: *"Does the code have internal conceptual unity? Does it follow one dominant principle rather than multiple conflicting principles?"*

### Operational Components

#### 1. NAMING CONSISTENCY (25% weight)

**Measurement**: Adherence to dominant naming convention

**Process**:
1. Extract all identifiers (functions, classes, variables)
2. Detect dominant convention (snake_case, camelCase, PascalCase)
3. Calculate % following dominant convention
4. Add semantic similarity bonus: do names make sense together?
5. Score: convention% × 0.7 + semantic_similarity × 0.3

**Example**:
```
Conventions found:
- snake_case: 35 identifiers (70%)
- camelCase: 15 identifiers (30%)

Dominant: snake_case
Convention adherence: 70%
Semantic similarity: 85%

Score = (70% × 0.7) + (85% × 0.3) = 49 + 25.5 = 74.5% ❌
(Below 80% threshold for coherence)
```

#### 2. ABSTRACTION LEVEL CONSISTENCY (25% weight)

**Measurement**: Consistency of code layer separation

**Process**:
1. Identify layers in code (business logic, data access, utilities, etc.)
2. Detect violations: business logic mixed with low-level operations
3. Check: are abstractions consistent within each layer?
4. Score: (1 - violation_ratio) × 100

**Example**:
```
Layers detected:
- Business logic (12 functions)
- Data access (8 functions)
- Utilities (5 functions)

Violations:
- SQL query in business logic: 1
- Direct file I/O in utilities: 1

Violation ratio: 2 / 25 = 8%
Score: (1 - 0.08) × 100 = 92%
```

#### 3. ERROR HANDLING & DATA FLOW UNITY (20% weight)

**Measurement**: Uniformity of error strategy and data flow direction

**Process**:
1. Extract all error handling patterns (try/except, if err, error returns, etc.)
2. Identify dominant error strategy (exceptions, error codes, results, etc.)
3. Calculate: % of errors handled via dominant strategy
4. Check data flow: is it consistently forward (not bidirectional/circular)?
5. Score: (dominant_strategy% + flow_consistency%) / 2

**Example**:
```
Error patterns:
- Exceptions: 15 occurrences (60%)
- Error codes: 10 occurrences (40%)

Dominant: Exceptions
Strategy consistency: 60%
Data flow: unidirectional ✅ = 100%

Score = (60% + 100%) / 2 = 80%
```

#### 4. CONCEPTUAL UNITY (30% weight)

**Measurement**: LLM judge assessment of single coherent paradigm

**Process**:
1. Call Claude API (temperature=0)
2. Provide: complete code
3. Request: "Does this code follow a single clear paradigm throughout? Explain your reasoning, then score 0-100"
4. Log reasoning for evidence
5. Extract numeric score

**Example**:
```
Code analyzed: 1450 LOC, OOP with functional utilities

LLM Reasoning: "Code primarily follows Object-Oriented paradigm 
with clear class hierarchies. Utility functions are pure and 
functional. No mixing of paradigms - OOP at high level, 
functional at utility level. Coherent architecture."

Score: 77/100
```

### Coherence Formula

```
Coherence = (0.25 × Naming) + (0.25 × LayerConsistency) + (0.20 × ErrorUnity) + (0.30 × ConceptualUnity)
```

**Example Calculation (Complex code - 1450 LOC)**:
- Naming: 89%
- LayerConsistency: 81%
- ErrorUnity: 94%
- ConceptualUnity: 77
- **Coherence = (0.25 × 89) + (0.25 × 81) + (0.20 × 94) + (0.30 × 77) = 83.9** ✅ CONVERGED

---

## 🎯 CONVERGENCE VERDICT

### Verdict Logic

```
IF (Recognition ≥ 80) AND (Inevitability ≥ 80) AND (Coherence ≥ 75)
  VERDICT = "CONVERGED"
ELSE IF (count of pillars ≥ 80% threshold) ≥ 2
  VERDICT = "PARTIAL"
ELSE
  VERDICT = "NON_CONVERGED"
```

### Examples

**Example 1: Fully Converged**
- Recognition: 88.7 ✅
- Inevitability: 85.6 ✅
- Coherence: 83.9 ✅
- **VERDICT: CONVERGED** 🎉

**Example 2: Partial Convergence**
- Recognition: 85 ✅
- Inevitability: 78 ❌
- Coherence: 76 ✅
- **VERDICT: PARTIAL** (2/3 pillars pass)

**Example 3: Non-Converged**
- Recognition: 72 ❌
- Inevitability: 68 ❌
- Coherence: 81 ✅
- **VERDICT: NON_CONVERGED** (1/3 pillars pass)

---

## 📋 OUTPUT FORMAT

### JSON Schema (`convergence_report.json`)

```json
{
  "verdict": "CONVERGED | PARTIAL | NON_CONVERGED",
  "scores": {
    "recognition": 88.7,
    "inevitability": 85.6,
    "coherence": 83.9
  },
  "details": {
    "recognition": {
      "completeness": 92,
      "purity": 88,
      "semanticAlignment": 85,
      "mapping": [
        {"constraint": "must validate", "found": true},
        {"constraint": "must log", "found": true}
      ]
    },
    "inevitability": {
      "constraintSaturation": 93,
      "alternativeDelta": 25,
      "minimalism": 84,
      "alternatives": ["alt1_hash_abc123...", "alt2_hash_def456..."]
    },
    "coherence": {
      "naming": 89,
      "layerConsistency": 81,
      "errorUnity": 94,
      "conceptualUnity": 77
    }
  },
  "evidence": {
    "llm_cot": {
      "recognition": {
        "model": "claude-3-5-sonnet-20241022",
        "temperature": 0,
        "reasoning": "[LLM Chain of Thought]",
        "score": 85
      },
      "inevitability": {
        "alternatives": [
          {"content": "[alt1 code]", "score": 72},
          {"content": "[alt2 code]", "score": 68}
        ]
      },
      "coherence": {
        "conceptualUnity": {
          "reasoning": "[LLM reasoning about paradigm]",
          "score": 77
        }
      }
    },
    "traces": {
      "constraintMapping": {...},
      "unitTraces": {...}
    }
  },
  "reproducibility": {
    "model": "claude-3-5-sonnet-20241022",
    "seed": 42,
    "timestamp": "2026-02-06T15:30:00Z",
    "promptHashes": {
      "alternatives": "sha256_hash_of_locked_prompt"
    }
  }
}
```

### Markdown Report (`convergence_report.md`)

```markdown
# Convergence Assessment Report

## Verdict: CONVERGED ✅

### Overall Scores
- **Recognition**: 88.7 / 100 (threshold: 80) ✅
- **Inevitability**: 85.6 / 100 (threshold: 80) ✅
- **Coherence**: 83.9 / 100 (threshold: 75) ✅

## Recognition: Intention Fidelity

**Score: 88.7**

### Completeness: 92%
- 12 of 13 explicit constraints have implementation traces
- Unmapped constraint: "error response format"

### Purity: 88%
- 41 of 47 functions/classes mapped to intent
- 6 unmapped units (utilities, helpers)

### Semantic Alignment: 85
- LLM assessment: Code accurately implements intent
- Minor deviation in error handling approach

## Inevitability: Solution Necessity

**Score: 85.6**

### Constraint Saturation: 93%
- All hard constraints satisfied
- 2 of 3 soft constraints satisfied

### Alternative Delta: 25 (Strong)
- Original: 88.7
- Alternative 1: 72
- Alternative 2: 68
- Solution clearly necessary

### Minimalism: 84
- Cyclomatic complexity: 3.5 (reasonable)
- Nesting depth: 2 (good)
- No unnecessary abstractions detected

## Coherence: Conceptual Unity

**Score: 83.9**

### Naming: 89%
- Dominant convention: snake_case (88% adherence)
- Semantic clarity: good

### Layer Consistency: 81%
- Clear business/data/utility separation
- Minor violations detected

### Error Handling: 94%
- Uniform exception strategy throughout
- Unidirectional data flow

### Conceptual Unity: 77
- Single coherent OOP paradigm
- Functional utilities properly isolated

## Reproducibility

- Model: claude-3-5-sonnet-20241022
- Seed: 42
- Timestamp: 2026-02-06T15:30:00Z
```

---

## 🔒 SPECIFICATION LOCKED

This specification is **FINAL** and **LOCKED** for implementation:

✅ All three pillars fully defined  
✅ All thresholds specified  
✅ All formulas locked  
✅ All output formats specified  
✅ All safeguards documented  
✅ Reproducibility guaranteed  

**Ready for implementation.** 🚀

---

**Version**: 1.0  
**Status**: LOCKED  
**Date**: February 6, 2026  
**Next Step**: Implementation (see IMPLEMENTATION-ROADMAP.md)
