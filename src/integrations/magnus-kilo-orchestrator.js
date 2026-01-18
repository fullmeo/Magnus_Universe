/**
 * ============================================================================
 * MAGNUS-KILO ORCHESTRATOR
 *
 * Intègre la philosophie Magnus Universe avec la génération pratique Kilo
 *
 * Workflow en 11 Phases:
 * - Phases 1-7: Magnus Analysis (7 Principes Hermétiques)
 * - Phase 8: Kilo Generation (génération de code)
 * - Phase 9: Convergence Validation (8ème Principe)
 * - Phase 10: Integrity Validation (9ème Principe)
 * - Phase 11: Deployment
 *
 * Vision: De la conscience philosophique au code déployé
 * ============================================================================
 */

import Magnus from '../index.js';
import { ConvergencePrinciple } from '../magnus-13-2-convergence-principle.js';
import { NinthPrinciple } from '../core/magnus-13-3-ninth-principle.js';
import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

export class MagnusKiloOrchestrator {
  constructor(config = {}) {
    this.config = {
      magnus: {
        resonanceFrequency: 432,
        convergenceThreshold: 0.85,
        verbose: true,
        ...config.magnus
      },
      kilo: {
        model: 'claude-sonnet-4.5',
        timeout: 180000, // 3 minutes
        deployOnSuccess: false,
        ...config.kilo
      },
      routing: {
        clarityThreshold: 75,
        complexityThresholds: {
          simple: 3,      // CLI direct
          medium: 6,      // CLI avec iterations
          complex: 10     // Agents multiples
        },
        ...config.routing
      },
      memoryBank: {
        enabled: true,
        path: '.magnus-kilo-memory',
        ...config.memoryBank
      }
    };

    // Initialize components
    this.magnus = new Magnus(this.config.magnus);
    this.convergence = new ConvergencePrinciple({
      resonanceFrequency: this.config.magnus.resonanceFrequency
    });
    this.ninthPrinciple = new NinthPrinciple({
      targetFrequency: 528, // Amour/Transformation
      conserveEnergy: true
    });

    this.sessionHistory = [];
    this.memoryBank = this._initializeMemoryBank();
  }

  /**
   * Point d'entrée principal: Orchestration complète
   */
  async orchestrate(intention, options = {}) {
    console.log('🌌 Magnus-Kilo Orchestration Started');
    console.log('═'.repeat(70));
    console.log(`Request: "${intention}"\n`);

    const session = {
      intention,
      startTime: Date.now(),
      phases: {},
      outcome: null,
      route: null
    };

    try {
      // ===================================================================
      // PHASES 1-7: MAGNUS ANALYSIS (7 Hermetic Principles)
      // ===================================================================
      session.phases.magnusAnalysis = await this._runMagnusAnalysis(intention);

      // ===================================================================
      // ROUTING LOGIC: Determine Kilo execution strategy
      // ===================================================================
      session.route = this._determineRoute(session.phases.magnusAnalysis);

      // ===================================================================
      // PHASE 8: KILO GENERATION
      // ===================================================================
      session.phases.kiloGeneration = await this._runKiloGeneration(
        intention,
        session.route,
        options
      );

      // ===================================================================
      // PHASE 9: CONVERGENCE VALIDATION (8th Principle)
      // ===================================================================
      session.phases.convergenceValidation = await this._validateConvergence(
        session.phases.magnusAnalysis,
        session.phases.kiloGeneration
      );

      // ===================================================================
      // PHASE 10: INTEGRITY VALIDATION (9th Principle)
      // ===================================================================
      session.phases.integrityValidation = await this._validateIntegrity(
        session
      );

      // ===================================================================
      // PHASE 11: DEPLOYMENT (if configured)
      // ===================================================================
      if (this.config.kilo.deployOnSuccess && session.phases.integrityValidation.valid) {
        session.phases.deployment = await this._deployToKilo(
          session.phases.kiloGeneration
        );
      }

      // Final outcome
      session.outcome = this._determineOutcome(session);
      session.duration = Date.now() - session.startTime;

      // Save to memory bank
      this._saveToMemoryBank(session);

      // Save to history
      this.sessionHistory.push(session);

      console.log('\n═'.repeat(70));
      console.log(`🎉 Orchestration Complete: ${session.outcome}`);
      console.log(`Duration: ${session.duration}ms`);
      console.log('═'.repeat(70));

      return session;

    } catch (error) {
      session.outcome = 'FAILED';
      session.error = error.message;
      session.duration = Date.now() - session.startTime;

      console.error('\n❌ Orchestration Failed:', error.message);
      console.error(error.stack);

      this.sessionHistory.push(session);
      return session;
    }
  }

  /**
   * PHASES 1-7: Magnus Analysis (7 Hermetic Principles)
   */
  async _runMagnusAnalysis(intention) {
    console.log('📊 PHASES 1-7: Magnus Analysis (7 Hermetic Principles)');
    console.log('─'.repeat(70));

    const analysis = {
      clarity: this._assessClarity(intention),
      complexity: this._assessComplexity(intention),
      principles: {},
      recommendation: null
    };

    // Apply each of the 7 Hermetic Principles
    const principles = [
      'mentalism',
      'correspondence',
      'vibration',
      'polarity',
      'rhythm',
      'causation',
      'generation'
    ];

    for (const principle of principles) {
      try {
        analysis.principles[principle] = await this.magnus.applyPrinciple(
          principle,
          { intention }
        );
      } catch (error) {
        console.log(`  ⚠️  Principle ${principle}: ${error.message}`);
        analysis.principles[principle] = { applied: false, error: error.message };
      }
    }

    // Determine recommendation
    if (analysis.clarity < this.config.routing.clarityThreshold) {
      analysis.recommendation = 'CLARIFY_INTENTION';
    } else if (analysis.complexity <= this.config.routing.complexityThresholds.simple) {
      analysis.recommendation = 'GENERATE_SIMPLE';
    } else if (analysis.complexity <= this.config.routing.complexityThresholds.medium) {
      analysis.recommendation = 'GENERATE_MEDIUM';
    } else if (analysis.complexity <= this.config.routing.complexityThresholds.complex) {
      analysis.recommendation = 'GENERATE_COMPLEX';
    } else {
      analysis.recommendation = 'PHASED_APPROACH';
    }

    console.log(`  Clarity: ${analysis.clarity}/100`);
    console.log(`  Complexity: ${analysis.complexity}/10`);
    console.log(`  Recommendation: ${analysis.recommendation}`);
    console.log(`  Principles Applied: ${Object.keys(analysis.principles).length}/7\n`);

    return analysis;
  }

  /**
   * Routing Logic: Determine Kilo execution strategy
   */
  _determineRoute(analysis) {
    console.log('🔀 ROUTING LOGIC: Determining Kilo Strategy');
    console.log('─'.repeat(70));

    const route = {
      strategy: null,
      kiloCommand: null,
      iterations: 1,
      useAgents: false,
      reasoning: null
    };

    switch (analysis.recommendation) {
      case 'CLARIFY_INTENTION':
        route.strategy = 'MANUAL_CLARIFICATION';
        route.reasoning = 'Intention clarity below threshold, manual clarification required';
        break;

      case 'GENERATE_SIMPLE':
        route.strategy = 'CLI_DIRECT';
        route.kiloCommand = 'kilo';
        route.reasoning = 'Simple task, direct CLI execution';
        break;

      case 'GENERATE_MEDIUM':
        route.strategy = 'CLI_ITERATIVE';
        route.kiloCommand = 'kilo';
        route.iterations = 3;
        route.reasoning = 'Medium complexity, iterative CLI with refinement';
        break;

      case 'GENERATE_COMPLEX':
        route.strategy = 'AGENTS_MULTI';
        route.useAgents = true;
        route.reasoning = 'Complex task, multiple specialized agents';
        break;

      case 'PHASED_APPROACH':
        route.strategy = 'PHASED_DECOMPOSITION';
        route.reasoning = 'Very high complexity, requires decomposition into phases';
        break;

      default:
        route.strategy = 'CLI_DIRECT';
        route.reasoning = 'Default fallback to CLI';
    }

    console.log(`  Strategy: ${route.strategy}`);
    console.log(`  Reasoning: ${route.reasoning}`);
    console.log(`  Kilo Command: ${route.kiloCommand || 'N/A'}`);
    console.log(`  Use Agents: ${route.useAgents}`);
    console.log(`  Iterations: ${route.iterations}\n`);

    return route;
  }

  /**
   * PHASE 8: Kilo Generation
   */
  async _runKiloGeneration(intention, route, options) {
    console.log('⚡ PHASE 8: Kilo Generation');
    console.log('─'.repeat(70));

    if (route.strategy === 'MANUAL_CLARIFICATION') {
      console.log('  ⚠️  Manual clarification required, skipping generation\n');
      return {
        executed: false,
        reason: 'Manual clarification required'
      };
    }

    if (route.strategy === 'PHASED_DECOMPOSITION') {
      console.log('  ⚠️  Phased approach required, not implemented in single orchestration\n');
      return {
        executed: false,
        reason: 'Phased decomposition required (use multiple orchestrations)'
      };
    }

    const generation = {
      strategy: route.strategy,
      startTime: Date.now(),
      iterations: [],
      finalOutput: null,
      exitCode: null
    };

    try {
      if (route.strategy === 'CLI_DIRECT' || route.strategy === 'CLI_ITERATIVE') {
        // Execute Kilo CLI
        for (let i = 0; i < route.iterations; i++) {
          console.log(`  Iteration ${i + 1}/${route.iterations}...`);

          const iteration = await this._executeKiloCLI(
            intention,
            options.projectPath || process.cwd()
          );

          generation.iterations.push(iteration);

          if (iteration.exitCode !== 0) {
            console.log(`  ⚠️  Iteration ${i + 1} failed with exit code ${iteration.exitCode}`);
            break;
          }
        }

        generation.finalOutput = generation.iterations[generation.iterations.length - 1];
        generation.exitCode = generation.finalOutput.exitCode;

      } else if (route.strategy === 'AGENTS_MULTI') {
        // Use Kilo agents (not implemented in this version)
        console.log('  ⚠️  Multi-agent strategy not yet implemented');
        generation.executed = false;
        generation.reason = 'Multi-agent support coming soon';
      }

      generation.duration = Date.now() - generation.startTime;
      generation.success = generation.exitCode === 0;

      console.log(`  ✓ Generation completed in ${generation.duration}ms`);
      console.log(`  Exit Code: ${generation.exitCode}`);
      console.log(`  Success: ${generation.success}\n`);

      return generation;

    } catch (error) {
      generation.error = error.message;
      generation.success = false;
      console.error(`  ❌ Generation error: ${error.message}\n`);
      return generation;
    }
  }

  /**
   * Execute Kilo CLI command
   */
  async _executeKiloCLI(intention, projectPath) {
    const startTime = Date.now();

    try {
      // Build Kilo command
      const command = `kilo "${intention}"`;

      console.log(`    Executing: ${command}`);

      // Execute with timeout
      const output = execSync(command, {
        cwd: projectPath,
        encoding: 'utf8',
        timeout: this.config.kilo.timeout,
        env: {
          ...process.env,
          ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY || process.env.KILO_API_KEY
        }
      });

      return {
        command,
        output,
        exitCode: 0,
        duration: Date.now() - startTime
      };

    } catch (error) {
      return {
        command: `kilo "${intention}"`,
        output: error.stdout || error.stderr || error.message,
        exitCode: error.status || 1,
        error: error.message,
        duration: Date.now() - startTime
      };
    }
  }

  /**
   * PHASE 9: Convergence Validation (8th Principle)
   */
  async _validateConvergence(magnusAnalysis, kiloGeneration) {
    console.log('🔄 PHASE 9: Convergence Validation (8th Principle)');
    console.log('─'.repeat(70));

    if (!kiloGeneration.success) {
      console.log('  ⚠️  Generation failed, skipping convergence validation\n');
      return {
        validated: false,
        reason: 'Generation was not successful'
      };
    }

    const validation = {
      recognition: 0,
      inevitability: 0,
      coherence: 0,
      harmonicScore: 0,
      converged: false
    };

    // Recognition: Did Kilo understand the intention?
    validation.recognition = kiloGeneration.exitCode === 0 ? 90 : 30;

    // Inevitability: Was this the right approach?
    validation.inevitability = magnusAnalysis.clarity >= 75 ? 85 : 60;

    // Coherence: Do Magnus principles align with Kilo output?
    const principlesApplied = Object.values(magnusAnalysis.principles)
      .filter(p => p.applied !== false).length;
    validation.coherence = Math.round((principlesApplied / 7) * 100);

    // Harmonic score via Convergence Principle
    try {
      const convergenceResult = this.convergence.converge([
        { quality: 'magnus_analysis', value: magnusAnalysis.clarity },
        { quality: 'kilo_generation', value: validation.recognition }
      ]);
      validation.harmonicScore = Math.round(convergenceResult.harmonicScore * 100);
    } catch (error) {
      validation.harmonicScore = 50;
    }

    // Overall convergence
    const avgScore = (validation.recognition + validation.inevitability + validation.coherence) / 3;
    validation.converged = avgScore >= this.config.magnus.convergenceThreshold * 100;

    console.log(`  Recognition: ${validation.recognition}% ${validation.recognition >= 80 ? '✓' : '✗'}`);
    console.log(`  Inevitability: ${validation.inevitability}% ${validation.inevitability >= 80 ? '✓' : '✗'}`);
    console.log(`  Coherence: ${validation.coherence}% ${validation.coherence >= 80 ? '✓' : '✗'}`);
    console.log(`  Harmonic Score: ${validation.harmonicScore}%`);
    console.log(`  Converged: ${validation.converged ? '✓ YES' : '✗ NO'}\n`);

    return validation;
  }

  /**
   * PHASE 10: Integrity Validation (9th Principle)
   */
  async _validateIntegrity(session) {
    console.log('✨ PHASE 10: Integrity Validation (9th Principle)');
    console.log('─'.repeat(70));

    const validation = {
      principlesValidated: [],
      violations: [],
      valid: true
    };

    // Validate all 8 principles were properly applied
    const allPrinciples = [
      ...Object.keys(session.phases.magnusAnalysis.principles),
      'convergence'
    ];

    for (const principle of allPrinciples) {
      if (principle === 'convergence') {
        const converged = session.phases.convergenceValidation?.converged;
        if (converged) {
          validation.principlesValidated.push(principle);
          console.log(`  ✓ Principle 8 (Convergence): Validated`);
        } else {
          validation.violations.push(`Convergence not achieved`);
          validation.valid = false;
          console.log(`  ✗ Principle 8 (Convergence): VIOLATED`);
        }
      } else {
        const principleResult = session.phases.magnusAnalysis.principles[principle];
        if (principleResult && principleResult.applied !== false) {
          validation.principlesValidated.push(principle);
          console.log(`  ✓ Principle ${principle}: Validated`);
        } else {
          validation.violations.push(`Principle ${principle} not properly applied`);
          console.log(`  ⚠️  Principle ${principle}: Not applied`);
        }
      }
    }

    // Check for energy conservation (9th Principle metaphor)
    // In code generation: effort in (intention) should match value out (code)
    const effortBalance = this._assessEffortBalance(session);
    if (effortBalance >= 0.7) {
      validation.principlesValidated.push('transmutation');
      console.log(`  ✓ Principle 9 (Transmutation): Energy balanced (${Math.round(effortBalance * 100)}%)`);
    } else {
      validation.violations.push(`Effort-value imbalance: ${Math.round(effortBalance * 100)}%`);
      validation.valid = false;
      console.log(`  ✗ Principle 9 (Transmutation): Energy imbalanced (${Math.round(effortBalance * 100)}%)`);
    }

    validation.score = validation.principlesValidated.length / (allPrinciples.length + 1); // +1 for transmutation

    console.log(`\n  Principles Validated: ${validation.principlesValidated.length}/${allPrinciples.length + 1}`);
    console.log(`  Violations: ${validation.violations.length}`);
    console.log(`  Valid: ${validation.valid ? '✓ YES' : '✗ NO'}\n`);

    return validation;
  }

  /**
   * PHASE 11: Deployment to Kilo
   */
  async _deployToKilo(kiloGeneration) {
    console.log('🚀 PHASE 11: Deployment');
    console.log('─'.repeat(70));

    if (!kiloGeneration.success) {
      console.log('  ⚠️  Generation not successful, skipping deployment\n');
      return { deployed: false, reason: 'Generation was not successful' };
    }

    try {
      // Execute kilo deploy command
      const deployOutput = execSync('kilo deploy', {
        encoding: 'utf8',
        timeout: 60000
      });

      // Extract URL from output (simplified)
      const urlMatch = deployOutput.match(/https?:\/\/[^\s]+/);
      const url = urlMatch ? urlMatch[0] : null;

      console.log(`  ✓ Deployed successfully`);
      if (url) {
        console.log(`  URL: ${url}`);
      }
      console.log();

      return {
        deployed: true,
        url,
        output: deployOutput
      };

    } catch (error) {
      console.error(`  ❌ Deployment failed: ${error.message}\n`);
      return {
        deployed: false,
        error: error.message
      };
    }
  }

  /**
   * Helper: Assess clarity of intention
   */
  _assessClarity(intention) {
    let clarity = 50; // Base score

    // Length check
    if (intention.length > 20) clarity += 10;
    if (intention.length > 50) clarity += 10;

    // Contains action verbs
    const actionVerbs = ['create', 'build', 'make', 'generate', 'develop', 'implement'];
    if (actionVerbs.some(verb => intention.toLowerCase().includes(verb))) {
      clarity += 15;
    }

    // Contains specific technology
    const technologies = ['react', 'vue', 'node', 'python', 'api', 'database', 'ui', 'app'];
    if (technologies.some(tech => intention.toLowerCase().includes(tech))) {
      clarity += 15;
    }

    return Math.min(100, clarity);
  }

  /**
   * Helper: Assess complexity of intention
   */
  _assessComplexity(intention) {
    let complexity = 1; // Base complexity

    // Word count
    const wordCount = intention.split(/\s+/).length;
    if (wordCount > 10) complexity += 1;
    if (wordCount > 20) complexity += 1;

    // Multiple features mentioned
    const featureKeywords = ['and', 'with', 'including', 'plus', 'also'];
    const featureCount = featureKeywords.filter(kw =>
      intention.toLowerCase().includes(kw)
    ).length;
    complexity += featureCount;

    // Technical complexity indicators
    const complexTerms = ['authentication', 'database', 'api', 'real-time', 'integration'];
    const complexTermCount = complexTerms.filter(term =>
      intention.toLowerCase().includes(term)
    ).length;
    complexity += complexTermCount * 2;

    return Math.min(10, complexity);
  }

  /**
   * Helper: Assess effort-value balance
   */
  _assessEffortBalance(session) {
    const effortIn = session.phases.magnusAnalysis.complexity / 10; // 0-1
    const valueOut = session.phases.kiloGeneration.success ? 0.9 : 0.3;

    // Balance: ideally effort = value
    const difference = Math.abs(effortIn - valueOut);
    const balance = 1 - difference;

    return Math.max(0, balance);
  }

  /**
   * Helper: Determine final outcome
   */
  _determineOutcome(session) {
    if (!session.phases.kiloGeneration.success) {
      return 'GENERATION_FAILED';
    }

    if (!session.phases.convergenceValidation.converged) {
      return 'CONVERGENCE_FAILED';
    }

    if (!session.phases.integrityValidation.valid) {
      return 'INTEGRITY_FAILED';
    }

    if (session.phases.deployment?.deployed) {
      return 'DEPLOYED';
    }

    return 'CONVERGED';
  }

  /**
   * Memory Bank: Initialize
   */
  _initializeMemoryBank() {
    if (!this.config.memoryBank.enabled) {
      return null;
    }

    const memoryPath = this.config.memoryBank.path;

    if (!existsSync(memoryPath)) {
      writeFileSync(memoryPath, JSON.stringify({ sessions: [] }, null, 2));
    }

    const data = JSON.parse(readFileSync(memoryPath, 'utf8'));
    return data;
  }

  /**
   * Memory Bank: Save session
   */
  _saveToMemoryBank(session) {
    if (!this.config.memoryBank.enabled || !this.memoryBank) {
      return;
    }

    this.memoryBank.sessions.push({
      intention: session.intention,
      outcome: session.outcome,
      route: session.route.strategy,
      clarity: session.phases.magnusAnalysis.clarity,
      complexity: session.phases.magnusAnalysis.complexity,
      converged: session.phases.convergenceValidation?.converged,
      timestamp: new Date().toISOString()
    });

    writeFileSync(
      this.config.memoryBank.path,
      JSON.stringify(this.memoryBank, null, 2)
    );
  }

  /**
   * Get session history
   */
  getHistory() {
    return this.sessionHistory;
  }

  /**
   * Get statistics
   */
  getStats() {
    const total = this.sessionHistory.length;
    const deployed = this.sessionHistory.filter(s => s.outcome === 'DEPLOYED').length;
    const converged = this.sessionHistory.filter(s => s.outcome === 'CONVERGED' || s.outcome === 'DEPLOYED').length;
    const failed = this.sessionHistory.filter(s => s.outcome.includes('FAILED')).length;

    return {
      total,
      deployed,
      converged,
      failed,
      successRate: total > 0 ? Math.round((converged / total) * 100) : 0
    };
  }
}

export default MagnusKiloOrchestrator;
