import { textForSort, compareAlphabetical, sortBySortOrder, type SortLocale } from '../sortAlphabetical'

export function applyListingSort<T>(
  items: T[],
  sortOption: string | undefined | null,
  locale: SortLocale = 'no',
  getLabel: (item: T) => unknown = (item: any) => item.name || item.label || item.title || '',
  getSortOrder: (item: T) => unknown = (item: any) => item.sortOrder,
  getCreatedAt: (item: T) => unknown = (item: any) => item._createdAt
): T[] {
  if (!items || !items.length) return items

  const option = sortOption || 'manual'

  switch (option) {
    case 'alphabetical':
      return [...items].sort((a, b) =>
        compareAlphabetical(textForSort(getLabel(a), locale), textForSort(getLabel(b), locale), locale)
      )
    case 'reverseAlphabetical':
      return [...items].sort((a, b) =>
        compareAlphabetical(textForSort(getLabel(b), locale), textForSort(getLabel(a), locale), locale)
      )
    case 'newest':
      return [...items].sort((a, b) => {
        const timeA = new Date((getCreatedAt(a) as string) || 0).getTime()
        const timeB = new Date((getCreatedAt(b) as string) || 0).getTime()
        return timeB - timeA
      })
    case 'oldest':
      return [...items].sort((a, b) => {
        const timeA = new Date((getCreatedAt(a) as string) || 0).getTime()
        const timeB = new Date((getCreatedAt(b) as string) || 0).getTime()
        return timeA - timeB
      })
    case 'featured':
      // Sort featured elements first (if element has .featured: true), else fallback to manual order
      return [...items].sort((a: any, b: any) => {
        const featA = a.featured ? 1 : 0
        const featB = b.featured ? 1 : 0
        if (featA !== featB) return featB - featA

        // Fallback to sortOrder logic
        const orderA = typeof getSortOrder(a) === 'number' ? (getSortOrder(a) as number) : 9999
        const orderB = typeof getSortOrder(b) === 'number' ? (getSortOrder(b) as number) : 9999
        return orderA - orderB
      })
    case 'manual':
    default:
      return sortBySortOrder(items, getSortOrder, getLabel, locale)
  }
}
