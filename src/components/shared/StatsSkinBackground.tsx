import bgAsset from "@/assets/blur-skin-mid.jpg.asset.json";

/**
 * Shared background for the "Tall som forteller en historie"-section.
 *
 * Uses the exact same asset/toning as the "60 000+ Pasientbesøk i året"-band
 * on the homepage (PatientTrustSection) so the two always match:
 * darker warm brown, grainy texture, light text on top.
 *
 * Usage: place as first child of a `relative overflow-hidden stats-band-dark`
 * section. All text inside is light (brand-beige) via the `.stats-band-dark`
 * utility in index.css.
 */
export const StatsSkinBackground = () => (
  <div
    aria-hidden="true"
    className="absolute inset-0 bg-cover bg-center"
    style={{ backgroundImage: `url(${bgAsset.url})` }}
  />
);
