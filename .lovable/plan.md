# Migrate service hero images to Sanity

Move the ~60 service hero images from CDN `.asset.json` pointers into Sanity so editors can manage them from the CMS. Sanity image wins when present; existing CDN pointer is the fallback so nothing breaks during/after migration.

## Current state

- Images live at `src/assets/services/*.jpg.asset.json` (CDN pointers on Cloudflare R2).
- Resolved in code via `getServiceImage(categoryId, subId?)` in `src/data/serviceImages.ts` — used everywhere hero images render (category landings, sub-treatment pages, related cards, "Alle er velkomne" cards).
- Sanity schema `treatment` and `treatmentCategory` already have a `heroImage` field of type `image` — no schema change needed.

## What to build

### 1. Upload script (one-off)

Create `test/sanity/upload-service-images.ts`:
- Read every `src/assets/services/*.jpg.asset.json` pointer.
- Download the binary from the `url` field.
- Upload to Sanity via `client.assets.upload("image", buffer, { filename })`.
- Match the returned asset to the correct `treatment` / `treatmentCategory` document by slug (using the same `categoryId` / `subId` derivation that `serviceImages.ts` uses, including the `ALIAS`, `SUB_ALIAS`, and `CROSS_CATEGORY_ALIAS` maps).
- Patch each document: `client.patch(id).set({ heroImage: { _type: "image", asset: { _ref: assetId } } }).commit()`.
- Skip documents that already have a `heroImage` (idempotent re-run).
- Log a summary: uploaded, skipped, unmatched.

### 2. Frontend resolver (Sanity-first, CDN fallback)

Update `src/data/serviceImages.ts`:
- Keep the existing `getServiceImage` / `getDedicatedServiceImage` / `getCategoryHeroImage` / `getServiceImageFromHref` signatures unchanged so no call sites need editing.
- Add a small in-memory cache populated at app startup by a new `useServiceImagesFromSanity()` hook (or extend the existing `useServiceCategories`) that fetches `_id`, `slug.current`, `parentCategory->slug.current`, and `heroImage` from Sanity once.
- Inside each `get*` function: check the Sanity cache first (keyed by `${categoryId}/${subId}` or `${categoryId}`); if a Sanity image URL exists, return it. Otherwise fall through to the current CDN pointer logic unchanged.
- Use `urlFor()` from `src/lib/sanityClient.ts` to build the Sanity image URL (with `.width(1600).auto("format").url()`).

### 3. Keep CDN pointers in the repo

Do NOT delete the `.asset.json` files after migration. They are the fallback and cost effectively nothing in bundle size (they're JSON pointers, not binaries). Once the team confirms every service has a Sanity image and editors are happy, a follow-up cleanup task can remove them.

## Out of scope

- No changes to the Sanity schema (`heroImage` already exists).
- No changes to any component or page that renders images — the resolver signatures stay identical.
- No removal of CDN pointers in this pass.

## Verification

- Run the upload script in a dry-run mode first (log matches without patching) to confirm slug matching is correct — especially for the alias cases (`flere-fagomrader` → `flere`, `gynekologi/tverrfaglig` → `tverrfaglig-team`, etc.).
- Run for real, then load a handful of pages (Gynekologi landing, a fertility sub-page, a urologi sub-page, `/behandlinger/flere-fagomrader/*`) and confirm the Sanity image renders.
- Temporarily unset one document's `heroImage` in Sanity and confirm the CDN fallback still shows.
- `tsgo` typecheck clean.

## Technical notes

- Auth: the upload script needs a Sanity write token (env var `SANITY_WRITE_TOKEN`). Users manage this locally; not needed at runtime by the frontend.
- The Sanity fetch on the frontend is a single query, cached by React Query, keyed once — no per-image roundtrips.
- Alias/cross-category maps in `serviceImages.ts` stay authoritative for slug resolution both in the upload script and the runtime resolver (import them, don't duplicate).
