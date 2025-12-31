# 🚀 CloudZero Proxy - Quick Start

## Installation (30 secondes)

```bash
# 1. Installer jsonwebtoken (optionnel, pour auth mocks)
npm install jsonwebtoken

# 2. C'est tout! Prêt à utiliser
```

## Premier Test (1 minute)

```javascript
// test.js
import { cloud } from './cloudzero-proxy.js';

async function test() {
  // Payment
  const charge = await cloud.payment.charge(1000, 'eur');
  console.log('💳 Charge:', charge.id);

  // Email
  const email = await cloud.email.send(
    'test@example.com',
    'Test Email',
    '<h1>Hello!</h1>'
  );
  console.log('📧 Email:', email.id);

  // SMS
  const sms = await cloud.sms.send('+33612345678', 'Test SMS');
  console.log('📱 SMS:', sms.id);

  // Storage
  const upload = await cloud.storage.upload(
    Buffer.from('Hello!'),
    'test.txt'
  );
  console.log('💾 Upload:', upload.url);

  // Auth
  const user = await cloud.auth.createUser(
    'user@test.com',
    'Password123!'
  );
  console.log('🔐 User:', user.id);

  console.log('\n✅ Tout marche!');
}

test();
```

```bash
node test.js
```

## Dans Ton App Express

```javascript
import express from 'express';
import { cloud } from './cloudzero-proxy.js';

const app = express();
app.use(express.json());

// Endpoint de paiement
app.post('/api/charge', async (req, res) => {
  const charge = await cloud.payment.charge(
    req.body.amount,
    req.body.currency
  );
  res.json({ success: true, charge });
});

// Endpoint d'email
app.post('/api/send-email', async (req, res) => {
  const result = await cloud.email.send(
    req.body.to,
    req.body.subject,
    req.body.body
  );
  res.json({ success: true, result });
});

app.listen(3000, () => {
  console.log('🌩️  CloudZero Proxy ready on :3000');
});
```

## Mode Dev vs Prod

### Dev (Défaut - Mocks)
```bash
# Aucune configuration
node app.js

# Tout marche IMMÉDIATEMENT avec mocks
# Données dans ./dev-data/
```

### Prod (Vraies APIs)
```bash
# .env
NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG...
# ... autres clés

node app.js

# CloudZero utilise automatiquement vraies APIs
```

## Où Sont Les Données Dev?

```
./dev-data/
├── payments/
│   └── charges.json        # Toutes tes charges
├── emails/
│   ├── *.json             # Metadata emails
│   └── *.html             # Preview HTML
├── sms/
│   └── messages.json      # Tous tes SMS
└── storage/
    └── files/             # Fichiers uploadés
```

## Prochaines Étapes

1. **Lire README.md** - Documentation complète
2. **Tester basic-usage.js** - `npm run example`
3. **Intégrer dans ton projet**
4. **Coder sans friction! 🎺**

---

**CloudZero Proxy: Zéro config, maximum vélocité** 🚀
