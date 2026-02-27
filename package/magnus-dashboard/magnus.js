#!/usr/bin/env node
/**
 * Magnus CLI Entry Point
 * Simpler wrapper to avoid import.meta issues
 */

import { MagnusCLI } from './magnus-cli.js';

const cli = new MagnusCLI();
cli.run(process.argv).catch(error => {
  console.error('❌ Fatal error:', error.message);
  process.exit(1);
});
