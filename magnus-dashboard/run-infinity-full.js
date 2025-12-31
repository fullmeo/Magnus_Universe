#!/usr/bin/env node
import launchInfinity from './infinity-launcher.js';

async function main() {
  console.log('\n🚀 Magnus ∞ Infinity System Launcher (Full Mode)\n');
  try {
    const system = await launchInfinity({
      userId: process.env.USER || 'infinity-user',
      autonomyLevel: process.env.AUTONOMY_LEVEL || 'supervised',
      enableScanner: true,
      enableCloudSync: !!process.env.CLOUDZERO_ENDPOINT,
      enableDashboard: true,
      enableAPI: true,
      dashboardPort: 3000,
      apiPort: 4000,
      learningRate: 0.1,
      confidenceThreshold: 0.7,
      enableSelfImprovement: true,
      enableSafeguards: true
    });

    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutdown...');
      if (system.infinity.running) await system.infinity.stop();
      if (system.dashboard) await system.dashboard.stop();
      if (system.api) await system.api.stop();
      console.log('✅ Complete\n');
      process.exit(0);
    });
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();
