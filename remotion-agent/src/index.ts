/**
 * REMOTION AGENT - MAIN ENTRY POINT
 *
 * Express server for video composition API
 * Integrates all components: audio analysis, composition, rendering, validation
 */

import express from 'express';
import cors from 'cors';
import { config as dotenvConfig } from 'dotenv';

// Load environment variables
dotenvConfig();

// Import components
import { AudioAnalyzer } from './audio/audio-analyzer';
import { CompositionBuilder } from './composition/composition-builder';
import { RenderEngine } from './rendering/render-engine';
import { ConvergenceValidator } from './integration/convergence-validator';
import { MagnusIntegration } from './integration/magnus-integration';
import { createRoutes, APIContext } from './api/routes';
import { defaultLogger } from './utils/logger';
import { defaultConfig } from './config/defaults';

// ============================================================================
// SERVER SETUP
// ============================================================================

async function main() {
  const logger = defaultLogger;
  logger.info('Starting Remotion Agent...');

  // Initialize components
  const audioAnalyzer = new AudioAnalyzer({
    enable432HzDetection: defaultConfig.sacred.frequency432Hz.enabled
  });

  const compositionBuilder = new CompositionBuilder({
    fps: 30,
    enableSacredGeometry: defaultConfig.sacred.geometry.enabled,
    enable432Hz: defaultConfig.sacred.frequency432Hz.enabled,
    goldenRatioMode: defaultConfig.sacred.geometry.goldenRatioMode
  });

  const renderEngine = new RenderEngine({
    outputDir: defaultConfig.paths.outputDir,
    tempDir: defaultConfig.paths.tempDir,
    concurrency: defaultConfig.remotion.concurrency,
    timeout: defaultConfig.remotion.timeout
  });

  const convergenceValidator = new ConvergenceValidator({
    strictMode: false
  });

  const magnusIntegration = new MagnusIntegration({
    apiUrl: defaultConfig.magnus.apiUrl,
    enabled: defaultConfig.magnus.enabled,
    sessionTimeout: defaultConfig.magnus.sessionTimeout
  });

  // Register with Magnus
  if (magnusIntegration.isEnabled()) {
    await magnusIntegration.registerAgent();
  }

  // Create API context
  const apiContext: APIContext = {
    audioAnalyzer,
    compositionBuilder,
    renderEngine,
    convergenceValidator,
    magnusIntegration
  };

  // Create Express app
  const app = express();

  // Middleware
  app.use(cors({
    origin: defaultConfig.api.corsEnabled ? '*' : false,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Agent']
  }));
  app.use(express.json({ limit: '100mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logging
  app.use((req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
      const duration = Date.now() - start;
      logger.info(`${req.method} ${req.path}`, {
        status: res.statusCode,
        duration,
        ip: req.ip
      });
    });
    next();
  });

  // Mount API routes
  app.use('/api/remotion', createRoutes(apiContext));

  // Root endpoint
  app.get('/', (req, res) => {
    res.json({
      name: 'Remotion Agent',
      version: defaultConfig.general.version,
      description: 'Video Composition Module for Magnus 13.2',
      endpoints: {
        compose: 'POST /api/remotion/compose',
        status: 'GET /api/remotion/compose/:jobId',
        validate: 'POST /api/remotion/validate',
        templates: 'GET /api/remotion/templates',
        jobs: 'GET /api/remotion/jobs',
        health: 'GET /api/remotion/health'
      },
      features: {
        sacredGeometry: defaultConfig.sacred.geometry.enabled,
        frequency432Hz: defaultConfig.sacred.frequency432Hz.enabled,
        pythagorean: defaultConfig.sacred.pythagorean.enabled,
        magnusIntegration: magnusIntegration.isEnabled()
      }
    });
  });

  // Error handling middleware
  app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    logger.error('Unhandled error', err);

    res.status(500).json({
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: defaultConfig.general.environment === 'production'
          ? 'An internal error occurred'
          : err.message,
        retryable: false
      },
      timestamp: Date.now()
    });
  });

  // 404 handler
  app.use((req, res) => {
    res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: `Endpoint ${req.method} ${req.path} not found`,
        retryable: false
      },
      timestamp: Date.now()
    });
  });

  // Start server
  const port = defaultConfig.api.port;
  const host = defaultConfig.api.host;

  app.listen(port, () => {
    logger.info(`Remotion Agent started`, {
      url: `http://${host}:${port}`,
      environment: defaultConfig.general.environment,
      sacredGeometry: defaultConfig.sacred.geometry.enabled,
      frequency432Hz: defaultConfig.sacred.frequency432Hz.enabled,
      magnusEnabled: magnusIntegration.isEnabled()
    });

    console.log(`
╔══════════════════════════════════════════════════════════════╗
║                    REMOTION AGENT                             ║
║            Video Composition for Magnus 13.2                  ║
╠══════════════════════════════════════════════════════════════╣
║  Server:     http://${host}:${port.toString().padEnd(35)}║
║  API Docs:   http://${host}:${port}/api/remotion/health${' '.repeat(14)}║
╠══════════════════════════════════════════════════════════════╣
║  Sacred Geometry:  ${defaultConfig.sacred.geometry.enabled ? '✓ Enabled ' : '✗ Disabled'}${' '.repeat(30)}║
║  432 Hz Emphasis:  ${defaultConfig.sacred.frequency432Hz.enabled ? '✓ Enabled ' : '✗ Disabled'}${' '.repeat(30)}║
║  Magnus Integration: ${magnusIntegration.isEnabled() ? '✓ Enabled ' : '✗ Disabled'}${' '.repeat(28)}║
╠══════════════════════════════════════════════════════════════╣
║  Golden Ratio (φ): 1.618033988749894                         ║
║  Base Frequency:   432 Hz                                     ║
╚══════════════════════════════════════════════════════════════╝
    `);
  });

  // Graceful shutdown
  process.on('SIGTERM', () => {
    logger.info('SIGTERM received, shutting down...');
    process.exit(0);
  });

  process.on('SIGINT', () => {
    logger.info('SIGINT received, shutting down...');
    process.exit(0);
  });

  // Cleanup expired Magnus sessions periodically
  setInterval(() => {
    magnusIntegration.cleanupExpiredSessions();
  }, 60000); // Every minute
}

// Run
main().catch(error => {
  console.error('Failed to start Remotion Agent:', error);
  process.exit(1);
});

// Export for testing
export { main };
