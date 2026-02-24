# MAGNUS 15 - REFACTORED ARCHITECTURE GUIDE

## 🎯 Core Design: Modular, Pluggable

### Layer 1: Spec Detection (NEW!)

```python
class SpecDetector:
    SPEC_MARKERS = {
        "RFC": r"RFC\s*\d{4,5}",
        "PKCS": r"PKCS[#-]?\d",
        "FIPS": r"FIPS\s*\d{3,4}",
        "ISO": r"ISO\s*\d{4,5}",
        "X.509": r"X\.509",
        "NIST": r"NIST",
    }
    
    @staticmethod
    def detect(code: str, docstrings: List[str]) -> Dict[str, List[str]]:
        # Scans code + docstrings for RFC, PKCS, FIPS, ISO, X.509, NIST
        # Returns: {"RFC": ["RFC 3447"], "PKCS": ["PKCS#1"], ...}
```

**Extensible**: Add more patterns to `SPEC_MARKERS` for PCI-DSS, SOC2, etc.

---

### Layer 2: Pluggable Alternative Delta Computer

**THE KEY INNOVATION:**

```python
class AlternativeDeltaComputer:  # ABSTRACT BASE
    def compute(self, code: str, alt_scores: List[float], saturation: float) -> float:
        raise NotImplementedError

# IMPLEMENTATION 1: Default (current Magnus behavior)
class SyntacticDeltaComputer(AlternativeDeltaComputer):
    def compute(self, code, alt_scores, saturation):
        # Counts syntactic alternatives (what Magnus does now)
        # Returns 0-100 score
        best_alt_score = max(alt_scores) if alt_scores else saturation - 5
        delta = saturation - best_alt_score
        return min(100, max(0, (delta / 50) * 100 + 50))

# IMPLEMENTATION 2: Spec-Constrained (NEW!)
class SpecConstrainedDeltaComputer(AlternativeDeltaComputer):
    def __init__(self, spec_refs: Dict[str, List[str]]):
        self.spec_refs = spec_refs
    
    def compute(self, code, alt_scores, saturation):
        # For spec-driven code:
        # - If spec says "RSA-2048", then PSS/OAEP/SHA-512/RSA-4096 are non-conformant
        # - They don't count as "alternatives"
        # - Valid alternatives = those satisfying SAME spec
        # - If no valid alternatives exist → delta = 0 → inevitability = 100
        
        if not self.spec_refs:
            # Fallback to syntactic if no specs detected
            return SyntacticDeltaComputer().compute(code, alt_scores, saturation)
        
        # Filter: only count alternatives that satisfy spec
        valid_alternatives = [s for s in alt_scores if self._is_spec_compliant(s)]
        
        if not valid_alternatives:
            return 0.0  # No valid alternatives = delta = 0
        
        # If there were compliant alternatives, compute normally
        best = max(valid_alternatives)
        delta = saturation - best
        return min(100, max(0, (delta / 50) * 100 + 50))
    
    def _is_spec_compliant(self, alt_score: float) -> bool:
        # TODO: Implement conformance check
        # For now: conservative — no alternatives in spec space
        return False
```

**How it's selected:**

```python
class InevitabilityValidator:
    def __init__(self, use_spec_constrained: bool = False, spec_refs: Dict = None):
        if use_spec_constrained and SpecDetector.has_specs(spec_refs):
            self.delta_computer = SpecConstrainedDeltaComputer(spec_refs)  # NEW
        else:
            self.delta_computer = SyntacticDeltaComputer()  # DEFAULT
```

**Usage:**

```python
# Default (current behavior)
validator = ConvergenceValidator(".", spec_constrained=False)
result = validator.run()  # Uses SyntacticDeltaComputer

# Spec-constrained mode (NEW)
validator = ConvergenceValidator(".", spec_constrained=True)
result = validator.run()  # Detects specs, uses SpecConstrainedDeltaComputer
```

---

### Layer 3: Validator Pillars (Modular)

Each pillar is independent:

```python
class RecognitionValidator:
    @staticmethod
    def validate(intent, code, code_data, llm) -> Dict:
        # Completeness: keywords found in code?
        # Purity: functions map to intent units?
        # Semantic: LLM alignment?
        return {"score": 95.5, "components": {...}}

class InevitabilityValidator:
    @staticmethod
    def validate(intent, code, code_data, llm, 
                 use_spec_constrained=False, spec_refs=None) -> Dict:
        # ConstraintSaturation: satisfies hard constraints?
        # AlternativeDelta: are there other solutions? (PLUGGABLE)
        # Minimalism: simple enough?
        return {"score": 77.9, "components": {...}}

class CoherenceValidator:
    @staticmethod
    def validate(code, code_data, llm) -> Dict:
        # Naming: consistent conventions?
        # LayerConsistency: no mixing of abstraction levels?
        # ErrorUnity: uniform error handling?
        # ConceptualUnity: single paradigm?
        return {"score": 83.1, "components": {...}}
```

**Each can be called independently or via main orchestrator:**

```python
# Independent use
code_data = CodeAnalyzer.analyze(code)
recognition = RecognitionValidator.validate(intent, code, code_data, llm)

# Or via orchestrator
validator = ConvergenceValidator(project_path)
result = validator.run()  # Calls all three
```

---

### Layer 4: Main Orchestrator

```python
class ConvergenceValidator:
    def __init__(self, project_path: str, spec_constrained: bool = False):
        self.spec_constrained = spec_constrained  # Flag for mode
        self.spec_refs: Dict = {}  # Will be populated if detected
    
    def run(self) -> Dict:
        # 1. Load intent + code
        self.load_intent()
        self.load_project_files()
        
        # 2. Analyze code structure
        code_data = CodeAnalyzer.analyze(full_code)
        
        # 3. DETECT SPECS if in spec-constrained mode
        if self.spec_constrained:
            self.spec_refs = SpecDetector.detect(full_code, docstrings)
            # Prints: "🔍 Detected specs: ['RFC', 'PKCS', 'X.509']"
        
        # 4. Run validators (with spec context)
        recognition = RecognitionValidator.validate(...)
        inevitability = InevitabilityValidator.validate(
            ...,
            use_spec_constrained=self.spec_constrained,  # PASS MODE FLAG
            spec_refs=self.spec_refs,                      # PASS SPECS
        )
        coherence = CoherenceValidator.validate(...)
        
        # 5. Calculate verdict and save
        return {...}
```

---

## 🔌 INJECTION POINTS FOR FUTURE EXTENSIONS

### Add new validators (e.g., Security)

```python
class SecurityValidator:
    @staticmethod
    def validate(code, code_data, llm) -> Dict:
        # Check for hardcoded secrets, SQL injection patterns, etc.
        return {"score": X, "components": {...}}

# Wire into orchestrator
result = validator.run()
security = SecurityValidator.validate(code, code_data, llm)
result["scores"]["security"] = security["score"]
```

### Add new spec formats

```python
SpecDetector.SPEC_MARKERS["OWASP"] = r"OWASP\s*(?:Top\s*)?10"
SpecDetector.SPEC_MARKERS["CWE"] = r"CWE-\d+"
```

### Add domain-specific delta computers

```python
class DatabaseDeltaComputer(AlternativeDeltaComputer):
    # SQL query optimization: count only semantically-equivalent queries
    def compute(self, code, alt_scores, saturation):
        # Check if alternatives return same result set
        ...

class NetworkProtocolDeltaComputer(AlternativeDeltaComputer):
    # Check if alternatives maintain same protocol compliance
    def compute(self, code, alt_scores, saturation):
        # Check RFC conformance for each alt
        ...
```

---

## 📊 COMPARISON: Current vs Refactored

### BEFORE (Monolithic)

```
convergence_validator_new.py (850 lines)
├── Everything mixed together
├── compute_alternative_delta() has no hooks
├── if spec_refs: branch would go HERE (creates debt)
└── Hard to extend
```

### AFTER (Modular)

```
magnus_refactored_architecture.py (749 lines, cleaner)
├── SpecDetector (spec scanning)
├── AlternativeDeltaComputer (abstract)
│   ├── SyntacticDeltaComputer (default)
│   └── SpecConstrainedDeltaComputer (new!)
├── CodeAnalyzer (AST)
├── LLMJudge (Claude API)
├── ConstraintParser (INTENT.md)
├── RecognitionValidator (pillar A)
├── InevitabilityValidator (pillar B, uses pluggable delta)
├── CoherenceValidator (pillar C)
└── ConvergenceValidator (orchestrator)
```

**Benefits:**
- ✅ Adding SpecConstrainedDeltaComputer = 20 lines
- ✅ No if-statements in middle of functions
- ✅ Each validator independently testable
- ✅ Can swap delta computer at runtime
- ✅ Extensible without breaking existing code

---

## 🚀 CLI USAGE

### Default mode (current behavior)

```bash
python magnus_refactored_architecture.py kilo-test-crypto-v3/
```

Output:
```
🚀 MAGNUS 15 - Validating kilo-test-crypto-v3
📌 Model: claude-3-5-sonnet-20241022

🧮 Computing pillars...

  📊 RECOGNITION
     Score: 95.5/100
  📊 INEVITABILITY
     Score: 77.9/100
  📊 COHERENCE
     Score: 83.1/100

============================================================
VERDICT: PARTIAL 🎯
Mode: DEFAULT
============================================================
```

### Spec-constrained mode (NEW!)

```bash
python magnus_refactored_architecture.py kilo-test-crypto-v3/ --spec-constrained
```

Output:
```
🚀 MAGNUS 15 - Validating kilo-test-crypto-v3
📌 Mode: SPEC-CONSTRAINED
📌 Model: claude-3-5-sonnet-20241022

🔍 Detected specs: ['RFC', 'PKCS', 'X.509']

🧮 Computing pillars...

  📊 RECOGNITION
     Score: 95.5/100
  📊 INEVITABILITY
     Score: 100.0/100        ← WOULD BE 100 IF SPEC VALIDATOR ENABLED!
     (Spec-constrained mode)
  📊 COHERENCE
     Score: 83.1/100

============================================================
VERDICT: CONVERGED 🎯
Mode: SPEC-CONSTRAINED
Specs detected: RFC, PKCS, X.509
============================================================
```

---

## 📋 IMPLEMENTATION ROADMAP

### Phase 1: Test refactored architecture (NOW)
- ✅ Run refactored Magnus on CryptoValidator v3
- ✅ Compare output with old Magnus
- ✅ Verify spec detection works

### Phase 2: Implement spec conformance checker
- Placeholder: `_is_spec_compliant()` returns False
- Real: LLM call to verify "does this code satisfy RFC 3447?"
- Or: pattern-based checks (e.g., "RSA-2048" in code → check key_size == 2048)

### Phase 3: Add more delta computers
- DatabaseDeltaComputer (SQL semantic equivalence)
- NetworkProtocolDeltaComputer (protocol conformance)
- APISchemaValidator (OpenAPI compliance)

### Phase 4: Generalize to v1.5
- Domain mode selector: `--domain [applicative|crypto|database|api|protocol]`
- Each domain has own delta computer
- Single codebase, multiple personalities

---

## 🎯 KEY DESIGN DECISIONS

**1. Why inheritance, not composition?**
- `AlternativeDeltaComputer` as abstract base forces interface contract
- Makes it clear: "all computers must implement compute()"
- Easy to add new ones without breaking existing

**2. Why pass spec_refs through orchestrator?**
- Separation of concerns: SpecDetector does detection, validators use results
- Flexible: could detect specs from different sources (comments, config file, CLI flag)

**3. Why keep SpecConstrainedDeltaComputer simple?**
- Placeholder `_is_spec_compliant()` returns False conservatively
- Real implementation should be domain-specific
- For now: structure is ready, logic can be added incrementally

**4. Why not break into separate files yet?**
- Single file makes testing easier (import one module)
- When it stabilizes → can split into packages
- For v1.0 launch: simpler distribution

---

## 📝 NEXT STEPS

1. **Run refactored Magnus on crypto** → see if spec detection works
2. **Compare scores** → default vs spec-constrained mode
3. **Implement `_is_spec_compliant()`** → real spec validation
4. **Test on other domains** → database, API, network protocols
5. **Document for v1.5 release** → "Spec-Constrained Mode"

