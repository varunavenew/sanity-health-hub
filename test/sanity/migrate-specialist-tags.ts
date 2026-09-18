#!/usr/bin/env npx tsx
/**
 * Migrate specialist expertise labels → reusable `specialistTag` documents.
 *
 * Schema (this repo):
 *   specialistTag { label: i18n string, href?: string }
 *   specialist.specialties[] → reference to specialistTag
 *     (+ temporary legacy specialtyItem until converted)
 *
 * Before: specialist.specialties = [{ _type: "specialtyItem", label: i18n }]
 * After:  specialist.specialties = [{ _type: "reference", _ref: "specialist-tag.<slug>" }]
 *
 * What it does
 *   1. Reads all specialists (published + drafts) and collects inline labels (NO/EN).
 *   2. Deduplicates by normalized NO label → one shared tag per unique label.
 *   3. Creates a `specialistTag` document per unique label (deterministic _id).
 *   4. Auto-fills `href` from treatmentCategory / treatment pages using:
 *      exact NO/EN title, slug, containment match, then curated aliases.
 *   5. Also fills empty `href` on tags that already exist.
 *   6. Rewrites specialties as references (keeps order, keeps valid existing refs,
 *      drops dangling refs).
 *
 * Paths (NO locale, matching site routing — not /behandlinger/...):
 *   category  → /{slug}           e.g. /gynekologi, /ovrige
 *   treatment → /{catSlug}/{slug} e.g. /fertilitet/ivf
 *
 * Idempotent: re-running reuses existing tags and skips already-converted rows.
 *
 * Usage (from test/):
 *   DRY_RUN=1 npx tsx sanity/migrate-specialist-tags.ts
 *   npx tsx sanity/migrate-specialist-tags.ts --dry-run
 *   npx tsx sanity/migrate-specialist-tags.ts
 *
 * Fill links only (no specialty rewrite):
 *   FILL_HREFS_ONLY=1 npx tsx sanity/migrate-specialist-tags.ts
 *
 * Overwrite existing href values:
 *   FORCE_HREF=1 npx tsx sanity/migrate-specialist-tags.ts
 *
 * Production:
 *   ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production npx tsx sanity/migrate-specialist-tags.ts
 */
import {randomUUID} from 'node:crypto'
import {DATASET, PROJECT_ID, sanityClient} from './config'

const DRY_RUN = process.env.DRY_RUN === '1' || process.argv.includes('--dry-run')
const FILL_HREFS_ONLY = process.env.FILL_HREFS_ONLY === '1'
const FORCE_HREF = process.env.FORCE_HREF === '1'

type I18nValue = {
  _type?: string
  _key?: string
  language?: string
  value?: string
}

type SpecialtyEntry = {
  _key?: string
  _type?: string
  _ref?: string
  label?: I18nValue[] | string
}

type SpecialistDoc = {
  _id: string
  name?: string
  specialties?: SpecialtyEntry[]
}

type TagDoc = {
  _id: string
  label?: I18nValue[]
  href?: string | null
}

type PageDoc = {
  _id: string
  _type: 'treatment' | 'treatmentCategory'
  titleNo?: string
  titleEn?: string
  slugNo?: string
  categoryId?: string
  categorySlugNo?: string
}

/** Keyword map when EN text is missing on a legacy specialtyItem. */
const EN_FALLBACK: Array<[string, string]> = [
  ['Gynekologisk kirurg', 'Gynecological surgeon'],
  ['Fødselslege', 'Obstetrician'],
  ['Fostermedisiner', 'Fetal medicine specialist'],
  ['Overvektskirurgi', 'Obesity surgery'],
  ['Gastrokirurg', 'Gastrointestinal surgeon'],
  ['Robotkirurg', 'Robotic surgeon'],
  ['Embryolog', 'Embryologist'],
  ['Fertilitet', 'Fertility'],
  ['Embryologi', 'Embryology'],
  ['Uroterapeut', 'Urotherapist'],
  ['Urologi', 'Urology'],
  ['Urolog', 'Urologist'],
  ['Ortopedi', 'Orthopedics'],
  ['Ortoped', 'Orthopedic surgeon'],
  ['Gynekolog', 'Gynecologist'],
  ['Gynekologi', 'Gynecology'],
  ['Bekkenbunnshelse', 'Pelvic floor health'],
  ['Urogynekologi', 'Urogynecology'],
  ['Spesialist', 'Specialist'],
  ['Kirurgi', 'Surgery'],
  ['Kirurg', 'Surgeon'],
  ['Endoskopi', 'Endoscopy'],
  ['Androlog', 'Andrologist'],
  ['Seksolog', 'Sexologist'],
  ['Endometriose', 'Endometriosis'],
  ['Obstetrikk', 'Obstetrics'],
  ['Fødselshjelp', 'Obstetrics'],
  ['Eggdonasjon', 'Egg donation'],
  ['Familieterapi', 'Family therapy'],
  ['Fertilitetsrådgivning', 'Fertility counselling'],
  ['Brokkbehandling', 'Hernia treatment'],
  ['Laparoskopi', 'Laparoscopy'],
  ['Hysteroskopi', 'Hysteroscopy'],
  ['Overgangsalder', 'Menopause'],
]

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

function translateKeywords(noText: string): string {
  let result = noText
  const sorted = [...EN_FALLBACK].sort((a, b) => b[0].length - a[0].length)
  for (const [no, en] of sorted) {
    result = result.replace(new RegExp(`\\b${escapeRegExp(no)}\\b`, 'gi'), en)
  }
  return result
}

function readI18n(value: unknown, lang: 'no' | 'en'): string {
  if (!value) return ''
  if (typeof value === 'string') return value.trim()
  if (!Array.isArray(value)) return ''
  const entries = value as I18nValue[]
  const matchLang = entries.find((v) => (v.language || v._key) === lang)?.value
  if (typeof matchLang === 'string' && matchLang.trim()) return matchLang.trim()
  if (lang === 'en') {
    const matchNo = entries.find((v) => (v.language || v._key) === 'no')?.value
    if (typeof matchNo === 'string' && matchNo.trim()) return matchNo.trim()
  }
  const first = entries[0]?.value
  return typeof first === 'string' ? first.trim() : ''
}

/** Normalize for matching labels ↔ page titles (spaces, not hyphens). */
function normalizeMatchKey(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
}

/** Deterministic document id slug. */
function slugify(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replace(/æ/g, 'ae')
    .replace(/ø/g, 'o')
    .replace(/å/g, 'a')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
}

function i18nLabel(no: string, en: string): I18nValue[] {
  return [
    {
      _type: 'internationalizedArrayStringValue',
      _key: 'no',
      language: 'no',
      value: no,
    },
    {
      _type: 'internationalizedArrayStringValue',
      _key: 'en',
      language: 'en',
      value: en,
    },
  ]
}

function tagIdForLabel(no: string): string {
  return `specialist-tag.${slugify(no) || 'tag'}`
}

function publishedId(id: string): string {
  return id.startsWith('drafts.') ? id.slice('drafts.'.length) : id
}

function isReference(entry: SpecialtyEntry): boolean {
  return entry._type === 'reference' || Boolean(entry._ref)
}

function isSpecialtyItem(entry: SpecialtyEntry): boolean {
  return entry._type === 'specialtyItem' || (Boolean(entry.label) && !entry._ref)
}

function categoryPublicPath(categoryId: string | undefined, slugNo: string | undefined): string {
  const id = (categoryId || '').trim()
  if (id === 'flere-fagomrader' || id === 'annet') return '/ovrige'
  const slug = (slugNo || id).trim()
  return slug ? `/${slug}` : ''
}

function treatmentPublicPath(
  categoryId: string | undefined,
  categorySlugNo: string | undefined,
  treatmentSlug: string | undefined,
): string {
  const slug = (treatmentSlug || '').trim()
  if (!slug) return ''
  const catSeg =
    categoryId === 'flere-fagomrader' || categoryId === 'annet'
      ? 'ovrige'
      : (categorySlugNo || categoryId || '').trim()
  if (!catSeg) return ''
  return `/${catSeg}/${slug}`
}

function shortKey(): string {
  return randomUUID().replace(/-/g, '').slice(0, 12)
}

/**
 * Manual aliases when specialty keyword ≠ page title.
 * Keys = normalizeMatchKey(NO label). Values = public NO path.
 */
const HREF_ALIASES: Record<string, string> = {
  endometriose: '/gynekologi/endometriose',
  embryologi: '/fertilitet',
  ivf: '/fertilitet/ivf',
  brokkbehandling: '/ovrige/brokkoperasjon',
  brokkkirurgi: '/ovrige/brokkoperasjon',
  overvektskirurgi: '/ovrige/overvektskirurgi',
  gastrokirurgi: '/ovrige/gastrokirurgi',
  robotkirurgi: '/ovrige/robotkirurgi',
  ultralyd: '/graviditet/ultralyd',
  ernaering: '/ovrige/ernaeringsfysiolog',
  poi: '/gynekologi/poi',
  areknuter: '/ovrige/areknutebehandling',
  fotkirurgi: '/ortopedi/fot-ankel',
  'fot og ankelkirurgi': '/ortopedi/fot-ankel',
  handkirurgi: '/ortopedi/hand-albue',
  'hand og albuekirurgi': '/ortopedi/hand-albue',
  'hand og fotkirurgi': '/ortopedi/hand-albue',
  knekirurgi: '/ortopedi/kne',
  'kne og skulderkirurgi': '/ortopedi/kne',
  skulderkirurgi: '/ortopedi/skulder',
  hoftekirurgi: '/ortopedi/hofte',
  vulvodyni: '/gynekologi/vulvalidelser',
  vulvasmerter: '/gynekologi/vulvalidelser',
  vulvaklinikk: '/gynekologi/vulvalidelser',
  eggdonasjon: '/fertilitet/donorbehandling',
  forhudsoperasjoner: '/urologi/forhud',
  prostatakreft: '/urologi/prostata',
  endetarmsplager: '/ovrige/hemorroider',
  dermatologi: '/ovrige/hudhelse',
  hudkreft: '/ovrige/hudhelse',
  laserbehandling: '/ovrige/hudhelse',
  fodselshjelp: '/graviditet',
  obstetrikk: '/graviditet',
  bekkenbunnshelse: '/gynekologi/urogynekologi',
  inseminasjon: '/fertilitet/assistert-befruktning',
  reproduksjonsmedisin: '/fertilitet',
  'mikro tese': '/urologi/infertilitet',
  underlivsplager: '/gynekologi',
  hormoner: '/gynekologi/poi',
  hormonsykdommer: '/ovrige/endokrinologi',
  stoffskifte: '/ovrige/endokrinologi',
  diabetes: '/ovrige/endokrinologi',
  indremedisin: '/ovrige/endokrinologi',
  fertilitetsradgivning: '/fertilitet',
  familieterapi: '/fertilitet/teamet',
  kvinnehelse: '/gynekologi',
  'seksuell helse': '/ovrige/sexologi',
  laparoskopi: '/gynekologi/gynekologisk-kirurgi',
  endoskopi: '/ovrige/gastrokirurgi',
  'endoskopisk kirurgi': '/gynekologi/gynekologisk-kirurgi',
  'gynekologisk kreftbehandling': '/gynekologi/gynekologisk-kirurgi',
  artroskopi: '/ortopedi',
  'artroskopisk kirurgi': '/ortopedi',
  'artroskopisk handkirurgi': '/ortopedi/hand-albue',
  'skopisk kirurgi': '/ortopedi',
  idrettsmedisin: '/ortopedi',
  idrettsskader: '/ortopedi',
  protesekirurgi: '/ortopedi',
  traumatologi: '/ortopedi',
  korsbandkirurgi: '/ortopedi/kne',
  karkirurgi: '/ovrige/areknutebehandling',
  venebehandling: '/ovrige/areknutebehandling',
  fysioterapi: '/ovrige/osteopati',
  rehabilitering: '/ovrige/osteopati',
  handterapi: '/ortopedi/hand-albue',
  ibs: '/ovrige/ernaeringsfysiolog',
  lavfodmap: '/ovrige/ernaeringsfysiolog',
  spiseforstyrrelser: '/ovrige/ernaeringsfysiolog',
  livsstilsveiledning: '/ovrige/ernaeringsfysiolog',
  emdr: '/ovrige/psykologi',
  terapi: '/ovrige/psykologi',
  prevensjon: '/gynekologi',
  nerveskader: '/ortopedi/hand-albue',
  'generell kirurgi': '/ovrige/gastrokirurgi',
  'kosmetisk kirurgi': '/ovrige/plastikkirurgi',
  rekonstruksjonskirurgi: '/ovrige/plastikkirurgi',
  vaskulitt: '/ovrige/revmatologi',
}

type LinkCandidate = {
  href: string
  kind: 'category' | 'treatment'
  titleKey: string
  slug: string
}

function scoreLinkMatch(tagKey: string, tagSlug: string, candidate: LinkCandidate): number {
  if (!tagKey) return 0
  if (tagKey === candidate.titleKey) return candidate.kind === 'category' ? 1000 : 900
  if (tagSlug && tagSlug === candidate.slug) return candidate.kind === 'category' ? 950 : 850

  // Tag contained in page title (e.g. "Endometriose" ⊂ "Endometriose og adenomyose")
  if (tagKey.length >= 5 && candidate.titleKey.includes(tagKey)) {
    return candidate.kind === 'category' ? 700 : 650
  }
  // Page title contained in tag (e.g. "Prostata" ⊂ "Prostatakreft")
  if (candidate.titleKey.length >= 5 && tagKey.includes(candidate.titleKey)) {
    return candidate.kind === 'category' ? 600 : 550
  }
  // Slug containment
  if (tagSlug.length >= 5 && candidate.slug.includes(tagSlug)) {
    return 500
  }
  if (candidate.slug.length >= 5 && tagSlug.includes(candidate.slug)) {
    return 450
  }
  return 0
}

function buildHrefResolver(pages: PageDoc[]): (no: string, en?: string) => string | undefined {
  const candidates: LinkCandidate[] = []
  const exact = new Map<string, string>()

  for (const page of pages) {
    const titleNo =
      typeof page.titleNo === 'string' ? page.titleNo.trim() : readI18n(page.titleNo, 'no')
    const titleEn =
      typeof page.titleEn === 'string' ? page.titleEn.trim() : readI18n(page.titleEn, 'en')
    const slug = (page.slugNo || '').trim().toLowerCase()
    const href =
      page._type === 'treatmentCategory'
        ? categoryPublicPath(page.categoryId, page.slugNo)
        : treatmentPublicPath(page.categoryId, page.categorySlugNo, page.slugNo)
    if (!href) continue

    const titleKey = normalizeMatchKey(titleNo)
    const kind = page._type === 'treatmentCategory' ? 'category' : 'treatment'
    candidates.push({href, kind, titleKey, slug})

    const keys = [
      titleKey,
      normalizeMatchKey(titleEn),
      normalizeMatchKey(slug.replace(/-/g, ' ')),
      slug,
    ].filter(Boolean)

    for (const key of keys) {
      const prev = exact.get(key)
      if (!prev || kind === 'category') exact.set(key, href)
    }
  }

  return (no: string, en = '') => {
    const tagKey = normalizeMatchKey(no)
    const tagSlug = slugify(no)
    const alias = HREF_ALIASES[tagKey]
    if (alias) return alias

    const exactHit =
      exact.get(tagKey) ||
      exact.get(normalizeMatchKey(en)) ||
      exact.get(tagSlug) ||
      exact.get(normalizeMatchKey(tagSlug.replace(/-/g, ' ')))
    if (exactHit) return exactHit

    let best: {href: string; score: number} | undefined
    for (const candidate of candidates) {
      const score = scoreLinkMatch(tagKey, tagSlug, candidate)
      if (score <= 0) continue
      if (!best || score > best.score) best = {href: candidate.href, score}
    }
    return best?.href
  }
}

async function main() {
  console.log(
    `\n[migrate-specialist-tags] project=${PROJECT_ID} dataset=${DATASET}` +
      ` dry=${DRY_RUN} fillHrefsOnly=${FILL_HREFS_ONLY} forceHref=${FORCE_HREF}\n`,
  )

  const [existingTags, specialists, pages] = await Promise.all([
    sanityClient.fetch<TagDoc[]>(`*[_type == "specialistTag"]{_id, label, href}`),
    sanityClient.fetch<SpecialistDoc[]>(`*[_type == "specialist"]{_id, name, specialties}`),
    sanityClient.fetch<PageDoc[]>(`*[_type in ["treatment", "treatmentCategory"] && !(_id in path("drafts.**"))]{
      _id,
      _type,
      "titleNo": coalesce(title[language == "no"][0].value, title[_key == "no"][0].value, title),
      "titleEn": coalesce(title[language == "en"][0].value, title[_key == "en"][0].value),
      "slugNo": coalesce(
        slug[language == "no"][0].value.current,
        slug[_key == "no"][0].value.current,
        slug[0].value.current,
        slug.current
      ),
      "categoryId": coalesce(categories[0]->categoryId, category->categoryId, categoryId),
      "categorySlugNo": coalesce(
        categories[0]->slug[language == "no"][0].value.current,
        categories[0]->slug[_key == "no"][0].value.current,
        category->slug[language == "no"][0].value.current,
        category->slug[_key == "no"][0].value.current,
        categories[0]->categoryId,
        category->categoryId
      )
    }`),
  ])

  const resolveHref = buildHrefResolver(pages)

  console.log(`Existing specialistTag docs: ${existingTags.length}`)
  console.log(`Specialist docs: ${specialists.length}`)
  console.log(`Pages indexed for auto-link: ${pages.length}`)

  const knownTagIds = new Set(existingTags.map((tag) => publishedId(tag._id)))
  const tagByNo = new Map<string, string>()
  for (const tag of existingTags) {
    const no = readI18n(tag.label, 'no')
    if (!no) continue
    const key = normalizeMatchKey(no)
    if (!key) continue
    const id = publishedId(tag._id)
    const prev = tagByNo.get(key)
    if (!prev || tag._id === id) tagByNo.set(key, id)
  }

  type PendingTag = {id: string; no: string; en: string; href?: string}
  const pendingTags = new Map<string, PendingTag>()

  function ensureTag(no: string, enRaw: string): string {
    const key = normalizeMatchKey(no)
    const existing = tagByNo.get(key)
    if (existing) return existing

    const en = (enRaw && enRaw !== no ? enRaw : translateKeywords(no) || no).trim()
    const id = tagIdForLabel(no)
    const href = resolveHref(no, en)
    tagByNo.set(key, id)
    knownTagIds.add(id)
    if (!pendingTags.has(id)) {
      pendingTags.set(id, href ? {id, no, en, href} : {id, no, en})
    }
    return id
  }

  /* ── Fill empty href on existing tags ─────────────────────────────── */
  type HrefPatch = {id: string; no: string; href: string; previous?: string}
  const hrefPatches: HrefPatch[] = []
  const unlinkedLabels: string[] = []

  for (const tag of existingTags) {
    const no = readI18n(tag.label, 'no')
    if (!no) continue
    const en = readI18n(tag.label, 'en')
    const href = resolveHref(no, en)
    if (!href) {
      unlinkedLabels.push(no)
      continue
    }
    const current = typeof tag.href === 'string' ? tag.href.trim() : ''
    if (current && !FORCE_HREF) continue
    if (current === href) continue
    hrefPatches.push({
      id: tag._id,
      no,
      href,
      previous: current || undefined,
    })
  }

  /* ── Rewrite specialist specialties ───────────────────────────────── */
  type PatchPlan = {
    id: string
    name: string
    fromCount: number
    legacyCount: number
    droppedBrokenRefs: number
    specialties: Array<{_type: 'reference'; _ref: string; _key: string}>
  }
  const plans: PatchPlan[] = []

  if (!FILL_HREFS_ONLY) {
    for (const doc of specialists) {
      const entries = Array.isArray(doc.specialties) ? doc.specialties : []
      if (entries.length === 0) continue

      const legacyCount = entries.filter(isSpecialtyItem).length
      let droppedBrokenRefs = 0
      const refs: Array<{_type: 'reference'; _ref: string; _key: string}> = []
      const seen = new Set<string>()

      for (const entry of entries) {
        if (isReference(entry) && entry._ref) {
          const ref = publishedId(entry._ref)
          if (!knownTagIds.has(ref) && !pendingTags.has(ref)) {
            droppedBrokenRefs += 1
            continue
          }
          if (seen.has(ref)) continue
          seen.add(ref)
          refs.push({
            _type: 'reference',
            _ref: ref,
            _key: entry._key || shortKey(),
          })
          continue
        }

        if (!isSpecialtyItem(entry)) continue
        const no = readI18n(entry.label, 'no') || readI18n(entry.label, 'en')
        if (!no) continue
        const en = readI18n(entry.label, 'en')
        const ref = ensureTag(no, en)
        if (seen.has(ref)) continue
        seen.add(ref)
        refs.push({
          _type: 'reference',
          _ref: ref,
          _key: entry._key || `tag-${slugify(no).slice(0, 12) || shortKey()}`,
        })
      }

      if (legacyCount === 0 && droppedBrokenRefs === 0 && entries.every(isReference)) {
        continue
      }

      if (refs.length === 0) {
        console.warn(`  skip ${doc._id} (${doc.name}): no convertible specialties`)
        continue
      }

      const alreadyOk =
        legacyCount === 0 &&
        droppedBrokenRefs === 0 &&
        entries.length === refs.length &&
        entries.every(
          (e, i) => isReference(e) && publishedId(e._ref || '') === refs[i]?._ref,
        )
      if (alreadyOk) continue

      plans.push({
        id: doc._id,
        name: doc.name || doc._id,
        fromCount: entries.length,
        legacyCount,
        droppedBrokenRefs,
        specialties: refs,
      })
    }
  }

  /* ── Plan summary ─────────────────────────────────────────────────── */
  console.log(`\nNew specialistTag docs to create: ${pendingTags.size}`)
  console.log(`Existing tags to fill/update href: ${hrefPatches.length}`)
  console.log(`Specialist docs to patch: ${plans.length}`)

  for (const tag of pendingTags.values()) {
    console.log(
      `  + tag ${tag.id}  NO="${tag.no}" EN="${tag.en}"` +
        (tag.href ? ` → ${tag.href}` : ' → (no link)'),
    )
  }
  for (const patch of hrefPatches) {
    console.log(
      `  ~ href ${publishedId(patch.id)} "${patch.no}"` +
        (patch.previous ? ` ${patch.previous} →` : ' →') +
        ` ${patch.href}`,
    )
  }
  for (const plan of plans) {
    console.log(
      `  ~ ${plan.id} (${plan.name}): ${plan.fromCount} → ${plan.specialties.length} refs` +
        ` (${plan.legacyCount} legacy` +
        `${plan.droppedBrokenRefs ? `, dropped ${plan.droppedBrokenRefs} broken` : ''})`,
    )
  }

  if (unlinkedLabels.length > 0) {
    const unique = [...new Set(unlinkedLabels)].sort((a, b) => a.localeCompare(b, 'nb'))
    console.log(`\nTags without a matching page title (${unique.length}) — set href in Studio:`)
    for (const label of unique) console.log(`   - ${label}`)
  }

  if (DRY_RUN) {
    console.log('\nDry run only — no writes.\n')
    return
  }

  /* ── Writes ───────────────────────────────────────────────────────── */
  for (const tag of pendingTags.values()) {
    await sanityClient.createOrReplace({
      _id: tag.id,
      _type: 'specialistTag',
      label: i18nLabel(tag.no, tag.en),
      ...(tag.href ? {href: tag.href} : {}),
    })
  }

  for (const patch of hrefPatches) {
    await sanityClient.patch(patch.id).set({href: patch.href}).commit()
  }

  for (const plan of plans) {
    await sanityClient.patch(plan.id).set({specialties: plan.specialties}).commit()
  }

  console.log(
    `\nDone. Created ${pendingTags.size} tags, updated ${hrefPatches.length} hrefs,` +
      ` patched ${plans.length} specialists.\n`,
  )
}

main().catch((err) => {
  console.error('❌ Migration failed:', err)
  process.exit(1)
})
