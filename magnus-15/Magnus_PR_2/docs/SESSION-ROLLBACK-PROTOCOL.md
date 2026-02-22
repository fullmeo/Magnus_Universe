# Session Rollback Protocol - Magnus 15 PR #2

## Overview

The Session Rollback Protocol provides checkpoint-based session state management with atomic rollback capabilities for fault-tolerant convergence-aware routing. This extends the Magnus 15 PR #1 foundation with production-grade reliability features.

## Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                    Session Rollback Protocol                         │
├─────────────────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────────────────┐   │
│  │              SessionRollbackEngine                           │   │
│  │  ┌─────────────────┐    ┌─────────────────────────────────┐ │   │
│  │  │ CheckpointManager│    │ FailureRecoveryStrategy        │ │   │
│  │  │  - create()      │    │  - IMMEDIATE                   │ │   │
│  │  │  - restore()     │    │  - DECOMPOSE                   │ │   │
│  │  │  - cleanup()     │    │  - PROGRESSIVE                 │ │   │
│  │  └─────────────────┘    └─────────────────────────────────┘ │   │
│  └─────────────────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────────────────┤
│  Integration Points (from PR #1):                                    │
│  - SessionContext → Checkpoint state storage                        │
│  - MagnusPatternEngine → Trigger checkpoints on pattern detection   │
│  - ConvergenceScorer → Track scoring decisions                      │
│  - TherapeuticLoop → Phase-based checkpointing                      │
└─────────────────────────────────────────────────────────────────────┘
```

## Components

### 1. SessionRollbackEngine

The main orchestrator for session state management and rollback operations.

**Features:**
- Session initialization with automatic checkpoint
- Auto-checkpointing on significant events
- Atomic rollback to any checkpoint
- Observer pattern for event notifications
- Complete audit logging

**Usage:**

```typescript
import { createSessionRollbackEngine } from './session-rollback-engine';

const engine = createSessionRollbackEngine({
  maxCheckpoints: 10,
  autoCheckpointOnPatternDetection: true,
  recoveryStrategy: 'DECOMPOSE'
});

// Initialize session
await engine.initializeSession('session-001', {
  userId: 'user-123',
  environment: 'production',
  version: '2.0.0',
  tags: ['convergence', 'magnus-15']
});

// Auto-checkpoint on pattern detection
await engine.onPatternDetected([detectedPattern]);

// Manual checkpoint
await engine.createCheckpoint(CheckpointType.USER_REQUESTED, 'Before risky operation');

// Rollback if needed
const result = await engine.rollbackToCheckpoint(checkpointId);
```

### 2. CheckpointManager

Handles checkpoint lifecycle including creation, storage, retrieval, and cleanup.

**Features:**
- Immutable state snapshots
- Type-based categorization
- Retention policy enforcement
- Hash-based integrity verification
- Efficient indexing by session and type

**Checkpoint Types:**
- `SESSION_START` - Initial session checkpoint
- `PATTERN_MILESTONE` - After significant pattern detection
- `SCORING_DECISION` - After routing decisions
- `THERAPEUTIC_PHASE` - On phase transitions
- `USER_REQUESTED` - Manual checkpoints
- `AUTO_PERIODIC` - Automatic periodic snapshots
- `PRE_ROLLBACK` - Safety checkpoint before rollback
- `RECOVERY_POINT` - After successful recovery

### 3. FailureRecoveryStrategy

Implements intelligent failure recovery with multiple strategies.

**Recovery Strategies:**

| Strategy | Description | Use Case |
|----------|-------------|----------|
| **IMMEDIATE** | Instant rollback to last checkpoint | Simple failures, quick recovery needed |
| **DECOMPOSE** | Break operation into steps, retry each | Complex operations with partial failures |
| **PROGRESSIVE** | Try checkpoints oldest to newest | Unknown failure cause, need validation |

**Failure Types Handled:**
- `PATTERN_DETECTION_ERROR`
- `SCORING_CALCULATION_ERROR`
- `THERAPEUTIC_LOOP_ERROR`
- `STATE_CORRUPTION`
- `TIMEOUT`
- `EXTERNAL_SERVICE_ERROR`
- `VALIDATION_ERROR`

## Integration with PR #1

### Pattern Detection Integration

```typescript
// In MagnusPatternEngine (PR #1)
const patterns = await patternEngine.detectPatterns(code);

// New: Trigger checkpoint via rollback engine
await rollbackEngine.onPatternDetected(patterns);
```

### Scoring Decision Integration

```typescript
// In ConvergenceScorer (PR #1)
const decision = await scorer.scoreModels(context);

// New: Track decision with checkpoint
await rollbackEngine.onScoringDecision(decision);
```

### Therapeutic Loop Integration

```typescript
// In TherapeuticLoop (PR #1)
await therapeuticLoop.transitionTo('OPUS_CONSULTATION');

// New: Checkpoint on phase change
await rollbackEngine.onTherapeuticPhaseChange('OPUS_CONSULTATION', findings);
```

## Configuration

See `config/session-rollback-config.yaml` for full configuration options.

**Key Settings:**

```yaml
checkpoint:
  maxCheckpoints: 10
  retentionMs: 3600000  # 1 hour
  autoCheckpoint:
    onPatternDetection: true
    onScoringDecision: true
    onTherapeuticPhase: true

recovery:
  strategy: DECOMPOSE
  retry:
    maxAttempts: 3
    initialDelayMs: 1000
    backoffMultiplier: 2
```

## Failure Recovery Flow

```
┌─────────────────┐
│  Failure Occurs │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Analyze Failure │
│    Context      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Select Strategy │────▶│   IMMEDIATE     │──▶ Rollback to last checkpoint
└────────┬────────┘     └─────────────────┘
         │
         │              ┌─────────────────┐
         └─────────────▶│   DECOMPOSE     │──▶ Decompose → Rollback → Retry each
                        └─────────────────┘
         │
         │              ┌─────────────────┐
         └─────────────▶│  PROGRESSIVE    │──▶ Try checkpoints one by one
                        └─────────────────┘
```

## Audit Logging

All operations are logged for compliance and debugging:

```typescript
const auditLog = engine.getAuditLog();
// Returns array of AuditEntry with:
// - entryId
// - action (CHECKPOINT_CREATED, ROLLBACK_INITIATED, etc.)
// - timestamp
// - sessionId
// - details
// - outcome (SUCCESS, FAILURE, PARTIAL)
```

## Best Practices

### 1. Checkpoint Strategy
- Create checkpoints before risky operations
- Use USER_REQUESTED type for explicit save points
- Don't over-checkpoint (use minIntervalMs setting)

### 2. Recovery Strategy Selection
- Use IMMEDIATE for simple, time-critical failures
- Use DECOMPOSE for complex multi-component failures
- Use PROGRESSIVE when failure cause is unclear

### 3. State Management
- Always get state via `getCurrentState()` (returns immutable copy)
- Validate state after rollback when dealing with critical operations
- Monitor checkpoint count to avoid memory issues

### 4. Observer Pattern
- Register observers for monitoring and alerting
- Observers receive: checkpointCreated, rollbackCompleted, recoveryAttempted

## Testing

Run the test suite:

```bash
npm test -- --testPathPattern="session-rollback-engine.test.ts"
```

Test coverage includes:
- Session initialization
- Checkpoint creation (auto and manual)
- Rollback operations
- Recovery strategies
- State management
- Observer notifications
- Audit logging
- Integration scenarios

## Performance Considerations

1. **Memory**: Checkpoints are stored in-memory by default
   - Configure `maxCheckpoints` based on available memory
   - Enable disk spillover for large deployments

2. **Latency**: Checkpoint creation is async
   - Use `asyncCheckpoints: true` for non-blocking operation
   - Set appropriate `checkpointTimeoutMs`

3. **Storage**: State snapshots can be large
   - Enable compression for states > `compressionThresholdBytes`
   - Adjust `maxMemoryBytes` based on infrastructure

## Migration from PR #1

No breaking changes. PR #2 components are additive:

1. Import `SessionRollbackEngine` alongside existing components
2. Initialize engine at session start
3. Add checkpoint hooks to existing pattern/scoring/therapeutic flows
4. Configure recovery strategy based on requirements

## Files Added in PR #2

```
src/gateway/router/convergence/
├── session-rollback-engine.ts    (702 lines)
├── checkpoint-manager.ts         (450 lines)
└── failure-recovery-strategy.ts  (550 lines)

config/
└── session-rollback-config.yaml  (200 lines)

tests/gateway/router/convergence/
└── session-rollback-engine.test.ts (500+ lines)

docs/
└── SESSION-ROLLBACK-PROTOCOL.md  (this file)
```

## Related PRs

- **PR #1**: Convergence-aware routing with Magnus 15 patterns (foundation)
- **PR #3** (planned): Semantic Cache Coherence
- **PR #4** (planned): Transparent Agent Decision Logging
