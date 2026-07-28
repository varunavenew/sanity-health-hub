/**
 * Provides the active page-editor section to nested field inputs.
 * Used by PageSectionsArrayInput (Phase 1b) to filter pageSections by _type.
 */
import {createContext, useContext} from 'react'
import type {PageSectionDefinition} from './types'

export type ActivePageSectionContextValue = {
  section: PageSectionDefinition | null
}

export const ActivePageSectionContext = createContext<ActivePageSectionContextValue>({
  section: null,
})

export function useActivePageSection(): PageSectionDefinition | null {
  return useContext(ActivePageSectionContext).section
}
