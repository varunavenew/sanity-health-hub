// Hero images - using existing assets
import gynekologiImg from "@/assets/categories/gynekologi.jpg";
import urologiImg from "@/assets/categories/urologi.jpg";
import fertilitetImg from "@/assets/categories/fertilitet.jpg";
import ortopediImg from "@/assets/categories/ortopedi.jpg";
import flereFagImg from "@/assets/categories/flere-fagomrader.jpg";
import heroTreatment from "@/assets/hero/hero-treatment.jpg";
import heroFamily from "@/assets/hero/hero-family.jpg";
import heroPregnancy from "@/assets/hero/hero-pregnancy.jpg";
import heroClinic from "@/assets/hero/cmedical-clinic.jpg";
import heroTech from "@/assets/hero/hero-technology.jpg";

export interface ContentSection {
  id?: string; // anchor id for scroll-to
  heading: string;
  content: string; // supports \n for paragraphs, **bold**, _italic_, - list items
}

export interface LinkedService {
  label: string;
  description: string;
  path: string;
}

export interface TreatmentData {
  title: string;
  subtitle: string;
  parentCategory: string;
  heroImage: string;
  description: string;
  sections?: ContentSection[];
  benefits?: string[];
  benefitsTitle?: string;
  process?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
  linkedServices?: LinkedService[];
  relatedSpecialists?: string[]; // slugs referencing specialists
}

// Key: "categoryId/subId" matching the route /behandlinger/:categoryId/:subId
export const treatmentContent: Record<string, TreatmentData> = {
  // ==========================================
  // GYNEKOLOGI
  // ==========================================
  "gynekologi/tverrfaglig": {
    title: "Tverrfaglig team: Osteopat, Sexolog, Psykolog, Ernæring",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Våre gynekologer jobber kun med den kvinnesykdommen de kan aller best, og ved behov jobber vi i unike ekspert team med psykolog, sexolog, ernæringsfysiolog, fysioterapeut, osteopat og uroterapeut. Denne tverrfagligheten er helt unik!\n\nVi tilbyr alt innen gynekologisk kirurgi, og vi er den første private aktøren som tilbyr robotkirurgi. Vår klinikk er den første private klinikken i Norden med IVF-behandling og kirurgi samlet under samme tak. Dette gir deg som gjennomgår fertilitetsbehandling en ro og trygghet om at vi kan løse de fleste utfordringer på et sted, her hos oss.\n\nVi har et svangerskapsteam som følger deg trygt igjennom graviditeten helt til fødsel, og våre eksperter på barsel står klare til å veilede deg videre på «6 ukers kontrollen». Dersom du skulle oppleve plager senere i livet er vi her for å hjelpe deg. Vi har kompetanse på alle gynekologiske tilstander - fra utredning, behandling og oppfølging i etterkant.",
    linkedServices: [
      {
        label: "Osteopat",
        description: "Manuell behandlingsform som komplementerer medisinsk utredning og behandling innenfor vulvasmerter, bekkenbunnsdysfunksjon og muskelskjelettplager.",
        path: "/behandlinger/flere-fagomrader/osteopati",
      },
      {
        label: "Sexolog",
        description: "Terapeutiske samtaler for støtte, veiledning og råd knyttet til seksuell helse, funksjon, lyst, selvbilde og intimitet.",
        path: "/behandlinger/flere-fagomrader/sexologi",
      },
      {
        label: "Psykolog",
        description: "Samtalepartner for å sortere tanker og følelser, håndtere smerter, og motta støtte gjennom utfordrende behandlingsforløp.",
        path: "/behandlinger/flere-fagomrader/psykologi",
      },
      {
        label: "Ernæringsfysiolog",
        description: "Individuelt tilpasset kostholdsrådgivning med betydning for hormoner, fertilitet, overgangsalder og generell helse.",
        path: "/behandlinger/flere-fagomrader/ernaringsfysiolog",
      },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  "gynekologi/undersokelse": {
    title: "Gynekologisk undersøkelse",
    subtitle: "Trygg og grundig undersøkelse hos erfarne gynekologer.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "En gynekologisk undersøkelse er en viktig del av kvinners forebyggende helsearbeid. Hos CMedical utfører vi grundige undersøkelser i trygge omgivelser med erfarne gynekologer.\n\nVi anbefaler regelmessige gynekologiske kontroller for å forebygge og oppdage eventuelle tilstander tidlig. Undersøkelsen tilpasses dine behov og bekymringer.",
    benefits: [
      "Erfarne gynekologer med lang klinisk erfaring",
      "Moderne utstyr og fasiliteter",
      "Tid til grundig samtale og undersøkelse",
      "Rask oppfølging ved eventuelle funn",
      "Kort ventetid – de fleste får time innen 1-3 dager",
    ],
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
  "gynekologi/urinlekkasje": {
    title: "Urinlekkasje",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Nesten 25 % av alle kvinner rammes av urinlekkasje i løpet av livet - noe som gir redusert livskvalitet. Hos oss møter du noen av landets fremste eksperter på urinlekkasje og du får effektiv behandling for alle typer urinveislekkasje, tilpasset deg.",
    sections: [
      {
        id: "stressinkontinens",
        heading: "Typer urinlekkasje",
        content: "**Stressinkontinens**\nUrinlekkasje ved fysisk aktivitet, hoste eller latter skyldes oftest svekkelse i bindevev/muskulatur som holder urinrør og urinblære på plass. Stressinkontinens oppstår typisk grunnet skader som kommer etter fødsler eller tungt fysisk arbeid.\n\n**Tranginkontinens**\nEn plutselig sterk trang til å late vannet etterfulgt av lekkasje. Man er ofte plaget av hyppig toalettbesøk, hvor man ikke alltid når frem i tide. Dette skyldes feil i nervesignalene til blæremuskelaturen slik at denne trekker seg sammen ukontrollert og ofte.\n\n_Kronisk UVI eller betennelse i blæreveggen kan forveksles med trang, dette kan vi også behandle._\n\n**Blandingsinkontinens**\nKombinasjon av stress og trang, hvilken type som dominerer avhenger fra person til person.\n\nEr du plaget med dette anbefaler vi deg å ta kontakt med oss.",
      },
      {
        id: "behandling",
        heading: "Behandling",
        content: "Hvilken behandling vi anbefaler deg avhenger av hvilken type lekkasje du har, hvor mye du lekker og dine risikofaktorer (BMI, tidligere kirurgi osv.).\n\nDet finnes trygge og effektive behandlinger, som for eksempel blæretrening, bekkenbunnstrening, medikamentell behandling eller ulike typer operasjoner.\n\nVed samtidig vaginale fremfall og stressurinlekkasje vil man bestandig operere det vaginale fremfallet først. Har du spørsmål om dette kan du alltid kontakte oss for en uforpliktende prat.",
      },
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
  "gynekologi/endometriose": {
    title: "Endometriose",
    subtitle: "Spesialisert diagnostikk og behandling av endometriose og adenomyose.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Endometriet = slimhinnen i livmoren.\n\nHver måned vokser slimhinnen i takt med hormonsyklus, og den blir avstøtt ved mens før den bygges opp igjen. Ved endometriose vokser vev som ligner livmorslimhinnen utenfor livmorhulen. Endometriose rammer oftest kvinner i fertil alder.\n\nDet tar i gjennomsnitt syv år å bli diagnostisert i Norge – **dette vil vi endre.**\n\nVi har unik ekspertise og lang erfaring med endometriose.",
    sections: [
      {
        id: "symptomer",
        heading: "Symptomer",
        content: "Symptomene på endometriose er individuelle. Det vanligste symptomet er smerter ved menstruasjon eller utenom. Smertene kan variere i styrke fra minimale menstruasjonssmerter til invalidiserende smerter. Andre symptomer kan være kvalme, diaré eller forstoppelse, økt trettbarhet, smerter ved vannlatning eller ved samleie. Omtrent 10% av kvinner rammes, og hele 30% av disse lider av underlivssmerter.",
      },
      {
        id: "kirurgi",
        heading: "Kirurgi",
        content: "Vi tilbyr både tradisjonell kikkhullskirurgi (laparoskopi) og robotkirurgi ved sanering av endometriose. CMedical er den eneste private aktøren i Norge som tilbyr operasjon med robot ved endometriose. Robotkirurgi er en presis og skånsom operasjonsmetode.\n\nVed kirurgi vil endometriose på bukhinnen, i bekkenet, arrvev og sammenvoksinger klippes bort. Roboten er spesielt egnet til finkirurgi der en vil unngå nærliggende nerver og blodkar.",
      },
    ],
    faqs: [
      { question: "Hva er symptomene på endometriose?", answer: "Vanlige symptomer er sterke menssmerter, kroniske bekkensmerter, smerter ved samleie og i noen tilfeller redusert fertilitet." },
      { question: "Kan endometriose påvirke fertiliteten?", answer: "Ja, endometriose kan påvirke fertiliteten. Vi har tett samarbeid med fertilitetsklinikken for å gi best mulig hjelp." },
      { question: "Hva er robotkirurgi?", answer: "Robotassistert kirurgi gir kirurgen bedre presisjon og oversikt, noe som er spesielt viktig ved dyp endometriose nær vitale organer." },
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  "gynekologi/overgangsalder": {
    title: "Overgangsalder",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Symptomer på overgangsalderen starter ofte i første halvdel av 40-årene, opplevelsene kan variere mye fra kvinne til kvinne. For noen er overgangen knapt merkbar, mens andre opplever så store utfordringer at det påvirker hverdagen deres betydelig.\n\nHos CMedical møter du et dedikert ekspert-team av spesialister på overgangsalder. Våre eksperter er medlemmer av British Menopause Society og samarbeider tett med Newson Health i Storbritannia, som er verdens ledende klinikk innen overgangsalder. Behandlingsmetodikken vår bygger på «de fire søylene» – hormoner, relasjoner, ernæring og fysisk form – som sammen sikrer en helhetlig tilnærming til dine behov.",
    sections: [
      {
        id: "symptomer",
        heading: "Symptomer",
        content: "Overgangsalderen kan først merkes gjennom uregelmessige menstruasjoner og hetetokter, endringer i humør og en generell reduksjon i energinivå. Etter hvert kan symptomene øke, og de kan oppleves både fysisk og psykisk vanskelige.\n\nVanlige symptomer inkluderer:\n- Blødningsforstyrrelser\n- Hetetokter\n- Hjernetåke/konsentrasjonsvansker\n- Redusert hukommelse\n- Ta lettere til tårene/emosjonell\n- Søvnproblemer\n- Endringer i hud og hår\n- Smerter i ledd og muskler\n- Hyppigere hodepine\n- Redusert sexlyst\n- Økt irritabilitet\n- Urinveisinfeksjoner og tørrhet i skjeden\n\nMenopausen er egentlig bare en dato i kvinners liv, definert som uteblitt menstruasjon i 12 måneder. Tiden før dette med symptomer kalles perimenopausal, tiden etter for postmenopausal. På lengre sikt øker risikoen for tilstander som beinskjørhet, hjerte- og karsykdommer, høyt kolesterol, høyt blodtrykk, depresjon og demens. Dette skyldes nedgang i østrogen-, progesteron- og testosteronproduksjonen. Heldigvis finnes trygge og effektive behandlingsalternativer som hjelper deg med å håndtere symptomene, gir økt livskvalitet og reduserer risiko for fremtidige helseproblemer.",
      },
      {
        id: "behandling",
        heading: "Behandling",
        content: "En kartleggingssamtale er en personlig og grundig konsultasjon med en eller flere av våre spesialister. Målet er å forstå dine individuelle utfordringer og behov i forbindelse med overgangsalderen. Samtalen varer i omtrent 45 minutter og inkluderer:\n- En detaljert gjennomgang av sykdomshistorie og livssituasjon.\n- Gynekologisk undersøkelse og relevante blodprøver ved behov.\n- Utarbeidelse av en tilpasset behandlingsplan.\n\nI samråd med deg kan vi tilby tverrfaglig oppfølging for å styrke behandlingen. Dette kan inkludere samarbeid med ernæringsfysiolog, osteopat, sexolog eller psykolog, basert på dine ønsker og behov.\n\nEn oppfølgingstime må bestilles etter 6 måneder. Våre eksperter er tilgjengelige ved ytterligere behov.\n\nVårt mål er å tilby deg en helhetlig og tilpasset behandling som gir merkbare forbedringer i din helse og livskvalitet gjennom overgangsalderen.\n\nVi hjelper deg med å ta hverdagen tilbake. Hos oss møter du et kompetent og engasjert team som lytter, veileder og utvikler en behandlingsplan som er tilpasset dine utfordringer og behov.",
      },
      {
        id: "fastlegeveiledning",
        heading: "Fastlegeveiledning overgangsalder",
        content: "Vi har utarbeidet en egen veiledning for fastleger om utredning og behandling av peri- og menopausale kvinner. Veilederen baserer seg på Norsk gynekologisk veileder 2024, NICE NG23 (2024), British Menopause Society (BMS) retningslinjer og European Society of Endocrinology (ESE) kliniske retningslinjer 2025.\n\n[Les fastlegeveiledning for overgangsalder →](/fastlegeveiledning-overgangsalder)",
      },
    ],
    linkedServices: [
      {
        label: "Ernæringsfysiolog",
        description: "Kostholdsrådgivning tilpasset hormonelle endringer og overgangsalder.",
        path: "/behandlinger/flere-fagomrader/ernaringsfysiolog",
      },
      {
        label: "Osteopat",
        description: "Manuell behandling for smerter i ledd og muskler knyttet til hormonelle endringer.",
        path: "/behandlinger/flere-fagomrader/osteopati",
      },
      {
        label: "Sexolog",
        description: "Støtte og veiledning ved endringer i seksuell helse gjennom overgangsalderen.",
        path: "/behandlinger/flere-fagomrader/sexologi",
      },
      {
        label: "Psykolog",
        description: "Samtaleterapi for å håndtere emosjonelle utfordringer i overgangsalderen.",
        path: "/behandlinger/flere-fagomrader/psykologi",
      },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  "gynekologi/vaginale-fremfall": {
    title: "Vaginale fremfall",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Vaginalt fremfall, også kjent som prolaps, er en tilstand der organer som livmoren, blæren eller endetarmen faller ned fra deres vanlige posisjon og presser inn i skjeden. Dette skjer vanligvis på grunn av svekkelse av bekkenbunnsmuskulaturen og støttevev, som kan være forårsaket av faktorer som graviditet, fødsel, aldring eller kirurgiske inngrep.",
    sections: [
      {
        id: "behandling",
        heading: "Behandling",
        content: "Behandlingen avhenger av alvorlighetsgraden av tilstanden og symptomene, og det kan inkludere bekkenbunnstrening, bruk av støtteinnretninger, eller i mer alvorlige tilfeller, kirurgiske inngrep. Det er viktig å oppsøke helsepersonell for en grundig vurdering og rådgivning hvis man opplever symptomer på vaginalt fremfall.\n\nHos oss møter du noen av Nordens fremste eksperter på fremfall. Ta kontakt for mer informasjon eller bestill en konsultasjon.",
      },
    ],
    relatedSpecialists: ["madeleine-engen"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  "gynekologi/blodningsforstyrrelser": {
    title: "Blødningsforstyrrelser",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Blødningsforstyrrelser kan være at intervallet mellom menstruasjonene endrer seg, at de blir hyppigere eller sjeldnere. Det kan være at mengden blod som kommer hver gang øker eller minker, eller det kan være blødninger som kommer mellom menstruasjoner.\n\nHvis man opplever mensen som plagsomt stor, uregelmessig eller smertefull, bør dette undersøkes hos gynekolog. Da vil vi gjøre ultralyd og ta ulike prøver for å finne ut av hvorfor du har blødningsforstyrrelser.",
    sections: [
      {
        id: "vanlige-arsaker",
        heading: "Vanlige årsaker",
        content: "Vanlige årsaker til blødningsforstyrrelser kan være overgangsalder, seksuelt overførbare infeksjoner, polypper eller muskelknuter, graviditet eller hormonelle ubalanser.\n\nBlødningsforstyrrelser som kommer etter _overgangsalderen_ skal alltid utredes. Det gjøres gjerne med ultralyd og en vevsprøve fra livmorhulen. Videre oppfølging og behandling avhenger av dette prøvesvaret.",
      },
      {
        id: "prevensjon",
        heading: "Prevensjon",
        content: "Dersom man bruker prevensjon kan man få uregelmessige blødninger på grunn av det. Det er sjelden farlig, og som oftest er det bare å bytte prevensjonsmiddel så blir det bedre. Opplever du plager kan du alltid ta kontakt med oss eller bestille time.",
      },
    ],
    relatedSpecialists: ["birgitte-mitlid-mork", "birgitte-aspenes"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  "gynekologi/celleforandringer": {
    title: "Celleforandringer",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Celleforandringer er forstadier til kreft og kalles dysplasier. Det finnes flere stadier i økende alvorlighetsgrad. Hvorvidt celleforandringene skal behandles avhenger av hvor alvorlige de er og hvilken type HPV du har.",
    sections: [
      {
        id: "hpv",
        heading: "HPV og celleforandring",
        content: "Over 25.000 kvinner får hvert år konstatert unormale celler ved undersøkelse av livmorhalsen. Av disse behandles cirka 3000 kvinner for celleforandringer. Samtidig får cirka 300 kvinner livmorhalskreft i året.\n\nUtviklingen av livmorhalskreft tar flere år.\n\nScreening med HPV-test hvert femte år redder liv. Hvis du har fått påvist og/eller er behandlet for HPV eller celleforandringer, følges du opp tettere. Ønsker du å ta en celleprøve eller snakke med en av våre gynekologer kan du alltid kontakte oss eller bestille time.",
      },
      {
        id: "behandling",
        heading: "Behandling",
        content: "Lavgradige celleforandringer i livmorhalsen går ofte tilbake av seg selv. De behandles kun hvis de vedvarer. Ved lavgradige celleforandringer anbefales det å ta en ny celleprøve om 12 måneder.\n\nHøygradige celleforandringer behandles individuelt. Her henvises man først til gynekolog som utfører kolposkopi. Det er en vanlig undersøkelse der gynekologen studerer livmorhalsen ved hjelp av et mikroskop. Samtidig tas det også en vevsprøve (biopsi) fra både livmorhalskanalen og livmortappen for å nærmere studere funnene fra celleprøven.\n\nDersom man trenger behandling gjøres det med et lite kirurgisk inngrep som kalles konisering.",
      },
      {
        id: "konisering",
        heading: "Konisering",
        content: "Konisering er et lite kirurgisk inngrep hvor en liten del av det ytterste laget på livmorhalsen fjernes. Inngrepet forhindrer celleforandringene fra å utvikle seg til livmorhalskreft.\n\nHos vår klinikk på Bekkestua tilbyr vi konisering i lokalbedøvelse. Inngrepet tar vanligvis rundt 15 minutter, og du blir godt ivaretatt i rolige og trygge omgivelser.\n\nVi vet at dette kan oppleves som en sårbar situasjon, derfor legger vi stor vekt på å møte deg med trygghet og omsorg gjennom hele prosessen. Inngrepet blir utført i narkose om du er veldig engstelig.",
      },
    ],
    relatedSpecialists: ["birgitte-aspenes", "ane-gerda-z-eriksson", "siri-klokstad"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  "gynekologi/cyster": {
    title: "Cyster på eggstokkene",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Cyster på eggstokkene er veldig vanlig og i de fleste tilfeller helt ufarlig.\n\nHver måned modnes ett egg i en av eggstokkene. Dette ligger inni i en vannpose som blir ca 2 cm stor før den sprekker. Av og til kan det dannes flere slike vannposer eller cyster som ikke sprekker, men som får vokse videre. Disse kan iblant bli ganske store og gi smerter og ubehag nederst i magen, særlig ved samleie og bevegelse. Disse cystene kalles funksjonelle cyster og blir som oftest borte av seg selv etter omtrent tre menstruasjonssykluser.\n\nHar du spørsmål knyttet til dette kan du alltid kontakte oss.",
    sections: [
      {
        id: "former-for-cyste",
        heading: "Former for cyste",
        content: "Andre typer cyster er dermoider, endometriomer eller cystadenomer. Disse ser litt annerledes ut på ultralyd, og derfor kan vi skille dem fra funksjonelle cyster. Dette er også godartede cyster, men disse blir ikke borte av seg selv og må noen ganger opereres bort, særlig hvis de blir store og gir plager.",
      },
      {
        id: "for-og-etter-overgangsalder",
        heading: "Før og etter overgangsalder",
        content: "Hos kvinner før overgangsalder er de aller fleste cyster godartede. Hvis gynekologen finner en cyste ved ultralydundersøkelse, blir du fulgt opp videre med ultralyd, avhengig av hva slags cyste det er du har. Det er som oftest ikke nødvendig med blodprøve.\n\nEtter overgangsalder er det mindre vanlig med cyster og risikoen for at en cyste er ondartet er større. Her vil det være viktig med blodprøve, flere ultralydundersøkelser og andre bildeundersøkelser før man eventuelt opererer bort cysten.",
      },
      {
        id: "behandling",
        heading: "Behandling",
        content: "Cyster på eggstokkene av en viss størrelse, som ikke blir borte av seg selv og som gir plager, er det anbefalt å operere bort. Dette gjøres vanligvis ved hjelp av en kikkehullsoperasjon. Da får man narkose og kirurgen fjerner cysten gjennom 3-4 hull i magen din. Inngrepet tar omtrent 45 minutter, men dette avhenger blant annet av hvor store cystene er. Ønsker du å snakke med en spesialist på dette, bestill time.",
      },
    ],
    relatedSpecialists: ["ane-gerda-z-eriksson", "birgitte-aspenes", "henrik-michelsen-wahl"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  "gynekologi/fjerne-livmor": {
    title: "Fjerne livmor",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Fjerning av livmor (hysterektomi) anbefales ved plagsomme muskelknuter (myomer), blødningsforstyrrelser, kreft i livmor eller livmorhals. Det kan også være aktuelt ved endometriose eller ved vedvarende celleforandringer i livmorhals. Ved operasjonen fjernes livmoren i sin helhet, eggstokker blir stående igjen dersom man ikke er kommet i overgangsalderen.",
    sections: [
      {
        id: "hysterektomi",
        heading: "Fjerning av livmor (hysterektomi)",
        content: "Det finnes flere operasjonsmetoder for å fjerne livmoren. Vi fjerner livmoren skånsomt ved hjelp av kikkhullskirurgi eller robotassistert kirurgi. Vi er den eneste private aktøren som tilbyr robotassistert kirurgi - en mer skånsom og presis operasjonsmetode. En sjelden gang ved vanskelig anatomi kan det bli nødvendig å lage et lite snitt (litt mindre enn et keisersnitt) i bikinilinjen.\n\nEr du pasient hos oss får du detaljert informasjon om inngrepet, risiko for komplikasjoner og hvordan du skal forholde deg i tiden etter operasjon. Du vil også få telefonnummeret til kirurgen. Det er få bivirkninger av inngrepet og seksuelt kan du fungere som før.\n\nVåre kirurger er noen av Nordens ledende kirurger innen gynekologisk kikkhull og robotassistert kirurgi.\n\nVi sørger for at du blir trygt ivaretatt igjennom hele behandlingsforløpet.\n\n[Les mer om robotassistert kirurgi →](/robotassistert-kirurgi)",
      },
      {
        id: "pasienthistorie",
        heading: "Pasienthistorie",
        content: "_Kine, 37 år:_\n\n«For et år siden fikk jeg et nytt liv takket være hjelp fra CMedical. Jeg hadde i flere år gått med en stor muskelknute i livmora mi og i og med at jeg ikke hadde fått barn var beskjeden jeg fikk fra det offentlige at jeg var for ung til å få fjernet livmora - jeg var jo tross alt enda fertil.\n\nEtter mye om og men ble jeg endelig hørt i mitt ønske om å få utført en full hysterektomi og gjennom helseforsikringen min kom jeg da i kontakt med CMedical. Her ble jeg møtt av et helt nydelig team, en fantastisk kirurg og sykepleiere med en enorm omsorg. Operasjonen gikk veldig bra og jeg følte meg trygg gjennom hele besøket.\n\nJeg ble godt ivaretatt fra jeg kom inn dørene på klinikken, videre inn på operasjonsstuen, på oppvåkningen og det neste døgnet som jeg tilbrakte der. Her er det profesjonalitet i alle ledd, hjerterom og mennesker som bryr seg om mennesker.\n\nTusen tusen takk for hjelpen!»",
      },
    ],
    relatedSpecialists: ["ane-gerda-z-eriksson", "henrik-michelsen-wahl", "thomas-fredrik-thaulow"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  "gynekologi/graviditet": {
    title: "Graviditet",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: heroPregnancy,
    description: "Vi ønsker deg velkommen til oppfølging gjennom hele svangerskapet. Vi tilbyr fosterdiagnostikk, som NIPT og tidlig ultralyd. Hos oss jobber fødselsleger, gynekologspesialister og fostermedisinere. Deres kompetanse er din trygghet.",
    sections: [
      {
        id: "ultralyd",
        heading: "Ultralyd",
        content: "Vi skiller mellom tidlig ultralyd uke 6–10, uke 11–14, og ultralyd fra uke 14+0. Tidlig ultralyd uke 6-10 utføres ved hjelp av en innvendig probe. Dette er helt ufarlig og smertefritt for både barnet og deg. Fra uke 11 utføres ultralyd med utvendig (abdominal) ultralydprobe.\n\nOm undersøkelsen viser tegn på alvorlig sykdom eller skader hos fostret, vil du få veiledning og samtale med lege, og eventuelt henvisning til fostermedisinsk avdeling ved sykehuset.\n\nDersom du ønsker, er det fullt mulig å ta med seg en partner eller en støttespiller til ultralydtimen. Ved tidlig ultralydundersøkelse vil du få være avskjermet. Hos oss er det viktig at du føler deg komfortabel og trygg.\n\nHos oss møter du høyt kompetente, erfarne og dedikerte gynekologer med spesialisering innen fostermedisin, også kalt fostermedisinere.",
      },
      {
        id: "nipt",
        heading: "NIPT",
        content: "Fra og med svangerskapsuke 10 kan du ta NIPT-test og tidlig ultralyd hos oss. NIPT er en forkortelse for Non-Invasive Prenatal Test. Ved hjelp av en blodprøve fra armen til mor, kombinert med en ultralydundersøkelse, kan man undersøke om fosteret har trisomi 13, 18 eller 21, også kjent som kromosomavvik. Da vi kun trenger en blodprøve fra mor, er det derfor ingen økt risiko for abort som for eksempel ved morkakeprøve eller fostervannsprøve.\n\n[Dr. Ashi Ahmad](/spesialister/ashi-ahmad) hos oss har fått virksomhetsgodkjenning for å tilby fosterdiagnostikk til gravide kvinner. Ashi Ahmad er spesialist i gynekologi og fødselshjelp og har doktorgrad i epidemiologi og fødselshjelp.\n\nBestill konsultasjon eller ta kontakt hvis du lurer på noe.",
      },
      {
        id: "6-ukerskontroll",
        heading: "6-ukerskontroll",
        content: "Ved 6-ukerskontrollen vil du treffe medgründer og gynekolog [Madeleine Engen](/spesialister/madeleine-engen). Hun har særlig erfaring med fødselsskader som kan føre til [vaginale fremfall](/behandlinger/gynekologi/vaginale-fremfall) eller [urinlekkasje](/behandlinger/gynekologi/urinlekkasje). Ta gjerne med deg epikrisen fra oppholdet på sykehuset til konsultasjonen.\n\nPå denne kontrollen vil hovedfokuset være mors bekken. Dersom du ønsker så forklarer Madeleine endringer i underlivet ved hjelp av speil eller tegninger. Hun sjekker også hvor god kontroll og kontakt du har med bekkenbunnsmuskulaturen. Videre forklares eventuelle skader du har, hvordan man kan forebygge disse videre og hva man kan forvente i fremtiden.\n\n- Kort om svangerskap og fødsel\n- Renselse, amming\n- Mors psykiske helse\n- Sex og samliv\n- Prevensjon/prevensjonsveiledning\n- På indikasjon tar vi BT, puls eller blodprøver",
      },
      {
        id: "traumatisk-fodsel",
        heading: "Traumatisk fødsel",
        content: "En av tre opplever fødselen sin som traumatisk og rundt 4 % har en så vanskelig fødselsopplevelse at det går utover hverdagen. Søvn, relasjon til barnet og partner og ikke minst en fødselsdepresjon kan gjøre livet ekstra vanskelig. Da er det viktig å kunne snakke seg gjennom og finne frem til løsninger i hverdagen.\n\nVanskelige fødselsopplevelser kan også påvirke tankene negativt med tanke på å tørre og bli gravid på nytt eller skape en sterk angst for forestående fødsel ved ny graviditet.",
      },
      {
        id: "fodselsangst",
        heading: "Fødselsangst",
        content: "En av fem sliter med mentale helseplager i svangerskapet. Dessverre føler mange gravide at de ikke får den hjelpen de trenger. Fødselsangst kan være vanskelig å definere og det levde livet er ofte med å påvirke tankene negativt.\n\nHos oss møter du erfaren fødselslege som vil både hjelpe deg med å besvare spørsmålene du har og finne frem til en trygghet rundt det du skal gjennom.",
      },
      {
        id: "for-partnere",
        heading: "For partnere",
        content: "Partnere kan også ha det tungt i graviditeten, under og etter fødsel. Dette blir snakket lite om og partner får sjeldent fokus på helsestasjonen eller på fødestuen. Rundt 8 % av partnere får PTSD etter fødsel og kan kjenne seg hjelpeløse i forhold til det og den nye tilværelsen som forelder. Det er også mange partnere som har fødselsangst og fødselsdepresjon.",
      },
    ],
    relatedSpecialists: ["ashi-ahmad", "madeleine-engen"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  "gynekologi/kirurgi": {
    title: "Gynekologisk kirurgi",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: heroTech,
    description: "CMedical tilbyr vi en rekke gynekologiske operasjoner utført av håndplukkede kirurger, som er ledende innen sine felt. Hos oss er både trygghet og god kommunikasjon viktig, og vi sørger for at du føler deg godt ivaretatt gjennom hele behandlingsforløpet.\n\nNår en operasjon er den beste løsningen for deg, vil vår operasjonskoordinator hjelpe deg med å finne en passende dato. Du får grundig informasjon om inngrepet og oppfølgingen, og kirurgen vil være tilgjengelig for deg også etter operasjonen.",
    sections: [
      {
        id: "tjenester",
        heading: "Våre tjenester innen gynekologisk kirurgi",
        content: "- Fremfalloperasjoner: For prolaps i skjedevegger, livmorhals eller livmor. [Les mer →](/behandlinger/gynekologi/vaginale-fremfall)\n- Urinlekkasjeoperasjoner: Behandling av alle typer urinlekkasje. [Les mer →](/behandlinger/gynekologi/urinlekkasje)\n- Hysterektomi: Fjerning av livmor ved blødningsproblemer eller smerter. [Les mer →](/behandlinger/gynekologi/fjerne-livmor)\n- Polypper og muskelknuter: Fjerning ved hysteroskopi eller laparoskopi.\n- Endometriosebehandling: Avanserte inngrep utført av erfarne spesialister. [Les mer →](/behandlinger/gynekologi/endometriose)\n- Fjerning av eggstokkcyster, arrvev og celleforandringer.\n- Labiaplastikk/reduksjon av de små kjønnsleppene. [Les mer →](/behandlinger/gynekologi/labiaplastikk)",
      },
      {
        id: "robotkirurgi",
        heading: "Robotassistert kirurgi",
        content: "Som den eneste private aktøren i Norge tilbyr vi robotassistert gynekologisk kirurgi. Dette sikrer presisjon og skånsomhet, og reduserer risikoen for komplikasjoner. Metoden er særlig fordelaktig ved kompleks anatomi og ved endometriose.\n\nUnder inngrepet er kirurgen alltid til stede og styrer roboten direkte fra operasjonsstuen. Med en 180-graders rotasjonsdyktig «hånd» kan roboten nå frem på områder i buk og bekken som ellers er vanskelig tilgjengelige. Denne metoden reduserer risikoen for blødninger, nerveskader og skader på organer som tarm og blære, og gir kortere sykehusopphold etter operasjonen.\n\nRobotassistert kirurgi er spesielt fordelaktig ved kompliserte tilfeller som endometriose og vanskelig tilgjengelig anatomi, og våre erfarne kirurger er blant landets fremste på området.\n\n[Les mer om robotkirurgi →](/robotassistert-kirurgi)\n\nØnsker du mer informasjon, eller har du spørsmål om andre operasjoner? Ring oss gjerne – vi er her for å hjelpe deg.\n\n_Ikke aksepter å leve med plager vi kan hjelpe deg med._",
      },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Forsikring", answer: "Vi har forsikringsavtale med EuroAccident, Falck, Fremtind, Gjensidige, If Vertikal Helse, Storebrand og Tryg. Sjekk med ditt forsikringsselskap hva din forsikring dekker." },
    ],
  },
  "gynekologi/hormonforstyrrelser": {
    title: "Hormonforstyrrelser",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Hormonforstyrrelser refererer til unormale nivåer av hormoner i kroppen, enten det er for mye, for lite eller ujevn produksjon av visse hormoner. Les mer under om ulike sykdommer.",
    sections: [
      {
        id: "pcos",
        heading: "PCOS",
        content: "Polycystisk ovariesyndrom (PCOS) kjennetegnes ved at kjønnshormonene er i ubalanse. Dette kan føre til at eggcellene ikke får modnet og at eggløsning uteblir. Det kan igjen føre til at man mister eller får sjeldne menstruasjoner. Kvinner med PCOS kan oftere oppleve ufrivillig barnløshet og trenger hyppigere hjelp til å bli gravid. Kvinner med sjelden eller uteblitt menstruasjon bør benytte prevensjon eller 2-4 ganger i året ta tabletter som gir blødning. Dette for å unngå risiko for celleforandringer i livmorslimhinnen og som på sikt kan forårsake endometriekreft.\n\nMange opplever også insulinresistens, og de har økt risiko for å utvikle diabetesmellitus type 2, samt høyt kolesterol og blodtrykk. Risikoen for hjerte- og karsykdommer øker også.\n\nPCOS er ikke en spesifikk endokrin sykdom, men et syndrom med forskjellige symptomer og tegn. I dag har man landet på at pasienten må oppfylle 2 av 3 kriterier for å få diagnosen:\n\n- Uregelmessige og sjeldne menstruasjoner\n- Polycystiske eggstokker\n- Hyperandrogenisme (økt behåring, akne og mannlig hårtap)\n\nDet finnes ingen kur mot PCOS, men det finnes medisiner og behandling som kan gjøre tilstanden bedre. Har du spørsmål knyttet til dette kan du snakke med en av våre sekretærer eller bestille en konsultasjon.",
      },
      {
        id: "pms-pmdd",
        heading: "PMS og PMDD",
        content: "Premenstruelt syndrom omfatter plagsomme fysiske og psykiske symptomer som opptrer regelmessig siste halvdel av syklus (lutealfasen). PMS (premenstruelt syndrom) er den milde formen som rammer opptil 75 % av alle kvinner, mens den alvorligere formen, PMDD (premenstruell dysforisk forstyrrelse) rammer 3-8 %.\n\nDe vanligste fysiske plagene er ømme bryst, oppblåsthet, magesmerter, vektøkning, hodepine, økt appetitt og tap av energi. Psykiske symptomer omfatter irritabilitet, humørsvingninger, depresjon, angst og indre uro. Noen kvinner kan også få selvmordstanker disse dagene.\n\nÅrsaken er relatert til svingende hormoner. Det er mulig å få god hjelp – du skal slippe å lide hver måned.\n\nFor spørsmål ta kontakt med oss eller bestill time.",
      },
    ],
    relatedSpecialists: ["birgitte-mitlid-mork", "birgitte-aspenes", "siri-klokstad"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
    ],
  },
  "gynekologi/hysteroskopi": {
    title: "Hysteroskopi",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Hysteroskopi er en skånsom gynekologisk undersøkelse der vi bruker et tynt instrument med kamera for å se inn i livmorhulen gjennom livmorhalsen. Undersøkelsen gir en grundig oversikt og gjør det mulig å oppdage årsaker til plager som ellers kan være vanskelig å finne.\n\nFordelen for deg som pasient er at vi ofte kan stille diagnose og eventuelt behandle i samme prosedyre. Hysteroskopi er et effektivt verktøy for å kartlegge:\n- Uregelmessige blødninger\n- Mistanke om polypper eller muskelknuter i livmoren\n- Vanskeligheter med å bli gravid\n- Forandringer i livmorslimhinnen\n\nGjennom moderne teknologi og skånsomt utviklede instrumenter legger vi vekt på å gi deg en trygg opplevelse med minst mulig ubehag under undersøkelsen hos oss i CMedical.",
    sections: [
      {
        id: "office-hysteroskopi",
        heading: "Office-hysteroskopi",
        content: "Vi tilbyr også office-hysteroskopi som kan gjennomføres uten narkose eller bedøvelse, og umiddelbart ved besøk hos gynekolog.",
      },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
    ],
  },
  "gynekologi/labiaplastikk": {
    title: "Labiaplastikk",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Det er normalt med ulik størrelse og utseende på kjønnslepper. Noen ganger gir store kjønnslepper smerter ved fysisk aktivitet som sykling, ridning, eller er i veien ved samleie. Da kan kirurgisk reduksjon av kjønnsleppene være løsningen.",
    sections: [
      {
        id: "labiaplastikk",
        heading: "Hva er labiaplastikk?",
        content: "Labiaplastikk er en kirurgisk prosedyre som reduserer størrelsen på labia minora, de indre kjønnsleppene.\n\n**Teknisk prosedyre**\n\nInngrepet gjennomføres i narkose og tar ca. 20 min. Det utføres ved hjelp av fine kirurgiske teknikker med skalpell og lett diatermi. Suturer skal ikke fjernes i etterkant, de løses opp av seg selv. Forhåndsregler etter operasjon får du nøye instrukser om under utredningen og på operasjonsdagen.\n\n**Risiko og bivirkninger**\n\nRisikoene inkluderer blødning, infeksjon, arrdannelse og følelsesløshet. Det er viktig å velge en erfaren kirurg for å minimere disse risikoene.\n\n**Gjenopptakelse og resultater**\n\nGjenopptakelsen tar vanligvis noen uker, og fullstendig heling kan ta flere måneder. De fleste pasienter opplever forbedret komfort og økt selvtillit etter prosedyren.",
      },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
    ],
  },
  "gynekologi/robotkirurgi": {
    title: "Robotkirurgi – Gynekologi",
    subtitle: "Nordens mest erfarne team innen robotassistert gynekologisk kirurgi.",
    parentCategory: "Gynekologi",
    heroImage: heroTech,
    description: "CMedical er den eneste private aktøren i Norge som tilbyr robotassistert kirurgi innen gynekologi. Med da Vinci-systemet utfører vi avanserte inngrep med minimalt invasiv teknikk.\n\nRobotkirurgi gir bedre presisjon, mindre blødning, kortere sykehusopphold og raskere rekonvalesens sammenlignet med tradisjonell åpen kirurgi.",
    benefits: [
      "Eneste private tilbyder av robotkirurgi i gynekologi i Norge",
      "da Vinci-systemet for maksimal presisjon",
      "Behandling av muskelknuter, dyp endometriose og hysterektomi",
      "Mindre smerter og kortere rekonvalesens",
      "Høyt volum – erfarne kirurger med dokumentert kvalitet",
    ],
    faqs: [
      { question: "Hvilke inngrep utføres med robot?", answer: "Vi bruker robot til fjerning av muskelknuter, dyp endometriose, hysterektomi og enkelte andre komplekse inngrep." },
      { question: "Er robotkirurgi trygt?", answer: "Ja, robotkirurgi er vel dokumentert internasjonalt og gir ofte bedre resultater enn tradisjonelle metoder." },
    ],
  },
  "gynekologi/spontanabort": {
    title: "Spontanabort",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "I følge internasjonale retningslinjer blir dessverre ikke kvinner med spontanabort fulgt opp tilstrekkelig i Norge. Spontanabort oppleves for de aller fleste som et tap og da hjelper det lite å høre at det er naturens gang. Uavhengig om dere har barn fra før, om dere har forsøkt lenge eller kort å bli gravid er det viktig å bli tatt på alvor med de tankene dere har.\n\nSelve aborten kan også ha vært en tung og smertefull opplevelse og mange kjenner seg utrygge på om alt er ute av kroppen. Med både ultralyd og samtale vil vi klargjøre og berolige.\n\nI dag vil de fleste få beskjed om å vente til opp mot tre spontanaborter før det utredes om alt er som det skal. Det skal du slippe hos oss. Vi gjør en vurdering om det ligger noen bakgrunn for at du har abortert.\n\nKun en prosent av alle gravide ender med en uønsket senabort, men det er ganske mange par som tar vanskelige valg etter tidlig fosterdiagnostisering og NIPT-test. Det å ha noen å snakke med rundt disse valgene kan være med å gjøre prosessen lettere. Hos CMedical kan du snakke med våre spesialister om vanskelige tanker.\n\nGjennom mange år har vi fulgt par som har mistet barnet i mors liv, under eller etter fødsel. Vi vil veilede dere som par både i den livskrisen dere er i, også vurdere andre tiltak ved eventuelt neste svangerskap og følge deg eller dere tett opp.",
    relatedSpecialists: ["birgitte-mitlid-mork", "ashi-ahmad"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
    ],
  },
  "gynekologi/vulvalidelser": {
    title: "Vulvalidelser",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Kompliserte sykdommer som vulvasykdommer trenger en tverrfaglig tilnærming. Vårt multidisiplinære team består derfor av gynekolog, hudlege, sexolog, psykolog og bekkenbunnsfysioterapeut. Avhengig av vulvovaginal lidelse og diagnose, vil man få tilbud om videre konsultasjon med andre spesialister.",
    sections: [
      {
        id: "infeksjoner",
        heading: "Infeksjoner",
        content: "I en normal flora i skjeden er det bakterier som beskytter og er en del av immunforsvaret for kvinnen. Det er likevel mulig å få en infeksjon eller ubalanse i vaginal floraen. Noen bakterier overføres seksuelt kjent som kjønnsykdommer og omhandler Chlamydia, Gonore og Syfillis. Disse skal alltid behandles for å unngå komplikasjoner. Andre tilstander som soppinfeksjoner skal behandles når de gir plager. Enkelte kvinner kan også få en ubalanse i normal flora enten gjennom bakteriell vaginose eller aerobisk vaginitt. Dette kan være svært plagsomt. Man kan enkelt diagnostisere disse tilstandene ved å gjøre mikroskopi av utstryk av utflod. Behandling vil da kunne startes etter denne undersøkelsen.",
      },
      {
        id: "vaginal-torrhet",
        heading: "Vaginal tørrhet",
        content: "Vaginal tørrhet er et symptom som plager mange kvinner. Vaginal tørrhet kan oppstå i ulike faser i løpet av livet, men hyppigst forekommer det i perimenopausen eller etter overgangsalder. Østrogen er viktig for å bevare elastisitet og fuktighet i skjeden. Ved mangel på østrogen kan mange oppleve tørrhet i skjeden som kan medføre hyppigere urinveisinfeksjoner, smerter ved samleie, sprekkdannelser i slimhinner, svie og kløe. Vulvaplager og vaginal tørrhet bør alltid undersøkes slik at man kan unngå de plager dette kan medføre.",
      },
      {
        id: "vaginisme",
        heading: "Vaginisme",
        content: "Vaginisme beskriver smerter lokalisert i bekkenbunnsmuskulatur. Disse smertene kan forekomme ved provokasjon, for eksempel ved forsøk på samleie, bruk av tampong, fysisk aktivitet som sykling eller trange klær. Smertene oppstår grunnet ufrivillige sammentrekninger i bekkenbunnsmuskulaturen. Vi vet i dag lite om forekomst av denne tilstanden. Det finnes behandling. Vår vulvaklinikk ved CMedical tilbyr tverrfaglig behandling med gynekolog, hudlege, bekkenbunnsfysioterapeut/osteopat, sexolog og psykolog.",
      },
      {
        id: "vulvodyni",
        heading: "Vulvodyni",
        content: "Vulvodyni er et samlebegrep på kroniske smerter i vulva. Vi anslår at 10–15 % av norske kvinner kan oppleve vulvasmerter i løpet av livet. Behandling må tilrettelegges den enkelte kvinne betinget i hennes mulige bakenforliggende årsak. Smertene kan være generalisert i vulva eller lokalisert, for eksempel kun over klitoris eller skjedeinngang. Noen kvinner beskriver disse smertene som brennende, stikkende, skjærende. Tverrfaglig behandling er viktig. Vulvaklinikken ved CMedical jobber tverrfaglig for å redusere smerter, øke livskvalitet og seksualfunksjon.",
      },
      {
        id: "botox",
        heading: "Botoxbehandling for vaginisme/vulvalidelser",
        content: "Hos CMedical tilbyr vi skånsom og målrettet Botoxbehandling for kvinner som opplever vaginisme eller andre smerter fra bekkenbunn og vulva. Behandlingen virker ved å redusere ufrivillige muskelspenninger, slik at smertene kan avta og samleie, undersøkelse eller tampongbruk blir mindre vondt.\n\nVurderingen gjøres av erfarne gynekologer, og behandlingen tilpasses alltid dine behov. Målet er å gi deg en trygg opplevelse og en bedre hverdag uten smerter.",
      },
    ],
    relatedSpecialists: ["ida-waagsbo-bjorntvedt"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },

  // ==========================================
  // UROLOGI
  // ==========================================
  "urologi/blaere": {
    title: "Blære og urinveier",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Blæren er en hul muskel som lagrer urin, et avfallsstoff som kroppen skiller ut fra nyrene. Urinen produseres i nyrene, filtreres fra blodet, og sendes deretter til blæren gjennom urinlederne. Når blæren er full, gir den signal til hjernen om at vi må urinere.\n\nVed problemer med vannlating, som at blæren ikke blir tømt helt eller at trykket på urinstrålen er dårlig, kan dette være symptomer på både forstyrrelser i blæren og prostata. Blod i urinen kan også være et tegn på slike problemer. Hvis man opplever noen av disse symptomene, er det viktig å oppsøke en urolog for videre undersøkelse.",
    sections: [
      {
        id: "blod-i-urinen",
        heading: "Blod i urinen",
        content: "Synlig blod i urinen er ofte et tegn på potensielle urinveisproblemer eller sykdom. Det er derfor viktig å oppsøke en erfaren urolog for undersøkelse og rådgivning.\n\nVåre nyrer spiller en sentral rolle i å filtrere avfall og væske fra blodet for å produsere urin. Urinen blir skilt ut fra nyrene, sendes via urinlederne til urinblæren, før den skilles ut via urinrøret. Blod i urinen kan derfor stamme fra ulike deler av urinveissystemet. Det er flere mulige årsaker til blod i urinen, blant annet urinveisinfeksjoner, mulig kreft, medisinbruk, nyreinfeksjoner og forstørret prostata.",
      },
      {
        id: "vannlatningsproblemer",
        heading: "Vannlatningsproblemer",
        content: "Vannlatingsproblemer hos menn kan omfatte symptomer som plutselig sterk vannlatingstrang, hyppig vannlating, vanskeligheter med å starte vannlating, svak urinstråle og avbrutt vannlating. Problemene kan ha en rekke årsaker og det er derfor viktig å sjekke det hvis man har symptomer.\n\nUrineringsproblemer kan deles inn i **lagringssymptomer** og **tømningssymptomer**. Lagringssymptomer inkluderer plutselig sterk vannlatingstrang, hyppig vannlating, små urinmengder, nattlig vannlating, ubehag ved blærefylling og urinlekkasje. Tømningssymptomer innebærer vanskeligheter med å starte vannlating, svak urinstråle, følelse av ufullstendig tømming, avbrutt vannlating, behov for å anstrenge seg, etterskvetting, svie eller smerte under vannlating.",
      },
      {
        id: "tur-p-tur-b",
        heading: "TUR-P og TUR-B",
        content: "**TUR-P** (Transuretral Reseksjon av Prostata) for forstørret prostata: TUR-P er en kirurgisk behandling for forstørret prostata. Ved dette inngrepet bruker kirurgen et urinrørskop for å skånsomt fjerne overflødig prostatavev. Pasienter som gjennomgår prosedyren ligger i narkose og kan normalt reise hjem dagen etter inngrepet.\n\n**TUR-B** (Transuretral Reseksjon av Blære) for blærekreft: TUR-B er en kirurgisk metode som brukes for å fjerne svulster i blæren. Kirurgen fjerner vevet gjennom urinrøret og sender det til analyse for å avgjøre behandlingsbehovet. Blærekreft kan manifestere seg som synlig blod i urinen, og derfor er det nødvendig med en grundig undersøkelse hos urolog.",
      },
      {
        id: "innsnevring-urinroret",
        heading: "Innsnevring i urinrøret",
        content: "Innsnevring i urinrøret, også kjent som uretrastriktur, kan forårsake problemer i nedre urinveier hos menn. Dette kan inkludere hyppige urinveisinfeksjoner og plutselige vannlatningsvansker.\n\nDiagnosen stilles ved å vurdere symptomer og utføre spesifikke medisinske undersøkelser som røntgen eller cystoskopi. Typiske symptomer inkluderer gradvis økende vanskeligheter med vannlating over tid. Urologiske undersøkelser er viktige for å bekrefte diagnosen.",
      },
    ],
    relatedSpecialists: ["trond-jorgensen"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "urologi/forhud": {
    title: "Forhud",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Forhuden er den hudfolden som dekker penishodet hos menn. Hos CMedical har vi urologer som kan hjelpe deg med plager knyttet til forhuden, som trang forhud og sårhet. Etter en konsultasjon med urolog kan vi diskutere ulike behandlingsalternativer basert på dine symptomer og behov.",
    sections: [
      {
        id: "trang-forhud",
        heading: "Trang forhud",
        content: "Trang forhud, også kjent som fimose, kan være ubehagelig og skape problemer i hverdagen. Våre urologer i CMedical tilbyr skånsom behandling for denne tilstanden.\n\nNår forhuden ikke kan trekkes tilbake over penishodet, kan et mindre plastikkirurgisk inngrep være løsningen. I mer alvorlige tilfeller kan en omskjæring være nødvendig, der deler av eller hele forhuden fjernes.\n\nKontakt oss i dag for å lære mer om våre behandlingsalternativer for trang forhud og hvordan vi kan hjelpe deg med å få bedre livskvalitet.",
      },
    ],
    relatedSpecialists: ["trond-jorgensen"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "urologi/infertilitet": {
    title: "Mannlig infertilitet",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Når par opplever problemer med å få barn, er det verdt å merke seg at i omtrent 1/3 av tilfellene er årsaken ofte mannens sædkvalitet. De siste 50 årene har menns sædkvalitet blitt redusert med over 50 %. Dette skyldes flere faktorer, som arv, miljø og livsstil. Ønsker du å ta en sædtest for å sjekke kvaliteten eller få en fertilitetsutredning, så kan vi hjelpe deg. Vi samarbeider med urologer som er spesialister innen mannlig infertilitet for å gi deg den beste oppfølgingen.",
    sections: [
      {
        id: "saedanalyse",
        heading: "Sædanalyse",
        content: "Ønsker du å sjekke sædkvaliteten din? Vi tilbyr rask og enkel sædanalyse, hvor du får resultatet samme dag.\n\nFor å få best mulig resultat fra sædprøven, anbefaler vi følgende:\n\n- Bruk det sterile plastbegeret med lokk som du får fra oss. Du kan også kjøpe det på apoteket hvis du tar prøven hjemme. Viktig: Hvis du tar prøven hjemme, må den leveres til oss innen én time og oppbevares ved kroppstemperatur.\n- Sørg for å samle all sæden i beholderen.\n- Prøv å ha sædutløsning 2–3 dager før prøvetakingen.\n- Hvis du har hatt høy feber i løpet av de siste tre ukene, kan dette påvirke resultatet.\n\nHos oss kan du bestille time til sædprøve eller komme på drop-in. Vi gir deg svaret på sædprøven senere samme dag. Hvis det er behov for videre undersøkelser, vil vi gi deg mer informasjon.",
      },
    ],
    relatedSpecialists: ["trond-jorgensen"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "urologi/nyrer": {
    title: "Nyrer",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Nyrene er et organ i kroppen som renser blodet ved å fjerne avfallsstoffer, overflødig væske og salter. Slik dannes det urin. I tillegg produserer nyrene hormoner som styrer blodtrykket og produksjonen av røde blodlegemer. Nyrene spiller derfor en viktig rolle for å holde kroppen sunn. Hos CMedical kan nyrene også opereres med robot-teknologi, noe som gir større presisjon og bedre resultater ved kirurgiske inngrep.",
    sections: [
      {
        id: "nyrecyster",
        heading: "Nyrecyster",
        content: "Nyrecyster er væskefylte hulrom som kan utvikle seg på nyrene. De er vanligvis godartede og oppdages ofte ved medisinske undersøkelser. Behandlingen avhenger av cystens størrelse, symptomer og mistanke om ondartethet:\n\n- **Overvåkning:** Små, asymptomatiske cyster overvåkes regelmessig.\n- **Drenasje:** Store eller symptomatiske cyster kan tømmes med en nål.\n- **Kirurgi:** Kirurgisk fjerning kan være nødvendig for store, symptomatiske eller potensielt ondartede cyster.\n- **Behandling av underliggende årsak:** Hvis cyster er relatert til en annen sykdom, behandles den underliggende tilstanden.",
      },
      {
        id: "tumor",
        heading: "Tumor",
        content: "En nyretumor er en unormal vekst av celler i nyrene. De kan være enten godartede eller ondartede. Ondartede nyretumorer, som nyrekreft eller nyrekarsinom, utgjør en alvorlig helsefare. Nyretumorer kan utvikle seg i en eller begge nyrer og oppdages vanligvis ved bildeundersøkelser som røntgen eller ultralyd.\n\nBehandlingen av nyretumorer avhenger av flere faktorer, inkludert tumorstørrelse, type og utbredelse. Vanlige behandlingsalternativer inkluderer kirurgisk fjerning av tumoren, strålebehandling, kjemoterapi, målrettet terapi og immunterapi.",
      },
      {
        id: "robotkirurgi-nyrekreft",
        heading: "Robotkirurgi for nyrekreft",
        content: "Robotassistert kirurgi har revolusjonert behandlingen av nyrekreft. Denne avanserte teknologien gir kirurger en nøyaktig og minimalt invasiv måte å fjerne nyretumorer.\n\nUnder robotkirurgi for nyrekreft bruker kirurgen et spesialdesignet robotisk kirurgisystem som gir høy presisjon og økt manøvrerbarhet. Dette tillater kirurgen å utføre inngrepet gjennom små snitt i stedet for store åpne snitt, noe som reduserer smerter, blødning og rekonvalesenstid for pasienten.\n\nRobotkirurgi gir også fordelen av forstørret 3D-visning, som gir kirurgen en detaljert oversikt over tumoren og omkringliggende vev. Dette gjør det mulig å fjerne kreftvevet mer presist og bevare så mye friskt vev som mulig.\n\nFordeler inkluderer kortere sykehusopphold og raskere rehabilitering for pasientene.",
      },
      {
        id: "nyrestein",
        heading: "Nyrestein",
        content: "Nyrestein, også kjent som nefrolithiasis, er små, faste formasjoner som dannes i nyrene når mineraler og salter i urinen krystalliserer. Disse steinene kan forårsake betydelig smerte når de beveger seg gjennom urinveiene.\n\nSymptomer på nyrestein kan være intense ryggsmerter, smerte i siden eller magen, hyppig vannlating, blod i urinen, og kvalme. De fleste nyresteiner er små nok til å passere naturlig, men i noen tilfeller kan de kreve medisinsk behandling.\n\nBehandlingen av nyrestein kan omfatte smertestillende medisiner, endringer i kostholdet, økt væskeinntak for å hjelpe steinene å passere, eller medisinske prosedyrer som knusing av steinene med sjokkbølger (ekstrakorporeal sjokkbølgeterapi) eller kirurgisk inngrep for å fjerne større steiner.",
      },
    ],
    relatedSpecialists: ["nabeel-yousaf-khan"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "urologi/prostata": {
    title: "Prostata",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Prostata er en liten kjertel som ligger under urinblæren. Den produserer væske som blandes med sperm for å danne sæd, og er med på å transportere og beskytte spermcellene under ejakulasjon. Regelmessig kontroll er viktig for å oppdage og behandle eventuelle problemer knyttet til prostata tidlig.\n\nProstata vokser når du blir eldre, og er du i 50–60 årene oppfordrer vi deg til å sjekke prostata jevnlig. Våre spesialister anbefaler én prostatakontroll og en årlig blodprøve for å overvåke utviklingen over tid.",
    sections: [
      {
        id: "prostataundersokelse",
        heading: "Hvordan foregår en prostataundersøkelse?",
        content: "En prostataundersøkelse består av PSA-blodprøve og ultralyd av prostata. Det er også nødvendig å kjenne på prostata gjennom endetarmen. Denne undersøkelsen kalles også for rektal prostataeksaminasjon (DRE). Legen eller urologen kjenner etter følgende:\n\n- Knudrete prostatakjertel\n- Asymmetri\n- Uregelmessigheter i prostatakjertel\n\nDet er mulig å få gjennomført prostataundersøkelser hos fastlegen. Stadig flere menn velger imidlertid å oppsøke privat urolog direkte for å sjekke prostata og stille spørsmål rundt prostatakreft.",
      },
      {
        id: "naar-sjekke",
        heading: "Når skal man begynne å sjekke prostata?",
        content: "«Jeg anbefaler alle menn i 50-årsalderen å ta en PSA-test hvert år. Menn under 50 år som tilhører en risikogruppe bør også sjekke prostata jevnlig», oppfordrer Dr. Jørgensen.\n\nMed risikogrupper menes menn som har ett eller flere tilfeller av prostatakreft i familien. Risikogrupper inkluderer også menn som har kvinnelige slektninger med tilfeller av brystkreft eller eggstokkreft i ung alder.\n\nDet er 12,5 % sannsynlighet for at en mann får diagnosen prostatakreft frem til han er 75 år, med andre ord vil mer enn 1 av 10 menn få diagnosen før eller siden i sitt voksne liv.",
      },
      {
        id: "robotkirurgi",
        heading: "Robotkirurgi",
        content: "Robotassistert laparoskopisk prostatektomi (RALP), det vil si kirurgisk fjerning av prostata med kikkhullsoperasjon, er et av våre spesialområder. Som eneste private helsespesialist siden 2018 tilbyr vi kort ventetid på ledende robotkirurger og eksperter innen prostata og urologi.\n\nVi har Norges mest erfarne team innen robotkirurgi, med over 20 års erfaring, og det største volumet av robotassisterte inngrep i landet. Vårt team består av svært erfarne kirurger, leger, anestesipersonell og sykepleiere, noe som sikrer en stille og rolig atmosfære i alle ledd.\n\nVi behandler både prostatakreft og godartede prostataforstørrelser, og har det mest moderne utstyret tilgjengelig i Norge.",
      },
    ],
    relatedSpecialists: ["trond-jorgensen"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "urologi/refertilisering": {
    title: "Refertilisering",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Sterilisering er en enkel og vanlig prevensjonsmetode for menn. Metoden innebærer at man kutter sædlederen som transporterer sædceller fra testiklene til sædblæren.\n\nAngrer du på steriliseringen, kan sædlederne sys sammen igjen. Dette kalles refertilisering.",
    sections: [
      {
        id: "resultat",
        heading: "Resultatet av refertilisering",
        content: "Det er flere faktorer som kan avgjøre om en refertilisering blir vellykket eller ikke. Viktige faktorer er blant annet alder, samt hvor lenge det er siden du ble sterilisert.\n\nGenerelt kan man si at 70–80 % av pasientene kan regne med å få spermier i sæduttømmingen etter inngrepet. Muligheten for graviditet vil også påvirkes av forhold hos din partner.",
      },
      {
        id: "for-under-etter",
        heading: "Før, under og etter operasjonen",
        content: "Reversering av sterilisering gjøres i lett narkose og du kan reise hjem samme dag. Du kan oppleve litt smerter og det kan være behov for noe smertestillende. For å redusere blødning og smerter bør du unngå stor fysisk aktivitet de første dagene etter inngrepet.\n\nDu kan oppleve noe hevelse og blåfarging av huden omkring der huden er åpnet.\n\nSeksuell aktivitet kan gjenopptas etter 2–3 uker.\n\nHar du fysisk krevende arbeide? Snakk med kirurgen om eventuelt behov for sykemelding. Kontroll avtales med kirurgen.",
      },
      {
        id: "saedkontroll",
        heading: "Sædkontroll etter refertilisering",
        content: "En kontroll med sædprøve 2–3 måneder etter inngrepet vil avdekke om refertiliseringen var vellykket. Denne analysen avdekker sædens kvalitet, vitalitet og eventuelt andre tilstander som kan påvirke sædkvaliteten. Kontroll avtales med legen.",
      },
    ],
    relatedSpecialists: ["nabeel-yousaf-khan"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "urologi/robotkirurgi": {
    title: "Robotassistert kirurgi",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Urologi",
    heroImage: heroTech,
    description: "Robotassistert kirurgi er en avansert, men skånsom form for behandling. Operasjonen gjennomføres som ved klassisk kikkhullskirurgi, gjennom små åpninger i huden. Ved robotkirurgi styrer kirurgen instrumentene elektronisk fra en konsoll ved siden av pasienten. Maskinholdte instrumenter gir svært presise bevegelser, og et høyoppløselig, stereoskopisk 3D-kamera gir kirurgen et usedvanlig godt bilde.\n\nVi tilbyr robotassistert kirurgi innen blant annet: muskelknuter (fertilitetsbevarende kirurgi), dyp endometriose, hysterektomi, brokk, godartet forstørret prostata (RASP) og prostatakreft (RALP).",
    sections: [
      {
        id: "rask-rehabilitering",
        heading: "Rask rehabilitering",
        content: "Robotkirurgi er en moderne og skånsom operasjonsmetode hvor kirurgen opererer gjennom små snitt i stedet for et større operasjonssår. Dette gir mindre ubehag, redusert blødning, færre komplikasjoner og raskere tilheling.\n\n**En raskere vei til restitusjon:** Mange pasienter kan reise hjem allerede dagen etter inngrepet. Allerede samme kveld er det mulig å spise, bevege seg og føle seg mer som seg selv igjen.\n\n**Kortere sykemelding:** Avhengig av hvilken type jobb og hvilket inngrep du har gjennomgått, kan du forvente en sykemeldingsperiode på 2–3 uker. Sammenlignet med tradisjonell åpen kirurgi gir robotkirurgi en raskere vei tilbake til hverdagen.",
      },
      {
        id: "presisjon",
        heading: "Presisjon som merkes",
        content: "Med høyoppløselig 3D-kamera og avanserte instrumenter med stor presisjon har kirurgen svært god kontroll. Dette bidrar til skånsomhet og høy kvalitet i hvert inngrep. I bekkenet finnes det ømfintlig vev som lett kan skades under kirurgi, som ved nervesparende operasjoner ved dyp endometriose eller ved fjerning av prostata.\n\n**Ergonomi – også for kirurgen:** Under robotkirurgi sitter kirurgen i en ergonomisk og komfortabel arbeidsstilling. Dette bidrar til økt konsentrasjon og mindre utmattelse, noe som igjen reduserer risikoen for feil.\n\n**Erfarne spesialister – trygg behandling:** Robotkirurgi hos oss utføres av spesialister innen urologi og gynekologi. Målet er alltid det samme: å gi deg den tryggeste behandlingen og den best mulige opplevelsen både før, under og etter operasjonen.",
      },
    ],
    relatedSpecialists: ["nicolai-wessel"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "urologi/sterilisering": {
    title: "Sterilisering",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Sterilisering (vasektomi) er en enkel, trygg og effektiv behandling for permanent prevensjon. Hvis du er helt sikker på at du ikke ønsker flere barn i fremtiden, kan sterilisering være et alternativ.",
    sections: [
      {
        id: "behandling",
        heading: "Behandling",
        content: "Sterilisering av menn foregår i lokalbedøvelse. Kirurgen legger et lite snitt på pungen, lokaliserer sædlederen som deretter hentes frem og deles. Det fjernes en bit av lederen og endene sys tett for å hindre at de gror sammen.\n\nSamme prosedyre gjentas på den andre sædlederen. Dersom det ikke har vært noen form for kirurgi i pungen tidligere, er operasjonen som oftest enkel og utført i løpet av en halvtime. Vevsbitene sendes til laboratoriet for undersøkelse slik at vi får en bekreftelse på at sædlederen er delt.",
      },
      {
        id: "for-og-etter",
        heading: "Før og etter inngrepet",
        content: "**Slik forbereder du deg til sterilisering:** Barber testiklene dagen før operasjonen. Dette er for å hindre at hår kommer i operasjonssårene, noe som kan føre til infeksjon. Før inngrepet må du informere oss om du bruker blodfortynnende medisiner. Du må undertegne et egenerklæringsskjema. Du kan kjøre bil både før og etter operasjon.\n\n**Dette tar du hensyn til etter inngrepet:** Dagen etter steriliseringen skal du dusje med bandasjen som ble satt på etter inngrepet. Etter dusjen skifter du den våte bandasjen til en ny bandasje som du får med deg fra oss. Hevelse og misfarging er normalt, og dette vil gå over av seg selv. Stingene løser seg opp og faller av etter cirka 2–3 uker.\n\nEjakulering og orgasme vil foregå helt likt etter sterilisering, men ejakulasjonen vil se noe klarere ut da den ikke lenger inneholder sædceller. Det er viktig å gjennomføre en sædanalyse etter 3 måneder før man slutter med andre prevensjonsmidler.",
      },
    ],
    relatedSpecialists: ["trond-jorgensen", "nabeel-yousaf-khan"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "urologi/testikler": {
    title: "Testikler og pung",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Testikler er mannens reproduktive organ og som produserer sædceller og mannlige hormoner, inkludert testosteron. Testiklene er plassert i pungen og pungen sørger for en litt lavere temperatur enn kroppen for å beskytte spermiene. Opplever du plager i testikler eller pung kan du ta kontakt med oss.",
    sections: [
      {
        id: "testikkelkreft",
        heading: "Testikkelkreft",
        content: "Selv om årsaken til testikkelkreft ikke er fullstendig kjent, er det flere mulige risikofaktorer. Disse inkluderer forsinket nedstigning av testiklene i pungen før fødselen, familiehistorie av testikkelkreft, underutviklede testikler, sterilitet, HIV-infeksjon, og miljømessige faktorer.\n\nVanligvis oppdages tilstanden med en kul i testikkelen eller følelse av ubehag i en testikkel. Hvis du opplever slike symptomer, er det viktig å oppsøke en urolog for en undersøkelse. Undersøkelsen inkluderer en ultralyd av testiklene.\n\n**Behandling av testikkelkreft**\n\nValg av behandlingsmetode for testikkelkreft avhenger av krefttypen og hvor avansert sykdommen er. Vanligvis inkluderer behandlingen kirurgi, der testikkelen fjernes, etterfulgt av cellegift.\n\nStrålebehandling kan også vurderes, men brukes ikke lenger som standardbehandling. Dette er kun aktuelt i visse tilfeller og stadier av testikkelkreft.\n\n**Livet etter behandling**\n\nGenerelt blir de fleste som har hatt testikkelkreft friske uten langsiktige komplikasjoner.\n\nSelv om en testikkel fjernes, påvirker det sjelden seksuell funksjon negativt. Hvis cellegiftbehandling er nødvendig, kan reproduksjonsevnen bli svekket i opptil to år, før den normaliserer seg.\n\nNoen kan oppleve det som utfordrende å ha bare én testikkel etter behandlingen, og i slike tilfeller kan man vurdere å få satt inn en testikkelprotese.",
      },
      {
        id: "kul-i-pungen",
        heading: "Kul i pungen",
        content: "Har du oppdaget en hevelse i testiklene dine? Vanligvis er slike hevelser ufarlige, men det er klokt å konsultere en urolog for en grundig undersøkelse, for å utelukke mer alvorlige tilstander.\n\n**Hva kan en testikkelhevelse være?** Ofte kan dette skyldes en tilstand som hydrocele (vannbrokk) eller inguinalhernie (sædbrokk), selv om disse tilstandene generelt er ufarlige, kan de av og til vokse til en størrelse som forårsaker ubehag i testiklene og pungen. Våre urologer tilbyr enkle kirurgiske inngrep for å behandle slike tilstander.",
      },
    ],
    relatedSpecialists: ["nabeel-yousaf-khan"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året, og sørger for å bruke vår spisskompetanse til å forstå våre pasienters helhetsbilde." },
    ],
  },

  // ==========================================
  // FERTILITET
  // ==========================================
  "fertilitet/infertilitet": {
    title: "Infertilitet",
    subtitle: "Uten henvisning • Ingen ventetid",
    parentCategory: "Fertilitet",
    heroImage: fertilitetImg,
    description: "Svært mange opplever at det er vanskelig å bli gravid på egenhånd. Så mange som 1 av 6 gjennomlever infertilitet, altså at graviditet ikke har lykkes til tross for gjentatte forsøk i ett år eller mer. Det finnes flere årsaker til ufrivillig barnløshet, og du skal vite at du er ikke alene.",
    sections: [
      {
        id: "du-er-ikke-alene",
        heading: "Du er ikke alene",
        content: "Dessverre er det flere som kan fortelle at de kjenner på en skam knyttet til infertilitet. Dette er nok også årsaken for at mange velger å utsette å oppsøke gynekolog. Opplever du ufrivillig barnløshet, anbefaler vi at du tar kontakt for en fertilitetssjekk dersom du befinner deg i en av disse to situasjonene:\n\n- **Kvinne 35 år, eller yngre:** Er du en kvinne på 35 år eller yngre bør du ta kontakt for en fertilitetssjekk om du ikke har lykkes med å oppnå graviditet i løpet av 12 måneder. Ta også kontakt dersom du opplever problemer med eggløsning eller sjeldne/uregelmessige menstruasjoner.\n- **Kvinne 36 år, eller eldre:** Er du en kvinne på 36 år eller eldre bør du ta kontakt for en fertilitetssjekk dersom du ikke har lykkes med å oppnå graviditet i løpet av seks måneder.\n\nÅrsakene til ufrivillig barnløshet kan være mange, og trenger nødvendigvis ikke være knyttet til alder.\n\n**Vi kan dele utfordringene inn i fire kategorier:**\n- Kvinnelig faktor\n- Mannlig faktor\n- En blanding av de to\n- Uforklarlige årsaker\n\nDet er viktig å huske på at infertilitet rammer like mange menn som det rammer kvinner.",
      },
      {
        id: "kvinnelig-faktor",
        heading: "Kvinnelig faktor til infertilitet",
        content: "Kvinner fødes med ett bestemt antall egg, så den kvinnelige kroppen produserer derfor ikke flere. Ved hver menstruasjon utvikles ett eller flere egg til modning. Antall egg synker med årene, og i tillegg reduseres kvaliteten på eggene. Gjennom både erfaring og ulike studier er det avdekket en rekke forhold som kan påvirke den kvinnelige fertiliteten:\n\n- Eggløsningsproblemer som skyldes hormoner\n- PCOS (polyscystiske eggstokker) – Eggposene modnes ikke slik at man får sjelden eller ingen eggløsning\n- Skade på eggleder: for eksempel etter klamydiainfeksjon eller blindtarmoperasjon\n- Utfordringer med livmor: for eksempel muskelknuter eller adenomyose\n- Endometriose\n- Medisinske årsaker knyttet til medikamentbruk, som for eksempel cellegift\n- Alder",
      },
      {
        id: "mannlig-faktor",
        heading: "Mannlig faktor til infertilitet",
        content: "Menn produserer spermier kontinuerlig, og det er derfor ingen fare for at det «går tomt». Det er gjort en rekke studier som viser at omtrent 4 av 10 par som ikke lykkes med å bli gravide på egen hånd har en mannlig faktor som hovedårsak.\n\n- Nedsatt eller fraværende sædproduksjon (infeksjon eller genetiske tilstander)\n- Hormonelle årsaker\n- Transportfeil av sædceller\n- Vanskelig å få utløsning som følger av en operasjon eller infeksjon\n- Nedsatt evne til ereksjon eller utløsning\n- Ulike legemidler eller anabole steroider\n- Testikkelkreft",
      },
      {
        id: "uforklarlige-arsaker",
        heading: "Uforklarlige årsaker til infertilitet",
        content: "I ca 30 % av alle infertile tilfeller finner vi ingen årsak til hvorfor man ikke lykkes med å bli gravid. Vi forstår at det kan være en frustrerende beskjed å få etter å ha prøvd en lang stund. Om alle prøvene fra fertilitetssjekken ser fine ut, kan én eller flere av årsakene nedenfor være med på å minske sjansene for en graviditet:\n\n- Røyking og alkohol har en negativ påvirkning på mannlig og kvinnelig fertilitet\n- Overvekt kan ha en negativ påvirkning for både mannlig og kvinnelig fertilitet\n- Overforbruk av ulike legemidler som Naproxen, Voltaren, Ibux og andre smertestillende har dokumentert negativ effekt på sannsynligheten for å bli gravid",
      },
    ],
    relatedSpecialists: ["jackson-tok", "birgitte-mitlid-mork", "kjersti-brenden"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
    ],
  },
  "fertilitet/assistert-befruktning": {
    title: "Assistert befruktning",
    subtitle: "Uten henvisning • Ingen ventetid",
    parentCategory: "Fertilitet",
    heroImage: fertilitetImg,
    description: "Det finnes flere ulike behandlingsmetoder ved assistert befruktning. Vi utarbeider behandlingsmetoden slik at den er tilpasset nettopp deg og dine behov. Du kan være trygg på at vi gjør grundige undersøkelser med ett mål for øyet – å hjelpe deg med å oppfylle drømmen om et barn.",
    sections: [
      {
        id: "ivf",
        heading: "IVF - In Vitro Fertilisering",
        content: "In Vitro Fertilisering betyr «befruktning utenfor kroppen», også ofte omtalt som prøverørsbehandling. I praksis betyr det at vi ved et lite inngrep, som gjøres med lokalbedøvelse, henter ut modne egg hos kvinnen. Deretter vil eggene bli befruktet i et prøverør, for så bli satt tilbake i kvinnens livmor.\n\nMålet er å gi deg som kvinne størst mulig sjanse for å få et barn, på en så trygg måte som mulig. Hver IVF-behandling tilpasses ut fra individuelle forutsetninger. Det er derfor viktig at det gjøres en grundig fertilitetssjekk før du går i gang med behandling.",
      },
      {
        id: "icsi",
        heading: "ICSI - Intracytoplasmatisk spermieinjeksjon",
        content: "ICSI er en behandlingsmetode som benyttes ved nedsatt sperm-funksjon. ICSI blir også ofte kalt for mikroinjeksjon. Metoden likner delvis på IVF men istedenfor at egget og spermien blir lagt sammen, blir egget injisert med sperm og deretter plassert i en inkubator. Denne behandlingen benyttes hos IVF-pasienter der det er mannlig faktor til uteblitt graviditet.",
      },
      {
        id: "inseminasjon",
        heading: "Inseminasjon (AIH)",
        content: "Inseminasjon er en behandlingsmetode hvor vi injiserer preparert sperm rett inn i livmorhulen. Inseminasjon med donorsæd er førstevalget for single kvinner eller par der det er behov for donorsæd. Inseminasjon kan også brukes med mannens sperm dersom paret ønsker å forsøke å bli gravid før IVF.",
      },
      {
        id: "donor",
        heading: "Assistert befruktning med donor",
        content: "Vi tilbyr assistert befruktning med donor, både egg- og sæddonasjon. Ta kontakt med oss om du ønsker å vite mer.",
      },
      {
        id: "tesa-pesa",
        heading: "TESA/PESA",
        content: "TESA/PESA er en vanlig behandlingsmetode for å hente ut sperm fra pungen. Uthentingen gjøres med lokalbedøvelse.\n\nTESA/PESA er en metode vi benytter dersom mannen er sterilisert eller har en annen medisinsk tilstand som forårsaker alvorlig avvik eller ingen spermier i sædanalysen.\n\nTESA er et kirurgisk inngrep hvor vi går inn i testikkel for å hente sædceller. PESA er en metode hvor sædcellene suges ut av bitestikkelen via en tynn nål.\n\nEtter TESA/PESA må det benyttes ICSI som befruktningsmetode. Kvinnen gjennomgår IVF-behandling for å hente ut egg som kan befruktes i laboratoriet.",
      },
      {
        id: "micro-tese",
        heading: "Micro-TESE",
        content: "Vi tilbyr avanserte behandlinger for menn med fertilitetsproblemer. Micro-TESE (microdissection testicular sperm extraction) er en mikrokirurgisk prosedyre som utføres under mikroskopisk veiledning for å identifisere og ekstrahere sædceller direkte fra testiklene. Dette er en effektiv metode for menn med azoospermi, hvor sædceller ikke finnes i sædprøver.\n\nStudier har vist at micro-TESE har en høyere suksessrate sammenlignet med tradisjonell TESE-prosedyre, spesielt for menn med ikke-obstruktiv azoospermi. Vår fertilitetsspesialist Jackson Tok er sertifisert for Micro-TESE ved Center for Male Reproductive Medicine og Microsurgery ved Weill Cornell University i New York City.",
      },
    ],
    relatedSpecialists: ["kristian-ophaug"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "fertilitet/ivf": {
    title: "IVF - Utredning og behandlingsprosess",
    subtitle: "Uten henvisning • Ingen ventetid",
    parentCategory: "Fertilitet",
    heroImage: fertilitetImg,
    description: "IVF står for in vitro-fertilisering, også kalt prøverørsbehandling. IVF er en form for assistert befruktning der egget blir befruktet utenfor kroppen.\n\nDet er mange som synes dette virker komplisert og vanskelig. Derfor har vi lav terskel for at du kan ta kontakt og få svar på dine spørsmål. Hos oss vil du alltid få grundig informasjon og oppfølging.",
    sections: [
      {
        id: "forste-motet",
        heading: "Det første møtet",
        content: "Hos oss skal du føle deg trygg og godt ivaretatt fra første møte. Vi vil skape rom for en god samtale om dine tanker og ønsker for behandlingen. Etter den første samtalen, er neste steg en grundig fertilitetssjekk av deg, og/eller din partner.\n\n**Fertilitetssjekk i tre steg:**\n- **Kvinner:** Grundig gynekologisk undersøkelse med innvendig ultralyd. Vi sjekker at alt ser bra ut i livmoren og eggstokkene.\n- **Menn:** Sædanalyse der vi sjekker antall spermier, konsentrasjon og bevegelighet.\n- **Blodprøver:** Vi tar blodprøver for å avdekke sykdommer som hepatitt B og C, syfilis og HIV/AIDS. For kvinner kan vi også måle hormoner og eggreserver.",
      },
      {
        id: "hvem-kan-benytte",
        heading: "Hvem kan benytte IVF?",
        content: "Heterofile, lesbiske par og enslige kvinner kan benytte IVF-behandling. IVF kan tilbys både når det er problemer med kvinnelig og/eller mannlig infertilitet. Vi har ikke en absolutt øvre aldersgrense for mannen, dette vurderes individuelt.\n\nØvre aldersgrense for kvinnen ved inseminasjon eller innsetting av befruktet egg er satt av Bioteknologiloven, og kan ikke være eldre enn fylte 46 år.",
      },
      {
        id: "hvordan-foregaar",
        heading: "Hvordan foregår IVF?",
        content: "IVF-behandling gjøres med en regulering av hormoner, samt en stimuleringsprosess for å modne flere egg.\n\n**I hovedtrekk kan vi dele IVF-behandling inn i åtte ulike faser:**\n1. Fertilitetssjekk\n2. Hormonstimulering\n3. Ultralyd\n4. Egguthenting\n5. Prøverørsbefruktning\n6. Tilbakesetting\n7. Ventetiden mellom innsett og graviditetstest\n8. Graviditetstest",
      },
      {
        id: "forste-faser",
        heading: "De første fasene ved IVF-behandling",
        content: "Neste steg i IVF-behandlingen er hormonstimulering. Ved hormonstimulering vil flere egg modne i løpet av en syklus, slik at sjansen for å bli gravid økes. Eggene hentes ut ved et lite inngrep som gjøres med lokalbedøvelse.\n\nNår stimuleringen nærmer seg ferdig, vil du få time til en innvendig ultralyd. Her vil vi undersøke om slimhinnen i livmoren samt antall og størrelsen av folliklene er slik vi ønsker.",
      },
      {
        id: "egguthenting",
        heading: "Egguthenting",
        content: "Når det er tid for å gjøre en egguthenting vil vi ta dere godt imot, og gi dere all den informasjonen dere trenger for resten av dagen. Dere vil også få tildelt et eget rom hvor dere kan hvile både før og etter egguttak. Et egguttak vil normalt sett ta 15–25 minutter.\n\nVi ringer dere med resultatene av befruktningen dagen etter uttaket og avtaler time for innsett dersom det er mulig.",
      },
      {
        id: "emosjonell-prosess",
        heading: "En emosjonell prosess",
        content: "Vi har stor forståelse for at det er mange følelser som spiller inn, og vi ønsker å være en støttespiller for deg og dere. Å starte en IVF-behandling kan for noen oppleves som tøft, mens for andre kan det oppfattes som en lettelse over at noe endelig skjer.\n\nSom et ledd i arbeidet med at du skal føle deg trygg og ivaretatt vil vi etterstrebe at du får møte en fast sykepleier og fertilitetslege ved dine besøk hos oss.",
      },
    ],
    relatedSpecialists: ["kristian-ophaug"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "fertilitet/eggfrys": {
    title: "Eggfrys",
    subtitle: "Uten henvisning • Ingen ventetid",
    parentCategory: "Fertilitet",
    heroImage: fertilitetImg,
    description: "Om du ønsker å vente med en eventuell graviditet, vil kanskje det å fryse ned egg være riktig for deg. På denne måten kan fremtidige deg, selv om fruktbarheten er redusert eller borte, kunne bli gravid. Ved nedfrysning av egg henter vi ut flere modne egg som legges på frys ubefruktet.\n\nEtter opptining vil egget befruktes med donorsæd, eller sæd fra partner, før det settes tilbake i livmoren. Denne prosedyren kalles for IVF, også populært kalt prøverørsbehandling.",
    sections: [
      {
        id: "hvem-kan-fryse",
        heading: "Hvem kan fryse ned egg?",
        content: "Alle kvinner kan i utgangspunktet fryse ned egg. De vanligste årsakene er forholdet til partner, økonomi, utdanning og jobbsituasjon. I juli 2020 ble det også tillatt å fryse ned egne egg for eget bruk. Å fryse ned egg på denne måten kalles for «social freezing».\n\nDersom du vet at du har en genetisk tilstand som reduserer eggstokkreservene, eller om du er plaget med endometriose, anbefaler vi at du benytter muligheten for å fryse ned egg.",
      },
      {
        id: "aldersgrense",
        heading: "Hva er aldersgrensen for nedfrysning av egg?",
        content: "Studier viser at eggstokkreservene reduseres etter fylte 30 år, både når det gjelder kvalitet og antall. Dette i kombinasjon med at vi vet at fertiliteten reduseres etter fylte 35 år, anbefaler vi at du ikke er eldre enn 36 år når du fryser ned eggene. Det er store variasjoner oss kvinner imellom, så vi gjør individuelle vurderinger hos dere som er mellom 35–38 år.",
      },
      {
        id: "slik-foregaar",
        heading: "Slik foregår nedfrysning av egg",
        content: "En syklus med uttak og nedfrysning av egg er svært lik de første trinnene i en IVF-behandling. I hovedtrekk kan vi dele nedfrysning av egg inn i åtte ulike faser:\n\n1. Hormonstimulering ved hjelp av hormonsprøyter\n2. Sjekk av follikler for å sikre ønsket vekst\n3. Eggløsningssprøyte ca. en og en halv dag før uttaket\n4. Uttaket skjer gjennom skjeden etter lokalbedøvelse og smertestillende\n5. Laboratoriet sjekker kvaliteten på eggene, og godkjente egg fryses ned\n6. De aller fleste kan dra tilbake på jobb etter en dag eller to\n7. Eggene kan oppbevares og benyttes inntil du fyller 46 år\n8. Ved opptining befruktes eggene før de dyrkes videre i 2–5 dager, for så å settes tilbake i livmoren",
      },
      {
        id: "hvor-mange-egg",
        heading: "Hvor mange egg kan jeg få på frys?",
        content: "Fordi det ikke finnes noen garanti for at modne egg kan befruktes og dele seg slik vi ønsker, anbefaler vi at du fryser ned minimum 20 egg. Da har du best mulig odds for en graviditet.\n\nAntall modne egg ved hver behandling varierer, og det er derfor variasjoner i hvor mange behandlinger hver enkelt bør gjennomføre. De fleste må regne med to til tre omganger med stimulering og uttak.",
      },
      {
        id: "risiko",
        heading: "Hva er risiko ved nedfrysning av egg?",
        content: "Som ved all medisinsk behandling vil det alltid være en viss risiko knyttet til behandlingen.\n\n- **Overstimulering:** I noen tilfeller kan bruk av fertilitetsmedisin føre til at eggstokkene hovner opp. Du vil da kunne oppleve smerter og stinn mage under hormonbehandlingen eller etter uttaket.\n- **Komplikasjoner ved egguttak:** Alvorlige komplikasjoner skjer svært sjelden, men det kan forekomme blødninger, infeksjon i bekkenet eller skader på tarm.\n- **Emosjonell reaksjon:** Å bestemme seg for å fryse ned egg kan oppleves som en trygghet. Det er viktig at nedfrysning ikke gir noen garanti for graviditet, men at mulighetene er større enn dersom man velger det bort.",
      },
    ],
    relatedSpecialists: ["kristian-ophaug"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Nei, ingen henvisning er nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hvor lang er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva innebærer en utredning?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "fertilitet/donorbehandling": {
    title: "Donorbehandling",
    subtitle: "Uten henvisning • Ingen ventetid",
    parentCategory: "Fertilitet",
    heroImage: fertilitetImg,
    description: "Behandling med donorsæd eller donerte egg kan være aktuelt for mange. I Norge er det ikke tillatt med samtidig donasjon av egg og sæd (såkalt dobbeldonasjon) og single kvinner i Norge får derfor ikke tilbud om eggdonasjon i henhold til bioteknologiloven. Unntak fra dette er i et likekjønnet par der den ene kvinnen kan få sine egg befruktet med donorsæd og gi befruktet egg til den andre kvinne for å oppnå graviditet (såkalt partnerdonasjon).\n\nSynes du det er vanskelig å forstå alt? Du er ikke alene. Har du spørsmål er du velkommen til å ringe oss.",
    sections: [
      {
        id: "partnerdonasjon",
        heading: "Partnerdonasjon",
        content: "Partnerdonasjon ble tillatt i Norge 01.01.2021 og kan være aktuelt for to kvinner i et parforhold.\n\nI den nye Bioteknologiloven som kom i 2020 ble det tillat med partnerdonasjon, men det måtte da begrunnes medisinsk. Imidlertid kom det en endring og presisering i 2021, slik at begrunnelsen nå også kan være kun sosial. Dette betyr at kvinner i likekjønnet par selv kan bestemme hvem som skal gå gravid.\n\nNoen kvinner har medisinske utfordringer knyttet til sin fertilitet, eggstokker som produserer lite eller ingen egg, tidlig overgangsalder eller på andre måter har redusert eggkvalitet. Sjansen for å lykkes med reproduksjon kan da være minimale. Da kan man ha mulighet til å få egg fra en annen kvinne. Dersom eggene som brukes er av god kvalitet har man en god sjanse for å lykkes med behandling. Eggene vil da befruktes med donorsperm.\n\nPartnerdonasjon er kun aktuelt for to kvinner som er gift eller samboer i ekteskapslignende forhold.\n\nFremgangsmåte ved partnerdonasjon er ganske lik IVF-behandling. Egget hentes ut fra den ene kvinnen (giver) og befruktes med donorsæd. Embryoet fryses ned og tines, for så å settes tilbake i partners livmor (mottaker) ved et fryseforsøk. Behandlingen er tillatt der det foreligger en sosial eller medisinsk grunn til at partner (mottaker) ikke kan bli gravid med egne egg."
      },
      {
        id: "donorsaed",
        heading: "Donorsæd",
        content: "Vi benytter donorsæd fra Livio Sperm Bank, Cryos og European Sperm Bank. Vi har god tilgang på norsk donorsæd fra Livio Sperm Bank.\n\nEtter norske retningslinjer bruker vi sæd fra ikke-anonym donor. Donor forblir anonym for kvinnen/paret, men barnet har rett til informasjon om donors identitet når han eller hun fyller 15 år. Fram til 2019 var denne aldersgrensen 18 år.\n\nOm det ønskes flere barn fra samme donor kan donorsæd reserveres til søskenforsøk hos sædbanken og/eller lagres ved klinikken vår.\n\nUnder den første samtalen med gynekolog gjennomgås rutiner for utvelgelse av sæddonor. Før behandling kan igangsettes er det viktig at donorsæd er på plass på klinikken. Kontakt oss dersom du er usikker på om klinikken har mottatt donorsæd til behandlingen.\n\nVi tilbyr behandling med norsk donorsæd – som har vært donert hos Livio Oslo og som nå er en del av CMedical sitt tilbud."
      },
      {
        id: "donoregg",
        heading: "Donoregg",
        content: "I følge Bioteknologiloven i Norge er behandling med donoregg tillatt kun til heterofile par. Denne type behandling tilbys i situasjoner der kvinnen ikke har mulighet til å bruke egne egg på grunn av enten eggmangel eller svært redusert eggkvalitet.\n\nVi i CMedical følger disse retningslinjene i Bioteknologiloven."
      },
    ],
    relatedSpecialists: ["kristian-ophaug"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "fertilitet/hysteroskopi": {
    title: "Hysteroskopi",
    subtitle: "Uten henvisning • Ingen ventetid",
    parentCategory: "Fertilitet",
    heroImage: fertilitetImg,
    description: "Hysteroskopi er en skånsom gynekologisk undersøkelse der vi bruker et tynt instrument med kamera for å se inn i livmorhulen gjennom livmorhalsen. Undersøkelsen gir en grundig oversikt og gjør det mulig å oppdage årsaker til plager som ellers kan være vanskelig å finne.\n\nFordelen for deg som pasient er at vi ofte kan stille diagnose og eventuelt behandle i samme prosedyre.",
    benefits: [
      "Uregelmessige blødninger",
      "Mistanke om polypper eller muskelknuter i livmoren",
      "Vanskeligheter med å bli gravid",
      "Forandringer i livmorslimhinnen",
    ],
    sections: [
      {
        id: "office-hysteroskopi",
        heading: "Office-hysteroskopi",
        content: "Vi tilbyr også office-hysteroskopi som kan gjennomføres uten narkose eller bedøvelse, og umiddelbart ved besøk hos gynekolog."
      },
    ],
    relatedSpecialists: ["kristian-ophaug"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "fertilitet/saedanalyse": {
    title: "Sædanalyse",
    subtitle: "Uten henvisning • Ingen ventetid",
    parentCategory: "Fertilitet",
    heroImage: fertilitetImg,
    description: "En sædanalyse er en trygg og enkel måte å kartlegge mannens sædkvalitet på. Prøven gir viktig informasjon om antall, bevegelighet og utseende på spermiene, og brukes ofte som første steg når man ønsker å undersøke fertilitet eller planlegger assistert befruktning.\n\nPrøven tas ved utløsning og kan leveres på klinikken. Analysen gir et tydelig bilde av sædkvaliteten og kan bidra til å avgjøre om videre utredning eller behandling er nødvendig.\n\nSædanalyse kan også være første steg dersom man ønsker å fryse ned spermier for fremtidig bruk – for eksempel før medisinsk behandling eller andre inngrep som kan påvirke fertiliteten.",
    sections: [
      {
        id: "enkel-saedprove",
        heading: "Enkel sædprøve",
        content: "En enkel sædprøve gir en grunnleggende vurdering av mannens sædkvalitet, inkludert antall sædceller, konsentrasjon, bevegelighet og utseende. Dette gir viktig informasjon om fertilitet og kan være første steg i kartleggingen av fruktbarhet.\n\n**Forberedelser:**\n- Det anbefales 2 dagers abstinens siden siste utløsning\n- Kvelden før prøven: vask penis med såpe og vann\n- På prøvedagen: vask kun med vann, unngå kremer eller oljer\n- Prøven kan tas på klinikken eller hjemme. Ved hjemmeprøve: lever den innen én time og hold den kroppstemperert. Ikke bruk glidemiddel eller spytt\n\nAnalysen gjøres i laboratoriet, og resultatene gir oss et klart bilde av sædkvaliteten, slik at vi kan vurdere om videre undersøkelser eller behandling er nødvendig."
      },
      {
        id: "utvidet-saedprove",
        heading: "Utvidet sædprøve",
        content: "En utvidet sædprøve gir en mer detaljert vurdering, inkludert morfologi og DNA-fragmentering. Dette kan være aktuelt ved redusert sædkvalitet eller for å kartlegge årsaker til infertilitet, inkludert gjentatte aborter.\n\n**Når kan den være nødvendig?**\n- Vedvarende redusert sædkvalitet\n- Gjentatte aborter\n\n**Forberedelser:**\n- Samme hygieneregler som for enkel prøve\n- Det anbefales 1 dags abstinens\n- Prøven tas kun på klinikken og må avtales på forhånd\n\nVed behov kan sæd også fryses ned for fremtidig bruk, for eksempel før medisinsk behandling som kan påvirke fertiliteten, sterilisering eller kjønnsbekreftende behandling."
      },
      {
        id: "etter-vasektomi",
        heading: "Sædprøve etter vasektomi/refertilisering",
        content: "Vi anbefaler sædprøve tre måneder etter inngrepet. Dersom inngrepet er utført hos CMedical, er denne prøven kostnadsfri."
      },
      {
        id: "nedfrysning",
        heading: "Nedfrysning av sæd",
        content: "Sæd kan fryses ned for fremtidig bruk, for eksempel før medisinsk behandling som kan påvirke fertiliteten, ved sterilisering eller i forbindelse med kjønnsbekreftende behandling.\n\n**Forberedelser:**\nFør nedfrysning må du ta lovpålagte blodprøver for HIV, hepatitt B og hepatitt C. Rekvisisjoner til prøvene får du av oss.\n\nSamme hygieneregler gjelder som ved vanlig sædprøve, og vi anbefaler 1–2 dagers avhold før prøvetaking. Prøven tas på klinikken, og timen må avtales på forhånd."
      },
    ],
    relatedSpecialists: ["kristian-ophaug"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "fertilitet/teamet": {
    title: "Fertilitetsteamet",
    subtitle: "Møt teamet som hjelper deg med å oppfylle barneønsket.",
    parentCategory: "Fertilitet",
    heroImage: heroFamily,
    description: "Vårt fertilitetsteam består av erfarne reproduksjonsmedisinere, gynekologer, embryologer, sykepleiere og psykologer som alle er dedikert til å hjelpe deg.\n\nVi legger stor vekt på personlig oppfølging og tett kommunikasjon gjennom hele behandlingsforløpet. Du skal føle deg trygg og ivaretatt hos oss.",
    benefits: [
      "Erfarne reproduksjonsmedisinere og gynekologer",
      "Spesialiserte embryologer med internasjonal erfaring",
      "Dedikerte fertilitets-sykepleiere for daglig oppfølging",
      "Psykolog for emosjonell støtte under behandlingen",
      "Tverrfaglig samarbeid for best mulig resultat",
    ],
    faqs: [
      { question: "Hvem er min kontaktperson?", answer: "Du får en dedikert fertilitets-sykepleier som er din hovedkontaktperson gjennom hele behandlingen." },
    ],
  },

  // ==========================================
  // ORTOPEDI
  // ==========================================
  "ortopedi/fot-ankel": {
    title: "Fot og ankel",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Ortopedi",
    heroImage: ortopediImg,
    description: "Vi tilbyr alle subspesialiteter innen ortopedisk kirurgi, og våre spesialister kan utføre alle typer ortopediske operasjoner. Bestill time hos en erfaren ortoped med kort ventetid.",
    sections: [
      {
        id: "kompartment-syndrom",
        heading: "Kompartment-syndrom",
        content: "Muskelhinnen er ikke ettergivende og tøyes ikke i forhold til muskulaturen. Dette fører til økt trykk i muskulaturen og redusert blodsirkulasjon som resulterer i smerter (manglende blodtilstrømning gir smerter på grunn av oksygenmangel). Dette skjer oftest i fremre ytre leggmuskelkompartment. Smertene varer kun i aktivitet og forsvinner som regel etter trening og i hvile.\n\n**Behandling:** Behandling av kronisk kompartment-syndrom er i første omgang å unngå provoserende belastning samt alternativ trening i en periode på 3 måneder. Deretter gjenopptas treningen gradvis med tilpasset skotøy og god støtdempning. Dersom plagene kommer tilbake, er det grunn til å vurdere operasjon.\n\n**Operasjon:** Operasjon av kronisk kompartment-syndrom foregår i narkose. Muskelhinnene spaltes gjennom to små snitt i huden."
      },
      {
        id: "ballettankel",
        heading: "Ballettankel",
        content: "I ankelen kan trange forhold baktil gi bakre impingement eller innklemming av strukturer med påfølgende huggende smerter. Tilstanden er vanlig hos ballettdansere grunnet tåspissposisjonen, men den forekommer også hos turnere og fotballspillere.\n\nMan kan se beinpåleiringer baktil i leddet ved ballettankel. Disse kan løsne og gi frie legemer som kommer i beknip. Hos 10% av befolkningen finnes det en beinkjerne baktil for ankelleddet som ikke er vokst sammen med skinnebeinet.\n\n**Symptomer og utredning:** Smerter baktil i leddet når ankelen belastes med strak vrist. Røntgenundersøkelse, MR eller ultralyd kan verifisere funnene.\n\n**Operasjon:** Operasjonen gjøres i narkose og lokalbedøvelse. Artroskop og instrumenter brukes bakfra gjennom 7 mm åpninger for å komme inn til leddet. Deretter fjernes beinpåleiringer eller løst ben."
      },
      {
        id: "haglunds-hael",
        heading: "Haglunds hæl",
        content: "Mellom hælbeinet og achillessenen finnes en slimpose. Denne kan bli betent på grunn av kronisk irritasjon og trange sko. Etter hvert kan denne irritasjonen føre til bein- og bruskdannelse bak på hælbeinet – det vokser frem en kul på en allerede prominent knokkel. Røntgen med skråbilder viser som regel denne kulen (Haglunds hæl). I første omgang må man bygge opp under hælen for å avlaste trykket.\n\n**Operasjonen:** Ved langvarige plager og betydelig kul kan det bli nødvendig å fjerne kulen kirurgisk. Operasjonen gjøres i lokalbedøvelse og med avslappende medisin. Det legges på en gipsskinne som pasienten beholder i to uker. Deretter starter et opptreningsprogram. Man må minst regne med åtte uker før man gjenopptar vanlig trening."
      },
      {
        id: "achilles-tendinalgi",
        heading: "Achilles tendinalgi",
        content: "Achilles tendinalgi er egentlig flere tilstander som benevnes med samme navn:\n\n- Seneskjedebetennelse, det vil si betennelse i hinnen rundt senen (paratendinitis)\n- Skadet senevev (seneavrivning (akutt) eller slitasje (kronisk))\n\nDet er ikke alltid betennelse i selve seneskjeden som forårsaker smerten, men det kan være små mikrorifter i senen som dannes ved overbelastning. Disse skadene repareres dårlig, sannsynligvis på grunn av relativt dårlig blodsirkulasjon i området.\n\n**Behandling:** I første omgang forsøk på å få senevevet til å hele normalt med eksentrisk trening hos fysioterapeut. Sjokkbølgebehandling (ESWT) kan supplere treningen. Feilstilling i foten (pronasjon) disponerer for achillesseneplager og må korrigeres med såler og riktig skotøy.\n\nEn liten dose kortisoninjeksjon med ultralydveiledning kan forsøkes mot seneskjedebetennelse. Operasjon kan være nødvendig dersom ingen av behandlingene fører frem."
      },
    ],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "ortopedi/hofte": {
    title: "Hofte",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Ortopedi",
    heroImage: ortopediImg,
    description: "Behandling av skader i selve hofteleddet kan med moderne teknikk utføres som kikkhullsoperasjon. Ved hofteskopi kan skader i mange tilfeller repareres slik at leddet kan bevares lengst mulig. Jo mer skadet leddet er, desto mindre sikkert er det at leddet blir helt smertefritt. De fleste pasienter opplever betydelig lindring etter ca. 3 måneder.\n\nHofteskopi utføres ved hjelp av små snitt (kikkhull) som gir kirurgen tilgang til hofteleddet. Operasjonen gjøres under narkose og tar vanligvis 1–2 timer. Etter operasjonen overvåkes du før du kan reise hjem, vanligvis etter 1–2 timer.\n\nKontrolltime på poliklinikken avtales ca. 6–8 uker etter operasjonen. Sykemeldingens lengde avhenger av operasjonen og arbeidsoppgaver, og varierer fra 4–6 uker.",
    relatedSpecialists: ["kristian-marstrand-warholm"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "ortopedi/hand-albue": {
    title: "Hånd og albue",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Ortopedi",
    heroImage: ortopediImg,
    description: "Vi tilbyr alle subspesialiteter innen ortopedisk kirurgi, og våre spesialister kan utføre alle typer ortopediske operasjoner. Bestill time hos en erfaren ortoped med kort ventetid.",
    sections: [
      {
        id: "tennisalbue",
        heading: "Tennisalbue",
        content: "Diagnosen stilles ved vanlig undersøkelse og eventuelt ultralyd. Ved milde og begynnende symptomer kan smertestillende og betennelsesdempende medisin være nok. Injeksjon med PRP (platerikt blodplasma) eller lav dose kortison kan forsøkes. En periode i ro kan være nødvendig. Når plagene er større og vedvarer er operasjon indisert.\n\n**Operasjonen:** Utføres i lokalbedøvelse. Det legges et snitt på utsiden av albuen og det ødelagte senevevet fjernes, og knokkelen er stimulert for blødning for å øke tilhelingspotensialet."
      },
      {
        id: "handleddsartroskopi",
        heading: "Håndleddsartroskopi",
        content: "Artroskopi (kikkhullsoperasjon) av håndleddet er brukt for å stille en riktig diagnose hvis du har uforklarlige smerter i håndleddet, og samtidig for å behandle eller operere en eventuell skade.\n\n**Operasjon ved smerter i håndledd:** Håndleddsartroskopi gjøres i narkose og lokalbedøvelse. Kirurgen setter inn en optikk/et lite kamera (skop) gjennom små hull i huden, samt små instrumenter gjennom andre hull. Bildet ses på en skjerm og kirurgen arbeider ut fra denne.\n\nHos oss får pasienter oppfølging av håndterapeut etter avanserte håndoperasjoner."
      },
      {
        id: "carpal-tunnel",
        heading: "Carpal tunnel syndrom",
        content: "Carpal tunnel syndrom er en vanlig årsak til smerter og nummenhet i hånd og fingre. Tilstanden er hyppigere hos kvinner og forekommer hos 10% av befolkningen. Hos de fleste er årsaken ukjent. Reumatikere, diabetikere, stoffskiftesyke, eldre og personer med tidligere håndleddsbrudd er disponerte.\n\n**Symptomer:** Typiske symptomer er smerter og nummenhet i tommel, pekefinger og langfinger, og halve ringfinger. Ofte våkner pasientene på nattestid og må riste på hånda for å minske smerten. I langtkomne tilfeller kan den store tommelmuskelen svinne og svekkes.\n\nPlagene forårsakes av press på en nerve (nervus medianus) i en kanal i håndleddet.\n\n**Operasjon og behandling:** Inngrepet kan gjøres med kikkhullskirurgi/endoskopisk carpal tunnel. Endoskopisk operasjon fører til kortere sykmelding og raskere rehabilitering sammenlignet med åpen operasjon. Den gjøres i kortvarig narkose eller lokalbedøvelse. Båndet som danner taket av tunnelen deles for å gjøre plass for nerven."
      },
    ],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "ortopedi/kne": {
    title: "Kne",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Ortopedi",
    heroImage: ortopediImg,
    description: "Vi tilbyr alle subspesialiteter innen ortopedisk kirurgi, og våre spesialister kan utføre alle typer ortopediske operasjoner. Bestill time hos en erfaren ortoped med kort ventetid.",
    sections: [
      {
        id: "bruskskader",
        heading: "Bruskskader i kneet",
        content: "Artrose, eller slitasjegikt, er en progressiv degenererende sykdom der leddbrusken slites ned og meniskene kan bli utslitte. Leddspalten forsnevres og beinpåleiringer dannes rundt leddet.\n\nArtrose er delvis en genetisk sykdom, delvis aldersrelatert, og blir forverret ved mye belastning over tid. 40–50 åringer begynner som regel å kjenne til leddsmertene, men tilstanden kan oppstå i yngre alder etter skader som meniskskader, korsbåndskader eller beinbrudd.\n\n**Symptomer:** Smerter ved aktivitet, hevelse og stivhet (ofte økt væske i kneet). Problemer med god sovestilling for knærne, morgenstivhet, startvansker og forverring ved kulde er også vanlig. Muskulaturen i benet blir svakere og man begynner å halte. I senere faser kan kneet få en skjevstilling grunnet mer slitasje på en av sidene."
      },
    ],
    relatedSpecialists: ["marc-jacob-strauss"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "ortopedi/skulder": {
    title: "Skulder",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Ortopedi",
    heroImage: ortopediImg,
    description: "Vi tilbyr alle subspesialiteter innen ortopedisk kirurgi, og våre spesialister kan utføre alle typer ortopediske operasjoner. Bestill time hos en erfaren ortoped med kort ventetid.",
    sections: [
      {
        id: "kalkskulder",
        heading: "Kalkskulder",
        content: "Årsaken til kalkskulder er kalk i senen. Kalken oppstår som et resultat av senebetennelser under skulderbuen. Det gir smerter ved bruk av armen.\n\nOfte er tilstanden til stede sammen med impingementsyndrom og må behandles samtidig. Operasjon av kalkskulder kan være nødvendig, dersom plagene ikke kan reduseres med trykkbølger, medikamenter og fysioterapi.\n\n**Operasjon og behandling:** Operasjon av kalkskulder foregår ved at man legger et snitt i senen og fjerner kalkmassene. Som regel gjøres en subacromiell dekompresjonsoperasjon samtidig hvor skulderbladkantens underside jevnes for å unngå innklemming av senen når armen løftes."
      },
      {
        id: "slap",
        heading: "SLAP",
        content: "SLAP (Superior Labrum Anterior to Posterior) er øvre leddleppe (labrum)-skade i skulderbladskålen (glenoid) og indikerer en skadetype hvor øvre del av leddleppen i skulderen med feste for bicepssenen er løs.\n\n**Symptomer:** Smerter og av og til kneppfølelse i skulderen, spesielt ved kasting. Diagnosen stilles med legeundersøkelse, MR og artroskopi.\n\n**Operasjon:** Med leddkikkert og mikrokirurgisk teknikk sys leddleppen og bicepssenefestet på plass mot leddskålen. Alternativt løsnes bicepssenen fra leddleppen og slippes ut i seneskjeden (bicepstenotomy)."
      },
      {
        id: "frozen-shoulder",
        heading: "Frozen shoulder",
        content: "Frozen shoulder er en betennelse i leddhinnen i skulderleddet. Det er en smertefull tilstand hvor man opplever smerter og nedsatt funksjon i skulder og ofte arm. Både kvinner og menn kan få frozen shoulder, men de som rammes hyppigst er kvinner i aldersgruppen 40–60 år.\n\n**Operasjonen:** Kapselløsning gjøres i narkose med artroskopi (kikkhullsoperasjon) av skulderleddet og man oppnår full bevegelse med en gang etter operasjonen. Hensikten er å bedre bevegeligheten gjennom å løsne kontrollert på den stive skulderkapselen og tøye skulderen til full bevegelighet."
      },
    ],
    relatedSpecialists: ["tom-henry-sundoen"],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Hva er ventetiden?", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },

  // ==========================================
  // FLERE FAGOMRÅDER
  // ==========================================
  "flere-fagomrader/endokrinologi": {
    title: "Endokrinologi",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Endokrinologi er en medisinsk spesialitet som handler om hormonsystemet og sykdommer knyttet til kjertler som produserer hormoner, som for eksempel skjoldbruskkjertelen, binyrene, hypofysen og biskjoldkjertlene.\n\nEndokrinologer utreder, behandler og følger opp pasienter med hormonelle forstyrrelser. For å finne ut om du har en hormonell sykdom starter vi med en grundig konsultasjon og undersøkelse, som ofte inkluderer blodprøver og eventuelt bildeundersøkelser.\n\nHar du plager knyttet til hormoner, stoffskifte, diabetes eller andre endokrine tilstander, anbefaler vi deg å ta kontakt med oss eller bestille en konsultasjon.",
    benefits: [
      "Erfarne endokrinologer med spisskompetanse",
      "Grundig hormonutredning med blodprøver og bildeundersøkelser",
      "Individuelt tilpasset behandling og oppfølging",
      "Tverrfaglig samarbeid med ernæringsfysiolog",
    ],
    relatedSpecialists: ["ersan-krckov"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "flere-fagomrader/hudlege": {
    title: "Hudlege",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Dermatologi og venerologi er et medisinsk fagfelt som omhandler hud, hår, negler og slimhinner, og hvordan ulike tilstander påvirker hudhelsen. Vi utreder og behandler et bredt spekter av hudlidelser – fra vanlige tilstander som akne, eksem, rosacea, perioral dermatitt og psoriasis, til mer komplekse diagnoser som hudkreft og autoimmune tilstander i hud.\n\nI tillegg tilbys behandling av vorter, overdreven svette og solskader, samt føflekksjekk og fjerning ved behov.\n\nVi tilbyr grundig vurdering og behandling tilpasset din hud og dine behov – enten du søker medisinsk hjelp eller ønsker faglig rådgivning for sunnere hud.",
    benefits: [
      "Bredt spekter av hudlidelser – akne, eksem, rosacea, psoriasis",
      "Føflekksjekk og fjerning ved behov",
      "Behandling av hudkreft og autoimmune tilstander",
      "Vortebehandling og solskader",
      "Grundig vurdering tilpasset din hud",
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "flere-fagomrader/ernaringsfysiolog": {
    title: "Ernæringsfysiolog",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Ernæringsfysiologi er et felt som ser på hvordan mat påvirker kroppen og helsen. Ernæringsfysiologer studerer næringsstoffer i mat, vurderer ernæringsbehov, og gir råd for å oppmuntre til en sunn livsstil.\n\nVår kliniske ernæringsfysiolog gir deg veiledning innen kosthold og livsstil, skreddersydd til deg og dine behov.",
    sections: [
      {
        id: "formalet",
        heading: "Formålet",
        content: "Målet er å hjelpe folk med å oppnå og beholde god helse ved å følge riktig kosthold og ernæringsprinsipper. Ernæringsfysiologer gir støtte og veiledning for å hjelpe enkeltpersoner med å nå sine ernæringsmål og forbedre generelt velvære. Hos oss jobber ernæringsfysiolog med andre spesialister i de tilfellene der det er nyttig for pasienten."
      },
      {
        id: "spesialisering",
        heading: "Spesialisering",
        content: "Vår kliniske ernæringsfysiolog Mari Borge Eskerud har spesialisering innen IBS og lavFODMAP-dietten. Hun har tidligere jobbet ved Lovisenberg Diakonale Sykehus, hvor hun har hjulpet pasienter med irritabel tarm-syndrom (IBS) gjennom evidensbasert kostholdsveiledning. Mari er sertifisert i lavFODMAP-dietten av Monash University.\n\nI tillegg til sin spesialisering innen mage- og tarmhelse, har hun særlig kompetanse innen ernæring relatert til fertilitet, overgangsalder, Polycystisk ovariesyndrom (PCOS) og graviditet. Hun jobber også med generell ernæringsveiledning for god helse og velvære.\n\nMari er medforfatter av boken «Sunn og frisk med sensitiv mage – en fullstendig guide til kosthold og mestring» (2018), sammen med Cecilie Hauge Ågotnes."
      },
    ],
    benefits: [
      "Spesialisering innen IBS og lavFODMAP-dietten",
      "Sertifisert av Monash University",
      "Kompetanse innen ernæring ved fertilitet, PCOS og graviditet",
      "Individuelt tilpasset kostholdsveiledning",
      "Tverrfaglig samarbeid med andre spesialister",
    ],
    relatedSpecialists: ["mari-borge-eskerud"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
    ],
  },
  "flere-fagomrader/gastrokirurgi": {
    title: "Gastrokirurgi",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Gastrokirurgi er en medisinsk spesialitet som omhandler kirurgiske inngrep i fordøyelsessystemet, inkludert mage, tarm, lever, galleblære og bukspyttkjertel. Dette kan være operasjoner for å behandle tilstander som magekreft, tarmlidelser, gallestein og andre gastrointestinale sykdommer. Det inkluderer også fedmekirurgi, som for eksempel Gastric Sleeve, der målet er varig vektreduksjon og bedret helse.\n\nGastrokirurger benytter avanserte teknikker som kikkhullskirurgi og robotassistert kirurgi for å tilby mindre invasive behandlinger. Hos oss får du tilgang til noen av landets fremste spesialister.",
    sections: [
      {
        id: "bariatrisk-kirurgi",
        heading: "Bariatrisk kirurgi",
        content: "Med bariatrisk kirurgi kan vi tilby trygge og varige løsninger for vektreduksjon."
      },
      {
        id: "sleeve-gastrektomi",
        heading: "Sleeve gastrektomi",
        content: "Robotassistert kirurgi for sleeve gastrektomi – rSG – er en moderne form for laparoskopisk (kikkehull) overvektskirurgi, hvor den nyeste teknologien brukes for å oppnå enda større presisjon enn ved tradisjonell teknikk. Under dette inngrepet fjernes 60–80% av magesekken, og den gjenværende delen formes til en smal såkalt «sleeve» som begrenser matinntaket. Dette kan føre til betydelig vekttap, samtidig som kroppens evne til å ta opp næringsstoffer bevares.\n\nVed laparoskopisk robotassisterte inngrep benytter kirurgen tynne instrumenter som føres inn gjennom små snitt i bukveggen, i stedet for å lage et større snitt som ved tradisjonell åpen kirurgi. Denne skånsomme tilnærmingen gir flere fordeler for pasienten: mindre blodtap, mindre smerter, kortere restitusjonstid og penere kosmetisk resultat.\n\nDet er viktig å være klar over at det ikke er en robot som utfører operasjonen. Din kirurg styrer hele prosedyren ved hjelp av avansert robotteknologi. Kirurgen sitter ved en konsoll med høyoppløselig 3D-bilde av operasjonsfeltet, og styrer kirurgiske instrumenter med høy presisjon."
      },
    ],
    benefits: [
      "Robotassistert bariatrisk kirurgi (sleeve gastrektomi)",
      "Kikkhullsoperasjoner for gallestein",
      "Utredning og behandling av endetarmsplager",
      "Brokkbehandling med kikkehull og åpen teknikk",
      "Gratis digital førstekonsultasjon for fedmevurdering",
      "Tverrfaglig oppfølging med ernæringsfysiolog",
    ],
    relatedSpecialists: ["marian-bale"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
    ],
  },
  "flere-fagomrader/osteopati": {
    title: "Osteopati",
    subtitle: "Kort ventetid • Ingen henvisning",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Osteopati er en manuell behandlingsform som betyr at hendene er osteopatens viktigste verktøy for diagnostisering og behandling. Osteopati komplementerer medisinsk utredning og behandling.\n\nOsteopatene er autorisert helsepersonell og følger lov for helsepersonell.",
    sections: [
      {
        id: "kvinnehelse",
        heading: "Kvinnehelse",
        content: "På det tverrfaglige behandlingsteamet hos oss har osteopaten en naturlig plass i behandlingsplanen innenfor vulvasmerter, bekkenbunnsdysfunksjon, smerter og nedsatt funksjon i muskelskjelettsystemet, i oppfølging av gravide kvinner og kvinner etter fødsel.\n\nI tillegg vil osteopatisk behandling kunne ha gunstig effekt ved smerter relatert til endometriose/adenomyose og stress.",
      },
      {
        id: "behandling",
        heading: "Behandling",
        content: "Manuell behandling, fysisk aktivitet og håndtering av en stressende hverdag er noe av det vanligste osteopater jobber med. Osteopater benytter seg av et bredt spekter av manuelle behandlingsteknikker i hele kroppen. Teknikkene kan oppleves både lette og mer kraftfulle men det er viktig at behandlingene tilpasses deg og der du befinner deg i syklus, dagsform og i livet.",
      },
      {
        id: "tverrfaglig",
        heading: "Tverrfaglig",
        content: "Det unike på CMedical er at osteopatene jobber tett i tverrfaglig team med gynekolog og urolog om ulike gynekologiske og urologiske problemstillinger.\n\nVi holder tett dialog og skreddersyr din behandling.\n\nVi vurderer bekkenbunnsfunksjon som en del av oppfølgingen av kvinnen etter fødsel, mannen før / etter prostataoperasjon eller ved inkontinens, fremfall eller smerteproblematikk.",
      },
      {
        id: "mal-med-behandling",
        heading: "Mål med behandling",
        content: "Osteopaten er opptatt av å finne hva som er viktig for deg, og hvordan dere sammen kan skape en trygg arena der du kan bruke kroppen din på en god måte. Å skape en trygg arena for tillitsfull kommunikasjon og behandling er nødvendig for et godt resultat av behandlingen. Det er alltid et hovedmål ved hvert pasientmøte.",
      },
    ],
    relatedSpecialists: ["ingvild-skarpas-aannerud"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
    ],
  },
  "flere-fagomrader/plastikkirurgi": {
    title: "Plastikkirurgi",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Plastisk kirurgi kan hjelpe til med å gjenopprette kroppens form og funksjon etter for eksempel kreftsykdom, brannskader, graviditet og fødsel. Dette inkluderer inngrep som bukplastikk, brystkirurgi og andre rekonstruktive behandlinger.\n\nVår plastiske kirurg har lang erfaring med løsninger godt tilpasset den enkelte pasient. Med avanserte teknikker og et trygt medisinsk miljø er du i de beste hender. Bestill en konsultasjon for en personlig vurdering og profesjonell veiledning.",
    benefits: [
      "Bukplastikk og brystkirurgi",
      "Rekonstruktive behandlinger etter kreftsykdom",
      "Erfaren plastisk kirurg med individuelt tilpassede løsninger",
      "Avanserte teknikker i trygt medisinsk miljø",
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
    ],
  },
  "flere-fagomrader/psykologi": {
    title: "Psykologi",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Du trenger ikke å ha en psykisk lidelse eller diagnose for å gå til psykolog. Mange ønsker å ha en nøytral samtalepartner over kortere eller lengre tid for å sortere tanker og følelser, eller motta støtte gjennom en utfordrende periode med f.eks. endometriose-, vulvodyni- eller fertilitetsbehandling. Hos oss jobber våre spesialister i unike tverrfaglige team for å hjelpe deg best mulig.",
    sections: [
      {
        id: "hva-kan-vi-hjelpe-med",
        heading: "Hva kan vi hjelpe med?",
        content: "Hos psykolog kan du få hjelp til å håndtere smerter, bearbeide vanskelige erfaringer, utforske identitet og seksualitet, og du kan bli utredet og behandlet for psykiske lidelser. Om det dukker opp andre plager som trenger videre oppfølging, kan en psykolog henvise deg til videre utredning og behandling."
      },
      {
        id: "fertilitetsradgivning",
        heading: "Fertilitetsrådgivning",
        content: "Kristian Ophaug har over 20 års erfaring som terapeut i spesialisthelsetjenesten, og har siden 2022 jobbet ved Kvinneklinikken på Rikshospitalet. Han er utdannet klinisk sosionom og familieterapeut, og spesialiserer seg innen psykisk helse i svangerskap og barsel.\n\nSiden 2018 har han jobbet med par som opplever ufrivillig barnløshet og har vært fertilitetsrådgiver ved IVF-avdelingen på Oslo Universitetssykehus. Som Norges eneste mannlige fertilitetsrådgiver gir han støtte til ufrivillig barnløse menn, og fokuserer på begge parter for å lette utfordringene i behandlingsprosessen.\n\nKristian hjelper kvinner og menn med å uttrykke og bearbeide følelser rundt ufrivillig barnløshet, og tilbyr verktøy for å håndtere de følelsesmessige utfordringene. Han gir også råd om hvordan par kan støtte hverandre gjennom prosessen, eller til enkeltpersoner som går gjennom det alene.\n\nSamtalene tilpasses individuelle behov, og Kristian gir veiledning for å normalisere tanker og følelser, samt verktøy for å håndtere sorg ved mislykkede forsøk eller spontanaborter."
      },
    ],
    relatedSpecialists: ["kristian-ophaug"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
    ],
  },
  "flere-fagomrader/revmatologi": {
    title: "Revmatologi",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Revmatologi er en spesialitet innen medisin som handler om å forstå og behandle problemer med ledd, muskler og bindevev i kroppen.\n\nRevmatologer utreder, behandler og følger opp pasienter med revmatisme. For å finne ut om du har revmatisme, starter vi med grundig konsultasjon og undersøkelse, som ofte innebærer ultralyd og blodprøver.\n\nHar du plager anbefaler vi deg å ta kontakt med oss eller bestille en konsultasjon.",
    sections: [
      {
        id: "utredning",
        heading: "Utredning",
        content: "**Diagnoser:** Dette kan inkludere sykdommer der kroppens eget forsvarssystem angriper disse områdene, som for eksempel revmatoid artritt eller systemisk lupus erythematosus.\n\nRevmatologer, som er spesialleger, bruker forskjellige metoder som medisiner, fysisk terapi og livsstilsråd for å hjelpe mennesker med slike problemer og forbedre livskvaliteten deres.\n\nVi tilbyr rask tilgang til ledende revmatologer for utredning og behandling av revmatisme."
      },
    ],
    benefits: [
      "Erfarne revmatologer med spesialkompetanse",
      "Grundig utredning med ultralyd og blodprøver",
      "Behandling av revmatoid artritt og lupus",
      "Medisiner, fysisk terapi og livsstilsråd",
    ],
    relatedSpecialists: ["birgir-gudbrandsson"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
    ],
  },
  "flere-fagomrader/robotkirurgi": {
    title: "Robotassistert kirurgi",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Flere fagområder",
    heroImage: heroTech,
    description: "Robotassistert kirurgi er en avansert, men skånsom form for behandling. Operasjonen gjennomføres som ved klassisk kikkhullskirurgi, gjennom små åpninger i huden. Ved robotkirurgi styrer kirurgen instrumentene elektronisk fra en konsoll ved siden av pasienten. Maskinholdte instrumenter gir svært presise bevegelser, og et høyoppløselig, stereoskopisk 3D-kamera gir kirurgen et usedvanlig godt bilde.\n\nVi tilbyr robotassistert kirurgi innen blant annet:\n- Muskelknuter (fertilitetsbevarende kirurgi)\n- Dyp endometriose\n- Hysterektomi, også ved forstørret livmor\n- Brokk\n- Godartet forstørret prostata (RASP)\n- Prostatakreft (RALP)",
    sections: [
      {
        id: "rask-rehabilitering",
        heading: "Rask rehabilitering",
        content: "Robotkirurgi er en moderne og skånsom operasjonsmetode hvor kirurgen opererer gjennom små snitt i stedet for et større operasjonssår. Dette gir mindre ubehag, redusert blødning, færre komplikasjoner og raskere tilheling.\n\n**En raskere vei til restitusjon:** Mange pasienter kan reise hjem allerede dagen etter inngrepet. Allerede samme kveld er det mulig å spise, bevege seg og føle seg mer som seg selv igjen.\n\n**Kortere sykemelding:** Avhengig av hvilken type jobb og hvilket inngrep du har gjennomgått, kan du forvente en sykemeldingsperiode på 2–3 uker. Sammenlignet med tradisjonell åpen kirurgi gir robotkirurgi en raskere vei tilbake til hverdagen."
      },
      {
        id: "presisjon",
        heading: "Presisjon som merkes",
        content: "Med høyoppløselig 3D-kamera og avanserte instrumenter med stor presisjon har kirurgen svært god kontroll. Dette bidrar til skånsomhet og høy kvalitet i hvert inngrep. I bekkenet finnes det ømfintlig vev som lett kan skades under kirurgi, som ved nervesparende operasjoner ved dyp endometriose eller ved fjerning av prostata.\n\n**Ergonomi – også for kirurgen:** Under robotkirurgi sitter kirurgen i en ergonomisk og komfortabel arbeidsstilling. Dette bidrar til økt konsentrasjon og mindre utmattelse, noe som igjen reduserer risikoen for feil.\n\n**Erfarne spesialister – trygg behandling:** Robotkirurgi hos oss utføres av spesialister innen urologi og gynekologi. Målet er alltid det samme: å gi deg den tryggeste behandlingen og den best mulige opplevelsen både før, under og etter operasjonen."
      },
    ],
    benefits: [
      "Eneste private aktør med robotkirurgi i Norge",
      "da Vinci-systemet for maksimal presisjon",
      "Brukes innen gynekologi, urologi og gastrokirurgi",
      "Kortere sykehusopphold – hjem innen ett døgn",
      "Sykemeldingsperiode på kun 2–3 uker",
      "Erfarne kirurger med høyt volum",
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
    ],
  },
  "flere-fagomrader/sexologi": {
    title: "Sexologi",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Når man rammes av sykdom eller helseutfordringer, enten fysiske eller psykiske, kan det også oppstå utfordringer knyttet til seksuell helse. Dette kan dreie seg om seksuell funksjon, lyst, tenning, selvbilde, kroppsbilde, seksuell glede, relasjoner eller identitet. Seksualitetsrelaterte utfordringer påvirker ofte den generelle livskvaliteten.\n\nEn sexolog kan gjennom terapeutiske samtaler gi støtte, veiledning og råd til enkeltpersoner eller par som opplever vanskeligheter knyttet til seksuell trivsel og intimitet. Samtalene kan bidra til å utforske og håndtere det som oppleves som utfordrende, eller gi veiledning om seksualtekniske hjelpemidler.",
    sections: [
      {
        id: "skreddersydd-veiledning",
        heading: "Skreddersydd veiledning",
        content: "Ved diagnoser som er assosiert med smerte og fysisk ubehag, gir en sexolog tilpasset veiledning for å håndtere disse utfordringene. Dette kan inkludere strategier for smertelindring, utforsking av alternative former for seksuell nytelse og styrking av kommunikasjonen om man er i et parforhold.\n\nFor par som opplever ufrivillig barnløshet, kan en sexologisk rådgiver hjelpe dem med å navigere gjennom det som er følelsesmessig utfordrende slik at intimiteten opprettholdes og stress reduseres."
      },
      {
        id: "kompetanseomrader",
        heading: "Kompetanseområder",
        content: "Vår sexolog Kjersti Margrete Finsrud er sykepleier med videreutdanning som helsesykepleier, og spesialist i sexologisk rådgivning gjennom NACS (Nordic Association of Clinical Sexology). Hun har særlig kompetanse innen:\n\n- Kvinnehelse: vulvasmerter, vaginisme, seksualitet etter overgrep og i overgangsalder\n- Seksuell identitet og orientering\n- Seksuell lyst og funksjonsutfordringer\n- Erektil dysfunksjon og prestasjonsrelaterte utfordringer\n- Hormonelle endringer gjennom ulike livsfaser\n- Veiledning om seksuelle hjelpemidler og NAV-refusjon\n- Prevensjon og seksuell helse hos unge og voksne\n\nKjersti har en helhetlig tilnærming til seksuell helse, der kropp, psyke og relasjoner ses i sammenheng. Hun er opptatt av å skape en trygg og åpen samtale, der det er rom for å dele også det som kan være vanskelig – uten skam eller tabu."
      },
    ],
    relatedSpecialists: ["kjersti-margrete-finsrud"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
    ],
  },
  "flere-fagomrader/areknuter": {
    title: "Åreknutebehandling",
    subtitle: "Ingen ventetid • Ingen henvisning",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Åreknuter er veldig vanlig, og nesten 30% av alle over 30 år har det i varierende grad. Det er like vanlig med åreknuter hos menn som hos kvinner.\n\nRisikofaktorer for utvikling av åreknuter er for eksempel arv (genetisk), graviditet, overvekt, alder eller yrker som medfører ekstra belastninger (stående og sittende) på beina.\n\nÅreknuter oppstår i de overfladiske venene grunnet svikt i klaffene. En god undersøkelse med ultralyd vil avdekke årsakene, og du vil få tilpasset en moderne og effektiv behandling.",
    sections: [
      {
        id: "symptomer",
        heading: "Symptomer",
        content: "Symptomer varierer fra person til person. De vanligste symptomene på åreknuter er:\n\n- Smerter\n- Tunge eller trøtte bein\n- Prikkende ubehag\n- Kløe\n- Nattekramper i leggene\n- Hevelse\n\nLindres symptomene dine ved bruk av støttestrømper, så gir det en bedre prognose med tanke på lindring av symptomer. Hvis du ikke ønsker behandling for dine åreknuter etter konsultasjon, anbefaler vi bruk av støttestrømper, men disse vil kun lindre symptomer og aldri fjerne åreknutene."
      },
      {
        id: "spesialist",
        heading: "Vår karkirurg",
        content: "Dr. Einar André Brevik er en av Norges mest erfarne kar- og åreknutekirurger. Han tilbyr fullverdig karkirurgisk vurdering og utredning for åreknuter, venøs insuffisiens ved lymfødem og lipødem, claudicatio (røykebein), Raynauds syndrom, aortaaneurismer og second opinion innen karkirurgi.\n\nDr. Brevik har vært aktiv i det karkirurgiske miljøet gjennom Norsk karkirurgisk forening som leder, nestleder og styremedlem fra 2014 til 2019. Siden 2020 har han jobbet ved karkirurgisk avdeling på Haukeland universitetssykehus.\n\nTotalt har Dr. Brevik operert over 2000 pasienter med åreknuter med de mest moderne og skånsomme metoder."
      },
    ],
    benefits: [
      "En av Norges mest erfarne kar- og åreknutekirurger",
      "Over 2000 pasienter operert",
      "Grundig ultralydundersøkelse",
      "Moderne, skånsomme behandlingsmetoder",
      "Kort rekonvalesens",
    ],
    relatedSpecialists: ["einar-andre-brevik"],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Ta kontakt med oss så finner vi en tid som passer deg!" },
      { question: "Kan dere skrive ut sykemelding?", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Hva skjer ved første konsultasjon?", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Nedbetaling", answer: "Hos oss kan du benytte deg av nedbetaling på utvalgte klinikker. Spør oss for mer informasjon." },
    ],
  },

  // ==========================================
  // GRAVIDITET
  // ==========================================
  "graviditet/ultralyd": {
    title: "Ultralyd i svangerskapet",
    subtitle: "Tidlig ultralyd, terminbekreftelse og organrettet ultralyd.",
    parentCategory: "Graviditet",
    heroImage: heroPregnancy,
    description: "Vi tilbyr ultralydundersøkelser gjennom hele svangerskapet, fra tidlig ultralyd i uke 7 til organrettet ultralyd i uke 18-20. Våre fostermedisinere bruker det nyeste utstyret for best mulig bildekvalitet og diagnostikk.\n\nTidlig ultralyd bekrefter svangerskapet, daterer terminen og vurderer fosterets utvikling. Ved organrettet ultralyd gjennomgås fosterets organer systematisk for å avdekke eventuelle avvik.",
    benefits: [
      "Tidlig ultralyd fra uke 7 for å bekrefte svangerskap og termin",
      "Organrettet ultralyd uke 18-20 med detaljert gjennomgang",
      "Erfarne fostermedisinere med spisskompetanse",
      "Moderne utstyr for best mulig bildekvalitet",
      "Kort ventetid – time innen få dager",
    ],
    process: [
      { title: "Tidlig ultralyd (uke 7-12)", description: "Bekreftelse av svangerskap, datering av termin, antall fostre og hjerteaktivitet." },
      { title: "Nakketranslusensmåling (uke 11-14)", description: "Vurdering av risiko for kromosomavvik, kan kombineres med blodprøve." },
      { title: "Organrettet ultralyd (uke 18-20)", description: "Systematisk gjennomgang av fosterets organer, vekst og fostervannsvolum." },
    ],
    faqs: [
      { question: "Når kan jeg ta første ultralyd?", answer: "Tidlig ultralyd kan utføres fra uke 7. Da kan vi se fosterets hjerteaktivitet og beregne termin." },
      { question: "Hva koster ultralyd i svangerskapet?", answer: "Se vår prisliste for oppdaterte priser. Kontakt oss gjerne for mer informasjon." },
      { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte uten henvisning." },
    ],
  },
  "graviditet/nipt": {
    title: "NIPT",
    subtitle: "Non-invasiv prenatal test for kromosomanalyse.",
    parentCategory: "Graviditet",
    heroImage: heroPregnancy,
    description: "NIPT (Non-Invasive Prenatal Testing) er en blodprøve som analyserer fragmenter av fosterets DNA i morens blod for å påvise eventuelle kromosomavvik. Testen kan utføres fra uke 10 og har svært høy treffsikkerhet.\n\nNIPT kan påvise trisomi 21 (Downs syndrom), trisomi 18 (Edwards syndrom) og trisomi 13 (Pataus syndrom). Testen kan også bestemme kjønn.",
    benefits: [
      "Kan tas fra uke 10 i svangerskapet",
      "Svært høy treffsikkerhet (over 99% for trisomi 21)",
      "Enkel blodprøve – ingen risiko for fosteret",
      "Resultat innen 7-10 virkedager",
      "Kan også bestemme kjønn",
    ],
    faqs: [
      { question: "Hva er forskjellen på NIPT og fostervannsprøve?", answer: "NIPT er en screeningtest (blodprøve) uten risiko for fosteret. Fostervannsprøve er diagnostisk og gir sikkert svar, men har en liten risiko for spontanabort." },
      { question: "Hvem bør ta NIPT?", answer: "NIPT kan tilbys alle gravide, men er spesielt anbefalt ved forhøyet risiko etter KUB-test eller ved alder over 38 år." },
    ],
  },
  "graviditet/svangerskapsteam": {
    title: "Svangerskapsteam",
    subtitle: "Tverrfaglig oppfølging gjennom svangerskapet.",
    parentCategory: "Graviditet",
    heroImage: heroPregnancy,
    description: "Vårt svangerskapsteam gir deg helhetlig oppfølging gjennom hele svangerskapet. Teamet består av erfarne fostermedisinere, jordmødre og gynekologer som samarbeider for å gi deg den tryggeste oppfølgingen.\n\nVi tilbyr skreddersydd svangerskapskontroll tilpasset dine behov, enten du ønsker ekstra oppfølging eller har en risikograviditet.",
    benefits: [
      "Erfarne fostermedisinere og jordmødre",
      "Skreddersydd oppfølging tilpasset dine behov",
      "Oppfølging av risikosvangersskap",
      "Tilgjengelig for spørsmål gjennom hele svangerskapet",
      "Samarbeid med fødeavdeling ved behov",
    ],
    faqs: [
      { question: "Hva inkluderer svangerskapsoppfølging?", answer: "Regelmessige kontroller med blodprøver, blodtrykk, urinprøve, ultralyd og samtale om trivsel og forberedelse til fødsel." },
      { question: "Kan jeg velge dere i stedet for fastlegen?", answer: "Ja, du kan velge privat svangerskapsoppfølging hos oss som supplement eller alternativ til oppfølging hos fastlege/jordmor." },
    ],
  },
  "graviditet/fosterdiagnostikk": {
    title: "Fosterdiagnostikk",
    subtitle: "Avansert diagnostikk for trygt svangerskap.",
    parentCategory: "Graviditet",
    heroImage: heroPregnancy,
    description: "Fosterdiagnostikk omfatter ulike undersøkelser for å vurdere fosterets helse og utvikling. Vi tilbyr et bredt spekter av diagnostiske metoder, fra ultralydundersøkelser og blodprøver til mer avanserte tester.\n\nVåre fostermedisinere har lang erfaring og spisskompetanse innen prenatal diagnostikk og kan gi deg trygg veiledning basert på dine resultater.",
    benefits: [
      "Erfarne fostermedisinere med spisskompetanse",
      "KUB-test (kombinert ultralyd og blodprøve)",
      "NIPT for høy-presisjons screening",
      "Detaljert ultralyd med moderne utstyr",
      "Grundig veiledning og rådgivning",
    ],
    faqs: [
      { question: "Hva er KUB-test?", answer: "KUB (Kombinert Ultralyd og Blodprøve) er en screeningtest i uke 11-14 som vurderer risiko for kromosomavvik basert på nakketranslusensmåling og blodprøver." },
      { question: "Er fosterdiagnostikk frivillig?", answer: "Ja, all fosterdiagnostikk er frivillig. Vi gir deg grundig informasjon slik at du kan ta et informert valg." },
    ],
  },

  // ==========================================
  // FLERE FAGOMRÅDER - tillegg
  // ==========================================
  "flere-fagomrader/hudhelse": {
    title: "Hudhelse",
    subtitle: "Hudpleie, hudforyngelse og dermatologisk rådgivning.",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Dermatologi og venerologi er et medisinsk fagfelt som omhandler hud, hår, negler og slimhinner, og hvordan ulike tilstander påvirker hudhelsen. Vi utreder og behandler et bredt spekter av hudlidelser, fra vanlige tilstander som akne, eksem, rosacea, perioral dermatitt og psoriasis, til mer komplekse diagnoser som hudkreft og autoimmune tilstander i huden.\n\nI tillegg tilbys behandling av vorter, overdreven svette og solskader, samt føflekksjekk og fjerning ved behov. Vi tilbyr en grundig vurdering og behandling tilpasset din hud og dine behov, enten du søker medisinsk hjelp eller ønsker faglig rådgivning for sunnere hud.\n\nHudhelse, rådgivning og ulike former for hudbehandling tilbys kun på CMedical Bekkestua.",
    benefits: [
      "Erfarne hudleger (dermatologer) med bred kompetanse",
      "Behandling av akne, eksem, rosacea og psoriasis",
      "Føflekksjekk og hudkreftscreening",
      "Hudpleierådgivning tilpasset dine behov",
      "Tilbys på CMedical Bekkestua",
    ],
    faqs: [
      { question: "Hvor tilbys hudhelse?", answer: "Hudhelse, rådgivning og ulike former for hudbehandling tilbys kun på CMedical Bekkestua." },
      { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte uten henvisning." },
    ],
  },
  "flere-fagomrader/overvektskirurgi": {
    title: "Overvektskirurgi",
    subtitle: "Robotassistert sleeve gastrektomi for varige resultater.",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Ved CMedical tilbyr vi robotassistert overvektskirurgi med høyeste presisjon og skånsomhet – en teknologi som kombinerer avansert 3D-visualisering og mikrobevegelser styrt av erfarne kirurger. Denne metoden kan gi mindre smerter, raskere restitusjon og et bedre kosmetisk resultat.\n\nRobotassistert sleeve gastrektomi (rSG) er en moderne form for overvektskirurgi, også kalt slankeoperasjon. I denne prosedyren fjernes 60–80% av magesekken for å redusere matinntaket og fremme vektnedgang. Denne typen kirurgi er særlig egnet for deg som ønsker varige resultater med minimal belastning på kroppen.\n\nEtter ett år kan pasienter som gjennomgår sleeve gastrektomi forvente et vekttap på 20–25% av total kroppsvekt, med fortsatt vekttap frem mot to år etter operasjonen.",
    benefits: [
      "Robotassistert kirurgi for høyeste presisjon",
      "Mindre smerter og raskere restitusjon",
      "Varig vekttap på 20-25% av kroppsvekt etter ett år",
      "Gratis digital konsultasjon for vurdering",
      "Tverrfaglig oppfølging med ernæringsfysiolog",
    ],
    process: [
      { title: "Konsultasjon", description: "Gratis digital eller fysisk konsultasjon med kirurg for vurdering av egnethet." },
      { title: "Utredning", description: "Grundig medisinsk utredning inkludert blodprøver, gastroskopi og psykologisk vurdering." },
      { title: "Operasjon", description: "Robotassistert sleeve gastrektomi. Inngrepet tar ca. 1-2 timer." },
      { title: "Oppfølging", description: "Tett oppfølging med ernæringsfysiolog og kirurg det første året etter operasjonen." },
    ],
    faqs: [
      { question: "Hvem kvalifiserer for overvektskirurgi?", answer: "Generelt kreves BMI over 40, eller over 35 med tilleggssykdommer. Vi gjør en individuell vurdering." },
      { question: "Er det gratis konsultasjon?", answer: "Ja, vi tilbyr gratis digital konsultasjon for vurdering av om du er egnet for overvektskirurgi." },
      { question: "Hva er fordelene med robotassistert teknikk?", answer: "Robotassistert kirurgi gir bedre presisjon, mindre smerter, raskere restitusjon og et bedre kosmetisk resultat sammenlignet med tradisjonell teknikk." },
    ],
  },
};
