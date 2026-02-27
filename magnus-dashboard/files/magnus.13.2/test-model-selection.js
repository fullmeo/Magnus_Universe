import ModelSelectionEngine from './model-selection-engine.js';

// Create an instance of ModelSelectionEngine
const engine = new ModelSelectionEngine();

// Test 1: Default models (no analysis provided)
console.log('Test 1: Default models');
const defaultModels = engine.selectOptimalModel();
console.log(defaultModels);

// Test 2: Architectural task
console.log('\nTest 2: Architectural task');
const architecturalModels = engine.selectOptimalModel({ taskType: 'architectural' });
console.log(architecturalModels);

// Test 3: Rapid task
console.log('\nTest 3: Rapid task');
const rapidModels = engine.selectOptimalModel({ taskType: 'rapid' });
console.log(rapidModels);

// Test 4: Resilience task
console.log('\nTest 4: Resilience task');
const resilienceModels = engine.selectOptimalModel({ taskType: 'resilience' });
console.log(resilienceModels);

// Test 5: Unknown task type
console.log('\nTest 5: Unknown task type');
const unknownModels = engine.selectOptimalModel({ taskType: 'unknown' });
console.log(unknownModels);