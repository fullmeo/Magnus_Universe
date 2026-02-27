// ============================================================================
// MAGNUS DASHBOARD v2.0 - BACKEND SERVER
// Implements all recommendations from Magnus 13 Improvements Audit
// ============================================================================

import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import { MagnusClaudeAPIWrapper, MagnusMCPIntegrations } from './magnus-claude-api-wrapper.js';
import { SacredGeometryPatternLibrary } from './sacred-geometry-pattern-library.js';

class MagnusDashboardServer {
  constructor(config = {}) {
    this.config = {
      port: config.port || 3000,
      host: config.host || 'localhost',
      storageDir: config.storageDir || './.magnus',
      enableLearning: config.enableLearning !== false,
      ...config
    };

    this.app = express();
    this.metrics = new Map();
    this.risks = new Map();
    this.learnings = new Map();
    this.decisions = new Map();
    this.estimations = new Map();

    // Initialize advanced Claude tools
    this.claudeAPI = new MagnusClaudeAPIWrapper({
      apiKey: process.env.CLAUDE_API_KEY
    });
    this.mcpIntegrations = new MagnusMCPIntegrations(this.claudeAPI);
    this.patternLibrary = new SacredGeometryPatternLibrary();

    this.setupMiddleware();
    this.setupRoutes();
  }

  // =========================================================================
  // MIDDLEWARE SETUP
  // =========================================================================

  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.static('public'));

    // CORS
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type');
      next();
    });

    // Request logging
    this.app.use((req, res, next) => {
      console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
      next();
    });
  }

  // =========================================================================
  // ROUTES SETUP
  // =========================================================================

  setupRoutes() {
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({
        status: 'healthy',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage()
      });
    });

    // ============= METRICS ENDPOINTS =============

    // Get all metrics
    this.app.get('/api/metrics', (req, res) => {
      const projectId = req.query.project;
      
      if (projectId) {
        return res.json(this.metrics.get(projectId) || null);
      }

      const allMetrics = {};
      this.metrics.forEach((metrics, projectId) => {
        allMetrics[projectId] = metrics;
      });
      res.json(allMetrics);
    });

    // Record metric
    this.app.post('/api/metrics/:projectId', (req, res) => {
      const { projectId } = req.params;
      const metric = req.body;

      try {
        if (!this.metrics.has(projectId)) {
          this.metrics.set(projectId, {
            projectId,
            metrics: {},
            history: [],
            lastUpdated: new Date().toISOString()
          });
        }

        const projectMetrics = this.metrics.get(projectId);
        const timestamp = new Date().toISOString();

        // Store historical data
        projectMetrics.history.push({
          ...metric,
          timestamp
        });

        // Update current metrics
        Object.assign(projectMetrics.metrics, metric);
        projectMetrics.lastUpdated = timestamp;

        // Evaluate against targets
        const evaluation = this.evaluateMetrics(projectId, metric);

        res.json({
          success: true,
          projectId,
          evaluation
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get metric history
    this.app.get('/api/metrics/:projectId/history', (req, res) => {
      const { projectId } = req.params;
      const metrics = this.metrics.get(projectId);

      if (!metrics) {
        return res.json({ history: [] });
      }

      res.json({
        projectId,
        history: metrics.history
      });
    });

    // ============= RISK TRACKING ENDPOINTS =============

    // Get risks
    this.app.get('/api/risks/:projectId', (req, res) => {
      const { projectId } = req.params;
      const risks = this.risks.get(projectId) || [];

      // Calculate risk velocity
      const materialized = risks.filter(r => r.materialized).length;
      const mitigated = risks.filter(r => r.status === 'mitigated').length;
      const velocity = (materialized / risks.length) * 100;

      res.json({
        projectId,
        risks,
        analytics: {
          total: risks.length,
          materialized,
          mitigated,
          riskVelocity: velocity.toFixed(1) + '%',
          avgDaysTracked: risks.reduce((sum, r) => sum + r.daysTracked, 0) / risks.length
        }
      });
    });

    // Record risk
    this.app.post('/api/risks/:projectId', (req, res) => {
      const { projectId } = req.params;
      const risk = {
        ...req.body,
        id: 'R' + Date.now(),
        createdAt: new Date().toISOString(),
        daysTracked: 0
      };

      if (!this.risks.has(projectId)) {
        this.risks.set(projectId, []);
      }

      this.risks.get(projectId).push(risk);
      res.json({ success: true, risk });
    });

    // Update risk status
    this.app.put('/api/risks/:projectId/:riskId', (req, res) => {
      const { projectId, riskId } = req.params;
      const risks = this.risks.get(projectId) || [];
      const risk = risks.find(r => r.id === riskId);

      if (!risk) {
        return res.status(404).json({ error: 'Risk not found' });
      }

      Object.assign(risk, req.body, {
        updatedAt: new Date().toISOString()
      });

      res.json({ success: true, risk });
    });

    // ============= DECISION SUPPORT SYSTEM =============

    // Evaluate decision
    this.app.post('/api/decisions/evaluate', (req, res) => {
      const { clarity, complexity, context } = req.body;

      const evaluation = this.evaluateDecision(clarity, complexity);

      res.json({
        clarity,
        complexity,
        evaluation,
        timestamp: new Date().toISOString()
      });
    });

    // Record decision
    this.app.post('/api/decisions/:projectId', (req, res) => {
      const { projectId } = req.params;
      const decision = {
        ...req.body,
        id: 'D' + Date.now(),
        createdAt: new Date().toISOString(),
        status: 'pending'
      };

      if (!this.decisions.has(projectId)) {
        this.decisions.set(projectId, []);
      }

      this.decisions.get(projectId).push(decision);
      res.json({ success: true, decision });
    });

    // Get decisions
    this.app.get('/api/decisions/:projectId', (req, res) => {
      const { projectId } = req.params;
      const decisions = this.decisions.get(projectId) || [];

      const stats = {
        total: decisions.length,
        successful: decisions.filter(d => d.outcome === 'SUCCESS').length,
        successRate: decisions.length > 0
          ? ((decisions.filter(d => d.outcome === 'SUCCESS').length / decisions.length) * 100).toFixed(1) + '%'
          : 'N/A'
      };

      res.json({
        projectId,
        decisions,
        stats
      });
    });

    // ============= EFFORT ESTIMATION =============

    // Calculate effort
    this.app.post('/api/estimation/calculate', (req, res) => {
      const { complexity, skillLevel, teamSize } = req.body;

      const estimation = this.calculateEffort(complexity, skillLevel, teamSize);

      res.json(estimation);
    });

    // ============= LEARNING & RETROSPECTIVES =============

    // Record learning
    this.app.post('/api/learnings/:projectId', (req, res) => {
      const { projectId } = req.params;
      const learning = {
        ...req.body,
        id: 'L' + Date.now(),
        recordedAt: new Date().toISOString()
      };

      if (!this.learnings.has(projectId)) {
        this.learnings.set(projectId, []);
      }

      this.learnings.get(projectId).push(learning);

      // Auto-learn if enabled
      if (this.config.enableLearning) {
        this.applyLearning(projectId, learning);
      }

      res.json({ success: true, learning });
    });

    // Get learnings
    this.app.get('/api/learnings/:projectId', (req, res) => {
      const { projectId } = req.params;
      const learnings = this.learnings.get(projectId) || [];

      const categories = {};
      learnings.forEach(l => {
        if (!categories[l.category]) {
          categories[l.category] = [];
        }
        categories[l.category].push(l);
      });

      res.json({
        projectId,
        learnings,
        categories,
        appliedCount: learnings.filter(l => l.applied).length
      });
    });

    // ============= DASHBOARD DATA =============

    // Get complete dashboard snapshot
    this.app.get('/api/dashboard/:projectId', (req, res) => {
      const { projectId } = req.params;

      const snapshot = {
        projectId,
        metrics: this.metrics.get(projectId) || {},
        risks: this.risks.get(projectId) || [],
        decisions: this.decisions.get(projectId) || [],
        learnings: this.learnings.get(projectId) || [],
        timestamp: new Date().toISOString()
      };

      res.json(snapshot);
    });

    // ============= SYNC & PERSISTENCE =============

    // Save to disk
    this.app.post('/api/persistence/save', async (req, res) => {
      try {
        await this.saveToDisk();
        res.json({ success: true, message: 'Data persisted to disk' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Load from disk
    this.app.post('/api/persistence/load', async (req, res) => {
      try {
        await this.loadFromDisk();
        res.json({ success: true, message: 'Data loaded from disk' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============= ADVANCED CLAUDE API ENDPOINTS =============

    // Sacred Geometry analysis with Claude API
    this.app.post('/api/claude/sacred-geometry/analyze', async (req, res) => {
      try {
        const { request, options } = req.body;
        const analysis = await this.claudeAPI.analyzeSacredGeometry(request, options);

        res.json({
          success: true,
          analysis,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Vision analysis for architecture diagrams
    this.app.post('/api/claude/vision/analyze-diagram', async (req, res) => {
      try {
        const { imageUrl, context } = req.body;
        const analysis = await this.claudeAPI.analyzeArchitectureDiagram(imageUrl, context);

        res.json({
          success: true,
          analysis,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Structured outputs for reliable analysis
    this.app.post('/api/claude/structured/analyze', async (req, res) => {
      try {
        const { codeMetrics, schema } = req.body;
        const analysis = await this.claudeAPI.analyzeWithStructuredOutput(codeMetrics, schema);

        res.json({
          success: true,
          analysis,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Tool Use agent for autonomous analysis
    this.app.post('/api/claude/agent/sacred-geometry', async (req, res) => {
      try {
        const { request, tools } = req.body;
        const agentResponse = await this.claudeAPI.createSacredGeometryAgent(request, tools);

        res.json({
          success: true,
          agentResponse,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Batch processing for multiple analyses
    this.app.post('/api/claude/batch/analyze', async (req, res) => {
      try {
        const { items, options } = req.body;
        const batchResults = await this.claudeAPI.batchAnalyzeSacredGeometry(items, options);

        res.json({
          success: true,
          batchResults,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Cached analysis for repeated queries
    this.app.post('/api/claude/cached/analyze', async (req, res) => {
      try {
        const { cacheKey, request, options } = req.body;
        const cachedAnalysis = await this.claudeAPI.createCachedAnalysis(cacheKey, request, options);

        res.json({
          success: true,
          cachedAnalysis,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============= SACRED GEOMETRY PATTERN LIBRARY ENDPOINTS =============

    // Analyze code against pattern library
    this.app.post('/api/patterns/analyze', async (req, res) => {
      try {
        const { codeMetrics } = req.body;
        const analysis = await this.patternLibrary.analyzeCodeAgainstPatterns(codeMetrics);

        res.json({
          success: true,
          analysis,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Search patterns by criteria
    this.app.get('/api/patterns/search', (req, res) => {
      try {
        const { q: criteria } = req.query;
        const results = this.patternLibrary.searchPatterns(criteria);

        res.json({
          success: true,
          results,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Get pattern library statistics
    this.app.get('/api/patterns/stats', (req, res) => {
      try {
        const stats = this.patternLibrary.getLibraryStatistics();

        res.json({
          success: true,
          stats,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============= MCP SERVER INTEGRATIONS =============

    // GitHub integration - analyze commits
    this.app.post('/api/mcp/github/analyze-commit', async (req, res) => {
      try {
        const { repo, commitSha } = req.body;
        const analysis = await this.mcpIntegrations.analyzeGitHubCommit(repo, commitSha);

        res.json({
          success: true,
          analysis,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Slack integration - post analysis results
    this.app.post('/api/mcp/slack/post-analysis', async (req, res) => {
      try {
        const { channel, analysis } = req.body;
        const result = await this.mcpIntegrations.postToSlack(channel, analysis);

        res.json({
          success: true,
          result,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Stripe integration - track costs
    this.app.post('/api/mcp/stripe/track-costs', async (req, res) => {
      try {
        const { projectId, costs } = req.body;
        const tracking = await this.mcpIntegrations.trackImplementationCosts(projectId, costs);

        res.json({
          success: true,
          tracking,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // ============= COST TRACKING & ANALYTICS =============

    // Get Claude API cost report
    this.app.get('/api/costs/claude', (req, res) => {
      try {
        const costReport = this.claudeAPI.getCostReport();

        res.json({
          success: true,
          costReport,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });

    // Save cost report
    this.app.post('/api/costs/save', async (req, res) => {
      try {
        await this.claudeAPI.saveCostReport();
        res.json({ success: true, message: 'Cost report saved' });
      } catch (error) {
        res.status(500).json({ error: error.message });
      }
    });
  }

  // =========================================================================
  // DECISION SUPPORT SYSTEM LOGIC
  // =========================================================================

  evaluateDecision(clarity, complexity) {
    if (clarity < 70) {
      return {
        recommendation: 'CLARIFY',
        severity: 'CRITICAL',
        message: 'Clarity below minimum threshold (70%)',
        action: 'Request more details and re-evaluate'
      };
    }

    if (complexity > 9) {
      return {
        recommendation: 'DECOMPOSE',
        severity: 'HIGH',
        message: 'Complexity exceeds safe single-session threshold',
        action: 'Break into smaller phases'
      };
    }

    const strategies = [
      { max: 3, strategy: 'SINGLE_PASS', name: 'Single-Pass Generation' },
      { max: 5, strategy: 'ITERATIVE_REFINEMENT', name: 'Iterative Refinement' },
      { max: 7, strategy: 'MODULAR_CONSTRUCTION', name: 'Modular Construction' },
      { max: 10, strategy: 'PHASED_DEVELOPMENT', name: 'Phased Development' }
    ];

    const selectedStrategy = strategies.find(s => complexity <= s.max);

    return {
      recommendation: 'GENERATE',
      strategy: selectedStrategy.strategy,
      strategyName: selectedStrategy.name,
      confidence: Math.min(0.98, 0.7 + (clarity / 100) * 0.3),
      reasoning: `Clarity ${clarity}/100, Complexity ${complexity}/10 → ${selectedStrategy.name}`,
      estimatedPhases: Math.ceil(complexity / 3)
    };
  }

  // =========================================================================
  // EFFORT ESTIMATION LOGIC
  // =========================================================================

  calculateEffort(complexity, skillLevel = 'mid', teamSize = 1) {
    const baseEffort = complexity * 4; // hours

    const skillFactors = {
      junior: 1.5,
      mid: 1.0,
      senior: 0.7,
      expert: 0.5
    };

    const parallelization = {
      1: 1.0,
      2: 1.6,
      3: 2.0,
      4: 2.2,
      5: 2.3
    };

    const skillFactor = skillFactors[skillLevel] || 1.0;
    const teamFactor = parallelization[teamSize] || 1.0;

    const adjustedEffort = (baseEffort * skillFactor) / teamFactor;
    const testingOverhead = adjustedEffort * 0.4;
    const totalEffort = adjustedEffort + testingOverhead;

    // Estimate timeline (assuming 40h/week)
    const hoursPerWeek = 40;
    const weeks = totalEffort / hoursPerWeek;
    const days = weeks * 5;

    return {
      complexity,
      baseEffort: baseEffort.toFixed(1),
      skillLevel,
      skillFactor,
      teamSize,
      teamFactor,
      adjustedEffort: adjustedEffort.toFixed(1),
      testingOverhead: testingOverhead.toFixed(1),
      totalEffort: totalEffort.toFixed(1),
      timeline: {
        hours: totalEffort.toFixed(1),
        days: days.toFixed(1),
        weeks: weeks.toFixed(1)
      }
    };
  }

  // =========================================================================
  // METRICS EVALUATION
  // =========================================================================

  evaluateMetrics(projectId, newMetrics) {
    const evaluation = {
      timestamp: new Date().toISOString(),
      metrics: {},
      summary: {
        passing: 0,
        failing: 0,
        warning: 0
      }
    };

    Object.entries(newMetrics).forEach(([key, value]) => {
      const target = newMetrics[`${key}_target`];
      
      if (!target) return;

      const status = value <= target ? 'PASS' : value <= target * 1.1 ? 'WARNING' : 'FAIL';
      evaluation.metrics[key] = { value, target, status };

      if (status === 'PASS') evaluation.summary.passing++;
      else if (status === 'WARNING') evaluation.summary.warning++;
      else evaluation.summary.failing++;
    });

    return evaluation;
  }

  // =========================================================================
  // LEARNING APPLICATION
  // =========================================================================

  applyLearning(projectId, learning) {
    console.log(`📚 Applying learning: ${learning.learning}`);
    
    // In a real implementation, this would:
    // - Update estimation formulas
    // - Adjust complexity multipliers
    // - Refine decision rules
    // - Improve predictive models
    
    return {
      projectId,
      learningId: learning.id,
      applied: true,
      impact: learning.impact
    };
  }

  // =========================================================================
  // PERSISTENCE
  // =========================================================================

  async saveToDisk() {
    const storageDir = this.config.storageDir;

    // Create directory if it doesn't exist
    await fs.mkdir(storageDir, { recursive: true });

    // Save metrics
    const metricsPath = path.join(storageDir, 'metrics.json');
    const metricsData = {};
    this.metrics.forEach((v, k) => { metricsData[k] = v; });
    await fs.writeFile(metricsPath, JSON.stringify(metricsData, null, 2));

    // Save risks
    const risksPath = path.join(storageDir, 'risks.json');
    const risksData = {};
    this.risks.forEach((v, k) => { risksData[k] = v; });
    await fs.writeFile(risksPath, JSON.stringify(risksData, null, 2));

    // Save decisions
    const decisionsPath = path.join(storageDir, 'decisions.json');
    const decisionsData = {};
    this.decisions.forEach((v, k) => { decisionsData[k] = v; });
    await fs.writeFile(decisionsPath, JSON.stringify(decisionsData, null, 2));

    // Save learnings
    const learningsPath = path.join(storageDir, 'learnings.json');
    const learningsData = {};
    this.learnings.forEach((v, k) => { learningsData[k] = v; });
    await fs.writeFile(learningsPath, JSON.stringify(learningsData, null, 2));

    console.log('✅ Data persisted to disk');
  }

  async loadFromDisk() {
    const storageDir = this.config.storageDir;

    try {
      // Load metrics
      const metricsPath = path.join(storageDir, 'metrics.json');
      const metricsData = JSON.parse(await fs.readFile(metricsPath, 'utf8'));
      Object.entries(metricsData).forEach(([k, v]) => this.metrics.set(k, v));

      // Load risks
      const risksPath = path.join(storageDir, 'risks.json');
      const risksData = JSON.parse(await fs.readFile(risksPath, 'utf8'));
      Object.entries(risksData).forEach(([k, v]) => this.risks.set(k, v));

      // Load decisions
      const decisionsPath = path.join(storageDir, 'decisions.json');
      const decisionsData = JSON.parse(await fs.readFile(decisionsPath, 'utf8'));
      Object.entries(decisionsData).forEach(([k, v]) => this.decisions.set(k, v));

      // Load learnings
      const learningsPath = path.join(storageDir, 'learnings.json');
      const learningsData = JSON.parse(await fs.readFile(learningsPath, 'utf8'));
      Object.entries(learningsData).forEach(([k, v]) => this.learnings.set(k, v));

      console.log('✅ Data loaded from disk');
    } catch (error) {
      console.log('ℹ️ No persisted data found, starting fresh');
    }
  }

  // =========================================================================
  // SERVER LIFECYCLE
  // =========================================================================

  async start() {
    await this.loadFromDisk();

    this.server = this.app.listen(this.config.port, this.config.host, () => {
      console.log(`
🧠 MAGNUS DASHBOARD v2.0 ADVANCED - STARTED
📡 Server: http://${this.config.host}:${this.config.port}
📊 Dashboard: http://${this.config.host}:${this.config.port}/dashboard
🔌 API: http://${this.config.host}:${this.config.port}/api

🎯 ADVANCED CAPABILITIES ENABLED:
   ✅ Claude API Integration (Sonnet 4.5)
   ✅ Vision Analysis for Diagrams
   ✅ Tool Use (Agentic Analysis)
   ✅ Structured Outputs (JSON Schema)
   ✅ Batch Processing (50% cost reduction)
   ✅ Prompt Caching (Faster queries)
   ✅ Sacred Geometry Pattern Library
   ✅ MCP Server Integrations (GitHub, Slack, Stripe)

🔮 SACRED GEOMETRY INTEGRATION:
   ✅ Phase 1 Complete: Detection Engine
   ✅ Phase 2 Active: Advanced Tools Integration
   ✅ Pattern Library: 6 Sacred Geometry Patterns
   ✅ Real-time Analysis: Available via API

💰 COST TRACKING: Enabled
📈 ANALYTICS: Sacred Geometry metrics available

✅ Status: Ready for Advanced Sacred Geometry Analysis
      `);
    });

    // Auto-save every 5 minutes
    setInterval(() => this.saveToDisk(), 5 * 60 * 1000);

    return this.server;
  }

  async stop() {
    await this.saveToDisk();
    this.server.close();
    console.log('✅ Dashboard stopped');
  }
}

// ============================================================================
// LAUNCHER
// ============================================================================

// Run the server when this module is executed directly
const server = new MagnusDashboardServer({
  port: process.env.PORT || 3000,
  host: process.env.HOST || 'localhost',
  storageDir: process.env.STORAGE_DIR || './.magnus'
});

server.start().catch(error => {
  console.error('Failed to start dashboard:', error);
  process.exit(1);
});

// Graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down...');
  await server.stop();
  process.exit(0);
});
