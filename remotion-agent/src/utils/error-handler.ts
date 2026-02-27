/**
 * REMOTION AGENT - ERROR HANDLER
 *
 * Comprehensive error handling with recovery strategies
 * Supports graceful degradation and error reporting
 */

import { RenderError, RenderPhase, APIError } from '../types';
import { defaultLogger } from './logger';

// ============================================================================
// CUSTOM ERROR CLASSES
// ============================================================================

export class RemotionAgentError extends Error {
  public code: string;
  public recoverable: boolean;
  public phase?: RenderPhase;
  public details?: unknown;

  constructor(
    message: string,
    code: string,
    recoverable: boolean = false,
    phase?: RenderPhase,
    details?: unknown
  ) {
    super(message);
    this.name = 'RemotionAgentError';
    this.code = code;
    this.recoverable = recoverable;
    this.phase = phase;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  toRenderError(): RenderError {
    return {
      phase: this.phase || 'initialization',
      code: this.code,
      message: this.message,
      details: this.details,
      timestamp: Date.now(),
      recoverable: this.recoverable
    };
  }

  toAPIError(): APIError {
    return {
      code: this.code,
      message: this.message,
      details: this.details,
      retryable: this.recoverable
    };
  }
}

// Audio-related errors
export class AudioAnalysisError extends RemotionAgentError {
  constructor(message: string, details?: unknown) {
    super(message, 'AUDIO_ANALYSIS_ERROR', true, 'analysis', details);
    this.name = 'AudioAnalysisError';
  }
}

export class InvalidAudioError extends RemotionAgentError {
  constructor(message: string, details?: unknown) {
    super(message, 'INVALID_AUDIO', false, 'analysis', details);
    this.name = 'InvalidAudioError';
  }
}

// Composition-related errors
export class CompositionError extends RemotionAgentError {
  constructor(message: string, details?: unknown) {
    super(message, 'COMPOSITION_ERROR', true, 'composition', details);
    this.name = 'CompositionError';
  }
}

export class TemplateNotFoundError extends RemotionAgentError {
  constructor(templateId: string) {
    super(`Template not found: ${templateId}`, 'TEMPLATE_NOT_FOUND', false, 'composition', { templateId });
    this.name = 'TemplateNotFoundError';
  }
}

// Rendering errors
export class RenderingError extends RemotionAgentError {
  constructor(message: string, details?: unknown) {
    super(message, 'RENDERING_ERROR', true, 'rendering', details);
    this.name = 'RenderingError';
  }
}

export class RenderTimeoutError extends RemotionAgentError {
  constructor(timeoutMs: number) {
    super(`Render timed out after ${timeoutMs}ms`, 'RENDER_TIMEOUT', true, 'rendering', { timeoutMs });
    this.name = 'RenderTimeoutError';
  }
}

// Validation errors
export class ValidationError extends RemotionAgentError {
  constructor(message: string, details?: unknown) {
    super(message, 'VALIDATION_ERROR', true, 'validation', details);
    this.name = 'ValidationError';
  }
}

export class ConvergenceError extends RemotionAgentError {
  constructor(score: number, threshold: number) {
    super(
      `Convergence score ${score} below threshold ${threshold}`,
      'CONVERGENCE_FAILED',
      true,
      'validation',
      { score, threshold }
    );
    this.name = 'ConvergenceError';
  }
}

// Resource errors
export class ResourceError extends RemotionAgentError {
  constructor(resource: string, message: string) {
    super(message, 'RESOURCE_ERROR', true, 'initialization', { resource });
    this.name = 'ResourceError';
  }
}

export class OutOfMemoryError extends ResourceError {
  constructor(usedMB: number, limitMB: number) {
    super('memory', `Memory usage ${usedMB}MB exceeds limit ${limitMB}MB`);
    this.name = 'OutOfMemoryError';
    this.details = { usedMB, limitMB };
  }
}

export class DiskSpaceError extends ResourceError {
  constructor(availableMB: number, requiredMB: number) {
    super('disk', `Disk space ${availableMB}MB insufficient, need ${requiredMB}MB`);
    this.name = 'DiskSpaceError';
    this.details = { availableMB, requiredMB };
  }
}

// Magnus integration errors
export class MagnusIntegrationError extends RemotionAgentError {
  constructor(message: string, details?: unknown) {
    super(message, 'MAGNUS_INTEGRATION_ERROR', true, 'finalization', details);
    this.name = 'MagnusIntegrationError';
  }
}

// ============================================================================
// ERROR HANDLER CLASS
// ============================================================================

export interface RecoveryStrategy {
  canRecover: boolean;
  action?: () => Promise<void>;
  fallback?: unknown;
  retryCount?: number;
  retryDelayMs?: number;
}

export class ErrorHandler {
  private maxRetries: number;
  private retryDelayMs: number;
  private errorCallbacks: Array<(error: RemotionAgentError) => void> = [];

  constructor(maxRetries: number = 3, retryDelayMs: number = 1000) {
    this.maxRetries = maxRetries;
    this.retryDelayMs = retryDelayMs;
  }

  /**
   * Register a callback to be called when an error occurs
   */
  onError(callback: (error: RemotionAgentError) => void): void {
    this.errorCallbacks.push(callback);
  }

  /**
   * Handle an error with appropriate recovery strategy
   */
  async handleError(error: unknown, context?: string): Promise<RecoveryStrategy> {
    const agentError = this.normalizeError(error, context);

    // Log the error
    defaultLogger.error(`Error in ${context || 'unknown context'}`, agentError);

    // Notify callbacks
    this.errorCallbacks.forEach(cb => cb(agentError));

    // Determine recovery strategy
    return this.getRecoveryStrategy(agentError);
  }

  /**
   * Execute an operation with retry logic
   */
  async executeWithRetry<T>(
    operation: () => Promise<T>,
    context: string,
    options?: {
      maxRetries?: number;
      retryDelayMs?: number;
      onRetry?: (attempt: number, error: unknown) => void;
    }
  ): Promise<T> {
    const maxRetries = options?.maxRetries ?? this.maxRetries;
    const retryDelayMs = options?.retryDelayMs ?? this.retryDelayMs;

    let lastError: unknown;

    for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
      try {
        return await operation();
      } catch (error) {
        lastError = error;

        if (attempt <= maxRetries) {
          defaultLogger.warn(`Retry ${attempt}/${maxRetries} for ${context}`, { error });

          if (options?.onRetry) {
            options.onRetry(attempt, error);
          }

          // Exponential backoff
          const delay = retryDelayMs * Math.pow(2, attempt - 1);
          await this.sleep(delay);
        }
      }
    }

    throw lastError;
  }

  /**
   * Normalize any error to RemotionAgentError
   */
  private normalizeError(error: unknown, context?: string): RemotionAgentError {
    if (error instanceof RemotionAgentError) {
      return error;
    }

    if (error instanceof Error) {
      return new RemotionAgentError(
        error.message,
        'UNKNOWN_ERROR',
        false,
        undefined,
        { originalError: error.name, stack: error.stack, context }
      );
    }

    return new RemotionAgentError(
      String(error),
      'UNKNOWN_ERROR',
      false,
      undefined,
      { originalError: error, context }
    );
  }

  /**
   * Get recovery strategy based on error type
   */
  private getRecoveryStrategy(error: RemotionAgentError): RecoveryStrategy {
    // Audio analysis errors - can retry with different parameters
    if (error instanceof AudioAnalysisError) {
      return {
        canRecover: true,
        retryCount: 2,
        retryDelayMs: 500
      };
    }

    // Invalid audio - cannot recover
    if (error instanceof InvalidAudioError) {
      return { canRecover: false };
    }

    // Composition errors - can retry
    if (error instanceof CompositionError) {
      return {
        canRecover: true,
        retryCount: 2,
        retryDelayMs: 1000
      };
    }

    // Template not found - cannot recover
    if (error instanceof TemplateNotFoundError) {
      return { canRecover: false };
    }

    // Rendering errors - can retry with lower quality
    if (error instanceof RenderingError) {
      return {
        canRecover: true,
        retryCount: 2,
        retryDelayMs: 2000,
        fallback: { qualityPreset: 'fast' }
      };
    }

    // Render timeout - can retry with lower quality
    if (error instanceof RenderTimeoutError) {
      return {
        canRecover: true,
        retryCount: 1,
        retryDelayMs: 5000,
        fallback: { qualityPreset: 'fast', reduceDuration: true }
      };
    }

    // Out of memory - can retry with chunked processing
    if (error instanceof OutOfMemoryError) {
      return {
        canRecover: true,
        retryCount: 1,
        retryDelayMs: 3000,
        fallback: { useChunkedProcessing: true }
      };
    }

    // Disk space - cannot recover automatically
    if (error instanceof DiskSpaceError) {
      return { canRecover: false };
    }

    // Validation errors - can retry with adjustments
    if (error instanceof ValidationError) {
      return {
        canRecover: true,
        retryCount: 1,
        retryDelayMs: 1000
      };
    }

    // Convergence errors - report but continue
    if (error instanceof ConvergenceError) {
      return {
        canRecover: true,
        fallback: { acceptPartialConvergence: true }
      };
    }

    // Magnus integration errors - can retry
    if (error instanceof MagnusIntegrationError) {
      return {
        canRecover: true,
        retryCount: 3,
        retryDelayMs: 2000
      };
    }

    // Default strategy
    return {
      canRecover: error.recoverable,
      retryCount: error.recoverable ? 1 : 0,
      retryDelayMs: 1000
    };
  }

  /**
   * Sleep for specified milliseconds
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export singleton instance
export const errorHandler = new ErrorHandler();

// Export helper function for wrapping async operations
export async function withErrorHandling<T>(
  operation: () => Promise<T>,
  context: string,
  fallback?: T
): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    const strategy = await errorHandler.handleError(error, context);

    if (strategy.canRecover && fallback !== undefined) {
      defaultLogger.warn(`Using fallback for ${context}`);
      return fallback;
    }

    throw error;
  }
}

export default errorHandler;
