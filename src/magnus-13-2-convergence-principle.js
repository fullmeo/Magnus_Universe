/**
 * Magnus 13.2 - Convergence Principle
 * Implementation of harmonic convergence and resonance patterns
 */

export class ConvergencePrinciple {
  constructor() {
    this.convergenceState = {
      active: false,
      cycles: 0,
      resonanceFrequency: 432, // Hz - Universal harmonic frequency
      convergenceThreshold: 0.95,
      harmonicPatterns: []
    };

    this.quantumStates = new Map();
    this.maxPatternHistory = 1000; // Memory limit for harmonicPatterns
  }

  /**
   * Initialize convergence process
   */
  initialize() {
    console.log("🌀 Initializing Convergence Principle...");
    this.convergenceState.active = true;
    this.convergenceState.cycles = 0;
    this.convergenceState.harmonicPatterns = []; // Reset patterns for consistency
    this.quantumStates.clear(); // Clear quantum states
    console.log(`   Resonance Frequency: ${this.convergenceState.resonanceFrequency} Hz`);
    return this;
  }

  /**
   * Execute convergence cycle
   * @param {Array} patterns - Patterns to converge
   */
  converge(patterns) {
    if (!this.convergenceState.active) {
      throw new Error("Convergence not initialized. Call initialize() first.");
    }

    // Validate patterns is an array
    if (!Array.isArray(patterns)) {
      throw new TypeError("Patterns must be an array.");
    }

    console.log(`\n🔄 Convergence Cycle ${++this.convergenceState.cycles}`);

    // Calculate harmonic resonance
    const harmonicScore = this.calculateHarmonicResonance(patterns);
    console.log(`   Harmonic Score: ${(harmonicScore * 100).toFixed(2)}%`);

    // Store pattern (with deep copy to prevent reference issues)
    this.convergenceState.harmonicPatterns.push({
      cycle: this.convergenceState.cycles,
      patterns: JSON.parse(JSON.stringify(patterns)),
      harmonic: harmonicScore,
      timestamp: Date.now()
    });

    // Enforce memory limit - remove oldest entries if exceeded
    while (this.convergenceState.harmonicPatterns.length > this.maxPatternHistory) {
      this.convergenceState.harmonicPatterns.shift();
    }

    // Check convergence (require at least 2 patterns for meaningful convergence)
    const hasConverged = patterns.length >= 2 && harmonicScore >= this.convergenceState.convergenceThreshold;

    if (hasConverged) {
      console.log(`✨ CONVERGENCE ACHIEVED at cycle ${this.convergenceState.cycles}`);
    }

    return {
      cycle: this.convergenceState.cycles,
      harmonicScore,
      hasConverged,
      patterns: this.convergenceState.harmonicPatterns
    };
  }

  /**
   * Calculate harmonic resonance between patterns
   */
  calculateHarmonicResonance(patterns) {
    if (!patterns || patterns.length === 0) return 0;

    // Calculate coherence between patterns
    let totalCoherence = 0;
    let comparisons = 0;

    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        totalCoherence += this.measureCoherence(patterns[i], patterns[j]);
        comparisons++;
      }
    }

    return comparisons > 0 ? totalCoherence / comparisons : 1;
  }

  /**
   * Safely stringify a value, handling circular references
   */
  safeStringify(value) {
    const seen = new WeakSet();
    return JSON.stringify(value, (key, val) => {
      if (typeof val === 'object' && val !== null) {
        if (seen.has(val)) {
          return '[Circular]';
        }
        seen.add(val);
      }
      return val;
    });
  }

  /**
   * Measure coherence between two patterns
   */
  measureCoherence(pattern1, pattern2) {
    // Convert patterns to strings for comparison (handles circular refs)
    const str1 = this.safeStringify(pattern1) || '';
    const str2 = this.safeStringify(pattern2) || '';

    // Handle empty strings edge case
    if (str1 === '' && str2 === '') return 1;
    if (str1 === '' || str2 === '') return 0;

    // Calculate similarity using proper Unicode-aware splitting
    const set1 = new Set([...str1]);
    const set2 = new Set([...str2]);

    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);

    return intersection.size / union.size;
  }

  /**
   * Apply Planck's Mirror theorem
   * Reflects pattern through quantum mirror
   */
  planckMirror(pattern) {
    console.log("🪞 Applying Planck's Mirror...");

    const mirrored = {
      original: pattern,
      reflection: this.reflect(pattern),
      unity: this.findUnity(pattern)
    };

    // Store in quantum states
    const stateId = `state_${this.quantumStates.size}`;
    this.quantumStates.set(stateId, mirrored);

    console.log(`   Quantum state stored: ${stateId}`);

    return mirrored;
  }

  /**
   * Reflect pattern (creates complementary pattern)
   */
  reflect(pattern) {
    // Handle null/undefined
    if (pattern === null || pattern === undefined) {
      return pattern;
    }

    // Handle arrays - preserve array type and reflect recursively
    if (Array.isArray(pattern)) {
      return pattern.map(item => this.reflect(item));
    }

    // Handle objects - reflect recursively
    if (typeof pattern === 'object') {
      const reflected = {};
      for (const [key, value] of Object.entries(pattern)) {
        // Recursively reflect nested objects/arrays
        if (typeof value === 'object' && value !== null) {
          reflected[key] = this.reflect(value);
        } else {
          reflected[key] = this.invertValue(value);
        }
      }
      return reflected;
    }

    return this.invertValue(pattern);
  }

  /**
   * Invert a value (creates opposite/complement)
   */
  invertValue(value) {
    if (typeof value === 'number') {
      // Handle special numeric values
      if (Number.isNaN(value)) return value;
      if (!Number.isFinite(value)) return -value;
      return -value;
    }
    if (typeof value === 'boolean') {
      return !value;
    }
    if (typeof value === 'string') {
      // Use spread operator for proper Unicode/emoji handling
      return [...value].reverse().join('');
    }
    return value;
  }

  /**
   * Find unity between pattern and its reflection
   */
  findUnity(pattern) {
    // Handle null/undefined
    if (pattern === null || pattern === undefined) {
      return 'unified';
    }

    // Unity is the invariant essence that persists through reflection
    if (Array.isArray(pattern)) {
      return pattern.map((item, index) => ({
        index,
        unity: this.findUnity(item)
      }));
    }

    if (typeof pattern === 'object') {
      const unity = {};
      for (const [key, value] of Object.entries(pattern)) {
        // Identify true invariants (values unchanged by reflection)
        if (typeof value === 'number' && value === 0) {
          unity[key] = { invariant: true, value: 0 }; // 0 is its own negation
        } else if (typeof value === 'string' && value === [...value].reverse().join('')) {
          unity[key] = { invariant: true, value }; // Palindrome
        } else if (typeof value === 'object' && value !== null) {
          unity[key] = this.findUnity(value); // Recurse
        } else {
          unity[key] = 'unified';
        }
      }
      return unity;
    }

    // Check if primitive value is its own reflection
    if (typeof pattern === 'number' && pattern === 0) {
      return { invariant: true, value: 0 };
    }
    if (typeof pattern === 'string' && pattern === [...pattern].reverse().join('')) {
      return { invariant: true, value: pattern };
    }

    return 'unified';
  }

  /**
   * Tune resonance frequency
   * @param {number} frequency - Frequency in Hz (must be positive finite number)
   */
  tuneResonance(frequency) {
    // Validate frequency
    if (typeof frequency !== 'number' || !Number.isFinite(frequency) || frequency <= 0) {
      throw new TypeError("Frequency must be a positive finite number.");
    }

    const oldFreq = this.convergenceState.resonanceFrequency;
    this.convergenceState.resonanceFrequency = frequency;
    console.log(`🎵 Resonance tuned: ${oldFreq} Hz → ${frequency} Hz`);
    return this;
  }

  /**
   * Get convergence metrics
   */
  getMetrics() {
    return {
      cycles: this.convergenceState.cycles,
      resonanceFrequency: this.convergenceState.resonanceFrequency,
      threshold: this.convergenceState.convergenceThreshold,
      patternsCollected: this.convergenceState.harmonicPatterns.length,
      quantumStates: this.quantumStates.size
    };
  }

  /**
   * Reset convergence state
   */
  reset() {
    console.log("♻️  Resetting convergence state...");
    this.convergenceState.active = false; // Require re-initialization
    this.convergenceState.cycles = 0;
    this.convergenceState.harmonicPatterns = [];
    this.quantumStates.clear();
    return this;
  }
}

export default ConvergencePrinciple;
