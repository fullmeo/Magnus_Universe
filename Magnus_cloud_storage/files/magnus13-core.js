/**
 * Magnus 13.0 - AI Understanding & Coherence Engine
 * 
 * Paradigm Shift: From resource management to knowledge orchestration
 * 
 * Core Principles:
 * 1. Clarify before generating (understand the problem)
 * 2. Measure to learn (feedback loops)
 * 3. Maintain coherence (architectural continuity)
 * 4. Validate quality (enforce, not document)
 * 5. Adaptive complexity (multidimensional analysis)
 */

import Magnus12AI from './magnus12.js';

class Magnus13AI extends Magnus12AI {
  constructor(config = {}) {
    super(config);
    
    // New Magnus 13 capabilities
    this.learningDatabase = config.learningDatabase || new LearningDatabase();
    this.architecturalContext = config.architecturalContext || new ArchitecturalContext();
    this.qualityValidator = config.qualityValidator || new QualityValidator();
    this.requirementsClarifier = config.requirementsClarifier || new RequirementsClarifier();
    this.complexityAnalyzer = config.complexityAnalyzer || new ComplexityAnalyzer();
    
    // Session continuity
    this.sessionId = config.sessionId || this.generateSessionId();
    this.previousSessions = config.previousSessions || [];
    
    // Metrics & learning
    this.metrics = {
      estimationAccuracy: [],
      generationSuccess: [],
      clarificationImpact: [],
      qualityScores: []
    };
  }

  /**
   * Main decision engine - enhanced with understanding
   */
  async decide(problemDescription, config = {}) {
    console.log('\n🧠 Magnus 13 - Understanding & Coherence Engine\n');
    
    // Phase 1: Understand the problem deeply
    const understanding = await this.understandProblem(problemDescription);
    
    if (understanding.status === 'AMBIGUOUS') {
      return {
        phase: 'CLARIFICATION_REQUIRED',
        understanding,
        action: 'Answer clarifying questions before generation',
        questions: understanding.questions
      };
    }
    
    if (understanding.status === 'IMPOSSIBLE') {
      return {
        phase: 'CANNOT_GENERATE',
        understanding,
        action: 'This problem requires human expertise',
        reasoning: understanding.impossibilityReasons,
        alternatives: understanding.alternatives
      };
    }
    
    // Phase 2: Check for continuity from previous sessions
    const continuity = await this.checkContinuity(understanding);
    
    // Phase 3: Analyze complexity (multidimensional)
    const complexity = await this.complexityAnalyzer.analyzeMultidimensional(
      understanding.clarified,
      continuity.context
    );
    
    // Phase 4: Make architectural decisions
    const architecture = await this.decideArchitecture(understanding, complexity);
    
    // Phase 5: Generate execution plan with learning-adjusted estimates
    const plan = await this.generateExecutionPlan(
      understanding,
      complexity,
      architecture,
      continuity
    );
    
    // Phase 6: Validate feasibility
    const validation = await this.validateFeasibility(plan);
    
    if (!validation.feasible) {
      return {
        phase: 'INFEASIBLE',
        validation,
        action: 'Adjust constraints or split into multiple projects',
        recommendations: validation.recommendations
      };
    }
    
    return {
      phase: 'READY_TO_GENERATE',
      understanding,
      complexity,
      architecture,
      plan,
      validation,
      sessionId: this.sessionId,
      continuity: continuity.decisions,
      nextSteps: plan.phases,
      estimatedQuality: plan.qualityPrediction
    };
  }

  /**
   * Deep problem understanding with ambiguity detection
   */
  async understandProblem(description) {
    const ambiguities = this.requirementsClarifier.detectAmbiguities(description);
    
    if (ambiguities.critical.length > 0) {
      const questions = this.requirementsClarifier.generateQuestions(ambiguities);
      return {
        status: 'AMBIGUOUS',
        original: description,
        ambiguities,
        questions,
        message: 'Critical ambiguities detected - clarification required'
      };
    }
    
    // Check if problem is fundamentally impossible for AI generation
    const impossibility = this.detectImpossibility(description);
    if (impossibility.impossible) {
      return {
        status: 'IMPOSSIBLE',
        original: description,
        impossibilityReasons: impossibility.reasons,
        alternatives: impossibility.alternatives,
        message: 'This problem requires human expertise beyond AI code generation'
      };
    }
    
    // Extract structured understanding
    const understanding = {
      status: 'UNDERSTOOD',
      original: description,
      clarified: this.requirementsClarifier.extractStructuredRequirements(description),
      domain: this.detectDomain(description),
      constraints: this.extractConstraints(description),
      successCriteria: this.defineSuccessCriteria(description),
      risks: this.identifyRisks(description)
    };
    
    return understanding;
  }

  /**
   * Detect if problem is fundamentally impossible for AI generation
   */
  detectImpossibility(description) {
    const impossiblePatterns = {
      'Requires regulatory compliance': {
        patterns: [/medical diagnostic/i, /financial trading algorithm/i, /safety-critical/i],
        reason: 'Legal/safety liability requires human expert validation'
      },
      'Requires novel research': {
        patterns: [/new algorithm/i, /novel approach/i, /unsolved problem/i],
        reason: 'Requires original research, not code generation'
      },
      'Requires deep domain expertise': {
        patterns: [/compiler/i, /cryptographic protocol/i, /quantum/i],
        reason: 'Domain complexity exceeds general AI capabilities'
      },
      'Security-critical with no margin for error': {
        patterns: [/cryptocurrency wallet/i, /authentication system/i, /encryption implementation/i],
        reason: 'Security implementation requires expert audit'
      },
      'Requires physical world integration': {
        patterns: [/robotics control/i, /hardware driver/i, /real-time embedded/i],
        reason: 'Requires hardware testing and domain-specific constraints'
      }
    };
    
    const reasons = [];
    const alternatives = [];
    
    for (const [category, config] of Object.entries(impossiblePatterns)) {
      if (config.patterns.some(pattern => pattern.test(description))) {
        reasons.push({ category, reason: config.reason });
        
        // Suggest alternatives
        alternatives.push(this.suggestAlternative(category));
      }
    }
    
    return {
      impossible: reasons.length > 0,
      reasons,
      alternatives
    };
  }

  /**
   * Suggest alternatives for impossible problems
   */
  suggestAlternative(category) {
    const alternatives = {
      'Requires regulatory compliance': 'Generate prototype/scaffold, but require expert validation',
      'Requires novel research': 'Generate simulation/experimentation framework',
      'Requires deep domain expertise': 'Generate high-level structure, mark complex parts as TODO',
      'Security-critical with no margin for error': 'Generate using well-tested libraries, not custom implementations',
      'Requires physical world integration': 'Generate simulation/mock version for testing logic'
    };
    
    return alternatives[category] || 'Break into smaller, verifiable components';
  }

  /**
   * Check continuity from previous sessions
   */
  async checkContinuity(understanding) {
    if (this.previousSessions.length === 0) {
      return {
        hasContext: false,
        context: null,
        decisions: []
      };
    }
    
    // Extract architectural decisions from previous sessions
    const previousDecisions = this.architecturalContext.extractDecisions(this.previousSessions);
    
    // Check if current problem relates to previous work
    const relevance = this.architecturalContext.calculateRelevance(
      understanding.clarified,
      previousDecisions
    );
    
    if (relevance.score > 0.5) {
      return {
        hasContext: true,
        context: previousDecisions,
        decisions: relevance.applicableDecisions,
        continuityScore: relevance.score
      };
    }
    
    return {
      hasContext: false,
      context: null,
      decisions: []
    };
  }

  /**
   * Make architectural decisions with rationale
   */
  async decideArchitecture(understanding, complexity) {
    const options = this.generateArchitecturalOptions(understanding, complexity);
    const analysis = this.analyzeArchitecturalTradeoffs(options, understanding.constraints);
    const recommendation = this.selectBestArchitecture(analysis, understanding.successCriteria);
    
    // Record decision for future sessions
    this.architecturalContext.recordDecision({
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      problem: understanding.clarified,
      options,
      analysis,
      decision: recommendation,
      rationale: recommendation.rationale
    });
    
    return recommendation;
  }

  /**
   * Generate architectural options
   */
  generateArchitecturalOptions(understanding, complexity) {
    const options = [];
    const domain = understanding.domain;
    
    // Option 1: Monolithic (if simple enough)
    if (complexity.dimensions.structuralComplexity < 3) {
      options.push({
        name: 'Monolithic',
        structure: 'Single cohesive codebase',
        pros: ['Simple to understand', 'Easy deployment', 'No inter-service complexity'],
        cons: ['Hard to scale parts independently', 'Tight coupling'],
        suitability: complexity.dimensions.structuralComplexity < 2 ? 'HIGH' : 'MEDIUM'
      });
    }
    
    // Option 2: Modular monolith
    options.push({
      name: 'Modular Monolith',
      structure: 'Single deployment with clear module boundaries',
      pros: ['Clear separation of concerns', 'Simple deployment', 'Can extract later'],
      cons: ['Requires discipline to maintain boundaries'],
      suitability: 'HIGH'
    });
    
    // Option 3: Microservices (if complex enough)
    if (complexity.dimensions.structuralComplexity > 5) {
      options.push({
        name: 'Microservices',
        structure: 'Independent services with API contracts',
        pros: ['Independent scaling', 'Technology flexibility', 'Team autonomy'],
        cons: ['Distributed system complexity', 'Network latency', 'Deployment complexity'],
        suitability: complexity.dimensions.structuralComplexity > 7 ? 'HIGH' : 'MEDIUM'
      });
    }
    
    // Option 4: Serverless (if suitable workload)
    if (this.isSuitableForServerless(understanding)) {
      options.push({
        name: 'Serverless',
        structure: 'Function-as-a-Service with managed infrastructure',
        pros: ['Auto-scaling', 'Pay-per-use', 'No server management'],
        cons: ['Cold start latency', 'Vendor lock-in', 'State management complexity'],
        suitability: 'MEDIUM'
      });
    }
    
    return options;
  }

  /**
   * Analyze architectural tradeoffs
   */
  analyzeArchitecturalTradeoffs(options, constraints) {
    return options.map(option => {
      const scores = {
        simplicity: this.scoreSimplicity(option),
        scalability: this.scoreScalability(option),
        maintainability: this.scoreMaintainability(option),
        performance: this.scorePerformance(option),
        cost: this.scoreCost(option)
      };
      
      // Check against constraints
      const constraintViolations = this.checkConstraintViolations(option, constraints);
      
      // Calculate weighted score
      const weights = {
        simplicity: 0.3,
        scalability: 0.2,
        maintainability: 0.25,
        performance: 0.15,
        cost: 0.1
      };
      
      const totalScore = Object.entries(scores).reduce((sum, [key, value]) => {
        return sum + (value * weights[key]);
      }, 0);
      
      return {
        ...option,
        scores,
        constraintViolations,
        totalScore,
        viable: constraintViolations.length === 0
      };
    });
  }

  /**
   * Select best architecture based on analysis and success criteria
   */
  selectBestArchitecture(analysis, successCriteria) {
    // Filter to viable options
    const viable = analysis.filter(opt => opt.viable);
    
    if (viable.length === 0) {
      return {
        decision: 'NO_VIABLE_OPTION',
        message: 'No architecture satisfies all constraints',
        leastViolations: analysis.sort((a, b) => 
          a.constraintViolations.length - b.constraintViolations.length
        )[0]
      };
    }
    
    // Select highest scoring viable option
    const best = viable.sort((a, b) => b.totalScore - a.totalScore)[0];
    
    return {
      decision: best.name,
      structure: best.structure,
      rationale: this.generateRationale(best, viable),
      scores: best.scores,
      implementation: this.generateImplementationGuidance(best),
      alternatives: viable.filter(opt => opt.name !== best.name).map(opt => ({
        name: opt.name,
        score: opt.totalScore,
        whenToConsider: this.whenToConsider(opt)
      }))
    };
  }

  /**
   * Generate rationale for architectural decision
   */
  generateRationale(selected, alternatives) {
    const reasons = [];
    
    // Why this was selected
    const strengths = Object.entries(selected.scores)
      .filter(([_, score]) => score > 0.7)
      .map(([dimension]) => dimension);
    
    if (strengths.length > 0) {
      reasons.push(`Strong in: ${strengths.join(', ')}`);
    }
    
    // Why alternatives weren't selected
    alternatives.forEach(alt => {
      if (alt.name === selected.name) return;
      
      const weaknesses = Object.entries(alt.scores)
        .filter(([_, score]) => score < 0.4)
        .map(([dimension]) => dimension);
      
      if (weaknesses.length > 0) {
        reasons.push(`${alt.name} rejected due to: ${weaknesses.join(', ')}`);
      }
    });
    
    return reasons;
  }

  /**
   * Generate execution plan with learned estimates
   */
  async generateExecutionPlan(understanding, complexity, architecture, continuity) {
    // Get historical data for similar problems
    const similar = this.learningDatabase.findSimilar(understanding.clarified, complexity);
    
    // Adjust estimates based on learning
    const adjustedEstimates = this.adjustEstimatesFromLearning(
      super.estimateTokens(complexity.scope),
      similar
    );
    
    // Generate phases with dependencies
    const phases = this.generatePhases(understanding, architecture, complexity);
    
    // Predict quality based on historical data
    const qualityPrediction = this.predictQuality(complexity, architecture, similar);
    
    return {
      phases,
      estimates: adjustedEstimates,
      qualityPrediction,
      risks: this.identifyExecutionRisks(phases, complexity),
      checkpoints: this.defineCheckpoints(phases),
      rollbackStrategy: this.defineRollbackStrategy(phases)
    };
  }

  /**
   * Adjust estimates based on learning from similar past projects
   */
  adjustEstimatesFromLearning(baseEstimate, similarProjects) {
    if (similarProjects.length === 0) {
      return {
        tokens: baseEstimate,
        confidence: 'LOW',
        note: 'No historical data - using base estimates'
      };
    }
    
    // Calculate average actual vs estimated ratio
    const ratios = similarProjects.map(p => p.actualTokens / p.estimatedTokens);
    const avgRatio = ratios.reduce((a, b) => a + b) / ratios.length;
    const stdDev = Math.sqrt(
      ratios.reduce((sum, r) => sum + Math.pow(r - avgRatio, 2), 0) / ratios.length
    );
    
    // Parse base estimate (handle "X-Y tokens" or "X+ tokens")
    const match = baseEstimate.match(/(\d+)(?:-(\d+))?/);
    if (!match) return { tokens: baseEstimate, confidence: 'LOW' };
    
    const min = parseInt(match[1]);
    const max = match[2] ? parseInt(match[2]) : min * 1.5;
    
    // Apply learned ratio
    const adjustedMin = Math.round(min * avgRatio);
    const adjustedMax = Math.round(max * avgRatio);
    
    return {
      tokens: `${adjustedMin}-${adjustedMax} tokens`,
      confidence: stdDev < 0.3 ? 'HIGH' : stdDev < 0.6 ? 'MEDIUM' : 'LOW',
      baseEstimate,
      adjustment: `${(avgRatio * 100).toFixed(0)}% of base (learned from ${similarProjects.length} similar projects)`,
      historicalAccuracy: `±${(stdDev * 100).toFixed(0)}%`
    };
  }

  /**
   * Generate phases with dependencies
   */
  generatePhases(understanding, architecture, complexity) {
    const phases = [];
    
    // Phase 1: Foundation
    phases.push({
      name: 'Foundation',
      description: 'Core types, interfaces, and architectural skeleton',
      deliverables: [
        'Type definitions',
        'Interface contracts',
        'Project structure',
        'Configuration'
      ],
      dependencies: [],
      estimatedTokens: '500-1000',
      validationCriteria: [
        'TypeScript compiles without errors',
        'Project structure matches architecture decision',
        'All interfaces documented'
      ]
    });
    
    // Phase 2: Core logic
    phases.push({
      name: 'Core Logic',
      description: 'Primary business logic and data layer',
      deliverables: this.getCoreDeliverables(understanding),
      dependencies: ['Foundation'],
      estimatedTokens: this.estimatePhaseTokens('core', complexity),
      validationCriteria: [
        'All core functions have unit tests',
        'Error handling implemented',
        'Logging in place'
      ]
    });
    
    // Phase 3: Integration
    if (complexity.dimensions.integrationComplexity > 5) {
      phases.push({
        name: 'Integration',
        description: 'External service integration and API layer',
        deliverables: [
          'API client implementations',
          'Service adapters',
          'Integration tests',
          'Error recovery'
        ],
        dependencies: ['Core Logic'],
        estimatedTokens: '2000-4000',
        validationCriteria: [
          'Integration tests pass',
          'Rate limiting implemented',
          'Timeout handling present'
        ]
      });
    }
    
    // Phase 4: UI/UX (if applicable)
    if (understanding.domain.includes('frontend') || understanding.domain.includes('ui')) {
      phases.push({
        name: 'User Interface',
        description: 'Frontend components and user experience',
        deliverables: [
          'React components',
          'State management',
          'Styling',
          'Responsive design'
        ],
        dependencies: ['Core Logic'],
        estimatedTokens: '2000-5000',
        validationCriteria: [
          'Components render without errors',
          'Accessibility standards met',
          'Mobile responsive'
        ]
      });
    }
    
    // Phase 5: Quality & Polish
    phases.push({
      name: 'Quality & Polish',
      description: 'Testing, documentation, and refinement',
      deliverables: [
        'Comprehensive tests',
        'README documentation',
        'Error messages',
        'Performance optimization'
      ],
      dependencies: phases.slice(1).map(p => p.name),
      estimatedTokens: '1000-2000',
      validationCriteria: [
        'Test coverage > 80%',
        'Documentation complete',
        'No critical linter errors'
      ]
    });
    
    return phases;
  }

  /**
   * Validate plan feasibility
   */
  async validateFeasibility(plan) {
    const issues = [];
    const recommendations = [];
    
    // Check total token budget
    const totalEstimate = this.calculateTotalTokens(plan.phases);
    if (totalEstimate > this.tokenBudget * 1.2) {
      issues.push({
        severity: 'HIGH',
        issue: 'Token budget insufficient',
        detail: `Estimated ${totalEstimate} tokens, budget is ${this.tokenBudget}`
      });
      recommendations.push('Increase token budget or reduce scope');
      recommendations.push('Consider splitting into multiple sessions');
    }
    
    // Check iteration limits
    if (plan.phases.length > this.maxIterations) {
      issues.push({
        severity: 'HIGH',
        issue: 'Too many phases for iteration limit',
        detail: `${plan.phases.length} phases, limit is ${this.maxIterations}`
      });
      recommendations.push('Combine related phases');
      recommendations.push('Increase iteration limit');
    }
    
    // Check risk levels
    const highRisks = plan.risks.filter(r => r.severity === 'HIGH');
    if (highRisks.length > 2) {
      issues.push({
        severity: 'MEDIUM',
        issue: 'Multiple high-risk factors',
        detail: `${highRisks.length} high-risk items identified`
      });
      recommendations.push('Address high-risk items before generation');
      recommendations.push('Consider prototype/spike for risky components');
    }
    
    return {
      feasible: issues.filter(i => i.severity === 'HIGH').length === 0,
      issues,
      recommendations,
      confidence: this.calculateFeasibilityConfidence(issues, plan)
    };
  }

  /**
   * Calculate total estimated tokens
   */
  calculateTotalTokens(phases) {
    return phases.reduce((total, phase) => {
      const match = phase.estimatedTokens.match(/(\d+)-(\d+)/);
      if (match) {
        const avg = (parseInt(match[1]) + parseInt(match[2])) / 2;
        return total + avg;
      }
      return total;
    }, 0);
  }

  /**
   * Record generation metrics for learning
   */
  async recordMetrics(generationResult, originalPlan) {
    const metrics = {
      timestamp: new Date().toISOString(),
      sessionId: this.sessionId,
      problem: originalPlan.understanding.clarified,
      complexity: originalPlan.complexity,
      architecture: originalPlan.architecture.decision,
      
      // Estimates vs actuals
      estimatedTokens: this.calculateTotalTokens(originalPlan.plan.phases),
      actualTokens: generationResult.tokensUsed,
      estimationError: this.calculateEstimationError(
        this.calculateTotalTokens(originalPlan.plan.phases),
        generationResult.tokensUsed
      ),
      
      // Quality
      qualityScore: await this.qualityValidator.validate(generationResult.code),
      testsPassed: generationResult.testResults?.passed || 0,
      testsTotal: generationResult.testResults?.total || 0,
      
      // Success
      completedPhases: generationResult.completedPhases,
      totalPhases: originalPlan.plan.phases.length,
      success: generationResult.success
    };
    
    // Store for learning
    await this.learningDatabase.record(metrics);
    
    // Update running metrics
    this.metrics.estimationAccuracy.push(metrics.estimationError);
    this.metrics.qualityScores.push(metrics.qualityScore);
    
    return metrics;
  }

  /**
   * Generate session ID
   */
  generateSessionId() {
    return `magnus13-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get current learning statistics
   */
  getLearningStats() {
    if (this.metrics.estimationAccuracy.length === 0) {
      return { message: 'No learning data yet' };
    }
    
    const avgError = this.metrics.estimationAccuracy.reduce((a, b) => a + b, 0) / 
                     this.metrics.estimationAccuracy.length;
    const avgQuality = this.metrics.qualityScores.reduce((a, b) => a + b, 0) / 
                      this.metrics.qualityScores.length;
    
    return {
      totalSessions: this.metrics.estimationAccuracy.length,
      averageEstimationError: `${(avgError * 100).toFixed(1)}%`,
      averageQualityScore: avgQuality.toFixed(2),
      improvementTrend: this.calculateImprovementTrend(),
      topPatterns: this.learningDatabase.getTopPatterns()
    };
  }

  /**
   * Calculate improvement trend
   */
  calculateImprovementTrend() {
    if (this.metrics.estimationAccuracy.length < 5) {
      return 'Insufficient data';
    }
    
    const recent = this.metrics.estimationAccuracy.slice(-5);
    const older = this.metrics.estimationAccuracy.slice(0, 5);
    
    const recentAvg = recent.reduce((a, b) => a + b) / recent.length;
    const olderAvg = older.reduce((a, b) => a + b) / older.length;
    
    const improvement = ((olderAvg - recentAvg) / olderAvg) * 100;
    
    if (improvement > 10) return 'Significantly improving';
    if (improvement > 0) return 'Improving';
    if (improvement > -10) return 'Stable';
    return 'Degrading';
  }
}

// Supporting classes (to be implemented in separate files)
class LearningDatabase {
  constructor() {
    this.records = [];
  }
  
  async record(metrics) {
    this.records.push(metrics);
  }
  
  findSimilar(requirements, complexity) {
    // TODO: Implement similarity matching
    return [];
  }
  
  getTopPatterns() {
    // TODO: Implement pattern analysis
    return [];
  }
}

class ArchitecturalContext {
  constructor() {
    this.decisions = [];
  }
  
  recordDecision(decision) {
    this.decisions.push(decision);
  }
  
  extractDecisions(sessions) {
    return [];
  }
  
  calculateRelevance(requirements, previousDecisions) {
    return { score: 0, applicableDecisions: [] };
  }
}

class QualityValidator {
  async validate(code) {
    // TODO: Implement quality validation
    return 0.8;
  }
}

class RequirementsClarifier {
  detectAmbiguities(description) {
    return { critical: [], minor: [] };
  }
  
  generateQuestions(ambiguities) {
    return [];
  }
  
  extractStructuredRequirements(description) {
    return description;
  }
}

class ComplexityAnalyzer {
  async analyzeMultidimensional(requirements, context) {
    return {
      scope: 'MULTI_ARTIFACT',
      dimensions: {
        structuralComplexity: 5,
        domainComplexity: 3,
        integrationComplexity: 4
      }
    };
  }
}

export default Magnus13AI;
