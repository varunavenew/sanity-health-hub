import type {enUSStudioResources} from './resources.en-US'

/** Norwegian Bokmål strings for CMedical's own Studio inputs and document actions. */
export const nbNOStudioResources: Record<keyof typeof enUSStudioResources, string> = {
  'location-search.title': 'Stedssøk',
  'location-search.placeholder': 'Søk etter sted',
  'location-search.load-failed': 'Kunne ikke laste Google Maps',

  'patientsky.search-placeholder': 'Skriv for å søke etter spesialist i Patientsky',
  'patientsky.needs-clinic':
    'Velg en klinikk med serviceProviderID for å søke etter spesialister',

  'news-filter.help':
    'Velg én eller flere av de fire artikkelkategoriene. La feltet stå tomt kun for Alle-filteret.',

  'sharing-image.title': 'Delingsbilde (automatisk)',
  'sharing-image.description':
    'Sidens {{hero}} brukes i forhåndsvisninger på Google og i sosiale medier. Slå på «Bruk et annet delingsbilde» nedenfor bare når du trenger et annet bilde.',
  'sharing-image.current': 'Nåværende {{hero}}',
  'sharing-image.empty':
    'Denne siden har ingen hovedbilde ennå — legg til ett i Innhold-fanen, eller slå på eget delingsbilde nedenfor.',
  'sharing-image.unavailable':
    'Denne siden har ingen hovedbilde. Slå på «Bruk et annet delingsbilde» nedenfor for å laste opp ett, ellers brukes logoen til nettstedet.',
  'sharing-image.hero.profile': 'profil-/hovedbilde',
  'sharing-image.hero.banner': 'bannerbilde',
  'sharing-image.hero.media': 'hovedbilde',
  'sharing-image.hero.article': 'artikkelbilde',
  'sharing-image.hero.default': 'hovedbilde',

  'nav-sync.updated.title': 'Menylenker oppdatert',
  'nav-sync.failed.title': 'Kunne ikke oppdatere menylenker',
  'nav-sync.failed.unknown': 'Ukjent feil',

  'specialist-delete.fallback-label': 'Slett',
  'specialist-delete.busy': 'Fjerner spesialisten fra relaterte dokumenter…',
  'specialist-delete.confirm':
    'Vil du slette «{{name}}»? Relaterte dokumenter oppdateres automatisk først.',
  'specialist-delete.success.title': 'Spesialist slettet',
  'specialist-delete.success.description':
    'Spesialisten ble fjernet fra alle relaterte dokumenter og slettet.',
  'specialist-delete.error.title': 'Kunne ikke slette spesialisten',

  'translate-en.label': 'Oversett til engelsk',
  'translate-en.running': 'Oversetter…',
  'translate-en.no-content': 'Ingen innhold å oversette',
  'translate-en.nothing.title': 'Ingenting å oversette',
  'translate-en.nothing.description': 'Alle engelske felt har allerede verdier.',
  'translate-en.nothing-found': 'Fant ingenting som kan oversettes',
  'translate-en.progress.title': 'Oversetter {{fields}} felt…',
  'translate-en.progress.description': '{{segments}} tekstsegmenter via Lovable AI',
  'translate-en.failed.title': 'Oversettelsen mislyktes',
  'translate-en.complete.title': 'Oversettelsen er fullført',
  'translate-en.complete.description':
    'Oppdaterte {{fields}} felt. Se gjennom og publiser.',
  'translate-en.apply-failed.title': 'Kunne ikke lagre oversettelsene',
}
