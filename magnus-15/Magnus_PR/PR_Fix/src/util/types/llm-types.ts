/**
 * LLM Types Definition
 * src/util/types/llm-types.ts
 * 
 * Part of PR#5718 Convergence Module
 * Defines types for LLM request/response handling
 */

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
