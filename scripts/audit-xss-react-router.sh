#!/bin/bash
#
# XSS React Router Vulnerability Audit Script
# GHSA-3cgp-3xvw-98x8 Scanner
#
# Usage:
#   ./scripts/audit-xss-react-router.sh [repository-path]
#
# If no path provided, scans current directory
# For multiple repos, run in parent directory with --all flag
#
# Author: Magnus Security Team
# Date: 2026-01-10
# Version: 1.0.0

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Vulnerability details
VULN_ID="GHSA-3cgp-3xvw-98x8"
CVE_DESC="XSS via script:ld+json in React Router/Remix SSR meta()"

# Version ranges (vulnerable)
REMIX_VULNERABLE="1.15.0 to 2.17.0"
ROUTER_VULNERABLE="7.0.0 to 7.8.2"

# Fixed versions
REMIX_FIXED="2.17.1+"
ROUTER_FIXED="7.9.0+"

echo -e "${CYAN}${BOLD}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║   XSS React Router Security Audit (GHSA-3cgp-3xvw-98x8)       ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

# Parse arguments
SCAN_ALL=false
TARGET_PATH="${1:-.}"

if [[ "$1" == "--all" ]]; then
  SCAN_ALL=true
  TARGET_PATH="${2:-.}"
fi

# Function to extract version from package.json
extract_version() {
  local package_name=$1
  local package_json=$2

  if [[ -f "$package_json" ]]; then
    # Check dependencies
    local version=$(grep -A1 "\"$package_name\"" "$package_json" | grep -oE '[0-9]+\.[0-9]+\.[0-9]+' | head -1)
    echo "$version"
  fi
}

# Function to compare versions (simplified)
version_in_range() {
  local version=$1
  local min_version=$2
  local max_version=$3

  # Convert versions to comparable format (remove dots)
  local v=$(echo "$version" | tr -d '.')
  local min_v=$(echo "$min_version" | tr -d '.')
  local max_v=$(echo "$max_version" | tr -d '.')

  [[ $v -ge $min_v && $v -le $max_v ]]
}

# Function to audit a single repository
audit_repository() {
  local repo_path=$1
  local repo_name=$(basename "$repo_path")

  echo -e "\n${BLUE}${BOLD}📁 Scanning: $repo_name${NC}"
  echo -e "${BLUE}   Path: $repo_path${NC}"
  echo "─────────────────────────────────────────────────────────────"

  # Check if package.json exists
  local package_json="$repo_path/package.json"
  if [[ ! -f "$package_json" ]]; then
    echo -e "${YELLOW}⚠️  No package.json found - skipping${NC}"
    return 0
  fi

  # Initialize flags
  local has_remix=false
  local has_router=false
  local is_vulnerable=false
  local remix_version=""
  local router_version=""
  local has_meta_usage=false
  local has_jsonld=false
  local framework_mode=false

  # Extract versions
  remix_version=$(extract_version "@remix-run/react" "$package_json")
  router_version=$(extract_version "react-router" "$package_json")

  # Check for package presence
  if [[ -n "$remix_version" ]]; then
    has_remix=true
    echo -e "${CYAN}📦 Found: @remix-run/react@$remix_version${NC}"

    # Check if vulnerable
    if version_in_range "$remix_version" "1.15.0" "2.17.0"; then
      is_vulnerable=true
      echo -e "${RED}   ❌ VULNERABLE VERSION (needs 2.17.1+)${NC}"
    else
      echo -e "${GREEN}   ✅ Safe version${NC}"
    fi
  fi

  if [[ -n "$router_version" ]]; then
    has_router=true
    echo -e "${CYAN}📦 Found: react-router@$router_version${NC}"

    # Check if vulnerable
    if version_in_range "$router_version" "7.0.0" "7.8.2"; then
      is_vulnerable=true
      echo -e "${RED}   ❌ VULNERABLE VERSION (needs 7.9.0+)${NC}"
    else
      echo -e "${GREEN}   ✅ Safe version${NC}"
    fi
  fi

  # Search for vulnerable code patterns
  if [[ $has_remix == true ]] || [[ $has_router == true ]]; then
    echo -e "\n${MAGENTA}🔍 Searching for vulnerable patterns...${NC}"

    # Search for meta() exports
    meta_files=$(find "$repo_path" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) -exec grep -l "export.*meta" {} \; 2>/dev/null || true)
    if [[ -n "$meta_files" ]]; then
      has_meta_usage=true
      meta_count=$(echo "$meta_files" | wc -l)
      echo -e "${YELLOW}   ⚠️  Found $meta_count file(s) with meta() exports${NC}"
    fi

    # Search for script:ld+json
    jsonld_files=$(find "$repo_path" -type f \( -name "*.js" -o -name "*.jsx" -o -name "*.ts" -o -name "*.tsx" \) -exec grep -l "script:ld+json" {} \; 2>/dev/null || true)
    if [[ -n "$jsonld_files" ]]; then
      has_jsonld=true
      jsonld_count=$(echo "$jsonld_files" | wc -l)
      echo -e "${RED}   🚨 Found $jsonld_count file(s) with script:ld+json${NC}"
      framework_mode=true
    fi
  fi

  # Generate report
  echo ""
  echo "═══════════════════════════════════════════════════════════════"
  echo -e "${BOLD}📊 RISK ASSESSMENT${NC}"
  echo "═══════════════════════════════════════════════════════════════"

  if [[ $has_remix == false ]] && [[ $has_router == false ]]; then
    echo -e "${GREEN}${BOLD}✅ NO RISK - React Router/Remix not used${NC}"
    echo -e "   Action: None required"
    return 0
  fi

  if [[ $is_vulnerable == true ]]; then
    echo -e "${RED}${BOLD}🚨 HIGH RISK - Vulnerable version detected${NC}"

    if [[ $has_jsonld == true ]]; then
      echo -e "${RED}   CRITICAL: script:ld+json usage found!${NC}"
      echo -e "${RED}   This is actively exploitable if using untrusted data.${NC}"
    fi

    echo ""
    echo -e "${YELLOW}${BOLD}📋 REQUIRED ACTIONS:${NC}"
    echo ""

    if [[ $has_remix == true ]]; then
      echo -e "${YELLOW}1. Upgrade @remix-run/react:${NC}"
      echo -e "   npm install @remix-run/react@2.17.1"
    fi

    if [[ $has_router == true ]]; then
      echo -e "${YELLOW}2. Upgrade react-router:${NC}"
      echo -e "   npm install react-router@7.9.0"
    fi

    if [[ $has_jsonld == true ]]; then
      echo -e "${YELLOW}3. Review and sanitize all script:ld+json data:${NC}"
      echo -e "   Files to review:"
      echo "$jsonld_files" | while read -r file; do
        echo -e "   - ${file#$repo_path/}"
      done
      echo ""
      echo -e "${YELLOW}4. Add sanitization:${NC}"
      echo -e "   import { sanitizeJSONLD } from './utils/security';"
      echo -e "   return { 'script:ld+json': sanitizeJSONLD(data) };"
    fi

    echo ""
    echo -e "${YELLOW}5. Run security audit after updates:${NC}"
    echo -e "   npm audit fix"
    echo -e "   npm test"

  elif [[ $has_meta_usage == true ]] || [[ $has_jsonld == true ]]; then
    echo -e "${YELLOW}${BOLD}⚠️  MEDIUM RISK - Versions safe, but patterns detected${NC}"
    echo ""
    echo -e "${YELLOW}📋 RECOMMENDED ACTIONS:${NC}"
    echo -e "   1. Verify all meta() data sources are trusted"
    echo -e "   2. Add input sanitization as best practice"
    echo -e "   3. Implement Content Security Policy headers"

  else
    echo -e "${GREEN}${BOLD}✅ LOW RISK - Safe versions, no vulnerable patterns${NC}"
    echo -e "   Action: Monitor for updates, maintain current versions"
  fi

  echo "═══════════════════════════════════════════════════════════════"

  # Save detailed report
  local report_file="$repo_path/.security-audit-$(date +%Y%m%d).txt"
  {
    echo "Security Audit Report"
    echo "Repository: $repo_name"
    echo "Date: $(date -Iseconds)"
    echo "Vulnerability: $VULN_ID"
    echo ""
    echo "Findings:"
    echo "  Remix: ${remix_version:-Not installed}"
    echo "  React Router: ${router_version:-Not installed}"
    echo "  Vulnerable: $is_vulnerable"
    echo "  meta() usage: $has_meta_usage"
    echo "  script:ld+json: $has_jsonld"
    echo ""
    if [[ $has_jsonld == true ]]; then
      echo "Files with script:ld+json:"
      echo "$jsonld_files"
    fi
  } > "$report_file"

  echo -e "\n${CYAN}💾 Detailed report saved: ${report_file#$repo_path/}${NC}"
}

# Main execution
if [[ $SCAN_ALL == true ]]; then
  echo -e "${MAGENTA}Scanning all repositories in: $TARGET_PATH${NC}\n"

  # Find all directories with package.json
  find "$TARGET_PATH" -maxdepth 2 -type f -name "package.json" | while read -r pkg; do
    repo_dir=$(dirname "$pkg")
    audit_repository "$repo_dir"
  done

else
  audit_repository "$TARGET_PATH"
fi

echo -e "\n${CYAN}${BOLD}"
echo "╔════════════════════════════════════════════════════════════════╗"
echo "║                    Audit Complete                              ║"
echo "╚════════════════════════════════════════════════════════════════╝"
echo -e "${NC}"

echo -e "${BLUE}📚 Resources:${NC}"
echo -e "   Advisory: https://github.com/remix-run/react-router/security/advisories/GHSA-3cgp-3xvw-98x8"
echo -e "   OWASP XSS: https://owasp.org/www-community/attacks/xss/"
echo ""
