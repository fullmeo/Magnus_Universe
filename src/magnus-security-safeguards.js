/**
 * Magnus Security Safeguards
 *
 * Implements the 8th Hermetic Principle: "Security - Integrity guards all creation"
 *
 * This module provides proactive security validation for Magnus-generated code,
 * particularly for future web application generation capabilities.
 *
 * Philosophy:
 * "As code reflects consciousness, security reflects integrity.
 *  Validate before reveal, sanitize before manifest."
 *
 * @version 1.0.0
 * @since 2026-01-10 (Response to GHSA-3cgp-3xvw-98x8)
 */

export class SecuritySafeguards {
  /**
   * Dangerous patterns that indicate potential XSS vulnerabilities
   */
  static DANGEROUS_PATTERNS = {
    scriptTags: /<script[^>]*>.*?<\/script>/gis,
    javascriptProtocol: /javascript:/gi,
    eventHandlers: /on\w+\s*=/gi,
    iframes: /<iframe[^>]*>/gi,
    objectEmbeds: /<(object|embed)[^>]*>/gi,
    dataURIs: /data:text\/html/gi,
    vbscriptProtocol: /vbscript:/gi,
  };

  /**
   * Patterns specific to React Router / Remix vulnerabilities
   */
  static FRAMEWORK_PATTERNS = {
    metaScriptInjection: /script:ld\+json.*<\/script>/gis,
    reactDangerouslySet: /dangerouslySetInnerHTML/g,
    vueVHtml: /v-html/g,
  };

  /**
   * Validates an intention object for security vulnerabilities
   *
   * @param {Object} intention - The intention to validate
   * @returns {Object} Validation result { valid: boolean, issues: string[] }
   */
  static validateIntention(intention) {
    const issues = [];
    const serialized = JSON.stringify(intention);

    // Check for XSS patterns
    for (const [name, pattern] of Object.entries(this.DANGEROUS_PATTERNS)) {
      if (pattern.test(serialized)) {
        issues.push(`Dangerous pattern detected: ${name}`);
      }
    }

    // Check for framework-specific vulnerabilities
    for (const [name, pattern] of Object.entries(this.FRAMEWORK_PATTERNS)) {
      if (pattern.test(serialized)) {
        issues.push(`Framework vulnerability pattern detected: ${name}`);
      }
    }

    // Check for suspicious strings
    const suspiciousStrings = [
      'eval(',
      'Function(',
      'setTimeout(',
      'setInterval(',
      'document.write(',
      'document.cookie',
      'window.location',
    ];

    for (const suspicious of suspiciousStrings) {
      if (serialized.includes(suspicious)) {
        issues.push(`Suspicious code pattern: ${suspicious}`);
      }
    }

    return {
      valid: issues.length === 0,
      issues,
      severity: issues.length > 0 ? 'HIGH' : 'NONE',
    };
  }

  /**
   * Sanitizes HTML content for safe display
   * Uses HTML entity encoding to prevent XSS
   *
   * @param {string} html - Raw HTML content
   * @returns {string} Sanitized HTML
   */
  static sanitizeHTML(html) {
    if (typeof html !== 'string') {
      return html;
    }

    return html
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .replace(/\//g, '&#x2F;');
  }

  /**
   * Sanitizes JSON-LD data to prevent script injection
   * Specifically addresses GHSA-3cgp-3xvw-98x8 vulnerability
   *
   * @param {Object} data - JSON-LD data object
   * @returns {string} Safe JSON string for script tags
   */
  static sanitizeJSONLD(data) {
    const jsonString = JSON.stringify(data);

    // Escape closing script tags and HTML comments
    return jsonString
      .replace(/<\//g, '<\\/')  // </script> becomes <\/script>
      .replace(/<!--/g, '<\\!--')
      .replace(/-->/g, '--\\>')
      .replace(/<script/gi, '<\\script')
      .replace(/javascript:/gi, 'javascript\\:');
  }

  /**
   * Validates output before manifestation
   * Ensures generated code doesn't contain vulnerabilities
   *
   * @param {Object} output - Generated code/content
   * @returns {Object} Validation result with sanitized output
   */
  static validateOutput(output) {
    const issues = [];
    let sanitizedOutput = { ...output };

    // If output contains HTML/JSX
    if (output.template && typeof output.template === 'string') {
      const validation = this.validateIntention({ template: output.template });
      if (!validation.valid) {
        issues.push(...validation.issues);
        sanitizedOutput.template = this.sanitizeHTML(output.template);
      }
    }

    // If output contains JSON-LD
    if (output.jsonLD) {
      sanitizedOutput.jsonLD = this.sanitizeJSONLD(output.jsonLD);
    }

    return {
      valid: issues.length === 0,
      issues,
      output: sanitizedOutput,
      sanitized: issues.length > 0,
    };
  }

  /**
   * Creates a Content Security Policy header configuration
   * For future web application generation
   *
   * @param {Object} options - CSP configuration options
   * @returns {string} CSP header value
   */
  static generateCSP(options = {}) {
    const defaults = {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"], // For CSS-in-JS
      imgSrc: ["'self'", 'data:', 'https:'],
      fontSrc: ["'self'"],
      connectSrc: ["'self'"],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
    };

    const config = { ...defaults, ...options };

    const directives = Object.entries(config)
      .map(([key, values]) => {
        const directive = key.replace(/([A-Z])/g, '-$1').toLowerCase();
        return `${directive} ${values.join(' ')}`;
      })
      .join('; ');

    return directives;
  }

  /**
   * Performs a comprehensive security audit
   * For integration into Magnus Complete Cycle
   *
   * @param {Object} context - Current cycle context
   * @returns {Object} Audit result with recommendations
   */
  static audit(context) {
    const intentionValidation = this.validateIntention(context.intention || {});
    const outputValidation = context.output
      ? this.validateOutput(context.output)
      : { valid: true, issues: [] };

    const allIssues = [
      ...intentionValidation.issues,
      ...outputValidation.issues,
    ];

    return {
      passed: allIssues.length === 0,
      issues: allIssues,
      severity: allIssues.length > 0 ? 'HIGH' : 'NONE',
      recommendations: this._generateRecommendations(allIssues),
      timestamp: new Date().toISOString(),
      compliance: {
        owaspTop10: allIssues.length === 0,
        cwe79: !intentionValidation.issues.some(i => i.includes('XSS')),
      },
    };
  }

  /**
   * Generates actionable recommendations based on detected issues
   * @private
   */
  static _generateRecommendations(issues) {
    const recommendations = [];

    if (issues.some(i => i.includes('script'))) {
      recommendations.push('Sanitize all HTML content before rendering');
      recommendations.push('Use sanitizeHTML() or sanitizeJSONLD() methods');
    }

    if (issues.some(i => i.includes('eval') || i.includes('Function'))) {
      recommendations.push('Avoid dynamic code evaluation');
      recommendations.push('Use static code generation patterns');
    }

    if (issues.some(i => i.includes('cookie') || i.includes('location'))) {
      recommendations.push('Validate all client-side navigation');
      recommendations.push('Implement CSRF tokens for state changes');
    }

    if (issues.some(i => i.includes('meta'))) {
      recommendations.push('Apply sanitizeJSONLD() to all meta() SSR data');
      recommendations.push('Upgrade to React Router 7.9.0+ or Remix 2.17.1+');
    }

    if (recommendations.length === 0) {
      recommendations.push('Security validation passed - maintain current practices');
    }

    return recommendations;
  }

  /**
   * Integration point for Magnus Complete Cycle
   * Call this between Contemplation and Revelation phases
   *
   * @param {Object} cycleContext - Current cycle state
   * @throws {SecurityError} If critical vulnerabilities detected
   * @returns {Object} Enhanced context with security validation
   */
  static validateCycle(cycleContext) {
    const audit = this.audit(cycleContext);

    if (!audit.passed && audit.severity === 'HIGH') {
      const error = new Error('Security validation failed');
      error.name = 'SecurityError';
      error.issues = audit.issues;
      error.recommendations = audit.recommendations;
      throw error;
    }

    return {
      ...cycleContext,
      security: {
        validated: true,
        audit,
        timestamp: new Date().toISOString(),
      },
    };
  }
}

/**
 * Integration example for magnus-13-2-complete-cycle.js:
 *
 * async runCycle(intention) {
 *   // Phase 1: Intention
 *   const phase1 = await this.runIntentionPhase(intention);
 *
 *   // Phase 2: Contemplation
 *   const phase2 = await this.runContemplationPhase(phase1);
 *
 *   // 🔒 NEW: Security Validation (Phase 2.5)
 *   const validated = SecuritySafeguards.validateCycle({
 *     intention,
 *     contemplation: phase2
 *   });
 *
 *   // Phase 3: Revelation (continues with validated context)
 *   const phase3 = await this.runRevelationPhase(validated);
 *   // ... rest of cycle
 * }
 */

export default SecuritySafeguards;
