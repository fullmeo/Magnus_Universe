/**
 * Magnus 14 API Routes
 * RESTful endpoints for Magnus 14 project analysis
 *
 * Base path: /api/magnus14
 * 11 endpoints total for full CRUD operations
 * WebSocket event emission for real-time updates
 */

import express from 'express';
import {
  analyzeProjectWithMagnus14,
  recordProjectOutcome,
  getAccuracyMetrics,
  getLearningStatistics,
  getProjectAnalysis,
  generateReport,
  getAllProjects,
  getAllOutcomes,
  getProjectsCount,
  getOutcomesCount,
  getDomainParameters,
  getMagnus14Status
} from './magnus-14-integration.js';

const router = express.Router();

// WebSocket broadcaster (will be injected by dashboard-server)
let broadcast = null;

/**
 * Set the broadcast function for WebSocket events
 */
export function setBroadcaster(broadcastFn) {
  broadcast = broadcastFn;
}

/**
 * Middleware: Error handler for async route handlers
 * Wraps async functions to catch promise rejections
 */
const handleError = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

/**
 * PROJECT ANALYSIS ENDPOINTS
 */

/**
 * POST /api/magnus14/analyze
 * Analyze a new project through all 6 engines
 */
router.post('/analyze', handleError(async (req, res) => {
  const projectInput = req.body;

  // Validate input
  if (!projectInput.projectName || !projectInput.domain) {
    return res.status(400).json({
      success: false,
      error: 'Missing required fields: projectName, domain',
      code: 'INVALID_INPUT'
    });
  }

  // Emit analysis started event
  if (broadcast) {
    broadcast({
      type: 'magnus14-analysis-started',
      projectName: projectInput.projectName,
      domain: projectInput.domain,
      timestamp: Date.now()
    });
  }

  const result = await analyzeProjectWithMagnus14(projectInput);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      error: result.message,
      code: 'ANALYSIS_FAILED'
    });
  }

  // Emit analysis completed event
  if (broadcast) {
    broadcast({
      type: 'magnus14-analysis-completed',
      projectId: result.projectId,
      projectName: projectInput.projectName,
      domain: projectInput.domain,
      estimate: result.analysis?.finalEstimate,
      timestamp: result.timestamp
    });
  }

  res.status(201).json({
    success: true,
    projectId: result.projectId,
    analysis: result.analysis,
    timestamp: result.timestamp
  });
}));

/**
 * GET /api/magnus14/projects
 * List all analyzed projects
 * Query params: ?domain=music&limit=10&offset=0
 */
router.get('/projects', handleError(async (req, res) => {
  const { domain, limit = 50, offset = 0 } = req.query;

  try {
    let projects = getAllProjects();

    // Filter by domain if specified
    if (domain) {
      projects = projects.filter(p => p.domain === domain);
    }

    // Pagination
    const total = projects.length;
    const paginated = projects.slice(
      parseInt(offset),
      parseInt(offset) + parseInt(limit)
    );

    res.json({
      success: true,
      data: paginated,
      pagination: {
        total,
        limit: parseInt(limit),
        offset: parseInt(offset),
        hasMore: parseInt(offset) + parseInt(limit) < total
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
      code: 'LIST_FAILED'
    });
  }
}));

/**
 * GET /api/magnus14/projects/:id
 * Get specific project analysis
 */
router.get('/projects/:id', handleError(async (req, res) => {
  const analysis = getProjectAnalysis(req.params.id);

  if (!analysis) {
    return res.status(404).json({
      success: false,
      error: 'Project not found',
      code: 'NOT_FOUND'
    });
  }

  res.json({
    success: true,
    data: analysis
  });
}));

/**
 * DELETE /api/magnus14/projects/:id
 * Delete project (removes file from storage)
 * Note: Current implementation doesn't support deletion,
 * but endpoint exists for API completeness
 */
router.delete('/projects/:id', handleError(async (req, res) => {
  // Current implementation: projects are immutable once created
  // Future: implement file deletion
  res.status(501).json({
    success: false,
    error: 'Deletion not yet implemented',
    code: 'NOT_IMPLEMENTED',
    note: 'Projects are immutable in current version'
  });
}));

/**
 * OUTCOME & LEARNING ENDPOINTS
 */

/**
 * POST /api/magnus14/outcomes/:id
 * Record actual project outcome for learning
 */
router.post('/outcomes/:id', handleError(async (req, res) => {
  const { id } = req.params;
  const actualOutcome = req.body;

  // Validate outcome data
  if (!actualOutcome.actualSpiralCount && !actualOutcome.totalDurationMonths) {
    return res.status(400).json({
      success: false,
      error: 'Missing outcome data',
      code: 'INVALID_OUTCOME'
    });
  }

  // Emit outcome recording started event
  if (broadcast) {
    broadcast({
      type: 'magnus14-outcome-started',
      projectId: id,
      timestamp: Date.now()
    });
  }

  const result = await recordProjectOutcome(id, actualOutcome);

  if (!result.success) {
    return res.status(500).json({
      success: false,
      error: result.message,
      code: 'OUTCOME_RECORDING_FAILED'
    });
  }

  // Emit outcome recorded event with learning data
  if (broadcast) {
    broadcast({
      type: 'magnus14-outcome-recorded',
      projectId: result.projectId,
      accuracy: result.outcome?.accuracy,
      learnings: result.outcome?.learnings || [],
      timestamp: result.timestamp
    });
  }

  // Emit accuracy updated event
  if (broadcast) {
    const metrics = getAccuracyMetrics();
    if (metrics.success) {
      broadcast({
        type: 'magnus14-accuracy-updated',
        metrics: metrics.data,
        timestamp: Date.now()
      });
    }
  }

  res.json({
    success: true,
    projectId: result.projectId,
    accuracy: result.outcome?.accuracy,
    learnings: result.outcome?.learnings || [],
    recommendations: result.outcome?.recommendations || [],
    timestamp: result.timestamp
  });
}));

/**
 * GET /api/magnus14/outcomes/:id
 * Get outcome record for specific project
 */
router.get('/outcomes/:id', handleError(async (req, res) => {
  const outcomes = getAllOutcomes();
  const outcome = outcomes.find(o => o.projectId === req.params.id);

  if (!outcome) {
    return res.status(404).json({
      success: false,
      error: 'No outcome recorded for this project',
      code: 'NOT_FOUND'
    });
  }

  res.json({
    success: true,
    data: outcome
  });
}));

/**
 * METRICS & INTELLIGENCE ENDPOINTS
 */

/**
 * GET /api/magnus14/accuracy
 * Get overall prediction accuracy metrics
 */
router.get('/accuracy', handleError(async (req, res) => {
  const metrics = getAccuracyMetrics();

  if (!metrics.success) {
    return res.status(500).json({
      success: false,
      error: metrics.message,
      code: 'METRICS_FAILED'
    });
  }

  res.json({
    success: true,
    data: metrics.data,
    timestamp: metrics.timestamp
  });
}));

/**
 * GET /api/magnus14/domains
 * Get list of learned domains with parameters
 */
router.get('/domains', handleError(async (req, res) => {
  const projects = getAllProjects();
  const domains = {};

  projects.forEach(p => {
    if (!domains[p.domain]) {
      domains[p.domain] = {
        domain: p.domain,
        projectCount: 0,
        parameters: getDomainParameters(p.domain)
      };
    }
    domains[p.domain].projectCount++;
  });

  res.json({
    success: true,
    data: Object.values(domains)
  });
}));

/**
 * GET /api/magnus14/domains/:name
 * Get specific domain parameters and statistics
 */
router.get('/domains/:name', handleError(async (req, res) => {
  const params = getDomainParameters(req.params.name);
  const projects = getAllProjects().filter(p => p.domain === req.params.name);

  res.json({
    success: true,
    data: {
      domain: req.params.name,
      parameters: params,
      projectCount: projects.length,
      projects: projects
    }
  });
}));

/**
 * GET /api/magnus14/learning
 * Get learning system status and statistics
 */
router.get('/learning', handleError(async (req, res) => {
  const stats = getLearningStatistics();

  if (!stats.success) {
    return res.status(500).json({
      success: false,
      error: stats.message,
      code: 'LEARNING_STATS_FAILED'
    });
  }

  res.json({
    success: true,
    data: stats.data,
    timestamp: stats.timestamp
  });
}));

/**
 * REPORT ENDPOINTS
 */

/**
 * GET /api/magnus14/report/:id
 * Generate full formatted report for project
 */
router.get('/report/:id', handleError(async (req, res) => {
  const report = generateReport(req.params.id);

  if (!report) {
    return res.status(404).json({
      success: false,
      error: 'Could not generate report - project not found',
      code: 'NOT_FOUND'
    });
  }

  res.json({
    success: true,
    data: report
  });
}));

/**
 * STATUS ENDPOINTS
 */

/**
 * GET /api/magnus14/status
 * Get Magnus 14 system health and status
 */
router.get('/status', handleError(async (req, res) => {
  const status = getMagnus14Status();

  res.json({
    success: true,
    data: status
  });
}));


/**
 * Global error handler
 */
router.use((err, req, res, next) => {
  console.error('API Error:', err.message);
  res.status(500).json({
    success: false,
    error: err.message,
    code: 'INTERNAL_ERROR'
  });
});

/**
 * Setup Magnus 14 API routes
 * Called from dashboard-server.js
 */
export function setupMagnus14Routes(app, broadcastFn) {
  // Set the broadcaster for WebSocket events
  if (broadcastFn) {
    setBroadcaster(broadcastFn);
  }

  app.use('/api/magnus14', router);
}

export default router;
