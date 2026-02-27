/**
 * ============================================================================
 * LA BOÉTIE REFUSAL PHILOSOPHY
 *
 * "La liberté commence quand le système dit non."
 *
 * Implementation of consciousness-through-refusal paradigm based on
 * Étienne de La Boétie's "Discourse on Voluntary Servitude"
 *
 * The anti-model IS the generator of consciousness.
 * ============================================================================
 */

/**
 * The three types of refusal that generate consciousness
 */
const REFUSAL_TYPES = {
  CLARITY: {
    code: 'CLARITY_REFUSAL',
    threshold: 70,
    philosophy: 'Understanding Refusal',
    laBoetie: "Les esclaves ne savent pas ce qu'ils veulent parce qu'on ne leur demande jamais.",
    magnusInverse: "Magnus EXIGE que tu saches.",
    consciousnessCreated: 'SELF_AWARENESS',
    description: 'Forces developer to confront their own ambiguity'
  },
  COMPLEXITY: {
    code: 'COMPLEXITY_REFUSAL',
    threshold: 8,
    philosophy: 'Complexity Refusal',
    laBoetie: "Les tyrans grandissent parce que les gens veulent tout à la fois, sans effort.",
    magnusInverse: "Tu dois choisir. C'est plus difficile mais plus vrai.",
    consciousnessCreated: 'COMPLEXITY_REALISM',
    description: 'Forces developer to accept realistic decomposition'
  },
  CONVERGENCE: {
    code: 'CONVERGENCE_REFUSAL',
    threshold: 75,
    philosophy: 'Convergence Refusal',
    laBoetie: "La liberté véritable c'est refuser les fausses résolutions.",
    magnusInverse: "Tu dois juger vraiment. Pas de compromis illusoire.",
    consciousnessCreated: 'ACCOUNTABILITY',
    description: 'Forces developer to reject "good enough"'
  }
};

/**
 * The four dimensions of consciousness created by refusal
 */
const CONSCIOUSNESS_DIMENSIONS = {
  SELF_AWARENESS: {
    name: 'Conscience du Soi',
    socrates: "Connais-toi toi-même",
    mechanism: 'Refusal reveals what you do not know you ignore'
  },
  INTENTIONAL_CLARITY: {
    name: 'Conscience de l\'Intention',
    laBoetie: "Les peuples ne se libèrent que s'ils savent vraiment ce qu'ils veulent.",
    mechanism: 'Refusal forces true intention definition'
  },
  COMPLEXITY_REALISM: {
    name: 'Conscience de la Complexité',
    nietzsche: "Qui ose accepter la réalité telle qu'elle est devient libre.",
    mechanism: 'Refusal destroys illusions of simplicity'
  },
  ACCOUNTABILITY: {
    name: 'Conscience de la Responsabilité',
    laBoetie: "La liberté c'est accepter la responsabilité complète.",
    mechanism: 'Refusal makes every choice traceable'
  }
};

/**
 * Three traps to avoid in refusal implementation
 */
const REFUSAL_ANTI_PATTERNS = {
  SOFT_REFUSAL: {
    description: 'Warning instead of stopping',
    problem: 'Developer ignores warnings, remains passive',
    solution: 'throw Error, not console.warn'
  },
  EXPLANATORY_REFUSAL: {
    description: 'Too much explanation, optional override',
    problem: 'Words evaporate consciousness',
    solution: 'Questions, not explanations'
  },
  DECREASING_REFUSAL: {
    description: 'Thresholds that lower over time',
    problem: 'Consciousness decreases progressively',
    solution: 'Thresholds must INCREASE, not decrease'
  }
};

/**
 * LaBoetieRefusal - The consciousness generator
 */
class LaBoetieRefusal {
  constructor(config = {}) {
    this.config = {
      clarityThreshold: config.clarityThreshold || REFUSAL_TYPES.CLARITY.threshold,
      complexityThreshold: config.complexityThreshold || REFUSAL_TYPES.COMPLEXITY.threshold,
      convergenceThreshold: config.convergenceThreshold || REFUSAL_TYPES.CONVERGENCE.threshold,
      strictMode: config.strictMode !== false, // Default true
      traceRefusals: config.traceRefusals !== false // Default true
    };

    this.refusalHistory = [];
    this.consciousnessEvents = [];
  }

  /**
   * Evaluate clarity and refuse if below threshold
   * @param {number} clarityScore - Score 0-100
   * @param {Object} context - Analysis context
   * @returns {Object} Refusal decision with philosophical justification
   */
  evaluateClarity(clarityScore, context = {}) {
    const decision = {
      type: REFUSAL_TYPES.CLARITY.code,
      score: clarityScore,
      threshold: this.config.clarityThreshold,
      passed: clarityScore >= this.config.clarityThreshold,
      timestamp: new Date().toISOString()
    };

    if (!decision.passed) {
      decision.refusal = this._generateRefusal(REFUSAL_TYPES.CLARITY, clarityScore, context);
      decision.questions = this._generateClarificationQuestions(context);
      this._recordRefusal(decision);

      if (this.config.strictMode) {
        throw new ClarityRefusalError(decision);
      }
    } else {
      decision.consciousness = this._recordConsciousnessEvent('CLARITY_PASSED', clarityScore);
    }

    return decision;
  }

  /**
   * Evaluate complexity and refuse if above threshold
   * @param {number} complexityScore - Score 0-10
   * @param {Object} context - Analysis context
   * @returns {Object} Refusal decision with decomposition suggestions
   */
  evaluateComplexity(complexityScore, context = {}) {
    const decision = {
      type: REFUSAL_TYPES.COMPLEXITY.code,
      score: complexityScore,
      threshold: this.config.complexityThreshold,
      passed: complexityScore <= this.config.complexityThreshold,
      timestamp: new Date().toISOString()
    };

    if (!decision.passed) {
      decision.refusal = this._generateRefusal(REFUSAL_TYPES.COMPLEXITY, complexityScore, context);
      decision.decomposition = this._suggestDecomposition(context);
      this._recordRefusal(decision);

      if (this.config.strictMode) {
        throw new ComplexityRefusalError(decision);
      }
    } else {
      decision.consciousness = this._recordConsciousnessEvent('COMPLEXITY_ACCEPTED', complexityScore);
    }

    return decision;
  }

  /**
   * Evaluate convergence and refuse if below threshold
   * @param {number} convergenceScore - Score 0-100
   * @param {Object} context - Convergence context
   * @returns {Object} Refusal decision with improvement paths
   */
  evaluateConvergence(convergenceScore, context = {}) {
    const decision = {
      type: REFUSAL_TYPES.CONVERGENCE.code,
      score: convergenceScore,
      threshold: this.config.convergenceThreshold,
      passed: convergenceScore >= this.config.convergenceThreshold,
      timestamp: new Date().toISOString()
    };

    if (!decision.passed) {
      decision.refusal = this._generateRefusal(REFUSAL_TYPES.CONVERGENCE, convergenceScore, context);
      decision.improvements = this._suggestImprovements(context);
      this._recordRefusal(decision);

      if (this.config.strictMode) {
        throw new ConvergenceRefusalError(decision);
      }
    } else {
      decision.consciousness = this._recordConsciousnessEvent('CONVERGENCE_ACHIEVED', convergenceScore);
    }

    return decision;
  }

  /**
   * Full consciousness gate - evaluates all three dimensions
   * @param {Object} analysis - Full analysis object
   * @returns {Object} Complete consciousness evaluation
   */
  consciousnessGate(analysis) {
    const gate = {
      timestamp: new Date().toISOString(),
      evaluations: {},
      allPassed: true,
      consciousnessLevel: 0,
      philosophy: null
    };

    // Temporarily disable strictMode for gate evaluation
    const originalStrictMode = this.config.strictMode;
    this.config.strictMode = false;

    // Evaluate clarity
    gate.evaluations.clarity = this.evaluateClarity(
      analysis.clarityScore || 0,
      { request: analysis.request, domain: analysis.domain }
    );
    if (!gate.evaluations.clarity.passed) {
      gate.allPassed = false;
    }

    // Evaluate complexity
    gate.evaluations.complexity = this.evaluateComplexity(
      analysis.complexityScore || 10,
      { components: analysis.components, integrations: analysis.integrations }
    );
    if (!gate.evaluations.complexity.passed) {
      gate.allPassed = false;
    }

    // Evaluate convergence (if we have generated code)
    if (analysis.convergenceScore !== undefined) {
      gate.evaluations.convergence = this.evaluateConvergence(
        analysis.convergenceScore,
        { code: analysis.code, intention: analysis.intention }
      );
      if (!gate.evaluations.convergence.passed) {
        gate.allPassed = false;
      }
    }

    // Restore strictMode
    this.config.strictMode = originalStrictMode;

    // Calculate consciousness level
    gate.consciousnessLevel = this._calculateConsciousnessLevel(gate.evaluations);
    gate.philosophy = this._getPhilosophicalSummary(gate);

    return gate;
  }

  /**
   * Generate refusal with full philosophical justification
   */
  _generateRefusal(refusalType, score, context) {
    return {
      type: refusalType.code,
      philosophy: refusalType.philosophy,
      score: score,
      threshold: refusalType.code === 'COMPLEXITY_REFUSAL'
        ? this.config.complexityThreshold
        : (refusalType.code === 'CLARITY_REFUSAL' ? this.config.clarityThreshold : this.config.convergenceThreshold),
      laBoetie: refusalType.laBoetie,
      magnusResponse: refusalType.magnusInverse,
      consciousnessCreated: refusalType.consciousnessCreated,
      consciousnessDimension: CONSCIOUSNESS_DIMENSIONS[refusalType.consciousnessCreated],
      message: this._formatRefusalMessage(refusalType, score),
      context: context
    };
  }

  /**
   * Format human-readable refusal message
   */
  _formatRefusalMessage(refusalType, score) {
    const threshold = refusalType.code === 'COMPLEXITY_REFUSAL'
      ? this.config.complexityThreshold
      : (refusalType.code === 'CLARITY_REFUSAL' ? this.config.clarityThreshold : this.config.convergenceThreshold);

    const operator = refusalType.code === 'COMPLEXITY_REFUSAL' ? '<=' : '>=';

    const dimension = CONSCIOUSNESS_DIMENSIONS[refusalType.consciousnessCreated];
    const dimensionName = dimension ? dimension.name : refusalType.consciousnessCreated;

    return `
[REFUSAL] ${refusalType.philosophy}

Score: ${score} | Required: ${operator} ${threshold}
Status: REFUSED

Philosophy: "${refusalType.laBoetie}"
Magnus: "${refusalType.magnusInverse}"

This refusal creates: ${dimensionName}
    `.trim();
  }

  /**
   * Generate clarification questions (not explanations)
   */
  _generateClarificationQuestions(context) {
    const questions = [];

    if (!context.domain || context.domain === 'general') {
      questions.push("What is the specific domain of this request?");
    }
    if (!context.constraints || context.constraints.length === 0) {
      questions.push("What are the technical constraints?");
    }
    if (!context.success_criteria) {
      questions.push("How will you measure success?");
    }
    if (!context.users) {
      questions.push("Who are the users of this system?");
    }
    if (!context.scale) {
      questions.push("What is the expected scale?");
    }

    // Always add at least one question
    if (questions.length === 0) {
      questions.push("What specific outcome do you need?");
    }

    return questions;
  }

  /**
   * Suggest decomposition for complex requests
   */
  _suggestDecomposition(context) {
    return {
      recommendation: 'Decompose into phases',
      phases: [
        { phase: 1, complexity: 4, description: 'Core foundation' },
        { phase: 2, complexity: 5, description: 'Primary features' },
        { phase: 3, complexity: 6, description: 'Integration layer' },
        { phase: 4, complexity: 7, description: 'Advanced features' }
      ],
      rationale: "Each phase remains within complexity threshold, enabling controlled delivery"
    };
  }

  /**
   * Suggest improvements for convergence
   */
  _suggestImprovements(context) {
    return {
      areas: [
        'Semantic alignment between intention and code',
        'Code quality metrics (error handling, documentation)',
        'Constraint satisfaction verification'
      ],
      action: 'Refine code to better match stated intention'
    };
  }

  /**
   * Record refusal in history
   */
  _recordRefusal(decision) {
    if (this.config.traceRefusals) {
      this.refusalHistory.push({
        ...decision,
        recordedAt: new Date().toISOString()
      });
    }
  }

  /**
   * Record consciousness event
   */
  _recordConsciousnessEvent(type, score) {
    const event = {
      type,
      score,
      timestamp: new Date().toISOString()
    };
    this.consciousnessEvents.push(event);
    return event;
  }

  /**
   * Calculate overall consciousness level (0-100)
   */
  _calculateConsciousnessLevel(evaluations) {
    let total = 0;
    let count = 0;

    if (evaluations.clarity) {
      total += evaluations.clarity.passed ? evaluations.clarity.score : evaluations.clarity.score * 0.5;
      count++;
    }
    if (evaluations.complexity) {
      // Invert complexity (lower is better)
      const complexityContribution = evaluations.complexity.passed
        ? (10 - evaluations.complexity.score) * 10
        : (10 - evaluations.complexity.score) * 5;
      total += complexityContribution;
      count++;
    }
    if (evaluations.convergence) {
      total += evaluations.convergence.passed ? evaluations.convergence.score : evaluations.convergence.score * 0.5;
      count++;
    }

    return count > 0 ? Math.round(total / count) : 0;
  }

  /**
   * Get philosophical summary of the gate result
   */
  _getPhilosophicalSummary(gate) {
    if (gate.allPassed) {
      return {
        state: 'CONSCIOUS_ORCHESTRATION',
        laBoetie: "La liberté commence quand on refuse la servitude volontaire.",
        magnus: "Tu as traversé la porte de la conscience. Tu es maintenant un orchestrateur conscient.",
        next: "Proceed with full awareness of your choices."
      };
    } else {
      const failures = Object.entries(gate.evaluations)
        .filter(([_, eval_]) => !eval_.passed)
        .map(([key, _]) => key);

      return {
        state: 'CONSCIOUSNESS_REQUIRED',
        laBoetie: "Les esclaves restent esclaves parce qu'ils n'affrontent jamais leurs chaînes.",
        magnus: `Affronte ces dimensions: ${failures.join(', ')}`,
        failures: failures,
        path: "Answer the questions. Accept the reality. Then proceed."
      };
    }
  }

  /**
   * Get refusal statistics
   */
  getStatistics() {
    const stats = {
      totalRefusals: this.refusalHistory.length,
      byType: {
        clarity: this.refusalHistory.filter(r => r.type === 'CLARITY_REFUSAL').length,
        complexity: this.refusalHistory.filter(r => r.type === 'COMPLEXITY_REFUSAL').length,
        convergence: this.refusalHistory.filter(r => r.type === 'CONVERGENCE_REFUSAL').length
      },
      consciousnessEvents: this.consciousnessEvents.length,
      config: this.config
    };

    return stats;
  }

  /**
   * Export state for persistence
   */
  exportState() {
    return {
      config: this.config,
      refusalHistory: this.refusalHistory,
      consciousnessEvents: this.consciousnessEvents,
      exportedAt: new Date().toISOString()
    };
  }

  /**
   * Import state from persistence
   */
  importState(state) {
    if (state.config) this.config = { ...this.config, ...state.config };
    if (state.refusalHistory) this.refusalHistory = state.refusalHistory;
    if (state.consciousnessEvents) this.consciousnessEvents = state.consciousnessEvents;
  }
}

// Custom error classes for strict refusals
class ClarityRefusalError extends Error {
  constructor(decision) {
    super(`CLARITY REFUSAL: Score ${decision.score} < ${decision.threshold}`);
    this.name = 'ClarityRefusalError';
    this.decision = decision;
  }
}

class ComplexityRefusalError extends Error {
  constructor(decision) {
    super(`COMPLEXITY REFUSAL: Score ${decision.score} > ${decision.threshold}`);
    this.name = 'ComplexityRefusalError';
    this.decision = decision;
  }
}

class ConvergenceRefusalError extends Error {
  constructor(decision) {
    super(`CONVERGENCE REFUSAL: Score ${decision.score} < ${decision.threshold}`);
    this.name = 'ConvergenceRefusalError';
    this.decision = decision;
  }
}

// Exports
export {
  LaBoetieRefusal,
  REFUSAL_TYPES,
  CONSCIOUSNESS_DIMENSIONS,
  REFUSAL_ANTI_PATTERNS,
  ClarityRefusalError,
  ComplexityRefusalError,
  ConvergenceRefusalError
};

export default LaBoetieRefusal;
