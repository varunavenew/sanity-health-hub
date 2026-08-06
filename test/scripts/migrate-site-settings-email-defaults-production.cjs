/**
 * Run Email Settings seed against the production dataset (Windows-safe).
 *
 * Bash-style prefixes like `ALLOW_PRODUCTION_MIGRATION=true SANITY_DATASET_FORCE=production`
 * do NOT work in PowerShell/cmd. This wrapper sets env before spawning the migration,
 * and wins over test/.env.local developer values via SANITY_DATASET_FORCE.
 *
 * Usage:
 *   cd test && npm run migrate:site-settings-email-defaults:production:dry
 *   cd test && npm run migrate:site-settings-email-defaults:production
 */
const {spawnSync} = require('child_process')
const path = require('path')

const testDir = path.resolve(__dirname, '..')
const dryRun = process.argv.includes('--dry-run')

const env = {
  ...process.env,
  ALLOW_PRODUCTION_MIGRATION: 'true',
  SANITY_DATASET_FORCE: 'production',
  SANITY_STUDIO_FORCE_DATASET: 'production',
  SANITY_DATASET: 'production',
  SANITY_STUDIO_DATASET: 'production',
  NEXT_PUBLIC_SANITY_DATASET: 'production',
  ...(dryRun ? {DRY_RUN: '1'} : {DRY_RUN: ''}),
}

console.log('')
console.log('Email Settings migration → production dataset')
console.log('  ALLOW_PRODUCTION_MIGRATION=true')
console.log('  SANITY_DATASET_FORCE=production')
console.log(`  DRY_RUN=${dryRun ? '1' : '0'}`)
console.log('')

const result = spawnSync(
  'npx',
  ['tsx', 'sanity/migrate-site-settings-email-defaults.ts'],
  {
    cwd: testDir,
    env,
    stdio: 'inherit',
    shell: true,
  },
)

process.exit(result.status ?? 1)
