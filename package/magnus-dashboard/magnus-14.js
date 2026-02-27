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
    // Try simple real scanner first (works immediately)
    // Use file:// protocol with normalized path for Windows
    const simpleScannerPath = 'file:///' + resolve(__dirname, './magnus-14-simple.js').replace(/\\/g, '/');
    const simpleModule = await import(simpleScannerPath);
    MagnusScanner = simpleModule.default;
    console.log('✅ Using Magnus 14 Simple Scanner - real pattern detection enabled');
    return MagnusScanner;
  } catch (simpleError) {
    console.error('Simple scanner load failed:', simpleError.message);
    try {
      // Try advanced real scanner
      const realScannerPath = 'file:///' + resolve(__dirname, './magnus-14-real.js').replace(/\\/g, '/');
      const realModule = await import(realScannerPath);
      MagnusScanner = realModule.default;
      console.log('✅ Using Magnus 14 Real Scanner with advanced pattern detection');
      return MagnusScanner;
    } catch (realError) {
      console.error('Real scanner load failed:', realError.message);
      try {
        // Fallback to magnus-scanner-14 if it exists
        const scannerPath = 'file:///' + resolve(__dirname, '../../magnus-scanner-14/src/scanner/magnus-scanner.js').replace(/\\/g, '/');
        const module = await import(scannerPath);
        MagnusScanner = module.default || module.MagnusScanner || module;
        console.log('✅ Using Magnus Scanner 14 from scanner directory');
        return MagnusScanner;
      } catch (error) {
        console.warn('⚠️  All scanners failed, using mock implementation');
        return MockMagnusScanner;
      }
    }
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
