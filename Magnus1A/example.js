/**
 * Magnus_1A Usage Example
 * 
 * Démonstration de l'utilisation de Magnus_1A - Intelligence Supérieure
 */

import Magnus_1A from './1A.js';

// ============================================================================
// INITIALIZATION
// ============================================================================

const oneA = new Magnus_1A();
await oneA.initialize();

// ============================================================================
// EXAMPLE 1: Simple Request Evaluation
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('EXAMPLE 1: Evaluating a simple request');
console.log('='.repeat(80) + '\n');

const request1 = {
  text: "Create a web application for calculating Golden Ratio proportions",
  context: {
    project: "Harmonia Tools",
    type: "new_feature"
  }
};

const session1 = {
  duration_minutes: 45,
  avg_decision_time_minutes: 4,
  validations_performed: 3,
  questions_asked: 5,
  accepted_without_modification: 0.2,
  time_since_last_break_minutes: 45
};

const eval1 = await oneA.evaluate(request1, session1);

console.log('Result:', eval1.recommendation);

// ============================================================================
// EXAMPLE 2: Fatigued State (Should Warn or Block)
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('EXAMPLE 2: Evaluating in fatigued state');
console.log('='.repeat(80) + '\n');

const request2 = {
  text: "Add this feature quickly",
  context: {
    project: "Current Project"
  }
};

const session2 = {
  duration_minutes: 190, // Critical duration
  avg_decision_time_minutes: 1, // Too fast
  validations_performed: 0, // No validation
  questions_asked: 0, // No questions
  accepted_without_modification: 0.9, // Accepting everything
  time_since_last_break_minutes: 150 // No break for 2.5 hours
};

const eval2 = await oneA.evaluate(request2, session2);

console.log('Result:', eval2.recommendation);
// Should BLOCK due to critical fatigue

// ============================================================================
// EXAMPLE 3: Recording Outcome (Learning)
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('EXAMPLE 3: Recording outcome for learning');
console.log('='.repeat(80) + '\n');

// Simulate: Project was completed successfully
await oneA.recordOutcome('request1_id', {
  id: 'request1_id',
  name: 'Harmonia Golden Ratio Calculator',
  success: true,
  deployed: true,
  serigneSatisfaction: 9.0,
  technicalSuccess: true,
  philosophicalSuccess: 9.5,
  
  patterns: [
    { name: 'golden_ratio', type: 'mathematical', frequency: 45 },
    { name: 'fibonacci', type: 'mathematical', frequency: 12 }
  ],
  
  learnings: [
    'Golden Ratio UI proportions enhanced aesthetic appeal',
    'Fibonacci spacing created natural visual rhythm',
    'Contemplative design increased user engagement'
  ],
  
  linesGenerated: 1247,
  sessionsCount: 3,
  timeSpentMinutes: 180
});

console.log('✅ Outcome recorded. 1A will learn from this success.\n');

// ============================================================================
// EXAMPLE 4: Smart Assessment (Periodic Re-evaluation)
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('EXAMPLE 4: Triggering smart assessment');
console.log('='.repeat(80) + '\n');

// After accumulating enough observations, trigger assessment
const assessment = await oneA.smartAssessment();

console.log('Assessment Result:', assessment);

// ============================================================================
// EXAMPLE 5: Override Recording
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('EXAMPLE 5: Serigne overrides 1A warning');
console.log('='.repeat(80) + '\n');

// 1A warned against proceeding, but Serigne decides to proceed anyway
await oneA.recordOverride(
  {
    action: 'REFUSE',
    reasoning: 'High failure probability due to fatigue',
    evidence: { fatigue_level: 'critical' }
  },
  "I feel this is important enough to push through despite fatigue"
);

// Later, record what happened
// This helps 1A learn: Was the override justified? Or was 1A right?

// ============================================================================
// EXAMPLE 6: Get Statistics
// ============================================================================

console.log('\n' + '='.repeat(80));
console.log('EXAMPLE 6: Viewing 1A statistics');
console.log('='.repeat(80) + '\n');

const stats = await oneA.getStats();

console.log('Magnus_1A Statistics:');
console.log('━'.repeat(80));
console.log(`Observations: ${stats.observations}`);
console.log(`Discovered Patterns: ${stats.discovered_patterns}`);
console.log(`\nHints Status:`);
console.log(`  - Confirmed: ${stats.hints.confirmed}`);
console.log(`  - Rejected: ${stats.hints.rejected}`);
console.log(`  - Testing: ${stats.hints.testing}`);
console.log(`\nPrediction Accuracy: ${(stats.predictions.accuracy * 100).toFixed(1)}%`);
console.log(`  - Correct: ${stats.predictions.correct}`);
console.log(`  - Incorrect: ${stats.predictions.incorrect}`);
console.log(`  - Pending: ${stats.predictions.pending.length}`);
console.log(`\nSerigne Overrides: ${stats.overrides}`);
console.log('━'.repeat(80) + '\n');

// ============================================================================
// NOTES
// ============================================================================

console.log('IMPORTANT NOTES:');
console.log('━'.repeat(80));
console.log('1. Magnus_1A observes EVERYTHING without presupposés');
console.log('2. Patterns are discovered EMPIRICALLY (correlation > 0.7)');
console.log('3. Initial hints are CHALLENGEABLE and can be rejected');
console.log('4. 1A has AUTHORITY to BLOCK in critical fatigue');
console.log('5. ALL projects are remembered EQUALLY (no hierarchy)');
console.log('6. Significance EMERGES from data (reuse, learnings, satisfaction)');
console.log('7. 1A LEARNS from outcomes and Serigne overrides');
console.log('8. Smart Assessment triggers automatic re-evaluation');
console.log('━'.repeat(80) + '\n');
