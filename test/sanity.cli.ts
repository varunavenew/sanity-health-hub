import {config as loadEnv} from 'dotenv'
import path from 'path'
import {defineCliConfig} from 'sanity/cli'
import {requireSanityDataset, requireSanityProjectId} from './sanity/dataset-env'

// Ensure local env is loaded before fail-fast checks (CLI entry).
loadEnv({path: path.join(__dirname, '.env.local')})
loadEnv({path: path.join(__dirname, '..', '.env.local')})

export default defineCliConfig({
  api: {
    projectId: requireSanityProjectId(),
    dataset: requireSanityDataset(),
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
