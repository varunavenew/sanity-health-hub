import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Phone, Clock, Shield, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clinics } from "@/data/clinicServices";

const callableClinics = clinics.map(c => ({
  label: c.label,
  phone: c.phone,
}));

export const BookingCTA = () => {
  const navigate = useNavigate();
  const [showClinicPicker, setShowClinicPicker] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowClinicPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <section className="py-20 md:py-28 bg-brand-dark">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-3xl mx-auto text-center">
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-sm text-white/80">
              <Calendar className="w-4 h-4" />
              Rask og enkel booking
            </span>
          </div>

          {/* Header */}
          <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
            Bestill time hos spesialist
          </h2>
          <p className="text-white/70 font-light text-base md:text-lg mb-10 max-w-xl mx-auto">
            Velg fagområde, klinikk og behandler – alt i én enkel booking.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              size="lg"
              className="bg-white text-brand-dark hover:bg-white/90 rounded-sm px-10 h-14 text-base font-light"
              onClick={() => navigate("/booking")}
            >
              <Calendar className="mr-2 w-5 h-5" />
              Bestill time nå
              <ArrowRight className="ml-2 w-5 h-5" />
            </Button>

            {/* Ring oss with clinic picker */}
            <div className="relative" ref={dropdownRef}>
              <Button
                size="lg"
                variant="ghost"
                className="bg-transparent border border-white/30 text-white hover:bg-white hover:text-brand-dark rounded-sm px-8 h-14 text-base font-light w-full"
                onClick={() => setShowClinicPicker(!showClinicPicker)}
              >
                <Phone className="mr-2 w-5 h-5" />
                Ring oss
                <ChevronDown className={`ml-2 w-4 h-4 transition-transform ${showClinicPicker ? 'rotate-180' : ''}`} />
              </Button>

              {showClinicPicker && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-border overflow-hidden z-50 min-w-[240px]">
                  <p className="px-4 pt-3 pb-2 text-xs text-muted-foreground font-light">Velg klinikk</p>
                  {callableClinics.map((clinic) => (
                    <a
                      key={clinic.label}
                      href={`tel:${clinic.phone.replace(/\s/g, '')}`}
                      className="flex items-center justify-between px-4 py-3 hover:bg-secondary transition-colors text-left"
                    >
                      <span className="text-sm font-normal text-foreground">{clinic.label}</span>
                      <span className="text-sm text-muted-foreground font-light">{clinic.phone}</span>
                    </a>
                  ))}
                  <div className="border-t border-border">
                    <button
                      onClick={() => { setShowClinicPicker(false); navigate("/kontakt"); }}
                      className="w-full px-4 py-3 text-sm text-brand-dark hover:bg-secondary transition-colors text-left font-light"
                    >
                      Gå til kontaktsiden →
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            <span className="flex items-center gap-2 text-sm text-white/70">
              <Clock className="w-4 h-4" aria-hidden="true" />
              Ledig time innen 1–3 dager
            </span>
            <span className="flex items-center gap-2 text-sm text-white/70">
              <Shield className="w-4 h-4" aria-hidden="true" />
              Ingen henvisning nødvendig
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
