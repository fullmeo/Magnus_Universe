# Magnus 15 - Code Convergence Validator

**Magnus 15** validates whether AI-generated code truly matches developer intent using a scientifically-grounded three-pillar framework.

> **v1.0 Production** — both known bugs fixed (naming heuristic, AlternativeDelta calculation).

## The Three Pillars

| Pillar | Question | Threshold |
| ------ | -------- | --------- |
| **Recognition** | Does the code capture the complete intent? | ≥80 |
| **Inevitability** | Is this the minimal, optimal solution? | ≥80 |
| **Coherence** | Is the code internally consistent? | ≥75 |

## Quick Start

### Python Version

```bash
export ANTHROPIC_API_KEY=your_key
python convergence_validator.py examples/converged
```

### JavaScript Version

```bash
cd js
npm install
export ANTHROPIC_API_KEY=your_key
node convergence-validator.js ../examples/converged
```

## Results

v1.0-FIXED output across all examples:

```text
examples/converged      — CONVERGED     Rec=88.0  Inev=88.6  Coh=88.5
examples/data_validator — CONVERGED     Rec=88.0  Inev=84.0  Coh=86.0
examples/kilo_routing   — PARTIAL       Rec=80.4  Inev=74.4  Coh=80.2
examples/rate_limiter    — NON_CONVERGED Rec=78.0  Inev=73.5  Coh=83.9  (Kilo Claw)
examples/email_validator — PARTIAL       Rec=80.5  Inev=70.4  Coh=80.6  (Kilo Claw)
examples/incomplete      — NON_CONVERGED Rec=42.0  Inev=55.0  Coh=72.0
```

## Examples

| Example | Type | Rec | Inev | Coh | Verdict |
| ------- | ---- | --- | ---- | --- | ------- |
| [converged](examples/converged/) | Simple Calculator | 88.0 | 88.6 | 88.5 | ✅ CONVERGED |
| [data_validator](examples/data_validator/) | Data Validator | 88.0 | 84.0 | 86.0 | ✅ CONVERGED |
| [kilo_routing](examples/kilo_routing/) | Agent Orchestration | 80.4 | 74.4 | 80.2 | ⚠️ PARTIAL |
| [rate_limiter](examples/rate_limiter/) | Token Bucket (Kilo Claw) | 78.0 | 73.5 | 83.9 | ❌ NON_CONVERGED |
| [email_validator](examples/email_validator/) | Email Validator (Kilo Claw) | 80.5 | 70.4 | 80.6 | ⚠️ PARTIAL |
| [incomplete](examples/incomplete/) | Incomplete impl | 42.0 | 55.0 | 72.0 | ❌ NON_CONVERGED |

## Architecture

```text
magnus-15-convergence-validator/
├── convergence_validator.py     # Python validator v1.0-FIXED
├── js/
│   ├── convergence-validator.js # JS validator
│   └── package.json
└── examples/
    ├── converged/               # Simple Calculator — CONVERGED
    │   ├── INTENT.md
    │   ├── generated_code.py
    │   ├── convergence_validator.py
    │   ├── convergence_report.json
    │   └── convergence_report.md
    ├── data_validator/          # Data Validator — CONVERGED
    │   ├── INTENT.md
    │   ├── generated_code.py
    │   ├── convergence_validator.py
    │   ├── convergence_report.json
    │   └── convergence_report.md
    ├── kilo_routing/            # Agent Orchestration — PARTIAL
    │   ├── INTENT.md
    │   ├── generated_code.py
    │   ├── convergence_validator.py
    │   ├── convergence_report.json
    │   └── convergence_report.md
    ├── rate_limiter/            # Token Bucket (Kilo Claw) — NON_CONVERGED
    │   ├── INTENT.md
    │   ├── generated_code.py
    │   ├── convergence_validator.py
    │   ├── convergence_report.json
    │   └── convergence_report.md
    ├── email_validator/         # Email Validator (Kilo Claw) — PARTIAL
    │   ├── INTENT.md
    │   ├── generated_code.py
    │   ├── convergence_validator.py
    │   ├── convergence_report.json
    │   └── convergence_report.md
    └── incomplete/              # Incomplete impl — NON_CONVERGED (intentional)
        ├── INTENT.md
        ├── generated_code.py
        ├── convergence_validator.py
        ├── convergence_report.json
        └── convergence_report.md
```

## Requirements

### Python

- Python 3.8+
- `pip install anthropic`

### JavaScript

- Node.js 18+
- `npm install @anthropic-ai/sdk esprima commander chalk ora`

## Changelog

### v1.0-FIXED (2026-02-23)

- **Fix Bug #1**: Naming heuristic now uses `n == n.lower()` — single-word functions (`add`, `subtract`, `divide`) were incorrectly scoring 0% naming consistency
- **Fix Bug #2**: AlternativeDelta now computes real LLM scores for generated alternatives instead of hardcoded `delta = 20.0` — removes structural ceiling on Inevitability

### v1.0 (2026-02-09)

- Initial production release with three-pillar framework
- Static AST analysis + Claude LLM evaluation
- JSON + Markdown report output

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

**Status**: Active — v1.0-FIXED (Production Ready)
