/**
 * Filter Sanity object-input members to a set of top-level field names.
 *
 * Important Sanity behaviour:
 * - Document `groups` do NOT nest members. They filter which members appear in
 *   the public `members` array based on the selected group tab.
 * - The full set lives on the form node as non-enumerable `_allMembers`.
 * - Fieldsets DO nest members under `fieldSet.members`.
 *
 * Prefer resolving members via `resolveMembersForSectionFiltering()` so section
 * panes can see fields that belong to non-active groups (e.g. Content while
 * Hero is the default selected group).
 */
export type FormMemberLike = {
  kind?: string
  name?: string
  key?: string
  hidden?: boolean
  inSelectedGroup?: boolean
  fieldSet?: {
    name?: string
    members?: FormMemberLike[]
    [key: string]: unknown
  }
  [key: string]: unknown
}

export type FilterMembersOptions = {
  /**
   * When true (default), promote matching fieldset fields to top-level members.
   * Prefer `false` with native ObjectInputMembers so schema fieldsets keep UI.
   */
  flattenFieldSets?: boolean
  /**
   * When true, include members that are only hidden because they are outside
   * the currently selected Sanity field group (`inSelectedGroup === false`).
   * Schema `hidden: true` members are still excluded.
   */
  includeOutsideSelectedGroup?: boolean
}

/** Sanity's built-in group that exposes every field (name is stable). */
export const ALL_FIELDS_GROUP_NAME = 'all-fields'

/**
 * Prefer `_allMembers` (all groups) over public `members` (active group only).
 * `_allMembers` is non-enumerable on Sanity form nodes and omitted from
 * ObjectInputProps typings, but present at runtime on document inputs.
 */
export function resolveMembersForSectionFiltering(input: {
  members?: FormMemberLike[] | unknown
  _allMembers?: FormMemberLike[] | unknown
}): FormMemberLike[] {
  const all = input._allMembers
  if (Array.isArray(all) && all.length > 0) {
    return all as FormMemberLike[]
  }
  const visible = input.members
  if (Array.isArray(visible) && visible.length > 0) {
    return visible as FormMemberLike[]
  }
  return []
}

function isVisibleMember(
  member: FormMemberLike,
  includeOutsideSelectedGroup: boolean,
): boolean {
  if (member.hidden === true) return false
  // Out-of-group members in `_allMembers` are usually not `hidden`; they carry
  // `inSelectedGroup: false`. Include them when filtering for section panes.
  if (!includeOutsideSelectedGroup && member.inSelectedGroup === false) {
    return false
  }
  return true
}

function getFieldsetChildren(member: FormMemberLike): FormMemberLike[] | undefined {
  if (member.kind === 'fieldSet' && member.fieldSet?.members?.length) {
    return member.fieldSet.members
  }
  if (member.fieldSet?.members?.length) {
    return member.fieldSet.members
  }
  return undefined
}

function filterMembersRecursive(
  members: FormMemberLike[],
  wanted: Set<string>,
  flattenFieldSets: boolean,
  includeOutsideSelectedGroup: boolean,
): FormMemberLike[] {
  const result: FormMemberLike[] = []

  for (const member of members) {
    if (!isVisibleMember(member, includeOutsideSelectedGroup)) continue

    if (member.kind === 'field' && typeof member.name === 'string' && wanted.has(member.name)) {
      // Ensure ObjectInputMembers will render fields pulled from `_allMembers`
      // even when a different Sanity group tab is selected.
      result.push(
        includeOutsideSelectedGroup && member.inSelectedGroup === false
          ? {...member, inSelectedGroup: true}
          : member,
      )
      continue
    }

    const children = getFieldsetChildren(member)
    if (!children) continue

    const nested = filterMembersRecursive(
      children,
      wanted,
      flattenFieldSets,
      includeOutsideSelectedGroup,
    )
    if (nested.length === 0) continue

    if (flattenFieldSets) {
      for (const nestedMember of nested) {
        result.push(nestedMember)
      }
      continue
    }

    result.push({
      ...member,
      // Fieldsets from `_allMembers` may also be marked out-of-group.
      inSelectedGroup:
        includeOutsideSelectedGroup && member.inSelectedGroup === false
          ? true
          : member.inSelectedGroup,
      fieldSet: {
        ...member.fieldSet,
        members: nested,
      },
    })
  }

  return result
}

export function filterMembersByFieldNames(
  members: FormMemberLike[] | undefined,
  fieldNames: string[],
  options: FilterMembersOptions = {},
): FormMemberLike[] {
  if (!members?.length || fieldNames.length === 0) return []

  const flattenFieldSets = options.flattenFieldSets !== false
  const includeOutsideSelectedGroup = options.includeOutsideSelectedGroup === true
  const wanted = new Set(fieldNames)
  return filterMembersRecursive(
    members,
    wanted,
    flattenFieldSets,
    includeOutsideSelectedGroup,
  )
}

/** Collect field names present in a member tree (debug / verification). */
export function listMemberFieldNames(members: FormMemberLike[] | undefined): string[] {
  if (!members?.length) return []
  const names: string[] = []

  for (const member of members) {
    if (member.kind === 'field' && typeof member.name === 'string') {
      names.push(member.name)
    }
    const children = getFieldsetChildren(member)
    if (children) {
      names.push(...listMemberFieldNames(children))
    }
  }

  return names
}

/**
 * True when every wanted field name exists somewhere in the member tree.
 * Used by verification scripts and defensive UI (missing → group mismatch).
 */
export function memberTreeHasFieldNames(
  members: FormMemberLike[] | undefined,
  fieldNames: string[],
): boolean {
  if (fieldNames.length === 0) return true
  const available = new Set(listMemberFieldNames(members))
  return fieldNames.every((name) => available.has(name))
}

