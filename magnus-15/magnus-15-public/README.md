# Magnus 15 - Code Convergence Validator

**Magnus 15** is an open-source tool that validates whether generated code truly matches the original intent, using a three-pillar framework:

- **Recognition**: Does the code capture the complete intent? (Intent → Code alignment)
- **Inevitability**: Is this the minimal, optimal solution? (No over-engineering)
- **Coherence**: Is the code internally consistent? (Naming, layers, error handling)

## Quick Start

```bash
# Clone the repo
git clone https://github.com/YOUR_USERNAME/magnus-15.git
cd magnus-15

# Run validation
python convergence_validator.py --intent INTENT.md --code generated.py
```

## Results

```
Recognition:   85.0  ✅
Inevitability: 78.5  ✅
Coherence:     92.1  ✅
Verdict: CONVERGED ✅
```

## The Three Pillars

| Pillar | Question | Threshold |
|--------|----------|-----------|
| **Recognition** | Does the code match intent? | ≥80 |
| **Inevitability** | Is this the minimal solution? | ≥80 |
| **Coherence** | Is the code internally consistent? | ≥75 |

## Use Cases

- **LLM Output Validation**: Validate AI-generated code before deployment
- **Code Review Automation**: Automated quality checks for pull requests
- **Training Data Quality**: Filter high-quality code samples
- **Architectural Compliance**: Ensure generated code follows patterns

## Architecture

```
magnus-15/
├── convergence_validator.py  # Main validator
├── intent_parser.py           # Intent extraction
├── metrics/                  # Pillar calculators
│   ├── recognition.py
│   ├── inevitability.py
│   └── coherence.py
├── examples/                  # Test cases
│   ├── simple_api/
│   └── over_engineered/
└── tests/
```

## Citation

If you use Magnus 15 in research, please cite:

```bibtex
@misc{magnus15,
  title={Magnus 15: Code Convergence Validation Framework},
  author={Fullmeo},
  year={2026},
  url={https://github.com/YOUR_USERNAME/magnus-15}
}
```

## License

MIT License - see [LICENSE](LICENSE)

---

**Status**: 🔥 Active Development - v1.0 coming Feb 24, 2026
