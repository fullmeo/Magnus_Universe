/**
 * Example 2: Medium API with Auth + DB
 * 
 * This is a medium-complexity example extending the simple API with:
 * - JWT-based authentication
 * - Rate limiting (100 req/min)
 * - In-memory database stub
 * - Structured JSON logging
 */

import crypto from 'crypto';

// ============================================
// TYPES
// ============================================

interface User {
  id: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

interface TokenPayload {
  userId: string;
  email: string;
  iat: number;
  exp: number;
}

interface AuthResult {
  success: boolean;
  token?: string;
  error?: string;
}

interface LogEntry {
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR';
  message: string;
  [key: string]: unknown;
}

// ============================================
// CONFIGURATION
// ============================================

const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-key';
const RATE_LIMIT = 100; // requests per minute
const RATE_WINDOW_MS = 60 * 1000;

// ============================================
// IN-MEMORY DATABASE (from db.ts)
// ============================================

class InMemoryDB {
  private users: Map<string, User> = new Map();
  private emailIndex: Map<string, string> = new Map(); // email -> userId
  private requestCounts: Map<string, number[]> = new Map();

  async createUser(email: string, password: string): Promise<User> {
    const existing = this.emailIndex.get(email);
    if (existing) {
      throw new Error('User already exists');
    }

    const user: User = {
      id: crypto.randomUUID(),
      email,
      passwordHash: this.hashPassword(password),
      createdAt: new Date(),
    };

    this.users.set(user.id, user);
    this.emailIndex.set(email, user.id);
    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.get(id) || null;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    const userId = this.emailIndex.get(email);
    if (!userId) return null;
    return this.users.get(userId) || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User | null> {
    const user = this.users.get(id);
    if (!user) return null;

    const updated = { ...user, ...updates };
    this.users.set(id, updated);
    return updated;
  }

  // Rate limiting
  checkRateLimit(userId: string): boolean {
    const now = Date.now();
    const windowStart = now - RATE_WINDOW_MS;
    
    const userRequests = this.requestCounts.get(userId) || [];
    const recentRequests = userRequests.filter(t => t > windowStart);
    
    if (recentRequests.length >= RATE_LIMIT) {
      return false; // Rate limited
    }
    
    recentRequests.push(now);
    this.requestCounts.set(userId, recentRequests);
    return true;
  }

  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }
}

const db = new InMemoryDB();

// ============================================
// AUTHENTICATION LOGIC (from auth.ts)
// ============================================

function verifyPassword(password: string, hash: string): boolean {
  return crypto.createHash('sha256').update(password).digest('hex') === hash;
}

function generateJWT(user: User): string {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const now = Math.floor(Date.now() / 1000);
  const exp = now + 86400; // 24 hours
  
  const payload: TokenPayload = {
    userId: user.id,
    email: user.email,
    iat: now,
    exp,
  };
  
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${header}.${encodedPayload}`)
    .digest('base64url');
  
  return `${header}.${encodedPayload}.${signature}`;
}

function verifyJWT(token: string): TokenPayload | null {
  try {
    const parts = token.split('.');
    if (parts.length !== 3) return null;
    
    const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString()) as TokenPayload;
    
    if (payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Token expired
    }
    
    return payload;
  } catch {
    return null;
  }
}

async function login(email: string, password: string): Promise<AuthResult> {
  const user = await db.getUserByEmail(email);
  
  if (!user) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  if (!verifyPassword(password, user.passwordHash)) {
    return { success: false, error: 'Invalid credentials' };
  }
  
  const token = generateJWT(user);
  return { success: true, token };
}

async function register(email: string, password: string): Promise<AuthResult> {
  try {
    const user = await db.createUser(email, password);
    const token = generateJWT(user);
    return { success: true, token };
  } catch (error) {
    return { success: false, error: (error as Error).message };
  }
}

async function getProfile(userId: string): Promise<User | null> {
  return db.getUserById(userId);
}

async function updateProfile(userId: string, data: { email?: string }): Promise<User | null> {
  return db.updateUser(userId, data);
}

// ============================================
// STRUCTURED JSON LOGGING
// ============================================

function log(level: LogEntry['level'], message: string, meta: Record<string, unknown> = {}): void {
  const entry: LogEntry = {
    timestamp: new Date().toISOString(),
    level,
    message,
    ...meta,
  };
  console.log(JSON.stringify(entry));
}

function logRequest(method: string, path: string, status: number, duration: number): void {
  log('INFO', `${method} ${path} ${status}`, { method, path, status, duration });
}

// ============================================
// ROUTER (from api.ts)
// ============================================

interface Request {
  method: string;
  path: string;
  headers: Record<string, string>;
  body?: unknown;
}

interface Response {
  status: number;
  body: unknown;
}

async function handleRequest(req: Request): Promise<Response> {
  const start = Date.now();
  let response: Response;

  try {
    // Parse path
    const [basePath, ...pathParts] = req.path.split('/').filter(Boolean);
    
    // Route: /auth/register
    if (req.method === 'POST' && basePath === 'auth' && pathParts[0] === 'register') {
      const { email, password } = req.body as { email?: string; password?: string };
      if (!email || !password) {
        response = { status: 400, body: { error: 'Email and password required' } };
      } else {
        const result = await register(email, password);
        if (result.success) {
          response = { status: 201, body: { token: result.token } };
        } else {
          response = { status: 400, body: { error: result.error } };
        }
      }
    }
    // Route: /auth/login
    else if (req.method === 'POST' && basePath === 'auth' && pathParts[0] === 'login') {
      const { email, password } = req.body as { email?: string; password?: string };
      if (!email || !password) {
        response = { status: 400, body: { error: 'Email and password required' } };
      } else {
        const result = await login(email, password);
        if (result.success) {
          response = { status: 200, body: { token: result.token } };
        } else {
          response = { status: 401, body: { error: result.error } };
        }
      }
    }
    // Route: /users/:id (auth required)
    else if ((req.method === 'GET' || req.method === 'PUT') && basePath === 'users' && pathParts[0]) {
      const authHeader = req.headers.authorization;
      if (!authHeader?.startsWith('Bearer ')) {
        response = { status: 401, body: { error: 'Authorization required' } };
      } else {
        const token = authHeader.slice(7);
        const payload = verifyJWT(token);
        
        if (!payload) {
          response = { status: 401, body: { error: 'Invalid or expired token' } };
        } else if (payload.userId !== pathParts[0]) {
          response = { status: 403, body: { error: 'Cannot access this resource' } };
        } else if (!db.checkRateLimit(payload.userId)) {
          response = { status: 429, body: { error: 'Rate limit exceeded' } };
        } else if (req.method === 'GET') {
          const user = await getProfile(payload.userId);
          if (user) {
            response = { status: 200, body: { id: user.id, email: user.email, createdAt: user.createdAt } };
          } else {
            response = { status: 404, body: { error: 'User not found' } };
          }
        } else {
          const { email } = req.body as { email?: string };
          const updated = await updateProfile(payload.userId, { email });
          if (updated) {
            response = { status: 200, body: { id: updated.id, email: updated.email } };
          } else {
            response = { status: 404, body: { error: 'User not found' } };
          }
        }
      }
    }
    else {
      response = { status: 404, body: { error: 'Not found' } };
    }
  } catch (error) {
    log('ERROR', 'Request handler error', { error: (error as Error).message });
    response = { status: 500, body: { error: 'Internal server error' } };
  }

  const duration = Date.now() - start;
  logRequest(req.method, req.path, response.status, duration);
  return response;
}

// ============================================
// EXPORTS FOR TESTING
// ============================================

export {
  db,
  login,
  register,
  getProfile,
  updateProfile,
  verifyJWT,
  handleRequest,
  log,
};

export type { User, AuthResult, Request, Response };
