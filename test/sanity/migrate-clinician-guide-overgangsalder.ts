// Migration: Seed the clinicianGuidePage document for
// /fastlegeveiledning-overgangsalder from the static React page.
// Supports internationalized-array v5 (NO + EN placeholders = NO text).
// Run: npx tsx sanity/migrate-clinician-guide-overgangsalder.ts

import { sanityClient as client } from "./config";

// ---- i18n helpers (v5: { _key: 'no' | 'en', value }) ----
const i18nString = (no: string, en?: string) => [
  { _type: "internationalizedArrayStringValue", _key: "no", value: no },
  { _type: "internationalizedArrayStringValue", _key: "en", value: en ?? no },
];
const i18nText = (no: string, en?: string) => [
  { _type: "internationalizedArrayTextValue", _key: "no", value: no },
  { _type: "internationalizedArrayTextValue", _key: "en", value: en ?? no },
];

let k = 0;
const key = (p = "b") => `${p}${++k}`;

const h3 = (t: string) => ({ _type: "guideSubheading", _key: key("h"), level: "h3", text: i18nString(t) });
const h4 = (t: string) => ({ _type: "guideSubheading", _key: key("h"), level: "h4", text: i18nString(t) });
const p = (t: string, style: "normal" | "note" | "lead" = "normal") => ({
  _type: "guideParagraph",
  _key: key("p"),
  style,
  text: i18nText(t),
});
const list = (items: string[], style: "bullet" | "number" = "bullet") => ({
  _type: "guideList",
  _key: key("l"),
  style,
  items: items.map((i) => ({ _type: "internationalizedArrayText", _key: key("li"), value: i18nText(i) })),
});
const quote = (text: string, source: string) => ({
  _type: "guideQuote",
  _key: key("q"),
  text: i18nText(text),
  source: i18nString(source),
});
const section = (heading: string, blocks: any[]) => ({
  _type: "guideSection",
  _key: key("s"),
  heading: i18nString(heading),
  blocks,
});

const doc = {
  _id: "clinicianGuide-fastlegeveiledning-overgangsalder",
  _type: "clinicianGuidePage",
  title: i18nString("Fastlegeveiledning overgangsalder"),
  slug: { _type: "slug", current: "fastlegeveiledning-overgangsalder" },
  subtitle: i18nString("Veileder for fastleger – Forenklet utredning og behandling av peri- og menopause"),
  backLinkLabel: i18nString("Tilbake til overgangsalder"),
  backLinkUrl: "/behandlinger/gynekologi/overgangsalder",
  introTexts: [
    {
      _type: "internationalizedArrayText",
      _key: key("intro"),
      value: i18nText(
        "Denne veilederen er et praktisk verktøy for fastleger ved utredning og behandling av peri- og menopausale kvinner. Den baserer seg på Norsk gynekologisk veileder 2024, NICE NG23 (2024), British Menopause Society (BMS) retningslinjer, European Society of Endocrinology (ESE) kliniske retningslinjer 2025, samt relevant forskning på spesielle pasientgrupper."
      ),
    },
  ],
  disclaimer: i18nText(
    "Viktig presisering: Dette er et forslag til klinisk tilnærming. Klinikere må alltid anvende faglig skjønn og huske at retningslinjer endres kontinuerlig. Individuell vurdering og oppfølging er essensielt."
  ),
  sections: [
    section("Utredning", [
      h3("Holistisk tilnærming: De fire søylene"),
      p("Ved vurdering av peri- og menopausale symptomer anbefales en helhetlig tilnærming basert på fire søyler:"),
      list(
        [
          "Hormoner – Østrogen-, progesteron- og testosteronstatus",
          "Psykologisk tilstand – Familiære relasjoner, arbeidskonflikter, angst, depresjon, søvnkvalitet",
          "Ernæring – Kosthold, vekt, metabolsk helse",
          "Fysisk aktivitet – Treningsvaner og daglig bevegelse",
        ],
        "number"
      ),
      h3("Differensialdiagnoser"),
      list([
        "Hyperthyreose og hypothyreose (Feokromocytom, Carcinoid syndrom, Leukemi, Arytmier)",
        "Søvnforstyrrelser av andre årsaker",
        "Medikamentbivirkninger",
        "Angstlidelser og depresjon",
      ]),
    ]),
    section("Aldersbasert håndtering", [
      h3("Under 40 år: Prematur ovarialsvikt (POI)"),
      p("Alle kvinner med POI skal henvises til gynekolog for utredning og oppfølging."),
      p(
        "POI diagnostiseres ved oligo-/amenoré i minst 4 måneder kombinert med FSH-nivåer i postmenopausalt område målt to ganger med minimum 4 ukers mellomrom. Disse kvinnene har økt risiko for kardiovaskulær sykdom, osteoporose, kognitiv svikt og for tidlig død, og krever derfor spesialisert oppfølging."
      ),
      h3("40–45 år: Tidlig menopause"),
      p("Bør henvises til gynekolog hvis mulig."),
      p(
        "Kvinner med tidlig menopause har økning i langtidshelserisiko, og spesialistvurdering kan sikre optimal hormonsubstitusjon minst frem til forventet menopausealder (ca. 52–53 år)."
      ),
      h3("45 år og eldre: Naturlig menopause"),
      p("Kan håndteres av fastleger."),
      p(
        "Viktig unntak: Alle blødningsforstyrrelser (menoragi/metroragi) bør henvises til gynekolog for videre utredning. Dette gjelder spesielt uregelmessige eller kraftige blødninger, da underliggende patologi (polypper, myomer, adenomyose, endometriehyperplasi eller malignitet) må utelukkes."
      ),
    ]),
    section("Behandling", [
      quote(
        "«Det er kvinnens subjektive overgangsplager, og hennes opplevelse av hvordan symptomene påvirker livskvaliteten som avgjør om hun skal tilbys behandling.»",
        "Norsk gynekologisk veileder 2024"
      ),
      h3("1. Livsstilsoptimalisering"),
      p("Før oppstart av farmakologisk behandling bør det alltid gis råd om:"),
      list([
        "Røykeslutt",
        "Regelmessig fysisk aktivitet (obs styrketrening)",
        "Sunt kosthold og vektkontroll",
        "Søvnhygiene",
        "Stressmestring/kognitive verktøy",
      ]),
      h3("2. Menopausal hormonbehandling (MHT)"),
      p(
        "MHT er den mest effektive behandlingen for vasomotoriske symptomer, søvnforstyrrelser, humørsvingninger og redusert livskvalitet knyttet til østrogen og progesteron mangel."
      ),
      h4("Østrogentilførsel"),
      p("Transdermal østrogen anbefales fremfor peroral administrasjon for å redusere risiko for tromboemboliske hendelser."),
      list([
        "Plaster (Estradot) gir jevnere distribusjon og mindre hormonelle svingninger sammenlignet med spray (Lenzetto) og gel (Estrogel).",
        "Ved naturlig menopause startes med lavest mulig effektive dose.",
        "Dose justeres etter symptomer og respons – individuell titrering er nøkkelen.",
      ]),
      h4("Gestagenbeskyttelse av endometriet"),
      p("Alle kvinner med livmor skal ha gestagen som endometriebeskyttelse."),
      p("Førstevalg: Mikronisert progesteron (Utrogestan)", "lead"),
      list([
        "Lavere brystkreftrisiko sammenlignet med syntetiske gestagener.",
        "Bør tas om kvelden før sengetid på grunn av søvndyssende effekt.",
        "Mange kvinner opplever bedre søvnkvalitet og redusert angst/uro ved bruk av Utrogestan.",
      ]),
      p("Mirena-spiral som alternativ", "lead"),
      list([
        "Gir lokal endometriebeskyttelse med minimal systemisk progesteronpåvirkning.",
        "Reduserer blødninger med opptil 90%, særlig godt alternativ ved samtidig prevensjonsbehov og/eller blødningsforstyrrelser.",
        "Viktig: Mirena dekker ikke alltid opp for typiske progesteron-mangel-symptomer som tidlig oppvåkning, indre uro eller «frynsete nerver».",
        "Ved slike symptomer bør Utrogestan gis i tillegg til Mirena + transdermal østrogen.",
      ]),
      h4("Behandlingsregime"),
      p("Sekvensiell behandling", "lead"),
      list([
        "Indikasjon: Perimenopause og inntil 6–12 måneder etter siste menstruasjon.",
        "Utrogestan gis 12–14 dager per måned, østrogen kontinuerlig.",
        "Dette regime etterlikner den naturlige menstruasjonssyklus og gir kontrollert bortfallsblødning.",
      ]),
      p(
        "Unntak: Ved uttalt søvnvansker og betydelig uro kan man forsøke kontinuerlig Utrogestan, men bør gå tilbake til sekvensiell bruk hvis ingen effekt innen 3 måneder.",
        "note"
      ),
      p("Kontinuerlig kombinert behandling", "lead"),
      list([
        "Indikasjon: Postmenopause (>12 måneder siden siste menstruasjon).",
        "Både østrogen og gestagen gis daglig.",
        "Målsetting er blødningsfrihet etter 3–4 måneder.",
      ]),
      h4("Vaginal østrogen"),
      p("Indikasjon: Vaginal atrofi, hyppige urinveisinfeksjoner, urinlekkasje, fremfall."),
      list([
        "Kan gis i tillegg til systemisk MHT.",
        "Minimal systemisk absorpsjon – trygt også for kvinner med kontraindikasjoner mot systemisk MHT.",
        "Preparater: Vagifem (vaginaltabletter), Ovesterin (gel/tabletter), Gynoflor (østriol + melkesyrebakterier).",
      ]),
      h4("Testosteron for kvinner"),
      p("Indikasjon:", "lead"),
      list([
        "Redusert seksuell lyst hos kvinner som ikke responderer tilstrekkelig på østrogen og progesteron alene.",
        "Noen studier indikerer også forbedret fokus, konsentrasjon og øket energi.",
      ]),
      p("Dosering og oppfølging:", "lead"),
      list([
        "Preparat: Tostran gel",
        "Dose: Ertestor gelklump bak knehasen annenhver dag til morgen.",
        "Målnivå: Skal ikke overstige 2,2 nmol/L (testosteronnivå måles etter 3 uker).",
        "Effekt på seksuell funksjon og bivirkninger (hårvekst, akne) evalueres etter 6 uker.",
      ]),
      p("NB: Testosteron er ikke godkjent for kvinner i Norge, men kan forskrives off-label etter individuell vurdering.", "note"),
      h4("Kontraindikasjoner for MHT"),
      p("Vi fraråder MHT ved:"),
      list([
        "Brystkreft (aktiv eller tidligere)",
        "Kjente eller mistenkte østrogensensitive maligne tilstander",
        "Vaginalblødning av ukjent årsak",
        "Aktuell venøs tromboembolisme (VTE)",
        "Tidligere eller pågående koronar hjertesykdom",
        "Aktiv leversykdom",
        "Porfyria cutanea tarda",
      ]),
    ]),
    section("Spesielle pasientgrupper", [
      h3("Migrene med aura"),
      p(
        "Transdermale østrogener kan brukes ved migrene med aura, men orale østrogener er kontraindisert på grunn av økt risiko for arterielle hendelser."
      ),
      list([
        "Plaster (Estradot) gir jevnere distribusjon og færre hormonelle svingninger.",
        "Syklisk progesteron forverrer migrene. Mikronisert progesteron provoserer frem minst migrene.",
        "Alternativ: Mirena-spiral + transdermal østrogen for jevnest mulig hormonell stabilitet.",
      ]),
      p("Absolutt kontraindikasjon hvis kvinnen i tillegg røyker eller har to eller flere slagrisikofaktorer.", "note"),
      h3("Endometriose"),
      p("MHT bør absolutt tilbys til kvinner med endometriose i menopause – forskning viser at fordelene veier tyngre enn risikoene."),
      list([
        "Kontinuerlig kombinert MHT er førstevalget, også etter hysterektomi.",
        "Østrogen monoterapi kan reaktivere endometrioselesjonene.",
        "Anbefalt regime: Mirena og/eller Utrogestan + transdermal østrogen.",
        "Kvinner med gjentatte kirurgiske inngrep for endometriose har større sannsynlighet for tidlig menopause.",
      ]),
      h3("ADHD"),
      p(
        "Østrogen øker dopaminproduksjon i hjernen; når østrogen faller forverres ADHD-symptomer. Progesteron kan hemme dopaminfrigjøring og forsterke symptomer."
      ),
      list([
        "Syklisk regime med Utrogestan om kvelden, men Mirena-spiral er best for minst systemisk påvirkning.",
        "Transdermal østrogen (plaster, gel eller spray).",
      ]),
      h3("Hypothyroidisme"),
      p(
        "Hypothyroidisme er 10 ganger vanligere hos kvinner enn menn, og 12–20% av kvinner over 60 år har underaktiv skjoldbruskkjertel."
      ),
      list([
        "Oral østrogen øker TBG, noe som reduserer fritt T4 – kan kreve økning av levothyroxin-dosen.",
        "TSH bør måles på nytt etter oppstart av oral kombinert MHT.",
        "Transdermal MHT påvirker ikke skjoldbruskkjertel-funksjon like mye.",
      ]),
      h3("Type 2-diabetes"),
      p("Menopause øker risikoen for insulinresistens betydelig fordi synkende østrogen gjør kroppen mindre responsiv til insulin."),
      list([
        "Reduserer HbA1c og fastende glukose.",
        "35,8% reduksjon i insulinresistens (HOMA-IR) sammenlignet med placebo.",
        "21–30% lavere risiko for å utvikle diabetes (WHI-studien).",
        "MHT forbedrer også lipidprofil og reduserer sentral fettakkumulering.",
      ]),
      p("Viktig: MHT bør ikke forskrives kun for diabetesforebygging – symptomlindring er hovedindikasjonen.", "note"),
      h3("Metabolsk syndrom og fedme"),
      p("50% av kardiovaskulære hendelser hos kvinner er relatert til metabolske forstyrrelser."),
      list([
        "MHT reduserer BMI, midje-omkrets og abdominalt fett.",
        "Senker LDL-kolesterol og triglyserider, øker HDL.",
      ]),
      p("Tirzepatid (GLP-1/GIP-agonist) + MHT:", "lead"),
      list([
        "MHT-brukere: ~20% total kroppsvekttap etter 18 måneder.",
        "Ikke-brukere: ~15% total kroppsvekttap etter 18 måneder.",
        "45% av MHT-brukere oppnådde ≥20% vekttap vs. 18% av ikke-brukere.",
      ]),
      h3("Revmatoid artritt (RA)"),
      list([
        "MHT reduserer inflammatoriske markører (TNF-α, IL-6).",
        "Bedrer disease activity score (DAS28).",
        "Forbedrer benmineraltetthet og kan ha beskyttende effekt mot ledddestruksjon.",
      ]),
      p("Viktig: MHT frarådes for kvinner med lupus og anti-fosfolipid antistoffer på grunn av økt risiko for blodpropp.", "note"),
      h3("PMOS (Polycystisk ovariesyndrom)"),
      list([
        "Transdermal østrogen + mikronisert progesteron eller Mirena-spiral.",
        "Kvinner med PMOS kan ha nytte av testosteron som del av MHT.",
        "Livsstilsintervensjon (vektnedgang, kosthold, fysisk aktivitet) fortsatt viktig.",
      ]),
    ]),
    section("Betydelige blødningsforstyrrelser", [
      p("Ved betydelige blødningsforstyrrelser perimenopausalt behandles dette best med Mirena-spiral eller kirurgisk inngrep."),
      p("Henvisning til gynekolog ved:"),
      list([
        "Kraftige eller uregelmessige blødninger som ikke responderer på konservativ behandling",
        "Postmenopausal blødning",
        "Blødning av ukjent årsak",
      ]),
    ]),
    section("Oppsummering og praktiske råd", [
      h3("Start med det grunnleggende"),
      list(
        [
          "Livsstilsoptimalisering bestandig.",
          "Individuell vurdering av symptomer, risikofaktorer og pasientpreferanser.",
          "Laveste effektive dose i start, ingen tidsbegrensning i behandling.",
        ],
        "number"
      ),
      h3("Velg riktig MHT"),
      list([
        "Østrogen: Transdermal (plaster, gel, spray) fremfor peroral.",
        "Gestagen: Mikronisert progesteron (Utrogestan) fremfor syntetiske gestagener.",
        "Regime: Sekvensiell perimenopausalt, kontinuerlig postmenopausalt.",
      ]),
      h3("Ikke glem spesielle behov"),
      list([
        "Vaginal atrofi: Lokal østrogen i tillegg.",
        "Redusert libido: Vurder testosteron.",
        "Komorbiditet: Tilpass behandling til hypothyreose, diabetes, ADHD, migrene, endometriose, etc.",
      ]),
      h3("Henvisning til gynekolog ved:"),
      list([
        "POI (<40 år) – alltid",
        "Tidlig menopause (40–45 år) – anbefalt",
        "Blødningsforstyrrelser – menoragi/metroragi",
        "Kompliserte tilfeller eller manglende respons på behandling",
      ]),
    ]),
  ],
  sources: [
    "Norsk gynekologisk veileder kapittel menopause 2024",
    "NICE NG23 Menopause guideline 2024 – menopause, POI, genitourinære symptomer",
    "British Menopause Society retningslinjer 2022–2025 – endometriose, migrene, ADHD, autoimmune sykdommer, diabetes, metabolsk syndrom, PMOS",
    "European Society of Endocrinology guidelines 2025",
    "Osianlis E, et al. ADHD and Sex Hormones in Females: A Systematic Review. Journal of Attention Disorders 2025; 29(9):706-723",
  ].map((s) => ({ _type: "internationalizedArrayText", _key: key("src"), value: i18nText(s) })),
  closingNote: i18nText(
    "Avsluttende merknad: Denne veilederen er et forslag til klinisk praksis og skal ikke erstatte individuell klinisk vurdering eller oppdaterte nasjonale retningslinjer. Faglig skjønn og pasientsentrert tilnærming står alltid sentralt."
  ),
  ctaText: i18nString("Bestill time"),
  ctaLink: "/booking?kategori=gynekologi",
  seo: {
    _type: "seo",
    metaTitle: i18nString("Fastlegeveiledning overgangsalder"),
    metaDescription: i18nText(
      "Praktisk veileder for fastleger ved utredning og behandling av peri- og menopausale kvinner. Basert på norske og internasjonale retningslinjer."
    ),
    noIndex: false,
  },
};

async function migrate() {
  console.log("Creating clinicianGuidePage: fastlegeveiledning-overgangsalder …");
  await client.createOrReplace(doc);
  console.log("✅ Done");
}

migrate().catch((err) => {
  console.error("Migration failed:", err);
  process.exit(1);
});
