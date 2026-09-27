/**
 * Specialist ↔ Treatment links, shared by the specialist "Treatments" field
 * and the specialist Publish action.
 *
 * A treatment shows a specialist through its Specialists band
 * (pageSectionSpecialists): Choose manually, Filter by category or All,
 * plus "Hidden from this page".
 *
 * The specialist's Treatments field is the editor's wish list. It is only
 * written to the treatments when the specialist is published, and only the
 * editor's own changes since `treatmentsBaseline` (the last synced list) are
 * applied — so links made from a treatment page are never undone by accident.
 */
import type {SanityClient} from 'sanity'
import {pickNo} from '../../schemaTypes/i18n'
import {
  newArrayKey,
  pageSectionCategoryKey,
  publishedDocumentId,
  resolvePageSectionSpecialists,
  type StudioSpecialist,
} from './resolve-page-section-specialists'
import {specialistSlugProjection} from './specialist-slug-groq'

export type RefRow = {_type?: string; _key?: string; _ref?: string; _weak?: boolean}

export type TreatmentBand = {
  _type?: string
  _key?: string
  displayMode?: string
  includeIndividualSpecialists?: boolean
  limit?: number
  categorySlug?: string
  treatmentCategory?: {_ref?: string}
  treatmentCategoryId?: string
  specialists?: RefRow[]
  excludedSpecialists?: RefRow[]
}

export type TreatmentDoc = {
  _id: string
  title?: unknown
  pageSections?: TreatmentBand[]
}

export type LinkState = {
  treatments: TreatmentDoc[]
  catalog: StudioSpecialist[]
}

export type SpecialistLike = {
  _id?: string
  name?: string
  slug?: unknown
  categories?: Array<{_ref?: string}>
}

const BAND_PROJECTION = `pageSections[]{
  _type,
  _key,
  displayMode,
  includeIndividualSpecialists,
  limit,
  categorySlug,
  treatmentCategory,
  "treatmentCategoryId": treatmentCategory->categoryId,
  specialists[]{_key, _ref},
  excludedSpecialists[]{_key, _ref}
}`

/** Published treatments only — that is what the website shows. */
const PUBLISHED_TREATMENTS_QUERY = `*[_type == "treatment" && !(_id in path("drafts.**"))]{
  _id,
  "title": coalesce(title[language == "no"][0].value, title[_key == "no"][0].value, title[0].value),
  ${BAND_PROJECTION}
}`

const CATALOG_QUERY = `*[_type == "specialist" && !(_id in path("drafts.**"))]{
  _id, name, ${specialistSlugProjection}, "categoryIds": categories[]->categoryId
}`

export function bandOf(doc: TreatmentDoc | undefined | null): TreatmentBand | undefined {
  const sections = doc?.pageSections
  if (!Array.isArray(sections)) return undefined
  return sections.find((section) => section?._type === 'pageSectionSpecialists')
}

function refsWithout(refs: RefRow[] | undefined, specialistId: string): RefRow[] {
  return (refs ?? []).filter(
    (ref) => !ref?._ref || publishedDocumentId(ref._ref) !== specialistId,
  )
}

function hasRef(refs: RefRow[] | undefined, specialistId: string): boolean {
  return (refs ?? []).some(
    (ref) => Boolean(ref?._ref) && publishedDocumentId(ref._ref || '') === specialistId,
  )
}

function explicitFromBand(band: TreatmentBand, catalog: StudioSpecialist[]): StudioSpecialist[] {
  return (band.specialists ?? [])
    .map((ref) => ref?._ref)
    .filter((id): id is string => Boolean(id))
    .map((id) => {
      const published = publishedDocumentId(id)
      const match = catalog.find((row) => publishedDocumentId(row._id || '') === published)
      return match || {_id: published, name: published, categoryIds: []}
    })
}

function bandCategoryKey(band: TreatmentBand, categoryId?: string): string | undefined {
  return pageSectionCategoryKey({
    categorySlug: band.categorySlug,
    treatmentCategory: {categoryId: categoryId ?? band.treatmentCategoryId, slug: band.categorySlug},
  })
}

/** Is the specialist shown by this band (after limit and Hidden from this page)? */
function bandShowsSpecialist(
  band: TreatmentBand | undefined,
  specialistId: string,
  catalog: StudioSpecialist[],
  categoryKey: string | undefined,
): boolean {
  if (!band?.displayMode) return false
  const result = resolvePageSectionSpecialists({
    displayMode: band.displayMode,
    explicit: explicitFromBand(band, catalog),
    allSpecialists: catalog,
    categoryKey,
    limit: band.limit,
    excluded: band.excludedSpecialists,
    includeExplicitInCategory: band.includeIndividualSpecialists === true,
  })
  return result.visible.some((row) => publishedDocumentId(row._id || '') === specialistId)
}

/** Catalog with this specialist's own (draft) categories — they publish together. */
function catalogWithSelf(catalog: StudioSpecialist[], self: StudioSpecialist): StudioSpecialist[] {
  if (!self._id) return catalog
  let found = false
  const rows = catalog.map((row) => {
    if (publishedDocumentId(row._id || '') !== self._id) return row
    found = true
    return {...row, categoryIds: self.categoryIds}
  })
  return found ? rows : [...rows, self]
}

export function publishedRefIds(value: unknown): string[] {
  if (!Array.isArray(value)) return []
  const ids: string[] = []
  const seen = new Set<string>()
  for (const row of value) {
    const ref = typeof row === 'string' ? row : (row as RefRow)?._ref
    if (!ref) continue
    const id = publishedDocumentId(ref)
    if (!id || seen.has(id)) continue
    seen.add(id)
    ids.push(id)
  }
  return ids
}

export function sameIdSet(left: string[], right: string[]): boolean {
  if (left.length !== right.length) return false
  const seen = new Set(left)
  return right.every((id) => seen.has(id))
}

export function treatmentItemKey(treatmentId: string): string {
  return `treat-${publishedDocumentId(treatmentId).replace(/[^a-zA-Z0-9_-]/g, '')}`
}

export function treatmentTitle(doc: TreatmentDoc | undefined | null): string {
  return pickNo(doc?.title) || (typeof doc?.title === 'string' ? doc.title : '') || 'Untitled treatment'
}

export async function fetchLinkState(client: SanityClient): Promise<LinkState> {
  const [treatments, catalog] = await Promise.all([
    client.fetch<TreatmentDoc[]>(PUBLISHED_TREATMENTS_QUERY),
    client.fetch<StudioSpecialist[]>(CATALOG_QUERY),
  ])
  return {
    treatments: Array.isArray(treatments) ? treatments : [],
    catalog: Array.isArray(catalog) ? catalog : [],
  }
}

function slugFromValue(slug: unknown): string | undefined {
  if (typeof slug === 'string') return slug || undefined
  if (slug && typeof slug === 'object' && 'current' in slug) {
    return (slug as {current?: string}).current || undefined
  }
  if (!Array.isArray(slug)) return undefined
  const rows = (slug as Array<{language?: string; _key?: string; value?: {current?: string}}>).map(
    (row) => ({language: row.language, _key: row._key, value: row.value?.current}),
  )
  return pickNo(rows) || undefined
}

/** Resolve the specialist (with category ids) as the website resolver sees it. */
export async function resolveSelf(
  client: SanityClient,
  doc: SpecialistLike,
): Promise<StudioSpecialist> {
  const refs = (doc.categories ?? [])
    .map((row) => row?._ref)
    .filter((id): id is string => Boolean(id))
    .map(publishedDocumentId)
  let categoryIds: string[] = []
  if (refs.length) {
    const rows = await client.fetch<Array<{categoryId?: string}>>(
      `*[_type == "treatmentCategory" && _id in $ids]{categoryId}`,
      {ids: refs.flatMap((id) => [id, `drafts.${id}`])},
    )
    categoryIds = [
      ...new Set(rows.map((row) => row.categoryId).filter((id): id is string => Boolean(id))),
    ]
  }
  return {
    _id: publishedDocumentId(doc._id || ''),
    name: doc.name || 'This specialist',
    slug: slugFromValue(doc.slug),
    categoryIds,
  }
}

/** Published treatments whose Specialists band currently shows this specialist. */
export function treatmentsShowingSpecialist(state: LinkState, self: StudioSpecialist): string[] {
  if (!self._id) return []
  const catalog = catalogWithSelf(state.catalog, self)
  const ids: string[] = []
  for (const row of state.treatments) {
    const band = bandOf(row)
    if (band && bandShowsSpecialist(band, self._id, catalog, bandCategoryKey(band))) {
      ids.push(publishedDocumentId(row._id))
    }
  }
  return ids.sort((a, b) => a.localeCompare(b))
}

/**
 * Editor changes waiting for the specialist to be published.
 * `baseline` is the last synced list; changes that already match the
 * treatments (e.g. added from the treatment page too) are dropped.
 */
export function pendingTreatmentChanges(params: {
  desired: string[]
  baseline: string[]
  showing: string[]
}): {add: string[]; remove: string[]} {
  const showing = new Set(params.showing)
  const desired = new Set(params.desired)
  const baseline = new Set(params.baseline)
  return {
    add: params.desired.filter((id) => !baseline.has(id) && !showing.has(id)),
    remove: params.baseline.filter((id) => !desired.has(id) && showing.has(id)),
  }
}

type BandPlan = {
  sections: TreatmentBand[]
  index: number
  band: TreatmentBand | undefined
  nextBand: TreatmentBand
}

async function planBandChange(params: {
  client: SanityClient
  doc: TreatmentDoc
  action: 'add' | 'remove'
  specialistId: string
  catalog: StudioSpecialist[]
}): Promise<BandPlan | null> {
  const {client, doc, action, specialistId, catalog} = params
  const sections = Array.isArray(doc.pageSections) ? [...doc.pageSections] : []
  const index = sections.findIndex((section) => section?._type === 'pageSectionSpecialists')
  const band = index >= 0 ? sections[index] : undefined

  let categoryKey: string | undefined
  if (band) {
    const ref = band.treatmentCategory?._ref
    let categoryId: string | undefined
    if (ref) {
      const id = publishedDocumentId(ref)
      categoryId =
        (await client.fetch<string | null>(`*[_id in $ids][0].categoryId`, {
          ids: [id, `drafts.${id}`],
        })) || undefined
    }
    categoryKey = bandCategoryKey(band, categoryId)
  }
  const selfRef = () => ({_type: 'reference', _ref: specialistId, _key: newArrayKey('spec')})

  if (action === 'add') {
    if (band && bandShowsSpecialist(band, specialistId, catalog, categoryKey)) return null
    if (!band) {
      const created = {
        _type: 'pageSectionSpecialists',
        _key: newArrayKey('specs'),
        displayMode: 'manual',
        variant: 'carousel',
        limit: 8,
        seeAllHref: '/spesialister',
        specialists: [selfRef()],
      } as TreatmentBand
      return {sections, index, band, nextBand: created}
    }
    const candidate: TreatmentBand = {
      ...band,
      displayMode: band.displayMode || 'manual',
      excludedSpecialists: refsWithout(band.excludedSpecialists, specialistId),
    }
    if (!bandShowsSpecialist(candidate, specialistId, catalog, categoryKey)) {
      candidate.specialists = [...(band.specialists ?? []), selfRef()]
      // Filter by category only shows individual picks with this switch on.
      if (candidate.displayMode === 'category') candidate.includeIndividualSpecialists = true
    }
    return {sections, index, band, nextBand: candidate}
  }

  if (!band || !bandShowsSpecialist(band, specialistId, catalog, categoryKey)) return null
  const candidate: TreatmentBand = {
    ...band,
    specialists: refsWithout(band.specialists, specialistId),
  }
  // Ignore Max items here so they stay off even if the limit is raised later.
  if (
    bandShowsSpecialist({...candidate, limit: undefined}, specialistId, catalog, categoryKey) &&
    !hasRef(candidate.excludedSpecialists, specialistId)
  ) {
    // Still matched by Category / All — hide them on this page instead.
    candidate.excludedSpecialists = [
      ...(candidate.excludedSpecialists ?? []),
      {_type: 'reference', _weak: true, _ref: specialistId, _key: newArrayKey('hide')},
    ]
  }
  return {sections, index, band, nextBand: candidate}
}

async function applyBandPlan(client: SanityClient, docId: string, plan: BandPlan) {
  const {sections, index, band, nextBand} = plan
  if (!band) {
    await client.patch(docId).setIfMissing({pageSections: []}).append('pageSections', [nextBand]).commit()
    return
  }
  const fields = {
    displayMode: nextBand.displayMode,
    includeIndividualSpecialists: nextBand.includeIndividualSpecialists === true,
    specialists: nextBand.specialists ?? [],
    excludedSpecialists: nextBand.excludedSpecialists ?? [],
  }
  if (band._key) {
    const path = `pageSections[_key=="${band._key}"]`
    await client
      .patch(docId)
      .set({
        [`${path}.displayMode`]: fields.displayMode,
        [`${path}.includeIndividualSpecialists`]: fields.includeIndividualSpecialists,
        [`${path}.specialists`]: fields.specialists,
        [`${path}.excludedSpecialists`]: fields.excludedSpecialists,
      })
      .commit()
    return
  }
  sections[index] = {...band, ...fields}
  await client.patch(docId).set({pageSections: sections}).commit({autoGenerateArrayKeys: true})
}

/**
 * Write add/remove changes to the published treatments (and any open
 * treatment draft, so publishing that draft later does not undo them).
 * Call only when the specialist is published — the live page references it.
 */
export async function applyTreatmentChanges(params: {
  client: SanityClient
  self: StudioSpecialist
  add: string[]
  remove: string[]
}): Promise<{
  added: string[]
  removed: string[]
  failed: Array<{id: string; action: 'add' | 'remove'; title: string; error: string}>
}> {
  const {client, self, add, remove} = params
  const specialistId = self._id || ''
  const catalog = catalogWithSelf(
    (await client.fetch<StudioSpecialist[]>(CATALOG_QUERY)) ?? [],
    self,
  )
  const added: string[] = []
  const removed: string[] = []
  const failed: Array<{id: string; action: 'add' | 'remove'; title: string; error: string}> = []

  const jobs = [
    ...add.map((id) => ({id, action: 'add' as const})),
    ...remove.map((id) => ({id, action: 'remove' as const})),
  ]
  for (const job of jobs) {
    const [published, draft] = await Promise.all([
      client.getDocument<TreatmentDoc>(job.id),
      client.getDocument<TreatmentDoc>(`drafts.${job.id}`),
    ])
    const title = treatmentTitle(published || draft)
    try {
      if (!published) throw new Error('Treatment is not published')
      const livePlan = await planBandChange({client, doc: published, action: job.action, specialistId, catalog})
      if (livePlan) await applyBandPlan(client, job.id, livePlan)
      if (draft) {
        const draftPlan = await planBandChange({client, doc: draft, action: job.action, specialistId, catalog})
        if (draftPlan) await applyBandPlan(client, draft._id, draftPlan)
      }
      ;(job.action === 'add' ? added : removed).push(title)
    } catch (error: unknown) {
      failed.push({id: job.id, action: job.action, title, error: error instanceof Error ? error.message : 'Unknown error'})
    }
  }
  return {added, removed, failed}
}

type SpecialistLinkDoc = {
  _id: string
  name?: string
  appearingOnTreatments?: RefRow[]
  treatmentsBaseline?: string[]
}

/** Published specialists the treatment's Specialists band shows right now. */
export async function specialistsShownByTreatment(
  client: SanityClient,
  treatmentId: string,
): Promise<string[]> {
  const id = publishedDocumentId(treatmentId)
  const [treatment, catalog] = await Promise.all([
    client.fetch<TreatmentDoc | null>(`*[_id == $id][0]{_id, ${BAND_PROJECTION}}`, {id}),
    client.fetch<StudioSpecialist[]>(CATALOG_QUERY),
  ])
  const band = bandOf(treatment)
  if (!band?.displayMode) return []
  const result = resolvePageSectionSpecialists({
    displayMode: band.displayMode,
    explicit: explicitFromBand(band, catalog ?? []),
    allSpecialists: catalog ?? [],
    categoryKey: bandCategoryKey(band),
    limit: band.limit,
    excluded: band.excludedSpecialists,
    includeExplicitInCategory: band.includeIndividualSpecialists === true,
  })
  return publishedRefIds(result.visible.map((row) => row._id || ''))
}

function withTreatment(ids: string[], treatmentId: string, shown: boolean): string[] {
  const without = ids.filter((id) => id !== treatmentId)
  return shown ? [...without, treatmentId] : without
}

/**
 * After a treatment is published: bring each specialist's Treatments field
 * (published and draft) in line with the treatment's Specialists band.
 *
 * Specialists whose visibility on this treatment changed with this publish are
 * always updated. Others are only corrected when the editor has no unpublished
 * changes to their Treatments list (value == treatmentsBaseline).
 */
export async function syncSpecialistsForTreatment(params: {
  client: SanityClient
  treatmentId: string
  /** Specialists shown before the publish; null when unknown. */
  before: string[] | null
}): Promise<{added: string[]; removed: string[]; failed: string[]}> {
  const {client} = params
  const treatmentId = publishedDocumentId(params.treatmentId)
  const [after, docs] = await Promise.all([
    specialistsShownByTreatment(client, treatmentId),
    client.fetch<SpecialistLinkDoc[]>(
      `*[_type == "specialist" && !(_id in path("versions.**"))]{
        _id, name, appearingOnTreatments[]{_type, _key, _ref, _weak}, treatmentsBaseline
      }`,
    ),
  ])
  const shownAfter = new Set(after)
  const shownBefore = params.before ? new Set(params.before) : null
  const added = new Set<string>()
  const removed = new Set<string>()
  const failed = new Set<string>()

  for (const doc of docs ?? []) {
    const specialistId = publishedDocumentId(doc._id)
    const shown = shownAfter.has(specialistId)
    const changedNow = shownBefore ? shownBefore.has(specialistId) !== shown : false
    const value = publishedRefIds(doc.appearingOnTreatments)
    const baseline = Array.isArray(doc.treatmentsBaseline)
      ? publishedRefIds(doc.treatmentsBaseline)
      : value
    if (!changedNow && !sameIdSet(value, baseline)) continue

    const nextValue = withTreatment(value, treatmentId, shown)
    const nextBaseline = withTreatment(baseline, treatmentId, shown)
    if (
      value.includes(treatmentId) === shown &&
      baseline.includes(treatmentId) === shown &&
      Array.isArray(doc.treatmentsBaseline)
    ) {
      continue
    }

    const keyById = new Map(
      (doc.appearingOnTreatments ?? [])
        .filter((row) => row?._ref)
        .map((row) => [publishedDocumentId(row._ref || ''), row._key]),
    )
    try {
      await client
        .patch(doc._id)
        .set({
          appearingOnTreatments: nextValue.map((id) => ({
            _type: 'reference',
            _weak: true,
            _key: keyById.get(id) || treatmentItemKey(id),
            _ref: id,
          })),
          treatmentsBaseline: nextBaseline,
        })
        .commit()
      if (value.includes(treatmentId) !== shown) {
        ;(shown ? added : removed).add(doc.name || specialistId)
      }
    } catch (error: unknown) {
      console.error('[sync-specialists-for-treatment]', doc._id, error)
      failed.add(doc.name || specialistId)
    }
  }
  return {added: [...added], removed: [...removed], failed: [...failed]}
}
