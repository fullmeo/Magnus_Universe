/**
 * REMOTION AGENT - FREQUENCY VISUALIZER
 *
 * Display audio spectrum with 432Hz emphasis
 * Supports multiple visualization modes: bars, radial, wave
 * Integrates with sacred geometry color mappings
 */

import {
  AudioAnalysisResult,
  FrequencyBand,
  ColorMapping,
  SACRED_CONSTANTS
} from '../types';
import { createLogger, RemotionLogger } from '../utils/logger';
import { frequencyBands, frequency432HzBands } from '../config/defaults';

// ============================================================================
// FREQUENCY VISUALIZER TYPES
// ============================================================================

export interface FrequencyVisualizerConfig {
  width: number;
  height: number;
  mode: 'bars' | 'radial' | 'wave' | 'mirror';
  barCount?: number;
  barWidth?: number;
  barGap?: number;
  smoothing?: number;
  peakHold?: number;
  emphasize432Hz?: boolean;
  emphasis432HzAmount?: number;
  colorMode?: 'frequency' | 'gradient' | 'custom';
  customColors?: string[];
  mirrorMode?: boolean;
  showLabels?: boolean;
}

export interface VisualizerFrame {
  frequencies: Float32Array;
  time: number;
  frameNumber: number;
  beat?: { strength: number; isDownbeat: boolean };
}

export interface RenderedSpectrum {
  bars: Array<{
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    is432Hz: boolean;
    frequency: number;
    magnitude: number;
  }>;
  peaks: Array<{ x: number; y: number }>;
  labels?: Array<{ x: number; y: number; text: string }>;
}

// ============================================================================
// FREQUENCY VISUALIZER CLASS
// ============================================================================

export class FrequencyVisualizer {
  private config: Required<FrequencyVisualizerConfig>;
  private logger: RemotionLogger;
  private previousValues: Float32Array;
  private peakValues: Float32Array;
  private peakHoldFrames: number[];

  constructor(config: FrequencyVisualizerConfig) {
    this.config = {
      width: config.width,
      height: config.height,
      mode: config.mode,
      barCount: config.barCount ?? 64,
      barWidth: config.barWidth ?? 0,
      barGap: config.barGap ?? 2,
      smoothing: config.smoothing ?? 0.8,
      peakHold: config.peakHold ?? 30,
      emphasize432Hz: config.emphasize432Hz ?? true,
      emphasis432HzAmount: config.emphasis432HzAmount ?? 0.5,
      colorMode: config.colorMode ?? 'frequency',
      customColors: config.customColors ?? [],
      mirrorMode: config.mirrorMode ?? false,
      showLabels: config.showLabels ?? false
    };

    this.logger = createLogger();
    this.previousValues = new Float32Array(this.config.barCount);
    this.peakValues = new Float32Array(this.config.barCount);
    this.peakHoldFrames = new Array(this.config.barCount).fill(0);
  }

  /**
   * Render spectrum for a frame
   */
  render(frame: VisualizerFrame, sampleRate: number = 44100): RenderedSpectrum {
    // Apply 432Hz emphasis if enabled
    let frequencies = frame.frequencies;
    if (this.config.emphasize432Hz) {
      frequencies = this.apply432HzEmphasis(frequencies, sampleRate);
    }

    // Resample to bar count
    const barValues = this.resampleFrequencies(frequencies, sampleRate);

    // Apply smoothing
    const smoothedValues = this.applySmoothing(barValues);

    // Update peak hold
    this.updatePeaks(smoothedValues);

    // Render based on mode
    switch (this.config.mode) {
      case 'bars':
        return this.renderBars(smoothedValues, sampleRate);
      case 'radial':
        return this.renderRadial(smoothedValues, sampleRate);
      case 'wave':
        return this.renderWave(smoothedValues, sampleRate);
      case 'mirror':
        return this.renderMirror(smoothedValues, sampleRate);
      default:
        return this.renderBars(smoothedValues, sampleRate);
    }
  }

  /**
   * Apply 432Hz emphasis to frequencies
   */
  private apply432HzEmphasis(frequencies: Float32Array, sampleRate: number): Float32Array {
    const emphasized = new Float32Array(frequencies);
    const binWidth = sampleRate / (frequencies.length * 2);
    const emphasis = this.config.emphasis432HzAmount;

    // Emphasize 432Hz and its harmonics
    for (const harmonic of SACRED_CONSTANTS.FREQUENCY_432HZ_HARMONICS) {
      const binIndex = Math.round(harmonic / binWidth);

      // Apply emphasis to surrounding bins (±2 bins)
      for (let offset = -2; offset <= 2; offset++) {
        const idx = binIndex + offset;
        if (idx >= 0 && idx < emphasized.length) {
          const distance = Math.abs(offset);
          const factor = 1 + emphasis * (1 - distance * 0.3);
          emphasized[idx] *= factor;
        }
      }
    }

    // Log 432Hz detection
    const bin432 = Math.round(432 / binWidth);
    if (bin432 < emphasized.length && emphasized[bin432] > 0.1) {
      this.logger.frequency432Hz('emphasis_applied', 432, {
        magnitude: emphasized[bin432]
      });
    }

    return emphasized;
  }

  /**
   * Resample frequencies to bar count using logarithmic scale
   */
  private resampleFrequencies(frequencies: Float32Array, sampleRate: number): Float32Array {
    const barValues = new Float32Array(this.config.barCount);
    const minFreq = 20;
    const maxFreq = Math.min(20000, sampleRate / 2);
    const binWidth = sampleRate / (frequencies.length * 2);

    for (let i = 0; i < this.config.barCount; i++) {
      // Logarithmic frequency mapping
      const t = i / (this.config.barCount - 1);
      const freqLow = minFreq * Math.pow(maxFreq / minFreq, t);
      const freqHigh = minFreq * Math.pow(maxFreq / minFreq, (i + 1) / (this.config.barCount - 1));

      const binLow = Math.floor(freqLow / binWidth);
      const binHigh = Math.ceil(freqHigh / binWidth);

      // Average magnitude in frequency range
      let sum = 0;
      let count = 0;
      for (let bin = binLow; bin <= binHigh && bin < frequencies.length; bin++) {
        sum += frequencies[bin];
        count++;
      }

      barValues[i] = count > 0 ? sum / count : 0;
    }

    // Normalize
    const maxValue = Math.max(...barValues, 0.001);
    for (let i = 0; i < barValues.length; i++) {
      barValues[i] = Math.min(1, barValues[i] / maxValue);
    }

    return barValues;
  }

  /**
   * Apply temporal smoothing
   */
  private applySmoothing(values: Float32Array): Float32Array {
    const smoothed = new Float32Array(values.length);
    const smoothing = this.config.smoothing;

    for (let i = 0; i < values.length; i++) {
      smoothed[i] = this.previousValues[i] * smoothing + values[i] * (1 - smoothing);
      this.previousValues[i] = smoothed[i];
    }

    return smoothed;
  }

  /**
   * Update peak hold values
   */
  private updatePeaks(values: Float32Array): void {
    for (let i = 0; i < values.length; i++) {
      if (values[i] >= this.peakValues[i]) {
        this.peakValues[i] = values[i];
        this.peakHoldFrames[i] = this.config.peakHold;
      } else {
        this.peakHoldFrames[i]--;
        if (this.peakHoldFrames[i] <= 0) {
          this.peakValues[i] = Math.max(values[i], this.peakValues[i] - 0.02);
        }
      }
    }
  }

  /**
   * Render bar visualization
   */
  private renderBars(values: Float32Array, sampleRate: number): RenderedSpectrum {
    const { width, height, barCount, barGap } = this.config;
    const barWidth = this.config.barWidth || ((width - (barCount - 1) * barGap) / barCount);
    const minFreq = 20;
    const maxFreq = Math.min(20000, sampleRate / 2);

    const bars: RenderedSpectrum['bars'] = [];
    const peaks: RenderedSpectrum['peaks'] = [];
    const labels: RenderedSpectrum['labels'] = [];

    for (let i = 0; i < values.length; i++) {
      const x = i * (barWidth + barGap);
      const barHeight = values[i] * height;
      const y = height - barHeight;

      // Calculate frequency for this bar
      const t = i / (barCount - 1);
      const frequency = minFreq * Math.pow(maxFreq / minFreq, t);

      // Check if this is a 432Hz harmonic
      const is432Hz = this.is432HzFrequency(frequency);

      // Get color
      const color = this.getBarColor(i, values[i], frequency, is432Hz);

      bars.push({
        x,
        y,
        width: barWidth,
        height: barHeight,
        color,
        is432Hz,
        frequency,
        magnitude: values[i]
      });

      // Add peak indicator
      peaks.push({
        x: x + barWidth / 2,
        y: height - this.peakValues[i] * height
      });
    }

    // Add frequency labels if enabled
    if (this.config.showLabels) {
      const labelFreqs = [50, 100, 200, 432, 500, 1000, 2000, 5000, 10000];
      for (const freq of labelFreqs) {
        const t = Math.log(freq / minFreq) / Math.log(maxFreq / minFreq);
        const x = t * width;
        labels.push({
          x,
          y: height + 15,
          text: freq >= 1000 ? `${freq / 1000}k` : `${freq}`
        });
      }
    }

    return { bars, peaks, labels };
  }

  /**
   * Render radial visualization
   */
  private renderRadial(values: Float32Array, sampleRate: number): RenderedSpectrum {
    const { width, height, barCount } = this.config;
    const centerX = width / 2;
    const centerY = height / 2;
    const innerRadius = Math.min(width, height) * 0.15;
    const maxRadius = Math.min(width, height) * 0.45;

    const bars: RenderedSpectrum['bars'] = [];
    const peaks: RenderedSpectrum['peaks'] = [];
    const minFreq = 20;
    const maxFreq = Math.min(20000, sampleRate / 2);

    for (let i = 0; i < values.length; i++) {
      const angle = (i / barCount) * Math.PI * 2 - Math.PI / 2;
      const barHeight = values[i] * (maxRadius - innerRadius);
      const radius = innerRadius + barHeight;

      const t = i / (barCount - 1);
      const frequency = minFreq * Math.pow(maxFreq / minFreq, t);
      const is432Hz = this.is432HzFrequency(frequency);

      const x = centerX + Math.cos(angle) * innerRadius;
      const y = centerY + Math.sin(angle) * innerRadius;

      const color = this.getBarColor(i, values[i], frequency, is432Hz);

      bars.push({
        x,
        y,
        width: 3, // Line width
        height: barHeight,
        color,
        is432Hz,
        frequency,
        magnitude: values[i]
      });

      // Peak position
      const peakRadius = innerRadius + this.peakValues[i] * (maxRadius - innerRadius);
      peaks.push({
        x: centerX + Math.cos(angle) * peakRadius,
        y: centerY + Math.sin(angle) * peakRadius
      });
    }

    return { bars, peaks };
  }

  /**
   * Render wave visualization
   */
  private renderWave(values: Float32Array, sampleRate: number): RenderedSpectrum {
    const { width, height, barCount } = this.config;
    const centerY = height / 2;
    const minFreq = 20;
    const maxFreq = Math.min(20000, sampleRate / 2);

    const bars: RenderedSpectrum['bars'] = [];
    const peaks: RenderedSpectrum['peaks'] = [];

    for (let i = 0; i < values.length; i++) {
      const x = (i / (barCount - 1)) * width;
      const amplitude = values[i] * (height / 2) * 0.9;
      const y = centerY - amplitude;

      const t = i / (barCount - 1);
      const frequency = minFreq * Math.pow(maxFreq / minFreq, t);
      const is432Hz = this.is432HzFrequency(frequency);
      const color = this.getBarColor(i, values[i], frequency, is432Hz);

      bars.push({
        x,
        y,
        width: 2,
        height: amplitude * 2,
        color,
        is432Hz,
        frequency,
        magnitude: values[i]
      });

      peaks.push({
        x,
        y: centerY - this.peakValues[i] * (height / 2) * 0.9
      });
    }

    return { bars, peaks };
  }

  /**
   * Render mirror visualization (symmetrical)
   */
  private renderMirror(values: Float32Array, sampleRate: number): RenderedSpectrum {
    const { width, height, barCount, barGap } = this.config;
    const barWidth = this.config.barWidth || ((width - (barCount - 1) * barGap) / barCount);
    const centerY = height / 2;
    const minFreq = 20;
    const maxFreq = Math.min(20000, sampleRate / 2);

    const bars: RenderedSpectrum['bars'] = [];
    const peaks: RenderedSpectrum['peaks'] = [];

    for (let i = 0; i < values.length; i++) {
      const x = i * (barWidth + barGap);
      const barHeight = values[i] * (height / 2) * 0.9;

      const t = i / (barCount - 1);
      const frequency = minFreq * Math.pow(maxFreq / minFreq, t);
      const is432Hz = this.is432HzFrequency(frequency);
      const color = this.getBarColor(i, values[i], frequency, is432Hz);

      // Upper bar
      bars.push({
        x,
        y: centerY - barHeight,
        width: barWidth,
        height: barHeight,
        color,
        is432Hz,
        frequency,
        magnitude: values[i]
      });

      // Lower bar (mirror)
      bars.push({
        x,
        y: centerY,
        width: barWidth,
        height: barHeight,
        color,
        is432Hz,
        frequency,
        magnitude: values[i]
      });

      // Peak
      const peakHeight = this.peakValues[i] * (height / 2) * 0.9;
      peaks.push({
        x: x + barWidth / 2,
        y: centerY - peakHeight
      });
      peaks.push({
        x: x + barWidth / 2,
        y: centerY + peakHeight
      });
    }

    return { bars, peaks };
  }

  /**
   * Check if frequency is a 432Hz harmonic
   */
  private is432HzFrequency(frequency: number, tolerance: number = 10): boolean {
    return SACRED_CONSTANTS.FREQUENCY_432HZ_HARMONICS.some(
      h => Math.abs(frequency - h) <= tolerance
    );
  }

  /**
   * Get color for a bar
   */
  private getBarColor(
    index: number,
    magnitude: number,
    frequency: number,
    is432Hz: boolean
  ): string {
    if (is432Hz && this.config.emphasize432Hz) {
      // Golden color for 432Hz frequencies
      const lightness = 50 + magnitude * 30;
      return `hsl(45, 100%, ${lightness}%)`;
    }

    switch (this.config.colorMode) {
      case 'frequency':
        return this.frequencyToColor(frequency, magnitude);

      case 'gradient':
        const hue = (index / this.config.barCount) * 300;
        const saturation = 70 + magnitude * 30;
        const lightness = 40 + magnitude * 30;
        return `hsl(${hue}, ${saturation}%, ${lightness}%)`;

      case 'custom':
        if (this.config.customColors.length > 0) {
          const colorIndex = Math.floor((index / this.config.barCount) * this.config.customColors.length);
          return this.config.customColors[Math.min(colorIndex, this.config.customColors.length - 1)];
        }
        return this.frequencyToColor(frequency, magnitude);

      default:
        return this.frequencyToColor(frequency, magnitude);
    }
  }

  /**
   * Map frequency to color
   */
  private frequencyToColor(frequency: number, magnitude: number): string {
    // Logarithmic mapping from 20Hz-20kHz to hue 0-270 (red to violet)
    const normalizedFreq = Math.log(frequency / 20) / Math.log(20000 / 20);
    const hue = normalizedFreq * 270;
    const saturation = 70 + magnitude * 30;
    const lightness = 40 + magnitude * 30;

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
  }

  /**
   * Generate SVG for the spectrum
   */
  toSVG(spectrum: RenderedSpectrum): string {
    let svg = '';

    // Render bars
    for (const bar of spectrum.bars) {
      if (this.config.mode === 'radial') {
        // Radial line
        const angle = Math.atan2(bar.y - this.config.height / 2, bar.x - this.config.width / 2);
        const endX = bar.x + Math.cos(angle) * bar.height;
        const endY = bar.y + Math.sin(angle) * bar.height;
        svg += `<line x1="${bar.x}" y1="${bar.y}" x2="${endX}" y2="${endY}" stroke="${bar.color}" stroke-width="${bar.width}" stroke-linecap="round" />`;
      } else if (this.config.mode === 'wave') {
        // Point for wave path
        // Will be handled as path below
      } else {
        // Regular bar
        svg += `<rect x="${bar.x}" y="${bar.y}" width="${bar.width}" height="${bar.height}" fill="${bar.color}" />`;

        // Add glow effect for 432Hz
        if (bar.is432Hz && this.config.emphasize432Hz) {
          svg += `<rect x="${bar.x - 2}" y="${bar.y - 2}" width="${bar.width + 4}" height="${bar.height + 4}" fill="${bar.color}" opacity="0.3" filter="url(#glow)" />`;
        }
      }
    }

    // Render peaks
    for (const peak of spectrum.peaks) {
      svg += `<circle cx="${peak.x}" cy="${peak.y}" r="2" fill="white" opacity="0.8" />`;
    }

    // Render labels
    if (spectrum.labels) {
      for (const label of spectrum.labels) {
        const isSpecial = label.text === '432' || label.text === '432Hz';
        const fill = isSpecial ? '#FFD700' : '#888';
        svg += `<text x="${label.x}" y="${label.y}" fill="${fill}" font-size="10" text-anchor="middle">${label.text}</text>`;
      }
    }

    return svg;
  }

  /**
   * Reset state (for new composition)
   */
  reset(): void {
    this.previousValues.fill(0);
    this.peakValues.fill(0);
    this.peakHoldFrames.fill(0);
  }
}

export default FrequencyVisualizer;
