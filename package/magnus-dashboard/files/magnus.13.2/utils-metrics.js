import { promises as fs } from 'fs';
import path from 'path';

class MetricsCollector {
  constructor() {
    this.timers = {
      analyze: [],
      generation: [],
      validation: []
    };
    this.counters = {
      analyze: 0,
      generation: 0,
      validation: 0,
      errors: 0
    };
    this._ensureSaveOnExit();
  }

  record(name, ms) {
    if (!this.timers[name]) this.timers[name] = [];
    this.timers[name].push(ms);
    if (!this.counters[name]) this.counters[name] = 0;
    this.counters[name] += 1;
  }

  increment(name) {
    this.counters[name] = (this.counters[name] || 0) + 1;
  }

  _percentile(arr, p) {
    if (!arr || arr.length === 0) return 0;
    const sorted = arr.slice().sort((a,b)=>a-b);
    const idx = Math.ceil((p/100) * sorted.length) - 1;
    return Math.max(0, sorted[idx]);
  }

  summary() {
    const sumMs = (arr)=>arr.reduce((s,x)=>s+x,0);
    return {
      counters: this.counters,
      analyze: {
        count: this.timers.analyze.length,
        avg: this.timers.analyze.length ? Math.round(sumMs(this.timers.analyze)/this.timers.analyze.length) : 0,
        p50: this._percentile(this.timers.analyze,50),
        p95: this._percentile(this.timers.analyze,95),
        p99: this._percentile(this.timers.analyze,99)
      },
      generation: {
        count: this.timers.generation.length,
        avg: this.timers.generation.length ? Math.round(sumMs(this.timers.generation)/this.timers.generation.length) : 0,
        p50: this._percentile(this.timers.generation,50),
        p95: this._percentile(this.timers.generation,95),
        p99: this._percentile(this.timers.generation,99)
      },
      validation: {
        count: this.timers.validation.length,
        avg: this.timers.validation.length ? Math.round(sumMs(this.timers.validation)/this.timers.validation.length) : 0,
        p50: this._percentile(this.timers.validation,50),
        p95: this._percentile(this.timers.validation,95),
        p99: this._percentile(this.timers.validation,99)
      }
    };
  }

  async saveToFile(filePath = path.resolve(process.cwd(), '.logs', 'metrics.json')) {
    try {
      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, JSON.stringify({ ts: Date.now(), summary: this.summary() }, null, 2), 'utf8');
    } catch (e) {
      // don't crash on metrics save
      // eslint-disable-next-line no-console
      console.error('Failed to save metrics:', e && e.message);
    }
  }

  _ensureSaveOnExit() {
    const save = async () => { await this.saveToFile(); };
    process.on('exit', ()=>{ void save(); });
    process.on('SIGINT', ()=>{ void save(); process.exit(); });
    process.on('uncaughtException', ()=>{ void save(); });
  }
}

export default MetricsCollector;
