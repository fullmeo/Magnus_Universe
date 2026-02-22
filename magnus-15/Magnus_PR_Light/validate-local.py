#!/usr/bin/env python3
"""
MAGNUS 15 - LOCAL VALIDATION SCRIPT
Validates the implementation without external dependencies
"""

import json
import os
from pathlib import Path
from datetime import datetime

# ============================================================================
# VALIDATION CONFIGURATION
# ============================================================================

VALIDATION_CONFIG = {
    "required_files": [
        "Magnus_PR_Light/src/gateway/router/optimization/quality-pattern-detector.ts",
        "Magnus_PR_Light/src/gateway/router/optimization/routing-optimizer.ts",
        "Magnus_PR_Light/src/gateway/router/optimization/quality-review-cycle.ts",
        "Magnus_PR_Light/src/gateway/router/optimization/index.ts",
        "Magnus_PR_Light/config/routing-config.yaml",
        "Magnus_PR_Light/README.md",
        "Magnus_PR_Light/PR-TEMPLATE.md",
    ],
    "required_patterns": [
        "CYCLE_DETECTION",
        "VALIDATION_GAP",
        "ARCHITECTURE_DRIFT",
        "COUPLING_COMPLEXITY",
        "BUSINESS_LOGIC_PRIORITY",
        "LEARNING_MOMENTUM",
        "SELF_OPTIMIZATION",
        "ITERATIVE_IMPROVEMENT",
        "QUALITY_HARMONY",
        "CONFIDENCE_BUILDING",
    ],
    "thresholds": {
        "recognition": 80,
        "inevitability": 80,
        "coherence": 75,
    },
}

# ============================================================================
# VALIDATION FUNCTIONS
# ============================================================================

def check_file_exists(filepath: str) -> dict:
    """Check if a required file exists."""
    exists = os.path.exists(filepath)
    return {
        "file": filepath,
        "exists": exists,
        "status": "✓" if exists else "✗",
    }

def check_pattern_in_files(pattern: str, filepath: str) -> dict:
    """Check if a pattern is defined in a file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            found = pattern in content
            return {
                "pattern": pattern,
                "file": filepath,
                "found": found,
                "status": "✓" if found else "✗",
            }
    except Exception as e:
        return {
            "pattern": pattern,
            "file": filepath,
            "found": False,
            "status": f"ERROR: {e}",
        }

def validate_yaml_config(filepath: str) -> dict:
    """Validate YAML configuration file."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for required sections
        checks = {
            "quality_weights": "quality_weights" in content,
            "cost_weights": "cost_weights" in content,
            "latency_weights": "latency_weights" in content,
            "pattern_thresholds": "patterns:" in content or "thresholds" in content.lower(),
        }
        
        all_pass = all(checks.values())
        
        return {
            "file": filepath,
            "valid": all_pass,
            "checks": checks,
            "status": "✓" if all_pass else "✗",
        }
    except Exception as e:
        return {
            "file": filepath,
            "valid": False,
            "error": str(e),
            "status": f"ERROR: {e}",
        }

def validate_pr_template(filepath: str) -> dict:
    """Validate PR template has required sections."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Check for required sections
        checks = {
            "summary": "## Summary" in content or "# Summary" in content,
            "problem": "## Problem" in content or "# Problem" in content,
            "solution": "## Solution" in content or "# Solution" in content,
            "metrics": "## Metrics" in content or "## Results" in content or "# Results" in content,
            "testing": "## Testing" in content or "# Testing" in content,
        }
        
        all_pass = all(checks.values())
        
        return {
            "file": filepath,
            "valid": all_pass,
            "checks": checks,
            "status": "✓" if all_pass else "✗",
        }
    except Exception as e:
        return {
            "file": filepath,
            "valid": False,
            "error": str(e),
            "status": f"ERROR: {e}",
        }

def run_validation() -> dict:
    """Run complete validation suite."""
    
    results = {
        "timestamp": datetime.now().isoformat(),
        "files": {
            "checked": 0,
            "passed": 0,
            "failed": 0,
            "details": [],
        },
        "patterns": {
            "total": len(VALIDATION_CONFIG["required_patterns"]),
            "found": 0,
            "missing": [],
            "details": [],
        },
        "config": {
            "valid": False,
            "details": {},
        },
        "template": {
            "valid": False,
            "details": {},
        },
        "summary": {
            "overall_status": "PENDING",
            "ready_for_submission": False,
        },
    }
    
    print("\n" + "="*60)
    print("MAGNUS 15 - LOCAL VALIDATION")
    print("="*60 + "\n")
    
    # 1. Check required files
    print("📁 Checking Required Files...")
    print("-"*40)
    
    for filepath in VALIDATION_CONFIG["required_files"]:
        check = check_file_exists(filepath)
        results["files"]["details"].append(check)
        results["files"]["checked"] += 1
        if check["exists"]:
            results["files"]["passed"] += 1
            print(f"  {check['status']} {check['file']}")
        else:
            results["files"]["failed"] += 1
            print(f"  {check['status']} {check['file']}")
    
    print("")
    
    # 2. Check patterns
    print("🔍 Checking Pattern Definitions...")
    print("-"*40)
    
    main_patterns_file = "Magnus_PR_Light/src/gateway/router/optimization/quality-pattern-detector.ts"
    
    for pattern in VALIDATION_CONFIG["required_patterns"]:
        check = check_pattern_in_files(pattern, main_patterns_file)
        results["patterns"]["details"].append(check)
        if check["found"]:
            results["patterns"]["found"] += 1
            print(f"  ✓ {pattern}")
        else:
            results["patterns"]["missing"].append(pattern)
            print(f"  ✗ {pattern}")
    
    print("")
    
    # 3. Validate configuration
    print("⚙️ Validating Configuration...")
    print("-"*40)
    
    config_file = "Magnus_PR_Light/config/routing-config.yaml"
    if os.path.exists(config_file):
        config_check = validate_yaml_config(config_file)
        results["config"]["valid"] = config_check["valid"]
        results["config"]["details"] = config_check
        print(f"  Status: {config_check['status']}")
        for key, value in config_check.get("checks", {}).items():
            print(f"    {'✓' if value else '✗'} {key}")
    else:
        print(f"  ✗ Configuration file not found: {config_file}")
    
    print("")
    
    # 4. Validate PR template
    print("📝 Validating PR Template...")
    print("-"*40)
    
    template_file = "Magnus_PR_Light/PR-TEMPLATE.md"
    if os.path.exists(template_file):
        template_check = validate_pr_template(template_file)
        results["template"]["valid"] = template_check["valid"]
        results["template"]["details"] = template_check
        print(f"  Status: {template_check['status']}")
        for key, value in template_check.get("checks", {}).items():
            print(f"    {'✓' if value else '✗'} {key}")
    else:
        print(f"  ✗ Template file not found: {template_file}")
    
    print("")
    
    # 5. Calculate summary
    files_ok = results["files"]["failed"] == 0
    patterns_ok = results["patterns"]["missing"] == []
    config_ok = results["config"]["valid"]
    template_ok = results["template"]["valid"]
    
    results["summary"]["ready_for_submission"] = all([
        files_ok,
        patterns_ok,
        config_ok,
        template_ok,
    ])
    
    if results["summary"]["ready_for_submission"]:
        results["summary"]["overall_status"] = "✅ READY"
        print("="*60)
        print("✅ VALIDATION PASSED - READY FOR SUBMISSION")
        print("="*60)
    else:
        results["summary"]["overall_status"] = "❌ ISSUES FOUND"
        print("="*60)
        print("❌ VALIDATION FAILED - FIX ISSUES BEFORE SUBMISSION")
        print("="*60)
    
    # 6. Print summary
    print("\n📊 VALIDATION SUMMARY")
    print("-"*40)
    print(f"  Files: {results['files']['passed']}/{results['files']['checked']} passed")
    print(f"  Patterns: {results['patterns']['found']}/{results['patterns']['total']} found")
    print(f"  Config: {'✓' if config_ok else '✗'}")
    print(f"  Template: {'✓' if template_ok else '✗'}")
    print(f"  Overall: {results['summary']['overall_status']}")
    
    print("\n" + "="*60)
    print(f"Timestamp: {results['timestamp']}")
    print("="*60 + "\n")
    
    return results

def save_results(results: dict):
    """Save validation results to JSON file."""
    output_file = "validation-results.json"
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(results, f, indent=2, default=str)
    print(f"\n📄 Results saved to: {output_file}")

# ============================================================================
# MAIN
# ============================================================================

if __name__ == "__main__":
    results = run_validation()
    save_results(results)
    
    # Exit with appropriate code
    if results["summary"]["ready_for_submission"]:
        exit(0)
    else:
        exit(1)
