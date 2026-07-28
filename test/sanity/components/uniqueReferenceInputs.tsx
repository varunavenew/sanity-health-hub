/**
 * Studio UX: exclude already-selected documents from reference pickers
 * inside arrays.
 *
 * Wired globally via `form.components.input` — no schema / data-model changes.
 */
import {useMemo} from 'react'
import {useFormValue, type InputProps, type Path} from 'sanity'
import {isReferenceSchemaType, type ReferenceSchemaType} from '@sanity/types'

const EXCLUDE_PARAM = '__excludeAlreadySelected'

type RefRow = {_ref?: string}

function publishedId(id: string): string {
  return id.startsWith('drafts.') ? id.slice('drafts.'.length) : id
}

/** Both published and draft id forms so the picker cannot re-select either. */
function expandRefIdVariants(ids: Iterable<string>): string[] {
  const out = new Set<string>()
  for (const raw of ids) {
    if (!raw) continue
    const pub = publishedId(raw)
    out.add(pub)
    out.add(`drafts.${pub}`)
  }
  return [...out]
}

function collectRefIds(rows: unknown, exceptRef?: string): string[] {
  if (!Array.isArray(rows)) return []
  const except = exceptRef ? publishedId(exceptRef) : null
  const ids: string[] = []
  for (const row of rows) {
    if (!row || typeof row !== 'object') continue
    const ref = (row as RefRow)._ref
    if (typeof ref !== 'string' || !ref) continue
    if (except && publishedId(ref) === except) continue
    ids.push(ref)
  }
  return ids
}

function getExistingFilter(schemaType: ReferenceSchemaType): {
  resolver?: (ctx: unknown) => unknown
  staticFilter?: string
  staticParams?: Record<string, unknown>
} {
  const options = schemaType.options as
    | {
        filter?: string | ((ctx: unknown) => unknown)
        filterParams?: Record<string, unknown>
      }
    | undefined
  if (!options?.filter) return {}
  if (typeof options.filter === 'function') {
    return {resolver: options.filter}
  }
  if (typeof options.filter === 'string') {
    return {staticFilter: options.filter, staticParams: options.filterParams}
  }
  return {}
}

function UniqueReferenceInput(props: InputProps) {
  const schemaType = props.schemaType as ReferenceSchemaType
  const parentPath: Path = props.path.length > 0 ? props.path.slice(0, -1) : []
  const siblings = useFormValue(parentPath)
  const currentRef =
    props.value && typeof props.value === 'object' && '_ref' in (props.value as object)
      ? String((props.value as RefRow)._ref || '')
      : ''

  const excludeIds = useMemo(() => {
    if (!Array.isArray(siblings)) return []
    return expandRefIdVariants(collectRefIds(siblings, currentRef || undefined))
  }, [siblings, currentRef])

  const nextSchemaType = useMemo(() => {
    const existing = getExistingFilter(schemaType)
    return {
      ...schemaType,
      options: {
        ...(schemaType.options || {}),
        filter: async (ctx: unknown) => {
          let base: {filter?: string; params?: Record<string, unknown>; tag?: string} = {}

          if (existing.resolver) {
            const resolved = await existing.resolver(ctx)
            if (resolved && typeof resolved === 'object') {
              const row = resolved as {
                filter?: string
                params?: Record<string, unknown>
                tag?: string
              }
              base = {
                filter: typeof row.filter === 'string' ? row.filter : undefined,
                params: row.params,
                tag: row.tag,
              }
            }
          } else if (existing.staticFilter) {
            base = {filter: existing.staticFilter, params: existing.staticParams}
          }

          if (excludeIds.length === 0) return base

          const excludeGroq = `!(_id in $${EXCLUDE_PARAM})`
          const mergedFilter = base.filter?.trim()
            ? `(${base.filter}) && ${excludeGroq}`
            : excludeGroq

          return {
            filter: mergedFilter,
            params: {...(base.params || {}), [EXCLUDE_PARAM]: excludeIds},
            tag: base.tag,
          }
        },
      },
    }
  }, [schemaType, excludeIds])

  return props.renderDefault({
    ...props,
    schemaType: nextSchemaType,
  } as InputProps)
}

/**
 * Always call useFormValue so hooks stay unconditional, then decide which UI to render.
 */
function ReferenceInArrayGate(props: InputProps) {
  const parentPath: Path = props.path.length > 0 ? props.path.slice(0, -1) : []
  const parentValue = useFormValue(parentPath)
  const inReferenceArray = Array.isArray(parentValue)

  if (!inReferenceArray) {
    return props.renderDefault(props)
  }

  return <UniqueReferenceInput {...props} />
}

/**
 * Global form input middleware for Sanity Studio.
 * Attach via `form.components.input` in sanity.config.ts.
 */
export function uniqueReferenceFormInput(props: InputProps) {
  if (isReferenceSchemaType(props.schemaType) && props.path.length >= 2) {
    return <ReferenceInArrayGate {...props} />
  }

  return props.renderDefault(props)
}
