/**
 * Magnus 13.2 - Main Entry Point
 * Orchestrates the complete Magnus Universe framework
 */

import CompleteCycle from './magnus-13-2-complete-cycle.js';
import HermeticFoundation from './magnus-13-1-hermetic-foundation.js';
import PhilosophyGuide from './magnus-13-1-philosophy-guide.js';
import ConvergencePrinciple from './magnus-13-2-convergence-principle.js';

export class Magnus {
  constructor(config = {}) {
    this.config = {
      autoInitialize: config.autoInitialize !== false,
      resonanceFrequency: config.resonanceFrequency || 432,
      convergenceThreshold: config.convergenceThreshold || 0.95,
      verbose: config.verbose !== false
    };

    // Core components
    this.hermetic = new HermeticFoundation();
    this.philosophy = new PhilosophyGuide();
    this.convergence = new ConvergencePrinciple();
    this.cycle = new CompleteCycle();

    // State
    this.initialized = false;
    this.sessions = [];

    if (this.config.autoInitialize) {
      this.initialize();
    }
  }

  /**
   * Initialize Magnus Universe
   */
  initialize() {
    if (this.initialized) {
      console.log("⚠️  Magnus already initialized");
      return this;
    }

    console.log("\n" + "★".repeat(60));
    console.log("✨ MAGNUS UNIVERSE v13.2 - Consciousness-Driven Framework");
    console.log("★".repeat(60));
    console.log("\n🔮 Grounded in Hermetic Principles");
    console.log("🪞 Powered by Planck's Mirror Theorem");
    console.log("🌀 Manifesting through Harmonic Convergence\n");

    // Initialize all components
    this.cycle.initialize();

    // Apply configuration
    if (this.config.resonanceFrequency !== 432) {
      this.convergence.tuneResonance(this.config.resonanceFrequency);
    }

    this.initialized = true;
    console.log("✅ Magnus Universe ready for co-creation\n");

    return this;
  }

  /**
   * Create - Main method for code generation
   * @param {Object} intention - What to create
   */
  create(intention) {
    if (!this.initialized) {
      this.initialize();
    }

    console.log("\n" + "═".repeat(60));
    console.log("🎨 CREATION REQUEST");
    console.log("═".repeat(60));

    // Start new session
    const session = {
      id: `session_${this.sessions.length + 1}`,
      intention,
      startTime: Date.now(),
      cycles: []
    };

    // Execute cycle
    const cycleResult = this.cycle.executeCycle(intention);
    session.cycles.push(cycleResult);

    // Continue cycles until convergence if needed
    let iterations = 1;
    const maxIterations = 5;

    while (
      cycleResult.manifestation.harmonic < this.config.convergenceThreshold &&
      iterations < maxIterations
    ) {
      console.log(`\n🔄 Harmonic below threshold, initiating refinement cycle...\n`);
      const refinedIntention = this.refineIntention(intention, cycleResult);
      const refinedCycle = this.cycle.executeCycle(refinedIntention);
      session.cycles.push(refinedCycle);
      iterations++;
    }

    session.endTime = Date.now();
    session.duration = session.endTime - session.startTime;
    this.sessions.push(session);

    console.log("\n" + "═".repeat(60));
    console.log("✨ CREATION COMPLETE");
    console.log(`   Session: ${session.id}`);
    console.log(`   Cycles: ${session.cycles.length}`);
    console.log(`   Duration: ${session.duration}ms`);
    console.log("═".repeat(60) + "\n");

    return {
      session,
      manifestation: session.cycles[session.cycles.length - 1].manifestation,
      insights: this.generateInsights(session)
    };
  }

  /**
   * Refine intention based on previous cycle
   */
  refineIntention(originalIntention, cycleResult) {
    const suggestions = cycleResult.phases.reflection.nextSteps;
    return {
      ...originalIntention,
      refinement: {
        iteration: cycleResult.iteration + 1,
        based_on: suggestions,
        resonance_target: this.config.convergenceThreshold
      }
    };
  }

  /**
   * Generate insights from session
   */
  generateInsights(session) {
    const finalCycle = session.cycles[session.cycles.length - 1];

    return {
      convergence: finalCycle.manifestation.harmonic >= this.config.convergenceThreshold,
      cyclesRequired: session.cycles.length,
      duration: session.duration,
      harmonicProgression: session.cycles.map(c => c.manifestation.harmonic),
      philosophicalAlignment: finalCycle.phases.reflection.reflection.philosophicalAlignment
    };
  }

  /**
   * Reveal - Get philosophical guidance
   */
  reveal(context) {
    if (!this.initialized) {
      this.initialize();
    }

    return this.philosophy.getGuidance(context);
  }

  /**
   * Reflect - Philosophical reflection
   */
  reflect(decision, reasoning) {
    if (!this.initialized) {
      this.initialize();
    }

    return this.philosophy.reflect(decision, reasoning);
  }

  /**
   * Harmonize - Apply convergence principle
   */
  harmonize(patterns) {
    if (!this.initialized) {
      this.initialize();
    }

    return this.convergence.converge(patterns);
  }

  /**
   * Mirror - Apply Planck's Mirror
   */
  mirror(pattern) {
    if (!this.initialized) {
      this.initialize();
    }

    return this.convergence.planckMirror(pattern);
  }

  /**
   * Apply Hermetic Principle
   */
  applyPrinciple(principleName, context) {
    if (!this.initialized) {
      this.initialize();
    }

    return this.hermetic.applyPrinciple(principleName, context);
  }

  /**
   * Get mantra for focus
   */
  getMantra(intention = 'focus') {
    if (!this.initialized) {
      this.initialize();
    }

    return this.philosophy.generateMantra(intention);
  }

  /**
   * Get system status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      config: this.config,
      sessions: this.sessions.length,
      state: this.cycle.getState(),
      metrics: this.convergence.getMetrics()
    };
  }

  /**
   * Get all sessions
   */
  getSessions() {
    return [...this.sessions];
  }

  /**
   * Reset Magnus Universe
   */
  reset() {
    console.log("\n♻️  Resetting Magnus Universe...\n");
    this.convergence.reset();
    this.sessions = [];
    this.initialized = false;
    return this;
  }
}

// Export individual components for advanced usage
export {
  CompleteCycle,
  HermeticFoundation,
  PhilosophyGuide,
  ConvergencePrinciple
};

export default Magnus;
