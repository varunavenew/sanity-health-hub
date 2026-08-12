import { StatsSkinBackground } from "@/components/shared/StatsSkinBackground";

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
 * - Samme hudbilde-bakgrunn, toning og lyse tekstfarger som «Tall som forteller
 *   en historie»-seksjonen (delt StatsSkinBackground + .stats-band-dark)
 */
export const ListPageHero = ({ title, description, children, className = "" }: ListPageHeroProps) => (
  <header
    className={`stats-band-dark relative flex flex-col justify-center overflow-hidden min-h-[calc(260px+4.25rem)] md:min-h-[calc(340px+4.25rem)] pt-[calc(3.5rem+4.25rem)] md:pt-[calc(6rem+4.25rem)] pb-14 md:pb-24 ${className}`}
  >
    <StatsSkinBackground />
    <div className="relative container mx-auto px-6 md:px-16">
      <div className="max-w-2xl">
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1]">
          {title}
        </h1>
        {description && (
          <p className="mt-2 md:mt-3 font-light text-base md:text-lg leading-relaxed max-w-xl">
            {description}
          </p>
        )}
        {children}
      </div>
    </div>
  </header>
);
