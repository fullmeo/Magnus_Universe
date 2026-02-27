/**
 * REMOTION AGENT - AUDIO ANALYZER
 *
 * Extracts audio features for synchronization and visualization
 * Includes FFT analysis, beat detection, onset detection, and harmonic analysis
 * Special handling for 432Hz frequency detection
 */

import {
  AudioAnalysisResult,
  BeatData,
  PeakData,
  Section,
  HarmonicData,
  AnalysisConfidence,
  SACRED_CONSTANTS
} from '../types';
import { createLogger, RemotionLogger } from '../utils/logger';
import { AudioAnalysisError, InvalidAudioError } from '../utils/error-handler';
import { audioAnalysisDefaults } from '../config/defaults';

// ============================================================================
// AUDIO ANALYZER CONFIGURATION
// ============================================================================

export interface AudioAnalyzerConfig {
  sampleRate?: number;
  windowSize?: number;
  hopSize?: number;
  minFrequency?: number;
  maxFrequency?: number;
  beatDetectionThreshold?: number;
  onsetDetectionThreshold?: number;
  harmonicDetectionThreshold?: number;
  maxHarmonics?: number;
  enable432HzDetection?: boolean;
}

// ============================================================================
// AUDIO ANALYZER CLASS
// ============================================================================

export class AudioAnalyzer {
  private config: Required<AudioAnalyzerConfig>;
  private logger: RemotionLogger;

  constructor(config: AudioAnalyzerConfig = {}) {
    this.config = {
      sampleRate: config.sampleRate ?? audioAnalysisDefaults.sampleRate,
      windowSize: config.windowSize ?? audioAnalysisDefaults.windowSize,
      hopSize: config.hopSize ?? audioAnalysisDefaults.hopSize,
      minFrequency: config.minFrequency ?? audioAnalysisDefaults.minFrequency,
      maxFrequency: config.maxFrequency ?? audioAnalysisDefaults.maxFrequency,
      beatDetectionThreshold: config.beatDetectionThreshold ?? audioAnalysisDefaults.beatDetectionThreshold,
      onsetDetectionThreshold: config.onsetDetectionThreshold ?? audioAnalysisDefaults.onsetDetectionThreshold,
      harmonicDetectionThreshold: config.harmonicDetectionThreshold ?? audioAnalysisDefaults.harmonicDetectionThreshold,
      maxHarmonics: config.maxHarmonics ?? audioAnalysisDefaults.maxHarmonics,
      enable432HzDetection: config.enable432HzDetection ?? true
    };
    this.logger = createLogger();
  }

  /**
   * Main analysis method - processes audio and extracts all features
   */
  async analyze(audioData: Float32Array, sampleRate?: number): Promise<AudioAnalysisResult> {
    const startTime = Date.now();
    this.logger.phaseStart('audio_analysis');

    const sr = sampleRate ?? this.config.sampleRate;

    // Validate input
    if (!audioData || audioData.length === 0) {
      throw new InvalidAudioError('Audio data is empty or undefined');
    }

    if (audioData.length < this.config.windowSize) {
      throw new InvalidAudioError(`Audio data too short: ${audioData.length} samples, need at least ${this.config.windowSize}`);
    }

    try {
      // Normalize audio
      const normalizedAudio = this.normalizeAudio(audioData);

      // Compute STFT (Short-Time Fourier Transform)
      const stft = this.computeSTFT(normalizedAudio, sr);

      // Extract time-domain features
      const energy = this.computeEnergy(normalizedAudio, this.config.hopSize);
      const rms = this.computeRMS(normalizedAudio, this.config.hopSize);

      // Extract frequency-domain features
      const frequencies = this.computeAverageSpectrum(stft);
      const spectralCentroid = this.computeSpectralCentroid(stft, sr);
      const spectralSpread = this.computeSpectralSpread(stft, sr, spectralCentroid);
      const spectralFlux = this.computeSpectralFlux(stft);

      // Detect events
      const beats = this.detectBeats(energy, sr);
      const onsets = this.detectOnsets(spectralFlux, sr);
      const peaks = this.detectPeaks(energy, frequencies, sr);

      // Analyze structure
      const structure = this.detectStructure(energy, spectralFlux, sr, audioData.length);

      // Harmonic analysis
      const fundamentalFrequency = this.detectFundamentalFrequency(stft, sr);
      const harmonics = this.detectHarmonics(stft, fundamentalFrequency, sr);

      // Tempo estimation
      const { tempo, tempogram } = this.estimateTempo(beats, sr);

      // MFCC (Mel-frequency cepstral coefficients)
      const mfcc = this.computeMFCC(stft, sr);

      // Confidence scores
      const confidence = this.computeConfidence(beats, onsets, fundamentalFrequency, tempo);

      const duration = audioData.length / sr * 1000; // milliseconds

      const result: AudioAnalysisResult = {
        frequencies,
        frequencyBins: this.config.windowSize / 2,
        sampleRate: sr,
        duration,
        beats,
        onsets,
        peaks,
        energy,
        rms,
        structure,
        fundamentalFrequency,
        harmonics,
        spectralCentroid,
        spectralSpread,
        spectralFlux,
        mfcc,
        tempogram,
        estimatedTempo: tempo,
        confidence
      };

      const analysisTime = Date.now() - startTime;
      this.logger.phaseComplete('audio_analysis', analysisTime, {
        duration,
        beatCount: beats.length,
        tempo,
        fundamentalFrequency
      });

      return result;
    } catch (error) {
      if (error instanceof InvalidAudioError) {
        throw error;
      }
      throw new AudioAnalysisError(
        `Failed to analyze audio: ${error instanceof Error ? error.message : String(error)}`,
        { originalError: error }
      );
    }
  }

  /**
   * Normalize audio to -3dB peak
   */
  private normalizeAudio(audio: Float32Array): Float32Array {
    const maxAmplitude = audio.reduce((max, sample) => Math.max(max, Math.abs(sample)), 0);
    if (maxAmplitude === 0) return audio;

    const targetPeak = 0.707; // -3dB
    const gain = targetPeak / maxAmplitude;

    const normalized = new Float32Array(audio.length);
    for (let i = 0; i < audio.length; i++) {
      normalized[i] = audio[i] * gain;
    }
    return normalized;
  }

  /**
   * Compute Short-Time Fourier Transform
   */
  private computeSTFT(audio: Float32Array, sampleRate: number): number[][] {
    const windowSize = this.config.windowSize;
    const hopSize = this.config.hopSize;
    const numFrames = Math.floor((audio.length - windowSize) / hopSize) + 1;
    const stft: number[][] = [];

    // Hann window
    const window = this.createHannWindow(windowSize);

    for (let frame = 0; frame < numFrames; frame++) {
      const start = frame * hopSize;
      const segment = new Float32Array(windowSize);

      // Apply window
      for (let i = 0; i < windowSize; i++) {
        segment[i] = (audio[start + i] || 0) * window[i];
      }

      // Compute FFT
      const spectrum = this.computeFFT(segment);
      stft.push(spectrum);
    }

    return stft;
  }

  /**
   * Create Hann window
   */
  private createHannWindow(size: number): Float32Array {
    const window = new Float32Array(size);
    for (let i = 0; i < size; i++) {
      window[i] = 0.5 * (1 - Math.cos((2 * Math.PI * i) / (size - 1)));
    }
    return window;
  }

  /**
   * Compute FFT (simplified DFT implementation)
   * For production, use a proper FFT library like fft-js
   */
  private computeFFT(signal: Float32Array): number[] {
    const N = signal.length;
    const spectrum = new Array(N / 2).fill(0);

    // Simplified magnitude spectrum computation
    for (let k = 0; k < N / 2; k++) {
      let real = 0;
      let imag = 0;

      for (let n = 0; n < N; n++) {
        const angle = (2 * Math.PI * k * n) / N;
        real += signal[n] * Math.cos(angle);
        imag -= signal[n] * Math.sin(angle);
      }

      spectrum[k] = Math.sqrt(real * real + imag * imag) / N;
    }

    return spectrum;
  }

  /**
   * Compute energy envelope
   */
  private computeEnergy(audio: Float32Array, hopSize: number): number[] {
    const energy: number[] = [];
    const windowSize = this.config.windowSize;

    for (let i = 0; i < audio.length - windowSize; i += hopSize) {
      let sum = 0;
      for (let j = 0; j < windowSize; j++) {
        sum += audio[i + j] * audio[i + j];
      }
      energy.push(sum / windowSize);
    }

    return energy;
  }

  /**
   * Compute RMS envelope
   */
  private computeRMS(audio: Float32Array, hopSize: number): number[] {
    const energy = this.computeEnergy(audio, hopSize);
    return energy.map(e => Math.sqrt(e));
  }

  /**
   * Compute average spectrum across all frames
   */
  private computeAverageSpectrum(stft: number[][]): Float32Array {
    if (stft.length === 0) return new Float32Array(0);

    const spectrumLength = stft[0].length;
    const avgSpectrum = new Float32Array(spectrumLength);

    for (const frame of stft) {
      for (let i = 0; i < spectrumLength; i++) {
        avgSpectrum[i] += frame[i];
      }
    }

    for (let i = 0; i < spectrumLength; i++) {
      avgSpectrum[i] /= stft.length;
    }

    return avgSpectrum;
  }

  /**
   * Compute spectral centroid (brightness indicator)
   */
  private computeSpectralCentroid(stft: number[][], sampleRate: number): number[] {
    const centroids: number[] = [];
    const freqPerBin = sampleRate / this.config.windowSize;

    for (const frame of stft) {
      let weightedSum = 0;
      let magnitudeSum = 0;

      for (let i = 0; i < frame.length; i++) {
        const frequency = i * freqPerBin;
        weightedSum += frequency * frame[i];
        magnitudeSum += frame[i];
      }

      centroids.push(magnitudeSum > 0 ? weightedSum / magnitudeSum : 0);
    }

    return centroids;
  }

  /**
   * Compute spectral spread
   */
  private computeSpectralSpread(stft: number[][], sampleRate: number, centroids: number[]): number[] {
    const spreads: number[] = [];
    const freqPerBin = sampleRate / this.config.windowSize;

    for (let frameIdx = 0; frameIdx < stft.length; frameIdx++) {
      const frame = stft[frameIdx];
      const centroid = centroids[frameIdx];
      let weightedVariance = 0;
      let magnitudeSum = 0;

      for (let i = 0; i < frame.length; i++) {
        const frequency = i * freqPerBin;
        const diff = frequency - centroid;
        weightedVariance += diff * diff * frame[i];
        magnitudeSum += frame[i];
      }

      spreads.push(magnitudeSum > 0 ? Math.sqrt(weightedVariance / magnitudeSum) : 0);
    }

    return spreads;
  }

  /**
   * Compute spectral flux (rate of spectral change)
   */
  private computeSpectralFlux(stft: number[][]): number[] {
    const flux: number[] = [0];

    for (let i = 1; i < stft.length; i++) {
      let sum = 0;
      for (let j = 0; j < stft[i].length; j++) {
        const diff = stft[i][j] - stft[i - 1][j];
        sum += Math.max(0, diff); // Half-wave rectified
      }
      flux.push(sum);
    }

    return flux;
  }

  /**
   * Detect beats using energy envelope peak picking
   */
  private detectBeats(energy: number[], sampleRate: number): BeatData[] {
    const beats: BeatData[] = [];
    const hopSize = this.config.hopSize;
    const threshold = this.config.beatDetectionThreshold;

    // Smooth energy with moving average
    const smoothed = this.movingAverage(energy, 5);

    // Compute dynamic threshold
    const mean = smoothed.reduce((a, b) => a + b, 0) / smoothed.length;
    const dynamicThreshold = mean * (1 + threshold);

    // Peak picking
    let downbeatCounter = 0;
    for (let i = 1; i < smoothed.length - 1; i++) {
      if (smoothed[i] > smoothed[i - 1] &&
          smoothed[i] > smoothed[i + 1] &&
          smoothed[i] > dynamicThreshold) {

        const time = (i * hopSize) / sampleRate * 1000;
        const strength = smoothed[i] / mean;
        const confidence = Math.min(1, strength / 3);

        // Simple downbeat detection (every 4th beat)
        const isDownbeat = downbeatCounter % 4 === 0;
        downbeatCounter++;

        beats.push({
          time,
          frameIndex: i,
          confidence,
          type: isDownbeat ? 'downbeat' : 'beat',
          strength
        });
      }
    }

    return beats;
  }

  /**
   * Detect onsets using spectral flux
   */
  private detectOnsets(spectralFlux: number[], sampleRate: number): number[] {
    const onsets: number[] = [];
    const hopSize = this.config.hopSize;
    const threshold = this.config.onsetDetectionThreshold;

    // Normalize flux
    const maxFlux = Math.max(...spectralFlux);
    const normalizedFlux = spectralFlux.map(f => f / (maxFlux || 1));

    // Peak picking with adaptive threshold
    const windowSize = 10;
    for (let i = windowSize; i < normalizedFlux.length - windowSize; i++) {
      const localMean = normalizedFlux
        .slice(i - windowSize, i + windowSize)
        .reduce((a, b) => a + b, 0) / (windowSize * 2);

      if (normalizedFlux[i] > localMean + threshold &&
          normalizedFlux[i] > normalizedFlux[i - 1] &&
          normalizedFlux[i] > normalizedFlux[i + 1]) {
        const time = (i * hopSize) / sampleRate * 1000;
        onsets.push(time);
      }
    }

    return onsets;
  }

  /**
   * Detect peaks in energy and frequency
   */
  private detectPeaks(energy: number[], frequencies: Float32Array, sampleRate: number): PeakData[] {
    const peaks: PeakData[] = [];
    const hopSize = this.config.hopSize;
    const freqPerBin = sampleRate / this.config.windowSize;

    // Energy peaks
    const energyThreshold = Math.max(...energy) * 0.7;
    for (let i = 1; i < energy.length - 1; i++) {
      if (energy[i] > energy[i - 1] &&
          energy[i] > energy[i + 1] &&
          energy[i] > energyThreshold) {
        peaks.push({
          time: (i * hopSize) / sampleRate * 1000,
          frameIndex: i,
          frequency: 0,
          magnitude: energy[i],
          type: 'energy'
        });
      }
    }

    // Frequency peaks
    for (let i = 1; i < frequencies.length - 1; i++) {
      if (frequencies[i] > frequencies[i - 1] &&
          frequencies[i] > frequencies[i + 1] &&
          frequencies[i] > 0.1) {
        peaks.push({
          time: 0,
          frameIndex: i,
          frequency: i * freqPerBin,
          magnitude: frequencies[i],
          type: 'frequency'
        });
      }
    }

    return peaks;
  }

  /**
   * Detect song structure (intro, verse, chorus, etc.)
   */
  private detectStructure(
    energy: number[],
    spectralFlux: number[],
    sampleRate: number,
    totalSamples: number
  ): Section[] {
    const sections: Section[] = [];
    const hopSize = this.config.hopSize;
    const totalDuration = totalSamples / sampleRate * 1000;

    // Simple structure detection based on energy levels
    const avgEnergy = energy.reduce((a, b) => a + b, 0) / energy.length;

    // Divide into segments and classify
    const segmentLength = Math.floor(energy.length / 8); // 8 segments
    for (let i = 0; i < 8; i++) {
      const start = i * segmentLength;
      const end = Math.min((i + 1) * segmentLength, energy.length);
      const segmentEnergy = energy.slice(start, end);
      const segmentAvg = segmentEnergy.reduce((a, b) => a + b, 0) / segmentEnergy.length;

      const startTime = (start * hopSize) / sampleRate * 1000;
      const endTime = (end * hopSize) / sampleRate * 1000;

      let type: Section['type'];
      if (i === 0) {
        type = 'intro';
      } else if (i === 7) {
        type = 'outro';
      } else if (segmentAvg > avgEnergy * 1.3) {
        type = 'chorus';
      } else if (segmentAvg > avgEnergy * 1.1) {
        type = 'buildup';
      } else if (segmentAvg < avgEnergy * 0.7) {
        type = 'break';
      } else {
        type = 'verse';
      }

      sections.push({
        startTime,
        endTime,
        type,
        confidence: 0.7,
        label: `Section ${i + 1}`
      });
    }

    return sections;
  }

  /**
   * Detect fundamental frequency using harmonic product spectrum
   */
  private detectFundamentalFrequency(stft: number[][], sampleRate: number): number {
    // Average spectrum
    const avgSpectrum = this.computeAverageSpectrum(stft);
    const freqPerBin = sampleRate / this.config.windowSize;

    // Harmonic product spectrum
    const hps = new Float32Array(avgSpectrum.length / 4);
    for (let i = 0; i < hps.length; i++) {
      hps[i] = avgSpectrum[i];
      for (let h = 2; h <= 4; h++) {
        if (i * h < avgSpectrum.length) {
          hps[i] *= avgSpectrum[i * h];
        }
      }
    }

    // Find peak (fundamental)
    let maxIdx = 0;
    let maxVal = 0;
    const minBin = Math.floor(this.config.minFrequency / freqPerBin);
    const maxBin = Math.min(hps.length, Math.floor(this.config.maxFrequency / freqPerBin));

    for (let i = minBin; i < maxBin; i++) {
      if (hps[i] > maxVal) {
        maxVal = hps[i];
        maxIdx = i;
      }
    }

    const fundamental = maxIdx * freqPerBin;

    // Check for 432Hz alignment
    if (this.config.enable432HzDetection) {
      const distance432 = Math.abs(fundamental - SACRED_CONSTANTS.FREQUENCY_432HZ);
      if (distance432 < 10) {
        this.logger.frequency432Hz('fundamental_detected', fundamental, { aligned: true });
      }
    }

    return fundamental;
  }

  /**
   * Detect harmonics above fundamental
   */
  private detectHarmonics(stft: number[][], fundamental: number, sampleRate: number): HarmonicData[] {
    const harmonics: HarmonicData[] = [];
    const avgSpectrum = this.computeAverageSpectrum(stft);
    const freqPerBin = sampleRate / this.config.windowSize;
    const threshold = this.config.harmonicDetectionThreshold;

    // Search for harmonics
    for (let n = 1; n <= this.config.maxHarmonics; n++) {
      const expectedFreq = fundamental * n;
      if (expectedFreq > this.config.maxFrequency) break;

      const expectedBin = Math.round(expectedFreq / freqPerBin);
      const searchRange = 3; // Search ±3 bins

      let maxMag = 0;
      let actualBin = expectedBin;

      for (let b = expectedBin - searchRange; b <= expectedBin + searchRange; b++) {
        if (b >= 0 && b < avgSpectrum.length && avgSpectrum[b] > maxMag) {
          maxMag = avgSpectrum[b];
          actualBin = b;
        }
      }

      if (maxMag > threshold) {
        const actualFreq = actualBin * freqPerBin;
        const cents = 1200 * Math.log2(actualFreq / expectedFreq);
        const is432HzAligned = SACRED_CONSTANTS.FREQUENCY_432HZ_HARMONICS.some(
          h => Math.abs(actualFreq - h) < 5
        );

        harmonics.push({
          frequency: actualFreq,
          magnitude: maxMag,
          ratio: n,
          cents,
          is432HzAligned
        });
      }
    }

    return harmonics;
  }

  /**
   * Estimate tempo from beat times
   */
  private estimateTempo(beats: BeatData[], sampleRate: number): { tempo: number; tempogram: number[] } {
    if (beats.length < 2) {
      return { tempo: 120, tempogram: [] };
    }

    // Calculate inter-beat intervals
    const intervals: number[] = [];
    for (let i = 1; i < beats.length; i++) {
      intervals.push(beats[i].time - beats[i - 1].time);
    }

    // Histogram of intervals (binned by 10ms)
    const histogram: Map<number, number> = new Map();
    for (const interval of intervals) {
      const bin = Math.round(interval / 10) * 10;
      histogram.set(bin, (histogram.get(bin) || 0) + 1);
    }

    // Find most common interval
    let maxCount = 0;
    let mostCommonInterval = 500; // Default 120 BPM

    for (const [interval, count] of histogram) {
      if (count > maxCount && interval > 200 && interval < 2000) {
        maxCount = count;
        mostCommonInterval = interval;
      }
    }

    const tempo = 60000 / mostCommonInterval;

    // Create tempogram (tempo over time)
    const tempogram: number[] = [];
    const windowSize = 8; // beats

    for (let i = 0; i < beats.length - windowSize; i++) {
      const windowIntervals = intervals.slice(i, i + windowSize);
      const avgInterval = windowIntervals.reduce((a, b) => a + b, 0) / windowIntervals.length;
      tempogram.push(60000 / avgInterval);
    }

    return { tempo: Math.round(tempo), tempogram };
  }

  /**
   * Compute MFCCs (simplified)
   */
  private computeMFCC(stft: number[][], sampleRate: number): number[][] {
    // Simplified MFCC - just return first 13 coefficients per frame
    const numCoeffs = 13;
    const mfcc: number[][] = [];

    for (const frame of stft) {
      // Apply mel filterbank (simplified - just use log spectrum)
      const logSpectrum = frame.map(v => Math.log(v + 1e-10));

      // DCT (simplified - just take first coefficients)
      const coeffs = logSpectrum.slice(0, numCoeffs);
      mfcc.push(coeffs);
    }

    return mfcc;
  }

  /**
   * Compute confidence scores
   */
  private computeConfidence(
    beats: BeatData[],
    onsets: number[],
    fundamental: number,
    tempo: number
  ): AnalysisConfidence {
    // Beat confidence based on regularity
    let beatConfidence = 0.5;
    if (beats.length > 4) {
      const intervals = beats.slice(1).map((b, i) => b.time - beats[i].time);
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const variance = intervals.reduce((sum, i) => sum + Math.pow(i - avgInterval, 2), 0) / intervals.length;
      const cv = Math.sqrt(variance) / avgInterval; // Coefficient of variation
      beatConfidence = Math.max(0, Math.min(1, 1 - cv));
    }

    // Onset confidence
    const onsetConfidence = onsets.length > 0 ? Math.min(1, onsets.length / 50) : 0;

    // Fundamental frequency confidence
    const freqConfidence = fundamental > 0 ? 0.8 : 0.2;

    // Tempo confidence
    const tempoConfidence = tempo > 60 && tempo < 200 ? 0.8 : 0.5;

    return {
      beat: beatConfidence,
      onset: onsetConfidence,
      fundamentalFrequency: freqConfidence,
      tempo: tempoConfidence,
      overall: (beatConfidence + onsetConfidence + freqConfidence + tempoConfidence) / 4
    };
  }

  /**
   * Moving average smoothing
   */
  private movingAverage(data: number[], windowSize: number): number[] {
    const result: number[] = [];
    for (let i = 0; i < data.length; i++) {
      let sum = 0;
      let count = 0;
      for (let j = Math.max(0, i - windowSize); j <= Math.min(data.length - 1, i + windowSize); j++) {
        sum += data[j];
        count++;
      }
      result.push(sum / count);
    }
    return result;
  }

  /**
   * Get frequency bin index for a given frequency
   */
  public getFrequencyBin(frequency: number, sampleRate?: number): number {
    const sr = sampleRate ?? this.config.sampleRate;
    return Math.round(frequency * this.config.windowSize / sr);
  }

  /**
   * Get frequency for a given bin index
   */
  public getBinFrequency(bin: number, sampleRate?: number): number {
    const sr = sampleRate ?? this.config.sampleRate;
    return bin * sr / this.config.windowSize;
  }

  /**
   * Check if frequency is 432Hz aligned
   */
  public is432HzAligned(frequency: number, tolerance: number = 5): boolean {
    return SACRED_CONSTANTS.FREQUENCY_432HZ_HARMONICS.some(
      h => Math.abs(frequency - h) <= tolerance
    );
  }
}

export default AudioAnalyzer;
