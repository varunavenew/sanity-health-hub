# Ashi Ahmad specialist profile demo

## Scope
- Rebuild only `/spesialister/ashi-ahmad` as an isolated profile template demo.
- Leave every other specialist profile and all other pages unchanged.
- Reuse the current site typography, colours, spacing, buttons, booking panel, reviews, related-specialists carousel, FAQ, and footer.
- Do not add or change CMS fields; hardcode Ashi-only fallback content where needed.

## Implementation
1. Add an Ashi-specific profile page composed in the requested order: simplified split hero, existing bio, four treatment cards, Graviditet feature block, filtered booking panel, existing reviews, gynaecologist carousel, and existing FAQ.
2. Reuse the fertility card/carousel and homepage feature-block patterns so desktop and mobile behavior match the current site.
3. Keep hero actions on desktop only; retain a mobile sticky booking action for Ashi.
4. Make the seven booking rows navigate through the existing booking flow with Ashi and the selected service prefilled. Add the requested Metodika note, call line, and pricing link.
5. Route only the `ashi-ahmad` slug to the demo; all other slugs continue through the current profile unchanged.

## Verification
- Check the page at desktop and mobile widths, including section order, hidden mobile hero actions, swipeable cards, booking rows, links, and sticky action.
- Confirm another specialist profile still uses the existing template.
- Confirm the preview build is clean.
