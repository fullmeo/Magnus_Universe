#!/usr/bin/env node

/**
 * ============================================================================
 * TRIZ Metrics Collector
 *
 * Tracks TRIZ principle effectiveness, contradiction patterns, and outcomes.
 * Stores append-only log of analyses for trend analysis and calibration.
 *
 * Metrics Tracked:
 * - Principle usage frequency (which principles are prescribed most)
 * - Principle effectiveness (% of time a principle resolves the issue)
 * - Contradiction patterns (which pillar pairs fail most often)
 * - Convergence trends (improvement over time)
 * - Threshold accuracy (how often thresholds correctly classify convergence)
 *
 * Usage:
 *   import { MetricsCollector } from './triz-metrics-collector.js';
 *   const collector = new MetricsCollector();
 *   await collector.recordAnalysis(analysisResult);
 *   await collector.generateReport();
 * ============================================================================
 */

import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const METRICS_FILE = path.join(__dirname, '.triz-metrics.json');

export class MetricsCollector {
  constructor() {
    this.metricsFile = METRICS_FILE;
  }

  /**
   * Record a single TRIZ analysis
   */
  async recordAnalysis(analysis) {
    try {
      const metrics = await this.loadMetrics();

      const entry = {
        timestamp: new Date().toISOString(),
        projectId: analysis.metadata?.projectId || 'unknown',
        projectName: analysis.metadata?.projectName || 'unknown',
        convergenceOutcome: analysis.convergenceOutcome || 'UNKNOWN',
        complexity: analysis.complexity?.scope || 'MODERATE',

        // Pillar scores
        pillars: {
          intentFidelity: analysis.pillarScores?.intentFidelity,
          optimalDesign: analysis.pillarScores?.optimalDesign,
          codeConsistency: analysis.pillarScores?.codeConsistency,
          eleganceScore: analysis.pillarScores?.eleganceScore
        },

        // Failing pillars
        failingPillars: analysis.trizPrescriptions?.failingPillars || [],

        // TRIZ prescriptions
        principles: analysis.trizPrescriptions?.prescriptions?.map(p => ({
          number: p.principleNumber,
          name: p.principleName,
          priority: p.priority
        })) || [],

        // Thresholds used
        thresholds: {
          intentFidelity: 85,
          optimalDesign: 85,
          codeConsistency: 80,
          eleganceScore: 80
        }
      };

      // Add to metrics log
      metrics.analyses.push(entry);

      // Update aggregates
      this.updateAggregates(metrics, entry);

      // Save metrics
      await this.saveMetrics(metrics);

      return entry;
    } catch (error) {
      console.error(`❌ Error recording analysis: ${error.message}`);
      throw error;
    }
  }

  /**
   * Update aggregate statistics
   */
  updateAggregates(metrics, entry) {
    // Track principle usage
    entry.principles.forEach(p => {
      const key = `principle_${p.number}`;
      if (!metrics.principleFrequency[key]) {
        metrics.principleFrequency[key] = {
          number: p.number,
          name: p.name,
          usageCount: 0,
          effectiveCount: 0,
          successRate: 0
        };
      }
      metrics.principleFrequency[key].usageCount += 1;
    });

    // Track contradiction patterns
    const contradiction = entry.failingPillars.sort().join(' ↔ ');
    if (contradiction) {
      if (!metrics.contradictionPatterns[contradiction]) {
        metrics.contradictionPatterns[contradiction] = {
          pattern: contradiction,
          occurrences: 0,
          topPrinciples: {}
        };
      }
      metrics.contradictionPatterns[contradiction].occurrences += 1;

      entry.principles.forEach(p => {
        const key = `principle_${p.number}`;
        if (!metrics.contradictionPatterns[contradiction].topPrinciples[key]) {
          metrics.contradictionPatterns[contradiction].topPrinciples[key] = 0;
        }
        metrics.contradictionPatterns[contradiction].topPrinciples[key] += 1;
      });
    }

    // Track convergence outcomes
    const outcome = entry.convergenceOutcome;
    if (!metrics.convergenceOutcomes[outcome]) {
      metrics.convergenceOutcomes[outcome] = 0;
    }
    metrics.convergenceOutcomes[outcome] += 1;

    // Track pillar performance
    Object.entries(entry.pillars).forEach(([pillar, score]) => {
      if (score !== undefined) {
        if (!metrics.pillarPerformance[pillar]) {
          metrics.pillarPerformance[pillar] = {
            count: 0,
            sum: 0,
            avg: 0,
            passing: 0,
            failing: 0
          };
        }
        metrics.pillarPerformance[pillar].count += 1;
        metrics.pillarPerformance[pillar].sum += score;
        metrics.pillarPerformance[pillar].avg = metrics.pillarPerformance[pillar].sum / metrics.pillarPerformance[pillar].count;

        const threshold = entry.thresholds[pillar];
        if (score >= threshold) {
          metrics.pillarPerformance[pillar].passing += 1;
        } else {
          metrics.pillarPerformance[pillar].failing += 1;
        }
      }
    });

    // Update summary
    metrics.summary = {
      totalAnalyses: metrics.analyses.length,
      lastAnalysis: entry.timestamp,
      convergenceRate: (metrics.convergenceOutcomes['CONVERGED'] || 0) / metrics.analyses.length * 100,
      averagePillars: this.calculateAveragePillars(metrics)
    };
  }

  /**
   * Calculate average pillar scores
   */
  calculateAveragePillars(metrics) {
    const result = {};
    Object.entries(metrics.pillarPerformance).forEach(([pillar, data]) => {
      result[pillar] = data.avg.toFixed(1);
    });
    return result;
  }

  /**
   * Generate effectiveness report
   */
  async generateReport() {
    try {
      const metrics = await this.loadMetrics();

      const report = {
        timestamp: new Date().toISOString(),
        summary: metrics.summary,

        // Top performing principles
        topPrinciples: Object.values(metrics.principleFrequency)
          .sort((a, b) => b.usageCount - a.usageCount)
          .slice(0, 5),

        // Most common contradictions
        commonContradictions: Object.values(metrics.contradictionPatterns)
          .sort((a, b) => b.occurrences - a.occurrences)
          .slice(0, 5),

        // Convergence breakdown
        convergenceOutcomes: metrics.convergenceOutcomes,

        // Pillar performance summary
        pillarPerformance: metrics.pillarPerformance,

        // Recommendations
        recommendations: this.generateRecommendations(metrics)
      };

      return report;
    } catch (error) {
      console.error(`❌ Error generating report: ${error.message}`);
      throw error;
    }
  }

  /**
   * Generate actionable recommendations based on metrics
   */
  generateRecommendations(metrics) {
    const recommendations = [];

    // Check convergence rate
    const convergenceRate = (metrics.convergenceOutcomes['CONVERGED'] || 0) / metrics.analyses.length;
    if (convergenceRate < 0.3) {
      recommendations.push({
        type: 'convergence',
        severity: 'high',
        message: `Convergence rate is only ${(convergenceRate * 100).toFixed(1)}%. Consider recalibrating thresholds or refining TRIZ principles.`
      });
    }

    // Check pillar performance
    Object.entries(metrics.pillarPerformance).forEach(([pillar, data]) => {
      const failRate = data.failing / (data.passing + data.failing);
      if (failRate > 0.7) {
        recommendations.push({
          type: 'pillar',
          severity: 'high',
          message: `${pillar} is failing in ${(failRate * 100).toFixed(1)}% of projects. This may indicate unrealistic thresholds.`,
          pillar
        });
      }
    });

    // Check principle usage balance
    const principles = Object.values(metrics.principleFrequency);
    if (principles.length > 0) {
      const avgUsage = principles.reduce((sum, p) => sum + p.usageCount, 0) / principles.length;
      principles.forEach(p => {
        if (p.usageCount > avgUsage * 2) {
          recommendations.push({
            type: 'principle',
            severity: 'medium',
            message: `Principle ${p.number} (${p.name}) is overused (${p.usageCount} times). Diversify recommendations.`,
            principle: p.number
          });
        }
      });
    }

    return recommendations;
  }

  /**
   * Load metrics from file
   */
  async loadMetrics() {
    try {
      const content = await fs.readFile(this.metricsFile, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      // Initialize if file doesn't exist
      return this.initializeMetrics();
    }
  }

  /**
   * Initialize empty metrics structure
   */
  initializeMetrics() {
    return {
      version: '1.0.0',
      createdAt: new Date().toISOString(),
      analyses: [],
      principleFrequency: {},
      contradictionPatterns: {},
      convergenceOutcomes: {},
      pillarPerformance: {},
      summary: {
        totalAnalyses: 0,
        lastAnalysis: null,
        convergenceRate: 0,
        averagePillars: {}
      }
    };
  }

  /**
   * Save metrics to file
   */
  async saveMetrics(metrics) {
    try {
      const json = JSON.stringify(metrics, null, 2);
      await fs.writeFile(this.metricsFile, json, 'utf-8');
    } catch (error) {
      console.error(`❌ Error saving metrics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get metrics summary
   */
  async getSummary() {
    const metrics = await this.loadMetrics();
    return metrics.summary;
  }

  /**
   * Clear all metrics (for testing)
   */
  async clearMetrics() {
    try {
      await this.saveMetrics(this.initializeMetrics());
      console.log('✅ Metrics cleared');
    } catch (error) {
      console.error(`❌ Error clearing metrics: ${error.message}`);
      throw error;
    }
  }

  /**
   * Export metrics as CSV for analysis
   */
  async exportCSV() {
    try {
      const metrics = await this.loadMetrics();
      const analyses = metrics.analyses;

      const headers = [
        'Timestamp',
        'ProjectID',
        'ProjectName',
        'Convergence',
        'Complexity',
        'IntentFidelity',
        'OptimalDesign',
        'CodeConsistency',
        'EleganceScore',
        'FailingPillars',
        'Principles'
      ];

      const rows = analyses.map(a => [
        a.timestamp,
        a.projectId,
        a.projectName,
        a.convergenceOutcome,
        a.complexity,
        a.pillars.intentFidelity,
        a.pillars.optimalDesign,
        a.pillars.codeConsistency,
        a.pillars.eleganceScore,
        a.failingPillars.join(';'),
        a.principles.map(p => `P${p.number}`).join(';')
      ]);

      const csv = [headers, ...rows].map(row => row.map(cell => `"${cell}"`).join(',')).join('\n');
      return csv;
    } catch (error) {
      console.error(`❌ Error exporting CSV: ${error.message}`);
      throw error;
    }
  }
}

/**
 * CLI Interface
 */
async function main() {
  const collector = new MetricsCollector();
  const command = process.argv[2];

  try {
    switch (command) {
      case 'report': {
        console.log('\n📊 TRIZ Effectiveness Report\n');
        const report = await collector.generateReport();
        console.log(JSON.stringify(report, null, 2));
        break;
      }

      case 'summary': {
        console.log('\n📈 TRIZ Metrics Summary\n');
        const summary = await collector.getSummary();
        console.log(JSON.stringify(summary, null, 2));
        break;
      }

      case 'export-csv': {
        console.log('\n📋 Exporting metrics as CSV\n');
        const csv = await collector.exportCSV();
        console.log(csv);
        break;
      }

      case 'clear': {
        await collector.clearMetrics();
        break;
      }

      default:
        console.log(`
🧠 TRIZ Metrics Collector

Usage:
  node triz-metrics-collector.js <command>

Commands:
  report       Generate effectiveness report
  summary      Display metrics summary
  export-csv   Export metrics as CSV
  clear        Clear all metrics (testing only)

`);
    }
  } catch (error) {
    console.error(`❌ Error: ${error.message}`);
    process.exit(1);
  }
}

if (process.argv[1].includes('triz-metrics-collector')) {
  main();
}

export default MetricsCollector;
