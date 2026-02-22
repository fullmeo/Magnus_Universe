/**
 * Central Type Exports
 * src/util/types/index.ts
 * 
 * Part of PR#5718 Convergence Module
 * 
 * This file centralizes all type exports for the convergence module.
 * Import from '@/util/types' to access all types.
 * 
 * @example
 * import { 
 *   ConvergenceReport, 
 *   CodeMetrics, 
 *   MagnusScore,
 *   ConvergenceOutcome,
 *   T1DScoring 
 * } from '@/util/types';
 */

// Code metrics and complexity
export * from './code-metrics';

// Convergence report with T1-D fields
export * from './convergence-report';

// Magnus scoring system (Recognition, Inevitability, Coherence)
export * from './magnus-scores';

// Code pattern detection
export * from './patterns';

// Opus loop state management
export * from './opus-loop';

// Feedback cycle types
export * from './feedback';

// LLM request/response types
export * from './llm-types';
