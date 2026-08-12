import { Link } from "react-router-dom";

/**
 * Sticky mobile bottom CTA bar.
 * Rendered globally from PageLayout on every page except the booking flow
 * and admin views. Bottom clearance in the footer is only reserved when
 * this bar actually renders.
 */
export const HomeStickyBar = () => {
  return (
    <nav
      aria-label="Hurtighandlinger"
      className="fixed inset-x-0 bottom-0 z-[60] md:hidden flex bg-brand-warm"
      style={{
        paddingBottom: "env(safe-area-inset-bottom, 0px)",
        transform: "translateZ(0)",
      }}
    >

      <Link
        to="/booking"
        className="flex-1 h-14 flex items-center justify-center bg-accent text-accent-foreground text-sm font-medium"
      >
        Bestill time
      </Link>
      <a
        href="tel:+4722600050"
        className="flex-1 h-14 flex items-center justify-center bg-brand-warm text-brand-dark border-l border-brand-dark/20 text-sm font-medium"
      >
        Ring oss
      </a>
    </nav>
  );
};
