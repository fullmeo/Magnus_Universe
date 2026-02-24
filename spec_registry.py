"""
MAGNUS 15 v1.6 - SPEC REGISTRY
Minimal, composable spec management
"""

from dataclasses import dataclass, field, asdict
from typing import Dict, List, Optional
import yaml
import json
from pathlib import Path

# ====================== SPEC DEFINITION ======================

@dataclass
class SpecDefinition:
    """
    Specification definition.
    Separates concerns: detection (markers) vs validation (violations, delta_computer).
    """
    name: str                                    # e.g., "GDPR", "PKCS", "PCI-DSS"
    domain: str                                  # "cryptography" | "regulatory" | "protocol" | "custom"
    description: str                             # Human-readable description
    markers: Dict[str, str] = field(default_factory=dict)  # {name: regex} for detection
    violations: Dict[str, Dict[str, str]] = field(default_factory=dict)  # {name: {pattern, description}}
    delta_computer: str = "auto"                # "regex" | "llm" | "auto"
    conformance_prompt: Optional[str] = None    # Override prompt template
    
    def to_dict(self) -> Dict:
        """Convert to dictionary for YAML/JSON serialization."""
        return asdict(self)
    
    @staticmethod
    def from_dict(data: Dict) -> "SpecDefinition":
        """Create from dictionary."""
        return SpecDefinition(**data)
    
    def has_regex_violations(self) -> bool:
        """Check if spec has regex-based violation patterns."""
        return bool(self.violations)


# ====================== SPEC REGISTRY ======================

class SpecRegistry:
    """
    Centralized spec definitions.
    Separates markers (detection) from violations (validation).
    """
    
    def __init__(self):
        self._specs: Dict[str, SpecDefinition] = {}
        self._load_builtins()
    
    def _load_builtins(self):
        """Load built-in specs."""
        
        # CRYPTOGRAPHY SPECS
        self.register(SpecDefinition(
            name="PKCS",
            domain="cryptography",
            description="Public Key Cryptography Standards (RSA, padding, hashing)",
            markers={"PKCS": r"PKCS[#-]?\d"},
            violations={
                "RSA_SIZE": {
                    "pattern": r"(RSA-?(?:4096|8192)|key_size\s*(?:!=|==)\s*2048)",
                    "description": "Non-2048-bit RSA (PKCS#1 v1.5 requires RSA-2048)",
                },
                "PADDING": {
                    "pattern": r"(padding\.(?:OAEP|PSS)|PSS|OAEP)",
                    "description": "Padding other than PKCS#1 v1.5",
                },
            },
            delta_computer="regex",
        ))
        
        self.register(SpecDefinition(
            name="FIPS",
            domain="cryptography",
            description="Federal Information Processing Standards (crypto, hashing)",
            markers={"FIPS": r"FIPS\s*\d{3,4}"},
            violations={
                "HASH_ALGO": {
                    "pattern": r"(SHA-?(?:1|512)|MD5|blake2)",
                    "description": "Hash algorithm other than SHA-256",
                },
            },
            delta_computer="regex",
        ))
        
        self.register(SpecDefinition(
            name="NIST",
            domain="cryptography",
            description="National Institute of Standards and Technology specs",
            markers={"NIST": r"NIST"},
            violations={},  # No regex violations (LLM-validated)
            delta_computer="llm",
        ))
        
        self.register(SpecDefinition(
            name="X.509",
            domain="cryptography",
            description="X.509 Certificate standard",
            markers={"X.509": r"X\.509"},
            violations={},
            delta_computer="regex",
        ))
        
        # REGULATORY SPECS
        self.register(SpecDefinition(
            name="GDPR",
            domain="regulatory",
            description="General Data Protection Regulation (EU privacy law)",
            markers={"GDPR": r"GDPR"},
            violations={},  # Violations are semantic, not syntactic
            delta_computer="llm",
            conformance_prompt="""Validate GDPR compliance:
1. Explicit user consent before processing
2. Right to be forgotten (data deletion)
3. Data minimization
4. Breach notification
Does the code satisfy all requirements?""",
        ))
        
        self.register(SpecDefinition(
            name="PCI-DSS",
            domain="regulatory",
            description="Payment Card Industry Data Security Standard",
            markers={"PCI-DSS": r"PCI-?DSS"},
            violations={},
            delta_computer="llm",
            conformance_prompt="""Validate PCI-DSS compliance:
1. Sensitive data handling (no plaintext)
2. Encryption in transit and at rest
3. Access logging and monitoring
4. Input validation and escaping
Does the code satisfy all requirements?""",
        ))
        
        self.register(SpecDefinition(
            name="SOC2",
            domain="regulatory",
            description="System and Organization Controls (security, availability, integrity)",
            markers={"SOC2": r"SOC\s*2"},
            violations={},
            delta_computer="llm",
        ))
        
        self.register(SpecDefinition(
            name="HIPAA",
            domain="regulatory",
            description="Health Insurance Portability and Accountability Act (healthcare data)",
            markers={"HIPAA": r"HIPAA"},
            violations={},
            delta_computer="llm",
        ))
        
        # PROTOCOL SPECS
        self.register(SpecDefinition(
            name="RFC",
            domain="protocol",
            description="Request for Comments (IETF specifications)",
            markers={"RFC": r"RFC\s*\d{4,5}"},
            violations={},  # Protocol violations are semantic
            delta_computer="llm",
        ))
        
        self.register(SpecDefinition(
            name="ISO",
            domain="protocol",
            description="International Organization for Standardization standards",
            markers={"ISO": r"ISO\s*\d{4,5}"},
            violations={},
            delta_computer="llm",
        ))
    
    def register(self, spec: SpecDefinition):
        """Register a spec definition."""
        self._specs[spec.name] = spec
    
    def get(self, name: str) -> Optional[SpecDefinition]:
        """Get a spec by name."""
        return self._specs.get(name)
    
    def all_specs(self) -> Dict[str, SpecDefinition]:
        """Get all registered specs."""
        return self._specs.copy()
    
    def all_markers(self) -> Dict[str, str]:
        """
        Get all markers for detection.
        Returns: {spec_name: regex_pattern}
        """
        markers = {}
        for spec in self._specs.values():
            for marker_name, pattern in spec.markers.items():
                markers[marker_name] = pattern
        return markers
    
    def all_violations(self, spec_names: List[str]) -> Dict[str, Dict]:
        """
        Get all violations for specified specs.
        Returns: {spec_name: {violation_type: {pattern, description}}}
        """
        violations = {}
        for spec_name in spec_names:
            spec = self.get(spec_name)
            if spec and spec.violations:
                violations[spec_name] = spec.violations
        return violations
    
    def load_yaml(self, path: str) -> List[str]:
        """
        Load custom specs from YAML file.
        Returns: List of loaded spec names.
        
        Example YAML:
        specs:
          - name: "CUSTOM_AUDIT"
            domain: "custom"
            description: "Custom audit spec"
            markers:
              AUDIT: "AUDIT"
            violations:
              LOG_LEVEL:
                pattern: "log\.info"
                description: "Must use log.warning or higher"
            delta_computer: "regex"
        """
        loaded = []
        try:
            with open(path, 'r') as f:
                data = yaml.safe_load(f)
            
            if not data or 'specs' not in data:
                return loaded
            
            for spec_data in data['specs']:
                spec = SpecDefinition.from_dict(spec_data)
                self.register(spec)
                loaded.append(spec.name)
            
            return loaded
        except FileNotFoundError:
            print(f"⚠️  Spec file not found: {path}")
            return loaded
        except yaml.YAMLError as e:
            print(f"❌ YAML parse error: {e}")
            return loaded
    
    def save_spec_template(self, path: str):
        """Save a template YAML file for custom specs."""
        template = """# MAGNUS 15 - CUSTOM SPEC TEMPLATE
# Uncomment and fill in to add custom specs

specs:
  # Example: Custom PII Detection Spec
  - name: "PII_DETECTION"
    domain: "custom"
    description: "Detect personally identifiable information handling"
    markers:
      PII: "PII"
    violations:
      HARDCODED_SSN:
        pattern: "\\d{3}-\\d{2}-\\d{4}"
        description: "Do not hardcode SSN"
      PLAINTEXT_EMAIL:
        pattern: "plaintext.*email"
        description: "Do not store plaintext emails"
    delta_computer: "regex"
  
  # Example: Custom Compliance Spec (LLM-validated)
  # - name: "CUSTOM_AUDIT"
  #   domain: "custom"
  #   description: "Custom audit requirements"
  #   markers:
  #     AUDIT: "AUDIT"
  #   violations: {}  # No regex patterns, LLM will validate
  #   delta_computer: "llm"
  #   conformance_prompt: "Validate that all database queries have audit logging"
"""
        with open(path, 'w') as f:
            f.write(template)
        print(f"✅ Template saved: {path}")


# ====================== CLI COMMANDS ======================

class SpecRegistryCLI:
    """CLI interface for spec management."""
    
    def __init__(self, registry: SpecRegistry):
        self.registry = registry
    
    def list_specs(self, domain: Optional[str] = None) -> None:
        """List all specs, optionally filtered by domain."""
        specs = self.registry.all_specs()
        
        if domain:
            specs = {k: v for k, v in specs.items() if v.domain == domain}
        
        if not specs:
            print("No specs found")
            return
        
        print(f"\n{'Spec':<15} {'Domain':<15} {'Delta Computer':<15} {'Violations':<10}")
        print("=" * 60)
        for name, spec in sorted(specs.items()):
            violations_count = len(spec.violations) if spec.violations else 0
            print(f"{name:<15} {spec.domain:<15} {spec.delta_computer:<15} {violations_count:<10}")
        print()
    
    def show_spec(self, name: str) -> None:
        """Show details of a specific spec."""
        spec = self.registry.get(name)
        if not spec:
            print(f"❌ Spec not found: {name}")
            return
        
        print(f"\n📋 {spec.name}")
        print(f"   Domain: {spec.domain}")
        print(f"   Description: {spec.description}")
        print(f"   Delta Computer: {spec.delta_computer}")
        
        if spec.markers:
            print(f"   Markers:")
            for marker_name, pattern in spec.markers.items():
                print(f"     - {marker_name}: {pattern}")
        
        if spec.violations:
            print(f"   Violations:")
            for violation_name, violation_data in spec.violations.items():
                print(f"     - {violation_name}: {violation_data.get('description', 'N/A')}")
        
        if spec.conformance_prompt:
            print(f"   Custom Conformance Prompt: {spec.conformance_prompt[:100]}...")
        
        print()
    
    def add_spec(self, yaml_path: str) -> None:
        """Add specs from a YAML file."""
        loaded = self.registry.load_yaml(yaml_path)
        if loaded:
            print(f"✅ Loaded {len(loaded)} spec(s): {', '.join(loaded)}")
        else:
            print(f"❌ No specs loaded from {yaml_path}")


# ====================== TESTING ======================

if __name__ == "__main__":
    import sys
    
    registry = SpecRegistry()
    cli = SpecRegistryCLI(registry)
    
    if len(sys.argv) < 2:
        print("Usage: magnus specs [list|show|add|template] [args]")
        sys.exit(1)
    
    command = sys.argv[1]
    
    # Try to load magnus.yaml if it exists (persistent custom specs)
    if Path("magnus.yaml").exists():
        loaded = registry.load_yaml("magnus.yaml")
        if loaded:
            print(f"📦 Loaded {len(loaded)} custom spec(s) from magnus.yaml")
    
    if command == "list":
        domain = sys.argv[2] if len(sys.argv) > 2 else None
        cli.list_specs(domain)
    
    elif command == "show":
        if len(sys.argv) < 3:
            print("Usage: magnus specs show <spec_name>")
            sys.exit(1)
        cli.show_spec(sys.argv[2])
    
    elif command == "add":
        if len(sys.argv) < 3:
            print("Usage: magnus specs add <yaml_path>")
            sys.exit(1)
        loaded = registry.load_yaml(sys.argv[2])
        if loaded:
            # Save to magnus.yaml for persistence
            with open("magnus.yaml", 'a') as f:
                for spec_name in loaded:
                    spec = registry.get(spec_name)
                    if spec:
                        f.write(f"\n# Custom spec: {spec_name}\n")
                        f.write(f"{spec.to_dict()}\n")
            print(f"✅ Saved to magnus.yaml")
    
    elif command == "template":
        output = sys.argv[2] if len(sys.argv) > 2 else "specs.yaml"
        registry.save_spec_template(output)
    
    else:
        print(f"Unknown command: {command}")
        sys.exit(1)
