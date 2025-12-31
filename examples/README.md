# 🌌 Magnus Universe - Examples

Exemples pratiques d'utilisation de CloudZero Proxy et du framework Magnus.

---

## 📚 Exemples Disponibles

### 1. **quick-start.js** (⭐ Commencer ici)
Le minimum vital pour utiliser CloudZero Proxy.

```bash
node quick-start.js
```

**Démontre:**
- Importer CloudZero depuis n'importe où
- Charger, envoyer emails, SMS, uploads, créer users
- Tous les 5 services en action

**Durée:** 2 minutes

---

### 2. **import-patterns.js** (🎓 Apprendre les imports)
Les 5 patterns d'importation différents.

```bash
node import-patterns.js
```

**Démontre:**
- Direct Import
- Central Hub Import
- Smart Helper Import
- Full Universe Import
- Conditional/Dynamic Import

**Quand l'utiliser:** Vous ne savez pas comment importer CloudZero

**Durée:** 5 minutes

---

## 🚀 Commencer Rapidement

### Étape 1: Lire la documentation
```bash
# Guide d'importation complet
cat ../IMPORT-GUIDE.md

# Documentation CloudZero
cat ../generated/cloudzero-proxy/README.md
```

### Étape 2: Exécuter quick-start
```bash
node quick-start.js
```

### Étape 3: Utiliser dans votre code

**Pattern simple (recommandé):**
```javascript
import { getCloud } from '../lib/magnus-imports.js';

const cloud = await getCloud();
await cloud.payment.charge(1000, 'eur');
```

**Pattern direct (si vous connaissez le chemin):**
```javascript
import { cloud } from '../generated/cloudzero-proxy/cloudzero-proxy.js';

await cloud.payment.charge(1000, 'eur');
```

---

## 📖 Documentation Complète

| Document | Contenu |
|----------|---------|
| **[IMPORT-GUIDE.md](../IMPORT-GUIDE.md)** | 5 patterns d'import détaillés |
| **[index.js](../index.js)** | Hub central d'exports |
| **[lib/magnus-imports.js](../lib/magnus-imports.js)** | Helpers d'importation |
| **[generated/cloudzero-proxy/README.md](../generated/cloudzero-proxy/README.md)** | API CloudZero complète |

---

## 🎯 Cas d'Utilisation Courants

### Je veux charger depuis n'importe où
```javascript
import { getCloud } from '../../../lib/magnus-imports.js';
const cloud = await getCloud();
```

### Je veux une source unique de vérité
```javascript
import { cloud } from '../index.js';
```

### Je connais le chemin exact
```javascript
import { cloud } from '../generated/cloudzero-proxy/cloudzero-proxy.js';
```

### Je veux accéder à Magnus aussi
```javascript
import { getMagnusUniverse } from '../lib/magnus-imports.js';
const { cloud, magnus, root } = await getMagnusUniverse();
```

---

## 💡 Tips

1. **Préférez le helper** pour du code maintenable
2. **Testez locally** avant de pusher
3. **Consultez IMPORT-GUIDE.md** si vous êtes perdu
4. **Tous les patterns fonctionnent** - choisissez ce qui vous convient

---

**Ready to orchestrate? Pick a pattern and start coding!** 🚀
