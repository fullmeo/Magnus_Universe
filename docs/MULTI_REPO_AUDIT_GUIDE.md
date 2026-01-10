# 🔍 Guide d'Audit Multi-Repositories

Guide complet pour analyser **tous vos repositories** pour la vulnérabilité XSS React Router (GHSA-3cgp-3xvw-98x8).

---

## 🎯 Options d'Audit

Vous avez **3 méthodes** pour scanner tous vos repositories :

### Méthode 1: Script Bash (Rapide et Simple)
**Meilleur pour:** Scan rapide d'un dossier de projets locaux

### Méthode 2: Script Node.js (Complet et Détaillé)
**Meilleur pour:** Rapports détaillés avec export JSON/Markdown

### Méthode 3: Manuel avec GitHub CLI
**Meilleur pour:** Scan de tous vos repos GitHub

---

## 📋 Méthode 1: Script Bash (Recommandé pour scan rapide)

### Installation
```bash
# Donner les permissions d'exécution
chmod +x scripts/audit-xss-react-router.sh
```

### Usage

#### Scanner un seul repository
```bash
./scripts/audit-xss-react-router.sh /path/to/your/project
```

#### Scanner tous les repos dans un dossier
```bash
./scripts/audit-xss-react-router.sh --all ~/projects
```

#### Exemples
```bash
# Scanner le dossier courant
./scripts/audit-xss-react-router.sh .

# Scanner tous vos projets
./scripts/audit-xss-react-router.sh --all ~/workspace

# Scanner un projet spécifique
./scripts/audit-xss-react-router.sh ~/workspace/my-react-app
```

### Output
```
╔════════════════════════════════════════════════════════════════╗
║   XSS React Router Security Audit (GHSA-3cgp-3xvw-98x8)       ║
╚════════════════════════════════════════════════════════════════╝

📁 Scanning: my-react-app
   Path: /home/user/workspace/my-react-app
─────────────────────────────────────────────────────────────
📦 Found: react-router@7.5.0
   ❌ VULNERABLE VERSION (needs 7.9.0+)

🔍 Searching for vulnerable patterns...
   🚨 Found 3 file(s) with script:ld+json

═══════════════════════════════════════════════════════════════
📊 RISK ASSESSMENT
═══════════════════════════════════════════════════════════════
🚨 HIGH RISK - Vulnerable version detected
   CRITICAL: script:ld+json usage found!
   This is actively exploitable if using untrusted data.

📋 REQUIRED ACTIONS:

2. Upgrade react-router:
   npm install react-router@7.9.0

3. Review and sanitize all script:ld+json data:
   Files to review:
   - app/routes/product.tsx
   - app/routes/blog.tsx
   - app/routes/user.tsx

4. Add sanitization:
   import { sanitizeJSONLD } from './utils/security';
   return { 'script:ld+json': sanitizeJSONLD(data) };

5. Run security audit after updates:
   npm audit fix
   npm test

💾 Detailed report saved: .security-audit-20260110.txt
```

---

## 📋 Méthode 2: Script Node.js (Recommandé pour rapports détaillés)

### Usage

#### Scanner tous les repos dans un dossier local
```bash
node scripts/audit-all-repos.js --local ~/projects
```

#### Générer un rapport Markdown
```bash
node scripts/audit-all-repos.js --local ~/projects --output security-audit.md
```

#### Générer un rapport JSON
```bash
node scripts/audit-all-repos.js --local ~/projects --report-format json --output audit.json
```

#### Lister vos repos GitHub (nécessite gh CLI)
```bash
# Installer gh CLI si nécessaire
# macOS: brew install gh
# Linux: voir https://cli.github.com/

# Authentifier
gh auth login

# Lister vos repos
node scripts/audit-all-repos.js --github-user fullmeo
```

### Output
```
╔════════════════════════════════════════════════════════════════╗
║   Multi-Repository XSS Audit (GHSA-3cgp-3xvw-98x8)            ║
╚════════════════════════════════════════════════════════════════╝

Found 12 repositories in /home/user/projects

📁 Scanning: project-alpha
   Path: /home/user/projects/project-alpha
   ✅ No React Router/Remix dependencies

📁 Scanning: ecommerce-app
   Path: /home/user/projects/ecommerce-app
   🚨 CRITICAL: Vulnerable version + script:ld+json usage!
   📦 react-router: 7.3.0
   🔍 script:ld+json found in 5 file(s)

📁 Scanning: blog-platform
   Path: /home/user/projects/blog-platform
   ❌ HIGH: Vulnerable version detected
   📦 @remix-run/react: 2.15.0

...

═══════════════════════════════════════════════════════════════
                    AUDIT SUMMARY
═══════════════════════════════════════════════════════════════

Total Repositories: 12
🚨 CRITICAL: 1
❌ HIGH: 2
⚠️  MEDIUM: 1
✅ LOW: 3
🟢 SAFE: 5

💾 Report saved to: security-audit.md
```

### Rapport Markdown Généré
```markdown
# XSS Security Audit Report (GHSA-3cgp-3xvw-98x8)

**Generated:** 2026-01-10T12:00:00.000Z
**Vulnerability:** XSS via script:ld+json in React Router/Remix SSR
**Severity:** HIGH

## 📊 Summary

| Risk Level | Count |
|------------|-------|
| 🚨 CRITICAL | 1 |
| ❌ HIGH | 2 |
| ⚠️  MEDIUM | 1 |
| ✅ LOW | 3 |
| 🟢 SAFE | 5 |
| **TOTAL** | **12** |

## 🚨 CRITICAL RISK Repositories

### ecommerce-app

- **Path:** `/home/user/projects/ecommerce-app`
- **Vulnerable:** react-router@7.3.0 → 7.9.0
- **script:ld+json files:** 5

**Recommendations:**
- Upgrade react-router from 7.3.0 to 7.9.0
- Sanitize all script:ld+json data in 5 file(s)
- Review all meta() exports for untrusted data sources

...
```

---

## 📋 Méthode 3: Scan GitHub Complet (Tous vos repos)

### Étape 1: Installer GitHub CLI
```bash
# macOS
brew install gh

# Linux (Debian/Ubuntu)
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | sudo dd of=/usr/share/keyrings/githubcli-archive-keyring.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | sudo tee /etc/apt/sources.list.d/github-cli.list > /dev/null
sudo apt update
sudo apt install gh

# Windows
winget install --id GitHub.cli
```

### Étape 2: Authentifier
```bash
gh auth login
```

### Étape 3: Lister tous vos repositories
```bash
gh repo list fullmeo --limit 1000 --json name,url
```

### Étape 4: Cloner et scanner

#### Option A: Clone automatique + scan
```bash
#!/bin/bash
# Script pour cloner et scanner tous vos repos

GITHUB_USER="fullmeo"
WORKSPACE="$HOME/github-audit"

mkdir -p "$WORKSPACE"
cd "$WORKSPACE"

# Obtenir liste de repos
gh repo list "$GITHUB_USER" --limit 1000 --json name --jq '.[].name' | while read -r repo; do
  echo "Cloning $repo..."

  # Clone si n'existe pas
  if [ ! -d "$repo" ]; then
    gh repo clone "$GITHUB_USER/$repo"
  fi
done

# Scanner tous les repos
cd ~/Magnus_Universe
node scripts/audit-all-repos.js --local "$WORKSPACE" --output "$WORKSPACE/security-audit-report.md"
```

#### Option B: Scanner repos déjà clonés
```bash
# Si vous avez déjà tous vos repos dans ~/workspace
node scripts/audit-all-repos.js --local ~/workspace --output full-audit-report.md
```

---

## 🎯 Interprétation des Résultats

### Niveaux de Risque

#### 🚨 CRITICAL
- **Condition:** Version vulnérable + usage `script:ld+json`
- **Risque:** Exploitable immédiatement
- **Action:** Patcher AUJOURD'HUI

#### ❌ HIGH
- **Condition:** Version vulnérable détectée
- **Risque:** Potentiellement exploitable
- **Action:** Patcher dans 24-48h

#### ⚠️ MEDIUM
- **Condition:** Version sûre mais patterns suspects
- **Risque:** Futur risque si version downgrade
- **Action:** Code review + sanitization préventive

#### ✅ LOW
- **Condition:** Version sûre, pas de patterns suspects
- **Risque:** Minimal
- **Action:** Maintenir les versions

#### 🟢 SAFE
- **Condition:** Pas de React Router/Remix
- **Risque:** Aucun
- **Action:** Aucune

---

## 🔧 Actions par Niveau de Risque

### Pour CRITICAL et HIGH

1. **Upgrade immédiat**
```bash
cd /path/to/vulnerable/repo

# React Router
npm install react-router@7.9.0

# Remix
npm install @remix-run/react@2.17.1

# Vérifier
npm audit
```

2. **Sanitize script:ld+json**
```javascript
// AVANT (vulnérable)
export async function meta({ params }) {
  const product = await db.getProduct(params.id);
  return {
    'script:ld+json': {
      name: product.name,  // ⚠️ Untrusted
      price: product.price
    }
  };
}

// APRÈS (sécurisé)
import { sanitizeJSONLD } from '../utils/security';

export async function meta({ params }) {
  const product = await db.getProduct(params.id);
  return {
    'script:ld+json': sanitizeJSONLD({
      name: product.name,
      price: product.price
    })
  };
}
```

3. **Créer utils/security.js**
```javascript
// Copier depuis Magnus Universe
export function sanitizeJSONLD(data) {
  const jsonString = JSON.stringify(data);
  return jsonString
    .replace(/<\//g, '<\\/')
    .replace(/<!--/g, '<\\!--')
    .replace(/-->/g, '--\\>')
    .replace(/<script/gi, '<\\script')
    .replace(/javascript:/gi, 'javascript\\:');
}
```

4. **Tester**
```bash
npm test
npm run build
npm audit
```

5. **Commit + Deploy**
```bash
git add .
git commit -m "security: Fix XSS vulnerability GHSA-3cgp-3xvw-98x8"
git push
```

---

## 📊 Exemple de Workflow Complet

### Scenario: Vous avez 50 repositories GitHub

```bash
# 1. Créer un workspace temporaire
mkdir ~/xss-audit-2026
cd ~/xss-audit-2026

# 2. Cloner tous vos repos (parallèle avec xargs)
gh repo list fullmeo --limit 1000 --json name --jq '.[].name' | \
  xargs -P 5 -I {} gh repo clone fullmeo/{}

# 3. Scanner tous les repos
cd ~/Magnus_Universe
node scripts/audit-all-repos.js --local ~/xss-audit-2026 --output ~/xss-audit-report.md

# 4. Ouvrir le rapport
cat ~/xss-audit-report.md

# 5. Pour chaque repo CRITICAL/HIGH:
cd ~/xss-audit-2026/vulnerable-repo
npm install react-router@7.9.0  # ou @remix-run/react@2.17.1
# Ajouter sanitization
npm test
git commit -am "security: Fix GHSA-3cgp-3xvw-98x8"
git push

# 6. Nettoyer
rm -rf ~/xss-audit-2026
```

---

## 🚀 Automatisation CI/CD

### GitHub Actions Workflow
```yaml
# .github/workflows/security-audit.yml
name: XSS Security Audit

on:
  schedule:
    - cron: '0 0 * * 0'  # Hebdomadaire
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'

      - name: Clone Magnus Universe (audit tools)
        run: |
          git clone https://github.com/fullmeo/Magnus_Universe.git

      - name: Run Security Audit
        run: |
          node Magnus_Universe/scripts/audit-all-repos.js --local . --output audit-report.md

      - name: Upload Report
        uses: actions/upload-artifact@v3
        with:
          name: security-audit-report
          path: audit-report.md

      - name: Fail if vulnerabilities found
        run: |
          if grep -q "CRITICAL\|HIGH" audit-report.md; then
            echo "::error::Security vulnerabilities detected!"
            exit 1
          fi
```

---

## 📚 Résumé des Commandes

```bash
# Scan rapide d'un repo
./scripts/audit-xss-react-router.sh /path/to/repo

# Scan de tous les repos dans un dossier
./scripts/audit-xss-react-router.sh --all ~/projects

# Rapport détaillé Markdown
node scripts/audit-all-repos.js --local ~/projects --output audit.md

# Rapport JSON pour CI/CD
node scripts/audit-all-repos.js --local ~/projects --report-format json --output audit.json

# Lister vos repos GitHub
gh repo list fullmeo --limit 1000

# Clone massif + scan
gh repo list fullmeo --json name --jq '.[].name' | xargs -P 5 -I {} gh repo clone fullmeo/{}
node scripts/audit-all-repos.js --local . --output full-audit.md
```

---

## 🔒 Checklist Finale

Après avoir scanné tous vos repositories :

- [ ] Tous les repos scannés (aucun oublié)
- [ ] Rapport généré et sauvegardé
- [ ] Repos CRITICAL patchés immédiatement
- [ ] Repos HIGH patchés dans 24-48h
- [ ] Repos MEDIUM : code review planifiée
- [ ] Tests exécutés sur tous les repos patchés
- [ ] Commits poussés vers remote
- [ ] Déploiements en production complétés
- [ ] Audit documentation à jour
- [ ] Prochain audit planifié (2026-04-10)

---

## 💡 Conseils Pro

### Performance
- Utilisez `xargs -P` pour cloner en parallèle (5-10 processus)
- Scannez les repos par lots si vous en avez 100+
- Utilisez SSD pour workspace temporaire

### Sécurité
- Ne committez JAMAIS les rapports d'audit (fichiers sensibles)
- Ajoutez `*.security-audit-*.txt` à `.gitignore`
- Utilisez des branches de sécurité pour les patches

### Automatisation
- Ajoutez audit hebdomadaire dans CI/CD
- Créez Slack/Discord webhook pour alertes CRITICAL
- Utilisez Dependabot pour alertes automatiques

---

## 🆘 Aide et Support

### Le script échoue
```bash
# Vérifier permissions
chmod +x scripts/*.sh

# Vérifier Node.js version
node --version  # Doit être >= 16

# Vérifier gh CLI
gh --version
gh auth status
```

### Faux positifs
Si un repo est marqué vulnérable mais vous pensez que non :
1. Vérifiez `package.json` manuellement
2. Exécutez `npm list react-router @remix-run/react`
3. Cherchez `script:ld+json` manuellement : `grep -r "script:ld+json" src/`

### Questions
- Ouvrez une issue : https://github.com/fullmeo/Magnus_Universe/issues
- Consultez : docs/SECURITY_ANALYSIS_XSS_REACT_ROUTER.md

---

**Prochaine mise à jour:** 2026-04-10 (audit trimestriel)
