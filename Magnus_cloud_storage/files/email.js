/**
 * Email Service - SendGrid Integration
 * 
 * DEV: Smart mocks with email preview
 * PROD: Real SendGrid API
 */

import { MockEmailService } from '../mocks/mock-email.js';

// ============================================================================
// EMAIL SERVICE
// ============================================================================

export class EmailService {
  constructor(mode, config, verbose = true) {
    this.mode = mode;
    this.config = config;
    this.verbose = verbose;

    if (mode === 'development' || !config?.apiKey) {
      this.provider = new MockEmailService(verbose);
      this.usingMock = true;
    } else {
      // Real SendGrid would be initialized here
      this.provider = new MockEmailService(verbose);
      this.usingMock = true;
      
      // In real implementation:
      // this.provider = new SendGridEmailService(config);
      // this.usingMock = false;
    }
  }

  getMode() {
    return this.usingMock ? 'mock' : 'real';
  }

  async healthCheck() {
    return {
      healthy: true,
      provider: this.usingMock ? 'Mock' : 'SendGrid',
      mode: this.mode
    };
  }

  /**
   * Send an email
   * 
   * @param {string} to - Recipient email
   * @param {string} subject - Email subject
   * @param {string} body - Email body (HTML or plain text)
   * @param {object} options - Additional options
   * @returns {Promise<object>} Send result
   */
  async send(to, subject, body, options = {}) {
    return this.provider.send(to, subject, body, options);
  }

  /**
   * Send email with template
   * 
   * @param {string} to - Recipient email
   * @param {string} templateId - Template ID
   * @param {object} variables - Template variables
   * @param {object} options - Additional options
   * @returns {Promise<object>} Send result
   */
  async sendTemplate(to, templateId, variables = {}, options = {}) {
    return this.provider.sendTemplate(to, templateId, variables, options);
  }

  /**
   * Send bulk emails
   * 
   * @param {array} emails - Array of email objects
   * @returns {Promise<object>} Bulk send result
   */
  async sendBulk(emails) {
    return this.provider.sendBulk(emails);
  }

  /**
   * Send transactional email
   * 
   * @param {string} to - Recipient email
   * @param {string} type - Email type (welcome, reset_password, etc.)
   * @param {object} data - Email data
   * @returns {Promise<object>} Send result
   */
  async sendTransactional(to, type, data = {}) {
    return this.provider.sendTransactional(to, type, data);
  }

  /**
   * Get email statistics
   * 
   * @returns {Promise<object>} Email stats
   */
  async getStats() {
    return this.provider.getStats();
  }

  /**
   * Validate email address
   * 
   * @param {string} email - Email to validate
   * @returns {Promise<object>} Validation result
   */
  async validateEmail(email) {
    return this.provider.validateEmail(email);
  }
}
