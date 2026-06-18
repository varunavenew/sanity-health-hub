import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { articles } from "@/data/articles";

/**
 * Splitscreen-versjon av "Nyheter og artikler" — to artikler side om side
 * i full skjermhøyde, etter samme prinsipper som øvrige splitscreen-seksjoner.
 */
export const NewsSplitScreen = () => {
  const items = [
    {
      slug: articles[0]?.slug ?? "#",
      title: "Robotassistert overvektskirurgi – presisjon, trygghet og varige resultater",
      image:
        "https://cdn.sanity.io/images/bk8rw7yi/production/1a6b5c045dd900b09dd7dd5e0c2e9683d2d12643-4284x5712.jpg?q=80&fit=crop&auto=format&w=1600",
      eyebrow: "Fagartikkel",
    },
    {
      slug: articles[1]?.slug ?? "#",
      title: "Livio Oslo blir en del av CMedical og tilbudet til pasientene styrkes",
      image:
        "https://cdn.sanity.io/images/bk8rw7yi/production/1b6782dd6bb68860c34de07a6522605faa161d22-4318x2879.jpg?q=80&fit=crop&auto=format&w=1600",
      eyebrow: "Nytt fra oss",
    },
  ];

  return (
    <section aria-labelledby="news-split-heading" className="bg-brand-warm">
      <h2 id="news-split-heading" className="sr-only">
        Nyheter og artikler
      </h2>
      <div className="grid md:grid-cols-2">
        {items.map((item) => (
          <Link
            key={item.slug}
            to={`/aktuelt/${item.slug}`}
            className="group relative block h-[70vh] md:h-screen overflow-hidden"
          >
            <img
              src={item.image}
              alt={item.title}
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-black/10"
            />
            <div className="relative z-10 flex h-full flex-col justify-end px-6 md:px-12 lg:px-16 py-10 md:py-14 text-white">
              <span className="text-xs font-light tracking-normal text-white/80 mb-3">
                {item.eyebrow}
              </span>
              <h3 className="text-2xl md:text-3xl lg:text-4xl font-light leading-[1.15] max-w-xl mb-5">
                {item.title}
              </h3>
              <span className="inline-flex items-center gap-2 text-sm font-light text-white/90 group-hover:text-white">
                Les mer
                <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};
