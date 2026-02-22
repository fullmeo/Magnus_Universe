/**
 * Magnus 14 - Simple Real Scanner
 *
 * Scans actual codebase for real patterns
 * Simplified implementation that works immediately
 *
 * Enhanced with Modality Detection (Tier 1 Phase 1A)
 */

import * as fs from 'fs/promises';
import { resolve, basename, extname } from 'path';
import { ModalityDetector } from './modality-detector.js';

class Magnus14Simple {
  constructor(config = {}) {
    this.config = {
      verbose: config.verbose || false,
      minConfidenceThreshold: config.minConfidenceThreshold || 0.5,
      maxFilesPerScan: config.maxFilesPerScan || 50
    };

    this.initialized = true;
    this.lastResults = null;

    // Initialize Modality Detector (Tier 1 Phase 1A)
    this.modalityDetector = new ModalityDetector({
      baseDir: config.baseDir || process.cwd(),
      minConfidence: config.minConfidenceThreshold || 0.5
    });
  }

  /**
   * Scan project paths for patterns
   */
  async scan(paths) {
    try {
      const pathArray = Array.isArray(paths) ? paths : [paths];
      const patterns = [];
      const friction = [];

      for (const scanPath of pathArray) {
        const result = await this.scanPath(scanPath);
        patterns.push(...result.patterns);
        friction.push(...result.friction);
      }

      // Detect modality (Tier 1 Phase 1A)
      const modalityResult = await this.detectModality(pathArray[0] || process.cwd());

      const results = {
        patterns,
        friction,
        bias: [],
        abandonment: [],
        confidence: this.calculateConfidence(patterns),
        timestamp: Date.now(),
        scannedPaths: pathArray,
        // NEW: Modality detection results
        modality: modalityResult
      };

      this.lastResults = results;

      if (this.config.verbose) {
        console.log(`📊 Scanned: ${patterns.length} patterns, ${friction.length} friction points`);
        console.log(`🎨 Modality: ${modalityResult.primary} (${(modalityResult.confidence * 100).toFixed(1)}% confidence)`);
      }

      return results;
    } catch (error) {
      console.error('❌ Scan failed:', error.message);
      return this.getEmptyResults();
    }
  }

  /**
   * Scan a specific path
   */
  async scanPath(scanPath) {
    const patterns = [];
    const friction = [];

    try {
      const files = await this.getFiles(scanPath);

      for (const file of files.slice(0, this.config.maxFilesPerScan)) {
        const filePatterns = await this.scanFile(file);
        patterns.push(...filePatterns.patterns);
        friction.push(...filePatterns.friction);
      }
    } catch (error) {
      // Path might not exist or be readable
    }

    return { patterns, friction };
  }

  /**
   * Scan a single file
   */
  async scanFile(filePath) {
    const patterns = [];
    const friction = [];

    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');

      // Detect async/await patterns
      if (content.includes('async') && content.includes('await')) {
        patterns.push({
          type: 'async-await-pattern',
          file: filePath,
          severity: 'info',
          confidence: 0.85,
          suggestion: 'Async/await pattern detected - good practice'
        });
      }

      // Detect callback patterns
      const callbackMatches = content.match(/\.then\(/g);
      if (callbackMatches && callbackMatches.length > 3) {
        patterns.push({
          type: 'promise-chain',
          file: filePath,
          severity: 'warning',
          confidence: 0.75,
          suggestion: 'Consider refactoring promise chains to async/await'
        });
      }

      // Detect try-catch patterns
      const tryCatchMatches = content.match(/try\s*{/g);
      if (!tryCatchMatches || tryCatchMatches.length === 0) {
        patterns.push({
          type: 'missing-error-handling',
          file: filePath,
          severity: 'warning',
          confidence: 0.65,
          suggestion: 'Add error handling with try-catch blocks'
        });
      }

      // Detect console.log (potential debugging code left)
      const consoleLogMatches = content.match(/console\.(log|warn|error)/g);
      if (consoleLogMatches && consoleLogMatches.length > 5) {
        patterns.push({
          type: 'excessive-logging',
          file: filePath,
          severity: 'info',
          confidence: 0.70,
          suggestion: 'Consider using a proper logging framework'
        });
      }

      // Detect TODO/FIXME comments
      const todoMatches = content.match(/\/\/\s*(TODO|FIXME|HACK)/gi);
      if (todoMatches && todoMatches.length > 0) {
        patterns.push({
          type: 'technical-debt',
          file: filePath,
          severity: 'info',
          confidence: 0.90,
          suggestion: `Found ${todoMatches.length} TODO/FIXME comments to address`
        });
      }

      // Detect high complexity (long files)
      if (lines.length > 300) {
        friction.push({
          type: 'high-complexity',
          file: filePath,
          score: Math.min(10, lines.length / 30),
          suggestion: `File has ${lines.length} lines - consider splitting`
        });
      }

      // Detect long functions
      const functionMatches = content.match(/function\s+\w+|const\s+\w+\s*=\s*\(/g);
      if (functionMatches) {
        const avgLinesPerFunction = lines.length / functionMatches.length;
        if (avgLinesPerFunction > 50) {
          friction.push({
            type: 'long-functions',
            file: filePath,
            score: Math.min(10, avgLinesPerFunction / 10),
            suggestion: 'Functions are too long - consider breaking them down'
          });
        }
      }

      // Detect nested callbacks (callback hell)
      const nestedCallbacks = content.match(/function\s*\([^)]*\)\s*{[^}]*function\s*\([^)]*\)/g);
      if (nestedCallbacks && nestedCallbacks.length > 2) {
        patterns.push({
          type: 'callback-hell',
          file: filePath,
          severity: 'warning',
          confidence: 0.80,
          suggestion: 'Refactor nested callbacks to promises or async/await'
        });
      }

      // Detect import/require patterns
      const importCount = (content.match(/^import\s+/gm) || []).length +
                         (content.match(/require\(/g) || []).length;
      if (importCount > 15) {
        friction.push({
          type: 'high-coupling',
          file: filePath,
          score: Math.min(10, importCount / 3),
          suggestion: `File has ${importCount} imports - consider reducing dependencies`
        });
      }

    } catch (error) {
      // File read failed, skip
    }

    return { patterns, friction };
  }

  /**
   * Get files to scan
   */
  async getFiles(scanPath) {
    const files = [];

    try {
      const stat = await fs.stat(scanPath);

      if (stat.isFile()) {
        if (this.isValidFile(scanPath)) {
          return [scanPath];
        }
        return [];
      }

      // It's a directory
      const entries = await fs.readdir(scanPath, { withFileTypes: true });

      for (const entry of entries) {
        // Skip ignored directories
        if (this.shouldIgnore(entry.name)) {
          continue;
        }

        const fullPath = resolve(scanPath, entry.name);

        if (entry.isDirectory()) {
          const subFiles = await this.getFiles(fullPath);
          files.push(...subFiles);
        } else if (this.isValidFile(entry.name)) {
          files.push(fullPath);
        }

        // Limit total files
        if (files.length >= 100) {
          break;
        }
      }
    } catch (error) {
      // Path doesn't exist or can't be read
      return [];
    }

    return files;
  }

  /**
   * Check if file should be scanned
   */
  isValidFile(filename) {
    const ext = extname(filename);
    const validExts = ['.js', '.jsx', '.ts', '.tsx', '.mjs', '.cjs'];
    return validExts.includes(ext);
  }

  /**
   * Check if path should be ignored
   */
  shouldIgnore(name) {
    const ignoreList = [
      'node_modules',
      '.git',
      'dist',
      'build',
      'coverage',
      '.next',
      '.cache',
      'temp',
      'tmp',
      '.logs',
      'dev-data'
    ];

    return ignoreList.some(ignore => name.includes(ignore));
  }

  /**
   * Calculate overall confidence
   */
  calculateConfidence(patterns) {
    if (patterns.length === 0) return 0;

    const total = patterns.reduce((sum, p) => sum + (p.confidence || 0), 0);
    return Math.round((total / patterns.length) * 100) / 100;
  }

  /**
   * Get empty results
   */
  getEmptyResults() {
    return {
      patterns: [],
      friction: [],
      bias: [],
      abandonment: [],
      confidence: 0
    };
  }

  /**
   * Get last results
   */
  getLastResults() {
    return this.lastResults || this.getEmptyResults();
  }

  /**
   * Detect project modality (Tier 1 Phase 1A)
   */
  async detectModality(projectPath) {
    try {
      const result = await this.modalityDetector.detectModality(projectPath);

      if (this.config.verbose) {
        console.log('\n🎨 Modality Detection:');
        console.log(`   Primary: ${result.primary}`);
        console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
        console.log(`   Scores: web=${(result.scores.web * 100).toFixed(1)}%, mobile=${(result.scores.mobile * 100).toFixed(1)}%, data=${(result.scores.data * 100).toFixed(1)}%`);
        console.log(`   Detection Time: ${result.detectionTime}ms`);
      }

      return result;
    } catch (error) {
      console.error('❌ Modality detection failed:', error.message);
      return {
        primary: 'unknown',
        secondary: [],
        scores: { web: 0, mobile: 0, data: 0 },
        confidence: 0,
        isMultiModal: false,
        error: error.message
      };
    }
  }
}

export default Magnus14Simple;
