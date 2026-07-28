/**
 * Phase 1 Task 1 — Audit unknown/orphaned fields on the developer dataset.
 *
 * Compares every document (published + drafts) against registered schemas.
 * Does NOT mutate data. Write report JSON for review before cleanup.
 *
 * Usage (from test/):
 *   npx tsx sanity/audit-unknown-fields.ts
 *
 * Safety: uses assertMigrationDatasetAllowed() — refuses production.
 */
import {writeFileSync} from 'fs'
import {resolve} from 'path'
import {DATASET, PROJECT_ID, sanityClient} from './config'
import {schemaTypes} from '../schemaTypes'

const SYSTEM_KEYS = new Set([
  '_id',
  '_type',
  '_rev',
  '_createdAt',
  '_updatedAt',
  '_key',
  '_ref',
  '_weak',
  '_strengthenOnPublish',
  '_originalId',
  '_system',
])

/** Plugin / built-in types whose internal keys we should not treat as orphan. */
const OPAQUE_VALUE_TYPES = new Set([
  'image',
  'file',
  'slug',
  'geopoint',
  'reference',
  'crossDatasetReference',
  'datetime',
  'date',
  'number',
  'string',
  'text',
  'boolean',
  'url',
  'email',
  'block',
  'span',
  // internationalized-array plugin value wrappers
  'internationalizedArrayStringValue',
  'internationalizedArrayTextValue',
  'internationalizedArraySlugValue',
  'internationalizedArrayBlockContentValue',
])

type SchemaNode = {
  name?: string
  type?: string
  fields?: SchemaNode[]
  of?: SchemaNode[]
  to?: SchemaNode[]
  options?: Record<string, unknown>
}

type FieldMap = Map<string, Set<string>>

type UnknownHit = {
  docId: string
  docType: string
  path: string
  field: string
  isDraft: boolean
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === 'object' && !Array.isArray(v)
}

/** Collect named object/document types → allowed field names. */
function buildNamedFieldMap(types: SchemaNode[]): FieldMap {
  const map: FieldMap = new Map()

  for (const t of types) {
    if (!t?.name || !Array.isArray(t.fields)) continue
    const names = new Set<string>()
    for (const f of t.fields) {
      if (f?.name) names.add(f.name)
    }
    map.set(t.name, names)
  }

  return map
}

/**
 * Index of named types for nested lookup.
 * Also remember inline object field defs keyed by "parentType.fieldName".
 */
function buildTypeIndex(types: SchemaNode[]) {
  const byName = new Map<string, SchemaNode>()
  for (const t of types) {
    if (t?.name) byName.set(t.name, t)
  }
  return byName
}

function resolveType(
  typeName: string | undefined,
  byName: Map<string, SchemaNode>,
): SchemaNode | undefined {
  if (!typeName) return undefined
  return byName.get(typeName)
}

function fieldNamesFromNode(node: SchemaNode | undefined): Set<string> | null {
  if (!node) return null
  if (Array.isArray(node.fields)) {
    return new Set(node.fields.filter((f) => f?.name).map((f) => f.name as string))
  }
  return null
}

function getFieldDef(
  parentType: SchemaNode | undefined,
  fieldName: string,
): SchemaNode | undefined {
  if (!parentType?.fields) return undefined
  return parentType.fields.find((f) => f.name === fieldName)
}

/**
 * Walk document value against schema node.
 * Emits unknown field hits. Opaque / primitive containers stop recursion.
 */
function walkValue(
  value: unknown,
  schemaNode: SchemaNode | undefined,
  byName: Map<string, SchemaNode>,
  path: string,
  ctx: {docId: string; docType: string; isDraft: boolean},
  hits: UnknownHit[],
  depth: number,
) {
  if (depth > 30) return
  if (value == null) return

  const typeName = schemaNode?.type
  const resolved =
    typeName && !schemaNode?.fields
      ? resolveType(typeName, byName) || schemaNode
      : schemaNode

  // Named types with fields (document/object)
  const effective =
    resolved?.fields
      ? resolved
      : typeName
        ? resolveType(typeName, byName)
        : undefined

  if (Array.isArray(value)) {
    const ofDefs = schemaNode?.of || effective?.of || []
    for (let i = 0; i < value.length; i++) {
      const item = value[i]
      if (!isRecord(item)) continue

      // Pick matching `of` member by _type when present
      let member: SchemaNode | undefined
      if (typeof item._type === 'string') {
        member =
          ofDefs.find((o) => o.type === item._type) ||
          resolveType(item._type, byName) ||
          ofDefs.find((o) => o.name === item._type)
      }
      if (!member && ofDefs.length === 1) member = ofDefs[0]
      if (!member && ofDefs.length > 1) {
        // Prefer object with fields when no _type
        member = ofDefs.find((o) => o.type === 'object' || o.fields) || ofDefs[0]
      }

      const memberResolved =
        member?.type && !member.fields
          ? resolveType(member.type, byName) || member
          : member

      const itemPath = path ? `${path}[${i}]` : `[${i}]`

      // Internationalized array items: {_key, language, value}
      if (
        memberResolved?.type?.startsWith('internationalizedArray') ||
        (typeof item.language === 'string' && 'value' in item)
      ) {
        // Only recurse into value if it's a nested object/array with schema
        continue
      }

      const allowed = fieldNamesFromNode(memberResolved)
      if (allowed) {
        for (const key of Object.keys(item)) {
          if (SYSTEM_KEYS.has(key)) continue
          if (!allowed.has(key)) {
            hits.push({
              docId: ctx.docId,
              docType: ctx.docType,
              path: itemPath,
              field: key,
              isDraft: ctx.isDraft,
            })
          } else {
            const childDef = getFieldDef(memberResolved, key)
            walkValue(
              item[key],
              childDef,
              byName,
              `${itemPath}.${key}`,
              ctx,
              hits,
              depth + 1,
            )
          }
        }
      } else if (memberResolved?.type && OPAQUE_VALUE_TYPES.has(memberResolved.type)) {
        continue
      } else if (member?.type && OPAQUE_VALUE_TYPES.has(member.type)) {
        continue
      }
    }
    return
  }

  if (!isRecord(value)) return

  // Opaque leaf types (image, file, slug…)
  if (typeName && OPAQUE_VALUE_TYPES.has(typeName)) return
  if (effective?.type && OPAQUE_VALUE_TYPES.has(effective.type) && !effective.fields)
    return

  // Plugin internationalized arrays stored as arrays — handled above
  if (typeName?.startsWith('internationalizedArray')) return

  const allowed = fieldNamesFromNode(effective)
  if (!allowed) {
    // Unknown schema for this container — skip nested (Category B territory)
    return
  }

  for (const key of Object.keys(value)) {
    if (SYSTEM_KEYS.has(key)) continue
    if (!allowed.has(key)) {
      hits.push({
        docId: ctx.docId,
        docType: ctx.docType,
        path: path || '(root)',
        field: key,
        isDraft: ctx.isDraft,
      })
      continue
    }
    const childDef = getFieldDef(effective!, key)
    walkValue(
      value[key],
      childDef,
      byName,
      path ? `${path}.${key}` : key,
      ctx,
      hits,
      depth + 1,
    )
  }
}

async function main() {
  console.log(
    `\nUnknown-fields audit\n  Project: ${PROJECT_ID}\n  Dataset: ${DATASET}\n`,
  )

  if (DATASET !== 'developer') {
    throw new Error(`Refusing to audit non-developer dataset: ${DATASET}`)
  }

  const byName = buildTypeIndex(schemaTypes as SchemaNode[])
  const namedFields = buildNamedFieldMap(schemaTypes as SchemaNode[])

  const docs = await sanityClient.fetch<
    Array<{_id: string; _type: string} & Record<string, unknown>>
  >(`*[]{...}`)

  console.log(`Fetched ${docs.length} documents (published + drafts)\n`)

  const hits: UnknownHit[] = []
  const unknownTypes = new Map<string, number>()
  const docsByType = new Map<string, number>()

  for (const doc of docs) {
    const type = doc._type
    docsByType.set(type, (docsByType.get(type) || 0) + 1)

    const schema = byName.get(type)
    if (!schema) {
      unknownTypes.set(type, (unknownTypes.get(type) || 0) + 1)
      continue
    }

    const isDraft = doc._id.startsWith('drafts.')
    walkValue(
      doc,
      schema,
      byName,
      '',
      {docId: doc._id, docType: type, isDraft},
      hits,
      0,
    )
  }

  // Aggregate: type + field (+ path pattern) → count + sample ids
  type Agg = {
    docType: string
    field: string
    pathPattern: string
    count: number
    draftCount: number
    publishedCount: number
    sampleIds: string[]
  }

  const aggMap = new Map<string, Agg>()
  for (const h of hits) {
    // Normalize array indexes in path for aggregation
    const pathPattern = h.path.replace(/\[\d+\]/g, '[]')
    const key = `${h.docType}::${pathPattern}::${h.field}`
    let row = aggMap.get(key)
    if (!row) {
      row = {
        docType: h.docType,
        field: h.field,
        pathPattern,
        count: 0,
        draftCount: 0,
        publishedCount: 0,
        sampleIds: [],
      }
      aggMap.set(key, row)
    }
    row.count += 1
    if (h.isDraft) row.draftCount += 1
    else row.publishedCount += 1
    if (row.sampleIds.length < 5 && !row.sampleIds.includes(h.docId)) {
      row.sampleIds.push(h.docId)
    }
  }

  const aggregated = [...aggMap.values()].sort(
    (a, b) => b.count - a.count || a.docType.localeCompare(b.docType),
  )

  console.log('── Document types in dataset ──')
  for (const [t, n] of [...docsByType.entries()].sort((a, b) => a[0].localeCompare(b[0]))) {
    const inSchema = namedFields.has(t) ? 'schema' : 'NO SCHEMA'
    console.log(`  ${t}: ${n} (${inSchema})`)
  }

  if (unknownTypes.size) {
    console.log('\n── Documents with type missing from schema ──')
    for (const [t, n] of unknownTypes) console.log(`  ${t}: ${n}`)
  }

  console.log(`\n── Unknown field hits: ${hits.length} across ${aggregated.length} patterns ──\n`)
  for (const row of aggregated) {
    console.log(
      `  [${row.docType}] ${row.pathPattern}.${row.field} — ${row.count} (pub ${row.publishedCount}, draft ${row.draftCount})`,
    )
    console.log(`    samples: ${row.sampleIds.join(', ')}`)
  }

  const out = {
    auditedAt: new Date().toISOString(),
    projectId: PROJECT_ID,
    dataset: DATASET,
    documentCount: docs.length,
    docsByType: Object.fromEntries(docsByType),
    typesMissingFromSchema: Object.fromEntries(unknownTypes),
    hitCount: hits.length,
    patterns: aggregated,
  }

  const outPath = resolve(process.cwd(), '../docs/_unknown-fields-audit.json')
  writeFileSync(outPath, JSON.stringify(out, null, 2))
  console.log(`\nWrote ${outPath}`)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
