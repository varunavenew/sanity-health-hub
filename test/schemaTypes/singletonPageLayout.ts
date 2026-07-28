/**
 * Shared Studio layout for CMedical V2 page singletons.
 * Editors see Hero + Content first; other areas are collapsed fieldsets.
 */

export const singletonPageGroups = [
  {name: 'hero', title: 'Hero', default: true},
  {name: 'content', title: 'Content'},
] as const

export type SingletonPageGroup = (typeof singletonPageGroups)[number]['name']

export const singletonPageFieldsets = [
  {
    name: 'testimonials',
    title: 'Testimonials',
    description:
      'Patient quotes used ONLY on Pricing. These are NOT Google Reviews — use Content Library → Google Reviews for those.',
    options: {collapsible: true, collapsed: true},
  },
  {
    name: 'sharedSections',
    title: 'Shared Sections',
    description:
      'Reusable website bands from Content Library (CTA Collections, Insurance Collections, Specialists, Articles).',
    options: {collapsible: true, collapsed: true},
  },
  {
    name: 'seo',
    title: 'SEO',
    description: 'Only edit if you understand search engine optimisation.',
    options: {collapsible: true, collapsed: true},
  },
  {
    name: 'legacy',
    title: 'Legacy',
    description:
      'Migration and rollback only. Do not edit unless instructed by a developer.',
    options: {collapsible: true, collapsed: true},
  },
  {
    name: 'advanced',
    title: 'Advanced',
    description: 'Rarely edited. Leave defaults unless you have a specific reason to change them.',
    options: {collapsible: true, collapsed: true},
  },
] as const

export type SingletonPageFieldset = (typeof singletonPageFieldsets)[number]['name']

/** Assign SEO + geo fields to collapsed SEO fieldset on Content tab. */
export const seoFieldsetProps = {
  group: 'content' as const,
  fieldset: 'seo' as const,
}

/** Assign page bands to collapsed Shared Sections fieldset on Content tab. */
export const sharedSectionsFieldsetProps = {
  group: 'content' as const,
  fieldset: 'sharedSections' as const,
}

/** Assign Pricing testimonial fields to collapsed Testimonials fieldset. */
export const testimonialsFieldsetProps = {
  group: 'content' as const,
  fieldset: 'testimonials' as const,
}

/** FAQ Collection reference — same pattern as Homepage / Treatments. */
export function faqCollectionField(group: SingletonPageGroup = 'content') {
  return {
    name: 'faqCollection',
    title: 'FAQ Collection',
    type: 'reference',
    to: [{type: 'faqCollection'}],
    group,
    description:
      'Managed from Content Library → FAQ Collections. The website prefers this over any legacy FAQ list in the Legacy section.',
    options: {
      disableNew: false,
    },
  }
}
