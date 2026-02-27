/**
 * Test ModalityDetector on the actual magnus-dashboard project
 */

import { ModalityDetector } from './magnus-dashboard/modality-detector.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testMagnusDashboard() {
  console.log('='.repeat(60));
  console.log('TESTING: magnus-dashboard project');
  console.log('='.repeat(60));
  
  const detector = new ModalityDetector();
  const dashboardPath = path.join(__dirname, 'magnus-dashboard');
  
  try {
    const result = await detector.detectModality(dashboardPath);
    
    console.log('\n📊 RESULT:\n');
    console.log(`Primary Modality: ${result.primary}`);
    console.log(`Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    console.log(`Base Confidence: ${(result.baseConfidence * 100).toFixed(1)}%`);
    console.log(`Scores: Web=${(result.scores.web * 100).toFixed(1)}%, Mobile=${(result.scores.mobile * 100).toFixed(1)}%, Data=${(result.scores.data * 100).toFixed(1)}%`);
    console.log(`Is Multi-Modal: ${result.isMultiModal}`);
    console.log(`Total Files: ${result.projectInfo.totalFiles}`);
    console.log(`Strong Indicators: ${result.projectInfo.strongIndicatorsFound}`);
    console.log(`Patterns Found: ${result.projectInfo.strongIndicatorsFound}`);
    console.log(`Fallback Reason: ${result.fallbackReason || 'none'}`);
    
    // Check for NaN
    if (isNaN(result.confidence)) {
      console.log('\n❌ ERROR: Confidence is NaN!');
      process.exit(1);
    } else {
      console.log('\n✅ SUCCESS: No NaN in confidence');
    }
    
    // Check result is valid
    if (result.primary === 'unknown') {
      console.log('\n⚠️  Modality is unknown - may need more patterns');
    } else {
      console.log(`\n✅ Modality detected: ${result.primary}`);
    }
    
  } catch (error) {
    console.error('\n❌ ERROR:', error.message);
    process.exit(1);
  }
}

testMagnusDashboard();
