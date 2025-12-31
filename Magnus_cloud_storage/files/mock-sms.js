/**
 * Mock SMS Service
 */

import crypto from 'crypto';
import fs from 'fs/promises';

export class MockSMSService {
  constructor(verbose = true) {
    this.verbose = verbose;
    this.storageDir = './dev-data/sms';
    this.messages = [];
    this.verificationCodes = new Map();
    this.ensureStorageDir();
  }

  async ensureStorageDir() {
    try { await fs.mkdir(this.storageDir, { recursive: true }); } catch (e) {}
  }

  async simulateDelay() {
    await new Promise(resolve => setTimeout(resolve, 50 + Math.random() * 100));
  }

  generateId() { return `SM${crypto.randomBytes(16).toString('hex')}`; }

  log(operation, data) {
    if (!this.verbose) return;
    console.log(`\x1b[34m📱 [MOCK SMS]\x1b[0m \x1b[32m${operation}\x1b[0m`);
    console.log(`\x1b[33m   →\x1b[0m`, JSON.stringify(data, null, 2));
  }

  async send(to, message, options = {}) {
    await this.simulateDelay();

    const sms = {
      id: this.generateId(),
      to,
      message,
      status: 'delivered',
      timestamp: new Date().toISOString(),
      from: options.from || '+15555555555'
    };

    this.messages.push(sms);
    this.log('SMS SENT', { id: sms.id, to, message });

    return { id: sms.id, status: 'delivered', to };
  }

  async sendVerification(phone) {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    this.verificationCodes.set(phone, { code, expires: Date.now() + 300000 });
    
    await this.send(phone, `Your verification code is: ${code}`);
    this.log('VERIFICATION SENT', { phone, code });

    return { phone, sent: true, code }; // In real world, don't return code!
  }

  async verifyCode(phone, code) {
    const stored = this.verificationCodes.get(phone);
    
    if (!stored) return { valid: false, reason: 'No verification sent' };
    if (Date.now() > stored.expires) return { valid: false, reason: 'Code expired' };
    if (stored.code !== code) return { valid: false, reason: 'Invalid code' };

    this.verificationCodes.delete(phone);
    this.log('CODE VERIFIED', { phone });
    
    return { valid: true };
  }

  async getStatus(messageId) {
    const message = this.messages.find(m => m.id === messageId);
    return message ? { id: messageId, status: message.status } : null;
  }
}
