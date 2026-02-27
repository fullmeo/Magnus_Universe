/**
 * REMOTION AGENT - RENDER ENGINE
 *
 * Executes Remotion composition rendering
 * Handles quality presets, progress monitoring, and output validation
 */

import { exec, spawn, ChildProcess } from 'child_process';
import { promisify } from 'util';
import * as fs from 'fs';
import * as path from 'path';
import {
  CompositionData,
  RenderJob,
  RenderJobStatus,
  RenderPhase,
  RenderMetrics,
  RenderError,
  QualityPreset,
  VideoOutputFormat,
  QualityValidationResult,
  ValidationIssue
} from '../types';
import { createLogger, RemotionLogger } from '../utils/logger';
import { RenderingError, RenderTimeoutError } from '../utils/error-handler';
import { qualityPresets, defaultConfig } from '../config/defaults';

const execAsync = promisify(exec);

// ============================================================================
// RENDER ENGINE TYPES
// ============================================================================

export interface RenderEngineConfig {
  remotionPath?: string;
  compositionPath?: string;
  outputDir?: string;
  tempDir?: string;
  concurrency?: number;
  timeout?: number;
  logLevel?: 'verbose' | 'normal' | 'quiet';
}

export interface RenderOptions {
  jobId: string;
  sessionId: string;
  composition: CompositionData;
  audioPath?: string;
  qualityPreset: QualityPreset;
  outputFormat: VideoOutputFormat;
  outputPath?: string;
  onProgress?: (progress: number, status: string) => void;
}

export interface RenderResult {
  success: boolean;
  outputPath: string;
  metrics: RenderMetrics;
  errors?: RenderError[];
}

// ============================================================================
// RENDER ENGINE CLASS
// ============================================================================

export class RenderEngine {
  private config: Required<RenderEngineConfig>;
  private logger: RemotionLogger;
  private activeProcesses: Map<string, ChildProcess> = new Map();

  constructor(config: RenderEngineConfig = {}) {
    this.config = {
      remotionPath: config.remotionPath ?? 'npx remotion',
      compositionPath: config.compositionPath ?? './compositions/DefaultComposition.tsx',
      outputDir: config.outputDir ?? defaultConfig.paths.outputDir,
      tempDir: config.tempDir ?? defaultConfig.paths.tempDir,
      concurrency: config.concurrency ?? defaultConfig.remotion.concurrency,
      timeout: config.timeout ?? defaultConfig.remotion.timeout,
      logLevel: config.logLevel ?? 'normal'
    };

    this.logger = createLogger();
    this.ensureDirectories();
  }

  /**
   * Ensure output and temp directories exist
   */
  private ensureDirectories(): void {
    [this.config.outputDir, this.config.tempDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * Render a composition
   */
  async render(options: RenderOptions): Promise<RenderResult> {
    const startTime = Date.now();
    this.logger.setJobId(options.jobId);
    this.logger.setSessionId(options.sessionId);
    this.logger.phaseStart('rendering');

    const preset = qualityPresets[options.qualityPreset];
    const outputPath = options.outputPath ?? this.generateOutputPath(options.jobId, preset.format);

    try {
      // Write composition data to temp file for Remotion to read
      const compositionDataPath = path.join(this.config.tempDir, `${options.jobId}-composition.json`);
      await fs.promises.writeFile(compositionDataPath, JSON.stringify(options.composition, null, 2));

      // Build render command
      const command = this.buildRenderCommand(options, preset, outputPath, compositionDataPath);

      this.logger.info('Starting Remotion render', {
        command,
        preset: options.qualityPreset,
        format: options.outputFormat
      });

      // Execute render with progress monitoring
      const result = await this.executeRender(command, options);

      // Validate output
      const validation = await this.validateOutput(outputPath, options.composition);

      // Calculate metrics
      const metrics = await this.calculateMetrics(startTime, outputPath, options.composition);

      // Cleanup temp files
      await this.cleanup(compositionDataPath);

      const renderTime = Date.now() - startTime;
      this.logger.phaseComplete('rendering', renderTime, {
        outputPath,
        fileSize: metrics.fileSize,
        framesRendered: metrics.framesRendered
      });

      return {
        success: true,
        outputPath,
        metrics,
        errors: validation.issues.filter(i => i.severity === 'error').length > 0
          ? validation.issues.map(i => ({
              phase: 'validation' as RenderPhase,
              code: i.code,
              message: i.message,
              timestamp: Date.now(),
              recoverable: i.severity !== 'critical'
            }))
          : undefined
      };
    } catch (error) {
      const renderTime = Date.now() - startTime;
      this.logger.error('Render failed', error);

      throw new RenderingError(
        `Render failed: ${error instanceof Error ? error.message : String(error)}`,
        { jobId: options.jobId, duration: renderTime }
      );
    }
  }

  /**
   * Build Remotion render command
   */
  private buildRenderCommand(
    options: RenderOptions,
    preset: typeof qualityPresets[QualityPreset],
    outputPath: string,
    compositionDataPath: string
  ): string {
    const args = [
      'render',
      this.config.compositionPath,
      '--output', outputPath,
      '--codec', this.mapCodec(preset.codec, options.outputFormat),
      '--fps', String(preset.fps),
      '--concurrency', String(this.config.concurrency)
    ];

    // Add format-specific options
    if (preset.codec !== 'prores') {
      args.push('--crf', this.getCRFForPreset(options.qualityPreset));
    }

    // Add audio if provided
    if (options.audioPath) {
      args.push('--audio', options.audioPath);
    }

    // Add composition data as props
    args.push('--props', compositionDataPath);

    // Add log level
    if (this.config.logLevel === 'quiet') {
      args.push('--log', 'error');
    } else if (this.config.logLevel === 'verbose') {
      args.push('--log', 'verbose');
    }

    return `${this.config.remotionPath} ${args.join(' ')}`;
  }

  /**
   * Map codec to Remotion-compatible format
   */
  private mapCodec(codec: string, format: VideoOutputFormat): string {
    const codecMap: Record<string, Record<VideoOutputFormat, string>> = {
      h264: { mp4: 'h264', webm: 'vp8', gif: 'gif', mov: 'h264', mkv: 'h264', hevc: 'h265' },
      vp9: { mp4: 'h264', webm: 'vp9', gif: 'gif', mov: 'h264', mkv: 'vp9', hevc: 'h265' },
      prores: { mp4: 'prores', webm: 'vp9', gif: 'gif', mov: 'prores', mkv: 'prores', hevc: 'prores' }
    };

    return codecMap[codec]?.[format] ?? 'h264';
  }

  /**
   * Get CRF value for quality preset
   */
  private getCRFForPreset(preset: QualityPreset): string {
    const crfMap: Record<QualityPreset, string> = {
      fast: '28',
      balanced: '23',
      high: '18',
      master: '15'
    };
    return crfMap[preset];
  }

  /**
   * Execute render with progress monitoring
   */
  private async executeRender(
    command: string,
    options: RenderOptions
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        const process = this.activeProcesses.get(options.jobId);
        if (process) {
          process.kill();
          this.activeProcesses.delete(options.jobId);
        }
        reject(new RenderTimeoutError(this.config.timeout));
      }, this.config.timeout);

      // Use spawn for better progress tracking
      const [cmd, ...args] = command.split(' ');
      const process = spawn(cmd, args, {
        shell: true,
        stdio: ['pipe', 'pipe', 'pipe']
      });

      this.activeProcesses.set(options.jobId, process);

      let stdout = '';
      let stderr = '';
      let lastProgress = 0;

      process.stdout?.on('data', (data: Buffer) => {
        const output = data.toString();
        stdout += output;

        // Parse progress from Remotion output
        const progressMatch = output.match(/(\d+)%/);
        if (progressMatch) {
          const progress = parseInt(progressMatch[1], 10);
          if (progress > lastProgress) {
            lastProgress = progress;
            options.onProgress?.(progress, 'rendering');
            this.logger.renderProgress(progress, 0, 0);
          }
        }
      });

      process.stderr?.on('data', (data: Buffer) => {
        stderr += data.toString();
      });

      process.on('close', (code) => {
        clearTimeout(timeout);
        this.activeProcesses.delete(options.jobId);

        if (code === 0) {
          resolve();
        } else {
          reject(new RenderingError(`Render process exited with code ${code}`, { stderr }));
        }
      });

      process.on('error', (error) => {
        clearTimeout(timeout);
        this.activeProcesses.delete(options.jobId);
        reject(new RenderingError(`Render process error: ${error.message}`, { error }));
      });
    });
  }

  /**
   * Validate output file
   */
  async validateOutput(
    outputPath: string,
    composition: CompositionData
  ): Promise<QualityValidationResult> {
    const issues: ValidationIssue[] = [];
    let score = 100;

    // Check file exists
    if (!fs.existsSync(outputPath)) {
      issues.push({
        severity: 'critical',
        code: 'FILE_NOT_FOUND',
        message: 'Output file does not exist',
        recommendation: 'Check render logs for errors'
      });
      return { isValid: false, score: 0, metrics: this.getEmptyMetrics(), issues };
    }

    // Check file size
    const stats = await fs.promises.stat(outputPath);
    if (stats.size === 0) {
      issues.push({
        severity: 'critical',
        code: 'EMPTY_FILE',
        message: 'Output file is empty',
        recommendation: 'Render may have failed silently'
      });
      score = 0;
    } else if (stats.size < 1000) {
      issues.push({
        severity: 'warning',
        code: 'SMALL_FILE',
        message: 'Output file is very small',
        recommendation: 'Verify video content is correct'
      });
      score -= 20;
    }

    // TODO: Add ffprobe-based validation for:
    // - Duration matching
    // - Codec verification
    // - Frame rate verification
    // - Audio sync verification

    return {
      isValid: issues.filter(i => i.severity === 'critical').length === 0,
      score: Math.max(0, score),
      metrics: this.getEmptyMetrics(),
      issues
    };
  }

  /**
   * Calculate render metrics
   */
  private async calculateMetrics(
    startTime: number,
    outputPath: string,
    composition: CompositionData
  ): Promise<RenderMetrics> {
    const endTime = Date.now();
    const totalTime = endTime - startTime;

    let fileSize = 0;
    if (fs.existsSync(outputPath)) {
      const stats = await fs.promises.stat(outputPath);
      fileSize = stats.size;
    }

    const duration = composition.timeline.duration / 1000; // seconds
    const averageBitrate = fileSize > 0 && duration > 0
      ? (fileSize * 8) / duration / 1000 // kbps
      : 0;

    return {
      analysisTime: 0, // Set by orchestrator
      compositionTime: 0, // Set by orchestrator
      renderTime: totalTime,
      validationTime: 0, // Set after validation
      totalTime,
      fileSize,
      averageBitrate,
      peakMemory: process.memoryUsage().heapUsed / 1024 / 1024, // MB
      averageCpuUsage: 0, // Would need monitoring
      framesPerSecond: composition.timeline.fps,
      framesRendered: composition.timeline.totalFrames
    };
  }

  /**
   * Generate output path
   */
  private generateOutputPath(jobId: string, format: string): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    return path.join(this.config.outputDir, `${jobId}-${timestamp}.${format}`);
  }

  /**
   * Cleanup temp files
   */
  private async cleanup(...files: string[]): Promise<void> {
    for (const file of files) {
      try {
        if (fs.existsSync(file)) {
          await fs.promises.unlink(file);
        }
      } catch (error) {
        this.logger.warn('Failed to cleanup temp file', { file, error });
      }
    }
  }

  /**
   * Cancel a running render
   */
  cancelRender(jobId: string): boolean {
    const process = this.activeProcesses.get(jobId);
    if (process) {
      process.kill();
      this.activeProcesses.delete(jobId);
      this.logger.info('Render cancelled', { jobId });
      return true;
    }
    return false;
  }

  /**
   * Get empty metrics object
   */
  private getEmptyMetrics(): QualityValidationResult['metrics'] {
    return {
      audioSyncAccuracy: 0,
      frameConsistency: 0,
      colorDepth: 0,
      audioBalance: 0,
      visualClarity: 0
    };
  }

  /**
   * Estimate render time
   */
  estimateRenderTime(
    duration: number,
    qualityPreset: QualityPreset
  ): number {
    const preset = qualityPresets[qualityPreset];
    const durationMinutes = duration / 60000;
    return durationMinutes * preset.estimatedTimePerMinute * 1000;
  }

  /**
   * Get active render count
   */
  getActiveRenderCount(): number {
    return this.activeProcesses.size;
  }
}

export default RenderEngine;
