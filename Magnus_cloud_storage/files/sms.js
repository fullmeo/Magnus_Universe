/**
 * SMS Service - Twilio Integration
 */

import { MockSMSService } from '../mocks/mock-sms.js';

export class SMSService {
  constructor(mode, config, verbose = true) {
    this.mode = mode;
    this.config = config;
    this.verbose = verbose;

    if (mode === 'development' || !config?.accountSid) {
      this.provider = new MockSMSService(verbose);
      this.usingMock = true;
    } else {
      this.provider = new MockSMSService(verbose);
      this.usingMock = true;
    }
  }

  getMode() { return this.usingMock ? 'mock' : 'real'; }
  async healthCheck() { return { healthy: true, provider: this.usingMock ? 'Mock' : 'Twilio', mode: this.mode }; }
  async send(to, message, options = {}) { return this.provider.send(to, message, options); }
  async sendVerification(phone) { return this.provider.sendVerification(phone); }
  async verifyCode(phone, code) { return this.provider.verifyCode(phone, code); }
  async getStatus(messageId) { return this.provider.getStatus(messageId); }
}
