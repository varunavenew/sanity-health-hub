import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import bgAsset from "@/assets/blur-skin-mid.jpg.asset.json";

export const PatientTrustSection = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <section className="py-10 md:py-16 relative overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${bgAsset.url})` }}
        aria-hidden="true"
      />
      <div className="container mx-auto px-6 md:px-16 relative">
        <div className="max-w-5xl">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-light leading-none tracking-tight text-brand-beige">
                  150&thinsp;000<span className="text-brand-beige/70 font-extralight ml-1">+</span>
                </span>
              </div>
              <p className="text-base md:text-lg font-light text-brand-light leading-tight">
                Fornøyde pasienter siden 2002.
              </p>
            </div>

            <div className="pb-1">
              <button
                onClick={() => navigate('/tjenester')}
                className="group inline-flex items-center gap-3 text-sm font-light text-brand-light border-b border-brand-light/60 pb-2 hover:border-brand-light transition-colors"
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
