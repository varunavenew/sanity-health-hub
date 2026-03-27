// Schema: Job Listing
// Stillingsannonser for karrieresiden

export default {
  name: 'jobListing',
  title: 'Stillingsannonse',
  type: 'document',
  icon: () => '💼',
  fields: [
    {
      name: 'title',
      title: 'Stillingstittel',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'URL-slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'department',
      title: 'Avdeling / Fagområde',
      type: 'string',
      options: {
        list: [
          { title: 'Gynekologi', value: 'gynekologi' },
          { title: 'Fertilitet', value: 'fertilitet' },
          { title: 'Urologi', value: 'urologi' },
          { title: 'Ortopedi', value: 'ortopedi' },
          { title: 'Hud', value: 'hud' },
          { title: 'Administrasjon', value: 'administrasjon' },
          { title: 'IT / Teknologi', value: 'it' },
          { title: 'Annet', value: 'annet' },
        ],
      },
    },
    {
      name: 'location',
      title: 'Arbeidssted',
      type: 'string',
      description: 'F.eks. "Oslo Majorstuen", "Bekkestua", "Moss"',
    },
    {
      name: 'employmentType',
      title: 'Stillingstype',
      type: 'string',
      options: {
        list: [
          { title: 'Fast stilling', value: 'fast' },
          { title: 'Deltid', value: 'deltid' },
          { title: 'Vikar', value: 'vikar' },
          { title: 'Engasjement', value: 'engasjement' },
        ],
      },
    },
    {
      name: 'excerpt',
      title: 'Kort beskrivelse',
      type: 'text',
      rows: 3,
      description: 'Vises i stillingslisten',
    },
    {
      name: 'body',
      title: 'Full beskrivelse',
      type: 'blockContent',
    },
    {
      name: 'publishedAt',
      title: 'Publiseringsdato',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    },
    {
      name: 'deadline',
      title: 'Søknadsfrist',
      type: 'date',
      description: 'La stå tom for "Løpende"',
    },
    {
      name: 'contactName',
      title: 'Kontaktperson',
      type: 'string',
    },
    {
      name: 'contactEmail',
      title: 'Kontakt e-post',
      type: 'string',
    },
    {
      name: 'contactPhone',
      title: 'Kontakt telefon',
      type: 'string',
    },
    {
      name: 'applyUrl',
      title: 'Søknadslenke (ekstern)',
      type: 'url',
      description: 'Ekstern URL for søknadsskjema. La stå tom om søknad sendes på e-post.',
    },
    {
      name: 'active',
      title: 'Aktiv',
      type: 'boolean',
      initialValue: true,
      description: 'Deaktiver for å skjule stillingen uten å slette den.',
    },
  ],
  orderings: [
    {
      title: 'Publiseringsdato (nyeste først)',
      name: 'publishedAtDesc',
      by: [{ field: 'publishedAt', direction: 'desc' }],
    },
  ],
  preview: {
    select: {
      title: 'title',
      subtitle: 'location',
      active: 'active',
    },
    prepare({ title, subtitle, active }: any) {
      return {
        title: `${active === false ? '🔴 ' : ''}${title}`,
        subtitle: subtitle || 'Ingen lokasjon',
      };
    },
  },
};
