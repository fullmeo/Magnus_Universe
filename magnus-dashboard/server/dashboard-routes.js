/**
 * Dashboard Routes for Magnus 14 Project Overview
 *
 * Provides REST API endpoints for:
 * - Project overview and summaries
 * - System health metrics
 * - Domain and complexity distribution
 * - Timeline estimates
 * - Risk assessment
 * - Individual project progress tracking
 */

import { getMagnus14 } from './magnus-14-integration.js';

export function setupDashboardRoutes(app, dashboardAPI) {
  if (!dashboardAPI) {
    console.warn('⚠️  Dashboard API not available - dashboard routes will not be functional');
    return;
  }

  /**
   * GET /api/dashboard/overview
   * Returns comprehensive dashboard data
   */
  app.get('/api/dashboard/overview', (req, res) => {
    try {
      const data = dashboardAPI.getDashboardData();
      res.json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Dashboard overview error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/dashboard/projects
   * Returns all projects with status
   */
  app.get('/api/dashboard/projects', (req, res) => {
    try {
      const data = dashboardAPI.getAllProjectsWithSummary();
      res.json({
        success: true,
        data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Projects endpoint error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/dashboard/health
   * Returns system health metrics
   */
  app.get('/api/dashboard/health', (req, res) => {
    try {
      const health = dashboardAPI.getSystemHealth();
      res.json({
        success: true,
        data: health,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Health endpoint error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/dashboard/domains
   * Returns domain distribution
   */
  app.get('/api/dashboard/domains', (req, res) => {
    try {
      const domains = dashboardAPI.getDomainDistribution();
      res.json({
        success: true,
        data: domains,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Domains endpoint error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/dashboard/complexity
   * Returns complexity analysis
   */
  app.get('/api/dashboard/complexity', (req, res) => {
    try {
      const complexity = dashboardAPI.getComplexityAnalysis();
      res.json({
        success: true,
        data: complexity,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Complexity endpoint error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/dashboard/timeline
   * Returns timeline estimates
   */
  app.get('/api/dashboard/timeline', (req, res) => {
    try {
      const timeline = dashboardAPI.getTimelineEstimates();
      res.json({
        success: true,
        data: timeline,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Timeline endpoint error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/dashboard/confidence
   * Returns confidence distribution
   */
  app.get('/api/dashboard/confidence', (req, res) => {
    try {
      const confidence = dashboardAPI.getConfidenceDistribution();
      res.json({
        success: true,
        data: confidence,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Confidence endpoint error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/dashboard/risks
   * Returns risk assessment
   */
  app.get('/api/dashboard/risks', (req, res) => {
    try {
      const risks = dashboardAPI.getRiskAssessment();
      res.json({
        success: true,
        data: risks,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Risks endpoint error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  /**
   * GET /api/dashboard/project/:projectId
   * Returns detailed progress for specific project
   */
  app.get('/api/dashboard/project/:projectId', (req, res) => {
    try {
      const { projectId } = req.params;
      const progress = dashboardAPI.getProjectProgress(projectId);

      if (!progress) {
        return res.status(404).json({
          success: false,
          error: 'Project not found'
        });
      }

      res.json({
        success: true,
        data: progress,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      console.error('Project progress error:', error);
      res.status(500).json({
        success: false,
        error: error.message
      });
    }
  });

  console.log('✅ Dashboard routes registered (10 endpoints)');
}

export default setupDashboardRoutes;
