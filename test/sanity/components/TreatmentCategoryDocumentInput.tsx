/**
 * Treatment Category document input — Studio UX only.
 *
 * - Categories opened via page-editor section panes: filtered section form
 *   (same framework as Homepage / Fertility prototype).
 * - Opened outside section panes: full classic form.
 * - Auto-slug from title always runs (unchanged behaviour).
 * - HealInternationalizedArrays auto-repairs duplicate NO/EN rows after Duplicate
 *   so Publish is not stuck disabled on Steps / audience cards.
 *
 * Composition note: nested `renderDefault` callbacks are typed as broad InputProps.
 * Close over the outer ObjectInputProps (same pattern as TreatmentDocumentInput).
 */
import type {ObjectInputProps} from 'sanity'
import {AutoSlugFromTitleInput} from './AutoSlugFromTitleInput'
import {HealInternationalizedArrays} from './HealInternationalizedArrays'
import {createPageSectionDocumentInput} from '../page-editor/components/PageSectionDocumentInput'
import {treatmentCategoryPageEditorConfig} from '../page-editor/pages/treatmentCategorySections'

const SectionFilteredInput = createPageSectionDocumentInput(treatmentCategoryPageEditorConfig, {
  whenNoSection: 'renderDefault',
})

export function TreatmentCategoryDocumentInput(props: ObjectInputProps) {
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
