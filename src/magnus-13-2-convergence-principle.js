/**
 * Magnus 13.2 - Convergence Principle
 * Implementation of harmonic convergence and resonance patterns
 *
 * The Three Pillars Architecture:
 * 1. Harmonic Resonance - Pattern coherence measurement
 * 2. Planck's Mirror - Quantum state reflection and storage
 * 3. Unity Principle - Invariant detection and learning
 *
 * When integratedPillars=true, these pillars work together:
 * - quantumStates influence harmonic scoring
 * - resonanceFrequency modulates coherence calculations
 * - Unity invariants create feedback loops for learning
 */

export class ConvergencePrinciple {
  constructor(config = {}) {
    // Integration control flag - allows disabling pillar integration for debugging
    this.integratedPillars = config.integratedPillars !== false; // true by default

    this.convergenceState = {
      active: false,
      cycles: 0,
      resonanceFrequency: 432, // Hz - Universal harmonic frequency (A=432Hz tuning)
      baseFrequency: 432, // Reference frequency for modulation calculations
      convergenceThreshold: 0.95,
      harmonicPatterns: []
    };

    this.quantumStates = new Map();
    this.maxPatternHistory = 1000; // Memory limit for harmonicPatterns

    // Unity feedback memory - stores invariants that influence future cycles
    // This is the "Si remembers its resolution to Do" behavior
    this.unityMemory = {
      invariants: [], // Accumulated invariants across cycles
      learningRate: config.learningRate || 0.1, // How much invariants influence scoring
      maxMemory: config.maxUnityMemory || 100 // Limit invariant memory
    };
  }

  /**
   * Initialize convergence process
   */
  initialize() {
    console.log("🌀 Initializing Convergence Principle...");
    console.log(`   Integrated Pillars: ${this.integratedPillars ? 'ENABLED' : 'DISABLED'}`);
    this.convergenceState.active = true;
    this.convergenceState.cycles = 0;
    this.convergenceState.harmonicPatterns = []; // Reset patterns for consistency
    this.quantumStates.clear(); // Clear quantum states
    // Note: unityMemory is NOT cleared - it persists across initializations
    // This allows learned invariants to influence future convergence sessions
    console.log(`   Resonance Frequency: ${this.convergenceState.resonanceFrequency} Hz`);
    if (this.integratedPillars && this.unityMemory.invariants.length > 0) {
      console.log(`   Unity Memory: ${this.unityMemory.invariants.length} invariants loaded`);
    }
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
    // Use safeStringify to handle circular references
    this.convergenceState.harmonicPatterns.push({
      cycle: this.convergenceState.cycles,
      patterns: JSON.parse(this.safeStringify(patterns)),
      harmonic: harmonicScore,
      timestamp: Date.now()
    });

    // Enforce memory limit - remove oldest entries if exceeded
    while (this.convergenceState.harmonicPatterns.length > this.maxPatternHistory) {
      this.convergenceState.harmonicPatterns.shift();
    }

    // === UNITY LEARNING FEEDBACK ===
    // After each convergence cycle, extract and store invariants
    // This is the "Si remembers its resolution to Do" behavior
    if (this.integratedPillars) {
      this.learnFromPatterns(patterns, harmonicScore);
    }

    // Check convergence (require at least 2 patterns for meaningful convergence)
    const hasConverged = patterns.length >= 2 && harmonicScore >= this.convergenceState.convergenceThreshold;

    if (hasConverged) {
      console.log(`✨ CONVERGENCE ACHIEVED at cycle ${this.convergenceState.cycles}`);
      // Convergence strengthens invariant memory
      if (this.integratedPillars) {
        this.reinforceInvariants(patterns);
      }
    }

    return {
      cycle: this.convergenceState.cycles,
      harmonicScore,
      hasConverged,
      patterns: this.convergenceState.harmonicPatterns,
      // Include integration metrics when pillars are enabled
      ...(this.integratedPillars && {
        integration: {
          quantumStatesUsed: this.quantumStates.size,
          frequencyModulation: this.calculateFrequencyModulation(),
          invariantsInMemory: this.unityMemory.invariants.length
        }
      })
    };
  }

  /**
   * Learn invariants from patterns after each convergence cycle
   * High-scoring cycles contribute more strongly to memory
   */
  learnFromPatterns(patterns, harmonicScore) {
    // Only learn from cycles with meaningful coherence
    if (harmonicScore < 0.3) return;

    for (const pattern of patterns) {
      const unity = this.findUnity(pattern);
      const invariantCount = this.countInvariants(unity);

      // Store patterns with invariants, weighted by harmonic score
      if (invariantCount > 0) {
        this.unityMemory.invariants.push({
          unity: JSON.parse(this.safeStringify(unity)),
          weight: harmonicScore,
          cycle: this.convergenceState.cycles,
          timestamp: Date.now()
        });

        // Enforce memory limit
        while (this.unityMemory.invariants.length > this.unityMemory.maxMemory) {
          // Remove oldest/weakest invariant
          this.unityMemory.invariants.shift();
        }
      }
    }
  }

  /**
   * Reinforce invariants when convergence is achieved
   * Successful convergence strengthens the memory of patterns that led to it
   */
  reinforceInvariants(patterns) {
    // Boost weights of recently added invariants
    const recentCycles = 3;
    const currentCycle = this.convergenceState.cycles;

    for (const invariant of this.unityMemory.invariants) {
      if (currentCycle - invariant.cycle <= recentCycles) {
        invariant.weight = Math.min(1, invariant.weight * 1.2); // 20% boost, capped at 1
      }
    }

    console.log(`   🧠 Unity memory reinforced: ${this.unityMemory.invariants.length} invariants`);
  }

  /**
   * Calculate harmonic resonance between patterns
   *
   * When integratedPillars=true:
   * - Quantum states from Planck's Mirror contribute to the score
   * - Resonance frequency modulates the coherence calculation
   * - Unity invariants from memory provide a learning bonus
   */
  calculateHarmonicResonance(patterns) {
    if (!patterns || patterns.length === 0) return 0;

    // Calculate base coherence between patterns
    let totalCoherence = 0;
    let comparisons = 0;

    for (let i = 0; i < patterns.length; i++) {
      for (let j = i + 1; j < patterns.length; j++) {
        totalCoherence += this.measureCoherence(patterns[i], patterns[j]);
        comparisons++;
      }
    }

    let baseScore = comparisons > 0 ? totalCoherence / comparisons : 1;

    // If pillar integration is disabled, return base score
    if (!this.integratedPillars) {
      return baseScore;
    }

    // === PILLAR INTEGRATION ===

    // 1. Quantum States Contribution (Planck's Mirror)
    // Patterns that have been mirrored have established quantum coherence
    const quantumBonus = this.calculateQuantumContribution(patterns);

    // 2. Resonance Frequency Modulation
    // Higher frequencies (relative to base) amplify coherence
    // Lower frequencies dampen it - like musical intervals
    const frequencyModulation = this.calculateFrequencyModulation();

    // 3. Unity Memory Contribution (Learning Feedback)
    // Invariants from previous cycles boost patterns that exhibit similar properties
    const unityBonus = this.calculateUnityContribution(patterns);

    // Combine: base score modulated by frequency, plus quantum and unity bonuses
    // Formula: (base * freqMod) + quantumBonus + unityBonus, clamped to [0, 1]
    const integratedScore = (baseScore * frequencyModulation) + quantumBonus + unityBonus;

    return Math.min(1, Math.max(0, integratedScore));
  }

  /**
   * Calculate quantum state contribution to harmonic score
   * Patterns that have been through Planck's Mirror establish quantum coherence
   */
  calculateQuantumContribution(patterns) {
    if (this.quantumStates.size === 0) return 0;

    let quantumCoherence = 0;
    let matches = 0;

    // Check if current patterns have quantum state reflections
    for (const pattern of patterns) {
      const patternStr = this.safeStringify(pattern);

      for (const [, state] of this.quantumStates) {
        const originalStr = this.safeStringify(state.original);
        const reflectionStr = this.safeStringify(state.reflection);

        // Pattern matches original - it has quantum history
        if (patternStr === originalStr) {
          quantumCoherence += 0.5;
          matches++;
        }
        // Pattern matches reflection - quantum duality achieved
        if (patternStr === reflectionStr) {
          quantumCoherence += 0.3;
          matches++;
        }
        // Check for partial coherence via character overlap
        const overlap = this.measureCoherence(pattern, state.original);
        if (overlap > 0.7) {
          quantumCoherence += overlap * 0.2;
          matches++;
        }
      }
    }

    // Normalize by number of patterns, cap contribution at 0.15
    const normalizedBonus = matches > 0 ? quantumCoherence / (patterns.length * 2) : 0;
    return Math.min(0.15, normalizedBonus);
  }

  /**
   * Calculate frequency modulation factor
   * Based on musical harmony principles - certain frequency ratios are more consonant
   */
  calculateFrequencyModulation() {
    const currentFreq = this.convergenceState.resonanceFrequency;
    const baseFreq = this.convergenceState.baseFrequency;

    // Calculate ratio to base frequency
    const ratio = currentFreq / baseFreq;

    // Harmonic intervals (from music theory) that enhance resonance:
    // Unison (1:1), Octave (2:1), Fifth (3:2), Fourth (4:3), Third (5:4)
    const harmonicRatios = [1, 2, 1.5, 1.333, 1.25, 0.5, 0.667, 0.75, 0.8];

    // Find closest harmonic ratio
    let minDistance = Infinity;
    for (const harmonic of harmonicRatios) {
      const distance = Math.abs(ratio - harmonic);
      if (distance < minDistance) {
        minDistance = distance;
      }
    }

    // Convert distance to modulation factor
    // Perfect harmony (distance=0) -> 1.1x multiplier
    // Dissonance (distance>0.5) -> 0.9x multiplier
    const harmonicity = Math.max(0, 1 - minDistance);
    return 0.9 + (harmonicity * 0.2); // Range: 0.9 to 1.1
  }

  /**
   * Calculate unity memory contribution (learning feedback loop)
   * Patterns exhibiting properties similar to stored invariants get a bonus
   */
  calculateUnityContribution(patterns) {
    if (this.unityMemory.invariants.length === 0) return 0;

    let unityBonus = 0;

    for (const pattern of patterns) {
      const patternUnity = this.findUnity(pattern);
      const invariantCount = this.countInvariants(patternUnity);

      // Check overlap with stored invariants
      for (const storedInvariant of this.unityMemory.invariants) {
        const similarity = this.measureInvariantSimilarity(patternUnity, storedInvariant);
        unityBonus += similarity * this.unityMemory.learningRate;
      }

      // Bonus for patterns with many invariants (self-similar/palindromic)
      unityBonus += invariantCount * 0.01;
    }

    // Normalize and cap at 0.1
    const normalizedBonus = unityBonus / patterns.length;
    return Math.min(0.1, normalizedBonus);
  }

  /**
   * Count invariant properties in a unity result
   */
  countInvariants(unity, seen = new WeakSet()) {
    if (unity === 'unified' || unity === '[Circular]') return 0;
    if (unity?.invariant === true) return 1;

    let count = 0;
    if (typeof unity === 'object' && unity !== null) {
      // Detect circular references
      if (seen.has(unity)) {
        return 0;
      }
      seen.add(unity);

      if (Array.isArray(unity)) {
        for (const item of unity) {
          count += this.countInvariants(item.unity || item, seen);
        }
      } else {
        for (const value of Object.values(unity)) {
          count += this.countInvariants(value, seen);
        }
      }
    }
    return count;
  }

  /**
   * Measure similarity between two unity structures
   */
  measureInvariantSimilarity(unity1, unity2) {
    const str1 = this.safeStringify(unity1);
    const str2 = this.safeStringify(unity2);
    return this.measureCoherence({ data: str1 }, { data: str2 });
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
   *
   * When integratedPillars=true:
   * - Stores quantum state for use in harmonic calculations
   * - Extracts invariants and adds them to unity memory
   * - Creates bidirectional coherence between original and reflection
   */
  planckMirror(pattern) {
    console.log("🪞 Applying Planck's Mirror...");

    const mirrored = {
      original: pattern,
      reflection: this.reflect(pattern),
      unity: this.findUnity(pattern),
      timestamp: Date.now()
    };

    // Store in quantum states
    const stateId = `state_${Date.now()}_${this.quantumStates.size}`;
    this.quantumStates.set(stateId, mirrored);

    console.log(`   Quantum state stored: ${stateId}`);

    // === PILLAR INTEGRATION: Unity Learning ===
    if (this.integratedPillars) {
      const invariantCount = this.countInvariants(mirrored.unity);
      if (invariantCount > 0) {
        // Mirror operations that reveal invariants are valuable learning
        this.unityMemory.invariants.push({
          unity: JSON.parse(this.safeStringify(mirrored.unity)),
          weight: 0.7, // Mirror-discovered invariants start with good weight
          source: 'planckMirror',
          stateId,
          timestamp: Date.now()
        });

        // Enforce memory limit
        while (this.unityMemory.invariants.length > this.unityMemory.maxMemory) {
          this.unityMemory.invariants.shift();
        }

        console.log(`   🧠 ${invariantCount} invariants learned from mirror`);
      }
    }

    return mirrored;
  }

  /**
   * Reflect pattern (creates complementary pattern)
   */
  reflect(pattern, seen = new WeakSet()) {
    // Handle null/undefined
    if (pattern === null || pattern === undefined) {
      return pattern;
    }

    // Detect circular references
    if (typeof pattern === 'object') {
      if (seen.has(pattern)) {
        return '[Circular]';
      }
      seen.add(pattern);
    }

    // Handle arrays - preserve array type and reflect recursively
    if (Array.isArray(pattern)) {
      return pattern.map(item => this.reflect(item, seen));
    }

    // Handle objects - reflect recursively
    if (typeof pattern === 'object') {
      const reflected = {};
      for (const [key, value] of Object.entries(pattern)) {
        // Recursively reflect nested objects/arrays
        if (typeof value === 'object' && value !== null) {
          reflected[key] = this.reflect(value, seen);
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
  findUnity(pattern, seen = new WeakSet()) {
    // Handle null/undefined
    if (pattern === null || pattern === undefined) {
      return 'unified';
    }

    // Detect circular references
    if (typeof pattern === 'object') {
      if (seen.has(pattern)) {
        return '[Circular]';
      }
      seen.add(pattern);
    }

    // Unity is the invariant essence that persists through reflection
    if (Array.isArray(pattern)) {
      return pattern.map((item, index) => ({
        index,
        unity: this.findUnity(item, seen)
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
          unity[key] = this.findUnity(value, seen); // Recurse
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
    const baseMetrics = {
      cycles: this.convergenceState.cycles,
      resonanceFrequency: this.convergenceState.resonanceFrequency,
      threshold: this.convergenceState.convergenceThreshold,
      patternsCollected: this.convergenceState.harmonicPatterns.length,
      quantumStates: this.quantumStates.size,
      integratedPillars: this.integratedPillars
    };

    // Add integration metrics when pillars are enabled
    if (this.integratedPillars) {
      return {
        ...baseMetrics,
        integration: {
          frequencyModulation: this.calculateFrequencyModulation(),
          frequencyRatio: this.convergenceState.resonanceFrequency / this.convergenceState.baseFrequency,
          invariantsInMemory: this.unityMemory.invariants.length,
          learningRate: this.unityMemory.learningRate,
          averageInvariantWeight: this.unityMemory.invariants.length > 0
            ? this.unityMemory.invariants.reduce((sum, i) => sum + i.weight, 0) / this.unityMemory.invariants.length
            : 0
        }
      };
    }

    return baseMetrics;
  }

  /**
   * Reset convergence state
   * Note: Unity memory is preserved by default to maintain learning across sessions
   * Use clearUnityMemory() to fully reset learning state
   */
  reset() {
    console.log("♻️  Resetting convergence state...");
    this.convergenceState.active = false; // Require re-initialization
    this.convergenceState.cycles = 0;
    this.convergenceState.harmonicPatterns = [];
    this.quantumStates.clear();
    // Note: unityMemory is NOT cleared - learning persists
    console.log(`   Unity memory preserved: ${this.unityMemory.invariants.length} invariants`);
    return this;
  }

  /**
   * Clear unity memory (full learning reset)
   * Use this when you want to start fresh without any learned invariants
   */
  clearUnityMemory() {
    console.log("🧹 Clearing unity memory...");
    const clearedCount = this.unityMemory.invariants.length;
    this.unityMemory.invariants = [];
    console.log(`   Cleared ${clearedCount} invariants`);
    return this;
  }

  /**
   * Full reset including unity memory
   */
  hardReset() {
    this.reset();
    this.clearUnityMemory();
    this.convergenceState.resonanceFrequency = this.convergenceState.baseFrequency;
    console.log("🔄 Hard reset complete - all state cleared");
    return this;
  }

  /**
   * Toggle pillar integration at runtime
   * Useful for A/B testing or debugging
   */
  setIntegratedPillars(enabled) {
    const wasEnabled = this.integratedPillars;
    this.integratedPillars = enabled;
    console.log(`🔧 Integrated pillars: ${wasEnabled ? 'ON' : 'OFF'} → ${enabled ? 'ON' : 'OFF'}`);
    return this;
  }

  /**
   * Adjust learning rate dynamically
   * Higher rate = faster adaptation but less stability
   * Lower rate = slower adaptation but more stable
   */
  setLearningRate(rate) {
    if (typeof rate !== 'number' || rate < 0 || rate > 1) {
      throw new TypeError("Learning rate must be a number between 0 and 1");
    }
    const oldRate = this.unityMemory.learningRate;
    this.unityMemory.learningRate = rate;
    console.log(`📈 Learning rate: ${oldRate} → ${rate}`);
    return this;
  }
}

export default ConvergencePrinciple;
