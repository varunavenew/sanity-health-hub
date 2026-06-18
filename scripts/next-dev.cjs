/**
 * Start Next.js dev server using ONLY this project's node_modules.
 * Prevents invalid hook calls when a parent folder (e.g. Documents/) has another React copy.
 */
const { spawnSync } = require("child_process");
const path = require("path");

require("./check-react-conflict.cjs");

const projectRoot = path.resolve(__dirname, "..");
const patchScript = path.join(__dirname, "patch-react-resolution.cjs");
const nextBin = path.join(projectRoot, "node_modules", "next", "dist", "bin", "next");

const result = spawnSync(
  process.execPath,
  ["-r", patchScript, nextBin, "dev"],
  {
    cwd: projectRoot,
    stdio: "inherit",
    env: process.env,
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
