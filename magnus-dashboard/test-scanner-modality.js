/**
 * Scanner + Modality Integration Test
 *
 * Tests the integration between Magnus 14 Scanner and Modality Detector
 */

import Magnus14Simple from './magnus-14-simple.js';

async function main() {
  console.log('🧪 Testing Magnus 14 Scanner + Modality Detection Integration...\n');

  const scanner = new Magnus14Simple({
    verbose: true,
    minConfidenceThreshold: 0.5,
    maxFilesPerScan: 50,
    baseDir: process.cwd()
  });

  try {
    console.log('📊 Scanning current project (magnus-dashboard)...\n');

    const startTime = Date.now();
    const results = await scanner.scan(process.cwd());
    const totalTime = Date.now() - startTime;

    console.log('\n\n✅ Scan Results:');
    console.log(`   Patterns Detected: ${results.patterns.length}`);
    console.log(`   Friction Points: ${results.friction.length}`);
    console.log(`   Average Confidence: ${(results.confidence * 100).toFixed(1)}%`);
    console.log(`   Total Scan Time: ${totalTime}ms`);

    console.log('\n🎨 Modality Results:');
    console.log(`   Primary Modality: ${results.modality.primary}`);
    console.log(`   Confidence: ${(results.modality.confidence * 100).toFixed(1)}%`);
    console.log(`   Multi-Modal: ${results.modality.isMultiModal ? 'Yes' : 'No'}`);

    if (results.modality.secondary.length > 0) {
      console.log(`   Secondary Modalities: ${results.modality.secondary.join(', ')}`);
    }

    console.log('\n📈 Modality Scores:');
    console.log(`   Web: ${(results.modality.scores.web * 100).toFixed(1)}%`);
    console.log(`   Mobile: ${(results.modality.scores.mobile * 100).toFixed(1)}%`);
    console.log(`   Data: ${(results.modality.scores.data * 100).toFixed(1)}%`);

    console.log('\n📁 Detection Info:');
    console.log(`   Total Files Analyzed: ${results.modality.projectInfo.totalFiles}`);
    console.log(`   Modality Detection Time: ${results.modality.detectionTime}ms`);

    // Validation
    console.log('\n\n🎯 Integration Validation:');

    const hasPatterns = results.patterns.length > 0;
    if (hasPatterns) {
      console.log(`   ✅ PASS: Scanner detected ${results.patterns.length} patterns`);
    } else {
      console.log(`   ❌ FAIL: Scanner detected 0 patterns`);
    }

    const hasModality = results.modality && results.modality.primary !== 'unknown';
    if (hasModality) {
      console.log(`   ✅ PASS: Modality detector identified ${results.modality.primary}`);
    } else {
      console.log(`   ❌ FAIL: Modality detector failed to identify modality`);
    }

    const expectedModality = 'web';
    const correctModality = results.modality.primary === expectedModality;
    if (correctModality) {
      console.log(`   ✅ PASS: Correctly detected ${expectedModality} modality`);
    } else {
      console.log(`   ⚠️  WARN: Expected ${expectedModality}, got ${results.modality.primary}`);
    }

    const goodConfidence = results.modality.confidence >= 0.6;
    if (goodConfidence) {
      console.log(`   ✅ PASS: Modality confidence ${(results.modality.confidence * 100).toFixed(1)}% >= 60%`);
    } else {
      console.log(`   ⚠️  WARN: Modality confidence ${(results.modality.confidence * 100).toFixed(1)}% < 60%`);
    }

    const fastDetection = totalTime < 5000;
    if (fastDetection) {
      console.log(`   ✅ PASS: Total scan time ${totalTime}ms < 5000ms`);
    } else {
      console.log(`   ⚠️  WARN: Total scan time ${totalTime}ms >= 5000ms`);
    }

    // Pattern + Modality correlation check
    console.log('\n🔍 Pattern-Modality Correlation:');

    const webPatterns = results.patterns.filter(p =>
      p.type.includes('async') || p.type.includes('promise') || p.type.includes('import')
    );

    if (webPatterns.length > 0 && results.modality.primary === 'web') {
      console.log(`   ✅ PASS: Found ${webPatterns.length} web-related patterns matching web modality`);
    } else if (results.modality.primary === 'web') {
      console.log(`   ℹ️  INFO: Web modality detected without obvious web patterns`);
    }

    // Pattern memory check
    if (results.modality.patternMemory) {
      console.log('\n💾 Pattern Memory:');
      console.log(`   Total Projects Tracked: ${results.modality.patternMemory.totalProjects}`);
      console.log(`   Average Confidence: ${results.modality.patternMemory.averageConfidence}%`);

      if (results.modality.patternMemory.modalityDistribution) {
        console.log('   Distribution:', results.modality.patternMemory.modalityDistribution);
      }
    }

    console.log('\n\n🏁 Integration Test Complete');

    // Summary
    const allPassed = hasPatterns && hasModality && correctModality && goodConfidence && fastDetection;
    console.log(`\nStatus: ${allPassed ? '✅ ALL TESTS PASSED' : '⚠️  SOME TESTS FAILED/WARNED'}`);

    if (allPassed) {
      console.log('\n🎉 Scanner + Modality integration is working perfectly!');
      console.log('✅ Ready for pattern memory integration (Day 2 Task 2)');
    }

  } catch (error) {
    console.error('❌ Integration test failed:', error);
    console.error('Stack:', error.stack);
    process.exit(1);
  }
}

main().catch(console.error);
