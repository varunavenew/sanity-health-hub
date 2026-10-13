/**
 * Narrows which fields render inside a landingPage band object (e.g. hero.layout only)
 * when the same `landingPage` member appears in multiple section panes (before/after media).
 */
import {createContext, useContext} from 'react'

export type LandingPageBandFieldFilter = {
  include?: string[]
  exclude?: string[]
}

export const LandingPageBandFieldFilterContext = createContext<LandingPageBandFieldFilter | null>(
  null,
)

export function useLandingPageBandFieldFilter(): LandingPageBandFieldFilter | null {
  return useContext(LandingPageBandFieldFilterContext)
}

function memberFieldName(member: {kind?: string; name?: string}): string | undefined {
  return member.kind === 'field' && typeof member.name === 'string' ? member.name : undefined
}

export function filterBandObjectMembers<T extends {kind?: string; name?: string}>(
  members: T[],
  filter: LandingPageBandFieldFilter | null,
): T[] {
  if (!filter) return members
  const {include, exclude} = filter
  if (!include?.length && !exclude?.length) return members

  return members.filter((member) => {
    const name = memberFieldName(member)
    if (!name) return true
    if (include?.length && !include.includes(name)) return false
    if (exclude?.length && exclude.includes(name)) return false
    return true
  })
}
