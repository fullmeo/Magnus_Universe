/**
 * Magnus 13 Extended - Usage Example
 *
 * Demonstrates Magnus with CloudZero Storage integration
 */

import Magnus13Extended from '../magnus/magnus-13-extended.js';

// ============================================================================
// EXAMPLE 1: Basic Usage with Auto-Backup
// ============================================================================

async function example1_basicUsage() {
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('EXAMPLE 1: Basic Usage with Cloud Backup');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Initialize Magnus with cloud storage
  const magnus = new Magnus13Extended({
    cloudStorage: true,      // Enable cloud storage
    autoBackup: true,        // Auto-backup every hour
    backupOnGeneration: true // Backup after each generation
  });

  await magnus.initialize();

  // Analyze a request
  const analysis = await magnus.analyze(`
    Create a React dashboard with:
    - User authentication
    - Real-time data updates
    - Payment integration
    - Email notifications
  `);

  console.log('\n📊 Analysis Results:');
  console.log(`   Clarity: ${analysis.understanding.clarityScore}/100`);
  console.log(`   Complexity: ${analysis.complexity.overall.score}/10`);
  console.log(`   Can proceed: ${analysis.canProceed}`);

  if (analysis.canProceed) {
    // Start generation (automatically backed up to cloud)
    const session = await magnus.startGeneration(analysis);

    console.log(`\n✅ Generation started: ${session.sessionId}`);
    console.log('   Session automatically backed up to S3');

    // Simulate successful generation
    await magnus.recordOutcome(session.sessionId, {
      outcome: 'SUCCESS',
      tokensUsed: 15000,
      iterations: 3,
      filesGenerated: 12,
      quality: 'PRODUCTION_READY'
    });

    console.log('\n☁️  Learning data automatically backed up to cloud');
  }

  // Cleanup
  await magnus.cleanup();
}

// ============================================================================
// EXAMPLE 2: Manual Cloud Backup
// ============================================================================

async function example2_manualBackup() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('EXAMPLE 2: Manual Cloud Backup');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const magnus = new Magnus13Extended({
    cloudStorage: true,
    autoBackup: false  // Manual backup only
  });

  await magnus.initialize();

  // Do some work...
  const analysis = await magnus.analyze('Build a simple blog system');

  // Manually trigger backup
  console.log('💾 Manually backing up to cloud...');
  const backupResults = await magnus.backupToCloud();

  console.log('\n✅ Backup complete:');
  console.log(`   Learning: ${backupResults.learning ? 'backed up' : 'skipped'}`);
  console.log(`   Sessions: ${backupResults.sessions.length} backed up`);
  console.log(`   Errors: ${backupResults.errors.length}`);

  await magnus.cleanup();
}

// ============================================================================
// EXAMPLE 3: Restore from Cloud
// ============================================================================

async function example3_restoreFromCloud() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('EXAMPLE 3: Restore from Cloud');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const magnus = new Magnus13Extended({
    cloudStorage: true
  });

  await magnus.initialize();

  // Restore learning data from cloud
  console.log('📥 Restoring learning data from cloud...');

  try {
    const restored = await magnus.restoreFromCloud('latest');

    console.log('\n✅ Data restored:');
    console.log(`   Patterns: ${restored.patterns?.length || 0}`);
    console.log(`   Estimates: ${restored.estimates?.length || 0}`);
    console.log(`   Actuals: ${restored.actuals?.length || 0}`);

    // Now Magnus has all its previous learning!
    const stats = magnus.getKnowledgeStats();
    console.log('\n📚 Knowledge stats after restore:');
    console.log(`   Patterns: ${stats.patterns}`);
    console.log(`   Samples: ${stats.samples}`);
  } catch (error) {
    console.log(`⚠️  Restore skipped: ${error.message}`);
  }

  await magnus.cleanup();
}

// ============================================================================
// EXAMPLE 4: Multi-Machine Sync
// ============================================================================

async function example4_multiMachineSync() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('EXAMPLE 4: Multi-Machine Sync');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const magnus = new Magnus13Extended({
    cloudStorage: true,
    autoBackup: true
  });

  await magnus.initialize();

  console.log('💻 Scenario: Working from different machines\n');

  // Machine 1: Do some work
  console.log('🖥️  Machine 1: Generating project...');
  const analysis = await magnus.analyze('Create API gateway');

  if (analysis.canProceed) {
    const session = await magnus.startGeneration(analysis);
    await magnus.recordOutcome(session.sessionId, {
      outcome: 'SUCCESS',
      tokensUsed: 8000
    });
    console.log('   ✅ Work backed up to cloud');
  }

  // Machine 2: Sync and continue
  console.log('\n💻 Machine 2: Syncing from cloud...');
  const syncResults = await magnus.syncWithCloud();

  console.log('   ✅ Sync complete:');
  console.log(`      Uploaded: ${syncResults.uploaded}`);
  console.log(`      Downloaded: ${syncResults.downloaded}`);
  console.log('\n   Magnus now has all learning from Machine 1!');

  await magnus.cleanup();
}

// ============================================================================
// EXAMPLE 5: Disaster Recovery
// ============================================================================

async function example5_disasterRecovery() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('EXAMPLE 5: Disaster Recovery');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('💥 Scenario: Local data lost (crash, corruption, etc.)\n');

  const magnus = new Magnus13Extended({
    cloudStorage: true
  });

  await magnus.initialize();

  // Try to restore from cloud
  console.log('🔄 Attempting recovery from cloud...');

  try {
    const restored = await magnus.restoreFromCloud('latest');

    console.log('\n✅ Recovery successful!');
    console.log('   All learning data restored');
    console.log('   Magnus ready to continue');

    // Magnus can now continue as if nothing happened
    const stats = magnus.getKnowledgeStats();
    console.log(`\n   Recovered patterns: ${stats.patterns}`);
    console.log(`   Recovered samples: ${stats.samples}`);
  } catch (error) {
    console.log(`\n❌ Recovery failed: ${error.message}`);
    console.log('   Starting fresh...');
  }

  await magnus.cleanup();
}

// ============================================================================
// EXAMPLE 6: Cloud Storage Stats
// ============================================================================

async function example6_cloudStats() {
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('EXAMPLE 6: Cloud Storage Stats');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  const magnus = new Magnus13Extended({
    cloudStorage: true,
    autoBackup: true,
    backupInterval: 1800000 // 30 minutes
  });

  await magnus.initialize();

  // Get cloud storage stats
  const stats = await magnus.getCloudStats();

  console.log('☁️  Cloud Storage Configuration:');
  console.log(`   Enabled: ${stats.autoBackup}`);
  console.log(`   Auto-backup: ${stats.autoBackup}`);
  console.log(`   Interval: ${stats.backupInterval / 1000 / 60} minutes`);
  console.log(`   Storage prefix: ${stats.storagePrefix}`);
  console.log(`   Initialized: ${stats.initialized}`);

  await magnus.cleanup();
}

// ============================================================================
// RUN ALL EXAMPLES
// ============================================================================

async function runAllExamples() {
  try {
    await example1_basicUsage();
    await example2_manualBackup();
    await example3_restoreFromCloud();
    await example4_multiMachineSync();
    await example5_disasterRecovery();
    await example6_cloudStats();

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ All examples completed!');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Example failed:', error);
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runAllExamples();
}

export {
  example1_basicUsage,
  example2_manualBackup,
  example3_restoreFromCloud,
  example4_multiMachineSync,
  example5_disasterRecovery,
  example6_cloudStats
};
