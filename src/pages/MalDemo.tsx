import { useParams, Link, Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";


import Fertility from "./treatments/Fertility";
import Gynecology from "./treatments/Gynecology";
import KvinnehelseMaster from "./themes/KvinnehelseMaster";
import SubTreatmentLayout from "@/components/layout/SubTreatmentLayout";
import { gynekologiSubPages } from "@/data/gynekologiSubPages";
import ArticleUnifiedMaster from "./masters/ArticleUnifiedMaster";
import SpecialistProfileMaster from "./masters/SpecialistProfileMaster";
import MasterMalForrigeUke from "./demos/MasterMalForrigeUke";
import MasterMalToUkerSiden from "./demos/MasterMalToUkerSiden";
import FertilitetEtterMaster from "./demos/FertilitetEtterMaster";
import FertilitetVarmHeroForslag from "./demos/FertilitetVarmHeroForslag";
import FagomradeHeroVarianter from "./demos/FagomradeHeroVarianter";
import FertilitetFargeveksling from "./demos/FertilitetFargeveksling";
import FagomradeSkinDemo from "./demos/FagomradeSkinDemo";
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
 title: "Mal: Fagområde – Gynekologi",
 description:
  "Mastermal for hovedfagområder. Bruker gynekologi-siden som referanse — den inneholder 'Spesialistområder'-seksjonen (2x2-grid med bilde og 'Les mer'-lenke) slik kunden har godkjent den.",
 livePath: "/behandlinger/gynekologi",
 render: () => <Gynecology isChatOpen={false} />,
 },
 treatmentCategoryFertilitet: {
 title: "Mal: Fagområde – Fertilitet (alternativ)",
 description:
 "Alternativ fagområde-master basert på fertilitetssiden — bruk denne når siden trenger video-hero og fertilitetsspesifikke seksjoner.",
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
  articleUnified: {
    title: "Mal: Artikkel",
    description:
      "Felles mastermal for Aktuelt. Brukes for alt redaksjonelt innhold — pasienthistorier, fagartikler, nyheter og klinikknytt. Kategori-badge skiller typene. Dato+område øverst, forfatter+del i header, faktaruta med venstrestrek, venstrestilt sitat, raka hjørner på alle bilder, sammenslått fagforfatter+tjeneste, og mørk CTA-boks nederst.",
    livePath: "/aktuelt",
    render: () => <ArticleUnifiedMaster isChatOpen={false} />,
  },
  specialistProfile: {
    title: "Mal: Spesialistprofil",
    description:
      "Mastermal for spesialistprofiler. Bruk denne når en ny spesialist skal legges inn — hero med portrett og biografi, ekspertiseområder, tilknyttede tjenester, anmeldelser og bookingseksjon. Innholdet hentes fra spesialistdata, slik at det er nok å registrere en ny spesialist for å få siden riktig.",
    livePath: "/spesialister/ida-bjorntvedt",
    render: () => <SpecialistProfileMaster isChatOpen={false} />,
  },
  treatmentCategoryForrigeUke: {
    title: "Mal: Fagområde – Fertilitet (slik den var for ~1 uke siden)",
    description:
      "Snapshot av mastermalen for fagområder slik den så ut 10. juni 2026. Brukes som referanse mot dagens versjon — innhold, struktur og seksjoner er bevart fra den gang.",
    livePath: "/maler/treatmentCategoryForrigeUke",
    render: () => <MasterMalForrigeUke isChatOpen={false} />,
  },
  treatmentCategoryToUkerSiden: {
    title: "Mal: Fagområde – Gynekologi (slik den var for ~2 uker siden)",
    description:
      "Snapshot av mastermalen for fagområder (gynekologi) slik den så ut 2. juni 2026. Brukes som referanse mot dagens versjon — innhold, struktur og seksjoner er bevart fra den gang.",
    livePath: "/maler/treatmentCategoryToUkerSiden",
    render: () => <MasterMalToUkerSiden isChatOpen={false} />,
  },
  fertilitetEtterMaster: {
    title: "Mal-demo: Fertilitet bygget på mastermalen",
    description:
      "Fertilitet-siden satt opp etter mastermalen (gynekologi-snapshot, 2 uker siden). Struktur, design og seksjoner er identiske med mastermalen — kun innhold er fertilitetsspesifikt (tekst, bilder, hero-video, 'fra'-pris, spesialister, anmeldelser).",
    livePath: "/maler/fertilitetEtterMaster",
    render: () => <FertilitetEtterMaster isChatOpen={false} />,
  },
  fertilitetVarmHeroForslag: {
    title: "Mal: Fertilitet – varm hero (forslag)",
    description:
      "Designforslag for Fertilitet-landingen: split-hero der hero-bildet ligger på den ene siden og et varmt korn-gradient-panel (korall/oransje/fersken/varm brun) på den andre. Små korn-gradient-flater rundt hero gir ekstra dybde. Alle tokens, typografi, radius og USP-stil er uendret. Kun forslag — den publiserte siden er ikke endret.",
    livePath: "/maler/fertilitetVarmHeroForslag",
    render: () => <FertilitetVarmHeroForslag isChatOpen={false} />,
  },
  fagomradeHeroVarianter: {
    title: "Mal: Fagområde – hero-varianter (5 innganger)",
    description:
      "Fem hero-varianter for hovedfagområde-siden (kategori-hero), stablet under hverandre og merket Variant 1–5. Bruker samme varme korn-gradient-retning som fertilitet-forslagene: varm split med gradient-panel, full farge-/gradientblokk, sentrert hero med stor korn-bakgrunn, asymmetrisk bilde+gradient, og en ren/minimal variant. Ekte innhold fra Gynekologi/Fertilitet/Urologi. Kun demo — publiserte sider er uendret.",
    livePath: "/maler/fagomradeHeroVarianter",
    render: () => <FagomradeHeroVarianter isChatOpen={false} />,
  },
  fertilitetFargeveksling: {
    title: "Mal-demo: Fertilitet med fargeveksling",
    description:
      "Duplikat av fertilitet-siden der seksjonene veksler mellom light skin (#F2ECE6) og mid skin (#CCBAAD) for å bryte opp den flate cream-fargen. Stats-seksjonen bruker et hudtonet bilde som bakgrunn med parallax og en lett mørk overlay for lesbarhet. Layout, tekst og tall er uendret. Kun demo — den publiserte fertilitet-siden er ikke rørt.",
    livePath: "/maler/fertilitetFargeveksling",
    render: () => <FertilitetFargeveksling isChatOpen={false} />,
  },
  fagomradeSkinDemo: {
    title: "Mal-demo: Fagområde med hudbilder",
    description:
      "Duplikat av fagområde-mastermalen (gynekologi) der hero er en split med hudbilde på høyre side og overskriften lagt oppå bildet med mørk gradient for lesbarhet. 'Tall som forteller en historie'-seksjonen har et annet hudbilde som bakgrunn med parallax-effekt og mørk overlay slik at tallene vises i hvit tekst. Ellers uendret struktur, tokens og innhold. Kun demo — den publiserte gynekologi-siden er ikke rørt.",
    livePath: "/maler/fagomradeSkinDemo",
    render: () => <FagomradeSkinDemo isChatOpen={false} />,
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
 <span className="truncate">{mal.title}</span>
 </div>
 <div className="flex items-center gap-2 shrink-0">
 <Button asChild size="sm" variant="ghost" className="text-brand-light hover:bg-brand-light/10 hidden sm:inline-flex">
 <Link to={mal.livePath} target="_blank" rel="noreferrer">
 Se live side ↗
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
