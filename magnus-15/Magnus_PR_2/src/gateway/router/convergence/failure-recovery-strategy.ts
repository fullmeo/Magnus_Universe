/**
 * Failure Recovery Strategy - Magnus 15 PR #2
 *
 * Implements intelligent failure recovery with multiple strategies:
 * - IMMEDIATE: Instant rollback to last checkpoint
 * - DECOMPOSE: Break failed operation into smaller steps
 * - PROGRESSIVE: Gradual recovery with validation at each step
 *
 * Integrates with:
 * - SessionRollbackEngine
 * - CheckpointManager
 * - MagnusPatternEngine (PR #1)
 *
 * @module failure-recovery-strategy
 * @version 2.0.0
 */

import { CheckpointManager, Checkpoint, CheckpointType } from './checkpoint-manager';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Failure types for categorization
 */
export enum FailureType {
  PATTERN_DETECTION_ERROR = 'PATTERN_DETECTION_ERROR',
  SCORING_CALCULATION_ERROR = 'SCORING_CALCULATION_ERROR',
  THERAPEUTIC_LOOP_ERROR = 'THERAPEUTIC_LOOP_ERROR',
  STATE_CORRUPTION = 'STATE_CORRUPTION',
  TIMEOUT = 'TIMEOUT',
  EXTERNAL_SERVICE_ERROR = 'EXTERNAL_SERVICE_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  UNKNOWN = 'UNKNOWN'
}

/**
 * Recovery strategy types
 */
export type RecoveryStrategyType = 'IMMEDIATE' | 'DECOMPOSE' | 'PROGRESSIVE';

/**
 * Failure context information
 */
export interface FailureContext {
  type: FailureType;
  error: Error;
  timestamp: number;
  operation: string;
  metadata: Record<string, unknown>;
  stackTrace?: string;
  affectedComponents: string[];
}

/**
 * Recovery result
 */
export interface RecoveryResult {
  success: boolean;
  method: RecoveryMethod;
  stepsRecovered: number;
  totalSteps: number;
  finalCheckpoint: Checkpoint | null;
  recoveryDuration: number;
  retryAttempts: number;
  details: RecoveryDetails;
}

/**
 * Recovery method used
 */
export type RecoveryMethod =
  | 'IMMEDIATE_ROLLBACK'
  | 'DECOMPOSED_RETRY'
  | 'PROGRESSIVE_RECOVERY'
  | 'PARTIAL_RECOVERY'
  | 'MANUAL_INTERVENTION_REQUIRED';

/**
 * Recovery details
 */
export interface RecoveryDetails {
  startTimestamp: number;
  endTimestamp: number;
  checkpointsExamined: number;
  stepsExecuted: RecoveryStep[];
  warnings: string[];
  recommendations: string[];
}

/**
 * Recovery step information
 */
export interface RecoveryStep {
  stepId: string;
  name: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'COMPLETED' | 'FAILED' | 'SKIPPED';
  startTime: number;
  endTime?: number;
  result?: unknown;
  error?: string;
}

/**
 * Decomposed operation
 */
export interface DecomposedOperation {
  id: string;
  name: string;
  priority: number;
  dependencies: string[];
  execute: () => Promise<void>;
  rollback: () => Promise<void>;
  validate: () => Promise<boolean>;
}

/**
 * Recovery strategy configuration
 */
export interface RecoveryStrategyConfig {
  strategy: RecoveryStrategyType;
  maxRetryAttempts: number;
  retryDelayMs: number;
  backoffMultiplier: number;
  maxBackoffMs: number;
  enableDecomposition: boolean;
  validateAfterRecovery: boolean;
}

// ============================================================================
// Failure Recovery Strategy Implementation
// ============================================================================

/**
 * Failure Recovery Strategy
 *
 * Implements multiple recovery strategies for handling failures
 * during convergence-aware routing operations.
 */
export class FailureRecoveryStrategy {
  private config: RecoveryStrategyConfig;
  private recoveryHistory: RecoveryResult[] = [];

  constructor(config: Partial<RecoveryStrategyConfig> = {}) {
    this.config = this.mergeWithDefaults(config);
  }

  /**
   * Merge configuration with defaults
   */
  private mergeWithDefaults(config: Partial<RecoveryStrategyConfig>): RecoveryStrategyConfig {
    return {
      strategy: config.strategy ?? 'DECOMPOSE',
      maxRetryAttempts: config.maxRetryAttempts ?? 3,
      retryDelayMs: config.retryDelayMs ?? 1000,
      backoffMultiplier: config.backoffMultiplier ?? 2,
      maxBackoffMs: config.maxBackoffMs ?? 30000,
      enableDecomposition: config.enableDecomposition ?? true,
      validateAfterRecovery: config.validateAfterRecovery ?? true
    };
  }

  // ==========================================================================
  // Main Recovery Entry Point
  // ==========================================================================

  /**
   * Recover from failure using configured strategy
   */
  async recover(
    context: FailureContext,
    checkpointManager: CheckpointManager,
    rollbackEngine: { rollbackToCheckpoint: (id: string) => Promise<{ success: boolean }> }
  ): Promise<RecoveryResult> {
    const startTime = Date.now();
    const steps: RecoveryStep[] = [];

    try {
      let result: RecoveryResult;

      switch (this.config.strategy) {
        case 'IMMEDIATE':
          result = await this.immediateRecovery(context, checkpointManager, rollbackEngine, steps);
          break;
        case 'DECOMPOSE':
          result = await this.decomposeRecovery(context, checkpointManager, rollbackEngine, steps);
          break;
        case 'PROGRESSIVE':
          result = await this.progressiveRecovery(context, checkpointManager, rollbackEngine, steps);
          break;
        default:
          result = await this.immediateRecovery(context, checkpointManager, rollbackEngine, steps);
      }

      result.recoveryDuration = Date.now() - startTime;
      result.details.stepsExecuted = steps;

      this.recoveryHistory.push(result);
      return result;

    } catch (error) {
      return this.createFailedResult(context, steps, startTime, error as Error);
    }
  }

  // ==========================================================================
  // Immediate Recovery Strategy
  // ==========================================================================

  /**
   * Immediate rollback to the most recent valid checkpoint
   */
  private async immediateRecovery(
    context: FailureContext,
    checkpointManager: CheckpointManager,
    rollbackEngine: { rollbackToCheckpoint: (id: string) => Promise<{ success: boolean }> },
    steps: RecoveryStep[]
  ): Promise<RecoveryResult> {
    const step = this.createStep('immediate-rollback', 'Immediate Rollback to Last Checkpoint');
    steps.push(step);

    try {
      step.status = 'IN_PROGRESS';

      // Find the best checkpoint to roll back to
      const checkpoint = await this.findBestCheckpoint(context, checkpointManager);

      if (!checkpoint) {
        step.status = 'FAILED';
        step.error = 'No valid checkpoint found';
        return this.createResult(false, 'MANUAL_INTERVENTION_REQUIRED', checkpoint, steps, 1, 0);
      }

      // Perform rollback
      const rollbackResult = await rollbackEngine.rollbackToCheckpoint(checkpoint.id);

      if (rollbackResult.success) {
        step.status = 'COMPLETED';
        step.endTime = Date.now();
        return this.createResult(true, 'IMMEDIATE_ROLLBACK', checkpoint, steps, 1, 1);
      } else {
        step.status = 'FAILED';
        step.error = 'Rollback operation failed';
        return this.createResult(false, 'MANUAL_INTERVENTION_REQUIRED', checkpoint, steps, 1, 0);
      }

    } catch (error) {
      step.status = 'FAILED';
      step.error = (error as Error).message;
      step.endTime = Date.now();
      return this.createResult(false, 'MANUAL_INTERVENTION_REQUIRED', null, steps, 1, 0);
    }
  }

  // ==========================================================================
  // Decompose Recovery Strategy
  // ==========================================================================

  /**
   * Decompose failed operation and retry individual components
   */
  private async decomposeRecovery(
    context: FailureContext,
    checkpointManager: CheckpointManager,
    rollbackEngine: { rollbackToCheckpoint: (id: string) => Promise<{ success: boolean }> },
    steps: RecoveryStep[]
  ): Promise<RecoveryResult> {
    // Step 1: Analyze failure
    const analyzeStep = this.createStep('analyze-failure', 'Analyze Failure Context');
    steps.push(analyzeStep);
    analyzeStep.status = 'IN_PROGRESS';

    const decomposedOps = this.decomposeFailedOperation(context);
    analyzeStep.status = 'COMPLETED';
    analyzeStep.endTime = Date.now();
    analyzeStep.result = { decomposedOperations: decomposedOps.length };

    // Step 2: Find safe rollback point
    const checkpointStep = this.createStep('find-checkpoint', 'Find Safe Rollback Point');
    steps.push(checkpointStep);
    checkpointStep.status = 'IN_PROGRESS';

    const safeCheckpoint = await this.findSafeRollbackPoint(context, checkpointManager);

    if (!safeCheckpoint) {
      checkpointStep.status = 'FAILED';
      checkpointStep.error = 'No safe rollback point found';
      return this.createResult(false, 'MANUAL_INTERVENTION_REQUIRED', null, steps, decomposedOps.length, 0);
    }

    checkpointStep.status = 'COMPLETED';
    checkpointStep.endTime = Date.now();

    // Step 3: Rollback to safe point
    const rollbackStep = this.createStep('partial-rollback', 'Rollback to Safe Point');
    steps.push(rollbackStep);
    rollbackStep.status = 'IN_PROGRESS';

    const rollbackResult = await rollbackEngine.rollbackToCheckpoint(safeCheckpoint.id);

    if (!rollbackResult.success) {
      rollbackStep.status = 'FAILED';
      rollbackStep.error = 'Failed to rollback to safe point';
      return this.createResult(false, 'MANUAL_INTERVENTION_REQUIRED', safeCheckpoint, steps, decomposedOps.length, 1);
    }

    rollbackStep.status = 'COMPLETED';
    rollbackStep.endTime = Date.now();

    // Step 4: Retry decomposed operations
    let successfulOps = 0;
    for (const op of decomposedOps) {
      const opStep = this.createStep(`retry-${op.id}`, `Retry: ${op.name}`);
      steps.push(opStep);
      opStep.status = 'IN_PROGRESS';

      try {
        await this.retryWithBackoff(async () => {
          await op.execute();
          const isValid = await op.validate();
          if (!isValid) {
            throw new Error('Validation failed after retry');
          }
        });

        opStep.status = 'COMPLETED';
        opStep.endTime = Date.now();
        successfulOps++;

      } catch (error) {
        opStep.status = 'FAILED';
        opStep.error = (error as Error).message;
        opStep.endTime = Date.now();

        // Try to rollback this specific operation
        try {
          await op.rollback();
        } catch (rollbackError) {
          // Log but continue
          opStep.error += ` (rollback also failed: ${(rollbackError as Error).message})`;
        }
      }
    }

    const allSucceeded = successfulOps === decomposedOps.length;
    return this.createResult(
      allSucceeded,
      allSucceeded ? 'DECOMPOSED_RETRY' : 'PARTIAL_RECOVERY',
      safeCheckpoint,
      steps,
      decomposedOps.length,
      successfulOps
    );
  }

  // ==========================================================================
  // Progressive Recovery Strategy
  // ==========================================================================

  /**
   * Gradually recover with validation at each step
   */
  private async progressiveRecovery(
    context: FailureContext,
    checkpointManager: CheckpointManager,
    rollbackEngine: { rollbackToCheckpoint: (id: string) => Promise<{ success: boolean }> },
    steps: RecoveryStep[]
  ): Promise<RecoveryResult> {
    // Get all checkpoints ordered by recency
    const checkpoints = await this.getOrderedCheckpoints(checkpointManager);

    if (checkpoints.length === 0) {
      const noCheckpointStep = this.createStep('no-checkpoints', 'No Checkpoints Available');
      noCheckpointStep.status = 'FAILED';
      noCheckpointStep.error = 'No checkpoints found for recovery';
      steps.push(noCheckpointStep);
      return this.createResult(false, 'MANUAL_INTERVENTION_REQUIRED', null, steps, 0, 0);
    }

    // Try each checkpoint progressively
    for (let i = 0; i < checkpoints.length; i++) {
      const checkpoint = checkpoints[i];
      const attemptStep = this.createStep(
        `progressive-attempt-${i}`,
        `Progressive Recovery Attempt ${i + 1}/${checkpoints.length}`
      );
      steps.push(attemptStep);
      attemptStep.status = 'IN_PROGRESS';

      try {
        // Rollback to this checkpoint
        const rollbackResult = await rollbackEngine.rollbackToCheckpoint(checkpoint.id);

        if (!rollbackResult.success) {
          attemptStep.status = 'FAILED';
          attemptStep.error = 'Rollback failed';
          attemptStep.endTime = Date.now();
          continue; // Try next checkpoint
        }

        // Validate the restored state
        if (this.config.validateAfterRecovery) {
          const isValid = await this.validateRecoveredState(checkpoint);
          if (!isValid) {
            attemptStep.status = 'FAILED';
            attemptStep.error = 'State validation failed';
            attemptStep.endTime = Date.now();
            continue; // Try next checkpoint
          }
        }

        // Success!
        attemptStep.status = 'COMPLETED';
        attemptStep.endTime = Date.now();
        return this.createResult(true, 'PROGRESSIVE_RECOVERY', checkpoint, steps, checkpoints.length, i + 1);

      } catch (error) {
        attemptStep.status = 'FAILED';
        attemptStep.error = (error as Error).message;
        attemptStep.endTime = Date.now();
        // Continue to next checkpoint
      }
    }

    // All attempts failed
    return this.createResult(false, 'MANUAL_INTERVENTION_REQUIRED', null, steps, checkpoints.length, 0);
  }

  // ==========================================================================
  // Helper Methods
  // ==========================================================================

  /**
   * Find the best checkpoint for recovery
   */
  private async findBestCheckpoint(
    context: FailureContext,
    checkpointManager: CheckpointManager
  ): Promise<Checkpoint | null> {
    // Strategy: Find checkpoint before the failure that is of appropriate type
    const preferredTypes = this.getPreferredCheckpointTypes(context.type);

    for (const type of preferredTypes) {
      const checkpoint = await checkpointManager.findCheckpointByType(type);
      if (checkpoint && checkpoint.timestamp < context.timestamp) {
        return checkpoint;
      }
    }

    // Fallback to latest checkpoint before failure
    return checkpointManager.getLatestCheckpoint();
  }

  /**
   * Find safe rollback point for decompose strategy
   */
  private async findSafeRollbackPoint(
    context: FailureContext,
    checkpointManager: CheckpointManager
  ): Promise<Checkpoint | null> {
    // For decompose strategy, prefer checkpoints that are stable milestones
    const safeTypes = [
      CheckpointType.PATTERN_MILESTONE,
      CheckpointType.SCORING_DECISION,
      CheckpointType.SESSION_START
    ];

    for (const type of safeTypes) {
      const checkpoint = await checkpointManager.findCheckpointByType(type);
      if (checkpoint && checkpoint.timestamp < context.timestamp) {
        return checkpoint;
      }
    }

    return checkpointManager.getLatestCheckpoint();
  }

  /**
   * Get ordered checkpoints for progressive recovery
   */
  private async getOrderedCheckpoints(
    checkpointManager: CheckpointManager
  ): Promise<Checkpoint[]> {
    const stats = checkpointManager.getStats();
    const checkpoints: Checkpoint[] = [];

    // Query all checkpoints, sorted by timestamp descending (most recent first)
    const allCheckpoints = await checkpointManager.queryCheckpoints({
      sortOrder: 'DESC',
      limit: this.config.maxRetryAttempts * 2
    });

    return allCheckpoints;
  }

  /**
   * Get preferred checkpoint types based on failure type
   */
  private getPreferredCheckpointTypes(failureType: FailureType): CheckpointType[] {
    switch (failureType) {
      case FailureType.PATTERN_DETECTION_ERROR:
        return [CheckpointType.PATTERN_MILESTONE, CheckpointType.SESSION_START];
      case FailureType.SCORING_CALCULATION_ERROR:
        return [CheckpointType.SCORING_DECISION, CheckpointType.PATTERN_MILESTONE];
      case FailureType.THERAPEUTIC_LOOP_ERROR:
        return [CheckpointType.THERAPEUTIC_PHASE, CheckpointType.SCORING_DECISION];
      case FailureType.STATE_CORRUPTION:
        return [CheckpointType.SESSION_START, CheckpointType.RECOVERY_POINT];
      default:
        return [CheckpointType.USER_REQUESTED, CheckpointType.AUTO_PERIODIC, CheckpointType.SESSION_START];
    }
  }

  /**
   * Decompose failed operation into smaller units
   */
  private decomposeFailedOperation(context: FailureContext): DecomposedOperation[] {
    // Based on the operation and affected components, create decomposed steps
    const operations: DecomposedOperation[] = [];

    for (const component of context.affectedComponents) {
      operations.push({
        id: `recover-${component}`,
        name: `Recover ${component}`,
        priority: this.getComponentPriority(component),
        dependencies: this.getComponentDependencies(component),
        execute: async () => {
          // Placeholder - actual implementation would depend on component
          console.log(`Executing recovery for ${component}`);
        },
        rollback: async () => {
          console.log(`Rolling back ${component}`);
        },
        validate: async () => {
          // Placeholder validation
          return true;
        }
      });
    }

    // Sort by priority and dependencies
    return operations.sort((a, b) => a.priority - b.priority);
  }

  /**
   * Get component recovery priority
   */
  private getComponentPriority(component: string): number {
    const priorities: Record<string, number> = {
      'sessionState': 1,
      'patternEngine': 2,
      'scoringEngine': 3,
      'therapeuticLoop': 4,
      'cache': 5
    };
    return priorities[component] ?? 10;
  }

  /**
   * Get component dependencies
   */
  private getComponentDependencies(component: string): string[] {
    const dependencies: Record<string, string[]> = {
      'sessionState': [],
      'patternEngine': ['sessionState'],
      'scoringEngine': ['sessionState', 'patternEngine'],
      'therapeuticLoop': ['scoringEngine'],
      'cache': ['sessionState']
    };
    return dependencies[component] ?? [];
  }

  /**
   * Retry operation with exponential backoff
   */
  private async retryWithBackoff(operation: () => Promise<void>): Promise<void> {
    let lastError: Error | null = null;
    let delay = this.config.retryDelayMs;

    for (let attempt = 1; attempt <= this.config.maxRetryAttempts; attempt++) {
      try {
        await operation();
        return; // Success
      } catch (error) {
        lastError = error as Error;

        if (attempt < this.config.maxRetryAttempts) {
          await this.sleep(delay);
          delay = Math.min(delay * this.config.backoffMultiplier, this.config.maxBackoffMs);
        }
      }
    }

    throw lastError ?? new Error('Retry failed with unknown error');
  }

  /**
   * Validate recovered state
   */
  private async validateRecoveredState(checkpoint: Checkpoint): Promise<boolean> {
    // Validate state integrity
    if (!checkpoint.state) return false;
    if (!checkpoint.state.patternState) return false;
    if (!checkpoint.state.scoringState) return false;
    if (!checkpoint.state.therapeuticState) return false;

    // Validate checkpoint hash (if implemented)
    // const currentHash = this.calculateHash(checkpoint.state);
    // if (currentHash !== checkpoint.hash) return false;

    return true;
  }

  /**
   * Create a recovery step
   */
  private createStep(id: string, name: string): RecoveryStep {
    return {
      stepId: id,
      name,
      status: 'PENDING',
      startTime: Date.now()
    };
  }

  /**
   * Create recovery result
   */
  private createResult(
    success: boolean,
    method: RecoveryMethod,
    checkpoint: Checkpoint | null,
    steps: RecoveryStep[],
    totalSteps: number,
    stepsRecovered: number
  ): RecoveryResult {
    const warnings: string[] = [];
    const recommendations: string[] = [];

    if (!success) {
      recommendations.push('Consider creating manual checkpoint before retrying');
      recommendations.push('Review system logs for additional error details');
    }

    if (stepsRecovered < totalSteps && stepsRecovered > 0) {
      warnings.push(`Only ${stepsRecovered}/${totalSteps} operations recovered successfully`);
      recommendations.push('Review partial recovery state before proceeding');
    }

    return {
      success,
      method,
      stepsRecovered,
      totalSteps,
      finalCheckpoint: checkpoint,
      recoveryDuration: 0, // Will be set by caller
      retryAttempts: steps.filter(s => s.status === 'FAILED').length,
      details: {
        startTimestamp: steps[0]?.startTime ?? Date.now(),
        endTimestamp: Date.now(),
        checkpointsExamined: steps.filter(s => s.name.includes('checkpoint')).length,
        stepsExecuted: steps,
        warnings,
        recommendations
      }
    };
  }

  /**
   * Create failed result
   */
  private createFailedResult(
    context: FailureContext,
    steps: RecoveryStep[],
    startTime: number,
    error: Error
  ): RecoveryResult {
    return {
      success: false,
      method: 'MANUAL_INTERVENTION_REQUIRED',
      stepsRecovered: 0,
      totalSteps: steps.length,
      finalCheckpoint: null,
      recoveryDuration: Date.now() - startTime,
      retryAttempts: steps.filter(s => s.status === 'FAILED').length,
      details: {
        startTimestamp: startTime,
        endTimestamp: Date.now(),
        checkpointsExamined: 0,
        stepsExecuted: steps,
        warnings: [`Recovery failed: ${error.message}`],
        recommendations: [
          'Manual intervention required',
          'Check system logs for root cause',
          'Consider restarting session from clean state'
        ]
      }
    };
  }

  /**
   * Sleep for specified duration
   */
  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  // ==========================================================================
  // Recovery History
  // ==========================================================================

  /**
   * Get recovery history
   */
  getRecoveryHistory(): RecoveryResult[] {
    return [...this.recoveryHistory];
  }

  /**
   * Clear recovery history
   */
  clearRecoveryHistory(): void {
    this.recoveryHistory = [];
  }

  /**
   * Get recovery statistics
   */
  getRecoveryStats(): RecoveryStats {
    const total = this.recoveryHistory.length;
    const successful = this.recoveryHistory.filter(r => r.success).length;
    const methodCounts = new Map<RecoveryMethod, number>();

    for (const result of this.recoveryHistory) {
      const count = methodCounts.get(result.method) ?? 0;
      methodCounts.set(result.method, count + 1);
    }

    const avgDuration = total > 0
      ? this.recoveryHistory.reduce((sum, r) => sum + r.recoveryDuration, 0) / total
      : 0;

    return {
      totalRecoveries: total,
      successfulRecoveries: successful,
      failedRecoveries: total - successful,
      successRate: total > 0 ? (successful / total) * 100 : 0,
      averageDurationMs: avgDuration,
      methodBreakdown: methodCounts
    };
  }
}

/**
 * Recovery statistics
 */
export interface RecoveryStats {
  totalRecoveries: number;
  successfulRecoveries: number;
  failedRecoveries: number;
  successRate: number;
  averageDurationMs: number;
  methodBreakdown: Map<RecoveryMethod, number>;
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a new Failure Recovery Strategy instance
 */
export function createFailureRecoveryStrategy(
  config?: Partial<RecoveryStrategyConfig>
): FailureRecoveryStrategy {
  return new FailureRecoveryStrategy(config);
}

export default FailureRecoveryStrategy;
