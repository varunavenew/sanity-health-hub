import type { SubTreatmentContent } from "@/components/layout/SubTreatmentLayout";
import majorstuenVenteromTv from "@/assets/clinics/majorstuen/venterom-tv.asset.json";
const imgMajorstuen = majorstuenVenteromTv.url;

import expertEndometriose from "@/assets/hero/gynecology-hero.jpg";
import expertBekkenbunn from "@/assets/hero/hero-pregnancy.jpg";
import expertOvergangsalder from "@/assets/hero/cmedical-hero-2.jpg";
import expertVulva from "@/assets/hero/kvinnehelse-hero.jpg";
import urogynekologiHero from "@/assets/urogynekologi-hero.jpg.asset.json";
const imgUrogynekologiHero = urogynekologiHero.url;
import robotkirurgiHeroVideo from "@/assets/hero/robotkirurgi-hero.mp4.asset.json";
import tverrfagligHeroVideo from "@/assets/hero/tverrfaglig-hero.mp4.asset.json";

const parent = { name: "Gynekologi", path: "/gynekologi" };
const baseBooking = { kategori: "gynekologi" as const };

const standardPromises = [
  {
    title: "Du bestemmer hva du er komfortabel med",
    desc: "Alle undersøkelser og inngrep gjøres i ditt tempo. Du kan stoppe når som helst, stille spørsmål underveis, og ta med noen om du ønsker det.",
  },
  {
    title: "Spesialister med dybde",
    desc: "Hos oss møter du leger som har spesialisert seg innenfor sitt fagfelt — ikke en generalist på utplassering. Du får riktig kompetanse fra første konsultasjon.",
  },
  {
    title: "Alt under samme tak",
    desc: "Trenger du videre utredning, kirurgi eller psykologhjelp — vi koordinerer hele forløpet for deg. Ingenting forsvinner mellom sprekker.",
  },
];

export const gynekologiSubPages: Record<string, SubTreatmentContent> = {
  /* ───────────────────────── GYNEKOLOGISK UNDERSØKELSE ───────────────────────── */
  undersokelse: {
    seoTitle: "Gynekologisk undersøkelse | CMedical",
    seoDescription:
      "Trygg gynekologisk undersøkelse uten henvisning og uten ventetid. Du møter en spesialist som tar seg tid — og forklarer alt underveis.",
    canonical: "/behandlinger/gynekologi/undersokelse",
    parent,
    title: "Gynekologisk undersøkelse",
    heroTitle: <>Noe kjennes ikke helt <span className="italic">riktig</span></>,
    heroDescription:
      "Du trenger ikke vite hva det er — det er det vi er her for. En gynekologisk undersøkelse er det naturlige første steget, enten du har konkrete plager eller bare ønsker å sjekke at alt er som det skal.",
    heroPoints: [
      { title: "Ingen ventetid", desc: "Du finner time hos oss innen få dager — ikke etter måneder i offentlig kø." },
      { title: "Du møter riktig spesialist", desc: "Gynekologene våre jobber med det de kan best. Vi sørger for at du møter rett person." },
      { title: "Vi forstår", desc: "Du fortjener tid til samtalen, ikke et fem-minutters møte. Vi tar oss tid." },
      { title: "Alt under samme tak", desc: "Trenger du videre utredning eller behandling, har du det her. Ingen omveier." },
    ],
    rating: "4,7 — Ingen ventetid · Ingen henvisning nødvendig",
    heroPrice: "Pris fra 2 200 kr",
    hideSeePriser: true,
    booking: { kategori: "gynekologi", tjeneste: "undersokelse" },
    primaryCtaLabel: "Se ledige tider",
    flowTitle: "Slik foregår det",
    flowImage: imgMajorstuen,
    flowImageAlt: "Interiør fra CMedical-klinikken",
    flowLinkLabel: "Les mer om klinikken",
    flowLinkHref: "/klinikker/majorstuen",
    flow: [
      { n: "01", title: "Samtale og kartlegging", desc: "Grundig samtale om dine plager og din historikk." },
      { n: "02", title: "Undersøkelse og utredning", desc: "Gynekologen undersøker deg og tar supplerende prøver ved behov." },
      { n: "03", title: "Veien videre", desc: "Gynekologen sørger for riktig behandling og sammen legger dere en plan for videre oppfølging." },
    ],
    reasonsTitle: "Du trenger ikke ha en diagnose for å\u00A0bestille",
    reasonsLead:
      "En gynekologisk undersøkelse er for alle som har en kropp som trenger å bli sett. Kanskje kjenner du på noe vagt og udefinerbart, kanskje vil du bare forsikre deg om at alt er ok.",
    reasonsLead2:
      "Det viktigste er at du ikke venter for lenge med å ta kontakt. Vi er her nettopp for dette.",
    reasons: [
      { n: "01", title: "Smerter eller ubehag i underlivet", desc: "Underlivssmerter, smerter ved samleie eller endrede menssmerter — det finnes årsaker, og de kan behandles." },
      { n: "02", title: "Uregelmessig eller kraftig blødning", desc: "Mensen kommer for sent eller for tidlig, kraftig eller for lite — det kan være lurt å sjekke hva som ligger bak." },
      { n: "03", title: "Rutinesjekk og cellprøver", desc: "Cellprøver er en trygghet. Ingen forklaring trengs — det er kanskje den raskeste timen du tar i året." },
      { n: "04", title: "Noe føles ikke riktig — men hva?", desc: "Du vet ikke helt hva det er, men du merker at noe ikke stemmer helt. Det er en god nok grunn for å ta kontakt." },
      { n: "05", title: "Prevensjon og hormonell helse", desc: "Rådgivning om prevensjon, hormonell ubalanse eller hjelp til å finne det som passer deg." },
    ],
    promises: standardPromises,
    expertAreas: {
      title: "Eksperter som jobber med det de kan aller\u00A0best.",
      description:
        "Hos oss møter du gynekologer som har spesialisert seg dypt innenfor sitt fagfelt. Det betyr at du får riktig kompetanse fra første konsultasjon — uten omveier.",
      items: [
        {
          title: "Endometriose",
          desc: "Vi er ledende i Nord-Europa på endometriosebehandling med robotassistert kirurgi — også de kompliserte tilfellene.",
          href: "/behandlinger/gynekologi/endometriose",
          image: expertEndometriose,
        },
        {
          title: "Fødselsskader og bekkenbunnshelse",
          desc: "Fra rifter til urinlekkasje — vi behandler både i samtale og kirurgisk når det trengs. Du fortjener å bli hørt.",
          href: "/behandlinger/gynekologi/urinlekkasje",
          image: expertBekkenbunn,
        },
        {
          title: "Overgangsalder",
          desc: "Trygg og oppdatert hormonbehandling — basert på din historie og dine ønsker. Vi tar oss tid til samtalen.",
          href: "/behandlinger/gynekologi/overgangsalder",
          image: expertOvergangsalder,
        },
        {
          title: "Vulvasmerter",
          desc: "Smerter og ubehag i vulva blir ofte oversett. Hos oss møter du spesialister som forstår — og finner svar.",
          href: "/behandlinger/gynekologi/vulvalidelser",
          image: expertVulva,
        },
      ],
    },
    related: [
      { title: "Endometriose", desc: "En av de vanligste gynekologiske sykdommene — og en av de mest oversette. Vi har lengre timer for grundig vurdering.", href: "/behandlinger/gynekologi/endometriose" },
      { title: "Blødningsforstyrrelser", desc: "Kraftige, langvarige eller uregelmessige blødninger kan skyldes myomer, polypper eller hormonell ubalanse — vi finner årsaken.", href: "/behandlinger/gynekologi/blodningsforstyrrelser" },
      { title: "PMOS", desc: "Polycystisk ovariesyndrom kan gi uregelmessig syklus, akne og uttretthet. Vi gir utredning og oppfølging.", href: "/behandlinger/gynekologi/pcos" },
    ],
    ctaTitle: "Bestill gynekologisk\u00A0undersøkelse",
    ctaDescription:
      "Ingen ventetid. Ingen fastlege nødvendig. Du bestiller direkte — og vi sørger for at du møter riktig spesialist.",
  },


  endometriose: {
    seoTitle: "Endometriose | CMedical — utredning og behandling",
    seoDescription:
      "Spesialisert utredning og behandling av endometriose. Vi tar smertene dine på alvor — uten henvisning og uten ventetid.",
    canonical: "/behandlinger/gynekologi/endometriose",
    parent,
    title: "Endometriose og adenomyose",
    heroTitle: <>Vondt er ikke bare <span className="italic">menstruasjon</span></>,
    heroDescription:
      "Endometriose er en av de vanligste — og mest oversette — gynekologiske sykdommene. Hos oss møter du spesialister som tar smertene dine på alvor og finner svar.",
    heroPoints: [
      { title: "Lengre konsultasjonstid", desc: "Vi setter av tid til en grundig samtale, ikke et fem-minutters møte." },
      { title: "Erfarne endometriosespesialister", desc: "Du møter leger som har spesialisert seg på akkurat dette." },
      { title: "Avansert ultralyd", desc: "Vi kombinerer klinisk undersøkelse med høyoppløselig ultralyd for å se det andre overser." },
      { title: "Kirurgi når det trengs", desc: "Trenger du operasjon, har vi det her — med roboteknologi for skånsom inngrep." },
    ],
    rating: "4,8 — Spesialiserte endometriosespesialister",
    booking: { ...baseBooking, tjeneste: "endometriose" },
    primaryCtaLabel: "Bestill utredning",
    flowTitle: "Slik utreder vi endometriose",
    flow: [
      { n: "Steg 01", title: "Samtale og kartlegging", desc: "Vi går grundig gjennom symptomer, syklus og hvordan plagene påvirker hverdagen din." },
      { n: "Steg 02", title: "Klinisk undersøkelse", desc: "Gynekologisk undersøkelse med spesialisert ultralyd som kan se dyp endometriose." },
      { n: "Steg 03", title: "Diagnose og forklaring", desc: "Vi forklarer hva vi finner — med tydelige ord og bilder du forstår." },
      { n: "Steg 04", title: "Behandlingsplan", desc: "Hormonell behandling, smertelindring eller kirurgi — vi finner det som passer deg." },
    ],
    reasonsTitle: "Når bør du mistenke endometriose?",
    reasonsLead:
      "Endometriose kan se ut som mange andre tilstander, og blir ofte oversett i mange år. Disse symptomene bør tas på alvor.",
    reasons: [
      { n: "01", title: "Sterke menssmerter", desc: "Smerter som ikke lindres av vanlige smertestillende, eller som hindrer deg i å fungere normalt." },
      { n: "02", title: "Smerter ved samleie", desc: "Dype smerter under eller etter samleie er ikke normalt og kan tyde på endometriose." },
      { n: "03", title: "Kronisk bekkensmerte", desc: "Vedvarende smerter i nedre del av magen, også utenom mensen." },
      { n: "04", title: "Tarm- og urinplager ved mens", desc: "Smerter ved avføring eller vannlating, særlig i forbindelse med menstruasjonen." },
      { n: "05", title: "Problemer med å bli gravid", desc: "Endometriose er en kjent årsak til fertilitetsproblemer — og kan behandles." },
      { n: "06", title: "Utmattelse og kvalme", desc: "Kraftig tretthet og kvalme rundt mensen kan være tegn på underliggende sykdom." },
    ],
    promises: standardPromises,
    related: [
      { title: "Blødningsforstyrrelser", desc: "Kraftige eller uregelmessige blødninger kan henge sammen med endometriose, myomer eller polypper.", href: "/behandlinger/gynekologi/blodningsforstyrrelser" },
      { title: "Cyster på eggstokkene", desc: "Endometriomer (sjokoladecyster) er en form for endometriose som kan kreve egen vurdering.", href: "/behandlinger/gynekologi/cyster" },
      { title: "Robotassistert kirurgi", desc: "Avansert minimalt invasiv kirurgi gir kortere innleggelse og raskere restitusjon.", href: "/behandlinger/gynekologi/robotkirurgi" },
    ],
    ctaTitle: "Få en grundig endometriosevurdering",
    ctaDescription:
      "Du fortjener å bli hørt — og du fortjener svar. Vi har spesialistene som kan gi deg begge deler.",
  },

  /* ───────────────────────── OVERGANGSALDER ───────────────────────── */
  overgangsalder: {
    seoTitle: "Overgangsalder | CMedical — trygg hormonbehandling",
    seoDescription:
      "Spesialisert hjelp i overgangsalderen. Trygg, oppdatert hormonbehandling tilpasset deg — uten henvisning og uten ventetid.",
    canonical: "/behandlinger/gynekologi/overgangsalder",
    parent,
    title: "Overgangsalder",
    heroTitle: <>Du skal ikke <span className="italic">tåle deg</span> gjennom overgangsalderen</>,
    heroDescription:
      "Hetetokter, søvnproblemer, humørsvingninger og tørrhet — symptomene er reelle, og de kan behandles. Vi gir deg trygg, oppdatert hormonbehandling tilpasset deg.",
    heroPoints: [
      { title: "Oppdatert kunnskap", desc: "Vi følger de nyeste internasjonale retningslinjene for hormonbehandling." },
      { title: "Individuell tilpasning", desc: "Behandlingen tilpasses din historie, dine ønsker og dine mål." },
      { title: "Tid til samtalen", desc: "Vi tar oss tid til å gå gjennom alt — også det som er vanskelig å snakke om." },
      { title: "Tett oppfølging", desc: "Vi følger deg over tid og justerer behandlingen etter behov." },
    ],
    heroPrice: "Pris fra 2 500 kr",
    booking: { ...baseBooking, tjeneste: "overgangsalder" },
    primaryCtaLabel: "Se ledige tider",
    flowTitle: "Hva skjer hos oss",
    flow: [
      { n: "Steg 01", title: "Grundig samtale", desc: "Vi kartlegger symptomer, livssituasjon og din helsehistorikk." },
      { n: "Steg 02", title: "Undersøkelse og prøver", desc: "Klinisk undersøkelse, eventuell ultralyd og blodprøver der det er aktuelt." },
      { n: "Steg 03", title: "Behandlingsplan", desc: "Vi går gjennom alternativene — hormonell, ikke-hormonell og livsstil — og finner det som passer deg." },
      { n: "Steg 04", title: "Oppfølging", desc: "Kontroll etter 3 måneder for å justere behandlingen og sikre at du har det bra." },
    ],
    reasonsTitle: "Symptomer det er verdt å ta på alvor",
    reasonsLead:
      "Overgangsalderen rammer alle kvinner — men opplevelsen er svært individuell. Disse symptomene fortjener oppmerksomhet.",
    reasons: [
      { n: "01", title: "Hetetokter og nattesvette", desc: "Plutselig varmefølelse som forstyrrer søvn og dagligliv." },
      { n: "02", title: "Søvnproblemer", desc: "Vansker med å sovne, hyppige oppvåkninger eller dårlig søvnkvalitet." },
      { n: "03", title: "Humørsvingninger og angst", desc: "Følelse av nedstemthet, irritabilitet eller engstelse uten åpenbar grunn." },
      { n: "04", title: "Tørrhet og smerter ved samleie", desc: "Vaginal tørrhet og redusert lyst er svært vanlig og fullt behandlingsbart." },
      { n: "05", title: "Endret syklus eller blødninger", desc: "Uregelmessige eller kraftigere blødninger i perimenopausen bør sjekkes." },
      { n: "06", title: "Konsentrasjon og hukommelse", desc: "Hjernetåke og glemsomhet er reelle symptomer — ikke innbilt." },
    ],
    promises: standardPromises,
    related: [
      { title: "Vulvalidelser", desc: "Tørrhet og smerter i vulva er vanlig i overgangsalderen og kan behandles spesifikt.", href: "/behandlinger/gynekologi/vulvalidelser" },
      { title: "Urinlekkasje", desc: "Mange opplever økt urinlekkasje rundt overgangsalderen — det finnes gode behandlingsalternativer.", href: "/behandlinger/gynekologi/urinlekkasje" },
      { title: "Vaginale fremfall", desc: "Vevsstøtte svekkes med fallende østrogen og kan gi behov for støtte eller kirurgi.", href: "/behandlinger/gynekologi/vaginale-fremfall" },
    ],
    ctaTitle: "Bestill samtale om overgangsalder",
    ctaDescription:
      "Du skal ikke føle at du er alene om dette. Vi har tid, kompetanse og verktøyene til å hjelpe deg.",
  },

  /* ───────────────────────── UROGYNEKOLOGI (samlet hub) ───────────────────────── */
  urogynekologi: {
    seoTitle: "Urogynekologi | CMedical — fremfall og urinlekkasje",
    seoDescription:
      "Urogynekologi samler fremfall (prolaps) og urinlekkasje på ett sted. Utredning og behandling — konservativt og kirurgisk — av vårt uro-gynekologiske team.",
    canonical: "/behandlinger/gynekologi/urogynekologi",
    parent,
    title: "Urogynekologi",
    heroTitle: <>Fremfall og urinlekkasje hører <span className="italic">sammen</span></>,
    heroDescription:
      "Urogynekologi handler om plager i bekkenbunnen – særlig vaginale fremfall (prolaps) og urinlekkasje. Hos oss møter du noen av Nordens fremste eksperter, og tilstandene utredes og behandles samlet av vårt uro-gynekologiske team.",
    heroPoints: [
      { title: "Samlet kompetanse", desc: "Fremfall og lekkasje vurderes sammen — ikke i hver sin silo." },
      { title: "Hele spekteret", desc: "Fra bekkenbunnstrening og pessar til moderne kirurgi, inkludert robotassistert." },
      { title: "Uavhengig av livsfase", desc: "Du kan ha urogynekologiske plager uten å ha født — og uten å være i overgangsalderen." },
      { title: "Erfarne spesialister", desc: "Urogynekologi krever volum og rutine. Våre kirurger gjør dette ofte." },
    ],
    rating: "4,7 — Spesialister på bekkenbunnshelse",
    booking: { ...baseBooking, tjeneste: "urogynekologi" },
    primaryCtaLabel: "Bestill utredning",
    heroImage: imgUrogynekologiHero,
    heroImageAlt: "Hender som støtter underlivet",
    flowTitle: "Slik utreder og behandler vi",
    flowImage: imgMajorstuen,
    flowImageAlt: "Interiør fra CMedical-klinikken",
    flowLinkLabel: "Les mer om klinikken",
    flowLinkHref: "/klinikker/majorstuen",
    flow: [
      { n: "Steg 01", title: "Kartlegging", desc: "Vi går gjennom plager, hverdag og hvordan symptomene påvirker deg — fysisk og sosialt." },
      { n: "Steg 02", title: "Undersøkelse", desc: "Klinisk undersøkelse av bekkenbunn, vurdering av fremfall, eventuell ultralyd og urinprøve." },
      { n: "Steg 03", title: "Behandlingsplan", desc: "Vi starter som regel med konservative tiltak — bekkenbunnstrening, pessar, livsstilsråd og lokal hormonbehandling ved behov." },
      { n: "Steg 04", title: "Kirurgi om nødvendig", desc: "Hvis konservativ behandling ikke er nok, vurderer vi moderne, skånsomme inngrep — inkludert robotassistert kirurgi for komplekse fremfall. Ved samtidig vaginale fremfall og stressurinlekkasje vil du bestandig operere det vaginale fremfallet først." },
    ],
    textSection: {
      title: "Vaginale fremfall (prolaps)",
      lead:
        "Vaginalt fremfall, også kjent som prolaps innebærer at skjedens fremre eller bakre vegg, eller livmor eller bare livmorhals buker ned i skjeden eller ut av skjedeinngangen, dette skjer grunnet svekkelse og skader i bekkenbunnmuskulatur og støttevev etter graviditet, fødsel, aldring, økt buktrykk over lengre tid (forstoppelse, ubehandlet astma/kols) eller kirurgiske inngrep.",
      points: [
        {
          n: "Behandling",
          title: "Tilpasset alvorlighetsgrad",
          desc:
            "Behandlingen avhenger av alvorlighetsgraden av tilstanden og symptomene, og det kan inkludere bekkenbunnstrening, bruk av støtteinnretninger, eller i mer alvorlige tilfeller, kirurgiske inngrep. Det er viktig å oppsøke helsepersonell for en grundig vurdering og rådgivning hvis du opplever symptomer på vaginalt fremfall.",
        },
        {
          n: "Eksperter",
          title: "Nordens fremste på fremfall",
          desc:
            "Hos oss møter du noen av Nordens fremste eksperter på fremfall. Ta kontakt for mer informasjon eller bestill en konsultasjon.",
        },
      ],
      image: imgUrogynekologiHero,
      imageAlt: "Urogynekologi hos CMedical",
    },
    reasonsTitle: "Urinlekkasje (inkontinens)",
    reasonsLead:
      "Nesten 25 % av alle kvinner rammes av urinlekkasje i løpet av livet - noe som gir redusert livskvalitet. Hos oss møter du noen av landets fremste eksperter på urinlekkasje og du får effektiv behandling for alle typer urinveislekkasje, tilpasset deg.",
    reasonsLead2:
      "Hvilken behandling vi anbefaler deg avhenger av hvilken type lekkasje du har, hvor mye du lekker og dine risikofaktorer (BMI, tidligere kirurgi osv.). Det finnes trygge og effektive behandlinger, som for eksempel blæretrening, bekkenbunnstrening, medikamentell behandling eller ulike typer operasjoner. Ved samtidig vaginale fremfall og stressurinlekkasje vil du bestandig operere det vaginale fremfallet først. Har du spørsmål om dette kan du alltid kontakte oss for en uforpliktende prat.",
    reasons: [
      {
        n: "01",
        title: "Stressinkontinens",
        desc:
          "Urinlekkasje ved fysisk aktivitet, hoste eller latter skyldes oftest svekkelse i bindevev/muskulatur som holder urinrør og urinblære på plass. Stressinkontinens oppstår typisk grunnet skader som kommer etter fødsler eller tungt fysisk arbeid.",
      },
      {
        n: "02",
        title: "Tranginkontinens",
        desc:
          "En plutselig sterk trang til å late vannet etterfulgt av lekkasje. Du er ofte plaget av hyppig toalettbesøk, hvor du ikke alltid når frem i tide. Dette skyldes feil i nervesignalene til blæremuskelaturen slik at denne trekker seg sammen ukontrollert og ofte. Kronisk UVI eller betennelse i blæreveggen kan forveksles med trang, dette kan vi også behandle.",
      },
      {
        n: "03",
        title: "Blandingsinkontinens",
        desc:
          "Kombinasjon av stress og trang, hvilken type som dominerer avhenger fra person til person. Er du plaget med dette anbefaler vi deg å ta kontakt med oss.",
      },
    ],
    promises: standardPromises,
    related: [
      { title: "Urinlekkasje", desc: "Utdypende side om stress-, urge- og blandingslekkasje.", href: "/behandlinger/gynekologi/urinlekkasje" },
      { title: "Vaginale fremfall", desc: "Utdypende side om prolaps av livmor, blære og endetarm.", href: "/behandlinger/gynekologi/vaginale-fremfall" },
      { title: "Robotassistert kirurgi", desc: "Avansert kirurgi for komplekse fremfall og inkontinensplager.", href: "/behandlinger/gynekologi/robotkirurgi" },
    ],
    ctaTitle: "Bestill en uforpliktende konsultasjon her",
    ctaDescription:
      "Du trenger ikke leve med fremfall eller lekkasje. Vi gir deg en grundig vurdering og en konkret plan tilpasset deg.",
  },


  /* ───────────────────────── URINLEKKASJE ───────────────────────── */
  urinlekkasje: {
    seoTitle: "Urinlekkasje | CMedical — utredning og behandling",
    seoDescription:
      "Diskret og kompetent hjelp ved urinlekkasje. Konservativ og kirurgisk behandling tilpasset deg.",
    canonical: "/behandlinger/gynekologi/urinlekkasje",
    parent,
    title: "Urinlekkasje",
    heroTitle: <>Urinlekkasje er <span className="italic">vanlig</span> — og kan behandles</>,
    heroDescription:
      "Mange kvinner lever med urinlekkasje i stillhet i mange år. Det trenger du ikke. Vi tilbyr utredning og behandling — alt fra bekkenbunnstrening til kirurgi.",
    heroPoints: [
      { title: "Diskret og trygt miljø", desc: "Vi snakker åpent om noe som ofte er tabubelagt — uten å gjøre det stort." },
      { title: "Hele behandlingsspekteret", desc: "Fra spesialisert fysioterapi til moderne kirurgiske teknikker." },
      { title: "Type-spesifikk utredning", desc: "Stress-, urge- eller blandingslekkasje krever ulik behandling. Vi finner riktig type." },
      { title: "Erfarne kirurger", desc: "Inkontinenskirurgi krever erfaring. Våre spesialister gjør dette ofte." },
    ],
    rating: "4,7 — Spesialister på bekkenbunnshelse",
    booking: { ...baseBooking, tjeneste: "urinlekkasje" },
    primaryCtaLabel: "Bestill utredning",
    flowTitle: "Slik utreder og behandler vi",
    flow: [
      { n: "Steg 01", title: "Kartlegging", desc: "Vi går gjennom plager, livssituasjon og hvordan urinlekkasjen påvirker hverdagen." },
      { n: "Steg 02", title: "Undersøkelse", desc: "Klinisk undersøkelse av bekkenbunn, eventuell ultralyd og urinprøve." },
      { n: "Steg 03", title: "Behandlingsplan", desc: "Konservative tiltak først — bekkenbunnstrening, livsstilsråd og medikamenter ved behov." },
      { n: "Steg 04", title: "Kirurgi om nødvendig", desc: "Hvis konservative tiltak ikke er nok, vurderer vi moderne, skånsomme kirurgiske inngrep." },
    ],
    reasonsTitle: "Når bør du søke hjelp?",
    reasonsLead:
      "Urinlekkasje kommer i mange former. Felles for alle er at det finnes hjelp — og at det sjelden blir bedre av seg selv.",
    reasons: [
      { n: "01", title: "Lekkasje ved hoste eller nys", desc: "Stresslekkasje er vanligst og responderer ofte godt på trening eller kirurgi." },
      { n: "02", title: "Plutselig urintrang", desc: "Urge-lekkasje gir akutt trang med lite varsel — og krever annen behandling." },
      { n: "03", title: "Lekkasje ved fysisk aktivitet", desc: "Begrenser deg fra å trene eller delta i aktiviteter du liker." },
      { n: "04", title: "Hyppig vannlating om natten", desc: "Mer enn én gang i løpet av natten påvirker søvn og livskvalitet." },
      { n: "05", title: "Etter graviditet", desc: "Bekkenbunnen trenger ofte målrettet trening eller behandling etter fødsel." },
      { n: "06", title: "Etter overgangsalderen", desc: "Hormonelle endringer kan gjøre urinlekkasje verre — det finnes gode tiltak." },
    ],
    promises: standardPromises,
    related: [
      { title: "Vaginale fremfall", desc: "Fremfall og urinlekkasje opptrer ofte sammen og kan behandles parallelt.", href: "/behandlinger/gynekologi/vaginale-fremfall" },
      { title: "Overgangsalder", desc: "Hormonelle endringer påvirker bekkenbunn og blære — vi vurderer helheten.", href: "/behandlinger/gynekologi/overgangsalder" },
      { title: "Robotassistert kirurgi", desc: "Avansert kirurgi for komplekse fremfall og inkontinensplager.", href: "/behandlinger/gynekologi/robotkirurgi" },
    ],
    ctaTitle: "Bestill utredning av urinlekkasje",
    ctaDescription:
      "Du trenger ikke leve med dette. Vi gir deg en grundig vurdering og en konkret plan.",
  },

  /* ───────────────────────── PMOS ───────────────────────── */
  pcos: {
    seoTitle: "PMOS | CMedical — utredning og oppfølging",
    seoDescription:
      "Spesialisert utredning og oppfølging av PMOS (polycystisk ovariesyndrom) — gjennom alle faser av livet.",
    canonical: "/behandlinger/gynekologi/pcos",
    parent,
    title: "PMOS",
    heroTitle: <>PMOS er mer enn <span className="italic">cyster</span></>,
    heroDescription:
      "Polyendokrint metabolsk ovarialsyndrom (PMOS), tidligere Polycystisk ovariesyndrom (PCOS), er en hormonell forstyrrelse som gir mange ulike symptomer. Vi hjelper deg slik at du får en bedre hverdag.",
    heroPoints: [
      { title: "Helhetlig utredning", desc: "Hormoner, ultralyd, metabolsk vurdering — vi kartlegger hele bildet." },
      { title: "Skreddersydd plan", desc: "Behandling tilpasset om du ønsker barn nå, senere — eller noe helt annet." },
      { title: "Tverrfaglig tilnærming", desc: "Tilgang til ernæring, fertilitetshjelp og psykologi når du trenger det." },
      { title: "Langsiktig oppfølging", desc: "PMOS følger deg gjennom livet — vi gjør det også." },
    ],
    rating: "4,8 — Spesialister på kvinnehelse",
    booking: { ...baseBooking, tjeneste: "pcos" },
    primaryCtaLabel: "Bestill utredning",
    flowTitle: "Slik utreder vi PMOS",
    flow: [
      { n: "Steg 01", title: "Samtale", desc: "Vi kartlegger syklus, symptomer, familiehistorikk og hva som er viktig for deg nå." },
      { n: "Steg 02", title: "Undersøkelse og prøver", desc: "Ultralyd av eggstokker, hormonprøver og metabolsk screening." },
      { n: "Steg 03", title: "Diagnose og forklaring", desc: "Vi går gjennom funnene og forklarer hva PMOS betyr for akkurat deg." },
      { n: "Steg 04", title: "Behandlingsplan", desc: "Hormonell, metabolsk eller fertilitetsrettet behandling — basert på dine mål." },
    ],
    reasonsTitle: "Tegn på PMOS",
    reasonsLead:
      "PMOS gir svært ulike symptomer. Mange går udiagnostisert i årevis fordi tegnene tolkes hver for seg.",
    reasons: [
      { n: "01", title: "Uregelmessig eller manglende menstruasjon", desc: "Lange sykluser eller fravær av mens er et av de tydeligste tegnene." },
      { n: "02", title: "Akne og fet hud", desc: "Hormonell akne hos voksne kan henge sammen med PMOS." },
      { n: "03", title: "Økt hårvekst", desc: "Mer hårvekst i ansikt, bryst eller mage enn det som er typisk for deg." },
      { n: "04", title: "Vansker med å bli gravid", desc: "Manglende eggløsning er en vanlig årsak til redusert fertilitet ved PMOS." },
      { n: "05", title: "Vektendringer", desc: "Vansker med å gå ned i vekt eller uventet vektøkning, særlig rundt midjen." },
      { n: "06", title: "Tretthet og humørsvingninger", desc: "Insulinresistens og hormonell ubalanse påvirker energi og psyke." },
    ],
    promises: standardPromises,
    related: [
      { title: "Fertilitetsutredning", desc: "Ønsker du barn? Vi utreder og behandler fertilitetsproblemer relatert til PMOS.", href: "/behandlinger/fertilitet" },
      { title: "Blødningsforstyrrelser", desc: "Uregelmessig menstruasjon er kjernesymptomet ved PMOS og kan behandles.", href: "/behandlinger/gynekologi/blodningsforstyrrelser" },
      { title: "PMS og PMDD", desc: "Hormonell ubalanse kan gi kraftige premenstruelle plager — som også kan lindres.", href: "/behandlinger/gynekologi/pms-pmdd" },
    ],
    ctaTitle: "Få en grundig PMOS-utredning",
    ctaDescription:
      "PMOS påvirker hele deg — derfor utreder vi hele deg. Bestill time for en samtale som tar utgangspunkt i din situasjon.",
  },

  /* ───────────────────────── VULVALIDELSER ───────────────────────── */
  vulvalidelser: {
    seoTitle: "Vulvalidelser | CMedical — spesialisert utredning",
    seoDescription:
      "Smerter og ubehag i vulva blir ofte oversett. Vi har spesialister som forstår — og finner svar.",
    canonical: "/behandlinger/gynekologi/vulvalidelser",
    parent,
    title: "Vulvalidelser og vulvodyni",
    heroTitle: <>Smertene er <span className="italic">ekte</span> — og de kan behandles</>,
    heroDescription:
      "Vulvodyni, lichen og kroniske vulvasmerter blir ofte avfeid eller oversett. Hos oss møter du spesialister som har erfaring med nettopp dette feltet.",
    heroPoints: [
      { title: "Spesialisert kompetanse", desc: "Få gynekologer jobber dypt med vulvalidelser. Vi gjør det." },
      { title: "Tid og forståelse", desc: "Vulvasmerter krever lange konsultasjoner — vi setter av tiden som trengs." },
      { title: "Bredt behandlingsspekter", desc: "Topisk behandling, fysioterapi, hormonell og medikamentell tilnærming." },
      { title: "Tverrfaglig støtte", desc: "Tilgang til bekkenbunnsfysioterapi og psykolog når smerter har stått lenge." },
    ],
    rating: "4,8 — Spesialister på kvinnehelse",
    booking: { ...baseBooking, tjeneste: "vulvalidelser" },
    primaryCtaLabel: "Bestill konsultasjon",
    flowTitle: "Slik utreder vi vulvalidelser",
    flow: [
      { n: "Steg 01", title: "Grundig samtale", desc: "Vi går gjennom smerteforløp, hva som utløser og hva som lindrer." },
      { n: "Steg 02", title: "Skånsom undersøkelse", desc: "Vi tar oss tid og bruker spesialiserte teknikker for ikke å forverre smerter." },
      { n: "Steg 03", title: "Diagnose", desc: "Vi forklarer tilstanden — vulvodyni, lichen sclerosus, lichen planus eller annet." },
      { n: "Steg 04", title: "Behandlingsplan", desc: "Tilpasset plan med medisinsk, fysioterapeutisk og psykologisk støtte ved behov." },
    ],
    reasonsTitle: "Tegn det er verdt å ta på alvor",
    reasonsLead:
      "Vulvalidelser er ofte usynlige for andre, men styrer hverdagen din. Disse symptomene fortjener spesialistvurdering.",
    reasons: [
      { n: "01", title: "Brennende eller stikkende smerter", desc: "Smerter i vulva uten åpenbar årsak — kan være vulvodyni." },
      { n: "02", title: "Smerter ved samleie", desc: "Smerter ved penetrasjon eller berøring kan ha mange årsaker — vi finner riktig en." },
      { n: "03", title: "Hvite flekker eller hudendringer", desc: "Lichen sclerosus gir karakteristiske hudendringer som krever spesifikk behandling." },
      { n: "04", title: "Kløe som ikke gir seg", desc: "Vedvarende kløe kan være tegn på lichen, eksem eller infeksjon — og må utredes." },
      { n: "05", title: "Sårhet og rødhet", desc: "Kronisk irritasjon krever en grundig vurdering for å finne årsaken." },
      { n: "06", title: "Smerter ved sittende eller sykling", desc: "Når daglige aktiviteter blir vanskelige — det er ikke noe å vente med." },
    ],
    promises: standardPromises,
    related: [
      { title: "Overgangsalder", desc: "Vulvaplager er vanlige i overgangsalderen og kan henge sammen med østrogenmangel.", href: "/behandlinger/gynekologi/overgangsalder" },
      { title: "Gynekologisk undersøkelse", desc: "Trenger du en grundig generell vurdering først? Start her.", href: "/behandlinger/gynekologi/undersokelse" },
      { title: "Labiaplastikk", desc: "Funksjonelle eller estetiske inngrep ved plager fra labia.", href: "/behandlinger/gynekologi/labiaplastikk" },
    ],
    ctaTitle: "Få spesialisert hjelp ved vulvaplager",
    ctaDescription:
      "Du trenger ikke kjempe alene med smerter ingen ser. Vi har erfaringen — og tiden.",
  },

  /* ───────────────────────── CELLEFORANDRINGER ───────────────────────── */
  celleforandringer: {
    seoTitle: "Celleforandringer | CMedical — oppfølging og konisering",
    seoDescription:
      "Trygg oppfølging og behandling av celleforandringer i livmorhalsen. Rask vurdering, klare svar.",
    canonical: "/behandlinger/gynekologi/celleforandringer",
    parent,
    title: "Celleforandringer",
    heroTitle: <>Et unormalt prøvesvar betyr <span className="italic">ikke</span> kreft</>,
    heroDescription:
      "Celleforandringer er vanlige og oftest ufarlige — men de skal følges opp. Hos oss får du rask kolposkopi og en tydelig plan, så slipper du å vente i uvisshet.",
    heroPoints: [
      { title: "Rask oppfølging", desc: "Du skal ikke vente i månedsvis på utredning av et unormalt prøvesvar." },
      { title: "Erfarne kolposkopister", desc: "Våre spesialister gjør hundrevis av kolposkopier årlig." },
      { title: "Konisering om nødvendig", desc: "Ved behov for fjerning av celleforandringer gjør vi det her — trygt og skånsomt." },
      { title: "Tett oppfølging etterpå", desc: "Vi følger deg opp inntil prøvesvarene er normale igjen." },
    ],
    rating: "4,8 — Spesialister på kvinnehelse",
    booking: { ...baseBooking, tjeneste: "celleforandringer" },
    primaryCtaLabel: "Bestill kolposkopi",
    flowTitle: "Slik følger vi opp celleforandringer",
    flow: [
      { n: "Steg 01", title: "Samtale", desc: "Vi går gjennom prøvesvar og forklarer hva de betyr." },
      { n: "Steg 02", title: "Kolposkopi", desc: "Forstørret undersøkelse av livmorhalsen — vi ser direkte hva som skjer." },
      { n: "Steg 03", title: "Biopsi om nødvendig", desc: "Liten vevsprøve som gir presist svar på alvorlighetsgrad." },
      { n: "Steg 04", title: "Plan eller behandling", desc: "Kontroll, oppfølging eller konisering — basert på funn." },
    ],
    reasonsTitle: "Når bør du komme til oss?",
    reasonsLead:
      "De fleste celleforandringer gir ingen symptomer og oppdages ved screening. Disse situasjonene tilsier rask vurdering.",
    reasons: [
      { n: "01", title: "Unormalt cytologisvar", desc: "ASC-US, LSIL, HSIL eller andre unormale svar bør følges opp." },
      { n: "02", title: "Positiv HPV-test", desc: "Vedvarende HPV-positiv prøve kan kreve nærmere utredning." },
      { n: "03", title: "Blødninger ved samleie", desc: "Postcoital blødning bør alltid undersøkes." },
      { n: "04", title: "Mellomblødninger", desc: "Blødning utenom mensen kan ha mange årsaker — også livmorhals." },
      { n: "05", title: "Tidligere konisering", desc: "Du trenger tett oppfølging i mange år etter et inngrep." },
      { n: "06", title: "Familiehistorikk", desc: "Hvis nær familie har hatt livmorhalskreft, kan du ønske ekstra trygghet." },
    ],
    promises: standardPromises,
    related: [
      { title: "Gynekologisk undersøkelse", desc: "Rutinekontroll og cellprøver gjøres ved samme besøk.", href: "/behandlinger/gynekologi/undersokelse" },
      { title: "Hysteroskopi", desc: "Inngrep i livmoren ved behov for vevsprøve eller fjerning av polypper.", href: "/behandlinger/gynekologi/kirurgi" },
      { title: "Blødningsforstyrrelser", desc: "Uvanlige blødninger må alltid utredes — vi finner årsaken.", href: "/behandlinger/gynekologi/blodningsforstyrrelser" },
    ],
    ctaTitle: "Få rask vurdering av celleforandringer",
    ctaDescription:
      "Du fortjener tydelige svar — ikke månedsvis i kø. Bestill kolposkopi i dag.",
  },

  /* ───────────────────────── PMS / PMDD ───────────────────────── */
  "pms-pmdd": {
    seoTitle: "PMS og PMDD | CMedical — utredning og behandling",
    seoDescription:
      "Når premenstruelle plager tar over livet ditt. Vi utreder og behandler PMS og PMDD med moderne kunnskap.",
    canonical: "/behandlinger/gynekologi/pms-pmdd",
    parent,
    title: "PMS og PMDD",
    heroTitle: <>Når menstruasjon tar over <span className="italic">halve livet</span></>,
    heroDescription:
      "PMDD er en alvorlig form for premenstruelt syndrom og rammer 3–8 % av kvinner. Hos oss møter du spesialister som tar plagene på alvor — og tilbyr moderne behandling.",
    heroPoints: [
      { title: "Moderne diagnostikk", desc: "Vi bruker validerte verktøy for å skille PMS fra PMDD og annen psykisk sykdom." },
      { title: "Riktig behandling", desc: "Hormonell, medikamentell og psykologisk behandling — i kombinasjon når det trengs." },
      { title: "Helhetlig vurdering", desc: "Vi ser også på søvn, livsstil og andre faktorer som forsterker plagene." },
      { title: "Tverrfaglig støtte", desc: "Tilgang til psykolog og ernæringsfysiolog når det er aktuelt." },
    ],
    rating: "4,8 — Spesialister på kvinnehelse",
    booking: { ...baseBooking, tjeneste: "pms-pmdd" },
    primaryCtaLabel: "Bestill utredning",
    flowTitle: "Slik utreder vi PMS og PMDD",
    flow: [
      { n: "Steg 01", title: "Symptomdagbok", desc: "Du fører dagbok over to sykluser — det er nøkkelen til riktig diagnose." },
      { n: "Steg 02", title: "Konsultasjon", desc: "Vi går gjennom dagbok og helhetlig livssituasjon sammen." },
      { n: "Steg 03", title: "Diagnose", desc: "PMS, PMDD eller annen tilstand — vi forklarer hva mønstrene betyr." },
      { n: "Steg 04", title: "Behandling", desc: "SSRI, hormonell behandling, livsstilsendringer eller kombinasjon — basert på dine plager." },
    ],
    reasonsTitle: "Når er det mer enn 'bare PMS'?",
    reasonsLead:
      "Forskjellen mellom PMS og PMDD ligger i alvorlighetsgrad og hvordan symptomene påvirker livet ditt. Disse tegnene tilsier utredning.",
    reasons: [
      { n: "01", title: "Kraftige humørsvingninger", desc: "Sinne, gråt eller fortvilelse i ukene før mensen — som forsvinner når mensen kommer." },
      { n: "02", title: "Angst og indre uro", desc: "Følelse av at ting tårner seg opp — kun i siste del av syklusen." },
      { n: "03", title: "Nedstemthet og håpløshet", desc: "Depressive tanker som kommer og går med syklusen." },
      { n: "04", title: "Konflikter i nære relasjoner", desc: "Plagene påvirker forhold til partner, barn eller kolleger." },
      { n: "05", title: "Søvnproblemer", desc: "Innsovning, oppvåkning eller mareritt forsterket av syklusen." },
      { n: "06", title: "Sykmeldinger eller fravær", desc: "Når plagene gjør at du ikke kan jobbe eller fungere normalt." },
    ],
    promises: standardPromises,
    related: [
      { title: "PMOS", desc: "Hormonell ubalanse kan forsterke premenstruelle plager.", href: "/behandlinger/gynekologi/pcos" },
      { title: "Fertilitet", desc: "Hormonelle svingninger og syklusforstyrrelser kan påvirke fertiliteten — vi utreder og behandler.", href: "/behandlinger/fertilitet" },
      { title: "Endometriose og adenomyose", desc: "Sterke menssmerter i tillegg til PMS bør utredes for endometriose.", href: "/behandlinger/gynekologi/endometriose" },
    ],
    ctaTitle: "Få en grundig PMS/PMDD-utredning",
    ctaDescription:
      "Du skal ikke føle at du mister deg selv hver måned. Vi har verktøyene som hjelper.",
  },

  /* ───────────────────────── VAGINALE FREMFALL ───────────────────────── */
  "vaginale-fremfall": {
    seoTitle: "Vaginale fremfall | CMedical — konservativ og kirurgisk behandling",
    seoDescription:
      "Utredning og behandling av vaginale fremfall — fra bekkenbunnsterapi til moderne kirurgi.",
    canonical: "/behandlinger/gynekologi/vaginale-fremfall",
    parent,
    title: "Vaginale fremfall",
    heroTitle: <>Det skal ikke kjennes som det <span className="italic">faller ut</span></>,
    heroDescription:
      "Vaginale fremfall rammer mange kvinner — særlig etter fødsel og i overgangsalderen. Vi tilbyr alt fra bekkenbunnsterapi til moderne kirurgi.",
    heroPoints: [
      { title: "Hele behandlingsspekteret", desc: "Konservative tiltak først, kirurgi når det trengs." },
      { title: "Erfarne kirurger", desc: "Våre spesialister har høy volum innen fremfallsoperasjoner." },
      { title: "Skånsomme teknikker", desc: "Vi bruker moderne, vevsbevarende teknikker — ofte robotassistert." },
      { title: "Helhetlig vurdering", desc: "Vi ser fremfall i sammenheng med blære, tarm og bekkenbunn." },
    ],
    rating: "4,7 — Spesialister på bekkenbunnshelse",
    booking: { ...baseBooking, tjeneste: "vaginale-fremfall" },
    primaryCtaLabel: "Bestill utredning",
    flowTitle: "Slik utreder og behandler vi",
    flow: [
      { n: "Steg 01", title: "Samtale", desc: "Vi går gjennom symptomer, fødselshistorie og hvordan det påvirker hverdagen." },
      { n: "Steg 02", title: "Undersøkelse", desc: "Klinisk undersøkelse av bekkenbunn, fremfallets type og grad." },
      { n: "Steg 03", title: "Behandlingsplan", desc: "Bekkenbunnstrening, pessar eller kirurgi — basert på grad og dine ønsker." },
      { n: "Steg 04", title: "Kirurgi om nødvendig", desc: "Skånsom rekonstruktiv kirurgi, ofte robotassistert, med rask restitusjon." },
    ],
    reasonsTitle: "Tegn på vaginale fremfall",
    reasonsLead:
      "Fremfall utvikler seg ofte gradvis. Disse symptomene tyder på at det er på tide å bli vurdert.",
    reasons: [
      { n: "01", title: "Tyngdefornemmelse i underlivet", desc: "Følelsen av at noe trykker eller faller ned, særlig sent på dagen." },
      { n: "02", title: "Synlig eller følbart fremfall", desc: "Du kan kjenne eller se en utbuling i skjeden." },
      { n: "03", title: "Vansker med vannlating", desc: "Lekkasje, hyppig trang eller dårlig blæretømming." },
      { n: "04", title: "Tarmbesvær", desc: "Vansker med å tømme tarmen eller følelse av ufullstendig tømming." },
      { n: "05", title: "Smerter ved samleie", desc: "Fremfall kan gi ubehag eller smerter ved penetrasjon." },
      { n: "06", title: "Etter fødsel eller overgangsalder", desc: "De vanligste utløsende faktorene — men ikke uunngåelige plager." },
    ],
    promises: standardPromises,
    related: [
      { title: "Urinlekkasje", desc: "Fremfall og urinlekkasje opptrer ofte sammen og kan behandles parallelt.", href: "/behandlinger/gynekologi/urinlekkasje" },
      { title: "Robotassistert kirurgi", desc: "Moderne kirurgi for komplekse fremfall — kortere innleggelse og raskere restitusjon.", href: "/behandlinger/gynekologi/robotkirurgi" },
      { title: "Overgangsalder", desc: "Hormonelle endringer påvirker vevsstøtte — vi vurderer helheten.", href: "/behandlinger/gynekologi/overgangsalder" },
    ],
    ctaTitle: "Bestill vurdering av fremfall",
    ctaDescription:
      "Du skal ikke organisere livet rundt plagene. Vi har løsningene som gir deg friheten tilbake.",
  },

  /* ───────────────────────── CYSTER ───────────────────────── */
  cyster: {
    seoTitle: "Cyster på eggstokkene | CMedical",
    seoDescription:
      "Utredning og behandling av cyster på eggstokkene — fra observasjon til skånsom kirurgi.",
    canonical: "/behandlinger/gynekologi/cyster",
    parent,
    title: "Cyster på eggstokkene",
    heroTitle: <>De fleste cyster er <span className="italic">ufarlige</span> — men noen må følges</>,
    heroDescription:
      "Cyster på eggstokkene er svært vanlig og oftest godartede. Vi gir deg en grundig vurdering og en plan — så slipper du å gå med uvisshet.",
    heroPoints: [
      { title: "Avansert ultralyd", desc: "Høyoppløselig vaginal ultralyd som kan vurdere cystens karakter presist." },
      { title: "Type-spesifikk vurdering", desc: "Funksjonelle cyster, dermoide cyster, endometriomer — vi skiller dem." },
      { title: "Trygg oppfølging", desc: "Vi kontrollerer ved behov og opererer kun når det er nødvendig." },
      { title: "Skånsom kirurgi", desc: "Kikkhullskirurgi når operasjon trengs — med fokus på å bevare eggstokkfunksjon." },
    ],
    rating: "4,8 — Spesialister på kvinnehelse",
    booking: { ...baseBooking, tjeneste: "cyster" },
    primaryCtaLabel: "Bestill ultralyd",
    flowTitle: "Slik utreder vi cyster",
    flow: [
      { n: "Steg 01", title: "Samtale", desc: "Vi går gjennom symptomer, syklus og eventuelle tidligere funn." },
      { n: "Steg 02", title: "Ultralyd", desc: "Detaljert vaginal ultralyd som vurderer størrelse og karakter." },
      { n: "Steg 03", title: "Plan", desc: "Observasjon, hormonell behandling eller kirurgi — basert på funn." },
      { n: "Steg 04", title: "Kontroll eller inngrep", desc: "Tett oppfølging eller skånsom kikkhullskirurgi om det trengs." },
    ],
    reasonsTitle: "Når bør cyster vurderes?",
    reasonsLead:
      "Mange cyster gir ingen symptomer og oppdages tilfeldig. Disse situasjonene tilsier at du bør bli sett.",
    reasons: [
      { n: "01", title: "Smerter i nedre del av magen", desc: "Vedvarende eller tilbakevendende smerter på den ene siden." },
      { n: "02", title: "Plutselige, kraftige smerter", desc: "Akutte smerter kan tyde på sprukket eller tvistet cyste — søk hjelp raskt." },
      { n: "03", title: "Tyngdefornemmelse", desc: "Følelse av oppfylling eller trykk i bekkenet." },
      { n: "04", title: "Endret menstruasjon", desc: "Uregelmessig syklus eller endrede blødninger kan henge sammen." },
      { n: "05", title: "Cyster oppdaget ved annen undersøkelse", desc: "Tilfeldig funn bør vurderes av spesialist for å avklare karakter." },
      { n: "06", title: "Familiehistorikk", desc: "Ved kjent familiær risiko for eggstokkreft anbefales tett oppfølging." },
    ],
    promises: standardPromises,
    related: [
      { title: "Endometriose", desc: "Endometriomer (sjokoladecyster) er en form for endometriose med egne behandlingsbehov.", href: "/behandlinger/gynekologi/endometriose" },
      { title: "PMOS", desc: "Mange små cyster på eggstokkene kan være tegn på PMOS.", href: "/behandlinger/gynekologi/pcos" },
      { title: "Robotassistert kirurgi", desc: "Skånsom kirurgi for komplekse eller store cyster.", href: "/behandlinger/gynekologi/robotkirurgi" },
    ],
    ctaTitle: "Få vurdert en cyste hos spesialist",
    ctaDescription:
      "Klare svar i stedet for uvisshet. Vi gir deg en presis vurdering og en konkret plan.",
  },

  /* ───────────────────────── ROBOTKIRURGI ───────────────────────── */
  robotkirurgi: {
    seoTitle: "Robotassistert kirurgi | CMedical",
    seoDescription:
      "Avansert minimalt invasiv kirurgi for komplekse gynekologiske inngrep — kortere innleggelse, raskere restitusjon.",
    canonical: "/behandlinger/gynekologi/robotkirurgi",
    parent,
    title: "Robotassistert kirurgi",
    heroTitle: <>Avansert kirurgi — <span className="italic">skånsomt</span> utført</>,
    heroDescription:
      "Robotassistert kirurgi gir kirurgen presisjon utover det som er mulig med tradisjonell kikkhullskirurgi. Resultat: mindre arr, mindre smerter og raskere restitusjon.",
    heroPoints: [
      { title: "Erfarne robotkirurger", desc: "Våre spesialister gjør dette ofte — erfaring er avgjørende for utfall." },
      { title: "Minimalt invasivt", desc: "Små snitt, lite blødning, mindre smerte etterpå." },
      { title: "Kort innleggelse", desc: "De fleste reiser hjem samme dag eller dagen etter." },
      { title: "Rask retur til hverdagen", desc: "Du er tilbake til vanlige aktiviteter raskere enn ved åpen kirurgi." },
    ],
    rating: "4,8 — Spesialister på avansert kirurgi",
    booking: { ...baseBooking, tjeneste: "robotkirurgi" },
    primaryCtaLabel: "Bestill konsultasjon",
    flowTitle: "Slik gjennomfører vi robotkirurgi",
    flow: [
      { n: "Steg 01", title: "Konsultasjon", desc: "Vurdering av om robotassistert kirurgi er rett valg for deg." },
      { n: "Steg 02", title: "Planlegging", desc: "Vi går gjennom inngrepet, forberedelser og hva du kan forvente etterpå." },
      { n: "Steg 03", title: "Inngrepet", desc: "Operasjonen gjennomføres i full narkose med kirurgen ved roboten." },
      { n: "Steg 04", title: "Oppfølging", desc: "Tett oppfølging hjemme, kontroll på klinikken og full støtte underveis." },
    ],
    reasonsTitle: "Når brukes robotassistert kirurgi?",
    reasonsLead:
      "Robotteknologi egner seg særlig for komplekse inngrep der presisjon er avgjørende.",
    reasons: [
      { n: "01", title: "Dyp endometriose", desc: "Komplekse endometrioseinngrep krever maksimal presisjon." },
      { n: "02", title: "Fjerning av livmor", desc: "Hysterektomi gjøres skånsomt og presist med robot." },
      { n: "03", title: "Store myomer", desc: "Bevarende kirurgi (myomektomi) ved fertilitetsønske." },
      { n: "04", title: "Komplekse fremfall", desc: "Sakrokolpopeksi og andre rekonstruktive inngrep." },
      { n: "05", title: "Cyster og svulster", desc: "Bevarende kirurgi på eggstokker når det er mulig." },
      { n: "06", title: "Tidligere kompleks kirurgi", desc: "Når sammenvoksinger gjør tradisjonell kikkhullskirurgi vanskelig." },
    ],
    promises: standardPromises,
    related: [
      { title: "Endometriose", desc: "Avansert endometriosekirurgi — også de kompliserte tilfellene.", href: "/behandlinger/gynekologi/endometriose" },
      { title: "Fjerne livmor", desc: "Hysterektomi gjort med moderne, skånsomme teknikker.", href: "/behandlinger/gynekologi/fjerne-livmor" },
      { title: "Vaginale fremfall", desc: "Rekonstruktiv kirurgi for komplekse fremfall.", href: "/behandlinger/gynekologi/vaginale-fremfall" },
    ],
    ctaTitle: "Bestill konsultasjon om robotkirurgi",
    ctaDescription:
      "Få vurdert om avansert robotkirurgi er rett vei for deg — av en spesialist som gjør dette ofte.",
  },

  /* ───────────────────────── KIRURGI / HYSTEROSKOPI ───────────────────────── */
  kirurgi: {
    seoTitle: "Hysteroskopi | CMedical — inngrep i livmoren",
    seoDescription:
      "Hysteroskopi er en skånsom undersøkelse og behandling i livmoren — uten snitt, ofte uten innleggelse.",
    canonical: "/behandlinger/gynekologi/kirurgi",
    parent,
    title: "Hysteroskopi",
    heroTitle: <>Inn i livmoren — <span className="italic">uten snitt</span></>,
    heroDescription:
      "Hysteroskopi er en skånsom teknikk der vi ser direkte inn i livmoren med et tynt kamera. Vi kan undersøke, ta vevsprøver og fjerne polypper i samme inngrep.",
    heroPoints: [
      { title: "Ingen snitt", desc: "Inngrepet gjøres gjennom skjeden — ingen ytre arr." },
      { title: "Rask gjennomføring", desc: "De fleste inngrep tar 15–30 minutter." },
      { title: "Kort restitusjon", desc: "De fleste reiser hjem samme dag og er tilbake i hverdagen raskt." },
      { title: "Diagnose og behandling samtidig", desc: "Vi kan ofte fjerne det vi finner i samme inngrep." },
    ],
    rating: "4,8 — Spesialister på kvinnehelse",
    booking: { ...baseBooking, tjeneste: "hysteroskopi" },
    primaryCtaLabel: "Bestill konsultasjon",
    flowTitle: "Slik gjennomføres hysteroskopi",
    flow: [
      { n: "Steg 01", title: "Konsultasjon", desc: "Vi vurderer indikasjon og forklarer inngrepet i detalj." },
      { n: "Steg 02", title: "Forberedelser", desc: "Enkle forberedelser og smertelindring tilpasset deg." },
      { n: "Steg 03", title: "Inngrepet", desc: "Hysteroskopi i lokalbedøvelse eller kort narkose, etter behov." },
      { n: "Steg 04", title: "Etterpå", desc: "Kort observasjon, så hjem. Kontroll og prøvesvar i etterkant." },
    ],
    reasonsTitle: "Når kan hysteroskopi være aktuelt?",
    reasonsLead:
      "Hysteroskopi brukes både til diagnostikk og behandling av flere tilstander i livmoren.",
    reasons: [
      { n: "01", title: "Polypper i livmoren", desc: "Polypper kan gi blødninger og fertilitetsproblemer — og fjernes enkelt." },
      { n: "02", title: "Myomer i livmorhulen", desc: "Submukøse myomer kan fjernes uten åpen kirurgi." },
      { n: "03", title: "Uregelmessige eller kraftige blødninger", desc: "For å finne årsak til vedvarende blødningsforstyrrelser." },
      { n: "04", title: "Postmenopausal blødning", desc: "Blødning etter overgangsalderen må alltid utredes." },
      { n: "05", title: "Fertilitetsutredning", desc: "Vurdering av livmorhulen som del av fertilitetsutredning." },
      { n: "06", title: "Sammenvoksinger", desc: "Asherman syndrom og andre intrauterine sammenvoksinger." },
    ],
    promises: standardPromises,
    related: [
      { title: "Blødningsforstyrrelser", desc: "Hysteroskopi er ofte nøkkelen til å finne årsaken til unormale blødninger.", href: "/behandlinger/gynekologi/blodningsforstyrrelser" },
      { title: "Celleforandringer", desc: "Vurdering av livmorhalsen og endometriet ved patologiske prøvesvar.", href: "/behandlinger/gynekologi/celleforandringer" },
      { title: "Robotassistert kirurgi", desc: "Når større kirurgi er aktuelt — vi tilbyr hele spekteret.", href: "/behandlinger/gynekologi/robotkirurgi" },
    ],
    ctaTitle: "Bestill vurdering for hysteroskopi",
    ctaDescription:
      "Et lite inngrep med store muligheter — vi gir deg en konkret plan etter første konsultasjon.",
  },

  /* ───────────────────────── FJERNE LIVMOR ───────────────────────── */
  "fjerne-livmor": {
    seoTitle: "Fjerne livmor | CMedical — planlagt kirurgi",
    seoDescription:
      "Hysterektomi gjort med moderne, skånsomme teknikker av erfarne spesialister.",
    canonical: "/behandlinger/gynekologi/fjerne-livmor",
    parent,
    title: "Fjerne livmor",
    heroTitle: <>En <span className="italic">stor</span> beslutning — gjort så <span className="italic">skånsomt</span> som mulig</>,
    heroDescription:
      "Når livmoren skal fjernes, skal det gjøres med best mulig teknikk og av erfarne hender. Vi gir deg tid til samtalen og tilbyr moderne, minimalt invasive metoder.",
    heroPoints: [
      { title: "Tid til samtalen", desc: "Vi går grundig gjennom alternativer, risikoer og hva inngrepet betyr for deg." },
      { title: "Moderne teknikker", desc: "Ofte robotassistert eller laparoskopisk — minimalt invasivt." },
      { title: "Erfarne kirurger", desc: "Våre spesialister gjør hysterektomier ofte — erfaring betyr mye." },
      { title: "Helhetlig oppfølging", desc: "Tett oppfølging både fysisk og psykisk — også etter inngrepet." },
    ],
    rating: "4,8 — Spesialister på avansert kirurgi",
    booking: { ...baseBooking, tjeneste: "hysterektomi" },
    primaryCtaLabel: "Bestill konsultasjon",
    flowTitle: "Slik gjennomføres hysterektomi hos oss",
    flow: [
      { n: "Steg 01", title: "Grundig konsultasjon", desc: "Vi går gjennom indikasjon, alternativer og hvilken teknikk som passer for deg." },
      { n: "Steg 02", title: "Planlegging", desc: "Forundersøkelser, narkosesamtale og forberedelser til inngrepet." },
      { n: "Steg 03", title: "Operasjonen", desc: "Inngrepet utføres som regel med robot eller kikkhullskirurgi." },
      { n: "Steg 04", title: "Restitusjon", desc: "Tett oppfølging hjemme og kontroll på klinikken." },
    ],
    reasonsTitle: "Når kan hysterektomi være aktuelt?",
    reasonsLead:
      "Hysterektomi vurderes når andre behandlinger ikke fungerer eller er uaktuelle. Beslutningen tas alltid i samråd med deg.",
    reasons: [
      { n: "01", title: "Store myomer med plager", desc: "Når myomer gir kraftige blødninger eller trykk uten respons på annen behandling." },
      { n: "02", title: "Vedvarende blødningsforstyrrelser", desc: "Uregjerlige blødninger som ikke responderer på medisinsk behandling." },
      { n: "03", title: "Adenomyose", desc: "Smertefull tilstand som kan kreve hysterektomi i alvorlige tilfeller." },
      { n: "04", title: "Endometriose", desc: "I utvalgte tilfeller — særlig kombinert med annen patologi." },
      { n: "05", title: "Vaginalt fremfall", desc: "Som del av rekonstruktiv kirurgi ved alvorlig livmorfremfall." },
      { n: "06", title: "Forstadier til kreft", desc: "Endometriehyperplasi med atypi eller andre høyrisikofunn." },
    ],
    promises: standardPromises,
    related: [
      { title: "Robotassistert kirurgi", desc: "Den vanligste teknikken vi bruker for hysterektomi i dag.", href: "/behandlinger/gynekologi/robotkirurgi" },
      { title: "Vaginale fremfall", desc: "Ofte gjort i kombinasjon med rekonstruktiv kirurgi for fremfall.", href: "/behandlinger/gynekologi/vaginale-fremfall" },
      { title: "Blødningsforstyrrelser", desc: "Mange alternativer finnes — hysterektomi er sjelden første valg.", href: "/behandlinger/gynekologi/blodningsforstyrrelser" },
    ],
    ctaTitle: "Bestill samtale om hysterektomi",
    ctaDescription:
      "En god beslutning krever god informasjon. Vi tar oss tiden som trengs.",
  },

  /* ───────────────────────── LABIAPLASTIKK ───────────────────────── */
  labiaplastikk: {
    seoTitle: "Labiaplastikk | CMedical — estetisk og funksjonell",
    seoDescription:
      "Labiaplastikk for funksjonelle eller estetiske plager — utført av erfarne gynekologer i trygge omgivelser.",
    canonical: "/behandlinger/gynekologi/labiaplastikk",
    parent,
    title: "Labiaplastikk",
    heroTitle: <>Når funksjon og <span className="italic">komfort</span> betyr alt</>,
    heroDescription:
      "Labiaplastikk gjøres både av funksjonelle grunner — gnag, smerter, ubehag — og av estetiske ønsker. Vi tar oss tid til samtalen og gir deg en realistisk vurdering.",
    heroPoints: [
      { title: "Erfarne gynekologer", desc: "Inngrepet utføres av spesialister med høy volum og erfaring." },
      { title: "Realistisk samtale", desc: "Vi snakker om motivasjon, forventninger og hva som faktisk er mulig." },
      { title: "Skånsom teknikk", desc: "Moderne metoder gir presise resultater og god heling." },
      { title: "Trygge rammer", desc: "Inngrepet gjøres i klinikkens egne sterile operasjonsstuer." },
    ],
    rating: "4,8 — Spesialister på kvinnehelse",
    booking: { ...baseBooking, tjeneste: "labiaplastikk" },
    primaryCtaLabel: "Bestill konsultasjon",
    flowTitle: "Slik gjennomføres labiaplastikk",
    flow: [
      { n: "Steg 01", title: "Konsultasjon", desc: "Vi går gjennom motivasjon, ønsker og hva inngrepet kan og ikke kan oppnå." },
      { n: "Steg 02", title: "Planlegging", desc: "Vi planlegger teknikk, smertelindring og hva du må forberede." },
      { n: "Steg 03", title: "Inngrepet", desc: "Utføres i lokalbedøvelse eller kort narkose, etter behov." },
      { n: "Steg 04", title: "Heling og oppfølging", desc: "Tett oppfølging i helingsperioden og kontroll etter 6 uker." },
    ],
    reasonsTitle: "Når vurderes labiaplastikk?",
    reasonsLead:
      "Mange opplever plager med store eller asymmetriske labia. Det er grunner som tas på alvor.",
    reasons: [
      { n: "01", title: "Gnag og irritasjon", desc: "Daglig ubehag fra klær, sport eller sykling." },
      { n: "02", title: "Smerter ved samleie", desc: "Når labia kommer i veien eller gjør samleie ubehagelig." },
      { n: "03", title: "Hygieneutfordringer", desc: "Vansker med hygiene som gir tilbakevendende infeksjoner eller plager." },
      { n: "04", title: "Asymmetri", desc: "Ujevnhet som påvirker komfort eller selvbilde." },
      { n: "05", title: "Etter fødsel", desc: "Endringer etter fødsel som ikke har gått tilbake." },
      { n: "06", title: "Estetiske ønsker", desc: "Ønske om endring av utseende — også gyldig grunn." },
    ],
    promises: standardPromises,
    related: [
      { title: "Vulvalidelser", desc: "Smerter i vulva har ofte andre årsaker enn anatomi — vi utreder bredt.", href: "/behandlinger/gynekologi/vulvalidelser" },
      { title: "Gynekologisk undersøkelse", desc: "En grundig generell vurdering først er ofte god start.", href: "/behandlinger/gynekologi/undersokelse" },
      { title: "Overgangsalder", desc: "Hormonelle endringer kan påvirke vev — også vurdert i samtale.", href: "/behandlinger/gynekologi/overgangsalder" },
    ],
    ctaTitle: "Bestill informasjonssamtale",
    ctaDescription:
      "Få en grundig, ærlig vurdering — uten press. Du bestemmer veien videre.",
  },

  /* ───────────────────────── BLØDNINGSFORSTYRRELSER ───────────────────────── */
  blodningsforstyrrelser: {
    seoTitle: "Blødningsforstyrrelser | CMedical",
    seoDescription:
      "Kraftige, langvarige eller uregelmessige blødninger? Vi finner årsaken og gir deg en plan.",
    canonical: "/behandlinger/gynekologi/blodningsforstyrrelser",
    parent,
    title: "Blødningsforstyrrelser",
    heroTitle: <>Mensen skal ikke <span className="italic">styre</span> livet ditt</>,
    heroDescription:
      "Kraftige, langvarige eller uregelmessige blødninger har nesten alltid en årsak — og oftest en behandling. Vi utreder grundig og finner det som passer deg.",
    heroPoints: [
      { title: "Grundig utredning", desc: "Hormonprøver, ultralyd og hysteroskopi når det trengs." },
      { title: "Bredt behandlingsspekter", desc: "Hormonell, medikamentell, hysteroskopisk eller kirurgisk — basert på årsak." },
      { title: "Erfarne spesialister", desc: "Vi har sett alt — og finner riktig løsning for deg." },
      { title: "Rask handling", desc: "Du skal ikke vente i månedsvis på utredning av plager som tar over hverdagen." },
    ],
    rating: "4,8 — Spesialister på kvinnehelse",
    booking: { ...baseBooking, tjeneste: "blodningsforstyrrelser" },
    primaryCtaLabel: "Bestill utredning",
    flowTitle: "Slik utreder vi blødningsforstyrrelser",
    flow: [
      { n: "Steg 01", title: "Samtale", desc: "Vi går gjennom mønster, varighet, mengde og påvirkning på hverdagen." },
      { n: "Steg 02", title: "Undersøkelse", desc: "Klinisk undersøkelse, ultralyd og blodprøver." },
      { n: "Steg 03", title: "Diagnose", desc: "Vi forklarer hva vi finner — myomer, polypper, hormonell ubalanse, adenomyose eller annet." },
      { n: "Steg 04", title: "Behandling", desc: "Tilpasset plan: medisinsk, hormonell, hysteroskopisk eller kirurgisk." },
    ],
    reasonsTitle: "Når bør du komme til oss?",
    reasonsLead:
      "Det finnes ingen «normalt» som må passe alle. Disse mønstrene fortjener spesialistvurdering.",
    reasons: [
      { n: "01", title: "Kraftige blødninger", desc: "Når du må bytte bind eller tampong hver time, eller bruker dobbel beskyttelse." },
      { n: "02", title: "Lange blødninger", desc: "Mens som varer mer enn 7 dager — gjerne med klumper og smerter." },
      { n: "03", title: "Uregelmessig syklus", desc: "Sykluser kortere enn 21 eller lengre enn 35 dager — eller helt uforutsigbare." },
      { n: "04", title: "Mellomblødninger", desc: "Blødning utenom mens, særlig postcoitalt, må alltid utredes." },
      { n: "05", title: "Postmenopausal blødning", desc: "All blødning etter overgangsalderen skal undersøkes — uten unntak." },
      { n: "06", title: "Anemi eller utmattelse", desc: "Hvis kraftige blødninger gir lavt jern, må årsaken finnes og behandles." },
    ],
    promises: standardPromises,
    related: [
      { title: "Hysteroskopi", desc: "Direkte undersøkelse og behandling av polypper og myomer i livmoren.", href: "/behandlinger/gynekologi/kirurgi" },
      { title: "Endometriose", desc: "Endometriose kan gi kraftige og smertefulle blødninger — det utredes parallelt.", href: "/behandlinger/gynekologi/endometriose" },
      { title: "Celleforandringer", desc: "Mellomblødninger og postcoital blødning krever vurdering av livmorhalsen.", href: "/behandlinger/gynekologi/celleforandringer" },
    ],
    ctaTitle: "Få utredet blødningsforstyrrelser",
    ctaDescription:
      "Du skal ikke organisere livet rundt mensen. Vi finner årsaken — og en plan som virker.",
  },

  /* ───────────────────────── HYSTEROSKOPI ───────────────────────── */
  hysteroskopi: {
    seoTitle: "Hysteroskopi | CMedical — kikkhullsundersøkelse av livmoren",
    seoDescription:
      "Hysteroskopi er en presis kikkhullsundersøkelse av livmorhulen — for utredning og behandling av polypper, myomer og blødningsforstyrrelser.",
    canonical: "/behandlinger/gynekologi/hysteroskopi",
    parent,
    title: "Hysteroskopi",
    heroTitle: <>Et lite <span className="italic">kikkhull</span> — store svar</>,
    heroDescription:
      "Hysteroskopi lar oss se rett inn i livmorhulen og ofte behandle samme dag. Et skånsomt inngrep som gir presise svar når blødninger, polypper eller fertilitetsutfordringer skal utredes.",
    heroPoints: [
      { title: "Skånsomt og presist", desc: "Tynt kamera føres inn naturlig vei — ingen snitt, kort restitusjon." },
      { title: "Se og behandle samtidig", desc: "Polypper og små myomer kan fjernes i samme inngrep." },
      { title: "Erfarne hender", desc: "Våre gynekologer utfører hysteroskopi rutinemessig." },
      { title: "Trygge rammer", desc: "Utføres i klinikkens egne moderne operasjonsstuer." },
    ],
    rating: "4,8 — Spesialister på kvinnehelse",
    booking: { ...baseBooking, tjeneste: "hysteroskopi" },
    primaryCtaLabel: "Bestill konsultasjon",
    flowTitle: "Slik gjennomføres hysteroskopi",
    flow: [
      { n: "Steg 01", title: "Konsultasjon", desc: "Vi går gjennom symptomer, tidligere funn og hva du kan forvente." },
      { n: "Steg 02", title: "Forberedelse", desc: "Enkel forberedelse — tidspunkt i syklus avtales individuelt." },
      { n: "Steg 03", title: "Inngrepet", desc: "Selve undersøkelsen tar 10–30 minutter, ofte uten narkose." },
      { n: "Steg 04", title: "Svar og plan", desc: "Du får tilbakemelding samme dag og en plan videre." },
    ],
    reasonsTitle: "Når er hysteroskopi aktuelt?",
    reasonsLead: "Hysteroskopi brukes både til utredning og behandling.",
    reasons: [
      { n: "01", title: "Kraftige eller uregelmessige blødninger", desc: "For å finne årsaken når andre undersøkelser ikke gir svar." },
      { n: "02", title: "Polypper i livmoren", desc: "Polypper kan ofte fjernes direkte i samme inngrep." },
      { n: "03", title: "Myomer i livmorhulen", desc: "Submukøse myomer kan behandles hysteroskopisk." },
      { n: "04", title: "Gjentatte spontanaborter", desc: "Vurdering av livmorhulen som del av utredning." },
      { n: "05", title: "Fertilitetsutredning", desc: "Vurdering av livmorhulen før eller mellom behandlingsforsøk." },
      { n: "06", title: "Sammenvoksninger", desc: "Diagnostisering og løsning av arrvev etter tidligere inngrep." },
    ],
    promises: standardPromises,
    related: [
      { title: "Blødningsforstyrrelser", desc: "Hysteroskopi er ofte sentralt i utredningen.", href: "/behandlinger/gynekologi/blodningsforstyrrelser" },
      { title: "Gynekologisk kirurgi", desc: "Når mer omfattende inngrep er aktuelt.", href: "/behandlinger/gynekologi/kirurgi" },
      { title: "Gynekologisk undersøkelse", desc: "Ofte første steg før hysteroskopi.", href: "/behandlinger/gynekologi/undersokelse" },
    ],
    ctaTitle: "Bestill vurdering for hysteroskopi",
    ctaDescription: "Et lite inngrep med store muligheter — du får en konkret plan etter første konsultasjon.",
  },

  /* ───────────────────────── FOSTERMEDISIN ───────────────────────── */
  fostermedisin: {
    seoTitle: "Fostermedisin | CMedical — ultralyd og fosterdiagnostikk",
    seoDescription:
      "Avansert fostermedisin og ultralyd hos erfarne spesialister. Tidlig ultralyd, NIPT, tilvekstkontroll og fosterdiagnostikk.",
    canonical: "/behandlinger/gynekologi/fostermedisin",
    parent,
    title: "Fostermedisin",
    heroTitle: <>Trygghet gjennom <span className="italic">hele</span> svangerskapet</>,
    heroDescription:
      "Vi tilbyr avansert ultralyd og fosterdiagnostikk hos spesialister som gjør dette daglig — fra tidlig ultralyd til tilvekstkontroller og målrettede undersøkelser.",
    heroPoints: [
      { title: "Erfarne fostermedisinere", desc: "Spesialister med dedikert fostermedisinsk kompetanse." },
      { title: "Moderne ultralydutstyr", desc: "Høy bildekvalitet for trygge vurderinger." },
      { title: "Tid til samtalen", desc: "Du får forklart funnene grundig og forståelig." },
      { title: "Helhetlig oppfølging", desc: "Sømløs videre vurdering ved behov." },
    ],
    rating: "4,8 — Spesialister på kvinnehelse",
    booking: { ...baseBooking, tjeneste: "fostermedisin" },
    primaryCtaLabel: "Bestill ultralyd",
    flowTitle: "Hva du kan forvente",
    flow: [
      { n: "Steg 01", title: "Innsjekk", desc: "Kort samtale om svangerskapet og hva du ønsker undersøkt." },
      { n: "Steg 02", title: "Ultralyd", desc: "Grundig undersøkelse med tid til å se og forklare." },
      { n: "Steg 03", title: "Gjennomgang", desc: "Vi går gjennom funnene og hva de betyr." },
      { n: "Steg 04", title: "Videre plan", desc: "Eventuelle kontroller eller henvisninger avtales." },
    ],
    reasonsTitle: "Om fostermedisin",
    reasonsLead: "Hos oss møter du høyt kompetente, erfarne og dedikerte gynekologer med spesialisering innen fostermedisin, også kalt fostermedisinere. Deres kompetanse er din trygghet. Fostermedisin handler om fosterets helse og utvikling gjennom svangerskapet, og hos oss innebærer det tidlig ultralyd, NIPT og fosterdiagnostikk hos spesialist.",
    reasons: [
      { n: "01", title: "Tidlig ultralyd", desc: "Vi skiller mellom tidlig ultralyd uke 6–10, uke 11–14, og ultralyd fra uke 14+0. Tidlig ultralyd uke 6–10 utføres ved hjelp av en innvendig probe. Dette er helt ufarlig og smertefritt for både barnet og deg." },
      { n: "02", title: "Fosterdiagnostikk", desc: "Dr. Ashi Ahmad har fått virksomhetsgodkjenning for å tilby fosterdiagnostikk til gravide kvinner. Ashi Ahmad er spesialist i gynekologi og fødselshjelp og har doktorgrad i epidemiologi og fødselshjelp." },
    ],
    promises: standardPromises,
    related: [
      { title: "Graviditet", desc: "Oppfølging gjennom hele svangerskapet.", href: "/behandlinger/gynekologi/graviditet" },
      { title: "Fødselsskader", desc: "Vurdering og oppfølging etter fødsel.", href: "/behandlinger/gynekologi/fodselsskader" },
    ],
    ctaTitle: "Bestill fostermedisinsk vurdering",
    ctaDescription: "Trygghet og tid — hos spesialister som ser mye.",
  },

  /* ───────────────────────── FØDSELSSKADER ───────────────────────── */
  fodselsskader: {
    seoTitle: "Fødselsskader | CMedical — utredning og behandling",
    seoDescription:
      "Plager etter fødsel skal tas på alvor. Vi har et dedikert ekspertteam for fødselsskader — fra utredning til kirurgi.",
    canonical: "/behandlinger/gynekologi/fodselsskader",
    parent,
    title: "Fødselsskader",
    heroTitle: <>Det skal være <span className="italic">lov</span> å ha plager etter fødsel</>,
    heroDescription:
      "Mange opplever plager etter fødsel som aldri ble tatt tak i. Vi har et dedikert team for utredning og behandling — inkludert fremfall, urinlekkasje og smerter.",
    heroPoints: [
      { title: "Dedikert ekspertteam", desc: "Tverrfaglig team som jobber spesifikt med fødselsskader." },
      { title: "Helhetlig vurdering", desc: "Fysisk, funksjonelt og psykisk — alt henger sammen." },
      { title: "Hele behandlingsspekteret", desc: "Fysioterapi, medisinsk og kirurgisk behandling." },
      { title: "Ingen plager er for små", desc: "Du fortjener å bli hørt — uansett hvor lang tid det har gått." },
    ],
    rating: "4,8 — Spesialister på kvinnehelse",
    booking: { ...baseBooking, tjeneste: "fodselsskader" },
    primaryCtaLabel: "Bestill vurdering",
    flowTitle: "Slik utreder vi fødselsskader",
    flow: [
      { n: "Steg 01", title: "Samtale", desc: "Vi går gjennom fødselen, plagene og hvordan de påvirker hverdagen." },
      { n: "Steg 02", title: "Undersøkelse", desc: "Grundig klinisk undersøkelse og ultralyd ved behov." },
      { n: "Steg 03", title: "Plan", desc: "En konkret behandlingsplan — alene eller i tverrfaglig team." },
      { n: "Steg 04", title: "Behandling", desc: "Konservativ behandling eller kirurgi, tilpasset deg." },
    ],
    reasonsTitle: "Når bør du komme?",
    reasonsLead: "Det er aldri for sent å få hjelp med fødselsskader.",
    reasons: [
      { n: "01", title: "Urinlekkasje", desc: "Ved hosting, trening eller plutselig vannlatingstrang." },
      { n: "02", title: "Fremfall", desc: "Tyngdefølelse eller noe som «kommer ned» i underlivet." },
      { n: "03", title: "Smerter ved samleie", desc: "Vedvarende smerter etter fødsel som ikke har gått tilbake." },
      { n: "04", title: "Avføringsproblemer", desc: "Lekkasje, hastverk eller manglende kontroll." },
      { n: "05", title: "Arrproblemer", desc: "Smertefulle eller stramme arr etter klipp eller rifter." },
      { n: "06", title: "Bekkenbunnsplager", desc: "Svakhet eller manglende kontakt med bekkenbunnen." },
    ],
    promises: standardPromises,
    related: [
      { title: "Vaginale fremfall", desc: "Utredning og behandling av livmor- og skjedefremfall.", href: "/behandlinger/gynekologi/vaginale-fremfall" },
      { title: "Urinlekkasje", desc: "Dedikert utredning av lekkasjeproblematikk.", href: "/behandlinger/gynekologi/urinlekkasje" },
      { title: "Graviditet", desc: "Oppfølging og 6-ukerskontroll etter fødsel.", href: "/behandlinger/gynekologi/graviditet" },
    ],
    ctaTitle: "Få hjelp med fødselsskader",
    ctaDescription: "Det er aldri for sent. Vi tar plagene dine på alvor.",
  },

  /* ───────────────────────── GRAVIDITET ───────────────────────── */
  graviditet: {
    seoTitle: "Graviditet | CMedical — oppfølging og 6-ukerskontroll",
    seoDescription:
      "Privat oppfølging gjennom svangerskap, fødsel og barseltid. Inkludert 6-ukerskontroll hos erfarne gynekologer.",
    canonical: "/behandlinger/gynekologi/graviditet",
    parent,
    title: "Graviditet",
    heroTitle: <>Trygg gjennom <span className="italic">hele</span> reisen</>,
    heroDescription:
      "Privat oppfølging gjennom svangerskap og barseltid — fra positiv test til 6-ukerskontroll. Du møter samme spesialist, med tid til spørsmål.",
    heroPoints: [
      { title: "Kontinuitet", desc: "Samme gynekolog gjennom hele forløpet når det er mulig." },
      { title: "Tid til samtalen", desc: "Du får tid til å stille de spørsmålene du faktisk har." },
      { title: "Fleksibel oppfølging", desc: "Tillegg til eller utfyllende den offentlige oppfølgingen." },
      { title: "6-ukerskontroll", desc: "Grundig kontroll etter fødsel — ikke et fem-minutters møte." },
    ],
    rating: "4,8 — Spesialister på kvinnehelse",
    booking: { ...baseBooking, tjeneste: "graviditet" },
    primaryCtaLabel: "Bestill svangerskapskontroll",
    flowTitle: "Slik følger vi deg gjennom svangerskapet",
    flow: [
      { n: "Steg 01", title: "Tidlig kontroll", desc: "Bekreftelse, terminbestemmelse og første gjennomgang." },
      { n: "Steg 02", title: "Underveis", desc: "Kontroller etter behov — ultralyd, blodprøver, samtaler." },
      { n: "Steg 03", title: "Mot termin", desc: "Forberedelse til fødsel og tett oppfølging ved behov." },
      { n: "Steg 04", title: "6-ukerskontroll", desc: "Grundig vurdering etter fødsel — kropp, bekkenbunn og hvordan du har det." },
    ],
    reasonsTitle: "Hva vi tilbyr gravide",
    reasonsLead: "Et bredt og fleksibelt tilbud — som tillegg eller alternativ.",
    reasons: [
      { n: "01", title: "Bekreftelse av svangerskap", desc: "Tidlig kontroll med ultralyd og samtale." },
      { n: "02", title: "Svangerskapskontroller", desc: "Etter behov og ønske — fleksible tider." },
      { n: "03", title: "Ultralyd", desc: "Fostermedisin, tilvekst og målrettede undersøkelser." },
      { n: "04", title: "Risikosvangerskap", desc: "Tett oppfølging når det er behov for ekstra trygghet." },
      { n: "05", title: "6-ukerskontroll", desc: "Grundig postpartum-kontroll med tid til alt." },
      { n: "06", title: "Barseltid", desc: "Plager, ammespørsmål og generell oppfølging i barseltiden." },
    ],
    promises: standardPromises,
    related: [
      { title: "Fostermedisin", desc: "Ultralyd og fosterdiagnostikk.", href: "/behandlinger/gynekologi/fostermedisin" },
      { title: "Fødselsskader", desc: "Hvis du har plager etter en tidligere fødsel.", href: "/behandlinger/gynekologi/fodselsskader" },
    ],
    ctaTitle: "Bestill svangerskapsoppfølging",
    ctaDescription: "Trygghet, tid og kontinuitet — gjennom hele svangerskapet.",
  },


  /* ───────────────────────── SPONTANABORT ───────────────────────── */
  spontanabort: {
    seoTitle: "Spontanabort | CMedical — utredning og oppfølging",
    seoDescription:
      "Tett medisinsk og menneskelig oppfølging ved spontanabort. Utredning ved gjentatte spontanaborter hos erfarne spesialister.",
    canonical: "/behandlinger/gynekologi/spontanabort",
    parent,
    title: "Spontanabort",
    heroTitle: <>Det er <span className="italic">lov</span> å sørge — og kreve svar</>,
    heroDescription:
      "Spontanabort er vanligere enn mange tror — og likevel sjelden snakket høyt om. Vi tilbyr både akutt oppfølging og utredning når det skjer flere ganger.",
    heroPoints: [
      { title: "Menneskelig oppfølging", desc: "Tid, ro og forståelse — ikke et fem-minutters møte." },
      { title: "Medisinsk trygghet", desc: "Grundig vurdering og oppfølging av selve forløpet." },
      { title: "Utredning ved gjentakelse", desc: "Når det skjer mer enn én gang skal det utredes — punktum." },
      { title: "Helhetlig støtte", desc: "Tilgang til psykolog og samtaler ved behov." },
    ],
    rating: "4,8 — Spesialister på kvinnehelse",
    booking: { ...baseBooking, tjeneste: "spontanabort" },
    primaryCtaLabel: "Bestill samtale",
    flowTitle: "Slik følger vi opp",
    flow: [
      { n: "Steg 01", title: "Samtale", desc: "Vi går gjennom det som har skjedd og hva du trenger nå." },
      { n: "Steg 02", title: "Undersøkelse", desc: "Ultralyd og blodprøver for å bekrefte og vurdere forløpet." },
      { n: "Steg 03", title: "Plan", desc: "Avventende, medisinsk eller kirurgisk håndtering — basert på situasjonen." },
      { n: "Steg 04", title: "Oppfølging", desc: "Kontroll og samtale i etterkant — også med tanke på fremtidige svangerskap." },
    ],
    reasonsTitle: "Når bør spontanabort utredes nærmere?",
    reasonsLead: "Vi følger anerkjente retningslinjer — men også deg som person.",
    reasons: [
      { n: "01", title: "Gjentatte spontanaborter", desc: "To eller flere — alltid grunn til utredning." },
      { n: "02", title: "Sen spontanabort", desc: "Etter uke 12 utredes alltid grundigere." },
      { n: "03", title: "Kjente risikofaktorer", desc: "Sykdom, hormonelle forhold eller anatomi som krever vurdering." },
      { n: "04", title: "Tidligere fertilitetsutfordringer", desc: "Når det er gått foran et behandlingsforløp." },
      { n: "05", title: "Uavklart årsak", desc: "Når du selv ønsker svar og vurdering før neste forsøk." },
      { n: "06", title: "Emosjonell oppfølging", desc: "Sorg og psykisk belastning skal også tas på alvor." },
    ],
    promises: standardPromises,
    related: [
      { title: "Hysteroskopi", desc: "Aktuelt som del av utredning ved gjentatte spontanaborter.", href: "/behandlinger/gynekologi/hysteroskopi" },
      { title: "Tverrfaglig team", desc: "Psykolog og samtaler som del av oppfølging.", href: "/behandlinger/gynekologi/tverrfaglig" },
      { title: "Graviditet", desc: "Tett oppfølging i neste svangerskap.", href: "/behandlinger/gynekologi/graviditet" },
    ],
    ctaTitle: "Bestill oppfølging",
    ctaDescription: "Du skal ikke stå alene — verken medisinsk eller menneskelig.",
  },

  /* ───────────────────────── TVERRFAGLIG TEAM ───────────────────────── */
  "tverrfaglig": {
    seoTitle: "Tverrfaglig team | CMedical — osteopat, sexolog, psykolog, ernæring",
    seoDescription:
      "Vårt tverrfaglige team støtter gynekologisk behandling — osteopat, sexolog, psykolog og ernæringsfysiolog under samme tak.",
    canonical: "/behandlinger/gynekologi/tverrfaglig",
    parent,
    title: "Tverrfaglig team",
    heroTitle: <>Kvinnehelse er <span className="italic">mer</span> enn én spesialitet</>,
    heroDescription:
      "Mange plager løses best når flere fagfelt jobber sammen. Vårt tverrfaglige team kobler gynekologi med osteopati, sexologi, psykologi og ernæring — under samme tak.",
    heroPoints: [
      { title: "Koordinert behandling", desc: "Vi snakker sammen om deg — du slipper å gjenta historien." },
      { title: "Bred kompetanse", desc: "Osteopat, sexolog, psykolog og ernæringsfysiolog i tett samarbeid med gynekolog." },
      { title: "Helhetlig syn", desc: "Kropp, hode og hormoner — alt henger sammen." },
      { title: "Samme tak", desc: "Alt på ett sted — ingen henvisninger som forsvinner." },
    ],
    rating: "4,8 — Spesialister på kvinnehelse",
    booking: { ...baseBooking, tjeneste: "tverrfaglig" },
    primaryCtaLabel: "Bestill konsultasjon",
    heroVideo: tverrfagligHeroVideo.url,
    flowTitle: "Slik jobber vi tverrfaglig",
    flow: [
      { n: "Steg 01", title: "Kartlegging", desc: "Vi starter med en grundig samtale om plager og mål." },
      { n: "Steg 02", title: "Plan", desc: "Vi setter sammen et team tilpasset deg." },
      { n: "Steg 03", title: "Behandling", desc: "Parallelle eller sekvensielle forløp — alltid koordinert." },
      { n: "Steg 04", title: "Evaluering", desc: "Vi justerer planen etter hvert som du blir bedre." },
    ],
    reasonsTitle: "Hvilke fagfolk du kan møte",
    reasonsLead: "Et bredt team som dekker det meste innen kvinnehelse.",
    reasons: [
      { n: "01", title: "Gynekolog", desc: "Spesialist på kvinnens reproduktive helse." },
      { n: "02", title: "Osteopat", desc: "Behandling av muskulatur, bekken og bekkenbunn." },
      { n: "03", title: "Sexolog", desc: "Hjelp med samliv, lyst, smerter og endringer." },
      { n: "04", title: "Psykolog", desc: "Støtte ved infertilitet, fødselsskader, sorg og overgangsalder." },
      { n: "05", title: "Ernæringsfysiolog", desc: "Tilpasset kostveiledning ved hormonelle tilstander og vektendringer." },
      { n: "06", title: "Fysioterapeut/uroterapeut", desc: "Spesifikk behandling av bekkenbunn og lekkasje." },
    ],
    promises: standardPromises,
    related: [
      { title: "Overgangsalder", desc: "Typisk tilstand der tverrfaglig støtte gir best resultat.", href: "/behandlinger/gynekologi/overgangsalder" },
      { title: "Endometriose", desc: "Krever ofte mer enn én tilnærming.", href: "/behandlinger/gynekologi/endometriose" },
      { title: "Fødselsskader", desc: "Best resultat med tverrfaglig oppfølging.", href: "/behandlinger/gynekologi/fodselsskader" },
    ],
    ctaTitle: "Bestill tverrfaglig vurdering",
    ctaDescription: "Når én spesialitet ikke holder — vi setter sammen riktig team for deg.",
  },
};
