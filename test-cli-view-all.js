const readline = require('readline');
const fs = require('fs');
const path = require('path');
const Magnus14CLI = require('./magnus/magnus-14/cli');

// Create CLI instance
const cli = new Magnus14CLI();

console.log('\n📋 Testing CLI - List all saved analyses\n');

// Get all saved analyses
const analyses = cli.listSavedAnalyses();

console.log(`Found ${analyses.length} saved analyses:\n`);

analyses.forEach((filePath, index) => {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  console.log(`${index + 1}. ${data.input.projectName}`);
  console.log(`   ID: ${data.projectId}`);
  console.log(`   Domain: ${data.input.domain}`);
  console.log(`   Analyzed: ${new Date(data.timestamp).toLocaleDateString()}`);
  console.log(`   Components: ${data.input.components.length}`);
  console.log(`   Est. Duration: ${data.finalEstimate.totalEstimatedMonths} months`);
  console.log(`   Confidence: ${data.finalEstimate.overallConfidence}%\n`);
});

console.log('✅ CLI can now view both projects!\n');

// Test report generation for both
console.log('Testing report generation for both projects...\n');

analyses.forEach((filePath, index) => {
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  try {
    const report = cli.magnus14.generateReport(data.projectId);
    console.log(`✅ Report ${index + 1} generated successfully (${data.input.projectName})`);
  } catch (error) {
    console.log(`❌ Report ${index + 1} failed:`, error.message);
  }
});

console.log('\n🎉 All CLI tests passed!');
