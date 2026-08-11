import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { articles } from "@/data/articles";

/**
 * Splitscreen-versjon av "Nyheter og artikler":
 * Venstre: redaksjonell overskrift/intro (samme prinsipp som øvrige splitscreen-seksjoner).
 * Høyre: 2x2 rutenett med fire artikler.
 */
export const NewsSplitScreen = () => {
  // De fire nyeste artiklene (sortert på dato).
  const latest = [...articles]
    .sort((a, b) => (a.date < b.date ? 1 : -1))
    .slice(0, 4)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      image: a.image,
      eyebrow: a.category,
    }));


  return (
    <section aria-labelledby="news-split-heading" className="bg-brand-warm">
      <div className="flex flex-col-reverse md:grid md:grid-cols-2 md:h-screen">
        {/* Venstre — redaksjonell intro */}
        <div className="bg-brand-light text-brand-dark flex flex-col justify-center px-6 md:px-12 lg:px-16 py-12 md:py-16">
          <div>
            <h2
              id="news-split-heading"
              className="text-3xl md:text-4xl lg:text-5xl font-light leading-[1.1] max-w-md mb-6"
            >
              Nyheter og artikler fra CMedical
            </h2>
            <p className="text-base md:text-lg font-light text-brand-dark/70 leading-relaxed max-w-md">
              Fagstoff, pasienthistorier og oppdateringer fra spesialistene
              våre — skrevet for deg som vil forstå mer om egen helse.
            </p>
          </div>
          <Link
            to="/aktuelt"
            className="inline-flex items-center gap-2 text-sm font-light text-brand-dark/80 hover:text-brand-dark mt-10 group w-fit"
          >
            Se alle artikler
            <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>

        {/* Høyre — 2x2 artikler */}
        <div className="grid grid-cols-2 grid-rows-2 md:h-screen">
          {latest.map((item) => (
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
                <span className="text-[11px] md:text-xs font-light text-white/70 mb-2">
                  {item.eyebrow}
                </span>
                <h3 className="text-sm md:text-base lg:text-lg font-light leading-snug mb-3 line-clamp-3">
                  {item.title}
                </h3>
                <span className="inline-flex items-center gap-1.5 text-xs font-light text-white/80 group-hover:text-white">
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
