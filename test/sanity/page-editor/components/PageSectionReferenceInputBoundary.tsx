/**
 * Connects native reference array inputs to Structure pane routing.
 *
 * DocumentPane wraps the default form with ReferenceInputOptionsProvider
 * (ReferenceChildLink + handleEditReference). Custom page-section document
 * inputs render ObjectInputMembers directly and must provide the same context
 * so clicking a reference opens the target document in the right split pane.
 */
import {useMemo, type ReactNode} from 'react'
import {fromString} from '@sanity/util/paths'
import {ReferenceInputOptionsProvider, type Path} from 'sanity'
import {usePaneRouter} from 'sanity/structure'

type PageSectionReferenceInputBoundaryProps = {
  children: ReactNode
}

export function PageSectionReferenceInputBoundary(props: PageSectionReferenceInputBoundaryProps) {
  const {children} = props
  const {
    ReferenceChildLink,
    handleEditReference,
    groupIndex,
    routerPanesState,
  } = usePaneRouter()

  const activePath = useMemo(() => {
    const childParams = routerPanesState[groupIndex + 1]?.[0]?.params || {}
    const parentRefPath =
      typeof childParams.parentRefPath === 'string' ? childParams.parentRefPath : undefined
    const routerPanesStateLength = routerPanesState.length

    if (!parentRefPath) {
      return {path: [] as Path, state: 'none' as const}
    }

    return {
      path: fromString(parentRefPath),
      state:
        groupIndex >= routerPanesStateLength - 1
          ? ('none' as const)
          : groupIndex >= routerPanesStateLength - 2
            ? ('selected' as const)
            : ('pressed' as const),
    }
  }, [groupIndex, routerPanesState])

  return (
    <ReferenceInputOptionsProvider
      EditReferenceLinkComponent={ReferenceChildLink}
      onEditReference={handleEditReference}
      activePath={activePath}
    >
      {children}
    </ReferenceInputOptionsProvider>
  )
}
