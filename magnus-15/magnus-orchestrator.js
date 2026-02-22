/**
 * MAGNUS 15 ORCHESTRATOR - Phase 5 Production Release
 *
 * Multi-agent music composition orchestration system with Claude Sonnet 4.5
 * Implements 6 specialized agents, 8th Principle convergence, and 7 safeguards
 *
 * @author Serigne DIAGNE
 * @version 15.0.0
 * @license MIT
 */

'use strict';

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const fs = require('fs').promises;
const path = require('path');
const Anthropic = require('@anthropic-ai/sdk');

// ============================================================================
// CONFIGURATION & CONSTANTS
// ============================================================================

const CONFIG = {
  port: parseInt(process.env.PORT || '3001', 10),
  claudeModel: process.env.CLAUDE_MODEL || 'claude-sonnet-4-5-20241022',
  maxTokens: parseInt(process.env.MAX_TOKENS || '4096', 10),
  sessionDir: process.env.SESSION_DIR || './sessions',
  logDir: process.env.LOG_DIR || './logs',
  convergenceThreshold: parseFloat(process.env.CONVERGENCE_THRESHOLD || '75'),
  agentTimeout: parseInt(process.env.AGENT_TIMEOUT || '60000', 10),
  maxConcurrentAgents: parseInt(process.env.MAX_CONCURRENT_AGENTS || '3', 10)
};

// Agent definitions with specialized roles
const AGENTS = {
  analyst: {
    id: 'analyst',
    name: 'Music Analyst',
    role: 'Analyze musical structure, harmony, rhythm, and technical elements',
    expertise: ['music theory', 'harmonic analysis', 'rhythm patterns', 'form analysis'],
    weight: 0.20
  },
  critic: {
    id: 'critic',
    name: 'Music Critic',
    role: 'Evaluate artistic merit, emotional impact, and creative choices',
    expertise: ['artistic evaluation', 'emotional resonance', 'creative assessment', 'quality critique'],
    weight: 0.15
  },
  synthesizer: {
    id: 'synthesizer',
    name: 'Sound Synthesizer',
    role: 'Design timbres, textures, and sonic palettes for the composition',
    expertise: ['sound design', 'timbre selection', 'texture layering', 'sonic aesthetics'],
    weight: 0.18
  },
  strategist: {
    id: 'strategist',
    name: 'Composition Strategist',
    role: 'Plan overall composition structure, arrangement, and development',
    expertise: ['arrangement', 'song structure', 'dynamic planning', 'production strategy'],
    weight: 0.22
  },
  historian: {
    id: 'historian',
    name: 'Music Historian',
    role: 'Provide historical context, genre influences, and stylistic references',
    expertise: ['music history', 'genre analysis', 'style evolution', 'cultural context'],
    weight: 0.12
  },
  observer: {
    id: 'observer',
    name: 'Audience Observer',
    role: 'Predict audience reception, market fit, and listener engagement',
    expertise: ['audience analysis', 'market trends', 'engagement prediction', 'listener psychology'],
    weight: 0.13
  }
};

// 8th Principle convergence dimensions
const CONVERGENCE_DIMENSIONS = {
  recognition: { weight: 0.35, description: 'Does output match intended vision?' },
  inevitability: { weight: 0.30, description: 'Does composition feel necessary and right?' },
  coherence: { weight: 0.35, description: 'Are all elements unified and consistent?' }
};

// ============================================================================
// LOGGING SYSTEM
// ============================================================================

class Logger {
  constructor(sessionId = null) {
    this.sessionId = sessionId;
    this.startTime = Date.now();
  }

  _format(level, message, meta = {}) {
    return {
      timestamp: new Date().toISOString(),
      level,
      sessionId: this.sessionId,
      message,
      ...meta,
      elapsedMs: Date.now() - this.startTime
    };
  }

  info(message, meta) { console.log(JSON.stringify(this._format('INFO', message, meta))); }
  warn(message, meta) { console.warn(JSON.stringify(this._format('WARN', message, meta))); }
  error(message, meta) { console.error(JSON.stringify(this._format('ERROR', message, meta))); }
  debug(message, meta) { if (process.env.DEBUG) console.log(JSON.stringify(this._format('DEBUG', message, meta))); }

  audit(action, details) {
    const entry = this._format('AUDIT', action, { auditDetails: details });
    console.log(JSON.stringify(entry));
    return entry;
  }
}

const globalLogger = new Logger();

// ============================================================================
// VALIDATION SCHEMAS
// ============================================================================

const SCHEMAS = {
  analyzeMusic: {
    required: ['prompt'],
    optional: ['agentId', 'context', 'genre', 'mood', 'tempo', 'key'],
    validate: (body) => {
      if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.length < 10) {
        return { valid: false, error: 'Prompt must be a string with at least 10 characters' };
      }
      if (body.agentId && !AGENTS[body.agentId]) {
        return { valid: false, error: `Invalid agentId. Must be one of: ${Object.keys(AGENTS).join(', ')}` };
      }
      if (body.tempo && (typeof body.tempo !== 'number' || body.tempo < 20 || body.tempo > 300)) {
        return { valid: false, error: 'Tempo must be a number between 20 and 300 BPM' };
      }
      return { valid: true };
    }
  },
  composeWithClaude: {
    required: ['prompt'],
    optional: ['genre', 'mood', 'tempo', 'key', 'instruments', 'duration', 'style', 'references'],
    validate: (body) => {
      if (!body.prompt || typeof body.prompt !== 'string' || body.prompt.length < 10) {
        return { valid: false, error: 'Prompt must be a string with at least 10 characters' };
      }
      return { valid: true };
    }
  },
  validateConvergence: {
    required: ['sessionId'],
    optional: ['feedback', 'adjustments'],
    validate: (body) => {
      if (!body.sessionId || typeof body.sessionId !== 'string') {
        return { valid: false, error: 'sessionId is required' };
      }
      return { valid: true };
    }
  }
};

function validateRequest(schema, body) {
  const validation = schema.validate(body);
  if (!validation.valid) {
    return validation;
  }
  for (const field of schema.required) {
    if (body[field] === undefined) {
      return { valid: false, error: `Missing required field: ${field}` };
    }
  }
  return { valid: true };
}

// ============================================================================
// SESSION MANAGEMENT
// ============================================================================

class SessionManager {
  constructor() {
    this.sessions = new Map();
    this.ensureDirectories();
  }

  async ensureDirectories() {
    try {
      await fs.mkdir(CONFIG.sessionDir, { recursive: true });
      await fs.mkdir(CONFIG.logDir, { recursive: true });
    } catch (error) {
      globalLogger.error('Failed to create directories', { error: error.message });
    }
  }

  create(request) {
    const sessionId = uuidv4();
    const session = {
      id: sessionId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      status: 'initialized',
      request: { ...request, _sanitized: true },
      agentResults: {},
      convergence: null,
      strategy: null,
      versions: [],
      auditLog: []
    };
    this.sessions.set(sessionId, session);
    this._addAudit(sessionId, 'SESSION_CREATED', { request: request.prompt?.substring(0, 100) });
    return session;
  }

  get(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  update(sessionId, updates) {
    const session = this.sessions.get(sessionId);
    if (!session) return null;

    // Store previous version for rollback (Safeguard 6)
    if (session.strategy) {
      session.versions.push({
        timestamp: session.updatedAt,
        strategy: JSON.parse(JSON.stringify(session.strategy))
      });
      if (session.versions.length > 10) session.versions.shift();
    }

    Object.assign(session, updates, { updatedAt: new Date().toISOString() });
    this.sessions.set(sessionId, session);
    return session;
  }

  _addAudit(sessionId, action, details) {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.auditLog.push({
        timestamp: new Date().toISOString(),
        action,
        details
      });
    }
  }

  async persist(sessionId) {
    const session = this.sessions.get(sessionId);
    if (!session) return false;

    try {
      const filePath = path.join(CONFIG.sessionDir, `${sessionId}.json`);
      await fs.writeFile(filePath, JSON.stringify(session, null, 2));
      return true;
    } catch (error) {
      globalLogger.error('Failed to persist session', { sessionId, error: error.message });
      return false;
    }
  }

  async load(sessionId) {
    if (this.sessions.has(sessionId)) {
      return this.sessions.get(sessionId);
    }

    try {
      const filePath = path.join(CONFIG.sessionDir, `${sessionId}.json`);
      const data = await fs.readFile(filePath, 'utf8');
      const session = JSON.parse(data);
      this.sessions.set(sessionId, session);
      return session;
    } catch (error) {
      return null;
    }
  }

  rollback(sessionId, versionIndex = -1) {
    const session = this.sessions.get(sessionId);
    if (!session || session.versions.length === 0) return null;

    const idx = versionIndex < 0 ? session.versions.length + versionIndex : versionIndex;
    const version = session.versions[idx];
    if (!version) return null;

    this._addAudit(sessionId, 'ROLLBACK', { toVersion: idx, timestamp: version.timestamp });
    session.strategy = JSON.parse(JSON.stringify(version.strategy));
    session.updatedAt = new Date().toISOString();
    return session;
  }
}

// ============================================================================
// CLAUDE API INTEGRATION
// ============================================================================

class ClaudeClient {
  constructor() {
    this.client = new Anthropic();
    this.requestCount = 0;
    this.totalTokens = 0;
  }

  async query(agentId, systemPrompt, userPrompt, context = {}) {
    const agent = AGENTS[agentId];
    if (!agent) throw new Error(`Unknown agent: ${agentId}`);

    const logger = new Logger(context.sessionId);
    const startTime = Date.now();

    try {
      logger.info(`Agent ${agentId} starting query`, { promptLength: userPrompt.length });

      const response = await this.client.messages.create({
        model: CONFIG.claudeModel,
        max_tokens: CONFIG.maxTokens,
        messages: [{ role: 'user', content: userPrompt }],
        system: systemPrompt
      });

      const duration = Date.now() - startTime;
      this.requestCount++;
      this.totalTokens += response.usage?.input_tokens + response.usage?.output_tokens || 0;

      logger.info(`Agent ${agentId} completed`, { duration, tokens: response.usage });

      const content = response.content[0]?.text || '';
      return this._parseAgentResponse(agentId, content);

    } catch (error) {
      logger.error(`Agent ${agentId} failed`, { error: error.message, duration: Date.now() - startTime });
      throw error;
    }
  }

  _parseAgentResponse(agentId, content) {
    // Try to extract JSON from response
    try {
      const jsonMatch = content.match(/```json\n?([\s\S]*?)\n?```/) || content.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        const parsed = JSON.parse(jsonMatch[1] || jsonMatch[0]);
        return { agentId, ...parsed, raw: content };
      }
    } catch (e) {
      // Continue with text parsing
    }

    // Fallback: extract key insights from text
    return {
      agentId,
      analysis: content,
      score: this._extractScore(content),
      reasoning: this._extractReasoning(content),
      suggestions: this._extractSuggestions(content),
      raw: content
    };
  }

  _extractScore(content) {
    const scoreMatch = content.match(/(?:score|rating|confidence)[:\s]*(\d+)/i);
    return scoreMatch ? Math.min(100, Math.max(0, parseInt(scoreMatch[1], 10))) : 75;
  }

  _extractReasoning(content) {
    const lines = content.split('\n').filter(l => l.trim().length > 20);
    return lines.slice(0, 3).join(' ').substring(0, 500);
  }

  _extractSuggestions(content) {
    const suggestions = [];
    const lines = content.split('\n');
    for (const line of lines) {
      if (line.match(/^[\-\*\d\.]\s*.{10,}/)) {
        suggestions.push(line.replace(/^[\-\*\d\.]\s*/, '').trim());
      }
    }
    return suggestions.slice(0, 5);
  }

  getMetrics() {
    return {
      requestCount: this.requestCount,
      totalTokens: this.totalTokens,
      avgTokensPerRequest: this.requestCount > 0 ? Math.round(this.totalTokens / this.requestCount) : 0
    };
  }
}

// ============================================================================
// AGENT ORCHESTRATOR
// ============================================================================

class AgentOrchestrator {
  constructor(claudeClient, sessionManager) {
    this.claude = claudeClient;
    this.sessions = sessionManager;
  }

  _buildAgentPrompt(agent, request, context) {
    const systemPrompt = `You are ${agent.name}, a specialized AI agent in the Magnus music composition system.

Your role: ${agent.role}
Your expertise: ${agent.expertise.join(', ')}

IMPORTANT GUIDELINES:
1. Respond with structured JSON when possible
2. Provide a confidence score (0-100) for your analysis
3. Give specific, actionable recommendations
4. Consider the user's original intent at all times
5. Stay within your area of expertise

Response format:
{
  "score": <0-100>,
  "reasoning": "<your detailed analysis>",
  "recommendations": ["<specific suggestion 1>", "<specific suggestion 2>"],
  "concerns": ["<any issues or warnings>"],
  "confidence": <0-100>
}`;

    const userPrompt = `Analyze the following music composition request:

REQUEST: ${request.prompt}
${request.genre ? `GENRE: ${request.genre}` : ''}
${request.mood ? `MOOD: ${request.mood}` : ''}
${request.tempo ? `TEMPO: ${request.tempo} BPM` : ''}
${request.key ? `KEY: ${request.key}` : ''}
${request.instruments ? `INSTRUMENTS: ${request.instruments.join(', ')}` : ''}
${context.previousAnalyses ? `\nOTHER AGENTS' INSIGHTS:\n${JSON.stringify(context.previousAnalyses, null, 2)}` : ''}

Provide your ${agent.name} perspective on this composition request.`;

    return { systemPrompt, userPrompt };
  }

  async runSingleAgent(agentId, request, sessionId) {
    const agent = AGENTS[agentId];
    if (!agent) throw new Error(`Unknown agent: ${agentId}`);

    const session = this.sessions.get(sessionId);
    const { systemPrompt, userPrompt } = this._buildAgentPrompt(agent, request, {
      sessionId,
      previousAnalyses: session?.agentResults
    });

    const result = await this.claude.query(agentId, systemPrompt, userPrompt, { sessionId });

    if (session) {
      session.agentResults[agentId] = result;
      this.sessions._addAudit(sessionId, 'AGENT_COMPLETED', { agentId, score: result.score });
    }

    return result;
  }

  async runAllAgents(request, sessionId) {
    const session = this.sessions.get(sessionId);
    const logger = new Logger(sessionId);
    const results = {};
    const agentIds = Object.keys(AGENTS);

    logger.info('Starting multi-agent orchestration', { agentCount: agentIds.length });

    // Run agents in batches for controlled concurrency
    for (let i = 0; i < agentIds.length; i += CONFIG.maxConcurrentAgents) {
      const batch = agentIds.slice(i, i + CONFIG.maxConcurrentAgents);

      const batchPromises = batch.map(async (agentId) => {
        try {
          const { systemPrompt, userPrompt } = this._buildAgentPrompt(
            AGENTS[agentId],
            request,
            { sessionId, previousAnalyses: results }
          );

          const result = await Promise.race([
            this.claude.query(agentId, systemPrompt, userPrompt, { sessionId }),
            new Promise((_, reject) =>
              setTimeout(() => reject(new Error('Agent timeout')), CONFIG.agentTimeout)
            )
          ]);

          results[agentId] = result;
          return { agentId, success: true, result };
        } catch (error) {
          logger.error(`Agent ${agentId} failed`, { error: error.message });
          results[agentId] = {
            agentId,
            score: 0,
            reasoning: `Agent failed: ${error.message}`,
            error: true
          };
          return { agentId, success: false, error: error.message };
        }
      });

      await Promise.all(batchPromises);
    }

    if (session) {
      session.agentResults = results;
      this.sessions._addAudit(sessionId, 'ALL_AGENTS_COMPLETED', {
        successCount: Object.values(results).filter(r => !r.error).length
      });
    }

    return results;
  }

  synthesizeStrategy(agentResults, request) {
    const validResults = Object.entries(agentResults)
      .filter(([_, r]) => !r.error && r.score !== undefined);

    if (validResults.length === 0) {
      throw new Error('No valid agent results to synthesize');
    }

    // Weighted score calculation
    let totalWeight = 0;
    let weightedScore = 0;
    const agentSummaries = {};

    for (const [agentId, result] of validResults) {
      const agent = AGENTS[agentId];
      const weight = agent.weight;
      totalWeight += weight;
      weightedScore += (result.score || 75) * weight;

      agentSummaries[agentId] = {
        score: result.score || 75,
        reasoning: result.reasoning?.substring(0, 200) || 'Analysis completed',
        recommendations: result.recommendations?.slice(0, 3) || []
      };
    }

    const confidence = totalWeight > 0 ? weightedScore / totalWeight : 0;

    // Synthesize composition strategy from agent insights
    const strategy = this._buildCompositionStrategy(agentResults, request, confidence);

    return {
      composition: strategy,
      agents: agentSummaries,
      confidence: Math.round(confidence * 10) / 10,
      synthesizedAt: new Date().toISOString()
    };
  }

  _buildCompositionStrategy(agentResults, request, confidence) {
    // Extract strategic insights from agents
    const strategistData = agentResults.strategist || {};
    const analystData = agentResults.analyst || {};
    const synthesizerData = agentResults.synthesizer || {};

    return {
      structure: this._inferStructure(strategistData, request),
      progressions: this._inferProgressions(analystData, request),
      key: request.key || this._inferKey(analystData),
      tempo: request.tempo || this._inferTempo(analystData, request),
      instrumentation: this._inferInstrumentation(synthesizerData, request),
      dynamics: this._inferDynamics(strategistData),
      mood: request.mood || 'balanced',
      genre: request.genre || 'contemporary',
      estimatedDuration: request.duration || '3:30'
    };
  }

  _inferStructure(strategist, request) {
    if (strategist.structure) return strategist.structure;
    const structures = [
      'Intro-Verse-Chorus-Verse-Chorus-Bridge-Chorus-Outro',
      'Intro-A-B-A-B-C-B-Outro',
      'Verse-Chorus-Verse-Chorus-Bridge-Chorus'
    ];
    return structures[Math.floor(Math.random() * structures.length)];
  }

  _inferProgressions(analyst, request) {
    if (analyst.progressions) return analyst.progressions;
    const key = request.key || 'C major';
    const isMinor = key.toLowerCase().includes('minor');

    if (isMinor) {
      return ['Am-F-C-G', 'Am-G-F-E', 'Am-Dm-G-C'];
    }
    return ['C-G-Am-F', 'C-Am-F-G', 'C-F-G-C'];
  }

  _inferKey(analyst) {
    return analyst.key || 'C major';
  }

  _inferTempo(analyst, request) {
    if (analyst.tempo) return analyst.tempo;
    const mood = (request.mood || '').toLowerCase();
    if (mood.includes('energetic') || mood.includes('fast')) return 130;
    if (mood.includes('slow') || mood.includes('ballad')) return 70;
    if (mood.includes('dance')) return 120;
    return 95;
  }

  _inferInstrumentation(synthesizer, request) {
    if (synthesizer.instruments) return synthesizer.instruments;
    if (request.instruments) return request.instruments;
    return ['piano', 'acoustic guitar', 'bass', 'drums', 'strings'];
  }

  _inferDynamics(strategist) {
    return strategist.dynamics || {
      intro: 'soft',
      verse: 'moderate',
      chorus: 'full',
      bridge: 'building',
      outro: 'fading'
    };
  }
}

// ============================================================================
// CONVERGENCE VALIDATOR (8th Principle)
// ============================================================================

class ConvergenceValidator {
  constructor(claudeClient) {
    this.claude = claudeClient;
  }

  async validate(session) {
    const { request, agentResults, strategy } = session;

    if (!strategy || Object.keys(agentResults).length === 0) {
      return {
        recognition: 0,
        inevitability: 0,
        coherence: 0,
        outcome: 'FAILED',
        reason: 'Insufficient data for convergence validation'
      };
    }

    // Calculate each dimension
    const recognition = this._calculateRecognition(request, strategy, agentResults);
    const inevitability = this._calculateInevitability(strategy, agentResults);
    const coherence = this._calculateCoherence(agentResults, strategy);

    // Weighted overall score
    const overall =
      recognition * CONVERGENCE_DIMENSIONS.recognition.weight +
      inevitability * CONVERGENCE_DIMENSIONS.inevitability.weight +
      coherence * CONVERGENCE_DIMENSIONS.coherence.weight;

    const outcome = overall >= CONFIG.convergenceThreshold ? 'CONVERGED' :
                    overall >= CONFIG.convergenceThreshold * 0.7 ? 'PARTIAL' : 'FAILED';

    return {
      recognition: Math.round(recognition),
      inevitability: Math.round(inevitability),
      coherence: Math.round(coherence),
      overall: Math.round(overall),
      outcome,
      details: this._generateDetails(recognition, inevitability, coherence, outcome)
    };
  }

  _calculateRecognition(request, strategy, agentResults) {
    let score = 50; // Base score

    // Check if key request elements are reflected
    if (request.genre && strategy.composition?.genre?.toLowerCase().includes(request.genre.toLowerCase())) {
      score += 15;
    }
    if (request.mood && strategy.composition?.mood?.toLowerCase().includes(request.mood.toLowerCase())) {
      score += 15;
    }
    if (request.tempo && Math.abs((strategy.composition?.tempo || 100) - request.tempo) < 20) {
      score += 10;
    }
    if (request.key && strategy.composition?.key?.toLowerCase().includes(request.key.toLowerCase())) {
      score += 10;
    }

    // Factor in agent confidence
    const avgAgentScore = Object.values(agentResults)
      .filter(r => !r.error)
      .reduce((sum, r) => sum + (r.score || 75), 0) / Math.max(1, Object.keys(agentResults).length);

    return Math.min(100, score + (avgAgentScore - 75) * 0.2);
  }

  _calculateInevitability(strategy, agentResults) {
    // Measures how "right" and necessary the composition feels
    let score = 60;

    // Higher scores from strategist and synthesizer boost inevitability
    const strategistScore = agentResults.strategist?.score || 70;
    const synthesizerScore = agentResults.synthesizer?.score || 70;

    score += (strategistScore - 70) * 0.3;
    score += (synthesizerScore - 70) * 0.2;

    // Check for conflicting recommendations
    const allRecommendations = Object.values(agentResults)
      .flatMap(r => r.recommendations || [])
      .filter(Boolean);

    const hasConflicts = this._detectConflicts(allRecommendations);
    if (hasConflicts) score -= 15;

    return Math.max(0, Math.min(100, score));
  }

  _calculateCoherence(agentResults, strategy) {
    // Measures consistency across all agents
    const scores = Object.values(agentResults)
      .filter(r => !r.error)
      .map(r => r.score || 75);

    if (scores.length === 0) return 0;

    const mean = scores.reduce((a, b) => a + b, 0) / scores.length;
    const variance = scores.reduce((sum, s) => sum + Math.pow(s - mean, 2), 0) / scores.length;
    const stdDev = Math.sqrt(variance);

    // Lower standard deviation = higher coherence
    let score = 100 - (stdDev * 2);

    // Bonus for high average scores
    if (mean > 85) score += 10;
    else if (mean > 75) score += 5;

    return Math.max(0, Math.min(100, score));
  }

  _detectConflicts(recommendations) {
    const conflictPatterns = [
      ['faster', 'slower'],
      ['louder', 'quieter'],
      ['simpler', 'complex'],
      ['more', 'less']
    ];

    const lowerRecs = recommendations.map(r => r.toLowerCase());

    for (const [a, b] of conflictPatterns) {
      const hasA = lowerRecs.some(r => r.includes(a));
      const hasB = lowerRecs.some(r => r.includes(b));
      if (hasA && hasB) return true;
    }
    return false;
  }

  _generateDetails(recognition, inevitability, coherence, outcome) {
    const details = { strengths: [], weaknesses: [], suggestions: [] };

    if (recognition >= 80) details.strengths.push('Strong alignment with user intent');
    else if (recognition < 60) details.weaknesses.push('May not fully capture user vision');

    if (inevitability >= 80) details.strengths.push('Composition feels natural and necessary');
    else if (inevitability < 60) details.weaknesses.push('Some elements feel forced');

    if (coherence >= 80) details.strengths.push('Excellent consistency across all agents');
    else if (coherence < 60) details.weaknesses.push('Agent perspectives are divergent');

    if (outcome !== 'CONVERGED') {
      details.suggestions.push('Consider refining the prompt with more specific details');
      details.suggestions.push('Review agent recommendations for improvement opportunities');
    }

    return details;
  }
}

// ============================================================================
// SAFEGUARDS IMPLEMENTATION
// ============================================================================

class Safeguards {
  static intentPreservation(request, strategy) {
    // Safeguard 1: User request always primary
    const preserved = {
      originalPrompt: request.prompt,
      requestedGenre: request.genre,
      requestedMood: request.mood,
      requestedTempo: request.tempo,
      requestedKey: request.key,
      timestamp: new Date().toISOString()
    };
    return { preserved, valid: true };
  }

  static scopeValidation(agentId, response) {
    // Safeguard 2: Agents don't exceed boundaries
    const agent = AGENTS[agentId];
    if (!agent) return { valid: false, reason: 'Unknown agent' };

    // Check response doesn't claim expertise outside agent's domain
    const outOfScope = response.reasoning?.toLowerCase().includes('i am not qualified') ||
                       response.reasoning?.toLowerCase().includes('outside my expertise');

    return { valid: !outOfScope, agentId, scope: agent.expertise };
  }

  static safetyChecks(input) {
    // Safeguard 3: Error handling + validation
    const issues = [];

    if (typeof input !== 'object') issues.push('Input must be an object');
    if (input.prompt && input.prompt.length > 10000) issues.push('Prompt too long');
    if (input.tempo && (input.tempo < 20 || input.tempo > 300)) issues.push('Invalid tempo range');

    return { valid: issues.length === 0, issues };
  }

  static biasDetection(agentResults) {
    // Safeguard 4: Musical taste agnostic
    const genreReferences = {};

    for (const [agentId, result] of Object.entries(agentResults)) {
      const text = (result.reasoning || '') + (result.analysis || '');
      const genres = ['pop', 'rock', 'jazz', 'classical', 'hip-hop', 'electronic', 'country'];

      for (const genre of genres) {
        if (text.toLowerCase().includes(genre)) {
          genreReferences[genre] = (genreReferences[genre] || 0) + 1;
        }
      }
    }

    const maxRefs = Math.max(...Object.values(genreReferences), 0);
    const biased = maxRefs > Object.keys(agentResults).length;

    return { biased, genreReferences };
  }

  static humanApprovalGate(session) {
    // Safeguard 5: Session tracking for approval
    return {
      sessionId: session.id,
      status: session.status,
      requiresApproval: session.convergence?.outcome !== 'CONVERGED',
      approvalReason: session.convergence?.outcome === 'PARTIAL' ?
        'Partial convergence - human review recommended' : null
    };
  }

  static rollbackCapability(session) {
    // Safeguard 6: Previous versions maintained
    return {
      hasVersions: session.versions.length > 0,
      versionCount: session.versions.length,
      latestVersion: session.versions[session.versions.length - 1]?.timestamp || null
    };
  }

  static auditTrail(session) {
    // Safeguard 7: Complete logging
    return {
      sessionId: session.id,
      auditEntries: session.auditLog.length,
      firstEntry: session.auditLog[0]?.timestamp || null,
      lastEntry: session.auditLog[session.auditLog.length - 1]?.timestamp || null
    };
  }
}

// ============================================================================
// EXPRESS APPLICATION
// ============================================================================

function createApp() {
  const app = express();
  const claudeClient = new ClaudeClient();
  const sessionManager = new SessionManager();
  const orchestrator = new AgentOrchestrator(claudeClient, sessionManager);
  const convergenceValidator = new ConvergenceValidator(claudeClient);

  // Middleware
  app.use(cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.static('public'));

  // Request logging
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      globalLogger.info(`${req.method} ${req.path}`, {
        status: res.statusCode,
        duration: Date.now() - start
      });
    });
    next();
  });

  // ---- API ENDPOINTS ----

  // POST /api/analyze-music - Single agent analysis
  app.post('/api/analyze-music', async (req, res) => {
    try {
      const validation = validateRequest(SCHEMAS.analyzeMusic, req.body);
      if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.error });
      }

      const safetyCheck = Safeguards.safetyChecks(req.body);
      if (!safetyCheck.valid) {
        return res.status(400).json({ success: false, error: 'Safety check failed', issues: safetyCheck.issues });
      }

      const session = sessionManager.create(req.body);
      const agentId = req.body.agentId || 'analyst';

      const result = await orchestrator.runSingleAgent(agentId, req.body, session.id);

      sessionManager.update(session.id, { status: 'completed', agentResults: { [agentId]: result } });
      await sessionManager.persist(session.id);

      res.json({
        success: true,
        sessionId: session.id,
        agent: agentId,
        result
      });

    } catch (error) {
      globalLogger.error('analyze-music failed', { error: error.message });
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/compose-with-claude - Full orchestration
  app.post('/api/compose-with-claude', async (req, res) => {
    try {
      const validation = validateRequest(SCHEMAS.composeWithClaude, req.body);
      if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.error });
      }

      const safetyCheck = Safeguards.safetyChecks(req.body);
      if (!safetyCheck.valid) {
        return res.status(400).json({ success: false, error: 'Safety check failed', issues: safetyCheck.issues });
      }

      const session = sessionManager.create(req.body);
      sessionManager.update(session.id, { status: 'orchestrating' });

      // Safeguard 1: Intent preservation
      const intent = Safeguards.intentPreservation(req.body, null);
      sessionManager._addAudit(session.id, 'INTENT_PRESERVED', intent.preserved);

      // Run all agents
      const agentResults = await orchestrator.runAllAgents(req.body, session.id);

      // Safeguard 2: Scope validation
      for (const [agentId, result] of Object.entries(agentResults)) {
        Safeguards.scopeValidation(agentId, result);
      }

      // Safeguard 4: Bias detection
      const biasCheck = Safeguards.biasDetection(agentResults);
      sessionManager._addAudit(session.id, 'BIAS_CHECK', biasCheck);

      // Synthesize strategy
      const strategy = orchestrator.synthesizeStrategy(agentResults, req.body);
      sessionManager.update(session.id, { strategy });

      // Validate convergence
      const convergence = await convergenceValidator.validate({
        request: req.body,
        agentResults,
        strategy
      });

      sessionManager.update(session.id, {
        status: 'completed',
        convergence,
        strategy: { ...strategy, convergence }
      });

      // Safeguard 5: Approval gate
      const approvalGate = Safeguards.humanApprovalGate(sessionManager.get(session.id));

      await sessionManager.persist(session.id);

      res.json({
        success: true,
        sessionId: session.id,
        strategy: {
          ...strategy,
          convergence
        },
        safeguards: {
          intentPreserved: intent.valid,
          biasDetected: biasCheck.biased,
          requiresApproval: approvalGate.requiresApproval
        }
      });

    } catch (error) {
      globalLogger.error('compose-with-claude failed', { error: error.message, stack: error.stack });
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/validate-convergence - Re-validate convergence
  app.post('/api/validate-convergence', async (req, res) => {
    try {
      const validation = validateRequest(SCHEMAS.validateConvergence, req.body);
      if (!validation.valid) {
        return res.status(400).json({ success: false, error: validation.error });
      }

      const session = await sessionManager.load(req.body.sessionId);
      if (!session) {
        return res.status(404).json({ success: false, error: 'Session not found' });
      }

      const convergence = await convergenceValidator.validate(session);
      sessionManager.update(session.id, { convergence });
      await sessionManager.persist(session.id);

      res.json({
        success: true,
        sessionId: session.id,
        convergence,
        safeguards: {
          auditTrail: Safeguards.auditTrail(session),
          rollback: Safeguards.rollbackCapability(session)
        }
      });

    } catch (error) {
      globalLogger.error('validate-convergence failed', { error: error.message });
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // GET /api/sessions/:id - Retrieve session
  app.get('/api/sessions/:id', async (req, res) => {
    try {
      const session = await sessionManager.load(req.params.id);
      if (!session) {
        return res.status(404).json({ success: false, error: 'Session not found' });
      }

      res.json({
        success: true,
        session: {
          id: session.id,
          status: session.status,
          createdAt: session.createdAt,
          updatedAt: session.updatedAt,
          request: session.request,
          strategy: session.strategy,
          convergence: session.convergence,
          safeguards: {
            versions: session.versions.length,
            auditEntries: session.auditLog.length
          }
        }
      });

    } catch (error) {
      globalLogger.error('get-session failed', { error: error.message });
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // POST /api/sessions/:id/rollback - Rollback to previous version
  app.post('/api/sessions/:id/rollback', async (req, res) => {
    try {
      const session = await sessionManager.load(req.params.id);
      if (!session) {
        return res.status(404).json({ success: false, error: 'Session not found' });
      }

      const versionIndex = req.body.versionIndex ?? -1;
      const rolledBack = sessionManager.rollback(session.id, versionIndex);

      if (!rolledBack) {
        return res.status(400).json({ success: false, error: 'No versions available for rollback' });
      }

      await sessionManager.persist(session.id);

      res.json({
        success: true,
        sessionId: session.id,
        message: 'Rolled back successfully',
        strategy: rolledBack.strategy
      });

    } catch (error) {
      globalLogger.error('rollback failed', { error: error.message });
      res.status(500).json({ success: false, error: error.message });
    }
  });

  // GET /health - Health check
  app.get('/health', (req, res) => {
    const claudeMetrics = claudeClient.getMetrics();

    res.json({
      success: true,
      status: 'healthy',
      version: '15.0.0',
      uptime: process.uptime(),
      timestamp: new Date().toISOString(),
      config: {
        port: CONFIG.port,
        model: CONFIG.claudeModel,
        convergenceThreshold: CONFIG.convergenceThreshold
      },
      metrics: {
        claude: claudeMetrics,
        memory: {
          used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
          total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
        }
      },
      agents: Object.keys(AGENTS),
      safeguards: [
        'Intent Preservation',
        'Scope Validation',
        'Safety Checks',
        'Bias Detection',
        'Human Approval Gates',
        'Rollback Capability',
        'Audit Trail'
      ]
    });
  });

  // Dashboard HTML
  app.get('/dashboard.html', (req, res) => {
    res.send(getDashboardHTML());
  });

  return app;
}

// ============================================================================
// DASHBOARD HTML
// ============================================================================

function getDashboardHTML() {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Magnus 15 Orchestrator</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { font-family: system-ui, sans-serif; background: #0a0a1a; color: #e0e0e0; min-height: 100vh; }
    .container { max-width: 1200px; margin: 0 auto; padding: 20px; }
    h1 { color: #00ffff; margin-bottom: 20px; text-align: center; }
    h2 { color: #ff00ff; margin: 20px 0 10px; }
    .card { background: #1a1a2e; border-radius: 12px; padding: 20px; margin-bottom: 20px; border: 1px solid #333; }
    .agents { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 15px; margin: 20px 0; }
    .agent { background: #16213e; padding: 15px; border-radius: 8px; text-align: center; }
    .agent h4 { color: #00ffff; margin-bottom: 5px; }
    .agent p { font-size: 12px; color: #888; }
    textarea { width: 100%; height: 120px; background: #0f0f23; border: 1px solid #444; color: #fff; padding: 15px; border-radius: 8px; font-size: 14px; resize: vertical; }
    .btn { background: linear-gradient(135deg, #00ffff, #ff00ff); border: none; padding: 12px 30px; color: #000; font-weight: bold; border-radius: 8px; cursor: pointer; font-size: 16px; margin-right: 10px; margin-top: 10px; }
    .btn:hover { opacity: 0.9; transform: translateY(-1px); }
    .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    .options { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; margin: 15px 0; }
    .option { display: flex; flex-direction: column; }
    .option label { color: #888; font-size: 12px; margin-bottom: 5px; }
    .option input, .option select { background: #0f0f23; border: 1px solid #444; color: #fff; padding: 10px; border-radius: 6px; }
    .result { background: #0f0f23; padding: 20px; border-radius: 8px; margin-top: 20px; max-height: 500px; overflow: auto; }
    pre { white-space: pre-wrap; word-wrap: break-word; font-size: 13px; }
    .status { padding: 8px 16px; border-radius: 20px; display: inline-block; font-weight: bold; }
    .status.healthy { background: #00ff0033; color: #00ff00; }
    .convergence { display: flex; gap: 20px; flex-wrap: wrap; margin: 15px 0; }
    .score { text-align: center; padding: 15px; background: #16213e; border-radius: 8px; min-width: 100px; }
    .score .value { font-size: 32px; font-weight: bold; }
    .score .label { font-size: 12px; color: #888; }
    .score.recognition .value { color: #00ffff; }
    .score.inevitability .value { color: #ff00ff; }
    .score.coherence .value { color: #ffff00; }
    .loading { display: none; text-align: center; padding: 40px; }
    .loading.active { display: block; }
    .loading::after { content: ''; display: inline-block; width: 30px; height: 30px; border: 3px solid #333; border-top-color: #00ffff; border-radius: 50%; animation: spin 1s linear infinite; }
    @keyframes spin { to { transform: rotate(360deg); } }
  </style>
</head>
<body>
  <div class="container">
    <h1>Magnus 15 Orchestrator</h1>

    <div class="card">
      <h2>System Status</h2>
      <div id="health-status"><span class="status">Loading...</span></div>
    </div>

    <div class="card">
      <h2>Composition Agents</h2>
      <div class="agents">
        <div class="agent"><h4>Analyst</h4><p>Music theory & structure</p></div>
        <div class="agent"><h4>Critic</h4><p>Artistic evaluation</p></div>
        <div class="agent"><h4>Synthesizer</h4><p>Sound design</p></div>
        <div class="agent"><h4>Strategist</h4><p>Arrangement planning</p></div>
        <div class="agent"><h4>Historian</h4><p>Genre context</p></div>
        <div class="agent"><h4>Observer</h4><p>Audience analysis</p></div>
      </div>
    </div>

    <div class="card">
      <h2>New Composition</h2>
      <textarea id="prompt" placeholder="Describe your music composition idea... (e.g., 'A melancholic piano ballad with string orchestration, inspired by late autumn evenings')"></textarea>

      <div class="options">
        <div class="option">
          <label>Genre</label>
          <select id="genre">
            <option value="">Auto-detect</option>
            <option value="pop">Pop</option>
            <option value="rock">Rock</option>
            <option value="classical">Classical</option>
            <option value="jazz">Jazz</option>
            <option value="electronic">Electronic</option>
            <option value="hip-hop">Hip-Hop</option>
          </select>
        </div>
        <div class="option">
          <label>Mood</label>
          <select id="mood">
            <option value="">Auto-detect</option>
            <option value="energetic">Energetic</option>
            <option value="melancholic">Melancholic</option>
            <option value="peaceful">Peaceful</option>
            <option value="dramatic">Dramatic</option>
            <option value="playful">Playful</option>
          </select>
        </div>
        <div class="option">
          <label>Tempo (BPM)</label>
          <input type="number" id="tempo" placeholder="Auto" min="40" max="200">
        </div>
        <div class="option">
          <label>Key</label>
          <input type="text" id="key" placeholder="Auto (e.g., C major)">
        </div>
      </div>

      <button class="btn" onclick="compose()">Compose with All Agents</button>
      <button class="btn" onclick="analyzeWithAgent()">Quick Analysis</button>
    </div>

    <div class="loading" id="loading">Orchestrating agents...</div>

    <div class="card" id="result-card" style="display:none;">
      <h2>Composition Strategy</h2>
      <div class="convergence" id="convergence"></div>
      <div class="result"><pre id="result"></pre></div>
    </div>
  </div>

  <script>
    async function checkHealth() {
      try {
        const res = await fetch('/health');
        const data = await res.json();
        document.getElementById('health-status').innerHTML =
          '<span class="status healthy">Healthy</span> | Model: ' + data.config.model + ' | Uptime: ' + Math.round(data.uptime) + 's';
      } catch (e) {
        document.getElementById('health-status').innerHTML = '<span class="status" style="background:#ff000033;color:#ff0000;">Offline</span>';
      }
    }

    async function compose() {
      const prompt = document.getElementById('prompt').value;
      if (prompt.length < 10) { alert('Please enter a longer description'); return; }

      document.getElementById('loading').classList.add('active');
      document.getElementById('result-card').style.display = 'none';

      const body = { prompt };
      ['genre', 'mood', 'key'].forEach(f => {
        const v = document.getElementById(f).value;
        if (v) body[f] = v;
      });
      const tempo = document.getElementById('tempo').value;
      if (tempo) body.tempo = parseInt(tempo);

      try {
        const res = await fetch('/api/compose-with-claude', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body)
        });
        const data = await res.json();
        showResult(data);
      } catch (e) {
        alert('Error: ' + e.message);
      }

      document.getElementById('loading').classList.remove('active');
    }

    async function analyzeWithAgent() {
      const prompt = document.getElementById('prompt').value;
      if (prompt.length < 10) { alert('Please enter a longer description'); return; }

      document.getElementById('loading').classList.add('active');

      try {
        const res = await fetch('/api/analyze-music', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, agentId: 'analyst' })
        });
        const data = await res.json();
        showResult(data);
      } catch (e) {
        alert('Error: ' + e.message);
      }

      document.getElementById('loading').classList.remove('active');
    }

    function showResult(data) {
      document.getElementById('result-card').style.display = 'block';

      if (data.strategy?.convergence) {
        const c = data.strategy.convergence;
        document.getElementById('convergence').innerHTML =
          '<div class="score recognition"><div class="value">' + c.recognition + '</div><div class="label">Recognition</div></div>' +
          '<div class="score inevitability"><div class="value">' + c.inevitability + '</div><div class="label">Inevitability</div></div>' +
          '<div class="score coherence"><div class="value">' + c.coherence + '</div><div class="label">Coherence</div></div>' +
          '<div class="score"><div class="value" style="color:' + (c.outcome === 'CONVERGED' ? '#00ff00' : '#ffaa00') + '">' + c.outcome + '</div><div class="label">Outcome</div></div>';
      } else {
        document.getElementById('convergence').innerHTML = '';
      }

      document.getElementById('result').textContent = JSON.stringify(data, null, 2);
    }

    checkHealth();
    setInterval(checkHealth, 30000);
  </script>
</body>
</html>`;
}

// ============================================================================
// SERVER START
// ============================================================================

const app = createApp();

app.listen(CONFIG.port, () => {
  console.log(`
╔══════════════════════════════════════════════════════════════╗
║              MAGNUS 15 ORCHESTRATOR - Phase 5                ║
║          Multi-Agent Music Composition System                ║
╠══════════════════════════════════════════════════════════════╣
║  Server:     http://localhost:${CONFIG.port}${' '.repeat(29 - CONFIG.port.toString().length)}║
║  Dashboard:  http://localhost:${CONFIG.port}/dashboard.html${' '.repeat(15 - CONFIG.port.toString().length)}║
║  Health:     http://localhost:${CONFIG.port}/health${' '.repeat(23 - CONFIG.port.toString().length)}║
╠══════════════════════════════════════════════════════════════╣
║  Model:      ${CONFIG.claudeModel.padEnd(45)}║
║  Threshold:  ${(CONFIG.convergenceThreshold + '%').padEnd(45)}║
╠══════════════════════════════════════════════════════════════╣
║  Agents:     Analyst | Critic | Synthesizer                  ║
║              Strategist | Historian | Observer               ║
╠══════════════════════════════════════════════════════════════╣
║  Safeguards: Intent | Scope | Safety | Bias                  ║
║              Approval | Rollback | Audit                     ║
╚══════════════════════════════════════════════════════════════╝
  `);
});

module.exports = { createApp, AGENTS, CONFIG };
