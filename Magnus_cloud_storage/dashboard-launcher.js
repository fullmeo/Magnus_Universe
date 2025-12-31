/**
 * Magnus Dashboard Launcher
 * 
 * Easy startup script for Magnus Dashboard 15.3
 * Integrates all Magnus components
 */

import DashboardServer from './dashboard-server.js';
import Magnus14 from './magnus-14.js';
import MagnusCloudSync from './magnus-cloud-sync.js';
import WatcherOrchestrator from './watcher-orchestrator.js';

async function launchDashboard(config = {}) {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║         MAGNUS DASHBOARD 15.3 - LAUNCHER              ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);

  try {
    // Initialize components
    console.log('🔧 Initializing Magnus components...');

    // Cloud Sync (optional)
    let cloudSync = null;
    if (config.enableCloudSync !== false && process.env.CLOUDZERO_ENDPOINT) {
      cloudSync = new MagnusCloudSync({
        cloudZeroEndpoint: process.env.CLOUDZERO_ENDPOINT,
        apiKey: process.env.CLOUDZERO_API_KEY,
        userId: config.userId || 'default-user',
        autoSync: true
      });

      await cloudSync.initialize();
      console.log('✅ Cloud Sync initialized');
    } else {
      console.log('ℹ️  Cloud Sync disabled (set CLOUDZERO_ENDPOINT to enable)');
    }

    // Magnus 14 (optional)
    let magnus14 = null;
    if (config.enableMagnus !== false) {
      magnus14 = new Magnus14({
        cloudSync
      });

      await magnus14.initialize();
      console.log('✅ Magnus 14 initialized');
    }

    // Watcher (optional)
    let watcher = null;
    if (config.enableWatcher !== false && config.watchPath) {
      watcher = new WatcherOrchestrator({
        cloudSync
      });

      console.log('✅ Watcher initialized');
    }

    // Dashboard Server
    const server = new DashboardServer({
      port: config.port || 3000,
      host: config.host || 'localhost',
      magnus14,
      cloudSync,
      watcher,
      staticDir: config.staticDir
    });

    await server.start();

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down...');
      
      await server.stop();
      
      if (cloudSync) {
        await cloudSync.shutdown();
      }
      
      if (watcher) {
        await watcher.stop();
      }
      
      console.log('✅ Shutdown complete');
      process.exit(0);
    });

    return {
      server,
      magnus14,
      cloudSync,
      watcher
    };

  } catch (error) {
    console.error('❌ Failed to launch dashboard:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  launchDashboard({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    userId: process.env.USER || 'default-user',
    enableCloudSync: true,
    enableMagnus: true,
    enableWatcher: false
  });
}

export default launchDashboard;
