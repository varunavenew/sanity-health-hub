/**
 * Reusable Page Editor Framework — shared types.
 * Page-specific section lists live in `pages/*` configs, not in shared UI.
 */
import type {ComponentType} from 'react'

/** How a section maps onto existing document fields (no schema rewrite). */
export type PageSectionDefinition = {
  /** Stable id used for selection state (not stored in the document). */
  id: string
  /** Editor-facing section title. */
  title: string
  /** Short helper shown in the inspector. */
  description?: string
  /** Optional @sanity/icons component. */
  icon?: ComponentType<{width?: number; height?: number}>
  /**
   * Top-level document field names to show when this section is selected.
   * Must match existing schema field names exactly.
   */
  fields: string[]
  /**
   * Optional fields rendered before SectionAddon (e.g. Guide show/hide toggle above
   * the ownership notice, with the reference list in `fields` matching Homepage).
   */
  fieldsBeforeAddon?: string[]
  /**
   * Phase 1b: when this section includes `pageSections`, only show / insert
   * array items whose `_type` is in this list (e.g. `['pageSectionBookingCta']`).
   * Other band types remain stored on the document for dual-read / rollback.
   */
  pageSectionsItemTypes?: string[]
  /**
   * When this section includes `landingPage`, only show these nested field names
   * (e.g. `['segmentsSection']`). Other landing bands stay on the document.
   * Used by CategoryLandingPageInput — Studio UX only, JSON paths unchanged.
   */
  landingPageFields?: string[]
  /**
   * Optional preview line for the section card (derived from current document).
   * Keep page-specific logic in the page config, not in shared components.
   */
  getPreview?: (document: Record<string, unknown> | undefined) => string | undefined
  /**
   * Optional secondary meta line under the preview (e.g. “Manual selection”).
   */
  getMeta?: (document: Record<string, unknown> | undefined) => string | undefined
  /**
   * Optional status chips for the section card (short labels only).
   * When omitted, preview + meta are used as chips.
   */
  getChips?: (document: Record<string, unknown> | undefined) => string[] | undefined
  /**
   * Optional notice rendered above the fields (e.g. “not editable on this page”).
   * Page configs supply the copy; shared UI only renders it.
   */
  notice?: string
  /** Reference field name used by OpenCollectionButton (e.g. faqCollection). */
  collectionRefField?: string
  /** Expected document type for that collection reference. */
  collectionType?: string
  /** Reference array field for OpenEntityButton (first selected entity). */
  entityRefField?: string
  /** Expected document type for entity refs. */
  entityType?: string
  /**
   * Read-only information panel when this section has no homepage-owned fields
   * (e.g. Homepage Specialists sourced from Medical Content).
   * When set, replaces the normal fields pane (exclusive).
   */
  infoPanel?: PageSectionInfoPanel
  /**
   * Optional addon rendered above filtered schema fields.
   * Use for assembler hubs (e.g. Guide Categories) that explain Medical Content
   * ownership and link out to entity documents — without replacing fields.
   */
  SectionAddon?: ComponentType<{document: Record<string, unknown> | undefined}>
}

/** Editor-facing panel for sections backed by Medical Content (or similar). */
export type PageSectionInfoPanel = {
  variant: 'medical-content-source'
  /** Structure group label, e.g. "Medical Content". */
  sourceLabel: string
  /** Entity label shown to editors, e.g. "Specialists". */
  entityLabel: string
  /** Sanity document type opened by the primary action button. */
  documentType: string
  /** Current display behaviour — read-only until Manual is implemented. */
  displayMode: 'automatic'
}

export type PageEditorConfig = {
  /** Page label shown above the section list (e.g. “Home”). */
  title: string
  /** Optional subtitle under the page label. */
  subtitle?: string
  /** Ordered section definitions for this page type. */
  sections: PageSectionDefinition[]
  /** Section id selected when the editor opens. */
  defaultSectionId?: string
}
