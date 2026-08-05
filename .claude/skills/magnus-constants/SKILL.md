---
name: magnus-constants
description: "Source unique des constantes de convergence Magnus (piliers, seuils, version). Toute skill qui évalue ou gouverne la convergence (validation, orchestration, dispatch, session) doit référencer ce fichier plutôt que redéfinir ses propres valeurs. Consulter avant d'écrire un seuil, un nom de pilier, ou un numéro de version dans une autre skill."
---

Claude opère ici comme **gardien de la source unique**. Cette skill ne contient
aucune logique — uniquement les constantes que `converge-validation`,
`magnus-orchestration`, `kilo-integration` et `magnus-session` doivent
référencer, jamais redéfinir.

## Pourquoi ce fichier existe

Un audit du portefeuille (juillet 2026) a révélé cinq définitions divergentes
de la convergence coexistant dans l'écosystème : nombre de piliers (3 ou 4),
seuils (80/80/75 ou 85/85/80/80), version (13.2 ou 13.3). Un même code
généré aurait été jugé CONVERGED par une skill et PARTIAL par sa voisine.

Root cause : chaque skill Magnus avait dérivé indépendamment, par
sophistication successive, sans jamais se retracer jusqu'à sa source
constitutionnelle. Ce fichier ferme cette dérive.

## Source de vérité constitutionnelle

**`INTENT.md` — Pratique Méta-Développeur (régime Magnucratie)** est la
source de vérité vivante de toute la pratique (voir sa clause de gouvernance :
« Magnus est un instrument de mesure au service de cette pratique, pas son
maître »). Ce fichier `magnus-constants` est une **projection opérationnelle**
de cet INTENT — pas une autorité concurrente. En cas de divergence future,
INTENT.md prévaut et ce fichier doit être corrigé, jamais l'inverse.

---

## Les Trois Piliers (canonique)

INTENT.md définit exactement trois piliers — aucun quatrième :

| Pilier | Question |
|---|---|
| **Recognition** | La production est-elle clairement reconnaissable depuis l'intention déclarée ? |
| **Inevitability** | Est-ce la forme la plus naturelle et nécessaire, ou existe-t-il une voie plus simple, plus directe ? |
| **Coherence** | L'ensemble (langage, outils, critères, pratique) forme-t-il un tout conceptuellement unifié ? |

**Il n'existe pas de pilier "Elegance".** Un pilier historiquement proposé
dans certaines skills antérieures à cet audit — retiré car sans ancrage dans
INTENT.md et sans implémentation de référence dans le code (validator Python,
orchestrateur JS). S'il devient nécessaire, il doit d'abord être ajouté à
INTENT.md, puis implémenté et testé dans le code, avant d'être re-proposé ici.
Voir « Phase 2 — en attente » plus bas.

## Seuils (canonique)

```
minRecognitionScore   : 80
minInevitabilityScore : 80
minCoherenceScore     : 75
```

Ces valeurs ne sont pas fixées par INTENT.md lui-même (qui prescrit les trois
têtes, pas leurs seuils numériques) — elles sont un choix opérationnel aligné
sur l'implémentation réelle (`magnus-validator-py`, orchestrateur JS 13.2,
testé 11/11). Toute révision de seuil doit être proposée ici en premier, puis
propagée — jamais modifiée localement dans une skill consommatrice.

## Règle de verdict (canonique)

```
CONVERGED  : les 3 seuils atteints
PARTIAL    : Recognition OU Inevitability atteint (au moins un des deux)
FAILED     : ni Recognition ni Inevitability atteint
```

Note délibérée : Coherence seule ne peut jamais porter un verdict à elle
seule (règle dite « du singleton » — la cohérence d'un ensemble quasi vide
est triviale). Documentée et testée : voir
`determine-convergence-outcome.test.mjs`, cas « FAILED — Coherence seule ».

## Version canonique

**Magnus 13.2.** Le code exécuté et testé (orchestrateur JS, validator
Python) implémente 13.2. Toute référence à « 13.3 » dans une skill est une
anticipation non implémentée — à corriger vers 13.2, ou à faire aboutir
d'abord dans le code avant de réviser cette constante.

---

## Phase 2 — en attente (non actif)

Piste explicitement ouverte, non canonique tant que les deux conditions ne
sont pas remplies :

- [ ] Elegance ajouté à INTENT.md par Serigne (décision de gouvernance)
- [ ] Elegance implémenté et testé dans le code (validator Python + JS)

Tant que ces deux cases ne sont pas cochées, aucune skill ne doit mentionner
Elegance comme pilier actif.

---

## Utilisation par les autres skills

Une skill qui évalue ou gouverne la convergence doit contenir une ligne du
type :

```
Piliers, seuils et version : voir magnus-constants. Ne pas redéfinir ici.
```

plutôt que de recopier les valeurs. Si cette skill change, les skills
consommatrices n'ont rien à modifier.
