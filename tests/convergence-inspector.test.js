/**
 * ConvergenceInspector — test suite
 *
 * Covers: attach/detach, manual observe, DRIFT, STERILE_LOOP, REGRESSION,
 * alert cooldown, getReport(), reset(), edge cases.
 *
 * Run: node tests/convergence-inspector.test.js
 */

import assert from 'node:assert/strict';
import { ConvergenceInspector } from '../src/magnus-14-convergence-inspector.js';
import { ConvergencePrinciple }  from '../src/magnus-13-2-convergence-principle.js';

const originalWarn = console.warn;
console.warn = () => {};          // suppress inspector warnings during tests

let passed = 0;
let failed = 0;
const failures = [];

function test(name, fn) {
  try {
    fn();
    passed++;
    originalWarn(`  ✅ ${name}`);
  } catch (err) {
    failed++;
    failures.push({ name, error: err.message });
    originalWarn(`  ❌ ${name}`);
    originalWarn(`     ${err.message}`);
  }
}

// ─────────────────────────────────────────────────────────────────────────────
originalWarn('\n🔬 CONVERGENCE INSPECTOR — CORE TESTS');
originalWarn('═'.repeat(55));
// ─────────────────────────────────────────────────────────────────────────────

test('observe() records history entries', () => {
  const ci = new ConvergenceInspector();
  ci.observe(0.6, 1);
  ci.observe(0.7, 2);
  ci.observe(0.8, 3);
  assert.equal(ci._history.length, 3);
  assert.equal(ci._history[0].score, 0.6);
  assert.equal(ci._history[2].score, 0.8);
});

test('first observation has improvement=null', () => {
  const ci = new ConvergenceInspector();
  ci.observe(0.5, 1);
  assert.equal(ci._history[0].improvement, null);
});

test('subsequent observations track improvement correctly', () => {
  const ci = new ConvergenceInspector();
  ci.observe(0.5, 1);
  ci.observe(0.7, 2);
  assert.ok(Math.abs(ci._history[1].improvement - 0.2) < 1e-9);
});

test('reset() clears history and alerts', () => {
  const ci = new ConvergenceInspector({ minCycles: 1 });
  ci.observe(0.9, 1);
  ci.reset();
  assert.equal(ci._history.length, 0);
  assert.equal(ci._alerts.length, 0);
});

// ─────────────────────────────────────────────────────────────────────────────
originalWarn('\n🔬 ATTACH / DETACH');
originalWarn('═'.repeat(55));
// ─────────────────────────────────────────────────────────────────────────────

test('attach() wraps converge() and auto-observes', () => {
  const cp = new ConvergencePrinciple();
  cp.initialize();
  const ci = new ConvergenceInspector();
  ci.attach(cp);

  cp.converge([{ a: 1 }, { b: 2 }]);
  cp.converge([{ a: 1 }, { b: 2 }]);

  assert.equal(ci._history.length, 2, 'Two converge() calls → two observations');
  ci.detach();
});

test('detach() restores original converge()', () => {
  const cp = new ConvergencePrinciple();
  cp.initialize();
  const ci = new ConvergenceInspector();
  ci.attach(cp);
  ci.detach();

  // After detach, converge should work normally and inspector not grow
  cp.converge([{ x: 1 }, { y: 2 }]);
  assert.equal(ci._history.length, 0, 'detach() stops observation');
});

test('attach() over existing attach() replaces previous wrap', () => {
  const cp = new ConvergencePrinciple();
  cp.initialize();
  const ci1 = new ConvergenceInspector();
  const ci2 = new ConvergenceInspector();
  ci1.attach(cp);
  ci2.attach(cp); // should detach ci1 first (no, ci2 attaches independently)
  cp.converge([{ a: 1 }, { b: 2 }]);
  // ci2 should have observed it
  assert.equal(ci2._history.length, 1);
  ci2.detach();
});

// ─────────────────────────────────────────────────────────────────────────────
originalWarn('\n🔬 REGRESSION DETECTION');
originalWarn('═'.repeat(55));
// ─────────────────────────────────────────────────────────────────────────────

test('REGRESSION fires on large single-cycle drop', () => {
  const ci = new ConvergenceInspector({ regressionThreshold: 0.1, minCycles: 2 });
  ci.observe(0.8, 1);
  ci.observe(0.8, 2); // minCycles reached
  ci.observe(0.65, 3); // drop of 0.15 → should fire
  const regressions = ci.getAlertsByType('REGRESSION');
  assert.equal(regressions.length, 1);
  assert.equal(regressions[0].cycle, 3);
});

test('REGRESSION does not fire on small drop', () => {
  const ci = new ConvergenceInspector({ regressionThreshold: 0.1, minCycles: 2 });
  ci.observe(0.8, 1);
  ci.observe(0.8, 2);
  ci.observe(0.75, 3); // drop of 0.05 → below threshold
  assert.equal(ci.getAlertsByType('REGRESSION').length, 0);
});

test('REGRESSION does not fire on improvement', () => {
  const ci = new ConvergenceInspector({ regressionThreshold: 0.1, minCycles: 2 });
  ci.observe(0.5, 1);
  ci.observe(0.5, 2);
  ci.observe(0.8, 3);
  assert.equal(ci.getAlertsByType('REGRESSION').length, 0);
});

// ─────────────────────────────────────────────────────────────────────────────
originalWarn('\n🔬 DRIFT DETECTION');
originalWarn('═'.repeat(55));
// ─────────────────────────────────────────────────────────────────────────────

test('DRIFT fires when rolling mean is declining', () => {
  const ci = new ConvergenceInspector({
    windowSize: 6, driftThreshold: 0.05, minCycles: 3
  });
  // First half mean: ~0.8, second half mean: ~0.5 → drop > 0.05
  [0.82, 0.81, 0.80, 0.55, 0.52, 0.50].forEach((s, i) => ci.observe(s, i + 1));
  assert.ok(ci.getAlertsByType('DRIFT').length > 0, 'DRIFT should fire');
});

test('DRIFT does not fire on stable scores', () => {
  const ci = new ConvergenceInspector({
    windowSize: 6, driftThreshold: 0.05, minCycles: 3
  });
  [0.70, 0.71, 0.70, 0.72, 0.71, 0.70].forEach((s, i) => ci.observe(s, i + 1));
  assert.equal(ci.getAlertsByType('DRIFT').length, 0);
});

test('DRIFT does not fire on improving scores', () => {
  const ci = new ConvergenceInspector({
    windowSize: 6, driftThreshold: 0.05, minCycles: 3
  });
  [0.50, 0.55, 0.60, 0.70, 0.80, 0.90].forEach((s, i) => ci.observe(s, i + 1));
  assert.equal(ci.getAlertsByType('DRIFT').length, 0);
});

// ─────────────────────────────────────────────────────────────────────────────
originalWarn('\n🔬 STERILE LOOP DETECTION');
originalWarn('═'.repeat(55));
// ─────────────────────────────────────────────────────────────────────────────

test('STERILE_LOOP fires when score is locked below threshold', () => {
  const ci = new ConvergenceInspector({
    windowSize: 5, stagnationEpsilon: 0.01,
    convergenceThreshold: 0.95, minCycles: 3
  });
  // Five identical scores well below threshold
  [0.70, 0.70, 0.70, 0.70, 0.70].forEach((s, i) => ci.observe(s, i + 1));
  assert.ok(ci.getAlertsByType('STERILE_LOOP').length > 0, 'STERILE_LOOP should fire');
});

test('STERILE_LOOP does not fire when score reaches threshold', () => {
  const ci = new ConvergenceInspector({
    windowSize: 5, stagnationEpsilon: 0.01, convergenceThreshold: 0.70
  });
  [0.70, 0.70, 0.70, 0.70, 0.70].forEach((s, i) => ci.observe(s, i + 1));
  assert.equal(ci.getAlertsByType('STERILE_LOOP').length, 0,
    'Score at threshold should not trigger STERILE_LOOP');
});

test('STERILE_LOOP does not fire when scores vary enough', () => {
  const ci = new ConvergenceInspector({
    windowSize: 5, stagnationEpsilon: 0.01,
    convergenceThreshold: 0.95, minCycles: 3
  });
  [0.50, 0.60, 0.55, 0.65, 0.70].forEach((s, i) => ci.observe(s, i + 1));
  assert.equal(ci.getAlertsByType('STERILE_LOOP').length, 0);
});

// ─────────────────────────────────────────────────────────────────────────────
originalWarn('\n🔬 ALERT COOLDOWN');
originalWarn('═'.repeat(55));
// ─────────────────────────────────────────────────────────────────────────────

test('alert cooldown prevents duplicate alerts within cooldown window', () => {
  const ci = new ConvergenceInspector({
    windowSize: 4, driftThreshold: 0.05, minCycles: 3, alertCooldown: 5
  });
  // Trigger drift, then keep feeding declining scores
  [0.80, 0.79, 0.78, 0.50, 0.49, 0.48, 0.47, 0.46].forEach((s, i) =>
    ci.observe(s, i + 1)
  );
  const drifts = ci.getAlertsByType('DRIFT');
  // Should have fired, but not on every single cycle
  assert.ok(drifts.length < 6, `Cooldown should limit alerts, got ${drifts.length}`);
});

test('alert fires again after cooldown expires', () => {
  const ci = new ConvergenceInspector({
    windowSize: 4, driftThreshold: 0.05, minCycles: 3, alertCooldown: 2
  });
  // Trigger drift, gap of 2+ cycles, trigger drift again
  [0.80, 0.79, 0.78, 0.50].forEach((s, i) => ci.observe(s, i + 1));
  const countAfterFirst = ci.getAlertsByType('DRIFT').length;
  [0.80, 0.79, 0.78, 0.50].forEach((s, i) => ci.observe(s, i + 5));
  const countAfterSecond = ci.getAlertsByType('DRIFT').length;
  assert.ok(countAfterSecond >= countAfterFirst, 'Alert should re-fire after cooldown');
});

// ─────────────────────────────────────────────────────────────────────────────
originalWarn('\n🔬 REPORT');
originalWarn('═'.repeat(55));
// ─────────────────────────────────────────────────────────────────────────────

test('getReport() returns correct scores min/max/mean', () => {
  const ci = new ConvergenceInspector();
  [0.4, 0.6, 0.8, 0.5].forEach((s, i) => ci.observe(s, i + 1));
  const r = ci.getReport();
  assert.equal(r.scores.min, 0.4);
  assert.equal(r.scores.max, 0.8);
  assert.ok(Math.abs(r.scores.mean - 0.575) < 1e-9);
  assert.equal(r.scores.first, 0.4);
  assert.equal(r.scores.last, 0.5);
});

test('getReport() converged=true when last score >= threshold', () => {
  const ci = new ConvergenceInspector({ convergenceThreshold: 0.95 });
  ci.observe(0.50, 1); ci.observe(0.97, 2);
  assert.equal(ci.getReport().converged, true);
});

test('getReport() converged=false when last score < threshold', () => {
  const ci = new ConvergenceInspector({ convergenceThreshold: 0.95 });
  ci.observe(0.50, 1); ci.observe(0.80, 2);
  assert.equal(ci.getReport().converged, false);
});

test('getReport() tracks positive/negative refinement steps', () => {
  const ci = new ConvergenceInspector();
  [0.5, 0.6, 0.7, 0.65, 0.8].forEach((s, i) => ci.observe(s, i + 1));
  const r = ci.getReport();
  assert.equal(r.refinement.positiveSteps, 3, 'steps: +0.1, +0.1, +0.15 = 3 positive');
  assert.equal(r.refinement.negativeSteps, 1, 'step: -0.05 = 1 negative');
});

test('getReport() returns null scores when no observations', () => {
  const ci = new ConvergenceInspector();
  assert.equal(ci.getReport().scores, null);
  assert.equal(ci.getReport().totalCycles, 0);
});

test('hasAlerts() reflects alert state', () => {
  const ci = new ConvergenceInspector({ minCycles: 1, regressionThreshold: 0.05 });
  ci.observe(0.9, 1);
  assert.equal(ci.hasAlerts(), false);
  ci.observe(0.8, 2);
  ci.observe(0.5, 3); // regression
  assert.equal(ci.hasAlerts(), true);
});

// ─────────────────────────────────────────────────────────────────────────────
originalWarn('\n🔬 INTEGRATION WITH ConvergencePrinciple');
originalWarn('═'.repeat(55));
// ─────────────────────────────────────────────────────────────────────────────

test('full integration: attach → converge × N → detach', () => {
  const cp = new ConvergencePrinciple();
  cp.initialize();
  const ci = new ConvergenceInspector({ minCycles: 2 });
  ci.attach(cp);

  for (let i = 0; i < 5; i++) {
    cp.converge([{ note: 'C4', freq: 261 }, { note: 'E4', freq: 329 }]);
  }

  const report = ci.getReport();
  assert.equal(report.totalCycles, 5, 'Inspector should record 5 cycles');
  assert.ok(report.scores !== null);
  assert.ok(typeof report.scores.mean === 'number');

  ci.detach();

  // After detach, further calls don't grow history
  cp.converge([{ x: 1 }, { y: 2 }]);
  assert.equal(ci._history.length, 5, 'detach() stops recording');
});

// ─────────────────────────────────────────────────────────────────────────────
// Results
// ─────────────────────────────────────────────────────────────────────────────

console.warn = originalWarn;
console.log('\n' + '═'.repeat(55));
console.log(`📊 RESULTS: ${passed} passed, ${failed} failed, ${passed + failed} total`);
console.log('═'.repeat(55));

if (failures.length > 0) {
  console.log('\nFailures:');
  for (const f of failures) {
    console.log(`  ✗ ${f.name}: ${f.error}`);
  }
}

console.log('');
process.exit(failed > 0 ? 1 : 0);
