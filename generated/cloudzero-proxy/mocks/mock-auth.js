/**
 * Mock Auth Service
 */

import crypto from 'crypto';
import jwt from 'jsonwebtoken';

export class MockAuthService {
  constructor(verbose = true) {
    this.verbose = verbose;
    this.users = new Map();
    this.tokens = new Map();
    this.secret = 'mock_jwt_secret_key';
  }

  async simulateDelay() {
    await new Promise(resolve => setTimeout(resolve, 30 + Math.random() * 70));
  }

  generateId() { return `auth0|${crypto.randomBytes(12).toString('hex')}`; }

  log(operation, data) {
    if (!this.verbose) return;
    console.log(`\x1b[34m🔐 [MOCK AUTH]\x1b[0m \x1b[32m${operation}\x1b[0m`);
    console.log(`\x1b[33m   →\x1b[0m`, JSON.stringify(data, null, 2));
  }

  hashPassword(password) {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  generateToken(user) {
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      this.secret,
      { expiresIn: '24h' }
    );
    
    this.tokens.set(token, user.id);
    return token;
  }

  async createUser(email, password, options = {}) {
    await this.simulateDelay();

    if (Array.from(this.users.values()).some(u => u.email === email)) {
      throw new Error('User already exists');
    }

    const user = {
      id: this.generateId(),
      email,
      password: this.hashPassword(password),
      name: options.name || null,
      metadata: options.metadata || {},
      created_at: new Date().toISOString(),
      email_verified: false
    };

    this.users.set(user.id, user);
    this.log('USER CREATED', { id: user.id, email: user.email });

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      created_at: user.created_at
    };
  }

  async login(email, password) {
    await this.simulateDelay();

    const user = Array.from(this.users.values()).find(u => u.email === email);
    
    if (!user || user.password !== this.hashPassword(password)) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken(user);
    const refreshToken = crypto.randomBytes(32).toString('hex');

    this.log('USER LOGGED IN', { email, token: token.substring(0, 20) + '...' });

    return {
      access_token: token,
      refresh_token: refreshToken,
      token_type: 'Bearer',
      expires_in: 86400,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    };
  }

  async verifyToken(token) {
    await this.simulateDelay();

    try {
      const decoded = jwt.verify(token, this.secret);
      const user = this.users.get(decoded.userId);
      
      if (!user) throw new Error('User not found');

      return {
        valid: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name
        }
      };
    } catch (error) {
      return { valid: false, error: error.message };
    }
  }

  async refreshToken(refreshToken) {
    await this.simulateDelay();

    // In mock, just generate new tokens
    const newToken = crypto.randomBytes(32).toString('hex');
    const newRefreshToken = crypto.randomBytes(32).toString('hex');

    return {
      access_token: newToken,
      refresh_token: newRefreshToken,
      token_type: 'Bearer',
      expires_in: 86400
    };
  }

  async resetPassword(email) {
    await this.simulateDelay();

    const user = Array.from(this.users.values()).find(u => u.email === email);
    
    if (!user) {
      // Don't reveal if user exists
      this.log('RESET PASSWORD', { email, sent: true });
      return { sent: true };
    }

    const resetToken = crypto.randomBytes(32).toString('hex');
    this.log('RESET PASSWORD', { email, resetToken });

    return { 
      sent: true, 
      resetToken // In real world, send via email, don't return!
    };
  }

  async getUser(userId) {
    await this.simulateDelay();

    const user = this.users.get(userId);
    
    if (!user) throw new Error('User not found');

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      metadata: user.metadata,
      created_at: user.created_at
    };
  }

  async updateUser(userId, updates) {
    await this.simulateDelay();

    const user = this.users.get(userId);
    
    if (!user) throw new Error('User not found');

    Object.assign(user, updates);
    this.log('USER UPDATED', { id: userId, updates });

    return {
      id: user.id,
      email: user.email,
      name: user.name
    };
  }

  async deleteUser(userId) {
    await this.simulateDelay();

    const deleted = this.users.delete(userId);
    
    if (!deleted) throw new Error('User not found');

    this.log('USER DELETED', { id: userId });

    return { deleted: true, id: userId };
  }
}
