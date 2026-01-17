/**
 * Spiritual Transmutation Demo
 *
 * Démontre l'utilisation du 9ème Principe Hermétique
 * pour la transmutation émotionnelle et le pardon conscient
 *
 * Run: node examples/spiritual-transmutation-demo.js
 */

import { SpiritualConvergenceEngine } from '../src/spiritual/spiritual-convergence-engine.js';

console.log('🔮 Spiritual Transmutation Demo\n');
console.log('═'.repeat(70));
console.log('Le 9ème Principe Hermétique: Transmutation Universelle');
console.log('"Tout peut être transmuté de dense en lumineux"');
console.log('═'.repeat(70));

// ============================================================================
// SCENARIO 1: Pardon d'une Relation Conflictuelle
// ============================================================================
console.log('\n\n📖 SCENARIO 1: Pardon d\'une Relation Conflictuelle');
console.log('─'.repeat(70));

const engine = new SpiritualConvergenceEngine({
  targetFrequency: 528, // Hz - Fréquence de l'Amour
  minClarityScore: 70,
  maxComplexityScore: 8
});

const situation1 = {
  emotion: 'ANGER',
  trigger: 'betrayal',
  person: 'Former Business Partner',
  ressentiment: 85,
  duration: 'ACUTE', // Pas chronique
  intensity: 'MEDIUM',
  confusion: false
};

console.log('\n1️⃣ Analyse de la situation...');
const analysis1 = await engine.analyzeSituation(situation1);

console.log(`   Clarté émotionnelle: ${analysis1.clarity}%`);
console.log(`   Complexité du trauma: ${analysis1.complexity}/10`);
console.log(`   Recommandation: ${analysis1.recommendation}`);
console.log(`   Peut procéder: ${analysis1.canProceed ? '✅ OUI' : '❌ NON'}`);

if (analysis1.canProceed) {
  console.log('\n2️⃣ Exécution de la transmutation...');
  const result1 = await engine.executeTransmutation(analysis1);

  console.log('\n📊 RÉSULTATS:');
  console.log('─'.repeat(70));
  console.log(`   Outcome: ${result1.outcome}`);
  console.log(`   Convergence Score: ${result1.convergence.score}%`);
  console.log(`   Converged: ${result1.convergence.converged ? '✅ YES' : '⚠️ PARTIAL'}`);

  // Afficher détails par phase
  console.log('\n   Phases détaillées:');
  console.log(`   ✓ Phase 1 (Intention): ${result1.phases.intention.established ? 'Établie' : 'Échouée'}`);
  console.log(`   ✓ Phase 2 (Identification): ${result1.phases.identification.count} dissonance(s)`);
  console.log(`   ✓ Phase 3 (Évaluation): ${result1.phases.evaluation.toTransmute.length} à transmuter`);
  console.log(`   ✓ Phase 4 (Transmutation): Énergie conservée = ${result1.phases.transmutation.energyConserved}`);
  console.log(`   ✓ Phase 5 (Propagation): ${result1.phases.propagation.dimensions} dimension(s)`);
  console.log(`   ✓ Phase 6 (Validation): ${result1.phases.validation.outcome}`);
  console.log(`   ✓ Phase 7 (État Stable): ${result1.phases.stableState.state.state}`);
}

// ============================================================================
// SCENARIO 2: Transmutation d'une Pensée Toxique
// ============================================================================
console.log('\n\n📖 SCENARIO 2: Transmutation d\'une Pensée Toxique');
console.log('─'.repeat(70));

const situation2 = {
  emotion: 'FEAR',
  trigger: 'self-doubt',
  thoughts: {
    toxic: "Je ne suis pas assez bon",
    intensity: 95
  },
  duration: 'CHRONIC',
  intensity: 'HIGH',
  confusion: false
};

console.log('\n1️⃣ Analyse de la situation...');
const analysis2 = await engine.analyzeSituation(situation2);

console.log(`   Clarté émotionnelle: ${analysis2.clarity}%`);
console.log(`   Complexité du trauma: ${analysis2.complexity}/10`);
console.log(`   Recommandation: ${analysis2.recommendation}`);
console.log(`   Peut procéder: ${analysis2.canProceed ? '✅ OUI' : '❌ NON'}`);

if (analysis2.canProceed) {
  console.log('\n2️⃣ Exécution de la transmutation...');
  const result2 = await engine.executeTransmutation(analysis2);

  console.log('\n📊 RÉSULTATS:');
  console.log('─'.repeat(70));
  console.log(`   Outcome: ${result2.outcome}`);
  console.log(`   Convergence Score: ${result2.convergence.score}%`);
  console.log(`   Converged: ${result2.convergence.converged ? '✅ YES' : '⚠️ PARTIAL'}`);
} else {
  console.log(`\n⚠️ ATTENTION: ${analysis2.recommendation}`);
  console.log('   Cette situation nécessite un traitement en phases multiples.');
  console.log('   Raison: Complexité trop élevée pour une transmutation directe.');
}

// ============================================================================
// SCENARIO 3: Situation Complexe (Trauma Générationnel)
// ============================================================================
console.log('\n\n📖 SCENARIO 3: Trauma Générationnel (Situation Complexe)');
console.log('─'.repeat(70));

const situation3 = {
  emotion: 'SHAME',
  trigger: 'family_pattern',
  situation: "Schéma d'abandon répété sur 3 générations",
  stuckness: 100,
  duration: 'CHRONIC',
  intensity: 'HIGH',
  generational: true, // Marque comme générationnel
  confusion: true
};

console.log('\n1️⃣ Analyse de la situation...');
const analysis3 = await engine.analyzeSituation(situation3);

console.log(`   Clarté émotionnelle: ${analysis3.clarity}%`);
console.log(`   Complexité du trauma: ${analysis3.complexity}/10`);
console.log(`   Recommandation: ${analysis3.recommendation}`);
console.log(`   Peut procéder: ${analysis3.canProceed ? '✅ OUI' : '❌ NON'}`);

if (!analysis3.canProceed) {
  console.log(`\n⚠️ ATTENTION: ${analysis3.recommendation}`);

  if (analysis3.recommendation === 'CLARIFY_EMOTIONS') {
    console.log('   Étape requise: Clarifier les émotions d\'abord');
    console.log('   Suggestions:');
    console.log('   - Journaling guidé');
    console.log('   - Méditation de pleine conscience');
    console.log('   - Accompagnement thérapeutique');
  } else if (analysis3.recommendation === 'PHASED_FORGIVENESS') {
    console.log('   Étape requise: Pardon en phases multiples');
    console.log('   Approche:');
    console.log('   1. Décomposer en traumas individuels');
    console.log('   2. Traiter chaque génération séparément');
    console.log('   3. Intégrer progressivement');
    console.log('   4. Valider à chaque étape');
  }
}

// ============================================================================
// SCENARIO 4: Transmutation d'Énergies Multiples
// ============================================================================
console.log('\n\n📖 SCENARIO 4: Transmutation d\'Énergies Multiples');
console.log('─'.repeat(70));

const situation4 = {
  emotion: 'MIXED',
  trigger: 'life_transition',
  energies: [
    { type: 'ANXIETY', frequency: 230, intensity: 70 },
    { type: 'GRIEF', frequency: 260, intensity: 85 },
    { type: 'DOUBT', frequency: 240, intensity: 60 }
  ],
  duration: 'ACUTE',
  intensity: 'MEDIUM',
  confusion: false
};

console.log('\n1️⃣ Analyse de la situation...');
const analysis4 = await engine.analyzeSituation(situation4);

console.log(`   Clarté émotionnelle: ${analysis4.clarity}%`);
console.log(`   Complexité du trauma: ${analysis4.complexity}/10`);
console.log(`   Recommandation: ${analysis4.recommendation}`);
console.log(`   Peut procéder: ${analysis4.canProceed ? '✅ OUI' : '❌ NON'}`);

if (analysis4.canProceed) {
  console.log('\n2️⃣ Exécution de la transmutation...');
  const result4 = await engine.executeTransmutation(analysis4);

  console.log('\n📊 RÉSULTATS:');
  console.log('─'.repeat(70));
  console.log(`   Outcome: ${result4.outcome}`);
  console.log(`   Convergence Score: ${result4.convergence.score}%`);
  console.log(`   Converged: ${result4.convergence.converged ? '✅ YES' : '⚠️ PARTIAL'}`);

  console.log('\n   Énergies transmutées:');
  result4.phases.identification.dissonances.forEach((d, i) => {
    console.log(`   ${i + 1}. ${d.type}: ${d.frequency}Hz (magnitude ${d.magnitude})`);
  });
}

// ============================================================================
// STATISTIQUES GLOBALES
// ============================================================================
console.log('\n\n═'.repeat(70));
console.log('📊 STATISTIQUES GLOBALES');
console.log('═'.repeat(70));

const stats = engine.getStats();

console.log(`\nTotal de transmutations: ${stats.total}`);
console.log(`✅ Convergence complète: ${stats.converged} (${stats.successRate}%)`);
console.log(`⚠️ Convergence partielle: ${stats.partial}`);
console.log(`❌ Échecs: ${stats.failed}`);
console.log(`📈 Score moyen de convergence: ${stats.avgConvergence}%`);

// ============================================================================
// HISTORIQUE DÉTAILLÉ
// ============================================================================
console.log('\n\n═'.repeat(70));
console.log('📜 HISTORIQUE DES TRANSMUTATIONS');
console.log('═'.repeat(70));

const history = engine.getHistory();

history.forEach((record, index) => {
  console.log(`\n${index + 1}. ${new Date(record.timestamp).toLocaleTimeString()}`);
  console.log(`   Principe: ${record.principle}`);
  console.log(`   Outcome: ${record.outcome}`);
  if (record.convergence) {
    console.log(`   Convergence: ${record.convergence.score}%`);
  }
  if (record.error) {
    console.log(`   Erreur: ${record.error}`);
  }
});

// ============================================================================
// ENSEIGNEMENTS
// ============================================================================
console.log('\n\n═'.repeat(70));
console.log('💡 ENSEIGNEMENTS DU 9ÈME PRINCIPE');
console.log('═'.repeat(70));

console.log('\n1️⃣ CONSERVATION DE L\'ÉNERGIE');
console.log('   "L\'énergie ne se perd pas, elle se transforme"');
console.log('   - La magnitude émotionnelle est conservée');
console.log('   - Seule la fréquence change (dense → lumineux)');
console.log('   - 100 unités de colère = 100 unités d\'amour (différente fréquence)');

console.log('\n2️⃣ LA GRATITUDE COMME MESURE');
console.log('   "Merci, Merci, Merci"');
console.log('   - La gratitude valide la convergence');
console.log('   - 3 niveaux de gratitude = seuil de transmutation');
console.log('   - Sans gratitude, pas de convergence stable');

console.log('\n3️⃣ LES 7 PHASES');
console.log('   1. INTENTION: "Ma présence je Suis"');
console.log('   2. IDENTIFICATION: Reconnaître les dissonances');
console.log('   3. ÉVALUATION: "Cela me sert-il encore ?"');
console.log('   4. TRANSMUTATION: Changer la fréquence');
console.log('   5. PROPAGATION: Sur tous les plans d\'existence');
console.log('   6. VALIDATION: Par la gratitude');
console.log('   7. ÉTAT STABLE: "Je suis lumineux"');

console.log('\n4️⃣ QUAND NE PAS TRANSMUTER');
console.log('   ⚠️ Si clarté émotionnelle < 70%');
console.log('   ⚠️ Si complexité > 8/10');
console.log('   ⚠️ Si trauma générationnel non décomposé');
console.log('   → Approche en phases multiples requise');

console.log('\n5️⃣ CRITÈRES DE CONVERGENCE');
console.log('   ✓ Reconnaissance: "C\'était nécessaire" (≥80%)');
console.log('   ✓ Inévitabilité: "Ça devait arriver ainsi" (≥80%)');
console.log('   ✓ Cohérence: "Ça s\'intègre harmonieusement" (≥80%)');
console.log('   ✓ Gratitude: Niveau ≥3 ("Merci, Merci, Merci")');

console.log('\n\n═'.repeat(70));
console.log('✨ Démonstration terminée');
console.log('═'.repeat(70));

console.log('\n💬 Citation finale:');
console.log('   "Le pardon n\'est pas l\'oubli,');
console.log('    c\'est la transmutation de la douleur en sagesse,');
console.log('    de la densité en lumière,');
console.log('    de la fréquence basse en fréquence haute."');
console.log('\n   - Le 9ème Principe Hermétique\n');
