/**
 * Open a referenced collection/entity document from a page section form.
 * Supports form state or a document snapshot (Structure panes).
 */
import {Box, Button, Card, Stack, Text} from '@sanity/ui'
import {LaunchIcon} from '@sanity/icons'
import {useIntentLink} from 'sanity/router'
import {useFormValue} from 'sanity'

type RefValue = {_ref?: string; _type?: string} | undefined

function readRefId(value: unknown): string | undefined {
  if (!value || typeof value !== 'object') return undefined
  const ref = (value as RefValue)?._ref
  return typeof ref === 'string' && ref.length > 0 ? ref : undefined
}

type OpenCollectionButtonProps = {
  fieldName: string
  documentType: string
  label?: string
  /** When set, read the ref from this snapshot (Structure panes / outside FormBuilder). */
  documentValue?: Record<string, unknown>
}

export function OpenCollectionButton(props: OpenCollectionButtonProps) {
  if (props.documentValue) {
    return <OpenCollectionFromDocument {...props} documentValue={props.documentValue} />
  }
  return <OpenCollectionFromForm {...props} />
}

function OpenCollectionFromDocument(
  props: OpenCollectionButtonProps & {documentValue: Record<string, unknown>},
) {
  const {fieldName, documentType, label = 'Open collection', documentValue} = props
  return <OpenRefButton label={label} documentType={documentType} value={documentValue[fieldName]} />
}

function OpenCollectionFromForm(props: OpenCollectionButtonProps) {
  const {fieldName, documentType, label = 'Open collection'} = props
  const formValue = useFormValue([fieldName])
  return <OpenRefButton label={label} documentType={documentType} value={formValue} />
}

type OpenEntityButtonProps = {
  fieldName: string
  documentType: string
  label?: string
  documentValue?: Record<string, unknown>
}

export function OpenEntityButton(props: OpenEntityButtonProps) {
  if (props.documentValue) {
    return <OpenEntityFromDocument {...props} documentValue={props.documentValue} />
  }
  return <OpenEntityFromForm {...props} />
}

function OpenEntityFromDocument(
  props: OpenEntityButtonProps & {documentValue: Record<string, unknown>},
) {
  const {fieldName, documentType, label = 'Open entity', documentValue} = props
  const value = documentValue[fieldName]
  const id = Array.isArray(value) ? readRefId(value[0]) : readRefId(value)
  return <OpenRefButton label={label} documentType={documentType} value={id ? {_ref: id} : undefined} hideEmpty />
}

function OpenEntityFromForm(props: OpenEntityButtonProps) {
  const {fieldName, documentType, label = 'Open entity'} = props
  const formValue = useFormValue([fieldName])
  const id = Array.isArray(formValue) ? readRefId(formValue[0]) : readRefId(formValue)
  return <OpenRefButton label={label} documentType={documentType} value={id ? {_ref: id} : undefined} hideEmpty />
}

function OpenRefButton(props: {
  label: string
  documentType: string
  value: unknown
  hideEmpty?: boolean
}) {
  const {label, documentType, value, hideEmpty} = props
  const id = readRefId(value)
  return (
    <OpenDocumentById
      label={label}
      documentType={documentType}
      documentId={id}
      hideEmpty={hideEmpty}
      emptyHint={`Select a ${documentType} reference first, then open it here.`}
    />
  )
}

/** Open a Sanity document by id + type (same intent pattern as Open Collection). */
export function OpenDocumentById(props: {
  label: string
  documentType: string
  documentId?: string
  hideEmpty?: boolean
  emptyHint?: string
  mode?: 'ghost' | 'default'
}) {
  const {
    label,
    documentType,
    documentId,
    hideEmpty,
    emptyHint,
    mode = 'ghost',
  } = props
  const id = typeof documentId === 'string' && documentId.length > 0 ? documentId : undefined

  // useIntentLink requires params to be an object (undefined crashes encodeParams).
  const {onClick, href} = useIntentLink({
    intent: 'edit',
    params: id ? {id, type: documentType} : {type: documentType},
  })

  if (!id) {
    if (hideEmpty) return null
    return (
      <Card padding={3} radius={2} tone="transparent" border>
        <Text size={1} muted>
          {emptyHint || `Select a ${documentType} first, then open it here.`}
        </Text>
      </Card>
    )
  }

  return (
    <Box>
      <Button
        as="a"
        href={href}
        onClick={onClick}
        text={label}
        icon={LaunchIcon}
        mode={mode}
        tone="primary"
        fontSize={1}
        padding={3}
      />
    </Box>
  )
}

type SectionNoticeProps = {
  children: string
}

export function SectionNotice({children}: SectionNoticeProps) {
  return (
    <Card padding={3} radius={2} tone="caution" border>
      <Stack space={2}>
        <Text size={1}>{children}</Text>
      </Stack>
    </Card>
  )
}
