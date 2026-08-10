// Migration: Translate Testimonials to English & Norwegian
import { sanityClient } from './config'

function i18nString(noVal: string, enVal: string) {
  return [
    { _key: 'no', _type: 'internationalizedArrayStringValue', language: 'no', value: noVal },
    { _key: 'en', _type: 'internationalizedArrayStringValue', language: 'en', value: enVal },
  ]
}

function i18nText(noVal: string, enVal: string) {
  return [
    { _key: 'no', _type: 'internationalizedArrayTextValue', language: 'no', value: noVal },
    { _key: 'en', _type: 'internationalizedArrayTextValue', language: 'en', value: enVal },
  ]
}

const testimonials = [
  {
    name: "Maria S.",
    age: 32,
    rating: 5,
    text: i18nText(
      "Fantastisk opplevelse fra start til slutt. Spesialistene tok seg god tid og jeg følte meg trygg hele veien.",
      "A fantastic experience from start to finish. The specialists took their time and I felt safe throughout."
    ),
    location: i18nString("Oslo", "Oslo"),
    treatment: i18nString("Gynekologi", "Gynecology"),
  },
  {
    name: "Anders L.",
    age: 38,
    rating: 5,
    text: i18nText(
      "Profesjonell og diskret behandling. Resultatet overgikk alle forventninger. Anbefales på det sterkeste!",
      "Professional and discreet care. Very happy with the prices and service."
    ),
    location: i18nString("Bergen", "Bergen"),
    treatment: i18nString("Urologi", "Urology"),
  },
  {
    name: "Sofie H.",
    age: 29,
    rating: 5,
    text: i18nText(
      "Utrolig takknemlig for den hjelpen vi fikk. Moderne utstyr og dyktige spesialister. Vi er nå en familie!",
      "Incredibly grateful for the help we received. Modern equipment and skilled specialists."
    ),
    location: i18nString("Trondheim", "Trondheim"),
    treatment: i18nString("Fertilitet", "Fertility"),
  },
  {
    name: "Thomas K.",
    age: 45,
    rating: 5,
    text: i18nText(
      "Kort ventetid og flott klinikk. Følte meg godt ivaretatt av kompetent personale. Veldig fornøyd!",
      "Short waiting time and great clinic. Felt well taken care of by competent staff. Very satisfied!"
    ),
    location: i18nString("Oslo", "Oslo"),
    treatment: i18nString("Urologi", "Urology"),
  },
  {
    name: "Emma J.",
    age: 27,
    rating: 5,
    text: i18nText(
      "Endelig fant jeg en klinikk som virkelig forstår kvinnehelse. Moderne tilnærming og varmt personale.",
      "Finally I found a clinic that really understands women's health. Modern approach and warm staff."
    ),
    location: i18nString("Bergen", "Bergen"),
    treatment: i18nString("Gynekologi", "Gynecology"),
  },
  {
    name: "Lars M.",
    age: 35,
    rating: 5,
    text: i18nText(
      "Har anbefalt CMedical til flere kolleger. De leverer virkelig på alle fronter - profesjonalitet og omsorg.",
      "Have recommended CMedical to several colleagues. They really deliver on all fronts - professionalism and care."
    ),
    location: i18nString("Oslo", "Oslo"),
    treatment: i18nString("Urologi", "Urology"),
  },
]

async function migrate() {
  console.log('Migrating translated testimonials...')
  for (const t of testimonials) {
    const id = `testimonial-${t.name.toLowerCase().replace(/[^a-z]/g, '-')}`
    await sanityClient.createOrReplace({
      _id: id,
      _type: 'testimonial',
      ...t,
    })
    console.log(`  ✓ ${t.name} (Translated)`)
  }
  console.log('Done!')
}

migrate().catch(console.error)
