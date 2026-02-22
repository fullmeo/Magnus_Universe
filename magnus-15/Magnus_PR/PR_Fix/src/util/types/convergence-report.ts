/**
 * Convergence Report Type Definitions
 * src/util/types/convergence-report.ts
 * 
 * Part of PR#5718 Convergence Module
 * Includes T1-D Empirical Validation Fields (Feb 15, 2026)
 */

import { CodeMetrics, ComplexityScore } from './code-metrics';

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
