/**
 * Magnus Confidence Scorer
 * 
 * Unified confidence scoring system for Magnus Scanner 14.0
 * 
 * Features:
 * - Multi-factor confidence calculation
 * - Cross-detector validation
 * - Bias adjustment integration
 * - Historical learning
 * - Recommendation prioritization
 * 
 * Combines signals from:
 * - PatternDetector (occurrence frequency, cross-project)
 * - FrictionDetector (severity, recurrence)
 * - AbandonmentDetector (cause confidence, recoverability)
 * - BiasDetector (bias warnings, false positive risk)
 */

class ConfidenceScorer {
  constructor(config = {}) {
    this.config = {
      minConfidence: config.minConfidence || 0.5,
      highConfidenceThreshold: config.highConfidenceThreshold || 0.8,
      biasDetector: config.biasDetector || null,
      learningEnabled: config.learningEnabled !== false
    };

    this.history = {
      scores: [],
      outcomes: [],
      adjustments: new Map()
    };

    this.weights = {
      // Pattern scoring weights
      pattern: {
        occurrenceCount: 0.3,
        crossProject: 0.25,
        syntacticSimilarity: 0.2,
        codeQuality: 0.15,
        impact: 0.1
      },
      
      // Friction scoring weights
      friction: {
        severity: 0.35,
        recurrence: 0.3,
        timeWasted: 0.2,
        affectedProjects: 0.15
      },
      
      // Abandonment scoring weights
      abandonment: {
        causeConfidence: 0.4,
        recoverability: 0.3,
        progressLevel: 0.2,
        timeInvested: 0.1
      }
    };
  }

  /**
   * Score a pattern from PatternDetector
   */
  scorePattern(pattern, biasCheck = null) {
    const factors = {
      occurrenceCount: this.scoreOccurrenceCount(pattern.occurrences?.length || 0),
      crossProject: this.scoreCrossProject(pattern.projects?.size || 0),
      syntacticSimilarity: pattern.confidence || 0.7,
      codeQuality: this.scoreCodeQuality(pattern),
      impact: this.scoreImpact(pattern.impact)
    };

    // Calculate base confidence
    let confidence = this.weightedSum(factors, this.weights.pattern);

    // Apply type-specific multiplier
    confidence *= this.getPatternTypeMultiplier(pattern.type);

    // Apply bias adjustment if available
    if (biasCheck) {
      confidence = this.applyBiasAdjustment(confidence, biasCheck);
    }

    // Apply historical learning
    if (this.config.learningEnabled) {
      confidence = this.applyHistoricalLearning(confidence, 'PATTERN', pattern);
    }

    // Record score
    this.recordScore('PATTERN', pattern, confidence, factors);

    return {
      confidence: Math.min(1.0, Math.max(0.0, confidence)),
      level: this.getConfidenceLevel(confidence),
      factors,
      reasoning: this.generateReasoning('PATTERN', factors, confidence)
    };
  }

  /**
   * Score a friction point from FrictionDetector
   */
  scoreFriction(friction) {
    const factors = {
      severity: this.scoreFrictionSeverity(friction.severity),
      recurrence: this.scoreRecurrence(friction.recurringProblems),
      timeWasted: this.scoreTimeWasted(friction.estimatedTimeWasted),
      affectedProjects: this.scoreAffectedProjects(friction.frictionPoints)
    };

    // Calculate base confidence
    let confidence = this.weightedSum(factors, this.weights.friction);

    // Apply friction type multiplier
    confidence *= this.getFrictionTypeMultiplier(friction.frictionPoints);

    // Apply historical learning
    if (this.config.learningEnabled) {
      confidence = this.applyHistoricalLearning(confidence, 'FRICTION', friction);
    }

    // Record score
    this.recordScore('FRICTION', friction, confidence, factors);

    return {
      confidence: Math.min(1.0, Math.max(0.0, confidence)),
      level: this.getConfidenceLevel(confidence),
      factors,
      reasoning: this.generateReasoning('FRICTION', factors, confidence)
    };
  }

  /**
   * Score an abandonment from AbandonmentDetector
   */
  scoreAbandonment(abandonment) {
    const factors = {
      causeConfidence: abandonment.cause?.confidence || 0.5,
      recoverability: this.scoreRecoverability(abandonment.recoverable),
      progressLevel: abandonment.progress?.completeness / 100 || 0,
      timeInvested: this.scoreTimeInvested(abandonment.wastedEffort)
    };

    // Calculate base confidence
    let confidence = this.weightedSum(factors, this.weights.abandonment);

    // Apply cause type multiplier
    confidence *= this.getCauseTypeMultiplier(abandonment.cause?.type);

    // Apply historical learning
    if (this.config.learningEnabled) {
      confidence = this.applyHistoricalLearning(confidence, 'ABANDONMENT', abandonment);
    }

    // Record score
    this.recordScore('ABANDONMENT', abandonment, confidence, factors);

    return {
      confidence: Math.min(1.0, Math.max(0.0, confidence)),
      level: this.getConfidenceLevel(confidence),
      factors,
      reasoning: this.generateReasoning('ABANDONMENT', factors, confidence)
    };
  }

  /**
   * Score occurrence count
   */
  scoreOccurrenceCount(count) {
    if (count >= 10) return 1.0;
    if (count >= 7) return 0.9;
    if (count >= 5) return 0.8;
    if (count >= 3) return 0.6;
    if (count >= 2) return 0.4;
    return 0.2;
  }

  /**
   * Score cross-project presence
   */
  scoreCrossProject(projectCount) {
    if (projectCount >= 5) return 1.0;
    if (projectCount >= 3) return 0.9;
    if (projectCount >= 2) return 0.7;
    if (projectCount >= 1) return 0.4;
    return 0.1;
  }

  /**
   * Score code quality indicators
   */
  scoreCodeQuality(pattern) {
    let score = 0.5; // Base score

    if (pattern.occurrences) {
      // Check for comments
      const hasComments = pattern.occurrences.some(o => 
        o.context?.hasComment
      );
      if (hasComments) score += 0.2;

      // Check for consistent naming
      const names = pattern.occurrences.map(o => o.name).filter(Boolean);
      const uniqueNames = new Set(names);
      if (uniqueNames.size === 1 && names.length > 1) {
        score += 0.2; // Consistent naming
      }

      // Check for type safety indicators
      const hasTypes = pattern.representative?.includes('interface') ||
                      pattern.representative?.includes('type ') ||
                      pattern.representative?.includes(': ');
      if (hasTypes) score += 0.1;
    }

    return Math.min(1.0, score);
  }

  /**
   * Score impact estimation
   */
  scoreImpact(impact) {
    if (!impact) return 0.5;

    const roi = impact.potentialROI;
    if (roi === 'HIGH') return 1.0;
    if (roi === 'MEDIUM') return 0.7;
    if (roi === 'LOW') return 0.4;

    // Fallback to occurrences
    const occurrences = impact.occurrences || 0;
    return Math.min(1.0, occurrences / 10);
  }

  /**
   * Get pattern type confidence multiplier
   */
  getPatternTypeMultiplier(type) {
    const multipliers = {
      'API_ROUTE': 1.0,           // Very reliable
      'ERROR_HANDLING': 0.95,     // Highly reliable
      'IMPORTS': 0.9,             // Reliable
      'STATE_MANAGEMENT': 0.9,    // Reliable
      'REACT_HOOK': 0.85,         // Moderately reliable
      'FUNCTION': 0.8,            // Context-dependent
      'CLASS': 0.75               // More variable
    };

    return multipliers[type] || 0.8;
  }

  /**
   * Score friction severity
   */
  scoreFrictionSeverity(severity) {
    if (severity === 'HIGH') return 1.0;
    if (severity === 'MEDIUM') return 0.7;
    if (severity === 'LOW') return 0.4;
    return 0.5;
  }

  /**
   * Score recurrence
   */
  scoreRecurrence(recurringProblems) {
    if (!recurringProblems || recurringProblems.length === 0) {
      return 0.3; // No recurrence = lower confidence it's a real pattern
    }

    const maxOccurrences = Math.max(
      ...recurringProblems.map(p => p.occurrences)
    );

    if (maxOccurrences >= 5) return 1.0;
    if (maxOccurrences >= 3) return 0.8;
    if (maxOccurrences >= 2) return 0.6;
    return 0.4;
  }

  /**
   * Score time wasted
   */
  scoreTimeWasted(minutes) {
    if (!minutes) return 0.3;

    const hours = minutes / 60;
    
    if (hours >= 8) return 1.0;   // Full day
    if (hours >= 4) return 0.9;   // Half day
    if (hours >= 2) return 0.8;   // Significant
    if (hours >= 1) return 0.6;   // Noticeable
    return 0.4;
  }

  /**
   * Score affected projects
   */
  scoreAffectedProjects(frictionPoints) {
    if (!frictionPoints) return 0.5;

    const projects = new Set(frictionPoints.map(f => f.project));
    const count = projects.size;

    if (count >= 4) return 1.0;
    if (count >= 3) return 0.9;
    if (count >= 2) return 0.7;
    if (count >= 1) return 0.5;
    return 0.3;
  }

  /**
   * Get friction type confidence multiplier
   */
  getFrictionTypeMultiplier(frictionPoints) {
    if (!frictionPoints || frictionPoints.length === 0) {
      return 0.7;
    }

    // Count friction types
    const types = {};
    for (const point of frictionPoints) {
      types[point.type] = (types[point.type] || 0) + 1;
    }

    // Get most common type
    const mostCommon = Object.entries(types)
      .sort((a, b) => b[1] - a[1])[0];

    const multipliers = {
      'SETUP_FRICTION': 1.0,        // Very clear signal
      'INTEGRATION_FRICTION': 0.95,  // Clear signal
      'DEPLOYMENT_FRICTION': 0.9,    // Clear signal
      'TESTING_FRICTION': 0.85,      // Moderately clear
      'CONFIGURATION_FRICTION': 0.8, // Moderately clear
      'BUG_FIX': 0.7,               // Could be anything
      'BLOCKED_WORK': 0.85,          // Clear but varied
      'GENERAL_FRICTION': 0.6        // Vague
    };

    return multipliers[mostCommon?.[0]] || 0.7;
  }

  /**
   * Score recoverability
   */
  scoreRecoverability(recoverable) {
    if (!recoverable) return 0.5;

    const base = recoverable.recoverable ? 0.8 : 0.3;
    const confidence = recoverable.confidence || 0.5;

    return base * confidence;
  }

  /**
   * Score time invested
   */
  scoreTimeInvested(wastedEffort) {
    if (!wastedEffort) return 0.5;

    const hours = wastedEffort.estimatedHours || 0;
    
    // Higher time = higher confidence it was real work
    if (hours >= 40) return 1.0;   // Week+
    if (hours >= 20) return 0.9;   // Multiple days
    if (hours >= 10) return 0.8;   // Day+
    if (hours >= 5) return 0.6;    // Half day
    return 0.4;
  }

  /**
   * Get cause type confidence multiplier
   */
  getCauseTypeMultiplier(causeType) {
    const multipliers = {
      'SETUP_FRICTION': 1.0,         // Very clear cause
      'INTEGRATION_FAILURE': 0.95,   // Very clear
      'BLOCKED_WORK': 0.9,           // Clear signal
      'TECHNICAL_DEBT': 0.85,        // Clear from metrics
      'COMPLEXITY_CREEP': 0.8,       // Detectable pattern
      'SCOPE_CREEP': 0.75,           // Harder to prove
      'LOST_INTEREST': 0.7,          // Inferred
      'UNKNOWN': 0.4                 // Low confidence
    };

    return multipliers[causeType] || 0.7;
  }

  /**
   * Apply bias adjustment from BiasDetector
   */
  applyBiasAdjustment(confidence, biasCheck) {
    if (!biasCheck || !biasCheck.warnings) {
      return confidence;
    }

    let adjustment = 1.0;

    for (const warning of biasCheck.warnings) {
      switch (warning.type) {
        case 'CONFIRMATION_BIAS':
          adjustment *= 0.9; // Reduce 10%
          break;
        case 'FALSE_NEGATIVE':
          adjustment *= 0.85; // Reduce 15%
          break;
        case 'SYNTACTIC_SIMILARITY':
          adjustment *= 0.8; // Reduce 20%
          break;
        case 'QUANTITY_OVER_QUALITY':
          adjustment *= 0.75; // Reduce 25%
          break;
        case 'SUCCESS_BLINDNESS':
          adjustment *= 1.1; // Increase 10% (found good pattern)
          break;
        case 'RESEARCH_CODE':
          adjustment *= 0.3; // Heavy reduction (preserve!)
          break;
      }
    }

    return confidence * adjustment;
  }

  /**
   * Apply historical learning
   */
  applyHistoricalLearning(confidence, type, item) {
    // Check if we have history for this type of item
    const key = this.generateItemKey(type, item);
    
    if (this.history.adjustments.has(key)) {
      const adjustment = this.history.adjustments.get(key);
      return confidence * adjustment;
    }

    return confidence;
  }

  /**
   * Generate item key for learning
   */
  generateItemKey(type, item) {
    switch (type) {
      case 'PATTERN':
        return `pattern:${item.type}:${item.name}`;
      case 'FRICTION':
        return `friction:${item.frictionPoints?.[0]?.type}`;
      case 'ABANDONMENT':
        return `abandonment:${item.cause?.type}`;
      default:
        return `unknown:${type}`;
    }
  }

  /**
   * Calculate weighted sum
   */
  weightedSum(factors, weights) {
    let sum = 0;
    let totalWeight = 0;

    for (const [key, value] of Object.entries(factors)) {
      if (weights[key] !== undefined) {
        sum += value * weights[key];
        totalWeight += weights[key];
      }
    }

    return totalWeight > 0 ? sum / totalWeight : 0.5;
  }

  /**
   * Get confidence level label
   */
  getConfidenceLevel(confidence) {
    if (confidence >= this.config.highConfidenceThreshold) {
      return 'HIGH';
    } else if (confidence >= this.config.minConfidence) {
      return 'MEDIUM';
    } else {
      return 'LOW';
    }
  }

  /**
   * Generate human-readable reasoning
   */
  generateReasoning(type, factors, finalConfidence) {
    const reasoning = [];

    // Sort factors by contribution
    const sorted = Object.entries(factors)
      .map(([name, value]) => ({
        name,
        value,
        weight: this.weights[type.toLowerCase()]?.[name] || 0,
        contribution: value * (this.weights[type.toLowerCase()]?.[name] || 0)
      }))
      .sort((a, b) => b.contribution - a.contribution);

    // Add top 3 factors
    for (const factor of sorted.slice(0, 3)) {
      if (factor.contribution > 0.1) {
        const percentage = (factor.contribution * 100).toFixed(0);
        reasoning.push(
          `${this.formatFactorName(factor.name)} (${percentage}% contribution)`
        );
      }
    }

    return reasoning;
  }

  /**
   * Format factor name for display
   */
  formatFactorName(name) {
    return name
      .replace(/([A-Z])/g, ' $1')
      .toLowerCase()
      .trim()
      .split(' ')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');
  }

  /**
   * Record score for learning
   */
  recordScore(type, item, confidence, factors) {
    this.history.scores.push({
      type,
      item: this.generateItemKey(type, item),
      confidence,
      factors,
      timestamp: Date.now()
    });

    // Keep only last 1000 scores
    if (this.history.scores.length > 1000) {
      this.history.scores = this.history.scores.slice(-1000);
    }
  }

  /**
   * Record outcome for learning (was the recommendation good?)
   */
  recordOutcome(type, item, wasAccurate, userFeedback = null) {
    const key = this.generateItemKey(type, item);
    
    this.history.outcomes.push({
      type,
      item: key,
      wasAccurate,
      userFeedback,
      timestamp: Date.now()
    });

    // Update adjustment factor
    this.updateAdjustment(key, wasAccurate);
  }

  /**
   * Update adjustment factor based on outcomes
   */
  updateAdjustment(key, wasAccurate) {
    // Get current adjustment (default 1.0)
    const current = this.history.adjustments.get(key) || 1.0;

    // Calculate new adjustment
    // If accurate: increase confidence slightly (up to 1.2)
    // If inaccurate: decrease confidence (down to 0.6)
    const delta = wasAccurate ? 0.05 : -0.1;
    const newAdjustment = Math.max(0.6, Math.min(1.2, current + delta));

    this.history.adjustments.set(key, newAdjustment);
  }

  /**
   * Get statistics
   */
  getStatistics() {
    return {
      totalScores: this.history.scores.length,
      totalOutcomes: this.history.outcomes.length,
      adjustments: this.history.adjustments.size,
      
      averageConfidence: this.calculateAverageConfidence(),
      accuracyRate: this.calculateAccuracyRate(),
      
      byType: this.getStatsByType()
    };
  }

  /**
   * Calculate average confidence across all scores
   */
  calculateAverageConfidence() {
    if (this.history.scores.length === 0) return 0;

    const sum = this.history.scores.reduce(
      (total, score) => total + score.confidence, 0
    );
    
    return (sum / this.history.scores.length).toFixed(3);
  }

  /**
   * Calculate accuracy rate (when outcomes are recorded)
   */
  calculateAccuracyRate() {
    if (this.history.outcomes.length === 0) return null;

    const accurate = this.history.outcomes.filter(o => o.wasAccurate).length;
    
    return ((accurate / this.history.outcomes.length) * 100).toFixed(1) + '%';
  }

  /**
   * Get statistics by type
   */
  getStatsByType() {
    const stats = {
      PATTERN: { count: 0, avgConfidence: 0 },
      FRICTION: { count: 0, avgConfidence: 0 },
      ABANDONMENT: { count: 0, avgConfidence: 0 }
    };

    for (const score of this.history.scores) {
      if (stats[score.type]) {
        stats[score.type].count++;
        stats[score.type].avgConfidence += score.confidence;
      }
    }

    // Calculate averages
    for (const [type, data] of Object.entries(stats)) {
      if (data.count > 0) {
        data.avgConfidence = (data.avgConfidence / data.count).toFixed(3);
      }
    }

    return stats;
  }

  /**
   * Reset scorer
   */
  reset() {
    this.history = {
      scores: [],
      outcomes: [],
      adjustments: new Map()
    };
  }

  /**
   * Export history for persistence
   */
  exportHistory() {
    return {
      scores: this.history.scores,
      outcomes: this.history.outcomes,
      adjustments: Array.from(this.history.adjustments.entries())
    };
  }

  /**
   * Import history from persistence
   */
  importHistory(data) {
    if (data.scores) {
      this.history.scores = data.scores;
    }
    if (data.outcomes) {
      this.history.outcomes = data.outcomes;
    }
    if (data.adjustments) {
      this.history.adjustments = new Map(data.adjustments);
    }
  }
}

export default ConfidenceScorer;
