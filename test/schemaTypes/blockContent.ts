// Schema: Block Content (rik tekst)
// Gjenbrukbart Portable Text-skjema for brødtekst
import { BlockContentIcon } from './icons'

export default {
  name: 'blockContent',
  icon: BlockContentIcon,
  title: 'Rik tekst',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
        { title: 'Overskrift 2', value: 'h2' },
        { title: 'Overskrift 3', value: 'h3' },
        { title: 'Overskrift 4', value: 'h4' },
        { title: 'Sitat', value: 'blockquote' },
      ],
      lists: [
        { title: 'Punktliste', value: 'bullet' },
        { title: 'Nummerert liste', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Fet', value: 'strong' },
          { title: 'Kursiv', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'Lenke',
            type: 'object',
            fields: [
              { name: 'href', title: 'URL', type: 'url' },
              {
                name: 'blank',
                title: 'Åpne i ny fane',
                type: 'boolean',
                initialValue: false,
              },
            ],
          },
        ],
      },
    },
    {
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt-tekst', type: 'string' },
        { name: 'caption', title: 'Bildetekst', type: 'string' },
      ],
    },
  ],
}
