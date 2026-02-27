/**
 * REMOTION AGENT - LOGGER UTILITY
 *
 * Winston-based logging with structured output
 * Supports file and console transport
 */

import winston from 'winston';
import path from 'path';
import { MonitoringEvent, EventType } from '../types';

const LOG_DIR = process.env.LOG_DIR || './logs';

// Custom format for structured logging
const structuredFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

// Console format for development
const consoleFormat = winston.format.combine(
  winston.format.timestamp({ format: 'HH:mm:ss.SSS' }),
  winston.format.colorize(),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] ${level}: ${message}${metaStr}`;
  })
);

// Create the main logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: structuredFormat,
  defaultMeta: { service: 'remotion-agent' },
  transports: [
    // Error log file
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'error.log'),
      level: 'error',
      maxsize: 10 * 1024 * 1024, // 10MB
      maxFiles: 5
    }),
    // Combined log file
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'combined.log'),
      maxsize: 10 * 1024 * 1024,
      maxFiles: 5
    }),
    // Performance log file
    new winston.transports.File({
      filename: path.join(LOG_DIR, 'performance.log'),
      level: 'info',
      maxsize: 10 * 1024 * 1024,
      maxFiles: 3
    })
  ]
});

// Add console transport in non-production
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat
    })
  );
}

/**
 * Logger class with specialized methods for Remotion Agent
 */
export class RemotionLogger {
  private jobId?: string;
  private sessionId?: string;

  constructor(jobId?: string, sessionId?: string) {
    this.jobId = jobId;
    this.sessionId = sessionId;
  }

  private getContext(): Record<string, unknown> {
    const context: Record<string, unknown> = {};
    if (this.jobId) context.jobId = this.jobId;
    if (this.sessionId) context.sessionId = this.sessionId;
    return context;
  }

  setJobId(jobId: string): void {
    this.jobId = jobId;
  }

  setSessionId(sessionId: string): void {
    this.sessionId = sessionId;
  }

  // Standard logging methods
  debug(message: string, meta?: Record<string, unknown>): void {
    logger.debug(message, { ...this.getContext(), ...meta });
  }

  info(message: string, meta?: Record<string, unknown>): void {
    logger.info(message, { ...this.getContext(), ...meta });
  }

  warn(message: string, meta?: Record<string, unknown>): void {
    logger.warn(message, { ...this.getContext(), ...meta });
  }

  error(message: string, error?: Error | unknown, meta?: Record<string, unknown>): void {
    const errorMeta = error instanceof Error
      ? { error: error.message, stack: error.stack }
      : { error };
    logger.error(message, { ...this.getContext(), ...errorMeta, ...meta });
  }

  // Specialized logging methods
  phaseStart(phase: string, meta?: Record<string, unknown>): void {
    this.info(`Phase started: ${phase}`, { phase, event: 'phase_start', ...meta });
  }

  phaseComplete(phase: string, durationMs: number, meta?: Record<string, unknown>): void {
    this.info(`Phase completed: ${phase}`, {
      phase,
      event: 'phase_complete',
      durationMs,
      ...meta
    });
  }

  renderProgress(progress: number, framesRendered: number, totalFrames: number): void {
    this.debug('Render progress', {
      event: 'render_progress',
      progress,
      framesRendered,
      totalFrames
    });
  }

  convergenceResult(score: number, outcome: string, details?: Record<string, unknown>): void {
    this.info('Convergence validation complete', {
      event: 'convergence_result',
      score,
      outcome,
      ...details
    });
  }

  magnusEvent(eventType: string, data?: Record<string, unknown>): void {
    this.info(`Magnus event: ${eventType}`, {
      event: 'magnus_event',
      magnusEventType: eventType,
      ...data
    });
  }

  performance(operation: string, durationMs: number, meta?: Record<string, unknown>): void {
    this.info(`Performance: ${operation}`, {
      event: 'performance',
      operation,
      durationMs,
      ...meta
    });
  }

  sacredGeometry(operation: string, shape?: string, meta?: Record<string, unknown>): void {
    this.debug(`Sacred Geometry: ${operation}`, {
      event: 'sacred_geometry',
      operation,
      shape,
      ...meta
    });
  }

  frequency432Hz(operation: string, frequency?: number, meta?: Record<string, unknown>): void {
    this.debug(`432Hz: ${operation}`, {
      event: 'frequency_432hz',
      operation,
      frequency,
      ...meta
    });
  }

  // Create monitoring event
  createMonitoringEvent(
    eventType: EventType,
    severity: 'debug' | 'info' | 'warn' | 'error',
    message: string,
    metadata?: Record<string, unknown>
  ): MonitoringEvent {
    return {
      timestamp: Date.now(),
      eventType,
      jobId: this.jobId,
      severity,
      message,
      metadata
    };
  }
}

// Export singleton logger for simple use cases
export const defaultLogger = new RemotionLogger();

// Export factory function
export function createLogger(jobId?: string, sessionId?: string): RemotionLogger {
  return new RemotionLogger(jobId, sessionId);
}

export default logger;
