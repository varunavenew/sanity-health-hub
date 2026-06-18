import {defineType} from 'sanity'
import {LocationSearchInput} from '../sanity/components/LocationSearchInput'

export const locationSearchType = defineType({
  name: 'locationSearch',
  title: 'Location Search',
  type: 'object',
  components: {
    input: LocationSearchInput,
  },
  fields: [
    {
      name: 'placeId',
      title: 'Place Id',
      type: 'string',
      description: 'Search for a location in the map to get the Place ID',
      readOnly: true,
    },
    {
      name: 'lat',
      title: 'Latitude',
      type: 'number',
      description: 'Search for a location in the map to get the correct coordinates',
    },
    {
      name: 'lng',
      title: 'Longitude',
      type: 'number',
    },
    {
      name: 'alt',
      title: 'Altitude',
      type: 'number',
    },
  ],
})
