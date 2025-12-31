#!/usr/bin/env node

/**
 * Debug Routes
 * Inspect what routes are actually registered
 */

import express from 'express';
import { setupMagnus14Routes } from './magnus-dashboard/server/magnus-14-api-routes.js';

const app = express();

console.log('\n🔍 Inspecting registered routes...\n');

// Log all routes before Magnus 14 setup
console.log('Before Magnus 14 routes setup:');
console.log('App._router.stack length:', app._router.stack.length);

setupMagnus14Routes(app, null);

console.log('\nAfter Magnus 14 routes setup:');
console.log('App._router.stack length:', app._router.stack.length);

// List all routes
function printRoutes(router, prefix = '') {
  if (!router.stack) return;

  router.stack.forEach(middleware => {
    if (middleware.route) {
      // It's a route
      const methods = Object.keys(middleware.route.methods).map(m => m.toUpperCase()).join(',');
      console.log(`   ${methods.padEnd(10)} ${prefix}${middleware.route.path}`);
    } else if (middleware.name === 'router' && middleware.handle.stack) {
      // It's a nested router
      const nestedPrefix = prefix + (middleware.regexp.source === '^\\/?$' ? '' : middleware.regexp.source.match(/\\?\/?([^\\]*)/)[1] || '');
      console.log(`\n📁 Router at ${nestedPrefix}:`);
      printRoutes(middleware.handle, nestedPrefix);
    }
  });
}

console.log('\n📋 Detailed route listing:\n');
printRoutes(app._router);

console.log('\n✅ Route inspection complete\n');
