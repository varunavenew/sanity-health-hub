// Migration: Testimonials
import { createClient } from '@sanity/client'
import { config } from '../sanity/config'

const client = createClient({ ...config, useCdn: false, token: process.env.SANITY_TOKEN })

const testimonials = [
  {
    name: "Maria S.",
    age: 32,
    rating: 5,
    text: "Fantastisk opplevelse fra start til slutt. Spesialistene tok seg god tid og jeg følte meg trygg hele veien.",
    location: "Oslo",
    treatment: "Gynekologi",
  },
  {
    name: "Anders L.",
    age: 38,
    rating: 5,
    text: "Profesjonell og diskret behandling. Resultatet overgikk alle forventninger. Anbefales på det sterkeste!",
    location: "Bergen",
    treatment: "Urologi",
  },
  {
    name: "Sofie H.",
    age: 29,
    rating: 5,
    text: "Utrolig takknemlig for den hjelpen vi fikk. Moderne utstyr og dyktige spesialister. Vi er nå en familie!",
    location: "Trondheim",
    treatment: "Fertilitet",
  },
  {
    name: "Thomas K.",
    age: 45,
    rating: 5,
    text: "Kort ventetid og flott klinikk. Følte meg godt ivaretatt av kompetent personale. Veldig fornøyd!",
    location: "Oslo",
    treatment: "Urologi",
  },
  {
    name: "Emma J.",
    age: 27,
    rating: 5,
    text: "Endelig fant jeg en klinikk som virkelig forstår kvinnehelse. Moderne tilnærming og varmt personale.",
    location: "Bergen",
    treatment: "Gynekologi",
  },
  {
    name: "Lars M.",
    age: 35,
    rating: 5,
    text: "Har anbefalt CMedical til flere kolleger. De leverer virkelig på alle fronter - profesjonalitet og omsorg.",
    location: "Oslo",
    treatment: "Urologi",
  },
]

async function migrate() {
  console.log('Migrating testimonials...')
  for (const t of testimonials) {
    await client.createOrReplace({
      _id: `testimonial-${t.name.toLowerCase().replace(/[^a-z]/g, '-')}`,
      _type: 'testimonial',
      ...t,
    })
    console.log(`  ✓ ${t.name}`)
  }
  console.log('Done!')
}

migrate().catch(console.error)
