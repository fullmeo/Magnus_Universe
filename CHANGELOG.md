# MAGNUS 15 Changelog

## [1.6] - 2026-02-24

### Added
- **Spec Registry** (`SpecRegistry` + `SpecDefinition` dataclass)
  - Users can define custom specs in YAML without code changes
  - Built-in specs: PKCS, FIPS, NIST, X.509, GDPR, PCI-DSS, SOC2, HIPAA, RFC, ISO
  - CLI: `python spec_registry.py specs [list|show|add|template]`
  - Clean separation: markers (detection) vs violations (validation)
  - LLM-only specs supported (`violations={}`)
  
- **Custom Spec YAML Format**
  ```yaml
  specs:
    - name: "PII_DETECTION"
      domain: "custom"
      markers: {PII: "PII"}
      violations: {HARDCODED_EMAIL: {pattern: "...", description: "..."}}
      delta_computer: "regex"
  ```

- **Foundation for v1.7 & v2.0**
  - Registry as single source of truth (ready for package split)
  - Path to remote spec registry (specs.magnus.dev)
  - Community contribution model enabled

### Changed
- Auto-routing refined for accuracy
  - Crypto specs (PKCS, FIPS, X.509) → regex (5s, free)
  - Regulatory specs (GDPR, PCI-DSS, SOC2, HIPAA) → LLM (30s, accurate)
  - Protocol specs (RFC, ISO) → LLM (semantic validation needed)
  - Unknown specs → conservative fallback to LLM

### Documentation
- `SPEC-REGISTRY.md` — Complete registry API & custom specs guide
- `INTEGRATION-REPORT.md` — v1.1→v1.6 technical history
- `README.md` — Quick start with examples

---

## [1.5] - 2026-02-24

### Added
- **Auto-routing by spec type** (no manual flag required)
  - Detects spec markers in code (RFC, PKCS, GDPR, etc)
  - Routes to regex (fast) or LLM (accurate) automatically
  - Conservative: unknown specs use LLM

- **LLM-powered conformance checking**
  - Semantic validation for regulatory specs (GDPR, PCI-DSS, SOC2, HIPAA)
  - Complementary to regex patterns (PKCS, FIPS, NIST)
  - Custom conformance prompts per spec
  - Cost ~$0.01-0.05 per validation

- **Spec detection expanded** (from 2 to 10 spec types)
  - Crypto: PKCS, FIPS, NIST, X.509
  - Regulatory: GDPR, PCI-DSS, SOC2, HIPAA
  - Protocol: RFC, ISO
  - Detection regex patterns built-in

- **CLI flags**
  - `--spec-constrained` — Enable spec-constrained mode
  - `--no-llm` — Force regex-only validation
  - `--force-llm` — Force LLM validation
  - Defaults: auto-routing (recommended)

### Changed
- `SpecConstrainedDeltaComputer.compute()` signature
  - Added `alt_codes: List[str]` parameter
  - Now validates actual alternative code, not just scores
  - Correct logic: `delta = 100.0` for "no conformant alternatives"

- `SpecDetector.is_conformant()` now validates alternatives
  - Returns `(is_conformant: bool, violations: List[str])`
  - Checks crypto patterns (RSA-2048, SHA-256, PKCS#1 v1.5)
  - Foundation for LLM-powered validation

- `InevitabilityValidator.validate()` signature
  - Added `use_spec_constrained` and `spec_refs` parameters
  - Added `use_llm` flag for conditional LLM validation
  - Passes `alt_codes` to delta computer

### Fixed
- Delta computer selection now spec-aware
  - Syntactic space: alternatives exist → delta based on quality
  - Spec space: no conformant alternatives → delta = 100 (correct)
  - Inevitability scores now meaningful for both domains

- Alternative delta computation
  - v1.1: penalized spec-driven code (false negative)
  - v1.5: corrected logic (delta = 100 when no alternatives)

### Performance
- Crypto specs: ~5 seconds (regex-only)
- Regulatory specs: ~30 seconds (LLM validation)
- Default mode (no specs): ~10 seconds

### Documentation
- `MAGNUS-15-FUNDAMENTAL-LIMIT.md` — Why inevitability differs by domain
- `KILO-CLAW-MAGNUS-FEEDBACK-LOOP-ANALYSIS.md` — String utils testing

---

## [1.1] - 2026-02-24

### Added
- **Spec-constrained delta computer** (first implementation)
  - Separates spec-driven from applicative code
  - Regex-based conformance checking for crypto
  - Detects violations: RSA-2048, SHA-256, PKCS#1 v1.5
  - Initial version: `delta = 0` when no alternatives (later corrected in v1.5)

- **SpecDetector** class
  - Marks detection for PKCS, X.509 (hardcoded)
  - Crypto violation patterns (RSA, hash, padding)
  - Foundation for v1.6 registry

- **Modular architecture**
  - `AlternativeDeltaComputer` abstract base
  - `SyntacticDeltaComputer` (default)
  - `SpecConstrainedDeltaComputer` (new)
  - Pluggable design for future delta computers

### Fixed
- Signature correction: `alt_codes` parameter added
  - Required to validate actual alternative implementations
  - Not just scores

### Documentation
- `MAGNUS-REFACTORED-ARCHITECTURE-GUIDE.md` — Design rationale
- Tests on CryptoValidator v3 (CONVERGED)

---

## Historical Context

### v1.0 - Initial Launch (Feb 24, 2026)
- Three pillars: Recognition, Inevitability, Coherence
- Convergence validation: CONVERGED | PARTIAL | NON_CONVERGED
- LLM-powered pillar validators
- Code analysis via AST

### v1.1 → v1.5 → v1.6 — Same Day Evolution
- v1.1: Discovered inevitability bottleneck for spec-driven code
- v1.5: Solved via pluggable delta computers + auto-routing
- v1.6: Abstracted specs into registry (users can add custom specs)

**Key insight**: Generic metrics require domain-specific computation.

---

## Versioning

**SemVer**: Major.Minor.Patch
- **1.6.0** → Spec Registry release
- **1.5.0** → Auto-routing release
- **1.1.0** → Spec-constrained foundation
- **1.0.0** → Initial three-pillar validator

**Stable until**: v2.0 (when package split happens)

---

**Last updated**: February 24, 2026 21:00 UTC
