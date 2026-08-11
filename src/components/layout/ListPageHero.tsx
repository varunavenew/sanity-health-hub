import heroBgAsset from "@/assets/blur-skin-mid.jpg.asset.json";

interface ListPageHeroProps {
  title: string;
  description?: string;
  /** Ekstra innhold under ingressen (f.eks. filtre) */
  children?: React.ReactNode;
  className?: string;
}

/**
 * FELLES HERO for liste-/oversiktssider uten split-bilde
 * (/aktuelt, /spesialister, /klinikker, /tjenester m.fl.).
 *
 * - Skin-teksturbakgrunn med mørk overlay (aldri flat brun)
 * - Samme høyde overalt (matcher SplitHero: 420px mobil / 520px desktop)
 * - Innholdet er vertikalt sentrert slik at H1 lander på samme vertikale
 *   linje som «Helseforsikring» på /forsikring — mobil og desktop.
 */
export const ListPageHero = ({ title, description, children, className = "" }: ListPageHeroProps) => (
  <header
    className={`relative flex flex-col justify-center overflow-hidden min-h-[380px] md:min-h-[460px] py-12 md:py-16 ${className}`}
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
    </div>
  </header>
);
