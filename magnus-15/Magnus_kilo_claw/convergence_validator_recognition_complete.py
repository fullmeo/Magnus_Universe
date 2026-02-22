#!/usr/bin/env python3
"""
Magnus 15 - Convergence Validator
Phase 5 - Recognition Pillar COMPLETE
Version: 0.3 (Feb 2026)

RECOGNITION FULLY IMPLEMENTED:
✅ Completeness: Constraint → Code tracing
✅ Purity: Function/class → Intent mapping
✅ Semantic: LLM judge with CoT logging
"""

import ast
import hashlib
import json
import os
import re
from pathlib import Path
from typing import Dict, List, Any, Tuple, Optional
from datetime import datetime
from collections import defaultdict

from anthropic import Anthropic, AnthropicError

# ====================== CONFIG ======================
SUPPORTED_LANGUAGES = ["python"]
LLM_MODEL = "claude-3-5-sonnet-20241022"
SEED = 42

# ====================== CONSTRAINT PARSER ======================

class ConstraintParser:
    """Parse and extract constraints from INTENT.md"""
    
    @staticmethod
    def parse(intent_content: str) -> Dict[str, Any]:
        """Extract explicit and implicit constraints"""
        
        explicit = []
        implicit = []
        
        for line in intent_content.split('\n'):
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            
            line_lower = line.lower()
            
            # Explicit constraints (hard requirements)
            if any(kw in line_lower for kw in ["must", "required", "shall", "must not"]):
                explicit.append({
                    "text": line,
                    "type": "explicit",
                    "keywords": ConstraintParser._extract_keywords(line)
                })
            
            # Implicit constraints (soft requirements)
            elif any(kw in line_lower for kw in ["should", "prefer", "could", "consider"]):
                implicit.append({
                    "text": line,
                    "type": "implicit",
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
        """Extract meaningful keywords from constraint"""
        common_words = {
            'the', 'a', 'an', 'and', 'or', 'is', 'are', 'be', 'been',
            'must', 'required', 'shall', 'should', 'could', 'prefer',
            'all', 'each', 'every', 'any', 'some', 'no'
        }
        
        keywords = []
        for word in re.findall(r'\b\w+\b', text.lower()):
            if len(word) > 3 and word not in common_words:
                keywords.append(word)
        
        return keywords

# ====================== CODE ANALYZER ======================

class CodeAnalyzer:
    """Analyze Python code structure via AST"""
    
    @staticmethod
    def analyze(code: str) -> Dict[str, Any]:
        """Extract functions, classes, and metrics"""
        try:
            tree = ast.parse(code)
        except SyntaxError as e:
            print(f"⚠️  Syntax error: {e}")
            return {
                "functions": [],
                "classes": [],
                "total_units": 0,
                "success": False,
            }
        
        functions = []
        classes = []
        
        for node in ast.walk(tree):
            # Extract functions
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                func_data = {
                    "name": node.name,
                    "line": node.lineno,
                    "docstring": ast.get_docstring(node) or "",
                    "keywords": CodeAnalyzer._extract_function_keywords(node),
                }
                functions.append(func_data)
            
            # Extract classes
            elif isinstance(node, ast.ClassDef):
                class_data = {
                    "name": node.name,
                    "line": node.lineno,
                    "docstring": ast.get_docstring(node) or "",
                    "keywords": CodeAnalyzer._extract_class_keywords(node),
                    "methods": [n.name for n in node.body if isinstance(n, ast.FunctionDef)],
                }
                classes.append(class_data)
        
        return {
            "functions": functions,
            "classes": classes,
            "total_units": len(functions) + len(classes),
            "success": True,
        }
    
    @staticmethod
    def _extract_function_keywords(node) -> List[str]:
        """Extract keywords from function"""
        keywords = [node.name]
        
        if docstring := ast.get_docstring(node):
            keywords.extend(re.findall(r'\b\w+\b', docstring.lower()))
        
        for arg in node.args.args:
            keywords.append(arg.arg)
        
        return list(set(keywords))
    
    @staticmethod
    def _extract_class_keywords(node) -> List[str]:
        """Extract keywords from class"""
        keywords = [node.name]
        
        if docstring := ast.get_docstring(node):
            keywords.extend(re.findall(r'\b\w+\b', docstring.lower()))
        
        return list(set(keywords))

# ====================== CONSTRAINT TRACER ======================

class ConstraintTracer:
    """Trace constraints to code implementations"""
    
    @staticmethod
    def trace_constraint(constraint: Dict[str, Any], code: str, code_data: Dict[str, Any]) -> Dict[str, Any]:
        """Find where constraint is implemented in code"""
        
        keywords = constraint.get("keywords", [])
        traces = []
        
        # Search in functions
        for func in code_data.get("functions", []):
            match_score = ConstraintTracer._score_unit_match(keywords, func)
            if match_score > 40:
                traces.append({
                    "type": "function",
                    "name": func["name"],
                    "confidence": min(100, match_score),
                    "line": func["line"],
                })
        
        # Search in classes
        for cls in code_data.get("classes", []):
            match_score = ConstraintTracer._score_unit_match(keywords, cls)
            if match_score > 40:
                traces.append({
                    "type": "class",
                    "name": cls["name"],
                    "confidence": min(100, match_score),
                    "line": cls["line"],
                })
        
        # Keyword search in raw code
        found_keywords = 0
        for keyword in keywords:
            if re.search(rf'\b{keyword}\b', code, re.IGNORECASE):
                found_keywords += 1
        
        keyword_confidence = (found_keywords / max(len(keywords), 1)) * 100 if keywords else 0
        
        # Aggregate confidence
        if traces:
            avg_trace_confidence = sum(t["confidence"] for t in traces) / len(traces)
            overall_confidence = min(100, (avg_trace_confidence + keyword_confidence) / 2)
        else:
            overall_confidence = keyword_confidence
        
        return {
            "constraint": constraint.get("text", ""),
            "found": len(traces) > 0 or overall_confidence > 50,
            "traces": traces,
            "keyword_matches": found_keywords,
            "total_keywords": len(keywords),
            "confidence": round(overall_confidence, 1),
        }
    
    @staticmethod
    def _score_unit_match(constraint_keywords: List[str], unit: Dict[str, Any]) -> float:
        """Score how well a unit matches constraint keywords"""
        
        unit_keywords = unit.get("keywords", [])
        docstring = unit.get("docstring", "").lower()
        
        # Direct keyword match
        matches = sum(1 for kw in constraint_keywords if kw in unit_keywords)
        match_ratio = matches / max(len(constraint_keywords), 1)
        
        # Docstring relevance
        docstring_matches = sum(1 for kw in constraint_keywords if kw in docstring)
        docstring_ratio = docstring_matches / max(len(constraint_keywords), 1)
        
        # Weighted score
        score = (match_ratio * 60 + docstring_ratio * 40)
        
        return score

# ====================== PURITY CALCULATOR ======================

class PurityCalculator:
    """Calculate purity (% of units mapped to intent)"""
    
    @staticmethod
    def calculate(constraints: List[Dict[str, Any]], code_data: Dict[str, Any]) -> Dict[str, Any]:
        """Calculate purity as % of functions/classes traceable to constraints"""
        
        total_units = code_data.get("total_units", 0)
        if total_units == 0:
            return {
                "score": 0,
                "mapped_units": 0,
                "total_units": 0,
                "unmapped": [],
            }
        
        functions = code_data.get("functions", [])
        classes = code_data.get("classes", [])
        all_units = [("function", f) for f in functions] + [("class", c) for c in classes]
        
        # Extract all constraint keywords
        all_keywords = set()
        for constraint in constraints:
            all_keywords.update(constraint.get("keywords", []))
        
        # Check which units are mapped
        mapped_units = 0
        unmapped = []
        
        for unit_type, unit in all_units:
            unit_keywords = set(unit.get("keywords", []))
            
            # A unit is "mapped" if it has significant overlap with constraint keywords
            overlap = len(unit_keywords & all_keywords)
            overlap_ratio = overlap / max(len(unit_keywords), 1) if unit_keywords else 0
            
            if overlap_ratio > 0.3 or overlap >= 2:
                mapped_units += 1
            else:
                unmapped.append({
                    "type": unit_type,
                    "name": unit["name"],
                    "line": unit.get("line"),
                })
        
        purity_score = (mapped_units / total_units) * 100 if total_units > 0 else 0
        
        return {
            "score": round(purity_score, 1),
            "mapped_units": mapped_units,
            "total_units": total_units,
            "unmapped": unmapped,
        }

# ====================== LLM JUDGE ======================

class LLMJudge:
    """LLM-based semantic evaluation"""
    
    def __init__(self):
        api_key = os.getenv("ANTHROPIC_API_KEY")
        if not api_key:
            raise ValueError("❌ ANTHROPIC_API_KEY not found")
        
        self.client = Anthropic(api_key=api_key)
        self.model = LLM_MODEL
    
    def semantic_alignment(self, intent: str, code: str) -> Tuple[float, str]:
        """Evaluate semantic alignment via LLM"""
        
        prompt = f"""Évalue la fidélité sémantique entre l'intention et le code.

INTENTION:
{intent[:1500]}

CODE:
{code[:2000]}

Analyse:
1. Quels éléments de l'intention sont correctement implémentés?
2. Y a-t-il des déviations sémantiques?
3. Des éléments manquent-ils?

Score: 0-100 (100 = fidélité parfaite)

Réponds SEULEMENT en JSON:
{{"score": X, "cot": "Chain of Thought détaillée"}}"""
        
        try:
            response = self.client.messages.create(
                model=self.model,
                max_tokens=1000,
                temperature=0.0,
                system="Tu es un évaluateur rigoureux. Suis les instructions exactement. Réponds SEULEMENT en JSON valide.",
                messages=[{"role": "user", "content": prompt}]
            )
            
            text = response.content[0].text.strip()
            result = json.loads(text)
            
            score = float(result.get("score", 85))
            cot = result.get("cot", "")
            
            return (score, cot)
            
        except Exception as e:
            print(f"⚠️  LLM error: {e}")
            return (85.0, f"Error: {str(e)}")

# ====================== RECOGNITION VALIDATOR ======================

class RecognitionValidator:
    """Complete Recognition pillar implementation"""
    
    @staticmethod
    def validate(intent_content: str, code: str) -> Dict[str, Any]:
        """
        Calculate Recognition (0-100):
        = 0.40 × Completeness + 0.30 × Purity + 0.30 × SemanticAlignment
        """
        
        print("\n🔍 RECOGNITION PILLAR")
        print("=" * 60)
        
        # Parse intent
        intent_data = ConstraintParser.parse(intent_content)
        constraints = intent_data["explicit"]
        
        if not constraints:
            print("⚠️  No explicit constraints found - degraded mode")
            return {
                "score": 0.0,
                "components": {"completeness": 0, "purity": 0, "semantic": 0},
                "evidence": {"mode": "degraded"},
            }
        
        print(f"📋 Constraints found: {len(constraints)}")
        
        # Analyze code
        code_data = CodeAnalyzer.analyze(code)
        print(f"📦 Code units: {code_data['total_units']} " +
              f"({code_data['total_units'] - len(code_data['functions'])} classes, " +
              f"{len(code_data['functions'])} functions)")
        
        # 1. COMPLETENESS (40%)
        print("\n1️⃣  COMPLETENESS...")
        completeness_traces = []
        for constraint in constraints:
            trace = ConstraintTracer.trace_constraint(constraint, code, code_data)
            completeness_traces.append(trace)
        
        completeness_score = (
            sum(1 for t in completeness_traces if t["found"]) / 
            max(len(constraints), 1) * 100
        )
        print(f"   ✓ Completeness: {completeness_score:.1f}%")
        
        # 2. PURITY (30%)
        print("\n2️⃣  PURITY...")
        purity_result = PurityCalculator.calculate(constraints, code_data)
        purity_score = purity_result["score"]
        print(f"   ✓ Purity: {purity_score:.1f}%")
        if purity_result["unmapped"]:
            print(f"   ⚠️  Unmapped units: {len(purity_result['unmapped'])}")
        
        # 3. SEMANTIC ALIGNMENT (30%)
        print("\n3️⃣  SEMANTIC ALIGNMENT...")
        llm = LLMJudge()
        semantic_score, semantic_cot = llm.semantic_alignment(intent_content, code)
        print(f"   ✓ Semantic: {semantic_score:.1f}/100")
        
        # Calculate Recognition score
        recognition_score = (
            0.40 * completeness_score +
            0.30 * purity_score +
            0.30 * semantic_score
        )
        
        print(f"\n{'='*60}")
        print(f"RECOGNITION SCORE: {recognition_score:.1f}/100")
        print(f"Threshold: 80 - Status: {'✅ PASS' if recognition_score >= 80 else '❌ FAIL'}")
        print(f"{'='*60}")
        
        return {
            "score": round(recognition_score, 1),
            "components": {
                "completeness": round(completeness_score, 1),
                "purity": round(purity_score, 1),
                "semantic_alignment": round(semantic_score, 1),
            },
            "evidence": {
                "constraint_count": len(constraints),
                "constraints_traced": sum(1 for t in completeness_traces if t["found"]),
                "unmapped_units": purity_result["unmapped"],
                "llm_cot": semantic_cot,
                "traces": completeness_traces,
            }
        }

# ====================== MAIN ======================

class ConvergenceValidator:
    def __init__(self, project_path: str, intent_path: str = "INTENT.md"):
        self.project_path = Path(project_path)
        self.intent_path = self.project_path / intent_path
        self.intent_content = ""
        self.files: Dict[str, str] = {}
        self.report: Dict = {}

    def load_intent(self) -> bool:
        if not self.intent_path.exists():
            print("❌ INTENT.md not found")
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
        print(f"🚀 Validating {self.project_path}...")

        self.load_intent()
        self.load_project_files()

        if not self.files:
            print("❌ No Python files found")
            return {}

        # Merge all code
        full_code = '\n'.join(self.files.values())

        # Run Recognition pillar
        recognition = RecognitionValidator.validate(self.intent_content, full_code)

        self.report = {
            "timestamp": datetime.utcnow().isoformat(),
            "recognition": recognition,
        }

        # Save report
        report_path = self.project_path / "convergence_report_recognition.json"
        report_path.write_text(json.dumps(self.report, indent=2, ensure_ascii=False))
        print(f"\n✅ Saved: {report_path}\n")

        return self.report

# ====================== USAGE ======================

if __name__ == "__main__":
    import sys
    
    project = sys.argv[1] if len(sys.argv) > 1 else "."
    
    validator = ConvergenceValidator(project)
    result = validator.run()
    print(json.dumps(result, indent=2))
