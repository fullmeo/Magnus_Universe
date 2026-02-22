/**
 * KILO-ORG TYPE DEFINITIONS FOR PR#5718 CONVERGENCE MODULE
 * 
 * These are the missing type files that caused the revert.
 * Copy these into: src/util/types/
 * 
 * Each file should be created separately and exported from index.ts
 */

// ============================================================================
// 1. src/util/types/code-metrics.ts
// ============================================================================

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

// ============================================================================
// 2. src/util/types/convergence-report.ts
// ============================================================================

export interface IntentAnalysis {
  coreIntent: string;
  precision: number;                 // 0-1 (how clear is it)
  ambiguities: Ambiguity[];
  assumptions: Assumption[];
  risks: Risk[];
  successCriteria: string[];
}

export interface Ambiguity {
  element: string;
  type: 'intent' | 'constraint' | 'specification';
  severity: 'LOW' | 'MEDIUM' | 'HIGH';
  explanation: string;
}

export interface Assumption {
  assumption: string;
  riskLevel: 'LOW' | 'MEDIUM' | 'CRITICAL';
  impact: string;
}

export interface Risk {
  risk: string;
  probability: number;               // 0-1
  impact: number;                    // 0-1
  mitigation: string;
}

export interface ConvergenceReport {
  // Session metadata
  sessionId: string;
  timestamp: number;
  duration: number;                  // ms
  
  // Input analysis
  intentAnalysis: IntentAnalysis;
  codeMetrics: CodeMetrics;
  complexity: ComplexityScore;
  
  // T1-D Empirical Validation Fields (NEW - Feb 15, 2026)
  clarityAnalysis: {
    clarity: number;                 // 0-100 (Shannon entropy-based)
    entropy: number;                 // H in bits
    maxEntropy: number;              // H_max
    ambiguityDistribution: number[]; // Probabilities
  };
  
  divergenceRisk: number;            // P(diverge | clarity)
  
  // T1-D Calibration (Sonnet-level)
  t1dParams: {
    gamma: number;                   // 0.034 (exponential decay)
    C: number;                       // 0.093 (baseline)
    modelLevel: 'haiku' | 'sonnet' | 'opus';
    validatedAt: string;             // ISO date
  };
  
  // Convergence Pillars (3 Pillars of Magnus 15)
  recognitionScore: number;          // 0-100 (intention fidelity)
  inevitabilityScore: number;        // 0-100 (solution necessity)
  coherenceScore: number;            // 0-100 (conceptual unity)
  
  // Thresholds
  thresholds: {
    minRecognition: number;
    minInevitability: number;
    minCoherence: number;
  };
  
  // Outcome
  outcome: 'CONVERGED' | 'PARTIAL' | 'FAILED';
  convergenceScore: number;          // Composite 0-100
  
  // Detailed results
  details: {
    recognitionAnalysis: string;
    inevitabilityAnalysis: string;
    coherenceAnalysis: string;
    reasoning: string;
  };
  
  // Learning
  feedback?: string;
  refinementSuggestions?: string[];
  nextSteps?: string[];
}

// ============================================================================
// 3. src/util/types/magnus-scores.ts
// ============================================================================

export type MagnusScore = {
  recognition: number;               // 0-100
  inevitability: number;             // 0-100
  coherence: number;                 // 0-100
};

export type ConvergenceOutcome = 'CONVERGED' | 'PARTIAL' | 'FAILED';

export interface MagnusScoreDetail {
  pillar: 'recognition' | 'inevitability' | 'coherence';
  score: number;
  threshold: number;
  passed: boolean;
  explanation: string;
  evidence: {
    positive: string[];
    negative: string[];
    neutral: string[];
  };
}

export interface T1DScoring {
  // Clarity-based divergence risk (T1-D theorem)
  clarity: number;                   // 0-100
  entropy: number;                   // Shannon H
  divergenceRisk: number;            // e^(-gamma*(k-70))
  
  // Model-specific calibration
  gamma: number;                     // Exponential decay rate
  C: number;                         // Baseline constant
  
  // Confidence
  confidence: number;                // 0-1 (how sure are we)
  calibrationDate: string;           // When gamma/C were measured
}

// ============================================================================
// 4. src/util/types/patterns.ts
// ============================================================================

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

// ============================================================================
// 5. src/util/types/opus-loop.ts
// ============================================================================

export interface OpusLoopState {
  // Iteration tracking
  iteration: number;
  maxIterations: number;
  
  // Current state
  status: 'ACTIVE' | 'CONVERGED' | 'FAILED' | 'PARTIAL';
  code: string;                      // Current code being reviewed
  
  // Feedback
  feedback: string;
  severity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // Metrics
  score: number;                     // Convergence score this iteration
  previousScore: number;             // Score from iteration-1
  improvement: number;               // Change in score
  
  // Decisions
  agentAnalysis: string;
  refinementStrategy: string;
  nextAction: string;
  
  // History
  history: LoopIteration[];
}

export interface LoopIteration {
  iteration: number;
  timestamp: number;
  code: string;
  feedback: string;
  score: number;
  decision: string;
}

export interface ReviewResult {
  decision: 'APPROVE' | 'REQUEST_CHANGES' | 'COMMENT';
  reasoning: string;
  suggestedChanges?: string[];
  score: number;
}

export interface RefinementStrategy {
  approach: 'ITERATIVE_REFINEMENT' | 'MODULAR_CONSTRUCTION' | 'PHASED_DEVELOPMENT';
  steps: string[];
  estimatedIterations: number;
  confidence: number;
}

// ============================================================================
// 6. src/util/types/feedback.ts
// ============================================================================

export interface FeedbackCycle {
  // Developer input
  developerFeedback: string;
  feedbackSeverity: 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
  
  // Agent response
  agentAnalysis: string;
  agentRefinement: string;
  agentSuggestions: string[];
  
  // Metrics update
  metrics: MagnusScore;
  improvementRate: number;           // % change
  
  // Next step
  nextAction: 'CONTINUE' | 'CONVERGED' | 'ESCALATE';
  confidence: number;
}

export interface FeedbackReport {
  sessionId: string;
  cycles: FeedbackCycle[];
  totalTime: number;                 // ms
  finalScore: MagnusScore;
  outcome: ConvergenceOutcome;
}

// ============================================================================
// 7. src/util/types/llm-types.ts
// ============================================================================

export interface LLMResponse {
  // Content
  content: string;
  role: 'assistant' | 'user' | 'system';
  
  // Metadata
  model: string;
  finish_reason: 'stop' | 'length' | 'error';
  
  // Token usage
  tokenUsage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  
  // Timing
  timestamp: number;
  latency: number;                   // ms
}

export interface LLMRequest {
  model: string;
  messages: Array<{
    role: 'system' | 'user' | 'assistant';
    content: string;
  }>;
  temperature: number;
  max_tokens: number;
  top_p: number;
}

export interface LLMMetrics {
  model: string;
  averageLatency: number;            // ms
  tokenCost: number;                 // USD estimate
  reliability: number;               // 0-1
  qualityScore: number;              // 0-100
}

// ============================================================================
// 8. src/util/types/index.ts (EXPORT FILE)
// ============================================================================

/*
Add this to src/util/types/index.ts to centralize exports:

export * from './code-metrics';
export * from './convergence-report';
export * from './magnus-scores';
export * from './patterns';
export * from './opus-loop';
export * from './feedback';
export * from './llm-types';
*/

// ============================================================================
// INTEGRATION NOTES
// ============================================================================

/**
 * T1-D THEOREM INTEGRATION
 * 
 * The ConvergenceReport interface now includes T1D fields:
 * - clarityAnalysis: Shannon entropy-based clarity measurement
 * - divergenceRisk: P(diverge) = 0.093 * exp(-0.034 * (clarity - 70))
 * - t1dParams: Calibration constants gamma=0.034, C=0.093
 * 
 * This empirically validates the theoretical framework with real data.
 * 
 * See: MAGNUS_15_T1D_VALIDATION.md for details
 */

/**
 * USAGE EXAMPLE
 * 
 * import {
 *   ConvergenceReport,
 *   CodeMetrics,
 *   MagnusScore,
 *   ConvergenceOutcome
 * } from '@/util/types';
 * 
 * const report: ConvergenceReport = {
 *   sessionId: 'sess-123',
 *   timestamp: Date.now(),
 *   intentAnalysis: { ... },
 *   recognitionScore: 88.5,
 *   inevitabilityScore: 85.2,
 *   coherenceScore: 82.1,
 *   outcome: 'CONVERGED',
 *   ...
 * };
 */
