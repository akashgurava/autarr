#!/bin/bash

# shadcn-svelte Component Installation Script
# This script installs all required shadcn-svelte components for the Autarr project

echo "🎨 Installing shadcn-svelte components..."
echo ""

# Install all components at once
pnpm dlx shadcn-svelte@latest add button input label alert card badge

echo ""
echo "✅ Installation complete!"
echo ""
echo "📦 Installed components:"
echo "  - button (primary actions, variants: default, outline, link, etc.)"
echo "  - input (form inputs with validation styling)"
echo "  - label (accessible form labels)"
echo "  - alert (error/warning banners)"
echo "  - card (content containers with header/content)"
echo "  - badge (status indicators)"
echo ""
echo "📁 Components installed to: src/lib/components/ui/"
echo ""
echo "🚀 Next steps:"
echo "  1. Run: pnpm run dev"
echo "  2. Test the application"
echo "  3. Verify dark mode works"
echo "  4. Check accessibility"
echo ""
echo "📖 See SHADCN_MIGRATION.md for details"
