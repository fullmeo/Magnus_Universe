/**
 * Magnus 14 Integration Module
 * Connects Magnus 14 (6-engine analysis framework) to the dashboard server
 *
 * Handles CommonJS ↔ ES6 module compatibility for Magnus 14
 * Pattern: Dynamic import with graceful degradation
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, readdirSync, existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const MAGNUS_14_PATH = path.join(__dirname, '../../magnus/magnus-14');
const MAGNUS_14_STORAGE = path.join(MAGNUS_14_PATH, 'storage');

let Magnus14 = null;
let magnus14Instance = null;
let predictionImprover = null;

/**
 * Initialize Magnus 14 framework
 * Uses dynamic import to bridge CommonJS (Magnus 14) with ES6 (Dashboard)
 */
export async function initializeMagnus14() {
  try {
    // Check if Magnus 14 path exists
    if (!existsSync(MAGNUS_14_PATH)) {
      console.warn('⚠️  Magnus 14 path not found:', MAGNUS_14_PATH);
      return null;
    }

    // Dynamic import of CommonJS Magnus 14 core
    // Use createRequire to load CommonJS modules in ES6 context
    const coreModulePath = path.join(MAGNUS_14_PATH, 'magnus-14-core.js');

    if (!existsSync(coreModulePath)) {
      console.warn('⚠️  Magnus 14 core not found:', coreModulePath);
      return null;
    }

    // Import module utilities
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);

    // Load Magnus 14 core using require
    Magnus14 = require(coreModulePath);

    // Create instance with storage directory
    magnus14Instance = new Magnus14({ storageDir: MAGNUS_14_STORAGE });

    // Load prediction improver for learning system
    const improverPath = path.join(MAGNUS_14_PATH, 'learning/prediction-improver.js');
    if (existsSync(improverPath)) {
      try {
        const PredictionImprover = require(improverPath);
        predictionImprover = new PredictionImprover();
        console.log('✅ Magnus 14 Learning System loaded');
      } catch (improverError) {
        console.warn('⚠️  Could not load prediction improver:', improverError.message);
      }
    }

    console.log('✅ Magnus 14 initialized successfully');
    console.log(`📊 Storage directory: ${MAGNUS_14_STORAGE}`);

    return magnus14Instance;
  } catch (error) {
    console.error('⚠️  Magnus 14 initialization warning:', error.message);
    console.log('📍 Dashboard will work with partial Magnus 14 functionality');
    return null;
  }
}

/**
 * Get Magnus 14 instance
 */
export function getMagnus14() {
  return magnus14Instance;
}

/**
 * Get prediction improver instance
 */
export function getPredictionImprover() {
  return predictionImprover;
}

/**
 * Analyze project through Magnus 14
 */
export async function analyzeProjectWithMagnus14(projectInput) {
  if (!magnus14Instance) {
    return {
      success: false,
      message: 'Magnus 14 not initialized',
      data: null
    };
  }

  try {
    const analysis = magnus14Instance.analyzeProject(projectInput);

    return {
      success: true,
      message: 'Project analyzed successfully',
      projectId: analysis.projectId,
      analysis: analysis,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Magnus 14 analysis error:', error.message);
    return {
      success: false,
      message: error.message,
      data: null
    };
  }
}

/**
 * Record project outcome for learning
 */
export async function recordProjectOutcome(projectId, actualOutcome) {
  if (!magnus14Instance) {
    return {
      success: false,
      message: 'Magnus 14 not initialized',
      data: null
    };
  }

  try {
    const outcomeRecord = magnus14Instance.recordOutcome(projectId, actualOutcome);

    // Apply learning if improver is available
    if (predictionImprover && outcomeRecord) {
      const analysis = magnus14Instance.getProjectAnalysis(projectId);
      if (analysis && outcomeRecord.accuracy) {
        const learnings = predictionImprover.improveFromOutcome(
          analysis,
          actualOutcome,
          outcomeRecord.accuracy
        );
        outcomeRecord.learnings = learnings.learnings;
        outcomeRecord.recommendations = learnings.recommendations;
      }
    }

    return {
      success: true,
      message: 'Outcome recorded and learning applied',
      projectId: projectId,
      outcome: outcomeRecord,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Magnus 14 outcome error:', error.message);
    return {
      success: false,
      message: error.message,
      data: null
    };
  }
}

/**
 * Get accuracy metrics across all projects
 */
export function getAccuracyMetrics() {
  if (!magnus14Instance) {
    return {
      success: false,
      message: 'Magnus 14 not initialized',
      data: null
    };
  }

  try {
    const metrics = magnus14Instance.getAccuracyMetrics();

    return {
      success: true,
      data: metrics,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Magnus 14 metrics error:', error.message);
    return {
      success: false,
      message: error.message,
      data: null
    };
  }
}

/**
 * Get learning statistics
 */
export function getLearningStatistics() {
  if (!predictionImprover) {
    return {
      success: false,
      message: 'Learning system not initialized',
      data: null
    };
  }

  try {
    const stats = predictionImprover.getStatistics();

    return {
      success: true,
      data: stats,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Magnus 14 learning stats error:', error.message);
    return {
      success: false,
      message: error.message,
      data: null
    };
  }
}

/**
 * Get specific project analysis
 */
export function getProjectAnalysis(projectId) {
  if (!magnus14Instance) {
    return null;
  }

  try {
    return magnus14Instance.getProjectAnalysis(projectId);
  } catch (error) {
    console.error('Error retrieving project:', error.message);
    return null;
  }
}

/**
 * Generate full report for project
 */
export function generateReport(projectId) {
  if (!magnus14Instance) {
    return null;
  }

  try {
    return magnus14Instance.generateReport(projectId);
  } catch (error) {
    console.error('Error generating report:', error.message);
    return null;
  }
}

/**
 * Get all stored projects from storage directory
 * Synchronous version - use with caution as it blocks
 * For status checks, use getAllProjectsCount() instead
 */
export function getAllProjects() {
  try {
    if (!existsSync(MAGNUS_14_STORAGE)) {
      return [];
    }

    const files = readdirSync(MAGNUS_14_STORAGE)
      .filter(f => f.endsWith('.json') && f.startsWith('proj_'))
      .map(f => {
        try {
          const filePath = path.join(MAGNUS_14_STORAGE, f);
          const content = readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);
          return {
            projectId: data.projectId,
            projectName: data.input?.projectName || 'Unknown',
            domain: data.input?.domain || 'unknown',
            timestamp: data.timestamp,
            filePath: f
          };
        } catch (e) {
          console.warn(`Could not parse ${f}:`, e.message);
          return null;
        }
      })
      .filter(p => p !== null);

    return files;
  } catch (error) {
    console.error('Error listing projects:', error.message);
    return [];
  }
}

/**
 * Get count of projects quickly (for status endpoint)
 * Optimized to avoid blocking on large directories
 */
export function getProjectsCount() {
  try {
    if (!existsSync(MAGNUS_14_STORAGE)) {
      return 0;
    }

    const files = readdirSync(MAGNUS_14_STORAGE);
    const count = files.filter(f => f.endsWith('.json') && f.startsWith('proj_')).length;
    return count;
  } catch (error) {
    console.warn('Error counting projects:', error.message);
    return 0;
  }
}

/**
 * Get all outcomes from storage
 * Synchronous version - use with caution as it blocks
 * For status checks, use getOutcomesCount() instead
 */
export function getAllOutcomes() {
  try {
    const outcomesDir = path.join(MAGNUS_14_STORAGE, 'outcomes');

    if (!existsSync(outcomesDir)) {
      return [];
    }

    const files = readdirSync(outcomesDir)
      .filter(f => f.endsWith('.json'))
      .map(f => {
        try {
          const filePath = path.join(outcomesDir, f);
          const content = readFileSync(filePath, 'utf8');
          const data = JSON.parse(content);
          return {
            projectId: data.projectId,
            timestamp: data.timestamp,
            accuracy: data.accuracy,
            filePath: f
          };
        } catch (e) {
          console.warn(`Could not parse ${f}:`, e.message);
          return null;
        }
      })
      .filter(o => o !== null);

    return files;
  } catch (error) {
    console.error('Error listing outcomes:', error.message);
    return [];
  }
}

/**
 * Get count of outcomes quickly (for status endpoint)
 * Optimized to avoid blocking on large directories
 */
export function getOutcomesCount() {
  try {
    const outcomesDir = path.join(MAGNUS_14_STORAGE, 'outcomes');

    if (!existsSync(outcomesDir)) {
      return 0;
    }

    const files = readdirSync(outcomesDir);
    const count = files.filter(f => f.endsWith('.json')).length;
    return count;
  } catch (error) {
    console.warn('Error counting outcomes:', error.message);
    return 0;
  }
}

/**
 * Get domain-specific parameters
 */
export function getDomainParameters(domain) {
  if (!predictionImprover) {
    return {
      domain: domain,
      spiralMultiplier: 1.0,
      integrationMultiplier: 1.75,
      durationMultiplier: 1.0,
      projectsAnalyzed: 0
    };
  }

  try {
    return predictionImprover.getDomainParameters(domain);
  } catch (error) {
    console.error('Error getting domain parameters:', error.message);
    return {
      domain: domain,
      spiralMultiplier: 1.0,
      integrationMultiplier: 1.75,
      durationMultiplier: 1.0,
      projectsAnalyzed: 0
    };
  }
}

/**
 * Get Magnus 14 status
 * Optimized for quick response time using count functions
 */
export function getMagnus14Status() {
  return {
    initialized: magnus14Instance !== null,
    learningSystemInitialized: predictionImprover !== null,
    storageAvailable: existsSync(MAGNUS_14_STORAGE),
    projectsStored: getProjectsCount(),
    outcomesRecorded: getOutcomesCount(),
    timestamp: new Date().toISOString()
  };
}

export default {
  initializeMagnus14,
  getMagnus14,
  getPredictionImprover,
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
};
