/**
 * ============================================================================
 * OPUS-ENRICHED BLOC CONVERGENCE ENGINE
 * 
 * Extends BlocConvergence with Claude Opus 4.5 code review integration
 * 
 * Innovation: Combines static pattern analysis with Opus 4.5's expert review
 *             to create the most comprehensive code validation system
 * 
 * Key Features:
 * - Integrates Opus 4.5 inline comments
 * - Converts Opus findings to Magnus patterns
 * - Adjusts robustness scoring with Opus severity
 * - Merges suggested fixes from both systems
 * ============================================================================
 */

import { BlocConvergenceEngine, CodePatternExtractor } from './magnus-13-2-bloc-convergence.js';

// ============================================================================
// OPUS FINDING TYPES - Based on benchmark analysis
// ============================================================================

const OPUS_ISSUE_TYPES = {
  // Critical Issues (weight: 20)
  PAGINATION_BUG: {
    type: 'pagination-bug',
    severity: 'CRITICAL',
    weight: 20,
    magnusPattern: 'LOGIC_ERROR',
    description: 'Off-by-one or incorrect offset calculation'
  },
  SECURITY_VULNERABILITY: {
    type: 'security-vulnerability',
    severity: 'CRITICAL',
    weight: 25,
    magnusPattern: 'SECURITY_RISK',
    description: 'SQL injection, XSS, or authentication bypass'
  },
  DATA_RACE: {
    type: 'data-race',
    severity: 'CRITICAL',
    weight: 22,
    magnusPattern: 'CONCURRENCY_ISSUE',
    description: 'Race condition or unsafe concurrent access'
  },
  NULL_POINTER: {
    type: 'null-pointer',
    severity: 'CRITICAL',
    weight: 18,
    magnusPattern: 'MISSING_ERROR_HANDLING',
    description: 'Potential null/undefined dereference'
  },
  
  // Minor Issues (weight: 5)
  NAMING_INCONSISTENCY: {
    type: 'naming-inconsistency',
    severity: 'MINOR',
    weight: 5,
    magnusPattern: 'UNCLEAR_NAMING',
    description: 'snake_case vs camelCase mixing'
  },
  MISSING_VALIDATION: {
    type: 'missing-validation',
    severity: 'MEDIUM',
    weight: 10,
    magnusPattern: 'MISSING_ERROR_HANDLING',
    description: 'Input validation missing or incomplete'
  },
  PERFORMANCE_ISSUE: {
    type: 'performance-issue',
    severity: 'MEDIUM',
    weight: 8,
    magnusPattern: 'INEFFICIENT_CODE',
    description: 'Inefficient algorithm or unnecessary operations'
  },
  STYLE_VIOLATION: {
    type: 'style-violation',
    severity: 'MINOR',
    weight: 3,
    magnusPattern: 'STYLE_ISSUE',
    description: 'Formatting or style guide violation'
  }
};

// ============================================================================
// OPUS FINDINGS PARSER
// ============================================================================

class OpusFindingsParser {
  /**
   * Parse Opus 4.5 review output into structured findings
   */
  static parse(opusReviewOutput) {
    const findings = {
      criticalIssues: [],
      minorIssues: [],
      inlineComments: [],
      suggestedDiffs: [],
      metadata: {
        reviewTime: null,
        totalIssues: 0,
        modelVersion: 'claude-opus-4.5'
      }
    };

    // Parse based on Opus 4.5 output format
    // Format: Inline comments + Summary with severity grouping
    
    if (!opusReviewOutput) return findings;

    // Extract inline comments
    const commentRegex = /\/\/ OPUS: (CRITICAL|MEDIUM|MINOR): (.+?)(?:\n|$)/g;
    let match;
    
    while ((match = commentRegex.exec(opusReviewOutput)) !== null) {
      const severity = match[1];
      const description = match[2];
      
      const comment = {
        severity,
        description,
        line: this.extractLineNumber(opusReviewOutput, match.index)
      };
      
      findings.inlineComments.push(comment);
      
      if (severity === 'CRITICAL') {
        findings.criticalIssues.push(comment);
      } else {
        findings.minorIssues.push(comment);
      }
    }

    // Extract suggested diffs
    const diffRegex = /```diff\n([\s\S]+?)\n```/g;
    while ((match = diffRegex.exec(opusReviewOutput)) !== null) {
      findings.suggestedDiffs.push({
        diff: match[1],
        context: this.extractDiffContext(opusReviewOutput, match.index)
      });
    }

    findings.metadata.totalIssues = 
      findings.criticalIssues.length + findings.minorIssues.length;

    return findings;
  }

  static extractLineNumber(text, index) {
    const upToIndex = text.substring(0, index);
    const lines = upToIndex.split('\n');
    return lines.length;
  }

  static extractDiffContext(text, diffIndex) {
    // Extract 100 chars before diff for context
    const start = Math.max(0, diffIndex - 100);
    const context = text.substring(start, diffIndex);
    return context.trim();
  }

  /**
   * Classify Opus finding into known issue type
   */
  static classifyIssue(description) {
    const desc = description.toLowerCase();
    
    if (desc.includes('pagination') || desc.includes('offset')) {
      return OPUS_ISSUE_TYPES.PAGINATION_BUG;
    }
    if (desc.includes('sql') || desc.includes('injection') || desc.includes('xss')) {
      return OPUS_ISSUE_TYPES.SECURITY_VULNERABILITY;
    }
    if (desc.includes('race') || desc.includes('concurrent')) {
      return OPUS_ISSUE_TYPES.DATA_RACE;
    }
    if (desc.includes('null') || desc.includes('undefined')) {
      return OPUS_ISSUE_TYPES.NULL_POINTER;
    }
    if (desc.includes('snake_case') || desc.includes('camelcase') || desc.includes('naming')) {
      return OPUS_ISSUE_TYPES.NAMING_INCONSISTENCY;
    }
    if (desc.includes('validation') || desc.includes('validate')) {
      return OPUS_ISSUE_TYPES.MISSING_VALIDATION;
    }
    if (desc.includes('performance') || desc.includes('slow')) {
      return OPUS_ISSUE_TYPES.PERFORMANCE_ISSUE;
    }
    
    // Default to style issue
    return OPUS_ISSUE_TYPES.STYLE_VIOLATION;
  }
}

// ============================================================================
// OPUS-ENRICHED BLOC CONVERGENCE ENGINE
// ============================================================================

class OpusEnrichedBlocConvergence extends BlocConvergenceEngine {
  constructor(config = {}) {
    super(config);
    
    this.config = {
      ...this.config,
      
      // Opus-specific settings
      opusWeight: config.opusWeight || 0.5,  // 50% weight to Opus findings
      trustOpusCritical: config.trustOpusCritical !== false,  // Always trust Opus on critical
      mergeStrategy: config.mergeStrategy || 'WEIGHTED',  // WEIGHTED | OPUS_PRIORITY | BLOC_PRIORITY
      
      // Opus penalty multipliers
      opusCriticalPenalty: config.opusCriticalPenalty || 20,
      opusMediumPenalty: config.opusMediumPenalty || 10,
      opusMinorPenalty: config.opusMinorPenalty || 5
    };
  }

  /**
   * Enhanced scan with Opus 4.5 integration
   */
  async scanBlocForConvergence(analysis, generatedCode, opusReviewOutput = null) {
    console.log('🔬 OpusEnrichedBlocConvergence: Starting comprehensive scan...');
    
    // STEP 1: Standard BlocConvergence scan
    console.log('\n📊 STEP 1: Standard pattern analysis');
    const blocAnalysis = await super.scanBlocForConvergence(analysis, generatedCode);
    
    console.log(`   Base patterns detected: ${blocAnalysis.patterns.length}`);
    console.log(`   Base robustness: ${blocAnalysis.robustness}/100`);
    
    // If no Opus review, return standard analysis
    if (!opusReviewOutput) {
      console.log('\n⚠️  No Opus review provided, using standard BlocConvergence only');
      return blocAnalysis;
    }
    
    // STEP 2: Parse Opus findings
    console.log('\n🎯 STEP 2: Parsing Opus 4.5 review');
    const opusFindings = OpusFindingsParser.parse(opusReviewOutput);
    
    console.log(`   Opus critical issues: ${opusFindings.criticalIssues.length}`);
    console.log(`   Opus minor issues: ${opusFindings.minorIssues.length}`);
    console.log(`   Opus suggested diffs: ${opusFindings.suggestedDiffs.length}`);
    
    // STEP 3: Convert Opus findings to Magnus patterns
    console.log('\n🔄 STEP 3: Converting Opus findings to Magnus patterns');
    const opusPatterns = this.convertOpusFindingsToPatterns(opusFindings);
    
    console.log(`   Converted to ${opusPatterns.length} Magnus pattern(s)`);
    
    // STEP 4: Merge patterns
    console.log('\n🔀 STEP 4: Merging patterns');
    const mergedPatterns = this.mergePatterns(
      blocAnalysis.patterns,
      opusPatterns
    );
    
    console.log(`   Total patterns: ${mergedPatterns.length}`);
    
    // STEP 5: Recalculate robustness with Opus data
    console.log('\n💪 STEP 5: Recalculating robustness');
    const enrichedRobustness = this.calculateEnrichedRobustness({
      baseRobustness: blocAnalysis.robustness,
      opusFindings,
      opusPatterns,
      analysis
    });
    
    console.log(`   Enriched robustness: ${enrichedRobustness.score}/100`);
    console.log(`   Adjustment: ${enrichedRobustness.score - blocAnalysis.robustness}`);
    
    // STEP 6: Generate enhanced recommendation
    console.log('\n📋 STEP 6: Generating enhanced recommendation');
    const enrichedInterpretation = this.interpretRobustness({
      score: enrichedRobustness.score,
      breakdown: enrichedRobustness.breakdown
    });
    
    const enhancedRecommendation = this.generateEnhancedRecommendation(
      enrichedInterpretation,
      blocAnalysis.paths,
      mergedPatterns,
      opusFindings
    );
    
    console.log(`   Recommendation: ${enhancedRecommendation.action}`);
    
    return {
      // Original BlocConvergence data
      ...blocAnalysis,
      
      // Enriched data
      robustness: enrichedRobustness.score,
      robustnessBreakdown: {
        ...blocAnalysis.robustnessBreakdown,
        ...enrichedRobustness.breakdown,
        opusAdjustment: enrichedRobustness.opusAdjustment
      },
      
      patterns: mergedPatterns,
      interpretation: enrichedInterpretation,
      recommendation: enhancedRecommendation,
      
      // Opus-specific data
      opusFindings: {
        critical: opusFindings.criticalIssues,
        minor: opusFindings.minorIssues,
        diffs: opusFindings.suggestedDiffs,
        metadata: opusFindings.metadata
      },
      
      // Validation metadata
      validationMethod: 'OPUS_ENRICHED',
      opusVersion: 'claude-opus-4.5',
      timestamp: Date.now()
    };
  }

  /**
   * Convert Opus findings to Magnus patterns
   */
  convertOpusFindingsToPatterns(opusFindings) {
    const patterns = [];
    
    // Convert critical issues
    opusFindings.criticalIssues.forEach(issue => {
      const issueType = OpusFindingsParser.classifyIssue(issue.description);
      
      patterns.push({
        type: issueType.magnusPattern,
        severity: 'CRITICAL',
        count: 1,
        weight: issueType.weight,
        description: issue.description,
        source: 'opus-4.5',
        line: issue.line,
        opusClassification: issueType.type,
        details: {
          opusSeverity: 'CRITICAL',
          originalDescription: issue.description
        }
      });
    });
    
    // Convert minor/medium issues
    opusFindings.minorIssues.forEach(issue => {
      const issueType = OpusFindingsParser.classifyIssue(issue.description);
      
      patterns.push({
        type: issueType.magnusPattern,
        severity: issue.severity || 'MEDIUM',
        count: 1,
        weight: issueType.weight,
        description: issue.description,
        source: 'opus-4.5',
        line: issue.line,
        opusClassification: issueType.type,
        details: {
          opusSeverity: issue.severity,
          originalDescription: issue.description
        }
      });
    });
    
    return patterns;
  }

  /**
   * Merge BlocConvergence patterns with Opus patterns
   */
  mergePatterns(blocPatterns, opusPatterns) {
    const merged = [...blocPatterns];
    const blocTypes = new Set(blocPatterns.map(p => p.type));
    
    // Add Opus patterns
    opusPatterns.forEach(opusPattern => {
      // Check if similar pattern exists in Bloc
      const existingPattern = merged.find(p => 
        p.type === opusPattern.type && 
        Math.abs((p.line || 0) - (opusPattern.line || 0)) < 5
      );
      
      if (existingPattern) {
        // Merge: increase severity if Opus is more severe
        if (this.severityWeight(opusPattern.severity) > 
            this.severityWeight(existingPattern.severity)) {
          existingPattern.severity = opusPattern.severity;
        }
        
        // Add Opus as additional source
        existingPattern.sources = existingPattern.sources || [existingPattern.source];
        existingPattern.sources.push('opus-4.5');
        
        // Add Opus details
        existingPattern.opusConfirmed = true;
        existingPattern.opusDescription = opusPattern.description;
      } else {
        // New pattern from Opus
        merged.push(opusPattern);
      }
    });
    
    return merged;
  }

  severityWeight(severity) {
    const weights = {
      'CRITICAL': 4,
      'HIGH': 3,
      'MEDIUM': 2,
      'LOW': 1,
      'MINOR': 1
    };
    return weights[severity] || 0;
  }

  /**
   * Calculate enriched robustness with Opus data
   */
  calculateEnrichedRobustness({ baseRobustness, opusFindings, opusPatterns, analysis }) {
    const breakdown = {
      base: baseRobustness,
      opusCritical: 0,
      opusMedium: 0,
      opusMinor: 0,
      opusTotal: 0
    };
    
    // Calculate Opus penalties
    const criticalPenalty = opusFindings.criticalIssues.length * 
                           this.config.opusCriticalPenalty;
    const mediumPenalty = opusFindings.minorIssues.filter(i => 
                           i.severity === 'MEDIUM').length * 
                           this.config.opusMediumPenalty;
    const minorPenalty = opusFindings.minorIssues.filter(i => 
                          i.severity === 'MINOR').length * 
                          this.config.opusMinorPenalty;
    
    breakdown.opusCritical = -criticalPenalty;
    breakdown.opusMedium = -mediumPenalty;
    breakdown.opusMinor = -minorPenalty;
    breakdown.opusTotal = -(criticalPenalty + mediumPenalty + minorPenalty);
    
    // Apply merge strategy
    let finalScore = baseRobustness;
    
    switch (this.config.mergeStrategy) {
      case 'OPUS_PRIORITY':
        // If Opus found critical issues, score drops to max 40
        if (opusFindings.criticalIssues.length > 0) {
          finalScore = Math.min(40, baseRobustness + breakdown.opusTotal);
        } else {
          finalScore = baseRobustness + breakdown.opusTotal;
        }
        break;
        
      case 'BLOC_PRIORITY':
        // Opus findings weighted less
        finalScore = baseRobustness + (breakdown.opusTotal * 0.3);
        break;
        
      case 'WEIGHTED':
      default:
        // Weighted average
        finalScore = baseRobustness + (breakdown.opusTotal * this.config.opusWeight);
        break;
    }
    
    // Critical issues always force BRITTLE if trustOpusCritical
    if (this.config.trustOpusCritical && opusFindings.criticalIssues.length > 0) {
      finalScore = Math.min(finalScore, 45);  // Force BRITTLE threshold
    }
    
    return {
      score: Math.max(0, Math.min(100, Math.round(finalScore))),
      breakdown,
      opusAdjustment: breakdown.opusTotal,
      strategy: this.config.mergeStrategy
    };
  }

  /**
   * Generate enhanced recommendation with Opus data
   */
  generateEnhancedRecommendation(interpretation, historicalPaths, patterns, opusFindings) {
    const baseRecommendation = super.generateRecommendation(
      interpretation,
      historicalPaths,
      patterns
    );
    
    // Enhance with Opus-specific actions
    const opusCriticalPatterns = patterns.filter(p => 
      p.source === 'opus-4.5' && p.severity === 'CRITICAL'
    );
    
    const opusActions = [];
    
    if (opusCriticalPatterns.length > 0) {
      opusActions.push({
        priority: 'CRITICAL',
        action: 'FIX_OPUS_CRITICAL_ISSUES',
        count: opusCriticalPatterns.length,
        issues: opusCriticalPatterns.map(p => ({
          type: p.opusClassification,
          description: p.description,
          line: p.line
        }))
      });
    }
    
    // Add Opus suggested diffs
    const opusSuggestedFixes = opusFindings.suggestedDiffs.map(diff => ({
      type: 'OPUS_SUGGESTED_DIFF',
      diff: diff.diff,
      context: diff.context,
      priority: 'HIGH'
    }));
    
    return {
      ...baseRecommendation,
      
      // Opus-specific enhancements
      opusActions,
      opusSuggestedFixes,
      
      // Combined risk assessment
      overallRisk: this.assessOverallRisk(
        interpretation.level,
        opusCriticalPatterns.length
      ),
      
      // Detailed next steps
      detailedSteps: this.generateDetailedSteps(
        baseRecommendation.action,
        opusActions,
        opusSuggestedFixes
      )
    };
  }

  assessOverallRisk(robustnessLevel, opusCriticalCount) {
    if (opusCriticalCount > 0) {
      return 'CRITICAL';
    }
    
    const riskMapping = {
      'BRITTLE': 'CRITICAL',
      'FRAGILE': 'HIGH',
      'ROBUST': 'MEDIUM',
      'SOLID': 'LOW'
    };
    
    return riskMapping[robustnessLevel] || 'MEDIUM';
  }

  generateDetailedSteps(action, opusActions, opusFixes) {
    const steps = [];
    
    // Add Opus critical fixes first
    if (opusActions.length > 0) {
      steps.push({
        order: 1,
        category: 'CRITICAL_FIXES',
        description: 'Address Opus 4.5 critical findings',
        items: opusActions.map(a => a.action)
      });
    }
    
    // Add Opus suggested diffs
    if (opusFixes.length > 0) {
      steps.push({
        order: 2,
        category: 'APPLY_DIFFS',
        description: 'Apply Opus 4.5 suggested modifications',
        items: opusFixes.map((f, i) => `Apply diff ${i + 1}`)
      });
    }
    
    // Add standard steps
    steps.push({
      order: 3,
      category: 'VALIDATION',
      description: 'Re-validate after fixes',
      items: ['Run BlocConvergence again', 'Request Opus review', 'Check convergence']
    });
    
    return steps.sort((a, b) => a.order - b.order);
  }
}

export {
  OpusEnrichedBlocConvergence,
  OpusFindingsParser,
  OPUS_ISSUE_TYPES
};
