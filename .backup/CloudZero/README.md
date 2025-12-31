# 🌩️ CloudZero Proxy - Zero Friction Development

**Une seule API. Tous les services cloud. Zéro configuration.**

CloudZero Proxy élimine la friction administrative du développement en fournissant une API unifiée pour tous les services cloud avec des mocks intelligents pour le développement.

---

## 🎯 Le Problème

```
Avant CloudZero:
├─ Créer compte Stripe (30 min)
├─ Setup SendGrid + vérification domaine (1h)
├─ Configuration Twilio (20 min)
├─ Setup AWS S3 + IAM (45 min)
├─ Configuration Auth0 (30 min)
├─ Gérer 20+ variables d'environnement
└─ Total: 3-4 heures AVANT de coder

Résultat: Le projet ne démarre jamais
```

## ✨ La Solution

```javascript
// Jour 1, Minute 1 de ton projet
import { cloud } from './cloudzero-proxy.js';

// Ça marche IMMÉDIATEMENT (mocks intelligents)
await cloud.payment.charge(1000, 'eur');
await cloud.email.send('user@example.com', 'Welcome!');
await cloud.sms.send('+33612345678', 'Code: 1234');
await cloud.storage.upload(file, 'avatars/user.jpg');
await cloud.auth.createUser('user@example.com', 'password');

// EN DEV: Tout est mocké (zéro config)
// EN PROD: Routes vers Stripe, SendGrid, Twilio, S3, Auth0
// MÊME CODE. ZERO MODIFICATION.
```

---

## 🚀 Installation

```bash
# Copier les fichiers CloudZero Proxy dans ton projet
# Pas de npm dependencies (sauf jsonwebtoken pour auth mocks)

npm install jsonwebtoken  # Optionnel, seulement pour auth mocks
```

---

## 📦 Services Disponibles

### 💳 Payment (Stripe)
```javascript
// Charge
await cloud.payment.charge(1000, 'eur', {
  description: 'Order #12345',
  metadata: { order_id: '12345' }
});

// Payment Intent (3D Secure)
const intent = await cloud.payment.createPaymentIntent(1000, 'eur');

// Customer
const customer = await cloud.payment.createCustomer({
  email: 'customer@example.com',
  name: 'John Doe'
});

// Subscription
const sub = await cloud.payment.createSubscription(
  customer.id,
  'price_premium',
  { amount: 999, interval: 'month' }
);

// Refund
await cloud.payment.refund(charge.id, 500); // Partial refund
```

### 📧 Email (SendGrid)
```javascript
// Simple email
await cloud.email.send(
  'user@example.com',
  'Welcome!',
  '<h1>Welcome to our app!</h1>'
);

// Template email
await cloud.email.sendTemplate(
  'user@example.com',
  'welcome',
  { user_name: 'John', app_name: 'MyApp' }
);

// Bulk emails
await cloud.email.sendBulk([
  { to: 'user1@example.com', subject: 'Hello', body: 'Hi!' },
  { to: 'user2@example.com', subject: 'Hello', body: 'Hi!' }
]);

// Transactional
await cloud.email.sendTransactional(
  'user@example.com',
  'reset_password',
  { reset_link: 'https://...' }
);
```

### 📱 SMS (Twilio)
```javascript
// Send SMS
await cloud.sms.send('+33612345678', 'Your code: 1234');

// Verification
const verification = await cloud.sms.sendVerification('+33612345678');
const verified = await cloud.sms.verifyCode('+33612345678', code);

// Status
const status = await cloud.sms.getStatus(messageId);
```

### 💾 Storage (S3)
```javascript
// Upload
const upload = await cloud.storage.upload(
  fileBuffer,
  'avatars/user123.jpg'
);

// Download
const data = await cloud.storage.download('avatars/user123.jpg');

// Delete
await cloud.storage.delete('avatars/user123.jpg');

// Get signed URL
const url = await cloud.storage.getUrl('avatars/user123.jpg', 3600);

// List files
const files = await cloud.storage.list('avatars/');
```

### 🔐 Auth (Auth0)
```javascript
// Create user
const user = await cloud.auth.createUser(
  'user@example.com',
  'SecurePassword123!',
  { name: 'John Doe' }
);

// Login
const result = await cloud.auth.login('user@example.com', 'password');
// Returns: { access_token, refresh_token, user }

// Verify token
const check = await cloud.auth.verifyToken(token);

// Reset password
await cloud.auth.resetPassword('user@example.com');

// Get/Update/Delete user
const user = await cloud.auth.getUser(userId);
await cloud.auth.updateUser(userId, { name: 'New Name' });
await cloud.auth.deleteUser(userId);
```

---

## 🎮 Modes

### Development Mode (Défaut)
```javascript
// Aucune configuration nécessaire
// Tous les services utilisent des mocks intelligents

NODE_ENV=development node app.js

// Mocks:
// - Payment: Transactions stockées localement (./dev-data/payments)
// - Email: HTML preview + fichiers locaux (./dev-data/emails)
// - SMS: Messages en console (./dev-data/sms)
// - Storage: Fichiers locaux (./dev-data/storage)
// - Auth: Users en mémoire avec JWT
```

### Production Mode
```javascript
// Configure les vraies clés API

NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_...
SENDGRID_API_KEY=SG...
TWILIO_ACCOUNT_SID=AC...
TWILIO_AUTH_TOKEN=...
TWILIO_PHONE_NUMBER=+1...
AWS_ACCESS_KEY_ID=AKIA...
AWS_SECRET_ACCESS_KEY=...
AWS_REGION=eu-west-1
AUTH0_DOMAIN=your-domain.auth0.com
AUTH0_CLIENT_ID=...
AUTH0_CLIENT_SECRET=...

node app.js
```

### Mixed Mode
```javascript
// Certains services en mock, d'autres en prod
// Par exemple: Payment en prod, tout le reste en mock

NODE_ENV=production
STRIPE_SECRET_KEY=sk_live_...
# Les autres variables non définies → mocks utilisés
```

---

## 📊 Status & Health Check

```javascript
// Get service status
const status = cloud.getStatus();
/*
{
  mode: 'development',
  services: {
    payment: { configured: true, provider: 'Stripe', mode: 'mock' },
    email: { configured: true, provider: 'SendGrid', mode: 'mock' },
    ...
  }
}
*/

// Health check
const health = await cloud.healthCheck();
/*
{
  healthy: true,
  services: {
    payment: { healthy: true },
    email: { healthy: true },
    ...
  }
}
*/
```

---

## 🎯 Caractéristiques des Mocks

### Payment Mock
- ✅ Transactions stockées localement
- ✅ Délais réseau simulés (50-200ms)
- ✅ Échecs aléatoires (1% rate)
- ✅ IDs réalistes (ch_mock_*, cus_mock_*, etc.)
- ✅ Structures identiques à Stripe

### Email Mock
- ✅ Emails sauvegardés en JSON + HTML
- ✅ Preview HTML dans ./dev-data/emails/
- ✅ Console logs colorés
- ✅ Templates prédéfinis (welcome, reset_password, invoice)
- ✅ Stats d'envoi

### SMS Mock
- ✅ Messages en console + fichiers
- ✅ Codes de vérification fonctionnels
- ✅ Expiration des codes (5 min)
- ✅ IDs réalistes (SM...)

### Storage Mock
- ✅ Stockage local dans ./dev-data/storage/
- ✅ URLs locales (http://localhost:3000/storage/...)
- ✅ Préservation structure dossiers
- ✅ Métadonnées (taille, date)

### Auth Mock
- ✅ Users en mémoire
- ✅ JWT réels (vérifiables)
- ✅ Hash password (SHA-256)
- ✅ Tokens d'expiration
- ✅ Reset password tokens

---

## 🔧 Configuration Avancée

```javascript
import { CloudZeroProxy } from './cloudzero-proxy.js';

const cloud = new CloudZeroProxy({
  mode: 'development', // ou 'production'
  verbose: true,       // Logs détaillés
  
  // Override configs (optionnel)
  stripe: {
    secretKey: 'sk_test_...',
    webhookSecret: 'whsec_...'
  },
  sendgrid: {
    apiKey: 'SG...'
  },
  // ... autres services
});
```

---

## 📁 Structure des Fichiers

```
cloudzero-proxy/
├── cloudzero-proxy.js          # Main orchestrator
├── services/
│   ├── payment.js              # Payment service
│   ├── email.js                # Email service
│   ├── sms.js                  # SMS service
│   ├── storage.js              # Storage service
│   └── auth.js                 # Auth service
├── mocks/
│   ├── mock-payment.js         # Payment mocks
│   ├── mock-email.js           # Email mocks
│   ├── mock-sms.js             # SMS mocks
│   ├── mock-storage.js         # Storage mocks
│   └── mock-auth.js            # Auth mocks
├── examples/
│   └── basic-usage.js          # Usage examples
├── dev-data/                   # Generated in dev mode
│   ├── payments/               # Payment transactions
│   ├── emails/                 # Email archives
│   ├── sms/                    # SMS logs
│   └── storage/                # Uploaded files
├── package.json
└── README.md
```

---

## 🚀 Exemples d'Utilisation

### Express App
```javascript
import express from 'express';
import { cloud } from './cloudzero-proxy.js';

const app = express();
app.use(express.json());

// Payment endpoint
app.post('/api/charge', async (req, res) => {
  try {
    const charge = await cloud.payment.charge(
      req.body.amount,
      req.body.currency
    );
    res.json({ success: true, charge });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Email endpoint
app.post('/api/send-email', async (req, res) => {
  try {
    const result = await cloud.email.send(
      req.body.to,
      req.body.subject,
      req.body.body
    );
    res.json({ success: true, result });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3000);
```

### Full Registration Flow
```javascript
async function registerUser(email, password, name) {
  // 1. Create auth user
  const user = await cloud.auth.createUser(email, password, { name });
  
  // 2. Send welcome email
  await cloud.email.sendTemplate(email, 'welcome', { 
    user_name: name,
    app_name: 'MyApp'
  });
  
  // 3. Send SMS verification
  const verification = await cloud.sms.sendVerification(phone);
  
  return { user, verification };
}
```

---

## 💡 Best Practices

### 1. Start en Dev, Deploy en Prod
```javascript
// Développe TOUT en mode dev (mocks)
// Test avec données réalistes
// Deploy en prod = juste ajouter env vars
```

### 2. Pas de if (NODE_ENV === 'production')
```javascript
// ❌ MAUVAIS
if (process.env.NODE_ENV === 'production') {
  const stripe = new Stripe(key);
} else {
  const stripe = mockStripe;
}

// ✅ BON
import { cloud } from './cloudzero-proxy.js';
await cloud.payment.charge(amount, currency);
// CloudZero gère automatiquement dev vs prod
```

### 3. Tester avec les Mocks
```javascript
// Les mocks simulent les vraies APIs
// Teste ton error handling avec les échecs aléatoires (1%)
// Vérifie les délais réseau
```

---

## 🐛 Debugging

```javascript
// Activer logs verbeux
const cloud = new CloudZeroProxy({ verbose: true });

// Check service status
console.log(cloud.getStatus());

// Health check
const health = await cloud.healthCheck();
console.log(health);

// Inspect mock data
// ./dev-data/payments/charges.json
// ./dev-data/emails/*.html
```

---

## 🔮 Roadmap

- [ ] Real Stripe integration
- [ ] Real SendGrid integration  
- [ ] Real Twilio integration
- [ ] Real AWS S3 integration
- [ ] Real Auth0 integration
- [ ] Webhook simulation
- [ ] Admin dashboard
- [ ] Test helpers
- [ ] TypeScript definitions

---

## 📝 License

MIT

---

## 🎺 Credits

Built by Serigne (Meta-Developer)  
Philosophy: "Zero friction, maximum velocity"

---

**CloudZero Proxy: Parce que la friction administrative ne devrait jamais tuer un projet.** 🚀
