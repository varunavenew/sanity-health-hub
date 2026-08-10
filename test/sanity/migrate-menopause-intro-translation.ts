// Migration: Translate Menopause treatment introduction text (description)
import { sanityClient } from './config'

const TREATMENT_ID = 'treatment-gynekologi-overgangsalder'

const descriptionNO = `Symptomer på overgangsalderen starter ofte i første halvdel av 40-årene, opplevelsene kan variere mye fra kvinne til kvinne. For noen er overgangen knapt merkbar, mens andre opplever så store utfordringer at det påvirker hverdagen deres betydelig.

Hos CMedical møter du et dedikert ekspert-team av spesialister på overgangsalder. Våre eksperter er medlemmer av British Menopause Society og samarbeider tett med Newson Health i Storbritannia, som er verdens ledende klinikk innen overgangsalder. Behandlingsmetodikken vår bygger på «de fire søylene» – hormoner, relasjoner, ernæring og fysisk form – som sammen sikrer en helhetlig tilnærming til dine behov.`

const descriptionEN = `Symptoms of menopause often start in the first half of the 40s, and experiences can vary widely from woman to woman. For some, the transition is barely noticeable, while others experience challenges so significant that it substantially affects their daily life.

At CMedical, you will meet a dedicated expert team of specialists in menopause. Our experts are members of the British Menopause Society and work closely with Newson Health in the UK, which is the world's leading clinic in menopause. Our treatment methodology is based on "the four pillars" – hormones, relationships, nutrition, and physical fitness – which together ensure a holistic approach to your needs.`

async function run() {
  console.log(`Migrating intro text for ${TREATMENT_ID}...`)
  
  const doc = await sanityClient.fetch(`*[_id == $id || _id == $draftId][0]`, {
    id: TREATMENT_ID,
    draftId: `drafts.${TREATMENT_ID}`
  })
  
  if (!doc) {
    console.error(`✗ Treatment page document not found: ${TREATMENT_ID}`)
    return
  }

  const patchData = {
    description: [
      { _key: 'no', _type: 'internationalizedArrayTextValue', language: 'no', value: descriptionNO },
      { _key: 'en', _type: 'internationalizedArrayTextValue', language: 'en', value: descriptionEN }
    ]
  }

  await sanityClient.patch(TREATMENT_ID).set(patchData).commit()
  console.log(`✓ Updated production document ${TREATMENT_ID}`)

  const draftExists = await sanityClient.fetch(`count(*[_id == $id]) > 0`, { id: `drafts.${TREATMENT_ID}` })
  if (draftExists) {
    await sanityClient.patch(`drafts.${TREATMENT_ID}`).set(patchData).commit()
    console.log(`✓ Updated draft document drafts.${TREATMENT_ID}`)
  }
  
  console.log('Done!')
}

run().catch(console.error)
