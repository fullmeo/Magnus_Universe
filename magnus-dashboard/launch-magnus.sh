#!/bin/bash

# Magnus Infinity Launcher Script
# Simplified interface for running Magnus ∞

echo ""
echo "╔═══════════════════════════════════════════════════════╗"
echo "║                                                       ║"
echo "║              MAGNUS ∞ - LAUNCHER                      ║"
echo "║                                                       ║"
echo "║  Self-Improving AI with Transparency and Safety       ║"
echo "║                                                       ║"
echo "╚═══════════════════════════════════════════════════════╝"
echo ""

# Check if node is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js not found. Please install Node.js first."
    exit 1
fi

# Show menu
echo "Select test to run:"
echo ""
echo "1. 🔍 Quick Debug Test (15 cycles, ~30 seconds)"
echo "   → Verify autonomous decisions are working"
echo ""
echo "2. 📊 Extended Decision Test (100 cycles, ~3 minutes)"
echo "   → Capture first autonomous decision"
echo ""
echo "3. 🔄 Continuous Decision Test (until 10 decisions)"
echo "   → Capture multiple decisions and validate quality"
echo ""
echo "4. 🛠️  Scanner Validation (<1 second)"
echo "   → Test Magnus 14 pattern detection"
echo ""
echo "5. 🚀 Production Run (continuous)"
echo "   → Run Magnus Infinity in production mode"
echo ""
echo "6. 📚 View Documentation"
echo "   → Open guides and reports"
echo ""
echo "0. ❌ Exit"
echo ""

read -p "Enter choice [0-6]: " choice

case $choice in
    1)
        echo ""
        echo "🔍 Running Quick Debug Test..."
        echo ""
        node debug-decisions.js
        ;;
    2)
        echo ""
        echo "📊 Running Extended Decision Test..."
        echo ""
        node test-autonomous-decisions.js
        ;;
    3)
        echo ""
        echo "🔄 Running Continuous Decision Test..."
        echo ""
        node test-continuous-decisions.js
        ;;
    4)
        echo ""
        echo "🛠️  Running Scanner Validation..."
        echo ""
        node test-scanner.js
        ;;
    5)
        echo ""
        echo "🚀 Starting Magnus Infinity Production Run..."
        echo "   Press Ctrl+C to stop"
        echo ""
        ENABLE_DASHBOARD=false ENABLE_API=false node run-infinity.js
        ;;
    6)
        echo ""
        echo "📚 Available Documentation:"
        echo ""
        echo "   Core Status:"
        echo "   - MAGNUS-INFINITY-FINAL-STATUS.md"
        echo "   - AUTONOMOUS-DECISION-SUCCESS.md"
        echo "   - SCANNER-SUCCESS.md"
        echo ""
        echo "   Technical:"
        echo "   - MAGNUS-INFINITY-IMPROVEMENTS.md"
        echo "   - TESTING-GUIDE.md"
        echo ""
        echo "   Getting Started:"
        echo "   - README.md"
        echo "   - QUICK-START.md"
        echo ""
        read -p "Open which file? (or press Enter to skip): " docfile
        if [ -n "$docfile" ]; then
            if [ -f "$docfile" ]; then
                cat "$docfile" | less
            else
                echo "File not found: $docfile"
            fi
        fi
        ;;
    0)
        echo ""
        echo "👋 Goodbye!"
        echo ""
        exit 0
        ;;
    *)
        echo ""
        echo "❌ Invalid choice. Please run again and select 0-6."
        echo ""
        exit 1
        ;;
esac

echo ""
echo "✅ Complete!"
echo ""
