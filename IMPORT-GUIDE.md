# 🌌 Magnus Universe - Import Guide

**Comment importer CloudZero Proxy et les projets générés n'importe où dans Magnus Universe**

---

## 📌 Les 5 Patterns d'Importation

### Pattern 1: Direct Import (Recommandé pour la simplicité)

**Quand l'utiliser**: Vous connaissez le chemin exact
**Avantages**: Rapide, explicite, pas de dépendances supplémentaires

```javascript
// Depuis n'importe où dans magnus/ ou generated/
import { cloud } from '../generated/cloudzero-proxy/cloudzero-proxy.js';

// Utilisation
await cloud.payment.charge(1000, 'eur');
await cloud.email.send('user@example.com', 'Subject', '<h1>Body</h1>');
```

**Exemples de chemins**:
- `magnus/magnus-13.js` → `../generated/cloudzero-proxy/cloudzero-proxy.js`
- `magnus/services/auth.js` → `../../generated/cloudzero-proxy/cloudzero-proxy.js`
- `generated/cloudzero-proxy/examples/test.js` → `../../cloudzero-proxy.js`

---

### Pattern 2: Central Hub Import (Recommandé pour la cohérence)

**Quand l'utiliser**: Vous voulez une source unique de vérité
**Avantages**: Maintenable, cohérent dans toute la codebase

```javascript
// Importer depuis le hub central (Magnus_13_universe/index.js)
import { cloud } from '../index.js';

// Utilisation - identique à Pattern 1
await cloud.payment.charge(1000, 'eur');
```

**Structure**:
```
Magnus_13_universe/
├── index.js                           ← Hub central
│   ├── exports cloud
│   ├── exports Magnus13
│   └── exports projects
│
└── anyfile.js
    import { cloud } from './index.js'
```

---

### Pattern 3: Smart Helper Import (Recommandé pour la flexibilité)

**Quand l'utiliser**: Code profond, chemins complexes, ou imports dynamiques
**Avantages**: Résout les chemins automatiquement, path-agnostic

```javascript
// Importer depuis n'importe où
import { getCloud, getMagnusRoot } from '../lib/magnus-imports.js';

// Utilisation
const cloud = await getCloud();
await cloud.payment.charge(1000, 'eur');

// Bonus: accès aux chemins
const root = getMagnusRoot();
console.log(`Magnus root: ${root}`);
```

**Helpers disponibles**:
```javascript
export {
  getCloud,              // Retourne l'instance cloud
  getMagnus,             // Retourne l'instance Magnus13
  getProject,            // Retourne un projet spécifique
  listProjects,          // Liste tous les projets disponibles
  getMagnusRoot,         // Retourne le chemin racine
  resolveMagnusPath,     // Résout un chemin relatif à la racine
  getMagnusUniverse      // Retourne toutes les exports
}
```

---

### Pattern 4: Full Universe Import (Recommandé pour les apps complexes)

**Quand l'utiliser**: Vous avez besoin de Magnus + CloudZero + tous les projets
**Avantages**: Accès à tous les resources en une seule import

```javascript
import { getMagnusUniverse } from '../lib/magnus-imports.js';

const universe = await getMagnusUniverse();
// universe.cloud          → CloudZero Proxy instance
// universe.magnus         → Magnus13 framework instance
// universe.root           → Chemin racine Magnus Universe
// universe.projects       → Tous les projets générés
// universe.projects.cloudzero → Spécifiquement CloudZero

// Utilisation
await universe.cloud.payment.charge(1000, 'eur');
const magnus = universe.magnus;
```

---

### Pattern 5: Conditional/Dynamic Import (Pour architectures avancées)

**Quand l'utiliser**: Plugins, imports dynamiques, configuration-driven
**Avantages**: Charge seulement ce qui est nécessaire

```javascript
import { getProject, listProjects } from '../lib/magnus-imports.js';

// Découvrir les projets disponibles
const projects = await listProjects();  // ['cloudzero']

// Charger dynamiquement
for (const projectName of projects) {
  const project = await getProject(projectName);
  console.log(`Loaded: ${projectName}`);
}

// Ou charger un spécifique
const cloudzero = await getProject('cloudzero');
```

---

## 📍 Recommandations par Localisation

### Fichiers dans `magnus/`
```javascript
// ✅ Préféré: Pattern 1 (Direct Import)
import { cloud } from '../generated/cloudzero-proxy/cloudzero-proxy.js';

// ✅ Aussi bon: Pattern 2 (Hub)
import { cloud } from '../index.js';

// ⚠️ Possible mais lourd: Pattern 3
import { getCloud } from '../lib/magnus-imports.js';
```

### Fichiers dans `generated/cloudzero-proxy/`
```javascript
// ✅ Préféré: Pattern 1 (Import du parent)
import { cloud } from '../cloudzero-proxy.js';

// ✅ Aussi bon: Pattern 3 (Helper)
import { getCloud } from '../../../lib/magnus-imports.js';
```

### Fichiers profondément imbriqués
```javascript
// ❌ Éviter: Trop de ../
import { cloud } from '../../../../../generated/cloudzero-proxy.js';

// ✅ Préféré: Pattern 3 (Helper)
import { getCloud } from '../../../lib/magnus-imports.js';
const cloud = await getCloud();
```

### Fichiers de test/examples
```javascript
// ✅ Tous les patterns fonctionnent bien
// Choisir ce qui est le plus lisible pour vous
```

---

## 🚀 Services CloudZero Disponibles

Une fois importé, accédez à tous les services:

```javascript
const cloud = await getCloud();

// 💳 Payment - Stripe
await cloud.payment.charge(amount, currency, options);
await cloud.payment.refund(chargeId);

// 📧 Email - SendGrid
await cloud.email.send(to, subject, body, options);
await cloud.email.sendTemplate(to, templateId, variables);

// 📱 SMS - Twilio
await cloud.sms.send(phone, message, options);
await cloud.sms.sendVerification(phone);

// 💾 Storage - AWS S3
await cloud.storage.upload(buffer, path);
await cloud.storage.download(path);

// 🔐 Auth - Auth0
await cloud.auth.createUser(email, password, metadata);
await cloud.auth.authenticate(email, password);
```

---

## ✅ Checklist d'Utilisation

### Dans un nouveau fichier:

- [ ] Décider où le fichier sera (magnus/, generated/, etc.)
- [ ] Choisir le pattern d'import approprié
- [ ] Importer CloudZero ou autre resource
- [ ] Utiliser les services
- [ ] Tester la fonctionnalité

### Exemple Complet:

```javascript
/**
 * magnus/my-orchestrator.js
 * Orchestrate multiple cloud services
 */

import { cloud } from '../generated/cloudzero-proxy/cloudzero-proxy.js';

export class MyOrchestrator {
  async processTransaction(userEmail, amount) {
    // Payment
    const charge = await cloud.payment.charge(amount, 'eur');

    // Notification
    await cloud.email.send(
      userEmail,
      'Transaction Complete',
      `Your charge: ${charge.id}`
    );

    // SMS backup
    await cloud.sms.send(
      userEmail.replace('@example.com', ''),
      `Transaction ${charge.id} completed`
    );

    return { success: true, chargeId: charge.id };
  }
}
```

---

## 🔧 Configuration pour TypeScript (Bonus)

Si vous utilisez TypeScript, ajoutez des types:

```typescript
import { cloud } from '../generated/cloudzero-proxy/cloudzero-proxy.js';

// Cloud est correctement typé!
const charge: any = await cloud.payment.charge(1000, 'eur');
```

---

## 🆘 Troubleshooting

### Erreur: "Cannot find module"

**Problème**: Chemin relatif incorrect

**Solutions**:
1. Vérifier le nombre de `../`
2. Utiliser Pattern 3 (Helper) pour résolution automatique
3. Utiliser les chemins absolus depuis la racine

```javascript
// ❌ Problème
import { cloud } from '../cloudzero-proxy/cloudzero-proxy.js';

// ✅ Solution 1: Compter les étapes correctement
import { cloud } from '../generated/cloudzero-proxy/cloudzero-proxy.js';

// ✅ Solution 2: Utiliser helper
import { getCloud } from '../lib/magnus-imports.js';
const cloud = await getCloud();
```

### Erreur: "Cloud is not defined"

**Problème**: Oubli du `await` sur `getCloud()`

```javascript
// ❌ Erreur
const cloud = getCloud();
await cloud.payment.charge(...);  // cloud est une Promise, pas l'instance!

// ✅ Correct
const cloud = await getCloud();
await cloud.payment.charge(...);
```

### Module type warnings

**Problème**: Node.js ne sait pas si c'est ESM ou CommonJS

**Solution**: Ajouter `"type": "module"` à `package.json`

```json
{
  "type": "module",
  "name": "magnus-universe",
  ...
}
```

---

## 📚 Ressources Supplémentaires

- **[index.js](./index.js)** - Hub central d'exports
- **[lib/magnus-imports.js](./lib/magnus-imports.js)** - Helpers d'importation
- **[examples/import-patterns.js](./examples/import-patterns.js)** - Exemples détaillés
- **[CloudZero README](./generated/cloudzero-proxy/README.md)** - Documentation CloudZero

---

## 🎯 Résumé Rapide

| Situation | Pattern | Code |
|-----------|---------|------|
| Chemin connu, code simple | 1 (Direct) | `import { cloud } from '../generated/...'` |
| Besoin de cohérence | 2 (Hub) | `import { cloud } from '../index.js'` |
| Chemin complexe | 3 (Helper) | `const cloud = await getCloud()` |
| Besoin de tout | 4 (Full) | `const u = await getMagnusUniverse()` |
| Imports dynamiques | 5 (Dynamic) | `await getProject(name)` |

---

**Magnus Universe: Where imports are clear, and services are accessible.** 🌌
