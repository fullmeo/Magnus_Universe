#!/usr/bin/env node

/**
 * Test Server with Detailed Logging
 * Starts a dashboard server on port 3002 with comprehensive request logging
 */

import DashboardServer from './magnus-dashboard/server/dashboard-server.js';

console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║      Dashboard Server - Debug Mode                   ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

const server = new DashboardServer({
  port: 3002,
  host: 'localhost',
  enableWebSocket: true,
  corsEnabled: true,
  magnus14: null
});

console.log('🚀 Starting server on port 3002...\n');

server.start()
  .then(() => {
    console.log('\n✅ Server started successfully!\n');
    console.log('📡 Testing endpoints:');
    console.log('   http://localhost:3002/api/health');
    console.log('   http://localhost:3002/api/magnus14/status\n');

    // Keep server running for testing
    console.log('⏳ Server is running. Send requests to test.\n');
    console.log('Press Ctrl+C to stop.\n');

    // Auto-shutdown after 60 seconds
    setTimeout(() => {
      console.log('\n⏱️  Auto-shutting down after 60 seconds...');
      server.stop().then(() => {
        console.log('✅ Server stopped');
        process.exit(0);
      });
    }, 60000);
  })
  .catch(err => {
    console.error('❌ Failed to start server:');
    console.error(err.message);
    process.exit(1);
  });

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\n\n🛑 Shutting down...');
  await server.stop();
  console.log('✅ Server stopped');
  process.exit(0);
});
