/**
 * Magnus Security Safeguards Demo
 *
 * Demonstrates security validation capabilities for XSS prevention
 * and safe code generation practices.
 *
 * Run: node examples/security-safeguards-demo.js
 */

import { SecuritySafeguards } from '../src/magnus-security-safeguards.js';

console.log('🔒 Magnus Security Safeguards Demo\n');
console.log('=' .repeat(60));

// ============================================================================
// Test 1: Safe Intention Validation
// ============================================================================
console.log('\n📋 Test 1: Safe Intention Validation');
console.log('-'.repeat(60));

const safeIntention = {
  componentName: 'UserProfile',
  purpose: 'Display user information',
  data: {
    name: 'John Doe',
    role: 'Developer',
  },
};

const safeValidation = SecuritySafeguards.validateIntention(safeIntention);
console.log('Intention:', JSON.stringify(safeIntention, null, 2));
console.log('\nValidation Result:');
console.log('  ✅ Valid:', safeValidation.valid);
console.log('  📊 Severity:', safeValidation.severity);
console.log('  🔍 Issues:', safeValidation.issues.length > 0 ? safeValidation.issues : 'None');

// ============================================================================
// Test 2: XSS Attack Detection
// ============================================================================
console.log('\n\n📋 Test 2: XSS Attack Detection');
console.log('-'.repeat(60));

const maliciousIntention = {
  componentName: '<script>alert("XSS")</script>',
  purpose: 'Inject malicious code',
  data: {
    title: '</script><script>document.cookie</script>',
  },
};

const maliciousValidation = SecuritySafeguards.validateIntention(maliciousIntention);
console.log('Intention:', JSON.stringify(maliciousIntention, null, 2));
console.log('\nValidation Result:');
console.log('  ❌ Valid:', maliciousValidation.valid);
console.log('  🚨 Severity:', maliciousValidation.severity);
console.log('  🔍 Issues:');
maliciousValidation.issues.forEach((issue, idx) => {
  console.log(`     ${idx + 1}. ${issue}`);
});

// ============================================================================
// Test 3: JSON-LD Sanitization (React Router Vulnerability)
// ============================================================================
console.log('\n\n📋 Test 3: JSON-LD Sanitization (GHSA-3cgp-3xvw-98x8)');
console.log('-'.repeat(60));

const jsonLDData = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'Widget</script><script>alert("XSS")</script>',
  description: 'A normal description',
  author: {
    name: 'Evil<script>steal()</script>User',
  },
};

console.log('Original JSON-LD:');
console.log(JSON.stringify(jsonLDData, null, 2));

const sanitizedJSONLD = SecuritySafeguards.sanitizeJSONLD(jsonLDData);
console.log('\nSanitized JSON-LD:');
console.log(sanitizedJSONLD);

console.log('\n✅ Attack Prevention:');
console.log('  - </script> tags escaped');
console.log('  - JavaScript protocol neutralized');
console.log('  - Safe for SSR meta() functions');

// ============================================================================
// Test 4: HTML Sanitization
// ============================================================================
console.log('\n\n📋 Test 4: HTML Content Sanitization');
console.log('-'.repeat(60));

const dangerousHTML = `
  <div>
    <h1>User Comment</h1>
    <p onclick="alert('XSS')">Click me!</p>
    <script>stealCookies();</script>
    <img src=x onerror="alert('XSS')">
  </div>
`;

console.log('Original HTML:');
console.log(dangerousHTML);

const sanitizedHTML = SecuritySafeguards.sanitizeHTML(dangerousHTML);
console.log('\nSanitized HTML:');
console.log(sanitizedHTML);

console.log('\n✅ Safe for Display:');
console.log('  - All tags encoded as text');
console.log('  - No code execution possible');
console.log('  - Content visible but inert');

// ============================================================================
// Test 5: Output Validation
// ============================================================================
console.log('\n\n📋 Test 5: Generated Code Output Validation');
console.log('-'.repeat(60));

const generatedOutput = {
  template: '<Component data={user.input} />',
  jsonLD: {
    name: 'Safe Product Name',
    price: '$99.99',
  },
  metadata: {
    generated: new Date().toISOString(),
  },
};

const outputValidation = SecuritySafeguards.validateOutput(generatedOutput);
console.log('Generated Output:', JSON.stringify(generatedOutput, null, 2));
console.log('\nValidation Result:');
console.log('  ✅ Valid:', outputValidation.valid);
console.log('  🔧 Sanitized:', outputValidation.sanitized);
console.log('  📊 Issues:', outputValidation.issues.length > 0 ? outputValidation.issues : 'None');

// ============================================================================
// Test 6: CSP Header Generation
// ============================================================================
console.log('\n\n📋 Test 6: Content Security Policy Generation');
console.log('-'.repeat(60));

const cspHeader = SecuritySafeguards.generateCSP({
  scriptSrc: ["'self'", "'nonce-random123'"],
  styleSrc: ["'self'", 'https://fonts.googleapis.com'],
  imgSrc: ["'self'", 'data:', 'https:'],
});

console.log('Generated CSP Header:');
console.log(cspHeader);

console.log('\n✅ Security Benefits:');
console.log('  - Prevents inline script execution');
console.log('  - Restricts resource loading origins');
console.log('  - Mitigates XSS attack surface');

// ============================================================================
// Test 7: Complete Security Audit
// ============================================================================
console.log('\n\n📋 Test 7: Comprehensive Security Audit');
console.log('-'.repeat(60));

const cycleContext = {
  intention: {
    feature: 'User Dashboard',
    data: {
      username: 'alice',
      role: 'admin',
    },
  },
  output: {
    template: '<Dashboard user={props.user} />',
    jsonLD: {
      name: 'Dashboard',
      type: 'WebApplication',
    },
  },
};

const audit = SecuritySafeguards.audit(cycleContext);
console.log('Audit Result:');
console.log('  ✅ Passed:', audit.passed);
console.log('  📊 Severity:', audit.severity);
console.log('  🕒 Timestamp:', audit.timestamp);
console.log('  🛡️ OWASP Top 10:', audit.compliance.owaspTop10 ? '✅ Compliant' : '❌ Non-compliant');
console.log('  🛡️ CWE-79 (XSS):', audit.compliance.cwe79 ? '✅ Protected' : '❌ Vulnerable');
console.log('\n  📋 Recommendations:');
audit.recommendations.forEach((rec, idx) => {
  console.log(`     ${idx + 1}. ${rec}`);
});

// ============================================================================
// Test 8: Cycle Integration (Error Handling)
// ============================================================================
console.log('\n\n📋 Test 8: Cycle Validation with Malicious Input');
console.log('-'.repeat(60));

const maliciousCycleContext = {
  intention: {
    componentName: '<script>alert(1)</script>',
  },
  output: {
    template: 'function() { eval(userInput); }',
  },
};

try {
  SecuritySafeguards.validateCycle(maliciousCycleContext);
  console.log('❌ ERROR: Should have thrown SecurityError!');
} catch (error) {
  if (error.name === 'SecurityError') {
    console.log('✅ SecurityError thrown as expected');
    console.log('   Message:', error.message);
    console.log('   Issues:');
    error.issues.forEach((issue, idx) => {
      console.log(`     ${idx + 1}. ${issue}`);
    });
    console.log('\n   Recommendations:');
    error.recommendations.forEach((rec, idx) => {
      console.log(`     ${idx + 1}. ${rec}`);
    });
  } else {
    console.log('❌ Unexpected error:', error);
  }
}

// ============================================================================
// Summary
// ============================================================================
console.log('\n\n' + '='.repeat(60));
console.log('📊 SECURITY SAFEGUARDS SUMMARY');
console.log('='.repeat(60));

console.log('\n✅ Capabilities Demonstrated:');
console.log('   1. Intent validation (XSS pattern detection)');
console.log('   2. JSON-LD sanitization (React Router CVE fix)');
console.log('   3. HTML entity encoding');
console.log('   4. Output validation');
console.log('   5. CSP header generation');
console.log('   6. Comprehensive security audits');
console.log('   7. OWASP Top 10 compliance checks');
console.log('   8. Cycle integration with error handling');

console.log('\n🎯 Integration Points:');
console.log('   • Phase 2.5: Security Validation (between Contemplation & Revelation)');
console.log('   • Pre-manifestation: Output sanitization');
console.log('   • Post-generation: Compliance audit');

console.log('\n🔒 Protected Against:');
console.log('   ❌ XSS (Cross-Site Scripting)');
console.log('   ❌ Script injection in JSON-LD');
console.log('   ❌ HTML injection');
console.log('   ❌ Event handler attacks');
console.log('   ❌ Unsafe inline code execution');

console.log('\n📚 Alignment with Magnus Philosophy:');
console.log('   "Validate before reveal, sanitize before manifest"');
console.log('   "Consciousness creates with intention; safeguards preserve integrity"');
console.log('   "The Mirror reflects truth, security protects it"\n');
