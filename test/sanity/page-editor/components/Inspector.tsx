/**
 * Section form chrome: header (title / actions) + content body for filtered fields.
 */
import {Box, Card, Flex, Stack, Text} from '@sanity/ui'
import type {ComponentType, ReactNode} from 'react'
import {SectionPreview} from './SectionList'

type InspectorHeaderProps = {
  title: string
  description?: string
  preview?: string
  icon?: ComponentType<{width?: number; height?: number}>
  actions?: ReactNode
}

export function InspectorHeader(props: InspectorHeaderProps) {
  const {title, description, preview, icon: Icon, actions} = props

  return (
    <Card padding={4} radius={2} border tone="transparent">
      <Flex align="flex-start" justify="space-between" gap={3}>
        <Flex align="flex-start" gap={3} flex={1}>
          {Icon ? (
            <Box style={{marginTop: 2}}>
              <Icon width={20} height={20} />
            </Box>
          ) : null}
          <Stack space={2} flex={1}>
            <Text size={2} weight="semibold">
              {title}
            </Text>
            {description ? (
              <Text size={1} muted>
                {description}
              </Text>
            ) : null}
            {preview ? <SectionPreview label={preview} /> : null}
          </Stack>
        </Flex>
        {actions ? <Box style={{flexShrink: 0}}>{actions}</Box> : null}
      </Flex>
    </Card>
  )
}

type InspectorContentProps = {
  children: ReactNode
}

export function InspectorContent({children}: InspectorContentProps) {
  return (
    <Card padding={4} radius={2} border>
      <Stack space={4}>{children}</Stack>
    </Card>
  )
}

type InspectorProps = {
  header: ReactNode
  children: ReactNode
}

export function Inspector({header, children}: InspectorProps) {
  return (
    <Stack space={3}>
      {header}
      {children}
    </Stack>
  )
}
