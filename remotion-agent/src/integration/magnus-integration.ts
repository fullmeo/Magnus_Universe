/**
 * REMOTION AGENT - MAGNUS 14 INTEGRATION
 *
 * Connects Remotion Agent to Magnus 13.2/14 orchestration system
 * Handles session management, agent registration, and learning feedback
 */

import {
  MagnusAgentConfig,
  MagnusSessionContext,
  AgentSpec,
  ConvergenceThresholds,
  LearningRecord,
  LearningDecisions,
  LearningOutcomes,
  CompositionRequest,
  RenderJob,
  RenderJobStatus,
  RenderPhase,
  ConvergenceData,
  EstimateData,
  RenderMetrics
} from '../types';
import { createLogger, RemotionLogger } from '../utils/logger';
import { MagnusIntegrationError } from '../utils/error-handler';
import { defaultConfig } from '../config/defaults';

// ============================================================================
// MAGNUS INTEGRATION TYPES
// ============================================================================

export interface MagnusIntegrationConfig {
  apiUrl?: string;
  enabled?: boolean;
  sessionTimeout?: number;
  orchestratorName?: string;
}

export interface SessionUpdateData {
  phase?: RenderPhase;
  status?: RenderJobStatus;
  progress?: number;
  convergenceData?: ConvergenceData;
  outputPath?: string;
  error?: string;
}

// ============================================================================
// MAGNUS INTEGRATION CLASS
// ============================================================================

export class MagnusIntegration {
  private config: Required<MagnusIntegrationConfig>;
  private logger: RemotionLogger;
  private activeSessions: Map<string, MagnusSessionContext> = new Map();
  private wsConnection: WebSocket | null = null;

  constructor(config: MagnusIntegrationConfig = {}) {
    this.config = {
      apiUrl: config.apiUrl ?? defaultConfig.magnus.apiUrl,
      enabled: config.enabled ?? defaultConfig.magnus.enabled,
      sessionTimeout: config.sessionTimeout ?? defaultConfig.magnus.sessionTimeout,
      orchestratorName: config.orchestratorName ?? 'Serigne DIAGNE'
    };

    this.logger = createLogger();

    if (this.config.enabled) {
      this.logger.magnusEvent('integration_initialized', { apiUrl: this.config.apiUrl });
    }
  }

  /**
   * Register Remotion as a Magnus agent
   */
  async registerAgent(): Promise<boolean> {
    if (!this.config.enabled) {
      this.logger.info('Magnus integration disabled, skipping agent registration');
      return false;
    }

    const agentConfig: AgentSpec = {
      name: 'remotion-orchestrator',
      role: 'Video Composition & Visualization',
      capabilities: [
        'audio-analysis',
        'composition-building',
        'sacred-geometry',
        'frequency-visualization',
        'video-rendering',
        'convergence-validation'
      ],
      platform: 'claude'
    };

    try {
      const response = await this.makeRequest('/api/magnus/agents/register', 'POST', {
        agent: agentConfig,
        requirements: {
          minMemory: 2000,
          minDiskSpace: 10000,
          cpuCores: 2
        }
      });

      this.logger.magnusEvent('agent_registered', { agent: agentConfig.name });
      return true;
    } catch (error) {
      this.logger.warn('Failed to register agent with Magnus', { error });
      return false;
    }
  }

  /**
   * Create a new session for a composition job
   */
  async createSession(
    request: CompositionRequest,
    jobId: string
  ): Promise<MagnusSessionContext> {
    const sessionId = this.generateSessionId();

    const context: MagnusSessionContext = {
      sessionId,
      orchestrator: this.config.orchestratorName,
      strategy: 'remotion-composition',
      allocatedAgents: [
        { name: 'remotion-orchestrator', role: 'primary', capabilities: ['composition', 'rendering'] },
        { name: 'kilo', role: 'testing', capabilities: ['validation'] }
      ],
      analysis: null,
      convergenceThresholds: {
        minRecognitionScore: 70,
        minInevitabilityScore: 60,
        minCoherenceScore: 70,
        minGeometricAlignment: 50,
        minFrequencyAccuracy: 50,
        minOverallScore: 80
      },
      request,
      startTime: Date.now(),
      lastUpdate: Date.now()
    };

    this.activeSessions.set(sessionId, context);

    if (this.config.enabled) {
      try {
        await this.makeRequest('/api/magnus/sessions', 'POST', {
          sessionId,
          jobId,
          orchestrator: context.orchestrator,
          strategy: context.strategy,
          request: {
            title: request.metadata.title,
            duration: request.metadata.duration,
            qualityPreset: request.qualityPreset
          }
        });

        this.logger.magnusEvent('session_created', { sessionId, jobId });
      } catch (error) {
        this.logger.warn('Failed to create session in Magnus', { error });
      }
    }

    return context;
  }

  /**
   * Update session status
   */
  async updateSession(sessionId: string, data: SessionUpdateData): Promise<void> {
    const session = this.activeSessions.get(sessionId);
    if (session) {
      session.lastUpdate = Date.now();
    }

    if (this.config.enabled) {
      try {
        await this.makeRequest(`/api/magnus/sessions/${sessionId}`, 'PATCH', {
          ...data,
          timestamp: Date.now()
        });

        this.logger.magnusEvent('session_updated', { sessionId, phase: data.phase, status: data.status });
      } catch (error) {
        this.logger.warn('Failed to update session in Magnus', { error });
      }
    }
  }

  /**
   * Complete a session
   */
  async completeSession(
    sessionId: string,
    convergence: ConvergenceData,
    outputPath: string,
    metrics: RenderMetrics
  ): Promise<void> {
    const session = this.activeSessions.get(sessionId);

    if (this.config.enabled && session) {
      try {
        await this.makeRequest(`/api/magnus/sessions/${sessionId}/complete`, 'POST', {
          convergenceData: convergence,
          outputPath,
          metrics,
          completedAt: Date.now()
        });

        // Record learning
        await this.recordLearning(session, convergence, metrics);

        this.logger.magnusEvent('session_completed', {
          sessionId,
          convergenceScore: convergence.overallConvergence,
          outcome: convergence.outcome
        });
      } catch (error) {
        this.logger.warn('Failed to complete session in Magnus', { error });
      }
    }

    this.activeSessions.delete(sessionId);
  }

  /**
   * Record learning data for Magnus optimization
   */
  async recordLearning(
    session: MagnusSessionContext,
    convergence: ConvergenceData,
    metrics: RenderMetrics
  ): Promise<void> {
    const record: LearningRecord = {
      sessionId: session.sessionId,
      orchestrator: session.orchestrator,
      strategy: session.strategy,
      agents: session.allocatedAgents,
      request: session.request,
      decisions: {
        template: 'default',
        visualizations: ['sacred-geometry', 'frequency-spectrum', 'waveform'],
        qualityPreset: session.request.qualityPreset ?? 'balanced',
        outputFormats: [session.request.outputFormat ?? 'mp4'],
        sacredGeometryEnabled: session.request.options?.enableSacredGeometry ?? true,
        frequency432HzEnabled: session.request.options?.enable432Hz ?? true
      },
      outcomes: {
        convergenceScore: convergence.overallConvergence,
        renderTime: metrics.renderTime,
        fileSize: metrics.fileSize,
        qualityMetrics: metrics,
        success: convergence.outcome === 'converged',
        errors: convergence.outcome === 'failed' ? ['Convergence failed'] : undefined
      },
      timestamp: Date.now()
    };

    if (this.config.enabled) {
      try {
        await this.makeRequest('/api/magnus/learning', 'POST', record);
        this.logger.magnusEvent('learning_recorded', {
          sessionId: session.sessionId,
          success: record.outcomes.success
        });
      } catch (error) {
        this.logger.warn('Failed to record learning in Magnus', { error });
      }
    }
  }

  /**
   * Get convergence thresholds for a session
   */
  getConvergenceThresholds(sessionId: string): ConvergenceThresholds {
    const session = this.activeSessions.get(sessionId);
    return session?.convergenceThresholds ?? {
      minRecognitionScore: 70,
      minInevitabilityScore: 60,
      minCoherenceScore: 70,
      minOverallScore: 80
    };
  }

  /**
   * Estimate job complexity
   */
  async estimateJob(request: CompositionRequest): Promise<EstimateData> {
    const duration = request.metadata.duration;
    const durationMinutes = duration / 60000;

    // Determine scope based on duration and options
    let scope: EstimateData['scope'] = 'simple';
    if (durationMinutes > 5) scope = 'complex';
    else if (durationMinutes > 2) scope = 'moderate';
    if (request.qualityPreset === 'master') scope = 'expert';

    // Estimate resources
    const baseRenderTime = durationMinutes * 2 * 60 * 1000; // 2x real-time for balanced
    const qualityMultiplier = {
      fast: 0.5,
      balanced: 1,
      high: 2,
      master: 3
    }[request.qualityPreset ?? 'balanced'];

    return {
      scope,
      renderTimeEstimate: baseRenderTime * qualityMultiplier,
      memoryEstimate: 1024 + (durationMinutes * 200), // MB
      cpuEstimate: 50 + (qualityMultiplier * 20), // percentage
      fileSize: durationMinutes * 50 * 1000000 * qualityMultiplier, // bytes
      iterationsEstimated: 1
    };
  }

  /**
   * Send real-time event via WebSocket
   */
  sendRealtimeEvent(event: string, data: Record<string, unknown>): void {
    if (this.wsConnection && this.wsConnection.readyState === WebSocket.OPEN) {
      this.wsConnection.send(JSON.stringify({ event, data, timestamp: Date.now() }));
    }
  }

  /**
   * Connect to Magnus WebSocket
   */
  async connectWebSocket(): Promise<void> {
    if (!this.config.enabled) return;

    const wsUrl = this.config.apiUrl.replace('http', 'ws') + '/ws/remotion';

    try {
      // Note: In a real implementation, use a proper WebSocket library for Node.js
      this.logger.magnusEvent('websocket_connecting', { url: wsUrl });

      // Placeholder - actual WebSocket connection would be implemented here
      // this.wsConnection = new WebSocket(wsUrl);
    } catch (error) {
      this.logger.warn('Failed to connect WebSocket', { error });
    }
  }

  /**
   * Make HTTP request to Magnus API
   */
  private async makeRequest(
    endpoint: string,
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE',
    data?: unknown
  ): Promise<unknown> {
    const url = `${this.config.apiUrl}${endpoint}`;

    try {
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'X-Agent': 'remotion-orchestrator'
        },
        body: data ? JSON.stringify(data) : undefined
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      return response.json();
    } catch (error) {
      // Don't throw for non-critical Magnus operations
      this.logger.debug('Magnus API request failed', { endpoint, error });
      return null;
    }
  }

  /**
   * Generate unique session ID
   */
  private generateSessionId(): string {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 8);
    return `rem-${timestamp}-${random}`;
  }

  /**
   * Get active session count
   */
  getActiveSessionCount(): number {
    return this.activeSessions.size;
  }

  /**
   * Get session by ID
   */
  getSession(sessionId: string): MagnusSessionContext | undefined {
    return this.activeSessions.get(sessionId);
  }

  /**
   * Check if integration is enabled
   */
  isEnabled(): boolean {
    return this.config.enabled;
  }

  /**
   * Cleanup expired sessions
   */
  cleanupExpiredSessions(): number {
    const now = Date.now();
    let cleaned = 0;

    for (const [sessionId, session] of this.activeSessions) {
      if (now - session.lastUpdate > this.config.sessionTimeout) {
        this.activeSessions.delete(sessionId);
        cleaned++;
      }
    }

    if (cleaned > 0) {
      this.logger.info('Cleaned up expired sessions', { count: cleaned });
    }

    return cleaned;
  }
}

export default MagnusIntegration;
