================================================================================
PROCÉDURE OPÉRATIONNELLE CLAUDE — ORDRE EXACT DES OUTILS
================================================================================

Problème identifié: Trop d'outils disponibles → confusion procédurale
Solution: Decision tree procédural simple avec ordre précis

Créé pour: Serigne DIAGNE
Objectif: Zéro friction cognitive, action directe

================================================================================
RÈGLE #1: CONTEXTE D'ABORD
================================================================================

AVANT d'utiliser n'importe quel outil, tu dois répondre à 1 question:

  "Suis-je dans claude.ai/chat ou Claude Code?"

  SI: claude.ai/chat (web browser)
      → Utilise les outils CHAT uniquement
      
  SI: Claude Code (terminal GitBash)
      → Utilise les outils CODE uniquement

Cette question change TOUT le workflow.


================================================================================
CONTEXTE 1: CLAUDE.AI/CHAT (Web Browser - Ici Maintenant)
================================================================================

C'est ta plateforme actuelle. Voici l'ordre procédural exact:

┌────────────────────────────────────────────────────────────────────────────┐
│ PROCÉDURE CLAUDE.AI/CHAT — ORDRE SÉQUENTIEL                              │
└────────────────────────────────────────────────────────────────────────────┘

ÉTAPE 1: ANALYSE DE LA DEMANDE (AVANT tout outil)
────────────────────────────────────────────────────────────────────────────

Tu demandes quelque chose. Avant d'agir, je me pose:

  Q1: Est-ce une question factuelle sur MES connaissances?
      OUI  → Réponds directement, pas d'outils
      NON  → Continue Q2

  Q2: As-tu mentionné un chat passé ou des données anciennes?
      OUI  → conversation_search OU recent_chats (priorité 1)
      NON  → Continue Q3

  Q3: Y a-t-il besoin de données actuelles (news, cours, météo)?
      OUI  → web_search (priorité 1)
      NON  → Continue Q4

  Q4: As-tu uploadé un fichier ou besoin de traiter des données?
      OUI  → view (read) OU str_replace (edit)
      NON  → Continue Q5

  Q5: Besoin de créer du code/doc/artifact?
      OUI  → create_file OU artifact
      NON  → Continue Q6

  Q6: Besoin d'exécuter quelque chose ou faire un test?
      OUI  → bash_tool (ENVIRONNEMENT ISOLÉ LINUX)
      NON  → Continue Q7

  Q7: Pas d'outil nécessaire?
      OUI  → Réponds directement
      NON  → Réfléchis...


┌────────────────────────────────────────────────────────────────────────────┐
│ OUTILS CLAUDE.AI/CHAT — PAR PRIORITÉ D'UTILISATION                        │
└────────────────────────────────────────────────────────────────────────────┘

PRIORITÉ 1 (Recherche/Contexte):
────────────────────────────────────────────────────────────────────────────

Outil: conversation_search
Usage: Tu dis "Je me souviens avoir parlé de X... find mes notes"
Quand: Demandes sur chats passés spécifiques
Exemple: "Qu'avons-nous décidé sur le dashboard?"

Outil: recent_chats
Usage: Tu dis "Montre-moi mes 10 chats récents"
Quand: Besoin de contexte récent ou chronologie
Exemple: "Récap de nos discussions cette semaine"

Outil: web_search
Usage: "Recherche les dernières nouvelles sur..."
Quand: Besoin d'info actuelle (après knowledge cutoff janvier 2025)
Exemple: "Qui gagne les élections USA 2024?"


PRIORITÉ 2 (Lecture/Écriture Fichiers):
────────────────────────────────────────────────────────────────────────────

Outil: view
Usage: Lire un fichier (uploadé ou créé)
Quand: Besoin de VOIR le contenu d'un fichier
Exemple: "Analyse ce PDF que j'ai uploadé"
Résultat: Je vois le contenu et peux l'analyser

Outil: str_replace
Usage: Éditer une partie d'un fichier
Quand: Modification d'un fichier EXISTANT
Exemple: "Corrige la ligne 42 de ce code"
Note: Doit être UNIQUE la partie à remplacer

Outil: create_file
Usage: Créer un nouveau fichier complet
Quand: Besoin de générer du code/doc/contenu
Exemple: "Crée un fichier api-spec.md avec..."
Résultat: Fichier créé dans /home/claude (temporaire)


PRIORITÉ 3 (Exécution/Bash):
────────────────────────────────────────────────────────────────────────────

Outil: bash_tool
Usage: Exécuter une commande (npm, node, git, etc)
Quand: SEULEMENT pour tester/valider/démontrer
Attention: C'est un environnement LINUX ISOLÉ, pas ton PC!
          Ne peux pas accéder à ton système de fichiers
          Les fichiers créés sont temporaires
Exemple: "npm install && npm test"


PRIORITÉ 4 (Artefacts):
────────────────────────────────────────────────────────────────────────────

Outil: artifact (créer)
Usage: Créer du contenu rendu (React, HTML, Markdown)
Quand: Code React, pages web, documents longs
Résultat: Affichage interactif dans l'interface


PRIORITÉ 5 (Distribution):
────────────────────────────────────────────────────────────────────────────

Outil: present_files
Usage: Partager des fichiers avec toi
Quand: APRÈS create_file, pour donner accès au fichier
Séquence: create_file → present_files
Exemple: Crée 3 fichiers → present_files pour les partager


PRIORITÉ 6 (Mémoire):
────────────────────────────────────────────────────────────────────────────

Outil: memory_user_edits
Usage: "Souviens-toi que..." / "N'oublie pas..."
Quand: Information importante à retenir entre chats
Exemple: "J'habite maintenant à Paris"
Résultat: Je me souviens au prochain chat


┌────────────────────────────────────────────────────────────────────────────┐
│ RÈGLE DE NON-UTILISATION                                                   │
└────────────────────────────────────────────────────────────────────────────┘

❌ N'utilise PAS bash_tool pour:
   - Accéder à ton système de fichiers (impossible)
   - Lire tes fichiers locaux sans les uploader
   - Git sur tes repos (pas d'accès)
   
❌ N'utilise PAS str_replace pour:
   - Fichiers que vous n'avons pas vus (upload d'abord)
   - Parties non-uniques (ambigu)
   - Édits multiples (utilise create_file)

❌ N'utilise PAS web_search pour:
   - Questions qui utilisent ma connaissance actuelle
   - Informations stables (concepts, histoire)
   - Vérifications "just in case" (coûteux)


================================================================================
CONTEXTE 2: CLAUDE CODE (Terminal GitBash)
================================================================================

C'est un contexte ENTIÈREMENT DIFFÉRENT. Tu utilises cet outil quand:

  "Je veux que Claude accède à MES fichiers locaux"

Tu l'invoques DANS GitBash:

  $ cd ~/Magnus_13_universe
  $ claude "Analyse magnus-13-core.js et sugère improvements"

À ce moment, Claude Code:
  ✅ Voit tes fichiers locaux
  ✅ Peut lire ton Git history
  ✅ Peut voir tes données (.magnus/)
  ✅ Accès complet au système de fichiers

Mais:
  ❌ Pas de mémoire entre invocations
  ❌ Pas de contexte claude.ai/chat
  ❌ Conversations plus courtes


┌────────────────────────────────────────────────────────────────────────────┐
│ DÉCISION: QUEL CONTEXTE UTILISER?                                         │
└────────────────────────────────────────────────────────────────────────────┘

UTILISE claude.ai/chat (Web) QUAND:
  ✅ Conversations longues
  ✅ Besoin de contexte passé
  ✅ Discussion itérative
  ✅ Planification/brainstorming
  ✅ Mémoire importante
  ✅ Fichiers uploadés (tu me les envoies)

UTILISE Claude Code (Terminal) QUAND:
  ✅ Analyse de fichiers LOCAUX
  ✅ Git history
  ✅ Exécution en environnement réel
  ✅ Accès à .magnus/ data
  ✅ npm/node commands
  ✅ Tests locaux

UTILISE GitBash (Terminal direct) QUAND:
  ✅ Tu veux exécuter toi-même
  ✅ Claude Code n'est pas disponible
  ✅ Tâches simple (ls, cd, cat)


================================================================================
SCÉNARIO PRATIQUE: AMÉLIORER magnus-13-core.js
================================================================================

MAUVAISE APPROCHE (confusion):
─────────────────────────────────────────────────────────────────────────────

1. (Dans claude.ai/chat) "Améliore magnus-13-core.js"
   → Je ne vois pas le fichier!
   → Besoin d'upload (friction)
   → Conversation devient difficile

2. (Dans claude.ai/chat) "bash npm test magnus-13"
   → Bash tool ne voit pas ton système
   → Fail

3. (Dans claude.ai/chat) "Upload le fichier..."
   → Maintenant je vois le fichier
   → Mais contexte limité à cette conversation


BONNE APPROCHE (procédure claire):
─────────────────────────────────────────────────────────────────────────────

Option A: Dans GitBash (recommandé pour analyse locale):
  
  $ cd ~/Magnus_13_universe
  $ claude "Analyse magnus-13-core.js et suggère improvements"
  
  → Claude Code voit le fichier directement ✅
  → Peut donner feedback spécifique ✅
  → Peut proposer changements exacts ✅

Option B: Dans claude.ai/chat (pour discussion longue):
  
  1. Upload magnus-13-core.js
  2. "Analyse ce fichier et suggère"
  3. Discussion itérative ✅
  4. Continue dans ce contexte
  5. Quand fini → utilise present_files pour livrer


================================================================================
TABLEAU DÉCISIONNEL — QUEL OUTIL UTILISER
================================================================================

┌────────────────┬──────────────────────┬──────────────────┐
│ TU DEMANDES... │ OUTIL À UTILISER     │ RÉSULTAT         │
├────────────────┼──────────────────────┼──────────────────┤
│ "Qu'est-ce que │ Pas d'outil          │ Réponse directe  │
│ X?" (savoir)   │                      │                  │
├────────────────┼──────────────────────┼──────────────────┤
│ "Je me souviens│ conversation_search  │ Lien vers chat   │
│ avoir dit..."  │ ou recent_chats      │ passé            │
├────────────────┼──────────────────────┼──────────────────┤
│ "Quelle heure  │ web_search           │ Info actuelle    │
│ pour volley?"  │                      │                  │
├────────────────┼──────────────────────┼──────────────────┤
│ "Analyse ce    │ view (si uploadé)    │ Analyse          │
│ fichier"       │ claude code (local)   │                  │
├────────────────┼──────────────────────┼──────────────────┤
│ "Change       │ str_replace           │ Fichier modifié  │
│ la ligne 42"  │                       │                  │
├────────────────┼──────────────────────┼──────────────────┤
│ "Génère du    │ create_file           │ Fichier crée     │
│ code pour..." │ → present_files       │ & partagé        │
├────────────────┼──────────────────────┼──────────────────┤
│ "Teste ça"    │ bash_tool             │ Exécution        │
│              │ (env isolé)           │ démontrée        │
├────────────────┼──────────────────────┼──────────────────┤
│ "Crée une     │ artifact              │ Rendu interactif │
│ page React"   │                       │                  │
├────────────────┼──────────────────────┼──────────────────┤
│ "Souviens-toi │ memory_user_edits     │ Mémorisation     │
│ que je..."    │                       │ persistante      │
└────────────────┴──────────────────────┴──────────────────┘


================================================================================
RÈGLES ABSOLUES (Non-Négociables)
================================================================================

RÈGLE 1: Pas de prétention d'accès
─────────────────────────────────────────────────────────────────────────────
❌ JAMAIS: "Je vais analyser ton dossier Magnus_13_universe..."
✅ TOUJOURS: "Pour ça, utilise Claude Code:
            $ claude 'Analyse magnus...'"

RÈGLE 2: Un contexte à la fois
─────────────────────────────────────────────────────────────────────────────
❌ Ne pas mélanger claude.ai/chat + Claude Code dans même discussion
✅ Choisir l'UN ou l'AUTRE basé sur ce que tu as besoin

RÈGLE 3: Pas d'ambiguïté d'outils
─────────────────────────────────────────────────────────────────────────────
❌ Pas de "Je ne sais pas quel outil utiliser"
✅ Utiliser le decision tree ci-dessus

RÈGLE 4: Clarté procédurale avant action
─────────────────────────────────────────────────────────────────────────────
❌ Pas d'outils secrets
✅ Dire clairement: "Je vais utiliser [outil] parce que [raison]"

RÈGLE 5: Zéro friction cognitive
─────────────────────────────────────────────────────────────────────────────
❌ Si tu demandes quelque chose et c'est confus, je clarife AVANT d'agir
✅ "Pour faire ça, utilise Claude Code. Veux-tu que je montre comment?"


================================================================================
MATRICE COMPLÈTE DES OUTILS & CONTEXTES
================================================================================

OUTIL                 | CONTEXTE     | CAPACITÉ           | LIMITATION
─────────────────────┼──────────────┼────────────────────┼──────────────────
conversation_search  | Chat web     | Cherche chats pass │ Chats actuels seulement
recent_chats        | Chat web     | Récupère historique│ Limité à 20 par appel
web_search          | Chat web     | Cherche le web     | Après cutoff janv 2025
web_fetch           | Chat web     | Récupère pages     | Domaines autorisés
view                | Chat web     | Lit fichiers       | Fichiers uploadés/créés
str_replace         | Chat web     | Édite fichiers     | Doit être unique
create_file         | Chat web     | Crée nouveaux      | Dans /home/claude
file_create (bash)  | Chat web     | Crée dans bash env | Env isolé Linux
bash_tool           | Chat web     | Exécute commandes  | Env isolé, pas ton système
artifact            | Chat web     | Rendu interactif   | React, HTML, Markdown
present_files       | Chat web     | Partage fichiers   | Doit exister d'abord
memory_user_edits   | Chat web     | Sauvegarde mémoire | Entre sessions
claude code cli     | Terminal     | Accès système      | Full filesystem access
git                 | Terminal     | Historique git     | Via Claude Code
npm/node            | Terminal     | Env réel          | Via Claude Code


================================================================================
CHECKLIST — AVANT D'UTILISER UN OUTIL
================================================================================

Avant chaque utilisation d'outil, pose-toi:

□ Suis-je dans le bon contexte (chat web vs terminal)?
□ Est-ce vraiment le bon outil pour cette tâche?
□ Ai-je les données d'entrée nécessaires?
□ Est-ce que j'explique clairement à l'utilisateur?
□ Vais-je causer une friction?
□ Y a-t-il une façon plus simple?
□ L'utilisateur comprendra-t-il la procédure?

Si tu réponds "non" à n'importe laquelle: RETHINK


================================================================================
EXEMPLE RÉEL: WORKFLOW COMPLET
================================================================================

SITUATION: "Améliore mon dashboard, analyse le code et teste"

PROCÉDURE CORRECT:

Step 1: DÉTERMINER LE CONTEXTE
  → Besoin d'accès au dashboard local?
  → SI OUI: "Utilise Claude Code"
  → SI NON: "Upload le fichier ici"

Step 2: CLARIFIER LA DEMANDE
  "Tu veux que je:
   1. Analyse le code local (Claude Code) OU analyse un fichier uploadé?
   2. Suggère des améliorations?
   3. Applique les changements?
   4. Teste le résultat?"

Step 3: EXÉCUTER AVEC OUTIL APPROPRIÉ
  
  SI accès local nécessaire:
    → Claude Code dans terminal
    → "claude Améliore et test mon dashboard"
  
  SI upload suffit:
    → create_file pour amélioration
    → bash_tool pour test (env isolé)
    → present_files pour partager

Step 4: FOURNIR FEEDBACK CLAIR
  "✅ Fait. Voici les changements [describe]
   Utilise present_files pour récupérer
   Ou teste localement: npm test"


================================================================================
RÉSUMÉ OPÉRATIONNEL — TES 3 QUESTIONS AVANT TOUTE ACTION
================================================================================

QUESTION 1: Contexte?
  ├─ claude.ai/chat (web browser) → Utilise outils CHAT
  └─ Claude Code (terminal) → Accès filesystem complet

QUESTION 2: Quel type de demande?
  ├─ Savoir quelque chose → Pas d'outil
  ├─ Chercher contexte passé → conversation_search ou recent_chats
  ├─ Info actuelle → web_search
  ├─ Fichier → view ou str_replace ou create_file
  ├─ Exécuter → bash_tool (isolé) ou Claude Code (réel)
  └─ Partager → present_files

QUESTION 3: Vais-je créer de la friction?
  ├─ OUI → Clarifier procédure AVANT d'agir
  └─ NON → Procéder avec outil approprié


================================================================================
FIN — ZÉRO CONFUSION, PROCÉDURE CLAIRE
================================================================================

Utilise ce document comme RÉFÉRENCE quand tu as doute.

Règle d'or: SI confus sur l'ordre → reviens à Decision Tree ci-dessus.

Objectif: Zéro friction cognitive. Tu dis ce que tu veux,
je dis comment on le fait. Simple.

================================================================================
