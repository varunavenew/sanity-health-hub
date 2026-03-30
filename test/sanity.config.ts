import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'
import {SpecialistIcon} from './schemaTypes/icons'

const hiddenTypes = ['specialist', 'specialistsPage']

export default defineConfig({
  name: 'default',
  title: 'sanity',

  projectId: process.env.SANITY_PROJECT_ID || '9jhqpk3a',
  dataset: process.env.SANITY_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S, context) => {
        const otherItems = S.documentTypeListItems().filter(
          (item) => !hiddenTypes.includes(item.getId() || '')
        )
        const mid = Math.floor(otherItems.length / 2)
        const specialistsItem = S.listItem()
          .title('Specialists')
          .icon(SpecialistIcon)
          .child(
            S.list()
              .title('Specialists')
              .items([
                S.listItem()
                  .title('About our specialists')
                  .icon(SpecialistIcon)
                  .child(
                    S.document()
                      .schemaType('specialistsPage')
                      .documentId('specialistsPage')
                  ),
                S.documentTypeListItem('specialist').title('Our specialists'),
              ])
          )
        return S.list()
          .title('Content')
          .items([
            ...otherItems.slice(0, mid),
            specialistsItem,
            ...otherItems.slice(mid),
          ])
      },
    }),
    visionTool(),
  ],

  schema: {
    types: schemaTypes,
  },
})
