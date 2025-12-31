const path = require('path');
const Magnus14 = require('./magnus/magnus-14/magnus-14-core');

const storageDir = path.join(__dirname, 'magnus/magnus-14/storage');
const magnus14 = new Magnus14({ storageDir });

const projectId = 'proj_fuzzy_oracle_mvp_1765640343312';

console.log('\n' + '═'.repeat(80));
console.log('MAGNUS 14 - FUZZY ORACLE MVP - COMPLETE ANALYSIS REPORT');
console.log('═'.repeat(80));

const analysis = magnus14.getProjectAnalysis(projectId);

if (analysis) {
  const report = magnus14.generateReport(projectId);
  console.log(report);

  console.log('\n' + '═'.repeat(80));
  console.log('ANALYSIS COMPLETE');
  console.log('═'.repeat(80));
  console.log(`\n✅ Project ID: ${analysis.projectId}`);
  console.log(`✅ Analyzed: ${analysis.timestamp}`);
  console.log(`✅ Storage: Magnus/magnus-14/storage/${analysis.projectId}.json`);
  console.log(`✅ File Size: ${require('fs').statSync(path.join(storageDir, `${analysis.projectId}.json`)).size} bytes`);

} else {
  console.log('\n❌ Analysis not found');
}
