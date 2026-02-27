/**
 * REMOTION AGENT - COMPOSITION BUILDER
 *
 * Builds Remotion compositions from audio analysis
 * Creates layers, keyframes, and synchronization maps
 * Integrates sacred geometry and 432Hz principles
 */

import {
  AudioAnalysisResult,
  CompositionData,
  CompositionLayer,
  CompositionMetadata,
  CompositionTemplate,
  TimelineData,
  TimelineEvent,
  SynchronizationMap,
  SyncPoint,
  Animation,
  AnimationKeyframe,
  VisibilityKeyframe,
  Keyframe,
  EasingFunction,
  LayerType,
  SacredGeometryConfig,
  SacredGeometryData,
  SACRED_CONSTANTS,
  QualityPreset
} from '../types';
import { createLogger, RemotionLogger } from '../utils/logger';
import { CompositionError } from '../utils/error-handler';
import { defaultTemplate, qualityPresets } from '../config/defaults';

// ============================================================================
// COMPOSITION BUILDER CONFIGURATION
// ============================================================================

export interface CompositionBuilderConfig {
  fps?: number;
  defaultTemplate?: CompositionTemplate;
  enableSacredGeometry?: boolean;
  enable432Hz?: boolean;
  goldenRatioMode?: boolean;
}

export interface CompositionBuildInput {
  audioAnalysis: AudioAnalysisResult;
  metadata: CompositionMetadata;
  template?: CompositionTemplate;
  sacredGeometryConfig?: SacredGeometryConfig;
  qualityPreset?: QualityPreset;
}

// ============================================================================
// COMPOSITION BUILDER CLASS
// ============================================================================

export class CompositionBuilder {
  private config: Required<CompositionBuilderConfig>;
  private logger: RemotionLogger;

  constructor(config: CompositionBuilderConfig = {}) {
    this.config = {
      fps: config.fps ?? 30,
      defaultTemplate: config.defaultTemplate ?? defaultTemplate,
      enableSacredGeometry: config.enableSacredGeometry ?? true,
      enable432Hz: config.enable432Hz ?? true,
      goldenRatioMode: config.goldenRatioMode ?? true
    };
    this.logger = createLogger();
  }

  /**
   * Build composition from audio analysis
   */
  async build(input: CompositionBuildInput): Promise<CompositionData> {
    const startTime = Date.now();
    this.logger.phaseStart('composition_build');

    try {
      // Validate input
      this.validateInput(input);

      const template = input.template ?? this.config.defaultTemplate;
      const fps = input.metadata.renderSettings?.fps ?? this.config.fps;
      const duration = input.metadata.duration;
      const totalFrames = Math.ceil((duration / 1000) * fps);

      // Prepare timeline
      const timeline = this.prepareTimeline(input.audioAnalysis, fps, duration);

      // Build layers
      const layers = await this.buildLayers(template, input.audioAnalysis, fps, totalFrames);

      // Create synchronization map
      const synchronization = this.createSynchronizationMap(input.audioAnalysis, fps);

      // Add sacred geometry data if enabled
      let sacredGeometry: SacredGeometryData | undefined;
      if (this.config.enableSacredGeometry && input.sacredGeometryConfig?.enabled) {
        sacredGeometry = this.buildSacredGeometryData(input.sacredGeometryConfig, input.audioAnalysis);
      }

      const composition: CompositionData = {
        layers,
        timeline,
        synchronization,
        metadata: {
          title: input.metadata.title,
          duration,
          fps,
          totalFrames,
          tempo: input.audioAnalysis.estimatedTempo,
          fundamentalFrequency: input.audioAnalysis.fundamentalFrequency,
          template: template.id,
          createdAt: Date.now()
        },
        sacredGeometry
      };

      const buildTime = Date.now() - startTime;
      this.logger.phaseComplete('composition_build', buildTime, {
        layerCount: layers.length,
        totalFrames,
        fps
      });

      return composition;
    } catch (error) {
      throw new CompositionError(
        `Failed to build composition: ${error instanceof Error ? error.message : String(error)}`,
        { originalError: error }
      );
    }
  }

  /**
   * Validate build input
   */
  private validateInput(input: CompositionBuildInput): void {
    if (!input.audioAnalysis) {
      throw new CompositionError('Audio analysis is required');
    }

    if (!input.metadata) {
      throw new CompositionError('Metadata is required');
    }

    if (!input.metadata.duration || input.metadata.duration <= 0) {
      throw new CompositionError('Valid duration is required in metadata');
    }
  }

  /**
   * Prepare timeline with events
   */
  private prepareTimeline(
    analysis: AudioAnalysisResult,
    fps: number,
    duration: number
  ): TimelineData {
    const totalFrames = Math.ceil((duration / 1000) * fps);
    const events: TimelineEvent[] = [];

    // Add beat events
    for (const beat of analysis.beats) {
      events.push({
        time: beat.time,
        type: beat.type === 'downbeat' ? 'beat' : 'beat',
        metadata: {
          strength: beat.strength,
          confidence: beat.confidence,
          isDownbeat: beat.type === 'downbeat'
        }
      });
    }

    // Add onset events
    for (const onset of analysis.onsets) {
      events.push({
        time: onset,
        type: 'onset',
        metadata: {}
      });
    }

    // Add section events
    for (const section of analysis.structure) {
      events.push({
        time: section.startTime,
        type: 'section',
        metadata: {
          sectionType: section.type,
          label: section.label
        }
      });
    }

    // Add peak events
    for (const peak of analysis.peaks.filter(p => p.type === 'energy')) {
      events.push({
        time: peak.time,
        type: 'peak',
        metadata: {
          magnitude: peak.magnitude
        }
      });
    }

    // Sort by time
    events.sort((a, b) => a.time - b.time);

    return {
      fps,
      duration,
      totalFrames,
      events
    };
  }

  /**
   * Build all layers from template
   */
  private async buildLayers(
    template: CompositionTemplate,
    analysis: AudioAnalysisResult,
    fps: number,
    totalFrames: number
  ): Promise<CompositionLayer[]> {
    const layers: CompositionLayer[] = [];

    for (const layerTemplate of template.layers) {
      const layer = await this.buildLayer(layerTemplate, analysis, fps, totalFrames);
      layers.push(layer);
    }

    return layers;
  }

  /**
   * Build single layer with animations
   */
  private async buildLayer(
    template: CompositionTemplate['layers'][0],
    analysis: AudioAnalysisResult,
    fps: number,
    totalFrames: number
  ): Promise<CompositionLayer> {
    const animations: Animation[] = [];
    const visibility: VisibilityKeyframe[] = [{ frameNumber: 0, visible: template.visible ?? true }];

    switch (template.type) {
      case 'geometry':
        animations.push(...this.buildGeometryAnimations(analysis, fps, totalFrames));
        break;
      case 'waveform':
        animations.push(...this.buildWaveformAnimations(analysis, fps, totalFrames));
        break;
      case 'spectrum':
        animations.push(...this.buildSpectrumAnimations(analysis, fps, totalFrames));
        break;
      case 'particle':
        animations.push(...this.buildParticleAnimations(analysis, fps, totalFrames));
        break;
      case 'background':
        animations.push(...this.buildBackgroundAnimations(analysis, fps, totalFrames));
        break;
      default:
        // Default minimal animation
        animations.push(this.createOpacityAnimation(totalFrames));
    }

    return {
      id: template.id,
      name: template.name,
      type: template.type,
      animations,
      properties: {
        ...template.properties,
        position: template.position,
        size: template.size,
        opacity: template.opacity ?? 1,
        blendMode: template.blendMode ?? 'normal'
      },
      visibility
    };
  }

  /**
   * Build geometry layer animations
   */
  private buildGeometryAnimations(
    analysis: AudioAnalysisResult,
    fps: number,
    totalFrames: number
  ): Animation[] {
    const animations: Animation[] = [];

    // Rotation animation (continuous with beat influence)
    const rotationKeyframes: AnimationKeyframe[] = [];
    let rotation = 0;
    const baseRotationSpeed = 360 / (fps * 10); // Full rotation in 10 seconds

    for (let frame = 0; frame < totalFrames; frame++) {
      const time = (frame / fps) * 1000;

      // Check for nearby beat
      const nearbyBeat = analysis.beats.find(b => Math.abs(b.time - time) < 50);
      const beatInfluence = nearbyBeat ? nearbyBeat.strength * 2 : 1;

      rotation += baseRotationSpeed * beatInfluence;

      // Add keyframe every 5 frames for smooth animation
      if (frame % 5 === 0) {
        rotationKeyframes.push({
          time,
          frameNumber: frame,
          value: rotation % 360,
          easing: 'linear'
        });
      }
    }

    animations.push({
      property: 'rotation',
      keyframes: rotationKeyframes,
      easing: 'linear'
    });

    // Scale animation (pulse with beats)
    const scaleKeyframes: AnimationKeyframe[] = [];
    const baseScale = 1;
    const pulseAmount = 0.2;

    for (const beat of analysis.beats) {
      const frameNumber = Math.round((beat.time / 1000) * fps);

      // Scale up at beat
      scaleKeyframes.push({
        time: beat.time,
        frameNumber,
        value: baseScale + (pulseAmount * beat.strength),
        easing: 'easeOut'
      });

      // Return to base after beat (golden ratio timing)
      const returnFrame = Math.min(totalFrames - 1, frameNumber + Math.round(fps * 0.1 * SACRED_CONSTANTS.PHI));
      scaleKeyframes.push({
        time: (returnFrame / fps) * 1000,
        frameNumber: returnFrame,
        value: baseScale,
        easing: 'easeInOut'
      });
    }

    // Add start and end keyframes
    scaleKeyframes.unshift({ time: 0, frameNumber: 0, value: baseScale, easing: 'linear' });
    scaleKeyframes.push({ time: (totalFrames / fps) * 1000, frameNumber: totalFrames - 1, value: baseScale, easing: 'linear' });

    // Sort and deduplicate
    scaleKeyframes.sort((a, b) => a.frameNumber - b.frameNumber);

    animations.push({
      property: 'scale',
      keyframes: scaleKeyframes,
      easing: 'easeInOut'
    });

    // Color hue animation (based on spectral centroid)
    const hueKeyframes: AnimationKeyframe[] = [];
    const centroidStep = Math.max(1, Math.floor(analysis.spectralCentroid.length / (totalFrames / 5)));

    for (let frame = 0; frame < totalFrames; frame += 5) {
      const centroidIndex = Math.min(
        analysis.spectralCentroid.length - 1,
        Math.floor((frame / totalFrames) * analysis.spectralCentroid.length)
      );
      const centroid = analysis.spectralCentroid[centroidIndex] || 1000;

      // Map centroid to hue (lower = warmer, higher = cooler)
      const hue = Math.min(360, (Math.log(centroid) / Math.log(10000)) * 360);

      hueKeyframes.push({
        time: (frame / fps) * 1000,
        frameNumber: frame,
        value: hue,
        easing: 'linear'
      });
    }

    animations.push({
      property: 'hue',
      keyframes: hueKeyframes,
      easing: 'linear'
    });

    return animations;
  }

  /**
   * Build waveform layer animations
   */
  private buildWaveformAnimations(
    analysis: AudioAnalysisResult,
    fps: number,
    totalFrames: number
  ): Animation[] {
    const animations: Animation[] = [];

    // Amplitude animation based on RMS
    const amplitudeKeyframes: AnimationKeyframe[] = [];
    const rmsStep = Math.max(1, Math.floor(analysis.rms.length / totalFrames));

    for (let frame = 0; frame < totalFrames; frame++) {
      const rmsIndex = Math.min(analysis.rms.length - 1, frame * rmsStep);
      const amplitude = analysis.rms[rmsIndex] || 0;

      amplitudeKeyframes.push({
        time: (frame / fps) * 1000,
        frameNumber: frame,
        value: Math.min(1, amplitude * 3), // Scale for visibility
        easing: 'linear'
      });
    }

    animations.push({
      property: 'amplitude',
      keyframes: amplitudeKeyframes,
      easing: 'linear'
    });

    // Thickness animation (pulse on beats)
    const thicknessKeyframes: AnimationKeyframe[] = [];
    const baseThickness = 2;

    for (const beat of analysis.beats.filter(b => b.type === 'downbeat')) {
      const frameNumber = Math.round((beat.time / 1000) * fps);

      thicknessKeyframes.push({
        time: beat.time,
        frameNumber,
        value: baseThickness * 2,
        easing: 'easeOut'
      });

      const returnFrame = Math.min(totalFrames - 1, frameNumber + Math.round(fps * 0.2));
      thicknessKeyframes.push({
        time: (returnFrame / fps) * 1000,
        frameNumber: returnFrame,
        value: baseThickness,
        easing: 'easeInOut'
      });
    }

    thicknessKeyframes.unshift({ time: 0, frameNumber: 0, value: baseThickness, easing: 'linear' });

    animations.push({
      property: 'thickness',
      keyframes: thicknessKeyframes,
      easing: 'easeInOut'
    });

    return animations;
  }

  /**
   * Build spectrum layer animations
   */
  private buildSpectrumAnimations(
    analysis: AudioAnalysisResult,
    fps: number,
    totalFrames: number
  ): Animation[] {
    const animations: Animation[] = [];

    // Spectrum intensity
    const intensityKeyframes: AnimationKeyframe[] = [];
    const energyStep = Math.max(1, Math.floor(analysis.energy.length / totalFrames));

    for (let frame = 0; frame < totalFrames; frame++) {
      const energyIndex = Math.min(analysis.energy.length - 1, frame * energyStep);
      const intensity = Math.min(1, analysis.energy[energyIndex] * 2);

      intensityKeyframes.push({
        time: (frame / fps) * 1000,
        frameNumber: frame,
        value: intensity,
        easing: 'linear'
      });
    }

    animations.push({
      property: 'intensity',
      keyframes: intensityKeyframes,
      easing: 'linear'
    });

    // 432Hz emphasis (if enabled)
    if (this.config.enable432Hz) {
      const emphasisKeyframes: AnimationKeyframe[] = [];
      const has432HzContent = analysis.harmonics.some(h => h.is432HzAligned);

      for (let frame = 0; frame < totalFrames; frame += 10) {
        emphasisKeyframes.push({
          time: (frame / fps) * 1000,
          frameNumber: frame,
          value: has432HzContent ? 1.5 : 1,
          easing: 'linear'
        });
      }

      animations.push({
        property: 'emphasis432Hz',
        keyframes: emphasisKeyframes,
        easing: 'linear'
      });
    }

    return animations;
  }

  /**
   * Build particle layer animations
   */
  private buildParticleAnimations(
    analysis: AudioAnalysisResult,
    fps: number,
    totalFrames: number
  ): Animation[] {
    const animations: Animation[] = [];

    // Particle emission rate (higher on beats)
    const emissionKeyframes: AnimationKeyframe[] = [];
    const baseEmission = 5;

    for (const onset of analysis.onsets) {
      const frameNumber = Math.round((onset / 1000) * fps);

      emissionKeyframes.push({
        time: onset,
        frameNumber,
        value: baseEmission * 10, // Burst on onset
        easing: 'easeOut'
      });

      const returnFrame = Math.min(totalFrames - 1, frameNumber + Math.round(fps * 0.3));
      emissionKeyframes.push({
        time: (returnFrame / fps) * 1000,
        frameNumber: returnFrame,
        value: baseEmission,
        easing: 'easeInOut'
      });
    }

    emissionKeyframes.unshift({ time: 0, frameNumber: 0, value: baseEmission, easing: 'linear' });

    animations.push({
      property: 'emissionRate',
      keyframes: emissionKeyframes,
      easing: 'easeInOut'
    });

    // Particle velocity (based on energy)
    const velocityKeyframes: AnimationKeyframe[] = [];
    const energyStep = Math.max(1, Math.floor(analysis.energy.length / (totalFrames / 5)));

    for (let frame = 0; frame < totalFrames; frame += 5) {
      const energyIndex = Math.min(analysis.energy.length - 1, Math.floor(frame * energyStep / 5));
      const velocity = 1 + analysis.energy[energyIndex] * 2;

      velocityKeyframes.push({
        time: (frame / fps) * 1000,
        frameNumber: frame,
        value: velocity,
        easing: 'linear'
      });
    }

    animations.push({
      property: 'velocity',
      keyframes: velocityKeyframes,
      easing: 'linear'
    });

    return animations;
  }

  /**
   * Build background layer animations
   */
  private buildBackgroundAnimations(
    analysis: AudioAnalysisResult,
    fps: number,
    totalFrames: number
  ): Animation[] {
    const animations: Animation[] = [];

    // Subtle brightness changes based on energy
    const brightnessKeyframes: AnimationKeyframe[] = [];
    const energyStep = Math.max(1, Math.floor(analysis.energy.length / (totalFrames / 10)));

    for (let frame = 0; frame < totalFrames; frame += 10) {
      const energyIndex = Math.min(analysis.energy.length - 1, Math.floor(frame * energyStep / 10));
      const brightness = 0.8 + analysis.energy[energyIndex] * 0.2;

      brightnessKeyframes.push({
        time: (frame / fps) * 1000,
        frameNumber: frame,
        value: Math.min(1.2, brightness),
        easing: 'linear'
      });
    }

    animations.push({
      property: 'brightness',
      keyframes: brightnessKeyframes,
      easing: 'linear'
    });

    return animations;
  }

  /**
   * Create default opacity animation
   */
  private createOpacityAnimation(totalFrames: number): Animation {
    return {
      property: 'opacity',
      keyframes: [
        { time: 0, frameNumber: 0, value: 0, easing: 'easeIn' },
        { time: 500, frameNumber: 15, value: 1, easing: 'easeOut' },
        { time: (totalFrames - 15) / 30 * 1000, frameNumber: totalFrames - 15, value: 1, easing: 'easeIn' },
        { time: totalFrames / 30 * 1000, frameNumber: totalFrames - 1, value: 0, easing: 'easeOut' }
      ],
      easing: 'easeInOut'
    };
  }

  /**
   * Create synchronization map
   */
  private createSynchronizationMap(
    analysis: AudioAnalysisResult,
    fps: number
  ): SynchronizationMap {
    const beatFrames = analysis.beats.map(b => Math.round((b.time / 1000) * fps));
    const onsetFrames = analysis.onsets.map(o => Math.round((o / 1000) * fps));
    const peakFrames = analysis.peaks
      .filter(p => p.type === 'energy')
      .map(p => Math.round((p.time / 1000) * fps));

    const syncPoints: SyncPoint[] = [];

    // Add beat sync points
    for (const beat of analysis.beats) {
      syncPoints.push({
        audioTime: beat.time,
        frameNumber: Math.round((beat.time / 1000) * fps),
        type: 'beat',
        strength: beat.strength
      });
    }

    // Add onset sync points
    for (const onset of analysis.onsets) {
      syncPoints.push({
        audioTime: onset,
        frameNumber: Math.round((onset / 1000) * fps),
        type: 'onset',
        strength: 0.8
      });
    }

    // Calculate confidence based on beat regularity
    const confidence = analysis.confidence.beat * 0.5 + analysis.confidence.onset * 0.3 + 0.2;

    return {
      beatFrames,
      onsetFrames,
      peakFrames,
      syncPoints: syncPoints.sort((a, b) => a.frameNumber - b.frameNumber),
      confidence
    };
  }

  /**
   * Build sacred geometry data
   */
  private buildSacredGeometryData(
    config: SacredGeometryConfig,
    analysis: AudioAnalysisResult
  ): SacredGeometryData {
    this.logger.sacredGeometry('building_data', config.shape);

    // Get vertices for the shape
    const { vertices, edges, faces } = this.getPlatonicSolidGeometry(config.shape);

    // Build animations based on audio
    const animations: SacredGeometryData['animations'] = [];

    // Rotation animation
    animations.push({
      type: 'rotation',
      property: 'rotationY',
      keyframes: [] // Will be populated during rendering
    });

    // Pulse animation on beats
    if (config.pulseResponse) {
      animations.push({
        type: 'pulse',
        property: 'scale',
        keyframes: analysis.beats.map(beat => ({
          time: beat.time,
          frameNumber: 0,
          value: 1 + beat.strength * 0.3
        }))
      });
    }

    return {
      shape: config.shape,
      vertices,
      edges,
      faces,
      animations
    };
  }

  /**
   * Get Platonic solid geometry
   */
  private getPlatonicSolidGeometry(shape: SacredGeometryConfig['shape']): {
    vertices: SacredGeometryData['vertices'];
    edges: SacredGeometryData['edges'];
    faces: SacredGeometryData['faces'];
  } {
    const phi = SACRED_CONSTANTS.PHI;

    switch (shape) {
      case 'tetrahedron':
        return {
          vertices: [
            { x: 1, y: 1, z: 1 },
            { x: 1, y: -1, z: -1 },
            { x: -1, y: 1, z: -1 },
            { x: -1, y: -1, z: 1 }
          ],
          edges: [
            { start: 0, end: 1 }, { start: 0, end: 2 }, { start: 0, end: 3 },
            { start: 1, end: 2 }, { start: 1, end: 3 }, { start: 2, end: 3 }
          ],
          faces: [
            { vertices: [0, 1, 2] }, { vertices: [0, 1, 3] },
            { vertices: [0, 2, 3] }, { vertices: [1, 2, 3] }
          ]
        };

      case 'cube':
        return {
          vertices: [
            { x: -1, y: -1, z: -1 }, { x: 1, y: -1, z: -1 },
            { x: 1, y: 1, z: -1 }, { x: -1, y: 1, z: -1 },
            { x: -1, y: -1, z: 1 }, { x: 1, y: -1, z: 1 },
            { x: 1, y: 1, z: 1 }, { x: -1, y: 1, z: 1 }
          ],
          edges: [
            { start: 0, end: 1 }, { start: 1, end: 2 }, { start: 2, end: 3 }, { start: 3, end: 0 },
            { start: 4, end: 5 }, { start: 5, end: 6 }, { start: 6, end: 7 }, { start: 7, end: 4 },
            { start: 0, end: 4 }, { start: 1, end: 5 }, { start: 2, end: 6 }, { start: 3, end: 7 }
          ],
          faces: [
            { vertices: [0, 1, 2, 3] }, { vertices: [4, 5, 6, 7] },
            { vertices: [0, 1, 5, 4] }, { vertices: [2, 3, 7, 6] },
            { vertices: [0, 3, 7, 4] }, { vertices: [1, 2, 6, 5] }
          ]
        };

      case 'octahedron':
        return {
          vertices: [
            { x: 1, y: 0, z: 0 }, { x: -1, y: 0, z: 0 },
            { x: 0, y: 1, z: 0 }, { x: 0, y: -1, z: 0 },
            { x: 0, y: 0, z: 1 }, { x: 0, y: 0, z: -1 }
          ],
          edges: [
            { start: 0, end: 2 }, { start: 0, end: 3 }, { start: 0, end: 4 }, { start: 0, end: 5 },
            { start: 1, end: 2 }, { start: 1, end: 3 }, { start: 1, end: 4 }, { start: 1, end: 5 },
            { start: 2, end: 4 }, { start: 2, end: 5 }, { start: 3, end: 4 }, { start: 3, end: 5 }
          ],
          faces: [
            { vertices: [0, 2, 4] }, { vertices: [0, 4, 3] },
            { vertices: [0, 3, 5] }, { vertices: [0, 5, 2] },
            { vertices: [1, 2, 4] }, { vertices: [1, 4, 3] },
            { vertices: [1, 3, 5] }, { vertices: [1, 5, 2] }
          ]
        };

      case 'dodecahedron':
        const phiInv = 1 / phi;
        return {
          vertices: [
            // Cube vertices scaled by phi
            { x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: -1 },
            { x: 1, y: -1, z: 1 }, { x: 1, y: -1, z: -1 },
            { x: -1, y: 1, z: 1 }, { x: -1, y: 1, z: -1 },
            { x: -1, y: -1, z: 1 }, { x: -1, y: -1, z: -1 },
            // Rectangle vertices (phi ratios)
            { x: 0, y: phiInv, z: phi }, { x: 0, y: phiInv, z: -phi },
            { x: 0, y: -phiInv, z: phi }, { x: 0, y: -phiInv, z: -phi },
            { x: phiInv, y: phi, z: 0 }, { x: phiInv, y: -phi, z: 0 },
            { x: -phiInv, y: phi, z: 0 }, { x: -phiInv, y: -phi, z: 0 },
            { x: phi, y: 0, z: phiInv }, { x: phi, y: 0, z: -phiInv },
            { x: -phi, y: 0, z: phiInv }, { x: -phi, y: 0, z: -phiInv }
          ],
          edges: [], // Complex - simplified for now
          faces: [] // Complex - simplified for now
        };

      case 'icosahedron':
        return {
          vertices: [
            { x: 0, y: 1, z: phi }, { x: 0, y: 1, z: -phi },
            { x: 0, y: -1, z: phi }, { x: 0, y: -1, z: -phi },
            { x: 1, y: phi, z: 0 }, { x: 1, y: -phi, z: 0 },
            { x: -1, y: phi, z: 0 }, { x: -1, y: -phi, z: 0 },
            { x: phi, y: 0, z: 1 }, { x: phi, y: 0, z: -1 },
            { x: -phi, y: 0, z: 1 }, { x: -phi, y: 0, z: -1 }
          ],
          edges: [], // Complex - simplified for now
          faces: [] // Complex - simplified for now
        };

      default:
        // Return spiral/default
        return {
          vertices: [],
          edges: [],
          faces: []
        };
    }
  }

  /**
   * Estimate render time based on composition
   */
  estimateRenderTime(composition: CompositionData, qualityPreset: QualityPreset): number {
    const preset = qualityPresets[qualityPreset];
    const durationMinutes = composition.timeline.duration / 60000;
    return durationMinutes * preset.estimatedTimePerMinute * 1000; // Return in ms
  }
}

export default CompositionBuilder;
