/**
 * Session Rollback Engine Tests - Magnus 15 PR #2
 *
 * Comprehensive test suite for the Session Rollback Protocol
 * including checkpoint management and failure recovery.
 *
 * @module session-rollback-engine.test
 * @version 2.0.0
 */

import { describe, it, expect, beforeEach, afterEach, jest } from '@jest/globals';
import {
  SessionRollbackEngine,
  SessionState,
  SessionMetadata,
  DetectedPattern,
  RoutingDecision,
  TherapeuticPhase,
  RollbackOptions,
  createSessionRollbackEngine
} from '../../../src/gateway/router/convergence/session-rollback-engine';
import {
  CheckpointManager,
  CheckpointType,
  Checkpoint
} from '../../../src/gateway/router/convergence/checkpoint-manager';
import {
  FailureRecoveryStrategy,
  FailureType,
  FailureContext
} from '../../../src/gateway/router/convergence/failure-recovery-strategy';

// ============================================================================
// Test Fixtures
// ============================================================================

const createTestMetadata = (): SessionMetadata => ({
  userId: 'test-user-123',
  projectId: 'test-project-456',
  environment: 'test',
  version: '2.0.0',
  tags: ['test', 'unit-test']
});

const createTestPattern = (type: 'positive' | 'anti' = 'positive'): DetectedPattern => ({
  id: `pattern-${Date.now()}`,
  name: type === 'positive' ? 'HARMONIE_COGNITIVE' : 'SPIRALE_CLARIFICATION',
  type,
  confidence: 0.85,
  location: {
    file: 'test.ts',
    startLine: 10,
    endLine: 20
  },
  timestamp: Date.now()
});

const createTestRoutingDecision = (): RoutingDecision => ({
  decisionId: `decision-${Date.now()}`,
  selectedModel: 'claude-opus-4',
  reason: 'Highest convergence score',
  scores: [
    {
      modelId: 'claude-opus-4',
      totalScore: 0.92,
      breakdown: { convergence: 0.45, latency: 0.22, cost: 0.15, patternMatch: 0.10 },
      timestamp: Date.now()
    }
  ],
  timestamp: Date.now()
});

// ============================================================================
// SessionRollbackEngine Tests
// ============================================================================

describe('SessionRollbackEngine', () => {
  let engine: SessionRollbackEngine;

  beforeEach(() => {
    engine = createSessionRollbackEngine();
  });

  afterEach(() => {
    // Cleanup
  });

  // --------------------------------------------------------------------------
  // Initialization Tests
  // --------------------------------------------------------------------------

  describe('initialization', () => {
    it('should create engine with default configuration', () => {
      const engine = createSessionRollbackEngine();
      expect(engine).toBeDefined();
    });

    it('should create engine with custom configuration', () => {
      const engine = createSessionRollbackEngine({
        maxCheckpoints: 20,
        checkpointRetentionMs: 7200000,
        recoveryStrategy: 'PROGRESSIVE'
      });
      expect(engine).toBeDefined();
    });

    it('should initialize session with valid state', async () => {
      const metadata = createTestMetadata();
      const state = await engine.initializeSession('session-001', metadata);

      expect(state).toBeDefined();
      expect(state.sessionId).toBe('session-001');
      expect(state.patternState).toBeDefined();
      expect(state.scoringState).toBeDefined();
      expect(state.therapeuticState).toBeDefined();
      expect(state.metadata).toEqual(metadata);
    });

    it('should create initial checkpoint on session initialization', async () => {
      const metadata = createTestMetadata();
      await engine.initializeSession('session-002', metadata);

      const checkpoints = await engine.getCheckpoints();
      expect(checkpoints.length).toBe(1);
      expect(checkpoints[0].type).toBe(CheckpointType.SESSION_START);
    });
  });

  // --------------------------------------------------------------------------
  // Checkpoint Creation Tests
  // --------------------------------------------------------------------------

  describe('checkpoint creation', () => {
    beforeEach(async () => {
      await engine.initializeSession('session-test', createTestMetadata());
    });

    it('should create manual checkpoint', async () => {
      const checkpoint = await engine.createCheckpoint(
        CheckpointType.USER_REQUESTED,
        'Manual test checkpoint'
      );

      expect(checkpoint).toBeDefined();
      expect(checkpoint.type).toBe(CheckpointType.USER_REQUESTED);
      expect(checkpoint.description).toBe('Manual test checkpoint');
    });

    it('should auto-checkpoint on pattern detection', async () => {
      const antiPattern = createTestPattern('anti');
      await engine.onPatternDetected([antiPattern]);

      const checkpoints = await engine.getCheckpoints();
      const patternCheckpoint = checkpoints.find(
        cp => cp.type === CheckpointType.PATTERN_MILESTONE
      );

      expect(patternCheckpoint).toBeDefined();
    });

    it('should auto-checkpoint on scoring decision', async () => {
      const decision = createTestRoutingDecision();
      await engine.onScoringDecision(decision);

      const checkpoints = await engine.getCheckpoints();
      const scoringCheckpoint = checkpoints.find(
        cp => cp.type === CheckpointType.SCORING_DECISION
      );

      expect(scoringCheckpoint).toBeDefined();
    });

    it('should auto-checkpoint on therapeutic phase change', async () => {
      await engine.onTherapeuticPhaseChange('PATTERN_ANALYSIS');

      const checkpoints = await engine.getCheckpoints();
      const therapeuticCheckpoint = checkpoints.find(
        cp => cp.type === CheckpointType.THERAPEUTIC_PHASE
      );

      expect(therapeuticCheckpoint).toBeDefined();
    });

    it('should update state on pattern detection', async () => {
      const patterns = [createTestPattern('positive'), createTestPattern('anti')];
      await engine.onPatternDetected(patterns);

      const state = engine.getCurrentState();
      expect(state?.patternState.detectedPatterns.length).toBeGreaterThanOrEqual(2);
      expect(state?.patternState.positivePatternCount).toBeGreaterThanOrEqual(1);
      expect(state?.patternState.antiPatternCount).toBeGreaterThanOrEqual(1);
    });
  });

  // --------------------------------------------------------------------------
  // Rollback Tests
  // --------------------------------------------------------------------------

  describe('rollback operations', () => {
    let initialCheckpointId: string;

    beforeEach(async () => {
      await engine.initializeSession('session-rollback', createTestMetadata());
      const checkpoints = await engine.getCheckpoints();
      initialCheckpointId = checkpoints[0].id;

      // Create additional state changes
      await engine.onPatternDetected([createTestPattern('positive')]);
      await engine.onScoringDecision(createTestRoutingDecision());
    });

    it('should rollback to specific checkpoint', async () => {
      const result = await engine.rollbackToCheckpoint(initialCheckpointId);

      expect(result.success).toBe(true);
      expect(result.rolledBackTo?.id).toBe(initialCheckpointId);
      expect(result.stateRestored).toBe(true);
    });

    it('should rollback to latest checkpoint', async () => {
      const result = await engine.rollbackToLatest();

      expect(result.success).toBe(true);
      expect(result.rolledBackTo).toBeDefined();
    });

    it('should rollback to checkpoint of specific type', async () => {
      const result = await engine.rollbackToType(CheckpointType.SESSION_START);

      expect(result.success).toBe(true);
      expect(result.rolledBackTo?.type).toBe(CheckpointType.SESSION_START);
    });

    it('should fail rollback for non-existent checkpoint', async () => {
      const result = await engine.rollbackToCheckpoint('non-existent-id');

      expect(result.success).toBe(false);
      expect(result.error).toBeDefined();
    });

    it('should preserve audit log after rollback', async () => {
      await engine.rollbackToCheckpoint(initialCheckpointId, { preserveAuditLog: true });

      const auditLog = engine.getAuditLog();
      expect(auditLog.length).toBeGreaterThan(0);
    });

    it('should validate state after rollback when option enabled', async () => {
      const result = await engine.rollbackToCheckpoint(initialCheckpointId, {
        validateStateAfterRollback: true
      });

      expect(result.success).toBe(true);
      expect(result.stateRestored).toBe(true);
    });
  });

  // --------------------------------------------------------------------------
  // State Management Tests
  // --------------------------------------------------------------------------

  describe('state management', () => {
    beforeEach(async () => {
      await engine.initializeSession('session-state', createTestMetadata());
    });

    it('should return current state snapshot', () => {
      const state = engine.getCurrentState();

      expect(state).toBeDefined();
      expect(state?.sessionId).toBe('session-state');
    });

    it('should return null state before initialization', () => {
      const newEngine = createSessionRollbackEngine();
      const state = newEngine.getCurrentState();

      expect(state).toBeNull();
    });

    it('should return deep copy of state (immutable)', () => {
      const state1 = engine.getCurrentState();
      const state2 = engine.getCurrentState();

      expect(state1).not.toBe(state2);
      expect(state1).toEqual(state2);
    });

    it('should update scoring state on routing decision', async () => {
      const decision = createTestRoutingDecision();
      await engine.onScoringDecision(decision);

      const state = engine.getCurrentState();
      expect(state?.scoringState.routingDecisions).toContainEqual(decision);
    });

    it('should update therapeutic state on phase change', async () => {
      await engine.onTherapeuticPhaseChange('OPUS_CONSULTATION');

      const state = engine.getCurrentState();
      expect(state?.therapeuticState.currentPhase).toBe('OPUS_CONSULTATION');
      expect(state?.therapeuticState.iterationCount).toBeGreaterThan(0);
    });
  });

  // --------------------------------------------------------------------------
  // Observer Pattern Tests
  // --------------------------------------------------------------------------

  describe('observer pattern', () => {
    it('should notify observers on checkpoint creation', async () => {
      const observer = { onSessionEvent: jest.fn() };
      engine.addObserver(observer);

      await engine.initializeSession('session-observer', createTestMetadata());

      expect(observer.onSessionEvent).toHaveBeenCalledWith(
        'checkpointCreated',
        expect.any(Object)
      );
    });

    it('should notify observers on rollback', async () => {
      const observer = { onSessionEvent: jest.fn() };

      await engine.initializeSession('session-rollback-observer', createTestMetadata());
      const checkpoints = await engine.getCheckpoints();

      engine.addObserver(observer);
      await engine.rollbackToCheckpoint(checkpoints[0].id, { notifyObservers: true });

      expect(observer.onSessionEvent).toHaveBeenCalledWith(
        'rollbackCompleted',
        expect.any(Object)
      );
    });

    it('should remove observer correctly', async () => {
      const observer = { onSessionEvent: jest.fn() };
      engine.addObserver(observer);
      engine.removeObserver(observer);

      await engine.initializeSession('session-removed-observer', createTestMetadata());

      expect(observer.onSessionEvent).not.toHaveBeenCalled();
    });
  });

  // --------------------------------------------------------------------------
  // Audit Log Tests
  // --------------------------------------------------------------------------

  describe('audit logging', () => {
    beforeEach(async () => {
      await engine.initializeSession('session-audit', createTestMetadata());
    });

    it('should log checkpoint creation', () => {
      const auditLog = engine.getAuditLog();
      const createEntry = auditLog.find(e => e.action === 'CHECKPOINT_CREATED');

      expect(createEntry).toBeDefined();
      expect(createEntry?.outcome).toBe('SUCCESS');
    });

    it('should log rollback operations', async () => {
      const checkpoints = await engine.getCheckpoints();
      await engine.rollbackToCheckpoint(checkpoints[0].id);

      const auditLog = engine.getAuditLog();
      const rollbackEntry = auditLog.find(e => e.action === 'ROLLBACK_COMPLETED');

      expect(rollbackEntry).toBeDefined();
    });

    it('should include session ID in audit entries', () => {
      const auditLog = engine.getAuditLog();

      for (const entry of auditLog) {
        expect(entry.sessionId).toBe('session-audit');
      }
    });

    it('should include timestamps in audit entries', () => {
      const auditLog = engine.getAuditLog();

      for (const entry of auditLog) {
        expect(entry.timestamp).toBeDefined();
        expect(entry.timestamp).toBeLessThanOrEqual(Date.now());
      }
    });
  });
});

// ============================================================================
// CheckpointManager Tests
// ============================================================================

describe('CheckpointManager', () => {
  let manager: CheckpointManager;
  let testState: SessionState;

  beforeEach(() => {
    manager = new CheckpointManager();
    testState = {
      sessionId: 'session-cp-test',
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
        weightConfiguration: { convergence: 0.45, latency: 0.25, cost: 0.20, patternMatch: 0.10 },
        convergenceLevel: 0,
        routingDecisions: []
      },
      therapeuticState: {
        currentPhase: 'INITIAL_ASSESSMENT',
        iterationCount: 0,
        opusFindings: [],
        resolutionProgress: 0,
        lastTherapeuticAction: ''
      },
      metadata: createTestMetadata()
    };
  });

  describe('checkpoint creation', () => {
    it('should create checkpoint with correct properties', async () => {
      const checkpoint = await manager.createCheckpoint(
        testState,
        CheckpointType.SESSION_START,
        'Test checkpoint'
      );

      expect(checkpoint.id).toBeDefined();
      expect(checkpoint.sessionId).toBe('session-cp-test');
      expect(checkpoint.type).toBe(CheckpointType.SESSION_START);
      expect(checkpoint.description).toBe('Test checkpoint');
      expect(checkpoint.state).toEqual(testState);
      expect(checkpoint.hash).toBeDefined();
    });

    it('should generate unique checkpoint IDs', async () => {
      const cp1 = await manager.createCheckpoint(testState, CheckpointType.AUTO_PERIODIC, 'CP1');
      const cp2 = await manager.createCheckpoint(testState, CheckpointType.AUTO_PERIODIC, 'CP2');

      expect(cp1.id).not.toBe(cp2.id);
    });

    it('should increment sequence numbers', async () => {
      const cp1 = await manager.createCheckpoint(testState, CheckpointType.AUTO_PERIODIC, 'CP1');
      const cp2 = await manager.createCheckpoint(testState, CheckpointType.AUTO_PERIODIC, 'CP2');

      expect(cp2.metadata.sequenceNumber).toBe(cp1.metadata.sequenceNumber + 1);
    });
  });

  describe('checkpoint retrieval', () => {
    let checkpoint1: Checkpoint;
    let checkpoint2: Checkpoint;

    beforeEach(async () => {
      checkpoint1 = await manager.createCheckpoint(testState, CheckpointType.SESSION_START, 'First');
      checkpoint2 = await manager.createCheckpoint(testState, CheckpointType.PATTERN_MILESTONE, 'Second');
    });

    it('should get checkpoint by ID', async () => {
      const retrieved = await manager.getCheckpoint(checkpoint1.id);
      expect(retrieved).toEqual(checkpoint1);
    });

    it('should return null for non-existent checkpoint', async () => {
      const retrieved = await manager.getCheckpoint('non-existent');
      expect(retrieved).toBeNull();
    });

    it('should get latest checkpoint', async () => {
      const latest = await manager.getLatestCheckpoint();
      expect(latest?.id).toBe(checkpoint2.id);
    });

    it('should get checkpoints for session', async () => {
      const checkpoints = await manager.getCheckpointsForSession('session-cp-test');
      expect(checkpoints.length).toBe(2);
    });

    it('should find checkpoint by type', async () => {
      const found = await manager.findCheckpointByType(CheckpointType.PATTERN_MILESTONE);
      expect(found?.id).toBe(checkpoint2.id);
    });
  });

  describe('checkpoint deletion', () => {
    it('should delete checkpoint by ID', async () => {
      const checkpoint = await manager.createCheckpoint(testState, CheckpointType.AUTO_PERIODIC, 'Delete me');
      const deleted = await manager.deleteCheckpoint(checkpoint.id);

      expect(deleted).toBe(true);
      expect(await manager.getCheckpoint(checkpoint.id)).toBeNull();
    });

    it('should return false for non-existent checkpoint deletion', async () => {
      const deleted = await manager.deleteCheckpoint('non-existent');
      expect(deleted).toBe(false);
    });

    it('should delete all session checkpoints', async () => {
      await manager.createCheckpoint(testState, CheckpointType.AUTO_PERIODIC, 'CP1');
      await manager.createCheckpoint(testState, CheckpointType.AUTO_PERIODIC, 'CP2');

      const deletedCount = await manager.deleteSessionCheckpoints('session-cp-test');
      expect(deletedCount).toBe(2);
    });
  });

  describe('retention policy', () => {
    it('should enforce max checkpoints limit', async () => {
      const smallManager = new CheckpointManager({ maxCheckpoints: 3 });

      for (let i = 0; i < 5; i++) {
        await smallManager.createCheckpoint(testState, CheckpointType.AUTO_PERIODIC, `CP${i}`);
      }

      const checkpoints = await smallManager.getCheckpointsForSession('session-cp-test');
      expect(checkpoints.length).toBeLessThanOrEqual(3);
    });
  });

  describe('statistics', () => {
    it('should return checkpoint statistics', async () => {
      await manager.createCheckpoint(testState, CheckpointType.SESSION_START, 'Start');
      await manager.createCheckpoint(testState, CheckpointType.PATTERN_MILESTONE, 'Pattern');

      const stats = manager.getStats();

      expect(stats.totalCheckpoints).toBe(2);
      expect(stats.checkpointsByType.get(CheckpointType.SESSION_START)).toBe(1);
      expect(stats.checkpointsByType.get(CheckpointType.PATTERN_MILESTONE)).toBe(1);
    });
  });
});

// ============================================================================
// FailureRecoveryStrategy Tests
// ============================================================================

describe('FailureRecoveryStrategy', () => {
  let strategy: FailureRecoveryStrategy;
  let mockCheckpointManager: CheckpointManager;
  let mockRollbackEngine: { rollbackToCheckpoint: jest.Mock };

  beforeEach(() => {
    strategy = new FailureRecoveryStrategy({ strategy: 'IMMEDIATE' });
    mockCheckpointManager = new CheckpointManager();
    mockRollbackEngine = {
      rollbackToCheckpoint: jest.fn().mockResolvedValue({ success: true })
    };
  });

  describe('immediate recovery', () => {
    it('should attempt immediate rollback on failure', async () => {
      // Setup checkpoint
      const testState: SessionState = {
        sessionId: 'session-recovery',
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
          weightConfiguration: { convergence: 0.45, latency: 0.25, cost: 0.20, patternMatch: 0.10 },
          convergenceLevel: 0,
          routingDecisions: []
        },
        therapeuticState: {
          currentPhase: 'INITIAL_ASSESSMENT',
          iterationCount: 0,
          opusFindings: [],
          resolutionProgress: 0,
          lastTherapeuticAction: ''
        },
        metadata: createTestMetadata()
      };

      await mockCheckpointManager.createCheckpoint(
        testState,
        CheckpointType.SESSION_START,
        'Start'
      );

      const failureContext: FailureContext = {
        type: FailureType.PATTERN_DETECTION_ERROR,
        error: new Error('Test error'),
        timestamp: Date.now(),
        operation: 'detectPatterns',
        metadata: {},
        affectedComponents: ['patternEngine']
      };

      const result = await strategy.recover(
        failureContext,
        mockCheckpointManager,
        mockRollbackEngine
      );

      expect(result.method).toBe('IMMEDIATE_ROLLBACK');
    });
  });

  describe('decompose recovery', () => {
    it('should decompose operations and retry', async () => {
      const decomposeStrategy = new FailureRecoveryStrategy({ strategy: 'DECOMPOSE' });

      const testState: SessionState = {
        sessionId: 'session-decompose',
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
          weightConfiguration: { convergence: 0.45, latency: 0.25, cost: 0.20, patternMatch: 0.10 },
          convergenceLevel: 0,
          routingDecisions: []
        },
        therapeuticState: {
          currentPhase: 'INITIAL_ASSESSMENT',
          iterationCount: 0,
          opusFindings: [],
          resolutionProgress: 0,
          lastTherapeuticAction: ''
        },
        metadata: createTestMetadata()
      };

      await mockCheckpointManager.createCheckpoint(
        testState,
        CheckpointType.PATTERN_MILESTONE,
        'Pattern milestone'
      );

      const failureContext: FailureContext = {
        type: FailureType.SCORING_CALCULATION_ERROR,
        error: new Error('Scoring error'),
        timestamp: Date.now(),
        operation: 'calculateScores',
        metadata: {},
        affectedComponents: ['scoringEngine', 'cache']
      };

      const result = await decomposeStrategy.recover(
        failureContext,
        mockCheckpointManager,
        mockRollbackEngine
      );

      expect(result.details.stepsExecuted.length).toBeGreaterThan(0);
    });
  });

  describe('recovery statistics', () => {
    it('should track recovery history', async () => {
      const testState: SessionState = {
        sessionId: 'session-stats',
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
          weightConfiguration: { convergence: 0.45, latency: 0.25, cost: 0.20, patternMatch: 0.10 },
          convergenceLevel: 0,
          routingDecisions: []
        },
        therapeuticState: {
          currentPhase: 'INITIAL_ASSESSMENT',
          iterationCount: 0,
          opusFindings: [],
          resolutionProgress: 0,
          lastTherapeuticAction: ''
        },
        metadata: createTestMetadata()
      };

      await mockCheckpointManager.createCheckpoint(
        testState,
        CheckpointType.SESSION_START,
        'Start'
      );

      const failureContext: FailureContext = {
        type: FailureType.TIMEOUT,
        error: new Error('Timeout'),
        timestamp: Date.now(),
        operation: 'processRequest',
        metadata: {},
        affectedComponents: ['sessionState']
      };

      await strategy.recover(failureContext, mockCheckpointManager, mockRollbackEngine);

      const history = strategy.getRecoveryHistory();
      expect(history.length).toBe(1);
    });

    it('should calculate recovery statistics', async () => {
      const testState: SessionState = {
        sessionId: 'session-calc-stats',
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
          weightConfiguration: { convergence: 0.45, latency: 0.25, cost: 0.20, patternMatch: 0.10 },
          convergenceLevel: 0,
          routingDecisions: []
        },
        therapeuticState: {
          currentPhase: 'INITIAL_ASSESSMENT',
          iterationCount: 0,
          opusFindings: [],
          resolutionProgress: 0,
          lastTherapeuticAction: ''
        },
        metadata: createTestMetadata()
      };

      await mockCheckpointManager.createCheckpoint(
        testState,
        CheckpointType.SESSION_START,
        'Start'
      );

      const failureContext: FailureContext = {
        type: FailureType.UNKNOWN,
        error: new Error('Unknown error'),
        timestamp: Date.now(),
        operation: 'unknown',
        metadata: {},
        affectedComponents: []
      };

      await strategy.recover(failureContext, mockCheckpointManager, mockRollbackEngine);

      const stats = strategy.getRecoveryStats();
      expect(stats.totalRecoveries).toBeGreaterThan(0);
    });
  });
});

// ============================================================================
// Integration Tests
// ============================================================================

describe('Integration Tests', () => {
  it('should handle complete session lifecycle with rollback', async () => {
    const engine = createSessionRollbackEngine();

    // Initialize session
    await engine.initializeSession('integration-test', createTestMetadata());

    // Simulate normal operations
    await engine.onPatternDetected([createTestPattern('positive')]);
    await engine.onScoringDecision(createTestRoutingDecision());
    await engine.onTherapeuticPhaseChange('PATTERN_ANALYSIS');

    // Get state before issue
    const stateBefore = engine.getCurrentState();
    expect(stateBefore?.therapeuticState.currentPhase).toBe('PATTERN_ANALYSIS');

    // Create explicit checkpoint
    const safeCheckpoint = await engine.createCheckpoint(
      CheckpointType.USER_REQUESTED,
      'Safe point before risky operation'
    );

    // Simulate state change
    await engine.onTherapeuticPhaseChange('OPUS_CONSULTATION');

    // Rollback to safe point
    const result = await engine.rollbackToCheckpoint(safeCheckpoint.id);

    expect(result.success).toBe(true);

    // Verify state was restored
    const stateAfter = engine.getCurrentState();
    expect(stateAfter?.therapeuticState.currentPhase).toBe('PATTERN_ANALYSIS');
  });

  it('should recover from simulated failure', async () => {
    const engine = createSessionRollbackEngine({ recoveryStrategy: 'IMMEDIATE' });

    await engine.initializeSession('failure-recovery-test', createTestMetadata());
    await engine.onPatternDetected([createTestPattern('anti')]);

    const failureContext: FailureContext = {
      type: FailureType.THERAPEUTIC_LOOP_ERROR,
      error: new Error('Therapeutic loop timeout'),
      timestamp: Date.now(),
      operation: 'executeTherapeuticLoop',
      metadata: { iteration: 5 },
      affectedComponents: ['therapeuticLoop', 'scoringEngine']
    };

    const recoveryResult = await engine.handleFailure(failureContext);

    expect(recoveryResult).toBeDefined();
    expect(recoveryResult.details.stepsExecuted.length).toBeGreaterThan(0);
  });
});
