/**
 * Treatment document input — Studio UX only.
 *
 * - Opened via page-editor section panes: filtered section form.
 * - Opened outside section panes: full classic form.
 * - Auto-slug from title always runs (unchanged behaviour).
 * - HealInternationalizedArrays auto-repairs duplicate NO/EN rows after Duplicate
 *   so Publish is not stuck disabled on Symptoms / Expert areas cards.
 */
import type {ObjectInputProps} from 'sanity'
import {AutoSlugFromTitleInput} from './AutoSlugFromTitleInput'
import {HealInternationalizedArrays} from './HealInternationalizedArrays'
import {createPageSectionDocumentInput} from '../page-editor/components/PageSectionDocumentInput'
import {treatmentPageEditorConfig} from '../page-editor/pages/treatmentSections'

const SectionFilteredInput = createPageSectionDocumentInput(treatmentPageEditorConfig, {
  whenNoSection: 'renderDefault',
})

export function TreatmentDocumentInput(props: ObjectInputProps) {
  return (
    <HealInternationalizedArrays
      {...props}
      renderDefault={() => (
        <AutoSlugFromTitleInput
          {...props}
          renderDefault={() => <SectionFilteredInput {...props} />}
        />
      )}
    />
  )
}
