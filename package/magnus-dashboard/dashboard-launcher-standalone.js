/**
 * Magnus Dashboard - Standalone Launcher
 * 
 * Runs dashboard server without requiring all Magnus components
 * Components can be added later
 */

import DashboardServer from './server/dashboard-server.js';

async function launchDashboard(config = {}) {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║         MAGNUS DASHBOARD 15.3 - LAUNCHER              ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);

  try {
    console.log('🔧 Initializing Dashboard...');

    // Dashboard Server (standalone mode)
    const server = new DashboardServer({
      port: config.port || 3000,
      host: config.host || 'localhost',
      staticDir: config.staticDir || './public',
      magnus14: null,
      cloudSync: null,
      watcher: null
    });

    await server.start();

    console.log('\n💡 Dashboard running in STANDALONE mode');
    console.log('   To enable Magnus features, update imports in dashboard-launcher.js\n');

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down...');
      await server.stop();
      console.log('✅ Shutdown complete');
      process.exit(0);
    });

    return { server };

  } catch (error) {
    console.error('❌ Failed to launch dashboard:', error);
    console.error('\nTroubleshooting:');
    console.error('1. Make sure files are in correct directories');
    console.error('2. Run: npm install');
    console.error('3. Check that ./public directory exists');
    console.error('4. Check that ./server/dashboard-server.js exists');
    process.exit(1);
  }
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  launchDashboard({
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    staticDir: process.env.STATIC_DIR || './public'
  });
}

export default launchDashboard;
