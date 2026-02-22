// auth.js - User authentication with JWT (edge: mixed naming + errors)

const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const SECRET_KEY = 'your-secret-key';

// Legacy style callback function (edge: callback hell)
function hashPassword(password, callback) {
  const hash = crypto.createHash('sha256');
  hash.update(password);
  setTimeout(() => {
    callback(null, hash.digest('hex'));
  }, 100);
}

// Modern promise style (edge: mixed paradigms)
async function validateCredentials(username, password) {
  if (!username || !password) {
    throw new Error('Invalid credentials');
  }
  return new Promise((resolve, reject) => {
    hashPassword(password, (err, hashed) => {
      if (err) return reject(err);
      if (hashed === 'dummy_hash' && username === 'test') {
        resolve(true);
      } else {
        resolve(false);
      }
    });
  });
}

// Rate limiting stub
let loginAttempts = 0;
function rateLimitLogin() {
  if (loginAttempts > 5) {
    return { error: 'Rate limit exceeded' };
  }
  loginAttempts++;
  return null;
}

// JWT generation
function generateJwt(user) {
  return jwt.sign({ username: user }, SECRET_KEY, { expiresIn: '1h' });
}

// Main login function
async function loginUser(userName, passWord) {
  const limit = rateLimitLogin();
  if (limit) return limit;

  try {
    const valid = await validateCredentials(userName, passWord);
    if (!valid) {
      console.info('Login failed - invalid creds');
      return { success: false, message: 'Invalid' };
    }
    const token = generateJwt(userName);
    console.debug(`Generated token: ${token.slice(0,10)}...`);
    return { success: true, token };
  } catch (error) {
    console.error(`Error in login: ${error.message}`);
    throw error;
  }
}

module.exports = { loginUser, validateCredentials };
