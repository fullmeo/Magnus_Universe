#!/usr/bin/env node

/**
 * ============================================================================
 * MAGNUS CLI - Convergence Validator Wrapper
 *
 * Non-interactive CLI for Magnus 13.2 Hermetic Edition
 * Designed for agent (Kilo) automation without human intervention
 *
 * Usage:
 *   magnus-cli.js --mode validate-convergence \
 *     --session-id <id> \
 *     --code-path <path> \
 *     [--feedback "optional feedback"] \
 *     [--output <report-path>]
 *
 * Exit Codes:
 *   0 = CONVERGED (solution accepted)
 *   1 = PARTIAL (solution needs refinement)
 *   2 = FAILED (solution rejected)
 * ============================================================================
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

// ============================================================================
// IMPORTS - Magnus 13.2 Components
// ============================================================================

// Try importing from the Magnus directory structure
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

let Magnus13Core;
let BlocConvergenceEngine;

try {
  // Try ES6 import
  const magnus13Module = await import('./magnus/magnus-13-core.js');
  Magnus13Core = magnus13Module.UnderstandingEngine ? {
    UnderstandingEngine: magnus13Module.UnderstandingEngine,
    ComplexityEngine: magnus13Module.ComplexityEngine
  } : null;
} catch (e) {
  // Fallback: create minimal stub
  console.warn('[WARN] Magnus 13 core not found, using stub');
}

try {
  const blocModule = await import('./bloc_convergence_extracted/magnus-13-2-bloc-convergence.js');
  BlocConvergenceEngine = blocModule.BlocConvergenceEngine || blocModule.default;
} catch (e) {
  console.warn('[WARN] Bloc Convergence Engine not found, using stub');
}

// ============================================================================
// ARGUMENT PARSER
// ============================================================================

class ArgumentParser {
  constructor(args) {
    this.args = args;
    this.parsed = {};
    this.errors = [];
  }

  parse() {
    for (let i = 0; i < this.args.length; i++) {
      const arg = this.args[i];

      if (arg.startsWith('--')) {
        const [key, ...valueParts] = arg.substring(2).split('=');
        let value;

        if (valueParts.length > 0) {
          // Format: --key=value
          value = valueParts.join('=');
        } else if (i + 1 < this.args.length && !this.args[i + 1].startsWith('--')) {
          // Format: --key value
          value = this.args[++i];
        } else {
          // Flag without value
          value = true;
        }

        this.parsed[key] = value;
      }
    }

    return this.parsed;
  }

  validate() {
    if (!this.parsed.mode) {
      this.errors.push('--mode is required');
    }

    if (this.parsed.mode === 'validate-convergence') {
      if (!this.parsed['session-id']) {
        this.errors.push('--session-id is required for validate-convergence mode');
      }
      if (!this.parsed['code-path']) {
        this.errors.push('--code-path is required for validate-convergence mode');
      }
    }

    return this.errors.length === 0;
  }

  getErrors() {
    return this.errors;
  }
}

// ============================================================================
// CODE LOADER
// ============================================================================

async function loadCode(codePath) {
  try {
    const stats = await fs.stat(codePath);

    if (stats.isDirectory()) {
      // Load all .js files in directory
      const files = await fs.readdir(codePath, { recursive: true });
      const jsFiles = files.filter(f => f.endsWith('.js'));

      if (jsFiles.length === 0) {
        throw new Error(`No JavaScript files found in directory: ${codePath}`);
      }

      let combinedCode = '';
      for (const file of jsFiles) {
        const filePath = path.join(codePath, file);
        const content = await fs.readFile(filePath, 'utf-8');
        combinedCode += `\n// ============= ${file} =============\n${content}\n`;
      }

      return combinedCode;
    } else {
      // Load single file
      return await fs.readFile(codePath, 'utf-8');
    }
  } catch (error) {
    throw new Error(`Failed to load code from ${codePath}: ${error.message}`);
  }
}

// ============================================================================
// MAGNUS 13.2 HERMETIC EDITION WRAPPER
// ============================================================================

class Magnus132Hermetic {
  constructor(config = {}) {
    this.config = {
      mode: config.mode || 'ORCHESTRATED',
      minClarityScore: config.minClarityScore || 70,
      maxComplexityScore: config.maxComplexityScore || 8,
      storageDir: config.storageDir || './.magnus',
      convergenceThreshold: config.convergenceThreshold || 2,
      ...config
    };

    this.sessionId = null;
    this.generatedCode = null;
    this.feedback = null;
    this.convergenceResult = null;

    console.log('[Magnus132Hermetic] Initialized with config:', {
      mode: this.config.mode,
      storageDir: this.config.storageDir
    });
  }

  /**
   * Main convergence validation method
   *
   * Implements the ORCHESTRATED mode of Magnus 13.2 Hermetic Edition
   */
  async validateConvergence(sessionId, generatedCode, feedback = null) {
    this.sessionId = sessionId;
    this.generatedCode = generatedCode;
    this.feedback = feedback;

    console.log('\n🔍 MAGNUS 13.2 HERMETIC CONVERGENCE VALIDATION');
    console.log('═'.repeat(70));
    console.log(`📋 Session ID: ${sessionId}`);
    console.log(`📝 Code Size: ${generatedCode.length} characters`);
    if (feedback) {
      console.log(`💬 Feedback: "${feedback}"`);
    }

    try {
      // Initialize storage directory
      await this.ensureStorageDir();

      // Phase 1: Code Analysis
      console.log('\n📊 Phase 1: Code Quality Analysis');
      const codeQuality = await this.analyzeCodeQuality(generatedCode);

      // Phase 2: Semantic Analysis
      console.log('\n🧠 Phase 2: Semantic Alignment Analysis');
      const semanticAnalysis = await this.analyzeSemanticAlignment(generatedCode);

      // Phase 3: Historical Convergence Check
      console.log('\n📚 Phase 3: Historical Convergence Check');
      const historicalConvergence = await this.checkHistoricalConvergence(generatedCode);

      // Phase 4: Bloc Convergence (via Bloc Convergence Engine if available)
      console.log('\n🔗 Phase 4: Bloc Convergence Analysis');
      const blocConvergence = await this.checkBlocConvergence(generatedCode);

      // Phase 5: Integration with Feedback
      let feedbackScore = 0.5;
      if (feedback) {
        console.log('\n💬 Phase 5: Feedback Integration');
        feedbackScore = await this.processFeedback(feedback);
      }

      // Calculate Final Score
      const finalScore = await this.calculateFinalConvergenceScore(
        codeQuality,
        semanticAnalysis,
        historicalConvergence,
        blocConvergence,
        feedbackScore
      );

      // Determine Result
      const result = this.determineConvergenceResult(finalScore, historicalConvergence);

      // Build Report
      this.convergenceResult = {
        sessionId,
        timestamp: new Date().toISOString(),
        mode: 'ORCHESTRATED',
        analysis: {
          codeQuality,
          semanticAlignment: semanticAnalysis,
          historicalConvergence,
          blocConvergence,
          feedback: feedback ? { text: feedback, score: feedbackScore } : null
        },
        finalScore,
        result,
        recommendations: this.generateRecommendations(result, finalScore)
      };

      return this.convergenceResult;
    } catch (error) {
      console.error('❌ Convergence validation failed:', error.message);

      this.convergenceResult = {
        sessionId,
        timestamp: new Date().toISOString(),
        mode: 'ORCHESTRATED',
        result: 'FAILED',
        finalScore: 0,
        error: error.message,
        recommendations: ['Review error message and retry']
      };

      return this.convergenceResult;
    }
  }

  // ========================================================================
  // ANALYSIS PHASES
  // ========================================================================

  async ensureStorageDir() {
    try {
      await fs.mkdir(this.config.storageDir, { recursive: true });
      await fs.mkdir(path.join(this.config.storageDir, 'convergence-reports'), {
        recursive: true
      });
    } catch (error) {
      console.warn('[WARN] Failed to create storage directories:', error.message);
    }
  }

  async analyzeCodeQuality(code) {
    const lines = code.split('\n');
    const nonEmptyLines = lines.filter(l => l.trim().length > 0).length;
    const hasErrorHandling = /try\s*{|catch\s*\(|throw\s+/.test(code);
    const hasComments = /\/\/|\/\*/.test(code);
    const hasTypes = /@param|@returns|:\s*\w+|as\s+\w+/.test(code);

    // Quality scoring
    let qualityScore = 50;

    // Size penalty/bonus (prefer 10-500 lines)
    if (nonEmptyLines >= 10 && nonEmptyLines <= 500) {
      qualityScore += 20;
    } else if (nonEmptyLines < 10) {
      qualityScore -= 10;
    }

    // Error handling bonus
    if (hasErrorHandling) qualityScore += 15;

    // Documentation bonus
    if (hasComments) qualityScore += 10;

    // Type information bonus
    if (hasTypes) qualityScore += 5;

    const score = Math.min(qualityScore, 100);

    return {
      score,
      details: {
        lines: nonEmptyLines,
        hasErrorHandling,
        hasComments,
        hasTypes,
        assessment: score >= 75 ? 'GOOD' : score >= 50 ? 'ACCEPTABLE' : 'POOR'
      }
    };
  }

  async analyzeSemanticAlignment(code) {
    // Extract key identifiers and patterns
    const identifiers = new Set();
    const identifierRegex = /(?:const|let|var|function|class)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g;
    let match;
    while ((match = identifierRegex.exec(code)) !== null) {
      identifiers.add(match[1]);
    }

    // Detect patterns
    const patterns = [];
    if (/async\s+\w+\s*\(.*?\)\s*{[\s\S]*?await/.test(code)) patterns.push('async-await');
    if (/\.then\(|\.catch\(/.test(code)) patterns.push('promises');
    if (/class\s+\w+\s*{/.test(code)) patterns.push('class-based');
    if (/const\s+\w+\s*=\s*\(.*?\)\s*=>/.test(code)) patterns.push('functional');
    if (/try\s*{|catch\s*\(/.test(code)) patterns.push('error-handling');

    // Semantic score
    const idCount = Math.min(identifiers.size, 10);
    const patternCount = patterns.length;
    const semanticScore = Math.min((idCount * 5 + patternCount * 10), 100);

    return {
      score: semanticScore,
      details: {
        identifierCount: identifiers.size,
        patterns,
        assessment: semanticScore >= 75 ? 'ALIGNED' : semanticScore >= 50 ? 'PARTIAL' : 'MISALIGNED'
      }
    };
  }

  async checkHistoricalConvergence(code) {
    // Load historical convergence data if available
    try {
      const histPath = path.join(this.config.storageDir, 'historical-convergence.json');
      const histData = JSON.parse(await fs.readFile(histPath, 'utf-8'));

      // Compare current code against historical solutions
      const codeHash = this.simpleHash(code);
      const matches = histData.sessions?.filter(s => {
        const sHash = this.simpleHash(s.code);
        return codeHash === sHash;
      }) || [];

      return {
        pathCount: matches.length,
        averageScore: matches.length > 0
          ? matches.reduce((sum, m) => sum + m.convergenceScore, 0) / matches.length
          : 0,
        converges: matches.length >= this.config.convergenceThreshold
      };
    } catch (error) {
      // No historical data - neutral assessment
      return {
        pathCount: 0,
        averageScore: 50,
        converges: false,
        reason: 'No historical data available'
      };
    }
  }

  async checkBlocConvergence(code) {
    // Attempt to use Bloc Convergence Engine if available
    if (!BlocConvergenceEngine) {
      return {
        available: false,
        score: 50,
        note: 'Bloc Convergence Engine not available'
      };
    }

    try {
      const engine = new BlocConvergenceEngine({
        robustnessThreshold: this.config.convergenceThreshold,
        logLevel: 'info'
      });

      await engine.initialize();

      // Create minimal analysis object
      const analysis = {
        understanding: {
          clarityScore: 75,
          domainContext: 'code-generation',
          constraints: [],
          assumptions: []
        },
        complexity: {
          overall: {
            score: 5
          }
        }
      };

      const result = await engine.scanBlocForConvergence(analysis, code);

      return {
        available: true,
        isRobust: result.robustness.isRobust,
        pathCount: result.robustness.numConvergencePaths,
        averageScore: result.robustness.averageScore,
        interpretation: result.interpretation,
        score: result.robustness.isRobust ? 90 :
               result.robustness.numConvergencePaths > 0 ? 70 : 50
      };
    } catch (error) {
      console.warn('[WARN] Bloc Convergence check failed:', error.message);
      return {
        available: false,
        score: 50,
        error: error.message
      };
    }
  }

  async processFeedback(feedbackText) {
    // Simple feedback processing
    const positive = /good|excellent|perfect|great|awesome|correct|right|works|pass/i.test(feedbackText);
    const negative = /bad|poor|wrong|broken|fail|error|issue|problem|incorrect/i.test(feedbackText);
    const partial = /partial|incomplete|almost|needs|improve|refactor/i.test(feedbackText);

    if (positive) return 0.9;
    if (negative) return 0.1;
    if (partial) return 0.5;

    return 0.6; // neutral
  }

  async calculateFinalConvergenceScore(codeQuality, semantic, historical, bloc, feedback) {
    const weights = {
      codeQuality: 0.25,
      semantic: 0.25,
      historical: 0.25,
      bloc: 0.15,
      feedback: 0.10
    };

    const score = (
      (codeQuality.score * weights.codeQuality) +
      (semantic.score * weights.semantic) +
      (Math.max(historical.averageScore || 50, 0) * weights.historical) +
      ((bloc.score || 50) * weights.bloc) +
      (feedback * 100 * weights.feedback)
    ) / Object.values(weights).reduce((a, b) => a + b);

    return Math.round(score);
  }

  determineConvergenceResult(score, historical) {
    if (score >= 85 && historical.pathCount >= this.config.convergenceThreshold) {
      return 'CONVERGED';
    } else if (score >= 70) {
      return 'PARTIAL';
    } else {
      return 'FAILED';
    }
  }

  generateRecommendations(result, score) {
    const recommendations = [];

    if (result === 'CONVERGED') {
      recommendations.push('✓ Solution converged successfully');
      recommendations.push('✓ Ready for integration');
      recommendations.push('✓ Consider for generalization');
    } else if (result === 'PARTIAL') {
      recommendations.push('◐ Solution partially converged');
      recommendations.push('→ Address quality gaps before integration');
      recommendations.push(`→ Current score: ${score}%, target: 85%`);
    } else {
      recommendations.push('✗ Solution did not converge');
      recommendations.push('→ Refine and retry validation');
      recommendations.push(`→ Current score: ${score}%, target: 70%+`);
    }

    return recommendations;
  }

  simpleHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }
}

// ============================================================================
// MAIN CLI EXECUTION
// ============================================================================

async function main() {
  const args = process.argv.slice(2);

  // Parse arguments
  const parser = new ArgumentParser(args);
  const parsedArgs = parser.parse();

  if (!parser.validate()) {
    console.error('❌ Argument validation failed:');
    parser.getErrors().forEach(err => console.error(`   - ${err}`));
    process.exit(2);
  }

  const mode = parsedArgs.mode;
  const sessionId = parsedArgs['session-id'];
  const codePath = parsedArgs['code-path'];
  const feedback = parsedArgs.feedback || null;
  const outputPath = parsedArgs.output || './.magnus/convergence-report.json';

  // Execute based on mode
  if (mode === 'validate-convergence') {
    try {
      // Load code
      console.log(`\n📂 Loading code from: ${codePath}`);
      const generatedCode = await loadCode(codePath);

      // Initialize Magnus 13.2 Hermetic
      const magnus = new Magnus132Hermetic({
        mode: 'ORCHESTRATED',
        storageDir: './.magnus'
      });

      // Validate convergence
      const result = await magnus.validateConvergence(
        sessionId,
        generatedCode,
        feedback
      );

      // Write report
      console.log(`\n📝 Writing convergence report to: ${outputPath}`);
      await fs.mkdir(path.dirname(outputPath), { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(result, null, 2));

      // Print summary
      console.log('\n' + '═'.repeat(70));
      console.log('🎯 CONVERGENCE VALIDATION RESULT');
      console.log('═'.repeat(70));
      console.log(`Result:     ${result.result}`);
      console.log(`Final Score: ${result.finalScore}%`);
      console.log('\nRecommendations:');
      result.recommendations.forEach(rec => console.log(`  ${rec}`));

      // Exit with appropriate code
      let exitCode = 2; // Default: FAILED
      if (result.result === 'CONVERGED') {
        exitCode = 0;
        console.log('\n✅ SUCCESS - Code converged');
      } else if (result.result === 'PARTIAL') {
        exitCode = 1;
        console.log('\n⚠️  PARTIAL - Code needs refinement');
      }

      process.exit(exitCode);
    } catch (error) {
      console.error('❌ Fatal error:', error.message);
      console.error(error.stack);
      process.exit(2);
    }
  } else {
    console.error(`❌ Unknown mode: ${mode}`);
    console.error('Supported modes: validate-convergence');
    process.exit(2);
  }
}

// Run main
main().catch(error => {
  console.error('Unhandled error:', error);
  process.exit(2);
});
