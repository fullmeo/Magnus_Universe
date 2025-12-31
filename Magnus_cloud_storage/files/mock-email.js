/**
 * Mock Email Service - Smart SendGrid Simulation
 * 
 * - Saves emails locally for preview
 * - Opens HTML emails in browser
 * - Simulates delivery delays
 * - Tracks statistics
 */

import crypto from 'crypto';
import fs from 'fs/promises';
import path from 'path';

export class MockEmailService {
  constructor(verbose = true) {
    this.verbose = verbose;
    this.storageDir = './dev-data/emails';
    this.emails = [];
    this.stats = {
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0
    };
    
    this.ensureStorageDir();
  }

  async ensureStorageDir() {
    try {
      await fs.mkdir(this.storageDir, { recursive: true });
    } catch (error) {
      // Directory exists
    }
  }

  async simulateDelay() {
    const delay = 30 + Math.random() * 100; // 30-130ms
    await new Promise(resolve => setTimeout(resolve, delay));
  }

  generateId(prefix = 'msg') {
    const random = crypto.randomBytes(8).toString('hex');
    return `${prefix}_mock_${random}`;
  }

  log(operation, data) {
    if (!this.verbose) return;

    const green = '\x1b[32m';
    const blue = '\x1b[34m';
    const yellow = '\x1b[33m';
    const reset = '\x1b[0m';

    console.log(`${blue}📧 [MOCK EMAIL]${reset} ${green}${operation}${reset}`);
    console.log(`${yellow}   →${reset}`, JSON.stringify(data, null, 2));
  }

  async saveEmail(email) {
    const filename = `${Date.now()}-${email.id}.json`;
    const filepath = path.join(this.storageDir, filename);
    
    await fs.writeFile(filepath, JSON.stringify(email, null, 2));
    
    // Also save HTML preview if present
    if (email.body && email.body.includes('<')) {
      const htmlFile = `${Date.now()}-${email.id}.html`;
      const htmlPath = path.join(this.storageDir, htmlFile);
      await fs.writeFile(htmlPath, email.body);
      
      this.log('EMAIL PREVIEW', { file: htmlPath });
    }
  }

  async send(to, subject, body, options = {}) {
    await this.simulateDelay();

    const email = {
      id: this.generateId(),
      to,
      from: options.from || 'noreply@example.com',
      subject,
      body,
      html: body.includes('<'),
      timestamp: new Date().toISOString(),
      status: 'delivered',
      metadata: options.metadata || {}
    };

    this.emails.push(email);
    this.stats.sent++;
    this.stats.delivered++;

    await this.saveEmail(email);

    this.log('EMAIL SENT', {
      id: email.id,
      to: email.to,
      subject: email.subject,
      preview: `${this.storageDir}/${Date.now()}-${email.id}.html`
    });

    return {
      id: email.id,
      status: 'delivered',
      to: email.to
    };
  }

  async sendTemplate(to, templateId, variables = {}, options = {}) {
    await this.simulateDelay();

    const templates = {
      welcome: {
        subject: 'Welcome to {{app_name}}!',
        body: '<h1>Welcome {{user_name}}!</h1><p>Thanks for joining {{app_name}}.</p>'
      },
      reset_password: {
        subject: 'Reset your password',
        body: '<h1>Reset Password</h1><p>Click here: {{reset_link}}</p>'
      },
      invoice: {
        subject: 'Your invoice #{{invoice_number}}',
        body: '<h1>Invoice</h1><p>Amount: {{amount}}</p>'
      }
    };

    const template = templates[templateId] || templates.welcome;
    
    // Replace variables
    let subject = template.subject;
    let body = template.body;
    
    Object.entries(variables).forEach(([key, value]) => {
      const placeholder = `{{${key}}}`;
      subject = subject.replace(new RegExp(placeholder, 'g'), value);
      body = body.replace(new RegExp(placeholder, 'g'), value);
    });

    return this.send(to, subject, body, options);
  }

  async sendBulk(emails) {
    const results = [];
    
    for (const email of emails) {
      const result = await this.send(
        email.to,
        email.subject,
        email.body,
        email.options || {}
      );
      results.push(result);
    }

    this.log('BULK SEND', { count: emails.length });

    return {
      sent: results.length,
      results
    };
  }

  async sendTransactional(to, type, data = {}) {
    const types = {
      welcome: { subject: 'Welcome!', template: 'welcome' },
      reset_password: { subject: 'Reset Password', template: 'reset_password' },
      order_confirmation: { subject: 'Order Confirmed', template: 'invoice' },
      invoice: { subject: 'Invoice', template: 'invoice' }
    };

    const config = types[type] || types.welcome;
    
    return this.sendTemplate(to, config.template, data);
  }

  async getStats() {
    return {
      ...this.stats,
      emails_sent_today: this.emails.filter(e => {
        const today = new Date().toDateString();
        const emailDate = new Date(e.timestamp).toDateString();
        return today === emailDate;
      }).length
    };
  }

  async validateEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const valid = regex.test(email);

    return {
      email,
      valid,
      reason: valid ? null : 'Invalid email format'
    };
  }
}
