#!/bin/bash
# كراون أوتو - Crown Auto SEO Verification Script
# This script verifies all SEO components are properly installed

echo "🔍 كراون أوتو - Crown Auto SEO Verification"
echo "=========================================="
echo ""

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Counter for verification
PASSED=0
FAILED=0

# Check SEO files exist
echo "📋 Checking SEO Files..."
echo ""

# 1. Check SEO Configuration Library
if [ -f "src/lib/seo.js" ]; then
    echo -e "${GREEN}✓${NC} SEO Configuration Library found (src/lib/seo.js)"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} SEO Configuration Library NOT found"
    ((FAILED++))
fi

# 2. Check Sitemap API
if [ -f "src/app/api/sitemap.xml/route.js" ]; then
    echo -e "${GREEN}✓${NC} Sitemap API found (src/app/api/sitemap.xml/route.js)"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Sitemap API NOT found"
    ((FAILED++))
fi

# 3. Check Robots.txt
if [ -f "public/robots.txt" ]; then
    echo -e "${GREEN}✓${NC} Robots.txt found (public/robots.txt)"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} Robots.txt NOT found"
    ((FAILED++))
fi

# 4. Check Manifest
if [ -f "public/manifest.json" ]; then
    echo -e "${GREEN}✓${NC} PWA Manifest found (public/manifest.json)"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} PWA Manifest NOT found"
    ((FAILED++))
fi

# 5. Check Documentation
if [ -f "SEO_IMPLEMENTATION_GUIDE.md" ]; then
    echo -e "${GREEN}✓${NC} SEO Implementation Guide found"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} SEO Implementation Guide NOT found"
    ((FAILED++))
fi

if [ -f "SEO_CHECKLIST.md" ]; then
    echo -e "${GREEN}✓${NC} SEO Checklist found"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} SEO Checklist NOT found"
    ((FAILED++))
fi

if [ -f "SEO_SUMMARY.md" ]; then
    echo -e "${GREEN}✓${NC} SEO Summary found"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} SEO Summary NOT found"
    ((FAILED++))
fi

if [ -f "SEO_QUICK_REFERENCE.md" ]; then
    echo -e "${GREEN}✓${NC} SEO Quick Reference found"
    ((PASSED++))
else
    echo -e "${RED}✗${NC} SEO Quick Reference NOT found"
    ((FAILED++))
fi

echo ""
echo "🔧 Checking Code Updates..."
echo ""

# 6. Check layout.js has SEO imports
if grep -q "import { SITE_CONFIG } from" src/app/layout.js; then
    echo -e "${GREEN}✓${NC} Layout.js has SEO imports"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Layout.js SEO imports may need update"
    ((FAILED++))
fi

# 7. Check page.jsx has SEO imports
if grep -q "import { generateMetadata, generateJsonLd, SITE_CONFIG }" src/app/page.jsx; then
    echo -e "${GREEN}✓${NC} Home page has SEO imports"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Home page SEO imports may need update"
    ((FAILED++))
fi

# 8. Check cars page has updated metadata
if grep -q "generateMetadata" src/app/\(main\)/cars/page.jsx; then
    echo -e "${GREEN}✓${NC} Cars page has SEO metadata"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} Cars page metadata may need update"
    ((FAILED++))
fi

echo ""
echo "⚙️ Checking Configuration..."
echo ""

# 9. Check env.example has SEO variables
if grep -q "NEXT_PUBLIC_SITE_URL" env.example; then
    echo -e "${GREEN}✓${NC} env.example has NEXT_PUBLIC_SITE_URL"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} env.example missing NEXT_PUBLIC_SITE_URL"
    ((FAILED++))
fi

if grep -q "NEXT_PUBLIC_GA_ID" env.example; then
    echo -e "${GREEN}✓${NC} env.example has NEXT_PUBLIC_GA_ID"
    ((PASSED++))
else
    echo -e "${YELLOW}⚠${NC} env.example missing NEXT_PUBLIC_GA_ID"
    ((FAILED++))
fi

echo ""
echo "📊 Summary"
echo "=========================================="
echo -e "${GREEN}Passed: $PASSED${NC}"
echo -e "${RED}Failed: $FAILED${NC}"
echo ""

if [ $FAILED -eq 0 ]; then
    echo -e "${GREEN}✓ All SEO components verified successfully!${NC}"
    echo ""
    echo "📝 Next Steps:"
    echo "1. Review SEO_QUICK_REFERENCE.md for quick start"
    echo "2. Read SEO_IMPLEMENTATION_GUIDE.md for full details"
    echo "3. Follow SEO_CHECKLIST.md for implementation tasks"
    echo "4. Update .env.local with your configuration"
    echo "5. Submit sitemap to Google Search Console"
    echo ""
    exit 0
else
    echo -e "${RED}✗ Some SEO components are missing!${NC}"
    echo ""
    echo "Please ensure all files are created and in place."
    echo "See SEO_CHECKLIST.md for required files."
    echo ""
    exit 1
fi
