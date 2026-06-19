import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

export const PatientTrustSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-6 md:py-10 bg-brand-warm relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-16 relative">
        <div className="max-w-5xl">
          {/* Editorial composition: restrained number + heading + CTA */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-light leading-none tracking-tight text-brand-dark">
                  150&thinsp;000<span className="text-brand-mid font-extralight ml-1">+</span>
                </span>
              </div>
              <p className="text-base md:text-lg font-light text-brand-dark leading-tight">
                Fornøyde pasienter siden 2002.
              </p>
            </div>

            <div className="pb-1">
              <button
                onClick={() => navigate('/tjenester')}
                className="group inline-flex items-center gap-3 text-sm font-light border-b border-brand-mid pb-2 hover:border-brand-dark transition-colors"
              >
                Se våre tjenester
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
