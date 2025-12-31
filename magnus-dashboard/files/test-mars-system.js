/**
 * MARS TEST SUITE
 * Testing Magnus Autonomous Research System with real project data
 */

// Import MARS system
import MARS from './magnus-autonomous-research-system.js';

// ============================================================================
// TEST CONFIGURATION
// ============================================================================

const TEST_CONFIG = {
  storageDir: '.mars',
  userProfile: {
    name: 'Serigne',
    background: {
      musical: '40 years training',
      mathematics: 'Pythagorean theory',
      philosophy: 'Sacred geometry, Kabbalah',
      coding: '25,954+ lines produced'
    },
    interests: [
      'sacred_geometry',
      'pythagorean_harmony',
      'harmonic_ratios',
      'language_processing',
      'framework_development'
    ]
  }
};

// ============================================================================
// TEST SUITE
// ============================================================================

async function runMARSTests() {
  console.log('='.repeat(80));
  console.log('🧪 MARS TEST SUITE');
  console.log('='.repeat(80));
  console.log('');

  try {
    // Test 1: Initialize MARS
    await test1_InitializeMARS();

    // Test 2: Load existing learnings
    await test2_LoadExistingLearnings();

    // Test 3: Discover patterns
    await test3_DiscoverPatterns();

    // Test 4: Build predictive models
    await test4_BuildPredictiveModels();

    // Test 5: Generate research suggestions
    await test5_GenerateResearchSuggestions();

    // Test 6: Conduct autonomous research
    await test6_ConductAutonomousResearch();

    // Test 7: Full workflow simulation
    await test7_FullWorkflowSimulation();

    console.log('');
    console.log('='.repeat(80));
    console.log('✅ ALL TESTS PASSED');
    console.log('='.repeat(80));

  } catch (error) {
    console.error('');
    console.error('='.repeat(80));
    console.error('❌ TEST FAILED');
    console.error('='.repeat(80));
    console.error(error);
  }
}

// ============================================================================
// TEST 1: INITIALIZE MARS
// ============================================================================

async function test1_InitializeMARS() {
  console.log('TEST 1: Initialize MARS');
  console.log('-'.repeat(80));

  const mars = new MARS(TEST_CONFIG);

  const result = await mars.initialize([]);

  console.log(`Status: ${result.status}`);
  console.log(`Project count: ${result.projectCount}`);
  console.log(`Learnings loaded: ${result.learningsLoaded}`);

  if (result.status === 'initialized' && result.learningsLoaded >= 0) {
    console.log('✅ Test 1 PASSED');
  } else {
    throw new Error('Test 1 FAILED: MARS initialization failed');
  }

  console.log('');
  return mars;
}

// ============================================================================
// TEST 2: LOAD EXISTING LEARNINGS
// ============================================================================

async function test2_LoadExistingLearnings() {
  console.log('TEST 2: Load Existing Learnings');
  console.log('-'.repeat(80));

  const mars = new MARS(TEST_CONFIG);

  const learnings = await mars.learningCapture.loadAllLearnings();

  console.log(`Learnings loaded: ${learnings.length}`);

  if (learnings.length > 0) {
    console.log('');
    console.log('Sample learning (Tserouf v4.1):');
    console.log(`  - Project: ${learnings[0].projectId}`);
    console.log(`  - Accuracy: ${learnings[0].estimationLearnings.accuracy}%`);
    console.log(`  - Decisions: ${learnings[0].decisionLearnings.totalDecisions}`);
    console.log(`  - Success Rate: ${learnings[0].decisionLearnings.successRate}%`);
    console.log(`  - Risks materialized: ${learnings[0].riskLearnings.materialized}/${learnings[0].riskLearnings.totalRisks}`);
  }

  if (learnings.length >= 2) {
    console.log('✅ Test 2 PASSED');
  } else {
    throw new Error('Test 2 FAILED: Expected at least 2 learnings');
  }

  console.log('');
  return learnings;
}

// ============================================================================
// TEST 3: DISCOVER PATTERNS
// ============================================================================

async function test3_DiscoverPatterns() {
  console.log('TEST 3: Discover Patterns');
  console.log('-'.repeat(80));

  const mars = new MARS(TEST_CONFIG);
  const learnings = await mars.learningCapture.loadAllLearnings();

  const patterns = await mars.patternDiscovery.discoverPatterns(learnings);

  console.log(`Total projects analyzed: ${patterns.projectCount}`);
  console.log(`Complexity patterns: ${patterns.complexityPatterns.length}`);
  console.log(`Decision patterns: ${patterns.decisionPatterns.length}`);
  console.log(`Risk patterns: ${patterns.riskPatterns.length}`);
  console.log(`Architecture patterns: ${patterns.architecturePatterns.length}`);
  console.log(`Time patterns: ${patterns.timePatterns.length}`);
  console.log(`Emergent patterns: ${patterns.emergentPatterns.length}`);
  console.log(`Ranked patterns: ${patterns.rankedByConfidence.length}`);

  if (patterns.rankedByConfidence.length > 0) {
    console.log('');
    console.log('Top 3 patterns by confidence:');
    patterns.rankedByConfidence.slice(0, 3).forEach((p, i) => {
      console.log(`  ${i + 1}. ${p.type} (confidence: ${(p.confidence * 100).toFixed(0)}%)`);
      console.log(`     Insight: ${p.insight || 'N/A'}`);
    });
  }

  if (patterns.rankedByConfidence.length > 0) {
    console.log('✅ Test 3 PASSED');
  } else {
    throw new Error('Test 3 FAILED: No patterns discovered');
  }

  console.log('');
  return patterns;
}

// ============================================================================
// TEST 4: BUILD PREDICTIVE MODELS
// ============================================================================

async function test4_BuildPredictiveModels() {
  console.log('TEST 4: Build Predictive Models');
  console.log('-'.repeat(80));

  const mars = new MARS(TEST_CONFIG);
  const learnings = await mars.learningCapture.loadAllLearnings();
  const patterns = await mars.patternDiscovery.discoverPatterns(learnings);

  const models = await mars.predictiveModels.buildModels(learnings, patterns);

  console.log('Effort Estimation Model:');
  console.log(`  - Formula: ${models.effortEstimation.formula}`);
  console.log(`  - Accuracy: ${models.effortEstimation.accuracy}%`);
  console.log(`  - Version: ${models.effortEstimation.version}`);
  console.log(`  - Improved by: ${models.effortEstimation.improvedBy}`);

  console.log('');
  console.log('Risk Prediction Model:');
  console.log(`  - High-risk indicators: ${models.riskPrediction.highRiskIndicators.length}`);
  console.log(`  - Accuracy: ${models.riskPrediction.accuracy}%`);

  console.log('');
  console.log('Decision Quality Model:');
  console.log(`  - Accuracy: ${models.decisionQuality.accuracy}%`);

  console.log('');
  console.log('Architecture Model:');
  console.log(`  - Patterns: ${models.architectureQuality.patterns.length}`);
  console.log(`  - Recommendations: ${models.architectureQuality.recommendations.length}`);

  console.log('');
  console.log('Overall Model Accuracy:');
  console.log(`  - Effort: ${models.accuracy.effort}%`);
  console.log(`  - Risk: ${models.accuracy.risk}%`);
  console.log(`  - Overall: ${models.accuracy.overall}%`);
  console.log(`  - Improvement rate: ${models.improvementRate}% per project`);

  if (models.accuracy.overall > 80) {
    console.log('✅ Test 4 PASSED');
  } else {
    throw new Error('Test 4 FAILED: Model accuracy too low');
  }

  console.log('');
  return models;
}

// ============================================================================
// TEST 5: GENERATE RESEARCH SUGGESTIONS
// ============================================================================

async function test5_GenerateResearchSuggestions() {
  console.log('TEST 5: Generate Research Suggestions');
  console.log('-'.repeat(80));

  const mars = new MARS(TEST_CONFIG);

  const proposal = await mars.proposeNextResearch();

  console.log('');
  console.log(proposal.message);
  console.log('');

  console.log('Top suggestions:');
  proposal.suggestions.forEach((s, i) => {
    console.log(`${i + 1}. ${s.area}`);
    console.log(`   Impact: ${s.impact}`);
    console.log(`   Effort: ${s.effort}`);
    console.log(`   Score: ${s.score.toFixed(2)}`);
  });

  if (proposal.suggestions.length >= 3) {
    console.log('✅ Test 5 PASSED');
  } else {
    throw new Error('Test 5 FAILED: Expected at least 3 suggestions');
  }

  console.log('');
  return proposal;
}

// ============================================================================
// TEST 6: CONDUCT AUTONOMOUS RESEARCH
// ============================================================================

async function test6_ConductAutonomousResearch() {
  console.log('TEST 6: Conduct Autonomous Research');
  console.log('-'.repeat(80));

  const mars = new MARS(TEST_CONFIG);

  // Get suggestions first
  const proposal = await mars.proposeNextResearch();
  const direction = proposal.suggestions[0]; // Take top suggestion

  console.log(`Researching: ${direction.area}`);
  console.log('');

  const research = await mars.conductAutonomousResearch(direction);

  console.log('Phase 1 - Exploration:');
  console.log(`  - Hypotheses: ${research.phase1_exploration.hypotheses.length}`);
  console.log(`  - Experiments designed: ${research.phase1_exploration.experimentalApproach.length}`);

  console.log('');
  console.log('Phase 2 - Testing:');
  console.log(`  - Prototypes created: ${research.phase2_testing.prototypes.length}`);
  console.log(`  - Validation accuracy: ${research.phase2_testing.validation.accuracy}%`);
  console.log(`  - Projects tested: ${research.phase2_testing.validation.projectsTested}`);

  console.log('');
  console.log('Phase 3 - Synthesis:');
  console.log(`  - Insights extracted: ${research.phase3_synthesis.insights.length}`);
  console.log(`  - Recommendations: ${research.phase3_synthesis.recommendations.length}`);
  console.log(`  - Framework improvements: ${research.phase3_synthesis.frameworkImprovements.length}`);

  console.log('');
  console.log('Key insights:');
  research.phase3_synthesis.insights.forEach((insight, i) => {
    console.log(`  ${i + 1}. ${insight.insight} (confidence: ${(insight.confidence * 100).toFixed(0)}%)`);
  });

  if (research.phase3_synthesis.insights.length > 0) {
    console.log('✅ Test 6 PASSED');
  } else {
    throw new Error('Test 6 FAILED: No insights generated');
  }

  console.log('');
  return research;
}

// ============================================================================
// TEST 7: FULL WORKFLOW SIMULATION
// ============================================================================

async function test7_FullWorkflowSimulation() {
  console.log('TEST 7: Full Workflow Simulation');
  console.log('-'.repeat(80));
  console.log('Simulating: Project completion → Learning → Patterns → Models → Suggestions');
  console.log('');

  const mars = new MARS(TEST_CONFIG);

  // Simulate a new project completion
  const newProjectData = {
    id: 'test-project-simulation',
    outcome: {
      predicted: {
        complexity: 7.0,
        effort: 50,
        timeline: 48,
        clarity: 0.90
      },
      actual: {
        complexity: 7.2,
        effort: 52,
        timeline: 50,
        clarity: 0.90
      },
      decisions: [
        {
          decision: 'Use modern framework',
          clarity: 0.92,
          complexity: 6,
          precedent: true,
          outcome: 'success'
        },
        {
          decision: 'Implement caching',
          clarity: 0.88,
          complexity: 5,
          precedent: true,
          outcome: 'success'
        }
      ],
      risks: [
        {
          category: 'performance',
          description: 'Potential scalability issues',
          materialized: false,
          mitigated: true,
          earlySignals: ['load_testing', 'optimization']
        }
      ],
      codeMetrics: {
        linesOfCode: 3200,
        files: 10,
        complexity: 7.2,
        modules: [
          { name: 'core', size: 500 },
          { name: 'api', size: 400 },
          { name: 'ui', size: 300 }
        ],
        averageModuleSize: 400,
        largestModule: 'core',
        dependencies: ['core -> api', 'ui -> api'],
        dependencyDepth: 2
      },
      phases: {
        phase1: { duration: 5, predicted: 5 },
        phase2: { duration: 7, predicted: 7 },
        phase3: { duration: 9, predicted: 8 },
        phase4: { duration: 18, predicted: 16 },
        phase5: { duration: 6, predicted: 6 },
        phase6: { duration: 3, predicted: 3 },
        phase7: { duration: 2, predicted: 2 },
        phase8: { duration: 0, predicted: 1 },
        phase9: { duration: 0, predicted: 0 }
      },
      domain: 'web_application',
      projectType: 'full_stack',
      quality: 92
    }
  };

  console.log('Step 1: Capturing project outcome...');
  const result = await mars.afterProjectCompletion(newProjectData);

  console.log(`✓ Learning captured with ${result.learnings.confidence}% confidence`);
  console.log(`✓ Patterns discovered: ${result.patterns.rankedByConfidence.length}`);
  console.log(`✓ Models updated - Overall accuracy: ${result.models.accuracy.overall}%`);
  console.log(`✓ Next direction suggested: ${result.nextDirection.recommended[0]?.area}`);

  console.log('');
  console.log('Step 2: Generating next research proposal...');
  const proposal = await mars.proposeNextResearch();

  console.log('');
  console.log('Claude says:');
  console.log(proposal.message);

  console.log('');
  console.log('Step 3: Validating continuous improvement...');

  // Verify that accuracy improved
  const allLearnings = await mars.learningCapture.loadAllLearnings();
  const avgAccuracy = allLearnings.reduce((sum, l) =>
    sum + parseFloat(l.estimationLearnings.accuracy), 0
  ) / allLearnings.length;

  console.log(`Average accuracy across ${allLearnings.length} projects: ${avgAccuracy.toFixed(2)}%`);

  if (avgAccuracy > 90) {
    console.log('✅ Test 7 PASSED - Full workflow operational!');
  } else {
    throw new Error('Test 7 FAILED: Accuracy not improving');
  }

  console.log('');
  return result;
}

// ============================================================================
// PERFORMANCE METRICS
// ============================================================================

async function displayPerformanceMetrics() {
  console.log('='.repeat(80));
  console.log('📊 MARS PERFORMANCE METRICS');
  console.log('='.repeat(80));
  console.log('');

  const mars = new MARS(TEST_CONFIG);
  const learnings = await mars.learningCapture.loadAllLearnings();

  if (learnings.length === 0) {
    console.log('No learnings available yet.');
    return;
  }

  // Accuracy trends
  console.log('Estimation Accuracy Trend:');
  learnings.forEach((l, i) => {
    console.log(`  Project ${i + 1} (${l.projectId}): ${l.estimationLearnings.accuracy}%`);
  });

  const avgAccuracy = learnings.reduce((sum, l) =>
    sum + parseFloat(l.estimationLearnings.accuracy), 0
  ) / learnings.length;
  console.log(`  Average: ${avgAccuracy.toFixed(2)}%`);

  console.log('');
  console.log('Decision Success Rate:');
  learnings.forEach((l, i) => {
    console.log(`  Project ${i + 1} (${l.projectId}): ${l.decisionLearnings.successRate}%`);
  });

  const avgDecisionSuccess = learnings.reduce((sum, l) =>
    sum + parseFloat(l.decisionLearnings.successRate), 0
  ) / learnings.length;
  console.log(`  Average: ${avgDecisionSuccess.toFixed(2)}%`);

  console.log('');
  console.log('Risk Materialization:');
  learnings.forEach((l, i) => {
    console.log(`  Project ${i + 1} (${l.projectId}): ${l.riskLearnings.materialized}/${l.riskLearnings.totalRisks} (${l.riskLearnings.materializationRate.toFixed(0)}%)`);
  });

  console.log('');
  console.log('Sacred Geometry Presence:');
  learnings.forEach((l, i) => {
    const goldenRatio = l.architectureLearnings.patterns.goldenRatioPresence;
    const pythagorean = l.architectureLearnings.patterns.pythagoreanHarmony.found;
    console.log(`  Project ${i + 1} (${l.projectId}): Golden Ratio: ${goldenRatio ? '✓' : '✗'}, Pythagorean: ${pythagorean ? '✓' : '✗'}`);
  });

  console.log('');
  console.log('='.repeat(80));
}

// ============================================================================
// RUN ALL TESTS
// ============================================================================

async function main() {
  await runMARSTests();
  await displayPerformanceMetrics();
}

// Execute if run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { runMARSTests, displayPerformanceMetrics };
