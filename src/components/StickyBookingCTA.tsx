import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const StickyBookingCTA = () => {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const updateVisibility = () => {
      const footer = document.querySelector("footer");
      if (!footer) {
        setHidden(false);
        return;
      }

      const footerTop = footer.getBoundingClientRect().top;
      const hideOffset = 140;
      setHidden(footerTop <= window.innerHeight - hideOffset);
    };

    updateVisibility();
    window.addEventListener("scroll", updateVisibility, { passive: true });
    window.addEventListener("resize", updateVisibility);

    return () => {
      window.removeEventListener("scroll", updateVisibility);
      window.removeEventListener("resize", updateVisibility);
    };
  }, []);

  return (
    <button
      onClick={() => navigate("/booking")}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3 bg-accent text-accent-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-accent/90 ${
        hidden ? "pointer-events-none translate-y-4 opacity-0" : "opacity-100"
      }`}
      aria-label="Bestill gratis konsultasjon"
      aria-hidden={hidden}
    >
      <Calendar className="w-4 h-4" strokeWidth={1.5} />
      <span className="text-sm font-medium whitespace-nowrap">
        Bestill gratis konsultasjon
      </span>
    </button>
  );
};
