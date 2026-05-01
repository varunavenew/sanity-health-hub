# Translate all article + aboutPage NO content into EN via Lovable AI Gateway.
#
# Usage (PowerShell, from the `test/` folder):
#
#   $env:SANITY_TOKEN     = "sk..."          # your Sanity write token
#   $env:LOVABLE_API_KEY  = "lv_..."         # Lovable AI Gateway key
#   .\sanity\translate-to-english.ps1
#
# Optional:
#   $env:DRY_RUN = "1"   # preview without writing
#
# What it does:
#   - Finds every `article` and `aboutPage` document in Sanity
#   - For fields title / subtitle / excerpt / body / primaryImage.alt:
#       * If the field is still a plain string  -> wraps it as NO + adds EN
#       * If the field already has NO but no EN -> adds EN translation
#       * If EN already exists                  -> leaves it alone (idempotent)
#   - English text is produced by google/gemini-2.5-flash via Lovable AI Gateway

if (-not $env:SANITY_TOKEN) {
  Write-Error "SANITY_TOKEN is not set. Run: `$env:SANITY_TOKEN = 'sk...'"
  exit 1
}
if (-not $env:LOVABLE_API_KEY) {
  Write-Error "LOVABLE_API_KEY is not set. Run: `$env:LOVABLE_API_KEY = 'lv_...'"
  exit 1
}

$env:TRANSLATE = "1"

Write-Host "Running i18n migration with EN auto-translation..." -ForegroundColor Cyan
npx tsx .\sanity\migrate-i18n-fields.ts
