# Push to GitHub

## Setup (one time)

```bash
# Add GitHub remote
git remote add origin https://github.com/YOUR_USERNAME/magnus.git

# Or for SSH
git remote add origin git@github.com:YOUR_USERNAME/magnus.git

# Verify
git remote -v
```

## Push v1.6

```bash
# Push all commits
git push origin master

# Push tag
git push origin v1.6

# Or push everything
git push origin master --tags
```

## Recommended Repo Settings (GitHub UI)

1. **Repository Settings**
   - Visibility: Public
   - Default branch: `master`

2. **Branch Protection** (optional)
   - Require pull request reviews
   - Require status checks to pass

3. **About Section**
   - Title: "Code Convergence Validator"
   - Description: "Three-pillar validator for AI-generated code with pluggable spec registry"
   - Homepage: (optional)
   - Topics: `ai`, `code-validation`, `convergence`, `crypto`, `gdpr`, `spec-registry`

4. **Releases**
   - Tag: `v1.6`
   - Title: "Magnus 15 v1.6: Spec Registry Release"
   - Description: (copy from CHANGELOG.md v1.6 section)

## Alternative: Initialize on GitHub First

```bash
# Create empty repo on GitHub (no README, no .gitignore)
# Then:

git remote add origin https://github.com/YOUR_USERNAME/magnus.git
git branch -M master
git push -u origin master --tags
```

---

**Current Status**: Ready to push (all commits done, .gitignore added)  
**Total commits**: 5  
**Lines of code**: ~2000  
**Documentation**: ~1500 lines
