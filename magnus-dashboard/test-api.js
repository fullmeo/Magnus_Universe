#!/usr/bin/env node

/**
 * API Test Script
 * Tests Magnus 14 API endpoints
 */

import http from 'http';
import { spawn } from 'child_process';

const BASE_URL = 'http://localhost:3000';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function makeRequest(path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    http.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: JSON.parse(data)
          });
        } catch (e) {
          resolve({
            status: res.statusCode,
            headers: res.headers,
            body: data
          });
        }
      });
    }).on('error', reject);
  });
}

async function testAPI() {
  console.log('\n╔═══════════════════════════════════════════════════════╗');
  console.log('║         Magnus 14 API Test Suite                      ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');

  // Start the server
  console.log('🚀 Starting Dashboard Server...');
  const server = spawn('node', ['dashboard-launcher-standalone.js'], {
    cwd: process.cwd(),
    stdio: 'pipe'
  });

  let serverReady = false;

  server.stdout.on('data', (data) => {
    const msg = data.toString();
    console.log('📡 Server:', msg.trim());
    if (msg.includes('listening') || msg.includes('started')) {
      serverReady = true;
    }
  });

  server.stderr.on('data', (data) => {
    console.error('❌ Server Error:', data.toString().trim());
  });

  // Wait for server to start
  console.log('⏳ Waiting for server to start...');
  for (let i = 0; i < 15; i++) {
    try {
      const result = await makeRequest('/api/magnus14/status');
      if (result.status === 200) {
        console.log('✅ Server is ready!\n');
        serverReady = true;
        break;
      }
    } catch (e) {
      // Server not ready yet
    }
    await sleep(500);
  }

  if (!serverReady) {
    console.log('❌ Server failed to start');
    server.kill();
    process.exit(1);
  }

  // Run tests
  const tests = [
    { name: 'GET /api/magnus14/status', path: '/api/magnus14/status' },
    { name: 'GET /api/magnus14/projects', path: '/api/magnus14/projects' },
    { name: 'GET /api/magnus14/domains', path: '/api/magnus14/domains' },
    { name: 'GET /api/magnus14/accuracy', path: '/api/magnus14/accuracy' },
    { name: 'GET /api/magnus14/learning', path: '/api/magnus14/learning' }
  ];

  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    console.log(`🧪 Testing: ${test.name}`);
    try {
      const result = await makeRequest(test.path);

      if (result.status === 200) {
        console.log(`   ✅ Status: ${result.status}`);
        console.log(`   📦 Response:`, JSON.stringify(result.body).substring(0, 100) + '...');
        passed++;
      } else {
        console.log(`   ⚠️  Status: ${result.status}`);
        console.log(`   📦 Response:`, JSON.stringify(result.body).substring(0, 100) + '...');
        failed++;
      }
    } catch (error) {
      console.log(`   ❌ Error: ${error.message}`);
      failed++;
    }
    console.log();
  }

  // Cleanup
  console.log('╔═══════════════════════════════════════════════════════╗');
  console.log('║                    Test Results                       ║');
  console.log('╚═══════════════════════════════════════════════════════╝\n');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📊 Total:  ${tests.length}\n`);

  server.kill();
  process.exit(failed > 0 ? 1 : 0);
}

testAPI().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
