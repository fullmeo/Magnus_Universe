/**
 * ComplexityAnalyzer - Multidimensional Complexity Assessment
 * 
 * Replaces Magnus 12's naive signal counting with true complexity analysis
 * 
 * Dimensions:
 * - Structural: Code organization, module boundaries
 * - Domain: Problem space knowledge requirements
 * - Algorithmic: Computational complexity
 * - Integration: External dependencies
 * - State: State management complexity
 * - Concurrency: Parallel/async complexity
 */

class ComplexityAnalyzer {
  constructor() {
    this.domainKnowledge = this.buildDomainKnowledge();
  }

  /**
   * Analyze complexity across multiple dimensions
   */
  async analyzeMultidimensional(requirements, context = null) {
    const dimensions = {
      structural: this.analyzeStructural(requirements),
      domain: this.analyzeDomain(requirements),
      algorithmic: this.analyzeAlgorithmic(requirements),
      integration: this.analyzeIntegration(requirements),
      state: this.analyzeState(requirements),
      concurrency: this.analyzeConcurrency(requirements)
    };

    // Calculate composite scores
    const composite = this.calculateComposite(dimensions);
    
    // Determine scope based on multidimensional analysis
    const scope = this.determineScope(dimensions, composite);
    
    // Identify complexity drivers
    const drivers = this.identifyDrivers(dimensions);
    
    // Generate insights
    const insights = this.generateInsights(dimensions, drivers);
    
    return {
      dimensions,
      composite,
      scope,
      drivers,
      insights,
      visualization: this.generateVisualization(dimensions)
    };
  }

  /**
   * Analyze structural complexity
   */
  analyzeStructural(requirements) {
    const signals = {
      // Module count signals
      explicitModules: this.countMatches(requirements, /module|component|service|package/gi),
      fileReferences: this.countMatches(requirements, /file|folder|directory/gi),
      
      // Boundary signals
      layerMentions: this.countMatches(requirements, /layer|tier|frontend|backend|database/gi),
      separationConcerns: this.countMatches(requirements, /separate|isolate|decouple/gi),
      
      // Scale signals
      sizeIndicators: this.extractSizeIndicators(requirements),
      
      // Architecture patterns
      architecturePatterns: this.detectArchitecturePatterns(requirements)
    };

    // Score 0-10 based on structural signals
    let score = 0;
    
    // More modules = more structure needed
    score += Math.min(signals.explicitModules * 0.5, 3);
    score += Math.min(signals.layerMentions * 0.7, 3);
    score += signals.sizeIndicators.score;
    score += signals.architecturePatterns.length * 0.8;
    
    return {
      score: Math.min(Math.round(score), 10),
      signals,
      interpretation: this.interpretStructural(score),
      recommendations: this.recommendStructural(score)
    };
  }

  /**
   * Analyze domain complexity
   */
  analyzeDomain(requirements) {
    const domains = this.detectDomains(requirements);
    
    // Score based on domain difficulty
    const domainScores = domains.map(domain => {
      const knowledge = this.domainKnowledge[domain.category];
      return {
        domain: domain.name,
        difficulty: knowledge?.difficulty || 5,
        requires: knowledge?.requires || ['general knowledge'],
        expertiseLevel: knowledge?.expertiseLevel || 'intermediate'
      };
    });
    
    // Highest difficulty domain sets the floor
    const maxDifficulty = Math.max(...domainScores.map(d => d.difficulty), 1);
    
    // Multiple domains adds complexity
    const multiDomainPenalty = domains.length > 1 ? (domains.length - 1) * 0.5 : 0;
    
    const score = Math.min(maxDifficulty + multiDomainPenalty, 10);
    
    return {
      score: Math.round(score),
      domains: domainScores,
      primaryDomain: domainScores[0] || { domain: 'general', difficulty: 3 },
      multiDomain: domains.length > 1,
      interpretation: this.interpretDomain(score, domainScores),
      recommendations: this.recommendDomain(domainScores)
    };
  }

  /**
   * Analyze algorithmic complexity
   */
  analyzeAlgorithmic(requirements) {
    const algorithmicIndicators = {
      // Computational complexity hints
      optimizationMentions: this.countMatches(requirements, /optimiz|efficient|performance|fast/gi),
      scaleMentions: this.countMatches(requirements, /scale|million|billion|large dataset/gi),
      
      // Algorithm types
      sorting: /sort|order|rank/gi.test(requirements),
      searching: /search|find|query|lookup/gi.test(requirements),
      graphTraversal: /graph|tree|traverse|path|network/gi.test(requirements),
      dynamicProgramming: /cache|memoiz|optimal substructure/gi.test(requirements),
      
      // Data structure complexity
      complexDataStructures: this.detectComplexDataStructures(requirements),
      
      // Mathematical operations
      mathComplexity: this.detectMathComplexity(requirements)
    };

    let score = 3; // Base score for any code
    
    // Optimization requirements
    if (algorithmicIndicators.optimizationMentions > 0) score += 2;
    if (algorithmicIndicators.scaleMentions > 0) score += 2;
    
    // Algorithm types
    if (algorithmicIndicators.graphTraversal) score += 2;
    if (algorithmicIndicators.dynamicProgramming) score += 3;
    
    // Data structures
    score += algorithmicIndicators.complexDataStructures.length * 0.5;
    
    // Math
    score += algorithmicIndicators.mathComplexity.score;
    
    return {
      score: Math.min(Math.round(score), 10),
      indicators: algorithmicIndicators,
      interpretation: this.interpretAlgorithmic(score),
      recommendations: this.recommendAlgorithmic(algorithmicIndicators)
    };
  }

  /**
   * Analyze integration complexity
   */
  analyzeIntegration(requirements) {
    const integrations = this.detectIntegrations(requirements);
    
    const integrationTypes = {
      rest_api: { complexity: 3, name: 'REST API' },
      graphql: { complexity: 4, name: 'GraphQL' },
      websocket: { complexity: 5, name: 'WebSocket' },
      database: { complexity: 4, name: 'Database' },
      message_queue: { complexity: 5, name: 'Message Queue' },
      file_system: { complexity: 2, name: 'File System' },
      third_party: { complexity: 3, name: 'Third-party Service' },
      authentication: { complexity: 5, name: 'Authentication Provider' }
    };
    
    const detected = integrations.map(integration => ({
      ...integrationTypes[integration],
      type: integration
    }));
    
    // Score based on number and complexity of integrations
    const score = detected.reduce((sum, int) => sum + int.complexity, 0);
    
    return {
      score: Math.min(Math.round(score), 10),
      integrations: detected,
      count: detected.length,
      interpretation: this.interpretIntegration(score, detected.length),
      recommendations: this.recommendIntegration(detected)
    };
  }

  /**
   * Analyze state management complexity
   */
  analyzeState(requirements) {
    const stateIndicators = {
      // State scope
      globalState: /global state|application state|shared state/gi.test(requirements),
      localState: /local state|component state/gi.test(requirements),
      persistedState: /persist|save|storage|database/gi.test(requirements),
      
      // State complexity
      stateMachine: /state machine|workflow|states/gi.test(requirements),
      multiUser: /multi-user|collaborative|concurrent/gi.test(requirements),
      realtime: /real-time|live|sync/gi.test(requirements),
      
      // State management patterns
      redux: /redux|store|actions|reducers/gi.test(requirements),
      mobx: /mobx|observable/gi.test(requirements),
      context: /context|provider/gi.test(requirements)
    };

    let score = 1; // Base score
    
    if (stateIndicators.globalState) score += 2;
    if (stateIndicators.persistedState) score += 2;
    if (stateIndicators.stateMachine) score += 3;
    if (stateIndicators.multiUser) score += 3;
    if (stateIndicators.realtime) score += 2;
    
    return {
      score: Math.min(Math.round(score), 10),
      indicators: stateIndicators,
      interpretation: this.interpretState(score),
      recommendations: this.recommendState(stateIndicators)
    };
  }

  /**
   * Analyze concurrency complexity
   */
  analyzeConcurrency(requirements) {
    const concurrencyIndicators = {
      // Async patterns
      promises: /promise|async|await/gi.test(requirements),
      callbacks: /callback|event/gi.test(requirements),
      
      // Concurrency issues
      raceCond: /race condition|concurrent|parallel/gi.test(requirements),
      deadlock: /deadlock|lock|mutex/gi.test(requirements),
      
      // Patterns
      workerThreads: /worker|thread|parallel processing/gi.test(requirements),
      streaming: /stream|pipeline|flow/gi.test(requirements),
      
      // Real-time
      realtime: /real-time|websocket|sse/gi.test(requirements)
    };

    let score = 0;
    
    if (concurrencyIndicators.promises) score += 1;
    if (concurrencyIndicators.raceCond) score += 3;
    if (concurrencyIndicators.deadlock) score += 4;
    if (concurrencyIndicators.workerThreads) score += 3;
    if (concurrencyIndicators.streaming) score += 2;
    if (concurrencyIndicators.realtime) score += 2;
    
    return {
      score: Math.min(Math.round(score), 10),
      indicators: concurrencyIndicators,
      interpretation: this.interpretConcurrency(score),
      recommendations: this.recommendConcurrency(concurrencyIndicators)
    };
  }

  /**
   * Calculate composite complexity score
   */
  calculateComposite(dimensions) {
    // Weighted average with emphasis on highest complexities
    const weights = {
      structural: 0.2,
      domain: 0.25,
      algorithmic: 0.15,
      integration: 0.2,
      state: 0.1,
      concurrency: 0.1
    };
    
    const weighted = Object.entries(dimensions).reduce((sum, [key, dim]) => {
      return sum + (dim.score * weights[key]);
    }, 0);
    
    // Identify if any dimension is particularly high
    const maxScore = Math.max(...Object.values(dimensions).map(d => d.score));
    const maxDimension = Object.entries(dimensions).find(([_, d]) => d.score === maxScore)?.[0];
    
    return {
      score: Math.round(weighted * 10) / 10,
      maxDimension,
      maxScore,
      interpretation: this.interpretComposite(weighted, maxScore, maxDimension)
    };
  }

  /**
   * Determine scope based on multidimensional analysis
   */
  determineScope(dimensions, composite) {
    // Not just based on composite score, but on dimension patterns
    
    // Single artifact: Low across the board
    if (composite.score < 3 && dimensions.structural.score < 3) {
      return 'SINGLE_ARTIFACT';
    }
    
    // Multi artifact: Moderate complexity or specific high dimensions
    if (composite.score < 5 || 
        (dimensions.structural.score < 5 && dimensions.integration.score < 4)) {
      return 'MULTI_ARTIFACT';
    }
    
    // Modular system: High structural or integration complexity
    if (composite.score < 7 || dimensions.structural.score >= 7) {
      return 'MODULAR_SYSTEM';
    }
    
    // Iterative project: Very high complexity
    return 'ITERATIVE_PROJECT';
  }

  /**
   * Identify main complexity drivers
   */
  identifyDrivers(dimensions) {
    const drivers = [];
    
    Object.entries(dimensions).forEach(([name, dim]) => {
      if (dim.score >= 7) {
        drivers.push({
          dimension: name,
          score: dim.score,
          severity: 'HIGH',
          impact: `${name} complexity is a major driver of project difficulty`
        });
      } else if (dim.score >= 5) {
        drivers.push({
          dimension: name,
          score: dim.score,
          severity: 'MEDIUM',
          impact: `${name} complexity adds moderate difficulty`
        });
      }
    });
    
    return drivers.sort((a, b) => b.score - a.score);
  }

  /**
   * Generate actionable insights
   */
  generateInsights(dimensions, drivers) {
    const insights = [];
    
    // Primary driver insight
    if (drivers.length > 0) {
      const primary = drivers[0];
      insights.push({
        type: 'PRIMARY_DRIVER',
        message: `${primary.dimension} complexity (${primary.score}/10) is the main challenge`,
        recommendation: dimensions[primary.dimension].recommendations[0]
      });
    }
    
    // Multiple high dimensions
    const highDimensions = drivers.filter(d => d.severity === 'HIGH');
    if (highDimensions.length > 1) {
      insights.push({
        type: 'MULTI_DIMENSIONAL',
        message: `${highDimensions.length} dimensions have high complexity`,
        recommendation: 'Consider splitting into phases, tackling one dimension at a time'
      });
    }
    
    // Specific patterns
    if (dimensions.integration.score > 6 && dimensions.state.score > 6) {
      insights.push({
        type: 'PATTERN',
        message: 'High integration + state complexity detected',
        recommendation: 'Implement state synchronization patterns early'
      });
    }
    
    if (dimensions.domain.score > 7) {
      insights.push({
        type: 'DOMAIN_EXPERTISE',
        message: 'Domain requires specialized knowledge',
        recommendation: 'Use established libraries; avoid reimplementation'
      });
    }
    
    return insights;
  }

  /**
   * Generate ASCII visualization of complexity dimensions
   */
  generateVisualization(dimensions) {
    const lines = ['Complexity Profile:', ''];
    
    Object.entries(dimensions).forEach(([name, dim]) => {
      const bar = '█'.repeat(dim.score) + '░'.repeat(10 - dim.score);
      const label = name.padEnd(15);
      lines.push(`${label} ${bar} ${dim.score}/10`);
    });
    
    return lines.join('\n');
  }

  // ========== Helper Methods ==========

  countMatches(text, pattern) {
    const matches = text.match(pattern);
    return matches ? matches.length : 0;
  }

  extractSizeIndicators(requirements) {
    const indicators = [];
    let score = 0;
    
    // Line count mentions
    const lineMatch = requirements.match(/(\d+)\+?\s*(lines|loc)/i);
    if (lineMatch) {
      const lines = parseInt(lineMatch[1]);
      if (lines > 1000) score += 3;
      else if (lines > 500) score += 2;
      else if (lines > 200) score += 1;
      indicators.push(`${lines} lines mentioned`);
    }
    
    // File count mentions
    const fileMatch = requirements.match(/(\d+)\+?\s*files/i);
    if (fileMatch) {
      const files = parseInt(fileMatch[1]);
      if (files > 20) score += 3;
      else if (files > 10) score += 2;
      else if (files > 5) score += 1;
      indicators.push(`${files} files mentioned`);
    }
    
    // Qualitative size mentions
    if (/large|big|extensive|comprehensive/i.test(requirements)) {
      score += 1;
      indicators.push('Qualitative size indicators');
    }
    
    return { score: Math.min(score, 3), indicators };
  }

  detectArchitecturePatterns(requirements) {
    const patterns = [];
    const architectures = {
      'MVC': /mvc|model.*view.*controller/gi,
      'Microservices': /microservice|service mesh/gi,
      'Event-driven': /event.*driven|event sourcing|cqrs/gi,
      'Layered': /layered|n-tier|three-tier/gi,
      'Hexagonal': /hexagonal|ports.*adapters/gi,
      'Clean Architecture': /clean architecture|onion/gi
    };
    
    Object.entries(architectures).forEach(([name, pattern]) => {
      if (pattern.test(requirements)) {
        patterns.push(name);
      }
    });
    
    return patterns;
  }

  detectDomains(requirements) {
    const domains = [];
    
    // Check against domain knowledge base
    Object.entries(this.domainKnowledge).forEach(([category, config]) => {
      if (config.patterns.some(pattern => pattern.test(requirements))) {
        domains.push({ category, name: config.name });
      }
    });
    
    return domains.length > 0 ? domains : [{ category: 'general', name: 'General Software' }];
  }

  detectComplexDataStructures(requirements) {
    const structures = [];
    const complexStructures = {
      'Graph': /graph|node|edge|vertex/gi,
      'Tree': /tree|binary tree|bst|heap/gi,
      'Trie': /trie|prefix tree/gi,
      'Hash Table': /hash.*table|hash.*map|dictionary/gi,
      'Priority Queue': /priority.*queue|heap/gi
    };
    
    Object.entries(complexStructures).forEach(([name, pattern]) => {
      if (pattern.test(requirements)) {
        structures.push(name);
      }
    });
    
    return structures;
  }

  detectMathComplexity(requirements) {
    let score = 0;
    const indicators = [];
    
    if (/matrix|linear algebra|vector/gi.test(requirements)) {
      score += 2;
      indicators.push('Linear algebra');
    }
    
    if (/calculus|derivative|integral/gi.test(requirements)) {
      score += 3;
      indicators.push('Calculus');
    }
    
    if (/crypto|encryption|hash/gi.test(requirements)) {
      score += 3;
      indicators.push('Cryptography');
    }
    
    if (/statistics|probability|distribution/gi.test(requirements)) {
      score += 2;
      indicators.push('Statistics');
    }
    
    if (/machine learning|neural network|ai/gi.test(requirements)) {
      score += 4;
      indicators.push('Machine learning');
    }
    
    return { score: Math.min(score, 5), indicators };
  }

  detectIntegrations(requirements) {
    const integrations = [];
    const patterns = {
      rest_api: /rest|api|http|endpoint/gi,
      graphql: /graphql/gi,
      websocket: /websocket|ws:/gi,
      database: /database|sql|postgres|mongo/gi,
      message_queue: /queue|kafka|rabbitmq|redis/gi,
      file_system: /file system|read file|write file/gi,
      third_party: /third[- ]party|external.*service/gi,
      authentication: /auth|login|oauth|jwt/gi
    };
    
    Object.entries(patterns).forEach(([type, pattern]) => {
      if (pattern.test(requirements)) {
        integrations.push(type);
      }
    });
    
    return integrations;
  }

  buildDomainKnowledge() {
    return {
      general: {
        name: 'General Software',
        difficulty: 3,
        requires: ['programming fundamentals'],
        expertiseLevel: 'beginner',
        patterns: [/.*/] // Default fallback
      },
      cryptography: {
        name: 'Cryptography',
        difficulty: 9,
        requires: ['number theory', 'security expertise', 'protocol design'],
        expertiseLevel: 'expert',
        patterns: [/crypto|encryption|cipher|hash function|signature/gi]
      },
      ml_ai: {
        name: 'Machine Learning / AI',
        difficulty: 8,
        requires: ['statistics', 'linear algebra', 'optimization', 'model architecture'],
        expertiseLevel: 'expert',
        patterns: [/machine learning|neural network|deep learning|model training/gi]
      },
      compiler: {
        name: 'Compiler / Parser',
        difficulty: 9,
        requires: ['formal languages', 'compiler theory', 'optimization'],
        expertiseLevel: 'expert',
        patterns: [/compiler|parser|lexer|ast|code generation/gi]
      },
      dsp: {
        name: 'Digital Signal Processing',
        difficulty: 8,
        requires: ['signal theory', 'fourier analysis', 'mathematics'],
        expertiseLevel: 'expert',
        patterns: [/signal processing|fft|audio processing|dsp/gi]
      },
      blockchain: {
        name: 'Blockchain / Cryptocurrency',
        difficulty: 8,
        requires: ['cryptography', 'distributed systems', 'consensus algorithms'],
        expertiseLevel: 'expert',
        patterns: [/blockchain|cryptocurrency|smart contract|consensus/gi]
      },
      embedded: {
        name: 'Embedded Systems',
        difficulty: 7,
        requires: ['hardware knowledge', 'real-time systems', 'low-level programming'],
        expertiseLevel: 'advanced',
        patterns: [/embedded|microcontroller|firmware|hardware/gi]
      },
      distributed_systems: {
        name: 'Distributed Systems',
        difficulty: 7,
        requires: ['networking', 'consensus', 'fault tolerance'],
        expertiseLevel: 'advanced',
        patterns: [/distributed|consensus|raft|paxos|distributed system/gi]
      },
      databases: {
        name: 'Database Systems',
        difficulty: 6,
        requires: ['data structures', 'query optimization', 'transactions'],
        expertiseLevel: 'advanced',
        patterns: [/database engine|query optimizer|transaction/gi]
      },
      web: {
        name: 'Web Development',
        difficulty: 4,
        requires: ['HTML/CSS/JS', 'HTTP', 'frameworks'],
        expertiseLevel: 'intermediate',
        patterns: [/web app|website|frontend|backend|full[- ]stack/gi]
      },
      mobile: {
        name: 'Mobile Development',
        difficulty: 5,
        requires: ['mobile platform', 'UI design', 'native APIs'],
        expertiseLevel: 'intermediate',
        patterns: [/mobile app|ios|android|react native|flutter/gi]
      }
    };
  }

  // Interpretation methods
  interpretStructural(score) {
    if (score <= 2) return 'Simple structure - single file or minimal organization';
    if (score <= 4) return 'Moderate structure - some organization needed';
    if (score <= 6) return 'Complex structure - clear module boundaries required';
    if (score <= 8) return 'Advanced structure - architectural patterns needed';
    return 'Expert structure - sophisticated architecture required';
  }

  interpretDomain(score, domains) {
    const primary = domains[0]?.domain || 'general';
    if (score <= 3) return `Simple domain (${primary}) - general knowledge sufficient`;
    if (score <= 5) return `Moderate domain (${primary}) - some specialized knowledge helpful`;
    if (score <= 7) return `Complex domain (${primary}) - domain expertise recommended`;
    return `Expert domain (${primary}) - specialized expertise required`;
  }

  interpretAlgorithmic(score) {
    if (score <= 3) return 'Simple algorithms - basic operations';
    if (score <= 5) return 'Moderate algorithms - standard patterns';
    if (score <= 7) return 'Complex algorithms - optimization needed';
    return 'Advanced algorithms - algorithmic expertise required';
  }

  interpretIntegration(score, count) {
    if (count === 0) return 'No external integrations';
    if (score <= 3) return `Simple integrations - ${count} straightforward connection(s)`;
    if (score <= 6) return `Moderate integrations - ${count} integration(s) with some complexity`;
    return `Complex integrations - ${count} integration(s) requiring careful orchestration`;
  }

  interpretState(score) {
    if (score <= 2) return 'Simple state - local only';
    if (score <= 4) return 'Moderate state - some coordination';
    if (score <= 6) return 'Complex state - state management patterns needed';
    return 'Advanced state - sophisticated state synchronization required';
  }

  interpretConcurrency(score) {
    if (score === 0) return 'No concurrency concerns';
    if (score <= 2) return 'Simple async - basic promises/callbacks';
    if (score <= 5) return 'Moderate concurrency - race conditions possible';
    return 'Complex concurrency - careful synchronization required';
  }

  interpretComposite(weighted, maxScore, maxDimension) {
    return `Overall complexity: ${weighted.toFixed(1)}/10 (primarily driven by ${maxDimension}: ${maxScore}/10)`;
  }

  // Recommendation methods
  recommendStructural(score) {
    if (score <= 3) return ['Keep it simple - single file is fine'];
    if (score <= 5) return ['Organize into logical modules', 'Use clear naming conventions'];
    if (score <= 7) return ['Define module boundaries', 'Use dependency injection', 'Document architecture'];
    return ['Use established architecture pattern', 'Consider framework', 'Create ADRs'];
  }

  recommendDomain(domains) {
    const primary = domains[0];
    if (!primary) return ['Apply general best practices'];
    
    if (primary.difficulty >= 8) {
      return [
        'Use established, well-tested libraries',
        'Do not implement from scratch',
        'Consult domain experts for validation'
      ];
    }
    
    if (primary.difficulty >= 6) {
      return [
        'Study domain-specific patterns',
        'Use specialized libraries where available',
        'Include extensive testing'
      ];
    }
    
    return ['Apply standard patterns', 'Leverage existing solutions'];
  }

  recommendAlgorithmic(indicators) {
    const recommendations = [];
    
    if (indicators.graphTraversal) {
      recommendations.push('Use established graph algorithms (BFS/DFS/Dijkstra)');
    }
    
    if (indicators.optimizationMentions > 0) {
      recommendations.push('Profile before optimizing');
      recommendations.push('Use appropriate data structures');
    }
    
    if (indicators.complexDataStructures.length > 0) {
      recommendations.push('Use standard library implementations where possible');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Standard algorithmic approaches sufficient');
    }
    
    return recommendations;
  }

  recommendIntegration(integrations) {
    const recommendations = [];
    
    if (integrations.length > 3) {
      recommendations.push('Consider API gateway or integration layer');
    }
    
    if (integrations.some(i => i.type === 'database')) {
      recommendations.push('Use ORM or query builder');
      recommendations.push('Implement connection pooling');
    }
    
    if (integrations.some(i => i.type === 'websocket')) {
      recommendations.push('Implement reconnection logic');
      recommendations.push('Handle connection state carefully');
    }
    
    recommendations.push('Add retry logic and circuit breakers');
    recommendations.push('Implement comprehensive error handling');
    
    return recommendations;
  }

  recommendState(indicators) {
    const recommendations = [];
    
    if (indicators.globalState) {
      recommendations.push('Use state management library (Redux/Zustand)');
    }
    
    if (indicators.persistedState) {
      recommendations.push('Implement state persistence layer');
      recommendations.push('Handle state migration');
    }
    
    if (indicators.multiUser || indicators.realtime) {
      recommendations.push('Implement conflict resolution');
      recommendations.push('Use operational transforms or CRDTs');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Local component state is sufficient');
    }
    
    return recommendations;
  }

  recommendConcurrency(indicators) {
    const recommendations = [];
    
    if (indicators.raceCond) {
      recommendations.push('Use locks or atomic operations');
      recommendations.push('Carefully review concurrent access');
    }
    
    if (indicators.workerThreads) {
      recommendations.push('Use Web Workers or worker threads');
      recommendations.push('Implement message passing protocol');
    }
    
    if (indicators.streaming) {
      recommendations.push('Use streaming APIs (Node streams/Web Streams)');
      recommendations.push('Implement backpressure handling');
    }
    
    if (recommendations.length === 0) {
      recommendations.push('Basic async/await patterns sufficient');
    }
    
    return recommendations;
  }
}

export default ComplexityAnalyzer;
