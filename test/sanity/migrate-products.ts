import { createClient } from '@sanity/client'
import { config } from './config'

const client = createClient({
  ...config,
  useCdn: false,
  token: process.env.SANITY_TOKEN,
})

const products = [
  {
    id: "1", name: "Hyaluronic Acid Serum", category: "tørr_hud", price: "449,-", rating: 4.9,
    tags: ["Hydrering", "Anti-aging", "Plumping"], intent: "dry_skin",
    description: "Intensiv hydreringsserum med ren hyaluronsyre for fyldig, duggfrisk hud",
    benefits: ["Binder fuktighet i huden for langvarig hydrering", "Reduserer synligheten av fine linjer og rynker", "Gir plumping-effekt for en fyldigere hud"],
    results: "Klinisk testet: 95% av brukerne rapporterer forbedret hudfuktighet etter 4 uker",
    howItWorks: "Hyaluronsyre trekker fuktighet fra omgivelsene og holder den i huden. Med molekyler i ulike størrelser trenger den både dypt og overflatisk for maksimal hydrering.",
    isSeasonal: true, seasonalOrder: 2,
  },
  {
    id: "2", name: "Rich Moisture Cream", category: "tørr_hud", price: "599,-", rating: 4.8,
    tags: ["Hydrering", "Ceramider", "Nærende"], intent: "dry_skin",
    description: "Rik fuktighetskrem med ceramider og shea butter",
    benefits: ["Reparerer og styrker hudbarrieren", "Gir langvarig hydrering og komfort", "Reduserer tørrhet og rødhet"],
    results: "86% rapporterer forbedret hudbarriere og mindre tørrhet etter 2 uker",
    howItWorks: "Ceramider gjenoppbygger hudbarrieren, mens shea butter gir intens næring. Perfekt for meget tørr hud.",
  },
  {
    id: "3", name: "Niacinamide Pore Refining Serum", category: "fet_hud", price: "399,-", rating: 4.7,
    tags: ["Porer", "Niacinamide", "Balanse"], intent: "oily_skin",
    description: "Minimerer porer og kontrollerer oljeproduksjon",
    benefits: ["Reduserer synligheten av forstørrede porer", "Balanserer talgproduksjonen i huden", "Minsker betennelse og rødhet"],
    results: "Klinisk testet: 90% opplever mindre oljeproduksjon og synlig porereduksjon etter 4 uker",
    howItWorks: "Niacinamide (vitamin B3) regulerer talgkjertlenes aktivitet og styrker hudbarrieren.",
  },
  {
    id: "4", name: "Mattifying Day Cream", category: "fet_hud", price: "449,-", rating: 4.6,
    tags: ["Matterende", "Oljefri", "Lett"], intent: "oily_skin",
    description: "Lett, oljefri dagkrem som holder huden matt hele dagen",
  },
  {
    id: "5", name: "Retinol Night Treatment", category: "anti_aging", price: "749,-", rating: 4.9,
    tags: ["Anti-aging", "Retinol", "Natt"], intent: "anti_aging",
    description: "Avansert anti-aging formel for hudfornyelse over natten",
    benefits: ["Stimulerer kollagenproduksjon for fastere hud", "Reduserer fine linjer og dype rynker", "Jevner ut hudtonen og teksturen"],
    results: "Klinisk testet: 92% ser synlig forbedring i hudens tekstur og reduksjon av fine linjer etter 6 uker",
    howItWorks: "Retinol er gullstandarden for anti-aging. Det øker cellefornying, stimulerer kollagenproduksjon og akselererer hudfornyelse mens du sover.",
    isSeasonal: true, seasonalOrder: 1,
  },
  {
    id: "6", name: "Peptide Eye Cream", category: "anti_aging", price: "599,-", rating: 4.8,
    tags: ["Øyekrem", "Peptider", "Anti-rynke"], intent: "anti_aging",
    description: "Reduserer rynker og mørke ringer rundt øynene",
  },
  {
    id: "7", name: "Salicylic Acid Cleanser", category: "akne", price: "349,-", rating: 4.7,
    tags: ["BHA", "Rensende", "Akne"], intent: "acne",
    description: "Dyptrengjørende cleanser som bekjemper akne og urenheter",
    benefits: ["Renser poret dypt og forebygger tilstoppede porer", "Reduserer akne og betennelse", "Exfolierer døde hudceller skånsomt"],
    results: "83% ser reduksjon i kviser og uren hud etter 3 uker med daglig bruk",
    howItWorks: "Salicylsyre (BHA) trenger dypt ned i porene og løser opp døde hudceller og talg.",
  },
  {
    id: "8", name: "Clarifying Spot Treatment", category: "akne", price: "299,-", rating: 4.8,
    tags: ["Spot treatment", "Hurtig", "Effektiv"], intent: "acne",
    description: "Målrettet behandling for kviser og urenheter",
  },
  {
    id: "9", name: "Vitamin C Brightening Serum", category: "universal", price: "599,-", rating: 4.9,
    tags: ["Brightening", "Vitamin C", "Glød"], intent: "skincare",
    description: "Lysner og jevner ut hudtonen med 15% vitamin C kompleks",
    benefits: ["Lysner hyperpigmentering og mørke flekker", "Gir huden naturlig glød og vitalitet", "Beskytter mot frie radikaler og miljøskader"],
    results: "Klinisk testet: 88% ser synlig reduksjon i pigmentflekker og forbedret hudglød etter 8 uker",
    howItWorks: "Vitamin C er et kraftig antioksidant som hemmer melaninproduksjon, lysner eksisterende pigmentering og beskytter mot fremtidige skader.",
    isSeasonal: true, seasonalOrder: 3,
  },
  {
    id: "10", name: "Daily SPF 50 Sunscreen", category: "universal", price: "449,-", rating: 4.9,
    tags: ["SPF 50", "UV-beskyttelse", "Daglig"], intent: "skincare",
    description: "Beskytter mot UVA/UVB stråler med lett, ikke-fet formel",
    benefits: ["Bredspektret beskyttelse mot UVA og UVB", "Forebygger solskader og for tidlig aldring", "Lett formel som ikke etterlater hvit film"],
    results: "Anbefalt av dermatologer som den viktigste anti-aging beskyttelsen",
    howItWorks: "Kombinasjon av fysiske og kjemiske UV-filtre gir maksimal beskyttelse mot solens skadelige stråler.",
  },
  {
    id: "11", name: "Overnight Sleeping Mask", category: "tørr_hud", price: "549,-", rating: 4.7,
    tags: ["Intensiv", "Nattmaske", "Reparerende"], intent: "dry_skin",
    description: "Intensiv nattmaske som gjenoppretter hudens fuktighetsbalanse",
    benefits: ["Dyp hydrering gjennom natten", "Reparerer og styrker hudbarrieren", "Våkn opp med myk, strålende hud"],
    results: "94% opplever merkbart mykere og mer hydrert hud om morgenen",
    howItWorks: "Rik formel med squalane og ceramider jobber mens du sover for å gjenoppbygge og hydrere huden intensivt.",
  },
  {
    id: "12", name: "Gentle Cleansing Oil", category: "tørr_hud", price: "379,-", rating: 4.8,
    tags: ["Renseolje", "Skånsom", "Makeupfjerner"], intent: "dry_skin",
    description: "Mild renseolje som fjerner makeup uten å tørke ut huden",
  },
  {
    id: "13", name: "Clay Purifying Mask", category: "fet_hud", price: "429,-", rating: 4.6,
    tags: ["Leiremaske", "Rensende", "Matterende"], intent: "oily_skin",
    description: "Trekker ut urenheter og absorberer overflødig olje",
    benefits: ["Dyptrengjørende leiremaske", "Minimerer porer og reduserer glans", "Etterlater huden ren og matt"],
    results: "88% ser renere porer og redusert glans etter første bruk",
    howItWorks: "Kaolin og bentonitt leire absorberer overflødig talg og trekker ut urenheter fra porene.",
  },
  {
    id: "14", name: "BHA Exfoliating Toner", category: "fet_hud", price: "399,-", rating: 4.8,
    tags: ["BHA", "Eksfoliering", "Toner"], intent: "oily_skin",
    description: "Eksfolierende toner som fjerner døde hudceller og renser porer",
  },
  {
    id: "15", name: "Collagen Boosting Serum", category: "anti_aging", price: "699,-", rating: 4.9,
    tags: ["Kollagen", "Fasthet", "Lifting"], intent: "anti_aging",
    description: "Stimulerer kollagenproduksjon for fastere, yngre hud",
    benefits: ["Øker hudens elastisitet og fasthet", "Reduserer synligheten av rynker", "Gir synlig lifting-effekt"],
    results: "89% ser forbedret hudfasthet og reduserte rynker etter 8 uker",
    howItWorks: "Peptider og vekstfaktorer stimulerer hudens egen kollagenproduksjon for naturlig anti-aging effekt.",
  },
  {
    id: "16", name: "Neck & Décolleté Cream", category: "anti_aging", price: "649,-", rating: 4.7,
    tags: ["Hals", "Dekolletasje", "Strammende"], intent: "anti_aging",
    description: "Spesialkrem for hals og dekolletasje som ofte viser alderstegn",
  },
  {
    id: "17", name: "Tea Tree Spot Gel", category: "akne", price: "249,-", rating: 4.7,
    tags: ["Tea Tree", "Antibakteriell", "Naturlig"], intent: "acne",
    description: "Naturlig antibakteriell gel med tea tree olje",
    benefits: ["Bekjemper bakterier som forårsaker akne", "Reduserer betennelse og rødhet", "Healer kviser raskere"],
    results: "82% ser raskere healing og redusert betennelse innen 48 timer",
    howItWorks: "Tea tree olje har naturlige antibakterielle egenskaper som bekjemper akne-bakterier uten å tørke ut huden.",
  },
  {
    id: "18", name: "Oil-Free Moisturizer", category: "akne", price: "399,-", rating: 4.6,
    tags: ["Oljefri", "Ikke-komedogen", "Lett"], intent: "acne",
    description: "Lett fuktighetskrem som ikke tetter til porer",
  },
  {
    id: "19", name: "Micellar Cleansing Water", category: "universal", price: "299,-", rating: 4.8,
    tags: ["Micellar", "Rensevann", "Praktisk"], intent: "skincare",
    description: "Alt-i-ett rensevann som fjerner makeup og urenheter",
  },
  {
    id: "20", name: "Hydrating Face Mist", category: "universal", price: "349,-", rating: 4.7,
    tags: ["Face mist", "Hydrating", "Refreshing"], intent: "skincare",
    description: "Forfriskende ansiktsspray for instant hydrering",
  },
]

async function migrateProducts() {
  console.log('Starting product migration...')

  for (const product of products) {
    const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    
    const doc: any = {
      _type: 'product',
      _id: `product-${product.id}`,
      name: product.name,
      slug: { _type: 'slug', current: slug },
      category: product.category,
      price: product.price,
      rating: product.rating,
      tags: product.tags,
      intent: product.intent,
      description: product.description,
      sortOrder: parseInt(product.id),
    }

    if (product.benefits) doc.benefits = product.benefits
    if (product.results) doc.results = product.results
    if (product.howItWorks) doc.howItWorks = product.howItWorks
    if (product.isSeasonal) doc.isSeasonal = true
    if (product.seasonalOrder) doc.seasonalOrder = product.seasonalOrder

    await client.createOrReplace(doc)
    console.log(`  ✓ ${product.name}`)
  }

  console.log(`\nMigrated ${products.length} products`)
}

migrateProducts().catch(console.error)
