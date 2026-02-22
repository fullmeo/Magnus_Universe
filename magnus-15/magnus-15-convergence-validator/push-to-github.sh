#!/bin/bash
# Push Magnus 15 to GitHub

set -e

REPO_NAME="magnus-15-convergence-validator"
ORG="Kilo-Org"

echo "🚀 Pushing Magnus 15 to GitHub..."

# 1. Create GitHub repo
echo "📋 Creating GitHub repository..."
gh repo create $REPO_NAME --public --description "Code Convergence Validator - Validate AI-generated code against intent" --license MIT --org $ORG

# 2. Clone to local
echo "📂 Cloning repository..."
gh repo clone $ORG/$REPO_NAME

# 3. Copy files
echo "📝 Copying files..."
cp convergence_validator.py $REPO_NAME/
cp -r examples/ $REPO_NAME/

# 4. Initialize and push
echo "🔄 Committing and pushing..."
cd $REPO_NAME
git add .
git commit -m "v1.1 - Fine-tuned Inevitability + Fixed AST parsing + Examples

- Fine-tuned minimalism scoring for small projects
- Fixed _parse_intent() to properly parse INTENT.md
- Fixed _trace_constraint_in_code() with AST-based tracing
- Fixed _analyze_code() with real metrics calculation
- Added converged example showing CONVERGED verdict
- Added comparison table with simple_api and over_engineered examples"

git branch -M main
git push -u origin main

echo ""
echo "✅ Repository pushed successfully!"
echo ""
echo "📝 Next steps:"
echo "  1. Add topics: python, ai, code-quality, validation"
echo "  2. Create release: https://github.com/$ORG/$REPO_NAME/releases/new"
echo "  3. Share on social media!"
