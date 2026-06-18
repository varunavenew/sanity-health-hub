import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { articles } from "@/data/articles";

/**
 * Splitscreen-versjon av "Nyheter og artikler":
 * Venstre: redaksjonell overskrift/intro (samme prinsipp som øvrige splitscreen-seksjoner).
 * Høyre: 2x2 rutenett med fire artikler.
 */
export const NewsSplitScreen = () => {
  const fallback = [
    {
      slug: articles[0]?.slug ?? "#",
      title: "Robotassistert overvektskirurgi – presisjon, trygghet og varige resultater",
      image:
        "https://cdn.sanity.io/images/bk8rw7yi/production/1a6b5c045dd900b09dd7dd5e0c2e9683d2d12643-4284x5712.jpg?q=80&fit=crop&auto=format&w=1200",
      eyebrow: "Fagartikkel",
    },
    {
      slug: articles[1]?.slug ?? "#",
      title: "Livio Oslo blir en del av CMedical og tilbudet til pasientene styrkes",
      image:
        "https://cdn.sanity.io/images/bk8rw7yi/production/1b6782dd6bb68860c34de07a6522605faa161d22-4318x2879.jpg?q=80&fit=crop&auto=format&w=1200",
      eyebrow: "Nytt fra oss",
    },
    {
      slug: articles[2]?.slug ?? "#",
      title: articles[2]?.title ?? "Tverrfaglig oppfølging etter operasjon",
      image:
        articles[2]?.image ??
        "https://cdn.sanity.io/images/bk8rw7yi/production/1a6b5c045dd900b09dd7dd5e0c2e9683d2d12643-4284x5712.jpg?q=80&fit=crop&auto=format&w=1200",
      eyebrow: articles[2]?.category ?? "Fagartikkel",
    },
    {
      slug: articles[3]?.slug ?? "#",
      title: articles[3]?.title ?? "Slik forbereder du deg til konsultasjonen",
      image:
        articles[3]?.image ??
        "https://cdn.sanity.io/images/bk8rw7yi/production/1b6782dd6bb68860c34de07a6522605faa161d22-4318x2879.jpg?q=80&fit=crop&auto=format&w=1200",
      eyebrow: articles[3]?.category ?? "Veiledning",
    },
  ];

  return (
    <section aria-labelledby="news-split-heading" className="bg-brand-warm">
      <div className="grid md:grid-cols-2 md:h-screen">
        {/* Venstre — redaksjonell intro */}
        <div className="bg-brand-dark text-brand-light flex flex-col justify-between px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div>
            <span className="text-xs font-light text-brand-light/60 mb-6 block">
              Aktuelt
            </span>
            <h2
              id="news-split-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] max-w-md mb-6"
            >
              Nyheter og artikler fra CMedical
            </h2>
            <p className="text-base md:text-lg font-light text-brand-light/75 leading-relaxed max-w-md">
              Fagstoff, pasienthistorier og oppdateringer fra spesialistene
              våre — skrevet for deg som vil forstå mer om egen helse.
            </p>
          </div>
          <Link
            to="/aktuelt"
            className="inline-flex items-center gap-2 text-sm font-light text-brand-light/90 hover:text-brand-light mt-10 group w-fit"
          >
            Se alle artikler
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Høyre — 2x2 artikler */}
        <div className="grid grid-cols-2 grid-rows-2 md:h-screen">
          {fallback.map((item) => (
            <Link
              key={item.slug}
              to={`/aktuelt/${item.slug}`}
              className="group relative block overflow-hidden min-h-[40vh] md:min-h-0"
            >
              <img
                src={item.image}
                alt={item.title}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.04]"
              />
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-black/5"
              />
              <div className="relative z-10 flex h-full flex-col justify-end px-4 md:px-6 lg:px-8 py-6 md:py-8 text-white">
                <span className="text-[11px] md:text-xs font-light text-white/80 mb-2">
                  {item.eyebrow}
                </span>
                <h3 className="text-sm md:text-base lg:text-lg font-light leading-snug mb-3 line-clamp-3">
                  {item.title}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-light text-white/90 group-hover:text-white">
                  Les mer
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
