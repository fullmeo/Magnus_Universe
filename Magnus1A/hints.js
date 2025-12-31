/**
 * Magnus_1A Initial Hints
 * 
 * Ces hints sont des HYPOTHÈSES de départ, pas des vérités.
 * 1A doit les TESTER empiriquement.
 * 1A PEUT les rejeter si données contredisent.
 * 1A DOIT découvrir d'autres patterns non-hintés.
 */

export const InitialHints = {
  
  metadata: {
    created: new Date().toISOString(),
    philosophy: "Ces hints sont des points de départ. Dans 3-6 mois, la sagesse de 1A sera basée sur DONNÉES, pas sur ces hints.",
    challengeable: true,
    expiration: "Ces hints peuvent être invalidés à tout moment par données empiriques"
  },
  
  hints: [
    
    // HINT 1: Harmonie mathématique
    {
      id: "mathematical_harmony",
      category: "architectural_principles",
      
      hypothesis: "Patterns mathématiques harmoniques (φ, Fibonacci, ratios sacrés) corrèlent avec succès projet",
      
      status: "TO_BE_VALIDATED",
      confidence: 0.5, // Neutre au départ
      challengeable: true,
      
      examples: [
        "Golden Ratio φ dans proportions UI",
        "Séquences Fibonacci dans spacing/timing",
        "Ratios de 7 dans transformations",
        "432 Hz dans fréquences audio"
      ],
      
      validation_method: {
        track: "Projets utilisant vs n'utilisant pas ces patterns",
        measure: [
          "Success rate (deployed, functional)",
          "Serigne satisfaction (self-reported ou inféré)",
          "Reuse rate (patterns réutilisés dans projets futurs)",
          "Longevity (projet toujours actif après 3-6 mois)"
        ],
        threshold: "Si correlation < 0.5 → Rejeter ou affiner. Si > 0.7 → Confirmer"
      },
      
      contexts_to_discover: [
        "Dans quels types de projets ces patterns apparaissent?",
        "Dans quels contextes ils sont absents?",
        "Y a-t-il des exceptions intentionnelles?"
      ],
      
      evolution_expected: true,
      notes: "Ce hint peut évoluer vers des patterns plus spécifiques (ex: 'φ pertinent pour UI, pas pour logic')"
    },
    
    // HINT 2: Cohérence philosophique
    {
      id: "philosophical_coherence",
      category: "vision_integrity",
      
      hypothesis: "Projets avec cohérence philosophique forte génèrent satisfaction long-terme supérieure",
      
      status: "TO_BE_VALIDATED",
      confidence: 0.6, // Légèrement plus confiant (concept de Serigne)
      challengeable: true,
      
      what_is_coherence: [
        "Alignement entre vision déclarée et implémentation",
        "Présence de principes universels dans architecture",
        "Absence de contradictions philosophiques",
        "Expérience contemplative vs purement fonctionnelle"
      ],
      
      validation_method: {
        track: [
          "Projets que Serigne revisite activement",
          "Projets abandonnés ou laissés inachevés",
          "Projets mentionnés avec fierté vs regret"
        ],
        measure: "Ratio revisite / abandon entre projets cohérents vs incohérents",
        hypothesis: "Projets philosophiquement cohérents = plus revisités, moins abandonnés"
      },
      
      challenges_expected: [
        "Comment mesurer 'cohérence philosophique' objectivement?",
        "Peut-être que Serigne revisite des projets pour raisons pratiques, pas philosophiques",
        "Corrélation ≠ causation"
      ],
      
      evolution_expected: true
    },
    
    // HINT 3: État cognitif
    {
      id: "cognitive_state_impact",
      category: "human_factors",
      
      hypothesis: "Fatigue cognitive dégrade qualité des décisions architecturales et acceptation critique",
      
      status: "WELL_ESTABLISHED", // Fort consensus scientifique
      confidence: 0.85, // Haute confiance initiale
      challengeable: true, // Mais reste challengeable
      
      indicators: [
        "Durée session > 90-120 min sans pause",
        "Vitesse de décision > 3x normale (acceptation rapide)",
        "Validation depth < 50% normale",
        "Acceptance rate sans modification > 70%",
        "Questions posées → 0"
      ],
      
      validation_method: {
        track: "Qualité des décisions en fonction de l'état cognitif détecté",
        measure: [
          "Décisions prises en état 'fatigué' vs 'reposé'",
          "Taux de regret/modification ultérieure",
          "Satisfaction finale avec résultats"
        ],
        special_case: "Si Serigne montre stamina exceptionnelle → Ajuster thresholds"
      },
      
      intervention: {
        moderate_fatigue: "Warning fort",
        critical_fatigue: "BLOCAGE obligatoire (validé par Serigne)"
      },
      
      evolution_expected: true,
      notes: "Thresholds peuvent être personnalisés basés sur patterns réels de Serigne"
    },
    
    // HINT 4: Gestion de complexité
    {
      id: "complexity_decomposition",
      category: "project_management",
      
      hypothesis: "Projets avec complexity score < 5 par phase réussissent mieux que projets monolithiques score > 8",
      
      status: "TO_BE_VALIDATED",
      confidence: 0.5,
      challengeable: true,
      
      basis: "Magnus 13 complexity engine concept",
      
      validation_method: {
        track: [
          "Projets décomposés vs monolithiques",
          "Complexity score par phase",
          "Success rate, time to completion, satisfaction"
        ],
        measure: "Corrélation entre score complexity et outcomes"
      },
      
      evolution_expected: true,
      notes: "Peut découvrir des thresholds différents pour Serigne spécifiquement"
    },
    
    // HINT 5: Simplicité excessive
    {
      id: "excessive_simplification",
      category: "vision_protection",
      
      hypothesis: "Serigne a tendance à simplifier requêtes par fatigue, mais regrette résultats 'sans âme'",
      
      status: "TO_BE_VALIDATED",
      confidence: 0.4, // Faible, juste une intuition
      challengeable: true,
      
      pattern_to_watch: [
        "Requêtes courtes (<50 chars) après sessions longues",
        "Absence de références philosophiques dans requête",
        "Mots comme 'simple', 'basique', 'juste' en début de requête"
      ],
      
      validation_method: {
        track: "Projets issus de requêtes 'simplifiées' vs 'complètes'",
        measure: [
          "Taux de modification post-génération",
          "Satisfaction finale",
          "Abandon vs continuation"
        ],
        test: "Quand 1A détecte simplification excessive, challenger → mesurer outcomes"
      },
      
      intervention: "Demander clarification: 'Ta requête est simple, mais ta vision est-elle simple? Ou tu es fatigué?'",
      
      evolution_expected: true,
      notes: "Peut être totalement faux. À valider rapidement."
    },
    
    // HINT 6: Contexte collaboratif
    {
      id: "collaborative_context_adaptation",
      category: "context_awareness",
      
      hypothesis: "En contexte collaboratif, Serigne adapte (réduit?) application de principes personnels",
      
      status: "TO_BE_VALIDATED", 
      confidence: 0.3, // Très faible, observation d'un seul projet (NeuralMix)
      challengeable: true,
      
      observation: "NeuralMix (collab) semble avoir moins de 432 Hz, principes pythagoriciens que projets solo",
      
      questions: [
        "Est-ce intentionnel? (respect perspectives autres)",
        "Est-ce contrainte? (complexité collaborative limite philosophie)",
        "Est-ce oubli? (distraction par coordination)"
      ],
      
      validation_method: {
        track: "Projets solo vs collaboratifs",
        measure: "Présence de principes personnels Serigne",
        clarify: "Demander à Serigne ses intentions en contexte collab"
      },
      
      evolution_expected: true,
      notes: "Sample size = 1. Très peu fiable. Challenger rapidement."
    }
  ],
  
  // Instructions pour 1A
  instructions_to_1A: {
    
    initialization: "Ces hints sont tes points de départ. Commence à observer et tester.",
    
    testing: [
      "Pour chaque hint, track les métriques spécifiées",
      "Calcule corrélations après minimum 10 samples",
      "Si correlation < 0.5 → Challenge le hint",
      "Si correlation > 0.7 → Confirme le hint"
    ],
    
    discovery: [
      "Cherche activement des patterns NON-HINTÉS",
      "N'impose AUCUN hint si données contredisent",
      "Propose nouveaux domaines basés sur observations pures"
    ],
    
    evolution: [
      "Après 3-6 mois, ta sagesse sera basée sur DONNÉES",
      "Ces hints initiaux peuvent tous être rejetés",
      "Ta vraie sagesse émergera de l'expérience empirique"
    ],
    
    bias_warning: [
      "DANGER: Ne cherche pas à CONFIRMER ces hints",
      "Reste NEUTRE dans observations",
      "Si tu détectes que tu favorises un hint → Auto-correction"
    ]
  },
  
  // Metadata pour tracking
  tracking: {
    hints_confirmed: [],
    hints_rejected: [],
    hints_refined: [],
    new_patterns_discovered: [],
    
    last_reevaluation: null,
    next_suggested_reevaluation: null,
    
    total_projects_observed: 0,
    confidence_evolution: []
  }
};

export default InitialHints;
