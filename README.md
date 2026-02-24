# MAGNUS 15 — Code Convergence Validator

**Validates that AI-generated code converges to intention through three pillars:**
- **Recognition** (Intention Fidelity)
- **Inevitability** (Solution Necessity)
- **Coherence** (Conceptual Unity)

Currently at **v1.6** with spec-constrained validation & custom spec registry.

---

## 🚀 Quick Start

```bash
# Default mode (syntactic validation)
python magnus.py ./my-project

# Spec-constrained (crypto/regulatory specs)
python magnus.py ./my-project --spec-constrained

# Crypto specs only (regex, fast)
python magnus.py ./my-project --spec-constrained --no-llm

# Regulatory specs (LLM, accurate)
python magnus.py ./my-project --spec-constrained --force-llm

# Custom specs
python spec_registry.py specs list
python spec_registry.py specs show GDPR
python spec_registry.py specs add my_specs.yaml
```

---

## 📊 Three Pillars

### Pillar A: Recognition (95.5/100)
How well does the code match the stated intention?
- **Completeness**: Keywords from INTENT.md found in code?
- **Purity**: Functions map to intent units?
- **Semantic Alignment**: LLM alignment score?

### Pillar B: Inevitability (91.9/100)
Is this the only reasonable solution?
- **Constraint Saturation**: Hard constraints satisfied?
- **Alternative Delta**: Do other solutions exist? (pluggable: syntactic vs spec-constrained)
- **Minimalism**: Is the code simple enough?

### Pillar C: Coherence (83.1/100)
Is the code conceptually unified?
- **Naming**: Consistent conventions?
- **Layer Consistency**: No mixing of abstraction levels?
- **Error Unity**: Uniform error handling?
- **Conceptual Unity**: Single paradigm?

---

## 🔌 Pluggable Architecture

### Delta Computers (Pillar B)

**SyntacticDeltaComputer** (default)
- Counts syntactic alternatives
- Works for applicative code (utilities, business logic)
- Fast, pattern-based

**SpecConstrainedDeltaComputer** (v1.5+)
- Counts only spec-conformant alternatives
- Works for regulated code (crypto, GDPR, PCI-DSS)
- Auto-routing: regex for crypto, LLM for regulatory

---

## 📋 Spec Registry (v1.6)

Define custom specs without forking code.

### Built-in Specs (10)

**Cryptography** (4)
- PKCS: RSA, padding, hashing
- FIPS: Federal standards
- NIST: Guidelines
- X.509: Certificates

**Regulatory** (4)
- GDPR: Data protection
- PCI-DSS: Payment cards
- SOC2: Controls
- HIPAA: Healthcare

**Protocol** (2)
- RFC: IETF specs
- ISO: Standards

### Custom Specs

```yaml
# my_specs.yaml
specs:
  - name: "PII_DETECTION"
    domain: "custom"
    description: "PII handling validation"
    markers:
      PII: "PII"
    violations:
      HARDCODED_EMAIL:
        pattern: "hardcoded.*email"
        description: "Do not hardcode emails"
    delta_computer: "regex"
```

```bash
python spec_registry.py specs add my_specs.yaml
```

---

## 🎯 Verdicts

| Score | Meaning |
|---|---|
| **CONVERGED** | All 3 pillars ≥ threshold (80, 80, 75) |
| **PARTIAL** | 2+ pillars ≥ threshold |
| **NON_CONVERGED** | <2 pillars meet threshold |

---

## 🚀 Roadmap

**v1.5** ✅ Auto-routing (crypto→regex, regulatory→LLM)
**v1.6** ✅ Spec Registry (custom specs in YAML)
**v1.7** → Package split (magnus/ structure)
**v2.0** → Marketplace (specs.magnus.dev)

---

## 📖 Documentation

- `SPEC-REGISTRY.md` — Custom specs & API
- `INTEGRATION-REPORT.md` — v1.1→v1.6 history
- `CHANGELOG.md` — Release notes

---

## 🛠️ Architecture

```
Input: Project + INTENT.md
  ↓
CodeAnalyzer (AST)
  ├→ RecognitionValidator (pillar A)
  ├→ InevitabilityValidator (pillar B, pluggable delta)
  └→ CoherenceValidator (pillar C)
  ↓
SpecDetector (detect PKCS, GDPR, RFC, etc)
  ├→ Auto-routing (crypto→regex, regulatory→LLM)
  └→ SpecRegistry (built-in + custom specs)
  ↓
Verdict: CONVERGED | PARTIAL | NON_CONVERGED
```

---

**Created**: February 24, 2026  
**Status**: Production ready (v1.6)  
**Author**: Serigne DIAGNE  
**License**: MIT
