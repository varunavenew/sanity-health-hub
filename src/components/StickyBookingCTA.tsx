import { Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const StickyBookingCTA = () => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate('/booking')}
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-5 py-3 rounded-full shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
      style={{ backgroundColor: '#CCBAAD' }}
      aria-label="Book gratis konsultasjon"
    >
      <Calendar className="w-4 h-4 text-brand-dark" strokeWidth={1.5} />
      <span className="text-sm font-medium text-brand-dark whitespace-nowrap">
        Book gratis konsultasjon
      </span>
    </button>
  );
};