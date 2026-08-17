/**
 * Translate article Norwegian fields into English and write them to Sanity.
 *
 * Does not overwrite EN that is already different from NO.
 *
 * Usage (from test/):
 *   npm run migrate:articles-en:dry
 *   npm run migrate:articles-en
 */
import { sanityClient } from './config'
import {
  cloneBlocksFresh,
  mergeI18nBioEn,
  mergeI18nTextEn,
  readI18nNoBlocks,
  readI18nNoText,
} from './lib/specialist-bio-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const ARTICLE_ID = 'article-overgangsalderen-er-en-ny-fase-ikke-slutten-pa-noe'

type I18nItem = {
  _type?: string
  _key?: string
  language?: string
  value?: unknown
}

function langOf(item: I18nItem): string | undefined {
  return item.language || item._key
}

function mergeI18nStringEn(existing: unknown, enValue: string): unknown[] {
  const items = Array.isArray(existing) ? [...(existing as I18nItem[])] : []
  const enEntry = {
    _type: 'internationalizedArrayStringValue' as const,
    _key: 'en',
    language: 'en' as const,
    value: enValue,
  }
  const enIdx = items.findIndex((item) => langOf(item) === 'en')
  if (enIdx >= 0) items[enIdx] = { ...items[enIdx], ...enEntry }
  else items.push(enEntry)
  return items
}

function applySpanMap(blocks: unknown[], map: Record<string, string>): unknown[] {
  const cloned = cloneBlocksFresh(blocks)
  for (const block of cloned) {
    const b = block as Record<string, unknown>
    if (b._type !== 'block' || !Array.isArray(b.children)) continue
    for (const child of b.children as Record<string, unknown>[]) {
      if (child._type !== 'span' || typeof child.text !== 'string') continue
      const next = map[child.text]
      if (next) child.text = next
    }
  }
  return cloned
}

const MENOPAUSE_SPANS: Record<string, string> = {
  'Av Unni-Lovise Godager Berge, CMedical': 'By Unni-Lovise Godager Berge, CMedical',
  'Symptomene på overgangsalderen starter ofte tidligere enn mange tror, som regel i første halvdel av 40-årene og opp til 10 år før menstruasjonen uteblir. For noen kvinner er overgangen knapt merkbar, mens andre opplever så store utfordringer at det påvirker både hverdagen og livskvaliteten.':
    'Menopause symptoms often start earlier than many people think — usually in the first half of the 40s, and up to 10 years before periods stop. For some women the transition is barely noticeable, while others experience challenges so significant that they affect everyday life and quality of life.',
  '– «Overgangsalderen er en naturlig del av livet, men for mange kan symptomene være både overveldende og forvirrende. Jeg møter mange kvinner som ikke helt forstår hva som skjer med kroppen deres, og som kanskje heller ikke blir tatt på alvor,» sier Birgitte Mitlid-Mork, gynekolog og spesialist i overgangsalder ved CMedical.':
    '– “Menopause is a natural part of life, but for many the symptoms can be both overwhelming and confusing. I meet many women who do not quite understand what is happening to their body, and who may not be taken seriously either,” says Birgitte Mitlid-Mork, gynaecologist and menopause specialist at CMedical.',
  'Store individuelle forskjeller': 'Large individual differences',
  'De første tegnene kan ofte merkes gjennom uregelmessige menstruasjoner og hetetokter. Mange opplever også endringer i humør, søvnvansker og redusert energi.':
    'The first signs are often irregular periods and hot flushes. Many also experience mood changes, sleep problems and reduced energy.',
  '– «Noen merker knapt at de går gjennom en hormonell endring, mens andre får symptomer som påvirker både jobb, familieliv og selvfølelse. Det er store individuelle forskjeller, og derfor finnes det heller ingen ‘one size fits all’-løsning,» forklarer Birgitte.':
    '– “Some barely notice that they are going through a hormonal change, while others get symptoms that affect work, family life and self-esteem. There are large individual differences, which is why there is no one-size-fits-all solution,” Birgitte explains.',
  'Vanlige symptomer inkluderer blant annet:': 'Common symptoms include:',
  Blødningsforstyrrelser: 'Bleeding irregularities',
  'Hetetokter og nattesvette': 'Hot flushes and night sweats',
  'Hjernetåke og konsentrasjonsvansker': 'Brain fog and difficulty concentrating',
  Søvnproblemer: 'Sleep problems',
  'Emosjonell ustabilitet': 'Emotional instability',
  'Smerter i muskler og ledd': 'Muscle and joint pain',
  'Endringer i hud og hår': 'Changes in skin and hair',
  'Redusert sexlyst og tørrhet i skjeden': 'Reduced sex drive and vaginal dryness',
  'Mer enn bare hetetokter': 'More than just hot flushes',
  'Selve menopausen defineres som tidspunktet der menstruasjonen har uteblitt i 12 måneder. Men perioden før, den såkalte perimenopausen, kan vare i flere år.':
    'Menopause itself is defined as the point when periods have been absent for 12 months. The period before that — perimenopause — can last for several years.',
  '– «Dette er en tid hvor hormonnivåene svinger, og det påvirker hele kroppen. Mange får symptomer som de ikke forbinder med overgangsalder, som angst, lavt energinivå eller smerter i kroppen,» sier Birgitte.':
    '– “This is a time when hormone levels fluctuate, and that affects the whole body. Many get symptoms they do not associate with menopause, such as anxiety, low energy or body pain,” says Birgitte.',
  'Hun understreker at nedgangen i østrogen, progesteron og testosteron ikke bare gir plager her og nå, men også kan øke risikoen for beinskjørhet, hjerte- og karsykdommer og depresjon på sikt.':
    'She emphasises that the decline in oestrogen, progesterone and testosterone does not only cause symptoms here and now, but can also increase the long-term risk of osteoporosis, cardiovascular disease and depression.',
  '– «Derfor er det viktig å ta symptomer på alvor, ikke bare for å bedre livskvaliteten, men også for å forebygge fremtidige helseproblemer,» sier hun.':
    '– “That is why it is important to take symptoms seriously, not only to improve quality of life, but also to prevent future health problems,” she says.',
  'Mange blir feildiagnostisert, og sendt hjem med medisiner for angst og depresjon, men så viser det seg at det er handler om overgangsalder, og symptomene må behandles på en helt annen måte.':
    'Many are misdiagnosed and sent home with medication for anxiety and depression, only for it to turn out to be menopause — which needs to be treated in a completely different way.',
  'Helhetlig behandling, skreddersydd for deg': 'Holistic treatment, tailored to you',
  'Hos CMedical tilbys en grundig kartleggingssamtale der kvinnens livssituasjon og helse gjennomgås i detalj. Samtalen varer i omtrent 45 minutter og inkluderer medisinsk vurdering, blodprøver ved behov og utarbeidelse av en personlig behandlingsplan.':
    'At CMedical, women are offered a thorough assessment appointment where their life situation and health are reviewed in detail. The conversation lasts about 45 minutes and includes a medical assessment, blood tests if needed, and a personal treatment plan.',
  '– «Vårt mål er at hver pasient skal føle seg både sett og hørt, uansett hvilken fase i livet hun er i. Det finnes gode og trygge behandlingsalternativer som kan gi bedre livskvalitet og gjøre denne fasen lettere å håndtere,» forteller Birgitte.':
    '– “Our goal is that every patient should feel both seen and heard, regardless of which phase of life she is in. There are good, safe treatment options that can improve quality of life and make this phase easier to manage,” says Birgitte.',
  'Behandlingen kan også inkludere tverrfaglig samarbeid med andre fagpersoner hos CMedical, som ernæringsfysiolog, osteopat, psykolog eller sexolog, alt basert på den enkeltes behov.':
    'Treatment can also include interdisciplinary collaboration with other specialists at CMedical, such as a dietitian, osteopath, psychologist or sexologist, based on each person’s needs.',
  'Et tverrfaglig ekspertteam': 'An interdisciplinary expert team',
  'Ved CMedical møter pasientene et dedikert team av spesialister på overgangsalder: Ida Bjørntvedt, Birgitte Aspenes, Birgitte Mitlid-Mork og Madeleine Engen. Alle er medlemmer av British Menopause Society, og klinikken samarbeider med Newson Health i Storbritannia som er verdens ledende klinikk innen overgangsalder.':
    'At CMedical, patients meet a dedicated team of menopause specialists: Ida Bjørntvedt, Birgitte Aspenes, Birgitte Mitlid-Mork and Madeleine Engen. All are members of the British Menopause Society, and the clinic collaborates with Newson Health in the UK, a world-leading menopause clinic.',
  '– «Vi jobber etter prinsippet om de fire søylene; hormoner, relasjoner, ernæring og fysisk form. Når disse delene balanseres, oppnår vi den beste helheten for pasientene våre,» forklarer Birgitte.':
    '– “We work according to the principle of the four pillars: hormones, relationships, nutrition and physical fitness. When these parts are in balance, we achieve the best overall outcome for our patients,” Birgitte explains.',
  'Et viktig budskap til alle kvinner– «Overgangsalderen handler ikke om å miste noe, men om å gå inn i en ny fase av livet. Med riktig kunnskap og behandling kan kvinner oppleve mer energi, bedre søvn, bedre humør, og større trygghet i egen kropp,» sier Birgitte Mitlid-Mork.':
    'An important message to all women – “Menopause is not about losing something, but about entering a new phase of life. With the right knowledge and treatment, women can experience more energy, better sleep, a better mood, and greater confidence in their own body,” says Birgitte Mitlid-Mork.',
}

const COPY: Record<string, { title: string; excerpt: string; alt?: string }> = {
  [ARTICLE_ID]: {
    title: 'Menopause is a new phase, not the end of something',
    excerpt:
      'Menopause symptoms often start earlier than many people think. Gynaecologist Birgitte Mitlid-Mork explains what happens to the body and which treatment options are available.',
    alt: 'Menopause is a new phase, not the end of something',
  },
  'article-historiene-ingen-snakker-om-etter-fodsel': {
    title: 'The stories no one talks about after childbirth',
    excerpt:
      'For many women it is hard to talk about problems after childbirth. Injuries can be invisible to others, yet still leave deep physical and psychological marks.',
    alt: 'The stories no one talks about after childbirth',
  },
  'article-jeg-matte-grate-pa-telefonen-for-a-bli-tatt-pa-alvor': {
    title: '“I had to cry on the phone to be taken seriously”',
    excerpt:
      'When Kristine had her first son, she expected a normal recovery. Instead the pain was unbearable — even a short walk with the pram became impossible. “I knew something was wrong, but no one would listen. Time and again I was told this was completely normal,” says Kristine Flygind Bjerke.',
    alt: '“I had to cry on the phone to be taken seriously”',
  },
  'article-livio-oslo-blir-en-del-av-cmedical-og-tilbudet-til-pasientene-styrkes': {
    title: 'Livio Oslo becomes part of CMedical — strengthening the offer to patients',
    excerpt:
      'For almost 40 years, Livio Oslo has been a pioneer in assisted reproduction. The clinic is now part of CMedical, bringing fertility treatment and surgery together under one roof.',
    alt: 'Livio Oslo becomes part of CMedical — strengthening the offer to patients',
  },
  'article-madeleine-engen-vinner-av-kvinnehelseprisen-her-awards-2026': {
    title: 'Madeleine Engen — winner of the Women’s Health Prize at HER Awards 2026',
    excerpt:
      'Gynaecologist Madeleine Engen is honoured with the Women’s Health Prize at HER Awards 2026 for her work highlighting birth injuries and giving women a voice in healthcare.',
    alt: 'Madeleine Engen — winner of the Women’s Health Prize at HER Awards 2026',
  },
  'article-maria-falt-i-sahara-og-mellom-alle-stoler-i-helse-norge': {
    title: 'Maria fell in the Sahara — and through the cracks in Norwegian healthcare',
    excerpt:
      'An accident in the Sahara in February 2024 was the start of a year filled with pain, distrust and a fight against the system. Maria Teresa Cristofoli (54) now wants to speak up for those who are not seen in public healthcare. “People who are on long-term sick leave do not always choose that themselves,” she says.',
    alt: 'Maria fell in the Sahara — and through the cracks in Norwegian healthcare',
  },
  'article-minis-historie-gjennom-mutterns-oyne': {
    title: 'Mini’s story through Muttern’s eyes',
    excerpt:
      'For Kathinka “Muttern” Gyllenhammar, leading people through polar regions is part of the job. Nothing could prepare her for the journey her daughter Emma “Mini” was about to take.',
    alt: 'Mini’s story through Muttern’s eyes',
  },
  'article-nar-kroppen-ikke-fungerer-etter-fodsel-og-ingen-lytter': {
    title: 'When the body does not work after childbirth — and no one listens',
    excerpt:
      'Gynaecologist Madeleine Engen on vaginal prolapse — one of the most common and most overlooked birth injuries. According to WHO, 36 percent of women who give birth vaginally are left with permanent sequelae.',
    alt: 'When the body does not work after childbirth — and no one listens',
  },
  'article-robotassistert-overvektskirurgi-presisjon-trygghet-og-varige-resultater': {
    title: 'Robot-assisted obesity surgery — precision, safety and lasting results',
    excerpt:
      'As the only private provider in the Nordic region, CMedical offers robot-assisted obesity surgery with the highest precision and a gentle approach, using advanced 3D visualisation and micro-movements controlled by experienced surgeons.',
    alt: 'Robot-assisted obesity surgery — precision, safety and lasting results',
  },
  'article-slik-forbereder-hun-seg-til-sydpolen': {
    title: 'How she is preparing for the South Pole',
    excerpt:
      'After two years of intense pain despite previous surgery, Emma “Mini” Gyllenhammar had to start over. Now, after a successful hip operation at CMedical, she is training systematically for the South Pole.',
    alt: 'How she is preparing for the South Pole',
  },
  'article-tanken-slo-meg-ikke-at-det-kunne-vaere-meg': {
    title: '“It never occurred to me that it could be me”',
    excerpt:
      'When children do not come, many assume the issue lies with the woman — but in one in three cases it is actually the man. Even so, many men hesitate to get checked. Synne Pernille Jakobsen and Chris Kristiansen now share their story to break the taboo, and encourage couples to get checked early.',
    alt: '“It never occurred to me that it could be me”',
  },
  'article-ved-a-lukke-kvinnehelsegapet-kan-hver-kvinne-fa-syv-flere-friske-dager-i-lopet-av-et-ar': {
    title: 'Closing the women’s health gap could give every woman seven extra healthy days a year',
    excerpt:
      'Closing the women’s health gap could add NOK 80 billion to the Norwegian economy by 2040, according to McKinsey and the World Economic Forum. Better healthcare for women means fewer health challenges, better quality of life, higher workforce participation and higher productivity — which benefits politicians, business and family life.',
    alt: 'Closing the women’s health gap could give every woman seven extra healthy days a year',
  },
  'article-vi-har-alltid-visst-at-vi-ville-bli-foreldre-sammen': {
    title: '“We always knew we wanted to become parents together”',
    excerpt:
      'A couple who have long known they wanted to build a family together share their path to parenthood — with assisted reproduction and close follow-up from the specialists at Livio Oslo, part of CMedical.',
    alt: '“We always knew we wanted to become parents together”',
  },
  'article-cmedical-og-nors-care-inngar-samarbeid-vil-styrke-kvinners-kunnskap-om-egen-helse': {
    title:
      'CMedical and Nors Care enter into a collaboration — strengthening women’s knowledge about their own health',
    excerpt: '',
  },
}

async function patchArticle(id: string) {
  const doc = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_id == $id][0]{ _id, title, excerpt, body, geoSummary, primaryImage }`,
    { id },
  )
  if (!doc) {
    console.log(`  ✗ missing ${id}`)
    return false
  }

  const copy = COPY[id]
  if (!copy) return false

  const patch: Record<string, unknown> = {}
  const titleNo = Array.isArray(doc.title)
    ? String((doc.title as I18nItem[]).find((i) => langOf(i) === 'no')?.value || '')
    : ''
  const titleEn = Array.isArray(doc.title)
    ? String((doc.title as I18nItem[]).find((i) => langOf(i) === 'en')?.value || '')
    : ''

  if (copy.title && (titleEn === titleNo || !titleEn.trim() || /&#39;/.test(titleEn))) {
    patch.title = mergeI18nStringEn(doc.title, copy.title)
  }

  const excerptNo = readI18nNoText(doc.excerpt) || ''
  const excerptEn = Array.isArray(doc.excerpt)
    ? String((doc.excerpt as I18nItem[]).find((i) => langOf(i) === 'en')?.value || '')
    : ''
  if (copy.excerpt && (excerptEn === excerptNo || !excerptEn.trim())) {
    patch.excerpt = mergeI18nTextEn(doc.excerpt, copy.excerpt)
  }

  const image = doc.primaryImage as { alt?: unknown } | undefined
  if (copy.alt && image) {
    const altNo = Array.isArray(image.alt)
      ? String((image.alt as I18nItem[]).find((i) => langOf(i) === 'no')?.value || '')
      : ''
    const altEn = Array.isArray(image.alt)
      ? String((image.alt as I18nItem[]).find((i) => langOf(i) === 'en')?.value || '')
      : ''
    if (altEn === altNo || !altEn.trim()) {
      patch['primaryImage.alt'] = mergeI18nStringEn(image.alt, copy.alt)
    }
  }

  if (id === ARTICLE_ID) {
    const noBlocks = readI18nNoBlocks(doc.body)
    if (noBlocks) {
      patch.body = mergeI18nBioEn(doc.body, applySpanMap(noBlocks, MENOPAUSE_SPANS))
    }
    if (copy.excerpt) {
      patch.geoSummary = mergeI18nTextEn(doc.geoSummary, copy.excerpt)
    }
  }

  if (Object.keys(patch).length === 0) {
    console.log(`  · ${id} — already English`)
    return false
  }

  console.log(`  ✎ ${id} — ${Object.keys(patch).join(', ')}`)
  if (!DRY_RUN) {
    await sanityClient.patch(id).set(patch).commit({ autoGenerateArrayKeys: true })
  }
  return true
}

async function run() {
  console.log(`▶ Translate article NO → EN (${DRY_RUN ? 'dry run' : 'write'})`)
  const ids = Object.keys(COPY)
  let updated = 0
  for (const id of ids) {
    if (await patchArticle(id)) updated++
  }
  console.log(`\n${DRY_RUN ? 'Would update' : 'Updated'}: ${updated}`)
}

run().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
