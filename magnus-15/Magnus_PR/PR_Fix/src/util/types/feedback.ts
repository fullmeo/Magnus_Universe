/**
 * Feedback Type Definitions
 * src/util/types/feedback.ts
 * 
 * Part of PR#5718 Convergence Module
 * Defines feedback cycle types for developer-agent interaction
 */

import { MagnusScore, ConvergenceOutcome } from './magnus-scores';

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
