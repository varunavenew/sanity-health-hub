import { Link } from "react-router-dom";
import { Phone } from "lucide-react";

export const HomeStickyBar = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
      <div className="bg-brand-warm/95 backdrop-blur-md border-t border-brand-mid/20 px-4 py-2 pb-[max(8px,env(safe-area-inset-bottom))]">
        <div className="flex items-center gap-2 max-w-[1400px] mx-auto">
          <Link
            to="/booking"
            className="flex-1 h-11 flex items-center justify-center bg-brand-dark text-brand-warm rounded-2xl text-sm font-medium"
          >
            Bestill time
          </Link>
          <a
            href="tel:+4722000000"
            className="flex-1 h-11 flex items-center justify-center gap-1.5 bg-brand-warm text-brand-dark border border-brand-dark/20 rounded-2xl text-sm font-medium"
          >
            <Phone className="w-4 h-4" />
            Ring oss
          </a>
        </div>
      </div>
    </div>
  );
};
