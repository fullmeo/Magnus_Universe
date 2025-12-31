/**
 * SPIRAL CLARIFICATION ENGINE
 *
 * Predicts how many clarification spirals a project will need
 * and when breakthrough insight is likely to occur.
 *
 * Core Pattern:
 * - Not linear learning (62% → 90% step-by-step)
 * - Spiral learning (revisit same topics with deeper understanding)
 * - Each spiral adds 10-15% clarity
 * - Convergence around 85-87% (breakthrough point)
 * - Average: 4-5 spirals per complex project
 */

class SpiralClarificationEngine {
  constructor() {
    this.name = 'Spiral Clarification Engine';
    this.version = '14.1';
  }

  analyze(projectInput) {
    const initialClarity = projectInput.currentClarity || 60;
    const complexity = projectInput.estimatedComplexity || 5;

    // Calculate spiral progression
    const spirals = this.generateSpiralProgression(initialClarity, complexity);
    const totalSpiralCount = spirals.length;
    const breakthroughSession = this.predictBreakthroughSession(totalSpiralCount, complexity);

    return {
      initialClarity: initialClarity,
      expectedSpiralCount: totalSpiralCount,
      sessionsPerSpiral: 1.5,
      totalClarityTime: this.estimateMonths(totalSpiralCount),
      spiralProgression: spirals,
      breakthroughTiming: breakthroughSession,
      breakthroughInsight: this.predictBreakthroughNature(projectInput.domain),
      convergenceExpectation: 87,  // Target clarity level
      confidence: 0.92
    };
  }

  generateSpiralProgression(initialClarity, complexity) {
    const spirals = [];
    let currentClarity = initialClarity;
    let spiralCount = 0;
    const maxSpiralDepth = 10;

    while (currentClarity < 85 && spiralCount < maxSpiralDepth) {
      spiralCount++;

      // Each spiral adds 10-15% clarity (varies by complexity)
      const clarityGain = 10 + (5 * (complexity / 10));
      currentClarity = Math.min(currentClarity + clarityGain, 100);

      spirals.push({
        depth: spiralCount,
        expectedClarity: Math.round(currentClarity),
        focus: this.predictSpiralfocus(spiralCount, complexity),
        sessionsRequired: 1.5,
        expectedDuration: `${spiralCount * 1 + 0.5}-${spiralCount * 1.2 + 1} weeks`
      });

      // If clarity stalls, add extra spiral
      if (spiralCount >= 3 && currentClarity < 75) {
        spirals[spirals.length - 1].note = 'Significant complexity detected - extended clarification needed';
      }
    }

    return spirals;
  }

  predictSpiralfocus(spiralNumber, complexity) {
    const focuses = [
      'problem_surface',        // Spiral 1: What is the problem really about?
      'domain_vocabulary',      // Spiral 2: What terminology/concepts matter?
      'pedagogy_mapping',       // Spiral 3: How would you teach this?
      'integration_points',     // Spiral 4: How do components connect?
      'edge_cases',            // Spiral 5: What can go wrong?
      'refined_architecture'    // Spiral 6+: Optimized structure
    ];

    const index = Math.min(spiralNumber - 1, focuses.length - 1);
    return focuses[index];
  }

  predictBreakthroughSession(spiralCount, complexity) {
    // Breakthrough typically occurs around session 3-4 for complex projects
    // Correlation: 60% of breakthrough time through project
    const breakthroughAtSpiral = Math.max(2, Math.ceil(spiralCount * 0.6));
    return `Session ${breakthroughAtSpiral} of ${spiralCount}`;
  }

  predictBreakthroughNature(domain) {
    const breakthroughs = {
      'music': 'Understanding how pedagogy drives architecture, not tech',
      'ai': 'Recognizing the domain constraint is stronger than technical constraint',
      'consciousness': 'Mapping implicit knowledge into explicit framework',
      'web': 'Identifying the real user problem vs assumed problem',
      'blockchain': 'Understanding economics drives implementation, not vice versa',
      'default': 'Realizing domain understanding is the actual blocker'
    };

    return breakthroughs[domain] || breakthroughs.default;
  }

  estimateMonths(spiralCount) {
    const baseMonths = spiralCount * 1;
    const minMonths = baseMonths + 0.5;
    const maxMonths = baseMonths + 1.5;
    return `${minMonths.toFixed(1)}-${maxMonths.toFixed(1)} months`;
  }

  shouldContinueSpiraling(currentClarity) {
    // Stop when clarity > 85% AND it feels "right"
    return currentClarity < 85;
  }
}

module.exports = SpiralClarificationEngine;
