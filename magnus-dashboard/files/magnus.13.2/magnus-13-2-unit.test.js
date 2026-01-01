/**
 * Unit Tests for Magnus 13.2 Hermetic Edition
 * Using Node.js built-in test runner
 */

import { test, describe, beforeEach } from 'node:test';
import assert from 'node:assert';
import Magnus132Hermetic, { SCORING_CONSTANTS, TEXT_PATTERNS } from './magnus-13-2-main.js';

describe('Magnus132Hermetic', () => {
  let magnus;

  beforeEach(() => {
    magnus = new Magnus132Hermetic();
  });

  describe('Configuration Validation', () => {
    test('_validateConfig should return default values for undefined config', () => {
      const result = magnus._validateConfig({});
      assert.strictEqual(result.minClarityScore, 70);
      assert.strictEqual(result.maxComplexityScore, 8);
      assert.strictEqual(result.minMentalModelCoherence, 65);
      assert.strictEqual(result.minConvergenceScore, 80);
      assert.strictEqual(result.minInevitabilityScore, 80);
      assert.strictEqual(result.autoLearn, true);
      assert.strictEqual(result.requireClarification, true);
      assert.strictEqual(result.storageDir, './.magnus');
      assert.strictEqual(result.enableHermetic, true);
      assert.strictEqual(result.enableConvergenceValidation, true);
      assert.strictEqual(result.logPhilosophyNotes, true);
      assert.strictEqual(result.logConvergenceDetails, true);
    });

    test('_validateConfig should validate score ranges', () => {
      const result = magnus._validateConfig({
        minClarityScore: 50,
        maxComplexityScore: 15,
        minMentalModelCoherence: 120
      });
      assert.strictEqual(result.minClarityScore, 50); // within range
      assert.strictEqual(result.maxComplexityScore, 8); // out of range, default used
      assert.strictEqual(result.minMentalModelCoherence, 65); // out of range, default used
    });

    test('_validateConfig should accept valid values', () => {
      const result = magnus._validateConfig({
        minClarityScore: 75,
        maxComplexityScore: 6,
        minMentalModelCoherence: 70,
        autoLearn: false,
        storageDir: './custom'
      });
      assert.strictEqual(result.minClarityScore, 75);
      assert.strictEqual(result.maxComplexityScore, 6);
      assert.strictEqual(result.minMentalModelCoherence, 70);
      assert.strictEqual(result.autoLearn, false);
      assert.strictEqual(result.storageDir, './custom');
    });

    test('_validateScore should handle edge cases', () => {
      assert.strictEqual(magnus._validateScore(undefined, 50, 0, 100), 50);
      assert.strictEqual(magnus._validateScore(null, 50, 0, 100), 50);
      assert.strictEqual(magnus._validateScore('invalid', 50, 0, 100), 50);
      assert.strictEqual(magnus._validateScore(NaN, 50, 0, 100), 50);
      assert.strictEqual(magnus._validateScore(-5, 50, 0, 100), 50);
      assert.strictEqual(magnus._validateScore(150, 50, 0, 100), 50);
      assert.strictEqual(magnus._validateScore(75, 50, 0, 100), 75);
    });

    test('_validateScore should handle boundary values correctly', () => {
      assert.strictEqual(magnus._validateScore(0, 50, 0, 100), 0);
      assert.strictEqual(magnus._validateScore(100, 50, 0, 100), 100);
      assert.strictEqual(magnus._validateScore(1, 50, 0, 100), 1);
      assert.strictEqual(magnus._validateScore(99, 50, 0, 100), 99);
    });

    test('_validateScore should handle string numbers', () => {
      assert.strictEqual(magnus._validateScore('75', 50, 0, 100), 50); // string should default
      assert.strictEqual(magnus._validateScore('0', 50, 0, 100), 50);
    });

    test('_validateScore should handle different ranges', () => {
      assert.strictEqual(magnus._validateScore(5, 3, 1, 10), 5);
      assert.strictEqual(magnus._validateScore(15, 3, 1, 10), 3); // out of range
      assert.strictEqual(magnus._validateScore(0, 3, 1, 10), 3); // below min
    });

    test('_validateConfig should handle invalid boolean values', () => {
      const result = magnus._validateConfig({
        autoLearn: 'yes',
        requireClarification: 0,
        enableHermetic: null
      });
      assert.strictEqual(result.autoLearn, true); // default true
      assert.strictEqual(result.requireClarification, true); // default true
      assert.strictEqual(result.enableHermetic, true); // default true
    });

    test('_validateConfig should handle invalid string values', () => {
      const result = magnus._validateConfig({
        storageDir: 123,
        minClarityScore: 'invalid'
      });
      assert.strictEqual(result.storageDir, 123); // no validation for storageDir
      assert.strictEqual(result.minClarityScore, 70); // default
    });
  });

  describe('Feedback Normalization', () => {
    test('_normalizeFeedback should handle string input', () => {
      const result = magnus._normalizeFeedback('This is perfect!');
      assert.strictEqual(result.text, 'this is perfect!');
      assert.strictEqual(result.recognition, undefined);
      assert.strictEqual(result.inevitability, undefined);
    });

    test('_normalizeFeedback should handle object input', () => {
      const result = magnus._normalizeFeedback({
        text: 'Yes, exactly!',
        recognition: 95,
        inevitability: 92
      });
      assert.strictEqual(result.text, 'yes, exactly!');
      assert.strictEqual(result.recognition, 95);
      assert.strictEqual(result.inevitability, 92);
    });

    test('_normalizeFeedback should handle various object formats', () => {
      assert.strictEqual(magnus._normalizeFeedback({ comment: 'Good' }).text, 'good');
      assert.strictEqual(magnus._normalizeFeedback({ message: 'Excellent' }).text, 'excellent');
      assert.deepStrictEqual(magnus._normalizeFeedback({}), { text: '', recognition: null, inevitability: null, raw: {} });
      assert.deepStrictEqual(magnus._normalizeFeedback(null), { text: '' });
    });

    test('_normalizeFeedback should handle numeric scores in objects', () => {
      const result = magnus._normalizeFeedback({ text: 'Good', recognition: '85', inevitability: 90 });
      assert.strictEqual(result.text, 'good');
      assert.strictEqual(result.recognition, null); // string should be null
      assert.strictEqual(result.inevitability, 90);
    });

    test('_normalizeFeedback should handle array and function inputs', () => {
      assert.deepStrictEqual(magnus._normalizeFeedback([]), { text: '' });
      assert.deepStrictEqual(magnus._normalizeFeedback(() => {}), { text: '() => {}' });
      assert.deepStrictEqual(magnus._normalizeFeedback([1, 2, 3]), { text: '1,2,3' });
    });

    test('_normalizeFeedback should preserve raw feedback', () => {
      const original = { text: 'Test', custom: 'value' };
      const result = magnus._normalizeFeedback(original);
      assert.deepStrictEqual(result.raw, original);
    });
  });

  describe('Recognition Score Calculation', () => {
    test('_calculateRecognitionScore should use explicit numeric scores', () => {
      const feedback = { recognition: 95 };
      const result = magnus._calculateRecognitionScore(feedback, {});
      assert.strictEqual(result, 95);
    });

    test('_calculateRecognitionScore should clamp numeric scores', () => {
      assert.strictEqual(magnus._calculateRecognitionScore({ recognition: 150 }, {}), 100);
      assert.strictEqual(magnus._calculateRecognitionScore({ recognition: -10 }, {}), 0);
    });

    test('_calculateRecognitionScore should analyze text patterns', () => {
      assert.strictEqual(magnus._calculateRecognitionScore({ text: 'exactly yes perfect' }, {}),
        SCORING_CONSTANTS.RECOGNITION_PERFECT);
      assert.strictEqual(magnus._calculateRecognitionScore({ text: 'close mostly almost' }, {}),
        SCORING_CONSTANTS.RECOGNITION_PARTIAL);
      assert.strictEqual(magnus._calculateRecognitionScore({ text: 'not wrong no' }, {}),
        SCORING_CONSTANTS.RECOGNITION_POOR);
      assert.strictEqual(magnus._calculateRecognitionScore({ text: 'neutral text' }, {}),
        SCORING_CONSTANTS.RECOGNITION_NEUTRAL);
    });

    test('_calculateRecognitionScore should handle empty text', () => {
      assert.strictEqual(magnus._calculateRecognitionScore({}, {}), SCORING_CONSTANTS.RECOGNITION_NEUTRAL);
      assert.strictEqual(magnus._calculateRecognitionScore({ text: '' }, {}), SCORING_CONSTANTS.RECOGNITION_NEUTRAL);
    });
  });

  describe('Inevitability Score Calculation', () => {
    test('_calculateInevitabilityScore should use explicit numeric scores', () => {
      const feedback = { inevitability: 88 };
      const result = magnus._calculateInevitabilityScore(feedback);
      assert.strictEqual(result, 88);
    });

    test('_calculateInevitabilityScore should clamp numeric scores', () => {
      assert.strictEqual(magnus._calculateInevitabilityScore({ inevitability: 150 }), 100);
      assert.strictEqual(magnus._calculateInevitabilityScore({ inevitability: -10 }), 0);
    });

    test('_calculateInevitabilityScore should analyze revelation vs creation signs', () => {
      // High revelation score
      const highRevelation = 'This is obvious, inevitable, natural, exactly what I knew';
      const result1 = magnus._calculateInevitabilityScore({ text: highRevelation });
      assert(result1 > 50);

      // High creation score (should reduce inevitability)
      const highCreation = 'This is surprising, creative, clever, unexpected, novel';
      const result2 = magnus._calculateInevitabilityScore({ text: highCreation });
      assert(result2 < 50);
    });

    test('_calculateInevitabilityScore should handle empty feedback', () => {
      assert.strictEqual(magnus._calculateInevitabilityScore({}), SCORING_CONSTANTS.BASE_INEVITABILITY_SCORE);
      assert.strictEqual(magnus._calculateInevitabilityScore({ text: '' }), SCORING_CONSTANTS.BASE_INEVITABILITY_SCORE);
    });

    test('_calculateRecognitionScore should handle mixed positive and negative signals', () => {
      assert.strictEqual(magnus._calculateRecognitionScore({ text: 'exactly but not really' }, {}), SCORING_CONSTANTS.RECOGNITION_NEUTRAL);
      assert.strictEqual(magnus._calculateRecognitionScore({ text: 'close but wrong' }, {}), SCORING_CONSTANTS.RECOGNITION_NEUTRAL);
    });

    test('_calculateRecognitionScore should prioritize explicit numeric scores', () => {
      assert.strictEqual(magnus._calculateRecognitionScore({ recognition: 95, text: 'not wrong no' }, {}), 95);
      assert.strictEqual(magnus._calculateRecognitionScore({ recognition: 25, text: 'exactly yes perfect' }, {}), 25);
    });

    test('_calculateInevitabilityScore should handle mixed revelation and creation signals', () => {
      const mixedText = 'This is obvious and inevitable but also surprising and creative';
      const result = magnus._calculateInevitabilityScore({ text: mixedText });
      // Should be around base score since counts are equal
      assert(result >= 40 && result <= 60);
    });

    test('_calculateInevitabilityScore should clamp scores correctly', () => {
      // Test with many revelation signs
      const highRevelation = 'obvious inevitable natural exactly knew recognized makes sense obvious inevitable';
      const result = magnus._calculateInevitabilityScore({ text: highRevelation });
      assert(result <= 100);
      assert(result > 50);
    });
  });

  describe('Coherence Score Calculation', () => {
    test('_calculateCoherenceScore should return 0 for invalid code', () => {
      assert.strictEqual(magnus._calculateCoherenceScore(null, {}), 0);
      assert.strictEqual(magnus._calculateCoherenceScore('', {}), 0);
      assert.strictEqual(magnus._calculateCoherenceScore(123, {}), 0);
    });

    test('_calculateCoherenceScore should detect code features', () => {
      const goodCode = `
        /**
         * This is a documented function
         * @param {string} input
         * @returns {string}
         */
        class ExampleClass {
          constructor() {
            this.logger = console.log;
          }

          process(input) {
            try {
              this.logger('Processing:', input);
              return input.toUpperCase();
            } catch (error) {
              this.logger('Error:', error);
              throw error;
            }
          }
        }
      `;

      const score = magnus._calculateCoherenceScore(goodCode, {});
      assert(score > 0);
      assert(score <= 100);
    });

    test('_calculateCoherenceScore should give length bonus', () => {
      const shortCode = 'const x = 1;';
      const longCode = 'const x = 1;\n'.repeat(50);

      const shortScore = magnus._calculateCoherenceScore(shortCode, {});
      const longScore = magnus._calculateCoherenceScore(longCode, {});

      assert(longScore > shortScore);
    });

    test('_calculateCoherenceScore should detect all code features', () => {
      const fullCode = `
        /**
         * Full featured code
         * @param {string} input
         * @returns {string}
         */
        class TestClass {
          constructor() {
            this.logger = console.log;
          }

          process(input) {
            try {
              this.logger('Processing:', input);
              return input.toUpperCase();
            } catch (error) {
              this.logger('Error:', error);
              throw error;
            }
          }
        }
      `;

      const score = magnus._calculateCoherenceScore(fullCode, {});
      // Should have all features: error handling, logging, documentation, structure, length
      assert(score >= 80); // 30 + 25 + 25 + 20 + 10 = 110, but capped at 100
    });

    test('_calculateCoherenceScore should handle edge cases', () => {
      assert.strictEqual(magnus._calculateCoherenceScore('', {}), 0);
      assert.strictEqual(magnus._calculateCoherenceScore(null, {}), 0);
      assert.strictEqual(magnus._calculateCoherenceScore(123, {}), 0);
      assert.strictEqual(magnus._calculateCoherenceScore({}, {}), 0);
    });

    test('_calculateCoherenceScore should cap maximum score', () => {
      const veryLongCode = 'console.log("test");\n'.repeat(200);
      const score = magnus._calculateCoherenceScore(veryLongCode, {});
      assert(score <= 100);
    });
  });

  describe('Recognition Categorization', () => {
    test('_categorizeRecognition should handle numeric scores', () => {
      assert.strictEqual(magnus._categorizeRecognition({ recognition: 95 }), 'PERFECT_RECOGNITION');
      assert.strictEqual(magnus._categorizeRecognition({ recognition: 75 }), 'PARTIAL_RECOGNITION');
      assert.strictEqual(magnus._categorizeRecognition({ recognition: 30 }), 'NO_RECOGNITION');
    });

    test('_categorizeRecognition should analyze text patterns', () => {
      assert.strictEqual(magnus._categorizeRecognition({ text: 'exactly yes perfect' }), 'PERFECT_RECOGNITION');
      assert.strictEqual(magnus._categorizeRecognition({ text: 'close mostly almost' }), 'PARTIAL_RECOGNITION');
      assert.strictEqual(magnus._categorizeRecognition({ text: 'not wrong no' }), 'NO_RECOGNITION');
      assert.strictEqual(magnus._categorizeRecognition({ text: 'unclear feedback' }), 'UNCLEAR');
    });
  });

  describe('Hermetic Decision Logic', () => {
    test('makeHermeticDecision should recommend CLARIFY for low clarity', () => {
      const analysis = {
        understanding: { clarityScore: 50 },
        complexity: { overall: { score: 3 } }
      };

      const decision = magnus.makeHermeticDecision(analysis);
      assert.strictEqual(decision.recommendation, 'CLARIFY');
      assert.strictEqual(decision.canProceed, false);
    });

    test('makeHermeticDecision should recommend DECOMPOSE for high complexity', () => {
      const analysis = {
        understanding: { clarityScore: 80 },
        complexity: { overall: { score: 10 } }
      };

      const decision = magnus.makeHermeticDecision(analysis);
      assert.strictEqual(decision.recommendation, 'DECOMPOSE');
      assert.strictEqual(decision.canProceed, false);
    });

    test('makeHermeticDecision should recommend GENERATE for good analysis', () => {
      const analysis = {
        understanding: { clarityScore: 85 },
        complexity: { overall: { score: 4 } }
      };

      const decision = magnus.makeHermeticDecision(analysis);
      assert.strictEqual(decision.recommendation, 'GENERATE');
      assert.strictEqual(decision.canProceed, true);
      assert(decision.strategy !== undefined);
    });
  });

  describe('Strategy Selection', () => {
    test('selectHermeticStrategy should choose based on complexity', () => {
      assert.deepStrictEqual(magnus.selectHermeticStrategy({ complexity: { overall: { score: 2 } } }),
        { name: 'SINGLE_PASS_REVELATION' });
      assert.deepStrictEqual(magnus.selectHermeticStrategy({ complexity: { overall: { score: 4 } } }),
        { name: 'ITERATIVE_REVELATION' });
      assert.deepStrictEqual(magnus.selectHermeticStrategy({ complexity: { overall: { score: 6 } } }),
        { name: 'MODULAR_REVELATION' });
      assert.deepStrictEqual(magnus.selectHermeticStrategy({ complexity: { overall: { score: 9 } } }),
        { name: 'PHASED_REVELATION' });
    });

    test('selectHermeticStrategy should handle missing complexity', () => {
      assert.deepStrictEqual(magnus.selectHermeticStrategy({}), { name: 'ITERATIVE_REVELATION' });
    });
  });

  describe('Scope Determination', () => {
    test('determineScope should map complexity to scope levels', () => {
      assert.strictEqual(magnus.determineScope({ overall: { score: 2 } }), 'SIMPLE');
      assert.strictEqual(magnus.determineScope({ overall: { score: 4 } }), 'MODERATE');
      assert.strictEqual(magnus.determineScope({ overall: { score: 6 } }), 'COMPLEX');
      assert.strictEqual(magnus.determineScope({ overall: { score: 9 } }), 'EXPERT');
    });

    test('determineScope should handle missing complexity', () => {
      assert.strictEqual(magnus.determineScope({}), 'MODERATE');
    });
  });

  describe('Interpretation Methods', () => {
    test('_interpretClarity should provide appropriate interpretations', () => {
      assert(magnus._interpretClarity(90).includes('Brilliant clarity'));
      assert(magnus._interpretClarity(75).includes('Good clarity'));
      assert(magnus._interpretClarity(65).includes('Moderate clarity'));
      assert(magnus._interpretClarity(40).includes('Poor clarity'));
    });

    test('_interpretComplexity should provide appropriate interpretations', () => {
      assert(magnus._interpretComplexity(1).includes('Very simple'));
      assert(magnus._interpretComplexity(3).includes('Moderate'));
      assert(magnus._interpretComplexity(5).includes('Complex'));
      assert(magnus._interpretComplexity(7).includes('Very complex'));
      assert(magnus._interpretComplexity(10).includes('Extreme'));
    });
  });

  describe('Hermetic Principle Analysis', () => {
    test('_analyzeAllPrinciples should return all 4 principles', () => {
      const analysis = {
        understanding: { clarityScore: 80 },
        complexity: { overall: { score: 4 } }
      };

      const principles = magnus._analyzeAllPrinciples(analysis);

      assert.strictEqual(principles.length, 4);
      assert(principles.find(p => p.principle === 'POLARITY'));
      assert(principles.find(p => p.principle === 'RHYTHM'));
      assert(principles.find(p => p.principle === 'CAUSALITY'));
      assert(principles.find(p => p.principle === 'GENDER'));
    });

    test('_analyzePolaritySpectrums should calculate imbalance correctly', () => {
      const analysis = {
        understanding: { clarityScore: 90 },
        complexity: { overall: { score: 2 } }
      };

      const result = magnus._analyzePolaritySpectrums(analysis);

      assert(result.spectrums.length === 2);
      assert(result.spectrums[0].pole_a === 'Clarity');
      assert(result.spectrums[0].pole_b === 'Ambiguity');
      assert(typeof result.overallImbalance === 'number');
      assert(result.overallImbalance >= 0);
    });

    test('_analyzeWorkRhythm should determine rhythm based on velocity', () => {
      const analysis = {
        understanding: { clarityScore: 90 },
        complexity: { overall: { score: 2 } }
      };

      const result = magnus._analyzeWorkRhythm(analysis);

      assert(typeof result.estimatedVelocity === 'number');
      assert(['Fast', 'Moderate', 'Slow'].includes(result.rhythm));
      assert(typeof result.sessionCount === 'number');
      assert(result.sessionCount >= 1 && result.sessionCount <= 3);
    });

    test('_assessGenderedPhase should return current phase information', () => {
      const analysis = {};

      const result = magnus._assessGenderedPhase(analysis);

      assert.strictEqual(result.currentPhase, 'MASCULINE');
      assert(result.description.includes('Analysis phase'));
      assert.strictEqual(result.nextPhase, 'FEMININE');
      assert(result.phaseFlow.includes('Analysis → Synthesis'));
    });
  });

  describe('Convergence Validation', () => {
    test('validateConvergence should return disabled when validation is off', async () => {
      magnus.config.enableConvergenceValidation = false;
      const result = await magnus.validateConvergence('session-123', 'code', 'feedback');
      assert(result.convergenceValidationDisabled);
    });

    test('validateConvergence should handle invalid session', async () => {
      magnus.config.enableConvergenceValidation = true;
      magnus.coherence.resumeSession = async () => { throw new Error('Session not found'); };

      const result = await magnus.validateConvergence('invalid-session', 'code', 'feedback');
      assert(result.error);
      assert(result.message.includes('not found'));
    });

    test('validateConvergence should detect CONVERGED state', async () => {
      magnus.config.enableConvergenceValidation = true;
      magnus.coherence.resumeSession = async () => ({
        analysis: { understanding: { clarityScore: 80 }, complexity: { overall: { score: 4 } } }
      });

      const result = await magnus.validateConvergence('session-123', 'code', { recognition: 95, inevitability: 90 });
      assert.strictEqual(result.convergenceState, 'CONVERGED');
      assert(result.cycleClosed);
      assert.strictEqual(result.action, 'RECORD_AND_LEARN');
    });

    test('validateConvergence should detect NOT_CONVERGED state', async () => {
      magnus.config.enableConvergenceValidation = true;
      magnus.coherence.resumeSession = async () => ({
        analysis: { understanding: { clarityScore: 80 }, complexity: { overall: { score: 4 } } }
      });

      const result = await magnus.validateConvergence('session-123', 'code', { recognition: 30, inevitability: 20 });
      assert.strictEqual(result.convergenceState, 'NOT_CONVERGED');
      assert(!result.cycleClosed);
      assert.strictEqual(result.action, 'REANALYZE');
    });

    test('validateConvergence should handle missing analysis in session', async () => {
      magnus.config.enableConvergenceValidation = true;
      magnus.coherence.resumeSession = async () => ({ analysis: null });

      const result = await magnus.validateConvergence('session-123', 'code', 'feedback');
      assert(result.error);
      assert.strictEqual(result.reason, 'SESSION_ANALYSIS_MISSING');
    });

    test('recordConvergenceOutcome should handle CONVERGED state', async () => {
      magnus.learning.recordActual = async () => {};
      magnus.coherence.endSession = async () => {};

      const result = await magnus.recordConvergenceOutcome({
        sessionId: 'session-123',
        convergenceState: 'CONVERGED'
      }, {});

      assert.strictEqual(result.status, 'SESSION_CLOSED');
      assert.strictEqual(result.cycleState, 'COMPLETE');
      assert.strictEqual(result.action, 'READY_FOR_NEXT_REQUEST');
    });

    test('recordConvergenceOutcome should handle NOT_CONVERGED state', async () => {
      magnus.learning.recordFailure = async () => {};

      const result = await magnus.recordConvergenceOutcome({
        sessionId: 'session-123',
        convergenceState: 'NOT_CONVERGED'
      }, {});

      assert.strictEqual(result.status, 'REANALYSIS_NEEDED');
      assert.strictEqual(result.cycleState, 'OPEN');
      assert.strictEqual(result.action, 'RETURN_TO_PHASE_1_7');
    });

    test('recordConvergenceOutcome should handle PARTIALLY_CONVERGED state', async () => {
      const result = await magnus.recordConvergenceOutcome({
        sessionId: 'session-123',
        convergenceState: 'PARTIALLY_CONVERGED'
      }, {});

      assert.strictEqual(result.status, 'AWAITING_REFINEMENT');
      assert.strictEqual(result.cycleState, 'INCOMPLETE');
      assert.strictEqual(result.action, 'ITERATE_AND_REVALIDATE');
    });
  });

  describe('Helper Methods', () => {
    test('determineScope should map all complexity levels correctly', () => {
      assert.strictEqual(magnus.determineScope({ overall: { score: 1 } }), 'SIMPLE');
      assert.strictEqual(magnus.determineScope({ overall: { score: 3 } }), 'SIMPLE');
      assert.strictEqual(magnus.determineScope({ overall: { score: 4 } }), 'MODERATE');
      assert.strictEqual(magnus.determineScope({ overall: { score: 6 } }), 'COMPLEX');
      assert.strictEqual(magnus.determineScope({ overall: { score: 8 } }), 'EXPERT');
      assert.strictEqual(magnus.determineScope({ overall: { score: 10 } }), 'EXPERT');
    });

    test('selectHermeticStrategy should handle all complexity ranges', () => {
      assert.deepStrictEqual(magnus.selectHermeticStrategy({ complexity: { overall: { score: 1 } } }), { name: 'SINGLE_PASS_REVELATION' });
      assert.deepStrictEqual(magnus.selectHermeticStrategy({ complexity: { overall: { score: 3 } } }), { name: 'SINGLE_PASS_REVELATION' });
      assert.deepStrictEqual(magnus.selectHermeticStrategy({ complexity: { overall: { score: 5 } } }), { name: 'ITERATIVE_REVELATION' });
      assert.deepStrictEqual(magnus.selectHermeticStrategy({ complexity: { overall: { score: 7 } } }), { name: 'MODULAR_REVELATION' });
      assert.deepStrictEqual(magnus.selectHermeticStrategy({ complexity: { overall: { score: 9 } } }), { name: 'PHASED_REVELATION' });
    });

    test('_log should be callable without errors', () => {
      // _log just calls console.log, so we test it doesn't throw
      assert.doesNotThrow(() => magnus._log('test message'));
      assert.doesNotThrow(() => magnus._log(''));
      assert.doesNotThrow(() => magnus._log(null));
    });

    test('hermetic state should be initialized correctly', () => {
      assert.ok(magnus.hermetic);
      assert.strictEqual(magnus.hermetic.currentSession, null);
      assert.deepStrictEqual(magnus.hermetic.dominantPrinciples, []);
      assert.strictEqual(magnus.hermetic.convergenceState, null);
      assert.deepStrictEqual(magnus.hermetic.analysisLog, []);
    });

    test('hermetic state should update during analysis', async () => {
      // Mock the engines
      magnus.understanding.analyzeRequirements = () => ({ clarityScore: 80 });
      magnus.complexity.analyzeComplexity = () => ({});
      magnus.complexity.calculateOverallComplexity = () => ({ overall: { score: 4 } });
      magnus.learning.getRecommendations = () => ({ available: true, recommendations: [] });

      await magnus.analyze('test');

      assert.ok(magnus.hermetic.dominantPrinciples.length > 0);
      assert.strictEqual(magnus.hermetic.convergenceState, 'READY');
    });
  });

  describe('Report Generation', () => {
    test('generateReport should create basic report structure', () => {
      const analysis = {
        request: 'Test request',
        understanding: { clarityScore: 85 },
        complexity: { overall: { score: 4 } },
        recommendation: 'GENERATE',
        errors: []
      };

      const report = magnus.generateReport(analysis);

      assert(report.timestamp);
      assert.strictEqual(report.request, 'Test request');
      assert.strictEqual(report.analysis.clarity, 85);
      assert.strictEqual(report.analysis.complexity, 4);
      assert.strictEqual(report.analysis.decision, 'GENERATE');
      assert.deepStrictEqual(report.analysis.errors, []);
    });

    test('generateReport should handle convergence analysis', () => {
      const analysis = { request: 'Test' };
      const convergenceAnalysis = {
        convergenceState: 'CONVERGED',
        metrics: { recognitionScore: 95 }
      };

      const report = magnus.generateReport(analysis, convergenceAnalysis);

      assert.strictEqual(report.convergence.convergenceState, 'CONVERGED');
      assert.strictEqual(report.convergence.metrics.recognitionScore, 95);
    });
  });

  describe('Integration Tests', () => {
    let magnus;

    beforeEach(async () => {
      magnus = new Magnus132Hermetic();

      // Mock engines for integration testing
      magnus.understanding.analyzeRequirements = (request) => ({
        clarityScore: 75,
        ambiguities: [],
        assumptions: [],
        risks: [],
        clarityScore: 75  // duplicate is OK, for emphasis
      });

      magnus.complexity.analyzeComplexity = (request) => ({
        dimensions: {
          domain: { score: 5, level: 'MODERATE' },
          technical: { score: 5, level: 'MODERATE' },
          integration: { score: 3, level: 'LOW' },
          scale: { score: 4, level: 'MODERATE' },
          novelty: { score: 2, level: 'LOW' }
        }
      });
      magnus.complexity.calculateOverallComplexity = (result) => ({
        overall: { score: 5, level: 'MODERATE' },
        bottleneck: { dimension: 'technical', severity: 'MEDIUM' },
        dimensions: {
          domain: { score: 5, level: 'MODERATE', warning: null },
          technical: { score: 5, level: 'MODERATE', warning: null },
          integration: { score: 3, level: 'LOW', warning: null },
          scale: { score: 4, level: 'MODERATE', warning: null },
          novelty: { score: 2, level: 'LOW', warning: null }
        }
      });

      magnus.learning.getRecommendations = () => ({
        available: true,
        recommendations: [
          { type: 'PATTERN', pattern: 'iterative', probability: 0.8 }
        ]
      });

      await magnus.initialize();
    });

    test('analyze() should complete full flow and return proper structure', async () => {
      const request = 'Test analysis request';
      const result = await magnus.analyze(request);

      assert.ok(result);
      assert.strictEqual(result.request, request);
      assert.ok(result.understanding);
      assert.strictEqual(result.understanding.clarityScore, 75);
      assert.ok(result.complexity);
      assert.strictEqual(result.complexity.overall.score, 5);
      assert.ok(result.recommendation);
      assert.ok(result.canProceed);
      assert.ok(result.convergenceReady);
    });

    test('startGeneration() should initialize generation session', async () => {
      const analysis = {
        request: 'Test request',
        canProceed: true,
        complexity: { overall: { score: 4 } },
        understanding: { clarityScore: 80 }
      };

      magnus.coherence.startSession = async () => ({ id: 'test-session-123' });

      const result = await magnus.startGeneration(analysis);

      assert.ok(result);
      assert.strictEqual(result.sessionId, 'test-session-123');
      assert.ok(result.strategy);
      assert.strictEqual(result.phase, 'GENERATION');
    });

    test('validateConvergence() should validate and return convergence analysis', async () => {
      const sessionId = 'test-session-123';
      const generatedCode = 'console.log("test");';
      const feedback = { text: 'Perfect!', recognition: 95, inevitability: 90 };

      const mockAnalysis = {
        understanding: { clarityScore: 80 },
        complexity: { overall: { score: 4 } }
      };

      magnus.coherence.resumeSession = async () => ({ analysis: mockAnalysis });

      const result = await magnus.validateConvergence(sessionId, generatedCode, feedback);

      assert.ok(result);
      assert.strictEqual(result.sessionId, sessionId);
      assert.ok(result.metrics);
      assert.ok(result.convergenceState);
      assert.ok(result.revelationCheck);
    });

    test('analyze() should handle invalid request input', async () => {
      await assert.rejects(async () => {
        await magnus.analyze('');
      }, /Request must be a non-empty string/);

      await assert.rejects(async () => {
        await magnus.analyze(null);
      }, /Request must be a non-empty string/);

      await assert.rejects(async () => {
        await magnus.analyze(123);
      }, /Request must be a non-empty string/);
    });

    test('analyze() should handle phase errors gracefully', async () => {
      magnus.understanding.analyzeRequirements = () => { throw new Error('Phase 1 error'); };

      const result = await magnus.analyze('test request');
      assert.ok(result.errors);
      assert(result.errors.length > 0);
      assert(result.errors[0].phase === 1);
    });

    test('startGeneration() should reject when analysis cannot proceed', async () => {
      const badAnalysis = { canProceed: false };

      await assert.rejects(async () => {
        await magnus.startGeneration(badAnalysis);
      }, /Cannot start generation/);
    });

    test('analyze() should complete full flow with low clarity', async () => {
      // Mock low clarity
      magnus.understanding.analyzeRequirements = () => ({
        clarityScore: 50,
        ambiguities: [],
        assumptions: [],
        risks: []
      });

      magnus.complexity.analyzeComplexity = () => ({});
      magnus.complexity.calculateOverallComplexity = () => ({
        overall: { score: 3 }
      });

      const result = await magnus.analyze('unclear request');
      assert.strictEqual(result.recommendation, 'CLARIFY');
      assert(!result.canProceed);
    });

    test('initialize() should handle engine initialization failures', async () => {
      // Create a fresh instance for this test
      const testMagnus = new Magnus132Hermetic();
      testMagnus.learning.initialize = async () => { throw new Error('Learning init failed'); };

      await assert.rejects(async () => {
        await testMagnus.initialize();
      }, /Learning init failed/);

      assert(!testMagnus.initialized);
    });

    test('startGeneration() should handle session creation failures', async () => {
      const analysis = { canProceed: true, complexity: { overall: { score: 4 } } };
      magnus.coherence.startSession = async () => { throw new Error('Session creation failed'); };

      await assert.rejects(async () => {
        await magnus.startGeneration(analysis);
      }, /Session creation failed/);
    });

    test('recordConvergenceOutcome() should handle learning engine failures', async () => {
      magnus.learning.recordActual = async () => { throw new Error('Learning failed'); };

      await assert.rejects(async () => {
        await magnus.recordConvergenceOutcome({
          sessionId: 'session-123',
          convergenceState: 'CONVERGED'
        }, {});
      }, /Learning failed/);
    });
  });
});