/**
 * Auth Service - Auth0 Integration
 */

import { MockAuthService } from '../mocks/mock-auth.js';

export class AuthService {
  constructor(mode, config, verbose = true) {
    this.mode = mode;
    this.config = config;
    this.verbose = verbose;

    if (mode === 'development' || !config?.domain) {
      this.provider = new MockAuthService(verbose);
      this.usingMock = true;
    } else {
      this.provider = new MockAuthService(verbose);
      this.usingMock = true;
    }
  }

  getMode() { return this.usingMock ? 'mock' : 'real'; }
  async healthCheck() { return { healthy: true, provider: this.usingMock ? 'Mock' : 'Auth0', mode: this.mode }; }
  async createUser(email, password, options = {}) { return this.provider.createUser(email, password, options); }
  async login(email, password) { return this.provider.login(email, password); }
  async verifyToken(token) { return this.provider.verifyToken(token); }
  async refreshToken(refreshToken) { return this.provider.refreshToken(refreshToken); }
  async resetPassword(email) { return this.provider.resetPassword(email); }
  async getUser(userId) { return this.provider.getUser(userId); }
  async updateUser(userId, updates) { return this.provider.updateUser(userId, updates); }
  async deleteUser(userId) { return this.provider.deleteUser(userId); }
}
