/**
 * REMOTION AGENT - AUDIO ANALYZER TESTS
 *
 * Unit tests for audio analysis functionality
 */

import { AudioAnalyzer } from '../src/audio/audio-analyzer';
import { SACRED_CONSTANTS } from '../src/types';

describe('AudioAnalyzer', () => {
  let analyzer: AudioAnalyzer;

  beforeEach(() => {
    analyzer = new AudioAnalyzer({
      sampleRate: 44100,
      windowSize: 2048,
      hopSize: 512,
      enable432HzDetection: true
    });
  });

  describe('analyze', () => {
    it('should analyze valid audio data', async () => {
      // Create test audio (1 second of 440Hz sine wave)
      const sampleRate = 44100;
      const duration = 1; // seconds
      const frequency = 440;
      const audioData = new Float32Array(sampleRate * duration);

      for (let i = 0; i < audioData.length; i++) {
        audioData[i] = Math.sin(2 * Math.PI * frequency * i / sampleRate);
      }

      const result = await analyzer.analyze(audioData, sampleRate);

      expect(result).toBeDefined();
      expect(result.sampleRate).toBe(sampleRate);
      expect(result.duration).toBeCloseTo(duration * 1000, 0);
      expect(result.fundamentalFrequency).toBeGreaterThan(0);
    });

    it('should throw error for empty audio', async () => {
      const emptyAudio = new Float32Array(0);

      await expect(analyzer.analyze(emptyAudio)).rejects.toThrow('Audio data is empty');
    });

    it('should throw error for audio shorter than window size', async () => {
      const shortAudio = new Float32Array(100);

      await expect(analyzer.analyze(shortAudio)).rejects.toThrow('Audio data too short');
    });

    it('should detect beats in rhythmic audio', async () => {
      const sampleRate = 44100;
      const duration = 2;
      const audioData = new Float32Array(sampleRate * duration);

      // Create audio with beats (impulses every 0.5 seconds = 120 BPM)
      const beatInterval = 0.5; // seconds
      for (let i = 0; i < audioData.length; i++) {
        const time = i / sampleRate;
        if (time % beatInterval < 0.01) {
          audioData[i] = 1.0;
        } else {
          audioData[i] = Math.random() * 0.1;
        }
      }

      const result = await analyzer.analyze(audioData, sampleRate);

      expect(result.beats.length).toBeGreaterThan(0);
      expect(result.estimatedTempo).toBeGreaterThan(60);
      expect(result.estimatedTempo).toBeLessThan(200);
    });
  });

  describe('432Hz detection', () => {
    it('should detect 432Hz fundamental', async () => {
      const sampleRate = 44100;
      const duration = 1;
      const audioData = new Float32Array(sampleRate * duration);

      // Generate 432Hz sine wave
      for (let i = 0; i < audioData.length; i++) {
        audioData[i] = Math.sin(2 * Math.PI * 432 * i / sampleRate);
      }

      const result = await analyzer.analyze(audioData, sampleRate);

      // Fundamental should be close to 432Hz
      expect(Math.abs(result.fundamentalFrequency - 432)).toBeLessThan(10);
    });

    it('should identify 432Hz aligned harmonics', async () => {
      const sampleRate = 44100;
      const duration = 1;
      const audioData = new Float32Array(sampleRate * duration);

      // Generate 432Hz with harmonics
      for (let i = 0; i < audioData.length; i++) {
        const t = i / sampleRate;
        audioData[i] =
          Math.sin(2 * Math.PI * 432 * t) * 1.0 +
          Math.sin(2 * Math.PI * 864 * t) * 0.5 +
          Math.sin(2 * Math.PI * 1296 * t) * 0.25;
      }

      const result = await analyzer.analyze(audioData, sampleRate);

      const aligned = result.harmonics.filter(h => h.is432HzAligned);
      expect(aligned.length).toBeGreaterThan(0);
    });
  });

  describe('is432HzAligned', () => {
    it('should return true for 432Hz harmonics', () => {
      expect(analyzer.is432HzAligned(432)).toBe(true);
      expect(analyzer.is432HzAligned(864)).toBe(true);
      expect(analyzer.is432HzAligned(1296)).toBe(true);
    });

    it('should return false for non-432Hz frequencies', () => {
      expect(analyzer.is432HzAligned(440)).toBe(false);
      expect(analyzer.is432HzAligned(880)).toBe(false);
      expect(analyzer.is432HzAligned(1000)).toBe(false);
    });

    it('should respect tolerance parameter', () => {
      expect(analyzer.is432HzAligned(434, 5)).toBe(true);
      expect(analyzer.is432HzAligned(440, 5)).toBe(false);
      expect(analyzer.is432HzAligned(440, 10)).toBe(true);
    });
  });

  describe('getFrequencyBin', () => {
    it('should calculate correct bin for 432Hz', () => {
      const sampleRate = 44100;
      const windowSize = 2048;
      const expectedBin = Math.round(432 * windowSize / sampleRate);
      const actualBin = analyzer.getFrequencyBin(432, sampleRate);

      expect(actualBin).toBe(expectedBin);
    });
  });
});

describe('SACRED_CONSTANTS', () => {
  it('should have correct Golden Ratio', () => {
    expect(SACRED_CONSTANTS.PHI).toBeCloseTo(1.618033988749, 10);
  });

  it('should have correct 432Hz harmonics', () => {
    const harmonics = SACRED_CONSTANTS.FREQUENCY_432HZ_HARMONICS;

    expect(harmonics).toContain(432);
    expect(harmonics).toContain(864);  // 432 * 2
    expect(harmonics).toContain(1296); // 432 * 3
    expect(harmonics).toContain(1728); // 432 * 4
  });

  it('should have Fibonacci sequence', () => {
    const fib = SACRED_CONSTANTS.FIBONACCI;

    expect(fib[0]).toBe(1);
    expect(fib[1]).toBe(1);
    expect(fib[2]).toBe(2);
    expect(fib[3]).toBe(3);
    expect(fib[4]).toBe(5);
    expect(fib[5]).toBe(8);

    // Verify Fibonacci property
    for (let i = 2; i < fib.length; i++) {
      expect(fib[i]).toBe(fib[i - 1] + fib[i - 2]);
    }
  });
});
