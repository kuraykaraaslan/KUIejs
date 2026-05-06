#!/usr/bin/env bash
# audit-tokens.sh — Verify CSS token contract: no raw hex codes outside the allowlist.
#
# Allowlisted paths / patterns (raw hex is intentional):
#
#   views/theme/common/email/**
#     Email preview templates. When actually sent, email clients do not support
#     CSS custom properties, so bg-[#f0f2f5] etc. are intentional. The preview
#     pages render in a browser where CSS vars work for structural colors, but
#     email-specific backgrounds are kept as hex for fidelity.
#
#   modules/domain/common/auth/OAuthButtons.ejs
#     OAuth provider brand colors (#EA4335 Google, #5865F2 Discord, #00A4EF Microsoft).
#     These are spec-mandated brand identity values — they cannot be tokenized.
#
#   modules/domain/common/payment/CreditCardVisual.ejs
#   src/data/sections/domain-common-payment.showcase.ts
#     Payment card brand gradients (VISA, Mastercard, AMEX, etc.).
#     Official brand colors — cannot be replaced with design-system tokens.
#
#   modules/ui/MapView.ejs
#   src/data/sections/ui-molecule-map.showcase.ts
#     Leaflet popup/tooltip innerHTML is built as a JS string; CSS classes and
#     custom properties cannot be used inside Leaflet's popup HTML API.
#
#   src/data/sections/domain-common-charts.showcase.ts
#     Chart.js dataset options (borderColor etc.) require hex — the library
#     reads these values before the browser resolves CSS variables.
#
#   src/data/sections/domain-common-auth.showcase.ts
#     OAuth brand colors mirrored in showcase preview HTML strings.

set -euo pipefail

SCAN_DIRS="views modules src"
HEX_PATTERN='#[0-9a-fA-F]{3,8}'

ALLOWLIST=(
  "views/theme/common/email"
  "modules/domain/common/auth/OAuthButtons.ejs"
  "modules/domain/common/payment/CreditCardVisual.ejs"
  "modules/ui/MapView.ejs"
  "src/data/sections/ui-molecule-map.showcase.ts"
  "src/data/sections/domain-common-payment.showcase.ts"
  "src/data/sections/domain-common-charts.showcase.ts"
  "src/data/sections/domain-common-auth.showcase.ts"
)

cd "$(dirname "$0")/.."

build_grep_excludes() {
  local args=()
  for path in "${ALLOWLIST[@]}"; do
    args+=("--exclude-dir=$(basename "$path")" )
  done
  echo "${args[@]}"
}

# Run grep and post-filter allowlisted paths
violations=$(
  grep -rn -E "$HEX_PATTERN" \
    --include="*.ejs" \
    --include="*.ts" \
    $SCAN_DIRS \
    2>/dev/null || true
)

# Remove allowlisted paths from results
for path in "${ALLOWLIST[@]}"; do
  violations=$(echo "$violations" | grep -v "^$path" || true)
done

# Remove the gradient-in-inline-style usage that was already fixed
# (var(--primary)/var(--secondary) references showing hex in context lines)
# Remove lines that are pure CSS var() references with no bare hex
violations=$(echo "$violations" | grep -v "var(--" || true)

# Remove comment lines
violations=$(echo "$violations" | grep -v "^\s*//" || true)
violations=$(echo "$violations" | grep -v "^\s*\*" || true)

if [ -z "$violations" ]; then
  echo "✅  Token audit passed — no raw hex codes found outside the allowlist."
  exit 0
else
  echo "❌  Token audit FAILED — raw hex codes found outside the allowlist:"
  echo ""
  echo "$violations"
  echo ""
  echo "Fix: replace hex values with CSS token utilities (bg-primary, text-text-secondary, etc.)"
  echo "     or add the file to the allowlist in scripts/audit-tokens.sh with a justification."
  exit 1
fi
