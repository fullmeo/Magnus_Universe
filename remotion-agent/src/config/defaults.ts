/**
 * REMOTION AGENT - DEFAULT CONFIGURATION
 *
 * Central configuration with sacred geometry constants
 * and 432Hz frequency settings
 */

import {
  RemotionAgentConfig,
  QualityPreset,
  PlatonicSolid,
  SACRED_CONSTANTS,
  FrequencyBand,
  CompositionTemplate,
  LayerType
} from '../types';

// ============================================================================
// MAIN CONFIGURATION
// ============================================================================

export const defaultConfig: RemotionAgentConfig = {
  general: {
    name: 'remotion-agent',
    version: '1.0.0',
    environment: (process.env.NODE_ENV as 'development' | 'staging' | 'production') || 'development',
    debug: process.env.NODE_ENV !== 'production'
  },
  remotion: {
    concurrency: parseInt(process.env.REMOTION_CONCURRENCY || '4', 10),
    timeout: parseInt(process.env.REMOTION_TIMEOUT || '3600000', 10),
    logLevel: 'normal'
  },
  paths: {
    tempDir: process.env.TEMP_DIR || './temp',
    outputDir: process.env.OUTPUT_DIR || './output',
    logDir: process.env.LOG_DIR || './logs',
    cacheDir: process.env.CACHE_DIR || './cache'
  },
  quality: {
    defaultPreset: (process.env.RENDER_QUALITY as QualityPreset) || 'balanced',
    validateOutput: process.env.VALIDATE_OUTPUT !== 'false',
    autoOptimize: process.env.AUTO_OPTIMIZE !== 'false'
  },
  magnus: {
    enabled: process.env.MAGNUS_ENABLED !== 'false',
    apiUrl: process.env.MAGNUS_API_URL || 'http://localhost:3000',
    sessionTimeout: parseInt(process.env.MAGNUS_SESSION_TIMEOUT || '3600000', 10)
  },
  sacred: {
    geometry: {
      enabled: process.env.SACRED_GEOMETRY_ENABLED !== 'false',
      defaultShape: (process.env.DEFAULT_PLATONIC_SOLID as PlatonicSolid) || 'dodecahedron',
      goldenRatioMode: process.env.GOLDEN_RATIO_MODE !== 'false'
    },
    frequency432Hz: {
      enabled: process.env.FREQUENCY_432HZ_ENABLED !== 'false',
      emphasis: parseFloat(process.env.FREQUENCY_432HZ_EMPHASIS || '0.5')
    },
    pythagorean: {
      enabled: process.env.PYTHAGOREAN_ENABLED !== 'false',
      intervalMode: (process.env.PYTHAGOREAN_INTERVAL_MODE as 'strict' | 'flexible') || 'strict'
    }
  },
  monitoring: {
    enabled: process.env.MONITORING_ENABLED !== 'false',
    metricsCollectionInterval: parseInt(process.env.METRICS_COLLECTION_INTERVAL || '30000', 10),
    alertThresholds: {
      maxRenderTime: parseInt(process.env.MAX_RENDER_TIME || '600000', 10),
      maxMemoryUsage: parseInt(process.env.MAX_MEMORY_USAGE || '4096', 10),
      maxErrorRate: parseFloat(process.env.MAX_ERROR_RATE || '0.1'),
      minConvergenceScore: parseInt(process.env.MIN_CONVERGENCE_SCORE || '80', 10)
    }
  },
  api: {
    port: parseInt(process.env.PORT || '3001', 10),
    host: process.env.HOST || 'localhost',
    corsEnabled: true,
    rateLimit: {
      enabled: process.env.RATE_LIMIT_ENABLED !== 'false',
      requestsPerMinute: parseInt(process.env.RATE_LIMIT_REQUESTS_PER_MINUTE || '60', 10),
      burst: parseInt(process.env.RATE_LIMIT_BURST || '10', 10)
    }
  }
};

// ============================================================================
// QUALITY PRESETS
// ============================================================================

export interface QualityPresetConfig {
  codec: string;
  bitrate: string;
  fps: number;
  format: string;
  sample: number;
  estimatedSizePerMinute: number; // MB
  estimatedTimePerMinute: number; // seconds
}

export const qualityPresets: Record<QualityPreset, QualityPresetConfig> = {
  fast: {
    codec: 'h264',
    bitrate: '2000k',
    fps: 24,
    format: 'mp4',
    sample: 2,
    estimatedSizePerMinute: 50,
    estimatedTimePerMinute: 30
  },
  balanced: {
    codec: 'h264',
    bitrate: '4000k',
    fps: 30,
    format: 'mp4',
    sample: 1,
    estimatedSizePerMinute: 150,
    estimatedTimePerMinute: 120
  },
  high: {
    codec: 'prores',
    bitrate: '8000k',
    fps: 60,
    format: 'mov',
    sample: 1,
    estimatedSizePerMinute: 300,
    estimatedTimePerMinute: 240
  },
  master: {
    codec: 'prores',
    bitrate: '12000k',
    fps: 60,
    format: 'mov',
    sample: 1,
    estimatedSizePerMinute: 450,
    estimatedTimePerMinute: 360
  }
};

// ============================================================================
// FREQUENCY BANDS
// ============================================================================

export const frequencyBands: FrequencyBand[] = [
  { name: 'sub-bass', frequencyRange: [20, 60], color: '#8B0000' },
  { name: 'bass', frequencyRange: [60, 250], color: '#FF4500' },
  { name: 'low-mid', frequencyRange: [250, 500], color: '#FFD700' },
  { name: 'mid', frequencyRange: [500, 2000], color: '#32CD32' },
  { name: 'high-mid', frequencyRange: [2000, 4000], color: '#00CED1' },
  { name: 'presence', frequencyRange: [4000, 6000], color: '#4169E1' },
  { name: 'brilliance', frequencyRange: [6000, 20000], color: '#9400D3' }
];

// 432 Hz specific bands with emphasis
export const frequency432HzBands: FrequencyBand[] = [
  { name: '432Hz-fundamental', frequencyRange: [428, 436], color: '#FFD700', emphasis: true },
  { name: '864Hz-octave', frequencyRange: [860, 868], color: '#FFA500', emphasis: true },
  { name: '1296Hz-5th', frequencyRange: [1292, 1300], color: '#FF8C00', emphasis: true },
  { name: '1728Hz-2nd-octave', frequencyRange: [1724, 1732], color: '#FF7F50', emphasis: true },
  { name: '2160Hz-major-3rd', frequencyRange: [2156, 2164], color: '#FF6347', emphasis: true }
];

// ============================================================================
// PLATONIC SOLID DEFINITIONS
// ============================================================================

export interface PlatonicSolidDefinition {
  name: PlatonicSolid;
  displayName: string;
  element: string;
  vertexCount: number;
  edgeCount: number;
  faceCount: number;
  faceShape: string;
  color: string;
  dualSolid: PlatonicSolid;
  symbolism: string;
}

export const platonicSolids: Record<PlatonicSolid, PlatonicSolidDefinition> = {
  tetrahedron: {
    name: 'tetrahedron',
    displayName: 'Tetrahedron',
    element: 'Fire',
    vertexCount: 4,
    edgeCount: 6,
    faceCount: 4,
    faceShape: 'triangle',
    color: '#FF4500',
    dualSolid: 'tetrahedron',
    symbolism: 'Transformation, willpower, manifestation'
  },
  cube: {
    name: 'cube',
    displayName: 'Hexahedron (Cube)',
    element: 'Earth',
    vertexCount: 8,
    edgeCount: 12,
    faceCount: 6,
    faceShape: 'square',
    color: '#8B4513',
    dualSolid: 'octahedron',
    symbolism: 'Stability, grounding, material foundation'
  },
  octahedron: {
    name: 'octahedron',
    displayName: 'Octahedron',
    element: 'Air',
    vertexCount: 6,
    edgeCount: 12,
    faceCount: 8,
    faceShape: 'triangle',
    color: '#00CED1',
    dualSolid: 'cube',
    symbolism: 'Intellect, communication, breath of life'
  },
  dodecahedron: {
    name: 'dodecahedron',
    displayName: 'Dodecahedron',
    element: 'Ether/Universe',
    vertexCount: 20,
    edgeCount: 30,
    faceCount: 12,
    faceShape: 'pentagon',
    color: '#9400D3',
    dualSolid: 'icosahedron',
    symbolism: 'Divine consciousness, cosmic order, phi ratios'
  },
  icosahedron: {
    name: 'icosahedron',
    displayName: 'Icosahedron',
    element: 'Water',
    vertexCount: 12,
    edgeCount: 30,
    faceCount: 20,
    faceShape: 'triangle',
    color: '#4169E1',
    dualSolid: 'dodecahedron',
    symbolism: 'Flow, emotions, adaptability'
  },
  spiral: {
    name: 'spiral',
    displayName: 'Golden Spiral',
    element: 'Growth',
    vertexCount: 0,
    edgeCount: 0,
    faceCount: 0,
    faceShape: 'curve',
    color: '#FFD700',
    dualSolid: 'spiral',
    symbolism: 'Natural growth, phi proportion, infinite expansion'
  },
  torus: {
    name: 'torus',
    displayName: 'Torus',
    element: 'Energy',
    vertexCount: 0,
    edgeCount: 0,
    faceCount: 0,
    faceShape: 'continuous',
    color: '#FF69B4',
    dualSolid: 'torus',
    symbolism: 'Energy flow, self-sustaining systems, unity'
  },
  merkaba: {
    name: 'merkaba',
    displayName: 'Merkaba (Star Tetrahedron)',
    element: 'Light',
    vertexCount: 8,
    edgeCount: 12,
    faceCount: 8,
    faceShape: 'triangle',
    color: '#FFFFFF',
    dualSolid: 'merkaba',
    symbolism: 'Light body, ascension, divine vehicle'
  }
};

// ============================================================================
// DEFAULT COMPOSITION TEMPLATE
// ============================================================================

export const defaultTemplate: CompositionTemplate = {
  id: 'default',
  name: 'Sacred Harmony',
  description: 'Default composition template with sacred geometry and 432Hz visualization',
  version: '1.0.0',
  layers: [
    {
      id: 'background',
      name: 'Background',
      type: 'background' as LayerType,
      position: { x: 0, y: 0, z: -100 },
      size: { width: 1920, height: 1080 },
      opacity: 1,
      visible: true,
      properties: {
        color: '#0a0a1a',
        gradient: ['#0a0a1a', '#1a1a3a']
      }
    },
    {
      id: 'geometry',
      name: 'Sacred Geometry',
      type: 'geometry' as LayerType,
      position: { x: '50%', y: '50%', z: 0 },
      size: { width: 600, height: 600 },
      opacity: 0.9,
      blendMode: 'add',
      visible: true,
      properties: {
        shape: 'dodecahedron',
        goldenRatioScale: true,
        rotationSpeed: 0.5,
        pulseResponse: true
      }
    },
    {
      id: 'spectrum',
      name: 'Frequency Spectrum',
      type: 'spectrum' as LayerType,
      position: { x: '50%', y: '85%', z: 10 },
      size: { width: 1600, height: 200 },
      opacity: 0.8,
      blendMode: 'screen',
      visible: true,
      properties: {
        emphasize432Hz: true,
        smoothing: 0.8,
        colorMode: 'frequency'
      }
    },
    {
      id: 'waveform',
      name: 'Waveform',
      type: 'waveform' as LayerType,
      position: { x: '50%', y: '50%', z: 5 },
      size: { width: 1400, height: 300 },
      opacity: 0.4,
      blendMode: 'screen',
      visible: true,
      properties: {
        style: 'circular',
        responseToBeats: true
      }
    },
    {
      id: 'particles',
      name: 'Particle System',
      type: 'particle' as LayerType,
      position: { x: '50%', y: '50%', z: 20 },
      size: { width: 1920, height: 1080 },
      opacity: 0.6,
      blendMode: 'add',
      visible: true,
      properties: {
        particleCount: 200,
        emitOnBeat: true,
        goldenSpiralPath: true
      }
    }
  ],
  timeline: {
    duration: 0, // Set from audio
    fps: 30,
    keyframes: [],
    events: []
  },
  supportedVisualizations: ['sacred-geometry', 'frequency-spectrum', 'waveform', 'particles'],
  parameterOptions: {
    allowLayerToggling: true,
    allowVisualizationSwap: true,
    allowColorCustomization: true,
    allowSpeedControl: true
  },
  estimatedRenderTime: {
    fast: 30000,
    balanced: 120000,
    high: 240000,
    master: 360000
  }
};

// ============================================================================
// CONVERGENCE THRESHOLDS
// ============================================================================

export const convergenceWeights = {
  recognition: 0.3,
  inevitability: 0.2,
  coherence: 0.3,
  geometric: 0.1,
  frequency: 0.1
};

export const convergenceThresholds = {
  converged: 80,
  partial: 50,
  failed: 0
};

// ============================================================================
// AUDIO ANALYSIS DEFAULTS
// ============================================================================

export const audioAnalysisDefaults = {
  sampleRate: 44100,
  windowSize: 2048,
  hopSize: 512,
  minFrequency: 20,
  maxFrequency: 20000,
  beatDetectionThreshold: 0.5,
  onsetDetectionThreshold: 0.3,
  harmonicDetectionThreshold: 0.1,
  maxHarmonics: 16
};

// ============================================================================
// EXPORT ALL CONSTANTS
// ============================================================================

export {
  SACRED_CONSTANTS
};

export default defaultConfig;
