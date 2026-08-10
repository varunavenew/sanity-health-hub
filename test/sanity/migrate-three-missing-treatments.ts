/**
 * Recreates three treatment pages that exist live on production but have no
 * corresponding Sanity document at all (confirmed via read-only GROQ query —
 * zero matches for any of the three slugs, and "bariatrisk-kirurgi" isn't a
 * category in this dataset):
 *
 *   /no/fertilitet/fertilitetsutredning        -> treatment-fertilitet-fertilitetsutredning
 *   /no/bariatrisk-kirurgi/sleeve-gastrektomi  -> treatment-flere-fagomrader-sleeve-gastrektomi
 *   /no/gynekologi/pms-og-pmdd                 -> treatment-gynekologi-pms-og-pmdd
 *
 * Content is sourced from the dead static-data files still in this repo
 * (src/data/fertilitetSubPages.tsx, treatmentContent.ts, gynekologiSubPages.tsx
 * — pre-Sanity-migration content that was never carried over) and
 * cross-checked against the live production pages. English content is a
 * genuine translation, not a copy of the Norwegian text — the treatment
 * schema requires both languages for title/heroTitle/description/seo/geoSummary
 * to pass Studio validation (see test/schemaTypes/treatment.ts).
 *
 * Hero images: no dedicated photography exists for these three pages in this
 * repo. Each reuses the hero image already published on the closest sibling
 * treatment in the same category (Overvektskirurgi for sleeve-gastrektomi,
 * assistert-befruktning for fertilitetsutredning, Fostermedisin for
 * pms-og-pmdd) so the required field isn't left empty — but these are
 * borrowed placeholders, not dedicated photos, and should be swapped for
 * real images when available.
 *
 * Category note: sleeve-gastrektomi is filed under "flere-fagomrader" (where
 * the sibling "Overvektskirurgi" treatment already lives) since
 * "bariatrisk-kirurgi" isn't a category in this app. That changes the public
 * path from /bariatrisk-kirurgi/sleeve-gastrektomi to /ovrige/sleeve-gastrektomi
 * — a redirect for the old path should be added to next.config.ts separately.
 *
 * Uses createOrReplace — safe to re-run.
 *
 * Run:
 *   npx tsx sanity/migrate-three-missing-treatments.ts
 *   DRY_RUN=1 npx tsx sanity/migrate-three-missing-treatments.ts
 */

import { sanityClient } from './config'

const DRY_RUN = process.env.DRY_RUN === '1'

let k = 0
const key = (p = 'k') => `${p}${++k}`

const i18nString = (no: string, en: string) => [
  { _key: 'no', _type: 'internationalizedArrayStringValue', language: 'no', value: no },
  { _key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: en },
]
const i18nText = (no: string, en: string) => [
  { _key: 'no', _type: 'internationalizedArrayTextValue', language: 'no', value: no },
  { _key: 'en', _type: 'internationalizedArrayTextValue', language: 'en', value: en },
]
const slugField = (no: string, en: string) => [
  { _key: 'no', _type: 'internationalizedArraySlugValue', language: 'no', value: { _type: 'slug', current: no } },
  { _key: 'en', _type: 'internationalizedArraySlugValue', language: 'en', value: { _type: 'slug', current: en } },
]
const point = (titleNo: string, titleEn: string, descNo = '', descEn = '') => ({
  _key: key('pt'),
  title: i18nString(titleNo, titleEn),
  ...(descNo ? { desc: i18nText(descNo, descEn) } : {}),
})
const step = (nNo: string, nEn: string, titleNo: string, titleEn: string, descNo: string, descEn: string) => ({
  _key: key('fl'),
  n: i18nString(nNo, nEn),
  title: i18nString(titleNo, titleEn),
  desc: i18nText(descNo, descEn),
})
const reason = (nNo: string, nEn: string, titleNo: string, titleEn: string, descNo: string, descEn: string) => ({
  _key: key('rs'),
  n: i18nString(nNo, nEn),
  title: i18nString(titleNo, titleEn),
  desc: i18nText(descNo, descEn),
})
const heroImageRef = (assetId: string) => ({
  _type: 'image',
  asset: { _type: 'reference', _ref: assetId },
})
const relatedRef = (id: string) => ({ _key: key('rel'), _type: 'reference', _ref: id })

// Reused verbatim across all three (and across most of the dataset's existing
// treatments) — the standard "why choose us" promise block.
const standardPromises = [
  {
    _key: key('pr'),
    title: i18nString('Du bestemmer hva du er komfortabel med', 'You decide what you are comfortable with'),
    desc: i18nText(
      'Alle undersøkelser og inngrep gjøres i ditt tempo. Du kan stille spørsmål underveis og ta med deg noen om du ønsker det.',
      'All examinations and procedures are done at your own pace. You can ask questions along the way and bring someone with you if you wish.',
    ),
  },
  {
    _key: key('pr'),
    title: i18nString('Spesialister med dybde', 'Specialists with real depth'),
    desc: i18nText(
      'Hos oss møter du leger med erfaring fra ledende fagmiljøer — ikke en generalist på utplassering.',
      'You will meet doctors with experience from leading specialist environments — not a generalist filling in.',
    ),
  },
  {
    _key: key('pr'),
    title: i18nString('Alt under samme tak', 'Everything under one roof'),
    desc: i18nText(
      'Konsultasjon, undersøkelser og behandling i samme bygg. Vi koordinerer hele forløpet — ingenting forsvinner mellom sprekker.',
      'Consultation, examinations and treatment in the same building. We coordinate the entire process — nothing falls through the cracks.',
    ),
  },
]

const docs: Record<string, any> = {
  // ───────────────────────── FERTILITETSUTREDNING ─────────────────────────
  'treatment-fertilitet-fertilitetsutredning': {
    _id: 'treatment-fertilitet-fertilitetsutredning',
    _type: 'treatment',
    pageRole: 'service',
    title: i18nString('Fertilitetsutredning', 'Fertility work-up'),
    slug: slugField('fertilitetsutredning', 'fertility-workup'),
    categories: [{ _key: key('cat'), _type: 'reference', _ref: 'category-fertilitet' }],
    description: i18nText(
      'Å ta det første steget kan føles stort – enten du kommer alene eller sammen med en partner, og enten du vet hva du ønsker eller fortsatt er i en utforskende fase. Hos oss møter du et fagmiljø som tar seg tid til å lytte, forstå og veilede deg videre.',
      'Taking the first step can feel big — whether you come alone or with a partner, and whether you already know what you want or are still exploring your options. Here you meet a team that takes the time to listen, understand, and guide you forward.',
    ),
    heroTitle: i18nString('Et trygt *første steg*', 'A safe *first step*'),
    heroImage: heroImageRef('image-316dbff10d245d35d7090b05eaeea543b0575f26-1250x1080-jpg'),
    heroImageAlt: i18nString('Fertilitetsutredning hos CMedical', 'Fertility work-up at CMedical'),
    rating: i18nString('4,8 — Norges eldste private fertilitetsklinikk', "4.8 — Norway's oldest private fertility clinic"),
    heroPoints: [
      point('En uforpliktende start', 'A no-obligation start', 'Mange begynner med en samtale — vi tilpasser tempoet etter deg.', 'Many people start with a conversation — we adapt the pace to you.'),
      point('Grundig kartlegging', 'A thorough assessment', 'Blodprøver, ultralyd og sædanalyse gir et helhetlig bilde.', 'Blood tests, ultrasound and semen analysis give a complete picture.'),
      point('Felles plan videre', 'A shared plan going forward', 'Sammen går vi gjennom resultatene og snakker om alternativene.', 'Together we review the results and talk through the options.'),
      point('Samme team hele veien', 'The same team throughout', 'Du møter de samme fagpersonene — kontinuitet skaper trygghet.', 'You meet the same specialists — continuity builds trust.'),
    ],
    primaryCtaLabel: i18nString('Bestill fertilitetsutredning', 'Book a fertility work-up'),
    bookingService: 'fertilitetsutredning',
    flowTitle: i18nString('Slik foregår en fertilitetsutredning', 'How a fertility work-up works'),
    flow: [
      step('Steg 01', 'Step 01', 'Uforpliktende samtale', 'A no-obligation conversation', 'Du forteller om din situasjon, stiller spørsmål og blir kjent med mulighetene som finnes.', 'You tell us about your situation, ask questions, and learn about the options available.'),
      step('Steg 02', 'Step 02', 'Vi blir kjent med deg', 'We get to know you', 'Vi går gjennom livssituasjon, ønsker, forventninger og eventuell tidligere sykehistorie.', 'We go through your life situation, wishes, expectations, and any relevant medical history.'),
      step('Steg 03', 'Step 03', 'Medisinske undersøkelser', 'Medical examinations', 'Blodprøver og ultralyd av livmor og eggstokker for kvinner — sædanalyse for menn.', 'Blood tests and ultrasound of the uterus and ovaries for women — semen analysis for men.'),
      step('Steg 04', 'Step 04', 'Gjennomgang av resultater', 'Reviewing the results', 'Sammen ser vi på funnene og snakker om hva de betyr for deg.', 'Together we look at the findings and talk about what they mean for you.'),
      step('Steg 05', 'Step 05', 'Veien videre — i ditt tempo', 'The way forward — at your pace', 'Egen plan: fortsette på egen hånd, starte behandling, eller ta deg mer tid.', 'A plan of your own: continue on your own, start treatment, or take more time.'),
    ],
    reasonsTitle: i18nString('Alt du trenger å vite — steg for steg', 'Everything you need to know — step by step'),
    reasonsLead: i18nText(
      'Vi har samlet hele innholdet i utredningen i en oversikt du kan utforske i ditt eget tempo. Trykk på hvert tema for å lese mer.',
      "We've gathered the full work-up content into an overview you can explore at your own pace. Tap each topic to read more.",
    ),
    reasonsLayout: 'accordion',
    reasons: [
      reason('01', '01', 'En uforpliktende start', 'A no-obligation start',
        'Mange velger å starte med en samtale. Her får du mulighet til å fortelle om din situasjon, stille spørsmål og bli kjent med hvilke muligheter som finnes. Vi tilpasser tempoet etter deg. I første konsultasjon ønsker vi å forstå helheten – din eller deres livssituasjon, ønsker og forventninger, eventuell tidligere sykehistorie, og hvor dere er i prosessen. En fertilitetsutredning kan bestå av – for kvinner: blodprøver for hormonnivå, ultralyd av livmor og eggstokker; for menn: sædanalyse.',
        'Many people choose to start with a conversation. This gives you the chance to describe your situation, ask questions, and learn about the options available. We adapt the pace to you. In the first consultation, we want to understand the full picture — your life situation, wishes and expectations, any previous medical history, and where you are in the process. A fertility work-up can include — for women: blood tests for hormone levels, ultrasound of the uterus and ovaries; for men: semen analysis.'),
      reason('02', '02', 'Hva skjer etter utredningen?', 'What happens after the work-up?',
        'For noen gir utredningen trygghet og bekreftelse på at alt ser normalt ut. For andre kan den avdekke årsaker som gjør at behandling anbefales. Sammen går vi gjennom resultatene og snakker om aktuelle alternativer – enten det er å fortsette på egen hånd, starte behandling, eller ta seg litt mer tid.',
        "For some, the work-up brings reassurance that everything looks normal. For others, it can reveal causes that mean treatment is recommended. Together we go through the results and discuss the options — whether that's continuing on your own, starting treatment, or taking a bit more time."),
      reason('03', '03', 'Ingen beslutninger må tas med én gang', 'No decisions need to be made right away',
        'Det er helt vanlig å bruke tid på å kjenne etter hva som føles riktig. Noen er klare for neste steg raskt, mens andre trenger flere samtaler før de bestemmer seg.',
        "It's completely normal to take time to figure out what feels right. Some people are ready for the next step quickly, while others need several conversations before deciding."),
      reason('04', '04', 'Individuell oppfølging — hele veien', 'Individual follow-up — the whole way',
        'Vi tilpasser utredning, behandling og oppfølging til deg og din situasjon. Samtidig vet vi at dette ofte er en følelsesmessig prosess – og vi er her for å støtte deg, uansett hvor du er i løpet.',
        "We tailor the work-up, treatment and follow-up to you and your situation. We also know this is often an emotional process — and we're here to support you, wherever you are in it."),
      reason('05', '05', 'Før utredning', 'Before the work-up',
        'Vi anbefaler at du eller dere tar blodprøver i forkant av timen. Kontakt oss gjerne, så er vi behjelpelige med rekvirering av blodprøver.',
        "We recommend having blood tests taken ahead of your appointment. Feel free to contact us — we're happy to help arrange the blood test requisition."),
      reason('06', '06', 'Det første møtet', 'The first meeting',
        'Fordi infertilitet oppleves likt for kvinner og menn, anbefaler vi at dere begge stiller på den første samtalen. Samtalen vil i stor grad dreie seg om hvem du er, hvilke ønsker og mål du har, og ikke minst medisinsk historie. Vårt mål er at du går fra den første samtalen med all informasjon du trenger.',
        'Because infertility affects women and men alike, we recommend that you both attend the first conversation. The conversation will largely focus on who you are, your wishes and goals, and your medical history. Our goal is for you to leave the first conversation with all the information you need.'),
      reason('07', '07', 'Under fertilitetsutredningen', 'During the fertility work-up',
        'Du vil få vite alle eventuelle funn som blir gjort. Her får du igjen muligheten til å stille spørsmål om funn, mulig behandling og veien videre.',
        'You will be told about any findings made. This is another opportunity to ask questions about the findings, possible treatment, and the way forward.'),
      reason('08', '08', 'En emosjonell prosess', 'An emotional process',
        'Fertilitetsbehandling handler ikke bare om det medisinske – det er også en personlig og følelsesmessig reise. Mange opplever et spenn av følelser underveis: håp, usikkerhet, sårbarhet, forventning – og noen ganger skuffelse. Vi ønsker å være en trygg støttespiller gjennom hele prosessen.',
        'Fertility treatment is not just about the medical side — it is also a personal and emotional journey. Many people experience a range of feelings along the way: hope, uncertainty, vulnerability, anticipation — and sometimes disappointment. We want to be a steady support throughout the process.'),
      reason('09', '09', 'Rådgivning: Fertilitetsbehandling og parforholdet', 'Counselling: fertility treatment and your relationship',
        'En lang periode med forsøk på å bli gravide kan påvirke både nærhet og seksualitet i parforholdet. Hos CMedical møter vi dette med en helhetlig tilnærming, der både fysiske, psykiske og relasjonelle sider ivaretas. Sexologisk rådgivning er en del av tilbudet.',
        'A long period of trying to conceive can affect both closeness and intimacy in a relationship. At CMedical we approach this holistically, addressing the physical, psychological and relational sides together. Sexological counselling is part of what we offer.'),
    ],
    promises: standardPromises,
    relatedSection: {
      _type: 'object',
      title: i18nString('Relaterte tjenester', 'Related services'),
      items: [relatedRef('treatment-fertilitet-ivf'), relatedRef('treatment-fertilitet-saedanalyse')],
    },
    seo: {
      _type: 'seo',
      metaTitle: i18nString('Fertilitetsutredning | CMedical — et trygt første steg', 'Fertility work-up | CMedical — a safe first step'),
      metaDescription: i18nText(
        'Fertilitetsutredning hos CMedical. Blodprøver, ultralyd og sædanalyse — en grundig kartlegging som gir deg trygghet og oversikt over veien videre.',
        'Fertility work-up at CMedical. Blood tests, ultrasound and semen analysis — a thorough assessment that gives you clarity and confidence about the way forward.',
      ),
      noIndex: false,
    },
    geoSummary: i18nText(
      'Fertilitetsutredning med blodprøver, ultralyd og sædanalyse — et trygt første steg for par og enkeltpersoner.',
      'Fertility work-up with blood tests, ultrasound and semen analysis — a safe first step for couples and individuals.',
    ),
  },

  // ───────────────────────── SLEEVE GASTREKTOMI ─────────────────────────
  'treatment-flere-fagomrader-sleeve-gastrektomi': {
    _id: 'treatment-flere-fagomrader-sleeve-gastrektomi',
    _type: 'treatment',
    pageRole: 'service',
    title: i18nString('Sleeve gastrektomi', 'Sleeve gastrectomy'),
    slug: slugField('sleeve-gastrektomi', 'sleeve-gastrectomy'),
    categories: [{ _key: key('cat'), _type: 'reference', _ref: 'category-flere-fagomrader' }],
    description: i18nText(
      'Robotassistert kirurgi for sleeve gastrektomi (rSG) er en moderne form for laparoskopisk (kikkhull) overvektskirurgi, hvor den nyeste teknologien brukes for å oppnå enda større presisjon enn ved tradisjonell teknikk. Under inngrepet fjernes 60–80 % av magesekken, og den gjenværende delen formes til en smal «sleeve» som begrenser matinntaket.',
      'Robot-assisted sleeve gastrectomy (rSG) is a modern form of laparoscopic (keyhole) weight-loss surgery, using the latest technology to achieve even greater precision than traditional technique. During the procedure, 60–80% of the stomach is removed, and the remaining part is shaped into a narrow "sleeve" that limits food intake.',
    ),
    heroTitle: i18nString('Robotassistert *sleeve gastrektomi*', 'Robot-assisted *sleeve gastrectomy*'),
    heroImage: heroImageRef('image-347ebad6b6f4c668a131ddfa4c38d1833cc2cb39-1250x1080-jpg'),
    heroImageAlt: i18nString('Robotassistert overvektskirurgi hos CMedical', 'Robot-assisted weight-loss surgery at CMedical'),
    rating: i18nString('Eneste private aktør i Norden med robotassistert overvektskirurgi', 'The only private provider in the Nordics offering robot-assisted weight-loss surgery'),
    heroPoints: [
      point('Høy presisjon', 'High precision', '3D-visualisering og mikrobevegelser styrt av erfarne kirurger.', '3D visualisation and micro-movements controlled by experienced surgeons.'),
      point('Kort liggetid', 'Short hospital stay', 'Én natt til observasjon — hjem neste formiddag.', 'One night for observation — home the next morning.'),
      point('Strukturert oppfølging', 'Structured follow-up', 'Ett års oppfølgingspakke med klinisk ernæringsfysiolog inkludert.', 'A one-year follow-up package with a clinical nutritionist included.'),
    ],
    primaryCtaLabel: i18nString('Bestill konsultasjon', 'Book a consultation'),
    bookingService: 'sleeve-gastrektomi',
    flowTitle: i18nString('Veien gjennom behandlingen', 'The treatment journey'),
    flow: [
      step('Steg 01', 'Step 01', 'Forberedelse', 'Preparation', 'Du møter vårt tverrfaglige team for en grundig samtale, og følger en medisinsk lavkaloriediett (800–1200 kalorier/dag) i tre uker før operasjonen. Røykeslutt er et krav før operasjon.', 'You meet our multidisciplinary team for a thorough consultation, and follow a medical low-calorie diet (800–1200 calories/day) for three weeks before surgery. Quitting smoking is required before the operation.'),
      step('Steg 02', 'Step 02', 'Operasjonsdagen', 'The day of surgery', 'Inngrepet gjøres skånsomt via kikkhullskirurgi og tar cirka 30–40 minutter.', 'The procedure is performed gently via keyhole surgery and takes approximately 30–40 minutes.'),
      step('Steg 03', 'Step 03', 'Etter operasjonen', 'After the operation', 'Du tilbringer én natt hos oss til observasjon og reiser hjem neste formiddag. Inkludert i prisen er en oppfølgingspakke på ett år med fire konsultasjoner hos klinisk ernæringsfysiolog.', 'You spend one night with us for observation and travel home the following morning. The price includes a one-year follow-up package with four consultations with a clinical nutritionist.'),
    ],
    reasonsTitle: i18nString('Fordeler med robotassistert kirurgi', 'Benefits of robot-assisted surgery'),
    reasonsLayout: 'prose',
    reasons: [
      reason('01', '01', 'Mindre smerter, kortere restitusjon', 'Less pain, shorter recovery', 'Mindre smerter og kortere restitusjonstid enn ved tradisjonell kirurgi.', 'Less pain and a shorter recovery time than traditional surgery.'),
      reason('02', '02', 'Redusert blodtap', 'Reduced blood loss', 'Redusert blodtap og færre komplikasjoner.', 'Reduced blood loss and fewer complications.'),
      reason('03', '03', 'Bedre kosmetisk resultat', 'A better cosmetic result', 'Bedre kosmetisk resultat gjennom små, skånsomme snitt i bukveggen.', 'A better cosmetic result through small, gentle incisions in the abdominal wall.'),
      reason('04', '04', 'Raskere tilbake i hverdagen', 'Back to everyday life sooner', 'Mange reiser hjem allerede dagen etter operasjonen.', 'Many people travel home the day after surgery.'),
      reason('05', '05', 'Kortere sykemelding', 'Shorter sick leave', 'Cirka fire ukers sykemelding — kortere for noen.', 'Around four weeks of sick leave — shorter for some.'),
    ],
    promises: standardPromises,
    relatedSection: {
      _type: 'object',
      title: i18nString('Relaterte tjenester', 'Related services'),
      items: [
        relatedRef('treatment-flere-fagomrader-overvektskirurgi'),
        relatedRef('treatment-flere-fagomrader-gastrokirurgi-brokkoperasjon'),
        relatedRef('treatment-flere-fagomrader-ernaringsfysiolog'),
      ],
    },
    seo: {
      _type: 'seo',
      metaTitle: i18nString('Sleeve gastrektomi | CMedical — robotassistert overvektskirurgi', 'Sleeve gastrectomy | CMedical — robot-assisted weight-loss surgery'),
      metaDescription: i18nText(
        'Robotassistert sleeve gastrektomi (rSG) hos CMedical — moderne overvektskirurgi med høy presisjon, kort liggetid og strukturert oppfølging.',
        'Robot-assisted sleeve gastrectomy (rSG) at CMedical — modern weight-loss surgery with high precision, a short hospital stay, and structured follow-up.',
      ),
      noIndex: false,
    },
    geoSummary: i18nText(
      'Robotassistert sleeve gastrektomi (rSG) — kikkhullskirurgi der 60–80 % av magesekken fjernes for varig vekttap.',
      'Robot-assisted sleeve gastrectomy (rSG) — keyhole surgery removing 60–80% of the stomach for lasting weight loss.',
    ),
  },

  // ───────────────────────── PMS OG PMDD ─────────────────────────
  'treatment-gynekologi-pms-og-pmdd': {
    _id: 'treatment-gynekologi-pms-og-pmdd',
    _type: 'treatment',
    pageRole: 'service',
    title: i18nString('PMS og PMDD', 'PMS and PMDD'),
    slug: slugField('pms-og-pmdd', 'pms-and-pmdd'),
    categories: [{ _key: key('cat'), _type: 'reference', _ref: 'category-gynekologi' }],
    description: i18nText(
      'Premenstruelt syndrom (PMS) omfatter plagsomme fysiske og psykiske symptomer som opptrer regelmessig i siste halvdel av syklus (lutealfasen). PMDD er en alvorlig form for premenstruelt syndrom og rammer 3–8 % av kvinner. Hos oss møter du spesialister som tar plagene på alvor — og tilbyr moderne behandling.',
      'Premenstrual syndrome (PMS) covers troublesome physical and psychological symptoms that occur regularly in the second half of the cycle (the luteal phase). PMDD is a severe form of premenstrual syndrome, affecting 3–8% of women. Here you will meet specialists who take these symptoms seriously — and offer modern treatment.',
    ),
    heroTitle: i18nString('Når mensen tar over *halve livet*', 'When your cycle takes over *half your life*'),
    heroImage: heroImageRef('image-23010971c6294d5d740b718c193a281eca8df6d2-1250x1080-jpg'),
    heroImageAlt: i18nString('Utredning av PMS og PMDD hos CMedical', 'PMS and PMDD assessment at CMedical'),
    heroPoints: [
      point('Moderne diagnostikk', 'Modern diagnostics', 'Vi bruker validerte verktøy for å skille PMS fra PMDD og annen psykisk sykdom.', 'We use validated tools to distinguish PMS from PMDD and other mental health conditions.'),
      point('Bredt behandlingsspekter', 'A broad range of treatment', 'Hormonell, medikamentell og psykologisk behandling — i kombinasjon når det trengs.', 'Hormonal, medical and psychological treatment — combined when needed.'),
      point('Helhetlig vurdering', 'A holistic assessment', 'Vi ser også på søvn, livsstil og andre faktorer som forsterker plagene.', 'We also look at sleep, lifestyle and other factors that make symptoms worse.'),
      point('Tverrfaglig støtte', 'Multidisciplinary support', 'Tilgang til psykolog og ernæringsfysiolog når det er aktuelt.', 'Access to a psychologist and nutritionist when relevant.'),
    ],
    rating: i18nString('4,8 — Spesialister på kvinnehelse', "4.8 — Women's health specialists"),
    primaryCtaLabel: i18nString('Bestill utredning', 'Book an assessment'),
    bookingService: 'pms-pmdd',
    flowTitle: i18nString('Slik utreder vi PMS og PMDD', 'How we assess PMS and PMDD'),
    flow: [
      step('Steg 01', 'Step 01', 'Symptomdagbok', 'Symptom diary', 'Du fører dagbok over to sykluser — det er nøkkelen til riktig diagnose.', 'You keep a diary over two cycles — this is the key to an accurate diagnosis.'),
      step('Steg 02', 'Step 02', 'Konsultasjon', 'Consultation', 'Vi går gjennom dagbok og helhetlig livssituasjon sammen.', 'We go through the diary and your overall life situation together.'),
      step('Steg 03', 'Step 03', 'Diagnose', 'Diagnosis', 'PMS, PMDD eller annen tilstand — vi forklarer hva mønstrene betyr.', 'PMS, PMDD or another condition — we explain what the patterns mean.'),
      step('Steg 04', 'Step 04', 'Behandling', 'Treatment', 'SSRI, hormonell behandling, livsstilsendringer eller kombinasjon — basert på dine plager.', 'SSRIs, hormonal treatment, lifestyle changes or a combination — based on your symptoms.'),
    ],
    reasonsTitle: i18nString("Når er det mer enn 'bare PMS'?", "When is it more than 'just PMS'?"),
    reasonsLead: i18nText(
      'Forskjellen mellom PMS og PMDD ligger i alvorlighetsgrad og hvordan symptomene påvirker livet ditt. Disse tegnene tilsier utredning.',
      'The difference between PMS and PMDD lies in severity and how much the symptoms affect your life. These signs suggest it is worth getting assessed.',
    ),
    reasonsLayout: 'prose',
    reasons: [
      reason('01', '01', 'Kraftige humørsvingninger', 'Severe mood swings', 'Sinne, gråt eller fortvilelse i ukene før mensen — som forsvinner når mensen kommer.', 'Anger, crying or despair in the weeks before your period — which disappear once your period starts.'),
      reason('02', '02', 'Angst og indre uro', 'Anxiety and inner unrest', 'Følelse av at ting tårner seg opp — kun i siste del av syklusen.', 'A feeling that things are piling up — only in the last part of the cycle.'),
      reason('03', '03', 'Nedstemthet og håpløshet', 'Low mood and hopelessness', 'Depressive tanker som kommer og går med syklusen.', 'Depressive thoughts that come and go with the cycle.'),
      reason('04', '04', 'Konflikter i nære relasjoner', 'Conflict in close relationships', 'Plagene påvirker forhold til partner, barn eller kolleger.', 'The symptoms affect your relationship with your partner, children or colleagues.'),
      reason('05', '05', 'Søvnproblemer', 'Sleep problems', 'Innsovning, oppvåkning eller mareritt forsterket av syklusen.', 'Trouble falling asleep, waking up, or nightmares made worse by the cycle.'),
      reason('06', '06', 'Sykmeldinger eller fravær', 'Sick leave or absence', 'Når plagene gjør at du ikke kan jobbe eller fungere normalt.', 'When the symptoms mean you cannot work or function normally.'),
    ],
    promises: standardPromises,
    relatedSection: {
      _type: 'object',
      title: i18nString('Relaterte tjenester', 'Related services'),
      items: [
        relatedRef('treatment-gynekologi-pmos'),
        relatedRef('treatment-gynekologi-overgangsalder'),
        relatedRef('treatment-gynekologi-endometriose'),
      ],
    },
    seo: {
      _type: 'seo',
      metaTitle: i18nString('PMS og PMDD | CMedical — utredning og behandling', 'PMS and PMDD | CMedical — assessment and treatment'),
      metaDescription: i18nText(
        'Når premenstruelle plager tar over livet ditt. Vi utreder og behandler PMS og PMDD med moderne kunnskap.',
        'When premenstrual symptoms take over your life. We assess and treat PMS and PMDD using modern knowledge.',
      ),
      noIndex: false,
    },
    geoSummary: i18nText(
      'Utredning og behandling av PMS og PMDD — alvorlig premenstruelt syndrom som rammer 3–8 % av kvinner.',
      'Assessment and treatment of PMS and PMDD — severe premenstrual syndrome affecting 3–8% of women.',
    ),
  },
}

async function main() {
  const ids = Object.keys(docs)
  console.log(`\n[migrate-three-missing-treatments] ${ids.length} documents — mode=${DRY_RUN ? 'DRY_RUN' : 'WRITE'}\n`)
  for (const id of ids) {
    console.log(`  ⇢  ${id}`)
    if (!DRY_RUN) {
      await sanityClient.createOrReplace(docs[id])
    }
  }
  if (DRY_RUN) {
    console.log('\n(dry run — no writes)\n')
    return
  }
  console.log('\n✅ Created 3 treatment documents.\n')
}

main().catch((e) => {
  console.error('❌ Migration failed:', e)
  process.exit(1)
})
