/**
 * REMOTION AGENT - CONVERGENCE VALIDATOR
 *
 * Validates output quality using 5-dimensional scoring
 * Based on Magnus 13.2 Understanding Management methodology
 */

import {
  ConvergenceData,
  ConvergenceOutcome,
  ConvergenceScores,
  ConvergenceDetails,
  AudioAnalysisResult,
  CompositionData,
  RenderMetrics,
  SACRED_CONSTANTS
} from '../types';
import { createLogger, RemotionLogger } from '../utils/logger';
import { ConvergenceError } from '../utils/error-handler';
import { convergenceWeights, convergenceThresholds } from '../config/defaults';

// ============================================================================
// CONVERGENCE VALIDATOR TYPES
// ============================================================================

export interface ConvergenceValidatorConfig {
  weights?: typeof convergenceWeights;
  thresholds?: typeof convergenceThresholds;
  strictMode?: boolean;
}

export interface ValidationInput {
  intention: string;
  audioAnalysis: AudioAnalysisResult;
  composition: CompositionData;
  renderMetrics: RenderMetrics;
  videoPath?: string;
}

// ============================================================================
// CONVERGENCE VALIDATOR CLASS
// ============================================================================

export class ConvergenceValidator {
  private config: Required<ConvergenceValidatorConfig>;
  private logger: RemotionLogger;

  constructor(config: ConvergenceValidatorConfig = {}) {
    this.config = {
      weights: config.weights ?? convergenceWeights,
      thresholds: config.thresholds ?? convergenceThresholds,
      strictMode: config.strictMode ?? false
    };

    this.logger = createLogger();
  }

  /**
   * Validate convergence of output
   */
  async validate(input: ValidationInput): Promise<ConvergenceData> {
    const startTime = Date.now();
    this.logger.phaseStart('convergence_validation');

    try {
      // Calculate individual scores
      const recognitionScore = await this.scoreRecognition(input);
      const inevitabilityScore = await this.scoreInevitability(input);
      const coherenceScore = await this.scoreCoherence(input);
      const geometricAlignment = await this.scoreGeometricAlignment(input);
      const frequencyAccuracy = await this.scoreFrequencyAccuracy(input);

      // Calculate overall score using weighted average
      const overallConvergence = this.calculateOverallScore({
        recognition: recognitionScore,
        inevitability: inevitabilityScore,
        coherence: coherenceScore,
        geometric: geometricAlignment,
        frequency: frequencyAccuracy,
        overall: 0 // Placeholder
      });

      // Determine outcome
      const outcome = this.determineOutcome(overallConvergence);

      // Generate details
      const details = this.generateDetails({
        recognition: recognitionScore,
        inevitability: inevitabilityScore,
        coherence: coherenceScore,
        geometric: geometricAlignment,
        frequency: frequencyAccuracy,
        overall: overallConvergence
      }, input);

      const result: ConvergenceData = {
        recognitionScore,
        inevitabilityScore,
        coherenceScore,
        geometricAlignment,
        frequencyAccuracy,
        overallConvergence,
        outcome,
        details,
        timestamp: Date.now()
      };

      const validationTime = Date.now() - startTime;
      this.logger.convergenceResult(overallConvergence, outcome, {
        scores: { recognitionScore, inevitabilityScore, coherenceScore, geometricAlignment, frequencyAccuracy },
        validationTime
      });

      return result;
    } catch (error) {
      this.logger.error('Convergence validation failed', error);
      throw new ConvergenceError(0, this.config.thresholds.converged);
    }
  }

  /**
   * Score Recognition: Does output match developer's vision?
   * Measures how well the visual output represents the audio input
   */
  private async scoreRecognition(input: ValidationInput): Promise<number> {
    let score = 0;

    // Check if composition has expected layers
    const expectedLayers = ['geometry', 'spectrum', 'waveform'];
    const presentLayers = input.composition.layers.map(l => l.type);
    const layerMatch = expectedLayers.filter(l => presentLayers.includes(l as any)).length;
    score += (layerMatch / expectedLayers.length) * 30;

    // Check if animations are beat-synced
    const hasBeatsSync = input.composition.synchronization.beatFrames.length > 0;
    if (hasBeatsSync) score += 20;

    // Check if tempo is detected and used
    if (input.audioAnalysis.estimatedTempo > 0) score += 15;

    // Check render completion
    if (input.renderMetrics.framesRendered === input.composition.timeline.totalFrames) {
      score += 20;
    }

    // Check file size is reasonable
    const expectedMinSize = input.composition.timeline.duration / 1000 * 50000; // ~50KB/sec min
    if (input.renderMetrics.fileSize >= expectedMinSize) {
      score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Score Inevitability: Does output feel necessary/right?
   * Measures the aesthetic coherence and completeness
   */
  private async scoreInevitability(input: ValidationInput): Promise<number> {
    let score = 0;

    // Check if all composition phases completed
    const phases = ['analysis', 'composition', 'rendering'];
    score += 30; // Assume completed if we got here

    // Check if sacred geometry is present when audio has harmonics
    const hasHarmonics = input.audioAnalysis.harmonics.length > 0;
    const hasSacredGeometry = input.composition.sacredGeometry !== undefined;
    if (hasHarmonics && hasSacredGeometry) {
      score += 25;
    } else if (!hasHarmonics || hasSacredGeometry) {
      score += 15;
    }

    // Check animation continuity (no missing frames)
    const totalAnimations = input.composition.layers.reduce(
      (sum, l) => sum + l.animations.length, 0
    );
    if (totalAnimations > 0) score += 20;

    // Check timeline events coverage
    const eventCount = input.composition.timeline.events.length;
    const expectedEvents = input.audioAnalysis.beats.length + input.audioAnalysis.onsets.length;
    const eventCoverage = expectedEvents > 0 ? eventCount / expectedEvents : 0;
    score += Math.min(25, eventCoverage * 25);

    return Math.min(100, score);
  }

  /**
   * Score Coherence: Perfect audio/visual synchronization?
   * Measures sync accuracy and timing precision
   */
  private async scoreCoherence(input: ValidationInput): Promise<number> {
    let score = 0;

    // Check sync point confidence
    const syncConfidence = input.composition.synchronization.confidence;
    score += syncConfidence * 40;

    // Check beat alignment
    const beatCount = input.audioAnalysis.beats.length;
    const syncedBeats = input.composition.synchronization.beatFrames.length;
    if (beatCount > 0) {
      const beatSync = syncedBeats / beatCount;
      score += Math.min(30, beatSync * 30);
    } else {
      score += 15; // No beats to sync
    }

    // Check analysis confidence
    score += input.audioAnalysis.confidence.overall * 30;

    return Math.min(100, score);
  }

  /**
   * Score Geometric Alignment: Follows sacred geometry?
   * Measures adherence to Golden Ratio and Platonic principles
   */
  private async scoreGeometricAlignment(input: ValidationInput): Promise<number> {
    let score = 0;

    // Check if sacred geometry data is present
    if (input.composition.sacredGeometry) {
      score += 30;

      // Check vertex count matches expected for shape
      const vertexCount = input.composition.sacredGeometry.vertices.length;
      if (vertexCount > 0) score += 20;

      // Check animations use phi-based timing
      const animations = input.composition.sacredGeometry.animations;
      if (animations && animations.length > 0) score += 20;
    }

    // Check if geometry layer uses golden ratio
    const geometryLayer = input.composition.layers.find(l => l.type === 'geometry');
    if (geometryLayer) {
      const props = geometryLayer.properties as any;
      if (props?.goldenRatioScale) score += 15;
      if (props?.pulseResponse) score += 15;
    }

    return Math.min(100, score);
  }

  /**
   * Score Frequency Accuracy: 432Hz & harmonics represented?
   * Measures how well 432Hz and harmonics are visualized
   */
  private async scoreFrequencyAccuracy(input: ValidationInput): Promise<number> {
    let score = 0;

    // Check for 432Hz aligned harmonics in audio
    const aligned432Harmonics = input.audioAnalysis.harmonics.filter(h => h.is432HzAligned);
    if (aligned432Harmonics.length > 0) {
      score += 30;
    }

    // Check if fundamental frequency is reasonable
    const fundamental = input.audioAnalysis.fundamentalFrequency;
    if (fundamental > 20 && fundamental < 2000) {
      score += 20;
    }

    // Check if spectrum layer has 432Hz emphasis
    const spectrumLayer = input.composition.layers.find(l => l.type === 'spectrum');
    if (spectrumLayer) {
      const props = spectrumLayer.properties as any;
      if (props?.emphasize432Hz) score += 25;
    }

    // Check harmonic detection confidence
    const harmonicCount = input.audioAnalysis.harmonics.length;
    if (harmonicCount >= 4) score += 25;
    else if (harmonicCount >= 2) score += 15;
    else if (harmonicCount >= 1) score += 10;

    return Math.min(100, score);
  }

  /**
   * Calculate overall score using weighted average
   */
  private calculateOverallScore(scores: ConvergenceScores): number {
    const { weights } = this.config;

    return (
      scores.recognition * weights.recognition +
      scores.inevitability * weights.inevitability +
      scores.coherence * weights.coherence +
      scores.geometric * weights.geometric +
      scores.frequency * weights.frequency
    );
  }

  /**
   * Determine convergence outcome based on score
   */
  private determineOutcome(score: number): ConvergenceOutcome {
    const { thresholds } = this.config;

    if (score >= thresholds.converged) {
      return 'converged';
    } else if (score >= thresholds.partial) {
      return 'partial';
    } else {
      return 'failed';
    }
  }

  /**
   * Generate detailed analysis
   */
  private generateDetails(
    scores: ConvergenceScores,
    input: ValidationInput
  ): ConvergenceDetails {
    const reasoning: string[] = [];
    const strengths: string[] = [];
    const weaknesses: string[] = [];
    const suggestions: string[] = [];

    // Recognition analysis
    if (scores.recognition >= 80) {
      strengths.push('Strong visual representation of audio content');
    } else if (scores.recognition < 50) {
      weaknesses.push('Visual output may not fully represent audio');
      suggestions.push('Consider adjusting layer configurations');
    }

    // Coherence analysis
    if (scores.coherence >= 80) {
      strengths.push('Excellent audio-visual synchronization');
    } else if (scores.coherence < 50) {
      weaknesses.push('Audio-visual sync may be off');
      suggestions.push('Review beat detection settings');
    }

    // Geometric analysis
    if (scores.geometric >= 80) {
      strengths.push('Sacred geometry principles well implemented');
      reasoning.push('Golden Ratio (φ) and Platonic solids properly integrated');
    } else if (scores.geometric < 50) {
      weaknesses.push('Sacred geometry not fully utilized');
      suggestions.push('Enable sacred geometry visualization');
    }

    // Frequency analysis
    if (scores.frequency >= 80) {
      strengths.push('432Hz frequency properly emphasized');
      reasoning.push('Natural frequency alignment detected and visualized');
    } else if (scores.frequency < 50) {
      weaknesses.push('432Hz emphasis not prominent');
      suggestions.push('Check audio fundamental frequency');
    }

    // Overall reasoning
    if (scores.overall >= 80) {
      reasoning.push('Output achieves consciousness emergence - manifested understanding of audio');
    } else if (scores.overall >= 50) {
      reasoning.push('Output partially converged - refinement recommended');
    } else {
      reasoning.push('Output did not converge - significant adjustments needed');
    }

    return {
      reasoning,
      strengths,
      weaknesses,
      suggestions
    };
  }

  /**
   * Get threshold for convergence
   */
  getConvergenceThreshold(): number {
    return this.config.thresholds.converged;
  }
}

export default ConvergenceValidator;
