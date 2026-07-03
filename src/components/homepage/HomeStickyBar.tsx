import { Link } from "react-router-dom";

export const HomeStickyBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden flex">
      <Link
        to="/booking"
        className="flex-1 h-14 flex items-center justify-center bg-brand-dark text-brand-warm text-sm font-medium"
      >
        Bestill time
      </Link>
      <a
        href="tel:+4722000000"
        className="flex-1 h-14 flex items-center justify-center bg-brand-warm text-brand-dark border-l border-brand-dark/20 text-sm font-medium"
      >
        Ring oss
      </a>
    </div>
  );
};
