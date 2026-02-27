/**
 * Modality Detector Accuracy Test
 * Tests the detector against known projects and measures accuracy
 */

import { ModalityDetector } from './magnus-dashboard/modality-detector.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function runAccuracyTests() {
  console.log('='.repeat(60));
  console.log('MODALITY DETECTOR ACCURACY TEST');
  console.log('='.repeat(60));
  
  const detector = new ModalityDetector();
  
  const testProjects = [
    {
      name: 'Web React',
      path: path.join(__dirname, 'test-projects/web-react'),
      expected: 'web'
    },
    {
      name: 'Mobile React Native',
      path: path.join(__dirname, 'test-projects/mobile-react-native'),
      expected: 'mobile'
    },
    {
      name: 'Data Science',
      path: path.join(__dirname, 'test-projects/data-science'),
      expected: 'data'
    }
  ];
  
  let correct = 0;
  let total = testProjects.length;
  
  console.log('\n📊 TEST RESULTS:\n');
  
  for (const test of testProjects) {
    try {
      const result = await detector.detectModality(test.path);
      const isCorrect = result.primary === test.expected;
      
      if (isCorrect) correct++;
      
      const status = isCorrect ? '✅ PASS' : '❌ FAIL';
      console.log(`${status} | ${test.name.padEnd(25)} |`);
      console.log(`    Expected: ${test.expected} | Got: ${result.primary} | Confidence: ${(result.confidence * 100).toFixed(1)}%`);
      console.log(`    Scores: Web=${(result.scores.web * 100).toFixed(1)}%, Mobile=${(result.scores.mobile * 100).toFixed(1)}%, Data=${(result.scores.data * 100).toFixed(1)}%`);
      console.log(`    Accuracy Estimate: ${(result.accuracyEstimate * 100).toFixed(1)}%`);
      console.log('');
    } catch (error) {
      console.log(`❌ ERROR | ${test.name}`);
      console.log(`    ${error.message}`);
      console.log('');
    }
  }
  
  const accuracy = (correct / total) * 100;
  
  console.log('='.repeat(60));
  console.log(`FINAL RESULTS: ${correct}/${total} correct (${accuracy.toFixed(1)}% accuracy)`);
  console.log('='.repeat(60));
  
  if (accuracy >= 75) {
    console.log('🎉 TARGET ACHIEVED! 75%+ accuracy - Ready for v1.0 publish');
  } else {
    console.log('⚠️  Below 75% target - Needs more iteration');
  }
  
  return accuracy;
}

runAccuracyTests().catch(console.error);
