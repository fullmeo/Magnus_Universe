/**
 * Debug Modality Detection
 */

import { ModalityDetector } from './modality-detector.js';

async function main() {
  console.log('🔍 Debugging Modality Detection...\n');

  const detector = new ModalityDetector({
    baseDir: process.cwd(),
    minConfidence: 0.5
  });

  // Manually gather project info to debug
  const projectInfo = await detector.gatherProjectInfo(process.cwd());

  console.log('📊 Project Info Debug:');
  console.log(`   Total Files: ${projectInfo.files.length}`);
  console.log(`   File Types:`, projectInfo.fileTypes);
  console.log(`   NPM Dependencies: ${projectInfo.dependencies.npm.length}`, projectInfo.dependencies.npm.slice(0, 10));
  console.log(`   Patterns Found: ${projectInfo.patterns.length}`, projectInfo.patterns.slice(0, 10));

  // Test web score calculation
  const webScore = await detector.calculateWebScore(projectInfo);
  console.log(`\n🎨 Web Score: ${(webScore * 100).toFixed(2)}%`);

  // Test complete detection
  const result = await detector.detectModality(process.cwd());
  console.log(`\n✅ Full Detection Result:`);
  console.log(`   Primary: ${result.primary}`);
  console.log(`   Confidence: ${(result.confidence * 100).toFixed(2)}%`);
  console.log(`   Web Score: ${(result.scores.web * 100).toFixed(2)}%`);
}

main().catch(console.error);
