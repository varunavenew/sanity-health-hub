/**
 * Treatment Category document input — Studio UX only.
 *
 * - Categories opened via page-editor section panes: filtered section form
 *   (same framework as Homepage / Fertility prototype).
 * - Opened outside section panes: full classic form.
 * - Auto-slug from title always runs (unchanged behaviour).
 *
 * Composition note: AutoSlug's `renderDefault` callback is typed as InputProps.
 * We close over the outer ObjectInputProps so SectionFilteredInput stays correctly typed
 * (AutoSlug does not rewrite props before calling renderDefault).
 */
import type {ObjectInputProps} from 'sanity'
import {AutoSlugFromTitleInput} from './AutoSlugFromTitleInput'
import {createPageSectionDocumentInput} from '../page-editor/components/PageSectionDocumentInput'
import {treatmentCategoryPageEditorConfig} from '../page-editor/pages/treatmentCategorySections'

const SectionFilteredInput = createPageSectionDocumentInput(treatmentCategoryPageEditorConfig, {
  whenNoSection: 'renderDefault',
})

export function TreatmentCategoryDocumentInput(props: ObjectInputProps) {
  return (
    <AutoSlugFromTitleInput
      {...props}
      renderDefault={() => <SectionFilteredInput {...props} />}
    />
  )
}
