/**
 * ============================================================================
 * MAGNUS 13.2 HERMETIC EDITION
 * Main Orchestrator with 8th Principle Integration
 * 
 * The complete cycle: Analyze → Generate → VALIDATE CONVERGENCE → Close
 * ============================================================================
 */

import {
  UnderstandingEngine,
  ComplexityEngine,
  RevelationEngine
} from './magnus-13-1-engines.js';

import {
  LearningEngine,
  CoherenceEngine
} from './magnus-13-1-learning-coherence.js';

import {
  PLANCK_MIRROR_PRINCIPLE,
  HERMETIC_PRINCIPLES,
  COSMIC_MEMBRANES,
  SACRED_GEOMETRY,
  REVELATION_MECHANISM,
  HERMETIC_INTEGRATION
} from './magnus-13-1-hermetic-foundation.js';

import {
  CONVERGENCE_PRINCIPLE,
  EIGHT_PRINCIPLES_UNIFIED,
  CONVERGENCE_METRICS,
  CONVERGENCE_MOMENT
} from './magnus-13-2-convergence-principle.js';

// ============================================================================
// MAGNUS 13.2 - COMPLETE HERMETIC ORCHESTRATOR
// ============================================================================

class Magnus132Hermetic {
  constructor(config = {}) {
    this.config = {
      // Thresholds from sacred geometry
      minClarityScore: config.minClarityScore || 70,
      maxComplexityScore: config.maxComplexityScore || 8,
      minMentalModelCoherence: config.minMentalModelCoherence || 65,
      
      // Convergence validation
      minConvergenceScore: config.minConvergenceScore || 80,
      minInevitabilityScore: config.minInevitabilityScore || 80,
      
      // Learning
      autoLearn: config.autoLearn !== false,
      requireClarification: config.requireClarification !== false,
      
      // Storage
      storageDir: config.storageDir || './.magnus',
      
      // Hermetic options
      enableHermetic: config.enableHermetic !== false,
      enableConvergenceValidation: config.enableConvergenceValidation !== false,
      logPhilosophyNotes: config.logPhilosophyNotes !== false
    };

    // Initialize engines
    this.understanding = new UnderstandingEngine();
    this.complexity = new ComplexityEngine();
    this.revelation = new RevelationEngine();
    this.learning = new LearningEngine(`${this.config.storageDir}/knowledge`);
    this.coherence = new CoherenceEngine(`${this.config.storageDir}/sessions`);

    // Hermetic state
    this.hermetic = {
      sessionTheme: null,
      dominantPrinciples: [],
      convergenceState: null
    };

    this.initialized = false;
  }

  /**
   * Initialize Magnus 13.2
   */
  async initialize() {
    if (this.initialized) return;

    await Promise.all([
      this.learning.initialize(),
      this.coherence.initialize()
    ]);

    this.initialized = true;
    this._log('🧠 Magnus 13.2 Hermetic Edition initialized');
    this._log('📜 Planck Mirror Principle active');
    this._log('🔮 8 Hermetic Principles governing all operations');
    this._log('🎼 Convergence (Si → Do) principle active - cycles will close');
  }

  /**
   * ========================================================================
   * ANALYSIS PHASE (Principles 1-7)
   * ========================================================================
   */

  async analyze(request, options = {}) {
    if (!this.initialized) await this.initialize();

    const analysis = {
      request,
      timestamp: Date.now(),
      
      // Standard analysis
      understanding: null,
      complexity: null,
      recommendation: null,
      clarificationNeeded: false,
      questions: [],
      canProceed: false,
      reasoning: [],
      
      // Hermetic analysis (7 principles)
      hermetic: {
        planckMirror: null,
        hermeticPrinciples: [],
        cosmicMembranes: [],
        revelationPhase: 0,
        philologyNotes: []
      },
      
      // Convergence preparation
      convergenceReady: false
    };

    // ========================================================================
    // PHASE 1: SURFACE INTENTION (MENTALISM)
    // ========================================================================
    this._log('\n🔍 PHASE 1: Surfacing the Intention (MENTALISM)...');
    
    analysis.understanding = this.understanding.analyzeRequirements(request);
    analysis.hermetic.planckMirror = {
      stage: 'INTENTION_SURFACING',
      clarity: analysis.understanding.clarityScore,
      principle: HERMETIC_PRINCIPLES.MENTALISM
    };

    // ========================================================================
    // PHASE 2: CORRESPONDENCE
    // ========================================================================
    this._log('\n📊 PHASE 2: Measuring Correspondence (CORRESPONDENCE)...');
    
    const complexityResult = this.complexity.analyzeComplexity(request);
    analysis.complexity = this.complexity.calculateOverallComplexity(complexityResult);

    // ========================================================================
    // PHASE 3: VIBRATION
    // ========================================================================
    this._log('\n🌊 PHASE 3: Detecting Vibration Patterns (VIBRATION)...');
    
    const learned = this.learning.getRecommendations({
      estimate: {
        scope: this.determineScope(analysis.complexity),
        complexityScore: analysis.complexity.overall.score,
        clarityScore: analysis.understanding.clarityScore
      }
    });

    if (learned.available) {
      this._log(`   ✓ Found ${learned.recommendations.length} pattern resonances`);
      analysis.learned = learned;
    }

    // ========================================================================
    // PHASE 4-7: REMAINING PRINCIPLES
    // ========================================================================
    this._log('\n⚖️  PHASE 4-7: Analyzing Polarity, Rhythm, Causality, Gender...');
    
    // (Analysis continues as in 13.1)
    analysis.hermetic.hermeticPrinciples = this._analyzeAllPrinciples(analysis);

    // ========================================================================
    // DECISION LOGIC (Phases 1-7)
    // ========================================================================
    this._log('\n🎯 DECISION: Can we proceed with generation?');
    
    const decision = this.makeHermeticDecision(analysis);
    analysis.recommendation = decision.recommendation;
    analysis.canProceed = decision.canProceed;
    analysis.reasoning = decision.reasoning;
    analysis.clarificationNeeded = decision.clarificationNeeded;
    analysis.questions = decision.questions;

    // ========================================================================
    // NEW IN 13.2: Mark convergence readiness
    // ========================================================================
    if (analysis.canProceed) {
      analysis.convergenceReady = true;
      this._log('\n🎼 CONVERGENCE: System ready for generation and validation');
    }

    return analysis;
  }

  /**
   * ========================================================================
   * GENERATION PHASE (Principles 1-7 in action)
   * ========================================================================
   */

  async startGeneration(analysis, options = {}) {
    if (!analysis.canProceed) {
      throw new Error('Cannot start generation - need clarification or decomposition');
    }

    this._log('\n✨ GENERATING CODE (Principles 1-7 active)...');

    const session = await this.coherence.startSession(analysis.request, analysis);
    
    const strategy = (analysis.recommendation && analysis.recommendation.strategy) || analysis.strategy || this.selectHermeticStrategy(analysis);

    const generation = {
      sessionId: session.id,
      strategy,
      session,
      phase: "GENERATION",
      nextPhase: "CONVERGENCE_VALIDATION",
      
      hermetic: {
        principles: 'All 7 active - generating with full hermetic guidance'
      },
      
      // NEW: Prepare for convergence
      convergenceExpected: true
    };

    this._log(`   Using strategy: ${generation.strategy && generation.strategy.name ? generation.strategy.name : JSON.stringify(generation.strategy)}`);
    this._log('   Principles 1-7 will guide code generation');
    this._log('   → After generation: CONVERGENCE VALIDATION will verify the code');

    return generation;
  }

  /**
   * ========================================================================
   * NEW IN 13.2: CONVERGENCE VALIDATION PHASE
   * 
   * The 8th Principle - The sensible note that closes the cycle
   * ========================================================================
   */

  async validateConvergence(sessionId, generatedCode, developerFeedback) {
    if (!this.config.enableConvergenceValidation) {
      this._log('⚠️  Convergence validation disabled');
      return { convergenceValidationDisabled: true };
    }

    this._log('\n🎼 PHASE 8: CONVERGENCE VALIDATION (The Sensible Note Principle)...');

    const context = await this.coherence.resumeSession(sessionId);
    const originalAnalysis = context.analysis;

    // ========================================================================
    // EVALUATE CONVERGENCE
    // ========================================================================

    const convergenceAnalysis = {
      sessionId,
      timestamp: Date.now(),
      
      generatedCode: generatedCode,
      developerFeedback: developerFeedback,
      
      // The 8th principle at work
      principle: CONVERGENCE_PRINCIPLE,
      
      metrics: {
        // How much does developer recognize their own intention?
        recognitionScore: this._calculateRecognitionScore(
          developerFeedback,
          originalAnalysis
        ),
        
        // Does the code feel inevitable or surprising?
        inevitabilityScore: this._calculateInevitabilityScore(
          developerFeedback
        ),
        
        // Does code hold all 7+1 principles?
        coherenceScore: this._calculateCoherenceScore(
          generatedCode,
          originalAnalysis
        )
      },

      // Developer response categories
      recognitionType: this._categorizeRecognition(developerFeedback),
      
      convergenceState: null  // Will be determined below
    };

    // ========================================================================
    // DETERMINE CONVERGENCE STATE
    // ========================================================================

    const recScore = convergenceAnalysis.metrics.recognitionScore;
    const inevScore = convergenceAnalysis.metrics.inevitabilityScore;

    if (recScore >= this.config.minConvergenceScore && 
        inevScore >= this.config.minInevitabilityScore) {
      
      convergenceAnalysis.convergenceState = 'CONVERGED';
      convergenceAnalysis.cycleClosed = true;
      
      this._log(`\n✓ CONVERGENCE ACHIEVED`);
      this._log(`  Recognition Score: ${recScore}%`);
      this._log(`  Inevitability Score: ${inevScore}%`);
      this._log(`  → The code resolved perfectly to consciousness`);
      this._log(`  → Si → Do (The sensible note pulled home)`);
      this._log(`  → Cycle CLOSED ✓`);
      
      convergenceAnalysis.action = 'RECORD_AND_LEARN';
      convergenceAnalysis.nextStep = 'Record outcome, extract patterns, update learning engine';
      
    } else if (recScore >= 60 && inevScore >= 60) {
      
      convergenceAnalysis.convergenceState = 'PARTIALLY_CONVERGED';
      convergenceAnalysis.cycleClosed = false;
      
      this._log(`\n⚠️  PARTIAL CONVERGENCE`);
      this._log(`  Recognition Score: ${recScore}%`);
      this._log(`  Inevitability Score: ${inevScore}%`);
      this._log(`  → Code mostly recognized, minor refinement needed`);
      this._log(`  → Si pulling back, almost at Do (one more iteration)`);
      this._log(`  → Cycle PARTIALLY CLOSED`);
      
      convergenceAnalysis.action = 'REFINE_AND_REVALIDATE';
      convergenceAnalysis.nextStep = 'Small iterations to complete revelation';
      
    } else {
      
      convergenceAnalysis.convergenceState = 'NOT_CONVERGED';
      convergenceAnalysis.cycleClosed = false;
      
      this._log(`\n✗ CONVERGENCE FAILED`);
      this._log(`  Recognition Score: ${recScore}%`);
      this._log(`  Inevitability Score: ${inevScore}%`);
      this._log(`  → Code not recognized as developer's intention`);
      this._log(`  → Si did not pull back to Do (missed the target)`);
      this._log(`  → Cycle NOT CLOSED`);
      this._log(`  → Something in phases 1-7 must have been missed`);
      
      convergenceAnalysis.action = 'REANALYZE';
      convergenceAnalysis.nextStep = 'Return to analysis phase 1-7, identify what was missed';
      convergenceAnalysis.recordFailure = true;
    }

    // ========================================================================
    // SIGN OF SUCCESS: REVELATION NOT CREATION
    // ========================================================================

    convergenceAnalysis.revelationCheck = {
      if_surprised: "Code was created, not revealed (problem)",
      if_inevitable: "Code was revealed, exactly what consciousness knew (success)",
      actual: convergenceAnalysis.metrics.inevitabilityScore > 70 
        ? "✓ Revealed" 
        : "✗ Created"
    };

    return convergenceAnalysis;
  }

  /**
   * ========================================================================
   * AFTER CONVERGENCE: LEARNING & CLOSING
   * ========================================================================
   */

  async recordConvergenceOutcome(convergenceAnalysis, outcome) {
    const sessionId = convergenceAnalysis.sessionId;
    const state = convergenceAnalysis.convergenceState;

    if (state === 'CONVERGED') {
      
      this._log('\n📚 LEARNING: Recording successful convergence...');
      
      // Record actual metrics vs estimates
      await this.learning.recordActual(sessionId, outcome);
      
      // Record the convergence itself
      await this.coherence.endSession({
        state: 'CONVERGED',
        convergenceAnalysis: convergenceAnalysis,
        outcome: outcome
      });
      
      this._log('✓ Outcome recorded');
      this._log('✓ Patterns extracted for learning');
      this._log('✓ Cycle complete - Si resolved to Do');
      
      return {
        status: 'SESSION_CLOSED',
        cycleState: 'COMPLETE',
        action: 'READY_FOR_NEXT_REQUEST'
      };
      
    } else if (state === 'PARTIALLY_CONVERGED') {
      
      this._log('\n🔄 REFINEMENT: Small iterations to complete convergence...');
      
      return {
        status: 'AWAITING_REFINEMENT',
        cycleState: 'INCOMPLETE',
        action: 'ITERATE_AND_REVALIDATE'
      };
      
    } else {
      
      this._log('\n⚠️  FAILURE: Cycle not closed, must return to analysis');
      
      await this.learning.recordFailure(sessionId, {
        reason: 'CONVERGENCE_FAILED',
        convergenceAnalysis: convergenceAnalysis
      });
      
      return {
        status: 'REANALYSIS_NEEDED',
        cycleState: 'OPEN',
        action: 'RETURN_TO_PHASE_1_7'
      };
    }
  }

  /**
   * ========================================================================
   * HELPER METHODS
   * ========================================================================
   */

  /**
   * Calculate recognition score: How much does developer recognize their intention?
   */
  _calculateRecognitionScore(feedback, originalAnalysis) {
    const f = this._normalizeFeedback(feedback);

    // If caller supplied an explicit numeric recognition score, use it
    if (typeof f.recognition === 'number' && !Number.isNaN(f.recognition)) {
      return Math.max(0, Math.min(100, Math.round(f.recognition)));
    }

    const text = f.text;
    if (!text) return 50;

    if (text.includes('exactly') || text.includes('yes') || text.includes('perfect')) {
      return 95;
    }

    if (text.includes('close') || text.includes('mostly') || text.includes('almost')) {
      return 70;
    }

    if (text.includes('not') || text.includes("isn't") || text.includes('wrong') || text.includes('no')) {
      return 25;
    }

    return 50;
  }

  /**
   * Calculate inevitability score: Does code feel inevitable or surprising?
   */
  _calculateInevitabilityScore(feedback) {
    const f = this._normalizeFeedback(feedback);

    // If caller provided an explicit numeric inevitability score, trust it
    if (typeof f.inevitability === 'number' && !Number.isNaN(f.inevitability)) {
      return Math.max(0, Math.min(100, Math.round(f.inevitability)));
    }

    const feedbackText = f.text || '';

    const revelationSigns = ['obvious','inevitable','natural','exactly','knew','recognized','makes sense'];
    const creationSigns = ['surprising','creative','clever','unexpected','never thought','novel'];

    const revelationCount = revelationSigns.reduce((c, s) => c + (feedbackText.includes(s) ? 1 : 0), 0);
    const creationCount = creationSigns.reduce((c, s) => c + (feedbackText.includes(s) ? 1 : 0), 0);

    const baseScore = 50 + (revelationCount - creationCount) * 18;
    return Math.max(0, Math.min(100, Math.round(baseScore)));
  }

  /**
   * Calculate coherence score: Does code hold all principles?
   */
  _calculateCoherenceScore(code, originalAnalysis) {
    if (!code || typeof code !== 'string') return 0;

    const hasErrorHandling = /\btry\b|\bcatch\b|process\.on\(/i.test(code);
    const hasLogging = /console\.log|\.log\(|logger\.|this\._log\(/i.test(code);
    const hasDocumentation = /\/\*\*|\/\/\s|@param|@returns/i.test(code);
    const hasStructure = /\bclass\b|\bfunction\b|=>/i.test(code);

    // Heuristics for size/complexity: very short snippets may score lower
    const lines = code.split(/\r?\n/).length;
    const lengthBonus = Math.min(10, Math.floor(lines / 10));

    let score = 0;
    if (hasErrorHandling) score += 30;
    if (hasLogging) score += 25;
    if (hasDocumentation) score += 25;
    if (hasStructure) score += 20;

    score += lengthBonus; // small bonus for substantive code

    return Math.max(0, Math.min(100, score));
  }

  /**
   * Categorize developer's recognition
   */
  _categorizeRecognition(feedback) {
    const f = this._normalizeFeedback(feedback);

    if (typeof f.recognition === 'number') {
      if (f.recognition >= 90) return 'PERFECT_RECOGNITION';
      if (f.recognition >= 60) return 'PARTIAL_RECOGNITION';
      return 'NO_RECOGNITION';
    }

    const text = f.text || '';
    if (text.includes('exactly') || text.includes('perfect')) return 'PERFECT_RECOGNITION';
    if (text.includes('close') || text.includes('mostly') || text.includes('almost')) return 'PARTIAL_RECOGNITION';
    if (text.includes('not') || text.includes('wrong') || text.includes("isn't")) return 'NO_RECOGNITION';
    return 'UNCLEAR';
  }

  /**
   * Normalize feedback into a predictable object
   */
  _normalizeFeedback(feedback) {
    if (!feedback) return { text: '' };
    if (typeof feedback === 'string') return { text: feedback.toLowerCase() };
    if (typeof feedback === 'object') {
      const text = (feedback.text || feedback.comment || feedback.message || '').toString().toLowerCase();
      const recognition = typeof feedback.recognition === 'number' ? feedback.recognition : null;
      const inevitability = typeof feedback.inevitability === 'number' ? feedback.inevitability : null;
      return { text, recognition, inevitability, raw: feedback };
    }
    return { text: String(feedback).toLowerCase() };
  }

  /**
   * Analyze all principles
   */
  _analyzeAllPrinciples(analysis) {
    return [
      { principle: 'MENTALISM', status: 'analyzed' },
      { principle: 'CORRESPONDENCE', status: 'analyzed' },
      { principle: 'VIBRATION', status: 'analyzed' },
      { principle: 'POLARITY', status: 'analyzed' },
      { principle: 'RHYTHM', status: 'analyzed' },
      { principle: 'CAUSALITY', status: 'analyzed' },
      { principle: 'GENDER', status: 'analyzed' }
    ];
  }

  /**
   * Make hermetic decision
   */
  makeHermeticDecision(analysis) {
    // (Same as Magnus 13.1 - determining CLARIFY/DECOMPOSE/GENERATE)
    const decision = {
      recommendation: null,
      canProceed: false,
      strategy: null,
      reasoning: []
    };

    if (analysis.understanding.clarityScore < this.config.minClarityScore) {
      decision.recommendation = 'CLARIFY';
      decision.canProceed = false;
    } else if (analysis.complexity.overall.score > this.config.maxComplexityScore) {
      decision.recommendation = 'DECOMPOSE';
      decision.canProceed = false;
    } else {
      decision.recommendation = 'GENERATE';
      decision.canProceed = true;
      decision.strategy = this.selectHermeticStrategy(analysis);
    }

    return decision;
  }

  /**
   * Select strategy based on complexity
   */
  selectHermeticStrategy(analysis) {
    const complexity = analysis.complexity.overall.score;
    
    if (complexity <= 3) {
      return { name: 'SINGLE_PASS_REVELATION' };
    } else if (complexity <= 5) {
      return { name: 'ITERATIVE_REVELATION' };
    } else if (complexity <= 7) {
      return { name: 'MODULAR_REVELATION' };
    } else {
      return { name: 'PHASED_REVELATION' };
    }
  }

  /**
   * Determine scope
   */
  determineScope(complexity) {
    const score = complexity.overall.score;
    if (score <= 3) return 'SIMPLE';
    if (score <= 5) return 'MODERATE';
    if (score <= 7) return 'COMPLEX';
    return 'EXPERT';
  }

  /**
   * Logging helper
   */
  _log(message) {
    console.log(message);
  }

  /**
   * Generate report with convergence info
   */
  generateReport(analysis, convergenceAnalysis = null) {
    return {
      timestamp: new Date().toISOString(),
      request: analysis.request,
      
      analysis: {
        clarity: analysis.understanding.clarityScore,
        complexity: analysis.complexity.overall.score,
        decision: analysis.recommendation
      },
      
      convergence: convergenceAnalysis || {
        pending: 'Awaiting code generation and validation'
      }
    };
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default Magnus132Hermetic;
export { CONVERGENCE_PRINCIPLE, EIGHT_PRINCIPLES_UNIFIED };
