# English (EN) backfill for Sanity

All fields using `internationalizedArrayString`, `internationalizedArrayText`, and `internationalizedArrayBlockContent` get an **English (`en`)** value copied from Norwegian (`no`) via machine translation.

The field in your screenshot (**Sidetittel** on `homepage` → `title`) is included automatically.

## What gets translated

| Document types |
|----------------|
| `homepage`, `aboutPage`, `contactPage`, `servicesPage`, `insurancePage`, `pricingPage`, `specialistsPage`, `themePage`, `privacyPolicyPage` |
| `treatmentCategory`, `treatment`, `article`, `specialist`, `clinicPage` |
| Nested **SEO** (`metaTitle`, `metaDescription`) on any page |

**Not included (plain `string` / `text`, no EN column):** `faq`, `jobListing`, `product`, `testimonial`, `googleReview`

## Keys you need

| Variable | Required | Purpose |
|----------|----------|---------|
| `SANITY_TOKEN` | **Yes** | Write access to your dataset |
| `LOVABLE_API_KEY` | No | Better translations via Lovable AI (optional) |

```bash
cd test
cp .env.local.example .env.local
# Edit .env.local — add SANITY_TOKEN=sk…
```

Load env when running:

```bash
set -a && source .env.local && set +a
```

## Commands

**Preview (no writes):**

```bash
cd test
DRY_RUN=1 npx tsx sanity/backfill-english-i18n.ts
```

**One document type (e.g. homepage / Sidetittel):**

```bash
ONLY=homepage npx tsx sanity/backfill-english-i18n.ts
```

**Everything (batched, resumable):**

```bash
./sanity/run-english-backfill-batches.sh
```

**Overwrite existing EN text:**

```bash
FORCE=1 npx tsx sanity/backfill-english-i18n.ts
```

**Apply from cache only (if translation API failed mid-run):**

```bash
npx tsx sanity/apply-english-from-cache.ts
```

## How it works

1. Fetches all documents of each type from Sanity.
2. Finds every `no` entry in internationalized arrays where `en` is empty (unless `FORCE=1`).
3. Translates text (deduplicated) — cache: `sanity/.translation-cache.json` (resumable).
4. Patches documents with `en` values.

Manual quality strings (e.g. homepage title) are pre-seeded in `sanity/translation-cache.seed.json`.

## After running

1. Open Sanity Studio → any document → switch **EN** tab / language.
2. Review medical wording; fix important pages manually if needed.
3. Publish documents when satisfied.

## Localized URL slugs

Schemas with `URL-slug` use `internationalizedArraySlug` (NO + EN per document).

**Migrate existing `slug.current` values:**

```bash
cd test
npm run migrate:slugs:dry   # preview
npm run migrate:slugs       # apply
```

Then add English slugs in Studio (or copy NO slug and edit). English backfill does not auto-translate slugs — set them manually or generate from the EN title in Studio.

## Troubleshooting

| Issue | Fix |
|-------|-----|
| Rate limit / translation errors | Re-run the same command; cache resumes. Or `OFFLINE_ONLY=1` + `apply-english-from-cache.ts` |
| EN still empty on one type | `ONLY=thatType npx tsx sanity/backfill-english-i18n.ts` |
| Wrong EN text | Edit in Studio, or `FORCE=1` to re-translate |
