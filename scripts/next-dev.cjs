/**
 * Start Next.js dev server using ONLY this project's node_modules.
 * Prevents invalid hook calls when a parent folder (e.g. Documents/) has another React copy.
 *
 * Important:
 * - Use `--require=` (long form), never short `-r`. Next.js re-spawns the server and
 *   rewrites short `-r` into `NODE_OPTIONS=--r=...`, which Node rejects.
 * - Resolve the project root via realpath so Windows path casing stays canonical
 *   (mixed `D:\` / `d:\` duplicates Next client modules and throws
 *   "invariant expected layout router to be mounted").
 */
const { spawnSync } = require("child_process");
const fs = require("fs");
const path = require("path");

require("./check-react-conflict.cjs");

const projectRoot = fs.realpathSync(path.resolve(__dirname, ".."));
const patchScript = path.join(projectRoot, "scripts", "patch-react-resolution.cjs");
const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");

/** Strip -r/--require from inherited NODE_OPTIONS; we pass --require on argv. */
function envWithoutRequireFlags(env) {
  const nextEnv = { ...env };
  const raw = nextEnv.NODE_OPTIONS;
  if (typeof raw !== "string" || !raw.trim()) {
    delete nextEnv.NODE_OPTIONS;
    return nextEnv;
  }
  const cleaned = raw
    .replace(/(?:^|\s)(?:--require|-r)(?:=|\s+)\S+/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  if (cleaned) nextEnv.NODE_OPTIONS = cleaned;
  else delete nextEnv.NODE_OPTIONS;
  return nextEnv;
}

const result = spawnSync(
  process.execPath,
  [`--require=${patchScript}`, nextBin, "dev", "--webpack"],
  {
    cwd: projectRoot,
    stdio: "inherit",
    env: envWithoutRequireFlags(process.env),
  },
);

if (result.status !== 0 && result.stderr) {
  const msg = result.stderr.toString();
  if (msg.includes("vendor-chunks/@sanity")) {
    console.error(
      "\nTip: run `npm run dev:clean` to clear a stale .next cache, then retry.\n",
    );
  }
}

process.exit(result.status ?? 1);
