#!/usr/bin/env node
import launchInfinity from './infinity-launcher.js';

async function main() {
  console.log('\n🚀 Magnus ∞ Infinity System (Auto-Start Mode)\n');
  try {
    const system = await launchInfinity({
      userId: process.env.USER || 'infinity-user',
      autonomyLevel: process.env.AUTONOMY_LEVEL || 'supervised',
      enableScanner: true,
      enableCloudSync: !!process.env.CLOUDZERO_ENDPOINT,
      enableDashboard: false,
      enableAPI: false,
      learningRate: 0.1,
      confidenceThreshold: 0.7,
      enableSelfImprovement: true,
      enableSafeguards: true
    });

    console.log('\n⏱️  Starting ∞ Loop in 2 seconds...\n');
    console.log('Press Ctrl+C to stop\n');

    setTimeout(async () => {
      try {
        await system.infinity.start();
      } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
      }
    }, 2000);

    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutting down gracefully...');
      try {
        if (system.infinity.running) {
          await system.infinity.stop();
        }
        console.log('✅ Magnus ∞ stopped\n');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
      }
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
