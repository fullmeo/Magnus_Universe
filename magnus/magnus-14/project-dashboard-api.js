/**
 * PROJECT DASHBOARD API
 *
 * Provides comprehensive project overview endpoints
 * - Project progress tracking
 * - System health status
 * - Domain distribution
 * - Timeline analytics
 * - Risk assessment
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync, readdirSync, existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const STORAGE_PATH = path.join(__dirname, '../../magnus/magnus-14/storage');

class ProjectDashboardAPI {
  constructor(magnus14Instance) {
    this.magnus14 = magnus14Instance;
    this.storageDir = STORAGE_PATH;
  }

  /**
   * Get all projects with summary
   */
  getAllProjectsWithSummary() {
    try {
      if (!existsSync(this.storageDir)) {
        return { projects: [], total: 0 };
      }

      const files = readdirSync(this.storageDir).filter(f => f.endsWith('.json'));
      const projects = [];

      files.forEach(file => {
        try {
          const content = readFileSync(path.join(this.storageDir, file), 'utf8');
          const data = JSON.parse(content);

          projects.push({
            id: data.projectId,
            name: data.input.projectName,
            domain: data.input.domain,
            timestamp: data.timestamp,
            clarity: data.input.currentClarity,
            complexity: data.input.estimatedComplexity,
            duration: data.finalEstimate.totalEstimatedMonths,
            confidence: data.finalEstimate.overallConfidence,
            components: data.input.components.length,
            status: this.calculateProjectStatus(data)
          });
        } catch (error) {
          console.error(`Error parsing ${file}:`, error.message);
        }
      });

      return {
        projects: projects.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
        total: projects.length
      };
    } catch (error) {
      console.error('Error getting all projects:', error);
      return { projects: [], total: 0 };
    }
  }

  /**
   * Calculate project status based on analysis
   */
  calculateProjectStatus(projectData) {
    const clarity = projectData.input.currentClarity;
    const complexity = projectData.input.estimatedComplexity;
    const confidence = projectData.finalEstimate.overallConfidence;

    // Status based on clarity and complexity
    if (clarity < 30) {
      return {
        phase: 'Clarification',
        level: 'early',
        color: '#FF6B6B',
        icon: '🌀',
        percentage: clarity
      };
    } else if (clarity < 60) {
      return {
        phase: 'Investigation',
        level: 'mid',
        color: '#FFA94D',
        icon: '🔍',
        percentage: clarity
      };
    } else if (clarity < 85) {
      return {
        phase: 'Design',
        level: 'advanced',
        color: '#74C0FC',
        icon: '📐',
        percentage: clarity
      };
    } else {
      return {
        phase: 'Implementation',
        level: 'ready',
        color: '#51CF66',
        icon: '✅',
        percentage: clarity
      };
    }
  }

  /**
   * Get domain distribution
   */
  getDomainDistribution() {
    const { projects } = this.getAllProjectsWithSummary();
    const domains = {};

    projects.forEach(project => {
      const domain = project.domain || 'unknown';
      domains[domain] = (domains[domain] || 0) + 1;
    });

    return Object.entries(domains).map(([domain, count]) => ({
      domain,
      count,
      percentage: Math.round((count / projects.length) * 100)
    }));
  }

  /**
   * Get complexity analysis
   */
  getComplexityAnalysis() {
    const { projects } = this.getAllProjectsWithSummary();

    const buckets = {
      'Low (1-3)': projects.filter(p => p.complexity <= 3).length,
      'Medium (4-6)': projects.filter(p => p.complexity > 3 && p.complexity <= 6).length,
      'High (7-8)': projects.filter(p => p.complexity > 6 && p.complexity <= 8).length,
      'Very High (9-10)': projects.filter(p => p.complexity > 8).length
    };

    return buckets;
  }

  /**
   * Get timeline estimates
   */
  getTimelineEstimates() {
    const { projects } = this.getAllProjectsWithSummary();

    const ranges = {
      'Short (<3 months)': projects.filter(p => p.duration < 3).length,
      'Medium (3-6 months)': projects.filter(p => p.duration >= 3 && p.duration < 6).length,
      'Long (6-12 months)': projects.filter(p => p.duration >= 6 && p.duration < 12).length,
      'Very Long (12+ months)': projects.filter(p => p.duration >= 12).length
    };

    return ranges;
  }

  /**
   * Get system health status
   */
  getSystemHealth() {
    const { projects, total } = this.getAllProjectsWithSummary();

    const avgClarity = total > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.clarity, 0) / total)
      : 0;

    const avgComplexity = total > 0
      ? (projects.reduce((sum, p) => sum + p.complexity, 0) / total).toFixed(1)
      : 0;

    const avgConfidence = total > 0
      ? Math.round(projects.reduce((sum, p) => sum + p.confidence, 0) / total)
      : 0;

    const projectsByPhase = {};
    projects.forEach(p => {
      const phase = p.status.phase;
      projectsByPhase[phase] = (projectsByPhase[phase] || 0) + 1;
    });

    return {
      totalProjects: total,
      avgClarity,
      avgComplexity,
      avgConfidence,
      projectsByPhase,
      systemStatus: avgConfidence > 85 ? 'Excellent' : avgConfidence > 75 ? 'Good' : avgConfidence > 60 ? 'Fair' : 'Needs Improvement'
    };
  }

  /**
   * Get confidence distribution
   */
  getConfidenceDistribution() {
    const { projects } = this.getAllProjectsWithSummary();

    return {
      veryHigh: projects.filter(p => p.confidence >= 90).length,
      high: projects.filter(p => p.confidence >= 80 && p.confidence < 90).length,
      medium: projects.filter(p => p.confidence >= 70 && p.confidence < 80).length,
      low: projects.filter(p => p.confidence < 70).length
    };
  }

  /**
   * Get risk assessment
   */
  getRiskAssessment() {
    const { projects } = this.getAllProjectsWithSummary();

    const highRisk = projects.filter(p => p.complexity > 8 && p.confidence < 80);
    const mediumRisk = projects.filter(p =>
      (p.complexity > 6 && p.confidence < 85) ||
      (p.complexity > 8 && p.confidence >= 80)
    );
    const lowRisk = projects.filter(p =>
      p.complexity <= 6 || (p.complexity <= 8 && p.confidence >= 85)
    );

    return {
      highRisk: {
        count: highRisk.length,
        projects: highRisk.map(p => ({ name: p.name, complexity: p.complexity, confidence: p.confidence }))
      },
      mediumRisk: {
        count: mediumRisk.length,
        projects: mediumRisk.map(p => ({ name: p.name, complexity: p.complexity, confidence: p.confidence }))
      },
      lowRisk: {
        count: lowRisk.length,
        projects: lowRisk.map(p => ({ name: p.name, complexity: p.complexity, confidence: p.confidence }))
      }
    };
  }

  /**
   * Get comprehensive dashboard data
   */
  getDashboardData() {
    return {
      projects: this.getAllProjectsWithSummary(),
      health: this.getSystemHealth(),
      domains: this.getDomainDistribution(),
      complexity: this.getComplexityAnalysis(),
      timeline: this.getTimelineEstimates(),
      confidence: this.getConfidenceDistribution(),
      risks: this.getRiskAssessment()
    };
  }

  /**
   * Get project progress tracking
   */
  getProjectProgress(projectId) {
    try {
      const filePath = path.join(this.storageDir, `${projectId}.json`);
      if (!existsSync(filePath)) {
        return null;
      }

      const content = readFileSync(filePath, 'utf8');
      const data = JSON.parse(content);

      return {
        id: data.projectId,
        name: data.input.projectName,
        domain: data.input.domain,
        clarity: {
          current: data.input.currentClarity,
          expected: data.spiralAnalysis.convergenceExpectation,
          progress: `${data.input.currentClarity}% → ${data.spiralAnalysis.convergenceExpectation}%`
        },
        spirals: {
          expected: data.spiralAnalysis.expectedSpiralCount,
          progression: data.spiralAnalysis.spiralProgression
        },
        timeline: {
          estimated: data.finalEstimate.totalEstimatedMonths,
          breakdown: data.finalEstimate.breakdown
        },
        complexity: {
          domain: data.domainAnalysis.domainComplexity,
          technical: data.domainAnalysis.technicalComplexity,
          integration: data.integrationAnalysis.integrationComplexity
        },
        blocker: data.domainAnalysis.realBlocker,
        pocRequired: data.pocAnalysis.pocRequired,
        confidence: data.finalEstimate.overallConfidence
      };
    } catch (error) {
      console.error(`Error getting project progress for ${projectId}:`, error);
      return null;
    }
  }
}

export default ProjectDashboardAPI;
