/**
 * ============================================================================
 * TESTS MAGNUS 13.3 - 9ÈME PRINCIPE
 *
 * Test complet du noyau universel + application spirituelle
 * ============================================================================
 */

import NinthPrinciple from '../src/core/magnus-13-3-ninth-principle.js';
import SpiritualConvergenceEngine from '../src/spiritual/spiritual-convergence-engine.js';

// ============================================================================
// TEST SUITE 1 : NOYAU UNIVERSEL
// ============================================================================

console.log('═══════════════════════════════════════════════════════════');
console.log('TEST SUITE 1: NOYAU UNIVERSEL (9ÈME PRINCIPE)');
console.log('═══════════════════════════════════════════════════════════\n');

async function testNinthPrincipleCore() {
  const ninthPrinciple = new NinthPrinciple({
    targetFrequency: 528,
    conserveEnergy: true,
    gratitudeThreshold: 3
  });

  console.log('✓ NinthPrinciple instancié');
  console.log(`✓ ${ninthPrinciple.getPhaseCount()} invariants définis`);

  // Test 1: Vérifier que les 7 invariants existent
  const invariants = ninthPrinciple.getInvariants();
  const expectedPhases = [
    'INTENTION',
    'IDENTIFICATION',
    'EVALUATION',
    'TRANSMUTATION',
    'PROPAGATION',
    'VALIDATION',
    'STABLE_STATE'
  ];

  console.log('\n📋 Test 1: Vérification des invariants');
  expectedPhases.forEach(phase => {
    if (invariants[phase]) {
      console.log(`  ✓ ${phase} - Phase ${invariants[phase].phase}`);
    } else {
      console.log(`  ✗ ${phase} - MANQUANT`);
    }
  });

  // Test 2: Transmutation avec adapters minimaux
  console.log('\n📋 Test 2: Transmutation avec adapters minimaux');

  const testSubject = {
    type: 'TEST_DISSONANCE',
    frequency: 200, // Hz (peur)
    magnitude: 100
  };

  const testContext = {
    targetFrequency: 528,
    currentState: 'DENSE',
    dimensions: ['test']
  };

  const minimalAdapters = {
    intention: async (subject, context) => ({
      established: true,
      declaration: "Test presence",
      consciousness: "AWARE"
    }),

    identify: async (subject, context) => ([
      {
        id: 'dissonance_1',
        type: subject.type,
        frequency: subject.frequency,
        magnitude: subject.magnitude
      }
    ]),

    evaluate: async (dissonance, context) => ({
      dissonance,
      serves: false, // Ne sert plus
      growthPotential: 10,
      energyDrain: 80,
      reasoning: "Test evaluation"
    }),

    transmute: async (original, options) => ({
      type: original.type,
      frequency: options.targetFrequency,
      magnitude: original.magnitude, // CONSERVÉE
      energyConserved: true,
      transform: {
        before: 'FEAR',
        after: 'LOVE'
      }
    }),

    propagate: async (transmutations, dimension, context) => ({
      dimension,
      transmutations,
      propagated: true
    }),

    validate: async (propagation, context) => ({
      recognition: 85,
      inevitability: 90,
      coherence: 88,
      gratitudeLevel: 3
    }),

    stableState: async (validation, context) => ({
      state: 'LUMINOUS',
      stability: 'STABLE',
      luminosity: 528,
      emitting: true
    })
  };

  try {
    const startTime = Date.now();
    const result = await ninthPrinciple.transmute(
      testSubject,
      testContext,
      minimalAdapters
    );
    const duration = Date.now() - startTime;

    console.log(`  ✓ Transmutation complétée: ${result.outcome}`);
    console.log(`  ✓ Durée: ${duration}ms`);

    // Compter les phases
    const phaseKeys = Object.keys(result.phases);
    console.log(`  ✓ Phases exécutées: ${phaseKeys.length}/7`);

    // Vérifier que toutes les phases ont été exécutées
    if (phaseKeys.length === 7) {
      console.log('  ✓ Toutes les phases validées');
    } else {
      console.log(`  ✗ Phases manquantes: ${7 - phaseKeys.length}`);
    }

    return result;

  } catch (error) {
    console.log(`  ✗ ERREUR: ${error.message}`);
    return null;
  }
}

// ============================================================================
// TEST SUITE 2 : APPLICATION SPIRITUELLE
// ============================================================================

async function testSpiritualEngine() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('TEST SUITE 2: APPLICATION SPIRITUELLE');
  console.log('═══════════════════════════════════════════════════════════\n');

  const engine = new SpiritualConvergenceEngine({
    targetFrequency: 528,
    minClarityScore: 70,
    maxComplexityScore: 8
  });

  console.log('✓ SpiritualConvergenceEngine instancié');

  // Test 3: Analyse d'une situation simple
  console.log('\n📋 Test 3: Analyse situation SIMPLE (clarity OK, complexity OK)');

  const simpleSituation = {
    type: 'RELATIONSHIP_CONFLICT',
    person: 'ancien collègue',
    emotion: 'ressentiment',
    intensity: 'MEDIUM',
    duration: 'SHORT',
    trigger: 'parole blessante',
    ressentiment: 60
  };

  const simpleAnalysis = await engine.analyzeSituation(simpleSituation);

  console.log(`  Clarity: ${simpleAnalysis.clarity}/100`);
  console.log(`  Complexity: ${simpleAnalysis.complexity}/10`);
  console.log(`  Can proceed: ${simpleAnalysis.canProceed}`);
  console.log(`  Recommendation: ${simpleAnalysis.recommendation}`);

  if (simpleAnalysis.canProceed && simpleAnalysis.recommendation === 'PROCEED_TRANSMUTATION') {
    console.log('  ✓ Situation simple correctement identifiée');
  } else {
    console.log('  ✗ Décision incorrecte pour situation simple');
  }

  // Test 4: Analyse d'une situation complexe
  console.log('\n📋 Test 4: Analyse situation COMPLEXE (complexity trop haute)');

  const complexSituation = {
    type: 'GENERATIONAL_TRAUMA',
    emotion: 'colère profonde',
    intensity: 'HIGH',
    duration: 'CHRONIC',
    generational: true,
    trigger: 'multiple patterns',
    ressentiment: 100
  };

  const complexAnalysis = await engine.analyzeSituation(complexSituation);

  console.log(`  Clarity: ${complexAnalysis.clarity}/100`);
  console.log(`  Complexity: ${complexAnalysis.complexity}/10`);
  console.log(`  Can proceed: ${complexAnalysis.canProceed}`);
  console.log(`  Recommendation: ${complexAnalysis.recommendation}`);

  if (!complexAnalysis.canProceed && complexAnalysis.recommendation === 'PHASED_FORGIVENESS') {
    console.log('  ✓ Situation complexe correctement identifiée');
  } else {
    console.log('  ✗ Décision incorrecte pour situation complexe');
  }

  // Test 5: Analyse d'une situation peu claire
  console.log('\n📋 Test 5: Analyse situation PEU CLAIRE (clarity insuffisante)');

  const unclearSituation = {
    type: 'RELATIONSHIP_CONFLICT',
    // Pas d'émotion définie
    // Pas de trigger
    confusion: true,
    ressentiment: 50
  };

  const unclearAnalysis = await engine.analyzeSituation(unclearSituation);

  console.log(`  Clarity: ${unclearAnalysis.clarity}/100`);
  console.log(`  Complexity: ${unclearAnalysis.complexity}/10`);
  console.log(`  Can proceed: ${unclearAnalysis.canProceed}`);
  console.log(`  Recommendation: ${unclearAnalysis.recommendation}`);

  if (!unclearAnalysis.canProceed && unclearAnalysis.recommendation === 'CLARIFY_EMOTIONS') {
    console.log('  ✓ Situation peu claire correctement identifiée');
  } else {
    console.log('  ✗ Décision incorrecte pour situation peu claire');
  }

  // Test 6: Exécution complète transmutation
  console.log('\n📋 Test 6: Exécution COMPLÈTE de transmutation');

  if (simpleAnalysis.canProceed) {
    try {
      const startTime = Date.now();
      const transmutationResult = await engine.executeTransmutation(simpleAnalysis);
      const duration = Date.now() - startTime;

      console.log(`  Outcome: ${transmutationResult.outcome}`);
      console.log(`  Phases: ${Object.keys(transmutationResult.phases).length}/7`);
      console.log(`  Duration: ${duration}ms`);

      if (transmutationResult.outcome === 'CONVERGED') {
        const finalPhase = transmutationResult.phases.stableState;
        console.log(`  État final: ${finalPhase.state.state}`);
        console.log(`  Luminosity: ${finalPhase.state.luminosity}Hz`);
        console.log('  ✓ Transmutation réussie');
      } else {
        console.log(`  ⚠️  Outcome: ${transmutationResult.outcome}`);
      }

      return transmutationResult;

    } catch (error) {
      console.log(`  ✗ ERREUR: ${error.message}`);
      console.log(error.stack);
      return null;
    }
  } else {
    console.log('  ⚠️  Cannot test transmutation (situation not ready)');
    return null;
  }
}

// ============================================================================
// TEST SUITE 3 : CONSERVATION DE L'ÉNERGIE (CRITIQUE)
// ============================================================================

async function testEnergyConservation() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('TEST SUITE 3: CONSERVATION DE L\'ÉNERGIE (PRINCIPE FONDAMENTAL)');
  console.log('═══════════════════════════════════════════════════════════\n');

  const ninthPrinciple = new NinthPrinciple({
    targetFrequency: 528,
    conserveEnergy: true // OBLIGATOIRE
  });

  console.log('📋 Test 7: Vérification conservation énergie');

  // Adapter qui VIOLE la conservation (pour tester la détection)
  const violatingAdapters = {
    intention: async () => ({ established: true, declaration: 'Test', consciousness: 'AWARE' }),
    identify: async (subject) => ([
      { id: '1', frequency: 200, magnitude: 100, type: 'TEST' }
    ]),
    evaluate: async (d) => ({ dissonance: d, serves: false, growthPotential: 0, energyDrain: 100, reasoning: 'Test' }),

    transmute: async (original, options) => ({
      type: original.type,
      frequency: options.targetFrequency,
      magnitude: 50, // ❌ VIOLATION: énergie diminuée !
      energyConserved: false, // Honnêteté du adapter
      transform: { before: 'FEAR', after: 'LOVE' }
    }),

    propagate: async (t, d) => ({ dimension: d, transmutations: t, propagated: true }),
    validate: async () => ({ recognition: 80, inevitability: 80, coherence: 80, gratitudeLevel: 3 }),
    stableState: async () => ({ state: 'TEST', stability: 'STABLE', luminosity: 528, emitting: true })
  };

  try {
    await ninthPrinciple.transmute(
      { frequency: 200, magnitude: 100, type: 'TEST' },
      { targetFrequency: 528, dimensions: ['test'], currentState: 'DENSE' },
      violatingAdapters
    );

    console.log('  ✗ ERREUR: Violation non détectée !');
    return false;

  } catch (error) {
    if (error.message.includes('Energy conservation violated') || error.message.includes('conservation')) {
      console.log('  ✓ Violation correctement détectée');
      console.log(`  ✓ Message: ${error.message}`);
      return true;
    } else {
      console.log(`  ✗ Erreur inattendue: ${error.message}`);
      return false;
    }
  }
}

// ============================================================================
// TEST SUITE 4 : CAS D'USAGE RÉEL
// ============================================================================

async function testRealWorldScenario() {
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('TEST SUITE 4: CAS D\'USAGE RÉEL');
  console.log('═══════════════════════════════════════════════════════════\n');

  const engine = new SpiritualConvergenceEngine();

  console.log('📋 Test 8: Scénario réaliste - Pardon après conflit professionnel');

  const realScenario = {
    type: 'RELATIONSHIP_CONFLICT',
    person: 'ancien manager',
    emotion: 'ressentiment',
    intensity: 'MEDIUM',
    duration: 'SHORT',
    trigger: 'feedback injuste lors d\'une évaluation',

    situation: 'Évaluation professionnelle vécue comme injuste il y a 6 mois',

    thoughts: {
      toxic: 'Il ne m\'a jamais apprécié, il était partial',
      intensity: 70
    },

    ressentiment: 75,
    stuckness: 60
  };

  console.log('\n  Contexte:');
  console.log(`  - Personne: ${realScenario.person}`);
  console.log(`  - Émotion: ${realScenario.emotion} (${realScenario.intensity})`);
  console.log(`  - Situation: ${realScenario.situation}`);
  console.log(`  - Pensée toxique: "${realScenario.thoughts.toxic}"`);

  // Étape 1: Analyse
  console.log('\n  🔍 Étape 1: ANALYSE');
  const analysis = await engine.analyzeSituation(realScenario);

  console.log(`    Clarity: ${analysis.clarity}/100`);
  console.log(`    Complexity: ${analysis.complexity}/10`);
  console.log(`    Recommendation: ${analysis.recommendation}`);

  if (!analysis.canProceed) {
    console.log(`    ⚠️  Cannot proceed: ${analysis.recommendation}`);
    return null;
  }

  // Étape 2: Transmutation
  console.log('\n  🔮 Étape 2: TRANSMUTATION');
  const result = await engine.executeTransmutation(analysis);

  console.log(`    Outcome: ${result.outcome}`);

  if (result.outcome === 'CONVERGED') {
    console.log('\n  ✨ Étape 3: RÉSULTAT FINAL');

    const finalState = result.phases.stableState;
    console.log(`    État initial: DENSE (absorbant)`);
    console.log(`    État final: ${finalState.state.state} (émettant)`);
    console.log(`    Luminosité: ${finalState.state.luminosity}Hz`);

    // Analyser les transmutations
    const transmutationPhase = result.phases.transmutation;
    if (transmutationPhase.transmuted) {
      console.log('\n  📊 Transmutations effectuées:');
      transmutationPhase.transmuted.forEach((t, i) => {
        console.log(`    ${i + 1}. ${t.type}`);
        console.log(`       Fréquence: ${t.transform.before} → ${t.transform.after}`);
        console.log(`       Énergie: ${t.magnitude} (conservée: ${t.energyConserved ? '✓' : '✗'})`);
      });
    }

    console.log('\n  ✓ Pardon complété avec succès');
    console.log('  ✓ "Je suis lumineux"');

    return result;
  } else {
    console.log(`  ⚠️  Outcome: ${result.outcome}`);
    return result;
  }
}

// ============================================================================
// EXÉCUTION DES TESTS
// ============================================================================

async function runAllTests() {
  console.log('\n🧪 DÉMARRAGE DES TESTS MAGNUS 13.3\n');

  const results = {
    core: null,
    spiritual: null,
    energy: null,
    realWorld: null
  };

  try {
    // Suite 1
    results.core = await testNinthPrincipleCore();

    // Suite 2
    results.spiritual = await testSpiritualEngine();

    // Suite 3
    results.energy = await testEnergyConservation();

    // Suite 4
    results.realWorld = await testRealWorldScenario();

  } catch (error) {
    console.error('\n❌ ERREUR FATALE:', error.message);
    console.error(error.stack);
  }

  // Résumé final
  console.log('\n═══════════════════════════════════════════════════════════');
  console.log('RÉSUMÉ DES TESTS');
  console.log('═══════════════════════════════════════════════════════════\n');

  console.log(`Suite 1 (Core):       ${results.core ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`Suite 2 (Spiritual):  ${results.spiritual ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`Suite 3 (Energy):     ${results.energy ? '✓ PASS' : '✗ FAIL'}`);
  console.log(`Suite 4 (Real World): ${results.realWorld ? '✓ PASS' : '✗ FAIL'}`);

  const allPassed = results.core && results.spiritual && results.energy && results.realWorld;

  console.log('\n═══════════════════════════════════════════════════════════');
  if (allPassed) {
    console.log('🎉 TOUS LES TESTS PASSENT - PHASE 2 VALIDÉE');
  } else {
    console.log('⚠️  CERTAINS TESTS ÉCHOUENT - AJUSTEMENTS NÉCESSAIRES');
  }
  console.log('═══════════════════════════════════════════════════════════\n');

  return results;
}

// Exécuter
runAllTests().catch(console.error);
