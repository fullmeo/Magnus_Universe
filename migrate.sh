#!/bin/bash

# Magnus Universe - Migration Script
# Restructure Magnus_13 into Magnus Universe architecture

echo "🌌 Magnus Universe - Migration Script"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if we're in the right directory
if [ ! -d "Magnus_13" ] && [ ! -f "magnus-13.js" ]; then
    echo -e "${RED}❌ Error: Must run from Magnus_13 directory or its parent${NC}"
    echo "Usage: ./migrate.sh"
    exit 1
fi

echo -e "${BLUE}📁 Current structure detected${NC}"
echo ""

# Determine current location
if [ -f "magnus-13.js" ]; then
    # We're inside Magnus_13
    CURRENT_DIR="."
else
    # We're in parent directory
    CURRENT_DIR="Magnus_13"
fi

echo -e "${YELLOW}Step 1: Creating new directory structure${NC}"

# Create new structure
mkdir -p "$CURRENT_DIR/magnus"
mkdir -p "$CURRENT_DIR/generated/cloudzero-proxy"
mkdir -p "$CURRENT_DIR/docs"
mkdir -p "$CURRENT_DIR/.backup"

echo -e "${GREEN}✓ Directories created${NC}"
echo ""

echo -e "${YELLOW}Step 2: Backing up existing files${NC}"

# Backup existing structure
if [ -d "$CURRENT_DIR/CloudZero" ] || [ -d "$CURRENT_DIR/cloudzero-proxy" ]; then
    if [ -d "$CURRENT_DIR/CloudZero" ]; then
        cp -r "$CURRENT_DIR/CloudZero" "$CURRENT_DIR/.backup/cloudzero-original"
    fi
    if [ -d "$CURRENT_DIR/cloudzero-proxy" ]; then
        cp -r "$CURRENT_DIR/cloudzero-proxy" "$CURRENT_DIR/.backup/cloudzero-proxy-original"
    fi
    echo -e "${GREEN}✓ CloudZero backed up to .backup/${NC}"
fi

# Backup Magnus files
for file in magnus-13*.js magnus-13*.md; do
    if [ -f "$CURRENT_DIR/$file" ]; then
        cp "$CURRENT_DIR/$file" "$CURRENT_DIR/.backup/"
    fi
done

echo -e "${GREEN}✓ Magnus files backed up${NC}"
echo ""

echo -e "${YELLOW}Step 3: Moving Magnus framework files${NC}"

# Move Magnus core files
for file in magnus-13.js magnus-13-core.js magnus-13-learning-coherence.js magnus-13-examples.js; do
    if [ -f "$CURRENT_DIR/$file" ]; then
        mv "$CURRENT_DIR/$file" "$CURRENT_DIR/magnus/"
        echo -e "${GREEN}  ✓ Moved $file to magnus/${NC}"
    fi
done

# Move Magnus docs
for file in README.md QUICKSTART.md COMPARISON.md package.json; do
    if [ -f "$CURRENT_DIR/$file" ]; then
        mv "$CURRENT_DIR/$file" "$CURRENT_DIR/magnus/"
        echo -e "${GREEN}  ✓ Moved $file to magnus/${NC}"
    fi
done

echo ""

echo -e "${YELLOW}Step 4: Moving CloudZero to generated/${NC}"

# Move CloudZero
if [ -d "$CURRENT_DIR/CloudZero" ]; then
    # Move all CloudZero content
    mv "$CURRENT_DIR/CloudZero"/* "$CURRENT_DIR/generated/cloudzero-proxy/" 2>/dev/null
    rmdir "$CURRENT_DIR/CloudZero"
    echo -e "${GREEN}  ✓ Moved CloudZero to generated/cloudzero-proxy/${NC}"
elif [ -d "$CURRENT_DIR/cloudzero-proxy" ]; then
    # Already named correctly
    mv "$CURRENT_DIR/cloudzero-proxy"/* "$CURRENT_DIR/generated/cloudzero-proxy/" 2>/dev/null
    rmdir "$CURRENT_DIR/cloudzero-proxy"
    echo -e "${GREEN}  ✓ Moved cloudzero-proxy to generated/cloudzero-proxy/${NC}"
fi

echo ""

echo -e "${YELLOW}Step 5: Adding new documentation${NC}"

# Note: New docs should be copied from the restructuring files
echo -e "${BLUE}  ℹ️  New documentation files should be copied from restructuring output:${NC}"
echo "     - README.md (Magnus Universe main)"
echo "     - docs/PHILOSOPHY.md"
echo "     - docs/CATALOG.md"
echo "     - docs/GENERATION-GUIDE.md"
echo "     - generated/cloudzero-proxy/GENESIS.md"

echo ""

echo -e "${YELLOW}Step 6: Creating directory markers${NC}"

# Create .gitkeep files
touch "$CURRENT_DIR/magnus/.gitkeep"
touch "$CURRENT_DIR/generated/.gitkeep"
touch "$CURRENT_DIR/docs/.gitkeep"

echo -e "${GREEN}✓ Directory markers created${NC}"
echo ""

echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${GREEN}✅ Migration Complete!${NC}"
echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

echo "New structure:"
echo ""
echo "$CURRENT_DIR/"
echo "├── magnus/                    # 🧠 The Meta-Framework"
echo "│   ├── magnus-13.js"
echo "│   ├── magnus-13-core.js"
echo "│   ├── magnus-13-learning-coherence.js"
echo "│   └── magnus-13-examples.js"
echo "│"
echo "├── generated/                 # 🚀 Generated Projects"
echo "│   └── cloudzero-proxy/"
echo "│"
echo "├── docs/                      # 📚 Documentation"
echo "│   ├── PHILOSOPHY.md"
echo "│   ├── CATALOG.md"
echo "│   └── GENERATION-GUIDE.md"
echo "│"
echo "└── .backup/                   # 💾 Original files (safe to delete)"
echo ""

echo -e "${YELLOW}📝 Next steps:${NC}"
echo ""
echo "1. Copy new documentation files from restructuring output:"
echo "   - Main README.md to root"
echo "   - docs/PHILOSOPHY.md"
echo "   - docs/CATALOG.md"
echo "   - docs/GENERATION-GUIDE.md"
echo "   - generated/cloudzero-proxy/GENESIS.md"
echo ""
echo "2. Update any import paths in your code"
echo "   OLD: import Magnus13 from './magnus-13.js'"
echo "   NEW: import Magnus13 from './magnus/magnus-13.js'"
echo ""
echo "3. Test Magnus:"
echo "   cd magnus && node magnus-13-examples.js"
echo ""
echo "4. Test CloudZero:"
echo "   cd generated/cloudzero-proxy && npm run example"
echo ""
echo "5. Remove backup once verified:"
echo "   rm -rf .backup"
echo ""

echo -e "${BLUE}🌌 Welcome to Magnus Universe!${NC}"
echo ""
