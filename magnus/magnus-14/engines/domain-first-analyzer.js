/**
 * DOMAIN-FIRST ANALYZER ENGINE
 *
 * Diagnoses whether the real blocker is domain knowledge or technical implementation.
 *
 * Core Pattern:
 * - In EVERY project, domain complexity > technical complexity
 * - Mistaking domain blocker for technical leads to 6-month delays
 * - Real blocker: "What should it do?" (domain) vs "How to implement?" (tech)
 * - Solution: Find domain expert or build systematic framework FIRST
 */

class DomainFirstAnalyzer {
  constructor() {
    this.name = 'Domain-First Analyzer';
    this.version = '14.1';
  }

  analyze(projectInput) {
    const domainComplexity = this.estimateDomainComplexity(projectInput);
    const technicalComplexity = this.estimateTechnicalComplexity(projectInput);

    const realBlocker = domainComplexity > technicalComplexity + 1 ? 'domain' : 'technical';

    return {
      domainComplexity: Math.round(domainComplexity * 10) / 10,
      technicalComplexity: Math.round(technicalComplexity * 10) / 10,
      realBlocker: realBlocker,
      blockerRatio: Math.round((domainComplexity / technicalComplexity) * 100) / 100,

      recommendation: this.generateRecommendation(
        domainComplexity,
        technicalComplexity,
        realBlocker,
        projectInput
      ),

      smeRequired: domainComplexity > 7,
      smeType: this.identifySME(projectInput.domain),

      actionPriority: this.generateActionPriority(realBlocker, domainComplexity, technicalComplexity),

      confidence: 0.88
    };
  }

  estimateDomainComplexity(projectInput) {
    // Base complexity by domain
    const domainFactors = {
      'music': 8,
      'music_production': 8.5,
      'jazz': 9,
      'consciousness': 9,
      'quantum': 8.5,
      'ai': 7,
      'machine_learning': 7.5,
      'blockchain': 7,
      'finance': 8,
      'healthcare': 8.5,
      'web': 5,
      'infrastructure': 6,
      'devops': 6,
      'default': 5
    };

    let score = domainFactors[projectInput.domain?.toLowerCase()] || domainFactors.default;

    // Increase if description is long (complex domains need more explanation)
    if (projectInput.description && projectInput.description.length > 250) {
      score += 1;
    }

    // Increase if multiple specialized concepts mentioned
    const concepts = projectInput.description?.match(/\b(algorithm|theory|framework|pattern|model|system)\b/gi) || [];
    if (concepts.length >= 3) {
      score += 0.5;
    }

    // Increase if blockers mention domain-specific terms
    const domainBlockers = projectInput.blockers?.filter(b => {
      const desc = b.description?.toLowerCase() || '';
      return desc.includes('understand') || desc.includes('theory') || desc.includes('pedagogy');
    }).length || 0;

    if (domainBlockers > 0) {
      score += domainBlockers * 0.5;
    }

    return Math.min(Math.max(score, 1), 10);
  }

  estimateTechnicalComplexity(projectInput) {
    let score = 2;  // Base complexity

    // Count technical blockers
    const technicalKeywords = [
      'latency', 'performance', 'scalability', 'async', 'real-time',
      'concurrency', 'sync', 'state', 'network', 'load',
      'integration', 'architecture', 'refactor', 'optimization'
    ];

    const technicalBlockers = projectInput.blockers?.filter(b => {
      const desc = b.description?.toLowerCase() || '';
      return technicalKeywords.some(kw => desc.includes(kw));
    }).length || 0;

    score += technicalBlockers * 1.5;

    // Estimate from components
    if (projectInput.components && projectInput.components.length > 0) {
      const avgComponentComplexity = projectInput.components.reduce((sum, c) => sum + (c.complexity || 3), 0) / projectInput.components.length;
      score += avgComponentComplexity * 0.7;
    }

    // If explicit technical complexity provided
    if (projectInput.estimatedComplexity) {
      score = Math.max(score, projectInput.estimatedComplexity * 0.7);
    }

    return Math.min(Math.max(score, 1), 10);
  }

  generateRecommendation(domainComplexity, technicalComplexity, realBlocker, projectInput) {
    if (domainComplexity > technicalComplexity + 3) {
      return `DOMAIN IS PRIMARY BLOCKER.

Required Action: Engage subject matter expert for ${projectInput.domain || 'your domain'}.

Why: Domain complexity (${Math.round(domainComplexity)}/10) >> Technical (${Math.round(technicalComplexity)}/10).

Approach:
1. Clarify domain fundamentals FIRST
2. Map domain concepts to requirements
3. THEN design architecture
4. THEN implement

Pitfall to avoid: Starting code before domain is clear = 6+ month rework cycle.`;

    } else if (technicalComplexity > domainComplexity + 2) {
      return `TECHNICAL IS PRIMARY BLOCKER.

Required Action: Build proof-of-concept to validate technical assumptions.

Technical challenge: ${projectInput.blockers?.find(b =>
  b.description?.toLowerCase().includes('real-time') || b.description?.toLowerCase().includes('latency')
)?.description || 'Core architecture'}

Approach:
1. Identify 1-2 critical technical assumptions
2. Build 1-session POC to validate
3. Use POC findings for full architecture
4. Proceed with confidence`;

    } else {
      return `BALANCED COMPLEXITY.

Domain complexity (${Math.round(domainComplexity)}/10) ≈ Technical (${Math.round(technicalComplexity)}/10).

Recommended Approach:
1. Start with domain-first understanding (70% effort)
2. Simultaneously validate technical feasibility (30% effort)
3. Build POC for highest-risk technical assumption
4. Use POC + domain clarity to finalize architecture`;
    }
  }

  generateActionPriority(realBlocker, domainComplexity, technicalComplexity) {
    if (realBlocker === 'domain') {
      return [
        { priority: 1, action: 'Find subject matter expert or build domain framework' },
        { priority: 2, action: 'Deep dive: Understand domain pedagogy and principles' },
        { priority: 3, action: 'Map domain concepts to technical requirements' },
        { priority: 4, action: 'Design architecture based on domain model' },
        { priority: 5, action: 'Implement and validate' }
      ];
    } else {
      return [
        { priority: 1, action: 'Identify critical technical assumptions' },
        { priority: 2, action: 'Build 1-session POC for each high-risk assumption' },
        { priority: 3, action: 'Validate assumptions with real data/implementation' },
        { priority: 4, action: 'Design full architecture based on POC learnings' },
        { priority: 5, action: 'Implement full solution' }
      ];
    }
  }

  identifySME(domain) {
    const smeMap = {
      'music': 'Music theorist + jazz pedagogy expert',
      'music_production': 'Audio engineer + music theory expert',
      'jazz': 'Jazz musician + improvisation pedagogy expert',
      'consciousness': 'Cognitive scientist + neuroscientist + philosopher',
      'quantum': 'Quantum physicist + quantum algorithm specialist',
      'ai': 'ML researcher + domain expert',
      'machine_learning': 'ML engineer + statistics expert',
      'blockchain': 'Blockchain architect + token economist',
      'finance': 'Finance domain expert + risk analyst',
      'healthcare': 'Healthcare domain expert + regulatory expert',
      'music_learning': 'Music educator + instrument specialist'
    };

    return smeMap[domain?.toLowerCase()] || 'Subject matter expert in ' + (domain || 'your domain');
  }
}

module.exports = DomainFirstAnalyzer;
