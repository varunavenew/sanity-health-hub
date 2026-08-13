# Design audit: six treatment category pages

Documentation-only task. No component, styling, content, data or CMS changes. The only files created are Markdown docs.

## Confirmed starting points

Each of the six categories has its own page component (verified in `src/App.tsx`):

| Category | Route | Component |
|---|---|---|
| Fertilitet | `/fertilitet` | `src/pages/treatments/Fertility.tsx` |
| Gynekologi | `/gynekologi` | `src/pages/treatments/Gynecology.tsx` |
| Urologi | `/urologi` | `src/pages/treatments/UrologiPage.tsx` |
| Ortopedi | `/ortopedi` | `src/pages/treatments/OrtopediPage.tsx` |
| Graviditet | `/graviditet` | `src/pages/treatments/Graviditet.tsx` |
| Flere fagområder | `/flere-fagomrader` | `src/pages/treatments/FlereFagomraderPage.tsx` |

Because they are six separate components, the pages are not assumed identical — each is audited independently and then compared.

## Method

1. Read each page component top to bottom, plus every shared component it renders (hero, specialists carousel, reviews, FAQ, CTA bands, insurance, header, footer).
2. Resolve design tokens to real values from `tailwind.config.ts` and `src/index.css` (brand colors, `--radius`, `.split-hero`, `.centered-hero`, `.stats-band-dark`, `.section-head`).
3. Resolve content from the static fallbacks in the codebase (`categoryPageContent.ts`, `src/data/*`, `src/lib/trustTags.ts`, specialist data) — content is quoted verbatim, no paraphrasing.
4. Build a media inventory from the actual imported asset paths and their CSS object-fit/position/aspect rules.
5. Render each page in a headless browser at 1440 / 1280 / 1024 / 768 / 390 px to record real computed values (section heights, font sizes, paddings, column counts, what is hidden/shown, carousel behavior) and take screenshots for verification. This is read-only against the running preview.
6. Fill the cross-page comparison table and mark every claim as FACT / OBSERVATION / UNKNOWN, using "Not reliably determined" where a value cannot be confirmed.

## Output

New folder `docs/treatment-category-design/` with:

- `README.md` — audit scope, master section comparison, shared visual patterns, page-specific differences, and hero / specialist / insurance / CTA / FAQ / media / responsive / content comparisons plus implementation notes.
- `fertility.md`, `gynecology.md`, `urology.md`, `orthopedics.md`, `pregnancy.md`, `flere-fagomrader.md` — each with the 21 prescribed sections (overview, section order, header, hero, section-by-section design, "Hva kjenner du på?", specialists, insurance, CTA, FAQ, testimonials, articles, other sections, footer, content, media, responsive, shared patterns, page-specific differences, unknowns, developer checklist).

Screenshots used for verification are kept out of the repo (written to a scratch folder), so the only repo additions are the seven Markdown files.

## Scope guardrails

- No edits to `src/`, Sanity schemas under `test/`, migrations, or config.
- No commits, no deploys, no CMS access.
- Ends with a final summary covering the 13 requested points.
