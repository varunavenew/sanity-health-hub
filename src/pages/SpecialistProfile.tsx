import { useMemo, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { motion } from "framer-motion";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { SpecialistBio } from "@/components/specialist/SpecialistBio";
import { SpecialistReviews } from "@/components/specialist/SpecialistReviews";
import { InlineBookingSection } from "@/components/specialist/InlineBookingSection";
import { SpecialistCarousel } from "@/components/specialists/SpecialistCarousel";
import { FaqSection } from "@/components/layout/FaqSection";
import { PageSEO } from "@/components/seo/PageSEO";
import { ReadMoreLink } from "@/components/ui/ReadMoreLink";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { useSpecialistsData, type Specialist } from "@/hooks/useSpecialistsData";
import { useFaqs, useTreatmentCategory, useTreatmentsByIds } from "@/hooks/useSanity";
import { getPortraitFocal } from "@/lib/specialistFocal";
import { SPECIALIST_PROFILE_DATA } from "@/data/specialistProfileData";
import { staticTreatmentCard, type ProfileTreatmentCard } from "@/lib/specialistTreatmentFallback";
import urologiHeroAsset from "@/assets/services/urologi-hero.jpg.asset.json";
import fertilitetImg from "@/assets/categories/fertilitet-real.jpg";
import gynekologiImg from "@/assets/categories/gynekologi-real.jpg";
import ortopediImg from "@/assets/categories/ortopedi-real.jpg";
import flereImg from "@/assets/categories/flere-fagomrader.jpg";

interface SpecialistProfileProps {
  isChatOpen: boolean;
}

const PHONE_DISPLAY = "22 60 00 50";
const PHONE_HREF = "tel:+4722600050";

/* ─── Static fallbacks (used only when Sanity has no value) ─────────── */

const STATIC_FAQS = [
  { id: "henvisning", question: "Henvisning", answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss. Hvis du har henvisning fra fastlege, ta den gjerne med til konsultasjonen." },
  { id: "ventetid", question: "Ventetid", answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager, avhengig av behandlingstype og tilgjengelighet." },
  { id: "sykemelding", question: "Sykemelding", answer: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det. Dette vurderes individuelt i forbindelse med konsultasjonen." },
  { id: "utredning", question: "Utredning", answer: "Vi tilbyr grundig utredning innen alle våre tjenester. Utredningen tilpasses din situasjon og kan inkludere samtale, undersøkelse, blodprøver og bildediagnostikk." },
  { id: "selskapet", question: "Selskapet", answer: "CMedical er Nordens ledende klinikk for livet og underlivet, med særlig vekt på kvinnehelse. Vi er også opptatt av menns helse og fertilitet som angår alle som er involvert i å skape liv. Hvert år har vi over 60 000 pasientbesøk ved klinikkene våre." },
  { id: "forsikring", question: "Forsikring", answer: "Vi har avtale med de fleste forsikringsselskaper, inkludert EuroAccident, Falck, Fremtind, Gjensidige, Storebrand, Tryg, Vertikal Helse og Vialia. Kontakt ditt forsikringsselskap for å sjekke hva din forsikring dekker, og be om å få time hos CMedical." },
];

const GRAVIDITET_IMAGE = "https://cdn.sanity.io/images/9jhqpk3a/production/0c67abf18977558ddc5b4acf905b98f5a8c70de8-1250x1080.jpg";

type AreaInfo = { slug: string; title: string; description: string; image: string; href: string };

const STATIC_AREAS: Record<string, AreaInfo> = {
  gynekologi: { slug: "gynekologi", title: "Gynekologi", href: "/gynekologi", image: gynekologiImg, description: "Spesialistgynekologi hos CMedical. Endometriose, overgangsalder, urinlekkasje, fødselsskader og kvinnehelse — uten henvisning, uten ventetid." },
  fertilitet: { slug: "fertilitet", title: "Fertilitet", href: "/fertilitet", image: fertilitetImg, description: "Fertilitetsbehandling hos CMedical. IVF, inseminasjon, eggfrys, fertilitetsutredning og donorbehandling — uten henvisning, uten ventetid." },
  urologi: { slug: "urologi", title: "Urologi", href: "/urologi", image: urologiHeroAsset.url, description: "Spesialisturologi hos CMedical. Prostata, blære, testikler, ereksjon og robotkirurgi — uten henvisning, uten ventetid." },
  ortopedi: { slug: "ortopedi", title: "Ortopedi", href: "/ortopedi", image: ortopediImg, description: "Spesialistortopedi hos CMedical. Skulder, kne, hofte, hånd og fot — diagnose og plan på første konsultasjon. Ingen henvisning, ingen ventetid." },
  "flere-fagomrader": { slug: "flere-fagomrader", title: "Flere tjenester", href: "/flere-fagomrader", image: flereImg, description: "Hud, psykologi, sexologi, ernæring, kirurgi og mer — Nordens fremste spesialister, ofte i tverrfaglige team. Kort ventetid, ingen henvisning." },
  graviditet: { slug: "graviditet", title: "Graviditet", href: "/graviditet", image: GRAVIDITET_IMAGE, description: "Vi ønsker deg velkommen til oppfølging gjennom hele svangerskapet. Vi tilbyr fosterdiagnostikk, som NIPT og tidlig ultralyd. Hos oss jobber fødselsleger, gynekologspesialister og fostermedisinere." },
};

/** Per-specialist overrides (approved Ashi demo). */
const AREA_OVERRIDE: Record<string, string> = { "ashi-ahmad": "graviditet" };

type HardcodedService = { name: string; price: string; duration: string };
const BOOKING_OVERRIDE: Record<string, { kategori: string; services: HardcodedService[] }> = {
  "ashi-ahmad": {
    kategori: "fostermedisiner",
    services: [
      { name: "Tidlig ultralyd", price: "2 100", duration: "30 minutter" },
      { name: "Tidlig ultralyd + NIPT-test hos fostermedisiner", price: "9 800", duration: "30 minutter" },
      { name: "Organrettet ultralyd hos fostermedisiner", price: "2 100", duration: "30 minutter" },
      { name: "Organrettet ultralyd + NIPT test (uke 12–14) hos fostermedisiner", price: "9 950", duration: "30 minutter" },
      { name: "Svangerskapskontroll", price: "2 100", duration: "30 minutter" },
      { name: "Svangerskapsoppfølging", price: "2 100", duration: "30 minutter" },
      { name: "Tidlig ultralyd enkel", price: "2 100", duration: "30 minutter" },
    ],
  },
};

const normalizeCategory = (slug?: string) => (!slug || slug === "annet" || slug === "ovrige" ? "flere-fagomrader" : slug);

/* ─── Sections ──────────────────────────────────────────────────────── */

const ProfileHero = ({ specialist, meta, bookable, onBook }: { specialist: Specialist; meta: string; bookable: boolean; onBook: () => void }) => {
  const firstName = specialist.name.split(" ")[0];
  const clinic = specialist.clinics?.join(" · ");
  return (
    <header className="bg-brand-light">
      <div className="grid md:grid-cols-2 min-h-[640px]">
        <div className="flex items-center page-edge-text-left py-16 md:py-20 order-2 md:order-1">
          <div className="max-w-xl w-full">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.05] mb-4">{specialist.name}</h1>
            <p className="text-lg md:text-xl font-light text-foreground/80 flex flex-wrap items-center gap-x-2 gap-y-1">
              {meta.split(" · ").filter(Boolean).map((part, i) => (
                <span key={i} className="contents">
                  {i > 0 && <span className="text-foreground/30">·</span>}
                  <span>{part}</span>
                </span>
              ))}
              {clinic && (
                <>
                  <span className="text-foreground/30">·</span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="w-4 h-4 text-foreground/50" aria-hidden="true" /> {clinic}
                  </span>
                </>
              )}
            </p>
            <div className="hidden md:flex gap-3 items-center mt-8">
              {bookable ? (
                <>
                  <Button variant="cta" size="lg" onClick={onBook}>Bestill time hos {firstName}</Button>
                  <CallUsClinicPicker variant="light" label="Ring oss" className="hover:bg-foreground hover:text-background hover:border-foreground" />
                </>
              ) : (
                <>
                  <Button asChild variant="cta" size="lg"><a href={PHONE_HREF}>Ring for å bestille time</a></Button>
                  <Button asChild variant="outline" size="lg"><a href={PHONE_HREF}>{PHONE_DISPLAY}</a></Button>
                </>
              )}
            </div>
          </div>
        </div>
        <div className="relative min-h-[55svh] md:min-h-full order-1 md:order-2 bg-secondary">
          <img src={specialist.image} alt={specialist.name} className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: getPortraitFocal(specialist.image) }} />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 via-transparent to-transparent" aria-hidden="true" />
        </div>
      </div>
    </header>
  );
};

const useTreatmentCards = (ids: string[]) => {
  const { data, isLoading } = useTreatmentsByIds(ids);
  return useMemo(() => {
    const byId = new Map((data || []).map((t: any) => [t._id, t]));
    const cards: ProfileTreatmentCard[] = [];
    const missing: string[] = [];
    for (const id of ids) {
      const t: any = byId.get(id);
      const fallback = staticTreatmentCard(id);
      if (t?.title && t?.slug) {
        cards.push({
          id,
          title: t.title,
          text: t.description || t.heroDescription || fallback?.text || "",
          image: t.heroImage || fallback?.image,
          to: `/behandlinger/${normalizeCategory(t.categorySlug)}/${t.slug}`,
        });
      } else if (fallback) {
        cards.push(fallback);
      } else {
        missing.push(id);
      }
    }
    if (!isLoading && missing.length && import.meta.env.DEV) console.warn("[SpecialistProfile] treatments not found:", missing);
    return { cards, missing };
  }, [data, ids, isLoading]);
};

const TreatmentCards = ({ firstName, cards }: { firstName: string; cards: ProfileTreatmentCard[] }) => (
  <section className="bg-secondary/40 py-14 md:py-28">
    <div className="container mx-auto px-6 md:px-16">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-10 md:mb-14">Dette hjelper {firstName} deg med</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
          {cards.map((card) => (
            <Link key={card.id} to={card.to} className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden">
              <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
                {card.image && (
                  <img src={card.image} alt={card.title} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
                )}
              </div>
              <div className="p-7 flex flex-col flex-1">
                <h3 className="text-xl font-light text-foreground mb-3">{card.title}</h3>
                <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1 line-clamp-3">{card.text}</p>
                <ReadMoreLink>Les mer</ReadMoreLink>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </section>
);

const AreaBlock = ({ area }: { area: AreaInfo }) => (
  <section className="bg-brand-light">
    <div className="grid md:grid-cols-2 md:h-[100svh]">
      <div className="flex items-center page-edge-text-left py-14 md:py-0">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-6">{area.title}</h2>
          <p className="text-base md:text-lg font-light text-muted-foreground leading-relaxed mb-8">{area.description}</p>
          <ReadMoreLink to={area.href} tone="standalone">Se hele området</ReadMoreLink>
        </div>
      </div>
      <ParallaxImage src={area.image} alt={area.title} speed={0.18} className="relative min-h-[420px] md:min-h-0 md:h-full overflow-hidden" imgClassName="object-cover" />
    </div>
  </section>
);

const HardcodedBookingList = ({ slug, firstName }: { slug: string; firstName: string }) => {
  const navigate = useNavigate();
  const cfg = BOOKING_OVERRIDE[slug];
  return (
    <>
      <div className="border border-brand-warm/15 rounded-sm overflow-hidden bg-brand-warm/10">
        {cfg.services.map((service) => (
          <Button key={service.name} variant="ghost" onClick={() => navigate(`/booking?kategori=${cfg.kategori}&tjeneste=${encodeURIComponent(service.name)}&spesialist=${slug}`)} className="group w-full h-auto rounded-none max-sm:rounded-none px-5 py-4 justify-between text-left border-b border-brand-warm/10 last:border-b-0 hover:bg-brand-warm/15 hover:text-brand-warm">
            <span className="min-w-0 whitespace-normal">
              <span className="block text-sm text-brand-warm font-light leading-snug">{service.name}</span>
              <span className="flex flex-wrap items-center gap-x-2 mt-1 text-xs text-brand-warm/60 font-light">
                <span className="inline-flex items-center gap-1"><Clock className="w-3 h-3" aria-hidden="true" />{service.duration}</span>
                <span>·</span><span>fra kr {service.price}</span>
              </span>
            </span>
            <ArrowRight className="w-4 h-4 text-brand-warm/50 group-hover:text-brand-warm shrink-0" aria-hidden="true" />
          </Button>
        ))}
      </div>
      <p className="mt-3 text-xs font-light text-brand-warm/55">Viser kun timetyper {firstName} er satt opp på. Timer hentes fra Metodika.</p>
      <a href={PHONE_HREF} className="inline-flex items-center gap-2 mt-6 text-sm font-light text-brand-warm hover:text-brand-warm/75 transition-colors">Ring oss så hjelper vi deg · {PHONE_DISPLAY}</a>
      <div className="mt-4">
        <Button asChild variant="cta-dark" size="lg"><Link to="/priser">Se alle tjenester og priser <ArrowRight aria-hidden="true" /></Link></Button>
      </div>
    </>
  );
};

const BookingSection = ({ specialist, bookingRef }: { specialist: Specialist; bookingRef: React.RefObject<HTMLDivElement> }) => {
  const firstName = specialist.name.split(" ")[0];
  return (
    <section ref={bookingRef} className="py-14 md:py-20 bg-brand-dark scroll-mt-20">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-16">
          <motion.div initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5 }} className="md:col-span-4">
            <h2 className="text-2xl md:text-3xl font-light text-brand-warm mb-3">Bestill time hos {firstName}</h2>
            <p className="text-sm text-brand-warm/60 font-light leading-relaxed max-w-sm">Velg tjeneste og finn en tid som passer. Ingen henvisning nødvendig.</p>
          </motion.div>
          <div className="md:col-span-8">
            {BOOKING_OVERRIDE[specialist.slug]
              ? <HardcodedBookingList slug={specialist.slug} firstName={firstName} />
              : <InlineBookingSection specialist={specialist} />}
          </div>
        </div>
      </div>
    </section>
  );
};

const FaqBlock = () => {
  const { data } = useFaqs("generelt");
  const faqs = data && data.length > 0
    ? data.map((f: any, i: number) => ({ id: `faq-${i}`, question: f.question, answer: f.answer }))
    : STATIC_FAQS;
  return <FaqSection faqs={faqs} />;
};

/* ─── Page ──────────────────────────────────────────────────────────── */

const SpecialistProfile = ({ isChatOpen }: SpecialistProfileProps) => {
  const { slug = "" } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const bookingRef = useRef<HTMLDivElement>(null);
  const { findBySlug, byCategory } = useSpecialistsData();
  const specialist = findBySlug(slug);
  const profileData = SPECIALIST_PROFILE_DATA[slug];
  const treatmentIds = useMemo(() => profileData?.treatments ?? [], [profileData]);
  const { cards } = useTreatmentCards(treatmentIds);

  const firstCategory = normalizeCategory(specialist?.categorySlugs?.[0] ?? specialist?.category);
  const areaSlug = AREA_OVERRIDE[slug] ?? firstCategory;
  const { data: sanityCategory } = useTreatmentCategory(areaSlug === "flere-fagomrader" ? "" : areaSlug);

  if (!specialist) {
    return (
      <PageLayout isChatOpen={isChatOpen}>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-light text-foreground mb-4">Spesialist ikke funnet</h1>
            <Button onClick={() => navigate(-1)} variant="outline">Gå tilbake</Button>
          </div>
        </div>
      </PageLayout>
    );
  }

  const firstName = specialist.name.split(" ")[0];
  const bookable = specialist.bookingEnabled !== false;
  const meta = profileData?.expertise ?? [specialist.title, specialist.subtitle].filter(Boolean).join(" · ");

  const staticArea = STATIC_AREAS[areaSlug];
  const area: AreaInfo | null = AREA_OVERRIDE[slug]
    ? staticArea
    : staticArea || sanityCategory
      ? {
          slug: areaSlug,
          title: sanityCategory?.title || staticArea?.title || "",
          description: sanityCategory?.description || staticArea?.description || "",
          image: sanityCategory?.heroImage || staticArea?.image || "",
          href: staticArea?.href || `/behandlinger/${areaSlug}`,
        }
      : null;

  const related = byCategory(specialist.category).filter((s) => s.slug !== specialist.slug);
  const categoryLabel = (STATIC_AREAS[firstCategory]?.title || specialist.category).toLowerCase();
  const scrollToBooking = () => bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO
        title={`${specialist.name} – ${meta}`}
        description={`Bestill time hos ${specialist.name}, ${meta} hos CMedical. Ingen henvisning nødvendig.`}
        canonical={`/spesialister/${specialist.slug}`}
        type="profile"
        breadcrumbs={[
          { name: "Hjem", path: "/" },
          { name: "Spesialister", path: "/spesialister" },
          { name: specialist.name, path: `/spesialister/${specialist.slug}` },
        ]}
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Physician",
          name: specialist.name,
          jobTitle: meta,
          worksFor: { "@type": "MedicalClinic", name: "CMedical" },
          url: `https://cmedical.no/spesialister/${specialist.slug}`,
        }}
      />
      <ProfileHero specialist={specialist} meta={meta} bookable={bookable} onBook={scrollToBooking} />
      <SpecialistBio specialist={specialist} />
      {cards.length > 0 && <TreatmentCards firstName={firstName} cards={cards} />}
      {area && <AreaBlock area={area} />}
      {bookable && <BookingSection specialist={specialist} bookingRef={bookingRef} />}
      <SpecialistReviews specialist={specialist} />
      <SpecialistCarousel
        specialists={related}
        title={`Andre spesialister innen ${categoryLabel}`}
        description=""
        seeAllHref={`/spesialister?kategori=${specialist.category}`}
        seeAllLabel="Se alle spesialister"
        centerFew
        className="pt-10 md:pt-14 pb-14 md:pb-16 bg-background overflow-hidden"
      />
      <FaqBlock />
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border/40 px-4 py-3 safe-area-pb">
        {bookable
          ? <Button variant="cta" onClick={scrollToBooking} className="w-full">Bestill time hos {firstName}</Button>
          : <Button asChild variant="cta" className="w-full"><a href={PHONE_HREF}>Ring for å bestille time</a></Button>}
      </div>
    </PageLayout>
  );
};

export default SpecialistProfile;
