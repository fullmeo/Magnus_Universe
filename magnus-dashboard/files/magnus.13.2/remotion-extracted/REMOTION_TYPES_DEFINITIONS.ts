/**
 * REMOTION MODULE - COMPREHENSIVE TYPE DEFINITIONS
 * 
 * TypeScript interfaces, types, and enums for the entire system
 * Provides complete type safety for all components
 */

// ============================================================================
// COMPOSITION TYPES
// ============================================================================

export interface CompositionRequest {
  audioPath: string;
  audioBuffer?: AudioBuffer | Float32Array;
  metadata: CompositionMetadata;
  template?: CompositionTemplate;
  outputFormat?: VideoOutputFormat;
  qualityPreset?: QualityPreset;
  options?: CompositionOptions;
}

export interface CompositionMetadata {
  title: string;
  description?: string;
  tempo?: number;
  key?: string;
  duration: number; // milliseconds
  artist?: string;
  moodTags?: string[];
  frequencyProfile?: FrequencyProfile;
  visualizationPreference?: VisualizationPreference;
  renderSettings?: RenderSettings;
}

export interface FrequencyProfile {
  fundamentalFrequency?: number;
  dominantFrequencies?: number[];
  dominantBass?: boolean;
  richHarmonics?: boolean;
  spectralCentroid?: number;
  spectralSpread?: number;
  spectralFlux?: number;
}

export interface VisualizationPreference {
  primaryType: 'sacred-geometry' | 'frequency-spectrum' | 'waveform' | 'abstract-pattern';
  secondaryType?: 'sacred-geometry' | 'frequency-spectrum' | 'waveform' | 'abstract-pattern';
  colorScheme?: 'warm-earth' | 'cool-water' | 'vibrant-energy' | 'monochrome' | 'psychedelic';
  geometryShape?: 'tetrahedron' | 'cube' | 'octahedron' | 'dodecahedron' | 'icosahedron' | 'spiral';
  animationStyle?: 'smooth' | 'rhythmic' | 'chaotic' | 'crystalline';
  intensity?: 'subtle' | 'moderate' | 'intense';
}

export interface RenderSettings {
  fps?: number;
  resolution?: '1280x720' | '1920x1080' | '2560x1440' | '3840x2160';
  qualityPreset?: QualityPreset;
  outputFormats?: VideoOutputFormat[];
  backgroundBehavior?: 'static' | 'dynamic' | 'transparent';
  audioSync?: 'tight' | 'loose' | 'none';
}

export type VideoOutputFormat = 'mp4' | 'webm' | 'gif' | 'mov' | 'mkv' | 'hevc';
export type QualityPreset = 'fast' | 'balanced' | 'high' | 'master';

export interface CompositionTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  layers: LayerTemplate[];
  timeline: TimelineTemplate;
  supportedVisualizations: VisualizationType[];
  parameterOptions: CompositionParameters;
  estimatedRenderTime: {
    [key in QualityPreset]: number;
  };
}

export interface LayerTemplate {
  id: string;
  name: string;
  type: LayerType;
  position: LayerPosition;
  size: Size;
  opacity?: number;
  blendMode?: BlendMode;
  visible?: boolean;
  properties?: Record<string, unknown>;
}

export type LayerType = 'geometry' | 'waveform' | 'spectrum' | 'text' | 'background' | 'particle' | 'effect';
export type BlendMode = 'normal' | 'add' | 'multiply' | 'screen' | 'overlay' | 'darken' | 'lighten';

export interface LayerPosition {
  x: number | string; // pixels or percentage
  y: number | string;
  z?: number;
  rotation?: number; // degrees
  scale?: number;
}

export interface Size {
  width: number;
  height: number;
}

export interface TimelineTemplate {
  duration: number;
  fps: number;
  keyframes: Keyframe[];
  events: TimelineEvent[];
}

export interface Keyframe {
  frameNumber: number;
  time: number;
  properties: Record<string, unknown>;
  easing?: EasingFunction;
  description?: string;
}

export type EasingFunction = 'linear' | 'easeIn' | 'easeOut' | 'easeInOut' | 'elasticIn' | 'elasticOut' | 'bounceIn' | 'bounceOut';

export interface TimelineEvent {
  time: number;
  type: 'beat' | 'onset' | 'peak' | 'section' | 'custom';
  metadata?: Record<string, unknown>;
}

export interface CompositionParameters {
  allowLayerToggling?: boolean;
  allowVisualizationSwap?: boolean;
  allowColorCustomization?: boolean;
  allowSpeedControl?: boolean;
  customParameters?: Record<string, ParameterOption>;
}

export interface ParameterOption {
  type: 'number' | 'string' | 'boolean' | 'select';
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  default: unknown;
}

export type VisualizationType = 'sacred-geometry' | 'frequency-spectrum' | 'waveform' | 'abstract-pattern';

// ============================================================================
// AUDIO TYPES
// ============================================================================

export interface AudioBuffer {
  numberOfChannels: number;
  length: number;
  sampleRate: number;
  getChannelData(channel: number): Float32Array;
}

export interface AudioAnalysisResult {
  frequencies: Float32Array;
  frequencyBins: number;
  sampleRate: number;
  beats: BeatData[];
  onsets: number[];
  peaks: PeakData[];
  energy: number[];
  rms: number[];
  structure: Section[];
  fundamentalFrequency: number;
  harmonics: HarmonicData[];
  spectralCentroid: number[];
  spectralSpread: number[];
  spectralFlux: number[];
  mfcc: number[][];
  tempogram: number[];
  estimatedTempo: number;
  confidence: {
    beat: number;
    onset: number;
    fundamentalFrequency: number;
  };
}

export interface BeatData {
  time: number;
  frameIndex: number;
  confidence: number;
  type: 'downbeat' | 'beat';
  strength: number;
}

export interface PeakData {
  time: number;
  frameIndex: number;
  frequency: number;
  magnitude: number;
  type: 'energy' | 'frequency' | 'spectral';
}

export interface Section {
  startTime: number;
  endTime: number;
  type: 'intro' | 'verse' | 'chorus' | 'bridge' | 'outro' | 'break';
  confidence: number;
  label?: string;
}

export interface HarmonicData {
  frequency: number;
  magnitude: number;
  phase?: number;
  ratio?: number; // ratio to fundamental
  note?: string;
  cents?: number;
}

export interface FrequencyBand {
  name: string;
  frequencyRange: [number, number];
  color: string;
  emphasis?: boolean;
}

export interface SynchronizationMap {
  beatFrames: number[];
  onsetFrames: number[];
  peakFrames: number[];
  syncPoints: SyncPoint[];
  confidence: number;
}

export interface SyncPoint {
  audioTime: number;
  frameNumber: number;
  type: 'beat' | 'onset' | 'peak' | 'visual';
  strength: number;
}

// ============================================================================
// RENDERING TYPES
// ============================================================================

export interface RenderJob {
  jobId: string;
  sessionId: string;
  status: RenderJobStatus;
  progress: number;
  compositionRequest: CompositionRequest;
  analysis?: AudioAnalysisResult;
  composition?: CompositionData;
  outputPath?: string;
  convergenceData?: ConvergenceData;
  errors?: RenderError[];
  metrics?: RenderMetrics;
  startTime?: number;
  endTime?: number;
}

export type RenderJobStatus = 'queued' | 'analyzing' | 'composing' | 'rendering' | 'validating' | 'complete' | 'failed' | 'cancelled';

export interface CompositionData {
  layers: CompositionLayer[];
  timeline: TimelineData;
  synchronization: SynchronizationMap;
  metadata: Record<string, unknown>;
}

export interface CompositionLayer {
  id: string;
  name: string;
  type: LayerType;
  animations: Animation[];
  properties: Record<string, unknown>;
  visibility: VisibilityKeyframe[];
}

export interface Animation {
  property: string;
  keyframes: AnimationKeyframe[];
  easing: EasingFunction;
}

export interface AnimationKeyframe {
  time: number;
  frameNumber: number;
  value: unknown;
  easing?: EasingFunction;
}

export interface VisibilityKeyframe {
  frameNumber: number;
  visible: boolean;
}

export interface TimelineData {
  fps: number;
  duration: number;
  totalFrames: number;
  events: TimelineEvent[];
}

export interface RenderMetrics {
  compositionTime: number;
  renderTime: number;
  validationTime: number;
  totalTime: number;
  fileSize: number;
  averageBitrate: number;
  peakMemory: number;
  averageCpuUsage: number;
  framesPerSecond: number;
}

export interface RenderError {
  phase: RenderJobStatus;
  code: string;
  message: string;
  details?: unknown;
  timestamp: number;
  recoverable: boolean;
}

export interface QualityValidationResult {
  isValid: boolean;
  score: number;
  metrics: {
    audioSyncAccuracy: number;
    frameConsistency: number;
    colorDepth: number;
    audioBalance: number;
    visualClarity: number;
  };
  issues: ValidationIssue[];
}

export interface ValidationIssue {
  severity: 'warning' | 'error' | 'critical';
  code: string;
  message: string;
  recommendation?: string;
}

// ============================================================================
// CONVERGENCE TYPES
// ============================================================================

export interface ConvergenceData {
  recognitionScore: number;
  inevitabilityScore: number;
  coherenceScore: number;
  geometricAlignment: number;
  frequencyAccuracy: number;
  overallConvergence: number;
  outcome: ConvergenceOutcome;
  details: Record<string, unknown>;
  timestamp: number;
}

export type ConvergenceOutcome = 'converged' | 'partial' | 'failed';

export interface ConvergenceAnalysis {
  intention: string;
  audioAnalysis: AudioAnalysisResult;
  outputAnalysis: OutputAnalysis;
  developerFeedback?: DeveloperFeedback;
  scores: ConvergenceScores;
  reasoning: string[];
}

export interface OutputAnalysis {
  videoMetrics: VideoMetrics;
  geometricProperties: GeometricAnalysis;
  frequencyRepresentation: FrequencyAnalysis;
  visualCoherence: number;
}

export interface VideoMetrics {
  resolution: string;
  fps: number;
  duration: number;
  bitrate: number;
  codec: string;
  colorSpace: string;
}

export interface GeometricAnalysis {
  detectedShapes: string[];
  goldenRatioAdherence: number;
  proportionAccuracy: number;
  symmetryScore: number;
  complexityLevel: number;
}

export interface FrequencyAnalysis {
  fundamental432HzAlignment: number;
  harmonicRepresentation: number;
  spectralBalance: number;
  frequencyDistribution: FrequencyDistribution;
}

export interface FrequencyDistribution {
  bass: number;
  lowMid: number;
  mid: number;
  highMid: number;
  treble: number;
}

export interface ConvergenceScores {
  recognition: number;
  inevitability: number;
  coherence: number;
  geometric: number;
  frequency: number;
  overall: number;
}

export interface DeveloperFeedback {
  recognizes: boolean;
  feedback: string;
  suggestions?: string[];
  score?: number;
}

// ============================================================================
// MAGNUS INTEGRATION TYPES
// ============================================================================

export interface MagnusAgentConfig {
  orchestratorName: string;
  orchestrationMode: 'autonomous' | 'orchestrated';
  agents: {
    primary: AgentSpec;
    testing: AgentSpec;
    deployment: AgentSpec;
    specialist?: AgentSpec;
  };
  convergenceThresholds: ConvergenceThresholds;
}

export interface AgentSpec {
  name: string;
  role: string;
  capabilities: string[];
  platform?: 'claude' | 'kilo' | 'gpt' | 'other';
}

export interface ConvergenceThresholds {
  minRecognitionScore: number;
  minInevitabilityScore: number;
  minCoherenceScore: number;
  minGeometricAlignment?: number;
  minFrequencyAccuracy?: number;
}

export interface MagnusSessionContext {
  sessionId: string;
  orchestrator: string;
  strategy: string;
  allocatedAgents: AgentSpec[];
  analysis: unknown; // Full analysis from Magnus
  convergenceThresholds: ConvergenceThresholds;
  request: CompositionRequest;
}

export interface EstimateData {
  scope: 'simple' | 'moderate' | 'complex' | 'expert';
  renderTimeEstimate: number;
  memoryEstimate: number;
  cpuEstimate: number;
  fileSize: number;
  iterationsEstimated: number;
}

export interface LearningRecord {
  sessionId: string;
  orchestrator: string;
  strategy: string;
  agents: AgentSpec[];
  request: CompositionRequest;
  decisions: {
    template: CompositionTemplate;
    visualizations: string[];
    qualityPreset: QualityPreset;
    outputFormats: VideoOutputFormat[];
  };
  outcomes: {
    convergenceScore: number;
    renderTime: number;
    fileSize: number;
    qualityMetrics: RenderMetrics;
    success: boolean;
  };
  timestamp: number;
}

// ============================================================================
// SACRED GEOMETRY TYPES
// ============================================================================

export interface SacredGeometryConfig {
  enabled: boolean;
  shape: PlatonicSolid;
  goldenRatioScale: number;
  rotationSpeed: number;
  colorMapping: ColorMapping;
  pulseResponse: boolean;
  harmonicAlignment: boolean;
}

export type PlatonicSolid = 'tetrahedron' | 'cube' | 'octahedron' | 'dodecahedron' | 'icosahedron' | 'spiral';

export interface SacredGeometryProperties {
  φ: number; // Golden ratio: 1.618033988749...
  φ²: number; // Golden ratio squared: 2.618...
  φ_inverse: number; // 1/φ: 0.618...
  fibonacci: number[];
  platonic: PlatonicProperties;
  pythagorean: PythagoreanRatios;
}

export interface PlatonicProperties {
  vertices: Vector3[];
  edges: [number, number][];
  faces: number[][];
  symmetryGroup: string;
  element: string; // air, earth, water, fire, universe
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface PythagoreanRatios {
  unison: [number, number]; // [1, 1]
  minorSecond: [number, number]; // [16, 15]
  majorSecond: [number, number]; // [9, 8]
  minorThird: [number, number]; // [6, 5]
  majorThird: [number, number]; // [5, 4]
  perfectFourth: [number, number]; // [4, 3]
  augmentedFourth: [number, number]; // [45, 32]
  perfectFifth: [number, number]; // [3, 2]
  minorSixth: [number, number]; // [8, 5]
  majorSixth: [number, number]; // [5, 3]
  minorSeventh: [number, number]; // [9, 5]
  majorSeventh: [number, number]; // [15, 8]
  octave: [number, number]; // [2, 1]
}

export interface ColorMapping {
  mode: 'frequency' | 'harmonic' | 'energy' | 'custom';
  colorSpace: 'hsl' | 'rgb' | 'hsv' | 'lab';
  baseColor?: string;
  palette?: string[];
  frequencyToHue?: (frequency: number) => number;
}

export interface Frequency432HzConfig {
  enabled: boolean;
  baseFrequency: number; // 432
  emphasis: number; // 0-1, how much to emphasize
  harmonicSeries: number[];
  visualization: 'highlight' | 'primary' | 'background';
}

// ============================================================================
// API & REQUEST/RESPONSE TYPES
// ============================================================================

export interface APIRequest<T = unknown> {
  id?: string;
  timestamp: number;
  payload: T;
  metadata?: Record<string, unknown>;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: APIError;
  metadata?: ResponseMetadata;
  timestamp: number;
}

export interface APIError {
  code: string;
  message: string;
  details?: unknown;
  retryable: boolean;
}

export interface ResponseMetadata {
  processingTime: number;
  requestId: string;
  version: string;
}

export interface ComposeRequest {
  audioPath?: string;
  audioBuffer?: Float32Array;
  metadata: CompositionMetadata;
  template?: string;
  outputFormat?: VideoOutputFormat;
  qualityPreset?: QualityPreset;
}

export interface ComposeResponse {
  jobId: string;
  sessionId: string;
  estimate: EstimateData;
  status: RenderJobStatus;
}

export interface JobStatusResponse {
  jobId: string;
  status: RenderJobStatus;
  progress: number;
  outputPath?: string;
  convergenceData?: ConvergenceData;
  errors?: RenderError[];
}

// ============================================================================
// MONITORING & LOGGING TYPES
// ============================================================================

export interface MonitoringEvent {
  timestamp: number;
  eventType: EventType;
  jobId?: string;
  severity: 'debug' | 'info' | 'warn' | 'error';
  message: string;
  metadata?: Record<string, unknown>;
}

export type EventType = 'task_start' | 'task_complete' | 'error' | 'warning' | 'metric' | 'performance' | 'resource' | 'health';

export interface HealthCheck {
  status: 'healthy' | 'degraded' | 'unhealthy';
  components: {
    remotion: ComponentHealth;
    audioProcessing: ComponentHealth;
    storage: ComponentHealth;
    api: ComponentHealth;
    memory: ComponentHealth;
  };
  timestamp: number;
}

export interface ComponentHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: number;
  metrics?: Record<string, unknown>;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface RemotionModuleConfig {
  general: {
    name: string;
    version: string;
    environment: 'development' | 'staging' | 'production';
    debug: boolean;
  };
  remotion: {
    concurrency: number;
    timeout: number;
    logLevel: 'verbose' | 'normal' | 'quiet';
  };
  paths: {
    tempDir: string;
    outputDir: string;
    logDir: string;
    cacheDir: string;
  };
  quality: {
    defaultPreset: QualityPreset;
    validateOutput: boolean;
    autoOptimize: boolean;
  };
  magnus: {
    enabled: boolean;
    apiUrl: string;
    sessionTimeout: number;
  };
  sacred: {
    geometry: {
      enabled: boolean;
      defaultShape: PlatonicSolid;
      goldenRatioMode: boolean;
    };
    frequency432Hz: {
      enabled: boolean;
      emphasis: number;
    };
    pythagorean: {
      enabled: boolean;
      intervalMode: 'strict' | 'flexible';
    };
  };
  monitoring: {
    enabled: boolean;
    metricsCollectionInterval: number;
    alertThresholds: AlertThresholds;
  };
  api: {
    port: number;
    host: string;
    corsEnabled: boolean;
    rateLimit: RateLimitConfig;
  };
}

export interface AlertThresholds {
  maxRenderTime: number;
  maxMemoryUsage: number;
  maxErrorRate: number;
  minConvergenceScore: number;
}

export interface RateLimitConfig {
  enabled: boolean;
  requestsPerMinute: number;
  burst: number;
}

export default {
  // Type guard helpers
  isCompositionRequest(obj: unknown): obj is CompositionRequest {
    return obj !== null && typeof obj === 'object' && 'metadata' in (obj as Record<string, unknown>);
  },

  isConvergenceOutcome(value: unknown): value is ConvergenceOutcome {
    return value === 'converged' || value === 'partial' || value === 'failed';
  },

  isVideoOutputFormat(value: unknown): value is VideoOutputFormat {
    const formats: VideoOutputFormat[] = ['mp4', 'webm', 'gif', 'mov', 'mkv', 'hevc'];
    return formats.includes(value as VideoOutputFormat);
  },

  isQualityPreset(value: unknown): value is QualityPreset {
    const presets: QualityPreset[] = ['fast', 'balanced', 'high', 'master'];
    return presets.includes(value as QualityPreset);
  }
};
