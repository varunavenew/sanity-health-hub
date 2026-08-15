# Update the Next.js review section to the new design

Rewrite the pasted `GoogleReviewsSection` (the Next.js/Sanity-driven variant) so it matches the review section now live on the homepage and shown in the reference image.

## What changes visually

- Header row becomes a two-part layout: the heading on the left (large, light weight, two-line break), and two compact rating cards on the right — "Google Reviews 4.6" and "Legelisten 4.8", each a white card with hairline border, small label, big number and partial stars.
- On mobile the two rating cards sit side by side in a 2-column grid instead of stacking.
- Review cards: white cards, rounded-sm, hairline border, hover border/shadow lift; stars on top, quoted text, "Read more" toggle for long text, then a divider with the name + relative date on the left and a Google/Legelisten source badge on the right. Anonymous reviewers get a small user icon and muted italic name.
- Desktop: infinite marquee row with left/right fade gradients over the section background, paused on hover.
- Mobile: separate horizontally swipeable row of narrower cards with truncated text, plus scroll arrows.
- Section background switches to the warm brand background, with the decorative `Quote` icon and the dark CTA block dropped in favour of the current design's simpler layout.

## Data handling

Keep the component's existing data source (`useHomepage().reviewsSection`) and translation keys. Each review needs a `source` value ("google" | "legelisten") to pick the correct badge; when a review has no source, default to `"google"` so nothing breaks. Ratings, heading, subheading and the two average ratings stay driven by the Sanity section, with graceful fallbacks when fields are empty.

## Technical notes

- Reference implementation: `src/components/homepage/GoogleReviewsSection.tsx` in this project (marquee markup, `PartialStars`, `SourceBadge`, `ScrollArrows`, `useAutoScroll`).
- The pasted file targets a different project (`"use client"`, `@/lib/router`, `@/lib/sanity/homepage-data`); the rewrite keeps those imports and only changes markup/styling plus adds `PartialStars` usage.
- The mobile marquee relies on a `useAutoScroll`-style hook and a `ScrollArrows` component. If those do not exist in the target project, the mobile row falls back to plain scroll-snap swiping with no auto-scroll.
- Delivered as the full updated component source in chat (the file lives in another project), unless you want it added to this codebase too.

## Open question

The optional "150 000+ / trust badges" block below the reviews is part of this project's homepage section but not visible in your screenshot — it is left out of the rewrite unless you want it included.
