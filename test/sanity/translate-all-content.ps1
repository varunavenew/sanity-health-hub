# Translate ALL Sanity content (treatments, specialists, FAQ, pages, etc.)
# into English via Lovable AI Gateway.
#
# Usage (PowerShell, from the `test/` folder):
#
#   $env:SANITY_TOKEN     = "sk..."     # Sanity write token
#   $env:LOVABLE_API_KEY  = "lv_..."    # Lovable AI Gateway key
#   .\sanity\translate-all-content.ps1
#
# Optional:
#   $env:DRY_RUN = "1"             # preview without writing
#   $env:FORCE   = "1"             # overwrite existing _en values
#   $env:ONLY    = "treatment,faq" # limit to specific document types
#
# This is non-breaking: it adds parallel `<field>_en` fields next to the
# Norwegian fields. Run multiple times safely (idempotent).
#
# Note: `article` and `aboutPage` use the `internationalizedArray` plugin
# instead — translate those with `translate-to-english.ps1`.

if (-not $env:SANITY_TOKEN) {
  Write-Error "SANITY_TOKEN is not set. Run: `$env:SANITY_TOKEN = 'sk...'"
  exit 1
}
if (-not $env:LOVABLE_API_KEY) {
  Write-Error "LOVABLE_API_KEY is not set. Run: `$env:LOVABLE_API_KEY = 'lv_...'"
  exit 1
}

Write-Host "Translating all Sanity content to English..." -ForegroundColor Cyan
npx tsx .\sanity\translate-all-content.ts
