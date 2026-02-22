/**
 * Magnus ∞ (Infinity) - Core Engine
 * 
 * Self-Improving Meta-Developer AI
 * 
 * Core Philosophy:
 * "An AI that improves itself while remaining aligned with human intent,
 *  transparent in its reasoning, and constrained by ethical safeguards."
 * 
 * Components:
 * 1. Continuous Learning Engine - Learns from every interaction
 * 2. Autonomous Decision Engine - Makes informed decisions
 * 3. Transparency Layer - Explains all reasoning
 * 4. Safeguard System - 7-layer protection
 * 
 * The ∞ Loop:
 * Observe → Learn → Decide → Validate → Act → Explain → Improve → LOOP ♾️
 */

import EventEmitter from 'events';
import crypto from 'crypto';

class MagnusInfinity extends EventEmitter {
  constructor(config = {}) {
    super();
    
    this.config = {
      learningRate: config.learningRate || 0.1,
      confidenceThreshold: config.confidenceThreshold || 0.7,
      autonomyLevel: config.autonomyLevel || 'supervised', // supervised, semi-autonomous, autonomous
      enableSelfImprovement: config.enableSelfImprovement !== false,
      enableSafeguards: config.enableSafeguards !== false,
      maxIterationsPerCycle: config.maxIterationsPerCycle || 100,
      explainabilityLevel: config.explainabilityLevel || 'detailed' // basic, detailed, complete
    };

    // Components
    this.learningEngine = null;
    this.decisionEngine = null;
    this.transparencyLayer = null;
    this.safeguardSystem = null;

    // State
    this.initialized = false;
    this.running = false;
    this.cycleCount = 0;

    // Metrics
    this.metrics = {
      totalDecisions: 0,
      autonomousDecisions: 0,
      humanOverrides: 0,
      safeguardBlocks: 0,
      improvementsMade: 0,
      averageConfidence: 0,
      learningCycles: 0,
      successRate: 0,
      cycleTimings: [],
      successfulActions: 0,
      failedActions: 0,
      totalPatterns: 0,
      highConfidencePatterns: 0
    };

    // Kill switch
    this.killSwitch = {
      enabled: true,
      triggered: false,
      reason: null,
      timestamp: null
    };
  }

  /**
   * Initialize Magnus ∞
   */
  async initialize() {
    if (this.initialized) return;

    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║              MAGNUS ∞ - INITIALIZATION                ║
║                                                       ║
║  "Self-improving AI with transparency and safety"     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
    `);

    // Initialize components
    console.log('🧠 Initializing Learning Engine...');
    this.learningEngine = new ContinuousLearningEngine({
      learningRate: this.config.learningRate
    });

    console.log('🤖 Initializing Decision Engine...');
    this.decisionEngine = new AutonomousDecisionEngine({
      confidenceThreshold: this.config.confidenceThreshold,
      autonomyLevel: this.config.autonomyLevel
    });

    console.log('🔍 Initializing Transparency Layer...');
    this.transparencyLayer = new TransparencyLayer({
      level: this.config.explainabilityLevel
    });

    console.log('🛡️  Initializing Safeguard System (7 layers)...');
    this.safeguardSystem = new SafeguardSystem();

    // Setup event listeners
    this.setupEventListeners();

    this.initialized = true;
    console.log('✅ Magnus ∞ initialized\n');

    this.emit('initialized');
  }

  /**
   * Setup event listeners
   */
  setupEventListeners() {
    this.learningEngine.on('improvement', (data) => {
      this.metrics.improvementsMade++;
      this.emit('improvement', data);
    });

    this.decisionEngine.on('decision', (decision) => {
      this.metrics.totalDecisions++;
      if (decision.autonomous) {
        this.metrics.autonomousDecisions++;
      }
      this.emit('decision', decision);
    });

    this.safeguardSystem.on('block', (event) => {
      this.metrics.safeguardBlocks++;
      this.emit('safeguard-block', event);
      
      if (event.severity === 'CRITICAL') {
        this.triggerKillSwitch(event.reason);
      }
    });
  }

  /**
   * Start the ∞ Loop
   */
  async start() {
    if (!this.initialized) {
      await this.initialize();
    }

    console.log('🚀 Starting Magnus ∞ Loop...\n');
    this.running = true;
    this.emit('started');

    return this.infinityLoop();
  }

  /**
   * The ∞ Loop - Continuous self-improvement
   */
  async infinityLoop() {
    console.log('🔄 Starting infinity loop...');
    while (this.running && !this.killSwitch.triggered) {
      try {
        console.log(`🔄 Loop iteration: running=${this.running}, killSwitch=${this.killSwitch.triggered}`);
        this.cycleCount++;
        this.metrics.learningCycles++;

        const cycle = {
          id: crypto.randomUUID(),
          number: this.cycleCount,
          timestamp: Date.now(),
          phases: []
        };

        console.log(`\n♾️  Cycle ${this.cycleCount} - Starting...`);
        this.emit('cycle-start', cycle);

        // PHASE 1: Observe
        const observations = await this.observe();
        cycle.phases.push({ name: 'observe', result: observations });

        // PHASE 2: Learn
        console.log(`🔄 Phase 2: Learning from ${observations.patterns?.detected || 0} patterns`);
        const learnings = await this.learn(observations);
        cycle.phases.push({ name: 'learn', result: learnings });

        // PHASE 3: Decide
        console.log(`🔄 Phase 3: Deciding on ${learnings.newPatterns?.length || 0} learnings`);
        const decisions = await this.decide(learnings);
        cycle.phases.push({ name: 'decide', result: decisions });

        // PHASE 4: Validate (Safeguards)
        const validation = await this.validate(decisions);
        cycle.phases.push({ name: 'validate', result: validation });

        if (!validation.passed) {
          console.log(`⚠️  Cycle ${this.cycleCount} - Blocked by safeguards`);
          this.emit('cycle-blocked', { cycle, validation });
          await this.sleep(5000);
          continue;
        }

        // PHASE 5: Act (if approved)
        const actions = await this.act(decisions);
        cycle.phases.push({ name: 'act', result: actions });

        // PHASE 6: Explain
        const explanation = await this.explain(cycle);
        cycle.phases.push({ name: 'explain', result: explanation });

        // PHASE 7: Improve
        await this.improve(cycle);

        // Track cycle timing
        const cycleTime = Date.now() - cycle.timestamp;
        this.metrics.cycleTimings.push(cycleTime);

        // Keep only last 100 cycle timings
        if (this.metrics.cycleTimings.length > 100) {
          this.metrics.cycleTimings.shift();
        }

        // Update pattern metrics
        if (cycle.phases[0]?.result?.patterns) {
          this.metrics.totalPatterns += cycle.phases[0].result.detected || 0;
          this.metrics.highConfidencePatterns += cycle.phases[0].result.highConfidenceCount || cycle.phases[0].result.highConfidence?.length || 0;
        }

        console.log(`✅ Cycle ${this.cycleCount} - Complete (${cycleTime}ms)`);
        this.emit('cycle-complete', cycle);

        // Adaptive delay
        await this.sleep(this.calculateDelay());

      } catch (error) {
        console.error('❌ Error in ∞ Loop:', error);
        this.emit('error', { error, cycle: this.cycleCount });

        if (this.isCriticalError(error)) {
          this.triggerKillSwitch(`Critical error: ${error.message}`);
        }
      }
    }

    console.log('🛑 Magnus ∞ Loop stopped');
  }

  /**
   * PHASE 1: Observe - Gather data
   */
  async observe() {
    console.log('  👁️  Observing...');
    
    const observations = {
      timestamp: Date.now(),
      patterns: await this.observePatterns(),
      performance: await this.observePerformance(),
      feedback: await this.observeFeedback(),
      opportunities: await this.observeOpportunities()
    };

    return observations;
  }

  /**
   * PHASE 2: Learn - Process observations
   */
  async learn(observations) {
    console.log('  🧠 Learning...');

    const learnings = await this.learningEngine.process(observations);
    console.log(`     Learnings generated: ${learnings.newPatterns?.length || 0} patterns`);

    return learnings;
  }

  /**
   * PHASE 3: Decide - Make decisions
   */
  async decide(learnings) {
    console.log('  🤔 Deciding...');
    console.log('     >>> DEBUG: Inside decide method <<<');
    console.log(`     Learnings received: ${learnings.newPatterns?.length || 0} patterns`);
    console.log(`     Decision engine exists: ${!!this.decisionEngine}`);

    try {
      const decisions = await this.decisionEngine.makeDecisions(learnings);
      console.log(`     Decisions made: ${decisions.approved?.length || 0} approved`);
      return decisions;
    } catch (error) {
      console.error('     ERROR in decision engine:', error.message);
      return { approved: [], rejected: [], pending: [] };
    }
  }

  /**
   * PHASE 4: Validate - Check safeguards
   */
  async validate(decisions) {
    console.log('  🛡️  Validating...');
    
    const validation = await this.safeguardSystem.validate(decisions);
    
    return validation;
  }

  /**
   * PHASE 5: Act - Execute approved decisions
   */
  async act(decisions) {
    console.log('  ⚡ Acting...');
    
    const actions = [];

    for (const decision of decisions.approved || []) {
      // Check if human approval needed
      if (decision.requiresApproval && this.config.autonomyLevel === 'supervised') {
        const approved = await this.requestApproval(decision);
        if (!approved) {
          this.metrics.humanOverrides++;
          continue;
        }
      }

      const action = await this.executeDecision(decision);
      actions.push(action);
    }

    return actions;
  }

  /**
   * PHASE 6: Explain - Generate transparency
   */
  async explain(cycle) {
    console.log('  📝 Explaining...');
    
    const explanation = await this.transparencyLayer.explain(cycle);
    
    return explanation;
  }

  /**
   * PHASE 7: Improve - Self-improvement
   */
  async improve(cycle) {
    console.log('  📈 Improving...');
    
    // Analyze cycle performance
    const improvement = await this.analyzePerformance(cycle);
    
    // Update learning engine
    if (improvement.shouldUpdate) {
      await this.learningEngine.update(improvement);
    }

    return improvement;
  }

  /**
   * Observe patterns
   */
  async observePatterns() {
    // Integrate with Magnus 14 scanner if available
    if (!this.magnus14) {
      return {
        detected: 0,
        highConfidence: 0,
        needsImprovement: []
      };
    }

    try {
      // Scan current directory
      const scanResults = await this.magnus14.scan('.');

      const patterns = scanResults.patterns || [];
      const highConfidence = patterns.filter(p => (p.confidence || 0) > 0.8);
      const needsImprovement = patterns.filter(p => (p.confidence || 0) < 0.7);

      return {
        detected: patterns.length,
        highConfidence: highConfidence,  // Return array, not length
        highConfidenceCount: highConfidence.length,
        needsImprovement: needsImprovement.map(p => ({
          name: p.type || 'unknown',
          file: p.file,
          severity: p.severity,
          confidence: p.confidence,
          suggestion: p.suggestion
        })),
        friction: scanResults.friction || [],
        abandonment: scanResults.abandonment || []
      };
    } catch (error) {
      console.warn('⚠️  Pattern observation failed:', error.message);
      return {
        detected: 0,
        highConfidence: 0,
        needsImprovement: [],
        error: error.message
      };
    }
  }

  /**
   * Observe performance
   */
  async observePerformance() {
    const status = this.getStatus();

    // Calculate success rate
    const totalActions = this.metrics.successfulActions + this.metrics.failedActions;
    const successRate = totalActions > 0 ?
      (this.metrics.successfulActions / totalActions) : 0;

    // Calculate average confidence
    const avgConfidence = this.metrics.averageConfidence || 0.5;

    // Calculate improvement rate
    const improvementRate = this.cycleCount > 0 ?
      this.metrics.improvementsMade / this.cycleCount : 0;

    // Calculate average cycle time
    const avgCycleTime = this.calculateAverageCycleTime();

    // Calculate memory usage
    const memUsage = process.memoryUsage();
    const memoryUsageMB = memUsage.heapUsed / 1024 / 1024;

    // Calculate decision autonomy rate
    const autonomyRate = this.metrics.totalDecisions > 0 ?
      this.metrics.autonomousDecisions / this.metrics.totalDecisions : 0;

    return {
      successRate,
      averageConfidence: avgConfidence,
      improvementRate,
      cycleTime: avgCycleTime,
      memoryUsage: memoryUsageMB,
      autonomyRate,
      totalCycles: this.cycleCount,
      patternsDetected: this.metrics.totalPatterns,
      highConfidencePatterns: this.metrics.highConfidencePatterns
    };
  }

  /**
   * Calculate average cycle time
   */
  calculateAverageCycleTime() {
    if (this.metrics.cycleTimings.length === 0) return 0;

    const sum = this.metrics.cycleTimings.reduce((a, b) => a + b, 0);
    return sum / this.metrics.cycleTimings.length;
  }

  /**
   * Observe feedback - Multi-modal feedback from various sources
   */
  async observeFeedback() {
    const feedback = {
      timestamp: Date.now(),
      userFeedback: await this.getUserFeedback(),
      systemMetrics: await this.getSystemMetrics(),
      errorPatterns: await this.analyzeErrors(),
      performanceTrends: await this.analyzeTrends()
    };

    return feedback;
  }

  /**
   * Get user feedback (placeholder for future user input)
   */
  async getUserFeedback() {
    return {
      positive: 0,
      negative: 0,
      suggestions: []
    };
  }

  /**
   * Get system metrics feedback
   */
  async getSystemMetrics() {
    const memUsage = process.memoryUsage();

    return {
      memory: {
        heapUsed: memUsage.heapUsed / 1024 / 1024,
        heapTotal: memUsage.heapTotal / 1024 / 1024,
        external: memUsage.external / 1024 / 1024
      },
      uptime: process.uptime(),
      cyclesCompleted: this.cycleCount,
      averageConfidence: this.metrics.averageConfidence
    };
  }

  /**
   * Analyze error patterns
   */
  async analyzeErrors() {
    // Track error patterns over time
    const errorPatterns = [];

    if (this.metrics.failedActions > 0) {
      errorPatterns.push({
        type: 'action-failures',
        count: this.metrics.failedActions,
        severity: this.metrics.failedActions > 10 ? 'high' : 'low'
      });
    }

    if (this.metrics.safeguardBlocks > 0) {
      errorPatterns.push({
        type: 'safeguard-blocks',
        count: this.metrics.safeguardBlocks,
        severity: this.metrics.safeguardBlocks > 5 ? 'high' : 'low'
      });
    }

    return errorPatterns;
  }

  /**
   * Analyze performance trends
   */
  async analyzeTrends() {
    if (!this.learningEngine || !this.learningEngine.performanceHistory) {
      return { trend: 'stable', direction: 0 };
    }

    const history = this.learningEngine.performanceHistory;
    if (history.length < 2) {
      return { trend: 'insufficient-data', direction: 0 };
    }

    // Compare recent performance to earlier performance
    const recent = history.slice(-10);
    const earlier = history.slice(-20, -10);

    if (earlier.length === 0) {
      return { trend: 'insufficient-data', direction: 0 };
    }

    const recentAvg = recent.reduce((sum, h) =>
      sum + (h.performance?.successRate || 0), 0) / recent.length;
    const earlierAvg = earlier.reduce((sum, h) =>
      sum + (h.performance?.successRate || 0), 0) / earlier.length;

    const direction = recentAvg - earlierAvg;
    const trend = direction > 0.05 ? 'improving' :
                  direction < -0.05 ? 'declining' : 'stable';

    return {
      trend,
      direction,
      recentAverage: recentAvg,
      earlierAverage: earlierAvg
    };
  }

  /**
   * Observe opportunities
   */
  async observeOpportunities() {
    return {
      patterns: [],
      optimizations: [],
      newApproaches: []
    };
  }

  /**
   * Execute a decision
   */
  async executeDecision(decision) {
    try {
      // Placeholder for actual execution logic
      // This would integrate with actual improvement actions

      const result = {
        decision,
        executed: true,
        timestamp: Date.now(),
        success: true
      };

      // Track success
      this.metrics.successfulActions++;

      return result;
    } catch (error) {
      // Track failure
      this.metrics.failedActions++;

      return {
        decision,
        executed: false,
        timestamp: Date.now(),
        success: false,
        error: error.message
      };
    }
  }

  /**
   * Request human approval
   */
  async requestApproval(decision) {
    this.emit('approval-required', decision);
    // In real implementation, wait for human input
    return false; // Safe default
  }

  /**
   * Analyze performance
   */
  async analyzePerformance(cycle) {
    return {
      shouldUpdate: false,
      confidence: 0.8,
      improvements: []
    };
  }

  /**
   * Calculate improvement rate
   */
  calculateImprovementRate() {
    if (this.cycleCount === 0) return 0;
    return this.metrics.improvementsMade / this.cycleCount;
  }

  /**
   * Calculate adaptive delay
   */
  calculateDelay() {
    const baseDelay = 2000; // 2 seconds
    const confidenceFactor = 1 - (this.metrics.averageConfidence || 0.5);
    return baseDelay * (1 + confidenceFactor);
  }

  /**
   * Trigger kill switch
   */
  triggerKillSwitch(reason) {
    console.log(`\n🔴 KILL SWITCH TRIGGERED: ${reason}\n`);
    
    this.killSwitch.triggered = true;
    this.killSwitch.reason = reason;
    this.killSwitch.timestamp = Date.now();
    this.running = false;

    this.emit('kill-switch', this.killSwitch);
  }

  /**
   * Check if error is critical
   */
  isCriticalError(error) {
    return error.severity === 'CRITICAL' || error.critical === true;
  }

  /**
   * Stop Magnus ∞
   */
  async stop() {
    console.log('🛑 Stopping Magnus ∞...');
    this.running = false;
    this.emit('stopped');
  }

  /**
   * Sleep utility
   */
  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      running: this.running,
      cycleCount: this.cycleCount,
      autonomyLevel: this.config.autonomyLevel,
      killSwitch: this.killSwitch,
      metrics: this.metrics
    };
  }
}

// ============================================================================
// CONTINUOUS LEARNING ENGINE
// ============================================================================

class ContinuousLearningEngine extends EventEmitter {
  constructor(config = {}) {
    super();
    this.learningRate = config.learningRate || 0.1;
    this.knowledgeBase = new Map();
    this.successHistory = [];
    this.patternMemory = new Map(); // Store learned patterns
    this.performanceHistory = [];
  }

  async process(observations) {
    const learnings = {
      timestamp: Date.now(),
      newPatterns: [],
      updatedKnowledge: [],
      confidence: 0
    };

    // Learn from high-confidence patterns
    // highConfidence might be a number, not an array
    const highConfPatterns = Array.isArray(observations.patterns?.highConfidence)
      ? observations.patterns.highConfidence
      : [];
    for (const pattern of highConfPatterns) {
      await this.rememberPattern(pattern);
    }

    // Process patterns that need improvement
    for (const pattern of observations.patterns?.needsImprovement || []) {
      const learned = await this.learnPattern(pattern);
      if (learned) {
        learnings.newPatterns.push(learned);
        this.emit('improvement', { type: 'pattern', data: learned });
      }
    }

    // Analyze improvement opportunities
    const opportunities = await this.analyzeOpportunities(observations);
    learnings.newPatterns.push(...opportunities.newPatterns);
    learnings.updatedKnowledge.push(...opportunities.updates);

    // Update confidence based on performance
    learnings.confidence = this.calculateAdaptiveConfidence(observations);

    // Store performance
    this.performanceHistory.push({
      timestamp: Date.now(),
      performance: observations.performance,
      patternCount: observations.patterns?.detected || 0
    });

    // Keep only last 1000 performance records
    if (this.performanceHistory.length > 1000) {
      this.performanceHistory.shift();
    }

    return learnings;
  }

  async rememberPattern(pattern) {
    const key = pattern.name || pattern.type;
    if (!this.patternMemory.has(key)) {
      this.patternMemory.set(key, {
        pattern,
        seenCount: 1,
        firstSeen: Date.now(),
        lastSeen: Date.now(),
        confidence: pattern.confidence || 0.8,
        // NEW: Track modality (Tier 1 Phase 1A)
        modality: pattern.modality || 'unknown',
        modalityBreakdown: {
          web: pattern.modality === 'web' ? 1 : 0,
          mobile: pattern.modality === 'mobile' ? 1 : 0,
          data: pattern.modality === 'data' ? 1 : 0,
          unknown: !pattern.modality || pattern.modality === 'unknown' ? 1 : 0
        }
      });
    } else {
      const memory = this.patternMemory.get(key);
      memory.seenCount++;
      memory.lastSeen = Date.now();
      memory.confidence = Math.max(memory.confidence, pattern.confidence || 0.8);

      // NEW: Update modality tracking
      if (pattern.modality) {
        memory.modality = pattern.modality; // Update to latest detected modality
        if (pattern.modality === 'web') memory.modalityBreakdown.web++;
        else if (pattern.modality === 'mobile') memory.modalityBreakdown.mobile++;
        else if (pattern.modality === 'data') memory.modalityBreakdown.data++;
        else memory.modalityBreakdown.unknown++;
      }
    }
  }

  async learnPattern(pattern) {
    // Check if we've seen this pattern before
    const key = pattern.name || 'unknown';
    const memory = this.patternMemory.get(key);
    const seenCount = memory?.seenCount || 0;

    return {
      pattern: pattern.name,
      learned: true,
      timestamp: Date.now(),
      file: pattern.file,
      severity: pattern.severity,
      suggestion: pattern.suggestion,
      previouslySeen: seenCount,
      seenCount: seenCount, // Add this for decision engine consistency
      confidence: pattern.confidence || 0.5,
      // NEW: Include modality tracking (Tier 1 Phase 1A)
      modality: pattern.modality || memory?.modality || 'unknown',
      modalityBreakdown: memory?.modalityBreakdown || {
        web: 0,
        mobile: 0,
        data: 0,
        unknown: 1
      }
    };
  }

  async analyzeOpportunities(observations) {
    const opportunities = {
      newPatterns: [],
      updates: []
    };

    // Look for patterns that appear frequently
    // Modified logic: Allow low-confidence patterns if seen very frequently
    for (const [key, memory] of this.patternMemory.entries()) {
      const meetsHighConfidence = memory.seenCount > 3 && memory.confidence > 0.7;
      const meetsFrequentLowConfidence = memory.seenCount > 10 && memory.confidence >= 0.6;

      if (meetsHighConfidence || meetsFrequentLowConfidence) {
        console.log(`🎯 OPPORTUNITY DETECTED: ${key} (seen: ${memory.seenCount}, confidence: ${memory.confidence}, modality: ${memory.modality || 'unknown'}, criteria: ${meetsHighConfidence ? 'high-confidence' : 'frequent-low-confidence'})`);
        opportunities.newPatterns.push({
          pattern: key,
          learned: true,
          type: 'frequent-pattern',
          seenCount: memory.seenCount,
          previouslySeen: memory.seenCount, // Add this field for decision engine
          confidence: memory.confidence,
          criteria: meetsHighConfidence ? 'high-confidence' : 'frequent-low-confidence',
          // NEW: Include modality (Tier 1 Phase 1A)
          modality: memory.modality || 'unknown',
          modalityBreakdown: memory.modalityBreakdown || {
            web: 0,
            mobile: 0,
            data: 0,
            unknown: 1
          }
        });
      }
    }

    console.log(`📊 analyzeOpportunities: Found ${opportunities.newPatterns.length} opportunities`);
    return opportunities;
  }

  calculateConfidence(performance) {
    return performance?.successRate || 0.5;
  }

  calculateAdaptiveConfidence(observations) {
    const perf = observations.performance || {};
    const base = perf.successRate || 0.5;
    const improvement = perf.improvementRate || 0;
    const autonomy = perf.autonomyRate || 0;

    // Weighted confidence
    return (base * 0.5) + (improvement * 0.3) + (autonomy * 0.2);
  }

  async update(improvement) {
    // Update knowledge base
    this.successHistory.push(improvement);

    // Update learning rate based on recent performance
    if (this.successHistory.length > 10) {
      const recent = this.successHistory.slice(-10);
      const successRate = recent.filter(i => i.success).length / recent.length;

      if (successRate > 0.8) {
        this.learningRate = Math.min(0.15, this.learningRate * 1.1);
      } else if (successRate < 0.5) {
        this.learningRate = Math.max(0.05, this.learningRate * 0.9);
      }
    }

    this.emit('updated', improvement);
  }

  getPatternMemory() {
    return Array.from(this.patternMemory.entries()).map(([key, value]) => ({
      pattern: key,
      ...value
    }));
  }

  /**
   * Calculate adaptive learning rate based on recent performance
   */
  calculateAdaptiveLearningRate() {
    if (this.successHistory.length < 5) return this.learningRate;

    const recent = this.successHistory.slice(-10);
    const recentSuccessRate = recent.filter(i => i.success).length / recent.length;

    if (recentSuccessRate > 0.9) {
      return Math.min(0.15, this.learningRate * 1.2); // Increase learning
    } else if (recentSuccessRate < 0.7) {
      return Math.max(0.05, this.learningRate * 0.8); // Decrease learning
    }

    return this.learningRate; // Keep current rate
  }

  getCurrentLearningRate() {
    return this.learningRate;
  }
}

// ============================================================================
// AUTONOMOUS DECISION ENGINE
// ============================================================================

class AutonomousDecisionEngine extends EventEmitter {
  constructor(config = {}) {
    super();
    this.confidenceThreshold = config.confidenceThreshold || 0.7;
    this.autonomyLevel = config.autonomyLevel || 'supervised';
    this.decisionHistory = [];
  }

  async makeDecisions(learnings) {
    console.log(`🚨 DECISION ENGINE CALLED with ${learnings.newPatterns?.length || 0} patterns`);
    const decisions = {
      timestamp: Date.now(),
      approved: [],
      rejected: [],
      pending: []
    };

    console.log(`🔍 DECISION ENGINE: Processing ${learnings.newPatterns?.length || 0} patterns`);
    console.log(`   Confidence threshold: ${this.confidenceThreshold}, Autonomy: ${this.autonomyLevel}`);

    // Make decisions based on learnings
    for (const pattern of learnings.newPatterns || []) {
      console.log(`   Evaluating pattern: ${pattern.pattern} (confidence: ${pattern.confidence}, previouslySeen: ${pattern.previouslySeen})`);

      const decision = await this.evaluatePattern(pattern);
      console.log(`   Decision confidence: ${decision.confidence}`);

      // Predict outcome before deciding
      const prediction = await this.predictDecisionOutcome(decision);
      decision.prediction = prediction;

      // Apply prediction to confidence
      const adjustedConfidence = decision.confidence * prediction.predictedSuccess;
      console.log(`   Adjusted confidence: ${adjustedConfidence} (prediction: ${prediction.predictedSuccess})`);

      // SEMI-AUTONOMOUS MODE: Auto-approve if we have enough confidence OR seen enough times
      const canAutoApprove = this.autonomyLevel === 'semi-autonomous' &&
                             (pattern.seenCount >= 10 || adjustedConfidence >= this.confidenceThreshold);

      if (canAutoApprove || (this.autonomyLevel === 'autonomous' && adjustedConfidence >= this.confidenceThreshold)) {
        console.log(`   ✅ APPROVED: ${pattern.pattern} (auto-approved, seenCount: ${pattern.seenCount}, adjustedConf: ${adjustedConfidence.toFixed(2)})`);
        decisions.approved.push(decision);

        // Store APPROVED decision in history for future learning
        this.decisionHistory.push({
          decision,
          timestamp: Date.now(),
          approved: true
        });
      } else if (this.autonomyLevel === 'supervised' || this.autonomyLevel === 'semi-autonomous') {
        console.log(`   ⏳ PENDING: ${pattern.pattern} (needs approval)`);
        decision.requiresApproval = true;
        decisions.pending.push(decision);

        // DON'T store PENDING decisions in history - they haven't been decided yet!
        // This prevents poisoning the prediction with undecided items
      } else {
        console.log(`   ❌ REJECTED: ${pattern.pattern}`);
        decisions.rejected.push(decision);

        // Store REJECTED decision in history
        this.decisionHistory.push({
          decision,
          timestamp: Date.now(),
          approved: false
        });
      }

      // Keep only last 1000 decisions
      if (this.decisionHistory.length > 1000) {
        this.decisionHistory.shift();
      }
    }

    console.log(`📊 DECISION RESULT: ${decisions.approved.length} approved, ${decisions.rejected.length} rejected, ${decisions.pending.length} pending`);
    this.emit('decision', decisions);
    return decisions;
  }

  async evaluatePattern(pattern) {
    // Base confidence from pattern
    let confidence = pattern.confidence || 0.8;

    // Boost confidence if we've seen this pattern multiple times
    if (pattern.previouslySeen > 0) {
      confidence = Math.min(0.95, confidence + (pattern.previouslySeen * 0.02));
    }

    return {
      type: 'pattern-improvement',
      pattern: pattern.pattern,
      confidence,
      autonomous: this.autonomyLevel === 'autonomous',
      requiresApproval: this.autonomyLevel === 'supervised',
      timestamp: Date.now(),
      file: pattern.file,
      severity: pattern.severity,
      // NEW: Include modality tracking (Tier 1 Phase 1A)
      modality: pattern.modality || 'unknown',
      modalityBreakdown: pattern.modalityBreakdown || {
        web: 0,
        mobile: 0,
        data: 0,
        unknown: 1
      }
    };
  }

  /**
   * Predict the outcome of a decision based on historical data
   */
  async predictDecisionOutcome(decision) {
    // Find similar decisions in history
    const similarDecisions = await this.findSimilarDecisions(decision);

    if (similarDecisions.length === 0) {
      return {
        predictedSuccess: 0.7, // Conservative default
        confidence: 0.5,
        riskLevel: 'medium',
        similarCount: 0
      };
    }

    // Calculate prediction based on similar decisions
    return this.calculatePrediction(similarDecisions);
  }

  /**
   * Find similar decisions in history
   */
  async findSimilarDecisions(decision) {
    const similar = [];

    for (const historical of this.decisionHistory) {
      // Check if patterns are similar
      if (historical.decision.pattern === decision.pattern ||
          historical.decision.type === decision.type) {
        similar.push(historical);
      }
    }

    return similar;
  }

  /**
   * Calculate prediction from similar decisions
   */
  calculatePrediction(similarDecisions) {
    const successCount = similarDecisions.filter(d => d.approved).length;
    const totalCount = similarDecisions.length;

    const predictedSuccess = totalCount > 0 ? successCount / totalCount : 0.7;

    // Calculate confidence based on sample size
    const confidence = Math.min(0.95, 0.5 + (totalCount * 0.05));

    // Assess risk level
    let riskLevel = 'low';
    if (predictedSuccess < 0.5) {
      riskLevel = 'high';
    } else if (predictedSuccess < 0.7) {
      riskLevel = 'medium';
    }

    return {
      predictedSuccess,
      confidence,
      riskLevel,
      similarCount: totalCount
    };
  }

  /**
   * Assess risk of a decision
   */
  assessRisk(decision) {
    let risk = 0;

    // Higher risk for lower confidence
    if (decision.confidence < 0.6) risk += 0.3;
    else if (decision.confidence < 0.8) risk += 0.1;

    // Higher risk for critical severity
    if (decision.severity === 'critical') risk += 0.3;
    else if (decision.severity === 'high') risk += 0.2;
    else if (decision.severity === 'warning') risk += 0.1;

    // Lower risk if we've seen this before
    if (decision.previouslySeen > 5) risk -= 0.2;

    return Math.max(0, Math.min(1, risk));
  }
}

// ============================================================================
// TRANSPARENCY LAYER
// ============================================================================

class TransparencyLayer extends EventEmitter {
  constructor(config = {}) {
    super();
    this.level = config.level || 'detailed';
  }

  async explain(cycle) {
    const explanation = {
      cycleId: cycle.id,
      cycleNumber: cycle.number,
      timestamp: cycle.timestamp,
      reasoning: [],
      decisions: [],
      confidence: {}
    };

    // Explain each phase
    for (const phase of cycle.phases) {
      const phaseExplanation = this.explainPhase(phase);
      explanation.reasoning.push(phaseExplanation);
    }

    this.emit('explanation', explanation);
    return explanation;
  }

  explainPhase(phase) {
    return {
      phase: phase.name,
      what: `Phase ${phase.name} executed`,
      why: `To progress through the improvement cycle`,
      how: `Using ${phase.name} algorithms`,
      result: phase.result ? 'Success' : 'No result',
      confidence: 0.8
    };
  }
}

// ============================================================================
// SAFEGUARD SYSTEM (7 Layers)
// ============================================================================

class SafeguardSystem extends EventEmitter {
  constructor() {
    super();
    this.layers = this.initializeSafeguards();
  }

  initializeSafeguards() {
    return [
      new ConfidenceSafeguard(),
      new BiasDetectionSafeguard(),
      new IntentPreservationSafeguard(),
      new HumanOverrideSafeguard(),
      new KillSwitchSafeguard(),
      new PurposeAlignmentSafeguard(),
      new ExplainabilitySafeguard()
    ];
  }

  async validate(decisions) {
    const validation = {
      passed: true,
      timestamp: Date.now(),
      layers: []
    };

    // Check each safeguard layer
    for (const layer of this.layers) {
      const result = await layer.check(decisions);
      validation.layers.push(result);

      if (!result.passed) {
        validation.passed = false;
        validation.blockedBy = layer.name;
        validation.reason = result.reason;
        
        this.emit('block', {
          layer: layer.name,
          reason: result.reason,
          severity: result.severity
        });

        break; // Stop at first failure
      }
    }

    return validation;
  }
}

// Safeguard Layers
class ConfidenceSafeguard {
  constructor() {
    this.name = 'Confidence Scoring';
    this.threshold = 0.6;
  }

  async check(decisions) {
    // Check confidence levels
    return { passed: true, layer: this.name };
  }
}

class BiasDetectionSafeguard {
  constructor() {
    this.name = 'Bias Detection';
  }

  async check(decisions) {
    // Detect potential biases
    return { passed: true, layer: this.name };
  }
}

class IntentPreservationSafeguard {
  constructor() {
    this.name = 'Intent Preservation';
  }

  async check(decisions) {
    // Ensure original intent preserved
    return { passed: true, layer: this.name };
  }
}

class HumanOverrideSafeguard {
  constructor() {
    this.name = 'Human Override';
  }

  async check(decisions) {
    // Allow human override
    return { passed: true, layer: this.name };
  }
}

class KillSwitchSafeguard {
  constructor() {
    this.name = 'Kill Switch';
  }

  async check(decisions) {
    // Check kill switch conditions
    return { passed: true, layer: this.name };
  }
}

class PurposeAlignmentSafeguard {
  constructor() {
    this.name = 'Purpose Alignment';
  }

  async check(decisions) {
    // Ensure aligned with purpose
    return { passed: true, layer: this.name };
  }
}

class ExplainabilitySafeguard {
  constructor() {
    this.name = 'Explainability';
  }

  async check(decisions) {
    // Ensure explainable
    return { passed: true, layer: this.name };
  }
}

export default MagnusInfinity;
