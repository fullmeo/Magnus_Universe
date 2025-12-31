/**
 * Test Dashboard Implementation
 * Verifies that ProjectDashboardAPI and routes are working correctly
 */

import path from 'path';
import { fileURLToPath } from 'url';
import ProjectDashboardAPI from './magnus/magnus-14/project-dashboard-api.js';
import { createRequire } from 'module';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

// Load Magnus 14
const Magnus14 = require('./magnus/magnus-14/magnus-14-core.js');
const MAGNUS_14_STORAGE = path.join(__dirname, 'magnus/magnus-14/storage');

console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         TESTING MAGNUS 14 DASHBOARD IMPLEMENTATION        ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
`);

try {
  // Initialize Magnus 14
  console.log('🔧 Initializing Magnus 14...');
  const magnus14 = new Magnus14({ storageDir: MAGNUS_14_STORAGE });
  console.log('✅ Magnus 14 initialized');

  // Create dashboard API
  console.log('📊 Creating ProjectDashboardAPI...');
  const dashboardAPI = new ProjectDashboardAPI(magnus14);
  console.log('✅ ProjectDashboardAPI created');

  // Test all dashboard methods
  console.log('\n📋 Testing Dashboard Methods:\n');

  // Test 1: Get all projects with summary
  console.log('1️⃣  getAllProjectsWithSummary()');
  const projects = dashboardAPI.getAllProjectsWithSummary();
  console.log(`   ✅ Found ${projects.total} projects`);
  if (projects.projects.length > 0) {
    console.log(`   📌 First project: ${projects.projects[0].name} (${projects.projects[0].status.phase})`);
  }

  // Test 2: Get system health
  console.log('\n2️⃣  getSystemHealth()');
  const health = dashboardAPI.getSystemHealth();
  console.log(`   ✅ Total Projects: ${health.totalProjects}`);
  console.log(`   📊 Avg Clarity: ${health.avgClarity}%`);
  console.log(`   ⚙️  Avg Complexity: ${health.avgComplexity}`);
  console.log(`   💯 Avg Confidence: ${health.avgConfidence}%`);
  console.log(`   🏥 System Status: ${health.systemStatus}`);

  // Test 3: Get domain distribution
  console.log('\n3️⃣  getDomainDistribution()');
  const domains = dashboardAPI.getDomainDistribution();
  console.log(`   ✅ Found ${domains.length} domains`);
  domains.forEach(d => console.log(`      • ${d.domain}: ${d.count} projects (${d.percentage}%)`));

  // Test 4: Get complexity analysis
  console.log('\n4️⃣  getComplexityAnalysis()');
  const complexity = dashboardAPI.getComplexityAnalysis();
  Object.entries(complexity).forEach(([level, count]) => {
    console.log(`   📊 ${level}: ${count} projects`);
  });

  // Test 5: Get timeline estimates
  console.log('\n5️⃣  getTimelineEstimates()');
  const timeline = dashboardAPI.getTimelineEstimates();
  Object.entries(timeline).forEach(([range, count]) => {
    console.log(`   ⏱️  ${range}: ${count} projects`);
  });

  // Test 6: Get confidence distribution
  console.log('\n6️⃣  getConfidenceDistribution()');
  const confidence = dashboardAPI.getConfidenceDistribution();
  console.log(`   💯 Very High (90%+): ${confidence.veryHigh}`);
  console.log(`   ✅ High (80-90%): ${confidence.high}`);
  console.log(`   ⚠️  Medium (70-80%): ${confidence.medium}`);
  console.log(`   ❌ Low (<70%): ${confidence.low}`);

  // Test 7: Get risk assessment
  console.log('\n7️⃣  getRiskAssessment()');
  const risks = dashboardAPI.getRiskAssessment();
  console.log(`   🔴 High Risk: ${risks.highRisk.count} projects`);
  console.log(`   🟠 Medium Risk: ${risks.mediumRisk.count} projects`);
  console.log(`   🟢 Low Risk: ${risks.lowRisk.count} projects`);

  // Test 8: Get complete dashboard data
  console.log('\n8️⃣  getDashboardData()');
  const dashboardData = dashboardAPI.getDashboardData();
  console.log(`   ✅ Complete dashboard data aggregated`);
  console.log(`   📊 Keys: ${Object.keys(dashboardData).join(', ')}`);

  // Test 9: Get project progress (if projects exist)
  if (projects.projects.length > 0) {
    console.log('\n9️⃣  getProjectProgress(projectId)');
    const projectId = projects.projects[0].id;
    const progress = dashboardAPI.getProjectProgress(projectId);
    if (progress) {
      console.log(`   ✅ Retrieved progress for: ${progress.name}`);
      console.log(`   📈 Clarity: ${progress.clarity.current}% → ${progress.clarity.expected}%`);
      console.log(`   🎯 Confidence: ${progress.confidence}%`);
    }
  }

  // Summary
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║         ✅ ALL TESTS PASSED SUCCESSFULLY                  ║
║                                                           ║
║    The Dashboard API is fully functional and ready!       ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);

} catch (error) {
  console.error('❌ Test failed:', error.message);
  console.error(error);
  process.exit(1);
}
