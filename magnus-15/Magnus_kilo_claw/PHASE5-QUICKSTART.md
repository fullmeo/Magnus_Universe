# 🚀 MAGNUS 15 PHASE 5 - QUICKSTART GUIDE

**Status**: ✅ Validator ready for testing  
**Version**: 0.1 (Phase 5 - Reproducibility Foundation)  
**Date**: February 6, 2026  

---

## ⚡ 30-SECOND START

### Setup
```bash
# Install dependencies
pip install anthropic

# Set API key
export ANTHROPIC_API_KEY="your-api-key-here"
```

### Run
```bash
# Validate a project
python convergence_validator_phase5_enhanced.py /path/to/project python

# Default (current directory)
python convergence_validator_phase5_enhanced.py
```

### Output
- `convergence_report.json` - Detailed machine-readable report
- `convergence_report.md` - Human-readable summary

---

## 📋 WHAT THE VALIDATOR DOES

```
┌─────────────────────────────────────────────┐
│  LOAD PROJECT FILES + INTENT.MD             │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│  ANALYZE CODE STRUCTURE (AST)               │
│  - Functions, classes, complexity, nesting  │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│  CALCULATE THREE PILLARS                    │
│  1. RECOGNITION (40% completeness,          │
│                  30% purity,                │
│                  30% semantic align)        │
│  2. INEVITABILITY (40% saturation,          │
│                    35% delta,               │
│                    25% minimalism)          │
│  3. COHERENCE (25% naming,                  │
│                25% layers,                  │
│                20% errors,                  │
│                30% conceptual)              │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│  GENERATE VERDICT                           │
│  CONVERGED (all ≥ threshold)               │
│  PARTIAL (2/3 ≥ threshold)                 │
│  NON_CONVERGED (< 2/3 ≥ threshold)         │
└──────────────┬──────────────────────────────┘
               ↓
┌─────────────────────────────────────────────┐
│  SAVE REPORTS (JSON + MARKDOWN)             │
└─────────────────────────────────────────────┘
```

---

## 📁 PROJECT STRUCTURE EXPECTED

```
my-project/
├── INTENT.md                    ← Developer intention
├── module1.py
├── module2.py
├── src/
│   ├── feature_a.py
│   └── feature_b.py
└── tests/
    └── test_features.py
```

### INTENT.md Format (Simple)

```markdown
# My Project Intent

## Explicit Requirements
- must validate user input
- must handle all errors gracefully
- must return JSON responses
- must log all operations

## Soft Requirements
- should use async/await
- should follow PEP 8
- could add caching

## Constraints
- Python 3.10+
- No external ML libraries
```

---

## 📊 SAMPLE OUTPUT

### convergence_report.json
```json
{
  "verdict": "CONVERGED",
  "scores": {
    "recognition": 88.7,
    "inevitability": 85.6,
    "coherence": 83.9
  },
  "details": {
    "recognition": {
      "score": 88.7,
      "components": {
        "completeness": 92.0,
        "purity": 88.0,
        "semantic_alignment": 85.0
      },
      "evidence": {
        "constraint_count": 13,
        "function_count": 47,
        "class_count": 3,
        "llm_cot": "The code correctly implements..."
      }
    },
    ...
  },
  "reproducibility": {
    "model": "claude-3-5-sonnet-20241022",
    "seed": 42,
    "timestamp": "2026-02-06T15:30:00Z",
    "language": "python",
    "file_count": 8
  }
}
```

### convergence_report.md
```markdown
# Magnus 15 Convergence Report

**Verdict: CONVERGED** 🎯

## Scores

| Pillar | Score | Threshold | Status |
|--------|-------|-----------|--------|
| Recognition | 88.7 | 80 | ✅ |
| Inevitability | 85.6 | 80 | ✅ |
| Coherence | 83.9 | 75 | ✅ |

...
```

---

## 🔧 KEY METHODS

### IntentParser
```python
intent = IntentParser.parse(content)
# Returns: Intent(explicit_constraints, implicit_constraints, raw_content, confidence)
```

### CodeAnalyzer
```python
metrics = CodeAnalyzer.analyze_python(code)
# Returns: CodeMetrics(lines, functions, classes, complexity, nesting, ...)
```

### LLMJudge
```python
llm = LLMJudge(api_key)

# Semantic alignment
score, cot = llm.semantic_alignment(intent, code)

# Conceptual unity
score, cot = llm.conceptual_unity(code)
```

### Pillar Validators
```python
recognition = RecognitionValidator.validate(intent, code, metrics, llm)
inevitability = InevitabilityValidator.validate(intent, metrics, recognition_score, llm)
coherence = CoherenceValidator.validate(code, llm)
```

---

## 💻 EXAMPLE USAGE (Script)

```python
from convergence_validator_phase5_enhanced import ConvergenceValidator

# Create validator
validator = ConvergenceValidator(
    project_path="./my-project",
    intent_path="INTENT.md",
    language="python"
)

# Run validation
report = validator.run()

# Check verdict
if report["verdict"] == "CONVERGED":
    print("✅ Code converges perfectly!")
elif report["verdict"] == "PARTIAL":
    print("⚠️  Code partially converges")
else:
    print("❌ Code does not converge")

# Access scores
scores = report["scores"]
print(f"Recognition:  {scores['recognition']}/100")
print(f"Inevitability: {scores['inevitability']}/100")
print(f"Coherence:     {scores['coherence']}/100")
```

---

## 🔍 CURRENT LIMITATIONS (PHASE 5)

**Stub Implementations**:
- ❌ Alternative generation (mocked)
- ❌ Fine-grained constraint mapping (keyword-based only)
- ❌ Multi-language support (Python only, JS hooks ready)

**Without Anthropic API Key**:
- LLM evaluations fallback to defaults (85, 77 stubs)
- CoT reasoning unavailable
- Still produces valid reports (degraded mode)

---

## 🗺️ PHASE 5 → PHASE 6 ROADMAP

### Phase 5 (Current - Reproducibility Foundation)
✅ Core infrastructure  
✅ Intent parser  
✅ Code analyzer (Python AST)  
✅ LLM integration hooks  
✅ JSON/Markdown export  
✅ CLI entry point  

### Phase 6 (Next - Enhanced Analysis)
⏳ Implement alternative generation  
⏳ Fine-grained constraint mapping  
⏳ Multi-language support (JS/TS)  
⏳ Unit tests  
⏳ Integration tests  

### Phase 7 (Production Ready)
⏳ Edge case handling  
⏳ Performance optimization  
⏳ Docker containerization  
⏳ API server (FastAPI)  
⏳ Dashboard  

---

## 🧪 TESTING

### Test Project Structure
```
test-project/
├── INTENT.md
├── main.py         (should converge)
└── tests.py
```

### Test INTENT.md
```markdown
# Test Project

## Requirements
- must validate input
- must handle errors
- must return results
```

### Test Code (main.py)
```python
def validate_input(data):
    """Validate input data"""
    if not data:
        raise ValueError("Input required")
    return True

def handle_errors(func):
    """Decorator for error handling"""
    def wrapper(*args, **kwargs):
        try:
            return func(*args, **kwargs)
        except Exception as e:
            return {"error": str(e)}
    return wrapper

@handle_errors
def process(data):
    """Process and return results"""
    validate_input(data)
    return {"status": "success", "data": data}
```

### Run Test
```bash
python convergence_validator_phase5_enhanced.py ./test-project python
```

**Expected**: CONVERGED ✅

---

## ⚠️ TROUBLESHOOTING

### "INTENT.md not found"
```
✅ Validator still works (degraded mode)
✅ Recognition score will be 0
✅ Still calculates other pillars
```

### "Anthropic not installed"
```bash
pip install anthropic
```

### "API key error"
```bash
export ANTHROPIC_API_KEY="sk-ant-..."
# or
python validator.py  # Will use env var
```

### "No files found"
```
Check:
- Project path is correct
- Files have .py extension
- Not in __pycache__ directory
```

---

## 📊 UNDERSTANDING SCORES

### Recognition (0-100)
- **90+**: Code perfectly materializes intent
- **80-90**: Code well implements intent
- **70-80**: Code mostly implements intent
- **<70**: Code missing intent elements

### Inevitability (0-100)
- **90+**: Solution clearly necessary
- **80-90**: Solution reasonably necessary
- **70-80**: Many equivalent solutions exist
- **<70**: Solution seems arbitrary

### Coherence (0-100)
- **90+**: Single clear paradigm throughout
- **80-90**: Generally coherent with minor issues
- **70-80**: Some paradigm mixing
- **<70**: Incoherent/contradictory

---

## 🚀 NEXT STEP

**You now have:**

✅ Working validator (Phase 5)  
✅ AST-based code analysis  
✅ Intent parser  
✅ LLM integration ready  
✅ JSON/Markdown export  

**To improve it:**

1. Implement alternative generation (Phases 6)
2. Add fine-grained constraint mapping
3. Support multiple languages
4. Add comprehensive tests
5. Deploy as API server

---

**Ready to test?** 🚀

```bash
python convergence_validator_phase5_enhanced.py ./my-project python
```

**À bientôt!** 🌟

---

**Version**: 0.1 (Phase 5)  
**Status**: Ready for testing  
**Next**: Phase 6 - Enhanced Analysis
