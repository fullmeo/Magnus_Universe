/**
 * Full Integration Test
 *
 * Tests the complete integration:
 * - Magnus 14 Scanner
 * - Modality Detection
 * - Pattern Memory with Modality Tracking
 * - Magnus Infinity Learning Engine
 */

import Magnus14Simple from './magnus-14-simple.js';
import MagnusInfinity from './magnus-infinity-core.js';

async function main() {
  console.log('🧪 Testing Full Magnus Infinity + Scanner + Modality Integration...\n');

  // Step 1: Initialize Magnus Infinity
  console.log('🚀 Step 1: Initializing Magnus Infinity...\n');
  const magnusInfinity = new MagnusInfinity({
    learningRate: 0.1,
    confidenceThreshold: 0.6,
    autonomyLevel: 'semi-autonomous',
    enableSelfImprovement: true
  });

  await magnusInfinity.initialize();

  // Step 2: Initialize Scanner with Modality Detection
  console.log('\n🚀 Step 2: Initializing Scanner with Modality Detection...\n');
  const scanner = new Magnus14Simple({
    verbose: false,
    minConfidenceThreshold: 0.5,
    maxFilesPerScan: 50,
    baseDir: process.cwd()
  });

  // Step 3: Scan project
  console.log('🚀 Step 3: Scanning project...\n');
  const scanResults = await scanner.scan(process.cwd());

  console.log('✅ Scan Results:');
  console.log(`   Patterns: ${scanResults.patterns.length}`);
  console.log(`   Friction: ${scanResults.friction.length}`);
  console.log(`   Modality: ${scanResults.modality.primary} (${(scanResults.modality.confidence * 100).toFixed(1)}% confidence)`);

  // Step 4: Feed patterns to Magnus Infinity with modality
  console.log('\n🚀 Step 4: Learning patterns with modality tracking...\n');

  // Enrich patterns with modality information
  const enrichedPatterns = scanResults.patterns.map(pattern => ({
    ...pattern,
    name: pattern.type,
    modality: scanResults.modality.primary // Add detected modality to each pattern
  }));

  // Feed to learning engine
  for (const pattern of enrichedPatterns.slice(0, 10)) { // First 10 for demo
    await magnusInfinity.learningEngine.rememberPattern(pattern);
  }

  console.log(`✅ Learned ${Math.min(10, enrichedPatterns.length)} patterns with modality tracking`);

  // Step 5: Verify pattern memory includes modality
  console.log('\n🚀 Step 5: Verifying pattern memory includes modality...\n');

  let modalityTracked = 0;
  let totalPatterns = 0;

  for (const [key, memory] of magnusInfinity.learningEngine.patternMemory.entries()) {
    totalPatterns++;
    if (memory.modality && memory.modality !== 'unknown') {
      modalityTracked++;
      console.log(`   ✅ ${key}: modality=${memory.modality}, breakdown=`, memory.modalityBreakdown);
    }
  }

  console.log(`\n📊 Modality Tracking Stats:`);
  console.log(`   Total Patterns in Memory: ${totalPatterns}`);
  console.log(`   Patterns with Modality: ${modalityTracked}`);
  console.log(`   Tracking Rate: ${totalPatterns > 0 ? ((modalityTracked / totalPatterns) * 100).toFixed(1) : 0}%`);

  // Step 6: Test decision making with modality awareness
  console.log('\n🚀 Step 6: Testing autonomous decisions with modality awareness...\n');

  const learnings = {
    newPatterns: enrichedPatterns.slice(0, 5).map(p => ({
      pattern: p.type,
      confidence: p.confidence || 0.7,
      previouslySeen: 0,
      seenCount: 0,
      modality: p.modality,
      modalityBreakdown: {
        web: p.modality === 'web' ? 1 : 0,
        mobile: p.modality === 'mobile' ? 1 : 0,
        data: p.modality === 'data' ? 1 : 0,
        unknown: !p.modality || p.modality === 'unknown' ? 1 : 0
      }
    })),
    updates: []
  };

  const decisions = await magnusInfinity.decisionEngine.makeDecisions(learnings);

  console.log(`✅ Decisions Made: ${decisions.approved.length + decisions.pending.length + decisions.rejected.length}`);
  console.log(`   Approved: ${decisions.approved.length}`);
  console.log(`   Pending: ${decisions.pending.length}`);
  console.log(`   Rejected: ${decisions.rejected.length}`);

  // Check if decisions include modality
  const sampleDecision = decisions.approved[0] || decisions.pending[0] || decisions.rejected[0];
  if (sampleDecision) {
    console.log(`\n📋 Sample Decision with Modality:`);
    console.log(`   Pattern: ${sampleDecision.pattern}`);
    console.log(`   Confidence: ${(sampleDecision.confidence * 100).toFixed(1)}%`);
    console.log(`   Modality: ${sampleDecision.modality || 'not tracked'}`);
    if (sampleDecision.modalityBreakdown) {
      console.log(`   Modality Breakdown:`, sampleDecision.modalityBreakdown);
    }
  }

  // Step 7: Validation
  console.log('\n\n🎯 Full Integration Validation:\n');

  const scanWorked = scanResults.patterns.length > 0;
  console.log(`   ${scanWorked ? '✅' : '❌'} Scanner detected patterns`);

  const modalityDetected = scanResults.modality && scanResults.modality.primary !== 'unknown';
  console.log(`   ${modalityDetected ? '✅' : '❌'} Modality detection worked`);

  const modalityCorrect = scanResults.modality.primary === 'web';
  console.log(`   ${modalityCorrect ? '✅' : '❌'} Modality correctly identified as web`);

  const patternsLearned = totalPatterns > 0;
  console.log(`   ${patternsLearned ? '✅' : '❌'} Patterns stored in memory`);

  const modalityTrackedWell = modalityTracked > 0;
  console.log(`   ${modalityTrackedWell ? '✅' : '❌'} Modality tracked in pattern memory`);

  const decisionsWork = decisions.approved.length > 0 || decisions.pending.length > 0;
  console.log(`   ${decisionsWork ? '✅' : '❌'} Decision engine functioning`);

  const modalityInDecisions = sampleDecision && sampleDecision.modality;
  console.log(`   ${modalityInDecisions ? '✅' : '❌'} Modality included in decisions`);

  console.log('\n🏁 Full Integration Test Complete\n');

  const allPassed = scanWorked && modalityDetected && modalityCorrect &&
                    patternsLearned && modalityTrackedWell && decisionsWork && modalityInDecisions;

  console.log(`Status: ${allPassed ? '✅ ALL INTEGRATION TESTS PASSED' : '⚠️  SOME TESTS FAILED'}\n`);

  if (allPassed) {
    console.log('🎉 TIER 1 PHASE 1A - DAY 2 COMPLETE!');
    console.log('');
    console.log('✅ Magnus 14 Scanner integration: WORKING');
    console.log('✅ Modality Detection: WORKING');
    console.log('✅ Pattern Memory with Modality: WORKING');
    console.log('✅ Autonomous Decisions with Modality: WORKING');
    console.log('');
    console.log('📊 Summary:');
    console.log(`   - ${scanResults.patterns.length} patterns detected`);
    console.log(`   - ${scanResults.modality.primary} modality (${(scanResults.modality.confidence * 100).toFixed(1)}% confidence)`);
    console.log(`   - ${totalPatterns} patterns in memory`);
    console.log(`   - ${modalityTracked} patterns with modality tracking`);
    console.log(`   - ${decisions.approved.length} autonomous decisions`);
    console.log('');
    console.log('🚀 Ready for Day 3: Modality-Aware Decision Making Enhancement');
  }
}

main().catch(console.error);
