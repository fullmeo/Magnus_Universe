# Magnus CLI - Convergence Validator Guide

**Magnus 13.2 Hermetic Edition - Non-Interactive CLI Wrapper**

A powerful command-line interface for validating code convergence without human intervention. Designed for integration with agent automation (e.g., Kilo) for autonomous code validation workflows.

## Quick Start

```bash
# Basic usage
node magnus-cli.js \
  --mode validate-convergence \
  --session-id my-session-001 \
  --code-path ./generated-code.js

# With feedback
node magnus-cli.js \
  --mode validate-convergence \
  --session-id my-session-002 \
  --code-path ./src/modules \
  --feedback "needs error handling" \
  --output ./reports/convergence.json

# Check exit code
node magnus-cli.js ... && echo "Converged!" || echo "Failed"
```

## Features

### Core Capabilities

- **Non-Interactive Mode**: Runs completely autonomously - perfect for agent automation
- **ORCHESTRATED Configuration**: Uses Magnus 13.2 Hermetic Edition's ORCHESTRATED mode
- **Multi-Phase Analysis**:
  1. Code Quality Analysis
  2. Semantic Alignment Analysis
  3. Historical Convergence Check
  4. Bloc Convergence Analysis (via Bloc Convergence Engine)
  5. Feedback Integration (optional)

- **Comprehensive Reporting**: Generates detailed JSON reports with actionable insights
- **Standard Exit Codes**: Integration-friendly exit codes for automation

### Supported Analysis

| Phase | Purpose | Output |
|-------|---------|--------|
| Code Quality | Measures code structure, documentation, error handling | quality_score (0-100) |
| Semantic Alignment | Analyzes identifiers, patterns, and language constructs | semantic_score (0-100) |
| Historical Convergence | Compares against previous validated solutions | path_count, converges_bool |
| Bloc Convergence | Uses structural analysis for robustness assessment | robustness_level, interpretation |
| Feedback Integration | Processes human feedback signals (positive/negative) | feedback_score (0-1) |

## Command Reference

### Arguments

#### Required Arguments

```
--mode validate-convergence
```
The operational mode. Currently supports: `validate-convergence`

```
--session-id <string>
```
Unique identifier for this validation session. Used for:
- Tracking convergence history
- Cross-referencing with agent workflows
- Audit trails

Example: `my-feature-001`, `kilo-task-2024-02-27-xyz`

```
--code-path <path>
```
Path to code file or directory to validate.

- **Single File**: Loads and analyzes one JavaScript file
- **Directory**: Recursively loads all `.js` files, concatenates with separators

Example: `./generated-code.js` or `./src/generated-modules/`

#### Optional Arguments

```
--feedback "<string>"
```
Optional feedback about the code.

Recognized keywords:
- **Positive**: good, excellent, perfect, great, awesome, correct, right, works, pass
- **Negative**: bad, poor, wrong, broken, fail, error, issue, problem, incorrect
- **Partial**: partial, incomplete, almost, needs, improve, refactor

Score mapping:
- Positive keywords → 0.9 feedback score
- Negative keywords → 0.1 feedback score
- Partial keywords → 0.5 feedback score
- Neutral → 0.6 feedback score

Example: `--feedback "needs error handling and better documentation"`

```
--output <path>
```
Path where convergence report JSON will be written.

Default: `./.magnus/convergence-report.json`

Example: `--output ./reports/latest-validation.json`

## Exit Codes

The CLI follows standard Unix exit code conventions:

| Code | Meaning | Interpretation |
|------|---------|-----------------|
| **0** | CONVERGED | ✅ Solution accepted - ready for use |
| **1** | PARTIAL | ⚠️ Solution partially converged - needs refinement |
| **2** | FAILED | ❌ Solution rejected - retry recommended |

### Usage in Scripts

```bash
#!/bin/bash

# Run validation
node magnus-cli.js \
  --mode validate-convergence \
  --session-id $SESSION_ID \
  --code-path $CODE_PATH

case $? in
  0)
    echo "✅ Validation passed - merging code"
    git commit -m "feat: Auto-validated solution"
    ;;
  1)
    echo "⚠️  Partial convergence - requesting refinement"
    echo "Feedback: $(cat feedback.txt)" | mail -s "Code needs refinement" team@example.com
    ;;
  2)
    echo "❌ Validation failed - rollback required"
    exit 1
    ;;
esac
```

## Output Report

The JSON report includes comprehensive analysis details:

```json
{
  "sessionId": "test-session-001",
  "timestamp": "2026-02-27T04:39:23.380Z",
  "mode": "ORCHESTRATED",
  "analysis": {
    "codeQuality": {
      "score": 85,
      "details": {
        "lines": 159,
        "hasErrorHandling": false,
        "hasComments": true,
        "hasTypes": true,
        "assessment": "GOOD"
      }
    },
    "semanticAlignment": {
      "score": 50,
      "details": {
        "identifierCount": 18,
        "patterns": ["async-await", "class-based"],
        "assessment": "PARTIAL"
      }
    },
    "historicalConvergence": {
      "pathCount": 0,
      "averageScore": 50,
      "converges": false,
      "reason": "No historical data available"
    },
    "blocConvergence": {
      "available": true,
      "isRobust": false,
      "pathCount": 0,
      "averageScore": 0,
      "interpretation": {
        "level": "SINGULAR",
        "meaning": "Code converge avec intention courante uniquement",
        "implication": "Solution peut être trop spécifique",
        "confidence": "À valider"
      },
      "score": 50
    },
    "feedback": {
      "text": "perfect solution",
      "score": 0.9
    }
  },
  "finalScore": 63,
  "result": "FAILED",
  "recommendations": [
    "✗ Solution did not converge",
    "→ Refine and retry validation",
    "→ Current score: 63%, target: 70%+"
  ]
}
```

### Report Fields

#### Top Level
- **sessionId**: Session identifier from arguments
- **timestamp**: ISO8601 timestamp of validation
- **mode**: ORCHESTRATED (Magnus 13.2 Hermetic configuration)
- **analysis**: Detailed breakdown of all analysis phases
- **finalScore**: Weighted average (0-100)
- **result**: CONVERGED | PARTIAL | FAILED
- **recommendations**: Actionable guidance array

#### Analysis.codeQuality
- **score**: 0-100, weighted by:
  - Code size (prefer 10-500 lines): 20%
  - Error handling presence: 15%
  - Documentation: 10%
  - Type information: 5%
  - Base: 50%

#### Analysis.semanticAlignment
- **score**: 0-100 based on:
  - Identifier count (max 10): 50%
  - Detected patterns: 50%

**Patterns detected:**
- `async-await`: async/await constructs
- `promises`: Promise API usage
- `class-based`: Class definitions
- `functional`: Arrow functions
- `error-handling`: Try/catch blocks

#### Analysis.historicalConvergence
- **pathCount**: Number of historical solutions matching current code
- **averageScore**: Mean convergence score of matches
- **converges**: Boolean - pathCount >= convergenceThreshold (default: 2)

#### Analysis.blocConvergence
Uses Magnus 13.2's Bloc Convergence Engine for structural robustness:
- **available**: Whether engine loaded successfully
- **isRobust**: Multiple convergence paths detected
- **pathCount**: Number of convergent paths
- **score**: 90 if robust, 70 if partial, 50 if singular
- **interpretation**: Detailed robustness assessment

#### Analysis.feedback
- **text**: The feedback string provided
- **score**: Parsed feedback as 0-1 value

## Scoring System

The **final convergence score** (0-100) uses weighted components:

```
finalScore = (
  codeQuality.score       × 0.25  +
  semantic.score          × 0.25  +
  historical.score        × 0.25  +
  blocConvergence.score   × 0.15  +
  feedback.score * 100    × 0.10
)
```

### Decision Logic

```
IF score >= 85 AND historicalConvergence.pathCount >= 2:
  result = "CONVERGED"        (exit 0)
ELSE IF score >= 70:
  result = "PARTIAL"          (exit 1)
ELSE:
  result = "FAILED"           (exit 2)
```

## Agent Integration Guide

### Kilo Integration Example

```javascript
// Using Magnus CLI from Kilo agent
const { execSync } = require('child_process');

async function validateWithMagnus(sessionId, codePath, feedback) {
  try {
    const cmd = `node magnus-cli.js \
      --mode validate-convergence \
      --session-id ${sessionId} \
      --code-path ${codePath} \
      --feedback "${feedback}" \
      --output ./.magnus/kilo-report.json`;

    execSync(cmd, {
      stdio: 'inherit',
      cwd: './magnus-workspace'
    });

    return { status: 'converged' };
  } catch (error) {
    if (error.status === 1) {
      return { status: 'partial', action: 'refine' };
    } else {
      return { status: 'failed', action: 'retry' };
    }
  }
}
```

### Claude Code Integration

```bash
# In a Claude Code task
node magnus-cli.js \
  --mode validate-convergence \
  --session-id $CLAUDE_SESSION_ID \
  --code-path $GENERATED_CODE_PATH \
  --feedback "Reviewed by Claude Code" \
  && echo "✅ Code approved" \
  || echo "⚠️ Code needs refinement"
```

## Configuration Files

Magnus CLI automatically creates and uses:

### Storage Directory
```
./.magnus/
├── convergence-report.json        # Latest report
├── convergence-reports/           # Historical reports
├── historical-convergence.json    # Convergence history
└── sessions/                      # Session data
```

To customize:
- Create `.magnus.config.json` in project root
- Or pass environment variable: `MAGNUS_STORAGE_DIR=/custom/path`

## Troubleshooting

### "Code path not found"
- Verify path exists and has correct permissions
- Use absolute paths for reliability
- For directories, ensure at least one `.js` file exists

### "Failed to load code"
- Check file is valid JavaScript (syntax valid)
- Verify no binary files mixed in directory
- Ensure sufficient disk space for large codebases

### "Exit code 2 (FAILED) unexpectedly"
- Check convergence report for details
- Review recommendations in report
- Ensure code quality meets standards (error handling, documentation)
- Increase feedback positivity or provide more specific feedback

### Reports not being written
- Verify `./.magnus/` directory is writable
- Check disk space
- Review `.magnus/convergence-reports/` for permissions

### "Bloc Convergence Engine not found"
- Verify `bloc_convergence_extracted/magnus-13-2-bloc-convergence.js` exists
- This is optional - validation continues without it
- Check console warnings for details

## Advanced Usage

### Batch Validation

```bash
#!/bin/bash
# Validate multiple code solutions

for code_file in generated-solutions/*.js; do
  session_id="session-$(date +%s)"

  node magnus-cli.js \
    --mode validate-convergence \
    --session-id "$session_id" \
    --code-path "$code_file" \
    --output "./reports/${session_id}.json"

  if [ $? -eq 0 ]; then
    cp "$code_file" "./approved/"
  fi
done
```

### Continuous Integration

```yaml
# GitHub Actions example
- name: Validate Generated Code
  run: |
    node magnus-cli.js \
      --mode validate-convergence \
      --session-id "github-run-${{ github.run_id }}" \
      --code-path ./src/generated \
      --output ./artifacts/convergence-report.json
  continue-on-error: true

- name: Upload Report
  uses: actions/upload-artifact@v3
  with:
    name: convergence-reports
    path: artifacts/
```

### Feedback Loop

```bash
# Interactive validation with feedback loop

while true; do
  # Run validation
  node magnus-cli.js \
    --mode validate-convergence \
    --session-id "interactive-session" \
    --code-path "./solution.js" \
    --output ./current-report.json

  exit_code=$?

  if [ $exit_code -eq 0 ]; then
    echo "✅ Solution converged!"
    break
  fi

  # Get feedback and retry
  read -p "Enter feedback for next iteration: " feedback
  # ... apply refinements to code ...
done
```

## Performance Characteristics

- **Code Loading**: ~50ms per file
- **Quality Analysis**: ~100ms
- **Semantic Analysis**: ~200ms
- **Convergence Checks**: ~300ms (varies with history size)
- **Report Writing**: ~50ms

**Total typical runtime**: 500-700ms for single file

## Security Considerations

Magnus CLI runs in **non-interactive mode** suitable for automation:

- ✅ No user input prompts
- ✅ Reads code as data (no execution)
- ✅ No network access (local-only)
- ✅ Reports written to `.magnus/` directory
- ✅ No credential handling

**Best Practices:**
- Run in sandboxed environment for untrusted code
- Validate `--code-path` argument in wrapper scripts
- Review generated reports before integration
- Maintain audit logs of all validations

## API Reference

### Magnus132Hermetic Class

```javascript
import Magnus132Hermetic from './magnus-cli.js';

const magnus = new Magnus132Hermetic({
  mode: 'ORCHESTRATED',
  storageDir: './.magnus',
  convergenceThreshold: 2,
  minClarityScore: 70,
  maxComplexityScore: 8
});

const result = await magnus.validateConvergence(
  sessionId,
  generatedCode,
  feedback
);

// result.finalScore: 0-100
// result.result: 'CONVERGED' | 'PARTIAL' | 'FAILED'
// result.recommendations: string[]
```

## Version History

### v1.0.0 (Current)
- Initial release
- ORCHESTRATED mode support
- Bloc Convergence Engine integration
- Multi-phase analysis
- JSON reporting

## Contributing

To extend Magnus CLI:

1. Add new analysis phases to `Magnus132Hermetic`
2. Update weighting in `calculateFinalConvergenceScore()`
3. Extend `determineConvergenceResult()` logic
4. Update documentation with new capabilities

## License

MIT - Part of Magnus 13.2 Hermetic Edition

## Support

For issues or questions:
- Review this documentation
- Check `.magnus/convergence-report.json` for detailed error info
- Examine console output for phase-specific diagnostics
