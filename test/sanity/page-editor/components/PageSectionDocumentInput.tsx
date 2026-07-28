/**
 * Document `components.input` for Structure section panes.
 * Resolves the active section from routing, filters members, renders ObjectInputMembers.
 *
 * Root cause note (field mapping):
 * Sanity document `groups` filter the public `members` array to the selected
 * group tab (default: Hero). Section cards often map fields from other groups
 * (Content, SEO). Always filter from `_allMembers` when present so every
 * singleton section can render its mapped fields.
 */
import {useEffect, useMemo, type ReactNode} from 'react'
import {Box, Card, Stack, Text} from '@sanity/ui'
import {ObjectInputMembers, type ObjectInputProps, useFormValue} from 'sanity'
import {useDocumentPane, usePaneRouter} from 'sanity/structure'
import type {PageEditorConfig, PageSectionDefinition} from '../types'
import {
  ALL_FIELDS_GROUP_NAME,
  filterMembersByFieldNames,
  resolveMembersForSectionFiltering,
  type FormMemberLike,
} from '../filterMembers'
import {getSectionById} from '../SectionRegistry'
import {ActivePageSectionContext} from '../ActivePageSectionContext'
import {Inspector, InspectorHeader, InspectorContent} from './Inspector'
import {OpenCollectionButton, OpenEntityButton, SectionNotice} from './OpenCollectionButton'
import {PageSectionInfoPanel} from './PageSectionInfoPanel'
import {PageSectionReferenceInputBoundary} from './PageSectionReferenceInputBoundary'

/**
 * Resolve the active section id from Structure routing + pane key.
 * Prefer ChildLink pane ids; fall back to known section ids embedded in paneKey.
 */
export function resolveSectionId(args: {
  paneKey?: string
  documentId: string
  config: PageEditorConfig
  routerPaneIds: string[]
}): string | undefined {
  const {paneKey = '', documentId, config, routerPaneIds} = args
  const knownIds = config.sections.map((section) => section.id)

  for (let i = routerPaneIds.length - 1; i >= 0; i -= 1) {
    const id = routerPaneIds[i]
    if (knownIds.includes(id)) return id
  }

  const segments = paneKey.split(/[^a-zA-Z0-9_-]+/).filter(Boolean)
  for (let i = segments.length - 1; i >= 0; i -= 1) {
    if (knownIds.includes(segments[i])) return segments[i]
  }

  const marker = `${documentId}-section-`
  const idx = paneKey.indexOf(marker)
  if (idx >= 0) {
    const rest = paneKey.slice(idx + marker.length)
    const exact = knownIds.find(
      (id) => rest === id || rest.startsWith(`${id}-`) || rest.startsWith(`${id}.`),
    )
    if (exact) return exact
  }

  return undefined
}

function sectionActions(
  section: PageSectionDefinition,
  documentValue: Record<string, unknown> | undefined,
): ReactNode {
  const actions: ReactNode[] = []

  if (section.collectionRefField && section.collectionType) {
    actions.push(
      <OpenCollectionButton
        key="collection"
        fieldName={section.collectionRefField}
        documentType={section.collectionType}
        documentValue={documentValue}
        label="Open collection"
      />,
    )
  }

  if (section.entityRefField && section.entityType) {
    actions.push(
      <OpenEntityButton
        key="entity"
        fieldName={section.entityRefField}
        documentType={section.entityType}
        documentValue={documentValue}
        label="Open first entity"
      />,
    )
  }

  if (actions.length === 0) return null
  return <Stack space={2}>{actions}</Stack>
}

type ObjectInputPropsWithAllMembers = ObjectInputProps & {
  /** Non-enumerable on Sanity form nodes; present at runtime for documents. */
  _allMembers?: FormMemberLike[]
}

/**
 * Factory: document `components.input` for Structure section panes.
 * Filters schema members to the active section and renders them with native
 * ObjectInputMembers (same FormProvider as Studio’s default form view).
 */
export function createPageSectionDocumentInput(config: PageEditorConfig) {
  function PageSectionDocumentInput(props: ObjectInputProps) {
    const {members, ...rest} = props
    const propsWithAll = props as ObjectInputPropsWithAllMembers
    const {paneKey, documentId} = useDocumentPane()
    const {routerPanesState} = usePaneRouter()
    const formDocument = useFormValue([]) as Record<string, unknown> | undefined

    const routerPaneIds = useMemo(() => {
      const ids: string[] = []
      for (const group of routerPanesState || []) {
        for (const pane of group || []) {
          if (pane?.id) ids.push(pane.id)
        }
      }
      return ids
    }, [routerPanesState])

    const sectionId =
      resolveSectionId({paneKey, documentId, config, routerPaneIds}) ||
      config.defaultSectionId ||
      config.sections[0]?.id ||
      ''

    const section = getSectionById(config, sectionId)

    // Prefer selecting "All fields" so public `members` also includes every group.
    // Filtering still uses `_allMembers` so the first paint works even before
    // the group tab state updates.
    useEffect(() => {
      const hasAllFieldsGroup = (props.groups || []).some(
        (group) => group?.name === ALL_FIELDS_GROUP_NAME,
      )
      const selected = (props.groups || []).find((group) => group?.selected)
      if (!hasAllFieldsGroup) return
      if (selected?.name === ALL_FIELDS_GROUP_NAME) return
      props.onFieldGroupSelect?.(ALL_FIELDS_GROUP_NAME)
    }, [props.groups, props.onFieldGroupSelect, sectionId])

    const sourceMembers = useMemo(
      () =>
        resolveMembersForSectionFiltering({
          members,
          _allMembers: propsWithAll._allMembers,
        }),
      [members, propsWithAll._allMembers],
    )

    const filteredMembers = useMemo(() => {
      if (!section) return []
      return filterMembersByFieldNames(sourceMembers, section.fields, {
        flattenFieldSets: false,
        includeOutsideSelectedGroup: true,
      })
    }, [sourceMembers, section])

    const filteredMembersBeforeAddon = useMemo(() => {
      if (!section?.fieldsBeforeAddon?.length) return []
      return filterMembersByFieldNames(sourceMembers, section.fieldsBeforeAddon, {
        flattenFieldSets: false,
        includeOutsideSelectedGroup: true,
      })
    }, [sourceMembers, section])

    if (!section) {
      return (
        <Card padding={4} tone="caution" border>
          <Text size={1}>Unknown page section ({sectionId || 'none'}).</Text>
        </Card>
      )
    }

    const documentValue = formDocument
    const preview = section.infoPanel ? undefined : section.getPreview?.(documentValue)
    const SectionAddon = section.SectionAddon

    return (
      <ActivePageSectionContext.Provider value={{section}}>
        <Box padding={3} sizing="border">
          <Inspector
            header={
              <InspectorHeader
                title={section.title}
                description={section.infoPanel ? undefined : section.description}
                preview={preview}
                icon={section.icon}
                actions={section.infoPanel ? null : sectionActions(section, documentValue)}
              />
            }
          >
            <InspectorContent>
              {section.infoPanel ? (
                <PageSectionInfoPanel panel={section.infoPanel} />
              ) : (
                <PageSectionReferenceInputBoundary>
                  <Stack space={4}>
                    {section.notice ? <SectionNotice>{section.notice}</SectionNotice> : null}
                    {filteredMembersBeforeAddon.length > 0 ? (
                      <ObjectInputMembers
                        {...rest}
                        members={
                          filteredMembersBeforeAddon as unknown as ObjectInputProps['members']
                        }
                      />
                    ) : null}
                    {SectionAddon ? <SectionAddon document={documentValue} /> : null}
                    {filteredMembers.length > 0 ? (
                      <ObjectInputMembers
                        {...rest}
                        members={filteredMembers as unknown as ObjectInputProps['members']}
                      />
                    ) : section.fields.length === 0 && !SectionAddon ? (
                      <Stack space={2}>
                        <Text size={1} muted>
                          This section has no editable fields on this page.
                        </Text>
                      </Stack>
                    ) : filteredMembers.length === 0 && section.fields.length > 0 ? (
                      <Stack space={2}>
                        <Text size={1} muted>
                          No schema fields are mapped to this section.
                        </Text>
                        <Text size={1} muted>
                          Expected fields: {section.fields.join(', ')}
                        </Text>
                      </Stack>
                    ) : null}
                  </Stack>
                </PageSectionReferenceInputBoundary>
              )}
            </InspectorContent>
          </Inspector>
        </Box>
      </ActivePageSectionContext.Provider>
    )
  }

  PageSectionDocumentInput.displayName = `PageSectionDocumentInput(${config.title})`
  return PageSectionDocumentInput
}

