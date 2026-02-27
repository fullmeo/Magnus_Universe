#!/usr/bin/env node

/**
 * Magnus ∞ - Continuous Decision Test
 *
 * Runs the system continuously to capture multiple autonomous decisions
 * Validates stability and tracks decision quality over time
 */

import launchInfinity from './infinity-launcher.js';
import fs from 'fs/promises';

async function runContinuousTest() {
  console.log('\n🧪 MAGNUS ∞ - CONTINUOUS DECISION TEST\n');
  console.log('Goal: Capture multiple autonomous decisions');
  console.log('Duration: Run until 10 decisions captured\n');

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
    const decisionsByPattern = new Map();
    let cyclesCompleted = 0;
    let totalDecisions = 0;
    let autonomousDecisions = 0;

    // Listen to events
    system.infinity.on('cycle-complete', (cycle) => {
      cyclesCompleted++;

      // Log progress every 5 cycles
      if (cyclesCompleted % 5 === 0) {
        const status = system.infinity.getStatus();
        console.log(`\n📊 Progress: ${cyclesCompleted} cycles, ${autonomousDecisions} autonomous decisions`);
        console.log(`   Success Rate: ${status.metrics.successRate?.toFixed(2) || 0}`);
        console.log(`   Learning Rate: ${status.metrics.learningCycles || 0}`);
      }
    });

    system.infinity.on('decision', (decision) => {
      totalDecisions++;

      const approved = decision.approved?.length || 0;
      const rejected = decision.rejected?.length || 0;
      const pending = decision.pending?.length || 0;

      decisionsLog.push({
        cycle: cyclesCompleted,
        timestamp: Date.now(),
        approved,
        rejected,
        pending,
        decisions: decision
      });

      if (approved > 0) {
        autonomousDecisions++;
        console.log(`\n✨ AUTONOMOUS DECISION #${autonomousDecisions} at cycle ${cyclesCompleted}!`);

        decision.approved.forEach(d => {
          const pattern = d.pattern || 'unknown';
          console.log(`   ✅ ${pattern}`);
          console.log(`      Confidence: ${d.confidence?.toFixed(2) || 'N/A'}`);
          console.log(`      Prediction: ${d.prediction?.predictedSuccess?.toFixed(2) || 'N/A'}`);

          // Track by pattern type
          if (!decisionsByPattern.has(pattern)) {
            decisionsByPattern.set(pattern, []);
          }
          decisionsByPattern.get(pattern).push({
            cycle: cyclesCompleted,
            confidence: d.confidence,
            prediction: d.prediction
          });
        });
      }
    });

    system.infinity.on('improvement', (improvement) => {
      // Silently track improvements
    });

    // Start the infinity loop
    await system.infinity.start();

    // Wait for 10 autonomous decisions or 100 cycles max
    await new Promise((resolve) => {
      const checkInterval = setInterval(() => {
        if (autonomousDecisions >= 10 || cyclesCompleted >= 100) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 1000);
    });

    // Stop the system
    await system.infinity.stop();

    // Generate report
    const finalStatus = system.infinity.getStatus();
    const patternMemory = system.infinity.learningEngine.getPatternMemory();

    const report = {
      testDuration: Date.now(),
      cyclesCompleted,
      totalDecisions,
      autonomousDecisions,
      summary: {
        successRate: finalStatus.metrics.successRate || 0,
        averageConfidence: finalStatus.metrics.averageConfidence || 0,
        autonomyRate: autonomousDecisions / totalDecisions,
        improvementsMade: finalStatus.metrics.improvementsMade || 0,
        averageCycleTime: finalStatus.metrics.cycleTimings?.reduce((a,b) => a+b, 0) / (finalStatus.metrics.cycleTimings?.length || 1)
      },
      decisionsLog,
      decisionsByPattern: Array.from(decisionsByPattern.entries()).map(([pattern, decisions]) => ({
        pattern,
        count: decisions.length,
        averageConfidence: decisions.reduce((sum, d) => sum + (d.confidence || 0), 0) / decisions.length,
        averagePrediction: decisions.reduce((sum, d) => sum + (d.prediction?.predictedSuccess || 0), 0) / decisions.length,
        cycles: decisions.map(d => d.cycle)
      })),
      patternMemory: patternMemory.map(p => ({
        pattern: p.pattern,
        seenCount: p.seenCount,
        confidence: p.confidence,
        age: Date.now() - p.firstSeen
      })),
      learningEngine: {
        learningRate: system.infinity.learningEngine.getCurrentLearningRate(),
        performanceHistory: system.infinity.learningEngine.performanceHistory.slice(-10)
      }
    };

    // Save report
    await fs.writeFile(
      './test-results-continuous-decisions.json',
      JSON.stringify(report, null, 2)
    );

    // Print summary
    console.log('\n\n╔═══════════════════════════════════════════════════════╗');
    console.log('║                                                       ║');
    console.log('║        CONTINUOUS TEST COMPLETE - FINAL REPORT        ║');
    console.log('║                                                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    console.log('📊 OVERALL METRICS:');
    console.log(`   Cycles Completed: ${cyclesCompleted}`);
    console.log(`   Total Decisions: ${totalDecisions}`);
    console.log(`   Autonomous Decisions: ${autonomousDecisions}`);
    console.log(`   Autonomy Rate: ${(report.summary.autonomyRate * 100).toFixed(1)}%`);
    console.log(`   Success Rate: ${(report.summary.successRate * 100).toFixed(1)}%`);
    console.log(`   Average Cycle Time: ${Math.round(report.summary.averageCycleTime)}ms`);

    console.log(`\n📈 DECISIONS BY PATTERN:`);
    report.decisionsByPattern.forEach(p => {
      console.log(`   ${p.pattern}:`);
      console.log(`      Count: ${p.count}`);
      console.log(`      Avg Confidence: ${p.averageConfidence.toFixed(2)}`);
      console.log(`      Avg Prediction: ${p.averagePrediction.toFixed(2)}`);
      console.log(`      Cycles: ${p.cycles.join(', ')}`);
    });

    console.log(`\n🧠 TOP PATTERNS IN MEMORY:`);
    const topPatterns = report.patternMemory
      .sort((a, b) => b.seenCount - a.seenCount)
      .slice(0, 5);

    topPatterns.forEach(p => {
      console.log(`   ${p.pattern}: ${p.seenCount}x (confidence: ${p.confidence.toFixed(2)})`);
    });

    console.log(`\n📚 LEARNING ENGINE:`);
    console.log(`   Learning Rate: ${report.learningEngine.learningRate.toFixed(3)}`);
    console.log(`   Performance History: ${report.learningEngine.performanceHistory.length} records`);

    console.log(`\n💾 Full report saved to: test-results-continuous-decisions.json`);

    if (autonomousDecisions >= 10) {
      console.log(`\n✅ SUCCESS: Captured ${autonomousDecisions} autonomous decisions!`);
    } else {
      console.log(`\n⚠️  PARTIAL: Only ${autonomousDecisions} decisions in ${cyclesCompleted} cycles`);
      console.log(`   Recommendation: Run longer or lower confidence threshold`);
    }

    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error(error);
    process.exit(1);
  }
}

runContinuousTest();
