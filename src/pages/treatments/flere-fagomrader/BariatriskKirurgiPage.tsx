import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Check, Star, Quote, Users, Clock, User } from "lucide-react";
import { BookingCTA } from "@/components/homepage/BookingCTA";
import { InsurancePartners } from "@/components/treatments/InsurancePartners";
import { Button } from "@/components/ui/button";
import { PageLayout } from "@/components/layout/PageLayout";
import { PageSEO } from "@/components/seo/PageSEO";

import { buildBookingUrl } from "@/lib/bookingLinks";
import { specialists } from "@/data/specialists";
import { SpecialistsScroller } from "@/components/treatments/SpecialistsScroller";
import { FeatureSpotlight } from "@/components/treatments/FeatureSpotlight";
import { ServicesListSection } from "@/components/layout/ServicesListSection";
import { SymptomServiceSection } from "@/components/treatments/SymptomServiceSection";
import { TagList } from "@/components/treatments/TagList";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { AnimatedStat } from "@/components/AnimatedStat";

import heroAsset from "@/assets/hero/overvektskirurgi-hero.jpg.asset.json";
const heroImg = heroAsset.url;
import heroClinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";
import teamImage from "@/assets/hero/tverrfaglig-team.jpg";

interface PageProps {
  isChatOpen: boolean;
}

const BASE = "/behandlinger/flere-fagomrader/bariatrisk-kirurgi";

const segments = [
  {
    id: "vurderer",
    title: "Jeg vurderer overvektskirurgi",
    desc:
      "Du er nysgjerrig, men vil vite hva det innebærer — risiko, gevinst og hverdagen etterpå. Vi tar samtalen før du tar valget.",
    tags: [
      { label: "Informasjonssamtale", href: BASE },
      { label: "Gastric Sleeve", href: BASE },
      { label: "Gastric Bypass", href: BASE },
    ],
    cta: "Les mer",
    href: BASE,
  },
  {
    id: "klar",
    title: "Jeg har bestemt meg",
    desc:
      "Du vil ha en trygg, planlagt operasjon med erfarne kirurger og tett oppfølging — uten ventelister.",
    tags: [
      { label: "Robotassistert", href: "/robotassistert-kirurgi" },
      { label: "Sleeve gastrektomi", href: BASE },
      { label: "Oppfølging", href: BASE },
    ],
    cta: "Bestill vurdering",
    href: buildBookingUrl({ kategori: "flere-fagomrader", tjeneste: "bariatrisk-kirurgi" }),
  },
  {
    id: "etter",
    title: "Jeg er operert og trenger oppfølging",
    desc:
      "Vekttap er en livslang reise. Vi tilbyr medisinsk oppfølging, ernæring og samtaler i alle faser.",
    tags: [
      { label: "Ernæring", href: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
      { label: "Endokrinolog", href: "/behandlinger/flere-fagomrader/endokrinologi" },
      { label: "Psykolog", href: "/behandlinger/flere-fagomrader/psykologi" },
    ],
    cta: "Snakk med oss",
    href: BASE,
  },
  {
    id: "alternativ",
    title: "Jeg ønsker alternativer til kirurgi",
    desc:
      "Ikke alle skal opereres. Vi har endokrinolog, ernæringsfysiolog og medikamentell behandling som førstevalg når det passer.",
    tags: [
      { label: "Endokrinologi", href: "/behandlinger/flere-fagomrader/endokrinologi" },
      { label: "Ernæring", href: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
    ],
    cta: "Utforsk alternativer",
    href: "/behandlinger/flere-fagomrader/endokrinologi",
  },
];

const audiences = [
  {
    title: "Du som har prøvd alt",
    Icon: Users,
    desc:
      "Du har gått på diett, trent og prøvd medikamenter — uten varig resultat. Vi tar deg på alvor og legger en plan som varer.",
    href: buildBookingUrl({ kategori: "flere-fagomrader", tjeneste: "bariatrisk-kirurgi" }),
  },
  {
    title: "Du som har følgesykdom",
    Icon: Clock,
    desc:
      "Diabetes type 2, høyt blodtrykk, søvnapné eller leddslitasje. Kirurgisk vekttap kan endre hele helsebildet ditt.",
    href: buildBookingUrl({ kategori: "flere-fagomrader" }),
  },
  {
    title: "Du som vil ha trygghet",
    Icon: User,
    desc:
      "Du vil opereres av et erfarent team — med robotassistert teknikk, korte ventetider og tett oppfølging hele veien.",
    href: buildBookingUrl({ kategori: "flere-fagomrader", tjeneste: "bariatrisk-kirurgi" }),
  },
];

const services = [
  { title: "Informasjonssamtale", desc: "Forberedende samtale med kirurg", href: BASE },
  { title: "Gastric Sleeve", desc: "Robotassistert sleeve gastrektomi", href: BASE },
  { title: "Gastric Bypass", desc: "Når sleeve ikke er riktig valg", href: BASE },
  { title: "Robotassistert kirurgi", desc: "Presis, skånsom teknikk", href: "/robotassistert-kirurgi" },
  { title: "Endokrinologi", desc: "Hormonell utredning og behandling", href: "/behandlinger/flere-fagomrader/endokrinologi" },
  { title: "Ernæringsfysiolog", desc: "Kosthold før og etter operasjon", href: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
  { title: "Psykologi", desc: "Mental forberedelse og oppfølging", href: "/behandlinger/flere-fagomrader/psykologi" },
  { title: "Gastrokirurgi", desc: "Bredt kirurgisk fagmiljø", href: "/behandlinger/flere-fagomrader/gastrokirurgi" },
  { title: "Plastikkirurgi", desc: "Hud og kontur etter vekttap", href: "/behandlinger/flere-fagomrader/plastikkirurgi" },
];

const reviews = [
  { text: "Jeg har fått livet mitt tilbake. Teamet var profesjonelt og varmt fra første samtale.", author: "Kari N.", date: "Operert 2024" },
  { text: "Kort ventetid, grundig utredning og en kirurg som tok seg tid til å svare på alt.", author: "Geir A.", date: "2 måneder siden" },
  { text: "Oppfølgingen etterpå var avgjørende. Jeg har aldri følt meg alene i prosessen.", author: "Linn H.", date: "6 måneder siden" },
];

const BariatriskKirurgiPage = ({ isChatOpen }: PageProps) => {
  const surgerySpecialists = useMemo(() => {
    const list = specialists.filter(
      (s) =>
        s.expertise?.some((e) =>
          ["Overvektskirurgi", "Bariatrisk", "Gastrokirurgi", "Robotkirurgi"].some((kw) =>
            e.toLowerCase().includes(kw.toLowerCase())
          )
        )
    );
    return list.slice(0, 5);
  }, []);

  useEffect(() => {
    document.title = "Bariatrisk kirurgi (overvektskirurgi) | CMedical";
  }, []);

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title="Bariatrisk kirurgi (overvektskirurgi) | CMedical"
        description="Robotassistert overvektskirurgi hos CMedical. Erfarne gastrokirurger, kort ventetid og tett oppfølging — fra informasjonssamtale til livet etter operasjonen."
        canonical="/behandlinger/flere-fagomrader/bariatrisk-kirurgi"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Tjenester", path: "/tjenester" },
          { name: "Flere fagområder", path: "/flere-fagomrader" },
          { name: "Bariatrisk kirurgi", path: "/behandlinger/flere-fagomrader/bariatrisk-kirurgi" },
        ]}
      />
      <h1 className="sr-only">
        Bariatrisk kirurgi hos CMedical — robotassistert overvektskirurgi med tett oppfølging
      </h1>

      {/* 1. HERO */}
      <header className="bg-brand-light pt-24 lg:pt-0">
        <div className="grid lg:grid-cols-2 min-h-[640px] lg:min-h-[720px]">
          <div className="flex items-center page-edge-text-left py-16 lg:py-24">
            <div className="max-w-xl w-full">
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-light mb-8 text-foreground leading-[1.05]">
                Et varig vekttap <span className="block italic">begynner med en samtale</span>
              </h2>
              <p className="text-base md:text-lg font-light leading-relaxed mb-10 text-muted-foreground">
                Bariatrisk kirurgi er for deg som har prøvd det meste — og som
                trenger varig hjelp. Hos oss møter du erfarne kirurger som tar
                deg på alvor, en grundig utredning og oppfølging som varer.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center mb-10">
                <Button
                  variant="cta"
                  size="lg"
                  className="px-8 w-full sm:w-auto"
                  onClick={() =>
                    (window.location.href = buildBookingUrl({
                      kategori: "flere-fagomrader",
                      tjeneste: "bariatrisk-kirurgi",
                    }))
                  }
                >
                  Bestill informasjonssamtale
                </Button>
                <CallUsClinicPicker variant="light" label="Ring oss" />
              </div>

              <ul className="flex flex-wrap gap-x-8 gap-y-3 text-sm font-light text-foreground">
                {["Ingen henvisning", "Korte ventetider", "Robotassistert teknikk"].map((u) => (
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
              src={heroImg}
              alt="Bariatrisk kirurgi hos CMedical"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
        <div className="h-px w-full bg-foreground/5" aria-hidden="true" />
      </header>

      {/* 2. SEGMENT */}
      <section className="bg-brand-light text-foreground pt-8 md:pt-12 pb-12 md:pb-16">
        <div className="page-shell">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-2xl mb-14">
              <h2 className="text-3xl md:text-5xl font-light leading-tight">
                Fortell oss hvor du er
                <span className="block">— vi finner veien videre.</span>
              </h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-px bg-brand-dark/10 rounded-sm overflow-hidden">
              {segments.map((s) => (
                <div key={s.id} className="bg-background p-7 flex flex-col">
                  <h3 className="text-lg font-normal mb-4 leading-snug">{s.title}</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                    {s.desc}
                  </p>
                  <TagList tags={s.tags ?? []} initialVisible={3} className="mb-5" />
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
        <div className="grid lg:grid-cols-12">
          <div className="lg:col-span-7 page-edge-text-left py-14 lg:py-20">
            <div className="max-w-xl">
              <p className="text-xs text-foreground/60 mb-5">Hvorfor CMedical</p>
              <h2 className="text-3xl md:text-4xl lg:text-[2.75rem] font-light leading-[1.1] text-foreground mb-6">
                Et erfarent team — fra første samtale til livet etterpå.
              </h2>
              <p className="text-base font-light text-muted-foreground leading-relaxed mb-12">
                Bariatrisk kirurgi er mer enn et inngrep. Det er en
                livsstilsendring som krever et team. Hos oss får du kirurg,
                endokrinolog, ernæringsfysiolog og psykolog under samme tak.
              </p>

              <div className="divide-y divide-border/60 border-t border-border/60">
                {[
                  {
                    n: "01",
                    title: "Robotassistert presisjon",
                    desc: "Sleeve gastrektomi utført med kirurgisk robot — mindre snitt, raskere restitusjon og høyere presisjon.",
                  },
                  {
                    n: "02",
                    title: "Erfarne kirurger",
                    desc: "Dr. Jan Lambrecht og teamet har gjennomført hundrevis av overvektsoperasjoner — både i Norge og internasjonalt.",
                  },
                  {
                    n: "03",
                    title: "Oppfølging som varer",
                    desc: "Vi følger deg i to år etter operasjonen — med ernæring, blodprøver, samtaler og medisinsk oppfølging.",
                  },
                ].map((step) => (
                  <div key={step.n} className="grid grid-cols-12 gap-4 py-6">
                    <div className="col-span-2 md:col-span-1 text-xs font-light text-foreground/60 pt-1">
                      {step.n}
                    </div>
                    <div className="col-span-10 md:col-span-11">
                      <h3 className="text-base font-normal text-foreground mb-1.5">
                        {step.title}
                      </h3>
                      <p className="text-sm font-light text-muted-foreground leading-relaxed max-w-md">
                        {step.desc}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/om-oss"
                className="inline-flex items-center gap-2 mt-10 text-sm font-light text-foreground hover:gap-2.5 hover:text-foreground/70 transition-all"
              >
                Les mer om klinikken
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative bg-secondary/40 h-[320px] md:h-[420px] lg:h-auto lg:min-h-full overflow-hidden">
            <img
              src={teamImage}
              alt="Tverrfaglig team hos CMedical"
              loading="lazy"
              className="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* 4. AUDIENCES */}
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

            <div className="grid md:grid-cols-3 gap-6">
              {audiences.map((a) => (
                <div
                  key={a.title}
                  className="bg-background rounded-sm border border-border/40 flex flex-col p-7"
                >
                  <div className="mb-6 text-foreground/80">
                    <a.Icon className="w-6 h-6" strokeWidth={1.25} aria-hidden="true" />
                  </div>
                  <h3 className="text-lg font-normal text-foreground mb-3">{a.title}</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">
                    {a.desc}
                  </p>
                  <Link
                    to={a.href}
                    className="inline-flex items-center text-sm font-light text-foreground hover:text-foreground/70 hover:gap-2.5 gap-2 transition-all self-start"
                  >
                    Les mer
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5. SYMPTOMSJEKK */}
      <SymptomServiceSection
        background="background"
        title="Hva kjenner du på?"
        description="Velg det som ligner mest på din situasjon — så foreslår vi en god start."
        items={[
          { symptom: "Du har prøvd diett og trening uten å lykkes", service: "Informasjonssamtale", href: BASE },
          { symptom: "BMI over 35 og en eller flere følgesykdommer", service: "Vurdering av kirurg", href: BASE },
          { symptom: "Diabetes type 2 og vurderer kirurgi", service: "Endokrinolog + kirurg", href: "/behandlinger/flere-fagomrader/endokrinologi" },
          { symptom: "Operert og trenger oppfølging", service: "Ernæring og medisinsk", href: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
          { symptom: "Trenger mental forberedelse", service: "Psykolog", href: "/behandlinger/flere-fagomrader/psykologi" },
          { symptom: "Hud-overskudd etter vekttap", service: "Plastikkirurgi", href: "/behandlinger/flere-fagomrader/plastikkirurgi" },
        ]}
      />

      {/* 6. SERVICES */}
      <ServicesListSection
        title="Hva vi tilbyr."
        description="Hele forløpet — fra første informasjonssamtale til oppfølging i årene etterpå."
        items={services}
      />

      {/* 7. STATS */}
      <section className="bg-brand-light text-foreground pt-14 md:pt-16 pb-10 md:pb-12">
        <div className="page-shell">
          <div className="max-w-6xl mx-auto">
            <div className="grid lg:grid-cols-12 gap-10 lg:gap-16 mb-14">
              <div className="lg:col-span-5">
                <h2 className="text-3xl md:text-5xl font-light leading-tight">
                  Tall som forteller en historie.
                </h2>
              </div>
              <div className="lg:col-span-7 flex items-end">
                <p className="text-base font-light text-muted-foreground leading-relaxed max-w-xl">
                  Åpenhet om resultater er en del av tilliten. Her er hva vi
                  oppnår sammen med pasientene våre.
                </p>
              </div>
            </div>

            <div className="border-t border-brand-dark/15 py-8 md:py-10">
              <dl className="grid grid-cols-2 md:grid-cols-4 gap-y-8 md:gap-y-0 md:divide-x divide-brand-dark/15">
                {[
                  { v: "70%", k: "Varig vekttap", sub: "Av overvekt etter 2 år" },
                  { v: "< 14 dager", k: "Til vurdering", sub: "Snitt ventetid" },
                  { v: "300+", k: "Inngrep", sub: "Robotassistert teknikk" },
                  { v: "98%", k: "Vil anbefale", sub: "Pasientundersøkelse" },
                ].map((row, i) => (
                  <div
                    key={row.k}
                    className={`md:px-8 ${i === 0 ? "md:pl-0" : ""} ${i === 3 ? "md:pr-0" : ""}`}
                  >
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

      {/* 8. REVIEWS */}
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
                <div
                  key={i}
                  className="group relative p-8 rounded-sm bg-white border border-brand-dark/10 hover:border-brand-dark/20 hover:shadow-lg transition-all duration-300"
                >
                  <Quote className="absolute top-6 right-6 w-8 h-8 text-brand-dark/10 rotate-180" />
                  <div className="flex mb-4">
                    {[0, 1, 2, 3, 4].map((s) => (
                      <Star key={s} className="w-4 h-4 fill-[#FFC107] text-[#FFC107]" />
                    ))}
                  </div>
                  <p className="text-brand-dark font-light leading-relaxed mb-6 text-base">
                    "{r.text}"
                  </p>
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

      {/* 9. SPOTLIGHT + SPESIALISTER */}
      <FeatureSpotlight
        eyebrow="Start her"
        title={<>Begynn med en <span className="italic">informasjonssamtale</span></>}
        text="En grundig samtale med kirurg og koordinator. Vi går gjennom helsehistorikk, mål og forventninger — slik at du kan ta valget på trygt grunnlag."
        ctaLabel="Bestill informasjonssamtale"
        ctaHref={buildBookingUrl({ kategori: "flere-fagomrader", tjeneste: "bariatrisk-kirurgi" })}
        image={heroClinicLounge}
        imageAlt="Konsultasjon med kirurg hos CMedical"
      />

      {surgerySpecialists.length > 0 && (
        <SpecialistsScroller
          category="annet"
          title="Kirurgene som opererer deg."
          seeAllHref="/spesialister"
          seeAllLabel="Se alle spesialister"
        />
      )}

      {/* 10. CTA */}
      <InsurancePartners />
      <BookingCTA />
    </PageLayout>
  );
};

export default BariatriskKirurgiPage;
