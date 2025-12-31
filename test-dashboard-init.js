#!/usr/bin/env node

/**
 * Test Dashboard Server Initialization
 * Traces each step to find where it hangs
 */

import DashboardServer from './magnus-dashboard/server/dashboard-server.js';
import { initializeMagnus14 } from './magnus-dashboard/server/magnus-14-integration.js';

console.log('\n╔═══════════════════════════════════════════════════════╗');
console.log('║      Dashboard Server Initialization Trace            ║');
console.log('╚═══════════════════════════════════════════════════════╝\n');

async function testDashboardInit() {
  try {
    console.log('📍 Step 1: Creating DashboardServer instance...');
    const server = new DashboardServer({
      port: 3001, // Use different port to avoid conflicts
      host: 'localhost',
      enableWebSocket: true,
      corsEnabled: true,
      magnus14: null // Start with null
    });
    console.log('✅ DashboardServer created\n');

    console.log('📍 Step 2: Starting server...');
    const startPromise = server.start();

    // Add timeout to prevent infinite hanging
    const serverStartTimeout = setTimeout(() => {
      console.error('\n❌ TIMEOUT: Server start() method is hanging!');
      console.error('   The server failed to call the listen callback\n');
      process.exit(1);
    }, 10000);

    await startPromise;
    clearTimeout(serverStartTimeout);
    console.log('✅ Server started\n');

    // Test a simple request
    console.log('📍 Step 3: Testing HTTP request to server...');
    const response = await fetch('http://localhost:3001/api/health', {
      method: 'GET',
      timeout: 5000
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Health check responded:', data.status);
    } else {
      console.log('⚠️  Health check returned:', response.status);
    }

    console.log('\n📍 Step 4: Testing Magnus 14 route...');
    try {
      const statusResponse = await fetch('http://localhost:3001/api/magnus14/status', {
        method: 'GET',
        timeout: 5000
      });

      if (statusResponse.ok) {
        const data = await statusResponse.json();
        console.log('✅ Magnus 14 status responded');
        console.log('   Response:', JSON.stringify(data, null, 2));
      } else {
        console.log('⚠️  Status returned:', statusResponse.status);
      }
    } catch (error) {
      console.error('❌ Status request failed:', error.message);
    }

    // Shutdown
    console.log('\n📍 Step 5: Shutting down server...');
    await server.stop();
    console.log('✅ Server stopped\n');

    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║                    TEST RESULTS                       ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    console.log('✅ Dashboard server initializes without hanging\n');

  } catch (error) {
    console.error('\n❌ Error during initialization:');
    console.error('   ', error.message);
    if (error.stack) {
      console.error('\nStack trace:');
      console.error(error.stack);
    }
    process.exit(1);
  }
}

testDashboardInit();
