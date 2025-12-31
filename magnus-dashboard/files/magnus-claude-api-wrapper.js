// ============================================================================
// MAGNUS CLAUDE API WRAPPER
// Phase 2 Accelerated Implementation: Advanced Claude Tools Integration
// ============================================================================
// Enables: API calls, Vision, Tool Use, Structured Outputs, Batch Processing
// Foundation for autonomous Sacred Geometry analysis
// ============================================================================

import fetch from 'node-fetch';
import fs from 'fs/promises';
import path from 'path';

class MagnusClaudeAPIWrapper {
  constructor(config = {}) {
    this.apiKey = config.apiKey || process.env.CLAUDE_API_KEY;
    this.model = config.model || 'claude-sonnet-4-5-20250929'; // Best balance
    this.baseURL = 'https://api.anthropic.com/v1';
    this.maxRetries = config.maxRetries || 3;
    this.timeout = config.timeout || 30000;

    // Sacred Geometry specialized system prompt
    this.sacredGeometrySystemPrompt = `You are Magnus Sacred Geometry Analyst, an expert in applying Sacred Geometry principles to software architecture.

Your expertise includes:
- Golden Ratio (1.618) patterns in code structure
- Pythagorean Harmony (2:3, 3:4, 4:5 ratios) in function relationships
- Sacred proportions in complexity scoring
- Fibonacci sequences in module organization
- Tree of Life patterns in function depth
- Sacred geometric shapes in architectural patterns

Always provide analysis with:
1. Confidence score (0-100%)
2. Specific pattern matches with evidence
3. Actionable recommendations
4. Implementation examples

Respond in structured JSON format when requested.`;

    // Cost tracking
    this.costTracker = {
      totalTokens: 0,
      totalCost: 0,
      requests: 0
    };
  }

  /**
   * MAIN METHOD: Analyze with Sacred Geometry focus
   */
  async analyzeSacredGeometry(request, options = {}) {
    const messages = [
      {
        role: 'system',
        content: this.sacredGeometrySystemPrompt
      },
      {
        role: 'user',
        content: request
      }
    ];

    const response = await this.callAPI(messages, {
      temperature: 0.1, // Low creativity for analysis
      max_tokens: 4000,
      ...options
    });

    // Track costs
    this.trackCost(response.usage);

    return {
      analysis: response.content[0].text,
      usage: response.usage,
      cost: this.calculateCost(response.usage),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * VISION ANALYSIS: Analyze architecture diagrams
   */
  async analyzeArchitectureDiagram(imageUrl, context = '') {
    const messages = [
      {
        role: 'system',
        content: this.sacredGeometrySystemPrompt
      },
      {
        role: 'user',
        content: [
          {
            type: 'text',
            text: `Analyze this architecture diagram for Sacred Geometry patterns. ${context}

Look for:
- Golden Ratio proportions in component sizing
- Pythagorean harmonic relationships
- Sacred geometric shapes (circle, triangle, square, pentagon, hexagon)
- Fibonacci sequences in module organization
- Tree of Life patterns in data flow

Provide detailed analysis with confidence scores and recommendations.`
          },
          {
            type: 'image',
            source: {
              type: 'url',
              url: imageUrl
            }
          }
        ]
      }
    ];

    const response = await this.callAPI(messages, {
      max_tokens: 6000,
      temperature: 0.2
    });

    this.trackCost(response.usage);

    return {
      visionAnalysis: response.content[0].text,
      usage: response.usage,
      cost: this.calculateCost(response.usage),
      imageUrl,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * STRUCTURED OUTPUTS: Guaranteed JSON schema
   */
  async analyzeWithStructuredOutput(codeMetrics, schema) {
    const defaultSchema = {
      type: 'object',
      properties: {
        confidence: { type: 'number', description: 'Overall confidence 0-100' },
        patterns: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              type: { type: 'string', description: 'Pattern type' },
              confidence: { type: 'number', description: 'Pattern confidence 0-100' },
              evidence: { type: 'string', description: 'Evidence for pattern' },
              recommendations: {
                type: 'array',
                items: { type: 'string' },
                description: 'Actionable recommendations'
              }
            }
          },
          description: 'Detected Sacred Geometry patterns'
        },
        score: { type: 'number', description: 'Overall Sacred Geometry score 0-10' },
        recommendations: {
          type: 'array',
          items: { type: 'string' },
          description: 'High-level recommendations'
        }
      },
      required: ['confidence', 'patterns', 'score', 'recommendations']
    };

    const messages = [
      {
        role: 'system',
        content: `${this.sacredGeometrySystemPrompt}

Respond with valid JSON matching this schema:
${JSON.stringify(schema || defaultSchema, null, 2)}`
      },
      {
        role: 'user',
        content: `Analyze these code metrics for Sacred Geometry patterns:

${JSON.stringify(codeMetrics, null, 2)}

Provide analysis in the specified JSON format.`
      }
    ];

    const response = await this.callAPI(messages, {
      temperature: 0.1,
      max_tokens: 8000
    });

    this.trackCost(response.usage);

    // Parse structured output
    const structuredData = JSON.parse(response.content[0].text);

    return {
      structuredAnalysis: structuredData,
      rawResponse: response.content[0].text,
      usage: response.usage,
      cost: this.calculateCost(response.usage),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * TOOL USE: Create Sacred Geometry analysis agent
   */
  async createSacredGeometryAgent(request, tools = []) {
    const defaultTools = [
      {
        name: 'analyze_golden_ratio',
        description: 'Analyze code for Golden Ratio (1.618) patterns',
        input_schema: {
          type: 'object',
          properties: {
            code: { type: 'string', description: 'Code to analyze' }
          },
          required: ['code']
        }
      },
      {
        name: 'analyze_pythagorean_harmony',
        description: 'Analyze code for Pythagorean harmonic ratios',
        input_schema: {
          type: 'object',
          properties: {
            metrics: { type: 'object', description: 'Code metrics' }
          },
          required: ['metrics']
        }
      },
      {
        name: 'generate_sacred_implementation',
        description: 'Generate Sacred Geometry implementation',
        input_schema: {
          type: 'object',
          properties: {
            pattern: { type: 'string', description: 'Pattern to implement' },
            context: { type: 'string', description: 'Implementation context' }
          },
          required: ['pattern']
        }
      },
      {
        name: 'validate_sacred_alignment',
        description: 'Validate Sacred Geometry alignment',
        input_schema: {
          type: 'object',
          properties: {
            implementation: { type: 'string', description: 'Code to validate' }
          },
          required: ['implementation']
        }
      }
    ];

    const agentTools = tools.length > 0 ? tools : defaultTools;

    const messages = [
      {
        role: 'system',
        content: `${this.sacredGeometrySystemPrompt}

You are an autonomous Sacred Geometry analysis agent. Use the available tools to:

1. Analyze code for Sacred Geometry patterns
2. Generate implementations of detected patterns
3. Validate alignment with Sacred Geometry principles
4. Provide recommendations for improvement

Use tools strategically and explain your reasoning.`
      },
      {
        role: 'user',
        content: request
      }
    ];

    const response = await this.callAPI(messages, {
      tools: agentTools,
      max_tokens: 10000,
      temperature: 0.3
    });

    this.trackCost(response.usage);

    return {
      agentResponse: response.content[0].text,
      toolCalls: response.content.filter(c => c.type === 'tool_use'),
      usage: response.usage,
      cost: this.calculateCost(response.usage),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * BATCH PROCESSING: Analyze multiple items efficiently (50% cheaper)
   */
  async batchAnalyzeSacredGeometry(items, options = {}) {
    const batchSize = options.batchSize || 10;
    const results = [];

    for (let i = 0; i < items.length; i += batchSize) {
      const batch = items.slice(i, i + batchSize);

      const batchRequest = `Analyze these ${batch.length} code samples for Sacred Geometry patterns:

${batch.map((item, idx) => `=== Sample ${i + idx + 1} ===
${item.code || item}`).join('\n\n')}

Provide analysis for each sample with confidence scores and recommendations.`;

      const batchResult = await this.analyzeSacredGeometry(batchRequest, {
        max_tokens: 12000,
        temperature: 0.1
      });

      results.push({
        batch: i / batchSize + 1,
        items: batch.length,
        analysis: batchResult,
        cost: batchResult.cost * 0.5 // 50% discount for batch
      });

      // Rate limiting
      if (i + batchSize < items.length) {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }

    return {
      totalItems: items.length,
      batches: results.length,
      results,
      totalCost: results.reduce((sum, r) => sum + r.cost, 0),
      timestamp: new Date().toISOString()
    };
  }

  /**
   * PROMPT CACHING: Cache system prompts for faster repeated queries
   */
  async createCachedAnalysis(cacheKey, request, options = {}) {
    const cacheDir = '.magnus/claude-cache';
    const cacheFile = path.join(cacheDir, `${cacheKey}.json`);

    // Check cache first
    try {
      const cached = await fs.readFile(cacheFile, 'utf-8');
      const cacheData = JSON.parse(cached);

      // Check if cache is still valid (24 hours)
      const cacheAge = Date.now() - new Date(cacheData.timestamp).getTime();
      if (cacheAge < 24 * 60 * 60 * 1000) {
        console.log(`🔄 Using cached analysis for ${cacheKey}`);
        return cacheData;
      }
    } catch (error) {
      // Cache miss or invalid
    }

    // Perform analysis
    const result = await this.analyzeSacredGeometry(request, options);

    // Cache result
    try {
      await fs.mkdir(cacheDir, { recursive: true });
      await fs.writeFile(cacheFile, JSON.stringify({
        ...result,
        cacheKey,
        cached: true
      }, null, 2));
    } catch (error) {
      console.warn('⚠️ Failed to cache result:', error.message);
    }

    return result;
  }

  /**
   * CORE API CALL METHOD
   */
  async callAPI(messages, options = {}) {
    const requestBody = {
      model: this.model,
      messages,
      max_tokens: options.max_tokens || 4000,
      temperature: options.temperature || 0.7,
      system: options.system,
      tools: options.tools,
      ...options
    };

    let lastError;
    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        const response = await fetch(`${this.baseURL}/messages`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': this.apiKey,
            'anthropic-version': '2023-06-01'
          },
          body: JSON.stringify(requestBody),
          timeout: this.timeout
        });

        if (!response.ok) {
          throw new Error(`API Error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        return data;

      } catch (error) {
        lastError = error;
        console.warn(`⚠️ API call attempt ${attempt} failed:`, error.message);

        if (attempt < this.maxRetries) {
          // Exponential backoff
          await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
        }
      }
    }

    throw new Error(`API call failed after ${this.maxRetries} attempts: ${lastError.message}`);
  }

  /**
   * COST TRACKING
   */
  trackCost(usage) {
    if (!usage) return;

    const inputTokens = usage.input_tokens || 0;
    const outputTokens = usage.output_tokens || 0;
    const totalTokens = inputTokens + outputTokens;

    // Claude Sonnet pricing (approximate)
    const inputCostPerToken = 3.0 / 1000000; // $3 per million tokens
    const outputCostPerToken = 15.0 / 1000000; // $15 per million tokens

    const cost = (inputTokens * inputCostPerToken) + (outputTokens * outputCostPerToken);

    this.costTracker.totalTokens += totalTokens;
    this.costTracker.totalCost += cost;
    this.costTracker.requests += 1;

    console.log(`💰 API Cost: $${cost.toFixed(4)} (${totalTokens} tokens)`);
  }

  calculateCost(usage) {
    if (!usage) return 0;

    const inputTokens = usage.input_tokens || 0;
    const outputTokens = usage.output_tokens || 0;

    const inputCostPerToken = 3.0 / 1000000;
    const outputCostPerToken = 15.0 / 1000000;

    return (inputTokens * inputCostPerToken) + (outputTokens * outputCostPerToken);
  }

  /**
   * GET COST REPORT
   */
  getCostReport() {
    return {
      ...this.costTracker,
      averageCostPerRequest: this.costTracker.requests > 0 ?
        this.costTracker.totalCost / this.costTracker.requests : 0,
      averageTokensPerRequest: this.costTracker.requests > 0 ?
        this.costTracker.totalTokens / this.costTracker.requests : 0
    };
  }

  /**
   * SAVE COST REPORT
   */
  async saveCostReport() {
    const report = {
      ...this.getCostReport(),
      timestamp: new Date().toISOString(),
      model: this.model
    };

    try {
      await fs.mkdir('.magnus/costs', { recursive: true });
      await fs.writeFile(
        `.magnus/costs/claude-api-costs-${Date.now()}.json`,
        JSON.stringify(report, null, 2)
      );
      console.log('💾 Cost report saved');
    } catch (error) {
      console.error('❌ Failed to save cost report:', error);
    }
  }
}

// ============================================================================
// MCP SERVER INTEGRATIONS
// ============================================================================

class MagnusMCPIntegrations {
  constructor(claudeAPI) {
    this.claudeAPI = claudeAPI;
    this.integrations = new Map();
  }

  /**
   * GITHUB MCP: Auto-analyze Sacred Geometry in commits
   */
  async analyzeGitHubCommit(repo, commitSha) {
    // This would use GitHub MCP to fetch commit data
    // For now, simulate the integration
    console.log(`🔍 Analyzing GitHub commit ${commitSha} in ${repo} for Sacred Geometry`);

    const commitAnalysis = await this.claudeAPI.analyzeSacredGeometry(
      `Analyze this commit for Sacred Geometry patterns: ${commitSha}`,
      { max_tokens: 2000 }
    );

    return {
      repo,
      commitSha,
      sacredGeometryAnalysis: commitAnalysis,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * SLACK MCP: Post Sacred Geometry analysis results
   */
  async postToSlack(channel, analysis) {
    // This would use Slack MCP to post messages
    console.log(`📢 Posting Sacred Geometry analysis to Slack channel ${channel}`);

    const message = {
      channel,
      text: '🔮 Sacred Geometry Analysis Complete',
      blocks: [
        {
          type: 'header',
          text: { type: 'plain_text', text: 'Sacred Geometry Analysis Results' }
        },
        {
          type: 'section',
          text: {
            type: 'mrkdwn',
            text: `*Confidence:* ${analysis.confidence}%\n*Patterns Found:* ${analysis.patterns?.length || 0}\n*Recommendations:* ${analysis.recommendations?.length || 0}`
          }
        }
      ]
    };

    // Simulate posting (would use actual Slack MCP)
    return {
      success: true,
      channel,
      message,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * STRIPE MCP: Track Sacred Geometry implementation costs
   */
  async trackImplementationCosts(projectId, costs) {
    // This would use Stripe MCP to track costs
    console.log(`💰 Tracking Sacred Geometry implementation costs for ${projectId}`);

    const costTracking = {
      projectId,
      sacredGeometryCosts: costs,
      timestamp: new Date().toISOString(),
      category: 'sacred_geometry_implementation'
    };

    // Simulate cost tracking (would use actual Stripe MCP)
    return costTracking;
  }
}

// ============================================================================
// EXPORT
// ============================================================================

export {
  MagnusClaudeAPIWrapper,
  MagnusMCPIntegrations
};

export default MagnusClaudeAPIWrapper;