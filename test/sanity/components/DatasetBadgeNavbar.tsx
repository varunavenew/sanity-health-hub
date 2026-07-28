/**
 * Sanity Studio navbar badge showing which dataset is active.
 * Uses the workspace dataset (from sanity.config) so it works in the browser.
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

export function DatasetBadgeNavbar(props: NavbarProps) {
  const {dataset, projectId} = useWorkspace()
  const normalized =
    dataset === 'developer' || dataset === 'production'
      ? dataset
      : null

  return (
    <div style={{display: 'flex', alignItems: 'center', width: '100%'}}>
      <div style={{flex: 1, minWidth: 0}}>{props.renderDefault(props)}</div>
      {normalized ? (
        <div
          style={badgeStyleFor(normalized)}
          title={`Sanity project ${projectId} · dataset ${normalized}`}
        >
          {datasetBadgeLabel(normalized)}
        </div>
      ) : (
        <div
          style={{
            ...badgeStyleFor('production'),
            background: '#fff7ed',
            color: '#9a3412',
            border: '1px solid #fed7aa',
          }}
          title={`Unexpected dataset: ${dataset}`}
        >
          ⚠ Dataset: {dataset}
        </div>
      )}
    </div>
  )
}
