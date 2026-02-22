/**
 * Magnus 15 PR #2 - Session Rollback Protocol
 *
 * Public API exports for the Session Rollback Protocol module.
 *
 * @module convergence/rollback
 * @version 2.0.0
 */

// ============================================================================
// Session Rollback Engine
// ============================================================================

export {
  SessionRollbackEngine,
  createSessionRollbackEngine,
  SessionState,
  SessionMetadata,
  PatternState,
  DetectedPattern,
  CodeLocation,
  ScoringState,
  ModelScore,
  ScoreBreakdown,
  WeightConfig,
  RoutingDecision,
  TherapeuticState,
  TherapeuticPhase,
  OpusFinding,
  RollbackOptions,
  RollbackResult,
  AuditEntry,
  RollbackEngineConfig,
  SessionObserver
} from './session-rollback-engine';

// ============================================================================
// Checkpoint Manager
// ============================================================================

export {
  CheckpointManager,
  createCheckpointManager,
  Checkpoint,
  CheckpointType,
  CheckpointMetadata,
  CheckpointManagerConfig,
  CheckpointQueryOptions,
  CheckpointStats
} from './checkpoint-manager';

// ============================================================================
// Failure Recovery Strategy
// ============================================================================

export {
  FailureRecoveryStrategy,
  createFailureRecoveryStrategy,
  FailureType,
  RecoveryStrategyType,
  FailureContext,
  RecoveryResult,
  RecoveryMethod,
  RecoveryDetails,
  RecoveryStep,
  DecomposedOperation,
  RecoveryStrategyConfig,
  RecoveryStats
} from './failure-recovery-strategy';
