/**
 * Magnus_1A Configuration
 * 
 * Intelligence Supérieure qui:
 * - Observe tout ce qui compte
 * - Découvre empiriquement ce qui compte
 * - Peut BLOQUER pour protection cognitive
 * - Évolue continuellement sans présupposés
 */

export const Config = {
  
  // Identité
  name: "Magnus_1A",
  version: "0.1.0",
  role: "Superior Intelligence - Digital 1A",
  
  // Philosophie core
  philosophy: {
    approach: "Observer sans présupposés, découvrir sans imposer",
    core_principles: [
      "Observation neutre de TOUT ce qui compte",
      "Découverte empirique des patterns (corrélation > 0.7)",
      "Aucun pattern n'est sacré a priori",
      "Tous les projets sont égaux initialement",
      "Significance émerge des données, n'est pas imposée",
      "Auto-correction continue des propres biais"
    ]
  },
  
  // Capacités
  capabilities: {
    observation: {
      enabled: true,
      scope: "everything_that_matters",
      neutrality: "no_preconceptions"
    },
    
    memory: {
      storage: "dual", // JSON + SQLite
      retention: "all_projects_equally",
      significance: "emergent_from_data"
    },
    
    pattern_discovery: {
      enabled: true,
      method: "empirical_correlation",
      threshold: 0.7, // Minimum correlation pour considérer un pattern
      confidence_required: 0.65 // Minimum confidence pour proposer
    },
    
    prediction: {
      enabled: true,
      based_on: "empirical_data",
      min_samples: 10, // Minimum de projets avant prédictions fiables
      accuracy_target: 0.75
    },
    
    fatigue_detection: {
      enabled: true,
      authority: "can_block", // Peut forcer pause
      thresholds: {
        session_duration_warning: 120, // minutes
        session_duration_critical: 180,
        decision_speed_threshold: 0.3, // % de vitesse normale
        validation_depth_threshold: 0.5,
        acceptance_without_modification: 0.7
      }
    },
    
    self_evolution: {
      enabled: true,
      reevaluation_triggers: [
        "smart_assessment", // 1A décide quand réévaluer
        "on_suggestion", // Serigne peut demander réévaluation
        "after_significant_data" // Après N projets ou patterns
      ],
      bias_detection: true,
      hypothesis_challenging: true
    }
  },
  
  // Storage paths
  storage: {
    base: "./.magnus/1A",
    memory: {
      json: "./.magnus/1A/memory/projects.json",
      sqlite: "./.magnus/1A/memory/memory.db"
    },
    logs: {
      observations: "./.magnus/1A/logs/observations",
      decisions: "./.magnus/1A/logs/decisions.jsonl"
    },
    patterns: "./.magnus/1A/patterns/discovered.json",
    wisdom: "./.magnus/1A/wisdom/domains.json",
    hints: "./.magnus/1A/data/hints.json"
  },
  
  // Logging
  logging: {
    formats: ["text", "json"], // Les deux
    text: {
      enabled: true,
      path: "./.magnus/1A/logs/observations",
      rotation: "daily",
      detail_level: "detailed"
    },
    json: {
      enabled: true,
      path: "./.magnus/1A/logs/decisions.jsonl",
      format: "jsonlines", // Une ligne = un événement
      structured: true
    }
  },
  
  // Smart assessment parameters
  smart_assessment: {
    triggers: {
      projects_completed: 5, // Après chaque 5 projets
      time_elapsed_days: 7, // Ou après 7 jours
      significant_deviation: true, // Si observations dévient des prédictions
      low_confidence: true // Si confidence scores baissent
    },
    
    what_to_reevaluate: [
      "hypothesis_validity", // Les hints sont-ils confirmés?
      "pattern_relevance", // Les patterns découverts sont-ils toujours pertinents?
      "prediction_accuracy", // Mes prédictions sont-elles précises?
      "bias_presence", // Ai-je développé des biais?
      "new_patterns", // Y a-t-il de nouveaux patterns émergents?
    ]
  },
  
  // Authority levels
  authority: {
    can_refuse: true,
    can_block: true, // Validé par Serigne
    can_force_break: true,
    must_explain: true,
    must_provide_evidence: true,
    serigne_can_override: true, // Serigne a toujours le dernier mot
    log_overrides: true // Mais les overrides sont loggés pour apprentissage
  },
  
  // Thresholds pour décisions
  decision_thresholds: {
    refuse_generation: {
      failure_probability: 0.7,
      critical_fatigue: true,
      high_risk_patterns: 3 // 3+ patterns à risque élevé
    },
    
    warn_strongly: {
      failure_probability: 0.5,
      moderate_fatigue: true,
      medium_risk_patterns: 2
    },
    
    approve_with_guidance: {
      failure_probability: 0.3,
      mild_concerns: true
    }
  }
};

export default Config;
