/**
 * Treatment document input — Studio UX only.
 *
 * - Opened via page-editor section panes: filtered section form.
 * - Opened outside section panes: full classic form.
 * - Auto-slug from title always runs (unchanged behaviour).
 */
import type {ObjectInputProps} from 'sanity'
import {AutoSlugFromTitleInput} from './AutoSlugFromTitleInput'
import {createPageSectionDocumentInput} from '../page-editor/components/PageSectionDocumentInput'
import {treatmentPageEditorConfig} from '../page-editor/pages/treatmentSections'

const SectionFilteredInput = createPageSectionDocumentInput(treatmentPageEditorConfig, {
  whenNoSection: 'renderDefault',
})

export function TreatmentDocumentInput(props: ObjectInputProps) {
  return (
    <AutoSlugFromTitleInput
      {...props}
      renderDefault={() => <SectionFilteredInput {...props} />}
    />
  )
}
