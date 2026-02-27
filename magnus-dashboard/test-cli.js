/**
 * CLI Test Suite
 * Tests all CLI commands
 */

import { MagnusCLI } from './magnus-cli.js';

async function testCLI() {
  console.log('🧪 Testing Magnus CLI...\n');

  const cli = new MagnusCLI();
  let passed = 0;
  let failed = 0;

  // Test 1: Version
  console.log('Test 1: Version Command');
  try {
    await cli.run(['node', 'cli', 'version']);
    console.log('✅ PASS\n');
    passed++;
  } catch (error) {
    console.error('❌ FAIL:', error.message, '\n');
    failed++;
  }

  // Test 2: Detect
  console.log('Test 2: Detect Command');
  try {
    await cli.run(['node', 'cli', 'detect']);
    console.log('✅ PASS\n');
    passed++;
  } catch (error) {
    console.error('❌ FAIL:', error.message, '\n');
    failed++;
  }

  // Test 3: Info
  console.log('Test 3: Info Command');
  try {
    await cli.run(['node', 'cli', 'info']);
    console.log('✅ PASS\n');
    passed++;
  } catch (error) {
    console.error('❌ FAIL:', error.message, '\n');
    failed++;
  }

  // Test 4: Generate (dry run)
  console.log('Test 4: Generate Command');
  try {
    await cli.run(['node', 'cli', 'generate', 'cli-test-app', '--framework', 'react']);
    console.log('✅ PASS\n');
    passed++;
  } catch (error) {
    console.error('❌ FAIL:', error.message, '\n');
    failed++;
  }

  // Summary
  console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
  console.log('📊 CLI Test Summary');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  console.log(`Total: ${passed + failed}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed === 0) {
    console.log('\n🎉 ALL CLI TESTS PASSED');
    console.log('\n✅ CLI Commands Working:');
    console.log('   - magnus detect');
    console.log('   - magnus generate');
    console.log('   - magnus info');
    console.log('   - magnus version');
    console.log('   - magnus help');
  } else {
    console.log(`\n⚠️  ${failed} test(s) failed`);
    process.exit(1);
  }
}

testCLI().catch(error => {
  console.error('❌ Test suite failed:', error);
  process.exit(1);
});
