#!/usr/bin/env node

/**
 * Magnus ∞ - Extended Test for Autonomous Decisions
 *
 * Runs the system for 100 cycles and captures all decisions
 * Generates detailed report of autonomous behavior
 */

import launchInfinity from './infinity-launcher.js';
import fs from 'fs/promises';

async function runExtendedTest() {
  console.log('\n🧪 MAGNUS ∞ - EXTENDED AUTONOMOUS DECISION TEST\n');
  console.log('Target: 100 cycles');
  console.log('Goal: Capture first autonomous decisions\n');

  const config = {
    userId: 'test-user',
    autonomyLevel: 'semi-autonomous',
    confidenceThreshold: 0.6,
    learningRate: 0.1,
    enableScanner: true,
    enableCloudSync: false,
    enableDashboard: false,
    enableAPI: false,
    enableSelfImprovement: true,
    enableSafeguards: true
  };

  try {
    // Launch system
    const system = await launchInfinity(config);

    // Track decisions
    const decisionsLog = [];
    const patternsLog = [];
    let cyclesCompleted = 0;
    let firstDecisionCycle = null;

    // Listen to events
    system.infinity.on('cycle-complete', (cycle) => {
      cyclesCompleted++;

      // Log progress every 10 cycles
      if (cyclesCompleted % 10 === 0) {
        const status = system.infinity.getStatus();
        console.log(`\n📊 Progress: ${cyclesCompleted}/100 cycles`);
        console.log(`   Decisions: ${status.metrics.totalDecisions} total, ${status.metrics.autonomousDecisions} autonomous`);
        console.log(`   Patterns: ${status.metrics.totalPatterns} detected, ${status.metrics.highConfidencePatterns} high-confidence`);
      }
    });

    system.infinity.on('decision', (decision) => {
      decisionsLog.push({
        cycle: cyclesCompleted,
        timestamp: Date.now(),
        approved: decision.approved?.length || 0,
        rejected: decision.rejected?.length || 0,
        pending: decision.pending?.length || 0,
        decisions: decision
      });

      if (decision.approved?.length > 0 && !firstDecisionCycle) {
        firstDecisionCycle = cyclesCompleted;
        console.log(`\n✨ FIRST AUTONOMOUS DECISION at cycle ${cyclesCompleted}!`);
        console.log(`   Approved: ${decision.approved.length} decisions`);
      }
    });

    system.infinity.on('improvement', (improvement) => {
      patternsLog.push({
        cycle: cyclesCompleted,
        timestamp: Date.now(),
        type: improvement.type,
        data: improvement.data
      });
    });

    // Start the infinity loop
    await system.infinity.start();

    // Wait for 100 cycles
    await new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (cyclesCompleted >= 100) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 1000);
    });

    // Stop the system
    await system.infinity.stop();

    // Generate report
    const finalStatus = system.infinity.getStatus();

    const report = {
      testDuration: Date.now(),
      cyclesCompleted,
      firstDecisionCycle,
      summary: {
        totalDecisions: finalStatus.metrics.totalDecisions,
        autonomousDecisions: finalStatus.metrics.autonomousDecisions,
        humanOverrides: finalStatus.metrics.humanOverrides,
        safeguardBlocks: finalStatus.metrics.safeguardBlocks,
        improvementsMade: finalStatus.metrics.improvementsMade,
        totalPatterns: finalStatus.metrics.totalPatterns,
        highConfidencePatterns: finalStatus.metrics.highConfidencePatterns,
        averageCycleTime: finalStatus.metrics.cycleTimings.reduce((a,b) => a+b, 0) / finalStatus.metrics.cycleTimings.length
      },
      decisionsLog,
      patternsLog,
      learningEngine: {
        patternMemory: system.infinity.learningEngine.getPatternMemory(),
        learningRate: system.infinity.learningEngine.getCurrentLearningRate()
      }
    };

    // Save report
    await fs.writeFile(
      './test-results-autonomous-decisions.json',
      JSON.stringify(report, null, 2)
    );

    // Print summary
    console.log('\n\n╔═══════════════════════════════════════════════════════╗');
    console.log('║                                                       ║');
    console.log('║           TEST COMPLETE - FINAL REPORT                ║');
    console.log('║                                                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    console.log('📊 METRICS:');
    console.log(`   Cycles Completed: ${cyclesCompleted}`);
    console.log(`   Total Decisions: ${report.summary.totalDecisions}`);
    console.log(`   Autonomous: ${report.summary.autonomousDecisions}`);
    console.log(`   Patterns Detected: ${report.summary.totalPatterns}`);
    console.log(`   High-Confidence: ${report.summary.highConfidencePatterns}`);
    console.log(`   Average Cycle Time: ${Math.round(report.summary.averageCycleTime)}ms`);

    if (firstDecisionCycle) {
      console.log(`\n✨ First Decision: Cycle ${firstDecisionCycle}`);
    } else {
      console.log(`\n⏳ No Autonomous Decisions Yet`);
      console.log(`   Reason: Building pattern memory (needs >3 occurrences)`);
    }

    console.log(`\n📝 Pattern Memory:`);
    const memory = report.learningEngine.patternMemory;
    memory.slice(0, 5).forEach(p => {
      console.log(`   ${p.pattern}: seen ${p.seenCount} times (confidence: ${p.confidence})`);
    });

    console.log(`\n💾 Full report saved to: test-results-autonomous-decisions.json`);

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runExtendedTest();
