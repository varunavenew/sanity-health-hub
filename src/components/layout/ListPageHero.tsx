import heroBgAsset from "@/assets/blur-skin-mid.jpg.asset.json";

interface ListPageHeroProps {
  title: string;
  description?: string;
  /** Ekstra innhold under ingressen (f.eks. filtre) */
  children?: React.ReactNode;
  className?: string;
  /** @deprecated Todelt oppsett er avviklet — alle listesider bruker stablet venstrestilt hero. */
  split?: boolean;
}

/**
 * FELLES HERO for listesider (/aktuelt, /spesialister, /priser, /forsikring m.fl.)
 *
 * - Venstrestilt: tittel øverst, ingress rett under (ingen todelt layout)
 * - Lik, romslig luft over og under innholdet på alle sider
 * - Skin-teksturbakgrunn med varm brun overlay (aldri flat brun)
 */
export const ListPageHero = ({ title, description, children, className = "" }: ListPageHeroProps) => (
  <header
    className={`relative flex flex-col justify-center overflow-hidden min-h-[260px] md:min-h-[340px] py-14 md:py-24 ${className}`}
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
      <div className="max-w-2xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light text-brand-warm leading-[1.1]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 md:mt-3 text-brand-warm/80 font-light text-base md:text-lg leading-relaxed max-w-xl">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  </header>
);
