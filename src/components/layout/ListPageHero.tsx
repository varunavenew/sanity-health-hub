import heroBgAsset from "@/assets/blur-skin-mid.jpg.asset.json";

interface ListPageHeroProps {
  title: string;
  description?: string;
  /** Ekstra innhold under ingressen (f.eks. filtre) */
  children?: React.ReactNode;
  className?: string;
  /**
   * Todelt oppsett på desktop: tittel til venstre, ingress til høyre (+ mer luft).
   * Standard for alle listesider — sett `split={false}` kun i unntakstilfeller.
   */
  split?: boolean;
}

/**
 * FELLES HERO for sider som ALLEREDE hadde en mørk enkel-hero
 * (kun /aktuelt og /spesialister). Skal ALDRI legges til på sider
 * som ikke hadde hero fra før.
 *
 * - Skin-teksturbakgrunn med varm brun overlay (aldri flat brun)
 * - Høyde = 50% av SplitHero (420/520) → 210px mobil / 260px desktop
 */
export const ListPageHero = ({ title, description, children, className = "", split = false }: ListPageHeroProps) => (
  <header
    className={`relative flex flex-col justify-center overflow-hidden ${
      split
        ? "min-h-[260px] md:min-h-[340px] py-14 md:py-24"
        : "min-h-[210px] md:min-h-[260px] py-8 md:py-10"
    } ${className}`}
  >
    <img
      src={heroBgAsset.url}
      alt=""
      aria-hidden="true"
      className="absolute inset-0 w-full h-full object-cover scale-110 blur-[2px]"
    />
    {/* Varm brun tone (som uskarp bakgrunn bak portrettene) — aldri flat mørkbrun */}
    <div className="absolute inset-0 bg-[#5C463A]/45" aria-hidden="true" />
    <div
      className="absolute inset-0"
      aria-hidden="true"
      style={{
        background:
          "linear-gradient(to top, rgba(66,51,42,0.55) 0%, rgba(92,70,58,0.35) 50%, rgba(92,70,58,0.22) 100%)",
      }}
    />
    <div className="relative container mx-auto px-6 md:px-16">
      {split ? (
        <div className="grid gap-6 md:gap-12 md:grid-cols-2 md:items-end">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-warm leading-[1.1]">
            {title}
          </h1>
          <div>
            {description && (
              <p className="text-brand-warm/80 font-light text-base md:text-lg leading-relaxed max-w-md">
                {description}
              </p>
            )}
            {children}
          </div>
        </div>
      ) : (
        <div className="max-w-2xl">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-warm leading-[1.1] mb-6">
            {title}
          </h1>
          {description && (
            <p className="text-brand-warm/80 font-light text-base md:text-lg leading-relaxed max-w-md">
              {description}
            </p>
          )}
          {children}
        </div>
      )}
    </div>
  </header>
);
