/**
 * Magnus 13.0 - Learning & Coherence Engines
 * 
 * Learning Engine: Measures actual outcomes, learns from feedback
 * Coherence Engine: Maintains context across sessions
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// ============================================================================
// LEARNING ENGINE - Feedback & Adaptation
// ============================================================================

class LearningEngine {
  constructor(storageDir = './.magnus-knowledge') {
    this.storageDir = storageDir;
    this.metrics = {
      estimates: [],
      actuals: [],
      patterns: new Map(),
      failures: []
    };
    this.initialized = false;
  }

  async initialize() {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
      await this.loadKnowledge();
      this.initialized = true;
    } catch (error) {
      console.warn('Learning engine initialization failed:', error.message);
    }
  }

  /**
   * Record an estimate before generation
   */
  recordEstimate(sessionId, estimate) {
    const record = {
      sessionId,
      timestamp: Date.now(),
      estimate: {
        scope: estimate.scope,
        tokensEstimated: estimate.tokensEstimated,
        iterationsEstimated: estimate.iterationsEstimated,
        complexityScore: estimate.complexityScore,
        clarityScore: estimate.clarityScore
      }
    };

    this.metrics.estimates.push(record);
    return record;
  }

  /**
   * Record actual outcome after generation
   */
  async recordActual(sessionId, actual) {
    const estimate = this.metrics.estimates.find(e => e.sessionId === sessionId);
    
    if (!estimate) {
      console.warn(`No estimate found for session ${sessionId}`);
      return null;
    }

    const record = {
      sessionId,
      timestamp: Date.now(),
      actual: {
        tokensActual: actual.tokensUsed,
        iterationsActual: actual.iterations,
        linesOfCode: actual.linesOfCode,
        filesGenerated: actual.filesGenerated,
        errorsEncountered: actual.errors?.length || 0,
        quality: actual.quality // User feedback or validation results
      },
      variance: {
        tokenVariance: this.calculateVariance(
          estimate.estimate.tokensEstimated,
          actual.tokensUsed
        ),
        iterationVariance: this.calculateVariance(
          estimate.estimate.iterationsEstimated,
          actual.iterations
        )
      },
      outcome: actual.outcome // SUCCESS, PARTIAL, FAILURE
    };

    this.metrics.actuals.push(record);
    
    // Learn from this experience
    await this.learn(estimate, record);
    
    return record;
  }

  /**
   * Learn from estimate vs actual comparison
   */
  async learn(estimate, actual) {
    // Identify the pattern
    const pattern = this.identifyPattern(estimate);
    
    // Get or create pattern stats
    if (!this.metrics.patterns.has(pattern)) {
      this.metrics.patterns.set(pattern, {
        pattern,
        samples: [],
        avgTokenVariance: 0,
        avgIterationVariance: 0,
        successRate: 0,
        recommendations: []
      });
    }

    const patternStats = this.metrics.patterns.get(pattern);
    patternStats.samples.push({
      estimate: estimate.estimate,
      actual: actual.actual,
      variance: actual.variance,
      outcome: actual.outcome
    });

    // Update statistics
    this.updatePatternStats(patternStats);
    
    // Generate recommendations if we have enough data
    if (patternStats.samples.length >= 5) {
      patternStats.recommendations = this.generateRecommendations(patternStats);
    }

    // Persist knowledge
    await this.saveKnowledge();
  }

  /**
   * Identify pattern from estimate
   */
  identifyPattern(estimate) {
    // Create a signature from key characteristics
    const scope = estimate.estimate.scope;
    const complexityBucket = this.bucketComplexity(estimate.estimate.complexityScore);
    const clarityBucket = this.bucketClarity(estimate.estimate.clarityScore);
    
    return `${scope}:${complexityBucket}:${clarityBucket}`;
  }

  bucketComplexity(score) {
    if (score >= 8) return 'EXPERT';
    if (score >= 5) return 'COMPLEX';
    if (score >= 3) return 'MODERATE';
    return 'SIMPLE';
  }

  bucketClarity(score) {
    if (score >= 80) return 'CLEAR';
    if (score >= 60) return 'MODERATE';
    return 'AMBIGUOUS';
  }

  /**
   * Update pattern statistics
   */
  updatePatternStats(patternStats) {
    const samples = patternStats.samples;
    const n = samples.length;

    // Calculate averages
    patternStats.avgTokenVariance = 
      samples.reduce((sum, s) => sum + Math.abs(s.variance.tokenVariance), 0) / n;
    
    patternStats.avgIterationVariance = 
      samples.reduce((sum, s) => sum + Math.abs(s.variance.iterationVariance), 0) / n;

    // Success rate
    const successes = samples.filter(s => s.outcome === 'SUCCESS').length;
    patternStats.successRate = (successes / n) * 100;

    // Identify trends
    if (n >= 3) {
      const recent = samples.slice(-3);
      const tokenTrend = this.calculateTrend(recent.map(r => r.variance.tokenVariance));
      const iterationTrend = this.calculateTrend(recent.map(r => r.variance.iterationVariance));
      
      patternStats.trends = { tokenTrend, iterationTrend };
    }
  }

  /**
   * Calculate trend (improving, stable, degrading)
   */
  calculateTrend(values) {
    if (values.length < 2) return 'UNKNOWN';
    
    const deltas = [];
    for (let i = 1; i < values.length; i++) {
      deltas.push(values[i] - values[i-1]);
    }
    
    const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;
    
    if (avgDelta < -5) return 'IMPROVING';
    if (avgDelta > 5) return 'DEGRADING';
    return 'STABLE';
  }

  /**
   * Generate recommendations based on pattern history
   */
  generateRecommendations(patternStats) {
    const recommendations = [];

    // Token estimation accuracy
    if (patternStats.avgTokenVariance > 50) {
      recommendations.push({
        type: 'ESTIMATION',
        issue: 'Token estimates consistently off',
        recommendation: `For ${patternStats.pattern} patterns, multiply estimate by ${
          1 + (patternStats.avgTokenVariance / 100)
        }x`,
        confidence: this.calculateConfidence(patternStats.samples.length)
      });
    }

    // Iteration accuracy
    if (patternStats.avgIterationVariance > 1) {
      recommendations.push({
        type: 'ITERATION',
        issue: 'Iteration estimates inaccurate',
        recommendation: `For ${patternStats.pattern} patterns, add ${
          Math.ceil(patternStats.avgIterationVariance)
        } extra iterations`,
        confidence: this.calculateConfidence(patternStats.samples.length)
      });
    }

    // Success rate
    if (patternStats.successRate < 70) {
      recommendations.push({
        type: 'APPROACH',
        issue: `Low success rate (${patternStats.successRate.toFixed(1)}%)`,
        recommendation: 'Consider breaking this pattern into smaller pieces or requiring clarification',
        confidence: this.calculateConfidence(patternStats.samples.length)
      });
    }

    // Trends
    if (patternStats.trends?.tokenTrend === 'DEGRADING') {
      recommendations.push({
        type: 'TREND',
        issue: 'Token usage increasing over time',
        recommendation: 'Pattern may be accumulating complexity - consider refactoring approach',
        confidence: this.calculateConfidence(patternStats.samples.length)
      });
    }

    return recommendations;
  }

  calculateConfidence(sampleSize) {
    if (sampleSize >= 20) return 'HIGH';
    if (sampleSize >= 10) return 'MEDIUM';
    if (sampleSize >= 5) return 'LOW';
    return 'VERY_LOW';
  }

  /**
   * Get recommendations for a new request
   */
  getRecommendations(estimate) {
    const pattern = this.identifyPattern(estimate);
    const patternStats = this.metrics.patterns.get(pattern);
    
    if (!patternStats || patternStats.samples.length < 5) {
      return {
        available: false,
        reason: 'Insufficient data for this pattern',
        recommendations: []
      };
    }

    return {
      available: true,
      pattern,
      stats: {
        samples: patternStats.samples.length,
        successRate: patternStats.successRate,
        avgTokenVariance: patternStats.avgTokenVariance
      },
      recommendations: patternStats.recommendations
    };
  }

  /**
   * Record a failure for post-mortem analysis
   */
  recordFailure(sessionId, failure) {
    this.metrics.failures.push({
      sessionId,
      timestamp: Date.now(),
      error: failure.error,
      stage: failure.stage,
      context: failure.context,
      rootCause: failure.rootCause || 'UNKNOWN'
    });

    // Analyze failure patterns
    this.analyzeFailures();
  }

  /**
   * Analyze failure patterns to prevent recurrence
   */
  analyzeFailures() {
    if (this.metrics.failures.length < 3) return;

    const recent = this.metrics.failures.slice(-10);
    
    // Group by root cause
    const byRootCause = {};
    recent.forEach(f => {
      const cause = f.rootCause;
      if (!byRootCause[cause]) byRootCause[cause] = [];
      byRootCause[cause].push(f);
    });

    // Identify recurring issues
    for (const [cause, failures] of Object.entries(byRootCause)) {
      if (failures.length >= 3) {
        console.warn(`⚠️  RECURRING FAILURE: ${cause} (${failures.length} occurrences)`);
        // In real implementation, this would trigger alerts or automatic mitigations
      }
    }
  }

  calculateVariance(estimated, actual) {
    if (estimated === 0) return actual > 0 ? 100 : 0;
    return ((actual - estimated) / estimated) * 100;
  }

  /**
   * Persist knowledge to disk
   */
  async saveKnowledge() {
    try {
      const data = {
        version: '13.0',
        timestamp: Date.now(),
        patterns: Array.from(this.metrics.patterns.entries()),
        failures: this.metrics.failures.slice(-100), // Keep last 100
        summary: {
          totalSamples: this.metrics.actuals.length,
          patternsLearned: this.metrics.patterns.size
        }
      };

      const filepath = path.join(this.storageDir, 'knowledge.json');
      await fs.writeFile(filepath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.warn('Failed to save knowledge:', error.message);
    }
  }

  /**
   * Load knowledge from disk
   */
  async loadKnowledge() {
    try {
      const filepath = path.join(this.storageDir, 'knowledge.json');
      const data = JSON.parse(await fs.readFile(filepath, 'utf8'));
      
      this.metrics.patterns = new Map(data.patterns);
      this.metrics.failures = data.failures || [];
      
      console.log(`📚 Loaded knowledge: ${data.summary.totalSamples} samples, ${data.summary.patternsLearned} patterns`);
    } catch (error) {
      // No existing knowledge - starting fresh
      console.log('📚 Starting with fresh knowledge base');
    }
  }
}

// ============================================================================
// COHERENCE ENGINE - Context Continuity Across Sessions
// ============================================================================

class CoherenceEngine {
  constructor(storageDir = './.magnus-sessions') {
    this.storageDir = storageDir;
    this.currentSession = null;
    this.initialized = false;
  }

  async initialize() {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
      this.initialized = true;
    } catch (error) {
      console.warn('Coherence engine initialization failed:', error.message);
    }
  }

  /**
   * Start a new development session
   */
  async startSession(request, analysis) {
    const sessionId = this.generateSessionId();
    
    const session = {
      id: sessionId,
      startTime: Date.now(),
      request: request,
      analysis: {
        complexity: analysis.complexity,
        clarity: analysis.clarity,
        scope: analysis.scope
      },
      architecture: {
        decisions: [],
        constraints: [],
        patterns: []
      },
      artifacts: [],
      context: {
        requirements: this.extractRequirements(request),
        assumptions: analysis.assumptions || [],
        risks: analysis.risks || []
      },
      iterations: [],
      status: 'ACTIVE'
    };

    this.currentSession = session;
    await this.saveSession(session);
    
    return session;
  }

  /**
   * Record an architectural decision
   */
  async recordDecision(decision) {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const record = {
      id: this.generateDecisionId(),
      timestamp: Date.now(),
      decision: decision.decision,
      rationale: decision.rationale,
      alternatives: decision.alternatives || [],
      consequences: decision.consequences || [],
      status: 'ACTIVE'
    };

    this.currentSession.architecture.decisions.push(record);
    await this.saveSession(this.currentSession);
    
    return record;
  }

  /**
   * Record a constraint
   */
  async recordConstraint(constraint) {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const record = {
      id: this.generateConstraintId(),
      timestamp: Date.now(),
      constraint: constraint.constraint,
      type: constraint.type, // TECHNICAL, BUSINESS, RESOURCE
      impact: constraint.impact,
      status: 'ACTIVE'
    };

    this.currentSession.architecture.constraints.push(record);
    await this.saveSession(this.currentSession);
    
    return record;
  }

  /**
   * Record an artifact (file, component, module)
   */
  async recordArtifact(artifact) {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const record = {
      id: this.generateArtifactId(),
      timestamp: Date.now(),
      type: artifact.type, // FILE, COMPONENT, MODULE
      name: artifact.name,
      path: artifact.path,
      description: artifact.description,
      dependencies: artifact.dependencies || [],
      exports: artifact.exports || [],
      status: 'CREATED'
    };

    this.currentSession.artifacts.push(record);
    await this.saveSession(this.currentSession);
    
    return record;
  }

  /**
   * Record an iteration (refinement cycle)
   */
  async recordIteration(iteration) {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    const record = {
      id: this.generateIterationId(),
      timestamp: Date.now(),
      number: this.currentSession.iterations.length + 1,
      goal: iteration.goal,
      changes: iteration.changes || [],
      outcome: iteration.outcome,
      learnings: iteration.learnings || []
    };

    this.currentSession.iterations.push(record);
    await this.saveSession(this.currentSession);
    
    return record;
  }

  /**
   * Resume a previous session
   */
  async resumeSession(sessionId) {
    const session = await this.loadSession(sessionId);
    
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    // Reconstruct context
    const context = {
      sessionId: session.id,
      originalRequest: session.request,
      
      // Architecture context
      decisions: session.architecture.decisions.filter(d => d.status === 'ACTIVE'),
      constraints: session.architecture.constraints.filter(c => c.status === 'ACTIVE'),
      patterns: session.architecture.patterns,
      
      // Artifact context
      existingArtifacts: session.artifacts.filter(a => a.status !== 'DELETED'),
      
      // Historical context
      iterationHistory: session.iterations.map(i => ({
        number: i.number,
        goal: i.goal,
        outcome: i.outcome
      })),
      
      // Current state
      requirements: session.context.requirements,
      assumptions: session.context.assumptions,
      risks: session.context.risks,
      
      // Continuity instructions
      continuityGuidance: this.generateContinuityGuidance(session)
    };

    this.currentSession = session;
    return context;
  }

  /**
   * Generate guidance for maintaining continuity
   */
  generateContinuityGuidance(session) {
    const guidance = [];

    // Review architectural decisions
    if (session.architecture.decisions.length > 0) {
      guidance.push({
        type: 'ARCHITECTURE',
        instruction: 'Maintain consistency with previous architectural decisions',
        details: session.architecture.decisions.map(d => `- ${d.decision}: ${d.rationale}`)
      });
    }

    // Honor constraints
    if (session.architecture.constraints.length > 0) {
      guidance.push({
        type: 'CONSTRAINTS',
        instruction: 'Respect existing constraints',
        details: session.architecture.constraints.map(c => `- ${c.constraint} (${c.type})`)
      });
    }

    // Maintain patterns
    if (session.architecture.patterns.length > 0) {
      guidance.push({
        type: 'PATTERNS',
        instruction: 'Continue using established patterns',
        details: session.architecture.patterns
      });
    }

    // Build on existing artifacts
    if (session.artifacts.length > 0) {
      guidance.push({
        type: 'ARTIFACTS',
        instruction: 'Integrate with existing artifacts',
        details: session.artifacts.map(a => `- ${a.name} (${a.type}): ${a.description}`)
      });
    }

    // Learn from iterations
    if (session.iterations.length > 0) {
      const learnings = session.iterations.flatMap(i => i.learnings);
      if (learnings.length > 0) {
        guidance.push({
          type: 'LEARNINGS',
          instruction: 'Apply learnings from previous iterations',
          details: learnings
        });
      }
    }

    return guidance;
  }

  /**
   * End current session
   */
  async endSession(outcome) {
    if (!this.currentSession) {
      throw new Error('No active session');
    }

    this.currentSession.endTime = Date.now();
    this.currentSession.duration = this.currentSession.endTime - this.currentSession.startTime;
    this.currentSession.outcome = outcome;
    this.currentSession.status = 'COMPLETED';

    await this.saveSession(this.currentSession);
    
    const summary = this.generateSessionSummary(this.currentSession);
    this.currentSession = null;
    
    return summary;
  }

  /**
   * Generate session summary
   */
  generateSessionSummary(session) {
    return {
      sessionId: session.id,
      duration: session.duration,
      outcome: session.outcome,
      stats: {
        decisions: session.architecture.decisions.length,
        constraints: session.architecture.constraints.length,
        artifacts: session.artifacts.length,
        iterations: session.iterations.length
      },
      artifacts: session.artifacts.map(a => ({
        name: a.name,
        type: a.type,
        path: a.path
      })),
      learnings: session.iterations.flatMap(i => i.learnings),
      recommendations: this.generateRecommendations(session)
    };
  }

  /**
   * Generate recommendations based on session
   */
  generateRecommendations(session) {
    const recommendations = [];

    // Too many iterations?
    if (session.iterations.length > 5) {
      recommendations.push({
        type: 'PROCESS',
        issue: 'High iteration count',
        recommendation: 'Consider breaking future similar tasks into smaller phases'
      });
    }

    // Complex architecture?
    if (session.architecture.decisions.length > 10) {
      recommendations.push({
        type: 'ARCHITECTURE',
        issue: 'Many architectural decisions',
        recommendation: 'Document architecture in ADR format for future reference'
      });
    }

    // Many constraints?
    if (session.architecture.constraints.length > 5) {
      recommendations.push({
        type: 'CONSTRAINTS',
        issue: 'Many constraints encountered',
        recommendation: 'Consider documenting constraints upfront in future projects'
      });
    }

    return recommendations;
  }

  extractRequirements(request) {
    // Simple extraction - in real implementation, use NLP
    return {
      functional: [],
      nonFunctional: [],
      implicit: []
    };
  }

  async saveSession(session) {
    try {
      const filepath = path.join(this.storageDir, `${session.id}.json`);
      await fs.writeFile(filepath, JSON.stringify(session, null, 2));
    } catch (error) {
      console.warn('Failed to save session:', error.message);
    }
  }

  async loadSession(sessionId) {
    try {
      const filepath = path.join(this.storageDir, `${sessionId}.json`);
      return JSON.parse(await fs.readFile(filepath, 'utf8'));
    } catch (error) {
      return null;
    }
  }

  generateSessionId() {
    return `session-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  generateDecisionId() {
    return `decision-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  generateConstraintId() {
    return `constraint-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  generateArtifactId() {
    return `artifact-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }

  generateIterationId() {
    return `iteration-${Date.now()}-${crypto.randomBytes(4).toString('hex')}`;
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export { LearningEngine, CoherenceEngine };
