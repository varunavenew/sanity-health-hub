/**
 * Flat object input for homepage specialists settings (no nested object chrome).
 */
import {Stack} from '@sanity/ui'
import {ObjectInputMembers, type ObjectInputProps} from 'sanity'

export function HomepageSpecialistsSectionInput(props: ObjectInputProps) {
  const {members, renderInput, renderField, renderItem, renderPreview} = props

  return (
    <Stack space={5}>
      <ObjectInputMembers
        members={members ?? []}
        renderInput={renderInput}
        renderField={renderField}
        renderItem={renderItem}
        renderPreview={renderPreview}
      />
    </Stack>
  )
}
