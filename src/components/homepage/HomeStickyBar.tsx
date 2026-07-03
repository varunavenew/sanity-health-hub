import { Link } from "react-router-dom";

export const HomeStickyBar = () => {
  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 md:hidden p-3 bg-background/95 backdrop-blur-md border-t border-border"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom) + 0.75rem)" }}
    >
      <Link
        to="/booking"
        className="flex h-14 items-center justify-center rounded-2xl bg-accent text-accent-foreground text-base font-normal shadow-sm hover:bg-accent/90 transition-colors"
      >
        Bestill time
      </Link>
    </div>
  );
};
