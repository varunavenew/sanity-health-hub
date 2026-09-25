import { useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { PageLayout } from "@/components/layout/PageLayout";
import { Button } from "@/components/ui/button";
import { CallUsClinicPicker } from "@/components/booking/CallUsClinicPicker";
import { SpecialistBio } from "@/components/specialist/SpecialistBio";
import { SpecialistReviews } from "@/components/specialist/SpecialistReviews";
import { SpecialistCarousel } from "@/components/specialists/SpecialistCarousel";
import { FaqSection } from "@/components/layout/FaqSection";
import { PageSEO } from "@/components/seo/PageSEO";
import { ReadMoreLink } from "@/components/ui/ReadMoreLink";
import { ParallaxImage } from "@/components/ui/ParallaxImage";
import { useSpecialistsData } from "@/hooks/useSpecialistsData";
import { useTreatment } from "@/hooks/useSanity";
import { getPortraitFocal } from "@/lib/specialistFocal";

interface AshiAhmadProfileProps {
  isChatOpen: boolean;
}

const FALLBACK_IMAGES = {
  ultralyd: "https://cdn.sanity.io/images/9jhqpk3a/production/1683599bebe2edd1570a07e83c5d60647f06ad5e-1250x1080.png",
  nipt: "https://cdn.sanity.io/images/9jhqpk3a/production/f079ccda373959cfcd06b846581690ff04c34d4d-1250x1080.png",
  fosterdiagnostikk: "https://cdn.sanity.io/images/9jhqpk3a/production/3cefd3c222965a3537e3d9c65db4331e2e108a63-1250x1080.png",
  svangerskapsoppfolging: "https://cdn.sanity.io/images/9jhqpk3a/production/0c67abf18977558ddc5b4acf905b98f5a8c70de8-1250x1080.jpg",
};

const SERVICES = [
  { name: "Tidlig ultralyd", price: "2 100", duration: "30 minutter" },
  { name: "Tidlig ultralyd + NIPT-test hos fostermedisiner", price: "9 800", duration: "30 minutter" },
  { name: "Organrettet ultralyd hos fostermedisiner", price: "2 100", duration: "30 minutter" },
  { name: "Organrettet ultralyd + NIPT test (uke 12–14) hos fostermedisiner", price: "9 950", duration: "30 minutter" },
  { name: "Svangerskapskontroll", price: "2 100", duration: "30 minutter" },
  { name: "Svangerskapsoppfølging", price: "2 100", duration: "30 minutter" },
  { name: "Tidlig ultralyd enkel", price: "2 100", duration: "30 minutter" },
];

const FAQS = [
  { id: "henvisning", question: "Henvisning", answer: "Du trenger ikke henvisning for å bestille time hos oss. Du kan enkelt booke direkte via vår nettside eller ringe oss. Hvis du har henvisning fra fastlege, ta den gjerne med til konsultasjonen." },
  { id: "ventetid", question: "Ventetid", answer: "Vi tilbyr korte ventetider. De fleste får time innen 1-3 dager, avhengig av behandlingstype og tilgjengelighet." },
  { id: "sykemelding", question: "Sykemelding", answer: "Våre spesialister kan skrive sykemelding hvis det er medisinsk grunnlag for det. Dette vurderes individuelt i forbindelse med konsultasjonen." },
  { id: "utredning", question: "Utredning", answer: "Vi tilbyr grundig utredning innen alle våre tjenester. Utredningen tilpasses din situasjon og kan inkludere samtale, undersøkelse, blodprøver og bildediagnostikk." },
  { id: "selskapet", question: "Selskapet", answer: "CMedical er Nordens ledende klinikk for livet og underlivet, med særlig vekt på kvinnehelse. Vi er også opptatt av menns helse og fertilitet som angår alle som er involvert i å skape liv. Hvert år har vi over 60 000 pasientbesøk ved klinikkene våre." },
  { id: "forsikring", question: "Forsikring", answer: "Vi har avtale med de fleste forsikringsselskaper, inkludert EuroAccident, Falck, Fremtind, Gjensidige, Storebrand, Tryg, Vertikal Helse og Vialia. Kontakt ditt forsikringsselskap for å sjekke hva din forsikring dekker, og be om å få time hos CMedical." },
];

const AshiHero = ({ image, onBook }: { image: string; onBook: () => void }) => (
  <header className="bg-brand-light">
    <div className="grid md:grid-cols-2 min-h-[640px]">
      <div className="flex items-center page-edge-text-left py-16 md:py-20 order-2 md:order-1">
        <div className="max-w-xl w-full">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-light text-foreground leading-[1.05] mb-4">
            Ashi Ahmad
          </h1>
          <p className="text-lg md:text-xl font-light text-foreground/80 flex flex-wrap items-center gap-x-2 gap-y-1">
            <span>Gynekolog</span><span className="text-foreground/30">·</span>
            <span>Fostermedisiner</span><span className="text-foreground/30">·</span>
            <span className="inline-flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-foreground/50" aria-hidden="true" /> Majorstuen
            </span>
          </p>
          <div className="hidden md:flex gap-3 items-center mt-8">
            <Button variant="cta" size="lg" onClick={onBook}>Bestill time hos Ashi</Button>
            <CallUsClinicPicker
              variant="light"
              label="Ring oss"
              className="hover:bg-foreground hover:text-background hover:border-foreground"
            />
          </div>
        </div>
      </div>
      <div className="relative min-h-[55svh] md:min-h-full order-1 md:order-2 bg-secondary">
        <img
          src={image}
          alt="Ashi Ahmad"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: getPortraitFocal(image) }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/30 via-transparent to-transparent" aria-hidden="true" />
      </div>
    </div>
  </header>
);

const AshiTreatmentCards = () => {
  const ultralyd = useTreatment("graviditet", "ultralyd");
  const nipt = useTreatment("graviditet", "nipt");
  const fosterdiagnostikk = useTreatment("graviditet", "fosterdiagnostikk");
  const oppfolging = useTreatment("graviditet", "svangerskapsoppfolging");
  const cards = [
    { title: "Ultralyd i svangerskapet", to: "/graviditet/ultralyd", text: "Ultralydundersøkelser gjennom hele svangerskapet, fra tidlig ultralyd i uke 6 til organrettet ultralyd i uke 18–20.", image: ultralyd.data?.heroImage || FALLBACK_IMAGES.ultralyd },
    { title: "NIPT", to: "/graviditet/nipt", text: "Fra svangerskapsuke 10 kan du ta NIPT-test og tidlig ultralyd hos oss. En blodprøve fra mor kombinert med ultralyd.", image: nipt.data?.heroImage || FALLBACK_IMAGES.nipt },
    { title: "Fosterdiagnostikk", to: "/graviditet/fosterdiagnostikk", text: "Ulike undersøkelser for å vurdere fosterets helse og utvikling — fra ultralyd og blodprøver til mer avanserte tester.", image: fosterdiagnostikk.data?.heroImage || FALLBACK_IMAGES.fosterdiagnostikk },
    { title: "Graviditetsoppfølging", to: "/graviditet/svangerskapsoppfolging", text: "Oppfølging gjennom hele svangerskapet. Fødselsleger, gynekologer og fostermedisinere — deres kompetanse er din trygghet.", image: oppfolging.data?.heroImage || FALLBACK_IMAGES.svangerskapsoppfolging },
  ];

  return (
    <section className="bg-secondary/40 py-14 md:py-28">
      <div className="container mx-auto px-6 md:px-16">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-10 md:mb-14">Dette hjelper Ashi deg med</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 md:gap-6">
            {cards.map((card) => (
              <Link key={card.title} to={card.to} className="bg-background rounded-sm border border-border/40 flex flex-col group hover:border-foreground/30 transition-colors overflow-hidden">
                <div className="relative w-full aspect-[16/9] overflow-hidden bg-secondary">
                  <img
                    src={card.image}
                    alt={card.title}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="p-7 flex flex-col flex-1">
                  <h3 className="text-xl font-light text-foreground mb-3">{card.title}</h3>
                  <p className="text-sm font-light text-muted-foreground leading-relaxed mb-6 flex-1">{card.text}</p>
                  <ReadMoreLink>Les mer</ReadMoreLink>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const PregnancyFeature = () => (
  <section className="bg-brand-light">
    <div className="grid md:grid-cols-2 md:h-[100svh]">
      <div className="flex items-center page-edge-text-left py-14 md:py-0">
        <div className="max-w-xl">
          <h2 className="text-3xl md:text-5xl font-light leading-tight text-foreground mb-6">Graviditet</h2>
          <p className="text-base md:text-lg font-light text-muted-foreground leading-relaxed mb-8">
            Vi ønsker deg velkommen til oppfølging gjennom hele svangerskapet. Vi tilbyr fosterdiagnostikk, som NIPT og tidlig ultralyd. Hos oss jobber fødselsleger, gynekologspesialister og fostermedisinere.
          </p>
          <ReadMoreLink to="/graviditet" tone="standalone">Se hele området</ReadMoreLink>
        </div>
      </div>
      <ParallaxImage
        src={FALLBACK_IMAGES.svangerskapsoppfolging}
        alt="Graviditetsoppfølging"
        speed={0.18}
        className="relative min-h-[420px] md:min-h-0 md:h-full overflow-hidden"
        imgClassName="object-cover"
      />
    </div>
  </section>
);

const AshiBooking = ({ bookingRef }: { bookingRef: React.RefObject<HTMLDivElement> }) => {
  const navigate = useNavigate();
  const selectService = (service: string) => navigate(`/booking?kategori=fostermedisiner&tjeneste=${encodeURIComponent(service)}&spesialist=ashi-ahmad`);
  return (
    <section ref={bookingRef} className="py-14 md:py-20 bg-brand-dark scroll-mt-20">
      <div className="container mx-auto px-6 md:px-16">
        <div className="grid md:grid-cols-12 gap-8 md:gap-16">
          <div className="md:col-span-4">
            <h2 className="text-2xl md:text-3xl font-light text-brand-warm mb-3">Bestill time hos Ashi</h2>
            <p className="text-sm text-brand-warm/60 font-light leading-relaxed max-w-sm">Velg tjeneste og finn en tid som passer. Ingen henvisning nødvendig.</p>
          </div>
          <div className="md:col-span-8">
            <div className="border border-brand-warm/15 rounded-sm overflow-hidden bg-brand-warm/10">
              {SERVICES.map((service) => (
                <Button key={service.name} variant="ghost" onClick={() => selectService(service.name)} className="group w-full h-auto rounded-none max-sm:rounded-none px-5 py-4 justify-between text-left border-b border-brand-warm/10 last:border-b-0 hover:bg-brand-warm/15 hover:text-brand-warm">
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
            <p className="mt-3 text-xs font-light text-brand-warm/55">Viser kun timetyper Ashi er satt opp på. Timer hentes fra Metodika.</p>
            <a href="tel:+4722600050" className="inline-flex items-center gap-2 mt-6 text-sm font-light text-brand-warm hover:text-brand-warm/75 transition-colors">Ring oss så hjelper vi deg · 22 60 00 50</a>
            <div className="mt-4">
              <Button asChild variant="cta-dark" size="lg"><Link to="/priser">Se alle tjenester og priser <ArrowRight aria-hidden="true" /></Link></Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

const AshiAhmadProfile = ({ isChatOpen }: AshiAhmadProfileProps) => {
  const bookingRef = useRef<HTMLDivElement>(null);
  const { findBySlug, byCategory } = useSpecialistsData();
  const specialist = findBySlug("ashi-ahmad");
  if (!specialist) return null;
  const related = byCategory("gynekologi").filter((item) => item.slug !== specialist.slug);
  const scrollToBooking = () => bookingRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <PageLayout isChatOpen={isChatOpen}>
      <PageSEO title="Ashi Ahmad – Gynekolog og fostermedisiner" description="Bestill time hos Ashi Ahmad, gynekolog og fostermedisiner ved CMedical Majorstuen." canonical="/spesialister/ashi-ahmad" type="profile" />
      <AshiHero image={specialist.image} onBook={scrollToBooking} />
      <SpecialistBio specialist={specialist} />
      <AshiTreatmentCards />
      <PregnancyFeature />
      <AshiBooking bookingRef={bookingRef} />
      <SpecialistReviews specialist={specialist} />
      <SpecialistCarousel specialists={related} title="Andre spesialister innen gynekologi" description="" seeAllHref="/spesialister?kategori=gynekologi" seeAllLabel="Se alle gynekologer" className="pt-10 md:pt-14 pb-14 md:pb-16 bg-background overflow-hidden" />
      <FaqSection faqs={FAQS} />
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t border-border/40 px-4 py-3 safe-area-pb">
        <Button variant="cta" onClick={scrollToBooking} className="w-full">Bestill time hos Ashi</Button>
      </div>
    </PageLayout>
  );
};

export default AshiAhmadProfile;