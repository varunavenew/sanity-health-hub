#!/usr/bin/env npx tsx
/**
 * Sanity Content Migration Script (with Image Uploads)
 * 
 * Pushes all hardcoded content from the React app into Sanity CMS,
 * including uploading images from src/assets/ and linking them to documents.
 * 
 * Usage:
 *   1. Get a Sanity API token with write access from https://www.sanity.io/manage
 *   2. Run from the test/ directory: npx tsx sanity/migrate-content.ts
 * 
 * This will create documents for:
 *   - Treatment Categories (6) with hero images
 *   - Treatments (~40+)
 *   - Specialists (~50+)
 *   - Google Reviews (14)
 *   - Homepage (1) with hero slide images
 *   - About Page (1) with hero image
 *   - Contact Page (1) with hero image
 *   - Pricing Page (1) with hero image
 *   - Insurance Page (1) with hero image
 *   - Services Page (1) with hero image
 *   - Site Settings (1)
 */

import * as fs from "fs";
import * as path from "path";
import { PROJECT_ID, DATASET, API_URL, SANITY_TOKEN as TOKEN } from "./config";
const ASSETS_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/assets/images/${DATASET}`;

// Resolve path relative to project root (one level up from test/)
const ASSETS_DIR = path.resolve(__dirname, "../../src/assets");

// ============================================================
// IMAGE UPLOAD HELPERS
// ============================================================

// Cache to avoid re-uploading the same image
const imageCache = new Map<string, string>();

/**
 * Upload a local image file to Sanity and return the asset reference.
 * Returns null if the file doesn't exist.
 */
async function uploadImage(relativePath: string, label?: string): Promise<{ _type: "image"; asset: { _type: "reference"; _ref: string } } | null> {
  const fullPath = path.join(ASSETS_DIR, relativePath);
  
  if (!fs.existsSync(fullPath)) {
    console.warn(`  ⚠ Image not found: ${relativePath}`);
    return null;
  }

  // Check cache
  if (imageCache.has(relativePath)) {
    const cachedRef = imageCache.get(relativePath)!;
    return { _type: "image", asset: { _type: "reference", _ref: cachedRef } };
  }

  const fileBuffer = fs.readFileSync(fullPath);
  const ext = path.extname(fullPath).slice(1).toLowerCase();
  const mimeTypes: Record<string, string> = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    webp: "image/webp",
    gif: "image/gif",
    svg: "image/svg+xml",
    mp4: "video/mp4",
  };
  const contentType = mimeTypes[ext] || "application/octet-stream";
  const filename = label ? `${label}.${ext}` : path.basename(fullPath);

  const res = await fetch(`${ASSETS_URL}?filename=${encodeURIComponent(filename)}&label=${encodeURIComponent(label || "")}`, {
    method: "POST",
    headers: {
      "Content-Type": contentType,
      Authorization: `Bearer ${TOKEN}`,
    },
    body: fileBuffer,
  });

  if (!res.ok) {
    const errText = await res.text();
    console.error(`  ❌ Failed to upload ${relativePath}: ${res.status} ${errText}`);
    return null;
  }

  const result = await res.json();
  const assetId = result.document._id;
  imageCache.set(relativePath, assetId);
  console.log(`  📸 Uploaded: ${relativePath} → ${assetId}`);

  return { _type: "image", asset: { _type: "reference", _ref: assetId } };
}

// ============================================================
// IMAGE MAPPINGS
// ============================================================

// Category hero images
const categoryImages: Record<string, string> = {
  "category-gynekologi": "categories/gynekologi-real.jpg",
  "category-fertilitet": "categories/fertilitet-real.jpg",
  "category-urologi": "categories/urologi-real.jpg",
  "category-ortopedi": "categories/ortopedi-real.jpg",
  "category-graviditet": "categories/fertilitet-real.jpg",
  "category-flere-fagomrader": "categories/flere-fagomrader.jpg",
};

// Hero slide images (order matches slides in buildPageDocs)
const heroSlideImages = [
  "hero/cmedical-hero-1.jpg",
  "hero/cmedical-hero-2.jpg",
  "hero/cmedical-hero-3.jpg",
  "hero/hero-treatment.jpg",
];

// Page hero images
const pageImages: Record<string, string> = {
  homepage: "hero/cmedical-hero-1.jpg",
  aboutPage: "hero/about-hero.jpg",
  contactPage: "hero/contact-hero.jpg",
  pricingPage: "hero/pricing-hero.jpg",
  insurancePage: "hero/insurance-hero.jpg",
  servicesPage: "hero/services-hero.jpg",
};

interface Mutation {
  createOrReplace: Record<string, any>;
}

async function submitMutations(mutations: Mutation[]) {
  // Batch in groups of 50
  for (let i = 0; i < mutations.length; i += 50) {
    const batch = mutations.slice(i, i + 50);
    const res = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${TOKEN}`,
      },
      body: JSON.stringify({ mutations: batch }),
    });
    if (!res.ok) {
      const err = await res.text();
      throw new Error(`Sanity API error (batch ${i / 50 + 1}): ${res.status} ${err}`);
    }
    const result = await res.json();
    console.log(`  ✓ Batch ${Math.floor(i / 50) + 1}: ${batch.length} documents`);
  }
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function blockText(text: string) {
  return text.split("\n\n").map((paragraph, i) => ({
    _type: "block",
    _key: `p${i}`,
    style: "normal",
    markDefs: [],
    children: [{ _type: "span", _key: `s${i}`, text: paragraph.replace(/\n/g, " "), marks: [] }],
  }));
}

// ============================================================
// TREATMENT CATEGORIES
// ============================================================
const treatmentCategories = [
  {
    _id: "category-gynekologi",
    _type: "treatmentCategory",
    title: "Gynekologi",
    slug: { _type: "slug", current: "gynekologi" },
    categoryId: "gynekologi",
    description: "Vi følger kvinner gjennom hele livsløpet – fra pubertet og fertilitet til graviditet, barseltid og overgangsalder.",
    icon: "Heart",
    color: "340 60% 55%",
  },
  {
    _id: "category-fertilitet",
    _type: "treatmentCategory",
    title: "Fertilitet",
    slug: { _type: "slug", current: "fertilitet" },
    categoryId: "fertilitet",
    description: "Fertilitetsklinikk med forskning, erfaring og personlig oppfølging. Fra fertilitetssjekk til IVF og eggfrys.",
    icon: "Baby",
    color: "200 60% 55%",
  },
  {
    _id: "category-urologi",
    _type: "treatmentCategory",
    title: "Urologi",
    slug: { _type: "slug", current: "urologi" },
    categoryId: "urologi",
    description: "Spesialiserte helsetjenester for blære, nyrer, prostata og mannlig fertilitet – fra utredning til robotassistert kirurgi.",
    icon: "Stethoscope",
    color: "210 50% 50%",
  },
  {
    _id: "category-ortopedi",
    _type: "treatmentCategory",
    title: "Ortopedi",
    slug: { _type: "slug", current: "ortopedi" },
    categoryId: "ortopedi",
    description: "Ortopedisk ekspertise innen fot, ankel, hofte, kne, skulder, hånd og albue – med fokus på presis diagnostikk.",
    icon: "Bone",
    color: "30 50% 50%",
  },
  {
    _id: "category-graviditet",
    _type: "treatmentCategory",
    title: "Graviditet",
    slug: { _type: "slug", current: "graviditet" },
    categoryId: "graviditet",
    description: "Svangerskapskontroll, ultralyd, NIPT og fosterdiagnostikk med erfarne fostermedisinere.",
    icon: "Baby",
    color: "320 50% 55%",
  },
  {
    _id: "category-flere-fagomrader",
    _type: "treatmentCategory",
    title: "Flere fagområder",
    slug: { _type: "slug", current: "flere-fagomrader" },
    categoryId: "flere-fagomrader",
    description: "Endokrinologi, hudlege, gastrokirurgi, osteopati, plastikkirurgi, psykologi, revmatologi, sexologi og mer.",
    icon: "Stethoscope",
    color: "160 40% 45%",
  },
];

// ============================================================
// TREATMENTS — all from treatmentContent.ts
// ============================================================
const treatments: Record<string, any>[] = [
  // GYNEKOLOGI
  { key: "gynekologi/tverrfaglig", title: "Tverrfaglig team", subtitle: "Helhetlig oppfølging med osteopat, sexolog, psykolog og ernæringsfysiolog.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "Hos CMedical tror vi på en helhetlig tilnærming til kvinnehelse. Vårt tverrfaglige team består av osteopat, sexolog, psykolog og ernæringsfysiolog som samarbeider tett med våre gynekologer for å gi deg den beste behandlingen.\n\nVi forstår at gynekologiske plager ofte påvirker hele livssituasjonen, og derfor tilbyr vi et bredt spekter av tilleggstjenester som kan supplere din medisinske behandling.", benefits: ["Samarbeid mellom ulike fagdisipliner for best mulig resultat","Osteopat med spesialkompetanse på bekkenbunnen og underlivsplager","Sexolog for hjelp med intimitetsproblemer og seksuelle utfordringer","Psykolog som forstår de emosjonelle sidene ved gynekologiske tilstander","Ernæringsfysiolog for kostholdsrådgivning tilpasset din situasjon"], faqs: [{question:"Trenger jeg henvisning?",answer:"Nei, du trenger ikke henvisning. Du kan bestille time direkte hos oss."},{question:"Kan jeg kombinere flere tjenester?",answer:"Ja, vi tilpasser et opplegg som passer for deg."},{question:"Dekkes dette av forsikring?",answer:"Mange helseforsikringer dekker konsultasjoner hos våre spesialister. Ta kontakt med ditt forsikringsselskap."}] },
  { key: "gynekologi/undersokelse", title: "Gynekologisk undersøkelse", subtitle: "Trygg og grundig undersøkelse hos erfarne gynekologer.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "En gynekologisk undersøkelse er en viktig del av kvinners forebyggende helsearbeid. Hos CMedical utfører vi grundige undersøkelser i trygge omgivelser med erfarne gynekologer.\n\nVi anbefaler regelmessige gynekologiske kontroller.", benefits: ["Erfarne gynekologer","Moderne utstyr og fasiliteter","Tid til grundig samtale","Rask oppfølging ved funn","Kort ventetid – de fleste får time innen 1-3 dager"], process: [{title:"Samtale",description:"Vi starter med en grundig samtale om din helse."},{title:"Undersøkelse",description:"Gynekologisk undersøkelse tilpasset dine behov."},{title:"Vurdering og plan",description:"Din gynekolog gjennomgår funnene med deg."}], faqs: [{question:"Hva koster en gynekologisk undersøkelse?",answer:"Fra kr 2 100. Se vår prisliste."},{question:"Hvor lang tid tar undersøkelsen?",answer:"30-45 minutter inkludert samtale."}] },
  { key: "gynekologi/urinlekkasje", title: "Urinlekkasje", subtitle: "Effektiv behandling av stressinkontinens, tranginkontinens og blandingsinkontinens.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "Urinlekkasje er svært vanlig og rammer kvinner i alle aldre. Det finnes gode behandlingsmuligheter.\n\nVi tilbyr både konservativ behandling og kirurgiske løsninger.", benefits: ["Spesialistkompetanse på urinlekkasje","Grundig utredning","Moderne kirurgiske metoder","Bekkenbunnstrening","Tett oppfølging"], process: [{title:"Utredning",description:"Kartlegging av type lekkasje og omfang."},{title:"Behandlingsplan",description:"Inkludere bekkenbunnstrening, medisiner eller kirurgi."},{title:"Behandling",description:"Gjennomføring med oppfølging."},{title:"Oppfølging",description:"Kontroll for å sikre effekt."}], faqs: [{question:"Er urinlekkasje normalt?",answer:"Svært vanlig, men det finnes gode behandlingsmuligheter."},{question:"Kan bekkenbunnstrening hjelpe?",answer:"Ja, ofte førstevalg ved stressinkontinens."}] },
  { key: "gynekologi/endometriose", title: "Endometriose", subtitle: "Spesialisert diagnostikk og behandling av endometriose.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "Endometriose er en tilstand der livmorslimhinnen vokser utenfor livmoren. CMedical har noen av Nordens fremste eksperter.\n\nVi tilbyr alt fra medisinsk behandling til avansert robotassistert kirurgi.", benefits: ["Ledende ekspertise i Norden","Robotassistert kirurgi","Tverrfaglig tilnærming","Moderne diagnostikk","Tett samarbeid med fertilitetsklinikken"], faqs: [{question:"Hva er symptomene?",answer:"Sterke menssmerter, kroniske bekkensmerter, smerter ved samleie."},{question:"Kan det påvirke fertiliteten?",answer:"Ja, vi har tett samarbeid med fertilitetsklinikken."}] },
  { key: "gynekologi/overgangsalder", title: "Overgangsalder", subtitle: "Hormonbehandling og oppfølging for en bedre overgangsalder.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "Overgangsalderen er en naturlig fase med plagsomme symptomer som hetetokter, søvnproblemer og humørsvingninger.\n\nVåre gynekologer har lang erfaring med hormonbehandling.", benefits: ["Individuelt tilpasset hormonbehandling","Grundig helsesjekk før oppstart","Oppfølging over tid","Livsstilsrådgivning","Tverrfaglig tilnærming"], faqs: [{question:"Er hormonbehandling trygt?",answer:"Moderne hormonbehandling er godt dokumentert og trygt for de fleste."},{question:"Når oppsøke hjelp?",answer:"Når symptomene påvirker livskvaliteten."}] },
  { key: "gynekologi/vaginale-fremfall", title: "Vaginale fremfall", subtitle: "Utredning og behandling av fremfall.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "Vaginale fremfall oppstår når vev og organer synker ned. Tilstanden er vanlig etter fødsler.\n\nVi tilbyr både konservative og kirurgiske alternativer.", benefits: ["Erfarne gynekologer","Moderne kirurgiske teknikker","Individuelt tilpasset plan","Bekkenbunnstrening"], faqs: [{question:"Kan fremfall behandles uten kirurgi?",answer:"Milde tilfeller med bekkenbunnstrening og pessar."}] },
  { key: "gynekologi/blodningsforstyrrelser", title: "Blødningsforstyrrelser", subtitle: "Utredning av uregelmessige eller kraftige blødninger.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "Blødningsforstyrrelser kan ha mange årsaker. Kraftige blødninger påvirker livskvaliteten.\n\nVåre gynekologer utreder grundig.", benefits: ["Grundig utredning med ultralyd","Medisinsk og kirurgisk behandling","Robotassistert fjerning av muskelknuter","Kort ventetid"], faqs: [{question:"Hva kan forårsake kraftige blødninger?",answer:"Muskelknuter, polypper, hormonforstyrrelser og endometriose."}] },
  { key: "gynekologi/celleforandringer", title: "Celleforandringer", subtitle: "Oppfølging av HPV og celleforandringer.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "Celleforandringer oppdages vanligvis gjennom celleprøve og er forårsaket av HPV-virus.\n\nVi tilbyr grundig utredning og behandling inkludert konisering.", benefits: ["Erfaren oppfølging av HPV","Kolposkopi","Konisering","Tett oppfølgingsprogram"], faqs: [{question:"Hva er HPV?",answer:"Svært vanlig virus, de fleste kvinner blir smittet i løpet av livet."},{question:"Hva er konisering?",answer:"Et lite inngrep der man fjerner vev fra livmorhalsen."}] },
  { key: "gynekologi/cyster", title: "Cyster på eggstokkene", subtitle: "Utredning og behandling av cyster.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "Cyster på eggstokkene er svært vanlig. De fleste er godartede og forsvinner av seg selv.\n\nVåre gynekologer har lang erfaring.", benefits: ["Grundig utredning med ultralyd","Tett oppfølging","Skånsom kirurgisk fjerning","Rask avklaring"], faqs: [{question:"Er cyster farlige?",answer:"De aller fleste er godartede."},{question:"Må de opereres?",answer:"Nei, mange forsvinner av seg selv."}] },
  { key: "gynekologi/fjerne-livmor", title: "Fjerne livmor", subtitle: "Hysterektomi med moderne metoder.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "Fjerning av livmoren kan være aktuelt ved muskelknuter, kraftige blødninger, endometriose eller fremfall.\n\nVi tilbyr robotassistert hysterektomi.", benefits: ["Robotassistert kirurgi","Kortere sykehusopphold","Erfarne kirurger","Grundig informasjon"], faqs: [{question:"Hva er robotkirurgi?",answer:"Minimalt invasiv operasjon med bedre presisjon."},{question:"Rekonvalesenstid?",answer:"2-4 uker med robot, vs 6-8 uker åpen kirurgi."}] },
  { key: "gynekologi/graviditet", title: "Graviditet", subtitle: "Svangerskapskontroll, ultralyd og NIPT.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "Vi tilbyr omfattende oppfølging gjennom svangerskapet, fra tidlig ultralyd til NIPT-testing.\n\nVårt team av fostermedisinere gir trygg oppfølging.", benefits: ["Tidlig ultralyd fra uke 7","NIPT-test","Organrettet ultralyd uke 18-20","Erfarne fostermedisinere","Fleksible timer"], process: [{title:"Tidlig ultralyd",description:"Bekreftelse fra uke 7."},{title:"NIPT-test",description:"Blodprøve fra uke 10."},{title:"Organrettet ultralyd",description:"Grundig gjennomgang uke 18-20."},{title:"Svangerskapskontroller",description:"Regelmessige kontroller."}], faqs: [{question:"Når tidlig ultralyd?",answer:"Fra uke 7."},{question:"Hva er NIPT?",answer:"Blodprøve som analyserer fosterets DNA."}] },
  { key: "gynekologi/kirurgi", title: "Gynekologisk kirurgi", subtitle: "Avansert kirurgi inkludert robotassisterte inngrep.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "CMedical tilbyr et bredt spekter av gynekologiske operasjoner inkludert robotassistert kirurgi.\n\nVåre kirurger har høyt volum og lang erfaring.", benefits: ["Robotassistert kirurgi med da Vinci","Fremfalloperasjoner","Operasjon for urinlekkasje","Fjerning av muskelknuter","Hysterektomi","Avansert endometriosekirurgi"], faqs: [{question:"Er robotkirurgi trygt?",answer:"Ja, vel dokumentert med ofte bedre resultater."},{question:"Kan jeg reise hjem samme dag?",answer:"Ved mange inngrep, ja."}] },
  { key: "gynekologi/hormonforstyrrelser", title: "Hormonforstyrrelser", subtitle: "Utredning av PCOS og hormonelle tilstander.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "Hormonforstyrrelser som PCOS kan gi uregelmessige menstruasjoner, akne og infertilitet.\n\nVåre gynekologer og endokrinologer samarbeider.", benefits: ["Grundig hormonutredning","Individuell behandling","Tverrfaglig tilnærming","Fertilitetsrådgivning"], faqs: [{question:"Hva er PCOS?",answer:"Hormonforstyrrelse som rammer ca 10% av kvinner."},{question:"Kan det behandles?",answer:"Ja, med livsstilsendringer, medisiner og fertilitetsbehandling."}] },
  { key: "gynekologi/hysteroskopi", title: "Hysteroskopi", subtitle: "Undersøkelse av livmorhulen med kamera.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "Hysteroskopi er en undersøkelse der kamera føres inn i livmorhulen.\n\nVi tilbyr office-hysteroskopi uten narkose.", benefits: ["Office-hysteroskopi uten narkose","Under 30 minutter","Umiddelbar diagnostikk","Ingen sykemelding"], faqs: [{question:"Gjør det vondt?",answer:"Noe ubehagelig men godt tolerert."},{question:"Når brukes det?",answer:"Ved blødninger, polypper eller fertilitetsutredning."}] },
  { key: "gynekologi/labiaplastikk", title: "Labiaplastikk", subtitle: "Kirurgisk korreksjon av indre kjønnslepper.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "Labiaplastikk er et inngrep for å redusere størrelsen på indre kjønnslepper.\n\nInngrepet gir naturlig resultat med kort rekonvalesens.", benefits: ["Erfarne kirurger","Dagkirurgisk","Kort rekonvalesens","Diskret behandling"], faqs: [{question:"Er det smertefullt?",answer:"Utføres i narkose, noe hevelse 1-2 uker etter."},{question:"Rekonvalesens?",answer:"Tilbake i jobb etter noen dager, full rekonvalesens 4-6 uker."}] },
  { key: "gynekologi/robotkirurgi", title: "Robotkirurgi – Gynekologi", subtitle: "Nordens mest erfarne team innen robotassistert gynekologisk kirurgi.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "CMedical er den eneste private aktøren i Norge som tilbyr robotassistert kirurgi innen gynekologi.\n\nRobotkirurgi gir bedre presisjon, mindre blødning og raskere rekonvalesens.", benefits: ["Eneste private tilbyder i Norge","da Vinci-systemet","Muskelknuter, endometriose, hysterektomi","Mindre smerter","Høyt volum"], faqs: [{question:"Hvilke inngrep?",answer:"Muskelknuter, dyp endometriose, hysterektomi."},{question:"Er det trygt?",answer:"Ja, vel dokumentert internasjonalt."}] },
  { key: "gynekologi/spontanabort", title: "Spontanabort", subtitle: "Medisinsk oppfølging og støtte ved spontanabort.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "En spontanabort er smertefull, fysisk og emosjonelt. Vi gir rask og omsorgsfull oppfølging.\n\nVi hjelper deg med faglig trygghet og personlig omsorg.", benefits: ["Rask ultralydkontroll","Medisinsk/kirurgisk behandling","Psykolog og samtaleterapi","Veiledning videre"], faqs: [{question:"Når kontakte?",answer:"Umiddelbart ved blødning og smerter i tidlig svangerskap."},{question:"Kan jeg bli gravid igjen?",answer:"I de fleste tilfeller etter neste menstruasjon."}] },
  { key: "gynekologi/vulvalidelser", title: "Vulvalidelser", subtitle: "Utredning og behandling av vulvaplager.", parentCategory: "Gynekologi", categoryRef: "category-gynekologi", description: "Vulvalidelser kan gi kløe, sviing, smerter og ubehag.\n\nVåre gynekologer har spesialkompetanse på vulvalidelser.", benefits: ["Spesialistkompetanse","Grundig utredning","Individuell behandlingsplan","Samarbeid med hudlege"], faqs: [{question:"Vanlige vulvalidelser?",answer:"Vulvitt, lichen sclerosus, kontakteksem og smertetilstander."},{question:"Kan de behandles?",answer:"Ja, de fleste med riktig diagnose og behandling."}] },
  // UROLOGI
  { key: "urologi/blaere", title: "Blære og urinveier", subtitle: "Utredning av blod i urinen, vannlatningsproblemer og mer.", parentCategory: "Urologi", categoryRef: "category-urologi", description: "Problemer med blæren og urinveiene er vanlige. Vi tilbyr grundig utredning og moderne behandling.\n\nVåre urologer har lang erfaring med diagnostikk og behandling.", benefits: ["Rask utredning av blod i urinen","Cystoskopi","TUR-P og TUR-B","Behandling av innsnevring","Kort ventetid"], faqs: [{question:"Blod i urinen?",answer:"Kan ha mange årsaker, bør alltid utredes."},{question:"Hva er cystoskopi?",answer:"Kamera i blæren gjennom urinrøret."}] },
  { key: "urologi/forhud", title: "Forhud", subtitle: "Behandling av trang forhud.", parentCategory: "Urologi", categoryRef: "category-urologi", description: "Trang forhud er vanlig og kan gi ubehag. Vi tilbyr konservativ og kirurgisk behandling.", benefits: ["Erfarne urologer","Dagkirurgi","Individuell vurdering"], faqs: [{question:"Må det opereres?",answer:"Milde tilfeller med kortisonsalve, kirurgi ved uttalte plager."}] },
  { key: "urologi/infertilitet", title: "Mannlig infertilitet", subtitle: "Utredning av mannlig fruktbarhet.", parentCategory: "Urologi", categoryRef: "category-urologi", description: "Mannlige faktorer bidrar i ca halvparten av tilfellene. Vi tilbyr grundig utredning.\n\nSamarbeid med fertilitetsklinikken for helhetlig tilnærming.", benefits: ["Sædanalyse etter WHO-standard","Hormonutredning","Urologisk undersøkelse","Samarbeid med fertilitetsklinikken"], faqs: [{question:"Hva er sædanalyse?",answer:"Analyse av antall, bevegelighet og form."},{question:"Kan det behandles?",answer:"I mange tilfeller ja."}] },
  { key: "urologi/nyrer", title: "Nyrer", subtitle: "Utredning og behandling av nyresykdommer.", parentCategory: "Urologi", categoryRef: "category-urologi", description: "Vi tilbyr avansert diagnostikk og behandling av alle nyresykdommer.\n\nVed nyrekreft tilbyr vi robotassistert kirurgi.", benefits: ["Avansert bildediagnostikk","Robotassistert kirurgi","Moderne nyresteinbehandling","Oppfølging av cyster"], faqs: [{question:"Nyrestein?",answer:"Behandling avhenger av størrelse og plassering."}] },
  { key: "urologi/prostata", title: "Prostata", subtitle: "Prostataundersøkelse, PSA-test og robotassistert kirurgi.", parentCategory: "Urologi", categoryRef: "category-urologi", description: "Prostataproblemer er vanlige hos menn over 50. Vi tilbyr rask og grundig utredning.\n\nCMedical er den eneste private klinikken med robotassistert prostatakirurgi.", benefits: ["Rask prostataundersøkelse","MR-fusjonsbiopsier","RALP","RASP","Erfarne urologer"], process: [{title:"Konsultasjon",description:"PSA-blodprøve og rektal undersøkelse."},{title:"Utredning",description:"MR og eventuelt biopsier."},{title:"Behandlingsplan",description:"Individuell plan."},{title:"Behandling",description:"Medisinsk eller kirurgisk."}], faqs: [{question:"Når sjekke prostata?",answer:"Menn over 50 år, eller 45 ved familiær disposisjon."},{question:"Hva er robotkirurgi for prostata?",answer:"RALP gir bedre presisjon og raskere rekonvalesens."}] },
  { key: "urologi/refertilisering", title: "Refertilisering", subtitle: "Reversering av sterilisering.", parentCategory: "Urologi", categoryRef: "category-urologi", description: "Refertilisering er en mikrokirurgisk operasjon for å reversere sterilisering.", benefits: ["Erfaren mikrokirurg","Operasjonsmikroskop","Dagkirurgi"], faqs: [{question:"Suksessrate?",answer:"50-80% avhengig av tid siden sterilisering."}] },
  { key: "urologi/robotkirurgi", title: "Robotkirurgi – Urologi", subtitle: "Avansert robotassistert kirurgi for prostata, nyrer og brokk.", parentCategory: "Urologi", categoryRef: "category-urologi", description: "Eneste private aktør i Norge med robotassistert urologi.\n\nda Vinci-systemet for RALP, RASP og brokkoperasjoner.", benefits: ["RALP med nerve-sparende teknikk","RASP","Robotassistert brokkoperasjon","Kortere sykehusopphold","Erfarne kirurger"], faqs: [{question:"Fordeler?",answer:"Bedre presisjon, mindre blødning, raskere rekonvalesens."}] },
  { key: "urologi/sterilisering", title: "Sterilisering", subtitle: "Vasektomi – trygg sterilisering for menn.", parentCategory: "Urologi", categoryRef: "category-urologi", description: "Vasektomi er en rask prosedyre for permanent prevensjon. Ca. 30 minutter.", benefits: ["Ca 30 minutter","Lokalbedøvelse","Kort rekonvalesens","Høy sikkerhet"], faqs: [{question:"Reversibelt?",answer:"Skal betraktes som permanent, men refertilisering mulig."},{question:"Pris?",answer:"Kr 6 500 inkludert alt."}] },
  { key: "urologi/testikler", title: "Testikler og pung", subtitle: "Utredning av kuler i pungen og testikkelkreft.", parentCategory: "Urologi", categoryRef: "category-urologi", description: "Forandringer i pungen bør alltid undersøkes. Vi tilbyr rask utredning med ultralyd.\n\nTidlig oppdagelse er viktig.", benefits: ["Rask utredning med ultralyd","Erfarne urologer","Samarbeid med sykehus"], faqs: [{question:"Hva kan en kul være?",answer:"Mange ufarlige årsaker, men bør alltid undersøkes."}] },
  // FERTILITET
  { key: "fertilitet/infertilitet", title: "Infertilitet", subtitle: "Omfattende utredning av barnløshet.", parentCategory: "Fertilitet", categoryRef: "category-fertilitet", description: "Infertilitet defineres som manglende graviditet etter ett år. Årsaken kan ligge hos begge.\n\nVårt team har hjulpet tusenvis av par.", benefits: ["Grundig utredning av begge","Hormonprøver, ultralyd, sædanalyse","Individuell behandlingsplan","Alle behandlingsformer","Høye suksessrater"], faqs: [{question:"Når oppsøke hjelp?",answer:"Etter 12 måneder, eller 6 måneder over 35 år."},{question:"Hva innebærer utredning?",answer:"Blodprøver, hormonanalyser, ultralyd og sædanalyse."}] },
  { key: "fertilitet/assistert-befruktning", title: "Assistert befruktning", subtitle: "IUI, IVF og ICSI.", parentCategory: "Fertilitet", categoryRef: "category-fertilitet", description: "Assistert befruktning med IUI, IVF og ICSI. Valg avhenger av utredningsfunn.\n\nModerne laboratorium med erfarne embryologer.", benefits: ["Alle metoder under ett tak","Moderne laboratorium","Høye suksessrater","Personlig oppfølging"], faqs: [{question:"Forskjell IUI og IVF?",answer:"IUI: sæd i livmor. IVF: egg befruktes i lab."},{question:"Antall behandlinger?",answer:"Mange lykkes innen 3 sykluser."}] },
  { key: "fertilitet/ivf", title: "IVF", subtitle: "Prøverørsbehandling.", parentCategory: "Fertilitet", categoryRef: "category-fertilitet", description: "IVF er den mest effektive fertilitetsbehandlingen. Tusenvis utført med høye suksessrater.\n\nModerne utstyr og protokoller.", benefits: ["Dokumentert høye suksessrater","Moderne laboratorium","Individuelle protokoller","Erfarne spesialister","Tett oppfølging"], process: [{title:"Det første møtet",description:"Gjennomgang av utredningen."},{title:"Hormonstimulering",description:"10-14 dager med sprøyter."},{title:"Egguthenting",description:"15-20 minutter under sedasjon."},{title:"Befruktning",description:"Embryoene dyrkes i 3-5 dager."},{title:"Embryooverføring",description:"Smertefri prosedyre."}], faqs: [{question:"Suksessrate?",answer:"40-50% for kvinner under 35."},{question:"Er IVF smertefullt?",answer:"Daglige sprøyter, egguthenting under sedasjon."}] },
  { key: "fertilitet/eggfrys", title: "Eggfrys", subtitle: "Frys ned eggene dine.", parentCategory: "Fertilitet", categoryRef: "category-fertilitet", description: "Eggfrysing bevarer fertiliteten. Prosessen ligner IVF.\n\nBest resultat før 35 år.", benefits: ["Bevarer fertiliteten","Moderne vitrifikasjonsteknologi","Trygg lagring","Fleksibilitet"], faqs: [{question:"Hvor lenge lagring?",answer:"Mange år uten kvalitetstap."},{question:"Pris?",answer:"Ta kontakt for prissamtale."}] },
  { key: "fertilitet/donorbehandling", title: "Donorbehandling", subtitle: "Behandling med donorsæd eller donoregg.", parentCategory: "Fertilitet", categoryRef: "category-fertilitet", description: "Donorbehandling for enslige, par med mannlig infertilitet, eller manglende egne egg.\n\nAlle donorer screenet etter norsk lov.", benefits: ["Godkjente sædbanker","Anerkjente eggdonorklinikker","Grundig veiledning","Etisk rådgivning"], faqs: [{question:"Hvem kan motta donorsæd?",answer:"Enslige kvinner og par med alvorlig nedsatt sædkvalitet."},{question:"Anonyme donorer?",answer:"Nei, identitetsåpne i Norge."}] },
  { key: "fertilitet/hysteroskopi", title: "Hysteroskopi – Fertilitet", subtitle: "Undersøkelse av livmorhulen.", parentCategory: "Fertilitet", categoryRef: "category-fertilitet", description: "Hysteroskopi i fertilitetssammenheng for å undersøke livmorhulen.\n\nKan utføres uten narkose.", benefits: ["Viktig del av utredningen","Kan avdekke implantasjonssvikt","Office-hysteroskopi","Umiddelbare resultater"], faqs: [{question:"Hvorfor ved infertilitet?",answer:"For å sikre normal livmorhole."}] },
  { key: "fertilitet/saedanalyse", title: "Sædanalyse", subtitle: "Grundig analyse etter WHO-standard.", parentCategory: "Fertilitet", categoryRef: "category-fertilitet", description: "Sædanalyse er sentral i fertilitetsutredningen. Vi analyserer etter WHO-standard.\n\nGrunnlag for valg av behandlingsmetode.", benefits: ["WHO-standardisert","Raskt resultat","Veiledning om videre steg","Kan kombineres med urologisk konsultasjon"], faqs: [{question:"Forberedelse?",answer:"2-7 dagers avholdenhet."},{question:"Pris?",answer:"Kr 1 950."}] },
  { key: "fertilitet/teamet", title: "Fertilitetsteamet", subtitle: "Møt teamet som hjelper deg.", parentCategory: "Fertilitet", categoryRef: "category-fertilitet", description: "Erfarne reproduksjonsmedisinere, gynekologer, embryologer, sykepleiere og psykologer.\n\nPersonlig oppfølging gjennom hele forløpet.", benefits: ["Erfarne reproduksjonsmedisinere","Spesialiserte embryologer","Dedikerte sykepleiere","Psykolog for emosjonell støtte","Tverrfaglig samarbeid"], faqs: [{question:"Kontaktperson?",answer:"En dedikert fertilitets-sykepleier."}] },
  // ORTOPEDI
  { key: "ortopedi/fot-ankel", title: "Fot og ankel", subtitle: "Skader og plager i fot og ankel.", parentCategory: "Ortopedi", categoryRef: "category-ortopedi", description: "Spesialisert utredning og behandling av alle tilstander i fot og ankel.\n\nBåde konservativ og kirurgisk behandling.", benefits: ["Spesialiserte ortopeder","MR og røntgen","Konservativ og kirurgisk","Rehabilitering"], faqs: [{question:"Trenger jeg henvisning?",answer:"Nei."},{question:"Pris?",answer:"Konsultasjon kr 1 800."}] },
  { key: "ortopedi/hofte", title: "Hofte", subtitle: "Diagnostikk og behandling av hofteplager.", parentCategory: "Ortopedi", categoryRef: "category-ortopedi", description: "Hofteplager fra slitasje, idrettsskader eller andre tilstander.\n\nLang erfaring med hofteleddsundersøkelser.", benefits: ["Grundig utredning","Injeksjonsbehandling","Operativ behandling","Rehabilitering"], faqs: [{question:"Årsaker til hoftesmerter?",answer:"Artrose, impingement, bursitt, muskelproblemer."}] },
  { key: "ortopedi/hand-albue", title: "Hånd og albue", subtitle: "Spesialisert behandling.", parentCategory: "Ortopedi", categoryRef: "category-ortopedi", description: "Alle tilstander i hånd og albue, inkludert karpaltunnel og triggerfinger.\n\nHåndterapeuter for rehabilitering.", benefits: ["Erfarne håndkirurger","Håndterapeut","Dagkirurgi","Rask utredning"], faqs: [{question:"Karpaltunnelsyndrom?",answer:"Nerve i håndleddet klemmes, gir nummenhet og smerter."}] },
  { key: "ortopedi/kne", title: "Kne", subtitle: "Kneplager og kneskader.", parentCategory: "Ortopedi", categoryRef: "category-ortopedi", description: "Komplett utredning med bildediagnostikk for alle kneplager.\n\nFra meniskskader til artrose.", benefits: ["Spesialiserte kneortopeder","MR på klinikken","Artroscopisk kirurgi","Injeksjonsbehandling","Rehabilitering"], faqs: [{question:"Trenger jeg MR?",answer:"Ortopeden vurderer, MR tilgjengelig på klinikken."}] },
  { key: "ortopedi/skulder", title: "Skulder", subtitle: "Diagnostikk og behandling.", parentCategory: "Ortopedi", categoryRef: "category-ortopedi", description: "Skulderplager fra slitasje, betennelse, skader.\n\nBåde konservativ og kirurgisk behandling.", benefits: ["Erfarne skulderortopeder","Ultralydveiledet injeksjoner","Artroscopisk kirurgi","Individuell rehabilitering"], faqs: [{question:"Årsaker til skuldersmerter?",answer:"Impingement, rotator cuff, frossen skulder, artrose."}] },
  // FLERE FAGOMRÅDER
  { key: "flere-fagomrader/endokrinologi", title: "Endokrinologi", subtitle: "Stoffskifte, diabetes og hormonsykdommer.", parentCategory: "Flere fagområder", categoryRef: "category-flere-fagomrader", description: "Utredning og behandling av hormonsystemet og stoffskiftesykdommer.\n\nErfarne endokrinologer.", benefits: ["Erfarne endokrinologer","Grundig hormonutredning","Individuell behandling","Tverrfaglig samarbeid"], faqs: [{question:"Hva behandler endokrinolog?",answer:"Stoffskifte, diabetes, binyresykdommer."},{question:"Henvisning?",answer:"Nei, bestill direkte."}] },
  { key: "flere-fagomrader/hudlege", title: "Hudlege", subtitle: "Dermatologi.", parentCategory: "Flere fagområder", categoryRef: "category-flere-fagomrader", description: "Utredning av alle hudsykdommer, fra akne til hudkreft.\n\nModerne diagnostikk med dermatoskopi.", benefits: ["Erfarne hudleger","Dermatoskopi","Akne, eksem, rosacea, psoriasis","Hudkreftscreening"], faqs: [{question:"Når sjekke føflekker?",answer:"Regelmessig, spesielt ved mange føflekker eller familiær hudkreft."}] },
  { key: "flere-fagomrader/ernaringsfysiolog", title: "Ernæringsfysiolog", subtitle: "Profesjonell kostholdsrådgivning.", parentCategory: "Flere fagområder", categoryRef: "category-flere-fagomrader", description: "Optimalisering av kosthold for bedre helse. Vektkontroll, matintoleranse, sportsernæring.", benefits: ["Individuelt tilpasset","Spesialkompetanse fertilitet/svangerskap","Hjelp med intoleranse","Oppfølging over tid"], faqs: [{question:"Hva kan de hjelpe med?",answer:"Kosthold, IBS, allergi, vektnedgang, sportsernæring."}] },
  { key: "flere-fagomrader/gastrokirurgi", title: "Gastrokirurgi", subtitle: "Fedmekirurgi, gallestein og brokk.", parentCategory: "Flere fagområder", categoryRef: "category-flere-fagomrader", description: "Bariatrisk kirurgi, gallestein og brokk. Mange inngrep med robot.\n\nHøyt operasjonsvolum.", benefits: ["Robotassistert bariatrisk kirurgi","Gallesteinsoperasjoner","Robotassisterte brokkoperasjoner","Gratis digital konsultasjon","Tverrfaglig oppfølging"], faqs: [{question:"Hvem kvalifiserer for fedmekirurgi?",answer:"BMI over 40, eller over 35 med tilleggssykdommer."},{question:"Gratis konsultasjon?",answer:"Ja, digital fedmevurdering."}] },
  { key: "flere-fagomrader/osteopati", title: "Osteopati", subtitle: "Helhetlig behandling av muskel- og skjelettplager.", parentCategory: "Flere fagområder", categoryRef: "category-flere-fagomrader", description: "Helhetlig undersøkelse og behandling. Spesialkompetanse på bekkenbunnsplager.\n\nSamarbeid med gynekologisk avdeling.", benefits: ["Spesialkompetanse bekkenbunnsplager","Helhetlig tilnærming","Samarbeid med gynekologer","Individuell plan"], faqs: [{question:"Forskjell osteopat/fysioterapeut?",answer:"Osteopater fokuserer på hele kroppens balanse, fysioterapeuter mer på spesifikke skader."}] },
  { key: "flere-fagomrader/plastikkirurgi", title: "Plastikkirurgi", subtitle: "Rekonstruktiv og estetisk kirurgi.", parentCategory: "Flere fagområder", categoryRef: "category-flere-fagomrader", description: "Rekonstruktive og estetiske inngrep. Naturlige resultater.\n\nGrundig informasjon.", benefits: ["Erfarne plastikkirurger","Grundig konsultasjon","Moderne teknikker","Oppfølging"], faqs: [{question:"Konsultasjon?",answer:"Gjennomgang av ønsker, helsetilstand og forventninger."}] },
  { key: "flere-fagomrader/psykologi", title: "Psykologi", subtitle: "Psykologisk støtte og samtaleterapi.", parentCategory: "Flere fagområder", categoryRef: "category-flere-fagomrader", description: "Samtaleterapi med spesialkompetanse på gynekologi, infertilitet og overgangsalder.\n\nDel av tverrfaglig team.", benefits: ["Spesialkompetanse kvinnehelse","Terapi for enkeltpersoner og par","Støtte under fertilitetsbehandling","Tverrfaglig team"], faqs: [{question:"Kan jeg gå uten annen behandling?",answer:"Ja, uavhengig av annen behandling."}] },
  { key: "flere-fagomrader/revmatologi", title: "Revmatologi", subtitle: "Utredning av revmatiske sykdommer.", parentCategory: "Flere fagområder", categoryRef: "category-flere-fagomrader", description: "Utredning og behandling av ledd- og bindevevssykdommer.\n\nModerne biologisk behandling.", benefits: ["Erfarne revmatologer","Grundig utredning","Moderne behandling","Tett oppfølging"], faqs: [{question:"Symptomer?",answer:"Leddsmerter, stivhet, hevelse og tretthet."},{question:"Henvisning?",answer:"Nei, bestill direkte."}] },
  { key: "flere-fagomrader/robotkirurgi", title: "Robotkirurgi", subtitle: "Avansert robotassistert kirurgi.", parentCategory: "Flere fagområder", categoryRef: "category-flere-fagomrader", description: "Eneste private aktør i Norge med robotkirurgi. da Vinci-systemet på tvers av fagområder.\n\nBedre presisjon, mindre smerter og raskere rekonvalesens.", benefits: ["Eneste private aktør","da Vinci-systemet","Gynekologi, urologi og gastrokirurgi","Kortere sykehusopphold","Erfarne kirurger"], faqs: [{question:"Hvilke inngrep?",answer:"Muskelknuter, endometriose, hysterektomi, brokk, RALP, RASP, fedmekirurgi."},{question:"Trygt?",answer:"Ja, vel dokumentert."}] },
  { key: "flere-fagomrader/sexologi", title: "Sexologi", subtitle: "Hjelp med seksuelle utfordringer.", parentCategory: "Flere fagområder", categoryRef: "category-flere-fagomrader", description: "Rådgivning og terapi for seksuelle utfordringer. Spesialkompetanse knyttet til gynekologiske tilstander.", benefits: ["Trygt miljø","Spesialkompetanse","Individuell og parterapi","Tverrfaglig team"], faqs: [{question:"Hva kan sexolog hjelpe med?",answer:"Smerter, nedsatt lyst, ereksjonsproblemer, intimitetsproblemer."}] },
  { key: "flere-fagomrader/areknuter", title: "Åreknutebehandling", subtitle: "Moderne behandling av åreknuter.", parentCategory: "Flere fagområder", categoryRef: "category-flere-fagomrader", description: "Åreknuter kan gi smerter, hevelse og tyngdefølelse. Vi tilbyr moderne behandling.\n\nUtredning starter med ultralyd.", benefits: ["Grundig ultralyd","Moderne metoder","Kort rekonvalesens","Erfarne karkirurger"], faqs: [{question:"Årsaker?",answer:"Svekkede klaffer, arv, svangerskap, overvekt, langvarig ståing."},{question:"Pris utredning?",answer:"Kr 1 800 inkludert ultralyd."}] },
];

function buildTreatmentDocs(): Mutation[] {
  return treatments.map((t) => {
    const parts = t.key.split("/");
    const treatmentSlug = parts[1];
    const doc: any = {
      _id: `treatment-${slug(t.key)}`,
      _type: "treatment",
      title: t.title,
      slug: { _type: "slug", current: treatmentSlug },
      category: { _type: "reference", _ref: t.categoryRef },
      parentCategoryLabel: t.parentCategory,
      description: t.description,
      benefitsTitle: "Hvorfor velge oss",
      benefits: t.benefits || [],
    };
    if (t.process) {
      doc.process = t.process.map((p: any, i: number) => ({
        _type: "object",
        _key: `step${i}`,
        title: p.title,
        description: p.description,
      }));
    }
    if (t.faqs) {
      doc.faqs = t.faqs.map((f: any, i: number) => ({
        _type: "object",
        _key: `faq${i}`,
        question: f.question,
        answer: f.answer,
      }));
    }
    return { createOrReplace: doc };
  });
}

// ============================================================
// SPECIALISTS (full data with images, bios, clinics, subtitles)
// ============================================================

// Map slug to local image file in src/assets/specialists/
const specialistImageMap: Record<string, string> = {
  "alenka-bindas": "specialists/alenka-bindas.jpg",
  "anamika-choudhury": "specialists/anamika-choudhury.jpg",
  "andreas-edenberg": "specialists/andreas-edenberg.jpg",
  "ane-gerda-z-eriksson": "specialists/ane-gerda-z-eriksson.webp",
  "are-haukaen-stodle": "specialists/are-haukaen-stodle.jpg",
  "ashi-ahmad": "specialists/ashi-ahmad.webp",
  "audun-hoegh-tangerud": "specialists/audun-hoegh-tangerud.jpg",
  "birgir-gudbrandsson": "specialists/birgir-gudbrandsson.jpg",
  "birgitte-aspenes": "specialists/birgitte-aspenes.jpg",
  "birgitte-mitlid-mork": "specialists/birgitte-mitlid-mork.jpg",
  "bjorn-brennhovd": "specialists/bjorn-brennhovd.jpg",
  "bjorn-robstad": "specialists/bjorn-robstad.jpg",
  "einar-andre-brevik": "specialists/einar-andre-brevik.jpg",
  "endre-soreide": "specialists/endre-soreide.jpg",
  "erik-berg": "specialists/erik-berg.jpg",
  "ersan-krckov": "specialists/ersan-krckov.jpg",
  "gilbert-moatshe": "specialists/gilbert-moatshe.webp",
  "gunnar-dalen": "specialists/gunnar-dalen.jpg",
  "hannah-russell": "specialists/hannah-russell.jpg",
  "henrik-michelsen-wahl": "specialists/henrik-michelsen-wahl.jpg",
  "ida-waagsbo-bjorntvedt": "specialists/ida-waagsbo-bjorntvedt.jpg",
  "ingvild-skarpas-aannerud": "specialists/ingvild-skarpas-aannerud.jpg",
  "istvan-zoltan-rigo": "specialists/istvan-zoltan-rigo.jpg",
  "jackson-tok": "specialists/jackson-tok.jpg",
  "jan-roland-lambrecht": "specialists/jan-roland-lambrecht.jpg",
  "jan-ragnar-haugstvedt": "specialists/jan-ragnar-haugstvedt.jpg",
  "jeanette-follestad": "specialists/jeanette-follestad.jpg",
  "jonas-rydinge": "specialists/jonas-rydinge.jpg",
  "jorgen-perminow": "specialists/jorgen-perminow.jpg",
  "kjersti-brenden": "specialists/kjersti-brenden.jpg",
  "kjersti-margrete-finsrud": "specialists/kjersti-margrete-finsrud.jpg",
  "kristian-marstrand-warholm": "specialists/kristian-marstrand-warholm.jpg",
  "kristian-ophaug": "specialists/kristian-ophaug.jpg",
  "lars-eldar-myrseth": "specialists/lars-eldar-myrseth.webp",
  "lars-fredrik-qvigstad": "specialists/lars-fredrik-qvigstad.jpg",
  "line-fusdahl-hulleberg": "specialists/line-fusdahl-hulleberg.jpg",
  "line-jacob": "specialists/line-jacob.jpg",
  "linn-myrtveit-stensrud": "specialists/linn-myrtveit-stensrud.jpg",
  "linnea-torsnes": "specialists/linnea-torsnes.jpg",
  "madeleine-engen": "specialists/madeleine-engen.jpg",
  "marc-jacob-strauss": "specialists/marc-jacob-strauss.jpg",
  "mari-borge-eskerud": "specialists/mari-borge-eskerud.jpg",
  "maria-thompson-clausen": "specialists/maria-thompson-clausen.jpg",
  "marian-bale": "specialists/marian-bale.jpg",
  "marthe-hagen": "specialists/marthe-hagen.jpg",
  "morten-andersen": "specialists/morten-andersen.jpg",
  "nabeel-yousaf-khan": "specialists/nabeel-yousaf-khan.jpg",
  "nicolai-wessel": "specialists/nicolai-wessel.jpg",
  "siri-klokstad": "specialists/siri-klokstad.webp",
  "sondre-hassellund": "specialists/sondre-hassellund.webp",
  "sonu-lukose": "specialists/sonu-lukose.jpg",
  "stig-hegna": "specialists/stig-hegna.jpg",
  "tea-berge": "specialists/tea-berge.jpg",
  "thomas-fredrik-thaulow": "specialists/thomas-fredrik-thaulow.jpg",
  "tom-henry-sundoen": "specialists/tom-henry-sundoen.jpg",
  "tonje-westlie": "specialists/tonje-westlie.jpg",
  "trond-jorgensen": "specialists/trond-jorgensen.jpg",
};

const specialistsList = [
  { name: "Alenka Bindas", title: "Gynekolog", subtitle: "Spesialist", expertise: ["Gynekologi"], slug: "alenka-bindas", category: "gynekologi", bio: "Alenka Bindas er spesialist i gynekologi. Hun har lang og bred erfaring i utredning, behandling og oppfølging av alle typer kvinnesykdommer. På grunn av hennes gode renommé og faglige dyktighet har Alenka pasienter fra hele Innlandet og andre deler av landet.", clinics: ["Moelv"] },
  { name: "Anamika Choudhury", title: "Embryolog", subtitle: "Fertilitet", expertise: ["Fertilitet","Embryologi"], slug: "anamika-choudhury", category: "fertilitet", bio: "Anamika jobber på fertilitetsteamet og har over 12 års internasjonal erfaring innen reproduksjonsmedisin.", clinics: ["Majorstuen"] },
  { name: "Andreas Edenberg", title: "Gastrokirurg", subtitle: "Spesialist", expertise: ["Gastrokirurgi","Overvektskirurgi","Endoskopi"], slug: "andreas-edenberg", category: "annet", bio: "Dr. Andreas Edenberg er spesialist i generell kirurgi og gastroenterologisk kirurgi, med europeisk spesialistgodkjenning i traumekirurgi.", clinics: ["Majorstuen"] },
  { name: "Ane Gerda Z Eriksson", title: "Gynekolog", subtitle: "Robotkirurg", expertise: ["Gynekologi","Robotkirurgi","Gynekologisk kreftbehandling"], slug: "ane-gerda-z-eriksson", category: "gynekologi", bio: "Dr. Eriksson er en erfaren gynekolog med subspesialisering innen gynekologisk kreftbehandling fra Memorial Sloan Kettering Cancer Center i USA.", clinics: ["Majorstuen"] },
  { name: "Are Haukåen Stødle", title: "Ortoped", subtitle: "Kirurg", expertise: ["Ortopedi","Fot- og ankelkirurgi"], slug: "are-haukaen-stodle", category: "ortopedi", bio: "Dr. Haukåen Stødle er ortoped og spesialist i fot- og ankelkirurgi.", clinics: ["Majorstuen"] },
  { name: "Ashi Ahmad", title: "Gynekolog", subtitle: "Fødselshjelp", expertise: ["Gynekologi","Fødselshjelp","Fostermedisin","Ultralyd","NIPT"], slug: "ashi-ahmad", category: "gynekologi", bio: "Dr. Ashi Ahmad er spesialist i fødselshjelp og gynekologi og fostermedisiner.", clinics: ["Majorstuen"] },
  { name: "Audun Høegh Tangerud", title: "Ortoped", subtitle: "Kirurg", expertise: ["Ortopedi","Hånd- og fotkirurgi"], slug: "audun-hoegh-tangerud", category: "ortopedi", bio: "Dr. Audun Høegh Tangerud er en erfaren ortopedisk kirurg med spesialisering innen hånd- og fotkirurgi.", clinics: ["Moelv"] },
  { name: "Birgir Gudbrandsson", title: "Revmatolog", subtitle: "Vaskulitt", expertise: ["Revmatologi","Vaskulitt"], slug: "birgir-gudbrandsson", category: "annet", bio: "Fra 2017 har Birgir vært en viktig del av Revmatologisk avdeling ved Oslo Universitetssykehus Rikshospitalet.", clinics: ["Majorstuen"] },
  { name: "Birgitte Aspenes", title: "Gynekolog", subtitle: "Kirurg", expertise: ["Gynekologi","Kirurgi","Overgangsalder","Urogynekologi"], slug: "birgitte-aspenes", category: "gynekologi", bio: "Dr. Birgitte Aspenes er utdannet lege ved Universitetet i Oslo.", clinics: ["Bekkestua"] },
  { name: "Birgitte Mitlid-Mork", title: "Fertilitetslege", subtitle: "Gynekolog", expertise: ["Fertilitet","IVF","Gynekologi","Hormonforstyrrelser"], slug: "birgitte-mitlid-mork", category: "fertilitet", bio: "Birgitte er spesialist i fødselshjelp og kvinnesykdommer.", clinics: ["Majorstuen"] },
  { name: "Bjørn Brennhovd", title: "Urolog", subtitle: "Kirurg", expertise: ["Urologi","Robotkirurgi","Prostatakreft"], slug: "bjorn-brennhovd", category: "urologi", bio: "Bjørn Brennhovd introduserte robotassistert kirurgi i Norge i 2004.", clinics: ["Majorstuen"] },
  { name: "Bjørn Robstad", title: "Ortoped", subtitle: "Kirurg", expertise: ["Ortopedi","Protesekirurgi","Traumatologi","Fotkirurgi"], slug: "bjorn-robstad", category: "ortopedi", bio: "Bjørn Robstad har omfattende erfaring innen ortopedisk kirurgi siden 2005.", clinics: ["Moelv"] },
  { name: "Einar Andre Brevik", title: "Karkirurg", subtitle: "Spesialist", expertise: ["Karkirurgi","Åreknuter"], slug: "einar-andre-brevik", category: "annet", bio: "Dr. Brevik er en av Norges mest erfarne kar- og åreknutekirurger.", clinics: ["Moelv","Majorstuen"] },
  { name: "Endre Søreide", title: "Ortoped", subtitle: "Kirurg", expertise: ["Ortopedi","Hånd- og albuekirurgi","Artroskopisk kirurgi"], slug: "endre-soreide", category: "ortopedi", bio: "Dr. Endre Søreide er hånd- og albuekirurg.", clinics: ["Majorstuen"] },
  { name: "Erik Berg", title: "Plastikkirurg", subtitle: "Spesialist", expertise: ["Plastikkirurgi","Rekonstruksjonskirurgi","Kosmetisk kirurgi"], slug: "erik-berg", category: "annet", bio: "Overlege PhD Erik Berg er spesialist i plastikkirurgi.", clinics: ["Moss"] },
  { name: "Ersan Krckov", title: "Endokrinolog", subtitle: "Spesialist", expertise: ["Endokrinologi","Stoffskifte","Diabetes","Hormonsykdommer"], slug: "ersan-krckov", category: "annet", bio: "Dr. Ersan Krckov er spesialist i indremedisin og endokrinologi.", clinics: ["Majorstuen"] },
  { name: "Gilbert Moatshe", title: "Ortoped", subtitle: "Knekirurg", expertise: ["Ortopedi","Knekirurgi","Skulderkirurgi","Idrettsskader"], slug: "gilbert-moatshe", category: "ortopedi", bio: "Dr. Gilbert Moatshe er spesialist i ortopedisk kirurgi ved OUS Ullevål.", clinics: ["Majorstuen"] },
  { name: "Gunnar Dalén", title: "Karkirurg", subtitle: "Spesialist", expertise: ["Karkirurgi","Åreknuter","Venebehandling"], slug: "gunnar-dalen", category: "annet", bio: "Gunnar Dalén er spesialist i karkirurgi.", clinics: ["Majorstuen"] },
  { name: "Hannah Russell", title: "Fertilitetslege", subtitle: "Gynekolog", expertise: ["Fertilitet","Gynekologi","POI"], slug: "hannah-russell", category: "fertilitet", bio: "Hannah Russell er spesialist i gynekologi og obstetrikk, med over 20 års erfaring.", languages: ["Norsk","Engelsk"], clinics: ["Majorstuen"] },
  { name: "Henrik Michelsen-Wahl", title: "Gynekolog", subtitle: "Kirurg", expertise: ["Gynekologi","Endometriose","Gynekologisk kirurgi"], slug: "henrik-michelsen-wahl", category: "gynekologi", bio: "Henrik Michelsen-Wahl er gynekolog med bred erfaring.", languages: ["Norsk","Engelsk","Tysk"], clinics: ["Majorstuen"] },
  { name: "Ida Waagsbø Bjørntvedt", title: "Fertilitetslege", subtitle: "Gynekolog", expertise: ["Fertilitet","IVF","Vulvaklinikk","POI"], slug: "ida-waagsbo-bjorntvedt", category: "fertilitet", bio: "Dr. Bjørntvedt er gynekolog med subspesialisering innen infertilitet.", clinics: ["Majorstuen"] },
  { name: "Ingvild Skarpås Aannerud", title: "Osteopat", subtitle: "Vulvaklinikk", expertise: ["Osteopati","Bekkenbunnshelse","Kvinnehelse"], slug: "ingvild-skarpas-aannerud", category: "annet", bio: "Ingvild er autorisert osteopat med over ti års erfaring.", clinics: ["Majorstuen"] },
  { name: "Istvan Zoltan Rigo", title: "Ortoped", subtitle: "Håndkirurg", expertise: ["Ortopedi","Håndkirurgi","Artroskopi"], slug: "istvan-zoltan-rigo", category: "ortopedi", bio: "Istvan Zoltan Rigo er spesialist i ortopedisk kirurgi.", clinics: ["Moss"] },
  { name: "Jackson Tok", title: "Fertilitetslege", subtitle: "Gynekolog", expertise: ["Fertilitet","IVF","Mannlig infertilitet","Mikro-TESE"], slug: "jackson-tok", category: "fertilitet", bio: "Jackson Tok er spesialist i gynekologi med subspesialisering innen infertilitet.", clinics: ["Majorstuen"] },
  { name: "Jan Roland Lambrecht", title: "Gastrokirurg", subtitle: "Spesialist", expertise: ["Gastrokirurgi","Overvektskirurgi","Robotkirurgi","Brokkkirurgi"], slug: "jan-roland-lambrecht", category: "annet", bio: "Dr. Jan Lambrecht er spesialist i gastrokirurgi, robotassistert kirurgi og generell kirurgi.", clinics: ["Majorstuen"] },
  { name: "Jan-Ragnar Haugstvedt", title: "Ortoped", subtitle: "Håndkirurg", expertise: ["Ortopedi","Håndkirurgi","Artroskopisk håndkirurgi"], slug: "jan-ragnar-haugstvedt", category: "ortopedi", bio: "Jan Ragnar Haugstvedt er en erfaren håndkirurg.", clinics: ["Majorstuen"] },
  { name: "Jeanette Follestad", title: "Sykepleier", subtitle: "Fertilitet", expertise: ["Sykepleie","Fertilitet"], slug: "jeanette-follestad", category: "annet", bio: "Jeanette jobber som fertilitetssykepleier ved CMedical.", clinics: ["Majorstuen"] },
  { name: "Jonas Rydinge", title: "Ortoped", subtitle: "Spesialist", expertise: ["Ortopedi","Fot- og ankelkirurgi"], slug: "jonas-rydinge", category: "ortopedi", bio: "Spesialist i ortopedisk kirurgi og overlege ved fot- og ankelseksjonen på Ullevål sykehus.", clinics: ["Majorstuen"] },
  { name: "Jørgen Perminow", title: "Gynekolog", subtitle: "Spesialist", expertise: ["Gynekologi","Obstetrikk"], slug: "jorgen-perminow", category: "gynekologi", bio: "Dr. Jørgen Perminow har omfattende erfaring fra Ahus og Ullevål Sykehus.", languages: ["Norsk","Engelsk","Polsk"], clinics: ["Majorstuen"] },
  { name: "Kjersti Brenden", title: "Fertilitetslege", subtitle: "Gynekolog", expertise: ["Fertilitet","IVF","Gynekologi","Eggdonasjon"], slug: "kjersti-brenden", category: "fertilitet", bio: "Kjersti Brenden er spesialist i gynekologi og obstetrikk med over 20 års erfaring.", clinics: ["Majorstuen"] },
  { name: "Kjersti Margrete Finsrud", title: "Sexolog", subtitle: "Spesialist", expertise: ["Sexologi","Seksuell helse","Vulvasmerter","Prevensjon"], slug: "kjersti-margrete-finsrud", category: "annet", bio: "Kjersti er sykepleier med videreutdanning som helsesykepleier.", clinics: ["Majorstuen"] },
  { name: "Kristian Marstrand Warholm", title: "Ortoped", subtitle: "Kirurg", expertise: ["Ortopedi","Hoftekirurgi","Knekirurgi","Skulderkirurgi","Idrettsmedisin"], slug: "kristian-marstrand-warholm", category: "ortopedi", bio: "Kristian Marstrand Warholm er overlege ved OUS Ullevål.", clinics: ["Majorstuen"] },
  { name: "Kristian Ophaug", title: "Fertilitetscoach", subtitle: "Familieterapeut", expertise: ["Fertilitet","Familieterapi","Fertilitetsrådgivning"], slug: "kristian-ophaug", category: "fertilitet", bio: "Kristian Ophaug har over 20 års erfaring som terapeut.", clinics: ["Majorstuen"] },
  { name: "Lars Eldar Myrseth", title: "Ortoped", subtitle: "Kirurg", expertise: ["Ortopedi","Håndkirurgi","Nerveskader"], slug: "lars-eldar-myrseth", category: "ortopedi", bio: "Lars Eldar Myrseth har flere års erfaring fra Rikshospitalet.", clinics: ["Majorstuen"] },
  { name: "Lars Fredrik Qvigstad", title: "Urolog", subtitle: "Kirurg", expertise: ["Urologi","Prostatakreft"], slug: "lars-fredrik-qvigstad", category: "urologi", bio: "Lars er urolog og generell kirurg.", clinics: ["Majorstuen"] },
  { name: "Line Fusdahl Hulleberg", title: "Sykepleier", subtitle: "Fertilitet", expertise: ["Sykepleie","Fertilitet","Inseminasjon"], slug: "line-fusdahl-hulleberg", category: "annet", bio: "Line Fusdahl Hulleberg har vært sykepleier siden 2008.", clinics: ["Majorstuen"] },
  { name: "Line Jacob", title: "Gynekolog", subtitle: "Spesialist", expertise: ["Gynekologi","Reproduksjonsmedisin","Overgangsalder"], slug: "line-jacob", category: "gynekologi", bio: "Dr. Line Jacob er utdannet lege fra Universitetet i Oslo.", clinics: ["Bekkestua"] },
  { name: "Linn Myrtveit-Stensrud", title: "Psykolog, PhD", subtitle: "Spesialist", expertise: ["Psykologi","Kvinnehelse","Vulvodyni","Vaginisme"], slug: "linn-myrtveit-stensrud", category: "annet", bio: "Linn er utdannet psykolog fra UiO med doktorgrad fra OsloMet.", clinics: ["Majorstuen"] },
  { name: "Linnea Torsnes", title: "Hudlege", subtitle: "Spesialist", expertise: ["Hudhelse","Dermatologi","Hudkreft","Laserbehandling"], slug: "linnea-torsnes", category: "annet", bio: "Dr. Linnea Torsnes er spesialist i hud- og veneriske sykdommer.", clinics: ["Bekkestua"] },
  { name: "Madeleine Engen", title: "Gynekolog", subtitle: "Kirurg", expertise: ["Gynekologi","Urogynekologi","Bekkenbunnshelse"], slug: "madeleine-engen", category: "gynekologi", bio: "Dr. Engen er spesialist innen gynekologi med ekspertise innen urogynekologi.", clinics: ["Majorstuen"] },
  { name: "Marc Jacob Strauss", title: "Ortoped", subtitle: "Spesialist", expertise: ["Ortopedi","Knekirurgi","Idrettsmedisin","Korsbåndkirurgi"], slug: "marc-jacob-strauss", category: "ortopedi", bio: "Dr. Marc Jacob Strauss er spesialist i ortopedisk kirurgi.", clinics: ["Majorstuen"] },
  { name: "Mari Borge Eskerud", title: "Ernæringsfysiolog", subtitle: "Spesialist", expertise: ["Ernæring","IBS","LavFODMAP","PCOS"], slug: "mari-borge-eskerud", category: "annet", bio: "Mari Borge Eskerud er klinisk ernæringsfysiolog.", clinics: ["Majorstuen"] },
  { name: "Maria Thompson Clausen", title: "Ernæringsfysiolog", subtitle: "Spesialist", expertise: ["Ernæring","Livsstilsveiledning","IBS","Spiseforstyrrelser"], slug: "maria-thompson-clausen", category: "annet", bio: "Maria Thompson Clausen er utdannet klinisk ernæringsfysiolog fra UiO.", clinics: ["Bekkestua"] },
  { name: "Marian Bale", title: "Gastrokirurg", subtitle: "Spesialist", expertise: ["Gastrokirurgi","Brokkbehandling","Laparoskopi"], slug: "marian-bale", category: "annet", bio: "Dr. Marian Bale er overlege og spesialist i generell kirurgi og gastrokirurgi.", clinics: ["Majorstuen"] },
  { name: "Marthe Hagen", title: "Psykolog", subtitle: "Terapi", expertise: ["Psykologi","Terapi","Kvinnehelse","EMDR"], slug: "marthe-hagen", category: "annet", bio: "Marthe Hagen er psykolog med spesielt fokus på kvinnehelse.", clinics: ["Majorstuen"] },
  { name: "Morten Andersen", title: "Urolog", subtitle: "Spesialist", expertise: ["Urologi","Sterilisering","Forhudsoperasjoner"], slug: "morten-andersen", category: "urologi", bio: "Morten Andersen er spesialist i kirurgi og urologi fra 1993.", clinics: ["Moelv"] },
  { name: "Nabeel Yousaf Khan", title: "Urolog", subtitle: "Spesialist", expertise: ["Urologi","Prostata","Sterilisering"], slug: "nabeel-yousaf-khan", category: "urologi", bio: "Nabeel Yousaf Khan er urolog ved Sykehuset Innlandet Hamar.", clinics: ["Moelv"] },
  { name: "Nicolai Wessel", title: "Urolog", subtitle: "Kirurg", expertise: ["Urologi","Robotkirurgi","Prostatakreft"], slug: "nicolai-wessel", category: "urologi", bio: "Nicolai Wessel er en erfaren spesialist innen kirurgi og urologi.", clinics: ["Majorstuen"] },
  { name: "Siri Kløkstad", title: "Gynekolog", subtitle: "Spesialist", expertise: ["Gynekologi","Vulvaplager","Hormoner","Prevensjon"], slug: "siri-klokstad", category: "gynekologi", bio: "Siri Kløkstad er utdannet gynekolog.", clinics: ["Bekkestua"] },
  { name: "Sondre Hassellund", title: "Ortoped", subtitle: "Kirurg", expertise: ["Ortopedi","Hånd- og albuekirurgi"], slug: "sondre-hassellund", category: "ortopedi", bio: "Dr. Sondre Hassellund er hånd- og albuekirurg.", clinics: ["Majorstuen"] },
  { name: "Sonu Lukose", title: "Embryolog", subtitle: "Fertilitetsteam", expertise: ["Fertilitet","Embryologi","IVF"], slug: "sonu-lukose", category: "fertilitet", bio: "Sonu er en ESHRE-sertifisert Senior Klinisk Embryolog.", clinics: ["Majorstuen"] },
  { name: "Stig Hegna", title: "Ortoped", subtitle: "Kirurg", expertise: ["Ortopedi","Fotkirurgi"], slug: "stig-hegna", category: "ortopedi", bio: "Dr. Hegna er spesialist i ortopedisk kirurgi og spesialist i fotkirurgi.", clinics: ["Majorstuen"] },
  { name: "Tea Berge", title: "Ortoped", subtitle: "Spesialist", expertise: ["Ortopedi","Kne- og skulderkirurgi"], slug: "tea-berge", category: "ortopedi", bio: "Tea er spesialist i ortopedisk kirurgi siden 2015.", clinics: ["Majorstuen"] },
  { name: "Thomas Fredrik Thaulow", title: "Gynekolog", subtitle: "Spesialist", expertise: ["Gynekologi","Endometriose","Laparoskopi","Hysteroskopi"], slug: "thomas-fredrik-thaulow", category: "gynekologi", bio: "Thomas er en av landets fremste spesialister innen endoskopiske operasjoner.", clinics: ["Majorstuen"] },
  { name: "Tom Henry Sundøen", title: "Ortoped", subtitle: "Spesialist", expertise: ["Ortopedi","Skopisk kirurgi","Hoftekirurgi","Idrettsmedisin"], slug: "tom-henry-sundoen", category: "ortopedi", bio: "Tom Henry Sundøen er ortopedkirurg og traumatolog.", clinics: ["Moss"] },
  { name: "Tonje Westlie", title: "Fysioterapeut", subtitle: "Håndterapeut", expertise: ["Fysioterapi","Håndterapi","Rehabilitering"], slug: "tonje-westlie", category: "annet", bio: "Tonje er utdannet fysioterapeut ved OsloMet i 2011.", clinics: ["Majorstuen"] },
  { name: "Trond Jørgensen", title: "Urolog", subtitle: "Kirurg", expertise: ["Urologi","Prostatakreft","Sterilisering"], slug: "trond-jorgensen", category: "urologi", bio: "Trond Jørgensen er kirurg og urolog med doktorgrad innen prostatakreft.", clinics: ["Majorstuen"] },
];

const categoryRefMap: Record<string, string> = {
  gynekologi: "category-gynekologi",
  fertilitet: "category-fertilitet",
  urologi: "category-urologi",
  ortopedi: "category-ortopedi",
  annet: "category-flere-fagomrader",
};

/**
 * Build specialist docs with uploaded images
 */
async function buildSpecialistDocsWithImages(): Promise<Mutation[]> {
  const mutations: Mutation[] = [];
  
  for (const s of specialistsList) {
    // Upload image if available
    const imagePath = specialistImageMap[s.slug];
    let photoRef = null;
    if (imagePath) {
      photoRef = await uploadImage(imagePath, `specialist-${s.slug}`);
    }

    mutations.push({
      createOrReplace: {
        _id: `specialist-${s.slug}`,
        _type: "specialist",
        name: s.name,
        slug: { _type: "slug", current: s.slug },
        role: s.title,
        subtitle: (s as any).subtitle || "",
        specialties: s.expertise,
        categories: [{ _type: "reference", _ref: categoryRefMap[s.category] || "category-flere-fagomrader", _key: `cat-${s.slug}` }],
        clinics: (s as any).clinics || [],
        shortBio: s.bio || `${s.name} er spesialist i ${s.title.toLowerCase()} hos CMedical.`,
        education: (s as any).education ? [(s as any).education] : [],
        languages: s.languages || ["Norsk", "Engelsk"],
        bookingEnabled: true,
        ...(photoRef ? { photo: photoRef } : {}),
      },
    });
  }
  
  return mutations;
}

// ============================================================
// GOOGLE REVIEWS
// ============================================================
const reviews = [
  { id: 1, name: "Trude Pedersen", rating: 5, text: "Fantastisk opplevelse- hyggelig og dyktig lege. Fikk meg til å føle meg veldig trygg og fikk nyttig informasjon. Legen heter Siri Kløkstad", date: "2024-09-01" },
  { id: 2, name: "Kaja Kollsgård", rating: 5, text: "Har hatt en veldig behagelig og fin opplevelse med eggfrys på CMedical. Min lege Jackson var svært dyktig og betryggende.", date: "2024-07-01" },
  { id: 3, name: "Børge Thue", rating: 5, text: "God servise, gjennomføringsevne. Fantastisk personale og flotte lokaler og god meny.", date: "2025-01-01" },
  { id: 4, name: "Basse Grefsrud", rating: 5, text: "Fra start til etter operasjonen har alt gått på skinner veldig fornøyd", date: "2025-02-01" },
  { id: 5, name: "Thor Gustavsen", rating: 5, text: "Etter robotassistert kirurgi for prostatakreft av kirurg Nicolai Wessel, er jeg utrolig fornøyd.", date: "2024-12-01" },
  { id: 6, name: "Kjell Olav Rebne", rating: 5, text: "Full score på alle punkter fra mottakelse til etterbehandling. Ansvalig lege var Trond Jørgensen", date: "2025-01-01" },
  { id: 7, name: "Anders Engh", rating: 5, text: "Ekstremt dyktig håndkirurg Jan Ragnar Haugstvedt! Hele opplevelsen var fantastisk.", date: "2024-10-01" },
  { id: 8, name: "Tiril Charlotte Ulrichsen", rating: 5, text: "Veldig fin opplevelse hos CMedical. Gynekologen Ida var nøye og trygg.", date: "2025-01-01" },
  { id: 9, name: "Cato Ingebretsen", rating: 5, text: "Særskilt god opplevelse ved skulderoperasjon av overlege Kristian Marstrand Warholm.", date: "2024-12-01" },
  { id: 10, name: "Martine Widing", rating: 5, text: "Hyggelig og god opplevelse. Følte meg godt ivaretatt :)", date: "2024-11-01" },
  { id: 11, name: "Line Toft Sæther", rating: 5, text: "Nydelig sted med fantastiske mennesker. Super opplevelse med nedfrysning av egg.", date: "2024-08-01" },
  { id: 12, name: "Mari Nilsen", rating: 5, text: "Utførte IVF her i 2023 og endte opp med en nydelig gutt etter 3 forsøk.", date: "2024-03-01" },
  { id: 13, name: "Terje Schults", rating: 5, text: "Veldig prof behandling, hyggelig og seriøse medarbeidere.", date: "2024-11-01" },
  { id: 14, name: "Sunniva Hage", rating: 5, text: "Ingvild Aanerud er en dyktig osteopat med stor kunnskap innen kvinnehelse.", date: "2024-07-01" },
];

function buildReviewDocs(): Mutation[] {
  return reviews.map((r) => ({
    createOrReplace: {
      _id: `review-${r.id}`,
      _type: "googleReview",
      author: r.name,
      rating: r.rating,
      text: r.text,
      date: r.date,
    },
  }));
}

// ============================================================
// PAGES
// ============================================================
function buildPageDocs(): Mutation[] {
  // Legacy — replaced by buildPageDocsWithImages()
  return [];
}

/**
 * Build page documents with uploaded images
 */
async function buildPageDocsWithImages(): Promise<Mutation[]> {
  // Upload hero slide images
  const slideImageRefs = [];
  for (let i = 0; i < heroSlideImages.length; i++) {
    const ref = await uploadImage(heroSlideImages[i], `hero-slide-${i + 1}`);
    slideImageRefs.push(ref);
  }

  // Upload page hero images
  const pageImageRefs: Record<string, any> = {};
  for (const [pageId, imgPath] of Object.entries(pageImages)) {
    const ref = await uploadImage(imgPath, `${pageId}-hero`);
    if (ref) pageImageRefs[pageId] = ref;
  }

  // Upload promo block images
  const promoImage1 = await uploadImage("hero/hero-clinic-lounge.jpg", "promo-1");
  const promoImage2 = await uploadImage("hero/hero-technology.jpg", "promo-2");

  return [
    // Homepage
    {
      createOrReplace: {
        _id: "homepage",
        _type: "homepage",
        title: "CMedical – Nordens ledende klinikk for livet og underlivet",
        ...(pageImageRefs.homepage ? { heroImage: pageImageRefs.homepage } : {}),
        heroBanner: {
          slides: [
            { _type: "object", _key: "s1", heading: "Styrket kvinnehelse\n– i hele livsløpet", subheading: "Kvinnehelse", ctaText: "Les mer", ctaLink: "/gynekologi", ...(slideImageRefs[0] ? { image: slideImageRefs[0] } : {}) },
            { _type: "object", _key: "s2", heading: "Mannshelse\nog urologi", subheading: "Urologi", ctaText: "Les mer", ctaLink: "/urologi", ...(slideImageRefs[1] ? { image: slideImageRefs[1] } : {}) },
            { _type: "object", _key: "s3", heading: "Landets første private\nmed robotkirurgi", subheading: "Teknologi", ctaText: "Les mer", ctaLink: "/tjenester", ...(slideImageRefs[2] ? { image: slideImageRefs[2] } : {}) },
            { _type: "object", _key: "s4", heading: "Din reise til\nforeldreskap", subheading: "Fertilitet", ctaText: "Les mer", ctaLink: "/fertilitet", ...(slideImageRefs[3] ? { image: slideImageRefs[3] } : {}) },
          ],
        },
        tagline: "Faglig trygghet og personlig omsorg – for din helse",
        serviceCategories: [
          { _type: "reference", _ref: "category-gynekologi", _key: "sc1" },
          { _type: "reference", _ref: "category-fertilitet", _key: "sc2" },
          { _type: "reference", _ref: "category-urologi", _key: "sc3" },
          { _type: "reference", _ref: "category-ortopedi", _key: "sc4" },
          { _type: "reference", _ref: "category-flere-fagomrader", _key: "sc5" },
        ],
        valueBadges: [
          { _type: "object", _key: "vb1", icon: "Shield", label: "Trygg og moderne behandlingsteknologi" },
          { _type: "object", _key: "vb2", icon: "Home", label: "Behagelige lokaler" },
          { _type: "object", _key: "vb3", icon: "CreditCard", label: "Tilgjengelig pris" },
        ],
        promoBlocks: [
          { _type: "object", _key: "pb1", title: "Robotassistert overvektskirurgi – presisjon, trygghet og varige resultater", ctaText: "Les mer", ctaLink: "/robotassistert-kirurgi", ...(promoImage1 ? { image: promoImage1 } : {}) },
          { _type: "object", _key: "pb2", title: "Livio Oslo blir en del av CMedical og tilbudet til pasientene styrkes", ctaText: "Les mer", ctaLink: "/tverrfaglige-team", ...(promoImage2 ? { image: promoImage2 } : {}) },
        ],
        seo: {
          _type: "seo",
          metaTitle: "CMedical – Skandinavias ledende helhetskonsept",
          metaDescription: "Nordens mest komplette private tilbud innen gynekologi, fertilitet og urologi. Ledende spesialister, kort ventetid, ingen henvisning nødvendig.",
        },
      },
    },
    // About Page
    {
      createOrReplace: {
        _id: "aboutPage",
        _type: "aboutPage",
        title: "Om CMedical",
        subtitle: "Livet og underlivet",
        ...(pageImageRefs.aboutPage ? { heroImage: pageImageRefs.aboutPage } : {}),
        body: blockText("CMedical er her for mennesker som ønsker trygg og spesialisert hjelp for kroppen og underlivet – uansett kjønn, livssituasjon eller behov. Vi har et særlig engasjement for kvinnehelse. Samtidig møter vi også menn med samme faglige omtanke, og ser helse i et helhetlig perspektiv – særlig når det gjelder fertilitet, som berører alle som ønsker eller forsøker å skape liv.\n\nHos oss skal du føle deg ivaretatt fra første kontakt. Vi tilbyr utredning og behandling der medisinsk presisjon kombineres med trygghet, respekt og rom for spørsmål. Målet er at du skal forstå prosessen, oppleve forutsigbarhet og få den hjelpen som passer din kropp og din livsfase.\n\nBehandlingen utføres av erfarne spesialister som samarbeider tett i tverrfaglige miljøer. Det gir deg presise vurderinger, skånsomme inngrep og god oppfølging gjennom hele forløpet.\n\nVi vet at rammene rundt behandlingen påvirker opplevelsen. Derfor møter du moderne klinikker innredet i varme toner, rolige omgivelser og ansatte som setter av nødvendig tid til deg.\n\nVi ønsker at flere skal ha tilgang til spesialisthelsetjenester. Derfor tilrettelegger vi for behandling til priser som gjør det mulig å få kvalifisert hjelp uten at det går på bekostning av omsorg eller kvalitet.\n\nHos CMedical handler alt om at du skal bli tatt på alvor – med faglig trygghet, verdighet og helhetlig støtte gjennom hele behandlingen."),
        seo: {
          _type: "seo",
          metaTitle: "Om oss | CMedical – Nordens ledende klinikk for livet og underlivet",
          metaDescription: "CMedical er her for mennesker som ønsker trygg og spesialisert hjelp for kroppen og underlivet.",
        },
      },
    },
    // Contact Page
    {
      createOrReplace: {
        _id: "contactPage",
        _type: "contactPage",
        title: "Kontakt oss",
        introText: "Har du spørsmål? Vi svarer gjerne på alle henvendelser",
        ...(pageImageRefs.contactPage ? { heroImage: pageImageRefs.contactPage } : {}),
        phone: "22 60 00 50",
        email: "post@cmedical.no",
        address: { _type: "object", street: "Kirkeveien 64B", city: "Oslo", zip: "0366" },
        openingHours: [
          { _type: "object", _key: "oh1", days: "Mandag–Fredag", hours: "08:00–16:00" },
        ],
        seo: {
          _type: "seo",
          metaTitle: "Kontakt oss | CMedical",
          metaDescription: "Kontakt CMedical for spørsmål om behandlinger, priser eller booking. Vi svarer innen 24 timer.",
        },
      },
    },
    // Pricing Page
    {
      createOrReplace: {
        _id: "pricingPage",
        _type: "pricingPage",
        title: "Prisliste",
        introText: "Hos CMedical får du erfaring, spisskompetanse og moderne teknologi samlet på ett sted – en trygg og omsorgsfull opplevelse.",
        ...(pageImageRefs.pricingPage ? { heroImage: pageImageRefs.pricingPage } : {}),
        priceCategories: [
          {
            _type: "object", _key: "pc-gyn",
            categoryName: "Gynekologi",
            category: { _type: "reference", _ref: "category-gynekologi" },
            items: [
              { _type: "object", _key: "gi1", name: "Gynekologisk konsultasjon", price: 1490, priceLabel: "1.490 kr" },
              { _type: "object", _key: "gi2", name: "Oppfølgingskonsultasjon", price: 990, priceLabel: "990 kr" },
              { _type: "object", _key: "gi3", name: "Celleprøve (Pap-prøve)", price: 890, priceLabel: "890 kr" },
              { _type: "object", _key: "gi4", name: "HPV-test", price: 790, priceLabel: "790 kr" },
              { _type: "object", _key: "gi5", name: "Gynekologisk ultralyd", price: 1290, priceLabel: "1.290 kr" },
              { _type: "object", _key: "gi6", name: "Ultralyd med konsultasjon", price: 1890, priceLabel: "1.890 kr" },
              { _type: "object", _key: "gi7", name: "P-stav innsetting", price: 1890, priceLabel: "1.890 kr" },
              { _type: "object", _key: "gi8", name: "Hormonspiral innsetting", price: 2490, priceLabel: "2.490 kr" },
              { _type: "object", _key: "gi9", name: "Prevensjonsrådgivning", price: 990, priceLabel: "990 kr" },
            ],
          },
          {
            _type: "object", _key: "pc-fert",
            categoryName: "Fertilitet",
            category: { _type: "reference", _ref: "category-fertilitet" },
            items: [
              { _type: "object", _key: "fi1", name: "Fertilitetsutredning par", price: 3990, priceLabel: "3.990 kr" },
              { _type: "object", _key: "fi2", name: "Fertilitetsutredning single", price: 2490, priceLabel: "2.490 kr" },
              { _type: "object", _key: "fi3", name: "Sædanalyse", price: 1290, priceLabel: "1.290 kr" },
              { _type: "object", _key: "fi4", name: "IVF-behandling", price: 35000, priceLabel: "Fra 35.000 kr" },
              { _type: "object", _key: "fi5", name: "ICSI-behandling", price: 42000, priceLabel: "Fra 42.000 kr" },
              { _type: "object", _key: "fi6", name: "Inseminasjon (IUI)", price: 8900, priceLabel: "Fra 8.900 kr" },
              { _type: "object", _key: "fi7", name: "Nedfrysing av egg", price: 28000, priceLabel: "Fra 28.000 kr" },
            ],
          },
          {
            _type: "object", _key: "pc-uro",
            categoryName: "Urologi",
            category: { _type: "reference", _ref: "category-urologi" },
            items: [
              { _type: "object", _key: "ui1", name: "Urologisk konsultasjon", price: 1490, priceLabel: "1.490 kr" },
              { _type: "object", _key: "ui2", name: "Oppfølging", price: 990, priceLabel: "990 kr" },
              { _type: "object", _key: "ui3", name: "Prostataundersøkelse", price: 1690, priceLabel: "1.690 kr", note: "Inkluderer PSA-test" },
              { _type: "object", _key: "ui4", name: "PSA-test", price: 590, priceLabel: "590 kr" },
              { _type: "object", _key: "ui5", name: "Testosterontest", price: 790, priceLabel: "790 kr" },
            ],
          },
        ],
        insuranceNote: "De fleste av våre behandlinger dekkes av helseforsikring. Vi har avtale med alle store forsikringsselskaper i Norge.",
        seo: {
          _type: "seo",
          metaTitle: "Prisliste | CMedical – Transparent prising",
          metaDescription: "Oversikt over priser for gynekologi, fertilitet, urologi og ortopedi hos CMedical. Ingen skjulte kostnader.",
        },
      },
    },
    // Insurance Page
    {
      createOrReplace: {
        _id: "insurancePage",
        _type: "insurancePage",
        title: "Helseforsikring",
        introText: "Bruk forsikringen din til raskere behandling hos oss",
        ...(pageImageRefs.insurancePage ? { heroImage: pageImageRefs.insurancePage } : {}),
        partners: ["EuroAccident", "Falck", "Fremtind", "Gjensidige", "If", "Storebrand", "Tryg"],
        steps: [
          { _type: "object", _key: "is1", title: "Få henvisning", description: "Fra fastlege eller spesialist" },
          { _type: "object", _key: "is2", title: "Send til forsikring", description: "For godkjenning av dekning" },
          { _type: "object", _key: "is3", title: "Velg CMedical", description: "Be om behandling hos oss" },
          { _type: "object", _key: "is4", title: "Bestill time", description: "Vi fakturerer forsikringen direkte" },
        ],
        benefits: [
          { _type: "object", _key: "ib1", title: "Ingen utlegg", description: "Du slipper å betale selv – vi sender faktura direkte til forsikringsselskapet." },
          { _type: "object", _key: "ib2", title: "Raskere behandling", description: "Få time innen kort tid med kort ventetid hos våre spesialister." },
          { _type: "object", _key: "ib3", title: "Alle forsikringer", description: "Vi har avtale med alle store forsikringsselskaper i Norge." },
        ],
        seo: {
          _type: "seo",
          metaTitle: "Forsikring | CMedical – Behandling med forsikring",
          metaDescription: "Bruk helseforsikringen din hos CMedical. Vi har avtale med alle store forsikringsselskaper. Ingen utlegg.",
        },
      },
    },
    // Services Page
    {
      createOrReplace: {
        _id: "servicesPage",
        _type: "servicesPage",
        title: "Tjenester",
        introText: "Finn behandlingen som passer for deg – ingen henvisning nødvendig",
        ...(pageImageRefs.servicesPage ? { heroImage: pageImageRefs.servicesPage } : {}),
        categories: [
          { _type: "reference", _ref: "category-gynekologi", _key: "sp1" },
          { _type: "reference", _ref: "category-fertilitet", _key: "sp2" },
          { _type: "reference", _ref: "category-urologi", _key: "sp3" },
          { _type: "reference", _ref: "category-ortopedi", _key: "sp4" },
          { _type: "reference", _ref: "category-flere-fagomrader", _key: "sp5" },
        ],
        seo: {
          _type: "seo",
          metaTitle: "Tjenester | CMedical",
          metaDescription: "Oversikt over alle tjenester og fagområder hos CMedical – gynekologi, fertilitet, urologi, ortopedi og mer.",
        },
      },
    },
  ];
}

// ============================================================
// CLINICS — from Sanity production data
// ============================================================
const clinicsData = [
  {
    _id: "clinic-majorstuen",
    title: "Majorstuen (Oslo)",
    address: "Sørkedalsveien 10 A og B",
    phone: "22600050",
    email: "majorstuen@cmedical.no",
    hours: "08:00 - 20:00",
    description: "Adresse: Sørkedalsveien 10 A og B.",
  },
  {
    _id: "clinic-bekkestua",
    title: "Bekkestua",
    address: "Bærumsveien 205",
    phone: "+47 22 60 00 50",
    email: "bekkestua@cmedical.no",
    hours: "Ukedager 08–16:00",
    description: "Våre spesialister setter sin spisskompetanse sammen for å forstå hele bildet, og gi deg en helhetlig behandling.",
  },
  {
    _id: "clinic-moss",
    title: "Moss",
    address: "Lilleengveien 8, 1523 Moss",
    phone: "69254000",
    email: "post@colosseumfaust.no",
    hours: "08:00-16:00",
    description: "Time kan enkelt bestilles online. Du trenger ikke henvisning for å bestille time, og din helseforsikring kan brukes hos oss.",
  },
  {
    _id: "clinic-ski",
    title: "Ski",
    address: "Jernbaneveien 6A",
    phone: "22600050",
    hours: "08-16:00",
    description: "Midlertidig stengt.",
  },
  {
    _id: "clinic-moelv",
    title: "Moelv",
    address: "Møllergata 18",
    phone: "+47 90 61 15 60",
    email: "moelv@cmedical.no",
    hours: "08:00 - 16:00",
    description: "Vi har helt nye lokaler i sentrum av Moelv, med flere operasjonsstuer.",
  },
];

function buildClinicDocs(): Mutation[] {
  return clinicsData.map((clinic) => ({
    createOrReplace: {
      _id: clinic._id,
      _type: "clinicPage",
      title: clinic.title,
      slug: { _type: "slug", current: slug(clinic.title) },
      address: clinic.address,
      phone: clinic.phone,
      ...(clinic.email ? { email: clinic.email } : {}),
      hours: clinic.hours,
      description: clinic.description,
    },
  }));
}

// ============================================================
// ARTICLES (Norwegian only)
// ============================================================
const articlesData: Array<{ _id: string; title: string; slug: string; category: string; image: string; alt?: string; body?: any[] }> = [
  {
    _id: "article-prisliste-psykologspesialist", title: "Prisliste for psykologspesialist", slug: "prisliste-for-psykologspesialist", category: "prisliste", image: "articles/psykologspesialist.png",
    body: [
      { _key: "84c2415a5ec6", _type: "block", children: [{ _key: "00eab739afbe0", _type: "span", marks: ["strong"], text: "Psykologspesialist" }], markDefs: [], style: "h2" },
      { _key: "115306c61d7f", _type: "block", children: [{ _key: "9f1e0b7ec5310", _type: "span", marks: [], text: "Konsultasjon 60 min – kroner 1.900" }], markDefs: [], style: "normal" },
    ],
  },
  {
    _id: "article-prisliste-sexolog", title: "Prisliste for sexolog", slug: "prisliste-for-sexolog", category: "prisliste", image: "articles/sexolog.jpg",
    body: [
      { _key: "7cc5330ef3a2", _type: "block", children: [{ _key: "30a7f1ebd20c0", _type: "span", marks: ["strong"], text: "Sexolog" }], markDefs: [], style: "h2" },
      { _key: "a9cb571f7f8b", _type: "block", children: [{ _key: "166690990c2f0", _type: "span", marks: [], text: "Konsultasjon – fra kroner 1.600" }], markDefs: [], style: "normal" },
    ],
  },
  {
    _id: "article-prisliste-ernaeringsfysiolog", title: "Prisliste for ernæringsfysiolog", slug: "prisliste-for-ernaeringsfysiolog", category: "prisliste", image: "articles/ernaeringsfysiolog.jpg",
    body: [
      { _key: "144df222ea97", _type: "block", children: [{ _key: "405a91f000570", _type: "span", marks: ["strong"], text: "Ernæringsfysiolog" }], markDefs: [], style: "h2" },
      { _key: "fd1e433b593f", _type: "block", children: [{ _key: "0b44ae26c2a90", _type: "span", marks: [], text: "Konsultasjon 45 min - kroner 1.490" }], markDefs: [], style: "normal" },
      { _key: "c3501c552118", _type: "block", children: [{ _key: "346f5474f75d", _type: "span", marks: [], text: "Konsultasjon 60 min - kroner 1.990" }], markDefs: [], style: "normal" },
    ],
  },
  {
    _id: "article-prisliste-urologi", title: "Prisliste for urologi", slug: "prisliste-for-urologi", category: "prisliste", image: "articles/urologi.jpg", alt: "Mann på kjøkkenet med avis",
    body: [
      { _key: "ba302e9e0852", _type: "block", children: [{ _key: "465daf55778b0", _type: "span", marks: ["strong"], text: "Urologi" }], markDefs: [], style: "h2" },
      { _key: "470ef17877ae", _type: "block", children: [{ _key: "9b1be0764e160", _type: "span", marks: [], text: "Konsultasjon 30 min – fra kroner 1.900" }], markDefs: [], style: "normal" },
      { _key: "c913eaae72fe", _type: "block", children: [{ _key: "221c53e603f50", _type: "span", marks: [], text: "Konsultasjon 60 minutter – fra kroner 2.750" }], markDefs: [], style: "normal" },
      { _key: "cd4a248cc893", _type: "block", children: [{ _key: "edf2469a6e870", _type: "span", marks: [], text: "Fimose (trang forhud) – fra kroner 9.100" }], markDefs: [], style: "normal" },
      { _key: "d074d571d9bb", _type: "block", children: [{ _key: "5c12abb3b7890", _type: "span", marks: [], text: "Sterilisering (inkl. sædanalyse etter 3 måneder) – kroner 6.500" }], markDefs: [], style: "normal" },
      { _key: "900e61770900", _type: "block", children: [{ _key: "4abab397e9b80", _type: "span", marks: [], text: "Sædanalyse (ikke infertilitetsutredning) – kroner 800" }], markDefs: [], style: "normal" },
      { _key: "1c203a56cd25", _type: "block", children: [{ _key: "01615a0ba2180", _type: "span", marks: [], text: "Refertilisering – fra kroner 35.000" }], markDefs: [], style: "normal" },
      { _key: "ab28630c4322", _type: "block", children: [{ _key: "6b97070878540", _type: "span", marks: [], text: "RALP (robotkirurgi prostatakreft) – fra kroner 178.500" }], markDefs: [], style: "normal" },
      { _key: "0c3bb091fd57", _type: "block", children: [{ _key: "d1a71a7d90580", _type: "span", marks: [], text: "RASP (robotkirurgi godartet prostatforstørrelse) – fra kroner 178.500" }], markDefs: [], style: "normal" },
      { _key: "9f9e44927eb0", _type: "block", children: [{ _key: "a159ddb86d170", _type: "span", marks: [], text: "TUR-P (inklusiv overnatting) – fra kroner 75.000" }], markDefs: [], style: "normal" },
      { _key: "5a7e577488d0", _type: "block", children: [{ _key: "7a02ab61b3340", _type: "span", marks: [], text: "Core Therm (mikrobølge varmebehandling) – fra kroner 49.300" }], markDefs: [], style: "normal" },
      { _key: "741fd1cc283a", _type: "block", children: [{ _key: "1f6dc336ecd70", _type: "span", marks: ["em"], text: "Det kan tilkomme undersøkelser i tillegg til konsultasjon. Vennligst ta kontakt på telefon eller epost." }], markDefs: [], style: "normal" },
    ],
  },
  {
    _id: "article-prisliste-gastroenterolog", title: "Prisliste for gastroenterolog/generell kirurgi", slug: "prisliste-for-gastroenterolog-generell-kirurgi", category: "prisliste", image: "articles/gastroenterolog.png",
    body: [
      { _key: "1882f256347d", _type: "block", children: [{ _key: "075d8e6ed7730", _type: "span", marks: ["strong"], text: "Gastroenterolog/generell kirurgi" }], markDefs: [], style: "h2" },
      { _key: "28bfbdb198fc", _type: "block", children: [{ _key: "0586f0411d540", _type: "span", marks: [], text: "Konsultasjon 30 min (kun samtale) – kroner 2.100" }], markDefs: [], style: "normal" },
      { _key: "aa89cab7d1aa", _type: "block", children: [{ _key: "e1a0f55481f30", _type: "span", marks: [], text: "Anorektoskopi inkl. konsultasjon – kroner 4.700" }], markDefs: [], style: "normal" },
      { _key: "450d5b5b0c11", _type: "block", children: [{ _key: "bd0f0c2adc940", _type: "span", marks: [], text: "Tillegg strikkbehandling (ved endetarmsundersøkelse) – kroner 1.500" }], markDefs: [], style: "normal" },
      { _key: "662d0c524cea", _type: "block", children: [{ _key: "5191cbe64d020", _type: "span", marks: [], text: "Mariskfjerning i lokal – fra kroner 7.200" }], markDefs: [], style: "normal" },
      { _key: "3a79dfac3c81", _type: "block", children: [{ _key: "6ee3383d71a30", _type: "span", marks: [], text: "Botox for analfissur – kroner 5.200" }], markDefs: [], style: "normal" },
      { _key: "f88587c2bb23", _type: "block", children: [{ _key: "4ba4ce3745480", _type: "span", marks: [], text: "Småkirurgi i lokal (Fjerning av fettkul, føflekk) – fra kroner 5.000" }], markDefs: [], style: "normal" },
      { _key: "6f5aca610b96", _type: "block", children: [{ _key: "8e0399631adf0", _type: "span", marks: [], text: "Inngrodd tånegl – fra kroner 5.150" }], markDefs: [], style: "normal" },
      { _key: "2fa1af007900", _type: "block", children: [{ _key: "daf5a168a1f00", _type: "span", marks: [], text: "Hemorideoperasjon – fra kroner 28.000" }], markDefs: [], style: "normal" },
      { _key: "61148cca93bb", _type: "block", children: [{ _key: "d4e4ab4cd80b0", _type: "span", marks: [], text: "Lyskebrokk kikkhullsoperasjon – fra kroner 45.000" }], markDefs: [], style: "normal" },
      { _key: "84dc9e3e94fa", _type: "block", children: [{ _key: "f75cb3c977db0", _type: "span", marks: [], text: "Navlebrokk kikkhullsoperasjon – fra kroner 45.000" }], markDefs: [], style: "normal" },
    ],
  },
  {
    _id: "article-prostataundersokelse", title: "Hvordan foregår en prostataundersøkelse?", slug: "hvordan-foregar-en-prostataundersokelse", category: "fagartikkel", image: "articles/prostataundersokelse.jpg",
    body: [
      { _key: "0adb59fcf7e4", _type: "block", children: [{ _key: "4b7bd135d11d", _type: "span", marks: ["strong"], text: "Urolog Trond Jørgensen svarer:" }], markDefs: [], style: "h2" },
      { _key: "815da5a73545", _type: "block", children: [{ _key: "a886ef5c7a250", _type: "span", marks: [], text: "\"Hadde alle menn vært flinkere til å gå til legen ville de fleste tilfeller av alvorlig prostatakreft vært avverget.\" Vår urolog Trond Jørgensen er tydelig på at jevnlig prostataundersøkelse er svært viktig. Men hvordan foregår en prostataundersøkelse? Når bør man begynne og hvor ofte bør man sjekke prostata?" }], markDefs: [], style: "normal" },
      { _key: "e2bebbfd08d5", _type: "block", children: [{ _key: "a2e19fb33d1d0", _type: "span", marks: [], text: "Dr. Jørgensen har den rette kompetansen for å svare på alle dine spørsmål om prostataundersøkelser. Han er spesialist innen kirurgi og urologi. Han har lang forskningsbakgrunn med flere publiserte internasjonale artikler bak seg, samt en doktorgrad innen prostatakreft. De siste 15 årene har han praktisert som privat urolog." }], markDefs: [], style: "normal" },
      { _key: "6edae15b9cfe", _type: "block", children: [{ _key: "bf482c123cb70", _type: "span", marks: ["strong"], text: "Her har vi samlet de mest hyppig stilte spørsmålene rundt prostatasjekk, slik at du enkelt kan lese deg opp på det du måtte lure på." }], markDefs: [], style: "normal" },
      { _key: "0858eaee6c0e", _type: "block", children: [{ _key: "55cd331eb6c00", _type: "span", marks: ["strong"], text: "Hva er prostataundersøkelse?" }], markDefs: [], style: "h2" },
      { _key: "b536766d4434", _type: "block", children: [{ _key: "9b76639f71c90", _type: "span", marks: [], text: "Prostataundersøkelse er en helsesjekk som gjør det mulig å oppdage prostatakreft tidlig. Årlig prostatasjekk er veldig viktig for menn i en viss alder eller menn som er i risikogrupper. Prostatakreft gir ofte ikke symptomer, selv om enkelte kan oppleve problemer med hyppig vannlating og svak stråle. Andre plager kan også oppdages under undersøkelsene." }], markDefs: [], style: "normal" },
      { _key: "0ba026ee0475", _type: "block", children: [{ _key: "c2853930dd5d0", _type: "span", marks: [], text: "\"Det diagnostiseres omtrent 5000 nye tilfeller av prostatakreft hvert eneste år. I Norge lever omtrent 55000 menn med diagnosen prostatakreft. I underkant av 1000 menn dør av prostatakreft i Norge hvert eneste år\", forteller dr. Jørgensen. Tidlig diagnostisering er viktig for gode prognoser. Flere nøkkeltall for prostatakreft finner du på " }, { _key: "e643fcccca59", _type: "span", marks: ["c59f7af80380"], text: "Kreftregisteret" }, { _key: "35c235df17c0", _type: "span", marks: [], text: "." }], markDefs: [{ _key: "c59f7af80380", _type: "link", href: "https://www.kreftregisteret.no/Temasider/kreftformer/Prostatakreft/" }], style: "normal" },
      { _key: "d160e10ce00b", _type: "block", children: [{ _key: "a1b7adc4fe930", _type: "span", marks: ["strong"], text: "Når skal man begynne å sjekke prostata? Hvor ofte bør man sjekke prostata?" }], markDefs: [], style: "h2" },
      { _key: "0b08454a97ba", _type: "block", children: [{ _key: "bb5fc15189d20", _type: "span", marks: [], text: "\"Jeg anbefaler alle menn i 50-årsalderen å ta en PSA-test hvert år. Menn under 50 år som tilhører en risikogruppe bør også ha sjekke prostata jevnlig\", oppfordrer dr. Jørgensen. \"Med risikogrupper mener jeg menn som har ett eller flere tilfeller av prostatakreft i familien. Risikogrupper inkluderer også menn som har kvinnelige slektninger med tilfeller av brystkreft eller eggstokkreft i ung alder.\"" }], markDefs: [], style: "normal" },
      { _key: "5e8ee8d5a263", _type: "block", children: [{ _key: "ffe15eea772b0", _type: "span", marks: [], text: "Han er tydelig på at jevnlig prostatakontroll og sjekk av PSA-verdier er viktig i kampen mot prostatakreft. Grunnet mye oppmerksomhet rundt prostatakreft de senere år, oppdages de fleste prostatakrefttilfellene i dag i et tidlig stadium. Derfor har de fleste menn ikke nevneverdige symptomer som kan lede en frem til diagnosen." }], markDefs: [], style: "normal" },
      { _key: "615ea326ff8a", _type: "block", children: [{ _key: "d00ded6639ef0", _type: "span", marks: [], text: "\"Det er 12,5 % sannsynlighet for at en mann får diagnosen prostatakreft frem til han er 75 år, med andre ord vil mer enn 1 av 10 menn få diagnosen før eller siden i sitt voksne liv. Risikoen øker med alder, men menn ned i 40-årsalder får diagnosen hvert eneste år\", forteller dr. Jørgensen." }], markDefs: [], style: "normal" },
      { _key: "a0e69a068d2e", _type: "block", children: [{ _key: "529dfa6bbf150", _type: "span", marks: ["strong"], text: "Sjekkes prostata kun for utredning av prostatakreft?" }], markDefs: [], style: "h2" },
      { _key: "bfe606cdd84a", _type: "block", children: [{ _key: "3d6e2d81601c0", _type: "span", marks: [], text: "Mange forbinder prostataundersøkelser med utredning av prostatakreft. Det finnes imidlertid andre plager som kan oppstå også. En av disse plagene er prostatitt, det vil si infeksjon og betennelser av prostatakjertelen. Prostatitt kan ramme menn i alle aldre, men er mest vanlig blant menn i alderen 30-50 år." }], markDefs: [], style: "normal" },
      { _key: "ff72792d3ed5", _type: "block", children: [{ _key: "3ca2ca8f62f90", _type: "span", marks: [], text: "Det er viktig å presisere at forstørret prostata kan også være godartet. Det har i så fall " }, { _key: "3ca2ca8f62f91", _type: "span", marks: ["em"], text: "ikke" }, { _key: "3ca2ca8f62f92", _type: "span", marks: [], text: " noe med prostatakreft å gjøre. Prostatakjertelen kan bli større i løpet av årene og begynne å presse mot urinrøret. Det kan igjen føre til hyppig vannlating og dårlig nattesøvn, noe som etter hvert kan bli svært plagsomt i hverdagen." }], markDefs: [], style: "normal" },
      { _key: "be43b733f63d", _type: "block", children: [{ _key: "6118028047270", _type: "span", marks: [], text: "\"Det er veldig vanlig at prostata forstørres hos menn over 50 år\", forteller urolog Trond Jørgensen. Det er heldigvis god hjelp å få for forstørret prostata, dersom du opplever plager i hverdagen. Behandling er både enkel og smertefri. Du trenger derfor ikke å leve med plagene." }], markDefs: [], style: "normal" },
      { _key: "3522bc688e72", _type: "block", children: [{ _key: "90f7a9b9bf160", _type: "span", marks: ["strong"], text: "Hva skal verdiene være på prostata?" }], markDefs: [], style: "h2" },
      { _key: "99b1b0c2005b", _type: "block", children: [{ _key: "a817fe0274ca0", _type: "span", marks: [], text: "Mange kan helt naturlig ha høyere eller lavere verdier enn gjennomsnittet. Det betyr at PSA-blodprøven kan vise høye verdier, uten at det nødvendigvis betyr at du har prostatakreft. På samme måte kan verdiene være lave, samtidig som man har prostatakreft. Full utredning og sjekk av prostata er nødvendig for å kunne si noe sikkert, forklarer dr. Jørgensen:" }], markDefs: [], style: "normal" },
      { _key: "78c829d163ff", _type: "block", children: [{ _key: "6b8b81d32f6d0", _type: "span", marks: [], text: "\"Blodprøve alene er ikke nok, selv om du senere kan overvåke prostata ved hjelp av én blodprøve i året. Dersom du er over 50 år eller er i risikogruppen, bør du ha en full prostatasjekk årlig. En prostataundersøkelse inkluderer både PSA-blodprøve, ultralyd av prostata og klinisk undersøkelse.\"" }], markDefs: [], style: "normal" },
      { _key: "56d3e6c9afd2", _type: "block", children: [{ _key: "db24e3c4600c0", _type: "span", marks: [], text: "Man må følge med på PSA-verdiene over tid og sammenligne med tidligere funn. Øker PSA-verdiene ved fremtidige blodprøver, så kan det være tegn på prostatakreft, forstørret prostata eller betennelser i prostatakjertelen. I slike tilfeller er det nødvendig med videre utredning." }], markDefs: [], style: "normal" },
      { _key: "a880642c5c04", _type: "block", children: [{ _key: "9397b5f48b210", _type: "span", marks: ["strong"], text: "Hvordan foregår en prostataundersøkelse?" }], markDefs: [], style: "h2" },
      { _key: "973be995890e", _type: "block", children: [{ _key: "23b56422d06c0", _type: "span", marks: [], text: "En prostataundersøkelse består av PSA-blodprøve og ultralyd av prostata. Det er også nødvendig å kjenne på prostata gjennom endetarmen. Denne undersøkelsen kalles også for rektal prostataeksaminasjon (DRE). Legen eller urologen kjenner etter følgende:" }], markDefs: [], style: "normal" },
      { _key: "df008f5fb4d9", _type: "block", children: [{ _key: "d9f6658451b30", _type: "span", marks: [], text: "Knudrete prostatakjertel" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" },
      { _key: "b567368244c4", _type: "block", children: [{ _key: "04a5e7d6b1ad0", _type: "span", marks: [], text: "Asymmetri" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" },
      { _key: "fde8d823832b", _type: "block", children: [{ _key: "f1fcad75a7cb0", _type: "span", marks: [], text: "Uregelmessigheter i prostatakjertel" }], level: 1, listItem: "bullet", markDefs: [], style: "normal" },
      { _key: "36689791de7b", _type: "block", children: [{ _key: "398001be5bf40", _type: "span", marks: [], text: "Det er mulig å få gjennomført prostataundersøkelser hos fastlegen. Stadig flere menn velger imidlertid å oppsøke privat urolog direkte for å sjekke prostata og stille spørsmål rundt prostatakreft. Dersom årlig prostatasjekk gir indikasjon på prostatakreft, forstørret prostata eller betennelser er det nødvendig med videre undersøkelser." }], markDefs: [], style: "normal" },
      { _key: "01c17f5c3ea4", _type: "block", children: [{ _key: "27a42f1117530", _type: "span", marks: ["strong"], text: "Hvor kan jeg bestille prostataundersøkelse og hva koster prostatasjekk?" }], markDefs: [], style: "h2" },
      { _key: "5c11dfc47474", _type: "block", children: [{ _key: "6ed7241e448c0", _type: "span", marks: [], text: "Veiledende priser for en privat urologisk konsultasjon hos C-Medical er 1700 kr og opp. Privat prostataundersøkelse og PSA-utredning koster kr 3350 kr. C-Medical er en av Skandinavias ledende tilbydere av spesialisthelsetjenester innen blant annet urologi, gynekologi og ortopedi." }], markDefs: [], style: "normal" },
      { _key: "ac7080a6e2ff", _type: "block", children: [{ _key: "1977fd483dca0", _type: "span", marks: ["strong"], text: "Vi tilbyr prostataundersøkelser privat ved våre klinikker i Oslo (Majorstuen), Stavanger og på Moelv." }], markDefs: [], style: "normal" },
    ],
  },
  {
    _id: "article-prisliste-osteopat-fysioterapeut", title: "Prisliste for osteopat/fysioterapeut", slug: "prisliste-for-osteopat-fysioterapeut", category: "prisliste", image: "articles/osteopat-fysioterapeut.png",
    body: [
      { _key: "20e93a993caf", _type: "block", children: [{ _key: "3ed8cad3abde0", _type: "span", marks: ["strong"], text: "Osteopat/fysioterapeut" }], markDefs: [], style: "h2" },
      { _key: "ae1a342df752", _type: "block", children: [{ _key: "d4a052cd6ef10", _type: "span", marks: [], text: "Førstegangskonsultasjon 60 min – kroner 1.300" }], markDefs: [], style: "normal" },
      { _key: "5bf8bc9bed88", _type: "block", children: [{ _key: "9edcaa91b65e0", _type: "span", marks: [], text: "Konsultasjon 60 min – kroner 1.670" }], markDefs: [], style: "normal" },
      { _key: "ab59a316b01c", _type: "block", children: [{ _key: "55a9b4527d530", _type: "span", marks: [], text: "Oppfølging 30 min – kroner 890" }], markDefs: [], style: "normal" },
    ],
  },
  {
    _id: "article-prisliste-gynekologi", title: "Prisliste for gynekologi", slug: "prisliste-for-gynekologi", category: "prisliste", image: "articles/gynekologi.jpg",
    body: [
      { _key: "ac87e840bf87", _type: "block", children: [{ _key: "c6d3446e34a70", _type: "span", marks: ["strong"], text: "Gynekologi" }], markDefs: [], style: "h2" },
      { _key: "681d10b45569", _type: "block", children: [{ _key: "a1152e15cd660", _type: "span", marks: [], text: "Konsultasjon 30 minutter – fra kroner 2.150" }], markDefs: [], style: "normal" },
      { _key: "ee71f44e165a", _type: "block", children: [{ _key: "973fdc5e8816", _type: "span", marks: [], text: "Tidlig ultralyd - fra kroner 1.900" }], markDefs: [], style: "normal" },
      { _key: "cc943d156cf9", _type: "block", children: [{ _key: "09a5ce335aee", _type: "span", marks: [], text: "NIPT-test - fra kroner 9.800" }], markDefs: [], style: "normal" },
      { _key: "3a2d2220af90", _type: "block", children: [{ _key: "70212f146de50", _type: "span", marks: [], text: "TVT operasjon – fra kroner 37.500" }], markDefs: [], style: "normal" },
      { _key: "b76c1ea2b51c", _type: "block", children: [{ _key: "92e5edfc2ee50", _type: "span", marks: [], text: "Fremfallsoperasjon – fra kroner 37.500" }], markDefs: [], style: "normal" },
      { _key: "cf03af65f19b", _type: "block", children: [{ _key: "b2475de5c5500", _type: "span", marks: [], text: "Konisering – fra kroner 10.500" }], markDefs: [], style: "normal" },
      { _key: "8b90e409a78e", _type: "block", children: [{ _key: "ccb2287203260", _type: "span", marks: [], text: "Botox blære – fra kroner 12.900" }], markDefs: [], style: "normal" },
      { _key: "102f699c361a", _type: "block", children: [{ _key: "bd4e3c6148430", _type: "span", marks: [], text: "Sexolog 45 minutter – fra kroner 1.400" }], markDefs: [], style: "normal" },
      { _key: "6a18b1f91b5a", _type: "block", children: [{ _key: "a00b23b96fc00", _type: "span", marks: [], text: "Sexolog 60 minutter – fra kroner 1.600" }], markDefs: [], style: "normal" },
      { _key: "c00fcc7e1f37", _type: "block", children: [{ _key: "9393615f3d030", _type: "span", marks: ["em"], text: "For andre priser, vennligst ta kontakt på telefon eller epost." }], markDefs: [], style: "normal" },
    ],
  },
  {
    _id: "article-la-deg-operere-i-norge", title: "La deg operere i Norge!", slug: "la-deg-operere-i-norge", category: "fagartikkel", image: "articles/urologi.jpg",
    body: [
      { _key: "530a571a9f77", _type: "block", children: [{ _key: "153c3bbf18c20", _type: "span", marks: [], text: "Gard Lauvsnes i CMedical har ett budskap til menn med prostatakreft: La deg operere i Norge!" }], markDefs: [], style: "normal" },
      { _key: "16634c34c401", _type: "block", children: [{ _key: "166aa1bb720e0", _type: "span", marks: [], text: "– Norge har topp ekspertise, risikoen for infeksjoner av multiresistente bakterier er minimal og du er sikret oppfølging i etter- kant, sier Lauvsnes, og legger raskt til: – Du får ikke erstatning fra Norsk pasientskadeerstatning ved skader som skjer i utlandet." }], markDefs: [], style: "normal" },
      { _key: "9d301b2d9cd0", _type: "block", children: [{ _key: "b5d30bed9ea30", _type: "span", marks: [], text: "Naturlig nok er menn med prostatakreftdiagnose utålmodige etter å få behandling. Ikke bare god behandling, men den beste som er å oppdrive. Bak vaker redselen for varig inkontinens og ereksjonssvikt om ikke kirurgen er stø på hånda. Et liten unøyaktighet i prostatakjertelens fine nett av nerver kan nemlig få følger som oppleves katastrofale." }], markDefs: [], style: "normal" },
      { _key: "c657fb774bc2", _type: "block", children: [{ _key: "b5cd14ef72640", _type: "span", marks: [], text: "Tidligere reiste de fleste menn med prostatakreft utenlands, vel og merke de som hadde forsikring og de som valgte å betale selv. Det skyldtes at de offisielle tallene om inkontinens og ereksjons- svikt var langt dårligere i Norge enn for eksempel klinikker i Tyskland og i USA." }], markDefs: [], style: "normal" },
      { _key: "cc966a0dedc2", _type: "block", children: [{ _key: "cae5fccbcb750", _type: "span", marks: [], text: "– Statistikk kan brukes på forskjellig måter, og i Norge er det ikke publisert data som gjør at de kan sammenliknes med tallene fra USA og Tyskland. Det som er viktig for gode resultater er at kirurgen har lang erfaring og operer jevnlig. Det har vi på flere sykehus i Norge." }], markDefs: [], style: "normal" },
      { _key: "a7b3cb8968d6", _type: "block", children: [{ _key: "db350aa1a5b20", _type: "span", marks: ["strong"], text: "Opererer med robotteknologi\n" }, { _key: "9716a886be50", _type: "span", marks: [], text: "Lauvsnes er en av gründerne bak Colosseum Mann klinikken. Han har selv hatt prostatakreft og har kjent på kroppen hva god behandling og oppfølging betyr for livskvaliteten." }], markDefs: [], style: "normal" },
      { _key: "0740e4439b8b", _type: "block", children: [{ _key: "ccf47998ecd90", _type: "span", marks: [], text: "– Vår klinikk er spesialister på menns helse. Målet vårt er å hjelpe flest mulig, sier han.\nMed robotteknologi og kikkehullsteknikk får pasienten mindre kirurgiske sår og dermed mindre postoperativt ubehag enn ved åpen kirurgi. Roboten er koblet direkte til instrumentene som er ført inn i pasienten, og styres via joystick av kirurgen." }], markDefs: [], style: "normal" },
      { _key: "b435550e1d12", _type: "block", children: [{ _key: "978071d8d9260", _type: "span", marks: [], text: "– Fordelen er at robotarmene aldri skjelver, som jo kan skje med en menneskehånd. Resultatet er kortere restitusjonsperiode og bedre resultater når det gjelder nerveskader og inkontinens." }], markDefs: [], style: "normal" },
      { _key: "a34c0663573b", _type: "block", children: [{ _key: "97655322a9c20", _type: "span", marks: ["strong"], text: "Topp ekspertise\n" }, { _key: "d462274c32f80", _type: "span", marks: [], text: "Ifølge Lauvsnes er kirurgene hos Colosseum Mann blant Norges mest erfarende på området og opprettholder sin faglige ekspertise nettopp fordi de opererer ofte. – Flere sykehus opererer i dag med robotteknologi, men Colosseum Mann er det eneste private sykeshuset i Norge som bruker robotteknologien, sier gründeren. Colosseum Mann skal fortsette å tilby menn forskningsbasert utredning og behandling av prostatakreft." }], markDefs: [], style: "normal" },
    ],
  },
  { _id: "article-robotkirurgi-prostatakreft", title: "Vi tar opp kampen mot prostatakreft med robotkirurgi", slug: "vi-tar-opp-kampen-mot-prostatakreft-med-robotkirurgi", category: "fagartikkel", image: "articles/urologi.jpg" },
  { _id: "article-stillingsutlysning", title: "Operasjonssykepleier og anestesisykepleier", slug: "operasjonssykepleier-og-anestesisykepleier", category: "stillingsutlysning", image: "articles/karkirurgi.jpg", alt: "Stillingsutlysning" },
  {
    _id: "article-prisliste-privatbetalende", title: "Prisliste for privatbetalende", slug: "prisliste-for-privatbetalende", category: "prisliste", image: "articles/privatbetalende.jpg",
    body: [
      { _key: "d2094fc981bb", _type: "block", children: [{ _key: "885d5e1cdf7c", _type: "span", marks: [], text: "Se priser nedenfor. " }], markDefs: [], style: "h2" },
      { _key: "587764698660", _type: "block", children: [{ _key: "47860b5101b7", _type: "span", marks: ["em"], text: "*Vi forbeholder oss retten til å gjøre endringer i prisene. Du kan alltids kontakte oss om du lurer på noe." }], markDefs: [], style: "normal" },
      { _key: "2e06c6d19907", _type: "block", children: [{ _key: "fa4ecde63b88", _type: "span", marks: ["em"], text: "Sist endret 16.01.2024" }], markDefs: [], style: "normal" },
    ],
  },
  {
    _id: "article-prisliste-revmatolog", title: "Prisliste for revmatolog", slug: "prisliste-for-revmatolog", category: "prisliste", image: "articles/revmatolog.png",
    body: [
      { _key: "8b74e9bee84d", _type: "block", children: [{ _key: "db9b3b25cb230", _type: "span", marks: ["strong"], text: "Revmatolog" }], markDefs: [], style: "h2" },
      { _key: "3634ae0d76ed", _type: "block", children: [{ _key: "eb1d6cb3c1980", _type: "span", marks: [], text: "Konsultasjon – fra kroner 3.150" }], markDefs: [], style: "normal" },
    ],
  },
  { _id: "article-prisliste-karkirurgi", title: "Prisliste for karkirurgi", slug: "prisliste-for-karkirurgi", category: "prisliste", image: "articles/karkirurgi.jpg" },
  {
    _id: "article-prisliste-fertilitet", title: "Prisliste for fertilitet", slug: "prisliste-for-fertilitet", category: "prisliste", image: "articles/fertilitet.png",
    body: [
      { _key: "0f0277e62e19", _type: "block", children: [{ _key: "f198d761a40a0", _type: "span", marks: [], text: "Medisinkostnader inngår ikke i prislisten for behandlinger, men dekkes av HELFO med refusjon etter dagens regelverk og takster. HELFO-skjema fylles ut av oss og utleveres etter gjennomført behandling. Du kan lese mer om refusjonsordningen her: " }, { _key: "55116f022b9a", _type: "span", marks: ["0d3205c01fbd"], text: "HELFO" }, { _key: "2792ce091e35", _type: "span", marks: [], text: "." }], markDefs: [{ _key: "0d3205c01fbd", _type: "link", href: "https://www.helsenorge.no/refusjon-og-stotteordninger/ufrivillig-barnloshet-og-infertilitetsbehandling" }], style: "normal" },
      { _key: "7b48334bd6b5", _type: "block", children: [{ _key: "69f69aed5c5d", _type: "span", marks: [], text: "For å overvåke embryoer bruker vi RI-Witness System og Embryoscope på alle (med forbehold at det er ledig plass i embryoskopet; deretter prioriterer vi basert på medisinsk indikasjon eller ved største behov). Dette er inkludert i våre priser." }], markDefs: [], style: "normal" },
      { _key: "e180c0374ddc", _type: "block", children: [{ _key: "9e4b8034249c", _type: "span", marks: [], text: "RI-Witness System unngår mismatch ved assistert befruktning og Embyroscope er en time-lapse overvåkning av embryoutvikling." }], markDefs: [], style: "normal" },
      { _key: "e243f4ba9146", _type: "block", children: [{ _key: "06f44ff1e05b", _type: "span", marks: ["em"], text: "*Vi forbeholder oss retten til å gjøre endringer i prisene. Du kan alltids kontakte oss om du lurer på noe." }], markDefs: [], style: "normal" },
      { _key: "c713e1419aa3", _type: "block", children: [{ _key: "3b4f5ba5d8d90", _type: "span", marks: ["em"], text: "Sist endret 02.01.2025" }], markDefs: [], style: "normal" },
    ],
  },
  {
    _id: "article-prisliste-hud", title: "Prisliste for hud", slug: "prisliste-for-hud", category: "prisliste", image: "articles/karkirurgi.jpg",
    body: [
      { _key: "d02fca5f9035", _type: "block", children: [{ _key: "3397c804668b0", _type: "span", marks: ["strong"], text: "Hud" }], markDefs: [], style: "h2" },
      { _key: "a147d79d456f", _type: "block", children: [{ _key: "5c4259670d77", _type: "span", marks: [], text: "Konsultasjon 30 minutter – fra kroner 2.100" }], markDefs: [], style: "normal" },
      { _key: "9153e89906d1", _type: "block", children: [{ _key: "efc8a4b4afd10", _type: "span", marks: [], text: "Acne kontroll (innen 6 måneder) – fra kroner 1.900" }], markDefs: [], style: "normal" },
      { _key: "d6c048aef65b", _type: "block", children: [{ _key: "ce56e80f29470", _type: "span", marks: [], text: "Føflekkfjerning (konsultasjon kommer i tillegg) – fra kroner 1.500" }], markDefs: [], style: "normal" },
      { _key: "40381e9b50cb", _type: "block", children: [{ _key: "ae639ed650150", _type: "span", marks: [], text: "Svettebehandling Botox armhuler – fra kroner 6.900" }], markDefs: [], style: "normal" },
      { _key: "f8d4c7b99c02", _type: "block", children: [{ _key: "2a4570f653210", _type: "span", marks: [], text: "ZO 3-step peel – fra kroner 3.500" }], markDefs: [], style: "normal" },
      { _key: "779a23896522", _type: "block", children: [{ _key: "1a62d70b90a70", _type: "span", marks: [], text: "ZO controlled dept peel(Blue Peel) – fra kroner 12.000" }], markDefs: [], style: "normal" },
      { _key: "eee834056399", _type: "block", children: [{ _key: "95a2f04d014e0", _type: "span", marks: [], text: "Rynkebehandling injeksjon, 1 område – fra kroner 3.750" }], markDefs: [], style: "normal" },
      { _key: "81e94bfceb26", _type: "block", children: [{ _key: "3dc9a712c0ba0", _type: "span", marks: [], text: "Rynkebehandling injeksjon, 2 områder – fra kroner 5.500" }], markDefs: [], style: "normal" },
      { _key: "e78e4465f4a8", _type: "block", children: [{ _key: "907ecb1d35280", _type: "span", marks: [], text: "Rynkebehandling injeksjon, 3 områder – fra kroner 6.400" }], markDefs: [], style: "normal" },
      { _key: "486ed638bbeb", _type: "block", children: [{ _key: "ef5827abf97d0", _type: "span", marks: [], text: "Fillerbehandling Belotero 0,5 ml – fra kroner 2.900" }], markDefs: [], style: "normal" },
      { _key: "5077508e5f07", _type: "block", children: [{ _key: "b1aec13061c60", _type: "span", marks: [], text: "Fillerbehandling Belotero 1,0 ml – fra kroner 4.200" }], markDefs: [], style: "normal" },
      { _key: "7c493cb27257", _type: "block", children: [{ _key: "75f5a5c7ff160", _type: "span", marks: [], text: "Fillerbehandling Belotero skinbooster 2 ml – fra kroner 4.400" }], markDefs: [], style: "normal" },
      { _key: "72fd305ad349", _type: "block", children: [{ _key: "fe0d9f41c14b0", _type: "span", marks: ["em"], text: "Det kan tilkomme kostnader for behandlinger som frysing, skraping, biopsi eller lignende i tillegg til konsultasjon. Vennligst ta kontakt på telefon eller epost.\nResepter innen 6 måneder etter konultasjon er gratis." }], markDefs: [], style: "normal" },
    ],
  },
  {
    _id: "article-prisliste-handterapeut", title: "Prisliste for håndterapeut", slug: "prisliste-for-handterapeut", category: "prisliste", image: "articles/handterapeut.jpg",
    body: [
      { _key: "6c7ae605c0e2", _type: "block", children: [{ _key: "efd7cd05e9190", _type: "span", marks: ["strong"], text: "Håndterapeut" }], markDefs: [], style: "h2" },
      { _key: "4c85e288b515", _type: "block", children: [{ _key: "95ff77339a510", _type: "span", marks: [], text: "Konsultasjon 30 min – fra kroner 850" }], markDefs: [], style: "normal" },
    ],
  },
];

async function buildArticleDocsWithImages(): Promise<Mutation[]> {
  const mutations: Mutation[] = [];
  for (const article of articlesData) {
    const imageRef = await uploadImage(article.image, `article-${article.slug}`);
    mutations.push({
      createOrReplace: {
        _id: article._id,
        _type: "article",
        title: article.title,
        slug: { _type: "slug", current: article.slug },
        category: article.category,
        ...(article.body ? { body: article.body } : {}),
        ...(imageRef ? { primaryImage: { ...imageRef, ...(article.alt ? { alt: article.alt } : {}) } } : {}),
      },
    });
  }
  return mutations;
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log("🚀 Starting Sanity content migration (with images)...");
  console.log(`   Project: ${PROJECT_ID} / Dataset: ${DATASET}\n`);

  // 1. Upload category images and attach to categories
  console.log("🖼️  Uploading category images...");
  for (const cat of treatmentCategories) {
    const imgPath = categoryImages[cat._id];
    if (imgPath) {
      const imageRef = await uploadImage(imgPath, `category-${cat.categoryId}`);
      if (imageRef) {
        (cat as any).heroImage = imageRef;
      }
    }
  }

  // 2. Treatment Categories
  console.log("\n📂 Creating treatment categories...");
  const categoryMutations: Mutation[] = treatmentCategories.map((cat) => ({
    createOrReplace: cat,
  }));
  await submitMutations(categoryMutations);
  console.log(`   ✅ ${categoryMutations.length} categories\n`);

  // 3. Treatments
  console.log("💊 Creating treatments...");
  const treatmentMutations = buildTreatmentDocs();
  await submitMutations(treatmentMutations);
  console.log(`   ✅ ${treatmentMutations.length} treatments\n`);

  // 4. Specialists (with images)
  console.log("👨‍⚕️ Creating specialists (uploading images)...");
  const specialistMutations = await buildSpecialistDocsWithImages();
  await submitMutations(specialistMutations);
  console.log(`   ✅ ${specialistMutations.length} specialists\n`);

  // 5. Google Reviews
  console.log("⭐ Creating Google reviews...");
  const reviewMutations = buildReviewDocs();
  await submitMutations(reviewMutations);
  console.log(`   ✅ ${reviewMutations.length} reviews\n`);

  // 6. Pages (with images)
  console.log("📄 Creating page documents (uploading images)...");
  const pageMutations = await buildPageDocsWithImages();
  await submitMutations(pageMutations);
  console.log(`   ✅ ${pageMutations.length} pages\n`);

  // 7. Site Settings
  console.log("⚙️  Creating site settings...");
  const settingsMutation: Mutation = {
    createOrReplace: {
      _id: "siteSettings",
      _type: "siteSettings",
      title: "CMedical",
      socialMedia: {
        instagram: "https://www.instagram.com/cmedical.no",
        facebook: "https://www.facebook.com/cmedical.no",
        linkedin: "https://www.linkedin.com/company/cmedical",
      },
    },
  };
  await submitMutations([settingsMutation]);
  console.log(`   ✅ 1 site settings\n`);

  // 8. Clinics
  console.log("🏥 Creating clinics...");
  const clinicMutations = buildClinicDocs();
  await submitMutations(clinicMutations);
  console.log(`   ✅ ${clinicMutations.length} clinics\n`);

  // 9. Articles (with images)
  console.log("📰 Creating articles (uploading images)...");
  const articleMutations = await buildArticleDocsWithImages();
  await submitMutations(articleMutations);
  console.log(`   ✅ ${articleMutations.length} articles\n`);

  const total =
    categoryMutations.length +
    treatmentMutations.length +
    specialistMutations.length +
    reviewMutations.length +
    pageMutations.length +
    1 +
    clinicMutations.length +
    articleMutations.length;

  console.log(`\n🎉 Migration complete! ${total} documents created/updated in Sanity.`);
  console.log(`   📸 ${imageCache.size} images uploaded.`);
  console.log("   Open Sanity Studio to verify the content.");
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
