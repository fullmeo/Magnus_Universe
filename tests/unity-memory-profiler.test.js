/**
 * UnityMemoryProfiler — test suite
 *
 * Covers: snapshot, profile, compare, recommendations,
 * delta computation, empty state, quantum profiling, edge cases.
 *
 * Run: node tests/unity-memory-profiler.test.js
 */

import assert from 'node:assert/strict';
import { UnityMemoryProfiler } from '../src/magnus-14-unity-memory-profiler.js';
import { ConvergencePrinciple }  from '../src/magnus-13-2-convergence-principle.js';

const originalLog  = console.log;
const originalWarn = console.warn;
console.log  = () => {};
console.warn = () => {};

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    originalLog(`  ✅ ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, error: err.message });
    originalLog(`  ❌ ${name}`);
    originalLog(`     ${err.message}`);
  }
}

/** Build a minimal ConvergencePrinciple-like stub with controlled memory. */
function makeCpStub(invariants = [], qStates = new Map(), opts = {}) {
  return {
    unityMemory: {
      invariants,
      learningRate: opts.learningRate ?? 0.1,
      maxMemory:    opts.maxMemory    ?? 100
    },
    quantumStates:    qStates,
    maxQuantumStates: opts.maxQuantumStates ?? 1000
  };
}

function makeInvariant(overrides = {}) {
  return {
    unity:  overrides.unity     ?? { val: { invariant: true, value: 0 } },
    weight: overrides.weight    ?? 0.7,
    cycle:  overrides.cycle     ?? 1,
    source: overrides.source    ?? 'convergence',
    timestamp: Date.now()
  };
}

// ─────────────────────────────────────────────────────────────────────────────
originalLog('\n🔬 UNITY MEMORY PROFILER — SNAPSHOT & PROFILE');
originalLog('═'.repeat(55));
// ─────────────────────────────────────────────────────────────────────────────

test('profile() returns unity and quantum sections', () => {
  const cp = makeCpStub();
  const p  = new UnityMemoryProfiler();
  const r  = p.profile(cp);
  assert.ok('unity'   in r, 'should have unity section');
  assert.ok('quantum' in r, 'should have quantum section');
  assert.ok(Array.isArray(r.recommendations), 'should have recommendations');
});

test('profile() with empty memory returns count=0 and INFO recommendation', () => {
  const cp = makeCpStub();
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.equal(r.unity.count, 0);
  assert.equal(r.recommendations[0].type, 'INFO');
});

test('snapshot() stores snapshot under given label', () => {
  const cp = makeCpStub();
  const p  = new UnityMemoryProfiler();
  p.snapshot(cp, 'test-label');
  assert.equal(p.getHistory().length, 1);
  assert.equal(p.getHistory()[0].label, 'test-label');
});

test('snapshot() overwrites same label', () => {
  const cp = makeCpStub();
  const p  = new UnityMemoryProfiler();
  p.snapshot(cp, 'same');
  p.snapshot(cp, 'same');
  assert.equal(p.getHistory().length, 1);
});

test('reset() clears all snapshots', () => {
  const cp = makeCpStub();
  const p  = new UnityMemoryProfiler();
  p.snapshot(cp, 'a'); p.snapshot(cp, 'b');
  p.reset();
  assert.equal(p.getHistory().length, 0);
});

test('dropSnapshot() removes a specific label', () => {
  const cp = makeCpStub();
  const p  = new UnityMemoryProfiler();
  p.snapshot(cp, 'keep'); p.snapshot(cp, 'drop');
  p.dropSnapshot('drop');
  assert.equal(p.getHistory().length, 1);
  assert.equal(p.getHistory()[0].label, 'keep');
});

// ─────────────────────────────────────────────────────────────────────────────
originalLog('\n🔬 INVARIANT METRICS');
originalLog('═'.repeat(55));
// ─────────────────────────────────────────────────────────────────────────────

test('count and capacity reported correctly', () => {
  const invariants = [makeInvariant(), makeInvariant(), makeInvariant()];
  const cp = makeCpStub(invariants, new Map(), { maxMemory: 50 });
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.equal(r.unity.count, 3);
  assert.equal(r.unity.capacity, 50);
  assert.ok(Math.abs(r.unity.utilization - 3 / 50) < 1e-9);
});

test('weight stats correct (min / max / mean / stdDev)', () => {
  const invariants = [
    makeInvariant({ weight: 0.4 }),
    makeInvariant({ weight: 0.6 }),
    makeInvariant({ weight: 0.8 })
  ];
  const cp = makeCpStub(invariants);
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.equal(r.unity.weights.min,  0.4);
  assert.equal(r.unity.weights.max,  0.8);
  assert.ok(Math.abs(r.unity.weights.mean - 0.6) < 1e-9);
  assert.ok(r.unity.weights.stdDev > 0);
});

test('weight distribution buckets sum to total', () => {
  const invariants = [
    makeInvariant({ weight: 0.2 }),  // low
    makeInvariant({ weight: 0.5 }),  // medium
    makeInvariant({ weight: 0.9 })   // high
  ];
  const cp = makeCpStub(invariants);
  const { distribution } = new UnityMemoryProfiler().profile(cp).unity.weights;
  assert.equal(distribution.low + distribution.medium + distribution.high, 3);
  assert.equal(distribution.low,    1);
  assert.equal(distribution.medium, 1);
  assert.equal(distribution.high,   1);
});

test('diversity: identical unity structures produce ratio < 1', () => {
  const sameUnity = { val: { invariant: true, value: 0 } };
  const invariants = [
    makeInvariant({ unity: sameUnity }),
    makeInvariant({ unity: sameUnity }),
    makeInvariant({ unity: sameUnity })
  ];
  const cp = makeCpStub(invariants);
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.equal(r.unity.diversity.distinctStructures, 1);
  assert.ok(r.unity.diversity.ratio < 1);
});

test('diversity: unique unity structures produce ratio = 1', () => {
  const invariants = [
    makeInvariant({ unity: { a: { invariant: true, value: 0 } } }),
    makeInvariant({ unity: { b: { invariant: true, value: 1 } } }),
    makeInvariant({ unity: { c: 'unified' } })
  ];
  const cp = makeCpStub(invariants);
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.equal(r.unity.diversity.distinctStructures, 3);
  assert.equal(r.unity.diversity.ratio, 1);
});

test('recycling rate: high-weight invariants counted as reinforced', () => {
  const invariants = [
    makeInvariant({ weight: 0.9 }),  // reinforced
    makeInvariant({ weight: 0.9 }),  // reinforced
    makeInvariant({ weight: 0.5 })   // not reinforced
  ];
  const cp = makeCpStub(invariants);
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.ok(Math.abs(r.unity.recycling.rate - 2 / 3) < 1e-9);
  assert.equal(r.unity.recycling.reinforcedCount, 2);
});

test('sources breakdown groups by source field', () => {
  const invariants = [
    makeInvariant({ source: 'planckMirror' }),
    makeInvariant({ source: 'planckMirror' }),
    makeInvariant({ source: 'convergence' })
  ];
  const cp = makeCpStub(invariants);
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.equal(r.unity.sources.planckMirror, 2);
  assert.equal(r.unity.sources.convergence,  1);
});

test('missing source field falls back to "convergence"', () => {
  const inv = makeInvariant();
  delete inv.source;
  const cp = makeCpStub([inv]);
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.equal(r.unity.sources.convergence, 1);
});

test('ageRange tracks oldest/newest/span correctly', () => {
  const invariants = [
    makeInvariant({ cycle: 1 }),
    makeInvariant({ cycle: 5 }),
    makeInvariant({ cycle: 10 })
  ];
  const cp = makeCpStub(invariants);
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.equal(r.unity.ageRange.oldest, 1);
  assert.equal(r.unity.ageRange.newest, 10);
  assert.equal(r.unity.ageRange.span,   9);
});

// ─────────────────────────────────────────────────────────────────────────────
originalLog('\n🔬 QUANTUM STATES METRICS');
originalLog('═'.repeat(55));
// ─────────────────────────────────────────────────────────────────────────────

test('quantum profile: empty map returns count=0', () => {
  const cp = makeCpStub([], new Map());
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.equal(r.quantum.count, 0);
});

test('quantum profile: count and utilization correct', () => {
  const qStates = new Map([
    ['state_1', { original: { a: 1 }, reflection: { a: -1 }, unity: 'unified', timestamp: Date.now() }],
    ['state_2', { original: { b: 0 }, reflection: { b: 0  }, unity: 'unified', timestamp: Date.now() }]
  ]);
  const cp = makeCpStub([], qStates, { maxQuantumStates: 10 });
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.equal(r.quantum.count, 2);
  assert.equal(r.quantum.capacity, 10);
  assert.ok(Math.abs(r.quantum.utilization - 0.2) < 1e-9);
});

test('quantum profile: estimatedBytes > 0 for non-empty map', () => {
  const qStates = new Map([
    ['state_1', { original: { x: 42 }, reflection: { x: -42 }, unity: 'unified', timestamp: Date.now() }]
  ]);
  const cp = makeCpStub([], qStates);
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.ok(r.quantum.estimatedBytes > 0);
});

test('quantum profile: ageMs fields are numbers', () => {
  const ts = Date.now() - 500;
  const qStates = new Map([['s', { original: {}, reflection: {}, unity: 'unified', timestamp: ts }]]);
  const cp = makeCpStub([], qStates);
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.equal(typeof r.quantum.ageMs.min,  'number');
  assert.equal(typeof r.quantum.ageMs.max,  'number');
  assert.equal(typeof r.quantum.ageMs.mean, 'number');
  assert.ok(r.quantum.ageMs.min >= 400, 'age should reflect elapsed time');
});

// ─────────────────────────────────────────────────────────────────────────────
originalLog('\n🔬 RECOMMENDATIONS');
originalLog('═'.repeat(55));
// ─────────────────────────────────────────────────────────────────────────────

test('LOW_DIVERSITY fires when diversity ratio < threshold', () => {
  const sameUnity = { x: 'unified' };
  const invariants = Array.from({ length: 5 }, () => makeInvariant({ unity: sameUnity }));
  const cp = makeCpStub(invariants);
  const r  = new UnityMemoryProfiler({ diversityWarnThreshold: 0.5 }).profile(cp);
  assert.ok(r.recommendations.some(rec => rec.metric === 'unity.diversity' && rec.type === 'WARN'));
});

test('LOW_DIVERSITY does not fire when diversity is healthy', () => {
  const invariants = [
    makeInvariant({ unity: { a: 'unified' } }),
    makeInvariant({ unity: { b: { invariant: true, value: 0 } } }),
    makeInvariant({ unity: { c: { invariant: true, value: 'aba' } } })
  ];
  const cp = makeCpStub(invariants);
  const r  = new UnityMemoryProfiler({ diversityWarnThreshold: 0.3 }).profile(cp);
  assert.ok(!r.recommendations.some(rec => rec.metric === 'unity.diversity' && rec.type === 'WARN'));
});

test('HIGH_UTILIZATION fires when near capacity', () => {
  const invariants = Array.from({ length: 90 }, (_, i) =>
    makeInvariant({ unity: { [`k${i}`]: 'unified' }, cycle: i })
  );
  const cp = makeCpStub(invariants, new Map(), { maxMemory: 100 });
  const r  = new UnityMemoryProfiler({ utilizationWarnThreshold: 0.85 }).profile(cp);
  assert.ok(r.recommendations.some(rec => rec.metric === 'unity.utilization' && rec.type === 'WARN'));
});

test('LOW_WEIGHT fires when mean weight is low', () => {
  const invariants = [
    makeInvariant({ weight: 0.2 }),
    makeInvariant({ weight: 0.25 }),
    makeInvariant({ weight: 0.3 })
  ];
  const cp = makeCpStub(invariants);
  const r  = new UnityMemoryProfiler({ lowWeightThreshold: 0.35 }).profile(cp);
  assert.ok(r.recommendations.some(rec => rec.metric === 'unity.weights.mean' && rec.type === 'WARN'));
});

test('RECYCLING_HEALTHY fires when rate >= 0.5', () => {
  const invariants = [
    makeInvariant({ weight: 0.9 }),
    makeInvariant({ weight: 0.9 }),
    makeInvariant({ weight: 0.9 })
  ];
  const cp = makeCpStub(invariants);
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.ok(r.recommendations.some(rec => rec.metric === 'unity.recycling' && rec.type === 'OK'));
});

test('QUANTUM_PRESSURE fires when utilization >= quantumWarnRatio', () => {
  const qStates = new Map(
    Array.from({ length: 850 }, (_, i) => [
      `state_${i}`,
      { original: {}, reflection: {}, unity: 'unified', timestamp: Date.now() }
    ])
  );
  const cp = makeCpStub([makeInvariant()], qStates, { maxQuantumStates: 1000 });
  const r  = new UnityMemoryProfiler({ quantumWarnRatio: 0.8 }).profile(cp);
  assert.ok(r.recommendations.some(rec => rec.metric === 'quantum.utilization' && rec.type === 'WARN'));
});

test('OK overall fires when memory health is balanced', () => {
  const invariants = [
    makeInvariant({ unity: { a: 'unified' }, weight: 0.7 }),
    makeInvariant({ unity: { b: { invariant: true, value: 0 } }, weight: 0.75 }),
    makeInvariant({ unity: { c: { invariant: true, value: 'aba' } }, weight: 0.8 })
  ];
  const cp = makeCpStub(invariants, new Map(), { maxMemory: 100 });
  const r  = new UnityMemoryProfiler().profile(cp);
  assert.ok(r.recommendations.some(rec => rec.type === 'OK'));
});

// ─────────────────────────────────────────────────────────────────────────────
originalLog('\n🔬 COMPARE / DELTA');
originalLog('═'.repeat(55));
// ─────────────────────────────────────────────────────────────────────────────

test('compare() throws on unknown label', () => {
  const p = new UnityMemoryProfiler();
  assert.throws(() => p.compare('missing', 'also-missing'), /not found/);
});

test('compare() returns from/to labels', () => {
  const cp = makeCpStub();
  const p  = new UnityMemoryProfiler();
  p.snapshot(cp, 'A'); p.snapshot(cp, 'B');
  const d = p.compare('A', 'B');
  assert.equal(d.from, 'A');
  assert.equal(d.to,   'B');
});

test('compare() delta.count reflects invariant growth', () => {
  const p   = new UnityMemoryProfiler();
  const cp1 = makeCpStub([makeInvariant()]);
  const cp2 = makeCpStub([makeInvariant(), makeInvariant(), makeInvariant()]);
  p.snapshot(cp1, 'before');
  p.snapshot(cp2, 'after');
  const d = p.compare('before', 'after');
  assert.equal(d.unity.count.delta, 2);
});

test('compare() summary describes changes', () => {
  const p   = new UnityMemoryProfiler();
  const cp1 = makeCpStub([makeInvariant()]);
  const cp2 = makeCpStub([
    makeInvariant(), makeInvariant(), makeInvariant(),
    makeInvariant(), makeInvariant()
  ]);
  p.snapshot(cp1, 'before');
  p.snapshot(cp2, 'after');
  const d = p.compare('before', 'after');
  assert.equal(typeof d.summary, 'string');
  assert.ok(d.summary.length > 0);
});

test('compare() quantum delta tracks state count change', () => {
  const qs1 = new Map([['s1', { original: {}, reflection: {}, unity: 'unified', timestamp: Date.now() }]]);
  const qs2 = new Map([
    ['s1', { original: {}, reflection: {}, unity: 'unified', timestamp: Date.now() }],
    ['s2', { original: {}, reflection: {}, unity: 'unified', timestamp: Date.now() }]
  ]);
  const p = new UnityMemoryProfiler();
  p.snapshot(makeCpStub([], qs1), 'q-before');
  p.snapshot(makeCpStub([], qs2), 'q-after');
  const d = p.compare('q-before', 'q-after');
  assert.equal(d.quantum.count.delta, 1);
});

// ─────────────────────────────────────────────────────────────────────────────
originalLog('\n🔬 INTEGRATION WITH ConvergencePrinciple');
originalLog('═'.repeat(55));
// ─────────────────────────────────────────────────────────────────────────────

test('snapshot + profile on real ConvergencePrinciple after cycles', () => {
  const cp = new ConvergencePrinciple({ learningRate: 0.2 });
  cp.initialize();
  const p = new UnityMemoryProfiler();

  p.snapshot(cp, 'start');

  // Feed cycles with palindrome-rich patterns (generates invariants)
  for (let i = 0; i < 10; i++) {
    cp.converge([
      { note: 'C4', value: 0, word: 'aba' },
      { note: 'G4', value: 0, word: 'aba' }
    ]);
    cp.planckMirror({ value: 0, word: 'racecar' });
  }

  p.snapshot(cp, 'after-10');
  const delta = p.compare('start', 'after-10');

  assert.ok(delta.unity.count.delta >= 0, 'invariant count should grow or stay');
  assert.equal(typeof delta.summary, 'string');

  const report = p.profile(cp);
  assert.ok(Array.isArray(report.recommendations));
  assert.ok(report.unity.count >= 0);
});

test('learningRate is reported in unity section', () => {
  const cp = new ConvergencePrinciple({ learningRate: 0.42 });
  cp.initialize();
  const r = new UnityMemoryProfiler().profile(cp);
  assert.equal(r.unity.learningRate, 0.42);
});

// ─────────────────────────────────────────────────────────────────────────────
console.log  = originalLog;
console.warn = originalWarn;

console.log('\n' + '═'.repeat(55));
console.log(`📊 RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('═'.repeat(55));

if (failures.length > 0) {
  console.log('\nFailures:');
  for (const f of failures) console.log(`  ✗ ${f.name}: ${f.error}`);
}

console.log('');
process.exit(failed > 0 ? 1 : 0);
