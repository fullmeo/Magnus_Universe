/**
 * Quality Pattern Detector
 * 
 * Identifies code quality patterns that influence routing decisions.
 * Uses standard code quality terminology instead of esoteric concepts.
 * 
 * Patterns detected:
 * - CYCLE_DETECTION: Cyclomatic complexity issues
 * - VALIDATION_GAP: Missing input validation
 * - ARCHITECTURE_DRIFT: Structural inconsistencies
 * - COUPLING_COMPLEXITY: Excessive module dependencies
 * - BUSINESS_LOGIC_PRIORITY: Domain-first design patterns
 * - SELF_DOCUMENTING: Code clarity indicators
 * - CONTINUOUS_IMPROVEMENT: Iterative refinement patterns
 * - CODE_CONSISTENCY: Standardization compliance
 * - EVIDENCE_BASED: Metrics-driven decisions
 * - COGNITIVE_COMPLEXITY: Multi-level abstraction patterns
 */

export interface QualityPattern {
	patternId: string
	severity: 'low' | 'medium' | 'high'
	weight: number
	description: string
	detectionCriteria: string[]
	remediation: string
}

export interface PatternMatch {
	pattern: QualityPattern
	lineNumber: number
	matchedContent: string
	suggestion: string
}

/**
 * Quality patterns detected for routing optimization
 * Using standard code quality terminology with measurable criteria
 */
export const QUALITY_PATTERNS: QualityPattern[] = [
	{
		patternId: 'CYCLE_DETECTION',
		severity: 'high',
		weight: 0.15,
		description: 'Cyclomatic complexity exceeds threshold',
		detectionCriteria: [
			'Nested conditional depth > 3',
			'Multiple return statements in single function',
			'Excessive boolean logic operations'
		],
		remediation: 'Extract nested logic into separate functions with early returns'
	},
	{
		patternId: 'VALIDATION_GAP',
		severity: 'high',
		weight: 0.15,
		description: 'Missing or insufficient input validation',
		detectionCriteria: [
			'User input accessed without sanitization',
			'Missing null/undefined checks',
			'No type validation for external data'
		],
		remediation: 'Add input validation (Zod, Joi, or type guards)'
	},
	{
		patternId: 'ARCHITECTURE_DRIFT',
		severity: 'medium',
		weight: 0.10,
		description: 'Code organization deviates from project structure',
		detectionCriteria: [
			'File length > 500 lines',
			'Mixed concerns in single module',
			'Inconsistent import patterns'
		],
		remediation: 'Split into separate modules by concern'
	},
	{
		patternId: 'COUPLING_COMPLEXITY',
		severity: 'medium',
		weight: 0.10,
		description: 'Excessive inter-module dependencies',
		detectionCriteria: [
			'Import count > 10 per file',
			'Cross-module circular references',
			'Deep inheritance hierarchies'
		],
		remediation: 'Reduce dependencies through abstraction or dependency injection'
	},
	{
		patternId: 'BUSINESS_LOGIC_PRIORITY',
		severity: 'low',
		weight: 0.05,
		description: 'Domain logic properly prioritized over infrastructure',
		detectionCriteria: [
			'Domain types defined before utilities',
			'Business rules isolated from I/O',
			'Clear separation of concerns'
		],
		remediation: 'Maintain current domain-first architecture'
	},
	{
		patternId: 'SELF_DOCUMENTING',
		severity: 'low',
		weight: 0.05,
		description: 'Code clarity through naming and structure',
		detectionCriteria: [
			'Function names describe intent (> 15 chars)',
			'Complex logic has explanatory comments',
			'Types explicitly declared'
		],
		remediation: 'Continue self-documenting practices'
	},
	{
		patternId: 'CONTINUOUS_IMPROVEMENT',
		severity: 'medium',
		weight: 0.10,
		description: 'Iterative refinement patterns detected',
		detectionCriteria: [
			'Small, focused commits',
			'Progressive feature implementation',
			'Regular refactoring cycles'
		],
		remediation: 'Continue iterative development approach'
	},
	{
		patternId: 'CODE_CONSISTENCY',
		severity: 'medium',
		weight: 0.10,
		description: 'Uniform patterns across codebase',
		detectionCriteria: [
			'Consistent naming conventions',
			'Uniform error handling patterns',
			'Standardized module structure'
		],
		remediation: 'Enforce consistency through linting and code reviews'
	},
	{
		patternId: 'EVIDENCE_BASED',
		severity: 'low',
		weight: 0.05,
		description: 'Decisions backed by data and metrics',
		detectionCriteria: [
			'Performance benchmarks present',
			'Error tracking and metrics',
			'A/B testing or experiments'
		],
		remediation: 'Continue metrics-driven development'
	},
	{
		patternId: 'COGNITIVE_COMPLEXITY',
		severity: 'medium',
		weight: 0.10,
		description: 'Multi-level abstraction understanding',
		detectionCriteria: [
			'Appropriate abstraction layers',
			'Clear module boundaries',
			'Documented architectural decisions'
		],
		remediation: 'Maintain clear abstraction hierarchy'
	}
]

/**
 * Detection thresholds for measurable criteria
 */
export const DETECTION_THRESHOLDS = {
	maxNestedConditionals: 3,
	maxFileLength: 500,
	maxImports: 10,
	minFunctionNameLength: 15
}

/**
 * Detects quality patterns in source code
 */
export function detectQualityPatterns(sourceCode: string): PatternMatch[] {
	const matches: PatternMatch[] = []
	
	// Detect CYCLE_DETECTION (nested conditionals)
	const nestedIfCount = (sourceCode.match(/if\s*\(.*\)\s*\{[\s\S]*?if\s*\(.*\)/g) || []).length
	if (nestedIfCount > DETECTION_THRESHOLDS.maxNestedConditionals) {
		matches.push({
			pattern: QUALITY_PATTERNS.find(p => p.patternId === 'CYCLE_DETECTION')!,
			lineNumber: 1,
			matchedContent: `${nestedIfCount} nested conditionals detected (threshold: ${DETECTION_THRESHOLDS.maxNestedConditionals})`,
			suggestion: QUALITY_PATTERNS.find(p => p.patternId === 'CYCLE_DETECTION')!.remediation
		})
	}
	
	// Detect VALIDATION_GAP
	const hasValidation = /validate|sanitize|check|verify/.test(sourceCode)
	const hasUserInput = /userInput|req\.body|props\.|params/.test(sourceCode)
	if (hasUserInput && !hasValidation) {
		matches.push({
			pattern: QUALITY_PATTERNS.find(p => p.patternId === 'VALIDATION_GAP')!,
			lineNumber: 1,
			matchedContent: 'User input without validation',
			suggestion: QUALITY_PATTERNS.find(p => p.patternId === 'VALIDATION_GAP')!.remediation
		})
	}
	
	// Detect ARCHITECTURE_DRIFT (mixed concerns)
	const hasMixedConcerns = /import.*from.*@|import.*from.*\/[^/]+\/|require\([^)]+\)/.test(sourceCode)
	const importCount = (sourceCode.match(/import\s+.*\s+from/g) || []).length
	if ((hasMixedConcerns || importCount > DETECTION_THRESHOLDS.maxImports) && (sourceCode.length > DETECTION_THRESHOLDS.maxFileLength)) {
		matches.push({
			pattern: QUALITY_PATTERNS.find(p => p.patternId === 'ARCHITECTURE_DRIFT')!,
			lineNumber: 1,
			matchedContent: `Potential mixed concerns (${importCount} imports, ${sourceCode.length} chars)`,
			suggestion: QUALITY_PATTERNS.find(p => p.patternId === 'ARCHITECTURE_DRIFT')!.remediation
		})
	}
	
	return matches
}

/**
 * Calculates quality score based on detected patterns
 * Uses weighted scoring with normalization
 */
export function calculateQualityScore(matches: PatternMatch[]): number {
	const baseScore = 1.0
	let reduction = 0
	
	for (const match of matches) {
		// Severity multipliers for weighted scoring
		const severityMultiplier = match.severity === 'high' ? 1.5 : 
		                           match.severity === 'medium' ? 1.0 : 0.5
		reduction += match.pattern.weight * severityMultiplier
	}
	
	// Normalize to [0, 1] range
	return Math.max(0, Math.min(1, baseScore - reduction))
}

/**
 * Routes to appropriate model based on pattern complexity
 */
export function getRecommendedModel(matches: PatternMatch[]): string {
	const qualityScore = calculateQualityScore(matches)
	const hasCriticalPatterns = matches.some(m => 
		m.pattern.patternId === 'CYCLE_DETECTION' || 
		m.pattern.patternId === 'VALIDATION_GAP'
	)
	
	if (hasCriticalPatterns && qualityScore < 0.7) {
		return 'claude-sonnet-4-20250514' // More capable model for complex issues
	} else if (qualityScore < 0.85) {
		return 'gpt-4.1' // Mid-tier model for moderate issues
	} else {
		return 'gpt-4o-mini' // Efficient model for clean code
	}
}
