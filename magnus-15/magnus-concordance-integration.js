/**
 * ════════════════════════════════════════════════════════════════════════════
 * MAGNUS 15 - CONCORDANCE ENGINE INTEGRATION
 *
 * Phonosophic Validation Layer for Music Composition Orchestration
 *
 * Philosophy:
 *   INTENTION (Sophia) ←→ CONCORDANCE ←→ MANIFESTATION (Phono)
 *
 * Two Registers:
 *   Structural: Intention ════════ Code (exact, binary 100/0)
 *   Residual:   Intention ≈~~~~~ Code (gradient, 0-100)
 *
 * @version 15.1.0
 * @license MIT
 * ════════════════════════════════════════════════════════════════════════════
 */

'use strict';

const { ConcordanceEngine } = require('./concordance-engine');

// ════════════════════════════════════════════════════════════════
// MAGNUS 15 WITH CONCORDANCE INTEGRATION
// ════════════════════════════════════════════════════════════════

class Magnus15WithConcordance {
  constructor(config = {}) {
    this.config = {
      orchestratorName: 'Magnus15',
      ...config
    };

    // Import the main orchestrator components (assumes magnus-orchestrator.js is available)
    this.sessions = new Map();
    this.learningRecords = [];

    // Initialize Concordance Engine with custom config for music domain
    this.concordance = new ConcordanceEngine({
      structuralThresholds: {
        minClarity: 85,
        maxComplexity: 4,
        patternRecognitionRequired: true
      },
      residualThresholds: {
        convergenceBoundary: 5,
        partialBoundary: 15,
        failureBoundary: 15
      },
      leakageWeights: {
        errorHandling: 0.25,
        edgeCases: 0.15,
        documentation: 0.10,
        testCoverage: 0.25,
        security: 0.25
      }
    });

    // Add music-specific patterns
    this._registerMusicPatterns();
  }

  /**
   * Register music-specific patterns for structural concordance
   */
  _registerMusicPatterns() {
    const musicPatterns = [
      ['Pop_Song_Structure', {
        keywords: ['verse', 'chorus', 'bridge', 'hook', 'pop'],
        successRate: 94.5
      }],
      ['Jazz_Arrangement', {
        keywords: ['jazz', 'swing', 'improvisation', 'bebop', 'standard'],
        successRate: 91.2
      }],
      ['Classical_Composition', {
        keywords: ['symphony', 'sonata', 'classical', 'orchestra', 'movement'],
        successRate: 93.7
      }],
      ['Electronic_Production', {
        keywords: ['synth', 'electronic', 'beat', 'drop', 'edm', 'techno'],
        successRate: 95.1
      }],
      ['Film_Score', {
        keywords: ['film', 'score', 'cinematic', 'orchestral', 'soundtrack'],
        successRate: 92.8
      }],
      ['432Hz_Harmony', {
        keywords: ['432', 'hz', 'frequency', 'healing', 'tuning'],
        successRate: 88.3
      }],
      ['Sacred_Geometry_Music', {
        keywords: ['golden', 'ratio', 'fibonacci', 'sacred', 'geometry'],
        successRate: 87.6
      }]
    ];

    for (const [name, data] of musicPatterns) {
      this.concordance.recognizedPatterns.set(name, data);
    }
  }

  // ════════════════════════════════════════════════════════════════
  // PHASE 6: CONCORDANCE VALIDATION
  // ════════════════════════════════════════════════════════════════

  /**
   * Validate concordance between intention and generated output
   * Replaces/enhances the standard convergence validation
   *
   * @param {string} sessionId - Session identifier
   * @param {string|Object} generatedOutput - The generated composition/code
   * @param {Object} developerFeedback - Feedback from user
   * @returns {Object} Complete concordance validation result
   */
  async validateConcordance(sessionId, generatedOutput, developerFeedback = {}) {
    console.log('\n🎼 PHASE 6: Concordance Validation');
    console.log('════════════════════════════════════════════════════════');

    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const analysis = session.analysis || this._buildAnalysisFromSession(session);

    // Step 1: Classify which register to use
    const classification = this.concordance.classifyByConcordanceRegister(analysis);
    console.log(`📊 Register: ${classification.register}`);
    console.log(`   Reason: ${classification.reasoning}`);

    // Step 2: Validate using appropriate register
    let concordanceResult;

    if (classification.register === 'STRUCTURAL') {
      concordanceResult = await this.concordance.validateStructuralConcordance(
        sessionId,
        generatedOutput,
        analysis,
        developerFeedback
      );
    } else {
      concordanceResult = await this.concordance.validateResidualConcordance(
        sessionId,
        generatedOutput,
        analysis,
        developerFeedback
      );
    }

    // Step 3: Update session with concordance result
    session.concordance = concordanceResult;
    session.updatedAt = new Date().toISOString();
    this.sessions.set(sessionId, session);

    // Step 4: Return complete validation result
    return {
      sessionId,
      classification,
      concordanceResult,
      timestamp: Date.now(),
      nextSteps: this.suggestConcordanceNextSteps(concordanceResult)
    };
  }

  /**
   * Build analysis object from session for concordance engine
   */
  _buildAnalysisFromSession(session) {
    return {
      request: session.request?.prompt || '',
      prompt: session.request?.prompt || '',
      understanding: {
        clarityScore: session.strategy?.confidence || 70
      },
      complexity: {
        overall: {
          score: this._estimateComplexity(session)
        }
      },
      context: session.request || {}
    };
  }

  /**
   * Estimate complexity from session data
   */
  _estimateComplexity(session) {
    let complexity = 3; // Base

    const prompt = session.request?.prompt?.toLowerCase() || '';

    // Increase complexity for complex keywords
    if (prompt.includes('complex') || prompt.includes('sophisticated')) complexity += 2;
    if (prompt.includes('multi-') || prompt.includes('custom')) complexity += 1;
    if (prompt.includes('real-time') || prompt.includes('dynamic')) complexity += 1;

    // Decrease for simple keywords
    if (prompt.includes('simple') || prompt.includes('basic')) complexity -= 1;
    if (prompt.includes('standard') || prompt.includes('classic')) complexity -= 1;

    return Math.max(1, Math.min(8, complexity));
  }

  /**
   * Suggest next steps based on concordance outcome
   */
  suggestConcordanceNextSteps(result) {
    const { register, status } = result;

    if (status === 'CONVERGED') {
      return {
        action: 'RECORD_CONCORDANCE',
        steps: [
          `✓ ${register} Concordance achieved`,
          '✓ Record outcome in learning engine',
          '✓ Composition ready for final output/export'
        ],
        canProceed: true
      };
    } else if (status === 'PARTIAL') {
      const leakageDetails = result.leakageBreakdown
        ? Object.entries(result.leakageBreakdown)
            .filter(([k, v]) => v > 5)
            .map(([k, v]) => `${k}: ${v.toFixed(1)}%`)
            .join(', ')
        : 'See breakdown';

      return {
        action: 'REFINE_AND_REVALIDATE',
        steps: [
          `◐ ${register} Concordance incomplete`,
          `◐ Identified leakages: ${leakageDetails}`,
          '◐ Make refinements and re-validate'
        ],
        canProceed: false,
        suggestedRefinements: this._suggestRefinements(result)
      };
    } else {
      return {
        action: 'RETURN_TO_ANALYSIS',
        steps: [
          `✗ ${register} Concordance failed`,
          '✗ Composition does not sufficiently resonate with intention',
          '✗ Return to analysis phase with developer feedback'
        ],
        canProceed: false,
        suggestedActions: [
          'Clarify original request with more specific details',
          'Review agent recommendations for misalignment',
          'Consider breaking down into smaller, clearer tasks'
        ]
      };
    }
  }

  /**
   * Suggest specific refinements for partial concordance
   */
  _suggestRefinements(result) {
    const refinements = [];
    const breakdown = result.leakageBreakdown || {};

    if (breakdown.errorHandling > 10) {
      refinements.push({
        area: 'Error Handling',
        issue: `${breakdown.errorHandling.toFixed(1)}% leakage`,
        suggestion: 'Add comprehensive error handling for edge cases and unexpected inputs'
      });
    }

    if (breakdown.edgeCases > 5) {
      refinements.push({
        area: 'Edge Cases',
        issue: `${breakdown.edgeCases.toFixed(1)}% leakage`,
        suggestion: 'Handle boundary conditions (empty inputs, extreme values, null states)'
      });
    }

    if (breakdown.documentation > 5) {
      refinements.push({
        area: 'Documentation',
        issue: `${breakdown.documentation.toFixed(1)}% leakage`,
        suggestion: 'Add inline comments and JSDoc for complex logic'
      });
    }

    if (breakdown.testCoverage > 10) {
      refinements.push({
        area: 'Test Coverage',
        issue: `${breakdown.testCoverage.toFixed(1)}% leakage`,
        suggestion: 'Expand test suite to cover main functions and edge cases'
      });
    }

    if (breakdown.security > 0) {
      refinements.push({
        area: 'Security',
        issue: `${breakdown.security.toFixed(1)}% leakage`,
        suggestion: 'Review for potential vulnerabilities (input validation, sanitization)'
      });
    }

    return refinements;
  }

  // ════════════════════════════════════════════════════════════════
  // PHASE 7: LEARNING ENGINE INTEGRATION
  // ════════════════════════════════════════════════════════════════

  /**
   * Record concordance outcome for learning
   */
  async recordConcordanceOutcome(sessionId, concordanceValidation) {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error(`Session ${sessionId} not found`);
    }

    const learningRecord = {
      sessionId,
      orchestrator: this.config.orchestratorName,
      register: concordanceValidation.classification.register,

      // Structural-specific fields
      ...(concordanceValidation.classification.register === 'STRUCTURAL' && {
        pattern: concordanceValidation.concordanceResult.pattern,
        structuralMatch: concordanceValidation.concordanceResult.structuralMatch,
        historicalSuccessRate: concordanceValidation.concordanceResult.historicalSuccessRate,
        developerRecognition: concordanceValidation.concordanceResult.developerRecognition
      }),

      // Residual-specific fields
      ...(concordanceValidation.classification.register === 'RESIDUAL' && {
        totalLeakage: concordanceValidation.concordanceResult.totalLeakagePercentage,
        leakageBreakdown: concordanceValidation.concordanceResult.leakageBreakdown,
        developerRecognitionGradient: concordanceValidation.concordanceResult.developerRecognitionGradient
      }),

      status: concordanceValidation.concordanceResult.status,
      outcome: concordanceValidation.concordanceResult.metadata.finalOutcome,
      philosophy: concordanceValidation.concordanceResult.philosophy,
      timestamp: Date.now()
    };

    this.learningRecords.push(learningRecord);
    console.log('📚 Concordance outcome recorded for learning');

    // Update session as completed
    session.status = 'completed';
    session.finalConcordance = learningRecord;
    session.completedAt = new Date().toISOString();
    this.sessions.set(sessionId, session);

    return {
      sessionId,
      concordance: concordanceValidation.concordanceResult.status,
      finalOutcome: learningRecord.outcome,
      philosophy: learningRecord.philosophy,
      timestamp: Date.now()
    };
  }

  // ════════════════════════════════════════════════════════════════
  // COMPLETE WORKFLOW
  // ════════════════════════════════════════════════════════════════

  /**
   * Create a new session for concordance workflow
   */
  createSession(request) {
    const sessionId = require('uuid').v4();
    const session = {
      id: sessionId,
      request,
      status: 'initialized',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      analysis: null,
      strategy: null,
      concordance: null
    };

    this.sessions.set(sessionId, session);
    return session;
  }

  /**
   * Get session by ID
   */
  getSession(sessionId) {
    return this.sessions.get(sessionId) || null;
  }

  /**
   * Get concordance metrics
   */
  getConcordanceMetrics() {
    return this.concordance.getMetrics();
  }

  /**
   * Get learning records summary
   */
  getLearningRecordsSummary() {
    const structural = this.learningRecords.filter(r => r.register === 'STRUCTURAL');
    const residual = this.learningRecords.filter(r => r.register === 'RESIDUAL');

    return {
      totalRecords: this.learningRecords.length,
      structural: {
        count: structural.length,
        converged: structural.filter(r => r.status === 'CONVERGED').length,
        patterns: [...new Set(structural.map(r => r.pattern))].filter(Boolean)
      },
      residual: {
        count: residual.length,
        converged: residual.filter(r => r.status === 'CONVERGED').length,
        partial: residual.filter(r => r.status === 'PARTIAL').length,
        averageLeakage: residual.length > 0
          ? (residual.reduce((sum, r) => sum + (r.totalLeakage || 0), 0) / residual.length).toFixed(1)
          : 'N/A'
      }
    };
  }
}

// ════════════════════════════════════════════════════════════════
// COMPLETE WORKFLOW EXAMPLES
// ════════════════════════════════════════════════════════════════

/**
 * Example 1: STRUCTURAL Concordance (Clear Pattern)
 */
async function exampleStructuralConcordance() {
  console.log('\n' + '═'.repeat(70));
  console.log('EXAMPLE 1: STRUCTURAL CONCORDANCE - Pop Song Structure');
  console.log('═'.repeat(70));

  const magnus = new Magnus15WithConcordance();

  // Create session with clear, pattern-based request
  const session = magnus.createSession({
    prompt: 'Create a pop song with verse-chorus-bridge structure in C major',
    genre: 'pop',
    mood: 'uplifting',
    tempo: 120
  });

  // Simulate analysis
  session.analysis = {
    request: session.request.prompt,
    prompt: session.request.prompt,
    understanding: { clarityScore: 95 },
    complexity: { overall: { score: 3 } }
  };
  session.strategy = { confidence: 92 };

  // Simulated generated composition
  const generatedComposition = `
    // Pop Song: "Summer Vibes"
    // Structure: Verse-Chorus-Verse-Chorus-Bridge-Chorus

    const songStructure = {
      intro: { bars: 4, key: 'C major', tempo: 120 },
      verse1: { bars: 8, chords: ['C', 'Am', 'F', 'G'], lyrics: 'verse 1 hook' },
      chorus: { bars: 8, chords: ['F', 'G', 'C', 'Am'], hook: true },
      verse2: { bars: 8, chords: ['C', 'Am', 'F', 'G'] },
      bridge: { bars: 4, chords: ['Dm', 'G', 'Em', 'Am'] },
      outro: { bars: 4, fadeOut: true }
    };
  `;

  // Validate with positive developer feedback
  const validation = await magnus.validateConcordance(
    session.id,
    generatedComposition,
    { text: 'This is exactly the pop structure I wanted!', confidence: 100 }
  );

  console.log('\n📊 CONCORDANCE RESULTS:');
  console.log(`  Register: ${validation.classification.register}`);
  console.log(`  Pattern: ${validation.concordanceResult.pattern || 'N/A'}`);
  console.log(`  Score: ${validation.concordanceResult.concordanceScore}/100`);
  console.log(`  Status: ${validation.concordanceResult.status}`);
  console.log(`  Philosophy: ${validation.concordanceResult.philosophy.accord}`);

  // Record for learning
  await magnus.recordConcordanceOutcome(session.id, validation);

  return validation;
}

/**
 * Example 2: RESIDUAL Concordance (Complex Domain)
 */
async function exampleResidualConcordance() {
  console.log('\n' + '═'.repeat(70));
  console.log('EXAMPLE 2: RESIDUAL CONCORDANCE - Complex Custom Composition');
  console.log('═'.repeat(70));

  const magnus = new Magnus15WithConcordance();

  // Create session with complex, custom request
  const session = magnus.createSession({
    prompt: 'Create a complex multi-layered ambient composition with evolving textures, sacred geometry-inspired timing, and 432Hz tuning',
    genre: 'ambient',
    mood: 'meditative',
    tempo: 60
  });

  // Simulate analysis (complex domain)
  session.analysis = {
    request: session.request.prompt,
    prompt: session.request.prompt,
    understanding: { clarityScore: 68 },
    complexity: { overall: { score: 7 } }
  };
  session.strategy = { confidence: 75 };

  // Simulated generated composition (with some gaps)
  const generatedComposition = `
    // Ambient Composition: "Infinite Spiral"
    // 432Hz Tuning, Sacred Geometry Timing

    function createAmbientLayer(params) {
      const { frequency, timing, texture } = params;

      // Apply 432Hz adjustment
      const adjustedFreq = frequency * 0.9818;

      // Golden ratio timing
      const phiTiming = timing * 1.618;

      return generateTexture(adjustedFreq, phiTiming, texture);
    }

    // Main composition
    const layers = [
      createAmbientLayer({ frequency: 432, timing: 8, texture: 'drone' }),
      createAmbientLayer({ frequency: 216, timing: 13, texture: 'pad' })
    ];
  `;

  // Validate with partial developer feedback
  const validation = await magnus.validateConcordance(
    session.id,
    generatedComposition,
    { text: 'This is close but needs more edge case handling', confidence: 72 }
  );

  console.log('\n📊 CONCORDANCE RESULTS:');
  console.log(`  Register: ${validation.classification.register}`);
  console.log(`  Score: ${validation.concordanceResult.concordanceScore}/100`);
  console.log(`  Total Leakage: ${validation.concordanceResult.totalLeakagePercentage?.toFixed(1) || 0}%`);
  console.log(`  Status: ${validation.concordanceResult.status}`);
  console.log(`  Philosophy: ${validation.concordanceResult.philosophy.accord}`);

  if (validation.concordanceResult.leakageBreakdown) {
    console.log('\n  Leakage Breakdown:');
    for (const [key, value] of Object.entries(validation.concordanceResult.leakageBreakdown)) {
      if (value > 0) {
        console.log(`    - ${key}: ${value.toFixed(1)}%`);
      }
    }
  }

  console.log('\n  Next Steps:');
  for (const step of validation.nextSteps.steps) {
    console.log(`    ${step}`);
  }

  // Record for learning
  await magnus.recordConcordanceOutcome(session.id, validation);

  return validation;
}

/**
 * Run all examples
 */
async function runExamples() {
  try {
    await exampleStructuralConcordance();
    await exampleResidualConcordance();

    console.log('\n' + '═'.repeat(70));
    console.log('EXAMPLES COMPLETED');
    console.log('═'.repeat(70));
  } catch (error) {
    console.error('Example error:', error);
  }
}

// Export for use in Magnus 15
module.exports = {
  Magnus15WithConcordance,
  exampleStructuralConcordance,
  exampleResidualConcordance,
  runExamples
};

// Run examples if executed directly
if (require.main === module) {
  runExamples();
}
