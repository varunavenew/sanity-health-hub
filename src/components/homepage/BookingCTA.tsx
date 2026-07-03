import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Phone, Clock, Shield, ChevronDown } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { clinics } from "@/data/clinicServices";
import { useTranslation } from "react-i18next";

const callableClinics = clinics.map(c => ({
  label: c.label,
  phone: c.phone,
}));

export const BookingCTA = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    <section className="py-12 md:py-16 bg-brand-dark">
      <div className="w-full px-4 md:container md:mx-auto md:px-16">
        <div className="w-full md:max-w-3xl md:mx-auto text-center">
          {/* Header */}
          <h2 className="text-2xl md:text-3xl font-light text-white mb-4">
            {t("booking.title")}
          </h2>
          <p className="text-white/95 font-light text-base md:text-lg mb-10 max-w-xl mx-auto">
            {t("booking.subtitle")}
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:justify-center mb-12">
            <Button
              variant="cta-dark"
              size="lg"
              onClick={() => navigate("/booking")}
              className="w-full sm:w-auto max-md:bg-accent max-md:text-accent-foreground max-md:hover:bg-accent/90"
            >
              {t("booking.bookNow")}
              <ArrowRight className="ml-2 w-5 h-5 hidden md:inline-block" />
            </Button>

            {/* Call us with clinic picker */}
            <div className="relative w-full sm:w-auto" ref={dropdownRef}>
              <Button
                variant="cta-outline-dark"
                size="lg"
                onClick={() => setShowClinicPicker(!showClinicPicker)}
                className="w-full sm:w-auto"
              >
                {t("booking.callUs")}
                <ChevronDown className={`ml-2 w-4 h-4 transition-transform hidden md:inline-block ${showClinicPicker ? 'rotate-180' : ''}`} />
              </Button>

              {showClinicPicker && (
                <div className="absolute top-full mt-2 left-0 right-0 bg-white rounded-lg shadow-xl border border-border overflow-hidden z-50 min-w-[240px]">
                  <p className="px-4 pt-3 pb-2 text-xs text-muted-foreground font-light">{t("booking.selectClinic")}</p>
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
                      {t("booking.goToContact")}
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>


          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-8">
            <span className="flex items-center gap-2 text-sm text-white">
              <Clock className="w-4 h-4" aria-hidden="true" />
              {t("booking.availableTime")}
            </span>
            <span className="flex items-center gap-2 text-sm text-white">
              <Shield className="w-4 h-4" aria-hidden="true" />
              {t("booking.noReferral")}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
};
