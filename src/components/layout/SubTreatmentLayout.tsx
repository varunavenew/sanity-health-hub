import { useEffect, ReactNode, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";
import { buildBookingUrl } from "@/lib/bookingLinks";
import { specialists, type Specialist } from "@/data/specialists";

export interface SubTreatmentContent {
  // Meta
  seoTitle: string;
  seoDescription: string;
  canonical: string;
  // Breadcrumb
  parent: { name: string; path: string };
  title: string;
  // Hero
  eyebrow: string;
  heroTitle: ReactNode;
  heroDescription: string;
  heroPoints: { title: string; desc: string }[];
  rating?: string;
  // Booking
  booking: { kategori: string; tjeneste?: string };
  primaryCtaLabel?: string;
  // Section 2 — flow / hva skjer
  flowEyebrow: string;
  flowTitle: string;
  flow: { n: string; title: string; desc: string }[];
  // Section 3 — hvem / symptomer
  reasonsEyebrow: string;
  reasonsTitle: string;
  reasonsLead?: string;
  reasonsLead2?: string;
  reasons: { n: string; title: string; desc: string }[];
  // Section 4 — løfter
  promises: { eyebrow: string; title: string; desc: string }[];
  // Section 5 — relaterte
  relatedEyebrow?: string;
  relatedTitle?: string;
  related: { eyebrow: string; title: string; desc: string; href: string }[];
  // Final CTA
  ctaTitle: string;
  ctaDescription: string;
  // Specialists section
  specialistCategory?: Specialist["category"];
  specialistSlugs?: string[]; // optional whitelist of who does this service
  specialistCtaLabel?: string;
  specialistCtaHref?: string;
}

interface Props {
  isChatOpen: boolean;
  content: SubTreatmentContent;
}

const insurancePartners = [
  "Gjensidige", "If", "Fremtind", "Storebrand", "Tryg", "Vertikal", "Codan", "Eika",
];

export const SubTreatmentLayout = ({ isChatOpen, content: c }: Props) => {
  useEffect(() => {
    document.title = `${c.title} | CMedical`;
  }, [c.title]);

  const sectionSpecialists = useMemo(() => {
    if (c.specialistSlugs && c.specialistSlugs.length > 0) {
      const ordered = c.specialistSlugs
        .map((slug) => specialists.find((s) => s.slug === slug))
        .filter((s): s is Specialist => Boolean(s));
      if (ordered.length > 0) return ordered.slice(0, 5);
    }
    if (c.specialistCategory) {
      return specialists.filter((s) => s.category === c.specialistCategory).slice(0, 5);
    }
    return [];
  }, [c.specialistSlugs, c.specialistCategory]);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={c.seoTitle}
        description={c.seoDescription}
        canonical={c.canonical}
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          c.parent,
          { name: c.title, path: c.canonical },
        ]}
      />
      <h1 className="sr-only">{c.title} hos CMedical</h1>

      {/* BREADCRUMB */}
      <div className="bg-brand-light pt-24 lg:pt-28 pb-4">
        <div className="container mx-auto px-6 md:px-16">
          <nav className="text-xs font-light text-foreground/60 flex items-center gap-2">
            <Link to="/" className="hover:text-foreground">Hjem</Link>
            <span>›</span>
            <Link to={c.parent.path} className="hover:text-foreground">{c.parent.name}</Link>
            <span>›</span>
            <span className="text-foreground/80">{c.title}</span>
          </nav>
        </div>
      </div>

      {/* 1. HERO */}
      <header className="bg-brand-light pb-20 md:pb-28">
        <div className="container mx-auto px-6 md:px-16">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
            <div>
              <p className="text-xs tracking-wide text-foreground/60 mb-6 uppercase">
                {c.eyebrow}
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
                {c.heroTitle}
              </h2>
              <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground max-w-md">
                {c.heroDescription}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-8">
                <Button
                  variant="cta"
                  size="lg"
                  className="px-8 w-full sm:w-auto"
                  onClick={() => (window.location.href = buildBookingUrl(c.booking))}
                >
                  {c.primaryCtaLabel ?? "Bestill time"}
                </Button>
                <Link
                  to="/priser"
                  className="text-sm font-light text-foreground hover:text-foreground/70 border-b border-foreground/40 hover:border-foreground pb-0.5 transition-colors"
                >
                  Se priser
                </Link>
              </div>

              {c.rating && (
                <div className="flex items-center gap-3 text-sm font-light text-muted-foreground">
                  <div className="flex">
                    {[0, 1, 2, 3, 4].map((i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-accent text-accent" />
                    ))}
                  </div>
                  <span>{c.rating}</span>
                </div>
              )}
            </div>

            <div className="bg-secondary/50 p-8 md:p-10 rounded-sm">
              <ul className="space-y-6">
                {c.heroPoints.map((p) => (
                  <li key={p.title} className="flex items-start gap-4">
                    <span className="w-7 h-7 rounded-full bg-background border border-border flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Check className="w-3.5 h-3.5 text-foreground" />
                    </span>
                    <div>
                      <h3 className="text-base font-normal text-foreground mb-1">
                        {p.title}
                      </h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed">
                        {p.desc}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </header>

      {/* 2. FLOW */}
      <section className="bg-brand-dark text-white py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14">
              <p className="text-xs tracking-wide text-white/60 mb-4 uppercase">
                {c.flowEyebrow}
              </p>
              <h2 className="text-3xl md:text-5xl font-light leading-tight">
                {c.flowTitle}
              </h2>
            </div>

            <div className={`grid md:grid-cols-2 ${c.flow.length >= 4 ? "lg:grid-cols-4" : "lg:grid-cols-3"} gap-px bg-white/10 rounded-sm overflow-hidden`}>
              {c.flow.map((step) => (
                <div key={step.n} className="bg-brand-dark p-7 flex flex-col">
                  <p className="text-[11px] tracking-wider text-accent mb-5 uppercase">
                    {step.n}
                  </p>
                  <h3 className="text-lg font-normal mb-3 leading-snug">
                    {step.title}
                  </h3>
                  <p className="text-sm font-light text-white/70 leading-relaxed">
                    {step.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. REASONS / SYMPTOMS */}
      <section className="bg-background py-20 md:py-28">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 lg:gap-16">
            <div className="lg:col-span-5">
              <p className="text-xs tracking-wide text-foreground/60 mb-4 uppercase">
                {c.reasonsEyebrow}
              </p>
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-6">
                {c.reasonsTitle}
              </h2>
              {c.reasonsLead && (
                <p className="text-base font-light text-muted-foreground leading-relaxed mb-4 max-w-md">
                  {c.reasonsLead}
                </p>
              )}
              {c.reasonsLead2 && (
                <p className="text-base font-light text-muted-foreground leading-relaxed max-w-md">
                  {c.reasonsLead2}
                </p>
              )}
            </div>

            <div className="lg:col-span-7">
              <div className="divide-y divide-border/60 border-t border-border/60">
                {c.reasons.map((r) => (
                  <div key={r.n} className="grid grid-cols-12 gap-4 py-6">
                    <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/40 tracking-wider pt-1">
                      {r.n}
                    </div>
                    <div className="col-span-10 md:col-span-11">
                      <h3 className="text-base font-normal text-foreground mb-1.5">
                        {r.title}
                      </h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">
                        {r.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROMISES */}
      <section className="bg-brand-light py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-6">
            {c.promises.map((p) => (
              <div
                key={p.title}
                className="bg-background p-7 rounded-sm border border-border/40 flex flex-col"
              >
                <p className="text-[11px] tracking-wider text-foreground/50 mb-4 uppercase">
                  {p.eyebrow}
                </p>
                <h3 className="text-lg font-normal text-foreground mb-3">
                  {p.title}
                </h3>
                <p className="text-sm font-light text-muted-foreground leading-relaxed">
                  {p.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. RELATED */}
      {c.related.length > 0 && (
        <section className="bg-secondary/40 py-20 md:py-28">
          <div className="container mx-auto px-6 md:px-16">
            <div className="max-w-6xl mx-auto">
              <div className="max-w-2xl mb-12">
                <p className="text-xs tracking-wide text-foreground/60 mb-4 uppercase">
                  {c.relatedEyebrow ?? "Relaterte områder"}
                </p>
                <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                  {c.relatedTitle ?? "Du er kanskje også interessert i"}
                </h2>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {c.related.map((a) => (
                  <Link
                    key={a.title}
                    to={a.href}
                    className="bg-background p-7 rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors"
                  >
                    <p className="text-[11px] tracking-wider text-foreground/50 mb-4 uppercase">
                      {a.eyebrow}
                    </p>
                    <h3 className="text-lg font-normal text-foreground mb-3">
                      {a.title}
                    </h3>
                    <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                      {a.desc}
                    </p>
                    <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
                      Les mer
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* 6. CTA */}
      <section className="bg-brand-dark text-white py-20 md:py-24">
        <div className="container mx-auto px-6 md:px-16">
          <div className="max-w-6xl mx-auto grid lg:grid-cols-12 gap-10 items-center">
            <div className="lg:col-span-7">
              <h2 className="text-3xl md:text-5xl font-light leading-tight mb-5">
                {c.ctaTitle}
              </h2>
              <p className="text-base md:text-lg font-light text-white/70 leading-relaxed max-w-lg">
                {c.ctaDescription}
              </p>
            </div>
            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3 lg:items-end">
              <Button asChild variant="cta-dark" size="lg" className="px-8">
                <Link to={buildBookingUrl(c.booking)}>Bestill time</Link>
              </Button>
              <a
                href="tel:+4722000000"
                className="inline-flex items-center gap-2 text-sm font-light text-white/85 hover:text-white transition-colors px-2"
              >
                <Phone className="w-4 h-4" />
                Ring oss på 22 00 00 00
              </a>
            </div>
          </div>
        </div>
      </section>
    </PageLayout>
  );
};

export default SubTreatmentLayout;
