#!/usr/bin/env node

/**
 * Simple Direct Test
 * Test the /api/magnus14/status endpoint by making an HTTP request
 */

import http from 'http';
import DashboardServer from './magnus-dashboard/server/dashboard-server.js';

console.log('\n🧪 Direct Endpoint Test\n');

const server = new DashboardServer({
  port: 3003,
  host: 'localhost'
});

server.start()
  .then(() => {
    console.log('✅ Server started\n');

    // Wait a moment for routes to be ready
    setTimeout(() => {
      testEndpoint('/api/magnus14/status');
    }, 500);
  })
  .catch(err => {
    console.error('❌ Server failed:', err.message);
    process.exit(1);
  });

function testEndpoint(path) {
  console.log(`🧪 Testing ${path}...\n`);

  const options = {
    hostname: 'localhost',
    port: 3003,
    path: path,
    method: 'GET',
    timeout: 5000
  };

  const req = http.request(options, (res) => {
    console.log(`📊 Status Code: ${res.statusCode}`);
    console.log(`📋 Headers: `, res.headers);

    let data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', () => {
      console.log(`📦 Response body: ${data.substring(0, 200)}...\n`);
      server.stop().then(() => {
        console.log('✅ Server stopped');
        process.exit(0);
      });
    });
  });

  req.on('error', (err) => {
    console.error(`❌ Request error: ${err.message}\n`);
    server.stop().then(() => {
      process.exit(1);
    });
  });

  req.on('timeout', () => {
    console.error(`❌ Request timeout (5 seconds)\n`);
    req.destroy();
    server.stop().then(() => {
      process.exit(1);
    });
  });

  req.end();
}
