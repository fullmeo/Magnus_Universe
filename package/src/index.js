/**
 * Magnus Universe - Entry Point
 * A consciousness-driven code generation framework
 */

import Magnus, {
  CompleteCycle,
  HermeticFoundation,
  PhilosophyGuide,
  ConvergencePrinciple
} from './magnus-13-2-main.js';

// Default export for simple usage
export default Magnus;

// Named exports for granular access
export {
  Magnus,
  CompleteCycle,
  HermeticFoundation,
  PhilosophyGuide,
  ConvergencePrinciple
};

// Quick start demonstration
if (import.meta.url === `file://${process.argv[1]}`) {
  console.log("\n🌌 Magnus Universe - Quick Start Demo\n");

  // Create Magnus instance
  const magnus = new Magnus();

  // Example 1: Get a mantra
  console.log("\n📿 Mantra for Focus:");
  console.log(`   "${magnus.getMantra('focus')}"\n`);

  // Example 2: Get philosophical guidance
  console.log("🧭 Philosophical Guidance:");
  const guidance = magnus.reveal('creation');
  console.log(`   Context: ${guidance.context}`);
  console.log(`   Approach: ${guidance.approach}`);
  console.log(`   Action: ${guidance.action}\n`);

  // Example 3: Create something
  console.log("🎨 Creation Example:");
  const result = magnus.create({
    type: 'function',
    purpose: 'Calculate harmonic resonance',
    requirements: ['pure', 'efficient', 'elegant']
  });

  console.log(`   Harmonic achieved: ${(result.manifestation.harmonic * 100).toFixed(2)}%`);
  console.log(`   Cycles required: ${result.insights.cyclesRequired}`);

  // Example 4: Apply Hermetic Principle
  console.log("\n⚡ Hermetic Principle Application:");
  const principle = magnus.applyPrinciple('correspondence');
  console.log(`   Principle: ${principle.principle}`);
  console.log(`   Statement: "${principle.statement}"\n`);

  // Example 5: Mirror a pattern
  console.log("🪞 Planck's Mirror:");
  const mirrored = magnus.mirror({ intention: 'unity', action: 'create' });
  console.log(`   Original:`, mirrored.original);
  console.log(`   Reflection:`, mirrored.reflection);
  console.log(`   Unity:`, mirrored.unity);

  // Status
  console.log("\n📊 System Status:");
  const status = magnus.getStatus();
  console.log(`   Initialized: ${status.initialized}`);
  console.log(`   Sessions: ${status.sessions}`);
  console.log(`   Resonance: ${status.config.resonanceFrequency} Hz\n`);
}
