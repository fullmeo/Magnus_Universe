# Magnus 15 - Code Convergence Validator

**Magnus 15** validates whether AI-generated code truly matches developer intent using a scientifically-grounded three-pillar framework.

## The Three Pillars

| Pillar | Question | Threshold |
|--------|----------|-----------|
| **Recognition** | Does the code capture the complete intent? | ≥80 |
| **Inevitability** | Is this the minimal, optimal solution? | ≥80 |
| **Coherence** | Is the code internally consistent? | ≥75 |

## Quick Start

### Python Version
```bash
python convergence_validator.py --intent examples/converged/INTENT.md --code examples/converged/generated_code.py
```

### JavaScript Version
```bash
cd js
npm install
export ANTHROPIC_API_KEY=your_key
node convergence_validator.js ../example_converged
```

## Results

```
VERDICT: CONVERGED

Recognition:    95.5  ✅
Inevitability:  81.8   ✅
Coherence:      84.4   ✅
```

## Examples

| Example | Type | Rec | Inev | Coh | Verdict |
|---------|------|-----|------|-----|---------|
| [Simple](examples/simple/) | Simple API | 45.5 | 59.7 | 84.4 | ❌ NON |
| [Over-eng](examples/over_engineered/) | Anti-pattern | 25.5 | 59.5 | 84.4 | ❌ NON |
| [Converged](examples/converged/) | Target | **95.5** | **81.8** | **84.4** | ✅ CONV |
| [Medium](examples/medium/) | Medium | 65.5 | 70.6 | 84.4 | ❌ NON |
| [Complex](examples/complex/) | Edge Cases | - | - | - | ⏳ PARTIAL |

## Architecture

```
magnus-15/
├── convergence_validator.py    # Python validator (~1100 lines)
├── js/
│   ├── convergence-validator.js # JS validator
│   └── package.json
└── examples/
    ├── simple/
    ├── over_engineered/
    ├── converged/
    ├── medium/
    └── complex/
```

## Requirements

### Python
- Python 3.8+
- anthropic (optional)

### JavaScript
- Node.js 18+
- npm install @anthropic-ai/sdk esprima commander chalk ora

## Citation

```bibtex
@misc{magnus15,
  title={Magnus 15: Code Convergence Validation Framework},
  author={Kilo-Org},
  year={2026},
  url={https://github.com/Kilo-Org/magnus-15-convergence-validator}
}
```

## License

MIT License

---

**Status**: 🔥 Active - v1.1 (Python + JavaScript)
