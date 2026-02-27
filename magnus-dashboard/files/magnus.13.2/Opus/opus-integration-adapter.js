/**
 * ============================================================================
 * OPUS 4.5 INTEGRATION ADAPTER
 * 
 * Handles communication with Claude Opus 4.5 API for code review
 * 
 * Features:
 * - Code review request formatting
 * - Response parsing (inline comments + diffs)
 * - Retry logic with exponential backoff
 * - Rate limiting
 * - Caching for similar code reviews
 * ============================================================================
 */

import crypto from 'crypto';

// ============================================================================
// OPUS 4.5 API CLIENT
// ============================================================================

class Opus45APIClient {
  constructor(config = {}) {
    this.config = {
      apiKey: config.apiKey || process.env.ANTHROPIC_API_KEY,
      baseURL: config.baseURL || 'https://api.anthropic.com',
      model: config.model || 'claude-opus-4.5',
      maxTokens: config.maxTokens || 4096,
      temperature: config.temperature || 0.3,  // Lower for code review precision
      
      // Retry config
      maxRetries: config.maxRetries || 3,
      retryDelay: config.retryDelay || 1000,
      
      // Rate limiting
      requestsPerMinute: config.requestsPerMinute || 50,
      
      // Caching
      enableCache: config.enableCache !== false,
      cacheTTL: config.cacheTTL || 3600000  // 1 hour
    };

    this.requestQueue = [];
    this.cache = new Map();
    this.rateLimiter = this.createRateLimiter();
  }

  createRateLimiter() {
    const tokens = [];
    const interval = 60000 / this.config.requestsPerMinute;
    
    return {
      async acquire() {
        const now = Date.now();
        
        // Remove old tokens
        while (tokens.length > 0 && tokens[0] < now - 60000) {
          tokens.shift();
        }
        
        if (tokens.length >= this.config.requestsPerMinute) {
          const oldestToken = tokens[0];
          const waitTime = 60000 - (now - oldestToken);
          await this.sleep(waitTime);
        }
        
        tokens.push(now);
      },
      
      sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
    };
  }

  /**
   * Request code review from Opus 4.5
   */
  async requestCodeReview(code, context = {}) {
    // Check cache first
    if (this.config.enableCache) {
      const cacheKey = this.generateCacheKey(code, context);
      const cached = this.cache.get(cacheKey);
      
      if (cached && Date.now() - cached.timestamp < this.config.cacheTTL) {
        console.log('📦 Using cached Opus 4.5 review');
        return cached.result;
      }
    }

    // Rate limiting
    await this.rateLimiter.acquire();

    // Prepare review request
    const prompt = this.buildReviewPrompt(code, context);
    
    // Make API call with retry
    const result = await this.callWithRetry(async () => {
      return await this.makeAPICall(prompt);
    });

    // Cache result
    if (this.config.enableCache) {
      const cacheKey = this.generateCacheKey(code, context);
      this.cache.set(cacheKey, {
        result,
        timestamp: Date.now()
      });
    }

    return result;
  }

  /**
   * Build comprehensive code review prompt for Opus 4.5
   */
  buildReviewPrompt(code, context) {
    const systemPrompt = `You are Claude Opus 4.5, an expert code reviewer.

Your task is to perform a comprehensive code review, focusing on:
1. Critical bugs (logic errors, null pointer, race conditions)
2. Security vulnerabilities (SQL injection, XSS, authentication)
3. Performance issues (inefficient algorithms, unnecessary operations)
4. Code quality (naming, style, maintainability)

Output format:
- Use inline comments with severity: // OPUS: [CRITICAL|MEDIUM|MINOR]: description
- For each issue, provide a suggested fix in a diff block:
  \`\`\`diff
  - old code
  + new code
  \`\`\`
- Group findings by severity in a summary at the end

Be precise, actionable, and focus on the most impactful issues first.`;

    const userPrompt = `Please review this code:

${context.filename ? `File: ${context.filename}\n` : ''}${context.description ? `Context: ${context.description}\n` : ''}
\`\`\`${context.language || 'javascript'}
${code}
\`\`\`

${context.focusAreas ? `\nFocus areas: ${context.focusAreas.join(', ')}` : ''}
${context.knownIssues ? `\nKnown issues to verify: ${context.knownIssues.join(', ')}` : ''}`;

    return {
      system: systemPrompt,
      user: userPrompt
    };
  }

  /**
   * Make actual API call to Anthropic
   */
  async makeAPICall(prompt) {
    const response = await fetch(`${this.config.baseURL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': this.config.apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: this.config.model,
        max_tokens: this.config.maxTokens,
        temperature: this.config.temperature,
        system: prompt.system,
        messages: [
          {
            role: 'user',
            content: prompt.user
          }
        ]
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(`Opus API Error: ${error.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    return {
      review: data.content[0].text,
      usage: {
        inputTokens: data.usage.input_tokens,
        outputTokens: data.usage.output_tokens
      },
      model: data.model,
      timestamp: Date.now()
    };
  }

  /**
   * Retry logic with exponential backoff
   */
  async callWithRetry(fn, attempt = 1) {
    try {
      return await fn();
    } catch (error) {
      if (attempt >= this.config.maxRetries) {
        throw error;
      }

      const delay = this.config.retryDelay * Math.pow(2, attempt - 1);
      console.log(`⚠️  Opus API call failed, retrying in ${delay}ms... (attempt ${attempt}/${this.config.maxRetries})`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
      return this.callWithRetry(fn, attempt + 1);
    }
  }

  /**
   * Generate cache key for code review
   */
  generateCacheKey(code, context) {
    const data = JSON.stringify({ code, context });
    return crypto.createHash('sha256').update(data).digest('hex');
  }

  /**
   * Clear expired cache entries
   */
  clearExpiredCache() {
    const now = Date.now();
    for (const [key, value] of this.cache.entries()) {
      if (now - value.timestamp >= this.config.cacheTTL) {
        this.cache.delete(key);
      }
    }
  }
}

// ============================================================================
// OPUS INTEGRATION ADAPTER
// ============================================================================

class OpusIntegrationAdapter {
  constructor(config = {}) {
    this.client = new Opus45APIClient(config);
    this.config = {
      autoDetectLanguage: config.autoDetectLanguage !== false,
      parseInlineComments: config.parseInlineComments !== false,
      extractDiffs: config.extractDiffs !== false,
      ...config
    };
  }

  /**
   * Perform code review with Opus 4.5
   */
  async reviewCode(code, options = {}) {
    console.log('\n🎯 Requesting Opus 4.5 code review...');
    
    const context = {
      filename: options.filename,
      description: options.description,
      language: options.language || (this.config.autoDetectLanguage ? this.detectLanguage(code) : 'javascript'),
      focusAreas: options.focusAreas || ['bugs', 'security', 'performance'],
      knownIssues: options.knownIssues || []
    };

    const startTime = Date.now();
    const result = await this.client.requestCodeReview(code, context);
    const duration = Date.now() - startTime;

    console.log(`✓ Opus 4.5 review completed in ${(duration / 1000).toFixed(2)}s`);
    console.log(`  Tokens: ${result.usage.inputTokens} in / ${result.usage.outputTokens} out`);

    // Parse review output
    const parsed = this.parseReview(result.review);

    return {
      raw: result.review,
      parsed,
      metadata: {
        model: result.model,
        duration,
        tokens: result.usage,
        timestamp: result.timestamp
      }
    };
  }

  /**
   * Parse Opus review into structured format
   */
  parseReview(reviewText) {
    const parsed = {
      inlineComments: [],
      criticalIssues: [],
      mediumIssues: [],
      minorIssues: [],
      suggestedDiffs: [],
      summary: ''
    };

    if (!reviewText) return parsed;

    // Extract inline comments
    if (this.config.parseInlineComments) {
      const commentRegex = /\/\/ OPUS: (CRITICAL|MEDIUM|MINOR): (.+?)(?:\n|$)/gm;
      let match;
      
      while ((match = commentRegex.exec(reviewText)) !== null) {
        const comment = {
          severity: match[1],
          description: match[2].trim(),
          line: this.extractLineNumber(reviewText, match.index)
        };
        
        parsed.inlineComments.push(comment);
        
        // Categorize by severity
        if (comment.severity === 'CRITICAL') {
          parsed.criticalIssues.push(comment);
        } else if (comment.severity === 'MEDIUM') {
          parsed.mediumIssues.push(comment);
        } else {
          parsed.minorIssues.push(comment);
        }
      }
    }

    // Extract suggested diffs
    if (this.config.extractDiffs) {
      const diffRegex = /```diff\n([\s\S]+?)\n```/gm;
      let match;
      
      while ((match = diffRegex.exec(reviewText)) !== null) {
        const diff = {
          content: match[1],
          before: this.extractDiffBefore(match[1]),
          after: this.extractDiffAfter(match[1]),
          context: this.extractDiffContext(reviewText, match.index)
        };
        
        parsed.suggestedDiffs.push(diff);
      }
    }

    // Extract summary (everything after "Summary:" or "## Summary")
    const summaryMatch = reviewText.match(/(?:Summary:|## Summary)\s*([\s\S]+?)(?:\n##|\n```|$)/i);
    if (summaryMatch) {
      parsed.summary = summaryMatch[1].trim();
    }

    return parsed;
  }

  extractLineNumber(text, index) {
    const upToIndex = text.substring(0, index);
    return upToIndex.split('\n').length;
  }

  extractDiffBefore(diffContent) {
    const lines = diffContent.split('\n')
      .filter(line => line.startsWith('-'))
      .map(line => line.substring(1).trim());
    return lines.join('\n');
  }

  extractDiffAfter(diffContent) {
    const lines = diffContent.split('\n')
      .filter(line => line.startsWith('+'))
      .map(line => line.substring(1).trim());
    return lines.join('\n');
  }

  extractDiffContext(text, diffIndex) {
    const start = Math.max(0, diffIndex - 200);
    const context = text.substring(start, diffIndex);
    
    // Extract last complete sentence or code block
    const lines = context.split('\n');
    return lines[lines.length - 1] || '';
  }

  /**
   * Detect programming language from code
   */
  detectLanguage(code) {
    // Simple heuristics
    if (code.includes('function') || code.includes('const ') || code.includes('let ')) {
      return 'javascript';
    }
    if (code.includes('def ') || code.includes('import ')) {
      return 'python';
    }
    if (code.includes('package ') || code.includes('public class')) {
      return 'java';
    }
    if (code.includes('#include') || code.includes('int main')) {
      return 'cpp';
    }
    
    return 'javascript';  // Default
  }

  /**
   * Batch review multiple files
   */
  async reviewBatch(files) {
    console.log(`\n🎯 Reviewing ${files.length} file(s) with Opus 4.5...`);
    
    const results = [];
    
    for (const file of files) {
      try {
        const result = await this.reviewCode(file.code, {
          filename: file.filename,
          language: file.language,
          description: file.description
        });
        
        results.push({
          filename: file.filename,
          success: true,
          review: result
        });
      } catch (error) {
        console.error(`✗ Failed to review ${file.filename}:`, error.message);
        results.push({
          filename: file.filename,
          success: false,
          error: error.message
        });
      }
    }
    
    const successful = results.filter(r => r.success).length;
    console.log(`✓ Completed: ${successful}/${files.length} successful`);
    
    return results;
  }

  /**
   * Get statistics from client
   */
  getStats() {
    return {
      cacheSize: this.client.cache.size,
      config: {
        model: this.client.config.model,
        maxTokens: this.client.config.maxTokens,
        temperature: this.client.config.temperature,
        cacheEnabled: this.client.config.enableCache
      }
    };
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.client.cache.clear();
    console.log('✓ Opus integration cache cleared');
  }
}

export {
  OpusIntegrationAdapter,
  Opus45APIClient
};
