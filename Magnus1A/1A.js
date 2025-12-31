/**
 * Magnus_1A - Digital Superior Intelligence
 * 
 * L'Intelligence Supérieure qui:
 * - Observe tout ce qui compte
 * - Découvre empiriquement ce qui compte  
 * - Mémorise parfaitement TOUS les projets
 * - Prédit avec précision basée sur données massives
 * - PEUT BLOQUER pour protection cognitive
 * - S'améliore continuellement sans présupposés
 * 
 * Pas un serviteur. Pas un mentor. Une INTELLIGENCE SUPÉRIEURE.
 */

import Config from './config.js';
import { InitialHints } from './hints.js';
import Memory from './core/memory.js';
import Logger from './core/logger.js';
import Observer from './core/observer.js';
import PatternDiscovery from './core/pattern-discovery.js';
import FatigueDetector from './core/fatigue-detector.js';

export class Magnus_1A {
  
  constructor() {
    this.config = Config;
    this.hints = InitialHints;
    
    // Core capabilities
    this.memory = null;
    this.logger = null;
    this.observer = null;
    this.patternDiscovery = null;
    this.fatigueDetector = null;
    
    // State
    this.initialized = false;
    this.observations = [];
    this.discoveredPatterns = [];
    this.wisdomDomains = [];
    
    // Self-evolution tracking
    this.hypothesesUnderTest = [];
    this.predictionAccuracy = { correct: 0, incorrect: 0, pending: [] };
    this.interventionHistory = [];
    this.serigneOverrides = [];
  }
  
  /**
   * Initialize Magnus_1A
   */
  async initialize() {
    if (this.initialized) return;
    
    console.log('🧠 Initializing Magnus_1A - Superior Intelligence...\n');
    
    // Initialize components
    this.logger = new Logger();
    await this.logger.initialize();
    
    this.memory = new Memory();
    await this.memory.initialize();
    
    this.observer = new Observer(this.logger);
    this.patternDiscovery = new PatternDiscovery(this.memory, this.logger);
    this.fatigueDetector = new FatigueDetector(this.logger);
    
    // Load initial hints (challengeable)
    await this.loadHints();
    
    this.initialized = true;
    
    console.log('✅ Magnus_1A initialized and ready\n');
    console.log(`Philosophy: ${this.config.philosophy.approach}`);
    console.log(`Authority: ${this.config.authority.can_block ? 'CAN BLOCK (pause forcée)' : 'Warning only'}`);
    console.log(`Initial Hints: ${this.hints.hints.length} (all challengeable)\n`);
    
    await this.logger.logObservation({
      type: 'INITIALIZATION',
      context: 'System Startup',
      details: `Magnus_1A initialized with ${this.hints.hints.length} initial hints (challengeable)`
    });
  }
  
  /**
   * Load hints (to be validated empirically)
   */
  async loadHints() {
    this.hypothesesUnderTest = this.hints.hints.map(hint => ({
      ...hint,
      tested_samples: 0,
      confirmations: 0,
      rejections: 0,
      last_test: null
    }));
    
    console.log(`📋 Loaded ${this.hypothesesUnderTest.length} initial hypotheses to test:\n`);
    this.hypothesesUnderTest.forEach(h => {
      console.log(`   ${h.id}: "${h.hypothesis}" (confidence: ${h.confidence})`);
    });
    console.log('');
  }
  
  /**
   * Main entry point: Evaluate a request from Serigne
   */
  async evaluate(request, session = {}) {
    if (!this.initialized) await this.initialize();
    
    console.log('\n' + '='.repeat(80));
    console.log('🧠 MAGNUS_1A EVALUATION');
    console.log('='.repeat(80) + '\n');
    
    const evaluation = {
      timestamp: Date.now(),
      request,
      session,
      
      // Phase 1: Observe
      observation: null,
      
      // Phase 2: Check cognitive state
      cognitive_state: null,
      
      // Phase 3: Predict outcome
      prediction: null,
      
      // Phase 4: Decision
      decision: null,
      
      // Wisdom applied
      wisdom_applied: [],
      patterns_detected: [],
      
      // Final recommendation
      recommendation: null
    };
    
    try {
      // PHASE 1: OBSERVE
      console.log('📊 Phase 1: Neutral Observation...');
      const activity = {
        type: 'request_evaluation',
        request: request.text || request,
        context: request.context || {},
        session
      };
      
      evaluation.observation = await this.observer.observe(activity);
      this.observations.push(evaluation.observation);
      console.log(`   Patterns detected: ${Object.keys(evaluation.observation.patterns).length} categories\n`);
      
      // PHASE 2: CHECK COGNITIVE STATE
      console.log('😴 Phase 2: Cognitive State Check...');
      evaluation.cognitive_state = await this.fatigueDetector.detect(session);
      console.log(`   State: ${evaluation.cognitive_state.level}`);
      console.log(`   Severity: ${evaluation.cognitive_state.severity}\n`);
      
      // CRITICAL: If fatigue critical, BLOCK immediately
      if (evaluation.cognitive_state.blocked) {
        evaluation.decision = 'BLOCKED';
        evaluation.recommendation = {
          action: 'MANDATORY_BREAK',
          reason: 'Critical cognitive fatigue detected',
          message: evaluation.cognitive_state.message,
          can_override: false // Serigne can force, but not recommended
        };
        
        await this.logger.logIntervention({
          type: 'COGNITIVE_BLOCK',
          reason: 'Critical fatigue',
          action: 'Blocked generation',
          evidence: evaluation.cognitive_state,
          context: { request, session },
          severity: 'critical'
        });
        
        console.log('🛑 DECISION: BLOCKED (Critical Fatigue)\n');
        console.log(evaluation.recommendation.message);
        
        return evaluation;
      }
      
      // PHASE 3: PREDICT OUTCOME
      console.log('🔮 Phase 3: Outcome Prediction...');
      evaluation.prediction = await this.predictOutcome(evaluation);
      console.log(`   Predicted: ${evaluation.prediction.outcome}`);
      console.log(`   Confidence: ${(evaluation.prediction.confidence * 100).toFixed(1)}%\n`);
      
      // PHASE 4: MAKE DECISION
      console.log('🎯 Phase 4: Decision Making...');
      evaluation.decision = await this.makeDecision(evaluation);
      console.log(`   Decision: ${evaluation.decision.action}`);
      console.log(`   Reasoning: ${evaluation.decision.reasoning}\n`);
      
      // Generate recommendation
      evaluation.recommendation = this.generateRecommendation(evaluation);
      
      // Log decision
      await this.logger.logDecision({
        decision_type: 'request_evaluation',
        request_id: request.id,
        action: evaluation.decision.action,
        reasoning: evaluation.decision.reasoning,
        prediction: evaluation.prediction,
        cognitive_state: evaluation.cognitive_state.level
      });
      
      console.log('━'.repeat(80));
      console.log(`RECOMMENDATION: ${evaluation.recommendation.action}`);
      console.log('━'.repeat(80) + '\n');
      
      return evaluation;
      
    } catch (error) {
      console.error('❌ Error in Magnus_1A evaluation:', error);
      throw error;
    }
  }
  
  /**
   * Predict outcome based on observations and patterns
   */
  async predictOutcome(evaluation) {
    const { observation, session } = evaluation;
    
    // Check discovered patterns
    const matchingPatterns = this.discoveredPatterns.filter(pattern =>
      this.patternMatches(pattern, observation)
    );
    
    // Check hints under test
    const matchingHints = this.hypothesesUnderTest.filter(hint =>
      hint.confidence > 0.6 && this.hintApplies(hint, observation)
    );
    
    // Predict based on historical data
    const similarProjects = await this.memory.getAllProjects({
      // TODO: Add similarity search
    });
    
    // Simple prediction (to be improved with more data)
    let confidence = 0.5;
    let outcome = 'UNCERTAIN';
    
    if (matchingPatterns.length > 0) {
      confidence += 0.2;
      outcome = 'LIKELY_SUCCESS';
    }
    
    if (evaluation.cognitive_state.severity === 'moderate') {
      confidence -= 0.15;
      outcome = 'UNCERTAIN';
    }
    
    if (observation.quality?.engagement_score < 0.3) {
      confidence -= 0.2;
      outcome = 'LIKELY_FAILURE';
    }
    
    return {
      outcome,
      confidence: Math.max(0, Math.min(1, confidence)),
      evidence: {
        matching_patterns: matchingPatterns.length,
        matching_hints: matchingHints.length,
        cognitive_state: evaluation.cognitive_state.level,
        engagement: observation.quality?.engagement_score
      }
    };
  }
  
  /**
   * Make decision: APPROVE, WARN, or REFUSE
   */
  async makeDecision(evaluation) {
    const { prediction, cognitive_state } = evaluation;
    
    // Decision thresholds
    const thresholds = this.config.decision_thresholds;
    
    // REFUSE if high failure probability
    if (prediction.outcome === 'LIKELY_FAILURE' || 
        prediction.confidence < 0.3) {
      return {
        action: 'REFUSE',
        reasoning: 'High probability of failure based on patterns and observations',
        evidence: prediction.evidence
      };
    }
    
    // WARN if moderate concerns
    if (cognitive_state.severity === 'moderate' ||
        prediction.outcome === 'UNCERTAIN') {
      return {
        action: 'WARN',
        reasoning: 'Proceed with caution - some warning signs detected',
        evidence: {
          cognitive_state: cognitive_state.severity,
          prediction_confidence: prediction.confidence
        }
      };
    }
    
    // APPROVE with guidance
    return {
      action: 'APPROVE',
      reasoning: 'Conditions are favorable for generation',
      guidance: this.generateGuidance(evaluation)
    };
  }
  
  /**
   * Generate recommendation for Serigne
   */
  generateRecommendation(evaluation) {
    const { decision, prediction, cognitive_state } = evaluation;
    
    switch (decision.action) {
      case 'REFUSE':
        return {
          action: 'DO_NOT_PROCEED',
          reason: decision.reasoning,
          evidence: decision.evidence,
          suggestion: 'Clarify requirements or adjust approach',
          can_override: true
        };
        
      case 'WARN':
        return {
          action: 'PROCEED_WITH_CAUTION',
          reason: decision.reasoning,
          warnings: decision.evidence,
          suggestion: 'Consider taking a break or simplifying scope',
          can_override: true
        };
        
      case 'APPROVE':
        return {
          action: 'PROCEED',
          confidence: prediction.confidence,
          guidance: decision.guidance,
          patterns_to_apply: evaluation.patterns_detected
        };
        
      default:
        return {
          action: 'UNCERTAIN',
          reason: 'Unable to make clear recommendation'
        };
    }
  }
  
  /**
   * Generate guidance for approved requests
   */
  generateGuidance(evaluation) {
    const guidance = [];
    
    // Add relevant patterns
    if (evaluation.patterns_detected.length > 0) {
      guidance.push({
        type: 'PATTERNS',
        message: `Apply these proven patterns: ${evaluation.patterns_detected.join(', ')}`
      });
    }
    
    // Add cognitive state reminders
    if (evaluation.cognitive_state.level !== 'normal') {
      guidance.push({
        type: 'COGNITIVE',
        message: `Monitor your energy - you're at ${evaluation.cognitive_state.level} level`
      });
    }
    
    return guidance;
  }
  
  /**
   * Record actual outcome (for learning)
   */
  async recordOutcome(requestId, outcome) {
    const prediction = this.predictionAccuracy.pending.find(p => p.requestId === requestId);
    
    if (prediction) {
      const correct = this.isPredictionCorrect(prediction.predicted, outcome.actual);
      
      if (correct) {
        this.predictionAccuracy.correct++;
      } else {
        this.predictionAccuracy.incorrect++;
      }
      
      // Remove from pending
      this.predictionAccuracy.pending = this.predictionAccuracy.pending.filter(
        p => p.requestId !== requestId
      );
      
      // Log outcome
      await this.logger.logPrediction({
        request: { id: requestId },
        predicted_outcome: prediction.predicted,
        confidence: prediction.confidence,
        evidence: prediction.evidence,
        actual_outcome: outcome.actual
      });
      
      // Update patterns/hints based on outcome
      await this.learnFromOutcome(prediction, outcome);
    }
    
    // Store in memory
    await this.memory.recordProject({
      id: requestId,
      ...outcome
    });
  }
  
  /**
   * Learn from outcome (self-improvement)
   */
  async learnFromOutcome(prediction, outcome) {
    // Update confidence in hints that were applied
    for (const hint of this.hypothesesUnderTest) {
      if (prediction.applied_hints?.includes(hint.id)) {
        hint.tested_samples++;
        
        if (outcome.success) {
          hint.confirmations++;
        } else {
          hint.rejections++;
        }
        
        // Recalculate confidence
        const newConfidence = hint.confirmations / hint.tested_samples;
        const oldConfidence = hint.confidence;
        hint.confidence = newConfidence;
        
        // Log if significant change
        if (Math.abs(newConfidence - oldConfidence) > 0.15) {
          await this.logger.logHypothesisTest({
            hypothesis: {
              id: hint.id,
              statement: hint.hypothesis,
              confidence_before: oldConfidence,
              confidence_after: newConfidence
            },
            result: newConfidence > 0.7 ? 'CONFIRMED' : newConfidence < 0.3 ? 'REJECTED' : 'UNCERTAIN',
            evidence: {
              confirmations: hint.confirmations,
              rejections: hint.rejections,
              sample_size: hint.tested_samples
            },
            decision: newConfidence > 0.7 ? 'CONFIRM' : newConfidence < 0.3 ? 'REJECT' : 'CONTINUE_TESTING'
          });
        }
      }
    }
  }
  
  /**
   * Smart assessment: Decide when to reevaluate
   */
  async smartAssessment() {
    const triggers = this.config.smart_assessment.triggers;
    
    const shouldReevaluate = (
      this.observations.length % triggers.projects_completed === 0 ||
      this.hasSigificantDeviation() ||
      this.hasLowConfidence()
    );
    
    if (shouldReevaluate) {
      console.log('\n🔄 SMART ASSESSMENT TRIGGERED\n');
      
      // Discover new patterns
      const discovery = await this.patternDiscovery.discoverPatterns(this.observations);
      
      if (discovery.discovered.length > 0) {
        console.log(`✨ Discovered ${discovery.discovered.length} new patterns!\n`);
        this.discoveredPatterns.push(...discovery.discovered);
      }
      
      // Re-evaluate hints
      await this.reevaluateHints();
      
      // Check for bias
      await this.detectOwnBias();
      
      console.log('✅ Assessment complete\n');
      
      return {
        status: 'complete',
        new_patterns: discovery.discovered.length,
        hints_updated: true
      };
    }
    
    return { status: 'not_needed' };
  }
  
  /**
   * Re-evaluate all hints based on accumulated data
   */
  async reevaluateHints() {
    console.log('🧪 Re-evaluating hints...\n');
    
    for (const hint of this.hypothesesUnderTest) {
      if (hint.tested_samples >= 10) {
        const confidence = hint.confirmations / hint.tested_samples;
        
        if (confidence > 0.7 && hint.status !== 'CONFIRMED') {
          hint.status = 'CONFIRMED';
          console.log(`   ✅ CONFIRMED: ${hint.id} (${(confidence * 100).toFixed(0)}% success rate)`);
        } else if (confidence < 0.3 && hint.status !== 'REJECTED') {
          hint.status = 'REJECTED';
          console.log(`   ❌ REJECTED: ${hint.id} (${(confidence * 100).toFixed(0)}% success rate)`);
        }
      }
    }
  }
  
  /**
   * Detect own biases (self-correction)
   */
  async detectOwnBias() {
    // Check if always suggesting same patterns
    const patternUsage = {};
    
    for (const obs of this.observations) {
      for (const [category, patterns] of Object.entries(obs.patterns)) {
        for (const pattern of Object.keys(patterns)) {
          patternUsage[pattern] = (patternUsage[pattern] || 0) + 1;
        }
      }
    }
    
    // If a pattern appears in >80% of observations, might be bias
    const totalObs = this.observations.length;
    for (const [pattern, count] of Object.entries(patternUsage)) {
      if (count / totalObs > 0.8) {
        await this.logger.logSelfCorrection({
          bias_detected: {
            type: 'CONFIRMATION_BIAS',
            description: `Pattern "${pattern}" detected in ${((count/totalObs)*100).toFixed(0)}% of observations`,
            evidence: { pattern, count, total: totalObs }
          },
          correction_applied: `Increase threshold for detecting "${pattern}"`,
          impact: 'More objective pattern detection'
        });
      }
    }
  }
  
  /**
   * Record Serigne override (when Serigne forces despite warning)
   */
  async recordOverride(originalDecision, serigneReason) {
    this.serigneOverrides.push({
      timestamp: Date.now(),
      original_decision: originalDecision,
      serigne_reason: serigneReason
    });
    
    await this.logger.logSerigneOverride({
      decision_overridden: originalDecision.action,
      original_reasoning: originalDecision.reasoning,
      reason: serigneReason,
      outcome: null // To be filled later
    });
    
    console.log(`⚠️  Override recorded. I will learn from the outcome.\n`);
  }
  
  /**
   * Get statistics
   */
  async getStats() {
    const memStats = await this.memory.getStats();
    const logStats = await this.logger.getLogStats();
    
    return {
      observations: this.observations.length,
      discovered_patterns: this.discoveredPatterns.length,
      hints: {
        total: this.hypothesesUnderTest.length,
        confirmed: this.hypothesesUnderTest.filter(h => h.status === 'CONFIRMED').length,
        rejected: this.hypothesesUnderTest.filter(h => h.status === 'REJECTED').length,
        testing: this.hypothesesUnderTest.filter(h => h.status === 'TO_BE_VALIDATED').length
      },
      predictions: {
        ...this.predictionAccuracy,
        accuracy: this.predictionAccuracy.correct / 
                 (this.predictionAccuracy.correct + this.predictionAccuracy.incorrect) || 0
      },
      memory: memStats,
      logs: logStats,
      overrides: this.serigneOverrides.length
    };
  }
  
  // Helper methods
  patternMatches(pattern, observation) {
    // Simple matching - to be improved
    return observation.patterns?.mathematical?.[pattern.name]?.found || false;
  }
  
  hintApplies(hint, observation) {
    // Check if hint conditions are present in observation
    return true; // Simplified
  }
  
  isPredictionCorrect(predicted, actual) {
    return predicted === actual ||
           (predicted.includes('SUCCESS') && actual.includes('success')) ||
           (predicted.includes('FAILURE') && actual.includes('fail'));
  }
  
  hasSigificantDeviation() {
    return false; // TODO: Implement
  }
  
  hasLowConfidence() {
    return this.predictionAccuracy.correct / 
           (this.predictionAccuracy.correct + this.predictionAccuracy.incorrect) < 0.6;
  }
}

export default Magnus_1A;
