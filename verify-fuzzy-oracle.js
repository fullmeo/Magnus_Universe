const path = require('path');
const Magnus14 = require('./magnus/magnus-14/magnus-14-core');

const storageDir = path.join(__dirname, 'magnus/magnus-14/storage');
const magnus14 = new Magnus14({ storageDir });

const projectId = 'proj_fuzzy_oracle_mvp_1765640343312';

console.log('\n🔍 Testing retrieval of saved Fuzzy Oracle analysis...\n');

const analysis = magnus14.getProjectAnalysis(projectId);

if (analysis) {
  console.log('✅ SUCCESS! Analysis successfully loaded from storage!');
  console.log('\n📋 Project Details:');
  console.log(`  Name: ${analysis.input.projectName}`);
  console.log(`  Domain: ${analysis.input.domain}`);
  console.log(`  Components: ${analysis.input.components.length}`);
  console.log(`  Team Size: ${analysis.input.teamSize}`);
  console.log(`  Current Clarity: ${analysis.input.currentClarity}%`);

  console.log('\n📊 Analysis Results Summary:');
  console.log(`  Expected Spirals: ${analysis.spiralAnalysis.expectedSpiralCount}`);
  console.log(`  Clarity Time: ${analysis.spiralAnalysis.totalClarityTime}`);
  console.log(`  Domain Complexity: ${analysis.domainAnalysis.domainComplexity}/10`);
  console.log(`  Technical Complexity: ${analysis.domainAnalysis.technicalComplexity}/10`);
  console.log(`  Real Blocker: ${analysis.domainAnalysis.realBlocker.toUpperCase()}`);
  console.log(`  Integration Complexity: ${analysis.integrationAnalysis.integrationComplexity}/10`);
  console.log(`  POC Required: ${analysis.pocAnalysis.pocRequired ? 'YES' : 'NO'}`);
  console.log(`  Critical Assumptions: ${analysis.pocAnalysis.criticalAssumptions.length}`);
  console.log(`  Total Estimated Duration: ${analysis.finalEstimate.totalEstimatedMonths} months`);
  console.log(`  Overall Confidence: ${analysis.finalEstimate.overallConfidence}%`);

  console.log('\n📈 Component Analysis:');
  analysis.input.components.forEach(comp => {
    console.log(`  • ${comp.name} (complexity: ${comp.complexity})`);
  });

  console.log('\n🎯 Critical Assumptions to Validate:');
  analysis.pocAnalysis.criticalAssumptions.forEach((assumption, idx) => {
    console.log(`  ${idx + 1}. ${assumption.assumption}`);
    console.log(`     Risk: ${assumption.risk}`);
    console.log(`     Validation: ${assumption.validation}`);
  });

  console.log('\n✅ Storage test complete - analysis is fully functional!');

} else {
  console.log('❌ FAILED - Analysis not found');
}
