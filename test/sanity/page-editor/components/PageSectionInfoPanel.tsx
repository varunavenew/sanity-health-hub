/**
 * Read-only page-section panels for content sourced outside the page document.
 * Prepared for future display modes (Automatic / Manual) without redesign.
 */
import {LaunchIcon} from '@sanity/icons'
import {Box, Button, Card, Flex, Stack, Text} from '@sanity/ui'
import {useIntentLink} from 'sanity/router'
import type {PageSectionInfoPanel as PageSectionInfoPanelConfig} from '../types'

type PageSectionInfoPanelProps = {
  panel: PageSectionInfoPanelConfig
}

function OpenMedicalContentButton(props: {
  label: string
  documentType: string
}) {
  const {label, documentType} = props
  const {onClick, href} = useIntentLink({
    intent: 'edit',
    params: {type: documentType},
  })

  return (
    <Box>
      <Button
        as="a"
        href={href}
        onClick={onClick}
        text={label}
        icon={LaunchIcon}
        tone="primary"
        mode="default"
        fontSize={1}
        padding={3}
      />
    </Box>
  )
}

export function PageSectionInfoPanel({panel}: PageSectionInfoPanelProps) {
  if (panel.variant !== 'medical-content-source') return null

  const {sourceLabel, entityLabel, documentType, displayMode} = panel

  return (
    <Stack space={4}>
      <Card padding={4} radius={2} border tone="transparent">
        <Stack space={3}>
          <Text size={2} weight="semibold">
            👨‍⚕️ {entityLabel}
          </Text>
          <Text size={1} muted>
            Homepage {entityLabel.toLowerCase()} are managed from {sourceLabel}.
          </Text>
          <Text size={1} muted>
            The homepage automatically displays {entityLabel.toLowerCase()} from the{' '}
            {sourceLabel} library.
          </Text>
        </Stack>
      </Card>

      <Stack space={2}>
        <Text size={1} weight="semibold">
          Display Mode
        </Text>
        <Card padding={3} radius={2} border>
          <Flex align="center" justify="space-between" gap={3}>
            <Text size={1}>{displayMode === 'automatic' ? 'Automatic' : displayMode}</Text>
            {/* Reserved for future Manual option — no control yet */}
          </Flex>
        </Card>
      </Stack>

      <OpenMedicalContentButton label={`Open ${entityLabel}`} documentType={documentType} />
    </Stack>
  )
}
