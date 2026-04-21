import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft, Plus, Minus } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { specialists } from "@/data/specialists";
import gynekologiImg from "@/assets/categories/gynekologi.jpg";
import gynekologiReal from "@/assets/categories/gynekologi-real.jpg";
import {
  gynekologiContent,
  gynekologiServices,
  gynekologiFaqs,
} from "./gynekologiContent";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";

interface PageProps {
  isChatOpen: boolean;
}

const ClassicPlusVariant = ({ isChatOpen }: PageProps) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  useEffect(() => {
    document.title = `${gynekologiContent.title} · Klassisk+ | CMedical`;
  }, []);

  const gynSpecialists = useMemo(
    () => specialists.filter((s) => s.category === "gynekologi").slice(0, 4),
    []
  );

  const [intro, ...restDescription] = gynekologiContent.description.split("\n\n");

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Back link */}
      <div className="bg-brand-warm pt-24 md:pt-28">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <Link
            to="/gynekologi-design"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-muted-foreground hover:text-foreground font-light transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Tilbake til alle varianter
          </Link>
        </div>
      </div>

      {/* HERO – two-image composition with sticky meta */}
      <section className="bg-brand-warm pt-10 md:pt-14 pb-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="grid grid-cols-12 gap-8 md:gap-12 items-center">
            {/* LEFT: all text, left-aligned */}
            <div className="col-span-12 md:col-span-7">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                CMedical Kvinnehelse
              </p>
              <h1 className="text-5xl md:text-7xl lg:text-[5.25rem] font-light text-foreground leading-[1] tracking-tight">
                {gynekologiContent.title}
              </h1>
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground font-light mt-6">
                {gynekologiContent.subtitle}
              </p>

              <p className="text-base md:text-lg text-foreground/80 font-light leading-relaxed mt-10 max-w-xl">
                {intro}
              </p>
              <div className="flex items-center gap-3 mt-8">
                <Button
                  className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light h-11 px-6"
                  onClick={() => (window.location.href = "/booking")}
                >
                  Bestill time
                  <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
                </Button>
                <Link
                  to="/spesialister"
                  className="text-sm font-light text-foreground/70 hover:text-foreground underline-offset-4 hover:underline"
                >
                  Møt spesialistene
                </Link>
              </div>
            </div>

            {/* RIGHT: brand 4:5 portrait image */}
            <div className="col-span-12 md:col-span-5">
              <div className="aspect-[4/5] overflow-hidden rounded-2xl bg-muted">
                <img
                  src={gynekologiReal}
                  alt={gynekologiContent.title}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Services – numbered editorial list, the new twist (moved up under hero) */}
      <section className="bg-background py-20 md:py-24 border-t border-border/60">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="grid grid-cols-12 gap-8 md:gap-12 mb-14 md:mb-16">
            <div className="col-span-12 md:col-span-5">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                {gynekologiContent.servicesHeading}
              </p>
              <h2 className="text-4xl md:text-5xl font-light text-foreground leading-[1.05] tracking-tight">
                Tjenester innen<br />gynekologi
              </h2>
            </div>
            <div className="col-span-12 md:col-span-6 md:col-start-7 flex md:items-end">
              <p className="text-base text-muted-foreground font-light leading-relaxed">
                {gynekologiContent.servicesIntro}
              </p>
            </div>
          </div>

          {/* Two-column numbered list – mirrors classic but with rhythm */}
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 border-t border-border/60">
            {gynekologiServices.map((s, i) => {
              const Icon = s.icon;
              return (
                <li
                  key={s.name}
                  className="border-b border-border/60"
                >
                  <Link
                    to={s.path}
                    className="group grid grid-cols-[2.5rem_1.5rem_1fr_1rem] items-center gap-4 py-5 hover:pl-2 transition-all duration-300"
                  >
                    <span className="text-xs tabular-nums text-muted-foreground font-light">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <Icon
                      className="w-5 h-5 text-foreground/60"
                      strokeWidth={1.5}
                    />
                    <span className="text-base md:text-lg font-light text-foreground">
                      {s.name}
                    </span>
                    <ArrowRight
                      className="w-4 h-4 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all"
                      strokeWidth={1.5}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Continued description – calm, single column (moved below services) */}
      {restDescription.length > 0 && (
        <section className="bg-brand-warm py-20 md:py-24">
          <div className="container mx-auto px-6 md:px-16 max-w-3xl">
            {restDescription.map((p, i) => (
              <p
                key={i}
                className="text-lg md:text-xl font-light text-foreground leading-[1.6] mb-6 last:mb-0"
              >
                {p}
              </p>
            ))}
          </div>
        </section>
      )}

      {/* Specialists – horizontal strip on warm bg */}
      <section className="bg-background py-20 md:py-28 border-t border-border/60">
        <div className="container mx-auto px-6 md:px-16 max-w-7xl">
          <div className="flex items-end justify-between mb-12 md:mb-14">
            <div className="max-w-xl">
              <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
                Møt teamet
              </p>
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
                Våre gynekologer
              </h2>
            </div>
            <Link
              to="/spesialister"
              className="hidden md:inline-flex items-center gap-2 text-sm font-light text-foreground/70 hover:text-foreground"
            >
              Se alle
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {gynSpecialists.map((s) => (
              <Link
                key={s.slug}
                to={`/spesialister/${s.slug}`}
                className="group block"
              >
                <div className="aspect-[4/5] overflow-hidden bg-muted rounded-2xl mb-4">
                  <img
                    src={s.image}
                    alt={s.name}
                    loading="lazy"
                    className="w-full h-full object-cover group-hover:scale-[1.04] transition-transform duration-700"
                  />
                </div>
                <p className="text-base font-light text-foreground leading-tight">
                  {s.name}
                </p>
                <p className="text-sm text-muted-foreground font-light mt-1">
                  {s.title}
                </p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <CategoryReviews categoryId="gynekologi" categoryTitle="Gynekologi" />

      {/* FAQ – inline +/- accordion, classic feel */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <p className="text-xs uppercase tracking-[0.22em] text-muted-foreground font-light mb-6">
            Vanlige spørsmål
          </p>
          <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight mb-10">
            Det folk spør om
          </h2>

          <ul className="border-t border-border/60">
            {gynekologiFaqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <li key={i} className="border-b border-border/60">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between gap-6 py-5 text-left"
                  >
                    <span className="text-base md:text-lg font-light text-foreground">
                      {faq.question}
                    </span>
                    {isOpen ? (
                      <Minus className="w-4 h-4 text-foreground/60 flex-shrink-0" strokeWidth={1.5} />
                    ) : (
                      <Plus className="w-4 h-4 text-foreground/60 flex-shrink-0" strokeWidth={1.5} />
                    )}
                  </button>
                  {isOpen && (
                    <p className="pb-6 text-base text-muted-foreground font-light leading-relaxed">
                      {faq.answer}
                    </p>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* Final CTA */}
      <section className="bg-brand-warm py-20 md:py-28 border-t border-border/60">
        <div className="container mx-auto px-6 md:px-16 max-w-5xl flex flex-col md:flex-row items-start md:items-end justify-between gap-8">
          <div>
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.05] tracking-tight">
              Bestill din time.
            </h2>
            <p className="text-sm text-muted-foreground font-light mt-4 max-w-md">
              Kort ventetid. Ingen henvisning. Et helsetilbud som henger sammen.
            </p>
          </div>
          <Button
            className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light px-8 h-12"
            onClick={() => (window.location.href = "/booking")}
          >
            Til booking
            <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default ClassicPlusVariant;
