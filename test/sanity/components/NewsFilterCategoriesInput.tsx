import {Card, Checkbox, Flex, Stack, Text} from '@sanity/ui'
import {ArrayOfPrimitivesInputProps, set, unset} from 'sanity'
import {
  NEWS_FILTER_BUSINESS_CATEGORIES,
  businessIdsFromStoredCategories,
  expandBusinessCategoriesToStored,
  type NewsFilterBusinessId,
} from '../../schemaTypes/newsFilterCategories'

/**
 * Shows only the four business categories. Writes expanded legacy aliases
 * into `acceptedArticleCategories` so Aktuelt filtering stays unchanged.
 */
export function NewsFilterCategoriesInput(props: ArrayOfPrimitivesInputProps) {
  const selectedIds = businessIdsFromStoredCategories(props.value)

  const toggle = (id: NewsFilterBusinessId) => {
    const next: NewsFilterBusinessId[] = selectedIds.includes(id)
      ? selectedIds.filter((x) => x !== id)
      : [...selectedIds, id]
    const expanded = expandBusinessCategoriesToStored(next)
    props.onChange(expanded.length > 0 ? set(expanded) : unset())
  }

  return (
    <Stack space={3}>
      <Text size={1} muted>
        Choose one or more business categories. Leave empty only for the All filter.
      </Text>
      <Stack space={2}>
        {NEWS_FILTER_BUSINESS_CATEGORIES.map((cat) => {
          const checked = selectedIds.includes(cat.id)
          const inputId = `news-filter-cat-${cat.id}`
          return (
            <Card
              key={cat.id}
              padding={3}
              radius={2}
              shadow={1}
              tone={checked ? 'primary' : 'default'}
            >
              <Flex align="center" gap={3}>
                <Checkbox
                  id={inputId}
                  checked={checked}
                  onChange={() => toggle(cat.id)}
                />
                <Text size={1} weight="medium">
                  <label htmlFor={inputId} style={{cursor: 'pointer'}}>
                    {cat.title}
                  </label>
                </Text>
              </Flex>
            </Card>
          )
        })}
      </Stack>
    </Stack>
  )
}
