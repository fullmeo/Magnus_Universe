/**
 * 🚀 Quick Start - CloudZero Proxy in Magnus Universe
 *
 * Minimum viable example of using cloud services
 */

import { getCloud } from '../lib/magnus-imports.js';

console.log('\n🌌 Magnus Universe - CloudZero Quick Start\n');

// Get cloud instance (works from anywhere!)
const cloud = await getCloud();

console.log('✅ CloudZero imported successfully\n');

// ============================================================================
// EXAMPLE 1: Payment Processing
// ============================================================================

console.log('💳 Payment Example:');
try {
  const charge = await cloud.payment.charge(100, 'eur', {
    description: 'Quick start example'
  });
  console.log(`   Charge created: ${charge.id}`);
  console.log(`   Amount: ${charge.amount}\n`);
} catch (error) {
  console.error('   Error:', error.message);
}

// ============================================================================
// EXAMPLE 2: Email Notification
// ============================================================================

console.log('📧 Email Example:');
try {
  const email = await cloud.email.send(
    'user@example.com',
    'Welcome to Magnus Universe!',
    '<h1>Welcome!</h1><p>CloudZero is ready to use.</p>'
  );
  console.log(`   Email sent: ${email.id}`);
  console.log(`   To: user@example.com\n`);
} catch (error) {
  console.error('   Error:', error.message);
}

// ============================================================================
// EXAMPLE 3: SMS Notification
// ============================================================================

console.log('📱 SMS Example:');
try {
  const sms = await cloud.sms.send(
    '+33612345678',
    'Your CloudZero API is ready! 🚀'
  );
  console.log(`   SMS sent: ${sms.id}`);
  console.log(`   To: +33612345678\n`);
} catch (error) {
  console.error('   Error:', error.message);
}

// ============================================================================
// EXAMPLE 4: File Storage
// ============================================================================

console.log('💾 Storage Example:');
try {
  const file = await cloud.storage.upload(
    Buffer.from('Hello Magnus Universe!'),
    'examples/quick-start.txt'
  );
  console.log(`   File uploaded: ${file.url}\n`);
} catch (error) {
  console.error('   Error:', error.message);
}

// ============================================================================
// EXAMPLE 5: User Authentication
// ============================================================================

console.log('🔐 Auth Example:');
try {
  const user = await cloud.auth.createUser(
    'serigne@magnus.universe',
    'SecurePassword123!',
    { name: 'Serigne', role: 'Meta-Developer' }
  );
  console.log(`   User created: ${user.id}`);
  console.log(`   Email: serigne@magnus.universe\n`);
} catch (error) {
  console.error('   Error:', error.message);
}

// ============================================================================
// SUMMARY
// ============================================================================

console.log('✅ All examples completed!\n');
console.log('📚 Next steps:');
console.log('   1. Read IMPORT-GUIDE.md for detailed patterns');
console.log('   2. Read generated/cloudzero-proxy/README.md for API docs');
console.log('   3. Explore examples/ for more complex use cases\n');
console.log('🌌 Magnus Universe is ready for orchestration!\n');
