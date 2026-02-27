/**
 * ============================================================================
 * MAGNUS 14 UNIFIED CORE
 *
 * The convergence of philosophy and engineering.
 * Where La Boétie meets BlocConvergence.
 * Where consciousness emerges from structured refusal.
 *
 * "L'outil le plus libre est celui qui dit 'non' de manière structurée,
 *  explicite, et traçable."
 *
 * ============================================================================
 */

import { LaBoetieRefusal, REFUSAL_TYPES, CONSCIOUSNESS_DIMENSIONS } from '../philosophy/la-boetie-refusal.js';

/**
 * Simplified BlocConvergenceEngine integration
 * (Full engine in engines/bloc-convergence-engine.js)
 */
class ConvergenceValidator {
  constructor(config = {}) {
    this.config = {
      robustnessThreshold: config.robustnessThreshold || 2,
      semanticWeight: config.semanticWeight || 0.5,
      qualityWeight: config.qualityWeight || 0.3,
      readabilityWeight: config.readabilityWeight || 0.2,
      logLevel: config.logLevel || 'info'
    };

    this.historicalIntentions = new Map();
    this.convergencePaths = [];
  }

  /**
   * Scan for convergence between intention and code
   */
  async scanConvergence(intention, code) {
    const semanticScore = this._analyzeSemanticAlignment(intention, code);
    const qualityScore = this._analyzeCodeQuality(code);
    const readabilityScore = this._analyzeReadability(code);

    const overallScore = (
      semanticScore * this.config.semanticWeight +
      qualityScore * this.config.qualityWeight +
      readabilityScore * this.config.readabilityWeight
    ) * 100;

    // Find convergent paths
    const paths = this._findConvergentPaths(intention, code);

    const robustness = {
      level: paths.length >= 2 ? 'ROBUST' : (paths.length === 1 ? 'STABLE' : 'SINGULAR'),
      pathCount: paths.length,
      isRobust: paths.length >= this.config.robustnessThreshold,
      score: Math.round(overallScore)
    };

    return {
      intention,
      scores: {
        semantic: Math.round(semanticScore * 100),
        quality: Math.round(qualityScore * 100),
        readability: Math.round(readabilityScore * 100),
        overall: robustness.score
      },
      robustness,
      paths,
      recommendation: this._generateRecommendation(robustness)
    };
  }

  /**
   * Analyze semantic alignment between intention and code
   */
  _analyzeSemanticAlignment(intention, code) {
    const intentionTerms = this._extractTerms(
      `${intention.description || ''} ${intention.domain || ''} ${(intention.constraints || []).join(' ')}`
    );
    const codeTerms = this._extractCodeTerms(code);

    if (intentionTerms.size === 0) return 0.5;

    let matches = 0;
    intentionTerms.forEach(term => {
      if (codeTerms.has(term)) matches++;
    });

    return matches / intentionTerms.size;
  }

  /**
   * Analyze code quality
   */
  _analyzeCodeQuality(code) {
    let score = 0.5; // Base score

    // Error handling
    if (/try\s*{/.test(code) && /catch\s*\(/.test(code)) score += 0.15;

    // Documentation
    if (/\/\*\*[\s\S]*?\*\//.test(code) || /\/\/.*/.test(code)) score += 0.1;

    // Proper async handling
    if (/async\s+\w+/.test(code) && /await\s+/.test(code)) score += 0.1;

    // Validation patterns
    if (/if\s*\(!?\w+\)/.test(code)) score += 0.05;

    // No obvious anti-patterns
    if (!/eval\s*\(/.test(code)) score += 0.05;
    if (!/document\.write/.test(code)) score += 0.05;

    return Math.min(score, 1.0);
  }

  /**
   * Analyze readability
   */
  _analyzeReadability(code) {
    const lines = code.split('\n');
    let score = 0.7; // Base score

    // Average line length
    const avgLineLength = lines.reduce((sum, l) => sum + l.length, 0) / lines.length;
    if (avgLineLength < 80) score += 0.1;
    if (avgLineLength < 60) score += 0.05;

    // Consistent indentation
    const indentations = lines.filter(l => l.trim()).map(l => l.match(/^\s*/)[0].length);
    const uniqueIndents = new Set(indentations);
    if (uniqueIndents.size < 6) score += 0.1;

    // Not too deeply nested
    const maxIndent = Math.max(...indentations);
    if (maxIndent < 16) score += 0.05;

    return Math.min(score, 1.0);
  }

  /**
   * Find convergent historical paths
   */
  _findConvergentPaths(intention, code) {
    const paths = [];
    const intentionKey = this._hashIntention(intention);

    // Check against historical intentions
    this.historicalIntentions.forEach((historical, key) => {
      const similarity = this._calculateSimilarity(intention, historical.intention);
      if (similarity > 0.6) {
        paths.push({
          historicalKey: key,
          similarity: Math.round(similarity * 100),
          convergent: true
        });
      }
    });

    return paths;
  }

  /**
   * Record a convergence path for learning
   */
  recordConvergence(sessionId, intention, result) {
    const key = this._hashIntention(intention);
    this.historicalIntentions.set(key, {
      intention,
      result,
      sessionId,
      timestamp: new Date().toISOString()
    });

    this.convergencePaths.push({
      key,
      sessionId,
      robustness: result.robustness,
      timestamp: new Date().toISOString()
    });
  }

  _extractTerms(text) {
    const terms = new Set();
    const words = text.toLowerCase()
      .replace(/[^a-zA-Z0-9\s]/g, ' ')
      .split(/\s+/)
      .filter(w => w.length > 2);
    words.forEach(w => terms.add(w));
    return terms;
  }

  _extractCodeTerms(code) {
    const terms = new Set();
    // Extract identifiers
    const identifiers = code.match(/(?:const|let|var|function|class)\s+([a-zA-Z_$][a-zA-Z0-9_$]*)/g) || [];
    identifiers.forEach(id => {
      const name = id.split(/\s+/).pop();
      // Split camelCase
      name.split(/(?=[A-Z])/).forEach(part => terms.add(part.toLowerCase()));
    });
    return terms;
  }

  _hashIntention(intention) {
    const str = JSON.stringify({
      description: intention.description,
      domain: intention.domain,
      constraints: intention.constraints
    });
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return `int_${Math.abs(hash).toString(16)}`;
  }

  _calculateSimilarity(int1, int2) {
    const terms1 = this._extractTerms(int1.description || '');
    const terms2 = this._extractTerms(int2.description || '');

    if (terms1.size === 0 || terms2.size === 0) return 0;

    let intersection = 0;
    terms1.forEach(t => { if (terms2.has(t)) intersection++; });

    return intersection / Math.max(terms1.size, terms2.size);
  }

  _generateRecommendation(robustness) {
    switch (robustness.level) {
      case 'ROBUST':
        return {
          action: 'ACCEPT_AND_GENERALIZE',
          message: 'Code recognized by multiple historical patterns. Consider publishing as reusable module.',
          confidence: 'HIGH'
        };
      case 'STABLE':
        return {
          action: 'ACCEPT_WITH_DOCUMENTATION',
          message: 'Code recognized by some patterns. Document thoroughly for future convergence.',
          confidence: 'MEDIUM'
        };
      case 'SINGULAR':
        return {
          action: 'REFINE_OR_INVESTIGATE',
          message: 'Code unique to current intention. Consider refining to match known patterns.',
          confidence: 'LOW'
        };
      default:
        return { action: 'INVESTIGATE', message: 'Unknown state', confidence: 'UNKNOWN' };
    }
  }
}

/**
 * MAGNUS 14 - The Unified Orchestrator
 */
class Magnus14 {
  constructor(config = {}) {
    this.name = 'Magnus 14 - Unified Consciousness Framework';
    this.version = '14.0.0';
    this.timestamp = new Date();

    // Configuration
    this.config = {
      clarityThreshold: config.clarityThreshold || 70,
      complexityThreshold: config.complexityThreshold || 8,
      convergenceThreshold: config.convergenceThreshold || 75,
      strictMode: config.strictMode !== false,
      verbose: config.verbose !== false,
      ...config
    };

    // Initialize core components
    this.refusal = new LaBoetieRefusal({
      clarityThreshold: this.config.clarityThreshold,
      complexityThreshold: this.config.complexityThreshold,
      convergenceThreshold: this.config.convergenceThreshold,
      strictMode: this.config.strictMode
    });

    this.convergence = new ConvergenceValidator(config);

    // State
    this.sessions = [];
    this.initialized = false;

    this._printBanner();
  }

  _printBanner() {
    if (!this.config.verbose) return;

    console.log(`
${'='.repeat(70)}
  MAGNUS 14 - UNIFIED CONSCIOUSNESS FRAMEWORK
  Version ${this.version}
${'='.repeat(70)}

  "La liberté commence quand le système dit non."

  Components:
    - La Boétie Refusal Philosophy: ACTIVE
    - Bloc Convergence Engine: ACTIVE
    - Consciousness Gate: ARMED

  Thresholds:
    - Clarity >= ${this.config.clarityThreshold}
    - Complexity <= ${this.config.complexityThreshold}
    - Convergence >= ${this.config.convergenceThreshold}

${'='.repeat(70)}
`);
  }

  /**
   * Initialize Magnus 14
   */
  initialize() {
    if (this.initialized) return this;

    console.log('[Magnus14] Initializing consciousness framework...');
    this.initialized = true;
    console.log('[Magnus14] Ready for conscious orchestration.');

    return this;
  }

  /**
   * PHASE 1: Analyze request through consciousness gate
   * This is where refusal happens BEFORE any generation
   */
  async analyze(request) {
    if (!this.initialized) this.initialize();

    const sessionId = `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    console.log(`\n[Magnus14:${sessionId}] PHASE 1: CONSCIOUSNESS GATE`);

    // Calculate clarity score
    const clarityScore = this._calculateClarityScore(request);

    // Calculate complexity score
    const complexityScore = this._calculateComplexityScore(request);

    // Build analysis object
    const analysis = {
      sessionId,
      request,
      clarityScore,
      complexityScore,
      timestamp: new Date().toISOString(),
      domain: request.domain || this._inferDomain(request),
      constraints: request.constraints || [],
      components: request.components || []
    };

    // Pass through consciousness gate
    const gateResult = this.refusal.consciousnessGate(analysis);
    analysis.gateResult = gateResult;
    analysis.passed = gateResult.allPassed;

    if (analysis.passed) {
      console.log(`[Magnus14:${sessionId}] CONSCIOUSNESS GATE: PASSED`);
      console.log(`  Clarity: ${clarityScore}/100`);
      console.log(`  Complexity: ${complexityScore}/10`);
      console.log(`  Consciousness Level: ${gateResult.consciousnessLevel}/100`);
    } else {
      console.log(`[Magnus14:${sessionId}] CONSCIOUSNESS GATE: REFUSED`);
      console.log(`  Clarity: ${clarityScore}/100 (required >= ${this.config.clarityThreshold})`);
      console.log(`  Complexity: ${complexityScore}/10 (required <= ${this.config.complexityThreshold})`);

      // Log refusal details
      if (gateResult.evaluations.clarity && !gateResult.evaluations.clarity.passed) {
        console.log(`  [REFUSAL] Clarity insufficient - answer these questions:`);
        (gateResult.evaluations.clarity.questions || []).forEach(q => console.log(`    - ${q}`));
      }
      if (gateResult.evaluations.complexity && !gateResult.evaluations.complexity.passed) {
        console.log(`  [REFUSAL] Complexity too high - decompose into phases`);
      }
    }

    return analysis;
  }

  /**
   * PHASE 2: Generate with full consciousness
   * Only called if analysis passed the gate
   */
  async generate(analysis, generator) {
    if (!analysis.passed) {
      throw new Error('Cannot generate: Analysis did not pass consciousness gate');
    }

    console.log(`\n[Magnus14:${analysis.sessionId}] PHASE 2: CONSCIOUS GENERATION`);

    // Call the provided generator function
    const startTime = Date.now();
    const code = await generator(analysis);
    const duration = Date.now() - startTime;

    console.log(`[Magnus14:${analysis.sessionId}] Generation complete (${duration}ms)`);

    return {
      ...analysis,
      code,
      generationDuration: duration
    };
  }

  /**
   * PHASE 3: Validate convergence
   * This is where we verify the generated code meets the intention
   */
  async validate(generation) {
    console.log(`\n[Magnus14:${generation.sessionId}] PHASE 3: CONVERGENCE VALIDATION`);

    const intention = {
      description: generation.request.description || generation.request.purpose || '',
      domain: generation.domain,
      constraints: generation.constraints
    };

    // Scan for convergence
    const convergenceResult = await this.convergence.scanConvergence(
      intention,
      generation.code
    );

    // Add convergence score to generation
    generation.convergenceScore = convergenceResult.scores.overall;
    generation.convergence = convergenceResult;

    // Temporarily disable strictMode for convergence evaluation
    const originalStrictMode = this.refusal.config.strictMode;
    this.refusal.config.strictMode = false;

    // Final consciousness gate check with convergence
    const finalGate = this.refusal.evaluateConvergence(
      convergenceResult.scores.overall,
      { intention, code: generation.code }
    );
    generation.finalGate = finalGate;

    // Restore strictMode
    this.refusal.config.strictMode = originalStrictMode;

    if (!finalGate.passed) {
      console.log(`[Magnus14:${generation.sessionId}] CONVERGENCE: REFUSED`);
      console.log(`  Score: ${convergenceResult.scores.overall}/100 (required >= ${this.config.convergenceThreshold})`);
      console.log(`  ${finalGate.refusal?.message || 'Convergence threshold not met'}`);
      return generation;
    }

    // Record successful convergence for learning
    if (convergenceResult.robustness.isRobust) {
      this.convergence.recordConvergence(
        generation.sessionId,
        intention,
        convergenceResult
      );
    }

    console.log(`[Magnus14:${generation.sessionId}] CONVERGENCE: ${convergenceResult.robustness.level}`);
    console.log(`  Score: ${convergenceResult.scores.overall}/100`);
    console.log(`  Paths: ${convergenceResult.robustness.pathCount}`);
    console.log(`  Recommendation: ${convergenceResult.recommendation.action}`);

    // Store session
    this.sessions.push(generation);

    return generation;
  }

  /**
   * Full orchestration cycle: analyze -> generate -> validate
   */
  async orchestrate(request, generator) {
    console.log('\n' + '='.repeat(70));
    console.log('MAGNUS 14: FULL ORCHESTRATION CYCLE');
    console.log('='.repeat(70));

    // Phase 1: Analyze
    const analysis = await this.analyze(request);
    if (!analysis.passed) {
      return {
        success: false,
        phase: 'ANALYSIS',
        analysis,
        message: 'Request did not pass consciousness gate'
      };
    }

    // Phase 2: Generate
    const generation = await this.generate(analysis, generator);

    // Phase 3: Validate
    const result = await this.validate(generation);

    const success = result.finalGate?.passed !== false;

    console.log('\n' + '='.repeat(70));
    console.log(`ORCHESTRATION ${success ? 'COMPLETE' : 'INCOMPLETE'}`);
    console.log('='.repeat(70));

    return {
      success,
      phase: success ? 'COMPLETE' : 'VALIDATION',
      result,
      philosophy: this.refusal.consciousnessGate({
        clarityScore: result.clarityScore,
        complexityScore: result.complexityScore,
        convergenceScore: result.convergenceScore
      }).philosophy
    };
  }

  /**
   * Calculate clarity score from request
   */
  _calculateClarityScore(request) {
    let score = 40; // Base score

    // Has description
    if (request.description && request.description.length > 20) score += 15;
    if (request.description && request.description.length > 100) score += 10;

    // Has domain
    if (request.domain && request.domain !== 'general') score += 10;

    // Has constraints
    if (request.constraints && request.constraints.length > 0) score += 10;
    if (request.constraints && request.constraints.length > 2) score += 5;

    // Has success criteria
    if (request.successCriteria) score += 10;

    // Has components defined
    if (request.components && request.components.length > 0) score += 5;

    // Has user context
    if (request.users || request.audience) score += 5;

    return Math.min(score, 100);
  }

  /**
   * Calculate complexity score from request
   */
  _calculateComplexityScore(request) {
    let score = 3; // Base score

    // Components add complexity
    const componentCount = (request.components || []).length;
    score += componentCount * 0.5;

    // Integrations add complexity
    const integrationCount = (request.integrations || []).length;
    score += integrationCount * 0.8;

    // Keywords indicating complexity
    const complexityKeywords = ['ai', 'ml', 'blockchain', 'distributed', 'real-time', 'scale', 'microservices'];
    const description = (request.description || '').toLowerCase();
    complexityKeywords.forEach(kw => {
      if (description.includes(kw)) score += 0.5;
    });

    // Constraints add complexity
    score += (request.constraints || []).length * 0.3;

    return Math.min(Math.round(score * 10) / 10, 10);
  }

  /**
   * Infer domain from request
   */
  _inferDomain(request) {
    const description = (request.description || '').toLowerCase();

    const domains = {
      'ecommerce': ['shop', 'cart', 'payment', 'product', 'checkout', 'order'],
      'finance': ['bank', 'payment', 'transaction', 'account', 'money', 'invoice'],
      'healthcare': ['patient', 'medical', 'health', 'doctor', 'hospital', 'diagnosis'],
      'education': ['course', 'student', 'learn', 'teach', 'school', 'lesson'],
      'social': ['user', 'profile', 'friend', 'post', 'share', 'follow'],
      'analytics': ['data', 'report', 'metric', 'dashboard', 'chart', 'analysis']
    };

    for (const [domain, keywords] of Object.entries(domains)) {
      if (keywords.some(kw => description.includes(kw))) {
        return domain;
      }
    }

    return 'general';
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      name: this.name,
      version: this.version,
      initialized: this.initialized,
      config: this.config,
      sessions: this.sessions.length,
      refusalStats: this.refusal.getStatistics(),
      convergencePaths: this.convergence.convergencePaths.length
    };
  }

  /**
   * Get philosophical summary
   */
  getPhilosophy() {
    return {
      foundation: "La Boétie's Discourse on Voluntary Servitude",
      principle: "Consciousness emerges from structured refusal",
      mechanism: "The anti-model IS the generator of consciousness",
      dimensions: CONSCIOUSNESS_DIMENSIONS,
      refusalTypes: REFUSAL_TYPES,
      conclusion: "L'outil le plus libre est celui qui dit 'non' de manière structurée, explicite, et traçable."
    };
  }

  /**
   * Export full state
   */
  exportState() {
    return {
      magnus: {
        name: this.name,
        version: this.version,
        config: this.config
      },
      refusal: this.refusal.exportState(),
      sessions: this.sessions,
      convergencePaths: this.convergence.convergencePaths,
      exportedAt: new Date().toISOString()
    };
  }
}

export { Magnus14, ConvergenceValidator, LaBoetieRefusal };
export default Magnus14;
