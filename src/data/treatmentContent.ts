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
    subtitle: "Utredning og behandling av fremfall i underlivet.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Vaginale fremfall oppstår når vev og organer i bekkenet synker ned og trykker mot eller ut av skjeden. Tilstanden er vanlig, spesielt etter fødsler, og kan gi ubehag, tyngdefølelse og urinlekkasje.\n\nVi tilbyr både konservative og kirurgiske behandlingsalternativer tilpasset din grad av fremfall og dine behov.",
    benefits: [
      "Erfarne gynekologer med spesialkompetanse på bekkenbunnslidelser",
      "Moderne kirurgiske teknikker med gode resultater",
      "Individuelt tilpasset behandlingsplan",
      "Bekkenbunnstrening som supplement eller alternativ til kirurgi",
    ],
    faqs: [
      { question: "Kan fremfall behandles uten kirurgi?", answer: "Ja, milde tilfeller kan ofte behandles med bekkenbunnstrening og pessar." },
      { question: "Hva innebærer en fremfallsoperasjon?", answer: "Operasjonen reparerer det svekkede vevet og løfter organene tilbake på plass. Vi bruker moderne teknikker med kort rekonvalesens." },
    ],
  },
  "gynekologi/blodningsforstyrrelser": {
    title: "Blødningsforstyrrelser",
    subtitle: "Utredning og behandling av uregelmessige eller kraftige menstruasjonsblødninger.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Blødningsforstyrrelser kan ha mange årsaker – fra hormonelle ubalanser og polypper til muskelknuter og andre tilstander. Uansett årsak kan kraftige eller uregelmessige blødninger påvirke livskvaliteten betydelig.\n\nVåre gynekologer utreder grundig for å finne årsaken og tilbyr effektiv behandling.",
    benefits: [
      "Grundig utredning med ultralyd og eventuelt hysteroskopi",
      "Medisinsk og kirurgisk behandling",
      "Robotassistert fjerning av muskelknuter",
      "Kort ventetid til konsultasjon",
    ],
    faqs: [
      { question: "Hva kan forårsake kraftige blødninger?", answer: "Vanlige årsaker inkluderer muskelknuter, polypper, hormonforstyrrelser og endometriose." },
      { question: "Når bør jeg oppsøke lege?", answer: "Dersom blødningene påvirker hverdagen din, du blør mellom menstruasjonene, eller blødningene har endret seg." },
    ],
  },
  "gynekologi/celleforandringer": {
    title: "Celleforandringer",
    subtitle: "Oppfølging av HPV og celleforandringer, inkludert konisering.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Celleforandringer på livmorhalsen oppdages vanligvis gjennom celleprøve og er som regel forårsaket av HPV-virus. De fleste celleforandringer går tilbake av seg selv, men noen krever behandling.\n\nVi tilbyr grundig utredning, oppfølging og behandling ved behov, inkludert konisering.",
    benefits: [
      "Erfaren oppfølging av HPV og celleforandringer",
      "Kolposkopi for detaljert undersøkelse",
      "Konisering utført av erfarne spesialister",
      "Tett oppfølgingsprogram etter behandling",
    ],
    faqs: [
      { question: "Hva er HPV?", answer: "HPV (humant papillomavirus) er svært vanlig og de fleste kvinner vil bli smittet i løpet av livet. De fleste blir kvitt viruset av seg selv." },
      { question: "Hva er konisering?", answer: "Konisering er et lite inngrep der man fjerner et kjegleformet stykke vev fra livmorhalsen. Inngrepet gjøres i narkose og tar ca. 20 minutter." },
    ],
  },
  "gynekologi/cyster": {
    title: "Cyster på eggstokkene",
    subtitle: "Utredning og behandling av cyster på eggstokkene.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Cyster på eggstokkene er svært vanlig og oppdages ofte tilfeldig ved ultralyd. De fleste cyster er godartede og forsvinner av seg selv, men noen kan trenge oppfølging eller behandling.\n\nVåre gynekologer har lang erfaring med å vurdere og behandle alle typer cyster.",
    benefits: [
      "Grundig utredning med ultralyd",
      "Tett oppfølging av cyster som krever observasjon",
      "Skånsom kirurgisk fjerning ved behov",
      "Rask avklaring gir trygghet",
    ],
    faqs: [
      { question: "Er cyster farlige?", answer: "De aller fleste cyster er godartede. Vi utreder grundig for å avklare type og behov for eventuell behandling." },
      { question: "Må cyster alltid opereres?", answer: "Nei, mange cyster forsvinner av seg selv og trenger kun oppfølging med ultralydkontroller." },
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
    subtitle: "Svangerskapskontroll, ultralyd og NIPT-test.",
    parentCategory: "Gynekologi",
    heroImage: heroPregnancy,
    description: "Vi tilbyr omfattende oppfølging gjennom svangerskapet, fra tidlig ultralyd til organrettet ultralyd og NIPT-testing. Vårt team av fostermedisinere og jordmødre gir deg trygg og profesjonell oppfølging.\n\nVåre ultralydundersøkelser utføres med det nyeste utstyret for best mulig bildekvalitet og diagnostikk.",
    benefits: [
      "Tidlig ultralyd fra uke 7",
      "NIPT-test for kromosomanalyse",
      "Organrettet ultralyd ved uke 18-20",
      "Erfarne fostermedisinere og jordmødre",
      "Fleksible timer tilpasset din hverdag",
    ],
    process: [
      { title: "Tidlig ultralyd", description: "Bekreftelse av svangerskap, datering og vurdering av fosterets utvikling fra uke 7." },
      { title: "NIPT-test (valgfritt)", description: "Blodprøve som analyserer fosterets DNA for å se etter kromosomavvik. Kan tas fra uke 10." },
      { title: "Organrettet ultralyd", description: "Grundig gjennomgang av fosterets organer og utvikling ved uke 18-20." },
      { title: "Svangerskapskontroller", description: "Regelmessige kontroller gjennom svangerskapet med blodprøver, ultralyd og samtale." },
    ],
    faqs: [
      { question: "Når kan jeg ta tidlig ultralyd?", answer: "Tidlig ultralyd kan utføres fra uke 7. Da kan vi se fosterets hjerteaktivitet og beregne termin." },
      { question: "Hva er NIPT?", answer: "NIPT er en blodprøve som analyserer fragmenter av fosterets DNA i morens blod for å påvise eventuelle kromosomavvik." },
      { question: "Trenger jeg henvisning?", answer: "Nei, du kan bestille time direkte uten henvisning." },
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
    subtitle: "Utredning og behandling av PCOS og andre hormonelle tilstander.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Hormonforstyrrelser som PCOS (polycystisk ovariesyndrom) kan gi symptomer som uregelmessige menstruasjoner, akne, økt hårvekst og vanskeligheter med å bli gravid.\n\nVåre gynekologer og endokrinologer samarbeider for å gi deg den beste utredningen og behandlingen.",
    benefits: [
      "Grundig hormonutredning med blodprøver",
      "Individuelt tilpasset behandling",
      "Tverrfaglig tilnærming med ernæringsfysiolog",
      "Fertilitetsrådgivning ved barneønske",
    ],
    faqs: [
      { question: "Hva er PCOS?", answer: "PCOS er en hormonforstyrrelse som rammer ca. 10% av kvinner i fruktbar alder. Tilstanden kan gi uregelmessige menstruasjoner, akne og infertilitet." },
      { question: "Kan PCOS behandles?", answer: "Ja, symptomene kan behandles effektivt med livsstilsendringer, medisiner og fertilitetsbehandling ved barneønske." },
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
    subtitle: "Kirurgisk korreksjon av indre kjønnslepper.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Labiaplastikk er et inngrep for å redusere størrelsen på de indre kjønnsleppene. Mange oppsøker behandling på grunn av fysisk ubehag ved trening, sykkeltur eller i trange klær.\n\nInngrepet utføres av erfarne gynekologiske kirurger og gir et naturlig resultat med kort rekonvalesens.",
    benefits: [
      "Erfarne kirurger med fokus på naturlig resultat",
      "Dagkirurgisk inngrep – reise hjem samme dag",
      "Kort rekonvalesenstid",
      "Diskret og profesjonell behandling",
    ],
    faqs: [
      { question: "Er labiaplastikk smertefullt?", answer: "Inngrepet utføres i narkose eller lokalbedøvelse. Etter inngrepet kan du oppleve noe hevelse og ubehag i 1-2 uker." },
      { question: "Hvor lang er rekonvalesensen?", answer: "Du kan vanligvis være tilbake i jobb etter noen dager. Full rekonvalesens tar 4-6 uker." },
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
    subtitle: "Medisinsk oppfølging og støtte ved spontanabort.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "En spontanabort er en smertefull opplevelse, både fysisk og emosjonelt. Hos CMedical får du rask og omsorgsfull oppfølging med ultralyd, medisinsk behandling og psykologisk støtte ved behov.\n\nVi hjelper deg gjennom situasjonen med faglig trygghet og personlig omsorg.",
    benefits: [
      "Rask time for ultralydkontroll",
      "Medisinsk eller kirurgisk behandling ved behov",
      "Tilgang til psykolog og samtaleterapi",
      "Veiledning om veien videre og eventuelle nye graviditeter",
    ],
    faqs: [
      { question: "Når bør jeg kontakte dere?", answer: "Ta kontakt umiddelbart ved blødning og smerter i tidlig svangerskap. Vi tilbyr rask time for avklaring." },
      { question: "Kan jeg prøve å bli gravid igjen?", answer: "I de fleste tilfeller kan du prøve igjen etter neste menstruasjon. Din lege vil gi individuell rådgivning." },
    ],
  },
  "gynekologi/vulvalidelser": {
    title: "Vulvalidelser",
    subtitle: "Utredning og behandling av plager i vulvaområdet.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Vulvalidelser omfatter en rekke tilstander som kan gi kløe, sviing, smerter og ubehag. Plagene kan skyldes infeksjoner, hudsykdommer, hormonforstyrrelser eller andre årsaker.\n\nVåre gynekologer har spesialkompetanse på vulvalidelser og tilbyr grundig utredning og individuelt tilpasset behandling.",
    benefits: [
      "Spesialistkompetanse på vulvalidelser",
      "Grundig utredning for å finne årsaken",
      "Individuelt tilpasset behandlingsplan",
      "Samarbeid med hudlege ved behov",
    ],
    faqs: [
      { question: "Hva er vanlige vulvalidelser?", answer: "Vanlige tilstander inkluderer vulvitt, lichen sclerosus, kontakteksem og kroniske smertetilstander." },
      { question: "Kan vulvalidelser behandles?", answer: "Ja, de fleste vulvalidelser kan behandles effektivt med riktig diagnose og behandling." },
    ],
  },

  // ==========================================
  // UROLOGI
  // ==========================================
  "urologi/blaere": {
    title: "Blære og urinveier",
    subtitle: "Utredning og behandling av blod i urinen, vannlatingsproblemer og mer.",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Problemer med blæren og urinveiene er vanlige og kan ramme både kvinner og menn. Vi tilbyr grundig utredning og moderne behandling av alle tilstander som rammer blære og urinveier.\n\nVåre urologer har lang erfaring med diagnostikk og behandling, inkludert cystoskopi, TUR-P og TUR-B.",
    benefits: [
      "Rask utredning av blod i urinen",
      "Cystoskopi for direkte undersøkelse av blæren",
      "TUR-P og TUR-B for operativ behandling",
      "Behandling av innsnevring i urinrøret",
      "Kort ventetid – de fleste får time innen 1-3 dager",
    ],
    faqs: [
      { question: "Hva betyr blod i urinen?", answer: "Blod i urinen kan ha mange årsaker, fra ufarlige til alvorlige. Det bør alltid utredes hos urolog." },
      { question: "Hva er cystoskopi?", answer: "Cystoskopi er en undersøkelse der et tynt kamera føres inn i blæren gjennom urinrøret for å se etter forandringer." },
    ],
  },
  "urologi/forhud": {
    title: "Forhud",
    subtitle: "Behandling av trang forhud og andre forhudsproblemer.",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Trang forhud (fimose) er en vanlig tilstand som kan gi ubehag og problemer med hygiene. Vi tilbyr både konservativ og kirurgisk behandling avhengig av grad og plager.",
    benefits: [
      "Erfarne urologer med lang kirurgisk erfaring",
      "Dagkirurgisk inngrep med kort rekonvalesens",
      "Individuell vurdering av behandlingsalternativer",
    ],
    faqs: [
      { question: "Må trang forhud alltid opereres?", answer: "Nei, milde tilfeller kan ofte behandles med kortisonsalve. Kirurgi er aktuelt ved mer uttalte plager." },
    ],
  },
  "urologi/infertilitet": {
    title: "Mannlig infertilitet",
    subtitle: "Utredning av mannlig fruktbarhet, inkludert sædanalyse.",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Mannlige faktorer bidrar til infertilitet i omtrent halvparten av tilfellene. Vi tilbyr grundig utredning av mannlig fruktbarhet med sædanalyse, hormonprøver og urologisk undersøkelse.\n\nVårt samarbeid med fertilitetsklinikken sikrer en helhetlig tilnærming for par med barneønske.",
    benefits: [
      "Sædanalyse etter WHO-standard",
      "Hormonutredning",
      "Urologisk undersøkelse",
      "Tett samarbeid med fertilitetsklinikken",
    ],
    faqs: [
      { question: "Hva innebærer en sædanalyse?", answer: "En sædprøve analyseres i laboratoriet for antall, bevegelighet og form på sædcellene." },
      { question: "Kan mannlig infertilitet behandles?", answer: "I mange tilfeller ja, avhengig av årsaken. Vi tilbyr både medisinsk og kirurgisk behandling." },
    ],
  },
  "urologi/nyrer": {
    title: "Nyrer",
    subtitle: "Utredning og behandling av nyrecyster, nyrestein og nyretumor.",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Vi tilbyr avansert diagnostikk og behandling av alle nyresykdommer, inkludert nyrecyster, nyrestein og nyretumorer. Ved nyrekreft tilbyr vi robotassistert kirurgi for mest mulig skånsom behandling.",
    benefits: [
      "Avansert bildediagnostikk med ultralyd og CT",
      "Robotassistert kirurgi for nyrekreft",
      "Moderne nyresteinbehandling",
      "Oppfølging av nyrecyster",
    ],
    faqs: [
      { question: "Hva gjør man med nyrestein?", answer: "Behandlingen avhenger av størrelse og plassering. Vi tilbyr ulike metoder fra medikamentell til kirurgisk behandling." },
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
    subtitle: "Omfattende utredning av ufrivillig barnløshet.",
    parentCategory: "Fertilitet",
    heroImage: fertilitetImg,
    description: "Infertilitet defineres som manglende graviditet etter ett år med regelmessig ubeskyttet samleie. Årsaken kan ligge hos kvinnen, mannen eller begge. Vi tilbyr grundig utredning og individuelt tilpasset behandling.\n\nVårt erfarne team av reproduksjonsmedisinere, gynekologer og embryologer har hjulpet tusenvis av par og enslige med å oppfylle barneønsket.",
    benefits: [
      "Grundig utredning av begge partnere",
      "Hormonprøver, ultralyd og sædanalyse",
      "Individuell behandlingsplan",
      "Tilgang til alle former for fertilitetsbehandling",
      "Høye suksessrater",
    ],
    faqs: [
      { question: "Når bør vi oppsøke hjelp?", answer: "Vi anbefaler utredning etter 12 måneder uten graviditet, eller etter 6 måneder dersom kvinnen er over 35 år." },
      { question: "Hva innebærer en fertilitetsutredning?", answer: "Utredningen inkluderer blodprøver, hormonanalyser, ultralyd av eggstokkene og sædanalyse." },
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
