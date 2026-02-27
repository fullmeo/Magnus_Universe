/**
 * REMOTION AGENT - COMPREHENSIVE TYPE DEFINITIONS
 *
 * TypeScript interfaces, types, and enums for the entire system
 * Provides complete type safety for all components
 *
 * Based on Magnus 13.2 Architecture
 * Sacred Geometry & 432Hz Integration
 */

// ============================================================================
// COMPOSITION TYPES
// ============================================================================

export interface CompositionRequest {
  audioPath?: string;
  audioBuffer?: Float32Array;
  metadata: CompositionMetadata;
  template?: string;
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
  primaryType: VisualizationType;
  secondaryType?: VisualizationType;
  colorScheme?: ColorScheme;
  geometryShape?: PlatonicSolid;
  animationStyle?: AnimationStyle;
  intensity?: IntensityLevel;
}

export interface RenderSettings {
  fps?: number;
  resolution?: Resolution;
  qualityPreset?: QualityPreset;
  outputFormats?: VideoOutputFormat[];
  backgroundBehavior?: 'static' | 'dynamic' | 'transparent';
  audioSync?: 'tight' | 'loose' | 'none';
}

export interface CompositionOptions {
  enableSacredGeometry?: boolean;
  enable432Hz?: boolean;
  enablePythagorean?: boolean;
  customParameters?: Record<string, unknown>;
}

export type VideoOutputFormat = 'mp4' | 'webm' | 'gif' | 'mov' | 'mkv' | 'hevc';
export type QualityPreset = 'fast' | 'balanced' | 'high' | 'master';
export type Resolution = '1280x720' | '1920x1080' | '2560x1440' | '3840x2160';
export type VisualizationType = 'sacred-geometry' | 'frequency-spectrum' | 'waveform' | 'abstract-pattern' | 'particles';
export type ColorScheme = 'warm-earth' | 'cool-water' | 'vibrant-energy' | 'monochrome' | 'psychedelic' | 'cosmic';
export type AnimationStyle = 'smooth' | 'rhythmic' | 'chaotic' | 'crystalline' | 'organic';
export type IntensityLevel = 'subtle' | 'moderate' | 'intense';

// ============================================================================
// COMPOSITION TEMPLATE TYPES
// ============================================================================

export interface CompositionTemplate {
  id: string;
  name: string;
  description: string;
  version: string;
  layers: LayerTemplate[];
  timeline: TimelineTemplate;
  supportedVisualizations: VisualizationType[];
  parameterOptions: CompositionParameters;
  estimatedRenderTime: Record<QualityPreset, number>;
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
  x: number | string;
  y: number | string;
  z?: number;
  rotation?: number;
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

export type EasingFunction =
  | 'linear'
  | 'easeIn'
  | 'easeOut'
  | 'easeInOut'
  | 'elasticIn'
  | 'elasticOut'
  | 'bounceIn'
  | 'bounceOut'
  | 'cubicIn'
  | 'cubicOut'
  | 'cubicInOut';

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

// ============================================================================
// AUDIO ANALYSIS TYPES
// ============================================================================

export interface AudioAnalysisResult {
  frequencies: Float32Array;
  frequencyBins: number;
  sampleRate: number;
  duration: number;
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
  confidence: AnalysisConfidence;
}

export interface AnalysisConfidence {
  beat: number;
  onset: number;
  fundamentalFrequency: number;
  tempo: number;
  overall: number;
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
  type: 'intro' | 'verse' | 'chorus' | 'bridge' | 'outro' | 'break' | 'buildup' | 'drop';
  confidence: number;
  label?: string;
}

export interface HarmonicData {
  frequency: number;
  magnitude: number;
  phase?: number;
  ratio?: number;
  note?: string;
  cents?: number;
  is432HzAligned?: boolean;
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
  phase: RenderPhase;
  compositionRequest: CompositionRequest;
  analysis?: AudioAnalysisResult;
  composition?: CompositionData;
  outputPath?: string;
  convergenceData?: ConvergenceData;
  errors?: RenderError[];
  metrics?: RenderMetrics;
  startTime?: number;
  endTime?: number;
  estimatedTimeRemaining?: number;
}

export type RenderJobStatus = 'queued' | 'analyzing' | 'composing' | 'rendering' | 'validating' | 'complete' | 'failed' | 'cancelled';
export type RenderPhase = 'initialization' | 'analysis' | 'composition' | 'rendering' | 'validation' | 'finalization';

export interface CompositionData {
  layers: CompositionLayer[];
  timeline: TimelineData;
  synchronization: SynchronizationMap;
  metadata: Record<string, unknown>;
  sacredGeometry?: SacredGeometryData;
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
  analysisTime: number;
  compositionTime: number;
  renderTime: number;
  validationTime: number;
  totalTime: number;
  fileSize: number;
  averageBitrate: number;
  peakMemory: number;
  averageCpuUsage: number;
  framesPerSecond: number;
  framesRendered: number;
}

export interface RenderError {
  phase: RenderPhase;
  code: string;
  message: string;
  details?: unknown;
  timestamp: number;
  recoverable: boolean;
}

export interface QualityValidationResult {
  isValid: boolean;
  score: number;
  metrics: QualityMetrics;
  issues: ValidationIssue[];
}

export interface QualityMetrics {
  audioSyncAccuracy: number;
  frameConsistency: number;
  colorDepth: number;
  audioBalance: number;
  visualClarity: number;
  geometricPrecision?: number;
  frequency432HzRepresentation?: number;
}

export interface ValidationIssue {
  severity: 'warning' | 'error' | 'critical';
  code: string;
  message: string;
  recommendation?: string;
}

// ============================================================================
// CONVERGENCE TYPES (Magnus Integration)
// ============================================================================

export interface ConvergenceData {
  recognitionScore: number;
  inevitabilityScore: number;
  coherenceScore: number;
  geometricAlignment: number;
  frequencyAccuracy: number;
  overallConvergence: number;
  outcome: ConvergenceOutcome;
  details: ConvergenceDetails;
  timestamp: number;
}

export type ConvergenceOutcome = 'converged' | 'partial' | 'failed';

export interface ConvergenceDetails {
  reasoning: string[];
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
}

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
  agents: AgentAllocation;
  convergenceThresholds: ConvergenceThresholds;
  apiUrl: string;
  sessionTimeout: number;
}

export interface AgentAllocation {
  primary: AgentSpec;
  testing: AgentSpec;
  deployment: AgentSpec;
  specialist?: AgentSpec;
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
  minOverallScore: number;
}

export interface MagnusSessionContext {
  sessionId: string;
  orchestrator: string;
  strategy: string;
  allocatedAgents: AgentSpec[];
  analysis: unknown;
  convergenceThresholds: ConvergenceThresholds;
  request: CompositionRequest;
  startTime: number;
  lastUpdate: number;
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
  decisions: LearningDecisions;
  outcomes: LearningOutcomes;
  timestamp: number;
}

export interface LearningDecisions {
  template: string;
  visualizations: string[];
  qualityPreset: QualityPreset;
  outputFormats: VideoOutputFormat[];
  sacredGeometryEnabled: boolean;
  frequency432HzEnabled: boolean;
}

export interface LearningOutcomes {
  convergenceScore: number;
  renderTime: number;
  fileSize: number;
  qualityMetrics: RenderMetrics;
  success: boolean;
  errors?: string[];
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

export type PlatonicSolid = 'tetrahedron' | 'cube' | 'octahedron' | 'dodecahedron' | 'icosahedron' | 'spiral' | 'torus' | 'merkaba';

export interface SacredGeometryData {
  shape: PlatonicSolid;
  vertices: Vector3[];
  edges: Edge[];
  faces: Face[];
  animations: GeometryAnimation[];
}

export interface SacredGeometryProperties {
  phi: number;           // Golden ratio: 1.618033988749...
  phiSquared: number;    // Golden ratio squared: 2.618...
  phiInverse: number;    // 1/phi: 0.618...
  fibonacci: number[];
  platonic: PlatonicProperties;
  pythagorean: PythagoreanRatios;
}

export interface PlatonicProperties {
  vertices: Vector3[];
  edges: [number, number][];
  faces: number[][];
  symmetryGroup: string;
  element: string;
  dualSolid: PlatonicSolid;
}

export interface Vector3 {
  x: number;
  y: number;
  z: number;
}

export interface Edge {
  start: number;
  end: number;
  color?: string;
}

export interface Face {
  vertices: number[];
  color?: string;
  opacity?: number;
}

export interface GeometryAnimation {
  type: 'rotation' | 'scale' | 'morph' | 'pulse' | 'color';
  property: string;
  keyframes: AnimationKeyframe[];
}

export interface PythagoreanRatios {
  unison: [number, number];
  minorSecond: [number, number];
  majorSecond: [number, number];
  minorThird: [number, number];
  majorThird: [number, number];
  perfectFourth: [number, number];
  augmentedFourth: [number, number];
  perfectFifth: [number, number];
  minorSixth: [number, number];
  majorSixth: [number, number];
  minorSeventh: [number, number];
  majorSeventh: [number, number];
  octave: [number, number];
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
  baseFrequency: number;
  emphasis: number;
  harmonicSeries: number[];
  visualization: 'highlight' | 'primary' | 'background';
}

// ============================================================================
// API TYPES
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
  audioBuffer?: string; // Base64 encoded
  metadata: CompositionMetadata;
  template?: string;
  outputFormat?: VideoOutputFormat;
  qualityPreset?: QualityPreset;
  options?: CompositionOptions;
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
  phase: RenderPhase;
  progress: number;
  outputPath?: string;
  convergenceData?: ConvergenceData;
  errors?: RenderError[];
  metrics?: RenderMetrics;
}

// ============================================================================
// MONITORING TYPES
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
  components: HealthComponents;
  timestamp: number;
  uptime: number;
}

export interface HealthComponents {
  remotion: ComponentHealth;
  audioProcessing: ComponentHealth;
  storage: ComponentHealth;
  api: ComponentHealth;
  memory: ComponentHealth;
  magnus: ComponentHealth;
}

export interface ComponentHealth {
  status: 'healthy' | 'degraded' | 'unhealthy';
  lastCheck: number;
  metrics?: Record<string, unknown>;
  message?: string;
}

// ============================================================================
// CONFIGURATION TYPES
// ============================================================================

export interface RemotionAgentConfig {
  general: GeneralConfig;
  remotion: RemotionConfig;
  paths: PathsConfig;
  quality: QualityConfig;
  magnus: MagnusConfig;
  sacred: SacredConfig;
  monitoring: MonitoringConfig;
  api: APIConfig;
}

export interface GeneralConfig {
  name: string;
  version: string;
  environment: 'development' | 'staging' | 'production';
  debug: boolean;
}

export interface RemotionConfig {
  concurrency: number;
  timeout: number;
  logLevel: 'verbose' | 'normal' | 'quiet';
}

export interface PathsConfig {
  tempDir: string;
  outputDir: string;
  logDir: string;
  cacheDir: string;
}

export interface QualityConfig {
  defaultPreset: QualityPreset;
  validateOutput: boolean;
  autoOptimize: boolean;
}

export interface MagnusConfig {
  enabled: boolean;
  apiUrl: string;
  sessionTimeout: number;
}

export interface SacredConfig {
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
}

export interface MonitoringConfig {
  enabled: boolean;
  metricsCollectionInterval: number;
  alertThresholds: AlertThresholds;
}

export interface AlertThresholds {
  maxRenderTime: number;
  maxMemoryUsage: number;
  maxErrorRate: number;
  minConvergenceScore: number;
}

export interface APIConfig {
  port: number;
  host: string;
  corsEnabled: boolean;
  rateLimit: RateLimitConfig;
}

export interface RateLimitConfig {
  enabled: boolean;
  requestsPerMinute: number;
  burst: number;
}

// ============================================================================
// TYPE GUARDS & UTILITIES
// ============================================================================

export const TypeGuards = {
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
  },

  isPlatonicSolid(value: unknown): value is PlatonicSolid {
    const solids: PlatonicSolid[] = ['tetrahedron', 'cube', 'octahedron', 'dodecahedron', 'icosahedron', 'spiral', 'torus', 'merkaba'];
    return solids.includes(value as PlatonicSolid);
  },

  isRenderJobStatus(value: unknown): value is RenderJobStatus {
    const statuses: RenderJobStatus[] = ['queued', 'analyzing', 'composing', 'rendering', 'validating', 'complete', 'failed', 'cancelled'];
    return statuses.includes(value as RenderJobStatus);
  }
};

// ============================================================================
// CONSTANTS
// ============================================================================

export const SACRED_CONSTANTS = {
  PHI: 1.618033988749894848204586834365638117720309179805762862135,
  PHI_SQUARED: 2.618033988749894848204586834365638117720309179805762862135,
  PHI_INVERSE: 0.618033988749894848204586834365638117720309179805762862135,
  FREQUENCY_432HZ: 432,
  FREQUENCY_432HZ_HARMONICS: [432, 864, 1296, 1728, 2160, 2592, 3024, 3456, 3888, 4320],
  FIBONACCI: [1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, 233, 377, 610, 987, 1597, 2584],
  PYTHAGOREAN_RATIOS: {
    unison: [1, 1],
    minorSecond: [16, 15],
    majorSecond: [9, 8],
    minorThird: [6, 5],
    majorThird: [5, 4],
    perfectFourth: [4, 3],
    augmentedFourth: [45, 32],
    perfectFifth: [3, 2],
    minorSixth: [8, 5],
    majorSixth: [5, 3],
    minorSeventh: [9, 5],
    majorSeventh: [15, 8],
    octave: [2, 1]
  }
} as const;

export default {
  TypeGuards,
  SACRED_CONSTANTS
};
