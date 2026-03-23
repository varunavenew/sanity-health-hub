#!/usr/bin/env npx tsx
/**
 * Sanity Treatment Migration Script
 *
 * Migrates all treatment data from treatmentContent.ts to Sanity CMS,
 * including sections, relatedSpecialists, linkedServices and full descriptions.
 *
 * Usage:
 *   cd test && SANITY_TOKEN=<token> npx tsx sanity/migrate-treatments.ts
 */

import { API_URL, SANITY_TOKEN as TOKEN, API_VERSION, PROJECT_ID, DATASET } from "./config";

interface Mutation {
  createOrReplace: Record<string, any>;
}

function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/æ/g, "ae").replace(/ø/g, "o").replace(/å/g, "a")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

async function submitMutations(mutations: Mutation[]) {
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
    console.log(`  ✓ Batch ${Math.floor(i / 50) + 1}: ${batch.length} documents`);
  }
}

// Category reference mapping
const categoryRefs: Record<string, string> = {
  "Gynekologi": "category-gynekologi",
  "Graviditet": "category-graviditet",
  "Fertilitet": "category-fertilitet",
  "Urologi": "category-urologi",
  "Ortopedi": "category-ortopedi",
  "Flere fagområder": "category-flere-fagomrader",
};

// ============================================================
// FULL TREATMENT DATA from treatmentContent.ts
// ============================================================
const treatments: Array<{
  key: string;
  title: string;
  subtitle: string;
  parentCategory: string;
  description: string;
  sections?: Array<{ id?: string; heading: string; content: string }>;
  benefits?: string[];
  benefitsTitle?: string;
  process?: Array<{ title: string; description: string }>;
  faqs?: Array<{ question: string; answer: string }>;
  linkedServices?: Array<{ label: string; description: string; path: string }>;
  relatedSpecialists?: string[];
}> = [
  // ==========================================
  // GYNEKOLOGI
  // ==========================================
  {
    key: "gynekologi/tverrfaglig",
    title: "Tverrfaglig team: Osteopat, Sexolog, Psykolog, Ernæring",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    description: "Våre gynekologer jobber kun med den kvinnesykdommen de kan aller best, og ved behov jobber vi i unike ekspert team med psykolog, sexolog, ernæringsfysiolog, fysioterapeut, osteopat og uroterapeut. Denne tverrfagligheten er helt unik!\n\nVi tilbyr alt innen gynekologisk kirurgi, og vi er den første private aktøren som tilbyr robotkirurgi. Vår klinikk er den første private klinikken i Norden med IVF-behandling og kirurgi samlet under samme tak. Dette gir deg som gjennomgår fertilitetsbehandling en ro og trygghet om at vi kan løse de fleste utfordringer på et sted, her hos oss.\n\nVi har et svangerskapsteam som følger deg trygt igjennom graviditeten helt til fødsel, og våre eksperter på barsel står klare til å veilede deg videre på «6 ukers kontrollen». Dersom du skulle oppleve plager senere i livet er vi her for å hjelpe deg. Vi har kompetanse på alle gynekologiske tilstander - fra utredning, behandling og oppfølging i etterkant.",
    linkedServices: [
      { label: "Osteopat", description: "Manuell behandlingsform som komplementerer medisinsk utredning og behandling innenfor vulvasmerter, bekkenbunnsdysfunksjon og muskelskjelettplager.", path: "/behandlinger/flere-fagomrader/osteopati" },
      { label: "Sexolog", description: "Terapeutiske samtaler for støtte, veiledning og råd knyttet til seksuell helse, funksjon, lyst, selvbilde og intimitet.", path: "/behandlinger/flere-fagomrader/sexologi" },
      { label: "Psykolog", description: "Samtalepartner for å sortere tanker og følelser, håndtere smerter, og motta støtte gjennom utfordrende behandlingsforløp.", path: "/behandlinger/flere-fagomrader/psykologi" },
      { label: "Ernæringsfysiolog", description: "Individuelt tilpasset kostholdsrådgivning med betydning for hormoner, fertilitet, overgangsalder og generell helse.", path: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  {
    key: "gynekologi/undersokelse",
    title: "Gynekologisk undersøkelse",
    subtitle: "Trygg og grundig undersøkelse hos erfarne gynekologer.",
    parentCategory: "Gynekologi",
    description: "En gynekologisk undersøkelse er en viktig del av kvinners forebyggende helsearbeid. Hos CMedical utfører vi grundige undersøkelser i trygge omgivelser med erfarne gynekologer.\n\nVi anbefaler regelmessige gynekologiske kontroller for å forebygge og oppdage eventuelle tilstander tidlig. Undersøkelsen tilpasses dine behov og bekymringer.",
    benefits: ["Erfarne gynekologer med lang klinisk erfaring", "Moderne utstyr og fasiliteter", "Tid til grundig samtale og undersøkelse", "Rask oppfølging ved eventuelle funn", "Kort ventetid – de fleste får time innen 1-3 dager"],
    process: [
      { title: "Samtale", description: "Vi starter med en grundig samtale om din helse, eventuelle symptomer og bekymringer." },
      { title: "Undersøkelse", description: "Gynekologisk undersøkelse tilpasset dine behov, inkludert ultralyd ved behov." },
      { title: "Vurdering og plan", description: "Din gynekolog gjennomgår funnene med deg og lager en eventuell videre plan." },
    ],
    faqs: [
      { question: "Hva koster en gynekologisk undersøkelse?", answer: "En standard gynekologisk undersøkelse koster fra 2100,-. Se vår prisliste for fullstendig oversikt." },
      { question: "Hvor lang tid tar undersøkelsen?", answer: "En vanlig undersøkelse tar 30-45 minutter, inkludert samtale." },
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  {
    key: "gynekologi/urinlekkasje",
    title: "Urinlekkasje",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    description: "Nesten 25 % av alle kvinner rammes av urinlekkasje i løpet av livet - noe som gir redusert livskvalitet. Hos oss møter du noen av landets fremste eksperter på urinlekkasje og du får effektiv behandling for alle typer urinveislekkasje, tilpasset deg.",
    sections: [
      { id: "stressinkontinens", heading: "Typer urinlekkasje", content: "**Stressinkontinens**\nUrinlekkasje ved fysisk aktivitet, hoste eller latter skyldes oftest svekkelse i bindevev/muskulatur som holder urinrør og urinblære på plass. Stressinkontinens oppstår typisk grunnet skader som kommer etter fødsler eller tungt fysisk arbeid.\n\n**Tranginkontinens**\nEn plutselig sterk trang til å late vannet etterfulgt av lekkasje. Man er ofte plaget av hyppig toalettbesøk, hvor man ikke alltid når frem i tide. Dette skyldes feil i nervesignalene til blæremuskelaturen slik at denne trekker seg sammen ukontrollert og ofte.\n\n_Kronisk UVI eller betennelse i blæreveggen kan forveksles med trang, dette kan vi også behandle._\n\n**Blandingsinkontinens**\nKombinasjon av stress og trang, hvilken type som dominerer avhenger fra person til person.\n\nEr du plaget med dette anbefaler vi deg å ta kontakt med oss." },
      { id: "behandling", heading: "Behandling", content: "Hvilken behandling vi anbefaler deg avhenger av hvilken type lekkasje du har, hvor mye du lekker og dine risikofaktorer (BMI, tidligere kirurgi osv.).\n\nDet finnes trygge og effektive behandlinger, som for eksempel blæretrening, bekkenbunnstrening, medikamentell behandling eller ulike typer operasjoner.\n\nVed samtidig vaginale fremfall og stressurinlekkasje vil man bestandig operere det vaginale fremfallet først. Har du spørsmål om dette kan du alltid kontakte oss for en uforpliktende prat." },
    ],
    relatedSpecialists: ["madeleine-engen", "birgitte-aspenes"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  {
    key: "gynekologi/endometriose",
    title: "Endometriose",
    subtitle: "Spesialisert diagnostikk og behandling av endometriose og adenomyose.",
    parentCategory: "Gynekologi",
    description: "Endometriet = slimhinnen i livmoren.\n\nHver måned vokser slimhinnen i takt med hormonsyklus, og den blir avstøtt ved mens før den bygges opp igjen. Ved endometriose vokser vev som ligner livmorslimhinnen utenfor livmorhulen. Endometriose rammer oftest kvinner i fertil alder.\n\nDet tar i gjennomsnitt syv år å bli diagnostisert i Norge – **dette vil vi endre.**\n\nVi har unik ekspertise og lang erfaring med endometriose.",
    sections: [
      { id: "symptomer", heading: "Symptomer", content: "Symptomene på endometriose er individuelle. Det vanligste symptomet er smerter ved menstruasjon eller utenom. Smertene kan variere i styrke fra minimale menstruasjonssmerter til invalidiserende smerter. Andre symptomer kan være kvalme, diaré eller forstoppelse, økt trettbarhet, smerter ved vannlatning eller ved samleie. Omtrent 10% av kvinner rammes, og hele 30% av disse lider av underlivssmerter." },
      { id: "kirurgi", heading: "Kirurgi", content: "Vi tilbyr både tradisjonell kikkhullskirurgi (laparoskopi) og robotkirurgi ved sanering av endometriose. CMedical er den eneste private aktøren i Norge som tilbyr operasjon med robot ved endometriose. Robotkirurgi er en presis og skånsom operasjonsmetode.\n\nVed kirurgi vil endometriose på bukhinnen, i bekkenet, arrvev og sammenvoksinger klippes bort. Roboten er spesielt egnet til finkirurgi der en vil unngå nærliggende nerver og blodkar." },
    ],
    faqs: [
      { question: "Hva er symptomene på endometriose?", answer: "Vanlige symptomer er sterke menssmerter, kroniske bekkensmerter, smerter ved samleie og i noen tilfeller redusert fertilitet." },
      { question: "Kan endometriose påvirke fertiliteten?", answer: "Ja, endometriose kan påvirke fertiliteten. Vi har tett samarbeid med fertilitetsklinikken for å gi best mulig hjelp." },
      { question: "Hva er robotkirurgi?", answer: "Robotassistert kirurgi gir kirurgen bedre presisjon og oversikt, noe som er spesielt viktig ved dyp endometriose nær vitale organer." },
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  {
    key: "gynekologi/overgangsalder",
    title: "Overgangsalder",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    description: "Symptomer på overgangsalderen starter ofte i første halvdel av 40-årene, opplevelsene kan variere mye fra kvinne til kvinne. For noen er overgangen knapt merkbar, mens andre opplever så store utfordringer at det påvirker hverdagen deres betydelig.\n\nHos CMedical møter du et dedikert ekspert-team av spesialister på overgangsalder. Våre eksperter er medlemmer av British Menopause Society og samarbeider tett med Newson Health i Storbritannia, som er verdens ledende klinikk innen overgangsalder. Behandlingsmetodikken vår bygger på «de fire søylene» – hormoner, relasjoner, ernæring og fysisk form – som sammen sikrer en helhetlig tilnærming til dine behov.",
    sections: [
      { id: "symptomer", heading: "Symptomer", content: "Overgangsalderen kan først merkes gjennom uregelmessige menstruasjoner og hetetokter, endringer i humør og en generell reduksjon i energinivå. Etter hvert kan symptomene øke, og de kan oppleves både fysisk og psykisk vanskelige.\n\nVanlige symptomer inkluderer:\n- Blødningsforstyrrelser\n- Hetetokter\n- Hjernetåke/konsentrasjonsvansker\n- Redusert hukommelse\n- Ta lettere til tårene/emosjonell\n- Søvnproblemer\n- Endringer i hud og hår\n- Smerter i ledd og muskler\n- Hyppigere hodepine\n- Redusert sexlyst\n- Økt irritabilitet\n- Urinveisinfeksjoner og tørrhet i skjeden" },
      { id: "behandling", heading: "Behandling", content: "En kartleggingssamtale er en personlig og grundig konsultasjon med en eller flere av våre spesialister. Målet er å forstå dine individuelle utfordringer og behov i forbindelse med overgangsalderen. Samtalen varer i omtrent 45 minutter og inkluderer:\n- En detaljert gjennomgang av sykdomshistorie og livssituasjon.\n- Gynekologisk undersøkelse og relevante blodprøver ved behov.\n- Utarbeidelse av en tilpasset behandlingsplan." },
      { id: "fastlegeveiledning", heading: "Fastlegeveiledning overgangsalder", content: "Vi har utarbeidet en egen veiledning for fastleger om utredning og behandling av peri- og menopausale kvinner. Veilederen baserer seg på Norsk gynekologisk veileder 2024, NICE NG23 (2024), British Menopause Society (BMS) retningslinjer og European Society of Endocrinology (ESE) kliniske retningslinjer 2025.\n\n[Les fastlegeveiledning for overgangsalder →](/fastlegeveiledning-overgangsalder)" },
    ],
    linkedServices: [
      { label: "Ernæringsfysiolog", description: "Kostholdsrådgivning tilpasset hormonelle endringer og overgangsalder.", path: "/behandlinger/flere-fagomrader/ernaringsfysiolog" },
      { label: "Osteopat", description: "Manuell behandling for smerter i ledd og muskler knyttet til hormonelle endringer.", path: "/behandlinger/flere-fagomrader/osteopati" },
      { label: "Sexolog", description: "Støtte og veiledning ved endringer i seksuell helse gjennom overgangsalderen.", path: "/behandlinger/flere-fagomrader/sexologi" },
      { label: "Psykolog", description: "Samtaleterapi for å håndtere emosjonelle utfordringer i overgangsalderen.", path: "/behandlinger/flere-fagomrader/psykologi" },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  {
    key: "gynekologi/vaginale-fremfall",
    title: "Vaginale fremfall",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    description: "Vaginalt fremfall, også kjent som prolaps, er en tilstand der organer som livmoren, blæren eller endetarmen faller ned fra deres vanlige posisjon og presser inn i skjeden. Dette skjer vanligvis på grunn av svekkelse av bekkenbunnsmuskulaturen og støttevev, som kan være forårsaket av faktorer som graviditet, fødsel, aldring eller kirurgiske inngrep.",
    sections: [
      { id: "behandling", heading: "Behandling", content: "Behandlingen avhenger av alvorlighetsgraden av tilstanden og symptomene, og det kan inkludere bekkenbunnstrening, bruk av støtteinnretninger, eller i mer alvorlige tilfeller, kirurgiske inngrep. Det er viktig å oppsøke helsepersonell for en grundig vurdering og rådgivning hvis man opplever symptomer på vaginalt fremfall.\n\nHos oss møter du noen av Nordens fremste eksperter på fremfall. Ta kontakt for mer informasjon eller bestill en konsultasjon." },
    ],
    relatedSpecialists: ["madeleine-engen"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  {
    key: "gynekologi/blodningsforstyrrelser",
    title: "Blødningsforstyrrelser",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    description: "Blødningsforstyrrelser kan være at intervallet mellom menstruasjonene endrer seg, at de blir hyppigere eller sjeldnere. Det kan være at mengden blod som kommer hver gang øker eller minker, eller det kan være blødninger som kommer mellom menstruasjoner.\n\nHvis man opplever mensen som plagsomt stor, uregelmessig eller smertefull, bør dette undersøkes hos gynekolog. Da vil vi gjøre ultralyd og ta ulike prøver for å finne ut av hvorfor du har blødningsforstyrrelser.",
    sections: [
      { id: "vanlige-arsaker", heading: "Vanlige årsaker", content: "Vanlige årsaker til blødningsforstyrrelser kan være overgangsalder, seksuelt overførbare infeksjoner, polypper eller muskelknuter, graviditet eller hormonelle ubalanser.\n\nBlødningsforstyrrelser som kommer etter _overgangsalderen_ skal alltid utredes. Det gjøres gjerne med ultralyd og en vevsprøve fra livmorhulen. Videre oppfølging og behandling avhenger av dette prøvesvaret." },
      { id: "prevensjon", heading: "Prevensjon", content: "Dersom man bruker prevensjon kan man få uregelmessige blødninger på grunn av det. Det er sjelden farlig, og som oftest er det bare å bytte prevensjonsmiddel så blir det bedre. Opplever du plager kan du alltid ta kontakt med oss eller bestille time." },
    ],
    relatedSpecialists: ["birgitte-mitlid-mork", "birgitte-aspenes"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  {
    key: "gynekologi/celleforandringer",
    title: "Celleforandringer",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    description: "Celleforandringer er forstadier til kreft og kalles dysplasier. Det finnes flere stadier i økende alvorlighetsgrad. Hvorvidt celleforandringene skal behandles avhenger av hvor alvorlige de er og hvilken type HPV du har.",
    sections: [
      { id: "hpv", heading: "HPV og celleforandring", content: "Over 25.000 kvinner får hvert år konstatert unormale celler ved undersøkelse av livmorhalsen. Av disse behandles cirka 3000 kvinner for celleforandringer. Samtidig får cirka 300 kvinner livmorhalskreft i året.\n\nUtviklingen av livmorhalskreft tar flere år.\n\nScreening med HPV-test hvert femte år redder liv." },
      { id: "behandling", heading: "Behandling", content: "Lavgradige celleforandringer i livmorhalsen går ofte tilbake av seg selv. De behandles kun hvis de vedvarer. Ved lavgradige celleforandringer anbefales det å ta en ny celleprøve om 12 måneder.\n\nHøygradige celleforandringer behandles individuelt. Her henvises man først til gynekolog som utfører kolposkopi." },
      { id: "konisering", heading: "Konisering", content: "Konisering er et lite kirurgisk inngrep hvor en liten del av det ytterste laget på livmorhalsen fjernes. Inngrepet forhindrer celleforandringene fra å utvikle seg til livmorhalskreft.\n\nHos vår klinikk på Bekkestua tilbyr vi konisering i lokalbedøvelse. Inngrepet tar vanligvis rundt 15 minutter, og du blir godt ivaretatt i rolige og trygge omgivelser." },
    ],
    relatedSpecialists: ["birgitte-aspenes", "ane-gerda-z-eriksson", "siri-klokstad"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  {
    key: "gynekologi/cyster",
    title: "Cyster på eggstokkene",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    description: "Cyster på eggstokkene er veldig vanlig og i de fleste tilfeller helt ufarlig.\n\nHver måned modnes ett egg i en av eggstokkene. Dette ligger inni i en vannpose som blir ca 2 cm stor før den sprekker. Av og til kan det dannes flere slike vannposer eller cyster som ikke sprekker, men som får vokse videre.",
    sections: [
      { id: "former-for-cyste", heading: "Former for cyste", content: "Andre typer cyster er dermoider, endometriomer eller cystadenomer. Disse ser litt annerledes ut på ultralyd, og derfor kan vi skille dem fra funksjonelle cyster. Dette er også godartede cyster, men disse blir ikke borte av seg selv og må noen ganger opereres bort, særlig hvis de blir store og gir plager." },
      { id: "for-og-etter-overgangsalder", heading: "Før og etter overgangsalder", content: "Hos kvinner før overgangsalder er de aller fleste cyster godartede. Hvis gynekologen finner en cyste ved ultralydundersøkelse, blir du fulgt opp videre med ultralyd, avhengig av hva slags cyste det er du har.\n\nEtter overgangsalder er det mindre vanlig med cyster og risikoen for at en cyste er ondartet er større." },
      { id: "behandling", heading: "Behandling", content: "Cyster på eggstokkene av en viss størrelse, som ikke blir borte av seg selv og som gir plager, er det anbefalt å operere bort. Dette gjøres vanligvis ved hjelp av en kikkehullsoperasjon." },
    ],
    relatedSpecialists: ["ane-gerda-z-eriksson", "birgitte-aspenes", "henrik-michelsen-wahl"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  {
    key: "gynekologi/fjerne-livmor",
    title: "Fjerne livmor",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    description: "Fjerning av livmor (hysterektomi) anbefales ved plagsomme muskelknuter (myomer), blødningsforstyrrelser, kreft i livmor eller livmorhals. Det kan også være aktuelt ved endometriose eller ved vedvarende celleforandringer i livmorhals.",
    sections: [
      { id: "hysterektomi", heading: "Fjerning av livmor (hysterektomi)", content: "Det finnes flere operasjonsmetoder for å fjerne livmoren. Vi fjerner livmoren skånsomt ved hjelp av kikkhullskirurgi eller robotassistert kirurgi. Vi er den eneste private aktøren som tilbyr robotassistert kirurgi - en mer skånsom og presis operasjonsmetode.\n\n[Les mer om robotassistert kirurgi →](/robotassistert-kirurgi)" },
      { id: "pasienthistorie", heading: "Pasienthistorie", content: "_Kine, 37 år:_\n\n«For et år siden fikk jeg et nytt liv takket være hjelp fra CMedical. Jeg hadde i flere år gått med en stor muskelknute i livmora mi og i og med at jeg ikke hadde fått barn var beskjeden jeg fikk fra det offentlige at jeg var for ung til å få fjernet livmora - jeg var jo tross alt enda fertil.»" },
    ],
    relatedSpecialists: ["ane-gerda-z-eriksson", "henrik-michelsen-wahl", "thomas-fredrik-thaulow"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  {
    key: "gynekologi/graviditet",
    title: "Graviditet",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    description: "Vi ønsker deg velkommen til oppfølging gjennom hele svangerskapet. Vi tilbyr fosterdiagnostikk, som NIPT og tidlig ultralyd. Hos oss jobber fødselsleger, gynekologspesialister og fostermedisinere. Deres kompetanse er din trygghet.",
    sections: [
      { id: "ultralyd", heading: "Ultralyd", content: "Vi skiller mellom tidlig ultralyd uke 6–10, uke 11–14, og ultralyd fra uke 14+0. Tidlig ultralyd uke 6-10 utføres ved hjelp av en innvendig probe." },
      { id: "nipt", heading: "NIPT", content: "Fra og med svangerskapsuke 10 kan du ta NIPT-test og tidlig ultralyd hos oss. NIPT er en forkortelse for Non-Invasive Prenatal Test." },
      { id: "6-ukerskontroll", heading: "6-ukerskontroll", content: "Ved 6-ukerskontrollen vil du treffe medgründer og gynekolog Madeleine Engen. Hun har særlig erfaring med fødselsskader." },
      { id: "traumatisk-fodsel", heading: "Traumatisk fødsel", content: "En av tre opplever fødselen sin som traumatisk og rundt 4 % har en så vanskelig fødselsopplevelse at det går utover hverdagen." },
      { id: "fodselsangst", heading: "Fødselsangst", content: "En av fem sliter med mentale helseplager i svangerskapet." },
      { id: "for-partnere", heading: "For partnere", content: "Partnere kan også ha det tungt i graviditeten, under og etter fødsel." },
    ],
    relatedSpecialists: ["ashi-ahmad", "madeleine-engen"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  { key: "gynekologi/kirurgi", title: "Gynekologisk kirurgi", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Gynekologi", description: "CMedical tilbyr vi en rekke gynekologiske operasjoner utført av håndplukkede kirurger, som er ledende innen sine felt.", sections: [{ id: "tjenester", heading: "Våre tjenester innen gynekologisk kirurgi", content: "- Fremfalloperasjoner\n- Urinlekkasjeoperasjoner\n- Hysterektomi\n- Polypper og muskelknuter\n- Endometriosebehandling\n- Fjerning av eggstokkcyster\n- Labiaplastikk" }, { id: "robotkirurgi", heading: "Robotassistert kirurgi", content: "Som den eneste private aktøren i Norge tilbyr vi robotassistert gynekologisk kirurgi." }], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "gynekologi/hormonforstyrrelser", title: "Hormonforstyrrelser", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Gynekologi", description: "Hormonforstyrrelser refererer til unormale nivåer av hormoner i kroppen, enten det er for mye, for lite eller ujevn produksjon av visse hormoner.", sections: [{ id: "pcos", heading: "PCOS", content: "Polycystisk ovariesyndrom (PCOS) kjennetegnes ved at kjønnshormonene er i ubalanse." }, { id: "pms-pmdd", heading: "PMS og PMDD", content: "Premenstruelt syndrom omfatter plagsomme fysiske og psykiske symptomer som opptrer regelmessig siste halvdel av syklus." }], relatedSpecialists: ["birgitte-mitlid-mork", "birgitte-aspenes", "siri-klokstad"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "gynekologi/hysteroskopi", title: "Hysteroskopi", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Gynekologi", description: "Hysteroskopi er en skånsom gynekologisk undersøkelse der vi bruker et tynt instrument med kamera for å se inn i livmorhulen gjennom livmorhalsen.", sections: [{ id: "office-hysteroskopi", heading: "Office-hysteroskopi", content: "Vi tilbyr også office-hysteroskopi som kan gjennomføres uten narkose eller bedøvelse." }], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "gynekologi/labiaplastikk", title: "Labiaplastikk", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Gynekologi", description: "Det er normalt med ulik størrelse og utseende på kjønnslepper. Noen ganger gir store kjønnslepper smerter ved fysisk aktivitet.", sections: [{ id: "labiaplastikk", heading: "Hva er labiaplastikk?", content: "Labiaplastikk er en kirurgisk prosedyre som reduserer størrelsen på labia minora, de indre kjønnsleppene.\n\nInngrepet gjennomføres i narkose og tar ca. 20 min." }], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "gynekologi/robotkirurgi", title: "Robotkirurgi – Gynekologi", subtitle: "Nordens mest erfarne team innen robotassistert gynekologisk kirurgi.", parentCategory: "Gynekologi", description: "CMedical er den eneste private aktøren i Norge som tilbyr robotassistert kirurgi innen gynekologi.\n\nRobotkirurgi gir bedre presisjon, mindre blødning og raskere rekonvalesens.", benefits: ["Eneste private tilbyder av robotkirurgi i gynekologi i Norge", "da Vinci-systemet for maksimal presisjon", "Behandling av muskelknuter, dyp endometriose og hysterektomi", "Mindre smerter og kortere rekonvalesens", "Høyt volum – erfarne kirurger med dokumentert kvalitet"], faqs: [{ question: "Hvilke inngrep utføres med robot?", answer: "Vi bruker robot til fjerning av muskelknuter, dyp endometriose, hysterektomi og enkelte andre komplekse inngrep." }, { question: "Er robotkirurgi trygt?", answer: "Ja, robotkirurgi er vel dokumentert internasjonalt og gir ofte bedre resultater enn tradisjonelle metoder." }] },
  { key: "gynekologi/spontanabort", title: "Spontanabort", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Gynekologi", description: "I følge internasjonale retningslinjer blir dessverre ikke kvinner med spontanabort fulgt opp tilstrekkelig i Norge. Spontanabort oppleves for de aller fleste som et tap og da hjelper det lite å høre at det er naturens gang.", relatedSpecialists: ["birgitte-mitlid-mork", "ashi-ahmad"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "gynekologi/vulvalidelser", title: "Vulvalidelser", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Gynekologi", description: "Kompliserte sykdommer som vulvasykdommer trenger en tverrfaglig tilnærming. Vårt multidisiplinære team består derfor av gynekolog, hudlege, sexolog, psykolog og bekkenbunnsfysioterapeut.", sections: [{ id: "infeksjoner", heading: "Infeksjoner", content: "I en normal flora i skjeden er det bakterier som beskytter og er en del av immunforsvaret for kvinnen." }, { id: "vaginal-torrhet", heading: "Vaginal tørrhet", content: "Vaginal tørrhet er et symptom som plager mange kvinner." }, { id: "vaginisme", heading: "Vaginisme", content: "Vaginisme beskriver smerter lokalisert i bekkenbunnsmuskulatur." }, { id: "vulvodyni", heading: "Vulvodyni", content: "Vulvodyni er en kronisk smertetilstand i vulva." }], relatedSpecialists: ["siri-klokstad", "ingvild-skarpas-aannerud", "linn-myrtveit-stensrud", "kjersti-margrete-finsrud"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },

  // ==========================================
  // UROLOGI
  // ==========================================
  { key: "urologi/blaere", title: "Blære og urinveier", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Urologi", description: "Har du blod i urinen, sliter med vannlatning eller opplever smerter i nedre del av buken? Vi utreder og behandler alle former for blære- og urinveislidelser.", sections: [{ id: "blod-i-urinen", heading: "Blod i urinen", content: "Blod i urinen (hematuri) skal alltid utredes. Det kan skyldes mange ulike tilstander – fra urinveisinfeksjon til mer alvorlige årsaker. Hos oss starter vi med en grundig samtale og undersøkelse." }, { id: "vannlatningsproblemer", heading: "Vannlatningsproblemer", content: "Både kvinner og menn kan ha vannlatningsproblemer. Vi utreder dette grundig med urodynamisk undersøkelse og blæredagbok." }], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "urologi/forhud", title: "Forhud", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Urologi", description: "Fimose er en trang forhud som ikke lar seg trekke tilbake over hodet av penis. Tilstanden kan være medfødt eller ervervet, og kan gi ubehag.", faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "urologi/infertilitet", title: "Mannlig infertilitet", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Urologi", description: "Mannlige faktorer bidrar i ca halvparten av tilfellene med ufrivillig barnløshet. Vi tilbyr grundig utredning av mannlig fruktbarhet.", faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "urologi/nyrer", title: "Nyrer", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Urologi", description: "Vi tilbyr avansert diagnostikk og behandling av alle nyresykdommer, inkludert nyrestein og nyrecyster.", faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "urologi/prostata", title: "Prostata", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Urologi", description: "Prostataproblemer er vanlige hos menn over 50. Vi tilbyr rask og grundig utredning av alle prostataplager.", sections: [{ id: "utredning", heading: "Utredning", content: "Vi gjennomfører en grundig utredning som inkluderer PSA-blodprøve, rektal undersøkelse og MR ved behov." }, { id: "naar-sjekke", heading: "Når skal man begynne å sjekke prostata?", content: "Vi anbefaler alle menn i 50-årsalderen å ta en PSA-test hvert år." }, { id: "robotkirurgi", heading: "Robotkirurgi", content: "Robotassistert laparoskopisk prostatektomi (RALP) er et av våre spesialområder." }], relatedSpecialists: ["trond-jorgensen"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "urologi/refertilisering", title: "Refertilisering", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Urologi", description: "Sterilisering er en enkel og vanlig prevensjonsmetode for menn. Angrer du på steriliseringen, kan sædlederne sys sammen igjen.", sections: [{ id: "resultat", heading: "Resultatet av refertilisering", content: "Generelt kan man si at 70–80 % av pasientene kan regne med å få spermier i sæduttømmingen etter inngrepet." }, { id: "for-under-etter", heading: "Før, under og etter operasjonen", content: "Reversering av sterilisering gjøres i lett narkose og du kan reise hjem samme dag." }, { id: "saedkontroll", heading: "Sædkontroll etter refertilisering", content: "En kontroll med sædprøve 2–3 måneder etter inngrepet." }], relatedSpecialists: ["nabeel-yousaf-khan"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "urologi/robotkirurgi", title: "Robotassistert kirurgi", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Urologi", description: "Robotassistert kirurgi er en avansert, men skånsom form for behandling. Vi tilbyr RALP, RASP og brokkoperasjoner.", sections: [{ id: "rask-rehabilitering", heading: "Rask rehabilitering", content: "Robotkirurgi er en moderne og skånsom operasjonsmetode." }, { id: "presisjon", heading: "Presisjon som merkes", content: "Med høyoppløselig 3D-kamera og avanserte instrumenter har kirurgen svært god kontroll." }], relatedSpecialists: ["nicolai-wessel"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "urologi/sterilisering", title: "Sterilisering", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Urologi", description: "Sterilisering (vasektomi) er en enkel, trygg og effektiv behandling for permanent prevensjon.", sections: [{ id: "behandling", heading: "Behandling", content: "Sterilisering av menn foregår i lokalbedøvelse. Kirurgen legger et lite snitt på pungen." }, { id: "for-og-etter", heading: "Før og etter inngrepet", content: "Barber testiklene dagen før operasjonen." }], relatedSpecialists: ["trond-jorgensen", "nabeel-yousaf-khan"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "urologi/testikler", title: "Testikler og pung", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Urologi", description: "Testikler er mannens reproduktive organ. Opplever du plager i testikler eller pung kan du ta kontakt med oss.", sections: [{ id: "testikkelkreft", heading: "Testikkelkreft", content: "Selv om årsaken til testikkelkreft ikke er fullstendig kjent, er det flere mulige risikofaktorer." }, { id: "kul-i-pungen", heading: "Kul i pungen", content: "Har du oppdaget en hevelse i testiklene dine? Vanligvis er slike hevelser ufarlige." }], relatedSpecialists: ["nabeel-yousaf-khan"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },

  // ==========================================
  // FERTILITET
  // ==========================================
  { key: "fertilitet/infertilitet", title: "Infertilitet", subtitle: "Uten henvisning • Ingen ventetid", parentCategory: "Fertilitet", description: "Svært mange opplever at det er vanskelig å bli gravid på egenhånd. Så mange som 1 av 6 gjennomlever infertilitet.", sections: [{ id: "du-er-ikke-alene", heading: "Du er ikke alene", content: "Opplever du ufrivillig barnløshet, anbefaler vi at du tar kontakt for en fertilitetssjekk." }, { id: "kvinnelig-faktor", heading: "Kvinnelig faktor til infertilitet", content: "Kvinner fødes med ett bestemt antall egg." }, { id: "mannlig-faktor", heading: "Mannlig faktor til infertilitet", content: "Mannlige faktorer bidrar i ca halvparten av tilfellene." }], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "fertilitet/assistert-befruktning", title: "Assistert befruktning", subtitle: "Uten henvisning • Ingen ventetid", parentCategory: "Fertilitet", description: "Assistert befruktning med IUI, IVF og ICSI. Valg avhenger av utredningsfunn.", faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "fertilitet/ivf", title: "IVF", subtitle: "Uten henvisning • Ingen ventetid", parentCategory: "Fertilitet", description: "IVF er den mest effektive fertilitetsbehandlingen.", process: [{ title: "Det første møtet", description: "Gjennomgang av utredningen." }, { title: "Hormonstimulering", description: "10-14 dager med daglige sprøyter." }, { title: "Egguthenting", description: "15-20 minutter under sedasjon." }, { title: "Befruktning", description: "Embryoene dyrkes i 3-5 dager." }, { title: "Embryooverføring", description: "Smertefri prosedyre." }], faqs: [{ question: "Suksessrate?", answer: "40-50% for kvinner under 35." }, { question: "Er IVF smertefullt?", answer: "Daglige sprøyter, egguthenting under sedasjon." }] },
  { key: "fertilitet/eggfrys", title: "Eggfrys", subtitle: "Uten henvisning • Ingen ventetid", parentCategory: "Fertilitet", description: "Eggfrysing bevarer fertiliteten. Prosessen ligner IVF. Best resultat før 35 år.", faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "fertilitet/donorbehandling", title: "Donorbehandling", subtitle: "Uten henvisning • Ingen ventetid", parentCategory: "Fertilitet", description: "Donorbehandling for enslige, par med mannlig infertilitet, eller manglende egne egg.", faqs: [{ question: "Hvem kan motta donorsæd?", answer: "Enslige kvinner og par med alvorlig nedsatt sædkvalitet." }, { question: "Anonyme donorer?", answer: "Nei, identitetsåpne i Norge." }] },
  { key: "fertilitet/hysteroskopi", title: "Hysteroskopi – Fertilitet", subtitle: "Uten henvisning • Ingen ventetid", parentCategory: "Fertilitet", description: "Hysteroskopi i fertilitetssammenheng for å undersøke livmorhulen.", faqs: [{ question: "Hvorfor ved infertilitet?", answer: "For å sikre normal livmorhole." }] },
  { key: "fertilitet/saedanalyse", title: "Sædanalyse", subtitle: "Uten henvisning • Ingen ventetid", parentCategory: "Fertilitet", description: "Sædanalyse er sentral i fertilitetsutredningen. Vi analyserer etter WHO-standard.", faqs: [{ question: "Forberedelse?", answer: "2-7 dagers avholdenhet." }, { question: "Pris?", answer: "Kr 1 950." }] },
  { key: "fertilitet/teamet", title: "Fertilitetsteamet", subtitle: "Møt teamet som hjelper deg med å oppfylle barneønsket.", parentCategory: "Fertilitet", description: "Vårt fertilitetsteam består av erfarne reproduksjonsmedisinere, gynekologer, embryologer, sykepleiere og psykologer.", benefits: ["Erfarne reproduksjonsmedisinere og gynekologer", "Spesialiserte embryologer med internasjonal erfaring", "Dedikerte fertilitets-sykepleiere for daglig oppfølging", "Psykolog for emosjonell støtte under behandlingen", "Tverrfaglig samarbeid for best mulig resultat"], faqs: [{ question: "Hvem er min kontaktperson?", answer: "Du får en dedikert fertilitets-sykepleier." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },

  // ==========================================
  // ORTOPEDI
  // ==========================================
  { key: "ortopedi/fot-ankel", title: "Fot og ankel", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Ortopedi", description: "Vi tilbyr alle subspesialiteter innen ortopedisk kirurgi. Bestill time hos en erfaren ortoped med kort ventetid.", sections: [{ id: "kompartment-syndrom", heading: "Kompartment-syndrom", content: "Muskelhinnen er ikke ettergivende og tøyes ikke i forhold til muskulaturen." }, { id: "ballettankel", heading: "Ballettankel", content: "I ankelen kan trange forhold baktil gi bakre impingement." }, { id: "haglunds-hael", heading: "Haglunds hæl", content: "Mellom hælbeinet og achillessenen finnes en slimpose." }, { id: "achilles-tendinalgi", heading: "Achilles tendinalgi", content: "Achilles tendinalgi er egentlig flere tilstander som benevnes med samme navn." }], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "ortopedi/hofte", title: "Hofte", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Ortopedi", description: "Behandling av skader i selve hofteleddet kan med moderne teknikk utføres som kikkhullsoperasjon.", relatedSpecialists: ["kristian-marstrand-warholm"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "ortopedi/hand-albue", title: "Hånd og albue", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Ortopedi", description: "Vi tilbyr alle subspesialiteter innen ortopedisk kirurgi.", sections: [{ id: "tennisalbue", heading: "Tennisalbue", content: "Diagnosen stilles ved vanlig undersøkelse og eventuelt ultralyd." }, { id: "handleddsartroskopi", heading: "Håndleddsartroskopi", content: "Artroskopi av håndleddet er brukt for å stille en riktig diagnose." }, { id: "carpal-tunnel", heading: "Carpal tunnel syndrom", content: "Carpal tunnel syndrom er en vanlig årsak til smerter og nummenhet i hånd og fingre." }], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "ortopedi/kne", title: "Kne", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Ortopedi", description: "Vi tilbyr alle subspesialiteter innen ortopedisk kirurgi.", sections: [{ id: "bruskskader", heading: "Bruskskader i kneet", content: "Artrose, eller slitasjegikt, er en progressiv degenererende sykdom." }], relatedSpecialists: ["marc-jacob-strauss"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "ortopedi/skulder", title: "Skulder", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Ortopedi", description: "Vi tilbyr alle subspesialiteter innen ortopedisk kirurgi.", sections: [{ id: "kalkskulder", heading: "Kalkskulder", content: "Årsaken til kalkskulder er kalk i senen." }, { id: "slap", heading: "SLAP", content: "SLAP er øvre leddleppe-skade i skulderbladskålen." }, { id: "frozen-shoulder", heading: "Frozen shoulder", content: "Frozen shoulder er en betennelse i leddhinnen i skulderleddet." }], relatedSpecialists: ["tom-henry-sundoen"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },

  // ==========================================
  // FLERE FAGOMRÅDER
  // ==========================================
  { key: "flere-fagomrader/endokrinologi", title: "Endokrinologi", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Flere fagområder", description: "Endokrinologi er en medisinsk spesialitet som handler om hormonsystemet og sykdommer knyttet til kjertler som produserer hormoner.", benefits: ["Erfarne endokrinologer med spisskompetanse", "Grundig hormonutredning med blodprøver og bildeundersøkelser", "Individuelt tilpasset behandling og oppfølging", "Tverrfaglig samarbeid med ernæringsfysiolog"], relatedSpecialists: ["ersan-krckov"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "flere-fagomrader/hudlege", title: "Hudlege", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Flere fagområder", description: "Dermatologi og venerologi er et medisinsk fagfelt som omhandler hud, hår, negler og slimhinner.", benefits: ["Bredt spekter av hudlidelser – akne, eksem, rosacea, psoriasis", "Føflekksjekk og fjerning ved behov", "Behandling av hudkreft og autoimmune tilstander", "Grundig vurdering tilpasset din hud"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "flere-fagomrader/ernaringsfysiolog", title: "Ernæringsfysiolog", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Flere fagområder", description: "Vår kliniske ernæringsfysiolog gir deg veiledning innen kosthold og livsstil, skreddersydd til deg og dine behov.", sections: [{ id: "formalet", heading: "Formålet", content: "Målet er å hjelpe folk med å oppnå og beholde god helse ved å følge riktig kosthold og ernæringsprinsipper." }, { id: "spesialisering", heading: "Spesialisering", content: "Vår kliniske ernæringsfysiolog Mari Borge Eskerud har spesialisering innen IBS og lavFODMAP-dietten." }], benefits: ["Spesialisering innen IBS og lavFODMAP-dietten", "Sertifisert av Monash University", "Kompetanse innen ernæring ved fertilitet, PCOS og graviditet", "Individuelt tilpasset kostholdsveiledning", "Tverrfaglig samarbeid med andre spesialister"], relatedSpecialists: ["mari-borge-eskerud"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "flere-fagomrader/gastrokirurgi", title: "Gastrokirurgi", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Flere fagområder", description: "Gastrokirurgi er en medisinsk spesialitet som omhandler kirurgiske inngrep i fordøyelsessystemet.", sections: [{ id: "bariatrisk-kirurgi", heading: "Bariatrisk kirurgi", content: "Med bariatrisk kirurgi kan vi tilby trygge og varige løsninger for vektreduksjon." }, { id: "sleeve-gastrektomi", heading: "Sleeve gastrektomi", content: "Robotassistert kirurgi for sleeve gastrektomi – rSG – er en moderne form for laparoskopisk overvektskirurgi." }], benefits: ["Robotassistert bariatrisk kirurgi (sleeve gastrektomi)", "Kikkhullsoperasjoner for gallestein", "Brokkbehandling med kikkehull og åpen teknikk", "Gratis digital førstekonsultasjon for fedmevurdering", "Tverrfaglig oppfølging med ernæringsfysiolog"], relatedSpecialists: ["marian-bale"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "flere-fagomrader/osteopati", title: "Osteopati", subtitle: "Kort ventetid • Ingen henvisning", parentCategory: "Flere fagområder", description: "Osteopati er en manuell behandlingsform som betyr at hendene er osteopatens viktigste verktøy for diagnostisering og behandling.", sections: [{ id: "kvinnehelse", heading: "Kvinnehelse", content: "På det tverrfaglige behandlingsteamet hos oss har osteopaten en naturlig plass i behandlingsplanen." }, { id: "behandling", heading: "Behandling", content: "Manuell behandling, fysisk aktivitet og håndtering av en stressende hverdag." }, { id: "tverrfaglig", heading: "Tverrfaglig", content: "Det unike på CMedical er at osteopatene jobber tett i tverrfaglig team med gynekolog og urolog." }, { id: "mal-med-behandling", heading: "Mål med behandling", content: "Osteopaten er opptatt av å finne hva som er viktig for deg." }], relatedSpecialists: ["ingvild-skarpas-aannerud"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "flere-fagomrader/plastikkirurgi", title: "Plastikkirurgi", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Flere fagområder", description: "Plastisk kirurgi kan hjelpe til med å gjenopprette kroppens form og funksjon etter for eksempel kreftsykdom, brannskader, graviditet og fødsel.", benefits: ["Bukplastikk og brystkirurgi", "Rekonstruktive behandlinger etter kreftsykdom", "Erfaren plastisk kirurg med individuelt tilpassede løsninger", "Avanserte teknikker i trygt medisinsk miljø"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "flere-fagomrader/psykologi", title: "Psykologi", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Flere fagområder", description: "Du trenger ikke å ha en psykisk lidelse eller diagnose for å gå til psykolog. Mange ønsker å ha en nøytral samtalepartner over kortere eller lengre tid.", sections: [{ id: "hva-kan-vi-hjelpe-med", heading: "Hva kan vi hjelpe med?", content: "Hos psykolog kan du få hjelp til å håndtere smerter, bearbeide vanskelige erfaringer, utforske identitet og seksualitet." }, { id: "fertilitetsradgivning", heading: "Fertilitetsrådgivning", content: "Psykologen i fertilitetsrådgivning jobber sammen med fertilitetsteamet." }], relatedSpecialists: ["linn-myrtveit-stensrud", "marthe-hagen"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "flere-fagomrader/revmatologi", title: "Revmatologi", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Flere fagområder", description: "Utredning og behandling av ledd- og bindevevssykdommer. Moderne biologisk behandling.", benefits: ["Erfarne revmatologer", "Grundig utredning", "Moderne behandling", "Tett oppfølging"], relatedSpecialists: ["birgir-gudbrandsson"], faqs: [{ question: "Henvisning", answer: "Ingen henvisning nødvendig." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "flere-fagomrader/robotkirurgi", title: "Robotkirurgi", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Flere fagområder", description: "Eneste private aktør i Norge med robotkirurgi. da Vinci-systemet på tvers av fagområder.", benefits: ["Eneste private aktør", "da Vinci-systemet", "Gynekologi, urologi og gastrokirurgi", "Kortere sykehusopphold", "Erfarne kirurger"], faqs: [{ question: "Hvilke inngrep?", answer: "Muskelknuter, endometriose, hysterektomi, brokk, RALP, RASP, fedmekirurgi." }, { question: "Trygt?", answer: "Ja, vel dokumentert." }] },
  { key: "flere-fagomrader/sexologi", title: "Sexologi", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Flere fagområder", description: "Når man rammes av sykdom eller helseutfordringer, enten fysiske eller psykiske, kan det også oppstå utfordringer knyttet til seksuell helse. Dette kan dreie seg om seksuell funksjon, lyst, tenning, selvbilde, kroppsbilde, seksuell glede, relasjoner eller identitet.\n\nEn sexolog kan gjennom terapeutiske samtaler gi støtte, veiledning og råd til enkeltpersoner eller par som opplever vanskeligheter knyttet til seksuell trivsel og intimitet.", sections: [{ id: "seksuell-helse", heading: "Seksuell helse", content: "Sexologen hos oss har spesialkompetanse innen seksuell helse knyttet til gynekologiske tilstander." }], relatedSpecialists: ["kjersti-margrete-finsrud"], faqs: [{ question: "Hva kan sexolog hjelpe med?", answer: "Smerter, nedsatt lyst, ereksjonsproblemer, intimitetsproblemer." }, { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg." }] },
  { key: "flere-fagomrader/areknuter", title: "Åreknutebehandling", subtitle: "Ingen ventetid • Ingen henvisning", parentCategory: "Flere fagområder", description: "Åreknuter kan gi smerter, hevelse og tyngdefølelse. Vi tilbyr moderne behandling.", benefits: ["Grundig ultralyd", "Moderne metoder", "Kort rekonvalesens", "Erfarne karkirurger"], relatedSpecialists: ["einar-andre-brevik", "gunnar-dalen"], faqs: [{ question: "Årsaker?", answer: "Svekkede klaffer, arv, svangerskap, overvekt, langvarig ståing." }, { question: "Pris utredning?", answer: "Kr 1 800 inkludert ultralyd." }] },
];

// ============================================================
// BUILD TREATMENT DOCUMENTS
// ============================================================
function buildTreatmentDocs(): Mutation[] {
  return treatments.map((t) => {
    const parts = t.key.split("/");
    const treatmentSlug = parts[1];
    const categoryRef = categoryRefs[t.parentCategory] || "category-flere-fagomrader";

    const doc: any = {
      _id: `treatment-${slug(t.key)}`,
      _type: "treatment",
      title: t.title,
      slug: { _type: "slug", current: treatmentSlug },
      subtitle: t.subtitle,
      category: { _type: "reference", _ref: categoryRef },
      parentCategoryLabel: t.parentCategory,
      description: t.description,
      benefitsTitle: t.benefitsTitle || "Hvorfor velge oss",
      benefits: t.benefits || [],
    };

    if (t.sections) {
      doc.sections = t.sections.map((s, i) => ({
        _type: "object",
        _key: `sec${i}`,
        id: s.id || `section-${i}`,
        heading: s.heading,
        content: s.content,
      }));
    }

    if (t.process) {
      doc.process = t.process.map((p, i) => ({
        _type: "object",
        _key: `step${i}`,
        title: p.title,
        description: p.description,
      }));
    }

    if (t.faqs) {
      doc.faqs = t.faqs.map((f, i) => ({
        _type: "object",
        _key: `faq${i}`,
        question: f.question,
        answer: f.answer,
      }));
    }

    if (t.relatedSpecialists) {
      doc.relatedSpecialists = t.relatedSpecialists;
    }

    if (t.linkedServices) {
      doc.linkedServices = t.linkedServices.map((ls, i) => ({
        _type: "object",
        _key: `ls${i}`,
        label: ls.label,
        description: ls.description,
        path: ls.path,
      }));
    }

    return { createOrReplace: doc };
  });
}

// ============================================================
// MAIN
// ============================================================
async function main() {
  console.log(`\n🏥 Migrating ${treatments.length} treatments to Sanity...`);
  console.log(`   Project: ${PROJECT_ID} | Dataset: ${DATASET}\n`);

  const mutations = buildTreatmentDocs();

  console.log(`📝 Submitting ${mutations.length} treatment documents...`);
  await submitMutations(mutations);

  console.log(`\n✅ Migration complete! ${mutations.length} treatments created/updated.\n`);
}

main().catch((err) => {
  console.error("❌ Migration failed:", err);
  process.exit(1);
});
