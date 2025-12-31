/**
 * CloudZero Proxy - Basic Usage Examples
 */

import { cloud } from '../cloudzero-proxy.js';

console.log('\n🌩️  CloudZero Proxy - Basic Usage Examples\n');

async function runExamples() {
  try {
    // ===== PAYMENT EXAMPLES =====
    console.log('\n💳 PAYMENT EXAMPLES\n');
    
    const charge = await cloud.payment.charge(1000, 'eur', {
      description: 'Test charge'
    });
    console.log('✓ Charge created:', charge.id);

    // ===== EMAIL EXAMPLES =====
    console.log('\n📧 EMAIL EXAMPLES\n');

    const email = await cloud.email.send(
      'user@example.com',
      'Welcome!',
      '<h1>Welcome!</h1>'
    );
    console.log('✓ Email sent:', email.id);

    // ===== SMS EXAMPLES =====
    console.log('\n📱 SMS EXAMPLES\n');

    const sms = await cloud.sms.send('+33612345678', 'Hello!');
    console.log('✓ SMS sent:', sms.id);

    // ===== STORAGE EXAMPLES =====
    console.log('\n💾 STORAGE EXAMPLES\n');

    const upload = await cloud.storage.upload(
      Buffer.from('Hello World!'),
      'files/test.txt'
    );
    console.log('✓ File uploaded:', upload.url);

    // ===== AUTH EXAMPLES =====
    console.log('\n🔐 AUTH EXAMPLES\n');

    const user = await cloud.auth.createUser(
      'user@example.com',
      'Password123!',
      { name: 'John Doe' }
    );
    console.log('✓ User created:', user.id);

    console.log('\n✅ All examples completed!\n');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
  }
}

runExamples();
