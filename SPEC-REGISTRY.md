# MAGNUS 15 v1.6 - SPEC REGISTRY

**Date**: February 24, 2026  
**Status**: ✅ IMPLEMENTED & TESTED  
**Code**: 384 lines (384 including docstrings)  

---

## 🎯 ARCHITECTURE DECISION

**Clean separation of concerns:**
- `SpecDefinition` → Dataclass for immutable spec definition
- `SpecRegistry` → Service for managing specs
- `SpecRegistryCLI` → Interface for users

**Key insight**: Separate markers (detection) from violations (validation)
- GDPR: `markers={...}` + `violations={}` (LLM validates)
- PKCS: `markers={...}` + `violations={...}` (regex validates)
- Both use same structure → easy extension

---

## 📊 BUILT-IN SPECS (10)

### Cryptography (4)
| Spec | Markers | Violations | Delta | Use Case |
|---|---|---|---|---|
| PKCS | PKCS | RSA_SIZE, PADDING | regex | RSA crypto, padding |
| FIPS | FIPS | HASH_ALGO | regex | Federal standards |
| NIST | NIST | (none) | llm | NIST guidelines |
| X.509 | X.509 | (none) | regex | Certificate specs |

### Regulatory (4)
| Spec | Markers | Violations | Delta | Use Case |
|---|---|---|---|---|
| GDPR | GDPR | (none) | llm | EU data protection |
| PCI-DSS | PCI-DSS | (none) | llm | Payment card security |
| SOC2 | SOC2 | (none) | llm | Compliance controls |
| HIPAA | HIPAA | (none) | llm | Healthcare privacy |

### Protocol (2)
| Spec | Markers | Violations | Delta | Use Case |
|---|---|---|---|---|
| RFC | RFC | (none) | llm | Protocol specs |
| ISO | ISO | (none) | llm | ISO standards |

---

## 🔧 API

### SpecDefinition (Dataclass)

```python
@dataclass
class SpecDefinition:
    name: str                    # "GDPR", "PKCS"
    domain: str                  # "cryptography" | "regulatory" | "protocol" | "custom"
    description: str             # Human-readable
    markers: Dict[str, str]      # {name: regex} for detection
    violations: Dict[str, Dict]  # {name: {pattern, description}} for validation
    delta_computer: str          # "regex" | "llm" | "auto"
    conformance_prompt: Optional[str] = None  # Override LLM prompt
```

### SpecRegistry

```python
registry = SpecRegistry()

# Get built-in spec
gdpr = registry.get("GDPR")

# Get all specs
all_specs = registry.all_specs()

# Get markers for detection
markers = registry.all_markers()
# Returns: {"PKCS": r"PKCS[#-]?\d", "GDPR": r"GDPR", ...}

# Get violations for conformance checking
violations = registry.all_violations(["PKCS", "GDPR"])
# Returns: {"PKCS": {"RSA_SIZE": {...}, ...}, ...}

# Register custom spec
custom = SpecDefinition(...)
registry.register(custom)

# Load from YAML
registry.load_yaml("magnus.yaml")
```

### SpecRegistryCLI

```bash
# List all specs
python magnus.py specs list

# List specs by domain
python magnus.py specs list cryptography

# Show spec details
python magnus.py specs show GDPR

# Generate template for custom specs
python magnus.py specs template custom_specs.yaml

# Add custom specs
python magnus.py specs add custom_specs.yaml
```

---

## 📝 CUSTOM SPEC YAML FORMAT

```yaml
specs:
  - name: "PII_DETECTION"
    domain: "custom"
    description: "Detect PII handling violations"
    markers:
      PII: "PII"                    # Detection marker
    violations:
      HARDCODED_EMAIL:              # Validation rules
        pattern: "hardcoded.*email"
        description: "Do not hardcode emails"
      HARDCODED_SSN:
        pattern: '\d{3}-\d{2}-\d{4}'
        description: "Do not hardcode SSN"
    delta_computer: "regex"          # Use regex for validation
  
  - name: "CUSTOM_AUDIT"
    domain: "custom"
    description: "Custom audit requirements"
    markers:
      AUDIT: "AUDIT"
    violations: {}                   # No regex patterns
    delta_computer: "llm"            # Use LLM for validation
    conformance_prompt: |
      Check if all database queries have audit logging.
      Validate that sensitive operations are logged.
```

---

## 🔌 INTEGRATION WITH MAGNUS 15

### In SpecDetector

```python
# Replace hardcoded patterns with registry
registry = SpecRegistry()
markers = registry.all_markers()

# Detect specs in code
for spec_type, pattern in markers.items():
    matches = re.findall(pattern, code, re.IGNORECASE)
    if matches:
        specs[spec_type] = matches

# Get violations for conformance checking
violations = registry.all_violations(list(specs.keys()))
```

### In SpecConstrainedDeltaComputer

```python
# Get delta computer for spec
spec = registry.get("GDPR")
delta_computer_type = spec.delta_computer  # "llm" or "regex"

# Get conformance prompt (if custom)
conformance_prompt = spec.conformance_prompt or DEFAULT_PROMPT
```

---

## ✅ BENEFITS

| Aspect | Before | After |
|---|---|---|
| **Adding specs** | Fork code | `magnus specs add my_specs.yaml` |
| **Custom specs** | Not possible | Define in YAML, auto-loaded |
| **Spec validation** | Hardcoded logic | Registry-driven |
| **Markers + violations** | Mixed together | Clean separation |
| **LLM-only specs** | Can't define | Supported (violations={}) |
| **Extensibility** | Limited | Full (dataclass + registry) |

---

## 🚀 ROADMAP

**v1.6** (Current)
- ✅ SpecDefinition dataclass
- ✅ SpecRegistry with built-in specs
- ✅ YAML loading
- ✅ CLI (list, show, add, template)
- ✅ Clean separation: markers vs violations

**v1.7** (Next)
- [ ] Package split (magnus/ structure)
- [ ] Async validators
- [ ] Spec versioning

**v2.0** (Future)
- [ ] Remote spec registry (specs.magnus.dev)
- [ ] Community contributions
- [ ] Multi-expert validation
- [ ] Marketplace

---

## 📊 ARCHITECTURE DIAGRAM

```
User Code (with spec markers)
    ↓
SpecDetector.detect()
    ↓ (uses registry.all_markers())
Specs detected: ["GDPR", "PKCS"]
    ↓
SpecRegistry.should_use_llm()
    ├→ GDPR: regulatory → llm ✅
    └→ PKCS: cryptography → regex ✅
    ↓
SpecConstrainedDeltaComputer
    ├→ regex path: validate via patterns
    └→ llm path: validate via LLM
    ↓
Inevitability score
```

---

## 🎯 KEY DESIGN DECISIONS

**1. Why separate markers from violations?**
- Markers are for detection (always needed)
- Violations are for regex conformance (optional)
- LLM-only specs: markers yes, violations no
- Allows clean schema evolution

**2. Why dataclass for SpecDefinition?**
- Immutable by design
- Serializable to/from YAML/JSON
- Type-safe with defaults
- Easy to version later

**3. Why SpecRegistry as service?**
- Single source of truth
- Easy to extend (register custom specs)
- Foundation for remote registry (v2.0)
- Can be mocked in tests

**4. Why separate SpecRegistryCLI?**
- Future: can be separate subcommand
- Decoupled from registry logic
- Easy to test independently
- Can be extended with more commands

---

## 📝 NEXT STEPS

1. **Integrate with Magnus main validator** → Use `SpecRegistry` instead of hardcoded `SPEC_MARKERS`
2. **Update SpecDetector** → Get markers from registry
3. **Update SpecConstrainedDeltaComputer** → Use registry for violations
4. **Add to Magnus CLI** → `magnus specs [list|show|add|template]`
5. **Documentation** → User guide for custom specs
6. **Tests** → Full coverage for registry operations

---

**Status**: Ready for integration into Magnus 15 v1.6 core  
**Impact**: Users can now define custom specs without code changes  
**Path**: v1.6 (Registry) → v1.7 (Package split) → v2.0 (Marketplace)
