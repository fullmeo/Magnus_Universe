/**
 * Modality Detection Test Script
 *
 * Tests the ModalityDetector to validate detection accuracy
 */

import { ModalityDetector } from './modality-detector.js';

async function main() {
  console.log('🧪 Testing Modality Detection...\n');

  const detector = new ModalityDetector({
    baseDir: process.cwd(),
    minConfidence: 0.5
  });

  // Test on current project
  console.log('📊 Analyzing current project (magnus-dashboard)...\n');

  try {
    const result = await detector.detectModality(process.cwd());

    console.log('✅ Detection Results:');
    console.log(`   Primary Modality: ${result.primary}`);
    console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`   Multi-Modal: ${result.isMultiModal ? 'Yes' : 'No'}`);

    if (result.secondary.length > 0) {
      console.log(`   Secondary Modalities: ${result.secondary.join(', ')}`);
    }

    console.log('\n📈 Modality Scores:');
    console.log(`   Web: ${(result.scores.web * 100).toFixed(1)}%`);
    console.log(`   Mobile: ${(result.scores.mobile * 100).toFixed(1)}%`);
    console.log(`   Data: ${(result.scores.data * 100).toFixed(1)}%`);

    console.log('\n📁 Project Info:');
    console.log(`   Total Files: ${result.projectInfo.totalFiles}`);
    console.log(`   Detection Time: ${result.detectionTime}ms`);

    if (Object.keys(result.projectInfo.fileTypes).length > 0) {
      console.log('\n📝 Top File Types:');
      const sortedTypes = Object.entries(result.projectInfo.fileTypes)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 10);

      sortedTypes.forEach(([ext, count]) => {
        console.log(`   ${ext || '(no extension)'}: ${count} files`);
      });
    }

    // Validation
    console.log('\n\n🎯 Validation:');

    const expectedModality = 'web'; // Expected for magnus-dashboard
    const detectedCorrectly = result.primary === expectedModality;

    if (detectedCorrectly) {
      console.log(`   ✅ PASS: Correctly detected ${expectedModality} modality`);
    } else {
      console.log(`   ❌ FAIL: Expected ${expectedModality}, got ${result.primary}`);
    }

    if (result.confidence >= 0.6) {
      console.log(`   ✅ PASS: Confidence score ${(result.confidence * 100).toFixed(1)}% >= 60%`);
    } else {
      console.log(`   ⚠️  WARN: Confidence score ${(result.confidence * 100).toFixed(1)}% < 60%`);
    }

    if (result.detectionTime < 2000) {
      console.log(`   ✅ PASS: Detection time ${result.detectionTime}ms < 2000ms`);
    } else {
      console.log(`   ⚠️  WARN: Detection time ${result.detectionTime}ms >= 2000ms`);
    }

    console.log('\n\n🏁 Test Complete');

    // Summary
    const passed = detectedCorrectly && result.confidence >= 0.6 && result.detectionTime < 2000;
    console.log(`\nStatus: ${passed ? '✅ ALL TESTS PASSED' : '⚠️  SOME TESTS FAILED'}`);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

main().catch(console.error);
