const { MagnusInfinity } = require('./magnus-infinity-core.js');
const fs = require('fs');

async function runContinuousTest() {
  console.log('🚀 Starting Continuous Test for 10 Autonomous Decisions');
  console.log('=' .repeat(60));

  const system = new MagnusInfinity({
    userId: 'test-user-10-decisions',
    autonomyLevel: 'semi-autonomous',
    confidenceThreshold: 0.6,
    learningRate: 0.1,
    enableSelfImprovement: true,
    enableSafeguards: true,
    maxCycles: 1000 // Allow up to 1000 cycles to get 10 decisions
  });

  const decisionsLog = [];
  const qualityMetrics = {
    totalCycles: 0,
    autonomousDecisions: 0,
    firstDecisionCycle: null,
    lastDecisionCycle: null,
    decisionTimestamps: [],
    patternMemory: new Map(),
    performanceHistory: [],
    cycleTimings: [],
    confidenceLevels: [],
    opportunityDetections: [],
    safeguardActivations: [],
    improvementActions: []
  };

  let cycleCount = 0;
  let lastProgressUpdate = 0;

  // Event listeners for comprehensive tracking
  system.on('cycle-start', (cycle) => {
    cycleCount = cycle;
    qualityMetrics.totalCycles = cycle;
  });

  system.on('decision', (decision) => {
    const timestamp = Date.now();
    decisionsLog.push({
      cycle: cycleCount,
      timestamp,
      approved: decision.approved?.length || 0,
      rejected: decision.rejected?.length || 0,
      pending: decision.pending?.length || 0,
      totalDecisions: (decision.approved?.length || 0) + (decision.rejected?.length || 0) + (decision.pending?.length || 0)
    });

    if (decision.approved?.length > 0) {
      qualityMetrics.autonomousDecisions += decision.approved.length;

      if (!qualityMetrics.firstDecisionCycle) {
        qualityMetrics.firstDecisionCycle = cycleCount;
        console.log(`\n🎯 FIRST AUTONOMOUS DECISION at cycle ${cycleCount}!`);
        console.log(`   Approved: ${decision.approved.length} decisions`);
      }

      qualityMetrics.lastDecisionCycle = cycleCount;
      qualityMetrics.decisionTimestamps.push(timestamp);

      // Log decision details
      decision.approved.forEach((approved, index) => {
        console.log(`   ✅ Decision ${index + 1}: ${approved.pattern || approved.name} (${approved.confidence?.toFixed(2) || 'N/A'})`);
        qualityMetrics.confidenceLevels.push(approved.confidence || 0);
      });

      console.log(`   📊 Total autonomous decisions so far: ${qualityMetrics.autonomousDecisions}`);
    }
  });

  system.on('opportunity-detected', (opportunity) => {
    qualityMetrics.opportunityDetections.push({
      cycle: cycleCount,
      pattern: opportunity.pattern,
      confidence: opportunity.confidence,
      seenCount: opportunity.seenCount,
      timestamp: Date.now()
    });
  });

  system.on('safeguard-activated', (safeguard) => {
    qualityMetrics.safeguardActivations.push({
      cycle: cycleCount,
      type: safeguard.type,
      reason: safeguard.reason,
      timestamp: Date.now()
    });
  });

  system.on('improvement-action', (action) => {
    qualityMetrics.improvementActions.push({
      cycle: cycleCount,
      type: action.type,
      target: action.target,
      success: action.success,
      timestamp: Date.now()
    });
  });

  system.on('cycle-complete', (metrics) => {
    qualityMetrics.cycleTimings.push(metrics.cycleTime || 0);
    qualityMetrics.performanceHistory.push({
      cycle: cycleCount,
      successRate: metrics.successRate || 0,
      averageConfidence: metrics.averageConfidence || 0,
      improvementRate: metrics.improvementRate || 0,
      memoryUsage: metrics.memoryUsage || 0,
      autonomyRate: metrics.autonomyRate || 0,
      totalCycles: metrics.totalCycles || 0,
      patternsDetected: metrics.patternsDetected || 0,
      highConfidencePatterns: metrics.highConfidencePatterns || 0
    });

    // Progress update every 50 cycles
    if (cycleCount - lastProgressUpdate >= 50) {
      lastProgressUpdate = cycleCount;
      console.log(`\n📊 Progress: ${cycleCount} cycles completed`);
      console.log(`   Autonomous decisions: ${qualityMetrics.autonomousDecisions}/10`);
      console.log(`   Average cycle time: ${(qualityMetrics.cycleTimings.reduce((a, b) => a + b, 0) / qualityMetrics.cycleTimings.length).toFixed(1)}ms`);
      console.log(`   Pattern memory size: ${system.learningEngine?.patternMemory?.size || 0} patterns`);
    }
  });

  // Start the system
  console.log('🔄 Starting Magnus Infinity system...');
  await system.start();

  // Wait for 10 autonomous decisions or 1000 cycles max
  while (qualityMetrics.autonomousDecisions < 10 && cycleCount < 1000) {
    await new Promise(resolve => setTimeout(resolve, 100)); // Small delay to prevent tight loop
  }

  // Stop the system
  console.log('\n🛑 Stopping system after reaching target...');
  await system.stop();

  // Generate comprehensive quality report
  console.log('\n📋 Generating Quality Report...');
  const report = generateQualityReport(qualityMetrics, decisionsLog, system);

  // Save report to file
  const reportPath = 'test-10-decisions-quality-report.json';
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  console.log(`✅ Quality report saved to: ${reportPath}`);

  // Print summary
  console.log('\n🎉 TEST COMPLETE - SUMMARY:');
  console.log('=' .repeat(50));
  console.log(`Total Cycles: ${qualityMetrics.totalCycles}`);
  console.log(`Autonomous Decisions: ${qualityMetrics.autonomousDecisions}`);
  console.log(`First Decision at Cycle: ${qualityMetrics.firstDecisionCycle || 'None'}`);
  console.log(`Last Decision at Cycle: ${qualityMetrics.lastDecisionCycle || 'None'}`);
  console.log(`Average Cycle Time: ${(qualityMetrics.cycleTimings.reduce((a, b) => a + b, 0) / qualityMetrics.cycleTimings.length).toFixed(1)}ms`);
  console.log(`Average Confidence: ${(qualityMetrics.confidenceLevels.reduce((a, b) => a + b, 0) / qualityMetrics.confidenceLevels.length).toFixed(3)}`);
  console.log(`Opportunities Detected: ${qualityMetrics.opportunityDetections.length}`);
  console.log(`Safeguards Activated: ${qualityMetrics.safeguardActivations.length}`);
  console.log(`Improvements Made: ${qualityMetrics.improvementActions.length}`);

  return report;
}

function generateQualityReport(qualityMetrics, decisionsLog, system) {
  const report = {
    testMetadata: {
      testType: 'Continuous Autonomous Decision Capture',
      targetDecisions: 10,
      maxCycles: 1000,
      timestamp: new Date().toISOString(),
      systemVersion: 'Magnus Infinity v∞',
      testDuration: Date.now() - qualityMetrics.startTime
    },
    decisionAnalysis: {
      totalDecisions: qualityMetrics.autonomousDecisions,
      firstDecisionCycle: qualityMetrics.firstDecisionCycle,
      lastDecisionCycle: qualityMetrics.lastDecisionCycle,
      decisionFrequency: qualityMetrics.decisionTimestamps.length > 1 ?
        (qualityMetrics.decisionTimestamps[qualityMetrics.decisionTimestamps.length - 1] - qualityMetrics.decisionTimestamps[0]) / (qualityMetrics.decisionTimestamps.length - 1) : 0,
      confidenceDistribution: {
        min: Math.min(...qualityMetrics.confidenceLevels),
        max: Math.max(...qualityMetrics.confidenceLevels),
        average: qualityMetrics.confidenceLevels.reduce((a, b) => a + b, 0) / qualityMetrics.confidenceLevels.length,
        median: calculateMedian(qualityMetrics.confidenceLevels)
      }
    },
    performanceMetrics: {
      totalCycles: qualityMetrics.totalCycles,
      averageCycleTime: qualityMetrics.cycleTimings.reduce((a, b) => a + b, 0) / qualityMetrics.cycleTimings.length,
      cycleTimeDistribution: {
        min: Math.min(...qualityMetrics.cycleTimings),
        max: Math.max(...qualityMetrics.cycleTimings),
        p95: calculatePercentile(qualityMetrics.cycleTimings, 95),
        p99: calculatePercentile(qualityMetrics.cycleTimings, 99)
      },
      memoryUsage: qualityMetrics.performanceHistory.length > 0 ?
        qualityMetrics.performanceHistory[qualityMetrics.performanceHistory.length - 1].memoryUsage : 0,
      autonomyRate: qualityMetrics.performanceHistory.length > 0 ?
        qualityMetrics.performanceHistory[qualityMetrics.performanceHistory.length - 1].autonomyRate : 0
    },
    learningAnalysis: {
      patternMemorySize: system.learningEngine?.patternMemory?.size || 0,
      totalPatternsLearned: Array.from(system.learningEngine?.patternMemory?.values() || []).reduce((sum, p) => sum + (p.seenCount || 0), 0),
      opportunityDetectionRate: qualityMetrics.opportunityDetections.length / qualityMetrics.totalCycles,
      learningEfficiency: qualityMetrics.autonomousDecisions / qualityMetrics.totalCycles
    },
    systemHealth: {
      safeguardsActivated: qualityMetrics.safeguardActivations.length,
      safeguardTypes: qualityMetrics.safeguardActivations.reduce((acc, s) => {
        acc[s.type] = (acc[s.type] || 0) + 1;
        return acc;
      }, {}),
      improvementsMade: qualityMetrics.improvementActions.length,
      improvementSuccessRate: qualityMetrics.improvementActions.filter(a => a.success).length / qualityMetrics.improvementActions.length
    },
    decisionLog: decisionsLog,
    opportunityLog: qualityMetrics.opportunityDetections,
    performanceHistory: qualityMetrics.performanceHistory,
    recommendations: generateRecommendations(qualityMetrics, system)
  };

  return report;
}

function calculateMedian(arr) {
  if (arr.length === 0) return 0;
  const sorted = arr.sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function calculatePercentile(arr, p) {
  if (arr.length === 0) return 0;
  const sorted = arr.sort((a, b) => a - b);
  const index = (p / 100) * (sorted.length - 1);
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  const weight = index % 1;

  if (upper >= sorted.length) return sorted[sorted.length - 1];
  return sorted[lower] * (1 - weight) + sorted[upper] * weight;
}

function generateRecommendations(qualityMetrics, system) {
  const recommendations = [];

  // Decision frequency analysis
  if (qualityMetrics.autonomousDecisions < 10) {
    recommendations.push({
      type: 'decision_frequency',
      priority: 'high',
      issue: 'Failed to reach 10 autonomous decisions within 1000 cycles',
      suggestion: 'Lower confidence threshold or adjust opportunity detection criteria',
      impact: 'System may be too conservative for autonomous operation'
    });
  }

  // Performance analysis
  const avgCycleTime = qualityMetrics.cycleTimings.reduce((a, b) => a + b, 0) / qualityMetrics.cycleTimings.length;
  if (avgCycleTime > 500) {
    recommendations.push({
      type: 'performance',
      priority: 'medium',
      issue: `Average cycle time (${avgCycleTime.toFixed(1)}ms) is high`,
      suggestion: 'Optimize scanner performance or reduce scan scope',
      impact: 'Slower response times may affect real-time operation'
    });
  }

  // Learning analysis
  const patternMemorySize = system.learningEngine?.patternMemory?.size || 0;
  if (patternMemorySize < 5) {
    recommendations.push({
      type: 'learning',
      priority: 'medium',
      issue: `Limited pattern memory (${patternMemorySize} patterns)`,
      suggestion: 'Increase pattern detection scope or adjust memory retention',
      impact: 'Reduced learning capability and decision quality'
    });
  }

  // Safeguard analysis
  if (qualityMetrics.safeguardActivations.length > qualityMetrics.autonomousDecisions) {
    recommendations.push({
      type: 'safety',
      priority: 'low',
      issue: 'High safeguard activation rate compared to decisions',
      suggestion: 'Review safeguard thresholds to balance safety and autonomy',
      impact: 'May be preventing beneficial autonomous actions'
    });
  }

  return recommendations;
}

// Run the test
if (require.main === module) {
  qualityMetrics.startTime = Date.now();
  runContinuousTest().catch(console.error);
}

module.exports = { runContinuousTest };