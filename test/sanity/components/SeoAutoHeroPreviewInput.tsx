/**
 * SEO section: preview of the automatic hero/portrait used for sharing,
 * plus optional toggle to upload a custom OG image.
 */
import {useMemo} from 'react'
import {ImageIcon} from '@sanity/icons'
import {Box, Card, Flex, Stack, Text} from '@sanity/ui'
import {createImageUrlBuilder, type SanityImageSource} from '@sanity/image-url'
import {
  type BooleanFieldProps,
  useClient,
  useFormValue,
} from 'sanity'

const HERO_PAGE_TYPES = new Set(['specialist', 'treatment', 'treatmentCategory'])

function pickImageSource(
  docType: string | undefined,
  photo: unknown,
  heroImage: unknown,
  heroMedia: unknown,
): SanityImageSource | undefined {
  const media = heroMedia as {mediaType?: string; image?: SanityImageSource} | undefined
  const mediaImage = media?.image

  if (docType === 'specialist') {
    if (photo && typeof photo === 'object') return photo as SanityImageSource
    if (mediaImage) return mediaImage
    return undefined
  }

  if (docType === 'treatment' || docType === 'treatmentCategory') {
    if (heroImage && typeof heroImage === 'object') return heroImage as SanityImageSource
    if (mediaImage) return mediaImage
    return undefined
  }

  return undefined
}

function heroLabel(docType: string | undefined): string {
  if (docType === 'specialist') return 'profile / hero image'
  if (docType === 'treatment' || docType === 'treatmentCategory') return 'hero image'
  return 'page image'
}

function SeoAutoHeroPreviewBanner() {
  const client = useClient({apiVersion: '2024-01-01'})
  const docType = useFormValue(['_type']) as string | undefined
  const photo = useFormValue(['photo'])
  const heroImage = useFormValue(['heroImage'])
  const heroMedia = useFormValue(['heroMedia'])

  const imageSource = useMemo(
    () => pickImageSource(docType, photo, heroImage, heroMedia),
    [docType, photo, heroImage, heroMedia],
  )

  const previewUrl = useMemo(() => {
    if (!imageSource) return undefined
    try {
      return createImageUrlBuilder(client)
        .image(imageSource)
        .width(480)
        .height(252)
        .fit('crop')
        .auto('format')
        .url()
    } catch {
      return undefined
    }
  }, [client, imageSource])

  if (!HERO_PAGE_TYPES.has(docType ?? '')) return null

  return (
    <Card padding={3} radius={2} tone="primary" border>
      <Stack space={3}>
        <Stack space={2}>
          <Text size={1} weight="semibold">
            Sharing image (automatic)
          </Text>
          <Text size={1} muted>
            The page {heroLabel(docType)} is used for Google and social previews. Turn on
            &ldquo;Use a different sharing image&rdquo; below only when you need another
            image.
          </Text>
        </Stack>
        {previewUrl ? (
          <Flex align="center" gap={3}>
            <Box
              style={{
                width: 120,
                height: 63,
                borderRadius: 4,
                overflow: 'hidden',
                flexShrink: 0,
                background: 'var(--card-muted-bg-color)',
              }}
            >
              <img
                src={previewUrl}
                alt=""
                style={{width: '100%', height: '100%', objectFit: 'cover', display: 'block'}}
              />
            </Box>
            <Text size={1} muted>
              Current {heroLabel(docType)}
            </Text>
          </Flex>
        ) : (
          <Flex align="center" gap={2}>
            <Text size={1} muted>
              <ImageIcon /> No hero image on this page yet — add one in the Content tab, or
              turn on custom sharing image below.
            </Text>
          </Flex>
        )}
      </Stack>
    </Card>
  )
}

export function SeoSharingImageToggleField(props: BooleanFieldProps) {
  const useCustom = Boolean(props.value)

  return (
    <Stack space={3}>
      {!useCustom ? <SeoAutoHeroPreviewBanner /> : null}
      {props.renderDefault(props)}
    </Stack>
  )
}
