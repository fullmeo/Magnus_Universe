/**
 * Multi-Modal Generator Orchestrator
 *
 * Coordinates modality detection with appropriate code generation
 * Tier 1 Phase 1B: Generator Framework Integration
 */

import { ModalityDetector } from './modality-detector.js';
import { WebGenerator } from './generators/web-generator.js';
import { MobileGenerator } from './generators/mobile-generator.js';
import { DataGenerator } from './generators/data-generator.js';

class MultiModalGenerator {
  constructor(config = {}) {
    this.config = {
      autoDetect: config.autoDetect !== false,
      defaultModality: config.defaultModality || 'web',
      minConfidence: config.minConfidence || 0.6,
      verbose: config.verbose || false
    };

    // Initialize modality detector
    this.modalityDetector = new ModalityDetector({
      baseDir: config.baseDir || process.cwd(),
      minConfidence: this.config.minConfidence
    });

    // Initialize generators
    this.generators = {
      web: new WebGenerator(),
      mobile: new MobileGenerator(),
      data: new DataGenerator()
    };

    this.lastDetection = null;
  }

  /**
   * Detect project modality
   */
  async detectModality(projectPath = process.cwd()) {
    if (this.config.verbose) {
      console.log('🔍 Detecting project modality...');
    }

    const result = await this.modalityDetector.detectModality(projectPath);
    this.lastDetection = result;

    if (this.config.verbose) {
      console.log(`   Primary: ${result.primary}`);
      console.log(`   Confidence: ${(result.confidence * 100).toFixed(1)}%`);
    }

    return result;
  }

  /**
   * Select appropriate generator based on modality
   */
  selectGenerator(modality) {
    const generator = this.generators[modality];

    if (!generator) {
      throw new Error(`No generator available for modality: ${modality}`);
    }

    return generator;
  }

  /**
   * Generate code with auto-detection
   */
  async generate(specification, options = {}) {
    const startTime = Date.now();

    try {
      // Step 1: Detect modality if auto-detect enabled
      let modality = options.modality;

      if (!modality && this.config.autoDetect) {
        const detection = await this.detectModality(specification.projectPath);
        modality = detection.primary;

        if (detection.confidence < this.config.minConfidence) {
          console.warn(`⚠️  Low confidence (${(detection.confidence * 100).toFixed(1)}%), using default modality: ${this.config.defaultModality}`);
          modality = this.config.defaultModality;
        }
      } else if (!modality) {
        modality = this.config.defaultModality;
      }

      if (this.config.verbose) {
        console.log(`\n🎨 Using modality: ${modality}`);
      }

      // Step 2: Select generator
      const generator = this.selectGenerator(modality);

      // Step 3: Generate code
      if (this.config.verbose) {
        console.log('⚙️  Generating code...');
      }

      const result = await generator.generate(specification);

      // Step 4: Return result with metadata
      const generationTime = Date.now() - startTime;

      return {
        success: true,
        modality: modality,
        generator: generator.constructor.name,
        result: result,
        metadata: {
          detection: this.lastDetection,
          generationTime: generationTime,
          timestamp: Date.now()
        }
      };

    } catch (error) {
      console.error('❌ Generation failed:', error);

      return {
        success: false,
        error: error.message,
        modality: options.modality || 'unknown',
        metadata: {
          generationTime: Date.now() - startTime,
          timestamp: Date.now()
        }
      };
    }
  }

  /**
   * Generate with explicit modality (no auto-detection)
   */
  async generateForModality(modality, specification) {
    return this.generate(specification, { modality });
  }

  /**
   * Get available generators
   */
  getAvailableGenerators() {
    return Object.keys(this.generators);
  }

  /**
   * Get generator capabilities
   */
  getGeneratorCapabilities(modality) {
    const generator = this.generators[modality];

    if (!generator) {
      return null;
    }

    return {
      modality: modality,
      frameworks: generator.getSupportedFrameworks?.() || [],
      features: generator.getSupportedFeatures?.() || [],
      templates: generator.getAvailableTemplates?.() || []
    };
  }

  /**
   * Validate specification for modality
   */
  async validateSpecification(specification, modality) {
    const generator = this.generators[modality];

    if (!generator) {
      return {
        valid: false,
        errors: [`No generator for modality: ${modality}`]
      };
    }

    if (typeof generator.validate === 'function') {
      return await generator.validate(specification);
    }

    // Basic validation
    const errors = [];

    if (!specification.name) {
      errors.push('Specification must include project name');
    }

    return {
      valid: errors.length === 0,
      errors: errors
    };
  }

  /**
   * Get last detection result
   */
  getLastDetection() {
    return this.lastDetection;
  }
}

export { MultiModalGenerator };
export default MultiModalGenerator;
