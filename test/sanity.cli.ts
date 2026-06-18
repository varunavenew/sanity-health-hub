import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID || '9jhqpk3a',
    dataset: process.env.SANITY_DATASET || 'production'
  },
  project: {
    basePath: process.env.SANITY_STUDIO_BASEPATH || '/',
  },
  deployment: {
    appId: 'to7hn3scwy01eu1t57n4g49w',
    autoUpdates: true,
  },
  studioHost: 'cmedical-v2',
})
