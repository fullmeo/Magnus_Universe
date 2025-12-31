/**
 * Test script for Magnus ∞ Infinity Launcher
 * Simplified test to verify system initialization
 */

import launchInfinity from './infinity-launcher.js';

async function testInfinity() {
  console.log('\n🚀 Starting Magnus ∞ Infinity System Test\n');

  try {
    // Launch the system
    const system = await launchInfinity({
      userId: process.env.USER || 'serigne',
      autonomyLevel: 'supervised',
      enableScanner: true,
      enableCloudSync: false, // Disabled since no CloudZero endpoint
      enableDashboard: false, // Disabled to avoid port conflict
      enableAPI: false, // Disabled to avoid port conflict
      learningRate: 0.1,
      confidenceThreshold: 0.7,
      enableSelfImprovement: true,
      enableSafeguards: true
    });

    console.log('\n✅ System initialized successfully!\n');
    console.log('Components:');
    console.log(`  Scanner: ${system.magnus14 ? '✅' : '❌'}`);
    console.log(`  Cloud Sync: ${system.cloudSync ? '✅' : '❌'}`);
    console.log(`  Dashboard: ${system.dashboard ? '✅ (http://localhost:3000)' : '❌'}`);
    console.log(`  API: ${system.api ? '✅ (http://localhost:4000)' : '❌'}`);
    console.log(`  Infinity Core: ${system.infinity ? '✅' : '❌'}`);

    console.log('\n📊 System Status:');
    const status = system.infinity.getStatus();
    console.log(`  Initialized: ${status.initialized}`);
    console.log(`  Running: ${status.running}`);
    console.log(`  Autonomy Level: ${system.infinity.config.autonomyLevel}`);
    console.log(`  Safeguards: ${system.infinity.config.enableSafeguards ? 'ENABLED' : 'DISABLED'}`);

    console.log('\n♾️  Ready to start the ∞ Loop!\n');
    console.log('Options:');
    console.log('  • system.infinity.start() - Begin the ∞ Loop');
    console.log('  • system.infinity.stop()  - Stop the ∞ Loop');
    console.log('  • system.infinity.getStatus() - Check status\n');

    // Keep running for 10 seconds to show initialization
    await new Promise(resolve => setTimeout(resolve, 10000));

    console.log('\n🛑 Test completed. Shutting down...\n');
    await system.dashboard?.stop();
    await system.api?.stop();
    process.exit(0);

  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  }
}

testInfinity();
