import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Quote } from "lucide-react";
import { getServiceImageFromHref } from "@/data/serviceImages";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { InsurancePartners } from "@/components/treatments/InsurancePartners";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { EditableAutoScope } from "@/components/editable/EditableAutoScope";
import { PageSEO } from "@/components/seo/PageSEO";

import { buildBookingUrl } from "@/lib/bookingLinks";
import { specialists } from "@/data/specialists";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { FeatureSpotlight } from "@/components/treatments/FeatureSpotlight";
import { ServicesListSection } from "@/components/layout/ServicesListSection";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { AnimatedStat } from "@/components/AnimatedStat";

import fertilityHeroAsset from "@/assets/hero-fertilitet.jpg.asset.json";
const fertilityHeroImg = fertilityHeroAsset.url;
import journeyConsultation from "@/assets/fertility/journey-01-consultation.jpg";
import journeyLab from "@/assets/fertility/journey-02-lab.jpg";
import journeyResult from "@/assets/fertility/journey-03-result.jpg";
import audienceCouple from "@/assets/fertility/audience-couple.jpg";
import audienceSingle from "@/assets/fertility/audience-single.jpg";
import audienceWaiting from "@/assets/fertility/audience-waiting.jpg";
import heroClinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";

interface PageProps {
  isChatOpen: boolean;
}

const FERT = "/behandlinger/fertilitet";
const BOOKING = "/booking?kategori=fertilitet&tjeneste=donorbehandling";
const CANONICAL = "/behandlinger/fertilitet/donorbehandling";

/* Approved copy beholdt fra treatmentContent["fertilitet/donorbehandling"] */
const segments = [
  {
    id: "partnerdonasjon",
    title: "Partnerdonasjon",
    desc:
      "For to kvinner i parforhold. Den ene gir egg som befruktes med donorsæd og settes tilbake i partnerens livmor. Tillatt i Norge fra 2021 — også på sosialt grunnlag.",
    cta: "Les mer om partnerdonasjon",
    href: BOOKING,
  },
  {
    id: "donorsaed",
    title: "Donorsæd",
    desc:
      "Vi benytter sæd fra Livio Sperm Bank, Cryos og European Sperm Bank — med god tilgang på norsk donorsæd. Etter norske retningslinjer brukes ikke-anonym donor.",
    cta: "Les om donorsæd",
    href: BOOKING,
  },
  {
    id: "donoregg",
    title: "Donoregg",
    desc:
      "Tillatt i Norge for heterofile par der kvinnen ikke kan bruke egne egg. Vi følger Bioteknologiloven og veileder gjennom hele forløpet.",
    cta: "Les om donoregg",
    href: BOOKING,
  },
];

const audiences = [
  {
    title: "Likekjønnede par",
    desc:
      "Partnerdonasjon eller IUI med donorsæd. Du og partner velger sammen hvilken vei som passer dere best.",
    href: "/behandlinger/fertilitet/assistert-befruktning-par-og-single",
    image:
      getServiceImageFromHref("/behandlinger/fertilitet/assistert-befruktning-par-og-single") ??
      audienceCouple,
  },
  {
    title: "Single",
    desc:
      "IUI med donorsæd er ofte det enkleste første steget når du ønsker barn på egen hånd. Vi følger deg trygt gjennom hele forløpet.",
    href: "/behandlinger/fertilitet/assistert-befruktning",
    image:
      getServiceImageFromHref("/behandlinger/fertilitet/assistert-befruktning") ?? audienceSingle,
  },
  {
    title: "Heterofile par",
    desc:
      "Når egne egg eller sæd ikke er et alternativ, kan donorbehandling være veien videre. Vi gjør en grundig vurdering først.",
    href: "/behandlinger/fertilitet/fertilitetsutredning",
    image:
      getServiceImageFromHref("/behandlinger/fertilitet/fertilitetsutredning") ?? audienceWaiting,
  },
];

const services = [
  { title: "Inseminasjon (IUI) med donor", desc: "Skånsom og enkel — ofte første steg", href: `${FERT}/assistert-befruktning` },
  { title: "IVF med donorsæd", desc: "Når IUI ikke fører frem", href: `${FERT}/assistert-befruktning` },
  { title: "Eggdonasjon", desc: "Norges nyeste eggbank", href: `${FERT}/donorbehandling` },
  { title: "Nedfrysning av egg og sæd", desc: "Bevar mulighetene dine", href: `${FERT}/eggfrys` },
  { title: "Fertilitetsutredning", desc: "Hormoner, ultralyd, AMH", href: `${FERT}/fertilitetsutredning` },
];

const reviews = [
  { text: "Vi følte oss inkludert og ivaretatt fra første samtale. De var tydelige på hva som var mulig — og varme hele veien.", author: "Ida og Tone", date: "Partnerdonasjon 2024" },
  { text: "Som single var jeg nervøs for å bli møtt med fordommer. Det skjedde aldri. Bare profesjonalitet og omsorg.", author: "Marie", date: "IUI med donorsæd, 2024" },
  { text: "De forklarte juss og medisinske rammer på en måte vi forsto. Endelig følte vi at vi hadde en plan.", author: "Stine og Camilla", date: "3 måneder siden" },
];

const DonorbehandlingPage = ({ isChatOpen }: PageProps) => {
  const donorSpecialists = useMemo(() => {
    const fertility = specialists.filter((s) => s.category === "fertilitet");
    return fertility.slice(0, 5);
  }, []);

  useEffect(() => {
    document.title = "Donorbehandling | CMedical — donorsæd, donoregg og partnerdonasjon";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}><EditableAutoScope>
      <PageSEO
        title="Donorbehandling | CMedical"
        description="Donorbehandling hos CMedical — donorsæd, donoregg og partnerdonasjon. Vi følger Bioteknologiloven og veileder deg gjennom alle valg."
        canonical={CANONICAL}
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Fertilitet", path: FERT },
          { name: "Donorbehandling", path: CANONICAL },
        ]}
      />
      <h1 className="sr-only">Donorbehandling hos CMedical</h1>

      {/* 1. HERO — split 50/50 */}
      <header className="bg-brand-light pt-24 lg:pt-0">
        <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
          <div className="flex items-center page-edge-text-left py-16 lg:py-24">
            <div className="max-w-xl w-full">
              <p className="text-xs font-light text-foreground/60 mb-5">
                <Link to={FERT} className="hover:text-foreground">Fertilitet</Link>
                <span className="mx-2">/</span>Donorbehandling
              </p>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
                Donorbehandling <span className="block italic">— mange veier til foreldreskap</span>
              </h2>
              <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
                Behandling med donorsæd eller donerte egg kan være aktuelt for mange.
                Vi følger Bioteknologiloven og veileder deg gjennom valgene — om du er
                singel, i et likekjønnet par eller heterofilt par.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
                <Button
                  variant="cta"
                  size="lg"
                  className="px-8 w-full sm:w-auto"
                  onClick={() => (window.location.href = buildBookingUrl({ kategori: "fertilitet", tjeneste: "donorbehandling" }))}
                >
                  Bestill time
                </Button>
                <CallUsClinicPicker variant="light" label="Ring oss" />
              </div>

              <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-light text-foreground">
                {["Ingen henvisning", "Korte ventetider", "Følger Bioteknologiloven"].map((u) => (
                  <li key={u} className="inline-flex items-center gap-2">
                    <Check className="w-4 h-4 text-foreground" aria-hidden="true" />
                    <span>{u}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="relative min-h-[420px] lg:min-h-full">
            <img
              src={fertilityHeroImg}
              alt="Donorbehandling hos CMedical"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      {/* 2. SEGMENT — tre donor-veier */}
      <section className="bg-brand-light text-foreground pt-8 md:pt-12 pb-12 md:pb-16">
        <div className="page-shell">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14">
              <h2 className="text-3xl md:text-5xl font-light leading-tight">
                Tre veier
                <span className="block">— én trygg vei videre.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-3 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
              {segments.map((s) => (
                <div key={s.id} className="bg-background p-7 flex flex-col">
                  <h3 className="text-lg font-normal mb-4 leading-snug">{s.title}</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                    {s.desc}
                  </p>
                  <Link
                    to={s.href}
                    className="inline-flex items-center text-sm font-light text-foreground hover:text-foreground/70 hover:gap-2.5 gap-2 transition-all"
                  >
                    {s.cta}
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 3. HVORFOR CMEDICAL */}
      <section className="bg-background">
        <div className="flex flex-col-reverse lg:grid lg:grid-cols-12">
          <div className="lg:col-span-7 page-edge-text-left py-14 lg:py-20">
            <div className="max-w-xl">
              
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground mb-6">
                Erfaring, åpenhet og et trygt forløp.
              </h2>
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-12">
                Donorforløp krever både medisinsk presisjon og menneskelig forståelse.
                Du møter et team som har gjort dette mange ganger — og som tar seg tid
                til å forklare.
              </p>

              <div className="divide-y divide-border/60 border-t border-border/60">
                {[
                  { n: "01", title: "Egen sædbank", desc: "Vi har tilgang på norsk donorsæd fra Livio Sperm Bank, samt internasjonale banker." },
                  { n: "02", title: "Norges nyeste eggbank", desc: "Et bredt utvalg av kvalitetssikrede donorer — kortere ventetid og god oppfølging." },
                  { n: "03", title: "Klar veiledning om jus", desc: "Vi guider deg trygt gjennom regelverket — så du forstår hva som er mulig for nettopp din situasjon." },
                ].map((step) => (
                  <div key={step.n} className="grid grid-cols-12 gap-4 py-6">
                    <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">{step.n}</div>
                    <div className="col-span-10 md:col-span-11">
                      <h3 className="text-base font-normal text-foreground mb-1.5">{step.title}</h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link to="/om-oss" className="inline-flex items-center gap-2 mt-10 text-sm font-light text-foreground hover:gap-2.5 hover:text-foreground/70 transition-all">
                Les mer om klinikken
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 lg:self-center relative bg-secondary/40 h-[320px] md:h-[420px] lg:h-[520px] overflow-hidden">
            <img src={heroClinicLounge} alt="CMedical fertilitetsklinikk i Sandvika" loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
          </div>
        </div>
      </section>

      {/* 4. ALLE ER VELKOMNE */}
      <section className="bg-secondary/40 py-14 md:py-20">
        <div className="page-shell">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14">
              <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground">
                Alle er velkomne
                <br />
                <span className="text-foreground/70">— uansett utgangspunkt.</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {audiences.map((a) => (
                <Link
                  key={a.title}
                  to={a.href}
                  className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden"
                >
                  <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
                    <img
                      src={a.image}
                      alt={a.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="p-7 flex flex-col flex-1">
                    <h3 className="text-xl font-light text-foreground mb-3">{a.title}</h3>
                    <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">{a.desc}</p>
                    <span className="inline-flex items-center text-sm font-light text-foreground gap-2 group-hover:gap-2.5 transition-all">
                      Les mer
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. SYMPTOMSJEKK */}
      <SymptomServiceSection
        background="background"
        title="Hva passer for deg?"
        description="Velg situasjonen som ligner mest — så foreslår vi en god start."
        items={[
          { symptom: "Vi er to kvinner og vil bli foreldre sammen", service: "Partnerdonasjon", href: BOOKING, image: audienceSingle, imageAlt: "Likekjønnet par" },
          { symptom: "Jeg er singel og vil ha barn", service: "IUI med donorsæd", href: `${FERT}/assistert-befruktning`, image: audienceWaiting, imageAlt: "Stille refleksjon" },
          { symptom: "Vi trenger donoregg av medisinske grunner", service: "Donoregg-utredning", href: BOOKING, image: journeyConsultation, imageAlt: "Konsultasjon med spesialist" },
          { symptom: "Vi vurderer donorsæd ved mannlig faktor", service: "Konsultasjon donorsæd", href: BOOKING, image: journeyLab, imageAlt: "Laboratorium" },
          { symptom: "Vi vil reservere donor for søsken", service: "Donorreservasjon", href: BOOKING, image: journeyResult, imageAlt: "Familieplanlegging" },
        ]}
      />

      {/* 6. RELATERTE TJENESTER */}
      <ServicesListSection
        title="Tjenester som hører sammen."
        description="Donorbehandling henger ofte sammen med andre fertilitetstjenester. Her er det vi tilbyr — ring oss gjerne for en uforpliktende prat."
        items={services}
      />

      {/* 7. RESULTATER */}
      <section className="bg-brand-light text-foreground pt-14 md:pt-16 pb-10 md:pb-12">
        <div className="page-shell">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-14 lg:gap-24 mb-14">
              <div className="lg:col-span-5">
                <h2 className="text-3xl md:text-5xl font-light leading-tight">
                  Tall som forteller en historie.
                </h2>
              </div>
              <div className="lg:col-span-7 flex items-end">
                <p className="text-base font-light text-muted-foreground leading-relaxed max-w-xl">
                  Vi måler det vi gjør — fordi du fortjener åpenhet. Her er resultater
                  fra fertilitetsbehandling de siste årene.
                </p>
              </div>
            </div>

            <div className="border-t border-brand-dark/15 py-8 md:py-10">
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-dark/15">
                {[
                  { v: "60 000", k: "Årlige pasientbesøk", sub: "På tvers av klinikkene" },
                  { v: "3 500", k: "Operasjoner", sub: "Per år" },
                  { v: "4,8/5", k: "Snittvurdering", sub: "Fra pasienter på Google" },
                  { v: "50+", k: "Spesialister", sub: "På tvers av fagfelt" },
                ].map((row, i) => (
                  <div key={row.k} className={`md:px-8 ${i === 0 ? "md:pl-0" : ""} ${i === 3 ? "md:pr-0" : ""}`}>
                    <dd className="text-3xl md:text-4xl font-light tracking-tight leading-none mb-3">
                      <AnimatedStat value={row.v} />
                    </dd>
                    <dt className="text-sm font-normal text-foreground mb-1">{row.k}</dt>
                    <p className="text-xs font-light text-foreground/60">{row.sub}</p>
                  </div>
                ))}
              </dl>
            </div>

            <p className="text-xs font-light text-muted-foreground mt-8">
              Tall oppdatert per Q1 2026. Resultater varierer individuelt.
            </p>
          </div>
        </div>
      </section>

      {/* 8. TILBAKEMELDINGER */}
      <section className="bg-brand-warm pt-10 md:pt-12 pb-14 md:pb-16">
        <div className="page-shell">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-xl mb-10">
              <h2 className="text-2xl md:text-3xl font-light text-brand-dark leading-tight">
                Tilbakemeldinger fra ekte pasienter
              </h2>
            </div>
            <div className="grid md:grid-cols-3 gap-6">
              {reviews.map((r, i) => (
                <div key={i} className="group relative p-8 rounded-sm bg-white border border-brand-dark/10 hover:border-brand-dark/20 hover:shadow-lg transition-all duration-300">
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-dark/10 rotate-180" />
                  <div className="flex mb-4">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
                    ))}
                  </div>
                  <p className="text-brand-dark font-light leading-relaxed mb-6 text-base">"{r.text}"</p>
                  <div className="pt-4 border-t border-brand-dark/10">
                    <p className="text-brand-dark font-normal text-sm">{r.author}</p>
                    <p className="text-xs text-brand-dark/60 font-light">{r.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 9. SPESIALISTER */}
      <FeatureSpotlight
        
        title={<>Begynn med en <span className="italic">samtale</span></>}
        text="Donorforløp starter med en grundig samtale der vi går gjennom dine ønsker, juridiske rammer og medisinske muligheter. Slik vet du hva som passer for nettopp din situasjon."
        ctaLabel="Bestill konsultasjon"
        ctaHref={BOOKING}
        image={fertilityHeroImg}
        imageAlt="Konsultasjon hos CMedical"
      />

      <SpecialistsScroller
        category="fertilitet"
        title="Spesialistene som følger deg."
        seeAllHref="/spesialister?kategori=fertilitet"
        seeAllLabel="Se alle fertilitetsspesialister"
      />

      {/* 10. CTA */}
      <InsurancePartners />
      <BookingCTA />
    </EditableAutoScope></PageLayout>
  );
};

export default DonorbehandlingPage;
