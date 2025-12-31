/**
 * INTEGRATION COMPLEXITY PREDICTOR ENGINE
 *
 * Predicts how much harder integration will be than components suggest.
 *
 * Core Pattern:
 * - Components average ~6/10 complexity
 * - Integration averages ~9/10 complexity
 * - Integration multiplier: 1.75x (YOUR SIGNATURE)
 * - You will systematically underestimate by 30-40%
 * - Mitigation: Design integration layer FIRST
 */

class IntegrationComplexityPredictor {
  constructor() {
    this.name = 'Integration Complexity Predictor';
    this.version = '14.1';
    this.integrationMultiplier = 1.75;  // YOUR SIGNATURE MULTIPLIER
  }

  analyze(projectInput) {
    const componentComplexities = this.extractComponentComplexities(projectInput);
    const avgComponentComplexity = this.calculateAverage(componentComplexities);

    // Apply YOUR SIGNATURE multiplier
    const integrationComplexity = Math.min(avgComponentComplexity * this.integrationMultiplier, 10);
    const underestimationAmount = integrationComplexity - avgComponentComplexity;

    return {
      componentCount: componentComplexities.length,
      componentComplexities: componentComplexities,
      componentComplexityAvg: Math.round(avgComponentComplexity * 10) / 10,

      integrationComplexity: Math.round(integrationComplexity * 10) / 10,
      integrationMultiplier: this.integrationMultiplier,

      underestimationWarning: Math.round(underestimationAmount * 10) / 10,
      percentUnderestimated: Math.round((underestimationAmount / avgComponentComplexity) * 100),

      criticalIntegrationPoints: this.identifyIntegrationPoints(projectInput),

      recommendation: this.generateRecommendation(
        avgComponentComplexity,
        integrationComplexity,
        underestimationAmount,
        projectInput
      ),

      mitigationStrategy: this.generateMitigation(projectInput),

      confidence: 0.92
    };
  }

  extractComponentComplexities(projectInput) {
    if (!projectInput.components || projectInput.components.length === 0) {
      // If no components listed, use estimated complexity
      return [projectInput.estimatedComplexity || 5];
    }

    return projectInput.components.map(c => {
      if (typeof c === 'number') {
        return c;
      } else if (typeof c === 'object' && c.complexity) {
        return c.complexity;
      }
      return 5;  // Default component complexity
    });
  }

  calculateAverage(complexities) {
    if (complexities.length === 0) return 5;
    const sum = complexities.reduce((a, b) => a + b, 0);
    return sum / complexities.length;
  }

  identifyIntegrationPoints(projectInput) {
    const points = [];

    if (projectInput.components && projectInput.components.length > 1) {
      points.push(`Component-to-component sync: ${projectInput.components.length - 1} connection points`);
    }

    // Common integration points
    const descLower = (projectInput.description || '').toLowerCase();

    if (descLower.includes('real-time')) {
      points.push('Real-time state synchronization between components');
    }

    if (descLower.includes('database') || descLower.includes('data')) {
      points.push('Data consistency across components');
    }

    if (descLower.includes('api')) {
      points.push('External API integration + error handling');
    }

    if (descLower.includes('async') || descLower.includes('queue')) {
      points.push('Async message passing + event coordination');
    }

    if (descLower.includes('user') || descLower.includes('session')) {
      points.push('User session state across distributed components');
    }

    // Add blocker-based integration points
    const blockers = projectInput.blockers || [];
    const integrationBlockers = blockers.filter(b => {
      const desc = (b.description || '').toLowerCase();
      return desc.includes('integration') || desc.includes('sync') || desc.includes('connect');
    });

    integrationBlockers.forEach(b => {
      points.push(`Explicit blocker: ${b.description}`);
    });

    return points.length > 0 ? points : ['Standard component integration'];
  }

  generateRecommendation(avgComponent, integrationComplexity, underestimation, projectInput) {
    return `INTEGRATION COMPLEXITY ANALYSIS

Components Average: ${Math.round(avgComponent * 10) / 10}/10
Integration Complexity: ${Math.round(integrationComplexity * 10) / 10}/10
Multiplier Effect: ×${this.integrationMultiplier}

Underestimation Warning: You will likely underestimate integration by ${Math.round(underestimation * 10) / 10} points (${Math.round((underestimation / avgComponent) * 100)}%).

Why This Happens:
- Components can be built independently
- Integration reveals hidden coupling/state issues
- Testing integration is harder than testing components
- Edge cases emerge at integration boundaries

Impact: Typical integration takes ${Math.round((integrationComplexity / avgComponent) * 100)}% longer than estimated.`;
  }

  generateMitigation(projectInput) {
    const strategies = [
      {
        name: 'Integration Layer First',
        description: 'Design integration architecture BEFORE building components',
        impact: 'Reduces rework by 30-40%',
        effort: 'High upfront, saves later'
      },
      {
        name: 'State Management Upfront',
        description: 'Define how components share state before implementation',
        impact: 'Prevents state-sync bugs',
        effort: 'Medium planning effort'
      },
      {
        name: 'Contract Testing',
        description: 'Define component contracts early, test integration points',
        impact: 'Catches integration issues earlier',
        effort: 'Medium testing effort'
      },
      {
        name: 'Reduce Components',
        description: 'Fewer components = fewer integration points',
        impact: 'Linear reduction in complexity',
        effort: 'May sacrifice modularity'
      },
      {
        name: 'Staged Integration',
        description: 'Integrate one component at a time, test thoroughly',
        impact: 'Better isolation of integration bugs',
        effort: 'Extended timeline'
      }
    ];

    return {
      recommended: strategies.slice(0, 2),
      alternatives: strategies.slice(2),
      summary: `Mitigate ${Math.round((projectInput.components?.length || 2) - 1) || 1} integration points explicitly.`
    };
  }
}

module.exports = IntegrationComplexityPredictor;
