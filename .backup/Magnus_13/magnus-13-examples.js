/**
 * Magnus 13.0 - Usage Examples
 * 
 * Demonstrates how Magnus 13 analyzes requests and makes intelligent decisions
 */

import Magnus13 from './magnus-13.js';

// ============================================================================
// EXAMPLE 1: Simple Request - Clear and Straightforward
// ============================================================================

async function example1_SimpleRequest() {
  console.log('\n' + '='.repeat(80));
  console.log('EXAMPLE 1: Simple, Clear Request');
  console.log('='.repeat(80) + '\n');

  const magnus = new Magnus13();
  await magnus.initialize();

  const request = `
    Create a React component for displaying a user profile card.
    - Show avatar, name, email, and bio
    - Use Tailwind for styling
    - Make it responsive
  `;

  const analysis = await magnus.analyze(request);

  console.log('📊 Analysis Results:');
  console.log(`Clarity Score: ${analysis.understanding.clarityScore}/100`);
  console.log(`Complexity Score: ${analysis.complexity.overall.score}/10 (${analysis.complexity.overall.level})`);
  console.log(`Can Proceed: ${analysis.canProceed ? '✅ YES' : '❌ NO'}`);
  console.log(`Recommendation: ${analysis.recommendation.recommendation}`);
  
  if (analysis.canProceed) {
    console.log(`\n✅ Ready to generate using: ${analysis.recommendation.strategy.name}`);
  }

  return analysis;
}

// ============================================================================
// EXAMPLE 2: Ambiguous Request - Needs Clarification
// ============================================================================

async function example2_AmbiguousRequest() {
  console.log('\n' + '='.repeat(80));
  console.log('EXAMPLE 2: Ambiguous Request - Triggers Clarification');
  console.log('='.repeat(80) + '\n');

  const magnus = new Magnus13();
  await magnus.initialize();

  const request = `
    Build a user system with authentication
  `;

  const analysis = await magnus.analyze(request);

  console.log('📊 Analysis Results:');
  console.log(`Clarity Score: ${analysis.understanding.clarityScore}/100`);
  console.log(`Ambiguities Found: ${analysis.understanding.ambiguities.length}`);
  console.log(`Can Proceed: ${analysis.canProceed ? '✅ YES' : '❌ NO'}`);
  console.log(`Recommendation: ${analysis.recommendation.recommendation}`);

  if (analysis.clarificationNeeded) {
    console.log('\n❓ Clarification Questions:');
    analysis.questions.forEach((q, i) => {
      console.log(`\n${i + 1}. [${q.priority}] ${q.question}`);
      console.log(`   Reason: ${q.reason}`);
    });
  }

  return analysis;
}

// ============================================================================
// EXAMPLE 3: Complex Request - Needs Decomposition
// ============================================================================

async function example3_ComplexRequest() {
  console.log('\n' + '='.repeat(80));
  console.log('EXAMPLE 3: Complex Request - Triggers Decomposition');
  console.log('='.repeat(80) + '\n');

  const magnus = new Magnus13();
  await magnus.initialize();

  const request = `
    Build a real-time collaborative code editor with:
    - Multiple users editing simultaneously
    - Syntax highlighting for 10+ languages
    - AI-powered code completion
    - Video chat integration
    - Version control with branching
    - Plugin system for extensions
  `;

  const analysis = await magnus.analyze(request);

  console.log('📊 Analysis Results:');
  console.log(`Complexity Score: ${analysis.complexity.overall.score}/10 (${analysis.complexity.overall.level})`);
  console.log(`Bottleneck: ${analysis.complexity.bottleneck.dimension}`);
  console.log(`Can Proceed: ${analysis.canProceed ? '✅ YES' : '❌ NO'}`);
  console.log(`Recommendation: ${analysis.recommendation.recommendation}`);

  if (analysis.recommendation.recommendation === 'DECOMPOSE') {
    console.log('\n📦 Suggested Decomposition:');
    console.log(`Approach: ${analysis.recommendation.decomposition.approach}`);
    console.log('\nPhases:');
    analysis.recommendation.decomposition.phases.forEach((phase, i) => {
      console.log(`  ${phase}`);
    });
  }

  // Show complexity breakdown
  console.log('\n🔍 Complexity Breakdown:');
  Object.entries(analysis.complexity.dimensions).forEach(([dim, data]) => {
    console.log(`  ${dim}: ${data.score}/10 (${data.level})`);
  });

  return analysis;
}

// ============================================================================
// EXAMPLE 4: With Learned Patterns - Applies Historical Knowledge
// ============================================================================

async function example4_WithLearning() {
  console.log('\n' + '='.repeat(80));
  console.log('EXAMPLE 4: Learning Engine - Applies Historical Knowledge');
  console.log('='.repeat(80) + '\n');

  const magnus = new Magnus13({ autoLearn: true });
  await magnus.initialize();

  // Simulate learning from past generations
  console.log('📚 Simulating learned patterns...\n');

  // First time: estimate
  const request1 = `Create a React dashboard with charts`;
  const analysis1 = await magnus.analyze(request1);
  
  if (analysis1.canProceed) {
    const gen1 = await magnus.startGeneration(analysis1);
    console.log(`Session 1 Started: ${gen1.sessionId}`);
    console.log(`Estimated tokens: ${gen1.estimate.tokensEstimated}`);
    console.log(`Estimated iterations: ${gen1.estimate.iterationsEstimated}`);

    // Record actual (simulated)
    await magnus.recordOutcome(gen1.sessionId, {
      outcome: 'SUCCESS',
      tokensUsed: 3500, // Actual was higher than estimate
      iterations: 3,
      linesOfCode: 450,
      filesGenerated: 4,
      quality: 'GOOD',
      errors: []
    });
  }

  // Second time: apply learning
  console.log('\n---\n');
  const request2 = `Create another React dashboard with different metrics`;
  const analysis2 = await magnus.analyze(request2);
  
  if (analysis2.learned?.available) {
    console.log('✅ Learned patterns available!');
    console.log(`   Samples: ${analysis2.learned.stats.samples}`);
    console.log(`   Success rate: ${analysis2.learned.stats.successRate.toFixed(1)}%`);
    console.log(`   Recommendations: ${analysis2.learned.recommendations.length}`);
    
    if (analysis2.learned.recommendations.length > 0) {
      console.log('\n💡 Learned Recommendations:');
      analysis2.learned.recommendations.forEach(rec => {
        console.log(`   - [${rec.type}] ${rec.recommendation}`);
        console.log(`     Confidence: ${rec.confidence}`);
      });
    }
  }

  if (analysis2.canProceed) {
    const gen2 = await magnus.startGeneration(analysis2);
    console.log(`\nSession 2 Started: ${gen2.sessionId}`);
    console.log(`Estimated tokens: ${gen2.estimate.tokensEstimated} (adjusted based on learning)`);
    console.log(`Estimated iterations: ${gen2.estimate.iterationsEstimated} (adjusted based on learning)`);
  }

  return analysis2;
}

// ============================================================================
// EXAMPLE 5: Multi-Session with Coherence - Maintains Context
// ============================================================================

async function example5_MultiSession() {
  console.log('\n' + '='.repeat(80));
  console.log('EXAMPLE 5: Coherence Engine - Multi-Session Development');
  console.log('='.repeat(80) + '\n');

  const magnus = new Magnus13();
  await magnus.initialize();

  // SESSION 1: Build core
  console.log('📝 SESSION 1: Building core architecture\n');
  
  const request1 = `Build a task management API with Node.js and Express`;
  const analysis1 = await magnus.analyze(request1);

  if (analysis1.canProceed) {
    const gen1 = await magnus.startGeneration(analysis1);
    console.log(`Session started: ${gen1.sessionId}`);

    // Record architectural decisions
    await magnus.recordArchitecturalDecision({
      decision: 'REST API with Express Router',
      rationale: 'Standard pattern, widely supported, easy to extend',
      alternatives: ['GraphQL', 'gRPC'],
      consequences: ['RESTful conventions', 'Versioning via URL']
    });

    await magnus.recordArchitecturalDecision({
      decision: 'MongoDB for data persistence',
      rationale: 'Flexible schema, good for rapid iteration',
      alternatives: ['PostgreSQL', 'SQLite'],
      consequences: ['NoSQL queries', 'Mongoose ODM']
    });

    console.log('✅ Architectural decisions recorded');

    // End session
    await magnus.recordOutcome(gen1.sessionId, {
      outcome: 'SUCCESS',
      tokensUsed: 4200,
      iterations: 2,
      linesOfCode: 320,
      filesGenerated: 5,
      quality: 'GOOD',
      errors: []
    });

    console.log('✅ Session 1 complete\n');

    // SESSION 2: Resume and extend
    console.log('---\n');
    console.log('📝 SESSION 2: Resuming and adding features\n');

    const context = await magnus.resumeSession(gen1.sessionId);
    
    console.log('🔄 Context loaded:');
    console.log(`   Decisions: ${context.decisions.length}`);
    console.log(`   Artifacts: ${context.existingArtifacts.length}`);
    console.log(`   Iterations: ${context.iterationHistory.length}`);

    console.log('\n📋 Architectural decisions from Session 1:');
    context.decisions.forEach((dec, i) => {
      console.log(`   ${i + 1}. ${dec.decision}`);
      console.log(`      → ${dec.rationale}`);
    });

    console.log('\n💡 Continuity guidance:');
    context.continuityGuidance.forEach(guide => {
      console.log(`   [${guide.type}] ${guide.instruction}`);
    });

    console.log('\n✅ Session 2 can now proceed with full context');
  }

  return analysis1;
}

// ============================================================================
// EXAMPLE 6: Comprehensive Report
// ============================================================================

async function example6_ComprehensiveReport() {
  console.log('\n' + '='.repeat(80));
  console.log('EXAMPLE 6: Comprehensive Analysis Report');
  console.log('='.repeat(80) + '\n');

  const magnus = new Magnus13();
  await magnus.initialize();

  const request = `
    Build a cryptocurrency trading bot that:
    - Monitors 10 exchanges via WebSocket
    - Uses machine learning for price prediction
    - Executes trades automatically
    - Has risk management rules
    - Sends alerts via Telegram
  `;

  const analysis = await magnus.analyze(request);
  const report = magnus.generateReport(analysis);

  console.log('📄 MAGNUS 13 ANALYSIS REPORT');
  console.log('Generated:', report.timestamp);
  console.log('\n' + '-'.repeat(80));

  console.log('\n🎯 REQUEST:');
  console.log(report.request.trim());

  console.log('\n\n📊 UNDERSTANDING ANALYSIS:');
  console.log(`   Clarity Score: ${report.understanding.clarityScore}/100`);
  console.log(`   Ambiguities: ${report.understanding.ambiguities}`);
  console.log(`   Assumptions: ${report.understanding.assumptions}`);
  console.log(`   Risks: ${report.understanding.risks}`);

  console.log('\n\n🔬 COMPLEXITY ANALYSIS:');
  console.log(`   Overall: ${report.complexity.overall} (${report.complexity.score}/10)`);
  console.log(`   Bottleneck: ${report.complexity.bottleneck}`);
  console.log('\n   Dimensions:');
  report.complexity.dimensions.forEach(dim => {
    console.log(`     • ${dim.dimension}: ${dim.level} (${dim.score}/10)`);
  });

  console.log('\n\n🎯 DECISION:');
  console.log(`   Recommendation: ${report.decision.recommendation}`);
  console.log(`   Can Proceed: ${report.decision.canProceed ? 'YES ✅' : 'NO ❌'}`);
  console.log('\n   Reasoning:');
  report.decision.reasoning.forEach((r, i) => {
    console.log(`     ${i + 1}. [${r.type}] ${r.issue}`);
    console.log(`        Impact: ${r.impact}`);
    console.log(`        Action: ${r.action}`);
  });

  console.log('\n' + '-'.repeat(80));

  return report;
}

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

async function runAllExamples() {
  console.log('\n');
  console.log('╔════════════════════════════════════════════════════════════════════════════╗');
  console.log('║                         MAGNUS 13.0 - EXAMPLES                             ║');
  console.log('║                  Understanding & Coherence Engine                          ║');
  console.log('╚════════════════════════════════════════════════════════════════════════════╝');

  try {
    await example1_SimpleRequest();
    await example2_AmbiguousRequest();
    await example3_ComplexRequest();
    await example4_WithLearning();
    await example5_MultiSession();
    await example6_ComprehensiveReport();

    console.log('\n' + '='.repeat(80));
    console.log('✅ All examples completed successfully');
    console.log('='.repeat(80) + '\n');

  } catch (error) {
    console.error('\n❌ Error running examples:', error);
    throw error;
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export {
  example1_SimpleRequest,
  example2_AmbiguousRequest,
  example3_ComplexRequest,
  example4_WithLearning,
  example5_MultiSession,
  example6_ComprehensiveReport,
  runAllExamples
};

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples().catch(console.error);
}
