import * as fs from 'fs'
import * as path from 'path'

const STRINGS_FILE = path.join(__dirname, '..', 'schema_strings.json')
const TRANSLATIONS_FILE = path.join(__dirname, '..', 'schema_translations.json')
const UNTRANSLATED_FILE = path.join(__dirname, '..', 'untranslated_schemas.json')

function run() {
  const strings = JSON.parse(fs.readFileSync(STRINGS_FILE, 'utf8')) as string[]
  const translations = fs.existsSync(TRANSLATIONS_FILE) 
    ? JSON.parse(fs.readFileSync(TRANSLATIONS_FILE, 'utf8')) 
    : {}

  const LOCAL_DICTIONARY: Record<string, string> = {
    "Tittel": "Title", "Sidetittel": "Page Title", "Overskrift": "Heading",
    "Undertekst": "Subheading", "Undertittel": "Subtitle", "Beskrivelse": "Description",
    "Bilde": "Image", "Bakgrunnsbilde": "Background Image", "Ikon": "Icon",
    "Tekst": "Text", "Kategori": "Category", "Kategorier": "Categories",
    "Behandling": "Treatment", "Behandlinger": "Treatments", "Spesialist": "Specialist",
    "Spesialister": "Specialists", "Klinikk": "Clinic", "Klinikker": "Clinics",
    "Tjeneste": "Service", "Tjenester": "Services", "Adresse": "Address",
    "Telefon": "Phone", "E-post": "Email", "Navn": "Name", "Rolle": "Role",
    "Biografi": "Biography", "Anmeldelse": "Review", "Anmeldelser": "Reviews",
    "Auto": "Automatic", "Aktiv": "Active", "Alder": "Age", "By": "City",
    "Fotnote": "Footnote", "Verdi": "Value", "Tall": "Number", "Statistikk": "Statistics",
    "Etikett": "Label", "Generelt": "General", "Seksjoner": "Sections",
    "Pasientanmeldelser": "Patient Reviews", "SEO & meta": "SEO & Meta",
    "Synlighet": "Visibility", "Valgfritt": "Optional", "Påkrevd": "Required",
    "Knapp": "Button", "Knappetekst": "Button Text", "Lenke": "Link",
    "Lenketekst": "Link Text", "Spørsmål": "Question", "Svar": "Answer",
    "FAQ": "FAQ", "Ofte stilte spørsmål": "Frequently Asked Questions",
    "Se alle": "See all", "Les mer": "Read more", "Bestill time": "Book Appointment",
    "Bestill time (CTA)": "Book Appointment (CTA)", "Nyheter": "News",
    "Nyheter og artikler": "News and Articles", "Artikkel": "Article", "Artikler": "Articles",
    "Kvinnehelse": "Women's Health", "Mannehelse": "Men's Health", "Urologi": "Urology",
    "Gynekologi": "Gynecology", "Fertilitet": "Fertility", "Ortopedi": "Orthopedics",
    "Graviditet": "Pregnancy", "Fostermedisin": "Fetal Medicine", "Kikkhullsoperasjon": "Keyhole Surgery",
    "Robotassistert kirurgi": "Robot-Assisted Surgery", "Slik foregår det": "How it Works",
    "Forløp": "Process", "Ekspertområder": "Expertise", "Løfter": "Promises",
    "Om oss": "About Us", "Hjem": "Home", "Forside": "Homepage", "Priser": "Pricing",
    "Forsikring": "Insurance", "Karriere": "Careers", "Kontakt": "Contact",
    "Kontakt oss": "Contact Us", "Aktuelt": "News", "Alt-tekst": "Alt Text",
    "Bilde alt-tekst": "Image Alt Text", "Alt-tekst for bilde": "Alt text for image",
    "Bilde alt": "Image Alt", "Bilde — alt": "Image — Alt", "Bildetekst": "Caption",
    "Bildetekst (valgfritt)": "Caption (optional)", "Bilde (valgfritt)": "Image (optional)",
    "Breddegrad": "Latitude", "Lengdegrad": "Longitude", "Altitude": "Altitude",
    "Rekkefølge": "Sort Order", "Sortering": "Sorting", "Språk": "Language",
    "Tittel (språktilpasset)": "Title (i18n)", "Overskrift (språktilpasset)": "Heading (i18n)",
    "Brødtekst": "Body Text", "Avsnitt": "Paragraph", "Video": "Video",
    "Video-fil": "Video File", "Video-URL": "Video URL", "YouTube-video": "YouTube Video",
    "YouTube-ID": "YouTube ID", "Kilde": "Source", "Utgiver": "Publisher",
    "Dato": "Date", "Publisert": "Published", "Siste oppdatert": "Last Updated",
    "Forfatter": "Author", "Sammendrag": "Excerpt", "Metadata": "Metadata",
    "Meta-beskrivelse": "Meta Description", "Søkeord": "Keywords", "Tag": "Tag",
    "Tags": "Tags", "Etiketter": "Labels", "Logo": "Logo", "Link": "Link",
    "Sti": "Path", "Rute": "Route", "Slug": "Slug", "Tidsrom": "Time period",
    "Ukedager": "Weekdays", "Åpningstider": "Opening Hours", "Stengt": "Closed",
    "Vennligst fyll ut": "Please fill out", "Påkrevd felt": "Required field",
    "Feilmelding": "Error message", "Suksess": "Success", "Advarsel": "Warning",
    "Info": "Info", "Ja": "Yes", "Nei": "No", "Søk": "Search", "Søkeresultat": "Search Results",
    "Ingen treff": "No results", "Vis mer": "Show more", "Vis færre": "Show less",
    "Mer": "More", "Mindre": "Less", "Neste": "Next", "Forrige": "Previous",
    "Første": "First", "Siste": "Last", "Last inn mer": "Load more",
    "Laster...": "Loading...", "Lagre": "Save", "Avbryt": "Cancel", "Slett": "Delete",
    "Rediger": "Edit", "Opprett": "Create", "Ny": "New", "Nytt": "New",
    "Kopier": "Copy", "Lim inn": "Paste", "Klipp ut": "Cut", "Ferdig": "Done",
    "Lukk": "Close", "Åpne": "Open", "Vis": "Show", "Skjul": "Hide",
    "Sideoppsett": "Page Layout", "Standard": "Default", "Mal": "Template",
    "Konfigurasjon": "Configuration", "Innstillinger": "Settings", "Global": "Global",
    "Lokalt": "Local", "Status": "Status", "Utkast": "Draft", "Publisert versjon": "Published version",
    "Endringer": "Changes", "Historikk": "History", "Avansert": "Advanced", "Enkel": "Simple",
  }

  const untranslated: string[] = []
  for (const s of strings) {
    const trimmed = s.trim()
    if (!trimmed) continue
    
    // Check if in dictionary or existing translations
    const inDict = Object.keys(LOCAL_DICTIONARY).find(k => k.toLowerCase() === trimmed.toLowerCase())
    if (inDict || translations[trimmed]) {
      continue
    }

    if (/^[\d:\s–—\-_.,()'"/?&!@#%*+=\[\]]+$/.test(trimmed)) {
      continue
    }

    untranslated.push(trimmed)
  }

  fs.writeFileSync(UNTRANSLATED_FILE, JSON.stringify(untranslated, null, 2), 'utf8')
  console.log(`Wrote ${untranslated.length} remaining untranslated strings to ${UNTRANSLATED_FILE}`)
}

run()
