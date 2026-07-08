import * as fs from 'fs'
import * as path from 'path'

const INPUT_FILE = path.join(__dirname, '..', 'schema_strings.json')
const OUTPUT_FILE = path.join(__dirname, '..', 'schema_translations.json')

// A comprehensive local dictionary for medical, clinical, editorial and Sanity CMS terms
const LOCAL_DICTIONARY: Record<string, string> = {
  // Simple labels
  "Tittel": "Title",
  "Sidetittel": "Page Title",
  "Overskrift": "Heading",
  "Undertekst": "Subheading",
  "Undertittel": "Subtitle",
  "Beskrivelse": "Description",
  "Bilde": "Image",
  "Bakgrunnsbilde": "Background Image",
  "Ikon": "Icon",
  "Tekst": "Text",
  "Kategori": "Category",
  "Kategorier": "Categories",
  "Behandling": "Treatment",
  "Behandlinger": "Treatments",
  "Spesialist": "Specialist",
  "Spesialister": "Specialists",
  "Klinikk": "Clinic",
  "Klinikker": "Clinics",
  "Tjeneste": "Service",
  "Tjenester": "Services",
  "Adresse": "Address",
  "Telefon": "Phone",
  "E-post": "Email",
  "Navn": "Name",
  "Rolle": "Role",
  "Biografi": "Biography",
  "Anmeldelse": "Review",
  "Anmeldelser": "Reviews",
  "Auto": "Automatic",
  "Aktiv": "Active",
  "Alder": "Age",
  "By": "City",
  "Fotnote": "Footnote",
  "Verdi": "Value",
  "Tall": "Number",
  "Statistikk": "Statistics",
  "Etikett": "Label",
  "Generelt": "General",
  "Seksjoner": "Sections",
  "Pasientanmeldelser": "Patient Reviews",
  "SEO & meta": "SEO & Meta",
  "Synlighet": "Visibility",
  "Valgfritt": "Optional",
  "Påkrevd": "Required",
  "Knapp": "Button",
  "Knappetekst": "Button Text",
  "Lenke": "Link",
  "Lenketekst": "Link Text",
  "Spørsmål": "Question",
  "Svar": "Answer",
  "FAQ": "FAQ",
  "Ofte stilte spørsmål": "Frequently Asked Questions",
  "Se alle": "See all",
  "Les mer": "Read more",
  "Bestill time": "Book Appointment",
  "Bestill time (CTA)": "Book Appointment (CTA)",
  "Nyheter": "News",
  "Nyheter og artikler": "News and Articles",
  "Artikkel": "Article",
  "Artikler": "Articles",
  "Kvinnehelse": "Women's Health",
  "Mannehelse": "Men's Health",
  "Urologi": "Urology",
  "Gynekologi": "Gynecology",
  "Fertilitet": "Fertility",
  "Ortopedi": "Orthopedics",
  "Graviditet": "Pregnancy",
  "Fostermedisin": "Fetal Medicine",
  "Kikkhullsoperasjon": "Keyhole Surgery",
  "Robotassistert kirurgi": "Robot-Assisted Surgery",
  "Slik foregår det": "How it Works",
  "Forløp": "Process",
  "Ekspertområder": "Expertise",
  "Løfter": "Promises",
  "Om oss": "About Us",
  "Hjem": "Home",
  "Forside": "Homepage",
  "Priser": "Pricing",
  "Forsikring": "Insurance",
  "Karriere": "Careers",
  "Kontakt": "Contact",
  "Kontakt oss": "Contact Us",
  "Aktuelt": "News",
  "Alt-tekst": "Alt Text",
  "Bilde alt-tekst": "Image Alt Text",
  "Alt-tekst for bilde": "Alt text for image",
  "Bilde alt": "Image Alt",
  "Bilde — alt": "Image — Alt",
  "Bildetekst": "Caption",
  "Bildetekst (valgfritt)": "Caption (optional)",
  "Bilde (valgfritt)": "Image (optional)",
  "Breddegrad": "Latitude",
  "Lengdegrad": "Longitude",
  "Altitude": "Altitude",
  "Rekkefølge": "Sort Order",
  "Sortering": "Sorting",
  "Språk": "Language",
  "Tittel (språktilpasset)": "Title (i18n)",
  "Overskrift (språktilpasset)": "Heading (i18n)",
  "Brødtekst": "Body Text",
  "Avsnitt": "Paragraph",
  "Video": "Video",
  "Video-fil": "Video File",
  "Video-URL": "Video URL",
  "YouTube-video": "YouTube Video",
  "YouTube-ID": "YouTube ID",
  "Kilde": "Source",
  "Utgiver": "Publisher",
  "Dato": "Date",
  "Publisert": "Published",
  "Siste oppdatert": "Last Updated",
  "Forfatter": "Author",
  "Sammendrag": "Excerpt",
  "Metadata": "Metadata",
  "Meta-beskrivelse": "Meta Description",
  "Søkeord": "Keywords",
  "Tag": "Tag",
  "Tags": "Tags",
  "Etiketter": "Labels",
  "Logo": "Logo",
  "Link": "Link",
  "Sti": "Path",
  "Rute": "Route",
  "Slug": "Slug",
  "Tidsrom": "Time period",
  "Ukedager": "Weekdays",
  "Åpningstider": "Opening Hours",
  "Stengt": "Closed",
  "Man": "Mon",
  "Tir": "Tue",
  "Ons": "Wed",
  "Tor": "Thu",
  "Fre": "Fri",
  "Lør": "Sat",
  "Søn": "Sun",
  "Mandag": "Monday",
  "Tirsdag": "Tuesday",
  "Onsdag": "Wednesday",
  "Torsdag": "Thursday",
  "Fredag": "Friday",
  "Lørdag": "Saturday",
  "Søndag": "Sunday",
  "Vennligst fyll ut": "Please fill out",
  "Påkrevd felt": "Required field",
  "Feilmelding": "Error message",
  "Suksess": "Success",
  "Advarsel": "Warning",
  "Info": "Info",
  "Ja": "Yes",
  "Nei": "No",
  "Søk": "Search",
  "Søkeresultat": "Search Results",
  "Ingen treff": "No results",
  "Vis mer": "Show more",
  "Vis færre": "Show less",
  "Mer": "More",
  "Mindre": "Less",
  "Neste": "Next",
  "Forrige": "Previous",
  "Første": "First",
  "Siste": "Last",
  "Last inn mer": "Load more",
  "Laster...": "Loading...",
  "Lagre": "Save",
  "Avbryt": "Cancel",
  "Slett": "Delete",
  "Rediger": "Edit",
  "Opprett": "Create",
  "Ny": "New",
  "Nytt": "New",
  "Kopier": "Copy",
  "Lim inn": "Paste",
  "Klipp ut": "Cut",
  "Ferdig": "Done",
  "Lukk": "Close",
  "Åpne": "Open",
  "Vis": "Show",
  "Skjul": "Hide",
  "Sideoppsett": "Page Layout",
  "Standard": "Default",
  "Mal": "Template",
  "Konfigurasjon": "Configuration",
  "Innstillinger": "Settings",
  "Global": "Global",
  "Lokalt": "Local",
  "Status": "Status",
  "Utkast": "Draft",
  "Publisert versjon": "Published version",
  "Endringer": "Changes",
  "Historikk": "History",
  "Avansert": "Advanced",
  "Enkel": "Simple",
  "Bruker": "User",
  "Rolle": "Role",
  "Rettigheter": "Permissions",
  "Tema": "Theme",
  "Farge": "Color",
  "Farger": "Colors",
  "Skrift": "Font",
  "Stil": "Style",
  "Stiler": "Styles",
  "Layout": "Layout",
  "Topptekst": "Header",
  "Bunntekst": "Footer",
  "Meny": "Menu",
  "Navigasjon": "Navigation",
  "Lenker": "Links",
  "Sosiale medier": "Social Media",
  "Facebook": "Facebook",
  "Instagram": "Instagram",
  "LinkedIn": "LinkedIn",
  "YouTube": "YouTube",
  "Twitter": "Twitter",
  "Nyhetsbrev": "Newsletter",
  "Abonner": "Subscribe",
  "Takk": "Thank you",
  "Bekreftelse": "Confirmation",
  "Feil": "Error",
  "Ukjent feil": "Unknown error",
  "Pris": "Price",
  "Kostnad": "Cost",
  "Valuta": "Currency",
  "Rabatt": "Discount",
  "Kampanje": "Campaign",
  "Tilbud": "Offer",
  "Gratis": "Free",
  "Mva": "VAT",
  "Ekskl. mva": "Excl. VAT",
  "Inkl. mva": "Incl. VAT",
  "Total": "Total",
  "Betaling": "Payment",
  "Kort": "Card",
  "Faktura": "Invoice",
  "Vipps": "Vipps",
  "Konto": "Account",
  "Kunde": "Customer",
  "Pasient": "Patient",
  "Ansatt": "Employee",
  "Lege": "Doctor",
  "Kirurg": "Surgeon",
  "Gynekolog": "Gynecologist",
  "Urolog": "Urologist",
  "Hudlege": "Dermatologist",
  "Fostermedisiner": "Fetal Medicine Specialist",
  "Jordmor": "Midwife",
  "Fysioterapeut": "Physiotherapist",
  "Ernæringsfysiolog": "Nutritionist",
  "Sexolog": "Sexologist",
  "Psykolog": "Psychologist",
  "Osteopat": "Osteopath",
  "Sykepleier": "Nurse",
  "Resepsjonist": "Receptionist",
  "Spesialistutdanning": "Specialist Education",
  "Erfaring": "Experience",
  "Utdanning": "Education",
  "Kompetanse": "Competence",
  "Medlemskap": "Membership",
  "Språk": "Languages",
  "Norsk": "Norwegian",
  "Engelsk": "English",
  "Tysk": "German",
  "Fransk": "French",
  "Spansk": "Spanish",
  "Kjønn": "Gender",
  "Mann": "Male",
  "Kvinne": "Female",
  "Fødselsdato": "Date of Birth",
  "Personnummer": "Social Security Number",
  "Nasjonalitet": "Nationality",
  "Land": "Country",
  "Postnummer": "Postal Code",
  "Poststed": "City",
  "Kommune": "Municipality",
  "Fylke": "County",
  "Kart": "Map",
  "Marker": "Marker",
  "Zoom": "Zoom",
  "Senter": "Center",
  "Område": "Area",
  "Sted": "Location",
  "Steder": "Locations",
  "Sone": "Zone",
  "Klinikknavn": "Clinic Name",
  "Klinikkinformasjon": "Clinic Information",
  "Avdeling": "Department",
  "Behandlingsrom": "Treatment Room",
  "Kapasitet": "Capacity",
  "Kalender": "Calendar",
  "Tidspunkt": "Time slot",
  "Datoer": "Dates",
  "Tider": "Times",
  "Ledig": "Available",
  "Opptatt": "Busy",
  "Reservert": "Reserved",
  "Bekreft": "Confirm",
  "Avvis": "Decline",
  "Endre": "Change",
  "Flytt": "Reschedule",
  "Avbestill": "Cancel Booking",
  "Siste sjanse": "Last chance",
  "Viktig": "Important",
  "Obs": "Note",
  "Merk": "Note",
  "Tips": "Tip",
  "Advarsel": "Warning",
  "Fare": "Danger",
  "Info": "Info",
  "Hjelp": "Help",
  "Dokumentasjon": "Documentation",
  "Støtte": "Support",
  "FAQ & hjelp": "FAQ & Help",
  "Søk i hjelp": "Search help",
  "Kontakt support": "Contact Support",
}

async function translateViaMyMemory(text: string): Promise<string> {
  const q = encodeURIComponent(text.slice(0, 450))
  const url = `https://api.mymemory.translated.net/get?q=${q}&langpair=no%7Cen`
  const res = await fetch(url)
  if (!res.ok) throw new Error(`MyMemory HTTP ${res.status}`)
  const json = await res.json()
  return json?.responseData?.translatedText || ''
}

async function run() {
  if (!fs.existsSync(INPUT_FILE)) {
    console.error(`Input file not found at: ${INPUT_FILE}`)
    process.exit(1)
  }

  const strings = JSON.parse(fs.readFileSync(INPUT_FILE, 'utf8')) as string[]
  console.log(`Loaded ${strings.length} unique schema UI strings.`)

  const translations: Record<string, string> = {}
  
  // Load existing translations if output file already exists
  if (fs.existsSync(OUTPUT_FILE)) {
    try {
      const existing = JSON.parse(fs.readFileSync(OUTPUT_FILE, 'utf8'))
      Object.assign(translations, existing)
      console.log(`Loaded ${Object.keys(translations).length} existing translations from ${OUTPUT_FILE}`)
    } catch (e) {
      console.warn(`Could not load existing translations: ${(e as Error).message}`)
    }
  }

  let count = 0
  for (const s of strings) {
    const trimmed = s.trim()
    if (!trimmed) continue
    
    // Skip if already translated/stored
    if (translations[trimmed]) {
      continue
    }

    // Check local dictionary first (case insensitive match, but preserve case in output)
    const matchedKey = Object.keys(LOCAL_DICTIONARY).find(k => k.toLowerCase() === trimmed.toLowerCase())
    if (matchedKey) {
      translations[trimmed] = LOCAL_DICTIONARY[matchedKey]
      continue
    }

    // Skip if purely numerical/symbols
    if (/^[\d:\s–—\-_.,()'"/?&!@#%*+=\[\]]+$/.test(trimmed)) {
      translations[trimmed] = trimmed
      continue
    }

    let retries = 3
    let success = false
    while (retries > 0 && !success) {
      try {
        console.log(`Querying MyMemory for: "${trimmed.slice(0, 45)}..."`)
        // Add 1.5s delay to be extremely friendly to MyMemory free API
        await new Promise(r => setTimeout(r, 1500))
        const translated = await translateViaMyMemory(trimmed)
        if (translated) {
          translations[trimmed] = translated
        } else {
          translations[trimmed] = trimmed // fallback
        }
        success = true
        count++
        if (count % 20 === 0) {
          fs.writeFileSync(OUTPUT_FILE, JSON.stringify(translations, null, 2), 'utf8')
          console.log(`Progress: Translated ${count} new strings...`)
        }
      } catch (e) {
        const msg = (e as Error).message || ''
        console.warn(`[MyMemory Warning] Error translating "${trimmed.slice(0, 40)}...": ${msg}. Retrying in 5s...`)
        await new Promise(r => setTimeout(r, 5000))
        retries--
      }
    }

    if (!success) {
      console.warn(`Failed to translate "${trimmed}" via MyMemory. Using original value as fallback.`)
      translations[trimmed] = trimmed
    }
  }

  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(translations, null, 2), 'utf8')
  console.log(`Successfully completed! Total translated strings: ${Object.keys(translations).length}`)
}

run().catch(console.error)
