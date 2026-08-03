/**
 * Field chrome for treatmentCategory.landingPage.
 *
 * In Structure section panes the Inspector already titles the section (Hero,
 * Why choose us, …). Skip the "Website sections" label; keep the default
 * field/input pipeline so nested band fields stay editable.
 *
 * Outside section panes, keep the classic full-object field UI.
 */
import {useEffect} from 'react'
import type {FieldProps, ObjectFieldProps} from 'sanity'
import {useActivePageSection} from '../ActivePageSectionContext'

function isObjectFieldProps(props: FieldProps): props is ObjectFieldProps {
  return typeof (props as ObjectFieldProps).onExpand === 'function'
}

export function CategoryLandingPageField(props: FieldProps) {
  const section = useActivePageSection()
  const scoped = Boolean(section?.landingPageFields?.length)
  const collapsed = isObjectFieldProps(props) ? props.collapsed : undefined
  const onExpand = isObjectFieldProps(props) ? props.onExpand : undefined

  useEffect(() => {
    if (!scoped || !onExpand) return
    if (collapsed) onExpand()
  }, [scoped, collapsed, onExpand])

  if (!scoped) {
    return props.renderDefault(props)
  }

  // Keep Sanity’s default field→input pipeline (editable). Only clear chrome.
  return props.renderDefault({
    ...props,
    title: undefined,
    description: undefined,
  })
}
