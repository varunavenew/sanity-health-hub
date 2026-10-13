/**
 * Treatment category Hero Media → Image: visible format note above the upload control.
 */
import {Card, Stack, Text} from '@sanity/ui'
import type {ObjectInputProps} from 'sanity'
import {useFormValue} from 'sanity'
import {
  readTreatmentCategoryHeroLayout,
  treatmentCategoryHeroImageFieldNote,
} from '../../schemaTypes/mediaGuidelines'

export function CategoryHeroImageInput(props: ObjectInputProps) {
  const document = useFormValue([]) as
    | {landingPage?: {hero?: {layout?: string}}}
    | undefined

  const layoutLabel =
    readTreatmentCategoryHeroLayout(document) === 'full'
      ? 'Full width banner'
      : 'Split (text left, image right)'

  const note = treatmentCategoryHeroImageFieldNote(document)

  return (
    <Stack space={3}>
      <Card padding={3} radius={2} shadow={1} tone="caution">
        <Text size={1} weight="semibold">
          Image format — {layoutLabel}
        </Text>
        <Text size={1} muted style={{marginTop: 8}}>
          {note}
        </Text>
      </Card>
      {props.renderDefault(props)}
    </Stack>
  )
}
