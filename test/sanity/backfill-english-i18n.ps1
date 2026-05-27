# Backfill English translations (no LOVABLE_API_KEY required — uses Google Translate + cache).
#
# Usage (PowerShell, from the `test/` folder):
#
#   $env:SANITY_TOKEN = "sk..."   # required (see test/.env.local.example)
#   .\sanity\backfill-english-i18n.ps1
#
# Optional:
#   $env:DRY_RUN = "1"
#   $env:ONLY = "aboutPage,article"
#   $env:TRANSLATE_DELAY_MS = "5000"   # slower = fewer rate limits
#   $env:CONTINUE_ON_ERROR = "1"       # keep going on API errors
#   $env:LOVABLE_API_KEY = "lv_..."    # optional higher-quality AI

Write-Host "Backfilling English i18n (free translator)..." -ForegroundColor Cyan
npx tsx .\sanity\backfill-english-i18n.ts
