/**
 * Magnus CLI Demo - Convergence Validation Examples
 *
 * This file demonstrates various ways to use magnus-cli.js
 * for code convergence validation.
 */

// ============================================================================
// EXAMPLE 1: Validate Generated Code
// ============================================================================

/**
 * Usage:
 * node magnus-cli.js \
 *   --mode validate-convergence \
 *   --session-id "demo-1" \
 *   --code-path "./examples/sample-solution.js" \
 *   --feedback "looks good"
 */

// ============================================================================
// EXAMPLE 2: Batch Validation Script
// ============================================================================

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

async function validateMultipleSolutions(solutionDir) {
  const solutions = fs.readdirSync(solutionDir).filter(f => f.endsWith('.js'));
  const results = [];

  for (const solution of solutions) {
    const sessionId = `batch-${Date.now()}-${solution}`;
    const solutionPath = path.join(solutionDir, solution);

    try {
      console.log(`\n📝 Validating: ${solution}`);

      execSync(
        `node magnus-cli.js \\
          --mode validate-convergence \\
          --session-id "${sessionId}" \\
          --code-path "${solutionPath}" \\
          --output "./reports/${sessionId}.json"`,
        { stdio: 'inherit' }
      );

      results.push({
        file: solution,
        status: 'CONVERGED',
        exitCode: 0
      });
    } catch (error) {
      if (error.status === 1) {
        results.push({
          file: solution,
          status: 'PARTIAL',
          exitCode: 1
        });
      } else {
        results.push({
          file: solution,
          status: 'FAILED',
          exitCode: 2
        });
      }
    }
  }

  return results;
}

// ============================================================================
// EXAMPLE 3: CI/CD Integration
// ============================================================================

/**
 * GitHub Actions workflow example:
 *
 * - name: Validate Generated Code
 *   run: |
 *     node magnus-cli.js \\
 *       --mode validate-convergence \\
 *       --session-id "gh-run-${{ github.run_id }}" \\
 *       --code-path ./src/generated \\
 *       --output ./artifacts/convergence-report.json
 *
 * - name: Check Results
 *   run: |
 *     cat ./artifacts/convergence-report.json
 *     exit_code=$?
 *     if [ $exit_code -ne 0 ]; then
 *       echo "❌ Code validation failed"
 *       exit 1
 *     fi
 */

// ============================================================================
// EXAMPLE 4: Agent Automation
// ============================================================================

/**
 * Usage from Kilo or other AI agents:
 */

class MagnusValidationAgent {
  constructor() {
    this.validationHistory = [];
  }

  /**
   * Validate generated code and get feedback
   */
  async validateAndFeedback(generatedCode, sessionId) {
    // Write code to temporary file
    const tempFile = `/tmp/solution-${sessionId}.js`;
    fs.writeFileSync(tempFile, generatedCode);

    try {
      // Run Magnus validation
      execSync(
        `node magnus-cli.js \\
          --mode validate-convergence \\
          --session-id "${sessionId}" \\
          --code-path "${tempFile}"`,
        { stdio: 'pipe' }
      );

      // Exit code 0: CONVERGED
      return {
        status: 'CONVERGED',
        action: 'ACCEPT',
        nextStep: 'integration'
      };
    } catch (error) {
      if (error.status === 1) {
        // Exit code 1: PARTIAL
        return {
          status: 'PARTIAL',
          action: 'REFINE',
          nextStep: 'request-refinement',
          feedback: 'Code needs error handling and better documentation'
        };
      } else {
        // Exit code 2: FAILED
        return {
          status: 'FAILED',
          action: 'RETRY',
          nextStep: 'regenerate',
          feedback: 'Solution did not converge - regenerating'
        };
      }
    } finally {
      // Cleanup
      try {
        fs.unlinkSync(tempFile);
      } catch (e) {
        // Ignore cleanup errors
      }
    }
  }

  /**
   * Iterative refinement loop
   */
  async refineUntilConvergence(codeGenerator, maxIterations = 5) {
    let code = codeGenerator.generate();
    let iteration = 0;

    while (iteration < maxIterations) {
      const sessionId = `refinement-${Date.now()}-${iteration}`;
      const result = await this.validateAndFeedback(code, sessionId);

      this.validationHistory.push({
        iteration,
        sessionId,
        result
      });

      console.log(`Iteration ${iteration}: ${result.status}`);

      if (result.status === 'CONVERGED') {
        console.log('✅ Code converged!');
        return { code, iterations: iteration, converged: true };
      }

      if (result.nextStep === 'request-refinement') {
        console.log(`⚠️  Refining: ${result.feedback}`);
        code = codeGenerator.refine(code, result.feedback);
      } else if (result.nextStep === 'regenerate') {
        console.log('Regenerating from scratch...');
        code = codeGenerator.generate();
      }

      iteration++;
    }

    return {
      code,
      iterations: iteration,
      converged: false,
      reason: 'Max iterations reached'
    };
  }
}

// ============================================================================
// EXAMPLE 5: Custom Feedback Scenarios
// ============================================================================

/**
 * Demonstrating various feedback patterns
 */

const feedbackExamples = [
  {
    name: 'Positive Feedback',
    feedback: 'Excellent solution with good error handling',
    expectedScore: 0.9,
    expectedResult: 'CONVERGED'
  },
  {
    name: 'Negative Feedback',
    feedback: 'This is broken and has critical bugs',
    expectedScore: 0.1,
    expectedResult: 'FAILED'
  },
  {
    name: 'Partial Feedback',
    feedback: 'Mostly correct but needs refactoring',
    expectedScore: 0.5,
    expectedResult: 'PARTIAL'
  },
  {
    name: 'Specific Issues',
    feedback: 'Missing error handling and type hints',
    expectedScore: 0.5,
    expectedResult: 'PARTIAL'
  },
  {
    name: 'Mixed Feedback',
    feedback: 'Good structure but incorrect implementation',
    expectedScore: 0.5,
    expectedResult: 'PARTIAL'
  }
];

// ============================================================================
// EXAMPLE 6: Report Analysis
// ============================================================================

/**
 * Parse and analyze convergence reports
 */

function analyzeConvergenceReport(reportPath) {
  const report = JSON.parse(fs.readFileSync(reportPath, 'utf-8'));

  return {
    sessionId: report.sessionId,
    status: report.result,
    scores: {
      final: report.finalScore,
      codeQuality: report.analysis.codeQuality.score,
      semanticAlignment: report.analysis.semanticAlignment.score,
      historicalConvergence: report.analysis.historicalConvergence.averageScore,
      blocConvergence: report.analysis.blocConvergence.score
    },
    patterns: report.analysis.semanticAlignment.details.patterns,
    recommendations: report.recommendations,
    nextSteps: determineNextSteps(report)
  };
}

function determineNextSteps(report) {
  const steps = [];

  if (report.result === 'CONVERGED') {
    steps.push('✓ Ready for integration');
    steps.push('✓ Consider for generalization');
  } else if (report.result === 'PARTIAL') {
    const analysis = report.analysis;

    if (analysis.codeQuality.score < 75) {
      steps.push('→ Improve code quality (documentation, error handling)');
    }

    if (analysis.semanticAlignment.score < 75) {
      steps.push('→ Review code patterns and structure');
    }

    steps.push('→ Request refinement from agent');
  } else {
    steps.push('→ Full regeneration recommended');
    steps.push('→ Review requirements clarity');
  }

  return steps;
}

// ============================================================================
// EXAMPLE 7: Continuous Monitoring
// ============================================================================

/**
 * Monitor and track convergence metrics over time
 */

class ConvergenceMonitor {
  constructor(reportDir = './.magnus/convergence-reports') {
    this.reportDir = reportDir;
    this.metrics = {};
  }

  /**
   * Analyze all convergence reports in directory
   */
  analyzeReports() {
    const files = fs.readdirSync(this.reportDir);
    const reports = files
      .filter(f => f.endsWith('.json'))
      .map(f => JSON.parse(fs.readFileSync(path.join(this.reportDir, f), 'utf-8')));

    const stats = {
      total: reports.length,
      converged: reports.filter(r => r.result === 'CONVERGED').length,
      partial: reports.filter(r => r.result === 'PARTIAL').length,
      failed: reports.filter(r => r.result === 'FAILED').length,
      averageScore: reports.reduce((sum, r) => sum + r.finalScore, 0) / reports.length,
      convergenceRate: 0
    };

    stats.convergenceRate = (stats.converged / stats.total) * 100;

    return stats;
  }

  /**
   * Track trends over time
   */
  getTrends(timeWindowDays = 7) {
    const files = fs.readdirSync(this.reportDir);
    const now = Date.now();
    const windowMs = timeWindowDays * 24 * 60 * 60 * 1000;

    const recentReports = files
      .filter(f => f.endsWith('.json'))
      .map(f => ({
        file: f,
        stat: fs.statSync(path.join(this.reportDir, f))
      }))
      .filter(item => (now - item.stat.mtime.getTime()) < windowMs)
      .map(item =>
        JSON.parse(
          fs.readFileSync(path.join(this.reportDir, item.file), 'utf-8')
        )
      );

    return {
      period: `Last ${timeWindowDays} days`,
      reports: recentReports.length,
      averageScore: recentReports.length > 0
        ? recentReports.reduce((sum, r) => sum + r.finalScore, 0) / recentReports.length
        : 0,
      trend: this.calculateTrend(recentReports)
    };
  }

  calculateTrend(reports) {
    if (reports.length < 2) return 'INSUFFICIENT_DATA';

    const scores = reports.map(r => r.finalScore);
    const firstHalf = scores.slice(0, Math.floor(scores.length / 2));
    const secondHalf = scores.slice(Math.floor(scores.length / 2));

    const firstAvg = firstHalf.reduce((a, b) => a + b) / firstHalf.length;
    const secondAvg = secondHalf.reduce((a, b) => a + b) / secondHalf.length;

    if (secondAvg > firstAvg) return 'IMPROVING';
    if (secondAvg < firstAvg) return 'DECLINING';
    return 'STABLE';
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

module.exports = {
  validateMultipleSolutions,
  MagnusValidationAgent,
  feedbackExamples,
  analyzeConvergenceReport,
  ConvergenceMonitor
};

// ============================================================================
// CLI USAGE EXAMPLES
// ============================================================================

/*

1. BASIC VALIDATION
   $ node magnus-cli.js \
     --mode validate-convergence \
     --session-id "my-session-001" \
     --code-path "./solution.js"

2. WITH FEEDBACK
   $ node magnus-cli.js \
     --mode validate-convergence \
     --session-id "my-session-002" \
     --code-path "./solution.js" \
     --feedback "good solution"

3. CUSTOM OUTPUT PATH
   $ node magnus-cli.js \
     --mode validate-convergence \
     --session-id "my-session-003" \
     --code-path "./solution.js" \
     --output "./reports/custom-report.json"

4. DIRECTORY VALIDATION
   $ node magnus-cli.js \
     --mode validate-convergence \
     --session-id "my-session-004" \
     --code-path "./src/generated-modules" \
     --feedback "review all modules"

5. IN BASH SCRIPT
   #!/bin/bash
   node magnus-cli.js \
     --mode validate-convergence \
     --session-id "$SESSION_ID" \
     --code-path "$CODE_PATH" \
     --feedback "$FEEDBACK"

   if [ $? -eq 0 ]; then
     echo "✅ Converged"
   elif [ $? -eq 1 ]; then
     echo "⚠️  Partial"
   else
     echo "❌ Failed"
   fi

*/
