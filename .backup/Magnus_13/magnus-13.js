/**
 * Magnus 13.0 - Main Orchestrator
 * 
 * Integrates: Understanding, Complexity, Learning, and Coherence engines
 * Provides: High-level API for AI code generation with understanding and continuity
 */

import { UnderstandingEngine, ComplexityEngine } from './magnus-13-core.js';
import { LearningEngine, CoherenceEngine } from './magnus-13-learning-coherence.js';

// ============================================================================
// MAGNUS 13 - Main Orchestrator
// ============================================================================

class Magnus13 {
  constructor(config = {}) {
    this.config = {
      autoLearn: config.autoLearn !== false,
      requireClarification: config.requireClarification !== false,
      minClarityScore: config.minClarityScore || 70,
      maxComplexityScore: config.maxComplexityScore || 8,
      storageDir: config.storageDir || './.magnus'
    };

    // Initialize engines
    this.understanding = new UnderstandingEngine();
    this.complexity = new ComplexityEngine();
    this.learning = new LearningEngine(`${this.config.storageDir}/knowledge`);
    this.coherence = new CoherenceEngine(`${this.config.storageDir}/sessions`);

    this.initialized = false;
  }

  /**
   * Initialize Magnus 13
   */
  async initialize() {
    if (this.initialized) return;

    await Promise.all([
      this.learning.initialize(),
      this.coherence.initialize()
    ]);

    this.initialized = true;
    console.log('🧠 Magnus 13 initialized');
  }

  /**
   * Main entry point: Analyze a request and decide how to proceed
   */
  async analyze(request, options = {}) {
    if (!this.initialized) await this.initialize();

    const analysis = {
      request,
      timestamp: Date.now(),
      understanding: null,
      complexity: null,
      recommendation: null,
      clarificationNeeded: false,
      questions: [],
      canProceed: false,
      reasoning: []
    };

    // PHASE 1: Understand the request
    console.log('🔍 Phase 1: Understanding analysis...');
    analysis.understanding = this.understanding.analyzeRequirements(request);
    
    // PHASE 2: Measure complexity
    console.log('📊 Phase 2: Complexity analysis...');
    const complexityResult = this.complexity.analyzeComplexity(request);
    analysis.complexity = this.complexity.calculateOverallComplexity(complexityResult);

    // PHASE 3: Check if we have learned anything about this pattern
    console.log('📚 Phase 3: Checking learned patterns...');
    const learned = this.learning.getRecommendations({
      estimate: {
        scope: this.determineScope(analysis.complexity),
        complexityScore: analysis.complexity.overall.score,
        clarityScore: analysis.understanding.clarityScore
      }
    });

    if (learned.available) {
      console.log(`✓ Found ${learned.recommendations.length} learned recommendations`);
      analysis.learned = learned;
    }

    // PHASE 4: Decision logic
    console.log('🎯 Phase 4: Making decision...');
    const decision = this.makeDecision(analysis);
    analysis.recommendation = decision.recommendation;
    analysis.canProceed = decision.canProceed;
    analysis.reasoning = decision.reasoning;
    analysis.clarificationNeeded = decision.clarificationNeeded;
    analysis.questions = decision.questions;

    return analysis;
  }

  /**
   * Decision engine: Determine if we can proceed and what to do
   */
  makeDecision(analysis) {
    const decision = {
      recommendation: null,
      canProceed: false,
      clarificationNeeded: false,
      questions: [],
      reasoning: []
    };

    // BLOCKER 1: Clarity too low
    if (analysis.understanding.clarityScore < this.config.minClarityScore) {
      decision.recommendation = 'CLARIFY';
      decision.clarificationNeeded = true;
      decision.questions = this.understanding.generateClarificationQuestions(
        analysis.understanding
      );
      decision.reasoning.push({
        type: 'CLARITY',
        issue: `Clarity score ${analysis.understanding.clarityScore} below threshold ${this.config.minClarityScore}`,
        impact: 'HIGH - Likely to build wrong thing',
        action: 'Must clarify before proceeding'
      });
      return decision;
    }

    // BLOCKER 2: Complexity too high
    if (analysis.complexity.overall.score > this.config.maxComplexityScore) {
      decision.recommendation = 'DECOMPOSE';
      decision.reasoning.push({
        type: 'COMPLEXITY',
        issue: `Complexity score ${analysis.complexity.overall.score} exceeds threshold ${this.config.maxComplexityScore}`,
        impact: 'HIGH - Cannot generate reliably in single session',
        action: 'Break down into smaller, manageable pieces'
      });
      
      // Provide decomposition suggestions
      decision.decomposition = this.suggestDecomposition(analysis);
      return decision;
    }

    // BLOCKER 3: High-risk ambiguities
    const highRiskAmbiguities = analysis.understanding.ambiguities.filter(
      a => a.severity === 'HIGH'
    );
    
    if (highRiskAmbiguities.length > 0 && this.config.requireClarification) {
      decision.recommendation = 'CLARIFY';
      decision.clarificationNeeded = true;
      decision.questions = this.understanding.generateClarificationQuestions(
        analysis.understanding
      );
      decision.reasoning.push({
        type: 'AMBIGUITY',
        issue: `${highRiskAmbiguities.length} high-severity ambiguities detected`,
        impact: 'MEDIUM-HIGH - May require significant rework',
        action: 'Clarify high-priority questions first'
      });
      return decision;
    }

    // WARNING: Medium complexity or clarity
    if (analysis.complexity.overall.score >= 6 || analysis.understanding.clarityScore < 80) {
      decision.warnings = [];
      
      if (analysis.complexity.overall.score >= 6) {
        decision.warnings.push({
          type: 'COMPLEXITY',
          message: 'Moderate-high complexity - generation may be challenging',
          mitigation: 'Will document assumptions and limitations clearly'
        });
      }
      
      if (analysis.understanding.clarityScore < 80) {
        decision.warnings.push({
          type: 'CLARITY',
          message: 'Some ambiguity remains',
          mitigation: `Making assumptions: ${analysis.understanding.assumptions.length} assumptions documented`
        });
      }
    }

    // LEARNED RECOMMENDATIONS: Apply learned patterns
    if (analysis.learned?.recommendations.length > 0) {
      decision.learnedRecommendations = analysis.learned.recommendations;
      decision.reasoning.push({
        type: 'LEARNING',
        issue: 'Historical data available for this pattern',
        impact: 'POSITIVE - Can adjust based on past experience',
        action: `Applying ${analysis.learned.recommendations.length} learned adjustments`
      });
    }

    // CAN PROCEED
    decision.recommendation = 'GENERATE';
    decision.canProceed = true;
    decision.strategy = this.selectStrategy(analysis);
    decision.reasoning.push({
      type: 'DECISION',
      issue: 'Analysis complete - ready to generate',
      impact: 'Ready to proceed with generation',
      action: `Using ${decision.strategy.name} strategy`
    });

    return decision;
  }

  /**
   * Select generation strategy based on analysis
   */
  selectStrategy(analysis) {
    const complexityScore = analysis.complexity.overall.score;
    const scope = this.determineScope(analysis.complexity);

    const strategies = {
      SINGLE_PASS: {
        name: 'Single-Pass Generation',
        when: 'Low complexity, high clarity',
        approach: 'Generate complete solution in one pass',
        phases: [
          '1. Generate complete implementation',
          '2. Add documentation',
          '3. Validate and return'
        ]
      },

      ITERATIVE_REFINEMENT: {
        name: 'Iterative Refinement',
        when: 'Medium complexity, good clarity',
        approach: 'Generate core, then refine in iterations',
        phases: [
          '1. Generate core functionality',
          '2. Add error handling',
          '3. Add edge cases',
          '4. Polish and document'
        ]
      },

      MODULAR_CONSTRUCTION: {
        name: 'Modular Construction',
        when: 'High complexity, manageable scope',
        approach: 'Build module by module with clear interfaces',
        phases: [
          '1. Define architecture and interfaces',
          '2. Generate core modules',
          '3. Generate dependent modules',
          '4. Generate integration layer',
          '5. Add documentation and tests'
        ]
      },

      PHASED_DEVELOPMENT: {
        name: 'Phased Development',
        when: 'Very high complexity or low clarity',
        approach: 'Multi-session development with checkpoints',
        phases: [
          'Session 1: Architecture + critical path',
          'Session 2: Secondary features',
          'Session 3: Error handling + edge cases',
          'Session 4+: Refinement and optimization'
        ],
        requiresMultipleSessions: true
      }
    };

    // Select based on complexity
    if (complexityScore <= 3) {
      return strategies.SINGLE_PASS;
    } else if (complexityScore <= 5) {
      return strategies.ITERATIVE_REFINEMENT;
    } else if (complexityScore <= 7) {
      return strategies.MODULAR_CONSTRUCTION;
    } else {
      return strategies.PHASED_DEVELOPMENT;
    }
  }

  /**
   * Suggest how to decompose a complex problem
   */
  suggestDecomposition(analysis) {
    const suggestions = {
      why: `Complexity score ${analysis.complexity.overall.score} is too high for single-session generation`,
      bottleneck: analysis.complexity.bottleneck.dimension,
      approach: null,
      phases: []
    };

    // Decomposition strategy based on bottleneck
    switch (analysis.complexity.bottleneck.dimension) {
      case 'domain':
        suggestions.approach = 'Separate by domain boundaries';
        suggestions.phases = [
          'Phase 1: Core domain logic (isolated)',
          'Phase 2: Infrastructure (storage, API)',
          'Phase 3: Integration and orchestration'
        ];
        break;

      case 'technical':
        suggestions.approach = 'Separate by technical layers';
        suggestions.phases = [
          'Phase 1: Data layer and models',
          'Phase 2: Business logic',
          'Phase 3: Presentation layer',
          'Phase 4: Infrastructure concerns'
        ];
        break;

      case 'integration':
        suggestions.approach = 'Separate by integration points';
        suggestions.phases = [
          'Phase 1: Core app (no external dependencies)',
          'Phase 2: External service integrations (one at a time)',
          'Phase 3: Integration orchestration'
        ];
        break;

      case 'scale':
        suggestions.approach = 'Start small, scale incrementally';
        suggestions.phases = [
          'Phase 1: Single-user prototype',
          'Phase 2: Add multi-user support',
          'Phase 3: Add performance optimizations',
          'Phase 4: Add scaling infrastructure'
        ];
        break;

      case 'novelty':
        suggestions.approach = 'Research spike, then implementation';
        suggestions.phases = [
          'Phase 1: Research and proof-of-concept',
          'Phase 2: Core implementation',
          'Phase 3: Refinement based on learnings'
        ];
        break;

      default:
        suggestions.approach = 'Feature-based decomposition';
        suggestions.phases = [
          'Phase 1: MVP - core features only',
          'Phase 2: Secondary features',
          'Phase 3: Nice-to-have features'
        ];
    }

    return suggestions;
  }

  /**
   * Start a generation session with full context
   */
  async startGeneration(analysis, options = {}) {
    if (!analysis.canProceed) {
      throw new Error('Cannot start generation - analysis indicates clarification or decomposition needed');
    }

    // Start coherence session
    const session = await this.coherence.startSession(analysis.request, analysis);

    // Record initial estimate for learning
    const estimate = {
      scope: this.determineScope(analysis.complexity),
      tokensEstimated: this.estimateTokens(analysis),
      iterationsEstimated: this.estimateIterations(analysis),
      complexityScore: analysis.complexity.overall.score,
      clarityScore: analysis.understanding.clarityScore
    };

    const learningRecord = this.learning.recordEstimate(session.id, estimate);

    return {
      sessionId: session.id,
      estimate,
      strategy: analysis.recommendation.strategy,
      session,
      context: {
        assumptions: analysis.understanding.assumptions,
        risks: analysis.understanding.risks,
        constraints: this.extractConstraints(analysis),
        learned: analysis.learned
      }
    };
  }

  /**
   * Resume a previous session
   */
  async resumeSession(sessionId) {
    const context = await this.coherence.resumeSession(sessionId);
    
    console.log(`🔄 Resuming session ${sessionId}`);
    console.log(`📋 Context loaded: ${context.decisions.length} decisions, ${context.existingArtifacts.length} artifacts`);
    
    return context;
  }

  /**
   * Record generation outcome for learning
   */
  async recordOutcome(sessionId, outcome) {
    if (this.config.autoLearn) {
      await this.learning.recordActual(sessionId, outcome);
      console.log('📚 Outcome recorded for learning');
    }

    return await this.coherence.endSession(outcome);
  }

  /**
   * Record a failure for analysis
   */
  async recordFailure(sessionId, failure) {
    this.learning.recordFailure(sessionId, failure);
    console.log('⚠️  Failure recorded for analysis');
  }

  /**
   * Get architectural decision records for session
   */
  async getArchitecturalDecisions(sessionId) {
    const context = await this.coherence.resumeSession(sessionId);
    return context.decisions;
  }

  /**
   * Record an architectural decision
   */
  async recordArchitecturalDecision(decision) {
    return await this.coherence.recordDecision(decision);
  }

  /**
   * Helper: Determine scope from complexity analysis
   */
  determineScope(complexity) {
    const score = complexity.overall.score;
    if (score <= 3) return 'SIMPLE';
    if (score <= 5) return 'MODERATE';
    if (score <= 7) return 'COMPLEX';
    return 'EXPERT';
  }

  /**
   * Helper: Estimate tokens needed
   */
  estimateTokens(analysis) {
    const baseEstimate = {
      SIMPLE: 1000,
      MODERATE: 3000,
      COMPLEX: 8000,
      EXPERT: 15000
    };

    const scope = this.determineScope(analysis.complexity);
    let estimate = baseEstimate[scope];

    // Adjust based on learned patterns
    if (analysis.learned?.recommendations.length > 0) {
      const tokenRec = analysis.learned.recommendations.find(r => r.type === 'ESTIMATION');
      if (tokenRec) {
        // Extract multiplier from recommendation
        const match = tokenRec.recommendation.match(/(\d+\.?\d*)x/);
        if (match) {
          estimate *= parseFloat(match[1]);
        }
      }
    }

    // Adjust based on clarity
    if (analysis.understanding.clarityScore < 70) {
      estimate *= 1.3; // Ambiguity adds overhead
    }

    return Math.round(estimate);
  }

  /**
   * Helper: Estimate iterations needed
   */
  estimateIterations(analysis) {
    const baseEstimate = {
      SIMPLE: 1,
      MODERATE: 2,
      COMPLEX: 3,
      EXPERT: 4
    };

    const scope = this.determineScope(analysis.complexity);
    let estimate = baseEstimate[scope];

    // Adjust based on learned patterns
    if (analysis.learned?.recommendations.length > 0) {
      const iterRec = analysis.learned.recommendations.find(r => r.type === 'ITERATION');
      if (iterRec) {
        // Extract additional iterations from recommendation
        const match = iterRec.recommendation.match(/add (\d+)/);
        if (match) {
          estimate += parseInt(match[1]);
        }
      }
    }

    return estimate;
  }

  /**
   * Helper: Extract constraints from analysis
   */
  extractConstraints(analysis) {
    const constraints = [];

    // From ambiguities
    analysis.understanding.ambiguities.forEach(amb => {
      if (amb.type === 'CONSTRAINT_AMBIGUITY' && amb.missingConstraints) {
        amb.missingConstraints.forEach(mc => {
          constraints.push({
            constraint: mc.constraint,
            impact: mc.impact,
            type: 'IMPLICIT'
          });
        });
      }
    });

    // From complexity
    if (analysis.complexity.dimensions.domain.warning) {
      constraints.push({
        constraint: 'Domain expertise required',
        impact: analysis.complexity.dimensions.domain.warning,
        type: 'EXPERTISE'
      });
    }

    if (analysis.complexity.dimensions.scale.warning) {
      constraints.push({
        constraint: 'Scale considerations',
        impact: analysis.complexity.dimensions.scale.warning,
        type: 'SCALE'
      });
    }

    return constraints;
  }

  /**
   * Get statistics about learning
   */
  getKnowledgeStats() {
    return {
      patterns: this.learning.metrics.patterns.size,
      samples: this.learning.metrics.actuals.length,
      failures: this.learning.metrics.failures.length
    };
  }

  /**
   * Generate a comprehensive report
   */
  generateReport(analysis) {
    const report = {
      timestamp: new Date().toISOString(),
      request: analysis.request,
      
      understanding: {
        clarityScore: analysis.understanding.clarityScore,
        ambiguities: analysis.understanding.ambiguities.length,
        assumptions: analysis.understanding.assumptions.length,
        risks: analysis.understanding.risks.length
      },
      
      complexity: {
        overall: analysis.complexity.overall.level,
        score: analysis.complexity.overall.score,
        bottleneck: analysis.complexity.bottleneck.dimension,
        dimensions: Object.entries(analysis.complexity.dimensions).map(([dim, data]) => ({
          dimension: dim,
          level: data.level,
          score: data.score
        }))
      },
      
      decision: {
        recommendation: analysis.recommendation.recommendation,
        canProceed: analysis.canProceed,
        reasoning: analysis.reasoning
      },
      
      learned: analysis.learned || { available: false }
    };

    return report;
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export default Magnus13;
