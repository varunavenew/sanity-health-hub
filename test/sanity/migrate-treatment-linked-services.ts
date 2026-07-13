/**
 * Migrate `linkedServices` content into existing `treatment` documents.
 *
 * Source: src/data/treatmentContent.ts (static content).
 * Target: `linkedServices` field on the matching Sanity `treatment` document.
 * Match:  by NO slug (last segment of the static key).
 *
 * Shape: Sanity v5 `internationalizedArray` (NO + EN) for `label` (string) and
 *        `description` (text). `path` is a plain string.
 *
 * Idempotent: skips docs where `linkedServices` is already non-empty.
 *             Use FORCE=1 to overwrite.
 *
 * Usage:
 *   DRY_RUN=1 SANITY_TOKEN=<token> npx tsx test/sanity/migrate-treatment-linked-services.ts
 *   SANITY_TOKEN=<token> npx tsx test/sanity/migrate-treatment-linked-services.ts
 *   FORCE=1  SANITY_TOKEN=<token> npx tsx test/sanity/migrate-treatment-linked-services.ts
 */

import { randomUUID } from 'node:crypto'
import { readFile } from 'node:fs/promises'
import { basename, resolve } from 'node:path'
import { sanityClient } from './config'

const FORCE = process.env.FORCE === '1'
const DRY_RUN = process.env.DRY_RUN === '1'

const k = () => randomUUID().replace(/-/g, '').slice(0, 12)

const i18nStr = (no: string, en: string) => [
  { _key: 'no', _type: 'internationalizedArrayStringValue', value: no },
  { _key: 'en', _type: 'internationalizedArrayStringValue', value: en },
]
const i18nText = (no: string, en: string) => [
  { _key: 'no', _type: 'internationalizedArrayTextValue', value: no },
  { _key: 'en', _type: 'internationalizedArrayTextValue', value: en },
]

type Item = {
  labelNo: string
  labelEn: string
  descNo: string
  descEn: string
  path: string
  /** Optional local image path (relative to project root). Uploaded to Sanity assets, then referenced. */
  localImage?: string
  imageAltNo?: string
  imageAltEn?: string
}

/**
 * Keyed by the LAST segment of the treatment slug (matches Sanity `slug.current` NO).
 * Values are the linkedServices content extracted from src/data/treatmentContent.ts,
 * with English translations added for both label and description.
 */
const CONTENT: Record<string, Item[]> = {
  // gynekologi/tverrfaglig
  'tverrfaglig': [
    { labelNo: 'Osteopat', labelEn: 'Osteopath',
      descNo: 'Manuell behandlingsform som komplementerer medisinsk utredning og behandling innenfor vulvasmerter, bekkenbunnsdysfunksjon og muskelskjelettplager.',
      descEn: 'Manual therapy that complements medical assessment and treatment of vulvar pain, pelvic floor dysfunction and musculoskeletal issues.',
      path: '/behandlinger/flere-fagomrader/osteopati' },
    { labelNo: 'Sexolog', labelEn: 'Sexologist',
      descNo: 'Terapeutiske samtaler for støtte, veiledning og råd knyttet til seksuell helse, funksjon, lyst, selvbilde og intimitet.',
      descEn: 'Therapeutic conversations for support, guidance and advice on sexual health, function, desire, self-image and intimacy.',
      path: '/behandlinger/flere-fagomrader/sexologi' },
    { labelNo: 'Psykolog', labelEn: 'Psychologist',
      descNo: 'Samtalepartner for å sortere tanker og følelser, håndtere smerter, og motta støtte gjennom utfordrende behandlingsforløp.',
      descEn: 'A conversation partner to sort thoughts and feelings, manage pain, and receive support through challenging treatment journeys.',
      path: '/behandlinger/flere-fagomrader/psykologi' },
    { labelNo: 'Ernæringsfysiolog', labelEn: 'Nutritionist',
      descNo: 'Individuelt tilpasset kostholdsrådgivning med betydning for hormoner, fertilitet, overgangsalder og generell helse.',
      descEn: 'Individually tailored dietary guidance relevant to hormones, fertility, menopause and general health.',
      path: '/behandlinger/flere-fagomrader/ernaringsfysiolog' },
  ],

  // gynekologi/overgangsalder
  'overgangsalder': [
    { labelNo: 'Ernæringsfysiolog', labelEn: 'Nutritionist',
      descNo: 'Kostholdsrådgivning tilpasset hormonelle endringer og overgangsalder.',
      descEn: 'Dietary guidance adapted to hormonal changes and menopause.',
      path: '/behandlinger/flere-fagomrader/ernaringsfysiolog' },
    { labelNo: 'Osteopat', labelEn: 'Osteopath',
      descNo: 'Manuell behandling for smerter i ledd og muskler knyttet til hormonelle endringer.',
      descEn: 'Manual therapy for joint and muscle pain related to hormonal changes.',
      path: '/behandlinger/flere-fagomrader/osteopati' },
    { labelNo: 'Sexolog', labelEn: 'Sexologist',
      descNo: 'Støtte og veiledning ved endringer i seksuell helse gjennom overgangsalderen.',
      descEn: 'Support and guidance for changes in sexual health during menopause.',
      path: '/behandlinger/flere-fagomrader/sexologi' },
    { labelNo: 'Psykolog', labelEn: 'Psychologist',
      descNo: 'Samtaleterapi for å håndtere emosjonelle utfordringer i overgangsalderen.',
      descEn: 'Talk therapy for managing emotional challenges during menopause.',
      path: '/behandlinger/flere-fagomrader/psykologi' },
  ],

  // flere-fagomrader/gastrokirurgi
  'gastrokirurgi': [
    { labelNo: 'Overvektskirurgi (slankeoperasjon)', labelEn: 'Bariatric surgery (weight-loss surgery)',
      descNo: 'Varig vektreduksjon med robotassistert presisjon.',
      descEn: 'Lasting weight reduction with robot-assisted precision.',
      path: '/behandlinger/flere-fagomrader/gastrokirurgi/overvektskirurgi' },
    { labelNo: 'Brokkoperasjon', labelEn: 'Hernia surgery',
      descNo: 'Skånsom behandling av lyskebrokk, arrbrokk og navlebrokk med kikkhull/robot.',
      descEn: 'Gentle treatment of inguinal, incisional and umbilical hernias using keyhole/robotic surgery.',
      path: '/behandlinger/flere-fagomrader/gastrokirurgi/brokkoperasjon' },
    { labelNo: 'Hemorroider og endetarmsplager (rektocele)', labelEn: 'Haemorrhoids and rectal issues (rectocele)',
      descNo: 'Spesialistkompetanse på plager i endetarm og bekkenbunn.',
      descEn: 'Specialist expertise in rectum and pelvic floor complaints.',
      path: '/behandlinger/flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager' },
  ],

  // flere-fagomrader/robotkirurgi
  'robotkirurgi': [
    { labelNo: 'Gynekologisk robotkirurgi', labelEn: 'Gynaecological robotic surgery',
      descNo: 'Brukes blant annet ved muskelknuter (fertilitetsbevarende kirurgi), dyp endometriose, hysterektomi (også ved forstørret livmor), og enkelte krefttilfeller som kreft i livmor.',
      descEn: 'Used for fibroids (fertility-preserving surgery), deep endometriosis, hysterectomy (also for enlarged uterus) and selected cancers such as uterine cancer.',
      path: '/behandlinger/gynekologi/robotkirurgi',
      localImage: 'src/assets/categories/gynekologi.jpg',
      imageAltNo: 'Gynekologisk robotkirurgi',
      imageAltEn: 'Gynaecological robotic surgery' },
    { labelNo: 'Urologisk robotkirurgi', labelEn: 'Urological robotic surgery',
      descNo: 'Brukes blant annet ved godartet forstørret prostata (RASP), prostatakreft (RALP), og nyrekirurgi (f.eks. nefrektomi).',
      descEn: 'Used for benign prostate enlargement (RASP), prostate cancer (RALP) and kidney surgery (e.g. nephrectomy).',
      path: '/behandlinger/urologi/robotkirurgi' },
    { labelNo: 'Gastrokirurgisk robotkirurgi', labelEn: 'Gastro-surgical robotic surgery',
      descNo: 'Brukes blant annet ved overvektskirurgi (slankeoperasjon med rSG og SASI) og brokkoperasjon (bl.a. lyskebrokk).',
      descEn: 'Used for bariatric surgery (rSG and SASI weight-loss procedures) and hernia surgery (e.g. inguinal hernia).',
      path: '/behandlinger/flere-fagomrader/gastrokirurgi' },
  ],

  // flere-fagomrader/hudhelse
  'hudhelse': [
    { labelNo: 'Hudbehandlinger', labelEn: 'Skin treatments',
      descNo: 'Medisinsk forankrede hudbehandlinger utført av hudlege – pigment, rødhet, struktur, volum og føflekksjekk.',
      descEn: 'Medically grounded skin treatments performed by a dermatologist – pigment, redness, texture, volume and mole check.',
      path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger' },
    { labelNo: 'Behandlingsutstyr', labelEn: 'Treatment technology',
      descNo: 'IPL- og laserteknologi vi bruker – trygg behandling basert på dokumenterte metoder.',
      descEn: 'The IPL and laser technology we use – safe treatment based on evidence-based methods.',
      path: '/behandlinger/flere-fagomrader/behandlingsutstyr' },
    { labelNo: 'Hudpleieprodukter', labelEn: 'Skincare products',
      descNo: 'SkinCeuticals og medisinsk hudpleie anbefalt av hudlege – for daglig stell og oppfølging hjemme.',
      descEn: 'SkinCeuticals and medical skincare recommended by a dermatologist – for daily care and follow-up at home.',
      path: '/behandlinger/flere-fagomrader/hudpleieprodukter' },
  ],

  // flere-fagomrader/overvektskirurgi
  'overvektskirurgi': [
    { labelNo: 'Mage- og tarmlidelser (Gastrokirurgi)', labelEn: 'Gastro-intestinal conditions (Gastro-surgery)',
      descNo: 'Bredere oversikt over kirurgi i fordøyelsessystemet.',
      descEn: 'Broader overview of surgery in the digestive system.',
      path: '/behandlinger/flere-fagomrader/gastrokirurgi' },
    { labelNo: 'Brokkoperasjon', labelEn: 'Hernia surgery',
      descNo: 'Skånsom behandling av lyskebrokk, arrbrokk og navlebrokk med kikkhull/robot.',
      descEn: 'Gentle treatment of inguinal, incisional and umbilical hernias using keyhole/robotic surgery.',
      path: '/behandlinger/flere-fagomrader/gastrokirurgi/brokkoperasjon' },
    { labelNo: 'Hemorroider og endetarmsplager (rektocele)', labelEn: 'Haemorrhoids and rectal issues (rectocele)',
      descNo: 'Spesialistkompetanse på plager i endetarm og bekkenbunn.',
      descEn: 'Specialist expertise in rectum and pelvic floor complaints.',
      path: '/behandlinger/flere-fagomrader/gastrokirurgi/hemorroider-og-endetarmsplager' },
    { labelNo: 'Ernæringsfysiolog', labelEn: 'Nutritionist',
      descNo: 'Tverrfaglig kostholdsoppfølging før og etter operasjon.',
      descEn: 'Multidisciplinary dietary follow-up before and after surgery.',
      path: '/behandlinger/flere-fagomrader/ernaringsfysiolog' },
  ],

  // fertilitet/assistert-befruktning-for-par-og-single
  'assistert-befruktning-for-par-og-single': [
    { labelNo: 'Fertilitetsutredning', labelEn: 'Fertility assessment',
      descNo: 'Grundig kartlegging av fertiliteten – et trygt første steg.',
      descEn: 'Thorough assessment of fertility – a safe first step.',
      path: '/behandlinger/fertilitet/fertilitetsutredning' },
    { labelNo: 'Assistert befruktning', labelEn: 'Assisted reproduction',
      descNo: 'IVF, ICSI og IUI – vår hovedside om assistert befruktning.',
      descEn: 'IVF, ICSI and IUI – our main page on assisted reproduction.',
      path: '/behandlinger/fertilitet/assistert-befruktning' },
    { labelNo: 'Eggfrys', labelEn: 'Egg freezing',
      descNo: 'Bevar muligheten for graviditet senere i livet.',
      descEn: 'Preserve the possibility of pregnancy later in life.',
      path: '/behandlinger/fertilitet/eggfrys' },
  ],

  // flere-fagomrader/hudbehandlinger
  'hudbehandlinger': [
    { labelNo: 'Pigmentforandringer og solskader', labelEn: 'Pigmentation and sun damage',
      descNo: 'Vurdering og behandling av pigmentflekker og solskadet hud – inkludert IPL.',
      descEn: 'Assessment and treatment of pigment spots and sun-damaged skin – including IPL.',
      path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/pigmentforandringer-og-solskader' },
    { labelNo: 'Rødhet og synlige blodkar', labelEn: 'Redness and visible blood vessels',
      descNo: 'Behandling av rosacea-relatert rødhet og sprengte blodkar i ansiktet.',
      descEn: 'Treatment of rosacea-related redness and broken facial blood vessels.',
      path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/rodhet-og-synlige-blodkar' },
    { labelNo: 'Forbedring av hudstruktur', labelEn: 'Skin texture improvement',
      descNo: 'Microneedling, mesoterapi og behandlinger som stimulerer hudens egen fornyelse.',
      descEn: 'Microneedling, mesotherapy and treatments that stimulate the skin’s own renewal.',
      path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/forbedring-av-hudstruktur' },
    { labelNo: 'Hudhelse og kosmetisk dermatologi', labelEn: 'Skin health and cosmetic dermatology',
      descNo: 'Medisinske hudtilstander og kosmetisk dermatologi – vurdert av hudlege.',
      descEn: 'Medical skin conditions and cosmetic dermatology – assessed by a dermatologist.',
      path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/kosmetisk-dermatologi' },
    { labelNo: 'Elastisitet og volum', labelEn: 'Elasticity and volume',
      descNo: 'Rynkebehandling, Profhilo, Radiesse og Skin boosters tilpasset deg.',
      descEn: 'Wrinkle treatment, Profhilo, Radiesse and skin boosters tailored to you.',
      path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/elastisitet-og-volum' },
    { labelNo: 'Føflekksjekk', labelEn: 'Mole check',
      descNo: 'Grundig dermatoskopisk vurdering av føflekker og hudforandringer.',
      descEn: 'Thorough dermatoscopic evaluation of moles and skin changes.',
      path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger/foflekksjekk' },
  ],

  // Skin sub-pages that all link back to /hudbehandlinger
  'pigmentforandringer-og-solskader': [
    { labelNo: 'Hudbehandlinger', labelEn: 'Skin treatments',
      descNo: 'Tilbake til oversikten over alle hudbehandlinger.',
      descEn: 'Back to the overview of all skin treatments.',
      path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger' },
  ],
  'rodhet-og-synlige-blodkar': [
    { labelNo: 'Hudbehandlinger', labelEn: 'Skin treatments',
      descNo: 'Tilbake til oversikten over alle hudbehandlinger.',
      descEn: 'Back to the overview of all skin treatments.',
      path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger' },
  ],
  'forbedring-av-hudstruktur': [
    { labelNo: 'Hudbehandlinger', labelEn: 'Skin treatments',
      descNo: 'Tilbake til oversikten over alle hudbehandlinger.',
      descEn: 'Back to the overview of all skin treatments.',
      path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger' },
  ],
  'kosmetisk-dermatologi': [
    { labelNo: 'Hudbehandlinger', labelEn: 'Skin treatments',
      descNo: 'Tilbake til oversikten over alle hudbehandlinger.',
      descEn: 'Back to the overview of all skin treatments.',
      path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger' },
  ],
  'elastisitet-og-volum': [
    { labelNo: 'Hudbehandlinger', labelEn: 'Skin treatments',
      descNo: 'Tilbake til oversikten over alle hudbehandlinger.',
      descEn: 'Back to the overview of all skin treatments.',
      path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger' },
  ],
  'foflekksjekk': [
    { labelNo: 'Hudbehandlinger', labelEn: 'Skin treatments',
      descNo: 'Tilbake til oversikten over alle hudbehandlinger.',
      descEn: 'Back to the overview of all skin treatments.',
      path: '/behandlinger/flere-fagomrader/hudhelse/hudbehandlinger' },
  ],

  // flere-fagomrader/behandlingsutstyr
  'behandlingsutstyr': [
    { labelNo: 'Hudbehandlinger', labelEn: 'Skin treatments',
      descNo: 'Oversikt over alle våre hudbehandlinger.',
      descEn: 'Overview of all our skin treatments.',
      path: '/behandlinger/flere-fagomrader/hudbehandlinger' },
    { labelNo: 'Hudpleieprodukter', labelEn: 'Skincare products',
      descNo: 'SkinCeuticals – medisinsk hudpleie.',
      descEn: 'SkinCeuticals – medical skincare.',
      path: '/behandlinger/flere-fagomrader/hudpleieprodukter' },
  ],

  // flere-fagomrader/hudpleieprodukter
  'hudpleieprodukter': [
    { labelNo: 'Hudbehandlinger', labelEn: 'Skin treatments',
      descNo: 'Medisinsk forankrede behandlinger hos hudlege.',
      descEn: 'Medically grounded treatments by a dermatologist.',
      path: '/behandlinger/flere-fagomrader/hudbehandlinger' },
    { labelNo: 'Behandlingsutstyr (IPL)', labelEn: 'Treatment technology (IPL)',
      descNo: 'IPL- og laserbehandling.',
      descEn: 'IPL and laser treatment.',
      path: '/behandlinger/flere-fagomrader/behandlingsutstyr' },
  ],
}

/**
 * Base URL where Lovable CDN assets are reachable. Override with LOVABLE_APP_URL.
 * Defaults to the published site so this works from any machine.
 */
const APP_BASE_URL = (process.env.LOVABLE_APP_URL || 'https://sanity-care-craft.lovable.app').replace(/\/$/, '')

/** Category slug in `path` → filename prefix used under src/assets/services/. */
const CATEGORY_ALIAS: Record<string, string> = {
  'flere-fagomrader': 'flere',
  'gynekologi': 'gynekologi',
  'urologi': 'urologi',
  'fertilitet': 'fertilitet',
  'graviditet': 'graviditet',
  'ortopedi': 'ortopedi',
}

/**
 * Given a linkedServices `path` like `/behandlinger/<cat>/<...>/<sub>`,
 * find the local `.asset.json` pointer in src/assets/services/, if any.
 */
async function resolveAssetPointerForPath(path: string): Promise<string | null> {
  const m = path.match(/^\/behandlinger\/([^/?#]+)(?:\/(.+))?$/)
  if (!m) return null
  const cat = m[1]
  const rest = m[2]
  if (!rest) return null
  const prefix = CATEGORY_ALIAS[cat] ?? cat
  // Try each segment of the tail from most-specific to least-specific.
  const segments = rest.split('/').filter(Boolean)
  const candidates: string[] = []
  for (let i = segments.length - 1; i >= 0; i--) {
    const sub = segments[i]
    candidates.push(`${prefix}-${sub}`)
    // Norwegian char normalisation used by src/data/serviceImages.ts
    const alt = sub.replace(/oe/g, 'o').replace(/ae/g, 'a').replace(/aa/g, 'a')
    if (alt !== sub) candidates.push(`${prefix}-${alt}`)
  }
  for (const name of candidates) {
    const pointer = resolve(process.cwd(), 'src/assets/services', `${name}.jpg.asset.json`)
    try {
      await readFile(pointer)
      return pointer
    } catch {
      /* try next */
    }
  }
  return null
}

/**
 * Upload a local image file (jpg on disk) or a CDN-hosted image (pointer JSON)
 * to Sanity Assets. Cached per-run so the same URL isn't re-uploaded.
 * Returns the Sanity asset _id, or null if the source can't be resolved.
 */
const uploadCache = new Map<string, string>()

async function uploadFromPointer(pointerPath: string): Promise<string | null> {
  if (uploadCache.has(pointerPath)) return uploadCache.get(pointerPath)!
  const pointer = JSON.parse(await readFile(pointerPath, 'utf8'))
  const url = `${APP_BASE_URL}${pointer.url}`
  const filename = pointer.original_filename || basename(pointer.url)
  console.log(`   ↓ fetching ${url}`)
  const res = await fetch(url)
  if (!res.ok) {
    console.warn(`   ⚠ HTTP ${res.status} for ${url} — skipping`)
    return null
  }
  const buf = Buffer.from(await res.arrayBuffer())
  const asset = await sanityClient.assets.upload('image', buf, {
    filename,
    contentType: pointer.content_type || 'image/jpeg',
  })
  uploadCache.set(pointerPath, asset._id)
  console.log(`   ⇡ uploaded ${filename} → ${asset._id}`)
  return asset._id
}

async function uploadLocalFile(localPath: string): Promise<string> {
  if (uploadCache.has(localPath)) return uploadCache.get(localPath)!
  const abs = resolve(process.cwd(), localPath)
  const buf = await readFile(abs)
  const asset = await sanityClient.assets.upload('image', buf, {
    filename: basename(localPath),
  })
  uploadCache.set(localPath, asset._id)
  console.log(`   ⇡ uploaded ${localPath} → ${asset._id}`)
  return asset._id
}

async function buildLinkedServices(items: Item[]) {
  const out: any[] = []
  for (const it of items) {
    const entry: any = {
      _key: k(),
      _type: 'object',
      label: i18nStr(it.labelNo, it.labelEn),
      description: i18nText(it.descNo, it.descEn),
      path: it.path,
    }

    // Priority: explicit `localImage` on the item → resolved CDN image by path.
    let assetId: string | null = null
    if (it.localImage) {
      if (!DRY_RUN) assetId = await uploadLocalFile(it.localImage)
      else console.log(`   [dry] would upload local file: ${it.localImage}`)
    } else {
      const pointer = await resolveAssetPointerForPath(it.path)
      if (pointer) {
        if (!DRY_RUN) assetId = await uploadFromPointer(pointer)
        else console.log(`   [dry] would fetch+upload pointer: ${pointer}`)
      } else {
        console.log(`   · no image resolved for ${it.path}`)
      }
    }

    if (assetId) {
      entry.image = {
        _type: 'image',
        asset: { _type: 'reference', _ref: assetId },
      }
      const altNo = it.imageAltNo ?? it.labelNo
      const altEn = it.imageAltEn ?? it.labelEn
      entry.imageAlt = i18nStr(altNo, altEn)
    }

    out.push(entry)
  }
  return out
}

const isEmpty = (v: any) => v === undefined || v === null || (Array.isArray(v) && v.length === 0)

async function main() {
  // Fetch all treatments — resolve NO slug from the internationalizedArray shape.
  const docs = await sanityClient.fetch(
    `*[_type == "treatment"]{
      _id,
      "slugNo": slug.current,
      linkedServices,
      title
    }`,
  )
  console.log(`\n[treatment] found ${docs.length} document(s)`)
  console.log(`[content]   ${Object.keys(CONTENT).length} slugs available for migration\n`)

  let updated = 0
  let skipped = 0
  let notFound = 0
  const usedKeys = new Set<string>()

  for (const doc of docs) {
    const slugNo: string | undefined = doc.slugNo
    if (!slugNo) continue
    const items = CONTENT[slugNo]
    if (!items) continue

    usedKeys.add(slugNo)

    if (!FORCE && !isEmpty(doc.linkedServices)) {
      console.log(`  ⏭  ${doc._id} [${slugNo}] — already has linkedServices`)
      skipped++
      continue
    }

    const value = await buildLinkedServices(items)
    console.log(`  ✦ ${doc._id} [${slugNo}] → ${value.length} linked service(s)`)
    if (DRY_RUN) continue

    await sanityClient.patch(doc._id).set({ linkedServices: value }).commit()
    updated++
  }

  const missing = Object.keys(CONTENT).filter((s) => !usedKeys.has(s))
  if (missing.length) {
    notFound = missing.length
    console.log('\n⚠  No treatment document matched these slugs:')
    for (const s of missing) console.log(`    - ${s}`)
  }

  console.log(
    `\n✅ Done. ${DRY_RUN ? '(dry-run, no writes)' : `updated=${updated}, skipped=${skipped}, unmatched=${notFound}`}`,
  )
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
