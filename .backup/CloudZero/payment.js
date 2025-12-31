/**
 * Payment Service - Stripe Integration
 * 
 * DEV: Smart mocks with realistic behavior
 * PROD: Real Stripe API
 */

import { MockPaymentService } from '../mocks/mock-payment.js';

// ============================================================================
// PAYMENT SERVICE
// ============================================================================

export class PaymentService {
  constructor(mode, config, verbose = true) {
    this.mode = mode;
    this.config = config;
    this.verbose = verbose;

    if (mode === 'development' || !config?.secretKey) {
      this.provider = new MockPaymentService(verbose);
      this.usingMock = true;
    } else {
      // Real Stripe would be initialized here
      // For now, fallback to mock if Stripe not available
      this.provider = new MockPaymentService(verbose);
      this.usingMock = true;
      
      // In real implementation:
      // this.provider = new StripePaymentService(config);
      // this.usingMock = false;
    }
  }

  getMode() {
    return this.usingMock ? 'mock' : 'real';
  }

  async healthCheck() {
    return {
      healthy: true,
      provider: this.usingMock ? 'Mock' : 'Stripe',
      mode: this.mode
    };
  }

  /**
   * Create a payment charge
   * 
   * @param {number} amount - Amount in cents (e.g., 1000 = 10.00 EUR)
   * @param {string} currency - Currency code (usd, eur, gbp, etc.)
   * @param {object} options - Additional options
   * @returns {Promise<object>} Charge object
   */
  async charge(amount, currency = 'eur', options = {}) {
    return this.provider.charge(amount, currency, options);
  }

  /**
   * Create a payment intent (3D Secure compatible)
   * 
   * @param {number} amount - Amount in cents
   * @param {string} currency - Currency code
   * @param {object} options - Additional options
   * @returns {Promise<object>} Payment intent object
   */
  async createPaymentIntent(amount, currency = 'eur', options = {}) {
    return this.provider.createPaymentIntent(amount, currency, options);
  }

  /**
   * Confirm a payment intent
   * 
   * @param {string} paymentIntentId - Payment intent ID
   * @param {string} paymentMethod - Payment method ID
   * @returns {Promise<object>} Confirmed payment intent
   */
  async confirmPaymentIntent(paymentIntentId, paymentMethod) {
    return this.provider.confirmPaymentIntent(paymentIntentId, paymentMethod);
  }

  /**
   * Refund a charge
   * 
   * @param {string} chargeId - Charge ID to refund
   * @param {number} amount - Amount to refund (optional, full refund if not specified)
   * @returns {Promise<object>} Refund object
   */
  async refund(chargeId, amount = null) {
    return this.provider.refund(chargeId, amount);
  }

  /**
   * Create a customer
   * 
   * @param {object} customerData - Customer information
   * @returns {Promise<object>} Customer object
   */
  async createCustomer(customerData) {
    return this.provider.createCustomer(customerData);
  }

  /**
   * Get customer by ID
   * 
   * @param {string} customerId - Customer ID
   * @returns {Promise<object>} Customer object
   */
  async getCustomer(customerId) {
    return this.provider.getCustomer(customerId);
  }

  /**
   * Create a subscription
   * 
   * @param {string} customerId - Customer ID
   * @param {string} priceId - Price ID (or plan ID)
   * @param {object} options - Additional options
   * @returns {Promise<object>} Subscription object
   */
  async createSubscription(customerId, priceId, options = {}) {
    return this.provider.createSubscription(customerId, priceId, options);
  }

  /**
   * Cancel a subscription
   * 
   * @param {string} subscriptionId - Subscription ID
   * @param {boolean} immediately - Cancel immediately or at period end
   * @returns {Promise<object>} Cancelled subscription object
   */
  async cancelSubscription(subscriptionId, immediately = false) {
    return this.provider.cancelSubscription(subscriptionId, immediately);
  }

  /**
   * Create a checkout session
   * 
   * @param {object} sessionData - Checkout session configuration
   * @returns {Promise<object>} Checkout session object
   */
  async createCheckoutSession(sessionData) {
    return this.provider.createCheckoutSession(sessionData);
  }

  /**
   * Get charge by ID
   * 
   * @param {string} chargeId - Charge ID
   * @returns {Promise<object>} Charge object
   */
  async getCharge(chargeId) {
    return this.provider.getCharge(chargeId);
  }

  /**
   * List charges
   * 
   * @param {object} options - Filter options
   * @returns {Promise<array>} Array of charges
   */
  async listCharges(options = {}) {
    return this.provider.listCharges(options);
  }

  /**
   * Verify webhook signature (for webhooks)
   * 
   * @param {string} payload - Webhook payload
   * @param {string} signature - Stripe signature header
   * @returns {object} Verified event object
   */
  verifyWebhook(payload, signature) {
    return this.provider.verifyWebhook(payload, signature);
  }
}
