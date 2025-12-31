/**
 * Magnus Bias Detector
 *
 * Addresses 5 biases identified in Scanner Report:
 * 1. Confirmation bias (setup patterns over-detected)
 * 2. False negatives (algorithmic complexity missed)
 * 3. Over-detection of syntactic similarity
 * 4. Quantity vs quality bias (high occurrence ≠ high quality)
 * 5. Blind spot for success patterns (only analyzes problems)
 */

class BiasDetector {
  constructor(config = {}) {
    this.config = {
      contextThreshold: config.contextThreshold || 0.4,
      semanticThreshold: config.semanticThreshold || 0.6,
      syntacticThreshold: config.syntacticThreshold || 0.8,
      confidenceThreshold: config.confidenceThreshold || 0.7,
      enableSuccessPatterns: config.enableSuccessPatterns !== false
    };

    this.biasMetrics = {
      confirmationBias: 0,
      falseNegatives: 0,
      syntacticOverDetection: 0,
      quantityVsQuality: 0,
      successBlindSpot: 0
    };

    this.patterns = [];
  }

  /**
   * Main bias detection flow
   */
  detectBias(pattern) {
    const warnings = [];

    // 1. Context Diversity Check (Confirmation Bias)
    const contextWarnings = this.checkContextDiversity(pattern);
    if (contextWarnings.length > 0) {
      warnings.push(...contextWarnings);
    }

    // 2. Research vs Production Check (Preserve Intent)
    const researchWarnings = this.checkResearchCode(pattern);
    if (researchWarnings.length > 0) {
      warnings.push(...researchWarnings);
    }

    // 3. Syntactic vs Semantic Check (False Positives)
    const semanticWarnings = this.checkSyntacticVsSemanticSimilarity(pattern);
    if (semanticWarnings.length > 0) {
      warnings.push(...semanticWarnings);
    }

    // 4. Quantity vs Quality Check (Occurrence Count)
    const qualityWarnings = this.checkQuantityVsQuality(pattern);
    if (qualityWarnings.length > 0) {
      warnings.push(...qualityWarnings);
    }

    // 5. Success Pattern Detection (Flip the analysis)
    const successWarnings = this.checkSuccessPatterns(pattern);
    if (successWarnings.length > 0) {
      warnings.push(...successWarnings);
    }

    // 6. Algorithmic Complexity Check (False Negatives)
    const complexityWarnings = this.checkAlgorithmicComplexity(pattern);
    if (complexityWarnings.length > 0) {
      warnings.push(...complexityWarnings);
    }

    // Add confidence score
    const finalWarnings = warnings.map(w => ({
      ...w,
      confidence: this.calculateConfidence(pattern, w)
    }));

    return {
      warnings: finalWarnings,
      metrics: this.biasMetrics,
      shouldReview: finalWarnings.some(w => w.confidence < this.config.confidenceThreshold)
    };
  }

  // ============================================================================
  // BIAS #1: CONFIRMATION BIAS
  // ============================================================================
  /**
   * Check if similar code exists in diverse contexts
   * Confirmation bias = finding similar code patterns across projects
   * and over-detecting them as "opportunities for optimization"
   */
  checkContextDiversity(pattern) {
    const warnings = [];

    if (!pattern.occurrences || pattern.occurrences.length === 0) {
      return warnings;
    }

    // Extract unique contexts (projects, use cases, domains)
    const contexts = new Set(
      pattern.occurrences.map(occ => occ.context || occ.project)
    );

    // Calculate context variability
    const contextVariability = this.calculateContextVariability(pattern.occurrences);

    if (contextVariability > this.config.contextThreshold) {
      this.biasMetrics.confirmationBias++;

      warnings.push({
        type: 'CONFIRMATION_BIAS',
        severity: 'HIGH',
        message: `Code similar but contexts differ (${contexts.size} different contexts)`,
        details: {
          contexts: Array.from(contexts),
          variability: contextVariability.toFixed(2),
          occurrences: pattern.occurrences.length
        },
        recommendation: 'Human review required - contexts may justify differences',
        example: `
Pattern found in:
${Array.from(contexts).slice(0, 3).map(c => `  • ${c}`).join('\n')}

Each context may have different requirements. Different code ≠ Problem to solve.`
      });
    }

    return warnings;
  }

  /**
   * Calculate how variable the contexts are
   * Returns 0 (all same context) to 1 (all different contexts)
   */
  calculateContextVariability(occurrences) {
    if (occurrences.length < 2) return 0;

    const contexts = occurrences.map(occ => occ.context || occ.project);
    const uniqueContexts = new Set(contexts);

    // Variability = unique contexts / total occurrences
    return uniqueContexts.size / occurrences.length;
  }

  // ============================================================================
  // BIAS #2: FALSE NEGATIVES (ALGORITHMIC COMPLEXITY)
  // ============================================================================
  /**
   * Detect patterns that might indicate algorithmic problems
   * False negatives = Missing complex algorithms hidden in simple-looking code
   */
  checkAlgorithmicComplexity(pattern) {
    const warnings = [];

    // Indicators of potential algorithmic issues
    const complexityIndicators = {
      'nested_loops': {
        regex: /for.*for/i,
        severity: 'MEDIUM',
        message: 'Nested loops - potential O(n²) or worse'
      },
      'recursive_calls': {
        regex: /function\s+\w+\s*\([\s\S]*?\)\s*\{[\s\S]*?\1\s*\(/,
        severity: 'MEDIUM',
        message: 'Recursive function - potential stack overflow'
      },
      'exponential_growth': {
        regex: /2\s*\*\*|Math\.pow.*2/i,
        severity: 'HIGH',
        message: 'Exponential operation - potential performance issue'
      },
      'no_caching': {
        regex: /function.*\{[\s\S]{0,500}?\}/,
        severity: 'MEDIUM',
        message: 'Repeated computation without caching',
        check: (code) => {
          // Check if function calls itself repeatedly without memoization
          const hasRecursion = /\1\s*\(/.test(code);
          const hasMemo = /memo|cache/i.test(code);
          return hasRecursion && !hasMemo;
        }
      }
    };

    let foundComplexity = false;

    if (pattern.code) {
      for (const [indicator, config] of Object.entries(complexityIndicators)) {
        if (config.regex.test(pattern.code)) {
          foundComplexity = true;

          warnings.push({
            type: 'ALGORITHMIC_COMPLEXITY',
            severity: config.severity,
            indicator: indicator,
            message: config.message,
            recommendation: 'Analyze algorithm efficiency - may be causing performance issues',
            details: {
              pattern: indicator,
              code_snippet: pattern.code.substring(0, 100) + '...'
            }
          });
        }
      }
    }

    if (foundComplexity) {
      this.biasMetrics.falseNegatives++;
    }

    return warnings;
  }

  // ============================================================================
  // BIAS #3: SYNTACTIC VS SEMANTIC SIMILARITY
  // ============================================================================
  /**
   * Check for cases where code looks similar but means different things
   * Example: Loading state for API vs loading state for local calculation
   * Both use similar patterns but serve different purposes
   */
  checkSyntacticVsSemanticSimilarity(pattern) {
    const warnings = [];

    const syntacticSimilarity = pattern.syntacticSimilarity || 0.8;
    const semanticSimilarity = this.calculateSemanticSimilarity(pattern);

    // High syntactic, low semantic = potential false positive
    if (
      syntacticSimilarity >= this.config.syntacticThreshold &&
      semanticSimilarity < this.config.semanticThreshold
    ) {
      this.biasMetrics.syntacticOverDetection++;

      warnings.push({
        type: 'SYNTACTIC_SEMANTIC_MISMATCH',
        severity: 'HIGH',
        message: 'Code syntactically similar but semantically different',
        details: {
          syntactic_similarity: syntacticSimilarity.toFixed(2),
          semantic_similarity: semanticSimilarity.toFixed(2),
          gap: (syntacticSimilarity - semanticSimilarity).toFixed(2)
        },
        recommendation: 'Flag for manual review - may not be a real duplication issue',
        example: `
EXAMPLE - Sacred Geometry Pattern (from Scanner Report)
This was detected as "duplication" but is actually:
  • Different meaning
  • Different context
  • Different requirements
  • Same syntax

Result: FALSE POSITIVE - Should NOT be optimized`
      });
    }

    return warnings;
  }

  /**
   * Calculate semantic similarity between code instances
   * Checks: variable names, function purposes, comments, logic flow
   */
  calculateSemanticSimilarity(pattern) {
    if (!pattern.occurrences || pattern.occurrences.length < 2) {
      return 1.0;
    }

    let totalSimilarity = 0;
    let comparisons = 0;

    // Compare each pair of occurrences
    for (let i = 0; i < pattern.occurrences.length; i++) {
      for (let j = i + 1; j < pattern.occurrences.length; j++) {
        const occ1 = pattern.occurrences[i];
        const occ2 = pattern.occurrences[j];

        // Semantic similarity checks
        const nameSimilarity = this.compareVariableNames(occ1, occ2);
        const purposeSimilarity = this.comparePurpose(occ1, occ2);
        const contextSimilarity = this.compareContext(occ1, occ2);

        const avgSimilarity = (nameSimilarity + purposeSimilarity + contextSimilarity) / 3;
        totalSimilarity += avgSimilarity;
        comparisons++;
      }
    }

    return comparisons > 0 ? totalSimilarity / comparisons : 0.5;
  }

  /**
   * Compare variable names - different names suggest different purposes
   */
  compareVariableNames(occ1, occ2) {
    if (!occ1.variables || !occ2.variables) return 0.5;

    const vars1 = new Set(occ1.variables);
    const vars2 = new Set(occ2.variables);

    const common = [...vars1].filter(v => vars2.has(v)).length;
    const total = Math.max(vars1.size, vars2.size);

    return total > 0 ? common / total : 0.5;
  }

  /**
   * Compare purpose/meaning - extracted from comments or function names
   */
  comparePurpose(occ1, occ2) {
    const purpose1 = (occ1.purpose || occ1.comment || '').toLowerCase();
    const purpose2 = (occ2.purpose || occ2.comment || '').toLowerCase();

    if (!purpose1 || !purpose2) return 0.5;

    // Simple word overlap for purpose similarity
    const words1 = new Set(purpose1.split(/\W+/));
    const words2 = new Set(purpose2.split(/\W+/));

    const common = [...words1].filter(w => words2.has(w) && w.length > 3).length;
    const total = Math.max(words1.size, words2.size);

    return total > 0 ? common / total : 0.5;
  }

  /**
   * Compare context - same context suggests duplication, different suggests not
   */
  compareContext(occ1, occ2) {
    if (occ1.context === occ2.context) return 1.0; // Same context = similar
    return 0.2; // Different context = likely not duplication
  }

  // ============================================================================
  // BIAS #4: QUANTITY VS QUALITY
  // ============================================================================
  /**
   * Just because code appears in many places doesn't mean it's a good
   * candidate for optimization. Quality of recommendation matters more
   * than quantity of occurrences.
   */
  checkQuantityVsQuality(pattern) {
    const warnings = [];

    const occurrenceCount = pattern.occurrences?.length || 1;
    const confidence = pattern.confidence || 0.5;

    // High occurrence but low confidence = quantity bias
    if (occurrenceCount >= 5 && confidence < 0.7) {
      this.biasMetrics.quantityVsQuality++;

      warnings.push({
        type: 'QUANTITY_OVER_QUALITY',
        severity: 'MEDIUM',
        message: `Found in ${occurrenceCount} places but confidence is only ${(confidence * 100).toFixed(0)}%`,
        details: {
          occurrence_count: occurrenceCount,
          confidence: confidence.toFixed(2),
          quality_score: (confidence * 100).toFixed(0)
        },
        recommendation: `High quantity (${occurrenceCount} times) but low confidence (${(confidence * 100).toFixed(0)}%).
          Do NOT optimize based on quantity alone. Quality score too low.`,
        example: `
PROBLEM: Quantity bias
  • Pattern found in 12 places
  • But only 40% confidence

WRONG CONCLUSION: "This is a major pattern - optimize it!"

RIGHT CONCLUSION: "Found in many places but not confident it's the same issue.
                  Investigate why confidence is low before optimizing."`
      });
    }

    return warnings;
  }

  // ============================================================================
  // BIAS #5: BLINDNESS TO SUCCESS PATTERNS
  // ============================================================================
  /**
   * Scanner only looks for problems. What about things working WELL?
   * Success patterns are invisible to problem-focused analysis.
   *
   * Example from report: Service Cloud Setup was marked as "pattern"
   * but actually SOLVES the problem (Pattern #5)
   */
  checkSuccessPatterns(pattern) {
    const warnings = [];

    if (!this.config.enableSuccessPatterns) {
      return warnings;
    }

    // Indicators of success (things working well)
    const successIndicators = {
      'consistent_pattern': {
        check: (p) => p.consistency > 0.85,
        message: 'Code is very consistent - good practice detected'
      },
      'error_handling': {
        check: (p) => /try.*catch|error.*handler/i.test(p.code || ''),
        message: 'Good error handling pattern'
      },
      'type_safety': {
        check: (p) => /type|interface|class|readonly/i.test(p.code || ''),
        message: 'Type safety pattern detected'
      },
      'testing': {
        check: (p) => /test|spec|mock|jest|describe/i.test(p.code || ''),
        message: 'Testing pattern detected'
      },
      'documentation': {
        check: (p) => /\/\*\*|@param|@return/i.test(p.code || ''),
        message: 'Good documentation pattern'
      },
      'performance_optimization': {
        check: (p) => /cache|memoize|debounce|throttle/i.test(p.code || ''),
        message: 'Performance optimization pattern'
      }
    };

    let successCount = 0;

    for (const [indicator, config] of Object.entries(successIndicators)) {
      if (config.check(pattern)) {
        successCount++;

        warnings.push({
          type: 'SUCCESS_PATTERN',
          severity: 'INFO',
          indicator: indicator,
          message: config.message,
          recommendation: 'Preserve and extend - this is a good pattern',
          context: 'This is working well. Consider making it standard practice.'
        });
      }
    }

    if (successCount > 0) {
      console.log(`✅ Detected ${successCount} success patterns in: ${pattern.name}`);
    }

    return warnings;
  }

  // ============================================================================
  // UTILITY: RESEARCH VS PRODUCTION CODE
  // ============================================================================
  /**
   * Some code is meant to be research/exploratory
   * Optimization might destroy the intent
   */
  checkResearchCode(pattern) {
    const warnings = [];

    const isResearch = this.isResearchCode(pattern);

    if (isResearch) {
      warnings.push({
        type: 'RESEARCH_CODE',
        severity: 'HIGH',
        message: 'Philosophical/research code detected',
        recommendation: 'Do NOT optimize - preserve original intent',
        details: {
          indicators: pattern.researchIndicators || []
        },
        example: `
EXAMPLE: Sacred Geometry Research
  • Exploring mathematical patterns
  • Testing philosophical concepts
  • Not meant for production
  • Different code = different exploration

WRONG: "Let's refactor and consolidate"
RIGHT: "Let's preserve and document the research"`
      });
    }

    return warnings;
  }

  /**
   * Detect if code is research vs production
   */
  isResearchCode(pattern) {
    const researchIndicators = [
      /research|experiment|poc|prototype/i,
      /exploration|investigation|theory/i,
      /sacred|geometry|philosophy|metaphor/i,
      /test.*concept|validate.*idea/i,
      /proof.*of.*concept/i
    ];

    const code = (pattern.code || '') + (pattern.comment || '') + (pattern.name || '');

    return researchIndicators.some(regex => regex.test(code));
  }

  // ============================================================================
  // CONFIDENCE CALCULATION
  // ============================================================================
  /**
   * Calculate confidence in a warning
   * Some warnings are high confidence, others are just flags
   */
  calculateConfidence(pattern, warning) {
    let confidence = 0.7; // Base confidence

    switch (warning.type) {
      case 'CONFIRMATION_BIAS':
        // Lower confidence due to context diversity
        confidence = Math.max(0.3, 0.7 - warning.details.variability);
        break;

      case 'ALGORITHMIC_COMPLEXITY':
        // Algorithm warnings are usually high confidence
        confidence = 0.85;
        break;

      case 'SYNTACTIC_SEMANTIC_MISMATCH':
        // Lower confidence when semantic is low
        confidence = Math.min(0.4, warning.details.semantic_similarity);
        break;

      case 'QUANTITY_OVER_QUALITY':
        // Use the pattern's own confidence
        confidence = pattern.confidence || 0.4;
        break;

      case 'SUCCESS_PATTERN':
        // Success patterns are informational, not problems
        confidence = 1.0;
        break;

      case 'RESEARCH_CODE':
        // Research code shouldn't be analyzed for optimization
        confidence = 0.95;
        break;
    }

    return Math.max(0, Math.min(1, confidence));
  }

  // ============================================================================
  // REPORTING
  // ============================================================================
  /**
   * Generate a bias report
   */
  generateReport() {
    const total = Object.values(this.biasMetrics).reduce((a, b) => a + b, 0);

    return {
      timestamp: Date.now(),
      summary: {
        total_biases_detected: total,
        confirmation_bias: this.biasMetrics.confirmationBias,
        false_negatives: this.biasMetrics.falseNegatives,
        syntactic_over_detection: this.biasMetrics.syntacticOverDetection,
        quantity_vs_quality: this.biasMetrics.quantityVsQuality,
        success_blindness: this.biasMetrics.successBlindSpot
      },
      recommendations: [
        'Always review patterns with context diversity > 0.4',
        'Run semantic similarity check before refactoring',
        'Question patterns with low confidence despite high occurrence',
        'Preserve research and philosophical code',
        'Look for success patterns, not just problems'
      ]
    };
  }
}

export default BiasDetector;
