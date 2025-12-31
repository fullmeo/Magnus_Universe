/**
 * MAGNUS 14 ORCHESTRATOR CORE
 *
 * The 6 engines work together to provide comprehensive project analysis.
 * This is your operating system becoming self-aware.
 *
 * Input: Project description + constraints
 * Output: Complete analysis of your signature applied to this project
 * Outcome: Personalized guidance based on how YOU work
 */

const SpiralClarificationEngine = require('./engines/spiral-clarification-engine');
const DomainFirstAnalyzer = require('./engines/domain-first-analyzer');
const POCValidatorEngine = require('./engines/poc-validator-engine');
const IntegrationComplexityPredictor = require('./engines/integration-complexity-predictor');
const SideProjectResolverEngine = require('./engines/side-project-resolver-engine');
const FrameworkEvolutionEngine = require('./engines/framework-evolution-engine');

class Magnus14 {
  constructor(options = {}) {
    this.name = 'Magnus 14 - Transcendental Signature Framework';
    this.version = '14.0.0';
    this.timestamp = new Date();

    // Store configuration
    this.storageDir = options.storageDir || null;

    // Initialize all 6 engines
    this.engines = {
      spiral: new SpiralClarificationEngine(),
      domain: new DomainFirstAnalyzer(),
      poc: new POCValidatorEngine(),
      integration: new IntegrationComplexityPredictor(),
      sideProject: new SideProjectResolverEngine(),
      framework: new FrameworkEvolutionEngine()
    };

    // In-memory storage
    this.projectHistory = [];
    this.predictions = [];
    this.outcomes = [];

    console.log(`\n${'═'.repeat(70)}`);
    console.log(`║ ${this.name.padEnd(68)} ║`);
    console.log(`║ ${`Version ${this.version} | ${this.timestamp.toISOString()}`.padEnd(68)} ║`);
    console.log(`${'═'.repeat(70)}\n`);
  }

  /**
   * Main analysis method: Analyzes a project through all 6 engines
   */
  analyzeProject(projectInput) {
    this.validateInput(projectInput);

    const projectId = this.generateProjectId(projectInput.projectName);

    console.log(`\n🧠 MAGNUS 14 ACTIVATING\n`);
    console.log(`📊 Analyzing project: "${projectInput.projectName}"`);
    console.log(`🌍 Domain: ${projectInput.domain || 'unspecified'}`);
    console.log(`📍 Project ID: ${projectId}\n`);

    // Run all 6 engines
    console.log('⚙️  Running 6 signature engines...\n');

    const analysis = {
      projectId: projectId,
      timestamp: new Date(),
      input: this.normalizeInput(projectInput),

      spiralAnalysis: this.engines.spiral.analyze(projectInput),
      domainAnalysis: this.engines.domain.analyze(projectInput),
      pocAnalysis: this.engines.poc.analyze(projectInput),
      integrationAnalysis: this.engines.integration.analyze(projectInput),
      sideProjectAnalysis: this.engines.sideProject.analyze(projectInput),
      frameworkAnalysis: this.engines.framework.analyze(projectInput, this.projectHistory)
    };

    // Calculate final integrated estimate
    analysis.finalEstimate = this.calculateFinalEstimate(analysis);

    // Store for learning
    this.predictions.push(analysis);
    this.projectHistory.push(projectInput);

    console.log('✅ Analysis complete\n');

    return analysis;
  }

  /**
   * Validate project input has minimum required fields
   */
  validateInput(projectInput) {
    if (!projectInput) {
      throw new Error('Project input required');
    }

    const required = ['projectName', 'description'];
    required.forEach(field => {
      if (!projectInput[field]) {
        throw new Error(`Required field missing: ${field}`);
      }
    });

    return true;
  }

  /**
   * Normalize input to ensure consistency
   */
  normalizeInput(input) {
    return {
      projectName: input.projectName || 'Untitled',
      domain: input.domain || 'general',
      description: input.description || '',
      currentClarity: input.currentClarity || 60,
      estimatedComplexity: input.estimatedComplexity || 5,
      components: input.components || [],
      blockers: input.blockers || [],
      teamSize: input.teamSize || 1,
      timeline: input.timeline || 'flexible'
    };
  }

  /**
   * Calculate integrated final estimate from all engines
   */
  calculateFinalEstimate(analysis) {
    // Parse month estimates
    const clarityMonths = this.extractMinMonths(analysis.spiralAnalysis.totalClarityTime);
    const pocMonths = this.extractMinMonths(analysis.pocAnalysis.pocDurationMonths);

    // Integration complexity is measured on 1-10 scale
    // Map to months (roughly 1 complexity point = 1 month of integration work)
    const integrationMonths = analysis.integrationAnalysis.integrationComplexity;

    // Total estimate
    const totalMonths = clarityMonths + pocMonths + integrationMonths;

    // Calculate confidence from all engines
    const engineConfidences = [
      analysis.spiralAnalysis.confidence,
      analysis.domainAnalysis.confidence,
      analysis.pocAnalysis.confidence,
      analysis.integrationAnalysis.confidence,
      analysis.sideProjectAnalysis.confidence,
      analysis.frameworkAnalysis.confidence
    ];

    const overallConfidence = engineConfidences.reduce((a, b) => a + b) / engineConfidences.length;

    return {
      clarityPhaseMonths: Math.round(clarityMonths * 10) / 10,
      pocPhaseMonths: Math.round(pocMonths * 10) / 10,
      integrationComplexityMonths: Math.round(integrationMonths * 10) / 10,
      totalEstimatedMonths: Math.round(totalMonths * 10) / 10,
      overallConfidence: Math.round(overallConfidence * 100),

      summary: `${Math.round(totalMonths)} month estimate with ${Math.round(overallConfidence)}% confidence`,

      breakdown: {
        'Clarification spirals': `${Math.round(clarityMonths * 10) / 10} months`,
        'POC validation': `${Math.round(pocMonths * 10) / 10} months`,
        'Integration complexity': `${Math.round(integrationMonths * 10) / 10} months`,
        'Total duration': `${Math.round(totalMonths * 10) / 10} months`
      }
    };
  }

  /**
   * Extract minimum month estimate from range string like "3-4 months"
   */
  extractMinMonths(estimate) {
    if (!estimate || typeof estimate !== 'string') return 1;
    const matches = estimate.match(/(\d+(?:\.\d+)?)/g);
    return matches && matches.length > 0 ? parseFloat(matches[0]) : 1;
  }

  /**
   * Generate unique project ID
   */
  generateProjectId(projectName) {
    const sanitized = projectName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    return `proj_${sanitized}_${Date.now()}`;
  }

  /**
   * Record actual outcome for a previously predicted project
   */
  recordOutcome(projectId, actualOutcome) {
    const prediction = this.predictions.find(p => p.projectId === projectId);
    if (!prediction) {
      throw new Error(`No prediction found for project ${projectId}`);
    }

    const accuracy = this.calculateAccuracy(prediction, actualOutcome);

    const outcomeRecord = {
      predictionId: projectId,
      prediction: prediction,
      actual: actualOutcome,
      accuracy: accuracy,
      timestamp: new Date(),
      learnings: this.extractLearnings(prediction, actualOutcome, accuracy)
    };

    this.outcomes.push(outcomeRecord);

    return outcomeRecord;
  }

  /**
   * Calculate accuracy of predictions vs actual
   */
  calculateAccuracy(prediction, actual) {
    return {
      spiralCountAccuracy: this.compareValues(
        prediction.spiralAnalysis.expectedSpiralCount,
        actual.actualSpiralCount,
        'spirals'
      ),
      integrationComplexityAccuracy: this.compareValues(
        prediction.integrationAnalysis.integrationComplexity,
        actual.actualIntegrationComplexity,
        'complexity'
      ),
      durationAccuracy: this.compareValues(
        prediction.finalEstimate.totalEstimatedMonths,
        actual.actualDurationMonths,
        'months'
      ),
      overallAccuracy: 0  // Calculated below
    };
  }

  /**
   * Compare predicted vs actual value
   */
  compareValues(predicted, actual, unit = '') {
    if (actual === 0 || actual === undefined) return 100;

    const diff = Math.abs(predicted - actual);
    const accuracy = Math.round(Math.max(0, 100 - (diff / actual) * 100));

    return {
      predicted: predicted,
      actual: actual,
      difference: Math.round((diff + Number.EPSILON) * 100) / 100,
      accuracy: accuracy,
      unit: unit,
      status: accuracy >= 80 ? '✅ Accurate' : accuracy >= 60 ? '⚠️  Close' : '❌ Off'
    };
  }

  /**
   * Extract learnings from outcome to improve future predictions
   */
  extractLearnings(prediction, outcome, accuracy) {
    const learnings = [];

    if (accuracy.spiralCountAccuracy.accuracy < 70) {
      learnings.push({
        type: 'SPIRAL_ADJUSTMENT',
        domain: prediction.input.domain,
        finding: `Spiral count off by ${accuracy.spiralCountAccuracy.difference}`,
        recommendation: `Adjust spiral predictions for ${prediction.input.domain} projects`
      });
    }

    if (accuracy.integrationComplexityAccuracy.accuracy < 70) {
      learnings.push({
        type: 'INTEGRATION_ADJUSTMENT',
        domain: prediction.input.domain,
        finding: `Integration multiplier should be adjusted`,
        recommendation: `Current multiplier: 1.75, actual appeared to be: ${outcome.actualIntegrationComplexity / prediction.integrationAnalysis.componentComplexityAvg}`
      });
    }

    if (accuracy.durationAccuracy.accuracy < 70) {
      learnings.push({
        type: 'DURATION_ADJUSTMENT',
        finding: `Duration estimate off by ${accuracy.durationAccuracy.difference} months`,
        recommendation: `Review why estimate deviated and adjust for similar future projects`
      });
    }

    return learnings;
  }

  /**
   * Get stored analysis for a project
   */
  getProjectAnalysis(projectId) {
    // First check in-memory predictions
    const inMemory = this.predictions.find(p => p.projectId === projectId);
    if (inMemory) {
      return inMemory;
    }

    // If not found in memory, try loading from storage
    if (!this.storageDir) {
      return undefined;
    }

    try {
      const fs = require('fs');
      const path = require('path');
      const filePath = path.join(this.storageDir, `${projectId}.json`);

      if (fs.existsSync(filePath)) {
        const analysis = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        // Cache it in memory for future use
        this.predictions.push(analysis);
        return analysis;
      }
    } catch (error) {
      // Silently fail - return undefined
    }

    return undefined;
  }

  /**
   * Get all analyses for a specific domain
   */
  getAnalysesByDomain(domain) {
    return this.predictions.filter(p => p.input.domain?.toLowerCase() === domain.toLowerCase());
  }

  /**
   * Get outcome for a project
   */
  getProjectOutcome(projectId) {
    return this.outcomes.find(o => o.predictionId === projectId);
  }

  /**
   * Get prediction accuracy across all projects
   */
  getAccuracyMetrics() {
    if (this.outcomes.length === 0) {
      return { status: 'No outcomes recorded yet' };
    }

    const spiralAccuracies = this.outcomes.map(o => o.accuracy.spiralCountAccuracy.accuracy);
    const integrationAccuracies = this.outcomes.map(o => o.accuracy.integrationComplexityAccuracy.accuracy);
    const durationAccuracies = this.outcomes.map(o => o.accuracy.durationAccuracy.accuracy);

    return {
      projectsAnalyzed: this.predictions.length,
      outcomesRecorded: this.outcomes.length,
      avgSpiralAccuracy: Math.round(spiralAccuracies.reduce((a, b) => a + b) / spiralAccuracies.length),
      avgIntegrationAccuracy: Math.round(integrationAccuracies.reduce((a, b) => a + b) / integrationAccuracies.length),
      avgDurationAccuracy: Math.round(durationAccuracies.reduce((a, b) => a + b) / durationAccuracies.length),
      improvementTrend: this.calculateImprovement()
    };
  }

  /**
   * Calculate if predictions are improving over time
   */
  calculateImprovement() {
    if (this.outcomes.length < 2) {
      return 'Insufficient data for trend analysis';
    }

    const first = this.outcomes[0].accuracy;
    const last = this.outcomes[this.outcomes.length - 1].accuracy;

    const firstAvg = (first.spiralCountAccuracy.accuracy + first.integrationComplexityAccuracy.accuracy + first.durationAccuracy.accuracy) / 3;
    const lastAvg = (last.spiralCountAccuracy.accuracy + last.integrationComplexityAccuracy.accuracy + last.durationAccuracy.accuracy) / 3;

    const improvement = lastAvg - firstAvg;

    if (improvement > 5) {
      return `✅ Improving (${improvement.toFixed(1)}% increase)`;
    } else if (improvement < -5) {
      return `⚠️  Declining (${improvement.toFixed(1)}%)`;
    } else {
      return `➡️  Stable (${improvement.toFixed(1)}%)`;
    }
  }

  /**
   * Generate comprehensive report for a project
   */
  generateReport(projectId) {
    const analysis = this.getProjectAnalysis(projectId);
    if (!analysis) {
      throw new Error(`No analysis found for project ${projectId}`);
    }

    const outcome = this.getProjectOutcome(projectId);

    return this.formatReport(analysis, outcome);
  }

  /**
   * Format analysis as readable report
   */
  formatReport(analysis, outcome = null) {
    // Handle timestamp - could be string or Date object
    const analyzeTime = typeof analysis.timestamp === 'string'
      ? analysis.timestamp
      : analysis.timestamp.toISOString();

    const outcomeTime = outcome && typeof outcome.timestamp === 'string'
      ? outcome.timestamp
      : outcome?.timestamp?.toISOString?.();

    let report = `
╔════════════════════════════════════════════════════════════════╗
║            MAGNUS 14 PROJECT ANALYSIS REPORT                  ║
╚════════════════════════════════════════════════════════════════╝

PROJECT: ${analysis.input.projectName}
DOMAIN: ${analysis.input.domain}
ANALYZED: ${analyzeTime}
PROJECT ID: ${analysis.projectId}

${outcome ? `
OUTCOME RECORDED:
  Status: ✅ Completed and evaluated
  Timestamp: ${outcomeTime}
` : ''}

─────────────────────────────────────────────────────────────────
📊 SPIRAL CLARIFICATION ANALYSIS
─────────────────────────────────────────────────────────────────
Current Clarity: ${analysis.input.currentClarity}%
Expected Spirals: ${analysis.spiralAnalysis.expectedSpiralCount}
Clarity Time: ${analysis.spiralAnalysis.totalClarityTime}
Expected Breakthrough: ${analysis.spiralAnalysis.breakthroughTiming}
Breakthrough Insight: "${analysis.spiralAnalysis.breakthroughInsight}"
Confidence: ${Math.round(analysis.spiralAnalysis.confidence * 100)}%

Spiral Progression:
${analysis.spiralAnalysis.spiralProgression.map(s =>
  `  Spiral ${s.depth}: ${s.expectedClarity}% clarity | Focus: ${s.focus}`
).join('\n')}

─────────────────────────────────────────────────────────────────
🎯 DOMAIN-FIRST ANALYSIS
─────────────────────────────────────────────────────────────────
Domain Complexity: ${analysis.domainAnalysis.domainComplexity}/10
Technical Complexity: ${analysis.domainAnalysis.technicalComplexity}/10
Real Blocker: ${analysis.domainAnalysis.realBlocker.toUpperCase()}
Ratio: ${analysis.domainAnalysis.blockerRatio}x
SME Required: ${analysis.domainAnalysis.smeRequired ? 'YES - ' + analysis.domainAnalysis.smeType : 'NO'}

Recommendation:
${analysis.domainAnalysis.recommendation}

Confidence: ${Math.round(analysis.domainAnalysis.confidence * 100)}%

─────────────────────────────────────────────────────────────────
⚡ POC VALIDATION ANALYSIS
─────────────────────────────────────────────────────────────────
POC Required: ${analysis.pocAnalysis.pocRequired ? 'YES' : 'NO'}
Critical Assumptions: ${analysis.pocAnalysis.criticalAssumptions.length}
${analysis.pocAnalysis.criticalAssumptions.length > 0 ?
`${analysis.pocAnalysis.criticalAssumptions.map((a, i) =>
  `  ${i + 1}. ${a.assumption} (${a.risk})`
).join('\n')}
` : ''}
POC Duration: ${analysis.pocAnalysis.pocDurationMonths}
Confidence Gain: ${analysis.pocAnalysis.confidenceGainIfValidated}

${analysis.pocAnalysis.recommendation}

Confidence: ${Math.round(analysis.pocAnalysis.confidence * 100)}%

─────────────────────────────────────────────────────────────────
🔧 INTEGRATION COMPLEXITY ANALYSIS
─────────────────────────────────────────────────────────────────
Component Count: ${analysis.integrationAnalysis.componentCount}
Avg Component Complexity: ${analysis.integrationAnalysis.componentComplexityAvg}/10
Integration Complexity: ${analysis.integrationAnalysis.integrationComplexity}/10
Multiplier: ×${analysis.integrationAnalysis.integrationMultiplier}
Underestimation Warning: ${Math.round(analysis.integrationAnalysis.underestimationWarning)} points
  (You'll likely underestimate by ${analysis.integrationAnalysis.percentUnderestimated}%)

${analysis.integrationAnalysis.recommendation}

Mitigation Strategies:
${analysis.integrationAnalysis.mitigationStrategy.recommended.map(m =>
  `  • ${m.name}: ${m.description}`
).join('\n')}

Confidence: ${Math.round(analysis.integrationAnalysis.confidence * 100)}%

─────────────────────────────────────────────────────────────────
🚀 SIDE PROJECT ANALYSIS
─────────────────────────────────────────────────────────────────
Expected Side Projects: ${analysis.sideProjectAnalysis.blockerCount}
${analysis.sideProjectAnalysis.sideProjectsNeeded.length > 0 ?
`Suggested Projects:
${analysis.sideProjectAnalysis.sideProjectsNeeded.map(s =>
  `  • ${s.suggestedSideProject} (resolve: "${s.mainBlocker}")`
).join('\n')}
` : ''}
${analysis.sideProjectAnalysis.recommendation}

Confidence: ${Math.round(analysis.sideProjectAnalysis.confidence * 100)}%

─────────────────────────────────────────────────────────────────
🌱 FRAMEWORK EVOLUTION ANALYSIS
─────────────────────────────────────────────────────────────────
Emerging Framework: ${analysis.frameworkAnalysis.emergingFramework}
Will Address: ${analysis.frameworkAnalysis.willAddress}
Trigger: ${analysis.frameworkAnalysis.triggerCondition}
Implementation: ${analysis.frameworkAnalysis.implementationTiming}

${analysis.frameworkAnalysis.recommendation}

Confidence: ${Math.round(analysis.frameworkAnalysis.confidence * 100)}%

─────────────────────────────────────────────────────────────────
📈 FINAL INTEGRATED ESTIMATE
─────────────────────────────────────────────────────────────────
${Object.entries(analysis.finalEstimate.breakdown).map(([key, value]) =>
  `${key.padEnd(25)} ${value}`
).join('\n')}

═════════════════════════════════════════════════════════════════
CONFIDENCE: ${analysis.finalEstimate.overallConfidence}%
SUMMARY: ${analysis.finalEstimate.summary}
═════════════════════════════════════════════════════════════════
`;

    if (outcome) {
      report += `

OUTCOME ACCURACY:
Spiral Count: ${outcome.accuracy.spiralCountAccuracy.status}
  Predicted: ${outcome.accuracy.spiralCountAccuracy.predicted} spirals
  Actual: ${outcome.accuracy.spiralCountAccuracy.actual} spirals
  Accuracy: ${outcome.accuracy.spiralCountAccuracy.accuracy}%

Integration Complexity: ${outcome.accuracy.integrationComplexityAccuracy.status}
  Predicted: ${outcome.accuracy.integrationComplexityAccuracy.predicted}/10
  Actual: ${outcome.accuracy.integrationComplexityAccuracy.actual}/10
  Accuracy: ${outcome.accuracy.integrationComplexityAccuracy.accuracy}%

Duration: ${outcome.accuracy.durationAccuracy.status}
  Predicted: ${outcome.accuracy.durationAccuracy.predicted} months
  Actual: ${outcome.accuracy.durationAccuracy.actual} months
  Accuracy: ${outcome.accuracy.durationAccuracy.accuracy}%
`;

      if (outcome.learnings.length > 0) {
        report += `

LEARNINGS FOR FUTURE PROJECTS:
${outcome.learnings.map(l =>
  `• ${l.type}: ${l.finding}
  Recommendation: ${l.recommendation}`
).join('\n')}
`;
      }
    }

    report += `\n🧠 Your operating system is now visible to itself. ✨\n`;

    return report;
  }

  /**
   * Export for storage/persistence
   */
  toJSON() {
    return {
      version: this.version,
      timestamp: this.timestamp,
      projectHistory: this.projectHistory,
      predictions: this.predictions,
      outcomes: this.outcomes
    };
  }
}

module.exports = Magnus14;
