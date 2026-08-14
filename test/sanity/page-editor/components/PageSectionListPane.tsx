/**
 * Structure section list pane — card navigation for a page editor config.
 * Reads live document edit state for chip metadata; ChildLink opens section forms.
 */
import {useMemo} from 'react'
import {Box, Card, Text} from '@sanity/ui'
import {useEditState} from 'sanity'
import {usePaneRouter, type UserComponent} from 'sanity/structure'
import type {PageEditorConfig, PageSectionDefinition} from '../types'
import {SectionCard, SectionList} from './SectionList'

export type PageSectionListPaneOptions = {
  documentId: string
  schemaType: string
  config: PageEditorConfig
}

function isPageSectionListOptions(value: unknown): value is PageSectionListPaneOptions {
  if (!value || typeof value !== 'object') return false
  const record = value as Record<string, unknown>
  return (
    typeof record.documentId === 'string' &&
    typeof record.schemaType === 'string' &&
    Boolean(record.config && typeof record.config === 'object')
  )
}

/** Build card metadata chips from the working document (draft preferred). */
function resolveChips(
  section: PageSectionDefinition,
  document: Record<string, unknown> | undefined,
  ready: boolean,
): string[] {
  // No document yet — omit subtitle rather than showing "Unknown".
  if (!ready) return []

  const fromChips = section.getChips?.(document)
  if (fromChips && fromChips.length > 0) {
    return fromChips.filter((chip) => Boolean(chip && chip.trim() && chip !== 'Unknown'))
  }

  const chips: string[] = []
  const preview = section.getPreview?.(document)
  const meta = section.getMeta?.(document)
  if (preview?.trim()) chips.push(preview.trim())
  if (meta?.trim()) chips.push(meta.trim())
  return chips
}

/**
 * Structure list pane: one card per page section.
 * Click opens a child document pane for the same documentId.
 */
export const PageSectionListPane: UserComponent = (props) => {
  const options = isPageSectionListOptions(props.options) ? props.options : undefined
  const config = options?.config
  const documentId = options?.documentId
  const schemaType = options?.schemaType || 'homepage'
  const {ChildLink} = usePaneRouter()

  const publishedId = (documentId || '').replace(/^drafts\./, '')
  const editState = useEditState(publishedId || 'homepage', schemaType)
  const document = (editState.draft ||
    editState.version ||
    editState.published ||
    undefined) as Record<string, unknown> | undefined
  const ready = Boolean(publishedId) && editState.ready

  const sections = config?.sections || []

  const cards = useMemo(() => {
    return sections.map((section) => ({
      section,
      chips: resolveChips(section, document, ready),
    }))
  }, [document, ready, sections])

  const sectionCount = cards.length

  if (!config || !documentId) {
    return (
      <Card padding={4} tone="caution" border>
        <Text size={1}>Page section list is missing configuration.</Text>
      </Card>
    )
  }

  return (
    <Box padding={3} sizing="border" style={{height: '100%', overflow: 'auto'}}>
      <style>{`
        .cm-page-section-link a,
        .cm-page-section-link a:hover,
        .cm-page-section-link a:focus,
        .cm-page-section-link a:visited {
          text-decoration: none !important;
          color: inherit !important;
          display: block;
        }
        .cm-page-section-link a * {
          text-decoration: none !important;
        }
      `}</style>
      <SectionList
        pageTitle={config.title}
        pageMeta={`${sectionCount} ${sectionCount === 1 ? 'section' : 'sections'}`}
        pageSubtitle={config.subtitle}
      >
        {cards.map(({section, chips}) => (
          <Box key={section.id} className="cm-page-section-link">
            <ChildLink childId={section.id}>
              <SectionCard
                title={section.title}
                chips={chips}
                icon={section.icon}
                interactive={false}
              />
            </ChildLink>
          </Box>
        ))}
      </SectionList>
    </Box>
  )
}

