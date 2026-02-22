/**
 * Infinity 1B + Magnus 13.2 Integration Example
 * 
 * Demonstrates the complete workflow:
 * 1. Detect modality (Infinity 1B)
 * 2. Generate code with appropriate template
 * 3. Apply Magnus 13.2 convergence validation
 * 4. Output production-quality code
 */

import { ModalityDetector } from './modality-detector.js';
import { MultiModalGenerator } from './generators/multi-modal-generator.js';

/**
 * Complete integration workflow
 */
class Infinity13Integration {
  constructor(options = {}) {
    this.detector = new ModalityDetector({
      minConfidence: options.minConfidence || 0.70
    });
    
    this.generator = new MultiModalGenerator({
      enable13Integration: options.enable13Integration !== false,
      enableConvergence: options.enableConvergence !== false,
      hermeticMode: options.hermeticMode || 'principled'
    });
    
    this.history = [];
  }
  
  /**
   * Main workflow: Detect → Generate → Validate → Output
   */
  async processProject(projectPath, options = {}) {
    console.log('\n' + '='.repeat(60));
    console.log('INFINITY 1B + MAGNUS 13.2 INTEGRATION');
    console.log('='.repeat(60));
    
    const workflow = {
      timestamp: new Date().toISOString(),
      projectPath,
      steps: [],
      result: null
    };
    
    try {
      // Step 1: Detect modality
      console.log('\n📍 STEP 1: Modality Detection');
      console.log('-'.repeat(40));
      
      const detectStart = Date.now();
      const detection = await this.detector.detectModality(projectPath);
      const detectTime = Date.now() - detectStart;
      
      console.log(`   Primary: ${detection.primary}`);
      console.log(`   Confidence: ${Math.round(detection.confidence * 100)}%`);
      console.log(`   Scores: Web ${Math.round(detection.scores.web * 100)}%, Mobile ${Math.round(detection.scores.mobile * 100)}%, Data ${Math.round(detection.scores.data * 100)}%`);
      console.log(`   Time: ${detectTime}ms`);
      
      workflow.steps.push({
        name: 'modality_detection',
        success: true,
        time: detectTime,
        result: {
          modality: detection.primary,
          confidence: detection.confidence,
          scores: detection.scores
        }
      });
      
      // Step 2: Select framework based on modality
      console.log('\n📐 STEP 2: Framework Selection');
      console.log('-'.repeat(40));
      
      const framework = this.selectFramework(detection, options);
      console.log(`   Selected: ${framework}`);
      
      workflow.steps.push({
        name: 'framework_selection',
        success: true,
        result: { framework }
      });
      
      // Step 3: Generate code
      console.log('\n⚙️  STEP 3: Code Generation');
      console.log('-'.repeat(40));
      
      const generateStart = Date.now();
      const project = await this.generator.generate({
        modality: detection.primary,
        framework,
        specification: options.specification || { name: 'generated-app' },
        outputPath: options.outputPath
      });
      const generateTime = Date.now() - generateStart;
      
      console.log(`   Files: ${Object.keys(project.files).length}`);
      console.log(`   Template: ${project.template}`);
      console.log(`   Time: ${generateTime}ms`);
      
      workflow.steps.push({
        name: 'code_generation',
        success: true,
        time: generateTime,
        result: {
          filesCount: Object.keys(project.files).length,
          template: project.template
        }
      });
      
      // Step 4: Magnus 13.2 Convergence (if enabled)
      if (project.convergence && project.convergence.applied) {
        console.log('\n🎯 STEP 4: Magnus 13.2 Convergence');
        console.log('-'.repeat(40));
        
        console.log(`   Applied: ${project.convergence.applied}`);
        console.log(`   Harmonic: ${Math.round((project.convergence.harmonic || 0) * 100)}%`);
        console.log(`   Converged: ${project.convergence.converged}`);
        
        workflow.steps.push({
          name: 'convergence_validation',
          success: project.convergence.converged,
          result: project.convergence
        });
      }
      
      // Step 5: Hermetic Principles (if enabled)
      if (project.hermeticPrinciples) {
        console.log('\n🔮 STEP 5: Hermetic Principles');
        console.log('-'.repeat(40));
        
        console.log(`   Applied: ${project.hermeticPrinciples.join(', ')}`);
        
        workflow.steps.push({
          name: 'hermetic_principles',
          success: true,
          result: { principles: project.hermeticPrinciples }
        });
      }
      
      // Final result
      workflow.result = {
        success: true,
        modality: detection.primary,
        framework,
        filesCount: Object.keys(project.files).length,
        convergence: project.convergence,
        hermetic: project.hermeticPrinciples
      };
      
      console.log('\n' + '='.repeat(60));
      console.log('✅ WORKFLOW COMPLETE');
      console.log('='.repeat(60));
      console.log(`   Modality: ${detection.primary}`);
      console.log(`   Framework: ${framework}`);
      console.log(`   Files: ${Object.keys(project.files).length}`);
      console.log(`   Total Time: ${workflow.steps.reduce((sum, s) => sum + (s.time || 0), 0)}ms`);
      
      // Store in history
      this.history.push(workflow);
      
      return {
        workflow,
        project,
        detection,
        projectCode: project.files
      };
      
    } catch (error) {
      workflow.steps.push({
        name: 'error',
        success: false,
        error: error.message
      });
      
      console.error('\n❌ Workflow failed:', error.message);
      
      return {
        workflow,
        error: error.message
      };
    }
  }
  
  /**
   * Select best framework based on detection and options
   */
  selectFramework(detection, options) {
    const modality = detection.primary;
    const preferredFramework = options.framework;
    
    if (preferredFramework) {
      return preferredFramework;
    }
    
    // Auto-select based on highest score
    if (modality === 'web') {
      return detection.scores.web > detection.scores.mobile ? 'react' : 'vue';
    } else if (modality === 'mobile') {
      return 'react-native';
    } else if (modality === 'data') {
      return 'fastapi';
    }
    
    // Fallback defaults
    const defaults = { web: 'react', mobile: 'react-native', data: 'fastapi' };
    return defaults[modality] || 'react';
  }
  
  /**
   * Get workflow history
   */
  getHistory() {
    return this.history;
  }
  
  /**
   * Clear workflow history
   */
  clearHistory() {
    this.history = [];
  }
}

/**
 * Example usage
 */
async function runExample() {
  console.log('\n' + '★'.repeat(60));
  console.log('INFINITY 1B + 13.2 INTEGRATION EXAMPLE');
  console.log('★'.repeat(60));
  
  const integration = new Infinity13Integration({
    enable13Integration: true,
    enableConvergence: true,
    hermeticMode: 'principled'
  });
  
  // Process the current project
  const result = await integration.processProject(process.cwd(), {
    specification: {
      name: 'magnus-infinity-project',
      features: ['api-client', 'authentication']
    }
  });
  
  if (result.error) {
    console.log('\n❌ Example failed:', result.error);
  } else {
    console.log('\n📊 Result Summary:');
    console.log(`   Modality: ${result.workflow.result.modality}`);
    console.log(`   Framework: ${result.workflow.result.framework}`);
    console.log(`   Files Generated: ${result.workflow.result.filesCount}`);
    console.log(`   Convergence: ${result.workflow.result.convergence?.converged ? 'YES' : 'NO'}`);
  }
  
  return result;
}

// Run example if executed directly
runExample().catch(console.error);

export { Infinity13Integration };
export default Infinity13Integration;
