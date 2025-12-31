/**
 * Magnus 13.1 Engines - enhanced implementations with lightweight persistence
 * - UnderstandingEngine: extracts intent and computes clarity, caches analyses
 * - ComplexityEngine: estimates complexity using heuristics and caches results
 * - RevelationEngine: improved skeleton generation with JSDoc, error handling, and optional logging
 */

import { promises as fs } from 'fs';
import path from 'path';

export class UnderstandingEngine {
  constructor(options = {}) {
    this.options = options || {};
    this.cacheFile = this.options.cacheFile || path.resolve(process.cwd(), '.magnus', 'analysis_cache.json');
    this._cache = null;
  }

  async _loadCache() {
    if (this._cache) return this._cache;
    try {
      const data = await fs.readFile(this.cacheFile, 'utf8');
      this._cache = JSON.parse(data);
    } catch (e) {
      this._cache = {};
    }
    return this._cache;
  }

  async _saveCache() {
    try {
      await fs.mkdir(path.dirname(this.cacheFile), { recursive: true });
      await fs.writeFile(this.cacheFile, JSON.stringify(this._cache || {}, null, 2), 'utf8');
    } catch (e) {
      // ignore persistence errors
    }
  }

  analyzeRequirements(request = {}) {
    const title = (request.title || '').toString().trim();
    const description = (request.description || '').toString().trim();

    // Clarity heuristics (title heavily weighted)
    let clarity = 0;
    if (title) clarity += 40;
    const descLen = Math.min(2000, description.length);
    clarity += Math.round((descLen / 2000) * 50);
    if (request.examples || request.samples) clarity += 10;
    clarity = Math.max(0, Math.min(100, clarity));

    const intent = this._extractIntent(description || title);

    const analysis = {
      clarityScore: clarity,
      title,
      description,
      intent,
      details: {
        words: (description || '').split(/\s+/).filter(Boolean).length,
        examples: request.examples || null
      }
    };

    // Cache lightweight analysis by title key (background)
    this._loadCache().then(cache => {
      if (title) cache[title] = { analysis, ts: Date.now() };
      this._cache = cache;
      return this._saveCache();
    }).catch(() => {});

    // If clarity low, suggest clarifying questions
    if (clarity < (this.options.minClarity || 50)) {
      analysis.suggestedQuestions = this._suggestClarifyingQuestions(analysis);
    }

    return analysis;
  }

  _extractIntent(text = '') {
    const words = (text || '').toLowerCase().match(/[a-z0-9]+/g) || [];
    const verbs = words.filter(w => ['generate','analyze','synthesize','integrate','visualize','tune','train','transform','predict'].includes(w));
    const nouns = words.filter(w => w.length > 3 && !verbs.includes(w)).slice(0,6);
    const keywords = Array.from(new Set([...verbs, ...nouns])).slice(0,6);
    return { raw: text, keywords, summary: keywords.slice(0,4).join(' ') };
  }

  _suggestClarifyingQuestions(analysis) {
    const q = [];
    if (!analysis.title) q.push('What is the short name for this request?');
    if (!analysis.description || analysis.details.words < 8) q.push('Can you describe the expected behavior in 2-3 sentences?');
    if (!analysis.details.examples) q.push('Do you have an example input/output?');
    return q;
  }
}

export class ComplexityEngine {
  constructor(options = {}) {
    this.options = options || {};
    this.cacheFile = this.options.cacheFile || path.resolve(process.cwd(), '.magnus', 'complexity_cache.json');
    this._cache = null;
  }

  async _loadCache() {
    if (this._cache) return this._cache;
    try {
      const data = await fs.readFile(this.cacheFile, 'utf8');
      this._cache = JSON.parse(data);
    } catch (e) {
      this._cache = {};
    }
    return this._cache;
  }

  async _saveCache() {
    try {
      await fs.mkdir(path.dirname(this.cacheFile), { recursive: true });
      await fs.writeFile(this.cacheFile, JSON.stringify(this._cache || {}, null, 2), 'utf8');
    } catch (e) {
      // ignore
    }
  }

  analyzeComplexity(request = {}) {
    const description = (request.description || '').toString();
    const components = Math.max(1, Math.min(20, Math.ceil(description.split(/[,;:\n]/).length)));
    const integrations = (request.integrations || []).length || 0;
    const externalDeps = request.dependencies || 0;
    const dataMagnitude = request.dataSize || 0; // MB estimate
    return { components, integrations, externalDeps, dataMagnitude };
  }

  calculateOverallComplexity(result = {}) {
    const base = result.components || 1;
    const integrations = result.integrations || 0;
    const deps = result.externalDeps || 0;
    const data = result.dataMagnitude || 0;

    // Weighted score, then normalize to 1-10
    let raw = base * 0.7 + integrations * 0.9 + deps * 0.6 + Math.log10(Math.max(1, data + 1)) * 2;
    let score = Math.min(10, Math.max(1, Math.round(raw)));

    // Schedule cache update in background (non-blocking)
    const key = JSON.stringify(result);
    this._loadCache().then(cache => {
      cache[key] = { score, detail: result, ts: Date.now() };
      this._cache = cache;
      this._saveCache();
    }).catch(() => {});

    return { overall: { score, detail: result } };
  }
}

export class RevelationEngine {
  constructor(opts = {}) { this.opts = opts || {}; }

  generateCodeSkeleton(analysis = {}, strategy = { name: 'SINGLE_PASS_REVELATION' }) {
    const title = (analysis.title || 'GeneratedModule').replace(/[^a-zA-Z0-9]/g,'');
    const className = this._pascalize(title).slice(0,40) || 'Module';
    const header = `/**\n * Auto-generated by Magnus RevelationEngine\n * Intent: ${analysis.intent ? analysis.intent.summary : ''}\n * Strategy: ${strategy && strategy.name ? strategy.name : 'DEFAULT'}\n */\n`;
    const body = `class ${className} {\n  /**\n   * Create instance\n   * @param {Object} opts\n   */\n  constructor(opts = {}) {\n    this.opts = opts;\n  }\n\n  /** Start processing */\n  async start() {\n    try {\n      this._log && this._log('started');\n      return true;\n    } catch (err) {\n      console.error('Error in start', err);\n      throw err;\n    }\n  }\n\n  _log(msg) { console.log('[${className}]', msg); }\n}\n\nexport default ${className};\n`;
    return header + body;
  }

  _pascalize(s = '') { return s.replace(/(^|\s|_|-)([a-zA-Z0-9])/g, (_,a,b) => b.toUpperCase()) || 'Module'; }
}
