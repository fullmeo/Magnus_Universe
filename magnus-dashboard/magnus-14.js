/**
 * Magnus 14 - Scanner Wrapper
 *
 * Bridges Magnus Scanner 14 from magnus-scanner-14 directory
 * Provides pattern detection, friction detection, and code analysis
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamically import Magnus Scanner 14 from the scanner directory
let MagnusScanner = null;

async function loadScanner() {
  if (MagnusScanner) return MagnusScanner;

  try {
    const scannerPath = resolve(__dirname, '../../magnus-scanner-14/src/scanner/magnus-scanner.js');
    const module = await import(scannerPath);
    MagnusScanner = module.default || module.MagnusScanner || module;
    return MagnusScanner;
  } catch (error) {
    console.warn('⚠️  Magnus Scanner 14 not found, using mock implementation');
    return MockMagnusScanner;
  }
}

/**
 * Magnus 14 Scanner Class
 */
class Magnus14 {
  constructor(config = {}) {
    this.config = config;
    this.scanner = null;
    this.initialized = false;
    this.lastResults = null;
  }

  /**
   * Initialize the scanner
   */
  async initialize() {
    if (this.initialized) return;

    try {
      const ScannerClass = await loadScanner();
      this.scanner = new ScannerClass({
        verbose: true,
        enableBiasDetection: true,
        minConfidenceThreshold: 0.5,
        ...this.config
      });
      this.initialized = true;
      console.log('✅ Magnus 14 Scanner initialized');
    } catch (error) {
      console.error('❌ Failed to initialize Magnus 14:', error.message);
      this.initialized = false;
    }
  }

  /**
   * Scan project paths
   */
  async scan(paths) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.scanner) {
      return {
        patterns: [],
        friction: [],
        abandonment: [],
        confidence: 0,
        error: 'Scanner not available'
      };
    }

    try {
      const results = await this.scanner.scan(paths);
      this.lastResults = results;
      return results;
    } catch (error) {
      console.error('❌ Scan failed:', error.message);
      return {
        patterns: [],
        friction: [],
        abandonment: [],
        confidence: 0,
        error: error.message
      };
    }
  }

  /**
   * Get last scan results
   */
  getLastResults() {
    return this.lastResults || {
      patterns: [],
      friction: [],
      abandonment: [],
      confidence: 0
    };
  }

  /**
   * Analyze specific patterns
   */
  analyzePatterns(code) {
    if (!this.scanner || !this.scanner.patternDetector) {
      return [];
    }

    try {
      return this.scanner.patternDetector.analyzeCode(code) || [];
    } catch (error) {
      console.error('Pattern analysis failed:', error.message);
      return [];
    }
  }

  /**
   * Detect code friction
   */
  detectFriction(metrics) {
    if (!this.scanner || !this.scanner.frictionDetector) {
      return [];
    }

    try {
      return this.scanner.frictionDetector.detect(metrics) || [];
    } catch (error) {
      console.error('Friction detection failed:', error.message);
      return [];
    }
  }
}

/**
 * Mock Magnus Scanner for fallback
 */
class MockMagnusScanner {
  constructor(config = {}) {
    this.config = config;
  }

  async scan(paths) {
    return {
      patterns: [
        { type: 'callback-hell', severity: 'warning', file: paths[0] }
      ],
      friction: [
        { type: 'complexity', score: 7.5, file: paths[0] }
      ],
      abandonment: [],
      confidence: 0.65
    };
  }
}

export default Magnus14;
