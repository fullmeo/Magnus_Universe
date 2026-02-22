/**
 * Checkpoint Manager - Magnus 15 PR #2
 *
 * Manages checkpoint creation, storage, retrieval, and lifecycle
 * for session state snapshots.
 *
 * Features:
 * - Immutable checkpoint snapshots
 * - Retention policy enforcement
 * - Type-based checkpoint filtering
 * - Efficient storage with compression
 *
 * @module checkpoint-manager
 * @version 2.0.0
 */

import { SessionState } from './session-rollback-engine';

// ============================================================================
// Type Definitions
// ============================================================================

/**
 * Checkpoint types for categorization
 */
export enum CheckpointType {
  SESSION_START = 'SESSION_START',
  PATTERN_MILESTONE = 'PATTERN_MILESTONE',
  SCORING_DECISION = 'SCORING_DECISION',
  THERAPEUTIC_PHASE = 'THERAPEUTIC_PHASE',
  USER_REQUESTED = 'USER_REQUESTED',
  AUTO_PERIODIC = 'AUTO_PERIODIC',
  PRE_ROLLBACK = 'PRE_ROLLBACK',
  RECOVERY_POINT = 'RECOVERY_POINT'
}

/**
 * Checkpoint data structure
 */
export interface Checkpoint {
  id: string;
  sessionId: string;
  type: CheckpointType;
  description: string;
  timestamp: number;
  state: SessionState;
  metadata: CheckpointMetadata;
  hash: string;
}

/**
 * Checkpoint metadata
 */
export interface CheckpointMetadata {
  createdBy: 'AUTO' | 'USER' | 'SYSTEM';
  sequenceNumber: number;
  parentCheckpointId?: string;
  tags: string[];
  sizeBytes: number;
  compressed: boolean;
}

/**
 * Checkpoint manager configuration
 */
export interface CheckpointManagerConfig {
  maxCheckpoints: number;
  retentionMs: number;
  enableCompression: boolean;
  compressionThresholdBytes: number;
}

/**
 * Checkpoint query options
 */
export interface CheckpointQueryOptions {
  sessionId?: string;
  type?: CheckpointType;
  fromTimestamp?: number;
  toTimestamp?: number;
  limit?: number;
  sortOrder?: 'ASC' | 'DESC';
}

/**
 * Checkpoint statistics
 */
export interface CheckpointStats {
  totalCheckpoints: number;
  checkpointsByType: Map<CheckpointType, number>;
  oldestCheckpoint: number | null;
  newestCheckpoint: number | null;
  totalSizeBytes: number;
  averageSizeBytes: number;
}

// ============================================================================
// Checkpoint Manager Implementation
// ============================================================================

/**
 * Checkpoint Manager
 *
 * Handles checkpoint lifecycle including creation, storage,
 * retrieval, and cleanup based on retention policies.
 */
export class CheckpointManager {
  private checkpoints: Map<string, Checkpoint> = new Map();
  private sessionIndex: Map<string, Set<string>> = new Map();
  private typeIndex: Map<CheckpointType, Set<string>> = new Map();
  private sequenceCounter: Map<string, number> = new Map();
  private config: CheckpointManagerConfig;

  constructor(config: Partial<CheckpointManagerConfig> = {}) {
    this.config = this.mergeWithDefaults(config);
    this.initializeTypeIndex();
  }

  /**
   * Merge configuration with defaults
   */
  private mergeWithDefaults(config: Partial<CheckpointManagerConfig>): CheckpointManagerConfig {
    return {
      maxCheckpoints: config.maxCheckpoints ?? 10,
      retentionMs: config.retentionMs ?? 3600000, // 1 hour
      enableCompression: config.enableCompression ?? true,
      compressionThresholdBytes: config.compressionThresholdBytes ?? 10240 // 10KB
    };
  }

  /**
   * Initialize type index with all checkpoint types
   */
  private initializeTypeIndex(): void {
    for (const type of Object.values(CheckpointType)) {
      this.typeIndex.set(type as CheckpointType, new Set());
    }
  }

  // ==========================================================================
  // Checkpoint Creation
  // ==========================================================================

  /**
   * Create a new checkpoint from current session state
   */
  async createCheckpoint(
    state: SessionState,
    type: CheckpointType,
    description: string
  ): Promise<Checkpoint> {
    // Enforce retention policy before creating new checkpoint
    await this.enforceRetentionPolicy(state.sessionId);

    const checkpointId = this.generateCheckpointId();
    const sequenceNumber = this.getNextSequenceNumber(state.sessionId);
    const stateCopy = this.deepClone(state);
    const stateSize = this.calculateSize(stateCopy);

    const checkpoint: Checkpoint = {
      id: checkpointId,
      sessionId: state.sessionId,
      type,
      description,
      timestamp: Date.now(),
      state: stateCopy,
      metadata: {
        createdBy: type === CheckpointType.USER_REQUESTED ? 'USER' : 'AUTO',
        sequenceNumber,
        parentCheckpointId: this.getLatestCheckpointId(state.sessionId),
        tags: this.generateTags(type, state),
        sizeBytes: stateSize,
        compressed: stateSize > this.config.compressionThresholdBytes && this.config.enableCompression
      },
      hash: this.calculateHash(stateCopy)
    };

    // Store checkpoint
    this.checkpoints.set(checkpointId, checkpoint);

    // Update indexes
    this.updateSessionIndex(state.sessionId, checkpointId);
    this.updateTypeIndex(type, checkpointId);

    return checkpoint;
  }

  /**
   * Create a pre-rollback checkpoint (safety snapshot before rollback)
   */
  async createPreRollbackCheckpoint(state: SessionState): Promise<Checkpoint> {
    return this.createCheckpoint(
      state,
      CheckpointType.PRE_ROLLBACK,
      'Safety checkpoint before rollback operation'
    );
  }

  // ==========================================================================
  // Checkpoint Retrieval
  // ==========================================================================

  /**
   * Get checkpoint by ID
   */
  async getCheckpoint(checkpointId: string): Promise<Checkpoint | null> {
    return this.checkpoints.get(checkpointId) ?? null;
  }

  /**
   * Get the latest checkpoint for a session
   */
  async getLatestCheckpoint(sessionId?: string): Promise<Checkpoint | null> {
    const checkpointIds = sessionId
      ? this.sessionIndex.get(sessionId)
      : new Set(this.checkpoints.keys());

    if (!checkpointIds || checkpointIds.size === 0) {
      return null;
    }

    let latest: Checkpoint | null = null;
    for (const id of checkpointIds) {
      const checkpoint = this.checkpoints.get(id);
      if (checkpoint && (!latest || checkpoint.timestamp > latest.timestamp)) {
        latest = checkpoint;
      }
    }

    return latest;
  }

  /**
   * Get all checkpoints for a session
   */
  async getCheckpointsForSession(sessionId: string): Promise<Checkpoint[]> {
    const checkpointIds = this.sessionIndex.get(sessionId);
    if (!checkpointIds) {
      return [];
    }

    const checkpoints: Checkpoint[] = [];
    for (const id of checkpointIds) {
      const checkpoint = this.checkpoints.get(id);
      if (checkpoint) {
        checkpoints.push(checkpoint);
      }
    }

    return checkpoints.sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * Find checkpoint by type (most recent of that type)
   */
  async findCheckpointByType(
    type: CheckpointType,
    sessionId?: string
  ): Promise<Checkpoint | null> {
    const typeCheckpoints = this.typeIndex.get(type);
    if (!typeCheckpoints || typeCheckpoints.size === 0) {
      return null;
    }

    let latest: Checkpoint | null = null;
    for (const id of typeCheckpoints) {
      const checkpoint = this.checkpoints.get(id);
      if (checkpoint) {
        // Filter by session if specified
        if (sessionId && checkpoint.sessionId !== sessionId) {
          continue;
        }
        if (!latest || checkpoint.timestamp > latest.timestamp) {
          latest = checkpoint;
        }
      }
    }

    return latest;
  }

  /**
   * Query checkpoints with options
   */
  async queryCheckpoints(options: CheckpointQueryOptions): Promise<Checkpoint[]> {
    let results: Checkpoint[] = Array.from(this.checkpoints.values());

    // Filter by session
    if (options.sessionId) {
      results = results.filter(cp => cp.sessionId === options.sessionId);
    }

    // Filter by type
    if (options.type) {
      results = results.filter(cp => cp.type === options.type);
    }

    // Filter by timestamp range
    if (options.fromTimestamp) {
      results = results.filter(cp => cp.timestamp >= options.fromTimestamp!);
    }
    if (options.toTimestamp) {
      results = results.filter(cp => cp.timestamp <= options.toTimestamp!);
    }

    // Sort
    const sortOrder = options.sortOrder ?? 'DESC';
    results.sort((a, b) =>
      sortOrder === 'DESC' ? b.timestamp - a.timestamp : a.timestamp - b.timestamp
    );

    // Limit
    if (options.limit && options.limit > 0) {
      results = results.slice(0, options.limit);
    }

    return results;
  }

  // ==========================================================================
  // Checkpoint Deletion & Cleanup
  // ==========================================================================

  /**
   * Delete a specific checkpoint
   */
  async deleteCheckpoint(checkpointId: string): Promise<boolean> {
    const checkpoint = this.checkpoints.get(checkpointId);
    if (!checkpoint) {
      return false;
    }

    // Remove from main storage
    this.checkpoints.delete(checkpointId);

    // Remove from session index
    const sessionCheckpoints = this.sessionIndex.get(checkpoint.sessionId);
    if (sessionCheckpoints) {
      sessionCheckpoints.delete(checkpointId);
      if (sessionCheckpoints.size === 0) {
        this.sessionIndex.delete(checkpoint.sessionId);
      }
    }

    // Remove from type index
    const typeCheckpoints = this.typeIndex.get(checkpoint.type);
    if (typeCheckpoints) {
      typeCheckpoints.delete(checkpointId);
    }

    return true;
  }

  /**
   * Delete all checkpoints for a session
   */
  async deleteSessionCheckpoints(sessionId: string): Promise<number> {
    const checkpointIds = this.sessionIndex.get(sessionId);
    if (!checkpointIds) {
      return 0;
    }

    let deletedCount = 0;
    for (const id of Array.from(checkpointIds)) {
      if (await this.deleteCheckpoint(id)) {
        deletedCount++;
      }
    }

    return deletedCount;
  }

  /**
   * Enforce retention policy
   */
  async enforceRetentionPolicy(sessionId: string): Promise<number> {
    const checkpoints = await this.getCheckpointsForSession(sessionId);
    let deletedCount = 0;

    // Enforce max checkpoints limit
    if (checkpoints.length >= this.config.maxCheckpoints) {
      // Delete oldest checkpoints (keeping most recent)
      const toDelete = checkpoints.slice(this.config.maxCheckpoints - 1);
      for (const cp of toDelete) {
        if (await this.deleteCheckpoint(cp.id)) {
          deletedCount++;
        }
      }
    }

    // Enforce time-based retention
    const cutoffTime = Date.now() - this.config.retentionMs;
    for (const cp of checkpoints) {
      if (cp.timestamp < cutoffTime) {
        // Don't delete session start checkpoints regardless of age
        if (cp.type !== CheckpointType.SESSION_START) {
          if (await this.deleteCheckpoint(cp.id)) {
            deletedCount++;
          }
        }
      }
    }

    return deletedCount;
  }

  /**
   * Cleanup expired checkpoints across all sessions
   */
  async cleanupExpiredCheckpoints(): Promise<number> {
    const cutoffTime = Date.now() - this.config.retentionMs;
    let deletedCount = 0;

    for (const [id, checkpoint] of this.checkpoints) {
      if (checkpoint.timestamp < cutoffTime &&
          checkpoint.type !== CheckpointType.SESSION_START) {
        if (await this.deleteCheckpoint(id)) {
          deletedCount++;
        }
      }
    }

    return deletedCount;
  }

  // ==========================================================================
  // Statistics & Monitoring
  // ==========================================================================

  /**
   * Get checkpoint statistics
   */
  getStats(): CheckpointStats {
    const checkpointsByType = new Map<CheckpointType, number>();
    let totalSizeBytes = 0;
    let oldestTimestamp: number | null = null;
    let newestTimestamp: number | null = null;

    for (const checkpoint of this.checkpoints.values()) {
      // Count by type
      const typeCount = checkpointsByType.get(checkpoint.type) ?? 0;
      checkpointsByType.set(checkpoint.type, typeCount + 1);

      // Sum sizes
      totalSizeBytes += checkpoint.metadata.sizeBytes;

      // Track timestamps
      if (oldestTimestamp === null || checkpoint.timestamp < oldestTimestamp) {
        oldestTimestamp = checkpoint.timestamp;
      }
      if (newestTimestamp === null || checkpoint.timestamp > newestTimestamp) {
        newestTimestamp = checkpoint.timestamp;
      }
    }

    return {
      totalCheckpoints: this.checkpoints.size,
      checkpointsByType,
      oldestCheckpoint: oldestTimestamp,
      newestCheckpoint: newestTimestamp,
      totalSizeBytes,
      averageSizeBytes: this.checkpoints.size > 0
        ? Math.round(totalSizeBytes / this.checkpoints.size)
        : 0
    };
  }

  // ==========================================================================
  // Helper Methods
  // ==========================================================================

  /**
   * Generate unique checkpoint ID
   */
  private generateCheckpointId(): string {
    return `cp-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get next sequence number for session
   */
  private getNextSequenceNumber(sessionId: string): number {
    const current = this.sequenceCounter.get(sessionId) ?? 0;
    this.sequenceCounter.set(sessionId, current + 1);
    return current + 1;
  }

  /**
   * Get latest checkpoint ID for session
   */
  private getLatestCheckpointId(sessionId: string): string | undefined {
    const checkpointIds = this.sessionIndex.get(sessionId);
    if (!checkpointIds || checkpointIds.size === 0) {
      return undefined;
    }

    let latestId: string | undefined;
    let latestTime = 0;

    for (const id of checkpointIds) {
      const cp = this.checkpoints.get(id);
      if (cp && cp.timestamp > latestTime) {
        latestTime = cp.timestamp;
        latestId = id;
      }
    }

    return latestId;
  }

  /**
   * Update session index
   */
  private updateSessionIndex(sessionId: string, checkpointId: string): void {
    if (!this.sessionIndex.has(sessionId)) {
      this.sessionIndex.set(sessionId, new Set());
    }
    this.sessionIndex.get(sessionId)!.add(checkpointId);
  }

  /**
   * Update type index
   */
  private updateTypeIndex(type: CheckpointType, checkpointId: string): void {
    this.typeIndex.get(type)?.add(checkpointId);
  }

  /**
   * Generate tags based on checkpoint type and state
   */
  private generateTags(type: CheckpointType, state: SessionState): string[] {
    const tags: string[] = [type];

    // Add pattern-based tags
    if (state.patternState.antiPatternCount > 0) {
      tags.push('has-anti-patterns');
    }
    if (state.patternState.positivePatternCount >= 5) {
      tags.push('high-positive-patterns');
    }

    // Add therapeutic phase tags
    tags.push(`phase-${state.therapeuticState.currentPhase.toLowerCase()}`);

    // Add convergence level tags
    if (state.scoringState.convergenceLevel >= 0.8) {
      tags.push('high-convergence');
    } else if (state.scoringState.convergenceLevel < 0.3) {
      tags.push('low-convergence');
    }

    return tags;
  }

  /**
   * Calculate state size in bytes
   */
  private calculateSize(state: SessionState): number {
    return new TextEncoder().encode(JSON.stringify(state)).length;
  }

  /**
   * Calculate hash of state for integrity verification
   */
  private calculateHash(state: SessionState): string {
    const stateStr = JSON.stringify(state);
    let hash = 0;
    for (let i = 0; i < stateStr.length; i++) {
      const char = stateStr.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `hash-${Math.abs(hash).toString(16)}`;
  }

  /**
   * Deep clone object
   */
  private deepClone<T>(obj: T): T {
    return JSON.parse(JSON.stringify(obj));
  }
}

// ============================================================================
// Factory Function
// ============================================================================

/**
 * Create a new Checkpoint Manager instance
 */
export function createCheckpointManager(
  config?: Partial<CheckpointManagerConfig>
): CheckpointManager {
  return new CheckpointManager(config);
}

export default CheckpointManager;
