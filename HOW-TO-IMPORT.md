# 📌 How to Import CloudZero in Magnus Universe

**"Je veux juste importer CloudZero et l'utiliser!"**

---

## 🚀 TL;DR - La Façon la Plus Simple

Peu importe où vous êtes, utilisez ceci:

```javascript
import { getCloud } from '../lib/magnus-imports.js';

const cloud = await getCloud();
await cloud.payment.charge(100, 'eur');
```

**Ça marche toujours.** C'est tout ce que vous devez savoir.

---

## 📍 Par Localisation du Fichier

### 📁 Si votre fichier est dans `magnus/`

```
magnus/
├── magnus-13.js           ← Vous êtes ici
└── ...
```

**Importation directe (plus court):**
```javascript
import { cloud } from '../generated/cloudzero-proxy/cloudzero-proxy.js';
```

**Ou plus flexible:**
```javascript
import { getCloud } from '../lib/magnus-imports.js';
const cloud = await getCloud();
```

---

### 📁 Si votre fichier est dans `magnus/subfolder/`

```
magnus/
├── subfolder/
│   └── myfile.js          ← Vous êtes ici
└── ...
```

**Importation directe:**
```javascript
import { cloud } from '../../generated/cloudzero-proxy/cloudzero-proxy.js';
```

**Ou plus flexible:**
```javascript
import { getCloud } from '../../lib/magnus-imports.js';
const cloud = await getCloud();
```

---

### 📁 Si votre fichier est dans `generated/cloudzero-proxy/`

```
generated/
└── cloudzero-proxy/
    ├── services/
    ├── mocks/
    ├── examples/
    │   └── myfile.js      ← Vous êtes ici
    └── cloudzero-proxy.js
```

**Plus court - le fichier est dans le même projet:**
```javascript
import { cloud } from '../../cloudzero-proxy.js';
```

---

### 📁 Si votre fichier est profondement imbriqué

```
anywhere/very/deep/nested/
└── myfile.js              ← Vous êtes ici
```

**Utilisez TOUJOURS le helper:**
```javascript
import { getCloud } from '../../../../../lib/magnus-imports.js';
const cloud = await getCloud();
```

---

## 🎯 3 Patterns à Retenir

### Pattern 1: Direct (Si vous connaissez le chemin)
```javascript
import { cloud } from '../path/to/cloudzero-proxy.js';
```

### Pattern 2: Hub (Source unique de vérité)
```javascript
import { cloud } from '../index.js';
```

### Pattern 3: Helper (Ça marche toujours!) ⭐
```javascript
import { getCloud } from '../lib/magnus-imports.js';
const cloud = await getCloud();
```

---

## 💡 Aide au Décision

### Je suis dans `magnus/` ou `generated/`?
→ Utilisez **Pattern 1** (direct)

### Je veux une source unique d'importation?
→ Utilisez **Pattern 2** (hub)

### Je ne suis pas sûr ou je suis imbriqué?
→ Utilisez **Pattern 3** (helper) ✅

### Je veux accéder à Magnus aussi?
```javascript
import { getMagnusUniverse } from '../lib/magnus-imports.js';
const { cloud, magnus } = await getMagnusUniverse();
```

---

## ✅ Checklist d'Importation

- [ ] J'ai choisi mon pattern
- [ ] J'ai copié la ligne d'import
- [ ] Je peux utiliser `const cloud = await getCloud()` OR `import { cloud } from '...'`
- [ ] J'ai testé avec un simple `await cloud.payment.charge(100, 'eur')`
- [ ] Ça marche! 🎉

---

## 🔍 Vérifier Que Ça Marche

```javascript
// Import
import { getCloud } from '../lib/magnus-imports.js';

// Get cloud
const cloud = await getCloud();

// Test it
try {
  const result = await cloud.payment.charge(100, 'eur');
  console.log('✅ Success:', result.id);
} catch (error) {
  console.error('❌ Error:', error.message);
}
```

**Si ça affiche `✅ Success`, vous avez gagné!**

---

## 🆘 Ça ne Marche Pas?

### Erreur: "Cannot find module"

**Cause:** Mauvais nombre de `../`

**Solution:** Compter les dossiers:
```
YOUR_FILE
↑
1 dossier up      = ../
2 dossiers up     = ../../
3 dossiers up     = ../../../
...
```

**Ou utiliser le helper:**
```javascript
import { getCloud } from '../lib/magnus-imports.js';
const cloud = await getCloud();
```

### Erreur: "Cloud is not defined"

**Cause:** Oubli du `await`

```javascript
// ❌ Mauvais
const cloud = getCloud();
await cloud.payment.charge(...);

// ✅ Correct
const cloud = await getCloud();
await cloud.payment.charge(...);
```

### Erreur: "Module type warning"

**Cause:** Node ne sait pas c'est ESM

**Solution:** Ajouter à `package.json`:
```json
{
  "type": "module"
}
```

---

## 🎁 Bonus: Tous les Services

Une fois importé, vous avez accès à:

```javascript
// 💳 Payment (Stripe)
const charge = await cloud.payment.charge(amount, currency, options);

// 📧 Email (SendGrid)
const email = await cloud.email.send(to, subject, body, options);

// 📱 SMS (Twilio)
const sms = await cloud.sms.send(phone, message, options);

// 💾 Storage (AWS S3)
const file = await cloud.storage.upload(buffer, path);

// 🔐 Auth (Auth0)
const user = await cloud.auth.createUser(email, password, metadata);
```

---

## 📚 Documentation Complète

- **[IMPORT-GUIDE.md](./IMPORT-GUIDE.md)** - 5 patterns détaillés
- **[CLOUDZERO_INTEGRATION.md](./CLOUDZERO_INTEGRATION.md)** - Résumé complet
- **[examples/quick-start.js](./examples/quick-start.js)** - Code minimal
- **[lib/magnus-imports.js](./lib/magnus-imports.js)** - Le code du helper

---

## 🎯 Résumé Final

1. **Importez** une de ces 3 façons:
   ```javascript
   // Option 1: Direct
   import { cloud } from '../generated/cloudzero-proxy/cloudzero-proxy.js';

   // Option 2: Hub
   import { cloud } from '../index.js';

   // Option 3: Helper (recommandé)
   import { getCloud } from '../lib/magnus-imports.js';
   const cloud = await getCloud();
   ```

2. **Utilisez** le cloud:
   ```javascript
   await cloud.payment.charge(100, 'eur');
   ```

3. **C'est fait!** 🎉

---

**Magnus Universe: Import magic made simple.** ✨
