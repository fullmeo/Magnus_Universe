/**
 * RequirementsClarifier - Ambiguity Detection & Question Generation
 * 
 * Magnus 13's understanding engine - detects what's unclear and asks the right questions
 * 
 * Categories of Ambiguity:
 * - Critical: Blocks generation (auth method, data storage, API contracts)
 * - Important: Affects architecture (scale, performance, security)
 * - Minor: Affects implementation details (styling, naming, format)
 */

class RequirementsClarifier {
  constructor() {
    this.ambiguityPatterns = this.buildAmbiguityPatterns();
  }

  /**
   * Detect ambiguities in requirements
   */
  detectAmbiguities(description) {
    const ambiguities = {
      critical: [],
      important: [],
      minor: []
    };

    // Check each ambiguity pattern
    Object.entries(this.ambiguityPatterns).forEach(([category, patterns]) => {
      patterns.forEach(pattern => {
        const detected = this.checkPattern(description, pattern);
        if (detected.ambiguous) {
          ambiguities[pattern.severity].push({
            category,
            type: pattern.type,
            severity: pattern.severity,
            detected: detected.evidence,
            reason: pattern.reason,
            impact: pattern.impact
          });
        }
      });
    });

    return ambiguities;
  }

  /**
   * Check if a pattern indicates ambiguity
   */
  checkPattern(description, pattern) {
    const hasIndicator = pattern.indicators.some(ind => ind.test(description));
    const hasClarifier = pattern.clarifiers.some(clar => clar.test(description));
    
    // Ambiguous if indicator present but clarifier missing
    if (hasIndicator && !hasClarifier) {
      return {
        ambiguous: true,
        evidence: pattern.indicators.filter(ind => ind.test(description))
          .map(ind => {
            const match = description.match(ind);
            return match ? match[0] : 'detected';
          })
      };
    }
    
    return { ambiguous: false };
  }

  /**
   * Generate clarifying questions based on detected ambiguities
   */
  generateQuestions(ambiguities) {
    const questions = [];
    
    // Critical ambiguities first
    ambiguities.critical.forEach(amb => {
      const question = this.generateQuestionForAmbiguity(amb);
      if (question) {
        questions.push({
          priority: 'CRITICAL',
          category: amb.category,
          question: question.text,
          options: question.options,
          impact: amb.impact,
          defaultSuggestion: question.default
        });
      }
    });
    
    // Important ambiguities
    ambiguities.important.forEach(amb => {
      const question = this.generateQuestionForAmbiguity(amb);
      if (question) {
        questions.push({
          priority: 'IMPORTANT',
          category: amb.category,
          question: question.text,
          options: question.options,
          impact: amb.impact,
          defaultSuggestion: question.default
        });
      }
    });
    
    // Limit minor questions to avoid overwhelming
    ambiguities.minor.slice(0, 3).forEach(amb => {
      const question = this.generateQuestionForAmbiguity(amb);
      if (question) {
        questions.push({
          priority: 'MINOR',
          category: amb.category,
          question: question.text,
          options: question.options,
          impact: amb.impact,
          defaultSuggestion: question.default
        });
      }
    });
    
    return questions;
  }

  /**
   * Generate specific question for an ambiguity
   */
  generateQuestionForAmbiguity(ambiguity) {
    const questionTemplates = {
      authentication: {
        text: 'How should users authenticate?',
        options: [
          'JWT tokens with email/password',
          'OAuth2 (Google, GitHub, etc.)',
          'API keys',
          'No authentication (public access)',
          'Session cookies'
        ],
        default: 'JWT tokens with email/password'
      },
      data_storage: {
        text: 'Where should data be stored?',
        options: [
          'Browser localStorage/IndexedDB',
          'Backend database (specify: PostgreSQL, MongoDB, etc.)',
          'In-memory only (session-based)',
          'File system',
          'Third-party service (specify)'
        ],
        default: 'Browser localStorage for client-only, database for server'
      },
      api_contracts: {
        text: 'What API format should be used?',
        options: [
          'REST with JSON',
          'GraphQL',
          'WebSocket for real-time',
          'gRPC',
          'Custom protocol'
        ],
        default: 'REST with JSON'
      },
      scale: {
        text: 'What scale should the system support?',
        options: [
          'Single user / small team (<10 users)',
          'Medium scale (10-1000 users)',
          'Large scale (1000-100k users)',
          'Massive scale (100k+ users)',
          'Not sure / prototype first'
        ],
        default: 'Medium scale'
      },
      performance: {
        text: 'What are the performance requirements?',
        options: [
          'No specific requirements',
          'Responsive (<100ms for UI interactions)',
          'Fast (<1s for operations)',
          'Real-time (<50ms critical path)',
          'Batch processing acceptable'
        ],
        default: 'Responsive for good UX'
      },
      security_level: {
        text: 'What security level is required?',
        options: [
          'Basic (standard web security)',
          'Elevated (handling sensitive data)',
          'High (financial, health data)',
          'Critical (regulatory compliance required)',
          'Public demo (minimal security)'
        ],
        default: 'Basic'
      },
      error_handling: {
        text: 'How should errors be handled?',
        options: [
          'Log errors and show user-friendly messages',
          'Detailed error reporting for debugging',
          'Silent failures with fallbacks',
          'Crash fast and loud',
          'Retry logic with exponential backoff'
        ],
        default: 'Log errors and show user-friendly messages'
      },
      testing: {
        text: 'What testing is needed?',
        options: [
          'No tests (prototype/demo)',
          'Basic unit tests for core logic',
          'Comprehensive tests (unit + integration)',
          'E2E tests included',
          'Just show test structure, I\'ll fill in'
        ],
        default: 'Basic unit tests for core logic'
      },
      styling: {
        text: 'What styling approach?',
        options: [
          'Unstyled / minimal CSS',
          'Tailwind CSS',
          'CSS modules',
          'Styled-components / emotion',
          'Bootstrap / Material UI'
        ],
        default: 'Tailwind CSS'
      },
      state_management: {
        text: 'How should state be managed?',
        options: [
          'Local component state (useState)',
          'Context API',
          'Redux / Redux Toolkit',
          'Zustand / Jotai',
          'React Query / SWR for server state'
        ],
        default: 'Local state for simple, Context/Zustand for complex'
      },
      deployment: {
        text: 'Where will this be deployed?',
        options: [
          'Not sure yet / local development only',
          'Vercel / Netlify (frontend)',
          'Node.js server (specify hosting)',
          'Serverless (AWS Lambda, etc.)',
          'Docker containers'
        ],
        default: 'Vercel for frontend, Node.js for backend'
      },
      browser_support: {
        text: 'What browser support is needed?',
        options: [
          'Modern browsers only (evergreen)',
          'Include Safari mobile',
          'IE11 support (legacy)',
          'Chrome only',
          'Not applicable (Node.js backend)'
        ],
        default: 'Modern browsers + Safari mobile'
      }
    };

    return questionTemplates[ambiguity.type] || null;
  }

  /**
   * Extract structured requirements from description
   */
  extractStructuredRequirements(description) {
    const structured = {
      original: description,
      features: this.extractFeatures(description),
      constraints: this.extractConstraints(description),
      technical: this.extractTechnical(description),
      nonfunctional: this.extractNonFunctional(description)
    };

    return structured;
  }

  /**
   * Extract features from description
   */
  extractFeatures(description) {
    const features = [];
    
    // Look for action verbs + objects
    const actionPatterns = [
      /users? (?:can|should|must|need to) ([^.,;]+)/gi,
      /(?:allow|enable|support|implement) ([^.,;]+)/gi,
      /feature[s]?:? ([^.,;]+)/gi,
      /\d+\.\s*([^.,;\n]+)/g // Numbered lists
    ];

    actionPatterns.forEach(pattern => {
      let match;
      while ((match = pattern.exec(description)) !== null) {
        features.push(match[1].trim());
      }
    });

    return features.length > 0 ? features : ['General application functionality'];
  }

  /**
   * Extract constraints from description
   */
  extractConstraints(description) {
    const constraints = [];
    
    const constraintPatterns = {
      'No backend': /no backend|frontend[- ]only|client[- ]side only/gi,
      'No frameworks': /no framework|vanilla|plain javascript/gi,
      'Mobile-first': /mobile[- ]first|responsive/gi,
      'Offline-capable': /offline|pwa|service worker/gi,
      'Real-time': /real[- ]time|live|instant/gi,
      'SEO required': /seo|search engine/gi,
      'Accessibility': /accessibility|a11y|wcag/gi,
      'TypeScript': /typescript|type[- ]safe/gi
    };

    Object.entries(constraintPatterns).forEach(([name, pattern]) => {
      if (pattern.test(description)) {
        constraints.push(name);
      }
    });

    return constraints;
  }

  /**
   * Extract technical requirements
   */
  extractTechnical(description) {
    const technical = {
      languages: [],
      frameworks: [],
      libraries: [],
      tools: []
    };

    // Languages
    const languages = ['JavaScript', 'TypeScript', 'Python', 'Ruby', 'Go', 'Java', 'C#', 'PHP'];
    languages.forEach(lang => {
      if (new RegExp(lang, 'i').test(description)) {
        technical.languages.push(lang);
      }
    });

    // Frameworks
    const frameworks = ['React', 'Vue', 'Angular', 'Svelte', 'Next.js', 'Express', 'FastAPI', 'Django'];
    frameworks.forEach(fw => {
      if (new RegExp(fw, 'i').test(description)) {
        technical.frameworks.push(fw);
      }
    });

    // Libraries
    const libraries = ['TailwindCSS', 'Redux', 'Zustand', 'React Query', 'Axios', 'Socket.io'];
    libraries.forEach(lib => {
      if (new RegExp(lib, 'i').test(description)) {
        technical.libraries.push(lib);
      }
    });

    return technical;
  }

  /**
   * Extract non-functional requirements
   */
  extractNonFunctional(description) {
    const nonfunctional = {
      performance: this.detectPerformanceReqs(description),
      security: this.detectSecurityReqs(description),
      scalability: this.detectScalabilityReqs(description),
      usability: this.detectUsabilityReqs(description),
      maintainability: this.detectMaintainabilityReqs(description)
    };

    return nonfunctional;
  }

  detectPerformanceReqs(description) {
    if (/fast|quick|instant|real[- ]time|performan/gi.test(description)) {
      return { required: true, level: 'high' };
    }
    if (/responsiv|smooth/gi.test(description)) {
      return { required: true, level: 'medium' };
    }
    return { required: false, level: 'standard' };
  }

  detectSecurityReqs(description) {
    if (/security|secure|encrypt|authentication|authorization/gi.test(description)) {
      return { required: true, level: 'elevated' };
    }
    return { required: false, level: 'basic' };
  }

  detectScalabilityReqs(description) {
    if (/scale|million|billion|distributed/gi.test(description)) {
      return { required: true, level: 'high' };
    }
    if (/grow|expand/gi.test(description)) {
      return { required: true, level: 'medium' };
    }
    return { required: false, level: 'standard' };
  }

  detectUsabilityReqs(description) {
    if (/ux|user experience|intuitive|easy to use/gi.test(description)) {
      return { required: true, level: 'high' };
    }
    if (/user[- ]friendly|simple/gi.test(description)) {
      return { required: true, level: 'medium' };
    }
    return { required: false, level: 'standard' };
  }

  detectMaintainabilityReqs(description) {
    if (/maintain|clean code|documented|extensible/gi.test(description)) {
      return { required: true, level: 'high' };
    }
    return { required: false, level: 'standard' };
  }

  /**
   * Build ambiguity patterns
   */
  buildAmbiguityPatterns() {
    return {
      authentication: [
        {
          type: 'authentication',
          severity: 'critical',
          indicators: [/auth|login|user|sign[- ]in|sign[- ]up|register/gi],
          clarifiers: [/jwt|oauth|api key|session|cookie|no auth|public/gi],
          reason: 'Authentication method unspecified',
          impact: 'Blocks implementation of user-related features'
        }
      ],
      data_storage: [
        {
          type: 'data_storage',
          severity: 'critical',
          indicators: [/store|save|persist|data|database/gi],
          clarifiers: [/localstorage|indexeddb|postgres|mongo|mysql|redis|s3|file system|in[- ]memory/gi],
          reason: 'Data storage location unspecified',
          impact: 'Determines architecture and data flow'
        }
      ],
      api_contracts: [
        {
          type: 'api_contracts',
          severity: 'critical',
          indicators: [/api|endpoint|service|backend/gi],
          clarifiers: [/rest|graphql|grpc|websocket|json|xml/gi],
          reason: 'API contract format unspecified',
          impact: 'Affects client-server communication design'
        }
      ],
      scale: [
        {
          type: 'scale',
          severity: 'important',
          indicators: [/users|scale|traffic|load/gi],
          clarifiers: [/\d+\s*users|single user|small team|enterprise|million|thousand/gi],
          reason: 'Expected scale unspecified',
          impact: 'Influences architecture, caching, and optimization decisions'
        }
      ],
      performance: [
        {
          type: 'performance',
          severity: 'important',
          indicators: [/fast|quick|performance|speed|latency/gi],
          clarifiers: [/\d+\s*ms|second|minute|real[- ]time|batch/gi],
          reason: 'Performance requirements unspecified',
          impact: 'Affects optimization priorities and architecture'
        }
      ],
      security_level: [
        {
          type: 'security_level',
          severity: 'important',
          indicators: [/secure|security|private|sensitive|confidential/gi],
          clarifiers: [/basic|standard|elevated|high|critical|compliance|hipaa|gdpr/gi],
          reason: 'Security level unspecified',
          impact: 'Determines security measures and audit requirements'
        }
      ],
      error_handling: [
        {
          type: 'error_handling',
          severity: 'important',
          indicators: [/error|fail|exception|crash/gi],
          clarifiers: [/retry|fallback|graceful|log|alert|silent/gi],
          reason: 'Error handling strategy unspecified',
          impact: 'Affects reliability and user experience'
        }
      ],
      testing: [
        {
          type: 'testing',
          severity: 'minor',
          indicators: [/test|quality|coverage/gi],
          clarifiers: [/unit|integration|e2e|jest|vitest|no test|skip test/gi],
          reason: 'Testing requirements unspecified',
          impact: 'Determines test infrastructure to generate'
        }
      ],
      styling: [
        {
          type: 'styling',
          severity: 'minor',
          indicators: [/style|css|design|ui|look/gi],
          clarifiers: [/tailwind|styled[- ]components|css modules|sass|bootstrap|material/gi],
          reason: 'Styling approach unspecified',
          impact: 'Affects CSS architecture and tooling'
        }
      ],
      state_management: [
        {
          type: 'state_management',
          severity: 'important',
          indicators: [/state|data flow|manage data/gi],
          clarifiers: [/redux|zustand|context|mobx|recoil|local state/gi],
          reason: 'State management approach unspecified',
          impact: 'Determines data architecture'
        }
      ],
      deployment: [
        {
          type: 'deployment',
          severity: 'minor',
          indicators: [/deploy|host|production|live/gi],
          clarifiers: [/vercel|netlify|aws|docker|kubernetes|heroku/gi],
          reason: 'Deployment target unspecified',
          impact: 'Affects build configuration and environment setup'
        }
      ],
      browser_support: [
        {
          type: 'browser_support',
          severity: 'minor',
          indicators: [/browser|safari|chrome|firefox|ie/gi],
          clarifiers: [/modern|evergreen|ie11|legacy|mobile/gi],
          reason: 'Browser support requirements unspecified',
          impact: 'Determines polyfills and transpilation needs'
        }
      ]
    };
  }
}

export default RequirementsClarifier;
