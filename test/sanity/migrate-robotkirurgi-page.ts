#!/usr/bin/env npx tsx
/**
 * Seed robotkirurgiPage singleton (Pages → Robot-assisted surgery).
 * Copies the theme-page hero image when present, then writes screenshot copy.
 *
 * Run:
 *   cd test && npm run migrate:robotkirurgi-page:dry
 *   cd test && npm run migrate:robotkirurgi-page
 */
import {randomBytes} from 'crypto'
import {sanityClient} from './config'
import {patchSingletonFields} from './lib/patch-singleton'
import {i18nString, i18nText} from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const DOCUMENT_ID = 'robotkirurgiPage'
const FAQ_COLLECTION_ID = 'faqCollection-robotkirurgi'

function randomKey(): string {
  return randomBytes(8).toString('hex')
}

function buildSlugField() {
  return [
    {
      _key: randomKey(),
      _type: 'internationalizedArraySlugValue',
      language: 'no',
      value: {_type: 'slug', current: 'robotassistert-kirurgi'},
    },
    {
      _key: randomKey(),
      _type: 'internationalizedArraySlugValue',
      language: 'en',
      value: {_type: 'slug', current: 'robot-assisted-surgery'},
    },
  ]
}

function introParagraph(no: string, en: string) {
  return {
    _type: 'introParagraph',
    _key: randomKey(),
    text: i18nText(no, en),
  }
}

function sectionParagraph(no: string, en: string) {
  return {
    _type: 'sectionParagraph',
    _key: randomKey(),
    text: i18nText(no, en),
  }
}

function sectionBullet(no: string, en: string) {
  return {
    _type: 'sectionBullet',
    _key: randomKey(),
    text: i18nString(no, en),
  }
}

const FAQ_REFS = [
  'faq-generelt-henvisning',
  'faq-generelt-ventetid',
  'faq-generelt-sykemelding',
  'faq-generelt-utredning',
  'faq-generelt-selskapet',
]

async function ensureFaqCollection() {
  const existing = await sanityClient.fetch<{_id: string} | null>(
    `*[_id == $id][0]{_id}`,
    {id: FAQ_COLLECTION_ID},
  )
  const questions = FAQ_REFS.map((ref) => ({
    _type: 'reference' as const,
    _key: randomKey(),
    _ref: ref,
  }))
  const doc = {
    _id: FAQ_COLLECTION_ID,
    _type: 'faqCollection',
    title: 'Robot-assisted surgery FAQ',
    description: 'FAQ pack for the Robot-assisted surgery page in Pages.',
    questions,
  }
  if (DRY_RUN) {
    console.log(`  Would ${existing ? 'update' : 'create'} ${FAQ_COLLECTION_ID}`)
    return
  }
  await sanityClient.createOrReplace(doc)
  console.log(`  FAQ collection ${existing ? 'updated' : 'created'}: ${FAQ_COLLECTION_ID}`)
}

async function run() {
  console.log('▶ Seed robotkirurgiPage singleton')
  console.log(`  Dry run: ${DRY_RUN ? 'yes' : 'no'}\n`)

  const theme = await sanityClient.fetch<{
    heroImage?: {_type?: string; asset?: {_ref?: string; _type?: string}}
    heroMedia?: {mediaType?: string; image?: {asset?: {_ref?: string}}}
  } | null>(`*[_id == "themePage-robotkirurgi"][0]{heroImage, heroMedia}`)

  const heroImage =
    theme?.heroMedia?.image?.asset?._ref
      ? theme.heroMedia.image
      : theme?.heroImage?.asset?._ref
        ? theme.heroImage
        : null

  const heroMedia = heroImage
    ? {
        _type: 'media',
        mediaType: 'image',
        image: {
          _type: 'image',
          asset: {
            _type: 'reference',
            _ref: heroImage.asset?._ref,
          },
        },
      }
    : undefined

  const fields = {
    title: i18nString('Robotassistert kirurgi', 'Robot-assisted surgery'),
    slug: buildSlugField(),
    subtitle: i18nText(
      'Se hvordan robotassistert kirurgi gir kirurgen presisjon og oversikt – og pasienten en skånsom vei tilbake til hverdagen.',
      'See how robot-assisted surgery gives the surgeon precision and overview – and the patient a gentle path back to everyday life.',
    ),
    ...(heroMedia ? {heroMedia} : {}),
    heroImageAlt: i18nString(
      'Kirurger under robotassistert operasjon',
      'Surgeons during robot-assisted surgery',
    ),
    primaryCtaLabel: i18nString('Bestill time', 'Book an appointment'),
    primaryCtaPath: '/booking',
    introTexts: [
      introParagraph(
        'Robotassistert kirurgi er en avansert, men skånsom form for behandling. Operasjonen gjennomføres, som ved klassisk kikkhullskirurgi, gjennom små åpninger i huden. Ved robotkirurgi styrer kirurgen instrumentene elektronisk fra en konsoll ved siden av pasienten. Maskinholdte instrumenter gir svært presise bevegelser, og et høyoppløselig, stereoskopisk 3D-kamera gir kirurgen et usedvanlig godt bilde.',
        'Robot-assisted surgery is an advanced, yet gentle form of treatment. The operation is performed, as in classic keyhole surgery, through small openings in the skin. In robotic surgery, the surgeon controls the instruments electronically from a console next to the patient. Machine-held instruments provide very precise movements, and a high-resolution, stereoscopic 3D camera gives the surgeon an exceptionally good image.',
      ),
      introParagraph(
        'Robotsystemet er et kraftig verktøy som gir kirurgen optimal oversikt og tilgang, slik at avanserte inngrep kan utføres med høy presisjon og minimal belastning.',
        'The robotic system is a powerful tool that gives the surgeon optimal overview and access, allowing advanced procedures to be performed with high precision and minimal strain.',
      ),
      introParagraph(
        'Robotassistert kirurgi har mange fordeler, og er ofte foretrukket ved kompliserte operasjoner, spesielt når man kan unngå åpen kirurgi (laparotomi). Det gir raskere rekonvalesens og lavere risiko for komplikasjoner, både under og etter operasjonen. De fleste pasientene kan reise hjem innen ett døgn etter behandlingen. Ved enkelte krefttilfeller, som kreft i livmor, kan robotkirurgi være et svært godt alternativ – nettopp fordi presisjon og skånsomhet er så viktig.',
        'Robot-assisted surgery has many advantages and is often preferred for complicated operations, especially when open surgery (laparotomy) can be avoided. It provides faster recovery and a lower risk of complications, both during and after the operation. Most patients can go home within a day after treatment. In some cases of cancer, such as uterine cancer, robotic surgery can be a very good alternative – precisely because precision and gentleness are so important.',
      ),
    ],
    sections: [
      {
        _type: 'robotkirurgiContentSection',
        _key: 'section-bullets',
        heading: i18nString(
          'Vi tilbyr robotassistert kirurgi innen blant annet:',
          'We offer robot-assisted surgery in areas such as:',
        ),
        paragraphs: [
          sectionParagraph(
            'Hos oss i CMedical setter vi alltid pasienten i sentrum. Vårt mål er å tilby moderne, trygg og skreddersydd behandling – med minst mulig smerte, lav risiko og en rask vei tilbake til hverdagen.',
            'At CMedical, we always put the patient at the center. Our goal is to offer modern, safe, and customized treatment – with minimal pain, low risk, and a quick return to daily life.',
          ),
        ],
        bulletPoints: [
          sectionBullet(
            'Muskelknuter (fertilitetsbevarende kirurgi)',
            'Muscle knots (fertility-preserving surgery)',
          ),
          sectionBullet('Dyp endometriose', 'Deep endometriosis'),
          sectionBullet(
            'Hysterektomi, også ved forstørret livmor',
            'Hysterectomy, also for enlarged uterus',
          ),
          sectionBullet('Brokk', 'Hernia'),
          sectionBullet(
            'Godartet forstørret prostata (RASP)',
            'Benign enlarged prostate (RASP)',
          ),
          sectionBullet('Prostatakreft (RALP)', 'Prostate cancer (RALP)'),
        ],
      },
      {
        _type: 'robotkirurgiContentSection',
        _key: 'section-rehab',
        heading: i18nString('Rask rehabilitering', 'Rapid rehabilitation'),
        paragraphs: [
          sectionParagraph(
            'Robotkirurgi er en moderne og skånsom operasjonsmetode hvor kirurgen opererer gjennom små snitt i stedet for et større operasjonssår. Dette gir mindre ubehag, redusert blødning, færre komplikasjoner og raskere tilheling, slik at du kommer deg trygt og behagelig gjennom hele operasjonsforløpet.',
            'Robotic surgery is a modern and gentle surgical method where the surgeon operates through small incisions instead of a larger surgical wound. This results in less discomfort, reduced bleeding, fewer complications and faster healing, so that you can recover safely and comfortably throughout the entire surgical procedure.',
          ),
          sectionParagraph(
            '**Raskere vei tilbake:** Mange pasienter kan reise hjem allerede dagen etter inngrepet. Allerede samme kveld er det mulig å spise, bevege seg og føle seg mer som seg selv igjen.',
            '**A faster path to recovery:** Many patients can go home the day after the procedure. By the same evening, it is possible to eat, move around and feel more like themselves again.',
          ),
          sectionParagraph(
            '**Kortere sykemelding – raskere tilbake til hverdagen:** Avhengig av type jobb og hvilket inngrep du har gjennomgått, kan du forvente en sykemeldingsperiode på 2–6 uker. Ved robotassistert prostatektomi (RALP) er sykemeldingen vanligvis 4–6 uker.',
            '**Shorter sick leave – faster return to everyday life:** Depending on the type of job and the procedure you have undergone, you can expect a sick leave period of 2–6 weeks. For robot-assisted prostatectomy (RALP), the sick leave is typically 4–6 weeks.',
          ),
        ],
        bulletPoints: [],
      },
      {
        _type: 'robotkirurgiContentSection',
        _key: 'section-precision',
        heading: i18nString('Presisjon som merkes', 'Precision that is noticeable'),
        paragraphs: [
          sectionParagraph(
            'Med et høyoppløselig 3D-kamera og avanserte instrumenter med høy presisjon har kirurgen svært god kontroll. Dette bidrar til skånsomhet og høy kvalitet i hvert inngrep.',
            'With a high-resolution 3D camera and advanced, high-precision instruments, the surgeon has excellent control. This contributes to gentleness and high quality in every procedure.',
          ),
          sectionParagraph(
            'Ergonomi – også for kirurgen: Under robotkirurgi sitter kirurgen i en ergonomisk og komfortabel arbeidsstilling. Dette bidrar til økt konsentrasjon og mindre utmattelse.',
            'Ergonomics – also for the surgeon: During robotic surgery, the surgeon sits in an ergonomic and comfortable working position. This contributes to increased concentration and less fatigue.',
          ),
          sectionParagraph(
            'Erfarne spesialister – trygg behandling: Robotkirurgi hos oss utføres av spesialister innen urologi og gynekologi.',
            'Experienced specialists – safe treatment: Robotic surgery at our clinic is performed by specialists in urology and gynecology.',
          ),
        ],
        bulletPoints: [],
      },
    ],
    quoteText: i18nText(
      'Tilgjengelighet i en usikker periode har vært viktig. Dere svarer telefoner og mail raskt. Etter operasjonen ble jeg langt i fra glemt. Jeg kunne ta kontakt med dere langt utenfor det som var normal arbeidstid, og robotkirurgen sa jeg kunne ringe ham når som helst på døgnet. Jeg tror at min livssituasjon kanskje ikke ville vært så god som den er i dag dersom noen andre i Norge hadde utført inngrepet.',
      'Availability during an uncertain period has been important. You answer phones and emails quickly. After the operation, I was far from forgotten. I was able to contact you well outside of normal working hours, and the robotic surgeon said I could call him at any time of the day. I think that my life situation might not be as good as it is today if someone else in Norway had performed the procedure.',
    ),
    quoteAttribution: i18nString('Tom, 70 år', 'Tom, 70 years old'),
    secondaryCtaLabel: i18nString('Bestill time', 'Book an appointment'),
    secondaryCtaPath: '/booking',
    faqSectionTitle: i18nString('Ofte stilte spørsmål', 'Frequently asked questions'),
    faqCollection: {
      _type: 'reference',
      _ref: FAQ_COLLECTION_ID,
    },
    geoSummary: i18nText(
      'CMedical tilbyr robotassistert kirurgi – en skånsom kikkhullsmetode med høy presisjon, rask restitusjon og korte ventetider. Ingen henvisning nødvendig.',
      'CMedical offers robot-assisted surgery – a gentle keyhole method with high precision, rapid recovery and short waiting times. No referral needed.',
    ),
    seo: {
      _type: 'seo',
      metaTitle: i18nString(
        'Robotassistert kirurgi | CMedical',
        'Robot-assisted surgery | CMedical',
      ),
      metaDescription: i18nText(
        'Robotassistert kirurgi er en avansert, men skånsom behandlingsform. Presisjon, rask restitusjon og korte ventetider hos CMedical.',
        'Robot-assisted surgery is an advanced yet gentle form of treatment. Precision, rapid recovery and short waiting times at CMedical.',
      ),
      noIndex: false,
    },
  }

  await ensureFaqCollection()

  if (DRY_RUN) {
    console.log('  Would patch robotkirurgiPage with title, subtitle, sections, quote, FAQ, SEO')
    console.log(`  Hero image: ${heroMedia ? heroMedia.image.asset._ref : 'none (theme page had no image)'}`)
    console.log('\n✓ Dry run complete')
    return
  }

  const patched = await patchSingletonFields(DOCUMENT_ID, fields, 'robotkirurgiPage')
  console.log(`  Patched: ${patched.join(', ')}`)
  console.log('\n✓ Done')
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
