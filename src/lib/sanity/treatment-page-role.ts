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
