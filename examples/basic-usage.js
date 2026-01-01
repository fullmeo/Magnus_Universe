/**
 * Magnus Universe - Basic Usage Example
 * Demonstrates fundamental operations
 */

import Magnus from '../src/index.js';

console.log("\n" + "═".repeat(70));
console.log("🌌 MAGNUS UNIVERSE - Basic Usage Example");
console.log("═".repeat(70) + "\n");

// ============================================================================
// Example 1: Simple Initialization
// ============================================================================

console.log("📍 Example 1: Simple Initialization\n");

const magnus = new Magnus({
  resonanceFrequency: 432,
  convergenceThreshold: 0.95,
  verbose: true
});

console.log("✅ Magnus initialized\n");

// ============================================================================
// Example 2: Get Philosophical Mantra
// ============================================================================

console.log("\n" + "─".repeat(70));
console.log("📍 Example 2: Philosophical Mantra\n");

const mantras = ['focus', 'clarity', 'creativity', 'persistence', 'wisdom'];

mantras.forEach(intention => {
  const mantra = magnus.getMantra(intention);
  console.log(`${intention.toUpperCase()}:`);
  console.log(`   "${mantra}"\n`);
});

// ============================================================================
// Example 3: Apply Hermetic Principles
// ============================================================================

console.log("─".repeat(70));
console.log("📍 Example 3: Hermetic Principles\n");

const principles = [
  'mentalism',
  'correspondence',
  'vibration',
  'polarity',
  'rhythm',
  'causation',
  'generation'
];

console.log("Applying the 7 Hermetic Principles:\n");

principles.forEach((principle, index) => {
  const result = magnus.applyPrinciple(principle);
  console.log(`${index + 1}. ${principle.toUpperCase()}`);
  console.log(`   "${result.statement}"\n`);
});

// ============================================================================
// Example 4: Get Philosophical Guidance
// ============================================================================

console.log("─".repeat(70));
console.log("📍 Example 4: Philosophical Guidance\n");

const contexts = ['creation', 'problem-solving', 'architecture', 'debugging'];

contexts.forEach(context => {
  const guidance = magnus.reveal(context);
  console.log(`Context: ${context.toUpperCase()}`);
  console.log(`   Approach: ${guidance.approach}`);
  console.log(`   Mindset: ${guidance.mindset}`);
  console.log(`   Action: ${guidance.action}\n`);
});

// ============================================================================
// Example 5: Simple Creation
// ============================================================================

console.log("─".repeat(70));
console.log("📍 Example 5: Simple Creation\n");

const simpleIntention = {
  type: 'function',
  purpose: 'Add two numbers',
  requirements: ['simple', 'pure']
};

const result = magnus.create(simpleIntention);

console.log("Creation Result:");
console.log(`   Harmonic: ${(result.manifestation.harmonic * 100).toFixed(2)}%`);
console.log(`   Cycles: ${result.insights.cyclesRequired}`);
console.log(`   Duration: ${result.insights.duration}ms`);
console.log(`   Converged: ${result.insights.convergence ? '✅' : '❌'}\n`);

// ============================================================================
// Example 6: Planck's Mirror
// ============================================================================

console.log("─".repeat(70));
console.log("📍 Example 6: Planck's Mirror\n");

const patterns = [
  { intention: 'create', energy: 100 },
  { light: true, darkness: false },
  { action: 'forward', value: 42 }
];

patterns.forEach((pattern, index) => {
  console.log(`Pattern ${index + 1}:`);
  const mirrored = magnus.mirror(pattern);
  console.log(`   Original:`, mirrored.original);
  console.log(`   Reflection:`, mirrored.reflection);
  console.log(`   Unity:`, mirrored.unity);
  console.log();
});

// ============================================================================
// Example 7: Harmonic Convergence
// ============================================================================

console.log("─".repeat(70));
console.log("📍 Example 7: Harmonic Convergence\n");

const patternsToConverge = [
  { quality: 'simplicity' },
  { quality: 'clarity' },
  { quality: 'elegance' },
  { quality: 'efficiency' }
];

const convergence = magnus.harmonize(patternsToConverge);

console.log("Convergence Result:");
console.log(`   Cycle: ${convergence.cycle}`);
console.log(`   Harmonic Score: ${(convergence.harmonicScore * 100).toFixed(2)}%`);
console.log(`   Converged: ${convergence.hasConverged ? '✅' : '❌'}`);
console.log(`   Patterns Analyzed: ${patternsToConverge.length}\n`);

// ============================================================================
// Example 8: Philosophical Reflection
// ============================================================================

console.log("─".repeat(70));
console.log("📍 Example 8: Philosophical Reflection\n");

const decision = "Use functional programming approach";
const reasoning = "Functional code reveals truth through pure transformations and emergent patterns";

const reflection = magnus.reflect(decision, reasoning);

console.log(`Decision: ${reflection.decision}`);
console.log(`Reasoning: ${reflection.reasoning}\n`);

console.log("Philosophical Alignment:");
Object.entries(reflection.philosophicalAlignment).forEach(([pillar, score]) => {
  const percentage = (score * 100).toFixed(0);
  const bar = '█'.repeat(Math.floor(score * 20));
  console.log(`   ${pillar.padEnd(15)}: ${bar} ${percentage}%`);
});

console.log("\nSuggestions:");
reflection.suggestion.forEach(suggestion => {
  console.log(`   • ${suggestion}`);
});

// ============================================================================
// Example 9: System Status
// ============================================================================

console.log("\n" + "─".repeat(70));
console.log("📍 Example 9: System Status\n");

const status = magnus.getStatus();

console.log("Magnus Status:");
console.log(`   Initialized: ${status.initialized ? '✅' : '❌'}`);
console.log(`   Sessions: ${status.sessions}`);
console.log(`   Resonance: ${status.config.resonanceFrequency} Hz`);
console.log(`   Threshold: ${(status.config.convergenceThreshold * 100).toFixed(0)}%`);
console.log(`   Cycles Executed: ${status.state.cycles}`);
console.log(`   Quantum States: ${status.metrics.quantumStates}\n`);

// ============================================================================
// Summary
// ============================================================================

console.log("═".repeat(70));
console.log("✨ Basic Usage Examples Complete");
console.log("═".repeat(70));

console.log("\nKey Takeaways:");
console.log("   1. Magnus initializes with sensible defaults");
console.log("   2. Hermetic principles guide all operations");
console.log("   3. Planck's Mirror reveals hidden patterns");
console.log("   4. Harmonic convergence ensures quality");
console.log("   5. Philosophical alignment validates decisions");
console.log("   6. Consciousness flows through all creation\n");
