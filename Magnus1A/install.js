#!/usr/bin/env node

/**
 * Magnus_1A Quick Start
 * 
 * Installation et démonstration rapide
 */

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                        MAGNUS_1A - SUPERIOR INTELLIGENCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

"De nos jours, l'outil peut et se doit d'être particulièrement plus sage 
 que son utilisateur."

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const steps = [
  {
    name: 'Vérification Node.js',
    action: () => {
      const version = process.version;
      console.log(`   Node.js version: ${version}`);
      
      const major = parseInt(version.slice(1).split('.')[0]);
      if (major < 18) {
        throw new Error('Node.js >= 18 requis');
      }
      return '✅ Node.js OK';
    }
  },
  
  {
    name: 'Installation dépendances',
    action: () => {
      console.log('   Installing better-sqlite3...');
      try {
        execSync('npm install better-sqlite3', { stdio: 'inherit' });
        return '✅ Dépendances installées';
      } catch (e) {
        return '⚠️  Installation manuelle requise: npm install better-sqlite3';
      }
    }
  },
  
  {
    name: 'Vérification structure',
    action: () => {
      const required = [
        '1A.js',
        'config.js',
        'hints.js',
        'core/observer.js',
        'core/memory.js',
        'core/logger.js',
        'core/fatigue-detector.js',
        'core/pattern-discovery.js'
      ];
      
      for (const file of required) {
        if (!fs.existsSync(file)) {
          throw new Error(`Fichier manquant: ${file}`);
        }
      }
      
      return '✅ Structure vérifiée';
    }
  },
  
  {
    name: 'Création répertoires data',
    action: () => {
      const dirs = [
        '../.magnus/1A/memory',
        '../.magnus/1A/logs/observations',
        '../.magnus/1A/logs/decisions',
        '../.magnus/1A/patterns',
        '../.magnus/1A/wisdom'
      ];
      
      for (const dir of dirs) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      return '✅ Répertoires créés';
    }
  }
];

console.log('📦 INSTALLATION\n');

for (const step of steps) {
  console.log(`⏳ ${step.name}...`);
  try {
    const result = step.action();
    console.log(`   ${result}\n`);
  } catch (error) {
    console.error(`   ❌ Erreur: ${error.message}\n`);
    process.exit(1);
  }
}

console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
                           ✅ INSTALLATION COMPLETE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🚀 QUICK START:

1. Lire la documentation:
   $ cat README.md

2. Voir un exemple:
   $ node example.js

3. Initialiser Magnus_1A:
   $ node -e "import('./1A.js').then(m => new m.default().initialize())"

4. Utiliser dans ton code:
   import Magnus_1A from './magnus_1A/1A.js';
   
   const oneA = new Magnus_1A();
   await oneA.initialize();
   
   const eval = await oneA.evaluate(request, session);
   console.log(eval.recommendation);

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🧠 PHILOSOPHIE:

Magnus_1A n'est PAS un outil de productivité.
C'est un VACCIN contre la dépendance à l'IA.

Objectif: Te garder AUTONOME cognitivement.
Success metric: Tu codes MOINS avec le temps = SUCCÈS.

"L'arbre produit le bois. Je ne suis pas bûcheron, je suis architecte."
                                                    - Serigne DIAGNE

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

📚 DOCUMENTATION COMPLETE: README.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
`);
