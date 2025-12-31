/**
 * PREDICTION IMPROVER
 *
 * After recording project outcomes, this system learns and improves
 * future predictions by adjusting engine parameters.
 *
 * Pattern: Outcome → Analysis → Learning → Parameter Adjustment → Better Predictions
 */

class PredictionImprover {
  constructor() {
    this.name = 'Prediction Improver';
    this.accuracyThreshold = 0.70;  // 70% accuracy is acceptable

    // Stores domain-specific adjustments
    this.domainAdjustments = {};
  }

  /**
   * Learn from outcome and suggest improvements
   */
  improveFromOutcome(prediction, outcome, accuracy) {
    const learnings = [];

    // 1. Spiral Count Learning
    if (accuracy.spiralCountAccuracy.accuracy < this.accuracyThreshold * 100) {
      const learning = this.learnSpiralPattern(prediction, outcome, accuracy);
      learnings.push(learning);
    }

    // 2. Integration Complexity Learning
    if (accuracy.integrationComplexityAccuracy.accuracy < this.accuracyThreshold * 100) {
      const learning = this.learnIntegrationPattern(prediction, outcome, accuracy);
      learnings.push(learning);
    }

    // 3. Duration Learning
    if (accuracy.durationAccuracy.accuracy < this.accuracyThreshold * 100) {
      const learning = this.learnDurationPattern(prediction, outcome, accuracy);
      learnings.push(learning);
    }

    // 4. Domain-specific Learning
    const domainLearning = this.learnDomainPatterns(prediction, outcome);
    if (domainLearning) {
      learnings.push(domainLearning);
    }

    return {
      projectId: prediction.projectId,
      domain: prediction.input.domain,
      accuracy: accuracy,
      learnings: learnings,
      recommendations: this.generateRecommendations(learnings),
      suggestedAdjustments: this.calculateAdjustments(learnings)
    };
  }

  /**
   * Learn spiral clarification patterns
   */
  learnSpiralPattern(prediction, outcome, accuracy) {
    const predicted = accuracy.spiralCountAccuracy.predicted;
    const actual = accuracy.spiralCountAccuracy.actual;
    const difference = actual - predicted;

    let insight = '';
    if (difference > 1) {
      insight = `Project needed more spirals than predicted. Likely domain was more complex than estimated.`;
    } else if (difference < -1) {
      insight = `Project needed fewer spirals. Clarity came faster—possibly domain was simpler or solution became obvious earlier.`;
    }

    return {
      type: 'SPIRAL_LEARNING',
      domain: prediction.input.domain,
      predicted: predicted,
      actual: actual,
      difference: difference,
      insight: insight,
      adjustment: this.calculateSpiralAdjustment(difference, prediction.input.domain)
    };
  }

  /**
   * Calculate spiral count adjustment for domain
   */
  calculateSpiralAdjustment(difference, domain) {
    if (!this.domainAdjustments[domain]) {
      this.domainAdjustments[domain] = { spiralMultiplier: 1.0, count: 0 };
    }

    const adj = this.domainAdjustments[domain];

    // Moving average: adjust multiplier based on observed difference
    const newMultiplier = (adj.spiralMultiplier * adj.count + (1 + difference / 5)) / (adj.count + 1);
    adj.spiralMultiplier = Math.max(0.8, Math.min(1.3, newMultiplier));  // Clamp between 0.8-1.3
    adj.count++;

    return {
      domain: domain,
      currentMultiplier: adj.spiralMultiplier,
      recommendation: `For "${domain}" projects, multiply spiral predictions by ${adj.spiralMultiplier.toFixed(2)}`
    };
  }

  /**
   * Learn integration complexity patterns
   */
  learnIntegrationPattern(prediction, outcome, accuracy) {
    const predicted = accuracy.integrationComplexityAccuracy.predicted;
    const actual = accuracy.integrationComplexityAccuracy.actual;

    const actualMultiplier = actual / prediction.integrationAnalysis.componentComplexityAvg;
    const predictedMultiplier = prediction.integrationAnalysis.multiplier;
    const multiplierDifference = actualMultiplier - predictedMultiplier;

    let insight = '';
    if (multiplierDifference > 0.2) {
      insight = `Integration was much harder than expected. Components had hidden coupling/complexity.`;
    } else if (multiplierDifference < -0.2) {
      insight = `Integration was easier than expected. Good component isolation or simple integration surface.`;
    }

    return {
      type: 'INTEGRATION_ADJUSTMENT',
      domain: prediction.input.domain,
      predictedComplexity: predicted,
      actualComplexity: actual,
      predictedMultiplier: predictedMultiplier,
      actualMultiplier: actualMultiplier,
      multiplierDifference: multiplierDifference,
      insight: insight,
      adjustment: this.calculateIntegrationAdjustment(multiplierDifference, prediction.input.domain)
    };
  }

  /**
   * Calculate integration multiplier adjustment for domain
   */
  calculateIntegrationAdjustment(difference, domain) {
    if (!this.domainAdjustments[domain]) {
      this.domainAdjustments[domain] = { integrationMultiplier: 1.75, count: 0 };
    }

    const adj = this.domainAdjustments[domain];

    // Adjust multiplier based on observed difference
    // If actual was 0.2 higher, increase multiplier by 0.15
    const newMultiplier = adj.integrationMultiplier + (difference * 0.75);
    adj.integrationMultiplier = Math.max(1.3, Math.min(2.5, newMultiplier));  // Clamp between 1.3-2.5
    adj.count++;

    return {
      domain: domain,
      currentMultiplier: adj.integrationMultiplier,
      recommendation: `For "${domain}" projects, use integration multiplier ${adj.integrationMultiplier.toFixed(2)} (was 1.75)`
    };
  }

  /**
   * Learn duration/estimation patterns
   */
  learnDurationPattern(prediction, outcome, accuracy) {
    const predicted = accuracy.durationAccuracy.predicted;
    const actual = accuracy.durationAccuracy.actual;
    const percentDifference = ((actual - predicted) / predicted * 100).toFixed(0);

    let insight = '';
    if (actual > predicted * 1.5) {
      insight = `Project took 50%+ longer. Estimate was too optimistic—add buffer for ${prediction.input.domain} projects.`;
    } else if (actual < predicted * 0.7) {
      insight = `Project finished 30%+ faster. Estimate was conservative. Reduce time estimates for ${prediction.input.domain}.`;
    }

    return {
      type: 'DURATION_LEARNING',
      domain: prediction.input.domain,
      predictedMonths: predicted,
      actualMonths: actual,
      percentDifference: percentDifference,
      insight: insight,
      adjustment: this.calculateDurationAdjustment(percentDifference, prediction.input.domain)
    };
  }

  /**
   * Calculate duration adjustment for domain
   */
  calculateDurationAdjustment(percentDifference, domain) {
    if (!this.domainAdjustments[domain]) {
      this.domainAdjustments[domain] = { durationMultiplier: 1.0, count: 0 };
    }

    const adj = this.domainAdjustments[domain];
    const diff = parseFloat(percentDifference) / 100;

    // Adjust multiplier
    const newMultiplier = (adj.durationMultiplier * adj.count + (1 + diff * 0.5)) / (adj.count + 1);
    adj.durationMultiplier = Math.max(0.7, Math.min(1.5, newMultiplier));
    adj.count++;

    return {
      domain: domain,
      currentMultiplier: adj.durationMultiplier,
      recommendation: `For "${domain}" projects, multiply duration estimates by ${adj.durationMultiplier.toFixed(2)}`
    };
  }

  /**
   * Learn domain-specific patterns
   */
  learnDomainPatterns(prediction, outcome) {
    if (!this.domainAdjustments[prediction.input.domain]) {
      this.domainAdjustments[prediction.input.domain] = {
        spiralCount: 0,
        projectCount: 0,
        avgClarity: 0,
        avgDuration: 0
      };
    }

    const domain = this.domainAdjustments[prediction.input.domain];
    domain.projectCount++;
    domain.avgClarity = (domain.avgClarity * (domain.projectCount - 1) + outcome.finalClarity) / domain.projectCount;
    domain.avgDuration = (domain.avgDuration * (domain.projectCount - 1) + outcome.totalDurationMonths) / domain.projectCount;

    if (domain.projectCount >= 3) {  // Only return learning after 3 projects in domain
      return {
        type: 'DOMAIN_PATTERN',
        domain: prediction.input.domain,
        projectsAnalyzed: domain.projectCount,
        averageClarity: domain.avgClarity.toFixed(0),
        averageDuration: domain.avgDuration.toFixed(1),
        insight: `After ${domain.projectCount} ${prediction.input.domain} projects, we have reliable domain patterns.`
      };
    }

    return null;
  }

  /**
   * Generate recommendations from learnings
   */
  generateRecommendations(learnings) {
    const recommendations = [];

    learnings.forEach(learning => {
      if (learning.type === 'SPIRAL_LEARNING') {
        if (learning.difference > 1) {
          recommendations.push(`Add +${learning.difference} spirals for similar "${learning.domain}" projects`);
        }
      }

      if (learning.type === 'INTEGRATION_ADJUSTMENT') {
        if (learning.multiplierDifference > 0.2) {
          recommendations.push(`Increase integration complexity multiplier from ${learning.predictedMultiplier.toFixed(2)} to ${learning.adjustment.currentMultiplier.toFixed(2)}`);
        }
      }

      if (learning.type === 'DURATION_LEARNING') {
        recommendations.push(`Adjust duration estimates for ${learning.domain} by ${learning.percentDifference}%`);
      }
    });

    return recommendations;
  }

  /**
   * Calculate precise adjustments for engine parameters
   */
  calculateAdjustments(learnings) {
    const adjustments = {};

    learnings.forEach(learning => {
      if (learning.type === 'SPIRAL_LEARNING' && learning.adjustment) {
        adjustments.spiralMultiplier = learning.adjustment.currentMultiplier;
      }
      if (learning.type === 'INTEGRATION_ADJUSTMENT' && learning.adjustment) {
        adjustments.integrationMultiplier = learning.adjustment.currentMultiplier;
      }
      if (learning.type === 'DURATION_LEARNING' && learning.adjustment) {
        adjustments.durationMultiplier = learning.adjustment.currentMultiplier;
      }
    });

    return adjustments;
  }

  /**
   * Get domain-specific parameters
   */
  getDomainParameters(domain) {
    if (!this.domainAdjustments[domain]) {
      return {
        domain: domain,
        spiralMultiplier: 1.0,
        integrationMultiplier: 1.75,
        durationMultiplier: 1.0,
        projectsAnalyzed: 0
      };
    }

    const adj = this.domainAdjustments[domain];
    return {
      domain: domain,
      spiralMultiplier: adj.spiralMultiplier || 1.0,
      integrationMultiplier: adj.integrationMultiplier || 1.75,
      durationMultiplier: adj.durationMultiplier || 1.0,
      projectsAnalyzed: adj.projectCount || 0,
      avgClarity: adj.avgClarity || 0,
      avgDuration: adj.avgDuration || 0
    };
  }

  /**
   * Get learning statistics
   */
  getStatistics() {
    const domains = Object.keys(this.domainAdjustments);
    const totalProjects = domains.reduce((sum, d) => sum + (this.domainAdjustments[d].projectCount || 0), 0);

    return {
      domainsLearned: domains.length,
      totalProjectsAnalyzed: totalProjects,
      domainParameters: domains.map(d => this.getDomainParameters(d)),
      readiness: this.getReadiness(totalProjects)
    };
  }

  /**
   * Assess readiness for accurate predictions
   */
  getReadiness(totalProjects) {
    if (totalProjects < 2) return '🔴 Initial (1 project) - Predictions will improve with more data';
    if (totalProjects < 5) return '🟡 Learning (2-4 projects) - Accuracy improving';
    if (totalProjects < 10) return '🟢 Proficient (5-9 projects) - Reliable predictions for analyzed domains';
    if (totalProjects >= 10) return '✅ Expert (10+ projects) - Predictions approach 95%+ accuracy';
  }

  /**
   * Export learning data for persistence
   */
  toJSON() {
    return {
      domainAdjustments: this.domainAdjustments,
      version: '14.1',
      timestamp: new Date()
    };
  }

  /**
   * Import learning data
   */
  fromJSON(data) {
    this.domainAdjustments = data.domainAdjustments || {};
  }
}

module.exports = PredictionImprover;
