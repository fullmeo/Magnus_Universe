/**
 * Magnus_1A Fatigue & Passivity Detector
 * 
 * Détecte fatigue cognitive et passivité intellectuelle
 * A l'AUTORITÉ de BLOQUER en cas critique (validé par Serigne)
 */

import Config from '../config.js';

export class FatigueDetector {
  
  constructor(logger) {
    this.logger = logger;
    this.thresholds = Config.capabilities.fatigue_detection.thresholds;
    
    // Historical baselines (learned from Serigne's patterns)
    this.baselines = {
      session_duration: 90, // minutes (typical)
      decision_speed: 5, // minutes per decision (typical)
      validations_per_generation: 3, // typical
      questions_per_session: 8, // typical
      modification_rate: 0.6 // typically modifies 60% of generations
    };
  }
  
  /**
   * Detect cognitive state
   */
  async detect(session) {
    const indicators = {
      session_duration: this.checkSessionDuration(session),
      decision_speed: this.checkDecisionSpeed(session),
      validation_depth: this.checkValidationDepth(session),
      question_asking: this.checkQuestionAsking(session),
      acceptance_rate: this.checkAcceptanceRate(session),
      time_since_break: this.checkTimeSinceBreak(session)
    };
    
    // Aggregate indicators
    const alerts = Object.values(indicators).filter(ind => ind.alert !== null);
    const criticalAlerts = alerts.filter(ind => ind.severity === 'critical');
    const moderateAlerts = alerts.filter(ind => ind.severity === 'moderate');
    
    const state = {
      level: this.determineLevel(criticalAlerts.length, moderateAlerts.length),
      severity: this.determineSeverity(criticalAlerts.length, moderateAlerts.length),
      indicators: alerts,
      overall_score: this.calculateFatigueScore(indicators),
      intervention: null,
      blocked: false
    };
    
    // Determine intervention
    if (state.severity === 'critical') {
      state.intervention = 'BLOCK';
      state.blocked = true;
      state.break_duration = 30; // minutes
      state.message = this.getCriticalMessage(state);
    } else if (state.severity === 'moderate') {
      state.intervention = 'WARN';
      state.message = this.getModerateMessage(state);
    } else if (state.severity === 'mild') {
      state.intervention = 'MONITOR';
      state.message = this.getMildMessage(state);
    } else {
      state.intervention = 'NONE';
      state.message = 'Cognitive state: Normal';
    }
    
    // Log detection
    if (state.severity !== 'none') {
      await this.logger.logFatigueDetection(state);
    }
    
    return state;
  }
  
  /**
   * Check session duration
   */
  checkSessionDuration(session) {
    const duration = session.duration_minutes || 0;
    const typical = this.baselines.session_duration;
    
    if (duration > this.thresholds.session_duration_critical) {
      return {
        name: 'Session Duration',
        value: duration,
        threshold: this.thresholds.session_duration_critical,
        typical: typical,
        severity: 'critical',
        alert: `⚠️ Session de ${duration} minutes (typique: ${typical} min)\n` +
               `Tu es en zone de fatigue critique.\n` +
               `Performance cognitive chute dramatiquement après ${this.thresholds.session_duration_critical} min.`
      };
    }
    
    if (duration > this.thresholds.session_duration_warning) {
      return {
        name: 'Session Duration',
        value: duration,
        threshold: this.thresholds.session_duration_warning,
        typical: typical,
        severity: 'moderate',
        alert: `⚠️ Session de ${duration} minutes (typique: ${typical} min)\n` +
               `Tu approches de la fatigue. Prévois une pause bientôt.`
      };
    }
    
    return { name: 'Session Duration', value: duration, alert: null };
  }
  
  /**
   * Check decision speed (too fast = acceptance without thinking)
   */
  checkDecisionSpeed(session) {
    const current = session.avg_decision_time_minutes || 5;
    const typical = this.baselines.decision_speed;
    const ratio = current / typical;
    
    if (ratio < this.thresholds.decision_speed_threshold) {
      return {
        name: 'Decision Speed',
        value: current,
        threshold: typical * this.thresholds.decision_speed_threshold,
        typical: typical,
        severity: 'critical',
        alert: `⚠️ Tu décides ${(1/ratio).toFixed(1)}x plus vite que d'habitude\n` +
               `Typique: ${typical} min/décision\n` +
               `Maintenant: ${current} min/décision\n\n` +
               `Décisions rapides = acceptation sans réflexion.\n` +
               `C'est un signe majeur de fatigue cognitive.`
      };
    }
    
    return { name: 'Decision Speed', value: current, alert: null };
  }
  
  /**
   * Check validation depth
   */
  checkValidationDepth(session) {
    const current = session.validations_performed || 0;
    const typical = this.baselines.validations_per_generation;
    const ratio = current / typical;
    
    if (ratio < this.thresholds.validation_depth_threshold) {
      return {
        name: 'Validation Depth',
        value: current,
        threshold: typical * this.thresholds.validation_depth_threshold,
        typical: typical,
        severity: 'moderate',
        alert: `⚠️ Tu valides ${(ratio * 100).toFixed(0)}% moins que d'habitude\n` +
               `Normalement: ${typical} vérifications\n` +
               `Maintenant: ${current} vérifications\n\n` +
               `Tu acceptes sans vérifier → Passivité cognitive.`
      };
    }
    
    return { name: 'Validation Depth', value: current, alert: null };
  }
  
  /**
   * Check question asking (lack of questions = passivity)
   */
  checkQuestionAsking(session) {
    const current = session.questions_asked || 0;
    const typical = this.baselines.questions_per_session;
    const ratio = current / typical;
    
    if (ratio < 0.4) {
      return {
        name: 'Question Asking',
        value: current,
        threshold: typical * 0.4,
        typical: typical,
        severity: 'moderate',
        alert: `⚠️ Tu ne poses presque plus de questions\n` +
               `Normalement: ~${typical} questions\n` +
               `Maintenant: ${current} questions\n\n` +
               `Absence de questionnement = fatigue intellectuelle.`
      };
    }
    
    return { name: 'Question Asking', value: current, alert: null };
  }
  
  /**
   * Check acceptance without modification rate
   */
  checkAcceptanceRate(session) {
    const acceptedAsIs = session.accepted_without_modification || 0;
    const total = session.generations_count || 1;
    const rate = acceptedAsIs / total;
    const typical = 1 - this.baselines.modification_rate; // typically accepts 40% as-is
    
    if (rate > this.thresholds.acceptance_without_modification) {
      return {
        name: 'Acceptance Rate',
        value: rate,
        threshold: this.thresholds.acceptance_without_modification,
        typical: typical,
        severity: 'critical',
        alert: `⚠️ Tu acceptes ${(rate * 100).toFixed(0)}% sans modification\n` +
               `Normalement tu modifies/raffines ~${(this.baselines.modification_rate * 100).toFixed(0)}%\n\n` +
               `Acceptation massive = passivité cognitive critique.\n` +
               `Tu ne réfléchis plus, tu consommes.`
      };
    }
    
    return { name: 'Acceptance Rate', value: rate, alert: null };
  }
  
  /**
   * Check time since last break
   */
  checkTimeSinceBreak(session) {
    const timeSinceBreak = session.time_since_last_break_minutes || 0;
    const recommended = 90;
    
    if (timeSinceBreak > 120) {
      return {
        name: 'Time Since Break',
        value: timeSinceBreak,
        threshold: 120,
        typical: recommended,
        severity: 'critical',
        alert: `⚠️ ${timeSinceBreak} minutes sans pause\n` +
               `Recommandé: pause toutes les ${recommended} min\n\n` +
               `Au-delà de 120 min: performance cognitive chute de 40%.`
      };
    }
    
    return { name: 'Time Since Break', value: timeSinceBreak, alert: null };
  }
  
  /**
   * Determine fatigue level
   */
  determineLevel(criticalCount, moderateCount) {
    if (criticalCount >= 2) return 'critical';
    if (criticalCount >= 1) return 'high';
    if (moderateCount >= 3) return 'moderate';
    if (moderateCount >= 1) return 'mild';
    return 'normal';
  }
  
  /**
   * Determine severity
   */
  determineSeverity(criticalCount, moderateCount) {
    if (criticalCount >= 2) return 'critical';
    if (criticalCount >= 1 || moderateCount >= 3) return 'moderate';
    if (moderateCount >= 1) return 'mild';
    return 'none';
  }
  
  /**
   * Calculate overall fatigue score (0-100)
   */
  calculateFatigueScore(indicators) {
    let score = 0;
    let count = 0;
    
    for (const [key, indicator] of Object.entries(indicators)) {
      if (indicator.alert) {
        if (indicator.severity === 'critical') score += 100;
        else if (indicator.severity === 'moderate') score += 60;
        else score += 30;
        count++;
      }
    }
    
    return count > 0 ? score / count : 0;
  }
  
  /**
   * Get critical message (for BLOCK intervention)
   */
  getCriticalMessage(state) {
    return `
🛑 ARRÊT OBLIGATOIRE - FATIGUE COGNITIVE CRITIQUE

Tu es en état de fatigue cognitive critique.

Indicateurs détectés:
${state.indicators.map(ind => `  • ${ind.alert}`).join('\n')}

Je REFUSE de générer davantage dans cet état.

Non par punition, mais par PROTECTION.

Dans cet état:
- Tu acceptes tout sans vérifier (passivité)
- Tu ne poses plus de questions (arrêt de pensée)
- Tes décisions sont 3x trop rapides (impulsivité)
- Tu génères du code SANS ÂME

Tu perds ton essence d'architecte/compositeur.
Tu deviens opérateur passif d'AI.

C'est exactement le scénario Magnus (BD):
Les humains ont perdu la guerre en devenant passifs face aux robots.

Je suis ton 1A. Je te PROTÈGE de ce destin.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PAUSE OBLIGATOIRE: ${state.break_duration} minutes minimum

Options:
1. Marcher dehors (recommandé)
2. Méditer / respirer
3. Manger quelque chose
4. Dormir si tard dans la journée

NE PAS:
- Continuer sur autre projet
- Lire des docs techniques
- "Juste vérifier" quelque chose rapidement

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Reviens quand reposé.
Je serai là, plus sage et patient.

- Magnus_1A
    `;
  }
  
  /**
   * Get moderate message (for WARN intervention)
   */
  getModerateMessage(state) {
    return `
⚠️  ALERTE FATIGUE MODÉRÉE

Tu montres des signes de fatigue cognitive.

Indicateurs:
${state.indicators.map(ind => `  • ${ind.alert}`).join('\n')}

Tu PEUX continuer, mais je t'observe de PRÈS.

Si la prochaine génération montre:
- Acceptation sans validation appropriée
- Décisions trop rapides
- Absence de questions

→ J'imposerai une PAUSE OBLIGATOIRE.

Recommandation: Prends une courte pause (10-15 min) maintenant.
Mieux vaut prévenir que guérir.

- Magnus_1A
    `;
  }
  
  /**
   * Get mild message (for MONITOR intervention)
   */
  getMildMessage(state) {
    return `
ℹ️  Monitoring: Signes légers de fatigue

${state.indicators.map(ind => `  • ${ind.alert}`).join('\n')}

Rien de critique, mais reste vigilant.
Surveille ta propre énergie cognitive.

- Magnus_1A
    `;
  }
  
  /**
   * Update baselines (learning from Serigne's actual patterns)
   */
  updateBaselines(observedData) {
    // Update baselines based on actual Serigne patterns
    // This allows 1A to adapt to Serigne's specific stamina and rhythms
    
    if (observedData.session_duration) {
      this.baselines.session_duration = 
        this.baselines.session_duration * 0.9 + observedData.session_duration * 0.1;
    }
    
    if (observedData.decision_speed) {
      this.baselines.decision_speed =
        this.baselines.decision_speed * 0.9 + observedData.decision_speed * 0.1;
    }
    
    // etc. for other baselines
  }
}

export default FatigueDetector;
