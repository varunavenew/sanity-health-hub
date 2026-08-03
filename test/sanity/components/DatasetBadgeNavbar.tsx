/**
 * Sanity Studio navbar badge — local developer safety only.
 *
 * Hosted / production Studio must never show "Developer Dataset" or
 * "Production Dataset" labels. Badge appears only on localhost when the
 * active dataset is `developer`.
 */
import type {CSSProperties} from 'react'
import {useWorkspace, type NavbarProps} from 'sanity'
import {datasetBadgeLabel, type SanityDatasetName} from '../dataset-env'

const badgeStyleFor = (dataset: SanityDatasetName): CSSProperties => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: 6,
  marginLeft: 12,
  padding: '4px 10px',
  borderRadius: 999,
  fontSize: 12,
  fontWeight: 600,
  letterSpacing: 0.2,
  background: dataset === 'developer' ? '#ecfdf5' : '#fef2f2',
  color: dataset === 'developer' ? '#065f46' : '#991b1b',
  border: `1px solid ${dataset === 'developer' ? '#a7f3d0' : '#fecaca'}`,
  whiteSpace: 'nowrap',
})

function isLocalStudioHost(): boolean {
  if (typeof window === 'undefined') return false
  const host = window.location.hostname
  return host === 'localhost' || host === '127.0.0.1'
}

export function DatasetBadgeNavbar(props: NavbarProps) {
  const {dataset, projectId} = useWorkspace()

  // Hosted Studio (sanity.studio / sanity.io) and production dataset: clean chrome.
  if (!isLocalStudioHost() || dataset === 'production') {
    return props.renderDefault(props)
  }

  if (dataset === 'developer') {
    return (
      <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
        <div style={{flex: 1, minWidth: 0}}>{props.renderDefault(props)}</div>
        <div
          style={badgeStyleFor('developer')}
          title={`Sanity project ${projectId} · dataset developer`}
        >
          {datasetBadgeLabel('developer')}
        </div>
      </div>
    )
  }

  // Unexpected local dataset — still no "Production Dataset" wording.
  return props.renderDefault(props)
}
