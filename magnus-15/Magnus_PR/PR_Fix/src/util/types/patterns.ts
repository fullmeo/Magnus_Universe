/**
 * Patterns Type Definitions
 * src/util/types/patterns.ts
 * 
 * Part of PR#5718 Convergence Module
 * Defines code patterns for quality detection
 */

export enum CodePattern {
  // Anti-patterns (negative, need fixing)
  COMPLEXITY_SPIRAL = 'COMPLEXITY_SPIRAL',      // Nested logic > 3 levels
  VALIDATION_GAPS = 'VALIDATION_GAPS',          // Missing input validation
  STRUCTURAL_DISORDER = 'STRUCTURAL_DISORDER',  // Inconsistent organization
  CHANCE_VS_COMPETENCE = 'CHANCE_VS_COMPETENCE', // Random vs intentional
  CHAOS_INTERNE = 'CHAOS_INTERNE',              // Internal contradiction
  
  // Positive patterns (good, should keep)
  ITERATIVE_IMPROVEMENT = 'ITERATIVE_IMPROVEMENT', // Progressive refinement
  DOMAIN_FIRST = 'DOMAIN_FIRST',                // Business logic prioritized
  SELF_DOCUMENTING = 'SELF_DOCUMENTING',        // Clear naming
  CODE_CONSISTENCY = 'CODE_CONSISTENCY',        // Uniform patterns
  EVIDENCE_BASED = 'EVIDENCE_BASED',            // Metrics-driven
}

export interface PatternDetectionResult {
  pattern: CodePattern;
  detected: boolean;
  confidence: number;                // 0-1
  location: {
    file: string;
    line: number;
    column: number;
  };
  snippet: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  recommendation: string;
}

export interface QualityMetric {
  name: string;
  value: number;
  unit: string;
  threshold: number;
  status: 'PASS' | 'WARN' | 'FAIL';
}

export interface PatternScore {
  patterns: PatternDetectionResult[];
  positiveCount: number;
  negativeCount: number;
  score: number;                     // 0-100
  recommendation: 'APPROVE' | 'REVIEW' | 'REJECT';
}
