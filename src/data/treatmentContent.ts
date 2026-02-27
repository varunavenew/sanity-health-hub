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

export interface TreatmentData {
  title: string;
  subtitle: string;
  parentCategory: string;
  heroImage: string;
  description: string;
  benefits?: string[];
  benefitsTitle?: string;
  process?: { title: string; description: string }[];
  faqs?: { question: string; answer: string }[];
}

// Key: "categoryId/subId" matching the route /behandlinger/:categoryId/:subId
export const treatmentContent: Record<string, TreatmentData> = {
  // ==========================================
  // GYNEKOLOGI
  // ==========================================
  "gynekologi/tverrfaglig": {
    title: "Tverrfaglig team",
    subtitle: "Helhetlig oppfølging med osteopat, sexolog, psykolog og ernæringsfysiolog.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Hos CMedical tror vi på en helhetlig tilnærming til kvinnehelse. Vårt tverrfaglige team består av osteopat, sexolog, psykolog og ernæringsfysiolog som samarbeider tett med våre gynekologer for å gi deg den beste behandlingen.\n\nVi forstår at gynekologiske plager ofte påvirker hele livssituasjonen, og derfor tilbyr vi et bredt spekter av tilleggstjenester som kan supplere din medisinske behandling.",
    benefits: [
      "Samarbeid mellom ulike fagdisipliner for best mulig resultat",
      "Osteopat med spesialkompetanse på bekkenbunnen og underlivsplager",
      "Sexolog for hjelp med intimitetsproblemer og seksuelle utfordringer",
      "Psykolog som forstår de emosjonelle sidene ved gynekologiske tilstander",
      "Ernæringsfysiolog for kostholdsrådgivning tilpasset din situasjon",
    ],
    faqs: [
      { question: "Trenger jeg henvisning?", answer: "Nei, du trenger ikke henvisning. Du kan bestille time direkte hos oss." },
      { question: "Kan jeg kombinere flere tjenester?", answer: "Ja, vi tilpasser et opplegg som passer for deg. Snakk med din gynekolog om hvilke tverrfaglige tjenester som kan være aktuelle." },
      { question: "Dekkes dette av forsikring?", answer: "Mange helseforsikringer dekker konsultasjoner hos våre spesialister. Ta kontakt med ditt forsikringsselskap for å sjekke din dekning." },
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
    subtitle: "Effektiv behandling av stressinkontinens, tranginkontinens og blandingsinkontinens.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Urinlekkasje er svært vanlig og rammer kvinner i alle aldre. Det finnes gode behandlingsmuligheter, og du trenger ikke å leve med plagene. Hos CMedical har vi lang erfaring med utredning og behandling av alle former for urinlekkasje.\n\nVi tilbyr både konservativ behandling med bekkenbunnstrening og kirurgiske løsninger ved behov.",
    benefits: [
      "Spesialistkompetanse på urinlekkasje hos kvinner",
      "Grundig utredning for å finne riktig behandlingsform",
      "Moderne kirurgiske metoder med kort rekonvalesens",
      "Bekkenbunnstrening med fysioterapeut",
      "Tett oppfølging gjennom hele behandlingsforløpet",
    ],
    process: [
      { title: "Utredning", description: "Grundig kartlegging av type lekkasje, omfang og eventuelle utløsende faktorer." },
      { title: "Behandlingsplan", description: "Individuell plan som kan inkludere bekkenbunnstrening, medisiner eller kirurgi." },
      { title: "Behandling", description: "Gjennomføring av valgt behandling med oppfølging underveis." },
      { title: "Oppfølging", description: "Kontroll for å sikre god effekt av behandlingen." },
    ],
    faqs: [
      { question: "Er urinlekkasje normalt?", answer: "Urinlekkasje er svært vanlig, men det er ikke noe du trenger å akseptere. Det finnes gode behandlingsmuligheter." },
      { question: "Kan bekkenbunnstrening hjelpe?", answer: "Ja, bekkenbunnstrening er ofte førstevalg ved stressinkontinens og kan gi betydelig bedring." },
      { question: "Når bør jeg vurdere kirurgi?", answer: "Kirurgi kan være aktuelt dersom konservativ behandling ikke gir tilstrekkelig effekt. Din gynekolog vil veilede deg." },
    ],
  },
  "gynekologi/endometriose": {
    title: "Endometriose",
    subtitle: "Spesialisert diagnostikk og behandling av endometriose og adenomyose.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Endometriose er en tilstand der livmorslimhinnen vokser utenfor livmoren, noe som kan forårsake sterke smerter og påvirke fertiliteten. CMedical har noen av Nordens fremste eksperter på endometriose.\n\nVi tilbyr alt fra medisinsk behandling til avansert robotassistert kirurgi for dyp endometriose – noe svært få klinikker i Norge kan tilby.",
    benefits: [
      "Ledende ekspertise på endometriose i Norden",
      "Robotassistert kirurgi for dyp endometriose",
      "Tverrfaglig tilnærming med smertespesialister og psykolog",
      "Moderne diagnostikk med ultralyd og MR",
      "Tett samarbeid med fertilitetsklinikken ved barneønske",
    ],
    process: [
      { title: "Konsultasjon", description: "Grundig samtale om symptomer, sykehistorie og eventuelle tidligere behandlinger." },
      { title: "Diagnostikk", description: "Gynekologisk undersøkelse, ultralyd og eventuelt MR for å kartlegge omfanget." },
      { title: "Behandlingsplan", description: "Individuell plan basert på funn, symptomer og eventuelle barneønsker." },
      { title: "Behandling og oppfølging", description: "Medisinsk eller kirurgisk behandling med langvarig oppfølging." },
    ],
    faqs: [
      { question: "Hva er symptomene på endometriose?", answer: "Vanlige symptomer er sterke menssmerter, kroniske bekkensmerter, smerter ved samleie og i noen tilfeller redusert fertilitet." },
      { question: "Kan endometriose påvirke fertiliteten?", answer: "Ja, endometriose kan påvirke fertiliteten. Vi har tett samarbeid med fertilitetsklinikken for å gi best mulig hjelp." },
      { question: "Hva er robotkirurgi?", answer: "Robotassistert kirurgi gir kirurgen bedre presisjon og oversikt, noe som er spesielt viktig ved dyp endometriose nær vitale organer." },
    ],
  },
  "gynekologi/overgangsalder": {
    title: "Overgangsalder",
    subtitle: "Hormonbehandling og oppfølging for en bedre overgangsalder.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Overgangsalderen er en naturlig fase i livet, men for mange kvinner medfører den plagsomme symptomer som hetetokter, søvnproblemer, humørsvingninger og tørre slimhinner.\n\nHos CMedical hjelper vi deg med å forstå hva som skjer i kroppen og finner den beste behandlingen for akkurat deg. Våre gynekologer har lang erfaring med hormonbehandling og andre tilnærminger.",
    benefits: [
      "Individuelt tilpasset hormonbehandling",
      "Grundig helsesjekk før oppstart av behandling",
      "Oppfølging og justering av behandlingen over tid",
      "Rådgivning om livsstilsendringer som kan hjelpe",
      "Tverrfaglig tilnærming med ernæringsfysiolog og psykolog",
    ],
    faqs: [
      { question: "Er hormonbehandling trygt?", answer: "Moderne hormonbehandling er godt dokumentert og trygt for de fleste kvinner. Vi gjør en grundig vurdering før oppstart." },
      { question: "Når bør jeg oppsøke hjelp?", answer: "Dersom symptomene påvirker din livskvalitet, bør du bestille time. Det finnes gode behandlingsmuligheter." },
      { question: "Hva koster en konsultasjon?", answer: "En konsultasjon hos gynekolog koster fra kr 2 100. Se vår prisliste for detaljer." },
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
    subtitle: "Hysterektomi med moderne, skånsomme metoder.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Fjerning av livmoren (hysterektomi) kan være aktuelt ved ulike tilstander som muskelknuter, kraftige blødninger, endometriose eller fremfall. Vi tilbyr robotassistert hysterektomi som gir kortere rekonvalesens og mindre smerter.\n\nCMedical er en av svært få klinikker i Norge som tilbyr robotassistert gynekologisk kirurgi.",
    benefits: [
      "Robotassistert kirurgi for minimalt inngrep",
      "Kortere sykehusopphold og raskere rekonvalesens",
      "Erfarne kirurger med høyt volum operasjoner",
      "Grundig informasjon og forberedelse før inngrepet",
    ],
    faqs: [
      { question: "Hva er robotkirurgi?", answer: "Robotassistert kirurgi gir kirurgen bedre presisjon gjennom små snitt. Dette gir mindre smerter og raskere tilbakegang til hverdagen." },
      { question: "Hvor lang er rekonvalesenstiden?", answer: "Med robotassistert teknikk er rekonvalesenstiden typisk 2-4 uker, sammenlignet med 6-8 uker ved tradisjonell åpen kirurgi." },
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
    subtitle: "Avansert kirurgi inkludert robotassisterte inngrep.",
    parentCategory: "Gynekologi",
    heroImage: heroTech,
    description: "CMedical tilbyr et bredt spekter av gynekologiske operasjoner, fra enkle inngrep til avansert robotassistert kirurgi. Vi er en av svært få private klinikker i Norden som tilbyr robotkirurgi innen gynekologi.\n\nVåre kirurger har høyt volum og lang erfaring, noe som gir trygge og gode resultater.",
    benefits: [
      "Robotassistert kirurgi med da Vinci-systemet",
      "Fremfalloperasjoner med moderne teknikker",
      "Operasjon for urinlekkasje",
      "Fjerning av muskelknuter og polypper",
      "Hysterektomi med minimal invasiv teknikk",
      "Avansert endometriosekirurgi",
    ],
    faqs: [
      { question: "Er robotkirurgi trygt?", answer: "Ja, robotassistert kirurgi er vel dokumentert og gir ofte bedre resultater enn tradisjonell åpen kirurgi." },
      { question: "Kan jeg reise hjem samme dag?", answer: "Ved mange inngrep kan du reise hjem samme dag eller dagen etter. Din kirurg vil gi deg informasjon om dette." },
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
    subtitle: "Undersøkelse av livmorhulen med kamera.",
    parentCategory: "Gynekologi",
    heroImage: gynekologiImg,
    description: "Hysteroskopi er en undersøkelse der et tynt kamera føres inn i livmorhulen for å undersøke slimhinnen. Metoden brukes både diagnostisk og for behandling av polypper, muskelknuter og andre tilstander.\n\nVi tilbyr office-hysteroskopi som kan utføres uten narkose, noe som gjør prosedyren raskere og enklere for pasienten.",
    benefits: [
      "Office-hysteroskopi uten narkose",
      "Rask prosedyre – vanligvis under 30 minutter",
      "Umiddelbar diagnostikk med mulighet for behandling",
      "Ingen sykemelding nødvendig",
    ],
    faqs: [
      { question: "Gjør hysteroskopi vondt?", answer: "Office-hysteroskopi oppleves som noe ubehagelig, men er vanligvis godt tolerert. Vi bruker lokalanestesi ved behov." },
      { question: "Når brukes hysteroskopi?", answer: "Vanlige indikasjoner er uregelmessige blødninger, mistanke om polypper eller muskelknuter, og som del av fertilitetsutredning." },
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
    subtitle: "Utredning av kuler i pungen, testikkelkreft og andre tilstander.",
    parentCategory: "Urologi",
    heroImage: urologiImg,
    description: "Kuler eller forandringer i pungen bør alltid undersøkes av urolog. Vi tilbyr rask utredning med ultralyd og blodprøver for å avklare årsaken.\n\nTidlig oppdagelse er viktig, spesielt ved testikkelkreft som har svært gode behandlingsresultater ved tidlig diagnose.",
    benefits: [
      "Rask utredning med ultralyd samme dag",
      "Erfarne urologer med spesialkompetanse",
      "Tett samarbeid med sykehus ved behov for videre behandling",
    ],
    faqs: [
      { question: "Hva kan en kul i pungen være?", answer: "Det kan være mange ufarlige årsaker som cyster eller væskeansamlinger, men det bør alltid undersøkes for å utelukke testikkelkreft." },
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
    subtitle: "Helhetlig behandling av muskel- og skjelettplager.",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Våre osteopater tilbyr helhetlig undersøkelse og behandling av muskel- og skjelettplager. Osteopati fokuserer på kroppens evne til selvhelbredelse gjennom manuelle teknikker.\n\nVi har spesialkompetanse på bekkenbunnsplager og underlivsrelaterte smerter i samarbeid med gynekologisk avdeling.",
    benefits: [
      "Spesialkompetanse på bekkenbunnsplager",
      "Helhetlig tilnærming til smertebehandling",
      "Samarbeid med gynekologer og fysioterapeuter",
      "Individuelt tilpasset behandlingsplan",
    ],
    faqs: [
      { question: "Hva er forskjellen på osteopat og fysioterapeut?", answer: "Osteopater fokuserer på hele kroppens balanse og bruker manuelle teknikker. Fysioterapeuter fokuserer ofte mer på spesifikke skader og trening." },
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
    subtitle: "Psykologisk støtte og samtaleterapi.",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Våre psykologer tilbyr samtaleterapi for ulike utfordringer, med spesialkompetanse på psykologiske aspekter ved gynekologiske tilstander, infertilitet, svangerskap og overgangsalder.\n\nVi er en del av det tverrfaglige teamet som sikrer helhetlig oppfølging.",
    benefits: [
      "Spesialkompetanse på kvinnehelse og fertilitet",
      "Samtaleterapi for enkeltpersoner og par",
      "Støtte under fertilitetsbehandling",
      "Del av tverrfaglig team for helhetlig behandling",
    ],
    faqs: [
      { question: "Kan jeg gå til psykolog uten å ha annen behandling hos dere?", answer: "Ja, du kan bestille time hos psykolog uavhengig av annen behandling." },
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
    subtitle: "Hjelp med seksuelle utfordringer og intimitetsproblemer.",
    parentCategory: "Flere fagområder",
    heroImage: flereFagImg,
    description: "Våre sexologer tilbyr rådgivning og terapi for seksuelle utfordringer som kan påvirke livskvaliteten. Vi har spesialkompetanse på problemstillinger knyttet til gynekologiske tilstander, fertilitet og overgangsalder.",
    benefits: [
      "Trygt og profesjonelt miljø",
      "Spesialkompetanse på seksualitet og gynekologiske tilstander",
      "Individuell terapi og parterapi",
      "Del av tverrfaglig team",
    ],
    faqs: [
      { question: "Hva kan en sexolog hjelpe med?", answer: "Smerter ved samleie, nedsatt lyst, ereksjonsproblemer, intimitetsproblemer og seksuelle utfordringer knyttet til sykdom eller behandling." },
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
};
