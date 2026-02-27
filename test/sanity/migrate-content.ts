#!/usr/bin/env npx tsx
/**
 * Sanity Content Migration Script
 * 
 * Pushes all hardcoded content from the React app into Sanity CMS.
 * 
 * Usage:
 *   1. Get a Sanity API token with write access from https://www.sanity.io/manage
 *   2. Run: SANITY_TOKEN=your_token npx tsx sanity/migrate-content.ts
 * 
 * This will create documents for:
 *   - Treatment Categories (6)
 *   - Treatments (~40+)
 *   - Specialists (~50+)
 *   - Google Reviews (14)
 *   - Homepage (1)
 *   - About Page (1)
 *   - Contact Page (1)
 *   - Pricing Page (1)
 *   - Insurance Page (1)
 *   - Services Page (1)
 */

const PROJECT_ID = "sh2sj585";
const DATASET = "development";
const API_VERSION = "2024-01-01";
const TOKEN = 'skZq2dG4GHzIeFIovU9Cr30K8IqH0ac6UYXR5M6FEanMtxMZNB6iHRRrQIeDppP1ZDuxStTU6fBS601kWeixOJcUixxqhbVbFRcdnyIJxJ0tIYVKnhxMo3j72K6rAaMqxOJ2XUIYwHurrBTuwlTAvXehiNpnuq3OvGojIZjvbml74PLzEQ0X';

if (!TOKEN) {
  console.error("❌ Missing SANITY_TOKEN. Get one from https://www.sanity.io/manage");
  console.error("   Run: SANITY_TOKEN=your_token npx tsx sanity/migrate-content.ts");
  process.exit(1);
}

const API_URL = `https://${PROJECT_ID}.api.sanity.io/v${API_VERSION}/data/mutate/${DATASET}`;

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
// SPECIALISTS
// ============================================================
const specialistsList = [
  { name: "Alenka Bindas", title: "Gynekolog", expertise: ["Gynekologi"], slug: "alenka-bindas", category: "gynekologi", bio: "Alenka er en erfaren gynekolog med bred kompetanse innen kvinnehelse.", education: "Medisin ved Universitetet i Ljubljana", languages: ["Norsk","Engelsk","Slovensk"] },
  { name: "Anamika Choudhury", title: "Embryolog", expertise: ["Fertilitet","Embryologi"], slug: "anamika-choudhury", category: "fertilitet", bio: "Høyt kvalifisert embryolog med spesialkompetanse innen assistert befruktning.", education: "MSc i klinisk embryologi, Oxford", languages: ["Norsk","Engelsk","Hindi"] },
  { name: "Andreas Edenberg", title: "Gastrokirurg", expertise: ["Gastrokirurgi","Overvektskirurgi"], slug: "andreas-edenberg", category: "annet" },
  { name: "Ane Gerda Z Eriksson", title: "Gynekolog", expertise: ["Gynekologi","Robotkirurgi"], slug: "ane-gerda-z-eriksson", category: "gynekologi" },
  { name: "Are Haukåen Stødle", title: "Ortoped", expertise: ["Ortopedi","Fot- og ankelkirurgi"], slug: "are-haukaen-stodle", category: "ortopedi" },
  { name: "Ashi Ahmad", title: "Gynekolog", expertise: ["Gynekologi","Fødselshjelp","Fostermedisin"], slug: "ashi-ahmad", category: "gynekologi" },
  { name: "Audun Høegh Tangerud", title: "Ortoped", expertise: ["Ortopedi","Hånd- og fotkirurgi"], slug: "audun-hoegh-tangerud", category: "ortopedi" },
  { name: "Birgir Gudbrandsson", title: "Revmatolog", expertise: ["Revmatologi","Vaskulitt"], slug: "birgir-gudbrandsson", category: "annet" },
  { name: "Birgitte Aspenes", title: "Gynekolog", expertise: ["Gynekologi","Kirurgi"], slug: "birgitte-aspenes", category: "gynekologi" },
  { name: "Birgitte Mitlid-Mork", title: "Fertilitetslege", expertise: ["Fertilitet","IVF","Gynekologi"], slug: "birgitte-mitlid-mork", category: "fertilitet" },
  { name: "Bjørn Brennhovd", title: "Urolog", expertise: ["Urologi","Robotkirurgi","Prostatakreft"], slug: "bjorn-brennhovd", category: "urologi" },
  { name: "Bjørn Robstad", title: "Ortoped", expertise: ["Ortopedi","Protesekirurgi"], slug: "bjorn-robstad", category: "ortopedi" },
  { name: "Einar Andre Brevik", title: "Karkirurg", expertise: ["Karkirurgi","Åreknuter"], slug: "einar-andre-brevik", category: "annet" },
  { name: "Emily Livesay", title: "Gynekolog", expertise: ["Gynekologi","Fertilitet","Barselomsorg"], slug: "emily-livesay", category: "gynekologi" },
  { name: "Endre Søreide", title: "Ortoped", expertise: ["Ortopedi","Hånd- og albuekirurgi"], slug: "endre-soreide", category: "ortopedi" },
  { name: "Erik Berg", title: "Plastikkirurg", expertise: ["Plastikkirurgi","Rekonstruksjonskirurgi"], slug: "erik-berg", category: "annet" },
  { name: "Ersan Krckov", title: "Endokrinolog", expertise: ["Endokrinologi","Stoffskifte"], slug: "ersan-krckov", category: "annet" },
  { name: "Gilbert Moatshe", title: "Ortoped", expertise: ["Ortopedi","Knekirurgi","Idrettsskader"], slug: "gilbert-moatshe", category: "ortopedi" },
  { name: "Gunnar Dalén", title: "Karkirurg", expertise: ["Karkirurgi","Åreknuter"], slug: "gunnar-dalen", category: "annet" },
  { name: "Hannah Russell", title: "Fertilitetslege", expertise: ["Fertilitet","Gynekologi"], slug: "hannah-russell", category: "fertilitet" },
  { name: "Ida Waagsbø Bjørntvedt", title: "Fertilitetslege", expertise: ["Fertilitet","IVF","Vulvaklinikk"], slug: "ida-waagsbo-bjorntvedt", category: "fertilitet" },
  { name: "Ingvild Skarpås Aannerud", title: "Osteopat", expertise: ["Osteopati","Bekkenbunnshelse"], slug: "ingvild-skarpas-aannerud", category: "annet" },
  { name: "Istvan Zoltan Rigo", title: "Ortoped", expertise: ["Ortopedi","Håndkirurgi"], slug: "istvan-zoltan-rigo", category: "ortopedi" },
  { name: "Jackson Tok", title: "Fertilitetslege", expertise: ["Fertilitet","IVF","Mannlig infertilitet"], slug: "jackson-tok", category: "fertilitet" },
  { name: "Jan-Ragnar Haugstvedt", title: "Ortoped", expertise: ["Ortopedi","Håndkirurgi"], slug: "jan-ragnar-haugstvedt", category: "ortopedi" },
  { name: "Jeanette Follestad", title: "Sykepleier", expertise: ["Sykepleie","Fertilitet"], slug: "jeanette-follestad", category: "annet" },
  { name: "Jonas Rydinge", title: "Ortoped", expertise: ["Ortopedi","Fot- og ankelkirurgi"], slug: "jonas-rydinge", category: "ortopedi" },
  { name: "Jørgen Perminow", title: "Gynekolog", expertise: ["Gynekologi","Obstetrikk"], slug: "jorgen-perminow", category: "gynekologi" },
  { name: "Kjersti Brenden", title: "Fertilitetslege", expertise: ["Fertilitet","IVF","Gynekologi"], slug: "kjersti-brenden", category: "fertilitet" },
  { name: "Kjersti Margrete Finsrud", title: "Sexolog", expertise: ["Sexologi","Seksuell helse"], slug: "kjersti-margrete-finsrud", category: "annet" },
  { name: "Kristian Marstrand Warholm", title: "Ortoped", expertise: ["Ortopedi","Hoftekirurgi","Idrettsmedisin"], slug: "kristian-marstrand-warholm", category: "ortopedi" },
  { name: "Kristian Ophaug", title: "Fertilitetscoach", expertise: ["Fertilitet","Familieterapi"], slug: "kristian-ophaug", category: "fertilitet" },
  { name: "Lars Eldar Myrseth", title: "Ortoped", expertise: ["Ortopedi","Håndkirurgi"], slug: "lars-eldar-myrseth", category: "ortopedi" },
  { name: "Lars Fredrik Qvigstad", title: "Urolog", expertise: ["Urologi","Prostatakreft"], slug: "lars-fredrik-qvigstad", category: "urologi" },
  { name: "Line Fusdahl Hulleberg", title: "Sykepleier", expertise: ["Sykepleie","Fertilitet"], slug: "line-fusdahl-hulleberg", category: "annet" },
  { name: "Line Jacob", title: "Gynekolog", expertise: ["Gynekologi","Reproduksjonsmedisin"], slug: "line-jacob", category: "gynekologi" },
  { name: "Linn Myrtveit-Stensrud", title: "Psykolog, PhD", expertise: ["Psykologi","Kvinnehelse"], slug: "linn-myrtveit-stensrud", category: "annet" },
  { name: "Linnea Torsnes", title: "Hudlege", expertise: ["Hudhelse","Dermatologi"], slug: "linnea-torsnes", category: "annet" },
  { name: "Madeleine Engen", title: "Gynekolog", expertise: ["Gynekologi","Urogynekologi"], slug: "madeleine-engen", category: "gynekologi" },
  { name: "Marc Jacob Strauss", title: "Ortoped", expertise: ["Ortopedi","Knekirurgi","Idrettsmedisin"], slug: "marc-jacob-strauss", category: "ortopedi" },
  { name: "Mari Borge Eskerud", title: "Ernæringsfysiolog", expertise: ["Ernæring","IBS"], slug: "mari-borge-eskerud", category: "annet" },
  { name: "Maria Thompson Clausen", title: "Ernæringsfysiolog", expertise: ["Ernæring","Livsstilsveiledning"], slug: "maria-thompson-clausen", category: "annet" },
  { name: "Marian Bale", title: "Gastrokirurg", expertise: ["Gastrokirurgi","Brokkbehandling"], slug: "marian-bale", category: "annet" },
  { name: "Marthe Hagen", title: "Psykolog", expertise: ["Psykologi","Terapi"], slug: "marthe-hagen", category: "annet" },
  { name: "Morten Andersen", title: "Urolog", expertise: ["Urologi"], slug: "morten-andersen", category: "urologi" },
  { name: "Nabeel Yousaf Khan", title: "Urolog", expertise: ["Urologi","Prostata"], slug: "nabeel-yousaf-khan", category: "urologi" },
  { name: "Nicolai Wessel", title: "Urolog", expertise: ["Urologi","Robotkirurgi","Prostatakreft"], slug: "nicolai-wessel", category: "urologi" },
  { name: "Siri Kløkstad", title: "Gynekolog", expertise: ["Gynekologi","Vulvaplager"], slug: "siri-klokstad", category: "gynekologi" },
  { name: "Sondre Hassellund", title: "Ortoped", expertise: ["Ortopedi","Hånd- og albuekirurgi"], slug: "sondre-hassellund", category: "ortopedi" },
  { name: "Sonu Lukose", title: "Embryolog", expertise: ["Fertilitet","Embryologi","IVF"], slug: "sonu-lukose", category: "fertilitet" },
  { name: "Stig Hegna", title: "Ortoped", expertise: ["Ortopedi","Fotkirurgi"], slug: "stig-hegna", category: "ortopedi" },
  { name: "Tea Berge", title: "Ortoped", expertise: ["Ortopedi","Kne- og skulderkirurgi"], slug: "tea-berge", category: "ortopedi" },
  { name: "Thomas Fredrik Thaulow", title: "Gynekolog", expertise: ["Gynekologi","Endometriose","Laparoskopi"], slug: "thomas-fredrik-thaulow", category: "gynekologi" },
  { name: "Tom Henry Sundøen", title: "Ortoped", expertise: ["Ortopedi","Skopisk kirurgi"], slug: "tom-henry-sundoen", category: "ortopedi" },
  { name: "Tonje Westlie", title: "Fysioterapeut", expertise: ["Fysioterapi","Håndterapi"], slug: "tonje-westlie", category: "annet" },
  { name: "Trond Jørgensen", title: "Urolog", expertise: ["Urologi","Prostatakreft"], slug: "trond-jorgensen", category: "urologi" },
];

const categoryRefMap: Record<string, string> = {
  gynekologi: "category-gynekologi",
  fertilitet: "category-fertilitet",
  urologi: "category-urologi",
  ortopedi: "category-ortopedi",
  annet: "category-flere-fagomrader",
};

function buildSpecialistDocs(): Mutation[] {
  return specialistsList.map((s) => ({
    createOrReplace: {
      _id: `specialist-${s.slug}`,
      _type: "specialist",
      name: s.name,
      slug: { _type: "slug", current: s.slug },
      role: s.title,
      specialties: s.expertise,
      categories: [{ _type: "reference", _ref: categoryRefMap[s.category] || "category-flere-fagomrader", _key: `cat-${s.slug}` }],
      shortBio: s.bio || `${s.name} er spesialist i ${s.title.toLowerCase()} hos CMedical.`,
      education: s.education ? [s.education] : [],
      languages: s.languages || ["Norsk", "Engelsk"],
      bookingEnabled: true,
    },
  }));
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
  return [
    // Homepage
    {
      createOrReplace: {
        _id: "homepage",
        _type: "homepage",
        title: "CMedical – Nordens ledende klinikk for livet og underlivet",
        heroBanner: {
          slides: [
            { _type: "object", _key: "s1", heading: "Styrket kvinnehelse\n– i hele livsløpet", subheading: "Kvinnehelse", ctaText: "Les mer", ctaLink: "/gynekologi" },
            { _type: "object", _key: "s2", heading: "Mannshelse\nog urologi", subheading: "Urologi", ctaText: "Les mer", ctaLink: "/urologi" },
            { _type: "object", _key: "s3", heading: "Landets første private\nmed robotkirurgi", subheading: "Teknologi", ctaText: "Les mer", ctaLink: "/tjenester" },
            { _type: "object", _key: "s4", heading: "Din reise til\nforeldreskap", subheading: "Fertilitet", ctaText: "Les mer", ctaLink: "/fertilitet" },
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
          { _type: "object", _key: "pb1", title: "Velkommen på fastlegeseminar", description: "Lær mer om våre tjenester og hvordan vi kan hjelpe deg og dine pasienter.", ctaText: "Les mer og boka", ctaLink: "/kontakt" },
          { _type: "object", _key: "pb2", title: "Velkommen på fastlegeseminar", description: "Hold deg oppdatert på nyheter, arrangementer og faglig innhold fra CMedical.", ctaText: "Les mer og boka", ctaLink: "/kontakt" },
        ],
        seo: {
          _type: "seo",
          metaTitle: "CMedical – Nordens ledende klinikk for livet og underlivet",
          metaDescription: "Spesialisert behandling innen gynekologi, fertilitet, urologi og ortopedi. Robotassistert kirurgi, kort ventetid og erfarne spesialister.",
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
// MAIN
// ============================================================
async function main() {
  console.log("🚀 Starting Sanity content migration...");
  console.log(`   Project: ${PROJECT_ID} / Dataset: ${DATASET}\n`);

  // 1. Treatment Categories
  console.log("📂 Creating treatment categories...");
  const categoryMutations: Mutation[] = treatmentCategories.map((cat) => ({
    createOrReplace: cat,
  }));
  await submitMutations(categoryMutations);
  console.log(`   ✅ ${categoryMutations.length} categories\n`);

  // 2. Treatments
  console.log("💊 Creating treatments...");
  const treatmentMutations = buildTreatmentDocs();
  await submitMutations(treatmentMutations);
  console.log(`   ✅ ${treatmentMutations.length} treatments\n`);

  // 3. Specialists
  console.log("👨‍⚕️ Creating specialists...");
  const specialistMutations = buildSpecialistDocs();
  await submitMutations(specialistMutations);
  console.log(`   ✅ ${specialistMutations.length} specialists\n`);

  // 4. Google Reviews
  console.log("⭐ Creating Google reviews...");
  const reviewMutations = buildReviewDocs();
  await submitMutations(reviewMutations);
  console.log(`   ✅ ${reviewMutations.length} reviews\n`);

  // 5. Pages
  console.log("📄 Creating page documents...");
  const pageMutations = buildPageDocs();
  await submitMutations(pageMutations);
  console.log(`   ✅ ${pageMutations.length} pages\n`);

  const total =
    categoryMutations.length +
    treatmentMutations.length +
    specialistMutations.length +
    reviewMutations.length +
    pageMutations.length;

  console.log(`\n🎉 Migration complete! ${total} documents created/updated in Sanity.`);
  console.log("   Open Sanity Studio to verify the content.");
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
