/**
 * Magnus ∞ - Launcher
 * 
 * Launches Magnus Infinity with full ecosystem integration
 */

import MagnusInfinity from './magnus-infinity-core.js';
import Magnus14 from './magnus-14.js';
import MagnusCloudSync from './magnus-cloud-sync.js';
import DashboardServer from './dashboard-server.js';
import MagnusAPI from './magnus-api.js';

async function launchInfinity(config = {}) {
  console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║              MAGNUS ∞ - LAUNCHER                      ║
║                                                       ║
║  "Self-Improving AI with Transparency and Safety"     ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
  `);

  try {
    // Initialize Magnus Ecosystem
    console.log('🔧 Initializing Magnus Ecosystem...\n');

    // Cloud Sync (optional)
    let cloudSync = null;
    if (config.enableCloudSync !== false && process.env.CLOUDZERO_ENDPOINT) {
      console.log('☁️  Initializing Cloud Sync...');
      cloudSync = new MagnusCloudSync({
        cloudZeroEndpoint: process.env.CLOUDZERO_ENDPOINT,
        apiKey: process.env.CLOUDZERO_API_KEY,
        userId: config.userId || 'infinity-user'
      });
      await cloudSync.initialize();
      console.log('✅ Cloud Sync ready\n');
    }

    // Magnus 14 Scanner
    let magnus14 = null;
    if (config.enableScanner !== false) {
      console.log('🔍 Initializing Magnus Scanner...');
      magnus14 = new Magnus14({ cloudSync });
      await magnus14.initialize();
      console.log('✅ Scanner ready\n');
    }

    // Dashboard (optional)
    let dashboard = null;
    if (config.enableDashboard !== false) {
      console.log('🎨 Initializing Dashboard...');
      dashboard = new DashboardServer({
        port: config.dashboardPort || 3000,
        magnus14,
        cloudSync
      });
      await dashboard.start();
      console.log('✅ Dashboard ready\n');
    }

    // API (optional)
    let api = null;
    if (config.enableAPI !== false) {
      console.log('🔌 Initializing API...');
      api = new MagnusAPI({
        port: config.apiPort || 4000,
        magnus14,
        cloudSync
      });
      await api.start();
      console.log('✅ API ready\n');
    }

    // Magnus ∞
    console.log('🌌 Initializing Magnus ∞...\n');
    const infinity = new MagnusInfinity({
      learningRate: config.learningRate || 0.1,
      confidenceThreshold: config.confidenceThreshold || 0.7,
      autonomyLevel: config.autonomyLevel || 'supervised',
      enableSelfImprovement: config.enableSelfImprovement !== false,
      enableSafeguards: config.enableSafeguards !== false
    });

    await infinity.initialize();

    // Integrate components
    infinity.magnus14 = magnus14;
    infinity.cloudSync = cloudSync;
    infinity.dashboard = dashboard;
    infinity.api = api;

    // Setup event listeners
    setupEventListeners(infinity);

    console.log(`
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║              MAGNUS ∞ - READY TO START                ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝

Components Initialized:
${magnus14 ? '✅ Magnus 14 Scanner' : '⏸️  Magnus 14 Scanner (disabled)'}
${cloudSync ? '✅ Cloud Sync' : '⏸️  Cloud Sync (disabled)'}
${dashboard ? '✅ Dashboard (http://localhost:' + (config.dashboardPort || 3000) + ')' : '⏸️  Dashboard (disabled)'}
${api ? '✅ API (http://localhost:' + (config.apiPort || 4000) + ')' : '⏸️  API (disabled)'}
✅ Magnus ∞ Core

Autonomy Level: ${config.autonomyLevel || 'supervised'}
Safeguards: ${config.enableSafeguards !== false ? 'ENABLED' : 'DISABLED'}
Learning Rate: ${config.learningRate || 0.1}

Ready to start the ∞ Loop!
Type: infinity.start() to begin

Kill Switch: ARMED ✅
    `);

    // Handle graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n🛑 Shutting down Magnus ∞...');
      
      await infinity.stop();
      if (dashboard) await dashboard.stop();
      if (api) await api.stop();
      if (cloudSync) await cloudSync.shutdown();
      
      console.log('✅ Shutdown complete');
      process.exit(0);
    });

    return {
      infinity,
      magnus14,
      cloudSync,
      dashboard,
      api
    };

  } catch (error) {
    console.error('❌ Failed to launch Magnus ∞:', error);
    process.exit(1);
  }
}

/**
 * Setup event listeners for monitoring
 */
function setupEventListeners(infinity) {
  // Cycle events
  infinity.on('cycle-start', (cycle) => {
    console.log(`\n♾️  Cycle ${cycle.number} starting...`);
  });

  infinity.on('cycle-complete', (cycle) => {
    console.log(`✅ Cycle ${cycle.number} completed in ${Date.now() - cycle.timestamp}ms`);
  });

  infinity.on('cycle-blocked', ({ cycle, validation }) => {
    console.log(`⚠️  Cycle ${cycle.number} blocked by: ${validation.blockedBy}`);
    console.log(`   Reason: ${validation.reason}`);
  });

  // Improvement events
  infinity.on('improvement', (improvement) => {
    console.log(`📈 Improvement: ${improvement.type}`);
  });

  // Decision events
  infinity.on('decision', (decision) => {
    console.log(`🤔 Decision made: ${decision.approved?.length || 0} approved, ${decision.rejected?.length || 0} rejected`);
  });

  // Safeguard events
  infinity.on('safeguard-block', (event) => {
    console.log(`🛡️  Safeguard ${event.layer} blocked action`);
    console.log(`   Reason: ${event.reason}`);
  });

  // Kill switch
  infinity.on('kill-switch', (event) => {
    console.log(`\n🔴 KILL SWITCH ACTIVATED`);
    console.log(`   Reason: ${event.reason}`);
    console.log(`   Time: ${new Date(event.timestamp).toISOString()}`);
  });

  // Approval required
  infinity.on('approval-required', (decision) => {
    console.log(`\n👤 HUMAN APPROVAL REQUIRED`);
    console.log(`   Decision: ${JSON.stringify(decision, null, 2)}`);
    console.log(`   Waiting for approval...`);
  });

  // Errors
  infinity.on('error', ({ error, cycle }) => {
    console.error(`❌ Error in cycle ${cycle}:`, error);
  });
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  launchInfinity({
    userId: process.env.USER || 'serigne',
    autonomyLevel: process.env.AUTONOMY_LEVEL || 'supervised',
    enableScanner: true,
    enableCloudSync: !!process.env.CLOUDZERO_ENDPOINT,
    enableDashboard: true,
    enableAPI: true,
    learningRate: 0.1,
    confidenceThreshold: 0.7,
    enableSelfImprovement: true,
    enableSafeguards: true
  }).then((system) => {
    // Don't auto-start - let user decide
    console.log('\nTo start the ∞ Loop, use:');
    console.log('  system.infinity.start()');
    console.log('\nTo stop:');
    console.log('  system.infinity.stop()');
    console.log('\nTo check status:');
    console.log('  system.infinity.getStatus()');
  });
}

export default launchInfinity;
