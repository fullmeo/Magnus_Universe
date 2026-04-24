/**
 * Magnus 14 - Unity Memory Profiler
 *
 * Point-in-time snapshots of unityMemory.invariants and quantumStates
 * from a ConvergencePrinciple instance. Reports diversity, weight
 * distribution, recycling rate, age spread, and memory footprint.
 * Compares snapshots over time and emits actionable tuning recommendations
 * for learningRate and maxUnityMemory.
 */

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function _mean(arr) {
  return arr.length ? arr.reduce((s, v) => s + v, 0) / arr.length : 0;
}

function _stdDev(arr) {
  if (arr.length < 2) return 0;
  const m = _mean(arr);
  return Math.sqrt(arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length);
}

/** Circular-safe JSON stringify (mirrors ConvergencePrinciple.safeStringify). */
function _safeStr(value) {
  const seen = new WeakSet();
  try {
    return JSON.stringify(value, (_, v) => {
      if (typeof v === 'object' && v !== null) {
        if (seen.has(v)) return '[Circular]';
        seen.add(v);
      }
      return v;
    });
  } catch {
    return '[unstringifiable]';
  }
}

/**
 * Structural fingerprint of a unity object.
 * Sorts keys for stability; uses the first 80 chars as a cheap hash.
 */
function _fingerprint(unity) {
  if (unity === null || unity === undefined) return 'null';
  if (typeof unity !== 'object') return String(unity).slice(0, 80);
  try {
    const sorted = JSON.parse(_safeStr(unity));
    return JSON.stringify(sorted, Object.keys(sorted ?? {}).sort()).slice(0, 80);
  } catch {
    return '[fingerprint-error]';
  }
}

/** Rough byte estimate for a Map entry (key string + JSON value * 2 for UTF-16). */
function _estimateBytes(key, value) {
  try {
    return key.length * 2 + _safeStr(value).length * 2;
  } catch {
    return key.length * 2;
  }
}

// ---------------------------------------------------------------------------
// UnityMemoryProfiler
// ---------------------------------------------------------------------------

export class UnityMemoryProfiler {
  /**
   * @param {object} [options]
   * @param {number} [options.diversityWarnThreshold=0.3]
   *   Diversity ratio below which a LOW_DIVERSITY recommendation is emitted.
   * @param {number} [options.utilizationWarnThreshold=0.85]
   *   Utilization above which a HIGH_UTILIZATION recommendation is emitted.
   * @param {number} [options.lowWeightThreshold=0.35]
   *   Mean weight below which a LOW_WEIGHT recommendation is emitted.
   * @param {number} [options.quantumWarnRatio=0.8]
   *   Fraction of maxQuantumStates that triggers a QUANTUM_PRESSURE warning.
   */
  constructor(options = {}) {
    this.diversityWarnThreshold    = options.diversityWarnThreshold    ?? 0.3;
    this.utilizationWarnThreshold  = options.utilizationWarnThreshold  ?? 0.85;
    this.lowWeightThreshold        = options.lowWeightThreshold        ?? 0.35;
    this.quantumWarnRatio          = options.quantumWarnRatio          ?? 0.8;

    this._snapshots = new Map(); // label → snapshot
  }

  // --------------------------------------------------------------------------
  // Public API
  // --------------------------------------------------------------------------

  /**
   * Take a labeled snapshot of a ConvergencePrinciple's memory.
   * Snapshots are stored internally and can be compared later.
   *
   * @param {object} cp    - ConvergencePrinciple instance
   * @param {string} label - Identifier for this snapshot (e.g. 'before', 'after-50-cycles')
   * @returns {object}     Snapshot object
   */
  snapshot(cp, label = `snap_${Date.now()}`) {
    const snap = this._buildSnapshot(cp, label);
    this._snapshots.set(label, snap);
    return snap;
  }

  /**
   * Full profile with recommendations. Does not store a snapshot.
   *
   * @param {object} cp - ConvergencePrinciple instance
   * @returns {object}
   */
  profile(cp) {
    const snap = this._buildSnapshot(cp, 'profile');
    return { ...snap, recommendations: this._recommend(snap) };
  }

  /**
   * Compare two previously taken snapshots.
   *
   * @param {string} labelA
   * @param {string} labelB
   * @returns {object} Delta report
   */
  compare(labelA, labelB) {
    const a = this._snapshots.get(labelA);
    const b = this._snapshots.get(labelB);
    if (!a) throw new Error(`Snapshot '${labelA}' not found`);
    if (!b) throw new Error(`Snapshot '${labelB}' not found`);
    return this._buildDelta(a, b);
  }

  /** @returns {Array} All stored snapshots in insertion order */
  getHistory() {
    return Array.from(this._snapshots.values());
  }

  /** Remove a specific snapshot by label */
  dropSnapshot(label) {
    return this._snapshots.delete(label);
  }

  /** Clear all stored snapshots */
  reset() {
    this._snapshots.clear();
    return this;
  }

  // --------------------------------------------------------------------------
  // Snapshot construction
  // --------------------------------------------------------------------------

  _buildSnapshot(cp, label) {
    return {
      label,
      timestamp:  new Date().toISOString(),
      unity:      this._profileInvariants(cp.unityMemory),
      quantum:    this._profileQuantumStates(cp.quantumStates, cp.maxQuantumStates)
    };
  }

  _profileInvariants(unityMemory) {
    const { invariants, learningRate, maxMemory } = unityMemory;

    if (invariants.length === 0) {
      return {
        count: 0, capacity: maxMemory, utilization: 0,
        learningRate, diversity: null, weights: null,
        recycling: null, sources: {}, ageRange: null
      };
    }

    // ── Weights ───────────────────────────────────────────────────────────────
    const weights = invariants.map(i => i.weight);
    const wMean   = _mean(weights);
    const wStdDev = _stdDev(weights);
    const wBuckets = { low: 0, medium: 0, high: 0 };
    for (const w of weights) {
      if      (w < 0.4) wBuckets.low++;
      else if (w < 0.75) wBuckets.medium++;
      else               wBuckets.high++;
    }

    // ── Diversity ─────────────────────────────────────────────────────────────
    const fingerprints    = new Set(invariants.map(i => _fingerprint(i.unity)));
    const diversityRatio  = fingerprints.size / invariants.length;

    // ── Recycling ─────────────────────────────────────────────────────────────
    // Invariants reinforced by convergence have weight > 0.8 (boosted from initial)
    const reinforced     = invariants.filter(i => i.weight > 0.8).length;
    const recyclingRate  = reinforced / invariants.length;

    // ── Sources ───────────────────────────────────────────────────────────────
    const sources = {};
    for (const inv of invariants) {
      const src = inv.source ?? 'convergence';
      sources[src] = (sources[src] ?? 0) + 1;
    }

    // ── Age ───────────────────────────────────────────────────────────────────
    const cycles    = invariants.map(i => i.cycle ?? 0);
    const ageRange  = {
      oldest: Math.min(...cycles),
      newest: Math.max(...cycles),
      span:   Math.max(...cycles) - Math.min(...cycles)
    };

    return {
      count:        invariants.length,
      capacity:     maxMemory,
      utilization:  invariants.length / maxMemory,
      learningRate,
      diversity: {
        distinctStructures: fingerprints.size,
        ratio:              diversityRatio
      },
      weights: {
        min:          Math.min(...weights),
        max:          Math.max(...weights),
        mean:         wMean,
        stdDev:       wStdDev,
        distribution: wBuckets
      },
      recycling: {
        reinforcedCount: reinforced,
        rate:            recyclingRate
      },
      sources,
      ageRange
    };
  }

  _profileQuantumStates(qStates, maxQuantumStates = 1000) {
    if (qStates.size === 0) {
      return { count: 0, capacity: maxQuantumStates, utilization: 0 };
    }

    const now      = Date.now();
    const entries  = Array.from(qStates.entries());
    const ages     = entries.map(([, v]) => now - (v.timestamp ?? now));
    let estimatedBytes = 0;
    for (const [k, v] of entries) estimatedBytes += _estimateBytes(k, v);

    return {
      count:         qStates.size,
      capacity:      maxQuantumStates,
      utilization:   qStates.size / maxQuantumStates,
      ageMs: {
        min:  Math.min(...ages),
        max:  Math.max(...ages),
        mean: Math.round(_mean(ages))
      },
      estimatedBytes
    };
  }

  // --------------------------------------------------------------------------
  // Recommendations
  // --------------------------------------------------------------------------

  _recommend(snap) {
    const recs = [];
    const { unity, quantum } = snap;

    if (!unity || unity.count === 0) {
      recs.push({
        type: 'INFO',
        metric: 'unity.count',
        message: 'No invariants in memory yet — run more cycles to populate unity memory.'
      });
      return recs;
    }

    // LOW_DIVERSITY — redundant invariants clog memory with duplicates
    if (unity.diversity.ratio < this.diversityWarnThreshold) {
      recs.push({
        type: 'WARN',
        metric: 'unity.diversity',
        value: unity.diversity.ratio,
        message:
          `Low diversity: ${(unity.diversity.ratio * 100).toFixed(1)}% ` +
          `(${unity.diversity.distinctStructures} distinct / ${unity.count} total). ` +
          `Invariants are largely redundant. ` +
          `Try reducing learningRate (currently ${unity.learningRate}) ` +
          `or exposing more varied input patterns.`
      });
    }

    // HIGH_UTILIZATION — memory filling up, oldest invariants will be evicted
    if (unity.utilization >= this.utilizationWarnThreshold) {
      recs.push({
        type: 'WARN',
        metric: 'unity.utilization',
        value: unity.utilization,
        message:
          `High utilization: ${(unity.utilization * 100).toFixed(1)}% ` +
          `(${unity.count}/${unity.capacity}). ` +
          `Oldest invariants are being evicted. ` +
          `Consider increasing maxUnityMemory or lowering learningRate ` +
          `to slow accumulation.`
      });
    }

    // LOW_WEIGHT — invariants not being reinforced, low signal quality
    if (unity.weights.mean < this.lowWeightThreshold) {
      recs.push({
        type: 'WARN',
        metric: 'unity.weights.mean',
        value: unity.weights.mean,
        message:
          `Low average weight: ${unity.weights.mean.toFixed(3)}. ` +
          `Invariants are weak — convergence threshold may be too high ` +
          `or cycles are not producing strong harmonic scores. ` +
          `Review convergenceThreshold configuration.`
      });
    }

    // RECYCLING_HEALTHY — informational positive signal
    if (unity.recycling.rate >= 0.5) {
      recs.push({
        type: 'OK',
        metric: 'unity.recycling',
        value: unity.recycling.rate,
        message:
          `Healthy recycling rate: ${(unity.recycling.rate * 100).toFixed(1)}% ` +
          `of invariants reinforced. Memory is compounding effectively.`
      });
    }

    // QUANTUM_PRESSURE — approaching prune threshold
    if (quantum.count > 0 && quantum.utilization >= this.quantumWarnRatio) {
      recs.push({
        type: 'WARN',
        metric: 'quantum.utilization',
        value: quantum.utilization,
        message:
          `quantumStates at ${(quantum.utilization * 100).toFixed(1)}% ` +
          `(${quantum.count}/${quantum.capacity}) — pruning will trigger soon. ` +
          `Estimated footprint: ${(quantum.estimatedBytes / 1024).toFixed(1)} KB. ` +
          `Consider reducing maxQuantumStates if memory is constrained.`
      });
    }

    if (recs.length === 0 || recs.every(r => r.type === 'OK')) {
      recs.unshift({
        type: 'OK',
        metric: 'overall',
        message: 'Memory health is balanced — diversity, weights, and utilization look good.'
      });
    }

    return recs;
  }

  // --------------------------------------------------------------------------
  // Delta comparison
  // --------------------------------------------------------------------------

  _buildDelta(a, b) {
    const du = this._deltaUnity(a.unity, b.unity);
    const dq = this._deltaQuantum(a.quantum, b.quantum);

    return {
      from:      a.label,
      to:        b.label,
      fromTime:  a.timestamp,
      toTime:    b.timestamp,
      unity:     du,
      quantum:   dq,
      summary:   this._deltaSummary(du, dq)
    };
  }

  _deltaUnity(a, b) {
    if (!a || !b) return null;
    return {
      count:       { from: a.count,                   to: b.count,                   delta: b.count - a.count },
      utilization: { from: a.utilization,              to: b.utilization,              delta: _round(b.utilization - a.utilization) },
      diversity:   { from: a.diversity?.ratio ?? null, to: b.diversity?.ratio ?? null, delta: _round((b.diversity?.ratio ?? 0) - (a.diversity?.ratio ?? 0)) },
      weightMean:  { from: a.weights?.mean ?? null,    to: b.weights?.mean ?? null,    delta: _round((b.weights?.mean ?? 0) - (a.weights?.mean ?? 0)) },
      recycling:   { from: a.recycling?.rate ?? null,  to: b.recycling?.rate ?? null,  delta: _round((b.recycling?.rate ?? 0) - (a.recycling?.rate ?? 0)) }
    };
  }

  _deltaQuantum(a, b) {
    if (!a || !b) return null;
    return {
      count:         { from: a.count,          to: b.count,          delta: b.count - a.count },
      utilization:   { from: a.utilization,    to: b.utilization,    delta: _round(b.utilization - a.utilization) },
      estimatedBytes:{ from: a.estimatedBytes, to: b.estimatedBytes, delta: b.estimatedBytes - a.estimatedBytes }
    };
  }

  _deltaSummary(du, dq) {
    const lines = [];
    if (du) {
      if (du.count.delta > 0)          lines.push(`+${du.count.delta} invariants learned`);
      if (du.count.delta < 0)          lines.push(`${du.count.delta} invariants evicted`);
      if (du.diversity.delta < -0.05)  lines.push(`diversity dropped ${(du.diversity.delta * 100).toFixed(1)}%`);
      if (du.diversity.delta >  0.05)  lines.push(`diversity improved ${(du.diversity.delta * 100).toFixed(1)}%`);
      if (du.weightMean.delta > 0.05)  lines.push(`weights strengthened (+${du.weightMean.delta.toFixed(3)})`);
      if (du.weightMean.delta < -0.05) lines.push(`weights weakened (${du.weightMean.delta.toFixed(3)})`);
    }
    if (dq && dq.count.delta !== 0)    lines.push(`quantumStates: ${dq.count.delta > 0 ? '+' : ''}${dq.count.delta}`);
    return lines.length ? lines.join('; ') : 'no significant changes';
  }
}

function _round(n) { return Math.round(n * 10000) / 10000; }

export default UnityMemoryProfiler;
