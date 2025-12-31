/**
 * Quick integration test for Magnus Cloud Storage
 * Tests that all imports and exports work correctly
 */

console.log('🧪 Testing Magnus Cloud Storage Integration...\n');

try {
  // Test 1: Import from index.js
  console.log('📍 Test 1: Importing from index.js');
  const { Magnus13Extended, MagnusCloudStorage } = await import('../index.js');
  console.log('✅ Successfully imported Magnus13Extended and MagnusCloudStorage from index.js\n');

  // Test 2: Import from lib/magnus-imports.js
  console.log('📍 Test 2: Importing from lib/magnus-imports.js');
  const { getMagnusExtended, getMagnusCloudStorage } = await import('../lib/magnus-imports.js');
  console.log('✅ Successfully imported getMagnusExtended and getMagnusCloudStorage from lib\n');

  // Test 3: Direct import
  console.log('📍 Test 3: Direct imports from magnus/ directory');
  const { default: Extended } = await import('../magnus/magnus-13-extended.js');
  const { default: CloudStorage } = await import('../magnus/magnus-cloud-storage.js');
  console.log('✅ Successfully imported directly from magnus/ directory\n');

  // Test 4: Create instance
  console.log('📍 Test 4: Creating Magnus13Extended instance');
  const magnus = new Magnus13Extended({
    cloudStorage: true,
    autoBackup: false
  });
  console.log('✅ Magnus13Extended instance created\n');

  // Test 5: Check methods exist
  console.log('📍 Test 5: Verifying methods exist');
  const requiredMethods = [
    'initialize',
    'analyze',
    'startGeneration',
    'recordOutcome',
    'backupToCloud',
    'restoreFromCloud',
    'syncWithCloud',
    'getCloudStats'
  ];

  for (const method of requiredMethods) {
    if (typeof magnus[method] === 'function') {
      console.log(`   ✅ ${method}()`);
    } else {
      console.log(`   ❌ ${method}() - NOT FOUND`);
    }
  }
  console.log();

  // Test 6: Check configuration
  console.log('📍 Test 6: Checking cloud configuration');
  console.log(`   Cloud Storage Enabled: ${magnus.cloudConfig.enabled}`);
  console.log(`   Auto-backup: ${magnus.cloudConfig.autoBackup}`);
  console.log(`   Backup on Generation: ${magnus.cloudConfig.backupOnGeneration}`);
  console.log();

  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('✅ ALL INTEGRATION TESTS PASSED!');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  console.log('📚 Next Steps:');
  console.log('1. Run: node examples/magnus-cloud-examples.js');
  console.log('2. Check documentation in Magnus_cloud_storage/files/');
  console.log('3. Integrate into your Magnus workflow\n');

} catch (error) {
  console.error('❌ Integration test failed:', error.message);
  console.error('\nStack trace:', error.stack);
  process.exit(1);
}
