/**
 * Dry-run clinic email migration (Windows-safe).
 */
const {spawnSync} = require('child_process')
const path = require('path')

const testDir = path.resolve(__dirname, '..')

const result = spawnSync('npx', ['tsx', 'sanity/migrate-clinic-emails.ts'], {
  cwd: testDir,
  env: {...process.env, DRY_RUN: '1'},
  stdio: 'inherit',
  shell: true,
})

process.exit(result.status ?? 1)
