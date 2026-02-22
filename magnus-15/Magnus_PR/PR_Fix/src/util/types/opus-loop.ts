/**
 * Opus Loop Type Definitions
 * src/util/types/opus-loop.ts
 * 
 * Part of PR#5718 Convergence Module
 * Defines state management for iterative code refinement
 */

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
