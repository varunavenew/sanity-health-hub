// Lightweight Portable Text for short CMS descriptions (paragraphs, lists, links).
import { BlockContentIcon } from './icons'

export default {
  name: 'simpleBlockContent',
  icon: BlockContentIcon,
  title: 'Text editor',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [{ title: 'Normal', value: 'normal' }],
      lists: [
        { title: 'Bullet list', value: 'bullet' },
        { title: 'Numbered list', value: 'number' },
      ],
      marks: {
        decorators: [
          { title: 'Bold', value: 'strong' },
          { title: 'Italic', value: 'em' },
        ],
        annotations: [
          {
            name: 'link',
            title: 'Link',
            type: 'object',
            fields: [
              {
                name: 'href',
                title: 'URL',
                type: 'string',
                description: 'Internal path (/gynekologi/urinlekkasje) or full URL (https://…).',
              },
              {
                name: 'blank',
                title: 'Open in new tab',
                type: 'boolean',
                initialValue: false,
              },
            ],
          },
        ],
      },
    },
  ],
}
