import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

import Fertility from "./treatments/Fertility";
import KvinnehelseMaster from "./themes/KvinnehelseMaster";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { gynekologiSubPages } from "@/data/gynekologiSubPages";
import NewsItemMaster from "./masters/NewsItemMaster";
import ArticleMaster from "./masters/ArticleMaster";
import heroClinicLounge from "@/assets/hero/hero-clinic-lounge.jpg";

// Demo-ikoner for promises-kortene (samme stil som "For deg som"-seksjonen)
const ShieldIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
 <path d="M40 14 L62 22 V40 C62 54 52 62 40 66 C28 62 18 54 18 40 V22 Z" />
 </svg>
);
const StarIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" {...props}>
 <path d="M40 16 L46 32 L62 34 L50 46 L54 62 L40 54 L26 62 L30 46 L18 34 L34 32 Z" />
 </svg>
);
const CircleIcon = (props: React.SVGProps<SVGSVGElement>) => (
 <svg viewBox="0 0 80 80" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" {...props}>
 <circle cx="40" cy="40" r="22" />
 <circle cx="40" cy="40" r="10" />
 </svg>
);

/**
 * MalDemo – mastermaler basert på eksisterende, godkjente sider.
 *
 * Hver mal renderer EKSAKT samme komponent som den ekte siden, slik at
 * det kunden ser her er en levende kopi av siden de allerede har godkjent.
 * Når en ny side skal lages av samme type, klones malen og innholdet
 * tilpasses – men strukturen og seksjonene er allerede på plass.
 */

type TemplateConfig = {
 title: string;
 description: string;
 livePath: string;
 render: () => JSX.Element;
};

const TEMPLATES: Record<string, TemplateConfig> = {
 treatmentCategory: {
 title: "Mal: Fagområde – Fertilitet",
 description:
 "Mastermal for hovedfagområder (Gynekologi, Fertilitet, Urologi). Bruker fertilitetssiden som den står i dag – den inneholder alle seksjonene en fagområdeside trenger.",
 livePath: "/behandlinger/fertilitet",
 render: () => <Fertility isChatOpen={false} />,
 },
 themePage: {
 title: "Mal: Temaside – Kvinnehelse (master)",
 description:
 "Mastermal for tverrgående temaer. Viser begge hero-varianter (med og uten video) og alle valgfrie seksjoner: tekstinnhold, tjenesteliste, spesialister og BookingCTA.",
 livePath: "/kvinnehelse",
 render: () => <KvinnehelseMaster isChatOpen={false} />,
 },
 treatment: {
 title: "Mal: Underbehandling – Overgangsalder",
 description:
 "Mastermal for enkeltbehandlinger under et fagområde. Bruker overgangsalder-siden, som har alle seksjonene (hero, forløp, symptomer, løfter, relaterte, CTA) en underbehandling kan trenge.",
 livePath: "/behandlinger/gynekologi/overgangsalder",
 render: () => {
 const base = gynekologiSubPages["overgangsalder"];
 const promiseIcons = [ShieldIcon, StarIcon, CircleIcon];
 const promiseHrefs = [
 "/behandlinger/gynekologi/undersokelse",
 "/spesialister?kategori=gynekologi",
 "/tverrfaglige-tilbud",
 ];
 const enrichedPromises = base.promises.map((p, i) => ({
 ...p,
 Icon: promiseIcons[i],
 href: promiseHrefs[i],
 ctaLabel: "Les mer",
 }));
 const content = {
 specialistCategory: "gynekologi" as const,
 specialistCtaLabel: "Se alle gynekologer",
 specialistCtaHref: "/spesialister?kategori=gynekologi",
 specialistTitle: "Spesialistene som følger deg.",
 ...base,
 promises: enrichedPromises,
 textSection: {
 eyebrow: "Hvorfor CMedical",
 title: "Et trygt sted å starte — uansett hvor du er i forløpet.",
 lead: "Denne valgfrie tekstseksjonen kan brukes til å fortelle historien bak behandlingen, vår tilnærming, eller hva som gjør tilbudet vårt unikt. Kombiner gjerne med en nummerert liste — eller la teksten stå alene.",
 points: [
 { n: "01", title: "Tid til samtalen", desc: "Vi setter av tid til å forstå hele bildet — ikke bare symptomene." },
 { n: "02", title: "Erfarne spesialister", desc: "Du møter leger som har dette som sitt fagfelt, ikke en generalist på utplassering." },
 { n: "03", title: "Tett oppfølging", desc: "Vi følger deg over tid og justerer behandlingen etter behov." },
 ],
 image: heroClinicLounge,
 imageAlt: "CMedical klinikk",
 },
 };
 return <SubTreatmentLayout isChatOpen={false} content={content} />;
 },
 },
 newsItem: {
 title: "Mal: Nyhet / Pasienthistorie",
 description:
 "Mastermal for nyheter og pasienthistorier. Splitscreen-hero med tekst + bilde, kort journalistisk brødtekst, faktaboks, byline og relaterte nyheter. Brukes til klinikknytt, pasienthistorier, presse og kortere stykker.",
 livePath: "/aktuelt",
 render: () => <NewsItemMaster isChatOpen={false} />,
 },
 article: {
 title: "Mal: Fagartikkel",
 description:
 "Mastermal for lengre fagartikler. Sentrert redaksjonelt hero, fagforfatter + faglig validering, sticky innholdsfortegnelse, pull-quotes, spesialist-kommentar, fakta- og CTA-boks, kildeliste og ansvarsfraskrivelse.",
 livePath: "/aktuelt",
 render: () => <ArticleMaster isChatOpen={false} />,
 },
};


export default function MalDemo() {
 const { key = "" } = useParams();
 const mal = TEMPLATES[key];

 if (!mal) return <Navigate to="/godkjenning" replace />;

 return (
 <div className="min-h-screen bg-brand-light">
 {/* Mal-banner */}
 <div className="bg-brand-dark text-brand-light sticky top-0 z-50">
 <div className="container mx-auto px-6 md:px-16 py-3 flex items-center justify-between gap-4">
 <div className="flex items-center gap-3 text-sm font-light min-w-0">
 <span className="inline-flex items-center px-2 py-0.5 rounded bg-brand-light/10 text-xs uppercase shrink-0">
 Mastermal
 </span>
 <span className="truncate">{mal.title}</span>
 </div>
 <div className="flex items-center gap-2 shrink-0">
 <Button asChild size="sm" variant="ghost" className="text-brand-light hover:bg-brand-light/10 hidden sm:inline-flex">
 <Link to={mal.livePath} target="_blank" rel="noreferrer">
 Se live side ↗
 </Link>
 </Button>
 <Button asChild size="sm" variant="secondary">
 <Link to="/godkjenning" className="inline-flex items-center gap-2">
 <ArrowLeft className="w-4 h-4" /> Tilbake
 </Link>
 </Button>
 </div>
 </div>
 </div>

 {/* Render den ekte siden som master */}
 {mal.render()}
 </div>
 );
}
