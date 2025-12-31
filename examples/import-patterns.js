/**
 * 🌌 Magnus Universe - Import Patterns
 *
 * Shows all ways to import CloudZero Proxy and other projects
 * in Magnus Universe
 */

console.log('\n🌌 Magnus Universe - Import Patterns\n');
console.log('=' .repeat(60));

// ============================================================================
// PATTERN 1: Direct Import (Simple & Fast)
// ============================================================================

console.log('\n📌 PATTERN 1: Direct Import\n');
console.log('Best for: Quick imports from magnus/ or generated/');
console.log('Usage: Know exact relative path\n');

import { cloud as cloud1 } from '../generated/cloudzero-proxy/cloudzero-proxy.js';

console.log('✓ Import: import { cloud } from "../generated/cloudzero-proxy/cloudzero-proxy.js"');
console.log(`  cloud.payment available: ${typeof cloud1.payment === 'object'}`);

// ============================================================================
// PATTERN 2: Central Hub Import
// ============================================================================

console.log('\n📌 PATTERN 2: Central Hub Import\n');
console.log('Best for: Consistent imports from project root');
console.log('Usage: Single entry point for all projects\n');

import { cloud as cloud2 } from '../index.js';

console.log('✓ Import: import { cloud } from "../index.js"');
console.log(`  cloud.email available: ${typeof cloud2.email === 'object'}`);

// ============================================================================
// PATTERN 3: Smart Helper Import
// ============================================================================

console.log('\n📌 PATTERN 3: Smart Helper Import\n');
console.log('Best for: When you need flexibility & path resolution');
console.log('Usage: Use helper functions that resolve paths\n');

import { getCloud, getMagnusRoot } from '../lib/magnus-imports.js';

const cloud3 = await getCloud();
const root = getMagnusRoot();

console.log('✓ Import: import { getCloud } from "../lib/magnus-imports.js"');
console.log(`  cloud.storage available: ${typeof cloud3.storage === 'object'}`);
console.log(`  Magnus root: ${root}`);

// ============================================================================
// PATTERN 4: Async Import All
// ============================================================================

console.log('\n📌 PATTERN 4: Async Import All\n');
console.log('Best for: Need multiple resources (Magnus + CloudZero)');
console.log('Usage: Get everything with one helper\n');

import { getMagnusUniverse } from '../lib/magnus-imports.js';

const universe = await getMagnusUniverse();

console.log('✓ Import: import { getMagnusUniverse } from "../lib/magnus-imports.js"');
console.log(`  Available exports: ${Object.keys(universe).join(', ')}`);
console.log(`  cloud.auth available: ${typeof universe.cloud.auth === 'object'}`);

// ============================================================================
// PATTERN 5: Conditional Imports (Advanced)
// ============================================================================

console.log('\n📌 PATTERN 5: Conditional Imports\n');
console.log('Best for: Complex projects needing dynamic imports');
console.log('Usage: Load projects based on configuration\n');

import { getProject, listProjects } from '../lib/magnus-imports.js';

const projects = await listProjects();
console.log(`✓ Available projects: ${projects.join(', ')}`);

const cloudzeroModule = await getProject('cloudzero');
console.log(`✓ Dynamic import of "cloudzero" successful`);

// ============================================================================
// PRACTICAL EXAMPLES
// ============================================================================

console.log('\n' + '='.repeat(60));
console.log('🎯 PRACTICAL EXAMPLES\n');

// Example 1: From magnus/magnus-13-examples.js
console.log('Example 1: From magnus/ subfolder');
console.log(`Code: import { cloud } from '../generated/cloudzero-proxy/cloudzero-proxy.js'`);
console.log('Why: Relative path from magnus/ location\n');

// Example 2: From generated/cloudzero-proxy/examples/
console.log('Example 2: From generated/cloudzero-proxy/examples/');
console.log(`Code: import { cloud } from '../../cloudzero-proxy.js'`);
console.log('Why: Short relative path within same project\n');

// Example 3: From magnus/services/auth.js
console.log('Example 3: From deep file in magnus/');
console.log(`Code: import { cloud } from '../../../generated/cloudzero-proxy/cloudzero-proxy.js'`);
console.log('Why: Multiple ../ to climb directory tree\n');

// Example 4: Using smart helper
console.log('Example 4: From anywhere using helper');
console.log(`Code: import { getCloud } from '../../../lib/magnus-imports.js'`);
console.log(`      const cloud = await getCloud();`);
console.log('Why: Helper resolves correct path automatically\n');

// ============================================================================
// RECOMMENDED PATTERNS BY LOCATION
// ============================================================================

console.log('=' .repeat(60));
console.log('📍 RECOMMENDED PATTERNS BY FILE LOCATION\n');

const patterns = {
  'magnus/magnus-13.js': {
    pattern: 'Pattern 1 (Direct)',
    code: 'import { cloud } from "../generated/cloudzero-proxy/cloudzero-proxy.js"'
  },
  'magnus/subfolder/file.js': {
    pattern: 'Pattern 1 (Direct)',
    code: 'import { cloud } from "../../generated/cloudzero-proxy/cloudzero-proxy.js"'
  },
  'generated/cloudzero-proxy/services/service.js': {
    pattern: 'Pattern 1 (Direct)',
    code: 'import { cloud } from "../cloudzero-proxy.js"'
  },
  'any/deep/nested/file.js': {
    pattern: 'Pattern 3 (Smart Helper)',
    code: 'import { getCloud } from "../../../lib/magnus-imports.js"'
  },
  'root level files': {
    pattern: 'Pattern 2 (Hub)',
    code: 'import { cloud } from "./index.js"'
  }
};

Object.entries(patterns).forEach(([location, info]) => {
  console.log(`📁 ${location}`);
  console.log(`   Use: ${info.pattern}`);
  console.log(`   Code: ${info.code}\n`);
});

// ============================================================================
// CLOUD SERVICES DEMO
// ============================================================================

console.log('=' .repeat(60));
console.log('🚀 CLOUD SERVICES DEMO (Using Pattern 3)\n');

try {
  // Payment
  const charge = await cloud3.payment.charge(100, 'eur', {
    description: 'Demo transaction'
  });
  console.log(`✓ Payment: ${charge.id}`);

  // Email
  const email = await cloud3.email.send('demo@example.com', 'Welcome!', '<h1>Hello</h1>');
  console.log(`✓ Email: ${email.id}`);

  // SMS
  const sms = await cloud3.sms.send('+33612345678', 'Demo message');
  console.log(`✓ SMS: ${sms.id}`);

  // Storage
  const file = await cloud3.storage.upload(Buffer.from('test data'), 'demo.txt');
  console.log(`✓ Storage: ${file.url}`);

  // Auth
  const user = await cloud3.auth.createUser('demo@example.com', 'Pass123!');
  console.log(`✓ Auth: ${user.id}`);

  console.log('\n✅ All services working!');
} catch (error) {
  console.error('❌ Error:', error.message);
}

console.log('\n' + '='.repeat(60));
console.log('🎯 Choose pattern based on your needs:\n');
console.log('  1️⃣  Direct Import     → Fast, explicit, best for known paths');
console.log('  2️⃣  Central Hub       → Consistent, good for monorepo structure');
console.log('  3️⃣  Smart Helper      → Flexible, path-agnostic, most resilient');
console.log('  4️⃣  Async Import All  → Complex apps needing full universe');
console.log('  5️⃣  Conditional       → Dynamic/plugin architectures\n');
console.log('=' .repeat(60) + '\n');
