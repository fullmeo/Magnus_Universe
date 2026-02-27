import Magnus14Simple from './magnus-14-simple.js';

async function test() {
  console.log('🔍 Testing Magnus 14 Simple Scanner...\n');

  const scanner = new Magnus14Simple({ verbose: true });
  console.log('✅ Scanner created\n');

  const results = await scanner.scan('.');
  console.log('\n📊 Scan Results:');
  console.log(`  Patterns: ${results.patterns.length}`);
  console.log(`  Friction: ${results.friction.length}`);
  console.log(`  Confidence: ${results.confidence}`);

  if (results.patterns.length > 0) {
    console.log('\n📝 Sample Patterns:');
    results.patterns.slice(0, 5).forEach(p => {
      console.log(`  - ${p.type} (${p.confidence}) in ${p.file.split('/').pop()}`);
    });
  }
}

test().catch(console.error);
