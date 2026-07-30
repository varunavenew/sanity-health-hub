/**
 * Studio-only input for treatmentCategory.landingPage.
 *
 * When an active page-editor section declares `landingPageFields`, filter nested
 * members to that band only (same pattern as PageSectionsArrayInput).
 * Document JSON paths are unchanged — editors edit the existing nested objects.
 */
import {useMemo} from 'react'
import {ObjectInputMembers, type ObjectInputProps} from 'sanity'
import {useActivePageSection} from '../ActivePageSectionContext'
import {
  filterMembersByFieldNames,
  resolveMembersForSectionFiltering,
  type FormMemberLike,
} from '../filterMembers'

type ObjectInputPropsWithAllMembers = ObjectInputProps & {
  _allMembers?: FormMemberLike[]
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

  const filteredMembers = useMemo(() => {
    if (!wanted?.length) return null
    return filterMembersByFieldNames(sourceMembers, wanted, {
      // Promote the matching band to the top of the form so editors do not
      // dig through an extra "Website sections" fieldset nest.
      flattenFieldSets: true,
      includeOutsideSelectedGroup: true,
    })
  }, [sourceMembers, wanted])

  if (!filteredMembers) {
    return props.renderDefault(props)
  }

  const {members: _ignored, ...rest} = props
  return (
    <ObjectInputMembers
      {...rest}
      members={filteredMembers as unknown as ObjectInputProps['members']}
    />
  )
}
