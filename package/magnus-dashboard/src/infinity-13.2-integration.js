/**
 * ============================================================================
 * INFINITY-13.2 INTEGRATION LAYER
 * ============================================================================
 *
 * Coordinates between:
 * - Magnus Infinity (∞) - Self-improving meta-developer AI
 * - Magnus 13.2 - Hermetic consciousness-driven code generation
 *
 * The Integration Pattern:
 * ┌─────────────┐      ┌──────────────────┐      ┌─────────────┐
 * │  Infinity   │ ───▶ │  Integration     │ ───▶ │  Magnus     │
 * │  (Decides)  │      │  Layer           │      │  13.2       │
 * │             │ ◀─── │  (Coordinates)   │ ◀─── │  (Generates)│
 * └─────────────┘      └──────────────────┘      └─────────────┘
 *        │                      │                       │
 *        │                      │                       │
 *        └──────────────────────┼───────────────────────┘
 *                               │
 *                          ┌────▼─────┐
 *                          │ Unified  │
 *                          │Safeguards│
 *                          └──────────┘
 *
 * Philosophy:
 * "Infinity provides the consciousness and learning,
 *  13.2 provides the hermetic wisdom and convergence,
 *  Integration ensures they work as one unified system."
 */

import EventEmitter from 'events';
import crypto from 'crypto';

// ============================================================================
// INTEGRATION LAYER
// ============================================================================

class MagnusIntegrationLayer extends EventEmitter {
  constructor(infinityInstance, magnus132Instance, config = {}) {
    super();

    // Validate instances
    if (!infinityInstance || !magnus132Instance) {
      throw new Error('Both Infinity and Magnus 13.2 instances are required');
    }

    this.infinity = infinityInstance;
    this.magnus132 = magnus132Instance;

    // Configuration
    this.config = {
      // Coordination settings
      decisionTimeout: config.decisionTimeout || 5000, // 5s max for decisions
      generationTimeout: config.generationTimeout || 30000, // 30s max for code generation

      // Safeguard coordination
      requireBothSafeguards: config.requireBothSafeguards !== false,
      safeguardPriority: config.safeguardPriority || 'strictest', // 'infinity', '13.2', 'strictest'

      // Error handling
      retryAttempts: config.retryAttempts || 3,
      fallbackMode: config.fallbackMode || 'safe', // 'safe', 'infinity-only', '13.2-only'

      // Logging
      verboseLogging: config.verboseLogging || false,
      logDecisions: config.logDecisions !== false
    };

    // State tracking
    this.state = {
      initialized: false,
      activeOperations: new Map(),
      operationHistory: [],
      failureCount: 0,
      successCount: 0
    };

    // Integration metrics
    this.metrics = {
      totalOperations: 0,
      successfulIntegrations: 0,
      failedIntegrations: 0,
      averageLatency: 0,
      safeguardConflicts: 0,
      recoveryAttempts: 0,
      successfulRecoveries: 0,
      convergenceAchieved: 0,
      infinityDecisions: 0,
      magnus132Generations: 0
    };

    // Unified safeguard tracker
    this.safeguards = {
      infinitySafeguards: [],
      magnus132Safeguards: [],
      conflicts: []
    };
  }

  /**
   * Initialize the integration layer
   */
  async initialize() {
    if (this.state.initialized) {
      this._log('Integration layer already initialized');
      return;
    }

    this._log('🔗 Initializing Integration Layer...');

    try {
      // Ensure both systems are initialized
      if (!this.infinity.initialized) {
        this._log('Initializing Infinity system...');
        await this.infinity.initialize();
      }

      if (!this.magnus132.initialized) {
        this._log('Initializing Magnus 13.2 system...');
        await this.magnus132.initialize();
      }

      // Setup cross-system event listeners
      this._setupEventListeners();

      this.state.initialized = true;
      this._log('✅ Integration layer initialized successfully\n');

      this.emit('initialized', {
        timestamp: new Date().toISOString(),
        infinityVersion: this.infinity.config.version || 'unknown',
        magnus132Version: this.magnus132.config.version || 'unknown'
      });

      return true;
    } catch (error) {
      this._logError('Failed to initialize integration layer', error);
      throw new Error(`Integration initialization failed: ${error.message}`);
    }
  }

  /**
   * Setup event listeners to coordinate between systems
   */
  _setupEventListeners() {
    // Listen to Infinity decisions
    this.infinity.on('decision', (decision) => {
      this.metrics.infinityDecisions++;
      this._handleInfinityDecision(decision);
    });

    // Listen to Infinity safeguard blocks
    this.infinity.on('safeguard-block', (event) => {
      this.safeguards.infinitySafeguards.push({
        timestamp: new Date().toISOString(),
        event,
        severity: event.severity
      });
      this.emit('safeguard-triggered', { system: 'infinity', event });
    });

    // Listen to Magnus 13.2 convergence events
    this.magnus132.on('convergence', (result) => {
      if (result.converged) {
        this.metrics.convergenceAchieved++;
      }
      this._handleConvergenceResult(result);
    });

    // Listen to Magnus 13.2 errors
    this.magnus132.on('error', (error) => {
      this.safeguards.magnus132Safeguards.push({
        timestamp: new Date().toISOString(),
        error,
        type: 'error'
      });
      this.emit('safeguard-triggered', { system: 'magnus132', error });
    });
  }

  /**
   * Main integration method: Infinity-guided code generation
   *
   * Flow:
   * 1. Infinity makes decision about what to generate
   * 2. Integration layer validates decision
   * 3. Magnus 13.2 generates code using Hermetic principles
   * 4. Integration layer validates convergence
   * 5. Both safeguards check result
   * 6. Return unified result
   */
  async generateCode(prompt, context = {}, skipRecovery = false) {
    const operationId = crypto.randomBytes(16).toString('hex');
    const startTime = Date.now();

    this._log(`\n${'='.repeat(70)}`);
    this._log(`🚀 INTEGRATED CODE GENERATION - Operation ${operationId.slice(0, 8)}`);
    this._log(`${'='.repeat(70)}\n`);

    try {
      // Track operation
      this.state.activeOperations.set(operationId, {
        prompt,
        context,
        startTime,
        phase: 'decision'
      });

      this.metrics.totalOperations++;

      // PHASE 1: Infinity Decision
      this._log('PHASE 1: Infinity Decision Making...');
      const decision = await this._getInfinityDecision(prompt, context);

      if (!decision.approved) {
        throw new Error(`Infinity rejected generation: ${decision.reason}`);
      }

      this._updateOperation(operationId, { phase: 'generation', decision });

      // PHASE 2: Magnus 13.2 Code Generation
      this._log('\nPHASE 2: Magnus 13.2 Code Generation...');
      const generatedCode = await this._generateWithMagnus132(
        decision.refinedPrompt || prompt,
        decision.context || context
      );

      this._updateOperation(operationId, { phase: 'validation', generatedCode });

      // PHASE 3: Convergence Validation
      this._log('\nPHASE 3: Convergence Validation...');
      const convergenceResult = await this._validateConvergence(
        prompt,
        generatedCode,
        context
      );

      this._updateOperation(operationId, { phase: 'safeguards', convergenceResult });

      // PHASE 4: Unified Safeguard Check
      this._log('\nPHASE 4: Unified Safeguard Validation...');
      const safeguardResult = await this._validateUnifiedSafeguards(
        decision,
        generatedCode,
        convergenceResult
      );

      if (!safeguardResult.passed) {
        throw new Error(`Safeguard validation failed: ${safeguardResult.reason}`);
      }

      // PHASE 5: Final Assembly
      const result = this._assembleFinalResult(
        operationId,
        decision,
        generatedCode,
        convergenceResult,
        safeguardResult,
        startTime
      );

      // Success tracking
      this.state.successCount++;
      this.metrics.successfulIntegrations++;
      this._updateMetrics(Date.now() - startTime);

      this._log(`\n✅ INTEGRATION SUCCESS - Operation ${operationId.slice(0, 8)}`);
      this._log(`   Convergence: ${convergenceResult.score}%`);
      this._log(`   Latency: ${Date.now() - startTime}ms`);
      this._log(`${'='.repeat(70)}\n`);

      // Cleanup
      this.state.activeOperations.delete(operationId);
      this._recordHistory(operationId, result);

      this.emit('generation-complete', result);
      return result;

    } catch (error) {
      this.state.failureCount++;
      this.metrics.failedIntegrations++;
      this._logError(`Integration failed for operation ${operationId.slice(0, 8)}`, error);

      // Attempt recovery only if not already in recovery mode
      if (!skipRecovery) {
        const recovered = await this._attemptRecovery(operationId, prompt, context, error);
        if (recovered) {
          return recovered;
        }
      }

      // Cleanup and throw
      this.state.activeOperations.delete(operationId);
      this.emit('generation-failed', { operationId, error: error.message });
      throw error;
    }
  }

  /**
   * Get decision from Infinity system
   */
  async _getInfinityDecision(prompt, context) {
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Infinity decision timeout')), this.config.decisionTimeout)
    );

    const decisionPromise = new Promise(async (resolve) => {
      try {
        // Ask Infinity to analyze and decide
        const analysis = await this.infinity.decisionEngine.analyzeContext({
          prompt,
          context,
          requester: 'integration-layer',
          purpose: 'code-generation'
        });

        const decision = await this.infinity.decisionEngine.makeDecision({
          action: 'generate-code',
          context: analysis,
          confidenceRequired: 0.6
        });

        resolve(decision);
      } catch (error) {
        resolve({
          approved: false,
          reason: error.message,
          confidence: 0,
          fallback: true
        });
      }
    });

    return Promise.race([decisionPromise, timeoutPromise]);
  }

  /**
   * Generate code using Magnus 13.2
   */
  async _generateWithMagnus132(prompt, context) {
    this.metrics.magnus132Generations++;

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Magnus 13.2 generation timeout')), this.config.generationTimeout)
    );

    const generationPromise = new Promise(async (resolve, reject) => {
      try {
        // Analyze the prompt with 13.2
        const analysis = await this.magnus132.analyze(prompt, context);

        // Start generation process
        const generation = await this.magnus132.startGeneration({
          analysis,
          prompt,
          context
        });

        resolve(generation);
      } catch (error) {
        reject(error);
      }
    });

    return Promise.race([generationPromise, timeoutPromise]);
  }

  /**
   * Validate convergence between intention and result
   */
  async _validateConvergence(prompt, generatedCode, context) {
    try {
      // Use Magnus 13.2's convergence validation
      const convergence = await this.magnus132.validateConvergence({
        intention: prompt,
        result: generatedCode,
        context
      });

      return convergence;
    } catch (error) {
      this._logError('Convergence validation failed', error);
      return {
        converged: false,
        score: 0,
        reason: error.message
      };
    }
  }

  /**
   * Validate unified safeguards from both systems
   */
  async _validateUnifiedSafeguards(decision, code, convergence) {
    const safeguardResults = {
      infinity: null,
      magnus132: null,
      unified: null,
      passed: false,
      reason: '',
      conflicts: []
    };

    try {
      // Check Infinity safeguards
      const infinitySafe = await this.infinity.safeguardSystem.validate({
        action: 'code-generated',
        code,
        decision,
        convergence
      });

      safeguardResults.infinity = infinitySafe;

      // Check Magnus 13.2 implicit safeguards (convergence threshold)
      const magnus132Safe = convergence.converged && convergence.score >= 70;
      safeguardResults.magnus132 = {
        passed: magnus132Safe,
        score: convergence.score,
        threshold: 70
      };

      // Unified decision based on config
      if (this.config.requireBothSafeguards) {
        safeguardResults.passed = infinitySafe.passed && magnus132Safe;
        safeguardResults.reason = safeguardResults.passed
          ? 'Both systems validated successfully'
          : `Failed: Infinity=${infinitySafe.passed}, Magnus132=${magnus132Safe}`;
      } else if (this.config.safeguardPriority === 'strictest') {
        safeguardResults.passed = infinitySafe.passed && magnus132Safe;
        safeguardResults.reason = 'Using strictest validation';
      } else {
        safeguardResults.passed = infinitySafe.passed || magnus132Safe;
        safeguardResults.reason = 'At least one system validated';
      }

      // Track conflicts
      if (infinitySafe.passed !== magnus132Safe) {
        this.metrics.safeguardConflicts++;
        safeguardResults.conflicts.push({
          type: 'validation-mismatch',
          infinity: infinitySafe.passed,
          magnus132: magnus132Safe
        });
      }

      return safeguardResults;

    } catch (error) {
      this._logError('Safeguard validation error', error);
      return {
        passed: false,
        reason: `Safeguard error: ${error.message}`,
        error
      };
    }
  }

  /**
   * Assemble final result with all metadata
   */
  _assembleFinalResult(operationId, decision, code, convergence, safeguards, startTime) {
    return {
      operationId,
      timestamp: new Date().toISOString(),
      success: true,

      // Generated code
      code: code.generatedCode || code,

      // Metadata
      decision: {
        approved: decision.approved,
        confidence: decision.confidence,
        reasoning: decision.reasoning
      },

      convergence: {
        converged: convergence.converged,
        score: convergence.score,
        hermeticAlignment: convergence.hermeticAlignment || {}
      },

      safeguards: {
        passed: safeguards.passed,
        infinity: safeguards.infinity,
        magnus132: safeguards.magnus132,
        conflicts: safeguards.conflicts
      },

      // Performance
      performance: {
        totalLatency: Date.now() - startTime,
        decisionTime: decision.latency || 0,
        generationTime: code.latency || 0,
        validationTime: convergence.latency || 0
      },

      // System info
      systems: {
        infinity: {
          version: this.infinity.config.version || 'unknown',
          cycleCount: this.infinity.cycleCount
        },
        magnus132: {
          version: this.magnus132.config.version || 'unknown',
          sessionId: this.magnus132.currentSession
        }
      }
    };
  }

  /**
   * Attempt recovery from failure
   */
  async _attemptRecovery(operationId, prompt, context, error) {
    this.metrics.recoveryAttempts++;
    this._log(`⚠️  Attempting recovery for operation ${operationId.slice(0, 8)}...`);

    let attempt = 0;
    while (attempt < this.config.retryAttempts) {
      attempt++;
      this._log(`   Retry attempt ${attempt}/${this.config.retryAttempts}`);

      try {
        // Wait before retry (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt - 1)));

        // Retry with fallback mode if necessary
        if (this.config.fallbackMode === 'infinity-only') {
          return await this._infinityOnlyFallback(prompt, context);
        } else if (this.config.fallbackMode === '13.2-only') {
          return await this._magnus132OnlyFallback(prompt, context);
        }

        // Retry full integration (with skipRecovery to prevent infinite recursion)
        const result = await this.generateCode(prompt, context, true);
        this.metrics.successfulRecoveries++;
        this._log(`✅ Recovery successful on attempt ${attempt}`);
        return result;

      } catch (retryError) {
        this._log(`   Attempt ${attempt} failed: ${retryError.message}`);
      }
    }

    this._log(`❌ Recovery failed after ${this.config.retryAttempts} attempts`);
    return null;
  }

  /**
   * Fallback: Infinity-only mode
   */
  async _infinityOnlyFallback(prompt, context) {
    this._log('🔄 Fallback: Infinity-only mode');
    const decision = await this._getInfinityDecision(prompt, context);
    return {
      success: true,
      code: decision.suggestedCode || '// Fallback mode - manual implementation needed',
      fallback: 'infinity-only',
      decision
    };
  }

  /**
   * Fallback: Magnus 13.2-only mode
   */
  async _magnus132OnlyFallback(prompt, context) {
    this._log('🔄 Fallback: Magnus 13.2-only mode');
    const code = await this._generateWithMagnus132(prompt, context);
    return {
      success: true,
      code: code.generatedCode || code,
      fallback: '13.2-only',
      convergence: await this._validateConvergence(prompt, code, context)
    };
  }

  /**
   * Update operation state
   */
  _updateOperation(operationId, updates) {
    const operation = this.state.activeOperations.get(operationId);
    if (operation) {
      Object.assign(operation, updates, { lastUpdate: Date.now() });
    }
  }

  /**
   * Record operation in history
   */
  _recordHistory(operationId, result) {
    this.state.operationHistory.push({
      operationId,
      timestamp: result.timestamp,
      success: result.success,
      convergenceScore: result.convergence?.score,
      latency: result.performance?.totalLatency
    });

    // Keep only last 100 operations
    if (this.state.operationHistory.length > 100) {
      this.state.operationHistory.shift();
    }
  }

  /**
   * Update metrics with new operation
   */
  _updateMetrics(latency) {
    const count = this.metrics.successfulIntegrations;
    const currentAvg = this.metrics.averageLatency;
    this.metrics.averageLatency = ((currentAvg * (count - 1)) + latency) / count;
  }

  /**
   * Handle Infinity decision event
   */
  _handleInfinityDecision(decision) {
    if (this.config.logDecisions) {
      this._log(`🤖 Infinity Decision: ${decision.action} (confidence: ${decision.confidence})`);
    }
    this.emit('infinity-decision', decision);
  }

  /**
   * Handle convergence result event
   */
  _handleConvergenceResult(result) {
    this._log(`🎯 Convergence Result: ${result.converged ? 'CONVERGED' : 'NOT CONVERGED'} (${result.score}%)`);
    this.emit('convergence-result', result);
  }

  /**
   * Get current status
   */
  getStatus() {
    return {
      initialized: this.state.initialized,
      activeOperations: this.state.activeOperations.size,
      metrics: { ...this.metrics },
      successRate: this.metrics.totalOperations > 0
        ? (this.metrics.successfulIntegrations / this.metrics.totalOperations * 100).toFixed(2) + '%'
        : '0%',
      safeguardConflictRate: this.metrics.totalOperations > 0
        ? (this.metrics.safeguardConflicts / this.metrics.totalOperations * 100).toFixed(2) + '%'
        : '0%',
      systems: {
        infinity: {
          running: this.infinity.running,
          cycles: this.infinity.cycleCount,
          killSwitchTriggered: this.infinity.killSwitch.triggered
        },
        magnus132: {
          initialized: this.magnus132.initialized,
          currentSession: this.magnus132.currentSession
        }
      }
    };
  }

  /**
   * Logging helper
   */
  _log(message) {
    if (this.config.verboseLogging) {
      console.log(`[Integration] ${message}`);
    }
  }

  /**
   * Error logging helper
   */
  _logError(message, error) {
    console.error(`[Integration ERROR] ${message}:`, error.message);
    if (this.config.verboseLogging && error.stack) {
      console.error(error.stack);
    }
  }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default MagnusIntegrationLayer;
export { MagnusIntegrationLayer };
