/**
 * Magnus 14 - Convergence Inspector
 *
 * Real-time drift detection and refinement quality monitoring for
 * ConvergencePrinciple. Wraps converge() via attach() or accepts
 * manual observations via observe(). Fires structured alerts for:
 *
 *   DRIFT        — rolling mean is declining across the window
 *   STERILE_LOOP — variance near zero but threshold not reached
 *   REGRESSION   — single-cycle score drop exceeds regressionThreshold
 */

export class ConvergenceInspector {
  /**
   * @param {object} [options]
   * @param {number} [options.windowSize=5]            - Cycles in the rolling window
   * @param {number} [options.driftThreshold=0.05]     - Mean drop (0–1) that triggers DRIFT
   * @param {number} [options.stagnationEpsilon=0.01]  - Max std-dev that triggers STERILE_LOOP
   * @param {number} [options.regressionThreshold=0.1] - Single-cycle drop that triggers REGRESSION
   * @param {number} [options.convergenceThreshold=0.95]
   * @param {number} [options.minCycles=3]             - Cycles required before drift analysis runs
   * @param {number} [options.alertCooldown=3]         - Min cycles between identical alert types
   */
  constructor(options = {}) {
    this.windowSize           = options.windowSize           ?? 5;
    this.driftThreshold       = options.driftThreshold       ?? 0.05;
    this.stagnationEpsilon    = options.stagnationEpsilon    ?? 0.01;
    this.regressionThreshold  = options.regressionThreshold  ?? 0.1;
    this.convergenceThreshold = options.convergenceThreshold ?? 0.95;
    this.minCycles            = options.minCycles            ?? 3;
    this.alertCooldown        = options.alertCooldown        ?? 3;

    this._history  = [];
    this._alerts   = [];
    this._attached = null;
    this._originalConverge = null;
  }

  // ---------------------------------------------------------------------------
  // Attach / detach
  // ---------------------------------------------------------------------------

  /**
   * Attach to a ConvergencePrinciple instance.
   * Wraps converge() so every cycle is observed automatically.
   *
   * @param {object} cp - ConvergencePrinciple instance
   * @returns {this}
   */
  attach(cp) {
    if (this._attached) this.detach();

    this._attached = cp;
    this._originalConverge = cp.converge.bind(cp);

    cp.converge = (patterns) => {
      const result = this._originalConverge(patterns);
      this.observe(result.harmonicScore, result.cycle);
      return result;
    };

    return this;
  }

  /**
   * Restore the original converge() method and stop observing.
   * @returns {this}
   */
  detach() {
    if (this._attached && this._originalConverge) {
      this._attached.converge = this._originalConverge;
    }
    this._attached       = null;
    this._originalConverge = null;
    return this;
  }

  // ---------------------------------------------------------------------------
  // Observation
  // ---------------------------------------------------------------------------

  /**
   * Record one cycle result. Called automatically when attached;
   * call manually when using the inspector standalone.
   *
   * @param {number} harmonicScore - Score in [0, 1]
   * @param {number} cycle         - Cycle number
   * @returns {this}
   */
  observe(harmonicScore, cycle) {
    const prev       = this._history.at(-1) ?? null;
    const improvement = prev !== null ? harmonicScore - prev.score : null;

    this._history.push({
      cycle,
      score:       harmonicScore,
      improvement,
      timestamp:   new Date().toISOString()
    });

    if (this._history.length >= this.minCycles) {
      this._detectRegression(harmonicScore, cycle, improvement);
      this._detectDrift(cycle);
      this._detectSterileLoop(harmonicScore, cycle);
    }

    return this;
  }

  // ---------------------------------------------------------------------------
  // Detection algorithms
  // ---------------------------------------------------------------------------

  /**
   * REGRESSION — single cycle drop larger than regressionThreshold.
   */
  _detectRegression(score, cycle, improvement) {
    if (improvement === null) return;
    if (-improvement >= this.regressionThreshold) {
      this._addAlert(
        'REGRESSION', cycle, score,
        `Score dropped ${((-improvement) * 100).toFixed(1)}% in one cycle ` +
        `(${((score - improvement) * 100).toFixed(1)}% → ${(score * 100).toFixed(1)}%)`
      );
    }
  }

  /**
   * DRIFT — rolling-window mean is declining.
   * Splits the window in two halves; fires when the second half mean
   * is lower than the first half mean by at least driftThreshold.
   */
  _detectDrift(cycle) {
    const window = this._history.slice(-this.windowSize);
    if (window.length < 4) return;

    const mid         = Math.floor(window.length / 2);
    const meanFirst   = _mean(window.slice(0, mid).map(e => e.score));
    const meanSecond  = _mean(window.slice(mid).map(e => e.score));
    const drop        = meanFirst - meanSecond;

    if (drop >= this.driftThreshold) {
      this._addAlert(
        'DRIFT', cycle, window.at(-1).score,
        `Rolling mean dropped ${(drop * 100).toFixed(1)}% over last ${window.length} cycles ` +
        `(${(meanFirst * 100).toFixed(1)}% → ${(meanSecond * 100).toFixed(1)}%)`
      );
    }
  }

  /**
   * STERILE_LOOP — scores have low variance but convergence is not reached.
   * Indicates refinement cycles are running without making progress.
   */
  _detectSterileLoop(score, cycle) {
    const window = this._history.slice(-this.windowSize);
    if (window.length < this.windowSize) return;
    if (score >= this.convergenceThreshold) return;

    const scores = window.map(e => e.score);
    const stdDev = _stdDev(scores);

    if (stdDev < this.stagnationEpsilon) {
      this._addAlert(
        'STERILE_LOOP', cycle, score,
        `Score locked at ~${(_mean(scores) * 100).toFixed(1)}% ` +
        `(σ=${stdDev.toFixed(4)}) — threshold ${(this.convergenceThreshold * 100).toFixed(0)}% not reached`
      );
    }
  }

  // ---------------------------------------------------------------------------
  // Alert management
  // ---------------------------------------------------------------------------

  /**
   * Add an alert, respecting the per-type cooldown to avoid spam.
   */
  _addAlert(type, cycle, score, details) {
    const lastOfType = [...this._alerts].reverse().find(a => a.type === type);
    if (lastOfType && cycle - lastOfType.cycle < this.alertCooldown) return;

    const alert = { type, cycle, score, details, timestamp: new Date().toISOString() };
    this._alerts.push(alert);
    console.warn(`[ConvergenceInspector] ${type} @ cycle ${cycle}: ${details}`);
    return alert;
  }

  // ---------------------------------------------------------------------------
  // Reporting
  // ---------------------------------------------------------------------------

  /**
   * Returns a full quality report for the current session.
   *
   * @returns {{
   *   totalCycles: number,
   *   converged: boolean,
   *   scores: { first, last, min, max, mean },
   *   refinement: { meanImprovement, positiveSteps, negativeSteps, neutralSteps, efficiency },
   *   alerts: Array,
   *   history: Array
   * }}
   */
  getReport() {
    const scores      = this._history.map(e => e.score);
    const improvements = this._history
      .filter(e => e.improvement !== null)
      .map(e => e.improvement);

    const positiveSteps = improvements.filter(v => v >  0.001).length;
    const negativeSteps = improvements.filter(v => v < -0.001).length;
    const neutralSteps  = improvements.length - positiveSteps - negativeSteps;
    const totalSteps    = improvements.length || 1;

    return {
      totalCycles:  this._history.length,
      converged:    scores.length > 0 && scores.at(-1) >= this.convergenceThreshold,
      scores: scores.length === 0 ? null : {
        first: scores[0],
        last:  scores.at(-1),
        min:   Math.min(...scores),
        max:   Math.max(...scores),
        mean:  _mean(scores)
      },
      refinement: {
        meanImprovement: improvements.length ? _mean(improvements) : null,
        positiveSteps,
        negativeSteps,
        neutralSteps,
        efficiency: positiveSteps / totalSteps
      },
      alerts:  this.getAlerts(),
      history: [...this._history]
    };
  }

  /** @returns {Array} Copy of all alerts fired this session */
  getAlerts() {
    return [...this._alerts];
  }

  /** @returns {boolean} True if any alert has been fired */
  hasAlerts() {
    return this._alerts.length > 0;
  }

  /** @returns {Array} Only alerts of a specific type */
  getAlertsByType(type) {
    return this._alerts.filter(a => a.type === type);
  }

  /**
   * Clear history and alerts. Does not detach from an attached instance.
   * @returns {this}
   */
  reset() {
    this._history = [];
    this._alerts  = [];
    return this;
  }
}

// ---------------------------------------------------------------------------
// Private helpers
// ---------------------------------------------------------------------------

function _mean(arr) {
  return arr.reduce((s, v) => s + v, 0) / arr.length;
}

function _stdDev(arr) {
  const m   = _mean(arr);
  const variance = arr.reduce((s, v) => s + (v - m) ** 2, 0) / arr.length;
  return Math.sqrt(variance);
}

export default ConvergenceInspector;
