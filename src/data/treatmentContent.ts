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
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
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
      { question: "Hva koster en gynekologisk undersøkelse?", answer: "En standard gynekologisk undersøkelse koster fra kr 2 100. Se vår prisliste for fullstendig oversikt." },
      { question: "Hvor lang tid tar undersøkelsen?", answer: "En vanlig undersøkelse tar 30-45 minutter, inkludert samtale." },
      { question: "Trenger jeg henvisning?", answer: "Nei, du trenger ikke henvisning for å bestille time hos oss." },
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
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
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
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
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
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
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
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
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
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
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
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
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
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
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
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Sykemelding", answer: "I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer." },
      { question: "Utredning", answer: "Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
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
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
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
    subtitle: "Prostataundersøkelse, PSA-test og robotassistert kirurgi.",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Prostataproblemer er svært vanlige hos menn over 50 år. Vi tilbyr rask og grundig utredning av alle prostatatilstander, fra godartet forstørrelse til prostatakreft.\n\nCMedical er den eneste private klinikken i Norge som tilbyr robotassistert prostatakirurgi (RALP), med resultater på linje med de beste sykehusene.",
    benefits: [
      "Rask prostataundersøkelse med PSA og ultralyd",
      "MR-fusjonsbiopsier for presise prøver",
      "Robotassistert prostatakirurgi (RALP)",
      "Robotassistert behandling av godartet forstørrelse (RASP)",
      "Erfarne urologer med høyt operasjonsvolum",
    ],
    process: [
      { title: "Konsultasjon", description: "Grundig samtale, PSA-blodprøve og rektal undersøkelse." },
      { title: "Utredning", description: "MR av prostata og eventuelt biopsier for å avklare diagnosen." },
      { title: "Behandlingsplan", description: "Individuell plan basert på funn og dine preferanser." },
      { title: "Behandling", description: "Medisinsk eller kirurgisk behandling, inkludert robotkirurgi." },
    ],
    faqs: [
      { question: "Når bør jeg sjekke prostata?", answer: "Menn over 50 år, eller 45 år ved familiær disposisjon, bør vurdere regelmessig PSA-kontroll." },
      { question: "Hva er robotkirurgi for prostata?", answer: "RALP er en minimal invasiv operasjon med robot som gir bedre presisjon, mindre blødning og raskere rekonvalesens." },
    ],
  },
  "urologi/refertilisering": {
    title: "Refertilisering",
    subtitle: "Reversering av sterilisering for menn.",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Refertilisering er en mikrokirurgisk operasjon for å reversere en tidligere sterilisering. Inngrepet utføres med operasjonsmikroskop for best mulig resultat.",
    benefits: [
      "Erfaren mikrokirurg med høy suksessrate",
      "Operasjonsmikroskop for presist inngrep",
      "Dagkirurgi – reise hjem samme dag",
    ],
    faqs: [
      { question: "Hvor stor er sjansen for suksess?", answer: "Suksessraten avhenger av hvor lang tid det har gått siden steriliseringen. Generelt er den 50-80%." },
    ],
  },
  "urologi/robotkirurgi": {
    title: "Robotkirurgi – Urologi",
    subtitle: "Avansert robotassistert kirurgi for prostata, nyrer og brokk.",
    parentCategory: "Urologi",
    heroImage: heroTech,
    description: "CMedical er den eneste private aktøren i Norge som tilbyr robotassistert kirurgi innen urologi. Med da Vinci-systemet utfører vi blant annet radikal prostatektomi (RALP), behandling av godartet forstørret prostata (RASP) og brokkoperasjoner.\n\nRobotkirurgi gir bedre syn, presisjon og bevegelighet enn tradisjonell kikkhullskirurgi.",
    benefits: [
      "Prostatakreftkirurgi (RALP) med nerve-sparende teknikk",
      "Behandling av godartet forstørret prostata (RASP)",
      "Robotassistert brokkoperasjon",
      "Kortere sykehusopphold og raskere rekonvalesens",
      "Erfarne kirurger med høyt volum",
    ],
    faqs: [
      { question: "Hva er fordelene med robotkirurgi?", answer: "Bedre presisjon, mindre blødning, kortere rekonvalesens og ofte bedre funksjonelle resultater sammenlignet med åpen kirurgi." },
    ],
  },
  "urologi/sterilisering": {
    title: "Sterilisering",
    subtitle: "Vasektomi – trygg og enkel sterilisering for menn.",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Vasektomi er en rask og enkel prosedyre for permanent prevensjon. Inngrepet utføres poliklinisk og tar ca. 30 minutter.",
    benefits: [
      "Rask prosedyre – ca. 30 minutter",
      "Lokalbedøvelse – ingen narkose nødvendig",
      "Kort rekonvalesens – tilbake i jobb etter 1-2 dager",
      "Svært høy sikkerhet som prevensjon",
    ],
    faqs: [
      { question: "Er vasektomi reversibelt?", answer: "Vasektomi skal betraktes som permanent, men refertilisering er mulig med ca. 50-80% suksessrate." },
      { question: "Hva koster vasektomi?", answer: "Sterilisering koster kr 6 500 og inkluderer konsultasjon, inngrep og kontroll." },
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
    subtitle: "IUI, IVF og ICSI – skreddersydd hjelp til å bli gravid.",
    parentCategory: "Fertilitet",
    heroImage: fertilitetImg,
    description: "Assistert befruktning omfatter ulike metoder for å hjelpe par og enslige med å oppnå graviditet. Vi tilbyr inseminasjon (IUI), prøverørsbehandling (IVF) og mikroinjeksjon (ICSI).\n\nValg av metode avhenger av utredningsfunn og individuelle forutsetninger.",
    benefits: [
      "Alle metoder for assistert befruktning under ett tak",
      "Moderne laboratorium med erfarne embryologer",
      "Høye suksessrater dokumentert over tid",
      "Personlig oppfølging gjennom hele behandlingen",
    ],
    faqs: [
      { question: "Hva er forskjellen på IUI og IVF?", answer: "Ved IUI settes sædceller inn i livmoren. Ved IVF hentes egg ut, befruktes i laboratoriet og settes tilbake som embryo." },
      { question: "Hvor mange behandlinger trenger vi?", answer: "Dette varierer. Mange lykkes innen 3 behandlingssykluser, men det avhenger av individuelle faktorer." },
    ],
  },
  "fertilitet/ivf": {
    title: "IVF",
    subtitle: "Prøverørsbehandling med Nordens mest erfarne team.",
    parentCategory: "Fertilitet",
    heroImage: fertilitetImg,
    description: "IVF (in vitro fertilisering) er den mest effektive formen for fertilitetsbehandling. Hos CMedical har vi utført tusenvis av IVF-sykluser med høye suksessrater.\n\nVi bruker det nyeste utstyret og de mest moderne protokollene for å gi deg den beste sjansen for å lykkes.",
    benefits: [
      "Dokumentert høye suksessrater",
      "Moderne laboratorium og utstyr",
      "Individuelt tilpassede behandlingsprotokoller",
      "Erfarne reproduksjonsmedisinere og embryologer",
      "Tett oppfølging gjennom hele syklusen",
    ],
    process: [
      { title: "Det første møtet", description: "Gjennomgang av utredningen og planlegging av behandling." },
      { title: "Hormonstimulering", description: "Sprøyter for å stimulere eggmodning, vanligvis 10-14 dager." },
      { title: "Egguthenting", description: "Eggene hentes ut under lett sedasjon. Prosedyren tar ca. 15-20 minutter." },
      { title: "Befruktning og dyrking", description: "Eggene befruktes i laboratoriet og embryoene dyrkes i 3-5 dager." },
      { title: "Embryooverføring", description: "Det beste embryoet settes tilbake i livmoren. En enkel og smertefri prosedyre." },
    ],
    faqs: [
      { question: "Hvor stor er sjansen for å lykkes?", answer: "Suksessraten avhenger av alder og årsak til infertiliteten. Gjennomsnittlig oppnår ca. 40-50% graviditet per syklus for kvinner under 35 år." },
      { question: "Er IVF smertefullt?", answer: "Hormonstimuleringen innebærer daglige sprøyter. Egguthentingen gjøres under sedasjon og oppleves som regel uproblematisk." },
    ],
  },
  "fertilitet/eggfrys": {
    title: "Eggfrys",
    subtitle: "Frys ned eggene dine for fremtiden.",
    parentCategory: "Fertilitet",
    heroImage: fertilitetImg,
    description: "Eggfrysing gir deg muligheten til å bevare fertiliteten for fremtiden. Prosessen ligner IVF-behandling og innebærer hormonstimulering, egguthenting og kryopreservering av eggene.\n\nJo yngre du er når eggene fryses, desto bedre kvalitet har de. Vi anbefaler eggfrysing før 35 år for best resultat.",
    benefits: [
      "Bevarer fertiliteten for fremtiden",
      "Moderne vitrifikasjonsteknologi for høy overlevelsesrate",
      "Trygg lagring i vårt kryolager",
      "Fleksibilitet til å planlegge familieutvidelse",
    ],
    faqs: [
      { question: "Hvor lenge kan egg lagres?", answer: "Egg kan lagres frosne i mange år uten vesentlig tap av kvalitet." },
      { question: "Hva koster eggfrysing?", answer: "Ta kontakt med oss for en uforpliktende pris-samtale. Prisen inkluderer stimulering, uthenting og lagring." },
    ],
  },
  "fertilitet/donorbehandling": {
    title: "Donorbehandling",
    subtitle: "Behandling med donorsæd eller donoregg.",
    parentCategory: "Fertilitet",
    heroImage: fertilitetImg,
    description: "Donorbehandling kan være aktuelt for enslige kvinner, par med mannlig infertilitet, eller par der egne egg ikke kan brukes. Vi tilbyr behandling med donorsæd og samarbeider med anerkjente eggdonorklinikker.\n\nAlle donorer er grundig screenet og godkjent i henhold til norsk lovverk.",
    benefits: [
      "Donorsæd fra godkjente sædbanker",
      "Samarbeid med anerkjente eggdonorklinikker",
      "Grundig veiledning gjennom hele prosessen",
      "Støtte og rådgivning om de etiske aspektene",
    ],
    faqs: [
      { question: "Hvem kan motta donorsæd?", answer: "Enslige kvinner og par der mannen har alvorlig nedsatt sædkvalitet kan motta donorsæd." },
      { question: "Er donoren anonym?", answer: "I Norge er sæddonorer identitetsåpne. Barnet kan få vite donors identitet ved fylte 15 år." },
    ],
  },
  "fertilitet/hysteroskopi": {
    title: "Hysteroskopi – Fertilitet",
    subtitle: "Undersøkelse av livmorhulen som del av fertilitetsutredning.",
    parentCategory: "Fertilitet",
    heroImage: fertilitetImg,
    description: "Hysteroskopi brukes i fertilitetssammenheng for å undersøke livmorhulen for polypper, septa, muskelknuter eller andre tilstander som kan påvirke implantasjon og graviditet.\n\nProsedyren kan være diagnostisk eller terapeutisk, og utføres vanligvis uten narkose.",
    benefits: [
      "Viktig del av fertilitetsutredningen",
      "Kan avdekke og behandle årsaker til implantasjonssvikt",
      "Office-hysteroskopi uten narkose",
      "Rask prosedyre med umiddelbare resultater",
    ],
    faqs: [
      { question: "Hvorfor gjøres hysteroskopi ved infertilitet?", answer: "For å sikre at livmorhulen er normal og klar for embryooverføring. Polypper og andre funn kan fjernes i samme prosedyre." },
    ],
  },
  "fertilitet/saedanalyse": {
    title: "Sædanalyse",
    subtitle: "Grundig analyse av sædkvalitet etter WHO-standard.",
    parentCategory: "Fertilitet",
    heroImage: fertilitetImg,
    description: "Sædanalyse er en sentral del av fertilitetsutredningen. Vi analyserer antall sædceller, bevegelighet og form etter WHO-standard.\n\nAnalysen gir viktig informasjon om mannens fruktbarhetspotensiale og er grunnlaget for valg av behandlingsmetode.",
    benefits: [
      "WHO-standardisert analysemetode",
      "Resultat innen kort tid",
      "Veiledning om videre steg basert på resultatet",
      "Kan kombineres med urologisk konsultasjon",
    ],
    faqs: [
      { question: "Hvordan forbereder jeg meg?", answer: "Du bør ha 2-7 dagers avholdenhet før prøvetaking. Vi gir deg detaljert informasjon ved booking." },
      { question: "Hva koster en sædanalyse?", answer: "En enkel sædanalyse koster kr 1 950." },
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
    subtitle: "Utredning og behandling av skader og plager i fot og ankel.",
    parentCategory: "Ortopedi",
    heroImage: ortopediImg,
    description: "Vi tilbyr spesialisert utredning og behandling av alle tilstander som rammer fot og ankel, fra idrettsskader til degenerative forandringer.\n\nVåre ortopeder har bred erfaring med både konservativ og kirurgisk behandling.",
    benefits: [
      "Spesialiserte fot- og ankelortopeder",
      "MR og røntgen tilgjengelig på klinikken",
      "Konservativ og kirurgisk behandling",
      "Rehabilitering med fysioterapeut",
    ],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte hos oss." },
      { question: "Hva koster en konsultasjon?", answer: "Konsultasjon hos ortoped koster kr 1 800." },
    ],
  },
  "ortopedi/hofte": {
    title: "Hofte",
    subtitle: "Diagnostikk og behandling av hofteplager.",
    parentCategory: "Ortopedi",
    heroImage: ortopediImg,
    description: "Hofteplager kan skyldes slitasje, idrettsskader, bekkenplager eller andre tilstander. Vi tilbyr grundig utredning og individuelt tilpasset behandling.\n\nVåre ortopeder har lang erfaring med hofteleddsundersøkelser og kan tilby de nyeste behandlingsmetodene.",
    benefits: [
      "Grundig utredning med bildediagnostikk",
      "Injeksjonsbehandling ved behov",
      "Operativ behandling ved indikasjon",
      "Oppfølging og rehabilitering",
    ],
    faqs: [
      { question: "Hva kan forårsake hoftesmerter?", answer: "Vanlige årsaker inkluderer artrose, hofteimpingement, bursitt og muskel-/seneproblemer." },
    ],
  },
  "ortopedi/hand-albue": {
    title: "Hånd og albue",
    subtitle: "Spesialisert behandling av hånd- og albueplager.",
    parentCategory: "Ortopedi",
    heroImage: ortopediImg,
    description: "Vi tilbyr utredning og behandling av alle tilstander som rammer hånd og albue, inkludert karpaltunnelsyndrom, triggerfinger, tennisalbue og andre plager.\n\nVårt team inkluderer også håndterapeuter som kan hjelpe med rehabilitering.",
    benefits: [
      "Erfarne håndkirurger",
      "Håndterapeut for rehabilitering",
      "Dagkirurgiske inngrep",
      "Rask utredning og behandling",
    ],
    faqs: [
      { question: "Hva er karpaltunnelsyndrom?", answer: "En tilstand der en nerve i håndleddet blir klemt, noe som gir nummenhet, prikking og smerter i hånden." },
    ],
  },
  "ortopedi/kne": {
    title: "Kne",
    subtitle: "Utredning og behandling av kneplager og kneskader.",
    parentCategory: "Ortopedi",
    heroImage: ortopediImg,
    description: "Kneplager er svært vanlige, fra idrettsskader til slitasjegikt. Vi tilbyr komplett utredning med bildediagnostikk og erfarne ortopeder som kan gi deg riktig diagnose og behandling.\n\nVi behandler alt fra meniskskader og korsbåndskader til artrose og betennelsestilstander.",
    benefits: [
      "Spesialiserte kneortopeder",
      "MR og røntgen på klinikken",
      "Artroscopisk kirurgi (kikkhullskirurgi)",
      "Injeksjonsbehandling",
      "Rehabilitering med fysioterapeut",
    ],
    faqs: [
      { question: "Trenger jeg MR av kneet?", answer: "Din ortoped vurderer om MR er nødvendig basert på undersøkelsen. Vi har MR tilgjengelig på klinikken." },
    ],
  },
  "ortopedi/skulder": {
    title: "Skulder",
    subtitle: "Diagnostikk og behandling av skulderplager.",
    parentCategory: "Ortopedi",
    heroImage: ortopediImg,
    description: "Skulderplager kan skyldes slitasje, betennelse, skader eller muskulære ubalanser. Vi tilbyr grundig utredning og et bredt spekter av behandlingsmuligheter.\n\nVåre skulderortopeder har lang erfaring med både konservativ og kirurgisk behandling.",
    benefits: [
      "Erfarne skulderortopeder",
      "Ultralydveiledet injeksjonsbehandling",
      "Artroscopisk skulderkirurgi",
      "Individuelt tilpasset rehabilitering",
    ],
    faqs: [
      { question: "Hva kan forårsake skuldersmerter?", answer: "Vanlige årsaker inkluderer impingement, rotator cuff-skader, frossen skulder og artrose." },
    ],
  },

  // ==========================================
  // FLERE FAGOMRÅDER
  // ==========================================
  "flere-fagomrader/endokrinologi": {
    title: "Endokrinologi",
    subtitle: "Utredning av stoffskifte, diabetes og hormonsykdommer.",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Endokrinologi omhandler hormonsystemet og stoffskiftesykdommer. Vi tilbyr grundig utredning og behandling av tilstander som skjoldbruskkjertelsykdommer, diabetes, binyresykdommer og andre hormonelle tilstander.\n\nVåre endokrinologer har lang erfaring og holder seg oppdatert på den nyeste forskningen.",
    benefits: [
      "Erfarne endokrinologer med spisskompetanse",
      "Grundig hormonutredning med blodprøver",
      "Individuelt tilpasset behandling og oppfølging",
      "Tverrfaglig samarbeid med ernæringsfysiolog",
    ],
    faqs: [
      { question: "Hva behandler en endokrinolog?", answer: "Endokrinologer behandler sykdommer i hormonsystemet, inkludert stoffskifteproblemer, diabetes, binyresykdommer og mer." },
      { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte hos oss." },
    ],
  },
  "flere-fagomrader/hudlege": {
    title: "Hudlege",
    subtitle: "Dermatologi – utredning og behandling av hudsykdommer.",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Våre hudleger tilbyr utredning og behandling av alle typer hudsykdommer, fra akne og eksem til føflekksjekk og hudkreftscreening.\n\nVi bruker moderne diagnostiske verktøy som dermatoskopi for presise vurderinger.",
    benefits: [
      "Erfarne hudleger med bred kompetanse",
      "Dermatoskopisk undersøkelse av føflekker",
      "Behandling av akne, eksem, rosacea og psoriasis",
      "Hudkreftscreening",
    ],
    faqs: [
      { question: "Når bør jeg sjekke føflekkene mine?", answer: "Du bør sjekke føflekker regelmessig, spesielt hvis du har mange føflekker, lys hud eller familiær hudkreft." },
    ],
  },
  "flere-fagomrader/ernaringsfysiolog": {
    title: "Ernæringsfysiolog",
    subtitle: "Profesjonell kostholdsrådgivning tilpasset dine behov.",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Våre ernæringsfysiologer hjelper deg med å optimalisere kostholdet for bedre helse, enten det handler om vektkontroll, matintoleranse, sportsernæring eller kosthold under svangerskap og fertilitetsbehandling.",
    benefits: [
      "Individuelt tilpasset kostholdsplan",
      "Spesialkompetanse på ernæring ved fertilitet og svangerskap",
      "Hjelp med matintoleranse og allergier",
      "Oppfølging og justering over tid",
    ],
    faqs: [
      { question: "Hva kan en ernæringsfysiolog hjelpe med?", answer: "Alt fra generell kostholdsrådgivning til spesifikke utfordringer som IBS, allergi, vektnedgang og sportsernæring." },
    ],
  },
  "flere-fagomrader/gastrokirurgi": {
    title: "Gastrokirurgi",
    subtitle: "Fedmekirurgi, gallestein og brokkoperasjoner.",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Vi tilbyr et bredt spekter av gastrokirurgiske inngrep, inkludert bariatrisk kirurgi (fedmekirurgi), gallesteinsoperasjoner og brokkoperasjoner. Mange av våre inngrep utføres med robotassistert teknikk.\n\nVåre gastrokirurger har lang erfaring og høyt operasjonsvolum.",
    benefits: [
      "Robotassistert bariatrisk kirurgi (sleeve gastrektomi)",
      "Kikkhullsoperasjoner for gallestein",
      "Robotassisterte brokkoperasjoner",
      "Digital konsultasjon for fedmevurdering (gratis)",
      "Tverrfaglig oppfølging med ernæringsfysiolog",
    ],
    faqs: [
      { question: "Hvem kvalifiserer for fedmekirurgi?", answer: "Generelt kreves BMI over 40, eller over 35 med tilleggssykdommer. Vi gjør en individuell vurdering." },
      { question: "Er det gratis konsultasjon?", answer: "Ja, vi tilbyr gratis digital konsultasjon for fedmevurdering." },
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
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
    ],
  },
  "flere-fagomrader/plastikkirurgi": {
    title: "Plastikkirurgi",
    subtitle: "Rekonstruktiv og estetisk plastikkirurgi.",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Våre plastikkirurger tilbyr både rekonstruktive og estetiske inngrep. Vi legger vekt på naturlige resultater og grundig informasjon før alle inngrep.",
    benefits: [
      "Erfarne plastikkirurger",
      "Grundig konsultasjon og forventningsavklaring",
      "Moderne teknikker for naturlige resultater",
      "Oppfølging etter inngrep",
    ],
    faqs: [
      { question: "Hva inkluderer en konsultasjon?", answer: "En grundig gjennomgang av dine ønsker, helsetilstand, informasjon om inngrepet og forventninger til resultatet." },
    ],
  },
  "flere-fagomrader/psykologi": {
    title: "Psykologi",
    subtitle: "Kort ventetid • Ingen henvisning",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Du trenger ikke å ha en psykisk lidelse eller diagnose for å gå til psykolog. Mange ønsker å ha en nøytral samtalepartner over kortere eller lengre tid for å sortere tanker og følelser, eller motta støtte gjennom en utfordrende periode med f.eks. endometriose-, vulvodyni- eller fertilitetsbehandling. Hos oss jobber våre spesialister i unike tverrfaglige team for å hjelpe deg best mulig. Ta kontakt for mer informasjon eller bestill en konsultasjon.",
    sections: [
      {
        id: "hva-kan-vi-hjelpe-med",
        heading: "Hva kan vi hjelpe med?",
        content: "Hos psykolog kan du få hjelp til å håndtere smerter, bearbeide vanskelige erfaringer, utforske identitet og seksualitet, og du kan bli utredet og behandlet for psykiske lidelser. Om det dukker opp andre plager som trenger videre oppfølging, kan en psykolog henvise deg til videre utredning og behandling. Ønsker du en time til psykolog kan du bestille her eller ta kontakt med oss for mer informasjon.",
      },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
    ],
  },
  "flere-fagomrader/revmatologi": {
    title: "Revmatologi",
    subtitle: "Utredning og behandling av revmatiske sykdommer.",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Revmatologi omfatter utredning og behandling av ledd- og bindevevssykdommer som revmatoid artritt, lupus, psoriasisartritt og andre autoimmune tilstander.\n\nVåre revmatologer tilbyr grundig utredning og moderne behandling.",
    benefits: [
      "Erfarne revmatologer med spesialkompetanse",
      "Grundig utredning med blodprøver og bildediagnostikk",
      "Moderne biologisk behandling",
      "Tett oppfølging og justering av behandling",
    ],
    faqs: [
      { question: "Hva er symptomene på revmatisk sykdom?", answer: "Vanlige symptomer er leddsmerter, stivhet, hevelse og generell tretthet." },
      { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte." },
    ],
  },
  "flere-fagomrader/robotkirurgi": {
    title: "Robotkirurgi",
    subtitle: "Avansert robotassistert kirurgi på tvers av fagområder.",
    parentCategory: "Flere fagområder",
    heroImage: heroTech,
    description: "CMedical er den eneste private aktøren i Norge som tilbyr robotassistert kirurgi. Vi bruker da Vinci-systemet på tvers av flere fagområder – gynekologi, urologi og gastrokirurgi.\n\nRobotkirurgi representerer fremtiden innen kirurgi og gir bedre presisjon, mindre smerter og raskere rekonvalesens.",
    benefits: [
      "Eneste private aktør med robotkirurgi i Norge",
      "da Vinci-systemet for maksimal presisjon",
      "Brukes innen gynekologi, urologi og gastrokirurgi",
      "Kortere sykehusopphold og raskere tilbake til hverdagen",
      "Erfarne kirurger med høyt volum",
    ],
    faqs: [
      { question: "Hvilke inngrep utføres med robot?", answer: "Muskelknuter, dyp endometriose, hysterektomi, brokk, prostatakreft (RALP), godartet forstørret prostata (RASP) og fedmekirurgi." },
      { question: "Er robotkirurgi trygt?", answer: "Ja, robotkirurgi er vel dokumentert og gir ofte bedre resultater enn tradisjonelle metoder." },
    ],
  },
  "flere-fagomrader/sexologi": {
    title: "Sexologi",
    subtitle: "Kort ventetid • Ingen henvisning",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Når man rammes av sykdom eller helseutfordringer, enten fysiske eller psykiske, kan det også oppstå utfordringer knyttet til seksuell helse. Dette kan dreie seg om seksuell funksjon, lyst, tenning, selvbilde, kroppsbilde, seksuell glede, relasjoner eller identitet. Seksualitetsrelaterte utfordringer påvirker ofte den generelle livskvaliteten.\n\nEn sexolog kan gjennom terapeutiske samtaler gi støtte, veiledning og råd til enkeltpersoner eller par som opplever vanskeligheter knyttet til seksuell trivsel og intimitet. Samtalene kan bidra til å utforske og håndtere det som oppleves som utfordrende, eller gi veiledning om seksualtekniske hjelpemidler.",
    sections: [
      {
        id: "skreddersydd-veiledning",
        heading: "Skreddersydd veiledning",
        content: "Ved diagnoser som er assosiert med smerte og fysisk ubehag, gir en sexolog tilpasset veiledning for å håndtere disse utfordringene. Dette kan inkludere strategier for smertelindring, utforsking av alternative former for seksuell nytelse og styrking av kommunikasjonen om man er i et parforhold.\n\nFor par som opplever ufrivillig barnløshet, kan en sexologisk rådgiver hjelpe dem med å navigere gjennom det som er følelsesmessig utfordrende slik at intimiteten opprettholdes og stress reduseres. Dersom seksualfunksjon rammes i forbindelse med sykdom slik at lyst, tenning og orgasme rammes kan man få råd om hvordan man kan finne nye måter å opprettholde et tilfredsstillende seksualliv på.",
      },
    ],
    faqs: [
      { question: "Henvisning", answer: "Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige." },
      { question: "Ventetid", answer: "Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke." },
      { question: "Selskapet", answer: "CMedical ble etablert i 2013 og er et nordisk privathelsetilbud med klinikker i Norge og Sverige. Vi gjennomfører omtrent 50.000 konsultasjoner i året." },
    ],
  },
  "flere-fagomrader/areknuter": {
    title: "Åreknutebehandling",
    subtitle: "Moderne behandling av åreknuter og sprengte blodkar.",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Åreknuter er utvidede, synlige blodårer som kan gi smerter, hevelse og tyngdefølelse. Vi tilbyr moderne behandlingsmetoder som er skånsomme og effektive.\n\nUtredning starter med ultralydundersøkelse for å kartlegge omfanget og planlegge riktig behandling.",
    benefits: [
      "Grundig ultralydundersøkelse først",
      "Moderne, skånsomme behandlingsmetoder",
      "Kort rekonvalesens",
      "Erfarne karkirurger",
    ],
    faqs: [
      { question: "Hva forårsaker åreknuter?", answer: "Åreknuter skyldes svekkede klaffer i venene, ofte forårsaket av arvelig disposisjon, svangerskap, overvekt eller langvarig ståing." },
      { question: "Hva koster utredning?", answer: "Vurdering hos spesialist koster kr 1 800 og inkluderer ultralydundersøkelse." },
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
