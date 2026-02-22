/**
 * Code Metrics Type Definitions
 * src/util/types/code-metrics.ts
 * 
 * Part of PR#5718 Convergence Module
 */

export interface CodeMetrics {
  // Basic metrics
  lines: number;
  functions: number;
  classes: number;
  
  // Complexity
  cyclomaticComplexity: number;      // McCabe complexity
  cognitiveComplexity: number;       // Cognitive load
  nesting: number;                   // Max nesting depth
  
  // Quality
  testCoverage: number;              // 0-100
  maintainabilityIndex: number;      // 0-100 (SQALE)
  technicalDebt: number;             // Est. hours
  
  // Dependencies
  externalDependencies: number;
  circularDependencies: number;
  
  // Documentation
  documentedFunctions: number;       // Ratio 0-1
  commentRatio: number;              // 0-1
}

export interface ComplexityScore {
  overall: number;                   // 0-10
  byDimension: {
    domain: number;
    technical: number;
    integration: number;
    scale: number;
  };
  bottleneck: 'domain' | 'technical' | 'integration' | 'scale' | 'none';
}
