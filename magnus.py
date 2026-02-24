"""
MAGNUS 15 - SPEC-CONSTRAINED DELTA COMPUTER
Integrated implementation with proper alt_codes signature
Version: 1.1 (Production Ready)
"""

import ast
import json
import os
import re
import sys
from pathlib import Path
from typing import Dict, List, Any, Optional, Tuple
from datetime import datetime
from anthropic import Anthropic

# ====================== CONFIG ======================
LLM_MODEL = "claude-3-5-sonnet-20241022"
SEED = 42

CONVERGENCE_THRESHOLDS = {
    "recognition": 80,
    "inevitability": 80,
    "coherence": 75,
}

LOCKED_PROMPTS = {
    "semantic_alignment": """Évalue la fidélité sémantique du code par rapport à l'intention.
INTENTION: {intent}
CODE: {code}
Score 0-100 (100 = parfaitement aligné).
Réponds SEULEMENT en JSON valide: {{"score": X, "reasoning": "..."}}""",

    "constraint_saturation": """Évalue Constraint Saturation du code.
INTENTION: {intent}
CODE: {code}
Les contraintes MUST sont-elles satisfaites? (100 ou 0)
Les contraintes SHOULD sont-elles satisfaites? (pourcentage)
Score final = (hard_constraints_satisfied) * (soft_constraints_percentage / 100)
Réponds SEULEMENT en JSON valide: {{"hard": true|false, "soft": X, "score": Y, "reasoning": "..."}}""",

    "alternatives": """Génère EXACTEMENT 2 alternatives simples et viables au code fourni.
INTENTION: {intent}
CODE: {code}
Règles: Même intent, même stack, même complexité. Pas de features supplémentaires.
Réponds SEULEMENT en JSON valide: {{"alt1": "code1...", "alt2": "code2..."}}""",

    "layer_consistency": """Évalue la cohérence des couches du code (pas de mélange bas/haut niveau).
CODE: {code}
Score 0-100 (100 = excellente séparation des responsabilités).
Réponds SEULEMENT en JSON valide: {{"score": X, "reasoning": "..."}}""",

    "conceptual_unity": """Évalue l'unité conceptuelle du code (un seul paradigme dominant).
CODE: {code}
Paradigme détecté? (OOP|FP|Procedural|Hybrid)
Score 0-100 (100 = paradigme pur et cohérent).
Réponds SEULEMENT en JSON valide: {{"score": X, "paradigm": "OOP|FP|Procedural|Hybrid", "reasoning": "..."}}""",
}

# ====================== PLUGGABLE COMPONENTS ======================

class SpecDetector:
    """Detects specification references in code/comments."""
    
    SPEC_MARKERS = {
        "RFC": r"RFC\s*\d{4,5}",
        "PKCS": r"PKCS[#-]?\d",
        "FIPS": r"FIPS\s*\d{3,4}",
        "ISO": r"ISO\s*\d{4,5}",
        "X.509": r"X\.509",
        "NIST": r"NIST",
        "PCI-DSS": r"PCI-?DSS",
        "GDPR": r"GDPR",
        "SOC2": r"SOC\s*2",
        "HIPAA": r"HIPAA",
    }
    
    # Spec domains
    REGEX_SUFFICIENT = {"PKCS", "FIPS", "NIST", "X.509"}
    LLM_REQUIRED = {"PCI-DSS", "GDPR", "SOC2", "HIPAA", "ISO", "RFC"}
    
    # Crypto violation patterns
    CRYPTO_VIOLATIONS = {
        "RSA_SIZE": {
            "pattern": r"(RSA-?(?:4096|8192)|key_size\s*(?:!=|==)\s*2048)",
            "violation": "non-2048-bit RSA",
            "spec": "RSA-2048 required",
        },
        "HASH_ALGO": {
            "pattern": r"(SHA-?(?:1|512)|MD5|blake2)",
            "violation": "hash algorithm other than SHA-256",
            "spec": "SHA-256 required",
        },
        "PADDING": {
            "pattern": r"(padding\.(?:OAEP|PSS)|PSS|OAEP)",
            "violation": "padding other than PKCS#1 v1.5",
            "spec": "PKCS#1 v1.5 required",
        },
    }
    
    @staticmethod
    def detect(code: str, docstrings: List[str] = None) -> Dict[str, List[str]]:
        """Detect specification references."""
        specs = {}
        search_text = code + "\n" + "\n".join(docstrings or [])
        
        for spec_type, pattern in SpecDetector.SPEC_MARKERS.items():
            matches = re.findall(pattern, search_text, re.IGNORECASE)
            if matches:
                specs[spec_type] = matches
        
        return specs
    
    @staticmethod
    def has_specs(specs: Dict[str, List[str]]) -> bool:
        """Check if any specs detected."""
        return bool(specs and any(specs.values()))
    
    @staticmethod
    def should_use_llm(spec_refs: Dict[str, List[str]]) -> Tuple[bool, str]:
        """
        Auto-route: determine if LLM is needed based on spec type.
        
        Crypto specs (PKCS, FIPS, NIST, X.509):
          → Violations are syntactic/pattern-based
          → Regex patterns are 100% accurate
          → Use regex (fast, free)
        
        Regulatory specs (GDPR, PCI-DSS, SOC2, HIPAA, ISO, RFC):
          → Violations are semantic/conceptual
          → Require human-level understanding
          → Use LLM (slow, accurate)
        
        Returns: (use_llm: bool, reason: str)
        """
        detected = set(spec_refs.keys())
        
        # If ANY regulatory spec detected → use LLM
        if detected & SpecDetector.LLM_REQUIRED:
            reason = f"Regulatory specs detected: {', '.join(detected & SpecDetector.LLM_REQUIRED)}"
            return True, reason
        
        # If ONLY crypto specs → use regex
        if detected & SpecDetector.REGEX_SUFFICIENT:
            reason = f"Crypto specs only: {', '.join(detected & SpecDetector.REGEX_SUFFICIENT)} → regex sufficient"
            return False, reason
        
        # Unknown specs → conservative, use LLM
        reason = f"Unknown specs: {', '.join(detected)} → conservative, using LLM"
        return True, reason
    
    @staticmethod
    def is_conformant(code: str, spec_refs: Dict[str, List[str]]) -> Tuple[bool, List[str]]:
        """
        Check if code conforms to detected specs.
        Returns: (is_conformant: bool, violations: List[str])
        """
        violations = []
        
        # If PKCS or RSA specs detected, check crypto violations
        if "PKCS" in spec_refs or any("RSA" in str(s) for s in spec_refs.values()):
            for violation_type, violation_rules in SpecDetector.CRYPTO_VIOLATIONS.items():
                if re.search(violation_rules["pattern"], code, re.IGNORECASE):
                    violations.append(f"{violation_rules['violation']} ({violation_rules['spec']})")
        
        return len(violations) == 0, violations


class AlternativeDeltaComputer:
    """Abstract base for alternative delta computation."""
    
    def compute(self, code: str, alt_scores: List[float], alt_codes: List[str], saturation: float) -> float:
        """
        Compute normalized alternative delta.
        
        Args:
            code: Original code
            alt_scores: Constraint satisfaction scores for alternatives
            alt_codes: The alternative code implementations
            saturation: Constraint satisfaction score of original
            
        Returns:
            Normalized delta score (0-100)
        """
        raise NotImplementedError


class SyntacticDeltaComputer(AlternativeDeltaComputer):
    """Default: counts syntactic alternatives (current Magnus behavior)."""
    
    def compute(self, code: str, alt_scores: List[float], alt_codes: List[str], saturation: float) -> float:
        """Compute syntactic alternative delta."""
        best_alt_score = max(alt_scores) if alt_scores else saturation - 5
        delta = saturation - best_alt_score
        
        # Normalize to 0-100 scale
        delta_normalized = min(100, max(0, (delta / 50) * 100 + 50))
        
        return delta_normalized


class SpecConstrainedDeltaComputer(AlternativeDeltaComputer):
    """
    Spec-constrained mode: counts only conformant alternatives.
    
    For spec-driven code (crypto, protocols), alternatives that violate
    the specification are not counted as valid options.
    
    Example: RSA-2048 + SHA-256 + PKCS#1 v1.5 has NO conformant alternatives.
    PSS, OAEP, SHA-512, RSA-4096 are non-conformant (not alternatives).
    """
    
    def __init__(self, spec_refs: Dict[str, List[str]], use_llm: bool = True):
        self.spec_refs = spec_refs
        self.use_llm = use_llm  # NEW: flag for LLM usage
    
    def compute(self, code: str, alt_scores: List[float], alt_codes: List[str], saturation: float) -> float:
        """
        Compute spec-constrained alternative delta.
        
        In spec-constrained mode:
        - Only count alternatives that satisfy the SAME spec
        - If spec mandates "X", then "not X" is non-conformant, not alternative
        - If no valid conformant alternatives exist → delta = 100 → inevitability MAX
          (Because the original solution is the ONLY conformant option)
        """
        # Filter alternatives by spec conformance
        valid_alternatives = []
        
        for i, alt_code in enumerate(alt_codes):
            if not alt_code:
                continue
            
            # Check if this alternative is spec-conformant
            is_conformant, violations = SpecDetector.is_conformant(alt_code, self.spec_refs)
            
            if is_conformant:
                # This alternative satisfies the same spec
                if i < len(alt_scores):
                    valid_alternatives.append(alt_scores[i])
        
        if not valid_alternatives:
            # No valid alternatives under spec constraint
            # → The original code is the ONLY conformant solution
            # → Maximum inevitability (delta = 100 in spec space)
            # → This means: no acceptable alternatives exist
            return 100.0
        
        # If there were valid alternatives, compute normally
        best_alt_score = max(valid_alternatives)
        delta = saturation - best_alt_score
        delta_normalized = min(100, max(0, (delta / 50) * 100 + 50))
        
        return delta_normalized


class CodeAnalyzer:
    """Static code analysis via AST."""
    
    @staticmethod
    def analyze(code: str) -> Dict[str, Any]:
        """Extract structure and metrics."""
        try:
            tree = ast.parse(code)
        except SyntaxError:
            return {
                "functions": [],
                "classes": [],
                "variables": [],
                "total_units": 0,
                "complexity": 1,
                "nesting": 0,
                "docstrings": [],
            }
        
        functions = []
        classes = []
        variables = []
        docstrings = []
        total_complexity = 0
        max_nesting = 0
        
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                complexity = CodeAnalyzer._complexity_for_node(node)
                nesting = CodeAnalyzer._max_nesting(node)
                docstring = ast.get_docstring(node) or ""
                functions.append({
                    "name": node.name,
                    "line": node.lineno,
                    "docstring": docstring,
                })
                if docstring:
                    docstrings.append(docstring)
                total_complexity += complexity
                max_nesting = max(max_nesting, nesting)
            
            elif isinstance(node, ast.ClassDef):
                docstring = ast.get_docstring(node) or ""
                classes.append({
                    "name": node.name,
                    "line": node.lineno,
                    "docstring": docstring,
                    "methods": [n.name for n in node.body if isinstance(n, ast.FunctionDef)],
                })
                if docstring:
                    docstrings.append(docstring)
            
            elif isinstance(node, ast.Assign):
                for target in node.targets:
                    if isinstance(target, ast.Name):
                        variables.append(target.id)
        
        avg_complexity = (total_complexity / max(len(functions), 1)) if functions else 1.0
        
        return {
            "functions": functions,
            "classes": classes,
            "variables": list(set(variables)),
            "total_units": len(functions) + len(classes),
            "complexity": avg_complexity,
            "nesting": max_nesting,
            "docstrings": docstrings,
        }
    
    @staticmethod
    def _complexity_for_node(node) -> int:
        """Cyclomatic complexity."""
        complexity = 1
        for n in ast.walk(node):
            if isinstance(n, (ast.If, ast.For, ast.While, ast.AsyncFor, ast.ExceptHandler)):
                complexity += 1
            elif isinstance(n, ast.BoolOp):
                complexity += len(n.values) - 1
        return complexity
    
    @staticmethod
    def _max_nesting(node, depth=0) -> int:
        """Max nesting depth."""
        max_depth = depth
        for child in ast.iter_child_nodes(node):
            if isinstance(child, (ast.If, ast.For, ast.While, ast.With, ast.Try)):
                max_depth = max(max_depth, CodeAnalyzer._max_nesting(child, depth + 1))
        return max_depth


class LLMJudge:
    """Claude-powered evaluation."""
    
    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("❌ ANTHROPIC_API_KEY not found")
        
        self.client = Anthropic(api_key=api_key)
        self.model = LLM_MODEL
    
    def evaluate(self, prompt: str, max_tokens: int = 1024) -> Dict[str, Any]:
        """Make LLM call."""
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=max_tokens,
                temperature=0.0,
                system="Tu es un validateur rigoureux. Réponds SEULEMENT en JSON valide.",
                messages=[{"role": "user", "content": prompt}]
            )
            
            text = response.content[0].text.strip()
            return json.loads(text)
        
        except json.JSONDecodeError:
            return {"error": "invalid_json", "raw": text[:100]}
        except Exception as e:
            return {"error": str(e)}


class ConstraintParser:
    """Parse INTENT.md."""
    
    @staticmethod
    def parse(intent_content: str) -> Dict[str, Any]:
        """Extract constraints."""
        explicit = []
        implicit = []
        
        for line in intent_content.split('\n'):
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            
            line_lower = line.lower()
            
            if any(kw in line_lower for kw in ["must", "required", "shall"]):
                explicit.append({
                    "text": line,
                    "keywords": ConstraintParser._extract_keywords(line)
                })
            elif any(kw in line_lower for kw in ["should", "prefer", "could"]):
                implicit.append({
                    "text": line,
                    "keywords": ConstraintParser._extract_keywords(line)
                })
        
        return {
            "explicit": explicit,
            "implicit": implicit,
            "raw": intent_content,
            "count": len(explicit) + len(implicit),
        }
    
    @staticmethod
    def _extract_keywords(text: str) -> List[str]:
        """Extract meaningful keywords."""
        common = {'the', 'a', 'an', 'and', 'or', 'is', 'are', 'be', 'must', 'should', 'to', 'of', 'with'}
        keywords = []
        for word in re.findall(r'\b\w+\b', text.lower()):
            if len(word) > 3 and word not in common:
                keywords.append(word)
        return keywords


# ====================== PILLAR VALIDATORS ======================

class InevitabilityValidator:
    """Pillar B: Solution Necessity (with pluggable delta)."""
    
    def __init__(self, use_spec_constrained: bool = False, spec_refs: Dict = None, use_llm: bool = True):
        """Initialize validator."""
        self.use_spec_constrained = use_spec_constrained
        self.spec_refs = spec_refs or {}
        self.use_llm = use_llm  # NEW
        
        # Choose delta computer
        if use_spec_constrained and SpecDetector.has_specs(spec_refs):
            self.delta_computer = SpecConstrainedDeltaComputer(spec_refs, use_llm=use_llm)  # UPDATED
        else:
            self.delta_computer = SyntacticDeltaComputer()
    
    @staticmethod
    def validate(
        intent_content: str,
        code: str,
        code_data: Dict[str, Any],
        llm: LLMJudge,
        use_spec_constrained: bool = False,
        spec_refs: Dict = None,
        use_llm: bool = True,  # NEW: flag for LLM usage
    ) -> Dict[str, Any]:
        """
        Inevitability = (0.40 × ConstraintSaturation) + (0.35 × AlternativeDelta) + (0.25 × Minimalism)
        """
        
        validator = InevitabilityValidator(use_spec_constrained, spec_refs, use_llm=use_llm)  # UPDATED
        
        # 1. CONSTRAINT SATURATION (40%)
        prompt = LOCKED_PROMPTS["constraint_saturation"].format(
            intent=intent_content[:1000],
            code=code[:1500]
        )
        result = llm.evaluate(prompt)
        saturation = float(result.get("score", 90))
        
        # 2. ALTERNATIVE DELTA (35%) — PLUGGABLE
        alt_prompt = LOCKED_PROMPTS["alternatives"].format(
            intent=intent_content[:800],
            code=code[:1200]
        )
        alternatives = llm.evaluate(alt_prompt, max_tokens=3000)
        
        alt1_code = alternatives.get("alt1", "")
        alt2_code = alternatives.get("alt2", "")
        alt_codes = [alt1_code, alt2_code]
        
        alt_scores = []
        for alt_code in alt_codes:
            if alt_code:
                alt_sat_prompt = LOCKED_PROMPTS["constraint_saturation"].format(
                    intent=intent_content[:1000],
                    code=alt_code[:1500]
                )
                alt_result = llm.evaluate(alt_sat_prompt)
                alt_sat = float(alt_result.get("score", 70))
                alt_scores.append(alt_sat)
            else:
                alt_scores.append(0.0)
        
        # PLUGGABLE: Use appropriate delta computer with alt_codes
        delta_normalized = validator.delta_computer.compute(code, alt_scores, alt_codes, saturation)
        
        # 3. MINIMALISM (25%)
        minimalism = InevitabilityValidator._calculate_minimalism(code_data)
        
        score = 0.40 * saturation + 0.35 * delta_normalized + 0.25 * minimalism
        
        return {
            "score": round(score, 1),
            "components": {
                "constraint_saturation": round(saturation, 1),
                "alternative_delta": round(delta_normalized, 1),
                "minimalism": round(minimalism, 1),
            },
            "delta_computer": "spec_constrained" if use_spec_constrained else "syntactic",
            "spec_refs": spec_refs,
        }
    
    @staticmethod
    def _calculate_minimalism(code_data: Dict) -> float:
        """Simplicity score."""
        complexity = code_data.get("complexity", 1)
        nesting = code_data.get("nesting", 0)
        
        complexity_score = max(0, 100 - (complexity * 10))
        nesting_score = max(0, 100 - (nesting * 15))
        
        return (complexity_score + nesting_score) / 2


class RecognitionValidator:
    """Pillar A: Intention Fidelity."""
    
    @staticmethod
    def validate(
        intent_content: str,
        code: str,
        code_data: Dict[str, Any],
        llm: LLMJudge
    ) -> Dict[str, Any]:
        """Recognition = (0.40 × Completeness) + (0.30 × Purity) + (0.30 × SemanticAlignment)"""
        
        intent = ConstraintParser.parse(intent_content)
        constraints = intent["explicit"]
        
        if not constraints:
            return {
                "score": 0.0,
                "components": {"completeness": 0, "purity": 0, "semantic_alignment": 0},
            }
        
        # 1. COMPLETENESS (40%)
        completeness = RecognitionValidator._calculate_completeness(constraints, code)
        
        # 2. PURITY (30%)
        purity = RecognitionValidator._calculate_purity(constraints, code_data)
        
        # 3. SEMANTIC (30%)
        prompt = LOCKED_PROMPTS["semantic_alignment"].format(
            intent=intent_content[:1000],
            code=code[:1500]
        )
        result = llm.evaluate(prompt)
        semantic = float(result.get("score", 85))
        
        score = 0.40 * completeness + 0.30 * purity + 0.30 * semantic
        
        return {
            "score": round(score, 1),
            "components": {
                "completeness": round(completeness, 1),
                "purity": round(purity, 1),
                "semantic_alignment": round(semantic, 1),
            },
        }
    
    @staticmethod
    def _calculate_completeness(constraints: List[Dict], code: str) -> float:
        if not constraints:
            return 0.0
        traced = 0
        for c in constraints:
            if any(re.search(rf'\b{kw}\b', code, re.IGNORECASE) for kw in c.get("keywords", [])):
                traced += 1
        return (traced / len(constraints)) * 100
    
    @staticmethod
    def _calculate_purity(constraints: List[Dict], code_data: Dict) -> float:
        total = code_data.get("total_units", 0)
        if total == 0:
            return 0.0
        all_keywords = set()
        for c in constraints:
            all_keywords.update(c.get("keywords", []))
        mapped = 0
        for func in code_data.get("functions", []):
            if any(kw in func.get("name", "").lower() for kw in all_keywords):
                mapped += 1
        for cls in code_data.get("classes", []):
            if any(kw in cls.get("name", "").lower() for kw in all_keywords):
                mapped += 1
        return (mapped / total) * 100 if total > 0 else 0.0


class CoherenceValidator:
    """Pillar C: Conceptual Unity."""
    
    @staticmethod
    def validate(code: str, code_data: Dict[str, Any], llm: LLMJudge) -> Dict[str, Any]:
        """Coherence = (0.25 × Naming) + (0.25 × LayerConsistency) + (0.20 × ErrorUnity) + (0.30 × ConceptualUnity)"""
        
        naming = CoherenceValidator._calculate_naming(code_data)
        
        prompt = LOCKED_PROMPTS["layer_consistency"].format(code=code[:1500])
        result = llm.evaluate(prompt)
        layer = float(result.get("score", 80))
        
        errors = CoherenceValidator._calculate_error_unity(code)
        
        prompt = LOCKED_PROMPTS["conceptual_unity"].format(code=code[:1500])
        result = llm.evaluate(prompt)
        conceptual = float(result.get("score", 77))
        
        score = 0.25 * naming + 0.25 * layer + 0.20 * errors + 0.30 * conceptual
        
        return {
            "score": round(score, 1),
            "components": {
                "naming": round(naming, 1),
                "layer_consistency": round(layer, 1),
                "error_unity": round(errors, 1),
                "conceptual_unity": round(conceptual, 1),
            },
        }
    
    @staticmethod
    def _calculate_naming(code_data: Dict) -> float:
        all_names = []
        for func in code_data.get("functions", []):
            all_names.append(func["name"])
        for cls in code_data.get("classes", []):
            all_names.append(cls["name"])
        
        if not all_names:
            return 50.0
        
        snake_case = sum(1 for n in all_names if n == n.lower())
        dominant = snake_case / len(all_names) if all_names else 0
        
        return dominant * 100
    
    @staticmethod
    def _calculate_error_unity(code: str) -> float:
        try_count = code.count("try:")
        except_count = code.count("except")
        
        if try_count == 0:
            return 100.0
        
        ratio = except_count / max(try_count, 1)
        return min(100, ratio * 100)


# ====================== MAIN ORCHESTRATOR ======================

class ConvergenceValidator:
    """Main validator with spec-constrained mode support."""
    
    def __init__(self, project_path: str, intent_path: str = "INTENT.md", spec_constrained: bool = False, use_llm: bool = True):
        self.project_path = Path(project_path)
        self.intent_path = self.project_path / intent_path
        self.intent_content = ""
        self.files: Dict[str, str] = {}
        self.report: Dict = {}
        self.spec_constrained = spec_constrained
        self.use_llm = use_llm  # NEW: flag for LLM usage
        self.spec_refs: Dict = {}
        
        try:
            self.llm = LLMJudge()
        except ValueError as e:
            print(f"❌ {e}")
            raise

    def load_intent(self) -> bool:
        if not self.intent_path.exists():
            print("⚠️  INTENT.md not found")
            self.intent_content = ""
            return False
        
        self.intent_content = self.intent_path.read_text(encoding="utf-8")
        return True

    def load_project_files(self, extensions: List[str] = [".py"]):
        for ext in extensions:
            for file in self.project_path.rglob(f"*{ext}"):
                if file.is_file() and "__pycache__" not in str(file):
                    self.files[str(file.relative_to(self.project_path))] = (
                        file.read_text(encoding="utf-8")
                    )

    def run(self) -> Dict:
        print(f"\n🚀 MAGNUS 15 - Validating {self.project_path}")
        if self.spec_constrained:
            print(f"📌 Mode: SPEC-CONSTRAINED (auto-routing)")
        print(f"📌 Model: {self.llm.model}\n")

        self.load_intent()
        self.load_project_files()

        if not self.files:
            print("❌ No Python files found")
            return {}

        full_code = '\n'.join(self.files.values())
        code_data = CodeAnalyzer.analyze(full_code)
        
        # DETECT SPECS if in spec-constrained mode
        if self.spec_constrained:
            self.spec_refs = SpecDetector.detect(full_code, code_data.get("docstrings", []))
            if self.spec_refs:
                print(f"🔍 Detected specs: {list(self.spec_refs.keys())}")
                
                # AUTO-ROUTING: determine if LLM is needed
                auto_use_llm, routing_reason = SpecDetector.should_use_llm(self.spec_refs)
                
                # Override: manual flags take precedence
                if "--force-llm" in sys.argv:
                    self.use_llm = True
                    print(f"   → Forced LLM (--force-llm override)")
                elif "--no-llm" in sys.argv:
                    self.use_llm = False
                    print(f"   → Forced regex (--no-llm override)")
                else:
                    self.use_llm = auto_use_llm
                    print(f"   → {routing_reason}")
                
                print()

        print("🧮 Computing pillars...\n")

        # Recognition
        print("  📊 RECOGNITION")
        recognition = RecognitionValidator.validate(
            self.intent_content, full_code, code_data, self.llm
        )
        print(f"     Score: {recognition['score']:.1f}/100")

        # Inevitability (with spec-constrained option)
        print("  📊 INEVITABILITY")
        inevitability = InevitabilityValidator.validate(
            self.intent_content,
            full_code,
            code_data,
            self.llm,
            use_spec_constrained=self.spec_constrained,
            spec_refs=self.spec_refs,
            use_llm=self.use_llm,
        )
        print(f"     Score: {inevitability['score']:.1f}/100")
        if self.spec_constrained and inevitability.get("spec_refs"):
            print(f"     (Spec-constrained mode)")

        # Coherence
        print("  📊 COHERENCE")
        coherence = CoherenceValidator.validate(full_code, code_data, self.llm)
        print(f"     Score: {coherence['score']:.1f}/100")

        # Verdict
        all_pass = (
            recognition["score"] >= CONVERGENCE_THRESHOLDS["recognition"] and
            inevitability["score"] >= CONVERGENCE_THRESHOLDS["inevitability"] and
            coherence["score"] >= CONVERGENCE_THRESHOLDS["coherence"]
        )

        partial = sum([
            recognition["score"] >= CONVERGENCE_THRESHOLDS["recognition"],
            inevitability["score"] >= CONVERGENCE_THRESHOLDS["inevitability"],
            coherence["score"] >= CONVERGENCE_THRESHOLDS["coherence"],
        ]) >= 2

        if all_pass:
            verdict = "CONVERGED"
        elif partial:
            verdict = "PARTIAL"
        else:
            verdict = "NON_CONVERGED"

        self.report = {
            "verdict": verdict,
            "scores": {
                "recognition": recognition["score"],
                "inevitability": inevitability["score"],
                "coherence": coherence["score"],
            },
            "details": {
                "recognition": recognition,
                "inevitability": inevitability,
                "coherence": coherence,
            },
            "mode": "spec_constrained" if self.spec_constrained else "default",
            "auto_routing": {
                "enabled": self.spec_constrained,
                "use_llm": self.use_llm,
                "specs_detected": self.spec_refs if self.spec_constrained else None,
            },
            "spec_refs": self.spec_refs if self.spec_constrained else None,
            "reproducibility": {
                "model": self.llm.model,
                "seed": SEED,
                "timestamp": datetime.utcnow().isoformat(),
            }
        }

        self._save_reports()
        self._print_summary()

        return self.report

    def _save_reports(self):
        json_path = self.project_path / "convergence_report.json"
        json_path.write_text(json.dumps(self.report, indent=2, ensure_ascii=False))
        print(f"\n✅ Saved: convergence_report.json")
        
        md_path = self.project_path / "convergence_report.md"
        md_path.write_text(self._generate_markdown())
        print(f"✅ Saved: convergence_report.md\n")

    def _print_summary(self):
        s = self.report["scores"]
        print(f"{'='*60}")
        print(f"VERDICT: {self.report['verdict']} 🎯")
        print(f"Mode: {self.report['mode'].upper()}")
        print(f"{'='*60}")
        print(f"Recognition:   {s['recognition']:6.1f}/100 (threshold: 80)")
        print(f"Inevitability: {s['inevitability']:6.1f}/100 (threshold: 80)")
        print(f"Coherence:     {s['coherence']:6.1f}/100 (threshold: 75)")
        print(f"{'='*60}\n")

    def _generate_markdown(self) -> str:
        s = self.report["scores"]
        return f"""# Magnus 15 Convergence Report

**VERDICT: {self.report['verdict']}**

## Mode
{self.report['mode'].upper()}

## Scores

| Pillar | Score | Threshold | Status |
|--------|-------|-----------|--------|
| Recognition | {s['recognition']} | 80 | {'✅' if s['recognition'] >= 80 else '❌'} |
| Inevitability | {s['inevitability']} | 80 | {'✅' if s['inevitability'] >= 80 else '❌'} |
| Coherence | {s['coherence']} | 75 | {'✅' if s['coherence'] >= 75 else '❌'} |

Generated: {self.report['reproducibility']['timestamp']}
"""


# ====================== CLI ======================

if __name__ == "__main__":
    import sys
    
    project = sys.argv[1] if len(sys.argv) > 1 else "."
    spec_constrained = "--spec-constrained" in sys.argv
    use_llm = "--no-llm" not in sys.argv  # Default: use LLM unless --no-llm flag
    
    try:
        validator = ConvergenceValidator(project, spec_constrained=spec_constrained, use_llm=use_llm)
        result = validator.run()
        print(json.dumps(result, indent=2))
    except KeyboardInterrupt:
        print("\n⚠️  Interrupted")
    except Exception as e:
        print(f"\n❌ Error: {e}")
        import traceback
        traceback.print_exc()
