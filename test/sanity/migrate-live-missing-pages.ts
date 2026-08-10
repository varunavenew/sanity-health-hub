/**
 * Migrate three treatment pages that exist on the live cmedical.no site but are
 * missing from Sanity:
 *
 *   /no/fertilitet/fertilitetsutredning        → treatment.fertilitet.fertilitetsutredning
 *   /no/bariatrisk-kirurgi/sleeve-gastrektomi  → treatment.flere-fagomrader.sleeve-gastrektomi
 *   /no/gynekologi/pms-og-pmdd                 → treatment.gynekologi.pms-og-pmdd
 *
 * Content is copied verbatim (ordrett) from the live pages. Shape follows the
 * current `treatment` schema (Phase 15T) and internationalized-array v5
 * (objects carry a `language` field). Required NO+EN fields (title, heroTitle,
 * description, seo.metaTitle, seo.metaDescription, geoSummary) get both
 * languages; long-form Norwegian body copy is NO-only and falls back on the site.
 *
 * OVERRIDE semantics: `createOrReplace` — existing docs with the same _id are
 * fully replaced.
 *
 * Run:
 *   SANITY_TOKEN=<token> bun run test/sanity/migrate-live-missing-pages.ts
 *   DRY_RUN=1 SANITY_TOKEN=<token> bun run test/sanity/migrate-live-missing-pages.ts
 */

import { randomUUID } from 'node:crypto'
import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

/* ── helpers ─────────────────────────────────────────────────────────── */

const k = () => randomUUID().replace(/-/g, '').slice(0, 12)

type L = { no: string; en?: string }

const i18nStr = (v: L | string | undefined) => {
  if (!v) return undefined
  const o = typeof v === 'string' ? { no: v } : v
  const out: any[] = [
    { _key: 'no', _type: 'internationalizedArrayStringValue', language: 'no', value: o.no },
  ]
  if (o.en) out.push({ _key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: o.en })
  return out
}

const i18nText = (v: L | string | undefined) => {
  if (!v) return undefined
  const o = typeof v === 'string' ? { no: v } : v
  const out: any[] = [
    { _key: 'no', _type: 'internationalizedArrayTextValue', language: 'no', value: o.no },
  ]
  if (o.en) out.push({ _key: 'en', _type: 'internationalizedArrayTextValue', language: 'en', value: o.en })
  return out
}

const i18nSlug = (no: string, en: string) => [
  { _key: 'no', _type: 'internationalizedArraySlugValue', language: 'no', value: { _type: 'slug', current: no } },
  { _key: 'en', _type: 'internationalizedArraySlugValue', language: 'en', value: { _type: 'slug', current: en } },
]

const catRef = (id: string) => ({ _type: 'reference', _ref: `category-${id}` })

const points = (items: Array<L | string>) =>
  items.map((t) => ({ _key: k(), title: i18nStr(t) }))

const list = (items: Array<{ title: L | string; desc?: L | string }>, numbered = true) =>
  items.map((it, i) => ({
    _key: k(),
    ...(numbered ? { n: i18nStr(String(i + 1).padStart(2, '0')) } : {}),
    title: i18nStr(it.title),
    desc: it.desc ? i18nText(it.desc) : undefined,
  }))

const faqList = (items: Array<{ q: L | string; a: L | string }>) =>
  items.map(({ q, a }) => ({
    _key: k(),
    _type: 'object',
    question: i18nStr(q),
    answer: i18nText(a),
  }))

/** Shared clinic-wide FAQ block used on all three live pages. */
const SHARED_FAQS = faqList([
  {
    q: { no: 'Henvisning', en: 'Referral' },
    a: {
      no: 'Ingen henvisning nødvendig. Vi er en privathelseklinikk og har derfor ingen refusjonsavtale med det offentlige.',
      en: 'No referral needed. We are a private health clinic and therefore have no reimbursement agreement with the public health service.',
    },
  },
  {
    q: { no: 'Ventetid', en: 'Waiting time' },
    a: {
      no: 'Vi har fra ingen til veldig korte ventetider. Generelt sett skal du få hjelp innen en uke. Dette varierer selvfølgelig noe avhengig av hva du trenger hjelp med. Enkle konsultasjoner får du raskere bestilt sammenlignet med operasjoner for eksempel. Ta kontakt med oss så finner vi en tid som passer deg!',
      en: 'We have no or very short waiting times. In general you will be seen within a week, depending on what you need help with. Contact us and we will find a time that suits you.',
    },
  },
  {
    q: { no: 'Sykemelding', en: 'Sick leave' },
    a: {
      no: 'I de tilfellene der det er behov er det mulig for oss å skrive ut sykmelding. Vi følger nasjonale retningslinjer.',
      en: 'Where needed we can issue a sick note. We follow national guidelines.',
    },
  },
  {
    q: { no: 'Utredning', en: 'Assessment' },
    a: {
      no: 'Vi anbefaler alle å starte med en utredning eller konsultasjon. En vanlig utredning hos oss varer ca 30 minutter.',
      en: 'We recommend starting with an assessment or consultation. A standard assessment lasts about 30 minutes.',
    },
  },
])

/* ── 1. Fertilitetsutredning (~1250 ord) ─────────────────────────────── */

const fertilitetsutredning = {
  _id: 'treatment.fertilitet.fertilitetsutredning',
  _type: 'treatment',
  pageRole: 'service',
  sortOrder: 10,
  title: i18nStr({ no: 'Fertilitetsutredning', en: 'Fertility assessment' }),
  slug: i18nSlug('fertilitetsutredning', 'fertility-assessment'),
  categories: [{ ...catRef('fertilitet'), _key: k() }],
  category: catRef('fertilitet'),
  parentCategoryLabel: i18nStr({ no: 'Fertilitet', en: 'Fertility' }),
  homeBreadcrumbLabel: i18nStr({ no: 'Hjem', en: 'Home' }),

  heroTitle: i18nStr({
    no: 'Fertilitetsutredning – et trygt første steg',
    en: 'Fertility assessment – a safe first step',
  }),
  description: i18nText({
    no: 'Å ta det første steget kan føles stort – enten du kommer alene eller sammen med en partner, og enten du vet hva du ønsker eller fortsatt er i en utforskende fase. Hos oss møter du et fagmiljø som tar seg tid til å lytte, forstå og veilede deg videre.\n\nDenne første fasen handler ikke om å ha alle svarene – men om å begynne et sted.',
    en: 'Taking the first step can feel big – whether you come alone or with a partner, and whether you know what you want or are still exploring. Here you meet a team that takes the time to listen, understand and guide you.\n\nThis first phase is not about having all the answers – it is about starting somewhere.',
  }),
  heroPoints: points([
    { no: 'Uten henvisning', en: 'No referral' },
    { no: 'Ingen ventetid', en: 'No waiting time' },
  ]),
  rating: i18nStr('4,7'),
  primaryCtaLabel: i18nStr({ no: 'Bestill fertilitetsutredning', en: 'Book a fertility assessment' }),
  seePricesLabel: i18nStr({ no: 'Se priser', en: 'See prices' }),
  seePricesHref: '/priser',
  callCtaLabel: i18nStr({ no: 'Ring oss', en: 'Call us' }),
  bookingService: 'fertilitetsutredning',

  reasonsTitle: i18nStr({ no: 'Slik foregår en fertilitetsutredning', en: 'How a fertility assessment works' }),
  reasonsLead: i18nText({
    no: 'Vi tilpasser tempoet etter deg. Noen ønsker bare en samtale i første omgang, andre vil gå rett videre til medisinsk utredning.',
    en: 'We adapt the pace to you. Some want only a conversation to begin with, others go straight to a medical assessment.',
  }),
  reasonsLayout: 'accordion',
  reasons: list([
    {
      title: { no: 'En uforpliktende start', en: 'A no-obligation start' },
      desc: 'Mange velger å starte med en samtale. Her får du mulighet til å fortelle om din situasjon, stille spørsmål og bli kjent med hvilke muligheter som finnes. For noen er dette nok i første omgang. For andre er det naturlig å gå videre med en medisinsk utredning. Vi tilpasser tempoet etter deg.',
    },
    {
      title: { no: 'Vi blir kjent med deg – eller dere', en: 'Getting to know you' },
      desc: 'I første konsultasjon ønsker vi å forstå helheten: din eller deres livssituasjon, ønsker og forventninger, eventuell tidligere sykehistorie, og hvor dere er i prosessen. Dette gir oss et godt grunnlag for å gi råd som er relevante og trygge.',
    },
    {
      title: { no: 'Undersøkelser som gir oversikt', en: 'Examinations that give an overview' },
      desc: 'En fertilitetsutredning kan bestå av:\n\nFor kvinner:\n– Blodprøver for hormonnivå\n– Ultralyd av livmor og eggstokker\n\nFor menn:\n– Sædanalyse\n\nUndersøkelsene gir oss innsikt i fertiliteten og kan avdekke forhold som har betydning for veien videre.',
    },
    {
      title: { no: 'Hva skjer etter utredningen?', en: 'What happens after the assessment?' },
      desc: 'For noen gir utredningen trygghet og bekreftelse på at alt ser normalt ut. For andre kan den avdekke årsaker som gjør at behandling anbefales. Sammen går vi gjennom resultatene og snakker om aktuelle alternativer – enten det er å fortsette på egen hånd, starte behandling, eller ta seg litt mer tid.',
    },
    {
      title: { no: 'Ingen beslutninger må tas med én gang', en: 'No decisions have to be made straight away' },
      desc: 'Det er helt vanlig å bruke tid på å kjenne etter hva som føles riktig. Noen er klare for neste steg raskt, mens andre trenger flere samtaler før de bestemmer seg.',
    },
    {
      title: { no: 'Individuell oppfølging – hele veien', en: 'Individual follow-up all the way' },
      desc: 'Vi tilpasser utredning, behandling og oppfølging til deg og din situasjon. Samtidig vet vi at dette ofte er en følelsesmessig prosess – og vi er her for å støtte deg, uansett hvor du er i løpet.',
    },
  ]),

  flowTitle: i18nStr({ no: 'Det første møtet og fertilitetsutredning', en: 'The first meeting and the assessment' }),
  flow: list([
    {
      title: { no: 'Før utredning', en: 'Before the assessment' },
      desc: 'Vi anbefaler at du eller dere tar blodprøver i forkant av timen. Kontakt oss gjerne så er vi behjelpelig med rekvirering av blodprøver.',
    },
    {
      title: { no: 'Det første møtet', en: 'The first meeting' },
      desc: 'Fordi infertilitet oppleves likt for kvinner og menn, anbefaler vi at dere begge stiller på den første samtalen. Samtalen vil i stor grad dreie seg om hvem du er, hvilke ønsker og mål du har, hvem dere eventuelt er som par, og ikke minst medisinsk historie. Vårt mål er at du går fra den første samtalen med all informasjon du trenger for å ha en klar forståelse av veien videre.',
    },
    {
      title: { no: 'Fertilitetsutredning', en: 'Fertility assessment' },
      desc: 'Kvinner: en grundig gynekologisk undersøkelse med innvendig ultralyd, der vi sjekker at alt ser bra ut i livmoren og eggstokkene. Fertilitetslegen oppdaterer deg underveis i undersøkelsen.\n\nMenn: en sædanalyse, der vi blant annet sjekker antall spermier, konsentrasjon og bevegelighet. Det er ønskelig at mannen avlegger denne prøven hos oss.',
    },
    {
      title: { no: 'Under fertilitetsutredningen', en: 'During the assessment' },
      desc: 'Du vil få vite alle eventuelle funn som blir gjort under fertilitetsutredningen. Her får du igjen muligheten til å stille de spørsmål du måtte ha, om eventuelle funn, mulig behandling og veien videre.',
    },
  ]),

  promises: [
    {
      _key: k(),
      eyebrow: i18nStr({ no: 'Omsorg', en: 'Care' }),
      title: i18nStr({ no: 'En emosjonell prosess', en: 'An emotional process' }),
      desc: i18nText(
        'Fertilitetsbehandling handler ikke bare om det medisinske – det er også en personlig og følelsesmessig reise. Mange opplever et spenn av følelser underveis: håp, usikkerhet, sårbarhet, forventning – og noen ganger skuffelse. Uansett hvordan du eller dere har det, er det rom for alle reaksjoner hos oss.',
      ),
    },
    {
      _key: k(),
      eyebrow: i18nStr({ no: 'Kontinuitet', en: 'Continuity' }),
      title: i18nStr({ no: 'Faste fagpersoner gjennom hele løpet', en: 'The same team throughout' }),
      desc: i18nText(
        'For å skape trygghet og kontinuitet vil vi så langt det er mulig sørge for at du møter de samme fagpersonene underveis. Mange opplever det som verdifullt å ha en fast sykepleier og fertilitetslege som kjenner deres situasjon og følger dere gjennom prosessen.',
      ),
    },
    {
      _key: k(),
      eyebrow: i18nStr({ no: 'Rådgivning', en: 'Counselling' }),
      title: i18nStr({ no: 'Fertilitetsbehandling og parforholdet', en: 'Fertility treatment and the relationship' }),
      desc: i18nText(
        'En lang periode med forsøk på å bli gravide kan påvirke både nærhet og seksualitet i parforholdet. Hos CMedical møter vi dette med en helhetlig tilnærming, der både fysiske, psykiske og relasjonelle sider ivaretas gjennom hele behandlingsforløpet. Sexologisk rådgivning er en del av tilbudet, og kan bidra til økt trygghet og støtte i en periode som ofte oppleves som uforutsigbar.',
      ),
    },
  ],

  expertAreas: {
    title: i18nStr({ no: 'Relaterte tjenester', en: 'Related services' }),
    items: [
      {
        _key: k(),
        title: i18nStr({ no: 'Assistert befruktning', en: 'Assisted reproduction' }),
        desc: i18nText('IVF, ICSI og inseminasjon (IUI) – også med donor.'),
        path: '/behandlinger/fertilitet/assistert-befruktning',
      },
      {
        _key: k(),
        title: i18nStr({ no: 'Assistert befruktning for par og single', en: 'Assisted reproduction for couples and singles' }),
        desc: i18nText('Behandlingsplan tilpasset din situasjon, enten du er singel eller i et parforhold.'),
        path: '/behandlinger/fertilitet/assistert-befruktning-for-par-og-single',
      },
      {
        _key: k(),
        title: i18nStr({ no: 'Sædanalyse', en: 'Semen analysis' }),
        desc: i18nText('Antall sædceller, konsentrasjon og bevegelighet – ofte en del av den første utredningen.'),
        path: '/behandlinger/fertilitet/saedanalyse',
      },
    ],
  },

  faqSectionTitle: i18nStr({ no: 'Ofte stilte spørsmål', en: 'Frequently asked questions' }),
  faqs: SHARED_FAQS,

  seo: {
    _type: 'seo',
    metaTitle: i18nStr({ no: 'Fertilitetsutredning | CMedical', en: 'Fertility assessment | CMedical' }),
    metaDescription: i18nText({
      no: 'Fertilitetsutredning hos CMedical: samtale, hormonprøver, ultralyd og sædanalyse. Uten henvisning og uten ventetid.',
      en: 'Fertility assessment at CMedical: consultation, hormone tests, ultrasound and semen analysis. No referral, no waiting time.',
    }),
    noIndex: false,
  },
  geoSummary: i18nText({
    no: 'Fertilitetsutredning hos CMedical kartlegger fruktbarheten hos kvinner og menn med samtale, hormonblodprøver, ultralyd av livmor og eggstokker samt sædanalyse. Tilbys uten henvisning og uten ventetid.',
    en: 'A fertility assessment at CMedical maps fertility for women and men through consultation, hormone blood tests, ultrasound of the uterus and ovaries, and semen analysis. Available without referral or waiting time.',
  }),
}

/* ── 2. Sleeve gastrektomi (~1900 ord) ───────────────────────────────── */

const sleeveGastrektomi = {
  _id: 'treatment.flere-fagomrader.sleeve-gastrektomi',
  _type: 'treatment',
  pageRole: 'service',
  sortOrder: 20,
  title: i18nStr({ no: 'Sleeve gastrektomi', en: 'Sleeve gastrectomy' }),
  slug: i18nSlug('sleeve-gastrektomi', 'sleeve-gastrectomy'),
  categories: [{ ...catRef('flere-fagomrader'), _key: k() }],
  category: catRef('flere-fagomrader'),
  parentCategoryLabel: i18nStr({
    no: 'Mage- og tarmlidelser (Gastrokirurgi)',
    en: 'Gastrointestinal surgery',
  }),
  homeBreadcrumbLabel: i18nStr({ no: 'Hjem', en: 'Home' }),

  heroTitle: i18nStr({ no: 'Sleeve gastrektomi', en: 'Sleeve gastrectomy' }),
  description: i18nText({
    no: 'Robotassistert kirurgi for sleeve gastrektomi – rSG – er en moderne form for laparoskopisk (kikkehull) overvektskirurgi, hvor den nyeste teknologien brukes for å oppnå enda større presisjon enn ved tradisjonell teknikk. Under dette inngrepet fjernes 60–80 % av magesekken, og den gjenværende delen formes til en smal såkalt «sleeve» som begrenser matinntaket. Dette kan føre til betydelig vekttap, samtidig som kroppens evne til å ta opp næringsstoffer bevares.',
    en: 'Robot-assisted sleeve gastrectomy (rSG) is a modern form of laparoscopic (keyhole) bariatric surgery, using the latest technology for even greater precision than traditional technique. During the procedure 60–80% of the stomach is removed and the remaining part is shaped into a narrow "sleeve" that limits food intake. This can lead to significant weight loss while the body keeps its ability to absorb nutrients.',
  }),
  heroPoints: points([
    { no: 'Kort ventetid', en: 'Short waiting time' },
    { no: 'Ingen henvisning', en: 'No referral' },
  ]),
  rating: i18nStr('4,7'),
  primaryCtaLabel: i18nStr({ no: 'Bestill konsultasjon', en: 'Book a consultation' }),
  seePricesLabel: i18nStr({ no: 'Se priser', en: 'See prices' }),
  seePricesHref: '/priser',
  callCtaLabel: i18nStr({ no: 'Ring oss', en: 'Call us' }),
  bookingService: 'sleeve-gastrektomi',

  reasonsTitle: i18nStr({ no: 'Om robotassistert sleeve gastrektomi', en: 'About robot-assisted sleeve gastrectomy' }),
  reasonsLayout: 'accordion',
  reasons: list([
    {
      title: { no: 'Skånsom laparoskopisk teknikk', en: 'Gentle laparoscopic technique' },
      desc: 'Ved laparoskopisk robotassisterte inngrep benytter kirurgen tynne instrumenter som føres inn gjennom små snitt i bukveggen, i stedet for å lage et større snitt som ved tradisjonell åpen kirurgi. Denne skånsomme tilnærmingen gir flere fordeler for pasienten: mindre blodtap, mindre smerter, kortere restitusjonstid og penere kosmetisk resultat. Laparoskopisk teknikk er i dag førstevalg ved mange vanlige operasjoner, blant annet ved fjerning av galleblære, overvektskirurgi og behandling av gastroøsofageal reflukssykdom (sure oppstøt).',
    },
    {
      title: { no: 'Raskere tilbake til hverdagen', en: 'Faster back to everyday life' },
      desc: 'Etter en laparoskopisk robotassistert operasjon opplever de fleste pasienter mindre ubehag og en raskere tilbakevending til sine daglige aktiviteter. Dette reduserer behovet for langvarig sykemelding og minsker risikoen for komplikasjoner som brokk i operasjonssårene.',
    },
    {
      title: { no: 'Det er kirurgen som opererer', en: 'The surgeon performs the operation' },
      desc: 'Det er viktig å være klar over at det ikke er en robot som utfører operasjonen. Din kirurg styrer hele prosedyren ved hjelp av avansert robotteknologi. Kirurgen sitter ved en konsoll med høyoppløselig 3D-bilde av operasjonsfeltet, og styrer kirurgiske instrumenter med høy presisjon. Den nyeste teknologien oversetter kirurgens hånd-, håndledd- og fingerbevegelser til mikrobevegelser i da Vinci X-robotinstrumentene, noe som gir enestående kontroll og nøyaktighet.',
    },
  ]),

  flowTitle: i18nStr({ no: 'Slik foregår behandlingsforløpet', en: 'The treatment pathway' }),
  flow: list([
    {
      title: { no: 'Før operasjonen', en: 'Before surgery' },
      desc: 'For at operasjonen din skal kunne gjennomføres på best mulig måte, ber vi deg om å lese gjennom dokumentet «Informasjon om anestesi til deg som skal opereres på CMedical», tilsendt før operasjonsdagen din.\n\nDu vil ha en samtale med vår kliniske ernæringsfysiolog før operasjonen, som vil gi deg veiledning om kostholdet ditt i den første perioden etter inngrepet, samt lage en plan for videre kosthold.',
    },
    {
      title: { no: 'Viktig møte før operasjonen', en: 'Important pre-op consultation' },
      desc: 'Før operasjonen kalles du inn til en grundig samtale med din lege. Husk å ta med en oppdatert liste over alle medisiner, kosttilskudd og naturmidler du eventuelt bruker, med navn, styrke og dosering. Du kan finne oversikt over reseptpliktige medisiner på helsenorge.no eller hos fastlegen din. For noen kan det også være nødvendig med ekstra undersøkelser som gastroskopi, røntgen, eller kontroll av hjerte- og lungefunksjon.\n\nViktig for kvinner i fruktbar alder: Hvis du er seksuelt aktiv, må du bruke sikker prevensjon. Dersom du er gravid, må operasjonen utsettes. For best mulig helse for både deg og en eventuell baby, anbefales det å vente minst 12–18 måneder etter operasjonen før en graviditet planlegges.',
    },
    {
      title: { no: 'Lavkaloridiett før operasjonen', en: 'Low-calorie diet before surgery' },
      desc: 'De siste tre ukene før operasjonen skal du følge en lavkaloridiett på 800–1200 kalorier per dag. Dette gjør leveren mindre og reduserer fettmengden i buken, noe som gjør operasjonen enklere og tryggere.',
    },
    {
      title: { no: 'Endring av spisemønster', en: 'Changing eating patterns' },
      desc: 'For å få et varig godt resultat etter operasjonen er det helt nødvendig å endre måten du spiser på: spis regelmessig, i små porsjoner, tygg maten godt og bruk god tid på måltidene, og planlegg måltider slik at du unngår impuls-spising.\n\nJobb med gode kostvaner allerede nå: spis på faste tider og unngå småspising mellom måltidene, velg proteinrike matvarer som rent kjøtt, fugl, fisk, egg, belgfrukter og magre meieriprodukter, og bli bevisst på følelsesspising. Andre viktige forberedelser: planlegg for endringene som kommer, øk aktivitetsnivået gradvis og slutt å røyke – røykeslutt er et krav før operasjon.',
    },
    {
      title: { no: 'Under operasjonen', en: 'During surgery' },
      desc: 'Operasjonen varer vanligvis i 30–40 minutter. Kirurgen lager flere små snitt i magen for å kunne sette inn de laparoskopiske instrumentene. En del av magesekken fjernes for å lage en «sleeve» som reduserer magens størrelse. Den gjenværende delen av magesekken blir deretter lukket med suturer eller klips for å sikre at det ikke oppstår lekkasjer. Når operasjonen er ferdig, vil kirurgen utføre en test for å sjekke at det ikke er noen lekkasjer fra den nye magesekken.',
    },
    {
      title: { no: 'Etter operasjonen', en: 'After surgery' },
      desc: 'Etter operasjonen blir du lagt på postoperativ avdeling for observasjon. Du vil tilbringe natten hos oss på CMedical, og kan reise hjem neste formiddag. Morgenen etter operasjonen får du flytende kost og intravenøs væske. Det er viktig at du fortsetter å ta dine faste medisiner og at du er i bevegelse, så lenge du føler deg i stand til det.',
    },
    {
      title: { no: 'Hjemreise', en: 'Going home' },
      desc: 'Du må avtale at noen henter deg, eller eventuelt ta en taxi hjem. CMedical kan dessverre ikke skrive ut taxirekvisisjon. Hvis du er forsikringspasient, ber vi deg om å avklare reisekostnader med ditt forsikringsselskap før operasjonen. Vær oppmerksom på at du ikke kan kjøre bil det første døgnet etter narkosen.',
    },
    {
      title: { no: 'Tiden etter hjemkomst', en: 'The time after coming home' },
      desc: 'Forstoppelse: Det er normalt å ikke ha avføring daglig etter en overvektsoperasjon. Avføring sjeldnere enn hver tredje dag regnes som forstoppelse. Drikk rikelig med vann og vær i aktivitet. Det kan også hjelpe å drikke Biola eller sviskesaft, spise svisker som har ligget i vann over natten, innta knuste linfrø (1 spiseskje i ½ glass vann over natten) eller bruke Laktulose (15–30 ml daglig) i 2–4 dager inntil avføringen er normal.\n\nDiaré: Kan skyldes laktose- eller fettintoleranse, eller at du ikke tåler kunstige søtstoffer, sukker eller fiber like godt som før. Unngå søt melk, samt mat som grøt, brunost eller prim. Vær forsiktig med fett i kosten.\n\nLuftplager: Etter operasjonen kan du oppleve oppblåst mage, rumling og økt luftavgang. Spis langsomt, tygg maten godt, og unngå kullsyreholdige drikker, tyggegummi og drops.\n\nForholdsregler: Drikk rikelig, opp til 1,5 liter i løpet av dagen. Følg anbefalingene fra ernæringsfysiologen. Unngå tunge løft og intens trening de første 2–3 ukene. Spis små og hyppige måltider. Du vil være sykemeldt i ca. 4 uker.',
    },
    {
      title: { no: 'Kosthold og oppfølging etter slankeoperasjon', en: 'Diet and follow-up after bariatric surgery' },
      desc: 'Oppfølging etter en slankeoperasjon er en viktig del av behandlingsforløpet. Målet vårt er å sikre at du får en så god opplevelse som mulig, med få komplikasjoner, lite ubehag og et best mulig behandlingsresultat.\n\nFør operasjonen vil du ha en samtale med vår kliniske ernæringsfysiolog, som gir deg veiledning om kostholdet ditt i den første perioden etter inngrepet, samt lager en plan for videre kosthold. Etter operasjonen vil du ha regelmessige oppfølgingssamtaler med vår kliniske ernæringsfysiolog i løpet av de 12 første månedene.',
    },
    {
      title: { no: 'Ved medisinske spørsmål eller komplikasjoner', en: 'Medical questions or complications' },
      desc: 'Som ved alle kirurgiske inngrep finnes det en risiko for komplikasjoner, som blødning eller infeksjoner. Hvis du opplever ubehag eller smerter den første tiden etter operasjonen, skal du ta direkte kontakt med kirurgen. Du vil få telefonnummeret til din kirurg ved utskrivelse.',
    },
  ]),

  textSection: {
    title: i18nStr({ no: 'God forberedelse gir best resultat', en: 'Good preparation gives the best result' }),
    lead: i18nText(
      'Å forberede seg godt før en overvektsoperasjon er viktig både for din helse og for et best mulig resultat. Hos oss i CMedical får du trygg og personlig veiledning, enten individuelt eller i gruppe, slik at du føler deg trygg og godt ivaretatt hele veien.',
    ),
    points: list(
      [
        {
          title: { no: 'Din personlige oppfølging', en: 'Your personal follow-up' },
          desc: 'Før og etter operasjonen møter du vårt erfarne tverrfaglige team, som kan bestå av både lege, sykepleier og klinisk ernæringsfysiolog – som hjelper deg med råd og støtte tilpasset akkurat deg.',
        },
        {
          title: { no: 'Bli mer aktiv i hverdagen', en: 'Be more active' },
          desc: 'Regelmessig fysisk aktivitet før operasjonen vil gjøre kroppen sterkere og bedre forberedt. Det er aldri for sent å starte, og små skritt teller!',
        },
        {
          title: { no: 'Støtte hele veien', en: 'Support all the way' },
          desc: 'Mange opplever at operasjonen hjelper dem å endre dårlige vaner, men forberedelse på forhånd gir deg en stor fordel. Vi tilbyr støtte både før og etter operasjonen for deg som trenger hjelp til å finne nye måter å håndtere vanskelige følelser på.',
        },
      ],
      false,
    ),
  },

  promises: [
    {
      _key: k(),
      eyebrow: i18nStr({ no: 'Fordeler med moderne kirurgi', en: 'Benefits of modern surgery' }),
      title: i18nStr({ no: 'Raskere restitusjon', en: 'Faster recovery' }),
      desc: i18nText(
        'Robotassistert kirurgi er en moderne, minimalt invasiv behandling hvor inngrepet utføres gjennom små snitt i stedet for et større operasjonssår. Denne skånsomme tilnærmingen kan gi flere fordeler for deg som pasient – blant annet mindre smerter, færre komplikasjoner og en raskere tilheling sammenlignet med tradisjonell åpen kirurgi.',
      ),
    },
    {
      _key: k(),
      eyebrow: i18nStr({ no: 'Fordeler med moderne kirurgi', en: 'Benefits of modern surgery' }),
      title: i18nStr({ no: 'Raskt tilbake til hverdagen', en: 'Quickly back to everyday life' }),
      desc: i18nText(
        'Etter operasjonen kan de fleste pasienter spise, drikke og bevege seg allerede samme kveld. Mange reiser hjem dagen etter inngrepet, og opplever en mer komfortabel og stressfri restitusjon.',
      ),
    },
    {
      _key: k(),
      eyebrow: i18nStr({ no: 'Fordeler med moderne kirurgi', en: 'Benefits of modern surgery' }),
      title: i18nStr({ no: 'Kortere sykemelding', en: 'Shorter sick leave' }),
      desc: i18nText(
        'Sykemeldingsperioden varierer, men etter robotassistert overvektskirurgi er de fleste sykemeldt i om lag fire uker. Vi følger nasjonale retningslinjer og tilpasser lengden etter jobb og forløp.',
      ),
    },
  ],

  expertAreas: {
    title: i18nStr({ no: 'Relaterte tjenester', en: 'Related services' }),
    items: [
      {
        _key: k(),
        title: i18nStr({ no: 'Robotassistert overvektskirurgi', en: 'Robot-assisted bariatric surgery' }),
        desc: i18nText('Les mer om rSG og SASI – robotassistert sleeve bypass.'),
        path: '/behandlinger/flere-fagomrader/gastrokirurgi/overvektskirurgi',
      },
      {
        _key: k(),
        title: i18nStr({ no: 'Mage- og tarmlidelser (Gastrokirurgi)', en: 'Gastrointestinal surgery' }),
        desc: i18nText('Hele fagområdet – fra brokk til endetarmsplager.'),
        path: '/behandlinger/flere-fagomrader/gastrokirurgi',
      },
      {
        _key: k(),
        title: i18nStr({ no: 'Ernæringsfysiolog', en: 'Clinical nutritionist' }),
        desc: i18nText('Kostveiledning og oppfølging før og etter operasjon.'),
        path: '/behandlinger/flere-fagomrader/ernaringsfysiolog',
      },
    ],
  },

  faqSectionTitle: i18nStr({ no: 'Ofte stilte spørsmål', en: 'Frequently asked questions' }),
  faqs: [
    ...SHARED_FAQS,
    ...faqList([
      {
        q: { no: 'Hvor lenge er jeg sykemeldt?', en: 'How long is the sick leave?' },
        a: {
          no: 'Etter overvektskirurgi er du vanligvis sykemeldt i ca. 4 uker, noe kortere for enkelte. Vi følger nasjonale retningslinjer.',
          en: 'After bariatric surgery you are usually on sick leave for about 4 weeks, shorter for some. We follow national guidelines.',
        },
      },
      {
        q: { no: 'Hvor lenge varer operasjonen?', en: 'How long does the surgery take?' },
        a: {
          no: 'Operasjonen varer vanligvis i 30–40 minutter. Du tilbringer natten hos oss og kan reise hjem neste formiddag.',
          en: 'The operation usually takes 30–40 minutes. You stay overnight and can go home the next morning.',
        },
      },
    ]),
  ],

  seo: {
    _type: 'seo',
    metaTitle: i18nStr({ no: 'Sleeve gastrektomi | CMedical', en: 'Sleeve gastrectomy | CMedical' }),
    metaDescription: i18nText({
      no: 'Robotassistert sleeve gastrektomi (rSG) hos CMedical: skånsom kikkhullskirurgi, kort ventetid, ingen henvisning og tverrfaglig oppfølging.',
      en: 'Robot-assisted sleeve gastrectomy (rSG) at CMedical: gentle keyhole surgery, short waiting time, no referral and multidisciplinary follow-up.',
    }),
    noIndex: false,
  },
  geoSummary: i18nText({
    no: 'Sleeve gastrektomi hos CMedical utføres robotassistert (rSG) som kikkhullskirurgi der 60–80 % av magesekken fjernes. Inngrepet tar 30–40 minutter, krever én natt på klinikken og følges opp av lege, sykepleier og klinisk ernæringsfysiolog i 12 måneder.',
    en: 'Sleeve gastrectomy at CMedical is performed robot-assisted (rSG) as keyhole surgery removing 60–80% of the stomach. The procedure takes 30–40 minutes, requires one night at the clinic and includes 12 months of follow-up by doctor, nurse and clinical nutritionist.',
  }),
}

/* ── 3. PMS og PMDD (~120 ord) ───────────────────────────────────────── */

const pmsOgPmdd = {
  _id: 'treatment.gynekologi.pms-og-pmdd',
  _type: 'treatment',
  pageRole: 'service',
  sortOrder: 30,
  title: i18nStr({ no: 'PMS og PMDD', en: 'PMS and PMDD' }),
  slug: i18nSlug('pms-og-pmdd', 'pms-and-pmdd'),
  categories: [{ ...catRef('gynekologi'), _key: k() }],
  category: catRef('gynekologi'),
  parentCategoryLabel: i18nStr({ no: 'Gynekologi', en: 'Gynaecology' }),
  homeBreadcrumbLabel: i18nStr({ no: 'Hjem', en: 'Home' }),

  heroTitle: i18nStr({ no: 'PMS og PMDD', en: 'PMS and PMDD' }),
  description: i18nText({
    no: 'Premenstruelt syndrom omfatter plagsomme fysiske og psykiske symptomer som opptrer regelmessig siste halvdel av syklus (lutealfasen). PMS (premenstruelt syndrom) er den milde formen som rammer opptil 75 % av alle kvinner, mens den alvorligere formen, PMDD (premenstruell dysforisk forstyrrelse), rammer 3–8 %.\n\nDet er mulig å få god hjelp – du skal slippe å lide hver måned. For spørsmål ta kontakt med oss eller bestill time.',
    en: 'Premenstrual syndrome covers troublesome physical and psychological symptoms that recur in the second half of the cycle (the luteal phase). PMS is the mild form, affecting up to 75% of women, while the more severe form, PMDD (premenstrual dysphoric disorder), affects 3–8%.\n\nGood help is available – you should not have to suffer every month. Contact us or book an appointment.',
  }),
  heroPoints: points([
    { no: 'Ingen ventetid', en: 'No waiting time' },
    { no: 'Ingen henvisning', en: 'No referral' },
  ]),
  rating: i18nStr('4,7'),
  primaryCtaLabel: i18nStr({ no: 'Bestill time', en: 'Book an appointment' }),
  seePricesLabel: i18nStr({ no: 'Se priser', en: 'See prices' }),
  seePricesHref: '/priser',
  callCtaLabel: i18nStr({ no: 'Ring oss', en: 'Call us' }),
  bookingService: 'pms-pmdd',

  reasonsTitle: i18nStr({ no: 'Symptomer', en: 'Symptoms' }),
  reasonsLayout: 'prose',
  reasons: list([
    {
      title: { no: 'Fysiske plager', en: 'Physical symptoms' },
      desc: 'De vanligste fysiske plagene er ømme bryst, oppblåsthet, magesmerter, vektøkning, hodepine, økt appetitt og tap av energi.',
    },
    {
      title: { no: 'Psykiske symptomer', en: 'Psychological symptoms' },
      desc: 'Psykiske symptomer omfatter irritabilitet, humørsvingninger, depresjon, angst og indre uro. Noen kvinner kan også få selvmordstanker disse dagene.',
    },
    {
      title: { no: 'Årsak', en: 'Cause' },
      desc: 'Årsaken er relatert til svingende hormoner.',
    },
  ]),

  promises: [
    {
      _key: k(),
      eyebrow: i18nStr({ no: 'Behandling', en: 'Treatment' }),
      title: i18nStr({ no: 'Du skal slippe å lide hver måned', en: 'You should not have to suffer every month' }),
      desc: i18nText(
        'Det er mulig å få god hjelp. Hos oss møter du gynekologer med erfaring i utredning og behandling av PMS og PMDD, og vi tilpasser behandlingen til dine plager.',
      ),
    },
    {
      _key: k(),
      eyebrow: i18nStr({ no: 'Tverrfaglig', en: 'Multidisciplinary' }),
      title: i18nStr({ no: 'Helhetlig tilnærming', en: 'A holistic approach' }),
      desc: i18nText(
        'Ved behov samarbeider gynekolog med psykolog, ernæringsfysiolog og sexolog, slik at både fysiske og psykiske sider av plagene blir ivaretatt.',
      ),
    },
  ],

  faqSectionTitle: i18nStr({ no: 'Ofte stilte spørsmål', en: 'Frequently asked questions' }),
  faqs: SHARED_FAQS,

  seo: {
    _type: 'seo',
    metaTitle: i18nStr({ no: 'PMS og PMDD | CMedical', en: 'PMS and PMDD | CMedical' }),
    metaDescription: i18nText({
      no: 'PMS og PMDD: utredning og behandling av premenstruelle plager hos gynekolog. Ingen henvisning, ingen ventetid.',
      en: 'PMS and PMDD: assessment and treatment of premenstrual symptoms by a gynaecologist. No referral, no waiting time.',
    }),
    noIndex: false,
  },
  geoSummary: i18nText({
    no: 'PMS rammer opptil 75 % av kvinner og PMDD 3–8 %. Symptomene kommer i lutealfasen og omfatter ømme bryst, oppblåsthet, hodepine, irritabilitet og humørsvingninger. CMedical tilbyr utredning og behandling hos gynekolog uten henvisning.',
    en: 'PMS affects up to 75% of women and PMDD 3–8%. Symptoms appear in the luteal phase and include breast tenderness, bloating, headache, irritability and mood swings. CMedical offers gynaecologist assessment and treatment without referral.',
  }),
}

/* ── Run ─────────────────────────────────────────────────────────────── */

const DOCS = [fertilitetsutredning, sleeveGastrektomi, pmsOgPmdd]

async function main() {
  console.log(
    `\n[migrate-live-missing-pages] ${DOCS.length} treatments — mode=${DRY_RUN ? 'DRY_RUN' : 'WRITE (createOrReplace)'}\n`,
  )

  const tx = sanityClient.transaction()
  for (const doc of DOCS) {
    console.log(`  ⇢  ${doc._id}`)
    if (!DRY_RUN) tx.createOrReplace(doc as any)
  }

  if (DRY_RUN) {
    console.log('\n(dry run — no writes)\n')
    console.log(JSON.stringify(DOCS, null, 2).slice(0, 1500) + '\n…')
    return
  }

  const res = await tx.commit({ visibility: 'async' })
  console.log(`\n✅ Committed ${res.results.length} mutations.\n`)
  console.log(
    'NB: heroImage / heroMedia is required for publish — legg inn hero-bilde i Studio for de tre sidene.\n',
  )
}

main().catch((e) => {
  console.error('❌ Migration failed:', e)
  process.exit(1)
})
