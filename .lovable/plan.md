## Goal

Move all static UI strings from `src/i18n/locales/nb.json` and `en.json` into Sanity so the customer can edit every label (nav, hero, stats, CTAs, footer, forms, etc.) without code changes — while keeping the JSON files as offline fallback.

## Architecture

Flat key/value model — easiest for both editors and migration. One singleton document `uiTranslations` containing one array `entries[]`. Each entry:

```
{
  key: "nav.services",        // dot-path matching i18next keys
  nb:  "Tjenester",
  en:  "Services",
  note: "Header navigation"   // optional editor hint
}
```

Grouped in Studio by the first path segment (`nav`, `hero`, `stats`, `services`, `specialists`, `reviews`, `faq`, `booking`, `cta`, `footer`, `about`, `contact`, `insurance`, `pricing`, `news`, `clinicGrid`, `valueBadges`, `h1`, `tagline`) via a Studio `group` derived from the key prefix.

We deliberately do NOT use `internationalizedArrayString` here — flat `nb` + `en` fields are simpler for ~180 short strings and faster to migrate/query.

## Files

**New**
- `test/schemaTypes/uiTranslations.ts` — singleton schema, `entries[]` with `key` (required, unique), `nb`, `en`, optional `note`
- `test/sanity/migrate-ui-translations.ts` — reads both JSON files, flattens nested objects to dot-paths, upserts a single `uiTranslations` document with id `uiTranslations`
- `src/hooks/useUiTranslations.ts` — fetches the document once on app start, flattens `entries[]` back into nested resource bundles, calls `i18n.addResourceBundle('nb'|'en', 'translation', ..., true, true)` to override JSON fallback

**Edited**
- `test/schemaTypes/index.ts` — register `uiTranslations`
- `test/sanity.config.ts` — add to "📐 Mastermaler" group, mark as singleton with `S.documentTypeListItem('uiTranslations').title('🌐 UI-tekster')`
- `src/i18n/config.ts` — keep JSON as initial resources (fallback)
- `src/App.tsx` (or root) — mount `useUiTranslations()` once so Sanity overrides take effect after first fetch

## Migration script behavior

- Recursive flatten: `{ nav: { services: "..." } }` → `nav.services`
- Loads both files, builds union of keys
- Outputs single doc — re-runs are idempotent (replaces `entries[]`)
- Run with: `npx tsx test/sanity/migrate-ui-translations.ts`

## Runtime override flow

1. App loads → i18next initialised from JSON (instant, no flash)
2. `useUiTranslations()` fetches Sanity doc in background
3. On success → `addResourceBundle(..., deep=true, overwrite=true)` → all `t()` calls re-render with Sanity values

If Sanity fetch fails → JSON values remain. No layout shift since strings are same length class.

## Out of scope

- Translating Sanity-managed content (already handled by `internationalizedArray` per memory `features/sanity-i18n`)
- Adding new languages beyond nb/en
- Editing the JSON files — they stay as-is for fallback
