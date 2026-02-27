/**
 * Multi-Modal Generation Test Suite
 *
 * Tests the integrated multi-modal code generation system
 * across web, mobile, and data modalities.
 */

import MultiModalIntegration from '../src/multi-modal-integration.js';
import WebGenerator from '../generators/web-generator.js';
import MobileGenerator from '../generators/mobile-generator.js';
import DataGenerator from '../generators/data-generator.js';

class MultiModalTestSuite {
  constructor() {
    this.results = {
      total: 0,
      passed: 0,
      failed: 0,
      tests: []
    };
  }

  /**
   * Run all multi-modal tests
   */
  async runAllTests() {
    console.log('🧪 Starting Multi-Modal Generation Test Suite\n');

    // Test individual generators
    await this.testWebGenerator();
    await this.testMobileGenerator();
    await this.testDataGenerator();

    // Test modality detection
    await this.testModalityDetection();

    // Test integrated generation
    await this.testIntegratedGeneration();

    // Test safeguards
    await this.testMultiModalSafeguards();

    this.printSummary();
  }

  /**
   * Test web application generator
   */
  async testWebGenerator() {
    console.log('🌐 Testing Web Application Generator...');

    const generator = new WebGenerator({
      framework: 'react',
      backend: 'nodejs',
      database: 'mongodb'
    });

    const specification = {
      name: 'test-web-app',
      features: ['authentication', 'ui-components', 'api-client'],
      includeBackend: true
    };

    try {
      const result = await generator.generate(specification);

      this.assert(result.name === 'test-web-app', 'Web app name should match');
      this.assert(result.frontend, 'Frontend should be generated');
      this.assert(result.backend, 'Backend should be generated when requested');
      this.assert(result.database, 'Database config should be generated');
      this.assert(result.deployment, 'Deployment config should be generated');

      console.log('✅ Web Application Generator tests passed\n');
    } catch (error) {
      this.fail('Web Application Generator', error);
    }
  }

  /**
   * Test mobile application generator
   */
  async testMobileGenerator() {
    console.log('📱 Testing Mobile Application Generator...');

    const generator = new MobileGenerator({
      framework: 'react-native',
      platforms: ['ios', 'android']
    });

    const specification = {
      name: 'test-mobile-app',
      features: ['camera', 'gps', 'notifications'],
      platforms: ['ios', 'android']
    };

    try {
      const result = await generator.generate(specification);

      this.assert(result.name === 'test-mobile-app', 'Mobile app name should match');
      this.assert(result.framework === 'react-native', 'Framework should match');
      this.assert(result.platforms.includes('ios'), 'iOS platform should be included');
      this.assert(result.platforms.includes('android'), 'Android platform should be included');
      this.assert(result.screens && result.screens.length > 0, 'Screens should be generated');
      this.assert(result.components && result.components.length > 0, 'Components should be generated');

      console.log('✅ Mobile Application Generator tests passed\n');
    } catch (error) {
      this.fail('Mobile Application Generator', error);
    }
  }

  /**
   * Test data pipeline generator
   */
  async testDataGenerator() {
    console.log('📊 Testing Data Pipeline Generator...');

    const generator = new DataGenerator({
      processor: 'pandas',
      orchestrator: 'airflow',
      storage: 'postgres'
    });

    const specification = {
      name: 'test-data-pipeline',
      steps: ['extract', 'transform', 'load'],
      source: { type: 'file', path: 'data/input.csv' },
      destination: { type: 'database', table: 'processed_data' }
    };

    try {
      const result = await generator.generate(specification);

      this.assert(result.name === 'test-data-pipeline', 'Data pipeline name should match');
      this.assert(result.processorCode, 'Processor code should be generated');
      this.assert(result.orchestratorCode, 'Orchestrator code should be generated');
      this.assert(result.storageConfig, 'Storage config should be generated');
      this.assert(result.documentation, 'Documentation should be generated');

      console.log('✅ Data Pipeline Generator tests passed\n');
    } catch (error) {
      this.fail('Data Pipeline Generator', error);
    }
  }

  /**
   * Test modality detection
   */
  async testModalityDetection() {
    console.log('🔍 Testing Modality Detection...');

    const { ModalityDetector } = await import('../src/multi-modal-integration.js');
    const detector = new ModalityDetector();

    const testCases = [
      {
        text: 'Create a React web application with authentication',
        expected: 'web',
        minConfidence: 0.5
      },
      {
        text: 'Build a mobile app for iOS and Android with camera features',
        expected: 'mobile',
        minConfidence: 0.5
      },
      {
        text: 'Create an ETL pipeline to process CSV data and load to PostgreSQL',
        expected: 'data',
        minConfidence: 0.5
      },
      {
        text: 'Hello world program',
        expected: 'unknown',
        minConfidence: 0
      }
    ];

    for (const testCase of testCases) {
      try {
        const result = await detector.detect(testCase.text);

        if (testCase.expected === 'unknown') {
          this.assert(result.type === 'unknown' || result.confidence < 0.3,
            `Should detect unknown for: "${testCase.text}"`);
        } else {
          this.assert(result.type === testCase.expected,
            `Should detect ${testCase.expected} for: "${testCase.text}"`);
          this.assert(result.confidence >= testCase.minConfidence,
            `Confidence should be >= ${testCase.minConfidence} for: "${testCase.text}"`);
        }
      } catch (error) {
        this.fail(`Modality Detection for "${testCase.text}"`, error);
      }
    }

    console.log('✅ Modality Detection tests passed\n');
  }

  /**
   * Test integrated multi-modal generation
   */
  async testIntegratedGeneration() {
    console.log('🔗 Testing Integrated Multi-Modal Generation...');

    // Mock Infinity and Magnus 13.2 systems for testing
    const mockInfinity = {
      observe: async () => ({
        patterns: { detected: 5 },
        performance: { successRate: 0.9 },
        feedback: { userFeedback: 'Create a web app with React' }
      }),
      safeguardSystem: {
        validate: async () => ({ passed: true })
      }
    };

    const mockMagnus13 = {
      startGeneration: async (request) => ({
        code: 'console.log("Generated code");',
        sessionId: 'test-session'
      }),
      validateConvergence: async () => ({
        convergenceState: 'CONVERGED',
        recognitionScore: 0.95,
        inevitabilityScore: 0.9
      })
    };

    try {
      const integration = new MultiModalIntegration(mockInfinity, mockMagnus13);
      await integration.initialize();

      // Test web app generation
      const webRequest = {
        request: 'Create a React web application with authentication and API integration',
        name: 'test-integrated-web-app'
      };

      const webResult = await integration.generateMultiModal(webRequest,
        { type: 'web', confidence: 0.8 });

      this.assert(webResult.modality === 'web', 'Should generate web application');
      this.assert(webResult.code, 'Should return generated code');
      this.assert(webResult.specification.name === 'test-integrated-web-app',
        'Should use correct specification');

      // Test mobile app generation
      const mobileRequest = {
        request: 'Build a React Native mobile app with camera and GPS',
        name: 'test-integrated-mobile-app'
      };

      const mobileResult = await integration.generateMultiModal(mobileRequest,
        { type: 'mobile', confidence: 0.8 });

      this.assert(mobileResult.modality === 'mobile', 'Should generate mobile application');
      this.assert(mobileResult.code, 'Should return generated code');

      console.log('✅ Integrated Multi-Modal Generation tests passed\n');
    } catch (error) {
      this.fail('Integrated Multi-Modal Generation', error);
    }
  }

  /**
   * Test multi-modal safeguards
   */
  async testMultiModalSafeguards() {
    console.log('🛡️  Testing Multi-Modal Safeguards...');

    const mockInfinity = {
      safeguardSystem: {
        validate: async () => ({ passed: true })
      }
    };

    const mockMagnus13 = {};

    try {
      const integration = new MultiModalIntegration(mockInfinity, mockMagnus13);
      await integration.initialize();

      // Test web app validation
      const webDecision = {
        modality: 'web',
        specification: {
          framework: 'react',
          name: 'test-app'
        }
      };

      const webValidation = await integration.validateModalityRequirements(webDecision);
      this.assert(webValidation.passed, 'Web app should pass validation');

      // Test mobile app validation
      const mobileDecision = {
        modality: 'mobile',
        specification: {
          platforms: ['ios', 'android'],
          framework: 'react-native'
        }
      };

      const mobileValidation = await integration.validateModalityRequirements(mobileDecision);
      this.assert(mobileValidation.passed, 'Mobile app should pass validation');

      // Test data pipeline validation
      const dataDecision = {
        modality: 'data',
        specification: {
          steps: ['extract', 'transform', 'load'],
          processor: 'pandas'
        }
      };

      const dataValidation = await integration.validateModalityRequirements(dataDecision);
      this.assert(dataValidation.passed, 'Data pipeline should pass validation');

      // Test invalid cases
      const invalidWebDecision = {
        modality: 'web',
        specification: {} // Missing required fields
      };

      const invalidValidation = await integration.validateModalityRequirements(invalidWebDecision);
      this.assert(!invalidValidation.passed, 'Invalid web app should fail validation');

      console.log('✅ Multi-Modal Safeguards tests passed\n');
    } catch (error) {
      this.fail('Multi-Modal Safeguards', error);
    }
  }

  /**
   * Assert a condition
   */
  assert(condition, message) {
    this.results.total++;
    if (condition) {
      this.results.passed++;
      console.log(`  ✅ ${message}`);
    } else {
      this.results.failed++;
      console.log(`  ❌ ${message}`);
      throw new Error(`Assertion failed: ${message}`);
    }
  }

  /**
   * Record a test failure
   */
  fail(testName, error) {
    this.results.total++;
    this.results.failed++;
    this.results.tests.push({
      name: testName,
      status: 'failed',
      error: error.message
    });
    console.log(`❌ ${testName} failed: ${error.message}\n`);
  }

  /**
   * Print test summary
   */
  printSummary() {
    console.log('📊 Multi-Modal Generation Test Summary');
    console.log('=' .repeat(50));
    console.log(`Total Tests: ${this.results.total}`);
    console.log(`Passed: ${this.results.passed}`);
    console.log(`Failed: ${this.results.failed}`);
    console.log(`Success Rate: ${Math.round((this.results.passed / this.results.total) * 100)}%`);

    if (this.results.failed > 0) {
      console.log('\n❌ Failed Tests:');
      this.results.tests
        .filter(test => test.status === 'failed')
        .forEach(test => {
          console.log(`  - ${test.name}: ${test.error}`);
        });
    }

    console.log('\n' + '=' .repeat(50));

    if (this.results.failed === 0) {
      console.log('🎉 All Multi-Modal Generation tests passed!');
    } else {
      console.log('⚠️  Some tests failed. Please review and fix issues.');
    }
  }
}

// Run tests if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  const testSuite = new MultiModalTestSuite();
  testSuite.runAllTests().catch(error => {
    console.error('Test suite failed:', error);
    process.exit(1);
  });
}

export default MultiModalTestSuite;