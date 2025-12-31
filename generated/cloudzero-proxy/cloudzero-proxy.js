/**
 * CloudZero Proxy - Zero Friction Development
 * 
 * Unified API for all cloud services
 * - DEV: Smart mocks, zero configuration
 * - PROD: Real APIs with your keys
 * 
 * Usage:
 *   import { cloud } from './cloudzero-proxy.js';
 *   await cloud.payment.charge(1000, 'usd');
 *   await cloud.email.send('user@example.com', 'Hello!');
 */

import { PaymentService } from './services/payment.js';
import { EmailService } from './services/email.js';
import { SMSService } from './services/sms.js';
import { StorageService } from './services/storage.js';
import { AuthService } from './services/auth.js';

// ============================================================================
// CLOUDZERO PROXY - Main Orchestrator
// ============================================================================

class CloudZeroProxy {
  constructor(config = {}) {
    this.mode = config.mode || process.env.NODE_ENV || 'development';
    this.verbose = config.verbose !== false;
    
    // Configuration for production
    this.config = {
      stripe: {
        secretKey: config.stripe?.secretKey || process.env.STRIPE_SECRET_KEY,
        webhookSecret: config.stripe?.webhookSecret || process.env.STRIPE_WEBHOOK_SECRET
      },
      sendgrid: {
        apiKey: config.sendgrid?.apiKey || process.env.SENDGRID_API_KEY
      },
      twilio: {
        accountSid: config.twilio?.accountSid || process.env.TWILIO_ACCOUNT_SID,
        authToken: config.twilio?.authToken || process.env.TWILIO_AUTH_TOKEN,
        phoneNumber: config.twilio?.phoneNumber || process.env.TWILIO_PHONE_NUMBER
      },
      aws: {
        accessKeyId: config.aws?.accessKeyId || process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: config.aws?.secretAccessKey || process.env.AWS_SECRET_ACCESS_KEY,
        region: config.aws?.region || process.env.AWS_REGION || 'eu-west-1'
      },
      auth0: {
        domain: config.auth0?.domain || process.env.AUTH0_DOMAIN,
        clientId: config.auth0?.clientId || process.env.AUTH0_CLIENT_ID,
        clientSecret: config.auth0?.clientSecret || process.env.AUTH0_CLIENT_SECRET
      }
    };

    // Initialize services
    this.payment = new PaymentService(this.mode, this.config.stripe, this.verbose);
    this.email = new EmailService(this.mode, this.config.sendgrid, this.verbose);
    this.sms = new SMSService(this.mode, this.config.twilio, this.verbose);
    this.storage = new StorageService(this.mode, this.config.aws, this.verbose);
    this.auth = new AuthService(this.mode, this.config.auth0, this.verbose);

    if (this.verbose) {
      this.logInitialization();
    }
  }

  logInitialization() {
    const modeColor = this.mode === 'production' ? '\x1b[31m' : '\x1b[32m';
    const reset = '\x1b[0m';
    
    console.log('\n' + '='.repeat(60));
    console.log(`🌩️  CloudZero Proxy initialized`);
    console.log(`   Mode: ${modeColor}${this.mode.toUpperCase()}${reset}`);
    console.log(`   Services: Payment, Email, SMS, Storage, Auth`);
    
    if (this.mode === 'development') {
      console.log(`   📝 All services use smart mocks (zero config needed)`);
    } else {
      console.log(`   🔥 All services use real APIs`);
      this.validateProductionConfig();
    }
    
    console.log('='.repeat(60) + '\n');
  }

  validateProductionConfig() {
    const issues = [];

    if (!this.config.stripe.secretKey) {
      issues.push('⚠️  STRIPE_SECRET_KEY not configured');
    }
    if (!this.config.sendgrid.apiKey) {
      issues.push('⚠️  SENDGRID_API_KEY not configured');
    }
    if (!this.config.twilio.accountSid || !this.config.twilio.authToken) {
      issues.push('⚠️  Twilio credentials not configured');
    }
    if (!this.config.aws.accessKeyId || !this.config.aws.secretAccessKey) {
      issues.push('⚠️  AWS credentials not configured');
    }
    if (!this.config.auth0.domain || !this.config.auth0.clientId) {
      issues.push('⚠️  Auth0 credentials not configured');
    }

    if (issues.length > 0) {
      console.log('   Configuration issues:');
      issues.forEach(issue => console.log(`   ${issue}`));
      console.log('   💡 Unconfigured services will use mocks\n');
    }
  }

  /**
   * Get current mode
   */
  getMode() {
    return this.mode;
  }

  /**
   * Check if service is available in production
   */
  isServiceConfigured(serviceName) {
    if (this.mode === 'development') return true;

    switch (serviceName) {
      case 'payment':
        return !!this.config.stripe.secretKey;
      case 'email':
        return !!this.config.sendgrid.apiKey;
      case 'sms':
        return !!this.config.twilio.accountSid;
      case 'storage':
        return !!this.config.aws.accessKeyId;
      case 'auth':
        return !!this.config.auth0.domain;
      default:
        return false;
    }
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      mode: this.mode,
      services: {
        payment: {
          configured: this.isServiceConfigured('payment'),
          provider: 'Stripe',
          mode: this.payment.getMode()
        },
        email: {
          configured: this.isServiceConfigured('email'),
          provider: 'SendGrid',
          mode: this.email.getMode()
        },
        sms: {
          configured: this.isServiceConfigured('sms'),
          provider: 'Twilio',
          mode: this.sms.getMode()
        },
        storage: {
          configured: this.isServiceConfigured('storage'),
          provider: 'AWS S3',
          mode: this.storage.getMode()
        },
        auth: {
          configured: this.isServiceConfigured('auth'),
          provider: 'Auth0',
          mode: this.auth.getMode()
        }
      }
    };
  }

  /**
   * Health check for all services
   */
  async healthCheck() {
    const results = {
      healthy: true,
      services: {}
    };

    try {
      results.services.payment = await this.payment.healthCheck();
    } catch (error) {
      results.services.payment = { healthy: false, error: error.message };
      results.healthy = false;
    }

    try {
      results.services.email = await this.email.healthCheck();
    } catch (error) {
      results.services.email = { healthy: false, error: error.message };
      results.healthy = false;
    }

    try {
      results.services.sms = await this.sms.healthCheck();
    } catch (error) {
      results.services.sms = { healthy: false, error: error.message };
      results.healthy = false;
    }

    try {
      results.services.storage = await this.storage.healthCheck();
    } catch (error) {
      results.services.storage = { healthy: false, error: error.message };
      results.healthy = false;
    }

    try {
      results.services.auth = await this.auth.healthCheck();
    } catch (error) {
      results.services.auth = { healthy: false, error: error.message };
      results.healthy = false;
    }

    return results;
  }
}

// ============================================================================
// DEFAULT INSTANCE - Ready to use
// ============================================================================

export const cloud = new CloudZeroProxy();

// ============================================================================
// NAMED EXPORTS
// ============================================================================

export { CloudZeroProxy };
export default cloud;
