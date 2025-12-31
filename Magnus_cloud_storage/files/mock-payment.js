/**
 * Mock Payment Service - Smart Stripe Simulation
 * 
 * Simulates real Stripe behavior:
 * - Realistic delays (50-200ms)
 * - Random failures (1% rate)
 * - Proper object structures
 * - Webhook simulation
 * - Local storage of transactions
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

// ============================================================================
// MOCK PAYMENT SERVICE
// ============================================================================

export class MockPaymentService {
  constructor(verbose = true) {
    this.verbose = verbose;
    this.storageDir = './dev-data/payments';
    this.charges = new Map();
    this.customers = new Map();
    this.subscriptions = new Map();
    this.paymentIntents = new Map();
    this.refunds = new Map();
    
    this.ensureStorageDir();
    this.loadStoredData();
  }

  async ensureStorageDir() {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
    } catch (error) {
      // Directory exists, ignore
    }
  }

  async loadStoredData() {
    try {
      const chargesFile = path.join(this.storageDir, 'charges.json');
      const data = await fs.readFile(chargesFile, 'utf8');
      const charges = JSON.parse(data);
      charges.forEach(charge => this.charges.set(charge.id, charge));
    } catch (error) {
      // No stored data, start fresh
    }
  }

  async saveCharges() {
    try {
      const charges = Array.from(this.charges.values());
      await fs.writeFile(
        path.join(this.storageDir, 'charges.json'),
        JSON.stringify(charges, null, 2)
      );
    } catch (error) {
      console.error('Failed to save charges:', error.message);
    }
  }

  /**
   * Simulate network delay
   */
  async simulateDelay() {
    const delay = 50 + Math.random() * 150; // 50-200ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  /**
   * Simulate random failure (1% chance)
   */
  simulateRandomFailure() {
    if (Math.random() < 0.01) {
      throw new Error('card_declined: Your card was declined');
    }
  }

  /**
   * Generate mock ID
   */
  generateId(prefix) {
    const random = crypto.randomBytes(12).toString('hex');
    return `${prefix}_mock_${random}`;
  }

  /**
   * Log transaction
   */
  log(operation, data) {
    if (!this.verbose) return;

    const green = '\x1b[32m';
    const blue = '\x1b[34m';
    const yellow = '\x1b[33m';
    const reset = '\x1b[0m';

    console.log(`${blue}💳 [MOCK PAYMENT]${reset} ${green}${operation}${reset}`);
    console.log(`${yellow}   →${reset}`, JSON.stringify(data, null, 2));
  }

  /**
   * Create a charge
   */
  async charge(amount, currency = 'eur', options = {}) {
    await this.simulateDelay();
    this.simulateRandomFailure();

    const charge = {
      id: this.generateId('ch'),
      object: 'charge',
      amount,
      currency,
      status: 'succeeded',
      created: Math.floor(Date.now() / 1000),
      description: options.description || null,
      metadata: options.metadata || {},
      customer: options.customer || null,
      receipt_email: options.receipt_email || null,
      source: {
        id: this.generateId('card'),
        object: 'card',
        brand: 'Visa',
        last4: '4242',
        exp_month: 12,
        exp_year: 2025
      },
      paid: true,
      refunded: false,
      amount_refunded: 0
    };

    this.charges.set(charge.id, charge);
    await this.saveCharges();

    this.log('CHARGE', { 
      id: charge.id, 
      amount: `${amount / 100} ${currency.toUpperCase()}`,
      status: charge.status 
    });

    return charge;
  }

  /**
   * Create a payment intent
   */
  async createPaymentIntent(amount, currency = 'eur', options = {}) {
    await this.simulateDelay();

    const paymentIntent = {
      id: this.generateId('pi'),
      object: 'payment_intent',
      amount,
      currency,
      status: 'requires_payment_method',
      created: Math.floor(Date.now() / 1000),
      description: options.description || null,
      metadata: options.metadata || {},
      customer: options.customer || null,
      client_secret: `${this.generateId('pi')}_secret_${crypto.randomBytes(16).toString('hex')}`,
      payment_method: null,
      confirmation_method: 'automatic',
      capture_method: 'automatic'
    };

    this.paymentIntents.set(paymentIntent.id, paymentIntent);

    this.log('PAYMENT INTENT CREATED', {
      id: paymentIntent.id,
      amount: `${amount / 100} ${currency.toUpperCase()}`,
      status: paymentIntent.status
    });

    return paymentIntent;
  }

  /**
   * Confirm a payment intent
   */
  async confirmPaymentIntent(paymentIntentId, paymentMethod) {
    await this.simulateDelay();
    this.simulateRandomFailure();

    const paymentIntent = this.paymentIntents.get(paymentIntentId);
    
    if (!paymentIntent) {
      throw new Error(`No such payment intent: ${paymentIntentId}`);
    }

    paymentIntent.status = 'succeeded';
    paymentIntent.payment_method = paymentMethod;
    
    this.log('PAYMENT INTENT CONFIRMED', {
      id: paymentIntent.id,
      status: paymentIntent.status
    });

    return paymentIntent;
  }

  /**
   * Refund a charge
   */
  async refund(chargeId, amount = null) {
    await this.simulateDelay();

    const charge = this.charges.get(chargeId);
    
    if (!charge) {
      throw new Error(`No such charge: ${chargeId}`);
    }

    const refundAmount = amount || charge.amount;

    if (refundAmount > charge.amount - charge.amount_refunded) {
      throw new Error('Refund amount exceeds charge amount');
    }

    const refund = {
      id: this.generateId('re'),
      object: 'refund',
      amount: refundAmount,
      charge: chargeId,
      created: Math.floor(Date.now() / 1000),
      currency: charge.currency,
      status: 'succeeded'
    };

    charge.amount_refunded += refundAmount;
    charge.refunded = charge.amount_refunded === charge.amount;

    this.refunds.set(refund.id, refund);
    await this.saveCharges();

    this.log('REFUND', {
      id: refund.id,
      charge: chargeId,
      amount: `${refundAmount / 100} ${charge.currency.toUpperCase()}`
    });

    return refund;
  }

  /**
   * Create a customer
   */
  async createCustomer(customerData) {
    await this.simulateDelay();

    const customer = {
      id: this.generateId('cus'),
      object: 'customer',
      email: customerData.email,
      name: customerData.name || null,
      description: customerData.description || null,
      metadata: customerData.metadata || {},
      created: Math.floor(Date.now() / 1000),
      default_source: null,
      sources: { data: [] }
    };

    this.customers.set(customer.id, customer);

    this.log('CUSTOMER CREATED', {
      id: customer.id,
      email: customer.email
    });

    return customer;
  }

  /**
   * Get customer by ID
   */
  async getCustomer(customerId) {
    await this.simulateDelay();

    const customer = this.customers.get(customerId);
    
    if (!customer) {
      throw new Error(`No such customer: ${customerId}`);
    }

    return customer;
  }

  /**
   * Create a subscription
   */
  async createSubscription(customerId, priceId, options = {}) {
    await this.simulateDelay();

    const customer = this.customers.get(customerId);
    
    if (!customer) {
      throw new Error(`No such customer: ${customerId}`);
    }

    const subscription = {
      id: this.generateId('sub'),
      object: 'subscription',
      customer: customerId,
      status: 'active',
      created: Math.floor(Date.now() / 1000),
      current_period_start: Math.floor(Date.now() / 1000),
      current_period_end: Math.floor(Date.now() / 1000) + (30 * 24 * 60 * 60), // +30 days
      items: {
        data: [{
          id: this.generateId('si'),
          price: {
            id: priceId,
            object: 'price',
            unit_amount: options.amount || 999,
            currency: options.currency || 'eur',
            recurring: {
              interval: options.interval || 'month',
              interval_count: 1
            }
          }
        }]
      },
      metadata: options.metadata || {},
      cancel_at_period_end: false
    };

    this.subscriptions.set(subscription.id, subscription);

    this.log('SUBSCRIPTION CREATED', {
      id: subscription.id,
      customer: customerId,
      status: subscription.status
    });

    return subscription;
  }

  /**
   * Cancel a subscription
   */
  async cancelSubscription(subscriptionId, immediately = false) {
    await this.simulateDelay();

    const subscription = this.subscriptions.get(subscriptionId);
    
    if (!subscription) {
      throw new Error(`No such subscription: ${subscriptionId}`);
    }

    if (immediately) {
      subscription.status = 'canceled';
      subscription.canceled_at = Math.floor(Date.now() / 1000);
    } else {
      subscription.cancel_at_period_end = true;
    }

    this.log('SUBSCRIPTION CANCELED', {
      id: subscription.id,
      immediately,
      status: subscription.status
    });

    return subscription;
  }

  /**
   * Create a checkout session
   */
  async createCheckoutSession(sessionData) {
    await this.simulateDelay();

    const session = {
      id: this.generateId('cs'),
      object: 'checkout.session',
      mode: sessionData.mode || 'payment',
      success_url: sessionData.success_url,
      cancel_url: sessionData.cancel_url,
      customer: sessionData.customer || null,
      customer_email: sessionData.customer_email || null,
      line_items: sessionData.line_items || [],
      url: `http://localhost:3000/checkout/${this.generateId('cs')}`, // Mock checkout URL
      status: 'open',
      created: Math.floor(Date.now() / 1000)
    };

    this.log('CHECKOUT SESSION CREATED', {
      id: session.id,
      mode: session.mode,
      url: session.url
    });

    return session;
  }

  /**
   * Get charge by ID
   */
  async getCharge(chargeId) {
    await this.simulateDelay();

    const charge = this.charges.get(chargeId);
    
    if (!charge) {
      throw new Error(`No such charge: ${chargeId}`);
    }

    return charge;
  }

  /**
   * List charges
   */
  async listCharges(options = {}) {
    await this.simulateDelay();

    let charges = Array.from(this.charges.values());

    // Filter by customer
    if (options.customer) {
      charges = charges.filter(c => c.customer === options.customer);
    }

    // Limit
    const limit = options.limit || 10;
    charges = charges.slice(0, limit);

    return {
      object: 'list',
      data: charges,
      has_more: this.charges.size > charges.length,
      url: '/v1/charges'
    };
  }

  /**
   * Verify webhook (mock - always returns valid)
   */
  verifyWebhook(payload, signature) {
    this.log('WEBHOOK VERIFIED', { signature: 'mock_verified' });

    return {
      id: this.generateId('evt'),
      object: 'event',
      type: 'charge.succeeded',
      data: JSON.parse(payload)
    };
  }
}
