/**
 * Developer-only About page normalization vs avenewdemo.online/om-oss.
 * SAFETY: hard-coded dataset=developer. Production NOT touched.
 */
import {createClient} from '@sanity/client'
import {config as loadEnv} from 'dotenv'
import fs from 'fs'
import path from 'path'

loadEnv({path: path.join(process.cwd(), '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env.local')})
loadEnv({path: path.join(process.cwd(), '..', '.env')})

const PROJECT_ID =
  process.env.SANITY_STUDIO_PROJECT_ID?.trim() ||
  process.env.SANITY_PROJECT_ID?.trim()
const TOKEN = process.env.SANITY_TOKEN?.trim()
const DATASET = 'developer'
const DRY_RUN = process.env.DRY_RUN === '1'

if (!PROJECT_ID || !TOKEN) {
  console.error('Missing project/token')
  process.exit(1)
}

console.log(`SAFETY CHECK:\nproject=${PROJECT_ID}\ndataset=${DATASET}`)
if (DATASET !== 'developer') throw new Error('Refusing non-developer dataset')
if (PROJECT_ID !== '9jhqpk3a') throw new Error(`Unexpected project id: ${PROJECT_ID}`)

const client = createClient({
  projectId: PROJECT_ID,
  dataset: DATASET,
  apiVersion: '2024-01-01',
  useCdn: false,
  token: TOKEN,
})

const TITLE_NO = 'Ledende ekspertise. Personlig omsorg.'
const TITLE_EN = 'Leading expertise. Personal care.'
const HERO_ALT_NO = 'Omsorg hos CMedical - Familie'
const HERO_ALT_EN = 'Care at CMedical - Family'
const FORDI_NO = 'Fordi god helse ikke bør vente'
const FORDI_EN = "Because Good Health Shouldn't Have to Wait"

type I18nString = {
  _key: string
  _type: string
  language: string
  value?: string
}

type Block = {
  _type: string
  _key?: string
  style?: string
  children?: {_type: string; _key?: string; text?: string; marks?: string[]}[]
  markDefs?: unknown[]
}

function setI18nString(
  existing: I18nString[] | undefined,
  no: string,
  en: string,
  type = 'internationalizedArrayStringValue',
): I18nString[] {
  const out: I18nString[] = Array.isArray(existing) ? existing.map((x) => ({...x})) : []
  const upsert = (lang: string, value: string) => {
    const idx = out.findIndex((x) => x.language === lang || x._key === lang)
    if (idx >= 0) out[idx] = {...out[idx], language: lang, value, _type: type}
    else out.push({_key: lang, _type: type, language: lang, value})
  }
  upsert('no', no)
  upsert('en', en)
  return out
}

function blockText(block: Block): string {
  return (block.children || []).map((c) => c.text || '').join('').trim()
}

function normalizeBodyValue(blocks: Block[], fordiHeading: string): Block[] {
  const cleaned: Block[] = []
  for (const block of blocks || []) {
    if (block?._type !== 'block') {
      cleaned.push(block)
      continue
    }
    const raw = (block.children || []).map((c) => c.text || '').join('')
    const text = raw.trim()
    if (!text) continue

    if (text === fordiHeading || text.toLowerCase() === fordiHeading.toLowerCase()) {
      cleaned.push({
        ...block,
        style: 'h2',
        markDefs: block.markDefs || [],
        children: [
          {
            _type: 'span',
            _key: block.children?.[0]?._key || `${block._key || 'b'}-s`,
            text: fordiHeading,
            marks: [],
          },
        ],
      })
      continue
    }

    // EN sometimes appends the fordi heading onto the previous paragraph
    const fordiIdx = text.indexOf(fordiHeading)
    if (fordiIdx > 0) {
      const before = text.slice(0, fordiIdx).trim()
      if (before) {
        cleaned.push({
          ...block,
          style: 'normal',
          markDefs: block.markDefs || [],
          children: [
            {
              _type: 'span',
              _key: `${block._key || 'b'}-before`,
              text: before,
              marks: [],
            },
          ],
        })
      }
      cleaned.push({
        _type: 'block',
        _key: `${block._key || 'b'}-fordi`,
        style: 'h2',
        markDefs: [],
        children: [
          {
            _type: 'span',
            _key: `${block._key || 'b'}-fordi-s`,
            text: fordiHeading,
            marks: [],
          },
        ],
      })
      continue
    }

    cleaned.push({...block, style: block.style || 'normal'})
  }
  return cleaned
}

async function ensureHeroAsset(): Promise<string> {
  const existing = await client.fetch<{_id: string} | null>(
    `*[_type=="sanity.imageAsset" && (
      originalFilename == "hero-family.jpg" ||
      originalFilename == "about-hero-family.jpg"
    )][0]{_id}`,
  )
  if (existing?._id) {
    console.log('Reusing hero asset', existing._id)
    return existing._id
  }

  const candidates = [
    path.join(process.cwd(), '..', 'tmp', 'about-hero-family.jpg'),
    path.join(process.cwd(), 'tmp', 'about-hero-family.jpg'),
    path.join(process.cwd(), '..', 'tmp', 'about-hero-family.jpg'),
  ]
  const filePath = candidates.find((p) => fs.existsSync(p))
  if (!filePath) {
    throw new Error('Hero image missing. Expected tmp/about-hero-family.jpg')
  }

  if (DRY_RUN) {
    console.log('[dry-run] would upload', filePath)
    return 'image-dry-run'
  }

  const asset = await client.assets.upload('image', fs.createReadStream(filePath), {
    filename: 'hero-family.jpg',
    contentType: 'image/jpeg',
  })
  console.log('Uploaded hero asset', asset._id)
  return asset._id
}

async function run() {
  const doc = await client.fetch<{
    _id: string
    title?: I18nString[]
    subtitle?: I18nString[]
    heroImageAlt?: I18nString[]
    body?: {_key: string; language?: string; value?: Block[]}[]
    pageSections?: Record<string, unknown>[]
  } | null>(`*[_id=="aboutPage"][0]{
    _id, title, subtitle, heroImageAlt, body, pageSections
  }`)

  if (!doc?._id) throw new Error('aboutPage not found')

  const heroAssetId = await ensureHeroAsset()

  const body = (doc.body || []).map((entry) => {
    if (!Array.isArray(entry.value)) return entry
    const lang = entry.language || entry._key
    return {
      ...entry,
      value: normalizeBodyValue(entry.value, lang === 'en' ? FORDI_EN : FORDI_NO),
    }
  })

  const pageSections = (doc.pageSections || []).map((section) => {
    if (section._type !== 'pageSectionSpecialists') return section
    const next = {...section, limit: 100}
    delete next.seeAllLabel
    return next
  })

  const patch = {
    title: setI18nString(doc.title, TITLE_NO, TITLE_EN),
    subtitle: setI18nString(doc.subtitle, '', ''),
    heroImageAlt: setI18nString(doc.heroImageAlt, HERO_ALT_NO, HERO_ALT_EN),
    heroImage: {
      _type: 'image',
      asset: {_type: 'reference', _ref: heroAssetId},
    },
    body,
    pageSections,
  }

  console.log('Will set:', {
    titleNo: TITLE_NO,
    titleEn: TITLE_EN,
    heroAssetId,
    bodyBlocksNo: body.find((b) => (b.language || b._key) === 'no')?.value?.length,
    specialistsWithoutSeeAll: true,
  })

  if (DRY_RUN) {
    console.log('[dry-run] skip write')
    return
  }

  await client.patch('aboutPage').set(patch).commit({autoGenerateArrayKeys: true})
  console.log('✓ aboutPage normalized on developer')
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
