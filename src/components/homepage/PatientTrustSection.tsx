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
          <div className="flex flex-row items-end justify-between gap-4 md:gap-6 md:flex-row md:items-end">
            <div className="space-y-1">
              <div className="flex items-baseline gap-2">
                <span className="text-4xl md:text-5xl font-light leading-none tracking-tight text-brand-beige">
                  60&thinsp;000<span className="text-brand-beige/70 font-extralight ml-1">+</span>
                </span>
              </div>
              <p className="text-base md:text-lg font-light text-brand-beige leading-tight">
                Pasientbesøk i året.
              </p>
            </div>

            <div className="shrink-0 text-right pb-1">
              <button
                onClick={() => navigate('/tjenester')}
                className="group inline-flex items-center gap-2 md:gap-3 min-h-[44px] text-sm font-light text-brand-beige border-b border-brand-beige/60 pb-2 hover:border-brand-beige transition-colors"
              >
                Se alle våre tjenester
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
