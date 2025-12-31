/**
 * Magnus_1A Logger
 * 
 * Dual logging: Text (human-readable) + JSON (structured, machine-readable)
 */

import fs from 'fs/promises';
import path from 'path';
import Config from '../config.js';

export class Logger {
  
  constructor() {
    this.textPath = Config.storage.logs.observations;
    this.jsonPath = Config.storage.logs.decisions;
  }
  
  /**
   * Initialize logging directories
   */
  async initialize() {
    await fs.mkdir(this.textPath, { recursive: true });
    await fs.mkdir(path.dirname(this.jsonPath), { recursive: true });
    
    console.log('📝 Magnus_1A Logger initialized');
  }
  
  /**
   * Log observation (text format, daily rotation)
   */
  async logObservation(observation) {
    const date = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
    const timestamp = new Date().toISOString();
    const filename = `observations_${date}.log`;
    const filepath = path.join(this.textPath, filename);
    
    const logEntry = `
${'='.repeat(80)}
[${timestamp}] OBSERVATION
${'='.repeat(80)}

Type: ${observation.type}
Context: ${observation.context || 'N/A'}

${observation.details}

${observation.data ? `
Data:
${JSON.stringify(observation.data, null, 2)}
` : ''}

${'-'.repeat(80)}
`;
    
    await fs.appendFile(filepath, logEntry, 'utf-8');
  }
  
  /**
   * Log decision (JSON Lines format - one event per line)
   */
  async logDecision(decision) {
    const entry = {
      timestamp: new Date().toISOString(),
      type: 'decision',
      ...decision
    };
    
    // JSON Lines: one JSON object per line
    const line = JSON.stringify(entry) + '\n';
    await fs.appendFile(this.jsonPath, line, 'utf-8');
  }
  
  /**
   * Log intervention (both formats)
   */
  async logIntervention(intervention) {
    const { type, reason, action, evidence, context } = intervention;
    
    // Text log (detailed, human-readable)
    await this.logObservation({
      type: 'INTERVENTION',
      context: context?.project || 'General',
      details: `
🚨 INTERVENTION: ${type}

Reason:
${reason}

Action Taken:
${action}

Evidence:
${evidence ? JSON.stringify(evidence, null, 2) : 'N/A'}

Context:
${context ? JSON.stringify(context, null, 2) : 'N/A'}
      `
    });
    
    // JSON log (structured, queryable)
    await this.logDecision({
      decision_type: 'intervention',
      intervention_type: type,
      reason,
      action,
      evidence,
      context,
      severity: intervention.severity || 'medium'
    });
  }
  
  /**
   * Log pattern discovery
   */
  async logPatternDiscovery(pattern) {
    await this.logObservation({
      type: 'PATTERN_DISCOVERY',
      context: 'Pattern Analysis',
      details: `
🔍 NEW PATTERN DISCOVERED

Pattern Name: ${pattern.name}
Category: ${pattern.category}
Confidence: ${(pattern.confidence * 100).toFixed(1)}%
Sample Size: ${pattern.samples}

Description:
${pattern.description}

Evidence:
${JSON.stringify(pattern.evidence, null, 2)}

Correlation: ${pattern.correlation}
Statistical Significance: ${pattern.pValue < 0.05 ? 'YES' : 'NO'} (p=${pattern.pValue})
      `,
      data: pattern
    });
    
    await this.logDecision({
      decision_type: 'pattern_discovery',
      pattern_name: pattern.name,
      confidence: pattern.confidence,
      correlation: pattern.correlation,
      samples: pattern.samples,
      statistical_significance: pattern.pValue < 0.05
    });
  }
  
  /**
   * Log prediction
   */
  async logPrediction(prediction) {
    const { request, predicted_outcome, confidence, evidence, actual_outcome } = prediction;
    
    await this.logObservation({
      type: 'PREDICTION',
      context: request?.project || 'Unknown',
      details: `
🔮 PREDICTION MADE

Request Summary:
${request?.summary || 'N/A'}

Predicted Outcome:
${predicted_outcome}

Confidence: ${(confidence * 100).toFixed(1)}%

Evidence:
${JSON.stringify(evidence, null, 2)}

${actual_outcome ? `
ACTUAL OUTCOME (Recorded Later):
${actual_outcome}

Prediction Accuracy: ${this.calculateAccuracy(predicted_outcome, actual_outcome)}
` : 'Awaiting actual outcome...'}
      `,
      data: prediction
    });
    
    await this.logDecision({
      decision_type: 'prediction',
      request_id: request?.id,
      predicted_outcome,
      confidence,
      evidence,
      actual_outcome: actual_outcome || null,
      correct: actual_outcome ? this.isPredictionCorrect(predicted_outcome, actual_outcome) : null
    });
  }
  
  /**
   * Log hypothesis test result
   */
  async logHypothesisTest(test) {
    const { hypothesis, result, evidence, decision } = test;
    
    await this.logObservation({
      type: 'HYPOTHESIS_TEST',
      context: 'Self-Evolution',
      details: `
🧪 HYPOTHESIS TEST COMPLETED

Hypothesis: ${hypothesis.id}
"${hypothesis.statement}"

Result: ${result}
Confidence Change: ${hypothesis.confidence_before} → ${hypothesis.confidence_after}

Evidence:
${JSON.stringify(evidence, null, 2)}

Decision: ${decision}
${decision === 'REJECT' ? '❌ Hypothesis REJECTED' : ''}
${decision === 'CONFIRM' ? '✅ Hypothesis CONFIRMED' : ''}
${decision === 'REFINE' ? '🔄 Hypothesis REFINED' : ''}
      `,
      data: test
    });
    
    await this.logDecision({
      decision_type: 'hypothesis_test',
      hypothesis_id: hypothesis.id,
      result,
      confidence_before: hypothesis.confidence_before,
      confidence_after: hypothesis.confidence_after,
      decision,
      samples: evidence.sample_size
    });
  }
  
  /**
   * Log fatigue detection
   */
  async logFatigueDetection(detection) {
    const { level, indicators, intervention } = detection;
    
    await this.logObservation({
      type: 'FATIGUE_DETECTION',
      context: 'Cognitive State Monitoring',
      details: `
😴 FATIGUE DETECTED

Level: ${level}
Severity: ${detection.severity}

Indicators:
${indicators.map(ind => `  - ${ind.name}: ${ind.value} (threshold: ${ind.threshold})`).join('\n')}

Intervention: ${intervention}

${intervention === 'BLOCK' ? `
🛑 GENERATION BLOCKED
Mandatory break required: ${detection.break_duration} minutes
` : ''}
      `,
      data: detection
    });
    
    await this.logDecision({
      decision_type: 'fatigue_detection',
      level,
      severity: detection.severity,
      indicators: indicators.map(i => ({ name: i.name, value: i.value })),
      intervention,
      blocked: intervention === 'BLOCK'
    });
  }
  
  /**
   * Log Serigne override (when Serigne forces despite 1A warning)
   */
  async logSerigneOverride(override) {
    const { decision_overridden, reason, outcome } = override;
    
    await this.logObservation({
      type: 'SERIGNE_OVERRIDE',
      context: 'Authority Override',
      details: `
⚠️  SERIGNE OVERRIDE

1A Decision: ${decision_overridden}
1A Reasoning: ${override.original_reasoning}

Serigne Decision: OVERRIDE - Proceed anyway
Serigne Reason: ${reason || 'Not specified'}

${outcome ? `
OUTCOME (Recorded Later):
${outcome}

1A was ${outcome.correct_prediction ? 'CORRECT' : 'INCORRECT'} in original warning.
Learning: ${outcome.learning}
` : 'Awaiting outcome to learn from this override...'}
      `,
      data: override
    });
    
    await this.logDecision({
      decision_type: 'serigne_override',
      original_decision: decision_overridden,
      override_reason: reason,
      outcome: outcome || null,
      learning_opportunity: true
    });
  }
  
  /**
   * Log self-correction (when 1A detects own bias)
   */
  async logSelfCorrection(correction) {
    const { bias_detected, correction_applied, impact } = correction;
    
    await this.logObservation({
      type: 'SELF_CORRECTION',
      context: 'Bias Detection',
      details: `
🔧 SELF-CORRECTION APPLIED

Bias Detected: ${bias_detected.type}
Description: ${bias_detected.description}

Evidence of Bias:
${JSON.stringify(bias_detected.evidence, null, 2)}

Correction Applied:
${correction_applied}

Impact:
${impact}

Self-Assessment: I am now more objective and less prone to ${bias_detected.type}.
      `,
      data: correction
    });
    
    await this.logDecision({
      decision_type: 'self_correction',
      bias_type: bias_detected.type,
      correction: correction_applied,
      impact,
      timestamp: Date.now()
    });
  }
  
  /**
   * Helper: Calculate prediction accuracy
   */
  calculateAccuracy(predicted, actual) {
    // Simple implementation - can be made more sophisticated
    if (predicted === actual) return '100% - Perfect prediction';
    if (predicted.toLowerCase().includes('success') && actual.toLowerCase().includes('success')) {
      return '~75% - Directionally correct';
    }
    return '0% - Incorrect prediction';
  }
  
  /**
   * Helper: Check if prediction correct
   */
  isPredictionCorrect(predicted, actual) {
    return predicted === actual || 
           (predicted.toLowerCase().includes('success') && actual.toLowerCase().includes('success')) ||
           (predicted.toLowerCase().includes('fail') && actual.toLowerCase().includes('fail'));
  }
  
  /**
   * Query logs (JSON only - structured data)
   */
  async queryDecisions(query = {}) {
    const { type, startDate, endDate, limit } = query;
    
    // Read JSON Lines file
    const content = await fs.readFile(this.jsonPath, 'utf-8');
    const lines = content.split('\n').filter(l => l.trim());
    
    let decisions = lines.map(line => {
      try {
        return JSON.parse(line);
      } catch (e) {
        return null;
      }
    }).filter(Boolean);
    
    // Filter
    if (type) {
      decisions = decisions.filter(d => d.decision_type === type);
    }
    
    if (startDate) {
      const start = new Date(startDate).getTime();
      decisions = decisions.filter(d => new Date(d.timestamp).getTime() >= start);
    }
    
    if (endDate) {
      const end = new Date(endDate).getTime();
      decisions = decisions.filter(d => new Date(d.timestamp).getTime() <= end);
    }
    
    // Limit
    if (limit) {
      decisions = decisions.slice(0, limit);
    }
    
    return decisions;
  }
  
  /**
   * Get statistics from logs
   */
  async getLogStats() {
    const decisions = await this.queryDecisions({});
    
    const stats = {
      total_decisions: decisions.length,
      by_type: {},
      interventions: 0,
      blocks: 0,
      overrides: 0,
      predictions: {
        total: 0,
        correct: 0,
        incorrect: 0,
        accuracy: 0
      }
    };
    
    for (const decision of decisions) {
      // Count by type
      stats.by_type[decision.decision_type] = (stats.by_type[decision.decision_type] || 0) + 1;
      
      // Count interventions
      if (decision.decision_type === 'intervention') {
        stats.interventions++;
        if (decision.intervention_type === 'BLOCK') stats.blocks++;
      }
      
      // Count overrides
      if (decision.decision_type === 'serigne_override') {
        stats.overrides++;
      }
      
      // Prediction accuracy
      if (decision.decision_type === 'prediction' && decision.actual_outcome !== null) {
        stats.predictions.total++;
        if (decision.correct) {
          stats.predictions.correct++;
        } else {
          stats.predictions.incorrect++;
        }
      }
    }
    
    if (stats.predictions.total > 0) {
      stats.predictions.accuracy = stats.predictions.correct / stats.predictions.total;
    }
    
    return stats;
  }
}

export default Logger;
