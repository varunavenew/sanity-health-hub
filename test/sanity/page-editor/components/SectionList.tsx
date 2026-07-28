/**
 * Shared section navigation UI: compact cards + list layout for Structure panes.
 */
import {useState, type ComponentType, type ReactNode} from 'react'
import {Box, Card, Flex, Stack, Text} from '@sanity/ui'
import {ChevronRightIcon} from '@sanity/icons'

type SectionCardProps = {
  title: string
  /** Optional; not shown on compact Structure list cards. */
  description?: string
  /** @deprecated Prefer `chips`. */
  preview?: string
  /** Short metadata labels joined with • */
  chips?: string[]
  icon?: ComponentType<{width?: number; height?: number}>
  selected?: boolean
  onSelect?: () => void
  /**
   * When false, render as a block for Structure ChildLink wrappers.
   * Still shows hover affordance so the whole linked card feels clickable.
   */
  interactive?: boolean
}

function SectionMeta({chips}: {chips: string[]}) {
  if (chips.length === 0) return null
  return (
    <Text size={1} muted style={{lineHeight: 1.35}}>
      {chips.join(' • ')}
    </Text>
  )
}

function SectionCardBody(props: {
  title: string
  chips: string[]
  icon?: ComponentType<{width?: number; height?: number}>
  showChevron: boolean
}) {
  const {title, chips, icon: Icon, showChevron} = props

  return (
    <Flex align="center" gap={3}>
      {Icon ? (
        <Box style={{flexShrink: 0, opacity: 0.85, display: 'flex', alignItems: 'center'}}>
          <Icon width={18} height={18} />
        </Box>
      ) : null}

      <Stack space={2} flex={1} style={{minWidth: 0}}>
        <Text size={1} weight="medium" style={{textDecoration: 'none'}}>
          {title}
        </Text>
        <SectionMeta chips={chips} />
      </Stack>

      <Box
        style={{
          flexShrink: 0,
          opacity: showChevron ? 0.55 : 0,
          transition: 'opacity 120ms ease',
          display: 'flex',
          alignItems: 'center',
        }}
        aria-hidden
      >
        <ChevronRightIcon width={16} height={16} />
      </Box>
    </Flex>
  )
}

/**
 * Compact section card — title + muted metadata only.
 * Entire surface is the click target when wrapped by Structure ChildLink / button.
 */
export function SectionCard(props: SectionCardProps) {
  const {
    title,
    preview,
    chips: chipsProp,
    icon,
    selected = false,
    onSelect,
    interactive = true,
  } = props

  const [hovered, setHovered] = useState(false)
  const chips = (chipsProp && chipsProp.length > 0 ? chipsProp : preview ? [preview] : []).filter(Boolean)
  const showHover = hovered || selected

  const cardStyle = {
    width: '100%' as const,
    textAlign: 'left' as const,
    cursor: 'pointer',
    appearance: 'none' as const,
    textDecoration: 'none' as const,
    color: 'inherit' as const,
    transition: 'box-shadow 120ms ease, background-color 120ms ease',
  }

  const body = (
    <SectionCardBody title={title} chips={chips} icon={icon} showChevron={showHover} />
  )

  if (!interactive) {
    return (
      <Card
        paddingX={3}
        paddingY={3}
        radius={2}
        shadow={showHover ? 1 : 0}
        tone={showHover ? 'transparent' : 'default'}
        border
        style={cardStyle}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {body}
      </Card>
    )
  }

  return (
    <Card
      as="button"
      type="button"
      paddingX={3}
      paddingY={3}
      radius={2}
      shadow={showHover ? 1 : 0}
      tone={showHover ? 'transparent' : 'default'}
      border
      onClick={onSelect}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={cardStyle}
    >
      {body}
    </Card>
  )
}

type SectionListProps = {
  pageTitle: string
  pageSubtitle?: string
  pageMeta?: string
  children: ReactNode
}

export function SectionList(props: SectionListProps) {
  const {pageTitle, pageSubtitle, pageMeta, children} = props

  return (
    <Stack space={4}>
      <Stack space={2}>
        <Text size={2} weight="semibold">
          {pageTitle}
        </Text>
        {pageMeta ? (
          <Text size={1} muted>
            {pageMeta}
          </Text>
        ) : null}
        {pageSubtitle ? (
          <Text size={1} muted>
            {pageSubtitle}
          </Text>
        ) : null}
      </Stack>
      <Stack space={2}>{children}</Stack>
    </Stack>
  )
}

type SectionPreviewProps = {
  label: string
}

/** Small metadata line for inspector chrome (generic). */
export function SectionPreview({label}: SectionPreviewProps) {
  if (!label) return null
  return (
    <Text size={1} muted>
      {label}
    </Text>
  )
}
