/**
 * REMOTION AGENT - REST API ROUTES
 *
 * Express-based REST API for video composition
 * Endpoints for composition, status polling, validation, and health checks
 */

import express, { Request, Response, NextFunction, Router } from 'express';
import { v4 as uuidv4 } from 'uuid';
import {
  ComposeRequest,
  ComposeResponse,
  JobStatusResponse,
  APIResponse,
  APIError,
  RenderJob,
  RenderJobStatus,
  ConvergenceData,
  CompositionRequest
} from '../types';
import { createLogger, RemotionLogger } from '../utils/logger';
import { RemotionAgentError } from '../utils/error-handler';

// Import core components (will be injected)
import { AudioAnalyzer } from '../audio/audio-analyzer';
import { CompositionBuilder } from '../composition/composition-builder';
import { RenderEngine } from '../rendering/render-engine';
import { ConvergenceValidator } from '../integration/convergence-validator';
import { MagnusIntegration } from '../integration/magnus-integration';
import { defaultTemplate } from '../config/defaults';

// ============================================================================
// API TYPES
// ============================================================================

export interface APIContext {
  audioAnalyzer: AudioAnalyzer;
  compositionBuilder: CompositionBuilder;
  renderEngine: RenderEngine;
  convergenceValidator: ConvergenceValidator;
  magnusIntegration: MagnusIntegration;
}

// ============================================================================
// JOB STORE (in-memory for demo, use Redis/DB in production)
// ============================================================================

class JobStore {
  private jobs: Map<string, RenderJob> = new Map();

  create(jobId: string, sessionId: string, request: CompositionRequest): RenderJob {
    const job: RenderJob = {
      jobId,
      sessionId,
      status: 'queued',
      progress: 0,
      phase: 'initialization',
      compositionRequest: request,
      startTime: Date.now()
    };
    this.jobs.set(jobId, job);
    return job;
  }

  get(jobId: string): RenderJob | undefined {
    return this.jobs.get(jobId);
  }

  update(jobId: string, updates: Partial<RenderJob>): RenderJob | undefined {
    const job = this.jobs.get(jobId);
    if (job) {
      Object.assign(job, updates);
    }
    return job;
  }

  delete(jobId: string): boolean {
    return this.jobs.delete(jobId);
  }

  getAll(): RenderJob[] {
    return Array.from(this.jobs.values());
  }
}

const jobStore = new JobStore();

// ============================================================================
// ROUTE HANDLERS
// ============================================================================

export function createRoutes(context: APIContext): Router {
  const router = Router();
  const logger = createLogger();

  /**
   * POST /api/remotion/compose
   * Initiate video composition
   */
  router.post('/compose', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const body = req.body as ComposeRequest;

      // Validate request
      const validationErrors = validateComposeRequest(body);
      if (validationErrors.length > 0) {
        return res.status(400).json(createErrorResponse('VALIDATION_ERROR', validationErrors.join('; ')));
      }

      // Generate job ID
      const jobId = `job-${uuidv4().substring(0, 8)}`;

      // Convert to internal request format
      const request: CompositionRequest = {
        audioPath: body.audioPath,
        audioBuffer: body.audioBuffer ? decodeBase64Audio(body.audioBuffer) : undefined,
        metadata: body.metadata,
        template: body.template,
        outputFormat: body.outputFormat ?? 'mp4',
        qualityPreset: body.qualityPreset ?? 'balanced',
        options: body.options
      };

      // Create Magnus session
      const session = await context.magnusIntegration.createSession(request, jobId);

      // Create job
      const job = jobStore.create(jobId, session.sessionId, request);

      // Get estimate
      const estimate = await context.magnusIntegration.estimateJob(request);

      // Start async processing
      processJob(jobId, context).catch(error => {
        logger.error('Job processing failed', error, { jobId });
        jobStore.update(jobId, {
          status: 'failed',
          errors: [{
            phase: 'rendering',
            code: 'PROCESSING_ERROR',
            message: error.message,
            timestamp: Date.now(),
            recoverable: false
          }]
        });
      });

      const response: ComposeResponse = {
        jobId,
        sessionId: session.sessionId,
        estimate,
        status: 'queued'
      };

      logger.info('Composition job created', { jobId, sessionId: session.sessionId });

      res.status(202).json(createSuccessResponse(response));
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/remotion/compose/:jobId
   * Poll job status
   */
  router.get('/compose/:jobId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId } = req.params;
      const job = jobStore.get(jobId);

      if (!job) {
        return res.status(404).json(createErrorResponse('NOT_FOUND', `Job ${jobId} not found`));
      }

      const response: JobStatusResponse = {
        jobId: job.jobId,
        status: job.status,
        phase: job.phase,
        progress: job.progress,
        outputPath: job.outputPath,
        convergenceData: job.convergenceData,
        errors: job.errors,
        metrics: job.metrics
      };

      res.json(createSuccessResponse(response));
    } catch (error) {
      next(error);
    }
  });

  /**
   * DELETE /api/remotion/compose/:jobId
   * Cancel a running job
   */
  router.delete('/compose/:jobId', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId } = req.params;
      const job = jobStore.get(jobId);

      if (!job) {
        return res.status(404).json(createErrorResponse('NOT_FOUND', `Job ${jobId} not found`));
      }

      if (job.status === 'complete' || job.status === 'failed') {
        return res.status(400).json(createErrorResponse('INVALID_STATE', 'Cannot cancel completed job'));
      }

      // Cancel render if running
      context.renderEngine.cancelRender(jobId);

      // Update job status
      jobStore.update(jobId, { status: 'cancelled' });

      res.json(createSuccessResponse({ message: 'Job cancelled', jobId }));
    } catch (error) {
      next(error);
    }
  });

  /**
   * POST /api/remotion/validate
   * Validate output convergence
   */
  router.post('/validate', async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { jobId, intention, feedback } = req.body;

      const job = jobStore.get(jobId);
      if (!job) {
        return res.status(404).json(createErrorResponse('NOT_FOUND', `Job ${jobId} not found`));
      }

      if (!job.analysis || !job.composition || !job.metrics) {
        return res.status(400).json(createErrorResponse('INVALID_STATE', 'Job not complete'));
      }

      const convergence = await context.convergenceValidator.validate({
        intention: intention || job.compositionRequest.metadata.title,
        audioAnalysis: job.analysis,
        composition: job.composition,
        renderMetrics: job.metrics,
        videoPath: job.outputPath
      });

      // Update job with new convergence data
      jobStore.update(jobId, { convergenceData: convergence });

      res.json(createSuccessResponse(convergence));
    } catch (error) {
      next(error);
    }
  });

  /**
   * GET /api/remotion/templates
   * List available composition templates
   */
  router.get('/templates', async (req: Request, res: Response) => {
    const templates = [
      {
        id: 'default',
        name: defaultTemplate.name,
        description: defaultTemplate.description,
        supportedVisualizations: defaultTemplate.supportedVisualizations
      }
    ];

    res.json(createSuccessResponse({ templates }));
  });

  /**
   * GET /api/remotion/jobs
   * List all jobs
   */
  router.get('/jobs', async (req: Request, res: Response) => {
    const jobs = jobStore.getAll().map(job => ({
      jobId: job.jobId,
      sessionId: job.sessionId,
      status: job.status,
      progress: job.progress,
      startTime: job.startTime,
      title: job.compositionRequest.metadata.title
    }));

    res.json(createSuccessResponse({ jobs, count: jobs.length }));
  });

  /**
   * GET /api/remotion/health
   * Health check endpoint
   */
  router.get('/health', async (req: Request, res: Response) => {
    const health = {
      status: 'healthy',
      components: {
        remotion: { status: 'healthy' },
        audioProcessing: { status: 'healthy' },
        storage: { status: 'healthy' },
        api: { status: 'healthy' },
        memory: {
          status: 'healthy',
          metrics: {
            used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024),
            total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024)
          }
        },
        magnus: {
          status: context.magnusIntegration.isEnabled() ? 'healthy' : 'disabled',
          activeSessions: context.magnusIntegration.getActiveSessionCount()
        }
      },
      uptime: process.uptime(),
      timestamp: Date.now()
    };

    res.json(createSuccessResponse(health));
  });

  return router;
}

// ============================================================================
// ASYNC JOB PROCESSOR
// ============================================================================

async function processJob(jobId: string, context: APIContext): Promise<void> {
  const logger = createLogger(jobId);
  const job = jobStore.get(jobId);

  if (!job) {
    throw new Error(`Job ${jobId} not found`);
  }

  const { audioAnalyzer, compositionBuilder, renderEngine, convergenceValidator, magnusIntegration } = context;

  try {
    // Phase 1: Analysis
    jobStore.update(jobId, { status: 'analyzing', phase: 'analysis', progress: 10 });
    await magnusIntegration.updateSession(job.sessionId, { phase: 'analysis', status: 'analyzing' });

    // Load audio (simplified - in real impl, read from audioPath)
    const audioData = new Float32Array(44100 * (job.compositionRequest.metadata.duration / 1000));
    // Simulate audio data with noise for demo
    for (let i = 0; i < audioData.length; i++) {
      audioData[i] = (Math.random() - 0.5) * 0.5 * Math.sin(i * 0.01);
    }

    const analysis = await audioAnalyzer.analyze(audioData);
    jobStore.update(jobId, { analysis, progress: 30 });

    // Phase 2: Composition
    jobStore.update(jobId, { status: 'composing', phase: 'composition', progress: 40 });
    await magnusIntegration.updateSession(job.sessionId, { phase: 'composition', status: 'composing' });

    const composition = await compositionBuilder.build({
      audioAnalysis: analysis,
      metadata: job.compositionRequest.metadata,
      qualityPreset: job.compositionRequest.qualityPreset,
      sacredGeometryConfig: {
        enabled: job.compositionRequest.options?.enableSacredGeometry ?? true,
        shape: 'dodecahedron',
        goldenRatioScale: 1,
        rotationSpeed: 0.5,
        colorMapping: { mode: 'frequency', colorSpace: 'hsl' },
        pulseResponse: true,
        harmonicAlignment: true
      }
    });
    jobStore.update(jobId, { composition, progress: 50 });

    // Phase 3: Rendering
    jobStore.update(jobId, { status: 'rendering', phase: 'rendering', progress: 60 });
    await magnusIntegration.updateSession(job.sessionId, { phase: 'rendering', status: 'rendering' });

    const renderResult = await renderEngine.render({
      jobId,
      sessionId: job.sessionId,
      composition,
      audioPath: job.compositionRequest.audioPath,
      qualityPreset: job.compositionRequest.qualityPreset ?? 'balanced',
      outputFormat: job.compositionRequest.outputFormat ?? 'mp4',
      onProgress: (progress, status) => {
        jobStore.update(jobId, { progress: 60 + progress * 0.3 });
      }
    });

    jobStore.update(jobId, {
      outputPath: renderResult.outputPath,
      metrics: renderResult.metrics,
      progress: 90
    });

    // Phase 4: Validation
    jobStore.update(jobId, { status: 'validating', phase: 'validation', progress: 95 });
    await magnusIntegration.updateSession(job.sessionId, { phase: 'validation', status: 'validating' });

    const convergence = await convergenceValidator.validate({
      intention: job.compositionRequest.metadata.title,
      audioAnalysis: analysis,
      composition,
      renderMetrics: renderResult.metrics,
      videoPath: renderResult.outputPath
    });

    // Complete
    jobStore.update(jobId, {
      status: 'complete',
      phase: 'finalization',
      progress: 100,
      convergenceData: convergence,
      endTime: Date.now()
    });

    // Complete Magnus session
    await magnusIntegration.completeSession(
      job.sessionId,
      convergence,
      renderResult.outputPath,
      renderResult.metrics
    );

    logger.info('Job completed successfully', {
      convergenceScore: convergence.overallConvergence,
      outcome: convergence.outcome
    });

  } catch (error) {
    logger.error('Job processing failed', error);

    jobStore.update(jobId, {
      status: 'failed',
      errors: [{
        phase: job.phase,
        code: error instanceof RemotionAgentError ? error.code : 'UNKNOWN_ERROR',
        message: error instanceof Error ? error.message : String(error),
        timestamp: Date.now(),
        recoverable: error instanceof RemotionAgentError ? error.recoverable : false
      }]
    });

    await magnusIntegration.updateSession(job.sessionId, {
      status: 'failed',
      error: error instanceof Error ? error.message : String(error)
    });

    throw error;
  }
}

// ============================================================================
// HELPERS
// ============================================================================

function validateComposeRequest(body: ComposeRequest): string[] {
  const errors: string[] = [];

  if (!body.metadata) {
    errors.push('metadata is required');
  } else {
    if (!body.metadata.title) {
      errors.push('metadata.title is required');
    }
    if (!body.metadata.duration || body.metadata.duration <= 0) {
      errors.push('metadata.duration must be a positive number');
    }
    if (body.metadata.duration > 3600000) {
      errors.push('metadata.duration cannot exceed 1 hour (3600000ms)');
    }
  }

  if (!body.audioPath && !body.audioBuffer) {
    errors.push('Either audioPath or audioBuffer is required');
  }

  const validFormats = ['mp4', 'webm', 'gif', 'mov', 'mkv', 'hevc'];
  if (body.outputFormat && !validFormats.includes(body.outputFormat)) {
    errors.push(`outputFormat must be one of: ${validFormats.join(', ')}`);
  }

  const validPresets = ['fast', 'balanced', 'high', 'master'];
  if (body.qualityPreset && !validPresets.includes(body.qualityPreset)) {
    errors.push(`qualityPreset must be one of: ${validPresets.join(', ')}`);
  }

  return errors;
}

function decodeBase64Audio(base64: string): Float32Array {
  const buffer = Buffer.from(base64, 'base64');
  return new Float32Array(buffer.buffer);
}

function createSuccessResponse<T>(data: T): APIResponse<T> {
  return {
    success: true,
    data,
    timestamp: Date.now()
  };
}

function createErrorResponse(code: string, message: string): APIResponse {
  return {
    success: false,
    error: { code, message, retryable: false },
    timestamp: Date.now()
  };
}

export default createRoutes;
