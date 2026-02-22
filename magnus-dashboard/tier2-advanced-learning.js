/**
 * Magnus Infinity - Tier 2: Advanced Pattern Learning & Cross-Modal Optimization
 * 
 * Features:
 * - Advanced pattern learning across modalities
 * - Cross-modal pattern transfer and optimization
 * - Adaptive confidence scoring
 * - Pattern fusion and evolution
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// ============================================================================
// ADVANCED PATTERN LEARNING ENGINE
// ============================================================================

class AdvancedPatternLearning {
  constructor(storageDir = './.magnus-advanced-learning') {
    this.storageDir = storageDir;
    this.modalityPatterns = new Map(); // patterns by modality
    this.crossModalPatterns = new Map(); // patterns transferable across modalities
    this.patternEvolution = new Map(); // pattern version history
    this.initialized = false;
  }

  async initialize() {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
      await this.loadAdvancedKnowledge();
      this.initialized = true;
      console.log('🧠 Advanced Pattern Learning Engine initialized');
    } catch (error) {
      console.warn('Advanced learning engine initialization failed:', error.message);
    }
  }

  /**
   * Learn a pattern with full context from any modality
   */
  async learnPattern(patternData) {
    const {
      name,
      modality, // 'web' | 'mobile' | 'data'
      signature, // Unique pattern signature
      context, // When pattern was detected
      outcome, // SUCCESS, PARTIAL, FAILURE
      confidence, // 0-1 confidence score
      metadata // Additional pattern data
    } = patternData;

    // Store modality-specific pattern
    const modalityKey = `${modality}:${signature}`;
    if (!this.modalityPatterns.has(modalityKey)) {
      this.modalityPatterns.set(modalityKey, {
        modality,
        signature,
        samples: [],
        avgConfidence: 0,
        successRate: 0,
        evolution: []
      });
    }

    const pattern = this.modalityPatterns.get(modalityKey);
    pattern.samples.push({
      timestamp: Date.now(),
      outcome,
      confidence,
      metadata
    });

    // Update statistics
    this.updatePatternStats(pattern);

    // Track evolution
    this.trackPatternEvolution(pattern, name);

    // Check for cross-modal transfer opportunities
    await this.checkCrossModalTransfer(pattern);

    // Persist
    await this.saveAdvancedKnowledge();

    return pattern;
  }

  /**
   * Update pattern statistics
   */
  updatePatternStats(pattern) {
    const n = pattern.samples.length;
    if (n === 0) return;

    // Average confidence
    pattern.avgConfidence = pattern.samples.reduce((sum, s) => sum + s.confidence, 0) / n;

    // Success rate
    const successes = pattern.samples.filter(s => s.outcome === 'SUCCESS').length;
    pattern.successRate = (successes / n) * 100;

    // Confidence trend
    if (n >= 5) {
      const recent = pattern.samples.slice(-5);
      const trend = this.calculateTrend(recent.map(s => s.confidence));
      pattern.confidenceTrend = trend;
    }
  }

  /**
   * Track pattern evolution over time
   */
  trackPatternEvolution(pattern, name) {
    const evolutionId = `${pattern.modality}:${pattern.signature}:${Date.now()}`;
    const evolution = {
      id: evolutionId,
      timestamp: Date.now(),
      name,
      samples: pattern.samples.length,
      avgConfidence: pattern.avgConfidence,
      successRate: pattern.successRate,
      version: (pattern.evolution?.length || 0) + 1
    };

    if (!pattern.evolution) pattern.evolution = [];
    pattern.evolution.push(evolution);
    this.patternEvolution.set(evolutionId, evolution);
  }

  /**
   * Check if pattern can be transferred to other modalities
   */
  async checkCrossModalTransfer(pattern) {
    const otherModalities = ['web', 'mobile', 'data'].filter(m => m !== pattern.modality);

    for (const targetModality of otherModalities) {
      // Check similarity with existing patterns in target modality
      const similarity = await this.calculateCrossModalSimilarity(pattern, targetModality);

      if (similarity > 0.7) { // 70% similarity threshold
        // Create cross-modal pattern link
        const crossModalKey = `${pattern.modality}→${targetModality}:${pattern.signature}`;
        this.crossModalPatterns.set(crossModalKey, {
          sourceModality: pattern.modality,
          targetModality,
          sourceSignature: pattern.signature,
          similarity,
          transferCount: 0,
          successRate: 0
        });
      }
    }
  }

  /**
   * Calculate similarity between patterns across modalities
   */
  async calculateCrossModalSimilarity(pattern, targetModality) {
    let totalSimilarity = 0;
    let count = 0;

    for (const [key, targetPattern] of this.modalityPatterns) {
      if (!key.startsWith(`${targetModality}:`)) continue;

      // Calculate signature similarity
      const sigSim = this.signatureSimilarity(pattern.signature, targetPattern.signature);
      
      // Calculate outcome similarity
      const outcomeSim = Math.abs(pattern.successRate - targetPattern.successRate) / 100;

      // Combined similarity
      const similarity = (sigSim * 0.6) + ((1 - outcomeSim) * 0.4);
      totalSimilarity += similarity;
      count++;
    }

    return count > 0 ? totalSimilarity / count : 0;
  }

  /**
   * Calculate signature similarity
   */
  signatureSimilarity(sig1, sig2) {
    if (sig1 === sig2) return 1.0;
    if (!sig1 || !sig2) return 0;

    const words1 = sig1.split(/[_\-:]/);
    const words2 = sig2.split(/[_\-:]/);

    const intersection = words1.filter(w => words2.includes(w));
    const union = new Set([...words1, ...words2]);

    return intersection.length / union.size;
  }

  /**
   * Calculate trend (improving, stable, degrading)
   */
  calculateTrend(values) {
    if (values.length < 2) return 'UNKNOWN';

    const deltas = [];
    for (let i = 1; i < values.length; i++) {
      deltas.push(values[i] - values[i - 1]);
    }

    const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;

    if (avgDelta < -0.05) return 'IMPROVING';
    if (avgDelta > 0.05) return 'DEGRADING';
    return 'STABLE';
  }

  /**
   * Get patterns that can be transferred to a modality
   */
  getTransferablePatterns(targetModality) {
    const transfers = [];

    for (const [key, pattern] of this.crossModalPatterns) {
      if (pattern.targetModality === targetModality) {
        transfers.push({
          sourceModality: pattern.sourceModality,
          similarity: pattern.similarity,
          sourceSignature: pattern.sourceSignature,
          transferCount: pattern.transferCount,
          successRate: pattern.successRate
        });
      }
    }

    return transfers.sort((a, b) => b.similarity - a.similarity);
  }

  /**
   * Apply transferred pattern to target modality
   */
  async applyTransferredPattern(targetModality, sourceSignature, context) {
    const transferKey = `${this.getModality(sourceSignature)}→${targetModality}:${sourceSignature}`;
    const transfer = this.crossModalPatterns.get(transferKey);

    if (!transfer) {
      return { success: false, reason: 'No transfer available' };
    }

    // Apply with adapted confidence
    const adaptedConfidence = transfer.similarity * transfer.successRate / 100;

    transfer.transferCount++;

    return {
      success: true,
      adaptedConfidence,
      sourceModality: transfer.sourceModality,
      targetModality,
      context
    };
  }

  getModality(signature) {
    // Extract modality from signature or return unknown
    if (signature.includes('react') || signature.includes('vue') || signature.includes('angular')) return 'web';
    if (signature.includes('mobile') || signature.includes('react-native') || signature.includes('flutter')) return 'mobile';
    if (signature.includes('data') || signature.includes('spark') || signature.includes('pandas')) return 'data';
    return 'unknown';
  }

  async saveAdvancedKnowledge() {
    try {
      const data = {
        version: '2.0',
        timestamp: Date.now(),
        modalityPatterns: Array.from(this.modalityPatterns.entries()),
        crossModalPatterns: Array.from(this.crossModalPatterns.entries()),
        evolution: Array.from(this.patternEvolution.entries()).slice(-100)
      };

      const filepath = path.join(this.storageDir, 'advanced-knowledge.json');
      await fs.writeFile(filepath, JSON.stringify(data, null, 2));
    } catch (error) {
      console.warn('Failed to save advanced knowledge:', error.message);
    }
  }

  async loadAdvancedKnowledge() {
    try {
      const filepath = path.join(this.storageDir, 'advanced-knowledge.json');
      const data = JSON.parse(await fs.readFile(filepath, 'utf8'));

      this.modalityPatterns = new Map(data.modalityPatterns);
      this.crossModalPatterns = new Map(data.crossModalPatterns);
      
      console.log(`📚 Loaded advanced patterns: ${this.modalityPatterns.size} modality patterns, ${this.crossModalPatterns.size} cross-modal`);
    } catch (error) {
      console.log('📚 Starting with fresh advanced learning');
    }
  }
}

// ============================================================================
// CROSS-MODAL OPTIMIZER
// ============================================================================

class CrossModalOptimizer {
  constructor(advancedLearning) {
    this.learning = advancedLearning;
    this.optimizationHistory = [];
  }

  /**
   * Optimize generation for cross-modal patterns
   */
  async optimizeGeneration(request) {
    const { modality, context, patterns } = request;

    // Get transferable patterns
    const transferable = this.learning.getTransferablePatterns(modality);

    // Find applicable patterns
    const applicable = transferable.filter(t => 
      patterns?.some(p => p.includes(t.sourceSignature))
    );

    // Calculate optimization score
    const optimization = {
      modality,
      baseConfidence: 0.7,
      transferablePatterns: applicable.length,
      potentialBoost: this.calculatePotentialBoost(applicable),
      recommendations: []
    };

    // Generate recommendations
    if (applicable.length > 0) {
      optimization.recommendations.push({
        type: 'CROSS_MODAL',
        message: `${applicable.length} patterns transferable from other modalities`,
        patterns: applicable.map(a => ({
          source: a.sourceModality,
          similarity: `${(a.similarity * 100).toFixed(1)}%`
        }))
      });
    }

    // Calculate final confidence
    optimization.finalConfidence = Math.min(
      optimization.baseConfidence + optimization.potentialBoost,
      0.99
    );

    // Record optimization
    this.optimizationHistory.push({
      timestamp: Date.now(),
      modality,
      applicablePatterns: applicable.length,
      confidence: optimization.finalConfidence
    });

    return optimization;
  }

  /**
   * Calculate potential confidence boost from transferable patterns
   */
  calculatePotentialBoost(applicablePatterns) {
    if (applicablePatterns.length === 0) return 0;

    const totalBoost = applicablePatterns.reduce((sum, p) => {
      // Higher similarity = higher boost
      const similarityBoost = p.similarity * 0.1;
      // Proven transfers = higher boost
      const successBoost = Math.min(p.successRate / 100 * 0.05, 0.05);
      return sum + similarityBoost + successBoost;
    }, 0);

    return Math.min(totalBoost, 0.25); // Cap at 25% boost
  }

  /**
   * Get optimization statistics
   */
  getStats() {
    const recent = this.optimizationHistory.slice(-100);

    return {
      totalOptimizations: this.optimizationHistory.length,
      recentCount: recent.length,
      avgConfidence: recent.length > 0 
        ? recent.reduce((sum, o) => sum + o.confidence, 0) / recent.length 
        : 0,
      byModality: this.groupByModality(recent)
    };
  }

  groupByModality(optimizations) {
    const grouped = {};
    optimizations.forEach(o => {
      if (!grouped[o.modality]) {
        grouped[o.modality] = { count: 0, avgConfidence: 0 };
      }
      grouped[o.modality].count++;
      grouped[o.modality].avgConfidence += o.confidence;
    });

    for (const modality of Object.keys(grouped)) {
      grouped[modality].avgConfidence /= grouped[modality].count;
    }

    return grouped;
  }
}

// ============================================================================
// TIER 2 MANAGER
// ============================================================================

class Tier2Manager {
  constructor() {
    this.learning = new AdvancedPatternLearning();
    this.optimizer = new CrossModalOptimizer(this.learning);
    this.initialized = false;
  }

  async initialize() {
    await this.learning.initialize();
    this.initialized = true;
    console.log('✅ Tier 2 Manager initialized');
  }

  /**
   * Main entry: Learn from generation outcome
   */
  async learnFromGeneration(outcome) {
    const {
      modality,
      patterns,
      success,
      confidence,
      metadata
    } = outcome;

    // Learn each pattern
    for (const pattern of patterns || []) {
      await this.learning.learnPattern({
        name: pattern.name,
        modality,
        signature: pattern.signature,
        context: pattern.context,
        outcome: success ? 'SUCCESS' : 'FAILURE',
        confidence,
        metadata
      });
    }
  }

  /**
   * Optimize generation with cross-modal patterns
   */
  async optimizeGeneration(request) {
    return await this.optimizer.optimizeGeneration(request);
  }

  /**
   * Get Tier 2 statistics
   */
  async getStats() {
    return {
      patterns: {
        modality: this.learning.modalityPatterns.size,
        crossModal: this.learning.crossModalPatterns.size,
        evolution: this.learning.patternEvolution.size
      },
      optimization: this.optimizer.getStats(),
      ready: this.initialized
    };
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export { AdvancedPatternLearning, CrossModalOptimizer, Tier2Manager };
