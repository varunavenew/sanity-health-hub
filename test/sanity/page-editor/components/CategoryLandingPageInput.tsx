/**
 * Studio-only input for treatmentCategory.landingPage.
 *
 * Sanity Studio ^5.31.1 Form API:
 * - Schema `components.input` receives full ObjectInputProps (has `renderDefault`).
 * - Custom `renderField` / `renderInput` callbacks receive
 *   `Omit<FieldProps|InputProps, 'renderDefault'>` — MUST delegate via
 *   `props.renderField` / `props.renderInput`, never `*.renderDefault`.
 *
 * Virtual form (editable):
 * - Filter to active section `landingPageFields` (e.g. `hero`, `whySection`)
 * - Keep band FieldMembers in their object context (patches / focus / presence)
 * - Flatten fieldsets inside the band via `props.renderInput({...members})`
 */
import {useCallback, useEffect, useMemo} from 'react'
import {
  ObjectInputMembers,
  type FieldProps,
  type InputProps,
  type ObjectInputProps,
} from 'sanity'
import {useActivePageSection} from '../ActivePageSectionContext'
import {
  filterMembersByFieldNames,
  resolveMembersForSectionFiltering,
  type FormMemberLike,
} from '../filterMembers'

type ObjectInputPropsWithAllMembers = ObjectInputProps & {
  _allMembers?: FormMemberLike[]
}

/** Flatten fieldset wrappers only — keep original FieldMember references. */
function flattenFieldSetMembers(members: FormMemberLike[]): FormMemberLike[] {
  const result: FormMemberLike[] = []
  for (const member of members) {
    if (member.hidden === true) continue

    const fieldSetChildren =
      member.kind === 'fieldSet' && member.fieldSet?.members?.length
        ? member.fieldSet.members
        : member.fieldSet?.members?.length
          ? member.fieldSet.members
          : undefined

    if (fieldSetChildren?.length) {
      result.push(...flattenFieldSetMembers(fieldSetChildren))
      continue
    }

    if (member.inSelectedGroup === false) {
      result.push({...member, inSelectedGroup: true})
    } else {
      result.push(member)
    }
  }
  return result
}

function pathLeafName(path: unknown): string | undefined {
  if (!Array.isArray(path) || path.length === 0) return undefined
  const leaf = path[path.length - 1]
  return typeof leaf === 'string' ? leaf : undefined
}

export function CategoryLandingPageInput(props: ObjectInputProps) {
  const section = useActivePageSection()
  const wanted = section?.landingPageFields
  const propsWithAll = props as ObjectInputPropsWithAllMembers

  const sourceMembers = useMemo(
    () =>
      resolveMembersForSectionFiltering({
        members: props.members,
        _allMembers: propsWithAll._allMembers,
      }),
    [props.members, propsWithAll._allMembers],
  )

  const bandMembers = useMemo(() => {
    if (!wanted?.length) return null
    return filterMembersByFieldNames(sourceMembers, wanted, {
      flattenFieldSets: true,
      includeOutsideSelectedGroup: true,
    })
  }, [sourceMembers, wanted])

  useEffect(() => {
    if (!bandMembers?.length) return
    for (const member of bandMembers) {
      if (member.kind !== 'field' || typeof member.name !== 'string') continue
      if (member.collapsed) {
        props.onFieldExpand(member.name)
      }
    }
  }, [bandMembers, props.onFieldExpand])

  /**
   * RenderFieldCallback props are Omit<FieldProps, 'renderDefault'>.
   * Delegate through props.renderField — do not call fieldProps.renderDefault.
   */
  const renderField = useCallback(
    (fieldProps: Omit<FieldProps, 'renderDefault'>) => {
      if (!wanted?.length) {
        return props.renderField(fieldProps)
      }
      const name = fieldProps.name || pathLeafName(fieldProps.path)
      if (name && wanted.includes(name)) {
        return props.renderField({
          ...fieldProps,
          title: undefined,
          description: undefined,
        })
      }
      return props.renderField(fieldProps)
    },
    [wanted, props.renderField],
  )

  /**
   * RenderInputCallback props are Omit<InputProps, 'renderDefault'>.
   * Flatten band fieldsets by re-calling props.renderInput with filtered members
   * still bound to this object’s form node.
   */
  const renderInput = useCallback(
    (inputProps: Omit<InputProps, 'renderDefault'>) => {
      if (!wanted?.length) {
        return props.renderInput(inputProps)
      }

      const leaf = pathLeafName(inputProps.path)
      const objectProps = inputProps as Omit<ObjectInputProps, 'renderDefault'>
      const isBandObject =
        Boolean(leaf && wanted.includes(leaf)) &&
        inputProps.schemaType?.jsonType === 'object' &&
        Array.isArray(objectProps.members)

      if (!isBandObject) {
        return props.renderInput(inputProps)
      }

      const flatMembers = flattenFieldSetMembers(
        resolveMembersForSectionFiltering({
          members: objectProps.members,
          _allMembers: (objectProps as ObjectInputPropsWithAllMembers)._allMembers,
        }),
      )

      return props.renderInput({
        ...objectProps,
        members: flatMembers,
      } as Omit<InputProps, 'renderDefault'>)
    },
    [wanted, props.renderInput],
  )

  if (!bandMembers) {
    return props.renderDefault(props)
  }

  if (bandMembers.length === 0) {
    return null
  }

  return (
    <ObjectInputMembers
      members={bandMembers as unknown as NonNullable<ObjectInputProps['members']>}
      renderAnnotation={props.renderAnnotation}
      renderBlock={props.renderBlock}
      renderInlineBlock={props.renderInlineBlock}
      renderField={renderField}
      renderInput={renderInput}
      renderItem={props.renderItem}
      renderPreview={props.renderPreview}
    />
  )
}
