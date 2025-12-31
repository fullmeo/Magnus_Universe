# ⚡ CloudZero Proxy - Quick Reference

**Import CloudZero from anywhere in Magnus Universe**

---

## 🚀 30-Second Start

```javascript
import { getCloud } from '../lib/magnus-imports.js';
const cloud = await getCloud();

// Use any service:
await cloud.payment.charge(100, 'eur');
await cloud.email.send('user@example.com', 'Hi', '<h1>Hi</h1>');
await cloud.sms.send('+33612345678', 'Hello');
await cloud.storage.upload(buffer, 'file.txt');
await cloud.auth.createUser('user@example.com', 'Pass123!');
```

✅ **That's it.** Works everywhere. Zero config.

---

## 📚 3 Main Patterns

### Pattern 1: Smart Helper ⭐ (Recommended)
```javascript
import { getCloud } from '../lib/magnus-imports.js';
const cloud = await getCloud();
```

### Pattern 2: Direct Import
```javascript
import { cloud } from '../generated/cloudzero-proxy/cloudzero-proxy.js';
```

### Pattern 3: Hub Central
```javascript
import { cloud } from '../index.js';
```

---

## 💡 Services Available

```javascript
const cloud = await getCloud();

cloud.payment.charge(amount, currency)     // Stripe
cloud.email.send(to, subject, body)        // SendGrid
cloud.sms.send(phone, message)             // Twilio
cloud.storage.upload(buffer, path)         // AWS S3
cloud.auth.createUser(email, password)     // Auth0
```

---

## 📖 Documentation

| Guide | Time | For |
|-------|------|-----|
| **START-HERE-CLOUDZ.md** | 2 min | Everyone |
| **HOW-TO-IMPORT.md** | 2 min | Quick learners |
| **IMPORT-GUIDE.md** | 10 min | Detail seekers |
| **examples/** | 5 min | Code learners |

---

## 🎯 By File Location

### In `magnus/`
```javascript
import { cloud } from '../generated/cloudzero-proxy/cloudzero-proxy.js';
```

### In `generated/cloudzero-proxy/`
```javascript
import { cloud } from '../cloudzero-proxy.js';
```

### Anywhere Else (Use Helper)
```javascript
import { getCloud } from '../../../lib/magnus-imports.js';
const cloud = await getCloud();
```

---

## ✅ Test It

```bash
cd examples
node quick-start.js
```

Expected output: All 5 services working with colored logs ✅

---

## 🆘 Quick Help

| Problem | Fix |
|---------|-----|
| "Cannot find module" | Use helper: `import { getCloud }...` |
| "Cloud is undefined" | Add `await` to getCloud() |
| "Which pattern?" | Use Pattern 1 (Helper) |
| "Need all details?" | Read `IMPORT-GUIDE.md` |

---

## 🌌 That's Everything

✅ Services working
✅ Patterns available
✅ Examples tested
✅ Documentation complete

**You're ready to go!** 🚀

---

**Read**: `START-HERE-CLOUDZ.md` (2 min)
**Run**: `examples/quick-start.js` (2 min)
**Code**: Copy pattern 1 (30 sec)
**Total**: 4.5 min to productivity

---

**Magnus Universe: Where cloud services are accessible, everywhere.** 🌌
