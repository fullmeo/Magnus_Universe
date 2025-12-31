# ☁️ Magnus Cloud Storage - Documentation Complete

**Persistence & Sync pour Magnus via CloudZero**

---

## 🎯 Vue d'Ensemble

Magnus Cloud Storage permet de:
- ✅ **Backup automatique** des données Magnus vers S3 (via CloudZero)
- ✅ **Restauration** des données en cas de perte
- ✅ **Sync multi-machines** (laptop, desktop, serveur)
- ✅ **Disaster recovery** automatique
- ✅ **Archivage** sessions et décisions

**Powered by**: CloudZero Proxy → AWS S3

---

## 🏗️ Architecture

```
Magnus 13 Extended
├─ Magnus 13 Core          # Analyse, génération, learning
└─ Magnus Cloud Storage    # Persistence via CloudZero
   └─ CloudZero Proxy      # S3 operations
      └─ AWS S3            # Storage final
```

### Flux de Données

```
Local Magnus                Cloud Storage (S3)
──────────────             ──────────────────
Learning data    ──────→   magnus-data/learning/
Sessions         ──────→   magnus-data/sessions/
Scan reports     ──────→   magnus-data/scans/
Decisions        ──────→   magnus-data/decisions/
Projects         ──────→   magnus-data/projects/
```

---

## 📦 Installation

### 1. Fichiers Requis

```bash
Magnus_13_universe/
├── magnus/
│   ├── magnus-13.js                 # Base Magnus
│   ├── magnus-13-extended.js        # Extended avec cloud ✨
│   └── magnus-cloud-storage.js      # Storage module ✨
│
├── lib/
│   └── magnus-imports.js            # CloudZero helper
│
└── generated/
    └── cloudzero-proxy/             # CloudZero
```

### 2. Setup

```javascript
// Copier les nouveaux fichiers dans magnus/
cp magnus-13-extended.js Magnus_13_universe/magnus/
cp magnus-cloud-storage.js Magnus_13_universe/magnus/
```

---

## 🚀 Usage Quick Start

### Basic Usage (Auto-Backup)

```javascript
import Magnus13Extended from './magnus/magnus-13-extended.js';

const magnus = new Magnus13Extended({
  cloudStorage: true,      // Enable cloud storage
  autoBackup: true,        // Backup every hour
  backupOnGeneration: true // Backup after each generation
});

await magnus.initialize();

// Use Magnus normally - everything backed up automatically!
const analysis = await magnus.analyze("Your request");
```

**Résultat**: Magnus backup automatiquement toutes les données vers S3.

---

## ⚙️ Configuration

### Options Magnus13Extended

```javascript
const magnus = new Magnus13Extended({
  // Cloud Storage
  cloudStorage: true,           // Enable/disable cloud storage
  autoBackup: true,             // Auto-backup every interval
  backupInterval: 3600000,      // Backup interval (ms) - default 1h
  backupOnGeneration: true,     // Backup after generation
  
  // Magnus 13 options (inherited)
  autoLearn: true,
  requireClarification: true,
  minClarityScore: 70,
  maxComplexityScore: 8
});
```

### Options MagnusCloudStorage

```javascript
const cloudStorage = new MagnusCloudStorage({
  autoBackup: true,                    // Enable auto-backup
  backupInterval: 3600000,             // 1 hour
  storagePrefix: 'magnus-data',        // S3 prefix
  compressionEnabled: true             // Compress backups
});
```

---

## 📚 API Reference

### Magnus13Extended Methods

#### `async initialize()`
Initialize Magnus + Cloud Storage
```javascript
await magnus.initialize();
```

#### `async analyze(request, options)`
Analyze request (optionally with cloud backup)
```javascript
const analysis = await magnus.analyze("Request", {
  cloudBackup: true  // Backup analysis to cloud
});
```

#### `async startGeneration(analysis, options)`
Start generation (automatically backed up if configured)
```javascript
const session = await magnus.startGeneration(analysis);
// Session automatically backed up to S3
```

#### `async recordOutcome(sessionId, outcome)`
Record outcome (automatically backs up learning data)
```javascript
await magnus.recordOutcome(sessionId, {
  outcome: 'SUCCESS',
  tokensUsed: 15000,
  filesGenerated: 12
});
// Learning data automatically backed up
```

#### `async backupToCloud()`
Manually trigger complete backup
```javascript
const results = await magnus.backupToCloud();
console.log('Backed up:', results);
```

#### `async restoreFromCloud(timestamp)`
Restore data from cloud
```javascript
// Restore latest backup
await magnus.restoreFromCloud('latest');

// Restore specific timestamp
await magnus.restoreFromCloud(1700000000000);
```

#### `async syncWithCloud()`
Bidirectional sync with cloud
```javascript
const results = await magnus.syncWithCloud();
console.log('Sync:', results);
```

#### `async getCloudStats()`
Get cloud storage statistics
```javascript
const stats = await magnus.getCloudStats();
console.log('Stats:', stats);
```

---

### MagnusCloudStorage Methods

#### `async backupLearningData(data)`
Backup learning data to S3
```javascript
await cloudStorage.backupLearningData({
  patterns: [...],
  estimates: [...],
  actuals: [...]
});
```

#### `async restoreLearningData(timestamp)`
Restore learning data from S3
```javascript
const data = await cloudStorage.restoreLearningData('latest');
```

#### `async archiveSession(sessionId, data)`
Archive generation session
```javascript
await cloudStorage.archiveSession('session-123', sessionData);
```

#### `async restoreSession(sessionId)`
Restore session from S3
```javascript
const session = await cloudStorage.restoreSession('session-123');
```

#### `async archiveScanReport(report)`
Archive scan report
```javascript
await cloudStorage.archiveScanReport(scanReport);
```

#### `async archiveDecision(decision)`
Archive architectural decision
```javascript
await cloudStorage.archiveDecision({
  type: 'ARCHITECTURE',
  decision: 'Use microservices',
  rationale: '...'
});
```

#### `async backupGeneratedProject(name, path)`
Backup entire generated project
```javascript
await cloudStorage.backupGeneratedProject(
  'cloudzero-proxy',
  './generated/cloudzero-proxy'
);
```

#### `async backupAll()`
Backup all Magnus data
```javascript
const results = await cloudStorage.backupAll();
```

#### `async sync()`
Bidirectional sync
```javascript
const results = await cloudStorage.sync();
```

---

## 💡 Use Cases

### 1. Auto-Backup Everything

```javascript
const magnus = new Magnus13Extended({
  cloudStorage: true,
  autoBackup: true,
  backupInterval: 1800000  // Every 30 minutes
});

await magnus.initialize();

// Work normally - everything backed up automatically
// Learning data, sessions, decisions → All in S3
```

### 2. Multi-Machine Workflow

```javascript
// Machine 1 (Laptop): Do work
const magnus1 = new Magnus13Extended({ cloudStorage: true });
await magnus1.initialize();

const analysis = await magnus1.analyze("Build API");
await magnus1.startGeneration(analysis);
// → Backed up to S3

// Machine 2 (Desktop): Continue work
const magnus2 = new Magnus13Extended({ cloudStorage: true });
await magnus2.initialize();
await magnus2.restoreFromCloud('latest');
// → All learning from Machine 1 available!
```

### 3. Disaster Recovery

```javascript
// System crash, local data lost 💥

// New machine: Restore everything
const magnus = new Magnus13Extended({ cloudStorage: true });
await magnus.initialize();
await magnus.restoreFromCloud('latest');

// ✅ All learning data restored
// ✅ Can continue as if nothing happened
```

### 4. Manual Backup Before Risky Operation

```javascript
const magnus = new Magnus13Extended({
  cloudStorage: true,
  autoBackup: false  // Manual only
});

await magnus.initialize();

// Before risky operation
await magnus.backupToCloud();
console.log('✅ Backup created');

// Try risky operation...
// If fails, restore from backup
```

### 5. Session Archival

```javascript
// Archive important generation sessions
const session = await magnus.startGeneration(analysis);

// Later: Retrieve session details
const archived = await magnus.cloudStorage.restoreSession(session.sessionId);
console.log('Archived session:', archived);
```

---

## 🗂️ Storage Structure S3

```
s3://your-bucket/magnus-data/
│
├── learning/                          # Learning data
│   ├── knowledge-1700000000000.json
│   ├── knowledge-1700001000000.json
│   └── knowledge-latest.json
│
├── sessions/                          # Generation sessions
│   ├── session-abc123.json
│   ├── session-def456.json
│   └── ...
│
├── scans/                             # Scan reports
│   ├── scan-1700000000000.json
│   ├── scan-1700001000000.json
│   └── ...
│
├── decisions/                         # Architectural decisions
│   ├── decision-1700000000000.json
│   └── ...
│
└── projects/                          # Generated projects backup
    ├── cloudzero-proxy/
    │   ├── cloudzero-proxy.js
    │   ├── services/
    │   └── ...
    └── other-project/
```

---

## 📊 Data Formats

### Learning Data
```json
{
  "timestamp": 1700000000000,
  "version": "13.0",
  "type": "learning",
  "data": {
    "patterns": [[key, value], ...],
    "estimates": [...],
    "actuals": [...],
    "failures": [...]
  },
  "stats": {
    "patterns": 5,
    "estimates": 12,
    "actuals": 10,
    "failures": 2
  }
}
```

### Session Data
```json
{
  "sessionId": "session-abc123",
  "timestamp": 1700000000000,
  "version": "13.0",
  "type": "session",
  "data": {
    "analysis": {...},
    "session": {...}
  }
}
```

### Scan Report
```json
{
  "timestamp": 1700000000000,
  "version": "14.0",
  "type": "scan",
  "report": {...},
  "summary": {
    "projectsScanned": 27,
    "patternsDetected": 8,
    "recommendations": 3
  }
}
```

---

## 🔧 Advanced Configuration

### Custom Storage Prefix

```javascript
const magnus = new Magnus13Extended({
  cloudStorage: true,
  storagePrefix: 'my-company/magnus'  // Custom S3 path
});

// Files stored at: s3://bucket/my-company/magnus/...
```

### Disable Specific Backups

```javascript
const magnus = new Magnus13Extended({
  cloudStorage: true,
  autoBackup: true,
  backupOnGeneration: false  // Don't auto-backup sessions
});

// Learning data: auto-backed up
// Sessions: manual backup only
```

### Custom Backup Interval

```javascript
const magnus = new Magnus13Extended({
  cloudStorage: true,
  autoBackup: true,
  backupInterval: 600000  // 10 minutes
});
```

---

## ⚠️ Important Notes

### CloudZero Requirements

Magnus Cloud Storage uses CloudZero Proxy which requires:
- **Development**: Works with mocks (local files in ./dev-data/)
- **Production**: Requires AWS S3 credentials

```bash
# Production mode
export NODE_ENV=production
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
export AWS_REGION=us-east-1
export S3_BUCKET_NAME=your-bucket
```

### Data Size Considerations

- Learning data: ~1-10 KB per backup
- Sessions: ~5-50 KB per session
- Scan reports: ~10-100 KB per scan
- Projects: Variable (MB to GB)

**Recommendation**: Auto-backup learning/sessions, manual backup for large projects.

### Limitations (Current)

- **List operations**: CloudZero doesn't yet support listing files
  - Impact: Can't get "all backups", "all sessions", etc.
  - Workaround: Track timestamps locally or use known IDs
- **Restore latest**: Requires tracking latest timestamp
- **Sync download**: Not yet implemented (requires list)

**Future**: These will be added as CloudZero evolves.

---

## 🧪 Testing

### Test Cloud Storage

```bash
cd Magnus_13_universe
node magnus/magnus-cloud-examples.js
```

### Test Specific Example

```javascript
import { example1_basicUsage } from './magnus/magnus-cloud-examples.js';
await example1_basicUsage();
```

---

## 🐛 Troubleshooting

### Issue: Cloud storage not initializing

```
⚠️  Cloud Storage initialization failed: Connection error
```

**Solution**: Check CloudZero configuration
```bash
# Development mode (mocks)
export NODE_ENV=development

# Production mode
export NODE_ENV=production
export AWS_ACCESS_KEY_ID=your_key
export AWS_SECRET_ACCESS_KEY=your_secret
```

### Issue: Backup fails silently

```javascript
// Enable detailed logging
const magnus = new Magnus13Extended({
  cloudStorage: true,
  debug: true  // Enable debug logging
});
```

### Issue: Restore returns empty data

```
⚠️  Restore skipped: File not found
```

**Cause**: No backup exists yet  
**Solution**: Create a backup first
```javascript
await magnus.backupToCloud();
```

---

## 🎯 Best Practices

### 1. Enable Auto-Backup in Production
```javascript
const magnus = new Magnus13Extended({
  cloudStorage: true,
  autoBackup: true,
  backupInterval: 3600000  // 1 hour
});
```

### 2. Manual Backup Before Major Changes
```javascript
// Before regenerating learning data
await magnus.backupToCloud();
// Now safe to experiment
```

### 3. Regular Sync in Multi-Machine Setup
```javascript
// Start of day
await magnus.syncWithCloud();

// Work...

// End of day
await magnus.syncWithCloud();
```

### 4. Archive Important Sessions
```javascript
const session = await magnus.startGeneration(analysis);

if (importantProject) {
  await magnus.cloudStorage.archiveSession(session.sessionId, {
    ...sessionData,
    notes: 'Critical production deployment'
  });
}
```

### 5. Monitor Storage Stats
```javascript
const stats = await magnus.getCloudStats();
console.log('Cloud storage health:', stats);
```

---

## 📈 Roadmap

### v1.0 (Current)
- ✅ Basic backup/restore
- ✅ Auto-backup
- ✅ Session archival
- ✅ Learning data sync

### v1.1 (Planned)
- 🔄 List all backups
- 🔄 Incremental backups
- 🔄 Compression
- 🔄 Encryption

### v2.0 (Future)
- 🔮 Real-time sync
- 🔮 Collaborative editing
- 🔮 Version control
- 🔮 Conflict resolution

---

## 🎺 Examples

See `magnus-cloud-examples.js` for complete examples:

1. **Basic Usage** - Auto-backup everything
2. **Manual Backup** - On-demand backups
3. **Restore from Cloud** - Disaster recovery
4. **Multi-Machine Sync** - Work across devices
5. **Disaster Recovery** - Full restoration
6. **Cloud Stats** - Monitor storage

---

## 🌌 Integration dans Magnus Universe

Magnus Cloud Storage s'intègre parfaitement:

```
Magnus Universe
├── Magnus 13 Core        → Analyse & génération
├── CloudZero Proxy       → Services cloud (Payment, Email, etc.)
└── Magnus Cloud Storage  → Persistence Magnus via CloudZero
                            ↓
                         AWS S3
```

**Le cycle complet**:
1. Magnus analyse problème
2. Magnus génère solution (CloudZero)
3. Magnus utilise CloudZero (Storage)
4. Magnus sauvegarde learning (via CloudZero)
5. Magnus améliore (boucle infinie)

**C'est l'écosystème auto-suffisant!** 🔄

---

## 📞 Support

Pour questions ou problèmes:
1. Voir `magnus-cloud-examples.js` pour exemples
2. Consulter TROUBLESHOOTING ci-dessus
3. Vérifier configuration CloudZero

---

**Magnus Cloud Storage: Never lose your learning again.** ☁️✨

*Powered by Magnus 13 Extended + CloudZero Proxy*
