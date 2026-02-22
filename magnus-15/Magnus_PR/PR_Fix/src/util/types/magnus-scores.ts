/**
 * Magnus Scores Type Definitions
 * src/util/types/magnus-scores.ts
 * 
 * Part of PR#5718 Convergence Module
 * Includes T1D Scoring interface for empirical validation
 */

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
