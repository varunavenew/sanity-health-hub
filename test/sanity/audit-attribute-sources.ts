import { sanityClient } from './config'

async function run() {
  const queries: Record<string, string> = {
    'slug.current docs': `count(*[defined(slug.current)])`,
    'products': `count(*[_type == "product"])`,
    'testimonials': `count(*[_type == "testimonial"])`,
    'google reviews': `count(*[_type == "googleReview"])`,
    'treatments': `count(*[_type == "treatment"])`,
    'treatment layout': `count(*[_type == "treatment" && defined(layout)])`,
    'treatment linkedServicesSectionTitle': `count(*[_type == "treatment" && defined(linkedServicesSectionTitle)])`,
    'treatment processSectionTitle': `count(*[_type == "treatment" && defined(processSectionTitle)])`,
    'category landingPage.specialistsSection': `count(*[_type == "treatmentCategory" && defined(landingPage.specialistsSection)])`,
  }

  for (const [label, q] of Object.entries(queries)) {
    const n = await sanityClient.fetch<number>(q)
    console.log(`${label}: ${n}`)
  }
}

run().catch(console.error)
