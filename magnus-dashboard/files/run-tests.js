/**
 * Simple test runner for MARS
 */

import { runMARSTests, displayPerformanceMetrics } from './test-mars-system.js';

async function main() {
  try {
    await runMARSTests();
    await displayPerformanceMetrics();
  } catch (error) {
    console.error('Test execution failed:', error);
    process.exit(1);
  }
}

main();
