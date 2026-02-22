/**
 * Multi-Modal Integration for Infinity-13.2 System
 *
 * Extends the integrated system to support multi-modal code generation
 * across web, mobile, and data applications.
 */

import WebGenerator from '../generators/web-generator.js';
import MobileGenerator from '../generators/mobile-generator.js';
import DataGenerator from '../generators/data-generator.js';

class MultiModalIntegration {
  constructor(infinitySystem, magnus13System) {
    this.infinity = infinitySystem;
    this.magnus13 = magnus13System;
    this.generators = {
      web: new WebGenerator(),
      mobile: new MobileGenerator(),
      data: new DataGenerator()
    };
    this.modalityDetector = new ModalityDetector();
    this.initialized = false;
  }

  /**
   * Initialize the multi-modal integration
   */
  async initialize() {
    if (this.initialized) return;

    console.log('🔧 Initializing Multi-Modal Integration...');

    // Initialize generators
    for (const [modality, generator] of Object.entries(this.generators)) {
      console.log(`  📦 Initializing ${modality} generator...`);
      // Generators are initialized on demand
    }

    // Extend Infinity's observation phase
    this.extendInfinityObservations();

    // Extend Magnus 13.2's generation phase
    this.extendMagnus13Generation();

    // Add multi-modal safeguards
    this.addMultiModalSafeguards();

    this.initialized = true;
    console.log('✅ Multi-Modal Integration initialized');
  }

  /**
   * Extend Infinity's observation phase for modality detection
   */
  extendInfinityObservations() {
    const originalObserve = this.infinity.observe.bind(this.infinity);

    this.infinity.observe = async () => {
      const observations = await originalObserve();

      // Add modality detection
      observations.modality = await this.detectModality(observations);

      console.log(`🔍 Detected modality: ${observations.modality.type} (${Math.round(observations.modality.confidence * 100)}% confidence)`);

      return observations;
    };
  }

  /**
   * Extend Magnus 13.2's generation for multi-modal support
   */
  extendMagnus13Generation() {
    const originalGenerate = this.magnus13.startGeneration.bind(this.magnus13);

    this.magnus13.startGeneration = async (request) => {
      // Check if this is a multi-modal request
      const modality = await this.detectModalityFromRequest(request);

      if (modality.type !== 'unknown') {
        console.log(`🎯 Multi-modal generation detected: ${modality.type}`);

        // Generate using appropriate modality generator
        const generation = await this.generateMultiModal(request, modality);

        // Still run through Magnus 13.2 for convergence validation
        const convergenceValidated = await this.magnus13.validateConvergence(
          request.sessionId || 'multi-modal-session',
          generation.code || generation,
          null // developer feedback
        );

        return {
          ...generation,
          convergence: convergenceValidated,
          modality: modality.type
        };
      }

      // Fall back to original Magnus 13.2 generation
      return originalGenerate(request);
    };
  }

  /**
   * Detect modality from observations
   */
  async detectModality(observations) {
    const request = observations.feedback?.userFeedback ||
                   observations.opportunities?.patterns ||
                   '';

    return this.modalityDetector.detect(request);
  }

  /**
   * Detect modality from generation request
   */
  async detectModalityFromRequest(request) {
    const text = request.request || request.query || request.description || '';
    return this.modalityDetector.detect(text);
  }

  /**
   * Generate using appropriate modality generator
   */
  async generateMultiModal(request, modality) {
    const generator = this.generators[modality.type];

    if (!generator) {
      throw new Error(`No generator available for modality: ${modality.type}`);
    }

    console.log(`🏗️  Generating ${modality.type} application...`);

    // Convert request to specification format
    const specification = this.convertRequestToSpecification(request, modality);

    // Generate the application
    const result = await generator.generate(specification);

    console.log(`✅ ${modality.type} application generated successfully`);

    return {
      code: result,
      modality: modality.type,
      specification,
      timestamp: Date.now()
    };
  }

  /**
   * Convert Infinity request to generator specification
   */
  convertRequestToSpecification(request, modality) {
    const baseSpec = {
      name: request.name || this.extractNameFromRequest(request),
      description: request.request || request.query,
      features: this.extractFeaturesFromRequest(request, modality),
      modality: modality.type
    };

    // Add modality-specific fields
    switch (modality.type) {
      case 'web':
        return {
          ...baseSpec,
          includeBackend: request.includeBackend || false,
          framework: request.framework || 'react',
          backend: request.backend || 'nodejs',
          database: request.database || 'mongodb'
        };

      case 'mobile':
        return {
          ...baseSpec,
          platforms: request.platforms || ['ios', 'android'],
          framework: request.framework || 'react-native',
          features: request.features || ['navigation', 'api']
        };

      case 'data':
        return {
          ...baseSpec,
          processor: request.processor || 'pandas',
          orchestrator: request.orchestrator || 'airflow',
          storage: request.storage || 'postgres',
          steps: request.steps || ['extract', 'transform', 'load']
        };

      default:
        return baseSpec;
    }
  }

  /**
   * Extract project name from request
   */
  extractNameFromRequest(request) {
    const text = request.request || request.query || '';
    const words = text.toLowerCase().split(/\s+/);

    // Look for common patterns
    const namePatterns = [
      /(?:create|build|make|develop)\s+(?:a|an)?\s*(\w+)/i,
      /(?:app|application|project)\s+(?:called|named)\s+(\w+)/i,
      /(?:called|named)\s+(\w+)/i
    ];

    for (const pattern of namePatterns) {
      const match = text.match(pattern);
      if (match && match[1]) {
        return match[1].toLowerCase().replace(/[^a-z0-9]/g, '-');
      }
    }

    return 'generated-app';
  }

  /**
   * Extract features from request
   */
  extractFeaturesFromRequest(request, modality) {
    const text = (request.request || request.query || '').toLowerCase();
    const features = [];

    // Modality-specific feature detection
    switch (modality.type) {
      case 'web':
        if (text.includes('authentication') || text.includes('login')) features.push('authentication');
        if (text.includes('ui') || text.includes('components')) features.push('ui-components');
        if (text.includes('state') || text.includes('redux')) features.push('state-management');
        if (text.includes('api') || text.includes('backend')) features.push('api-client');
        break;

      case 'mobile':
        if (text.includes('camera')) features.push('camera');
        if (text.includes('location') || text.includes('gps')) features.push('gps');
        if (text.includes('notification')) features.push('notifications');
        if (text.includes('storage')) features.push('storage');
        if (text.includes('network') || text.includes('api')) features.push('networking');
        break;

      case 'data':
        if (text.includes('etl') || text.includes('pipeline')) features.push('etl');
        if (text.includes('analytics') || text.includes('report')) features.push('analytics');
        if (text.includes('real-time') || text.includes('streaming')) features.push('streaming');
        break;
    }

    return features;
  }

  /**
   * Add multi-modal safeguards
   */
  addMultiModalSafeguards() {
    // Extend existing safeguards with modality-specific checks
    const originalValidate = this.infinity.safeguardSystem.validate.bind(this.infinity.safeguardSystem);

    this.infinity.safeguardSystem.validate = async (decisions) => {
      const baseValidation = await originalValidate(decisions);

      // Add modality-specific validation
      const modalityValidation = await this.validateModalitySpecific(decisions);

      return {
        ...baseValidation,
        modalityValidation,
        passed: baseValidation.passed && modalityValidation.passed
      };
    };
  }

  /**
   * Validate modality-specific requirements
   */
  async validateModalitySpecific(decisions) {
    const validation = {
      passed: true,
      checks: []
    };

    for (const decision of decisions.approved || []) {
      if (decision.modality) {
        const modalityCheck = await this.validateModalityRequirements(decision);
        validation.checks.push(modalityCheck);

        if (!modalityCheck.passed) {
          validation.passed = false;
        }
      }
    }

    return validation;
  }

  /**
   * Validate specific modality requirements
   */
  async validateModalityRequirements(decision) {
    const modality = decision.modality;

    switch (modality) {
      case 'web':
        return this.validateWebRequirements(decision);
      case 'mobile':
        return this.validateMobileRequirements(decision);
      case 'data':
        return this.validateDataRequirements(decision);
      default:
        return { passed: true, modality, reason: 'No specific validation required' };
    }
  }

  /**
   * Validate web application requirements
   */
  validateWebRequirements(decision) {
    // Check for required web app components
    const hasFrontend = decision.specification?.framework;
    const hasProperStructure = decision.specification?.name;

    if (!hasFrontend) {
      return {
        passed: false,
        modality: 'web',
        reason: 'Web application requires frontend framework specification'
      };
    }

    if (!hasProperStructure) {
      return {
        passed: false,
        modality: 'web',
        reason: 'Web application requires proper project structure'
      };
    }

    return {
      passed: true,
      modality: 'web',
      reason: 'Web application requirements satisfied'
    };
  }

  /**
   * Validate mobile application requirements
   */
  validateMobileRequirements(decision) {
    const platforms = decision.specification?.platforms || [];

    if (platforms.length === 0) {
      return {
        passed: false,
        modality: 'mobile',
        reason: 'Mobile application requires at least one target platform'
      };
    }

    const validPlatforms = ['ios', 'android', 'web'];
    const invalidPlatforms = platforms.filter(p => !validPlatforms.includes(p));

    if (invalidPlatforms.length > 0) {
      return {
        passed: false,
        modality: 'mobile',
        reason: `Invalid platforms specified: ${invalidPlatforms.join(', ')}`
      };
    }

    return {
      passed: true,
      modality: 'mobile',
      reason: 'Mobile application requirements satisfied'
    };
  }

  /**
   * Validate data pipeline requirements
   */
  validateDataRequirements(decision) {
    const steps = decision.specification?.steps || [];

    if (steps.length === 0) {
      return {
        passed: false,
        modality: 'data',
        reason: 'Data pipeline requires at least one processing step'
      };
    }

    const validSteps = ['extract', 'transform', 'load', 'validate'];
    const invalidSteps = steps.filter(s => !validSteps.includes(s));

    if (invalidSteps.length > 0) {
      return {
        passed: false,
        modality: 'data',
        reason: `Invalid processing steps: ${invalidSteps.join(', ')}`
      };
    }

    return {
      passed: true,
      modality: 'data',
      reason: 'Data pipeline requirements satisfied'
    };
  }

  /**
   * Get integration status
   */
  getStatus() {
    return {
      initialized: this.initialized,
      generators: Object.keys(this.generators),
      modalityDetector: this.modalityDetector.getStatus(),
      infinityConnected: !!this.infinity,
      magnus13Connected: !!this.magnus13
    };
  }

  /**
   * Shutdown the integration
   */
  async shutdown() {
    console.log('🛑 Shutting down Multi-Modal Integration...');

    // Shutdown generators if they have shutdown methods
    for (const generator of Object.values(this.generators)) {
      if (generator.shutdown) {
        await generator.shutdown();
      }
    }

    this.initialized = false;
    console.log('✅ Multi-Modal Integration shutdown complete');
  }
}

/**
 * Modality Detection Engine
 */
class ModalityDetector {
  constructor() {
    this.patterns = {
      web: [
        /\b(website|web app|frontend|backend|full.?stack|react|vue|angular|html|css|javascript)\b/i,
        /\b(browser|client.?side|server.?side|api|rest|graphql)\b/i,
        /\b(ui|ux|interface|dashboard|spa|mpa)\b/i
      ],
      mobile: [
        /\b(mobile|ios|android|app|react.?native|flutter|swift|kotlin|expo)\b/i,
        /\b(phone|tablet|native|hybrid|cross.?platform)\b/i,
        /\b(camera|gps|notification|touch|gesture|sensor)\b/i
      ],
      data: [
        /\b(data|etl|pipeline|analytics|database|sql|spark|pandas|airflow)\b/i,
        /\b(process|transform|extract|load|warehouse|lake|streaming)\b/i,
        /\b(csv|json|parquet|database|query|report|dashboard)\b/i
      ]
    };
  }

  /**
   * Detect modality from text
   */
  async detect(text) {
    const scores = {
      web: 0,
      mobile: 0,
      data: 0
    };

    // Count pattern matches for each modality
    for (const [modality, patterns] of Object.entries(this.patterns)) {
      for (const pattern of patterns) {
        const matches = (text.match(pattern) || []).length;
        scores[modality] += matches;
      }
    }

    // Find the highest scoring modality
    const entries = Object.entries(scores);
    const [detectedModality, score] = entries.reduce((max, current) =>
      current[1] > max[1] ? current : max
    );

    // Calculate confidence
    const totalScore = Object.values(scores).reduce((sum, s) => sum + s, 0);
    const confidence = totalScore > 0 ? score / totalScore : 0;

    // Apply thresholds
    if (confidence < 0.3 || score === 0) {
      return {
        type: 'unknown',
        confidence: 0,
        scores
      };
    }

    return {
      type: detectedModality,
      confidence,
      scores
    };
  }

  /**
   * Get detector status
   */
  getStatus() {
    return {
      patternsLoaded: Object.keys(this.patterns).length,
      modalities: Object.keys(this.patterns)
    };
  }
}

export default MultiModalIntegration;