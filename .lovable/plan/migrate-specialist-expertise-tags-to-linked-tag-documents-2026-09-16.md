# Migrate specialist expertise tags to linked tag documents

Today each specialist stores its expertise labels as loose inline rows (`specialtyItem`). The new setup wants reusable tag documents (`specialistTag`) that can be reused across specialists and can link to a page. This migration converts every existing inline label into a shared tag and reconnects it.

## What the migration does

1. Reads all specialist documents (including drafts) and collects their inline expertise labels in Norwegian and English.
2. Groups identical labels together so "Gynekologi" used by ten specialists becomes one shared tag, not ten copies.
3. Creates one tag document per unique label, with both language versions filled in.
4. Tries to auto-fill each tag's link by matching the label against existing treatment and treatment-category pages. Only confident matches are linked; everything else is left empty for editors.
5. Replaces the inline rows on each specialist with references to the new tags, keeping the original order and skipping rows that are already references.
6. Prints a summary: tags created, tags reused, specialists updated, labels linked, and labels left unlinked.

Safe to run more than once — rerunning finds the existing tags instead of creating duplicates, and specialists already converted are skipped.

## Technical notes

New file: `test/sanity/migrate-specialist-tags.ts`, following the existing scripts in `test/sanity/` and using the shared client in `test/sanity/config.ts` (`SANITY_TOKEN` env var, dataset selectable through `SANITY_DATASET`).

- Fetch: `*[_type == "specialist"]{_id, name, specialties}` plus the drafts variant.
- Label key: normalized Norwegian value (lowercase, trimmed, diacritic-insensitive); English value used as the EN translation when present.
- Tag document IDs are deterministic (`specialistTag.<slugified-no-label>`) so reruns are idempotent and drafts/published stay in sync.
- Tag fields written as internationalized-array v5 rows (`{_key, _type: 'internationalizedArrayStringValue', value}` for `no` and `en`). Field names for `specialistTag` (title / slug / link) are read from the live schema at runtime; if a field the script expects is absent it logs and skips that field rather than writing unknown keys.
- Link auto-match: build a lookup from `*[_type in ["treatment","treatmentCategory"]]{_id, title, slug}` on normalized NO title; exact normalized match only, no fuzzy matching.
- Writes use a single transaction per batch (`createIfNotExists` for tags, `patch().set({specialties})` for specialists), with a `--dry-run` flag that prints the planned changes without committing.

Run with:
`SANITY_TOKEN=xxx SANITY_DATASET=production npx tsx test/sanity/migrate-specialist-tags.ts --dry-run`
then again without `--dry-run`.

## Out of scope

No changes to the website code or the Studio schema — the legacy `specialtyItem` row type can be removed from the schema by you once the migration has run cleanly.
