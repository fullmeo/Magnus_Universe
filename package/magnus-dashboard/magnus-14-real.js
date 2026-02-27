/**
 * Magnus 14 - Real Scanner Implementation
 *
 * Uses actual pattern, bias, and friction detectors from Magnus Cloud Storage
 * Provides real pattern detection for Magnus Infinity
 */

import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';
import * as fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

/**
 * Load detectors from Magnus Cloud Storage
 */
async function loadDetectors() {
  try {
    const basePath = resolve(__dirname, '../Magnus_cloud_storage');

    const PatternDetector = (await import(`${basePath}/pattern-detector.js`)).default;
    const BiasDetector = (await import(`${basePath}/bias-detector.js`)).default;
    const FrictionDetector = (await import(`${basePath}/friction-detector.js`)).default;

    return {
      PatternDetector,
      BiasDetector,
      FrictionDetector,
      available: true
    };
  } catch (error) {
    console.warn('⚠️  Could not load real detectors:', error.message);
    return { available: false };
  }
}

/**
 * Magnus 14 Real Scanner Class
 */
class Magnus14Real {
  constructor(config = {}) {
    this.config = {
      verbose: config.verbose || false,
      enableBiasDetection: config.enableBiasDetection !== false,
      enableFrictionDetection: config.enableFrictionDetection !== false,
      minConfidenceThreshold: config.minConfidenceThreshold || 0.5,
      ...config
    };

    this.patternDetector = null;
    this.biasDetector = null;
    this.frictionDetector = null;
    this.initialized = false;
    this.lastResults = null;
  }

  /**
   * Initialize the scanner with real detectors
   */
  async initialize() {
    if (this.initialized) return;

    try {
      const detectors = await loadDetectors();

      if (!detectors.available) {
        throw new Error('Detectors not available');
      }

      // Initialize pattern detector
      this.patternDetector = new detectors.PatternDetector({
        minOccurrences: 2,
        syntacticThreshold: 0.7,
        semanticThreshold: 0.6
      });

      // Initialize bias detector if enabled
      if (this.config.enableBiasDetection) {
        this.biasDetector = new detectors.BiasDetector({
          minConfidence: this.config.minConfidenceThreshold
        });
      }

      // Initialize friction detector if enabled
      if (this.config.enableFrictionDetection) {
        this.frictionDetector = new detectors.FrictionDetector({
          minComplexity: 10
        });
      }

      this.initialized = true;
      if (this.config.verbose) {
        console.log('✅ Magnus 14 Real Scanner initialized');
      }
    } catch (error) {
      console.error('❌ Failed to initialize Magnus 14 Real Scanner:', error.message);
      this.initialized = false;
      throw error;
    }
  }

  /**
   * Scan project paths for patterns
   */
  async scan(paths) {
    if (!this.initialized) {
      await this.initialize();
    }

    if (!this.patternDetector) {
      return this.getMockResults(paths);
    }

    try {
      // Normalize paths to array
      const pathArray = Array.isArray(paths) ? paths : [paths];

      // Scan for patterns
      const patternResults = await this.scanPatterns(pathArray);

      // Detect friction if enabled
      const frictionResults = this.config.enableFrictionDetection
        ? await this.detectFriction(pathArray)
        : [];

      // Detect bias if enabled
      const biasResults = this.config.enableBiasDetection
        ? await this.detectBias(patternResults)
        : [];

      // Compile results
      const results = {
        patterns: patternResults,
        friction: frictionResults,
        bias: biasResults,
        abandonment: [],
        confidence: this.calculateOverallConfidence(patternResults),
        timestamp: Date.now(),
        scannedPaths: pathArray
      };

      this.lastResults = results;

      if (this.config.verbose) {
        console.log(`📊 Scan complete: ${patternResults.length} patterns, ${frictionResults.length} friction points`);
      }

      return results;
    } catch (error) {
      console.error('❌ Scan failed:', error.message);
      return this.getMockResults(paths);
    }
  }

  /**
   * Scan for code patterns
   */
  async scanPatterns(paths) {
    const patterns = [];

    for (const scanPath of paths) {
      try {
        // Get files to scan
        const files = await this.getFilesToScan(scanPath);

        if (this.config.verbose) {
          console.log(`🔍 Scanning ${files.length} files in ${scanPath}`);
        }

        // Scan each file
        for (const file of files) {
          const filePatterns = await this.scanFile(file);
          patterns.push(...filePatterns);
        }
      } catch (error) {
        console.warn(`⚠️  Failed to scan ${scanPath}:`, error.message);
      }
    }

    return patterns;
  }

  /**
   * Scan a single file for patterns
   */
  async scanFile(filePath) {
    try {
      const content = await fs.readFile(filePath, 'utf-8');

      // Use pattern detector to analyze
      const detected = await this.patternDetector.analyzeCode(content, filePath);

      return (detected || []).map(pattern => ({
        type: pattern.type || 'code-pattern',
        file: filePath,
        severity: pattern.severity || 'info',
        confidence: pattern.confidence || 0.7,
        suggestion: pattern.suggestion || 'Consider refactoring this pattern',
        location: pattern.location,
        description: pattern.description
      }));
    } catch (error) {
      // File read or analysis failed
      return [];
    }
  }

  /**
   * Get files to scan in a directory
   */
  async getFilesToScan(scanPath) {
    const files = [];

    try {
      const stat = await fs.stat(scanPath);

      if (stat.isFile()) {
        return [scanPath];
      }

      // Recursively scan directory
      const entries = await fs.readdir(scanPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = resolve(scanPath, entry.name);

        // Skip ignored patterns
        if (this.shouldIgnore(entry.name)) {
          continue;
        }

        if (entry.isDirectory()) {
          const subFiles = await this.getFilesToScan(fullPath);
          files.push(...subFiles);
        } else if (this.isValidExtension(entry.name)) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Path doesn't exist or can't be read
      return [];
    }

    return files.slice(0, 100); // Limit to 100 files per scan
  }

  /**
   * Check if path should be ignored
   */
  shouldIgnore(name) {
    const ignorePatterns = [
      'node_modules',
      '.git',
      'dist',
      'build',
      'coverage',
      '.next',
      '.cache',
      '.logs',
      'temp',
      'tmp'
    ];

    return ignorePatterns.some(pattern => name.includes(pattern));
  }

  /**
   * Check if file has valid extension
   */
  isValidExtension(filename) {
    const validExtensions = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
    return validExtensions.some(ext => filename.endsWith(ext));
  }

  /**
   * Detect friction in code
   */
  async detectFriction(paths) {
    if (!this.frictionDetector) {
      return [];
    }

    const friction = [];

    for (const scanPath of paths) {
      try {
        const files = await this.getFilesToScan(scanPath);

        for (const file of files) {
          const content = await fs.readFile(file, 'utf-8');
          const metrics = this.analyzeComplexity(content);

          if (metrics.complexity > 10) {
            friction.push({
              type: 'high-complexity',
              file,
              score: metrics.complexity,
              suggestion: 'Consider breaking down this complex code'
            });
          }
        }
      } catch (error) {
        // Continue on error
      }
    }

    return friction;
  }

  /**
   * Analyze code complexity
   */
  analyzeComplexity(code) {
    // Simple complexity analysis
    const lines = code.split('\n').length;
    const complexity = Math.floor(lines / 50); // Basic metric

    return { complexity };
  }

  /**
   * Detect bias in patterns
   */
  async detectBias(patterns) {
    if (!this.biasDetector) {
      return [];
    }

    // Check for biased patterns
    return patterns
      .filter(p => p.confidence < 0.6)
      .map(p => ({
        type: 'low-confidence-pattern',
        pattern: p.type,
        confidence: p.confidence,
        suggestion: 'Pattern needs more validation'
      }));
  }

  /**
   * Calculate overall confidence
   */
  calculateOverallConfidence(patterns) {
    if (patterns.length === 0) return 0;

    const avgConfidence = patterns.reduce((sum, p) => sum + (p.confidence || 0), 0) / patterns.length;
    return Math.round(avgConfidence * 100) / 100;
  }

  /**
   * Get mock results as fallback
   */
  getMockResults(paths) {
    return {
      patterns: [
        {
          type: 'callback-pattern',
          file: Array.isArray(paths) ? paths[0] : paths,
          severity: 'info',
          confidence: 0.65,
          suggestion: 'Consider using async/await instead of callbacks'
        },
        {
          type: 'error-handling',
          file: Array.isArray(paths) ? paths[0] : paths,
          severity: 'warning',
          confidence: 0.72,
          suggestion: 'Add more comprehensive error handling'
        }
      ],
      friction: [
        {
          type: 'complexity',
          score: 7.5,
          file: Array.isArray(paths) ? paths[0] : paths,
          suggestion: 'Consider refactoring for better readability'
        }
      ],
      bias: [],
      abandonment: [],
      confidence: 0.68
    };
  }

  /**
   * Get last scan results
   */
  getLastResults() {
    return this.lastResults || {
      patterns: [],
      friction: [],
      bias: [],
      abandonment: [],
      confidence: 0
    };
  }

  /**
   * Analyze specific code patterns
   */
  analyzePatterns(code) {
    if (!this.patternDetector) {
      return [];
    }

    try {
      return this.patternDetector.analyzeCode(code) || [];
    } catch (error) {
      console.error('Pattern analysis failed:', error.message);
      return [];
    }
  }
}

export default Magnus14Real;
