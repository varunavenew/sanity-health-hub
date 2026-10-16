import { defineField, defineType, type Path } from 'sanity'
import { SortIcon } from './icons'
import { pickStudioEn } from './studioPreview'

function publishedRefId(ref: string): string {
  return ref.replace(/^drafts\./, '')
}

/** Parent treatment _ref for the tjenesterSubMenuBlock that owns this children list. */
function tjenesterSubMenuBlockParentRef(
  document: Record<string, unknown> | undefined,
  parentPath: Path | undefined,
): string | undefined {
  if (!document || !parentPath?.length) return undefined
  const blocks = document.tjenesterSubMenuBlocks
  if (!Array.isArray(blocks)) return undefined
  const blocksIdx = parentPath.findIndex((segment) => segment === 'tjenesterSubMenuBlocks')
  if (blocksIdx < 0) return undefined
  const blockKeySegment = parentPath[blocksIdx + 1]
  if (typeof blockKeySegment !== 'object' || blockKeySegment === null || !('_key' in blockKeySegment)) {
    return undefined
  }
  const key = String((blockKeySegment as { _key?: string })._key || '')
  if (!key) return undefined
  const block = blocks.find(
    (row) => row && typeof row === 'object' && (row as { _key?: string })._key === key,
  )
  const ref = (block as { parent?: { _ref?: string } } | undefined)?.parent?._ref
  return ref ? publishedRefId(ref) : undefined
}

function subPagesLinkedToParentFilter(ctx: {
  document?: Record<string, unknown>
  parentPath?: Path
}) {
  const parentRef = tjenesterSubMenuBlockParentRef(ctx.document, ctx.parentPath)
  if (!parentRef) {
    return { filter: '_id == "___pick-parent-treatment-first___"' }
  }
  return {
    filter:
      '(parent._ref == $parentRef || parent._ref == $parentDraftRef) && pageRole != "team" && coalesce(hideFromWebsite, false) != true',
    params: { parentRef, parentDraftRef: `drafts.${parentRef}` },
  }
}

export default defineType({
  name: 'listingSortSettings',
  title: 'Tjenester menu & list order',
  type: 'document',
  icon: SortIcon,
  groups: [
    {
      name: 'tjenester',
      title: 'Tjenester dropdown',
      default: true,
    },
    { name: 'other', title: 'Other listings' },
  ],
  fields: [
    defineField({
      name: 'tjenesterCategoryOrder',
      title: 'Column 1 — drag categories',
      group: 'tjenester',
      description:
        'Drag to set the order of Fertilitet, Gynekologi, Flere tjenester, etc. Used when sort mode below is Manual. Categories you omit still appear at the end (newest last).',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'treatmentCategory' }] }],
      options: { sortable: true },
    }),
    defineField({
      name: 'tjenesterTreatmentBlocks',
      title: 'Column 2 — drag treatments per category',
      group: 'tjenester',
      description:
        'One block per category: drag treatments for that column in the Tjenester menu. Used when sort mode is Manual. New treatments still appear at the end until you add them here.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tjenesterTreatmentBlock',
          title: 'Category column',
          fields: [
            {
              name: 'category',
              title: 'Category',
              type: 'reference',
              to: [{ type: 'treatmentCategory' }],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'treatments',
              title: 'Treatments (column 2 order)',
              type: 'array',
              of: [{ type: 'reference', to: [{ type: 'treatment' }] }],
              options: { sortable: true },
            },
          ],
          preview: {
            select: { title: 'category.title' },
            prepare({ title }: { title?: unknown }) {
              return {
                title: pickStudioEn(title as Parameters<typeof pickStudioEn>[0]) || 'Category column',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'tjenesterSubMenuBlocks',
      title: 'Column 3 — drag sub-pages under a treatment',
      group: 'tjenester',
      description:
        'Drag order for column 3 only. Membership comes from each child’s Parent treatment (General). Pick the same parent as in column 2, then drag its sub-pages. Publishing a child with a parent adds it here at the end if missing.',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tjenesterSubMenuBlock',
          title: 'Parent sub-menu',
          fields: [
            {
              name: 'parent',
              title: 'Parent treatment (column 2 item)',
              type: 'reference',
              to: [{ type: 'treatment' }],
              validation: (Rule) => Rule.required(),
            },
            {
              name: 'children',
              title: 'Sub-pages (column 3 order)',
              type: 'array',
              of: [
                {
                  type: 'reference',
                  to: [{ type: 'treatment' }],
                  options: {
                    disableNew: true,
                    filter: subPagesLinkedToParentFilter,
                  },
                },
              ],
              options: { sortable: true },
              description:
                'Only treatments whose Parent treatment matches the block above. Reorder by dragging.',
            },
          ],
          preview: {
            select: { title: 'parent.title' },
            prepare({ title }: { title?: unknown }) {
              return {
                title:
                  pickStudioEn(title as Parameters<typeof pickStudioEn>[0]) ||
                  'Parent sub-menu',
              }
            },
          },
        },
      ],
    }),
    defineField({
      name: 'categoriesSort',
      title: 'Column 1 — automatic sort (optional)',
      group: 'tjenester',
      description:
        'Manual uses the drag list above. Pick A–Z or date only if you do not want to maintain the drag list.',
      type: 'string',
      options: {
        list: [
          { title: 'Manual (drag list above)', value: 'manual' },
          { title: 'Alphabetical (A–Z)', value: 'alphabetical' },
          { title: 'Reverse alphabetical (Z–A)', value: 'reverseAlphabetical' },
          { title: 'Newest first', value: 'newest' },
          { title: 'Oldest first', value: 'oldest' },
        ],
      },
      initialValue: 'manual',
    }),
    defineField({
      name: 'treatmentsSort',
      title: 'Columns 2 & 3 — automatic sort (optional)',
      group: 'tjenester',
      description:
        'Manual uses drag lists (column 2 here, column 3 on each parent treatment). A–Z overrides drag for both columns.',
      type: 'string',
      options: {
        list: [
          { title: 'Manual (drag lists)', value: 'manual' },
          { title: 'Alphabetical (A–Z)', value: 'alphabetical' },
          { title: 'Reverse alphabetical (Z–A)', value: 'reverseAlphabetical' },
          { title: 'Newest first', value: 'newest' },
          { title: 'Oldest first', value: 'oldest' },
        ],
      },
      initialValue: 'manual',
    }),
    defineField({
      name: 'specialistsSort',
      title: 'Specialists sort order',
      group: 'other',
      description:
        'Homepage slider and other specialist carousels. Does not apply to /spesialister (clinic order).',
      type: 'string',
      options: {
        list: [
          { title: 'Manual (Sort order field)', value: 'manual' },
          { title: 'Alphabetical (A–Z)', value: 'alphabetical' },
          { title: 'Reverse alphabetical (Z–A)', value: 'reverseAlphabetical' },
          { title: 'Newest first', value: 'newest' },
          { title: 'Oldest first', value: 'oldest' },
          { title: 'Featured first', value: 'featured' },
        ],
      },
      initialValue: 'manual',
    }),
    defineField({
      name: 'clinicsSort',
      title: 'Clinics sort order',
      group: 'other',
      description: 'Order of clinics across the website.',
      type: 'string',
      options: {
        list: [
          { title: 'Manual (Sort order field)', value: 'manual' },
          { title: 'Alphabetical (A–Z)', value: 'alphabetical' },
          { title: 'Reverse alphabetical (Z–A)', value: 'reverseAlphabetical' },
          { title: 'Newest first', value: 'newest' },
          { title: 'Oldest first', value: 'oldest' },
        ],
      },
      initialValue: 'manual',
    }),
  ],
  preview: {
    prepare() {
      return {
        title: 'Tjenester menu & list order',
      }
    },
  },
})
