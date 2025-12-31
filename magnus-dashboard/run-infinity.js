#!/usr/bin/env node

/**
 * Magnus ∞ - Run Script
 *
 * Simple executable to launch the Magnus Infinity system
 * with full ecosystem support and auto-start of the ∞ Loop
 */

import launchInfinity from './infinity-launcher.js';

async function main() {
  console.log('\n🚀 Magnus ∞ Infinity System Launcher\n');

  try {
    // Get configuration from environment or use defaults
    const config = {
      userId: process.env.USER || 'infinity-user',
      autonomyLevel: process.env.AUTONOMY_LEVEL || 'supervised',
      enableScanner: true,
      enableCloudSync: !!process.env.CLOUDZERO_ENDPOINT,
      enableDashboard: process.env.ENABLE_DASHBOARD !== 'false',
      enableAPI: process.env.ENABLE_API !== 'false',
      dashboardPort: parseInt(process.env.DASHBOARD_PORT || 3000),
      apiPort: parseInt(process.env.API_PORT || 4000),
      learningRate: parseFloat(process.env.LEARNING_RATE || 0.1),
      confidenceThreshold: parseFloat(process.env.CONFIDENCE_THRESHOLD || 0.7),
      enableSelfImprovement: true,
      enableSafeguards: true,
      explainabilityLevel: process.env.EXPLAINABILITY_LEVEL || 'detailed'
    };

    // Launch the system
    const system = await launchInfinity(config);

    // Set up keyboard interrupt handling
    process.on('SIGINT', async () => {
      console.log('\n\n🛑 Shutdown signal received...');
      try {
        if (system.infinity.running) {
          await system.infinity.stop();
        }
        if (system.dashboard) {
          await system.dashboard.stop();
        }
        if (system.api) {
          await system.api.stop();
        }
        if (system.cloudSync) {
          await system.cloudSync.shutdown();
        }
        console.log('✅ Magnus ∞ shutdown complete\n');
        process.exit(0);
      } catch (error) {
        console.error('❌ Error during shutdown:', error.message);
        process.exit(1);
      }
    });

    // Start the ∞ Loop if auto-start is enabled
    if (process.env.AUTO_START !== 'false') {
      console.log('\n⏱️  Starting the ∞ Loop in 3 seconds...\n');
      console.log('Press Ctrl+C to stop\n');

      setTimeout(async () => {
        try {
          await system.infinity.start();
        } catch (error) {
          console.error('❌ Failed to start ∞ Loop:', error.message);
          process.exit(1);
        }
      }, 3000);
    } else {
      console.log('\n📝 System ready but not auto-starting ∞ Loop');
      console.log('   Use AUTO_START=true to enable auto-start\n');
      console.log('Available commands in Node REPL:');
      console.log('  system.infinity.start()     - Begin the ∞ Loop');
      console.log('  system.infinity.stop()      - Stop the ∞ Loop');
      console.log('  system.infinity.getStatus() - Check status');
      console.log('  system.magnus14.scan(path)  - Scan code\n');
    }

  } catch (error) {
    console.error('\n❌ Failed to launch Magnus ∞:', error.message);
    console.error('\nDebug info:', error);
    process.exit(1);
  }
}

main();
