#!/usr/bin/env bash
# Backfill EN per document type (avoids MyMemory rate limits). Resumable via cache.
set -euo pipefail
cd "$(dirname "$0")/.."
# Lingva proxy — 1s default is usually enough; raise if you see errors
export TRANSLATE_PROVIDER="${TRANSLATE_PROVIDER:-lingva}"
export TRANSLATE_DELAY_MS="${TRANSLATE_DELAY_MS:-1000}"
export CONTINUE_ON_ERROR="${CONTINUE_ON_ERROR:-1}"

TYPES=(
  treatmentCategory
  servicesPage
  specialistsPage
  insurancePage
  contactPage
  homepage
  treatment
  themePage
  article
  specialist
  clinicPage
  pricingPage
)

for t in "${TYPES[@]}"; do
  echo ""
  echo "========== $t =========="
  ONLY="$t" npx tsx sanity/backfill-english-i18n.ts || {
    echo "Stopped at $t — fix rate limit / quota, then re-run this script (cache resumes)."
    exit 1
  }
  sleep 5
done

echo ""
echo "All batches complete."
