import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowLeft } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger,
} from "@/components/ui/accordion";
import { specialists } from "@/data/specialists";
import { DemoSpecialistCard } from "./DemoSpecialistCard";
import gynekologiImg from "@/assets/categories/gynekologi.jpg";
import {
  gynekologiContent, gynekologiServices, gynekologiServiceGroups, gynekologiFaqs,
} from "./gynekologiContent";
import { CategoryReviews } from "@/components/treatments/CategoryReviews";

interface PageProps { isChatOpen: boolean }

const EditorialVariant = ({ isChatOpen }: PageProps) => {
  useEffect(() => {
    document.title = `${gynekologiContent.title} · Editorial | CMedical`;
  }, []);

  const gynSpecialists = useMemo(
    () => specialists.filter((s) => s.category === "gynekologi").slice(0, 3),
    []
  );

  const groupsWithServices = useMemo(
    () =>
      gynekologiServiceGroups.map((g) => ({
        label: g.label,
        services: gynekologiServices.filter((s) => g.serviceNames.includes(s.name)),
      })),
    []
  );

  const [intro, ...restDescription] = gynekologiContent.description.split("\n\n");

  return (
    <PageLayout isChatOpen={isChatOpen}>
      {/* Back */}
      <div className="bg-brand-warm pt-24 md:pt-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <Link
            to="/gynekologi-design"
            className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground font-light transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" strokeWidth={1.5} />
            Tilbake til alle varianter
          </Link>
        </div>
      </div>

      {/* HERO */}
      <section className="bg-brand-warm pt-10 md:pt-14 pb-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="grid grid-cols-12 gap-6 md:gap-10 items-end">
            <div className="col-span-12 md:col-span-7">
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-light text-foreground leading-[0.95] tracking-tight">
                Kvinnehelse <em className="italic font-light">som folkehelse</em>.
              </h1>
            </div>
            <div className="col-span-12 md:col-span-5">
              <p className="text-base md:text-lg text-muted-foreground font-light leading-relaxed">
                {intro}
              </p>
              <div className="flex items-center gap-4 mt-8">
                <Button
                  className="bg-brand-dark text-white hover:bg-brand-dark/90 rounded-2xl font-light px-6 h-11"
                  onClick={() => (window.location.href = "/booking")}
                >
                  Bestill time
                  <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
                </Button>
                <Link
                  to="/priser"
                  className="text-sm font-light text-foreground/70 hover:text-foreground underline underline-offset-4"
                >
                  Se priser
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Wide image */}
      <section className="bg-brand-warm">
        <div className="w-full h-[55vh] min-h-[420px] overflow-hidden">
          <img
            src={gynekologiImg}
            alt={gynekologiContent.title}
            className="w-full h-full object-cover"
            style={{ objectPosition: "center 35%" }}
          />
        </div>
      </section>

      {/* Continued description */}
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

      {/* Services as chapters – using real groupings of real services */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="mb-16 md:mb-20 max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight mb-6">
              Alt under samme tak
            </h2>
            <p className="text-base text-muted-foreground font-light leading-relaxed">
              {gynekologiContent.servicesIntro}
            </p>
          </div>

          <div className="space-y-16 md:space-y-20">
            {groupsWithServices.map((group, i) => (
              <article key={group.label}>
                <div className="flex items-baseline gap-6 mb-8">
                  <p className="text-7xl md:text-8xl font-light text-foreground/10 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="text-2xl md:text-3xl font-light text-foreground">
                    {group.label}
                  </h3>
                </div>
                <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border/60 border border-border/60 rounded-2xl overflow-hidden">
                  {group.services.map((s) => {
                    const Icon = s.icon;
                    return (
                      <li key={s.name}>
                        <Link
                          to={s.path}
                          className="bg-background hover:bg-muted/40 transition-colors flex items-center gap-4 p-5 md:p-6 h-full"
                        >
                          <Icon className="w-5 h-5 text-foreground/70 flex-shrink-0" strokeWidth={1.5} />
                          <span className="text-base font-light text-foreground flex-1">
                            {s.name}
                          </span>
                          <ArrowRight className="w-4 h-4 text-muted-foreground" strokeWidth={1.5} />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Specialists */}
      <section className="bg-brand-warm py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-6xl">
          <div className="flex items-end justify-between mb-12 md:mb-16">
            <div className="max-w-xl">
              <h2 className="text-3xl md:text-5xl font-light text-foreground leading-[1.1] tracking-tight">
                Mennesker, ikke titler
              </h2>
            </div>
            <Link
              to="/spesialister"
              className="hidden md:inline-flex items-center gap-2 text-sm font-light text-foreground/70 hover:text-foreground"
            >
              Se alle gynekologer
              <ArrowRight className="w-4 h-4" strokeWidth={1.5} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10">
            {gynSpecialists.map((s) => (
              <DemoSpecialistCard key={s.slug} specialist={s} />
            ))}
          </div>
        </div>
      </section>

      {/* Reviews */}
      <CategoryReviews categoryId="gynekologi" categoryTitle="Gynekologi" />

      {/* FAQ */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16 max-w-3xl">
          <h2 className="text-3xl md:text-4xl font-light text-foreground leading-[1.1] tracking-tight mb-10">
            Det folk spør om
          </h2>
          <Accordion type="single" collapsible className="w-full">
            {gynekologiFaqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left font-light text-base">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent className="text-muted-foreground font-light leading-relaxed">
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-brand-dark py-20 md:py-28 text-white">
        <div className="container mx-auto px-6 md:px-16 max-w-4xl text-center">
          <h2 className="text-3xl md:text-5xl font-light leading-[1.1] tracking-tight mb-6">
            Time innen kort tid. Ingen henvisning.
          </h2>
          <p className="text-base text-white/70 font-light leading-relaxed max-w-xl mx-auto mb-10">
            Vi tror på faglig trygghet, tid til samtalen og en oppfølging som faktisk henger sammen.
          </p>
          <Button
            className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-2xl font-light px-8 h-12"
            onClick={() => (window.location.href = "/booking")}
          >
            Bestill gynekologtime
            <ArrowRight className="ml-2 w-4 h-4" strokeWidth={1.5} />
          </Button>
        </div>
      </section>
    </PageLayout>
  );
};

export default EditorialVariant;
