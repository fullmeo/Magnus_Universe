#!/bin/bash
# Magnus 15 - GitHub Repository Setup

set -e

REPO_NAME="magnus-15"
GITHUB_USERNAME="fullmeo"  # Update with your username

echo "🚀 Setting up Magnus 15 GitHub repository..."
echo ""

# 1. Create GitHub repo (requires gh CLI authenticated)
echo "📋 Step 1: Create GitHub repository"
gh repo create $REPO_NAME --public --description "Code Convergence Validator - Validate AI-generated code against intent" --license MIT

# 2. Clone to local
echo ""
echo "📂 Step 2: Clone repository"
gh repo clone $GITHUB_USERNAME/$REPO_NAME

# 3. Copy files
echo ""
echo "📝 Step 3: Copy Magnus 15 files"
cp -r convergence_engine.js magnus-15-public/
cp -r validation_test/*.py magnus-15-public/
cp -r validation_test/*.md magnus-15-public/

# 4. Initialize and push
echo ""
echo "🔄 Step 4: Initialize and push"
cd $REPO_NAME
git add .
git commit -m "🎉 Initial commit - Magnus 15 v1.0-beta"
git branch -M main
git push -u origin main

echo ""
echo "✅ Repository created and pushed!"
echo ""
echo "📝 Next steps:"
echo "  1. Create release: https://github.com/$GITHUB_USERNAME/$REPO_NAME/releases/new"
echo "  2. Add topics: python, code-quality, ai-validation, llm"
echo "  3. Share on social media!"
