/**
 * Session Rollback Engine - Magnus 15 PR #2
 *
 * Provides checkpoint-based session state management with atomic rollback
 * capabilities for fault-tolerant convergence-aware routing.
 *
 * Integrates with:
 * - SessionContext (PR #1)
 * - MagnusPatternEngine (PR #1)
 * - ConvergenceScorer (PR #1)
 *
 * @module session-rollback-engine
 * @version 2.0.0
 */

import { CheckpointManager, Checkpoint, CheckpointType } from './checkpoint-manager';
import { FailureRecoveryStrategy, RecoveryResult, FailureContext } from './failure-recovery-strategy';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Session state snapshot for rollback purposes
 */
export interface SessionState {
  sessionId: string;
  timestamp: number;
  patternState: PatternState;
  scoringState: ScoringState;
  therapeuticState: TherapeuticState;
  metadata: SessionMetadata;
}

/**
 * Pattern detection state at checkpoint
 */
export interface PatternState {
  detectedPatterns: DetectedPattern[];
  patternScores: Map<string, number>;
  antiPatternCount: number;
  positivePatternCount: number;
  lastAnalysisTimestamp: number;
}

/**
 * Detected pattern information
 */
export interface DetectedPattern {
  id: string;
  name: string;
  type: 'positive' | 'anti' | 'neutral';
  confidence: number;
  location?: CodeLocation;
  timestamp: number;
}

/**
 * Code location for pattern detection
 */
export interface CodeLocation {
  file: string;
  startLine: number;
  endLine: number;
  snippet?: string;
}

/**
 * Scoring state at checkpoint
 */
export interface ScoringState {
  currentScores: ModelScore[];
  weightConfiguration: WeightConfig;
  convergenceLevel: number;
  routingDecisions: RoutingDecision[];
}

/**
 * Model score information
 */
export interface ModelScore {
  modelId: string;
  totalScore: number;
  breakdown: ScoreBreakdown;
  timestamp: number;
}

/**
 * Score breakdown by category
 */
export interface ScoreBreakdown {
  convergence: number;
  latency: number;
  cost: number;
  patternMatch: number;
}

/**
 * Weight configuration for scoring
 */
export interface WeightConfig {
  convergence: number;
  latency: number;
  cost: number;
  patternMatch: number;
}

/**
 * Routing decision record
 */
export interface RoutingDecision {
  decisionId: string;
  selectedModel: string;
  reason: string;
  scores: ModelScore[];
  timestamp: number;
}

/**
 * Therapeutic loop state at checkpoint
 */
export interface TherapeuticState {
  currentPhase: TherapeuticPhase;
  iterationCount: number;
  opusFindings: OpusFinding[];
  resolutionProgress: number;
  lastTherapeuticAction: string;
}

/**
 * Therapeutic phases
 */
export type TherapeuticPhase =
  | 'INITIAL_ASSESSMENT'
  | 'PATTERN_ANALYSIS'
  | 'OPUS_CONSULTATION'
  | 'RESOLUTION_PLANNING'
  | 'IMPLEMENTATION'
  | 'VERIFICATION'
  | 'COMPLETE';

/**
 * Opus finding from therapeutic loop
 */
export interface OpusFinding {
  findingId: string;
  category: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  recommendation: string;
  resolved: boolean;
  timestamp: number;
}

/**
 * Session metadata
 */
export interface SessionMetadata {
  userId?: string;
  projectId?: string;
  environment: string;
  version: string;
  tags: string[];
}

/**
 * Rollback options
 */
export interface RollbackOptions {
  preserveAuditLog: boolean;
  notifyObservers: boolean;
  validateStateAfterRollback: boolean;
  maxRetryAttempts: number;
}

/**
 * Rollback result
 */
export interface RollbackResult {
  success: boolean;
  rolledBackTo: Checkpoint | null;
  stateRestored: boolean;
  auditEntry: AuditEntry;
  error?: Error;
}

/**
 * Audit log entry
 */
export interface AuditEntry {
  entryId: string;
  action: 'CHECKPOINT_CREATED' | 'ROLLBACK_INITIATED' | 'ROLLBACK_COMPLETED' | 'RECOVERY_ATTEMPTED' | 'STATE_RESTORED';
  timestamp: number;
  sessionId: string;
  details: Record<string, unknown>;
  outcome: 'SUCCESS' | 'FAILURE' | 'PARTIAL';
}

/**
 * Session rollback engine configuration
 */
export interface RollbackEngineConfig {
  maxCheckpoints: number;
  checkpointRetentionMs: number;
  autoCheckpointOnPatternDetection: boolean;
  autoCheckpointOnScoringDecision: boolean;
  autoCheckpointOnTherapeuticPhase: boolean;
  enableAuditLogging: boolean;
  recoveryStrategy: 'IMMEDIATE' | 'DECOMPOSE' | 'PROGRESSIVE';
}

// ============================================================================
// Session Rollback Engine Implementation
// ============================================================================

/**
 * Session Rollback Engine
 *
 * Manages session state with checkpoint-based rollback capabilities.
 * Provides fault-tolerant convergence-aware routing through atomic
 * state snapshots and recovery mechanisms.
 */
export class SessionRollbackEngine {
  private checkpointManager: CheckpointManager;
  private recoveryStrategy: FailureRecoveryStrategy;
  private config: RollbackEngineConfig;
  private currentState: SessionState | null = null;
  private auditLog: AuditEntry[] = [];
  private observers: Set<SessionObserver> = new Set();
  private isRollingBack: boolean = false;

  constructor(config: Partial<RollbackEngineConfig> = {}) {
    this.config = this.mergeWithDefaults(config);
    this.checkpointManager = new CheckpointManager({
      maxCheckpoints: this.config.maxCheckpoints,
      retentionMs: this.config.checkpointRetentionMs
    });
    this.recoveryStrategy = new FailureRecoveryStrategy({
      strategy: this.config.recoveryStrategy
    });
  }

  /**
   * Merge configuration with defaults
   */
  private mergeWithDefaults(config: Partial<RollbackEngineConfig>): RollbackEngineConfig {
    return {
      maxCheckpoints: config.maxCheckpoints ?? 10,
      checkpointRetentionMs: config.checkpointRetentionMs ?? 3600000, // 1 hour
      autoCheckpointOnPatternDetection: config.autoCheckpointOnPatternDetection ?? true,
      autoCheckpointOnScoringDecision: config.autoCheckpointOnScoringDecision ?? true,
      autoCheckpointOnTherapeuticPhase: config.autoCheckpointOnTherapeuticPhase ?? true,
      enableAuditLogging: config.enableAuditLogging ?? true,
      recoveryStrategy: config.recoveryStrategy ?? 'DECOMPOSE'
    };
  }

  // ==========================================================================
  // Session Initialization
  // ==========================================================================

  /**
   * Initialize a new session with initial state
   */
  async initializeSession(
    sessionId: string,
    metadata: SessionMetadata
  ): Promise<SessionState> {
    const initialState: SessionState = {
      sessionId,
      timestamp: Date.now(),
      patternState: {
        detectedPatterns: [],
        patternScores: new Map(),
        antiPatternCount: 0,
        positivePatternCount: 0,
        lastAnalysisTimestamp: Date.now()
      },
      scoringState: {
        currentScores: [],
        weightConfiguration: {
          convergence: 0.45,
          latency: 0.25,
          cost: 0.20,
          patternMatch: 0.10
        },
        convergenceLevel: 0,
        routingDecisions: []
      },
      therapeuticState: {
        currentPhase: 'INITIAL_ASSESSMENT',
        iterationCount: 0,
        opusFindings: [],
        resolutionProgress: 0,
        lastTherapeuticAction: 'Session initialized'
      },
      metadata
    };

    this.currentState = initialState;

    // Create initial checkpoint
    await this.createCheckpoint(
      CheckpointType.SESSION_START,
      'Session initialized'
    );

    this.logAudit({
      action: 'CHECKPOINT_CREATED',
      sessionId,
      details: { type: 'SESSION_START', metadata },
      outcome: 'SUCCESS'
    });

    return initialState;
  }

  // ==========================================================================
  // Checkpoint Management
  // ==========================================================================

  /**
   * Create a checkpoint of current session state
   */
  async createCheckpoint(
    type: CheckpointType,
    description: string
  ): Promise<Checkpoint> {
    if (!this.currentState) {
      throw new Error('No active session to checkpoint');
    }

    const checkpoint = await this.checkpointManager.createCheckpoint(
      this.currentState,
      type,
      description
    );

    this.logAudit({
      action: 'CHECKPOINT_CREATED',
      sessionId: this.currentState.sessionId,
      details: {
        checkpointId: checkpoint.id,
        type,
        description
      },
      outcome: 'SUCCESS'
    });

    this.notifyObservers('checkpointCreated', checkpoint);

    return checkpoint;
  }

  /**
   * Auto-checkpoint on pattern detection (if enabled)
   */
  async onPatternDetected(patterns: DetectedPattern[]): Promise<void> {
    if (!this.config.autoCheckpointOnPatternDetection || !this.currentState) {
      return;
    }

    // Update current state
    this.currentState.patternState.detectedPatterns.push(...patterns);
    this.currentState.patternState.lastAnalysisTimestamp = Date.now();

    const antiPatterns = patterns.filter(p => p.type === 'anti');
    const positivePatterns = patterns.filter(p => p.type === 'positive');

    this.currentState.patternState.antiPatternCount += antiPatterns.length;
    this.currentState.patternState.positivePatternCount += positivePatterns.length;

    // Create checkpoint if significant patterns detected
    if (antiPatterns.length > 0 || positivePatterns.length >= 3) {
      await this.createCheckpoint(
        CheckpointType.PATTERN_MILESTONE,
        `Detected ${patterns.length} patterns (${antiPatterns.length} anti, ${positivePatterns.length} positive)`
      );
    }
  }

  /**
   * Auto-checkpoint on scoring decision (if enabled)
   */
  async onScoringDecision(decision: RoutingDecision): Promise<void> {
    if (!this.config.autoCheckpointOnScoringDecision || !this.currentState) {
      return;
    }

    // Update current state
    this.currentState.scoringState.routingDecisions.push(decision);
    this.currentState.scoringState.currentScores = decision.scores;
    this.currentState.timestamp = Date.now();

    // Create checkpoint for significant routing decisions
    await this.createCheckpoint(
      CheckpointType.SCORING_DECISION,
      `Routing decision: selected ${decision.selectedModel}`
    );
  }

  /**
   * Auto-checkpoint on therapeutic phase change (if enabled)
   */
  async onTherapeuticPhaseChange(
    newPhase: TherapeuticPhase,
    findings?: OpusFinding[]
  ): Promise<void> {
    if (!this.config.autoCheckpointOnTherapeuticPhase || !this.currentState) {
      return;
    }

    const previousPhase = this.currentState.therapeuticState.currentPhase;

    // Update current state
    this.currentState.therapeuticState.currentPhase = newPhase;
    this.currentState.therapeuticState.iterationCount++;
    this.currentState.therapeuticState.lastTherapeuticAction = `Phase transition: ${previousPhase} -> ${newPhase}`;

    if (findings) {
      this.currentState.therapeuticState.opusFindings.push(...findings);
    }

    // Create checkpoint for phase transitions
    await this.createCheckpoint(
      CheckpointType.THERAPEUTIC_PHASE,
      `Therapeutic phase: ${previousPhase} -> ${newPhase}`
    );
  }

  // ==========================================================================
  // Rollback Operations
  // ==========================================================================

  /**
   * Rollback to a specific checkpoint
   */
  async rollbackToCheckpoint(
    checkpointId: string,
    options: Partial<RollbackOptions> = {}
  ): Promise<RollbackResult> {
    const rollbackOptions = this.mergeRollbackOptions(options);

    if (this.isRollingBack) {
      return this.createRollbackResult(false, null, 'Rollback already in progress');
    }

    this.isRollingBack = true;

    try {
      this.logAudit({
        action: 'ROLLBACK_INITIATED',
        sessionId: this.currentState?.sessionId ?? 'unknown',
        details: { checkpointId, options: rollbackOptions },
        outcome: 'SUCCESS'
      });

      const checkpoint = await this.checkpointManager.getCheckpoint(checkpointId);

      if (!checkpoint) {
        return this.createRollbackResult(false, null, `Checkpoint ${checkpointId} not found`);
      }

      // Restore state from checkpoint
      this.currentState = this.deepClone(checkpoint.state);
      this.currentState.timestamp = Date.now();

      // Validate state if required
      if (rollbackOptions.validateStateAfterRollback) {
        const isValid = await this.validateRestoredState();
        if (!isValid) {
          return this.createRollbackResult(false, checkpoint, 'State validation failed after rollback');
        }
      }

      // Notify observers if required
      if (rollbackOptions.notifyObservers) {
        this.notifyObservers('rollbackCompleted', checkpoint);
      }

      this.logAudit({
        action: 'ROLLBACK_COMPLETED',
        sessionId: this.currentState.sessionId,
        details: {
          checkpointId,
          restoredTimestamp: checkpoint.timestamp
        },
        outcome: 'SUCCESS'
      });

      return this.createRollbackResult(true, checkpoint);

    } catch (error) {
      this.logAudit({
        action: 'ROLLBACK_COMPLETED',
        sessionId: this.currentState?.sessionId ?? 'unknown',
        details: { checkpointId, error: (error as Error).message },
        outcome: 'FAILURE'
      });

      return this.createRollbackResult(false, null, (error as Error).message);

    } finally {
      this.isRollingBack = false;
    }
  }

  /**
   * Rollback to the most recent checkpoint
   */
  async rollbackToLatest(
    options: Partial<RollbackOptions> = {}
  ): Promise<RollbackResult> {
    const latestCheckpoint = await this.checkpointManager.getLatestCheckpoint();

    if (!latestCheckpoint) {
      return this.createRollbackResult(false, null, 'No checkpoints available');
    }

    return this.rollbackToCheckpoint(latestCheckpoint.id, options);
  }

  /**
   * Rollback to the nearest checkpoint of a specific type
   */
  async rollbackToType(
    type: CheckpointType,
    options: Partial<RollbackOptions> = {}
  ): Promise<RollbackResult> {
    const checkpoint = await this.checkpointManager.findCheckpointByType(type);

    if (!checkpoint) {
      return this.createRollbackResult(false, null, `No checkpoint of type ${type} found`);
    }

    return this.rollbackToCheckpoint(checkpoint.id, options);
  }

  // ==========================================================================
  // Failure Recovery
  // ==========================================================================

  /**
   * Handle failure with automatic recovery
   */
  async handleFailure(context: FailureContext): Promise<RecoveryResult> {
    this.logAudit({
      action: 'RECOVERY_ATTEMPTED',
      sessionId: this.currentState?.sessionId ?? 'unknown',
      details: {
        failureType: context.type,
        failureMessage: context.error.message
      },
      outcome: 'SUCCESS'
    });

    const recoveryResult = await this.recoveryStrategy.recover(
      context,
      this.checkpointManager,
      this
    );

    if (recoveryResult.success) {
      this.logAudit({
        action: 'STATE_RESTORED',
        sessionId: this.currentState?.sessionId ?? 'unknown',
        details: {
          recoveryMethod: recoveryResult.method,
          stepsRecovered: recoveryResult.stepsRecovered
        },
        outcome: 'SUCCESS'
      });
    }

    return recoveryResult;
  }

  // ==========================================================================
  // State Access
  // ==========================================================================

  /**
   * Get current session state
   */
  getCurrentState(): SessionState | null {
    return this.currentState ? this.deepClone(this.currentState) : null;
  }

  /**
   * Get all checkpoints for current session
   */
  async getCheckpoints(): Promise<Checkpoint[]> {
    if (!this.currentState) {
      return [];
    }
    return this.checkpointManager.getCheckpointsForSession(this.currentState.sessionId);
  }

  /**
   * Get audit log
   */
  getAuditLog(): AuditEntry[] {
    return [...this.auditLog];
  }

  // ==========================================================================
  // Observer Pattern
  // ==========================================================================

  /**
   * Add session observer
   */
  addObserver(observer: SessionObserver): void {
    this.observers.add(observer);
  }

  /**
   * Remove session observer
   */
  removeObserver(observer: SessionObserver): void {
    this.observers.delete(observer);
  }

  /**
   * Notify all observers
   */
  private notifyObservers(event: string, data: unknown): void {
    for (const observer of this.observers) {
      try {
        observer.onSessionEvent(event, data);
      } catch (error) {
        console.error(`Observer notification failed: ${(error as Error).message}`);
      }
    }
  }

  // ==========================================================================
  // Helper Methods
  // ==========================================================================

  /**
   * Merge rollback options with defaults
   */
  private mergeRollbackOptions(options: Partial<RollbackOptions>): RollbackOptions {
    return {
      preserveAuditLog: options.preserveAuditLog ?? true,
      notifyObservers: options.notifyObservers ?? true,
      validateStateAfterRollback: options.validateStateAfterRollback ?? true,
      maxRetryAttempts: options.maxRetryAttempts ?? 3
    };
  }

  /**
   * Create rollback result
   */
  private createRollbackResult(
    success: boolean,
    checkpoint: Checkpoint | null,
    errorMessage?: string
  ): RollbackResult {
    const auditEntry: AuditEntry = {
      entryId: this.generateId(),
      action: success ? 'ROLLBACK_COMPLETED' : 'ROLLBACK_INITIATED',
      timestamp: Date.now(),
      sessionId: this.currentState?.sessionId ?? 'unknown',
      details: { checkpoint: checkpoint?.id, errorMessage },
      outcome: success ? 'SUCCESS' : 'FAILURE'
    };

    return {
      success,
      rolledBackTo: checkpoint,
      stateRestored: success,
      auditEntry,
      error: errorMessage ? new Error(errorMessage) : undefined
    };
  }

  /**
   * Validate restored state integrity
   */
  private async validateRestoredState(): Promise<boolean> {
    if (!this.currentState) {
      return false;
    }

    // Validate pattern state
    if (!this.currentState.patternState ||
        !Array.isArray(this.currentState.patternState.detectedPatterns)) {
      return false;
    }

    // Validate scoring state
    if (!this.currentState.scoringState ||
        !this.currentState.scoringState.weightConfiguration) {
      return false;
    }

    // Validate therapeutic state
    if (!this.currentState.therapeuticState ||
        !this.currentState.therapeuticState.currentPhase) {
      return false;
    }

    return true;
  }

  /**
   * Log audit entry
   */
  private logAudit(entry: Omit<AuditEntry, 'entryId' | 'timestamp'>): void {
    if (!this.config.enableAuditLogging) {
      return;
    }

    this.auditLog.push({
      ...entry,
      entryId: this.generateId(),
      timestamp: Date.now()
    });
  }

  /**
   * Deep clone object
   */
  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }

  /**
   * Generate unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}

// ============================================================================
// Session Observer Interface
// ============================================================================

/**
 * Observer interface for session events
 */
export interface SessionObserver {
  onSessionEvent(event: string, data: unknown): void;
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a new Session Rollback Engine instance
 */
export function createSessionRollbackEngine(
  config?: Partial<RollbackEngineConfig>
): SessionRollbackEngine {
  return new SessionRollbackEngine(config);
}

export default SessionRollbackEngine;
