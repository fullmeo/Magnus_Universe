#!/usr/bin/env node

/**
 * ============================================================================
 * TRIZ API Server for Magnus Dashboard
 *
 * Provides REST endpoints for TRIZ analysis data:
 * - GET /api/triz/projects - List all projects with TRIZ analysis
 * - GET /api/triz/projects/:id - Get specific project analysis
 * - GET /api/triz/metrics - Get effectiveness metrics
 * - GET /api/triz/report - Get summary report
 *
 * Usage:
 *   node triz-api-server.js
 *   Runs on http://localhost:3001
 * ============================================================================
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  analyzeStoredProject,
  listProjectsWithTriz,
  generateStorageSummaryReport
} from '../magnus/magnus-14/storage/storage-triz-analyzer.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(express.json());
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'TRIZ API' });
});

// Get all projects with TRIZ analysis
app.get('/api/triz/projects', async (req, res) => {
  try {
    const projects = await listProjectsWithTriz();

    // Transform for API response
    const transformed = projects.map(p => ({
      id: p.metadata.projectId,
      name: p.metadata.projectName,
      createdAt: p.metadata.createdAt,
      complexity: p.complexity.scope,
      convergence: p.convergence,
      outcome: p.convergenceOutcome,
      pillars: {
        intentFidelity: p.pillarScores?.intentFidelity,
        optimalDesign: p.pillarScores?.optimalDesign,
        codeConsistency: p.pillarScores?.codeConsistency,
        eleganceScore: p.pillarScores?.eleganceScore
      },
      trizPrescriptions: p.trizPrescriptions?.prescriptions?.length || 0,
      failingPillars: p.trizPrescriptions?.failingPillars || []
    }));

    res.json({
      success: true,
      count: transformed.length,
      projects: transformed
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get specific project with full TRIZ analysis
app.get('/api/triz/projects/:filename', async (req, res) => {
  try {
    const { filename } = req.params;

    // Security: prevent path traversal
    if (filename.includes('..') || filename.includes('/')) {
      return res.status(400).json({
        success: false,
        error: 'Invalid filename'
      });
    }

    const analysis = await analyzeStoredProject(filename);

    if (!analysis) {
      return res.status(404).json({
        success: false,
        error: 'Project not found'
      });
    }

    res.json({
      success: true,
      project: {
        id: analysis.metadata.projectId,
        name: analysis.metadata.projectName,
        createdAt: analysis.metadata.createdAt,
        complexity: analysis.complexity.scope,
        metrics: analysis.metrics,
        pillars: {
          intentFidelity: analysis.pillarScores.intentFidelity,
          optimalDesign: analysis.pillarScores.optimalDesign,
          codeConsistency: analysis.pillarScores.codeConsistency,
          eleganceScore: analysis.pillarScores.eleganceScore,
          thresholds: {
            intentFidelity: 85,
            optimalDesign: 85,
            codeConsistency: 80,
            eleganceScore: 80
          }
        },
        convergence: analysis.convergenceOutcome,
        trizPrescriptions: analysis.trizPrescriptions?.prescriptions?.map(p => ({
          principleNumber: p.principleNumber,
          principleName: p.principleName,
          priority: p.priority,
          diagnosis: p.diagnosis,
          application: p.application
        })) || [],
        failingPillars: analysis.trizPrescriptions?.failingPillars || []
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get TRIZ metrics/effectiveness tracking
app.get('/api/triz/metrics', async (req, res) => {
  try {
    const projects = await listProjectsWithTriz();

    // Calculate metrics
    const totalProjects = projects.length;
    const convergedCount = projects.filter(p => p.convergenceOutcome === 'CONVERGED').length;
    const partialCount = projects.filter(p => p.convergenceOutcome === 'PARTIAL').length;
    const failedCount = projects.filter(p => p.convergenceOutcome === 'FAILED').length;

    // Average pillar scores
    const avgIntentFidelity = projects.reduce((sum, p) => sum + (p.pillarScores?.intentFidelity || 0), 0) / totalProjects;
    const avgOptimalDesign = projects.reduce((sum, p) => sum + (p.pillarScores?.optimalDesign || 0), 0) / totalProjects;
    const avgCodeConsistency = projects.reduce((sum, p) => sum + (p.pillarScores?.codeConsistency || 0), 0) / totalProjects;
    const avgEleganceScore = projects.reduce((sum, p) => sum + (p.pillarScores?.eleganceScore || 0), 0) / totalProjects;

    // TRIZ principle frequency (which principles appear most often)
    const principleFrequency = {};
    projects.forEach(p => {
      p.trizPrescriptions?.prescriptions?.forEach(pr => {
        const key = `Principle ${pr.principleNumber}`;
        principleFrequency[key] = (principleFrequency[key] || 0) + 1;
      });
    });

    res.json({
      success: true,
      metrics: {
        summary: {
          total: totalProjects,
          converged: convergedCount,
          partial: partialCount,
          failed: failedCount,
          convergenceRate: (convergedCount / totalProjects * 100).toFixed(1) + '%'
        },
        averagePillars: {
          intentFidelity: avgIntentFidelity.toFixed(1),
          optimalDesign: avgOptimalDesign.toFixed(1),
          codeConsistency: avgCodeConsistency.toFixed(1),
          eleganceScore: avgEleganceScore.toFixed(1)
        },
        principleFrequency: Object.entries(principleFrequency)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([principle, count]) => ({ principle, count }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get summary report
app.get('/api/triz/report', async (req, res) => {
  try {
    const report = await generateStorageSummaryReport();

    res.json({
      success: true,
      report: {
        timestamp: report.timestamp,
        summary: {
          totalProjects: report.totalProjects,
          convergedProjects: report.convergedProjects,
          partialProjects: report.partialProjects,
          failedProjects: report.failedProjects
        },
        projects: report.projects.map(p => ({
          name: p.name,
          createdAt: p.createdAt,
          convergenceOutcome: p.convergenceOutcome,
          complexity: p.complexity,
          failingPillars: p.failingPillars,
          topPrescription: p.topPrescription
        }))
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    availableEndpoints: [
      'GET /health',
      'GET /api/triz/projects',
      'GET /api/triz/projects/:filename',
      'GET /api/triz/metrics',
      'GET /api/triz/report'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🧠 TRIZ API Server running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   GET /health`);
  console.log(`   GET /api/triz/projects`);
  console.log(`   GET /api/triz/projects/:filename`);
  console.log(`   GET /api/triz/metrics`);
  console.log(`   GET /api/triz/report`);
  console.log(`\n`);
});

export default app;
