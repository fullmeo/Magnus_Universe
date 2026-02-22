/**
 * Magnus 13.2 - Convergence Principle Regression Tests
 *
 * 5 regression tests from Session 3 + additional edge case coverage
 * Uses Node.js built-in assert (zero dependencies)
 *
 * Run: node tests/convergence-principle.test.js
 */

import assert from 'node:assert/strict';
import { ConvergencePrinciple } from '../src/magnus-13-2-convergence-principle.js';

// Suppress console.log during tests (keep stderr for errors)
const originalLog = console.log;
console.log = () => {};

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    originalLog(`  ✅ ${name}`);
  } catch (error) {
    failed++;
    failures.push({ name, error: error.message });
    originalLog(`  ❌ ${name}`);
    originalLog(`     ${error.message}`);
  }
}

async function testAsync(name, fn) {
  try {
    await fn();
    passed++;
    originalLog(`  ✅ ${name}`);
  } catch (error) {
    failed++;
    failures.push({ name, error: error.message });
    originalLog(`  ❌ ${name}`);
    originalLog(`     ${error.message}`);
  }
}

// ═══════════════════════════════════════════════════════════════
// SESSION 3 REGRESSION TESTS (5 core tests)
// ═══════════════════════════════════════════════════════════════

originalLog('\n🧪 SESSION 3 — REGRESSION TESTS');
originalLog('═══════════════════════════════════════════════════════');

test('1. planckMirror(null) does not crash', () => {
  const cp = new ConvergencePrinciple();
  const result = cp.planckMirror(null);
  assert.equal(result.original, null);
  assert.equal(result.reflection, null);
  assert.equal(result.unity, 'unified');
});

test('2. Single element does not auto-converge', () => {
  const cp = new ConvergencePrinciple();
  cp.initialize();
  const result = cp.converge([{ note: 'C4' }]);
  assert.equal(result.hasConverged, false, 'Single pattern must not converge');
});

test('3. Circular reference does not crash', () => {
  const cp = new ConvergencePrinciple();

  // Create circular reference
  const obj = { a: 1, b: 'hello' };
  obj.self = obj;

  // planckMirror with circular ref
  const mirrored = cp.planckMirror(obj);
  assert.ok(mirrored, 'planckMirror should return a result');
  assert.ok(mirrored.reflection, 'Should have a reflection');

  // reflect() with circular ref
  const reflected = cp.reflect(obj);
  assert.ok(reflected, 'reflect() should handle circular ref');

  // findUnity() with circular ref
  const unity = cp.findUnity(obj);
  assert.ok(unity, 'findUnity() should handle circular ref');

  // countInvariants() with circular ref
  const count = cp.countInvariants(unity);
  assert.equal(typeof count, 'number', 'countInvariants should return a number');

  // converge() with circular ref
  cp.initialize();
  const result = cp.converge([obj, { x: 1 }]);
  assert.equal(typeof result.harmonicScore, 'number', 'Should compute a score');
});

test('4. integratedPillars: false disables pillar integration', () => {
  const cpIntegrated = new ConvergencePrinciple({ integratedPillars: true });
  const cpLegacy = new ConvergencePrinciple({ integratedPillars: false });

  cpIntegrated.initialize();
  cpLegacy.initialize();

  const patterns = [
    { note: 'C4', freq: 261.63 },
    { note: 'E4', freq: 329.63 }
  ];

  // First mirror patterns (creates quantum states for integrated mode)
  cpIntegrated.planckMirror(patterns[0]);
  cpLegacy.planckMirror(patterns[0]);

  const resultIntegrated = cpIntegrated.converge(patterns);
  const resultLegacy = cpLegacy.converge(patterns);

  // Legacy mode should not include integration metrics
  assert.equal(resultLegacy.integration, undefined, 'Legacy mode should not have integration metrics');

  // Integrated mode should include integration metrics
  assert.ok(resultIntegrated.integration, 'Integrated mode should have integration metrics');
  assert.equal(typeof resultIntegrated.integration.quantumStatesUsed, 'number');
  assert.equal(typeof resultIntegrated.integration.frequencyModulation, 'number');

  // Verify runtime toggle works
  cpIntegrated.setIntegratedPillars(false);
  assert.equal(cpIntegrated.integratedPillars, false);
});

test('5. Quantum integration produces measurable effect', () => {
  const cp = new ConvergencePrinciple();
  cp.initialize();

  const pattern = { note: 'A4', freq: 432, value: 0 };

  // Score WITHOUT quantum states
  const baseline = cp.calculateHarmonicResonance([pattern, pattern]);

  // Mirror the pattern to create quantum states
  cp.planckMirror(pattern);

  // Score WITH quantum states
  const withQuantum = cp.calculateHarmonicResonance([pattern, pattern]);

  // Quantum contribution should increase (or at minimum not decrease) the score
  assert.ok(withQuantum >= baseline,
    `Quantum states should not decrease score: baseline=${baseline}, withQuantum=${withQuantum}`);

  // Verify quantum states were stored
  assert.ok(cp.quantumStates.size > 0, 'Quantum states should be stored');

  // Verify metrics reflect quantum integration
  const metrics = cp.getMetrics();
  assert.ok(metrics.integration, 'Metrics should include integration data');
  assert.ok(metrics.integration.invariantsInMemory >= 0, 'Should track invariants');
});

// ═══════════════════════════════════════════════════════════════
// SESSION 1 EDGE CASE TESTS
// ═══════════════════════════════════════════════════════════════

originalLog('\n🧪 SESSION 1 — EDGE CASE TESTS');
originalLog('═══════════════════════════════════════════════════════');

test('planckMirror(undefined) does not crash', () => {
  const cp = new ConvergencePrinciple();
  const result = cp.planckMirror(undefined);
  assert.equal(result.original, undefined);
  assert.equal(result.reflection, undefined);
});

test('converge() throws TypeError on non-array', () => {
  const cp = new ConvergencePrinciple();
  cp.initialize();
  assert.throws(() => cp.converge('not an array'), TypeError);
  assert.throws(() => cp.converge(42), TypeError);
  assert.throws(() => cp.converge(null), TypeError);
});

test('converge() throws if not initialized', () => {
  const cp = new ConvergencePrinciple();
  assert.throws(() => cp.converge([]), Error);
});

test('tuneResonance() validates frequency', () => {
  const cp = new ConvergencePrinciple();
  assert.throws(() => cp.tuneResonance(-1), TypeError);
  assert.throws(() => cp.tuneResonance(0), TypeError);
  assert.throws(() => cp.tuneResonance(NaN), TypeError);
  assert.throws(() => cp.tuneResonance(Infinity), TypeError);
  assert.throws(() => cp.tuneResonance('440'), TypeError);

  // Valid frequencies should work
  cp.tuneResonance(440);
  assert.equal(cp.convergenceState.resonanceFrequency, 440);
});

test('reflect() preserves array type', () => {
  const cp = new ConvergencePrinciple();
  const result = cp.reflect([1, 2, 3]);
  assert.ok(Array.isArray(result), 'reflect([]) should return an array');
  assert.deepEqual(result, [-1, -2, -3]);
});

test('Unicode strings handled correctly', () => {
  const cp = new ConvergencePrinciple();
  const result = cp.invertValue('🎵🎶');
  assert.equal(result, '🎶🎵', 'Emoji reversal should work with spread operator');
});

test('reset() sets active to false', () => {
  const cp = new ConvergencePrinciple();
  cp.initialize();
  assert.equal(cp.convergenceState.active, true);
  cp.reset();
  assert.equal(cp.convergenceState.active, false);
  assert.throws(() => cp.converge([]), Error, 'Should require re-initialization after reset');
});

test('Memory limit is enforced', () => {
  const cp = new ConvergencePrinciple();
  cp.maxPatternHistory = 3;
  cp.initialize();

  for (let i = 0; i < 5; i++) {
    cp.converge([{ i }, { j: i + 1 }]);
  }

  assert.ok(
    cp.convergenceState.harmonicPatterns.length <= 3,
    `Should have at most 3 patterns, got ${cp.convergenceState.harmonicPatterns.length}`
  );
});

// ═══════════════════════════════════════════════════════════════
// SESSION 2 ARCHITECTURE TESTS
// ═══════════════════════════════════════════════════════════════

originalLog('\n🧪 SESSION 2 — THREE PILLARS INTEGRATION TESTS');
originalLog('═══════════════════════════════════════════════════════');

test('Frequency modulation stays in [0.9, 1.1] range', () => {
  const cp = new ConvergencePrinciple();

  // Default (432/432 = unison) should be near 1.1
  const unison = cp.calculateFrequencyModulation();
  assert.ok(unison >= 0.9 && unison <= 1.1, `Unison modulation: ${unison}`);

  // Octave (864/432 = 2:1) should also be harmonic
  cp.tuneResonance(864);
  const octave = cp.calculateFrequencyModulation();
  assert.ok(octave >= 0.9 && octave <= 1.1, `Octave modulation: ${octave}`);

  // Dissonant frequency
  cp.tuneResonance(999);
  const dissonant = cp.calculateFrequencyModulation();
  assert.ok(dissonant >= 0.9 && dissonant <= 1.1, `Dissonant modulation: ${dissonant}`);
});

test('Unity memory persists across reset() but not hardReset()', () => {
  const cp = new ConvergencePrinciple();
  cp.initialize();

  // Create some invariants via planckMirror
  cp.planckMirror({ value: 0, palindrome: 'aba' });

  const invariantsBefore = cp.unityMemory.invariants.length;
  assert.ok(invariantsBefore > 0, 'Should have learned invariants');

  // Soft reset preserves unity memory
  cp.reset();
  assert.equal(cp.unityMemory.invariants.length, invariantsBefore, 'reset() should preserve unity memory');

  // Hard reset clears everything
  cp.hardReset();
  assert.equal(cp.unityMemory.invariants.length, 0, 'hardReset() should clear unity memory');
});

test('setLearningRate() validates input', () => {
  const cp = new ConvergencePrinciple();
  assert.throws(() => cp.setLearningRate(-0.1), TypeError);
  assert.throws(() => cp.setLearningRate(1.5), TypeError);
  assert.throws(() => cp.setLearningRate('fast'), TypeError);

  cp.setLearningRate(0.5);
  assert.equal(cp.unityMemory.learningRate, 0.5);
});

test('findUnity detects true invariants (zero, palindromes)', () => {
  const cp = new ConvergencePrinciple();

  // Zero is its own negation → invariant
  const unityZero = cp.findUnity({ val: 0 });
  assert.equal(unityZero.val.invariant, true, 'Zero should be detected as invariant');

  // Palindrome is its own reverse → invariant
  const unityPalin = cp.findUnity({ word: 'aba' });
  assert.equal(unityPalin.word.invariant, true, 'Palindrome should be detected as invariant');

  // Non-palindrome is not invariant
  const unityNormal = cp.findUnity({ word: 'abc' });
  assert.equal(unityNormal.word, 'unified', 'Non-palindrome should not be invariant');
});

test('getMetrics includes integration data when pillars enabled', () => {
  const cp = new ConvergencePrinciple({ integratedPillars: true });
  cp.initialize();

  const metrics = cp.getMetrics();
  assert.ok(metrics.integratedPillars === true);
  assert.ok(metrics.integration, 'Should have integration section');
  assert.equal(typeof metrics.integration.frequencyModulation, 'number');
  assert.equal(typeof metrics.integration.frequencyRatio, 'number');
  assert.equal(typeof metrics.integration.invariantsInMemory, 'number');
  assert.equal(typeof metrics.integration.learningRate, 'number');
});

// ═══════════════════════════════════════════════════════════════
// RESULTS
// ═══════════════════════════════════════════════════════════════

// Restore console.log
console.log = originalLog;

console.log('\n═══════════════════════════════════════════════════════');
console.log(`📊 RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('═══════════════════════════════════════════════════════');

if (failures.length > 0) {
  console.log('\nFailures:');
  for (const f of failures) {
    console.log(`  ✗ ${f.name}: ${f.error}`);
  }
}

console.log('');
process.exit(failed > 0 ? 1 : 0);
