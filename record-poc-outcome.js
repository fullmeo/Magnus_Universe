#!/usr/bin/env node

/**
 * Record Latency POC Outcome in Magnus 14
 *
 * Feeds the actual latency measurements back to Magnus 14's learning system
 * This will improve predictions for future projects
 */

import { recordProjectOutcome, getAccuracyMetrics, initializeMagnus14, getMagnus14 } from './magnus-dashboard/server/magnus-14-integration.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load the POC results
const pocResultsPath = path.join(__dirname, 'latency-poc-results.json');
const pocResults = JSON.parse(fs.readFileSync(pocResultsPath, 'utf8'));

// Project ID from the earlier analysis
const projectId = 'proj_claude_code_framework_1765618892622';

// Path to the stored project analysis
const storageDir = path.join(__dirname, 'magnus/magnus-14/storage');
const projectFileName = `${projectId}.json`;
const projectFilePath = path.join(storageDir, projectFileName);

console.log('\n╔════════════════════════════════════════════════════════════════════════╗');
console.log('║                   RECORDING LATENCY POC OUTCOME                       ║');
console.log('╚════════════════════════════════════════════════════════════════════════╝\n');

console.log('📊 POC FINDINGS:');
console.log(`   End-to-End Latency: ${pocResults.end_to_end_average.toFixed(2)}ms`);
console.log(`   Target: < 100ms`);
console.log(`   Status: ${pocResults.findings.passes_100ms_target ? '✅ PASSED' : '⚠️ NEEDS OPTIMIZATION'}`);
console.log(`   Bottleneck: ${pocResults.bottleneck}`);
console.log('');

// Create outcome record matching Magnus 14's expected format
const actualOutcome = {
  actualSpiralCount: 1, // POC is phase 1
  actualIntegrationComplexity: 10, // Full complexity revealed during POC
  actualDurationMonths: 0.5, // POC took ~1 week (0.5 months)
  actualLatency: pocResults.end_to_end_average,
  latencyTarget: 100,
  latencyPassed: pocResults.findings.passes_100ms_target,
  bottleneck: pocResults.bottleneck,
  findings: pocResults.findings,
  recommendations: pocResults.recommendations,
  pocDate: pocResults.timestamp
};

console.log('📝 RECORDING OUTCOME:');
console.log(`   Project ID: ${projectId}`);
console.log(`   Actual Duration: ${actualOutcome.actualDurationMonths} months (POC phase)`);
console.log(`   Actual Integration Complexity: ${actualOutcome.actualIntegrationComplexity}/10`);
console.log(`   Actual Latency: ${actualOutcome.actualLatency.toFixed(2)}ms`);
console.log('');

// Record the outcome using Magnus 14 integration
async function main() {
  try {
    // Initialize Magnus 14 first
    console.log('🔧 Initializing Magnus 14...\n');
    await initializeMagnus14();

    // Load the stored project analysis into Magnus 14 instance
    console.log('📂 Loading project analysis from storage...');
    if (!fs.existsSync(projectFilePath)) {
      throw new Error(`Project file not found: ${projectFilePath}`);
    }

    const magnus14 = getMagnus14();
    if (!magnus14) {
      throw new Error('Magnus 14 instance not available');
    }

    // Load the stored analysis
    const storedAnalysis = JSON.parse(fs.readFileSync(projectFilePath, 'utf8'));

    // Manually add to magnus14 predictions array so recordOutcome can find it
    magnus14.predictions = [storedAnalysis];
    console.log('✅ Project analysis loaded\n');

    const result = await recordProjectOutcome(projectId, actualOutcome);

    if (result.success) {
      console.log('✅ OUTCOME RECORDED SUCCESSFULLY\n');

      console.log('📊 ACCURACY ANALYSIS:');
      if (result.outcome.accuracy.spiralCountAccuracy) {
        console.log(`   Spiral Count Accuracy: ${result.outcome.accuracy.spiralCountAccuracy.accuracy}%`);
      }
      if (result.outcome.accuracy.integrationComplexityAccuracy) {
        console.log(`   Integration Complexity Accuracy: ${result.outcome.accuracy.integrationComplexityAccuracy.accuracy}%`);
      }
      if (result.outcome.accuracy.durationAccuracy) {
        console.log(`   Duration Accuracy: ${result.outcome.accuracy.durationAccuracy.accuracy}%`);
      }
      console.log('');

      if (result.outcome.learnings && result.outcome.learnings.length > 0) {
        console.log('💡 LEARNINGS FROM THIS PROJECT:');
        result.outcome.learnings.forEach((learning, idx) => {
          const learningText = typeof learning === 'string' ? learning : JSON.stringify(learning);
          console.log(`   ${idx + 1}. ${learningText}`);
        });
        console.log('');
      }

      if (result.outcome.recommendations && result.outcome.recommendations.length > 0) {
        console.log('🎯 RECOMMENDATIONS FOR NEXT PHASE:');
        result.outcome.recommendations.forEach((rec, idx) => {
          const recText = typeof rec === 'string' ? rec : JSON.stringify(rec);
          console.log(`   ${idx + 1}. ${recText}`);
        });
        console.log('');
      }

      // Get updated accuracy metrics
      const metrics = getAccuracyMetrics();
      if (metrics.success && metrics.data.averageAccuracy) {
        console.log('📈 MAGNUS 14 PREDICTION ACCURACY (ALL PROJECTS):');
        console.log(`   Average Accuracy: ${metrics.data.averageAccuracy.toFixed(1)}%`);
        console.log(`   Projects Analyzed: ${metrics.data.totalProjectsAnalyzed}`);
        console.log(`   Projects with Outcomes: ${metrics.data.totalProjectsWithOutcomes}`);
        console.log('');
      }

      console.log('✨ MAGNUS 14 LEARNING SYSTEM UPDATED');
      console.log('🚀 Next: Use updated insights for next project analysis\n');
    } else {
      console.error('❌ Failed to record outcome:', result.message);
      process.exit(1);
    }
  } catch (error) {
    console.error('❌ Error recording outcome:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
