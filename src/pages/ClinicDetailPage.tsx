import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { PageLayout } from "@/components/layout/PageLayout";
import { MapPin, Phone, Clock, Car, Train, Accessibility, ArrowLeft, ExternalLink, Stethoscope, ArrowRight, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { getClinicBySlug } from "@/data/clinicServices";
import { useClinic } from "@/hooks/useSanity";
import { PageSEO } from "@/components/seo/PageSEO";
import { ClinicBookingBlock } from "@/components/clinic/ClinicBookingBlock";

// Local interior gallery per clinic — extra photos shown below the primary image.
import majorstuenVenteromTv from "@/assets/clinics/majorstuen/venterom-tv.asset.json";
import majorstuenKorridorSittegruppe from "@/assets/clinics/majorstuen/korridor-sittegruppe.asset.json";
import majorstuenHvilerom from "@/assets/clinics/majorstuen/hvilerom.asset.json";
import majorstuenKorridor from "@/assets/clinics/majorstuen/korridor.asset.json";
import majorstuenVenteromDetalj from "@/assets/clinics/majorstuen/venterom-detalj.asset.json";

const clinicGalleries: Record<string, { src: string; alt: string }[]> = {
  majorstuen: [
    { src: majorstuenVenteromTv.url, alt: "Venterom med skjerm, planter og lounge-stoler på CMedical Majorstuen" },
    { src: majorstuenKorridorSittegruppe.url, alt: "Korridor med sittegruppe og treverk på CMedical Majorstuen" },
    { src: majorstuenKorridor.url, alt: "Lys korridor med trepanel på CMedical Majorstuen" },
    { src: majorstuenHvilerom.url, alt: "Rolig hvilerom med dempet lys på CMedical Majorstuen" },
  ],

};

// Lookup: service-ID → display label + optional link
const SERVICE_LABELS: Record<string, { label: string; path?: string }> = {
 fertilitet: { label: "Fertilitet", path: "/behandlinger/fertilitet" },
 fostermedisiner: { label: "Fostermedisin" },
 gynekolog: { label: "Gynekologi", path: "/behandlinger/gynekologi" },
 ernaringsfysiolog: { label: "Ernæringsfysiolog", path: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
 psykolog: { label: "Psykolog", path: "/behandlinger/flere-fagomrader/psykologi" },
 sexolog: { label: "Sexolog", path: "/behandlinger/flere-fagomrader/sexologi" },
 gastrokirurg: { label: "Gastrokirurgi" },
 ortoped: { label: "Ortopedi", path: "/behandlinger/ortopedi" },
 handterapeut: { label: "Håndterapeut" },
 revmatolog: { label: "Revmatolog" },
 urolog: { label: "Urologi", path: "/behandlinger/urologi" },
 hudhelse: { label: "Hudhelse", path: "/behandlinger/flere-fagomrader/hudhelse" },
 areknuter: { label: "Åreknuter" },
 "sprengte-blodkar": { label: "Sprengte blodkar" },
 fysioterapeut: { label: "Fysioterapeut" },
 uroterapi: { label: "Uroterapi" },
 plastikkirurgi: { label: "Plastikkirurgi" },
 karkirurgi: { label: "Karkirurgi" },
 hjertespesialist: { label: "Hjertespesialist" },
 almennlege: { label: "Allmennlege" },
};

interface ClinicDetailPageProps {
 isChatOpen: boolean;
}

// Static FAQ fallback per clinic
const clinicFaqs: Record<string, { question: string; answer: string }[]> = {
 majorstuen: [
 { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning. Dersom du ønsker å bruke forsikring eller offentlig refusjon, kan det være krav om henvisning fra fastlege." },
 { question: "Kan jeg bruke helseforsikring?", answer: "Ja, vi samarbeider med de fleste forsikringsselskap. Ta kontakt med ditt forsikringsselskap i forkant for å avklare dekning." },
 { question: "Hvor lang tid tar en konsultasjon?", answer: "En standardkonsultasjon varer normalt 30–45 minutter, avhengig av type undersøkelse." },
 { question: "Er det ventetid for time?", answer: "Vi tilstreber kort ventetid. De fleste får time innen 1–2 uker." },
 ],
 bekkestua: [
 { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning. Sjekk med ditt forsikringsselskap dersom du ønsker forsikringsdekning." },
 { question: "Hvilke tjenester tilbys på Bekkestua?", answer: "Vi tilbyr gynekologi og hudhelse ved vår klinikk på Bekkestua." },
 { question: "Er det parkering?", answer: "Ja, det er gratis parkering rett utenfor klinikken." },
 ],
 ski: [
 { question: "Hvilke tjenester tilbys i Ski?", answer: "Vi tilbyr gynekologiske tjenester ved vår klinikk i Ski." },
 { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning." },
 ],
 moss: [
 { question: "Hvordan bestiller jeg time i Moss?", answer: "Timebestilling gjøres via Colosseum Faust sitt bookingsystem." },
 { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning. Sjekk med forsikringsselskapet dersom relevant." },
 { question: "Er det parkering?", answer: "Ja, det er gratis parkering rett utenfor klinikken." },
 ],
 moelv: [
 { question: "Trenger jeg henvisning?", answer: "For de fleste konsultasjoner trenger du ikke henvisning." },
 { question: "Hvilke tjenester tilbys i Moelv?", answer: "Vi tilbyr gynekologi, ortopedi, urologi, karkirurgi og allmennmedisin." },
 { question: "Er det parkering?", answer: "Ja, det er gratis parkering rett utenfor klinikken." },
 ],
};

const ClinicDetailPage = ({ isChatOpen }: ClinicDetailPageProps) => {
 const { slug } = useParams<{ slug: string }>();
 const { data: sanityClinic, isLoading } = useClinic(slug || "");
 const staticClinic = slug ? getClinicBySlug(slug) : undefined;

 // Merge: Sanity first, static fallback
 const clinic = sanityClinic || (staticClinic ? {
 id: staticClinic.id,
 slug: staticClinic.slug,
 label: staticClinic.label,
 address: staticClinic.address,
 phone: staticClinic.phone,
 hours: staticClinic.hours,
 description: staticClinic.detail.description,
 detail: {
 parking: staticClinic.detail.parking,
 publicTransport: staticClinic.detail.publicTransport,
 accessibility: staticClinic.detail.accessibility,
 },
 mapsUrl: staticClinic.mapsUrl,
 faqs: clinicFaqs[staticClinic.slug] || [],
 services: staticClinic.services,
 booking: undefined,
 seo: undefined,
 } : undefined);

 useEffect(() => {
 if (clinic) {
 document.title = `CMedical ${clinic.label} | Klinikk`;
 }
 }, [clinic]);

 // Only show skeleton if Sanity is still loading AND we have no static fallback
 if (isLoading && !staticClinic) {
 return (
 <PageLayout isChatOpen={isChatOpen}>
 <div className="bg-brand-warm pt-24 pb-16">
 <div className="container mx-auto px-6 md:px-16 text-center">
 <div className="animate-pulse space-y-4 max-w-3xl mx-auto">
 <div className="h-8 bg-brand-mid/20 rounded w-1/3" />
 <div className="h-4 bg-brand-mid/20 rounded w-2/3" />
 </div>
 </div>
 </div>
 </PageLayout>
 );
 }

 if (!clinic) {
 return (
 <PageLayout isChatOpen={isChatOpen}>
 <div className="bg-brand-warm pt-24 pb-16">
 <div className="container mx-auto px-6 md:px-16 text-center">
 <h1 className="text-2xl font-light text-brand-dark mb-4">Klinikken ble ikke funnet</h1>
 <Button asChild variant="outline">
 <Link to="/klinikker">Tilbake til klinikker</Link>
 </Button>
 </div>
 </div>
 </PageLayout>
 );
 }

 const faqs = clinic.faqs || [];
 const detail = clinic.detail || {};
 const mapsUrl = clinic.mapsUrl || (clinic.address ? `https://maps.google.com/maps?q=${encodeURIComponent(clinic.address)}` : undefined);

 return (
 <PageLayout isChatOpen={isChatOpen}>
 <PageSEO
 title={clinic.seo?.metaTitle || `CMedical ${clinic.label} – Klinikk`}
 description={clinic.seo?.metaDescription || `Besøk CMedical ${clinic.label}. ${clinic.address}. Åpningstider, tjenester og kontaktinformasjon for vår klinikk.`}
 canonical={`/klinikker/${clinic.slug}`}
 breadcrumbs={[
 { name: "Hjem", path: "/" },
 { name: "Om oss", path: "/om-oss" },
 { name: `CMedical ${clinic.label}`, path: `/klinikker/${clinic.slug}` },
 ]}
 jsonLd={{
 "@context": "https://schema.org",
 "@type": "MedicalClinic",
 name: `CMedical ${clinic.label}`,
 address: {
 "@type": "PostalAddress",
 streetAddress: clinic.address,
 addressCountry: "NO",
 },
 telephone: clinic.phone ? `+47 ${clinic.phone}` : undefined,
 url: `https://cmedical.no/klinikker/${clinic.slug}`,
 }}
 />
 {/* Header */}
 <div className="bg-brand-warm pt-20">
 <div className="container mx-auto px-6 md:px-16 py-10 md:py-14">
 <div className="max-w-3xl mx-auto">
 <Link to="/klinikker" className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground mb-6 transition-colors">
 <ArrowLeft className="w-3 h-3" />
 Alle klinikker
 </Link>

 <header className="mb-8 pb-6 border-b border-brand-dark/10">
 
 <h1 className="text-3xl md:text-4xl font-light text-brand-dark">
 CMedical {clinic.label}
 </h1>
 </header>

 <p className="text-brand-dark/80 text-[15px] md:text-base leading-[1.8] font-light">
 {clinic.description}
 </p>
 </div>
 </div>
 </div>

 {/* Practical info */}
 <section className="bg-background py-10 md:py-14">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-3xl mx-auto">
 <h2 className="text-lg font-normal text-foreground mb-6">Praktisk informasjon</h2>

 <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
 <div className="space-y-4">
 <div className="flex items-start gap-3">
 <MapPin className="w-4 h-4 text-brand-dark/75 mt-0.5 flex-shrink-0" />
 <div>
 <p className="text-sm font-normal text-foreground">Adresse</p>
 <p className="text-sm text-muted-foreground font-light">{clinic.address}</p>
 {mapsUrl && (
 <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-brand-dark/70 hover:underline inline-flex items-center gap-1 mt-1">
 Vis i kart <ExternalLink className="w-3 h-3" />
 </a>
 )}
 </div>
 </div>
 <div className="flex items-start gap-3">
 <Phone className="w-4 h-4 text-brand-dark/75 mt-0.5 flex-shrink-0" />
 <div>
 <p className="text-sm font-normal text-foreground">Telefon</p>
 <a href={`tel:+47${clinic.phone?.replace(/\s/g, '')}`} className="text-sm text-muted-foreground font-light hover:underline">
 {clinic.phone}
 </a>
 </div>
 </div>
 <div className="flex items-start gap-3">
 <Clock className="w-4 h-4 text-brand-dark/75 mt-0.5 flex-shrink-0" />
 <div>
 <p className="text-sm font-normal text-foreground">Åpningstider</p>
 <p className="text-sm text-muted-foreground font-light">{clinic.hours}</p>
 </div>
 </div>
 </div>

 <div className="space-y-4">
 {detail.publicTransport && (
 <div className="flex items-start gap-3">
 <Train className="w-4 h-4 text-brand-dark/75 mt-0.5 flex-shrink-0" />
 <div>
 <p className="text-sm font-normal text-foreground">Kollektivtransport</p>
 <p className="text-sm text-muted-foreground font-light">{detail.publicTransport}</p>
 </div>
 </div>
 )}
 {detail.parking && (
 <div className="flex items-start gap-3">
 <Car className="w-4 h-4 text-brand-dark/75 mt-0.5 flex-shrink-0" />
 <div>
 <p className="text-sm font-normal text-foreground">Parkering</p>
 <p className="text-sm text-muted-foreground font-light">{detail.parking}</p>
 </div>
 </div>
 )}
 {detail.accessibility && (
 <div className="flex items-start gap-3">
 <Accessibility className="w-4 h-4 text-brand-dark/75 mt-0.5 flex-shrink-0" />
 <div>
 <p className="text-sm font-normal text-foreground">Tilgjengelighet</p>
 <p className="text-sm text-muted-foreground font-light">{detail.accessibility}</p>
 </div>
 </div>
 )}
 </div>
 </div>
 </div>
 </div>
 </section>

 {/* Services at this clinic */}
 {clinic.services && clinic.services.length > 0 && (
 <section className="bg-brand-warm/40 py-10 md:py-14">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-3xl mx-auto">
 <h2 className="text-lg font-normal text-foreground mb-2">Tjenester ved denne klinikken</h2>
 <p className="text-sm text-muted-foreground font-light mb-6">
 CMedical {clinic.label} tilbyr {clinic.services.length} ulike fagområder. Klikk for å lese mer.
 </p>

 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 border-t border-brand-dark/10">
 {clinic.services.map((id: string) => {
 const svc = SERVICE_LABELS[id] || { label: id };
 const content = (
 <span className="flex items-center justify-between py-3 border-b border-brand-dark/10 text-sm text-foreground font-light group-hover:text-brand-dark transition-colors">
 <span>{svc.label}</span>
 {svc.path && (
 <ArrowRight className="w-3.5 h-3.5 text-brand-dark/40 group-hover:text-brand-dark group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} aria-hidden="true" />
 )}
 </span>
 );
 return (
 <li key={id} className="group">
 {svc.path ? (
 <Link to={svc.path} aria-label={`Les mer om ${svc.label}`}>
 {content}
 </Link>
 ) : (
 content
 )}
 </li>
 );
 })}
 </ul>
 </div>
 </div>
 </section>
 )}

      {/* Clinic images – hidden entirely when no real images exist */}
      {(() => {
        const sanityGallery: { src: string; alt: string }[] = Array.isArray((clinic as any).gallery)
          ? (clinic as any).gallery
              .filter((g: any) => g?.src)
              .map((g: any) => ({ src: g.src, alt: g.alt || `CMedical ${clinic.label}` }))
          : [];
        const gallery = sanityGallery.length > 0 ? sanityGallery : clinicGalleries[clinic.slug];
        if (!(gallery && gallery.length > 0) && !clinic.primaryImage) return null;
        return (
        <section className="bg-background pt-10 md:pt-14" aria-label={`Fra CMedical ${clinic.label}`}>
          <div className="container mx-auto px-6 md:px-16 mb-6">
            <div className="max-w-3xl mx-auto">
              <h2 className="text-lg font-normal text-foreground">Fra klinikken</h2>
            </div>
          </div>
          {gallery && gallery.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-0 w-full">
              {gallery.map((img) => (
                <div key={img.src} className="aspect-[4/5] overflow-hidden bg-brand-mid/10">
                  <img
                    src={img.src}
                    alt={img.alt}
                    loading="lazy"
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="w-full aspect-[4/3] md:aspect-[21/9] overflow-hidden">
              <img src={clinic.primaryImage!} alt={`CMedical ${clinic.label}`} className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}
        </section>
        );
      })()}

 {/* Google Maps embed */}
 <section className="bg-background py-10 md:py-14">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-3xl mx-auto">
 <h2 className="text-lg font-normal text-foreground mb-6">Finn oss</h2>
 <div className="rounded-sm overflow-hidden border border-border/40">
 <iframe
 title={`Kart over CMedical ${clinic.label}`}
 src={`https://maps.google.com/maps?q=${encodeURIComponent(clinic.address)}&output=embed`}
 width="100%"
 height="350"
 style={{ border: 0 }}
 allowFullScreen
 loading="lazy"
 referrerPolicy="no-referrer-when-downgrade"
 />
 </div>
 </div>
 </div>
 </section>

 {/* FAQ */}
 {faqs.length > 0 && (
 <section className="bg-muted/50 py-10 md:py-14">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-3xl mx-auto">
 <h2 className="text-lg font-normal text-foreground mb-6">Ofte stilte spørsmål</h2>
 <Accordion type="single" collapsible className="space-y-2">
 {faqs.map((faq: { question: string; answer: string }, i: number) => (
 <AccordionItem key={i} value={`faq-${i}`} className="bg-background border border-border/40 rounded-sm px-5">
 <AccordionTrigger className="text-sm font-normal text-foreground py-4 hover:no-underline">
 {faq.question}
 </AccordionTrigger>
 <AccordionContent className="text-sm text-muted-foreground font-light pb-4 leading-relaxed">
 {faq.answer}
 </AccordionContent>
 </AccordionItem>
 ))}
 </Accordion>
 </div>
 </div>
 </section>
 )}

 {/* Specialists at this clinic (Sanity-only) */}
 {Array.isArray((clinic as any).specialists) && (clinic as any).specialists.length > 0 && (
 <section className="bg-background py-10 md:py-14">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-3xl mx-auto">
 <div className="flex items-center gap-2 mb-2">
 <Users className="w-4 h-4 text-brand-dark/75" strokeWidth={1.5} aria-hidden="true" />
 </div>
 <h2 className="text-lg font-normal text-foreground mb-6">Spesialister ved klinikken</h2>
 <ul className="grid grid-cols-2 sm:grid-cols-3 gap-6">
 {(clinic as any).specialists.map((s: any) => (
 <li key={s.slug}>
 <Link to={`/spesialister/${s.slug}`} className="group block">
 <div className="aspect-[3/4] bg-brand-mid/20 overflow-hidden rounded-sm mb-2">
 {s.image && (
 <img
 src={s.image}
 alt={s.name}
 loading="lazy"
 className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
 />
 )}
 </div>
 <p className="text-sm font-normal text-foreground group-hover:text-brand-dark transition-colors">{s.name}</p>
 {s.role && <p className="text-xs text-muted-foreground font-light">{s.role}</p>}
 </Link>
 </li>
 ))}
 </ul>
 </div>
 </div>
 </section>
 )}

 {/* Treatments at this clinic (cross-links) */}
 {Array.isArray((clinic as any).treatments) && (clinic as any).treatments.length > 0 && (
 <section className="bg-brand-warm/40 py-10 md:py-14">
 <div className="container mx-auto px-6 md:px-16">
 <div className="max-w-3xl mx-auto">
 <h2 className="text-lg font-normal text-foreground mb-6">Behandlinger ved klinikken</h2>
 <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 border-t border-brand-dark/10">
 {(clinic as any).treatments.map((t: any) => {
 const href = t.categorySlug
 ? `/behandlinger/${t.categorySlug}/${t.slug}`
 : `/behandlinger/${t.slug}`;
 return (
 <li key={t.slug} className="group">
 <Link to={href} className="flex items-center justify-between py-3 border-b border-brand-dark/10 text-sm text-foreground font-light group-hover:text-brand-dark transition-colors">
 <span>{t.title}</span>
 <ArrowRight className="w-3.5 h-3.5 text-brand-dark/40 group-hover:text-brand-dark group-hover:translate-x-0.5 transition-all" strokeWidth={1.5} aria-hidden="true" />
 </Link>
 </li>
 );
 })}
 </ul>
 </div>
 </div>
 </section>
 )}

 {/* Standardized booking flow */}
 <ClinicBookingBlock
 booking={(clinic as any).booking}
 clinicLabel={clinic.label}
 clinicId={clinic.id}
 phone={clinic.phone}
 email={(clinic as any).email}
 />
 </PageLayout>
 );
};

export default ClinicDetailPage;
