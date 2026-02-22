# Magnus 13.2 - Tests d'Intégration

## Vue d'ensemble

Cette suite de tests valide l'ensemble du workflow Magnus 13.2 Hermetic Edition, incluant les 8 principes hermétiques et le mécanisme de convergence (Si → Do).

## Fichiers de test

### `magnus-integration-final.test.js` ✅ RECOMMANDÉ

**Tests d'intégration complets pour Magnus 13.2**

- ✅ **10/10 tests passent**
- ✅ Utilise des requêtes string (format requis par Magnus 13.2 FIXED)
- ✅ Teste tous les scénarios critiques
- ✅ Configuration de test adaptée (seuils plus bas)

#### Scénarios testés

1. **Basic Analysis Workflow**
   - Analyse de requête complète
   - Rejet des requêtes vides
   - Validation des objets d'analyse

2. **Generation Workflow**
   - Démarrage de session de génération
   - Gestion de stratégie
   - Validation de phase

3. **Convergence Validation (8ème Principe)**
   - Convergence parfaite (Si → Do complet)
   - Convergence partielle (raffinement nécessaire)
   - Échec de convergence (réanalyse requise)

4. **Hermetic Principles (Principes 1-7)**
   - MENTALISM (Intention)
   - CORRESPONDENCE (Complexité)
   - VIBRATION (Patterns)
   - POLARITY (Spectres)
   - RHYTHM (Flux de travail)
   - CAUSALITY (Chaîne causale)
   - GENDER (Phases Masculine/Féminine)

5. **Error Handling**
   - Sessions invalides
   - Feedback null/undefined
   - Gestion d'erreurs gracieuse

6. **Configuration Management**
   - Validation des valeurs
   - Clamping des limites
   - Valeurs par défaut

### Autres fichiers

- `test-magnus-13-2-integration.js` - Version initiale (14/15 tests)
- `test-magnus-13-2-integration-simple.js` - Version simplifiée (incomplet)

## Commandes npm

```bash
# Exécuter les tests d'intégration (recommandé)
npm test
# ou
npm run test:integration

# Exécuter les tests unitaires
npm run test:unit

# Exécuter tous les tests
npm run test:all
```

## Configuration de test

Les tests utilisent une configuration adaptée pour faciliter les tests:

```javascript
{
  minClarityScore: 30,        // Seuil réduit pour tester plus de scénarios
  maxComplexityScore: 10,     // Tolérance maximale
  minConvergenceScore: 75,    // Convergence acceptable à 75%
  minInevitabilityScore: 75,  // Inevitabilité acceptable à 75%
  enableHermetic: true,       // Principes hermétiques activés
  enableConvergenceValidation: true,  // Validation 8ème principe
  logPhilosophyNotes: false,  // Logs réduits pour tests
  logConvergenceDetails: false // Logs réduits pour tests
}
```

## Structure des tests

### Format de requête

Magnus 13.2 FIXED **exige des strings** comme requêtes:

```javascript
// ✅ CORRECT
const request = 'Create a calculator with add, subtract, multiply, divide';

// ❌ INCORRECT (utilisé dans magnus-13-2-main.js original)
const request = {
  title: 'Calculator',
  description: 'Create a calculator...'
};
```

### Workflow typique

```javascript
// 1. Analyse (Phases 1-7)
const analysis = await magnus.analyze(request);

// 2. Vérifier si on peut procéder
if (!analysis.canProceed) {
  // Clarification ou décomposition nécessaire
  return;
}

// 3. Génération
const generation = await magnus.startGeneration(analysis);

// 4. Code généré (simulé dans les tests)
const generatedCode = `...`;

// 5. Feedback du développeur
const feedback = {
  text: 'Perfect, exactly what I wanted',
  recognition: 90,    // Score de reconnaissance (0-100)
  inevitability: 88   // Score d'inevitabilité (0-100)
};

// 6. Validation de convergence (Phase 8)
const convergence = await magnus.validateConvergence(
  generation.sessionId,
  generatedCode,
  feedback
);

// 7. Vérifier l'état de convergence
if (convergence.convergenceState === 'CONVERGED') {
  // ✅ Si → Do: Cycle fermé!
  console.log('Perfect convergence - code revealed, not created');
} else if (convergence.convergenceState === 'PARTIALLY_CONVERGED') {
  // 🔄 Raffinement nécessaire
  console.log('Almost there - iterate and refine');
} else {
  // ⚠️ Retour aux phases 1-7
  console.log('Failed - reanalyze the request');
}
```

## États de convergence

| État | Description | Action |
|------|-------------|--------|
| `CONVERGED` | Recognition ≥80% et Inevitability ≥80% | Enregistrer et apprendre |
| `PARTIALLY_CONVERGED` | Recognition ≥60% et Inevitability ≥60% | Raffiner et revalider |
| `NOT_CONVERGED` | Scores en dessous des seuils | Réanalyser (retour phases 1-7) |

## Métriques de convergence

### Recognition Score (Score de reconnaissance)
- Mesure si le code correspond à l'intention du développeur
- Basé sur le feedback textuel et/ou score numérique
- 95-100%: Parfait ("exactly", "perfect")
- 70-94%: Partiel ("close", "mostly")
- 0-69%: Faible ("not right", "wrong")

### Inevitability Score (Score d'inevitabilité)
- Mesure si le code était "révélé" vs "créé"
- Analyse les mots de révélation vs création
- Révélation: "obvious", "inevitable", "natural", "exactly"
- Création: "surprising", "creative", "unexpected", "clever"

### Coherence Score (Score de cohérence)
- Analyse la qualité du code généré
- Gestion d'erreurs (30 points)
- Logging (25 points)
- Documentation (25 points)
- Structure (20 points)

## Principes Hermétiques

### Phases 1-7 (Analyse et Génération)

1. **MENTALISM** - Surfacer l'intention
2. **CORRESPONDENCE** - Mesurer la correspondance
3. **VIBRATION** - Détecter les patterns
4. **POLARITY** - Analyser les spectres (clarté/ambiguïté, simplicité/complexité)
5. **RHYTHM** - Évaluer le rythme de travail
6. **CAUSALITY** - Préparer la chaîne causale
7. **GENDER** - Identifier la phase (Masculine: Analyse, Féminine: Synthèse)

### Phase 8 (Validation de Convergence)

**CONVERGENCE** - Le principe de la "note sensible" (Si → Do)

> "Comme la note Si en musique tonale qui DOIT résoudre vers Do,
> le code généré DOIT converger vers l'intention originale."

Si le code est vraiment révélé (et non créé), il sera:
- Reconnaissable immédiatement
- Inévitable et naturel
- La seule solution évidente

## Debugging

### Test échoue avec "Request must be a non-empty string"

✅ **Solution**: Utilisez une string, pas un objet:

```javascript
// ❌ FAUX
const request = { title: 'Test', description: 'Test' };

// ✅ CORRECT
const request = 'Test: Create a test utility function';
```

### Test échoué avec "clarity 0%"

Le `UnderstandingEngine` attend un objet mais reçoit une string. C'est un problème connu dans Magnus 13.2.

✅ **Workaround**: Utilisez des requêtes plus détaillées:

```javascript
// ❌ Trop court (clarity = 0%)
const request = 'Calculator';

// ✅ Descriptif (clarity > 0%)
const request = 'Create a calculator class with add, subtract, multiply, and divide methods for basic arithmetic operations';
```

### Session invalide

Si `validateConvergence()` retourne une erreur de session:

```javascript
{
  error: true,
  reason: 'SESSION_ANALYSIS_MISSING',
  sessionId: '...'
}
```

✅ **Vérifier**: Le `sessionId` provient bien d'un `startGeneration()` valide.

## Contribution

Pour ajouter de nouveaux tests:

1. Créer un nouveau `describe()` ou `it()` block
2. Utiliser le pattern Arrange-Act-Assert
3. Ajouter des console.log pour le suivi
4. Documenter le scénario testé

```javascript
it('should handle new scenario', async () => {
  // Arrange
  const request = '...';

  // Act
  const analysis = await magnus.analyze(request);

  // Assert
  assert.ok(analysis, 'Should return analysis');

  // Log
  console.log('  ✅ New scenario validated');
});
```

## Ressources

- [Magnus 13.2 Main](../magnus-13-2-main-FIXED.js) - Orchestrateur principal
- [Hermetic Foundation](../magnus-13-1-hermetic-foundation.js) - Principes 1-7
- [Convergence Principle](../magnus-13-2-convergence-principle.js) - Principe 8
- [Engines](../magnus-13-1-engines.js) - Understanding, Complexity, Revelation

---

**🎼 Si → Do - Every cycle must close**
**🔮 All 8 principles working in harmony**
**✨ Code revealed, not created**
