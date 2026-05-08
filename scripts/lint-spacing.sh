#!/usr/bin/env bash
# lint-spacing.sh — Enforce Tailwind spacing scale: no arbitrary pixel values in
# padding, margin, gap, or space utilities.
#
# Flagged patterns (examples):
#   p-[13px]   m-[5px]   px-[24px]   py-[7px]
#   mt-[3px]   mb-[11px] gap-[9px]   space-x-[5px]
#
# NOT flagged (not spacing utilities):
#   w-[...px]  h-[...px]  text-[...px]  max-w-[...px]
#
# Why: arbitrary pixel spacing bypasses the 4px grid and breaks vertical rhythm.
# Use Tailwind's built-in spacing scale instead (p-4, mt-2, gap-3, etc.).

set -euo pipefail

cd "$(dirname "$0")/.."

SCAN_DIRS="views modules src"

# Matches padding (p, px, py, pt, pb, pl, pr, ps, pe),
#         margin  (m, mx, my, mt, mb, ml, mr, ms, me),
#         gap,
#         space-x / space-y / space-s / space-e
# followed by an arbitrary pixel value in brackets: [<digits>px]
SPACING_PATTERN='(^|[^a-zA-Z-])(p[xytblrse]?|m[xytblrse]?|gap|space-[xyseb])-\[[0-9]+px\]'

violations=$(
  grep -rn -P "$SPACING_PATTERN" \
    --include="*.ejs" \
    --include="*.ts" \
    --include="*.js" \
    $SCAN_DIRS \
    2>/dev/null || true
)

if [ -z "$violations" ]; then
  echo "✅  Spacing lint passed — no arbitrary pixel spacing values found."
  exit 0
else
  echo "❌  Spacing lint FAILED — arbitrary pixel spacing values found:"
  echo ""
  echo "$violations"
  echo ""
  echo "Fix: replace arbitrary pixel values with Tailwind's spacing scale."
  echo "     e.g. p-[13px] → p-3 (12px) or p-4 (16px)"
  echo "          mt-[5px] → mt-1 (4px) or mt-1.5 (6px)"
  echo "          gap-[9px] → gap-2 (8px) or gap-3 (12px)"
  exit 1
fi
