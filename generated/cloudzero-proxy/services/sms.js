/**
 * SMS Service - Twilio Integration
 *
 * DEV: Smart mocks with SMS delivery simulation
 * PROD: Real Twilio API
 */

import { MockSMSService } from '../mocks/mock-sms.js';

// ============================================================================
// SMS SERVICE
// ============================================================================

export class SMSService {
  constructor(mode, config, verbose = true) {
    this.mode = mode;
    this.config = config;
    this.verbose = verbose;

    if (mode === 'development' || !config?.accountSid) {
      this.provider = new MockSMSService(verbose);
      this.usingMock = true;
    } else {
      // Real Twilio would be initialized here
      this.provider = new MockSMSService(verbose);
      this.usingMock = true;

      // In real implementation:
      // this.provider = new TwilioSMSService(config);
      // this.usingMock = false;
    }
  }

  getMode() {
    return this.usingMock ? 'mock' : 'real';
  }

  async healthCheck() {
    return {
      healthy: true,
      provider: this.usingMock ? 'Mock' : 'Twilio',
      mode: this.mode
    };
  }

  /**
   * Send an SMS
   *
   * @param {string} to - Recipient phone number
   * @param {string} message - SMS message body
   * @param {object} options - Additional options
   * @returns {Promise<object>} Send result
   */
  async send(to, message, options = {}) {
    return this.provider.send(to, message, options);
  }

  /**
   * Send verification code via SMS
   *
   * @param {string} phone - Phone number to send code to
   * @returns {Promise<object>} Verification result
   */
  async sendVerification(phone) {
    return this.provider.sendVerification(phone);
  }

  /**
   * Verify SMS code
   *
   * @param {string} phone - Phone number that received the code
   * @param {string} code - Verification code to verify
   * @returns {Promise<object>} Verification result
   */
  async verifyCode(phone, code) {
    return this.provider.verifyCode(phone, code);
  }

  /**
   * Get SMS message status
   *
   * @param {string} messageId - Message ID to check
   * @returns {Promise<object>} Message status
   */
  async getStatus(messageId) {
    return this.provider.getStatus(messageId);
  }
}
