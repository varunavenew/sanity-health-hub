import skinBg from "@/assets/blur-belly.jpg.asset.json";

/**
 * Shared light skin-toned background for the
 * "Tall som forteller en historie"-section.
 *
 * Usage: place as first child of a `relative overflow-hidden bg-brand-light`
 * section. Text stays dark (foreground / brand-dark) on top.
 */
export const StatsSkinBackground = () => (
  <>
    <div aria-hidden="true" className="absolute inset-0">
      <img
        src={skinBg.url}
        alt=""
        loading="lazy"
        className="w-full h-full object-cover"
      />
    </div>
    <div aria-hidden="true" className="absolute inset-0 bg-brand-light/70" />
    <div
      aria-hidden="true"
      className="absolute inset-0 bg-gradient-to-b from-brand-light/40 via-brand-light/20 to-brand-light/60"
    />
  </>
);
