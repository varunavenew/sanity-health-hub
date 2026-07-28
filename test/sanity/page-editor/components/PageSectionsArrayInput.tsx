/**
 * Phase 1b: pageSections array input that filters visible items by `_type`
 * when the active page-editor section declares `pageSectionsItemTypes`.
 *
 * - Other band types stay on the document (dual-read / rollback).
 * - Insert menu is restricted to the allowed types for this section.
 * - Without an active type filter (native form / Advanced), all schema `of` types show.
 */
import {useMemo} from 'react'
import {ArrayOfObjectsInput, type ArrayOfObjectsInputProps} from 'sanity'
import {useActivePageSection} from '../ActivePageSectionContext'

function memberItemType(member: unknown): string | undefined {
  if (!member || typeof member !== 'object') return undefined
  const row = member as {
    kind?: string
    value?: {_type?: string}
    item?: {value?: {_type?: string}}
  }
  if (row.kind === 'item') {
    return row.value?._type || row.item?.value?._type
  }
  // Keep error / other members visible so Studio can surface issues.
  return undefined
}

export function PageSectionsArrayInput(props: ArrayOfObjectsInputProps) {
  const section = useActivePageSection()
  const allowedTypes = section?.pageSectionsItemTypes

  const filteredMembers = useMemo(() => {
    if (!allowedTypes?.length) return props.members
    const allowed = new Set(allowedTypes)
    return props.members.filter((member) => {
      const type = memberItemType(member)
      // Non-item members (errors) always pass through.
      if (!type) return true
      return allowed.has(type)
    })
  }, [props.members, allowedTypes])

  const filteredSchemaType = useMemo(() => {
    if (!allowedTypes?.length) return props.schemaType
    const allowed = new Set(allowedTypes)
    const nextOf = (props.schemaType.of || []).filter((entry) => {
      const name = (entry as {name?: string}).name
      return typeof name === 'string' && allowed.has(name)
    })
    // Safety: never empty `of` (would break insert UI).
    if (nextOf.length === 0) return props.schemaType
    return {
      ...props.schemaType,
      of: nextOf,
    }
  }, [props.schemaType, allowedTypes])

  return (
    <ArrayOfObjectsInput
      {...props}
      members={filteredMembers}
      schemaType={filteredSchemaType}
    />
  )
}
