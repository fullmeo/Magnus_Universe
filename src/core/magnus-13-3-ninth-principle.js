/**
 * Magnus 13.3 - Ninth Hermetic Principle
 *
 * PRINCIPE DE TRANSMUTATION UNIVERSELLE
 * "Tout peut être transmuté de dense en lumineux;
 *  L'énergie se conserve, seule la fréquence change;
 *  La gratitude est la mesure de la convergence."
 *
 * Ce principe étend les 7 principes hermétiques classiques du Kybalion
 * pour inclure la dimension spirituelle de la transmutation émotionnelle
 * et du pardon conscient.
 *
 * Philosophie:
 * - Dense (basse fréquence) → Lumineux (haute fréquence)
 * - Conservation de l'énergie (1ère loi thermodynamique spirituelle)
 * - Gratitude comme validation de convergence
 * - 7 phases de transmutation universelle
 *
 * @version 13.3.0
 * @author Magnus Universe Team
 * @since 2026-01-10
 */

export class NinthPrinciple {
  constructor(config = {}) {
    this.config = {
      targetFrequency: config.targetFrequency || 528, // Hz - Amour/Transformation
      gratitudeThreshold: config.gratitudeThreshold || 3, // "Merci, Merci, Merci"
      maxIterations: config.maxIterations || 7,
      convergenceThreshold: config.convergenceThreshold || 85,
      ...config
    };

    this.principle = {
      name: 'Transmutation Universelle',
      statement: 'Tout peut être transmuté de dense en lumineux',
      corollaries: [
        "L'énergie se conserve, seule la fréquence change",
        "La gratitude est la mesure de la convergence",
        "Le pardon libère l'énergie figée dans la densité"
      ]
    };

    this.phases = [
      'INTENTION',
      'IDENTIFICATION',
      'EVALUATION',
      'TRANSMUTATION',
      'PROPAGATION',
      'VALIDATION',
      'STABLE_STATE'
    ];

    this.state = {
      currentPhase: null,
      iterations: 0,
      convergenceHistory: []
    };
  }

  /**
   * Point d'entrée principal : Transmutation universelle
   *
   * @param {Object} subject - Sujet à transmuter (pensée, émotion, relation, situation)
   * @param {Object} context - Contexte de transmutation
   * @param {Object} adapters - Implémentations concrètes des 7 phases
   * @returns {Object} Résultat de transmutation
   */
  async transmute(subject, context = {}, adapters = {}) {
    console.log('🔮 Ninth Principle: Initiating Universal Transmutation');
    console.log(`   Target Frequency: ${this.config.targetFrequency} Hz`);

    const result = {
      subject,
      context,
      principle: this.principle.name,
      timestamp: new Date().toISOString(),
      phases: {},
      outcome: null,
      convergence: null
    };

    try {
      // PHASE 1: INTENTION
      result.phases.intention = await this.runPhase1_Intention(
        subject,
        context,
        adapters.intention
      );

      // PHASE 2: IDENTIFICATION
      result.phases.identification = await this.runPhase2_Identification(
        subject,
        context,
        adapters.identify
      );

      // PHASE 3: EVALUATION
      result.phases.evaluation = await this.runPhase3_Evaluation(
        result.phases.identification.dissonances,
        context,
        adapters.evaluate
      );

      // PHASE 4: TRANSMUTATION
      result.phases.transmutation = await this.runPhase4_Transmutation(
        result.phases.evaluation.toTransmute,
        context,
        adapters.transmute
      );

      // PHASE 5: PROPAGATION
      result.phases.propagation = await this.runPhase5_Propagation(
        result.phases.transmutation.transmuted,
        context,
        adapters.propagate
      );

      // PHASE 6: VALIDATION
      result.phases.validation = await this.runPhase6_Validation(
        result.phases.propagation,
        context,
        adapters.validate
      );

      // PHASE 7: STABLE STATE
      result.phases.stableState = await this.runPhase7_StableState(
        result.phases.validation,
        context,
        adapters.stableState
      );

      // Calcul de convergence finale
      result.convergence = this.calculateConvergence(result.phases.validation);
      result.outcome = result.convergence.converged ? 'CONVERGED' : 'PARTIAL';

      console.log(`✨ Transmutation ${result.outcome}`);
      console.log(`   Convergence: ${result.convergence.score}%`);

      return result;

    } catch (error) {
      // Les violations de principe fondamental (conservation d'énergie)
      // doivent être propagées comme erreurs fatales
      if (error.name === 'EnergyConservationError') {
        throw error; // Propager l'erreur fatale
      }

      // Autres erreurs: retourner résultat FAILED
      console.error('❌ Transmutation failed:', error.message);
      result.outcome = 'FAILED';
      result.error = error.message;
      return result;
    }
  }

  /**
   * PHASE 1: INTENTION
   * "Ma présence je Suis"
   * Établir la conscience claire de l'intention de transmutation
   */
  async runPhase1_Intention(subject, context, adapter) {
    this.state.currentPhase = 'INTENTION';
    console.log('\n📍 Phase 1: INTENTION');

    if (!adapter) {
      throw new Error('Phase 1 adapter required: intention()');
    }

    const intention = await adapter(subject, context);

    if (!intention.established) {
      throw new Error('Intention not properly established');
    }

    console.log('   ✓ Intention established:', intention.declaration || 'Default');

    return {
      phase: 'INTENTION',
      established: true,
      intention,
      timestamp: Date.now()
    };
  }

  /**
   * PHASE 2: IDENTIFICATION
   * Identifier toutes les dissonances (dense energies)
   */
  async runPhase2_Identification(subject, context, adapter) {
    this.state.currentPhase = 'IDENTIFICATION';
    console.log('\n🔍 Phase 2: IDENTIFICATION');

    if (!adapter) {
      throw new Error('Phase 2 adapter required: identify()');
    }

    const dissonances = await adapter(subject, context);

    console.log(`   ✓ Identified ${dissonances.length} dissonance(s)`);
    dissonances.forEach((d, i) => {
      console.log(`      ${i + 1}. ${d.type} @ ${d.frequency}Hz (magnitude: ${d.magnitude})`);
    });

    return {
      phase: 'IDENTIFICATION',
      dissonances,
      count: dissonances.length,
      totalMagnitude: dissonances.reduce((sum, d) => sum + d.magnitude, 0)
    };
  }

  /**
   * PHASE 3: EVALUATION
   * "Cela me sert-il encore ?"
   * Évaluer si chaque dissonance sert encore ou peut être transmutée
   */
  async runPhase3_Evaluation(dissonances, context, adapter) {
    this.state.currentPhase = 'EVALUATION';
    console.log('\n⚖️  Phase 3: EVALUATION');

    if (!adapter) {
      throw new Error('Phase 3 adapter required: evaluate()');
    }

    const evaluations = [];
    const toTransmute = [];

    for (const dissonance of dissonances) {
      const evaluation = await adapter(dissonance, context);
      evaluations.push(evaluation);

      if (!evaluation.serves) {
        toTransmute.push(dissonance);
      }

      console.log(`   ${evaluation.serves ? '⏸️' : '✓'} ${dissonance.type}: ${evaluation.reasoning}`);
    }

    console.log(`   ✓ ${toTransmute.length}/${dissonances.length} ready for transmutation`);

    return {
      phase: 'EVALUATION',
      evaluations,
      toTransmute,
      toPreserve: dissonances.length - toTransmute.length
    };
  }

  /**
   * PHASE 4: TRANSMUTATION
   * "Je transmute"
   * Changer la fréquence tout en conservant l'énergie
   */
  async runPhase4_Transmutation(dissonances, context, adapter) {
    this.state.currentPhase = 'TRANSMUTATION';
    console.log('\n🔮 Phase 4: TRANSMUTATION');

    if (!adapter) {
      throw new Error('Phase 4 adapter required: transmute()');
    }

    const transmuted = [];
    let totalEnergyBefore = 0;
    let totalEnergyAfter = 0;

    for (const dissonance of dissonances) {
      const result = await adapter(dissonance, {
        targetFrequency: this.config.targetFrequency,
        context
      });

      transmuted.push(result);

      totalEnergyBefore += dissonance.magnitude;
      totalEnergyAfter += result.magnitude;

      console.log(`   ✓ ${dissonance.type}: ${dissonance.frequency}Hz → ${result.frequency}Hz`);
      console.log(`      ${result.transform.before} → ${result.transform.after}`);
    }

    // Vérifier conservation de l'énergie
    const energyConserved = Math.abs(totalEnergyBefore - totalEnergyAfter) < 0.01;

    console.log(`   ${energyConserved ? '✓' : '⚠️'} Energy conservation: ${energyConserved}`);

    // CRITICAL: Si conservation requise et violée, lancer erreur
    if (this.config.conserveEnergy && !energyConserved) {
      const error = new Error(
        `NINTH PRINCIPLE VIOLATION: Energy conservation violated! ` +
        `Before: ${totalEnergyBefore}, After: ${totalEnergyAfter}, ` +
        `Difference: ${Math.abs(totalEnergyBefore - totalEnergyAfter).toFixed(2)}`
      );
      error.name = 'EnergyConservationError';
      throw error;
    }

    return {
      phase: 'TRANSMUTATION',
      transmuted,
      energyBefore: totalEnergyBefore,
      energyAfter: totalEnergyAfter,
      energyConserved
    };
  }

  /**
   * PHASE 5: PROPAGATION
   * "Je propage sur tous les plans"
   * Propager la transmutation sur tous les dimensions d'existence
   */
  async runPhase5_Propagation(transmutations, context, adapter) {
    this.state.currentPhase = 'PROPAGATION';
    console.log('\n🌊 Phase 5: PROPAGATION');

    if (!adapter) {
      throw new Error('Phase 5 adapter required: propagate()');
    }

    const dimensions = context.dimensions || [
      'physical',
      'emotional',
      'mental',
      'spiritual'
    ];

    const propagations = [];

    for (const dimension of dimensions) {
      const result = await adapter(transmutations, dimension, context);
      propagations.push(result);
      console.log(`   ✓ Propagated to ${dimension} dimension`);
    }

    return {
      phase: 'PROPAGATION',
      propagations,
      dimensions: dimensions.length
    };
  }

  /**
   * PHASE 6: VALIDATION
   * "Merci, Merci, Merci"
   * Valider la convergence par la gratitude
   */
  async runPhase6_Validation(propagation, context, adapter) {
    this.state.currentPhase = 'VALIDATION';
    console.log('\n🙏 Phase 6: VALIDATION');

    if (!adapter) {
      throw new Error('Phase 6 adapter required: validate()');
    }

    const validation = await adapter(propagation, context);

    // Critères de validation
    const criteria = {
      recognition: validation.recognition >= 80,
      inevitability: validation.inevitability >= 80,
      coherence: validation.coherence >= 80,
      gratitude: validation.gratitudeLevel >= this.config.gratitudeThreshold
    };

    const allCriteriaMet = Object.values(criteria).every(v => v === true);

    console.log('   Validation Criteria:');
    console.log(`      Recognition: ${validation.recognition}% ${criteria.recognition ? '✓' : '✗'}`);
    console.log(`      Inevitability: ${validation.inevitability}% ${criteria.inevitability ? '✓' : '✗'}`);
    console.log(`      Coherence: ${validation.coherence}% ${criteria.coherence ? '✓' : '✗'}`);
    console.log(`      Gratitude Level: ${validation.gratitudeLevel} ${criteria.gratitude ? '✓' : '✗'}`);

    const outcome = allCriteriaMet ? 'CONVERGED' : 'PARTIAL';
    console.log(`   ${allCriteriaMet ? '✓' : '⚠️'} Outcome: ${outcome}`);

    return {
      phase: 'VALIDATION',
      validation,
      criteria,
      allCriteriaMet,
      outcome
    };
  }

  /**
   * PHASE 7: STABLE STATE
   * "Je suis lumineux"
   * Atteindre un état stable de haute fréquence
   */
  async runPhase7_StableState(validation, context, adapter) {
    this.state.currentPhase = 'STABLE_STATE';
    console.log('\n✨ Phase 7: STABLE STATE');

    if (!adapter) {
      throw new Error('Phase 7 adapter required: stableState()');
    }

    const stableState = await adapter(validation, context);

    console.log(`   State: ${stableState.state}`);
    console.log(`   Stability: ${stableState.stability}`);

    if (stableState.emitting) {
      console.log(`   ✓ Emitting at ${stableState.luminosity}Hz`);
    }

    return {
      phase: 'STABLE_STATE',
      state: stableState,
      converged: stableState.stability === 'STABLE'
    };
  }

  /**
   * Calculer le score de convergence global
   */
  calculateConvergence(validation) {
    const weights = {
      recognition: 0.25,
      inevitability: 0.25,
      coherence: 0.25,
      gratitude: 0.25
    };

    let score = 0;
    score += validation.validation.recognition * weights.recognition;
    score += validation.validation.inevitability * weights.inevitability;
    score += validation.validation.coherence * weights.coherence;
    score += (validation.validation.gratitudeLevel / this.config.gratitudeThreshold) * 100 * weights.gratitude;

    const converged = score >= this.config.convergenceThreshold;

    this.state.convergenceHistory.push({
      score,
      converged,
      timestamp: Date.now()
    });

    return {
      score: Math.round(score),
      converged,
      threshold: this.config.convergenceThreshold
    };
  }

  /**
   * Récupérer l'historique de convergence
   */
  getConvergenceHistory() {
    return this.state.convergenceHistory;
  }

  /**
   * Réinitialiser l'état
   */
  reset() {
    this.state = {
      currentPhase: null,
      iterations: 0,
      convergenceHistory: []
    };
  }

  /**
   * Obtenir le nombre de phases
   */
  getPhaseCount() {
    return this.phases.length;
  }

  /**
   * Obtenir les invariants (description des phases)
   */
  getInvariants() {
    const invariants = {};

    this.phases.forEach((phaseName, index) => {
      invariants[phaseName] = {
        phase: index + 1,
        name: phaseName,
        invariant: this._getPhaseInvariant(phaseName)
      };
    });

    return invariants;
  }

  /**
   * Obtenir l'invariant d'une phase spécifique
   * @private
   */
  _getPhaseInvariant(phaseName) {
    const invariantDescriptions = {
      INTENTION: "Consciousness must be established before transformation",
      IDENTIFICATION: "All dissonances must be recognized before evaluation",
      EVALUATION: "Growth potential vs energy drain determines transmutation",
      TRANSMUTATION: "Energy magnitude must be conserved, only frequency changes",
      PROPAGATION: "Transmutation must propagate across all dimensions",
      VALIDATION: "Gratitude validates convergence through 4 criteria",
      STABLE_STATE: "Final state must be stable at high frequency"
    };

    return invariantDescriptions[phaseName] || "Invariant not defined";
  }
}

export default NinthPrinciple;
