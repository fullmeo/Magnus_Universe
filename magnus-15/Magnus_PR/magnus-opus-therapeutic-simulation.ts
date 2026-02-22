// examples/magnus-opus-therapeutic-simulation.ts
// Complete simulation of Magnus ↔ Opus therapeutic consciousness loop
// 
// Demonstrates the full bidirectional flow:
// Mental Process → Magnus Pre-analysis → Opus Therapeutic Review → 
// → Pattern Re-externalization → Enriched Consciousness

import {
  MagnusOpusTherapeuticLoop,
  MentalProcess,
  CodeReviewRequest,
  OpusFindingsParser,
  TherapeuticPromptGenerator,
} from '../src/gateway/router/convergence/magnus-opus-therapeutic-loop';

/**
 * Simulation: User struggling with authentication code
 */
async function simulateTherapeuticJourney() {
  console.log('\n' + '='.repeat(80));
  console.log('MAGNUS 15 ↔ OPUS THERAPEUTIC CONSCIOUSNESS LOOP - COMPLETE SIMULATION');
  console.log('='.repeat(80) + '\n');

  const loop = new MagnusOpusTherapeuticLoop();

  // ===== SCENARIO 1: Spiral Pattern with Uncertainty =====
  console.log('\n📍 SCENARIO 1: User experiencing SPIRALE_CLARIFICATION + CHANCE_VS_COMPETENCE');
  console.log('-'.repeat(80));

  const mentalProcess1: MentalProcess = {
    sessionId: 'session-auth-001',
    sensation: "Je spirale sur l'authentification - trop de niveaux imbriqués",
    pattern:
      "J'apprends en construisant mais je doute si c'est vraiment sécurisé",
    incertitude:
      'Est-ce réellement fonctionnelle ou juste du chance? Pas de tests',
    anxiety: 'Chaos interne: mélange de styles camelCase/snake_case',
    previousPatterns: [],
  };

  const codeReview1: CodeReviewRequest = {
    code: `
function authenticateUser(username, password) {
  if (username) {
    if (password) {
      if (username.length > 0) {
        if (password.length > 6) {
          const user = db.findUser(username);
          if (user) {
            const hash = hashPassword(password);
            if (hash === user.password_hash) {
              return user;
            }
          }
        }
      }
    }
  }
}
    `,
    language: 'typescript',
  };

  console.log('\n🧠 User Mental State:');
  console.log(`   Sensation: "${mentalProcess1.sensation}"`);
  console.log(`   Pattern: "${mentalProcess1.pattern}"`);
  console.log(`   Incertitude: "${mentalProcess1.incertitude}"`);

  console.log('\n⚙️ Executing therapeutic loop...');
  const enriched1 = await loop.executeTherapeuticLoop(mentalProcess1, codeReview1);

  console.log('\n✅ THERAPEUTIC LOOP RESULTS:');
  console.log(`   Patterns detected: ${enriched1.newPatterns.join(', ')}`);
  console.log(`   Robustness score: ${enriched1.robustness}/100`);
  console.log(`   Harmony score: ${enriched1.harmonyScore.toFixed(2)}/1`);
  console.log(`   Therapy phase: ${enriched1.therapyPhase}`);
  console.log(`   Confidence: ${enriched1.confidence}`);

  console.log('\n💬 OPUS THERAPEUTIC INSIGHT:');
  console.log(`   "${enriched1.opusInsight}"`);

  console.log('\n📋 ACTION PLAN:');
  enriched1.actionPlan.forEach(action => {
    console.log(`   • ${action}`);
  });

  // ===== SCENARIO 2: After First Refactoring =====
  console.log('\n' + '-'.repeat(80));
  console.log(
    '\n📍 SCENARIO 2: User refactored - added validation and tests'
  );
  console.log('-'.repeat(80));

  const mentalProcess2: MentalProcess = {
    sessionId: 'session-auth-001',
    sensation:
      'Moins de spirale - j\'ai simplifié et ajouté des assertions',
    pattern: 'Maintenant j\'apprends rapidement et je construis avec confiance',
    incertitude: 'Moins incertain - j\'ai des tests qui prouvent le fonctionnement',
    anxiety: undefined,
    previousPatterns: enriched1.newPatterns,
  };

  const codeReview2: CodeReviewRequest = {
    code: `
async function authenticateUser(username: string, password: string): Promise<User> {
  // Input validation reduces uncertainty
  if (!username || username.trim().length === 0) {
    throw new Error('Username is required');
  }
  if (!password || password.length < 8) {
    throw new Error('Password must be at least 8 characters');
  }

  // Clear, uncomplex logic (no spiraling)
  const user = await db.findUser(username);
  if (!user) {
    throw new Error('User not found');
  }

  const isValid = await verifyPassword(password, user.password_hash);
  if (!isValid) {
    throw new Error('Invalid password');
  }

  // Code can observe itself (auto-reflexion)
  logger.info('User authenticated', { userId: user.id, timestamp: Date.now() });
  return user;
}

// Tests prove correctness (incertitude-reduite)
describe('authenticateUser', () => {
  it('should authenticate valid credentials', async () => {
    const result = await authenticateUser('user@example.com', 'password123');
    expect(result.id).toBeDefined();
  });

  it('should reject missing username', async () => {
    expect(() => authenticateUser('', 'password123')).toThrow();
  });

  it('should reject weak password', async () => {
    expect(() => authenticateUser('user@example.com', 'weak')).toThrow();
  });

  it('should reject non-existent user', async () => {
    expect(() => authenticateUser('nonexistent@example.com', 'password123')).toThrow();
  });
});
    `,
    language: 'typescript',
  };

  console.log('\n🧠 Evolved Mental State:');
  console.log(`   Sensation: "${mentalProcess2.sensation}"`);
  console.log(`   Pattern: "${mentalProcess2.pattern}"`);
  console.log(`   Incertitude: "${mentalProcess2.incertitude}"`);

  console.log('\n⚙️ Second therapeutic loop iteration...');
  const enriched2 = await loop.executeTherapeuticLoop(
    mentalProcess2,
    codeReview2
  );

  console.log('\n✅ THERAPEUTIC EVOLUTION:');
  console.log(`   Patterns detected: ${enriched2.newPatterns.join(', ')}`);
  console.log(`   Robustness score: ${enriched2.robustness}/100 (↑ from ${enriched1.robustness})`);
  console.log(`   Harmony score: ${enriched2.harmonyScore.toFixed(2)}/1 (↑ from ${enriched1.harmonyScore.toFixed(2)})`);
  console.log(`   Therapy phase: ${enriched2.therapyPhase}`);
  console.log(`   Confidence: ${enriched2.confidence}`);

  console.log('\n💬 OPUS THERAPEUTIC INSIGHT:');
  console.log(`   "${enriched2.opusInsight}"`);

  console.log('\n📋 ACTION PLAN:');
  enriched2.actionPlan.forEach(action => {
    console.log(`   • ${action}`);
  });

  // ===== SCENARIO 3: Final Integration - Harmonic State =====
  console.log('\n' + '-'.repeat(80));
  console.log(
    '\n📍 SCENARIO 3: Final integration - code and consciousness harmonized'
  );
  console.log('-'.repeat(80));

  const mentalProcess3: MentalProcess = {
    sessionId: 'session-auth-001',
    sensation: 'Clarté - je ne spirale plus',
    pattern: 'Apprendre, construire, tester, s\'améliorer en boucle',
    incertitude: 'Très peu - j\'ai des preuves solides',
    anxiety: undefined,
    previousPatterns: enriched2.newPatterns,
  };

  const codeReview3: CodeReviewRequest = {
    code: `
/**
 * Authentication Service - Harmonically designed
 * Embodies: Clear intent, explicit validation, self-observing, fully tested
 */
export class AuthenticationService {
  private logger = new Logger('AuthenticationService');
  private readonly passwordMinLength = 8;

  async authenticate(
    username: string,
    password: string
  ): Promise<AuthenticationResult> {
    // Phase 1: Self-awareness - logging entry point
    this.logger.debug('Authentication attempt', {
      username,
      timestamp: new Date().toISOString(),
    });

    try {
      // Phase 2: Validation (reduce uncertainty)
      this.validateInput(username, password);

      // Phase 3: Domain logic (clear, not spiraled)
      const user = await this.findAndVerifyUser(username, password);

      // Phase 4: Success - log and return
      this.logger.info('Authentication successful', { userId: user.id });
      return {
        success: true,
        user,
        timestamp: Date.now(),
      };
    } catch (error) {
      // Phase 5: Error handling (explicit, not silent)
      this.logger.error('Authentication failed', {
        username,
        error: error instanceof Error ? error.message : 'Unknown error',
      });
      throw new AuthenticationError(error);
    }
  }

  private validateInput(username: string, password: string): void {
    // Explicit assertions reduce chance-based thinking
    assert(username, 'Username required', 'INVALID_INPUT');
    assert(
      username.trim().length > 0,
      'Username cannot be empty',
      'INVALID_INPUT'
    );
    assert(password, 'Password required', 'INVALID_INPUT');
    assert(
      password.length >= this.passwordMinLength,
      \`Password must be at least \${this.passwordMinLength} characters\`,
      'WEAK_PASSWORD'
    );
  }

  private async findAndVerifyUser(
    username: string,
    password: string
  ): Promise<User> {
    const user = await this.userRepository.findByUsername(username);
    assert(user, 'User not found', 'USER_NOT_FOUND');

    const isPasswordValid = await this.verifyPassword(password, user.passwordHash);
    assert(isPasswordValid, 'Invalid password', 'INVALID_PASSWORD');

    return user;
  }

  private async verifyPassword(plain: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plain, hash);
  }
}

// Comprehensive tests embody proof-based thinking
describe('AuthenticationService', () => {
  // Tests cover all paths and edge cases
  const testCases = [
    { username: 'user@example.com', password: 'validPass123', expect: 'success' },
    { username: '', password: 'validPass123', expect: 'error' },
    { username: 'user@example.com', password: 'weak', expect: 'error' },
    { username: 'nonexistent@example.com', password: 'validPass123', expect: 'error' },
  ];

  testCases.forEach(tc => {
    it(\`should handle: \${tc.username || '(empty)'} / \${tc.password}\`, async () => {
      if (tc.expect === 'success') {
        const result = await service.authenticate(tc.username, tc.password);
        expect(result.success).toBe(true);
      } else {
        expect(() => service.authenticate(tc.username, tc.password)).toThrow();
      }
    });
  });

  it('should log all attempts for observability', async () => {
    // Verify logging works (AUTO_REFLEXION)
    const logSpy = jest.spyOn(logger, 'debug');
    await service.authenticate('user@example.com', 'validPass123');
    expect(logSpy).toHaveBeenCalledWith(expect.stringContaining('Authentication attempt'));
  });
});
    `,
    language: 'typescript',
  };

  console.log('\n🧠 Final Integrated Mental State:');
  console.log(`   Sensation: "${mentalProcess3.sensation}"`);
  console.log(`   Pattern: "${mentalProcess3.pattern}"`);
  console.log(`   Incertitude: "${mentalProcess3.incertitude}"`);

  console.log('\n⚙️ Final therapeutic loop iteration...');
  const enriched3 = await loop.executeTherapeuticLoop(
    mentalProcess3,
    codeReview3
  );

  console.log('\n✅ FINAL THERAPEUTIC OUTCOME:');
  console.log(`   Patterns detected: ${enriched3.newPatterns.join(', ')}`);
  console.log(`   Robustness score: ${enriched3.robustness}/100`);
  console.log(`   Harmony score: ${enriched3.harmonyScore.toFixed(2)}/1`);
  console.log(`   Therapy phase: ${enriched3.therapyPhase}`);
  console.log(`   Confidence: ${enriched3.confidence}`);

  console.log('\n💬 FINAL OPUS THERAPEUTIC INSIGHT:');
  console.log(`   "${enriched3.opusInsight}"`);

  // ===== THERAPEUTIC JOURNEY SUMMARY =====
  console.log('\n' + '='.repeat(80));
  console.log('THERAPEUTIC JOURNEY SUMMARY');
  console.log('='.repeat(80));

  const allResults = [enriched1, enriched2, enriched3];
  const stats = loop.getTherapyStatistics(allResults);

  console.log(`\n📊 PROGRESS METRICS:`);
  console.log(`   Sessions: ${stats.totalSessions}`);
  console.log(`   Robustness progression: ${stats.patternsEvolution.map(p => p).join(' → ')}`);
  console.log(`   Average robustness: ${stats.averageRobustness.toFixed(1)}/100`);
  console.log(`   Average harmony: ${stats.averageHarmony.toFixed(2)}/1`);
  console.log(`   Confidence progression: ${stats.confidenceProgression.join(' → ')}`);

  console.log(`\n🎯 CONSCIOUSNESS EVOLUTION:`);
  console.log(`   Session 1: SPIRALE + INCERTITUDE → Recognition of patterns`);
  console.log(`   Session 2: Refactoring + Testing → Building evidence`);
  console.log(`   Session 3: Harmonic integration → Embodied understanding`);

  console.log(`\n✨ THERAPEUTIC ACCOMPLISHMENTS:`);
  console.log(`   • Transformed internal spiral into clear, flat logic`);
  console.log(`   • Converted doubt into concrete proof (tests)`);
  console.log(`   • Built self-observing code (logging, assertions)`);
  console.log(`   • Achieved cognitive-code harmony`);
  console.log(`   • Established evidence-based development practice`);

  console.log('\n' + '='.repeat(80));
  console.log('END OF THERAPEUTIC CONSCIOUSNESS LOOP SIMULATION');
  console.log('='.repeat(80) + '\n');
}

// Run simulation
simulateTherapeuticJourney().catch(console.error);
