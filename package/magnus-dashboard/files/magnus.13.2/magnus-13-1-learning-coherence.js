import { promises as fs } from 'fs';
import path from 'path';

/**
 * LearningEngine: file-backed learning store
 * CoherenceEngine: session store with simple persistence
 */

export class LearningEngine {
  constructor(storeDir = path.resolve(process.cwd(), '.magnus', 'knowledge')) {
    this.storeDir = storeDir;
    this._init = false;
    this._store = { successes: [], failures: [] };
    this.file = path.join(this.storeDir, 'knowledge.json');
  }

  async initialize() {
    try {
      await fs.mkdir(this.storeDir, { recursive: true });
      const raw = await fs.readFile(this.file, 'utf8').catch(() => null);
      if (raw) this._store = JSON.parse(raw);
    } catch (e) {
      this._store = { successes: [], failures: [] };
    }
    this._init = true;
  }

  _save() {
    return fs.writeFile(this.file, JSON.stringify(this._store, null, 2), 'utf8').catch(() => {});
  }

  getRecommendations({ estimate } = {}) {
    if (!estimate) return { available: false, recommendations: [] };
    const candidates = this._store.successes.filter(s => s.estimate && Math.abs((s.estimate.complexityScore||0) - (estimate.complexityScore||0)) <= 2);
    return { available: candidates.length > 0, recommendations: candidates.map(c => ({ id: c.id, note: c.note || 'previous success' })) };
  }

  async recordActual(sessionId, outcome = {}) {
    this._store.successes.push({ id: sessionId, outcome, estimate: outcome.estimate || null, note: outcome.note || null, timestamp: Date.now() });
    await this._save();
  }

  async recordFailure(sessionId, obj = {}) {
    this._store.failures.push({ id: sessionId, info: obj, timestamp: Date.now() });
    await this._save();
  }
}

export class CoherenceEngine {
  constructor(storeDir = path.resolve(process.cwd(), '.magnus', 'sessions')) {
    this.storeDir = storeDir;
    this.sessions = new Map();
    this.file = path.join(this.storeDir, 'sessions.json');
  }

  async initialize() {
    try {
      await fs.mkdir(this.storeDir, { recursive: true });
      const raw = await fs.readFile(this.file, 'utf8').catch(() => null);
      if (raw) {
        const arr = JSON.parse(raw);
        arr.forEach(s => this.sessions.set(s.id, s));
      }
    } catch (e) {
      // ignore
    }
  }

  async _save() {
    try {
      const arr = Array.from(this.sessions.values());
      await fs.mkdir(this.storeDir, { recursive: true });
      await fs.writeFile(this.file, JSON.stringify(arr, null, 2), 'utf8');
    } catch (e) {
      // ignore
    }
  }

  async startSession(request = {}, analysis = {}) {
    const id = `sess-${Date.now()}`;
    const session = { id, request, analysis, state: 'IN_PROGRESS', createdAt: Date.now(), history: [] };
    this.sessions.set(id, session);
    await this._save();
    return session;
  }

  async resumeSession(sessionId) {
    return this.sessions.get(sessionId) || { analysis: null };
  }

  async endSession(info = {}) {
    if (!info || !info.state) return;
    const sid = (info.sessionId || (info.convergenceAnalysis && info.convergenceAnalysis.sessionId));
    if (!sid) return;
    const s = this.sessions.get(sid) || { id: sid };
    s.state = info.state;
    s.endedAt = Date.now();
    s.convergenceAnalysis = info.convergenceAnalysis || null;
    s.outcome = info.outcome || null;
    this.sessions.set(sid, s);
    await this._save();
    return s;
  }
}
