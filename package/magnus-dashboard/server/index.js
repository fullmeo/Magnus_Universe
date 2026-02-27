/**
 * Magnus Dashboard - Server Entry Point
 * Instantiates and starts the dashboard server
 */
import { initializeMagnus } from './magnus-integration.js';
import { initializeMagnus14 } from './magnus-14-integration.js';
import { initializeMagnus14Storage } from './magnus-14-storage.js';
import DashboardServer from './dashboard-server.js';

async function main() {
  try {
    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║         MAGNUS DASHBOARD 15.3 - STARTING             ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');

    // Initialize Magnus 13
    console.log('🧠 Initializing Magnus 13...');
    await initializeMagnus();

    // Initialize Magnus 14
    console.log('🧠 Initializing Magnus 14...');
    const magnus14 = await initializeMagnus14();

    // Initialize Magnus 14 storage
    let storageData = null;
    if (magnus14) {
      storageData = await initializeMagnus14Storage();
    }

    const port = process.env.PORT || 3000;
    const host = process.env.HOST || 'localhost';

    const server = new DashboardServer({
      port: port,
      host: host,
      enableWebSocket: true,
      corsEnabled: true,
      magnus14: magnus14
    });

    await server.start();

    console.log('\n╔═══════════════════════════════════════════════════════╗');
    console.log('║         MAGNUS DASHBOARD 15.3 - RUNNING               ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    console.log(`🌐 Dashboard URL: http://${host}:${port}`);
    console.log(`📡 API Endpoint: http://${host}:${port}/api`);
    console.log(`🔌 WebSocket: ws://${host}:${port}`);
    console.log('\n✅ Server ready\n');

    // Graceful shutdown
    process.on('SIGINT', async () => {
      console.log('\n\n📍 Shutting down gracefully...');
      await server.stop();
      process.exit(0);
    });

    process.on('SIGTERM', async () => {
      console.log('\n\n📍 Shutting down gracefully...');
      await server.stop();
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error(error);
    process.exit(1);
  }
}

main();
