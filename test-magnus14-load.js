#!/usr/bin/env node

/**
 * Test Magnus 14 module loading
 * Checks if the module loads without hanging
 */

import path from 'path';
import { fileURLToPath } from 'url';
import { existsSync } from 'fs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function testMagnus14Loading() {
  console.log('\n🧪 Testing Magnus 14 Module Loading\n');

  const MAGNUS_14_PATH = path.join(__dirname, 'magnus/magnus-14');
  const coreModulePath = path.join(MAGNUS_14_PATH, 'magnus-14-core.js');
  const improverPath = path.join(MAGNUS_14_PATH, 'learning/prediction-improver.js');

  console.log('📍 Module paths:');
  console.log(`   Core: ${coreModulePath}`);
  console.log(`   Improver: ${improverPath}\n`);

  console.log('✓ Checking if files exist...');
  console.log(`   Core exists: ${existsSync(coreModulePath)}`);
  console.log(`   Improver exists: ${existsSync(improverPath)}\n`);

  try {
    console.log('⏳ Loading Magnus 14 core module (30 second timeout)...');
    const startTime = Date.now();

    // Set a timeout to prevent infinite hanging
    const loadTimeout = setTimeout(() => {
      console.error('\n❌ TIMEOUT: Module load is hanging!');
      console.error('   The module took more than 30 seconds to load');
      console.error('   This indicates a circular dependency or blocking operation\n');
      process.exit(1);
    }, 30000);

    // Try to load the module
    const { createRequire } = await import('module');
    const require = createRequire(import.meta.url);

    console.log('   Attempting require()...');
    const Magnus14 = require(coreModulePath);
    clearTimeout(loadTimeout);

    const loadTime = Date.now() - startTime;
    console.log(`✅ Core module loaded successfully in ${loadTime}ms\n`);

    console.log('   Module exports:', Object.keys(Magnus14).length > 0 ? 'Yes' : 'No');
    if (typeof Magnus14 === 'function') {
      console.log('   Module type: Constructor (class)');
    } else if (typeof Magnus14 === 'object') {
      console.log('   Module type: Object');
      console.log('   Keys:', Object.keys(Magnus14).slice(0, 5).join(', '), '...');
    }

    console.log('\n⏳ Creating Magnus 14 instance...');
    const startInstance = Date.now();

    const instanceTimeout = setTimeout(() => {
      console.error('\n❌ TIMEOUT: Instance creation is hanging!');
      console.error('   This indicates blocking code in the constructor\n');
      process.exit(1);
    }, 10000);

    const magnus14Instance = new Magnus14();
    clearTimeout(instanceTimeout);

    const instanceTime = Date.now() - startInstance;
    console.log(`✅ Instance created successfully in ${instanceTime}ms\n`);

    // Try loading the improver
    console.log('⏳ Loading Prediction Improver...');
    const startImprover = Date.now();

    const improverTimeout = setTimeout(() => {
      console.error('\n❌ TIMEOUT: Improver load is hanging!');
      process.exit(1);
    }, 10000);

    const PredictionImprover = require(improverPath);
    clearTimeout(improverTimeout);

    const improverLoadTime = Date.now() - startImprover;
    console.log(`✅ Improver loaded successfully in ${improverLoadTime}ms\n`);

    console.log('✅ Creating Improver instance...');
    const predictionImprover = new PredictionImprover();
    console.log('✅ Improver instance created successfully\n');

    console.log('╔═══════════════════════════════════════════════════════╗');
    console.log('║             LOADING TEST RESULTS                      ║');
    console.log('╚═══════════════════════════════════════════════════════╝\n');
    console.log('✅ All modules load successfully');
    console.log(`✅ Core module: ${loadTime}ms`);
    console.log(`✅ Instance creation: ${instanceTime}ms`);
    console.log(`✅ Improver module: ${improverLoadTime}ms`);
    console.log(`✅ Total initialization: ${loadTime + instanceTime + improverLoadTime}ms\n`);

    console.log('🟢 STATUS: Magnus 14 modules are loading correctly\n');

  } catch (error) {
    console.error('\n❌ Error loading Magnus 14 modules:');
    console.error('   ', error.message);
    console.error('\n📍 Stack trace:');
    console.error(error.stack);
    process.exit(1);
  }
}

// Run test
testMagnus14Loading().catch(err => {
  console.error('Test error:', err);
  process.exit(1);
});
