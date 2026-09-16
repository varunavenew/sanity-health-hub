/**
 * Treatment page roles — controls eligibility for Related Services carousel.
 */
export type TreatmentPageRole = 'service' | 'team'

/** Team / profile pages are routable treatments but not clinical services. */
export function isRelatedServiceEligible(
  pageRole: TreatmentPageRole | string | null | undefined,
): boolean {
  return pageRole !== 'team'
}

/** Published treatments with hideFromWebsite enabled are excluded from the public site. */
export function isTreatmentVisibleOnWebsite(
  hideFromWebsite: boolean | null | undefined,
): boolean {
  return hideFromWebsite !== true
}
