/**
 * Hides the redundant document-level "Specialists Section" label.
 * Section header in the page editor is sufficient.
 */
import type {FieldProps} from 'sanity'

export function HomepageSpecialistsSectionField(props: FieldProps) {
  return props.renderDefault({
    ...props,
    title: undefined,
    description: undefined,
  })
}
