/**
 * Routing Optimizer
 * 
 * Optimizes model selection based on code quality patterns and cost efficiency.
 * Uses standard routing/selection optimization terminology.
 * 
 * Key Metrics:
 * - Quality Score: Pattern-based capability matching (0-100)
 * - Cost Efficiency: Inverse cost per token normalized (0-100)
 * - Latency Optimization: Inverse latency normalized (0-100)
 * 
 * Weighted Scoring Formula:
 * Total Score = (qualityScore × qualityWeight) + (costScore × costWeight) + (latencyScore × latencyWeight)
 */

import type { PatternMatch, QUALITY_PATTERNS } from './quality-pattern-detector'

export interface RoutingConfig {
	quality_weights: number
	cost_weights: number
	latency_weights: number
	fallback_enabled: boolean
}

export interface ModelProfile {
	id: string
	name: string
	cost_per_1k_tokens: number
	avg_latency_ms: number
	capabilities: string[]
	strengths: string[]
	best_for: string[]
}

export interface RoutingDecision {
	recommended_model: string
	confidence: number
	factors: {
		quality: number
		cost: number
		latency: number
	}
	alternative?: string
	reasoning: string[]
}

/**
 * Model profiles with cost and performance characteristics
 */
export const MODEL_PROFILES: Record<string, ModelProfile> = {
	'gpt-4o-mini': {
		id: 'gpt-4o-mini',
		name: 'GPT-4o Mini',
		cost_per_1k_tokens: 0.01,
		avg_latency_ms: 200,
		capabilities: ['code-generation', 'refactoring', 'documentation'],
		strengths: ['speed', 'cost-efficiency'],
		best_for: ['simple-tasks', 'straightforward-code', 'documentation']
	},
	'gpt-4.1': {
		id: 'gpt-4.1',
		name: 'GPT-4.1',
		cost_per_1k_tokens: 0.10,
		avg_latency_ms: 350,
		capabilities: ['complex-reasoning', 'architecture', 'testing'],
		strengths: ['reasoning', 'context-handling'],
		best_for: ['moderate-complexity', 'architectural-decisions', 'testing']
	},
	'claude-sonnet-4-20250514': {
		id: 'claude-sonnet-4-20250514',
		name: 'Claude Sonnet 4',
		cost_per_1k_tokens: 0.15,
		avg_latency_ms: 400,
		capabilities: ['complex-analysis', 'code-review', 'refactoring'],
		strengths: ['analysis', 'quality-improvements'],
		best_for: ['high-complexity', 'refactoring', 'quality-improvements']
	}
}

/**
 * Default routing configuration with standard weights
 */
const DEFAULT_CONFIG: RoutingConfig = {
	quality_weights: 0.45,
	cost_weights: 0.35,
	latency_weights: 0.20,
	fallback_enabled: true
}

/**
 * Normalization helper for linear scaling
 */
function normalize(value: number, max: number): number {
	return Math.max(0, Math.min(1, value / max))
}

/**
 * Calculate cost efficiency score (inverse normalization)
 * Formula: score = 1 - (cost / max_cost)
 */
function calculateCostScore(costPer1kTokens: number): number {
	const maxCost = 0.20
	return 1 - normalize(costPer1kTokens, maxCost)
}

/**
 * Calculate latency score (inverse normalization)
 * Formula: score = 1 - (latency / max_latency)
 */
function calculateLatencyScore(avgLatencyMs: number): number {
	const maxLatency = 500
	return 1 - normalize(avgLatencyMs, maxLatency)
}

/**
 * Calculate quality capability score based on pattern complexity
 * Uses capability matching with weighted scoring
 */
function calculateQualityScore(matches: PatternMatch[], model: ModelProfile): number {
	if (matches.length === 0) {
		return 0.8 // Baseline score for clean code
	}
	
	const hasHighSeverity = matches.some(m => m.pattern.severity === 'high')
	const hasCriticalPatterns = matches.some(m => 
		m.pattern.patternId === 'CYCLE_DETECTION' || 
		m.pattern.patternId === 'VALIDATION_GAP'
	)
	
	// Capability matching: check if model can handle detected patterns
	const capabilityMatch = matches.every(m => {
		const requiredCapability = mapPatternToCapability(m.pattern.patternId)
		return model.capabilities.includes(requiredCapability)
	})
	
	// Weighted scoring
	let score = 0.5
	if (capabilityMatch) score += 0.3
	if (hasCriticalPatterns && model.strengths.includes('analysis')) score += 0.15
	if (hasHighSeverity && model.strengths.includes('reasoning')) score += 0.1
	
	return Math.min(1, score)
}

/**
 * Map quality patterns to required model capabilities
 */
function mapPatternToCapability(patternId: string): string {
	const capabilityMap: Record<string, string> = {
		'CYCLE_DETECTION': 'refactoring',
		'VALIDATION_GAP': 'code-generation',
		'ARCHITECTURE_DRIFT': 'architecture',
		'COUPLING_COMPLEXITY': 'architecture',
		'SELF_DOCUMENTING': 'documentation',
		'CONTINUOUS_IMPROVEMENT': 'code-review',
		'COGNITIVE_COMPLEXITY': 'complex-analysis'
	}
	return capabilityMap[patternId] || 'code-generation'
}

/**
 * Optimize routing decision based on patterns and configuration
 * Uses weighted scoring with normalized metrics
 */
export function optimizeRouting(
	matches: PatternMatch[],
	config: Partial<RoutingConfig> = {}
): RoutingDecision {
	const finalConfig = { ...DEFAULT_CONFIG, ...config }
	
	// Validate weights sum to 1.0
	const weightSum = finalConfig.quality_weights + finalConfig.cost_weights + finalConfig.latency_weights
	if (Math.abs(weightSum - 1.0) > 0.01) {
		// Normalize weights if they don't sum to 1
		finalConfig.quality_weights /= weightSum
		finalConfig.cost_weights /= weightSum
		finalConfig.latency_weights /= weightSum
	}
	
	// Score each model using weighted scoring formula
	const scoredModels = Object.values(MODEL_PROFILES).map(model => {
		const qScore = calculateQualityScore(matches, model)
		const cScore = calculateCostScore(model.cost_per_1k_tokens)
		const lScore = calculateLatencyScore(model.avg_latency_ms)
		
		// Weighted sum formula
		const totalScore = 
			(qScore * finalConfig.quality_weights) +
			(cScore * finalConfig.cost_weights) +
			(lScore * finalConfig.latency_weights)
		
		return { model, totalScore, qScore, cScore, lScore }
	})
	
	// Sort by total score descending (selection optimization)
	scoredModels.sort((a, b) => b.totalScore - a.totalScore)
	
	const best = scoredModels[0]
	const reasoning: string[] = []
	
	// Generate reasoning based on scoring factors
	if (best.qScore > 0.7) {
		if (best.model.strengths.includes('analysis')) {
			reasoning.push(`High complexity detected (${matches.length} patterns) → matched with ${best.model.name}`)
		}
	} else if (best.cScore > 0.8) {
		reasoning.push(`Clean code patterns → cost-efficient ${best.model.name}`)
	}
	
	if (finalConfig.cost_weights > 0.4) {
		reasoning.push(`Cost optimization weight: ${(finalConfig.cost_weights * 100).toFixed(0)}%`)
	}
	
	reasoning.push(`Estimated cost: $${(best.model.cost_per_1k_tokens * 1000).toFixed(2)} per 1M tokens`)
	reasoning.push(`Expected latency: ~${best.model.avg_latency_ms}ms`)
	
	return {
		recommended_model: best.model.id,
		confidence: Math.round(best.totalScore * 100),
		factors: {
			quality: Math.round(best.qScore * 100),
			cost: Math.round(best.cScore * 100),
			latency: Math.round(best.lScore * 100)
		},
		alternative: finalConfig.fallback_enabled && scoredModels[1] ? scoredModels[1].model.id : undefined,
		reasoning
	}
}

/**
 * Estimate cost savings from optimized routing
 * Provides measurable improvement metrics
 */
export function estimateCostSavings(
	currentModel: string,
	optimizedModel: string,
	estimatedTokens: number
): { savings_percent: number; savings_amount: number; breakdown: string[] } {
	const current = MODEL_PROFILES[currentModel]
	const optimized = MODEL_PROFILES[optimizedModel]
	
	if (!current || !optimized) {
		return {
			savings_percent: 0,
			savings_amount: 0,
			breakdown: ['Unable to calculate: unknown model']
		}
	}
	
	const currentCost = (current.cost_per_1k_tokens * estimatedTokens) / 1000
	const optimizedCost = (optimized.cost_per_1k_tokens * estimatedTokens) / 1000
	const savings = currentCost - optimizedCost
	const savingsPercent = (savings / currentCost) * 100
	
	return {
		savings_percent: Math.round(savingsPercent),
		savings_amount: Math.round(savings * 100) / 100,
		breakdown: [
			`Current model (${current.name}): $${currentCost.toFixed(4)} per ${estimatedTokens} tokens`,
			`Optimized model (${optimized.name}): $${optimizedCost.toFixed(4)} per ${estimatedTokens} tokens`,
			`Estimated savings: $${savings.toFixed(4)} (${savingsPercent.toFixed(1)}%)`
		]
	}
}
