import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

export const StickyBookingCTA = () => {
  const navigate = useNavigate();
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    const footer = document.querySelector("footer");
    if (!footer) return;

    const observer = new IntersectionObserver(
      ([entry]) => setHidden(entry.isIntersecting),
      { rootMargin: "0px 0px -40px 0px", threshold: 0 }
    );
    observer.observe(footer);
    return () => observer.disconnect();
  }, []);

  return (
    <button
      onClick={() => navigate('/booking')}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-2xl px-5 py-3 bg-accent text-accent-foreground shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl hover:bg-accent/90 ${
        hidden ? "opacity-0 pointer-events-none translate-y-4" : "opacity-100"
      }`}
      aria-label="Book gratis konsultasjon"
      aria-hidden={hidden}
    >
      <Calendar className="w-4 h-4" strokeWidth={1.5} />
      <span className="text-sm font-medium whitespace-nowrap">
        Book gratis konsultasjon
      </span>
    </button>
  );
};
