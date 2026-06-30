/**
 * Seed contact request dialog copy on contactPage (NO + EN).
 *
 * Run:
 *   cd test && npm run migrate:contact-request-dialog:dry
 *   npm run migrate:contact-request-dialog
 */
import { sanityClient } from './config'
import { i18nString, i18nText } from './lib/category-landing-i18n'

const DRY_RUN = process.env.DRY_RUN === '1'
const CONTACT_ID = 'contactPage'

const COPY = {
  dialogTitle: i18nString(
    'Vil du at vi skal kontakte deg?',
    'Would you like us to contact you?',
  ),
  dialogDescription: i18nText(
    'Fyll inn skjemaet, så ringer en av våre rådgivere deg tilbake.',
    'Fill in the form and one of our advisors will call you back.',
  ),
  nameLabel: i18nString('Navn', 'Name'),
  namePlaceholder: i18nString('Ditt navn', 'Your name'),
  phoneLabel: i18nString('Telefon', 'Phone'),
  phonePlaceholder: i18nString('+47 000 00 000', '+47 000 00 000'),
  clinicLabel: i18nString('Klinikk', 'Clinic'),
  clinicPlaceholder: i18nString('Velg klinikk', 'Choose clinic'),
  categoryLabel: i18nString('Fagområde', 'Specialty'),
  categoryPlaceholder: i18nString('Velg fagområde', 'Choose specialty'),
  categoryOtherLabel: i18nString('Annet / vet ikke', 'Other / not sure'),
  timingLabel: i18nString('Når ønsker du å bli kontaktet?', 'When would you like to be contacted?'),
  timingAsapLabel: i18nString('Snarest mulig', 'As soon as possible'),
  timingSpecificLabel: i18nString('Velg dag og tid', 'Choose day and time'),
  dayLabel: i18nString('Dag', 'Day'),
  timeOfDayLabel: i18nString('Tidspunkt', 'Time of day'),
  timeOfDayPlaceholder: i18nString('Velg tidspunkt', 'Choose time'),
  timeMorningLabel: i18nString('Formiddag (08–12)', 'Morning (08–12)'),
  timeAfternoonLabel: i18nString('Ettermiddag (12–16)', 'Afternoon (12–16)'),
  timeEveningLabel: i18nString('Kveld (16–20)', 'Evening (16–20)'),
  detailsLabel: i18nString('Utdyp gjerne hva det handler om', 'Please describe what it is about'),
  detailsOptionalSuffix: i18nString('(valgfritt)', '(optional)'),
  detailsPlaceholder: i18nText(
    'Kort beskrivelse av hva henvendelsen gjelder...',
    'Brief description of what your inquiry is about...',
  ),
  cancelButton: i18nString('Avbryt', 'Cancel'),
  submitButton: i18nString('Send forespørsel', 'Send request'),
  submittingButton: i18nString('Sender...', 'Sending...'),
  privacyNote: i18nText(
    'Vi behandler dine personopplysninger i samsvar med GDPR.',
    'We process your personal data in accordance with GDPR.',
  ),
  toastValidationTitle: i18nString('Sjekk skjemaet', 'Please check the form'),
  toastValidationDescription: i18nString(
    'Vennligst fyll inn alle påkrevde felt',
    'Please fill in all required fields',
  ),
  validationNameRequired: i18nString('Vennligst fyll inn navn', 'Please enter your name'),
  validationPhoneRequired: i18nString(
    'Vennligst fyll inn telefonnummer',
    'Please enter your phone number',
  ),
  validationClinicRequired: i18nString('Velg klinikk', 'Please choose a clinic'),
  validationCategoryRequired: i18nString('Velg fagområde', 'Please choose a specialty'),
  toastSuccessTitle: i18nString('Forespørsel mottatt', 'Request received'),
  toastSuccessDescription: i18nText(
    'Vi tar kontakt med deg så snart som mulig.',
    'We will contact you as soon as possible.',
  ),
}

async function run() {
  const existing = await sanityClient.fetch<Record<string, unknown> | null>(
    `*[_id == $id][0]{ dialogTitle }`,
    { id: CONTACT_ID },
  )

  if (!existing) {
    console.error(`✗ Missing ${CONTACT_ID}`)
    process.exit(1)
  }

  if (existing.dialogTitle) {
    console.log('✓ contactPage already has contact dialog copy')
    return
  }

  console.log(DRY_RUN ? 'Dry run — would set contact dialog copy' : 'Setting contact dialog copy…')

  if (!DRY_RUN) {
    await sanityClient.patch(CONTACT_ID).set(COPY).commit()
  }

  console.log(`\n${DRY_RUN ? 'Would update' : 'Updated'} ${CONTACT_ID}`)
}

run().catch((err) => {
  console.error(err)
  process.exit(1)
})
