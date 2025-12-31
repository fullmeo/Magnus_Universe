const path = require('path');
const fs = require('fs');
const Magnus14 = require('./magnus/magnus-14/magnus-14-core');

const storageDir = path.join(__dirname, 'magnus/magnus-14/storage');
const magnus14 = new Magnus14({ storageDir });

// Fuzzy Oracle project input
const projectInput = {
  projectName: 'Fuzzy Oracle MVP',
  domain: 'blockchain',
  description: 'MVP prediction oracle with smart contract and web interface. BTC price predictions, staking mechanism, user dashboard, pinky mascot animations',
  currentClarity: 55,
  estimatedComplexity: 8,
  components: [
    { name: 'prediction-contract', complexity: 8 },
    { name: 'oracle-integration', complexity: 7 },
    { name: 'frontend-dashboard', complexity: 6 },
    { name: 'pinky-animation-system', complexity: 5 },
    { name: 'price-feed-aggregator', complexity: 7 },
    { name: 'reward-distribution', complexity: 6 }
  ],
  blockers: [],
  teamSize: 3,
  timeline: 'flexible'
};

console.log('\n📊 Analyzing "Fuzzy Oracle MVP" project...');
console.log('⚙️  Running all 6 signature engines...\n');

try {
  const analysis = magnus14.analyzeProject(projectInput);

  console.log('✅ Analysis complete!\n');
  console.log('Project ID:', analysis.projectId);
  console.log('Timestamp:', analysis.timestamp);

  // Save analysis to disk
  const filePath = path.join(storageDir, `${analysis.projectId}.json`);
  fs.writeFileSync(filePath, JSON.stringify(analysis, null, 2));
  console.log(`💾 Saved to disk`);

  // Generate report
  const report = magnus14.generateReport(analysis.projectId);

  // Display portion of report
  console.log(report.substring(0, 2000));
  console.log('\n... [full report continues] ...\n');

  console.log(`✅ Report generated successfully!`);
  console.log(`📁 Analysis saved to: ${filePath}`);

  // Verify file was saved
  if (fs.existsSync(filePath)) {
    const fileSize = fs.statSync(filePath).size;
    console.log(`📦 File size: ${(fileSize / 1024).toFixed(2)} KB`);
  }

} catch (error) {
  console.error('❌ Error during analysis:', error.message);
  console.error(error.stack);
}
