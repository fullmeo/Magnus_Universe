/**
 * REMOTION AGENT - WAVEFORM RENDERER
 *
 * Renders audio waveform visualization
 * Supports multiple styles: line, bars, circular, filled
 * Responds to beats and audio energy
 */

import {
  AudioAnalysisResult,
  SACRED_CONSTANTS
} from '../types';
import { createLogger, RemotionLogger } from '../utils/logger';

// ============================================================================
// WAVEFORM RENDERER TYPES
// ============================================================================

export interface WaveformRendererConfig {
  width: number;
  height: number;
  style: 'line' | 'bars' | 'circular' | 'filled' | 'mirror';
  color?: string;
  gradientColors?: string[];
  lineWidth?: number;
  smoothing?: number;
  responseToBeats?: boolean;
  beatPulseAmount?: number;
  sampleCount?: number;
  normalize?: boolean;
}

export interface WaveformFrame {
  audioData: Float32Array;
  time: number;
  frameNumber: number;
  beat?: { strength: number; isDownbeat: boolean };
  rms?: number;
}

export interface RenderedWaveform {
  points: Array<{ x: number; y: number }>;
  path: string;
  fillPath?: string;
  color: string;
  gradientId?: string;
  thickness: number;
  pulse: number;
}

// ============================================================================
// WAVEFORM RENDERER CLASS
// ============================================================================

export class WaveformRenderer {
  private config: Required<WaveformRendererConfig>;
  private logger: RemotionLogger;
  private previousData: Float32Array;

  constructor(config: WaveformRendererConfig) {
    this.config = {
      width: config.width,
      height: config.height,
      style: config.style,
      color: config.color ?? '#00ffff',
      gradientColors: config.gradientColors ?? ['#00ffff', '#ff00ff', '#ffff00'],
      lineWidth: config.lineWidth ?? 2,
      smoothing: config.smoothing ?? 0.5,
      responseToBeats: config.responseToBeats ?? true,
      beatPulseAmount: config.beatPulseAmount ?? 0.3,
      sampleCount: config.sampleCount ?? 256,
      normalize: config.normalize ?? true
    };

    this.logger = createLogger();
    this.previousData = new Float32Array(this.config.sampleCount);
  }

  /**
   * Render waveform for a frame
   */
  render(frame: WaveformFrame): RenderedWaveform {
    // Resample audio data
    const samples = this.resampleAudio(frame.audioData);

    // Apply smoothing
    const smoothed = this.applySmoothing(samples);

    // Calculate beat pulse
    const pulse = frame.beat && this.config.responseToBeats
      ? frame.beat.strength * this.config.beatPulseAmount
      : 0;

    // Render based on style
    switch (this.config.style) {
      case 'line':
        return this.renderLine(smoothed, pulse);
      case 'bars':
        return this.renderBars(smoothed, pulse);
      case 'circular':
        return this.renderCircular(smoothed, pulse);
      case 'filled':
        return this.renderFilled(smoothed, pulse);
      case 'mirror':
        return this.renderMirror(smoothed, pulse);
      default:
        return this.renderLine(smoothed, pulse);
    }
  }

  /**
   * Resample audio data to target sample count
   */
  private resampleAudio(audioData: Float32Array): Float32Array {
    const samples = new Float32Array(this.config.sampleCount);
    const step = audioData.length / this.config.sampleCount;

    for (let i = 0; i < this.config.sampleCount; i++) {
      const start = Math.floor(i * step);
      const end = Math.floor((i + 1) * step);

      // Average samples in range
      let sum = 0;
      for (let j = start; j < end && j < audioData.length; j++) {
        sum += audioData[j];
      }
      samples[i] = sum / (end - start);
    }

    // Normalize if enabled
    if (this.config.normalize) {
      const max = Math.max(...samples.map(Math.abs), 0.001);
      for (let i = 0; i < samples.length; i++) {
        samples[i] /= max;
      }
    }

    return samples;
  }

  /**
   * Apply temporal smoothing
   */
  private applySmoothing(samples: Float32Array): Float32Array {
    const smoothed = new Float32Array(samples.length);
    const smoothing = this.config.smoothing;

    for (let i = 0; i < samples.length; i++) {
      smoothed[i] = this.previousData[i] * smoothing + samples[i] * (1 - smoothing);
      this.previousData[i] = smoothed[i];
    }

    return smoothed;
  }

  /**
   * Render line waveform
   */
  private renderLine(samples: Float32Array, pulse: number): RenderedWaveform {
    const { width, height, color, lineWidth } = this.config;
    const centerY = height / 2;
    const amplitude = (height / 2) * 0.9 * (1 + pulse);

    const points: Array<{ x: number; y: number }> = [];

    for (let i = 0; i < samples.length; i++) {
      const x = (i / (samples.length - 1)) * width;
      const y = centerY - samples[i] * amplitude;
      points.push({ x, y });
    }

    // Generate SVG path
    const path = this.pointsToPath(points);

    return {
      points,
      path,
      color,
      thickness: lineWidth * (1 + pulse * 0.5),
      pulse
    };
  }

  /**
   * Render bar waveform
   */
  private renderBars(samples: Float32Array, pulse: number): RenderedWaveform {
    const { width, height, color } = this.config;
    const centerY = height / 2;
    const amplitude = (height / 2) * 0.9 * (1 + pulse);
    const barWidth = width / samples.length * 0.8;

    const points: Array<{ x: number; y: number }> = [];

    for (let i = 0; i < samples.length; i++) {
      const x = (i / samples.length) * width + barWidth / 2;
      const barHeight = Math.abs(samples[i]) * amplitude;
      const y = samples[i] >= 0 ? centerY - barHeight : centerY;
      points.push({ x, y });
    }

    // Generate path (series of rectangles)
    let path = '';
    for (let i = 0; i < samples.length; i++) {
      const x = (i / samples.length) * width;
      const barHeight = Math.abs(samples[i]) * amplitude;
      const y = centerY - barHeight / 2;
      path += `M ${x} ${y} h ${barWidth} v ${barHeight} h ${-barWidth} Z `;
    }

    return {
      points,
      path,
      color,
      thickness: barWidth,
      pulse
    };
  }

  /**
   * Render circular waveform
   */
  private renderCircular(samples: Float32Array, pulse: number): RenderedWaveform {
    const { width, height, color, lineWidth } = this.config;
    const centerX = width / 2;
    const centerY = height / 2;
    const innerRadius = Math.min(width, height) * 0.2;
    const maxRadius = Math.min(width, height) * 0.45 * (1 + pulse);

    const points: Array<{ x: number; y: number }> = [];

    for (let i = 0; i < samples.length; i++) {
      const angle = (i / samples.length) * Math.PI * 2 - Math.PI / 2;
      const radius = innerRadius + Math.abs(samples[i]) * (maxRadius - innerRadius);

      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;
      points.push({ x, y });
    }

    // Close the path
    points.push(points[0]);

    const path = this.pointsToPath(points);

    return {
      points,
      path,
      color,
      thickness: lineWidth * (1 + pulse * 0.5),
      pulse
    };
  }

  /**
   * Render filled waveform (area chart)
   */
  private renderFilled(samples: Float32Array, pulse: number): RenderedWaveform {
    const { width, height, color, lineWidth } = this.config;
    const centerY = height / 2;
    const amplitude = (height / 2) * 0.9 * (1 + pulse);

    const points: Array<{ x: number; y: number }> = [];

    for (let i = 0; i < samples.length; i++) {
      const x = (i / (samples.length - 1)) * width;
      const y = centerY - samples[i] * amplitude;
      points.push({ x, y });
    }

    // Line path
    const path = this.pointsToPath(points);

    // Fill path (closed to bottom)
    let fillPath = `M 0 ${centerY} `;
    for (const point of points) {
      fillPath += `L ${point.x} ${point.y} `;
    }
    fillPath += `L ${width} ${centerY} Z`;

    return {
      points,
      path,
      fillPath,
      color,
      gradientId: 'waveform-gradient',
      thickness: lineWidth * (1 + pulse * 0.5),
      pulse
    };
  }

  /**
   * Render mirror waveform (symmetrical)
   */
  private renderMirror(samples: Float32Array, pulse: number): RenderedWaveform {
    const { width, height, color, lineWidth } = this.config;
    const centerY = height / 2;
    const amplitude = (height / 2) * 0.9 * (1 + pulse);

    const upperPoints: Array<{ x: number; y: number }> = [];
    const lowerPoints: Array<{ x: number; y: number }> = [];

    for (let i = 0; i < samples.length; i++) {
      const x = (i / (samples.length - 1)) * width;
      const sampleAbs = Math.abs(samples[i]);
      const yOffset = sampleAbs * amplitude;

      upperPoints.push({ x, y: centerY - yOffset });
      lowerPoints.push({ x, y: centerY + yOffset });
    }

    // Generate paths
    const upperPath = this.pointsToPath(upperPoints);
    const lowerPath = this.pointsToPath(lowerPoints);

    // Combined fill path
    let fillPath = `M 0 ${centerY} `;
    for (const point of upperPoints) {
      fillPath += `L ${point.x} ${point.y} `;
    }
    fillPath += `L ${width} ${centerY} `;
    for (let i = lowerPoints.length - 1; i >= 0; i--) {
      fillPath += `L ${lowerPoints[i].x} ${lowerPoints[i].y} `;
    }
    fillPath += 'Z';

    return {
      points: [...upperPoints, ...lowerPoints],
      path: upperPath + ' ' + lowerPath,
      fillPath,
      color,
      gradientId: 'waveform-gradient',
      thickness: lineWidth * (1 + pulse * 0.5),
      pulse
    };
  }

  /**
   * Convert points to SVG path
   */
  private pointsToPath(points: Array<{ x: number; y: number }>): string {
    if (points.length === 0) return '';

    let path = `M ${points[0].x.toFixed(2)} ${points[0].y.toFixed(2)}`;

    // Use cubic bezier for smoother curves
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const next = points[Math.min(i + 1, points.length - 1)];

      // Control points for smooth curve
      const cpX = (prev.x + curr.x) / 2;
      const cpY = (prev.y + curr.y) / 2;

      path += ` Q ${cpX.toFixed(2)} ${cpY.toFixed(2)} ${curr.x.toFixed(2)} ${curr.y.toFixed(2)}`;
    }

    return path;
  }

  /**
   * Generate SVG for the waveform
   */
  toSVG(waveform: RenderedWaveform): string {
    let svg = '';

    // Add gradient definition if needed
    if (waveform.gradientId) {
      svg += `
        <defs>
          <linearGradient id="${waveform.gradientId}" x1="0%" y1="0%" x2="0%" y2="100%">
            ${this.config.gradientColors.map((color, i) =>
              `<stop offset="${(i / (this.config.gradientColors.length - 1)) * 100}%" stop-color="${color}" />`
            ).join('')}
          </linearGradient>
        </defs>
      `;
    }

    // Render fill if present
    if (waveform.fillPath) {
      const fillColor = waveform.gradientId ? `url(#${waveform.gradientId})` : waveform.color;
      svg += `<path d="${waveform.fillPath}" fill="${fillColor}" fill-opacity="0.3" />`;
    }

    // Render main path
    svg += `<path d="${waveform.path}" fill="none" stroke="${waveform.color}" stroke-width="${waveform.thickness}" stroke-linecap="round" stroke-linejoin="round" />`;

    // Add glow effect
    svg += `<path d="${waveform.path}" fill="none" stroke="${waveform.color}" stroke-width="${waveform.thickness + 4}" stroke-linecap="round" stroke-linejoin="round" opacity="0.3" filter="url(#glow)" />`;

    return svg;
  }

  /**
   * Reset state
   */
  reset(): void {
    this.previousData.fill(0);
  }

  /**
   * Create frame from audio analysis at given time
   */
  createFrameFromAnalysis(
    analysis: AudioAnalysisResult,
    time: number,
    fps: number
  ): Partial<WaveformFrame> {
    const frameNumber = Math.floor((time / 1000) * fps);

    // Find nearby beat
    const nearbyBeat = analysis.beats.find(b => Math.abs(b.time - time) < 100);

    // Get RMS at this time
    const rmsIndex = Math.min(
      analysis.rms.length - 1,
      Math.floor((time / analysis.duration) * analysis.rms.length)
    );

    return {
      time,
      frameNumber,
      beat: nearbyBeat ? {
        strength: nearbyBeat.strength,
        isDownbeat: nearbyBeat.type === 'downbeat'
      } : undefined,
      rms: analysis.rms[rmsIndex]
    };
  }
}

export default WaveformRenderer;
