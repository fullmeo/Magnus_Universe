/**
 * POC VALIDATOR ENGINE
 *
 * Identifies critical assumptions that need validation before full commitment.
 * Recommends proof-of-concept approach for high-risk elements.
 *
 * Core Pattern:
 * - 1-2 session POC saves 6-12 months of development
 * - Validates highest-risk assumptions first
 * - Confidence multiplier: 3-4x after successful POC
 */

class POCValidatorEngine {
  constructor() {
    this.name = 'POC Validator Engine';
    this.version = '14.1';
  }

  analyze(projectInput) {
    const criticalAssumptions = this.extractCriticalAssumptions(projectInput);
    const pocRequired = criticalAssumptions.length > 0;

    return {
      criticalAssumptions: criticalAssumptions,
      pocRequired: pocRequired,
      pocCount: Math.ceil(criticalAssumptions.length / 2),
      pocDurationSessions: Math.min(criticalAssumptions.length, 3),
      pocDurationMonths: this.estimatePOCDuration(criticalAssumptions.length),
      confidenceGainIfValidated: this.calculateConfidenceGain(criticalAssumptions.length),

      pocPlan: this.generatePOCPlan(criticalAssumptions),
      priorityOrder: this.prioritizeAssumptions(criticalAssumptions),

      recommendation: this.generateRecommendation(pocRequired, criticalAssumptions),

      confidence: 0.90
    };
  }

  extractCriticalAssumptions(projectInput) {
    const assumptions = [];
    const text = `${projectInput.description || ''} ${projectInput.blockers?.map(b => b.description).join(' ') || ''}`.toLowerCase();

    // Pattern-based critical assumption extraction
    const patterns = [
      {
        keywords: ['real-time', 'latency', '<100ms'],
        assumption: 'Can we achieve required real-time latency (<100ms)?',
        risk: 'CRITICAL',
        validation: 'Build 1-session latency benchmark POC'
      },
      {
        keywords: ['ai', 'ml', 'machine learning', 'neural', 'accuracy'],
        assumption: 'Can ML models achieve required accuracy (>85%)?',
        risk: 'CRITICAL',
        validation: 'Train on representative dataset, test accuracy'
      },
      {
        keywords: ['blockchain', 'crypto', 'web3', 'smart contract'],
        assumption: 'Is blockchain necessary vs traditional database?',
        risk: 'HIGH',
        validation: 'Compare blockchain vs centralized data model'
      },
      {
        keywords: ['scale', 'scalable', '10000 users', 'concurrent'],
        assumption: 'Can system scale to required user load?',
        risk: 'HIGH',
        validation: 'Load test core components at 10x expected load'
      },
      {
        keywords: ['adaptive', 'personalization', 'learn', 'predict'],
        assumption: 'Can we reliably detect patterns in user behavior?',
        risk: 'HIGH',
        validation: 'Implement pattern detection on sample data'
      },
      {
        keywords: ['music', 'accompaniment', 'automatic', 'generation'],
        assumption: 'Can we systematize domain knowledge (e.g., music theory)?',
        risk: 'CRITICAL',
        validation: 'Build domain framework POC'
      },
      {
        keywords: ['automatic', 'automation', 'detect', 'recognize'],
        assumption: 'Can automation achieve human-level quality?',
        risk: 'HIGH',
        validation: 'Compare automated output vs human baseline'
      },
      {
        keywords: ['api', 'integration', 'third-party', 'service'],
        assumption: 'Can external services handle our requirements?',
        risk: 'MEDIUM',
        validation: 'Integrate with API, test rate limits + reliability'
      }
    ];

    patterns.forEach(pattern => {
      const hasKeyword = pattern.keywords.some(kw => text.includes(kw));
      if (hasKeyword && !assumptions.some(a => a.assumption === pattern.assumption)) {
        assumptions.push({
          assumption: pattern.assumption,
          risk: pattern.risk,
          validation: pattern.validation,
          pocFocus: pattern.keywords[0]
        });
      }
    });

    return assumptions;
  }

  generatePOCPlan(assumptions) {
    if (assumptions.length === 0) {
      return 'No critical assumptions requiring POC validation.';
    }

    const pocItems = assumptions.map((a, i) => {
      return `POC ${i + 1}: ${a.assumption}
  Validation: ${a.validation}
  Duration: 1 session
  Risk: ${a.risk}`;
    }).join('\n\n');

    return `POC Plan:

${pocItems}

Total POC Time: ${assumptions.length} sessions (1-3 weeks)
Expected Outcome: 3-4x confidence multiplier on each validated assumption`;
  }

  prioritizeAssumptions(assumptions) {
    const riskScores = { 'CRITICAL': 3, 'HIGH': 2, 'MEDIUM': 1 };
    const sorted = [...assumptions].sort((a, b) => riskScores[b.risk] - riskScores[a.risk]);
    return sorted.map((a, i) => ({ order: i + 1, ...a }));
  }

  estimatePOCDuration(assumptionCount) {
    if (assumptionCount === 0) return '0 weeks';
    if (assumptionCount <= 2) return '1-2 weeks';
    if (assumptionCount <= 4) return '2-4 weeks';
    return `${Math.ceil(assumptionCount / 2)}-${Math.ceil(assumptionCount)} weeks`;
  }

  calculateConfidenceGain(assumptionCount) {
    const baseGain = 30;
    const totalGain = Math.min(baseGain * assumptionCount, 300);
    return `${totalGain}% confidence increase per validated assumption`;
  }

  generateRecommendation(pocRequired, assumptions) {
    if (!pocRequired) {
      return `No critical assumptions detected. Proceed directly to development with standard risk mitigation.`;
    }

    if (assumptions.length <= 2) {
      return `Few critical assumptions (${assumptions.length}).

Recommended: Build quick 1-session POC for each before full commitment.
Time investment: 1-2 weeks
Confidence gain: 3-4x`;

    } else {
      return `Multiple critical assumptions (${assumptions.length}).

Recommended: Sequential POC approach
- POC 1: Highest-risk assumption (${assumptions[0]?.assumption})
- POC 2: Second-highest risk
- Use learnings from earlier POCs to inform later ones

Time investment: 2-${Math.ceil(assumptions.length)} weeks
Expected outcome: Major risk mitigation before full development`;
    }
  }
}

module.exports = POCValidatorEngine;
